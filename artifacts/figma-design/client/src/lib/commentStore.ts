/**
 * Prototype Comments — lightweight collaboration data model + persistence.
 *
 * Mirrors ruleStore.ts / prototypeStore.ts: a small repository interface behind
 * a localStorage implementation, with validation/coercion at the read boundary
 * so the UI NEVER sees a malformed record. Swap `localStorageRepository` for an
 * HTTP/DB-backed implementation and the UI keeps working unchanged.
 *
 * A comment is anchored to BOTH a prototype and the version it was left against
 * (versionId + versionName) so feedback↔version mapping is always unambiguous.
 *
 * ── Collaboration history ─────────────────────────────────────────────────
 *  • Soft delete: `remove` was replaced by `softDelete`, which stamps
 *    `deletedAt` and PRESERVES the record (author, createdAt, version, anchor).
 *    Deleted comments stay in history, rendered in a muted "Deleted" state.
 *  • Lightweight threads: `parentId` links a reply to its top-level comment.
 *    Deleting a parent does NOT delete its replies (the thread stays readable);
 *    replies are individually soft-deletable.
 */

const STORAGE_KEY = "fiber:ai-prototype:comments:v1";

/** Stable predefined swatch ids. The UI maps these ids to Fiber color tokens. */
export const COMMENT_COLORS = [
  "purple",
  "blue",
  "orange",
  "green",
  "pink",
  "teal",
] as const;
export type CommentColor = (typeof COMMENT_COLORS)[number];
export const DEFAULT_COMMENT_COLOR: CommentColor = "purple";

export function coerceCommentColor(raw: unknown): CommentColor {
  return typeof raw === "string" &&
    (COMMENT_COLORS as readonly string[]).includes(raw)
    ? (raw as CommentColor)
    : DEFAULT_COMMENT_COLOR;
}

/**
 * Where a comment is pinned on the prototype UI. Position is stored as
 * PERCENTAGES relative to the versioned content wrapper so markers stay
 * correctly placed across resizes. `targetLabel` is a best-effort, human
 * readable description of the clicked element (e.g. "Button: Apply filters").
 */
export interface CommentAnchor {
  xPct: number;
  yPct: number;
  targetLabel: string;
}

/**
 * An optional image attachment on a comment. Stored inline as a downscaled
 * JPEG data URL (client-side canvas resize) to keep localStorage small. Width
 * and height are the natural pixel dimensions of the downscaled image (used to
 * size thumbnails without layout shift).
 */
export interface CommentAttachment {
  dataUrl: string;
  width: number;
  height: number;
}

/** A single comment left on a prototype, against a specific version. */
export interface PrototypeComment {
  id: string;
  prototypeId: string;
  /** The version this comment was left against (stable id). */
  versionId: string;
  /** Human label of that version, e.g. "V2" (denormalised for display). */
  versionName: string;
  /** Commenter display name. */
  author: string;
  /** Predefined collaboration color associated with this author. */
  color: CommentColor;
  /** Comment body. */
  text: string;
  createdAt: string;
  /**
   * Where the comment is pinned on the prototype UI. Optional: legacy records
   * without an anchor stay valid — they appear in the list panel but render no
   * marker. Replies (parentId set) typically carry no anchor.
   */
  anchor?: CommentAnchor;
  /**
   * If set, this comment is a REPLY to the top-level comment with this id.
   * Top-level comments leave this undefined. Replies inherit the parent's pin
   * (they render no marker of their own).
   */
  parentId?: string;
  /**
   * Soft-delete timestamp (ISO). When set, the comment is preserved in history
   * but shown in a muted "Deleted" state; its text is hidden in the UI. Legacy
   * records without this field are active.
   */
  deletedAt?: string;
  /**
   * Optional image attachment (downscaled JPEG data URL). Masked in the UI when
   * the comment is soft-deleted. Legacy records without this field are fine.
   */
  attachment?: CommentAttachment;
}

/* ---------------------------------------------------------------------- */
/* id + time helpers                                                       */
/* ---------------------------------------------------------------------- */

/** Monotonic counter for the timestamp fallback id (uniqueness within a run). */
let idCounter = 0;

/**
 * A collision-resistant id. Uses crypto.randomUUID when available, else a
 * timestamp + monotonic counter + random suffix. Callers additionally
 * de-duplicate against existing ids on write (see `add`).
 */
export function newId(prefix = "comment"): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}_${crypto.randomUUID()}`;
  }
  idCounter += 1;
  const rand = Math.random().toString(36).slice(2, 8);
  return `${prefix}_${Date.now().toString(36)}_${idCounter.toString(36)}_${rand}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

/* ---------------------------------------------------------------------- */
/* Repository interface (backend-swap seam)                                */
/* ---------------------------------------------------------------------- */

