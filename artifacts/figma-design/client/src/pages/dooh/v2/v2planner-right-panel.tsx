import { ScreenData } from "../data";
import { Button } from "@/components/ui/button";
import { EXCHANGE_RATES } from "./v2planner-sidebar";
import { MetricsTile } from "@/components/ds/MetricsTile";
import { SmartCard } from "./primitives";

interface Props {
  matchedScreens: ScreenData[];
  selectedScreens: ScreenData[];
  budget: number | null;
  currency: "GBP" | "EUR" | "USD";
}

const formatCurrency = (amount: number, currency: "GBP" | "EUR" | "USD") => {
  if (currency === "GBP") return `£${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (currency === "EUR") return `€${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  if (currency === "USD") return `$${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  return `£${amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const formatCurrencyZero = (amount: number, currency: "GBP" | "EUR" | "USD") => {
  if (currency === "GBP") return `£${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (currency === "EUR") return `€${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  if (currency === "USD") return `$${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
  return `£${amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}`;
};

export function PlanOverviewCards({
  matchedScreens,
  selectedScreens,
  budget,
  currency,
  layout = "horizontal"
}: {
  matchedScreens: ScreenData[];
  selectedScreens: ScreenData[];
  budget: number | null;
  currency: "GBP" | "EUR" | "USD";
  layout?: "horizontal" | "vertical";
}) {
  const rate = EXCHANGE_RATES[currency] || 1;

  const screensToCalculate = selectedScreens.length > 0 ? selectedScreens : matchedScreens;
  
  const totalImpressions = screensToCalculate.reduce((acc, s) => acc + s.impressions, 0);
  const totalSpendGBP = screensToCalculate.reduce((acc, s) => acc + s.impressions / 1000 * s.cpm, 0);
  const totalSpend = totalSpendGBP * rate;
  const totalCpm = totalImpressions ? (totalSpend / totalImpressions * 1000) : 0;
  
  const budgetUtilization = budget ? (totalSpend / budget) * 100 : 0;

  return (
    <div className={`grid gap-4 items-start ${layout === "horizontal" ? "grid-cols-2 lg:grid-cols-5" : "grid-cols-1"}`}>
      <MetricsTile 
        descriptionText="Matched Screens"
        metricValue={String(matchedScreens.length)}
        showIcon={false}
        fullWidth
      />
      <MetricsTile 
        descriptionText="Selected Screens"
        metricValue={String(selectedScreens.length)}
        showIcon={false}
        fullWidth
        state={selectedScreens.length > 0 ? "Selected" : "Default"}
      />
      <MetricsTile 
        descriptionText="Est. Average CPM"
        metricValue={formatCurrency(totalCpm, currency)}
        showIcon={false}
        fullWidth
      />
      <MetricsTile 
        descriptionText="Est. Impressions"
        metricValue={(totalImpressions / 1000000).toFixed(1) + "M"}
        showIcon={false}
        fullWidth
      />
      <MetricsTile 
        descriptionText="Est. Total Spend"
        metricValue={formatCurrencyZero(totalSpend, currency)}
        badgeText={budget !== null ? `${budgetUtilization.toFixed(0)}% budget used` : undefined}
        showIcon={false}
        fullWidth
      />
    </div>
  );
}

export function RightPanelV2({
  matchedScreens,
  selectedScreens,
  budget,
  currency
}: Props) {
  return (
    <div className="w-full min-w-0 flex-1 bg-[var(--surface-background-lvl1,#ffffff)] flex flex-col">
      <div className="flex-1 flex flex-col min-h-0 overflow-y-auto dooh-scrollbar p-6">
        <SmartCard title="Plan Overview" ariaLabel="Plan Overview">
          <PlanOverviewCards 
            matchedScreens={matchedScreens} 
            selectedScreens={selectedScreens} 
            budget={budget} 
            currency={currency} 
            layout="horizontal" 
          />
        </SmartCard>
      </div>
      
      {/* Global Actions - Always visible at bottom */}
      <div className="p-4 border-t border-[var(--border-static-subtle-neutral,#e1e1e8)] bg-[var(--surface-background-lvl2,#f7f7fa)] shrink-0 space-y-3">
        <div className="flex gap-3">
          <Button disabled title="Activation not connected" className="flex-1 flex items-center justify-center gap-2 bg-[var(--container-dynamic-brand-bold-background-default,#7c33b5)] hover:bg-[var(--container-dynamic-brand-bold-background-hover,#702ea3)] text-[var(--container-dynamic-brand-bold-foreground-default,#ffffff)] disabled:opacity-50 disabled:bg-[var(--container-dynamic-neutral-subtle-background-disabled,#c6c6cc)]">
            ➜ Activate
          </Button>
        </div>
        <p className="text-[11px] text-center text-[var(--surface-foreground-static-neutral-lvl3,#717180)] font-medium">Activation not connected.</p>
      </div>
    </div>
  );
}
