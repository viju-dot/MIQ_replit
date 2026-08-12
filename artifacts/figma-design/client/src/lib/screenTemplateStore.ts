/**
 * Screen Template registry — the source of truth for the Screen Templates
 * module: a read-only reference library of best-practice Fiber Design System
 * screens.
 *
 * PURPOSE
 *  Component pages (Design System) and Component Rules teach the AI about
 *  individual components; Screen Templates teach it how those components are
 *  *composed* into complete product screens — layout patterns, Auto Layout
 *  usage, spacing relationships, component hierarchy and content structure.
 *  These templates are references only: there is NO editing here.
 *
 * ── Architecture seams (mirrors prototypeStore.ts / ruleStore.ts) ─────────
 *  • Persistence is behind a small repository interface. Today it is a static
 *    seed (the 8 harvested Fiber screens) merged with any locally-created /
 *    edited templates (localStorage). Swap `localStorageRepository` for an
 *    HTTP/DB-backed implementation and the UI keeps working unchanged.
 *  • The seed contains the harvested Fiber screen templates. Each record is
 *    validated + coerced at the repository boundary so the UI NEVER sees a
 *    malformed template.
 *  • FUTURE (structure only, not implemented): `listTemplatesForAiContext()`
 *    exposes a typed, serializable view for grounding AI-generated prototypes.
 */

/* ---------------------------------------------------------------------- */
/* Types                                                                   */
/* ---------------------------------------------------------------------- */

/** Canvas dimensions of the source Figma frame (px). */
export interface CanvasSize {
  width: number;
  height: number;
}

/**
 * A node in the Auto Layout hierarchy captured from the Figma structure XML.
 * Each screen is a vertical page flow: Navigation → body frame → Footer.
 */
export interface AutoLayoutNode {
  /** Node label as it appears in Figma (e.g. "Navigation", "body"). */
  name: string;
  /** Node kind — Figma instances vs. layout frames. */
  kind: "instance" | "frame";
  /** Short human note describing this node's role / spacing. */
  note?: string;
  /** Nested children, top-to-bottom in the vertical flow. */
  children?: AutoLayoutNode[];
}

/** A single reference screen template. */
export interface ScreenTemplate {
  /** Stable id (derived from the Figma node id, e.g. "60141-191669"). */
  id: string;
  /** Figma node id in "60141:191669" form. */
  nodeId: string;
  /** Human screen name. */
  name: string;
  /** What the screen is and why it is a good reference. */
  description: string;
  /** Source Figma frame size. */
  canvasSize: CanvasSize;
  /** Direct link to the source frame in Figma. */
  figmaUrl: string;
  /** Fiber Design System components composed into this screen. */
  associatedComponents: string[];
  /** Plain-language summary of the layout structure. */
  layoutStructure: string;
  /** Vertical Auto Layout hierarchy captured from the Figma structure. */
  autoLayoutHierarchy: AutoLayoutNode[];
  /** Optional design notes / rationale. */
  designNotes?: string;
}

const STORAGE_KEY = "fiber:screen-templates:templates:v1";

/* ---------------------------------------------------------------------- */
/* Static seed (the 8 harvested Fiber templates)                           */
/* ---------------------------------------------------------------------- */

/**
 * Standard Fiber page shell shared by every harvested screen: a top-level
 * "Page" instance laying out a fixed Navigation bar, a scrollable body frame,
 * and a footer frame — all stacked vertically.
 *
 * `bodyPadding` is the horizontal padding (px) applied inside the body frame
 * (0, 32 or 64 in the harvested set); `footerHidden` records whether the
 * Footer - Page instance is present but hidden in the source frame.
 */
