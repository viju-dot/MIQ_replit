import { useState, useRef, forwardRef, type ComponentPropsWithoutRef, type CSSProperties, type ElementRef, type ReactNode } from "react";
import { Link } from "wouter";
import { Clock, Download, LayoutDashboard, List, Map, MapPin, MonitorPlay, Target, Wallet, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger as BaseSelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/pages/ds/CheckPage";
import { useAudiences, useIncrementAudienceUse } from "../api";
import { CITIES, CREATIVE_FORMATS, DAYPART_PRESETS, MOCK_POIS, MOCK_POSTCODES, PUBLISHERS, RESOLUTIONS, SCREENS, VENUES, getDistance } from "../data";
import { downloadScreenTemplate, parseCityCsv, parseCoordinateCsv, parsePostcodeCsv, parseScreenList, type UploadedLocationRecord, type UploadedScreenRecord, type UploadReport } from "../uploadHelpers";
import { FiberSlider, FiberButton, SmartCard } from "./primitives";
import { FiberRoundedTabsBar, FiberTabButton } from "@/components/FiberTabItem";
import { PoiSearch } from "./PoiSearch";
import { FiberDropZone } from "@/components/FiberDropZone";
import { LocationUpload } from "./LocationUpload";
import { FacetDropdown } from "./FacetDropdown";
import { UploadPreview, UploadPreviewOptions } from "./UploadPreview";
import { CURRENCY_SYMBOLS, convertBudgetCurrency, type BudgetCurrency } from "./budgetCurrency";
import type { CreativeScreenCounts } from "./creativeCounts";

const PUBLISHER_SCREEN_COUNTS = SCREENS.reduce<Record<string, number>>((counts, screen) => {
  counts[screen.publisher] = (counts[screen.publisher] ?? 0) + 1;
  return counts;
}, {});
export { EXCHANGE_RATES } from "./budgetCurrency";

// Theme the control itself, not SelectValue's inner span. Fiber uses
// data-theme, whereas the underlying headless control's defaults use .dark.
const SelectTrigger = forwardRef<ElementRef<typeof BaseSelectTrigger>, ComponentPropsWithoutRef<typeof BaseSelectTrigger>>(
  ({ style, ...props }, ref) => (
    <BaseSelectTrigger {...props} ref={ref} style={{
      backgroundColor: "var(--surface-background-lvl2, #f7f7fa)",
      borderColor: "var(--border-dynamic-neutral-subtle-default, #c6c6cc)",
      color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)",
      ...style,
    }} />
  ),
);
SelectTrigger.displayName = "FiberPlannerSelectTrigger";

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
    method: "audience" | "postcode" | "poi" | "latlng" | "city";
    audienceId: string;
    postcode: string;
    poiIds: string[];
    radius: number | "";
    radiusUnit: "m" | "km";
    uploadedPoints: Array<{ lat: number; lng: number }>;
    uploadedPointsByMethod: {
      postcode: Array<{ lat: number; lng: number }>;
      latlng: Array<{ lat: number; lng: number }>;
      city: Array<{ lat: number; lng: number }>;
    };
  };
  planningZone: { enabled: boolean; zones: PlanningZone[]; drawMode: "circle" | "polygon" | null; drawShape: "circle" | "polygon"; drawCircleRadius: string; drawCircleUnit: "m" | "km" };
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
  creativeType: { enabled: boolean; format: string; resolution: string; resolutions?: string[] };
  screenList: { enabled: boolean; ids: string[]; configured: boolean };
}

export const DEFAULT_FILTERS_V2: FilterStateV2 = {
  location: {
    enabled: true,
    method: "audience",
    audienceId: "",
    postcode: "",
    poiIds: [],
    radius: 500,
    radiusUnit: "m",
    uploadedPoints: [],
    uploadedPointsByMethod: { postcode: [], latlng: [], city: [] },
  },
  planningZone: { enabled: false, zones: [], drawMode: null, drawShape: "circle", drawCircleRadius: "", drawCircleUnit: "km" },
  venueType: { enabled: false, venues: [] },
  publishers: { enabled: false, publishers: [] },
  daypart: { enabled: false, applies: "Every Day", mode: "presets", presets: [], customStart: "09:00", customEnd: "17:00" },
  budget: { enabled: false, currency: "GBP", total: 50000, cpm: null },
  creativeType: { enabled: false, format: "", resolution: "" },
  screenList: { enabled: false, ids: [], configured: false },
};

function formatDemoTime(minutes: number) {
  const safeMinutes = Math.min(23 * 60 + 59, Math.max(0, minutes));
  const hours = Math.floor(safeMinutes / 60).toString().padStart(2, "0");
  const mins = (safeMinutes % 60).toString().padStart(2, "0");
  return `${hours}:${mins}`;
}

const DEMO_POSTCODE_KEYS = ["SE1 7AA", "W1D 3QF", "SW1A 2AA"] as const;
const DEMO_LOCATION_POINTS = DEMO_POSTCODE_KEYS.map(postcode => ({
  lat: MOCK_POSTCODES[postcode].lat,
  lng: MOCK_POSTCODES[postcode].lng,
}));
const DEMO_RADIUS_METERS = 2000;
const DEMO_ANCHOR_SCREEN = SCREENS.find(screen =>
  DEMO_LOCATION_POINTS.some(point => getDistance(screen.lat, screen.lng, point.lat, point.lng) <= DEMO_RADIUS_METERS),
) ?? SCREENS[0];
const DEMO_DAYPART_START = DEMO_ANCHOR_SCREEN.availability.start;
const DEMO_DAYPART_END = Math.min(23 * 60 + 59, DEMO_ANCHOR_SCREEN.availability.end);
const DEMO_DAYPART_APPLIES = DEMO_ANCHOR_SCREEN.availability.days;

function matchesDemoDaypart(screen: (typeof SCREENS)[number]) {
  const dayMatches = DEMO_DAYPART_APPLIES === "Every Day"
    ? screen.availability.days === "Every Day"
    : screen.availability.days === "Every Day" || screen.availability.days === DEMO_DAYPART_APPLIES;
  return dayMatches
    && screen.availability.start <= DEMO_DAYPART_START
    && screen.availability.end >= DEMO_DAYPART_END;
}

