import { useState } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";
import { TabItem, TabPill, FiberRoundedTabsBar, type TabItemState, type TabPillState } from "@/components/FiberTabItem";

/* =========================================================================
 * Tab items (underline-style tab) — node 3412:7887
 * States: Default | Selected | Disabled | Hover | Hover-selected
 * ========================================================================= */

/* =========================================================================
 * Tab (rounded / pill-style tab) — node 3412:8347
 * States: Selected | Active | Disabled | Hover
 * ========================================================================= */

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
            aria-disabled={disabled}
            aria-selected={selected}
            role="tab"
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
    <FiberRoundedTabsBar>
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
            aria-disabled={disabled}
            aria-selected={selected}
            role="tab"
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
    </FiberRoundedTabsBar>
  );
}

/* =========================================================================
 * Playground configs
 * ========================================================================= */

const tabItemConfig: PlaygroundConfig = {
  name: "Tab Item — underline",
  scopeId: "tabs/tab-item-underline",
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
  scopeId: "tabs/tab-rounded-pill",
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
  scopeId: "tabs/tabs-bar-underline",
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
  scopeId: "tabs/tabs-bar-rounded",
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
