/* =========================================================================
 * MiQ TV Audience & Content Planner — V3 (live ideation)
 *
 * A single-page analytical dashboard implementing the "MiQ TV Audience &
 * Content Planner" spec. Structured as the analytical journey
 * UNDERSTAND → DISCOVER with a global filter bar and 8 connected KPI areas:
 *
 *   §1 Consumption by Type          (segmented visual — cross-filters downstream)
 *   §2 Time Spent by Channel/App    (top-10 bar+line combo, index chips)
 *   §3 Temporal Insights            (day × time-of-day heatmap)
 *   §4 Viewership by Genre          (horizontal bars, index — cross-filters §5/§6/§7)
 *   §5 Share of Viewing by Platform (100% stacked bars, highlights selected genre)
 *   §6 Cultural Affinity            (index-vs-average bars — reveals §7)
 *   §7 Top 10 Indexing Shows        (table, lookback, search, expand to top 50)
 *   §8 Migration Signals            (simplified Sankey-style pathway)
 *
 * Market-aware filters: UK uses Mosaic / Age / Gender; EU markets use
 * Heavy/Medium/Light TV consumption. Global viewing-environment toggle
 * (All / Commercial only) excludes non-commercial channels (e.g. BBC).
 *
 * All colours are Fiber tokens via inline style var(--token, #fallback). No
 * chart library — hand-rolled SVG/flex visuals. No nested interactive
 * controls; no JSX generic type args. Deterministic mock data (no fetches).
 * Comparison Mode is P2 — an inert "coming soon" affordance only.
 * ========================================================================= */

import { useEffect, useMemo, useRef, useState } from "react";
import { MagnifyingGlass, GitFork, Info } from "@phosphor-icons/react";
import {
  FONT,
  GRID,
  TITLE,
  MUTED,
  BODY2,
  BRAND,
  CARD_BG,
  SURFACE2,
  CARD_SHADOW,
  SmartCard,
  CardBody,
  Chip,
  Toggle,
  SearchableDropdown,
  SegmentedPills,
  SectionHeading,
  JourneyBand,
  seeded,
} from "./primitives";
import {
  MARKETS,
  MOSAIC,
  AGE,
  GENDER,
  CONSUMPTION_TIER,
  LOOKBACK,
  DEFAULT_FILTERS,
  isUK,
  isEmptyCombo,
  seedKey,
  marketMult,
  CONSUMPTION_TYPES,
  CHANNELS,
  GENRES,
  SHOWS_BY_GENRE,
  SOV_PLATFORMS,
  DAYS,
  DAYPARTS,
  networkOf,
  isCommercialNetwork,
  nonCommercialShare,
} from "./data";
import type { Filters, ConsumptionKey, TvType } from "./data";
import {
  ConsumptionSegments,
  ComboChart,
  HeatMap,
  GenreBars,
  PlatformShareBars,
  AffinityBars,
  ShowsTable,
  MigrationFlow,
} from "./charts";

const TV_TYPE_PILLS = ["All", "Linear", "Streaming", "FAST"];
const SUBTYPE_PILLS = ["Linear", "Streaming", "FAST"];

