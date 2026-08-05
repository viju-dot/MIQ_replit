import { useState } from "react";

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
 * Composed underline Tabs bar (Amount = N Items, Rounded = No)
 * ========================================================================= */

function TabsBarUnderline({
  count,
  selectedIndex = 0,
}: {
  count: number;
  selectedIndex?: number;
}) {
  return (
    <div className="flex flex-wrap">
      {Array.from({ length: count }).map((_, i) => (
        <TabItem
          key={i}
          label={`Tab ${i + 1}`}
          state={i === selectedIndex ? "Selected" : "Default"}
        />
      ))}
    </div>
  );
}

/* =========================================================================
 * Composed rounded Tabs bar (Amount = N Items, Rounded = Yes)
 * ========================================================================= */

function TabsBarRounded({
  count,
  selectedIndex = 0,
}: {
  count: number;
  selectedIndex?: number;
}) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1 rounded-[24px] bg-[#71718014] p-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <TabPill
          key={i}
          label={`Tab ${i + 1}`}
          state={i === selectedIndex ? "Selected" : "Active"}
        />
      ))}
    </div>
  );
}

/* =========================================================================
 * Interactive responsive tabs demo
 * ========================================================================= */

function InteractiveUnderlineTabs() {
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const labels = ["Overview", "Analytics", "Reports", "Notifications"];
  return (
    <div className="flex flex-wrap">
      {labels.map((label, i) => {
        const selected = i === active;
        const hovered = i === hover;
        const state: TabItemState = selected
          ? hovered
            ? "Hover-selected"
            : "Selected"
          : hovered
            ? "Hover"
            : "Default";
        return (
          <button
            key={label}
            type="button"
            className="cursor-pointer bg-transparent p-0 outline-none"
            onClick={() => setActive(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <TabItem label={label} state={state} />
          </button>
        );
      })}
    </div>
  );
}

function InteractiveRoundedTabs() {
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState<number | null>(null);
  const labels = ["Day", "Week", "Month", "Year"];
  return (
    <div className="inline-flex flex-wrap items-center gap-1 rounded-[24px] bg-[#71718014] p-0.5">
      {labels.map((label, i) => {
        const selected = i === active;
        const hovered = i === hover;
        const state: TabPillState = selected
          ? "Selected"
          : hovered
            ? "Hover"
            : "Active";
        return (
          <button
            key={label}
            type="button"
            className="cursor-pointer bg-transparent p-0 outline-none"
            onClick={() => setActive(i)}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
          >
            <TabPill label={label} state={state} />
          </button>
        );
      })}
    </div>
  );
}

/* =========================================================================
 * Small helpers
 * ========================================================================= */

function Caption({ children }: { children: React.ReactNode }) {
  return <span className="text-[12px] text-[#a8a8b2]">{children}</span>;
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
      <h2 className="mb-4 text-[14px] font-medium text-[#13131a]">{title}</h2>
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}

/* =========================================================================
 * Page
 * ========================================================================= */

export default function TabsPage() {
  const underlineStates: TabItemState[] = [
    "Default",
    "Hover",
    "Selected",
    "Hover-selected",
    "Disabled",
  ];
  const pillStates: TabPillState[] = [
    "Selected",
    "Active",
    "Hover",
    "Disabled",
  ];
  const counts = [2, 3, 4, 5, 6, 7, 8, 9, 10];

  return (
    <section className="flex flex-col gap-6" aria-label="Tabs components">
      {/* Underline tab item states */}
      <Card title="Tab item — states (underline)">
        <div className="flex flex-wrap gap-x-10 gap-y-5">
          {underlineStates.map((state) => (
            <div key={state} className="flex flex-col gap-2">
              <Caption>{state}</Caption>
              <TabItem state={state} />
            </div>
          ))}
        </div>
      </Card>

      {/* Rounded (pill) tab states */}
      <Card title="Tab — states (rounded / pill)">
        <div className="flex flex-wrap gap-x-10 gap-y-5">
          {pillStates.map((state) => (
            <div key={state} className="flex flex-col gap-2">
              <Caption>{state}</Caption>
              <div className="rounded-[24px] bg-[#71718014] p-0.5">
                <TabPill state={state} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Underline tabs bar — 2 to 10 items */}
      <Card title="Tabs — underline (2–10 items)">
        <div className="flex flex-col gap-5">
          {counts.map((count) => (
            <div key={count} className="flex flex-col gap-2">
              <Caption>{count} items</Caption>
              <TabsBarUnderline count={count} />
            </div>
          ))}
        </div>
      </Card>

      {/* Rounded tabs bar — 2 to 10 items */}
      <Card title="Tabs — rounded (2–10 items)">
        <div className="flex flex-col gap-5">
          {counts.map((count) => (
            <div key={count} className="flex flex-col gap-2">
              <Caption>{count} items</Caption>
              <TabsBarRounded count={count} />
            </div>
          ))}
        </div>
      </Card>

      {/* Interactive / responsive demos */}
      <Card title="Responsive tabs — interactive">
        <div className="flex flex-col gap-2">
          <Caption>Underline (click to select, hover to preview)</Caption>
          <InteractiveUnderlineTabs />
        </div>
        <div className="flex flex-col gap-2">
          <Caption>Rounded (click to select, hover to preview)</Caption>
          <InteractiveRoundedTabs />
        </div>
      </Card>
    </section>
  );
}
