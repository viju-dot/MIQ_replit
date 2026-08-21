/**
 * Prototype Design Annotations — region-based design-feedback data model +
 * persistence.
 *
 * A SIBLING feature to Comments (see commentStore.ts) — deliberately NOT merged
 * (spec §14). A Design Annotation captures a STRUCTURED, regional design
 * instruction: a rectangular region (or none, for a page-level annotation),
 * what needs to change (the primary, required field), optional change types,
 * optional design-system guidance, an optional "why", an apply scope, a status
 * and an author, all anchored to the prototype + the version it was left
 * against so feedback↔version mapping is unambiguous.
 *
 * Persistence mirrors commentStore's shape: a small repository interface behind
 * a localStorage implementation with validation/coercion at the read boundary
 * so the UI NEVER sees a malformed record. Swap `localStorageRepository` for an
 * HTTP/DB-backed implementation and the UI keeps working unchanged.
 *
 * Delete is HARD (records are removed) — annotations are authoring artefacts,
 * not a discussion history, so a soft-delete/ghost state adds no value here.
 */

const STORAGE_KEY = "fiber:ai-prototype:annotations:v1";

/* ---------------------------------------------------------------------- */
/* Enums (kept as string unions + option arrays for the UI)                */
/* ---------------------------------------------------------------------- */

/** Optional classification of the change (spec §6). Multi-select. */
export type ChangeType =
  | "Design system correction"
  | "Use-case correction"
  | "Layout correction"
  | "Interaction correction"
  | "Visual correction"
  | "Content correction"
  | "Accessibility correction"
  | "Other";

export const CHANGE_TYPES: readonly ChangeType[] = [
  "Design system correction",
  "Use-case correction",
  "Layout correction",
  "Interaction correction",
  "Visual correction",
  "Content correction",
  "Accessibility correction",
  "Other",
];

/** Optional design-system guidance (spec §7). Default: "Not sure". */
export type DsGuidance =
  | "Use Fiber component"
  | "Follow Fiber pattern"
  | "Use existing component if suitable"
  | "Custom pattern required"
  | "Not sure — determine the best option";

export const DS_GUIDANCE_OPTIONS: readonly DsGuidance[] = [
  "Use Fiber component",
  "Follow Fiber pattern",
  "Use existing component if suitable",
  "Custom pattern required",
  "Not sure — determine the best option",
];

export const DEFAULT_DS_GUIDANCE: DsGuidance =
  "Not sure — determine the best option";

/** How broadly the change should apply (spec §10). Default: "Selected region only". */
export type ApplyScope =
  | "Selected region only"
  | "Similar elements in this section"
  | "All matching elements on this page"
  | "All matching elements across the prototype";

export const APPLY_SCOPES: readonly ApplyScope[] = [
  "Selected region only",
  "Similar elements in this section",
  "All matching elements on this page",
  "All matching elements across the prototype",
];

export const DEFAULT_APPLY_SCOPE: ApplyScope = "Selected region only";

/**
 * Display label for a scope, contextualised to the selection kind. When
 * elements were picked the first scope reads "Selected elements only" instead
 * of "Selected region only" (spec §21) — stored value is unchanged.
 */
export function scopeLabel(scope: ApplyScope, kind: SelectionKind): string {
  if (scope === "Selected region only") {
    if (kind === "elements") return "Selected elements only";
    if (kind === "page") return "This page";
  }
  return scope;
}

/** Lifecycle status of an annotation (spec §12). Default: "Open". */
export type AnnotationStatus =
  | "Open"
  | "In progress"
  | "Applied"
  | "Needs review"
  | "Resolved";

export const ANNOTATION_STATUSES: readonly AnnotationStatus[] = [
  "Open",
  "In progress",
  "Applied",
  "Needs review",
  "Resolved",
];

export const DEFAULT_STATUS: AnnotationStatus = "Open";