const DEMO_SCREEN_IDS = SCREENS
  .filter(screen =>
    DEMO_LOCATION_POINTS.some(point => getDistance(screen.lat, screen.lng, point.lat, point.lng) <= DEMO_RADIUS_METERS)
    && screen.venue === DEMO_ANCHOR_SCREEN.venue
    && screen.publisher === DEMO_ANCHOR_SCREEN.publisher
    && screen.creativeFormat === DEMO_ANCHOR_SCREEN.creativeFormat
    && screen.creativeRes === DEMO_ANCHOR_SCREEN.creativeRes
    && matchesDemoDaypart(screen)
    && screen.cpm <= DEMO_ANCHOR_SCREEN.cpm + 5,
  )
  .slice(0, 8)
  .map(screen => screen.id);

export const DEMO_UPLOADS = {
  location: {
    city: {
      fileName: "demo-cities.csv",
      content: "city\nLondon",
      records: CITIES.filter(city => city.name === "London").map(city => ({
        key: city.name,
        label: city.name,
        point: { lat: city.lat, lng: city.lng },
      })),
      report: { valid: 1, unknown: [], malformed: [], duplicates: [] } as UploadReport,
    },
    postcode: {
      fileName: "demo-postcodes.csv",
      content: ["postcode", ...DEMO_POSTCODE_KEYS].join("\n"),
      records: DEMO_POSTCODE_KEYS.map(postcode => ({
        key: postcode,
        label: postcode,
        point: { lat: MOCK_POSTCODES[postcode].lat, lng: MOCK_POSTCODES[postcode].lng },
      })),
      report: { valid: DEMO_POSTCODE_KEYS.length, unknown: [], malformed: [], duplicates: [] } as UploadReport,
    },
    latlng: {
      fileName: "demo-coordinates.csv",
      content: ["lat,lng", ...DEMO_LOCATION_POINTS.map(point => `${point.lat},${point.lng}`)].join("\n"),
      records: DEMO_LOCATION_POINTS.map(point => {
        const key = `${point.lat},${point.lng}`;
        return { key, label: key, point };
      }),
      report: { valid: DEMO_LOCATION_POINTS.length, unknown: [], malformed: [], duplicates: [] } as UploadReport,
    },
  },
  screenList: {
    fileName: "demo-screen-list.csv",
    content: ["screen_id", ...DEMO_SCREEN_IDS].join("\n"),
    records: DEMO_SCREEN_IDS.map(id => ({ key: id, label: id, id })),
    report: { valid: DEMO_SCREEN_IDS.length, unknown: [], malformed: [], duplicates: [] } as UploadReport,
  },
};

const DEMO_POI = MOCK_POIS.find(poi => poi.city === "London") ?? MOCK_POIS[0];

export function createDemoFilters(v4Layout = false): FilterStateV2 {
  return {
    location: {
      enabled: true,
      method: "postcode",
      audienceId: "",
      postcode: DEMO_POSTCODE_KEYS[0],
      poiIds: [DEMO_POI.id],
      radius: DEMO_RADIUS_METERS,
      radiusUnit: "m",
      uploadedPoints: DEMO_UPLOADS.location.postcode.records.map(record => record.point),
      uploadedPointsByMethod: {
        postcode: DEMO_UPLOADS.location.postcode.records.map(record => record.point),
        latlng: DEMO_UPLOADS.location.latlng.records.map(record => record.point),
        city: v4Layout ? DEMO_UPLOADS.location.city.records.map(record => record.point) : [],
      },
    },
    planningZone: {
      enabled: true,
      zones: [{
        id: "demo-planning-zone",
        type: "circle",
        center: DEMO_LOCATION_POINTS[0],
        radius: DEMO_RADIUS_METERS,
        label: "Central London demo zone",
      }],
      drawMode: null,
      drawShape: "circle",
      drawCircleRadius: String(DEMO_RADIUS_METERS / 1000),
      drawCircleUnit: "km",
    },
    venueType: { enabled: true, venues: [DEMO_ANCHOR_SCREEN.venue] },
    publishers: { enabled: true, publishers: [DEMO_ANCHOR_SCREEN.publisher] },
    daypart: {
      enabled: true,
      applies: DEMO_DAYPART_APPLIES,
      mode: "custom",
      presets: [],
      customStart: formatDemoTime(DEMO_DAYPART_START),
      customEnd: formatDemoTime(DEMO_DAYPART_END),
    },
    budget: { enabled: true, currency: "GBP", total: 1000000, cpm: DEMO_ANCHOR_SCREEN.cpm + 5 },
    creativeType: {
      enabled: true,
      format: DEMO_ANCHOR_SCREEN.creativeFormat,
      resolution: DEMO_ANCHOR_SCREEN.creativeRes,
    },
    screenList: { enabled: true, ids: DEMO_SCREEN_IDS, configured: true },
  };
}

function createDemoFile(name: string, content: string) {
  return typeof File === "undefined" ? null : new File([content], name, { type: "text/csv" });
}

interface Props {
  filters: FilterStateV2;
  setFilters: React.Dispatch<React.SetStateAction<FilterStateV2>>;
  demoView?: boolean;
  showRadius?: boolean;
  pointRadiusOnly?: boolean;
  allowClearAll?: boolean;
  multipleResolutions?: boolean;
  v4Layout?: boolean;
  creativeCounts?: CreativeScreenCounts;
}

type LocationUploadMethod = "postcode" | "latlng" | "city";

interface LocationUploadState {
  file: File | null;
  fileState: "Uploading" | "Uploaded";
  report: UploadReport | null;
  records: UploadedLocationRecord[];
  selectedKeys: Set<string>;
}

function emptyLocationUpload(): LocationUploadState {
  return {
    file: null,
    fileState: "Uploading",
    report: null,
    records: [],
    selectedKeys: new Set(),
  };
}

function demoLocationUpload(method: LocationUploadMethod): LocationUploadState {
  const upload = DEMO_UPLOADS.location[method];
  return {
    file: createDemoFile(upload.fileName, upload.content),
    fileState: "Uploaded",
    report: upload.report,
    records: upload.records,
    selectedKeys: new Set(upload.records.map(record => record.key)),
  };
}

