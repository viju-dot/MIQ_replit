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
  Default:
    "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)",
  Selected: "var(--surface-foreground-dynamic-brand-default, #7c33b5)",
  Disabled: "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)",
  Hover:
    "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)",
  "Hover-selected": "var(--surface-foreground-dynamic-brand-hover, #662994)",
};

const tabItemLineColor: Record<TabItemState, string> = {
  Default: "var(--border-static-subtle-neutral, #e1e1e8)",
  Selected: "var(--border-dynamic-brand-selected, #7c33b5)",
  Disabled: "var(--border-static-subtle-neutral, #e1e1e8)",
  Hover: "var(--border-static-subtle-neutral, #e1e1e8)",
  "Hover-selected": "var(--border-dynamic-brand-hover, #662994)",
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
      style={
        isHoverBg
          ? {
              backgroundColor:
                "var(--container-dynamic-neutral-subtle-background-hover, rgba(113,113,128,0.08))",
            }
          : undefined
      }
    >
      <div className="flex items-center gap-2.5 px-4">
        <p
          className="whitespace-nowrap text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)] font-normal font-['DM_Sans',Helvetica]"
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
    Selected: {
      bg: "var(--container-dynamic-brand-subtle-background-selected, #f6ebff)",
      color: "var(--surface-foreground-dynamic-brand-default, #7c33b5)",
    },
    Active: {
      color:
        "var(--surface-foreground-dynamic-neutral-default-regular, #4b4b59)",
    },
    Disabled: {
      color: "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)",
    },
    Hover: {
      bg: "var(--container-dynamic-neutral-subtle-background-hover, rgba(113,113,128,0.08))",
      color:
        "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)",
    },
  };
  const s = styles[state];
  return (
    <div
      className="flex h-[30px] items-center rounded-[20px] px-4 py-[5px]"
      style={{ backgroundColor: s.bg ?? "transparent" }}
    >
      <p
        className="whitespace-nowrap text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)] font-normal font-['DM_Sans',Helvetica]"
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
    <div className="inline-flex flex-wrap items-center gap-1 rounded-[24px] bg-[var(--container-dynamic-neutral-subtle-background-hover,#71718014)] p-0.5">
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
    "surface/foreground/dynamic/neutral/default/variation":
      "var(--surface-foreground-dynamic-neutral-default-variation)",
    "surface/foreground/dynamic/brand/default":
      "var(--surface-foreground-dynamic-brand-default)",
    "surface/foreground/dynamic/brand/hover":
      "var(--surface-foreground-dynamic-brand-hover)",
    "surface/foreground/dynamic/neutral/disabled":
      "var(--surface-foreground-dynamic-neutral-disabled)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "border/dynamic/brand/selected": "var(--border-dynamic-brand-selected)",
    "border/dynamic/brand/hover": "var(--border-dynamic-brand-hover)",
    "container/dynamic/neutral/subtle/background/hover":
      "var(--container-dynamic-neutral-subtle-background-hover)",
    "Body Md/Regular": "var(--body-md-regular-size)",
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
    <div className="rounded-[24px] bg-[var(--container-dynamic-neutral-subtle-background-hover,#71718014)] p-0.5">
      <TabPill
        label={String(props.label)}
        state={props.state as TabPillState}
      />
    </div>
  ),
  tokens: {
    "container/dynamic/brand/subtle/background/selected":
      "var(--container-dynamic-brand-subtle-background-selected)",
    "container/dynamic/neutral/subtle/background/hover":
      "var(--container-dynamic-neutral-subtle-background-hover)",
    "surface/foreground/dynamic/brand/default":
      "var(--surface-foreground-dynamic-brand-default)",
    "surface/foreground/dynamic/neutral/default/regular":
      "var(--surface-foreground-dynamic-neutral-default-regular)",
    "surface/foreground/dynamic/neutral/default/variation":
      "var(--surface-foreground-dynamic-neutral-default-variation)",
    "surface/foreground/dynamic/neutral/disabled":
      "var(--surface-foreground-dynamic-neutral-disabled)",
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
    "surface/foreground/dynamic/neutral/default/variation":
      "var(--surface-foreground-dynamic-neutral-default-variation)",
    "surface/foreground/dynamic/brand/default":
      "var(--surface-foreground-dynamic-brand-default)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "border/dynamic/brand/selected": "var(--border-dynamic-brand-selected)",
    "Body Md/Regular": "var(--body-md-regular-size)",
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
    "container/dynamic/neutral/subtle/background/hover":
      "var(--container-dynamic-neutral-subtle-background-hover)",
    "container/dynamic/brand/subtle/background/selected":
      "var(--container-dynamic-brand-subtle-background-selected)",
    "surface/foreground/dynamic/brand/default":
      "var(--surface-foreground-dynamic-brand-default)",
    "surface/foreground/dynamic/neutral/default/regular":
      "var(--surface-foreground-dynamic-neutral-default-regular)",
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
