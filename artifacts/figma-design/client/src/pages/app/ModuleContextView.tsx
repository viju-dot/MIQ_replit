/* =========================================================================
 * MIQ Collaborative Frameworks — module context view (Flow Chart / Usability Testing)
 *
 * Shared scaffold for a module scoped to a single AI Prototype, mounted at
 * /flow-chart/:prototypeId and /usability-testing/:prototypeId.
 *
 * Renders:
 *   - a breadcrumb/back link ("AI Prototype / <name>"),
 *   - the prototype name + status,
 *   - Fiber-style contextual tabs (structural placeholders with empty states),
 *   - a friendly not-found state for unknown prototype ids.
 *
 * STRUCTURE ONLY — no flow editing / testing functionality.
 *
 * COLOR CONVENTION: token-driven colors use inline style objects
 * (var(--token, fallbackHex)); layout / spacing / typography-size stay classes.
 * ========================================================================= */

import { forwardRef, useRef, useState } from "react";
import { Link } from "wouter";
import { CaretRight, ArrowLeft, type IconProps } from "@phosphor-icons/react";
import { prototypeRepository, type Prototype } from "@/lib/prototypeStore";

type IconType = React.ComponentType<IconProps>;

const C = {
  surface: "var(--surface-background-lvl1,#ffffff)",
  border: "var(--border-static-subtle-neutral,#e1e1e8)",
  textPrimary: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
  textMuted: "var(--surface-foreground-static-neutral-lvl3,#717180)",
  textBody: "var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)",
  brandSubtle: "var(--container-dynamic-brand-subtle-background-default,#f6ebff)",
  brandFg: "var(--surface-foreground-dynamic-brand-default,#7c33b5)",
  hoverBg: "var(--container-dynamic-neutral-subtle-background-hover,#71718014)",
};

const STATUS_STYLE: Record<string, { bg: string; fg: string; label: string }> = {
  Live: {
    bg: "var(--container-dynamic-success-subtle-background-default,#e7faef)",
    fg: "var(--container-dynamic-success-subtle-foreground-default,#1e8158)",
    label: "Live",
  },
  Draft: {
    bg: "var(--container-dynamic-neutral-subtle-background-hover,#71718014)",
    fg: "var(--surface-foreground-static-neutral-lvl3,#717180)",
    label: "Draft",
  },
  Archived: {
    bg: "var(--container-dynamic-neutral-subtle-background-hover,#71718014)",
    fg: "var(--surface-foreground-static-neutral-lvl3,#717180)",
    label: "Archived",
  },
};

