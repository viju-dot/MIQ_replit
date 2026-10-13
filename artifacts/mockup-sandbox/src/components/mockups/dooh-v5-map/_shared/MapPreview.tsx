import { useState, type ReactNode } from "react";
import { MapPanelV2 } from "./source/v2/v2planner-map-panel";
import { SCREENS } from "./source/data";
import type { OverviewLayerProps } from "./LayerProps";
import "leaflet/dist/leaflet.css";
import "../_group.css";

export function MapPreview({ title, subtitle, renderLayer }: {
  title: string;
  subtitle: string;
  renderLayer?: (props: OverviewLayerProps) => ReactNode;
}) {
  const [hoveredScreenId, setHoveredScreenId] = useState<string | null>(null);
  const props: OverviewLayerProps = { screens: SCREENS, hoveredScreenId, onScreenClick: setHoveredScreenId, currency: "GBP", showCpm: true };
  return (
    <main style={{ height: "100dvh", minHeight: 580, display: "flex", flexDirection: "column", padding: 20, gap: 16, background: "var(--surface-background-lvl2,#f7f7fa)", color: "var(--surface-foreground-dynamic-neutral-default-variation,#13131a)", fontFamily: '"DM Sans", Helvetica' }}>
      <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 24 }}>
        <div>
          <div style={{ fontSize: 11, letterSpacing: ".08em", color: "#7c33b5", fontWeight: 600, marginBottom: 6 }}>DOOH V5 · MAP EXPLORATION</div>
          <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>{title}</h1>
          <p style={{ fontSize: 13, margin: "6px 0 0", color: "#717180", maxWidth: 690 }}>{subtitle}</p>
        </div>
        <span style={{ fontSize: 11, border: "1px solid #e1e1e8", background: "#fff", borderRadius: 4, padding: "8px 10px", whiteSpace: "nowrap" }}>Same demo inventory · filters unchanged</span>
      </header>
      <section aria-label={title} style={{ flex: 1, minHeight: 0, overflow: "hidden", border: "1px solid #e1e1e8", borderRadius: 8 }}>
        <MapPanelV2 {...props} v4Layout expanded overviewLayer={renderLayer?.(props)} />
      </section>
    </main>
  );
}
