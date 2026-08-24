/* =========================================================================
 * MIQ Collaborative Frameworks — global header
 *
 * Single header used everywhere: MIQ/app logo + name (→ Welcome),
 * module-switching nav links with a Fiber brand active state, then a theme
 * toggle. Module switching lives here — there is no module sidebar anymore.
 *
 * COLOR CONVENTION: token-driven colors are applied via inline style objects
 * (var(--token, fallbackHex)) — Tailwind arbitrary var()/rgba color classes can
 * silently fail. Hover / active color changes use React state or props.
 * Layout / spacing / typography-size classes stay as utilities.
 * ========================================================================= */

import { useEffect, useState } from "react";
import { Link, useLocation } from "wouter";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { useAutoHideHeader } from "@/hooks/useAutoHideHeader";
import { HEADER_NAV, type HeaderNavItem } from "./headerNav";

// Token-driven colors (var(--token, fallbackHex)) — flip with [data-theme].
const C = {
  surface: "var(--surface-background-lvl1,#ffffff)",
  border: "var(--border-static-subtle-neutral,#e1e1e8)",
  textPrimary: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
  textBody: "var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)",
  brandSubtle: "var(--container-dynamic-brand-subtle-background-default,#f6ebff)",
  brandFg: "var(--surface-foreground-dynamic-brand-default,#7c33b5)",
  hoverBg: "var(--container-dynamic-neutral-subtle-background-hover,#71718014)",
};

/** MIQ Sigma lettermark, rendered from public assets. */
export function Lettermark({ height = 24 }: { height?: number }) {
  return (
    <img
      src={`${import.meta.env.BASE_URL}figmaAssets/miq-lettermark.svg`}
      alt="MIQ"
      className="block w-auto shrink-0"
      style={{ height }}
    />
  );
}

/** A single header module link with a Fiber brand-pill active state. */
function ModuleLink({ item, active }: { item: HeaderNavItem; active: boolean }) {
  const [hover, setHover] = useState(false);
  if (item.comingSoon) {
    return (
      <span
        aria-disabled="true"
        title="Coming soon"
        className="flex shrink-0 cursor-default select-none items-center whitespace-nowrap rounded-full px-3 py-1.5 text-[13px]"
        style={{ color: C.textBody, opacity: 0.5, fontWeight: 500 }}
      >
        {item.label}
      </span>
    );
  }
  return (
    <Link
      href={item.href}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-current={active ? "page" : undefined}
      className="flex shrink-0 items-center whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] transition-colors"
      style={{
        backgroundColor: active ? C.brandSubtle : hover ? C.hoverBg : undefined,
        color: active ? C.brandFg : C.textBody,
        fontWeight: active ? 600 : 500,
      }}
    >
      {item.label}
    </Link>
  );
}

/** Horizontal module nav. Scrolls horizontally on narrow viewports. */
function ModuleNav() {
  const [location] = useLocation();
  return (
    <nav
      aria-label="Modules"
      className="flex min-w-0 flex-1 items-center gap-1 overflow-x-auto md:justify-center"
    >
      {HEADER_NAV.map((item) => (
        <ModuleLink key={item.href} item={item} active={item.match(location)} />
      ))}
    </nav>
  );
}

