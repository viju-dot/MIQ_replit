/* =========================================================================
 * TV Audience & Content Planner — V5 mock data model
 *
 * Deterministic, self-contained synthetic data faithful to the delivered
 * wireframe + full spec. No fetches. All numbers derive from a stable seed of
 * the active filter combination so cross-filters change data predictably and
 * re-render identically on reload. Relationships are plausible (spec §17):
 * high-index genres carry higher minutes; Commercials meaningfully differs
 * from All; a Streaming tab yields streaming apps, not linear channels.
 * ========================================================================= */

import { seeded } from "./primitives";
import type { Option } from "./primitives";

/* ------------------------------------------------------------- markets ----- */

export const MARKETS: Option[] = [
  { value: "UK", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "IT", label: "Italy" },
  { value: "ES", label: "Spain" },
];

/* UK granular demographic dimensions (spec §5). */
export const MOSAIC: Option[] = [
  { value: "all", label: "All Mosaic groups" },
  { value: "city-prosperity", label: "City Prosperity" },
  { value: "prestige-positions", label: "Prestige Positions" },
  { value: "country-living", label: "Country Living" },
  { value: "suburban-stability", label: "Suburban Stability" },
  { value: "rental-hubs", label: "Rental Hubs" },
  { value: "vintage-value", label: "Vintage Value" },
];
export const AGE: Option[] = [
  { value: "all", label: "All ages" },
  { value: "16-24", label: "16–24" },
  { value: "25-34", label: "25–34" },
  { value: "35-44", label: "35–44" },
  { value: "45-54", label: "45–54" },
  { value: "55-64", label: "55–64" },
  { value: "65plus", label: "65+" },
];
export const GENDER: Option[] = [
  { value: "all", label: "All genders" },
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
];
export const CHILDREN: Option[] = [
  { value: "all", label: "Any household" },
  { value: "with", label: "Children in household" },
  { value: "without", label: "No children" },
];

/* EU markets: simpler Heavy / Medium / Light TV consumption classifications. */
export const CONSUMPTION_TIER: Option[] = [
  { value: "all", label: "All viewers" },
  { value: "heavy", label: "Heavy TV" },
  { value: "medium", label: "Medium TV" },
  { value: "light", label: "Light TV" },
];

/* Sensible date-range option (spec allows a date range as a global filter). */
export const DATE_RANGE: Option[] = [
  { value: "l4w", label: "Last 4 weeks" },
  { value: "l12w", label: "Last 12 weeks" },
  { value: "l26w", label: "Last 26 weeks" },
  { value: "l52w", label: "Last 52 weeks" },
];

export type Filters = {
  market: string;
  // UK dimensions
  mosaic: string[];
  age: string[];
  gender: string[];
  children: string[];
  // EU dimension
  tier: string;
  // shared
  dateRange: string;
};

export const DEFAULT_FILTERS: Filters = {
  market: "UK",
  mosaic: [],
  age: [],
  gender: [],
  children: [],
  tier: "all",
  dateRange: "l12w",
};

export function isUK(f: Filters): boolean {
  return f.market === "UK";
}

/* A deliberately-reachable empty combo (partial/empty state demo). */
export function isEmptyCombo(f: Filters): boolean {
  return f.market === "IT" && f.tier === "heavy";
}

export function seedKey(f: Filters, extra = ""): string {
  const selected = (values: string[]) => [...values].sort().join(",") || "all";
  return `${f.market}|${selected(f.mosaic)}|${selected(f.age)}|${selected(f.gender)}|${selected(f.children)}|${f.tier}|${f.dateRange}|${extra}`;
}

/* --------------------------------------------- coherent entity model ------ *
 * A single base audience model per entity so minutes, index and household
 * reach are MUTUALLY CONSISTENT (spec §17). Every entity draws:
 *   - baseline: its national-average weight (independent of the audience),
 *   - affinity: how much THIS audience over/under-indexes on it (~0.6..2.1),
 * then all displayed metrics derive from the same two numbers:
 *   - minutes  = baseline × affinity      (audience consumption)
 *   - index    = round(affinity × 100)    (index 165 ⇒ affinity 1.65)
 *   - hhShare  = reachFloor..reachCeil scaled by affinity (household reach)
 * A high index therefore always implies visibly higher consumption & reach.
 * `weight` (0..1) optionally scales an entity down (e.g. Commercials removing
 * public-service share) WITHOUT breaking the index↔minutes↔reach coherence. */
