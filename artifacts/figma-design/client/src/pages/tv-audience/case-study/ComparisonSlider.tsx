import { useId, useState } from "react";
import { Lightbox } from "./Lightbox";
import { getVersionHotspots } from "./annotations";
import "./ComparisonSlider.css";

interface ComparisonSliderProps {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
}
const stories = [
  {
    title: "Metric hierarchy", beforeTop: 1080, afterTop: 1090, height: 550,
    issue: "V4 Trends plots an Index line alongside minutes and household percentage.",
    decision: "V5 removes the Index line and places Index beneath categories. Two unlike measures keep separate axes.",
    reason: "Separate relative comparison from viewing volume. The Index percent suffix and secondary-metric definition remain open issues; this is not a claim that all metric problems are solved.",
  },
  {
    title: "A data-ready TV scope", beforeTop: 555, afterTop: 555, height: 520,
    issue: "V4 includes Homescreen as a fourth consumption type.",
    decision: "V5 shows Linear TV, Streaming and FAST only.",
    reason: "Persisted annotation #33 explicitly says Homescreen data was not prepared. Removing it reflects data readiness, not a research finding about the number of chart segments.",
  },
  {
    title: "Staged global filters", beforeTop: 135, afterTop: 135, height: 150,
    issue: "V4 changes its global audience controls immediately; selections and results move together.",
    decision: "V5 separates draft selections from applied filters with an explicit Apply action.",
    reason: "Multiple audience changes can be made before recomputing the dashboard. The immediate All / Addressable control and local chart controls remain separate.",
  },
];
const asset = (path: string) => path.startsWith(import.meta.env.BASE_URL) ? path : `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

export function ComparisonSlider({ beforeImage, afterImage }: ComparisonSliderProps) {
  const [storyIndex, setStoryIndex] = useState(0);
  const [position, setPosition] = useState(50);
  const [viewer, setViewer] = useState<"V4" | "V5" | null>(null);
  const id = useId();
  const story = stories[storyIndex];
  return (
    <div className="cs-comparison">
      <div className="cs-comparison-tabs" aria-label="Before and after stories">
        {stories.map((item, index) => <button type="button" key={item.title} aria-pressed={storyIndex === index}
          onClick={() => { setStoryIndex(index); setPosition(50); }}>{item.title}</button>)}
      </div>
      <p className="cs-comparison-note">Actual V4 → V5 renderer captures. Compare interface structure, not the synthetic values.</p>
      <div className="cs-comparison-window" style={{ aspectRatio: `1440 / ${story.height}` }}>
        <img src={asset(beforeImage)} alt={`V4: ${story.issue}`} style={{ transform: `translateY(-${story.beforeTop / 1800 * 100}%)` }} />
        <div className="cs-comparison-reveal" style={{ clipPath: `inset(0 0 0 ${position}%)` }}>
          <img src={asset(afterImage)} alt={`V5: ${story.decision}`} style={{ transform: `translateY(-${story.afterTop / 1800 * 100}%)` }} />
        </div>
        <div className="cs-comparison-divider" style={{ left: `${position}%` }} aria-hidden="true" />
      </div>
      <div className="cs-comparison-labels"><span>V4 · Before</span><span>V5 · After</span></div>
      <label className="cs-comparison-range" htmlFor={id}>
        Slide to compare · {position}% before
        <input id={id} type="range" min="0" max="100" value={position} onChange={e => setPosition(Number(e.target.value))}
          aria-label="Before and after reveal position" />
      </label>
      <div className="cs-comparison-stories">
        <article><span>ISSUE · V4</span><p>{story.issue}</p><button type="button" onClick={() => setViewer("V4")}>Inspect before annotations ↗</button></article>
        <article><span>DECISION / RESULT · V5</span><p>{story.decision}</p><button type="button" onClick={() => setViewer("V5")}>Inspect after annotations ↗</button></article>
      </div>
      <p className="cs-comparison-reason"><strong>Why it changed.</strong> {story.reason}</p>
      <Lightbox isOpen={viewer !== null} onClose={() => setViewer(null)} imageSrc={asset(viewer === "V4" ? beforeImage : afterImage)}
        title={`${viewer || "V5"} · ${story.title}`} hotspots={getVersionHotspots(viewer || "V5")} />
    </div>
  );
}