/* =========================================================================
 * TV Audience & Content Planner — V5 chart components
 *
 * Hand-rolled, token-driven SVG/flex visualisations faithful to the wireframe.
 * Every colour comes from the chart token layer (./chartTokens) mapped to Fiber
 * design tokens via inline style var(--token, #fallback). No chart library, no
 * arbitrary hex, no library-default palette. No nested interactive controls;
 * hover/selected via local state + inline style. Meaningful tooltips per §19.
 * ========================================================================= */

import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { ArrowUp, ArrowDown, Minus } from "@phosphor-icons/react";
import {
  FONT,
  GRID,
  AXIS_LABEL,
  TITLE,
  MUTED,
  BODY2,
  SUCCESS_FG,
  ERROR_FG,
  CARD_SHADOW,
  HOVER_BG,
  fmtInt,
  IndexBadge,
} from "./primitives";
import {
  CHART,
  HEAT_RAMP,
  LABEL_ON_COLOR,
  LABEL_ON_LIGHT,
  indexExplanation,
} from "./chartTokens";

const TOOLTIP_BG = "var(--surface-background-lvl6, #282833)";
const TOOLTIP_FG = "var(--surface-foreground-static-neutral-inversed, #ffffff)";
const TOOLTIP_FG2 = "var(--surface-foreground-static-neutral-lvl4, #c6c6cc)";

/* Shared dark tooltip surface (Fiber tooltip style).
 * The visible surface is portalled to the viewport so card/scroll overflow
 * cannot clip it. The local marker stays at the hovered datum and supplies
 * collision-aware positioning at every chart edge. */
function Tooltip({ lines }: { lines: { label: string; value?: string }[] }) {
  const markerRef = useRef<HTMLSpanElement>(null);
  const surfaceRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ left: 0, top: 0, visible: false });

  useLayoutEffect(() => {
    const positionSurface = () => {
      const marker = markerRef.current;
      const surface = surfaceRef.current;
      if (!marker || !surface) return;
      const anchor = marker.getBoundingClientRect();
      const bounds = surface.getBoundingClientRect();
      const gap = 8;
      const edge = 8;
      const anchorX = anchor.left + anchor.width / 2;
      const above = anchor.top - bounds.height - gap;
      const top = above >= edge
        ? above
        : Math.min(window.innerHeight - bounds.height - edge, anchor.bottom + gap);
      const left = Math.min(
        window.innerWidth - bounds.width - edge,
        Math.max(edge, anchorX - bounds.width / 2),
      );
      setPosition({ left, top: Math.max(edge, top), visible: true });
    };

    positionSurface();
    window.addEventListener("resize", positionSurface);
    window.addEventListener("scroll", positionSurface, true);
    return () => {
      window.removeEventListener("resize", positionSurface);
      window.removeEventListener("scroll", positionSurface, true);
    };
  }, [lines]);

  return (
    <>
      <span ref={markerRef} className="pointer-events-none absolute left-1/2 top-1/2 size-px" aria-hidden />
      {typeof document !== "undefined" && createPortal(
        <div
          ref={surfaceRef}
          role="tooltip"
          className="pointer-events-none fixed z-[1000] flex max-w-[min(320px,calc(100vw-16px))] flex-col gap-[2px] rounded-[var(--radius-50,4px)] px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)] text-left"
          style={{
            backgroundColor: TOOLTIP_BG,
            boxShadow: CARD_SHADOW,
            left: position.left,
            top: position.top,
            opacity: position.visible ? 1 : 0,
          }}
        >
          {lines.map((l, i) => (
            <span
              key={i}
              className={
                i === 0
                  ? "text-[length:var(--body-sm-medium-size,12px)] font-medium"
                  : "text-[length:var(--body-sm-regular-size,12px)]"
              }
              style={{ color: i === 0 ? TOOLTIP_FG : TOOLTIP_FG2 }}
            >
              {l.value != null ? `${l.label}: ${l.value}` : l.label}
            </span>
          ))}
        </div>,
        document.body,
      )}
    </>
  );
}

/* ============================================ Consumption donut ============ */

