import { useEffect, useRef, type ReactNode } from "react";
import L from "leaflet";
import { BubbleLayer } from "./BubbleLayer";
import { HexagonLayer } from "./HexagonLayer";
import { HeatmapLayer } from "./HeatmapLayer";
import type { OverviewLayerProps } from "./LayerProps";
import "./Heatmap.css";
import "./V5Overview.css";

export type V5OverviewMode = "v4" | "bubbles" | "hexagons" | "heatmap";
const choices: { mode: V5OverviewMode; label: string }[] = [
  { mode: "v4", label: "V4 Map" },
  { mode: "bubbles", label: "Bubbles" },
  { mode: "hexagons", label: "Hexagons" },
  { mode: "heatmap", label: "Heatmap" },
];

export function V5Overview({ mode, onModeChange, v4Layer, ...props }: OverviewLayerProps & {
  mode: V5OverviewMode;
  onModeChange: (mode: V5OverviewMode) => void;
  v4Layer: ReactNode;
}) {
  const tools = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!tools.current) return;
    L.DomEvent.disableClickPropagation(tools.current);
    L.DomEvent.disableScrollPropagation(tools.current);
  }, []);
  return <>
    <div ref={tools} className="dooh-v5-overview-tools" role="group" aria-label="Map overview options"
      onClick={event => event.stopPropagation()} onDoubleClick={event => event.stopPropagation()}
      onMouseDown={event => event.stopPropagation()} onWheel={event => event.stopPropagation()}>
      {choices.map(choice => <button key={choice.mode} type="button"
        aria-pressed={mode === choice.mode} onClick={() => onModeChange(choice.mode)}>
        {choice.label}
      </button>)}
    </div>
    {mode === "v4" ? v4Layer : mode === "bubbles" ? <BubbleLayer {...props} /> : mode === "hexagons" ? <HexagonLayer {...props} /> : <HeatmapLayer {...props} />}
  </>;
}
