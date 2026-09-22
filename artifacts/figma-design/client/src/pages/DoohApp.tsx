import { useEffect, useRef } from "react";
import { useLocation, useSearch, Link } from "wouter";
import { PrototypeCollabOverlay, PrototypeCommentLayer } from "@/components/PrototypeCollabOverlay";
import { DesignAnnotationLayer } from "@/components/DesignAnnotationLayer";
import { DOOH_VERSION_IDS } from "@/lib/prototypeStore";
import { usePrototypeVersion } from "@/lib/prototypeVersionContext";
import DoohPlanner from "./dooh/DoohPlanner";
import GeoPlanner from "./dooh/GeoPlanner";
import SavedAudiences from "./dooh/SavedAudiences";
import GeoPlannerV2 from "./dooh/v2/GeoPlannerV2";
import DoohPlannerV2 from "./dooh/v2/DoohPlannerV2";
import "./dooh/styles.css";
import "./dooh/versionShell.css";
import "leaflet/dist/leaflet.css";

export default function DoohApp() {
  return (
    <PrototypeCollabOverlay route="/dooh-planner">
      <DoohVersionedContent />
    </PrototypeCollabOverlay>
  );
}

function DoohVersionedContent() {
  const [location, navigate] = useLocation();
  const search = useSearch();
  const version = new URLSearchParams(search).get("version") === "v1" ? "v1" : "v2";
  const versionContext = usePrototypeVersion();
  const viewedVersionId = versionContext?.viewedVersion.id;
  const previous = useRef<{ version: "v1" | "v2"; viewedVersionId?: string }>();
  const isGeo = location.startsWith("/geo-planner");
  const isSaved = location.startsWith("/saved-audiences");
  const moduleTitle = isGeo ? "Geo Planner" : isSaved ? "Saved Audiences" : "DOOH Planner";

  // The URL is authoritative on first render/direct navigation. After that,
  // collaboration version-history changes are reflected back into the URL.
  useEffect(() => {
    if (!versionContext) return;
    const desiredId = DOOH_VERSION_IDS[version];
    const prior = previous.current;

    if (!prior || prior.version !== version) {
      previous.current = { version, viewedVersionId };
      if (viewedVersionId !== desiredId) {
        versionContext.setViewedVersionId(desiredId);
      }
      return;
    }

    if (prior.viewedVersionId !== viewedVersionId) {
      previous.current = { version, viewedVersionId };
      if (
        viewedVersionId !== DOOH_VERSION_IDS.v1 &&
        viewedVersionId !== DOOH_VERSION_IDS.v2
      ) {
        versionContext.setViewedVersionId(desiredId);
        return;
      }
      const viewedVersion =
        viewedVersionId === DOOH_VERSION_IDS.v1 ? "v1" : "v2";
      if (viewedVersion !== version) {
        const params = new URLSearchParams(search);
        params.set("version", viewedVersion);
        params.delete("edit");
        navigate(`${location}?${params}`);
      }
    }
  }, [location, navigate, search, version, versionContext, viewedVersionId]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${moduleTitle} ${version.toUpperCase()} · MiQ`;
    return () => { document.title = previousTitle; };
  }, [moduleTitle, version]);

  const moduleLink = (path: string) => `${path}?version=${version}`;
  const content = isSaved ? <SavedAudiences version={version} />
    : isGeo ? version === "v2" ? <GeoPlannerV2 /> : <GeoPlanner />
    : version === "v2" ? <DoohPlannerV2 /> : <DoohPlanner />;

  return (
    <div className="min-h-screen flex flex-col dooh-theme bg-[var(--surface-background-lvl2,#f7f7fa)] text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)]">
      <header className="dooh-version-header">
        <div className="dooh-version-brand"><strong aria-label="MiQ">MiQ</strong><span>Reports <span aria-hidden="true">›</span> Advanced</span></div>
        <div className="dooh-version-actions">
          <label>Version <select aria-label="Planner version" value={version} onChange={event => {
            const params = new URLSearchParams(search);
            params.set("version", event.target.value);
            params.delete("edit");
            navigate(`${location}?${params}`);
          }}><option value="v2">V2 · Current</option><option value="v1">V1 · Original</option></select></label>
          <span className="dooh-demo-user">Demo user</span>
          <Link href="/ai-prototype">Exit demo</Link>
        </div>
      </header>
      <nav aria-label="DOOH navigation" className="dooh-version-nav">
        <Link href={moduleLink("/geo-planner")} aria-current={isGeo ? "page" : undefined}>Geo Planner</Link>
        <Link href={moduleLink("/dooh-planner")} aria-current={!isGeo && !isSaved ? "page" : undefined}>DOOH</Link>
        <Link href={moduleLink("/saved-audiences")} aria-current={isSaved ? "page" : undefined}>Saved Audiences</Link>
        <span>Planning prototype · Mock inventory</span>
      </nav>

      <main className="flex-1 relative flex flex-col overflow-hidden">
        <div key={`${location}?${search}`} className="flex-1 flex flex-col min-w-0">{content}</div>
        <PrototypeCommentLayer />
        <DesignAnnotationLayer />
      </main>
    </div>
  );
}
