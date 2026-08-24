/* =========================================================================
 * MIQ Collaborative Frameworks — Element selection (Design Annotation)
 *
 * Utilities for the Replit-style "Select elements" interaction (spec §3–§9):
 * given a point (or a dragged rectangle) over the prototype canvas, find the
 * MEANINGFUL UI element under it, describe it with a human label + ancestor
 * breadcrumb, and snapshot its rect as a percentage of the canvas content so it
 * can be re-anchored / rendered later.
 *
 * Everything here is best-effort and defensive — it must NEVER throw while the
 * user waves the cursor around, and it must ignore the annotation UI's own
 * chrome (marked with data-annotation-ui).
 * ========================================================================= */

/** Rect (percent of canvas content) — the annotation coordinate space. */
export interface PctRect {
  xPct: number;
  yPct: number;
  wPct: number;
  hPct: number;
}

/** A resolved element pick: the DOM node + its description. */
export interface ElementPick {
  el: HTMLElement;
  label: string;
  path: string[];
  rectPct: PctRect;
  annotateKey?: string;
}

/** Measured canvas host: content box + scroll extent, all in px. */
export interface CanvasMetrics {
  host: HTMLElement;
  rect: DOMRect;
  width: number; // scrollWidth (full content)
  height: number; // scrollHeight (full content)
}

/* ------------------------------------------------------------------ */
/* Text / naming helpers                                               */
/* ------------------------------------------------------------------ */