export type EntityModel = {
  baseline: number;
  affinity: number;
  minutes: number;
  index: number;
  hhShare: number;
};

export function entityModel(
  audienceSeed: string,
  entitySeed: string,
  opts: {
    baseMin: number;
    baseMax: number;
    affMin?: number;
    affMax?: number;
    reachMin?: number;
    reachMax?: number;
    weight?: number;
  },
): EntityModel {
  const affMin = opts.affMin ?? 0.62;
  const affMax = opts.affMax ?? 2.1;
  const reachMin = opts.reachMin ?? 3;
  const reachMax = opts.reachMax ?? 34;
  const weight = opts.weight ?? 1;
  // Baseline depends only on the entity (national average), not the audience.
  const baseline = seeded(`base-${entitySeed}`, opts.baseMin, opts.baseMax) * weight;
  // Affinity depends on audience × entity.
  const affinity = seeded(`aff-${audienceSeed}-${entitySeed}`, affMin, affMax);
  const minutes = Math.max(1, Math.round(baseline * affinity));
  const index = Math.round(affinity * 100);
  // Household reach tracks affinity monotonically (compressed via sqrt so it
  // stays in a plausible band while still ordering with the index).
  const reachSpan = reachMax - reachMin;
  const affNorm = Math.min(1, (affinity - affMin) / (affMax - affMin));
  const hhShare = (reachMin + Math.sqrt(affNorm) * reachSpan) * weight;
  return { baseline, affinity, minutes, index, hhShare };
}

/* Market multiplier so EU markets read differently from the UK. */
export function marketMult(market: string): number {
  return { UK: 1, DE: 0.94, FR: 0.9, IT: 0.86, ES: 0.88 }[market] ?? 1;
}

/* --------------------------------------------- consumption types (donut) --- */

export type ConsumptionKey = "linear" | "streaming" | "fast";

export const CONSUMPTION_TYPES: {
  key: ConsumptionKey;
  name: string;
  color: string;
}[] = [
  { key: "linear", name: "Linear TV", color: "var(--datavis-qualitative-4, #7c33b5)" },
  { key: "streaming", name: "Streaming", color: "var(--datavis-qualitative-3, #a857e5)" },
  { key: "fast", name: "FAST", color: "var(--datavis-qualitative-1, #fbbb3b)" },
];

/* -------------------------------------------------- channels / apps -------- */

export type TvType = "Linear" | "Streaming" | "FAST";

/* Wireframe tab labels ↔ internal TvType. */
export const TV_TABS: { label: string; type: TvType }[] = [
  { label: "Linear TV", type: "Linear" },
  { label: "Streaming", type: "Streaming" },
  { label: "Fast", type: "FAST" },
];
export function tabToType(label: string): TvType {
  return TV_TABS.find((t) => t.label === label)?.type ?? "Linear";
}

type Channel = { name: string; type: TvType };

/* Per-market channel/app inventories. Streaming apps are broadly pan-European;
 * linear line-ups differ by market. FAST services overlap. */
const STREAMING: Channel[] = [
  { name: "Netflix", type: "Streaming" },
  { name: "Amazon Prime", type: "Streaming" },
  { name: "Disney+", type: "Streaming" },
  { name: "Paramount+", type: "Streaming" },
  { name: "Apple TV+", type: "Streaming" },
  { name: "YouTube", type: "Streaming" },
];
const FAST_SERVICES: Channel[] = [
  { name: "Pluto TV", type: "FAST" },
  { name: "Samsung TV Plus", type: "FAST" },
  { name: "Rakuten TV", type: "FAST" },
  { name: "LG Channels", type: "FAST" },
];
const LINEAR_BY_MARKET: Record<string, Channel[]> = {
  UK: [
    { name: "BBC iPlayer", type: "Linear" },
    { name: "ITVX", type: "Linear" },
    { name: "Channel 4", type: "Linear" },
    { name: "NOW", type: "Linear" },
    { name: "My5", type: "Linear" },
    { name: "U", type: "Linear" },
  ],
  DE: [
    { name: "ARD Mediathek", type: "Linear" },
    { name: "ZDF Mediathek", type: "Linear" },
    { name: "RTL+", type: "Linear" },
    { name: "Joyn", type: "Linear" },
    { name: "ProSieben", type: "Linear" },
  ],
  FR: [
    { name: "france.tv", type: "Linear" },
    { name: "TF1+", type: "Linear" },
    { name: "M6+", type: "Linear" },
    { name: "Canal+", type: "Linear" },
    { name: "Arte", type: "Linear" },
  ],
  IT: [
    { name: "RaiPlay", type: "Linear" },
    { name: "Mediaset Infinity", type: "Linear" },
    { name: "La7", type: "Linear" },
    { name: "TIMvision", type: "Linear" },
  ],
  ES: [
    { name: "RTVE Play", type: "Linear" },
    { name: "Atresplayer", type: "Linear" },
    { name: "Mitele", type: "Linear" },
    { name: "Movistar Plus+", type: "Linear" },
  ],
};

