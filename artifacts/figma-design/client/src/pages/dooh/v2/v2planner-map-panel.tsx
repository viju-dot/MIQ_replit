import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import L, { LatLngExpression } from "leaflet";
import {
  Circle,
  MapContainer,
  Marker,
  Polygon,
  Polyline,
  TileLayer,
  Tooltip,
  useMap,
  useMapEvents,
} from "react-leaflet";
import { Target, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { ScreenData, getDistance } from "../data";
import { PlanningZone } from "./v2planner-sidebar";
import { CARD_BG, CARD_SHADOW, GRID, MUTED, TITLE, FONT, FiberButton, FiberSlider } from "./primitives";
import { V4ClusterTooltip, V4Currency, V4ScreenTooltip, buildV4SourceMembership, v4ClusterIcon, v4CssColor, v4FocusTooltipHandler, v4PinIcon, v4ResolvedColor } from "./v4-map-helpers";
import { SmartSelectionMapEvents, SmartPreviewCircle, SmartSelectionControl } from "./v2planner-smart-selection";

interface Props {
  screens: ScreenData[];
  smartCandidates?: ScreenData[];
  hoveredScreenId: string | null;
  onScreenClick: (id: string) => void;
  zones?: PlanningZone[];
  onZonesChange?: (zones: PlanningZone[]) => void;
  drawMode?: "circle" | "polygon" | null;
  drawCircleRadius?: number;
  onDrawComplete?: () => void;
  expanded?: boolean;
  locationSource?: string | null; // "audience", "postcode", "poi", "latlng", "screenlist", etc.
  activeSources?: { geoPlanner: boolean; planningZone: boolean; postcode: boolean; latlng: boolean; poi: boolean; city?: boolean; screenList?: boolean };
  sourceCounts?: Record<"geoPlanner" | "planningZone" | "postcode" | "latlng" | "poi", number> & { city?: number; screenList?: number };
  v4Layout?: boolean;
  currency?: V4Currency;
  showCpm?: boolean;
  sourceScreenIds?: Record<string, string[]>;
  selectedScreenIds?: Set<string>;
  onSmartSelectionCapture?: (zone: PlanningZone, selectedIds: string[]) => void;
}

const noop = () => undefined;

const SOURCE_COLORS = {
  geoPlanner: "#7c33b5",
  planningZone: "#b45309",
  postcode: "#059669",
  city: "#0891b2",
  latlng: "#0f766e",
  poi: "#2563eb",
  default: "#13131a",
} as const;

const getSourceColor = (sourceKey: string) => {
  return SOURCE_COLORS[sourceKey as keyof typeof SOURCE_COLORS] ?? SOURCE_COLORS.default;
};

const pinIcon = (active: boolean, color: string, isSelected: boolean = false, isCandidate: boolean = false) => {
  const borderColor = isCandidate ? '#7c33b5' : (isSelected ? '#13131a' : 'var(--surface-background-lvl1, #ffffff)');
  const glow = isCandidate ? ', 0 0 0 4px rgba(124, 51, 181, 0.3)' : '';
  return L.divIcon({
    className: "",
    iconSize: active ? [24, 24] : [18, 18],
    iconAnchor: active ? [12, 12] : [9, 9],
    html: `<span style="display:block;width:100%;height:100%;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${color};border:2px solid ${borderColor};box-shadow:0 2px 6px var(--shadow-lvl8, rgba(113,113,128,0.15))${glow};transition:all 0.2s ease;"></span>`,
  });
};

const clusterIcon = (count: number, color: string, isSelected: boolean = false, isCandidate: boolean = false) => {
  const borderColor = isCandidate ? '#7c33b5' : (isSelected ? '#13131a' : 'var(--surface-background-lvl1, #ffffff)');
  const glow = isCandidate ? ', 0 0 0 4px rgba(124, 51, 181, 0.3)' : '';
  return L.divIcon({
    className: "",
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    html: `<span style="display:flex;width:38px;height:38px;align-items:center;justify-content:center;border-radius:999px;background:${color};color:var(--container-dynamic-brand-bold-foreground-default, #ffffff);border:2px solid ${borderColor};box-shadow:0 2px 8px var(--shadow-lvl8, rgba(113,113,128,0.2))${glow};font-family:${FONT.replace(/"/g, "'")};font-weight:700;font-size:12px;transition:transform 0.2s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">${count}</span>`,
  });
};

function MapSizeSync() {
  const map = useMap();
  useEffect(() => {
    let frame = 0;
    const observer = new ResizeObserver(() => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => map.invalidateSize({ pan: false }));
    });
    observer.observe(map.getContainer());
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [map]);
  return null;
}

