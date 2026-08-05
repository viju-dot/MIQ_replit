import { useState } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

const PILL_CLOSE = "/figmaAssets/multiselect/pill-close.svg";
const CARET_DOWN = "/figmaAssets/multiselect/caret-down.svg";
const CARET_UP = "/figmaAssets/multiselect/caret-up.svg";
const SEARCH = "/figmaAssets/multiselect/search.svg";
const CHECK = "/figmaAssets/icon-check.svg";

/* ------------------------------------------------------------------ */
/* Small building blocks (exact Figma JSX/classes)                     */
/* ------------------------------------------------------------------ */

function BadgePill({ label }: { label: string }): JSX.Element {
  return (
    <div className="flex h-[18px] items-center justify-center gap-1 rounded-full bg-[#7c33b5] py-0.5 pl-2 pr-1.5">
      <p className="whitespace-pre-line font-['DM_Sans'] text-[12px] font-medium leading-[18px] text-white">
        {label}
      </p>
      <div className="relative size-4 shrink-0 overflow-hidden">
        <img
          alt=""
          className="absolute left-[3px] top-[3px] size-[10px]"
          src={PILL_CLOSE}
        />
      </div>
    </div>
  );
}

function CountPill({ label }: { label: string }): JSX.Element {
  return (
    <div className="flex h-[18px] items-center justify-center rounded-full bg-[#f6ebff] px-2">
      <p className="whitespace-nowrap text-center font-['DM_Sans'] text-[12px] font-medium leading-[18px] text-[#662994]">
        {label}
      </p>
    </div>
  );
}