/* Non-commercial (no advertising opportunity) networks PER MARKET — public
 * broadcasters differ by market, so the Commercials filter is market/data-
 * source dependent (spec §7: do NOT hard-code BBC universally). */
const NON_COMMERCIAL_BY_MARKET: Record<string, string[]> = {
  UK: ["BBC iPlayer"],
  DE: ["ARD Mediathek", "ZDF Mediathek", "Arte"],
  FR: ["france.tv", "Arte"],
  IT: ["RaiPlay"],
  ES: ["RTVE Play"],
};

export function channelsFor(market: string, type: TvType): string[] {
  if (type === "Streaming") return STREAMING.map((c) => c.name);
  if (type === "FAST") return FAST_SERVICES.map((c) => c.name);
  return (LINEAR_BY_MARKET[market] ?? LINEAR_BY_MARKET.UK).map((c) => c.name);
}

export function nonCommercialNetworks(market: string): string[] {
  return NON_COMMERCIAL_BY_MARKET[market] ?? [];
}

/* Consumption donut key → temporal/channel TvType tab (used to sync the
 * Temporal + Time-Spent tabs when a donut type is selected). */
export function typeKeyToTvType(key: ConsumptionKey | null): TvType | null {
  if (key === "linear") return "Linear";
  if (key === "streaming") return "Streaming";
  if (key === "fast") return "FAST";
  return null; // "home" / null → no tab constraint
}
export function tvTypeToTabLabel(type: TvType): string {
  return TV_TABS.find((t) => t.type === type)?.label ?? "Linear TV";
}

/* Which TvType a given platform/app belongs to (for scoping shows to the
 * selected consumption type). Linear line-ups are market-specific. */
export function platformType(market: string, name: string): TvType {
  if (STREAMING.some((c) => c.name === name)) return "Streaming";
  if (FAST_SERVICES.some((c) => c.name === name)) return "FAST";
  return "Linear";
}

export function isCommercialNetwork(market: string, name: string): boolean {
  return !nonCommercialNetworks(market).includes(name);
}

/* ---------------------------------------------------------- genres --------- */

/* Confirmed IAB taxonomy (spec §9B). */
export const GENRES = [
  "Comedy",
  "News",
  "Film",
  "Sports",
  "Drama",
  "Reality",
  "Action",
  "Documentary",
  "Kids",
  "Travel",
  "Food",
  "Home improvement",
];

export const SHOWS_BY_GENRE: Record<string, string[]> = {
  Comedy: ["Ted Lasso", "Ghosts", "Taskmaster", "Brooklyn 99", "Only Fools", "Derry Girls", "The Office", "Friends", "Modern Family", "Community", "Would I Lie", "Not Going Out"],
  News: ["News at Ten", "Channel 4 News", "Sky News", "Newsnight", "GB News", "Evening News", "Question Time", "Panorama", "Dispatches", "The Andrew Marr Show"],
  Film: ["Oppenheimer", "Barbie", "Dune: Part Two", "Wonka", "The Batman", "Saltburn", "Napoleon", "Elemental", "Top Gun: Maverick", "Poor Things"],
  Sports: ["Premier League", "Match of the Day", "F1 Grand Prix", "Six Nations", "Wimbledon", "Champions League", "The Ashes", "Darts World Champ", "Boxing Night", "NFL Sunday"],
  Drama: ["The Crown", "Happy Valley", "Line of Duty", "Peaky Blinders", "Bodyguard", "The Gold", "Sherwood", "Vigil", "The Responder", "Mr Bates vs Post Office"],
  Reality: ["Love Island", "The Traitors", "Bake Off", "Strictly", "I'm A Celebrity", "MAFS", "Big Brother", "Gogglebox", "First Dates", "Race Across the World"],
  Action: ["Reacher", "The Boys", "Jack Ryan", "Slow Horses", "Citadel", "The Night Agent", "Mr & Mrs Smith", "Fubar", "Special Ops", "The Continental"],
  Documentary: ["Planet Earth III", "Blue Planet", "Beckham", "Wild Isles", "Dynasties", "The Last Dance", "Our Planet", "Frozen Planet", "Attenborough", "Prehistoric Planet"],
  Kids: ["Bluey", "Peppa Pig", "Paw Patrol", "Hey Duggee", "Spidey", "Gabby's Dollhouse", "Numberblocks", "Octonauts", "Bing", "Andy's Adventures"],
  Travel: ["Race Across the World", "Amazing Hotels", "Rick Stein's Cornwall", "Grand Tour", "Michael Palin", "Wonders of Europe", "Coastal Britain", "Portrait Artist", "The Trip", "Compass"],
  Food: ["MasterChef", "Bake Off", "Saturday Kitchen", "Great British Menu", "Kitchen Nightmares", "Nadiya's Table", "James Martin", "Simply Raymond", "Sunday Brunch", "Best Bites"],
  "Home improvement": ["Grand Designs", "DIY SOS", "Homes Under the Hammer", "Sort Your Life Out", "Escape to the Country", "Interior Design Masters", "The Restorers", "Your Garden Made Perfect", "Room to Improve", "Build a New Life"],
};

