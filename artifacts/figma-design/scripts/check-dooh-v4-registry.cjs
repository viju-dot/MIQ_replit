const assert = require("node:assert/strict");
const path = require("node:path");
const vm = require("node:vm");
const { buildSync } = require("esbuild");

const bundle = buildSync({
  stdin: {
    contents: [
      'export { prototypeRepository, DOOH_VERSION_IDS } from "./prototypeStore";',
      'export { resolveDoohVersion, doohVersionToken, doohRendererVersion } from "./doohVersions";',
      'export { hydratePrototypeVersions } from "./prototypeVersionSync";',
    ].join("\n"),
    resolveDir: path.resolve(__dirname, "../client/src/lib"),
    loader: "ts",
  },
  bundle: true,
  platform: "node",
  format: "cjs",
  write: false,
}).outputFiles[0].text;

const storageKey = "fiber:ai-prototype:prototypes:v2";
const clone = value => JSON.parse(JSON.stringify(value));

function browser(localPrototype, remoteVersions = []) {
  const storage = new Map();
  if (localPrototype) storage.set(storageKey, JSON.stringify([localPrototype]));
  const remote = new Map(remoteVersions.map(version => [version.id, clone(version)]));
  const writes = [];
  const warnings = [];
  const module = { exports: {} };
  vm.runInNewContext(bundle, {
    module, exports: module.exports, require,
    console: { ...console, warn: (...args) => warnings.push(args) },
    window: {
      localStorage: {
        getItem: key => storage.get(key) ?? null,
        setItem: (key, value) => storage.set(key, value),
      },
    },
    fetch: async (url, options = {}) => {
      if (options.method === "PUT") {
        const { version } = JSON.parse(options.body);
        // Model the real API's allocation so accidental duplicate V4 writes
        // fail these tests instead of being silently accepted by the mock.
        if (!remote.has(version.id) && [...remote.values()].some(item => item.name === version.name &&
          !(version.id === "dooh_v5" && item.status === "archived"))) {
          version.name = "V5";
        }
        remote.set(version.id, version);
        writes.push(version.id);
        return { ok: true, json: async () => clone(version) };
      }
      return { ok: true, json: async () => clone([...remote.values()]) };
    },
  });
  return { ...module.exports, storage, remote, writes, warnings };
}