/* The dropdown field (as in the "Dropdown Closed"/"Open" instance). */
function DropdownField({
  pills,
  extra,
  open = false,
  disabled = false,
}: {
  pills: string[];
  extra?: string;
  open?: boolean;
  disabled?: boolean;
}): JSX.Element {
  return (
    <div
      className={`flex w-full flex-col items-start justify-center rounded-[2px] border border-solid border-[#7c33b5] ${
        disabled ? "bg-[#7171800a]" : "bg-white"
      }`}
    >
      <div className="flex w-full items-center gap-2 pl-3 pr-1.5">
        <div className="flex min-w-0 flex-1 flex-wrap content-start items-start gap-1.5 py-2">
          {pills.map((p) => (
            <BadgePill key={p} label={p} />
          ))}
          {extra ? <CountPill label={extra} /> : null}
        </div>
        <div className="flex items-center self-stretch">
          <div className="flex size-5 items-center justify-center">
            <img
              alt=""
              className="size-5"
              src={open ? CARET_UP : CARET_DOWN}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* A single option row inside the open menu. */
function OptionRow({
  label,
  checked = false,
  onToggle,
  disabled = false,
}: {
  label: string;
  checked?: boolean;
  onToggle?: () => void;
  disabled?: boolean;
}): JSX.Element {
  return (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className={`flex w-full items-center gap-2 border-b border-[#e1e1e8] py-2 pl-2 pr-3 text-left ${
        checked ? "bg-[#f6ebff]" : "bg-white hover:bg-[#71718014]"
      } disabled:cursor-not-allowed`}
    >
      <span
        className={`flex size-4 shrink-0 items-center justify-center rounded-[2px] border-[1.5px] ${
          checked
            ? disabled
              ? "border-transparent bg-[#7171801a]"
              : "border-[#7c33b5] bg-[#7c33b5]"
            : "border-[#c6c6cc] bg-transparent"
        }`}
      >
        {checked ? <img alt="" className="size-4" src={CHECK} /> : null}
      </span>
      <span
        className={`flex h-6 items-center whitespace-nowrap font-['DM_Sans'] text-[14px] font-normal leading-[20px] ${
          disabled ? "text-[#a8a8b2]" : checked ? "text-[#7c33b5]" : "text-[#13131a]"
        }`}
      >
        {label}
      </span>
    </button>
  );
}

/* Search input row shown at top of the open menu. */
function SearchRow({ value }: { value: string }): JSX.Element {
  return (
    <div className="flex w-full items-center gap-2 border-b border-[#e1e1e8] px-3 py-2">
      <img alt="" className="size-5 shrink-0" src={SEARCH} />
      <span className="font-['DM_Sans'] text-[14px] font-normal leading-[20px] text-[#71718099]">
        {value}
      </span>
    </div>
  );
}

/* Open menu container. */
function Menu({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div
      className="flex w-full flex-col overflow-hidden rounded-[2px] border border-solid border-[#7c33b5] bg-white"
      style={{
        boxShadow:
          "0px 12px 20px 0px rgba(113, 113, 128, 0.1), 0px 1px 4px 0px rgba(113, 113, 128, 0.08)",
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Component 1: Dropdown field (closed)                                */
/* ------------------------------------------------------------------ */

const CAMPAIGN_DISPLAY = "Campaign name goes here - display";
const CAMPAIGN_VIDEO = "Campaign name goes here - video";
const CAMPAIGN_LONG =
  "Campaign name goes here - display -  other details - 2 june 2020";

function renderClosedField(props: PropValues): JSX.Element {
  const selection = String(props.selection);
  const disabled = props.disabled === true;

  let pills: string[] = [CAMPAIGN_DISPLAY];
  let extra: string | undefined;

  if (selection === "1 selected") {
    pills = [CAMPAIGN_DISPLAY];
  } else if (selection === "2 selected") {
    pills = [CAMPAIGN_DISPLAY, CAMPAIGN_VIDEO];
  } else if (selection === "Overflow (+count)") {
    pills = [CAMPAIGN_LONG, CAMPAIGN_VIDEO, CAMPAIGN_VIDEO];
    extra = "+4";
  } else if (selection === "All selected") {
    pills = [CAMPAIGN_DISPLAY, CAMPAIGN_VIDEO];
    extra = "+4";
  }

  return (
    <div className="w-full max-w-[320px]">
      <DropdownField pills={pills} extra={extra} disabled={disabled} />
    </div>
  );
}

const closedConfig: PlaygroundConfig = {
  name: "Multiselect — Dropdown (closed)",
  description:
    "Closed field showing selected values as pills, with overflow count and disabled state.",
  controls: [
    {
      kind: "select",
      name: "selection",
      label: "Selection",
      options: ["1 selected", "2 selected", "Overflow (+count)", "All selected"],
      defaultValue: "1 selected",
      asTabs: true,
    },
    { kind: "boolean", name: "disabled", label: "Disabled", defaultValue: false },
  ],
  render: (props) => renderClosedField(props),
  tokens: {
    "field/border": "#7c33b5",
    "field/background": "#ffffff",
    "field/background/disabled": "rgba(113,113,128,0.04)",
    "pill/brand/background": "#7c33b5",
    "pill/count/background": "#f6ebff",
    "pill/count/text": "#662994",
    "radius/field": "2px",
    "pill/height": "18px",
  },
};

/* ------------------------------------------------------------------ */
/* Component 2: Dropdown (open) with menu                              */
/* ------------------------------------------------------------------ */

const OPTION_LABELS = [
  "Option one",
  "Option two",
  "Option three",
  "Option four",
  "Option five",
];

function OpenDropdown({ props }: { props: PropValues }): JSX.Element {
  const state = String(props.state);
  const searchValue = String(props.searchValue);
  const disabled = props.disabled === true;

  const [selected, setSelected] = useState<Record<string, boolean>>({
    "Option one": true,
  });
  const toggle = (label: string) =>
    setSelected((s) => ({ ...s, [label]: !s[label] }));

  // Field pills reflect the state.
  let fieldPills: string[] = ["Option one"];
  let fieldExtra: string | undefined;
  if (state === "All selected") {
    fieldPills = ["Option one", "Option two"];
    fieldExtra = "+3";
  } else if (state === "Selected (interactive)") {
    const chosen = OPTION_LABELS.filter((l) => selected[l]);
    fieldPills = chosen.length ? chosen.slice(0, 2) : ["Option one"];
    fieldExtra = chosen.length > 2 ? `+${chosen.length - 2}` : undefined;
  }

  return (
    <div className="flex w-full max-w-[320px] flex-col gap-1">
      <DropdownField
        pills={fieldPills}
        extra={fieldExtra}
        open
        disabled={state === "All selected" && disabled}
      />
      <Menu>
        {state === "No results" ? (
          <>
            <SearchRow value={searchValue} />
            <div className="flex w-full items-center justify-center px-3 py-4">
              <span className="font-['DM_Sans'] text-[14px] font-normal leading-[20px] text-[#a8a8b2]">
                No results found
              </span>
            </div>
          </>
        ) : state === "Search suggestions" ? (
          <>
            <SearchRow value={searchValue} />
            {OPTION_LABELS.map((label) => (
              <OptionRow key={label} label={label} />
            ))}
          </>
        ) : state === "All selected" ? (
          <>
            {!disabled ? <SearchRow value={searchValue} /> : null}
            {OPTION_LABELS.map((label) => (
              <OptionRow key={label} label={label} checked disabled={disabled} />
            ))}
          </>
        ) : (
          // Selected (interactive)
          <>
            <SearchRow value={searchValue} />
            {OPTION_LABELS.map((label) => (
              <OptionRow
                key={label}
                label={label}
                checked={!!selected[label]}
                onToggle={() => toggle(label)}
              />
            ))}
          </>
        )}
      </Menu>
    </div>
  );
}

const openConfig: PlaygroundConfig = {
  name: "Multiselect — Dropdown (open)",
  description:
    "Open menu states: live search, suggestions, interactive selection, all-selected and disabled.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: [
        "Selected (interactive)",
        "Search suggestions",
        "No results",
        "All selected",
      ],
      defaultValue: "Selected (interactive)",
      asTabs: true,
    },
    {
      kind: "text",
      name: "searchValue",
      label: "Search text",
      defaultValue: "Search",
      placeholder: "Search",
    },
    { kind: "boolean", name: "disabled", label: "Disabled", defaultValue: false },
  ],
  render: (props) => <OpenDropdown props={props} />,
  tokens: {
    "menu/border": "#7c33b5",
    "menu/background": "#ffffff",
    "option/row/border": "#e1e1e8",
    "option/selected/background": "#f6ebff",
    "option/hover/background": "rgba(113,113,128,0.08)",
    "checkbox/checked": "#7c33b5",
    "checkbox/unchecked/border": "#c6c6cc",
    "checkbox/disabled/background": "rgba(113,113,128,0.1)",
    "option/text": "#13131a",
    "option/text/selected": "#7c33b5",
    "option/text/disabled": "#a8a8b2",
    "search/placeholder": "rgba(113,113,128,0.6)",
  },
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function MultiselectPage(): JSX.Element {
  return (
    <section aria-label="Multiselect component playground" className="flex flex-col gap-6">
      <Playground config={closedConfig} />
      <Playground config={openConfig} />
    </section>
  );
}
