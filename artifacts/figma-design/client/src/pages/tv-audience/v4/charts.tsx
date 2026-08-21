/* =========================================================================
 * TV Audience & Content Planner — V4 chart components
 *
 * Hand-rolled, token-driven SVG/flex visualisations faithful to the wireframe.
 * Every colour comes from the chart token layer (./chartTokens) mapped to Fiber
 * design tokens via inline style var(--token, #fallback). No chart library, no
 * arbitrary hex, no library-default palette. No nested interactive controls;
 * hover/selected via local state + inline style. Meaningful tooltips per §19.
 * ========================================================================= */

import { useState } from "react";
import { ArrowUp, ArrowDown, Minus, ArrowRight } from "@phosphor-icons/react";
import {
  FONT,
  GRID,
  AXIS_LABEL,
  TITLE,
  MUTED,
  BODY2,
  SURFACE2,
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

/* Shared dark tooltip surface (Fiber tooltip style). */
function Tooltip({ lines }: { lines: { label: string; value?: string }[] }) {
  return (
    <span
      className="pointer-events-none absolute bottom-full left-1/2 z-20 mb-[6px] flex -translate-x-1/2 flex-col gap-[2px] whitespace-nowrap rounded-[var(--radius-50,4px)] px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)] text-left"
      style={{ backgroundColor: TOOLTIP_BG, boxShadow: CARD_SHADOW }}
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
    </span>
  );
}

/* ============================================ Consumption donut ============ */

export function DonutChart({
  data,
  selected,
  onSelect,
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
}) {
  const [hover, setHover] = useState<string | null>(null);
  const size = 200;
  const r = 78;
  const stroke = 30;
  const cx = size / 2;
  const cy = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const active = hover ?? selected;
  const activeSeg = data.find((d) => d.key === active) ?? null;

  return (
    <div className="flex flex-col items-center gap-[var(--spacing-200,16px)] sm:flex-row sm:items-center">
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
              />
            );
          })}
        </svg>
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
  bars,
  line,
  indices,
  barLabel,
  lineLabel,
  barUnit = "",
  lineUnit = "",
  onSelect,
  selectedIndex,
}: {
  categories: string[];
  bars: number[];
  line: number[];
  indices?: number[];
  barLabel: string;
  lineLabel: string;
  barUnit?: string;
  lineUnit?: string;
  onSelect?: (i: number) => void;
  selectedIndex?: number | null;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const plotW = 720;
  const plotH = 240;
  const barMax = Math.max(...bars, 1);
  const lineMax = Math.max(...line, 1);
  const n = categories.length;
  const slot = plotW / Math.max(n, 1);
  const colW = Math.max(14, Math.min(30, slot * 0.55));
  const yTicks = 5;
  const barTickVals = Array.from({ length: yTicks }, (_, i) =>
    Math.round((barMax * (yTicks - 1 - i)) / (yTicks - 1)),
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
      <div className="flex flex-wrap items-center gap-x-[var(--spacing-200,16px)] gap-y-[var(--spacing-75,6px)]">
        <div className="flex items-center gap-[var(--spacing-75,6px)]">
          <span
            className="block h-[12px] w-[12px] rounded-[var(--radius-25,2px)]"
            style={{ backgroundColor: CHART.primary }}
          />
          <span className="text-[length:var(--body-md-regular-size,14px)]" style={{ color: AXIS_LABEL }}>
            {barLabel}
          </span>
        </div>
        <div className="flex items-center gap-[var(--spacing-75,6px)]">
          <span className="block h-[3px] w-[16px] rounded-full" style={{ backgroundColor: CHART.line }} />
          <span className="text-[length:var(--body-md-regular-size,14px)]" style={{ color: AXIS_LABEL }}>
            {lineLabel}
          </span>
        </div>
      </div>

      <div className="flex w-full">
        {/* Left axis */}
        <div className="flex flex-col justify-between pr-[var(--spacing-100,8px)] text-right" style={{ height: plotH }}>
          {barTickVals.map((t, i) => (
            <span key={i} className="text-[length:var(--body-sm-regular-size,12px)]" style={{ color: AXIS_LABEL }}>
              {t}
            </span>
          ))}
        </div>

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
              aria-label={`${barLabel} bars with ${lineLabel} line overlay`}
            >
              {bars.map((v, i) => {
                const h = (v / barMax) * plotH;
                const x = i * slot + (slot - colW) / 2;
                const isSel = selectedIndex === i;
                return (
                  <rect
                    key={i}
                    x={x}
                    y={plotH - h}
                    width={colW}
                    height={h}
                    rx={1}
                    fill={isSel ? CHART.selected : CHART.primary}
                    opacity={hover == null || hover === i ? 1 : 0.5}
                  />
                );
              })}
              <polyline
                points={linePts.map((p) => `${p.cx},${p.cy}`).join(" ")}
                fill="none"
                stroke={CHART.line}
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
              {linePts.map((p, i) => (
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
                aria-label={`${c}: ${barLabel} ${fmtInt(bars[i])}${barUnit}, ${lineLabel} ${line[i].toFixed(1)}${lineUnit}${indices ? `, index ${indices[i]} — ${indexExplanation(indices[i])}` : ""}`}
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
                      { label: barLabel, value: `${fmtInt(bars[i])}${barUnit}` },
                      { label: lineLabel, value: `${line[i].toFixed(1)}${lineUnit}` },
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
                {indices && <MiniIndex index={indices[i]} />}
              </div>
            ))}
          </div>
        </div>

        {/* Right axis */}
        <div className="flex flex-col justify-between pl-[var(--spacing-100,8px)] text-left" style={{ height: plotH }}>
          {lineTickVals.map((t, i) => (
            <span key={i} className="text-[length:var(--body-sm-regular-size,12px)]" style={{ color: AXIS_LABEL }}>
              {t}
              {lineUnit.trim()}
            </span>
          ))}
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
    <div className="flex flex-col gap-[var(--spacing-100,8px)]" role="group" aria-label="Viewership by genre — click to cross-filter">
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
            aria-label={`${d.name}: ${fmtInt(d.mins)} minutes per week, ${d.pct.toFixed(1)}% of watch time, index ${d.index} — ${indexExplanation(d.index)}. Click to set as affinity anchor and shows genre.`}
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

/* Custom radar/star diagram: anchor genre + top over-indexing genres on axes,
 * with a 100 = national-average baseline ring. */
export function RadarChart({
  data,
  anchor,
  selected,
  onSelect,
}: {
  data: { name: string; index: number }[];
  anchor: string;
  selected: string | null;
  onSelect: (g: string) => void;
}) {
  const [hover, setHover] = useState<string | null>(null);
  const size = 300;
  const cx = size / 2;
  const cy = size / 2;
  const rMax = 118;
  const maxIndex = Math.max(...data.map((d) => d.index), 160);
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

  return (
    <div className="flex flex-col items-center gap-[var(--spacing-100,8px)]">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Cultural affinity radar anchored to ${anchor}; baseline ring = national average (index 100)`}>
          {/* Reference rings */}
          {[0.5, 0.75, 1].map((f) => (
            <circle key={f} cx={cx} cy={cy} r={rMax * f} fill="none" stroke={CHART.grid} strokeWidth={1} />
          ))}
          {/* Baseline (index 100) ring emphasised */}
          <circle cx={cx} cy={cy} r={baseIndexR} fill="none" stroke={CHART.baseline} strokeWidth={1.5} strokeDasharray="4 4" />
          {/* Axes + labels */}
          {data.map((d, i) => {
            const outer = point(i, rMax);
            const lbl = point(i, rMax + 14);
            const isSel = selected === d.name || anchor === d.name;
            return (
              <g key={d.name}>
                <line x1={cx} y1={cy} x2={outer.x} y2={outer.y} stroke={CHART.grid} strokeWidth={1} />
                <text
                  x={lbl.x}
                  y={lbl.y}
                  textAnchor={lbl.x > cx + 4 ? "start" : lbl.x < cx - 4 ? "end" : "middle"}
                  dominantBaseline="middle"
                  style={{
                    fontFamily: FONT,
                    fontSize: 11,
                    fontWeight: isSel ? 700 : 500,
                    fill: isSel ? CHART.selected : AXIS_LABEL,
                  }}
                >
                  {d.name}
                </text>
              </g>
            );
          })}
          {/* Data polygon */}
          <polygon points={polyPts} fill={CHART.primary} fillOpacity={0.18} stroke={CHART.primary} strokeWidth={2} strokeLinejoin="round" />
          {/* Vertices (clickable) */}
          {data.map((d, i) => {
            const rr = (d.index / maxIndex) * rMax;
            const p = point(i, rr);
            const isSel = selected === d.name;
            return (
              <circle
                key={d.name}
                cx={p.x}
                cy={p.y}
                r={isSel || hover === d.name ? 6 : 4}
                fill={isSel ? CHART.selected : CHART.primary}
                stroke="var(--surface-background-lvl1, #ffffff)"
                strokeWidth={1.5}
              />
            );
          })}
        </svg>
        {/* Clickable overlay hotspots for each vertex (keyboard + tooltip). */}
        {data.map((d, i) => {
          const rr = (d.index / maxIndex) * rMax;
          const p = point(i, rr);
          return (
            <button
              key={d.name}
              type="button"
              onClick={() => onSelect(d.name)}
              onMouseEnter={() => setHover(d.name)}
              onMouseLeave={() => setHover(null)}
              onFocus={() => setHover(d.name)}
              onBlur={() => setHover(null)}
              aria-pressed={selected === d.name}
              aria-label={`${d.name}: index ${d.index} — ${indexExplanation(d.index)}. Click to reveal its top indexing shows.`}
              className="absolute h-[22px] w-[22px] -translate-x-1/2 -translate-y-1/2 rounded-full focus:outline-none focus-visible:ring-2"
              style={{ left: p.x, top: p.y, backgroundColor: "transparent" }}
            >
              {hover === d.name && <Tooltip lines={[{ label: d.name }, { label: "Index", value: `${d.index}` }, { label: "vs national avg", value: indexExplanation(d.index) }]} />}
            </button>
          );
        })}
      </div>
      <span className="text-[length:var(--body-sm-regular-size,12px)]" style={{ color: MUTED }}>
        Dashed ring = national average (index 100). Click a genre to reveal its top shows.
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

/* Custom Sankey: source show → up to 3 next-behaviour branches, each fanning
 * into up to 3 destination shows/networks within a 1-hour window. Flow-weight
 * shown by band width + % label; tooltips expose source/destination/%/window. */
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
  const maxShare = Math.max(...branches.map((b) => b.share), 1);

  return (
    <div className="flex flex-col gap-[var(--spacing-100,8px)] lg:flex-row lg:items-stretch lg:gap-[var(--spacing-200,16px)]">
      {/* Source node */}
      <div className="flex items-center lg:w-[200px] lg:shrink-0">
        <div
          className="flex w-full flex-col gap-[var(--spacing-25,2px)] rounded-[var(--radius-50,4px)] p-[var(--spacing-150,12px)]"
          style={{
            backgroundColor: "var(--container-dynamic-brand-subtle-background-selected, #f6ebff)",
            border: `1px solid ${CHART.selected}`,
          }}
        >
          <span className="text-[length:var(--body-sm-medium-size,12px)] font-semibold uppercase tracking-[0.06em]" style={{ color: CHART.selected }}>
            Source
          </span>
          <span className="text-[length:var(--body-md-medium-size,14px)] font-semibold" style={{ color: TITLE, fontFamily: FONT }}>
            {source.title}
          </span>
          <span className="text-[length:var(--body-sm-regular-size,12px)]" style={{ color: MUTED }}>
            {source.network} · within 1 hour
          </span>
        </div>
      </div>

      {/* Connector */}
      <div className="flex items-center justify-center py-[var(--spacing-50,4px)] lg:py-0">
        <ArrowRight size={22} color={MUTED} aria-hidden />
      </div>

      {/* Behaviour branches → destinations */}
      <div className="flex flex-1 flex-col gap-[var(--spacing-150,12px)]">
        {branches.map((b) => {
          const w = 0.4 + 0.6 * (b.share / maxShare); // relative band emphasis
          return (
            <div key={b.behaviour} className="flex flex-col gap-[var(--spacing-75,6px)]">
              {/* Behaviour band */}
              <div className="flex items-center gap-[var(--spacing-100,8px)]">
                <span
                  className="relative flex h-[26px] shrink-0 items-center justify-center rounded-[var(--radius-25,2px)] px-[var(--spacing-100,8px)]"
                  onMouseEnter={() => setHover(`b-${b.behaviour}`)}
                  onMouseLeave={() => setHover(null)}
                  style={{ backgroundColor: CHART.primary, opacity: w, minWidth: 54 }}
                >
                  <span className="text-[length:var(--body-sm-medium-size,12px)] font-semibold tabular-nums" style={{ color: LABEL_ON_COLOR }}>
                    {b.share.toFixed(0)}%
                  </span>
                  {hover === `b-${b.behaviour}` && (
                    <Tooltip lines={[{ label: "From", value: source.title }, { label: "Behaviour", value: b.behaviour }, { label: "% of audience", value: `${b.share.toFixed(1)}%` }, { label: "Window", value: "1 hour" }]} />
                  )}
                </span>
                <span className="text-[length:var(--body-md-medium-size,14px)] font-medium" style={{ color: TITLE }}>
                  {b.behaviour}
                </span>
              </div>
              {/* Destinations */}
              {b.destinations.length > 0 && (
                <div className="flex flex-col gap-[4px] pl-[var(--spacing-300,24px)]">
                  {b.destinations.map((dst) => (
                    <div
                      key={dst.title}
                      className="relative flex items-center gap-[var(--spacing-100,8px)] rounded-[var(--radius-50,4px)] p-[var(--spacing-75,6px)]"
                      onMouseEnter={() => setHover(`d-${b.behaviour}-${dst.title}`)}
                      onMouseLeave={() => setHover(null)}
                      style={{ backgroundColor: SURFACE2, border: `1px solid ${GRID}` }}
                    >
                      <span className="flex h-[24px] w-[42px] shrink-0 items-center justify-center rounded-[var(--radius-25,2px)] text-[length:var(--body-sm-medium-size,12px)] font-semibold tabular-nums" style={{ backgroundColor: CHART.secondary, color: LABEL_ON_COLOR }}>
                        {dst.share.toFixed(0)}%
                      </span>
                      <span className="min-w-0 flex-1 truncate text-[length:var(--body-md-regular-size,14px)]" style={{ color: TITLE }} title={dst.title}>
                        {dst.title}
                      </span>
                      <span className="shrink-0 text-[length:var(--body-sm-regular-size,12px)]" style={{ color: MUTED }}>
                        {dst.network}
                      </span>
                      {hover === `d-${b.behaviour}-${dst.title}` && (
                        <Tooltip lines={[{ label: "Source", value: source.title }, { label: "Destination", value: `${dst.title} (${dst.network})` }, { label: "% of audience", value: `${dst.share.toFixed(1)}%` }, { label: "Window", value: "1 hour" }]} />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
