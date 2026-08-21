/* =========================================================================
 * TV Audience & Content Planner — V3 mock data model
 *
 * Deterministic, self-contained mock data for the "MiQ TV Audience & Content
 * Planner" V3 renderer. No fetches. All numbers derive from a stable seed of
 * the active filter combination so cross-filters change the data predictably
 * (and re-render identically on reload) — realistic UK/EU TV values.
 * ========================================================================= */

import { seeded } from "./primitives";
import type { Option } from "./primitives";

/* ------------------------------------------------------------- filters ----- */

export const MARKETS: Option[] = [
  { value: "UK", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "IT", label: "Italy" },
  { value: "ES", label: "Spain" },
];

/* UK-only demographic dimensions (spec: Mosaic / Age / Gender). */
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

/* Non-UK markets: simpler TV consumption inputs (spec: Heavy/Medium/Light). */
export const CONSUMPTION_TIER: Option[] = [
  { value: "all", label: "All viewers" },
  { value: "heavy", label: "Heavy TV" },
  { value: "medium", label: "Medium TV" },
  { value: "light", label: "Light TV" },
];

export type Filters = {
  market: string;
  // UK dimensions
  mosaic: string;
  age: string;
  gender: string;
  // non-UK dimension
  tier: string;
};

export const DEFAULT_FILTERS: Filters = {
  market: "UK",
  mosaic: "all",
  age: "all",
  gender: "all",
  tier: "all",
};

export function isUK(f: Filters): boolean {
  return f.market === "UK";
}

/* A deliberately-reachable empty combo (partial/empty state demo): IT + Heavy. */
export function isEmptyCombo(f: Filters): boolean {
  return f.market === "IT" && f.tier === "heavy";
}

export function seedKey(f: Filters, extra = ""): string {
  return `${f.market}|${f.mosaic}|${f.age}|${f.gender}|${f.tier}|${extra}`;
}

/* ------------------------------------------------ consumption types (§1) --- */

export type ConsumptionKey = "linear" | "streaming" | "fast" | "home";

export const CONSUMPTION_TYPES: {
  key: ConsumptionKey;
  name: string;
  color: string;
}[] = [
  { key: "linear", name: "Linear", color: "var(--datavis-qualitative-4, #7c33b5)" },
  { key: "streaming", name: "Streaming", color: "var(--datavis-qualitative-3, #a857e5)" },
  { key: "fast", name: "FAST", color: "var(--datavis-qualitative-1, #fbbb3b)" },
  { key: "home", name: "Homescreen", color: "var(--datavis-qualitative-2, #ef8736)" },
];

/* ------------------------------------------------- channels / apps (§2) ---- */

export type TvType = "Linear" | "Streaming" | "FAST";

export const CHANNELS: { name: string; type: TvType; commercial: boolean }[] = [
  // Streaming apps
  { name: "Netflix", type: "Streaming", commercial: true },
  { name: "Amazon Prime", type: "Streaming", commercial: true },
  { name: "Disney+", type: "Streaming", commercial: true },
  { name: "Paramount+", type: "Streaming", commercial: true },
  { name: "Apple TV+", type: "Streaming", commercial: true },
  { name: "YouTube", type: "Streaming", commercial: true },
  // Linear / BVOD
  { name: "BBC iPlayer", type: "Linear", commercial: false }, // non-commercial (BBC)
  { name: "ITVX", type: "Linear", commercial: true },
  { name: "Channel 4", type: "Linear", commercial: true },
  { name: "NOW", type: "Linear", commercial: true },
  { name: "My5", type: "Linear", commercial: true },
  { name: "U", type: "Linear", commercial: true },
  // FAST
  { name: "Pluto TV", type: "FAST", commercial: true },
  { name: "Samsung TV Plus", type: "FAST", commercial: true },
  { name: "Rakuten TV", type: "FAST", commercial: true },
];

/* ---------------------------------------------------------- genres (§4) ---- */

