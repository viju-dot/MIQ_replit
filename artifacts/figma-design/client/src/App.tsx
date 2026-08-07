import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { DsLayout } from "@/components/DsLayout";
import { ThemeProvider } from "@/lib/theme";

// Standalone TV Audience Intelligence product page — rendered OUTSIDE the
// design-system explorer layout (no explorer sidebar), with its own Fiber
// navigation header.
const TvAudienceApp = lazy(() => import("@/pages/TvAudienceApp"));

function Router() {
  return (
    <Switch>
      {/* Dedicated standalone route BEFORE the /:slug explorer catch-all. */}
      <Route path="/tv-audience-intelligence">
        <Suspense fallback={null}>
          <TvAudienceApp />
        </Suspense>
      </Route>
      <Route path="/" component={DsLayout} />
      <Route path="/:slug" component={DsLayout} />
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