export function SidebarV2({
  filters,
  setFilters,
  demoView = false,
  showRadius = true,
  pointRadiusOnly = false,
  allowClearAll = false,
  multipleResolutions = false,
  v4Layout = false,
  creativeCounts,
}: Props) {
  const { data: audiences, isError } = useAudiences();
  const incrementUse = useIncrementAudienceUse();
  const [uploadError, setUploadError] = useState("");
  const [drawError, setDrawError] = useState("");
  const [locationUploads, setLocationUploads] = useState<Record<LocationUploadMethod, LocationUploadState>>(() => ({
    postcode: demoView ? demoLocationUpload("postcode") : emptyLocationUpload(),
    latlng: demoView ? demoLocationUpload("latlng") : emptyLocationUpload(),
    city: demoView && v4Layout ? demoLocationUpload("city") : emptyLocationUpload(),
  }));
  const [screenListError, setScreenListError] = useState("");
  const [screenListReport, setScreenListReport] = useState<UploadReport | null>(() => demoView ? DEMO_UPLOADS.screenList.report : null);
  const [screenListRecords, setScreenListRecords] = useState<UploadedScreenRecord[]>(() => demoView ? DEMO_UPLOADS.screenList.records : []);
  const [selectedScreenListKeys, setSelectedScreenListKeys] = useState<Set<string>>(() => demoView ? new Set(DEMO_UPLOADS.screenList.records.map(record => record.key)) : new Set());
  const [screenListFile, setScreenListFile] = useState<File | null>(() => demoView ? createDemoFile(DEMO_UPLOADS.screenList.fileName, DEMO_UPLOADS.screenList.content) : null);
  const [screenListFileState, setScreenListFileState] = useState<"Uploading" | "Uploaded">(demoView ? "Uploaded" : "Uploading");

  const uploadIdRef = useRef<Record<LocationUploadMethod, number>>({ postcode: 0, latlng: 0, city: 0 });
  const screenListUploadIdRef = useRef(0);

  const updateSection = <K extends keyof FilterStateV2>(section: K, data: Partial<FilterStateV2[K]>) => {
    setFilters(prev => ({ ...prev, [section]: { ...prev[section], ...data } }));
  };
  const selectedAudience = audiences?.find(a => a.id === filters.location.audienceId);

  const activeLocationMethod: LocationUploadMethod = filters.location.method === "city" ? "city" : filters.location.method === "latlng" ? "latlng" : "postcode";
  const activeLocationUpload = locationUploads[activeLocationMethod];
  const updateLocationPoints = (method: LocationUploadMethod, points: Array<{ lat: number; lng: number }>) => {
    setFilters(prev => ({
      ...prev,
      location: {
        ...prev.location,
        uploadedPointsByMethod: {
          ...prev.location.uploadedPointsByMethod,
          [method]: points,
        },
        uploadedPoints: prev.location.method === method ? points : prev.location.uploadedPoints,
      },
    }));
  };
  const updateLocationUpload = (method: LocationUploadMethod, data: Partial<LocationUploadState>) => {
    setLocationUploads(prev => ({ ...prev, [method]: { ...prev[method], ...data } }));
  };

  const selectLocationMethod = (method: FilterStateV2["location"]["method"]) => {
    setUploadError("");
    if (method === "postcode" || method === "latlng" || method === "city") {
      const upload = locationUploads[method];
      const points = upload.records
        .filter(record => upload.selectedKeys.has(record.key))
        .map(record => record.point);
      setFilters(prev => ({
        ...prev,
        location: {
          ...prev.location,
          method,
          uploadedPoints: points,
        },
      }));
    } else {
      setFilters(prev => ({
        ...prev,
        location: {
          ...prev.location,
          method,
          uploadedPoints: [],
        },
      }));
    }
  };

  const cancelUpload = (method: LocationUploadMethod) => {
    uploadIdRef.current[method]++;
    updateLocationUpload(method, emptyLocationUpload());
    setUploadError("");
    if (filters.location.method === method) {
      updateLocationPoints(method, []);
    }
  };

  const handleLocationFileError = (method: LocationUploadMethod, error: string) => {
    setUploadError(error);
    if (!error) return;
    uploadIdRef.current[method]++;
    updateLocationUpload(method, emptyLocationUpload());
    if (filters.location.method === method) {
      updateLocationPoints(method, []);
    }
  };

  const readUpload = async (
    file: File,
    method: LocationUploadMethod,
    parser: (file: File) => Promise<{ points: Array<{lat: number; lng: number}>; records: UploadedLocationRecord[]; report: UploadReport }>,
  ) => {
    const currentUploadId = ++uploadIdRef.current[method];
    updateLocationUpload(method, {
      file,
      fileState: "Uploading",
      report: null,
      records: [],
      selectedKeys: new Set(),
    });
    setUploadError("");
    if (filters.location.method === method) {
      updateLocationPoints(method, []);
    }
    try {
      const result = await parser(file);
      if (uploadIdRef.current[method] !== currentUploadId) return;
      updateLocationUpload(method, {
        file,
        fileState: "Uploaded",
        report: result.report,
        records: result.records,
        selectedKeys: new Set(result.records.map(record => record.key)),
      });
      if (filters.location.method === method) {
        updateLocationPoints(method, result.points);
      }
    } catch (error) {
      if (uploadIdRef.current[method] !== currentUploadId) return;
      setUploadError(error instanceof Error ? error.message : "Could not read this file.");
      updateLocationUpload(method, emptyLocationUpload());
      if (filters.location.method === method) {
        updateLocationPoints(method, []);
      }
    }
  };

  const removeScreenListUpload = () => {
    screenListUploadIdRef.current++;
    setScreenListFile(null);
    setScreenListError("");
    setScreenListReport(null);
    setScreenListRecords([]);
    setSelectedScreenListKeys(new Set());
    updateSection("screenList", { ids: [], configured: false });
  };

  const handleScreenListFileError = (error: string) => {
    setScreenListError(error);
    if (!error) return;
    screenListUploadIdRef.current++;
    setScreenListFile(null);
    setScreenListReport(null);
    setScreenListRecords([]);
    setSelectedScreenListKeys(new Set());
    updateSection("screenList", { ids: [], configured: true });
  };

  const readScreenListUpload = async (file: File) => {
    const currentUploadId = ++screenListUploadIdRef.current;
    setScreenListFile(file);
    setScreenListFileState("Uploading");
    setScreenListError("");
    setScreenListReport(null);
    setScreenListRecords([]);
    setSelectedScreenListKeys(new Set());
    updateSection("screenList", { enabled: true, ids: [], configured: true });
    try {
      const result = await parseScreenList(file, SCREENS);
      if (screenListUploadIdRef.current !== currentUploadId) return;
      updateSection("screenList", { ids: result.ids, configured: true });
      setScreenListRecords(result.records);
      setSelectedScreenListKeys(new Set(result.records.map(record => record.key)));
      setScreenListReport(result.report);
      setScreenListFileState("Uploaded");
      if (!result.ids.length) {
        setScreenListError("No screen IDs in this file match the current inventory.");
      }
    } catch (error) {
      if (screenListUploadIdRef.current !== currentUploadId) return;
      setScreenListError(error instanceof Error ? error.message : "Could not read this file.");
      setScreenListReport(null);
      setScreenListRecords([]);
      setSelectedScreenListKeys(new Set());
      updateSection("screenList", { ids: [], configured: true });
      setScreenListFile(null);
    }
  };

  const toggleLocationRecord = (key: string) => {
    const next = new Set(activeLocationUpload.selectedKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    updateLocationUpload(activeLocationMethod, { selectedKeys: next });
    updateLocationPoints(
      activeLocationMethod,
      activeLocationUpload.records
        .filter(record => next.has(record.key))
        .map(record => record.point),
    );
  };

  const toggleScreenListRecord = (key: string) => {
    const next = new Set(selectedScreenListKeys);
    if (next.has(key)) next.delete(key);
    else next.add(key);
    setSelectedScreenListKeys(next);
    updateSection("screenList", {
      ids: screenListRecords
        .filter(record => next.has(record.key))
        .map(record => record.id),
      configured: true,
    });
  };

  const planningZoneFreehand = filters.planningZone.drawCircleRadius === "";
  const planningZoneRadiusMin = filters.planningZone.drawCircleUnit === "km" ? 0.05 : 50;
  const planningZoneRadiusMax = filters.planningZone.drawCircleUnit === "km" ? 10 : 10000;
  const planningZoneRadius = planningZoneFreehand
    ? planningZoneRadiusMin
    : Math.min(
        planningZoneRadiusMax,
        Math.max(planningZoneRadiusMin, Number(filters.planningZone.drawCircleRadius) || planningZoneRadiusMin),
      );
  const sectionStyle = (order: number): CSSProperties | undefined =>
    v4Layout ? { order } : undefined;
  const budgetSymbol = v4Layout ? CURRENCY_SYMBOLS[filters.budget.currency] : "£";
  const formatCount = (format: string) => v4Layout && creativeCounts ? ` [${creativeCounts.formats[format].toLocaleString()}]` : "";
  const resolutionCount = (resolution: string) => v4Layout && creativeCounts ? ` [${creativeCounts.resolutions[resolution].toLocaleString()}]` : "";
  const selectedResolutions = filters.creativeType.resolutions ?? (filters.creativeType.resolution ? [filters.creativeType.resolution] : []);

  return (
    <div data-annotate="DOOH filter panel" className="w-[300px] xl:w-[340px] shrink-0 bg-[var(--surface-background-lvl2,#f7f7fa)] flex flex-col z-20 overflow-y-auto">
      <SmartCard title="DOOH Filters" ariaLabel="DOOH Filters">
        <div className="-mx-4 -mb-4 flex flex-col overflow-hidden rounded-b-[4px]">
          {/* 1. Location Filter */}
          <FilterCard style={sectionStyle(1)} title="Location" icon={<MapPin className="w-4 h-4" />} enabled={filters.location.enabled} onToggle={enabled => updateSection("location", { enabled })}>
          <div className="mb-4 pt-1 pb-1 max-w-full overflow-x-auto" role="group" aria-label="Location filter method">
            <FiberRoundedTabsBar wrap={false}>
              {(["audience", "postcode", ...(v4Layout ? ["city" as const] : []), "poi", "latlng"] as const).map(method => (
                <FiberTabButton
                  key={method}
                  label={method === "audience" ? "Saved Audience" : method === "postcode" ? "Postcode" : method === "city" ? "City" : method === "poi" ? "POI" : "Lat/Long"}
                  selected={filters.location.method === method}
                  onClick={() => selectLocationMethod(method)}
                />
              ))}
            </FiberRoundedTabsBar>
          </div>
          {filters.location.method === "audience" && <div className="space-y-3">
            {!selectedAudience ? (
              <>
                <label className="text-xs font-medium block text-[var(--surface-foreground-dynamic-neutral-default-regular,#282833)]">Select Saved Audience</label>
                <Select value={filters.location.audienceId} onValueChange={id => { updateSection("location", { audienceId: id }); incrementUse.mutate(id); }}>
                  <SelectTrigger className="h-8 text-sm"><SelectValue placeholder="Choose an audience" style={{ backgroundColor: "var(--surface-background-lvl2, #ffffff)", borderColor: "var(--border-dynamic-neutral-subtle-default, #c6c6cc)", color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)" }} /></SelectTrigger>
                  <SelectContent style={{ backgroundColor: "var(--surface-background-lvl1, #ffffff)", borderColor: "var(--border-dynamic-neutral-subtle-default, #e1e1e8)", color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)" }}>
                    {isError && <SelectItem value="error" disabled>Error loading audiences</SelectItem>}
                    {audiences?.map(a => <SelectItem key={a.id} value={a.id}>{a.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </>
            ) : (
              <div className="rounded border border-[var(--border-dynamic-brand-subtle-default,#d7bced)] bg-[var(--container-dynamic-brand-subtle-background-default,#f0e6f7)] p-3 relative">
                <button 
                  onClick={() => updateSection("location", { audienceId: "" })}
                  className="absolute top-2 right-2 text-[var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)] hover:text-[var(--surface-foreground-dynamic-error-default,#da294b)]"
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
          
          {(filters.location.method === "postcode" || (v4Layout && filters.location.method === "city")) && <div className="space-y-2">
            <LocationUpload
              method={activeLocationMethod}
              report={activeLocationUpload.report}
               records={activeLocationUpload.records.map(record => ({ key: record.key, label: record.label, detail: `${record.point.lat}, ${record.point.lng}` }))}
               selectedKeys={activeLocationUpload.selectedKeys}
              file={activeLocationUpload.file}
              fileState={activeLocationUpload.fileState}
              onSelect={(file) => void readUpload(file, activeLocationMethod, activeLocationMethod === "city" ? parseCityCsv : parsePostcodeCsv)}
              onRemove={() => cancelUpload(activeLocationMethod)}
              onError={(error) => handleLocationFileError(activeLocationMethod, error)}
               onToggleRecord={toggleLocationRecord}
            />
          </div>}
          
          {filters.location.method === "poi" && <div className="space-y-2">
            <PoiSearch values={filters.location.poiIds} onChange={poiIds => updateSection("location", { poiIds })} allowClearAll={allowClearAll} />
          </div>}
          
          {filters.location.method === "latlng" && <div className="space-y-2">
            <LocationUpload
              method="latlng"
              report={activeLocationUpload.report}
               records={activeLocationUpload.records.map(record => ({ key: record.key, label: record.label, detail: `${record.point.lat}, ${record.point.lng}` }))}
               selectedKeys={activeLocationUpload.selectedKeys}
              file={activeLocationUpload.file}
              fileState={activeLocationUpload.fileState}
              onSelect={(file) => void readUpload(file, "latlng", parseCoordinateCsv)}
              onRemove={() => cancelUpload("latlng")}
              onError={(error) => handleLocationFileError("latlng", error)}
               onToggleRecord={toggleLocationRecord}
            />
          </div>}

          {uploadError && <p className="text-[11px] text-[var(--surface-foreground-dynamic-error-default,#da294b)] mt-2" role="alert">{uploadError}</p>}
          
          {showRadius && (!pointRadiusOnly || filters.location.method === "poi" || filters.location.method === "latlng") && (
          <div className="mt-4 pt-4 border-t border-[var(--border-dynamic-neutral-subtle-default,#e1e1e8)]">
             <div className="flex items-center justify-between mb-3">
               <label className="text-xs font-medium text-[var(--surface-foreground-dynamic-neutral-default-regular,#282833)]">Radius around points</label>
               <Select value={filters.location.radiusUnit} onValueChange={(val: "m"|"km") => {
                 let current = Number(filters.location.radius) || (val === "km" ? 0.5 : 500);
                 if (val === "km" && filters.location.radiusUnit === "m") {
                   current = Math.min(10, Math.max(0.05, current / 1000));
                 } else if (val === "m" && filters.location.radiusUnit === "km") {
                   current = Math.min(10000, Math.max(50, current * 1000));
                 }
                 updateSection("location", { radiusUnit: val, radius: current });
               }}>
                 <SelectTrigger aria-label="Radius units" className="h-6 w-[85px] text-[11px]" style={{ backgroundColor: "var(--surface-background-lvl2, #ffffff)", borderColor: "var(--border-dynamic-neutral-subtle-default, #c6c6cc)", color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)" }}><SelectValue /></SelectTrigger>
                 <SelectContent style={{ backgroundColor: "var(--surface-background-lvl1, #ffffff)", borderColor: "var(--border-dynamic-neutral-subtle-default, #e1e1e8)", color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)" }}>
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
                 <Input style={{ backgroundColor: "var(--surface-background-lvl2, #ffffff)", borderColor: "var(--border-dynamic-neutral-subtle-default, #c6c6cc)", color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)" }} 
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
                       updateSection("location", { radius: pointRadiusOnly ? Number(v) : Math.max(min, Math.min(max, Number(v))) });
                     }
                   }}
                   onBlur={() => {
                     if (!pointRadiusOnly) return;
                     const min = filters.location.radiusUnit === "km" ? 0.05 : 50;
                     const max = filters.location.radiusUnit === "km" ? 10 : 10000;
                     updateSection("location", { radius: Math.max(min, Math.min(max, Number(filters.location.radius) || min)) });
                   }}
                   className="h-7 text-xs px-2" 
                 />
              </div>
           </div>
             </div>
          )}
        </FilterCard>

        {/* 2. Planning Zone */}
        <FilterCard style={sectionStyle(2)} title="Planning Zone" icon={<Map className="w-4 h-4" />} enabled={filters.planningZone.enabled} onToggle={enabled => {
          if (!enabled) {
            updateSection("planningZone", { enabled, drawMode: null });
          } else {
            updateSection("planningZone", { enabled });
          }
        }}>
          <div className="space-y-4">
              <div role="group" aria-label="Planning zone shape">
                <FiberRoundedTabsBar wrap={false}>
                  <FiberTabButton
                    label="Circle"
                    selected={filters.planningZone.drawShape === "circle"}
                    onClick={() => updateSection("planningZone", { drawShape: "circle", drawMode: null })}
                  />
                  <FiberTabButton
                    label="Polygon"
                    selected={filters.planningZone.drawShape === "polygon"}
                    onClick={() => updateSection("planningZone", { drawShape: "polygon", drawMode: null })}
                  />
                </FiberRoundedTabsBar>
             </div>

             {filters.planningZone.drawShape === "circle" && (
               <div className="space-y-3">
                 <div className="flex items-center justify-between">
                   <label className="text-xs font-medium text-[var(--surface-foreground-dynamic-neutral-default-regular,#282833)]">Radius (optional)</label>
                    <Select disabled={planningZoneFreehand} value={filters.planningZone.drawCircleUnit} onValueChange={(val: "m"|"km") => {
                      if (planningZoneFreehand) return;
                      let current = Number(filters.planningZone.drawCircleRadius) || planningZoneRadiusMin;
                      if (val === "km" && filters.planningZone.drawCircleUnit === "m") {
                        current /= 1000;
                      } else if (val === "m" && filters.planningZone.drawCircleUnit === "km") {
                        current *= 1000;
                      }
                      const nextMin = val === "km" ? 0.05 : 50;
                      const nextMax = val === "km" ? 10 : 10000;
                      updateSection("planningZone", {
                        drawCircleUnit: val,
                        drawCircleRadius: String(Math.min(nextMax, Math.max(nextMin, current))),
                        drawMode: null,
                      });
                       setDrawError("");
                   }}>
                     <SelectTrigger className="h-6 w-[85px] text-[11px]" style={{ backgroundColor: "var(--surface-background-lvl2, #ffffff)", borderColor: "var(--border-dynamic-neutral-subtle-default, #c6c6cc)", color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)" }}><SelectValue /></SelectTrigger>
                     <SelectContent style={{ backgroundColor: "var(--surface-background-lvl1, #ffffff)", borderColor: "var(--border-dynamic-neutral-subtle-default, #e1e1e8)", color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)" }}>
                       <SelectItem value="m" className="text-[11px]">meters</SelectItem>
                       <SelectItem value="km" className="text-[11px]">kilometers</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                  <div className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <FiberSlider
                        value={planningZoneRadius}
                        min={planningZoneRadiusMin}
                        max={planningZoneRadiusMax}
                        step={filters.planningZone.drawCircleUnit === "km" ? 0.05 : 50}
                        disabled={planningZoneFreehand}
                        ariaLabel="Planning zone radius"
                        onChange={value => {
                          updateSection("planningZone", { drawCircleRadius: String(value), drawMode: null });
                          setDrawError("");
                        }}
                      />
                    </div>
                    <Input
                      style={{ backgroundColor: "var(--surface-background-lvl2, #ffffff)", borderColor: "var(--border-dynamic-neutral-subtle-default, #c6c6cc)", color: "var(--surface-foreground-dynamic-neutral-variation, #13131a)" }}
                      type="number"
                      aria-label="Exact planning zone radius"
                      min={planningZoneRadiusMin}
                      max={planningZoneRadiusMax}
                      step="any"
                      disabled={planningZoneFreehand}
                      value={planningZoneFreehand ? "" : filters.planningZone.drawCircleRadius}
                      placeholder={planningZoneFreehand ? "Freehand" : undefined}
                      onChange={e => {
                        const value = e.target.value;
                        if (value === "") return;
                        const parsed = Number(value);
                        if (!Number.isFinite(parsed)) return;
                        updateSection("planningZone", {
                          drawCircleRadius: String(Math.min(planningZoneRadiusMax, Math.max(planningZoneRadiusMin, parsed))),
                          drawMode: null,
                        });
                        setDrawError("");
                      }}
                      onBlur={e => {
                        if (e.target.value === "") {
                          updateSection("planningZone", {
                            drawCircleRadius: String(planningZoneRadiusMin),
                            drawMode: null,
                          });
                        }
                      }}
                      className="h-7 w-[60px] px-2 text-xs"
                    />
                  </div>
                  <div className="flex items-center">
                    <Checkbox
                      labelValue="Freehand draw"
                      variant={planningZoneFreehand ? "Checked" : "Unchecked"}
                      onToggle={() => {
                        setFilters(prev => {
                          const planningZone = prev.planningZone;
                          const currentlyFreehand = planningZone.drawCircleRadius === "";
                          const radiusMin = planningZone.drawCircleUnit === "km" ? 0.05 : 50;
                          return {
                            ...prev,
                            planningZone: {
                              ...planningZone,
                              drawCircleRadius: currentlyFreehand ? String(radiusMin) : "",
                              drawMode: null,
                            },
                          };
                        });
                        setDrawError("");
                      }}
                    />
                  </div>
                  <FiberButton
                    variant="secondary"
                    className="w-full"
                    onClick={() => {
                      if (filters.planningZone.drawMode === "circle") {
                        updateSection("planningZone", { drawMode: null });
                      } else {
                        if (filters.planningZone.drawCircleRadius !== "") {
                          const r = Number(filters.planningZone.drawCircleRadius);
                          const max = filters.planningZone.drawCircleUnit === "km" ? 10 : 10000;
                          const min = filters.planningZone.drawCircleUnit === "km" ? 0.05 : 50;
                          if (isNaN(r) || r < min || r > max) {
                            setDrawError(`Radius must be between ${min} and ${max} ${filters.planningZone.drawCircleUnit}.`);
                            return;
                          }
                        }
                        updateSection("planningZone", { drawMode: "circle" });
                        setDrawError("");
                      }
                    }}
                  >
                    {filters.planningZone.drawMode === "circle" ? "Cancel Drawing" : "Draw on Map"}
                  </FiberButton>
                  {drawError && <p className="text-[11px] text-[var(--surface-foreground-dynamic-error-default,#da294b)]" role="alert">{drawError}</p>}
               </div>
             )}

              {filters.planningZone.drawShape === "polygon" && (
                <FiberButton
                  variant="secondary"
                  className="w-full"
                  onClick={() => updateSection("planningZone", { drawMode: filters.planningZone.drawMode === "polygon" ? null : "polygon" })}
                >
                  {filters.planningZone.drawMode === "polygon" ? "Cancel Drawing" : "Draw on Map"}
                </FiberButton>
              )}

            <div className="space-y-1">
              {filters.planningZone.zones.map((zone, index) => <div key={zone.id} className="flex items-center justify-between rounded bg-[var(--surface-background-lvl2,#f7f7fa)] p-2 text-xs border border-[var(--border-dynamic-neutral-subtle-default,#e1e1e8)]">
                <span className="text-[var(--surface-foreground-dynamic-neutral-disabled,#717180)] truncate mr-2" title={zone.label || `Zone ${index + 1}`}>
                  {zone.label || `Zone ${index + 1}: ${zone.type === "circle" ? `${Math.round(zone.radius ?? 0)}m circle` : `${zone.points?.length ?? 0}-pt poly`}`}
                </span>
                <button aria-label={`Remove zone ${index + 1}`} className="text-[var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)] hover:text-[var(--surface-foreground-dynamic-error-default,#da294b)] shrink-0" onClick={() => updateSection("planningZone", { zones: filters.planningZone.zones.filter(z => z.id !== zone.id) })}><X className="h-3 w-3" /></button>
              </div>)}
            </div>
          </div>
        </FilterCard>

        {/* 3. Venue Type */}
        <ScalarFacet allowClearAll={allowClearAll} dropdown={v4Layout} style={sectionStyle(4)} title="Venue Type" icon={<LayoutDashboard className="w-4 h-4" />} enabled={filters.venueType.enabled} values={VENUES} selected={filters.venueType.venues}
          onToggle={enabled => updateSection("venueType", { enabled })} onSelected={venues => updateSection("venueType", { venues })} />
        
        {/* 4. Publisher */}
        <ScalarFacet allowClearAll={allowClearAll} dropdown={v4Layout} screenCounts={v4Layout ? PUBLISHER_SCREEN_COUNTS : undefined} style={sectionStyle(6)} title="Publisher" icon={<Target className="w-4 h-4" />} enabled={filters.publishers.enabled} values={PUBLISHERS} selected={filters.publishers.publishers}
          onToggle={enabled => updateSection("publishers", { enabled })} onSelected={publishers => updateSection("publishers", { publishers })} />

        {/* 5. Day Part */}
        <FilterCard style={sectionStyle(7)} title="Day Part" icon={<Clock className="w-4 h-4" />} enabled={filters.daypart.enabled} onToggle={enabled => updateSection("daypart", { enabled })}>
          <div className="space-y-3">
             <FiberRoundedTabsBar wrap={false}>
               <FiberTabButton label="Presets" selected={filters.daypart.mode === "presets"} onClick={() => updateSection("daypart", { mode: "presets" })} />
               <FiberTabButton label="Custom" selected={filters.daypart.mode === "custom"} onClick={() => updateSection("daypart", { mode: "custom" })} />
             </FiberRoundedTabsBar>
            {filters.daypart.mode === "presets" ? <div className="grid grid-cols-2 gap-2">{DAYPART_PRESETS.map(preset => <button key={preset} onClick={() => updateSection("daypart", { presets: filters.daypart.presets.includes(preset) ? filters.daypart.presets.filter(p => p !== preset) : [...filters.daypart.presets, preset] })} className={`rounded border py-1.5 text-[11px] transition-colors ${filters.daypart.presets.includes(preset) ? "border-[var(--border-dynamic-brand-default,#7c33b5)] bg-[var(--container-dynamic-brand-subtle-background-default,#f0e6f7)] text-[var(--surface-foreground-dynamic-brand-default,#7c33b5)] font-medium" : "border-[var(--border-dynamic-neutral-subtle-default,#e1e1e8)] text-[var(--surface-foreground-dynamic-neutral-disabled,#717180)] hover:border-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)]"}`}>{preset}</button>)}</div>
              : (
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Input style={{ backgroundColor: "var(--surface-background-lvl2, #ffffff)", borderColor: "var(--border-dynamic-neutral-subtle-default, #c6c6cc)", color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)" }} aria-label="Start time" type="time" value={filters.daypart.customStart} onChange={e => updateSection("daypart", { customStart: e.target.value })} className="h-8 text-sm" />
                    <span>to</span>
                    <Input style={{ backgroundColor: "var(--surface-background-lvl2, #ffffff)", borderColor: "var(--border-dynamic-neutral-subtle-default, #c6c6cc)", color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)" }} aria-label="End time" type="time" value={filters.daypart.customEnd} onChange={e => updateSection("daypart", { customEnd: e.target.value })} className="h-8 text-sm" />
                  </div>
                  {filters.daypart.customStart >= filters.daypart.customEnd && (
                    <p className="text-[10px] text-[var(--surface-foreground-dynamic-error-default,#da294b)] mt-1">Start time must be before end time. Overnight ranges not supported.</p>
                  )}
                </div>
              )}
            <Select value={filters.daypart.applies} onValueChange={(applies: "Every Day" | "Weekdays" | "Weekends") => updateSection("daypart", { applies })}>
              <SelectTrigger className="h-8"><SelectValue /></SelectTrigger><SelectContent style={{ backgroundColor: "var(--surface-background-lvl1, #ffffff)", borderColor: "var(--border-dynamic-neutral-subtle-default, #e1e1e8)", color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)" }}><SelectItem value="Every Day">Every day</SelectItem><SelectItem value="Weekdays">Weekdays</SelectItem><SelectItem value="Weekends" style={{ backgroundColor: "var(--surface-background-lvl2, #ffffff)", borderColor: "var(--border-dynamic-neutral-subtle-default, #c6c6cc)", color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)" }}>Weekends</SelectItem></SelectContent>
            </Select>
          </div>
        </FilterCard>

        {/* 6. Budget */}
        <FilterCard style={sectionStyle(8)} title="Budget" icon={<Wallet className="w-4 h-4" />} enabled={filters.budget.enabled} onToggle={enabled => updateSection("budget", { enabled })}>
          <div className="space-y-3">
             {v4Layout && (
               <div>
                 <label htmlFor="dooh-currency" className="text-xs font-medium text-[var(--surface-foreground-dynamic-neutral-default-regular,#282833)]">Currency</label>
                 <Select value={filters.budget.currency} onValueChange={(currency: BudgetCurrency) => {
                   setFilters(previous => ({
                     ...previous,
                     budget: convertBudgetCurrency(previous.budget, currency),
                   }));
                 }}>
                   <SelectTrigger id="dooh-currency" className="h-8 mt-1" aria-label="Plan currency"><SelectValue /></SelectTrigger>
                   <SelectContent style={{ backgroundColor: "var(--surface-background-lvl1, #ffffff)", borderColor: "var(--border-dynamic-neutral-subtle-default, #e1e1e8)", color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)" }}>
                     <SelectItem value="GBP">GBP — British Pound (£)</SelectItem>
                     <SelectItem value="EUR">EUR — Euro (€)</SelectItem>
                     <SelectItem value="USD">USD — US Dollar ($)</SelectItem>
                   </SelectContent>
                 </Select>
               </div>
             )}
             <div>
               <label htmlFor="dooh-budget" className="text-xs font-medium text-[var(--surface-foreground-dynamic-neutral-default-regular,#282833)]">Total Budget ({budgetSymbol})</label>
               <Input style={{ backgroundColor: "var(--surface-background-lvl2, #ffffff)", borderColor: "var(--border-dynamic-neutral-subtle-default, #c6c6cc)", color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)" }} 
                 id="dooh-budget"
                 type="number" min={0} step="100" 
                 value={filters.budget.total} 
                 onChange={e => updateSection("budget", { total: e.target.value === "" ? "" : Math.max(0, Number(e.target.value)) })} 
                 className="h-8 mt-1" 
               />
             </div>
             <div>
               <label htmlFor="dooh-cpm" className="text-xs font-medium text-[var(--surface-foreground-dynamic-neutral-default-regular,#282833)]">CPM Ceiling ({budgetSymbol}, Optional)</label>
               <Input style={{ backgroundColor: "var(--surface-background-lvl2, #ffffff)", borderColor: "var(--border-dynamic-neutral-subtle-default, #c6c6cc)", color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)" }} 
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
        <FilterCard style={sectionStyle(5)} title={v4Layout ? "Creative" : "Creative Type"} icon={<MonitorPlay className="w-4 h-4" />} enabled={filters.creativeType.enabled} onToggle={enabled => updateSection("creativeType", { enabled })}>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-[var(--surface-foreground-dynamic-neutral-default-regular,#282833)]">Format</label>
              <Select value={filters.creativeType.format || "any"} onValueChange={format => updateSection("creativeType", { format: format === "any" ? "" : format })}>
                <SelectTrigger className="h-8 mt-1"><SelectValue /></SelectTrigger><SelectContent style={{ backgroundColor: "var(--surface-background-lvl1, #ffffff)", borderColor: "var(--border-dynamic-neutral-subtle-default, #e1e1e8)", color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)" }}><SelectItem value="any" style={{ backgroundColor: "var(--surface-background-lvl2, #ffffff)", borderColor: "var(--border-dynamic-neutral-subtle-default, #c6c6cc)", color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)" }}>{v4Layout ? "Display + Video" : "Display + Video (Both)"}{formatCount("")}</SelectItem>{CREATIVE_FORMATS.map(f => <SelectItem value={f} key={f}>{f}{formatCount(f)}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <label className="text-xs font-medium text-[var(--surface-foreground-dynamic-neutral-default-regular,#282833)]">Resolution</label>
              {multipleResolutions ? <div className="mt-2">
                <FacetDropdown
                  title="Resolution"
                  values={RESOLUTIONS}
                  selected={selectedResolutions}
                  onSelected={resolutions => updateSection("creativeType", { resolution: "", resolutions })}
                  dropdown
                  screenCounts={creativeCounts?.resolutions}
                  allowClearAll={allowClearAll}
                  preserveFullSelection
                />
              </div> : <Select value={filters.creativeType.resolution || "any"} onValueChange={resolution => updateSection("creativeType", { resolution: resolution === "any" ? "" : resolution })}>
                <SelectTrigger className="h-8 mt-1"><SelectValue /></SelectTrigger><SelectContent style={{ backgroundColor: "var(--surface-background-lvl1, #ffffff)", borderColor: "var(--border-dynamic-neutral-subtle-default, #e1e1e8)", color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)" }}><SelectItem value="any" style={{ backgroundColor: "var(--surface-background-lvl2, #ffffff)", borderColor: "var(--border-dynamic-neutral-subtle-default, #c6c6cc)", color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)" }}>Any{resolutionCount("")}</SelectItem>{RESOLUTIONS.map(r => <SelectItem value={r} key={r}>{r}{resolutionCount(r)}</SelectItem>)}</SelectContent>
              </Select>}
            </div>
            {v4Layout && creativeCounts && (
              <p className="text-xs font-medium text-[var(--surface-foreground-dynamic-neutral-default-regular,#282833)]" role="status" aria-live="polite">
                {creativeCounts.overall.toLocaleString()} {creativeCounts.overall === 1 ? "screen" : "screens"} matching format + resolution
              </p>
            )}
          </div>
        </FilterCard>

         {/* 8. Screen List */}
         <FilterCard style={sectionStyle(3)} title="Screen List" icon={<List className="w-4 h-4" />} enabled={filters.screenList.enabled} onToggle={enabled => updateSection("screenList", { enabled })}>
           <div className="space-y-2">
             <UploadPreviewOptions
               hasFile={Boolean(screenListFile)}
               ready={Boolean(screenListFile && screenListReport && screenListFileState === "Uploaded")}
             />
             <FiberDropZone
                accept=".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                acceptLabel="CSV or XLSX with a Screen ID column"
               file={screenListFile}
               fileState={screenListFileState}
               onFileSelect={(file) => void readScreenListUpload(file)}
               onFileRemove={removeScreenListUpload}
               onFileError={handleScreenListFileError}
             />
              {screenListFile && screenListReport && screenListFileState === "Uploaded" && (
                <UploadPreview
                  fileName={screenListFile.name}
                  records={screenListRecords}
                  selectedKeys={selectedScreenListKeys}
                  report={screenListReport}
                  noun="screen IDs"
                  onToggle={toggleScreenListRecord}
                  onRemoveFile={removeScreenListUpload}
                />
              )}
             {screenListError && <p className="text-[11px] text-[var(--surface-foreground-dynamic-error-default,#da294b)]" role="alert">{screenListError}</p>}
             <FiberButton variant="outline" size="compact" className="w-full" ariaLabel="Download screen list sample CSV" onClick={downloadScreenTemplate}>
               <Download size={14} aria-hidden />Download sample CSV
             </FiberButton>
           </div>
         </FilterCard>

        <div className="h-8 border-t-0" style={sectionStyle(9)} />
        </div>
      </SmartCard>
    </div>
  );
}

function ScalarFacet({ title, icon, enabled, values, selected, onToggle, onSelected, style, dropdown = false, screenCounts, allowClearAll = false }: {
  title: string; icon: ReactNode; enabled: boolean; values: string[]; selected: string[];
  onToggle: (value: boolean) => void; onSelected: (value: string[]) => void; style?: CSSProperties; dropdown?: boolean;
  screenCounts?: Record<string, number>;
  allowClearAll?: boolean;
}) {
  return <FilterCard style={style} title={title} icon={icon} enabled={enabled} onToggle={onToggle}>
    <FacetDropdown title={title} values={values} selected={selected} onSelected={onSelected} dropdown={dropdown} screenCounts={screenCounts} allowClearAll={allowClearAll} />
  </FilterCard>;
}

function FilterCard({ title, icon, enabled, onToggle, children, style }: { title: string; icon: ReactNode; enabled: boolean; onToggle: (enabled: boolean) => void; children: ReactNode; style?: CSSProperties }) {
  return (
    <section data-annotate={`DOOH filters: ${title}`} className="border-b border-[var(--border-dynamic-neutral-subtle-default,#e1e1e8)]" style={style}>
      <header className="px-4 py-3 flex items-center justify-between hover:bg-[var(--surface-background-lvl2,#f7f7fa)] transition-colors">
        <div className="flex items-center gap-2.5 text-[var(--surface-foreground-dynamic-neutral-default-regular,#282833)]">
          {icon}
          <span className="font-medium text-sm">{title}</span>
        </div>
        <Switch checked={enabled} onCheckedChange={onToggle} style={{ backgroundColor: enabled ? "var(--container-dynamic-brand-bold-background-default, #7c33b5)" : "var(--controls-background-inactive, #4b4b59)" }} />
      </header>
      {enabled && <div className="px-4 pb-5 pt-1 animate-in slide-in-from-top-2">{children}</div>}
    </section>
  );
}
