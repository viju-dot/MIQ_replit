import { useState } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

/* Assets downloaded from Figma (temporary URLs) into /public/figmaAssets/list */
const imgAvatar = "/figmaAssets/list/avatar.png";
const imgButtonIcon = "/figmaAssets/list/button-icon.svg";

/* ---------------------------------------------------------------------------
 * Avatar (40) with "Pro" badge — used as a leftItem in the List component
 * ------------------------------------------------------------------------- */
function Avatar() {
  return (
    <div className="flex items-center overflow-hidden px-[2px] relative shrink-0">
      <div className="h-[40px] relative shrink-0 w-[36px]">
        <div className="absolute left-[2px] top-0 h-[32px] w-[32px] rounded-[24px] overflow-hidden">
          <img
            alt=""
            className="absolute inset-0 max-w-none h-full w-full object-cover pointer-events-none rounded-[24px]"
            src={imgAvatar}
          />
        </div>
        {/* Pro badge */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-start">
          <div className="flex h-[18px] items-center justify-center gap-[var(--spacing-50,4px)] rounded-[100px] bg-gradient-to-r from-[#d71a82] to-[#f456ca] px-[var(--spacing-100,8px)] py-[var(--spacing-25,2px)]">
            <p className="leading-[var(--body-sm-medium-line-height,18px)] text-[length:var(--body-sm-medium-size,12px)] font-medium text-white text-center whitespace-nowrap">
              Pro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Checkbox element (leftItem default) — mirrors the Figma checkbox visuals
 * ------------------------------------------------------------------------- */
function LeftCheckbox({
  checked = false,
  disabled = false,
  onChange,
}: {
  checked?: boolean;
  disabled?: boolean;
  onChange?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(ev) => {
        ev.stopPropagation();
        onChange?.();
      }}
      aria-checked={checked}
      role="checkbox"
      className="flex items-center justify-center overflow-hidden p-[2px] rounded-[var(--radius-25,2px)] shrink-0 all-unset cursor-pointer disabled:cursor-not-allowed"
    >
      <div className="flex items-center overflow-hidden p-[2px] shrink-0">
        <div
          className={`flex h-[16px] w-[16px] items-center justify-center rounded-[var(--radius-25,2px)] border-[1.5px] border-solid transition-colors duration-150 ${
            checked
              ? disabled
                ? "border-transparent bg-[var(--container-dynamic-neutral-subtle-background-disabled,#7171801a)]"
                : "border-[var(--border-dynamic-brand-default,#7c33b5)] bg-[var(--container-dynamic-brand-bold-background-default,#7c33b5)]"
              : "border-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)] bg-transparent"
          }`}
        >
          {checked && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke={disabled ? "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)" : "var(--container-dynamic-brand-bold-foreground-default, #ffffff)"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}

/* ---------------------------------------------------------------------------
 * Checkbox visual (non-interactive) — used when the whole row is a <button>,
 * so we never nest an interactive control inside another interactive control.
 * ------------------------------------------------------------------------- */
function CheckboxVisual({
  checked = false,
  disabled = false,
}: {
  checked?: boolean;
  disabled?: boolean;
}) {
  return (
    <div className="flex items-center justify-center overflow-hidden p-[2px] rounded-[var(--radius-25,2px)] shrink-0">
      <div className="flex items-center overflow-hidden p-[2px] shrink-0">
        <div
          className={`flex h-[16px] w-[16px] items-center justify-center rounded-[var(--radius-25,2px)] border-[1.5px] border-solid transition-colors duration-150 ${
            checked
              ? disabled
                ? "border-transparent bg-[var(--container-dynamic-neutral-subtle-background-disabled,#7171801a)]"
                : "border-[var(--border-dynamic-brand-default,#7c33b5)] bg-[var(--container-dynamic-brand-bold-background-default,#7c33b5)]"
              : "border-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)] bg-transparent"
          }`}
        >
          {checked && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke={disabled ? "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)" : "var(--container-dynamic-brand-bold-foreground-default, #ffffff)"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Trailing action button (rightItem default)
 * ------------------------------------------------------------------------- */
function TrailingButton() {
  return (
    <div className="flex items-center justify-center rounded-[var(--radius-25,2px)] bg-[var(--container-dynamic-brand-bold-background-default,#7c33b5)] p-[2px] shrink-0">
      <div className="flex items-center justify-center p-[2px] h-[20px] w-[20px]">
        <img alt="" className="h-[16.25px] w-[16.25px]" src={imgButtonIcon} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * List item — faithful reproduction of the Figma "List item" component
 * ------------------------------------------------------------------------- */
type ListItemProps = {
  headingValue?: string;
  descriptionValue?: string;
  description?: boolean;
  leftSlot?: boolean;
  leftItem?: React.ReactNode;
  rightSlot?: boolean;
  rightItem?: React.ReactNode;
  contentSlot?: boolean;
  contentItem?: React.ReactNode;
  hasSeparator?: boolean;
  checked?: boolean;
  disabled?: boolean;
  onCheckChange?: () => void;
  /**
   * Forced visual state from the Properties panel. When set to anything other
   * than "Default" it stays FORCED — live hover/click will not override it
   * (state-resolution policy). "Disabled" always wins.
   */
  state?: ListStateName;
  /* When true, the row responds to real hover / click-to-select itself. */
  interactive?: boolean;
};

/**
 * Shared state → inline-style map (single source of truth for panel + natural
 * states). Inline styles are used because arbitrary Tailwind classes built from
 * var()/rgba (e.g. bg-[var(--x,#71718014)]) silently fail to compile in this
 * project. Values below mirror the Figma list-item Default/Hover/Selected/
 * Disabled variants; each routes through a CSS var with the Figma literal as a
 * fallback so it stays pixel-accurate even when the var is undefined.
 */
type ListStateName = "Default" | "Hover" | "Selected" | "Disabled";
const LIST_STATE_STYLES: Record<
  ListStateName,
  { background: string; heading: string }
> = {
  Default: {
    background: "transparent",
    heading: "var(--surface-foreground-static-neutral-lvl1, #13131a)",
  },
  Hover: {
    background:
      "var(--container-dynamic-neutral-subtle-background-hover, rgba(113,113,128,0.08))",
    heading: "var(--surface-foreground-static-neutral-lvl1, #13131a)",
  },
  Selected: {
    background:
      "var(--container-dynamic-brand-subtle-background-selected, #f6ebff)",
    heading: "var(--surface-foreground-dynamic-brand-default, #7c33b5)",
  },
  Disabled: {
    background: "transparent",
    heading: "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)",
  },
} as const;

function ListItem({
  headingValue = "Placeholder text",
  descriptionValue = "Description",
  description = false,
  leftSlot = true,
  leftItem,
  rightSlot = false,
  rightItem,
  contentSlot = false,
  contentItem,
  hasSeparator = true,
  checked = false,
  disabled = false,
  onCheckChange,
  state = "Default",
  interactive = false,
}: ListItemProps) {
  const [hovered, setHovered] = useState(false);
  const [selfSelected, setSelfSelected] = useState(false);

  // Resolve the effective visual state (policy: Disabled always wins; a
  // non-Default forced panel state stays forced; only when the panel base is
  // Default does natural hover / click-to-select drive the state).
  const forced = disabled ? "Disabled" : state;
  let effective: ListStateName = forced;
  let rowChecked = checked;
  if (interactive && forced === "Default") {
    effective = selfSelected ? "Selected" : hovered ? "Hover" : "Default";
    rowChecked = selfSelected;
  }
  const styleFor = LIST_STATE_STYLES[effective];

  // The row is only a real control when it is interactive AND enabled. Using a
  // native <button> gives keyboard (Enter/Space) + focus for free. When the row
  // is a button we must NOT nest another interactive control inside it, so the
  // leftItem checkbox is rendered as a non-interactive visual in that mode
  // (activating the row toggles selection).
  const rowIsButton = interactive && !disabled;

  const rowClassName = `flex flex-col gap-[var(--spacing-100,8px)] items-start justify-center p-[var(--spacing-100,8px)] relative w-full text-left transition-colors duration-150 ${
    rowIsButton ? "cursor-pointer" : ""
  }`;

  const centre = (
    <>
      <div className="flex gap-[var(--spacing-100,8px)] items-start relative w-full">
        {/* leftSlot */}
        {leftSlot && (
          <div className="flex gap-[var(--spacing-100,8px)] items-center relative shrink-0">
            <div className="flex flex-col items-start overflow-hidden relative shrink-0">
              {leftItem ??
                (rowIsButton ? (
                  // Non-interactive checkbox visual (row button owns activation)
                  <CheckboxVisual checked={rowChecked} disabled={disabled} />
                ) : (
                  <LeftCheckbox
                    checked={rowChecked}
                    disabled={disabled}
                    onChange={onCheckChange}
                  />
                ))}
            </div>
          </div>
        )}
        {/* centreSlot */}
        <div className="flex flex-1 flex-col gap-[var(--spacing-100,8px)] items-start min-w-0 pt-[2px] relative self-stretch">
          <div className="flex flex-col gap-[var(--spacing-50,4px)] items-start relative w-full">
            <p
              className="leading-[var(--body-md-medium-line-height,20px)] overflow-hidden text-ellipsis whitespace-nowrap text-[length:var(--body-md-medium-size,14px)] w-full transition-colors duration-150"
              style={{ color: styleFor.heading }}
            >
              {headingValue}
            </p>
            {description && (
              <p className="h-[18px] leading-[var(--body-sm-regular-line-height,18px)] overflow-hidden text-ellipsis whitespace-nowrap text-[length:var(--body-sm-regular-size,12px)] text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)] w-full">
                {descriptionValue}
              </p>
            )}
          </div>
          {contentSlot && (
            <div className="h-[27px] relative w-full">{contentItem}</div>
          )}
        </div>
        {/* trailingSlot */}
        {rightSlot && (
          <div className="flex gap-[var(--spacing-100,8px)] items-center justify-end relative shrink-0">
            <div className="flex gap-[var(--spacing-100,8px)] h-[24px] items-center justify-end overflow-hidden shrink-0">
              {rightItem ?? <TrailingButton />}
            </div>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div className="flex flex-col items-start relative w-full min-w-[200px]">
      {rowIsButton ? (
        <button
          type="button"
          aria-pressed={rowChecked}
          onClick={() => setSelfSelected((v) => !v)}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          className={`${rowClassName} all-unset w-full`}
          style={{ backgroundColor: styleFor.background }}
        >
          {centre}
        </button>
      ) : (
        <div
          className={rowClassName}
          style={{ backgroundColor: styleFor.background }}
        >
          {centre}
        </div>
      )}
      {hasSeparator && <div className="h-0 w-full border-t border-[var(--border-static-subtle-neutral,#e1e1e8)]" />}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * List — the wrapper component (listWrapper + optional scrollbar)
 * ------------------------------------------------------------------------- */
function List({
  children,
  hasScroll = false,
  className = "",
}: {
  children: React.ReactNode;
  hasScroll?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-start min-w-[200px] w-[281px] ${className}`}>
      <div className="flex flex-1 flex-col items-start min-w-0 overflow-hidden relative">
        {children}
      </div>
      {hasScroll && (
        <div className="flex items-center justify-center self-stretch shrink-0 w-[12px] py-[2px]">
          <div className="w-[8px] flex-1 rounded-[100px] bg-[var(--border-static-subtle-neutral,#e1e1e8)]" />
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * List item playground — the interactive component with its real variant axes:
 * State, leftItem type, description toggle, rightSlot, contentSlot, separator,
 * and editable heading / description text.
 * ------------------------------------------------------------------------- */
type StateName = ListStateName;

/** Panel-forced state → its checked/disabled companions. */
function stateFlags(state: StateName): { disabled: boolean; checked: boolean } {
  switch (state) {
    case "Selected":
      return { disabled: false, checked: true };
    case "Disabled":
      return { disabled: true, checked: false };
    default:
      return { disabled: false, checked: false };
  }
}

function renderLeftItem(leftItem: string): React.ReactNode | undefined {
  if (leftItem === "Avatar") return <Avatar />;
  // "Checkbox" → undefined lets ListItem fall back to its default LeftCheckbox
  return undefined;
}

const listItemConfig: PlaygroundConfig = {
  name: "List item",
  description:
    "A single row of the List component — configure its state, slots and text.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Default", "Hover", "Selected", "Disabled"],
      defaultValue: "Default",
      asTabs: true,
    },
    {
      kind: "select",
      name: "leftItem",
      label: "leftItem",
      options: ["Checkbox", "Avatar", "None"],
      defaultValue: "Checkbox",
    },
    { kind: "boolean", name: "description", label: "description", defaultValue: true },
    { kind: "boolean", name: "rightSlot", label: "rightSlot", defaultValue: false },
    { kind: "boolean", name: "contentSlot", label: "contentSlot", defaultValue: false },
    { kind: "boolean", name: "hasSeparator", label: "separator", defaultValue: true },
    {
      kind: "text",
      name: "heading",
      label: "heading",
      defaultValue: "Placeholder text",
      placeholder: "Heading",
    },
    {
      kind: "text",
      name: "descriptionText",
      label: "description text",
      defaultValue: "Description",
      placeholder: "Description",
    },
  ],
  render: (props: PropValues) => {
    const state = props.state as StateName;
    const s = stateFlags(state);
    const leftItemChoice = String(props.leftItem);
    // When the panel is on Default, let the row respond to real hover/click
    // (natural interactivity mirroring the Figma Hover/Selected variants).
    const interactive = state === "Default";
    return (
      <div className="w-[394px] max-w-full">
        <ListItem
          key={state}
          headingValue={String(props.heading)}
          descriptionValue={String(props.descriptionText)}
          description={props.description === true}
          leftSlot={leftItemChoice !== "None"}
          leftItem={renderLeftItem(leftItemChoice)}
          rightSlot={props.rightSlot === true}
          contentSlot={props.contentSlot === true}
          contentItem={
            <div className="h-[27px] w-full rounded-[var(--numbers-6,6px)] bg-[var(--surface-background-lvl2,#f7f7fa)]" />
          }
          hasSeparator={props.hasSeparator === true}
          checked={s.checked}
          disabled={s.disabled}
          state={state}
          interactive={interactive}
        />
      </div>
    );
  },
  tokens: {
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "surface/foreground/dynamic/neutral/default/regular": "var(--surface-foreground-dynamic-neutral-default-regular)",
    "surface/foreground/dynamic/neutral/disabled": "var(--surface-foreground-dynamic-neutral-disabled)",
    "surface/foreground/dynamic/brand/default": "var(--surface-foreground-dynamic-brand-default)",
    "container/dynamic/neutral/subtle/background/hover": "var(--container-dynamic-neutral-subtle-background-hover)",
    "container/dynamic/brand/subtle/background/selected": "var(--container-dynamic-brand-subtle-background-selected)",
    "container/dynamic/brand/bold/background/default": "var(--container-dynamic-brand-bold-background-default)",
    "container/dynamic/neutral/subtle/background/disabled": "var(--container-dynamic-neutral-subtle-background-disabled)",
    "border/dynamic/brand/default": "var(--border-dynamic-brand-default)",
    "border/dynamic/neutral/subtle/default": "var(--border-dynamic-neutral-subtle-default)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "surface/background/lvl2": "var(--surface-background-lvl2)",
    "spacing/100": "var(--spacing-100)",
    "radius/25": "var(--radius-25)",
  },
};

/* ---------------------------------------------------------------------------
 * List wrapper playground — the container variant axes:
 * item type (Checkbox / Avatar), item count, and the hasScroll scrollbar.
 * ------------------------------------------------------------------------- */
const listConfig: PlaygroundConfig = {
  name: "List",
  description: "Wrapper that stacks List items, with an optional scrollbar.",
  controls: [
    {
      kind: "select",
      name: "type",
      label: "Type",
      options: ["Checkbox", "Avatar"],
      defaultValue: "Checkbox",
      asTabs: true,
    },
    {
      kind: "select",
      name: "count",
      label: "Items",
      options: ["2", "3", "4"],
      defaultValue: "4",
    },
    { kind: "boolean", name: "hasScroll", label: "hasScroll", defaultValue: false },
  ],
  render: (props: PropValues) => {
    const type = String(props.type);
    const count = parseInt(String(props.count), 10);
    const items = Array.from({ length: count }, (_, i) => {
      const last = i === count - 1;
      if (type === "Avatar") {
        return (
          <ListItem
            key={i}
            leftItem={<Avatar />}
            headingValue="Sammy Tailor"
            description
            descriptionValue="Agency director"
            hasSeparator={!last}
            interactive
          />
        );
      }
      return (
        <ListItem
          key={i}
          headingValue="Placeholder text"
          hasSeparator={!last}
          interactive
        />
      );
    });
    return <List hasScroll={props.hasScroll === true}>{items}</List>;
  },
  tokens: {
    "container/width": "281px",
    "container/min-width": "200px",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "scrollbar/width": "8px",
  },
};

/* ---------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------- */
export default function ListPage() {
  return (
    <section
      aria-label="List component playground"
      className="flex flex-col gap-6"
    >
      <Playground config={listItemConfig} />
      <Playground config={listConfig} />
    </section>
  );
}
