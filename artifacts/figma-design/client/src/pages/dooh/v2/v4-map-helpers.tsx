import L from "leaflet";
import type { ReactNode } from "react";
import { ScreenData } from "../data";
import { EXCHANGE_RATES } from "./budgetCurrency";
import { FONT } from "./primitives";

export type V4Currency = "GBP" | "EUR" | "USD";
export const V4_SOURCE_ORDER = ["geoPlanner", "planningZone", "postcode", "city", "latlng", "poi", "screenList"] as const;
export const V4_SOURCE_LABELS: Record<string, string> = {
  geoPlanner: "Geo Planner", planningZone: "Planning Zone", postcode: "Postcode", city: "City",
  latlng: "Lat/Long", poi: "POI", screenList: "Screen List", default: "Not added",
};
// [token, fallback, dark label on this fill?]
const TOK: Record<string, [string, string, boolean]> = {
  geoPlanner: ["--datavis-qualitative-4", "#7c33b5", false],
  planningZone: ["--datavis-qualitative-2", "#ef8736", true],
  postcode: ["--datavis-qualitative-3", "#a857e5", true],
  city: ["--datavis-qualitative-5", "#ee4980", false],
  latlng: ["--datavis-qualitative-6", "#d32f61", false],
  poi: ["--datavis-qualitative-1", "#fbbb3b", true],
  screenList: ["--container-dynamic-brand-bold-background-default", "#7c33b5", false],
  default: ["--container-dynamic-brand-bold-background-default", "#7c33b5", false],
};
const BRAND = "var(--container-dynamic-brand-bold-background-default, #7c33b5)";

/** CSS-var colour for HTML / divIcon use. */
export const v4CssColor = (k: string) => { const t = TOK[k] ?? TOK.default; return `var(${t[0]}, ${t[1]})`; };
/** Resolved colour for Leaflet SVG pathOptions (re-read each call so theme changes apply). */
export const v4ResolvedColor = (k: string) => {
  const t = TOK[k] ?? TOK.default;
  if (typeof document === "undefined") return t[1];
  return getComputedStyle(document.documentElement).getPropertyValue(t[0]).trim() || t[1];
};
const labelColor = (k: string) => ((TOK[k] ?? TOK.default)[2]
  ? "var(--datavis-labels-dark, #13131a)" : "var(--container-dynamic-brand-bold-foreground-default, #ffffff)");

const border = (sel: boolean, cand: boolean) =>
  cand ? BRAND : sel ? "var(--container-dynamic-brand-bold-background-default, #7c33b5)" : "var(--datavis-border, #ffffff)";
const halo = (sel: boolean, cand: boolean) =>
  cand ? `, 0 0 0 4px color-mix(in srgb, ${BRAND} 30%, transparent)`
  : sel ? `, 0 0 0 3px color-mix(in srgb, ${BRAND} 45%, transparent)` : "";

export const v4PinIcon = (active: boolean, key: string, sel: boolean, cand: boolean) =>
  L.divIcon({
    className: "",
    iconSize: active ? [24, 24] : [18, 18],
    iconAnchor: active ? [12, 12] : [9, 9],
    html: `<span style="display:block;width:100%;height:100%;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${v4CssColor(key)};border:2px solid ${border(sel, cand)};box-shadow:0 2px 6px var(--shadow-lvl8, rgba(113,113,128,0.25))${halo(sel, cand)};transition:all 0.2s ease;"></span>`,
  });

export const v4ClusterIcon = (count: number, key: string, sel: boolean, cand: boolean, diameter = 38) =>
  L.divIcon({
    className: "",
    iconSize: [diameter, diameter],
    iconAnchor: [diameter / 2, diameter / 2],
    html: `<span class="fiber-v4-cluster" style="display:flex;box-sizing:border-box;width:${diameter}px;height:${diameter}px;align-items:center;justify-content:center;border-radius:999px;background:${v4CssColor(key)};color:${labelColor(key)};border:2px solid ${border(sel, cand)};box-shadow:0 2px 8px var(--shadow-lvl8, rgba(113,113,128,0.25))${halo(sel, cand)};font-family:${FONT.replace(/"/g, "'")};font-weight:700;font-size:12px;">${count}</span>`,
  });

export const formatCpm = (gbp: number, currency: V4Currency) => {
  const v = gbp * (EXCHANGE_RATES[currency] ?? 1);
  const sym = currency === "GBP" ? "£" : currency === "EUR" ? "€" : "$";
  return `${sym}${v.toFixed(2)}`;
};

