/* =========================================================================
 * Fiber Workspace — Dashboard (/)
 *
 * Welcome header + module cards using the Fiber card anatomy (icon, title,
 * description, arrow CTA).
 *
 * FUTURE WORKFLOW (not implemented): the modules are designed to connect as
 *   Design System → AI Prototype → Flow Chart → Usability Testing.
 * ========================================================================= */

import { Link } from "wouter";
import {
  Palette,
  Sparkle,
  FlowArrow,
  TestTube,
  ArrowRight,
  type IconProps,
} from "@phosphor-icons/react";

const surface = "bg-[var(--surface-background-lvl1,#ffffff)]";
const borderToken = "border-[var(--border-static-subtle-neutral,#e1e1e8)]";
const textPrimary = "text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]";
const textMuted = "text-[var(--surface-foreground-static-neutral-lvl3,#717180)]";

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
    title: "Design System",
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

export default function DashboardPage(): JSX.Element {
  return (
    <div className="mx-auto w-full max-w-[1080px] px-6 py-8 md:px-10 md:py-10">
      {/* Welcome header */}
      <div className="flex flex-col gap-[var(--spacing-100,8px)]">
        <h1
          className={`text-[length:var(--headline-lg-semibold-size,28px)] font-semibold tracking-[-1px] ${textPrimary}`}
        >
          Welcome back, Vijay
        </h1>
        <p className={`max-w-[640px] text-[length:var(--body-lg-regular-size,16px)] ${textMuted}`}>
          Jump into a module below. The workspace is designed as a connected pipeline:{" "}
          <span className="font-medium text-[var(--surface-foreground-dynamic-brand-default,#7c33b5)]">
            Design System → AI Prototype → Flow Chart → Usability Testing
          </span>
          .
        </p>
      </div>

      {/* Module cards */}
      <div className="mt-[var(--spacing-400,32px)] grid grid-cols-1 gap-[var(--spacing-200,16px)] sm:grid-cols-2">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className={`group flex flex-col gap-[var(--spacing-200,16px)] rounded-[var(--radius-100,8px)] border border-solid p-[var(--spacing-300,24px)] transition-shadow hover:shadow-[var(--elevation-hover)] ${borderToken} ${surface}`}
            >
              <div className="flex items-center justify-between">
                <span className="flex size-[40px] items-center justify-center rounded-[var(--radius-50,4px)] bg-[var(--container-dynamic-brand-subtle-background-default,#f6ebff)]">
                  <Icon
                    size={22}
                    weight="fill"
                    color="var(--surface-foreground-dynamic-brand-default,#7c33b5)"
                  />
                </span>
                <ArrowRight
                  size={18}
                  className="translate-x-0 transition-transform group-hover:translate-x-0.5"
                  color="var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)"
                />
              </div>
              <div className="flex flex-col gap-[var(--spacing-50,4px)]">
                <h2
                  className={`text-[length:var(--headline-xs-medium-size,16px)] font-semibold ${textPrimary}`}
                >
                  {card.title}
                </h2>
                <p className={`text-[length:var(--body-md-regular-size,14px)] ${textMuted}`}>
                  {card.description}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
