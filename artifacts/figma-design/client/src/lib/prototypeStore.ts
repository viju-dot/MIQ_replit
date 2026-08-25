/**
 * Prototype registry — the source of truth for AI Prototype workspace entries.
 *
 * AI Prototype is the central workspace: each prototype can be opened directly,
 * mapped in Flow Chart (/flow-chart/:prototypeId) and validated in Usability
 * Testing (/usability-testing/:prototypeId), inspected in a Side Panel viewer,
 * versioned, and securely shared via /share/:token.
 *
 * ── Architecture seams (mirrors ruleStore.ts) ────────────────────────────
 *  • Persistence is behind a small repository interface. Today it is a static
 *    seed merged with any locally-created / edited prototypes (localStorage).
 *    Replace `localStorageRepository` with an HTTP/DB-backed implementation and
 *    the UI keeps working unchanged.
 *  • The seed contains the one real prototype (TV Audience Intelligence).
 *  • Versions are append-only snapshots ("V1", "V2", …). Prior versions are
 *    ALWAYS preserved. FUTURE: version compare/diff (seam left below).
 *  • Share config is a client-side prototype (token + optional password). A
 *    real backend would move password verification server-side.
 */

export const PROTOTYPE_STATUSES = ["Live", "Draft", "Archived"] as const;
export type PrototypeStatus = (typeof PROTOTYPE_STATUSES)[number];

/**
 * Point-in-time data captured when a version is saved — what the prototype
 * looked like at that version. Selecting a version renders THIS, not the
 * always-current prototype fields.
 */
export interface VersionSnapshotData {
  description: string;
  status: PrototypeStatus;
  notes?: string;
}

/**
 * An append-only version snapshot of a prototype. `name` is a human label
 * ("V1", "V2", …). `snapshot` freezes the prototype's data at save time.
 */
export interface PrototypeVersion {
  id: string;
  /** Display label, e.g. "V1". */
  name: string;
  createdAt: string;
  updatedAt: string;
  description?: string;
  /** Selects the functional React renderer independently of this version's id. */
  rendererKey: "v3" | "v4" | "dashboard";
  /** Archived versions remain persisted but are hidden from the active list. */
  status: "active" | "archived";
  metadata?: {
    createdFrom?: string;
  };
  /** Data as of this version (frozen at save time). */
  snapshot?: VersionSnapshotData;
}

/** Secure-sharing configuration for a prototype (client-side prototype). */
export interface ShareConfig {
  /** Whether a share link is active. */
  enabled: boolean;
  /** Unique token used in the public URL /share/:token (NOT the prototype id). */
  token: string;
  /** When true a password is required to view the shared prototype. */
  secured: boolean;
  /** The current share password (only meaningful when secured). */
  password: string;
}

/** A single registered prototype. */
export interface Prototype {
  id: string;
  name: string;
  description: string;
  status: PrototypeStatus;
  /** Client-side route that opens the prototype experience itself. */
  route: string;
  createdAt: string;
  /** Append-only version history, oldest first. */
  versions: PrototypeVersion[];
  /** Secure-sharing configuration. */
  share: ShareConfig;
}

const STORAGE_KEY = "fiber:ai-prototype:prototypes:v2";

/* ---------------------------------------------------------------------- */
/* id + time helpers                                                       */
/* ---------------------------------------------------------------------- */

