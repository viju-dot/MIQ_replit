import { useState } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

const ASSET = "/figmaAssets/button-group";

// Focus ring via inline boxShadow (var() in Tailwind arbitrary ring classes
// silently fails in this project, so it is driven from focus-visible state).
const FOCUS_RING =
  "0 0 0 2px var(--surface-background-lvl1,#ffffff), 0 0 0 4px var(--border-dynamic-brand-selected,#7c33b5)";

type Side = "Left" | "Middle" | "Right";
type State = "Selected" | "Unselected" | "Hover" | "Disabled";

// ---------------------------------------------------------------------------
// Design tokens (converted from Figma CSS variables to plain fallback values)
// ---------------------------------------------------------------------------
const BG: Record<State, string> = {
  Selected:
    "var(--container-dynamic-neutral-subtle-background-default-variation,#ebebf0)",
  Unselected:
    "var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)",
  Hover:
    "var(--container-dynamic-neutral-subtle-background-hover,rgba(113,113,128,0.08))",
  Disabled:
    "var(--container-dynamic-neutral-subtle-background-disabled,rgba(113,113,128,0.1))",
};
const TEXT: Record<State, string> = {
  Selected:
    "var(--container-dynamic-neutral-subtle-foreground-selected,#13131a)",
  Unselected:
    "var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)",
  Hover: "var(--container-dynamic-neutral-subtle-foreground-hover,#13131a)",
  Disabled:
    "var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)",
};
const BORDER = (state: State) =>
  state === "Disabled"
    ? "var(--border-dynamic-neutral-subtle-disabled,#e1e1e8)"
    : "var(--border-dynamic-neutral-subtle-default,#c6c6cc)";

// End-corner radius depending on side (adjacent sides overlap by -1px)
function radiusStyle(side: Side): React.CSSProperties {
  const r = "var(--old-radiuses-2,2px)";
  if (side === "Left") {
    return { borderTopLeftRadius: r, borderBottomLeftRadius: r };
  }
  if (side === "Right") {
    return { borderTopRightRadius: r, borderBottomRightRadius: r };
  }
  return {};
}

// ---------------------------------------------------------------------------
// Icon (table) button — single segment
// ---------------------------------------------------------------------------
function iconSrc(state: State, compact: boolean): string {
  const size = compact ? "small" : "medium";
  const key =
    state === "Disabled"
      ? "disabled"
      : state === "Hover"
        ? "hover"
        : state === "Unselected"
          ? "unselected"
          : "selected";
  return `${ASSET}/table-${key}-${size}.svg`;
}

type IconSegmentProps = {
  side: Side;
  state: State;
  compact: boolean;
  overlap?: boolean;
  onClick?: () => void;
};

