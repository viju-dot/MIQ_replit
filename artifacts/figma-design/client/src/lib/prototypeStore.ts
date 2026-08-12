/**
 * Prototype registry — the source of truth for AI Prototype workspace entries.
 *
 * AI Prototype is the central workspace: each prototype can be opened directly,
 * mapped in Flow Chart (/flow-chart/:prototypeId) and validated in Usability
 * Testing (/usability-testing/:prototypeId).
 *
 * ── Architecture seams (mirrors ruleStore.ts) ────────────────────────────
 *  • Persistence is behind a small repository interface. Today it is a static
 *    seed merged with any locally-created prototypes (localStorage). Replace
 *    `localStorageRepository` with an HTTP/DB-backed implementation and the UI
 *    keeps working unchanged.
 *  • The seed contains the one real prototype (TV Audience Intelligence). New
 *    prototypes can be appended later without touching the UI.
 */

export const PROTOTYPE_STATUSES = ["Live", "Draft", "Archived"] as const;
export type PrototypeStatus = (typeof PROTOTYPE_STATUSES)[number];

/** A single registered prototype. */
export interface Prototype {
  id: string;
  name: string;
  description: string;
  status: PrototypeStatus;
  /** Client-side route that opens the prototype experience itself. */
  route: string;
  createdAt: string;
}

const STORAGE_KEY = "fiber:ai-prototype:prototypes:v1";

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
  },
];

/* ---------------------------------------------------------------------- */
/* Repository interface (backend-swap seam)                                */
/* ---------------------------------------------------------------------- */

export interface PrototypeRepository {
  list(): Prototype[];
  get(id: string): Prototype | undefined;
  create(prototype: Prototype): Prototype;
  update(prototype: Prototype): Prototype;
  remove(id: string): void;
}

function isStatus(v: unknown): v is PrototypeStatus {
  return typeof v === "string" && (PROTOTYPE_STATUSES as readonly string[]).includes(v);
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

  return {
    id: r.id,
    name: r.name,
    description: str(r.description),
    status: isStatus(r.status) ? r.status : "Draft",
    route: r.route,
    createdAt: str(r.createdAt) || SEED[0].createdAt,
  };
}

/** User-created prototypes persisted locally (kept separate from the seed). */
function readLocal(): Prototype[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(coercePrototype).filter((p): p is Prototype => p !== null);
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

/** Seed + local, de-duplicated by id (seed wins on id collision). */
function readAll(): Prototype[] {
  const local = readLocal().filter((p) => !SEED.some((s) => s.id === p.id));
  return [...SEED, ...local];
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

export const localStorageRepository: PrototypeRepository = {
  list() {
    return readAll();
  },
  get(id) {
    return readAll().find((p) => p.id === id);
  },
  create(prototype) {
    const clean = validateForWrite(prototype);
    const local = readLocal();
    local.push(clean);
    writeLocal(local);
    return clean;
  },
  update(prototype) {
    const clean = validateForWrite(prototype);
    const local = readLocal();
    const idx = local.findIndex((p) => p.id === clean.id);
    if (idx >= 0) local[idx] = clean;
    else local.push(clean);
    writeLocal(local);
    return clean;
  },
  remove(id) {
    writeLocal(readLocal().filter((p) => p.id !== id));
  },
};

// The UI imports this alias so swapping the backend is a one-line change.
export const prototypeRepository: PrototypeRepository = localStorageRepository;
