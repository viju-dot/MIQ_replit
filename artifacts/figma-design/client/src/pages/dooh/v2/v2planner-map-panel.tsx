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
import { ScreenData } from "../data";
import { MapZone } from "../components/MapPanel";
import { CARD_BG, CARD_SHADOW, GRID, MUTED, TITLE, FONT } from "./primitives";

interface Props {
  screens: ScreenData[];
  hoveredScreenId: string | null;
  onScreenClick: (id: string) => void;
  zones?: MapZone[];
  onZonesChange?: (zones: MapZone[]) => void;
  drawMode?: "circle" | "polygon" | null;
  onDrawComplete?: () => void;
  locationSource?: string | null; // "audience", "postcode", "poi", "latlng", etc.
}

const noop = () => undefined;

// Fiber Colors mapping:
// Postcode Match -> Success Green
// POI Match -> Info Blue
// GeoPlanner Match (Audience) -> Brand Purple
const getColorBySource = (source?: string | null) => {
  switch (source) {
    case "postcode": return "var(--surface-foreground-static-success, #059669)";
    case "poi": return "var(--surface-foreground-static-info, #2563eb)";
    case "audience": return "var(--container-dynamic-brand-bold-background-default, #7c33b5)";
    case "latlng": return "var(--surface-foreground-static-info, #2563eb)";
    default: return "var(--surface-foreground-static-error, #dc2626)";
  }
};

const pinIcon = (active: boolean, color: string) =>
  L.divIcon({
    className: "",
    iconSize: active ? [24, 24] : [18, 18],
    iconAnchor: active ? [12, 12] : [9, 9],
    html: `<span style="display:block;width:100%;height:100%;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${active ? "var(--surface-foreground-static-neutral-lvl1, #13131a)" : color};border:2px solid var(--surface-background-lvl1, #ffffff);box-shadow:0 2px 6px var(--shadow-lvl8, rgba(113,113,128,0.15));transition:all 0.2s ease;"></span>`,
  });

const clusterIcon = (count: number, color: string) =>
  L.divIcon({
    className: "",
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    html: `<span style="display:flex;width:38px;height:38px;align-items:center;justify-content:center;border-radius:999px;background:${color};color:var(--container-dynamic-brand-bold-foreground-default, #ffffff);border:2px solid var(--surface-background-lvl1, #ffffff);box-shadow:0 2px 8px var(--shadow-lvl8, rgba(113,113,128,0.2));font-family:${FONT.replace(/"/g, "'")};font-weight:700;font-size:12px;transition:transform 0.2s ease;" onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">${count}</span>`,
  });

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

function FocusHovered({
  screen,
}: {
  screen: ScreenData | undefined;
}) {
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
      className="absolute right-[var(--spacing-200,16px)] top-[var(--spacing-200,16px)] z-[1000] flex flex-col overflow-hidden rounded-[var(--radius-50,4px)]"
      style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW, border: `1px solid ${GRID}` }}
      onDoubleClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <button type="button" aria-label="Zoom in" className="h-[34px] w-[34px] flex items-center justify-center transition-colors hover:bg-black/5" style={{ color: TITLE }} onClick={() => map.zoomIn()}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M8 3.33334V12.6667M3.33334 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <button type="button" aria-label="Zoom out" className="h-[34px] w-[34px] flex items-center justify-center transition-colors hover:bg-black/5" style={{ color: TITLE, borderTop: `1px solid ${GRID}` }} onClick={() => map.zoomOut()}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.33334 8H12.6667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
      </button>
      <button type="button" aria-label="Reset map view" title="Reset view" className="h-[34px] w-[34px] flex items-center justify-center transition-colors hover:bg-black/5" style={{ color: TITLE, borderTop: `1px solid ${GRID}` }} onClick={reset}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2.04858 10C2.6025 12.8362 4.88726 15 7.78857 15C11.2173 15 13.9972 12.2215 13.9972 8.79373C13.9972 5.36592 11.2173 2.58746 7.78857 2.58746C5.58079 2.58746 3.64234 3.73715 2.57141 5.48512M2.57141 5.48512H5.67713M2.57141 5.48512V2.38139" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
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

