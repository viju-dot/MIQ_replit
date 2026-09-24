import { useState, useRef, type ReactNode } from "react";
import { Link } from "wouter";
import { Clock, Download, LayoutDashboard, List, Map, MapPin, MonitorPlay, Target, Wallet, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAudiences, useIncrementAudienceUse } from "../api";
import { CREATIVE_FORMATS, DAYPART_PRESETS, PUBLISHERS, RESOLUTIONS, SCREENS, VENUES } from "../data";
import { downloadScreenTemplate, parseCoordinateCsv, parsePostcodeCsv, parseScreenList, type UploadReport } from "../uploadHelpers";
import { FiberSlider } from "./primitives";
import { FiberRoundedTabsBar, FiberTabButton } from "@/components/FiberTabItem";
import { PoiSearch } from "./PoiSearch";
import { FiberDropZone } from "@/components/FiberDropZone";
import { LocationUpload } from "./LocationUpload";
import { FacetDropdown } from "./FacetDropdown";

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
    poiIds: string[];
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
  creativeType: { enabled: boolean; format: string; resolution: string };
  screenList: { enabled: boolean; ids: string[]; configured: boolean };
}

export const DEFAULT_FILTERS_V2: FilterStateV2 = {
  location: { enabled: true, method: "audience", audienceId: "", postcode: "", poiIds: [], radius: 500, radiusUnit: "m", uploadedPoints: [] },
  planningZone: { enabled: false, zones: [], drawMode: null },
  venueType: { enabled: false, venues: [] },
  publishers: { enabled: false, publishers: [] },
  daypart: { enabled: false, applies: "Every Day", mode: "presets", presets: [], customStart: "09:00", customEnd: "17:00" },
  budget: { enabled: false, currency: "GBP", total: 50000, cpm: null },
  creativeType: { enabled: false, format: "", resolution: "" },
  screenList: { enabled: false, ids: [], configured: false },
};

export const EXCHANGE_RATES = { GBP: 1, EUR: 1.17, USD: 1.25 };

interface Props {
  filters: FilterStateV2;
  setFilters: React.Dispatch<React.SetStateAction<FilterStateV2>>;
}

function Report({ report, screenList = false }: { report: UploadReport | null; screenList?: boolean }) {
  if (!report) return null;
  return (
    <div className="rounded bg-[var(--surface-background-lvl2,#f7f7fa)] p-2 text-[11px] space-y-1" role="status">
      <p className="font-medium text-[var(--container-static-success-subtle-foreground-variation,#115639)]">
        {report.valid} {screenList ? `matched screen ID${report.valid === 1 ? "" : "s"}` : `valid row${report.valid === 1 ? "" : "s"}`}
      </p>
      {!!report.unknown.length && <p className="text-[var(--surface-foreground-static-warning,#b45309)]">Unknown: {report.unknown.slice(0, 6).join(", ")}{report.unknown.length > 6 ? "…" : ""}</p>}
      {!!report.malformed.length && <p className="text-[var(--surface-foreground-static-error,#da294b)]">Malformed: {report.malformed.slice(0, 6).join(", ")}{report.malformed.length > 6 ? "…" : ""}</p>}
      {!!report.duplicates.length && <p className="text-[var(--surface-foreground-static-warning,#b45309)]">Duplicates: {report.duplicates.slice(0, 6).join(", ")}{report.duplicates.length > 6 ? "…" : ""}</p>}
    </div>
  );
}

