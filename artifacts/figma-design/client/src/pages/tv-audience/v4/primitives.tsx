/* =========================================================================
 * TV Audience & Content Planner — V4 shared primitives
 *
 * Fiber Design System primitives for the V4 renderer. These mirror the
 * hand-rolled, token-driven approach used by the V2 dashboard
 * (client/src/pages/ds/TvAudienceDashboardPage.tsx) but live in their own
 * module so V4 is fully self-contained and V2 is never touched.
 *
 * All colours come from Fiber tokens via inline style var(--token, #fallback)
 * so the surface flips correctly under [data-theme="dark"]. No Tailwind
 * arbitrary var() colour classes; no JSX generic type args; no nested
 * interactive controls (rows that are buttons never contain other buttons).
 * ========================================================================= */

import { useEffect, useRef, useState } from "react";
import type { ReactNode, CSSProperties } from "react";
import {
  CaretDown,
  MagnifyingGlass,
  Check,
  ArrowUp,
  ArrowDown,
  Minus,
  X,
  Info,
} from "@phosphor-icons/react";

export const FONT = '"DM Sans", Helvetica';

/* Fiber data-vis qualitative palette (token-backed; auto-flips in dark). */
export const DATAVIS = [
  "var(--datavis-qualitative-4, #7c33b5)",
  "var(--datavis-qualitative-3, #a857e5)",
  "var(--datavis-qualitative-1, #fbbb3b)",
  "var(--datavis-qualitative-2, #ef8736)",
  "var(--datavis-qualitative-5, #ee4980)",
  "var(--datavis-qualitative-6, #d32f61)",
  "var(--datavis-qualitative-7, #e1e1e8)",
];

export const GRID = "var(--border-static-subtle-neutral, #e1e1e8)";
export const AXIS_LABEL =
  "var(--surface-foreground-dynamic-neutral-default-regular, #4b4b59)";
export const TITLE = "var(--surface-foreground-static-neutral-lvl1, #13131a)";
export const MUTED = "var(--surface-foreground-static-neutral-lvl3, #717180)";
export const BODY2 = "var(--surface-foreground-static-neutral-lvl2, #282833)";
export const BRAND = "var(--surface-foreground-dynamic-brand-default, #7c33b5)";
export const CARD_BG = "var(--surface-background-lvl1, #ffffff)";
export const SURFACE2 = "var(--surface-background-lvl2, #f7f7fa)";
export const SUCCESS_FG =
  "var(--container-static-success-subtle-foreground-variation, #115639)";
export const SUCCESS_BG =
  "var(--container-static-success-subtle-background, #e7faef)";
export const ERROR_FG = "var(--surface-foreground-static-error, #da294b)";
export const ERROR_BG =
  "var(--container-dynamic-error-subtle-background-selected, #ffedef)";

export const CARD_SHADOW =
  "0px 1px 4px 0px var(--shadow-lvl8, rgba(113,113,128,0.08)), 0px 8px 16px 0px var(--shadow-lvl4, rgba(113,113,128,0.04))";

/* Subtle neutral hover fill. Applied via inline style + local hover state,
 * because Tailwind arbitrary color classes like hover:bg-[var(--token)] don't
 * emit a valid utility and fail silently — inline style is the codebase norm. */
export const HOVER_BG =
  "var(--container-dynamic-neutral-subtle-background-hover, #71718014)";
export const SELECTED_BG =
  "var(--container-dynamic-brand-subtle-background-selected, #f6ebff)";

/* ---------------------------------------------------------------- utils ---- */

const nf = new Intl.NumberFormat("en-GB");
export const fmtInt = (n: number) => nf.format(Math.round(n));
export const fmtK = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(Math.round(n));
};

/* Deterministic pseudo-random so mock data changes stably per filter combo. */
export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return (h >>> 0) / 4294967295;
}
export function seeded(seed: string, min: number, max: number): number {
  return min + hashString(seed) * (max - min);
}

/* ------------------------------------------------------------ primitives --- */

export type Option = { value: string; label: string };

export function SmartCard({
  title,
  subtitle,
  right,
  children,
  ariaLabel,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <section
      aria-label={ariaLabel ?? title}
      data-annotate={ariaLabel ?? title}
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
        {right && (
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-[var(--spacing-100,8px)]">
            {right}
          </div>
        )}
      </div>
      <div
        className="h-0 w-full border-t border-solid"
        style={{ borderColor: GRID }}
      />
      <div className="p-[var(--spacing-200,16px)]">{children}</div>
    </section>
  );
}

