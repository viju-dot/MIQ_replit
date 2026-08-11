/* =========================================================================
 * Fiber Workspace — shared slim header
 *
 * Extracted so the standalone Welcome layout and the sidebar AppShell render an
 * identical top bar: app logo/name, theme toggle, user chip and logout.
 *
 * COLOR CONVENTION: token-driven colors are applied via inline style objects
 * (var(--token, fallbackHex)) — Tailwind arbitrary var()/rgba color classes can
 * silently fail. Hover color changes use React state. Layout / spacing /
 * typography-size classes stay as utilities.
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
      className="flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[12px] font-medium transition-colors"
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
      {dark ? "Dark" : "Light"}
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
    <div className="flex items-center gap-2">
      <div
        className="flex items-center gap-1.5 rounded-full border px-2 py-1"
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
        Logout
      </PillButton>
    </div>
  );
}

interface WorkspaceHeaderProps {
  /** Optional left slot — e.g. mobile menu toggle from the AppShell. */
  leading?: React.ReactNode;
  /** When true the app logo/name links back to the Welcome screen. */
  logoLink?: boolean;
}

/** Slim top header shared by the Welcome layout and the sidebar AppShell. */
export function WorkspaceHeader({ leading, logoLink = false }: WorkspaceHeaderProps) {
  const brand = (
    <span className="flex items-center gap-2.5">
      <Lettermark height={22} />
      <span className="text-[15px] font-semibold" style={{ color: C.textPrimary }}>
        Fiber Workspace
      </span>
    </span>
  );

  return (
    <header
      className="sticky top-0 z-30 flex items-center gap-3 border-b px-4 py-3 md:px-6"
      style={{ backgroundColor: C.surface, borderColor: C.border }}
    >
      {leading}
      <div className="flex-1">
        {logoLink ? (
          <Link href="/" aria-label="Go to Welcome" className="inline-flex">
            {brand}
          </Link>
        ) : (
          brand
        )}
      </div>
      <ThemeToggle />
      <UserChip />
    </header>
  );
}