function InitialBounds({ screens }: { screens: ScreenData[] }) {
  const map = useMap();
  const didRun = useRef(false);
  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;
    if (screens.length) {
      map.fitBounds(
        L.latLngBounds(screens.map((screen) => [screen.lat, screen.lng])),
        { padding: [48, 48], maxZoom: 14 },
      );
    }
  }, [map, screens]);
  return null;
}

function FocusHovered({ screen }: { screen: ScreenData | undefined; }) {
  const map = useMap();
  useEffect(() => {
    if (!screen) return;
    const targetZoom = Math.max(map.getZoom(), 15);
    map.panTo([screen.lat, screen.lng], { animate: true });
    if (map.getZoom() < targetZoom) map.setZoom(targetZoom);
  }, [map, screen]);
  return null;
}

function MapControls({ screens }: { screens: ScreenData[] }) {
  const map = useMap();
  const reset = () => {
    if (screens.length) {
      map.fitBounds(
        L.latLngBounds(screens.map((screen) => [screen.lat, screen.lng])),
        { padding: [48, 48], maxZoom: 14 },
      );
    } else {
      map.setView([54.5, -3.2], 6);
    }
  };

  return (
    <div
      className="absolute right-[var(--spacing-200,16px)] bottom-[var(--spacing-200,16px)] z-[1000] flex flex-col overflow-hidden rounded-[var(--radius-50,4px)]"
      style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW, border: `1px solid ${GRID}` }}
      onDoubleClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <button type="button" aria-label="Refresh map view" title="Refresh view" className="h-[34px] w-[34px] flex items-center justify-center transition-colors hover:bg-black/5" style={{ color: TITLE }} onClick={reset}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.04858 10C2.6025 12.8362 4.88726 15 7.78857 15C11.2173 15 13.9972 12.2215 13.9972 8.79373C13.9972 5.36592 11.2173 2.58746 7.78857 2.58746C5.58079 2.58746 3.64234 3.73715 2.57141 5.48512M2.57141 5.48512H5.67713M2.57141 5.48512V2.38139" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <button type="button" aria-label="Zoom in" className="h-[34px] w-[34px] flex items-center justify-center transition-colors hover:bg-black/5" style={{ color: TITLE, borderTop: `1px solid ${GRID}` }} onClick={() => map.zoomIn()}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 3.33334V12.6667M3.33334 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <button type="button" aria-label="Zoom out" className="h-[34px] w-[34px] flex items-center justify-center transition-colors hover:bg-black/5" style={{ color: TITLE, borderTop: `1px solid ${GRID}` }} onClick={() => map.zoomOut()}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.33334 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
    </div>
  );
}

function DynamicScale() {
  const map = useMap();
  const [scaleDistance, setScaleDistance] = useState("500 m");

  useEffect(() => {
    const updateScale = () => {
      const bounds = map.getBounds();
      const center = map.getCenter();
      const edge = L.latLng(center.lat, bounds.getEast());
      const dist = center.distanceTo(edge);
      const quarterDist = dist / 4;
      if (quarterDist > 1000) {
        setScaleDistance(`${(quarterDist / 1000).toFixed(1)} km`);
      } else {
        setScaleDistance(`${Math.round(quarterDist / 50) * 50} m`);
      }
    };
    map.on('moveend', updateScale);
    updateScale();
    return () => { map.off('moveend', updateScale); };
  }, [map]);

  return (
    <div className="text-[length:var(--body-sm-medium-size,12px)] font-medium text-right mt-[var(--spacing-100,8px)] pt-[var(--spacing-100,8px)]" style={{ fontFamily: FONT, color: MUTED, borderTop: `1px solid ${GRID}` }}>
      Approx {scaleDistance}
    </div>
  );
}

