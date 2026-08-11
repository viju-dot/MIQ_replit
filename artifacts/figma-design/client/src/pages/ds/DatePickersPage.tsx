import { useState } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

const A = "/figmaAssets/date-pickers";

const rangeCalendar = `${A}/range-icon-calendar-a.svg`;

const time = {
  base: `${A}/time-base.svg`,
  ellipse: `${A}/time-ellipse.svg`,
  caretDown: `${A}/time-caret-down.svg`,
  caretUp: `${A}/time-caret-up.svg`,
};

const dateTime = {
  highlights: `${A}/datetime-highlights.svg`,
  pointer: `${A}/datetime-pointer.svg`,
  pageLeft: `${A}/datetime-page-left.svg`,
  pageRight: `${A}/datetime-page-right.svg`,
  clock: `${A}/datetime-clock.svg`,
};

const pickerShadow = {
  filter:
    "drop-shadow(0px 1px 2px rgba(113,113,128,0.08)) drop-shadow(0px 12px 10px rgba(113,113,128,0.1))",
} as const;

/* ------------------------------------------------------------------ */
/* Input / Range field                                                */
/* ------------------------------------------------------------------ */

function RangeInput({
  showTime,
  startDate,
  endDate,
}: {
  showTime: boolean;
  startDate: string;
  endDate: string;
}): JSX.Element {
  if (showTime) {
    return (
      <div className="bg-[var(--surface-background-lvl1,#ffffff)] border border-solid border-[var(--border-dynamic-brand-default,#7c33b5)] flex flex-col items-start relative rounded-[var(--radiuses-small,2px)] w-[316px] max-w-full">
        <div className="flex gap-[var(--numbers-8,8px)] h-[var(--sizing-34,34px)] items-center pl-[12px] pr-[8px] py-0 relative rounded-[var(--radiuses-small,2px)] shrink-0 w-full">
          <div className="flex items-start relative shrink-0">
            <div className="bg-[var(--container-dynamic-brand-subtle-background-selected,#f6ebff)] flex h-[18px] items-center justify-center px-[3px] relative rounded-[var(--radiuses-small,2px)] shrink-0">
              <p className="font-['DM_Sans'] not-italic relative shrink-0 text-[length:var(--body-md-medium-size,14px)] text-[var(--container-dynamic-brand-subtle-foreground-delected,#7c33b5)] text-center whitespace-nowrap">
                <span className="leading-[var(--body-md-medium-line-height,20px)]">{startDate}</span>
                <span className="leading-[var(--body-md-medium-line-height,20px)]">{` 12:00 AM`}</span>
              </p>
            </div>
          </div>
          <div className="flex flex-col font-['DM_Sans'] justify-center not-italic relative shrink-0 text-[length:var(--body-md-regular-size,14px)] text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)] whitespace-nowrap">
            <p className="leading-[var(--body-md-regular-line-height,20px)]">-</p>
          </div>
          <div className="flex items-start relative shrink-0">
            <div className="bg-[var(--container-dynamic-brand-subtle-background-selected,#f6ebff)] flex h-[18px] items-center justify-center px-[3px] relative rounded-[var(--radiuses-small,2px)] shrink-0">
              <p className="font-['DM_Sans'] not-italic relative shrink-0 text-[length:var(--body-md-medium-size,14px)] text-[var(--container-dynamic-brand-subtle-foreground-delected,#7c33b5)] text-center whitespace-nowrap">
                <span className="leading-[var(--body-md-medium-line-height,20px)]">{endDate}</span>
                <span className="leading-[var(--body-md-medium-line-height,20px)]">{` 12:00 AM`}</span>
              </p>
            </div>
          </div>
          <div className="flex-1 h-[var(--sizing-34,34px)] min-w-px relative" />
          <div className="flex h-[24px] items-start relative shrink-0">
            <div className="flex items-center justify-center px-[3px] py-[2px] relative shrink-0 size-[24px]">
              <div className="h-[19.5px] relative shrink-0 w-[18px]">
                <img
                  alt=""
                  className="absolute block inset-0 max-w-none size-full"
                  src={rangeCalendar}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[var(--surface-background-lvl1,#ffffff)] border border-solid border-[var(--border-dynamic-brand-default,#7c33b5)] flex flex-col items-start relative rounded-[var(--radiuses-small,2px)] w-[316px] max-w-full">
      <div className="flex gap-[var(--numbers-8,8px)] h-[var(--sizing-34,34px)] items-center pl-[12px] pr-[8px] py-0 relative rounded-[var(--radiuses-small,2px)] shrink-0 w-full">
        <div className="flex items-start relative shrink-0">
          <div className="bg-[var(--container-dynamic-brand-subtle-background-selected,#f6ebff)] flex h-[18px] items-center justify-center px-[3px] relative rounded-[var(--radiuses-small,2px)] shrink-0">
            <p className="font-['DM_Sans'] leading-[var(--body-md-medium-line-height,20px)] not-italic relative shrink-0 text-[length:var(--body-md-medium-size,14px)] text-[var(--container-dynamic-brand-subtle-foreground-delected,#7c33b5)] text-center whitespace-nowrap">
              {startDate}
            </p>
          </div>
        </div>
        <div className="flex flex-col font-['DM_Sans'] justify-center not-italic relative shrink-0 text-[length:var(--body-md-regular-size,14px)] text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)] whitespace-nowrap">
          <p className="leading-[var(--body-md-regular-line-height,20px)]">-</p>
        </div>
        <div className="flex flex-1 gap-[var(--numbers-8,8px)] h-[var(--sizing-34,34px)] items-start min-w-px py-[8px] relative">
          <div className="flex flex-1 flex-col font-['DM_Sans'] justify-center min-w-px not-italic overflow-hidden relative text-[length:var(--body-md-regular-size,14px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] text-ellipsis whitespace-nowrap">
            <p className="leading-[var(--body-md-regular-line-height,20px)] overflow-hidden text-ellipsis">{endDate}</p>
          </div>
        </div>
        <div className="flex h-[24px] items-start relative shrink-0">
          <div className="flex items-center justify-center px-[3px] py-[2px] relative shrink-0 size-[24px]">
            <div className="h-[19.5px] relative shrink-0 w-[18px]">
              <img
                alt=""
                className="absolute block inset-0 max-w-none size-full"
                src={rangeCalendar}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const rangeConfig: PlaygroundConfig = {
  name: "Range input field",
  description: "Date range field — with Date + Time badges or a single date badge.",
  controls: [
    {
      kind: "select",
      name: "type",
      label: "Type",
      options: ["Date + Time", "Single date"],
      defaultValue: "Date + Time",
      asTabs: true,
    },
    { kind: "text", name: "startDate", label: "Start date", defaultValue: "16/02/2025" },
    { kind: "text", name: "endDate", label: "End date", defaultValue: "16/02/2025" },
  ],
  render: (props) => (
    <RangeInput
      showTime={props.type === "Date + Time"}
      startDate={String(props.startDate)}
      endDate={String(props.endDate)}
    />
  ),
  tokens: {
    "border/dynamic/brand/default": "var(--border-dynamic-brand-default)",
    "container/dynamic/brand/subtle/background/selected": "var(--container-dynamic-brand-subtle-background-selected)",
    "container/dynamic/brand/subtle/foreground/delected": "var(--container-dynamic-brand-subtle-foreground-delected)",
    "surface/foreground/dynamic/neutral/default/regular": "var(--surface-foreground-dynamic-neutral-default-regular)",
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "Radiuses/small": "var(--radiuses-small)",
    "Sizing/34": "var(--sizing-34)",
  },
};

/* ------------------------------------------------------------------ */
/* Time Only picker                                                   */
/* ------------------------------------------------------------------ */

function TimeOnlyPicker(): JSX.Element {
  return (
    <div className="relative h-[158px] w-[260px]" style={pickerShadow}>
      <div className="-translate-y-1/2 absolute h-[158px] left-0 right-0 top-1/2">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={time.base} />
      </div>
      <div className="absolute left-[32px] size-[24px] top-[118px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={time.ellipse} />
      </div>

      {/* AM column */}
      <div className="absolute left-[203px] top-[50px]">
        <p className="absolute font-['DM_Sans'] leading-[var(--headline-xs-medium-line-height,24px)] left-[78.08%] not-italic right-[12.31%] text-[length:var(--headline-xs-medium-size,16px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] text-center top-[calc(50%+8px)] tracking-[-0.08px] whitespace-nowrap">
          AM
        </p>
        <div className="absolute flex items-center justify-center left-[203px] size-[24px] top-[119px]">
          <div className="relative shrink-0 size-[24px]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={time.caretDown} />
          </div>
        </div>
        <div className="absolute flex items-center justify-center left-[203px] size-[24px] top-[50px]">
          <div className="relative shrink-0 size-[24px]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={time.caretUp} />
          </div>
        </div>
      </div>

      {/* minutes column */}
      <div className="absolute left-[117px] top-[50px]">
        <p className="absolute font-['DM_Sans'] leading-[var(--headline-xs-medium-line-height,24px)] left-[45%] not-italic right-[46.15%] text-[length:var(--headline-xs-medium-size,16px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] text-center top-[calc(50%+8px)] tracking-[-0.08px] whitespace-nowrap">
          00
        </p>
        <div className="absolute flex items-center justify-center left-[117px] size-[24px] top-[119px]">
          <div className="relative shrink-0 size-[24px]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={time.caretDown} />
          </div>
        </div>
        <div className="absolute flex items-center justify-center left-[117px] size-[24px] top-[50px]">
          <div className="relative shrink-0 size-[24px]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={time.caretUp} />
          </div>
        </div>
      </div>

      {/* hours column */}
      <div className="absolute left-[32px] top-[50px]">
        <p className="absolute font-['DM_Sans'] leading-[var(--headline-xs-medium-line-height,24px)] left-[14.23%] not-italic right-[80%] text-[length:var(--headline-xs-medium-size,16px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] text-center top-[calc(50%+8px)] tracking-[-0.08px] whitespace-nowrap">
          12
        </p>
        <div className="absolute flex items-center justify-center left-[32px] size-[24px] top-[119px]">
          <div className="relative shrink-0 size-[24px]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={time.caretDown} />
          </div>
        </div>
        <div className="absolute flex items-center justify-center left-[32px] size-[24px] top-[50px]">
          <div className="relative shrink-0 size-[24px]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={time.caretUp} />
          </div>
        </div>
      </div>

      <p className="absolute font-['DM_Sans'] leading-[var(--headline-xs-medium-line-height,24px)] left-[32.31%] not-italic right-[66.15%] text-[length:var(--headline-xs-medium-size,16px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] text-center top-[calc(50%+6px)] tracking-[-0.08px] whitespace-nowrap">
        :
      </p>

      {/* Header */}
      <div className="absolute left-0 top-0">
        <div className="absolute bg-[var(--surface-background-lvl5,#717180)] inset-[0_0_73.42%_0] rounded-tl-[var(--radiuses-small,2px)] rounded-tr-[var(--radiuses-small,2px)]" />
        <div className="absolute flex items-start left-[16px] py-0 top-[12px]">
          <p className="font-['DM_Sans'] leading-[var(--body-sm-medium-line-height,18px)] not-italic relative shrink-0 text-[length:var(--body-sm-medium-size,12px)] text-[var(--surface-foreground-static-neutral-inversed,#ffffff)] whitespace-nowrap">
            TIME
          </p>
        </div>
      </div>
    </div>
  );
}

const timeConfig: PlaygroundConfig = {
  name: "Time Only picker",
  description: "Compact time selector with hours, minutes and AM/PM steppers.",
  controls: [],
  render: () => <TimeOnlyPicker />,
  tokens: {
    "surface/background/lvl5": "var(--surface-background-lvl5)",
    "surface/foreground/static/neutral/inversed": "var(--surface-foreground-static-neutral-inversed)",
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "Radiuses/small": "var(--radiuses-small)",
  },
};

/* ------------------------------------------------------------------ */
/* Date + Time picker                                                 */
/* ------------------------------------------------------------------ */

type Day = { label: string; tone?: "default" | "brand" | "brandFg" | "disabled" };

const columns: { name: string; head: string; days: Day[] }[] = [
  {
    name: "Sunday",
    head: "Su",
    days: [
      { label: "29", tone: "disabled" },
      { label: "5" },
      { label: "12" },
      { label: "19", tone: "brand" },
      { label: "26" },
    ],
  },
  {
    name: "Monday",
    head: "Mo",
    days: [
      { label: "30", tone: "disabled" },
      { label: "6" },
      { label: "13" },
      { label: "20", tone: "brand" },
      { label: "27" },
    ],
  },
  {
    name: "Tuesday",
    head: "Tu",
    days: [
      { label: "31", tone: "disabled" },
      { label: "7" },
      { label: "14" },
      { label: "21", tone: "brand" },
      { label: "28" },
    ],
  },
  {
    name: "Wednesday",
    head: "We",
    days: [
      { label: "1", tone: "brand" },
      { label: "8" },
      { label: "15" },
      { label: "22", tone: "brand" },
      { label: "29" },
    ],
  },
  {
    name: "Thursday",
    head: "Th",
    days: [
      { label: "2" },
      { label: "9" },
      { label: "16", tone: "brandFg" },
      { label: "23", tone: "brand" },
      { label: "30" },
    ],
  },
  {
    name: "Friday",
    head: "Fr",
    days: [
      { label: "3" },
      { label: "10" },
      { label: "17", tone: "brand" },
      { label: "24", tone: "brandFg" },
      { label: "31" },
    ],
  },
  {
    name: "Saturday",
    head: "Sa",
    days: [
      { label: "4" },
      { label: "11" },
      { label: "18", tone: "brand" },
      { label: "25" },
      { label: "1", tone: "disabled" },
    ],
  },
];

function dayColorValue(tone: Day["tone"]): string {
  switch (tone) {
    case "brand":
      return "var(--surface-foreground-dynamic-brand-default,#7c33b5)";
    case "brandFg":
      return "var(--surface-foreground-static-neutral-inversed,#ffffff)";
    case "disabled":
      return "var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)";
    default:
      return "var(--surface-foreground-static-neutral-lvl1,#13131a)";
  }
}

const colLeft = [16, 50, 87, 121, 159, 193, 227];

/**
 * A single calendar day. Non-disabled cells reproduce the Figma day states:
 *   - Hover   -> brand-subtle background
 *   - Selected (click) -> brand-subtle background + brand foreground
 * Disabled days keep their static styling and are not interactive.
 */
function DayCell({
  day,
  cellKey,
  selectedKey,
  onSelect,
}: {
  day: Day;
  cellKey: string;
  selectedKey: string | null;
  onSelect: (k: string) => void;
}): JSX.Element {
  const [hover, setHover] = useState(false);
  const isDisabled = day.tone === "disabled";
  const isSelected = selectedKey === cellKey || (selectedKey === null && day.tone === "brandFg");

  // State-driven colors via inline styles (Tailwind var()/rgba arbitrary classes
  // are unreliable in this project). var(--token, fallback) preserves fidelity.
  const color =
    isSelected && day.tone !== "brandFg"
      ? "var(--surface-foreground-dynamic-brand-default,#7c33b5)"
      : dayColorValue(day.tone);
  const background =
    !isDisabled && (isSelected || hover)
      ? "var(--container-dynamic-brand-subtle-background-selected,#f6ebff)"
      : "transparent";

  return (
    <button
      type="button"
      disabled={isDisabled}
      onMouseEnter={isDisabled ? undefined : () => setHover(true)}
      onMouseLeave={isDisabled ? undefined : () => setHover(false)}
      onClick={isDisabled ? undefined : () => onSelect(cellKey)}
      aria-pressed={isDisabled ? undefined : isSelected}
      className={`flex size-[20px] items-center justify-center rounded-full font-['DM_Sans'] transition-colors duration-150 ${
        isDisabled ? "cursor-not-allowed" : "cursor-pointer"
      }`}
      style={{ color, background }}
    >
      {day.label}
    </button>
  );
}

/** Month-navigation arrow. Hover bg is applied via inline style (state-driven). */
function NavArrow({ label, src }: { label: string; src: string }): JSX.Element {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      aria-label={label}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex items-center justify-center p-[7px] relative rounded-[var(--radiuses-small,2px)] shrink-0 cursor-pointer transition-colors duration-150"
      style={{
        background: hover
          ? "var(--container-dynamic-neutral-subtle-background-hover,rgba(113,113,128,0.08))"
          : "transparent",
      }}
    >
      <div className="flex items-center justify-center p-[2px] relative shrink-0 size-[20px]">
        <div className="relative shrink-0 size-[20px]">
          <img alt={label} className="absolute block inset-0 max-w-none size-full" src={src} />
        </div>
      </div>
    </button>
  );
}

function DateTimePicker({ month }: { month: string }): JSX.Element {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  return (
    <div
      className="bg-[var(--surface-background-lvl1,#ffffff)] relative h-[305px] w-[260px] rounded-[var(--radiuses-small,2px)]"
      style={pickerShadow}
    >
      {/* footer bkg */}
      <div className="absolute bg-[var(--surface-background-lvl1,#ffffff)] border-[var(--border-static-subtle-neutral,#e1e1e8)] border-solid border-t h-[52px] left-0 rounded-bl-[var(--radiuses-small,2px)] rounded-br-[var(--radiuses-small,2px)] top-[253px] w-[260px]" />

      {/* selected-week highlights */}
      <div className="absolute inset-[28.85%_4.23%_30.82%_4.62%]">
        <div className="absolute inset-[-0.41%_0_0_0]">
          <img alt="" className="block max-w-none size-full" src={dateTime.highlights} />
        </div>
      </div>

      {/* selected day pointer */}
      <div className="absolute inset-[92.79%_17.31%_1.64%_76.15%]">
        <div className="absolute inset-[-2.21%_-6.91%_-12.79%_-6.91%]">
          <img alt="" className="block max-w-none size-full" src={dateTime.pointer} />
        </div>
      </div>

      {/* Columns */}
      <div className="absolute left-[16px] top-[58px] text-[length:var(--body-md-medium-size,14px)] text-center leading-[var(--body-md-medium-line-height,20px)]">
        {columns.map((col, i) => (
          <div
            key={col.name}
            className="absolute flex flex-col gap-[var(--odd-numbers-13,13px)] items-center top-[58px]"
            style={{ left: `${colLeft[i]}px` }}
          >
            <p className="font-['DM_Sans'] font-medium relative shrink-0 text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]">
              {col.head}
            </p>
            {col.days.map((d, j) => (
              <DayCell
                key={j}
                day={d}
                cellKey={`${i}-${j}`}
                selectedKey={selectedKey}
                onSelect={setSelectedKey}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute left-0 top-0">
        <div className="absolute bg-[var(--surface-background-lvl5,#717180)] inset-[0_0_86.23%_0] rounded-tl-[var(--radiuses-small,2px)] rounded-tr-[var(--radiuses-small,2px)]" />
        <div className="absolute flex items-start left-[16px] py-0 top-[12px]">
          <p className="font-['DM_Sans'] leading-[var(--body-sm-medium-line-height,18px)] not-italic relative shrink-0 text-[length:var(--body-sm-medium-size,12px)] text-[var(--surface-foreground-static-neutral-inversed,#ffffff)] whitespace-nowrap">
            {month}
          </p>
        </div>
        <div className="absolute flex items-center justify-end left-[192px] top-[8px]">
          <NavArrow label="Previous month" src={dateTime.pageLeft} />
          <NavArrow label="Next month" src={dateTime.pageRight} />
        </div>
      </div>

      {/* Time footer */}
      <div className="absolute inset-[87.54%_26.15%_4.59%_24.23%]">
        <div className="absolute flex inset-[87.54%_66.54%_4.59%_24.23%] items-center justify-center p-[2px]">
          <div className="relative shrink-0 size-[19.5px]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={dateTime.clock} />
          </div>
        </div>
        <p className="absolute font-['DM_Sans'] inset-[88.2%_26.15%_5.25%_35.38%] leading-[var(--body-md-regular-line-height,20px)] not-italic text-[length:var(--body-md-regular-size,14px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] whitespace-nowrap">
          12:00 AM (UTC)
        </p>
      </div>
    </div>
  );
}

const dateTimeConfig: PlaygroundConfig = {
  name: "Date + Time picker",
  description: "Standard calendar with a selected week highlight and a time footer.",
  controls: [
    { kind: "text", name: "month", label: "Header label", defaultValue: "FEBRUARY 2020" },
  ],
  render: (props: PropValues) => <DateTimePicker month={String(props.month)} />,
  tokens: {
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "surface/background/lvl5": "var(--surface-background-lvl5)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "surface/foreground/dynamic/brand/default": "var(--surface-foreground-dynamic-brand-default)",
    "surface/foreground/static/neutral/inversed": "var(--surface-foreground-static-neutral-inversed)",
    "surface/foreground/dynamic/neutral/disabled": "var(--surface-foreground-dynamic-neutral-disabled)",
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "container/dynamic/brand/subtle/background/selected": "var(--container-dynamic-brand-subtle-background-selected)",
    "container/dynamic/neutral/subtle/background/hover": "var(--container-dynamic-neutral-subtle-background-hover)",
    "Radiuses/small": "var(--radiuses-small)",
  },
};

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function DatePickersPage(): JSX.Element {
  return (
    <section aria-label="Date pickers playground" className="flex flex-col gap-6">
      <Playground config={rangeConfig} />
      <Playground config={timeConfig} />
      <Playground config={dateTimeConfig} />
    </section>
  );
}
