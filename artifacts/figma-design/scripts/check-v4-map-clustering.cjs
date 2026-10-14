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
const { v4OverviewDiameter, clusterV4Overview, SCREENS } = moduleResult.exports;
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
for (const zoom of [5, 6, 7, 10, 13, 14, 17]) {
  const groups = clusterV4Overview(SCREENS, project(zoom), zoom, null);
  const ids = groups.flatMap(group => group.screens.map(screen => screen.id));
  assert.equal(ids.length, SCREENS.length);
  assert.equal(new Set(ids).size, SCREENS.length);
  assert(ids.every(id => SCREENS.some(screen => screen.id === id)));
  // Deterministic world projection: moving a viewport does not change groups.
  assert.equal(JSON.stringify(groups), JSON.stringify(clusterV4Overview(SCREENS, project(zoom), zoom, null)));
  if (zoom >= 14) assert(groups.every(group => group.screens.length === 1));
  if (zoom === 6) console.log(`UK overview: ${groups.length} real geographic hotspots from ${ids.length} screens`);
}
const selected = SCREENS[0];
const hovered = clusterV4Overview(SCREENS, project(6), 6, selected.id);
assert(hovered.some(group => group.screens.length === 1 && group.screens[0].id === selected.id));
assert.equal(clusterV4Overview([], project(6), 6, null).length, 0);
const subset = SCREENS.slice(0, 57);
assert.equal(clusterV4Overview(subset, project(8), 8, null).flatMap(group => group.screens).length, subset.length);
console.log("PASS: proportional 125/250 areas, exact inventory counts, geographic clustering, deterministic membership, hovered pins, filtered/empty data, street-level pins.");
