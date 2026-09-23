import { useState, type ChangeEvent, type ReactNode } from "react";
import { Link } from "wouter";
import { Clock, Info, LayoutDashboard, Map, MapPin, MonitorPlay, Target, Upload, Wallet, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAudiences, useIncrementAudienceUse } from "../api";
import { CREATIVE_FORMATS, DAYPART_PRESETS, MOCK_POIS, PUBLISHERS, RESOLUTIONS, VENUES } from "../data";
import { parseCoordinateCsv, parsePostcodeCsv, type UploadReport } from "../uploadHelpers";
import { FiberSlider } from "./primitives";
import { FiberRoundedTabsBar, FiberTabButton } from "@/components/FiberTabItem";
import { PoiSearch } from "./PoiSearch";

export interface PlanningZone {
  id: string;
  type: "circle" | "polygon";
  center?: { lat: number; lng: number };
  radius?: number;
  points?: Array<{ lat: number; lng: number }>;
  label?: string;
}

export interface FilterStateV2 {
  location: {
    enabled: boolean;
    method: "audience" | "postcode" | "poi" | "latlng";
    audienceId: string;
    postcode: string;
    poiId: string;
    radius: number | "";
    radiusUnit: "m" | "km";
    uploadedPoints: Array<{ lat: number; lng: number }>;
  };
  planningZone: { enabled: boolean; zones: PlanningZone[]; drawMode: "circle" | "polygon" | null };
  venueType: { enabled: boolean; venues: string[] };
  publishers: { enabled: boolean; publishers: string[] };
  daypart: {
    enabled: boolean;
    applies: "Every Day" | "Weekdays" | "Weekends";
    mode: "presets" | "custom";
    presets: string[];
    customStart: string;
    customEnd: string;
  };
  budget: { enabled: boolean; currency: "GBP" | "EUR" | "USD"; total: number | ""; cpm: number | "" | null };
  creativeType: { enabled: boolean; format: string; resolution: string; customWidth: string; customHeight: string };
}

export const DEFAULT_FILTERS_V2: FilterStateV2 = {
  location: { enabled: true, method: "audience", audienceId: "", postcode: "", poiId: "", radius: 500, radiusUnit: "m", uploadedPoints: [] },
  planningZone: { enabled: false, zones: [], drawMode: null },
  venueType: { enabled: false, venues: [] },
  publishers: { enabled: false, publishers: [] },
  daypart: { enabled: false, applies: "Every Day", mode: "presets", presets: [], customStart: "09:00", customEnd: "17:00" },
  budget: { enabled: false, currency: "GBP", total: 50000, cpm: null },
  creativeType: { enabled: false, format: "", resolution: "", customWidth: "", customHeight: "" },
};

export const EXCHANGE_RATES = { GBP: 1, EUR: 1.17, USD: 1.25 };

interface Props {
  filters: FilterStateV2;
  setFilters: React.Dispatch<React.SetStateAction<FilterStateV2>>;
}

function Report({ report }: { report: UploadReport | null }) {
  if (!report) return null;
  return (
    <div className="rounded bg-gray-50 p-2 text-[11px] space-y-1" role="status">
      <p className="font-medium text-green-700">{report.valid} valid row{report.valid === 1 ? "" : "s"}</p>
      {!!report.unknown.length && <p className="text-amber-700">Unknown: {report.unknown.slice(0, 6).join(", ")}{report.unknown.length > 6 ? "…" : ""}</p>}
      {!!report.malformed.length && <p className="text-red-600">Malformed: {report.malformed.slice(0, 6).join(", ")}{report.malformed.length > 6 ? "…" : ""}</p>}
      {!!report.duplicates.length && <p className="text-amber-700">Duplicates: {report.duplicates.slice(0, 6).join(", ")}{report.duplicates.length > 6 ? "…" : ""}</p>}
    </div>
  );
}

function FilePicker({ accept, label, onFile }: { accept: string; label: string; onFile: (file: File) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-center gap-2 rounded border-2 border-dashed border-gray-200 p-3 text-xs text-gray-600 hover:border-purple-300">
      <Upload className="h-4 w-4" /> {label}
      <input className="sr-only" type="file" accept={accept} onChange={e => {
        const file = e.target.files?.[0];
        if (file) onFile(file);
        e.currentTarget.value = "";
      }} />
    </label>
  );
}

