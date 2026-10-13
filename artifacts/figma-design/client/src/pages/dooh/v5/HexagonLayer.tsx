import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { Marker, Polygon, Tooltip, useMap, useMapEvents } from "react-leaflet";
import type { OverviewLayerProps } from "./LayerProps";
import type { ScreenData } from "../data";
import { buildV4SourceMembership, V4ClusterTooltip, V4ScreenTooltip, v4FocusTooltipHandler, v4PinIcon } from "../v2/v4-map-helpers";
import "./HexagonLayer.css";

const RADIUS = 22;
const SQRT3 = Math.sqrt(3);
const INK = "#65547a";

// Pointy-top axial coordinates, cube-rounded to the nearest tessellating cell.
// Coordinates are anchored at the projected world's origin, never the viewport.
function axialCell(x: number, y: number) {
  const q = (SQRT3 * x / 3 - y / 3) / RADIUS;
  const r = (2 * y / 3) / RADIUS;
  const s = -q - r;
  let rq = Math.round(q), rr = Math.round(r);
  const rs = Math.round(s);
  const dq = Math.abs(rq - q), dr = Math.abs(rr - r), ds = Math.abs(rs - s);
  if (dq > dr && dq > ds) rq = -rr - rs;
  else if (dr > ds) rr = -rq - rs;
  return { q: rq, r: rr };
}

type Bin = { key: string; members: ScreenData[]; corners: L.LatLng[] };

function HexCell({ bin, opacity, drill, currency, showCpm }: {
  bin: Bin; opacity: number; drill: () => void;
  currency: NonNullable<OverviewLayerProps["currency"]>; showCpm: boolean;
}) {
  const ref = useRef<L.Polygon | null>(null);
  useEffect(() => {
    const polygon = ref.current;
    const element = polygon?.getElement();
    if (!polygon || !element) return;
    element.setAttribute("tabindex", "0");
    element.setAttribute("role", "button");
    element.setAttribute("aria-label", `${bin.members.length} screens in ${Array.from(new Set(bin.members.map(s => s.city))).join(", ")}. Press Enter to explore.`);
    element.setAttribute("data-testid", `hex-cell-${bin.key}`);
    const focus = () => polygon.openTooltip();
    const blur = () => polygon.closeTooltip();
    const keydown = (raw: Event) => {
      const event = raw as KeyboardEvent;
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        event.stopPropagation();
        drill();
      }
    };
    element.addEventListener("focus", focus);
    element.addEventListener("blur", blur);
    element.addEventListener("keydown", keydown);
    return () => {
      element.removeEventListener("focus", focus);
      element.removeEventListener("blur", blur);
      element.removeEventListener("keydown", keydown);
    };
  }, [bin, drill]);
  return (
    <Polygon ref={ref} positions={bin.corners} pathOptions={{
      className: "dooh-hex-cell", color: "#fdfcfe", weight: 1.4,
      opacity: .95, fillColor: INK, fillOpacity: opacity,
    }} eventHandlers={{
      click: drill,
      mouseover: event => (event.target as L.Polygon).setStyle({ weight: 2.5, color: "#393347" }),
      mouseout: event => (event.target as L.Polygon).setStyle({ weight: 1.4, color: "#fdfcfe" }),
    }}>
      <Tooltip direction="top" sticky opacity={1} className="fiber-tooltip fiber-v4-tooltip">
        <V4ClusterTooltip screens={bin.members} currency={currency} showCpm={showCpm} action="Click or press Enter to explore this footprint" />
        {new Set(bin.members.map(s => s.city)).size > 1 && (
          <div style={{ marginTop: 6, maxWidth: 260, fontSize: 11, color: "#717180" }}>
            {Array.from(new Set(bin.members.map(s => s.city))).sort().join(" · ")}
          </div>
        )}
      </Tooltip>
    </Polygon>
  );
}

