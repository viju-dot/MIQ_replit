import { ScreenData } from "../data";
import { Button } from "@/components/ui/button";
import * as XLSX from "xlsx";
import { format } from "date-fns";
import { Download, Target } from "lucide-react";

interface Props {
  matchedScreens: ScreenData[];
  selectedScreens: ScreenData[];
  budget: number | null;
}

export function PlanOverview({ matchedScreens, selectedScreens, budget }: Props) {
  
  const screensToCalculate = selectedScreens.length > 0 ? selectedScreens : matchedScreens;
  
  const totalImpressions = screensToCalculate.reduce((acc, s) => acc + s.impressions, 0);
  // Demo assumes purchase of each screen's full modelled impression inventory.
  const totalSpend = screensToCalculate.reduce((acc, s) => acc + s.impressions / 1000 * s.cpm, 0);
  const totalCpm = totalImpressions ? totalSpend / totalImpressions * 1000 : 0;
  
  const budgetUtilization = budget ? (totalSpend / budget) * 100 : 0;
  
  const handleExport = () => {
    const data = screensToCalculate.map(s => ({
      "Screen ID": s.id,
      "Publisher": s.publisher,
      "City": s.city,
      "Venue": s.venue,
      "CPM (£)": s.cpm,
      "Impressions": s.impressions,
      "Format": s.creativeFormat,
      "Resolution": s.creativeRes,
      "Latitude": s.lat,
      "Longitude": s.lng
    }));
    
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Screens");
    XLSX.writeFile(wb, `DOOH-Shortlist-${format(new Date(), 'yyyy-MM-dd')}.xlsx`);
  };

  return (
    <div className="dooh-overview w-[280px] shrink-0 bg-white flex flex-col shadow-[-2px_0_12px_rgba(0,0,0,0.03)] z-20">
      <div className="p-4 border-b border-[var(--surface-background-lvl4,#e1e1e8)] bg-[var(--surface-background-lvl2,#f7f7fa)]">
        <h2 className="font-semibold text-[16px]">Plan Overview</h2>
        <p className="text-xs text-gray-600 mt-1">{selectedScreens.length ? "Summary of selected screens" : "Summary of matched screens"}</p>
      </div>
      
      <div className="p-5 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <p className="text-xs text-gray-500 mb-1">Matched</p>
            <p className="text-xl font-bold">{matchedScreens.length}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Selected</p>
            <p className="text-xl font-bold text-[var(--colours-blue-300,#d194ff)]">{selectedScreens.length}</p>
          </div>
        </div>
        <p className="text-xs text-gray-600 mt-4">Demo estimates: spend totals each screen’s impressions × CPM ÷ 1,000. CPM is impression-weighted; no live inventory or booking.</p>
        
        <div className="space-y-4">
          <div className="p-3 bg-gray-50 rounded border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Est. Average CPM</p>
            <p className="text-lg font-semibold">£{totalCpm.toFixed(2)}</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Est. Total Impressions</p>
            <p className="text-lg font-semibold">{(totalImpressions / 1000000).toFixed(1)}M</p>
          </div>
          
          <div className="p-3 bg-gray-50 rounded border border-gray-100">
            <p className="text-xs text-gray-500 mb-1">Est. Total Spend</p>
            <p className="text-lg font-semibold text-green-600">£{totalSpend.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
          </div>
          
          {budget && (
            <div className="pt-2">
              <div className="flex justify-between text-xs mb-1.5">
                <span className="font-medium text-gray-600">Budget Utilization</span>
                <span className="font-bold">{budgetUtilization.toFixed(0)}%</span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full ${budgetUtilization > 100 ? 'bg-red-500' : 'bg-[var(--colours-blue-300,#d194ff)]'}`} 
                  style={{ width: `${Math.min(budgetUtilization, 100)}%` }} 
                />
              </div>
              <p className="text-[10px] text-gray-500 mt-1 text-right">of £{budget.toLocaleString()}</p>
            </div>
          )}
        </div>
      </div>
      
      <div className="p-4 border-t border-[var(--surface-background-lvl4,#e1e1e8)] space-y-2">
        <Button onClick={handleExport} disabled={!screensToCalculate.length} variant="outline" className="w-full flex items-center gap-2">
          <Download className="w-4 h-4" /> Export {selectedScreens.length > 0 ? 'Selected' : 'All'}
        </Button>
        <Button disabled title="Campaign activation is outside this prototype" className="w-full flex items-center gap-2 bg-[var(--surface-background-miq,#2b0030)] hover:bg-[#440140] text-white">
          <Target className="w-4 h-4" /> Activate
        </Button>
        <p className="text-xs text-center text-gray-600 mt-2">Activation is planned for a future DSP integration.</p>
      </div>
    </div>
  );
}