export function buildV4SourceMembership(
  screens: ScreenData[],
  sourceScreenIds: Record<string, string[]> = {},
  activeSources?: Record<string, boolean | undefined>,
) {
  const sets: [string, Set<string>][] = V4_SOURCE_ORDER
    .filter((k) => sourceScreenIds[k] && (!activeSources || activeSources[k] !== false))
    .map((k) => [k, new Set(sourceScreenIds[k])]);
  const primary = new Map<string, string>();
  const all = new Map<string, string[]>();
  screens.forEach((s) => {
    const m = sets.filter(([, ids]) => ids.has(s.id)).map(([k]) => k);
    primary.set(s.id, m[0] ?? "default");
    all.set(s.id, m);
  });
  return { primary, all };
}

const row = (label: string, value: ReactNode) => (
  <div style={{ display: "grid", gridTemplateColumns: "76px 1fr", gap: "var(--spacing-100, 8px)", alignItems: "baseline" }}>
    <span style={{ color: "var(--surface-foreground-dynamic-neutral-disabled, #717180)" }}>{label}</span>
    <span style={{ fontWeight: 500, overflowWrap: "anywhere" }}>{value}</span>
  </div>
);

export function V4ScreenTooltip({ screen, sources, currency, showCpm, hasSourceTargeting = false }: {
  screen: ScreenData; sources: string[]; currency: V4Currency; showCpm: boolean; hasSourceTargeting?: boolean;
}) {
  const matchedSources = V4_SOURCE_ORDER.filter(source => sources.includes(source));
  return (
    <div style={{ fontFamily: FONT, fontSize: 12, minWidth: 220, maxWidth: 280, display: "flex", flexDirection: "column", gap: "var(--spacing-50, 4px)", color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)" }}>
      <strong style={{ fontSize: 14, paddingBottom: "var(--spacing-50, 4px)", borderBottom: "1px solid var(--border-dynamic-neutral-subtle-default, #e1e1e8)" }}>{screen.id}</strong>
      {row("Publisher", screen.publisher)}
      {row("Venue", screen.venue)}
      {row("City", screen.city)}
      {showCpm && row("CPM", formatCpm(screen.cpm, currency))}
      {row("Impressions", screen.impressions.toLocaleString())}
      {row("Match Source", matchedSources.length ? (
        <div style={{ display: "flex", flexDirection: "column", gap: "var(--spacing-50, 4px)" }}>
          {matchedSources.map(source => (
            <span key={source} style={{ display: "flex", alignItems: "center", gap: "var(--spacing-50, 4px)" }}>
              <span aria-hidden="true" style={{ width: 8, height: 8, flexShrink: 0, borderRadius: "50%", backgroundColor: v4CssColor(source) }} />
              {V4_SOURCE_LABELS[source]}
            </span>
          ))}
        </div>
      ) : hasSourceTargeting ? "No match" : "Not added")}
    </div>
  );
}

export function V4ClusterTooltip({ screens, currency, showCpm, action }: {
  screens: ScreenData[]; currency: V4Currency; showCpm: boolean; action: string;
}) {
  const pubs = new Set(screens.map((s) => s.publisher)).size;
  const cities = new Set(screens.map((s) => s.city)).size;
  const imps = screens.reduce((a, s) => a + s.impressions, 0);
  const avg = imps > 0 ? screens.reduce((a, s) => a + s.cpm * s.impressions, 0) / imps : 0;
  return (
    <div style={{ fontFamily: FONT, fontSize: 12, minWidth: 220, display: "flex", flexDirection: "column", gap: "var(--spacing-50, 4px)", color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)" }}>
      <strong style={{ fontSize: 14, paddingBottom: "var(--spacing-50, 4px)", borderBottom: "1px solid var(--border-dynamic-neutral-subtle-default, #e1e1e8)" }}>{screens.length} matched screens</strong>
      {row("Publishers", pubs === 1 ? screens[0].publisher : `${pubs} publishers`)}
      {row("Cities", cities === 1 ? screens[0].city : `${cities} cities`)}
      {showCpm && row("Avg CPM", formatCpm(avg, currency))}
      {row("Impressions", imps.toLocaleString())}
      <span style={{ color: "var(--surface-foreground-dynamic-neutral-disabled, #717180)", marginTop: 2 }}>{action}</span>
    </div>
  );
}

/** Keyboard focus opens/closes the marker tooltip. */
export const v4FocusTooltipHandler = (e: L.LeafletEvent) => {
  const marker = e.target as L.Marker;
  const el = marker.getElement();
  if (!el) return;
  el.setAttribute("tabindex", "0");
  el.setAttribute("aria-label", marker.options.title ?? "Matched screen");
  el.addEventListener("focus", () => marker.openTooltip());
  el.addEventListener("blur", () => marker.closeTooltip());
};
