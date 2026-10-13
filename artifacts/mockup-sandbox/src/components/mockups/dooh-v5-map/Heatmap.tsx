import { MapPreview } from "./_shared/MapPreview";
import { HeatmapLayer } from "./_shared/HeatmapLayer";

export function Heatmap() {
  return <MapPreview
    title="Screen density, without the noise"
    subtitle="Follow connected concentrations of screens across the UK. Inspect a local area, then zoom into the actual inventory."
    renderLayer={props => <HeatmapLayer {...props} />}
  />;
}
