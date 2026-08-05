import { JSX } from "react";

/* ------------------------------------------------------------------ */
/* Assets                                                              */
/* ------------------------------------------------------------------ */
const A = "/figmaAssets/search";

const imgMagnifyingGlass = `${A}/magnifying-glass.svg`;
const imgMagnifyingGlassFocus = `${A}/magnifying-glass-focus.svg`;
const imgMagnifyingGlassDisabled = `${A}/magnifying-glass-disabled.svg`;
const imgArrow = `${A}/arrow.svg`;
const imgArrowDisabled = `${A}/arrow-disabled.svg`;

const imgUsMagnifyingGlass = `${A}/us-magnifying-glass.svg`;
const imgUsMagnifyingGlassAi = `${A}/us-magnifying-glass-ai.svg`;
const imgUsX = `${A}/us-x.svg`;
const imgUsXAi = `${A}/us-x-ai.svg`;
const imgUsSeparator = `${A}/us-separator.svg`;
const imgUsClock = `${A}/us-clock.svg`;
const imgUsCoopLogo = `${A}/us-coop-logo.svg`;
const imgUsFilePowerpoint = `${A}/us-file-powerpoint.svg`;
const imgUsImageSquare = `${A}/us-image-square.svg`;
const imgUsFileWord = `${A}/us-file-word.svg`;
const imgUsFileWordAi = `${A}/us-file-word-ai.svg`;
const imgUsPresentationChart = `${A}/us-presentation-chart.svg`;
const imgUsPresentationChartAi = `${A}/us-presentation-chart-ai.svg`;
const imgUsTracedImage = `${A}/us-traced-image.svg`;
const imgUsArrowSquareOut = `${A}/us-arrow-square-out.svg`;
const imgUsPointing = `${A}/us-pointing.svg`;

/* ------------------------------------------------------------------ */
/* Search / Standard                                                   */
/* ------------------------------------------------------------------ */
type StandardState = "Default" | "Hover" | "Active / Focus" | "Filled" | "Disabled";

type SearchStandardProps = {
  background?: boolean;
  showIcon?: boolean;
  state?: StandardState;
};