function MapLegend({ activeSources, sourceCounts, v4Layout }: { activeSources?: Props["activeSources"], sourceCounts: Record<string, number>, v4Layout?: boolean }) {
  const sources = [
    { id: "geoPlanner", label: "Geo Planner", color: SOURCE_COLORS.geoPlanner },
    { id: "planningZone", label: "Planning Zone", color: SOURCE_COLORS.planningZone },
    { id: "postcode", label: "Postcode", color: SOURCE_COLORS.postcode },
    ...(activeSources?.city !== undefined ? [{ id: "city", label: "City", color: SOURCE_COLORS.city }] : []),
    { id: "latlng", label: "Lat/Long", color: SOURCE_COLORS.latlng },
    { id: "poi", label: "POI", color: SOURCE_COLORS.poi },
    ...(v4Layout && activeSources?.screenList !== undefined ? [{ id: "screenList", label: "Screen List", color: SOURCE_COLORS.poi }] : []),
  ].map((s) => v4Layout ? { ...s, color: v4CssColor(s.id) } : s);

  return (
    <div className="absolute bottom-[var(--spacing-200,16px)] left-[var(--spacing-200,16px)] z-[1000] rounded-[var(--radius-50,4px)] p-[var(--spacing-200,16px)] w-[240px]"
      style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW, border: `1px solid ${GRID}` }}
      onDoubleClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
      <h3 className="text-[length:var(--body-md-medium-size,14px)] font-bold mb-[var(--spacing-150,12px)]" style={{ fontFamily: FONT, color: TITLE }}>Match Source</h3>
      <div className="flex flex-col gap-[var(--spacing-100,8px)]">
        {sources.map(s => {
          const isActive = activeSources && activeSources[s.id as keyof typeof activeSources];
          const count = sourceCounts[s.id] || 0;
          return (
            <div key={s.id} className="flex items-center justify-between gap-[var(--spacing-100,8px)]">
              <div className="flex items-center gap-[var(--spacing-100,8px)]">
                <div className="w-[12px] h-[12px] rounded-full shadow-sm" style={{ backgroundColor: isActive ? s.color : "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)", border: `1px solid ${CARD_BG}`, opacity: isActive ? 1 : 0.4 }}></div>
                <span className="text-[length:var(--body-sm-regular-size,12px)]" style={{ fontFamily: FONT, color: isActive ? TITLE : MUTED }}>{s.label}</span>
              </div>
              <span className="text-[length:var(--body-sm-regular-size,12px)] font-medium" style={{ fontFamily: FONT, color: isActive ? TITLE : MUTED }}>
                {isActive ? (count === 1 ? "1 screen" : `${count.toLocaleString()} screens`) : "Not added"}
              </span>
            </div>
          );
        })}
      </div>
      <DynamicScale />
    </div>
  );
}