async function main() {
  const fresh = browser();
  const seed = clone(fresh.prototypeRepository.get("dooh"));
  const v4 = seed.versions.find(version => version.name === "V4");
  assert.equal(v4.id, "dooh_v4");
  assert.equal(fresh.resolveDoohVersion(seed.versions, "v4").id, v4.id);
  assert.equal(fresh.doohVersionToken(v4), "v4");
  assert.equal(fresh.doohRendererVersion(v4, seed.versions), "v2");
  assert.equal(fresh.doohRendererVersion(seed.versions[0], seed.versions), "v1");
  const v5 = seed.versions.find(version => version.name === "V5");
  assert.equal(v5.id, "dooh_v5");
  assert.equal(fresh.resolveDoohVersion(seed.versions, "v5").id, v5.id);
  assert.equal(fresh.doohVersionToken(v5), "v5");
  assert.equal(fresh.doohRendererVersion(v5, seed.versions), "v2");

  const old = clone(seed);
  old.name = "Existing DOOH review";
  old.versions = old.versions.filter(version => ["V1", "V2", "V3"].includes(version.name));
  const legacyBrowser = browser(old, old.versions);
  const migrated = clone(legacyBrowser.prototypeRepository.get("dooh"));
  assert.equal(migrated.name, old.name);
  assert.deepEqual(migrated.versions.slice(0, 3), old.versions);
  assert.equal(migrated.versions[3].name, "V4");
  await legacyBrowser.hydratePrototypeVersions("dooh");
  assert(legacyBrowser.remote.has("dooh_v4"));
  assert.deepEqual(legacyBrowser.writes, ["dooh_v4", "dooh_v5"]);

  const savedV4 = { ...v4, id: "existing_review_v4", metadata: { createdFrom: "dooh_v3" } };
  const existing = clone(old);
  existing.versions.push(savedV4);
  const returning = browser(existing, existing.versions);
  const kept = clone(returning.prototypeRepository.get("dooh"));
  assert.deepEqual(kept.versions.filter(version => version.name !== "V5"), existing.versions);
  assert.equal(returning.resolveDoohVersion(kept.versions, "v4").id, savedV4.id);
  assert.equal(returning.doohVersionToken(savedV4), "v4");
  await returning.hydratePrototypeVersions("dooh");
  assert.deepEqual(returning.writes, ["dooh_v5"]);

  const remoteOnly = browser(undefined, existing.versions);
  await remoteOnly.hydratePrototypeVersions("dooh");
  const adopted = clone(remoteOnly.prototypeRepository.get("dooh"));
  assert.equal(adopted.versions.filter(version => version.name === "V4").length, 1);
  assert.equal(adopted.versions.find(version => version.name === "V4").id, savedV4.id);
  assert(!remoteOnly.remote.has("dooh_v4"));
  assert.deepEqual(remoteOnly.writes, ["dooh_v5"]);

  // A server can already contain an earlier accidentally renamed seed.
  // The existing review V4 must still win over that placeholder in the UI,
  // and polling must not repeatedly try to write/rename the seed.
  const collision = browser(undefined, [...existing.versions, { ...v4, name: "V6" }]);
  await collision.hydratePrototypeVersions("dooh");
  await collision.hydratePrototypeVersions("dooh");
  const reconciled = clone(collision.prototypeRepository.get("dooh"));
  assert.equal(collision.resolveDoohVersion(reconciled.versions, "v4").id, savedV4.id);
  assert.equal(reconciled.versions.filter(version => version.name === "V4").length, 1);
  assert(!reconciled.versions.some(version => version.id === "dooh_v4"));
  assert.deepEqual(collision.writes, ["dooh_v5"]);
  assert(collision.remote.has("dooh_v4")); // No shared history was deleted.

  const archived = clone(existing);
  archived.versions[3].status = "archived";
  const archivedBrowser = browser(archived);
  assert.equal(archivedBrowser.prototypeRepository.get("dooh").versions[3].status, "archived");
  assert.equal(archivedBrowser.resolveDoohVersion(archivedBrowser.prototypeRepository.get("dooh").versions, "v4"), undefined);

  const oldArchivedV5 = { ...v5, id: "previous_archived_v5", status: "archived" };
  const archivedV5Browser = browser(undefined, [...existing.versions, oldArchivedV5]);
  await archivedV5Browser.hydratePrototypeVersions("dooh");
  const v5History = clone(archivedV5Browser.prototypeRepository.get("dooh")).versions;
  assert.equal(archivedV5Browser.resolveDoohVersion(v5History, "v5").id, "dooh_v5");
  assert.deepEqual(v5History.find(version => version.id === oldArchivedV5.id), oldArchivedV5);
  assert.equal(archivedV5Browser.remote.get("dooh_v5").name, "V5");
  assert.equal(archivedV5Browser.remote.get(oldArchivedV5.id).status, "archived");

  const renamedV5Browser = browser(undefined, [...existing.versions, oldArchivedV5, { ...v5, name: "V7" }]);
  await renamedV5Browser.hydratePrototypeVersions("dooh");
  await renamedV5Browser.hydratePrototypeVersions("dooh");
  assert.equal(renamedV5Browser.remote.get("dooh_v5").name, "V5");
  assert.equal(renamedV5Browser.resolveDoohVersion(renamedV5Browser.prototypeRepository.get("dooh").versions, "v5").id, "dooh_v5");
  assert.deepEqual(renamedV5Browser.remote.get(oldArchivedV5.id), oldArchivedV5);
  assert.deepEqual(renamedV5Browser.writes, ["dooh_v5"]);

  const savedV5 = { ...v5, id: "existing_review_v5" };
  const existingV5Browser = browser(undefined, [...existing.versions, savedV5]);
  await existingV5Browser.hydratePrototypeVersions("dooh");
  assert.equal(existingV5Browser.resolveDoohVersion(existingV5Browser.prototypeRepository.get("dooh").versions, "v5").id, savedV5.id);
  assert(!existingV5Browser.remote.has("dooh_v5"));

  for (const scenario of [fresh, legacyBrowser, returning, remoteOnly, collision, archivedBrowser, archivedV5Browser, renamedV5Browser, existingV5Browser]) {
    assert.deepEqual(scenario.warnings, []);
  }
  console.log("PASS: V4/V5 availability and deep links, V1–V3 preservation, legacy migration, shared version adoption, archived V5 preservation and new map-only V5.");
}

main().catch(error => { console.error(error); process.exitCode = 1; });