function MapLegend() {
  return (
    <div className="absolute bottom-[var(--spacing-300,24px)] left-[var(--spacing-200,16px)] z-[1000] rounded-[var(--radius-50,4px)] p-[var(--spacing-200,16px)] w-[220px]"
      style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW, border: `1px solid ${GRID}` }}>
      <h3 className="text-[length:var(--body-md-medium-size,14px)] font-bold mb-[var(--spacing-150,12px)]" style={{ fontFamily: FONT, color: TITLE }}>Match Source</h3>
      <div className="flex flex-col gap-[var(--spacing-100,8px)]">
        <div className="flex items-center gap-[var(--spacing-100,8px)]">
          <div className="w-[12px] h-[12px] rounded-full shadow-sm" style={{ backgroundColor: "var(--surface-foreground-static-success, #059669)", border: `1px solid ${CARD_BG}` }}></div>
          <span className="text-[length:var(--body-sm-regular-size,12px)]" style={{ fontFamily: FONT, color: TITLE }}>Postcode Match</span>
        </div>
        <div className="flex items-center gap-[var(--spacing-100,8px)]">
          <div className="w-[12px] h-[12px] rounded-full shadow-sm" style={{ backgroundColor: "var(--surface-foreground-static-info, #2563eb)", border: `1px solid ${CARD_BG}` }}></div>
          <span className="text-[length:var(--body-sm-regular-size,12px)]" style={{ fontFamily: FONT, color: TITLE }}>POI Match</span>
        </div>
        <div className="flex items-center gap-[var(--spacing-100,8px)]">
          <div className="w-[12px] h-[12px] rounded-full shadow-sm" style={{ backgroundColor: "var(--container-dynamic-brand-bold-background-default, #7c33b5)", border: `1px solid ${CARD_BG}` }}></div>
          <span className="text-[length:var(--body-sm-regular-size,12px)]" style={{ fontFamily: FONT, color: TITLE }}>GeoPlanner Match</span>
        </div>
      </div>
      <DynamicScale />
    </div>
  );
}


function ClusteredScreens({
  screens,
  hoveredScreenId,
  onScreenClick,
  locationSource,
}: Pick<Props, "screens" | "hoveredScreenId" | "onScreenClick" | "locationSource">) {
  const map = useMap();
  const [revision, setRevision] = useState(0);
  const [spiderCluster, setSpiderCluster] = useState<string | null>(null);
  
  const pinColor = getColorBySource(locationSource);

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
    return Array.from(cells.entries()).map(([key, members]) => ({
      key,
      screens: members,
      lat: members.reduce((sum, item) => sum + item.lat, 0) / members.length,
      lng: members.reduce((sum, item) => sum + item.lng, 0) / members.length,
    }));
  }, [screens, hoveredScreenId, map, revision]);

  const screenMarker = (screen: ScreenData, position?: LatLngExpression) => (
    <Marker
      key={screen.id}
      position={position ?? [screen.lat, screen.lng]}
      icon={pinIcon(screen.id === hoveredScreenId, pinColor)}
      zIndexOffset={screen.id === hoveredScreenId ? 1000 : 0}
      eventHandlers={{
        click: () => {
          map.setView(position ?? [screen.lat, screen.lng], Math.max(map.getZoom(), 15));
          onScreenClick(screen.id);
        },
      }}
    >
      <Tooltip direction="top" offset={[0, -10]} opacity={1} className="fiber-tooltip">
        <div className="flex flex-col gap-1 text-[length:var(--body-sm-regular-size,12px)] p-1" style={{ fontFamily: FONT, color: TITLE }}>
          <strong className="text-[length:var(--body-sm-medium-size,12px)]">{screen.id}</strong>
          <div style={{ color: MUTED }}>{screen.publisher}</div>
          <div className="font-medium mt-1 pt-1" style={{ borderTop: `1px solid ${GRID}` }}>CPM: £{screen.cpm.toFixed(2)}</div>
        </div>
      </Tooltip>
    </Marker>
  );

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
                    <Polyline positions={[center, endpoint]} pathOptions={{ color: "var(--border-static-subtle-neutral, #e1e1e8)", weight: 2 }} />
                    {screenMarker(screen, endpoint)}
                  </Fragment>
                );
              })}
            </Fragment>
          );
        }

        return (
          <Marker
            key={cluster.key}
            position={[cluster.lat, cluster.lng]}
            icon={clusterIcon(cluster.screens.length, pinColor)}
            eventHandlers={{
              click: () => {
                if (map.getZoom() < map.getMaxZoom()) {
                  map.setView([cluster.lat, cluster.lng], Math.min(map.getZoom() + 2, map.getMaxZoom()));
                } else {
                  setSpiderCluster(cluster.key);
                }
              },
            }}
          >
            <Tooltip direction="top" offset={[0, -18]} className="fiber-tooltip">
              <span style={{ fontFamily: FONT }}>{cluster.screens.length} matched screens — click to expand</span>
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
}

