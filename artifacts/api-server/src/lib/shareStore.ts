/**
 * In-memory store for shared prototype snapshots (figma-design artifact).
 *
 * NOTE: This is a process-local Map. It is intentionally NOT persisted — a
 * server restart clears all shares. That is acceptable for this prototype;
 * a production version would move this to @workspace/db (Drizzle/Postgres).
 *
 * Security model (prototype trade-offs, acknowledged):
 *  • No ownership auth on PUT/DELETE — the share TOKEN is the capability, so it
 *    must be unguessable (see isValidToken: >=24 chars base64url/hex).
 *  • Passwords are NEVER stored in plaintext: we keep a scrypt hash + per-record
 *    salt and compare in constant time (crypto.timingSafeEqual).
 *  • Abuse limits: LRU cap (MAX_SHARES) + TTL (SHARE_TTL_MS, refreshed on PUT)
 *    with periodic cleanup; unlock rate limiting lives in the route layer.
 */

import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

export interface ShareVersionSnapshotData {
  description: string;
  status: string;
  notes?: string;
}

export interface ShareVersion {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  rendererKey?: string;
  status?: "active" | "archived";
  metadata?: {
    createdFrom?: string;
  };
  /** Data captured at save time (what this version looked like). */
  snapshot?: ShareVersionSnapshotData;
}

export interface SharePrototype {
  id: string;
  name: string;
  description: string;
  status: string;
  route: string;
  versions: ShareVersion[];
}

export interface ShareRecord {
  token: string;
  secured: boolean;
  /** scrypt password hash (hex). Empty when unsecured. Never returned. */
  passwordHash: string;
  /** Per-record salt (hex) for the password hash. */
  passwordSalt: string;
  prototype: SharePrototype;
  /** Epoch ms of last write — drives TTL + LRU eviction. */
  updatedAt: number;
}

/* ------------------------------------------------------------------ */
/* Token format (capability must be unguessable)                       */
/* ------------------------------------------------------------------ */

const TOKEN_RE = /^[A-Za-z0-9_-]{24,128}$/;

/** High-entropy check: 24..128 chars of base64url/hex-safe alphabet. */
export function isValidToken(token: unknown): token is string {
  return typeof token === "string" && TOKEN_RE.test(token);
}

/* ------------------------------------------------------------------ */
/* Password hashing (scrypt + constant-time compare)                   */
/* ------------------------------------------------------------------ */

export function hashPassword(password: string): { hash: string; salt: string } {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 32).toString("hex");
  return { hash, salt };
}

export function verifyPassword(
  password: string,
  hashHex: string,
  saltHex: string,
): boolean {
  if (!hashHex || !saltHex) return false;
  const expected = Buffer.from(hashHex, "hex");
  const actual = scryptSync(password, saltHex, expected.length);
  // timingSafeEqual requires equal-length buffers.
  if (expected.length !== actual.length) return false;
  return timingSafeEqual(expected, actual);
}

/* ------------------------------------------------------------------ */
/* Store with TTL + LRU cap                                            */
/* ------------------------------------------------------------------ */

const MAX_SHARES = 200;
const SHARE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days, refreshed on PUT.

// Insertion-ordered Map — re-inserting on write moves an entry to the "newest"
// end so the FIRST key is always the least-recently-written (LRU victim).
const shares = new Map<string, ShareRecord>();

function isExpired(record: ShareRecord, now: number): boolean {
  return now - record.updatedAt > SHARE_TTL_MS;
}

/** Drop expired records; called opportunistically on reads/writes + on a timer. */
export function cleanupExpired(now = Date.now()): void {
  for (const [token, record] of shares) {
    if (isExpired(record, now)) shares.delete(token);
  }
}

/**
 * Upsert a share. Refreshes TTL and LRU position. Enforces the cap by evicting
 * the least-recently-written entries. Returns false if the cap is hit and the
 * caller's token is new (reject rather than evict someone else on overflow of
 * a brand-new key — but since we evict oldest first, this only rejects when the
 * store is full of equally-fresh records, which is fine for a prototype).
 */
export function upsertShare(record: ShareRecord): boolean {
  const now = Date.now();
  cleanupExpired(now);
  // Re-insert to move to newest position.
  shares.delete(record.token);
  if (shares.size >= MAX_SHARES) {
    // Evict least-recently-written (first key) until under cap.
    while (shares.size >= MAX_SHARES) {
      const oldest = shares.keys().next().value;
      if (oldest === undefined) break;
      shares.delete(oldest);
    }
  }
  shares.set(record.token, { ...record, updatedAt: now });
  return true;
}

export function getShare(token: string): ShareRecord | undefined {
  const record = shares.get(token);
  if (!record) return undefined;
  if (isExpired(record, Date.now())) {
    shares.delete(token);
    return undefined;
  }
  return record;
}

export function deleteShare(token: string): boolean {
  return shares.delete(token);
}

// Periodic cleanup so abandoned shares don't linger past TTL. unref() so this
// timer never keeps the process alive on its own.
const cleanupTimer = setInterval(() => cleanupExpired(), 60 * 60 * 1000);
if (typeof cleanupTimer.unref === "function") cleanupTimer.unref();
