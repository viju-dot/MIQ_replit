/* =========================================================================
 * TV Audience & Content Planner — V5 chart token layer
 *
 * Spec §14 requires a chart token layer mapped to Fiber design-system tokens.
 * Every V5 chart pulls its colours from here (inline style var(--token, #hex));
 * no arbitrary hex, no chart-library default palettes, no separate visual
 * language for charts. Fallback hex values only kick in when the token is
 * absent so the surface still flips correctly under [data-theme="dark"].
 * ========================================================================= */

export const CHART = {
  /* Primary categorical / bar colour. */
  primary: "var(--datavis-qualitative-4, #7c33b5)",
  /* Secondary category (e.g. Streaming). */
  secondary: "var(--datavis-qualitative-3, #a857e5)",
  /* Tertiary category (e.g. FAST). */
  tertiary: "var(--datavis-qualitative-1, #fbbb3b)",
  /* Additional category color. */
  quaternary: "var(--datavis-qualitative-2, #ef8736)",
  /* Neutral fills / empty grid cells / low-intensity heat. */
  neutral: "var(--datavis-qualitative-7, #e1e1e8)",
  /* Baseline reference (national-average 100 ring / axis). */
  baseline: "var(--border-static-bold-neutral, #9a9aa8)",
  /* Selected / highlighted element. */
  selected: "var(--border-dynamic-brand-selected, #7c33b5)",
  /* Hover wash for interactive marks. */
  hover: "var(--container-dynamic-neutral-subtle-background-hover, #71718014)",
  /* Positive / over-index direction. */
  positive: "var(--container-static-success-subtle-foreground-variation, #115639)",
  /* Negative / under-index direction. */
  negative: "var(--surface-foreground-static-error, #da294b)",
  /* Line overlay (combo charts). */
  line: "var(--datavis-qualitative-5, #ee4980)",
  /* Grid lines / axes. */
  grid: "var(--border-static-subtle-neutral, #e1e1e8)",
  /* Axis / tick text. */
  axis: "var(--surface-foreground-dynamic-neutral-default-regular, #4b4b59)",
} as const;

/* Sequential low → high intensity ramp for the temporal heatmap. Built from
 * the brand ramp so it stays in-system rather than a generic heat gradient. */
export const HEAT_RAMP = [
  "var(--datavis-sequential-brand-1, #f6ebff)",
  "var(--datavis-sequential-brand-2, #e5c9f7)",
  "var(--datavis-sequential-brand-3, #cfa0ee)",
  "var(--datavis-sequential-brand-4, #b06fe0)",
  "var(--datavis-sequential-brand-5, #8a3fc9)",
  "var(--datavis-sequential-brand-6, #661f9e)",
] as const;

/* The three viewing-environment categories, in fixed order, with a stable
 * colour each. Used by donut, combo tabs, platform splits and legends so a
 * given TV type is always the same colour across every V5 chart. */
export const TV_TYPE_COLOR: Record<string, string> = {
  "Linear TV": CHART.primary,
  Linear: CHART.primary,
  Streaming: CHART.secondary,
  FAST: CHART.tertiary,
  Fast: CHART.tertiary,
};

/* Contrast text used on top of a coloured mark (dark chips / bar labels). */
export const LABEL_ON_COLOR = "var(--datavis-labels-adaptive, #ffffff)";
export const LABEL_ON_LIGHT =
  "var(--surface-foreground-static-neutral-lvl2, #282833)";

/* Human-readable index explanation (spec §20): index 150 → "50% above". */
export function indexExplanation(index: number): string {
  if (index === 100) return "in line with the national average";
  const diff = Math.abs(index - 100);
  return index > 100
    ? `${diff}% above the national average`
    : `${diff}% below the national average`;
}
