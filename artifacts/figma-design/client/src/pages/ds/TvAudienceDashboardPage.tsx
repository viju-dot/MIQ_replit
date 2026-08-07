/* =========================================================================
 * TV Audience Intelligence Dashboard
 *
 * Enterprise analytics dashboard implementing the Functional Product Document
 * (FPD) "TV Audience Intelligence Dashboard". Built entirely from Fiber design
 * tokens (var(--token, #fallback)) so it flips correctly under
 * [data-theme="dark"] via the global layout theme switch.
 *
 * Feature map (FPD §9):
 *   F1 Global Filter Bar ............ P0  (sticky, searchable dropdowns, market rules)
 *   F2 Exec KPI tiles ............... P0  (Minutes/Reach toggle + index badges)
 *   F3 Consumption by Type .......... P0  (stacked bar, cross-filter, non-commercial toggle)
 *   F4 Time Spent by Channel/App .... P0  (combo bar+line, dual axis)
 *   F5 Viewership by Genre .......... P1  (bar + directional index, cross-filter -> F6)
 *   F6 Top 10 Indexing Shows ........ P1  (combo bar+line, filtered by F5 genre)
 *   F7 Temporal Insights ............ P1  (day x time heat map, Low/Med/High bands)
 *   F8 Genre-Level Platform Comp .... P1  (100% stacked bars per genre)
 *   F9 Comparison Mode .............. P2  (future-ready placeholder / empty-state card)
 *
 * FPD open-question defaults chosen (FPD §31) — annotated in the UI footnote
 * and in code comments:
 *   - Default filter state on load: Market=UK, Lookback=30 days, metric=Minutes.
 *   - F3 selection persistence: RESETS on any global filter change (simpler,
 *     avoids stale cross-filters). Annotated in footnote.
 *   - Genre chart (F5) primary metric: Minutes/week, with the index shown as a
 *     directional indicator at the end of each bar (satisfies both requests).
 *   - Temporal viz (F7): heat map (day x time) with Low/Medium/High bands.
 *   - Missing national average -> index hidden (value only). Not reachable in
 *     mock data but handled.
 * ========================================================================= */

import { useMemo, useState, useEffect, useRef } from "react";
import {
  CaretDown,
  MagnifyingGlass,
  Check,
  ArrowUp,
  ArrowDown,
  Minus,
  X,
  UsersThree,
  Clock,
  MonitorPlay,
  Television,
  SquaresFour,
  Info,
} from "@phosphor-icons/react";

/* ---------------------------------------------------------------- tokens --- */

const FONT = '"DM Sans", Helvetica';

/* Fiber data-vis qualitative palette (token-backed; auto-flips in dark). */
const DATAVIS = [
  "var(--datavis-qualitative-4, #7c33b5)",
  "var(--datavis-qualitative-3, #a857e5)",
  "var(--datavis-qualitative-1, #fbbb3b)",
  "var(--datavis-qualitative-2, #ef8736)",
  "var(--datavis-qualitative-5, #ee4980)",
  "var(--datavis-qualitative-6, #d32f61)",
  "var(--datavis-qualitative-7, #e1e1e8)",
];

const GRID = "var(--border-static-subtle-neutral, #e1e1e8)";
const AXIS_LABEL = "var(--surface-foreground-dynamic-neutral-default-regular, #4b4b59)";
const TITLE = "var(--surface-foreground-static-neutral-lvl1, #13131a)";
const MUTED = "var(--surface-foreground-static-neutral-lvl3, #717180)";
const BODY2 = "var(--surface-foreground-static-neutral-lvl2, #282833)";
const BRAND = "var(--surface-foreground-dynamic-brand-default, #7c33b5)";
const CARD_BG = "var(--surface-background-lvl1, #ffffff)";
const SUCCESS_FG = "var(--container-static-success-subtle-foreground-variation, #115639)";
const SUCCESS_BG = "var(--container-static-success-subtle-background, #e7faef)";
const ERROR_FG = "var(--surface-foreground-static-error, #da294b)";

const CARD_SHADOW =
  "0px 1px 4px 0px var(--shadow-lvl8, rgba(113,113,128,0.08)), 0px 8px 16px 0px var(--shadow-lvl4, rgba(113,113,128,0.04))";

/* ---------------------------------------------------------------- utils ---- */

const nf = new Intl.NumberFormat("en-GB");
const fmtInt = (n: number) => nf.format(Math.round(n));
const fmtK = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(Math.round(n));
};

/* Deterministic pseudo-random so mock data changes stably per filter combo. */
function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}
function seeded(seed: string, min: number, max: number): number {
  return min + hashString(seed) * (max - min);
}

/* ------------------------------------------------------------ primitives --- */

function SmartCard({
  title,
  subtitle,
  right,
  children,
  ariaLabel,
}: {
  title: string;
  subtitle?: string;
  right?: React.ReactNode;
  children: React.ReactNode;
  ariaLabel?: string;
}) {
  return (
    <section
      aria-label={ariaLabel ?? title}
      className="flex w-full flex-col overflow-hidden rounded-[var(--radius-50,4px)]"
      style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW }}
    >
      <div className="flex flex-wrap items-start justify-between gap-[var(--spacing-100,8px)] p-[var(--spacing-200,16px)]">
        <div className="flex min-w-0 flex-col gap-[var(--spacing-25,2px)]">
          <p
            className="text-[length:var(--headline-xs-medium-size,16px)] font-medium leading-[var(--headline-xs-medium-line-height,24px)] tracking-[-0.08px]"
            style={{ fontFamily: FONT, color: TITLE }}
          >
            {title}
          </p>
          {subtitle && (
            <p
              className="text-[length:var(--body-sm-regular-size,12px)] leading-[var(--body-sm-regular-line-height,18px)]"
              style={{ fontFamily: FONT, color: MUTED }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {right && <div className="flex shrink-0 items-center gap-[var(--spacing-100,8px)]">{right}</div>}
      </div>
      <div className="h-0 w-full border-t border-solid" style={{ borderColor: GRID }} />
      <div className="p-[var(--spacing-200,16px)]">{children}</div>
    </section>
  );
}

/* Directional index indicator — text + arrow (never colour alone). FPD §27. */
function IndexBadge({ index, ariaPrefix = "Index" }: { index: number | null; ariaPrefix?: string }) {
  if (index == null) {
    // Missing national average -> value only, no index badge (FPD §16/§49).
    return null;
  }
  const up = index > 100;
  const flat = index === 100;
  const fg = flat ? MUTED : up ? SUCCESS_FG : ERROR_FG;
  const bg = flat
    ? "var(--surface-background-lvl3, #ebebf0)"
    : up
      ? SUCCESS_BG
      : "var(--container-dynamic-error-subtle-background-selected, #ffedef)";
  const Arrow = flat ? Minus : up ? ArrowUp : ArrowDown;
  return (
    <span
      className="inline-flex items-center gap-[3px] rounded-[var(--radiuses-small,2px)] px-[var(--spacing-75,6px)] py-[1px]"
      style={{ backgroundColor: bg }}
      aria-label={`${ariaPrefix} ${index}, ${flat ? "at" : up ? "above" : "below"} national average`}
    >
      <Arrow size={12} weight="bold" color={fg} aria-hidden />
      <span
        className="text-[length:var(--body-sm-medium-size,12px)] font-medium leading-[var(--body-sm-medium-line-height,18px)]"
        style={{ fontFamily: FONT, color: fg }}
      >
        {`Index ${index}`}
      </span>
    </span>
  );
}

/* Skeleton loader block (per-chart loading state, FPD §20). */
function Skeleton({ height = 240 }: { height?: number }) {
  return (
    <div className="flex w-full flex-col gap-[var(--spacing-150,12px)]" aria-busy="true" aria-label="Loading data">
      <div className="flex gap-[var(--spacing-150,12px)]">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="h-[14px] w-[72px] animate-pulse rounded-[var(--radius-25,2px)]"
            style={{ backgroundColor: "var(--surface-background-lvl3, #ebebf0)" }}
          />
        ))}
      </div>
      <div
        className="w-full animate-pulse rounded-[var(--radius-50,4px)]"
        style={{ height, backgroundColor: "var(--surface-background-lvl3, #ebebf0)" }}
      />
    </div>
  );
}

/* Empty state (FPD §18) — uses the DS empty-state illustration asset. */
function EmptyState({ height = 240 }: { height?: number }) {
  return (
    <div
      className="flex w-full flex-col items-center justify-center gap-[var(--spacing-150,12px)] text-center"
      style={{ minHeight: height }}
      role="status"
    >
      <img
        src="/figmaAssets/empty-state/illustration-woman-magnifying-glass.svg"
        alt=""
        className="h-[120px] w-[120px] object-contain"
      />
      <div className="flex flex-col gap-[var(--spacing-75,6px)]">
        <p
          className="text-[length:var(--headline-xs-medium-size,16px)] font-medium leading-[var(--headline-xs-medium-line-height,24px)]"
          style={{ fontFamily: FONT, color: TITLE }}
        >
          No data available
        </p>
        <p
          className="max-w-[320px] text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)]"
          style={{ fontFamily: FONT, color: MUTED }}
        >
          No data available for this audience selection — adjust filters.
        </p>
      </div>
    </div>
  );
}

