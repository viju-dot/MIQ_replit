import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import { Circle, Marker, Tooltip, useMap, useMapEvents } from "react-leaflet";
import { MapPreview } from "./_shared/MapPreview";
import type { OverviewLayerProps } from "./_shared/LayerProps";
import type { ScreenData } from "./_shared/source/data";
import { buildV4SourceMembership, V4ClusterTooltip, V4ScreenTooltip, v4FocusTooltipHandler, v4PinIcon } from "./_shared/source/v2/v4-map-helpers";
import "./Heatmap.css";

const SAMPLE_PIXELS = 44;
const DETAIL_ZOOM = 14;
const keyboardIcon = L.divIcon({
  className: "dooh-heat-keyboard",
  iconSize: [30, 30],
  iconAnchor: [15, 15],
  html: "",
});

type LocalArea = { center: L.LatLng; radius: number; members: ScreenData[] };

function sampleArea(map: L.Map, screens: ScreenData[], center: L.LatLng): LocalArea {
  const pixel = map.latLngToContainerPoint(center);
  const radius = map.distance(center, map.containerPointToLatLng(pixel.add([SAMPLE_PIXELS, 0])));
  return { center, radius, members: screens.filter(s => map.distance(center, [s.lat, s.lng]) <= radius) };
}

function radiusLabel(radius: number) {
  return radius >= 1000 ? `${(radius / 1000).toFixed(1)} km` : `${Math.round(radius)} m`;
}

// Retain the original additive screen density; only its color encoding changes.
// Canvas cannot consume CSS variables directly, so resolve the same Fiber stops
// used by the legend from this preview's inherited tokens before each draw.
function DensitySurface({ screens }: { screens: ScreenData[] }) {
  const map = useMap();
  useEffect(() => {
    const canvas = L.DomUtil.create("canvas");
    canvas.style.pointerEvents = "none";
    canvas.style.position = "absolute";
    canvas.setAttribute("aria-hidden", "true");
    map.getPanes().overlayPane.appendChild(canvas);
    let frame = 0;
    let zooming = false;
    const draw = () => {
      frame = 0;
      if (zooming || map.getZoom() >= DETAIL_ZOOM || !screens.length) {
        canvas.style.display = "none";
        return;
      }
      const size = map.getSize();
      const scale = 4;
      const w = Math.ceil(size.x / scale);
      const h = Math.ceil(size.y / scale);
      canvas.width = w;
      canvas.height = h;
      canvas.style.width = `${size.x}px`;
      canvas.style.height = `${size.y}px`;
      L.DomUtil.setPosition(canvas, map.containerPointToLayerPoint([0, 0]));
      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;
      const field = new Float32Array(w * h);
      const sigma = 23 / scale;
      const support = Math.ceil(sigma * 3);
      screens.forEach(screen => {
        const p = map.latLngToContainerPoint([screen.lat, screen.lng]).divideBy(scale);
        if (p.x < -support || p.y < -support || p.x > w + support || p.y > h + support) return;
        const x0 = Math.max(0, Math.floor(p.x - support));
        const x1 = Math.min(w - 1, Math.ceil(p.x + support));
        const y0 = Math.max(0, Math.floor(p.y - support));
        const y1 = Math.min(h - 1, Math.ceil(p.y + support));
        for (let y = y0; y <= y1; y++) {
          for (let x = x0; x <= x1; x++) {
            const d2 = (x - p.x) ** 2 + (y - p.y) ** 2;
            if (d2 <= support * support) field[y * w + x] += Math.exp(-d2 / (2 * sigma * sigma));
          }
        }
      });
      let peak = 0;
      for (let i = 0; i < field.length; i++) peak = Math.max(peak, field[i]);
      const image = ctx.createImageData(w, h);
      const styles = getComputedStyle(map.getContainer());
      const stops = [0, 1, 2, 3].map(index => {
        ctx.fillStyle = styles.getPropertyValue(`--dooh-heat-density-${index}`).trim();
        ctx.fillRect(0, 0, 1, 1);
        return Array.from(ctx.getImageData(0, 0, 1, 1).data).slice(0, 3);
      });
      if (peak > 0) {
        for (let i = 0; i < field.length; i++) {
          const relative = field[i] / peak;
          if (relative < .012) continue;
          const t = Math.pow(relative, .62);
          const position = t * (stops.length - 1);
          const lo = Math.min(stops.length - 2, Math.floor(position));
          const blend = position - lo;
          for (let channel = 0; channel < 3; channel++) {
            image.data[i * 4 + channel] = stops[lo][channel] * (1 - blend) + stops[lo + 1][channel] * blend;
          }
          image.data[i * 4 + 3] = Math.min(.74, t * 1.35) * 255;
        }
      }
      ctx.putImageData(image, 0, 0);
      canvas.style.display = "block";
    };
    const schedule = () => { if (!frame) frame = requestAnimationFrame(draw); };
    const startZoom = () => { zooming = true; canvas.style.display = "none"; };
    const endZoom = () => { zooming = false; schedule(); };
    map.on("move resize", schedule);
    map.on("zoomstart", startZoom);
    map.on("zoomend", endZoom);
    schedule();
    return () => {
      cancelAnimationFrame(frame);
      map.off("move resize", schedule);
      map.off("zoomstart", startZoom);
      map.off("zoomend", endZoom);
      canvas.remove();
    };
  }, [map, screens]);
  return null;
}

