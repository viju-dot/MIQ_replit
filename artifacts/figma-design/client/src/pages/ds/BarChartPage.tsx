/* =========================================================================
 * Bar chart (Figma page node 52020:1062)
 *
 * Component group: Column chart, rendered inside the Smart Card component.
 * Variants (nested instances): 1 series, 2 series, Stacked, Column + line.
 * Also: Light & dark mode, Color tokens (datavis palette), Anatomy variables.
 *
 * NOTE: The design reference (design-refs/bar-chart.md) only provided the
 * Figma XML metadata (structure, sizes, token names) — no per-frame generated
 * React/Tailwind code and no downloadable figma.com asset URLs were available.
 * The column chart is therefore reconstructed from the documented anatomy:
 *   - Frame min 300 x 580, columns 16-24px, Body Lg 14/20 labels
 *   - Labels: surface/foreground/static/neutral/lvl1 (#4b4b59)
 *   - Borders/gridlines: border/static/subtle/neutral (#e1e1e8)
 *   - Data vis palette: datavis/qualitative/1..n
 * built with the Fiber design-system tokens used across the app.
 * ========================================================================= */

import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

const FONT = '"DM Sans", Helvetica';

/* Fiber data-vis qualitative palette. Values keep their original hex as the
 * var() fallback; #7c33b5 maps to datavis/qualitative/4 and #d194ff to
 * colours/blue-300. #3b82c4 and #5ac8b0 have no matching Figma token. */
const DATAVIS = [
  "var(--datavis-qualitative-4, #7c33b5)",
  "var(--colours-blue-300, #d194ff)",
  "#3b82c4",
  "#5ac8b0",
];

/* Token-backed chart colors. Each var() auto-flips under [data-theme="dark"],
 * so no per-mode conditional is needed for these. */
const GRID = "var(--border-static-subtle-neutral, #e1e1e8)"; // border/static/subtle/neutral
const AXIS_LABEL = "var(--surface-foreground-dynamic-neutral-default-regular, #4b4b59)";
const TITLE = "var(--surface-foreground-static-neutral-lvl1, #13131a)";

/* ---------- shared chart primitives ---------- */

type Series = { name: string; color: string; values: number[] };

const CATEGORIES = ["Jan", "Feb", "Mar", "Apr", "May"];

/* Y axis tick values (fixed for the mock) */
const Y_TICKS = [100, 75, 50, 25, 0];

type ChartKind = "grouped" | "stacked" | "combo";