function pageShell(opts: {
  bodyContentName: string;
  bodyPadding: number;
  footerHidden: boolean;
}): AutoLayoutNode[] {
  const paddingNote =
    opts.bodyPadding > 0
      ? `Content frame with ${opts.bodyPadding}px horizontal side padding`
      : "Full-bleed content frame (no side padding)";
  return [
    {
      name: "Page",
      kind: "instance",
      note: "Top-level vertical page flow: navigation, body, footer stacked top-to-bottom",
      children: [
        {
          name: "Navigation",
          kind: "instance",
          note: "Fixed top navigation bar (120px tall), pinned to the top of the page",
        },
        {
          name: "body",
          kind: "frame",
          note: `${paddingNote}; starts 152px below the top (below the navigation)`,
          children: [
            {
              name: opts.bodyContentName,
              kind: "instance",
              note: "Screen-specific body content composed from Fiber components",
            },
          ],
        },
        {
          name: "Frame 3386",
          kind: "frame",
          note: "Footer container pinned to the bottom of the page",
          children: [
            {
              name: "Footer - Page",
              kind: "instance",
              note: opts.footerHidden
                ? "Page footer (hidden in this frame)"
                : "Page footer (visible)",
            },
          ],
        },
      ],
    },
  ];
}

const SEED: ScreenTemplate[] = [
  {
    id: "60141-191669",
    nodeId: "60141:191669",
    name: "OMC Activation — Step 1",
    description:
      "The opening step of the OMC activation flow. A clean full-width entry screen that establishes the multi-step activation pattern beneath the standard Fiber navigation.",
    canvasSize: { width: 1280, height: 793 },
    figmaUrl:
      "https://www.figma.com/design/cRnPCxZX2PHu3DCNT2RWfy/branch/Dmze2bKgXnIf8qQ3lqPjlK/Sigma---CRAC?node-id=60141-191669",
    associatedComponents: ["Navigation", "Stepper", "Card", "Button", "Footer - Page"],
    layoutStructure:
      "Fixed top navigation over a full-bleed body frame (no side padding) that hosts the Step 1 activation content, with a page footer frame at the bottom (hidden in this frame).",
    autoLayoutHierarchy: pageShell({
      bodyContentName: "OMC Activation - Step 1",
      bodyPadding: 0,
      footerHidden: true,
    }),
    designNotes:
      "First screen in a linear activation wizard — use it as the reference for step-based entry layouts that lean on the full page width.",
  },
  {
    id: "60948-294415",
    nodeId: "60948:294415",
    name: "OMC Activation — Competitive Conquesting",
    description:
      "A later OMC activation step focused on competitive conquesting. A taller full-width screen showing how a data-dense activation step is composed within the standard page shell.",
    canvasSize: { width: 1280, height: 1469 },
    figmaUrl:
      "https://www.figma.com/design/cRnPCxZX2PHu3DCNT2RWfy/branch/Dmze2bKgXnIf8qQ3lqPjlK/Sigma---CRAC?node-id=60948-294415",
    associatedComponents: ["Navigation", "Stepper", "Card", "Table", "Chart", "Footer - Page"],
    layoutStructure:
      "Fixed top navigation over a full-bleed body frame (no side padding) carrying the competitive conquesting content, with a footer frame at the bottom (hidden in this frame).",
    autoLayoutHierarchy: pageShell({
      bodyContentName: "OMC Activation - Step 4 - Competitive Conquesting",
      bodyPadding: 0,
      footerHidden: true,
    }),
    designNotes:
      "Reference for data-heavy activation steps: how tables and charts stack vertically inside a full-width body frame.",
  },
  {
    id: "60948-858701",
    nodeId: "60948:858701",
    name: "OMC Activation — Reach & Frequency Optimization",
    description:
      "A long-form OMC activation step for reach & frequency optimization. Demonstrates how an extended, scroll-heavy analytical step is organized within the Fiber page shell.",
    canvasSize: { width: 1280, height: 2435 },
    figmaUrl:
      "https://www.figma.com/design/cRnPCxZX2PHu3DCNT2RWfy/branch/Dmze2bKgXnIf8qQ3lqPjlK/Sigma---CRAC?node-id=60948-858701",
    associatedComponents: ["Navigation", "Stepper", "Card", "Chart", "Slider", "Footer - Page"],
    layoutStructure:
      "Fixed top navigation over a tall full-bleed body frame (no side padding) that stacks reach & frequency optimization modules, with a footer frame at the bottom (hidden in this frame).",
    autoLayoutHierarchy: pageShell({
      bodyContentName: "OMC Activation - Step 4 - Reach & Frequency Optimization",
      bodyPadding: 0,
      footerHidden: true,
    }),
    designNotes:
      "Good reference for long, scroll-heavy optimization screens where multiple analytical modules stack vertically.",
  },
  {
    id: "61689-177110",
    nodeId: "61689:177110",
    name: "Activation Strategy Review",
    description:
      "A review screen summarizing the activation strategy. A padded, content-centered layout that shows how a summary/review step is framed within consistent side gutters.",
    canvasSize: { width: 1280, height: 1614 },
    figmaUrl:
      "https://www.figma.com/design/cRnPCxZX2PHu3DCNT2RWfy/branch/Dmze2bKgXnIf8qQ3lqPjlK/Sigma---CRAC?node-id=61689-177110",
    associatedComponents: ["Navigation", "Card", "Summary List", "Button", "Footer - Page"],
    layoutStructure:
      "Fixed top navigation over a body frame with 64px horizontal side padding (1152px content column) carrying the strategy review content, with a visible page footer at the bottom.",
    autoLayoutHierarchy: pageShell({
      bodyContentName: "Activation Strategy review 4",
      bodyPadding: 64,
      footerHidden: false,
    }),
    designNotes:
      "Reference for review / summary screens: a centered content column with generous 64px gutters and a visible footer.",
  },
  {
    id: "62298-272589",
    nodeId: "62298:272589",
    name: "Intelligence Patient Hub",
    description:
      "A comprehensive intelligence hub for patient data. An extensive dashboard-style screen showing how a large amount of analytical content is organized inside a padded content column.",
    canvasSize: { width: 1280, height: 4396 },
    figmaUrl:
      "https://www.figma.com/design/cRnPCxZX2PHu3DCNT2RWfy/branch/Dmze2bKgXnIf8qQ3lqPjlK/Sigma---CRAC?node-id=62298-272589",
    associatedComponents: ["Navigation", "Card", "Chart", "Table", "Tabs", "Footer - Page"],
    layoutStructure:
      "Fixed top navigation over a very tall body frame with 64px horizontal side padding (1152px content column) that stacks patient-intelligence modules, with a footer frame at the bottom (hidden in this frame).",
    autoLayoutHierarchy: pageShell({
      bodyContentName: "Intelligence patient hub",
      bodyPadding: 64,
      footerHidden: true,
    }),
    designNotes:
      "The most content-dense reference: a great example of how many analytical modules (charts, tables, tabs) stack in a single padded column.",
  },
  {
    id: "66895-318383",
    nodeId: "66895:318383",
    name: "Campaign Planning — Stage 1",
    description:
      "The first stage of campaign planning on a narrower 1024px canvas. Shows how the page shell adapts to a tighter viewport with reduced 32px side gutters.",
    canvasSize: { width: 1024, height: 2403 },
    figmaUrl:
      "https://www.figma.com/design/cRnPCxZX2PHu3DCNT2RWfy/branch/Dmze2bKgXnIf8qQ3lqPjlK/Sigma---CRAC?node-id=66895-318383",
    associatedComponents: ["Navigation", "Stepper", "Card", "Form", "Button", "Footer - Page"],
    layoutStructure:
      "Fixed top navigation over a body frame with 32px horizontal side padding (960px content column on a 1024px canvas), with a visible page footer at the bottom.",
    autoLayoutHierarchy: pageShell({
      bodyContentName: "campaign planning stage 1",
      bodyPadding: 32,
      footerHidden: false,
    }),
    designNotes:
      "Reference for narrower (1024px) layouts: the same page shell with tighter 32px gutters instead of 64px.",
  },
  {
    id: "67205-212808",
    nodeId: "67205:212808",
    name: "Plan Channel",
    description:
      "A channel planning screen for building out media plans. A long padded layout demonstrating how channel-level planning content is composed within the standard page shell.",
    canvasSize: { width: 1280, height: 4302 },
    figmaUrl:
      "https://www.figma.com/design/cRnPCxZX2PHu3DCNT2RWfy/branch/Dmze2bKgXnIf8qQ3lqPjlK/Sigma---CRAC?node-id=67205-212808",
    associatedComponents: ["Navigation", "Card", "Table", "Chart", "Button", "Footer - Page"],
    layoutStructure:
      "Fixed top navigation over a tall body frame with 64px horizontal side padding (1152px content column) carrying channel planning content, with a visible page footer at the bottom.",
    autoLayoutHierarchy: pageShell({
      bodyContentName: "Plan channel",
      bodyPadding: 64,
      footerHidden: false,
    }),
    designNotes:
      "Reference for long planning workspaces: how tables, charts and controls stack in a padded column with a visible footer.",
  },
  {
    id: "68993-615950",
    nodeId: "68993:615950",
    name: "Campaign Planning — Step 4",
    description:
      "The fourth step of campaign planning. A padded, wizard-style screen showing a later step in the planning flow within consistent side gutters.",
    canvasSize: { width: 1280, height: 1960 },
    figmaUrl:
      "https://www.figma.com/design/cRnPCxZX2PHu3DCNT2RWfy/branch/Dmze2bKgXnIf8qQ3lqPjlK/Sigma---CRAC?node-id=68993-615950",
    associatedComponents: ["Navigation", "Stepper", "Card", "Form", "Button", "Footer - Page"],
    layoutStructure:
      "Fixed top navigation over a body frame with 64px horizontal side padding (1152px content column) carrying the Step 4 planning content, with a visible page footer at the bottom.",
    autoLayoutHierarchy: pageShell({
      bodyContentName: "Step 4",
      bodyPadding: 64,
      footerHidden: false,
    }),
    designNotes:
      "Reference for later steps in a multi-step planning wizard, using the padded 64px content column and a visible footer.",
  },
];

