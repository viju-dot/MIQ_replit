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
