/* =========================================================================
 * Fiber Workspace — AI Prototype (/ai-prototype)
 *
 * The central workspace. Lists prototypes from the prototype registry
 * (prototypeStore). Clicking a card's title/body opens the Prototype Viewer in
 * the DS Side Panel drawer (it does NOT navigate). The card's other controls —
 * Open prototype (external), Flow Chart, Usability Testing — remain SIBLING
 * actions, so no interactive control is nested inside another.
 *
 * COLOR CONVENTION: token-driven colors use inline style objects
 * (var(--token, fallbackHex)); layout / spacing / typography-size stay classes.
 * ========================================================================= */

import { useState } from "react";
import { Link } from "wouter";
import {
  Television,
  Plus,
  ArrowSquareOut,
  FlowArrow,
  TestTube,
  type IconProps,
} from "@phosphor-icons/react";
import { Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import { prototypeRepository, type Prototype } from "@/lib/prototypeStore";
import { SidePanel } from "./SidePanel";
import { PrototypeViewer } from "./PrototypeViewer";

const C = {
  surface: "var(--surface-background-lvl1,#ffffff)",
  border: "var(--border-static-subtle-neutral,#e1e1e8)",
  textPrimary: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
  textMuted: "var(--surface-foreground-static-neutral-lvl3,#717180)",
  textBody: "var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)",
  brandSubtle: "var(--container-dynamic-brand-subtle-background-default,#f6ebff)",
  brandFg: "var(--surface-foreground-dynamic-brand-default,#7c33b5)",
  hoverBg: "var(--container-dynamic-neutral-subtle-background-hover,#71718014)",
  disabled: "var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)",
};

const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  Live: {
    bg: "var(--container-dynamic-success-subtle-background-default,#e7faef)",
    fg: "var(--container-dynamic-success-subtle-foreground-default,#1e8158)",
  },
  Draft: { bg: C.hoverBg, fg: C.textMuted },
  Archived: { bg: C.hoverBg, fg: C.textMuted },
};

function StatusPill({ status }: { status: string }) {
  const s = STATUS_STYLE[status] ?? STATUS_STYLE.Draft;
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ backgroundColor: s.bg, color: s.fg }}
    >
      {status}
    </span>
  );
}

/**
 * An inactive quick action ("Coming soon"). Visible but muted, non-clickable
 * and not focusable — rendered as a plain, non-interactive <span> with
 * aria-disabled semantics and a tooltip hint. No nested interactive controls.
 */
function DisabledQuickAction({
  label,
  icon: Icon,
}: {
  label: string;
  icon: React.ComponentType<IconProps>;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span
          role="button"
          aria-disabled="true"
          aria-label={`${label} — coming soon`}
          title="Coming soon"
          className="flex size-[32px] cursor-not-allowed items-center justify-center rounded-[var(--radius-50,4px)] border"
          style={{ borderColor: C.border, backgroundColor: C.surface, opacity: 0.5 }}
        >
          <Icon size={16} color={C.disabled} />
        </span>
      </TooltipTrigger>
      <TooltipContent>{label} — coming soon</TooltipContent>
    </Tooltip>
  );
}

function PrototypeCard({
  prototype,
  onOpenViewer,
}: {
  prototype: Prototype;
  onOpenViewer: () => void;
}) {
  const [titleHover, setTitleHover] = useState(false);
  return (
    <div
      className="flex flex-col gap-[var(--spacing-200,16px)] rounded-[var(--radius-100,8px)] border border-solid p-[var(--spacing-300,24px)]"
      style={{ backgroundColor: C.surface, borderColor: C.border }}
    >
      {/* Top row: icon + status */}
      <div className="flex items-center justify-between">
        <span
          className="flex size-[40px] items-center justify-center rounded-[var(--radius-50,4px)]"
          style={{ backgroundColor: C.brandSubtle }}
        >
          <Television size={22} weight="fill" style={{ color: C.brandFg }} />
        </span>
        <StatusPill status={prototype.status} />
      </div>

      {/* Title opens the Prototype Viewer drawer (a <button>, sibling of the
          action links below — no nested interactive controls). */}
      <div className="flex flex-col gap-[var(--spacing-50,4px)]">
        <button
          type="button"
          data-focus-key={`proto-open-${prototype.id}`}
          onClick={onOpenViewer}
          onMouseEnter={() => setTitleHover(true)}
          onMouseLeave={() => setTitleHover(false)}
          className="text-left text-[length:var(--headline-xs-medium-size,16px)] font-semibold transition-colors"
          style={{ color: titleHover ? C.brandFg : C.textPrimary }}
        >
          {prototype.name}
        </button>
        <p
          className="text-[length:var(--body-md-regular-size,14px)]"
          style={{ color: C.textMuted }}
        >
          {prototype.description}
        </p>
      </div>

      {/* Actions row — Open + Flow Chart + Usability Testing (siblings). */}
      <div
        className="mt-auto flex items-center justify-between border-t pt-[var(--spacing-150,12px)]"
        style={{ borderColor: C.border }}
      >
        <OpenLink href={prototype.route} />
        <div className="flex items-center gap-1.5">
          {/* Flow Chart & Usability Testing are inactive ("Coming soon"):
              visible but muted, non-clickable and not focusable. */}
          <DisabledQuickAction label="Flow Chart" icon={FlowArrow} />
          <DisabledQuickAction label="Usability Testing" icon={TestTube} />
        </div>
      </div>
    </div>
  );
}

