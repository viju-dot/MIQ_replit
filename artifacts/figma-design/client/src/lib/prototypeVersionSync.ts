import {
  coercePrototypeVersion,
  prototypeRepository,
  DOOH_VERSION_IDS,
  type PrototypeVersion,
} from "./prototypeStore";

function versionsUrl(prototypeId: string): string {
  return `/api/prototypes/${encodeURIComponent(prototypeId)}/versions`;
}

async function getSharedVersions(prototypeId: string): Promise<PrototypeVersion[]> {
  const response = await fetch(versionsUrl(prototypeId), { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Version history load failed (${response.status})`);
  }
  const raw: unknown = await response.json();
  if (!Array.isArray(raw)) {
    throw new Error("Version history API returned a non-array");
  }
  return raw
    .map(coercePrototypeVersion)
    .filter((version): version is PrototypeVersion => version !== null);
}

async function putSharedVersion(
  prototypeId: string,
  version: PrototypeVersion,
): Promise<PrototypeVersion> {
  const response = await fetch(
    `${versionsUrl(prototypeId)}/${encodeURIComponent(version.id)}`,
    {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prototypeId, version }),
    },
  );
  if (!response.ok) {
    throw new Error(`Version history save failed (${response.status})`);
  }
  const saved = coercePrototypeVersion(await response.json());
  if (!saved || saved.id !== version.id) {
    throw new Error("Version history API returned an invalid version");
  }
  return saved;
}

/**
 * Pull shared metadata and safely migrate this browser's missing/newer entries.
 * Writes are per-version, so a stale local prototype record cannot replace a
 * collaborator's other version entries.
 */
export async function hydratePrototypeVersions(prototypeId: string): Promise<boolean> {
  try {
    let local = prototypeRepository.get(prototypeId);
    if (!local) return true;

    const previousVersions = JSON.stringify(local.versions);
    const remote = await getSharedVersions(prototypeId);
    // Adopt an already-shared V4 before migrating a new built-in placeholder,
    // otherwise the server would allocate a second V4 as V5.
    if (
      prototypeId === "dooh" &&
      remote.some(version => version.id !== DOOH_VERSION_IDS.v4 && version.name.trim().toUpperCase() === "V4")
    ) {
      local = prototypeRepository.mergeVersions(prototypeId, remote) ?? local;
    }
    const remoteById = new Map(remote.map((version) => [version.id, version]));
    let changedRemote = false;
    for (const localVersion of local.versions) {
      const shared = remoteById.get(localVersion.id);
      if (
        !shared ||
        Date.parse(localVersion.updatedAt) > Date.parse(shared.updatedAt)
      ) {
        const saved = await putSharedVersion(prototypeId, localVersion);
        remoteById.set(saved.id, saved);
        changedRemote = true;
      }
    }

    const latest = changedRemote
      ? await getSharedVersions(prototypeId)
      : Array.from(remoteById.values());
    const merged = prototypeRepository.mergeVersions(prototypeId, latest);
    return Boolean(
      merged && JSON.stringify(merged.versions) !== previousVersions,
    );
  } catch (error) {
    console.warn("[prototype-versions] shared sync failed", error);
    return false;
  }
}

/** Persist one newly created or changed version without uploading a whole prototype. */
export async function savePrototypeVersion(
  prototypeId: string,
  version: PrototypeVersion,
): Promise<PrototypeVersion> {
  const saved = await putSharedVersion(prototypeId, version);
  prototypeRepository.mergeVersions(prototypeId, [saved]);
  return saved;
}
