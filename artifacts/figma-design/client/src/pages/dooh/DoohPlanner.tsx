import { useState, useMemo, useEffect } from "react";
import { SCREENS, MOCK_POIS, DAYPART_RANGES, getDistance, isPointInPolygon } from "./data";
import { useAudiences } from "./api";
import { Sidebar, FilterState, DEFAULT_FILTERS } from "./components/Sidebar";
import { MapPanel } from "./components/MapPanel";
import { PlanOverview } from "./components/PlanOverview";
import { ScreenTable } from "./components/ScreenTable";

export default function DoohPlanner() {
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedScreenIds, setSelectedScreenIds] = useState<Set<string>>(new Set());
  const [hoveredScreenId, setHoveredScreenId] = useState<string | null>(null);

  const { data: audiences } = useAudiences();

  // Load audience from URL if passed (e.g. ?audience=AUD_001)
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

  // Compute matched screens
  const matchedScreens = useMemo(() => {
    const method = filters.location.method;
    const radius = filters.location.radius;
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
    const hasScreenList = filters.screenList.enabled && filters.screenList.ids.length > 0;
    if (targetPoints.length === 0 && !audiencePolygon?.length && !hasZones && !hasScreenList) {
      return [];
    }

    let results = SCREENS;

    // 1. Location filter
    if (audiencePolygon && audiencePolygon.length >= 3) {
      results = results.filter(s => isPointInPolygon({ lat: s.lat, lng: s.lng }, audiencePolygon));
    } else if (targetPoints.length > 0) {
      results = results.filter(s => {
        return targetPoints.some(tp => getDistance(s.lat, s.lng, tp.lat, tp.lng) <= radius);
      });
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

    // 3. Venue
    if (filters.venueType.enabled && filters.venueType.venues.length > 0) {
      results = filters.venueType.anyAll === "ALL" && filters.venueType.venues.length > 1
        ? []
        : results.filter(s => filters.venueType.venues.includes(s.venue));
    }

    // 4. Publisher
    if (filters.publishers.enabled && filters.publishers.publishers.length > 0) {
      results = filters.publishers.anyAll === "ALL" && filters.publishers.publishers.length > 1
        ? []
        : results.filter(s => filters.publishers.publishers.includes(s.publisher));
    }

    // 5. Creative
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

    // 6. Daypart. Inventory must cover the selected time and applicable days.
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

    // 7. Explicit screen list.
    if (filters.screenList.enabled && filters.screenList.ids.length > 0) {
      const ids = new Set(filters.screenList.ids);
      results = results.filter(screen => ids.has(screen.id));
    }

    // 8. Budget. Keep a deterministic, affordable subset in Screen ID order.
    if (filters.budget.enabled) {
      if (filters.budget.cpm != null) results = results.filter(screen => screen.cpm <= filters.budget.cpm!);
      let cumulativeSpend = 0;
      results = [...results].sort((a, b) => a.id.localeCompare(b.id)).filter(screen => {
        const spend = screen.impressions / 1000 * screen.cpm;
        if (cumulativeSpend + spend > filters.budget.total) return false;
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

  return (
    <div className="dooh-planner flex flex-col flex-1 h-full">
      <div className="flex px-6 py-2 items-center bg-white border-b border-[var(--surface-background-lvl4,#e1e1e8)] text-sm">
        <span className="text-purple-700 font-medium">{filters.location.audienceId ? "Audience selected" : "Choose geography"}</span>
        <span className="mx-2 text-[var(--surface-foreground-static-neutral-lvl4,#c6c6cc)]">→</span>
        <span className="font-bold text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)]">Find Screens</span>
        <span className="mx-2 text-[var(--surface-foreground-static-neutral-lvl4,#c6c6cc)]">→</span>
        <span className="text-[var(--surface-foreground-static-neutral-lvl4,#c6c6cc)]">Activate</span>
      </div>

      <div className="dooh-workspace flex flex-1 overflow-hidden">
        <Sidebar filters={filters} setFilters={setFilters} />
        
        <div className="dooh-map-pane flex-1 flex flex-col relative border-l border-r border-[var(--surface-background-lvl4,#e1e1e8)]">
          <MapPanel 
            screens={matchedScreens}
            hoveredScreenId={hoveredScreenId}
            onScreenClick={setHoveredScreenId}
            zones={filters.planningZone.zones}
            onZonesChange={zones => setFilters(prev => ({ ...prev, planningZone: { ...prev.planningZone, zones } }))}
            drawMode={filters.planningZone.drawMode}
            onDrawComplete={() => setFilters(prev => ({ ...prev, planningZone: { ...prev.planningZone, drawMode: null } }))}
          />
        </div>

        <PlanOverview 
          matchedScreens={matchedScreens} 
          selectedScreens={matchedScreens.filter(s => selectedScreenIds.has(s.id))}
          budget={filters.budget.enabled ? filters.budget.total : null}
        />
      </div>

      <div className="dooh-results h-[280px] shrink-0 border-t border-[var(--surface-background-lvl4,#e1e1e8)] bg-white flex flex-col">
        <ScreenTable 
          screens={matchedScreens}
          selectedScreenIds={selectedScreenIds}
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
        />
      </div>
    </div>
  );
}