export function newId(prefix = "proto"): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${prefix}_${rand}`;
}

/**
 * A high-entropy, URL-safe share token (distinct from the prototype id).
 * Generated via crypto.getRandomValues → 32 base64url chars (192 bits). The
 * server rejects anything shorter than 24 chars / outside base64url, so this is
 * the ONLY acceptable token source; there is no deterministic fallback.
 */
export function newShareToken(): string {
  const bytes = new Uint8Array(24); // 24 bytes → 32 base64url chars
  crypto.getRandomValues(bytes);
  let bin = "";
  for (let i = 0; i < bytes.length; i += 1) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

/** True when a token meets the server's high-entropy format requirement. */
export function isStrongToken(token: string): boolean {
  return /^[A-Za-z0-9_-]{24,128}$/.test(token);
}

/** A human-friendly random password for share links. */
export function newPassword(): string {
  const alphabet = "ABCDEFGHJKMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789";
  let out = "";
  const n = 10;
  if (typeof crypto !== "undefined" && "getRandomValues" in crypto) {
    const buf = new Uint32Array(n);
    crypto.getRandomValues(buf);
    for (let i = 0; i < n; i += 1) out += alphabet[buf[i] % alphabet.length];
  } else {
    for (let i = 0; i < n; i += 1) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return out;
}

/* ---------------------------------------------------------------------- */
/* Static seed (the real prototype)                                        */
/* ---------------------------------------------------------------------- */

const SEED: Prototype[] = [
  {
    id: "tv-audience-intelligence",
    name: "TV Audience Intelligence",
    description:
      "A full product experience for exploring and activating TV audience segments.",
    status: "Live",
    route: "/tv-audience-intelligence",
    createdAt: "2024-01-01T00:00:00.000Z",
    versions: [
      {
        id: "tvai_v1",
        name: "V1",
        createdAt: "2024-01-01T09:00:00.000Z",
        updatedAt: "2024-01-08T14:30:00.000Z",
        description: "Initial concept — segment explorer and basic audience overview.",
        rendererKey: "dashboard",
        status: "active",
        snapshot: {
          description:
            "Early concept: browse TV audience segments and view a basic audience overview.",
          status: "Draft",
          notes: "Explorer + overview only. No activation yet.",
        },
      },
      {
        id: "tvai_v2",
        name: "V2",
        createdAt: "2024-02-12T10:15:00.000Z",
        updatedAt: "2024-03-04T16:45:00.000Z",
        description: "Added activation flow, refined filters and dark-mode support.",
        rendererKey: "dashboard",
        status: "active",
        snapshot: {
          description:
            "A full product experience for exploring and activating TV audience segments.",
          status: "Live",
          notes: "Added activation flow, refined filters and dark-mode support.",
        },
      },
      {
        id: "tvai_v3",
        name: "V3",
        createdAt: "2024-04-18T11:00:00.000Z",
        updatedAt: "2024-04-18T11:00:00.000Z",
        description: "Content Planner ideation — live.",
        rendererKey: "v3",
        status: "active",
        snapshot: {
          description:
            "MiQ TV Audience & Content Planner — single-page analytical dashboard with connected cross-filtering and drilldowns.",
          status: "Live",
          notes: "Understand → Discover journey; 8 connected KPI areas; market-aware filters.",
        },
      },
      {
        id: "tvai_v4",
        name: "V4",
        createdAt: "2024-05-20T11:00:00.000Z",
        updatedAt: "2024-05-20T11:00:00.000Z",
        description: "Wireframe-faithful Content Planner — live.",
        rendererKey: "v4",
        status: "active",
        // Newest/live version: the version-context strip shows the live
        // prototype description/status (not this snapshot) for the newest.
        snapshot: {
          description:
            "MiQ TV Audience & Content Planner — high-fidelity build faithful to the delivered wireframe: exec tiles, donut + combo, Trends, temporal heatmap, radar affinity and a custom Sankey.",
          status: "Live",
          notes: "Wireframe-faithful layout; global All/Commercials; chart token layer; cross-filter chain.",
        },
      },
    ],
    // No pre-baked token: a fresh high-entropy token is generated the first
    // time sharing is enabled (weak/deterministic tokens are never accepted).
    share: {
      enabled: false,
      token: "",
      secured: false,
      password: "",
    },
  },
];

/* ---------------------------------------------------------------------- */
/* Repository interface (backend-swap seam)                                */
/* ---------------------------------------------------------------------- */

export interface PrototypeRepository {
  list(): Prototype[];
  get(id: string): Prototype | undefined;
  /** Look a prototype up by its (enabled) share token — for the public view. */
  getByShareToken(token: string): Prototype | undefined;
  create(prototype: Prototype): Prototype;
  update(prototype: Prototype): Prototype;
  remove(id: string): void;
  /** Append a new version ("V{n}") preserving all prior ones. */
  addVersion(id: string, description?: string): Prototype;
  duplicateVersion(id: string, sourceVersionId: string): Prototype;
  archiveVersion(id: string, versionId: string): Prototype;
  unarchiveVersion(id: string, versionId: string): Prototype;
  /** Replace the share config for a prototype. */
  setShare(id: string, share: ShareConfig): Prototype;
}

function isStatus(v: unknown): v is PrototypeStatus {
  return typeof v === "string" && (PROTOTYPE_STATUSES as readonly string[]).includes(v);
}

function nowIso(): string {
  return new Date().toISOString();
}

function coerceSnapshot(raw: unknown): VersionSnapshotData | undefined {
  if (!raw || typeof raw !== "object") return undefined;
  const r = raw as Record<string, unknown>;
  return {
    description: typeof r.description === "string" ? r.description : "",
    status: isStatus(r.status) ? r.status : "Draft",
    notes: typeof r.notes === "string" ? r.notes : undefined,
  };
}

function coerceVersion(raw: unknown, fallbackTs: string): PrototypeVersion | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "string" || r.id.length === 0) return null;
  if (typeof r.name !== "string" || r.name.length === 0) return null;
  const str = (v: unknown, fb = ""): string => (typeof v === "string" ? v : fb);
  const createdAt = str(r.createdAt) || fallbackTs;
  const fallbackRenderer =
    r.id === "tvai_v3" ? "v3" : r.id === "tvai_v4" ? "v4" : "dashboard";
  const rendererKey =
    r.rendererKey === "v3" ||
    r.rendererKey === "v4" ||
    r.rendererKey === "dashboard"
      ? r.rendererKey
      : fallbackRenderer;
  const metadata =
    r.metadata && typeof r.metadata === "object"
      ? (r.metadata as Record<string, unknown>)
      : undefined;
  return {
    id: r.id,
    name: r.name,
    createdAt,
    updatedAt: str(r.updatedAt) || createdAt,
    description: typeof r.description === "string" ? r.description : undefined,
    rendererKey,
    status: r.status === "archived" ? "archived" : "active",
    metadata:
      typeof metadata?.createdFrom === "string"
        ? { createdFrom: metadata.createdFrom }
        : undefined,
    snapshot: coerceSnapshot(r.snapshot),
  };
}

function coerceShare(raw: unknown): ShareConfig {
  const r = (raw && typeof raw === "object" ? raw : {}) as Record<string, unknown>;
  const rawToken = typeof r.token === "string" ? r.token : "";
  // Reconcile-time hardening: keep only strong tokens. A legacy/weak token is
  // regenerated (if sharing was enabled) or cleared (if not) so a fresh, high-
  // entropy token is minted on next enable. No deterministic fallback exists.
  let token = "";
  if (rawToken && isStrongToken(rawToken)) {
    token = rawToken;
  } else if (r.enabled === true) {
    token = newShareToken();
  }
  return {
    enabled: r.enabled === true,
    token,
    secured: r.secured === true,
    password: typeof r.password === "string" ? r.password : "",
  };
}

/**
 * Validate + coerce a persisted record into a well-formed Prototype at the
 * repository boundary. Returns null for records missing required identity so
 * the UI NEVER sees a malformed Prototype.
 */
function coercePrototype(raw: unknown): Prototype | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "string" || r.id.length === 0) return null;
  if (typeof r.name !== "string" || r.name.length === 0) return null;
  if (typeof r.route !== "string" || r.route.length === 0) return null;

  const str = (v: unknown, fallback = ""): string =>
    typeof v === "string" ? v : fallback;

  const createdAt = str(r.createdAt) || SEED[0].createdAt;

  const versions = Array.isArray(r.versions)
    ? r.versions
        .map((v) => coerceVersion(v, createdAt))
        .filter((v): v is PrototypeVersion => v !== null)
    : [];

  return {
    id: r.id,
    name: r.name,
    description: str(r.description),
    status: isStatus(r.status) ? r.status : "Draft",
    route: r.route,
    createdAt,
    versions,
    share: coerceShare(r.share),
  };
}

/** User-created / edited prototypes persisted locally. */
function readLocal(): Prototype[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const clean = parsed
      .map(coercePrototype)
      .filter((p): p is Prototype => p !== null);
    // Permanently backfill new version fields on legacy local records.
    if (JSON.stringify(clean) !== JSON.stringify(parsed)) {
      try {
        window.localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));
      } catch {
        // Reconciled values still remain available in memory when storage is
        // unavailable or full; a later read can retry the durable backfill.
      }
    }
    return clean;
  } catch {
    return [];
  }
}

function writeLocal(prototypes: Prototype[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prototypes));
  } catch {
    /* storage full / unavailable — non-fatal */
  }
}

/**
 * Merge seed with local overrides. A local record with the same id as a seed
 * OVERRIDES the seed (so edits to the seeded prototype persist); otherwise it
 * is appended. Seed entries not overridden are returned as-is.
 */
function readAll(): Prototype[] {
  const local = readLocal();
  const localById = new Map(local.map((p) => [p.id, p]));
  const merged: Prototype[] = SEED.map((s) => {
    const override = localById.get(s.id);
    // A local override fully replaces the seed. But newly-seeded versions
    // (e.g. V3 shipped after a user already persisted V1/V2) would otherwise
    // be invisible, so reconcile any seed versions the override is missing —
    // preserving append-only ordering (older seeded versions keep their slot).
    return override ? reconcileSeededVersions(override, s) : s;
  });
  for (const p of local) {
    if (!SEED.some((s) => s.id === p.id)) merged.push(p);
  }
  return merged;
}

/**
 * Ensure a persisted prototype carries every seeded version. Seeded versions
 * absent from the local record are appended in seed order (append-only), so a
 * seeded V3 becomes the newest/live version for users who already had V1/V2.
 * Locally-added versions are preserved and follow the seeded ones.
 */
function reconcileSeededVersions(
  local: Prototype,
  seed: Prototype,
): Prototype {
  const haveIds = new Set(local.versions.map((v) => v.id));
  const missingSeeded = seed.versions.filter((v) => !haveIds.has(v.id));
  if (missingSeeded.length === 0) return local;
  const seededHere = seed.versions.filter((v) => haveIds.has(v.id));
  const seedIds = new Set(seed.versions.map((v) => v.id));
  const localOnly = local.versions.filter((v) => !seedIds.has(v.id));
  // Order: existing seeded (in seed order) + newly-seeded + local-only extras.
  return {
    ...local,
    versions: [
      ...seed.versions.filter(
        (v) => haveIds.has(v.id) || missingSeeded.includes(v),
      ).map((sv) => {
        // Keep the user's copy of an already-persisted seeded version if any.
        const existing = seededHere.find((lv) => lv.id === sv.id);
        return existing ?? sv;
      }),
      ...localOnly,
    ],
  };
}

/**
 * Coerce + validate a mutation input before writing. Throws a clear Error when
 * identity/route is unusable so callers never silently persist a malformed
 * record; otherwise returns the normalized Prototype (same rules as reads).
 */
function validateForWrite(prototype: Prototype): Prototype {
  const coerced = coercePrototype(prototype);
  if (!coerced) {
    throw new Error(
      "prototypeStore: invalid prototype — id, name and route are required and must be non-empty strings.",
    );
  }
  return coerced;
}

/** Persist a full prototype record (seed override or new local entry). */
function persist(clean: Prototype): void {
  const local = readLocal();
  const idx = local.findIndex((p) => p.id === clean.id);
  if (idx >= 0) local[idx] = clean;
  else local.push(clean);
  writeLocal(local);
}

/** Next version label given existing versions ("V1", "V2", …). */
function nextVersionName(versions: PrototypeVersion[]): string {
  const max = versions.reduce((acc, v) => {
    const m = /^V(\d+)$/.exec(v.name);
    return m ? Math.max(acc, Number(m[1])) : acc;
  }, 0);
  return `V${max + 1}`;
}

export const localStorageRepository: PrototypeRepository = {
  list() {
    return readAll();
  },
  get(id) {
    return readAll().find((p) => p.id === id);
  },
  getByShareToken(token) {
    if (!token) return undefined;
    return readAll().find((p) => p.share.enabled && p.share.token === token);
  },
  create(prototype) {
    const clean = validateForWrite(prototype);
    persist(clean);
    return clean;
  },
  update(prototype) {
    const clean = validateForWrite(prototype);
    persist(clean);
    return clean;
  },
  addVersion(id, description) {
    const current = readAll().find((p) => p.id === id);
    if (!current) throw new Error(`prototypeStore: unknown prototype "${id}".`);
    const ts = nowIso();
    // First save auto-creates V1; subsequent saves append V2, V3, …
    // Freeze the CURRENT prototype data into this version's snapshot so
    // selecting it later shows what it looked like at save time.
    const version: PrototypeVersion = {
      id: newId("ver"),
      name: nextVersionName(current.versions),
      createdAt: ts,
      updatedAt: ts,
      description: description?.trim() || undefined,
      rendererKey:
        current.versions
          .filter((existing) => existing.status === "active")
          .slice(-1)[0]?.rendererKey ??
        "dashboard",
      status: "active",
      snapshot: {
        description: current.description,
        status: current.status,
      },
    };
    const clean = validateForWrite({ ...current, versions: [...current.versions, version] });
    persist(clean);
    return clean;
  },
  duplicateVersion(id, sourceVersionId) {
    const current = readAll().find((p) => p.id === id);
    if (!current) throw new Error(`prototypeStore: unknown prototype "${id}".`);
    const source = current.versions.find((version) => version.id === sourceVersionId);
    if (!source) {
      throw new Error(
        `prototypeStore: unknown version "${sourceVersionId}" for prototype "${id}".`,
      );
    }
    const ts = nowIso();
    const duplicate: PrototypeVersion = {
      id: newId("ver"),
      name: nextVersionName(current.versions),
      createdAt: ts,
      updatedAt: ts,
      description: source.description,
      rendererKey: source.rendererKey,
      status: "active",
      metadata: { createdFrom: source.name },
      snapshot: source.snapshot ? { ...source.snapshot } : undefined,
    };
    const clean = validateForWrite({
      ...current,
      versions: [...current.versions, duplicate],
    });
    persist(clean);
    return clean;
  },
  archiveVersion(id, versionId) {
    const current = readAll().find((p) => p.id === id);
    if (!current) throw new Error(`prototypeStore: unknown prototype "${id}".`);
    const active = current.versions.filter((version) => version.status === "active");
    const target = current.versions.find((version) => version.id === versionId);
    if (!target) {
      throw new Error(
        `prototypeStore: unknown version "${versionId}" for prototype "${id}".`,
      );
    }
    if (target.status === "active" && active.length <= 1) {
      throw new Error("prototypeStore: cannot archive the last active version.");
    }
    const ts = nowIso();
    const clean = validateForWrite({
      ...current,
      versions: current.versions.map((version) =>
        version.id === versionId
          ? { ...version, status: "archived", updatedAt: ts }
          : version,
      ),
    });
    persist(clean);
    return clean;
  },
  unarchiveVersion(id, versionId) {
    const current = readAll().find((p) => p.id === id);
    if (!current) throw new Error(`prototypeStore: unknown prototype "${id}".`);
    if (!current.versions.some((version) => version.id === versionId)) {
      throw new Error(
        `prototypeStore: unknown version "${versionId}" for prototype "${id}".`,
      );
    }
    const ts = nowIso();
    const clean = validateForWrite({
      ...current,
      versions: current.versions.map((version) =>
        version.id === versionId
          ? { ...version, status: "active", updatedAt: ts }
          : version,
      ),
    });
    persist(clean);
    return clean;
  },
  setShare(id, share) {
    const current = readAll().find((p) => p.id === id);
    if (!current) throw new Error(`prototypeStore: unknown prototype "${id}".`);
    const clean = validateForWrite({ ...current, share: coerceShare(share) });
    persist(clean);
    return clean;
  },
  remove(id) {
    writeLocal(readLocal().filter((p) => p.id !== id));
  },
};

// The UI imports this alias so swapping the backend is a one-line change.
export const prototypeRepository: PrototypeRepository = localStorageRepository;

/* ---------------------------------------------------------------------- */
/* FUTURE: version compare/diff                                            */
/* ---------------------------------------------------------------------- */
// A future `compareVersions(id, aId, bId)` would diff two version snapshots
// (once versions carry a `snapshot` payload) and power a side-by-side compare
// view in the Prototype Viewer. Intentionally NOT implemented yet.
