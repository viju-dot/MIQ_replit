/* =========================================================================
 * MIQ Collaborative Frameworks — header module-switching nav model
 *
 * The nav data + type live in this non-component module so WorkspaceHeader.tsx
 * only exports React components. That keeps WorkspaceHeader compatible with
 * Vite React Fast Refresh (a mixed component + constant export forces a full
 * page reload on every edit).
 * ========================================================================= */

/** Module-switching nav links, shared across the whole workspace. */
export interface HeaderNavItem {
  href: string;
  label: string;
  /** Marks the link active for the current path. */
  match: (path: string) => boolean;
  /** Module not yet available — rendered inert with a "Coming soon" hint. */
  comingSoon?: boolean;
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
    href: "/screen-templates",
    label: "Screen Templates",
    match: (p) => p === "/screen-templates" || p.startsWith("/screen-templates/"),
  },
  {
    href: "/flow-chart",
    label: "Flow Chart",
    match: (p) => p === "/flow-chart" || p.startsWith("/flow-chart/"),
    comingSoon: true,
  },
  {
    href: "/usability-testing",
    label: "Usability Testing",
    match: (p) => p === "/usability-testing" || p.startsWith("/usability-testing/"),
    comingSoon: true,
  },
];
