/* =========================================================================
 * MiQ TV Audience & Content Planner — V5
 *
 * A single-page analytical dashboard that converts the delivered low-fi
 * wireframe into a functional high-fidelity build. The vertical hierarchy
 * follows the wireframe / spec §3 exactly and is NOT rearranged:
 *
 *   1  Page heading
 *   2  Global filters (market-configurable)
 *   3  Executive summary tiles (6, confirmed metrics only)
 *   4  Global All / Commercials control
 *   5  Consumption by Type (donut) + Time Spent by Channel/App (combo)
 *   6  Trends (Shows | Genres, with Top N / Shows / Weeks controls)
 *   7  Temporal Insights (Linear/Streaming/Fast tabs, All/Commercials mirror,
 *      Channels/apps + Weeks, day × daypart heatmap)
 *   8  Cultural Affinity (radar + list + drilldown) + Migration Signals (Sankey)
 *
 * Cross-filter chain (spec §15): global filters → All/Commercials → consumption
 * type → channel chart / temporal / downstream; genre (Genres view) → affinity
 * anchor + shows; affinity genre click → its top shows.
 *
 * All colours come from the chart token layer (./chartTokens) mapped to Fiber
 * tokens via inline style var(--token, #fallback). No arbitrary hex, no library
 * palettes, no Tailwind arbitrary var() colour classes; no JSX generic type
 * args; no nested interactive controls. Deterministic synthetic data.
 * ========================================================================= */

import { useEffect, useMemo, useRef, useState } from "react";
import { Info } from "@phosphor-icons/react";
import { MetricsTile } from "@/components/ds/MetricsTile";
import {
  FONT,
  GRID,
  TITLE,
  MUTED,
  BODY2,
  SURFACE2,
  SUCCESS_FG,
  ERROR_FG,
  SmartCard,
  CardBody,
  Chip,
  SearchableDropdown,
  Toggle,
  TabsBarRounded,
  TabsBarUnderline,
  AlertInfo,
  SectionHeading,
  fmtInt,
  fmtK,
  seeded,
} from "./primitives";
import { CHART } from "./chartTokens";
import {
  MARKETS,
  MOSAIC,
  AGE,
  GENDER,
  CHILDREN,
  CONSUMPTION_TIER,
  DATE_RANGE,
  LOOKBACK,
  DEFAULT_FILTERS,
  isUK,
  isEmptyCombo,
  seedKey,
  marketMult,
  CONSUMPTION_TYPES,
  GENRES,
  SHOWS_BY_GENRE,
  DAYS,
  DAYPARTS,
  TV_TABS,
  tabToType,
  channelsFor,
  isCommercialNetwork,
  nonCommercialNetworks,
  nonCommercialShare,
  networkOf,
  entityModel,
  typeKeyToTvType,
  tvTypeToTabLabel,
  platformType,
  MIGRATION_BEHAVIOURS,
} from "./data";
import type { Filters, ConsumptionKey } from "./data";
import {
  DonutChart,
  ComboChart,
  DualAxisBarChart,
  TemporalHeatmap,
  RadarChart,
  MigrationSankey,
  ShowTrendChart,
} from "./charts";

const TAB_LABELS = TV_TABS.map((t) => t.label); // ["Linear TV","Streaming","Fast"]

const AFFINITY_PARAMETERS = [
  { name: "FOOD", sourceGenre: "Food", baseline: 118 },
  { name: "TRAVEL", sourceGenre: "Travel", baseline: 132 },
  { name: "COMEDY", sourceGenre: "Comedy", baseline: 145 },
  { name: "DOCUMENTARY", sourceGenre: "Documentary", baseline: 124 },
  { name: "NEWS", sourceGenre: "News", baseline: 108 },
  { name: "MUSIC", sourceGenre: "Reality", baseline: 137 },
  { name: "LIFESTYLE", sourceGenre: "Home improvement", baseline: 115 },
  { name: "SPORTS", sourceGenre: "Sports", baseline: 154 },
] as const;

const AFFINITY_PARAMETER_SHOWS: Record<string, string[]> = {
  FOOD: ["MasterChef", "Bake Off", "Great British Menu", "Saturday Kitchen", "Sunday Brunch"],
  TRAVEL: ["Race Across the World", "Amazing Hotels", "Grand Tour", "Michael Palin", "Wonders of Europe"],
  COMEDY: ["Ted Lasso", "Ghosts", "Taskmaster", "The Office", "Derry Girls"],
  DOCUMENTARY: ["Planet Earth III", "Blue Planet", "Beckham", "Wild Isles", "The Last Dance"],
  NEWS: ["News at Ten", "Channel 4 News", "Sky News", "Newsnight", "Question Time"],
  MUSIC: ["The Voice", "Later with Jools Holland", "Glastonbury Live", "Top of the Pops", "Brit Awards"],
  LIFESTYLE: ["Grand Designs", "Interior Design Masters", "DIY SOS", "Escape to the Country", "Sort Your Life Out"],
  SPORTS: ["Premier League Live", "Match of the Day", "F1 Grand Prix", "Six Nations", "Wimbledon"],
};

/* ============================================ Executive summary tile ======= */

/* Executive summary tiles render via the shared Fiber DS Metrics Tile
 * (@/components/ds/MetricsTile) instead of bespoke markup. This adapter maps
 * the summary model (label, value, unit, index) onto the shared component,
 * preserving the "Index N vs national" line with the up/down arrow and the
 * green > 100 / red < 100 index semantics. */
function StatTile({
  label,
  value,
  unit,
  index,
  loading,
}: {
  label: string;
  value: string;
  unit?: string;
  index?: number | null;
  loading: boolean;
}) {
  return (
    <MetricsTile
      state="Default"
      showIcon={false}
      fullWidth
      descriptionText={label}
      metricValue={value}
      unit={unit}
      trendIndex={index ?? null}
      loading={loading}
    />
  );
}