/* ---------------------------------------------------------------------- */
/* Validation / coercion (repository boundary)                             */
/* ---------------------------------------------------------------------- */

function str(v: unknown, fallback = ""): string {
  return typeof v === "string" ? v : fallback;
}

function coerceStringArray(v: unknown): string[] {
  if (!Array.isArray(v)) return [];
  return v.filter((x): x is string => typeof x === "string" && x.length > 0);
}

function coerceCanvasSize(v: unknown): CanvasSize {
  const r = (v && typeof v === "object" ? v : {}) as Record<string, unknown>;
  const num = (x: unknown): number => (typeof x === "number" && Number.isFinite(x) ? x : 0);
  return { width: num(r.width), height: num(r.height) };
}

function coerceLayoutNode(raw: unknown): AutoLayoutNode | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.name !== "string" || r.name.length === 0) return null;
  const kind = r.kind === "instance" || r.kind === "frame" ? r.kind : "frame";
  const children = Array.isArray(r.children)
    ? r.children.map(coerceLayoutNode).filter((n): n is AutoLayoutNode => n !== null)
    : undefined;
  return {
    name: r.name,
    kind,
    note: typeof r.note === "string" ? r.note : undefined,
    children: children && children.length > 0 ? children : undefined,
  };
}

/**
 * Validate + coerce a persisted record into a well-formed ScreenTemplate at the
 * repository boundary. Returns null for records missing required identity so
 * the UI NEVER sees a malformed template.
 */
