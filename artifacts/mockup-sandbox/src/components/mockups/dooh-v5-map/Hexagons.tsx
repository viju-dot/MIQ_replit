import { MapPreview } from "./_shared/MapPreview";
import { HexagonLayer } from "./_shared/HexagonLayer";

export function Hexagons() {
  return <MapPreview title="Coverage, on a consistent footprint"
    subtitle="Compare screen concentration across UK cities. Equal-footprint hexagons reveal hotspots; explore a cell to see the screens behind it."
    renderLayer={props => <HexagonLayer {...props} />} />;
}
