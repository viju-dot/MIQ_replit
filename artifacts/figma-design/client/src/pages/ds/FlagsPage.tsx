/**
 * Flags page — faithful reproduction of the Figma "Flags" catalog frame
 * (page node 22716:902).
 *
 * The Figma reference (design-refs/flags.md) provides the catalog structure as
 * XML metadata only — a list of flag symbols by Country and Size (24 / 20 / 16),
 * with no embedded asset URLs and no generated React code. The flag artwork
 * below is therefore authored as standalone SVG assets (one per country) stored
 * in /figmaAssets/flags/ and rendered at the three documented sizes.
 *
 * Each country is rendered as one white "component group" card. Within a card,
 * every Size variant is shown with a small gray caption, matching the variant
 * list from the Figma frame. Flags are displayed at a 4:3 aspect ratio with the
 * documented pixel dimensions:
 *   Size=24 -> 32 x 24
 *   Size=20 -> 27 x 20
 *   Size=16 -> 21 x 16
 */

type FlagSize = 24 | 20 | 16;

type SizeSpec = {
  size: FlagSize;
  width: number;
  height: number;
};

// Documented dimensions per size from the Figma frame metadata.
const SIZE_SPECS: SizeSpec[] = [
  { size: 24, width: 32, height: 24 },
  { size: 20, width: 27, height: 20 },
  { size: 16, width: 21, height: 16 },
];

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
      className="inline-block overflow-hidden rounded-[2px] ring-1 ring-inset ring-[#71718014]"
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

export default function FlagsPage(): JSX.Element {
  return (
    <section aria-label="Flags" className="flex flex-wrap gap-5">
      {COUNTRIES.map((country) => (
        <article
          key={country.name}
          className="flex flex-col gap-4 rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5"
        >
          <h3 className="font-body-md-medium text-[length:var(--body-md-medium-font-size)] font-[number:var(--body-md-medium-font-weight)] leading-[var(--body-md-medium-line-height)] text-[#13131a]">
            {country.name}
          </h3>
          <div className="flex flex-wrap items-end gap-6">
            {SIZE_SPECS.map((spec) => (
              <div
                key={spec.size}
                className="flex flex-col items-center gap-2"
              >
                <div className="flex h-6 items-center justify-center">
                  <FlagImage country={country} spec={spec} />
                </div>
                <span className="text-[12px] leading-[18px] text-[#a8a8b2]">
                  Size {spec.size}
                </span>
              </div>
            ))}
          </div>
        </article>
      ))}
    </section>
  );
}