function Legend({ series }: { series: Series[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-[var(--spacing-200,16px)] gap-y-[var(--spacing-75,6px)]">
      {series.map((s) => (
        <div key={s.name} className="flex items-center gap-[var(--spacing-75,6px)]">
          <span
            className="block h-[12px] w-[12px] shrink-0 rounded-[var(--radius-25,2px)]"
            style={{ backgroundColor: s.color }}
          />
          <span
            className="whitespace-nowrap text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)]"
            style={{ fontFamily: FONT, color: AXIS_LABEL }}
          >
            {s.name}
          </span>
        </div>
      ))}
    </div>
  );
}

function ColumnChart({
  series,
  kind = "grouped",
  line,
  height = 220,
  dark = false,
}: {
  series: Series[];
  kind?: ChartKind;
  line?: { name: string; color: string; values: number[] };
  height?: number;
  dark?: boolean;
}) {
  const plotW = 460;
  const plotH = height;
  const max = 100;
  const groupCount = CATEGORIES.length;
  const groupGap = 28;
  const groupWidth = (plotW - groupGap * (groupCount - 1)) / groupCount;

  // column widths clamped to 16-24px per anatomy
  const clampCol = (w: number) => Math.max(16, Math.min(24, w));

  const scaleY = (v: number) => (v / max) * plotH;

  const gridColor = GRID;
  const labelColor = AXIS_LABEL;

  const linePoints =
    line &&
    line.values.map((v, i) => {
      const cx = i * (groupWidth + groupGap) + groupWidth / 2;
      const cy = plotH - scaleY(v);
      return { cx, cy };
    });

  return (
    <div className="flex w-full flex-col gap-[var(--spacing-150,12px)]">
      {/* Legend */}
      <Legend
        series={line ? [...series, { name: line.name, color: line.color, values: [] }] : series}
      />

      {/* Plot container: Y axis + plot area, X axis below */}
      <div className="flex w-full">
        {/* Y axis labels */}
        <div
          className="flex flex-col justify-between pr-[var(--spacing-100,8px)] text-right"
          style={{ height: plotH }}
        >
          {Y_TICKS.map((t) => (
            <span
              key={t}
              className="text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)]"
              style={{ fontFamily: FONT, color: labelColor }}
            >
              {t}
            </span>
          ))}
        </div>

        {/* Plot area */}
        <div className="flex flex-1 flex-col">
          <div className="relative w-full" style={{ height: plotH }}>
            {/* gridlines */}
            {Y_TICKS.map((t, i) => (
              <div
                key={t}
                className="absolute left-0 right-0 h-0 border-t border-solid"
                style={{
                  borderColor: gridColor,
                  top: `${(i / (Y_TICKS.length - 1)) * 100}%`,
                }}
              />
            ))}

            {/* columns as SVG for precise layout */}
            <svg
              className="absolute inset-0 h-full w-full"
              viewBox={`0 0 ${plotW} ${plotH}`}
              preserveAspectRatio="none"
              aria-hidden
            >
              {CATEGORIES.map((_, gi) => {
                const gx = gi * (groupWidth + groupGap);
                if (kind === "stacked") {
                  const colW = clampCol(groupWidth * 0.5);
                  const cx = gx + (groupWidth - colW) / 2;
                  let acc = 0;
                  return (
                    <g key={gi}>
                      {series.map((s, si) => {
                        const h = scaleY(s.values[gi]);
                        const y = plotH - acc - h;
                        acc += h;
                        return (
                          <rect
                            key={si}
                            x={cx}
                            y={y}
                            width={colW}
                            height={h}
                            rx={1}
                            fill={s.color}
                          />
                        );
                      })}
                    </g>
                  );
                }
                // grouped / combo: side-by-side columns
                const barSeries = series;
                const n = barSeries.length;
                const innerGap = 4;
                const colW = clampCol((groupWidth - innerGap * (n - 1)) / n);
                const totalW = colW * n + innerGap * (n - 1);
                const startX = gx + (groupWidth - totalW) / 2;
                return (
                  <g key={gi}>
                    {barSeries.map((s, si) => {
                      const h = scaleY(s.values[gi]);
                      const x = startX + si * (colW + innerGap);
                      return (
                        <rect
                          key={si}
                          x={x}
                          y={plotH - h}
                          width={colW}
                          height={h}
                          rx={1}
                          fill={s.color}
                        />
                      );
                    })}
                  </g>
                );
              })}

              {/* combo line overlay */}
              {linePoints && (
                <>
                  <polyline
                    points={linePoints.map((p) => `${p.cx},${p.cy}`).join(" ")}
                    fill="none"
                    stroke={line!.color}
                    strokeWidth={2}
                    vectorEffect="non-scaling-stroke"
                  />
                  {linePoints.map((p, i) => (
                    <circle
                      key={i}
                      cx={p.cx}
                      cy={p.cy}
                      r={3}
                      fill={line!.color}
                      vectorEffect="non-scaling-stroke"
                    />
                  ))}
                </>
              )}
            </svg>
          </div>

          {/* X axis labels */}
          <div className="mt-[var(--spacing-75,6px)] flex w-full justify-between">
            {CATEGORIES.map((c) => (
              <span
                key={c}
                className="text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)]"
                style={{ fontFamily: FONT, color: labelColor }}
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Smart Card wrapper (matches the DS Smart Card) ---------- */

function SmartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className="flex w-full min-w-[300px] max-w-[560px] flex-col overflow-hidden rounded-[var(--radius-25,2px)] bg-[var(--surface-background-lvl1,#ffffff)]"
      style={{
        boxShadow:
          "0px 1px 4px 0px var(--shadow-lvl8, rgba(113,113,128,0.08)), 0px 8px 16px 0px var(--shadow-lvl4, rgba(113,113,128,0.04))",
      }}
    >
      {/* header */}
      <div className="flex items-center gap-[var(--spacing-100,8px)] p-[var(--spacing-200,16px)]">
        <p
          className="text-[length:var(--headline-xs-medium-size,16px)] font-medium leading-[var(--headline-xs-medium-line-height,24px)] tracking-[-0.08px]"
          style={{ fontFamily: FONT, color: TITLE }}
        >
          {title}
        </p>
      </div>
      <div
        className="h-0 w-full border-t border-solid"
        style={{ borderColor: GRID }}
      />
      {/* content / plot */}
      <div className="p-[var(--spacing-200,16px)]">{children}</div>
    </div>
  );
}

/* ---------- data ---------- */

const ONE_SERIES: Series[] = [
  { name: "Series 1", color: DATAVIS[0], values: [40, 65, 50, 80, 60] },
];

const TWO_SERIES: Series[] = [
  { name: "Series 1", color: DATAVIS[0], values: [40, 65, 50, 80, 60] },
  { name: "Series 2", color: DATAVIS[1], values: [30, 45, 70, 55, 42] },
];

const STACKED_SERIES: Series[] = [
  { name: "Series 1", color: DATAVIS[0], values: [30, 40, 25, 45, 35] },
  { name: "Series 2", color: DATAVIS[1], values: [25, 30, 40, 30, 28] },
];

const COMBO_LINE = { name: "Trend", color: "#3b82c4", values: [45, 70, 58, 88, 66] };

/* ---------- config: Column chart ---------- */

function renderChart(props: PropValues, theme: "light" | "dark") {
  const dark = theme === "dark";
  const type = String(props.type);
  const title = String(props.title);

  let chart: React.ReactNode;
  switch (type) {
    case "2 series":
      chart = <ColumnChart series={TWO_SERIES} kind="grouped" dark={dark} />;
      break;
    case "Stacked":
      chart = <ColumnChart series={STACKED_SERIES} kind="stacked" dark={dark} />;
      break;
    case "Column + line":
      chart = <ColumnChart series={ONE_SERIES} kind="combo" line={COMBO_LINE} dark={dark} />;
      break;
    case "1 series":
    default:
      chart = <ColumnChart series={ONE_SERIES} kind="grouped" dark={dark} />;
      break;
  }

  if (props.smartCard === false) {
    return <div className="w-full max-w-[520px]">{chart}</div>;
  }

  return <SmartCard title={title}>{chart}</SmartCard>;
}

const config: PlaygroundConfig = {
  name: "Column chart",
  description:
    "Data-vis column chart inside the Smart Card. Explore the 4 nested variants — 1 series, 2 series, stacked, and column + line combo.",
  controls: [
    {
      kind: "select",
      name: "type",
      label: "Type",
      options: ["1 series", "2 series", "Stacked", "Column + line"],
      defaultValue: "2 series",
      asTabs: true,
    },
    { kind: "boolean", name: "smartCard", label: "Smart Card frame", defaultValue: true },
    { kind: "text", name: "title", label: "Title", defaultValue: "Column chart" },
  ],
  render: renderChart,
  tokens: {
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "surface/foreground/dynamic/neutral/default/regular":
      "var(--surface-foreground-dynamic-neutral-default-regular)",
    "datavis/qualitative/4": "var(--datavis-qualitative-4)",
    "shadow/lvl4": "var(--shadow-lvl4)",
    "shadow/lvl8": "var(--shadow-lvl8)",
    "radius/25": "var(--radius-25)",
    "spacing/75": "var(--spacing-75)",
    "spacing/100": "var(--spacing-100)",
    "spacing/150": "var(--spacing-150)",
    "spacing/200": "var(--spacing-200)",
    "spacing/300": "var(--spacing-300)",
    "Headline Xs/Medium": "var(--headline-xs-medium-size)",
    "Body Md/Regular": "var(--body-md-regular-size)",
  },
};

/* ---------- page ---------- */

export default function BarChartPage() {
  return (
    <section className="flex flex-col gap-[var(--spacing-300,24px)]" aria-label="Bar chart component playground">
      <Playground config={config} />
    </section>
  );
}
