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
import type {
  PrototypeComment,
  CommentAnchor,
  CommentAttachment,
} from "@/lib/commentStore";
import type {
  DesignAnnotation,
  AnnotationPatch,
  NewAnnotationInput,
} from "@/lib/annotationStore";

export interface PrototypeCollabContextValue {
  prototype: Prototype;
  viewedVersion: PrototypeVersion;
  /** Whether comment mode is active (click-to-pin). */
  commentMode: boolean;
  /** Whether Design Annotation mode is active (drag-to-select region). */
  annotationMode: boolean;
  /** Enter comment mode at a specific anchor (used by "Comment instead" §15). */
  startCommentAt: (anchor: CommentAnchor) => void;
  /** Design Annotations for the CURRENTLY VIEWED version (chronological). */
  annotations: DesignAnnotation[];
  /**
   * Persist a new annotation against the viewed version. `region` is null for a
   * page-level annotation. Returns the created annotation, or null on failure
   * (e.g. localStorage quota).
   */
  addAnnotation: (
    input: Omit<
      NewAnnotationInput,
      "prototypeId" | "versionId" | "versionName"
    >,
  ) => DesignAnnotation | null;
  /** Patch an existing annotation (edit / move / resize / status). */
  updateAnnotation: (id: string, patch: AnnotationPatch) => void;
  /** Hard-delete an annotation. */
  deleteAnnotation: (id: string) => void;
  /**
   * TOP-LEVEL comments for the CURRENTLY VIEWED version that have a valid
   * anchor. Includes soft-deleted ones (rendered as muted/ghost pins). Replies
   * are not markers — they inherit the parent's pin.
   */
  markers: PrototypeComment[];
  /** Distinct known commenter names (for the composer's name select). */
  authors: string[];
  /** Replies (oldest-first) for a given parent comment id. */
  repliesOf: (parentId: string) => PrototypeComment[];
  /**
   * Persist a new pinned top-level comment against the viewed version. Returns
   * true on success, false if persistence failed (e.g. localStorage quota).
   */
  addComment: (
    author: string,
    text: string,
    anchor: CommentAnchor,
    attachment: CommentAttachment | null,
  ) => boolean;
  /**
   * Persist a reply to an existing comment. Returns true on success, false if
   * persistence failed (e.g. localStorage quota).
   */
  addReply: (
    parentId: string,
    author: string,
    text: string,
    attachment: CommentAttachment | null,
  ) => boolean;
  /** Soft-delete a comment by id (preserves it in a muted "Deleted" state). */
  softDeleteComment: (id: string) => void;
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
