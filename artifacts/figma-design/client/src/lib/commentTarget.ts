/* =========================================================================
 * Fiber Workspace — Comment target labelling
 *
 * Best-effort, human-readable label for a clicked prototype element. Walks up
 * from the event target to the nearest MEANINGFUL element and derives a label
 * like "Button: Apply filters" or "Navigation". Falls back to "Screen".
 * ========================================================================= */

/** Trim + collapse whitespace and cap length for a readable label. */
function clean(text: string | null | undefined, max = 40): string {
  if (!text) return "";
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max - 1).trimEnd()}…`;
}

/** A short accessible name for an element (aria-label, alt, title, or text). */
function accessibleName(el: Element): string {
  const aria = el.getAttribute("aria-label");
  if (aria) return clean(aria);
  const alt = el.getAttribute("alt");
  if (alt) return clean(alt);
  const title = el.getAttribute("title");
  if (title) return clean(title);
  const placeholder = el.getAttribute("placeholder");
  if (placeholder) return clean(placeholder);
  // Only use short, single-line-ish text so we never grab a whole panel.
  const text = clean((el as HTMLElement).innerText ?? el.textContent ?? "");
  if (text && text.length <= 40) return text;
  return "";
}

const HEADING_TAGS = new Set(["H1", "H2", "H3", "H4", "H5", "H6"]);

/** Category label for a meaningful element (by tag / role). */
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
    return "Input";
  }
  if (tag === "SELECT" || role === "combobox" || role === "listbox") return "Select";
  if (tag === "TEXTAREA") return "Text area";
  if (tag === "IMG" || role === "img") return "Image";
  if (HEADING_TAGS.has(tag) || role === "heading") return "Heading";
  if (role === "tab") return "Tab";
  if (role === "menuitem") return "Menu item";
  if (role === "dialog") return "Dialog";
  if (role) return role.charAt(0).toUpperCase() + role.slice(1);
  return null;
}

/**
 * Derive a human-readable target label from a clicked node. Walks up to the
 * nearest meaningful ancestor within `root`. Best-effort; falls back to
 * "Screen".
 */
export function deriveTargetLabel(
  target: EventTarget | null,
  root?: Element | null,
): string {
  let el = target instanceof Element ? target : null;
  const boundary = root ?? null;

  // 1) Walk up looking for a categorised, meaningful element.
  let node: Element | null = el;
  let hops = 0;
  while (node && hops < 12) {
    const category = categoryFor(node);
    if (category) {
      const name = accessibleName(node);
      return name ? `${category}: ${name}` : category;
    }
    if (boundary && node === boundary) break;
    node = node.parentElement;
    hops += 1;
  }

  // 2) No categorised ancestor — use a short text label on the click target.
  if (el) {
    const name = accessibleName(el);
    if (name) return name;
  }

  return "Screen";
}

/* =========================================================================
 * Region labelling (Design Annotation)
 *
 * A best-effort, human-readable description of the AREA a rectangular region
 * covers — the dominant section(s) it overlaps plus a rough count of the
 * meaningful elements inside it — used as the "Selected area" summary in the
 * annotation editor (spec §5). Falls back to a plain size description.
 * ========================================================================= */

/** A rectangle in pixels relative to the top-left of the region root's content. */
export interface RegionPxRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

/** Do two rectangles (px) overlap by more than a trivial amount? */
function rectsOverlap(
  a: RegionPxRect,
  b: { left: number; top: number; right: number; bottom: number },
): boolean {
  const ax2 = a.x + a.w;
  const ay2 = a.y + a.h;
  return !(b.left >= ax2 || b.right <= a.x || b.top >= ay2 || b.bottom <= a.y);
}

/** Heading-ish or landmark elements whose text names a section. */
function sectionName(el: Element): string {
  const explicit = el.getAttribute("aria-label");
  if (explicit) return clean(explicit, 32);
  const text = clean((el as HTMLElement).innerText ?? el.textContent ?? "", 32);
  return text;
}

const COUNTABLE = "button, a, input, select, textarea, [role='button'], [role='tab'], [role='link'], [role='checkbox'], [role='radio'], [role='menuitem'], img, svg, canvas";

/**
 * Describe the region for the annotation "Selected area" summary. Scans the
 * region root for section headings / landmarks that intersect the region rect
 * (in px, relative to the root's scrollable content) and counts the meaningful
 * elements inside it. Best-effort and defensive — never throws.
 */
export function deriveRegionLabel(
  root: Element | null | undefined,
  rectPx: RegionPxRect,
): string {
  if (!root || rectPx.w <= 0 || rectPx.h <= 0) return "Selected region";
  let rootRect: DOMRect;
  let scrollTop = 0;
  let scrollLeft = 0;
  try {
    rootRect = root.getBoundingClientRect();
    scrollTop = (root as HTMLElement).scrollTop || 0;
    scrollLeft = (root as HTMLElement).scrollLeft || 0;
  } catch {
    return "Selected region";
  }

  // Convert a child's viewport rect into the root's content-coordinate space.
  const toContent = (r: DOMRect) => ({
    left: r.left - rootRect.left + scrollLeft,
    top: r.top - rootRect.top + scrollTop,
    right: r.right - rootRect.left + scrollLeft,
    bottom: r.bottom - rootRect.top + scrollTop,
  });

  // 1) Section names: headings + landmarks that intersect the region.
  const names: string[] = [];
  const seen = new Set<string>();
  let headings: Element[] = [];
  try {
    headings = Array.from(
      root.querySelectorAll("h1, h2, h3, h4, [role='heading'], nav, [role='navigation']"),
    );
  } catch {
    headings = [];
  }
  for (const h of headings) {
    if (names.length >= 3) break;
    let cr: DOMRect;
    try {
      cr = h.getBoundingClientRect();
    } catch {
      continue;
    }
    if (cr.width === 0 && cr.height === 0) continue;
    if (!rectsOverlap(rectPx, toContent(cr))) continue;
    const tag = h.tagName;
    const nm =
      tag === "NAV" || h.getAttribute("role") === "navigation"
        ? "Navigation"
        : sectionName(h);
    const key = nm.toLowerCase();
    if (nm && !seen.has(key)) {
      seen.add(key);
      names.push(nm);
    }
  }

  // 2) Count the meaningful elements inside the region.
  let count = 0;
  try {
    const candidates = Array.from(root.querySelectorAll(COUNTABLE));
    for (const c of candidates) {
      let cr: DOMRect;
      try {
        cr = c.getBoundingClientRect();
      } catch {
        continue;
      }
      if (cr.width === 0 && cr.height === 0) continue;
      // Count when the element's CENTER falls within the region (avoids
      // double-counting big wrappers straddling the edge).
      const cc = toContent(cr);
      const cx = (cc.left + cc.right) / 2;
      const cy = (cc.top + cc.bottom) / 2;
      if (cx >= rectPx.x && cx <= rectPx.x + rectPx.w && cy >= rectPx.y && cy <= rectPx.y + rectPx.h) {
        count += 1;
      }
    }
  } catch {
    count = 0;
  }

  const elementsPart =
    count > 0 ? `${count} element${count === 1 ? "" : "s"}` : "";

  if (names.length > 0) {
    const sections = names.join(", ");
    return elementsPart ? `${sections} · ${elementsPart}` : sections;
  }
  return elementsPart ? `Region · ${elementsPart}` : "Selected region";
}
