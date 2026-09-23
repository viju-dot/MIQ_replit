import { useState, useMemo, useEffect } from "react";
import { SCREENS, MOCK_POIS, DAYPART_RANGES, getDistance, isPointInPolygon, ScreenData } from "../data";
import { useAudiences } from "../api";
import { SidebarV2, FilterStateV2, DEFAULT_FILTERS_V2, EXCHANGE_RATES } from "./v2planner-sidebar";
import { MapPanelV2 } from "./v2planner-map-panel";
import { RightPanelV2 } from "./v2planner-right-panel";
import { FiberButton } from "./primitives";
import { FiberRoundedTabsBar, FiberTabButton } from "@/components/FiberTabItem";
import { Download, SlidersHorizontal } from "lucide-react";
import { useScreenExport } from "./useScreenExport";
import "./DoohPlannerV2.css";

export default function DoohPlannerV2() {
  const [filters, setFilters] = useState<FilterStateV2>(DEFAULT_FILTERS_V2);
  const [selectedScreenIds, setSelectedScreenIds] = useState<Set<string>>(new Set());
  const [hoveredScreenId, setHoveredScreenId] = useState<string | null>(null);
  const [view, setView] = useState<"map" | "list">("map");

  const { data: audiences } = useAudiences();

  // Load audience from URL if passed (e.g. ?version=v2&audience=AUD_001)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const aud = params.get("audience");
    if (aud) {
      setFilters(prev => ({
        ...prev,
        location: { ...prev.location, enabled: true, method: "audience", audienceId: aud }
      }));
    }
  }, []);

  const matchedScreens = useMemo(() => {
    const method = filters.location.method;
    const radius = Number(filters.location.radius) * (filters.location.radiusUnit === "km" ? 1000 : 1);
    const selectedAudience = method === "audience"
      ? audiences?.find(a => a.id === filters.location.audienceId)
      : undefined;
    const audiencePolygon = filters.location.enabled && selectedAudience?.geoType === "polygon"
      ? selectedAudience.geoDefinition.polygon
      : undefined;
    
    let targetPoints: Array<{lat: number, lng: number}> = [];

    if (method === "audience" && filters.location.audienceId) {
      const aud = audiences?.find(a => a.id === filters.location.audienceId);
      if (aud && aud.geoDefinition.points) {
        targetPoints = aud.geoDefinition.points.map(p => ({ lat: p.lat, lng: p.lng }));
      }
    } else if (method === "postcode") {
      targetPoints = filters.location.uploadedPoints;
    } else if (method === "poi" && filters.location.poiId) {
      const poi = MOCK_POIS.find(p => p.id === filters.location.poiId);
      if (poi) targetPoints = [{ lat: poi.lat, lng: poi.lng }];
    } else if (method === "latlng") {
      targetPoints = filters.location.uploadedPoints;
    }

    if (!filters.location.enabled) targetPoints = [];
    const hasZones = filters.planningZone.enabled && filters.planningZone.zones.length > 0;
    
    let results = SCREENS;

    // 1. Location filter
    if (filters.location.enabled) {
      if (targetPoints.length === 0 && !audiencePolygon?.length) {
        // An unconfigured location is not a filter. Keep the mock inventory
        // visible on first visit, but never ignore a missing requested audience.
        if (method === "audience" && filters.location.audienceId) results = [];
      } else if (audiencePolygon && audiencePolygon.length >= 3) {
        results = results.filter(s => isPointInPolygon({ lat: s.lat, lng: s.lng }, audiencePolygon));
      } else if (targetPoints.length > 0) {
        results = Number.isFinite(radius) && radius >= 50 && radius <= 10000 ? results.filter(s => {
          return targetPoints.some(tp => getDistance(s.lat, s.lng, tp.lat, tp.lng) <= radius);
        }) : [];
      }
    }

    // 2. Planning Zone
    if (filters.planningZone.enabled && filters.planningZone.zones.length > 0) {
      results = results.filter(s => {
        return filters.planningZone.zones.some(z => {
          if (z.type === "circle" && z.radius && z.center) {
            return getDistance(s.lat, s.lng, z.center.lat, z.center.lng) <= z.radius;
          } else if (z.type === "polygon" && z.points) {
            return isPointInPolygon({ lat: s.lat, lng: s.lng }, z.points);
          }
          return false;
        });
      });
    }

    // 3. Venue Type
    if (filters.venueType.enabled && filters.venueType.venues.length > 0) {
      results = results.filter(s => filters.venueType.venues.includes(s.venue));
    }

    // 4. Publisher
    if (filters.publishers.enabled && filters.publishers.publishers.length > 0) {
      results = results.filter(s => filters.publishers.publishers.includes(s.publisher));
    }

    // 5. Day Part
    if (filters.daypart.enabled) {
      const dayMatches = (screenDays: "Every Day" | "Weekdays" | "Weekends") =>
        filters.daypart.applies === "Every Day"
          ? screenDays === "Every Day"
          : screenDays === "Every Day" || screenDays === filters.daypart.applies;
      const ranges = filters.daypart.mode === "presets"
        ? filters.daypart.presets.map(preset => DAYPART_RANGES[preset]).filter(Boolean)
        : [[filters.daypart.customStart, filters.daypart.customEnd].map(value => {
            const [hours, minutes] = value.split(":").map(Number);
            return hours * 60 + minutes;
          }) as [number, number]];
      if (ranges.length > 0) {
        results = results.filter(screen => dayMatches(screen.availability.days) &&
          ranges.some(([start, end]) => end > start && screen.availability.start <= start && screen.availability.end >= end));
      }
    }

    // 6. Creative Type
    if (filters.creativeType.enabled) {
      if (filters.creativeType.format) {
        results = results.filter(s => s.creativeFormat === filters.creativeType.format);
      }
      if (filters.creativeType.resolution === "custom") {
        const width = Number(filters.creativeType.customWidth);
        const height = Number(filters.creativeType.customHeight);
        const valid = /^\d+$/.test(filters.creativeType.customWidth) &&
          /^\d+$/.test(filters.creativeType.customHeight) &&
          width >= 1 && width <= 16384 && height >= 1 && height <= 16384;
        results = valid ? results.filter(s => s.creativeRes === `${width}x${height}`) : [];
      } else if (filters.creativeType.resolution) {
        results = results.filter(s => s.creativeRes === filters.creativeType.resolution);
      }
    }

    // 7. Budget
    if (filters.budget.enabled) {
      const rate = EXCHANGE_RATES[filters.budget.currency] || 1;
      const budgetTotalGBP = Number(filters.budget.total) / rate;
      const budgetCpmGBP = filters.budget.cpm === null || filters.budget.cpm === "" ? null : Number(filters.budget.cpm) / rate;

      if (budgetCpmGBP != null) results = results.filter(screen => screen.cpm <= budgetCpmGBP);
      let cumulativeSpend = 0;
      results = [...results].sort((a, b) => a.id.localeCompare(b.id)).filter(screen => {
        const spend = screen.impressions / 1000 * screen.cpm; // in GBP
        if (cumulativeSpend + spend > budgetTotalGBP) return false;
        cumulativeSpend += spend;
        return true;
      });
    }

    return results;
  }, [filters, audiences]);

  useEffect(() => {
    const ids = new Set(matchedScreens.map(screen => screen.id));
    setSelectedScreenIds(previous => {
      const next = new Set(Array.from(previous).filter(id => ids.has(id)));
      return next.size === previous.size ? previous : next;
    });
  }, [matchedScreens]);

  const locationMethod = filters.location.enabled ? filters.location.method : null;
  const selectedScreens = matchedScreens.filter(screen => selectedScreenIds.has(screen.id));
  const { csvDownload, handleExport } = useScreenExport(
    selectedScreens.length ? selectedScreens : matchedScreens,
    filters.budget.currency,
  );

  return (
    <div className="dooh-v2-planner flex flex-col flex-1 min-h-0 font-fiber">
      <div className="flex flex-1 min-h-0 gap-6 overflow-hidden">
        <SidebarV2 filters={filters} setFilters={setFilters} />
        
        <div className="flex-1 min-w-0 min-h-0 flex flex-col relative bg-transparent">
          <div className="shrink-0 flex flex-wrap items-center justify-between gap-4 pb-4">
            <div role="group" aria-label="Screen views">
              <FiberRoundedTabsBar>
                <FiberTabButton label="Map" selected={view === "map"} onClick={() => setView("map")} />
                <FiberTabButton label="Screen List" selected={view === "list"} onClick={() => setView("list")} />
              </FiberRoundedTabsBar>
            </div>
            <div className="ml-auto flex items-center gap-2">
              <FiberButton size="compact" variant="outline" onClick={handleExport} disabled={!matchedScreens.length}>
                <Download className="size-4" aria-hidden="true" /> Export
              </FiberButton>
              <FiberButton size="compact" disabled={!matchedScreens.length} onClick={() => {
                setView("list");
                requestAnimationFrame(() => document.getElementById("dooh-plan-overview")?.focus());
              }}>
                <SlidersHorizontal className="size-4" aria-hidden="true" /> Apply Filters
              </FiberButton>
            </div>
          </div>
          {csvDownload && <div role="status" className="shrink-0 px-4 py-2 text-xs bg-purple-50 text-purple-900">
            CSV ready: {csvDownload.count.toLocaleString()} screen{csvDownload.count === 1 ? "" : "s"}.{" "}
            <a href={csvDownload.url} download="DOOH-Shortlist.csv" className="underline font-semibold">Download CSV again</a>
          </div>}
          {view === "map" && <MapPanelV2 
            screens={matchedScreens}
            hoveredScreenId={hoveredScreenId}
            onScreenClick={setHoveredScreenId}
            zones={filters.planningZone.zones}
            onZonesChange={zones => setFilters(prev => ({ ...prev, planningZone: { ...prev.planningZone, zones } }))}
            drawMode={filters.planningZone.drawMode}
            onDrawComplete={() => setFilters(prev => ({ ...prev, planningZone: { ...prev.planningZone, drawMode: null } }))}
            locationSource={locationMethod}
          />}

        {view === "list" && <div className="flex-1 min-h-0 overflow-y-auto"><RightPanelV2 
          matchedScreens={matchedScreens}
          selectedScreens={selectedScreens}
          selectedScreenIds={selectedScreenIds}
          budget={filters.budget.enabled ? Number(filters.budget.total) : null}
          currency={filters.budget.currency}
          onSelect={(id, checked) => {
            setSelectedScreenIds(prev => {
              const next = new Set(prev);
              if (checked) next.add(id); else next.delete(id);
              return next;
            });
          }}
          onSelectAll={(checked) => {
            if (checked) setSelectedScreenIds(new Set(matchedScreens.map(s => s.id)));
            else setSelectedScreenIds(new Set());
          }}
          onHover={setHoveredScreenId}
          highlightedScreenId={hoveredScreenId}
        /></div>}
        </div>
      </div>
    </div>
  );
}
