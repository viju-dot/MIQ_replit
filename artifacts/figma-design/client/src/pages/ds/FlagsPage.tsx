/**
 * Flags page — faithful reproduction of the Figma "Flags" catalog frame
 * (page node 22716:902), refactored into an interactive gallery playground.
 *
 * The Figma reference provides the catalog structure as a list of flag symbols
 * by Country and Size (24 / 20 / 16). The flag artwork is authored as standalone
 * SVG assets (one per country) stored in /figmaAssets/flags/ and rendered at the
 * three documented sizes.
 *
 * Because this is an asset gallery (no meaningful per-instance props/preview), it
 * uses a single Playground with a Size control (the real variant axis) and a
 * text filter to browse countries. The preview renders a themed grid of cards.
 * Flags are displayed at a 4:3 aspect ratio with the documented pixel dimensions:
 *   Size=24 -> 32 x 24
 *   Size=20 -> 27 x 20
 *   Size=16 -> 21 x 16
 */

import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

type FlagSize = 24 | 20 | 16;

type SizeSpec = {
  size: FlagSize;
  width: number;
  height: number;
};

// Documented dimensions per size from the Figma frame metadata.
const SIZE_SPECS: Record<string, SizeSpec> = {
  "24": { size: 24, width: 32, height: 24 },
  "20": { size: 20, width: 27, height: 20 },
  "16": { size: 16, width: 21, height: 16 },
};

type Country = {
  name: string;
  asset: string;
};

// Country order follows the Figma "Flags" frame layout (top-left first).
const COUNTRIES: Country[] = [
  { name: "United States", asset: "united-states" },
  { name: "United Kingdom", asset: "united-kingdom" },
  { name: "Germany", asset: "germany" },
  { name: "Australia", asset: "australia" },
  { name: "Canada", asset: "canada" },
  { name: "Malaysia", asset: "malaysia" },
  { name: "Thailand", asset: "thailand" },
  { name: "Singapore", asset: "singapore" },
  { name: "Ireland", asset: "ireland" },
  { name: "Mexico", asset: "mexico" },
  { name: "Uruguay", asset: "uruguay" },
  { name: "Chile", asset: "chile" },
  { name: "Brazil", asset: "brazil" },
  { name: "Japan", asset: "japan" },
  { name: "France", asset: "france" },
  { name: "Italy", asset: "italy" },
  { name: "Colombia", asset: "colombia" },
  { name: "Argentina", asset: "argentina" },
  { name: "Spain", asset: "spain" },
];

function FlagImage({
  country,
  spec,
}: {
  country: Country;
  spec: SizeSpec;
}): JSX.Element {
  return (
    <span
      className="inline-block overflow-hidden rounded-[var(--radius-25,2px)] ring-1 ring-inset ring-[var(--shadow-lvl8,#71718014)]"
      style={{ width: spec.width, height: spec.height }}
    >
      <img
        src={`/figmaAssets/flags/${country.asset}.svg`}
        alt={`${country.name} flag`}
        width={spec.width}
        height={spec.height}
        className="block h-full w-full object-cover"
      />
    </span>
  );
}

function FlagsGallery({
  spec,
  filter,
}: {
  spec: SizeSpec;
  filter: string;
}): JSX.Element {
  const q = filter.trim().toLowerCase();
  const countries = q
    ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(q))
    : COUNTRIES;

  // Border + card surface + name colour all reference tokens whose
  // [data-theme="dark"] values already match the previous dark literals, so
  // the theme flips automatically and no per-theme branch is required.
  const cardCls =
    "border-[var(--border-static-subtle-neutral,#e1e1e8)] bg-[var(--surface-background-lvl1,#ffffff)] shadow-[var(--elevation-regular)]";
  const nameCls = "text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]";

  if (countries.length === 0) {
    // --surface-foreground-static-neutral-lvl3 is #717180 light / #a8a8b2 dark,
    // so the empty state flips with the theme via the variable itself.
    return (
      <p className="text-[13px] text-[var(--surface-foreground-static-neutral-lvl3,#717180)]">
        No countries match “{filter}”.
      </p>
    );
  }

  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {countries.map((country) => (
        <div
          key={country.name}
          className={`flex flex-col items-center gap-3 rounded-[var(--odd-numbers-5,5px)] border p-4 ${cardCls}`}
        >
          <div className="flex h-8 items-center justify-center">
            <FlagImage country={country} spec={spec} />
          </div>
          <span className={`text-center text-[12px] leading-[16px] ${nameCls}`}>
            {country.name}
          </span>
        </div>
      ))}
    </div>
  );
}

const config: PlaygroundConfig = {
  name: "Flags",
  scopeId: "flags/flags",
  description:
    "Country flag assets at the three documented sizes. Filter by name to browse.",
  controls: [
    {
      kind: "select",
      name: "size",
      label: "Size",
      options: ["24", "20", "16"],
      defaultValue: "24",
      asTabs: true,
    },
    {
      kind: "text",
      name: "filter",
      label: "Filter",
      defaultValue: "",
      placeholder: "Search country…",
    },
  ],
  render: (props) => (
    <FlagsGallery
      spec={SIZE_SPECS[String(props.size)] ?? SIZE_SPECS["24"]}
      filter={String(props.filter ?? "")}
    />
  ),
  tokens: {
    "radiuses/small": "var(--radius-25)",
    "shadow/lvl8": "var(--shadow-lvl8)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "elevation/regular": "var(--elevation-regular)",
    "surface/foreground/static/neutral/lvl1":
      "var(--surface-foreground-static-neutral-lvl1)",
    "odd-numbers/5": "var(--odd-numbers-5)",
  },
};

export default function FlagsPage(): JSX.Element {
  return (
    <section aria-label="Flags" className="flex flex-col gap-6">
      <Playground config={config} />
    </section>
  );
}
