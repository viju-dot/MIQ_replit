const assert = require("node:assert/strict");
const path = require("node:path");
const vm = require("node:vm");
const { buildSync } = require("esbuild");
const bundle = buildSync({
  stdin: {
    contents: 'export * from "./v5/v4MapClustering"; export { SCREENS } from "./data";',
    resolveDir: path.resolve(__dirname, "../client/src/pages/dooh"),
    loader: "ts",
  },
  bundle: true, platform: "node", format: "cjs", write: false,
}).outputFiles[0].text;
const moduleResult = { exports: {} };
vm.runInNewContext(bundle, { module: moduleResult, exports: moduleResult.exports, require });
const { v4OverviewDiameter, v4ClusterRadiusPixels, clusterV4Overview, SCREENS } = moduleResult.exports;
const project = zoom => screen => {
  const scale = 256 * 2 ** zoom;
  const sin = Math.sin(screen.lat * Math.PI / 180);
  return {
    x: (screen.lng + 180) / 360 * scale,
    y: (.5 - Math.log((1 + sin) / (1 - sin)) / (4 * Math.PI)) * scale,
  };
};

// Circle areas are proportional at the requested 125/250-screen counts.
assert(Math.abs((v4OverviewDiameter(250) / v4OverviewDiameter(125)) ** 2 - 2) < 1e-10);
assert(v4OverviewDiameter(500) > v4OverviewDiameter(250));
assert(v4OverviewDiameter(2) >= 22);
const inventory = new Set(SCREENS.map(screen => screen.id));
const levels = new Map();
for (let zoom = 3; zoom <= 19; zoom++) {
  const groups = clusterV4Overview(SCREENS, project(zoom), zoom);
  levels.set(zoom, groups);
  const ids = groups.flatMap(group => group.screens.map(screen => screen.id));
  assert.equal(ids.length, SCREENS.length);
  assert.equal(new Set(ids).size, SCREENS.length);
  assert(ids.every(id => inventory.has(id)));
  // Stable results do not depend on the caller's screen order or hover state.
  assert.equal(JSON.stringify(groups), JSON.stringify(clusterV4Overview([...SCREENS].reverse(), project(zoom), zoom)));
  if ([5, 6, 7, 10, 13, 14, 17, 19].includes(zoom)) {
    console.log(`Zoom ${zoom}: ${groups.length} markers; sample counts ${[...new Set(groups.map(g => g.screens.length))].slice(0, 10).join(", ")}; total ${ids.length}`);
  }
  if (zoom > 3) {
    const parents = levels.get(zoom - 1);
    const owner = new Map(parents.flatMap((group, index) => group.screens.map(screen => [screen.id, index])));
    // Every child belongs wholly to one parent: no cross-cluster duplication.
    for (const group of groups) {
      assert.equal(new Set(group.screens.map(screen => owner.get(screen.id))).size, 1);
    }
    assert(groups.length >= parents.length);
    assert(v4ClusterRadiusPixels(zoom) / 2 ** zoom < v4ClusterRadiusPixels(zoom - 1) / 2 ** (zoom - 1));
  }
}
assert(levels.get(13).length > levels.get(6).length);
assert(levels.get(17).some(group => group.screens.length === 1));
assert(new Set(levels.get(6).map(group => group.screens.length)).size > 1);
assert.equal(clusterV4Overview([], project(6), 6).length, 0);
for (const subset of [
  SCREENS.slice(0, 57), // Changed filter coverage.
  SCREENS.filter(s => s.lat > 51 && s.lat < 52 && s.lng > -1 && s.lng < .5), // London viewport.
  SCREENS.filter(s => s.lat > 53.4 && s.lat < 53.6 && s.lng > -3.1 && s.lng < -2), // Panned north.
  SCREENS.filter(s => s.lat > 51.5074 && s.lat < 51.52 && s.lng > -.15 && s.lng < -.1), // Partial city.
]) {
  assert(subset.length > 0 && subset.length < SCREENS.length);
  const groups = clusterV4Overview(subset, project(10), 10);
  const members = groups.flatMap(group => group.screens.map(screen => screen.id));
  assert.equal(members.length, subset.length);
  assert.equal(new Set(members).size, subset.length);
  assert(members.every(id => subset.some(screen => screen.id === id)));
}
console.log("PASS: proportional areas, zoom-dependent geographic radii, hierarchical split/merge, no double counting at all zooms, variable data-derived counts, viewport/filter changes, partial-city coverage, empty coverage, individual pins.");