function ClusteredScreens({
  screens,
  hoveredScreenId,
  onScreenClick,
  sourceMap,
  selectedScreenIds = new Set(),
  candidateIds = new Set(),
  smartSelectionActive = false,
  onSmartCapture,
  sourceMembership,
  v4Layout = false,
  currency = "GBP",
  showCpm = true,
}: Pick<Props, "screens" | "hoveredScreenId" | "onScreenClick" | "selectedScreenIds"> & {
  sourceMap: Map<string, string>;
  sourceMembership?: Map<string, string[]>;
  v4Layout?: boolean;
  currency?: V4Currency;
  showCpm?: boolean;
  candidateIds?: Set<string>;
  smartSelectionActive?: boolean;
  onSmartCapture?: (latlng: L.LatLng) => void;
}) {
  const map = useMap();
  const [revision, setRevision] = useState(0);
  const [spiderCluster, setSpiderCluster] = useState<string | null>(null);

  useMapEvents({
    zoomend: () => {
      setSpiderCluster(null);
      setRevision((value) => value + 1);
    },
    moveend: () => setRevision((value) => value + 1),
  });

  const clusters = useMemo(() => {
    const cells = new Map<string, ScreenData[]>();
    screens.forEach((screen) => {
      const point = map.latLngToLayerPoint([screen.lat, screen.lng]);
      const key =
        screen.id === hoveredScreenId
          ? `hovered-${screen.id}`
          : `${Math.floor(point.x / 56)}:${Math.floor(point.y / 56)}`;
      cells.set(key, [...(cells.get(key) ?? []), screen]);
    });
    return Array.from(cells.entries()).map(([key, members]) => {
      const counts: Record<string, number> = {};
      members.forEach(m => {
        const s = sourceMap.get(m.id) || "default";
        counts[s] = (counts[s] || 0) + 1;
      });
      const dominantSource = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];

      return {
        key,
        screens: members,
        dominantSource,
        lat: members.reduce((sum, item) => sum + item.lat, 0) / members.length,
        lng: members.reduce((sum, item) => sum + item.lng, 0) / members.length,
      };
    });
  }, [screens, hoveredScreenId, map, revision, sourceMap]);

  const screenMarker = (screen: ScreenData, position?: LatLngExpression) => {
    const isSelected = selectedScreenIds.has(screen.id);
    const isCandidate = candidateIds.has(screen.id);
    const sourceKey = sourceMap.get(screen.id) || "default";
    const pinColor = getSourceColor(sourceKey);
    return (
      <Marker
        key={screen.id}
        title={v4Layout ? `Screen ${screen.id}` : undefined}
        position={position ?? [screen.lat, screen.lng]}
        icon={v4Layout ? v4PinIcon(screen.id === hoveredScreenId, sourceKey, isSelected, isCandidate) : pinIcon(screen.id === hoveredScreenId, pinColor, isSelected, isCandidate)}
        zIndexOffset={screen.id === hoveredScreenId ? 1000 : (isCandidate ? 600 : (isSelected ? 500 : 0))}
        eventHandlers={{
          ...(v4Layout ? { add: v4FocusTooltipHandler } : {}),
          click: (e) => {
            if (smartSelectionActive && onSmartCapture) {
              L.DomEvent.stopPropagation(e);
              onSmartCapture(L.latLng(screen.lat, screen.lng));
              return;
            }
            map.setView(position ?? [screen.lat, screen.lng], Math.max(map.getZoom(), 15));
            onScreenClick(screen.id);
          },
        }}
      >
        {v4Layout ? (
          <Tooltip direction="top" offset={[0, -12]} opacity={1} className="fiber-tooltip fiber-v4-tooltip">
            <V4ScreenTooltip screen={screen} sources={sourceMembership?.get(screen.id) ?? []} currency={currency} showCpm={showCpm} />
          </Tooltip>
        ) : (
        <Tooltip direction="top" offset={[0, -10]} opacity={1} className="fiber-tooltip">
          <div className="flex flex-col gap-1 text-[length:var(--body-sm-regular-size,12px)] p-1" style={{ fontFamily: FONT, color: TITLE }}>
            <strong className="text-[length:var(--body-sm-medium-size,12px)]">{screen.id}</strong>
            <div style={{ color: MUTED }}>{screen.publisher}</div>
            <div className="font-medium mt-1 pt-1" style={{ borderTop: `1px solid ${GRID}` }}>CPM: £{screen.cpm.toFixed(2)}</div>
          </div>
        </Tooltip>
        )}
      </Marker>
    );
  };

  return (
    <>
      {clusters.map((cluster) => {
        if (cluster.screens.length === 1) return screenMarker(cluster.screens[0]);

        if (spiderCluster === cluster.key) {
          const center = L.latLng(cluster.lat, cluster.lng);
          const centerPoint = map.latLngToLayerPoint(center);
          return (
            <Fragment key={cluster.key}>
              {cluster.screens.map((screen, index) => {
                const angle = (Math.PI * 2 * index) / cluster.screens.length;
                const ring = 38 + Math.floor(index / 12) * 20;
                const endpoint = map.layerPointToLatLng([
                  centerPoint.x + Math.cos(angle) * ring,
                  centerPoint.y + Math.sin(angle) * ring,
                ]);
                return (
                  <Fragment key={screen.id}>
                    <Polyline positions={[center, endpoint]} pathOptions={{ color: "var(--border-dynamic-neutral-subtle-default, #e1e1e8)", weight: 2 }} />
                    {screenMarker(screen, endpoint)}
                  </Fragment>
                );
              })}
            </Fragment>
          );
        }

        const isSelected = cluster.screens.some(s => selectedScreenIds.has(s.id));
        const isCandidate = cluster.screens.some(s => candidateIds.has(s.id));
        const clusterColor = getSourceColor(cluster.dominantSource);
        return (
          <Marker
            key={cluster.key}
            title={v4Layout ? `${cluster.screens.length} matched screens. Click to expand.` : undefined}
            position={[cluster.lat, cluster.lng]}
            icon={v4Layout ? v4ClusterIcon(cluster.screens.length, cluster.dominantSource, isSelected, isCandidate) : clusterIcon(cluster.screens.length, clusterColor, isSelected, isCandidate)}
            zIndexOffset={isCandidate ? 600 : (isSelected ? 500 : 0)}
            eventHandlers={{
              ...(v4Layout ? { add: v4FocusTooltipHandler } : {}),
              click: (e) => {
                if (smartSelectionActive && onSmartCapture) {
                   L.DomEvent.stopPropagation(e);
                   onSmartCapture(L.latLng(cluster.lat, cluster.lng));
                   return;
                }
                if (map.getZoom() < map.getMaxZoom()) {
                  map.setView([cluster.lat, cluster.lng], Math.min(map.getZoom() + 2, map.getMaxZoom()));
                } else {
                  setSpiderCluster(cluster.key);
                }
              },
            }}
          >
            {v4Layout ? (
              <Tooltip direction="top" offset={[0, -18]} opacity={1} className="fiber-tooltip fiber-v4-tooltip">
                <V4ClusterTooltip screens={cluster.screens} currency={currency} showCpm={showCpm} action={smartSelectionActive ? "Click to capture this area" : "Click to expand and see individual screens"} />
              </Tooltip>
            ) : (
            <Tooltip direction="top" offset={[0, -18]} className="fiber-tooltip">
              <span style={{ fontFamily: FONT }}>{cluster.screens.length} matched screens — {smartSelectionActive ? "click to capture area" : "click to expand"}</span>
            </Tooltip>
            )}
          </Marker>
        );
      })}
    </>
  );
}

