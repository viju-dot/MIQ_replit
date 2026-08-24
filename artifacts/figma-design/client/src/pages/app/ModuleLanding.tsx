/* =========================================================================
 * MIQ Collaborative Frameworks — module landing page (Flow Chart / Usability Testing roots)
 *
 * The bare /flow-chart and /usability-testing routes. Keeps the module
 * description + empty-state feel, and lists prototypes (from prototypeStore) as
 * entry points into the module's per-prototype context view.
 *
 * STRUCTURE ONLY — selecting a prototype navigates to the context view; no
 * editing / testing functionality here.
 *
 * COLOR CONVENTION: token-driven colors use inline style objects.
 * ========================================================================= */

import { useState } from "react";
import { Link } from "wouter";
import { ArrowRight, type IconProps } from "@phosphor-icons/react";
import { prototypeRepository, type Prototype } from "@/lib/prototypeStore";

type IconType = React.ComponentType<IconProps>;

const C = {
  surface: "var(--surface-background-lvl1,#ffffff)",
  border: "var(--border-static-subtle-neutral,#e1e1e8)",
  textPrimary: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
  textMuted: "var(--surface-foreground-static-neutral-lvl3,#717180)",
  brandSubtle: "var(--container-dynamic-brand-subtle-background-default,#f6ebff)",
  brandFg: "var(--surface-foreground-dynamic-brand-default,#7c33b5)",
  disabled: "var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)",
  elevationHover: "var(--elevation-hover)",
};

function PrototypeRow({
  prototype,
  toHref,
  icon: Icon,
}: {
  prototype: Prototype;
  toHref: (id: string) => string;
  icon: IconType;
}) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href={toHref(prototype.id)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group flex items-center gap-[var(--spacing-200,16px)] rounded-[var(--radius-100,8px)] border border-solid p-[var(--spacing-250,20px)] transition-shadow"
      style={{
        backgroundColor: C.surface,
        borderColor: C.border,
        boxShadow: hover ? C.elevationHover : undefined,
      }}
    >
      <span
        className="flex size-[40px] shrink-0 items-center justify-center rounded-[var(--radius-50,4px)]"
        style={{ backgroundColor: C.brandSubtle }}
      >
        <Icon size={20} weight="fill" style={{ color: C.brandFg }} />
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-[15px] font-semibold" style={{ color: C.textPrimary }}>
          {prototype.name}
        </p>
        <p
          className="truncate text-[length:var(--body-md-regular-size,14px)]"
          style={{ color: C.textMuted }}
        >
          {prototype.description}
        </p>
      </div>
      <ArrowRight
        size={18}
        className="shrink-0 transition-transform group-hover:translate-x-0.5"
        color={C.disabled}
      />
    </Link>
  );
}

export interface ModuleLandingProps {
  title: string;
  description: string;
  moduleIcon: IconType;
  /** Builds the per-prototype context route for this module. */
  toHref: (id: string) => string;
  /** Copy shown when there are no prototypes yet. */
  emptyLabel: string;
}

export function ModuleLanding({
  title,
  description,
  moduleIcon,
  toHref,
  emptyLabel,
}: ModuleLandingProps): JSX.Element {
  const prototypes = prototypeRepository.list();

  return (
    <div className="mx-auto w-full max-w-[1080px] px-6 py-8 md:px-10 md:py-10">
      {/* Header */}
      <div className="flex flex-col gap-[var(--spacing-100,8px)]">
        <h1
          className="text-[length:var(--headline-lg-semibold-size,28px)] font-semibold tracking-[-1px]"
          style={{ color: C.textPrimary }}
        >
          {title}
        </h1>
        <p
          className="max-w-[640px] text-[length:var(--body-lg-regular-size,16px)]"
          style={{ color: C.textMuted }}
        >
          {description}
        </p>
      </div>

      {/* Prototype entry points */}
      <div className="mt-[var(--spacing-400,32px)]">
        <p
          className="pb-[var(--spacing-150,12px)] text-[13px] font-medium uppercase tracking-wide"
          style={{ color: C.textMuted }}
        >
          Select a prototype
        </p>

        {prototypes.length > 0 ? (
          <div className="flex flex-col gap-[var(--spacing-150,12px)]">
            {prototypes.map((p) => (
              <PrototypeRow key={p.id} prototype={p} toHref={toHref} icon={moduleIcon} />
            ))}
          </div>
        ) : (
          <div
            className="flex min-h-[30vh] items-center justify-center rounded-[var(--radius-100,8px)] border border-dashed p-[var(--spacing-400,32px)] text-center"
            style={{ borderColor: C.border }}
          >
            <p
              className="max-w-[420px] text-[length:var(--body-md-regular-size,14px)]"
              style={{ color: C.textMuted }}
            >
              {emptyLabel}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