export function SidebarV2({ filters, setFilters }: Props) {
  const { data: audiences, isError } = useAudiences();
  const incrementUse = useIncrementAudienceUse();
  const [uploadError, setUploadError] = useState("");
  const [locationReport, setLocationReport] = useState<UploadReport | null>(null);

  const updateSection = <K extends keyof FilterStateV2>(section: K, data: Partial<FilterStateV2[K]>) => {
    setFilters(prev => ({ ...prev, [section]: { ...prev[section], ...data } }));
  };
  const selectedAudience = audiences?.find(a => a.id === filters.location.audienceId);
  
  const resolutionError = filters.creativeType.resolution === "custom" && (
    !/^\d+$/.test(filters.creativeType.customWidth) || !/^\d+$/.test(filters.creativeType.customHeight) ||
    Number(filters.creativeType.customWidth) < 1 || Number(filters.creativeType.customWidth) > 16384 ||
    Number(filters.creativeType.customHeight) < 1 || Number(filters.creativeType.customHeight) > 16384
  );

  const readUpload = async (event: ChangeEvent<HTMLInputElement>, parser: (file: File) => Promise<{ points: Array<{lat: number; lng: number}>; report: UploadReport }>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      setUploadError("");
      const result = await parser(file);
      updateSection("location", { uploadedPoints: result.points });
      setLocationReport(result.report);
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Could not read this file.");
      setLocationReport(null);
      updateSection("location", { uploadedPoints: [] });
    }
    event.target.value = "";
  };

  return (
    <div data-annotate="DOOH filter panel" className="w-[300px] xl:w-[340px] shrink-0 bg-white flex flex-col z-20 border-r border-gray-200">
      <div className="flex-1">
        
        {/* 1. Location Filter */}
        <FilterCard title="Location" icon={<MapPin className="w-4 h-4" />} enabled={filters.location.enabled} onToggle={enabled => updateSection("location", { enabled })}>
          <div className="mb-4 pt-1 pb-1 max-w-full overflow-x-auto" role="group" aria-label="Location filter method">
            <FiberRoundedTabsBar wrap={false}>
              {(["audience", "postcode", "poi", "latlng"] as const).map(method => (
                <FiberTabButton
                  key={method}
                  label={method === "audience" ? "Saved Audience" : method === "postcode" ? "Postcode" : method === "poi" ? "POI" : "Lat/Long"}
                  selected={filters.location.method === method}
                  onClick={() => {
                    updateSection("location", { method, uploadedPoints: [] });
                    setLocationReport(null);
                    setUploadError("");
                  }}
                />
              ))}
            </FiberRoundedTabsBar>
          </div>
          {filters.location.method === "audience" && <div className="space-y-3">
            {!selectedAudience ? (
              <>
                <label className="text-xs font-medium block text-gray-700">Select Saved Audience</label>
                <Select value={filters.location.audienceId} onValueChange={id => { updateSection("location", { audienceId: id }); incrementUse.mutate(id); }}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Choose an audience" /></SelectTrigger>
                  <SelectContent>
                    {isError && <SelectItem value="error" disabled>Error loading audiences</SelectItem>}
                    {audiences?.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </>
            ) : (
              <div className="rounded border border-purple-200 bg-purple-50 p-3 relative">
                <button 
                  onClick={() => updateSection("location", { audienceId: "" })}
                  className="absolute top-2 right-2 text-gray-400 hover:text-red-500"
                  aria-label="Remove audience selection"
                >
                  <X className="h-3 w-3" />
                </button>
                <h4 className="text-sm font-medium text-purple-900 pr-4">{selectedAudience.name}</h4>
                {selectedAudience.description && <p className="text-xs text-purple-700 mt-1">{selectedAudience.description}</p>}
                <p className="text-[11px] text-purple-600 mt-2 font-medium">Coverage: {selectedAudience.coverage}</p>
              </div>
            )}
          </div>}
          
          {filters.location.method === "postcode" && <div className="space-y-2">
            <FilePicker accept=".csv,text/csv" label="Upload postcode CSV" onFile={file => {
              const target = { files: [file], value: "" } as unknown as HTMLInputElement;
              void readUpload({ target } as ChangeEvent<HTMLInputElement>, parsePostcodeCsv);
            }} />
            <Report report={locationReport} />
          </div>}
          
          {filters.location.method === "poi" && <div className="space-y-2">
            <PoiSearch value={filters.location.poiId} onChange={poiId => updateSection("location", { poiId })} />
          </div>}
          
          {filters.location.method === "latlng" && <div className="space-y-2">
            <FilePicker accept=".csv,text/csv" label="Upload coordinate CSV" onFile={async file => {
              try {
                setUploadError("");
                const result = await parseCoordinateCsv(file);
                updateSection("location", { uploadedPoints: result.points });
                setLocationReport(result.report);
              } catch (error) {
                setUploadError(error instanceof Error ? error.message : "Could not read this file.");
                updateSection("location", { uploadedPoints: [] });
                setLocationReport(null);
              }
            }} />
            <Report report={locationReport} />
          </div>}
          
          {uploadError && <p className="text-[11px] text-red-600 mt-2" role="alert">{uploadError}</p>}
          
          <div className="mt-4 pt-4 border-t border-gray-100">
             <div className="flex items-center justify-between mb-3">
               <label className="text-xs font-medium text-gray-700">Radius around points</label>
               <Select value={filters.location.radiusUnit} onValueChange={(val: "m"|"km") => {
                 let current = Number(filters.location.radius) || (val === "km" ? 0.5 : 500);
                 if (val === "km" && filters.location.radiusUnit === "m") {
                   current = Math.min(10, Math.max(0.05, current / 1000));
                 } else if (val === "m" && filters.location.radiusUnit === "km") {
                   current = Math.min(10000, Math.max(50, current * 1000));
                 }
                 updateSection("location", { radiusUnit: val, radius: current });
               }}>
                 <SelectTrigger className="h-6 w-[85px] text-[11px]"><SelectValue /></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="m" className="text-[11px]">meters</SelectItem>
                   <SelectItem value="km" className="text-[11px]">kilometers</SelectItem>
                 </SelectContent>
               </Select>
             </div>
             
             <div className="flex items-center gap-4">
               <div className="flex-1 mt-1">
                 <FiberSlider 
                   value={Number(filters.location.radius) || (filters.location.radiusUnit === "km" ? 0.05 : 50)} 
                   min={filters.location.radiusUnit === "km" ? 0.05 : 50} 
                   max={filters.location.radiusUnit === "km" ? 10 : 10000} 
                   step={filters.location.radiusUnit === "km" ? 0.05 : 50} 
                   onChange={v => updateSection("location", { radius: v })} 
                   ariaLabel="Radius slider"
                 />
               </div>
               <div className="w-[60px]">
                 <Input 
                   type="number" 
                   aria-label="Exact radius"
                   min={filters.location.radiusUnit === "km" ? 0.05 : 50}
                   max={filters.location.radiusUnit === "km" ? 10 : 10000}
                   step="any"
                   value={filters.location.radius} 
                   onChange={e => {
                     const v = e.target.value;
                     if (v === "") {
                       updateSection("location", { radius: "" });
                     } else {
                       const max = filters.location.radiusUnit === "km" ? 10 : 10000;
                       const min = filters.location.radiusUnit === "km" ? 0.05 : 50;
                       updateSection("location", { radius: Math.max(min, Math.min(max, Number(v))) });
                     }
                   }} 
                   className="h-7 text-xs px-2" 
                 />
               </div>
             </div>
          </div>
        </FilterCard>

        {/* 2. Planning Zone */}
        <FilterCard title="Planning Zone" icon={<Map className="w-4 h-4" />} enabled={filters.planningZone.enabled} onToggle={enabled => updateSection("planningZone", { enabled, drawMode: enabled ? filters.planningZone.drawMode : null })}>
          <div className="space-y-3">
             <Button size="sm" variant="secondary" className="w-full bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200" onClick={() => updateSection("planningZone", { drawMode: filters.planningZone.drawMode ? null : "circle" })}>
              {filters.planningZone.drawMode ? "Cancel Drawing" : "Draw on Map"}
            </Button>
            <Select value={filters.planningZone.drawMode ?? "circle"} onValueChange={(value: "circle" | "polygon") => updateSection("planningZone", { drawMode: value })}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="circle">Circle</SelectItem><SelectItem value="polygon">Polygon</SelectItem></SelectContent>
            </Select>
            <div className="space-y-1">
              {filters.planningZone.zones.map((zone, index) => <div key={zone.id} className="flex items-center justify-between rounded bg-gray-50 p-2 text-xs border border-gray-100">
                <span className="text-gray-600 truncate mr-2" title={zone.label || `Zone ${index + 1}`}>
                  {zone.label || `Zone ${index + 1}: ${zone.type === "circle" ? `${Math.round(zone.radius ?? 0)}m circle` : `${zone.points?.length ?? 0}-pt poly`}`}
                </span>
                <button aria-label={`Remove zone ${index + 1}`} className="text-gray-400 hover:text-red-500 shrink-0" onClick={() => updateSection("planningZone", { zones: filters.planningZone.zones.filter(z => z.id !== zone.id) })}><X className="h-3 w-3" /></button>
              </div>)}
            </div>
          </div>
        </FilterCard>

        {/* 3. Venue Type */}
        <ScalarFacet title="Venue Type" icon={<LayoutDashboard className="w-4 h-4" />} enabled={filters.venueType.enabled} values={VENUES} selected={filters.venueType.venues}
          onToggle={enabled => updateSection("venueType", { enabled })} onSelected={venues => updateSection("venueType", { venues })} />
        
        {/* 4. Publisher */}
        <ScalarFacet title="Publisher" icon={<Target className="w-4 h-4" />} enabled={filters.publishers.enabled} values={PUBLISHERS} selected={filters.publishers.publishers}
          onToggle={enabled => updateSection("publishers", { enabled })} onSelected={publishers => updateSection("publishers", { publishers })} />

        {/* 5. Day Part */}
        <FilterCard title="Day Part" icon={<Clock className="w-4 h-4" />} enabled={filters.daypart.enabled} onToggle={enabled => updateSection("daypart", { enabled })}>
          <div className="space-y-3">
            <div className="flex rounded bg-gray-100 p-1">{(["presets", "custom"] as const).map(mode => <button key={mode} onClick={() => updateSection("daypart", { mode })} className={`flex-1 rounded py-1 text-xs font-medium ${filters.daypart.mode === mode ? "bg-white shadow text-gray-900" : "text-gray-500"}`}>{mode === "presets" ? "Presets" : "Custom"}</button>)}</div>
            {filters.daypart.mode === "presets" ? <div className="grid grid-cols-2 gap-2">{DAYPART_PRESETS.map(preset => <button key={preset} onClick={() => updateSection("daypart", { presets: filters.daypart.presets.includes(preset) ? filters.daypart.presets.filter(p => p !== preset) : [...filters.daypart.presets, preset] })} className={`rounded border py-1.5 text-[11px] transition-colors ${filters.daypart.presets.includes(preset) ? "border-purple-600 bg-purple-50 text-purple-700 font-medium" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}>{preset}</button>)}</div>
              : (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Input aria-label="Start time" type="time" value={filters.daypart.customStart} onChange={e => updateSection("daypart", { customStart: e.target.value })} className="h-8 text-sm" />
                    <span>to</span>
                    <Input aria-label="End time" type="time" value={filters.daypart.customEnd} onChange={e => updateSection("daypart", { customEnd: e.target.value })} className="h-8 text-sm" />
                  </div>
                  {filters.daypart.customStart >= filters.daypart.customEnd && (
                    <p className="text-[10px] text-red-600 mt-1">Start time must be before end time. Overnight ranges not supported.</p>
                  )}
                </div>
              )}
            <Select value={filters.daypart.applies} onValueChange={(applies: "Every Day" | "Weekdays" | "Weekends") => updateSection("daypart", { applies })}>
              <SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Every Day">Every day</SelectItem><SelectItem value="Weekdays">Weekdays</SelectItem><SelectItem value="Weekends">Weekends</SelectItem></SelectContent>
            </Select>
          </div>
        </FilterCard>

        {/* 6. Budget */}
        <FilterCard title="Budget" icon={<Wallet className="w-4 h-4" />} enabled={filters.budget.enabled} onToggle={enabled => updateSection("budget", { enabled })}>
          <div className="space-y-3">
             <div>
               <label className="text-xs font-medium text-gray-700">Currency</label>
               <Select 
                 value={filters.budget.currency} 
                 onValueChange={(val: "GBP"|"EUR"|"USD") => {
                   const oldRate = EXCHANGE_RATES[filters.budget.currency];
                   const newRate = EXCHANGE_RATES[val];
                   const convert = (v: number | "") => v === "" ? "" : Math.round((Number(v) / oldRate) * newRate);
                   updateSection("budget", { 
                     currency: val, 
                     total: convert(filters.budget.total), 
                     cpm: filters.budget.cpm === null ? null : convert(filters.budget.cpm) 
                   });
                 }}
               >
                 <SelectTrigger className="h-8 mt-1"><SelectValue /></SelectTrigger>
                 <SelectContent>
                   <SelectItem value="GBP">GBP (£)</SelectItem>
                   <SelectItem value="EUR">EUR (€)</SelectItem>
                   <SelectItem value="USD">USD ($)</SelectItem>
                 </SelectContent>
               </Select>
             </div>
             <div>
               <label className="text-xs font-medium text-gray-700">Total Budget</label>
               <Input 
                 type="number" min={0} step="100" 
                 value={filters.budget.total} 
                 onChange={e => updateSection("budget", { total: e.target.value === "" ? "" : Math.max(0, Number(e.target.value)) })} 
                 className="h-8 mt-1" 
               />
             </div>
             <div>
               <label className="text-xs font-medium text-gray-700">CPM Ceiling (Optional)</label>
               <Input 
                 type="number" min={0} step=".01" 
                 value={filters.budget.cpm ?? ""} 
                 onChange={e => updateSection("budget", { cpm: e.target.value === "" ? null : Math.max(0, Number(e.target.value)) })} 
                 className="h-8 mt-1" 
               />
             </div>
          </div>
        </FilterCard>

        {/* 7. Creative Type */}
        <FilterCard title="Creative Type" icon={<MonitorPlay className="w-4 h-4" />} enabled={filters.creativeType.enabled} onToggle={enabled => updateSection("creativeType", { enabled })}>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-700">Format</label>
              <Select value={filters.creativeType.format || "any"} onValueChange={format => updateSection("creativeType", { format: format === "any" ? "" : format })}>
                <SelectTrigger className="h-8 mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="any">Display + Video (Both)</SelectItem>{CREATIVE_FORMATS.map(f => <SelectItem value={f} key={f}>{f}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-gray-700">Resolution</label>
              <Select value={filters.creativeType.resolution || "any"} onValueChange={resolution => updateSection("creativeType", { resolution: resolution === "any" ? "" : resolution })}>
                <SelectTrigger className="h-8 mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="any">Any</SelectItem>{RESOLUTIONS.map(r => <SelectItem value={r} key={r}>{r}</SelectItem>)}<SelectItem value="custom">Custom</SelectItem></SelectContent>
              </Select>
            </div>
            {filters.creativeType.resolution === "custom" && <div>
              <div className="flex items-center gap-2"><Input aria-label="Custom width" placeholder="Width" inputMode="numeric" value={filters.creativeType.customWidth} onChange={e => updateSection("creativeType", { customWidth: e.target.value })} className="h-8 text-sm" /><span>×</span><Input aria-label="Custom height" placeholder="Height" inputMode="numeric" value={filters.creativeType.customHeight} onChange={e => updateSection("creativeType", { customHeight: e.target.value })} className="h-8 text-sm" /></div>
              {resolutionError && <p className="text-[10px] text-red-600 mt-1">Enter whole-pixel dimensions from 1 to 16,384.</p>}
            </div>}
          </div>
        </FilterCard>

        <div className="h-8" />
      </div>

    </div>
  );
}

function ScalarFacet({ title, icon, enabled, values, selected, onToggle, onSelected }: {
  title: string; icon: ReactNode; enabled: boolean; values: string[]; selected: string[];
  onToggle: (value: boolean) => void; onSelected: (value: string[]) => void;
}) {
  return <FilterCard title={title} icon={icon} enabled={enabled} onToggle={onToggle}><div className="space-y-2">
    <div className="space-y-1 mt-2">
      {values.map(value => <label key={value} className="flex items-center gap-2 p-1.5 text-sm hover:bg-gray-50 rounded cursor-pointer">
        <input type="checkbox" className="rounded border-gray-300 text-purple-600 focus:ring-purple-500" checked={selected.includes(value)} onChange={e => onSelected(e.target.checked ? [...selected, value] : selected.filter(item => item !== value))} />
        <span className="text-gray-700">{value}</span>
      </label>)}
    </div>
  </div></FilterCard>;
}

function FilterCard({ title, icon, enabled, onToggle, children }: { title: string; icon: ReactNode; enabled: boolean; onToggle: (enabled: boolean) => void; children: ReactNode }) {
  return (
    <section data-annotate={`DOOH filters: ${title}`} className="border-b border-gray-200">
      <header className="px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors">
        <div className="flex items-center gap-2.5 text-gray-700">
          {icon}
          <span className="font-medium text-sm">{title}</span>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} className="data-[state=checked]:bg-purple-600" />
      </header>
      {enabled && <div className="px-4 pb-5 pt-1 animate-in slide-in-from-top-2">{children}</div>}
    </section>
  );
}
