/* =========================================================================
 * TV Audience & Content Planner — V3 chart components
 *
 * Hand-rolled, token-driven SVG/flex visualisations (same approach as the V2
 * dashboard). No chart library dependency. Every colour is a Fiber token via
 * inline style var(--token, #fallback). No nested interactive controls.
 * ========================================================================= */

import { useState } from "react";
import { ArrowUp, ArrowDown, Minus, ArrowRight } from "@phosphor-icons/react";
import {
  FONT,
  DATAVIS,
  GRID,
  AXIS_LABEL,
  TITLE,
  MUTED,
  BODY2,
  BRAND,
  SURFACE2,
  SUCCESS_FG,
  ERROR_FG,
  CARD_SHADOW,
  HOVER_BG,
  SELECTED_BG,
  fmtInt,
  IndexBadge,
} from "./primitives";
import { DAYS, DAYPARTS } from "./data";
import type { ConsumptionKey, TvType } from "./data";

const TOOLTIP_BG = "var(--surface-background-lvl6, #282833)";
const TOOLTIP_FG = "var(--surface-foreground-static-neutral-inversed, #ffffff)";
const TOOLTIP_FG2 = "var(--surface-foreground-static-neutral-lvl4, #c6c6cc)";
const LABEL_ADAPTIVE = "var(--datavis-labels-adaptive, #ffffff)";

/* ============================================ §1 Consumption by Type ======= */