function coerceTemplate(raw: unknown): ScreenTemplate | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== "string" || r.id.length === 0) return null;
  if (typeof r.name !== "string" || r.name.length === 0) return null;

  const hierarchy = Array.isArray(r.autoLayoutHierarchy)
    ? r.autoLayoutHierarchy
        .map(coerceLayoutNode)
        .filter((n): n is AutoLayoutNode => n !== null)
    : [];

  return {
    id: r.id,
    nodeId: str(r.nodeId, r.id),
    name: r.name,
    description: str(r.description),
    canvasSize: coerceCanvasSize(r.canvasSize),
    figmaUrl: str(r.figmaUrl),
    associatedComponents: coerceStringArray(r.associatedComponents),
    layoutStructure: str(r.layoutStructure),
    autoLayoutHierarchy: hierarchy,
    designNotes: typeof r.designNotes === "string" ? r.designNotes : undefined,
  };
}

/* ---------------------------------------------------------------------- */
/* Persistence (localStorage-backed, seed-merged)                          */
/* ---------------------------------------------------------------------- */

function readLocal(): ScreenTemplate[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.map(coerceTemplate).filter((t): t is ScreenTemplate => t !== null);
  } catch {
    return [];
  }
}

/**
 * Merge seed with local overrides. A local record with the same id as a seed
 * OVERRIDES the seed; otherwise it is appended. Seed entries not overridden are
 * returned as-is. (No writer is exposed today — templates are read-only — but
 * the merge keeps the backend-swap seam identical to prototypeStore.)
 */
