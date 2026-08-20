/* =========================================================================
 * Fiber Workspace — application root & routing
 *
 * Multi-module workspace. There is NO login gate — opening the app goes
 * straight to the Welcome screen (route /).
 *
 * MODULES (each a lazy-loaded page under pages/app/):
 *   Welcome (/) → Design System (/design-system) → AI Prototype
 *   (/ai-prototype). Flow Chart and Usability Testing are not yet active
 *   ("Coming soon"); their routes redirect back to Welcome.
 *
 * FUTURE WORKFLOW (structure only, not implemented): components curated in the
 * Design System feed AI Prototype generation; those prototypes are mapped as
 * flows in Flow Chart and validated in Usability Testing.
 *
 * ROUTING NOTES:
 *   - Most app routes render inside <AppShell>.
 *   - /tv-audience-intelligence is rendered OUTSIDE the shell (it has its own
 *     Fiber product navigation).
 *   - /flow-chart and /usability-testing (+ context sub-routes) redirect to
 *     Welcome — those modules are inactive ("Coming soon").
 *   - Legacy /:slug design-system links redirect to /design-system/:slug.
 *     Specific routes are registered BEFORE the catch-all redirect.
 * ========================================================================= */

import { lazy, Suspense, type ComponentType } from "react";
import { Switch, Route, Redirect, useParams } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DsLayout } from "@/components/DsLayout";
import { ThemeProvider } from "@/lib/theme";
import { AppShell } from "@/pages/app/AppShell";
import { getPage } from "@/pages/registry";

const DashboardPage = lazy(() => import("@/pages/app/DashboardPage"));
const AiPrototypePage = lazy(() => import("@/pages/app/AiPrototypePage"));
const ScreenTemplatesPage = lazy(() => import("@/pages/app/ScreenTemplatesPage"));
const ScreenTemplateDetailPage = lazy(() =>
  import("@/pages/app/ScreenTemplatesPage").then((m) => ({
    default: m.ScreenTemplateDetailPage,
  })),
);

// Standalone TV Audience Intelligence product page — rendered OUTSIDE the app
// shell (it has its own Fiber navigation header).
const TvAudienceApp = lazy(() => import("@/pages/TvAudienceApp"));

// Public shared-prototype view — no shell/global header.
const SharePage = lazy(() => import("@/pages/app/SharePage"));

/** Wrap a page component in the persistent app shell. */
function shell(Page: ComponentType) {
  return (
    <AppShell>
      <Suspense fallback={null}>
        <Page />
      </Suspense>
    </AppShell>
  );
}

/** Legacy /:slug → /design-system/:slug redirect (only for known slugs). */
function LegacySlugRedirect() {
  const params = useParams();
  const slug = params.slug;
  if (slug && getPage(slug)) return <Redirect to={`/design-system/${slug}`} />;
  // Unknown top-level path → send to Welcome.
  return <Redirect to="/" />;
}

function Router() {
  return (
    <Switch>
      {/* PUBLIC shared-prototype view. Registered before the /:slug catch-all
          so it always matches first. */}
      <Route path="/share/:token">
        <Suspense fallback={null}>
          <SharePage />
        </Suspense>
      </Route>

      {/* Standalone product experience (outside the shell). */}
      <Route path="/tv-audience-intelligence">
        <Suspense fallback={null}>
          <TvAudienceApp />
        </Suspense>
      </Route>

      {/* Welcome / module selection — standalone (no sidebar), launch screen. */}
      <Route path="/">
        <Suspense fallback={null}>
          <DashboardPage />
        </Suspense>
      </Route>

      {/* Design System explorer (module root + component slug). */}
      <Route path="/design-system">{shell(DsLayout)}</Route>
      <Route path="/design-system/:slug">{shell(DsLayout)}</Route>

      {/* AI Prototype — the central workspace. */}
      <Route path="/ai-prototype">{shell(AiPrototypePage)}</Route>

      {/* Screen Templates — read-only reference library. The detail route is
          registered BEFORE the gallery landing so it always matches first. */}
      <Route path="/screen-templates/:id">{shell(ScreenTemplateDetailPage)}</Route>
      <Route path="/screen-templates">{shell(ScreenTemplatesPage)}</Route>

      {/* Flow Chart & Usability Testing are inactive ("Coming soon"). Their
          routes (including prototype-scoped context views) redirect to Welcome
          so they are unreachable. Registered BEFORE the /:slug catch-all. */}
      <Route path="/flow-chart/:prototypeId">
        <Redirect to="/" />
      </Route>
      <Route path="/usability-testing/:prototypeId">
        <Redirect to="/" />
      </Route>
      <Route path="/flow-chart">
        <Redirect to="/" />
      </Route>
      <Route path="/usability-testing">
        <Redirect to="/" />
      </Route>

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