/** Input required to add a comment (identity + timestamps generated here). */
export interface NewCommentInput {
  prototypeId: string;
  versionId: string;
  versionName: string;
  author: string;
  /** Predefined author color; legacy callers safely default to purple. */
  color?: CommentColor;
  text: string;
  /** Where the comment is pinned on the prototype UI (optional). */
  anchor?: CommentAnchor;
  /** If set, this is a reply to the top-level comment with this id. */
  parentId?: string;
  /** Optional downscaled image attachment. */
  attachment?: CommentAttachment;
}

export interface CommentRepository {
  /** All comments for a prototype, newest-first (includes soft-deleted). */
  list(prototypeId: string): PrototypeComment[];
  /** Distinct commenter names across ALL comments (for the name combobox). */
  listAuthors(): string[];
  /** The persisted color currently associated with an author. */
  colorForAuthor(author: string): CommentColor;
  /** Persist a new comment. Throws on empty author/text. */
  add(input: NewCommentInput): PrototypeComment;
  /**
   * SOFT delete a comment by id: stamps `deletedAt` and preserves the record.
   * Only the targeted comment is affected — deleting a parent leaves its
   * replies intact, and replies remain individually soft-deletable.
   */
  softDelete(id: string): void;
}

/**
 * Validate + coerce a persisted record into a well-formed PrototypeComment at
 * the repository boundary. Returns null for records missing required identity
 * so the UI NEVER sees a malformed comment.
 */
function coerceComment(raw: unknown): PrototypeComment | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const str = (v: unknown, fb = ""): string => (typeof v === "string" ? v : fb);

  if (typeof r.id !== "string" || r.id.length === 0) return null;
  if (typeof r.prototypeId !== "string" || r.prototypeId.length === 0) return null;
  // versionId is REQUIRED — a comment must map to a version. Drop records
  // whose versionId is missing / not a non-empty string.
  if (typeof r.versionId !== "string" || r.versionId.length === 0) return null;
  const author = str(r.author).trim();
  const text = str(r.text).trim();
  if (author.length === 0 || text.length === 0) return null;

  // createdAt must be a parseable ISO timestamp; drop unparseable records so
  // downstream timestamp sorting is always valid.
  const createdAtRaw = str(r.createdAt);
  if (createdAtRaw.length === 0 || Number.isNaN(Date.parse(createdAtRaw))) return null;

  // parentId: optional, must be a non-empty string to count (else undefined).
  const parentIdRaw = str(r.parentId).trim();
  const parentId = parentIdRaw.length > 0 ? parentIdRaw : undefined;

  // deletedAt: optional; keep only a parseable ISO timestamp, else treat the
  // record as active (tolerant of legacy/garbage values).
  const deletedAtRaw = str(r.deletedAt);
  const deletedAt =
    deletedAtRaw.length > 0 && !Number.isNaN(Date.parse(deletedAtRaw))
      ? deletedAtRaw
      : undefined;

  return {
    id: r.id,
    prototypeId: r.prototypeId,
    versionId: r.versionId,
    versionName: str(r.versionName) || "—",
    author,
    color: coerceCommentColor(r.color),
    text,
    createdAt: createdAtRaw,
    anchor: coerceAnchor(r.anchor),
    parentId,
    deletedAt,
    attachment: coerceAttachment(r.attachment),
  };
}

/**
 * Tolerant attachment parsing. Keeps the attachment only if `dataUrl` is a
 * `data:image/*` string; otherwise returns undefined (legacy/garbage records
 * stay valid, just with no attachment). Dimensions default to 0 if missing.
 */
function coerceAttachment(raw: unknown): CommentAttachment | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const a = raw as Record<string, unknown>;
  const dataUrl = a.dataUrl;
  if (typeof dataUrl !== "string" || !dataUrl.startsWith("data:image/")) {
    return undefined;
  }
  const dim = (v: unknown): number =>
    typeof v === "number" && Number.isFinite(v) && v > 0 ? Math.round(v) : 0;
  return { dataUrl, width: dim(a.width), height: dim(a.height) };
}

/**
 * Tolerant anchor parsing. Legacy records without a valid anchor return
 * undefined (they stay valid — they render no marker). Percentages are clamped
 * to [0, 100].
 */
function coerceAnchor(raw: unknown): CommentAnchor | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const a = raw as Record<string, unknown>;
  const x = a.xPct;
  const y = a.yPct;
  if (typeof x !== "number" || !Number.isFinite(x)) return undefined;
  if (typeof y !== "number" || !Number.isFinite(y)) return undefined;
  const clamp = (n: number): number => Math.min(100, Math.max(0, n));
  const label = typeof a.targetLabel === "string" ? a.targetLabel : "";
  return {
    xPct: clamp(x),
    yPct: clamp(y),
    targetLabel: label.trim() || "Screen",
  };
}

