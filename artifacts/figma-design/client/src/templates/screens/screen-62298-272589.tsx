/* =========================================================================
 * Screen Template — Intelligence Patient Hub (62298-272589)
 *
 * LIVE front-end reproduction of the Figma reference at
 * design-refs/screen-templates/code/62298-272589.txt.
 *
 * Fixed natural width 1280px, light-mode. Composes the shared MIQ chrome
 * (TemplateNavigation) at the top — this screen has NO footer. The body
 * reproduces the "OMC Healthcare Hub" Intelligence / Patient hub view:
 * page header, info notification, view tabs, a filter row and four Smart
 * Cards (Patient insights, Temporal trends, Competitive landscape,
 * Geographic insights).
 *
 * Chart/map compositions that were exported from Figma as SVG use the
 * localized asset files; all real UI controls (tabs, badges, dropdowns,
 * buttons) are built as JSX matching the design tokens.
 * ========================================================================= */

import { type CSSProperties, type ReactNode } from "react";
import { TemplateNavigation } from "@/templates/chrome";

/* ----------------------------------------------------------------------- */
/* Assets (localized from the Figma reference)                             */
/* ----------------------------------------------------------------------- */
const A = `${import.meta.env.BASE_URL}figmaAssets/screen-templates/62298-272589/`;
const imgVectorFrameInfo = `${A}8c5c9958-1d58-40ff-a5b5-1c56cd26529d.svg`; // info icon
const imgCaret = `${A}f50cb1ba-e99a-4c4c-9030-8ed10ce89278.svg`; // dropdown caret
const imgCaretDown = `${A}334521a8-2d7e-4110-8e1d-c13df4765190.svg`; // button caret down
const imgExpand = `${A}6e56097e-5d1c-48d8-bc79-dc2c79150d90.svg`; // expand icon
const imgLineContainer = `${A}63d45df5-12f8-490c-a275-a226e4131c30.svg`;
const imgLineContainer1 = `${A}2e29dd28-82db-4571-b8f3-5a416833c403.svg`;
const imgLineContainer2 = `${A}46de757e-2e34-4504-8215-62fca3aab9b4.svg`;
// Temporal trends line chart pieces
const imgLine25 = `${A}a01bb600-08d4-4afa-b2c5-0ee2a749e240.svg`;
const imgLineA = `${A}2e674698-afc3-419f-83bf-45704853cad4.svg`;
const imgLineB = `${A}1154ec41-048d-4d89-8b5b-6e89892c79dc.svg`;
const imgLineC = `${A}44a86b7e-66dd-4f17-bec0-a3aa4d34be26.svg`;
const imgLineD = `${A}d9069503-19ed-4287-9b1f-c024f203ae8e.svg`;
// Geographic map
const imgMapUs = `${A}b4e888b0-7216-44dc-8202-38d00ec1d6e9.svg`;

/* ----------------------------------------------------------------------- */
/* Design tokens (var(--token, #hexFallback))                              */
/* ----------------------------------------------------------------------- */
const C = {
  bgLvl2: "var(--surface-background-lvl2,#f7f7fa)",
  bgLvl1: "var(--surface-background-lvl1,#ffffff)",
  fgLvl1: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
  fgLvl3: "var(--surface-foreground-static-neutral-lvl3,#717180)",
  fgRegular: "var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)",
  fgDisabled: "var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)",
  info: "var(--surface-foreground-static-info,#2360db)",
  borderSubtle: "var(--border-dynamic-neutral-subtle-default,#c6c6cc)",
  borderStaticSubtle: "var(--border-static-subtle-neutral,#e1e1e8)",
  borderBold: "var(--border-dynamic-neutral-bold-default,#4b4b59)",
  tabsBg: "var(--container-dynamic-neutral-subtle-background-default-variation,#ebebf0)",
  tabActiveBg: "var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)",
  tabActiveFg: "var(--container-dynamic-brand-subtle-foreground-delected,#7c33b5)",
  tabInactiveFg: "var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)",
  success: "var(--surface-foreground-static-success,#1e8158)",
  errBg: "var(--container-static-error-sutble-background,#ffebf1)",
  errFg: "var(--container-static-error-sutble-foreground-variation,#ad102c)",
  okBg: "var(--container-static-success-subtle-background,#e7faef)",
  okFg: "var(--container-static-success-subtle-foreground-variation,#115639)",
  badgeNeutralBg: "var(--container-static-neutral-subtle-background,#ebebf0)",
  badgeNeutralFg: "var(--container-static-neutral-subtle-foreground,#4b4b59)",
  brandSubtleFg: "var(--container-static-brand-subtle-foreground-regular,#411661)",
  qual1: "var(--datavis-qualitative-1,#fbbb3b)",
  qual3: "var(--datavis-qualitative-3,#a857e5)",
  qual5: "var(--datavis-qualitative-5,#ee4980)",
  qual7: "var(--datavis-qualitative-7,#e1e1e8)",
  seqMax: "var(--datavis-sequential-max,#411661)",
  seq5: "var(--datavis-sequential-5,#662994)",
  seq4: "var(--datavis-sequential-4,#7c33b5)",
  seq3: "var(--datavis-sequential-3,#a857e5)",
  seq2: "var(--datavis-sequential-2,#d194ff)",
  // Series / funnel / sankey colors
  purple: "var(--datavis-sequential-4,#7c33b5)",
  orange: "var(--datavis-qualitative-2,#f5871f)",
  pink: "var(--datavis-qualitative-5,#ee4980)",
  crimson: "var(--datavis-qualitative-6,#d21e56)",
  track: "var(--datavis-qualitative-7,#e1e1e8)",
  link: "var(--surface-foreground-static-info,#2360db)",
  tableBorder: "var(--border-static-subtle-neutral,#e1e1e8)",
  tableHeadFg: "var(--surface-foreground-static-neutral-lvl3,#717180)",
};

const FONT = '"DM Sans", sans-serif';

/* ----------------------------------------------------------------------- */
/* Small reusable sub-components                                           */
/* ----------------------------------------------------------------------- */

/** A pill-styled segmented tab group (static, read-only). */
function PillTabs({
  tabs,
  activeIndex = 0,
  className,
  fullWidth,
}: {
  tabs: string[];
  activeIndex?: number;
  className?: string;
  fullWidth?: boolean;
}) {
  return (
    <div
      role="tablist"
      className={`flex h-[34px] items-center rounded-[100px] p-[2px] ${
        fullWidth ? "w-full justify-center" : ""
      } ${className ?? ""}`}
      style={{ backgroundColor: C.tabsBg }}
    >
      {tabs.map((label, i) => {
        const active = i === activeIndex;
        return (
          <div
            key={label}
            role="tab"
            aria-selected={active}
            className="flex h-[30px] items-center rounded-[20px] px-[16px] py-[5px]"
            style={{
              backgroundColor: active ? C.tabActiveBg : "transparent",
            }}
          >
            <span
              className="whitespace-nowrap text-[14px] leading-[20px]"
              style={{ color: active ? C.tabActiveFg : C.tabInactiveFg }}
            >
              {label}
            </span>
          </div>
        );
      })}
    </div>
  );
}