function readAll(): ScreenTemplate[] {
  const local = readLocal();
  const localById = new Map(local.map((t) => [t.id, t]));
  const merged: ScreenTemplate[] = SEED.map((s) => localById.get(s.id) ?? s);
  for (const t of local) {
    if (!SEED.some((s) => s.id === t.id)) merged.push(t);
  }
  return merged;
}

/* ---------------------------------------------------------------------- */
/* Repository interface (backend-swap seam)                                */
/* ---------------------------------------------------------------------- */

export interface ScreenTemplateRepository {
  /** All reference templates. */
  list(): ScreenTemplate[];
  /** Look up a single template by id. */
  get(id: string): ScreenTemplate | undefined;
}

export const localStorageRepository: ScreenTemplateRepository = {
  list() {
    return readAll();
  },
  get(id) {
    return readAll().find((t) => t.id === id);
  },
};

// The UI imports this alias so swapping the backend is a one-line change.
export const screenTemplateRepository: ScreenTemplateRepository = localStorageRepository;

/* ---------------------------------------------------------------------- */
/* FUTURE: AI grounding context accessor (structure only)                  */
/* ---------------------------------------------------------------------- */

/** A serializable, AI-facing projection of a screen template. */
export interface AiScreenTemplateContext {
  id: string;
  name: string;
  description: string;
  canvasSize: CanvasSize;
  associatedComponents: string[];
  layoutStructure: string;
  autoLayoutHierarchy: AutoLayoutNode[];
  designNotes?: string;
  /**
   * Path (relative to client/src) of the LIVE front-end implementation of this
   * screen — a real Fiber-component composition the AI can reference for layout
   * patterns, spacing and component composition. The registry that resolves
   * these lazily lives at templates/registry.tsx.
   */
  liveImplementationPath: string;
}

/**
 * Typed accessor that projects the template library into a compact,
 * serializable shape intended for grounding future AI-generated prototypes:
 * the AI can reference these to follow layout patterns, reuse spacing
 * principles, maintain consistent component composition and apply Design System
 * rules correctly.
 *
 * IMPORTANT: This ONLY returns data. NO AI behavior is implemented here — this
 * is the structural seam the AI generation pipeline will consume later. Preview
 * images and Figma URLs are intentionally omitted from the projection because
 * they are not useful as text grounding context.
 *
 * Each entry now also points at a LIVE front-end implementation
 * (`liveImplementationPath`, resolved lazily via templates/registry.tsx): the
 * real Fiber-component composition of the screen, which is the richest grounding
 * signal for future AI generation.
 */
export function listTemplatesForAiContext(): AiScreenTemplateContext[] {
  return screenTemplateRepository.list().map((t) => ({
    id: t.id,
    name: t.name,
    description: t.description,
    canvasSize: t.canvasSize,
    associatedComponents: t.associatedComponents,
    layoutStructure: t.layoutStructure,
    autoLayoutHierarchy: t.autoLayoutHierarchy,
    designNotes: t.designNotes,
    liveImplementationPath: `templates/screens/screen-${t.id}.tsx`,
  }));
}
