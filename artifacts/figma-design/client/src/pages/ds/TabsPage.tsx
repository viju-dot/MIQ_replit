import { useState } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

/* =========================================================================
 * Tab items (underline-style tab) — node 3412:7887
 * States: Default | Selected | Disabled | Hover | Hover-selected
 * ========================================================================= */

type TabItemState =
  | "Default"
  | "Selected"
  | "Disabled"
  | "Hover"
  | "Hover-selected";

const tabItemTextColor: Record<TabItemState, string> = {
  Default: "#13131a",
  Selected: "#7c33b5",
  Disabled: "#a8a8b2",
  Hover: "#13131a",
  "Hover-selected": "#662994",
};

const tabItemLineColor: Record<TabItemState, string> = {
  Default: "#e1e1e8",
  Selected: "#7c33b5",
  Disabled: "#e1e1e8",
  Hover: "#e1e1e8",
  "Hover-selected": "#662994",
};

function TabItem({
  label = "Tab",
  state = "Default",
}: {
  label?: string;
  state?: TabItemState;
}) {
  const isHoverBg = state === "Hover" || state === "Hover-selected";
  return (
    <div
      className="flex flex-col items-start gap-2"
      style={isHoverBg ? { backgroundColor: "rgba(113,113,128,0.08)" } : undefined}
    >
      <div className="flex items-center gap-2.5 px-4">
        <p
          className="whitespace-nowrap text-[14px] leading-[20px] font-normal font-['DM_Sans',Helvetica]"
          style={{ color: tabItemTextColor[state] }}
        >
          {label}
        </p>
      </div>
      <div
        className="h-0 w-full border-t"
        style={{ borderColor: tabItemLineColor[state] }}
      />
    </div>
  );
}

/* =========================================================================
 * Tab (rounded / pill-style tab) — node 3412:8347
 * States: Selected | Active | Disabled | Hover
 * ========================================================================= */

type TabPillState = "Selected" | "Active" | "Disabled" | "Hover";

function TabPill({
  label = "Tab 1",
  state = "Selected",
}: {
  label?: string;
  state?: TabPillState;
}) {
  const styles: Record<
    TabPillState,
    { bg?: string; color: string }
  > = {
    Selected: { bg: "#f6ebff", color: "#7c33b5" },
    Active: { color: "#4b4b59" },
    Disabled: { color: "#a8a8b2" },
    Hover: { bg: "rgba(113,113,128,0.08)", color: "#13131a" },
  };
  const s = styles[state];
  return (
    <div
      className="flex h-[30px] items-center rounded-[20px] px-4 py-[5px]"
      style={{ backgroundColor: s.bg ?? "transparent" }}
    >
      <p
        className="whitespace-nowrap text-[14px] leading-[20px] font-normal font-['DM_Sans',Helvetica]"
        style={{ color: s.color }}
      >
        {label}
      </p>
    </div>
  );
}

/* =========================================================================
 * Interactive underline Tabs bar (Amount = N Items, Rounded = No)
 * Click to select, hover to preview — mirrors real Figma variant states.
 * ========================================================================= */

