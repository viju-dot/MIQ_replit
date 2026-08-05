/* =========================================================================
 * Pie chart (Figma page node 48339:11814)
 *
 * Component group: Pie chart, rendered inside the Smart Card component.
 * The pie chart consists of a plot container (the pie) on the left and a
 * legend on the right. Each slice is color-encoded, supporting up to 6
 * categories. When more than 6 categories are present, the top 6 are
 * color-encoded and the remaining ones are grouped into a seventh slice
 * labelled "Others" ("Series 7").
 *
 * Variants (nested instances): 2, 3, 4, 5, 6 and 7 slices.
 * Also documented: Light & dark mode, Color tokens, Anatomy variables.
 *
 * NOTE: The design reference (design-refs/pie-chart.md) only provided the
 * Figma XML metadata (structure, sizes, token names) — no per-frame generated
 * React/Tailwind code and no downloadable figma.com asset URLs were available.
 * The pie chart is therefore reconstructed from the documented anatomy:
 *   - Frame min 608 x 300 (max height 400)
 *   - Labels: surface/foreground/static/neutral/lvl1 (#4b4b59)
 *   - Borders: datavis/border (#ffffff separators between slices)
 *   - Data vis palette: datavis/qualitative/1..7
 *   - All font styles fixed: Body Md / Regular 14 / 20
 * built with the Fiber design-system tokens used across the app.
 *
 * Documentation / annotation frames (page titles, prototype notes, arrows,
 * measurement callouts, do's & don'ts text) are intentionally skipped.
 * ========================================================================= */

const FONT = '"DM Sans", Helvetica';

/* Fiber data-vis qualitative palette (datavis/qualitative/1..7) */
const DATAVIS = [
  "#7c33b5", // 1
  "#d194ff", // 2
  "#3b82c4", // 3
  "#5ac8b0", // 4
  "#f0a03c", // 5
  "#e15c78", // 6
  "#a8a8b2", // 7 (Others)
];

const GRID = "#e1e1e8"; // border/static/subtle/neutral
const AXIS_LABEL = "#4b4b59"; // surface/foreground/static/neutral/lvl1
const TITLE = "#13131a";
const MUTED = "#a8a8b2";
const SLICE_BORDER = "#ffffff"; // datavis/border (slice separators)

/* ---------- types & data ---------- */

type Slice = { name: string; value: number };

/* Descending-sorted mock datasets for each nested instance (2..7 slices). */
const DATASETS: Record<number, Slice[]> = {
  2: [
    { name: "Series 1", value: 62 },
    { name: "Series 2", value: 38 },
  ],
  3: [
    { name: "Series 1", value: 48 },
    { name: "Series 2", value: 32 },
    { name: "Series 3", value: 20 },
  ],
  4: [
    { name: "Series 1", value: 40 },
    { name: "Series 2", value: 28 },
    { name: "Series 3", value: 20 },
    { name: "Series 4", value: 12 },
  ],
  5: [
    { name: "Series 1", value: 34 },
    { name: "Series 2", value: 26 },
    { name: "Series 3", value: 18 },
    { name: "Series 4", value: 13 },
    { name: "Series 5", value: 9 },
  ],
  6: [
    { name: "Series 1", value: 30 },
    { name: "Series 2", value: 24 },
    { name: "Series 3", value: 18 },
    { name: "Series 4", value: 12 },
    { name: "Series 5", value: 9 },
    { name: "Series 6", value: 7 },
  ],
  7: [
    { name: "Series 1", value: 28 },
    { name: "Series 2", value: 22 },
    { name: "Series 3", value: 16 },
    { name: "Series 4", value: 12 },
    { name: "Series 5", value: 9 },
    { name: "Series 6", value: 7 },
    { name: "Others", value: 6 },
  ],
};

/* ---------- geometry helpers ---------- */

