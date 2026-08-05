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

const cardClass = "rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5";
const captionClass = "text-[12px] text-[#a8a8b2]";

/* ------------------------------------------------------------------ */
/* Input / Range field                                                */
/* ------------------------------------------------------------------ */

function RangeInputWithTime() {
  return (
    <div className="bg-white border border-solid border-[#7c33b5] flex flex-col items-start relative rounded-[2px] w-[316px] max-w-full">
      <div className="flex gap-[8px] h-[34px] items-center pl-[12px] pr-[8px] py-0 relative rounded-[2px] shrink-0 w-full">
        <div className="flex items-start relative shrink-0">
          <div className="bg-[#f6ebff] flex h-[18px] items-center justify-center px-[3px] relative rounded-[2px] shrink-0">
            <p className="font-['DM_Sans'] not-italic relative shrink-0 text-[14px] text-[#7c33b5] text-center whitespace-nowrap">
              <span className="leading-[20px]">16/02/2025</span>
              <span className="leading-[20px]">{` 12:00 AM`}</span>
            </p>
          </div>
        </div>
        <div className="flex flex-col font-['DM_Sans'] justify-center not-italic relative shrink-0 text-[14px] text-[#4b4b59] whitespace-nowrap">
          <p className="leading-[20px]">-</p>
        </div>
        <div className="flex items-start relative shrink-0">
          <div className="bg-[#f6ebff] flex h-[18px] items-center justify-center px-[3px] relative rounded-[2px] shrink-0">
            <p className="font-['DM_Sans'] not-italic relative shrink-0 text-[14px] text-[#7c33b5] text-center whitespace-nowrap">
              <span className="leading-[20px]">16/02/2025</span>
              <span className="leading-[20px]">{` 12:00 AM`}</span>
            </p>
          </div>
        </div>
        <div className="flex-1 h-[34px] min-w-px relative" />
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

function RangeInputSingle() {
  return (
    <div className="bg-white border border-solid border-[#7c33b5] flex flex-col items-start relative rounded-[2px] w-[316px] max-w-full">
      <div className="flex gap-[8px] h-[34px] items-center pl-[12px] pr-[8px] py-0 relative rounded-[2px] shrink-0 w-full">
        <div className="flex items-start relative shrink-0">
          <div className="bg-[#f6ebff] flex h-[18px] items-center justify-center px-[3px] relative rounded-[2px] shrink-0">
            <p className="font-['DM_Sans'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[#7c33b5] text-center whitespace-nowrap">
              16/02/2025
            </p>
          </div>
        </div>
        <div className="flex flex-col font-['DM_Sans'] justify-center not-italic relative shrink-0 text-[14px] text-[#4b4b59] whitespace-nowrap">
          <p className="leading-[20px]">-</p>
        </div>
        <div className="flex flex-1 gap-[8px] h-[34px] items-start min-w-px py-[8px] relative">
          <div className="flex flex-1 flex-col font-['DM_Sans'] justify-center min-w-px not-italic overflow-hidden relative text-[14px] text-[#13131a] text-ellipsis whitespace-nowrap">
            <p className="leading-[20px] overflow-hidden text-ellipsis">16/02/2025</p>
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

/* ------------------------------------------------------------------ */
/* Time Only picker                                                   */
/* ------------------------------------------------------------------ */

const pickerShadow = {
  filter:
    "drop-shadow(0px 1px 2px rgba(113,113,128,0.08)) drop-shadow(0px 12px 10px rgba(113,113,128,0.1))",
} as const;

function TimeOnlyPicker() {
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
        <p className="absolute font-['DM_Sans'] leading-[24px] left-[78.08%] not-italic right-[12.31%] text-[16px] text-[#13131a] text-center top-[calc(50%+8px)] tracking-[-0.08px] whitespace-nowrap">
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
        <p className="absolute font-['DM_Sans'] leading-[24px] left-[45%] not-italic right-[46.15%] text-[16px] text-[#13131a] text-center top-[calc(50%+8px)] tracking-[-0.08px] whitespace-nowrap">
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
        <p className="absolute font-['DM_Sans'] leading-[24px] left-[14.23%] not-italic right-[80%] text-[16px] text-[#13131a] text-center top-[calc(50%+8px)] tracking-[-0.08px] whitespace-nowrap">
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

      <p className="absolute font-['DM_Sans'] leading-[24px] left-[32.31%] not-italic right-[66.15%] text-[16px] text-[#13131a] text-center top-[calc(50%+6px)] tracking-[-0.08px] whitespace-nowrap">
        :
      </p>

      {/* Header */}
      <div className="absolute left-0 top-0">
        <div className="absolute bg-[#717180] inset-[0_0_73.42%_0] rounded-tl-[2px] rounded-tr-[2px]" />
        <div className="absolute flex items-start left-[16px] py-0 top-[12px]">
          <p className="font-['DM_Sans'] leading-[18px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
            TIME
          </p>
        </div>
      </div>
    </div>
  );
}

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

function dayColor(tone: Day["tone"]): string {
  switch (tone) {
    case "brand":
      return "text-[#7c33b5]";
    case "brandFg":
      return "text-white";
    case "disabled":
      return "text-[#a8a8b2]";
    default:
      return "text-[#13131a]";
  }
}

const colLeft = [16, 50, 87, 121, 159, 193, 227];

function DateTimePicker() {
  return (
    <div
      className="bg-white relative h-[305px] w-[260px] rounded-[2px]"
      style={pickerShadow}
    >
      {/* footer bkg */}
      <div className="absolute bg-white border-[#e1e1e8] border-solid border-t h-[52px] left-0 rounded-bl-[2px] rounded-br-[2px] top-[253px] w-[260px]" />

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
      <div className="absolute left-[16px] top-[58px] text-[14px] text-center leading-[20px]">
        {columns.map((col, i) => (
          <div
            key={col.name}
            className="absolute flex flex-col gap-[13px] items-center top-[58px]"
            style={{ left: `${colLeft[i]}px` }}
          >
            <p className="font-['DM_Sans'] font-medium relative shrink-0 text-[#13131a]">
              {col.head}
            </p>
            {col.days.map((d, j) => (
              <p
                key={j}
                className={`font-['DM_Sans'] relative shrink-0 ${dayColor(d.tone)}`}
              >
                {d.label}
              </p>
            ))}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="absolute left-0 top-0">
        <div className="absolute bg-[#717180] inset-[0_0_86.23%_0] rounded-tl-[2px] rounded-tr-[2px]" />
        <div className="absolute flex items-start left-[16px] py-0 top-[12px]">
          <p className="font-['DM_Sans'] leading-[18px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
            FEBRUARY 2020
          </p>
        </div>
        <div className="absolute flex items-center justify-end left-[192px] top-[8px]">
          <div className="flex items-center justify-center p-[7px] relative rounded-[2px] shrink-0">
            <div className="flex items-center justify-center p-[2px] relative shrink-0 size-[20px]">
              <div className="relative shrink-0 size-[20px]">
                <img
                  alt="Previous month"
                  className="absolute block inset-0 max-w-none size-full"
                  src={dateTime.pageLeft}
                />
              </div>
            </div>
          </div>
          <div className="flex items-center justify-center p-[7px] relative rounded-[2px] shrink-0">
            <div className="flex items-center justify-center p-[2px] relative shrink-0 size-[20px]">
              <div className="relative shrink-0 size-[20px]">
                <img
                  alt="Next month"
                  className="absolute block inset-0 max-w-none size-full"
                  src={dateTime.pageRight}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Time footer */}
      <div className="absolute inset-[87.54%_26.15%_4.59%_24.23%]">
        <div className="absolute flex inset-[87.54%_66.54%_4.59%_24.23%] items-center justify-center p-[2px]">
          <div className="relative shrink-0 size-[19.5px]">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={dateTime.clock} />
          </div>
        </div>
        <p className="absolute font-['DM_Sans'] inset-[88.2%_26.15%_5.25%_35.38%] leading-[20px] not-italic text-[14px] text-[#13131a] whitespace-nowrap">
          12:00 AM (UTC)
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function DatePickersPage(): JSX.Element {
  return (
    <section aria-label="Date pickers" className="flex flex-col gap-8">
      {/* Range input field */}
      <div className={cardClass}>
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col gap-2">
            <span className={captionClass}>Range input · Date + Time badges</span>
            <RangeInputWithTime />
          </div>
          <div className="flex flex-col gap-2">
            <span className={captionClass}>Range input · Single date badge</span>
            <RangeInputSingle />
          </div>
        </div>
      </div>

      {/* Time Only picker */}
      <div className={cardClass}>
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col gap-2">
            <span className={captionClass}>Time Only · Compact</span>
            <TimeOnlyPicker />
          </div>
        </div>
      </div>

      {/* Date + Time picker */}
      <div className={cardClass}>
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col gap-2">
            <span className={captionClass}>Date + Time · Standard, Apply = False</span>
            <DateTimePicker />
          </div>
        </div>
      </div>
    </section>
  );
}
