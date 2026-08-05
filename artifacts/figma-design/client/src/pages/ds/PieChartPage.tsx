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
 * Interactive playground: the number-of-slices variant axis is explored via
 * tabs, and legend / data-label visibility via boolean controls. The Smart
 * Card title is editable text. Light & dark mode is driven by the global
 * theme passed into config.render (Playground supplies the preview
 * background); the exact Figma dark tokens are reused for the dark card.
 * ========================================================================= */

import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

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
const SLICE_BORDER = "#ffffff"; // datavis/border (slice separators)

/* dark-mode tokens (auto light & dark mode) */
const DARK_CARD_BG = "#1c1c24";
const DARK_BORDER = "#3a3a45";
const DARK_TITLE = "#ffffff";
const DARK_LABEL = "#c6c6cc";

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

function Pie({
  slices,
  size = 200,
  showLabels,
}: {
  slices: Slice[];
  size?: number;
  showLabels: boolean;
}) {
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
      {showLabels &&
        segments.map((seg) => {
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

function Legend({ slices, dark }: { slices: Slice[]; dark: boolean }) {
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
            style={{ fontFamily: FONT, color: dark ? DARK_LABEL : AXIS_LABEL }}
          >
            {s.name}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- pie chart component (plot + legend) ---------- */

function PieChart({
  slices,
  showLegend,
  showLabels,
  dark,
}: {
  slices: Slice[];
  showLegend: boolean;
  showLabels: boolean;
  dark: boolean;
}) {
  return (
    <div className="flex w-full flex-wrap items-center justify-center gap-[32px]">
      <Pie slices={slices} size={200} showLabels={showLabels} />
      {showLegend && <Legend slices={slices} dark={dark} />}
    </div>
  );
}

/* ---------- Smart Card wrapper (matches the DS Smart Card) ---------- */
/* Auto light & dark mode token: swaps surface + border + title colours. */

function SmartCard({
  title,
  dark,
  children,
}: {
  title: string;
  dark: boolean;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`flex w-full min-w-[300px] max-w-[608px] flex-col overflow-hidden rounded-[2px] ${
        dark ? "bg-[#1c1c24]" : "bg-white"
      }`}
      style={
        dark
          ? undefined
          : {
              boxShadow:
                "0px 1px 4px 0px rgba(113,113,128,0.08), 0px 8px 16px 0px rgba(113,113,128,0.04)",
            }
      }
    >
      <div className="flex items-center gap-[8px] p-[16px]">
        <p
          className="text-[16px] font-medium leading-[24px] tracking-[-0.08px]"
          style={{ fontFamily: FONT, color: dark ? DARK_TITLE : TITLE }}
        >
          {title}
        </p>
      </div>
      <div
        className="h-0 w-full border-t border-solid"
        style={{ borderColor: dark ? DARK_BORDER : GRID }}
      />
      <div className="p-[16px]">{children}</div>
    </div>
  );
}

/* ---------- config ---------- */

const config: PlaygroundConfig = {
  name: "Pie chart",
  description:
    "Plot container + legend inside a Smart Card. Supports 2–7 slices (the 7th being “Others”), with auto light & dark mode.",
  controls: [
    {
      kind: "select",
      name: "slices",
      label: "Slices",
      options: ["2", "3", "4", "5", "6", "7"],
      defaultValue: "4",
      asTabs: true,
    },
    { kind: "boolean", name: "showLegend", label: "Legend", defaultValue: true },
    { kind: "boolean", name: "showLabels", label: "Data labels", defaultValue: true },
    {
      kind: "text",
      name: "title",
      label: "Card title",
      defaultValue: "Pie chart",
      placeholder: "Pie chart",
    },
  ],
  render: (props, theme) => {
    const dark = theme === "dark";
    const n = Number(props.slices);
    const slices = DATASETS[n] ?? DATASETS[4];
    return (
      <SmartCard title={String(props.title)} dark={dark}>
        <PieChart
          slices={slices}
          showLegend={props.showLegend === true}
          showLabels={props.showLabels === true}
          dark={dark}
        />
      </SmartCard>
    );
  },
  tokens: {
    "surface/foreground/static/neutral/lvl1": AXIS_LABEL,
    "datavis/border": SLICE_BORDER,
    "datavis/qualitative/1": DATAVIS[0],
    "datavis/qualitative/2": DATAVIS[1],
    "datavis/qualitative/3": DATAVIS[2],
    "datavis/qualitative/4": DATAVIS[3],
    "datavis/qualitative/5": DATAVIS[4],
    "datavis/qualitative/6": DATAVIS[5],
    "datavis/qualitative/7 (Others)": DATAVIS[6],
    "border/static/subtle/neutral": GRID,
    "surface/dark/lvl1": DARK_CARD_BG,
    "gap/pie-to-legend": "32px",
    "frame/min-width": "608px",
    "frame/min-height": "300px · max 400px",
    "font/body-md-regular": "14 / 20",
  },
};

/* ---------- page ---------- */

export default function PieChartPage() {
  return (
    <section
      className="flex flex-col gap-6"
      aria-label="Pie chart component playground"
    >
      <Playground config={config} />
    </section>
  );
}
