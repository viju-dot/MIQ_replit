import { useState } from "react";

const PILL_CLOSE = "/figmaAssets/multiselect/pill-close.svg";
const CARET_DOWN = "/figmaAssets/multiselect/caret-down.svg";
const CARET_UP = "/figmaAssets/multiselect/caret-up.svg";
const SEARCH = "/figmaAssets/multiselect/search.svg";
const CHECK = "/figmaAssets/icon-check.svg";

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

function Caption({ children }: { children: React.ReactNode }): JSX.Element {
  return <span className="text-[12px] text-[#a8a8b2]">{children}</span>;
}

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

/* The closed dropdown field (as in the "Dropdown Closed" instance). */
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
      className={`flex w-full flex-col items-start justify-center rounded-[2px] border border-solid ${
        open ? "border-[#7c33b5]" : "border-[#7c33b5]"
      } ${disabled ? "bg-[#7171800a]" : "bg-white"}`}
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

function VariantBlock({
  caption,
  children,
}: {
  caption: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="flex w-full max-w-[320px] flex-col gap-1">
      <Caption>{caption}</Caption>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function MultiselectPage(): JSX.Element {
  const optionLabels = [
    "Option one",
    "Option two",
    "Option three",
    "Option four",
    "Option five",
  ];

  const [selected, setSelected] = useState<Record<string, boolean>>({
    "Option one": true,
  });

  const toggle = (label: string) =>
    setSelected((s) => ({ ...s, [label]: !s[label] }));

  return (
    <section aria-label="Multiselect" className="flex flex-col gap-8">
      {/* Closed states -------------------------------------------------- */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <h2 className="mb-4 text-[14px] font-medium text-[#13131a]">
          Dropdown closed
        </h2>
        <div className="flex flex-wrap gap-8">
          <VariantBlock caption="1 option selected — closed">
            <DropdownField pills={["Campaign name goes here - display"]} />
          </VariantBlock>

          <VariantBlock caption="2 options selected — closed">
            <DropdownField
              pills={[
                "Campaign name goes here - display",
                "Campaign name goes here - video",
              ]}
            />
          </VariantBlock>

          <VariantBlock caption="Overflow (+count) — closed">
            <DropdownField
              pills={[
                "Campaign name goes here - display -  other details - 2 june 2020",
                "Campaign name goes here - video",
                "Campaign name goes here - video",
              ]}
              extra="+4"
            />
          </VariantBlock>

          <VariantBlock caption="All selected (Disabled)">
            <DropdownField
              pills={[
                "Campaign name goes here - display",
                "Campaign name goes here - video",
              ]}
              extra="+4"
              disabled
            />
          </VariantBlock>
        </div>
      </div>

      {/* Open menu states ---------------------------------------------- */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <h2 className="mb-4 text-[14px] font-medium text-[#13131a]">
          Dropdown open
        </h2>
        <div className="flex flex-wrap items-start gap-8">
          <VariantBlock caption="No results">
            <DropdownField pills={["Campaign name goes here - display"]} open />
            <Menu>
              <SearchRow value="Searching…" />
              <div className="flex w-full items-center justify-center px-3 py-4">
                <span className="font-['DM_Sans'] text-[14px] font-normal leading-[20px] text-[#a8a8b2]">
                  No results found
                </span>
              </div>
            </Menu>
          </VariantBlock>

          <VariantBlock caption="Search suggestions">
            <DropdownField pills={["Campaign name goes here - display"]} open />
            <Menu>
              <SearchRow value="Opt" />
              {optionLabels.map((label) => (
                <OptionRow key={label} label={label} />
              ))}
            </Menu>
          </VariantBlock>

          <VariantBlock caption="1 option selected — open (interactive)">
            <DropdownField pills={["Option one"]} open />
            <Menu>
              <SearchRow value="Search" />
              {optionLabels.map((label) => (
                <OptionRow
                  key={label}
                  label={label}
                  checked={!!selected[label]}
                  onToggle={() => toggle(label)}
                />
              ))}
            </Menu>
          </VariantBlock>

          <VariantBlock caption="All selected — open">
            <DropdownField
              pills={["Option one", "Option two"]}
              extra="+3"
              open
            />
            <Menu>
              <SearchRow value="Search" />
              {optionLabels.map((label) => (
                <OptionRow key={label} label={label} checked />
              ))}
            </Menu>
          </VariantBlock>

          <VariantBlock caption="All selected (Disabled) — open">
            <DropdownField
              pills={["Option one", "Option two"]}
              extra="+3"
              open
              disabled
            />
            <Menu>
              {optionLabels.map((label) => (
                <OptionRow key={label} label={label} checked disabled />
              ))}
            </Menu>
          </VariantBlock>
        </div>
      </div>
    </section>
  );
}