function readAll(): PrototypeComment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(coerceComment)
      .filter((c): c is PrototypeComment => c !== null);
  } catch {
    return [];
  }
}

/**
 * Persist the full comment list. THROWS on quota/serialization failure so
 * callers that add large payloads (image attachments) can surface an inline
 * error and preserve the user's typed text. Use `writeAllQuiet` for shrinking
 * operations that must never fail the UI.
 */
function writeAll(comments: PrototypeComment[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
}

/** Best-effort persist that swallows failures (for delete / shrink paths). */
function writeAllQuiet(comments: PrototypeComment[]): void {
  try {
    writeAll(comments);
  } catch {
    /* storage full / unavailable — non-fatal for a local authoring tool */
  }
}

/** Newest-first by PARSED timestamp (not lexical). */
const byRecent = (a: PrototypeComment, b: PrototypeComment) =>
  Date.parse(b.createdAt) - Date.parse(a.createdAt);

export const localStorageRepository: CommentRepository = {
  list(prototypeId) {
    return readAll()
      .filter((c) => c.prototypeId === prototypeId)
      .sort(byRecent);
  },
  listAuthors() {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const c of readAll()) {
      const key = c.author.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        out.push(c.author);
      }
    }
    return out.sort((a, b) => a.localeCompare(b));
  },
  colorForAuthor(author) {
    const key = author.trim().toLowerCase();
    if (!key) return DEFAULT_COMMENT_COLOR;
    return (
      readAll().find((comment) => comment.author.toLowerCase() === key)?.color ??
      DEFAULT_COMMENT_COLOR
    );
  },
  add(input) {
    const author = input.author.trim();
    const text = input.text.trim();
    if (!input.prototypeId) {
      throw new Error("commentStore: prototypeId is required.");
    }
    if (!input.versionId) throw new Error("commentStore: versionId is required.");
    if (author.length === 0) throw new Error("commentStore: author is required.");
    if (text.length === 0) throw new Error("commentStore: text is required.");

    const all = readAll();
    const color = coerceCommentColor(input.color);

    // Guarantee a unique id against existing records (defends against the
    // timestamp fallback and any persisted collisions).
    const existingIds = new Set(all.map((c) => c.id));
    let id = newId();
    while (existingIds.has(id)) id = newId();

    const parentId =
      typeof input.parentId === "string" && input.parentId.trim().length > 0
        ? input.parentId.trim()
        : undefined;

    const comment: PrototypeComment = {
      id,
      prototypeId: input.prototypeId,
      versionId: input.versionId,
      versionName: input.versionName || "—",
      author,
      color,
      text,
      createdAt: nowIso(),
      anchor: coerceAnchor(input.anchor),
      parentId,
      attachment: coerceAttachment(input.attachment),
    };
    // Color belongs to the AUTHOR, not just this record. Recolor their existing
    // comments/replies so one author is visually consistent across threads and
    // versions after they choose a new predefined swatch.
    const authorKey = author.toLowerCase();
    const next = all.map((existing) =>
      existing.author.toLowerCase() === authorKey
        ? { ...existing, color }
        : existing,
    );
    next.push(comment);
    // May THROW (quota) — nothing is persisted in that case, so the caller can
    // retry (e.g. without the image) with the typed text intact.
    writeAll(next);
    return comment;
  },
  softDelete(id) {
    const all = readAll();
    // Stamp deletedAt on ONLY the targeted record; preserve everything else
    // (author, createdAt, version, anchor) and never touch parents/replies.
    let changed = false;
    const next = all.map((c) => {
      if (c.id === id && !c.deletedAt) {
        changed = true;
        return { ...c, deletedAt: nowIso() };
      }
      return c;
    });
    if (changed) writeAllQuiet(next);
  },
};

/* ---------------------------------------------------------------------- */
/* Shared API repository                                                   */
/* ---------------------------------------------------------------------- */

let apiComments: PrototypeComment[] = [];

function commentsUrl(prototypeId: string, id?: string): string {
  const base = `/api/prototypes/${encodeURIComponent(prototypeId)}/comments`;
  return id ? `${base}/${encodeURIComponent(id)}` : base;
}

async function putComment(comment: PrototypeComment): Promise<void> {
  const response = await fetch(commentsUrl(comment.prototypeId, comment.id), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(comment),
  });
  if (!response.ok) {
    throw new Error(`Comment save failed (${response.status})`);
  }
}

function cacheComments(prototypeId: string, comments: PrototypeComment[]): void {
  apiComments = [
    ...apiComments.filter((comment) => comment.prototypeId !== prototypeId),
    ...comments,
  ];
  // Keep localStorage as a best-effort offline/migration cache, but never use it
  // as the live source after hydration.
  const otherLocal = readAll().filter(
    (comment) => comment.prototypeId !== prototypeId,
  );
  writeAllQuiet([...otherLocal, ...comments]);
}

