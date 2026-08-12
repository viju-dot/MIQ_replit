/* =========================================================================
 * Fiber Workspace — global header (always visible after login)
 *
 * Single header used everywhere post-login: MIQ/app logo + name (→ Welcome),
 * module-switching nav links with a Fiber brand active state, then theme
 * toggle + user chip + Logout. Module switching lives here — there is no
 * module sidebar anymore.
 *
 * COLOR CONVENTION: token-driven colors are applied via inline style objects
 * (var(--token, fallbackHex)) — Tailwind arbitrary var()/rgba color classes can
 * silently fail. Hover / active color changes use React state or props.
 * Layout / spacing / typography-size classes stay as utilities.
 * ========================================================================= */

import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Moon, Sun } from "lucide-react";
import { SignOut, User } from "@phosphor-icons/react";
import { useTheme } from "@/lib/theme";
import { logout, CURRENT_USER } from "./auth";

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

/** Module-switching nav links, shared across the whole workspace. */
export interface HeaderNavItem {
  href: string;
  label: string;
  /** Marks the link active for the current path. */
  match: (path: string) => boolean;
}

export const HEADER_NAV: HeaderNavItem[] = [
  {
    href: "/design-system",
    label: "Fiber Design System",
    match: (p) => p === "/design-system" || p.startsWith("/design-system/"),
  },
  {
    href: "/ai-prototype",
    label: "AI Prototype",
    match: (p) => p === "/ai-prototype" || p.startsWith("/ai-prototype/"),
  },
  {
    href: "/flow-chart",
    label: "Flow Chart",
    match: (p) => p === "/flow-chart" || p.startsWith("/flow-chart/"),
  },
  {
    href: "/usability-testing",
    label: "Usability Testing",
    match: (p) => p === "/usability-testing" || p.startsWith("/usability-testing/"),
  },
];

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

export function UserChip() {
  const [, navigate] = useLocation();
  const onLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="flex shrink-0 items-center gap-2">
      <div
        className="hidden items-center gap-1.5 rounded-full border px-2 py-1 sm:flex"
        style={{ backgroundColor: C.surface, borderColor: C.border }}
      >
        <span
          className="flex size-[22px] items-center justify-center rounded-full"
          style={{ backgroundColor: C.brandSubtle }}
        >
          <User size={13} weight="fill" style={{ color: C.brandFg }} />
        </span>
        <span className="text-[13px] font-medium" style={{ color: C.textPrimary }}>
          {CURRENT_USER}
        </span>
      </div>
      <PillButton onClick={onLogout} ariaLabel="Log out">
        <SignOut size={14} />
        <span className="hidden sm:inline">Logout</span>
      </PillButton>
    </div>
  );
}

interface WorkspaceHeaderProps {
  /**
   * Whether to show the module-switching nav. Defaults to true (shown
   * everywhere after login). The header is otherwise identical everywhere.
   */
  showNav?: boolean;
}

/** The global workspace header. Logo always links back to the Welcome screen. */
export function WorkspaceHeader({ showNav = true }: WorkspaceHeaderProps) {
  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-3 border-b px-4 py-3 md:px-6"
      style={{ backgroundColor: C.surface, borderColor: C.border }}
    >
      <Link href="/" aria-label="Go to Welcome" className="inline-flex shrink-0 items-center gap-2.5">
        <Lettermark height={22} />
        <span
          className="hidden text-[15px] font-semibold lg:inline"
          style={{ color: C.textPrimary }}
        >
          Fiber Workspace
        </span>
      </Link>

      {showNav ? <ModuleNav /> : <div className="min-w-0 flex-1" />}

      <ThemeToggle />
      <UserChip />
    </header>
  );
}
