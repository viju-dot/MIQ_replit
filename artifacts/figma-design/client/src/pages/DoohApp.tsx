import { useEffect, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import { PrototypeCollabOverlay, PrototypeCommentLayer } from "@/components/PrototypeCollabOverlay";
import { DesignAnnotationLayer } from "@/components/DesignAnnotationLayer";
import { DOOH_VERSION_IDS } from "@/lib/prototypeStore";
import { usePrototypeVersion } from "@/lib/prototypeVersionContext";
import { PrimaryNavigation, SecondaryNavigation } from "./TvAudienceApp";
import { FiberTabLink, FiberRoundedTabsBar } from "@/components/FiberTabItem";
import DoohPlanner from "./dooh/DoohPlanner";
import GeoPlanner from "./dooh/GeoPlanner";
import SavedAudiences from "./dooh/SavedAudiences";
import GeoPlannerV2 from "./dooh/v2/GeoPlannerV2";
import DoohPlannerV2 from "./dooh/v2/DoohPlannerV2";
import { FiberButton } from "./dooh/v2/primitives";
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
      <header className="relative z-50 shrink-0" aria-label="Fiber navigation">
        <PrimaryNavigation />
        <SecondaryNavigation activeSection="Advanced" />
      </header>
      <div className="dooh-page-content">
      <section className="dooh-page-intro" aria-labelledby="dooh-page-title">
        <h1 id="dooh-page-title">{isGeo ? "Geo Planner" : isSaved ? "Saved Audiences" : "DOOH Planner – Find & Plan Screens"}</h1>
        {!isSaved && <p>{isGeo ? "Select filters and intelligence to build your target audience, then save for reuse." : "Use saved audiences or upload data to find digital out-of-home screens."}</p>}
        <nav aria-label="DOOH navigation" className="dooh-fiber-tabs flex justify-between items-center w-full">
          <FiberRoundedTabsBar>
            <FiberTabLink rounded href={moduleLink("/geo-planner")} selected={isGeo} label="Geo Planner" />
            <FiberTabLink rounded href={moduleLink("/dooh-planner")} selected={!isGeo && !isSaved} label="DOOH" />
          </FiberRoundedTabsBar>
          {isGeo && (
            <div className="relative group ml-auto flex items-center">
              <div className="absolute bottom-full right-0 mb-2 w-48 p-2 text-xs text-center text-white bg-gray-800 rounded-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10">
                Activation is not connected in this prototype.
                <div className="absolute top-full right-4 -mt-1 border-4 border-transparent border-t-gray-800"></div>
              </div>
              <FiberButton variant="secondary" disabled>
                Activate
              </FiberButton>
            </div>
          )}
        </nav>
      </section>

      <main className="flex-1 relative flex flex-col overflow-hidden">
        <div key={`${location}?${search}`} className="flex-1 flex flex-col min-w-0">{content}</div>
        <PrototypeCommentLayer />
        <DesignAnnotationLayer />
      </main>
      </div>
    </div>
  );
}