/** A closed dropdown control (static). */
function Dropdown({
  value,
  className,
  height = 34,
  fontSize = 14,
}: {
  value: string;
  className?: string;
  height?: number;
  fontSize?: number;
}) {
  return (
    <div
      className={`flex flex-col items-start justify-center rounded-[2px] border border-solid ${className ?? ""}`}
      style={{ backgroundColor: C.bgLvl1, borderColor: C.borderSubtle }}
    >
      <div
        className="flex w-full items-center justify-end gap-[8px] pl-[12px] pr-[6px]"
        style={{ height }}
      >
        <span
          className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
          style={{ color: C.fgRegular, fontSize, lineHeight: `${fontSize + 6}px` }}
        >
          {value}
        </span>
        <span className="flex size-[20px] items-center justify-center">
          <img alt="" aria-hidden="true" src={imgCaret} className="size-[20px]" />
        </span>
      </div>
    </div>
  );
}

/** Rounded (pill) badge — outlined or filled. */
function RoundedBadge({
  label,
  borderColor,
  fill,
  textColor,
}: {
  label: string;
  borderColor?: string;
  fill?: string;
  textColor: string;
}) {
  return (
    <div
      className="flex h-[18px] items-center justify-center gap-[4px] rounded-[100px] px-[8px] py-[2px]"
      style={{
        backgroundColor: fill ?? "transparent",
        border: borderColor ? `1px solid ${borderColor}` : undefined,
      }}
    >
      <span
        className="whitespace-nowrap text-center text-[12px] font-medium leading-[18px]"
        style={{ color: textColor }}
      >
        {label}
      </span>
    </div>
  );
}

/** Standard (rectangular) delta badge. */
function DeltaBadge({ label, positive }: { label: string; positive: boolean }) {
  return (
    <div
      className="flex h-[18px] items-center justify-center gap-[2px] rounded-[2px] px-[3px]"
      style={{ backgroundColor: positive ? C.okBg : C.errBg }}
    >
      <span
        className="whitespace-nowrap text-center text-[12px] font-medium leading-[18px]"
        style={{ color: positive ? C.okFg : C.errFg }}
      >
        {label}
      </span>
    </div>
  );
}

/** KPI metric tile with an optional delta badge. */
function MetricTile({
  label,
  value,
  delta,
  valueColor,
}: {
  label: string;
  value: string;
  delta?: { label: string; positive: boolean };
  valueColor?: string;
}) {
  return (
    <div
      className="flex min-w-[140px] flex-1 items-center gap-[6px] rounded-[2px] border border-solid p-[16px]"
      style={{ backgroundColor: C.bgLvl1, borderColor: C.borderSubtle }}
    >
      <div className="flex flex-col items-start gap-[6px]">
        <p
          className="whitespace-nowrap text-center text-[12px] leading-[18px]"
          style={{ color: C.fgLvl3 }}
        >
          {label}
        </p>
        <p
          className="whitespace-nowrap text-center text-[20px] font-semibold leading-[28px]"
          style={{ color: valueColor ?? C.fgLvl1, letterSpacing: "-0.2px" }}
        >
          {value}
        </p>
        {delta && (
          <div className="flex items-center gap-[8px]">
            <DeltaBadge label={delta.label} positive={delta.positive} />
          </div>
        )}
      </div>
    </div>
  );
}