function ZoneLayers({
  zones,
  onZonesChange,
  v4Layout,
}: {
  zones: PlanningZone[];
  onZonesChange: (zones: PlanningZone[]) => void;
  v4Layout?: boolean;
}) {
  const zc = v4Layout ? v4ResolvedColor("planningZone") : "#7c33b5";
  const removeButton = (zone: PlanningZone) => (
    <Tooltip permanent direction="center" opacity={1} className="fiber-map-zone-label">
      <button
        type="button"
        className="font-medium px-[var(--spacing-100,8px)] py-[var(--spacing-50,4px)] rounded-[var(--radius-25,2px)] transition-colors hover:bg-black/5"
        style={{ fontFamily: FONT, color: "var(--container-dynamic-brand-bold-background-default, #7c33b5)", backgroundColor: CARD_BG, boxShadow: CARD_SHADOW, border: `1px solid ${GRID}`, fontSize: '12px' }}
        onClick={(event) => {
          L.DomEvent.stopPropagation(event.nativeEvent);
          onZonesChange(zones.filter((item) => item.id !== zone.id));
        }}
      >
        Remove zone
      </button>
    </Tooltip>
  );

  return (
    <>
      {zones.map((zone) => {
        if (zone.type === "circle" && zone.center && zone.radius != null) {
          return (
            <Circle key={zone.id} center={zone.center} radius={zone.radius} pathOptions={{ color: zc, fillColor: zc, fillOpacity: 0.15, weight: 2 }}>
              {removeButton(zone)}
            </Circle>
          );
        }
        if (zone.type === "polygon" && zone.points && zone.points.length >= 3) {
          return (
            <Polygon key={zone.id} positions={zone.points} pathOptions={{ color: zc, fillColor: zc, fillOpacity: 0.15, weight: 2, ...(v4Layout ? { dashArray: "6 5" } : {}) }}>
              {removeButton(zone)}
            </Polygon>
          );
        }
        return null;
      })}
    </>
  );
}

