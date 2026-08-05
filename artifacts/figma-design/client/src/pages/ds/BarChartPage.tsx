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
 *
 * Documentation / annotation frames (page titles, prototype notes, arrows,
 * measurement callouts) are intentionally skipped.
 * ========================================================================= */

const FONT = '"DM Sans", Helvetica';

/* Fiber data-vis qualitative palette (datavis/qualitative/1..4) */
const DATAVIS = ["#7c33b5", "#d194ff", "#3b82c4", "#5ac8b0"];

const GRID = "#e1e1e8"; // border/static/subtle/neutral
const AXIS_LABEL = "#4b4b59"; // surface/foreground/static/neutral/lvl1
const TITLE = "#13131a";
const MUTED = "#a8a8b2";

/* ---------- shared chart primitives ---------- */

type Series = { name: string; color: string; values: number[] };

const CATEGORIES = ["Jan", "Feb", "Mar", "Apr", "May"];

/* Y axis tick values (fixed for the mock) */
const Y_TICKS = [100, 75, 50, 25, 0];

function Legend({ series }: { series: Series[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-[16px] gap-y-[6px]">
      {series.map((s) => (
        <div key={s.name} className="flex items-center gap-[6px]">
          <span
            className="block h-[12px] w-[12px] shrink-0 rounded-[2px]"
            style={{ backgroundColor: s.color }}
          />
          <span
            className="whitespace-nowrap text-[14px] leading-[20px]"
            style={{ fontFamily: FONT, color: AXIS_LABEL }}
          >
            {s.name}
          </span>
        </div>
      ))}
    </div>
  );
}

type ChartKind = "grouped" | "stacked" | "combo";

function ColumnChart({
  series,
  kind = "grouped",
  line,
  height = 220,
}: {
  series: Series[];
  kind?: ChartKind;
  line?: { name: string; color: string; values: number[] };
  height?: number;
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

  const linePoints =
    line &&
    line.values.map((v, i) => {
      const cx = i * (groupWidth + groupGap) + groupWidth / 2;
      const cy = plotH - scaleY(v);
      return { cx, cy };
    });

  return (
    <div className="flex w-full flex-col gap-[12px]">
      {/* Legend */}
      <Legend series={line ? [...series, { name: line.name, color: line.color, values: [] }] : series} />

      {/* Plot container: Y axis + plot area, X axis below */}
      <div className="flex w-full">
        {/* Y axis labels */}
        <div
          className="flex flex-col justify-between pr-[8px] text-right"
          style={{ height: plotH }}
        >
          {Y_TICKS.map((t) => (
            <span
              key={t}
              className="text-[14px] leading-[20px]"
              style={{ fontFamily: FONT, color: AXIS_LABEL }}
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
                  borderColor: GRID,
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
          <div className="mt-[6px] flex w-full justify-between">
            {CATEGORIES.map((c) => (
              <span
                key={c}
                className="text-[14px] leading-[20px]"
                style={{ fontFamily: FONT, color: AXIS_LABEL }}
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
      className="flex w-full min-w-[300px] max-w-[560px] flex-col overflow-hidden rounded-[2px] bg-white"
      style={{
        boxShadow:
          "0px 1px 4px 0px rgba(113,113,128,0.08), 0px 8px 16px 0px rgba(113,113,128,0.04)",
      }}
    >
      {/* header */}
      <div className="flex items-center gap-[8px] p-[16px]">
        <p
          className="text-[16px] font-medium leading-[24px] tracking-[-0.08px]"
          style={{ fontFamily: FONT, color: TITLE }}
        >
          {title}
        </p>
      </div>
      <div className="h-0 w-full border-t border-solid" style={{ borderColor: GRID }} />
      {/* content / plot */}
      <div className="p-[16px]">{children}</div>
    </div>
  );
}

/* dark-mode Smart Card variant */
function SmartCardDark({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex w-full min-w-[300px] max-w-[560px] flex-col overflow-hidden rounded-[2px] bg-[#1c1c24]">
      <div className="flex items-center gap-[8px] p-[16px]">
        <p
          className="text-[16px] font-medium leading-[24px] tracking-[-0.08px]"
          style={{ fontFamily: FONT, color: "#ffffff" }}
        >
          {title}
        </p>
      </div>
      <div className="h-0 w-full border-t border-solid" style={{ borderColor: "#3a3a45" }} />
      <div className="p-[16px]">{children}</div>
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

/* dark palette re-tinted for dark card */
function darkSeries(s: Series[]): Series[] {
  return s;
}

/* ---------- caption helper ---------- */
function Caption({ children }: { children: React.ReactNode }) {
  return <p className="text-[12px] text-[#a8a8b2]" style={{ fontFamily: FONT }}>{children}</p>;
}

/* ---------- page ---------- */

export default function BarChartPage() {
  return (
    <section className="flex flex-col gap-[24px]" aria-label="Bar chart component variants">
      {/* Overview */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <p className="text-[12px]" style={{ fontFamily: FONT, color: MUTED }}>
          Overview
        </p>
        <p className="mt-[4px] max-w-[900px] text-[14px] leading-[20px]" style={{ fontFamily: FONT, color: AXIS_LABEL }}>
          The column chart component consists of a legend at the top and a plot
          container below. The plot container includes the Y and X axes,
          gridlines, and the plot area, and sits within the Smart Card
          component.
        </p>
        <div className="mt-[16px] flex flex-wrap gap-[24px]">
          <div className="flex flex-col gap-[8px]">
            <Caption>Column chart</Caption>
            <div className="w-full max-w-[520px] rounded-[2px] border border-solid p-[16px]" style={{ borderColor: GRID }}>
              <ColumnChart series={ONE_SERIES} kind="grouped" />
            </div>
          </div>
        </div>
      </div>

      {/* Variants */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <p className="text-[12px]" style={{ fontFamily: FONT, color: MUTED }}>
          Variants
        </p>
        <p className="mt-[4px] max-w-[900px] text-[14px] leading-[20px]" style={{ fontFamily: FONT, color: AXIS_LABEL }}>
          The column chart includes 4 nested instances — 1 series, 2 series,
          stacked, and column + line combo.
        </p>
        <div className="mt-[16px] flex flex-wrap gap-[24px]">
          <div className="flex flex-col gap-[8px]">
            <Caption>1 series</Caption>
            <SmartCard title="Column chart">
              <ColumnChart series={ONE_SERIES} kind="grouped" />
            </SmartCard>
          </div>
          <div className="flex flex-col gap-[8px]">
            <Caption>2 series</Caption>
            <SmartCard title="Column chart">
              <ColumnChart series={TWO_SERIES} kind="grouped" />
            </SmartCard>
          </div>
          <div className="flex flex-col gap-[8px]">
            <Caption>Stacked</Caption>
            <SmartCard title="Column chart">
              <ColumnChart series={STACKED_SERIES} kind="stacked" />
            </SmartCard>
          </div>
          <div className="flex flex-col gap-[8px]">
            <Caption>Column + line</Caption>
            <SmartCard title="Column chart">
              <ColumnChart series={ONE_SERIES} kind="combo" line={COMBO_LINE} />
            </SmartCard>
          </div>
        </div>
      </div>

      {/* Light and dark mode */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <p className="text-[12px]" style={{ fontFamily: FONT, color: MUTED }}>
          Light &amp; dark mode
        </p>
        <p className="mt-[4px] max-w-[900px] text-[14px] leading-[20px]" style={{ fontFamily: FONT, color: AXIS_LABEL }}>
          The component has an auto light &amp; dark mode token enabled.
        </p>
        <div className="mt-[16px] flex flex-wrap gap-[24px]">
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center gap-[8px]">
              <img src="/figmaAssets/bar-chart/sun.svg" alt="" className="h-[20px] w-[20px]" />
              <Caption>Light mode</Caption>
            </div>
            <SmartCard title="Column chart">
              <ColumnChart series={TWO_SERIES} kind="grouped" />
            </SmartCard>
          </div>
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center gap-[8px]">
              <img src="/figmaAssets/bar-chart/moon.svg" alt="" className="h-[20px] w-[20px]" />
              <Caption>Dark mode</Caption>
            </div>
            <SmartCardDark title="Column chart">
              <ColumnChart series={darkSeries(TWO_SERIES)} kind="grouped" />
            </SmartCardDark>
          </div>
        </div>
      </div>

      {/* Color tokens */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <p className="text-[12px]" style={{ fontFamily: FONT, color: MUTED }}>
          Color tokens
        </p>
        <p className="mt-[4px] max-w-[900px] text-[14px] leading-[20px]" style={{ fontFamily: FONT, color: AXIS_LABEL }}>
          All elements of the column chart are linked to Fiber through a system
          of color tokens, ensuring consistent appearance across themes and
          products.
        </p>
        <div className="mt-[16px] flex flex-wrap gap-[32px]">
          <SmartCard title="Column chart">
            <ColumnChart series={TWO_SERIES} kind="grouped" />
          </SmartCard>
          <ul className="flex flex-col gap-[12px]">
            {[
              { label: "border/static/subtle/neutral", swatch: GRID },
              { label: "surface/foreground/static/neutral/lvl1", swatch: AXIS_LABEL },
              { label: "datavis/qualitative/1", swatch: DATAVIS[0] },
              { label: "datavis/qualitative/2", swatch: DATAVIS[1] },
              { label: "datavis/qualitative/3", swatch: DATAVIS[2] },
            ].map((t) => (
              <li key={t.label} className="flex items-center gap-[10px]">
                <span
                  className="block h-[20px] w-[20px] shrink-0 rounded-[3px] border border-solid"
                  style={{ backgroundColor: t.swatch, borderColor: GRID }}
                />
                <span className="text-[14px] leading-[20px]" style={{ fontFamily: FONT, color: TITLE }}>
                  {t.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Anatomy variables */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <p className="text-[12px]" style={{ fontFamily: FONT, color: MUTED }}>
          Anatomy variables
        </p>
        <p className="mt-[4px] max-w-[900px] text-[14px] leading-[20px]" style={{ fontFamily: FONT, color: AXIS_LABEL }}>
          To ensure smooth performance and visual consistency, the component
          maintains fixed minimum and maximum dimensions.
        </p>
        <ul className="mt-[12px] flex flex-col gap-[6px] text-[14px] leading-[20px]" style={{ fontFamily: FONT, color: TITLE }}>
          <li>Frame — minimum height: 300px · minimum width: 580px</li>
          <li>Columns — minimum width: 16px · maximum width: 24px</li>
          <li>All font sizes are fixed: Body Lg / Regular 14 / 20</li>
        </ul>
      </div>
    </section>
  );
}
