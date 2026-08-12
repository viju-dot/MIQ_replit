/* =========================================================================
 * Fiber Workspace — AI Prototype (/ai-prototype)
 *
 * The central workspace. Lists prototypes from the prototype registry
 * (prototypeStore). Each card exposes THREE sibling actions — Open, Flow Chart,
 * Usability Testing — never nested inside one clickable card, so there are no
 * nested interactive controls.
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

/** A quick-action icon link (sibling control — never nested inside a card link). */
function QuickAction({
  href,
  label,
  icon: Icon,
}: {
  href: string;
  label: string;
  icon: React.ComponentType<IconProps>;
}) {
  const [hover, setHover] = useState(false);
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          aria-label={label}
          onMouseEnter={() => setHover(true)}
          onMouseLeave={() => setHover(false)}
          className="flex size-[32px] items-center justify-center rounded-[var(--radius-50,4px)] border transition-colors"
          style={{
            borderColor: C.border,
            backgroundColor: hover ? C.hoverBg : C.surface,
          }}
        >
          <Icon size={16} color={hover ? C.brandFg : C.textBody} />
        </Link>
      </TooltipTrigger>
      <TooltipContent>{label}</TooltipContent>
    </Tooltip>
  );
}

function PrototypeCard({ prototype }: { prototype: Prototype }) {
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

      {/* Title (opens the prototype) + description — the title link is a sibling
          of the action buttons, so no interactive control is nested. */}
      <div className="flex flex-col gap-[var(--spacing-50,4px)]">
        <Link
          href={prototype.route}
          onMouseEnter={() => setTitleHover(true)}
          onMouseLeave={() => setTitleHover(false)}
          className="text-[length:var(--headline-xs-medium-size,16px)] font-semibold transition-colors"
          style={{ color: titleHover ? C.brandFg : C.textPrimary }}
        >
          {prototype.name}
        </Link>
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
          <QuickAction
            href={`/flow-chart/${prototype.id}`}
            label="Open in Flow Chart"
            icon={FlowArrow}
          />
          <QuickAction
            href={`/usability-testing/${prototype.id}`}
            label="Open in Usability Testing"
            icon={TestTube}
          />
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
  const prototypes = prototypeRepository.list();

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
            <PrototypeCard key={p.id} prototype={p} />
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
    </div>
  );
}