/* Directional index indicator — text + arrow (never colour alone). */
export function IndexBadge({
  index,
  ariaPrefix = "Index",
}: {
  index: number | null;
  ariaPrefix?: string;
}) {
  if (index == null) return null;
  const up = index > 100;
  const flat = index === 100;
  const fg = flat ? MUTED : up ? SUCCESS_FG : ERROR_FG;
  const bg = flat
    ? "var(--surface-background-lvl3, #ebebf0)"
    : up
      ? SUCCESS_BG
      : ERROR_BG;
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

/* Skeleton loader block (per-chart loading state). */
export function Skeleton({ height = 240 }: { height?: number }) {
  return (
    <div
      className="flex w-full flex-col gap-[var(--spacing-150,12px)]"
      aria-busy="true"
      aria-label="Loading data"
    >
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
        style={{
          height,
          backgroundColor: "var(--surface-background-lvl3, #ebebf0)",
        }}
      />
    </div>
  );
}

/* Empty / partial state — shown when cross-filters produce no data. */
export function EmptyState({
  height = 240,
  title = "No data available",
  message = "No data available for this audience selection — adjust filters.",
}: {
  height?: number;
  title?: string;
  message?: string;
}) {
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
          {title}
        </p>
        <p
          className="max-w-[320px] text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)]"
          style={{ fontFamily: FONT, color: MUTED }}
        >
          {message}
        </p>
      </div>
    </div>
  );
}

/* Card body switch: skeleton > empty > chart. */
export function CardBody({
  loading,
  empty,
  height = 240,
  emptyTitle,
  emptyMessage,
  children,
}: {
  loading: boolean;
  empty: boolean;
  height?: number;
  emptyTitle?: string;
  emptyMessage?: string;
  children: ReactNode;
}) {
  if (loading) return <Skeleton height={height} />;
  if (empty)
    return (
      <EmptyState height={height} title={emptyTitle} message={emptyMessage} />
    );
  return <>{children}</>;
}

/* --------------------------------------------------------- Fiber Toggle ---- */