export function HexagonLayer({
  screens, hoveredScreenId, onScreenClick, currency = "GBP", showCpm = true, sourceScreenIds,
}: OverviewLayerProps) {
  const map = useMap();
  const [zoom, setZoom] = useState(map.getZoom());
  useMapEvents({ zoomend: () => setZoom(map.getZoom()) });
  const membership = useMemo(() => buildV4SourceMembership(screens, sourceScreenIds), [screens, sourceScreenIds]);
  const bins = useMemo(() => {
    const cells = new Map<string, { q: number; r: number; members: ScreenData[] }>();
    for (const screen of screens) {
      const point = map.project([screen.lat, screen.lng], zoom);
      const { q, r } = axialCell(point.x, point.y);
      const key = `${zoom}:${q}:${r}`;
      const cell = cells.get(key) ?? { q, r, members: [] };
      cell.members.push(screen);
      cells.set(key, cell);
    }
    return Array.from(cells, ([key, { q, r, members }]): Bin => {
      const x = RADIUS * SQRT3 * (q + r / 2);
      const y = RADIUS * 1.5 * r;
      const corners = Array.from({ length: 6 }, (_, index) => {
        const angle = (60 * index - 30) * Math.PI / 180;
        return map.unproject(L.point(x + RADIUS * Math.cos(angle), y + RADIUS * Math.sin(angle)), zoom);
      });
      return { key, members, corners };
    });
  }, [screens, map, zoom]);
  const maxCount = Math.max(1, ...bins.map(bin => bin.members.length));
  const intensity = (count: number) => .2 + .63 * Math.log1p(count) / Math.log1p(maxCount);
  const street = zoom >= 14;

  return (
    <>
      {!street && bins.map(bin => (
        <HexCell key={bin.key} bin={bin} opacity={intensity(bin.members.length)} currency={currency} showCpm={showCpm}
          drill={() => {
            const bounds = L.latLngBounds(bin.members.map(s => L.latLng(s.lat, s.lng)));
            // Drill into actual member bounds; never pretend a cell selected a screen.
            const targetZoom = Math.min(14, Math.max(zoom + 2, map.getBoundsZoom(bounds, false, L.point(100, 100))));
            map.setView(bounds.getCenter(), targetZoom);
          }}
        />
      ))}
      {street && screens.map(screen => (
        <Marker key={screen.id} position={[screen.lat, screen.lng]}
          title={`Screen ${screen.id}. Press Enter to select.`}
          icon={v4PinIcon(screen.id === hoveredScreenId, membership.primary.get(screen.id) ?? "default", false, false)}
          zIndexOffset={screen.id === hoveredScreenId ? 1000 : 0}
          eventHandlers={{ add: v4FocusTooltipHandler, click: () => onScreenClick(screen.id) }}>
          <Tooltip direction="top" offset={[0, -12]} opacity={1} className="fiber-tooltip fiber-v4-tooltip">
            <V4ScreenTooltip screen={screen} sources={membership.all.get(screen.id) ?? []} currency={currency}
              showCpm={showCpm} hasSourceTargeting={Object.values(sourceScreenIds ?? {}).some(ids => ids.length > 0)} />
          </Tooltip>
        </Marker>
      ))}
      <aside className="dooh-hex-legend" aria-label="Coverage density legend" data-testid="legend-hex-density"
        onMouseDown={event => event.stopPropagation()} onDoubleClick={event => event.stopPropagation()}>
        <strong>{street ? "Individual screen coverage" : "Screens per hexagon"}</strong>
        {!street && <>
          <div className="dooh-hex-scale" aria-hidden="true">
            {[.2, .36, .52, .68, .83].map(opacity => <span key={opacity} style={{ background: `rgba(101,84,122,${opacity})` }} />)}
          </div>
          <div className="dooh-hex-labels"><span>Lower concentration</span><span>Higher</span></div>
        </>}
        <p className="dooh-hex-note">{street
          ? "Pin colours show Match Source. Focus or hover for details; Enter selects a screen."
          : "Equal projected footprints at each zoom. Shade shows screen count, not Match Source."}</p>
        {!street && <p className="dooh-hex-note">Hover for exact totals. Tab + Enter or click a cell to drill down.</p>}
      </aside>
      {screens.length === 0 && <div className="dooh-hex-empty" role="status" data-testid="status-empty-hex-map">
        <strong>No screens in this view</strong><p>Coverage cells appear when screen inventory is available. You can still explore the map.</p>
      </div>}
    </>
  );
}
