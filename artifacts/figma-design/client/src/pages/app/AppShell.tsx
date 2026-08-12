/* =========================================================================
 * Fiber Workspace — App Shell (thin layout for authenticated routes)
 *
 * Module switching now lives in the global header (WorkspaceHeader), so this
 * shell is intentionally thin: the global header over full-width content.
 * There is NO module-navigation sidebar. (The Design System explorer renders
 * its own internal component-list column, which is workspace-internal
 * navigation and lives inside DsLayout — not here.)
 *
 * COLOR CONVENTION: token-driven colors use inline style objects
 * (var(--token, fallbackHex)) — Tailwind arbitrary var()/rgba color classes can
 * silently fail. Layout / spacing / typography-size classes stay as utilities.
 * ========================================================================= */

import { type ReactNode } from "react";
import { WorkspaceHeader } from "./WorkspaceHeader";

// Token-driven colors (var(--token, fallbackHex)) — flip with [data-theme].
const C = {
  canvasBg: "var(--surface-background-lvl2,#f7f7fa)",
};

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div
      className="flex min-h-screen flex-col"
      style={{ backgroundColor: C.canvasBg, fontFamily: '"Poppins", "DM Sans", sans-serif' }}
    >
      {/* Global header (module switching + theme + user). Always visible. */}
      <WorkspaceHeader />

      <main className="min-w-0 flex-1">{children}</main>
    </div>
  );
}
