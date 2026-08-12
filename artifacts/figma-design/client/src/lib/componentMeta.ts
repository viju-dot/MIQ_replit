/**
 * Component metadata extraction layer.
 *
 * The Component Rules side panel needs to "auto-understand" whichever component
 * the user is inspecting so it can surface only the properties that actually
 * exist for it (per the design-refs rule: never invent props a component
 * doesn't have). Rather than hand-maintaining a parallel data source, we derive
 * that metadata from the SAME `PlaygroundConfig` every component page already
 * feeds to the <Playground> chrome (controls, tokens, name, theme readiness).
 *
 * This keeps a single source of truth: whatever a page declares in its
 * Playground config is exactly what the rules panel shows.
 *
 * The extraction is intentionally heuristic and additive — a future richer
 * Figma metadata feed can replace `extractComponentMeta` without changing the
 * panel UI, which only consumes the normalised `ComponentMeta` shape below.
 */

import type { Control, PlaygroundConfig } from "@/components/playground/types";

/** A single property surfaced from the component's controls. */
export interface ComponentProperty {
  /** Stable machine name (the control name). */
  name: string;
  /** Human label as shown in the properties panel. */
  label: string;
  /** Which metadata family this property belongs to. */
  kind: "variant" | "size" | "state" | "boolean" | "text" | "icon" | "theme";
  /** For select-like properties, the concrete option values (Figma variants). */
  options?: string[];
  /**
   * The placeholder token inserted into the rule editor, e.g. `{State}`.
   * References the selected component's property by its label.
   */
  placeholder: string;
}

/** A grouped section of properties for display in the Property Assistant. */
export interface ComponentMetaGroup {
  /** Section title, e.g. "States", "Size Variants". */
  title: string;
  properties: ComponentProperty[];
}

/** Normalised metadata for one component, derived from its Playground config. */
export interface ComponentMeta {
  /** Display name, e.g. "Button". */
  name: string;
  /**
   * Stable, immutable id used to scope rules to this playground. Sourced from
   * `PlaygroundConfig.scopeId` (NOT derived from the mutable display name), so
   * collisions across pages are impossible and renaming a config never strands
   * saved rules.
   */
  slug: string;
  description?: string;
  /** Whether the component has a Figma dark/theme variant. */
  themeReady: boolean;
  /** Design tokens the component actually uses (from the config). */
  tokens: Record<string, string>;
  /** Grouped properties (only groups that actually have members are present). */
  groups: ComponentMetaGroup[];
  /** Flattened list of every property for quick lookup / chip rendering. */
  properties: ComponentProperty[];
}

/**
 * Slugify a component display name. NOTE: this is NOT used for rule scoping
 * anymore (see `PlaygroundConfig.scopeId`); it only powers the one-time
 * migration in ruleStore that maps legacy name-derived slugs to the new
 * stable scopeIds. New scoping always uses `scopeId` verbatim.
 */
export function slugifyComponentName(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

/** Turn a property label into a `{Placeholder}` token (PascalCase-ish). */
function toPlaceholder(label: string): string {
  const cleaned = label.trim().replace(/[^a-zA-Z0-9 ]+/g, " ");
  const pascal = cleaned
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
  return `{${pascal || label}}`;
}

const ICON_RE = /\bicon\b|leading|trailing/i;
const STATE_RE = /\bstate\b|status/i;
const SIZE_RE = /\bsize\b|density|compact/i;

/**
 * Classify a single control into a metadata property. The classification is
 * label/name driven so the same select control can be recognised as a State,
 * Size, or generic Variant depending on what the component actually exposes.
 */
function classifyControl(control: Control): ComponentProperty {
  const label = control.label || control.name;
  const hay = `${control.name} ${control.label}`;
  const placeholder = toPlaceholder(label);

  if (control.kind === "boolean") {
    const kind = ICON_RE.test(hay) ? "icon" : "boolean";
    return { name: control.name, label, kind, placeholder };
  }
  if (control.kind === "text") {
    return { name: control.name, label, kind: "text", placeholder };
  }
  // select
  const options = control.options;
  let kind: ComponentProperty["kind"] = "variant";
  if (STATE_RE.test(hay)) kind = "state";
  else if (SIZE_RE.test(hay)) kind = "size";
  else if (ICON_RE.test(hay)) kind = "icon";
  return { name: control.name, label, kind, options, placeholder };
}

const GROUP_ORDER: { kind: ComponentProperty["kind"]; title: string }[] = [
  { kind: "variant", title: "Variants" },
  { kind: "size", title: "Size Variants" },
  { kind: "state", title: "States" },
  { kind: "icon", title: "Icon Properties" },
  { kind: "boolean", title: "Boolean Properties" },
  { kind: "text", title: "Text Properties" },
];

/**
 * Extract normalised metadata from a component's Playground config. Only groups
 * with at least one real property are returned, so the panel never shows an
 * empty or invented section.
 */
export function extractComponentMeta(config: PlaygroundConfig): ComponentMeta {
  const properties = config.controls.map(classifyControl);

  const groups: ComponentMetaGroup[] = [];
  for (const { kind, title } of GROUP_ORDER) {
    const members = properties.filter((p) => p.kind === kind);
    if (members.length > 0) groups.push({ title, properties: members });
  }

  const themeReady = Boolean(config.darkReady);
  if (themeReady) {
    const themeProp: ComponentProperty = {
      name: "theme",
      label: "Theme",
      kind: "theme",
      options: ["Light", "Dark"],
      placeholder: "{Theme}",
    };
    properties.push(themeProp);
    groups.push({ title: "Theme Variants", properties: [themeProp] });
  }

  return {
    name: config.name,
    // Scope on the stable, immutable scopeId — never the mutable display name.
    slug: config.scopeId,
    description: config.description,
    themeReady,
    tokens: config.tokens ?? {},
    groups,
    properties,
  };
}
