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

// Colors mapping:
// Postcode Match -> #10B981 (Green)
// POI Match -> #3B82F6 (Blue)
// GeoPlanner Match (Audience) -> #7C3AED (Purple)
const getColorBySource = (source?: string | null) => {
  switch (source) {
    case "postcode": return "#10B981";
    case "poi": return "#3B82F6";
    case "audience": return "#7C3AED";
    case "latlng": return "#3B82F6"; // Treat LatLng similar to POI (Blue)
    default: return "#dc2626"; // Default red if no location source
  }
};

const pinIcon = (active: boolean, color: string) =>
  L.divIcon({
    className: "",
    iconSize: active ? [24, 24] : [18, 18],
    iconAnchor: active ? [12, 12] : [9, 9],
    html: `<span style="display:block;width:100%;height:100%;border-radius:50% 50% 50% 0;transform:rotate(-45deg);background:${active ? "#111827" : color};border:2px solid white;box-shadow:0 1px 5px rgba(0,0,0,.45)"></span>`,
  });

const clusterIcon = (count: number, color: string) =>
  L.divIcon({
    className: "",
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    html: `<span style="display:flex;width:38px;height:38px;align-items:center;justify-content:center;border-radius:999px;background:${color};color:white;border:3px solid rgba(255,255,255,.9);box-shadow:0 2px 7px rgba(0,0,0,.35);font:700 12px/1 sans-serif">${count}</span>`,
  });

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
      className="absolute right-4 top-4 z-[1000] flex flex-col overflow-hidden rounded-md border border-gray-200 bg-white shadow-md"
      onDoubleClick={(event) => event.stopPropagation()}
      onMouseDown={(event) => event.stopPropagation()}
    >
      <button type="button" aria-label="Zoom in" className="h-9 w-9 text-xl font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center" onClick={() => map.zoomIn()}>
        +
      </button>
      <button type="button" aria-label="Zoom out" className="h-9 w-9 border-t border-gray-200 text-xl font-medium text-gray-700 hover:bg-gray-50 flex items-center justify-center" onClick={() => map.zoomOut()}>
        −
      </button>
      <button type="button" aria-label="Reset map view" title="Reset view" className="h-9 w-9 border-t border-gray-200 text-base text-gray-700 hover:bg-gray-50 flex items-center justify-center" onClick={reset}>
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="3"/></svg>
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
      // Rough estimation for map width scale:
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
    <div className="text-[10px] text-gray-500 font-medium text-right mt-1 border-t border-gray-100 pt-1">
      Approx {scaleDistance}
    </div>
  );
}

function MapLegend() {
  return (
    <div className="absolute bottom-6 left-4 z-[1000] bg-white rounded-lg shadow-md border border-gray-200 p-3 text-xs w-48">
      <h3 className="font-semibold text-gray-800 mb-2">Screen Match Source</h3>
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#10B981] border border-white shadow-sm"></div>
          <span className="text-gray-600">Postcode Match</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#3B82F6] border border-white shadow-sm"></div>
          <span className="text-gray-600">POI Match</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#7C3AED] border border-white shadow-sm"></div>
          <span className="text-gray-600">GeoPlanner Match</span>
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
      <Tooltip direction="top" offset={[0, -10]} opacity={1}>
        <div className="text-xs">
          <strong>{screen.id}</strong>
          <div>{screen.publisher}</div>
          <div>CPM: £{screen.cpm.toFixed(2)}</div>
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
                    <Polyline positions={[center, endpoint]} pathOptions={{ color: "#737373", weight: 1 }} />
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
            <Tooltip direction="top" offset={[0, -18]}>
              {cluster.screens.length} matched screens — click to expand
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
    <Tooltip permanent direction="center" opacity={1} className="map-zone-label">
      <button
        type="button"
        className="font-semibold text-blue-700 bg-white/80 px-1 py-0.5 rounded shadow-sm text-xs"
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
            <Circle key={zone.id} center={zone.center} radius={zone.radius} pathOptions={{ color: "#3B82F6", fillOpacity: 0.2, weight: 2 }}>
              {removeButton(zone)}
            </Circle>
          );
        }
        if (zone.type === "polygon" && zone.points && zone.points.length >= 3) {
          return (
            <Polygon key={zone.id} positions={zone.points} pathOptions={{ color: "#3B82F6", fillOpacity: 0.2, weight: 2 }}>
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
        <Circle center={points[0]} radius={5} pathOptions={{ color: "#3B82F6", fillOpacity: 0.4 }} />
      )}
      {mode === "polygon" && points.length > 0 && (
        <>
          <Polyline positions={points} pathOptions={{ color: "#3B82F6", dashArray: "6 5" }} />
          {points.map((point, index) => (
            <Circle key={index} center={point} radius={5} pathOptions={{ color: "#3B82F6", fillOpacity: 1 }} />
          ))}
        </>
      )}
      <div
        className="absolute left-1/2 top-4 z-[1000] flex -translate-x-1/2 items-center gap-2 rounded-md border border-blue-200 bg-white px-3 py-2 text-sm shadow-md"
        onClick={stopMapEvent}
        onDoubleClick={stopMapEvent}
        onMouseDown={stopMapEvent}
      >
        <span className="font-medium text-gray-700">
          {mode === "circle"
            ? points.length ? "Click the circle edge" : "Click the circle centre"
            : `Click polygon vertices (${points.length})`}
        </span>
        {mode === "polygon" && (
          <button
            type="button"
            disabled={points.length < 3}
            className="rounded bg-blue-600 px-2.5 py-1 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-blue-700 transition-colors"
            onClick={finishPolygon}
          >
            Finish
          </button>
        )}
        {points.length > 0 && (
          <button type="button" className="rounded border border-gray-300 px-2.5 py-1 hover:bg-gray-50 transition-colors" onClick={() => setPoints((current) => current.slice(0, -1))}>
            Undo
          </button>
        )}
        <button
          type="button"
          className="rounded border border-gray-300 px-2.5 py-1 hover:bg-gray-50 transition-colors"
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
    <div className="relative h-full w-full">
      <MapContainer center={[54.5, -3.2]} zoom={6} minZoom={3} maxZoom={19} className="h-full w-full" zoomControl={false}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
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
