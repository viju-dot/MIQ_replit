import { useEffect, useRef } from "react";
import { useLocation, useSearch } from "wouter";
import { PrototypeCollabOverlay, PrototypeCommentLayer } from "@/components/PrototypeCollabOverlay";
import { DesignAnnotationLayer } from "@/components/DesignAnnotationLayer";
import { doohRendererVersion, doohVersionToken, resolveDoohVersion } from "@/lib/doohVersions";
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
  const requestedVersion = new URLSearchParams(search).get("version");
  const versionContext = usePrototypeVersion();
  const viewedVersionId = versionContext?.viewedVersion.id;
  const previous = useRef<{ requestedVersion: string | null; viewedVersionId?: string }>();
  const versions = versionContext?.prototype.versions ?? [];
  const resolved = resolveDoohVersion(versions, requestedVersion);
  const version = doohRendererVersion(versionContext?.viewedVersion ?? resolved, versions);
  const versionToken = versionContext ? doohVersionToken(versionContext.viewedVersion) : requestedVersion ?? "v2";
  const versionName = versionContext?.viewedVersion.name ?? version.toUpperCase();
  const isV6 = versionContext?.viewedVersion.id === DOOH_VERSION_IDS.v6 || versionName.trim().toLowerCase() === "v6";
  const isV5 = isV6 || versionContext?.viewedVersion.id === DOOH_VERSION_IDS.v5 || versionName.trim().toLowerCase() === "v5";
  const isV4 = isV5 || versionContext?.viewedVersion.id === DOOH_VERSION_IDS.v4 || versionName.trim().toLowerCase() === "v4";
  const supportsDemoView = versionToken === "v3" || isV4;
  const demoView = supportsDemoView && new URLSearchParams(search).get("demo") === "1";
  const isGeo = location.startsWith("/geo-planner");
  const isSaved = location.startsWith("/saved-audiences");
  const isDoohDemoPlanner = supportsDemoView && !isGeo && !isSaved;
  const moduleTitle = isGeo ? "Geo Planner" : isSaved ? "Saved Audiences" : "DOOH Planner";

  // The URL is authoritative on first render/direct navigation. After that,
  // collaboration version-history changes are reflected back into the URL.
  useEffect(() => {
    if (!versionContext) return;
    const prior = previous.current;

    if (!prior || prior.requestedVersion !== requestedVersion) {
      // Keep an unknown deep-link token pending while shared version metadata
      // hydrates; otherwise the initial V3 fallback would replace a valid V4
      // URL before its version record arrives from the API.
      if (requestedVersion && !resolved) {
        previous.current = { requestedVersion, viewedVersionId: "" };
        return;
      }
      const desiredId = resolved?.id ?? viewedVersionId;
      // Record the expected selection so the context update isn't mistaken
      // for a new user selection and reflected back into the URL.
      previous.current = { requestedVersion, viewedVersionId: desiredId };
      if (desiredId && viewedVersionId !== desiredId) {
        versionContext.setViewedVersionId(desiredId);
      }
      return;
    }

    if (
      requestedVersion &&
      resolved &&
      prior.viewedVersionId === "" &&
      viewedVersionId !== resolved.id
    ) {
      previous.current = { requestedVersion, viewedVersionId: resolved.id };
      versionContext.setViewedVersionId(resolved.id);
      return;
    }

    if (prior.viewedVersionId !== viewedVersionId) {
      previous.current = { requestedVersion, viewedVersionId };
      const viewedToken = doohVersionToken(versionContext.viewedVersion);
      if (viewedToken !== requestedVersion) {
        const params = new URLSearchParams(search);
        params.set("version", viewedToken);
        params.delete("edit");
        navigate(`${location}?${params}`);
      }
    }
  }, [location, navigate, search, requestedVersion, resolved?.id, versionContext, viewedVersionId]);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${moduleTitle} ${versionName} · MiQ`;
    return () => { document.title = previousTitle; };
  }, [moduleTitle, versionName]);

  const moduleLink = (path: string) => {
    const params = new URLSearchParams({ version: versionToken });
    if (demoView) params.set("demo", "1");
    return `${path}?${params.toString()}`;
  };
  const toggleDemoView = () => {
    const params = new URLSearchParams(search);
    if (demoView) params.delete("demo");
    else params.set("demo", "1");
    const query = params.toString();
    navigate(`${location}${query ? `?${query}` : ""}`);
  };
  const content = isSaved ? <SavedAudiences version={versionToken} />
    : isGeo ? version === "v2" ? <GeoPlannerV2 /> : <GeoPlanner />
    : version === "v2" ? (
      <DoohPlannerV2
        key={isV6 ? "v6" : isV5 ? "v5" : isV4 ? "v4" : "v2"}
        demoView={demoView}
        showRadius={!isV4}
        v4Layout={isV4}
        v5Layout={isV5}
      />
    ) : <DoohPlanner />;

  return (
    <div className={`min-h-screen flex flex-col dooh-theme bg-[var(--surface-background-lvl2,#f7f7fa)] text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)] ${!isGeo && !isSaved && version === "v2" ? "dooh-fixed-planner" : ""}`}>
      <header className="relative z-50 shrink-0" aria-label="Fiber navigation">
        <PrimaryNavigation />
        <SecondaryNavigation activeSection="Advanced" />
      </header>
      <div className="dooh-page-content">
      <section className="dooh-page-intro relative z-[3]" aria-labelledby="dooh-page-title">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 id="dooh-page-title">{isSaved ? "Saved Audiences" : "Audience & DOOH Planner"}</h1>
            {!isSaved && <p>Build target audiences and plan digital out-of-home screens.</p>}
          </div>
          {isDoohDemoPlanner && (
            <FiberButton
              variant={demoView ? "solid" : "outline"}
              ariaLabel={demoView ? "Exit DOOH demo view" : "Open DOOH demo view"}
              ariaPressed={demoView}
              onClick={toggleDemoView}
            >
              {demoView ? "Exit demo view" : "Demo view"}
            </FiberButton>
          )}
        </div>
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
        <PrototypeCommentLayer region="intro" />
      </section>

      {versionContext && requestedVersion && !resolved && (
        <p role="alert" className="px-4 py-2 text-sm">
          That version is unavailable in this browser. Showing {versionName}.
        </p>
      )}
      <main className="flex-1 min-h-0 relative flex flex-col overflow-hidden">
        {/* Keep planner stacking (sidebar/map) below both feedback layers. */}
        <div key={`${location}?${search}`} className="relative isolate flex-1 flex flex-col min-w-0 min-h-0">{content}</div>
        <PrototypeCommentLayer />
        <DesignAnnotationLayer />
      </main>
      </div>
    </div>
  );
}
