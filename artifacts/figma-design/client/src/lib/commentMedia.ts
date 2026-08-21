/**
 * Client-side helpers for comment media + text.
 *
 * - `downscaleImageFile`: reads an image File, downscales it via a canvas to a
 *   max long-edge and encodes it as a JPEG data URL to keep localStorage small.
 * - `linkifyParts`: splits comment text into plain-text and URL segments so the
 *   renderer can turn http(s) URLs into real links WITHOUT dangerouslySet HTML.
 */

import type { CommentAttachment } from "@/lib/commentStore";

/** Longest edge (px) the downscaled attachment is capped to. */
export const MAX_IMAGE_EDGE = 1280;
/** JPEG quality for the encoded attachment. */
export const IMAGE_QUALITY = 0.8;

/**
 * Read an image File and return a downscaled JPEG data URL + dimensions.
 * Rejects if the file is not an image or cannot be decoded.
 */
export function downscaleImageFile(file: File): Promise<CommentAttachment> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Not an image file."));
      return;
    }
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      const { naturalWidth: w, naturalHeight: h } = img;
      if (!w || !h) {
        reject(new Error("Could not read image dimensions."));
        return;
      }
      const scale = Math.min(1, MAX_IMAGE_EDGE / Math.max(w, h));
      const outW = Math.max(1, Math.round(w * scale));
      const outH = Math.max(1, Math.round(h * scale));
      const canvas = document.createElement("canvas");
      canvas.width = outW;
      canvas.height = outH;
      const ctx = canvas.getContext("2d");
      if (!ctx) {
        reject(new Error("Canvas not supported."));
        return;
      }
      ctx.drawImage(img, 0, 0, outW, outH);
      try {
        const dataUrl = canvas.toDataURL("image/jpeg", IMAGE_QUALITY);
        resolve({ dataUrl, width: outW, height: outH });
      } catch (e) {
        reject(e instanceof Error ? e : new Error("Could not encode image."));
      }
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not load image."));
    };
    img.src = url;
  });
}

/** A segment of comment text: plain text or a detected URL. */
export interface TextPart {
  text: string;
  href?: string;
}

// http(s) URLs. Global so we can walk all matches; trailing punctuation is
// trimmed off the match so "(see http://x.com)." doesn't swallow the paren/dot.
const URL_RE = /https?:\/\/[^\s<]+/gi;
const TRAILING = /[)\].,;:!?'"]+$/;

/**
 * Split text into plain + URL parts for safe rendering (no HTML injection).
 * Only http/https URLs are linkified.
 */
export function linkifyParts(text: string): TextPart[] {
  const parts: TextPart[] = [];
  let lastIndex = 0;
  let m: RegExpExecArray | null;
  URL_RE.lastIndex = 0;
  while ((m = URL_RE.exec(text)) !== null) {
    let url = m[0];
    let matchEnd = m.index + url.length;
    // Trim trailing punctuation back into the plain-text stream.
    const trimmed = url.replace(TRAILING, "");
    if (trimmed.length !== url.length) {
      matchEnd = m.index + trimmed.length;
      url = trimmed;
    }
    if (m.index > lastIndex) {
      parts.push({ text: text.slice(lastIndex, m.index) });
    }
    parts.push({ text: url, href: url });
    lastIndex = matchEnd;
    URL_RE.lastIndex = matchEnd;
  }
  if (lastIndex < text.length) {
    parts.push({ text: text.slice(lastIndex) });
  }
  return parts;
}
