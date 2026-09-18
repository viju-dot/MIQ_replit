import { useLocation, Link } from "wouter";
import { PrototypeCollabOverlay, PrototypeCommentLayer } from "@/components/PrototypeCollabOverlay";
import { DesignAnnotationLayer } from "@/components/DesignAnnotationLayer";
import DoohPlanner from "./dooh/DoohPlanner";
import GeoPlanner from "./dooh/GeoPlanner";
import SavedAudiences from "./dooh/SavedAudiences";
import "./dooh/styles.css";
import "leaflet/dist/leaflet.css";

export default function DoohApp() {
  const [location] = useLocation();

  let Content = DoohPlanner;
  if (location.startsWith("/geo-planner")) Content = GeoPlanner;
  else if (location.startsWith("/saved-audiences")) Content = SavedAudiences;

  return (
    <PrototypeCollabOverlay route="/dooh-planner">
      <div className="min-h-screen flex flex-col dooh-theme bg-[var(--surface-background-lvl2,#f7f7fa)] text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)]">
        <header className="dooh-header h-[64px] shrink-0 bg-[var(--surface-background-miq,#2b0030)] text-white flex items-center px-6 justify-between z-50 relative shadow-sm">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-[var(--colours-blue-300,#d194ff)] text-[#2b0030] flex items-center justify-center font-bold text-xs">Σ</div>
              <h1 className="text-[18px] font-bold tracking-tight">DOOH Planner</h1>
            </div>
            <nav aria-label="DOOH navigation" className="flex items-center gap-6 text-[15px] font-medium">
              <Link href="/dooh-planner" className={`pb-1 border-b-2 transition-colors ${location === "/dooh-planner" ? "border-[var(--colours-blue-300,#d194ff)] text-[var(--colours-blue-300,#d194ff)]" : "border-transparent text-white/80 hover:text-white"}`}>Plan Campaign</Link>
              <Link href="/geo-planner" className={`pb-1 border-b-2 transition-colors ${location === "/geo-planner" ? "border-[var(--colours-blue-300,#d194ff)] text-[var(--colours-blue-300,#d194ff)]" : "border-transparent text-white/80 hover:text-white"}`}>Geo Planner</Link>
              <Link href="/saved-audiences" className={`pb-1 border-b-2 transition-colors ${location === "/saved-audiences" ? "border-[var(--colours-blue-300,#d194ff)] text-[var(--colours-blue-300,#d194ff)]" : "border-transparent text-white/80 hover:text-white"}`}>Saved Audiences</Link>
            </nav>
          </div>
          <div className="flex items-center gap-4 text-sm font-medium">
            <span className="text-white/80">Demo · Alex Chen</span>
            <Link href="/ai-prototype" className="text-[var(--colours-blue-300,#d194ff)] hover:text-white transition-colors">Exit demo</Link>
          </div>
        </header>
        
        <main className="flex-1 relative flex flex-col overflow-hidden">
          <Content />
          <PrototypeCommentLayer />
          <DesignAnnotationLayer />
        </main>
      </div>
    </PrototypeCollabOverlay>
  );
}
