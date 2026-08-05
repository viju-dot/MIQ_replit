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
          <div className="flex h-[18px] items-center justify-center gap-[4px] rounded-[100px] bg-gradient-to-r from-[#d71a82] to-[#f456ca] px-[8px] py-[2px]">
            <p className="leading-[18px] text-[12px] font-medium text-white text-center whitespace-nowrap">
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
      onClick={onChange}
      aria-checked={checked}
      role="checkbox"
      className="flex items-center justify-center overflow-hidden p-[2px] rounded-[2px] shrink-0 all-unset cursor-pointer disabled:cursor-not-allowed"
    >
      <div className="flex items-center overflow-hidden p-[2px] shrink-0">
        <div
          className={`flex h-[16px] w-[16px] items-center justify-center rounded-[2px] border-[1.5px] border-solid ${
            checked
              ? disabled
                ? "border-transparent bg-[#7171801a]"
                : "border-[#7c33b5] bg-[#7c33b5]"
              : "border-[#c6c6cc] bg-transparent"
          }`}
        >
          {checked && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke={disabled ? "#a8a8b2" : "#ffffff"}
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
 * Trailing action button (rightItem default)
 * ------------------------------------------------------------------------- */
function TrailingButton() {
  return (
    <div className="flex items-center justify-center rounded-[2px] bg-[#7c33b5] p-[2px] shrink-0">
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
  /* visual state background */
  backgroundClass?: string;
  headingClass?: string;
};

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
  backgroundClass = "",
  headingClass = "text-[#13131a]",
}: ListItemProps) {
  return (
    <div className="flex flex-col items-start relative w-full min-w-[200px]">
      <div
        className={`flex flex-col gap-[8px] items-start justify-center p-[8px] relative w-full ${backgroundClass}`}
      >
        <div className="flex gap-[8px] items-start relative w-full">
          {/* leftSlot */}
          {leftSlot && (
            <div className="flex gap-[8px] items-center relative shrink-0">
              <div className="flex flex-col items-start overflow-hidden relative shrink-0">
                {leftItem ?? (
                  <LeftCheckbox
                    checked={checked}
                    disabled={disabled}
                    onChange={onCheckChange}
                  />
                )}
              </div>
            </div>
          )}
          {/* centreSlot */}
          <div className="flex flex-1 flex-col gap-[8px] items-start min-w-0 pt-[2px] relative self-stretch">
            <div className="flex flex-col gap-[4px] items-start relative w-full">
              <p
                className={`leading-[20px] overflow-hidden text-ellipsis whitespace-nowrap text-[14px] w-full ${headingClass}`}
              >
                {headingValue}
              </p>
              {description && (
                <p className="h-[18px] leading-[18px] overflow-hidden text-ellipsis whitespace-nowrap text-[12px] text-[#4b4b59] w-full">
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
            <div className="flex gap-[8px] items-center justify-end relative shrink-0">
              <div className="flex gap-[8px] h-[24px] items-center justify-end overflow-hidden shrink-0">
                {rightItem ?? <TrailingButton />}
              </div>
            </div>
          )}
        </div>
      </div>
      {hasSeparator && <div className="h-0 w-full border-t border-[#e1e1e8]" />}
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
          <div className="w-[8px] flex-1 rounded-[100px] bg-[#e1e1e8]" />
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
type StateName = "Default" | "Hover" | "Selected" | "Disabled";

function stateStyles(state: StateName): {
  backgroundClass: string;
  headingClass: string;
  disabled: boolean;
  checked: boolean;
} {
  switch (state) {
    case "Hover":
      return {
        backgroundClass: "bg-[#71718014]",
        headingClass: "text-[#13131a]",
        disabled: false,
        checked: false,
      };
    case "Selected":
      return {
        backgroundClass: "bg-[#f6ebff]",
        headingClass: "text-[#7c33b5]",
        disabled: false,
        checked: true,
      };
    case "Disabled":
      return {
        backgroundClass: "",
        headingClass: "text-[#a8a8b2]",
        disabled: true,
        checked: false,
      };
    default:
      return {
        backgroundClass: "",
        headingClass: "text-[#13131a]",
        disabled: false,
        checked: false,
      };
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
    const s = stateStyles(state);
    const leftItemChoice = String(props.leftItem);
    return (
      <div className="w-[394px] max-w-full">
        <ListItem
          headingValue={String(props.heading)}
          descriptionValue={String(props.descriptionText)}
          description={props.description === true}
          leftSlot={leftItemChoice !== "None"}
          leftItem={renderLeftItem(leftItemChoice)}
          rightSlot={props.rightSlot === true}
          contentSlot={props.contentSlot === true}
          contentItem={
            <div className="h-[27px] w-full rounded-[6px] bg-[#f7f7fa]" />
          }
          hasSeparator={props.hasSeparator === true}
          checked={s.checked}
          disabled={s.disabled}
          backgroundClass={s.backgroundClass}
          headingClass={s.headingClass}
        />
      </div>
    );
  },
  tokens: {
    "text/heading": "#13131a",
    "text/description": "#4b4b59",
    "text/disabled": "#a8a8b2",
    "text/selected": "#7c33b5",
    "container/hover/background": "#71718014",
    "container/selected/background": "#f6ebff",
    "container/checkbox/checked": "#7c33b5",
    "container/checkbox/disabled": "#7171801a",
    "border/checkbox": "#c6c6cc",
    "border/separator": "#e1e1e8",
    "container/content/background": "#f7f7fa",
    "spacing/padding": "8px",
    "radius/checkbox": "2px",
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
          />
        );
      }
      return (
        <ListItem key={i} headingValue="Placeholder text" hasSeparator={!last} />
      );
    });
    return <List hasScroll={props.hasScroll === true}>{items}</List>;
  },
  tokens: {
    "container/width": "281px",
    "container/min-width": "200px",
    "scrollbar/track": "#e1e1e8",
    "scrollbar/width": "8px",
    "border/separator": "#e1e1e8",
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
