import { JSX, useState, type CSSProperties } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

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
  label?: string;
};

function SearchStandard({
  background = false,
  showIcon = false,
  state: baseState = "Default",
  label,
}: SearchStandardProps): JSX.Element {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const baseDisabled = baseState === "Disabled";

  // Policy: the panel state is FORCED — live hover/focus only derive a state when
  // the panel base is "Default". Disabled always wins and suppresses interaction.
  let state: StandardState = baseState;
  if (baseState === "Default") {
    if (focus) state = "Active / Focus";
    else if (hover) state = "Hover";
  }

  const interactionHandlers = baseDisabled
    ? {}
    : {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        onFocus: () => setFocus(true),
        onBlur: () => setFocus(false),
      };

  const isDisabled = state === "Disabled";

  // State-driven colors as inline styles (Tailwind var()/rgba arbitrary classes
  // are unreliable in this project). var(--token, fallback) keeps token fidelity.
  const bgByState: Record<StandardState, string> = {
    Default: "var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)",
    Filled: "var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)",
    Hover: "var(--container-dynamic-neutral-subtle-background-hover,rgba(113,113,128,0.08))",
    "Active / Focus": "var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)",
    Disabled: "var(--container-dynamic-neutral-subtle-background-disabled,rgba(113,113,128,0.1))",
  };
  const borderByState: Record<StandardState, string> = {
    Default: "var(--border-dynamic-neutral-subtle-default,#c6c6cc)",
    Filled: "var(--border-dynamic-neutral-subtle-default,#c6c6cc)",
    Hover: background
      ? "var(--border-dynamic-neutral-subtle-default,#c6c6cc)"
      : "var(--border-dynamic-neutral-subtle-hover,#a8a8b2)",
    "Active / Focus": "var(--border-dynamic-brand-default,#7c33b5)",
    Disabled: "var(--border-dynamic-neutral-subtle-disabled,#e1e1e8)",
  };
  const containerStyle: CSSProperties = {
    borderColor: borderByState[state],
    ...(background ? { background: bgByState[state] } : {}),
  };

  const textColorValue =
    isDisabled
      ? "var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)"
      : ["Active / Focus", "Filled"].includes(state) || baseState === "Filled"
        ? "var(--container-dynamic-neutral-subtle-foreground-default-variation,#13131a)"
        : "var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)";

  const iconSrc = isDisabled
    ? imgMagnifyingGlassDisabled
    : state === "Active / Focus"
    ? imgMagnifyingGlassFocus
    : imgMagnifyingGlass;

  const resolvedLabel =
    label && label.length > 0
      ? label
      : ["Filled", "Disabled"].includes(baseState)
      ? "Filled content..."
      : "Search…";

  return (
    <div
      className="flex w-[300px] min-w-[180px] flex-col items-start gap-[var(--odd-numbers-10,10px)] rounded-[var(--radiuses-small,2px)] border border-solid transition-colors duration-150"
      style={{ ...containerStyle, cursor: baseDisabled ? "not-allowed" : "text" }}
      tabIndex={baseDisabled ? -1 : 0}
      aria-disabled={baseDisabled || undefined}
      {...interactionHandlers}
    >
      <div className="flex h-[var(--height-34,34px)] w-full items-center gap-[var(--numbers-6,6px)] p-[var(--odd-numbers-10,10px)]">
        <div className="flex h-[24px] shrink-0 items-start gap-[var(--odd-numbers-10,10px)]">
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
              ? "gap-[var(--odd-numbers-10,10px)]"
              : "gap-[var(--numbers-8,8px)]"
          }`}
        >
          <p
            className="relative min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)] transition-colors duration-150 [word-break:break-word]"
            style={{ fontFamily: '"DM Sans", Helvetica', color: textColorValue }}
          >
            {resolvedLabel}
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
      className="relative flex min-w-0 flex-1 items-center gap-[var(--numbers-8,8px)] whitespace-nowrap text-[length:var(--body-sm-regular-size,12px)] leading-[0] [word-break:break-word]"
      style={{ fontFamily: '"DM Sans", Helvetica' }}
    >
      <div className="flex shrink-0 flex-col justify-center text-[#2b0030]">
        <p className="leading-[var(--body-sm-regular-line-height,18px)]">{title}</p>
      </div>
      {parts.map((part, i) => (
        <div key={i} className="flex shrink-0 items-center gap-[var(--numbers-8,8px)]">
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
            <p className="leading-[var(--body-sm-regular-line-height,18px)]">{part}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function ResultCategoryBlock({ header, rows }: ResultCategory): JSX.Element {
  return (
    <div className="flex w-full shrink-0 flex-col items-start">
      <div className="flex shrink-0 items-center gap-[var(--numbers-8,8px)]">
        <div
          className="flex shrink-0 flex-col justify-center whitespace-nowrap text-[length:var(--body-md-medium-size,14px)] leading-[0] text-[#806683]"
          style={{ fontFamily: '"DM Sans", Helvetica', fontWeight: 500 }}
        >
          <p className="leading-[var(--body-md-medium-line-height,20px)]">{header}</p>
        </div>
      </div>
      {rows.map((row, i) => (
        <div
          key={i}
          className="flex w-full shrink-0 items-center gap-[var(--numbers-8,8px)] rounded-[var(--radiuses-small,2px)] bg-[var(--surface-background-lvl1,#ffffff)] py-[var(--numbers-8,8px)]"
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
      className="flex w-[512px] max-w-full flex-col items-start overflow-clip rounded-[var(--radiuses-small,2px)]"
      style={{
        filter:
          "drop-shadow(0px 1px 2px rgba(113,113,128,0.08)) drop-shadow(0px 16px 12px rgba(113,113,128,0.12))",
        paddingTop: isFilledOrAi ? 20 : undefined,
        paddingBottom: isFilledOrAi ? 20 : undefined,
      }}
    >
      {/* Search input */}
      <div className="flex w-full shrink-0 flex-col items-start rounded-t-[var(--radiuses-small,2px)] bg-[var(--surface-background-lvl1,#ffffff)] py-[var(--numbers-4,4px)]">
        <div className="flex h-[var(--height-34,34px)] w-full shrink-0 items-center gap-[var(--numbers-8,8px)] px-[var(--spacing-24,24px)] py-[var(--numbers-12,12px)]">
          <div className="relative size-[24px] shrink-0">
            <img
              alt=""
              className="absolute inset-0 block size-full max-w-none"
              src={isAi ? imgUsMagnifyingGlassAi : imgUsMagnifyingGlass}
            />
          </div>
          <div className="relative flex min-w-0 flex-1 items-start">
            <p
              className={`relative min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[length:var(--body-md-regular-size,14px)] leading-[var(--odd-numbers-19,19px)] tracking-[-0.15px] [word-break:break-word] ${
                isFilledOrAi
                  ? "text-[var(--container-dynamic-neutral-subtle-foreground-default-variation,#13131a)]"
                  : "text-[var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)]"
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
        className={`flex w-full shrink-0 flex-col items-start gap-[var(--numbers-12,12px)] rounded-b-[var(--radiuses-small,2px)] bg-[var(--surface-background-lvl1,#ffffff)] ${
          isFilledOrAi ? "p-[var(--spacing-24,24px)]" : "px-[var(--numbers-16,16px)] py-[var(--spacing-24,24px)]"
        }`}
        style={{
          filter:
            "drop-shadow(0px 1px 2px rgba(113,113,128,0.08)) drop-shadow(0px 12px 10px rgba(113,113,128,0.1))",
        }}
      >
        {/* Categories */}
        <div
          className={`flex w-full shrink-0 flex-col items-start gap-[var(--numbers-4,4px)] ${
            isFilledOrAi ? "" : "px-[var(--numbers-8,8px)]"
          }`}
        >
          <div className="flex shrink-0 items-center gap-[var(--numbers-8,8px)]">
            <div
              className="flex shrink-0 flex-col justify-center whitespace-nowrap text-[length:var(--body-sm-regular-size,12px)] leading-[0] tracking-[0.48px] text-[#806683]"
              style={{ fontFamily: '"DM Sans", Helvetica' }}
            >
              <p className="leading-[normal]">I&rsquo;m looking for</p>
            </div>
          </div>
          <div className="flex w-full shrink-0 items-center gap-[var(--numbers-8,8px)] rounded-[var(--radiuses-small,2px)] bg-[var(--surface-background-lvl1,#ffffff)]">
            {badges.map((badge) => (
              <div key={badge} className="flex shrink-0 items-start gap-[var(--odd-numbers-10,10px)]">
                <div className="flex h-[18px] shrink-0 items-center justify-center gap-[var(--numbers-2,2px)] rounded-[var(--radiuses-small,2px)] bg-[var(--surface-background-lvl3,#ebebf0)] px-[var(--odd-numbers-3,3px)] py-0">
                  <p
                    className="relative shrink-0 whitespace-nowrap text-center text-[length:var(--body-sm-medium-size,12px)] leading-[var(--odd-numbers-19,19px)] tracking-[-0.15px] text-[var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)] [word-break:break-word]"
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
            <div className="flex shrink-0 items-center gap-[var(--numbers-8,8px)] px-[var(--numbers-8,8px)]">
              <div className="flex size-[16px] shrink-0 items-center justify-center p-[var(--numbers-2,2px)]">
                <div className="relative size-[19.5px] shrink-0">
                  <img
                    alt=""
                    className="absolute inset-0 block size-full max-w-none"
                    src={imgUsClock}
                  />
                </div>
              </div>
              <div
                className="flex shrink-0 flex-col justify-center whitespace-nowrap text-[length:var(--body-md-medium-size,14px)] leading-[0] text-[#806683]"
                style={{ fontFamily: '"DM Sans", Helvetica', fontWeight: 500 }}
              >
                <p className="leading-[var(--body-md-medium-line-height,20px)]">Recent</p>
              </div>
            </div>
            <div className="flex w-full shrink-0 items-center gap-[var(--numbers-8,8px)] rounded-[var(--radiuses-small,2px)] bg-[var(--surface-background-lvl1,#ffffff)] p-[var(--numbers-8,8px)]">
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
            <div className="flex w-full shrink-0 items-center gap-[var(--numbers-8,8px)] rounded-[var(--radiuses-small,2px)] bg-[var(--surface-background-lvl1,#ffffff)] p-[var(--numbers-8,8px)]">
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
            <div className="flex min-w-0 flex-1 flex-col items-start gap-[var(--numbers-4,4px)]">
              {filledCategories.map((cat) => (
                <ResultCategoryBlock key={cat.header} {...cat} />
              ))}
            </div>
            {/* Scrollbar */}
            <div className="relative ml-[var(--numbers-8,8px)] flex flex-col items-start self-stretch">
              <div className="relative h-[364px] w-[var(--numbers-8,8px)] rounded-[var(--numbers-4,4px)] bg-[var(--surface-background-lvl3,#ebebf0)]" />
              <div className="absolute left-0 top-0 h-[224px] w-[var(--numbers-8,8px)] rounded-[var(--numbers-4,4px)] bg-[var(--surface-background-lvl4,#e1e1e8)]" />
            </div>
          </div>
        )}

        {/* AI state */}
        {isAi && (
          <>
            <div className="flex w-full shrink-0 flex-col items-start">
              <div className="flex w-full shrink-0 items-center gap-[var(--numbers-8,8px)] rounded-[var(--radiuses-small,2px)] bg-[var(--surface-background-lvl1,#ffffff)] p-[var(--numbers-8,8px)]">
                <div className="relative size-[16px] shrink-0">
                  <img
                    alt=""
                    className="absolute inset-0 block size-full max-w-none"
                    src={imgUsTracedImage}
                  />
                </div>
                <div className="flex shrink-0 items-center gap-[var(--numbers-8,8px)]">
                  <div
                    className="flex shrink-0 flex-col justify-center whitespace-nowrap text-[length:var(--body-md-medium-size,14px)] leading-[0] text-[#806683]"
                    style={{ fontFamily: '"DM Sans", Helvetica', fontWeight: 500 }}
                  >
                    <p className="leading-[var(--body-md-medium-line-height,20px)]">AI Prompts</p>
                  </div>
                </div>
              </div>
              <div className="flex w-full shrink-0 items-center gap-[var(--numbers-8,8px)] rounded-[var(--numbers-6,6px)] bg-[#f9f8f9] p-[var(--numbers-8,8px)]">
                <div className="relative flex min-w-0 flex-1 items-center gap-[var(--numbers-8,8px)]">
                  <div
                    className="flex shrink-0 flex-col justify-center whitespace-nowrap text-[length:var(--body-sm-regular-size,12px)] leading-[0] tracking-[0.48px] text-[#2b0030] [word-break:break-word]"
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
                  <div className="absolute inset-0 bg-[var(--surface-background-lvl1,#ffffff)] opacity-0" />
                </div>
                <div className="flex shrink-0 items-center rounded-[var(--radiuses-small,2px)] border border-solid border-[var(--border-dynamic-brand-default,#7c33b5)] p-[var(--numbers-2,2px)]">
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
              <div className="flex min-w-0 flex-1 flex-col items-start gap-[var(--numbers-4,4px)]">
                {aiCategories.map((cat) => (
                  <ResultCategoryBlock key={cat.header} {...cat} />
                ))}
              </div>
              {/* Scrollbar */}
              <div className="relative ml-[var(--numbers-8,8px)] flex flex-col items-start self-stretch">
                <div className="relative h-[146px] w-[var(--numbers-8,8px)] rounded-[var(--numbers-4,4px)] bg-[var(--surface-background-lvl3,#ebebf0)]" />
                <div className="absolute left-0 top-0 h-[90px] w-[var(--numbers-8,8px)] rounded-[var(--numbers-4,4px)] bg-[var(--surface-background-lvl4,#e1e1e8)]" />
              </div>
            </div>
          </>
        )}
      </div>

      {/* Footer */}
      <div
        className={`flex shrink-0 items-center gap-[var(--numbers-8,8px)] rounded-[var(--radiuses-small,2px)] bg-[var(--surface-background-lvl3,#ebebf0)] p-[var(--numbers-8,8px)] ${
          isAi ? "" : "w-full"
        }`}
      >
        <div
          className={`flex items-center gap-[var(--numbers-8,8px)] whitespace-nowrap text-[length:var(--body-sm-regular-size,12px)] leading-[0] [word-break:break-word] ${
            isAi ? "w-[496px] shrink-0" : "min-w-0 flex-1"
          }`}
          style={{ fontFamily: '"DM Sans", Helvetica' }}
        >
          <div className="flex shrink-0 flex-col justify-center text-[#806683]" style={{ fontWeight: 300 }}>
            <p className="leading-[var(--body-sm-regular-line-height,18px)]">Were the results relevant?</p>
          </div>
          <div className="flex shrink-0 flex-col justify-center text-[var(--surface-foreground-dynamic-brand-default,#7c33b5)]">
            <p className="leading-[var(--body-sm-regular-line-height,18px)]">Let us know</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Playground configs                                                  */
/* ------------------------------------------------------------------ */
const standardStates: StandardState[] = [
  "Default",
  "Hover",
  "Active / Focus",
  "Filled",
  "Disabled",
];

const standardConfig: PlaygroundConfig = {
  name: "Search / Standard",
  description:
    "Compact search input — interactive states, optional Background surface, and trailing action icon.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: standardStates,
      defaultValue: "Default",
      asTabs: true,
    },
    { kind: "boolean", name: "background", label: "Background", defaultValue: false },
    { kind: "boolean", name: "showIcon", label: "Trailing icon", defaultValue: true },
    {
      kind: "text",
      name: "label",
      label: "Label text",
      defaultValue: "",
      placeholder: "Search…",
    },
  ],
  render: (props) => (
    <SearchStandard
      state={props.state as StandardState}
      background={props.background === true}
      showIcon={props.showIcon === true}
      label={typeof props.label === "string" ? props.label : ""}
    />
  ),
  tokens: {
    "border/dynamic/neutral/subtle/default": "var(--border-dynamic-neutral-subtle-default)",
    "border/dynamic/neutral/subtle/hover": "var(--border-dynamic-neutral-subtle-hover)",
    "border/dynamic/brand/default": "var(--border-dynamic-brand-default)",
    "border/dynamic/neutral/subtle/disabled": "var(--border-dynamic-neutral-subtle-disabled)",
    "container/dynamic/neutral/subtle/background/default/regular":
      "var(--container-dynamic-neutral-subtle-background-default-regular)",
    "container/dynamic/neutral/subtle/background/hover":
      "var(--container-dynamic-neutral-subtle-background-hover)",
    "container/dynamic/neutral/subtle/background/disabled":
      "var(--container-dynamic-neutral-subtle-background-disabled)",
    "container/dynamic/neutral/subtle/foreground/default/regular":
      "var(--container-dynamic-neutral-subtle-foreground-default-regular)",
    "container/dynamic/neutral/subtle/foreground/default/variation":
      "var(--container-dynamic-neutral-subtle-foreground-default-variation)",
    "container/dynamic/neutral/subtle/foreground/disabled":
      "var(--container-dynamic-neutral-subtle-foreground-disabled)",
    "Radiuses/small": "var(--radiuses-small)",
    "Body Md/Regular": "var(--body-md-regular-size)",
  },
};

const universalConfig: PlaygroundConfig = {
  name: "Universal Search",
  description:
    "Full command-palette overlay — Zero (recent), Filled (results), and AI-assisted states.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Zero", "Filled", "AI"],
      defaultValue: "Zero",
      asTabs: true,
    },
  ],
  render: (props) => <UniversalSearch state={props.state as UniversalState} />,
  tokens: {
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "surface/background/lvl3": "var(--surface-background-lvl3)",
    "surface/background/lvl4": "var(--surface-background-lvl4)",
    "container/dynamic/neutral/subtle/foreground/default/regular":
      "var(--container-dynamic-neutral-subtle-foreground-default-regular)",
    "container/dynamic/neutral/subtle/foreground/default/variation":
      "var(--container-dynamic-neutral-subtle-foreground-default-variation)",
    "surface/foreground/dynamic/brand/default":
      "var(--surface-foreground-dynamic-brand-default)",
    "border/dynamic/brand/default": "var(--border-dynamic-brand-default)",
    "Radiuses/small": "var(--radiuses-small)",
    "Body Sm/Regular": "var(--body-sm-regular-size)",
    "Body Md/Medium": "var(--body-md-medium-size)",
  },
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function SearchPage(): JSX.Element {
  return (
    <section aria-label="Search components playground" className="flex flex-col gap-6">
      <Playground config={standardConfig} />
      <Playground config={universalConfig} />
    </section>
  );
}