/* ---------------------------------------------------------------------- */
/* Region + record                                                         */
/* ---------------------------------------------------------------------- */

/**
 * The rectangular region an annotation covers, stored as PERCENTAGES of the
 * versioned content canvas (same coordinate root as comment anchors) so the
 * region scales correctly across viewports. `label` is a best-effort, human
 * readable description of the covered section(s) + element count.
 */
export interface AnnotationRegion {
  xPct: number;
  yPct: number;
  wPct: number;
  hPct: number;
  label: string;
}

/**
 * How the elements/region were chosen (spec §8, §17). Drives the marker/badge
 * treatment and the "Apply change to" default label.
 *   • "elements" — one or more UI elements picked via hover→click (PRIMARY).
 *   • "region"   — a dragged rectangle (SECONDARY); may still carry detected
 *                  elements (smart region, spec §9).
 *   • "page"     — a page-level annotation with no geometry.
 */
export type SelectionKind = "elements" | "region" | "page";

export const SELECTION_KINDS: readonly SelectionKind[] = [
  "elements",
  "region",
  "page",
];

/**
 * A single structured reference to a selected UI element (spec §10–§14). We
 * store the human LABEL, the ancestor breadcrumb PATH (root→element, meaningful
 * levels only) and a percentage RECT SNAPSHOT of the element against the canvas
 * so markers/highlights can render even if the element can't be re-found later.
 * `annotateKey` (from a data-annotate attribute) lets us prefer the live rect on
 * re-render when the element still exists.
 */
export interface SelectedElement {
  /** User-facing label, e.g. "Temporal Insights", "Streaming filter". */
  label: string;
  /** Ancestor breadcrumb (root→element), meaningful levels only, capped ~4. */
  path: string[];
  /** Percent-of-canvas rect snapshot at capture time. */
  rectPct: { xPct: number; yPct: number; wPct: number; hPct: number };
  /** Optional stable key (data-annotate value) for live re-anchoring. */
  annotateKey?: string;
}

/** A single design annotation left on a prototype, against a specific version. */
export interface DesignAnnotation {
  id: string;
  /** Chronological, stable sequence number (per prototype). Shown as #NN. */
  seq: number;
  prototypeId: string;
  /** The version this annotation was left against (stable id). */
  versionId: string;
  /** Human label of that version, e.g. "V2" (denormalised for display). */
  versionName: string;
  /** Annotation author display name. */
  author: string;
  createdAt: string;
  /** How the target was chosen (elements / region / page). */
  selectionKind: SelectionKind;
  /**
   * The covered region, or null for a PAGE-LEVEL annotation (spec §21) which
   * has no region and renders its marker in a fixed rail. For element
   * selections this holds the COMPUTED bounding rect so markers/highlights
   * still render geometrically (label describes the elements).
   */
  region: AnnotationRegion | null;
  /**
   * Structured references to the selected UI elements (spec §10–§14). Empty for
   * page-level annotations and legacy region records (migrated as []).
   */
  elements: SelectedElement[];
  /**
   * Dominant / common-ancestor section label for the selection (spec §10),
   * e.g. "Temporal Insights". Empty when unknown.
   */
  sectionLabel: string;
  /** Primary, required: "What needs to change?". */
  what: string;
  /** Optional: "Why should this change?". */
  why: string;
  /** Optional multi-select change types. */
  types: ChangeType[];
  /** Optional design-system guidance (defaults to "Not sure"). */
  dsGuidance: DsGuidance;
  /** How broadly the change applies (defaults to selected region only). */
  scope: ApplyScope;
  /** Lifecycle status (defaults to Open). */
  status: AnnotationStatus;
}

/* ---------------------------------------------------------------------- */
/* id + time helpers                                                       */
/* ---------------------------------------------------------------------- */

let idCounter = 0;