export function DonutChart({
  data,
  selected,
  onSelect,
  vertical = false,
}: {
  data: {
    key: string;
    name: string;
    color: string;
    minutes: number;
    pct: number;
  }[];
  selected: string | null;
  onSelect: (k: string) => void;
  /** Force a vertical stack (donut on top, legend below) — used in the narrow
   *  20% Type column of the merged Consumption & Time-Spent card. */
  vertical?: boolean;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const [plotHover, setPlotHover] = useState<string | null>(null);
  const size = 200;
  const r = 78;
  const stroke = 30;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const active = plotHover ?? hover ?? selected;
  const activeSeg = data.find((d) => d.key === active) ?? null;

  return (
    <div
      className={
        vertical
          ? "flex flex-col items-center gap-[var(--spacing-200,16px)]"
          : "flex flex-col items-center gap-[var(--spacing-200,16px)] sm:flex-row sm:items-center"
      }
    >
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="img"
          aria-label="Consumption by type — proportional share of viewing minutes"
        >
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={CHART.neutral}
            strokeWidth={stroke}
            opacity={0.4}
          />
          {data.map((d) => {
            const len = (d.pct / 100) * circ;
            const dash = `${len} ${circ - len}`;
            const dashOffset = -offset;
            offset += len;
            const dim = active != null && active !== d.key;
            return (
              <circle
                key={d.key}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={d.color}
                strokeWidth={active === d.key ? stroke + 4 : stroke}
                strokeDasharray={dash}
                strokeDashoffset={dashOffset}
                opacity={dim ? 0.35 : 1}
                transform={`rotate(-90 ${cx} ${cy})`}
                style={{ transition: "stroke-width 120ms ease, opacity 120ms ease" }}
                 onMouseEnter={() => setPlotHover(d.key)}
                 onMouseLeave={() => setPlotHover(null)}
                 onClick={() => onSelect(d.key)}
              />
            );
          })}
        </svg>
        {plotHover && activeSeg && (() => {
          const activeIndex = data.findIndex((item) => item.key === plotHover);
          const beforePct = data
            .slice(0, Math.max(0, activeIndex))
            .reduce((sum, item) => sum + item.pct, 0);
          const midAngle = ((beforePct + activeSeg.pct / 2) / 100) * Math.PI * 2 - Math.PI / 2;
          return (
            <span
              className="pointer-events-none absolute size-px"
              style={{
                left: cx + Math.cos(midAngle) * r,
                top: cy + Math.sin(midAngle) * r,
              }}
            >
              <Tooltip
                lines={[
                  { label: activeSeg.name },
                  { label: "Legend", value: "Share of viewing" },
                  { label: "Share of viewing", value: `${activeSeg.pct.toFixed(1)}%` },
                  { label: "Est. minutes/hh", value: `${fmtInt(activeSeg.minutes)} min` },
                ]}
              />
            </span>
          );
        })()}
        {/* Centre readout */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          {activeSeg ? (
            <>
              <span
                className="text-[length:var(--headline-sm-semibold-size,20px)] font-semibold"
                style={{ color: TITLE }}
              >
                {activeSeg.pct.toFixed(0)}%
              </span>
              <span
                className="max-w-[92px] text-[length:var(--body-sm-regular-size,12px)]"
                style={{ color: MUTED }}
              >
                {activeSeg.name}
              </span>
            </>
          ) : (
            <>
              <span
                className="text-[length:var(--body-sm-regular-size,12px)]"
                style={{ color: MUTED }}
              >
                Share of
              </span>
              <span
                className="text-[length:var(--body-md-medium-size,14px)] font-medium"
                style={{ color: BODY2 }}
              >
                viewing
              </span>
            </>
          )}
        </div>
      </div>

      {/* Legend — clickable rows act as the downstream cross-filter. */}
      <div
        className="flex w-full flex-col gap-[var(--spacing-75,6px)]"
        role="group"
        aria-label="Consumption type legend — click to cross-filter"
      >
        {data.map((d) => {
          const isSel = selected === d.key;
          return (
            <button
              key={d.key}
              type="button"
              onClick={() => onSelect(d.key)}
              onMouseEnter={() => setHover(d.key)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(d.key)}
              onBlur={() => setHover(null)}
              aria-pressed={isSel}
              aria-label={`${d.name}: ${d.pct.toFixed(1)}% of viewing minutes, ${fmtInt(d.minutes)} estimated minutes per household. Click to cross-filter downstream sections.`}
              className="relative flex items-center gap-[var(--spacing-100,8px)] rounded-[var(--radius-50,4px)] px-[var(--spacing-75,6px)] py-[3px] text-left focus:outline-none"
              style={{
                backgroundColor: isSel
                  ? "var(--container-dynamic-brand-subtle-background-selected, #f6ebff)"
                  : hover === d.key
                    ? HOVER_BG
                    : "transparent",
                border: isSel
                  ? `1px solid ${CHART.selected}`
                  : "1px solid transparent",
              }}
            >
              <span
                className="block h-[12px] w-[12px] shrink-0 rounded-[var(--radius-25,2px)]"
                style={{ backgroundColor: d.color }}
              />
              <span
                className="flex-1 text-[length:var(--body-md-regular-size,14px)]"
                style={{ color: TITLE }}
              >
                {d.name}
              </span>
              <span
                className="text-[length:var(--body-md-medium-size,14px)] font-semibold tabular-nums"
                style={{ color: TITLE }}
              >
                {d.pct.toFixed(1)}%
              </span>
              {hover === d.key && (
                <Tooltip
                  lines={[
                    { label: d.name },
                    { label: "Share of viewing", value: `${d.pct.toFixed(1)}%` },
                    { label: "Est. minutes/hh", value: `${fmtInt(d.minutes)} min` },
                  ]}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================== Combo bar + line =========== */

export function ComboChart({
  categories,
  categoryDetails,
  bars,
  secondaryBars,
  line,
  indices,
  barLabel,
  secondaryBarLabel,
  lineLabel,
  barAxisLabel,
  secondaryBarAxisLabel,
  lineAxisLabel,
  barUnit = "",
  secondaryBarUnit = "",
  lineUnit = "",
  onSelect,
  selectedIndex,
  legendRight,
  minChartWidth,
  scrollAriaLabel,
  showLegend = true,
  showLine = true,
  secondaryAxisSide = "left",
  categoryDetailLabel = "Platform",
  barColor = CHART.primary,
  secondaryBarColor = CHART.secondary,
}: {
  categories: string[];
  /** Optional secondary x-axis label, e.g. each show's platform/network. */
  categoryDetails?: string[];
  bars: number[];
  /** Optional second bar series, plotted on the primary axis. */
  secondaryBars?: number[];
  line: number[];
  indices?: number[];
  barLabel: string;
  secondaryBarLabel?: string;
  lineLabel: string;
  /** Explicit axis titles. Defaults to the corresponding series label. */
  barAxisLabel?: string;
  secondaryBarAxisLabel?: string;
  lineAxisLabel?: string;
  barUnit?: string;
  secondaryBarUnit?: string;
  lineUnit?: string;
  onSelect?: (i: number) => void;
  selectedIndex?: number | null;
  /** Optional chart filters aligned on the same row, opposite the legend. */
  legendRight?: ReactNode;
  /** Grow only the plot/axes area and make it horizontally scrollable. */
  minChartWidth?: number;
  scrollAriaLabel?: string;
  /** Allows a parent to place the same legend beside adjacent controls. */
  showLegend?: boolean;
  /** Hide the line series when its value is presented on the x-axis. */
  showLine?: boolean;
  /** Place the optional second bar scale on the opposite side of the plot. */
  secondaryAxisSide?: "left" | "right";
  /** Accessible/tooltip label for the optional supporting x-axis text. */
  categoryDetailLabel?: string;
  /** Optional Fiber token colors for scoped two-series chart variants. */
  barColor?: string;
  secondaryBarColor?: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const plotW = 720;
  const plotH = 240;
  // Each bar series has its OWN scale. Avg minutes and household percentage
  // are incomparable units, so sharing barMax would imply a false magnitude
  // relationship. The optional second series gets a dedicated labeled axis.
  const barMax = Math.max(...bars, 1);
  const secondaryBarMax = Math.max(...(secondaryBars ?? []), 1);
  const lineMax = Math.max(...line, 1);
  const n = categories.length;
  const slot = plotW / Math.max(n, 1);
  const grouped = Boolean(secondaryBars);
  const groupW = Math.max(14, Math.min(38, slot * 0.68));
  const colW = grouped ? Math.max(6, groupW / 2 - 1) : Math.max(14, Math.min(30, slot * 0.55));
  const yTicks = 5;
  const barTickVals = Array.from({ length: yTicks }, (_, i) =>
    Math.round((barMax * (yTicks - 1 - i)) / (yTicks - 1)),
  );
  const secondaryBarTickVals = Array.from({ length: yTicks }, (_, i) =>
    ((secondaryBarMax * (yTicks - 1 - i)) / (yTicks - 1)).toFixed(0),
  );
  const lineTickVals = Array.from({ length: yTicks }, (_, i) =>
    (((lineMax * (yTicks - 1 - i)) / (yTicks - 1))).toFixed(0),
  );
  const linePts = line.map((v, i) => ({
    cx: i * slot + slot / 2,
    cy: plotH - (v / lineMax) * plotH,
  }));

  return (
    <div className="flex flex-col gap-[var(--spacing-150,12px)]">
      {/* Legend */}
      {showLegend && <div className="flex flex-wrap items-center justify-between gap-x-[var(--spacing-200,16px)] gap-y-[var(--spacing-75,6px)]">
        <div className="flex flex-wrap items-center gap-x-[var(--spacing-200,16px)] gap-y-[var(--spacing-75,6px)]">
          <div className="flex items-center gap-[var(--spacing-75,6px)]">
          <span
            className="block h-[12px] w-[12px] rounded-[var(--radius-25,2px)]"
            style={{ backgroundColor: barColor }}
          />
          <span className="text-[length:var(--body-md-regular-size,14px)]" style={{ color: AXIS_LABEL }}>
            {barLabel}
          </span>
          </div>
          {secondaryBars && secondaryBarLabel && (
            <div className="flex items-center gap-[var(--spacing-75,6px)]">
            <span
              className="block h-[12px] w-[12px] rounded-[var(--radius-25,2px)]"
              style={{ backgroundColor: secondaryBarColor }}
            />
            <span className="text-[length:var(--body-md-regular-size,14px)]" style={{ color: AXIS_LABEL }}>
              {secondaryBarLabel}
            </span>
            </div>
          )}
          {showLine && <div className="flex items-center gap-[var(--spacing-75,6px)]">
            <span className="block h-[3px] w-[16px] rounded-full" style={{ backgroundColor: CHART.line }} />
            <span className="text-[length:var(--body-md-regular-size,14px)]" style={{ color: AXIS_LABEL }}>
              {lineLabel}
            </span>
          </div>}
        </div>
        {legendRight && (
          <div className="ml-auto flex flex-wrap items-center justify-end gap-[var(--spacing-100,8px)]">
            {legendRight}
          </div>
        )}
      </div>}

      <div
        className="w-full overflow-x-auto pb-[var(--spacing-100,8px)] outline-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
        style={{ scrollbarGutter: minChartWidth ? "stable" : undefined, color: BODY2 }}
        tabIndex={minChartWidth ? 0 : undefined}
        role={minChartWidth ? "region" : undefined}
        aria-label={minChartWidth ? scrollAriaLabel : undefined}
      >
        <div style={{ minWidth: minChartWidth ? `${minChartWidth}px` : "100%" }}>
        {/* Explicit axis titles: the optional second bar series is deliberately
            separate because its unit/scale is not comparable with the first. */}
        <div className="flex w-full items-end gap-[var(--spacing-50,4px)]">
        <span
          className="w-[58px] shrink-0 text-right text-[10px] font-medium"
          style={{ color: barColor }}
        >
          {barAxisLabel ?? barLabel}
        </span>
        {secondaryBars && secondaryAxisSide === "left" && (
          <span
            className="w-[50px] shrink-0 text-right text-[10px] font-medium"
            style={{ color: secondaryBarColor }}
          >
            {secondaryBarAxisLabel ?? secondaryBarLabel}
          </span>
        )}
        <span className="min-w-0 flex-1" />
        {(showLine || (secondaryBars && secondaryAxisSide === "right")) && (
          <span
            className="w-[58px] shrink-0 text-left text-[10px] font-medium"
            style={{ color: showLine ? CHART.line : secondaryBarColor }}
          >
            {showLine
              ? (lineAxisLabel ?? lineLabel)
              : (secondaryBarAxisLabel ?? secondaryBarLabel)}
          </span>
        )}
        </div>

        <div className="flex w-full gap-[var(--spacing-50,4px)]">
        {/* Left axis */}
        <div className="flex w-[58px] shrink-0 flex-col justify-between text-right" style={{ height: plotH }}>
          {barTickVals.map((t, i) => (
            <span key={i} className="text-[length:var(--body-sm-regular-size,12px)]" style={{ color: AXIS_LABEL }}>
              {t}
            </span>
          ))}
        </div>

        {/* Dedicated scale for the opt-in second bar series (e.g. HH%). */}
        {secondaryBars && secondaryAxisSide === "left" && (
          <div className="flex w-[50px] shrink-0 flex-col justify-between text-right" style={{ height: plotH }}>
            {secondaryBarTickVals.map((t, i) => (
              <span
                key={i}
                className="text-[length:var(--body-sm-regular-size,12px)]"
                style={{ color: secondaryBarColor }}
              >
                {t}
                {secondaryBarUnit.trim()}
              </span>
            ))}
          </div>
        )}

        <div className="relative min-w-0 flex-1">
          <div className="relative w-full" style={{ height: plotH }}>
            {barTickVals.map((_, i) => (
              <div
                key={i}
                className="absolute left-0 right-0 h-0 border-t border-solid"
                style={{ borderColor: GRID, top: `${(i / (yTicks - 1)) * 100}%` }}
              />
            ))}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox={`0 0 ${plotW} ${plotH}`}
              preserveAspectRatio="none"
              role="img"
              aria-label={
                showLine
                  ? `${barLabel} bars with ${lineLabel} line overlay`
                  : `${barLabel} and ${secondaryBarLabel ?? "secondary metric"} grouped bars`
              }
            >
              {bars.map((v, i) => {
                const h = (v / barMax) * plotH;
                const x = grouped
                  ? i * slot + (slot - groupW) / 2
                  : i * slot + (slot - colW) / 2;
                const isSel = selectedIndex === i;
                return (
                  <rect
                    key={i}
                    x={x}
                    y={plotH - h}
                    width={colW}
                    height={h}
                    rx={1}
                    fill={barColor}
                    opacity={hover == null || hover === i ? 1 : 0.5}
                  />
                );
              })}
              {secondaryBars?.map((v, i) => {
                const h = (v / secondaryBarMax) * plotH;
                const x = i * slot + (slot - groupW) / 2 + colW + 2;
                return (
                  <rect
                    key={`secondary-${i}`}
                    x={x}
                    y={plotH - h}
                    width={colW}
                    height={h}
                    rx={1}
                    fill={secondaryBarColor}
                    opacity={hover == null || hover === i ? 1 : 0.5}
                  />
                );
              })}
              {showLine && <polyline
                points={linePts.map((p) => `${p.cx},${p.cy}`).join(" ")}
                fill="none"
                stroke={CHART.line}
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />}
              {showLine && linePts.map((p, i) => (
                <circle key={i} cx={p.cx} cy={p.cy} r={3} fill={CHART.line} vectorEffect="non-scaling-stroke" />
              ))}
            </svg>

            {/* hover / select hit areas */}
            {categories.map((c, i) => (
              <button
                key={i}
                type="button"
                onMouseEnter={() => setHover(i)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                onClick={onSelect ? () => onSelect(i) : undefined}
                aria-pressed={onSelect ? selectedIndex === i : undefined}
                aria-label={`${c}${categoryDetails?.[i] ? `, ${categoryDetailLabel} ${categoryDetails[i]}` : ""}: ${barLabel} ${fmtInt(bars[i])}${barUnit}${secondaryBars && secondaryBarLabel ? `, ${secondaryBarLabel} ${secondaryBars[i].toFixed(1)}${secondaryBarUnit}` : ""}${showLine ? `, ${lineLabel} ${line[i].toFixed(1)}${lineUnit}` : ""}${indices ? `, index ${indices[i]} — ${indexExplanation(indices[i])}` : ""}`}
                className="absolute top-0 h-full focus:outline-none"
                style={{
                  left: `${(i / n) * 100}%`,
                  width: `${100 / n}%`,
                  backgroundColor: hover === i ? HOVER_BG : "transparent",
                  cursor: onSelect ? "pointer" : "default",
                }}
              >
                {hover === i && (
                  <Tooltip
                    lines={[
                      { label: c },
                      ...(categoryDetails?.[i]
                        ? [{ label: categoryDetailLabel, value: categoryDetails[i] }]
                        : []),
                      { label: barLabel, value: `${fmtInt(bars[i])}${barUnit}` },
                      ...(secondaryBars && secondaryBarLabel
                        ? [{
                            label: secondaryBarLabel,
                            value: `${secondaryBars[i].toFixed(1)}${secondaryBarUnit}`,
                          }]
                        : []),
                      ...(showLine
                        ? [{ label: lineLabel, value: `${line[i].toFixed(1)}${lineUnit}` }]
                        : []),
                      ...(indices
                        ? [{ label: "Index", value: `${indices[i]} (${indexExplanation(indices[i])})` }]
                        : []),
                    ]}
                  />
                )}
              </button>
            ))}
          </div>

          {/* X labels + optional index chip */}
          <div className="mt-[var(--spacing-75,6px)] flex w-full">
            {categories.map((c, i) => (
              <div key={i} className="flex flex-col items-center gap-[2px] px-[2px]" style={{ width: `${100 / n}%` }} title={c}>
                <span
                  className="block w-full truncate text-center text-[length:var(--body-sm-regular-size,12px)]"
                  style={{ color: AXIS_LABEL }}
                >
                  {c.length > 12 ? `${c.slice(0, 11)}…` : c}
                </span>
                {categoryDetails?.[i] && (
                  <span
                    className="block w-full truncate text-center text-[10px]"
                    style={{ color: MUTED }}
                  >
                    {categoryDetailLabel} {categoryDetails[i]}
                  </span>
                )}
                {indices && <MiniIndex index={indices[i]} />}
              </div>
            ))}
          </div>
        </div>

        {/* Right axis */}
        {(showLine || (secondaryBars && secondaryAxisSide === "right")) && (
          <div className="flex w-[58px] shrink-0 flex-col justify-between text-left" style={{ height: plotH }}>
            {(showLine ? lineTickVals : secondaryBarTickVals).map((t, i) => (
              <span key={i} className="text-[length:var(--body-sm-regular-size,12px)]" style={{ color: AXIS_LABEL }}>
                {t}
                {(showLine ? lineUnit : secondaryBarUnit).trim()}
              </span>
            ))}
          </div>
        )}
        </div>
        </div>
      </div>
    </div>
  );
}

/* ======================================= Fiber dual-axis grouped bars ======= */

export function DualAxisBarChart({
  categories,
  primary,
  secondary,
  indices,
  primaryLabel,
  secondaryLabel,
}: {
  categories: string[];
  primary: number[];
  secondary: number[];
  indices: number[];
  primaryLabel: string;
  secondaryLabel: string;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const primaryColor = CHART.qualitative3;
  const secondaryColor = CHART.qualitative1;
  const plotW = 720;
  const plotH = 230;
  const ticks = 5;
  const n = Math.max(categories.length, 1);
  const slot = plotW / n;
  const groupW = Math.max(18, Math.min(44, slot * 0.66));
  const barW = Math.max(7, groupW / 2 - 2);
  const primaryMax = Math.max(...primary, 1);
  const secondaryMax = Math.max(...secondary, 1);
  const primaryTicks = Array.from({ length: ticks }, (_, i) =>
    Math.round((primaryMax * (ticks - 1 - i)) / (ticks - 1)),
  );
  const secondaryTicks = Array.from({ length: ticks }, (_, i) =>
    ((secondaryMax * (ticks - 1 - i)) / (ticks - 1)).toFixed(0),
  );

  return (
    <div
      className="flex flex-col gap-[var(--spacing-150,12px)]"
      role="group"
      aria-label={`${primaryLabel} and ${secondaryLabel} by channel or app`}
    >
      <div className="flex flex-wrap items-center justify-end gap-[var(--spacing-200,16px)]">
        <span className="flex items-center gap-[var(--spacing-75,6px)] text-[length:var(--body-md-regular-size,14px)]" style={{ color: BODY2 }}>
          <span className="h-[12px] w-[12px] rounded-[var(--radius-25,2px)]" style={{ backgroundColor: primaryColor }} aria-hidden />
          {primaryLabel}
        </span>
        <span className="flex items-center gap-[var(--spacing-75,6px)] text-[length:var(--body-md-regular-size,14px)]" style={{ color: BODY2 }}>
          <span className="h-[12px] w-[12px] rounded-[var(--radius-25,2px)]" style={{ backgroundColor: secondaryColor }} aria-hidden />
          {secondaryLabel}
        </span>
      </div>

      <div className="w-full overflow-x-auto pb-[var(--spacing-100,8px)]">
        <div className="min-w-[680px]">
          <div className="flex items-end gap-[var(--spacing-50,4px)]">
            <span className="w-[62px] shrink-0 text-right text-[10px] font-medium" style={{ color: primaryColor }}>
              {primaryLabel}
            </span>
            <span className="min-w-0 flex-1" />
            <span className="w-[62px] shrink-0 text-left text-[10px] font-medium" style={{ color: secondaryColor }}>
              {secondaryLabel}
            </span>
          </div>

          <div className="flex gap-[var(--spacing-50,4px)]">
            <div className="flex w-[62px] shrink-0 flex-col justify-between text-right" style={{ height: plotH }}>
              {primaryTicks.map((tick) => (
                <span key={tick} className="text-[length:var(--body-sm-regular-size,12px)] tabular-nums" style={{ color: AXIS_LABEL }}>
                  {tick}
                </span>
              ))}
            </div>

            <div className="relative min-w-0 flex-1">
              <div className="relative w-full" style={{ height: plotH }}>
                {primaryTicks.map((_, i) => (
                  <div
                    key={i}
                    className="absolute left-0 right-0 h-0 border-t border-solid"
                    style={{ borderColor: GRID, top: `${(i / (ticks - 1)) * 100}%` }}
                    aria-hidden
                  />
                ))}
                <svg
                  className="absolute inset-0 h-full w-full"
                  viewBox={`0 0 ${plotW} ${plotH}`}
                  preserveAspectRatio="none"
                  role="img"
                  aria-label="Two-series vertical bar chart"
                >
                  {primary.map((value, i) => {
                    const height = (value / primaryMax) * plotH;
                    return (
                      <rect
                        key={`primary-${i}`}
                        x={i * slot + (slot - groupW) / 2}
                        y={plotH - height}
                        width={barW}
                        height={height}
                        rx={1}
                        fill={primaryColor}
                        opacity={hover == null || hover === i ? 1 : 0.45}
                      />
                    );
                  })}
                  {secondary.map((value, i) => {
                    const height = (value / secondaryMax) * plotH;
                    return (
                      <rect
                        key={`secondary-${i}`}
                        x={i * slot + (slot - groupW) / 2 + barW + 4}
                        y={plotH - height}
                        width={barW}
                        height={height}
                        rx={1}
                        fill={secondaryColor}
                        opacity={hover == null || hover === i ? 1 : 0.45}
                      />
                    );
                  })}
                </svg>

                {categories.map((category, i) => (
                  <button
                    key={category}
                    type="button"
                    onMouseEnter={() => setHover(i)}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover(i)}
                    onBlur={() => setHover(null)}
                    className="absolute top-0 h-full focus:outline-none"
                    style={{
                      left: `${(i / n) * 100}%`,
                      width: `${100 / n}%`,
                      backgroundColor: hover === i ? HOVER_BG : "transparent",
                    }}
                    aria-label={`${category}: Index ${indices[i]}%, ${primaryLabel} ${fmtInt(primary[i])}, ${secondaryLabel} ${secondary[i].toFixed(1)}%`}
                  >
                    {hover === i && (
                      <Tooltip
                        lines={[
                          { label: category },
                          { label: "Index", value: `${indices[i]}%` },
                           { label: "Highlight", value: indexExplanation(indices[i]) },
                          { label: primaryLabel, value: fmtInt(primary[i]) },
                          { label: secondaryLabel, value: `${secondary[i].toFixed(1)}%` },
                        ]}
                      />
                    )}
                  </button>
                ))}
              </div>

              <div className="mt-[var(--spacing-75,6px)] flex w-full">
                {categories.map((category, i) => (
                  <div key={category} className="flex flex-col items-center gap-[2px] px-[2px]" style={{ width: `${100 / n}%` }} title={category}>
                    <span className="block w-full truncate text-center text-[length:var(--body-sm-regular-size,12px)]" style={{ color: AXIS_LABEL }}>
                      {category.length > 12 ? `${category.slice(0, 11)}…` : category}
                    </span>
                    <span className="text-[10px] tabular-nums" style={{ color: MUTED }}>
                      Index {indices[i]}%
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex w-[62px] shrink-0 flex-col justify-between text-left" style={{ height: plotH }}>
              {secondaryTicks.map((tick, i) => (
                <span key={i} className="text-[length:var(--body-sm-regular-size,12px)] tabular-nums" style={{ color: AXIS_LABEL }}>
                  {tick}%
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MiniIndex({ index }: { index: number }) {
  const up = index > 100;
  const flat = index === 100;
  const fg = flat ? MUTED : up ? SUCCESS_FG : ERROR_FG;
  return (
    <span className="text-[length:var(--body-sm-medium-size,12px)] font-semibold" style={{ color: fg }} aria-hidden>
      {index}
    </span>
  );
}

/* ============================================= Genre horizontal bars ======= */

export function GenreBars({
  data,
  selected,
  onSelect,
}: {
  data: { name: string; mins: number; pct: number; index: number }[];
  selected: string | null;
  onSelect: (g: string) => void;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const max = Math.max(...data.map((d) => d.mins), 1);
  return (
    <div className="flex flex-col gap-[var(--spacing-100,8px)]" role="group" aria-label="Viewership by genre — select a genre to filter Trends shows">
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
            onMouseEnter={() => setHover(d.name)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(d.name)}
            onBlur={() => setHover(null)}
            aria-pressed={isSel}
            aria-label={`${d.name}: ${fmtInt(d.mins)} minutes per week, ${d.pct.toFixed(1)}% of watch time, index ${d.index} — ${indexExplanation(d.index)}. Select to filter the Trends shows view.`}
            className="relative flex w-full items-center gap-[var(--spacing-150,12px)] rounded-[var(--radius-50,4px)] px-[var(--spacing-75,6px)] py-[3px] text-left focus:outline-none"
            style={{
              opacity: dimmed ? 0.5 : 1,
              backgroundColor: isSel
                ? "var(--container-dynamic-brand-subtle-background-selected, #f6ebff)"
                : hover === d.name
                  ? HOVER_BG
                  : "transparent",
            }}
          >
            <span className="w-[130px] shrink-0 truncate text-[length:var(--body-md-regular-size,14px)]" style={{ color: TITLE }} title={d.name}>
              {d.name}
            </span>
            <span className="flex h-[20px] flex-1 items-center">
              <span
                className="block h-[16px] rounded-[var(--radius-25,2px)]"
                style={{ width: `${(d.mins / max) * 100}%`, backgroundColor: isSel ? CHART.selected : CHART.primary, minWidth: 4 }}
              />
            </span>
            <span className="w-[74px] shrink-0 text-right text-[length:var(--body-sm-regular-size,12px)] tabular-nums" style={{ color: MUTED }}>
              {fmtInt(d.mins)} min
            </span>
            <span className="w-[42px] shrink-0 text-right text-[length:var(--body-sm-regular-size,12px)] tabular-nums" style={{ color: MUTED }}>
              {d.pct.toFixed(0)}%
            </span>
            <span className="flex w-[84px] shrink-0 items-center justify-end gap-[3px]" aria-hidden>
              <Arrow size={12} weight="bold" color={fg} />
              <span className="text-[length:var(--body-sm-medium-size,12px)] font-medium tabular-nums" style={{ color: fg }}>
                {d.index}
              </span>
            </span>
            {hover === d.name && (
              <Tooltip
                lines={[
                  { label: d.name },
                  { label: "Avg minutes/week", value: `${fmtInt(d.mins)} min` },
                  { label: "Share of watch time", value: `${d.pct.toFixed(1)}%` },
                  { label: `Index ${d.index}`, value: indexExplanation(d.index) },
                ]}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}

/* ============================================= Top indexing shows table ==== */

export function ShowsTable({
  rows,
}: {
  rows: { title: string; network: string; mins: number; hhPct: number; index: number }[];
}) {
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[620px] border-collapse">
        <thead>
          <tr>
            {["#", "Show", "Platform", "Avg min/hh", "% households", "Index"].map((h, i) => (
              <th
                key={h}
                className={`border-b border-solid px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)] text-[length:var(--body-sm-medium-size,12px)] font-medium ${i >= 3 ? "text-right" : "text-left"}`}
                style={{ borderColor: GRID, color: MUTED }}
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.title}
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              style={{ backgroundColor: hover === i ? HOVER_BG : "transparent" }}
            >
              <td className="border-b border-solid px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)] text-[length:var(--body-sm-regular-size,12px)] tabular-nums" style={{ borderColor: GRID, color: MUTED }}>
                {i + 1}
              </td>
              <td className="border-b border-solid px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)] text-[length:var(--body-md-regular-size,14px)] font-medium" style={{ borderColor: GRID, color: TITLE }}>
                {r.title}
              </td>
              <td className="border-b border-solid px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)] text-[length:var(--body-sm-regular-size,12px)]" style={{ borderColor: GRID, color: BODY2 }}>
                {r.network}
              </td>
              <td className="border-b border-solid px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)] text-right text-[length:var(--body-md-regular-size,14px)] tabular-nums" style={{ borderColor: GRID, color: TITLE }}>
                {fmtInt(r.mins)}
              </td>
              <td className="border-b border-solid px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)] text-right text-[length:var(--body-sm-regular-size,12px)] tabular-nums" style={{ borderColor: GRID, color: BODY2 }}>
                {r.hhPct.toFixed(1)}%
              </td>
              <td className="border-b border-solid px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)] text-right" style={{ borderColor: GRID }}>
                <span className="inline-flex justify-end">
                  <IndexBadge index={r.index} />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/* ========================================= Show trend drilldown ============ */

export function ShowTrendChart({
  data,
}: {
  data: { period: string; households: number; minutes: number }[];
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const minutesColor = CHART.qualitative3;
  const width = 760;
  const height = 210;
  const left = 48;
  const right = 58;
  const top = 20;
  const bottom = 32;
  const plotW = width - left - right;
  const plotH = height - top - bottom;
  const maxMinutes = Math.max(1, ...data.map((point) => point.minutes)) * 1.15;
  const maxHouseholds =
    Math.max(1, ...data.map((point) => point.households)) * 1.15;
  const x = (index: number) =>
    left + (data.length <= 1 ? plotW / 2 : (index / (data.length - 1)) * plotW);
  const yMinutes = (value: number) => top + plotH - (value / maxMinutes) * plotH;
  const yHouseholds = (value: number) =>
    top + plotH - (value / maxHouseholds) * plotH;
  const minutesPoints = data
    .map((point, index) => `${x(index)},${yMinutes(point.minutes)}`)
    .join(" ");
  const householdPoints = data
    .map((point, index) => `${x(index)},${yHouseholds(point.households)}`)
    .join(" ");

  return (
    <div
      className="relative w-full"
      aria-label="Selected show consumption over four weeks"
    >
      <div
        className="mb-[var(--spacing-75,6px)] flex flex-wrap items-center gap-[var(--spacing-200,16px)]"
        style={{ color: BODY2 }}
      >
        <span className="flex items-center gap-[var(--spacing-75,6px)] text-[length:var(--body-md-regular-size,14px)]">
          <span className="size-[12px] rounded-[var(--radius-25,2px)]" style={{ backgroundColor: CHART.line }} aria-hidden />
          Households watching
        </span>
        <span className="flex items-center gap-[var(--spacing-75,6px)] text-[length:var(--body-md-regular-size,14px)]">
          <span className="size-[12px] rounded-[var(--radius-25,2px)]" style={{ backgroundColor: minutesColor }} aria-hidden />
          Avg. minutes watched per household
        </span>
      </div>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        preserveAspectRatio="none"
        className="h-[210px] w-full overflow-visible"
        role="img"
        aria-label="Four-week dual-axis line chart. Left axis average minutes per household; right axis households watching."
      >
        {[0, 0.25, 0.5, 0.75, 1].map((fraction) => {
          const y = top + plotH - fraction * plotH;
          return (
            <g key={fraction}>
              <line x1={left} x2={width - right} y1={y} y2={y} stroke={GRID} />
              <text x={left - 8} y={y + 3} textAnchor="end" fontSize="10" fill={AXIS_LABEL}>
                {Math.round(maxMinutes * fraction)}
              </text>
              <text x={width - right + 8} y={y + 3} textAnchor="start" fontSize="10" fill={AXIS_LABEL}>
                {`${(maxHouseholds * fraction / 1_000_000).toFixed(1)}M`}
              </text>
            </g>
          );
        })}
        <text x={left} y={11} fontSize="10" fill={AXIS_LABEL}>Avg mins / hh</text>
        <text x={width - right} y={11} textAnchor="end" fontSize="10" fill={AXIS_LABEL}>Households</text>
        <polyline points={householdPoints} fill="none" stroke={CHART.line} strokeWidth="2" />
        <polyline points={minutesPoints} fill="none" stroke={minutesColor} strokeWidth="2" />
        {data.map((point, index) => (
          <g
            key={point.period}
            tabIndex={0}
            aria-label={`${point.period}: ${fmtInt(point.minutes)} average minutes per household; ${fmtInt(point.households)} households watching`}
            onMouseEnter={() => setHovered(index)}
            onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(index)}
            onBlur={() => setHovered(null)}
          >
            <line
              x1={x(index)}
              x2={x(index)}
              y1={top}
              y2={top + plotH}
              stroke={hovered === index ? CHART.baseline : "transparent"}
              strokeDasharray="3 3"
            />
            <circle cx={x(index)} cy={yMinutes(point.minutes)} r="4" fill={minutesColor} />
            <circle cx={x(index)} cy={yHouseholds(point.households)} r="4" fill={CHART.line} />
            <rect
              x={x(index) - plotW / Math.max(data.length, 1) / 2}
              y={top}
              width={plotW / Math.max(data.length - 1, 1)}
              height={plotH}
              fill="transparent"
            />
            <text x={x(index)} y={height - 9} textAnchor="middle" fontSize="10" fill={AXIS_LABEL}>
              {point.period}
            </text>
          </g>
        ))}
      </svg>
      {hovered !== null && data[hovered] && (
        <span
          className="pointer-events-none absolute z-20 block size-px"
          style={{
            left: `${(x(hovered) / width) * 100}%`,
            top: `${34 + Math.min(
              yMinutes(data[hovered].minutes),
              yHouseholds(data[hovered].households),
            )}px`,
          }}
        >
          <Tooltip
            lines={[
              { label: data[hovered].period },
              {
                label: "Households watching",
                value: fmtInt(data[hovered].households),
              },
              {
                label: "Avg. minutes / household",
                value: fmtInt(data[hovered].minutes),
              },
            ]}
          />
        </span>
      )}
    </div>
  );
}

/* ============================================= Temporal heatmap ============ */

/* 7 days × 6 dayparts. Each cell shows avg minutes + % households; intensity
 * maps onto the in-system sequential ramp. */
export function TemporalHeatmap({
  grid,
}: {
  grid: { day: string; part: string; minutes: number; hhPct: number; level: number }[][];
}) {
  const [hover, setHover] = useState<{ d: number; p: number } | null>(null);
  const dayparts = grid[0]?.map((c) => c.part) ?? [];
  return (
    <div className="flex flex-col gap-[var(--spacing-150,12px)]">
      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          {/* Column headers */}
          <div className="flex">
            <div className="w-[48px] shrink-0" />
            {dayparts.map((p) => (
              <div
                key={p}
                className="flex-1 px-[2px] pb-[var(--spacing-50,4px)] text-center text-[length:var(--body-sm-medium-size,12px)] font-medium uppercase tracking-[0.04em]"
                style={{ color: AXIS_LABEL }}
              >
                {p}
              </div>
            ))}
          </div>
          {grid.map((row, di) => (
            <div key={row[0]?.day ?? di} className="flex items-stretch gap-[4px] py-[2px]">
              <div className="flex w-[48px] shrink-0 items-center text-[length:var(--body-sm-regular-size,12px)]" style={{ color: AXIS_LABEL }}>
                {row[0]?.day}
              </div>
              {row.map((cell, pi) => {
                const active = hover?.d === di && hover?.p === pi;
                const bg = HEAT_RAMP[Math.min(HEAT_RAMP.length - 1, Math.max(0, cell.level))];
                const dark = cell.level >= 3;
                return (
                  <button
                    key={pi}
                    type="button"
                    onMouseEnter={() => setHover({ d: di, p: pi })}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover({ d: di, p: pi })}
                    onBlur={() => setHover(null)}
                    aria-label={`${cell.day} ${cell.part}: ${cell.minutes} average minutes watched per household, ${cell.hhPct.toFixed(1)}% of households watching`}
                    className="relative flex h-[46px] flex-1 flex-col items-center justify-center rounded-[var(--radius-25,2px)] focus:outline-none"
                    style={{
                      backgroundColor: bg,
                      boxShadow: active ? `inset 0 0 0 2px ${CHART.selected}` : undefined,
                    }}
                  >
                    <span
                      className="text-[length:var(--body-sm-medium-size,12px)] font-semibold tabular-nums"
                      style={{ color: dark ? LABEL_ON_COLOR : LABEL_ON_LIGHT }}
                    >
                      {cell.minutes}m
                    </span>
                    <span
                      className="text-[length:var(--body-sm-regular-size,12px)] tabular-nums"
                      style={{ color: dark ? "rgba(255,255,255,0.82)" : MUTED }}
                    >
                      {cell.hhPct.toFixed(1)}%
                    </span>
                    {active && (
                      <Tooltip
                        lines={[
                          { label: `${cell.day} · ${cell.part}` },
                          { label: "Avg minutes/hh", value: `${cell.minutes}m` },
                          { label: "% households", value: `${cell.hhPct.toFixed(1)}%` },
                         {
                           label: "Heat intensity",
                           value: `${cell.level + 1} of ${HEAT_RAMP.length} (low → high minutes)`,
                         },
                        ]}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      {/* Low → high legend */}
      <div className="flex items-center gap-[var(--spacing-100,8px)]">
        <span className="text-[length:var(--body-sm-regular-size,12px)]" style={{ color: MUTED }}>
          Low
        </span>
        <span className="flex h-[12px] w-[180px] overflow-hidden rounded-[var(--radius-25,2px)]">
          {HEAT_RAMP.map((c) => (
            <span key={c} className="h-full flex-1" style={{ backgroundColor: c }} />
          ))}
        </span>
        <span className="text-[length:var(--body-sm-regular-size,12px)]" style={{ color: MUTED }}>
          High
        </span>
        <span className="text-[length:var(--body-sm-regular-size,12px)]" style={{ color: MUTED }}>
          · avg mins watched per household
        </span>
      </div>
    </div>
  );
}

/* ============================================= Cultural affinity radar ===== */

/* Eight-parameter radar with a readable numeric ring scale and accessible
 * parameter controls rendered directly on the label/vertex groups. */
export function RadarChart({
  data,
  selected,
  onSelect,
}: {
  data: { name: string; index: number }[];
  selected: string;
  onSelect: (g: string) => void;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const size = 320;
  const cx = size / 2;
  const cy = size / 2;
  const rMax = 118;
  const maxIndex = 200;
  const baseIndexR = (100 / maxIndex) * rMax;
  const n = data.length;
  const angle = (i: number) => (Math.PI * 2 * i) / n - Math.PI / 2;
  const point = (i: number, radius: number) => ({
    x: cx + Math.cos(angle(i)) * radius,
    y: cy + Math.sin(angle(i)) * radius,
  });
  const polyPts = data
    .map((d, i) => {
      const rr = (d.index / maxIndex) * rMax;
      const p = point(i, rr);
      return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
    })
    .join(" ");
  const ringFractions = [0.25, 0.5, 0.75, 1];

  return (
    <div className="flex flex-col items-center gap-[var(--spacing-100,8px)]">
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          role="group"
          aria-label="Cultural affinity radar. Scale zero to 200; national baseline is 100. Select a parameter for details."
        >
          {/* Reference rings + values along the top spoke. */}
          {ringFractions.map((f) => (
            <circle key={f} cx={cx} cy={cy} r={rMax * f} fill="none" stroke={CHART.grid} strokeWidth={1} pointerEvents="none" />
          ))}
          {ringFractions.map((f) => (
            <text
              key={`scale-${f}`}
              x={cx + 4}
              y={cy - rMax * f + 11}
              textAnchor="start"
              pointerEvents="none"
              style={{
                fontFamily: FONT,
                fontSize: 10,
                fontWeight: 500,
                fill: AXIS_LABEL,
              }}
            >
              {Math.round(maxIndex * f)}
            </text>
          ))}
          {/* Baseline (index 100) ring emphasised */}
          <circle cx={cx} cy={cy} r={baseIndexR} fill="none" stroke={CHART.baseline} strokeWidth={1.5} strokeDasharray="4 4" pointerEvents="none" />
          {/* Axes */}
          {data.map((d, i) => {
            const outer = point(i, rMax);
            return (
              <g key={`axis-${d.name}`} pointerEvents="none">
                <line x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke={CHART.grid} strokeWidth={1} />
              </g>
            );
          })}
          {/* Data polygon */}
          <polygon points={polyPts} fill="none" stroke={CHART.primary} strokeWidth={2} strokeLinejoin="round" pointerEvents="none" />
          {/* Each label + vertex is one keyboard-operable selection control. */}
          {data.map((d, i) => {
            const rr = (d.index / maxIndex) * rMax;
            const p = point(i, rr);
            const lbl = point(i, rMax + 18);
            const isSel = selected === d.name;
            const labelWidth = Math.max(28, d.name.length * 6.2);
            const labelLeft =
              lbl.x > cx + 4
                ? lbl.x
                : lbl.x < cx - 4
                  ? lbl.x - labelWidth
                  : lbl.x - labelWidth / 2;
            const labelRight = labelLeft + labelWidth;
            const hitLeft = Math.min(p.x - 12, labelLeft - 4);
            const hitRight = Math.max(p.x + 12, labelRight + 4);
            const hitTop = Math.min(p.y - 12, lbl.y - 10);
            const hitBottom = Math.max(p.y + 12, lbl.y + 10);
            return (
              <g
                key={d.name}
                role="button"
                tabIndex={0}
                aria-pressed={isSel}
                aria-label={`${d.name}: ${d.index}, ${indexExplanation(d.index)}. Select for details.`}
                onClick={() => onSelect(d.name)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    onSelect(d.name);
                  }
                }}
                onMouseEnter={() => setHover(d.name)}
                onMouseLeave={() => setHover(null)}
                onFocus={() => setHover(d.name)}
                onBlur={() => setHover(null)}
                pointerEvents="all"
                style={{ cursor: "pointer" }}
              >
                <title>{`${d.name}: ${d.index}, ${indexExplanation(d.index)}`}</title>
                {/* One continuous transparent hit target joins the vertex and
                    label. It also makes the SVG group's computed click box
                    genuinely clickable at its center (not just on painted
                    glyphs), which is important for pointer and E2E activation. */}
                <rect
                  x={hitLeft}
                  y={hitTop}
                  width={hitRight - hitLeft}
                  height={hitBottom - hitTop}
                  fill="transparent"
                  pointerEvents="all"
                />
                <circle cx={p.x} cy={p.y} r={11} fill="transparent" />
                <circle
                  cx={p.x}
                  cy={p.y}
                  r={isSel || hover === d.name ? 6 : 4}
                  fill={CHART.primary}
                  stroke="var(--surface-background-lvl1, #ffffff)"
                  strokeWidth={isSel ? 3 : 1.5}
                />
                <text
                  x={lbl.x}
                  y={lbl.y}
                  textAnchor={lbl.x > cx + 4 ? "start" : lbl.x < cx - 4 ? "end" : "middle"}
                  dominantBaseline="middle"
                  style={{
                    fontFamily: FONT,
                    fontSize: 10,
                    fontWeight: isSel ? 700 : 500,
                    fill: AXIS_LABEL,
                    textDecoration: isSel ? "underline" : "none",
                  }}
                >
                  {d.name}
                </text>
              </g>
            );
          })}
        </svg>
        {hover && (() => {
          const index = data.findIndex((item) => item.name === hover);
          if (index < 0) return null;
          const datum = data[index];
          const rr = (datum.index / maxIndex) * rMax;
          const p = point(index, rr);
          return (
            <span
              className="pointer-events-none absolute size-px"
              style={{ left: p.x, top: p.y }}
            >
              <Tooltip
                lines={[
                  { label: datum.name },
                  { label: "Index", value: `${datum.index}` },
                  { label: "Highlight", value: indexExplanation(datum.index) },
                  { label: "Baseline", value: "National average = 100" },
                ]}
              />
            </span>
          );
        })()}
      </div>
      <span className="text-[length:var(--body-sm-regular-size,12px)]" style={{ color: MUTED }}>
        Dashed ring = national average (100). Select a parameter to view its details.
      </span>
    </div>
  );
}

/* Supporting affinity list below the radar. */
export function AffinityList({
  data,
  selected,
  onSelect,
}: {
  data: { name: string; index: number }[];
  selected: string | null;
  onSelect: (g: string) => void;
}) {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <div className="flex flex-col" role="group" aria-label="Affinity genres — click to reveal top shows">
      {data.map((d) => {
        const up = d.index > 100;
        const flat = d.index === 100;
        const fg = flat ? MUTED : up ? SUCCESS_FG : ERROR_FG;
        const Arrow = flat ? Minus : up ? ArrowUp : ArrowDown;
        const isSel = selected === d.name;
        return (
          <button
            key={d.name}
            type="button"
            onClick={() => onSelect(d.name)}
            onMouseEnter={() => setHover(d.name)}
            onMouseLeave={() => setHover(null)}
            onFocus={() => setHover(d.name)}
            onBlur={() => setHover(null)}
            aria-pressed={isSel}
            aria-label={`${d.name}: index ${d.index}, ${indexExplanation(d.index)}. Click to reveal top shows.`}
            className="flex items-center justify-between gap-[var(--spacing-100,8px)] border-b border-solid px-[var(--spacing-75,6px)] py-[var(--spacing-75,6px)] text-left focus:outline-none"
            style={{
              borderColor: GRID,
              backgroundColor: isSel
                ? "var(--container-dynamic-brand-subtle-background-selected, #f6ebff)"
                : hover === d.name
                  ? HOVER_BG
                  : "transparent",
            }}
          >
            <span className="text-[length:var(--body-md-regular-size,14px)]" style={{ color: isSel ? CHART.selected : TITLE, fontWeight: isSel ? 600 : 400 }}>
              {d.name}
            </span>
            <span className="flex items-center gap-[var(--spacing-100,8px)]">
              <span className="text-[length:var(--body-md-medium-size,14px)] font-semibold tabular-nums" style={{ color: TITLE }}>
                {d.index}
              </span>
              <span className="flex w-[64px] items-center justify-end gap-[3px]" aria-hidden>
                <Arrow size={12} weight="bold" color={fg} />
                <span className="text-[length:var(--body-sm-medium-size,12px)] font-medium tabular-nums" style={{ color: fg }}>
                  {up ? "+" : flat ? "" : "−"}
                  {Math.abs(d.index - 100)}
                </span>
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ============================================= Migration Sankey ============ */

/* Fiber Sankey: the three strongest next behaviours ("From") flow into the two
 * strongest destinations plus an aggregated remainder ("To"). The smooth
 * ribbon thickness is the real audience share from the existing migration
 * model; nodes and ribbons use only the categorical chart-token palette. */
export function MigrationSankey({
  source,
  branches,
}: {
  source: { title: string; network: string };
  branches: {
    behaviour: string;
    share: number;
    destinations: { title: string; network: string; share: number }[];
  }[];
}) {
  const [hover, setHover] = useState<string | null>(null);
  const width = 720;
  const height = 350;
  const sourceX = 150;
  const targetX = 540;
  const nodeW = 10;
  const plotTop = 48;
  const plotBottom = 326;
  const gap = 18;
  const sourceRows = branches.slice(0, 3);
  const colors = [CHART.primary, CHART.line, CHART.quaternary];

  // Pick the two strongest named destinations. Everything else (including
  // "Stop watching") becomes the third, explicit drop/remainder target.
  const destinationTotals = new Map<string, { label: string; value: number }>();
  for (const branch of sourceRows) {
    for (const destination of branch.destinations) {
      const key = `${destination.title}||${destination.network}`;
      const current = destinationTotals.get(key);
      destinationTotals.set(key, {
        label: `${destination.title} · ${destination.network}`,
        value: (current?.value ?? 0) + destination.share,
      });
    }
  }
  const strongest = Array.from(destinationTotals.entries())
    .sort((a, b) => b[1].value - a[1].value)
    .slice(0, 2);
  const targetKeys = [
    strongest[0]?.[0] ?? "destination-1",
    strongest[1]?.[0] ?? "destination-2",
    "__other__",
  ];
  const targetLabels = [
    strongest[0]?.[1].label ?? "Primary destination",
    strongest[1]?.[1].label ?? "Secondary destination",
    "Other / stopped watching",
  ];

  const rawFlows: {
    id: string;
    sourceIndex: number;
    targetIndex: number;
    from: string;
    to: string;
    value: number;
    color: string;
  }[] = [];
  sourceRows.forEach((branch, sourceIndex) => {
    if (branch.destinations.length === 0) {
      rawFlows.push({
        id: `${sourceIndex}-stopped`,
        sourceIndex,
        targetIndex: 2,
        from: branch.behaviour,
        to: targetLabels[2],
        value: branch.share,
        color: colors[sourceIndex],
      });
      return;
    }
    const groupedValues = [0, 0, 0];
    for (const destination of branch.destinations) {
      const key = `${destination.title}||${destination.network}`;
      const targetIndex = key === targetKeys[0] ? 0 : key === targetKeys[1] ? 1 : 2;
      groupedValues[targetIndex] += destination.share;
    }
    groupedValues.forEach((value, targetIndex) => {
      if (value <= 0) return;
      rawFlows.push({
        id: `${sourceIndex}-${targetIndex}`,
        sourceIndex,
        targetIndex,
        from: branch.behaviour,
        to: targetLabels[targetIndex],
        value,
        color: colors[sourceIndex],
      });
    });
  });

  const total = Math.max(
    sourceRows.reduce((sum, branch) => sum + branch.share, 0),
    1,
  );
  const scale = (plotBottom - plotTop - gap * 2) / total;
  const sourceValues = sourceRows.map((branch) => branch.share);
  const targetValues = [0, 0, 0];
  rawFlows.forEach((flow) => {
    targetValues[flow.targetIndex] += flow.value;
  });
  const stackNodes = (values: number[]) => {
    let y = plotTop;
    return values.map((value) => {
      const node = { y, height: Math.max(value * scale, 2) };
      y += node.height + gap;
      return node;
    });
  };
  const sourceNodes = stackNodes(sourceValues);
  const targetNodes = stackNodes(targetValues);
  const sourceOffsets = [0, 0, 0];
  const targetOffsets = [0, 0, 0];
  const flows = rawFlows.map((flow) => {
    const thickness = Math.max(flow.value * scale, 1);
    const sy0 = sourceNodes[flow.sourceIndex].y + sourceOffsets[flow.sourceIndex];
    const ty0 = targetNodes[flow.targetIndex].y + targetOffsets[flow.targetIndex];
    sourceOffsets[flow.sourceIndex] += thickness;
    targetOffsets[flow.targetIndex] += thickness;
    return { ...flow, thickness, sy0, ty0 };
  });
  const activeFlow = flows.find((flow) => flow.id === hover) ?? null;

  return (
    <div className="flex flex-col gap-[var(--spacing-100,8px)]">
      <div className="relative w-full overflow-x-auto">
        <svg
          className="block h-auto w-full min-w-[560px]"
          viewBox={`0 0 ${width} ${height}`}
          aria-hidden="true"
          focusable="false"
        >
          <text x={sourceX} y={18} fill={MUTED} fontFamily={FONT} fontSize={12} fontWeight={600}>
            From
          </text>
          <text x={targetX + nodeW} y={18} fill={MUTED} fontFamily={FONT} fontSize={12} fontWeight={600} textAnchor="end">
            To
          </text>

          {/* Wide translucent ribbons; thickness is the real migration share. */}
          {flows.map((flow) => {
            const sx = sourceX + nodeW;
            const tx = targetX;
            const sy1 = flow.sy0 + flow.thickness;
            const ty1 = flow.ty0 + flow.thickness;
            const c1 = sx + (tx - sx) * 0.42;
            const c2 = sx + (tx - sx) * 0.58;
            const path = [
              `M ${sx} ${flow.sy0}`,
              `C ${c1} ${flow.sy0}, ${c2} ${flow.ty0}, ${tx} ${flow.ty0}`,
              `L ${tx} ${ty1}`,
              `C ${c2} ${ty1}, ${c1} ${sy1}, ${sx} ${sy1}`,
              "Z",
            ].join(" ");
            const dimmed = hover != null && hover !== flow.id;
            return (
              <path
                key={flow.id}
                d={path}
                fill={flow.color}
                opacity={dimmed ? 0.12 : hover === flow.id ? 0.68 : 0.4}
                onMouseEnter={() => setHover(flow.id)}
                onMouseLeave={() => setHover(null)}
                style={{ cursor: "default", transition: "opacity 150ms ease" }}
              />
            );
          })}

          {/* Slim full-opacity source and target bars, matching the reference. */}
          {sourceNodes.map((node, index) => (
            <g key={`source-${sourceRows[index].behaviour}`}>
              <rect
                x={sourceX}
                y={node.y}
                width={nodeW}
                height={node.height}
                rx={1}
                fill={colors[index]}
              />
              <text
                x={sourceX - 8}
                y={node.y + node.height / 2}
                fill={TITLE}
                fontFamily={FONT}
                fontSize={11}
                textAnchor="end"
                dominantBaseline="middle"
              >
                {sourceRows[index].behaviour.length > 22
                  ? `${sourceRows[index].behaviour.slice(0, 21)}…`
                  : sourceRows[index].behaviour}
              </text>
            </g>
          ))}
          {targetNodes.map((node, index) => (
            <g key={`target-${targetLabels[index]}`}>
              <rect
                x={targetX}
                y={node.y}
                width={nodeW}
                height={node.height}
                rx={1}
                fill={[CHART.primary, CHART.line, CHART.quaternary][index]}
              />
              <text
                x={targetX + nodeW + 8}
                y={node.y + node.height / 2}
                fill={TITLE}
                fontFamily={FONT}
                fontSize={11}
                dominantBaseline="middle"
              >
                {targetLabels[index].length > 24
                  ? `${targetLabels[index].slice(0, 23)}…`
                  : targetLabels[index]}
              </text>
            </g>
          ))}
        </svg>

        {activeFlow && (
          <span
            className="pointer-events-none absolute z-20 block size-px"
            style={{
              left: "50%",
              top: `${((activeFlow.sy0 + activeFlow.ty0 + activeFlow.thickness) / 2 / height) * 100}%`,
            }}
          >
            <Tooltip
              lines={[
                { label: `${activeFlow.from} → ${activeFlow.to}` },
                { label: "Flow share", value: `${activeFlow.value.toFixed(1)}%` },
                {
                  label: "Drop from source",
                  value: `${(100 - activeFlow.value).toFixed(1)}%`,
                },
                { label: "Window", value: "Within 1 hour" },
              ]}
            />
          </span>
        )}
      </div>
      {/* The SVG is decorative to assistive technology; expose the complete
          flow data once, consistently, as semantic text instead of presenting
          non-activating SVG paths as buttons. */}
      <ul
        className="sr-only"
        aria-label={`Migration flows from ${source.title} within one hour`}
      >
        {flows.map((flow) => (
          <li key={`accessible-${flow.id}`}>
            From {flow.from} to {flow.to}: {flow.value.toFixed(1)}% share,{" "}
            {(100 - flow.value).toFixed(1)}% drop from the source audience.
          </li>
        ))}
      </ul>
      <p
        className="text-[length:var(--body-sm-regular-size,12px)]"
        style={{ color: MUTED }}
      >
        Source audience: {source.title} · {source.network}. Ribbon width represents the share moving within one hour.
      </p>
    </div>
  );
}