export function SidebarV2({ filters, setFilters }: Props) {
  const { data: audiences, isError } = useAudiences();
  const incrementUse = useIncrementAudienceUse();
  const [uploadError, setUploadError] = useState("");
  const [locationReport, setLocationReport] = useState<UploadReport | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileState, setFileState] = useState<"Uploading" | "Uploaded">("Uploading");
  const [screenListError, setScreenListError] = useState("");
  const [screenListReport, setScreenListReport] = useState<UploadReport | null>(null);
  const [screenListFile, setScreenListFile] = useState<File | null>(null);
  const [screenListFileState, setScreenListFileState] = useState<"Uploading" | "Uploaded">("Uploading");

  const uploadIdRef = useRef(0);
  const screenListUploadIdRef = useRef(0);

  const updateSection = <K extends keyof FilterStateV2>(section: K, data: Partial<FilterStateV2[K]>) => {
    setFilters(prev => ({ ...prev, [section]: { ...prev[section], ...data } }));
  };
  const selectedAudience = audiences?.find(a => a.id === filters.location.audienceId);
  
  const cancelUpload = () => {
    uploadIdRef.current++;
    setSelectedFile(null);
    setUploadError("");
    setLocationReport(null);
    updateSection("location", { uploadedPoints: [] });
  };

  const handleLocationFileError = (error: string) => {
    setUploadError(error);
    if (!error) return;
    uploadIdRef.current++;
    setSelectedFile(null);
    setLocationReport(null);
    updateSection("location", { uploadedPoints: [] });
  };

  const readUpload = async (file: File, parser: (file: File) => Promise<{ points: Array<{lat: number; lng: number}>; report: UploadReport }>) => {
    const currentUploadId = ++uploadIdRef.current;
    setSelectedFile(file);
    setFileState("Uploading");
    setUploadError("");
    setLocationReport(null);
    updateSection("location", { uploadedPoints: [] });
    try {
      const result = await parser(file);
      if (uploadIdRef.current !== currentUploadId) return;
      updateSection("location", { uploadedPoints: result.points });
      setLocationReport(result.report);
      setFileState("Uploaded");
    } catch (error) {
      if (uploadIdRef.current !== currentUploadId) return;
      setUploadError(error instanceof Error ? error.message : "Could not read this file.");
      setLocationReport(null);
      updateSection("location", { uploadedPoints: [] });
      setSelectedFile(null);
    }
  };

  const removeScreenListUpload = () => {
    screenListUploadIdRef.current++;
    setScreenListFile(null);
    setScreenListError("");
    setScreenListReport(null);
    updateSection("screenList", { ids: [], configured: false });
  };

  const handleScreenListFileError = (error: string) => {
    setScreenListError(error);
    if (!error) return;
    screenListUploadIdRef.current++;
    setScreenListFile(null);
    setScreenListReport(null);
    updateSection("screenList", { ids: [], configured: true });
  };

  const readScreenListUpload = async (file: File) => {
    const currentUploadId = ++screenListUploadIdRef.current;
    setScreenListFile(file);
    setScreenListFileState("Uploading");
    setScreenListError("");
    setScreenListReport(null);
    updateSection("screenList", { enabled: true, ids: [], configured: true });
    try {
      const result = await parseScreenList(file, SCREENS);
      if (screenListUploadIdRef.current !== currentUploadId) return;
      updateSection("screenList", { ids: result.ids, configured: true });
      setScreenListReport(result.report);
      setScreenListFileState("Uploaded");
      if (!result.ids.length) {
        setScreenListError("No screen IDs in this file match the current inventory.");
      }
    } catch (error) {
      if (screenListUploadIdRef.current !== currentUploadId) return;
      setScreenListError(error instanceof Error ? error.message : "Could not read this file.");
      setScreenListReport(null);
      updateSection("screenList", { ids: [], configured: true });
      setScreenListFile(null);
    }
  };

  return (
    <div data-annotate="DOOH filter panel" className="w-[300px] xl:w-[340px] shrink-0 bg-[var(--surface-background-lvl1,#ffffff)] flex flex-col z-20 border-r border-[var(--border-static-subtle-neutral,#e1e1e8)]">
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
                    updateSection("location", { method });
                    cancelUpload();
                  }}
                />
              ))}
            </FiberRoundedTabsBar>
          </div>
          {filters.location.method === "audience" && <div className="space-y-3">
            {!selectedAudience ? (
              <>
                <label className="text-xs font-medium block text-[var(--surface-foreground-static-neutral-lvl2,#282833)]">Select Saved Audience</label>
                <Select value={filters.location.audienceId} onValueChange={id => { updateSection("location", { audienceId: id }); incrementUse.mutate(id); }}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Choose an audience" /></SelectTrigger>
                  <SelectContent>
                    {isError && <SelectItem value="error" disabled>Error loading audiences</SelectItem>}
                    {audiences?.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </>
            ) : (
              <div className="rounded border border-[var(--border-dynamic-brand-subtle-default,#d7bced)] bg-[var(--container-dynamic-brand-subtle-background-default-regular,#f0e6f7)] p-3 relative">
                <button 
                  onClick={() => updateSection("location", { audienceId: "" })}
                  className="absolute top-2 right-2 text-[var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)] hover:text-[var(--surface-foreground-static-error,#da294b)]"
                  aria-label="Remove audience selection"
                >
                  <X className="h-3 w-3" />
                </button>
                <h4 className="text-sm font-medium text-[var(--surface-foreground-dynamic-brand-default,#7c33b5)] pr-4">{selectedAudience.name}</h4>
                {selectedAudience.description && <p className="text-xs text-[var(--surface-foreground-dynamic-brand-default,#7c33b5)] mt-1">{selectedAudience.description}</p>}
                <p className="text-[11px] text-[var(--surface-foreground-dynamic-brand-default,#7c33b5)] mt-2 font-medium">Coverage: {selectedAudience.coverage}</p>
              </div>
             )}
           </div>}
          
          {filters.location.method === "postcode" && <div className="space-y-2">
            <LocationUpload
              method="postcode"
              report={locationReport}
              file={selectedFile}
              fileState={fileState}
              onSelect={(file) => void readUpload(file, parsePostcodeCsv)}
              onRemove={cancelUpload}
              onError={handleLocationFileError}
            />
          </div>}
          
          {filters.location.method === "poi" && <div className="space-y-2">
            <PoiSearch values={filters.location.poiIds} onChange={poiIds => updateSection("location", { poiIds })} />
          </div>}
          
          {filters.location.method === "latlng" && <div className="space-y-2">
            <LocationUpload
              method="latlng"
              report={locationReport}
              file={selectedFile}
              fileState={fileState}
              onSelect={(file) => void readUpload(file, parseCoordinateCsv)}
              onRemove={cancelUpload}
              onError={handleLocationFileError}
            />
          </div>}

          {uploadError && <p className="text-[11px] text-[var(--surface-foreground-static-error,#da294b)] mt-2" role="alert">{uploadError}</p>}
          
          <div className="mt-4 pt-4 border-t border-[var(--border-static-subtle-neutral,#e1e1e8)]">
             <div className="flex items-center justify-between mb-3">
               <label className="text-xs font-medium text-[var(--surface-foreground-static-neutral-lvl2,#282833)]">Radius around points</label>
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
             <Button size="sm" variant="secondary" className="w-full bg-[var(--surface-background-lvl1,#ffffff)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] hover:bg-[var(--container-dynamic-neutral-subtle-background-hover,rgba(113,113,128,0.08))] border-[var(--border-static-subtle-neutral,#e1e1e8)]" onClick={() => updateSection("planningZone", { drawMode: filters.planningZone.drawMode ? null : "circle" })}>
              {filters.planningZone.drawMode ? "Cancel Drawing" : "Draw on Map"}
            </Button>
            <Select value={filters.planningZone.drawMode ?? "circle"} onValueChange={(value: "circle" | "polygon") => updateSection("planningZone", { drawMode: value })}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="circle">Circle</SelectItem><SelectItem value="polygon">Polygon</SelectItem></SelectContent>
            </Select>
            <div className="space-y-1">
              {filters.planningZone.zones.map((zone, index) => <div key={zone.id} className="flex items-center justify-between rounded bg-[var(--surface-background-lvl2,#f7f7fa)] p-2 text-xs border border-[var(--border-static-subtle-neutral,#e1e1e8)]">
                <span className="text-[var(--surface-foreground-static-neutral-lvl3,#717180)] truncate mr-2" title={zone.label || `Zone ${index + 1}`}>
                  {zone.label || `Zone ${index + 1}: ${zone.type === "circle" ? `${Math.round(zone.radius ?? 0)}m circle` : `${zone.points?.length ?? 0}-pt poly`}`}
                </span>
                <button aria-label={`Remove zone ${index + 1}`} className="text-[var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)] hover:text-[var(--surface-foreground-static-error,#da294b)] shrink-0" onClick={() => updateSection("planningZone", { zones: filters.planningZone.zones.filter(z => z.id !== zone.id) })}><X className="h-3 w-3" /></button>
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
            <div className="flex rounded bg-[var(--surface-background-lvl3,#ebebf0)] p-1">{(["presets", "custom"] as const).map(mode => <button key={mode} onClick={() => updateSection("daypart", { mode })} className={`flex-1 rounded py-1 text-xs font-medium ${filters.daypart.mode === mode ? "bg-[var(--surface-background-lvl1,#ffffff)] shadow text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]" : "text-[var(--surface-foreground-static-neutral-lvl3,#717180)]"}`}>{mode === "presets" ? "Presets" : "Custom"}</button>)}</div>
            {filters.daypart.mode === "presets" ? <div className="grid grid-cols-2 gap-2">{DAYPART_PRESETS.map(preset => <button key={preset} onClick={() => updateSection("daypart", { presets: filters.daypart.presets.includes(preset) ? filters.daypart.presets.filter(p => p !== preset) : [...filters.daypart.presets, preset] })} className={`rounded border py-1.5 text-[11px] transition-colors ${filters.daypart.presets.includes(preset) ? "border-[var(--border-dynamic-brand-default,#7c33b5)] bg-[var(--container-dynamic-brand-subtle-background-default-regular,#f0e6f7)] text-[var(--surface-foreground-dynamic-brand-default,#7c33b5)] font-medium" : "border-[var(--border-static-subtle-neutral,#e1e1e8)] text-[var(--surface-foreground-static-neutral-lvl3,#717180)] hover:border-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)]"}`}>{preset}</button>)}</div>
              : (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Input aria-label="Start time" type="time" value={filters.daypart.customStart} onChange={e => updateSection("daypart", { customStart: e.target.value })} className="h-8 text-sm" />
                    <span>to</span>
                    <Input aria-label="End time" type="time" value={filters.daypart.customEnd} onChange={e => updateSection("daypart", { customEnd: e.target.value })} className="h-8 text-sm" />
                  </div>
                  {filters.daypart.customStart >= filters.daypart.customEnd && (
                    <p className="text-[10px] text-[var(--surface-foreground-static-error,#da294b)] mt-1">Start time must be before end time. Overnight ranges not supported.</p>
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
               <label htmlFor="dooh-budget" className="text-xs font-medium text-[var(--surface-foreground-static-neutral-lvl2,#282833)]">Total Budget (£)</label>
               <Input 
                 id="dooh-budget"
                 type="number" min={0} step="100" 
                 value={filters.budget.total} 
                 onChange={e => updateSection("budget", { total: e.target.value === "" ? "" : Math.max(0, Number(e.target.value)) })} 
                 className="h-8 mt-1" 
               />
             </div>
             <div>
               <label htmlFor="dooh-cpm" className="text-xs font-medium text-[var(--surface-foreground-static-neutral-lvl2,#282833)]">CPM Ceiling (£, Optional)</label>
               <Input 
                 id="dooh-cpm"
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
              <label className="text-xs font-medium text-[var(--surface-foreground-static-neutral-lvl2,#282833)]">Format</label>
              <Select value={filters.creativeType.format || "any"} onValueChange={format => updateSection("creativeType", { format: format === "any" ? "" : format })}>
                <SelectTrigger className="h-8 mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="any">Display + Video (Both)</SelectItem>{CREATIVE_FORMATS.map(f => <SelectItem value={f} key={f}>{f}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--surface-foreground-static-neutral-lvl2,#282833)]">Resolution</label>
              <Select value={filters.creativeType.resolution || "any"} onValueChange={resolution => updateSection("creativeType", { resolution: resolution === "any" ? "" : resolution })}>
                <SelectTrigger className="h-8 mt-1"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="any">Any</SelectItem>{RESOLUTIONS.map(r => <SelectItem value={r} key={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>
        </FilterCard>

         {/* 8. Screen List */}
         <FilterCard title="Screen List" icon={<List className="w-4 h-4" />} enabled={filters.screenList.enabled} onToggle={enabled => updateSection("screenList", { enabled })}>
           <div className="space-y-2">
             <FiberDropZone
               accept=".csv,text/csv"
               acceptLabel="CSV with a Screen ID column"
               file={screenListFile}
               fileState={screenListFileState}
               onFileSelect={(file) => void readScreenListUpload(file)}
               onFileRemove={removeScreenListUpload}
               onFileError={handleScreenListFileError}
             />
             <Report report={screenListReport} screenList />
             {screenListError && <p className="text-[11px] text-[var(--surface-foreground-static-error,#da294b)]" role="alert">{screenListError}</p>}
             <Button type="button" variant="outline" size="sm" className="w-full" onClick={downloadScreenTemplate}>
               <Download className="h-3 w-3 mr-2" />Download sample CSV
             </Button>
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
  return <FilterCard title={title} icon={icon} enabled={enabled} onToggle={onToggle}>
    <FacetDropdown title={title} values={values} selected={selected} onSelected={onSelected} />
  </FilterCard>;
}

function FilterCard({ title, icon, enabled, onToggle, children }: { title: string; icon: ReactNode; enabled: boolean; onToggle: (enabled: boolean) => void; children: ReactNode }) {
  return (
    <section data-annotate={`DOOH filters: ${title}`} className="border-b border-[var(--border-static-subtle-neutral,#e1e1e8)]">
      <header className="px-4 py-3 flex items-center justify-between hover:bg-[var(--surface-background-lvl2,#f7f7fa)] transition-colors">
        <div className="flex items-center gap-2.5 text-[var(--surface-foreground-static-neutral-lvl2,#282833)]">
          {icon}
          <span className="font-medium text-sm">{title}</span>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} className="data-[state=checked]:bg-[var(--container-dynamic-brand-bold-background-default,#7c33b5)]" />
      </header>
      {enabled && <div className="px-4 pb-5 pt-1 animate-in slide-in-from-top-2">{children}</div>}
    </section>
  );
}
