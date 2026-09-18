import { useState, type ChangeEvent, type ReactNode } from "react";
import { Link } from "wouter";
import { Clock, Download, Info, LayoutDashboard, List, Map, MapPin, MonitorPlay, Target, Upload, Wallet, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useAudiences, useIncrementAudienceUse } from "../api";
import { CREATIVE_FORMATS, DAYPART_PRESETS, MOCK_POIS, PUBLISHERS, RESOLUTIONS, SCREENS, VENUES } from "../data";
import { downloadScreenTemplate, parseCoordinateCsv, parsePostcodeCsv, parseScreenList, type UploadReport } from "../uploadHelpers";

export interface PlanningZone {
  id: string;
  type: "circle" | "polygon";
  center?: { lat: number; lng: number };
  radius?: number;
  points?: Array<{ lat: number; lng: number }>;
}

export interface FilterState {
  location: {
    enabled: boolean;
    method: "audience" | "postcode" | "poi" | "latlng";
    audienceId: string;
    postcode: string;
    poiId: string;
    radius: number;
    uploadedPoints: Array<{ lat: number; lng: number }>;
  };
  planningZone: { enabled: boolean; zones: PlanningZone[]; drawMode: "circle" | "polygon" | null };
  venueType: { enabled: boolean; anyAll: "ANY" | "ALL"; venues: string[] };
  publishers: { enabled: boolean; anyAll: "ANY" | "ALL"; publishers: string[] };
  budget: { enabled: boolean; currency: "GBP"; total: number; cpm: number | null };
  creativeType: { enabled: boolean; format: string; resolution: string; customWidth: string; customHeight: string };
  daypart: {
    enabled: boolean;
    applies: "Every Day" | "Weekdays" | "Weekends";
    mode: "presets" | "custom";
    presets: string[];
    customStart: string;
    customEnd: string;
  };
  screenList: { enabled: boolean; ids: string[] };
}

export const DEFAULT_FILTERS: FilterState = {
  location: { enabled: true, method: "audience", audienceId: "", postcode: "", poiId: "", radius: 500, uploadedPoints: [] },
  planningZone: { enabled: false, zones: [], drawMode: null },
  venueType: { enabled: false, anyAll: "ANY", venues: [] },
  publishers: { enabled: false, anyAll: "ANY", publishers: [] },
  budget: { enabled: false, currency: "GBP", total: 50000, cpm: null },
  creativeType: { enabled: false, format: "", resolution: "", customWidth: "", customHeight: "" },
  daypart: { enabled: false, applies: "Every Day", mode: "presets", presets: [], customStart: "09:00", customEnd: "17:00" },
  screenList: { enabled: false, ids: [] },
};