function SearchStandard({
  background = false,
  showIcon = false,
  state = "Default",
}: SearchStandardProps): JSX.Element {
  const isBackgroundAndActiveFocus = background && state === "Active / Focus";
  const isBackgroundAndDisabled = background && state === "Disabled";
  const isBackgroundAndHover = background && state === "Hover";
  const isDisabled = state === "Disabled";
  const isNotBackgroundAndActiveFocus = !background && state === "Active / Focus";
  const isNotBackgroundAndDisabled = !background && state === "Disabled";
  const isNotBackgroundAndHover = !background && state === "Hover";

  const containerColors = isBackgroundAndDisabled
    ? "bg-[rgba(113,113,128,0.1)] border-[#e1e1e8]"
    : isBackgroundAndActiveFocus
    ? "bg-white border-[#7c33b5]"
    : isBackgroundAndHover
    ? "bg-[rgba(113,113,128,0.08)] border-[#c6c6cc]"
    : background && ["Default", "Filled"].includes(state)
    ? "bg-white border-[#c6c6cc]"
    : isNotBackgroundAndDisabled
    ? "border-[#e1e1e8]"
    : isNotBackgroundAndActiveFocus
    ? "border-[#7c33b5]"
    : isNotBackgroundAndHover
    ? "border-[#a8a8b2]"
    : "border-[#c6c6cc]";

  const textColor = isDisabled
    ? "text-[#a8a8b2]"
    : ["Active / Focus", "Filled"].includes(state)
    ? "text-[#13131a]"
    : "text-[#4b4b59]";

  const iconSrc = isDisabled
    ? imgMagnifyingGlassDisabled
    : state === "Active / Focus"
    ? imgMagnifyingGlassFocus
    : imgMagnifyingGlass;

  const label = ["Filled", "Disabled"].includes(state) ? "Filled content..." : "Search…";

  return (
    <div
      className={`flex w-[300px] min-w-[180px] flex-col items-start gap-[10px] rounded-[2px] border border-solid ${containerColors}`}
    >
      <div className="flex h-[34px] w-full items-center gap-[6px] p-[10px]">
        <div className="flex h-[24px] shrink-0 items-start gap-[10px]">
          <div className="flex size-[24px] shrink-0 items-center justify-center">
            <div className="relative size-[24px] shrink-0">
              <img alt="" className="absolute inset-0 block size-full max-w-none" src={iconSrc} />
            </div>
          </div>
        </div>
        <div
          className={`relative flex min-w-0 flex-1 items-start ${
            ["Hover", "Active / Focus", "Filled", "Disabled"].includes(state) ||
            (background && state === "Default")
              ? "gap-[10px]"
              : "gap-[8px]"
          }`}
        >
          <p
            className={`relative min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[14px] leading-[20px] [word-break:break-word] ${textColor}`}
            style={{ fontFamily: '"DM Sans", Helvetica' }}
          >
            {label}
          </p>
          {["Default", "Hover", "Active / Focus", "Filled"].includes(state) && showIcon && (
            <div className="flex size-[20px] shrink-0 items-center justify-center">
              <div className="relative size-[20px] shrink-0">
                <img alt="" className="absolute inset-0 block size-full max-w-none" src={imgArrow} />
              </div>
            </div>
          )}
          {isDisabled && showIcon && (
            <div className="flex size-[20px] shrink-0 items-center justify-center">
              <div className="relative size-[20px] shrink-0">
                <img
                  alt=""
                  className="absolute inset-0 block size-full max-w-none"
                  src={imgArrowDisabled}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Universal Search                                                    */
/* ------------------------------------------------------------------ */
type UniversalState = "Zero" | "Filled" | "AI";

type ResultRow = {
  icon: string;
  iconSize?: number;
  title: string;
  parts: string[];
};

type ResultCategory = {
  header: string;
  rows: ResultRow[];
};

const filledCategories: ResultCategory[] = [
  {
    header: "Campaigns",
    rows: [
      {
        icon: imgUsCoopLogo,
        title: "COOP - DISPLAY - 12FEB to 30APR",
        parts: ["Display Campaign"],
      },
    ],
  },
  {
    header: "Creatives",
    rows: [
      {
        icon: imgUsImageSquare,
        title: "COOP-Banner 1700px",
        parts: ["Creative", "Last edited: 23 days ago"],
      },
      {
        icon: imgUsImageSquare,
        title: "COOP-Dynamic-Final",
        parts: ["Creative", "Last edited: 1 hour ago"],
      },
    ],
  },
  {
    header: "Documents",
    rows: [
      {
        icon: imgUsFilePowerpoint,
        iconSize: 14,
        title: "COOP Pitch - Final",
        parts: ["Deck", "Last edited: 7 days ago"],
      },
      {
        icon: imgUsFilePowerpoint,
        iconSize: 14,
        title: "COOP Case Study ",
        parts: ["Deck", "Last edited: 1+ year ago"],
      },
      {
        icon: imgUsFileWord,
        title: "COOP Brief",
        parts: ["Document", "Last edited: 2 months ago"],
      },
    ],
  },
  {
    header: "Reports",
    rows: [
      {
        icon: imgUsPresentationChart,
        title: "COOP Footfall uplift report",
        parts: ["Report", "Last updated: 3 hours ago"],
      },
      {
        icon: imgUsPresentationChart,
        title: "COOP TV Insights report",
        parts: ["Report", "Last updated: 1 day ago"],
      },
    ],
  },
];

const aiCategories: ResultCategory[] = [
  {
    header: "Documents",
    rows: [
      {
        icon: imgUsFileWordAi,
        title: "Open University Brief",
        parts: ["Document", "Last edited: 13 days ago"],
      },
      {
        icon: imgUsFilePowerpoint,
        iconSize: 14,
        title: "UK CPM Rate card",
        parts: ["Deck", "Last edited: 7 months ago"],
      },
    ],
  },
  {
    header: "Reports",
    rows: [
      {
        icon: imgUsPresentationChartAi,
        title: "Deliveroo QBR Report",
        parts: ["Report", "Last updated: 2 days ago"],
      },
    ],
  },
];

function ResultTextRow({ title, parts }: { title: string; parts: string[] }): JSX.Element {
  return (
    <div
      className="relative flex min-w-0 flex-1 items-center gap-[8px] whitespace-nowrap text-[12px] leading-[0] [word-break:break-word]"
      style={{ fontFamily: '"DM Sans", Helvetica' }}
    >
      <div className="flex shrink-0 flex-col justify-center text-[#2b0030]">
        <p className="leading-[18px]">{title}</p>
      </div>
      {parts.map((part, i) => (
        <div key={i} className="flex shrink-0 items-center gap-[8px]">
          <div
            className="flex shrink-0 flex-col justify-center text-[#806683] tracking-[0.48px]"
            style={{ fontWeight: 300 }}
          >
            <p className="leading-[normal]">-</p>
          </div>
          <div
            className="flex shrink-0 flex-col justify-center text-[#806683]"
            style={{ fontWeight: 300 }}
          >
            <p className="leading-[18px]">{part}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ResultCategoryBlock({ header, rows }: ResultCategory): JSX.Element {
  return (
    <div className="flex w-full shrink-0 flex-col items-start">
      <div className="flex shrink-0 items-center gap-[8px]">
        <div
          className="flex shrink-0 flex-col justify-center whitespace-nowrap text-[14px] leading-[0] text-[#806683]"
          style={{ fontFamily: '"DM Sans", Helvetica', fontWeight: 500 }}
        >
          <p className="leading-[20px]">{header}</p>
        </div>
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          className="flex w-full shrink-0 items-center gap-[8px] rounded-[2px] bg-white py-[8px]"
        >
          <div className="relative size-[16px] shrink-0">
            <img
              alt=""
              className="absolute left-1/2 top-1/2 block max-w-none -translate-x-1/2 -translate-y-1/2"
              style={{ width: row.iconSize ?? 16, height: row.iconSize ?? 16 }}
              src={row.icon}
            />
          </div>
          <ResultTextRow title={row.title} parts={row.parts} />
        </div>
      ))}
    </div>
  );
}

type UniversalSearchProps = {
  state?: UniversalState;
};

function UniversalSearch({ state = "Zero" }: UniversalSearchProps): JSX.Element {
  const isAi = state === "AI";
  const isFilled = state === "Filled";
  const isFilledOrAi = isAi || isFilled;

  const badges = ["Campaigns", "Audiences", "Reports", "Creatives"];

  return (
    <div
      className="flex w-[512px] max-w-full flex-col items-start overflow-clip rounded-[2px]"
      style={{
        filter:
          "drop-shadow(0px 1px 2px rgba(113,113,128,0.08)) drop-shadow(0px 16px 12px rgba(113,113,128,0.12))",
        paddingTop: isFilledOrAi ? 20 : undefined,
        paddingBottom: isFilledOrAi ? 20 : undefined,
      }}
    >
      {/* Search input */}
      <div className="flex w-full shrink-0 flex-col items-start rounded-t-[2px] bg-white py-[4px]">
        <div className="flex h-[34px] w-full shrink-0 items-center gap-[8px] px-[24px] py-[12px]">
          <div className="relative size-[24px] shrink-0">
            <img
              alt=""
              className="absolute inset-0 block size-full max-w-none"
              src={isAi ? imgUsMagnifyingGlassAi : imgUsMagnifyingGlass}
            />
          </div>
          <div className="relative flex min-w-0 flex-1 items-start">
            <p
              className={`relative min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[14px] leading-[19px] tracking-[-0.15px] [word-break:break-word] ${
                isFilledOrAi ? "text-[#13131a]" : "text-[#4b4b59]"
              }`}
              style={{ fontFamily: '"DM Sans", Helvetica' }}
            >
              {isAi ? "Brief template uk" : isFilled ? "Coop" : "Search or type a command..."}
            </p>
          </div>
          <div className="relative size-[24px] shrink-0">
            <img
              alt=""
              className="absolute inset-0 block size-full max-w-none"
              src={isAi ? imgUsXAi : imgUsX}
            />
          </div>
        </div>
      </div>

      {/* Separator */}
      <div className="relative h-0 w-full shrink-0">
        <div className="absolute inset-[-1px_0_0_0]">
          <img alt="" className="block size-full max-w-none" src={imgUsSeparator} />
        </div>
      </div>

      {/* Dropdown */}
      <div
        className={`flex w-full shrink-0 flex-col items-start gap-[12px] rounded-b-[2px] bg-white ${
          isFilledOrAi ? "p-[24px]" : "px-[16px] py-[24px]"
        }`}
        style={{
          filter:
            "drop-shadow(0px 1px 2px rgba(113,113,128,0.08)) drop-shadow(0px 12px 10px rgba(113,113,128,0.1))",
        }}
      >
        {/* Categories */}
        <div
          className={`flex w-full shrink-0 flex-col items-start gap-[4px] ${
            isFilledOrAi ? "" : "px-[8px]"
          }`}
        >
          <div className="flex shrink-0 items-center gap-[8px]">
            <div
              className="flex shrink-0 flex-col justify-center whitespace-nowrap text-[12px] leading-[0] tracking-[0.48px] text-[#806683]"
              style={{ fontFamily: '"DM Sans", Helvetica' }}
            >
              <p className="leading-[normal]">I&rsquo;m looking for</p>
            </div>
          </div>
          <div className="flex w-full shrink-0 items-center gap-[8px] rounded-[2px] bg-white">
            {badges.map((badge) => (
              <div key={badge} className="flex shrink-0 items-start gap-[10px]">
                <div className="flex h-[18px] shrink-0 items-center justify-center gap-[2px] rounded-[2px] bg-[#ebebf0] px-[3px] py-0">
                  <p
                    className="relative shrink-0 whitespace-nowrap text-center text-[12px] leading-[19px] tracking-[-0.15px] text-[#4b4b59] [word-break:break-word]"
                    style={{ fontFamily: '"DM Sans", Helvetica', fontWeight: 500 }}
                  >
                    {badge}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zero state: Recent */}
        {state === "Zero" && (
          <div className="flex w-full shrink-0 flex-col items-start">
            <div className="flex shrink-0 items-center gap-[8px] px-[8px]">
              <div className="flex size-[16px] shrink-0 items-center justify-center p-[2px]">
                <div className="relative size-[19.5px] shrink-0">
                  <img
                    alt=""
                    className="absolute inset-0 block size-full max-w-none"
                    src={imgUsClock}
                  />
                </div>
              </div>
              <div
                className="flex shrink-0 flex-col justify-center whitespace-nowrap text-[14px] leading-[0] text-[#806683]"
                style={{ fontFamily: '"DM Sans", Helvetica', fontWeight: 500 }}
              >
                <p className="leading-[20px]">Recent</p>
              </div>
            </div>
            <div className="flex w-full shrink-0 items-center gap-[8px] rounded-[2px] bg-white p-[8px]">
              <div className="relative size-[16px] shrink-0">
                <img
                  alt=""
                  className="absolute left-1/2 top-1/2 block size-[16px] max-w-none -translate-x-1/2 -translate-y-1/2"
                  src={imgUsCoopLogo}
                />
              </div>
              <ResultTextRow
                title="COOP - DISPLAY - 12FEB to 30APR"
                parts={["Display Campaign"]}
              />
            </div>
            <div className="flex w-full shrink-0 items-center gap-[8px] rounded-[2px] bg-white p-[8px]">
              <div className="relative size-[16px] shrink-0">
                <img
                  alt=""
                  className="absolute left-1/2 top-1/2 block size-[14px] max-w-none -translate-x-1/2 -translate-y-1/2"
                  src={imgUsFilePowerpoint}
                />
              </div>
              <ResultTextRow
                title="Deliveroo Pitch - Final"
                parts={["Deck", "Last edited: 3 days ago"]}
              />
            </div>
          </div>
        )}

        {/* Filled state: results */}
        {isFilled && (
          <div className="flex w-full shrink-0 items-start">
            <div className="flex min-w-0 flex-1 flex-col items-start gap-[4px]">
              {filledCategories.map((cat) => (
                <ResultCategoryBlock key={cat.header} {...cat} />
              ))}
            </div>
            {/* Scrollbar */}
            <div className="relative ml-[8px] flex flex-col items-start self-stretch">
              <div className="relative h-[364px] w-[8px] rounded-[4px] bg-[#ebebf0]" />
              <div className="absolute left-0 top-0 h-[224px] w-[8px] rounded-[4px] bg-[#e1e1e8]" />
            </div>
          </div>
        )}

        {/* AI state */}
        {isAi && (
          <>
            <div className="flex w-full shrink-0 flex-col items-start">
              <div className="flex w-full shrink-0 items-center gap-[8px] rounded-[2px] bg-white p-[8px]">
                <div className="relative size-[16px] shrink-0">
                  <img
                    alt=""
                    className="absolute inset-0 block size-full max-w-none"
                    src={imgUsTracedImage}
                  />
                </div>
                <div className="flex shrink-0 items-center gap-[8px]">
                  <div
                    className="flex shrink-0 flex-col justify-center whitespace-nowrap text-[14px] leading-[0] text-[#806683]"
                    style={{ fontFamily: '"DM Sans", Helvetica', fontWeight: 500 }}
                  >
                    <p className="leading-[20px]">AI Prompts</p>
                  </div>
                </div>
              </div>
              <div className="flex w-full shrink-0 items-center gap-[8px] rounded-[6px] bg-[#f9f8f9] p-[8px]">
                <div className="relative flex min-w-0 flex-1 items-center gap-[8px]">
                  <div
                    className="flex shrink-0 flex-col justify-center whitespace-nowrap text-[12px] leading-[0] tracking-[0.48px] text-[#2b0030] [word-break:break-word]"
                    style={{ fontFamily: '"DM Sans", Helvetica' }}
                  >
                    <p className="leading-[normal]">Generate a brief for your campaign</p>
                  </div>
                </div>
                {/* Cursor hand */}
                <div className="relative size-[24px] shrink-0">
                  <div className="absolute inset-[18.28%_17.66%_17.94%_22.36%]">
                    <div className="absolute inset-[-2.45%_-8.16%_-14.21%_-8.16%]">
                      <img alt="" className="block size-full max-w-none" src={imgUsPointing} />
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-white opacity-0" />
                </div>
                <div className="flex shrink-0 items-center rounded-[2px] border border-solid border-[#7c33b5] p-[2px]">
                  <div className="flex size-[20px] shrink-0 items-center justify-center">
                    <div className="relative size-[16px] shrink-0">
                      <img
                        alt=""
                        className="absolute inset-0 block size-full max-w-none"
                        src={imgUsArrowSquareOut}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex w-full shrink-0 items-start">
              <div className="flex min-w-0 flex-1 flex-col items-start gap-[4px]">
                {aiCategories.map((cat) => (
                  <ResultCategoryBlock key={cat.header} {...cat} />
                ))}
              </div>
              {/* Scrollbar */}
              <div className="relative ml-[8px] flex flex-col items-start self-stretch">
                <div className="relative h-[146px] w-[8px] rounded-[4px] bg-[#ebebf0]" />
                <div className="absolute left-0 top-0 h-[90px] w-[8px] rounded-[4px] bg-[#e1e1e8]" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div
        className={`flex shrink-0 items-center gap-[8px] rounded-[2px] bg-[#ebebf0] p-[8px] ${
          isAi ? "" : "w-full"
        }`}
      >
        <div
          className={`flex items-center gap-[8px] whitespace-nowrap text-[12px] leading-[0] [word-break:break-word] ${
            isAi ? "w-[496px] shrink-0" : "min-w-0 flex-1"
          }`}
          style={{ fontFamily: '"DM Sans", Helvetica' }}
        >
          <div className="flex shrink-0 flex-col justify-center text-[#806683]" style={{ fontWeight: 300 }}>
            <p className="leading-[18px]">Were the results relevant?</p>
          </div>
          <div className="flex shrink-0 flex-col justify-center text-[#7c33b5]">
            <p className="leading-[18px]">Let us know</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Helpers                                                             */
/* ------------------------------------------------------------------ */
function Caption({ children }: { children: React.ReactNode }): JSX.Element {
  return <span className="px-1 text-[12px] text-[#a8a8b2]">{children}</span>;
}

function GroupCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
      <p
        className="mb-4 text-[14px] font-medium text-[#13131a]"
        style={{ fontFamily: '"DM Sans", Helvetica' }}
      >
        {title}
      </p>
      {children}
    </div>
  );
}

const standardStates: StandardState[] = [
  "Default",
  "Hover",
  "Active / Focus",
  "Filled",
  "Disabled",
];

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function SearchPage(): JSX.Element {
  return (
    <section aria-label="Search components" className="flex flex-col gap-8">
      {/* Search / Standard — Background=Off */}
      <GroupCard title="Search / Standard — Background=Off">
        <div className="flex flex-wrap gap-x-[30px] gap-y-4">
          {standardStates.map((state) => (
            <div key={state} className="flex flex-col gap-1">
              <Caption>{state}</Caption>
              <SearchStandard state={state} showIcon background={false} />
            </div>
          ))}
        </div>
      </GroupCard>

      {/* Search / Standard — Background=On */}
      <GroupCard title="Search / Standard — Background=On">
        <div className="flex flex-wrap gap-x-[30px] gap-y-4">
          {standardStates.map((state) => (
            <div key={state} className="flex flex-col gap-1">
              <Caption>{state}</Caption>
              <SearchStandard state={state} showIcon background />
            </div>
          ))}
        </div>
      </GroupCard>

      {/* Universal Search */}
      <GroupCard title="Universal Search">
        <div className="flex flex-wrap items-start gap-[40px]">
          <div className="flex flex-col gap-1">
            <Caption>State = Zero</Caption>
            <UniversalSearch state="Zero" />
          </div>
          <div className="flex flex-col gap-1">
            <Caption>State = Filled</Caption>
            <UniversalSearch state="Filled" />
          </div>
          <div className="flex flex-col gap-1">
            <Caption>State = AI</Caption>
            <UniversalSearch state="AI" />
          </div>
        </div>
      </GroupCard>
    </section>
  );
}
