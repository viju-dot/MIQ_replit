/* =========================================================================
 * Fiber Workspace — App Shell (persistent layout for authenticated routes)
 *
 * Left sidebar navigation + slim header, wrapping every authenticated module.
 * Module switching is pure client-side routing (wouter <Link>) so context is
 * never lost to a full reload.
 *
 * COLOR CONVENTION: token-driven colors use inline style objects
 * (var(--token, fallbackHex)) — Tailwind arbitrary var()/rgba color classes can
 * silently fail. Hover color changes use React state. Layout / spacing /
 * typography-size classes stay as utilities.
 *
 * FUTURE WORKFLOW (not implemented — structure only):
 *   Design System → AI Prototype → Flow Chart → Usability Testing
 * Components curated in the Design System feed AI Prototype generation; those
 * prototypes are mapped as flows in Flow Chart and then validated in Usability
 * Testing. These cross-module links are intentionally NOT wired up yet.
 * ========================================================================= */

import { useState, type ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { Menu, X } from "lucide-react";
import {
  House,
  Palette,
  Sparkle,
  FlowArrow,
  TestTube,
  type IconProps,
} from "@phosphor-icons/react";
import { WorkspaceHeader, Lettermark } from "./WorkspaceHeader";

// Token-driven colors (var(--token, fallbackHex)) — flip with [data-theme].
const C = {
  surface: "var(--surface-background-lvl1,#ffffff)",
  canvasBg: "var(--surface-background-lvl2,#f7f7fa)",
  border: "var(--border-static-subtle-neutral,#e1e1e8)",
  textPrimary: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
  textMuted: "var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)",
  textBody: "var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)",
  hoverBg: "var(--container-dynamic-neutral-subtle-background-hover,#71718014)",
  activeBg: "var(--container-dynamic-brand-subtle-background-selected,#f6ebff)",
  brandFg: "var(--surface-foreground-dynamic-brand-default,#7c33b5)",
};

type IconType = React.ComponentType<IconProps>;

interface NavItem {
  href: string;
  label: string;
  icon: IconType;
  /** Extra path prefixes that should also mark this item active. */
  match?: (path: string) => boolean;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Welcome", icon: House, match: (p) => p === "/" },
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

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate?: () => void;
}) {
  const [hover, setHover] = useState(false);
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[14px] transition-colors"
      style={{
        backgroundColor: active ? C.activeBg : hover ? C.hoverBg : undefined,
        color: active ? C.brandFg : C.textPrimary,
        fontWeight: active ? 500 : undefined,
      }}
    >
      <Icon
        size={18}
        weight={active ? "fill" : "regular"}
        color={active ? C.brandFg : C.textBody}
      />
      {item.label}
    </Link>
  );
}

function SidebarBrand({ onNavigate }: { onNavigate?: () => void }) {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href="/"
      onClick={onNavigate}
      aria-label="Go to Welcome"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex items-center gap-2.5 border-b px-5 py-5 transition-colors"
      style={{ borderColor: C.border, backgroundColor: hover ? C.hoverBg : undefined }}
    >
      <Lettermark height={26} />
      <div className="min-w-0">
        <p className="truncate text-[15px] font-semibold" style={{ color: C.textPrimary }}>
          Fiber Workspace
        </p>
        <p className="truncate text-[11px]" style={{ color: C.textMuted }}>
          Innovation modules
        </p>
      </div>
    </Link>
  );
}

function SidebarNav({ onNavigate }: { onNavigate?: () => void }) {
  const [location] = useLocation();
  return (
    <nav
      className="flex h-full flex-col"
      style={{ backgroundColor: C.surface }}
      aria-label="Workspace modules"
    >
      <SidebarBrand onNavigate={onNavigate} />

      <div className="flex-1 overflow-y-auto px-3 py-3">
        <p
          className="px-2 pb-2 text-[11px] font-medium uppercase tracking-wide"
          style={{ color: C.textMuted }}
        >
          Modules
        </p>
        <ul className="space-y-0.5">
          {NAV_ITEMS.map((item) => (
            <li key={item.href}>
              <NavLink item={item} active={isActive(item, location)} onNavigate={onNavigate} />
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      className="flex min-h-screen"
      style={{ backgroundColor: C.canvasBg, fontFamily: '"Poppins", "DM Sans", sans-serif' }}
    >
      {/* Desktop sidebar */}
      <aside
        className="sticky top-0 hidden h-screen w-64 shrink-0 border-r md:block"
        style={{ borderColor: C.border }}
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
          <aside
            className="absolute inset-y-0 left-0 w-64 border-r shadow-lg"
            style={{ borderColor: C.border }}
          >
            <SidebarNav onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Slim header (shared with the standalone Welcome layout) */}
        <WorkspaceHeader
          logoLink
          leading={
            <button
              type="button"
              aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
              onClick={() => setMobileOpen((open) => !open)}
              className="md:hidden"
              style={{ color: C.textPrimary }}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          }
        />

        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  );
}