/* IAB-style genre taxonomy. */
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
  News: ["BBC News at Ten", "Channel 4 News", "Sky News", "Newsnight", "GB News", "ITV Evening News", "Question Time", "Panorama", "Dispatches", "The Andrew Marr Show"],
  Film: ["Oppenheimer", "Barbie", "Dune: Part Two", "Wonka", "The Batman", "Saltburn", "Napoleon", "Elemental", "Top Gun: Maverick", "Poor Things"],
  Sports: ["Premier League", "Match of the Day", "F1 Grand Prix", "Six Nations", "Wimbledon", "Champions League", "The Ashes", "Darts World Champ", "Boxing Night", "NFL UK"],
  Drama: ["The Crown", "Happy Valley", "Line of Duty", "Peaky Blinders", "Bodyguard", "The Gold", "Sherwood", "Vigil", "The Responder", "Mr Bates vs Post Office"],
  Reality: ["Love Island", "The Traitors", "Bake Off", "Strictly", "I'm A Celebrity", "MAFS UK", "Big Brother", "Gogglebox", "First Dates", "Race Across the World"],
  Action: ["Reacher", "The Boys", "Jack Ryan", "Slow Horses", "Citadel", "The Night Agent", "Mr & Mrs Smith", "Fubar", "Special Ops", "The Continental"],
  Documentary: ["Planet Earth III", "Blue Planet", "Beckham", "Wild Isles", "Dynasties", "The Last Dance", "Our Planet", "Frozen Planet", "Attenborough", "Prehistoric Planet"],
  Kids: ["Bluey", "Peppa Pig", "Paw Patrol", "Hey Duggee", "Spidey", "Gabby's Dollhouse", "Numberblocks", "Octonauts", "Bing", "Andy's Adventures"],
  Travel: ["Race Across the World", "Amazing Hotels", "Rick Stein's Cornwall", "Grand Tour", "Michael Palin", "Wonders of Europe", "Coastal Britain", "Portrait Artist", "The Trip", "Compass"],
  Food: ["MasterChef", "Bake Off", "Saturday Kitchen", "Great British Menu", "Kitchen Nightmares", "Nadiya's Table", "James Martin", "Simply Raymond", "Sunday Brunch", "Best Bites"],
  "Home improvement": ["Grand Designs", "DIY SOS", "Homes Under the Hammer", "Sort Your Life Out", "Escape to the Country", "Interior Design Masters", "The Restorers", "Your Garden Made Perfect", "Room to Improve", "Build a New Life"],
};

/* Which platform/network a show sits on (for migration signals, §8). */
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
export function networkOf(show: string): string {
  if (SHOW_NETWORK[show]) return SHOW_NETWORK[show];
  const pool = ["Netflix", "ITVX", "BBC iPlayer", "Channel 4", "Amazon Prime", "Disney+"];
  return pool[Math.floor(seeded(`net-${show}`, 0, pool.length - 0.001))];
}

/* -------------------------------------------- commercial environment ------- */

/* Networks/environments that carry no advertising (e.g. BBC). Derived from the
 * channel table so the "Commercial only" toggle is a single global constraint
 * every section can consult. */
export const NON_COMMERCIAL_NETWORKS: string[] = CHANNELS.filter(
  (c) => !c.commercial,
).map((c) => c.name);

export function isCommercialNetwork(name: string): boolean {
  return !NON_COMMERCIAL_NETWORKS.includes(name);
}

/* Deterministic share of a genre's linear/total minutes carried by
 * non-commercial (BBC-type) environments. News, Documentary and Kids skew
 * public-service-heavy; Reality/Sports/Film lean commercial. Used to shrink and
 * renormalise values when Commercial only is active. 0..~0.45. */
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

/* Platforms for share-of-viewing (§5). */
export const SOV_PLATFORMS: { key: TvType; name: string; color: string }[] = [
  { key: "Linear", name: "Linear", color: "var(--datavis-qualitative-4, #7c33b5)" },
  { key: "Streaming", name: "Streaming", color: "var(--datavis-qualitative-3, #a857e5)" },
  { key: "FAST", name: "FAST", color: "var(--datavis-qualitative-1, #fbbb3b)" },
];

export const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
export const DAYPARTS = ["Early AM", "Daytime", "Afternoon", "Peak", "Late Night"];

/* Lookback options (§7): DoY for 7/15 day, WoW for 30/60 day. */
export const LOOKBACK: Option[] = [
  { value: "doy7", label: "7-day (day-on-year)" },
  { value: "doy15", label: "15-day (day-on-year)" },
  { value: "wow30", label: "30-day (week-on-week)" },
  { value: "wow60", label: "60-day (week-on-week)" },
];

/* Market multiplier so EU markets read differently from the UK. */
export function marketMult(market: string): number {
  return { UK: 1, DE: 0.94, FR: 0.9, IT: 0.86, ES: 0.88 }[market] ?? 1;
}