export function Toggle({
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
        style={{
          backgroundColor: "var(--surface-background-lvl1, #ffffff)",
          boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );
}

/* -------------------------------------------------------------- Chip ------- */

export function Chip({
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
  const style: CSSProperties = selected
    ? {
        backgroundColor:
          "var(--container-dynamic-brand-subtle-background-selected, #f6ebff)",
        border: "1px solid var(--border-dynamic-brand-selected, #7c33b5)",
        color: BRAND,
      }
    : {
        backgroundColor:
          "var(--container-dynamic-neutral-subtle-background-default-regular, #ffffff)",
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
  // buttons). It becomes a span holding the label plus a single remove button.
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

/* ---------------------------------------------- Segmented pills (row) ------ */

export function SegmentedPills({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  ariaLabel: string;
}) {
  return (
    <div
      className="inline-flex items-center gap-[2px] rounded-[var(--spacing-mega,40px)] p-[2px]"
      role="group"
      aria-label={ariaLabel}
      style={{ backgroundColor: SURFACE2, border: `1px solid ${GRID}` }}
    >
      {options.map((o) => {
        const sel = o === value;
        return (
          <button
            key={o}
            type="button"
            onClick={() => onChange(o)}
            aria-pressed={sel}
            className="rounded-[var(--spacing-mega,40px)] px-[var(--spacing-100,8px)] py-[3px] text-[length:var(--body-sm-medium-size,12px)] font-medium transition-colors focus:outline-none focus-visible:ring-2"
            style={{
              backgroundColor: sel
                ? "var(--container-dynamic-brand-bold-background-default, #7c33b5)"
                : "transparent",
              color: sel
                ? "var(--container-static-brand-bold-foreground, #ffffff)"
                : BODY2,
            }}
          >
            {o}
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------ Tabs Bar — rounded ------ */
/* Fiber DS "Tabs Bar — rounded" (pill tabs). Mirrors ds/TabsPage TabPill /
 * InteractiveRoundedTabs exactly (tokens + geometry). Same value/options API as
 * SegmentedPills so it is a drop-in for the env / TV-type toggles. */

export function TabsBarRounded({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  ariaLabel: string;
}) {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <div
      className="inline-flex flex-wrap items-center gap-1 rounded-[24px] p-0.5"
      role="group"
      aria-label={ariaLabel}
      style={{
        backgroundColor:
          "var(--container-dynamic-neutral-subtle-background-hover, rgba(113,113,128,0.08))",
      }}
    >
      {options.map((o) => {
        const sel = o === value;
        const hovered = o === hover;
        const bg = sel
          ? "var(--container-dynamic-brand-subtle-background-selected, #f6ebff)"
          : hovered
            ? "var(--container-dynamic-neutral-subtle-background-hover, rgba(113,113,128,0.08))"
            : "transparent";
        const color = sel
          ? "var(--surface-foreground-dynamic-brand-default, #7c33b5)"
          : hovered
            ? "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)"
            : "var(--surface-foreground-dynamic-neutral-default-regular, #4b4b59)";
        return (
          <button
            key={o}
            type="button"
            role="tab"
            aria-selected={sel}
            onClick={() => onChange(o)}
            onMouseEnter={() => setHover(o)}
            onMouseLeave={() => setHover(null)}
            className="flex h-[30px] items-center rounded-[20px] px-4 py-[5px] outline-none transition-colors duration-150 focus-visible:ring-2"
            style={{ backgroundColor: bg }}
          >
            <span
              className="whitespace-nowrap text-[length:var(--body-md-regular-size,14px)] font-normal leading-[var(--body-md-regular-line-height,20px)]"
              style={{ fontFamily: FONT, color }}
            >
              {o}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------ Tabs Bar — underline ---- */
/* Fiber DS "Tabs Bar — underline". Mirrors ds/TabsPage TabItem /
 * InteractiveUnderlineTabs (tokens + geometry). Same API as SegmentedPills. */

export function TabsBarUnderline({
  options,
  value,
  onChange,
  ariaLabel,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  ariaLabel: string;
}) {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <div className="flex flex-wrap" role="group" aria-label={ariaLabel}>
      {options.map((o) => {
        const sel = o === value;
        const hovered = o === hover;
        const color = sel
          ? hovered
            ? "var(--surface-foreground-dynamic-brand-hover, #662994)"
            : "var(--surface-foreground-dynamic-brand-default, #7c33b5)"
          : "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)";
        const line = sel
          ? hovered
            ? "var(--border-dynamic-brand-hover, #662994)"
            : "var(--border-dynamic-brand-selected, #7c33b5)"
          : "var(--border-static-subtle-neutral, #e1e1e8)";
        const bg =
          hovered
            ? "var(--container-dynamic-neutral-subtle-background-hover, rgba(113,113,128,0.08))"
            : "transparent";
        return (
          <button
            key={o}
            type="button"
            role="tab"
            aria-selected={sel}
            onClick={() => onChange(o)}
            onMouseEnter={() => setHover(o)}
            onMouseLeave={() => setHover(null)}
            className="flex flex-col items-start gap-2 bg-transparent p-0 outline-none transition-colors duration-150 focus-visible:ring-2"
            style={{ backgroundColor: bg }}
          >
            <span className="flex items-center gap-2.5 px-4">
              <span
                className="whitespace-nowrap text-[length:var(--body-md-regular-size,14px)] font-normal leading-[var(--body-md-regular-line-height,20px)]"
                style={{ fontFamily: FONT, color }}
              >
                {o}
              </span>
            </span>
            <span
              className="h-0 w-full border-t transition-colors duration-150"
              style={{ borderColor: line }}
            />
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------ Alert (Info state) ------ */
/* Fiber DS Alert — Info state, title-only variant (no description, no close),
 * mirrors ds/NotificationPage Alert (bordered, Info tokens). */

export function AlertInfo({ title }: { title: string }) {
  return (
    <div
      role="status"
      className="flex flex-col items-start px-3 py-[7px]"
      style={{
        border:
          "1px solid var(--border-dynamic-info-selected, #2360db)",
        borderRadius: "var(--radius-25, 2px)",
        backgroundColor: "var(--surface-background-lvl1, #ffffff)",
      }}
    >
      <div className="flex w-full items-center gap-2">
        <span className="flex size-5 shrink-0 items-center justify-center">
          <Info
            size={20}
            weight="fill"
            color="var(--border-dynamic-info-selected, #2360db)"
            aria-hidden
          />
        </span>
        <span
          className="min-w-0 flex-1 font-medium text-[length:var(--body-md-medium-size,14px)] leading-[var(--body-md-medium-line-height,20px)]"
          style={{
            fontFamily: FONT,
            color:
              "var(--surface-foreground-static-neutral-lvl1, #13131a)",
          }}
        >
          {title}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------ Searchable Dropdown ------ */

type SearchableDropdownCommonProps = {
  id: string;
  label: string;
  options: Option[];
  disabled?: boolean;
  compact?: boolean;
  align?: "left" | "right";
  /** Stretch to the width supplied by a responsive grid/flex parent. */
  fullWidth?: boolean;
};

type SearchableDropdownProps =
  | (SearchableDropdownCommonProps & {
      multiple?: false;
      value: string;
      onChange: (v: string) => void;
    })
  | (SearchableDropdownCommonProps & {
      multiple: true;
      /** Empty means the inclusive "All" option. */
      value: string[];
      onChange: (v: string[]) => void;
    });

export function SearchableDropdown({
  id,
  label,
  value,
  options,
  onChange,
  disabled = false,
  compact = false,
  align = "left",
  fullWidth = false,
  multiple = false,
}: SearchableDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [hovered, setHovered] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const selectedValues: string[] = multiple ? (value as string[]) : [];
  const onMultiChange = onChange as (v: string[]) => void;
  const onSingleChange = onChange as (v: string) => void;
  const selected = multiple
    ? selectedValues.length === 1
      ? options.find((o) => o.value === selectedValues[0])
      : undefined
    : options.find((o) => o.value === value);
  const allOption = options.find((o) => o.value === "all");
  const triggerText = multiple
    ? selectedValues.length === 0
      ? allOption?.label ?? "All"
      : selectedValues.length === 1
        ? selected?.label ?? "1 selected"
        : `${selectedValues.length} selected`
    : selected?.label ?? "Select…";

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div
      ref={ref}
      data-annotate={`${label} filter`}
      className={`relative flex flex-col gap-[var(--spacing-50,4px)] ${
        fullWidth
          ? "min-w-[140px] flex-[1_1_150px]"
          : compact
            ? "min-w-[112px]"
            : "min-w-[160px]"
      }`}
    >
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
        aria-label={multiple ? `${label}: ${triggerText}` : undefined}
        disabled={disabled}
        onClick={() => {
          setOpen((o) => !o);
          setQuery("");
        }}
        className={`flex items-center justify-between rounded-[var(--radius-50,4px)] disabled:opacity-50 ${
          compact
            ? "h-[28px] gap-[var(--spacing-75,6px)] px-[var(--spacing-75,6px)]"
            : "h-[36px] gap-[var(--spacing-100,8px)] px-[var(--spacing-100,8px)]"
        }`}
        style={{
          backgroundColor:
            "var(--container-dynamic-neutral-subtle-background-default-regular, #ffffff)",
          border: "1px solid var(--border-dynamic-neutral-subtle-default, #c6c6cc)",
        }}
      >
        <span
          className={`truncate ${
            compact
              ? "text-[length:var(--body-sm-regular-size,12px)] leading-[var(--body-sm-regular-line-height,18px)]"
              : "text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)]"
          }`}
          style={{ fontFamily: FONT, color: selected ? TITLE : MUTED }}
        >
          {triggerText}
        </span>
        <CaretDown size={compact ? 14 : 16} color={AXIS_LABEL} aria-hidden />
      </button>

      {open && !disabled && (
        <div
          className={`absolute z-50 flex w-full min-w-[220px] flex-col overflow-hidden rounded-[var(--radius-50,4px)] ${
            align === "right" ? "right-0" : "left-0"
          } ${
            compact && !label ? "top-[32px]" : "top-[64px]"
          }`}
          style={{
            backgroundColor: CARD_BG,
            border: `1px solid ${GRID}`,
            boxShadow: CARD_SHADOW,
          }}
        >
          <div
            className="flex items-center gap-[var(--spacing-75,6px)] border-b border-solid px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)]"
            style={{ borderColor: GRID }}
          >
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
          <ul
            role="listbox"
            aria-label={label}
            aria-multiselectable={multiple || undefined}
            className="max-h-[220px] overflow-y-auto"
          >
            {filtered.length === 0 && (
              <li
                className="px-[var(--spacing-100,8px)] py-[var(--spacing-100,8px)] text-[length:var(--body-md-regular-size,14px)]"
                style={{ fontFamily: FONT, color: MUTED }}
              >
                No matches
              </li>
            )}
            {filtered.map((o) => {
              const isSel = multiple
                ? o.value === "all"
                  ? selectedValues.length === 0
                  : selectedValues.includes(o.value)
                : o.value === value;
              return (
                <li key={o.value} role="option" aria-selected={isSel}>
                  <button
                    type="button"
                    onClick={() => {
                      if (multiple) {
                        if (o.value === "all") {
                          onMultiChange([]);
                        } else {
                          onMultiChange(
                            isSel
                              ? selectedValues.filter((item) => item !== o.value)
                              : [...selectedValues, o.value],
                          );
                        }
                      } else {
                        onSingleChange(o.value);
                        setOpen(false);
                      }
                    }}
                    onMouseEnter={() => setHovered(o.value)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(o.value)}
                    onBlur={() => setHovered(null)}
                    className="flex w-full items-center gap-[var(--spacing-100,8px)] border-b border-solid px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)] text-left transition-colors focus:outline-none"
                    style={{
                      borderColor: GRID,
                      backgroundColor:
                        hovered === o.value ? HOVER_BG : "transparent",
                    }}
                  >
                    {multiple && (
                      <span
                        className="flex size-[16px] shrink-0 items-center justify-center rounded-[var(--radius-25,2px)]"
                        style={{
                          backgroundColor: isSel
                            ? "var(--controls-background-selected, #7c33b5)"
                            : "transparent",
                          border: isSel
                            ? "1.5px solid transparent"
                            : "1.5px solid var(--border-dynamic-neutral-subtle-default, #c6c6cc)",
                        }}
                        aria-hidden
                      >
                        {isSel && <Check size={12} color="var(--surface-foreground-static-neutral-inversed, #ffffff)" weight="bold" />}
                      </span>
                    )}
                    <span
                      className="min-w-0 flex-1 text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)]"
                      style={{ fontFamily: FONT, color: isSel ? BRAND : TITLE }}
                    >
                      {o.label}
                    </span>
                    {!multiple && isSel && (
                      <Check size={16} color={BRAND} weight="bold" aria-hidden />
                    )}
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

/* --------------------------------------------------- Section heading ------- */

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  children?: ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-[var(--spacing-150,12px)]">
      <div className="flex flex-col gap-[var(--spacing-25,2px)]">
        {eyebrow && (
          <span
            className="text-[length:var(--body-sm-medium-size,12px)] font-semibold uppercase tracking-[0.06em]"
            style={{ color: BRAND }}
          >
            {eyebrow}
          </span>
        )}
        <h3
          className="text-[length:var(--headline-xs-medium-size,16px)] font-semibold leading-[var(--headline-xs-medium-line-height,24px)] tracking-[-0.08px]"
          style={{ color: TITLE }}
        >
          {title}
        </h3>
        {subtitle && (
          <p
            className="text-[length:var(--body-sm-regular-size,12px)] leading-[var(--body-sm-regular-line-height,18px)]"
            style={{ color: MUTED }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

/* -------------------------------------------- Journey band divider --------- */

export function JourneyBand({
  step,
  title,
  description,
}: {
  step: string;
  title: string;
  description: string;
}) {
  return (
    <div
      className="flex flex-col gap-[var(--spacing-50,4px)] rounded-[var(--radius-50,4px)] border-l-[3px] border-solid px-[var(--spacing-200,16px)] py-[var(--spacing-150,12px)]"
      style={{
        backgroundColor:
          "var(--container-dynamic-brand-subtle-background-default, #f6ebff)",
        borderColor: "var(--border-dynamic-brand-selected, #7c33b5)",
      }}
    >
      <div className="flex items-center gap-[var(--spacing-100,8px)]">
        <span
          className="inline-flex items-center rounded-[var(--spacing-mega,40px)] px-[var(--spacing-100,8px)] py-[1px] text-[length:var(--body-sm-medium-size,12px)] font-semibold uppercase tracking-[0.08em]"
          style={{
            backgroundColor:
              "var(--container-dynamic-brand-bold-background-default, #7c33b5)",
            color: "var(--container-static-brand-bold-foreground, #ffffff)",
          }}
        >
          {step}
        </span>
        <span
          className="text-[length:var(--headline-xs-medium-size,16px)] font-semibold"
          style={{ color: "var(--surface-foreground-dynamic-brand-default, #7c33b5)" }}
        >
          {title}
        </span>
      </div>
      <p
        className="text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)]"
        style={{ color: BODY2 }}
      >
        {description}
      </p>
    </div>
  );
}
