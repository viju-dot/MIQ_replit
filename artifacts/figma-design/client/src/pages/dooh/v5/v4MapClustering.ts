import type { ScreenData } from "../data";

/** Area, not diameter, encodes count. Keep tiny count labels readable. */
export function v4OverviewDiameter(count: number): number {
  return Math.max(22, 30 * Math.sqrt(Math.max(0, count) / 125));
}

export const V4_DETAIL_ZOOM = 14;
type Point = { x: number; y: number };
type Group = { key: string; screens: ScreenData[] };

/**
 * Compact geographic neighbourhoods instead of coarse 56px grid cells.
 * Project into world pixels so panning cannot change cluster membership.
 * Every screen is represented exactly once, at its real inventory location.
 */
export function clusterV4Overview(
  screens: ScreenData[],
  project: (screen: ScreenData) => Point,
  zoom: number,
  hoveredScreenId: string | null,
): Group[] {
  if (zoom >= V4_DETAIL_ZOOM) {
    return screens.map(screen => ({ key: screen.id, screens: [screen] }));
  }
  const radius = zoom <= 8 ? 18 : 14;
  const groups: Group[] = [];
  const buckets = new Map<string, { point: Point; group: Group }[]>();
  for (const screen of screens) {
    if (screen.id === hoveredScreenId) {
      groups.push({ key: `hovered-${screen.id}`, screens: [screen] });
      continue;
    }
    const point = project(screen);
    const x = Math.floor(point.x / radius);
    const y = Math.floor(point.y / radius);
    let nearest: Group | undefined;
    let distance = radius * radius;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        for (const anchor of buckets.get(`${x + dx}:${y + dy}`) ?? []) {
          const d = (point.x - anchor.point.x) ** 2 + (point.y - anchor.point.y) ** 2;
          if (d <= distance) {
            distance = d;
            nearest = anchor.group;
          }
        }
      }
    }
    if (nearest) {
      nearest.screens.push(screen);
    } else {
      const group = { key: screen.id, screens: [screen] };
      groups.push(group);
      const key = `${x}:${y}`;
      const entries = buckets.get(key) ?? [];
      entries.push({ point, group });
      buckets.set(key, entries);
    }
  }
  return groups;
}