function ZoneLayers({
  zones,
  onZonesChange,
}: {
  zones: MapZone[];
  onZonesChange: (zones: MapZone[]) => void;
}) {
  const removeButton = (zone: MapZone) => (
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
            <Circle key={zone.id} center={zone.center} radius={zone.radius} pathOptions={{ color: "#7c33b5", fillOpacity: 0.15, weight: 2 }}>
              {removeButton(zone)}
            </Circle>
          );
        }
        if (zone.type === "polygon" && zone.points && zone.points.length >= 3) {
          return (
            <Polygon key={zone.id} positions={zone.points} pathOptions={{ color: "#7c33b5", fillOpacity: 0.15, weight: 2 }}>
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
  zones,
  onZonesChange,
  onDrawComplete,
}: {
  mode: "circle" | "polygon";
  zones: MapZone[];
  onZonesChange: (zones: MapZone[]) => void;
  onDrawComplete: () => void;
}) {
  const map = useMap();
  const [points, setPoints] = useState<L.LatLng[]>([]);

  useEffect(() => {
    setPoints([]);
    map.getContainer().style.cursor = "crosshair";
    return () => {
      map.getContainer().style.cursor = "";
    };
  }, [map, mode]);

  useMapEvents({
    click(event) {
      if (mode === "circle" && points.length === 1) {
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
        <Circle center={points[0]} radius={5} pathOptions={{ color: "#7c33b5", fillOpacity: 0.4 }} />
      )}
      {mode === "polygon" && points.length > 0 && (
        <>
          <Polyline positions={points} pathOptions={{ color: "#7c33b5", dashArray: "6 5", weight: 2 }} />
          {points.map((point, index) => (
            <Circle key={index} center={point} radius={5} pathOptions={{ color: "#7c33b5", fillOpacity: 1, weight: 2 }} />
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
            ? points.length ? "Click the circle edge" : "Click the circle centre"
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
  hoveredScreenId,
  onScreenClick,
  zones = [],
  onZonesChange = noop,
  drawMode = null,
  onDrawComplete = noop,
  locationSource = null
}: Props) {
  const hoveredScreen = screens.find((screen) => screen.id === hoveredScreenId);

  return (
    <div className="fiber-dooh-map relative shrink-0 w-full" style={{ height: "max(690px, calc(100dvh - 490px))", backgroundColor: "var(--surface-background-lvl2, #f7f7fa)" }}>
      <MapContainer center={[54.5, -3.2]} zoom={6} minZoom={3} maxZoom={19} className="h-full w-full" zoomControl={false} style={{ fontFamily: FONT }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapSizeSync />
        <InitialBounds screens={screens} />
        <FocusHovered screen={hoveredScreen} />
        <MapControls screens={screens} />
        <ZoneLayers zones={zones} onZonesChange={onZonesChange} />
        <ClusteredScreens screens={screens} hoveredScreenId={hoveredScreenId} onScreenClick={onScreenClick} locationSource={locationSource} />
        {drawMode && (
          <DrawingLayer
            key={drawMode}
            mode={drawMode}
            zones={zones}
            onZonesChange={onZonesChange}
            onDrawComplete={onDrawComplete}
          />
        )}
        <MapLegend />
      </MapContainer>
    </div>
  );
}