/** A collision-resistant id (crypto.randomUUID when available). */
export function newAnnotationId(prefix = "annotation"): string {
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

/** Input required to add an annotation (identity/seq/timestamps generated here). */
export interface NewAnnotationInput {
  prototypeId: string;
  versionId: string;
  versionName: string;
  author: string;
  selectionKind?: SelectionKind;
  region: AnnotationRegion | null;
  elements?: SelectedElement[];
  sectionLabel?: string;
  what: string;
  why?: string;
  types?: ChangeType[];
  dsGuidance?: DsGuidance;
  scope?: ApplyScope;
}

/** Fields that may be edited on an existing annotation. */
export interface AnnotationPatch {
  region?: AnnotationRegion | null;
  elements?: SelectedElement[];
  sectionLabel?: string;
  what?: string;
  why?: string;
  types?: ChangeType[];
  dsGuidance?: DsGuidance;
  scope?: ApplyScope;
  status?: AnnotationStatus;
}

export interface AnnotationRepository {
  /** All annotations for a prototype, newest-first. */
  list(prototypeId: string): DesignAnnotation[];
  /** Distinct author names across ALL annotations (for the name combobox). */
  listAuthors(): string[];
  /** Persist a new annotation. Throws on empty author/what. */
  add(input: NewAnnotationInput): DesignAnnotation;
  /** Patch an existing annotation by id (partial update). */
  update(id: string, patch: AnnotationPatch): void;
  /** HARD delete an annotation by id. */
  remove(id: string): void;
}

/* ---------------------------------------------------------------------- */
/* Coercion (read boundary)                                                */
/* ---------------------------------------------------------------------- */

function clampPct(n: number): number {
  return Math.min(100, Math.max(0, n));
}

function coerceRegion(raw: unknown): AnnotationRegion | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const num = (v: unknown): number | null =>
    typeof v === "number" && Number.isFinite(v) ? v : null;
  const x = num(r.xPct);
  const y = num(r.yPct);
  const w = num(r.wPct);
  const h = num(r.hPct);
  if (x === null || y === null || w === null || h === null) return null;
  // A zero-area region is meaningless — treat as page-level (null).
  const wPct = clampPct(w);
  const hPct = clampPct(h);
  if (wPct <= 0 || hPct <= 0) return null;
  const label = typeof r.label === "string" ? r.label.trim() : "";
  return {
    xPct: clampPct(x),
    yPct: clampPct(y),
    wPct,
    hPct,
    label: label || "Selected region",
  };
}

function coerceElement(raw: unknown): SelectedElement | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const label = typeof r.label === "string" ? r.label.trim() : "";
  if (label.length === 0) return null;
  const path = Array.isArray(r.path)
    ? r.path.filter((p): p is string => typeof p === "string" && p.length > 0).slice(0, 6)
    : [];
  const rectRaw = r.rectPct as Record<string, unknown> | undefined;
  const num = (v: unknown): number =>
    typeof v === "number" && Number.isFinite(v) ? v : 0;
  const rectPct = rectRaw
    ? {
        xPct: clampPct(num(rectRaw.xPct)),
        yPct: clampPct(num(rectRaw.yPct)),
        wPct: clampPct(num(rectRaw.wPct)),
        hPct: clampPct(num(rectRaw.hPct)),
      }
    : { xPct: 0, yPct: 0, wPct: 0, hPct: 0 };
  const out: SelectedElement = { label, path, rectPct };
  if (typeof r.annotateKey === "string" && r.annotateKey.length > 0) {
    out.annotateKey = r.annotateKey;
  }
  return out;
}

function coerceElements(raw: unknown): SelectedElement[] {
  if (!Array.isArray(raw)) return [];
  const out: SelectedElement[] = [];
  for (const v of raw) {
    const el = coerceElement(v);
    if (el) out.push(el);
  }
  return out;
}