function DrawingLayer({
  mode,
  circleRadius,
  zones,
  onZonesChange,
  onDrawComplete,
  v4Layout,
}: {
  v4Layout?: boolean;
  mode: "circle" | "polygon";
  circleRadius?: number;
  zones: PlanningZone[];
  onZonesChange: (zones: PlanningZone[]) => void;
  onDrawComplete: () => void;
}) {
  const map = useMap();
  const [points, setPoints] = useState<L.LatLng[]>([]);
  const dc = v4Layout ? v4ResolvedColor("planningZone") : "#7c33b5";

  useEffect(() => {
    setPoints([]);
    map.getContainer().style.cursor = "crosshair";
    return () => {
      map.getContainer().style.cursor = "";
    };
  }, [map, mode]);

  useMapEvents({
    click(event) {
      // Leaflet receives native clicks before React's bubbling handlers.
      // Drawing toolbar actions must never add a point underneath the button.
      if ((event.originalEvent.target as Element | null)?.closest("button, input, select, [role='button']")) return;
      if (mode === "circle") {
        if (circleRadius && circleRadius > 0) {
          onZonesChange([
            ...zones,
            {
              id: `zone-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              type: "circle",
              center: { lat: event.latlng.lat, lng: event.latlng.lng },
              radius: circleRadius,
            },
          ]);
          onDrawComplete();
          return;
        }

        if (points.length === 1) {
          const radius = map.distance(points[0], event.latlng);
          onZonesChange([
            ...zones,
            {
              id: `zone-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
              type: "circle",
              center: { lat: points[0].lat, lng: points[0].lng },
              radius,
            },
          ]);
          setPoints([]);
          onDrawComplete();
          return;
        }
      }
      setPoints((current) => [...current, event.latlng]);
    },
  });

  const finishPolygon = () => {
    if (points.length < 3) return;
    onZonesChange([
      ...zones,
      {
        id: `zone-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        type: "polygon",
        points: points.map(({ lat, lng }) => ({ lat, lng })),
      },
    ]);
    setPoints([]);
    onDrawComplete();
  };

  const stopMapEvent = (event: React.MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <>
      {mode === "circle" && points[0] && (
        <Circle center={points[0]} radius={5} pathOptions={{ color: dc, fillColor: dc, fillOpacity: 0.4 }} />
      )}
      {mode === "polygon" && points.length > 0 && (
        <>
          <Polyline positions={points} pathOptions={{ color: dc, dashArray: "6 5", weight: 2 }} />
          {points.map((point, index) => (
            <Circle key={index} center={point} radius={5} pathOptions={{ color: dc, fillColor: dc, fillOpacity: 1, weight: 2 }} />
          ))}
        </>
      )}
      <div
        className="absolute left-1/2 top-[var(--spacing-200,16px)] z-[1000] flex -translate-x-1/2 items-center gap-[var(--spacing-100,8px)] rounded-[var(--radius-50,4px)] px-[var(--spacing-200,16px)] py-[var(--spacing-100,8px)]"
        style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW, border: `1px solid ${GRID}` }}
        onClick={stopMapEvent}
        onDoubleClick={stopMapEvent}
        onMouseDown={stopMapEvent}
      >
        <span className="text-[length:var(--body-sm-medium-size,12px)] font-medium mr-[var(--spacing-100,8px)]" style={{ fontFamily: FONT, color: TITLE }}>
          {mode === "circle"
            ? (circleRadius && circleRadius > 0)
              ? "Click map to place circle"
              : points.length ? "Click the circle edge" : "Click the circle centre"
            : `Click polygon vertices (${points.length})`}
        </span>
        {mode === "polygon" && (
          <button
            type="button"
            disabled={points.length < 3}
            className="rounded-[var(--radius-25,2px)] px-[12px] py-[4px] font-medium text-[length:var(--body-sm-medium-size,12px)] disabled:cursor-not-allowed disabled:opacity-40 transition-colors"
            style={{ 
              backgroundColor: "var(--container-dynamic-brand-bold-background-default, #7c33b5)", 
              color: "var(--container-dynamic-brand-bold-foreground-default, #ffffff)",
              fontFamily: FONT 
            }}
            onClick={finishPolygon}
          >
            Finish
          </button>
        )}
        {points.length > 0 && (
          <button 
            type="button" 
            className="rounded-[var(--radius-25,2px)] px-[12px] py-[4px] font-medium text-[length:var(--body-sm-medium-size,12px)] transition-colors hover:bg-black/5" 
            style={{ 
              backgroundColor: "transparent", 
              color: TITLE,
              border: `1px solid ${GRID}`,
              fontFamily: FONT 
            }} 
            onClick={() => setPoints((current) => current.slice(0, -1))}
          >
            Undo
          </button>
        )}
        <button
          type="button"
          className="rounded-[var(--radius-25,2px)] px-[12px] py-[4px] font-medium text-[length:var(--body-sm-medium-size,12px)] transition-colors hover:bg-black/5"
          style={{ 
            backgroundColor: "transparent", 
            color: MUTED,
            border: `1px solid ${GRID}`,
            fontFamily: FONT 
          }} 
          onClick={() => {
            setPoints([]);
            onDrawComplete();
          }}
        >
          Cancel
        </button>
      </div>
    </>
  );
}

export function MapPanelV2({
  screens,
  smartCandidates,
  hoveredScreenId,
  onScreenClick,
  zones = [],
  onZonesChange = noop,
  drawMode = null,
  drawCircleRadius,
  onDrawComplete = noop,
  expanded = false,
  locationSource = null,
  activeSources,
  sourceCounts = { geoPlanner: 0, planningZone: 0, postcode: 0, latlng: 0, poi: 0 },
  selectedScreenIds = new Set(),
  onSmartSelectionCapture,
  v4Layout = false,
  currency = "GBP",
  showCpm = true,
  sourceScreenIds,
}: Props) {
  const hoveredScreen = screens.find((screen) => screen.id === hoveredScreenId);

  const [smartSelectionActive, setSmartSelectionActive] = useState(false);
  const [smartRadius, setSmartRadius] = useState<number>(500);
  const [smartRadiusUnit, setSmartRadiusUnit] = useState<"m" | "km">("m");
  const [previewCenter, setPreviewCenter] = useState<L.LatLng | null>(null);
  const [smartError, setSmartError] = useState<string | null>(null);
  const [, refreshThemeColors] = useState(0);

  useEffect(() => {
    if (!v4Layout) return;
    const observer = new MutationObserver(() => refreshThemeColors(value => value + 1));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class", "data-theme", "style"],
    });
    return () => observer.disconnect();
  }, [v4Layout]);

  const displayScreens = smartSelectionActive ? (smartCandidates || screens) : screens;
  const activeRadiusMeters = smartRadiusUnit === "km" ? smartRadius * 1000 : smartRadius;

  const v4Membership = useMemo(
    () => (v4Layout ? buildV4SourceMembership(displayScreens, sourceScreenIds, activeSources as Record<string, boolean | undefined> | undefined) : null),
    [v4Layout, displayScreens, sourceScreenIds, activeSources],
  );

  const { sourceMap } = useMemo(() => {
    if (v4Membership) return { sourceMap: v4Membership.primary };
    const activeKeys = activeSources ? [
      activeSources.geoPlanner && "geoPlanner",
      activeSources.planningZone && "planningZone",
      activeSources.postcode && "postcode",
      activeSources.city && "city",
      activeSources.latlng && "latlng",
      activeSources.poi && "poi"
    ].filter(Boolean) as string[] : [];

    const map = new Map<string, string>();
    if (activeKeys.length === 0) {
      displayScreens.forEach(s => map.set(s.id, "default"));
      return { sourceMap: map };
    }

    displayScreens.forEach(s => {
      let hash = 0;
      for (let i = 0; i < s.id.length; i++) hash += s.id.charCodeAt(i);
      const assigned = activeKeys[hash % activeKeys.length];
      map.set(s.id, assigned);
    });
    return { sourceMap: map };
}, [displayScreens, activeSources, v4Membership]);

  useEffect(() => {
    if (drawMode) {
      setSmartSelectionActive(false);
      setSmartError(null);
    }
  }, [drawMode]);

  const handleActivateSmart = (active: boolean) => {
    setSmartSelectionActive(active);
    if (active) {
      setSmartError(null);
      if (drawMode) onDrawComplete();
    }
  };

  const candidateIds = useMemo(() => {
    if (!smartSelectionActive || !previewCenter) return new Set<string>();
    const ids = new Set<string>();
    displayScreens.forEach(s => {
      if (getDistance(s.lat, s.lng, previewCenter.lat, previewCenter.lng) <= activeRadiusMeters) {
         ids.add(s.id);
      }
    });
    return ids;
  }, [smartSelectionActive, previewCenter, activeRadiusMeters, displayScreens]);

  const handleSmartCapture = (center: L.LatLng) => {
    if (!smartSelectionActive) return;
    const ids: string[] = [];
    displayScreens.forEach(s => {
      if (getDistance(s.lat, s.lng, center.lat, center.lng) <= activeRadiusMeters) {
         ids.push(s.id);
      }
    });

    if (ids.length === 0) {
      setSmartError("No screens found within this radius.");
      return;
    }
    
    setSmartError(null);

    const zoneId = `smart-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newZone: PlanningZone = {
      id: zoneId,
      type: "circle",
      center: { lat: center.lat, lng: center.lng },
      radius: activeRadiusMeters,
      label: `Smart Selection (${activeRadiusMeters >= 1000 ? (activeRadiusMeters / 1000).toFixed(1) + 'km' : Math.round(activeRadiusMeters) + 'm'})`
    };

    onSmartSelectionCapture?.(newZone, ids);
    setSmartSelectionActive(false);
    setPreviewCenter(null);
  };

  return (
    <div className={`fiber-dooh-map ${v4Layout ? "fiber-v4-map" : ""} relative h-full w-full min-h-0 shrink-0`} style={{ height: expanded ? "100%" : "max(690px, calc(100dvh - 490px))", backgroundColor: "var(--surface-background-lvl2, #f7f7fa)" }}>
      <MapContainer center={[54.5, -3.2]} zoom={6} minZoom={3} maxZoom={19} className="h-full w-full" zoomControl={false} style={{ fontFamily: FONT }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapSizeSync />
        <InitialBounds screens={displayScreens} />
        <FocusHovered screen={hoveredScreen} />
        <MapControls screens={displayScreens} />
        <ZoneLayers zones={zones} onZonesChange={onZonesChange} v4Layout={v4Layout} />
        <ClusteredScreens 
           screens={displayScreens} 
           hoveredScreenId={hoveredScreenId} 
           onScreenClick={onScreenClick} 
           sourceMap={sourceMap}
           sourceMembership={v4Membership?.all}
           v4Layout={v4Layout}
           currency={currency}
           showCpm={showCpm}
           selectedScreenIds={selectedScreenIds}
           candidateIds={candidateIds}
           smartSelectionActive={smartSelectionActive}
           onSmartCapture={handleSmartCapture}
        />
        {drawMode && (
          <DrawingLayer
            key={drawMode}
            mode={drawMode}
            circleRadius={drawCircleRadius}
            zones={zones}
            onZonesChange={onZonesChange}
            onDrawComplete={onDrawComplete}
            v4Layout={v4Layout}
          />
        )}
        <SmartSelectionMapEvents 
          active={smartSelectionActive} 
          setPreviewCenter={setPreviewCenter} 
          onCapture={handleSmartCapture} 
        />
        {smartSelectionActive && <SmartPreviewCircle center={previewCenter} radius={activeRadiusMeters} color={v4Layout ? v4ResolvedColor("planningZone") : undefined} />}
        <MapLegend activeSources={activeSources} sourceCounts={sourceCounts} v4Layout={v4Layout} />
      </MapContainer>
      
      <SmartSelectionControl 
        active={smartSelectionActive}
        setActive={handleActivateSmart}
        radius={smartRadius}
        setRadius={setSmartRadius}
        unit={smartRadiusUnit}
        setUnit={setSmartRadiusUnit}
        candidateCount={candidateIds.size}
        hasCenter={!!previewCenter}
        error={smartError}
      />
    </div>
  );
}