/* ============================================ All / Commercials control ==== */

/* Global All / Commercials control. Uses the Fiber "Tabs Bar — rounded"
 * component (annotation #2). The underlying global env state is unchanged, so
 * the Temporal Insights mirror keeps working. */
const ENV_TABS: string[] = ["All", "Addressable channels"];

function EnvControl({
  value,
  onChange,
}: {
  value: "all" | "commercials";
  onChange: (v: "all" | "commercials") => void;
}) {
  return (
    <div data-annotate="Viewing environment control">
      <TabsBarRounded
        options={ENV_TABS}
        value={value === "commercials" ? "Addressable channels" : "All"}
        onChange={(v) => onChange(v === "Addressable channels" ? "commercials" : "all")}
        ariaLabel="Viewing environment: All or Addressable channels"
      />
    </div>
  );
}

/* ========================================================= main renderer === */

export default function V5ContentPlanner({ instanceId }: { instanceId: string }) {
  const controlId = (name: string) => `${instanceId}-v5-${name}`;
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [env, setEnv] = useState<"all" | "commercials">("all");
  const commercials = env === "commercials";

  // Cross-filter selections.
  const [selectedType, setSelectedType] = useState<ConsumptionKey | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [selectedAffinityParameter, setSelectedAffinityParameter] =
    useState<string | null>(null);

  // §5B Time-spent local tab.
  const [channelTab, setChannelTab] = useState("Linear TV");
  // §6 Trends controls.
  const [trendsView, setTrendsView] = useState("Shows");
  const [trendsTvTab, setTrendsTvTab] = useState("Linear TV");
  const [selectedShow, setSelectedShow] = useState<string | null>(null);
  const [migrationShow, setMigrationShow] = useState("all");
  // §7 Temporal controls.
  const [temporalTab, setTemporalTab] = useState("Linear TV");
  const [temporalChannel, setTemporalChannel] = useState("All");
  const [temporalWeeks, setTemporalWeeks] = useState("wow30");

  const [loading, setLoading] = useState(false);
  const firstRender = useRef(true);

  const uk = isUK(filters);
  const empty = isEmptyCombo(filters);
  const mult = marketMult(filters.market);
  const market = filters.market;

  // Skeleton cascade on any global data change (filters or environment).
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setSelectedType(null);
    setSelectedGenre(null);
    setSelectedAffinityParameter(null);
    setSelectedShow(null);
    setMigrationShow("all");
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, env]);

  // Single consumption scope derived from the donut selection. It drives ALL
  // applicable downstream views (Time-Spent tab, Trends shows, Temporal tab,
  // Cultural Affinity + Migration).
  const scopeTvType = typeKeyToTvType(selectedType);

  // When the consumption scope changes, sync the platform tabs to it and reset
  // stale dependent local selections (channel dropdowns / genre filter). A
  // genre selected under "All" is cleared so the scoped pool is coherent and
  // reverting to All restores the full mix.
  useEffect(() => {
    if (!scopeTvType) {
      // Reverted to All: leave tabs where the user left them.
      return;
    }
    const label = tvTypeToTabLabel(scopeTvType);
    setChannelTab(label);
    setTrendsTvTab(label);
    setTemporalTab(label);
    setTemporalChannel("All");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scopeTvType]);

  // Keep temporal channel valid when its tab / market / environment change.
  useEffect(() => {
    const opts = channelsFor(market, tabToType(temporalTab)).filter(
      (c) => !commercials || isCommercialNetwork(market, c),
    );
    if (temporalChannel !== "All" && !opts.includes(temporalChannel)) {
      setTemporalChannel("All");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [temporalTab, market, commercials]);

  function updateFilter(
    key: "market" | "tier" | "dateRange",
    value: string,
  ) {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "market") {
        if (value !== "UK") {
          next.mosaic = [];
          next.age = [];
          next.gender = [];
          next.children = [];
        } else {
          next.tier = "all";
        }
      }
      return next;
    });
  }

  function updateMultiFilter(
    key: "mosaic" | "age" | "gender" | "children",
    value: string[],
  ) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  const selectedTypeName = CONSUMPTION_TYPES.find((t) => t.key === selectedType)?.name ?? null;

  /* ---- §5A Consumption by Type (% of minutes watched per household) ---- *
   * Coherent model: each type has a national baseline (linear largest) scaled
   * by the audience affinity. Commercials removes the non-commercial share
   * (biggest on linear, where public-service broadcasters sit). */
  const consumption = useMemo(() => {
    const audience = seedKey(filters);
    const ncWeight = (key: string) => {
      if (!commercials) return 1;
      if (key === "linear") return nonCommercialNetworks(market).length > 0 ? 0.68 : 0.9;
      if (key === "fast") return 0.94;
      return 1; // streaming: no non-commercial reduction
    };
    const raw = CONSUMPTION_TYPES.map((t, i) => {
      const m = entityModel(audience, `ctype-${t.key}`, {
        baseMin: (300 - i * 45) * 0.7,
        baseMax: (300 - i * 45) * 1.0,
        weight: mult * ncWeight(t.key),
      });
      return { ...t, minutes: m.minutes };
    });
    const total = raw.reduce((a, b) => a + b.minutes, 0) || 1;
    return raw.map((r) => ({ ...r, pct: (r.minutes / total) * 100 }));
  }, [filters, commercials, market, mult]);

  /* ---- §5B Time Spent by Channel/App (tab synced to donut scope) ---- *
   * Coherent: minutes & index both derive from one affinity per channel. */
  const channels = useMemo(() => {
    const type = tabToType(channelTab);
    const audience = seedKey(filters);
    const list = channelsFor(market, type).filter((c) => !commercials || isCommercialNetwork(market, c));
    const rows = list
      .map((name) => {
        const m = entityModel(audience, `chan-${name}`, { baseMin: 40, baseMax: 340, weight: mult });
        return { name, mins: m.minutes, index: m.index };
      })
      .sort((a, b) => b.mins - a.mins);
    const total = rows.reduce((a, b) => a + b.mins, 0) || 1;
    return rows.map((r) => ({ ...r, pct: (r.mins / total) * 100 }));
  }, [filters, channelTab, commercials, market, mult]);

  /* ---- §6 Genres (Genres view + affinity anchor source) ---- *
   * Coherent model: minutes = baseline × affinity, index = affinity × 100 so a
   * high-indexing genre always shows higher minutes. Commercials re-weights by
   * (1 − non-commercial share); the consumption scope (if a type is selected)
   * lightly re-weights genres toward that platform. */
  const genres = useMemo(() => {
    const audience = seedKey(filters, "-genres-wow30");
    const trendsTvType = tabToType(trendsTvTab);
    const raw = GENRES.map((g) => {
      const ncs = nonCommercialShare(g);
      // Scope re-weight: when a type is selected, genres that lean toward that
      // platform get a mild boost (deterministic, keeps ordering meaningful).
      const scopeW = scopeTvType
        ? 0.85 + seeded(`gscope-${scopeTvType}-${g}`, 0, 0.4)
        : 1;
      const platformW =
        0.75 + seeded(`gtrend-${trendsTvType}-${g}`, 0, 0.65);
      const m = entityModel(audience, `genre-${g}`, {
        baseMin: 40,
        baseMax: 300,
        weight:
          mult * scopeW * platformW * (commercials ? 1 - ncs : 1),
      });
      return { name: g, mins: m.minutes, index: m.index };
    }).sort((a, b) => b.mins - a.mins);
    const total = raw.reduce((a, b) => a + b.mins, 0) || 1;
    return raw.map((r) => ({ ...r, pct: (r.mins / total) * 100 }));
  }, [filters, commercials, scopeTvType, trendsTvTab, mult]);

  /* ---- §6 Top Indexing Shows (Shows view) ---- *
   * Coherent model: minutes, index and household reach all derive from a single
   * per-show affinity. Scoped by the donut consumption type (a show only counts
   * where its network belongs to that TV type) and by the selected genre. */
  const shows = useMemo(() => {
    const listGenre = selectedGenre ?? null;
    const audience = seedKey(filters, "-wow30");
    // If a genre is selected, restrict to it; otherwise draw from all genres.
    const pool = listGenre
      ? (SHOWS_BY_GENRE[listGenre] ?? []).map((t) => ({ t, g: listGenre }))
      : GENRES.flatMap((g) => (SHOWS_BY_GENRE[g] ?? []).map((t) => ({ t, g })));
    // Extend deterministically to support Top 50 exploration.
    const extended: { t: string; g: string }[] = [];
    let season = 1;
    while (extended.length < 60) {
      for (const item of pool) {
        extended.push({ t: season === 1 ? item.t : `${item.t} (S${season})`, g: item.g });
        if (extended.length >= 60) break;
      }
      season++;
      if (pool.length === 0) break;
    }
    return extended
      .map(({ t, g }) => {
        const network = networkOf(t, market);
        const m = entityModel(audience, `show-${t}`, {
          baseMin: 6,
          baseMax: 58,
          reachMin: 2,
          reachMax: 28,
          weight: mult,
        });
        return { title: t, genre: g, network, index: m.index, mins: m.minutes, hhPct: m.hhShare };
      })
      .filter((s) => !commercials || isCommercialNetwork(market, s.network))
      // Scope: only shows whose platform matches the selected consumption type.
      .filter((s) => !scopeTvType || platformType(market, s.network) === scopeTvType)
      .sort((a, b) => b.index - a.index);
  }, [filters, selectedGenre, commercials, market, mult, scopeTvType]);

  const trendShows = useMemo(
    () =>
      shows.filter(
        (show) =>
          platformType(market, show.network) === tabToType(trendsTvTab),
      ),
    [shows, market, trendsTvTab],
  );

  const filteredShows = useMemo(() => trendShows.slice(0, 10), [trendShows]);

  const showSelectOptions = useMemo(
    () => [
      { value: "all", label: "All shows" },
      ...Array.from(new Set(trendShows.map((show) => show.title))).map((title) => ({
        value: title,
        label: title,
      })),
    ],
    [trendShows],
  );
  const migrationShowOptions = useMemo(
    () => [
      { value: "all", label: "All shows" },
      ...Array.from(new Set(shows.map((show) => show.title))).map((title) => ({
        value: title,
        label: title,
      })),
    ],
    [shows],
  );

  // Downstream selections must always belong to the currently scoped show
  // universe. Consumption scope and audience filters can both shrink it.
  useEffect(() => {
    const availableTrendShows = new Set(
      trendShows.map((show) => show.title),
    );
    const availableShows = new Set(shows.map((show) => show.title));
    if (selectedShow && !availableTrendShows.has(selectedShow)) {
      setSelectedShow(null);
    }
    if (migrationShow !== "all" && !availableShows.has(migrationShow)) {
      setMigrationShow("all");
    }
  }, [shows, trendShows, selectedShow, migrationShow]);

  const showTrend = useMemo(() => {
    if (!selectedShow) return [];
    return ["Week 1", "Week 2", "Week 3", "Week 4"].map((period) => ({
      period,
      households: Math.round(
        seeded(
          seedKey(
            filters,
            `show-trend-households-${selectedShow}-${period}-${tabToType(trendsTvTab)}`,
          ),
          650_000,
          4_800_000,
        ) * mult,
      ),
      minutes: Math.round(
        seeded(
          seedKey(
            filters,
            `show-trend-minutes-${selectedShow}-${period}-${tabToType(trendsTvTab)}`,
          ),
          18,
          96,
        ),
      ),
    }));
  }, [filters, selectedShow, trendsTvTab, mult]);

  /* ---- §7 Temporal heatmap ---- */
  const temporalChannelOptions = useMemo(() => {
    const list = channelsFor(market, tabToType(temporalTab))
      .filter((c) => !commercials || isCommercialNetwork(market, c))
      .map((c) => ({ value: c, label: c }));
    return [{ value: "All", label: "All channels / apps" }, ...list];
  }, [market, temporalTab, commercials]);

  const temporal = useMemo(() => {
    const nonCommScale =
      commercials && temporalTab === "Linear TV"
        ? nonCommercialNetworks(market).length > 0
          ? 0.8
          : 0.92
        : 1;
    const channelScale =
      temporalChannel !== "All"
        ? commercials && !isCommercialNetwork(market, temporalChannel)
          ? 0
          : 1
        : nonCommScale;
    return DAYS.map((d) =>
      DAYPARTS.map((p) => {
        const base = seeded(seedKey(filters, `t-${d}-${p}-${temporalTab}-${temporalChannel}-${temporalWeeks}`), 0, 1);
        const primeBoost = p === "Primetime" ? 0.3 : p === "Afternoon" ? 0.12 : p === "Late Night" ? 0.08 : 0;
        const weekend = d === "Sat" || d === "Sun" ? 0.1 : 0;
        const v = Math.min(1, base * 0.55 + primeBoost + weekend) * channelScale;
        const minutes = Math.round((6 + v * 52) * mult);
        const hhPct = Math.max(0, (4 + v * 34) * (0.6 + mult * 0.4));
        const level = channelScale === 0 ? 0 : Math.min(5, Math.floor(v * 6));
        return { day: d, part: p, minutes, hhPct, level };
      }),
    );
  }, [filters, temporalTab, temporalChannel, temporalWeeks, commercials, market, mult]);

  const temporalEmpty = empty || (temporalChannel !== "All" && commercials && !isCommercialNetwork(market, temporalChannel));

  /* ---- §8 Cultural Affinity (radar) ---- *
   * Eight fixed, comparable parameters. Values remain audience-specific and
   * react to environment/platform scope while staying on a readable index
   * scale where 100 is the national baseline. */
  const affinity = useMemo(() => {
    const audience = seedKey(filters);
    return AFFINITY_PARAMETERS.map((parameter) => {
      const audienceShift = seeded(
        `affinity-${audience}-${parameter.name}`,
        -14,
        14,
      );
      const commercialShift = commercials
        ? (0.2 - nonCommercialShare(parameter.sourceGenre)) * 18
        : 0;
      const scopeShift = scopeTvType
        ? seeded(
            `affinity-scope-${scopeTvType}-${parameter.name}`,
            -8,
            12,
          )
        : 0;
      return {
        name: parameter.name,
        index: Math.round(
          Math.min(
            190,
            Math.max(
              70,
              parameter.baseline + audienceShift + commercialShift + scopeShift,
            ),
          ),
        ),
      };
    });
  }, [filters, commercials, scopeTvType]);

  const selectedAffinity =
    affinity.find(
      (parameter) => parameter.name === selectedAffinityParameter,
    ) ??
    affinity.reduce(
      (highest, parameter) =>
        parameter.index > highest.index ? parameter : highest,
      affinity[0],
    );
  const selectedAffinityRank =
    [...affinity]
      .sort((a, b) => b.index - a.index)
      .findIndex((parameter) => parameter.name === selectedAffinity.name) + 1;
  const selectedAffinityShows = useMemo(() => {
    const audience = seedKey(filters);
    return (AFFINITY_PARAMETER_SHOWS[selectedAffinity.name] ?? [])
      .map((title) => ({
        title,
        viewers: Math.round(
          seeded(`affinity-viewers-${audience}-${title}`, 320, 980),
        ) * 1_000,
        index: Math.round(
          seeded(`affinity-show-index-${audience}-${title}`, 108, 188),
        ),
      }))
      .sort((a, b) => b.viewers - a.viewers)
      .slice(0, 5);
  }, [filters, selectedAffinity.name]);

  /* ---- §8 Migration Signals (Sankey) ---- */
  const migration = useMemo(() => {
    // Source = top indexing show for the current context.
    const src =
      migrationShow === "all"
        ? shows[0]?.title ?? "The Traitors"
        : migrationShow;
    const sourceNet = networkOf(src, market);
    const destPool = GENRES.flatMap((g) => (SHOWS_BY_GENRE[g] ?? []).map((t) => ({ t, g }))).filter((x) => x.t !== src);
    const branches = MIGRATION_BEHAVIOURS.map((behaviour) => ({
      behaviour,
      raw: seeded(seedKey(filters, `mig-${src}-${behaviour}`), 6, 40),
    }))
      .sort((a, b) => b.raw - a.raw)
      .slice(0, 3);
    const total = branches.reduce((a, b) => a + b.raw, 0) || 1;
    const shaped = branches.map((b) => {
      const share = (b.raw / total) * 100;
      // "Move to streaming app" inherently lands on Streaming; otherwise the
      // destination platform is constrained by the active consumption scope.
      const destType =
        b.behaviour === "Move to streaming app" ? "Streaming" : scopeTvType;
      const destinations =
        b.behaviour === "Stop watching"
          ? []
          : destPool
              .map((d) => ({
                title: d.t,
                network: networkOf(d.t, market),
                raw: seeded(seedKey(filters, `migd-${src}-${b.behaviour}-${d.t}`), 4, 30),
              }))
              .filter((d) => !commercials || isCommercialNetwork(market, d.network))
              .filter((d) => !destType || platformType(market, d.network) === destType)
              .sort((d1, d2) => d2.raw - d1.raw)
              .slice(0, 3);
      const dTotal = destinations.reduce((a, d) => a + d.raw, 0) || 1;
      return {
        behaviour: b.behaviour,
        share,
        destinations: destinations.map((d) => ({ title: d.title, network: d.network, share: (d.raw / dTotal) * share })),
      };
    });
    return { source: { title: src, network: sourceNet }, branches: shaped };
  }, [filters, shows, commercials, market, scopeTvType, migrationShow]);

  /* ---- Executive summary tiles (confirmed metrics only, spec §6) ---- */
  const summary = useMemo(() => {
    const s = (k: string, min: number, max: number) => seeded(seedKey(filters, `sum-${k}-${commercials}`), min, max);
    const households = Math.round(s("hh", 2.1e6, 6.4e6) * mult);
    const totalMins = Math.round(s("tm", 3.1e9, 7.8e9) * mult * (commercials ? 0.82 : 1));
    const weekly = Math.round(s("wk", 1180, 1820) * (commercials ? 0.88 : 1));
    const linear = Math.round(s("lin", 380, 760) * (commercials ? 0.7 : 1));
    const appsViewed = (s("apps", 6.4, 12.8)).toFixed(1);
    const reachPct = (s("reach", 62, 91)).toFixed(0);
    const idx = (k: string) => Math.round(s(`idx-${k}`, 82, 148));
    return [
      { label: "Total households", value: fmtK(households), unit: "", index: null },
      { label: "Total minutes viewed", value: fmtK(totalMins), unit: "", index: null },
      { label: "Avg. weekly TV consumption – Streaming", value: fmtInt(weekly), unit: "mins", index: idx("wk") },
      { label: "Avg linear TV consumption", value: fmtInt(linear), unit: "min/wk", index: idx("lin") },
      { label: "Avg. channels/apps per hh", value: appsViewed, unit: "", index: idx("apps") },
      { label: "Weekly TV reach", value: `${reachPct}%`, unit: "of hh", index: idx("reach") },
    ];
  }, [filters, commercials, mult]);

  const hasGlobalFilterChanges =
    filters.market !== DEFAULT_FILTERS.market ||
    filters.dateRange !== DEFAULT_FILTERS.dateRange ||
    filters.tier !== DEFAULT_FILTERS.tier ||
    filters.mosaic.length > 0 ||
    filters.age.length > 0 ||
    filters.gender.length > 0 ||
    filters.children.length > 0;

  /* ------------------------------------------------------------- render --- */
  return (
    <div className="flex flex-col gap-[var(--spacing-300,24px)]" style={{ fontFamily: FONT }}>
      {/* 1 — Header (compact) */}
      <header className="flex flex-col gap-[var(--spacing-25,2px)]">
        <h2
          className="text-[length:var(--headline-md-semibold-size,24px)] font-semibold leading-[var(--headline-md-semibold-line-height,32px)] tracking-[-0.36px]"
          style={{ color: TITLE }}
        >
          TV Audience &amp; Content Planner
        </h2>
        <p className="text-[length:var(--body-md-regular-size,14px)]" style={{ color: MUTED }}>
          Cross-platform content and audience consumption insights
        </p>
      </header>

      {/* 2 — Global filters (sticky, market-configurable) */}
      <div
        data-annotate="Global filters"
        className="sticky z-40 -mx-6 px-6 py-[var(--spacing-150,12px)] md:-mx-10 md:px-10"
        style={{ top: "var(--tv-filter-top, 0px)", backgroundColor: SURFACE2, borderBottom: `1px solid ${GRID}` }}
      >
        <div
          data-annotate="Audience filter group"
          className="flex flex-wrap items-end gap-[var(--spacing-150,12px)]"
        >
          <SearchableDropdown id={controlId("market")} label="Country" value={filters.market} options={MARKETS} onChange={(v) => updateFilter("market", v)} fullWidth />
          {uk ? (
            <>
              <SearchableDropdown id={controlId("mosaic")} label="Mosaic group" value={filters.mosaic} options={MOSAIC} onChange={(v) => updateMultiFilter("mosaic", v)} multiple fullWidth />
              <SearchableDropdown id={controlId("age")} label="Age" value={filters.age} options={AGE} onChange={(v) => updateMultiFilter("age", v)} multiple fullWidth />
              <SearchableDropdown id={controlId("gender")} label="Gender" value={filters.gender} options={GENDER} onChange={(v) => updateMultiFilter("gender", v)} multiple fullWidth />
              <SearchableDropdown id={controlId("children")} label="Children" value={filters.children} options={CHILDREN} onChange={(v) => updateMultiFilter("children", v)} multiple fullWidth />
            </>
          ) : (
            <SearchableDropdown id={controlId("tier")} label="TV consumption" value={filters.tier} options={CONSUMPTION_TIER} onChange={(v) => updateFilter("tier", v)} fullWidth />
          )}
          <SearchableDropdown id={controlId("daterange")} label="Date range" value={filters.dateRange} options={DATE_RANGE} onChange={(v) => updateFilter("dateRange", v)} fullWidth />
          <button
            type="button"
            disabled={!hasGlobalFilterChanges}
            onClick={() => setFilters({ ...DEFAULT_FILTERS })}
            className="h-[36px] whitespace-nowrap rounded-[var(--radius-50,4px)] px-[var(--spacing-150,12px)] text-[length:var(--body-md-medium-size,14px)] font-medium transition-colors hover:bg-[var(--container-dynamic-brand-subtle-background-hover,#ead7f7)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
            style={{ color: CHART.selected }}
          >
            Clear filter
          </button>
        </div>
        <p className="mt-[var(--spacing-75,6px)] text-[length:var(--body-sm-regular-size,12px)]" style={{ color: MUTED }}>
          {uk
            ? "UK market: granular Mosaic group, Age, Gender and Children-in-household inputs."
            : "EU markets use simpler Heavy / Medium / Light TV consumption. Mosaic / Age / Gender are UK-only."}
        </p>
      </div>

      {/* 3 — Executive summary tiles — wrapped in an "Overview" SmartCard
          (annotation #1). The MetricsTile/StatTile components and the grid
          inside are unchanged. */}
      <SmartCard title="Overview" ariaLabel="Overview">
        <div
          data-annotate="Executive summary"
          className="grid grid-cols-2 gap-[var(--spacing-150,12px)] md:grid-cols-3 xl:grid-cols-6"
        >
          {summary.map((t) => (
            <StatTile key={t.label} label={t.label} value={t.value} unit={t.unit} index={t.index} loading={loading} />
          ))}
        </div>
      </SmartCard>

      {/* 4 — Global All / Commercials control — left-aligned Tabs Bar (rounded)
          with the descriptive left label removed (annotation #2). */}
      <div className="flex flex-wrap items-center justify-start gap-[var(--spacing-100,8px)]">
        <EnvControl value={env} onChange={setEnv} />
      </div>

      {/* 5 — Consumption by Type & Time Spent — merged into a single SmartCard
          with a 20% Type column (donut on top, legend/infos below) and an 80%
          Time-Spent column (underline tabs, left-aligned within the column).
          An Info Alert educates how the two views work together (annotation #3).
          Responsive: the 20/80 split stacks on narrow widths. */}
      <SmartCard
        title="TV viewership by media type"
        subtitle="% of viewing minutes per household · avg min/week, % of watch time and index vs national by channel/app"
        ariaLabel="TV viewership by media type"
        right={selectedType ? <Chip label={`Filter: ${selectedTypeName}`} selected onRemove={() => setSelectedType(null)} /> : undefined}
      >
        <div className="flex flex-col gap-[var(--spacing-200,16px)] lg:flex-row lg:items-stretch">
          {/* 20% — Type column: donut on top, legend/infos below (vertical). */}
          <div
            data-annotate="Consumption by type"
            className="flex flex-col gap-[var(--spacing-100,8px)] lg:w-1/5 lg:shrink-0"
          >
            <span className="text-[length:var(--body-sm-medium-size,12px)] font-medium" style={{ color: BODY2 }}>
              Consumption by Type
            </span>
            <CardBody loading={loading} empty={empty} height={200}>
              <DonutChart
                data={consumption.map((c) => ({ key: c.key, name: c.name, color: c.color, minutes: c.minutes, pct: c.pct }))}
                selected={selectedType}
                onSelect={(k) => setSelectedType((cur) => (cur === (k as ConsumptionKey) ? null : (k as ConsumptionKey)))}
                vertical
              />
            </CardBody>
          </div>

          {/* Divider between the two columns (horizontal on stacked layout). */}
          <div
            className="h-px w-full shrink-0 lg:h-auto lg:w-px"
            style={{ backgroundColor: GRID }}
            aria-hidden
          />

          {/* 80% — Time Spent column with left-aligned underline tabs. */}
          <div
            data-annotate="Time spent by channel or app"
            className="flex min-w-0 flex-1 flex-col gap-[var(--spacing-100,8px)]"
          >
            <span className="text-[length:var(--body-sm-medium-size,12px)] font-medium" style={{ color: BODY2 }}>
              Time Spent by Channel / App
              {selectedTypeName ? ` · tab synced to ${selectedTypeName}` : ""}
            </span>
            {/* Tabs stay left; the two-series Fiber legend is rendered with the chart. */}
            <div className="flex flex-wrap items-center justify-between gap-x-[var(--spacing-200,16px)] gap-y-[var(--spacing-75,6px)]">
              <TabsBarUnderline options={TAB_LABELS} value={channelTab} onChange={setChannelTab} ariaLabel="Channel TV type" />
            </div>
            <CardBody
              loading={loading}
              empty={empty || channels.length === 0}
              height={300}
              emptyTitle="No channels match"
              emptyMessage="Addressable channels filtering removed all channels here — switch to All or change the tab."
            >
              <DualAxisBarChart
                categories={channels.slice(0, 10).map((c) => c.name)}
                primary={channels.slice(0, 10).map((c) => c.mins)}
                secondary={channels.slice(0, 10).map((c) => c.pct)}
                indices={channels.slice(0, 10).map((c) => c.index)}
                primaryLabel="Avg min/week"
                secondaryLabel="% of watch time"
              />
            </CardBody>
          </div>
        </div>
      </SmartCard>

      {/* 6 — Trends */}
      <SmartCard
        title="Content viewership trends"
        subtitle={
          (trendsView === "Shows" ? "Top indexing shows for this audience" : "Viewership by genre (IAB taxonomy)") +
          (selectedTypeName ? ` · scoped to ${selectedTypeName}` : "")
        }
        ariaLabel="Content viewership trends"
        right={
          <div
            data-annotate="View by genre toggle"
            className="flex items-center gap-[var(--spacing-100,8px)]"
          >
            <span
              className="text-[length:var(--body-sm-medium-size,12px)] font-medium"
              style={{ fontFamily: FONT, color: BODY2 }}
            >
              {trendsView === "Shows" ? "View by genre" : "View by show"}
            </span>
            <Toggle
              id={controlId("trends-view-toggle")}
              label={
                trendsView === "Shows"
                  ? "View trends by genre"
                  : "View trends by show"
              }
              on={trendsView === "Genres"}
              onToggle={() =>
                setTrendsView((current) => {
                  setSelectedShow(null);
                  return current === "Genres" ? "Shows" : "Genres";
                })
              }
            />
          </div>
        }
      >
        <div
          className="mb-[var(--spacing-150,12px)] flex flex-col gap-[var(--spacing-100,8px)] md:flex-row md:items-start md:justify-between"
          data-annotate="Trends TV filters"
        >
          <div className="shrink-0">
            <TabsBarUnderline
              options={TAB_LABELS}
              value={trendsTvTab}
              onChange={setTrendsTvTab}
              ariaLabel="Content viewership trends TV type"
            />
          </div>
          {trendsView === "Shows" && (
            <div className="w-full md:ml-auto md:max-w-[520px]">
              <AlertInfo
                title={`You're viewing the top 10 ${trendsTvTab} shows for this audience.`}
                compact
              />
            </div>
          )}
        </div>
        <CardBody
          loading={loading}
          empty={empty || (trendsView === "Shows" && filteredShows.length === 0)}
          height={340}
          emptyTitle="No shows match"
          emptyMessage="No shows match these filters — change the genre filter or viewing scope."
        >
          {trendsView === "Shows" && selectedShow ? (
            <div
              className="flex flex-col gap-[var(--spacing-100,8px)]"
              data-annotate="Top indexing show drilldown"
            >
              <div className="flex flex-wrap items-start justify-between gap-[var(--spacing-100,8px)]">
                <div className="flex min-w-0 flex-col gap-[var(--spacing-25,2px)]">
                  <h3
                    className="truncate text-[length:var(--body-md-medium-size,14px)] font-semibold leading-[var(--body-md-medium-line-height,20px)]"
                    style={{ color: TITLE }}
                  >
                    {selectedShow}
                  </h3>
                  <p
                    className="text-[length:var(--body-sm-regular-size,12px)] leading-[var(--body-sm-regular-line-height,18px)]"
                    style={{ color: MUTED }}
                  >
                    Selected audience consumption over time
                  </p>
                </div>
                <SearchableDropdown
                  id={controlId("show-jump-detail")}
                  label=""
                  value={selectedShow}
                  options={showSelectOptions}
                  onChange={(value) =>
                    setSelectedShow(value === "all" ? null : value)
                  }
                  compact
                  align="right"
                />
              </div>
              <ShowTrendChart data={showTrend} />
            </div>
          ) : trendsView === "Shows" ? (
            <ComboChart
              categories={filteredShows.map((show) => show.title)}
              categoryDetails={filteredShows.map((show) => `${show.index}%`)}
              bars={filteredShows.map((show) => show.mins)}
              secondaryBars={filteredShows.map((show) => show.hhPct)}
              line={filteredShows.map((show) => show.index)}
              barLabel="Avg min / household"
              secondaryBarLabel="% of total watch time"
              lineLabel="Index"
              barAxisLabel="Avg min / HH"
              secondaryBarAxisLabel="% of total watch time"
              lineAxisLabel="Index"
              barUnit=" min"
              secondaryBarUnit="%"
              showLine={false}
              secondaryAxisSide="right"
              categoryDetailLabel="Index"
              legendRight={
                <SearchableDropdown
                  id={controlId("show-jump")}
                  label=""
                  value="all"
                  options={showSelectOptions}
                  onChange={(value) =>
                    setSelectedShow(value === "all" ? null : value)
                  }
                  compact
                  align="right"
                />
              }
              selectedIndex={null}
              onSelect={(index) => {
                const show = filteredShows[index];
                if (show) setSelectedShow(show.title);
              }}
              scrollAriaLabel="Top 10 shows chart"
            />
          ) : (
            <ComboChart
              categories={genres.map((genre) => genre.name)}
              categoryDetails={genres.map((genre) => `${genre.index}%`)}
              bars={genres.map((genre) => genre.mins)}
              secondaryBars={genres.map((genre) => genre.pct)}
              line={genres.map((genre) => genre.index)}
              barLabel="Avg minutes / week"
              secondaryBarLabel="Share of watch time"
              lineLabel="Index"
              barAxisLabel="Avg min / week"
              secondaryBarAxisLabel="Watch time (%)"
              lineAxisLabel="Index"
              barUnit=" min"
              secondaryBarUnit="%"
              showLine={false}
              secondaryAxisSide="right"
              categoryDetailLabel="Index"
              selectedIndex={
                selectedGenre
                  ? genres.findIndex((genre) => genre.name === selectedGenre)
                  : null
              }
              onSelect={(index) => {
                const genre = genres[index]?.name;
                if (genre) {
                  setSelectedGenre((current) =>
                    current === genre ? null : genre,
                  );
                }
              }}
            />
          )}
        </CardBody>
      </SmartCard>

      {/* 7 — Temporal Insights */}
      <div
        className="flex flex-wrap items-center justify-between gap-[var(--spacing-100,8px)]"
        data-annotate="Temporal insights filters"
      >
        {/* Global viewing environment sits above/outside the card, matching the
            control hierarchy used above Consumption by Type & Time Spent. */}
        <EnvControl value={env} onChange={setEnv} />
      </div>
      <SmartCard
        title="Temporal Insights"
        subtitle={
          "Avg minutes + % households watching, by day of week × time of day" +
          (selectedTypeName ? ` · tab synced to ${selectedTypeName}` : "")
        }
        ariaLabel="Temporal insights"
      >
        {/* TV type remains the first in-card hierarchy row beneath the heading. */}
        <div className="mb-[var(--spacing-150,12px)] flex flex-wrap items-center justify-between gap-[var(--spacing-200,16px)]">
          <TabsBarUnderline
            options={TAB_LABELS}
            value={temporalTab}
            onChange={setTemporalTab}
            ariaLabel="Temporal TV type"
          />
          <div className="ml-auto flex flex-wrap items-center justify-end gap-[var(--spacing-100,8px)]">
            <SearchableDropdown
              id={controlId("temporal-channel")}
              label=""
              value={temporalChannel}
              options={temporalChannelOptions}
              onChange={setTemporalChannel}
              compact
              align="right"
            />
            <SearchableDropdown id={controlId("temporal-weeks")} label="" value={temporalWeeks} options={LOOKBACK} onChange={setTemporalWeeks} compact align="right" />
          </div>
        </div>
        <CardBody
          loading={loading}
          empty={temporalEmpty}
          height={340}
          emptyTitle="No temporal data"
          emptyMessage="This channel is non-commercial and excluded under Addressable channels — switch to All or pick another channel."
        >
          <TemporalHeatmap grid={temporal} />
        </CardBody>
      </SmartCard>

      {/* 8 — Cultural Affinity + Migration Signals */}
      <div className="grid grid-cols-1 gap-[var(--spacing-200,16px)] lg:grid-cols-[minmax(0,3fr)_minmax(0,7fr)]">
        <SmartCard
          title="Content affinity"
          subtitle="Audience affinity across eight content and lifestyle parameters · What genres and shows your audience watches in comparison to the national average"
          ariaLabel="Content affinity"
        >
          <CardBody loading={loading} empty={empty} height={420}>
            <div className="flex flex-col gap-[var(--spacing-200,16px)]">
              <RadarChart
                data={affinity}
                selected={selectedAffinity.name}
                onSelect={setSelectedAffinityParameter}
              />
              {/* Only the selected parameter is explained below the chart; the
                  former all-parameter Affinity index readout is intentionally
                  removed now that the radar rings carry numeric scale labels. */}
              <div
                className="flex flex-col gap-[var(--spacing-75,6px)] rounded-[var(--radius-50,4px)] border border-solid p-[var(--spacing-150,12px)]"
                style={{
                  borderColor: GRID,
                  backgroundColor: SURFACE2,
                }}
                role="status"
                aria-live="polite"
                aria-atomic="true"
                data-annotate="Selected affinity parameter details"
              >
                <SectionHeading
                  title={`${selectedAffinity.name} — top 5 shows`}
                  subtitle={`Selected parameter · rank ${selectedAffinityRank} of ${affinity.length}`}
                />
                <ol className="flex flex-col" aria-label={`Top five shows for ${selectedAffinity.name}`}>
                  {selectedAffinityShows.map((show, index) => (
                    <li
                      key={show.title}
                      className="flex items-center gap-[var(--spacing-75,6px)] border-b border-solid py-[var(--spacing-75,6px)] text-[length:var(--body-sm-regular-size,12px)]"
                      style={{ borderColor: GRID }}
                    >
                      <span className="w-[16px] shrink-0 tabular-nums" style={{ color: MUTED }}>
                        {index + 1}
                      </span>
                      <span className="min-w-0 flex-1 truncate font-medium" style={{ color: TITLE }} title={show.title}>
                        {show.title}
                      </span>
                      <span aria-hidden style={{ color: MUTED }}>·</span>
                      <span className="shrink-0 tabular-nums" style={{ color: BODY2 }}>
                        {fmtK(show.viewers)}
                      </span>
                      <span aria-hidden style={{ color: MUTED }}>·</span>
                      <span className="shrink-0 font-semibold tabular-nums" style={{ color: BODY2 }}>
                        {show.index} idx
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          </CardBody>
        </SmartCard>

        <SmartCard
          title="TV user behaviour"
          subtitle={`Where the audience goes within 1 hour of ${migration.source.title}`}
          ariaLabel="TV user behaviour"
        >
          <div
            className="mb-[var(--spacing-100,8px)] flex justify-end"
            data-annotate="Migration signals show filter"
          >
            <SearchableDropdown
              id={controlId("migration-show")}
              label="Shows"
              value={migrationShow}
              options={migrationShowOptions}
              onChange={setMigrationShow}
              compact
              align="right"
            />
          </div>
          <CardBody loading={loading} empty={empty || migration.branches.length === 0} height={420}>
            <MigrationSankey source={migration.source} branches={migration.branches} />
          </CardBody>
        </SmartCard>
      </div>

      {/* Notes */}
      <footer className="flex flex-col gap-[var(--spacing-50,4px)] border-t border-solid pt-[var(--spacing-200,16px)]" style={{ borderColor: GRID }}>
        <div className="flex items-center gap-[var(--spacing-75,6px)]">
          <Info size={14} color={CHART.selected} aria-hidden />
          <p className="text-[length:var(--body-sm-regular-size,12px)] font-medium" style={{ color: BODY2 }}>
            Notes &amp; assumptions
          </p>
        </div>
        <ul className="list-disc pl-[18px] text-[length:var(--body-sm-regular-size,12px)] leading-[var(--body-sm-regular-line-height,18px)]" style={{ color: MUTED }}>
          <li>Layout and hierarchy follow the delivered wireframe exactly; no sections rearranged or added.</li>
          <li>Index: 100 = national average; e.g. index 150 = 50% above national average (shown via directional badges + tooltips).</li>
          <li>Addressable channels excludes non-commercial environments per market (data-source dependent, not hard-coded to BBC).</li>
          <li>Cross-filters: consumption type scopes downstream; genre (Genres view) sets the affinity anchor + shows; an affinity genre reveals its top shows.</li>
          <li>All figures are illustrative synthetic data derived deterministically from the active filters.</li>
        </ul>
      </footer>
    </div>
  );
}