/* Which network/platform a show sits on. Uses a market-aware fallback so shows
 * map onto that market's networks (supports migration + commercial filtering).*/
const SHOW_NETWORK: Record<string, string> = {
  "The Traitors": "BBC iPlayer",
  Ghosts: "BBC iPlayer",
  "The Crown": "Netflix",
  Reacher: "Amazon Prime",
  "Ted Lasso": "Apple TV+",
  "Love Island": "ITVX",
  "Bake Off": "Channel 4",
  "Slow Horses": "Apple TV+",
  Bluey: "Disney+",
  "Match of the Day": "BBC iPlayer",
};

export function networkOf(show: string, market: string): string {
  const base = show.replace(/ \(S\d+\)$/, "");
  if (market === "UK" && SHOW_NETWORK[base]) return SHOW_NETWORK[base];
  // Deterministic mix across ALL three TV types (Linear + Streaming + FAST) so
  // that scoping the shows table / migration by any consumption type always
  // yields a non-empty, platform-consistent result.
  const pool = [
    ...channelsFor(market, "Linear"),
    ...STREAMING.map((c) => c.name),
    ...FAST_SERVICES.map((c) => c.name),
  ];
  return pool[Math.floor(seeded(`net-${market}-${base}`, 0, pool.length - 0.001))];
}

/* Per-genre non-commercial lean (public-service weight) used to make the
 * Commercials filter shift values plausibly. News/Documentary/Kids skew
 * public-service; Reality/Sports/Film lean commercial. 0..~0.42. */
export function nonCommercialShare(genre: string): number {
  const lean: Record<string, number> = {
    News: 0.42,
    Documentary: 0.4,
    Kids: 0.34,
    Drama: 0.3,
    Comedy: 0.24,
    "Home improvement": 0.2,
    Food: 0.2,
    Travel: 0.22,
    Action: 0.12,
    Film: 0.1,
    Reality: 0.14,
    Sports: 0.16,
  };
  return lean[genre] ?? 0.2;
}

/* -------------------------------------------------- temporal dimensions ---- */

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
/* Six time-of-day columns exactly per wireframe / spec §10. */
export const DAYPARTS = [
  "Early AM",
  "Morning",
  "Daytime",
  "Afternoon",
  "Primetime",
  "Late Night",
];

/* -------------------------------------------------------- lookbacks -------- */

/* Trends "Weeks" dropdown: 7/15-day DoY, 30/60-day WoW (spec §9A). */
export const LOOKBACK: Option[] = [
  { value: "doy7", label: "7-day (DoY)" },
  { value: "doy15", label: "15-day (DoY)" },
  { value: "wow30", label: "30-day (WoW)" },
  { value: "wow60", label: "60-day (WoW)" },
];

/* Trends "Top N" dropdown. */
export const TOP_N: Option[] = [
  { value: "10", label: "Top 10" },
  { value: "25", label: "Top 25" },
  { value: "50", label: "Top 50" },
];

/* --------------------------------------------------- migration behaviours -- */

export type MigrationBehaviour =
  | "Stay on same channel"
  | "Switch channel"
  | "Move to streaming app"
  | "Stop watching";

export const MIGRATION_BEHAVIOURS: MigrationBehaviour[] = [
  "Stay on same channel",
  "Switch channel",
  "Move to streaming app",
  "Stop watching",
];
