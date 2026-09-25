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
 *  • Comments are review history: lifecycle is open → resolved → reopen.
 *    Records are never removed by normal collaboration actions.
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
  /** Omitted for existing pins in the prototype's main content. */
  region?: "intro";
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
  /** Legacy migration metadata. A valid value coerces the record to resolved. */
  deletedAt?: string;
  /** Canonical review lifecycle state. */
  status: "open" | "resolved";
  resolvedAt?: string;
  resolvedBy?: string;
  statusHistory?: { action: "resolve" | "reopen"; actor: string; at: string }[];
  /**
   * Optional image attachment (downscaled JPEG data URL).
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
  /** All comments for a prototype, newest-first (including resolved). */
  list(prototypeId: string): PrototypeComment[];
  /** Distinct commenter names across ALL comments (for the name combobox). */
  listAuthors(): string[];
  /** The persisted color currently associated with an author. */
  colorForAuthor(author: string): CommentColor;
  /** Persist a new comment. The shared repository resolves only after the API confirms it. */
  add(input: NewCommentInput): PrototypeComment | Promise<PrototypeComment>;
  resolve(id: string, actor: string): void;
  reopen(id: string, actor: string): void;
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

  // A legacy deleted timestamp represents recoverable resolved feedback.
  const deletedAtRaw = str(r.deletedAt);
  const deletedAt =
    deletedAtRaw.length > 0 && !Number.isNaN(Date.parse(deletedAtRaw))
      ? deletedAtRaw
      : undefined;
  // Explicit canonical status wins; only status-less legacy records infer
  // resolved from their old deleted timestamp.
  const status =
    r.status === "resolved"
      ? "resolved"
      : r.status === "open"
        ? "open"
        : deletedAt
          ? "resolved"
          : "open";
  const resolvedAtRaw = str(r.resolvedAt);
  const resolvedAt =
    resolvedAtRaw.length > 0 && !Number.isNaN(Date.parse(resolvedAtRaw))
      ? resolvedAtRaw
      : deletedAt;
  const resolvedBy = str(r.resolvedBy).trim() || undefined;
  const statusHistory: PrototypeComment["statusHistory"] = Array.isArray(r.statusHistory)
    ? r.statusHistory.flatMap((entry) => {
        if (!entry || typeof entry !== "object") return [];
        const item = entry as Record<string, unknown>;
        const action = item.action;
        const actor = str(item.actor).trim();
        const at = str(item.at);
        return (action === "resolve" || action === "reopen") && actor &&
          !Number.isNaN(Date.parse(at))
          ? [{ action: action as "resolve" | "reopen", actor, at }]
          : [];
      })
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
    status,
    resolvedAt,
    resolvedBy,
    statusHistory,
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
    ...(a.region === "intro" ? { region: "intro" as const } : {}),
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
      status: "open",
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
  resolve(id, actor) {
    const resolver = actor.trim();
    if (!resolver) throw new Error("commentStore: resolver is required.");
    const all = readAll();
    let changed = false;
    const next = all.map((c) => {
      if (c.id === id && c.status !== "resolved") {
        changed = true;
        const at = nowIso();
        return { ...c, status: "resolved" as const, resolvedAt: at, resolvedBy: resolver,
          statusHistory: [...(c.statusHistory ?? []), { action: "resolve" as const, actor: resolver, at }] };
      }
      return c;
    });
    if (changed) writeAllQuiet(next);
  },
  reopen(id, actor) {
    const reopener = actor.trim();
    if (!reopener) throw new Error("commentStore: reopener is required.");
    const all = readAll();
    const next = all.map((c) => c.id === id && c.status === "resolved"
      ? { ...c, status: "open" as const, resolvedAt: undefined, resolvedBy: undefined,
          statusHistory: [...(c.statusHistory ?? []), { action: "reopen" as const, actor: reopener, at: nowIso() }] }
      : c);
    writeAllQuiet(next);
  },
};

