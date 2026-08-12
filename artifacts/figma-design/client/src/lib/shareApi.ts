/**
 * Client for the shared Express API server (artifacts/api-server), reachable
 * same-origin at the "/api" path prefix (its artifact.toml proxies /api).
 *
 * IMPORTANT: figma-design's BASE_PATH is "/", so these are root-relative
 * "/api/shares/..." URLs. (Do NOT prefix with import.meta.env.BASE_URL here —
 * that is for THIS artifact's static assets, not the sibling API service.)
 *
 * Share persistence lives server-side so a share link works in ANY browser,
 * not just the authoring browser's localStorage.
 */

import type { Prototype } from "./prototypeStore";

/** The prototype snapshot sent to / returned from the server. */
export interface ShareSnapshot {
  id: string;
  name: string;
  description: string;
  status: string;
  route: string;
  versions: Prototype["versions"];
}

function toSnapshot(p: Prototype): ShareSnapshot {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    status: p.status,
    route: p.route,
    versions: p.versions,
  };
}

/** Upsert a share snapshot. Throws on non-2xx so callers can surface an error. */
export async function putShare(
  token: string,
  secured: boolean,
  password: string,
  prototype: Prototype,
): Promise<void> {
  const res = await fetch(`/api/shares/${encodeURIComponent(token)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secured, password, prototype: toSnapshot(prototype) }),
  });
  if (!res.ok) throw new Error(`Failed to sync share (${res.status})`);
}

/** Delete a share (sharing disabled). Throws on non-2xx. */
export async function deleteShare(token: string): Promise<void> {
  const res = await fetch(`/api/shares/${encodeURIComponent(token)}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error(`Failed to remove share (${res.status})`);
}

export interface ShareMeta {
  exists: boolean;
  secured: boolean;
}

/** Existence + security metadata only (never password / data for secured). */
export async function getShareMeta(token: string): Promise<ShareMeta> {
  const res = await fetch(`/api/shares/${encodeURIComponent(token)}`);
  if (!res.ok) throw new Error(`Failed to load share (${res.status})`);
  return (await res.json()) as ShareMeta;
}

/** Thrown when the server rate-limits unlock attempts (HTTP 429). */
export class ShareRateLimitError extends Error {}

/**
 * Unlock a share and receive its prototype snapshot. Returns null on 401
 * (wrong password) or 404 (missing). Password is verified server-side and is
 * never returned to the client.
 */
export async function unlockShare(
  token: string,
  password: string,
): Promise<ShareSnapshot | null> {
  const res = await fetch(`/api/shares/${encodeURIComponent(token)}/unlock`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (res.status === 401 || res.status === 404) return null;
  if (res.status === 429)
    throw new ShareRateLimitError(
      "Too many attempts. Please wait a minute and try again.",
    );
  if (!res.ok) throw new Error(`Failed to unlock share (${res.status})`);
  const data = (await res.json()) as { prototype: ShareSnapshot };
  return data.prototype;
}
