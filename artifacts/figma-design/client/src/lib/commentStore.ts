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
 * ── Architecture seams (intentionally NOT implemented yet) ────────────────
 *  • The PrototypeComment type is kept extensible (flat + optional fields) so
 *    future replies / resolution can be layered on without a migration:
 *    e.g. `parentId?: string`, `resolved?: boolean`. None are wired here.
 */

const STORAGE_KEY = "fiber:ai-prototype:comments:v1";

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
  /** Comment body. */
  text: string;
  createdAt: string;
  // FUTURE (extensibility seam — do not use yet):
  //   parentId?: string;   // threaded replies
  //   resolved?: boolean;  // resolution state
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
  text: string;
}

export interface CommentRepository {
  /** All comments for a prototype, newest-first. */
  list(prototypeId: string): PrototypeComment[];
  /** Distinct commenter names across ALL comments (for the name combobox). */
  listAuthors(): string[];
  /** Persist a new comment. Throws on empty author/text. */
  add(input: NewCommentInput): PrototypeComment;
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

  return {
    id: r.id,
    prototypeId: r.prototypeId,
    versionId: r.versionId,
    versionName: str(r.versionName) || "—",
    author,
    text,
    createdAt: createdAtRaw,
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

function writeAll(comments: PrototypeComment[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
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

    // Guarantee a unique id against existing records (defends against the
    // timestamp fallback and any persisted collisions).
    const existingIds = new Set(all.map((c) => c.id));
    let id = newId();
    while (existingIds.has(id)) id = newId();

    const comment: PrototypeComment = {
      id,
      prototypeId: input.prototypeId,
      versionId: input.versionId,
      versionName: input.versionName || "—",
      author,
      text,
      createdAt: nowIso(),
    };
    all.push(comment);
    writeAll(all);
    return comment;
  },
};

// The UI imports this alias so swapping the backend is a one-line change.
export const commentRepository: CommentRepository = localStorageRepository;
