import { useParams } from "wouter";
import TvAudienceDashboardPage from "@/pages/ds/TvAudienceDashboardPage";
import V3ContentPlanner from "./v3/V3ContentPlanner";
import V4ContentPlanner from "./v4/V4ContentPlanner";
import V5ContentPlanner from "./v5/V5ContentPlanner";

/**
 * Evidence capture surface: imports the exact version renderers, without the
 * collaboration overlay. These are captures of available source, not archival
 * reconstructions. V1 and V2 intentionally share the same renderer.
 */
export default function CaseStudyCapture() {
  const { version = "V5" } = useParams();
  const lower = new URLSearchParams(window.location.search).get("section") === "lower";
  return (
    <div style={{ background: "var(--surface-background-lvl2, #f7f7fa)", minHeight: "100vh", paddingTop: 32, ...(lower ? { height: 2200, overflow: "hidden" } : {}) }}>
      <main className="relative mx-auto w-full max-w-[1440px] px-6 py-8 md:px-24" style={lower ? { transform: "translateY(-1660px)" } : undefined}>
        {version === "V3" ? <V3ContentPlanner /> :
          version === "V4" ? <V4ContentPlanner /> :
          version === "V1" || version === "V2" ? <TvAudienceDashboardPage /> :
          <V5ContentPlanner instanceId="case-study-evidence" />}
      </main>
    </div>
  );
}