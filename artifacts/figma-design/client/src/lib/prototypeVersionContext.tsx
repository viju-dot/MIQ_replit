/* =========================================================================
 * MIQ Collaborative Frameworks — Prototype Version Context
 *
 * Single source of truth for "which version am I viewing" while a prototype is
 * rendered full-screen with the collaboration overlay. The overlay/wrapper
 * PROVIDES this context; the prototype renderer (e.g. TvAudienceApp) CONSUMES
 * it so version switching actually drives what is rendered — not just a chip.
 *
 * Deliberately simple (no branching / Git-like features): versions are the
 * append-only snapshots from prototypeStore; selection is view-state only and
 * never mutates stored versions.
 * ========================================================================= */

import { createContext, useContext } from "react";
import type { Prototype, PrototypeVersion } from "@/lib/prototypeStore";

export interface PrototypeVersionContextValue {
  /** The prototype being viewed. */
  prototype: Prototype;
  /** The version currently being viewed (never null — falls back to newest). */
  viewedVersion: PrototypeVersion;
  /** Whether the viewed version is the newest (live) one. */
  isNewest: boolean;
  /** Switch the viewed version (view-state only; also persists to session). */
  setViewedVersionId: (id: string) => void;
}

const PrototypeVersionContext =
  createContext<PrototypeVersionContextValue | null>(null);

export const PrototypeVersionProvider = PrototypeVersionContext.Provider;

/**
 * Consume the version context. Returns null when a prototype is rendered
 * WITHOUT the collaboration overlay (e.g. the public /share view), so callers
 * can render a plain, version-unaware experience.
 */
export function usePrototypeVersion(): PrototypeVersionContextValue | null {
  return useContext(PrototypeVersionContext);
}