function clean(text: string | null | undefined, max = 44): string {
  if (!text) return "";
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

const HEADING_TAGS = new Set(["H1", "H2", "H3", "H4", "H5", "H6"]);

/**
 * A category label for an element by tag/role — a fallback used only when no
 * meaningful name is available (so we never surface "div-27" etc, spec §14).
 */
function categoryFor(el: Element): string | null {
  const tag = el.tagName;
  const role = el.getAttribute("role");
  if (tag === "BUTTON" || role === "button") return "Button";
  if (tag === "A" || role === "link") return "Link";
  if (tag === "NAV" || role === "navigation") return "Navigation";
  if (tag === "INPUT") {
    const type = (el.getAttribute("type") || "text").toLowerCase();
    if (type === "checkbox") return "Checkbox";
    if (type === "radio") return "Radio";
    if (type === "search") return "Search";
    return "Input";
  }
  if (tag === "SELECT" || role === "combobox" || role === "listbox") return "Select";
  if (tag === "TEXTAREA") return "Text area";
  if (tag === "IMG" || role === "img") return "Image";
  if (HEADING_TAGS.has(tag) || role === "heading") return "Heading";
  if (role === "tab") return "Tab";
  if (role === "tablist") return "Tabs";
  if (role === "menuitem") return "Menu item";
  if (role === "dialog") return "Dialog";
  if (tag === "TABLE" || role === "table" || role === "grid") return "Table";
  if (tag === "SECTION") return "Section";
  return null;
}

/**
 * Best human name for an element. Prefers explicit annotation hints, then
 * accessible names, then a nearby heading, then the element's own short text.
 */
function elementName(el: Element): string {
  // 1) Explicit authoring hint — the most reliable label (spec §14).
  const annotate = el.getAttribute("data-annotate");
  if (annotate) return clean(annotate, 48);

  const aria = el.getAttribute("aria-label");
  if (aria) return clean(aria);

  // 2) aria-labelledby → referenced element's text.
  const labelledby = el.getAttribute("aria-labelledby");
  if (labelledby) {
    const ref = el.ownerDocument?.getElementById(labelledby.split(/\s+/)[0] ?? "");
    const t = clean(ref?.textContent);
    if (t) return t;
  }

  const alt = el.getAttribute("alt");
  if (alt) return clean(alt);
  const title = el.getAttribute("title");
  if (title) return clean(title);

  // 3) A heading INSIDE this element names a card/section.
  try {
    const heading = el.querySelector("h1, h2, h3, h4, [role='heading']");
    if (heading) {
      const t = clean((heading as HTMLElement).innerText ?? heading.textContent);
      if (t) return t;
    }
  } catch {
    /* ignore */
  }

  // 4) The element's own short text (buttons/tabs/links).
  const own = clean((el as HTMLElement).innerText ?? el.textContent ?? "");
  if (own && own.length <= 40) return own;

  const placeholder = el.getAttribute("placeholder");
  if (placeholder) return clean(placeholder);

  return "";
}

/** A resolved label: prefer a real name, else a category, else "Element". */
export function describeElement(el: Element): string {
  const name = elementName(el);
  const category = categoryFor(el);
  if (name && category && name.toLowerCase() !== category.toLowerCase()) {
    // Keep it short: a named control usually just needs its name.
    return name;
  }
  if (name) return name;
  if (category) return category;
  return "Element";
}

/* ------------------------------------------------------------------ */
/* Meaningfulness                                                      */
/* ------------------------------------------------------------------ */

const MEANINGFUL_ROLES = new Set([
  "button",
  "link",
  "tab",
  "tablist",
  "checkbox",
  "radio",
  "radiogroup",
  "menuitem",
  "combobox",
  "listbox",
  "navigation",
  "dialog",
  "region",
  "group",
  "table",
  "grid",
  "img",
  "heading",
]);

const MEANINGFUL_TAGS = new Set([
  "BUTTON",
  "A",
  "INPUT",
  "SELECT",
  "TEXTAREA",
  "NAV",
  "SECTION",
  "ARTICLE",
  "ASIDE",
  "TABLE",
  "FORM",
  "FIELDSET",
  "IMG",
  "SVG",
  "CANVAS",
]);

/** Should this node be considered a selectable boundary? */
function isMeaningful(el: Element): boolean {
  if (el.getAttribute("data-annotate")) return true;
  if (MEANINGFUL_TAGS.has(el.tagName)) return true;
  const role = el.getAttribute("role");
  if (role && MEANINGFUL_ROLES.has(role)) return true;
  if (HEADING_TAGS.has(el.tagName)) return true;
  return false;
}

/** Ignore the annotation layer's own chrome + non-visual nodes. */
function isIgnorable(el: Element): boolean {
  if (el.closest("[data-annotation-ui]")) return true;
  const tag = el.tagName;
  if (tag === "SCRIPT" || tag === "STYLE") return true;
  return false;
}

/* ------------------------------------------------------------------ */
/* Geometry                                                            */
/* ------------------------------------------------------------------ */

/** Convert a viewport rect to a percent-of-canvas-content rect (clamped). */
export function rectToPct(rect: DOMRect, m: CanvasMetrics): PctRect {
  const x = ((rect.left - m.rect.left + m.host.scrollLeft) / m.width) * 100;
  const y = ((rect.top - m.rect.top + m.host.scrollTop) / m.height) * 100;
  const w = (rect.width / m.width) * 100;
  const h = (rect.height / m.height) * 100;
  const clamp = (n: number) => Math.min(100, Math.max(0, n));
  return { xPct: clamp(x), yPct: clamp(y), wPct: clamp(w), hPct: clamp(h) };
}

/** Percent rect of an element against the canvas (null if not measurable). */
export function elementRectPct(el: Element, m: CanvasMetrics): PctRect | null {
  let r: DOMRect;
  try {
    r = el.getBoundingClientRect();
  } catch {
    return null;
  }
  if (r.width <= 0 || r.height <= 0) return null;
  return rectToPct(r, m);
}

/* ------------------------------------------------------------------ */
/* Hierarchy / breadcrumb                                              */
/* ------------------------------------------------------------------ */

/**
 * The chain of MEANINGFUL ancestors from the given element up to (and
 * including) the root, most-specific first: [element, …, section]. Deduped by
 * label and capped at `cap` levels (spec §5).
 */
export function meaningfulChain(
  from: Element,
  root: Element,
  cap = 4,
): HTMLElement[] {
  const chain: HTMLElement[] = [];
  const seenLabels = new Set<string>();
  let node: Element | null = from;
  let hops = 0;
  while (node && hops < 40) {
    if (node instanceof HTMLElement && !isIgnorable(node) && isMeaningful(node)) {
      const label = describeElement(node).toLowerCase();
      // Skip a wrapper that has the same label as the child already captured.
      if (!seenLabels.has(label)) {
        seenLabels.add(label);
        chain.push(node);
      }
    }
    if (node === root) break;
    node = node.parentElement;
    hops += 1;
  }
  return chain.slice(0, cap);
}

/**
 * The breadcrumb path (root→element) of labels for a pick — the reverse of the
 * meaningful chain, used as structured context (spec §10).
 */
export function pathFor(el: Element, root: Element): string[] {
  return meaningfulChain(el, root)
    .map((n) => describeElement(n))
    .reverse();
}

/* ------------------------------------------------------------------ */
/* Point → element pick                                                */
/* ------------------------------------------------------------------ */

/**
 * Resolve the element under a viewport point to the nearest meaningful
 * boundary, skipping the annotation chrome. Returns the DOM node or null.
 */
export function elementAtPoint(
  clientX: number,
  clientY: number,
  root: Element,
): HTMLElement | null {
  let hit: Element | null;
  try {
    hit = root.ownerDocument?.elementFromPoint(clientX, clientY) ?? null;
  } catch {
    return null;
  }
  if (!hit) return null;
  if (isIgnorable(hit)) return null;
  if (!root.contains(hit)) return null;

  // Walk up from the hit to the first meaningful boundary inside the root.
  let node: Element | null = hit;
  let hops = 0;
  while (node && hops < 40) {
    if (
      node instanceof HTMLElement &&
      !isIgnorable(node) &&
      isMeaningful(node) &&
      root.contains(node)
    ) {
      return node;
    }
    if (node === root) break;
    node = node.parentElement;
    hops += 1;
  }
  // No meaningful ancestor: fall back to the raw hit if it's a real element.
  return hit instanceof HTMLElement && hit !== root ? hit : null;
}

/** Build a full ElementPick (label + path + rect) for a resolved element. */
export function toPick(el: HTMLElement, root: Element, m: CanvasMetrics): ElementPick | null {
  const rectPct = elementRectPct(el, m);
  if (!rectPct) return null;
  const annotate = el.getAttribute("data-annotate") || undefined;
  return {
    el,
    label: describeElement(el),
    path: pathFor(el, root),
    rectPct,
    annotateKey: annotate,
  };
}

/* ------------------------------------------------------------------ */
/* Smart region (spec §9)                                              */
/* ------------------------------------------------------------------ */

/**
 * Detect the MEANINGFUL elements whose center falls inside a region rect (px,
 * in the root's content coordinate space). Filters out nested duplicates: if a
 * meaningful ancestor of a candidate is also inside the region, prefer the
 * ancestor (so we report "1 chart" not "chart + 40 cells"). Capped for sanity.
 */
export function elementsInRegion(
  root: Element,
  regionPx: { x: number; y: number; w: number; h: number },
  m: CanvasMetrics,
  cap = 12,
): ElementPick[] {
  let candidates: Element[] = [];
  try {
    candidates = Array.from(
      root.querySelectorAll(
        "[data-annotate], button, a, input, select, textarea, section, article, table, nav, form, img, svg, canvas, [role='button'], [role='tab'], [role='checkbox'], [role='radio'], [role='combobox'], [role='listbox'], [role='img'], [role='region'], [role='group']",
      ),
    );
  } catch {
    return [];
  }

  let rootRect: DOMRect;
  let scrollTop = 0;
  let scrollLeft = 0;
  try {
    rootRect = root.getBoundingClientRect();
    scrollTop = (root as HTMLElement).scrollTop || 0;
    scrollLeft = (root as HTMLElement).scrollLeft || 0;
  } catch {
    return [];
  }

  const inside: Element[] = [];
  for (const c of candidates) {
    if (isIgnorable(c)) continue;
    let cr: DOMRect;
    try {
      cr = c.getBoundingClientRect();
    } catch {
      continue;
    }
    if (cr.width <= 0 || cr.height <= 0) continue;
    const cx = cr.left - rootRect.left + scrollLeft + cr.width / 2;
    const cy = cr.top - rootRect.top + scrollTop + cr.height / 2;
    if (
      cx >= regionPx.x &&
      cx <= regionPx.x + regionPx.w &&
      cy >= regionPx.y &&
      cy <= regionPx.y + regionPx.h
    ) {
      inside.push(c);
    }
  }

  // Prefer ancestors: drop any element that has an ancestor also in `inside`.
  const insideSet = new Set(inside);
  const top: Element[] = [];
  for (const el of inside) {
    let anc = el.parentElement;
    let covered = false;
    while (anc) {
      if (insideSet.has(anc)) {
        covered = true;
        break;
      }
      anc = anc.parentElement;
    }
    if (!covered) top.push(el);
  }

  const picks: ElementPick[] = [];
  const seenLabels = new Set<string>();
  for (const el of top) {
    if (picks.length >= cap) break;
    if (!(el instanceof HTMLElement)) continue;
    const pick = toPick(el, root, m);
    if (!pick) continue;
    const key = pick.label.toLowerCase();
    if (seenLabels.has(key)) continue;
    seenLabels.add(key);
    picks.push(pick);
  }
  return picks;
}

/* ------------------------------------------------------------------ */
/* Aggregation helpers                                                 */
/* ------------------------------------------------------------------ */

/** The union bounding box (percent) of a set of rects, or null if empty. */
export function boundingPct(rects: PctRect[]): PctRect | null {
  if (rects.length === 0) return null;
  let x0 = Infinity;
  let y0 = Infinity;
  let x1 = -Infinity;
  let y1 = -Infinity;
  for (const r of rects) {
    x0 = Math.min(x0, r.xPct);
    y0 = Math.min(y0, r.yPct);
    x1 = Math.max(x1, r.xPct + r.wPct);
    y1 = Math.max(y1, r.yPct + r.hPct);
  }
  if (!Number.isFinite(x0)) return null;
  return { xPct: x0, yPct: y0, wPct: Math.max(0, x1 - x0), hPct: Math.max(0, y1 - y0) };
}

/**
 * The dominant section label for a set of picks (spec §10): the deepest label
 * common to every pick's breadcrumb path, else the most frequent path root.
 */
export function commonSectionLabel(picks: { path: string[] }[]): string {
  if (picks.length === 0) return "";
  if (picks.length === 1) {
    const p = picks[0].path;
    // The path root is the outermost section; prefer it as the section.
    return p.length > 1 ? p[0] : "";
  }
  // Deepest shared prefix across all paths.
  const first = picks[0].path;
  let shared = "";
  for (let i = 0; i < first.length; i += 1) {
    const label = first[i];
    if (picks.every((p) => p.path[i] === label)) {
      shared = label;
    } else {
      break;
    }
  }
  return shared;
}