/* Error state (FPD §17) — per-chart failure message with a Retry button. */
function ErrorState({ height = 240, onRetry }: { height?: number; onRetry: () => void }) {
  return (
    <div
      className="flex w-full flex-col items-center justify-center gap-[var(--spacing-150,12px)] text-center"
      style={{ minHeight: height }}
      role="alert"
    >
      <img
        src="/figmaAssets/empty-state/illustration-warning.svg"
        alt=""
        className="h-[120px] w-[120px] object-contain"
      />
      <div className="flex flex-col gap-[var(--spacing-75,6px)]">
        <p
          className="text-[length:var(--headline-xs-medium-size,16px)] font-medium leading-[var(--headline-xs-medium-line-height,24px)]"
          style={{ fontFamily: FONT, color: TITLE }}
        >
          Data failed to load
        </p>
        <p
          className="max-w-[320px] text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)]"
          style={{ fontFamily: FONT, color: MUTED }}
        >
          We couldn't load this chart. The rest of the dashboard is unaffected — please retry.
        </p>
      </div>
      <button
        type="button"
        onClick={onRetry}
        className="inline-flex h-[var(--spacing-400,32px)] items-center gap-[var(--spacing-75,6px)] rounded-[var(--radius-50,4px)] px-[var(--spacing-200,16px)] text-[length:var(--body-md-medium-size,14px)] font-medium focus:outline-none focus-visible:ring-2"
        style={{
          fontFamily: FONT,
          backgroundColor: "var(--container-dynamic-brand-bold-background-default, #7c33b5)",
          color: "var(--container-static-brand-bold-foreground, #ffffff)",
        }}
      >
        Retry
      </button>
    </div>
  );
}

/* Card body switch: error > skeleton > empty > chart. */
function CardBody({
  loading,
  empty,
  error = false,
  onRetry,
  height = 240,
  children,
}: {
  loading: boolean;
  empty: boolean;
  error?: boolean;
  onRetry?: () => void;
  height?: number;
  children: React.ReactNode;
}) {
  if (loading) return <Skeleton height={height} />;
  if (error && onRetry) return <ErrorState height={height} onRetry={onRetry} />;
  if (empty) return <EmptyState height={height} />;
  return <>{children}</>;
}

/* --------------------------------------------------------- Fiber Toggle ---- */

function Toggle({
  on,
  onToggle,
  label,
  id,
}: {
  on: boolean;
  onToggle: () => void;
  label: string;
  id: string;
}) {
  return (
    <div className="flex items-center gap-[var(--spacing-100,8px)]">
      <label
        htmlFor={id}
        className="text-[length:var(--body-sm-regular-size,12px)] leading-[var(--body-sm-regular-line-height,18px)]"
        style={{ fontFamily: FONT, color: BODY2 }}
      >
        {label}
      </label>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={on}
        aria-label={label}
        onClick={onToggle}
        className={`relative flex h-[24px] w-[46px] items-center rounded-[20px] p-[2px] transition-colors ${on ? "justify-end" : "justify-start"}`}
        style={{
          backgroundColor: on
            ? "var(--controls-background-active, #7c33b5)"
            : "var(--controls-background-inactive, #ebebf0)",
        }}
      >
        <span
          className="block h-[20px] w-[20px] rounded-full"
          style={{ backgroundColor: "var(--surface-background-lvl1, #ffffff)", boxShadow: "0 1px 2px rgba(0,0,0,0.2)" }}
        />
      </button>
    </div>
  );
}

/* -------------------------------------------------------------- Chip ------- */

function Chip({
  label,
  selected = false,
  onClick,
  onRemove,
  as = "button",
}: {
  label: string;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  as?: "button" | "span";
}) {
  const style: React.CSSProperties = selected
    ? {
        backgroundColor: "var(--container-dynamic-brand-subtle-background-selected, #f6ebff)",
        border: "1px solid var(--border-dynamic-brand-selected, #7c33b5)",
        color: BRAND,
      }
    : {
        backgroundColor: "var(--container-dynamic-neutral-subtle-background-default-regular, #ffffff)",
        border: "1px solid var(--border-dynamic-neutral-subtle-default, #c6c6cc)",
        color: BODY2,
      };

  const labelNode = (
    <span
      className="whitespace-nowrap text-[length:var(--body-sm-medium-size,12px)] font-medium leading-[var(--body-sm-medium-line-height,18px)]"
      style={{ fontFamily: FONT }}
    >
      {label}
    </span>
  );

  const containerClass =
    "inline-flex h-[var(--spacing-300,24px)] items-center gap-[var(--spacing-50,4px)] rounded-[var(--spacing-mega,40px)] px-[var(--spacing-100,8px)]";

  // With a remove affordance the container must NOT be a button (avoids nested
  // buttons / invalid HTML). It becomes a span holding the label (optionally a
  // button when onClick exists) plus a single remove <button>.
  if (onRemove) {
    return (
      <span className={containerClass} style={style}>
        {onClick ? (
          <button
            type="button"
            onClick={onClick}
            aria-pressed={selected}
            className="flex items-center bg-transparent transition-colors focus:outline-none focus-visible:ring-2"
            style={{ color: "inherit", fontFamily: FONT }}
          >
            {labelNode}
          </button>
        ) : (
          labelNode
        )}
        <button
          type="button"
          aria-label={`Remove ${label}`}
          onClick={onRemove}
          className="ml-[var(--spacing-25,2px)] flex items-center focus:outline-none focus-visible:ring-2"
          style={{ color: "inherit" }}
        >
          <X size={14} weight="bold" aria-hidden />
        </button>
      </span>
    );
  }

  if (as === "span" || !onClick) {
    return (
      <span className={containerClass} style={style}>
        {labelNode}
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`${containerClass} transition-colors focus:outline-none focus-visible:ring-2`}
      style={style}
    >
      {labelNode}
    </button>
  );
}

/* ------------------------------------------------ Searchable Dropdown (F1) - */

type Option = { value: string; label: string };