function StatusPill({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.Draft;
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-medium"
      style={{ backgroundColor: s.bg, color: s.fg }}
    >
      {s.label}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Not-found state                                                     */
/* ------------------------------------------------------------------ */

function NotFound() {
  return (
    <div className="mx-auto w-full max-w-[1080px] px-6 py-8 md:px-10 md:py-10">
      <div className="mt-[var(--spacing-500,40px)] flex min-h-[50vh] items-center justify-center">
        <div className="flex w-full max-w-[520px] flex-col items-center gap-[var(--spacing-300,24px)] text-center">
          <img
            src={`${import.meta.env.BASE_URL}figmaAssets/empty-state/illustration-404-mountains.svg`}
            alt=""
            className="h-[200px] w-[200px] object-contain"
            aria-hidden
          />
          <div className="flex flex-col gap-[var(--spacing-100,8px)]">
            <p
              className="text-[length:var(--headline-md-semibold-size,24px)] font-medium tracking-[-0.36px]"
              style={{ color: C.textPrimary }}
            >
              Prototype not found
            </p>
            <p
              className="text-[length:var(--body-lg-regular-size,16px)] tracking-[-0.08px]"
              style={{ color: C.textMuted }}
            >
              We couldn't find that prototype. It may have been removed or the link is incorrect.
            </p>
          </div>
          <BackToPrototypes />
        </div>
      </div>
    </div>
  );
}

function BackToPrototypes() {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href="/ai-prototype"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="inline-flex items-center gap-1.5 rounded-full border px-3.5 py-2 text-[13px] font-medium transition-colors"
      style={{
        borderColor: C.border,
        backgroundColor: hover ? C.hoverBg : C.surface,
        color: C.textBody,
      }}
    >
      <ArrowLeft size={15} />
      Back to AI Prototype
    </Link>
  );
}

/* ------------------------------------------------------------------ */
/* Contextual tabs (structural placeholders)                           */
/* ------------------------------------------------------------------ */

/** Unique-ish base so multiple tab groups on a page don't collide ids. */
let tabGroupSeq = 0;

function ContextTabs({
  tabs,
}: {
  tabs: { id: string; label: string; empty: string }[];
}) {
  const [active, setActive] = useState(tabs[0]?.id);

  // Stable id prefix for aria-controls / aria-labelledby wiring.
  const [groupId] = useState(() => `ctxtabs-${(tabGroupSeq += 1)}`);
  const tabId = (id: string) => `${groupId}-tab-${id}`;
  const panelId = (id: string) => `${groupId}-panel-${id}`;

  // Refs so keyboard nav can move focus (roving tabindex pattern).
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const focusTab = (index: number) => {
    const clamped = ((index % tabs.length) + tabs.length) % tabs.length;
    const tab = tabs[clamped];
    if (!tab) return;
    setActive(tab.id);
    btnRefs.current[clamped]?.focus();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>, index: number) => {
    switch (e.key) {
      case "ArrowRight":
        e.preventDefault();
        focusTab(index + 1);
        break;
      case "ArrowLeft":
        e.preventDefault();
        focusTab(index - 1);
        break;
      case "Home":
        e.preventDefault();
        focusTab(0);
        break;
      case "End":
        e.preventDefault();
        focusTab(tabs.length - 1);
        break;
    }
  };

  return (
    <div className="mt-[var(--spacing-400,32px)]">
      {/* Fiber-style tab bar with a brand underline on the active tab. */}
      <div
        role="tablist"
        aria-label="Views"
        className="flex items-center gap-1 border-b"
        style={{ borderColor: C.border }}
      >
        {tabs.map((tab, index) => {
          const isActive = tab.id === active;
          return (
            <TabButton
              key={tab.id}
              ref={(el) => {
                btnRefs.current[index] = el;
              }}
              id={tabId(tab.id)}
              controls={panelId(tab.id)}
              label={tab.label}
              active={isActive}
              onSelect={() => setActive(tab.id)}
              onKeyDown={(e) => onKeyDown(e, index)}
            />
          );
        })}
      </div>

      {/* One panel per tab; inactive panels are hidden so only the active
          tabpanel is exposed to assistive tech. */}
      {tabs.map((tab) => {
        const isActive = tab.id === active;
        return (
          <div
            key={tab.id}
            role="tabpanel"
            id={panelId(tab.id)}
            aria-labelledby={tabId(tab.id)}
            hidden={!isActive}
            tabIndex={0}
            className="mt-[var(--spacing-400,32px)] min-h-[38vh] items-center justify-center rounded-[var(--radius-100,8px)] border border-dashed p-[var(--spacing-400,32px)] text-center"
            style={{ borderColor: C.border, display: isActive ? "flex" : "none" }}
          >
            <p
              className="max-w-[420px] text-[length:var(--body-md-regular-size,14px)]"
              style={{ color: C.textMuted }}
            >
              {tab.empty}
            </p>
          </div>
        );
      })}
    </div>
  );
}

const TabButton = forwardRef<
  HTMLButtonElement,
  {
    id: string;
    controls: string;
    label: string;
    active: boolean;
    onSelect: () => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
  }
>(function TabButton({ id, controls, label, active, onSelect, onKeyDown }, ref) {
  const [hover, setHover] = useState(false);
  return (
    <button
      ref={ref}
      type="button"
      role="tab"
      id={id}
      aria-controls={controls}
      aria-selected={active}
      // Roving tabindex: only the active tab is in the tab order.
      tabIndex={active ? 0 : -1}
      onClick={onSelect}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="relative px-3 py-2.5 text-[14px] transition-colors"
      style={{
        color: active ? C.brandFg : hover ? C.textPrimary : C.textBody,
        fontWeight: active ? 600 : 500,
      }}
    >
      {label}
      <span
        aria-hidden
        className="absolute inset-x-2 -bottom-px h-[2px] rounded-full"
        style={{ backgroundColor: active ? C.brandFg : "transparent" }}
      />
    </button>
  );
});

/* ------------------------------------------------------------------ */
/* Main context view                                                   */
/* ------------------------------------------------------------------ */

export interface ModuleContextViewProps {
  prototypeId: string;
  /** Module label shown in the breadcrumb root (e.g. "Flow Chart"). */
  moduleLabel: string;
  /** Icon representing the module. */
  moduleIcon: IconType;
  /** Short intro sentence describing what this scoped module does. */
  intro: string;
  /** Structural tabs with empty-state copy. */
  tabs: { id: string; label: string; empty: string }[];
}

export function ModuleContextView({
  prototypeId,
  moduleLabel,
  moduleIcon: ModuleIcon,
  intro,
  tabs,
}: ModuleContextViewProps): JSX.Element {
  const prototype: Prototype | undefined = prototypeRepository.get(prototypeId);

  if (!prototype) return <NotFound />;

  return (
    <div className="mx-auto w-full max-w-[1080px] px-6 py-8 md:px-10 md:py-10">
      {/* Breadcrumb: AI Prototype / <name> */}
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1.5 text-[13px]"
        style={{ color: C.textMuted }}
      >
        <Crumb href="/ai-prototype" label="AI Prototype" />
        <CaretRight size={13} />
        <span style={{ color: C.textPrimary }} className="font-medium">
          {prototype.name}
        </span>
      </nav>

      {/* Title + status */}
      <div className="mt-[var(--spacing-200,16px)] flex flex-col gap-[var(--spacing-100,8px)]">
        <div className="flex flex-wrap items-center gap-[var(--spacing-150,12px)]">
          <span
            className="flex size-[36px] items-center justify-center rounded-[var(--radius-50,4px)]"
            style={{ backgroundColor: C.brandSubtle }}
          >
            <ModuleIcon size={20} weight="fill" style={{ color: C.brandFg }} />
          </span>
          <h1
            className="text-[length:var(--headline-lg-semibold-size,28px)] font-semibold tracking-[-1px]"
            style={{ color: C.textPrimary }}
          >
            {prototype.name}
          </h1>
          <StatusPill status={prototype.status} />
        </div>
        <p
          className="max-w-[640px] text-[length:var(--body-lg-regular-size,16px)]"
          style={{ color: C.textMuted }}
        >
          {moduleLabel} · {intro}
        </p>
      </div>

      {/* Structural contextual tabs */}
      <ContextTabs tabs={tabs} />
    </div>
  );
}

function Crumb({ href, label }: { href: string; label: string }) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      style={{ color: hover ? C.brandFg : C.textMuted }}
      className="transition-colors"
    >
      {label}
    </Link>
  );
}
