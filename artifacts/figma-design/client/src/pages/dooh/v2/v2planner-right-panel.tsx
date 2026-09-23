import { useEffect, useState } from "react";
import { ScreenData } from "../data";
import { Button } from "@/components/ui/button";
import { Download, Target } from "lucide-react";
import { ScreenTableV2 } from "./v2planner-screen-table";
import { EXCHANGE_RATES } from "./v2planner-sidebar";

interface Props {
  matchedScreens: ScreenData[];
  selectedScreens: ScreenData[];
  selectedScreenIds: Set<string>;
  budget: number | null;
  currency: "GBP" | "EUR" | "USD";
  onSelect: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onHover: (id: string | null) => void;
  highlightedScreenId?: string | null;
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

export function RightPanelV2({
  matchedScreens,
  selectedScreens,
  selectedScreenIds,
  budget,
  currency,
  onSelect,
  onSelectAll,
  onHover,
  highlightedScreenId
}: Props) {
  const [csvDownload, setCsvDownload] = useState<{ url: string; count: number } | null>(null);
  useEffect(() => {
    return () => { if (csvDownload) URL.revokeObjectURL(csvDownload.url); };
  }, [csvDownload]);

  const rate = EXCHANGE_RATES[currency] || 1;
  const currencySymbol = currency === "EUR" ? "€" : currency === "USD" ? "$" : "£";

  const screensToCalculate = selectedScreens.length > 0 ? selectedScreens : matchedScreens;
  
  const totalImpressions = screensToCalculate.reduce((acc, s) => acc + s.impressions, 0);
  const totalSpendGBP = screensToCalculate.reduce((acc, s) => acc + s.impressions / 1000 * s.cpm, 0);
  const totalSpend = totalSpendGBP * rate;
  const totalCpm = totalImpressions ? (totalSpend / totalImpressions * 1000) : 0;
  
  const budgetUtilization = budget ? (totalSpend / budget) * 100 : 0;

  const handleExport = () => {
    if (!screensToCalculate.length) return;
    
    const headers = [
      "Screen ID", "Publisher", "City", "Venue", "Impressions", "Format", "Resolution", "Latitude", "Longitude",
      "Currency", `CPM (${currencySymbol})`
    ];
    
    const escapeCsv = (str: string | number) => {
      const s = String(str);
      if (s.includes(',') || s.includes('"') || s.includes('\n')) {
        return `"${s.replace(/"/g, '""')}"`;
      }
      return s;
    };
    
    const rows = screensToCalculate.map(s => [
      escapeCsv(s.id),
      escapeCsv(s.publisher),
      escapeCsv(s.city),
      escapeCsv(s.venue),
      escapeCsv(s.impressions),
      escapeCsv(s.creativeFormat),
      escapeCsv(s.creativeRes),
      escapeCsv(s.lat),
      escapeCsv(s.lng),
      currency,
      escapeCsv((s.cpm * rate).toFixed(2))
    ].join(','));
    
    const csvContent = [headers.join(','), ...rows].join('\n');
    
    const blob = new Blob(["\ufeff", csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    setCsvDownload({ url, count: screensToCalculate.length });
    link.setAttribute("href", url);
    link.setAttribute("download", "DOOH-Shortlist.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full min-w-0 flex-1 bg-white flex flex-col">
      
      {csvDownload && <div role="status" className="px-4 py-2 text-xs bg-purple-50 text-purple-900">
        CSV ready: {csvDownload.count.toLocaleString()} screen{csvDownload.count === 1 ? "" : "s"}.{" "}
        <a href={csvDownload.url} download="DOOH-Shortlist.csv" className="underline font-semibold">Download CSV again</a>
      </div>}
      <div className="flex-1 flex flex-col min-h-0">
          <section className="shrink-0 p-5 border-b border-gray-200" aria-label="Plan Overview">
            <h2 className="font-semibold text-lg text-gray-900 mb-5">Plan Overview</h2>
            
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 items-start">
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <p className="text-xs text-gray-500 mb-1 font-medium">Matched Screens</p>
                <p className="text-2xl font-bold text-gray-900">{matchedScreens.length}</p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <p className="text-xs text-purple-600 mb-1 font-medium">Selected Screens</p>
                <p className="text-2xl font-bold text-purple-700">{selectedScreens.length}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1 font-medium">Est. Average CPM</p>
                <p className="text-xl font-semibold text-gray-900">{formatCurrency(totalCpm, currency)}</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mb-1 font-medium">Est. Impressions</p>
                <p className="text-xl font-semibold text-gray-900">{(totalImpressions / 1000000).toFixed(1)}M</p>
              </div>
              
              <div>
                <p className="text-xs text-gray-500 mb-1 font-medium">Est. Total Spend</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrencyZero(totalSpend, currency)}</p>
                
                {budget !== null && (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1.5">
                      <span className="font-medium text-gray-500">Budget Used</span>
                      <span className="font-semibold text-gray-700">{formatCurrencyZero(totalSpend, currency)} / {formatCurrencyZero(budget, currency)} ({budgetUtilization.toFixed(0)}%)</span>
                    </div>
                    <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden border border-gray-200">
                      <div 
                        className={`h-full rounded-full transition-all duration-500 ${budgetUtilization > 100 ? 'bg-red-500' : 'bg-purple-500'}`} 
                        style={{ width: `${Math.min(budgetUtilization, 100)}%` }} 
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          <div className="flex-1 overflow-hidden flex flex-col" style={{ height: 400, minHeight: 320, maxHeight: 600 }}>
            <ScreenTableV2 
              screens={matchedScreens}
              selectedScreenIds={selectedScreenIds}
              currency={currency}
              onSelect={onSelect}
              onSelectAll={onSelectAll}
              onHover={onHover}
              highlightedScreenId={highlightedScreenId}
            />
          </div>
      </div>
      
      {/* Global Actions - Always visible at bottom */}
      <div className="p-4 border-t border-gray-200 bg-gray-50 shrink-0 space-y-3">
        <div className="flex gap-3">
          <Button onClick={handleExport} disabled={!screensToCalculate.length} variant="outline" className="flex-1 flex items-center justify-center gap-2 bg-white text-gray-700 border-gray-300 hover:bg-gray-50">
            <Download className="w-4 h-4" /> ↓ Export CSV
          </Button>
          <Button disabled title="Activation not connected" className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white disabled:opacity-50 disabled:bg-gray-400">
            ➜ Activate
          </Button>
        </div>
        <p className="text-[11px] text-center text-gray-500 font-medium">Activation not connected.</p>
      </div>

    </div>
  );
}
