import { useMemo, useState } from "react";
import L from "leaflet";
import { Marker, Tooltip, useMap, useMapEvents } from "react-leaflet";
import type { OverviewLayerProps } from "./LayerProps";
import type { ScreenData } from "./source/data";
import { buildV4SourceMembership, V4ClusterTooltip, V4ScreenTooltip, v4FocusTooltipHandler, v4PinIcon } from "./source/v2/v4-map-helpers";
import "./BubbleLayer.css";

/**
 * World-pixel cells remain anchored to the CRS origin, not the viewport.
 * Bubble area is exactly proportional to member count within each zoom level.
 * Zooming re-bins the same inventory; panning never changes membership.
 */
export function BubbleLayer({
  screens, hoveredScreenId, onScreenClick, sourceScreenIds,
  currency = "GBP", showCpm = true,
}: OverviewLayerProps) {
  const map = useMap();
  const [zoom, setZoom] = useState(() => map.getZoom());
  useMapEvents({ zoomend: () => setZoom(map.getZoom()) });
  const membership = useMemo(
    () => buildV4SourceMembership(screens, sourceScreenIds),
    [screens, sourceScreenIds],
  );
  const groups = useMemo(() => {
    const cells = new Map<string, ScreenData[]>();
    screens.forEach((screen) => {
      const point = map.project([screen.lat, screen.lng], zoom);
      const key = `${Math.floor(point.x / 72)}:${Math.floor(point.y / 72)}`;
      const members = cells.get(key);
      if (members) members.push(screen);
      else cells.set(key, [screen]);
    });
    return Array.from(cells, ([key, members]) => ({
      key, members,
      position: L.latLng(
        members.reduce((sum, screen) => sum + screen.lat, 0) / members.length,
        members.reduce((sum, screen) => sum + screen.lng, 0) / members.length,
      ),
    }));
  }, [screens, map, zoom]);
  const counts = groups.map((group) => group.members.length).sort((a, b) => a - b);
  const largest = counts[counts.length - 1] ?? 1;
  const radiusFor = (count: number) => 38 * Math.sqrt(count / largest);
  const examples = counts.length
    ? [counts[0], counts[Math.floor((counts.length - 1) / 2)], largest]
    : [];
  const streetLevel = zoom >= 14;
  const focusMarker = (event: L.LeafletEvent) => {
    v4FocusTooltipHandler(event);
    const element = (event.target as L.Marker).getElement();
    element?.setAttribute("role", "button");
  };
  const drillDown = (members: ScreenData[]) => {
    const bounds = L.latLngBounds(members.map((screen) => [screen.lat, screen.lng] as [number, number]));
    const targetZoom = Math.min(
      map.getMaxZoom(),
      Math.max(zoom + 1, Math.min(14, map.getBoundsZoom(bounds, false, L.point(80, 80)))),
    );
    map.setView(bounds.getCenter(), targetZoom);
  };

  if (!screens.length) return (
    <div className="dooh-bubble-empty" role="status" data-testid="status-empty-bubbles">
      <strong>No screens in this view</strong>
      Adjust your selection to explore coverage. The map is still available.
    </div>
  );

  return (
    <>
      {streetLevel ? screens.map((screen) => (
        <Marker
          key={`screen-${screen.id}`}
          position={[screen.lat, screen.lng]}
          title={`Screen ${screen.id}. Press Enter to select.`}
          keyboard
          icon={v4PinIcon(screen.id === hoveredScreenId, membership.primary.get(screen.id) ?? "default", false, false)}
          zIndexOffset={screen.id === hoveredScreenId ? 1000 : 0}
          eventHandlers={{
            add: focusMarker,
            click: () => onScreenClick(screen.id),
          }}
        >
          <Tooltip direction="top" offset={[0, -12]} opacity={1} className="fiber-tooltip fiber-v4-tooltip">
            <V4ScreenTooltip
              screen={screen} sources={membership.all.get(screen.id) ?? []}
              currency={currency} showCpm={showCpm}
              hasSourceTargeting={Object.values(sourceScreenIds ?? {}).some((ids) => ids.length > 0)}
            />
          </Tooltip>
        </Marker>
      )) : groups.map(({ key, members, position }) => {
        const diameter = radiusFor(members.length) * 2;
        const cities = Array.from(new Set(members.map((screen) => screen.city)));
        return (
          <Marker
            key={`bubble-${zoom}-${key}`}
            position={position}
            title={`${members.length.toLocaleString()} screens in ${cities.join(", ")}. Press Enter to explore.`}
            keyboard
            icon={L.divIcon({
              className: "dooh-bubble-icon",
              iconSize: [diameter, diameter],
              iconAnchor: [diameter / 2, diameter / 2],
              html: '<span class="dooh-bubble-disc" aria-hidden="true"></span>',
            })}
            eventHandlers={{ add: focusMarker, click: () => drillDown(members) }}
          >
            <Tooltip direction="top" offset={[0, -diameter / 2]} opacity={1} className="fiber-tooltip fiber-v4-tooltip">
              <V4ClusterTooltip screens={members} currency={currency} showCpm={showCpm} action="Click or press Enter to explore these screens" />
              {cities.length > 1 && <div style={{ fontSize: 11, color: "#717180", marginTop: 5, maxWidth: 260, whiteSpace: "normal" }}>{cities.join(" · ")}</div>}
            </Tooltip>
          </Marker>
        );
      })}
      <aside className="dooh-bubble-legend" aria-label="Coverage size legend" data-testid="legend-bubble-coverage">
        <strong>{streetLevel ? "Individual screens" : "Coverage by screen count"}</strong>
        {streetLevel ? <p>Each pin is one screen. Pin colour shows match source, where added.</p> : (
          <>
            <p>Circle area represents screens, not reach or match source.</p>
            <div className="dooh-bubble-scale" aria-hidden="true">
              {examples.map((count, index) => <span key={index} className="dooh-bubble-disc" style={{ width: radiusFor(count) * 1.2, height: radiusFor(count) * 1.2 }} />)}
            </div>
            <div className="dooh-bubble-direction"><span>Fewer screens</span><span>More screens</span></div>
          </>
        )}
        <p className="dooh-bubble-guidance">{streetLevel ? "Hover for details · click to select" : "Hover for details · click to zoom"}<br />Tab to focus · Enter to {streetLevel ? "select" : "explore"}</p>
      </aside>
    </>
  );
}