interface Props {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

function Report({ report }: { report: UploadReport | null }) {
  if (!report) return null;
  return (
    <div className="rounded bg-gray-50 p-2 text-[11px] space-y-1" role="status">
      <p className="font-medium text-green-700">{report.valid} valid row{report.valid === 1 ? "" : "s"}</p>
      {!!report.unknown.length && <p className="text-amber-700">Unknown/unsupported: {report.unknown.slice(0, 6).join(", ")}{report.unknown.length > 6 ? "…" : ""}</p>}
      {!!report.malformed.length && <p className="text-red-600">Malformed: {report.malformed.slice(0, 6).join(", ")}{report.malformed.length > 6 ? "…" : ""}</p>}
      {!!report.duplicates.length && <p className="text-amber-700">Duplicates ignored: {report.duplicates.slice(0, 6).join(", ")}{report.duplicates.length > 6 ? "…" : ""}</p>}
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

export function Sidebar({ filters, setFilters }: Props) {
  const { data: audiences } = useAudiences();
  const incrementUse = useIncrementAudienceUse();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [locationReport, setLocationReport] = useState<UploadReport | null>(null);
  const [screenReport, setScreenReport] = useState<UploadReport | null>(null);

  const updateSection = <K extends keyof FilterState>(section: K, data: Partial<FilterState[K]>) => {
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
    <div className="dooh-sidebar w-[340px] shrink-0 bg-white flex flex-col h-full overflow-hidden z-20 border-r border-gray-200">
      <div className="p-4 border-b border-gray-200 bg-gray-50">
        <h2 className="font-semibold text-[16px]">Campaign Filters</h2>
        <p className="text-xs text-gray-500 mt-1">Configure all eight matching facets</p>
      </div>
      <div className="flex-1 overflow-y-auto dooh-scrollbar">
        <FilterCard title="Location" icon={<MapPin className="w-4 h-4" />} enabled={filters.location.enabled} onToggle={enabled => updateSection("location", { enabled })}>
          <div className="flex rounded-md bg-gray-100 p-1 mb-4">
            {(["audience", "postcode", "poi", "latlng"] as const).map(method => (
              <button key={method} onClick={() => { updateSection("location", { method, uploadedPoints: [] }); setLocationReport(null); setUploadError(""); }}
                className={`flex-1 text-[11px] font-medium py-1.5 px-1 rounded ${filters.location.method === method ? "bg-white shadow-sm" : "text-gray-500"}`}>
                {method === "audience" ? "Saved" : method === "latlng" ? "Lat/Lng" : method[0].toUpperCase() + method.slice(1)}
              </button>
            ))}
          </div>
          {filters.location.method === "audience" && <div className="space-y-3">
            <label className="text-xs font-medium block">Select Saved Audience:</label>
            <Select value={filters.location.audienceId} onValueChange={id => { updateSection("location", { audienceId: id }); incrementUse.mutate(id); }}>
              <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Select audience..." /></SelectTrigger>
              <SelectContent>{audiences?.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}</SelectContent>
            </Select>
            <div className="flex gap-3">
              <button type="button" disabled={!selectedAudience} onClick={() => setPreviewOpen(true)} className="text-xs font-medium text-purple-700 disabled:text-gray-400">👁 Preview Audience</button>
              <Link href="/saved-audiences" className="text-xs font-medium text-purple-700">View All Saved</Link>
            </div>
          </div>}
          {filters.location.method === "postcode" && <div className="space-y-2">
            <FilePicker accept=".csv,text/csv" label="Upload postcode CSV" onFile={file => {
              const target = { files: [file], value: "" } as unknown as HTMLInputElement;
              void readUpload({ target } as ChangeEvent<HTMLInputElement>, parsePostcodeCsv);
            }} />
            <p className="text-[10px] text-gray-500">Required header: postcode. Unsupported postcodes are reported.</p>
            <Report report={locationReport} />
          </div>}
          {filters.location.method === "poi" && <Select value={filters.location.poiId} onValueChange={poiId => updateSection("location", { poiId })}>
            <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Search malls, arenas..." /></SelectTrigger>
            <SelectContent>{MOCK_POIS.map(p => <SelectItem key={p.id} value={p.id}>{p.name} ({p.city})</SelectItem>)}</SelectContent>
          </Select>}
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
            <p className="text-[10px] text-gray-500">Required headers: lat, lng. Latitude −90–90; longitude −180–180.</p>
            <Report report={locationReport} />
          </div>}
          {uploadError && <p className="text-[11px] text-red-600 mt-2" role="alert">{uploadError}</p>}
          <label className="text-xs font-medium block mt-3">Radius (meters)</label>
          <Input type="number" min={1} value={filters.location.radius} onChange={e => updateSection("location", { radius: Math.max(1, Number(e.target.value)) })} className="h-8 text-sm mt-1" />
        </FilterCard>

        <FilterCard title="Planning Zone" icon={<Map className="w-4 h-4" />} enabled={filters.planningZone.enabled} onToggle={enabled => updateSection("planningZone", { enabled, drawMode: enabled ? filters.planningZone.drawMode : null })}>
          <div className="space-y-2">
            <Select value={filters.planningZone.drawMode ?? "circle"} onValueChange={(value: "circle" | "polygon") => updateSection("planningZone", { drawMode: value })}>
              <SelectTrigger className="h-8 text-sm"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="circle">Circle</SelectItem><SelectItem value="polygon">Polygon</SelectItem></SelectContent>
            </Select>
            {filters.planningZone.drawMode
              ? <Button size="sm" variant="outline" className="w-full" onClick={() => updateSection("planningZone", { drawMode: null })}>Cancel drawing</Button>
              : <div className="flex gap-2"><Button size="sm" className="flex-1" onClick={() => updateSection("planningZone", { drawMode: "circle" })}>Draw circle</Button><Button size="sm" variant="outline" className="flex-1" onClick={() => updateSection("planningZone", { drawMode: "polygon" })}>Draw polygon</Button></div>}
            <p className="text-[10px] text-gray-500">{filters.planningZone.drawMode ? `Drawing ${filters.planningZone.drawMode} on map…` : "Choose Draw, then create a shape on the map."}</p>
            {filters.planningZone.zones.map((zone, index) => <div key={zone.id} className="flex items-center justify-between rounded bg-gray-50 p-2 text-xs">
              <span>Zone {index + 1}: {zone.type === "circle" ? `${Math.round(zone.radius ?? 0)}m circle` : `${zone.points?.length ?? 0}-point polygon`}</span>
              <button aria-label={`Remove zone ${index + 1}`} onClick={() => updateSection("planningZone", { zones: filters.planningZone.zones.filter(z => z.id !== zone.id) })}><X className="h-3 w-3" /></button>
            </div>)}
          </div>
        </FilterCard>

        <ScalarFacet title="Venue Type" icon={<LayoutDashboard className="w-4 h-4" />} enabled={filters.venueType.enabled} logic={filters.venueType.anyAll} values={VENUES} selected={filters.venueType.venues}
          onToggle={enabled => updateSection("venueType", { enabled })} onLogic={anyAll => updateSection("venueType", { anyAll })} onSelected={venues => updateSection("venueType", { venues })} noun="venue" />
        <ScalarFacet title="Publishers" icon={<Target className="w-4 h-4" />} enabled={filters.publishers.enabled} logic={filters.publishers.anyAll} values={PUBLISHERS} selected={filters.publishers.publishers}
          onToggle={enabled => updateSection("publishers", { enabled })} onLogic={anyAll => updateSection("publishers", { anyAll })} onSelected={publishers => updateSection("publishers", { publishers })} noun="publisher" />

        <FilterCard title="Budget" icon={<Wallet className="w-4 h-4" />} enabled={filters.budget.enabled} onToggle={enabled => updateSection("budget", { enabled })}>
          <div className="space-y-3">
            <div><label className="text-xs font-medium">Currency</label><Input value="GBP (£) — only currency supported" disabled className="h-8 text-sm mt-1" /></div>
            <div><label className="text-xs font-medium">Total budget</label><Input type="number" min={0} step="100" value={filters.budget.total} onChange={e => updateSection("budget", { total: Math.max(0, Number(e.target.value)) })} className="h-8 mt-1" /></div>
            <div><label className="text-xs font-medium">Maximum CPM (optional)</label><Input type="number" min={0} step=".01" value={filters.budget.cpm ?? ""} onChange={e => updateSection("budget", { cpm: e.target.value ? Math.max(0, Number(e.target.value)) : null })} className="h-8 mt-1" /></div>
            <p className="text-[10px] text-gray-500">Affordable screens are taken in Screen ID order while cumulative spend fits the budget. Spend = impressions ÷ 1,000 × CPM.</p>
          </div>
        </FilterCard>

        <FilterCard title="Creative Type" icon={<MonitorPlay className="w-4 h-4" />} enabled={filters.creativeType.enabled} onToggle={enabled => updateSection("creativeType", { enabled })}>
          <div className="space-y-3">
            <Select value={filters.creativeType.format || "any"} onValueChange={format => updateSection("creativeType", { format: format === "any" ? "" : format })}>
              <SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="any">Any format</SelectItem>{CREATIVE_FORMATS.map(f => <SelectItem value={f} key={f}>{f}</SelectItem>)}</SelectContent>
            </Select>
            <Select value={filters.creativeType.resolution || "any"} onValueChange={resolution => updateSection("creativeType", { resolution: resolution === "any" ? "" : resolution })}>
              <SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="any">Any resolution</SelectItem>{RESOLUTIONS.map(r => <SelectItem value={r} key={r}>{r}</SelectItem>)}<SelectItem value="custom">Custom</SelectItem></SelectContent>
            </Select>
            {filters.creativeType.resolution === "custom" && <div>
              <div className="flex items-center gap-2"><Input aria-label="Custom width" placeholder="Width" inputMode="numeric" value={filters.creativeType.customWidth} onChange={e => updateSection("creativeType", { customWidth: e.target.value })} /><span>×</span><Input aria-label="Custom height" placeholder="Height" inputMode="numeric" value={filters.creativeType.customHeight} onChange={e => updateSection("creativeType", { customHeight: e.target.value })} /></div>
              {resolutionError && <p className="text-[10px] text-red-600 mt-1">Enter whole-pixel dimensions from 1 to 16,384.</p>}
            </div>}
          </div>
        </FilterCard>

        <FilterCard title="Daypart" icon={<Clock className="w-4 h-4" />} enabled={filters.daypart.enabled} onToggle={enabled => updateSection("daypart", { enabled })}>
          <div className="space-y-3">
            <div className="flex rounded bg-gray-100 p-1">{(["presets", "custom"] as const).map(mode => <button key={mode} onClick={() => updateSection("daypart", { mode })} className={`flex-1 rounded py-1 text-xs ${filters.daypart.mode === mode ? "bg-white shadow" : ""}`}>{mode === "presets" ? "Presets" : "Custom range"}</button>)}</div>
            {filters.daypart.mode === "presets" ? <div className="grid grid-cols-2 gap-2">{DAYPART_PRESETS.map(preset => <button key={preset} onClick={() => updateSection("daypart", { presets: filters.daypart.presets.includes(preset) ? filters.daypart.presets.filter(p => p !== preset) : [...filters.daypart.presets, preset] })} className={`rounded border py-1 text-[11px] ${filters.daypart.presets.includes(preset) ? "border-purple-500 bg-purple-50" : "border-gray-200"}`}>{preset}</button>)}</div>
              : <div className="flex items-center gap-2"><Input aria-label="Start time" type="time" value={filters.daypart.customStart} onChange={e => updateSection("daypart", { customStart: e.target.value })} /><span>to</span><Input aria-label="End time" type="time" value={filters.daypart.customEnd} onChange={e => updateSection("daypart", { customEnd: e.target.value })} /></div>}
            <Select value={filters.daypart.applies} onValueChange={(applies: "Every Day" | "Weekdays" | "Weekends") => updateSection("daypart", { applies })}>
              <SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent><SelectItem value="Every Day">Every day</SelectItem><SelectItem value="Weekdays">Weekdays</SelectItem><SelectItem value="Weekends">Weekends</SelectItem></SelectContent>
            </Select>
          </div>
        </FilterCard>

        <FilterCard title="Screen List" icon={<List className="w-4 h-4" />} enabled={filters.screenList.enabled} onToggle={enabled => updateSection("screenList", { enabled })}>
          <div className="space-y-2">
            <FilePicker accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" label="Upload .csv or .xlsx" onFile={async file => {
              try {
                setUploadError("");
                const result = await parseScreenList(file, SCREENS);
                updateSection("screenList", { ids: result.ids });
                setScreenReport(result.report);
              } catch (error) {
                setUploadError(error instanceof Error ? error.message : "Could not read this file.");
                updateSection("screenList", { ids: [] });
                setScreenReport(null);
              }
            }} />
            <Report report={screenReport} />
            <Button type="button" variant="outline" size="sm" className="w-full" onClick={downloadScreenTemplate}><Download className="h-3 w-3 mr-2" />Download template</Button>
            {uploadError && <p className="text-[11px] text-red-600">{uploadError}</p>}
          </div>
        </FilterCard>
        <div className="h-8" />
      </div>

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{selectedAudience?.name ?? "Audience preview"}</DialogTitle></DialogHeader>
          {selectedAudience && <div className="space-y-2 text-sm">
            <p><strong>Coverage:</strong> {selectedAudience.coverage}</p>
            <p><strong>Geography:</strong> {selectedAudience.geoType}</p>
            <p><strong>Points:</strong> {selectedAudience.geoDefinition.points?.length ?? 0}</p>
            <p><strong>Created by:</strong> {selectedAudience.createdBy}</p>
            <div className="max-h-44 overflow-auto rounded bg-gray-50 p-2 text-xs">{selectedAudience.geoDefinition.points?.map((point, index) => <p key={`${point.lat}-${point.lng}-${index}`}>{point.postcode || point.city || `Point ${index + 1}`} — {point.lat.toFixed(4)}, {point.lng.toFixed(4)}</p>)}</div>
          </div>}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ScalarFacet({ title, icon, enabled, logic, values, selected, onToggle, onLogic, onSelected, noun }: {
  title: string; icon: ReactNode; enabled: boolean; logic: "ANY" | "ALL"; values: string[]; selected: string[];
  onToggle: (value: boolean) => void; onLogic: (value: "ANY" | "ALL") => void; onSelected: (value: string[]) => void; noun: string;
}) {
  return <FilterCard title={title} icon={icon} enabled={enabled} onToggle={onToggle}><div className="space-y-2">
    <div className="flex items-center justify-between"><span className="text-xs font-medium">Match</span><div className="rounded bg-gray-100 p-0.5">{(["ANY", "ALL"] as const).map(value => <button key={value} onClick={() => onLogic(value)} className={`rounded px-2 py-1 text-[10px] ${logic === value ? "bg-white shadow" : ""}`}>{value}</button>)}</div></div>
    {logic === "ALL" && selected.length > 1 && <p className="flex gap-1 text-[10px] text-amber-700"><Info className="h-3 w-3 shrink-0" />No single screen can match more than one distinct {noun}; selecting multiple with ALL returns no matches.</p>}
    {values.map(value => <label key={value} className="flex items-center gap-2 p-1 text-sm"><input type="checkbox" checked={selected.includes(value)} onChange={e => onSelected(e.target.checked ? [...selected, value] : selected.filter(item => item !== value))} />{value}</label>)}
  </div></FilterCard>;
}

function FilterCard({ title, icon, enabled, onToggle, children }: { title: string; icon: ReactNode; enabled: boolean; onToggle: (enabled: boolean) => void; children: ReactNode }) {
  return <section className="border-b border-gray-200"><header className="px-4 py-3 flex items-center justify-between"><div className="flex items-center gap-2">{icon}<span className="font-semibold text-sm">{title}</span></div><Switch checked={enabled} onCheckedChange={onToggle} /></header>{enabled && <div className="px-4 pb-4">{children}</div>}</section>;
}