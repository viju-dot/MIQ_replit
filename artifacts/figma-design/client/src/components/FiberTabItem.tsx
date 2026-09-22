import { useState } from "react";
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

export function FiberTabLink({ label, href, selected }: { label: string; href: string; selected: boolean }) {
  const [hovered, setHovered] = useState(false);
  const state: TabItemState = selected ? hovered ? "Hover-selected" : "Selected" : hovered ? "Hover" : "Default";
  return (
    <Link href={href} aria-current={selected ? "page" : undefined}
      className="shrink-0 rounded-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4"
      style={{ outlineColor: "var(--border-dynamic-brand-selected, #7c33b5)" }}
      onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
      <TabItem label={label} state={state} />
    </Link>
  );
}