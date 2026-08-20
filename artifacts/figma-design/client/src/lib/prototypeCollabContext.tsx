/* =========================================================================
 * Fiber Workspace — Prototype Collaboration Context
 *
 * Carries the collaboration state shared between the floating action group
 * (rendered by PrototypeCollabOverlay) and the in-content comment layer
 * (PrototypeCommentLayer, mounted INSIDE the prototype's scrollable content
 * wrapper so pins scroll with the content).
 *
 * Figma-style commenting: the "Comments" button toggles COMMENT MODE; clicking
 * anywhere on the prototype drops a pin + inline composer. There is no central
 * "Add comment" dialog.
 * ========================================================================= */

import { createContext, useContext } from "react";
import type { Prototype, PrototypeVersion } from "@/lib/prototypeStore";
import type { PrototypeComment, CommentAnchor } from "@/lib/commentStore";

export interface PrototypeCollabContextValue {
  prototype: Prototype;
  viewedVersion: PrototypeVersion;
  /** Whether comment mode is active (click-to-pin). */
  commentMode: boolean;
  /** Comments for the CURRENTLY VIEWED version that have a valid anchor. */
  markers: PrototypeComment[];
  /** Distinct known commenter names (for the composer's name select). */
  authors: string[];
  /** Persist a new pinned comment against the viewed version. */
  addComment: (author: string, text: string, anchor: CommentAnchor) => void;
  /** Delete a comment by id. */
  removeComment: (id: string) => void;
}

const PrototypeCollabContext =
  createContext<PrototypeCollabContextValue | null>(null);

export const PrototypeCollabProvider = PrototypeCollabContext.Provider;

/**
 * Consume the collaboration context. Returns null when the prototype is
 * rendered WITHOUT the collaboration overlay (e.g. the public /share view), so
 * the comment layer renders nothing there.
 */
export function usePrototypeCollab(): PrototypeCollabContextValue | null {
  return useContext(PrototypeCollabContext);
}