function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const a = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polar(cx, cy, r, end);
  const e = polar(cx, cy, r, start);
  const largeArc = end - start <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 0 ${e.x} ${e.y} Z`;
}

/* ---------- pie plot ---------- */

function Pie({ slices, size = 200 }: { slices: Slice[]; size?: number }) {
  const total = slices.reduce((sum, s) => sum + s.value, 0);
  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 2;

  let acc = 0;
  const segments = slices.map((s, i) => {
    const start = (acc / total) * 360;
    acc += s.value;
    const end = (acc / total) * 360;
    const mid = (start + end) / 2;
    const pct = (s.value / total) * 100;
    return { ...s, start, end, mid, pct, color: DATAVIS[i % DATAVIS.length] };
  });

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      aria-hidden
      className="shrink-0"
    >
      {segments.map((seg) => (
        <path
          key={seg.name}
          d={arcPath(cx, cy, r, seg.start, seg.end)}
          fill={seg.color}
          stroke={SLICE_BORDER}
          strokeWidth={2}
        />
      ))}
      {/* data labels for slices >= 4% */}
      {segments.map((seg) => {
        if (seg.pct < 4) return null;
        const p = polar(cx, cy, r * 0.62, seg.mid);
        return (
          <text
            key={`lbl-${seg.name}`}
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="central"
            style={{ fontFamily: FONT, fontSize: 12, fontWeight: 500 }}
            fill="#ffffff"
          >
            {seg.pct.toFixed(1)}
          </text>
        );
      })}
    </svg>
  );
}

/* ---------- legend ---------- */

function Legend({ slices }: { slices: Slice[] }) {
  return (
    <ul className="flex flex-col gap-[10px]">
      {slices.map((s, i) => (
        <li key={s.name} className="flex items-center gap-[8px]">
          <span
            className="block h-[12px] w-[12px] shrink-0 rounded-[2px]"
            style={{ backgroundColor: DATAVIS[i % DATAVIS.length] }}
          />
          <span
            className="whitespace-nowrap text-[14px] leading-[20px]"
            style={{ fontFamily: FONT, color: AXIS_LABEL }}
          >
            {s.name}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- pie chart component (plot + legend) ---------- */

function PieChart({ slices }: { slices: Slice[] }) {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-[32px]">
      <Pie slices={slices} size={200} />
      <Legend slices={slices} />
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
      className="flex w-full min-w-[300px] max-w-[608px] flex-col overflow-hidden rounded-[2px] bg-white"
      style={{
        boxShadow:
          "0px 1px 4px 0px rgba(113,113,128,0.08), 0px 8px 16px 0px rgba(113,113,128,0.04)",
      }}
    >
      <div className="flex items-center gap-[8px] p-[16px]">
        <p
          className="text-[16px] font-medium leading-[24px] tracking-[-0.08px]"
          style={{ fontFamily: FONT, color: TITLE }}
        >
          {title}
        </p>
      </div>
      <div className="h-0 w-full border-t border-solid" style={{ borderColor: GRID }} />
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
    <div className="flex w-full min-w-[300px] max-w-[608px] flex-col overflow-hidden rounded-[2px] bg-[#1c1c24]">
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

/* legend for dark card (lighter label text) */
function LegendDark({ slices }: { slices: Slice[] }) {
  return (
    <ul className="flex flex-col gap-[10px]">
      {slices.map((s, i) => (
        <li key={s.name} className="flex items-center gap-[8px]">
          <span
            className="block h-[12px] w-[12px] shrink-0 rounded-[2px]"
            style={{ backgroundColor: DATAVIS[i % DATAVIS.length] }}
          />
          <span
            className="whitespace-nowrap text-[14px] leading-[20px]"
            style={{ fontFamily: FONT, color: "#c6c6cc" }}
          >
            {s.name}
          </span>
        </li>
      ))}
    </ul>
  );
}

function PieChartDark({ slices }: { slices: Slice[] }) {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-[32px]">
      <Pie slices={slices} size={200} />
      <LegendDark slices={slices} />
    </div>
  );
}

/* ---------- caption helper ---------- */
function Caption({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] text-[#a8a8b2]" style={{ fontFamily: FONT }}>
      {children}
    </p>
  );
}

/* ---------- page ---------- */

export default function PieChartPage() {
  return (
    <section
      className="flex flex-col gap-[24px]"
      aria-label="Pie chart component variants"
    >
      {/* Overview */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <p className="text-[12px]" style={{ fontFamily: FONT, color: MUTED }}>
          Overview
        </p>
        <p
          className="mt-[4px] max-w-[900px] text-[14px] leading-[20px]"
          style={{ fontFamily: FONT, color: AXIS_LABEL }}
        >
          The pie chart component consists of a plot container on the left and a
          legend on the right. Each slice is color-encoded, supporting up to 6
          categories. When more than 6 categories are present, the top 6 are
          color-encoded and the remaining ones are grouped into a seventh slice
          labelled &ldquo;Others&rdquo; (&ldquo;Series 7&rdquo;). The pie chart
          sits within the Smart Card component.
        </p>
        <div className="mt-[16px] flex flex-wrap gap-[24px]">
          <div className="flex flex-col gap-[8px]">
            <Caption>Pie chart</Caption>
            <SmartCard title="Pie chart">
              <PieChart slices={DATASETS[4]} />
            </SmartCard>
          </div>
        </div>
      </div>

      {/* Variants (nested instances) */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <p className="text-[12px]" style={{ fontFamily: FONT, color: MUTED }}>
          Variants
        </p>
        <p
          className="mt-[4px] max-w-[900px] text-[14px] leading-[20px]"
          style={{ fontFamily: FONT, color: AXIS_LABEL }}
        >
          The pie chart includes 6 nested instances to select the number of
          slices &mdash; 2, 3, 4, 5, 6 and 7 slices (the 7th being
          &ldquo;Others&rdquo;).
        </p>
        <div className="mt-[16px] flex flex-wrap gap-[24px]">
          {[2, 3, 4, 5, 6, 7].map((n) => (
            <div key={n} className="flex flex-col gap-[8px]">
              <Caption>{n} slices</Caption>
              <SmartCard title="Pie chart">
                <PieChart slices={DATASETS[n]} />
              </SmartCard>
            </div>
          ))}
        </div>
      </div>

      {/* Light and dark mode */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <p className="text-[12px]" style={{ fontFamily: FONT, color: MUTED }}>
          Light &amp; dark mode
        </p>
        <p
          className="mt-[4px] max-w-[900px] text-[14px] leading-[20px]"
          style={{ fontFamily: FONT, color: AXIS_LABEL }}
        >
          The pie chart component has an auto light &amp; dark mode token
          enabled.
        </p>
        <div className="mt-[16px] flex flex-wrap gap-[24px]">
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center gap-[8px]">
              <img
                src="/figmaAssets/pie-chart/sun.svg"
                alt=""
                className="h-[20px] w-[20px]"
              />
              <Caption>Light mode</Caption>
            </div>
            <SmartCard title="Pie chart">
              <PieChart slices={DATASETS[5]} />
            </SmartCard>
          </div>
          <div className="flex flex-col gap-[8px]">
            <div className="flex items-center gap-[8px]">
              <img
                src="/figmaAssets/pie-chart/moon.svg"
                alt=""
                className="h-[20px] w-[20px]"
              />
              <Caption>Dark mode</Caption>
            </div>
            <SmartCardDark title="Pie chart">
              <PieChartDark slices={DATASETS[5]} />
            </SmartCardDark>
          </div>
        </div>
      </div>

      {/* Color tokens */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <p className="text-[12px]" style={{ fontFamily: FONT, color: MUTED }}>
          Color tokens
        </p>
        <p
          className="mt-[4px] max-w-[900px] text-[14px] leading-[20px]"
          style={{ fontFamily: FONT, color: AXIS_LABEL }}
        >
          All elements of the pie chart are linked to Fiber through a system of
          color tokens, ensuring consistent appearance across themes and
          products. Labels: surface/foreground/static/neutral/lvl1. Borders:
          datavis/border. Data vis colour palette: datavis/qualitative/1&hellip;
        </p>
        <div className="mt-[16px] flex flex-wrap gap-[32px]">
          <SmartCard title="Pie chart">
            <PieChart slices={DATASETS[6]} />
          </SmartCard>
          <ul className="flex flex-col gap-[12px]">
            {[
              { label: "surface/foreground/static/neutral/lvl1", swatch: AXIS_LABEL },
              { label: "datavis/border", swatch: SLICE_BORDER },
              { label: "datavis/qualitative/1", swatch: DATAVIS[0] },
              { label: "datavis/qualitative/2", swatch: DATAVIS[1] },
              { label: "datavis/qualitative/3", swatch: DATAVIS[2] },
              { label: "datavis/qualitative/4", swatch: DATAVIS[3] },
              { label: "datavis/qualitative/5", swatch: DATAVIS[4] },
              { label: "datavis/qualitative/6", swatch: DATAVIS[5] },
            ].map((t) => (
              <li key={t.label} className="flex items-center gap-[10px]">
                <span
                  className="block h-[20px] w-[20px] shrink-0 rounded-[3px] border border-solid"
                  style={{ backgroundColor: t.swatch, borderColor: GRID }}
                />
                <span
                  className="text-[14px] leading-[20px]"
                  style={{ fontFamily: FONT, color: TITLE }}
                >
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
        <p
          className="mt-[4px] max-w-[900px] text-[14px] leading-[20px]"
          style={{ fontFamily: FONT, color: AXIS_LABEL }}
        >
          To ensure smooth performance, visual consistency, and prevent
          overflow, the pie chart component maintains fixed minimum and maximum
          dimensions.
        </p>
        <ul
          className="mt-[12px] flex flex-col gap-[6px] text-[14px] leading-[20px]"
          style={{ fontFamily: FONT, color: TITLE }}
        >
          <li>Frame &mdash; minimum height: 300px · maximum height: 400px</li>
          <li>Frame &mdash; minimum width: 608px (no maximum width)</li>
          <li>Gap between pie and legend: 32px · label gap: 16px</li>
          <li>All font styles and sizes are fixed: Body Md / Regular 14 / 20</li>
        </ul>
      </div>
    </section>
  );
}