/** Pill button whose background lifts on hover (token-driven, inline styles). */
function PillButton({
  onClick,
  ariaLabel,
  children,
}: {
  onClick: () => void;
  ariaLabel: string;
  children: React.ReactNode;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[12px] font-medium transition-colors"
      style={{
        backgroundColor: hover ? C.hoverBg : C.surface,
        borderColor: C.border,
        color: C.textBody,
      }}
    >
      {children}
    </button>
  );
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const dark = theme === "dark";
  return (
    <PillButton
      onClick={() => setTheme(dark ? "light" : "dark")}
      ariaLabel={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      {dark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      <span className="hidden sm:inline">{dark ? "Dark" : "Light"}</span>
    </PillButton>
  );
}

interface WorkspaceHeaderProps {
  /**
   * Whether to show the module-switching nav. Defaults to true (shown
   * everywhere after login). The header is otherwise identical everywhere.
   */
  showNav?: boolean;
}

/**
 * The global workspace header. Logo always links back to the Welcome screen.
 *
 * The header is auto-hiding (floating), not sticky: at the top of the page it
 * sits in the normal document flow; once scrolled past it floats away and only
 * reappears — as a fixed overlay — on hover (slim top-of-viewport zone or the
 * header itself) or keyboard focus. See useAutoHideHeader.
 */
export function WorkspaceHeader({ showNav = true }: WorkspaceHeaderProps) {
  // The header persists across navigations inside AppShell, so give the
  // auto-hide hook the current location as a routeKey — it resets any remembered
  // scroll state when the route changes so a previous page's scroll position
  // cannot keep the header hidden on a page that renders at scroll top.
  const [location] = useLocation();
  const auto = useAutoHideHeader({ routeKey: location });
  const floating = auto.mode === "floating";

  // Publish the header's current in-flow offset so sticky descendants (e.g. the
  // Design System sidebar) can sit directly under the header while it is at the
  // top, and stick to the very top of the viewport once it floats away/hidden.
  const headerOffset = floating ? 0 : auto.headerHeight;
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty("--ws-header-offset", `${headerOffset}px`);
    return () => {
      root.style.removeProperty("--ws-header-offset");
    };
  }, [headerOffset]);

  // Spacer height that replaces the header once it floats out of flow.
  //
  // Two topologies, each jump-free WITHOUT any scroll compensation:
  //  • Window-scroll pages: KEEP the spacer at the header height so the
  //    document height is unchanged (no content jump). Sticky descendants still
  //    reach the viewport top naturally once the page has scrolled past the
  //    header, because --ws-header-offset is 0 while floating.
  //  • Inner-scroll pages (the scrolling <main> is a sibling below the header):
  //    COLLAPSE the spacer to 0 so <main> — and any sticky element inside it,
  //    e.g. the Design System sidebar — rises to the very top of the viewport.
  //    The inner scroll coordinate is independent of this layout change, so
  //    nothing jumps.
  const spacerHeight = floating
    ? auto.windowScroller
      ? auto.headerHeight
      : 0
    : 0;

  return (
    <>
      {/* Slim invisible hover zone pinned to the top of the viewport. Only
          matters while floating; it reveals the hidden header on hover. */}
      {floating && (
        <div
          aria-hidden
          className="fixed inset-x-0 top-0 z-40 h-4"
          {...auto.hoverZoneHandlers}
        />
      )}

      {/* In-flow spacer — see spacerHeight above. */}
      {floating && spacerHeight > 0 && (
        <div aria-hidden style={{ height: spacerHeight }} />
      )}

      <header
        ref={auto.headerRef}
        {...auto.headerHandlers}
        className={`${
          floating ? "fixed left-0 right-0 top-0 z-50" : "relative z-30"
        } flex items-center gap-3 border-b px-4 py-3 transition-[transform,box-shadow] duration-200 ease-out md:px-6`}
        style={{
          backgroundColor: C.surface,
          borderColor: C.border,
          transform: `translateY(${auto.translateY})`,
          boxShadow:
            floating && auto.revealed
              ? "0px 8px 24px var(--shadow-lvl4, rgba(113,113,128,0.12))"
              : "none",
        }}
      >
        <Link href="/" aria-label="Go to Welcome" className="inline-flex shrink-0 items-center gap-2.5">
          <Lettermark height={22} />
          <span
            className="hidden text-[15px] font-semibold lg:inline"
            style={{ color: C.textPrimary }}
          >
            MIQ Collaborative Frameworks
          </span>
        </Link>

        {showNav ? <ModuleNav /> : <div className="min-w-0 flex-1" />}

        <ThemeToggle />
      </header>
    </>
  );
}
