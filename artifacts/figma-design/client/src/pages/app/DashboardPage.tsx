/* =========================================================================
 * Fiber Workspace — Welcome / Module Selection (/)
 *
 * Standalone entry point rendered WITHOUT the left sidebar: a slim shared
 * header (reused by the sidebar AppShell) over a centered welcome heading and
 * the four module tiles. Selecting a module routes into the sidebar workspace.
 *
 * Each tile is a SINGLE clickable <Link> — no nested interactive controls (the
 * arrow is a decorative icon only).
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
import { WorkspaceHeader } from "./WorkspaceHeader";
import { CURRENT_USER } from "./auth";

// Token-driven colors (var(--token, fallbackHex)) — flip with [data-theme].
const C = {
  surface: "var(--surface-background-lvl1,#ffffff)",
  canvasBg: "var(--surface-background-lvl2,#f7f7fa)",
  border: "var(--border-static-subtle-neutral,#e1e1e8)",
  textPrimary: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
  textMuted: "var(--surface-foreground-static-neutral-lvl3,#717180)",
  brandSubtle: "var(--container-dynamic-brand-subtle-background-default,#f6ebff)",
  brandFg: "var(--surface-foreground-dynamic-brand-default,#7c33b5)",
  arrow: "var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)",
};

type IconType = React.ComponentType<IconProps>;

interface ModuleCard {
  href: string;
  title: string;
  description: string;
  icon: IconType;
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
  },
  {
    href: "/usability-testing",
    title: "Usability Testing",
    description: "Validate AI Prototype outputs against real usability signals.",
    icon: TestTube,
  },
];

function ModuleTile({ card }: { card: ModuleCard }) {
  const [hover, setHover] = useState(false);
  const Icon = card.icon;
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
      <div className="flex items-center justify-between">
        <span
          className="flex size-[52px] items-center justify-center rounded-[var(--radius-100,8px)]"
          style={{ backgroundColor: C.brandSubtle }}
        >
          <Icon size={28} weight="fill" style={{ color: C.brandFg }} />
        </span>
        <ArrowRight
          size={20}
          className="translate-x-0 transition-transform group-hover:translate-x-0.5"
          style={{ color: C.arrow }}
        />
      </div>
      <div className="flex flex-col gap-[var(--spacing-75,6px)]">
        <h2 className="text-[18px] font-semibold" style={{ color: C.textPrimary }}>
          {card.title}
        </h2>
        <p
          className="text-[length:var(--body-md-regular-size,14px)]"
          style={{ color: C.textMuted }}
        >
          {card.description}
        </p>
      </div>
    </Link>
  );
}

export default function DashboardPage(): JSX.Element {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: C.canvasBg, fontFamily: '"Poppins", "DM Sans", sans-serif' }}
    >
      {/* Shared slim header — no logo link (already on the Welcome screen). */}
      <WorkspaceHeader />

      <main className="flex flex-1 items-start justify-center px-6 py-12 md:py-16">
        <div className="flex w-full max-w-[1080px] flex-col">
          {/* Welcome header */}
          <div className="flex flex-col items-center gap-[var(--spacing-100,8px)] text-center">
            <h1
              className="text-[length:var(--headline-lg-semibold-size,28px)] font-semibold tracking-[-1px]"
              style={{ color: C.textPrimary }}
            >
              Welcome back, {CURRENT_USER}
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
