/* =========================================================================
 * Fiber Workspace — AI Prototype (/ai-prototype)
 *
 * Innovation workspace landing. Renders a "Prototypes" grid with one real
 * prototype (TV Audience Intelligence) plus an empty-state "New prototype"
 * placeholder card (non-functional).
 *
 * FUTURE WORKFLOW: prototypes generated here feed Flow Chart and Usability
 * Testing. Not implemented yet.
 * ========================================================================= */

import { Link } from "wouter";
import { Television, Plus, ArrowRight } from "@phosphor-icons/react";

const surface = "bg-[var(--surface-background-lvl1,#ffffff)]";
const borderToken = "border-[var(--border-static-subtle-neutral,#e1e1e8)]";
const textPrimary = "text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]";
const textMuted = "text-[var(--surface-foreground-static-neutral-lvl3,#717180)]";

export default function AiPrototypePage(): JSX.Element {
  return (
    <div className="mx-auto w-full max-w-[1080px] px-6 py-8 md:px-10 md:py-10">
      {/* Header */}
      <div className="flex flex-col gap-[var(--spacing-100,8px)]">
        <h1
          className={`text-[length:var(--headline-lg-semibold-size,28px)] font-semibold tracking-[-1px] ${textPrimary}`}
        >
          AI Prototype
        </h1>
        <p className={`max-w-[640px] text-[length:var(--body-lg-regular-size,16px)] ${textMuted}`}>
          An innovation workspace for building product prototypes powered by AI. Open an existing
          prototype below or start a new one.
        </p>
      </div>

      {/* Prototypes grid */}
      <div className="mt-[var(--spacing-400,32px)]">
        <p className={`pb-[var(--spacing-150,12px)] text-[13px] font-medium uppercase tracking-wide ${textMuted}`}>
          Prototypes
        </p>
        <div className="grid grid-cols-1 gap-[var(--spacing-200,16px)] sm:grid-cols-2 lg:grid-cols-3">
          {/* Real prototype */}
          <Link
            href="/tv-audience-intelligence"
            className={`group flex flex-col gap-[var(--spacing-200,16px)] rounded-[var(--radius-100,8px)] border border-solid p-[var(--spacing-300,24px)] transition-shadow hover:shadow-[var(--elevation-hover)] ${borderToken} ${surface}`}
          >
            <div className="flex items-center justify-between">
              <span className="flex size-[40px] items-center justify-center rounded-[var(--radius-50,4px)] bg-[var(--container-dynamic-brand-subtle-background-default,#f6ebff)]">
                <Television
                  size={22}
                  weight="fill"
                  color="var(--surface-foreground-dynamic-brand-default,#7c33b5)"
                />
              </span>
              <ArrowRight
                size={18}
                className="transition-transform group-hover:translate-x-0.5"
                color="var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)"
              />
            </div>
            <div className="flex flex-col gap-[var(--spacing-50,4px)]">
              <h2
                className={`text-[length:var(--headline-xs-medium-size,16px)] font-semibold ${textPrimary}`}
              >
                TV Audience Intelligence
              </h2>
              <p className={`text-[length:var(--body-md-regular-size,14px)] ${textMuted}`}>
                A full product experience for exploring and activating TV audience segments.
              </p>
            </div>
          </Link>

          {/* Empty-state placeholder (non-functional) */}
          <div
            className={`flex min-h-[180px] flex-col items-center justify-center gap-[var(--spacing-100,8px)] rounded-[var(--radius-100,8px)] border border-dashed p-[var(--spacing-300,24px)] text-center ${borderToken}`}
          >
            <span className="flex size-[40px] items-center justify-center rounded-full bg-[var(--container-dynamic-neutral-subtle-background-hover,#71718014)]">
              <Plus size={20} color="var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)" />
            </span>
            <p
              className={`text-[length:var(--body-md-medium-size,14px)] font-medium ${textPrimary}`}
            >
              New prototype
            </p>
            <p className={`text-[length:var(--body-sm-regular-size,12px)] ${textMuted}`}>
              Prototype creation is coming soon.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
