import type { ScreenData } from "../data";
import type { V4Currency } from "../v2/v4-map-helpers";

export interface OverviewLayerProps {
  screens: ScreenData[];
  hoveredScreenId: string | null;
  onScreenClick: (id: string) => void;
  currency?: V4Currency;
  showCpm?: boolean;
  sourceScreenIds?: Record<string, string[]>;
}
