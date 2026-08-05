import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

const ASSET = "/figmaAssets/button-group";

type Side = "Left" | "Middle" | "Right";
type State = "Selected" | "Unselected" | "Hover" | "Disabled";

// ---------------------------------------------------------------------------
// Design tokens (converted from Figma CSS variables to plain fallback values)
// ---------------------------------------------------------------------------
const BG: Record<State, string> = {
  Selected: "#ebebf0",
  Unselected: "#ffffff",
  Hover: "rgba(113,113,128,0.08)",
  Disabled: "rgba(113,113,128,0.1)",
};
const TEXT: Record<State, string> = {
  Selected: "#13131a",
  Unselected: "#4b4b59",
  Hover: "#13131a",
  Disabled: "#a8a8b2",
};
const BORDER = (state: State) => (state === "Disabled" ? "#e1e1e8" : "#c6c6cc");

// End-corner radius depending on side (adjacent sides overlap by -1px)
function radiusStyle(side: Side): React.CSSProperties {
  if (side === "Left") {
    return { borderTopLeftRadius: 2, borderBottomLeftRadius: 2 };
  }
  if (side === "Right") {
    return { borderTopRightRadius: 2, borderBottomRightRadius: 2 };
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
};

function IconSegment({ side, state, compact, overlap = false }: IconSegmentProps) {
  const boxClass = compact ? "h-[24px] w-[34px]" : "size-[34px]";
  const iconBoxSize = compact ? 16 : 24;
  return (
    <div
      className={`relative shrink-0 overflow-hidden ${boxClass} ${overlap ? "mr-[-1px]" : ""}`}
      style={radiusStyle(side)}
    >
      {/* base fill + border */}
      <div
        className="absolute inset-0 border border-solid"
        style={{
          backgroundColor: BG[state],
          borderColor: BORDER(state),
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
          src={iconSrc(state, compact)}
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
};

function TextSegment({ side, state, compact, overlap = false, label = "Button" }: TextSegmentProps) {
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center px-[24px] border border-solid ${
        compact ? "h-[24px] py-[2.5px]" : "h-[34px] py-[7px]"
      } ${overlap ? "mr-[-1px]" : ""}`}
      style={{
        backgroundColor: BG[state],
        borderColor: BORDER(state),
        ...radiusStyle(side),
      }}
    >
      <p
        className={`whitespace-nowrap text-center font-['DM_Sans'] ${
          compact ? "text-[12px] leading-[18px]" : "text-[14px] leading-[20px]"
        }`}
        style={{ color: TEXT[state] }}
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
  // First item selected, remaining unselected — matches the Figma composite.
  return (
    <div className="flex items-start">
      {Array.from({ length: amount }).map((_, i) => (
        <TextSegment
          key={i}
          side={sideForIndex(i, amount)}
          state={i === 0 ? "Selected" : "Unselected"}
          compact={compact}
          overlap={i < amount - 1}
          label={label}
        />
      ))}
    </div>
  );
}

type IconGroupProps = { amount: number; compact: boolean };

function IconButtonGroup({ amount, compact }: IconGroupProps) {
  // First item selected, remaining unselected.
  return (
    <div className="flex items-start">
      {Array.from({ length: amount }).map((_, i) => (
        <IconSegment
          key={i}
          side={sideForIndex(i, amount)}
          state={i === 0 ? "Selected" : "Unselected"}
          compact={compact}
          overlap={i < amount - 1}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Shared token maps for Developer Mode
// ---------------------------------------------------------------------------
const SHARED_TOKENS: Record<string, string> = {
  "container/selected/background": "#ebebf0",
  "container/unselected/background": "#ffffff",
  "container/hover/background": "rgba(113,113,128,0.08)",
  "container/disabled/background": "rgba(113,113,128,0.1)",
  "text/selected": "#13131a",
  "text/unselected": "#4b4b59",
  "text/disabled": "#a8a8b2",
  "border/default": "#c6c6cc",
  "border/disabled": "#e1e1e8",
  "radius/end": "2px",
  "size/large": "h 34px",
  "size/compact": "h 24px",
};

// ---------------------------------------------------------------------------
// Playground configs
// ---------------------------------------------------------------------------
const AMOUNT_OPTIONS = ["2", "3", "4", "5"];

const textGroupConfig: PlaygroundConfig = {
  name: "Button Group",
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