function IconSegment({ side, state, compact, overlap = false, onClick }: IconSegmentProps) {
  const boxClass = compact
    ? "h-[var(--old-sizing-24,24px)] w-[var(--old-sizing-34,34px)]"
    : "size-[var(--old-sizing-34,34px)]";
  const iconBoxSize = compact
    ? "var(--old-sizing-16,16px)"
    : "var(--old-sizing-24,24px)";
  // Natural interactivity only applies to interactive (composite-group)
  // segments. In the individual-segment playground the panel forces the state
  // explicitly, so live hover must not override it (state stays forced).
  const [pointerHover, setPointerHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const clickable = !!onClick && state !== "Disabled";
  const effState: State =
    clickable && pointerHover && state !== "Selected" ? "Hover" : state;
  return (
    <div
      role={clickable ? "button" : undefined}
      aria-pressed={clickable ? state === "Selected" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? onClick : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      onMouseEnter={clickable ? () => setPointerHover(true) : undefined}
      onMouseLeave={clickable ? () => setPointerHover(false) : undefined}
      onFocus={clickable ? (e) => setFocused(e.currentTarget.matches(":focus-visible")) : undefined}
      onBlur={clickable ? () => setFocused(false) : undefined}
      className={`relative shrink-0 overflow-hidden outline-none ${focused ? "z-10" : ""} ${boxClass} ${
        state === "Disabled" ? "cursor-not-allowed" : clickable ? "cursor-pointer" : ""
      } ${overlap ? "mr-[var(--odd-numbers-1,-1px)]" : ""}`}
      style={{ ...radiusStyle(side), ...(focused ? { boxShadow: FOCUS_RING } : null) }}
    >
      {/* base fill + border */}
      <div
        className="absolute inset-0 border border-solid transition-colors duration-150"
        style={{
          backgroundColor: BG[effState],
          borderColor: BORDER(effState),
          ...radiusStyle(side),
        }}
      />
      {/* icon */}
      <div
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        style={{ width: iconBoxSize, height: iconBoxSize }}
      >
        <img
          alt=""
          className="block size-full max-w-none"
          src={iconSrc(effState, compact)}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Text button — single segment
// ---------------------------------------------------------------------------
type TextSegmentProps = {
  side: Side;
  state: State;
  compact: boolean;
  overlap?: boolean;
  label?: string;
  onClick?: () => void;
};

function TextSegment({ side, state, compact, overlap = false, label = "Button", onClick }: TextSegmentProps) {
  // Natural interactivity only applies to interactive (composite-group)
  // segments. In the individual-segment playground the panel forces the state
  // explicitly, so live hover must not override it (state stays forced).
  const [pointerHover, setPointerHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const clickable = !!onClick && state !== "Disabled";
  const effState: State =
    clickable && pointerHover && state !== "Selected" ? "Hover" : state;
  return (
    <div
      role={clickable ? "button" : undefined}
      aria-pressed={clickable ? state === "Selected" : undefined}
      tabIndex={clickable ? 0 : undefined}
      onClick={clickable ? onClick : undefined}
      onKeyDown={
        clickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onClick?.();
              }
            }
          : undefined
      }
      onMouseEnter={clickable ? () => setPointerHover(true) : undefined}
      onMouseLeave={clickable ? () => setPointerHover(false) : undefined}
      onFocus={clickable ? (e) => setFocused(e.currentTarget.matches(":focus-visible")) : undefined}
      onBlur={clickable ? () => setFocused(false) : undefined}
      className={`relative flex shrink-0 items-center justify-center px-[var(--spacing-300,24px)] border border-solid transition-colors duration-150 outline-none ${focused ? "z-10" : ""} ${
        compact
          ? "h-[var(--old-sizing-24,24px)] py-[var(--odd-numbers-2-5,2.5px)]"
          : "h-[var(--old-sizing-34,34px)] py-[var(--odd-numbers-7,7px)]"
      } ${
        state === "Disabled" ? "cursor-not-allowed" : clickable ? "cursor-pointer" : ""
      } ${overlap ? "mr-[var(--odd-numbers-1,-1px)]" : ""}`}
      style={{
        backgroundColor: BG[effState],
        borderColor: BORDER(effState),
        ...radiusStyle(side),
        ...(focused ? { boxShadow: FOCUS_RING } : null),
      }}
    >
      <p
        className={`whitespace-nowrap text-center font-['DM_Sans'] ${
          compact
            ? "text-[length:var(--body-sm-medium-size,12px)] leading-[var(--body-sm-medium-line-height,18px)]"
            : "text-[length:var(--body-md-medium-size,14px)] leading-[var(--body-md-medium-line-height,20px)]"
        }`}
        style={{ color: TEXT[effState] }}
      >
        {label}
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Composed groups
// ---------------------------------------------------------------------------
function sideForIndex(index: number, total: number): Side {
  if (index === 0) return "Left";
  if (index === total - 1) return "Right";
  return "Middle";
}

type TextGroupProps = { amount: number; compact: boolean; label?: string };

function TextButtonGroup({ amount, compact, label }: TextGroupProps) {
  // First item selected by default; clicking a segment selects it (its nature),
  // and unselected segments show their Hover variant on pointer hover.
  const [selected, setSelected] = useState(0);
  const active = selected < amount ? selected : 0;
  return (
    <div className="flex items-start">
      {Array.from({ length: amount }).map((_, i) => (
        <TextSegment
          key={i}
          side={sideForIndex(i, amount)}
          state={i === active ? "Selected" : "Unselected"}
          compact={compact}
          overlap={i < amount - 1}
          label={label}
          onClick={() => setSelected(i)}
        />
      ))}
    </div>
  );
}

type IconGroupProps = { amount: number; compact: boolean };

function IconButtonGroup({ amount, compact }: IconGroupProps) {
  // First item selected by default; clicking a segment selects it.
  const [selected, setSelected] = useState(0);
  const active = selected < amount ? selected : 0;
  return (
    <div className="flex items-start">
      {Array.from({ length: amount }).map((_, i) => (
        <IconSegment
          key={i}
          side={sideForIndex(i, amount)}
          state={i === active ? "Selected" : "Unselected"}
          compact={compact}
          overlap={i < amount - 1}
          onClick={() => setSelected(i)}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared token maps for Developer Mode
// ---------------------------------------------------------------------------
const SHARED_TOKENS: Record<string, string> = {
  "container/dynamic/neutral/subtle/background/default/variation":
    "var(--container-dynamic-neutral-subtle-background-default-variation)",
  "container/dynamic/neutral/subtle/background/default/regular":
    "var(--container-dynamic-neutral-subtle-background-default-regular)",
  "container/dynamic/neutral/subtle/background/hover":
    "var(--container-dynamic-neutral-subtle-background-hover)",
  "container/dynamic/neutral/subtle/background/disabled":
    "var(--container-dynamic-neutral-subtle-background-disabled)",
  "container/dynamic/neutral/subtle/foreground/selected":
    "var(--container-dynamic-neutral-subtle-foreground-selected)",
  "container/dynamic/neutral/subtle/foreground/default/regular":
    "var(--container-dynamic-neutral-subtle-foreground-default-regular)",
  "container/dynamic/neutral/subtle/foreground/hover":
    "var(--container-dynamic-neutral-subtle-foreground-hover)",
  "container/dynamic/neutral/subtle/foreground/disabled":
    "var(--container-dynamic-neutral-subtle-foreground-disabled)",
  "border/dynamic/neutral/subtle/default":
    "var(--border-dynamic-neutral-subtle-default)",
  "border/dynamic/neutral/subtle/disabled":
    "var(--border-dynamic-neutral-subtle-disabled)",
  "[old]Radiuses/2": "var(--old-radiuses-2)",
  "[old]Stroke Thickness/1": "var(--old-stroke-thickness-1)",
  "odd_numbers/-1": "var(--odd-numbers-1)",
};

// ---------------------------------------------------------------------------
// Playground configs
// ---------------------------------------------------------------------------
const AMOUNT_OPTIONS = ["2", "3", "4", "5"];

const textGroupConfig: PlaygroundConfig = {
  name: "Button Group",
  scopeId: "button-group/button-group",
  description: "Segmented text buttons — first segment selected, remaining unselected.",
  controls: [
    {
      kind: "select",
      name: "size",
      label: "Size",
      options: ["Large", "Compact"],
      defaultValue: "Large",
      asTabs: true,
    },
    {
      kind: "select",
      name: "items",
      label: "Items",
      options: AMOUNT_OPTIONS,
      defaultValue: "3",
    },
    {
      kind: "text",
      name: "label",
      label: "Label",
      defaultValue: "Button",
      placeholder: "Button",
    },
  ],
  render: (props: PropValues) => (
    <TextButtonGroup
      amount={Number(props.items)}
      compact={props.size === "Compact"}
      label={String(props.label)}
    />
  ),
  tokens: SHARED_TOKENS,
};

const iconGroupConfig: PlaygroundConfig = {
  name: "Button Icon Group",
  scopeId: "button-group/button-icon-group",
  description: "Segmented icon buttons — first segment selected, remaining unselected.",
  controls: [
    {
      kind: "select",
      name: "size",
      label: "Size",
      options: ["Large", "Compact"],
      defaultValue: "Large",
      asTabs: true,
    },
    {
      kind: "select",
      name: "items",
      label: "Items",
      options: AMOUNT_OPTIONS,
      defaultValue: "3",
    },
  ],
  render: (props: PropValues) => (
    <IconButtonGroup
      amount={Number(props.items)}
      compact={props.size === "Compact"}
    />
  ),
  tokens: SHARED_TOKENS,
};

const textSegmentConfig: PlaygroundConfig = {
  name: "Button Group [individuals]",
  scopeId: "button-group/button-group-individuals",
  description: "A single text segment — explore each side, state and size.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Selected", "Unselected", "Hover", "Disabled"],
      defaultValue: "Selected",
      asTabs: true,
    },
    {
      kind: "select",
      name: "side",
      label: "Side",
      options: ["Left", "Middle", "Right"],
      defaultValue: "Left",
    },
    {
      kind: "text",
      name: "label",
      label: "Label",
      defaultValue: "Button",
      placeholder: "Button",
    },
    { kind: "boolean", name: "compact", label: "Compact", defaultValue: false },
  ],
  render: (props: PropValues) => (
    <div className="flex">
      <TextSegment
        side={props.side as Side}
        state={props.state as State}
        compact={props.compact === true}
        label={String(props.label)}
      />
    </div>
  ),
  tokens: SHARED_TOKENS,
};

const iconSegmentConfig: PlaygroundConfig = {
  name: "Button Group Icon [individuals]",
  scopeId: "button-group/button-group-icon-individuals",
  description: "A single icon segment — explore each side, state and size.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Selected", "Unselected", "Hover", "Disabled"],
      defaultValue: "Selected",
      asTabs: true,
    },
    {
      kind: "select",
      name: "side",
      label: "Side",
      options: ["Left", "Middle", "Right"],
      defaultValue: "Left",
    },
    { kind: "boolean", name: "compact", label: "Compact", defaultValue: false },
  ],
  render: (props: PropValues) => (
    <div className="flex">
      <IconSegment
        side={props.side as Side}
        state={props.state as State}
        compact={props.compact === true}
      />
    </div>
  ),
  tokens: SHARED_TOKENS,
};

export default function ButtonGroupPage() {
  return (
    <section aria-label="Button Group component playground" className="flex flex-col gap-6">
      <Playground config={textGroupConfig} />
      <Playground config={iconGroupConfig} />
      <Playground config={textSegmentConfig} />
      <Playground config={iconSegmentConfig} />
    </section>
  );
}