function SearchableDropdown({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  options: Option[];
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const filtered = options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()));

  return (
    <div ref={ref} className="relative flex min-w-[160px] flex-col gap-[var(--spacing-50,4px)]">
      <label
        htmlFor={id}
        className="text-[length:var(--body-sm-regular-size,12px)] leading-[var(--body-sm-regular-line-height,18px)]"
        style={{ fontFamily: FONT, color: MUTED }}
      >
        {label}
      </label>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => {
          setOpen((o) => !o);
          setQuery("");
        }}
        className="flex h-[36px] items-center justify-between gap-[var(--spacing-100,8px)] rounded-[var(--radius-50,4px)] px-[var(--spacing-100,8px)]"
        style={{
          backgroundColor: "var(--container-dynamic-neutral-subtle-background-default-regular, #ffffff)",
          border: "1px solid var(--border-dynamic-neutral-subtle-default, #c6c6cc)",
        }}
      >
        <span
          className="truncate text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)]"
          style={{ fontFamily: FONT, color: selected ? TITLE : MUTED }}
        >
          {selected ? selected.label : "Select…"}
        </span>
        <CaretDown size={16} color={AXIS_LABEL} aria-hidden />
      </button>

      {open && (
        <div
          className="absolute left-0 top-[64px] z-50 flex w-full min-w-[220px] flex-col overflow-hidden rounded-[var(--radius-50,4px)]"
          style={{ backgroundColor: CARD_BG, border: `1px solid ${GRID}`, boxShadow: CARD_SHADOW }}
        >
          <div className="flex items-center gap-[var(--spacing-75,6px)] border-b border-solid px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)]" style={{ borderColor: GRID }}>
            <MagnifyingGlass size={16} color={MUTED} aria-hidden />
            <input
              autoFocus
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search…"
              aria-label={`Search ${label}`}
              className="w-full bg-transparent text-[length:var(--body-md-regular-size,14px)] outline-none"
              style={{ fontFamily: FONT, color: TITLE }}
            />
          </div>
          <ul role="listbox" aria-label={label} className="max-h-[220px] overflow-y-auto">
            {filtered.length === 0 && (
              <li className="px-[var(--spacing-100,8px)] py-[var(--spacing-100,8px)] text-[length:var(--body-md-regular-size,14px)]" style={{ fontFamily: FONT, color: MUTED }}>
                No matches
              </li>
            )}
            {filtered.map((o) => {
              const isSel = o.value === value;
              return (
                <li key={o.value} role="option" aria-selected={isSel}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    className="flex w-full items-center justify-between gap-[var(--spacing-100,8px)] border-b border-solid px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)] text-left transition-colors hover:bg-[var(--container-dynamic-neutral-subtle-background-hover,#71718014)]"
                    style={{ borderColor: GRID }}
                  >
                    <span
                      className="text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)]"
                      style={{ fontFamily: FONT, color: isSel ? BRAND : TITLE }}
                    >
                      {o.label}
                    </span>
                    {isSel && <Check size={16} color={BRAND} weight="bold" aria-hidden />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

/* ============================================================ DATA MODEL === */

const MARKETS: Option[] = [
  { value: "UK", label: "United Kingdom" },
  { value: "DE", label: "Germany" },
  { value: "FR", label: "France" },
  { value: "IT", label: "Italy" },
  { value: "ES", label: "Spain" },
];
const MOSAIC: Option[] = [
  { value: "all", label: "All groups" },
  { value: "city-prosperity", label: "City Prosperity" },
  { value: "prestige-positions", label: "Prestige Positions" },
  { value: "suburban-stability", label: "Suburban Stability" },
  { value: "rental-hubs", label: "Rental Hubs" },
  { value: "vintage-value", label: "Vintage Value" },
];
const AGE_GENDER: Option[] = [
  { value: "all", label: "All adults" },
  { value: "m-16-34", label: "Male 16–34" },
  { value: "f-16-34", label: "Female 16–34" },
  { value: "m-35-54", label: "Male 35–54" },
  { value: "f-35-54", label: "Female 35–54" },
  { value: "55plus", label: "Adults 55+" },
];
const CHILDREN: Option[] = [
  { value: "all", label: "All households" },
  { value: "with", label: "With children" },
  { value: "without", label: "Without children" },
];
const CONSUMPTION: Option[] = [
  { value: "all", label: "All viewers" },
  { value: "light", label: "Light (<1h/day)" },
  { value: "medium", label: "Medium (1–5h/day)" },
  { value: "heavy", label: "Heavy (5h+/day)" },
];
const LOOKBACK: Option[] = [
  { value: "7", label: "Last 7 days" },
  { value: "30", label: "Last 30 days" },
  { value: "60", label: "Last 60 days" },
];

type Filters = {
  market: string;
  mosaic: string;
  ageGender: string;
  children: string;
  consumption: string;
  lookback: string;
};

const DEFAULT_FILTERS: Filters = {
  market: "UK", // FPD §31 default filter state on load
  mosaic: "all",
  ageGender: "all",
  children: "all",
  consumption: "all",
  lookback: "30",
};

/* Deliberately-reachable empty combo (FPD §16/§18): IT + Heavy. */
function isEmptyCombo(f: Filters): boolean {
  return f.market === "IT" && f.consumption === "heavy";
}

/* Consumption types (F3). "Home Screen" per FPD outputs. */
const CONSUMPTION_TYPES = [
  { key: "linear", name: "Linear", color: DATAVIS[0], commercial: true },
  { key: "streaming", name: "Streaming", color: DATAVIS[1], commercial: true },
  { key: "fast", name: "FAST", color: DATAVIS[2], commercial: true },
  { key: "home", name: "Home Screen", color: DATAVIS[3], commercial: true },
] as const;
type ConsumptionKey = (typeof CONSUMPTION_TYPES)[number]["key"];

const CHANNELS = [
  "Netflix", "Amazon Prime", "Disney+", "Paramount", "Apple TV", "YouTube",
  "BBC iPlayer", "ITVX", "Channel 4", "Now", "My5", "U",
];
/* BBC iPlayer & ITVX / Channel 4 / My5 public-service = ad-free "non-commercial"
 * shares for the F3 toggle (BBC-type ad-free). */
const NON_COMMERCIAL_CHANNELS = new Set(["BBC iPlayer"]);

const GENRES = [
  "Comedy", "News", "Film", "Sports", "Drama", "Reality",
  "Action", "Documentary", "Kids", "Travel", "Food", "Home Improvement",
];

const SHOWS_BY_GENRE: Record<string, string[]> = {
  Comedy: ["Ted Lasso", "The Office", "Brooklyn 99", "Friends", "Ghosts", "Taskmaster", "Only Fools", "Modern Family", "Derry Girls", "Community"],
  News: ["BBC News at Ten", "Channel 4 News", "Sky News", "Newsnight", "GB News", "ITV Evening News", "Question Time", "The Andrew Marr", "Panorama", "Dispatches"],
  Film: ["Oppenheimer", "Barbie", "Dune", "Top Gun", "Wonka", "The Batman", "Elemental", "Napoleon", "Saltburn", "Wonka 2"],
  Sports: ["Premier League", "MOTD", "F1 Grand Prix", "Six Nations", "The Ashes", "Wimbledon", "Champions League", "Darts WC", "Boxing Night", "NFL UK"],
  Drama: ["The Crown", "Happy Valley", "Line of Duty", "Bodyguard", "Peaky Blinders", "The Gold", "Sherwood", "Vigil", "The Responder", "Time"],
  Reality: ["Love Island", "The Traitors", "Bake Off", "Strictly", "I'm A Celeb", "MAFS UK", "Big Brother", "Gogglebox", "First Dates", "Race Across"],
  Action: ["Reacher", "The Boys", "Jack Ryan", "Slow Horses", "Citadel", "Mr & Mrs Smith", "The Night Agent", "Fubar", "Special Ops", "The Continental"],
  Documentary: ["Planet Earth III", "Blue Planet", "Beckham", "Wild Isles", "Dynasties", "The Last Dance", "Our Planet", "Frozen Planet", "Attenborough", "Prehistoric"],
  Kids: ["Bluey", "Peppa Pig", "Paw Patrol", "Hey Duggee", "Spidey", "Gabby's House", "Numberblocks", "Octonauts", "Bing", "Andy's Adventures"],
  Travel: ["Race Across World", "Amazing Hotels", "Rick Stein", "Portrait Artist", "Grand Tour", "Michael Palin", "Wonders of Europe", "Coastal Britain", "Compass", "The Trip"],
  Food: ["MasterChef", "Bake Off", "Saturday Kitchen", "Great British Menu", "Kitchen Nightmares", "Nadiya's Table", "James Martin", "Simply Raymond", "Best Bites", "Sunday Brunch"],
  "Home Improvement": ["Grand Designs", "DIY SOS", "Homes Under Hammer", "Sort Your Life", "Interior Design", "Your Garden", "The Restorers", "Escape to Country", "Room to Improve", "Build a New Life"],
};

const TV_TYPES = ["All", "Linear", "Streaming", "FAST"];
const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAYPARTS = ["Early AM", "Daytime", "Afternoon", "Peak", "Late Night"];

/* Platforms for F8 genre-level share. */
const PLATFORMS = [
  { name: "Netflix", color: DATAVIS[0] },
  { name: "Prime", color: DATAVIS[1] },
  { name: "Disney+", color: DATAVIS[2] },
  { name: "BBC iPlayer", color: DATAVIS[3] },
  { name: "ITVX", color: DATAVIS[4] },
  { name: "Other", color: DATAVIS[6] },
];

/* ---------------------------------------- derive mock data from filters --- */

function seedKey(f: Filters, extra = "") {
  return `${f.market}|${f.mosaic}|${f.ageGender}|${f.children}|${f.consumption}|${f.lookback}|${extra}`;
}

/* ==================================================== MAIN PAGE COMPONENT === */

export default function TvAudienceDashboardPage() {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [metric, setMetric] = useState<"minutes" | "reach">("minutes");
  const [excludeNonCommercial, setExcludeNonCommercial] = useState(false);

  // F3 cross-filter selection (consumption type). Resets on global filter change.
  const [selectedType, setSelectedType] = useState<ConsumptionKey | null>(null);
  // F5 -> F6 cross-filter (genre). Resets on global filter change.
  const [selectedGenre, setSelectedGenre] = useState<string | null>(null);

  // Per-section TV Type filters (F5, F6, F7).
  const [genreTvType, setGenreTvType] = useState("All");
  const [showsTvType, setShowsTvType] = useState("All");
  const [temporalTvType, setTemporalTvType] = useState("All");

  // Loading orchestration: any filter change -> all charts skeleton ~600ms.
  const [loading, setLoading] = useState(false);
  const firstRender = useRef(true);

  // F4 per-chart error simulation (FPD §17). A deterministic filter combo
  // (Market=ES + Lookback=60 days) makes the Channel/App chart fail to load
  // while the rest of the dashboard stays functional (partial data failure,
  // FPD §17). Retry re-runs the simulated load and succeeds.
  const [channelsRetried, setChannelsRetried] = useState(false);
  const channelsFailCombo = filters.market === "ES" && filters.lookback === "60";
  const channelsError = channelsFailCombo && !channelsRetried;

  const isUK = filters.market === "UK";
  const empty = isEmptyCombo(filters);

  // Trigger simulated cascade loading on any global filter change.
  // FPD §31 default: F3 & F5 selections RESET on global filter change.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setSelectedType(null);
    setSelectedGenre(null);
    setChannelsRetried(false); // a fresh filter change re-arms the failure combo
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, metric, excludeNonCommercial]);

  // Retry handler for F4: re-run a short simulated load, then succeed.
  function retryChannels() {
    setLoading(true);
    setChannelsRetried(true);
    setTimeout(() => setLoading(false), 600);
  }

  // When the market changes to non-UK, reset UK-only dimensions.
  function updateFilter<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (key === "market" && value !== "UK") {
        next.mosaic = "all";
        next.ageGender = "all";
        next.children = "all";
      }
      return next;
    });
  }

  /* ---- F2 KPI tiles ---- */
  const kpis = useMemo(() => {
    const s = (x: string) => seeded(seedKey(filters, x), 0, 1);
    const lookMult = Number(filters.lookback) / 30;
    const reachMode = metric === "reach";
    return [
      {
        icon: UsersThree,
        name: "Total Households Viewing",
        value: reachMode
          ? `${(58 + s("hh-r") * 30).toFixed(1)}%`
          : fmtInt(2_400_000 + s("hh") * 3_600_000),
        sub: reachMode ? "reach of target" : "households",
        index: Math.round(96 + s("hh-i") * 45),
      },
      {
        icon: Clock,
        name: "Total Minutes Viewing",
        value: reachMode
          ? `${(70 + s("min-r") * 25).toFixed(1)}%`
          : fmtK((820_000_000 + s("min") * 500_000_000) * lookMult),
        sub: reachMode ? "reach of target" : "minutes",
        index: Math.round(102 + s("min-i") * 40),
      },
      {
        icon: MonitorPlay,
        name: "Avg Daily Consumption — All Streaming",
        value: reachMode ? `${(44 + s("st-r") * 30).toFixed(1)}%` : `${Math.round(96 + s("st") * 80)} min`,
        sub: reachMode ? "reach of target" : "per day",
        index: Math.round(108 + s("st-i") * 40),
      },
      {
        icon: Television,
        name: "Avg Daily Consumption — Linear",
        value: reachMode ? `${(52 + s("li-r") * 28).toFixed(1)}%` : `${Math.round(132 + s("li") * 90)} min`,
        sub: reachMode ? "reach of target" : "per day",
        index: Math.round(88 + s("li-i") * 30),
      },
      {
        icon: SquaresFour,
        name: "Avg Channels/Apps per Household",
        value: reachMode ? `${(60 + s("ch-r") * 25).toFixed(1)}%` : `${(4.2 + s("ch") * 4).toFixed(1)}`,
        sub: reachMode ? "reach of target" : "channels / apps",
        index: Math.round(98 + s("ch-i") * 35),
      },
    ];
  }, [filters, metric]);

  /* ---- F3 consumption by type ---- */
  const consumption = useMemo(() => {
    return CONSUMPTION_TYPES.map((t, i) => {
      const base = seeded(seedKey(filters, `c-${t.key}`), 0.4, 1);
      let minutes = Math.round((320 - i * 55) * base * 10) * 100; // scaled minutes
      let households = Math.round((900_000 - i * 140_000) * base);
      if (excludeNonCommercial && t.key === "linear") {
        // Non-commercial toggle removes BBC-type ad-free share from Linear.
        minutes = Math.round(minutes * 0.72);
        households = Math.round(households * 0.78);
      }
      return { ...t, minutes, households };
    });
  }, [filters, excludeNonCommercial]);
  const consumptionTotal = consumption.reduce((a, b) => a + b.minutes, 0);

  /* ---- F4 channel/app combo ---- */
  const channels = useMemo(() => {
    const rows = CHANNELS.map((c) => {
      let mins = Math.round(seeded(seedKey(filters, `ch-${c}${selectedType ?? ""}`), 40, 380));
      if (excludeNonCommercial && NON_COMMERCIAL_CHANNELS.has(c)) mins = 0;
      if (selectedType === "streaming" && ["BBC iPlayer", "ITVX", "Channel 4", "My5", "U"].includes(c)) mins = Math.round(mins * 0.4);
      if (selectedType === "fast") mins = Math.round(mins * (["Now", "U", "My5"].includes(c) ? 1.2 : 0.6));
      return { name: c, mins };
    })
      .filter((r) => r.mins > 0)
      .sort((a, b) => b.mins - a.mins)
      .slice(0, 10);
    const total = rows.reduce((a, b) => a + b.mins, 0) || 1;
    return rows.map((r) => ({ ...r, pct: (r.mins / total) * 100 }));
  }, [filters, selectedType, excludeNonCommercial]);

  // F3 cross-filter tag used in seed keys so ALL downstream mock data (F4–F8)
  // deterministically shifts when a consumption type is selected.
  const typeTag = selectedType ?? "";
  const selectedTypeName = CONSUMPTION_TYPES.find((t) => t.key === selectedType)?.name ?? null;

  /* ---- F5 genre bars (responds to F3 selection) ---- */
  const genres = useMemo(() => {
    return GENRES.map((g) => {
      const mins = Math.round(seeded(seedKey(filters, `g-${g}-${genreTvType}-${typeTag}`), 30, 320));
      const index = Math.round(seeded(seedKey(filters, `gi-${g}-${genreTvType}-${typeTag}`), 62, 158));
      return { name: g, mins, index };
    })
      .sort((a, b) => b.mins - a.mins)
      .slice(0, 10);
  }, [filters, genreTvType, typeTag]);

  /* ---- F6 top shows (filtered by F5 genre + F3 selection) ---- */
  const shows = useMemo(() => {
    const genre = selectedGenre ?? genres[0]?.name ?? "Comedy";
    const list = SHOWS_BY_GENRE[genre] ?? SHOWS_BY_GENRE.Comedy;
    return list
      .map((title) => ({
        title,
        index: Math.round(seeded(seedKey(filters, `s-${genre}-${title}-${showsTvType}-${typeTag}`), 90, 210)),
        mins: Math.round(seeded(seedKey(filters, `sm-${genre}-${title}-${showsTvType}-${typeTag}`), 8, 55)),
      }))
      .sort((a, b) => b.index - a.index)
      .slice(0, 10);
  }, [filters, selectedGenre, genres, showsTvType, typeTag]);
  const activeShowGenre = selectedGenre ?? genres[0]?.name ?? "Comedy";

  /* ---- F7 temporal heatmap (responds to F3 selection) ---- */
  const temporal = useMemo(() => {
    return DAYS.map((d) =>
      DAYPARTS.map((p) => {
        const v = seeded(seedKey(filters, `t-${d}-${p}-${temporalTvType}${typeTag}`), 0, 1);
        const band = v < 0.34 ? "Low" : v < 0.67 ? "Medium" : "High";
        return { day: d, part: p, value: v, band: band as "Low" | "Medium" | "High" };
      }),
    );
  }, [filters, temporalTvType, typeTag]);

  /* ---- F8 genre-level platform comparison (100% stacked) ---- */
  // Responds to F3: selecting a consumption type shifts the platform-share mix
  // (e.g. Streaming boosts SVOD platforms, Linear boosts BBC/ITVX) so the split
  // visibly changes and the applied scope is shown via a chip on the card.
  const genrePlatforms = useMemo(() => {
    // Emphasis weights per selected consumption type, keyed to PLATFORMS order:
    // [Netflix, Prime, Disney+, BBC iPlayer, ITVX, Other]
    const weightsByType: Record<ConsumptionKey, number[]> = {
      linear: [0.6, 0.6, 0.7, 1.8, 1.6, 1],
      streaming: [1.8, 1.7, 1.6, 0.5, 0.6, 0.8],
      fast: [0.7, 0.8, 0.7, 0.9, 1.1, 1.9],
      home: [1.1, 1.1, 1, 1, 1, 1],
    };
    const w = selectedType ? weightsByType[selectedType] : null;
    const list = (selectedGenre ? [selectedGenre] : GENRES.slice(0, 6)).map((g) => {
      const raw = PLATFORMS.map((p, i) => {
        const base = seeded(seedKey(filters, `gp-${g}-${p.name}-${typeTag}`), 5, 40);
        return w ? base * w[i] : base;
      });
      const sum = raw.reduce((a, b) => a + b, 0);
      const shares = raw.map((r) => (r / sum) * 100);
      return { genre: g, shares };
    });
    return list;
  }, [filters, selectedGenre, selectedType, typeTag]);

  const filterCount = Object.entries(filters).filter(([k, v]) => {
    const def = (DEFAULT_FILTERS as Record<string, string>)[k];
    return v !== def && v !== "all";
  }).length;

  /* -------------------------------------------------------------- render --- */

  return (
    <div className="flex flex-col gap-[var(--spacing-300,24px)]" style={{ fontFamily: FONT }}>
      {/* Page intro */}
      <header className="flex flex-col gap-[var(--spacing-75,6px)]">
        <h2 className="text-[length:var(--headline-md-semibold-size,24px)] font-semibold leading-[var(--headline-md-semibold-line-height,32px)] tracking-[-0.36px]" style={{ color: TITLE }}>
          TV Audience Intelligence Dashboard
        </h2>
        <p className="max-w-[720px] text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)]" style={{ color: MUTED }}>
          Understand your target audience's TV viewing behaviour across Linear, Streaming and FAST
          environments, benchmarked against the national average. Use the global filters to define
          an audience, then drill into consumption type, channels, genres, shows and dayparts.
        </p>
      </header>

      {/* F1 — Global Filter Bar (sticky) */}
      <div
        className="sticky top-0 z-40 -mx-6 px-6 py-[var(--spacing-200,16px)] md:-mx-10 md:px-10"
        style={{ backgroundColor: "var(--surface-background-lvl2, #f7f7fa)", borderBottom: `1px solid ${GRID}` }}
      >
        <div className="flex flex-col gap-[var(--spacing-100,8px)]">
          <div className="flex items-center justify-between gap-[var(--spacing-100,8px)]">
            <span className="text-[length:var(--body-sm-medium-size,12px)] font-medium uppercase tracking-wide" style={{ color: MUTED }}>
              Global filters
            </span>
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
          <div className="flex flex-wrap items-end gap-[var(--spacing-150,12px)]">
            <SearchableDropdown id="f-market" label="Market" value={filters.market} options={MARKETS} onChange={(v) => updateFilter("market", v)} />
            {/* UK-only dimensions (F1 business rule) */}
            {isUK && (
              <>
                <SearchableDropdown id="f-mosaic" label="Mosaic Group" value={filters.mosaic} options={MOSAIC} onChange={(v) => updateFilter("mosaic", v)} />
                <SearchableDropdown id="f-age" label="Age & Gender" value={filters.ageGender} options={AGE_GENDER} onChange={(v) => updateFilter("ageGender", v)} />
                <SearchableDropdown id="f-children" label="Children in HH" value={filters.children} options={CHILDREN} onChange={(v) => updateFilter("children", v)} />
              </>
            )}
            <SearchableDropdown id="f-consumption" label="TV Consumption" value={filters.consumption} options={CONSUMPTION} onChange={(v) => updateFilter("consumption", v)} />
            <SearchableDropdown id="f-lookback" label="Lookback Window" value={filters.lookback} options={LOOKBACK} onChange={(v) => updateFilter("lookback", v)} />
          </div>
          {!isUK && (
            <p className="text-[length:var(--body-sm-regular-size,12px)]" style={{ color: MUTED }}>
              Mosaic Group, Age &amp; Gender and Children in HH are available for the UK market only.
            </p>
          )}
        </div>
      </div>

      {/* F2 — Executive KPI Summary */}
      <SectionHeading title="Executive Summary" subtitle="Audience size and viewing benchmarked vs. national average">
        <div className="flex items-center gap-[var(--spacing-150,12px)]">
          <span className="text-[length:var(--body-sm-regular-size,12px)]" style={{ color: metric === "minutes" ? TITLE : MUTED }}>Minutes Watched</span>
          <Toggle id="metric-toggle" label="Toggle metric between Minutes Watched and Reach" on={metric === "reach"} onToggle={() => setMetric((m) => (m === "minutes" ? "reach" : "minutes"))} />
          <span className="text-[length:var(--body-sm-regular-size,12px)]" style={{ color: metric === "reach" ? TITLE : MUTED }}>Reach</span>
        </div>
      </SectionHeading>

      <div className="grid grid-cols-1 gap-[var(--spacing-150,12px)] sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {kpis.map((k) => {
          const Icon = k.icon;
          return (
            <div
              key={k.name}
              className="flex flex-col gap-[var(--spacing-100,8px)] rounded-[var(--radius-50,4px)] p-[var(--spacing-200,16px)]"
              style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW }}
            >
              {loading ? (
                <div className="flex flex-col gap-[var(--spacing-100,8px)]">
                  <div className="h-[24px] w-[24px] animate-pulse rounded-[var(--radius-25,2px)]" style={{ backgroundColor: "var(--surface-background-lvl3, #ebebf0)" }} />
                  <div className="h-[28px] w-[80px] animate-pulse rounded-[var(--radius-25,2px)]" style={{ backgroundColor: "var(--surface-background-lvl3, #ebebf0)" }} />
                  <div className="h-[14px] w-full animate-pulse rounded-[var(--radius-25,2px)]" style={{ backgroundColor: "var(--surface-background-lvl3, #ebebf0)" }} />
                </div>
              ) : (
                <>
                  <Icon size={24} color={BRAND} weight="regular" aria-hidden />
                  <div className="flex items-end gap-[var(--spacing-75,6px)]">
                    <span className="text-[length:var(--headline-sm-semibold-size,20px)] font-semibold leading-[var(--headline-sm-semibold-line-height,28px)] tracking-[-0.2px]" style={{ color: TITLE }}>
                      {k.value}
                    </span>
                    <span className="pb-[3px] text-[length:var(--body-sm-regular-size,12px)]" style={{ color: MUTED }}>{k.sub}</span>
                  </div>
                  <p className="text-[length:var(--body-sm-regular-size,12px)] leading-[var(--body-sm-regular-line-height,18px)]" style={{ color: BODY2 }}>{k.name}</p>
                  <div><IndexBadge index={empty ? null : k.index} /></div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* F3 — Consumption by Type */}
      <SectionHeading title="Consumption by Type" subtitle="Click a segment to cross-filter all charts below" />
      <SmartCard
        title="Viewing minutes by TV type"
        subtitle="Linear · Streaming · FAST · Home Screen — with households per segment"
        ariaLabel="Consumption by type chart"
        right={
          <div className="flex flex-wrap items-center gap-[var(--spacing-150,12px)]">
            {selectedType && (
              <Chip
                label={`Selected: ${CONSUMPTION_TYPES.find((t) => t.key === selectedType)?.name}`}
                selected
                onRemove={() => setSelectedType(null)}
              />
            )}
            <Toggle id="noncommercial" label="Exclude non-commercial" on={excludeNonCommercial} onToggle={() => setExcludeNonCommercial((v) => !v)} />
          </div>
        }
      >
        <CardBody loading={loading} empty={empty} height={160}>
          <StackedConsumptionBar
            data={consumption}
            total={consumptionTotal}
            selected={selectedType}
            onSelect={(k) => setSelectedType((cur) => (cur === k ? null : k))}
          />
        </CardBody>
      </SmartCard>

      {/* F4 — Time Spent by Channel/App */}
      <SectionHeading title="Channel / App Analytics" subtitle="Top 10 channels & apps by audience time" />
      <SmartCard
        title="Time spent by channel / app"
        subtitle="Bars = avg mins/week (left axis) · Line = % of total watch time (right axis)"
        ariaLabel="Time spent by channel or app combo chart"
        right={selectedTypeName ? <Chip as="span" label={`TV type: ${selectedTypeName}`} selected /> : undefined}
      >
        <CardBody loading={loading} empty={empty || channels.length === 0} error={channelsError} onRetry={retryChannels} height={300}>
          <ComboChart
            categories={channels.map((c) => c.name)}
            bars={channels.map((c) => c.mins)}
            line={channels.map((c) => c.pct)}
            barLabel="Avg mins/week"
            lineLabel="% of total watch time"
            barUnit=" min"
            lineUnit="%"
          />
        </CardBody>
      </SmartCard>

      {/* F5 — Viewership by Genre */}
      <SectionHeading title="Genre Analytics" subtitle="Top 10 IAB genres — click a genre to filter Top Shows below" />
      <SmartCard
        title="Viewership by genre"
        subtitle="Avg mins/week per genre with directional index vs. national average"
        ariaLabel="Viewership by genre bar chart"
        right={
          <div className="flex flex-wrap items-center gap-[var(--spacing-100,8px)]">
            {selectedTypeName && <Chip as="span" label={`TV type: ${selectedTypeName}`} selected />}
            <TvTypeChips value={genreTvType} onChange={setGenreTvType} />
          </div>
        }
      >
        <CardBody loading={loading} empty={empty} height={320}>
          <GenreBars
            data={genres}
            selected={selectedGenre}
            onSelect={(g) => setSelectedGenre((cur) => (cur === g ? null : g))}
          />
        </CardBody>
      </SmartCard>

      {/* F6 — Top 10 Indexing Shows */}
      <SectionHeading title="Top Shows" subtitle="Highest-indexing shows for the selected genre" />
      <SmartCard
        title="Top 10 indexing shows"
        subtitle="Bars = index (left axis) · Line = avg daily minutes (right axis)"
        ariaLabel="Top indexing shows combo chart"
        right={
          <div className="flex flex-wrap items-center gap-[var(--spacing-100,8px)]">
            {selectedTypeName && <Chip as="span" label={`TV type: ${selectedTypeName}`} selected />}
            <Chip as="span" label={`Genre: ${activeShowGenre}`} selected />
            {selectedGenre && <Chip label="Clear genre" onRemove={() => setSelectedGenre(null)} selected />}
            <TvTypeChips value={showsTvType} onChange={setShowsTvType} />
          </div>
        }
      >
        <CardBody loading={loading} empty={empty} height={300}>
          <ComboChart
            categories={shows.map((s) => s.title)}
            bars={shows.map((s) => s.index)}
            line={shows.map((s) => s.mins)}
            barLabel="Index vs. national avg"
            lineLabel="Avg daily minutes"
            barUnit=""
            lineUnit=" min"
            barMaxHint={220}
            rotateLabels
          />
        </CardBody>
      </SmartCard>

      {/* F7 — Temporal Insights */}
      <SectionHeading title="Temporal Insights" subtitle="When your audience watches — day of week × time of day" />
      <SmartCard
        title="Consumption heat map"
        subtitle="Low / Medium / High consumption bands"
        ariaLabel="Temporal insights heat map"
        right={
          <div className="flex flex-wrap items-center gap-[var(--spacing-100,8px)]">
            {selectedTypeName && <Chip as="span" label={`TV type: ${selectedTypeName}`} selected />}
            <TvTypeChips value={temporalTvType} onChange={setTemporalTvType} />
          </div>
        }
      >
        <CardBody loading={loading} empty={empty} height={280}>
          <HeatMap grid={temporal} />
        </CardBody>
      </SmartCard>

      {/* F8 — Genre-Level Platform Comparison */}
      <SectionHeading title="Genre Platform Comparison" subtitle="Share of viewing minutes per platform, at genre level (sums to 100%)" />
      <SmartCard
        title="Platform share by genre"
        subtitle={selectedGenre ? `Filtered to ${selectedGenre}` : "Top genres — 100% stacked"}
        ariaLabel="Genre-level platform comparison chart"
        right={selectedTypeName ? <Chip as="span" label={`TV type: ${selectedTypeName}`} selected /> : undefined}
      >
        <CardBody loading={loading} empty={empty} height={280}>
          <PlatformShareBars data={genrePlatforms} />
        </CardBody>
      </SmartCard>

      {/* F9 — Comparison Mode (P2, future-ready placeholder) */}
      <SectionHeading title="Comparison Mode" subtitle="Coming soon" />
      <div
        className="flex flex-col items-center gap-[var(--spacing-150,12px)] rounded-[var(--radius-50,4px)] p-[var(--spacing-400,32px)] text-center"
        style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW, border: `1px dashed ${GRID}` }}
      >
        <img src="/figmaAssets/empty-state/illustration-launch-airplane.svg" alt="" className="h-[140px] w-[140px] object-contain" />
        <div className="flex flex-col gap-[var(--spacing-75,6px)]">
          <p className="text-[length:var(--headline-xs-medium-size,16px)] font-medium leading-[var(--headline-xs-medium-line-height,24px)]" style={{ color: TITLE }}>
            Comparison Mode — future-ready (P2)
          </p>
          <p className="mx-auto max-w-[520px] text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)]" style={{ color: MUTED }}>
            Side-by-side comparison of two audience segments (e.g. Male vs. Female) across every
            dashboard metric. This is a planned enhancement (FPD §9 F9, §30) and is presented here as
            a placeholder — the interaction is not yet implemented.
          </p>
        </div>
        <span
          className="inline-flex items-center gap-[var(--spacing-50,4px)] rounded-[var(--spacing-mega,40px)] px-[var(--spacing-100,8px)] py-[var(--spacing-25,2px)]"
          style={{ backgroundColor: "var(--container-static-brand-subtle-background, #f6ebff)", color: "var(--container-static-brand-subtle-foreground-variation, #662994)" }}
        >
          <Info size={14} aria-hidden />
          <span className="text-[length:var(--body-sm-medium-size,12px)] font-medium">Planned feature</span>
        </span>
      </div>

      {/* Footnote — FPD open-question defaults (§31) */}
      <footer className="flex flex-col gap-[var(--spacing-50,4px)] border-t border-solid pt-[var(--spacing-200,16px)]" style={{ borderColor: GRID }}>
        <p className="text-[length:var(--body-sm-regular-size,12px)] font-medium" style={{ color: BODY2 }}>Notes &amp; assumptions (FPD open questions §31)</p>
        <ul className="list-disc pl-[18px] text-[length:var(--body-sm-regular-size,12px)] leading-[var(--body-sm-regular-line-height,18px)]" style={{ color: MUTED }}>
          <li>Default filter state on load: Market = United Kingdom, Lookback = Last 30 days, metric = Minutes Watched.</li>
          <li>F3 / F5 cross-filter selections reset when a global filter changes (avoids stale drill-downs).</li>
          <li>Genre chart primary metric = avg mins/week; index vs. national average shown as a directional indicator per bar.</li>
          <li>Temporal Insights rendered as a day × time-of-day heat map with Low / Medium / High bands.</li>
          <li>Indexing benchmark = national average for the selected market &amp; lookback window; if unavailable, the index badge is hidden and the value shown alone.</li>
          <li>All figures are illustrative mock data derived deterministically from the active filter combination.</li>
        </ul>
      </footer>
    </div>
  );
}