export function ConsumptionSegments({
  data,
  total,
  selected,
  onSelect,
}: {
  data: {
    key: ConsumptionKey;
    name: string;
    color: string;
    minutes: number;
    pct: number;
  }[];
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
            <span
              className="block h-[12px] w-[12px] shrink-0 rounded-[var(--radius-25,2px)]"
              style={{ backgroundColor: d.color }}
            />
            <span
              className="text-[length:var(--body-md-regular-size,14px)]"
              style={{ color: AXIS_LABEL }}
            >
              {d.name}
            </span>
          </div>
        ))}
      </div>

      {/* Stacked bar — buttons per segment for keyboard access */}
      <div
        className="flex h-[56px] w-full overflow-hidden rounded-[var(--radius-50,4px)]"
        role="group"
        aria-label="Consumption type segments — click to cross-filter"
      >
        {data.map((d) => {
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
              aria-label={`${d.name}: ${d.pct.toFixed(1)}% of minutes watched. Click to cross-filter downstream sections.`}
              className="relative flex h-full items-center justify-center transition-opacity focus:outline-none focus-visible:ring-2"
              style={{
                width: `${d.pct}%`,
                backgroundColor: d.color,
                opacity: dimmed ? 0.4 : 1,
                boxShadow: isSel
                  ? "inset 0 0 0 2px var(--surface-foreground-static-neutral-lvl1, #13131a)"
                  : undefined,
              }}
            >
              {d.pct > 8 && (
                <span
                  className="text-[length:var(--body-sm-medium-size,12px)] font-medium"
                  style={{ color: LABEL_ADAPTIVE }}
                >
                  {d.pct.toFixed(0)}%
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Per-segment detail cards */}
      <div className="grid grid-cols-2 gap-[var(--spacing-100,8px)] sm:grid-cols-4">
        {data.map((d) => {
          const active = hover === d.key || selected === d.key;
          return (
            <div
              key={d.key}
              className="flex flex-col gap-[var(--spacing-25,2px)] rounded-[var(--radius-50,4px)] p-[var(--spacing-100,8px)]"
              style={{
                backgroundColor: active ? SURFACE2 : "transparent",
                border: `1px solid ${GRID}`,
              }}
            >
              <div className="flex items-center gap-[var(--spacing-75,6px)]">
                <span
                  className="block h-[10px] w-[10px] rounded-[var(--radius-25,2px)]"
                  style={{ backgroundColor: d.color }}
                />
                <span
                  className="text-[length:var(--body-sm-medium-size,12px)] font-medium"
                  style={{ color: TITLE }}
                >
                  {d.name}
                </span>
              </div>
              <span
                className="text-[length:var(--body-md-regular-size,14px)] font-semibold"
                style={{ color: TITLE }}
              >
                {d.pct.toFixed(1)}%
              </span>
              <span
                className="text-[length:var(--body-sm-regular-size,12px)]"
                style={{ color: MUTED }}
              >
                {fmtInt(d.minutes)} min / hh
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================== §2 Combo bar + line ======== */

export function ComboChart({
  categories,
  bars,
  line,
  indices,
  barLabel,
  lineLabel,
  barUnit = "",
  lineUnit = "",
  rotateLabels = false,
}: {
  categories: string[];
  bars: number[];
  line: number[];
  indices?: number[];
  barLabel: string;
  lineLabel: string;
  barUnit?: string;
  lineUnit?: string;
  rotateLabels?: boolean;
}) {
  const [hover, setHover] = useState<number | null>(null);
  const plotW = 720;
  const plotH = 240;
  const barMax = Math.max(...bars, 1);
  const lineMax = Math.max(...line, 1);
  const n = categories.length;
  const slot = plotW / n;
  const colW = Math.max(16, Math.min(28, slot * 0.5));
  const yTicks = 5;
  const barTickVals = Array.from({ length: yTicks }, (_, i) =>
    Math.round((barMax * (yTicks - 1 - i)) / (yTicks - 1)),
  );
  const lineTickVals = Array.from({ length: yTicks }, (_, i) =>
    Math.round((lineMax * (yTicks - 1 - i)) / (yTicks - 1)),
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
            style={{ backgroundColor: DATAVIS[0] }}
          />
          <span
            className="text-[length:var(--body-md-regular-size,14px)]"
            style={{ color: AXIS_LABEL }}
          >
            {barLabel}
          </span>
        </div>
        <div className="flex items-center gap-[var(--spacing-75,6px)]">
          <span
            className="block h-[3px] w-[16px] rounded-full"
            style={{ backgroundColor: DATAVIS[2] }}
          />
          <span
            className="text-[length:var(--body-md-regular-size,14px)]"
            style={{ color: AXIS_LABEL }}
          >
            {lineLabel}
          </span>
        </div>
      </div>

      <div className="flex w-full">
        {/* Left axis */}
        <div
          className="flex flex-col justify-between pr-[var(--spacing-100,8px)] text-right"
          style={{ height: plotH }}
        >
          {barTickVals.map((t, i) => (
            <span
              key={i}
              className="text-[length:var(--body-sm-regular-size,12px)]"
              style={{ color: AXIS_LABEL }}
            >
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
                return (
                  <rect
                    key={i}
                    x={x}
                    y={plotH - h}
                    width={colW}
                    height={h}
                    rx={1}
                    fill={DATAVIS[0]}
                    opacity={hover == null || hover === i ? 1 : 0.5}
                  />
                );
              })}
              <polyline
                points={linePts.map((p) => `${p.cx},${p.cy}`).join(" ")}
                fill="none"
                stroke={DATAVIS[2]}
                strokeWidth={2}
                vectorEffect="non-scaling-stroke"
              />
              {linePts.map((p, i) => (
                <circle
                  key={i}
                  cx={p.cx}
                  cy={p.cy}
                  r={3}
                  fill={DATAVIS[2]}
                  vectorEffect="non-scaling-stroke"
                />
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
                className="absolute top-0 h-full focus:outline-none"
                style={{
                  left: `${(i / n) * 100}%`,
                  width: `${100 / n}%`,
                  backgroundColor: hover === i ? HOVER_BG : "transparent",
                }}
                aria-label={`${c}: ${barLabel} ${fmtInt(bars[i])}${barUnit}, ${lineLabel} ${line[i].toFixed(1)}${lineUnit}${indices ? `, index ${indices[i]} vs national average` : ""}`}
              >
                {hover === i && (
                  <span
                    className="pointer-events-none absolute left-1/2 top-1 z-10 flex -translate-x-1/2 flex-col gap-[var(--spacing-25,2px)] whitespace-nowrap rounded-[var(--radius-50,4px)] px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)] text-left"
                    style={{ backgroundColor: TOOLTIP_BG, boxShadow: CARD_SHADOW }}
                  >
                    <span
                      className="text-[length:var(--body-sm-medium-size,12px)] font-medium"
                      style={{ color: TOOLTIP_FG }}
                    >
                      {c}
                    </span>
                    <span
                      className="text-[length:var(--body-sm-regular-size,12px)]"
                      style={{ color: TOOLTIP_FG2 }}
                    >
                      {barLabel}: {fmtInt(bars[i])}
                      {barUnit}
                    </span>
                    <span
                      className="text-[length:var(--body-sm-regular-size,12px)]"
                      style={{ color: TOOLTIP_FG2 }}
                    >
                      {lineLabel}: {line[i].toFixed(1)}
                      {lineUnit}
                    </span>
                    {indices && (
                      <span
                        className="text-[length:var(--body-sm-regular-size,12px)]"
                        style={{ color: TOOLTIP_FG2 }}
                      >
                        Index: {indices[i]} vs national avg
                      </span>
                    )}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* X labels + optional index chip below */}
          <div className="mt-[var(--spacing-75,6px)] flex w-full">
            {categories.map((c, i) => (
              <div
                key={i}
                className="flex flex-col items-center gap-[2px] px-[2px]"
                style={{ width: `${100 / n}%` }}
                title={c}
              >
                <span
                  className={`block w-full text-center text-[length:var(--body-sm-regular-size,12px)] ${rotateLabels ? "" : "truncate"}`}
                  style={{ color: AXIS_LABEL }}
                >
                  {c.length > 10 && !rotateLabels ? `${c.slice(0, 9)}…` : c}
                </span>
                {indices && <MiniIndex index={indices[i]} />}
              </div>
            ))}
          </div>
        </div>

        {/* Right axis */}
        <div
          className="flex flex-col justify-between pl-[var(--spacing-100,8px)] text-left"
          style={{ height: plotH }}
        >
          {lineTickVals.map((t, i) => (
            <span
              key={i}
              className="text-[length:var(--body-sm-regular-size,12px)]"
              style={{ color: AXIS_LABEL }}
            >
              {t}
              {lineUnit.trim()}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* Compact index chip used under combo bars. */
function MiniIndex({ index }: { index: number }) {
  const up = index > 100;
  const flat = index === 100;
  const fg = flat ? MUTED : up ? SUCCESS_FG : ERROR_FG;
  return (
    <span
      className="text-[length:var(--body-sm-medium-size,12px)] font-semibold"
      style={{ color: fg }}
      aria-hidden
    >
      {index}
    </span>
  );
}

/* ============================================= §3 Temporal heat map ======== */

const BAND_TOKEN: Record<"Low" | "Medium" | "High", string> = {
  Low: "var(--datavis-qualitative-7, #e1e1e8)",
  Medium: "var(--datavis-qualitative-3, #a857e5)",
  High: "var(--datavis-qualitative-4, #7c33b5)",
};
const BAND_LETTER: Record<"Low" | "Medium" | "High", string> = {
  Low: "L",
  Medium: "M",
  High: "H",
};

export function HeatMap({
  grid,
}: {
  grid: {
    day: string;
    part: string;
    minutes: number;
    band: "Low" | "Medium" | "High";
  }[][];
}) {
  const [hover, setHover] = useState<{ d: number; p: number } | null>(null);
  return (
    <div className="flex flex-col gap-[var(--spacing-150,12px)]">
      <div className="overflow-x-auto">
        <div className="min-w-[560px]">
          <div className="flex">
            <div className="w-[52px] shrink-0" />
            {DAYPARTS.map((p) => (
              <div
                key={p}
                className="flex-1 px-[2px] text-center text-[length:var(--body-sm-regular-size,12px)]"
                style={{ color: AXIS_LABEL }}
              >
                {p}
              </div>
            ))}
          </div>
          {grid.map((row, di) => (
            <div
              key={DAYS[di]}
              className="flex items-center gap-[3px] py-[var(--spacing-25,2px)]"
            >
              <div
                className="w-[52px] shrink-0 text-[length:var(--body-sm-regular-size,12px)]"
                style={{ color: AXIS_LABEL }}
              >
                {DAYS[di]}
              </div>
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
                    aria-label={`${cell.day} ${cell.part}: ${fmtInt(cell.minutes)} avg minutes per household, ${cell.band} consumption`}
                    className="relative flex h-[34px] flex-1 items-center justify-center rounded-[var(--radius-25,2px)] focus:outline-none focus-visible:ring-2"
                    style={{
                      backgroundColor: BAND_TOKEN[cell.band],
                      boxShadow: active
                        ? "inset 0 0 0 2px var(--surface-foreground-static-neutral-lvl1, #13131a)"
                        : undefined,
                    }}
                  >
                    <span
                      className="text-[length:var(--body-sm-medium-size,12px)] font-medium"
                      style={{
                        color:
                          cell.band === "Low" ? BODY2 : LABEL_ADAPTIVE,
                      }}
                    >
                      {BAND_LETTER[cell.band]}
                    </span>
                    {active && (
                      <span
                        className="pointer-events-none absolute bottom-[38px] left-1/2 z-10 flex -translate-x-1/2 flex-col gap-[var(--spacing-25,2px)] whitespace-nowrap rounded-[var(--radius-50,4px)] px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)]"
                        style={{ backgroundColor: TOOLTIP_BG, boxShadow: CARD_SHADOW }}
                      >
                        <span
                          className="text-[length:var(--body-sm-medium-size,12px)] font-medium"
                          style={{ color: TOOLTIP_FG }}
                        >
                          {cell.day} · {cell.part}
                        </span>
                        <span
                          className="text-[length:var(--body-sm-regular-size,12px)]"
                          style={{ color: TOOLTIP_FG2 }}
                        >
                          {fmtInt(cell.minutes)} avg min/hh · {cell.band}
                        </span>
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-[var(--spacing-200,16px)]">
        {(["Low", "Medium", "High"] as const).map((b) => (
          <div key={b} className="flex items-center gap-[var(--spacing-75,6px)]">
            <span
              className="flex h-[16px] w-[16px] items-center justify-center rounded-[var(--radius-25,2px)] text-[10px] font-medium"
              style={{
                backgroundColor: BAND_TOKEN[b],
                color: b === "Low" ? BODY2 : LABEL_ADAPTIVE,
              }}
            >
              {BAND_LETTER[b]}
            </span>
            <span
              className="text-[length:var(--body-md-regular-size,14px)]"
              style={{ color: AXIS_LABEL }}
            >
              {b} consumption
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================= §4 Genre horizontal bars ==== */

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
    <div
      className="flex flex-col gap-[var(--spacing-100,8px)]"
      role="group"
      aria-label="Viewership by genre — click to cross-filter"
    >
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
            aria-label={`${d.name}: ${fmtInt(d.mins)} minutes per week, ${d.pct.toFixed(1)}% of watch time, index ${d.index} ${flat ? "at" : up ? "above" : "below"} national average. Click to cross-filter platform share, cultural affinity and top shows.`}
            className="flex w-full items-center gap-[var(--spacing-150,12px)] rounded-[var(--radius-50,4px)] px-[var(--spacing-75,6px)] py-[3px] text-left transition-colors focus:outline-none"
            style={{
              opacity: dimmed ? 0.5 : 1,
              backgroundColor: isSel
                ? SELECTED_BG
                : hover === d.name
                  ? HOVER_BG
                  : "transparent",
            }}
          >
            <span
              className="w-[130px] shrink-0 truncate text-[length:var(--body-md-regular-size,14px)]"
              style={{ color: TITLE }}
              title={d.name}
            >
              {d.name}
            </span>
            <span className="flex h-[20px] flex-1 items-center">
              <span
                className="block h-[16px] rounded-[var(--radius-25,2px)]"
                style={{
                  width: `${(d.mins / max) * 100}%`,
                  backgroundColor: isSel ? BRAND : DATAVIS[0],
                  minWidth: 4,
                }}
              />
            </span>
            <span
              className="w-[70px] shrink-0 text-right text-[length:var(--body-sm-regular-size,12px)]"
              style={{ color: MUTED }}
            >
              {fmtInt(d.mins)} min
            </span>
            <span
              className="w-[46px] shrink-0 text-right text-[length:var(--body-sm-regular-size,12px)]"
              style={{ color: MUTED }}
            >
              {d.pct.toFixed(0)}%
            </span>
            <span
              className="flex w-[84px] shrink-0 items-center justify-end gap-[3px]"
              aria-hidden
            >
              <Arrow size={12} weight="bold" color={fg} />
              <span
                className="text-[length:var(--body-sm-medium-size,12px)] font-medium"
                style={{ color: fg }}
              >
                Index {d.index}
              </span>
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ==================================== §5 Share of viewing (100% stacked) === */

export function PlatformShareBars({
  data,
  segments,
  highlight,
}: {
  data: { genre: string; shares: number[] }[];
  segments: { key: TvType; name: string; color: string }[];
  highlight: string | null;
}) {
  const [hover, setHover] = useState<{ g: number; s: number } | null>(null);
  return (
    <div className="flex flex-col gap-[var(--spacing-200,16px)]">
      <div className="flex flex-wrap items-center gap-x-[var(--spacing-200,16px)] gap-y-[var(--spacing-75,6px)]">
        {segments.map((p) => (
          <div key={p.key} className="flex items-center gap-[var(--spacing-75,6px)]">
            <span
              className="block h-[12px] w-[12px] rounded-[var(--radius-25,2px)]"
              style={{ backgroundColor: p.color }}
            />
            <span
              className="text-[length:var(--body-md-regular-size,14px)]"
              style={{ color: AXIS_LABEL }}
            >
              {p.name}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-[var(--spacing-150,12px)]">
        {data.map((row, gi) => {
          const isHi = highlight === row.genre;
          const dim = highlight != null && !isHi;
          return (
            <div
              key={row.genre}
              className="flex items-center gap-[var(--spacing-150,12px)]"
              style={{ opacity: dim ? 0.5 : 1 }}
            >
              <span
                className="w-[130px] shrink-0 truncate text-[length:var(--body-md-regular-size,14px)]"
                style={{ color: isHi ? BRAND : TITLE, fontWeight: isHi ? 600 : 400 }}
                title={row.genre}
              >
                {row.genre}
              </span>
              <div
                className="flex h-[28px] flex-1 overflow-hidden rounded-[var(--radius-50,4px)]"
                role="group"
                aria-label={`${row.genre} platform share`}
                style={
                  isHi
                    ? { boxShadow: "inset 0 0 0 2px var(--border-dynamic-brand-selected, #7c33b5)" }
                    : undefined
                }
              >
                {row.shares.map((sh, si) => (
                  <button
                    key={si}
                    type="button"
                    onMouseEnter={() => setHover({ g: gi, s: si })}
                    onMouseLeave={() => setHover(null)}
                    onFocus={() => setHover({ g: gi, s: si })}
                    onBlur={() => setHover(null)}
                    aria-label={`${segments[si].name}: ${sh.toFixed(1)}% of ${row.genre} viewing minutes`}
                    className="relative flex h-full items-center justify-center focus:outline-none"
                    style={{
                      width: `${sh}%`,
                      backgroundColor: segments[si].color,
                      opacity:
                        hover && (hover.g !== gi || hover.s !== si) ? 0.6 : 1,
                    }}
                  >
                    {sh > 12 && (
                      <span
                        className="text-[length:var(--body-sm-medium-size,12px)] font-medium"
                        style={{ color: si === 2 ? BODY2 : LABEL_ADAPTIVE }}
                      >
                        {sh.toFixed(0)}%
                      </span>
                    )}
                    {hover?.g === gi && hover?.s === si && (
                      <span
                        className="pointer-events-none absolute bottom-[32px] left-1/2 z-10 flex -translate-x-1/2 flex-col whitespace-nowrap rounded-[var(--radius-50,4px)] px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)]"
                        style={{ backgroundColor: TOOLTIP_BG, boxShadow: CARD_SHADOW }}
                      >
                        <span
                          className="text-[length:var(--body-sm-medium-size,12px)] font-medium"
                          style={{ color: TOOLTIP_FG }}
                        >
                          {segments[si].name}
                        </span>
                        <span
                          className="text-[length:var(--body-sm-regular-size,12px)]"
                          style={{ color: TOOLTIP_FG2 }}
                        >
                          {sh.toFixed(1)}% of {row.genre}
                        </span>
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* =============================================== §6 Cultural affinity ====== */

/* Index-vs-national-average bars, anchored on a selected genre; clicking an
 * over-indexing genre drills into its top shows. Bar-based (chosen over a star
 * diagram for readability with the existing chart approach). */
export function AffinityBars({
  anchor,
  data,
  selected,
  onSelect,
}: {
  anchor: string;
  data: { name: string; index: number }[];
  selected: string | null;
  onSelect: (g: string) => void;
}) {
  const [hover, setHover] = useState<string | null>(null);
  // Symmetric scale centred on 100 (national average).
  const maxDev = Math.max(...data.map((d) => Math.abs(d.index - 100)), 20);
  return (
    <div className="flex flex-col gap-[var(--spacing-100,8px)]">
      <p
        className="text-[length:var(--body-sm-regular-size,12px)]"
        style={{ color: MUTED }}
      >
        Genres this audience over-indexes on, anchored to{" "}
        <span style={{ color: BRAND, fontWeight: 600 }}>{anchor}</span>. 100 = national
        average. Click a genre to reveal its top indexing shows.
      </p>
      {data.map((d) => {
        const isSel = selected === d.name;
        const up = d.index > 100;
        const dev = Math.abs(d.index - 100) / maxDev; // 0..1
        const barPct = Math.max(6, dev * 50); // half-width max 50%
        const fg = up ? SUCCESS_FG : ERROR_FG;
        const color = up ? DATAVIS[0] : DATAVIS[4];
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
            aria-label={`${d.name}: index ${d.index} ${up ? "above" : "below"} national average. Click to reveal its top indexing shows.`}
            className="flex w-full items-center gap-[var(--spacing-100,8px)] rounded-[var(--radius-50,4px)] px-[var(--spacing-75,6px)] py-[3px] text-left transition-colors focus:outline-none"
            style={{
              backgroundColor: isSel
                ? SELECTED_BG
                : hover === d.name
                  ? HOVER_BG
                  : "transparent",
            }}
          >
            <span
              className="w-[130px] shrink-0 truncate text-[length:var(--body-md-regular-size,14px)]"
              style={{ color: TITLE }}
              title={d.name}
            >
              {d.name}
            </span>
            {/* Diverging bar centred on the midline */}
            <span className="relative flex h-[18px] flex-1 items-center">
              <span
                className="absolute left-1/2 top-0 h-full w-0 border-l border-dashed"
                style={{ borderColor: GRID }}
              />
              <span
                className="absolute h-[14px] rounded-[var(--radius-25,2px)]"
                style={{
                  backgroundColor: color,
                  width: `${barPct}%`,
                  left: up ? "50%" : `${50 - barPct}%`,
                }}
              />
            </span>
            <span
              className="w-[64px] shrink-0 text-right text-[length:var(--body-sm-medium-size,12px)] font-semibold"
              style={{ color: fg }}
            >
              {d.index}
            </span>
          </button>
        );
      })}
    </div>
  );
}

/* ============================================= §7 Top shows table ========== */

export function ShowsTable({
  rows,
}: {
  rows: {
    title: string;
    network: string;
    mins: number;
    hhPct: number;
    index: number;
  }[];
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse">
        <thead>
          <tr>
            {["#", "Show", "Platform", "Avg min/hh", "% households", "Index"].map(
              (h, i) => (
                <th
                  key={h}
                  className={`border-b border-solid px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)] text-[length:var(--body-sm-medium-size,12px)] font-medium ${i >= 3 ? "text-right" : "text-left"}`}
                  style={{ borderColor: GRID, color: MUTED }}
                >
                  {h}
                </th>
              ),
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.title}>
              <td
                className="border-b border-solid px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)] text-[length:var(--body-sm-regular-size,12px)]"
                style={{ borderColor: GRID, color: MUTED }}
              >
                {i + 1}
              </td>
              <td
                className="border-b border-solid px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)] text-[length:var(--body-md-regular-size,14px)] font-medium"
                style={{ borderColor: GRID, color: TITLE }}
              >
                {r.title}
              </td>
              <td
                className="border-b border-solid px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)] text-[length:var(--body-sm-regular-size,12px)]"
                style={{ borderColor: GRID, color: BODY2 }}
              >
                {r.network}
              </td>
              <td
                className="border-b border-solid px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)] text-right text-[length:var(--body-md-regular-size,14px)]"
                style={{ borderColor: GRID, color: TITLE }}
              >
                {fmtInt(r.mins)}
              </td>
              <td
                className="border-b border-solid px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)] text-right text-[length:var(--body-sm-regular-size,12px)]"
                style={{ borderColor: GRID, color: BODY2 }}
              >
                {r.hhPct.toFixed(1)}%
              </td>
              <td
                className="border-b border-solid px-[var(--spacing-100,8px)] py-[var(--spacing-75,6px)] text-right"
                style={{ borderColor: GRID }}
              >
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

/* ============================================= §8 Migration signals ======== */

/* Simplified Sankey-style pathway: selected show → up to 3 next-show branches,
 * each showing network/platform + transition share. Custom flex/SVG flow, no
 * spaghetti. */
export function MigrationFlow({
  source,
  branches,
}: {
  source: { title: string; network: string };
  branches: { title: string; network: string; share: number }[];
}) {
  return (
    <div className="flex flex-col gap-[var(--spacing-100,8px)] md:flex-row md:items-stretch md:gap-[var(--spacing-200,16px)]">
      {/* Source node */}
      <div className="flex items-center md:w-[220px] md:shrink-0">
        <div
          className="flex w-full flex-col gap-[var(--spacing-25,2px)] rounded-[var(--radius-50,4px)] p-[var(--spacing-150,12px)]"
          style={{
            backgroundColor:
              "var(--container-dynamic-brand-subtle-background-selected, #f6ebff)",
            border: "1px solid var(--border-dynamic-brand-selected, #7c33b5)",
          }}
        >
          <span
            className="text-[length:var(--body-sm-medium-size,12px)] font-semibold uppercase tracking-[0.06em]"
            style={{ color: BRAND }}
          >
            Selected show
          </span>
          <span
            className="text-[length:var(--body-md-medium-size,14px)] font-semibold"
            style={{ color: TITLE, fontFamily: FONT }}
          >
            {source.title}
          </span>
          <span
            className="text-[length:var(--body-sm-regular-size,12px)]"
            style={{ color: MUTED }}
          >
            {source.network} · next hour
          </span>
        </div>
      </div>

      {/* Connector arrow */}
      <div className="flex items-center justify-center py-[var(--spacing-50,4px)] md:py-0">
        <ArrowRight size={22} color={MUTED} aria-hidden />
      </div>

      {/* Up to 3 branches */}
      <div className="flex flex-1 flex-col gap-[var(--spacing-100,8px)]">
        {branches.map((b) => (
          <div
            key={b.title}
            className="flex items-center gap-[var(--spacing-150,12px)] rounded-[var(--radius-50,4px)] p-[var(--spacing-100,8px)]"
            style={{ backgroundColor: SURFACE2, border: `1px solid ${GRID}` }}
          >
            <span
              className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[var(--radius-50,4px)] text-[length:var(--body-sm-medium-size,12px)] font-semibold"
              style={{
                backgroundColor:
                  "var(--container-dynamic-brand-bold-background-default, #7c33b5)",
                color: "var(--container-static-brand-bold-foreground, #ffffff)",
              }}
            >
              {b.share.toFixed(0)}%
            </span>
            <div className="flex min-w-0 flex-1 flex-col">
              <span
                className="truncate text-[length:var(--body-md-medium-size,14px)] font-medium"
                style={{ color: TITLE }}
                title={b.title}
              >
                {b.title}
              </span>
              <span
                className="text-[length:var(--body-sm-regular-size,12px)]"
                style={{ color: MUTED }}
              >
                {b.network}
              </span>
            </div>
            {/* Flow-weight bar */}
            <span className="hidden h-[10px] w-[100px] shrink-0 overflow-hidden rounded-[var(--radius-25,2px)] sm:block" style={{ backgroundColor: GRID }}>
              <span
                className="block h-full rounded-[var(--radius-25,2px)]"
                style={{ width: `${b.share}%`, backgroundColor: DATAVIS[1] }}
              />
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
