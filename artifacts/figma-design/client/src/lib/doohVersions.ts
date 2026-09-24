import { DOOH_VERSION_IDS, type PrototypeVersion } from "./prototypeStore";

export function doohVersionToken(version: PrototypeVersion): string {
  if (version.id === DOOH_VERSION_IDS.v1) return "v1";
  if (version.id === DOOH_VERSION_IDS.v2) return "v2";
  if (version.id === DOOH_VERSION_IDS.v3) return "v3";
  return version.id;
}

export function resolveDoohVersion(versions: PrototypeVersion[], token: string | null) {
  if (!token) return undefined;
  const id = token.toLowerCase() === "v1" ? DOOH_VERSION_IDS.v1
    : token.toLowerCase() === "v2" ? DOOH_VERSION_IDS.v2
      : token.toLowerCase() === "v3" ? DOOH_VERSION_IDS.v3
        : token;
  return versions.find(version => version.status === "active" && version.id === id)
    ?? versions.find(version => version.status === "active" && version.name.toLowerCase() === token.toLowerCase());
}

/** Versions are snapshots of metadata; duplicates reuse their source renderer. */
export function doohRendererVersion(version: PrototypeVersion | undefined, versions: PrototypeVersion[]): "v1" | "v2" {
  const seen = new Set<string>();
  let current = version;
  while (current && !seen.has(current.id)) {
    if (current.id === DOOH_VERSION_IDS.v1) return "v1";
    if (current.id === DOOH_VERSION_IDS.v2 || current.id === DOOH_VERSION_IDS.v3) return "v2";
    seen.add(current.id);
    const source = current.metadata?.createdFrom;
    current = source ? versions.find(item => item.id === source || item.name === source) : undefined;
  }
  return "v2";
}