function InteractiveUnderlineTabs({
  count,
  disabled,
}: {
  count: number;
  disabled: boolean;
}) {
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="flex flex-wrap">
      {Array.from({ length: count }).map((_, i) => {
        const selected = i === active;
        const hovered = i === hover;
        const state: TabItemState = disabled
          ? "Disabled"
          : selected
            ? hovered
              ? "Hover-selected"
              : "Selected"
            : hovered
              ? "Hover"
              : "Default";
        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            className={`bg-transparent p-0 outline-none ${
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={() => !disabled && setActive(i)}
            onMouseEnter={() => !disabled && setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <TabItem label={`Tab ${i + 1}`} state={state} />
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================================
 * Interactive rounded Tabs bar (Amount = N Items, Rounded = Yes)
 * ========================================================================= */

function InteractiveRoundedTabs({
  count,
  disabled,
}: {
  count: number;
  disabled: boolean;
}) {
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div className="inline-flex flex-wrap items-center gap-1 rounded-[24px] bg-[#71718014] p-0.5">
      {Array.from({ length: count }).map((_, i) => {
        const selected = i === active;
        const hovered = i === hover;
        const state: TabPillState = disabled
          ? "Disabled"
          : selected
            ? "Selected"
            : hovered
              ? "Hover"
              : "Active";
        return (
          <button
            key={i}
            type="button"
            disabled={disabled}
            className={`bg-transparent p-0 outline-none ${
              disabled ? "cursor-not-allowed" : "cursor-pointer"
            }`}
            onClick={() => !disabled && setActive(i)}
            onMouseEnter={() => !disabled && setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <TabPill label={`Tab ${i + 1}`} state={state} />
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================================
 * Playground configs
 * ========================================================================= */

const tabItemConfig: PlaygroundConfig = {
  name: "Tab Item — underline",
  description:
    "Single underline-style tab. Explore each Figma state and edit the label.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Default", "Hover", "Selected", "Hover-selected", "Disabled"],
      defaultValue: "Selected",
      asTabs: true,
    },
    { kind: "text", name: "label", label: "Label", defaultValue: "Tab" },
  ],
  render: (props) => (
    <div className="min-w-[80px]">
      <TabItem
        label={String(props.label)}
        state={props.state as TabItemState}
      />
    </div>
  ),
  tokens: {
    "text/default": "#13131a",
    "text/selected": "#7c33b5",
    "text/hover-selected": "#662994",
    "text/disabled": "#a8a8b2",
    "line/default": "#e1e1e8",
    "line/selected": "#7c33b5",
    "line/hover-selected": "#662994",
    "surface/hover": "rgba(113,113,128,0.08)",
    "type/size": "14px / 20px DM Sans",
  },
};

const tabPillConfig: PlaygroundConfig = {
  name: "Tab — rounded / pill",
  description:
    "Single rounded pill-style tab. Explore each Figma state and edit the label.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Selected", "Active", "Hover", "Disabled"],
      defaultValue: "Selected",
      asTabs: true,
    },
    { kind: "text", name: "label", label: "Label", defaultValue: "Tab 1" },
  ],
  render: (props) => (
    <div className="rounded-[24px] bg-[#71718014] p-0.5">
      <TabPill
        label={String(props.label)}
        state={props.state as TabPillState}
      />
    </div>
  ),
  tokens: {
    "container/selected/background": "#f6ebff",
    "container/hover/background": "rgba(113,113,128,0.08)",
    "container/track/background": "#71718014",
    "text/selected": "#7c33b5",
    "text/active": "#4b4b59",
    "text/hover": "#13131a",
    "text/disabled": "#a8a8b2",
    "radius/pill": "20px",
    "size/height": "30px",
  },
};

const underlineBarConfig: PlaygroundConfig = {
  name: "Tabs Bar — underline",
  description:
    "Composed underline tabs. Choose the item count; click to select, hover to preview.",
  controls: [
    {
      kind: "select",
      name: "count",
      label: "Items",
      options: ["2", "3", "4", "5", "6", "7", "8", "9", "10"],
      defaultValue: "4",
      asTabs: true,
    },
    { kind: "boolean", name: "disabled", label: "Disabled", defaultValue: false },
  ],
  render: (props) => (
    <div className="w-full">
      <InteractiveUnderlineTabs
        count={Number(props.count)}
        disabled={props.disabled === true}
      />
    </div>
  ),
  tokens: {
    "text/default": "#13131a",
    "text/selected": "#7c33b5",
    "line/default": "#e1e1e8",
    "line/selected": "#7c33b5",
    "type/size": "14px / 20px DM Sans",
  },
};

const roundedBarConfig: PlaygroundConfig = {
  name: "Tabs Bar — rounded",
  description:
    "Composed rounded tabs. Choose the item count; click to select, hover to preview.",
  controls: [
    {
      kind: "select",
      name: "count",
      label: "Items",
      options: ["2", "3", "4", "5", "6", "7", "8", "9", "10"],
      defaultValue: "4",
      asTabs: true,
    },
    { kind: "boolean", name: "disabled", label: "Disabled", defaultValue: false },
  ],
  render: (props) => (
    <InteractiveRoundedTabs
      count={Number(props.count)}
      disabled={props.disabled === true}
    />
  ),
  tokens: {
    "container/track/background": "#71718014",
    "container/selected/background": "#f6ebff",
    "text/selected": "#7c33b5",
    "text/active": "#4b4b59",
    "radius/track": "24px",
    "radius/pill": "20px",
  },
};

/* =========================================================================
 * Page
 * ========================================================================= */

export default function TabsPage() {
  return (
    <section className="flex flex-col gap-6" aria-label="Tabs components">
      <Playground config={tabItemConfig} />
      <Playground config={tabPillConfig} />
      <Playground config={underlineBarConfig} />
      <Playground config={roundedBarConfig} />
    </section>
  );
}
