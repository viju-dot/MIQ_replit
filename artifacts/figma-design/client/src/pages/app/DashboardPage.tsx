/* =========================================================================
 * MIQ Collaborative Frameworks — Welcome / Module Selection (/)
 *
 * The launching screen. Standalone entry point with NO global header — the
 * module tiles ARE the navigation. A discreet floating top-right cluster
 * (theme toggle) keeps theme reachable. All OTHER pages keep the global header.
 *
 * Each active tile is a SINGLE clickable <Link> — no nested interactive
 * controls (the arrow is a decorative icon only). Flow Chart and Usability
 * Testing are shown but inactive ("Coming soon"): muted, non-clickable and
 * not focusable, with aria-disabled semantics.
 *
 * COLOR CONVENTION: token-driven colors use inline style objects
 * (var(--token, fallbackHex)) — Tailwind arbitrary var()/rgba color classes can
 * silently fail. Layout / spacing / typography-size classes stay as utilities.
 *
 * FUTURE WORKFLOW (not implemented): the modules are designed to connect as
 *   Design System → AI Prototype → Flow Chart → Usability Testing.
 * ========================================================================= */

import { useState } from "react";
import { Link } from "wouter";
import {
  Palette,
  Sparkle,
  FlowArrow,
  TestTube,
  ArrowRight,
  type IconProps,
} from "@phosphor-icons/react";
import { ThemeToggle } from "./WorkspaceHeader";

// Token-driven colors (var(--token, fallbackHex)) — flip with [data-theme].
const C = {
  surface: "var(--surface-background-lvl1,#ffffff)",
  canvasBg: "var(--surface-background-lvl2,#f7f7fa)",
  border: "var(--border-static-subtle-neutral,#e1e1e8)",
  textPrimary: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
  textMuted: "var(--surface-foreground-static-neutral-lvl3,#717180)",
  textBody: "var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)",
  brandSubtle: "var(--container-dynamic-brand-subtle-background-default,#f6ebff)",
  brandFg: "var(--surface-foreground-dynamic-brand-default,#7c33b5)",
  arrow: "var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)",
  hoverBg: "var(--container-dynamic-neutral-subtle-background-hover,#71718014)",
};

/** Discreet floating cluster: theme toggle (Welcome has no header). */
function FloatingControls() {
  return (
    <div className="fixed right-4 top-4 z-30 flex items-center gap-2 md:right-6 md:top-6">
      <ThemeToggle />
    </div>
  );
}

type IconType = React.ComponentType<IconProps>;

interface ModuleCard {
  href: string;
  title: string;
  description: string;
  icon: IconType;
  /** Inactive modules are shown but muted, non-clickable ("Coming soon"). */
  comingSoon?: boolean;
}

const CARDS: ModuleCard[] = [
  {
    href: "/design-system",
    title: "Fiber Design System",
    description: "Explore Fiber components, variants and tokens imported live from Figma.",
    icon: Palette,
  },
  {
    href: "/ai-prototype",
    title: "AI Prototype",
    description: "An innovation workspace for building product prototypes powered by AI.",
    icon: Sparkle,
  },
  {
    href: "/flow-chart",
    title: "Flow Chart",
    description: "Map user flows, AI workflows and decision trees with version history.",
    icon: FlowArrow,
    comingSoon: true,
  },
  {
    href: "/usability-testing",
    title: "Usability Testing",
    description: "Validate AI Prototype outputs against real usability signals.",
    icon: TestTube,
    comingSoon: true,
  },
];

/** "Coming soon" badge — reuses the brand-subtle pill visual language. */
function ComingSoonBadge() {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ backgroundColor: C.brandSubtle, color: C.brandFg }}
    >
      Coming soon
    </span>
  );
}

/** Inner tile content, shared by the active (link) and inactive tiles. */
function TileBody({ card, muted }: { card: ModuleCard; muted?: boolean }) {
  const Icon = card.icon;
  return (
    <>
      <div className="flex items-center justify-between">
        <span
          className="flex size-[52px] items-center justify-center rounded-[var(--radius-100,8px)]"
          style={{ backgroundColor: muted ? C.hoverBg : C.brandSubtle }}
        >
          <Icon size={28} weight="fill" style={{ color: muted ? C.arrow : C.brandFg }} />
        </span>
        {muted ? (
          <ComingSoonBadge />
        ) : (
          <ArrowRight
            size={20}
            className="translate-x-0 transition-transform group-hover:translate-x-0.5"
            style={{ color: C.arrow }}
          />
        )}
      </div>
      <div className="flex flex-col gap-[var(--spacing-75,6px)]">
        <h2
          className="text-[18px] font-semibold"
          style={{ color: muted ? C.textMuted : C.textPrimary }}
        >
          {card.title}
        </h2>
        <p
          className="text-[length:var(--body-md-regular-size,14px)]"
          style={{ color: muted ? C.arrow : C.textMuted }}
        >
          {card.description}
        </p>
      </div>
    </>
  );
}

function ModuleTile({ card }: { card: ModuleCard }) {
  const [hover, setHover] = useState(false);

  // Inactive module: visible but muted, non-clickable and not focusable, with
  // aria-disabled semantics. Rendered as a plain <div> (no interactive role).
  if (card.comingSoon) {
    return (
      <div
        aria-disabled="true"
        title="Coming soon"
        className="flex cursor-not-allowed flex-col gap-[var(--spacing-300,24px)] rounded-[var(--radius-100,8px)] border border-solid p-[var(--spacing-400,32px)]"
        style={{ backgroundColor: C.surface, borderColor: C.border, opacity: 0.6 }}
      >
        <TileBody card={card} muted />
      </div>
    );
  }

  return (
    <Link
      href={card.href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="group flex flex-col gap-[var(--spacing-300,24px)] rounded-[var(--radius-100,8px)] border border-solid p-[var(--spacing-400,32px)] transition-shadow"
      style={{
        backgroundColor: C.surface,
        borderColor: C.border,
        boxShadow: hover ? "var(--elevation-hover)" : undefined,
      }}
    >
      <TileBody card={card} />
    </Link>
  );
}

export default function DashboardPage(): JSX.Element {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: C.canvasBg, fontFamily: '"Poppins", "DM Sans", sans-serif' }}
    >
      {/* Welcome has NO global header — the module tiles are the navigation.
          A discreet floating cluster keeps theme reachable. */}
      <FloatingControls />

      <main className="flex flex-1 items-start justify-center px-6 py-12 md:py-16">
        <div className="flex w-full max-w-[1080px] flex-col">
          {/* Welcome header */}
          <div className="flex flex-col items-center gap-[var(--spacing-100,8px)] text-center">
            <h1
              className="text-[length:var(--headline-lg-semibold-size,28px)] font-semibold tracking-[-1px]"
              style={{ color: C.textPrimary }}
            >
              Welcome to MIQ Collaborative Frameworks
            </h1>
            <p
              className="max-w-[640px] text-[length:var(--body-lg-regular-size,16px)]"
              style={{ color: C.textMuted }}
            >
              Choose a module to get started. The workspace is designed as a connected pipeline:{" "}
              <span className="font-medium" style={{ color: C.brandFg }}>
                Design System → AI Prototype → Flow Chart → Usability Testing
              </span>
              .
            </p>
          </div>

          {/* Module tiles */}
          <div className="mt-[var(--spacing-500,40px)] grid grid-cols-1 gap-[var(--spacing-300,24px)] sm:grid-cols-2">
            {CARDS.map((card) => (
              <ModuleTile key={card.href} card={card} />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