/**
 * Load the shared database state, then migrate browser-local records missing by
 * id. An unreachable API deliberately yields an empty live store: the database
 * is the source of truth and the prototype must remain usable without crashing.
 */
export async function hydrateComments(prototypeId: string): Promise<void> {
  try {
    const response = await fetch(commentsUrl(prototypeId));
    if (!response.ok) throw new Error(`Comment load failed (${response.status})`);
    const raw: unknown = await response.json();
    if (!Array.isArray(raw)) throw new Error("Comment API returned a non-array");
    const remote = raw
      .map(coerceComment)
      .filter(
        (comment): comment is PrototypeComment =>
          comment !== null && comment.prototypeId === prototypeId,
      );
    const remoteIds = new Set(remote.map((comment) => comment.id));
    const localMissing = readAll().filter(
      (comment) =>
        comment.prototypeId === prototypeId && !remoteIds.has(comment.id),
    );
    const migrated: PrototypeComment[] = [];
    const migrationFailed: PrototypeComment[] = [];
    for (const comment of localMissing) {
      try {
        await putComment(comment);
        migrated.push(comment);
      } catch (error) {
        migrationFailed.push(comment);
        console.warn("[prototype-comments] local migration failed", error);
      }
    }
    // Failed records stay both visible and cached so the next hydration retries
    // them instead of silently discarding browser-local collaboration data.
    cacheComments(prototypeId, [...remote, ...migrated, ...migrationFailed]);
  } catch (error) {
    apiComments = apiComments.filter(
      (comment) => comment.prototypeId !== prototypeId,
    );
    console.warn("[prototype-comments] API unavailable; showing empty state", error);
  }
}

function persistCommentQuiet(comment: PrototypeComment): void {
  void putComment(comment).catch((error) => {
    console.warn("[prototype-comments] save failed", error);
  });
}

export const apiCommentRepository: CommentRepository = {
  list(prototypeId) {
    return apiComments
      .filter((comment) => comment.prototypeId === prototypeId)
      .sort(byRecent);
  },
  listAuthors() {
    const names = new Map<string, string>();
    for (const comment of apiComments) {
      const key = comment.author.toLowerCase();
      if (!names.has(key)) names.set(key, comment.author);
    }
    return Array.from(names.values()).sort((a, b) => a.localeCompare(b));
  },
  colorForAuthor(author) {
    const key = author.trim().toLowerCase();
    if (!key) return DEFAULT_COMMENT_COLOR;
    return (
      apiComments.find((comment) => comment.author.toLowerCase() === key)?.color ??
      DEFAULT_COMMENT_COLOR
    );
  },
  add(input) {
    const author = input.author.trim();
    const text = input.text.trim();
    if (!input.prototypeId) throw new Error("commentStore: prototypeId is required.");
    if (!input.versionId) throw new Error("commentStore: versionId is required.");
    if (!author) throw new Error("commentStore: author is required.");
    if (!text) throw new Error("commentStore: text is required.");

    const existingIds = new Set(apiComments.map((comment) => comment.id));
    let id = newId();
    while (existingIds.has(id)) id = newId();
    const color = coerceCommentColor(input.color);
    const comment: PrototypeComment = {
      id,
      prototypeId: input.prototypeId,
      versionId: input.versionId,
      versionName: input.versionName || "—",
      author,
      color,
      text,
      createdAt: nowIso(),
      anchor: coerceAnchor(input.anchor),
      parentId: input.parentId?.trim() || undefined,
      attachment: coerceAttachment(input.attachment),
    };

    const authorKey = author.toLowerCase();
    apiComments = apiComments.map((existing) => {
      if (
        existing.author.toLowerCase() !== authorKey ||
        existing.color === color
      ) {
        return existing;
      }
      const recolored = { ...existing, color };
      persistCommentQuiet(recolored);
      return recolored;
    });
    apiComments.push(comment);
    cacheComments(
      input.prototypeId,
      apiComments.filter((item) => item.prototypeId === input.prototypeId),
    );
    persistCommentQuiet(comment);
    return comment;
  },
  softDelete(id) {
    const target = apiComments.find((comment) => comment.id === id);
    if (!target || target.deletedAt) return;
    const deleted = { ...target, deletedAt: nowIso() };
    apiComments = apiComments.map((comment) =>
      comment.id === id ? deleted : comment,
    );
    cacheComments(
      deleted.prototypeId,
      apiComments.filter((item) => item.prototypeId === deleted.prototypeId),
    );
    persistCommentQuiet(deleted);
  },
};

export const commentRepository: CommentRepository = apiCommentRepository;
