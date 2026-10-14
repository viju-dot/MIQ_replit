import type { ScreenData } from "../data";

/** Area, not diameter, encodes count. Keep tiny count labels readable. */
export function v4OverviewDiameter(count: number): number {
  return Math.max(22, 30 * Math.sqrt(Math.max(0, count) / 125));
}

type Point = { x: number; y: number };
type Group = { key: string; screens: ScreenData[] };
type SpatialGroup = Group & { point: Point };

/**
 * A screen-pixel radius corresponds to progressively smaller geographic
 * coverage as the map zooms in. Use a wider radius at the regional overview.
 */
export function v4ClusterRadiusPixels(zoom: number): number {
  return zoom <= 6 ? 56 : zoom <= 9 ? 44 : zoom <= 12 ? 32 : 24;
}

/**
 * Build a geographic hierarchy, from screen locations down to the active zoom.
 * A parent receives whole child clusters, never overlapping sets of screens:
 * zooming out merges children; zooming in reveals those same children.
 * Input is the viewport's filtered inventory, not invented city-level counts.
 */
export function clusterV4Overview(
  screens: ScreenData[],
  project: (screen: ScreenData) => Point,
  zoom: number,
): Group[] {
  let groups: SpatialGroup[] = [...screens]
    .sort((a, b) => a.id.localeCompare(b.id))
    .map(screen => ({ key: screen.id, screens: [screen], point: project(screen) }));
  const activeZoom = Math.max(0, Math.min(19, Math.floor(zoom)));
  for (let level = 19; level >= activeZoom; level--) {
    const radius = v4ClusterRadiusPixels(level);
    const scale = 2 ** (level - zoom);
    const parents: SpatialGroup[] = [];
    const buckets = new Map<string, { seed: Point; group: SpatialGroup }[]>();
    for (const child of groups) {
      const point = { x: child.point.x * scale, y: child.point.y * scale };
      const x = Math.floor(point.x / radius);
      const y = Math.floor(point.y / radius);
      let nearest: SpatialGroup | undefined;
      let distance = radius * radius;
      for (let dx = -1; dx <= 1; dx++) {
        for (let dy = -1; dy <= 1; dy++) {
          for (const anchor of buckets.get(`${x + dx}:${y + dy}`) ?? []) {
            const d = (point.x - anchor.seed.x) ** 2 + (point.y - anchor.seed.y) ** 2;
            if (d <= distance) {
              distance = d;
              nearest = anchor.group;
            }
          }
        }
      }
      if (nearest) {
        const total = nearest.screens.length + child.screens.length;
        nearest.point = {
          x: (nearest.point.x * nearest.screens.length + child.point.x * child.screens.length) / total,
          y: (nearest.point.y * nearest.screens.length + child.point.y * child.screens.length) / total,
        };
        nearest.screens.push(...child.screens);
      } else {
        const group = { key: child.key, screens: [...child.screens], point: { ...child.point } };
        parents.push(group);
        const key = `${x}:${y}`;
        const entries = buckets.get(key) ?? [];
        entries.push({ seed: point, group });
        buckets.set(key, entries);
      }
    }
    groups = parents;
  }
  return groups.map(({ key, screens: members }) => ({ key, screens: members }));
}