export default function V3ContentPlanner() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);

  // Global viewing-environment toggle (All vs Commercial only).
  const [commercialOnly, setCommercialOnly] = useState(false);

  // Cross-filter selections. §1 type feeds all downstream; §4 genre feeds
  // §5/§6/§7; §6 affinity genre feeds §7; §7 show feeds §8.
  const [selectedType, setSelectedType] = useState<ConsumptionKey | null>(null);
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);
  const [affinityGenre, setAffinityGenre] = useState<string | null>(null);
  const [selectedShow, setSelectedShow] = useState<string | null>(null);

  // Per-section controls.
  const [temporalType, setTemporalType] = useState("Linear");
  const [temporalChannel, setTemporalChannel] = useState("All");
  const [genreType, setGenreType] = useState("All");
  const [lookback, setLookback] = useState("wow30");
  const [showSearch, setShowSearch] = useState("");
  const [showCount, setShowCount] = useState("10");

  // Simulated cascade loading on any global filter change.
  const [loading, setLoading] = useState(false);
  const firstRender = useRef(true);

  const uk = isUK(filters);
  const empty = isEmptyCombo(filters);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    // Global filter changes reset cross-filter drilldowns (avoids stale state).
    setSelectedType(null);
    setSelectedGenre(null);
    setAffinityGenre(null);
    setSelectedShow(null);
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, commercialOnly]);

  // If the temporal channel sub-filter points at a non-commercial channel and
  // Commercial only is switched on, fall back to "All" so it isn't stale.
  useEffect(() => {
    if (
      commercialOnly &&
      temporalChannel !== "All" &&
      !isCommercialNetwork(temporalChannel)
    ) {
      setTemporalChannel("All");
    }
  }, [commercialOnly, temporalChannel]);

  function updateFilter(key: keyof Filters, value: string) {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "market") {
        if (value !== "UK") {
          next.mosaic = "all";
          next.age = "all";
          next.gender = "all";
        } else {
          next.tier = "all";
        }
      }
      return next;
    });
  }

  const typeTag = selectedType ?? "";
  const selectedTypeName =
    CONSUMPTION_TYPES.find((t) => t.key === selectedType)?.name ?? null;
  const mult = marketMult(filters.market);

  /* ---- §1 Consumption by Type (% of minutes watched per household) ---- */
  const consumption = useMemo(() => {
    const raw = CONSUMPTION_TYPES.map((t, i) => {
      let minutes = Math.round(
        seeded(seedKey(filters, `c-${t.key}`), 0.45, 1) * (300 - i * 45) * mult,
      );
      // Commercial-only removes BBC-type ad-free share, hitting Linear most.
      if (commercialOnly && t.key === "linear")
        minutes = Math.round(minutes * 0.7);
      return { ...t, minutes };
    });
    const total = raw.reduce((a, b) => a + b.minutes, 0) || 1;
    return raw.map((r) => ({ ...r, pct: (r.minutes / total) * 100 }));
  }, [filters, commercialOnly, mult]);
  const consumptionTotal = consumption.reduce((a, b) => a + b.minutes, 0);

  /* ---- §2 Time Spent by Channel/App (top 10, bar+line, index chip) ---- */
  const channels = useMemo(() => {
    const rows = CHANNELS.map((c) => {
      let mins = Math.round(
        seeded(seedKey(filters, `ch-${c.name}-${typeTag}`), 30, 360) * mult,
      );
      // Commercial-only excludes non-commercial channels (e.g. BBC iPlayer).
      if (commercialOnly && !c.commercial) mins = 0;
      // §1 type selection scopes to the matching TV type.
      if (selectedType === "streaming" && c.type !== "Streaming")
        mins = Math.round(mins * 0.3);
      if (selectedType === "linear" && c.type !== "Linear")
        mins = Math.round(mins * 0.3);
      if (selectedType === "fast" && c.type !== "FAST")
        mins = Math.round(mins * 0.3);
      const index = Math.round(
        seeded(seedKey(filters, `chi-${c.name}-${typeTag}`), 68, 168),
      );
      return { name: c.name, mins, index };
    })
      .filter((r) => r.mins > 0)
      .sort((a, b) => b.mins - a.mins)
      .slice(0, 10);
    const total = rows.reduce((a, b) => a + b.mins, 0) || 1;
    return rows.map((r) => ({ ...r, pct: (r.mins / total) * 100 }));
  }, [filters, selectedType, commercialOnly, typeTag, mult]);

  /* ---- §3 Temporal heatmap (avg min/hh, type + channel sub-filter) ---- */
  const temporal = useMemo(() => {
    return DAYS.map((d) =>
      DAYPARTS.map((p) => {
        const base = seeded(
          seedKey(filters, `t-${d}-${p}-${temporalType}-${temporalChannel}`),
          0,
          1,
        );
        // Peak/evenings and weekends skew higher for realism.
        const peakBoost = p === "Peak" ? 0.25 : p === "Late Night" ? 0.1 : 0;
        const weekend = d === "Sat" || d === "Sun" ? 0.12 : 0;
        const v = Math.min(1, base * 0.6 + peakBoost + weekend);
        // Commercial-only removes non-commercial (BBC-type) contribution. When
        // viewing "All channels", strip the public-service share of linear;
        // when a specific non-commercial channel is picked, it drops to zero.
        let scale = 1;
        if (commercialOnly) {
          if (temporalChannel !== "All") {
            scale = isCommercialNetwork(temporalChannel) ? 1 : 0;
          } else if (temporalType === "Linear") {
            scale = 0.82; // strip ~18% BBC-type share from linear timing
          }
        }
        const minutes = Math.round((20 + v * 130) * mult * scale);
        const band =
          scale === 0
            ? "Low"
            : v < 0.34
              ? "Low"
              : v < 0.62
                ? "Medium"
                : "High";
        return {
          day: d,
          part: p,
          minutes,
          band: band as "Low" | "Medium" | "High",
        };
      }),
    );
  }, [filters, temporalType, temporalChannel, commercialOnly, mult]);

  // Channel/app sub-filter options depend on the selected temporal TV type.
  // Commercial-only removes non-commercial channels from the sub-filter.
  const temporalChannelOptions = useMemo(() => {
    const list = CHANNELS.filter(
      (c) =>
        c.type === (temporalType as TvType) &&
        (!commercialOnly || c.commercial),
    ).map((c) => ({ value: c.name, label: c.name }));
    return [{ value: "All", label: "All channels / apps" }, ...list];
  }, [temporalType, commercialOnly]);

  /* ---- §4 Viewership by Genre (mins prominent, %, index) ---- */
  const genres = useMemo(() => {
    const raw = GENRES.map((g) => {
      let mins = Math.round(
        seeded(seedKey(filters, `g-${g}-${genreType}-${typeTag}`), 40, 300) *
          mult,
      );
      let index = Math.round(
        seeded(seedKey(filters, `gi-${g}-${genreType}-${typeTag}`), 62, 158),
      );
      // Commercial-only strips the non-commercial minutes each genre carries,
      // hitting public-service-heavy genres (News/Documentary) hardest and
      // lifting the commercial index of low-lean genres.
      if (commercialOnly) {
        const ncs = nonCommercialShare(g);
        mins = Math.round(mins * (1 - ncs));
        index = Math.round(index * (1 + (0.2 - ncs) * 0.5));
      }
      return { name: g, mins, index };
    }).sort((a, b) => b.mins - a.mins);
    const total = raw.reduce((a, b) => a + b.mins, 0) || 1;
    return raw.map((r) => ({ ...r, pct: (r.mins / total) * 100 }));
  }, [filters, genreType, typeTag, commercialOnly, mult]);

  const anchorGenre = selectedGenre ?? genres[0]?.name ?? "Comedy";

  /* ---- §5 Share of Viewing by Platform (100% stacked per genre) ---- */
  const platformShare = useMemo(() => {
    // Emphasis weights per §1 type shift the Linear/Streaming/FAST mix.
    const weightsByType: Record<ConsumptionKey, number[]> = {
      linear: [2.0, 0.7, 0.5],
      streaming: [0.6, 2.0, 0.6],
      fast: [0.7, 0.7, 2.2],
      home: [1, 1, 1],
    };
    const w = selectedType ? weightsByType[selectedType] : null;
    // Always include the selected genre even if it's outside the top 6, so the
    // §4→§5 highlight never lands on an unrendered row.
    const top = genres.slice(0, 6);
    const rendered =
      selectedGenre && !top.some((g) => g.name === selectedGenre)
        ? [...top, genres.find((g) => g.name === selectedGenre)!]
        : top;
    return rendered.map((g) => {
      const raw = SOV_PLATFORMS.map((p, i) => {
        let base = seeded(
          seedKey(filters, `sov-${g.name}-${p.key}-${typeTag}`),
          8,
          40,
        );
        // Commercial-only removes the non-commercial (BBC) portion of the
        // Linear segment (index 0); Streaming/FAST are commercial here.
        if (commercialOnly && p.key === "Linear")
          base = base * (1 - nonCommercialShare(g.name));
        return w ? base * w[i] : base;
      });
      const sum = raw.reduce((a, b) => a + b, 0) || 1;
      return { genre: g.name, shares: raw.map((r) => (r / sum) * 100) };
    });
  }, [filters, genres, selectedGenre, selectedType, commercialOnly, typeTag]);

  /* ---- §6 Cultural Affinity (index vs avg, anchored on selected genre) ---- */
  const affinity = useMemo(() => {
    return GENRES.filter((g) => g !== anchorGenre)
      .map((g) => {
        let index = Math.round(
          seeded(seedKey(filters, `aff-${anchorGenre}-${g}-${typeTag}`), 78, 205),
        );
        // Commercial-only re-weights affinity toward commercial-leaning genres.
        if (commercialOnly)
          index = Math.round(index * (1 + (0.2 - nonCommercialShare(g)) * 0.6));
        return { name: g, index };
      })
      .sort((a, b) => b.index - a.index)
      .slice(0, 6);
  }, [filters, anchorGenre, commercialOnly, typeTag]);

  /* ---- §7 Top Indexing Shows (genre-filtered, lookback, search, expand) ---- */
  // If an affinity genre is selected in §6 it takes precedence for §7.
  const showsGenre = affinityGenre ?? anchorGenre;
  const shows = useMemo(() => {
    const list = SHOWS_BY_GENRE[showsGenre] ?? SHOWS_BY_GENRE.Comedy;
    // Extend the pool to support a top-50 view without inventing new titles by
    // deterministically suffixing seasons.
    const extended: string[] = [];
    let season = 1;
    while (extended.length < 50) {
      for (const t of list) {
        extended.push(season === 1 ? t : `${t} (S${season})`);
        if (extended.length >= 50) break;
      }
      season++;
    }
    return extended
      .map((title) => ({
        title,
        network: networkOf(title.replace(/ \(S\d+\)$/, "")),
        index: Math.round(
          seeded(seedKey(filters, `sh-${showsGenre}-${title}-${lookback}`), 92, 212),
        ),
        mins: Math.round(
          seeded(seedKey(filters, `shm-${showsGenre}-${title}-${lookback}`), 6, 58) *
            mult,
        ),
        hhPct: seeded(
          seedKey(filters, `shh-${showsGenre}-${title}-${lookback}`),
          2,
          28,
        ),
      }))
      // Commercial-only excludes shows on non-commercial networks (e.g. BBC).
      .filter((s) => !commercialOnly || isCommercialNetwork(s.network))
      .sort((a, b) => b.index - a.index);
  }, [filters, showsGenre, lookback, commercialOnly, mult]);

  const filteredShows = useMemo(() => {
    const q = showSearch.trim().toLowerCase();
    const base = q
      ? shows.filter((s) => s.title.toLowerCase().includes(q))
      : shows;
    return base.slice(0, Number(showCount));
  }, [shows, showSearch, showCount]);

  /* ---- §8 Migration Signals (selected show → 3 next-show branches) ---- */
  const migration = useMemo(() => {
    // Source must respect commercial-only: fall back to the top filtered show
    // (already commercial-filtered in §7) if the selection isn't valid.
    const sourceValid =
      selectedShow != null &&
      (!commercialOnly ||
        isCommercialNetwork(
          networkOf(selectedShow.replace(/ \(S\d+\)$/, "")),
        ));
    const source =
      (sourceValid ? selectedShow : null) ?? shows[0]?.title ?? "The Traitors";
    const sourceNet = networkOf(source.replace(/ \(S\d+\)$/, ""));
    // Draw next-show branches from a mix of genres for a realistic hop.
    const pool = [
      ...(SHOWS_BY_GENRE[showsGenre] ?? []),
      ...(SHOWS_BY_GENRE.Drama ?? []),
      ...(SHOWS_BY_GENRE.Reality ?? []),
    ].filter((t) => t !== source);
    const uniq = Array.from(new Set(pool));
    const branches = uniq
      .map((title) => ({
        title,
        network: networkOf(title),
        share: seeded(seedKey(filters, `mig-${source}-${title}`), 8, 34),
      }))
      // Commercial-only excludes non-commercial branch targets (e.g. BBC).
      .filter((b) => !commercialOnly || isCommercialNetwork(b.network))
      .sort((a, b) => b.share - a.share)
      .slice(0, 3);
    return { source: { title: source, network: sourceNet }, branches };
  }, [filters, selectedShow, shows, showsGenre, commercialOnly]);

  const filterCount = uk
    ? [filters.mosaic, filters.age, filters.gender].filter((v) => v !== "all")
        .length
    : filters.tier !== "all"
      ? 1
      : 0;

  /* --------------------------------------------------------------- render -- */

  return (
    <div
      className="flex flex-col gap-[var(--spacing-300,24px)]"
      style={{ fontFamily: FONT }}
    >
      {/* Intro */}
      <header className="flex flex-col gap-[var(--spacing-75,6px)]">
        <h2
          className="text-[length:var(--headline-md-semibold-size,24px)] font-semibold leading-[var(--headline-md-semibold-line-height,32px)] tracking-[-0.36px]"
          style={{ color: TITLE }}
        >
          MiQ TV Audience &amp; Content Planner
        </h2>
        <p
          className="max-w-[760px] text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)]"
          style={{ color: MUTED }}
        >
          Define an audience, then follow a connected analytical journey — from
          understanding <em>what</em> and <em>when</em> they watch, to discovering
          the genres, shows and platforms that over-index and where to reach them
          commercially. Every insight cross-filters the rest.
        </p>
      </header>

      {/* ---------------------------------- Global filter bar (sticky) ------- */}
      <div
        className="sticky z-40 -mx-6 px-6 py-[var(--spacing-200,16px)] md:-mx-10 md:px-10"
        style={{
          top: "var(--tv-filter-top, 0px)",
          backgroundColor: SURFACE2,
          borderBottom: `1px solid ${GRID}`,
        }}
      >
        <div className="flex flex-col gap-[var(--spacing-100,8px)]">
          <div className="flex items-center justify-between gap-[var(--spacing-100,8px)]">
            <span
              className="text-[length:var(--body-sm-medium-size,12px)] font-medium uppercase tracking-wide"
              style={{ color: MUTED }}
            >
              Global filters
            </span>
            <div className="flex items-center gap-[var(--spacing-150,12px)]">
              {filterCount > 0 && (
                <button
                  type="button"
                  onClick={() => setFilters(DEFAULT_FILTERS)}
                  className="text-[length:var(--body-sm-medium-size,12px)] font-medium"
                  style={{ color: BRAND }}
                >
                  Reset filters
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-end gap-[var(--spacing-150,12px)]">
            <SearchableDropdown
              id="v3-market"
              label="Market"
              value={filters.market}
              options={MARKETS}
              onChange={(v) => updateFilter("market", v)}
            />
            {/* Market-specific demographic inputs. UK = Mosaic/Age/Gender;
                EU markets = Heavy/Medium/Light TV consumption. */}
            {uk ? (
              <>
                <SearchableDropdown
                  id="v3-mosaic"
                  label="Mosaic group"
                  value={filters.mosaic}
                  options={MOSAIC}
                  onChange={(v) => updateFilter("mosaic", v)}
                />
                <SearchableDropdown
                  id="v3-age"
                  label="Age"
                  value={filters.age}
                  options={AGE}
                  onChange={(v) => updateFilter("age", v)}
                />
                <SearchableDropdown
                  id="v3-gender"
                  label="Gender"
                  value={filters.gender}
                  options={GENDER}
                  onChange={(v) => updateFilter("gender", v)}
                />
              </>
            ) : (
              <SearchableDropdown
                id="v3-tier"
                label="TV consumption"
                value={filters.tier}
                options={CONSUMPTION_TIER}
                onChange={(v) => updateFilter("tier", v)}
              />
            )}

            {/* Viewing environment: All / Commercial only */}
            <div className="flex flex-col gap-[var(--spacing-50,4px)]">
              <span
                className="text-[length:var(--body-sm-regular-size,12px)]"
                style={{ color: MUTED }}
              >
                Viewing environment
              </span>
              <div
                className="flex h-[36px] items-center gap-[var(--spacing-100,8px)] rounded-[var(--radius-50,4px)] px-[var(--spacing-100,8px)]"
                style={{ backgroundColor: CARD_BG, border: `1px solid ${GRID}` }}
              >
                <span
                  className="text-[length:var(--body-sm-regular-size,12px)]"
                  style={{ color: commercialOnly ? MUTED : TITLE }}
                >
                  All
                </span>
                <Toggle
                  id="v3-commercial"
                  label="Toggle viewing environment: All or Commercial only"
                  on={commercialOnly}
                  onToggle={() => setCommercialOnly((v) => !v)}
                />
                <span
                  className="text-[length:var(--body-sm-regular-size,12px)]"
                  style={{ color: commercialOnly ? TITLE : MUTED }}
                >
                  Commercial only
                </span>
              </div>
            </div>

            {/* Comparison Mode — P2, inert coming-soon affordance. */}
            <div className="flex flex-col gap-[var(--spacing-50,4px)]">
              <span
                className="text-[length:var(--body-sm-regular-size,12px)]"
                style={{ color: MUTED }}
              >
                Comparison
              </span>
              <button
                type="button"
                disabled
                aria-disabled="true"
                title="Comparison Mode is a planned (P2) capability — coming soon."
                className="flex h-[36px] cursor-not-allowed items-center gap-[var(--spacing-75,6px)] rounded-[var(--radius-50,4px)] px-[var(--spacing-100,8px)] opacity-60"
                style={{ backgroundColor: CARD_BG, border: `1px solid ${GRID}` }}
              >
                <GitFork size={16} color={MUTED} aria-hidden />
                <span
                  className="text-[length:var(--body-sm-medium-size,12px)] font-medium"
                  style={{ color: BODY2 }}
                >
                  Compare audiences
                </span>
                <span
                  className="rounded-[var(--spacing-mega,40px)] px-[var(--spacing-75,6px)] py-[1px] text-[10px] font-semibold uppercase"
                  style={{
                    backgroundColor:
                      "var(--container-static-brand-subtle-background, #f6ebff)",
                    color:
                      "var(--container-static-brand-subtle-foreground-variation, #662994)",
                  }}
                >
                  Soon
                </span>
              </button>
            </div>
          </div>

          <p
            className="text-[length:var(--body-sm-regular-size,12px)]"
            style={{ color: MUTED }}
          >
            {uk
              ? "UK market: granular Mosaic group, Age and Gender inputs."
              : "EU markets use simpler Heavy / Medium / Light TV consumption inputs. Mosaic, Age and Gender are UK-only."}
            {commercialOnly &&
              " · Commercial only excludes non-commercial environments (e.g. BBC)."}
          </p>
        </div>
      </div>

      {/* ============================================ UNDERSTAND journey ==== */}
      <JourneyBand
        step="Understand"
        title="What & when does my audience watch?"
        description="Start by sizing how your audience splits their viewing across TV types, which channels and apps command their time, and when they are most reachable."
      />

      {/* §1 — Consumption by Type */}
      <SectionHeading
        eyebrow="01 · Consumption"
        title="Consumption by Type"
        subtitle="% of minutes watched per household — click a segment to cross-filter every section below"
      />
      <SmartCard
        title="Viewing minutes by TV type"
        subtitle="Linear · Streaming · FAST · Homescreen"
        ariaLabel="Consumption by type"
        right={
          selectedType && (
            <Chip
              label={`Filter: ${selectedTypeName}`}
              selected
              onRemove={() => setSelectedType(null)}
            />
          )
        }
      >
        <CardBody loading={loading} empty={empty} height={160}>
          <ConsumptionSegments
            data={consumption}
            total={consumptionTotal}
            selected={selectedType}
            onSelect={(k) => setSelectedType((cur) => (cur === k ? null : k))}
          />
        </CardBody>
      </SmartCard>

      {/* §2 — Time Spent by Channel/App */}
      <SectionHeading
        eyebrow="02 · Channels & apps"
        title="Time Spent by Channel / App"
        subtitle="Top 10 by audience time — bars are avg min/week, line is % of total watch time, index vs national average shown per bar"
      />
      <SmartCard
        title="Time spent by channel / app"
        subtitle="Bars = avg min/week (left) · line = % of total watch time (right) · index chip under each bar"
        ariaLabel="Time spent by channel or app"
        right={
          selectedTypeName ? (
            <Chip as="span" label={`TV type: ${selectedTypeName}`} selected />
          ) : undefined
        }
      >
        <CardBody
          loading={loading}
          empty={empty || channels.length === 0}
          height={300}
          emptyTitle="No channels match"
          emptyMessage={
            commercialOnly
              ? "Commercial-only filtering removed all channels for this selection. Switch to All or change filters."
              : "No channel data for this audience selection — adjust filters."
          }
        >
          <ComboChart
            categories={channels.map((c) => c.name)}
            bars={channels.map((c) => c.mins)}
            line={channels.map((c) => c.pct)}
            indices={channels.map((c) => c.index)}
            barLabel="Avg min/week"
            lineLabel="% of total watch time"
            barUnit=" min"
            lineUnit="%"
            rotateLabels
          />
        </CardBody>
      </SmartCard>

      {/* §3 — Temporal Insights */}
      <SectionHeading
        eyebrow="03 · Timing"
        title="Temporal Insights"
        subtitle="Avg minutes per household across day of week × time of day"
      >
        <div className="flex flex-wrap items-center gap-[var(--spacing-100,8px)]">
          <SegmentedPills
            options={SUBTYPE_PILLS}
            value={temporalType}
            onChange={(v) => {
              setTemporalType(v);
              setTemporalChannel("All");
            }}
            ariaLabel="Temporal TV type"
          />
          <SearchableDropdown
            id="v3-temporal-channel"
            label=""
            value={temporalChannel}
            options={temporalChannelOptions}
            onChange={setTemporalChannel}
          />
        </div>
      </SectionHeading>
      <SmartCard
        title="Consumption heat map"
        subtitle={`${temporalType}${temporalChannel !== "All" ? ` · ${temporalChannel}` : ""} — Low / Medium / High bands`}
        ariaLabel="Temporal insights heat map"
      >
        <CardBody loading={loading} empty={empty} height={280}>
          <HeatMap grid={temporal} />
        </CardBody>
      </SmartCard>

      {/* ============================================== DISCOVER journey ==== */}
      <JourneyBand
        step="Discover"
        title="What content is relevant, and where can I reach them?"
        description="Drill into the genres that over-index, the platforms carrying them, the audience's wider cultural affinities, the individual shows that punch above the national average, and where viewers go next."
      />

      {/* §4 — Viewership by Genre */}
      <SectionHeading
        eyebrow="04 · Genres"
        title="Viewership by Genre"
        subtitle="Top IAB genres — click a genre to cross-filter platform share, cultural affinity and top shows"
      >
        <div className="flex flex-wrap items-center gap-[var(--spacing-100,8px)]">
          {selectedTypeName && (
            <Chip as="span" label={`TV type: ${selectedTypeName}`} selected />
          )}
          <SegmentedPills
            options={TV_TYPE_PILLS}
            value={genreType}
            onChange={setGenreType}
            ariaLabel="Genre TV type"
          />
        </div>
      </SectionHeading>
      <SmartCard
        title="Viewership by genre"
        subtitle="Avg min/week (prominent) · % of watch time · directional index vs national average"
        ariaLabel="Viewership by genre"
      >
        <CardBody loading={loading} empty={empty} height={360}>
          <GenreBars
            data={genres}
            selected={selectedGenre}
            onSelect={(g) => {
              setSelectedGenre((cur) => (cur === g ? null : g));
              setAffinityGenre(null);
              setSelectedShow(null);
            }}
          />
        </CardBody>
      </SmartCard>

      {/* §5 — Share of Viewing by Platform */}
      <SectionHeading
        eyebrow="05 · Platform mix"
        title="Share of Viewing by Platform"
        subtitle="For each genre, the Linear / Streaming / FAST split (sums to 100%). The selected genre is highlighted."
      />
      <SmartCard
        title="Platform share by genre"
        subtitle={
          selectedGenre
            ? `Highlighting ${selectedGenre}`
            : "Top genres — select a genre above to highlight"
        }
        ariaLabel="Share of viewing by platform"
        right={
          selectedTypeName ? (
            <Chip as="span" label={`TV type: ${selectedTypeName}`} selected />
          ) : undefined
        }
      >
        <CardBody loading={loading} empty={empty} height={280}>
          <PlatformShareBars
            data={platformShare}
            segments={SOV_PLATFORMS}
            highlight={selectedGenre}
          />
        </CardBody>
      </SmartCard>

      {/* §6 — Cultural Affinity */}
      <SectionHeading
        eyebrow="06 · Affinity"
        title="Cultural Affinity"
        subtitle={`Other genres this audience over-indexes on vs national average, anchored to ${anchorGenre}`}
      />
      <SmartCard
        title="Genre affinity index"
        subtitle="Diverging from 100 (national average) — click an over-indexing genre to reveal its top shows"
        ariaLabel="Cultural affinity"
        right={
          affinityGenre ? (
            <Chip
              label={`Shows: ${affinityGenre}`}
              selected
              onRemove={() => {
                setAffinityGenre(null);
                setSelectedShow(null);
              }}
            />
          ) : undefined
        }
      >
        <CardBody loading={loading} empty={empty} height={260}>
          <AffinityBars
            anchor={anchorGenre}
            data={affinity}
            selected={affinityGenre}
            onSelect={(g) => {
              setAffinityGenre((cur) => (cur === g ? null : g));
              setSelectedShow(null);
            }}
          />
        </CardBody>
      </SmartCard>

      {/* §7 — Top Indexing Shows */}
      <SectionHeading
        eyebrow="07 · Shows"
        title="Top Indexing Shows"
        subtitle={`Shows over-indexing for this audience within ${showsGenre}`}
      >
        <div className="flex flex-wrap items-center gap-[var(--spacing-100,8px)]">
          <SearchableDropdown
            id="v3-lookback"
            label=""
            value={lookback}
            options={LOOKBACK}
            onChange={setLookback}
          />
          <SearchableDropdown
            id="v3-showcount"
            label=""
            value={showCount}
            options={[
              { value: "10", label: "Top 10" },
              { value: "25", label: "Top 25" },
              { value: "50", label: "Top 50" },
            ]}
            onChange={setShowCount}
          />
        </div>
      </SectionHeading>
      <SmartCard
        title={`Top indexing shows — ${showsGenre}`}
        subtitle="Avg min/household · % households · index vs national average"
        ariaLabel="Top indexing shows"
        right={
          <div
            className="flex h-[36px] items-center gap-[var(--spacing-75,6px)] rounded-[var(--radius-50,4px)] px-[var(--spacing-100,8px)]"
            style={{ backgroundColor: CARD_BG, border: `1px solid ${GRID}` }}
          >
            <MagnifyingGlass size={16} color={MUTED} aria-hidden />
            <input
              type="text"
              value={showSearch}
              onChange={(e) => setShowSearch(e.target.value)}
              placeholder="Search shows…"
              aria-label="Search top indexing shows"
              className="w-[160px] bg-transparent text-[length:var(--body-md-regular-size,14px)] outline-none"
              style={{ fontFamily: FONT, color: TITLE }}
            />
          </div>
        }
      >
        <CardBody
          loading={loading}
          empty={empty || filteredShows.length === 0}
          height={320}
          emptyTitle="No shows match"
          emptyMessage="No shows match your search within this genre — clear the search or pick another genre."
        >
          <ShowsTable rows={filteredShows} />
        </CardBody>
      </SmartCard>

      {/* Show picker for §8 migration (rows are read-only in the table, so a
          compact chip row lets users choose the source show). */}
      {!empty && filteredShows.length > 0 && (
        <div
          className="flex flex-col gap-[var(--spacing-75,6px)] rounded-[var(--radius-50,4px)] p-[var(--spacing-150,12px)]"
          style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW }}
        >
          <span
            className="text-[length:var(--body-sm-regular-size,12px)]"
            style={{ color: MUTED }}
          >
            Select a source show for migration signals:
          </span>
          <div className="flex flex-wrap gap-[var(--spacing-75,6px)]">
            {filteredShows.slice(0, 6).map((s) => (
              <Chip
                key={s.title}
                label={s.title}
                selected={migration.source.title === s.title}
                onClick={() => setSelectedShow(s.title)}
              />
            ))}
          </div>
        </div>
      )}

      {/* §8 — Migration Signals */}
      <SectionHeading
        eyebrow="08 · Migration"
        title="Migration Signals"
        subtitle="Where the audience goes in the hour after a show — top 3 next-show pathways with network / platform"
      />
      <SmartCard
        title="Next-show pathways"
        subtitle={`After ${migration.source.title} · top 3 branches`}
        ariaLabel="Migration signals"
      >
        <CardBody
          loading={loading}
          empty={empty || migration.branches.length === 0}
          height={200}
        >
          <MigrationFlow source={migration.source} branches={migration.branches} />
        </CardBody>
      </SmartCard>

      {/* Notes / assumptions */}
      <footer
        className="flex flex-col gap-[var(--spacing-50,4px)] border-t border-solid pt-[var(--spacing-200,16px)]"
        style={{ borderColor: GRID }}
      >
        <div className="flex items-center gap-[var(--spacing-75,6px)]">
          <Info size={14} color={BRAND} aria-hidden />
          <p
            className="text-[length:var(--body-sm-regular-size,12px)] font-medium"
            style={{ color: BODY2 }}
          >
            Notes &amp; assumptions
          </p>
        </div>
        <ul
          className="list-disc pl-[18px] text-[length:var(--body-sm-regular-size,12px)] leading-[var(--body-sm-regular-line-height,18px)]"
          style={{ color: MUTED }}
        >
          <li>
            Analytical journey: Understand (Consumption → Channels → Timing) then
            Discover (Genre → Platform → Affinity → Shows → Migration).
          </li>
          <li>
            Cross-filters: §1 type scopes all sections; §4 genre drives §5/§6/§7;
            §6 affinity genre overrides the §7 genre; §7 show drives §8.
          </li>
          <li>
            Global filter changes reset cross-filter selections to avoid stale
            drilldowns.
          </li>
          <li>
            Market rules: UK uses Mosaic / Age / Gender; EU markets use Heavy /
            Medium / Light TV consumption.
          </li>
          <li>
            Commercial only excludes non-commercial environments (e.g. BBC) across
            every chart.
          </li>
          <li>
            Comparison Mode is a planned P2 capability — the affordance is inert.
          </li>
          <li>
            All figures are illustrative mock data derived deterministically from
            the active filter combination.
          </li>
        </ul>
      </footer>
    </div>
  );
}