/* ==================================================== SECTION HEADING ====== */

function SectionHeading({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-[var(--spacing-150,12px)]">
      <div className="flex flex-col gap-[var(--spacing-25,2px)]">
        <h3 className="text-[length:var(--headline-xs-medium-size,16px)] font-semibold leading-[var(--headline-xs-medium-line-height,24px)] tracking-[-0.08px]" style={{ color: TITLE }}>
          {title}
        </h3>
        {subtitle && (
          <p className="text-[length:var(--body-sm-regular-size,12px)] leading-[var(--body-sm-regular-line-height,18px)]" style={{ color: MUTED }}>
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

/* TV Type filter chips (F5/F6/F7). */
function TvTypeChips({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-[var(--spacing-75,6px)]" role="group" aria-label="TV type filter">
      {TV_TYPES.map((t) => (
        <Chip key={t} label={t} selected={value === t} onClick={() => onChange(t)} />
      ))}
    </div>
  );
}

/* ================================================ F3 STACKED CONSUMPTION === */

function StackedConsumptionBar({
  data,
  total,
  selected,
  onSelect,
}: {
  data: { key: ConsumptionKey; name: string; color: string; minutes: number; households: number }[];
  total: number;
  selected: ConsumptionKey | null;
  onSelect: (k: ConsumptionKey) => void;
}) {
  const [hover, setHover] = useState<ConsumptionKey | null>(null);
  return (
    <div className="flex flex-col gap-[var(--spacing-200,16px)]">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-[var(--spacing-200,16px)] gap-y-[var(--spacing-75,6px)]">
        {data.map((d) => (
          <div key={d.key} className="flex items-center gap-[var(--spacing-75,6px)]">
            <span className="block h-[12px] w-[12px] shrink-0 rounded-[var(--radius-25,2px)]" style={{ backgroundColor: d.color }} />
            <span className="text-[length:var(--body-md-regular-size,14px)]" style={{ color: AXIS_LABEL }}>{d.name}</span>
          </div>
        ))}
      </div>

      {/* Stacked bar (buttons per segment for keyboard access) */}
      <div className="flex h-[56px] w-full overflow-hidden rounded-[var(--radius-50,4px)]" role="group" aria-label="Consumption type segments">
        {data.map((d) => {
          const pct = (d.minutes / total) * 100;
          const isSel = selected === d.key;
          const dimmed = selected != null && !isSel;
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => onSelect(d.key)}
              onMouseEnter={() => setHover(d.key)}
              onMouseLeave={() => setHover(null)}
              aria-pressed={isSel}
              aria-label={`${d.name}: ${fmtInt(d.minutes)} minutes, ${fmtInt(d.households)} households, ${pct.toFixed(1)}% of viewing. Click to cross-filter.`}
              className="relative flex h-full items-center justify-center transition-opacity focus:outline-none focus-visible:ring-2"
              style={{
                width: `${pct}%`,
                backgroundColor: d.color,
                opacity: dimmed ? 0.4 : 1,
                boxShadow: isSel ? "inset 0 0 0 2px var(--surface-foreground-static-neutral-lvl1, #13131a)" : undefined,
              }}
            >
              {pct > 8 && (
                <span className="text-[length:var(--body-sm-medium-size,12px)] font-medium" style={{ color: "var(--datavis-labels-adaptive, #ffffff)" }}>
                  {pct.toFixed(0)}%
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Per-segment detail table */}
      <div className="grid grid-cols-2 gap-[var(--spacing-100,8px)] sm:grid-cols-4">
        {data.map((d) => {
          const active = hover === d.key || selected === d.key;
          return (
            <div
              key={d.key}
              className="flex flex-col gap-[var(--spacing-25,2px)] rounded-[var(--radius-50,4px)] p-[var(--spacing-100,8px)]"
              style={{ backgroundColor: active ? "var(--surface-background-lvl2, #f7f7fa)" : "transparent", border: `1px solid ${GRID}` }}
            >
              <div className="flex items-center gap-[var(--spacing-75,6px)]">
                <span className="block h-[10px] w-[10px] rounded-[var(--radius-25,2px)]" style={{ backgroundColor: d.color }} />
                <span className="text-[length:var(--body-sm-medium-size,12px)] font-medium" style={{ color: TITLE }}>{d.name}</span>
              </div>
              <span className="text-[length:var(--body-md-regular-size,14px)] font-semibold" style={{ color: TITLE }}>{fmtInt(d.minutes)} min</span>
              <span className="text-[length:var(--body-sm-regular-size,12px)]" style={{ color: MUTED }}>{fmtInt(d.households)} households</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ==================================================== COMBO CHART (F4/F6) == */

function ComboChart({
  categories,
  bars,
  line,
  barLabel,
  lineLabel,
  barUnit = "",
  lineUnit = "",
  barMaxHint,
  rotateLabels = false,
}: {
  categories: string[];
  bars: number[];
  line: number[];
  barLabel: string;
  lineLabel: string;
  barUnit?: string;
  lineUnit?: string;
  barMaxHint?: number;
  rotateLabels?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const plotW = 720;
  const plotH = 240;
  const barMax = Math.max(barMaxHint ?? 0, ...bars, 1);
  const lineMax = Math.max(...line, 1);
  const n = categories.length;
  const slot = plotW / n;
  const colW = Math.max(16, Math.min(28, slot * 0.5));

  const yTicks = 5;
  const barTickVals = Array.from({ length: yTicks }, (_, i) => Math.round((barMax * (yTicks - 1 - i)) / (yTicks - 1)));
  const lineTickVals = Array.from({ length: yTicks }, (_, i) => Math.round((lineMax * (yTicks - 1 - i)) / (yTicks - 1)));

  const linePts = line.map((v, i) => ({ cx: i * slot + slot / 2, cy: plotH - (v / lineMax) * plotH }));

  return (
    <div className="flex flex-col gap-[var(--spacing-150,12px)]">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-[var(--spacing-200,16px)] gap-y-[var(--spacing-75,6px)]">
        <div className="flex items-center gap-[var(--spacing-75,6px)]">
          <span className="block h-[12px] w-[12px] rounded-[var(--radius-25,2px)]" style={{ backgroundColor: DATAVIS[0] }} />
          <span className="text-[length:var(--body-md-regular-size,14px)]" style={{ color: AXIS_LABEL }}>{barLabel}</span>
        </div>
        <div className="flex items-center gap-[var(--spacing-75,6px)]">
          <span className="block h-[3px] w-[16px] rounded-full" style={{ backgroundColor: DATAVIS[2] }} />
          <span className="text-[length:var(--body-md-regular-size,14px)]" style={{ color: AXIS_LABEL }}>{lineLabel}</span>
        </div>
      </div>

      <div className="flex w-full">
        {/* Left axis */}
        <div className="flex flex-col justify-between pr-[var(--spacing-100,8px)] text-right" style={{ height: plotH }}>
          {barTickVals.map((t, i) => (
            <span key={i} className="text-[length:var(--body-sm-regular-size,12px)]" style={{ color: AXIS_LABEL }}>{t}</span>
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          <div className="relative w-full" style={{ height: plotH }}>
            {/* gridlines */}
            {barTickVals.map((_, i) => (
              <div key={i} className="absolute left-0 right-0 h-0 border-t border-solid" style={{ borderColor: GRID, top: `${(i / (yTicks - 1)) * 100}%` }} />
            ))}
            <svg className="absolute inset-0 h-full w-full" viewBox={`0 0 ${plotW} ${plotH}`} preserveAspectRatio="none" role="img" aria-label={`${barLabel} bars with ${lineLabel} line overlay`}>
              {bars.map((v, i) => {
                const h = (v / barMax) * plotH;
                const x = i * slot + (slot - colW) / 2;
                return (
                  <rect key={i} x={x} y={plotH - h} width={colW} height={h} rx={1} fill={DATAVIS[0]} opacity={hover == null || hover === i ? 1 : 0.5} />
                );
              })}
              <polyline points={linePts.map((p) => `${p.cx},${p.cy}`).join(" ")} fill="none" stroke={DATAVIS[2]} strokeWidth={2} vectorEffect="non-scaling-stroke" />
              {linePts.map((p, i) => (
                <circle key={i} cx={p.cx} cy={p.cy} r={3} fill={DATAVIS[2]} vectorEffect="non-scaling-stroke" />
              ))}
            </svg>

            {/* hover hit areas + tooltip */}
            {categories.map((c, i) => (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className="absolute top-0 h-full focus:outline-none focus-visible:bg-[var(--container-dynamic-neutral-subtle-background-hover,#71718014)]"
                style={{ left: `${(i / n) * 100}%`, width: `${100 / n}%` }}
                aria-label={`${c}: ${barLabel} ${fmtInt(bars[i])}${barUnit}, ${lineLabel} ${line[i].toFixed(1)}${lineUnit}`}
              >
                {hover === i && (
                  <span
                    className="pointer-events-none absolute left-1/2 top-1 z-10 flex -translate-x-1/2 flex-col gap-[var(--spacing-25,2px)] whitespace-nowrap rounded-[var(--radius-50,4px)] px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)] text-left"
                    style={{ backgroundColor: "var(--surface-background-lvl6, #282833)", boxShadow: CARD_SHADOW }}
                  >
                    <span className="text-[length:var(--body-sm-medium-size,12px)] font-medium" style={{ color: "var(--surface-foreground-static-neutral-inversed, #ffffff)" }}>{c}</span>
                    <span className="text-[length:var(--body-sm-regular-size,12px)]" style={{ color: "var(--surface-foreground-static-neutral-lvl4, #c6c6cc)" }}>{barLabel}: {fmtInt(bars[i])}{barUnit}</span>
                    <span className="text-[length:var(--body-sm-regular-size,12px)]" style={{ color: "var(--surface-foreground-static-neutral-lvl4, #c6c6cc)" }}>{lineLabel}: {line[i].toFixed(1)}{lineUnit}</span>
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* X labels */}
          <div className="mt-[var(--spacing-75,6px)] flex w-full">
            {categories.map((c, i) => (
              <span
                key={i}
                className={`block px-[2px] text-center text-[length:var(--body-sm-regular-size,12px)] ${rotateLabels ? "origin-top-left" : "truncate"}`}
                style={{ width: `${100 / n}%`, color: AXIS_LABEL }}
                title={c}
              >
                {c.length > 10 && !rotateLabels ? `${c.slice(0, 9)}…` : c}
              </span>
            ))}
          </div>
        </div>

        {/* Right axis */}
        <div className="flex flex-col justify-between pl-[var(--spacing-100,8px)] text-left" style={{ height: plotH }}>
          {lineTickVals.map((t, i) => (
            <span key={i} className="text-[length:var(--body-sm-regular-size,12px)]" style={{ color: AXIS_LABEL }}>{t}{lineUnit.trim() ? lineUnit.trim() : ""}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ==================================================== F5 GENRE BARS ======== */

function GenreBars({
  data,
  selected,
  onSelect,
}: {
  data: { name: string; mins: number; index: number }[];
  selected: string | null;
  onSelect: (g: string) => void;
}) {
  const max = Math.max(...data.map((d) => d.mins), 1);
  return (
    <div className="flex flex-col gap-[var(--spacing-100,8px)]" role="group" aria-label="Genre bars">
      {data.map((d) => {
        const isSel = selected === d.name;
        const dimmed = selected != null && !isSel;
        const up = d.index > 100;
        const flat = d.index === 100;
        const fg = flat ? MUTED : up ? SUCCESS_FG : ERROR_FG;
        const Arrow = flat ? Minus : up ? ArrowUp : ArrowDown;
        return (
          <button
            key={d.name}
            type="button"
            onClick={() => onSelect(d.name)}
            aria-pressed={isSel}
            aria-label={`${d.name}: ${fmtInt(d.mins)} minutes per week, index ${d.index} ${flat ? "at" : up ? "above" : "below"} national average. Click to filter top shows.`}
            className="flex w-full items-center gap-[var(--spacing-150,12px)] rounded-[var(--radius-50,4px)] px-[var(--spacing-75,6px)] py-[3px] text-left transition-colors focus:outline-none focus-visible:ring-2 hover:bg-[var(--container-dynamic-neutral-subtle-background-hover,#71718014)]"
            style={{ opacity: dimmed ? 0.5 : 1, backgroundColor: isSel ? "var(--container-dynamic-brand-subtle-background-selected, #f6ebff)" : undefined }}
          >
            <span className="w-[120px] shrink-0 truncate text-[length:var(--body-md-regular-size,14px)]" style={{ color: TITLE }} title={d.name}>{d.name}</span>
            <span className="flex h-[20px] flex-1 items-center">
              <span className="block h-[16px] rounded-[var(--radius-25,2px)]" style={{ width: `${(d.mins / max) * 100}%`, backgroundColor: isSel ? BRAND : DATAVIS[0], minWidth: 4 }} />
            </span>
            <span className="w-[64px] shrink-0 text-right text-[length:var(--body-sm-regular-size,12px)]" style={{ color: MUTED }}>{fmtInt(d.mins)} min</span>
            <span className="flex w-[84px] shrink-0 items-center justify-end gap-[3px]" aria-hidden>
              <Arrow size={12} weight="bold" color={fg} />
              <span className="text-[length:var(--body-sm-medium-size,12px)] font-medium" style={{ color: fg }}>Index {d.index}</span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ==================================================== F7 HEAT MAP ========== */

const BAND_TOKEN: Record<"Low" | "Medium" | "High", string> = {
  Low: "var(--datavis-qualitative-7, #e1e1e8)",
  Medium: "var(--datavis-qualitative-3, #a857e5)",
  High: "var(--datavis-qualitative-4, #7c33b5)",
};
const BAND_LETTER: Record<"Low" | "Medium" | "High", string> = { Low: "L", Medium: "M", High: "H" };

function HeatMap({ grid }: { grid: { day: string; part: string; value: number; band: "Low" | "Medium" | "High" }[][] }) {
  const [hover, setHover] = useState<{ d: number; p: number } | null>(null);
  return (
    <div className="flex flex-col gap-[var(--spacing-150,12px)]">
      <div className="overflow-x-auto">
        <div className="min-w-[560px]">
          {/* header row: dayparts */}
          <div className="flex">
            <div className="w-[52px] shrink-0" />
            {DAYPARTS.map((p) => (
              <div key={p} className="flex-1 px-[2px] text-center text-[length:var(--body-sm-regular-size,12px)]" style={{ color: AXIS_LABEL }}>{p}</div>
            ))}
          </div>
          {grid.map((row, di) => (
            <div key={DAYS[di]} className="flex items-center gap-[3px] py-[var(--spacing-25,2px)]">
              <div className="w-[52px] shrink-0 text-[length:var(--body-sm-regular-size,12px)]" style={{ color: AXIS_LABEL }}>{DAYS[di]}</div>
              {row.map((cell, pi) => {
                const active = hover?.d === di && hover?.p === pi;
                return (
                  <button
                    key={pi}
                    type="button"
                    onMouseEnter={() => setHover({ d: di, p: pi })}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover({ d: di, p: pi })}
                    onBlur={() => setHover(null)}
                    aria-label={`${cell.day} ${cell.part}: ${cell.band} consumption`}
                    className="relative flex h-[34px] flex-1 items-center justify-center rounded-[var(--radius-25,2px)] focus:outline-none focus-visible:ring-2"
                    style={{ backgroundColor: BAND_TOKEN[cell.band], boxShadow: active ? "inset 0 0 0 2px var(--surface-foreground-static-neutral-lvl1, #13131a)" : undefined }}
                  >
                    {/* Band letter — not colour alone (accessibility) */}
                    <span className="text-[length:var(--body-sm-medium-size,12px)] font-medium" style={{ color: cell.band === "Low" ? BODY2 : "var(--datavis-labels-adaptive, #ffffff)" }}>
                      {BAND_LETTER[cell.band]}
                    </span>
                    {active && (
                      <span
                        className="pointer-events-none absolute bottom-[38px] left-1/2 z-10 flex -translate-x-1/2 flex-col gap-[var(--spacing-25,2px)] whitespace-nowrap rounded-[var(--radius-50,4px)] px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)]"
                        style={{ backgroundColor: "var(--surface-background-lvl6, #282833)", boxShadow: CARD_SHADOW }}
                      >
                        <span className="text-[length:var(--body-sm-medium-size,12px)] font-medium" style={{ color: "var(--surface-foreground-static-neutral-inversed, #ffffff)" }}>{cell.day} · {cell.part}</span>
                        <span className="text-[length:var(--body-sm-regular-size,12px)]" style={{ color: "var(--surface-foreground-static-neutral-lvl4, #c6c6cc)" }}>{cell.band} consumption</span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Legend with labels (not colour alone) */}
      <div className="flex flex-wrap items-center gap-[var(--spacing-200,16px)]">
        {(["Low", "Medium", "High"] as const).map((b) => (
          <div key={b} className="flex items-center gap-[var(--spacing-75,6px)]">
            <span className="flex h-[16px] w-[16px] items-center justify-center rounded-[var(--radius-25,2px)] text-[10px] font-medium" style={{ backgroundColor: BAND_TOKEN[b], color: b === "Low" ? BODY2 : "var(--datavis-labels-adaptive, #ffffff)" }}>{BAND_LETTER[b]}</span>
            <span className="text-[length:var(--body-md-regular-size,14px)]" style={{ color: AXIS_LABEL }}>{b} consumption</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ==================================================== F8 PLATFORM SHARE ==== */

function PlatformShareBars({ data }: { data: { genre: string; shares: number[] }[] }) {
  const [hover, setHover] = useState<{ g: number; p: number } | null>(null);
  return (
    <div className="flex flex-col gap-[var(--spacing-200,16px)]">
      {/* Legend */}
      <div className="flex flex-wrap items-center gap-x-[var(--spacing-200,16px)] gap-y-[var(--spacing-75,6px)]">
        {PLATFORMS.map((p) => (
          <div key={p.name} className="flex items-center gap-[var(--spacing-75,6px)]">
            <span className="block h-[12px] w-[12px] rounded-[var(--radius-25,2px)]" style={{ backgroundColor: p.color }} />
            <span className="text-[length:var(--body-md-regular-size,14px)]" style={{ color: AXIS_LABEL }}>{p.name}</span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-[var(--spacing-150,12px)]">
        {data.map((row, gi) => (
          <div key={row.genre} className="flex items-center gap-[var(--spacing-150,12px)]">
            <span className="w-[120px] shrink-0 truncate text-[length:var(--body-md-regular-size,14px)]" style={{ color: TITLE }} title={row.genre}>{row.genre}</span>
            <div className="flex h-[28px] flex-1 overflow-hidden rounded-[var(--radius-50,4px)]" role="group" aria-label={`${row.genre} platform share`}>
              {row.shares.map((sh, pi) => (
                <button
                  key={pi}
                  type="button"
                  onMouseEnter={() => setHover({ g: gi, p: pi })}
                  onMouseLeave={() => setHover(null)}
                  onFocus={() => setHover({ g: gi, p: pi })}
                  onBlur={() => setHover(null)}
                  aria-label={`${PLATFORMS[pi].name}: ${sh.toFixed(1)}% of ${row.genre} viewing minutes`}
                  className="relative h-full focus:outline-none"
                  style={{ width: `${sh}%`, backgroundColor: PLATFORMS[pi].color, opacity: hover && (hover.g !== gi || hover.p !== pi) ? 0.6 : 1 }}
                >
                  {sh > 10 && (
                    <span className="text-[length:var(--body-sm-medium-size,12px)] font-medium" style={{ color: pi === 5 ? BODY2 : "var(--datavis-labels-adaptive, #ffffff)" }}>{sh.toFixed(0)}%</span>
                  )}
                  {hover?.g === gi && hover?.p === pi && (
                    <span
                      className="pointer-events-none absolute bottom-[32px] left-1/2 z-10 flex -translate-x-1/2 flex-col whitespace-nowrap rounded-[var(--radius-50,4px)] px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)]"
                      style={{ backgroundColor: "var(--surface-background-lvl6, #282833)", boxShadow: CARD_SHADOW }}
                    >
                      <span className="text-[length:var(--body-sm-medium-size,12px)] font-medium" style={{ color: "var(--surface-foreground-static-neutral-inversed, #ffffff)" }}>{PLATFORMS[pi].name}</span>
                      <span className="text-[length:var(--body-sm-regular-size,12px)]" style={{ color: "var(--surface-foreground-static-neutral-lvl4, #c6c6cc)" }}>{sh.toFixed(1)}% of {row.genre}</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
