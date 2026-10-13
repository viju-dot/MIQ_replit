// Only the map's type dependency is extracted. No filter UI is changed.
export interface PlanningZone {
  id: string;
  type: "circle" | "polygon";
  center?: { lat: number; lng: number };
  radius?: number;
  points?: Array<{ lat: number; lng: number }>;
  label?: string;
}