/* ---------------------------------------------------------------------- */
/* Shared API repository                                                   */
/* ---------------------------------------------------------------------- */

let apiComments: PrototypeComment[] = [];
const commentWriteQueues = new Map<string, Promise<unknown>>();

/** Serialize remote mutations per comment id: create PUT always precedes status
 * PATCH, and rapid resolve/reopen actions cannot arrive out of order. */
function queueCommentWrite<T>(id: string, write: () => Promise<T>): Promise<T> {
  const prior = commentWriteQueues.get(id) ?? Promise.resolve();
  const next = prior.catch(() => undefined).then(write);
  commentWriteQueues.set(id, next);
  void next
    .finally(() => {
      if (commentWriteQueues.get(id) === next) commentWriteQueues.delete(id);
    })
    .catch(() => undefined);
  return next;
}

const commentMigrationKey = (prototypeId: string) =>
  `fiber:collab:migrated:comments:${prototypeId}`;
const commentMigrationFailuresKey = (prototypeId: string) =>
  `fiber:collab:migration-failures:comments:${prototypeId}`;

function finishCommentMigration(
  prototypeId: string,
  failedIds: string[],
): void {
  try {
    if (failedIds.length === 0) {
      window.localStorage.setItem(commentMigrationKey(prototypeId), "true");
      window.localStorage.removeItem(commentMigrationFailuresKey(prototypeId));
    } else {
      window.localStorage.setItem(
        commentMigrationFailuresKey(prototypeId),
        JSON.stringify(failedIds),
      );
    }
  } catch {
    /* storage unavailable — retrying migration remains safe */
  }
}

function commentsUrl(prototypeId: string, id?: string): string {
  const base = `/api/prototypes/${encodeURIComponent(prototypeId)}/comments`;
  return id ? `${base}/${encodeURIComponent(id)}` : base;
}

async function putComment(comment: PrototypeComment): Promise<void> {
  return queueCommentWrite(comment.id, async () => {
    const response = await fetch(commentsUrl(comment.prototypeId, comment.id), {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });
    if (!response.ok) throw new Error(`Comment save failed (${response.status})`);
  });
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
 * Load the shared database state, then reconcile every browser-local record
 * missing by id. Reconciliation runs after every successful load so a comment
 * whose initial background PUT failed is retried on the next visit, even when
 * the older one-time migration had already completed.
 *
 * An unreachable API deliberately yields an empty live store: the database is
 * the source of truth and the prototype must remain usable without crashing.
 */
export async function hydrateComments(prototypeId: string): Promise<boolean> {
  try {
    const response = await fetch(commentsUrl(prototypeId), { cache: "no-store" });
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
    // A completed historical migration must not suppress retries for comments
    // added later whose background save failed. PUT is idempotent by comment id,
    // so retrying every server-missing local record is safe.
    const migrationCandidates = localMissing;
    const migrated: PrototypeComment[] = [];
    const migrationFailed: PrototypeComment[] = [];
    for (const comment of migrationCandidates) {
      try {
        await putComment(comment);
        migrated.push(comment);
      } catch (error) {
        migrationFailed.push(comment);
        console.warn("[prototype-comments] local migration failed", error);
      }
    }
    finishCommentMigration(
      prototypeId,
      migrationFailed.map((comment) => comment.id),
    );
    // Failed records stay both visible and cached so the next hydration retries
    // them instead of silently discarding browser-local collaboration data.
    cacheComments(prototypeId, [...remote, ...migrated, ...migrationFailed]);
    return true;
  } catch (error) {
    // Keep the last browser-local copy visible if the shared API is temporarily
    // unavailable. A transient network/deployment restart must not make review
    // history appear to vanish on refresh; the next interval or navigation
    // retries the database hydration.
    apiComments = [
      ...apiComments.filter((comment) => comment.prototypeId !== prototypeId),
      ...readAll().filter((comment) => comment.prototypeId === prototypeId),
    ];
    console.warn("[prototype-comments] API unavailable; showing cached state", error);
    return false;
  }
}

function persistCommentQuiet(comment: PrototypeComment): void {
  void putComment(comment).catch((error) => {
    console.warn("[prototype-comments] save failed", error);
  });
}

async function patchCommentStatus(
  comment: PrototypeComment,
  action: "resolve" | "reopen",
  actor: string,
): Promise<PrototypeComment> {
  return queueCommentWrite(comment.id, async () => {
  const response = await fetch(`${commentsUrl(comment.prototypeId, comment.id)}/status`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, actor }),
  });
  if (!response.ok) throw new Error(`Comment status update failed (${response.status})`);
  const canonical = coerceComment(await response.json());
  if (!canonical) throw new Error("Comment status API returned an invalid comment");
  return canonical;
  });
}