/** Outlined "Button 2.0" with a trailing caret. */
function CaretButton({
  label,
  color = C.fgRegular,
  outlined = true,
  compact,
}: {
  label: string;
  color?: string;
  outlined?: boolean;
  compact?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-center rounded-[2px] ${
        compact ? "px-[6px] py-[2px]" : "px-[12px] py-[7px]"
      }`}
      style={
        outlined
          ? { border: `1px solid ${C.borderBold}` }
          : undefined
      }
    >
      <div className="flex items-center justify-center gap-[4px]">
        <span
          className="whitespace-nowrap text-center text-[14px] font-medium leading-[20px]"
          style={{ color }}
        >
          {label}
        </span>
        <span className="flex size-[20px] items-center justify-center">
          <img alt="" aria-hidden="true" src={imgCaretDown} className="size-[20px]" />
        </span>
      </div>
    </div>
  );
}

/** Smart Card shell: bordered white card with a header + divider. */
function SmartCard({
  title,
  headerRight,
  lineImg = imgLineContainer,
  children,
  className,
  style,
}: {
  title: string;
  headerRight?: ReactNode;
  lineImg?: string;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      className={`relative flex items-start overflow-hidden rounded-[2px] ${className ?? ""}`}
      style={{
        backgroundColor: C.bgLvl1,
        boxShadow:
          "0px 1px 4px 0px rgba(113,113,128,0.08), 0px 8px 16px 0px rgba(113,113,128,0.04)",
        ...style,
      }}
    >
      <div className="flex min-w-0 flex-1 flex-col items-start">
        {/* Header */}
        <div className="flex w-full items-start">
          <div className="flex min-w-0 flex-1 flex-col items-start">
            <div className="flex w-full items-center gap-[8px] p-[16px]">
              <div className="flex min-w-0 flex-1 items-center gap-[8px] pr-[10px]">
                <p
                  className="whitespace-nowrap text-[16px] font-medium leading-[24px]"
                  style={{ color: C.fgLvl1, letterSpacing: "-0.08px" }}
                >
                  {title}
                </p>
              </div>
              {headerRight}
            </div>
            <div className="relative h-0 w-full">
              <img
                alt=""
                aria-hidden="true"
                className="absolute inset-x-0 top-[-1px] block w-full"
                src={lineImg}
              />
            </div>
          </div>
        </div>
        {/* Content */}
        <div className="flex w-full flex-col items-start gap-[8px] p-[16px]">
          {children}
        </div>
      </div>
    </div>
  );
}

/* Competitor filter badge row shared by Temporal / Competitive cards. */
function CompetitorBadges() {
  return (
    <div className="flex w-[337px] items-center gap-[8px]">
      <RoundedBadge label="COPD" fill={C.badgeNeutralBg} textColor={C.badgeNeutralFg} />
      <RoundedBadge label="Ozempic" borderColor={C.qual1} textColor={C.brandSubtleFg} />
      <RoundedBadge label="Breztri" borderColor={C.qual3} textColor={C.brandSubtleFg} />
      <RoundedBadge label="Victoza" borderColor={C.qual5} textColor={C.brandSubtleFg} />
    </div>
  );
}

/* Horizontal bar row used in the geographic age-distribution chart. */
function BarRow({ segments, value }: { segments: string[]; value: string }) {
  return (
    <div className="flex w-full items-center gap-[8px]">
      <div className="flex min-w-0 flex-1 items-center">
        {segments.map((color, i) => (
          <div
            key={i}
            className="h-[10px] min-w-0 flex-1"
            style={{ backgroundColor: color }}
          />
        ))}
      </div>
      <p
        className="w-[25px] overflow-hidden text-ellipsis whitespace-nowrap text-right text-[12px] font-light leading-[18px]"
        style={{ color: C.fgLvl1 }}
      >
        {value}
      </p>
    </div>
  );
}

/** Small outlined download/expand icon button used in card headers. */
function ExpandButton() {
  return (
    <div
      className="flex items-center justify-center rounded-[2px] border border-solid p-[2px]"
      style={{ borderColor: C.borderBold }}
    >
      <span className="flex size-[20px] items-center justify-center p-[2px]">
        <img
          alt=""
          aria-hidden="true"
          src={imgExpand}
          className="h-[15.625px] w-[17.5px]"
        />
      </span>
    </div>
  );
}

/** Outlined info chip (icon + label) used to caption sections. */
function InfoChip({ label }: { label: string }) {
  return (
    <div
      className="flex items-center gap-[8px] rounded-[2px] border border-solid px-[12px] py-[7px]"
      style={{ borderColor: C.info }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
        <circle cx="8" cy="8" r="7" stroke={C.info} strokeWidth="1.2" />
        <circle cx="8" cy="4.7" r="0.9" fill={C.info} />
        <rect x="7.3" y="6.8" width="1.4" height="5" rx="0.7" fill={C.info} />
      </svg>
      <span className="text-[14px] leading-[20px]" style={{ color: C.info }}>
        {label}
      </span>
    </div>
  );
}

/** Legend dot + label. */
function LegendItem({ color, label }: { color: string; label: string }) {
  return (
    <div className="flex items-center gap-[6px]">
      <span className="size-[12px] rounded-full" style={{ backgroundColor: color }} />
      <span className="whitespace-nowrap text-[14px] leading-[20px]" style={{ color: C.fgLvl1 }}>
        {label}
      </span>
    </div>
  );
}

/** A single funnel progress bar: value (left) + filled track + % (right). */
function FunnelBar({
  value,
  pct,
  color,
}: {
  value: string;
  pct: number;
  color: string;
}) {
  return (
    <div className="flex w-full flex-col gap-[4px]">
      <div className="flex w-full items-center justify-between">
        <span className="text-[12px] leading-[18px]" style={{ color: C.fgLvl3 }}>
          {value}
        </span>
        <span className="text-[12px] leading-[18px]" style={{ color: C.fgLvl3 }}>
          {pct}%
        </span>
      </div>
      <div className="h-[8px] w-full overflow-hidden rounded-[4px]" style={{ backgroundColor: C.track }}>
        <div className="h-full rounded-[4px]" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

/** A funnel stage: heading, 1-3 bars, drop-off badge + note. */
function FunnelStage({
  title,
  bars,
  drop,
  note,
  footer,
}: {
  title: string;
  bars: { value: string; pct: number; color: string }[];
  drop?: string;
  note?: string;
  footer?: ReactNode;
}) {
  return (
    <div className="flex min-w-[420px] flex-1 flex-col gap-[10px]">
      <p className="text-[14px] font-medium leading-[20px]" style={{ color: C.fgLvl1 }}>
        {title}
      </p>
      <div className="flex w-full flex-col gap-[10px]">
        {bars.map((b, i) => (
          <FunnelBar key={i} value={b.value} pct={b.pct} color={b.color} />
        ))}
      </div>
      {footer}
      {(drop || note) && (
        <div className="flex items-center gap-[8px] pt-[2px]">
          {drop && (
            <span className="text-[12px] font-medium leading-[18px]" style={{ color: C.errFg }}>
              {drop}
            </span>
          )}
          {note && (
            <span
              className="rounded-[2px] border border-solid px-[6px] py-[2px] text-[12px] leading-[18px]"
              style={{ borderColor: C.borderSubtle, color: C.fgLvl1 }}
            >
              {note}
            </span>
          )}
        </div>
      )}
    </div>
  );
}

/** Faithful lightweight inline-SVG Sankey approximation. */
function SankeyDiagram() {
  const left = [
    { label: "Breztri", kept: "91.5% kept", sw: "8.5% switched", color: C.purple, y: 20, h: 46 },
    { label: "Nucala", kept: "89.8% kept", sw: "10.2% switched", color: C.crimson, y: 92, h: 60 },
    { label: "Trelegy Ellipta", kept: "91.7% kept", sw: "8.3% switched", color: C.orange, y: 176, h: 78 },
  ];
  const right = [
    { label: "Breztri", sw: "9.3% switched in", color: C.purple, y: 26, h: 44 },
    { label: "Trelegy Ellipta", sw: "9.0% switched in", color: C.crimson, y: 96, h: 52 },
    { label: "Trelegy Ellipta", sw: "8.7% switched in", color: C.orange, y: 168, h: 82 },
  ];
  // Flow ribbons: [srcIndex, dstIndex, color, opacity, srcY, dstY, thickness]
  const flows: [number, number, string, number][] = [
    [0, 0, C.purple, 0.35],
    [0, 2, C.purple, 0.28],
    [1, 1, C.crimson, 0.32],
    [1, 2, C.crimson, 0.25],
    [2, 2, C.orange, 0.38],
    [2, 0, C.orange, 0.3],
  ];
  const X0 = 178;
  const X1 = 852;
  const nodeW = 8;
  const ribbon = (sy: number, sh: number, dy: number, dh: number) => {
    const sTop = sy;
    const sBot = sy + sh;
    const dTop = dy;
    const dBot = dy + dh;
    const cx = (X0 + nodeW + X1) / 2;
    return `M${X0 + nodeW},${sTop} C${cx},${sTop} ${cx},${dTop} ${X1},${dTop} L${X1},${dBot} C${cx},${dBot} ${cx},${sBot} ${X0 + nodeW},${sBot} Z`;
  };
  return (
    <div className="relative w-full" style={{ height: 270 }}>
      {/* From / To labels */}
      <span
        className="absolute text-[12px] leading-[18px]"
        style={{ left: X0, top: 0, color: C.fgLvl3 }}
      >
        From
      </span>
      <span
        className="absolute text-[12px] leading-[18px]"
        style={{ left: X1, top: 0, color: C.fgLvl3 }}
      >
        To
      </span>
      <svg
        className="absolute inset-0"
        width="100%"
        height="270"
        viewBox="0 0 1040 270"
        preserveAspectRatio="none"
        aria-label="Treatment switching Sankey diagram"
      >
        {flows.map(([s, d, color, op], i) => {
          const sNode = left[s];
          const dNode = right[d];
          const sh = sNode.h * 0.4;
          const dh = dNode.h * 0.4;
          const sy = sNode.y + i * 4;
          const dy = dNode.y + i * 4;
          return <path key={i} d={ribbon(sy, sh, dy, dh)} fill={color} opacity={op} />;
        })}
        {left.map((n) => (
          <rect key={`l-${n.label}`} x={X0} y={n.y} width={nodeW} height={n.h} rx="2" fill={n.color} />
        ))}
        {right.map((n, i) => (
          <rect key={`r-${i}`} x={X1} y={n.y} width={nodeW} height={n.h} rx="2" fill={n.color} />
        ))}
      </svg>
      {/* Left node labels */}
      {left.map((n) => (
        <div
          key={`ll-${n.label}`}
          className="absolute flex w-[140px] flex-col items-end text-right"
          style={{ left: 0, top: n.y + n.h / 2 - 27 }}
        >
          <span className="text-[13px] font-medium leading-[18px]" style={{ color: C.fgLvl1 }}>
            {n.label}
          </span>
          <span className="text-[12px] leading-[16px]" style={{ color: C.fgLvl3 }}>
            {n.kept}
          </span>
          <span className="text-[12px] leading-[16px]" style={{ color: C.fgLvl3 }}>
            {n.sw}
          </span>
        </div>
      ))}
      {/* Right node labels */}
      {right.map((n, i) => (
        <div
          key={`rl-${i}`}
          className="absolute flex flex-col items-start"
          style={{ left: X1 + 16, top: n.y + n.h / 2 - 18 }}
        >
          <span className="whitespace-nowrap text-[13px] font-medium leading-[18px]" style={{ color: C.fgLvl1 }}>
            {n.label}
          </span>
          <span className="whitespace-nowrap text-[12px] leading-[16px]" style={{ color: C.fgLvl3 }}>
            {n.sw}
          </span>
        </div>
      ))}
    </div>
  );
}

/** Pharmacy performance row: name + claims, patients + Claims label, bar. */
function PharmacyRow({
  name,
  claims,
  patients,
  pct,
}: {
  name: string;
  claims: string;
  patients: string;
  pct: number;
}) {
  return (
    <div className="flex w-full flex-col gap-[6px]">
      <div className="flex w-full items-center justify-between">
        <span className="text-[14px] font-medium leading-[20px]" style={{ color: C.fgLvl1 }}>
          {name}
        </span>
        <span className="text-[14px] font-medium leading-[20px]" style={{ color: C.fgLvl1 }}>
          {claims}
        </span>
      </div>
      <div className="flex w-full items-center justify-between">
        <span className="text-[12px] leading-[18px]" style={{ color: C.fgLvl3 }}>
          {patients} patients
        </span>
        <span className="text-[12px] leading-[18px]" style={{ color: C.fgLvl3 }}>
          Claims
        </span>
      </div>
      <div className="h-[8px] w-full overflow-hidden rounded-[4px]" style={{ backgroundColor: C.track }}>
        <div className="h-full rounded-[4px]" style={{ width: `${pct}%`, backgroundColor: C.purple }} />
      </div>
    </div>
  );
}

/** Simple bordered data table. Columns can be right- or left-aligned. */
function DataTable({
  columns,
  rows,
}: {
  columns: { key: string; label: string; align?: "left" | "right" }[];
  rows: Record<string, string>[];
}) {
  return (
    <div
      className="w-full overflow-hidden rounded-[2px] border border-solid"
      style={{ borderColor: C.tableBorder }}
    >
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((c) => (
              <th
                key={c.key}
                className={`px-[12px] py-[10px] text-[12px] font-medium leading-[18px] ${
                  c.align === "right" ? "text-right" : "text-left"
                }`}
                style={{ color: C.tableHeadFg, borderBottom: `1px solid ${C.tableBorder}` }}
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, ri) => (
            <tr key={ri}>
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={`px-[12px] py-[9px] text-[12px] leading-[18px] ${
                    c.align === "right" ? "text-right" : "text-left"
                  }`}
                  style={{
                    color: C.fgLvl1,
                    borderBottom: ri === rows.length - 1 ? "none" : `1px solid ${C.tableBorder}`,
                  }}
                >
                  {r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Frequency distribution vertical bar chart (inline). */
function FreqBarChart() {
  const bars = [
    { label: "Commercial", pct: 55 },
    { label: "Medicare", pct: 85 },
    { label: "Medicare", pct: 62 },
    { label: "Medicare", pct: 40 },
    { label: "Medicare", pct: 55 },
  ];
  const yTicks = ["100%", "80%", "55%", "30%", "5%"];
  return (
    <div className="flex h-[220px] w-full items-stretch">
      {/* Y axis */}
      <div
        className="flex w-[38px] flex-col justify-between pb-[22px] text-right text-[12px] font-light leading-[18px]"
        style={{ color: C.fgLvl1 }}
      >
        {yTicks.map((t) => (
          <span key={t}>{t}</span>
        ))}
      </div>
      {/* Plot */}
      <div className="relative flex min-w-0 flex-1 flex-col">
        <div className="relative flex min-h-0 flex-1 items-end justify-around px-[12px]">
          {/* gridlines */}
          {[0, 25, 50, 75, 100].map((g) => (
            <span
              key={g}
              className="absolute inset-x-0"
              style={{ bottom: `${g}%`, borderTop: `1px solid ${C.track}` }}
            />
          ))}
          {bars.map((b, i) => (
            <div
              key={i}
              className="relative w-[20px] rounded-t-[2px]"
              style={{ height: `${b.pct}%`, backgroundColor: C.qual1 }}
            />
          ))}
        </div>
        <div className="flex justify-around px-[12px] pt-[4px]">
          {bars.map((b, i) => (
            <span
              key={i}
              className="w-[64px] text-center text-[12px] font-light leading-[18px]"
              style={{ color: C.fgLvl1 }}
            >
              {b.label}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/** Solid single-color horizontal bar row (demographics). */
function DemoBar({
  label,
  pct,
  color,
  value,
}: {
  label: string;
  pct: number;
  color: string;
  value: string;
}) {
  return (
    <div className="flex w-full items-center gap-[12px]">
      <span
        className="w-[92px] overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-light leading-[18px]"
        style={{ color: C.fgLvl1 }}
      >
        {label}
      </span>
      <div className="h-[10px] min-w-0 flex-1 overflow-hidden" style={{ backgroundColor: C.track }}>
        <div className="h-full" style={{ width: `${pct}%`, backgroundColor: color }} />
      </div>
      <span
        className="w-[34px] text-right text-[12px] font-light leading-[18px]"
        style={{ color: C.fgLvl1 }}
      >
        {value}
      </span>
    </div>
  );
}

/** A bordered demographics sub-panel with a heading + solid bars. */
function DemoPanel({
  title,
  rows,
}: {
  title: string;
  rows: { label: string; pct: number; color: string; value: string }[];
}) {
  return (
    <div
      className="flex min-w-[300px] flex-1 flex-col gap-[16px] rounded-[2px] border border-solid p-[16px]"
      style={{ backgroundColor: C.bgLvl1, borderColor: C.borderStaticSubtle }}
    >
      <p className="text-[14px] font-medium leading-[20px]" style={{ color: C.fgLvl1 }}>
        {title}
      </p>
      <div className="flex w-full flex-col gap-[12px]">
        {rows.map((r, i) => (
          <DemoBar key={i} label={r.label} pct={r.pct} color={r.color} value={r.value} />
        ))}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------- */
/* Screen                                                                  */
/* ----------------------------------------------------------------------- */

export default function Screen_62298_272589(): JSX.Element {
  return (
    <div
      className="flex w-[1280px] flex-col items-start gap-[32px] pb-0"
      style={{ backgroundColor: C.bgLvl2, fontFamily: FONT }}
    >
      {/* Shared chrome — no footer on this screen. */}
      <TemplateNavigation activeItem="Audiences" />

      {/* Body */}
      <div className="flex w-full items-start px-[64px] pb-[32px]">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-[24px]">
          <div className="flex w-full flex-col items-start gap-[24px]">
            {/* Header + controls */}
            <div className="flex w-full flex-col items-start gap-[16px]">
              {/* Page header */}
              <div className="flex w-full flex-col items-start gap-[8px]">
                <div className="flex w-full items-center gap-[8px]">
                  <p
                    className="whitespace-nowrap text-[32px] font-semibold leading-[40px]"
                    style={{ color: C.fgLvl1, letterSpacing: "-0.64px" }}
                  >
                    OMC Healthcare Hub
                  </p>
                </div>
              </div>

              {/* Info notification */}
              <div
                className="flex w-full items-start gap-[8px] rounded-[2px] border border-solid p-[20px]"
                style={{ backgroundColor: C.bgLvl1, borderColor: C.info }}
              >
                <div className="flex min-w-0 flex-1 flex-col items-start gap-[3px]">
                  <div className="flex w-full items-start gap-[8px]">
                    <div className="flex size-[24px] items-center justify-center">
                      <img
                        alt=""
                        aria-hidden="true"
                        src={imgVectorFrameInfo}
                        className="size-[24px]"
                      />
                    </div>
                    <div className="flex min-w-0 flex-1 flex-col items-start gap-[4px] overflow-hidden pt-[3px]">
                      <p
                        className="w-full text-[14px] font-medium leading-[20px]"
                        style={{ color: C.fgLvl1 }}
                      >
                        Data privacy compliance
                      </p>
                    </div>
                  </div>
                  <div className="flex w-full items-start pl-[32px] pt-[5px]">
                    <p
                      className="min-w-0 flex-1 text-[14px] leading-[20px]"
                      style={{ color: C.fgLvl1 }}
                    >
                      All patient data is aggregated at ZIP+3 level in compliance with
                      HIPAA Safe Harbor de-identification standards (45 CFR
                      §164.514(b)(2)). No individual patient identifiers are used.
                    </p>
                  </div>
                </div>
              </div>

              {/* View tabs */}
              <PillTabs
                tabs={["Intelligence", "Activation strategy", "Campaign performance"]}
                activeIndex={0}
              />

              {/* Filter row */}
              <div className="flex w-full items-end gap-[16px]">
                <div className="flex min-w-0 flex-1 flex-col items-start gap-[2px] rounded-[2px]">
                  <div className="flex h-[20px] w-[274px] items-start">
                    <p
                      className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-medium leading-[20px]"
                      style={{ color: C.fgLvl1 }}
                    >
                      Advertiser brand:
                    </p>
                  </div>
                  <Dropdown value="Default" className="w-full" />
                </div>
                <div className="flex min-w-0 flex-1 flex-col items-start gap-[2px] rounded-[2px]">
                  <div className="flex h-[20px] w-[274px] items-start">
                    <p
                      className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-medium leading-[20px]"
                      style={{ color: C.fgLvl1 }}
                    >
                      Competitor brand’s:
                    </p>
                  </div>
                  <Dropdown value="Default" className="w-full" />
                </div>
                <div className="flex items-center justify-center rounded-[2px] px-[12px] py-[7px]">
                  <span
                    className="whitespace-nowrap text-center text-[14px] font-medium leading-[20px]"
                    style={{ color: C.fgDisabled }}
                  >
                    Clear all
                  </span>
                </div>
              </div>

              {/* View insights for + Last year */}
              <div className="flex w-full items-end justify-between">
                <div className="flex w-[226px] flex-col items-start gap-[8px]">
                  <div className="flex items-start">
                    <p
                      className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-medium leading-[18px]"
                      style={{ color: C.fgLvl1 }}
                    >
                      View insights for:
                    </p>
                  </div>
                  <PillTabs
                    tabs={["Patient hub", "Provider hub"]}
                    activeIndex={0}
                    fullWidth
                  />
                </div>
                <CaretButton label="Last year" />
              </div>
            </div>

            {/* ============ Smart Card: Patient insights ============ */}
            <SmartCard
              title="Patient insights"
              className="w-full"
              lineImg={imgLineContainer}
            >
              <div className="flex w-full flex-col items-start gap-[8px]">
                {/* KPI selector row */}
                <div className="flex w-full items-center gap-[10px] pt-[8px]">
                  <p
                    className="min-w-0 flex-1 text-[14px] font-medium leading-[20px]"
                    style={{ color: C.fgLvl1 }}
                  >
                    Comprehensive KPIs
                  </p>
                  <Dropdown
                    value="KPIs selected (10)"
                    className="w-[156px]"
                    height={24}
                    fontSize={12}
                  />
                </div>
                {/* 10 metric tiles */}
                <div className="flex w-full flex-wrap content-start items-start gap-[8px]">
                  <MetricTile label="Claim count" value="78%" delta={{ label: "-2.4% YoY", positive: false }} />
                  <MetricTile label="Switch in rate" value="58%" delta={{ label: "-4.2% YoY", positive: false }} />
                  <MetricTile label="Switch out rate" value="287d" delta={{ label: "-12d YoY", positive: false }} />
                  <MetricTile label="Competitive losses" value="8.2%" delta={{ label: "+1.5% YoY", positive: true }} />
                  <MetricTile label="Fill rate" value="15.3%" delta={{ label: "+2.8% YoY", positive: true }} />
                  <MetricTile label="Retention rate" value="82%" delta={{ label: "-2.1% YoY", positive: false }} />
                  <MetricTile label="Prior auth approval" value="102.8K" delta={{ label: "-5.4% YoY", positive: false }} />
                  <MetricTile label="Avg days on Rx" value="72%" delta={{ label: "-1.8% YoY", positive: false }} />
                  <MetricTile label="6 month persistence" value="45d" delta={{ label: "+3d% YoY", positive: false }} />
                  <MetricTile label="12 month persistence" value="68%" delta={{ label: "+4.2% YoY", positive: true }} />
                </div>
              </div>
            </SmartCard>

            {/* ============ Smart Card: Temporal trends ============ */}
            <SmartCard
              title="Temporal trends"
              className="w-full"
              lineImg={imgLineContainer}
              headerRight={
                <div className="flex items-center gap-[8px]">
                  <CaretButton label="Last year" compact />
                  <div
                    className="flex items-center justify-center rounded-[2px] border border-solid p-[2px]"
                    style={{ borderColor: C.borderBold }}
                  >
                    <span className="flex size-[20px] items-center justify-center p-[2px]">
                      <img alt="" aria-hidden="true" src={imgExpand} className="h-[15.625px] w-[17.5px]" />
                    </span>
                  </div>
                </div>
              }
            >
              <div className="flex w-full flex-col items-start gap-[16px]">
                {/* Badge row + competitors dropdown */}
                <div className="flex w-full items-center justify-between">
                  <CompetitorBadges />
                  <Dropdown value="Competitors (3/2)" className="h-[24px]" height={24} fontSize={12} />
                </div>
                {/* Line chart (SVG composition) */}
                <div className="flex h-[241px] w-full flex-col items-start justify-center">
                  <div className="flex h-[200px] w-full items-end gap-[8px]">
                    {/* Left axis label */}
                    <div className="flex h-full flex-col items-start justify-center pb-[34px]">
                      <div className="flex h-[72px] w-[18px] items-center justify-center">
                        <div className="-rotate-90">
                          <p
                            className="whitespace-nowrap text-right text-[12px] font-light leading-[18px]"
                            style={{ color: C.fgLvl1 }}
                          >
                            % of patients
                          </p>
                        </div>
                      </div>
                    </div>
                    {/* Chart content */}
                    <div className="flex h-full min-w-0 flex-1 items-center gap-[16px]">
                      {/* Left Y axis */}
                      <div
                        className="flex h-full flex-col items-start justify-between pb-[34px] text-right text-[12px] font-light leading-[18px]"
                        style={{ color: C.fgLvl1 }}
                      >
                        <p className="w-full">20%</p>
                        <p className="w-full">15%</p>
                        <p className="w-full">10%</p>
                        <p className="w-full">5%</p>
                        <p className="w-full">0%</p>
                      </div>
                      {/* Plot area */}
                      <div className="flex h-full min-w-0 flex-1 flex-col gap-[16px] py-[8px]">
                        <div className="relative flex min-h-0 flex-1 flex-col items-start justify-between">
                          {[0, 1, 2, 3, 4].map((i) => (
                            <div key={i} className="relative h-0 w-full">
                              <img
                                alt=""
                                aria-hidden="true"
                                className="absolute inset-x-0 top-[-1px] block w-full"
                                src={imgLine25}
                              />
                            </div>
                          ))}
                          <div className="absolute inset-[18.12px_7px_20px_13px]">
                            <img alt="" aria-hidden="true" className="block size-full max-w-none" src={imgLineA} />
                          </div>
                          <div className="absolute inset-[130px_7px_16px_13px]">
                            <img alt="" aria-hidden="true" className="block size-full max-w-none" src={imgLineB} />
                          </div>
                          <div className="absolute inset-[91px_7px_20px_13px]">
                            <img alt="" aria-hidden="true" className="block size-full max-w-none" src={imgLineC} />
                          </div>
                          <div className="absolute inset-[34px_7px_103px_13px]">
                            <img alt="" aria-hidden="true" className="block size-full max-w-none" src={imgLineD} />
                          </div>
                        </div>
                        {/* X axis */}
                        <div
                          className="flex w-full items-center justify-between text-[12px] font-light leading-[18px]"
                          style={{ color: C.fgLvl1 }}
                        >
                          {["‘24-05", "‘24-06", "‘24-07", "‘24-08", "‘24-09", "‘24-10", "‘24-11"].map(
                            (m) => (
                              <p key={m} className="min-w-0 flex-1">
                                {m}
                              </p>
                            )
                          )}
                        </div>
                      </div>
                      {/* Right Y axis */}
                      <div
                        className="flex h-full flex-col items-start justify-between pb-[34px] text-right text-[12px] font-light leading-[18px]"
                        style={{ color: C.fgLvl1 }}
                      >
                        <p className="w-full">3M</p>
                        <p className="w-full">2.5M</p>
                        <p className="w-full">2M</p>
                        <p className="w-full">1.5M</p>
                        <p className="w-full">1M</p>
                      </div>
                    </div>
                    {/* Right axis label */}
                    <div className="flex h-full flex-col items-start justify-center pb-[34px]">
                      <div className="flex h-[87px] w-[18px] items-center justify-center">
                        <div className="-rotate-90">
                          <p
                            className="whitespace-nowrap text-right text-[12px] font-light leading-[18px]"
                            style={{ color: C.fgLvl1 }}
                          >
                            Total diagnosed
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SmartCard>

            {/* ===== Row: Competitive landscape + Geographic insights ===== */}
            <div className="flex w-full flex-wrap content-start items-start gap-[24px]">
              {/* Competitive landscape */}
              <SmartCard
                title="Competitive landscape"
                className="min-w-[532px] flex-1"
                lineImg={imgLineContainer1}
              >
                <div className="flex w-full flex-col items-start gap-[16px]">
                  <div className="flex w-full items-center justify-between">
                    <CompetitorBadges />
                    <Dropdown value="Competitors (2/3)" className="h-[24px]" height={24} fontSize={12} />
                  </div>
                  <div className="flex w-full flex-col items-start gap-[8px]">
                    <div className="flex w-full items-center gap-[8px]">
                      <MetricTileSmall label="Brand" value="Breztri" />
                      <MetricTileSmall label="Patients" value="768,000" />
                      <MetricTileSmall label="Share" value="26%" />
                      <MetricTileSmall label="Growth" value="+6.8%" valueColor={C.success} />
                    </div>
                    <div className="flex w-full items-center gap-[8px]">
                      <MetricTileSmall label="Competitor" value="Nucala" />
                      <MetricTileSmall label="Patients" value="576,000" />
                      <MetricTileSmall label="Share" value="17%" />
                      <MetricTileSmall label="Growth" value="+3.1%" valueColor={C.success} />
                    </div>
                  </div>
                </div>
              </SmartCard>

              {/* Geographic insights */}
              <SmartCard
                title="Geographic insights"
                className="min-w-[532px] flex-1"
                lineImg={imgLineContainer2}
                headerRight={
                  <PillTabs tabs={["Patients", "Comps"]} activeIndex={0} />
                }
              >
                <div className="flex w-full items-start gap-[16px]">
                  {/* US map */}
                  <div className="flex min-w-0 flex-1 items-center justify-center">
                    <img
                      alt="United States choropleth of patient distribution"
                      src={imgMapUs}
                      className="block h-[214px] w-full max-w-none object-contain"
                    />
                  </div>
                  {/* Age distribution + gender split */}
                  <div
                    className="flex h-[214px] min-w-[364px] flex-1 flex-col items-start gap-[16px] rounded-[2px] border border-solid p-[12px]"
                    style={{ backgroundColor: C.bgLvl1, borderColor: C.borderStaticSubtle }}
                  >
                    <p
                      className="whitespace-nowrap text-[14px] font-medium leading-[20px]"
                      style={{ color: C.fgLvl1 }}
                    >
                      Age distribution
                    </p>
                    <div className="flex w-full items-center justify-between">
                      <div
                        className="flex w-[100px] min-w-[100px] flex-col items-start gap-[16px] text-[12px] font-light leading-[18px]"
                        style={{ color: C.fgLvl1 }}
                      >
                        {["18-34", "35-49", "50-64", "65-74", "75+"].map((a) => (
                          <p key={a} className="w-full overflow-hidden text-ellipsis whitespace-nowrap">
                            {a}
                          </p>
                        ))}
                      </div>
                      <div className="flex min-w-0 flex-1 flex-col items-start gap-[16px]">
                        <BarRow segments={[C.seqMax, C.seqMax, C.seqMax, C.qual7]} value="75%" />
                        <BarRow segments={[C.seq5, C.seq5, C.qual7, C.qual7]} value="50%" />
                        <BarRow segments={[C.seq4, C.qual7, C.qual7, C.qual7]} value="25%" />
                        <BarRow segments={[C.seq3, C.qual7, C.qual7, C.qual7, C.qual7]} value="20%" />
                        <BarRow segments={[C.seq2, C.qual7, C.qual7, C.qual7, C.qual7]} value="20%" />
                      </div>
                    </div>
                  </div>
                </div>
              </SmartCard>
            </div>

            {/* ============ Smart Card: Patient journey funnel ============ */}
            <SmartCard
              title="Patient journey funnel"
              className="w-full"
              lineImg={imgLineContainer}
              headerRight={<ExpandButton />}
            >
              <div className="flex w-full flex-col gap-[24px]">
                {/* Legend + compare dropdown */}
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-[24px]">
                    <LegendItem color={C.purple} label="Drug Class" />
                    <LegendItem color={C.orange} label="Breztri" />
                    <LegendItem color={C.pink} label="Competitors combined" />
                  </div>
                  <Dropdown value="Compare to: All" className="w-[160px]" height={30} fontSize={12} />
                </div>
                {/* Stage grid (2 x 2) */}
                <div className="flex w-full flex-wrap gap-x-[64px] gap-y-[28px]">
                  <FunnelStage
                    title="Diagnosed"
                    bars={[{ value: "3.2 M", pct: 100, color: C.purple }]}
                    drop="-38% drop-off"
                    note="High awareness; broad category reach"
                  />
                  <FunnelStage
                    title="Prescribed"
                    bars={[
                      { value: "2.0M", pct: 62, color: C.purple },
                      { value: "753.9K", pct: 23.6, color: C.orange },
                      { value: "1.2 M", pct: 38.4, color: C.pink },
                    ]}
                    drop="-16% drop-off"
                    note="Brand conversion opportunity"
                  />
                  <FunnelStage
                    title="Filled"
                    bars={[
                      { value: "1.7 M", pct: 52, color: C.purple },
                      { value: "632.7K", pct: 19.8, color: C.orange },
                      { value: "1 M", pct: 32.2, color: C.pink },
                    ]}
                    footer={
                      <p className="text-[12px] leading-[18px]" style={{ color: C.fgLvl1 }}>
                        Fill rate: <span className="font-semibold">Breztri 84%</span>{" "}
                        <span style={{ color: C.fgLvl3 }}>|</span>{" "}
                        <span style={{ color: C.link }}>Competitors 84%</span>
                      </p>
                    }
                    drop="-24% drop-off"
                    note="Full-through rate tracking"
                  />
                  <FunnelStage
                    title="Adherent"
                    bars={[
                      { value: "1.3M", pct: 40, color: C.purple },
                      { value: "480.8K", pct: 15.2, color: C.orange },
                      { value: "784.5K", pct: 24.8, color: C.pink },
                    ]}
                    footer={
                      <p className="text-[12px] leading-[18px]" style={{ color: C.fgLvl1 }}>
                        Fill rate: <span className="font-semibold">Breztri 64%</span>{" "}
                        <span style={{ color: C.fgLvl3 }}>|</span>{" "}
                        <span style={{ color: C.link }}>Competitors 64%</span>
                      </p>
                    }
                  />
                </div>
              </div>
            </SmartCard>

            {/* ============ Smart Card: Treatment switching behavior ============ */}
            <SmartCard
              title="Treatment switching behavior"
              className="w-full"
              lineImg={imgLineContainer}
              headerRight={<ExpandButton />}
            >
              <div className="flex w-full flex-col gap-[24px]">
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-[24px]">
                    <InfoChip label="Script switching flows across COPD therapies" />
                  </div>
                </div>
                <div className="flex w-full items-center justify-between">
                  <div className="flex items-center gap-[24px]">
                    <LegendItem color={C.purple} label="Breztri" />
                    <LegendItem color={C.orange} label="Nucala" />
                    <LegendItem color={C.pink} label="Trelegy ellipta" />
                  </div>
                  <span className="text-[14px] font-medium leading-[20px]" style={{ color: C.fgLvl1 }}>
                    Edge thickness = script volume
                  </span>
                </div>
                <SankeyDiagram />
              </div>
            </SmartCard>

            {/* ====== Smart Card: Claims intelligence — pharmacies & payers ====== */}
            <SmartCard
              title="Claims intelligence – pharmacies & payers"
              className="w-full"
              lineImg={imgLineContainer}
              headerRight={
                <div className="flex items-center gap-[8px]">
                  <RoundedBadge label="Claims data" fill={C.badgeNeutralBg} textColor={C.badgeNeutralFg} />
                  <ExpandButton />
                </div>
              }
            >
              <div className="flex w-full flex-col gap-[24px]">
                <InfoChip label="Pharmacy performance, ZIP codes, payers, & channel breakdown" />
                {/* Row 1: Top pharmacies + Top ZIP codes */}
                <div className="flex w-full items-start gap-[24px]">
                  <div className="flex min-w-[440px] flex-1 flex-col gap-[16px]">
                    <p className="text-[16px] font-medium leading-[24px]" style={{ color: C.fgLvl1 }}>
                      Top pharmacies performance
                    </p>
                    <div className="flex w-full flex-col gap-[16px]">
                      <PharmacyRow name="Kroger pharmacy" claims="1,056,662" patients="41K" pct={80} />
                      <PharmacyRow name="Express scripts" claims="717,566" patients="115K" pct={62} />
                      <PharmacyRow name="Heb pharmacy" claims="212,916" patients="41K" pct={55} />
                      <PharmacyRow name="Amazon pharmacy #002" claims="145,465" patients="41K" pct={55} />
                      <PharmacyRow name="Amazon pharmacy #006" claims="128,400" patients="41K" pct={55} />
                    </div>
                  </div>
                  <div className="flex min-w-[440px] flex-1 flex-col gap-[16px]">
                    <p className="text-[16px] font-medium leading-[24px]" style={{ color: C.fgLvl1 }}>
                      Top ZIP codes – pharmacies
                    </p>
                    <DataTable
                      columns={[
                        { key: "zip", label: "ZIP code", align: "right" },
                        { key: "state", label: "State", align: "left" },
                        { key: "claims", label: "Claims", align: "right" },
                        { key: "patients", label: "Patients", align: "right" },
                      ]}
                      rows={[
                        { zip: "112", state: "NY", claims: "444,223", patients: "32,900" },
                        { zip: "300", state: "GA", claims: "439,786", patients: "37,487" },
                        { zip: "840", state: "UT", claims: "399,783", patients: "27,964" },
                        { zip: "980", state: "WA", claims: "387,908", patients: "26,945" },
                        { zip: "750", state: "TX", claims: "364,292", patients: "36,894" },
                        { zip: "606", state: "IL", claims: "307,647", patients: "25,500" },
                        { zip: "104", state: "NY", claims: "290,256", patients: "21,743" },
                      ]}
                    />
                  </div>
                </div>
                {/* Row 2: Frequency distribution + payer breakdown */}
                <div className="flex w-full items-start gap-[24px]">
                  <div className="flex min-w-[440px] flex-1 flex-col gap-[16px]">
                    <div className="flex items-center gap-[8px]">
                      <p className="text-[16px] font-medium leading-[24px]" style={{ color: C.fgLvl1 }}>
                        Frequency distribution forecast
                      </p>
                      <RoundedBadge
                        label="Share of claims (%)"
                        borderColor={C.borderSubtle}
                        textColor={C.fgRegular}
                      />
                    </div>
                    <FreqBarChart />
                  </div>
                  <div className="flex min-w-[440px] flex-1 flex-col gap-[16px]">
                    <div className="flex items-center gap-[8px] self-end">
                      <span className="text-[12px] leading-[18px]" style={{ color: C.fgLvl3 }}>
                        Breakdown by:
                      </span>
                      <Dropdown value="Sub-channel" className="w-[132px]" height={28} fontSize={12} />
                    </div>
                    <DataTable
                      columns={[
                        { key: "channel", label: "Sub-channel", align: "left" },
                        { key: "share", label: "Share", align: "right" },
                        { key: "patients", label: "Patients", align: "right" },
                        { key: "avg", label: "Avg claims/Pt", align: "right" },
                      ]}
                      rows={[
                        { channel: "Commercial", share: "55%", patients: "6,280", avg: "12.5" },
                        { channel: "Medicare advantage", share: "12%", patients: "1,420", avg: "12.1" },
                        { channel: "Medicaid managed", share: "8%", patients: "965", avg: "11.9" },
                        { channel: "Medicaid unspec", share: "6%", patients: "728", avg: "11.7" },
                        { channel: "Medicare Unspec", share: "5%", patients: "612", avg: "11.7" },
                      ]}
                    />
                  </div>
                </div>
              </div>
            </SmartCard>

            {/* ============ Smart Card: Audience demographics ============ */}
            <SmartCard
              title="Audience demographics"
              className="w-full"
              lineImg={imgLineContainer}
              headerRight={
                <div className="flex items-center gap-[8px]">
                  <RoundedBadge label="Patient profiles" borderColor={C.borderSubtle} textColor={C.fgRegular} />
                  <ExpandButton />
                </div>
              }
            >
              <div className="flex w-full flex-col gap-[16px]">
                <div className="flex w-full items-start gap-[16px]">
                  <DemoPanel
                    title="Age generation"
                    rows={[
                      { label: "Gen Y (Millennial…", pct: 75, color: C.seqMax, value: "75%" },
                      { label: "Gen X", pct: 50, color: C.seq4, value: "50%" },
                      { label: "Gen Z", pct: 25, color: C.seq3, value: "25%" },
                      { label: "Baby boomers", pct: 20, color: C.seq2, value: "20%" },
                    ]}
                  />
                  <DemoPanel
                    title="Age groups"
                    rows={[
                      { label: "35–44", pct: 75, color: C.seqMax, value: "75%" },
                      { label: "25–34", pct: 50, color: C.seq4, value: "50%" },
                      { label: "45–54", pct: 25, color: C.seq3, value: "25%" },
                      { label: "55–64", pct: 20, color: C.seq2, value: "20%" },
                      { label: "55–64", pct: 20, color: C.seq2, value: "20%" },
                    ]}
                  />
                  <DemoPanel
                    title="Household Income"
                    rows={[
                      { label: "USD 100K+", pct: 75, color: C.seqMax, value: "75%" },
                      { label: "USD 75K–100K", pct: 50, color: C.seq4, value: "50%" },
                      { label: "USD 50K–75K", pct: 25, color: C.seq3, value: "25%" },
                      { label: "USD 35K–50K", pct: 20, color: C.seq2, value: "20%" },
                      { label: "Under USD 35K", pct: 20, color: C.seq2, value: "20%" },
                    ]}
                  />
                </div>
                <DemoPanel
                  title="Gender split"
                  rows={[
                    { label: "Male", pct: 75, color: C.seqMax, value: "75%" },
                    { label: "Female", pct: 50, color: C.seq4, value: "50%" },
                  ]}
                />
              </div>
            </SmartCard>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Metric tile without a delta badge (Competitive landscape). */
function MetricTileSmall({
  label,
  value,
  valueColor,
}: {
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <div
      className="flex min-w-[120px] flex-1 items-center gap-[6px] rounded-[2px] border border-solid p-[16px]"
      style={{ backgroundColor: C.bgLvl1, borderColor: C.borderSubtle }}
    >
      <div className="flex flex-col items-start gap-[6px]">
        <p
          className="whitespace-nowrap text-center text-[12px] leading-[18px]"
          style={{ color: C.fgLvl3 }}
        >
          {label}
        </p>
        <p
          className="whitespace-nowrap text-center text-[20px] font-semibold leading-[28px]"
          style={{ color: valueColor ?? C.fgLvl1, letterSpacing: "-0.2px" }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