function OpenLink({ href }: { href: string }) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors"
      style={{ color: hover ? C.brandFg : C.textBody }}
    >
      <ArrowSquareOut size={15} />
      Open prototype
    </Link>
  );
}

export default function AiPrototypePage(): JSX.Element {
  // A refresh tick re-reads the repo after viewer edits (versions / share).
  const [tick, setTick] = useState(0);
  const prototypes = prototypeRepository.list();

  // Which prototype's viewer drawer is open (by id), if any.
  const [openId, setOpenId] = useState<string | null>(null);
  const active = openId ? prototypes.find((p) => p.id === openId) : undefined;

  return (
    <div className="mx-auto w-full max-w-[1080px] px-6 py-8 md:px-10 md:py-10">
      {/* Header */}
      <div className="flex flex-col gap-[var(--spacing-100,8px)]">
        <h1
          className="text-[length:var(--headline-lg-semibold-size,28px)] font-semibold tracking-[-1px]"
          style={{ color: C.textPrimary }}
        >
          AI Prototype
        </h1>
        <p
          className="max-w-[640px] text-[length:var(--body-lg-regular-size,16px)]"
          style={{ color: C.textMuted }}
        >
          Your central workspace for AI-powered product prototypes. Open a prototype, map its flows
          in Flow Chart, or validate it in Usability Testing.
        </p>
      </div>

      {/* Prototypes grid */}
      <div className="mt-[var(--spacing-400,32px)]">
        <p
          className="pb-[var(--spacing-150,12px)] text-[13px] font-medium uppercase tracking-wide"
          style={{ color: C.textMuted }}
        >
          Prototypes
        </p>
        <div className="grid grid-cols-1 gap-[var(--spacing-200,16px)] sm:grid-cols-2 lg:grid-cols-3">
          {prototypes.map((p) => (
            <PrototypeCard
              key={p.id}
              prototype={p}
              onOpenViewer={() => setOpenId(p.id)}
            />
          ))}

          {/* Empty-state placeholder (non-functional). */}
          <div
            className="flex min-h-[220px] flex-col items-center justify-center gap-[var(--spacing-100,8px)] rounded-[var(--radius-100,8px)] border border-dashed p-[var(--spacing-300,24px)] text-center"
            style={{ borderColor: C.border }}
          >
            <span
              className="flex size-[40px] items-center justify-center rounded-full"
              style={{ backgroundColor: C.hoverBg }}
            >
              <Plus size={20} color={C.disabled} />
            </span>
            <p
              className="text-[length:var(--body-md-medium-size,14px)] font-medium"
              style={{ color: C.textPrimary }}
            >
              New prototype
            </p>
            <p
              className="text-[length:var(--body-sm-regular-size,12px)]"
              style={{ color: C.textMuted }}
            >
              Prototype creation is coming soon.
            </p>
          </div>
        </div>
      </div>

      {/* Prototype Viewer — DS Side Panel drawer (large / 800 size). */}
      <SidePanel
        open={active != null}
        onClose={() => setOpenId(null)}
        title={active ? active.name : "Prototype"}
        subtitle="Prototype viewer"
        size="800"
      >
        {active && (
          <PrototypeViewer
            key={`${active.id}-${tick}`}
            prototype={active}
            onChanged={() => setTick((t) => t + 1)}
          />
        )}
      </SidePanel>
    </div>
  );
}
