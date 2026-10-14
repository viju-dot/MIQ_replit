import { useState, useMemo, useEffect } from "react";
import { SCREENS, MOCK_POIS, DAYPART_RANGES, getDistance, isPointInPolygon, ScreenData } from "../data";
import { useAudiences } from "../api";
import { SidebarV2, FilterStateV2, DEFAULT_FILTERS_V2, EXCHANGE_RATES, PlanningZone, createDemoFilters, DEMO_UPLOADS } from "./v2planner-sidebar";
import { MapPanelV2 } from "./v2planner-map-panel";
import { RightPanelV2, PlanOverviewCards } from "./v2planner-right-panel";
import { FiberButton, IconButton, SmartCard, TabsBarUnderline } from "./primitives";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Download, Maximize2 } from "lucide-react";
import { useScreenExport } from "./useScreenExport";
import { countCreativeOptions } from "./creativeCounts";
import "./DoohPlannerV2.css";
import { V5Overview, type V5OverviewMode } from "../v5/V5Overview";

export default function DoohPlannerV2({
  demoView = false,
  showRadius = true,
  v4Layout = false,
  v5Layout = false,
}: {
  demoView?: boolean;
  showRadius?: boolean;
  v4Layout?: boolean;
  v5Layout?: boolean;
}) {
  const [filters, setFilters] = useState<FilterStateV2>(() => demoView ? createDemoFilters(v4Layout) : DEFAULT_FILTERS_V2);
  const [selectedScreenIds, setSelectedScreenIds] = useState<Set<string>>(
    () => demoView ? new Set(DEMO_UPLOADS.screenList.records.map(record => record.id)) : new Set(),
  );
  const [hoveredScreenId, setHoveredScreenId] = useState<string | null>(null);
  const [mapOverviewMode, setMapOverviewMode] = useState<V5OverviewMode>("bubbles");
  const [view, setView] = useState<"map" | "list">("map");
  const [showMapOverview, setShowMapOverview] = useState(false);
  const [showMapExpanded, setShowMapExpanded] = useState(false);
  const [showScreenCpm, setShowScreenCpm] = useState(true);
  const [budgetView, setBudgetView] = useState(false);

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

  const { matchedScreens, smartCandidates, creativeCounts } = useMemo(() => {
    const computeResults = (creativeType = filters.creativeType) => {
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
    } else if (method === "postcode" || (v4Layout && method === "city")) {
      targetPoints = filters.location.uploadedPoints;
    } else if (method === "poi") {
      targetPoints = MOCK_POIS
        .filter(poi => filters.location.poiIds.includes(poi.id))
        .map(poi => ({ lat: poi.lat, lng: poi.lng }));
    } else if (method === "latlng") {
      targetPoints = filters.location.uploadedPoints;
    }

    if (!filters.location.enabled) targetPoints = [];
    
    let baseResults = SCREENS;

    // 1. Location filter
    if (filters.location.enabled) {
      if (targetPoints.length === 0 && !audiencePolygon?.length) {
        if (method === "audience" && filters.location.audienceId) baseResults = [];
      } else if (audiencePolygon && audiencePolygon.length >= 3) {
        baseResults = baseResults.filter(s => isPointInPolygon({ lat: s.lat, lng: s.lng }, audiencePolygon));
      } else if (targetPoints.length > 0) {
        baseResults = Number.isFinite(radius) && radius >= 50 && radius <= 10000 ? baseResults.filter(s => {
          return targetPoints.some(tp => getDistance(s.lat, s.lng, tp.lat, tp.lng) <= radius);
        }) : [];
      }
    }

    // 2. Screen List
    if (filters.screenList.enabled && filters.screenList.configured) {
      const uploadedIds = new Set(filters.screenList.ids);
      baseResults = baseResults.filter(screen => uploadedIds.has(screen.id));
    }

    // 3. Venue Type
    if (filters.venueType.enabled && filters.venueType.venues.length > 0) {
      baseResults = baseResults.filter(s => filters.venueType.venues.includes(s.venue));
    }

    // 4. Publisher
    if (filters.publishers.enabled && filters.publishers.publishers.length > 0) {
      baseResults = baseResults.filter(s => filters.publishers.publishers.includes(s.publisher));
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
        baseResults = baseResults.filter(screen => dayMatches(screen.availability.days) &&
          ranges.some(([start, end]) => end > start && screen.availability.start <= start && screen.availability.end >= end));
      }
    }

    // 6. Creative Type
    if (creativeType.enabled) {
      if (creativeType.format) {
        baseResults = baseResults.filter(s => s.creativeFormat === creativeType.format);
      }
      if (creativeType.resolution) {
        baseResults = baseResults.filter(s => s.creativeRes === creativeType.resolution);
      }
    }

    let finalMatched = baseResults;
    let finalSmartCandidates = baseResults;

    // 2. Planning Zone (Apply to finalMatched, ignore for finalSmartCandidates to allow picking anywhere matching other filters)
    if (filters.planningZone.enabled && filters.planningZone.zones.length > 0) {
      finalMatched = finalMatched.filter(s => {
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

    // 7. Budget
    if (filters.budget.enabled) {
      const rate = EXCHANGE_RATES[filters.budget.currency] || 1;
      const budgetTotalGBP = Number(filters.budget.total) / rate;
      const budgetCpmGBP = filters.budget.cpm === null || filters.budget.cpm === "" ? null : Number(filters.budget.cpm) / rate;

      const applyBudget = (arr: ScreenData[]) => {
        let res = arr;
        if (budgetCpmGBP != null) res = res.filter(screen => screen.cpm <= budgetCpmGBP);
        let cumulativeSpend = 0;
        return [...res].sort((a, b) => a.id.localeCompare(b.id)).filter(screen => {
          const spend = screen.impressions / 1000 * screen.cpm; // in GBP
          if (cumulativeSpend + spend > budgetTotalGBP) return false;
          cumulativeSpend += spend;
          return true;
        });
      };
      
      finalMatched = applyBudget(finalMatched);
      finalSmartCandidates = applyBudget(finalSmartCandidates);
    }

    return { matchedScreens: finalMatched, smartCandidates: finalSmartCandidates };
    };

    return {
      ...computeResults(),
      creativeCounts: v4Layout ? countCreativeOptions(
        filters.creativeType,
        (format, resolution) => computeResults({ enabled: true, format, resolution }).matchedScreens.length,
      ) : undefined,
    };
  }, [filters, audiences, v4Layout]);

  useEffect(() => {
    const ids = new Set(matchedScreens.map(screen => screen.id));
    setSelectedScreenIds(previous => {
      const next = new Set(Array.from(previous).filter(id => ids.has(id)));
      return next.size === previous.size ? previous : next;
    });
  }, [matchedScreens]);

  const locationConfigured = filters.location.enabled && (
    (filters.location.method === "audience" && !!filters.location.audienceId) ||
    (filters.location.method === "poi" && filters.location.poiIds.length > 0) ||
    ((filters.location.method === "postcode" || filters.location.method === "latlng" || (v4Layout && filters.location.method === "city")) && filters.location.uploadedPoints.length > 0)
  );
  const locationMethod = locationConfigured
    ? filters.location.method
    : filters.screenList.enabled && filters.screenList.configured
      ? "screenlist"
      : null;
      
  const activeSources = {
    geoPlanner: filters.location.enabled && !!filters.location.audienceId,
    planningZone: filters.planningZone.enabled && filters.planningZone.zones.length > 0,
    postcode: filters.location.enabled && filters.location.uploadedPointsByMethod.postcode.length > 0,
    latlng: filters.location.enabled && filters.location.uploadedPointsByMethod.latlng.length > 0,
    poi: filters.location.enabled && filters.location.poiIds.length > 0,
    ...(v4Layout ? {
      city: filters.location.enabled && filters.location.uploadedPointsByMethod.city.length > 0,
      screenList: filters.screenList.enabled && filters.screenList.configured,
    } : {}),
  };

  // Match Source reports each active input independently. This keeps a
  // postcode count visible even when postcode + planning-zone intersection has
  // no results, instead of incorrectly turning every other source into 0.
  const { sourceCounts, sourceScreenIds } = useMemo(() => {
    const radiusMeters = Number(filters.location.radius) *
      (filters.location.radiusUnit === "km" ? 1000 : 1);
    const idsAround = (points: Array<{ lat: number; lng: number }>) => {
      if (!points.length || !Number.isFinite(radiusMeters) || radiusMeters < 0) return [];
      return SCREENS.filter(screen =>
        points.some(point => getDistance(screen.lat, screen.lng, point.lat, point.lng) <= radiusMeters)
      ).map(screen => screen.id);
    };

    const selectedAudience = audiences?.find(
      audience => audience.id === filters.location.audienceId,
    );
    const audiencePoints = selectedAudience?.geoDefinition?.points?.map(point => ({
      lat: point.lat,
      lng: point.lng,
    })) ?? [];
    const audiencePolygon = selectedAudience?.geoType === "polygon"
      ? selectedAudience.geoDefinition.polygon
      : undefined;

    const planningZoneIds = activeSources.planningZone
      ? SCREENS.filter(screen => filters.planningZone.zones.some(zone => {
          if (zone.type === "circle" && zone.center && zone.radius) {
            return getDistance(screen.lat, screen.lng, zone.center.lat, zone.center.lng) <= zone.radius;
          }
          return zone.type === "polygon" && zone.points
            ? isPointInPolygon({ lat: screen.lat, lng: screen.lng }, zone.points)
            : false;
        })).map(screen => screen.id)
      : [];

    const sourceScreenIds = {
      geoPlanner: activeSources.geoPlanner
        ? audiencePolygon && audiencePolygon.length >= 3
          ? SCREENS.filter(screen => isPointInPolygon(
              { lat: screen.lat, lng: screen.lng },
              audiencePolygon,
            )).map(screen => screen.id)
          : idsAround(audiencePoints)
        : [],
      planningZone: planningZoneIds,
      ...(v4Layout ? {
        city: activeSources.city ? idsAround(filters.location.uploadedPointsByMethod.city) : [],
        screenList: activeSources.screenList
          ? SCREENS.filter(screen => filters.screenList.ids.includes(screen.id)).map(screen => screen.id)
          : [],
      } : {}),
      postcode: activeSources.postcode
        ? idsAround(filters.location.uploadedPointsByMethod.postcode)
        : [],
      latlng: activeSources.latlng
        ? idsAround(filters.location.uploadedPointsByMethod.latlng)
        : [],
      poi: activeSources.poi
        ? idsAround(MOCK_POIS
            .filter(poi => filters.location.poiIds.includes(poi.id))
            .map(poi => ({ lat: poi.lat, lng: poi.lng })))
        : [],
    };
    return {
      sourceScreenIds,
      sourceCounts: {
        geoPlanner: sourceScreenIds.geoPlanner.length,
        planningZone: sourceScreenIds.planningZone.length,
        postcode: sourceScreenIds.postcode.length,
        latlng: sourceScreenIds.latlng.length,
        poi: sourceScreenIds.poi.length,
        ...(v4Layout ? {
          city: sourceScreenIds.city?.length ?? 0,
          screenList: sourceScreenIds.screenList?.length ?? 0,
        } : {}),
      },
    };
  }, [activeSources.geoPlanner, activeSources.planningZone, activeSources.postcode,
    activeSources.latlng, activeSources.poi, activeSources.city, activeSources.screenList, audiences, filters, v4Layout]);
      
  const selectedScreens = matchedScreens.filter(screen => selectedScreenIds.has(screen.id));
  const { csvDownload, handleExport } = useScreenExport(
    selectedScreens.length ? selectedScreens : matchedScreens,
    filters.budget.currency,
  );

  const renderMapPanel = (expanded = false) => (
    <MapPanelV2
      overviewLayer={v5Layout ? v4Layer => <V5Overview mode={mapOverviewMode} onModeChange={setMapOverviewMode} v4Layer={v4Layer}
        screens={matchedScreens} hoveredScreenId={hoveredScreenId} onScreenClick={setHoveredScreenId}
        currency={filters.budget.currency} showCpm={showScreenCpm} sourceScreenIds={sourceScreenIds} /> : undefined}
      screens={matchedScreens}
      smartCandidates={smartCandidates}
      hoveredScreenId={hoveredScreenId}
      onScreenClick={setHoveredScreenId}
      zones={filters.planningZone.zones}
      onZonesChange={zones => setFilters(prev => ({ ...prev, planningZone: { ...prev.planningZone, zones } }))}
      drawMode={filters.planningZone.drawMode}
      drawCircleRadius={filters.planningZone.drawCircleRadius !== "" ? Number(filters.planningZone.drawCircleRadius) * (filters.planningZone.drawCircleUnit === "km" ? 1000 : 1) : undefined}
      onDrawComplete={() => setFilters(prev => ({ ...prev, planningZone: { ...prev.planningZone, drawMode: null } }))}
      expanded={expanded}
      locationSource={locationMethod}
      activeSources={activeSources}
      sourceCounts={sourceCounts}
      sourceScreenIds={v4Layout ? sourceScreenIds : undefined}
      v4Layout={v4Layout}
      currency={filters.budget.currency}
      showCpm={!v4Layout || showScreenCpm}
      selectedScreenIds={selectedScreenIds}
      onSmartSelectionCapture={(zone: PlanningZone, screenIds: string[]) => {
        setFilters(prev => ({
          ...prev,
          planningZone: {
            ...prev.planningZone,
            enabled: true,
            zones: [...prev.planningZone.zones, zone],
          },
        }));
        setSelectedScreenIds(prev => {
          const next = new Set(prev);
          screenIds.forEach((id: string) => next.add(id));
          return next;
        });
      }}
    />
  );

  const renderMapControls = (expanded = false) => (
    <div
      className={`absolute top-[16px] right-[16px] ${expanded ? "bottom-[16px]" : "bottom-[260px]"} z-[1000] flex flex-col items-end gap-2 pointer-events-none`}
    >
      <div className="pointer-events-auto flex items-center gap-2 shrink-0">
        <FiberButton
          variant={showMapOverview ? "solid" : "secondary"}
          onClick={() => setShowMapOverview(s => !s)}
          aria-expanded={showMapOverview}
          aria-controls="map-plan-overview"
        >
          {showMapOverview ? "Hide Plan Overview" : "Show Plan Overview"}
        </FiberButton>
        {!expanded && (
          <IconButton
            icon={Maximize2}
            variant="secondary"
            onClick={() => setShowMapExpanded(true)}
            ariaLabel="Expand view"
            title="Expand view"
          />
        )}
      </div>
      {showMapOverview && (
        <div id="map-plan-overview" className="pointer-events-auto w-[280px] min-h-0 overflow-y-auto mt-2 dooh-scrollbar pb-2">
          <SmartCard title="Plan Overview" ariaLabel="Map Plan Overview">
            <PlanOverviewCards
              matchedScreens={matchedScreens}
              selectedScreens={selectedScreens}
              budget={filters.budget.enabled ? Number(filters.budget.total) : null}
              currency={filters.budget.currency}
              layout="vertical"
              budgetView={budgetView}
              onBudgetViewChange={v4Layout ? setBudgetView : undefined}
            />
          </SmartCard>
        </div>
      )}
    </div>
  );

  return (
    <div className="dooh-v2-planner flex flex-col flex-1 min-h-0 font-fiber">
      <div className="flex flex-1 min-h-0 items-start gap-6">
        <SidebarV2
          filters={filters}
          setFilters={setFilters}
          demoView={demoView}
          showRadius={showRadius}
          v4Layout={v4Layout}
          creativeCounts={creativeCounts}
        />
        
        <div className="flex-1 min-w-0 min-h-0 flex flex-col sticky top-4 self-start bg-transparent">
          <SmartCard
            title="Explorer"
            rightOnDivider
            right={
              <TabsBarUnderline
                options={["Map", "Screen List"]}
                value={view === "map" ? "Map" : "Screen List"}
                onChange={value => setView(value === "Map" ? "map" : "list")}
                ariaLabel="Screen views"
              />
            }
          >
          {csvDownload && <div role="status" className="shrink-0 px-4 py-2 text-xs bg-[var(--container-dynamic-brand-subtle-background-default,#f0e6f7)] text-[var(--surface-foreground-dynamic-brand-default,#7c33b5)]">
            CSV ready: {csvDownload.count.toLocaleString()} screen{csvDownload.count === 1 ? "" : "s"}.{" "}
            <a href={csvDownload.url} download="DOOH-Shortlist.csv" className="underline font-semibold">Download CSV again</a>
          </div>}
          {view === "map" && (
            <div className="relative flex-1 min-h-0 flex flex-col">
              {!showMapExpanded && renderMapPanel()}
              {renderMapControls()}
              <Dialog open={showMapExpanded} onOpenChange={setShowMapExpanded}>
                <DialogContent className="z-[2000] flex h-[calc(100vh-32px)] w-[calc(100vw-32px)] max-w-none flex-col gap-0 overflow-hidden border-0 bg-[var(--surface-background-lvl1,#ffffff)] p-0 sm:max-w-none">
                  <div className="flex h-full min-h-0 flex-col">
                    <DialogTitle
                      className="flex h-[48px] shrink-0 items-center border-b border-solid px-4 pr-14 text-left text-[length:var(--body-md-medium-size,14px)] font-medium"
                      style={{
                        borderColor: "var(--border-static-subtle-neutral,#e1e1e8)",
                        color: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
                      }}
                    >
                      Expanded map view
                    </DialogTitle>
                    <div className="relative min-h-0 flex-1">
                      {showMapExpanded && renderMapPanel(true)}
                      {renderMapControls(true)}
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          )}

        {view === "list" && <div className="flex-1 flex flex-col min-h-0"><RightPanelV2 
          matchedScreens={matchedScreens}
          selectedScreens={selectedScreens}
          budget={filters.budget.enabled ? Number(filters.budget.total) : null}
          currency={filters.budget.currency}
          selectedScreenIds={selectedScreenIds}
          onSelect={(id, checked) => setSelectedScreenIds(prev => {
            const next = new Set(prev);
            if (checked) next.add(id);
            else next.delete(id);
            return next;
          })}
          onSelectMany={(ids, checked) => setSelectedScreenIds(prev => {
            const next = new Set(prev);
            ids.forEach(id => checked ? next.add(id) : next.delete(id));
            return next;
          })}
          onHover={setHoveredScreenId}
          highlightedScreenId={hoveredScreenId}
          showCpm={showScreenCpm}
          onShowCpmChange={v4Layout ? setShowScreenCpm : undefined}
        /></div>}
          </SmartCard>
        </div>
      </div>
      <div className="dooh-actions-bar" role="region" aria-label="Planner actions">
        <FiberButton variant="outline" onClick={handleExport} disabled={!matchedScreens.length}>
          <Download className="size-4" aria-hidden="true" /> Export
        </FiberButton>
      </div>
    </div>
  );
}