function coerceSelectionKind(
  raw: unknown,
  region: AnnotationRegion | null,
  elements: SelectedElement[],
): SelectionKind {
  if (typeof raw === "string" && SELECTION_KINDS.includes(raw as SelectionKind)) {
    return raw as SelectionKind;
  }
  // Legacy records had no selectionKind — infer from geometry.
  if (!region) return "page";
  return elements.length > 0 ? "elements" : "region";
}

function coerceTypes(raw: unknown): ChangeType[] {
  if (!Array.isArray(raw)) return [];
  const valid = new Set<string>(CHANGE_TYPES);
  const out: ChangeType[] = [];
  for (const v of raw) {
    if (typeof v === "string" && valid.has(v) && !out.includes(v as ChangeType)) {
      out.push(v as ChangeType);
    }
  }
  return out;
}

function coerceDsGuidance(raw: unknown): DsGuidance {
  return typeof raw === "string" && DS_GUIDANCE_OPTIONS.includes(raw as DsGuidance)
    ? (raw as DsGuidance)
    : DEFAULT_DS_GUIDANCE;
}

function coerceScope(raw: unknown): ApplyScope {
  return typeof raw === "string" && APPLY_SCOPES.includes(raw as ApplyScope)
    ? (raw as ApplyScope)
    : DEFAULT_APPLY_SCOPE;
}

function coerceStatus(raw: unknown): AnnotationStatus {
  return typeof raw === "string" &&
    ANNOTATION_STATUSES.includes(raw as AnnotationStatus)
    ? (raw as AnnotationStatus)
    : DEFAULT_STATUS;
}

function coerceAnnotation(raw: unknown): DesignAnnotation | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  const str = (v: unknown, fb = ""): string => (typeof v === "string" ? v : fb);

  if (typeof r.id !== "string" || r.id.length === 0) return null;
  if (typeof r.prototypeId !== "string" || r.prototypeId.length === 0) return null;
  if (typeof r.versionId !== "string" || r.versionId.length === 0) return null;

  const author = str(r.author).trim();
  const what = str(r.what).trim();
  if (author.length === 0 || what.length === 0) return null;

  const createdAtRaw = str(r.createdAt);
  if (createdAtRaw.length === 0 || Number.isNaN(Date.parse(createdAtRaw))) return null;

  const seq =
    typeof r.seq === "number" && Number.isFinite(r.seq) && r.seq > 0
      ? Math.round(r.seq)
      : 0;

  const region = coerceRegion(r.region);
  const elements = coerceElements(r.elements);
  return {
    id: r.id,
    seq,
    prototypeId: r.prototypeId,
    versionId: r.versionId,
    versionName: str(r.versionName) || "—",
    author,
    createdAt: createdAtRaw,
    selectionKind: coerceSelectionKind(r.selectionKind, region, elements),
    region,
    elements,
    sectionLabel: str(r.sectionLabel).trim(),
    what,
    why: str(r.why).trim(),
    types: coerceTypes(r.types),
    dsGuidance: coerceDsGuidance(r.dsGuidance),
    scope: coerceScope(r.scope),
    status: coerceStatus(r.status),
  };
}

function readAll(): DesignAnnotation[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map(coerceAnnotation)
      .filter((a): a is DesignAnnotation => a !== null);
  } catch {
    return [];
  }
}

/** Persist the full list. THROWS on quota/serialization failure. */
function writeAll(annotations: DesignAnnotation[]): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(annotations));
}

/** Best-effort persist that swallows failures (delete / update paths). */
function writeAllQuiet(annotations: DesignAnnotation[]): void {
  try {
    writeAll(annotations);
  } catch {
    /* storage full / unavailable — non-fatal for a local authoring tool */
  }
}

/** Newest-first by PARSED timestamp (not lexical). */
const byRecent = (a: DesignAnnotation, b: DesignAnnotation) =>
  Date.parse(b.createdAt) - Date.parse(a.createdAt);

