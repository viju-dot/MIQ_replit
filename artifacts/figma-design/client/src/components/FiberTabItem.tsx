import { useState, type ReactNode } from "react";
import { Link } from "wouter";

export type TabItemState = "Default" | "Selected" | "Disabled" | "Hover" | "Hover-selected";

const textColors: Record<TabItemState, string> = {
  Default: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)",
  Selected: "var(--surface-foreground-dynamic-brand-default, #7c33b5)",
  Disabled: "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)",
  Hover: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)",
  "Hover-selected": "var(--surface-foreground-dynamic-brand-hover, #662994)",
};
const lineColors: Record<TabItemState, string> = {
  Default: "var(--border-static-subtle-neutral, #e1e1e8)",
  Selected: "var(--border-dynamic-brand-selected, #7c33b5)",
  Disabled: "var(--border-static-subtle-neutral, #e1e1e8)",
  Hover: "var(--border-static-subtle-neutral, #e1e1e8)",
  "Hover-selected": "var(--border-dynamic-brand-hover, #662994)",
};

/** Shared Fiber underline tab — Figma node 3412:7887.
 * Used by both the design-system reference and product navigation. */
export function TabItem({ label = "Tab", state = "Default" }: { label?: string; state?: TabItemState }) {
  const hovered = state === "Hover" || state === "Hover-selected";
  return (
    <div className="flex flex-col items-start gap-2 transition-colors duration-150"
      style={{ backgroundColor: hovered ? "var(--container-dynamic-neutral-subtle-background-hover, rgba(113,113,128,0.08))" : undefined }}>
      <div className="flex items-center gap-2.5 px-4">
        <p className="whitespace-nowrap text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)] font-normal font-['DM_Sans',Helvetica]"
          style={{ color: textColors[state] }}>{label}</p>
      </div>
      <div className="h-0 w-full border-t transition-colors duration-150" style={{ borderColor: lineColors[state] }} />
    </div>
  );
}

export type TabPillState = "Selected" | "Active" | "Disabled" | "Hover";

/** Complete Fiber "Tabs Bar — rounded", including its shared neutral track. */
export function FiberRoundedTabsBar({ children }: { children: ReactNode }) {
  return (
    <div className="inline-flex flex-wrap items-center gap-1 rounded-[24px] p-0.5"
      style={{ backgroundColor: "var(--container-dynamic-neutral-subtle-background-hover, #71718014)" }}>
      {children}
    </div>
  );
}

/** Fiber rounded tab — Figma node 3412:8347. */
export function TabPill({ label = "Tab 1", state = "Selected" }: { label?: string; state?: TabPillState }) {
  const styles: Record<TabPillState, { bg?: string; color: string }> = {
    Selected: { bg: "var(--container-dynamic-brand-subtle-background-selected, #f6ebff)", color: "var(--surface-foreground-dynamic-brand-default, #7c33b5)" },
    Active: { color: "var(--surface-foreground-dynamic-neutral-default-regular, #4b4b59)" },
    Disabled: { color: "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)" },
    Hover: { bg: "var(--container-dynamic-neutral-subtle-background-hover, rgba(113,113,128,0.08))", color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)" },
  };
  const s = styles[state];
  return (
    <div className="flex h-[30px] items-center rounded-[20px] px-4 py-[5px] transition-colors duration-150" style={{ backgroundColor: s.bg ?? "transparent" }}>
      <p className="whitespace-nowrap text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)] font-normal font-['DM_Sans',Helvetica]" style={{ color: s.color }}>{label}</p>
    </div>
  );
}

export function FiberTabLink({ label, href, selected, rounded = false }: { label: string; href: string; selected: boolean; rounded?: boolean }) {
  const [hovered, setHovered] = useState(false);
  const state: TabItemState = selected ? hovered ? "Hover-selected" : "Selected" : hovered ? "Hover" : "Default";
  return (
    <Link href={href} aria-current={selected ? "page" : undefined}
      className="shrink-0 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
      style={{ outlineColor: "var(--border-dynamic-brand-selected, #7c33b5)" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      {rounded ? <TabPill label={label} state={selected ? "Selected" : hovered ? "Hover" : "Active"} /> : <TabItem label={label} state={state} />}
    </Link>
  );
}

export function FiberTabButton({ label, selected, onClick }: { label: string; selected: boolean; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button type="button" aria-pressed={selected} onClick={onClick}
      className="shrink-0 rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
      style={{ outlineColor: "var(--border-dynamic-brand-selected, #7c33b5)" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <TabPill label={label} state={selected ? "Selected" : hovered ? "Hover" : "Active"} />
    </button>
  );
}