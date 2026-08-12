/* =========================================================================
 * Fiber Workspace — application root & routing
 *
 * Multi-module workspace behind a client-side prototype auth gate.
 *
 * MODULES (each a lazy-loaded page under pages/app/):
 *   Dashboard (/) → Design System (/design-system) → AI Prototype
 *   (/ai-prototype) → Flow Chart (/flow-chart) → Usability Testing
 *   (/usability-testing).
 *
 * FUTURE WORKFLOW (structure only, not implemented): components curated in the
 * Design System feed AI Prototype generation; those prototypes are mapped as
 * flows in Flow Chart and validated in Usability Testing.
 *
 * ROUTING NOTES:
 *   - All app routes render inside <AppShell> and are wrapped by <RequireAuth>.
 *   - /tv-audience-intelligence is auth-gated but rendered OUTSIDE the shell
 *     (it has its own Fiber product navigation).
 *   - Legacy /:slug design-system links redirect to /design-system/:slug.
 *     Specific routes are registered BEFORE the catch-all redirect.
 * ========================================================================= */

import { lazy, Suspense, type ReactNode, type ComponentType } from "react";
import { Switch, Route, Redirect, useParams } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DsLayout } from "@/components/DsLayout";
import { ThemeProvider } from "@/lib/theme";
import { AppShell } from "@/pages/app/AppShell";
import { useAuth } from "@/pages/app/auth";
import { getPage } from "@/pages/registry";

const LoginPage = lazy(() => import("@/pages/app/LoginPage"));
const DashboardPage = lazy(() => import("@/pages/app/DashboardPage"));
const AiPrototypePage = lazy(() => import("@/pages/app/AiPrototypePage"));
const FlowChartPage = lazy(() => import("@/pages/app/FlowChartPage"));
const UsabilityTestingPage = lazy(() => import("@/pages/app/UsabilityTestingPage"));
const FlowChartContextPage = lazy(() => import("@/pages/app/FlowChartContextPage"));
const UsabilityTestingContextPage = lazy(
  () => import("@/pages/app/UsabilityTestingContextPage"),
);

// Standalone TV Audience Intelligence product page — auth-gated but rendered
// OUTSIDE the app shell (it has its own Fiber navigation header).
const TvAudienceApp = lazy(() => import("@/pages/TvAudienceApp"));

// Public shared-prototype view — NOT auth-gated, no shell/global header.
const SharePage = lazy(() => import("@/pages/app/SharePage"));

/** Redirect unauthenticated users to /login. */
function RequireAuth({ children }: { children: ReactNode }) {
  const authed = useAuth();
  if (!authed) return <Redirect to="/login" replace />;
  return <>{children}</>;
}

/** Wrap a page component in the persistent authenticated app shell. */
function shell(Page: ComponentType) {
  return (
    <RequireAuth>
      <AppShell>
        <Suspense fallback={null}>
          <Page />
        </Suspense>
      </AppShell>
    </RequireAuth>
  );
}

/** Legacy /:slug → /design-system/:slug redirect (only for known slugs). */
function LegacySlugRedirect() {
  const params = useParams();
  const slug = params.slug;
  if (slug && getPage(slug)) return <Redirect to={`/design-system/${slug}`} />;
  // Unknown top-level path → send to dashboard.
  return <Redirect to="/" />;
}

/** Login route: authenticated users get bounced to the dashboard. */
function LoginGate() {
  const authed = useAuth();
  if (authed) return <Redirect to="/" replace />;
  return (
    <Suspense fallback={null}>
      <LoginPage />
    </Suspense>
  );
}

function Router() {
  return (
    <Switch>
      {/* Login: authenticated users get bounced to the dashboard. */}
      <Route path="/login" component={LoginGate} />

      {/* PUBLIC shared-prototype view — NOT behind RequireAuth. Registered
          before the /:slug catch-all so it always matches first. */}
      <Route path="/share/:token">
        <Suspense fallback={null}>
          <SharePage />
        </Suspense>
      </Route>

      {/* Standalone product experience (auth-gated, outside the shell). */}
      <Route path="/tv-audience-intelligence">
        <RequireAuth>
          <Suspense fallback={null}>
            <TvAudienceApp />
          </Suspense>
        </RequireAuth>
      </Route>

      {/* Welcome / module selection — standalone (no sidebar), still auth-gated. */}
      <Route path="/">
        <RequireAuth>
          <Suspense fallback={null}>
            <DashboardPage />
          </Suspense>
        </RequireAuth>
      </Route>

      {/* Design System explorer (module root + component slug). */}
      <Route path="/design-system">{shell(DsLayout)}</Route>
      <Route path="/design-system/:slug">{shell(DsLayout)}</Route>

      {/* AI Prototype — the central workspace. */}
      <Route path="/ai-prototype">{shell(AiPrototypePage)}</Route>

      {/* Prototype-scoped context views — registered BEFORE the bare module
          landings and the /:slug catch-all so they always match first. */}
      <Route path="/flow-chart/:prototypeId">{shell(FlowChartContextPage)}</Route>
      <Route path="/usability-testing/:prototypeId">
        {shell(UsabilityTestingContextPage)}
      </Route>

      {/* Bare module landing pages (list prototypes as entry points). */}
      <Route path="/flow-chart">{shell(FlowChartPage)}</Route>
      <Route path="/usability-testing">{shell(UsabilityTestingPage)}</Route>

      {/* Legacy /:slug catch-all → registered LAST so it never shadows the
          specific routes above. */}
      <Route path="/:slug" component={LegacySlugRedirect} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <ThemeProvider>
          <Toaster />
          <Router />
        </ThemeProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