export const localStorageRepository: AnnotationRepository = {
  list(prototypeId) {
    return readAll()
      .filter((a) => a.prototypeId === prototypeId)
      .sort(byRecent);
  },
  listAuthors() {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const a of readAll()) {
      const key = a.author.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        out.push(a.author);
      }
    }
    return out.sort((a, b) => a.localeCompare(b));
  },
  add(input) {
    const author = input.author.trim();
    const what = input.what.trim();
    if (!input.prototypeId) throw new Error("annotationStore: prototypeId is required.");
    if (!input.versionId) throw new Error("annotationStore: versionId is required.");
    if (author.length === 0) throw new Error("annotationStore: author is required.");
    if (what.length === 0) throw new Error("annotationStore: what is required.");

    const all = readAll();

    // Unique id (defends against the timestamp fallback + persisted collisions).
    const existingIds = new Set(all.map((a) => a.id));
    let id = newAnnotationId();
    while (existingIds.has(id)) id = newAnnotationId();

    // Chronological, stable seq number PER PROTOTYPE. Max existing seq + 1 so
    // numbering is monotonic and never reused (stays stable across deletes).
    const maxSeq = all
      .filter((a) => a.prototypeId === input.prototypeId)
      .reduce((m, a) => Math.max(m, a.seq), 0);

    const region = coerceRegion(input.region);
    const elements = coerceElements(input.elements);
    const annotation: DesignAnnotation = {
      id,
      seq: maxSeq + 1,
      prototypeId: input.prototypeId,
      versionId: input.versionId,
      versionName: input.versionName || "—",
      author,
      createdAt: nowIso(),
      selectionKind: coerceSelectionKind(input.selectionKind, region, elements),
      region,
      elements,
      sectionLabel: (input.sectionLabel ?? "").trim(),
      what,
      why: (input.why ?? "").trim(),
      types: coerceTypes(input.types),
      dsGuidance: coerceDsGuidance(input.dsGuidance),
      scope: coerceScope(input.scope),
      status: DEFAULT_STATUS,
    };
    all.push(annotation);
    writeAll(all); // may THROW (quota) — nothing persisted so caller can retry
    return annotation;
  },
  update(id, patch) {
    const all = readAll();
    let changed = false;
    const next = all.map((a) => {
      if (a.id !== id) return a;
      changed = true;
      const merged: DesignAnnotation = { ...a };
      if (patch.region !== undefined) merged.region = coerceRegion(patch.region);
      if (patch.elements !== undefined) merged.elements = coerceElements(patch.elements);
      if (patch.sectionLabel !== undefined)
        merged.sectionLabel = patch.sectionLabel.trim();
      if (patch.region !== undefined || patch.elements !== undefined) {
        // Keep selectionKind consistent with the new geometry (page-level stays
        // page-level; region↔elements follows whether elements remain).
        merged.selectionKind =
          a.selectionKind === "page" && merged.region === null
            ? "page"
            : coerceSelectionKind(merged.selectionKind, merged.region, merged.elements);
      }
      if (patch.what !== undefined) {
        const w = patch.what.trim();
        if (w.length > 0) merged.what = w; // never blank out the required field
      }
      if (patch.why !== undefined) merged.why = patch.why.trim();
      if (patch.types !== undefined) merged.types = coerceTypes(patch.types);
      if (patch.dsGuidance !== undefined)
        merged.dsGuidance = coerceDsGuidance(patch.dsGuidance);
      if (patch.scope !== undefined) merged.scope = coerceScope(patch.scope);
      if (patch.status !== undefined) merged.status = coerceStatus(patch.status);
      return merged;
    });
    if (changed) writeAllQuiet(next);
  },
  remove(id) {
    const all = readAll();
    const next = all.filter((a) => a.id !== id);
    if (next.length !== all.length) writeAllQuiet(next);
  },
};

// The UI imports this alias so swapping the backend is a one-line change.
export const annotationRepository: AnnotationRepository = localStorageRepository;
