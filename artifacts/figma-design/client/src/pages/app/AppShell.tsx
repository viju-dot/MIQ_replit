/* =========================================================================
 * Fiber Workspace — App Shell (persistent layout for authenticated routes)
 *
 * Left sidebar navigation + slim header, wrapping every authenticated module.
 * Module switching is pure client-side routing (wouter <Link>) so context is
 * never lost to a full reload.
 *
 * FUTURE WORKFLOW (not implemented — structure only):
 *   Design System → AI Prototype → Flow Chart → Usability Testing
 * Components curated in the Design System feed AI Prototype generation; those
 * prototypes are mapped as flows in Flow Chart and then validated in Usability
 * Testing. These cross-module links are intentionally NOT wired up yet.
 * ========================================================================= */

import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Moon, Sun, Menu, X } from "lucide-react";
import {
  House,
  Palette,
  Sparkle,
  FlowArrow,
  TestTube,
  SignOut,
  User,
  type IconProps,
} from "@phosphor-icons/react";
import { useTheme } from "@/lib/theme";
import { logout, CURRENT_USER } from "./auth";

// Token-driven palette (var(--token, fallbackHex)) — flips with [data-theme].
const surface = "bg-[var(--surface-background-lvl1,#ffffff)]";
const canvasBg = "bg-[var(--surface-background-lvl2,#f7f7fa)]";
const borderToken = "border-[var(--border-static-subtle-neutral,#e1e1e8)]";
const textPrimary = "text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]";
const textMuted = "text-[var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)]";
const textBody = "text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)]";

type IconType = React.ComponentType<IconProps>;

interface NavItem {
  href: string;
  label: string;
  icon: IconType;
  /** Extra path prefixes that should also mark this item active. */
  match?: (path: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: House, match: (p) => p === "/" },
  {
    href: "/design-system",
    label: "Design System",
    icon: Palette,
    match: (p) => p === "/design-system" || p.startsWith("/design-system/"),
  },
  { href: "/ai-prototype", label: "AI Prototype", icon: Sparkle },
  { href: "/flow-chart", label: "Flow Chart", icon: FlowArrow },
  { href: "/usability-testing", label: "Usability Testing", icon: TestTube },
];

function isActive(item: NavItem, path: string): boolean {
  if (item.match) return item.match(path);
  return path === item.href || path.startsWith(`${item.href}/`);
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[12px] font-medium transition-colors ${borderToken} ${surface} ${textBody} hover:bg-[var(--container-dynamic-neutral-subtle-background-hover,#71718014)]`}
    >
      {dark ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
      {dark ? "Dark" : "Light"}
    </button>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const [location] = useLocation();
  return (
    <nav className={`flex h-full flex-col ${surface}`} aria-label="Workspace modules">
      <div className={`flex items-center gap-2.5 border-b px-5 py-5 ${borderToken}`}>
        <div className="flex size-[28px] shrink-0 items-center justify-center rounded-[6px] bg-[var(--container-dynamic-brand-bold-background-default,#7c33b5)]">
          <Sparkle
            size={16}
            weight="fill"
            color="var(--container-dynamic-brand-bold-foreground-default,#ffffff)"
          />
        </div>
        <div className="min-w-0">
          <p className={`truncate text-[15px] font-semibold ${textPrimary}`}>Fiber Workspace</p>
          <p className={`truncate text-[11px] ${textMuted}`}>Innovation modules</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-3">
        <p className={`px-2 pb-2 text-[11px] font-medium uppercase tracking-wide ${textMuted}`}>
          Modules
        </p>
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item, location);
            const Icon = item.icon;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={onNavigate}
                  className={`flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[14px] transition-colors ${
                    active
                      ? "bg-[var(--container-dynamic-brand-subtle-background-selected,#f6ebff)] font-medium text-[var(--surface-foreground-dynamic-brand-default,#7c33b5)]"
                      : `${textPrimary} hover:bg-[var(--container-dynamic-neutral-subtle-background-hover,#71718014)]`
                  }`}
                >
                  <Icon
                    size={18}
                    weight={active ? "fill" : "regular"}
                    color={
                      active
                        ? "var(--surface-foreground-dynamic-brand-default,#7c33b5)"
                        : "var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)"
                    }
                  />
                  {item.label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

function UserChip() {
  const [, navigate] = useLocation();
  const onLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <div className="flex items-center gap-2">
      <div
        className={`flex items-center gap-1.5 rounded-full border px-2 py-1 ${borderToken} ${surface}`}
      >
        <span className="flex size-[22px] items-center justify-center rounded-full bg-[var(--container-dynamic-brand-subtle-background-default,#f6ebff)]">
          <User size={13} weight="fill" color="var(--surface-foreground-dynamic-brand-default,#7c33b5)" />
        </span>
        <span className={`text-[13px] font-medium ${textPrimary}`}>{CURRENT_USER}</span>
      </div>
      <button
        type="button"
        onClick={onLogout}
        aria-label="Log out"
        className={`flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[12px] font-medium transition-colors ${borderToken} ${surface} ${textBody} hover:bg-[var(--container-dynamic-neutral-subtle-background-hover,#71718014)]`}
      >
        <SignOut size={14} />
        Logout
      </button>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className={`flex min-h-screen ${canvasBg}`}
      style={{ fontFamily: '"Poppins", "DM Sans", sans-serif' }}
    >
      {/* Desktop sidebar */}
      <aside
        className={`sticky top-0 hidden h-screen w-64 shrink-0 border-r md:block ${borderToken}`}
      >
        <SidebarNav />
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          <div
            className="absolute inset-0 bg-black/30"
            onClick={() => setMobileOpen(false)}
            aria-hidden
          />
          <aside className={`absolute inset-y-0 left-0 w-64 border-r shadow-lg ${borderToken}`}>
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Slim header */}
        <header
          className={`sticky top-0 z-30 flex items-center gap-3 border-b px-4 py-3 md:px-6 ${borderToken} ${surface}`}
        >
          <button
            type="button"
            aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
            onClick={() => setMobileOpen((open) => !open)}
            className={`md:hidden ${textPrimary}`}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <span className={`flex-1 text-[15px] font-semibold ${textPrimary}`}>Fiber Workspace</span>
          <ThemeToggle />
          <UserChip />
        </header>

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