function notifyCommentChange(prototypeId: string): void {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("fiber:comments-changed", { detail: prototypeId }));
  }
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
  async add(input) {
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
      status: "open",
      anchor: coerceAnchor(input.anchor),
      parentId: input.parentId?.trim() || undefined,
      attachment: coerceAttachment(input.attachment),
    };

    const authorKey = author.toLowerCase();
    // Do not tell the composer a comment was saved until Postgres confirms it.
    // In particular, clearing browser storage after a failed PUT must not
    // silently erase a comment the UI had already accepted.
    await putComment(comment);
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
    return comment;
  },
  resolve(id, actor) {
    const target = apiComments.find((comment) => comment.id === id);
    const resolver = actor.trim();
    if (!target || target.status === "resolved" || !resolver) return;
    const at = nowIso();
    const resolved = { ...target, status: "resolved" as const, resolvedAt: at, resolvedBy: resolver,
      statusHistory: [...(target.statusHistory ?? []), { action: "resolve" as const, actor: resolver, at }] };
    apiComments = apiComments.map((comment) =>
      comment.id === id ? resolved : comment,
    );
    cacheComments(
      resolved.prototypeId,
      apiComments.filter((item) => item.prototypeId === resolved.prototypeId),
    );
    void patchCommentStatus(target, "resolve", resolver).then((canonical) => {
      apiComments = apiComments.map((comment) => comment.id === id ? canonical : comment);
      cacheComments(canonical.prototypeId, apiComments.filter((item) => item.prototypeId === canonical.prototypeId));
      notifyCommentChange(canonical.prototypeId);
    }).catch((error) => {
      console.warn("[prototype-comments] resolve failed; reconciling server state", error);
      void hydrateComments(target.prototypeId).finally(() => notifyCommentChange(target.prototypeId));
    });
  },
  reopen(id, actor) {
    const target = apiComments.find((comment) => comment.id === id);
    const reopener = actor.trim();
    if (!target || target.status !== "resolved" || !reopener) return;
    const at = nowIso();
    const open = { ...target, status: "open" as const, resolvedAt: undefined, resolvedBy: undefined,
      statusHistory: [...(target.statusHistory ?? []), { action: "reopen" as const, actor: reopener, at }] };
    apiComments = apiComments.map((comment) => comment.id === id ? open : comment);
    cacheComments(open.prototypeId, apiComments.filter((item) => item.prototypeId === open.prototypeId));
    void patchCommentStatus(target, "reopen", reopener).then((canonical) => {
      apiComments = apiComments.map((comment) => comment.id === id ? canonical : comment);
      cacheComments(canonical.prototypeId, apiComments.filter((item) => item.prototypeId === canonical.prototypeId));
      notifyCommentChange(canonical.prototypeId);
    }).catch((error) => {
      console.warn("[prototype-comments] reopen failed; reconciling server state", error);
      void hydrateComments(target.prototypeId).finally(() => notifyCommentChange(target.prototypeId));
    });
  },
};

export const commentRepository: CommentRepository = apiCommentRepository;