function AreaContent({ area, currency = "GBP", showCpm = true }: {
  area: LocalArea; currency?: OverviewLayerProps["currency"]; showCpm?: boolean;
}) {
  const cities = Array.from(new Set(area.members.map(s => s.city)));
  return <>
    <div className="dooh-heat-area">
      Local sample · within {radiusLabel(area.radius)} of this point
      <br />{cities.join(" · ")}
    </div>
    <V4ClusterTooltip screens={area.members} currency={currency} showCpm={showCpm} action="Click or press Enter to explore this area" />
  </>;
}

function FiberHeatmapLayer({ screens, hoveredScreenId, onScreenClick, currency = "GBP", showCpm = true, sourceScreenIds }: OverviewLayerProps) {
  const map = useMap();
  const [revision, setRevision] = useState(0);
  const [area, setArea] = useState<LocalArea | null>(null);
  const hoverFrame = useRef(0);
  const moving = useRef(false);
  const detail = map.getZoom() >= DETAIL_ZOOM;
  const membership = useMemo(() => buildV4SourceMembership(screens, sourceScreenIds), [screens, sourceScreenIds]);
  const drill = (local: LocalArea) => {
    if (!local.members.length) return;
    setArea(null);
    map.fitBounds(L.latLngBounds(local.members.map(s => [s.lat, s.lng] as [number, number])), {
      padding: [70, 70],
      maxZoom: Math.min(17, Math.max(DETAIL_ZOOM, map.getZoom() + 2)),
    });
  };
  useMapEvents({
    zoomstart: () => { cancelAnimationFrame(hoverFrame.current); setArea(null); },
    movestart: () => { moving.current = true; cancelAnimationFrame(hoverFrame.current); setArea(null); },
    moveend: () => { moving.current = false; setRevision(v => v + 1); },
    zoomend: () => setRevision(v => v + 1),
    mousemove: event => {
      if (detail || moving.current) return;
      cancelAnimationFrame(hoverFrame.current);
      hoverFrame.current = requestAnimationFrame(() => {
        const next = sampleArea(map, screens, event.latlng);
        setArea(next.members.length ? next : null);
      });
    },
    mouseout: () => { cancelAnimationFrame(hoverFrame.current); setArea(null); },
    click: event => {
      if (detail || (event.originalEvent.target as Element)?.closest("button, .dooh-heat-legend")) return;
      drill(sampleArea(map, screens, event.latlng));
    },
  });
  useEffect(() => () => cancelAnimationFrame(hoverFrame.current), []);
  useEffect(() => { setArea(null); }, [screens]);

  const anchors = useMemo(() => {
    const cities = new Map<string, ScreenData[]>();
    screens.forEach(s => cities.set(s.city, [...(cities.get(s.city) ?? []), s]));
    return Array.from(cities.entries()).map(([city, members]) => {
      const lat = members.reduce((sum, s) => sum + s.lat, 0) / members.length;
      const lng = members.reduce((sum, s) => sum + s.lng, 0) / members.length;
      const screen = members.reduce((best, s) => (
        (s.lat - lat) ** 2 + (s.lng - lng) ** 2 < (best.lat - lat) ** 2 + (best.lng - lng) ** 2 ? s : best
      ));
      return { city, local: sampleArea(map, screens, L.latLng(screen.lat, screen.lng)) };
    });
  }, [screens, map, revision]);
  const brandColor = getComputedStyle(map.getContainer()).getPropertyValue("--dooh-heat-density-2").trim() || "#7c33b5";

  return <>
    <DensitySurface screens={screens} />
    {!detail && anchors.map(({ city, local }) => (
      <Marker key={city} position={local.center} icon={keyboardIcon} keyboard title={`Explore ${city} density. Enter to zoom into the local area.`}
        eventHandlers={{ add: v4FocusTooltipHandler, click: () => drill(local) }}>
        <Tooltip direction="top" opacity={1} className="fiber-tooltip fiber-v4-tooltip">
          <AreaContent area={local} currency={currency} showCpm={showCpm} />
        </Tooltip>
      </Marker>
    ))}
    {!detail && area && (
      <Circle center={area.center} radius={area.radius} interactive={false} pathOptions={{ color: brandColor, weight: 1, dashArray: "3 4", fill: false, opacity: .45 }}>
        <Tooltip permanent direction="top" offset={[0, -20]} opacity={1} className="fiber-tooltip fiber-v4-tooltip">
          <AreaContent area={area} currency={currency} showCpm={showCpm} />
        </Tooltip>
      </Circle>
    )}
    {detail && screens.filter(s => map.getBounds().pad(.15).contains([s.lat, s.lng])).map(screen => (
      <Marker key={screen.id} position={[screen.lat, screen.lng]} keyboard title={`Screen ${screen.id}`}
        icon={v4PinIcon(screen.id === hoveredScreenId, membership.primary.get(screen.id) ?? "default", false, false)}
        zIndexOffset={screen.id === hoveredScreenId ? 1000 : 0}
        eventHandlers={{ add: v4FocusTooltipHandler, click: () => onScreenClick(screen.id) }}>
        <Tooltip direction="top" offset={[0, -12]} opacity={1} className="fiber-tooltip fiber-v4-tooltip">
          <V4ScreenTooltip screen={screen} sources={membership.all.get(screen.id) ?? []} currency={currency} showCpm={showCpm} hasSourceTargeting={Object.values(sourceScreenIds ?? {}).some(ids => ids.length > 0)} />
        </Tooltip>
      </Marker>
    ))}
    <aside className="dooh-heat-legend" data-testid="legend-relative-density"
      onMouseDown={e => e.stopPropagation()} onDoubleClick={e => e.stopPropagation()} onClick={e => e.stopPropagation()}>
      <strong>{detail ? "Individual screen locations" : "Relative screen density"}</strong>
      {!detail && <>
        <div className="dooh-heat-ramp" aria-hidden="true" />
        <div className="dooh-heat-labels"><span>Sparse</span><span>Concentrated</span></div>
      </>}
      <p>{detail ? "Pin colours show match source, not density." : "Equal weight per screen. Relative to the densest visible area; not audience reach."}</p>
      <p>{detail ? "Hover or focus a pin for details. Enter selects a screen." : "Hover to inspect a local area. Click to zoom. Tab to city hotspots; Enter to explore."}</p>
    </aside>
    {!screens.length && <div className="dooh-heat-empty" role="status" data-testid="status-empty-density">
      <strong>No screens in this view</strong><p>There is no matching inventory to map. Pan and zoom remain available.</p>
    </div>}
  </>;
}

export function Heatmap() {
  return <div className="fiber-heatmap-preview"><MapPreview
    title="Screen density, without the noise"
    subtitle="Follow connected concentrations of screens across the UK. Inspect a local area, then zoom into the actual inventory."
    renderLayer={props => <FiberHeatmapLayer {...props} />}
  /></div>;
}
