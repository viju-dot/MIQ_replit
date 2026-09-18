import React, { useState, useEffect } from 'react';
import { ComparisonSlider } from './ComparisonSlider';
import { getVersionHotspots } from './annotations';
import * as contentData from './content';
import { Lightbox } from './Lightbox';
import type { Hotspot } from './types';
import { ChallengeCards, FiberDetails } from './StoryDetails';
import { Link } from 'wouter';
import { 
  ArrowRight, Activity, Users, MonitorPlay, Zap, ArrowLeft, 
  CheckCircle2, ChevronRight, Check, Target, LineChart, PieChart, Info, ExternalLink, 
  ZoomIn
} from 'lucide-react';
import './CaseStudy.css';

const asset = (path: string) => {
  const base = import.meta.env.BASE_URL || '/';
  return `${base}${path.replace(/^\//, '')}`;
};

const NAV_ANCHORS = [
  { id: 'overview', label: 'Overview' },
  { id: 'problem', label: 'Problem' },
  { id: 'users', label: 'Users' },
  { id: 'process', label: 'Process' },
  { id: 'dataviz', label: 'Data Viz' },
  { id: 'exploration', label: 'Exploration' },
  { id: 'iterations', label: 'Iterations' },
  { id: 'feedback', label: 'Feedback' },
  { id: 'interactions', label: 'Interactions' },
  { id: 'designsystem', label: 'Design System' },
  { id: 'evaluation', label: 'Evaluation' },
  { id: 'v5', label: 'V5 Result' },
  { id: 'learnings', label: 'Learnings' },
];

export default function CaseStudy() {
  const [activeSection, setActiveSection] = useState(NAV_ANCHORS[0].id);
  const [progress, setProgress] = useState(0);
  const [lightbox, setLightbox] = useState<{isOpen: boolean, src: string, hotspots: Hotspot[], title: string}>({
    isOpen: false, src: '', hotspots: [], title: ''
  });

  const [expandedUseCases, setExpandedUseCases] = useState<Record<string, boolean>>({});
  const [activeMetric, setActiveMetric] = useState<'avg' | 'pct' | 'idx' | null>(null);
  const [activeVersionId, setActiveVersionId] = useState(contentData.versions[contentData.versions.length - 1]?.id || 'V5');
  const [compareVersion, setCompareVersion] = useState(false);
  const [activeKpi, setActiveKpi] = useState(contentData.kpis[0]);
  const [expandedFeedback, setExpandedFeedback] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "UX Case Study - TV Audience";
    const metadata = [["name", "description"], ["property", "og:title"], ["property", "og:description"]].map(([attribute, value]) => {
      const existing = document.head.querySelector<HTMLMetaElement>(`meta[${attribute}="${value}"]`);
      const node = existing || document.createElement("meta");
      const old = node.content;
      node.setAttribute(attribute, value);
      node.content = value === "og:title" ? document.title : "Explore the evidence, design decisions and V1–V5 evolution of the TV Audience & Content Planner.";
      if (!existing) document.head.appendChild(node);
      return { node, existing, old };
    });
    
    const onScroll = () => {
      const winScroll = document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setProgress(height > 0 ? Math.min(100, Math.max(0, winScroll / height * 100)) : 0);
      let current = "overview";
      let nearest = -Infinity;
      for (const anchor of NAV_ANCHORS) {
        const top = document.getElementById(anchor.id)?.getBoundingClientRect().top;
        if (top !== undefined && top <= 165 && top > nearest) { current = anchor.id; nearest = top; }
      }
      setActiveSection(current);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    onScroll();
    
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      document.title = previousTitle;
      metadata.forEach(({ node, existing, old }) => existing ? node.content = old : node.remove());
    };
  }, []);

  const openLightbox = (src: string, versionId: string, title: string = '') => {
    const hotspots = getVersionHotspots(versionId) || [];
    setLightbox({ isOpen: true, src: asset(src), hotspots, title });
  };

  const activeVersion = contentData.versions.find(v => v.id === activeVersionId) || contentData.versions[0];
  const activeVersionIdx = contentData.versions.findIndex(v => v.id === activeVersionId);
  const prevVersion = activeVersionIdx > 0 ? contentData.versions[activeVersionIdx - 1] : null;
  const canCompare = activeVersion.id !== 'V1' && prevVersion;

  return (
    <div className="case-study-root">
      <div 
        className="cs-scroll-progress" 
        style={{ transform: `scaleX(${progress / 100})` }} 
        role="progressbar" 
        aria-label="Case study reading progress"
        aria-valuenow={Math.round(progress)} 
        aria-valuemin={0} 
        aria-valuemax={100} 
      />
      
      <div className="cs-container cs-layout">
        
        {/* Desktop Sticky Nav */}
        <aside className="cs-nav-wrapper">
          <div className="sticky top-16">
            <Link href="/tv-audience-intelligence" className="inline-flex items-center gap-2 text-sm font-bold text-gray-500 hover:text-indigo-600 mb-8 transition-colors">
              <ArrowLeft size={16} /> Back to Prototype
            </Link>
            <h2 className="font-display font-bold text-xl mb-6 flex items-center gap-2 text-gray-900">
              <Activity className="text-indigo-600" /> Case Study
            </h2>
            <nav className="flex flex-col relative" aria-label="Table of contents">
              <div className="absolute left-[7px] top-4 bottom-4 w-px bg-gray-200 z-0" />
              {NAV_ANCHORS.map((anchor) => (
                <a 
                  key={anchor.id}
                  href={`#${anchor.id}`}
                  aria-current={activeSection === anchor.id ? 'step' : undefined}
                  className={`relative z-10 pl-6 py-2 text-sm font-semibold transition-all flex items-center group focus-visible ${
                    activeSection === anchor.id ? 'text-indigo-700' : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <div className={`absolute left-0 w-4 h-4 rounded-full border-2 bg-white transition-colors duration-300 ${
                    activeSection === anchor.id ? 'border-indigo-600 scale-110' : 'border-gray-200 group-hover:border-gray-400'
                  }`} />
                  {anchor.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Mobile Sticky Nav */}
        <nav className="cs-nav-mobile" aria-label="Mobile navigation">
          <div className="cs-nav-mobile-list">
            <Link href="/tv-audience-intelligence" className="px-4 py-2 whitespace-nowrap text-sm font-bold">← Prototype</Link>
            {NAV_ANCHORS.map((anchor) => (
              <a
                key={anchor.id}
                href={`#${anchor.id}`}
                aria-current={activeSection === anchor.id ? 'step' : undefined}
                className={`px-4 py-2 whitespace-nowrap rounded-full text-sm font-bold transition-colors ${
                  activeSection === anchor.id ? 'bg-indigo-100 text-indigo-800' : 'bg-white text-gray-600 border border-gray-200'
                }`}
              >
                {anchor.label}
              </a>
            ))}
          </div>
        </nav>

        {/* MAIN CONTENT */}
        <main className="cs-main pb-32">
          
          {/* 01. OVERVIEW */}
          <section id="overview" className="cs-section pt-12 md:pt-24 border-none">
            <p className="cs-eyebrow mb-5">Interactive UX case study · AI-assisted product prototype</p>
            <h1 className="cs-h1 mb-6 text-gray-900">TV Audience & Content Planner</h1>
            <p className="cs-p-large text-gray-600 mb-12 max-w-3xl">
              Turning complex TV audience behaviour into actionable media-planning insights.
            </p>
            
            <button 
              className="w-full relative rounded-2xl overflow-hidden shadow-2xl mb-12 cursor-pointer group text-left block focus-visible" 
              onClick={() => openLightbox('/case-study/v5.jpg', 'V5', 'V5 Final Prototype')}
              aria-label="View V5 Final Prototype Screenshot"
            >
              <div className="absolute inset-0 bg-indigo-900/5 group-hover:bg-transparent transition-colors z-10" />
              <img src={asset('/case-study/v5.jpg')} alt="V5 Master Dashboard" className="w-full block" />
              <div className="absolute bottom-4 right-4 z-20 bg-black/80 text-white text-sm font-bold px-4 py-2 rounded-full flex items-center gap-2 backdrop-blur-md">
                <ZoomIn size={16} aria-hidden="true" /> Expand V5 Result
              </div>
            </button>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm text-sm">
              <div><div className="text-gray-400 font-bold uppercase tracking-wider mb-1 text-xs">Role</div><div className="font-semibold text-gray-900">{contentData.context.role}</div></div>
              <div><div className="text-gray-400 font-bold uppercase tracking-wider mb-1 text-xs">Timeline</div><div className="font-semibold text-gray-900">{contentData.context.timeline}</div></div>
              <div><div className="text-gray-400 font-bold uppercase tracking-wider mb-1 text-xs">Users</div><div className="font-semibold text-gray-900">{contentData.context.users}</div></div>
              <div><div className="text-gray-400 font-bold uppercase tracking-wider mb-1 text-xs">Markets</div><div className="font-semibold text-gray-900">{contentData.context.markets}</div></div>
              <div><div className="text-gray-400 font-bold uppercase tracking-wider mb-1 text-xs">Scope</div><div className="font-semibold text-gray-900">{contentData.context.scope} • {contentData.context.status}</div></div>
            </div>

            <div className="mt-6 bg-orange-50 border border-orange-200 p-4 rounded-xl flex gap-3 text-orange-900 text-sm">
              <Info className="shrink-0 text-orange-600 mt-0.5" size={18} />
              <div>
                <strong>Evidence Context:</strong> The case study uses available renderer captures of the prototype iterations utilizing synthetic deterministic data. No independent formal user-study outcomes or business impact metrics were documented for Phase 1.
              </div>
            </div>
          </section>

          {/* 02. PROBLEM & CASES */}
          <section id="problem" className="cs-section">
            <h2 className="cs-eyebrow mb-4">02. The Challenge</h2>
            <h3 className="cs-h2 mb-8">Making sense of television.</h3>
            <p className="cs-p max-w-3xl mb-12">
              The core challenge was turning a massive amount of consumption data into insights that users could compare and act on. We had to support multiple viewing types, competing metric weights, and time-based shifts.
            </p>

            <ChallengeCards />
            <h4 id="users" className="font-display font-bold text-2xl mb-6" style={{scrollMarginTop:120}}>Users & Core Use Cases</h4>
            <div className="space-y-4">
              {contentData.useCases.map((uc, i) => (
                <div key={uc.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <button 
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 focus-visible"
                    onClick={() => setExpandedUseCases(prev => ({...prev, [uc.id]: !prev[uc.id]}))}
                    aria-expanded={expandedUseCases[uc.id]}
                  >
                    <div>
                      <div className="text-sm font-bold text-indigo-600 mb-1">USE CASE {i + 1}</div>
                      <h5 className="font-bold text-xl text-gray-900">{uc.title}</h5>
                    </div>
                    <ChevronRight className={`transition-transform ${expandedUseCases[uc.id] ? 'rotate-90' : ''}`} />
                  </button>
                  {expandedUseCases[uc.id] && (
                    <div className="p-6 pt-0 border-t border-gray-100 bg-gray-50/50">
                      <p className="text-lg font-medium text-gray-800 italic mb-4">"{uc.question}"</p>
                      <p className="text-gray-600 mb-6">{uc.detail}</p>
                      <div className="bg-white p-4 rounded-lg border border-gray-200">
                        <span className="text-xs font-bold uppercase text-gray-500 block mb-2">Required KPIs</span>
                        <div className="flex flex-wrap gap-2">
                          {uc.kpis.map((kpi, kIdx) => (
                            <span key={kIdx} className="cs-pill">{kpi}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 03. PROCESS (IA & KPIs) */}
          <section id="process" className="cs-section">
            <h2 className="cs-eyebrow mb-4">03. Information Architecture</h2>
            <h3 className="cs-h2 mb-8">Structuring the Phase 1 KPIs</h3>
            
            <div className="flex flex-col lg:flex-row gap-12">
              <div className="flex-1">
                <p className="cs-p mb-8">
                  We broke the product down into seven strictly defined KPI areas.
                </p>
                <div className="space-y-3">
                  {contentData.kpis.map((kpi, i) => (
                    <div key={kpi.id} className="flex items-center gap-4 bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                      <div className="text-gray-400 font-mono font-bold text-sm">{(i + 1).toString().padStart(2, '0')}</div>
                      <div className="font-bold text-gray-900">{kpi.title}</div>
                      <CheckCircle2 className="w-5 h-5 text-indigo-500 ml-auto" />
                    </div>
                  ))}
                </div>
              </div>
              <div className="lg:w-[320px] shrink-0">
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-6 relative">
                  <div className="inline-block px-2 py-1 bg-orange-100 text-orange-800 text-xs font-bold rounded mb-4 uppercase tracking-wider">Out of Scope</div>
                  <h4 className="font-display font-bold text-xl mb-3 text-gray-900">Phase 2 — Comparison Mode</h4>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Comparison Mode was intentionally kept outside Phase 1 to ensure the single-audience investigative flow was robust before adding cross-audience complexity.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* 04. DATA VIZ (Metric Explainer & Explorer) */}
          <section id="dataviz" className="cs-section">
            <h2 className="cs-eyebrow mb-4">04. Data Visualisation</h2>
            <h3 className="cs-h2 mb-8">Choosing the right form.</h3>

            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 lg:p-12 mb-16">
              <h4 className="font-display font-bold text-2xl mb-8 text-center">Interactive Metric Explainer</h4>
              
              <div className="flex flex-wrap justify-center gap-4 mb-12">
                <button aria-pressed={activeMetric === 'avg'} onClick={() => setActiveMetric('avg')} className={`px-6 py-3 rounded-xl font-bold transition-all focus-visible ${activeMetric === 'avg' ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'bg-white text-gray-600 border hover:border-indigo-300'}`}>AVG MIN / WEEK</button>
                <button aria-pressed={activeMetric === 'pct'} onClick={() => setActiveMetric('pct')} className={`px-6 py-3 rounded-xl font-bold transition-all focus-visible ${activeMetric === 'pct' ? 'bg-orange-600 text-white shadow-lg scale-105' : 'bg-white text-gray-600 border hover:border-orange-300'}`}>% OF WATCH TIME</button>
                <button aria-pressed={activeMetric === 'idx'} onClick={() => setActiveMetric('idx')} className={`px-6 py-3 rounded-xl font-bold transition-all focus-visible ${activeMetric === 'idx' ? 'bg-gray-900 text-white shadow-lg scale-105' : 'bg-white text-gray-600 border hover:border-gray-900'}`}>INDEX</button>
              </div>

              <p className="text-xs text-gray-500 text-center mb-4">Illustrative metric schematic—not a screenshot or measured audience data. Select a metric to highlight its place in the chart.</p>
              <div className={`cs-metric-schematic mx-auto max-w-xl cs-metric-active-${activeMetric || 'none'}`}>
                <div className="cs-metric-axis-left"><span>300</span><span>150</span><span>0</span></div>
                <div className="flex flex-col items-center">
                  <div className="cs-metric-bars w-full">
                    <div className="cs-metric-bar" style={{height: '60%'}}></div>
                    <div className="cs-metric-bar" style={{height: '35%'}}></div>
                  </div>
                  <div className="cs-metric-label mt-4 px-3 py-1">Linear TV <br/><span className="text-xs font-normal">Index 150</span></div>
                </div>
                <div className="cs-metric-axis-right"><span>100%</span><span>50%</span><span>0%</span></div>
              </div>

              <div className="mt-12 bg-white p-6 rounded-xl border border-gray-200">
                <div className="grid md:grid-cols-3 gap-6">
                  <div><strong className="text-indigo-600">AVG MIN:</strong> Absolute viewing time. Primary Y-axis.</div>
                  <div><strong className="text-orange-600">% WATCH:</strong> Share of audience's total time. Secondary Y-axis.</div>
                  <div>
                    <strong>INDEX:</strong> Relative performance against national avg. Not an axis.
                    <ul className="text-sm mt-2 space-y-1 text-gray-600">
                      <li>• Index 100 = National Average</li>
                      <li>• Index &gt; 100 = Over-index</li>
                      <li>• Index &lt; 100 = Under-index</li>
                      <li>• Index 150 = 50% above avg</li>
                    </ul>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-red-50 text-red-800 text-sm rounded border border-red-100 flex gap-2">
                  <Info size={16} className="shrink-0 mt-0.5" />
                  Note: The original V5 capture still appends a percent sign to Index values. That notation needs correction. Index is a relative measure normalised to a national-average baseline of 100; it is not viewing share.
                </div>
              </div>
            </div>

            {/* KPI EXPLORER */}
            <h4 className="font-display font-bold text-2xl mb-6">KPI Explorer</h4>
            <div className="flex flex-col lg:flex-row gap-6">
              <div className="lg:w-1/3 flex flex-col gap-2">
                {contentData.kpis.map((kpi) => (
                  <button
                    key={kpi.id}
                    onClick={() => setActiveKpi(kpi)}
                    className={`text-left p-4 rounded-xl border font-bold transition-all flex items-center justify-between focus-visible ${
                      activeKpi?.id === kpi.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
                    }`}
                  >
                    {kpi.title}
                    {activeKpi?.id === kpi.id && <ChevronRight size={18} />}
                  </button>
                ))}
              </div>
              <div className="lg:w-2/3">
                {activeKpi && (
                  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
                    <div className="flex justify-between items-start mb-4">
                      <div className="cs-pill bg-gray-100">{activeKpi.chart}</div>
                      <div className={`text-xs font-bold px-2 py-1 rounded ${activeKpi.status === 'Completed' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                        {activeKpi.status}
                      </div>
                    </div>
                    <h3 className="font-display font-bold text-2xl mb-6">{activeKpi.title}</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Question</div>
                        <p className="text-lg font-medium text-gray-800">"{activeKpi.question}"</p>
                      </div>
                      
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Metrics</div>
                          <p className="text-sm text-gray-700">{activeKpi.metrics}</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-100">
                          <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Dimensions</div>
                          <p className="text-sm text-gray-700">{activeKpi.dimensions}</p>
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Interaction</div>
                        <p className="text-sm text-gray-700">{activeKpi.interaction}</p>
                      </div>
                      
                      <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                        <div className="text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">Design Rationale</div>
                        <p className="text-indigo-900">{activeKpi.rationale}</p>
                      </div>

                      <div className="pt-4 border-t border-gray-100">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Final Result / Direction</div>
                        <p className="text-sm text-gray-800 mb-2">{activeKpi.result}</p>
                        {activeKpi.note && (
                          <p className="text-xs text-orange-600 bg-orange-50 p-2 rounded border border-orange-100">Note: {activeKpi.note}</p>
                        )}
                        <div className="mt-3 flex gap-2">
                          {activeKpi.sources.map((s: string, idx: number) => (
                            <span key={idx} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-1 rounded">Source: {s}</span>
                          ))}
                        </div>
                      </div>
                      {activeKpi.id === "shows" && <figure className="mt-6">
                        <button type="button" className="w-full rounded-xl overflow-hidden border bg-white text-left"
                          onClick={() => openLightbox("case-study/v5-show-detail.png", "V5-show-detail", "V5 · Show consumption over time")}
                          aria-label="Inspect the actual V5 show drilldown">
                          <img src={asset("case-study/v5-show-detail.png")} alt="Actual V5 Andrew Marr Show drilldown: four-week household and average-minute series with a shared tooltip" className="w-full" loading="lazy" />
                          <span className="block p-3 text-xs font-semibold text-indigo-700">Inspect the two-line drilldown ↗</span>
                        </button>
                        <figcaption className="text-xs text-gray-500 mt-3">Captured by selecting a show in the unmodified V5 renderer. The All shows option returns to the overview. Evidence: annotation #37.</figcaption>
                      </figure>}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* 05 & 06. EXPLORATION & ITERATIONS */}
          <section id="exploration" className="cs-section pt-0" />
          <section id="iterations" className="cs-section">
            <h2 className="cs-eyebrow mb-4">05 & 06. Exploration & Iterations</h2>
            <h3 className="cs-h2 mb-8">Version Evolution</h3>
            
            <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden mb-16">
              <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto">
                {contentData.versions.map((v) => (
                  <button
                    key={v.id}
                    aria-pressed={activeVersionId === v.id}
                    onClick={() => { setActiveVersionId(v.id); setCompareVersion(false); }}
                    className={`flex-1 min-w-[120px] py-4 px-4 font-bold text-center border-b-2 transition-colors focus-visible ${
                      activeVersionId === v.id ? 'border-indigo-600 text-indigo-700 bg-white' : 'border-transparent text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    }`}
                  >
                    <span className="block text-xs uppercase tracking-wider text-gray-400 font-normal mb-1">{v.stage}</span>
                    {v.id}
                  </button>
                ))}
              </div>
              
              <div className="p-6 lg:p-10">
                <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <h4 className="font-display font-bold text-2xl">{activeVersion.title}</h4>
                    <label className="flex items-center gap-2 text-sm font-bold text-gray-700 cursor-pointer bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">
                      <input 
                        type="checkbox" 
                        disabled={!canCompare}
                        checked={compareVersion} 
                        onChange={(e) => setCompareVersion(e.target.checked)} 
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                      Compare with previous version{prevVersion ? ` (${prevVersion.id})` : " — no earlier version"} {activeVersion.id === 'V2' && '(Same Capture)'}
                    </label>
                </div>

                {compareVersion && prevVersion ? (
                  <div className="mb-8 grid md:grid-cols-2 gap-4">
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
                      <div className="absolute top-2 left-2 z-10 bg-black/70 text-white text-xs font-bold px-2 py-1 rounded">Previous: {prevVersion.id}</div>
                      <img src={asset(prevVersion.screenshot)} alt={prevVersion.id} className="w-full object-cover" style={{maxHeight: '400px'}} />
                      <button 
                        onClick={() => openLightbox(prevVersion.screenshot, prevVersion.id, `Annotations: ${prevVersion.id}`)}
                        className="absolute inset-0 w-full h-full bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center cursor-pointer focus-visible outline-none"
                      >
                        <span className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 font-bold px-6 py-3 rounded-full flex items-center gap-2 transform scale-95 group-hover:scale-100 transition-all shadow-xl">
                          <Target size={18} /> Inspect Annotations
                        </span>
                      </button>
                    </div>
                    <div className="relative rounded-xl overflow-hidden border border-gray-200 group">
                      <div className="absolute top-2 left-2 z-10 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded">Current: {activeVersion.id}</div>
                      <img src={asset(activeVersion.screenshot)} alt={activeVersion.id} className="w-full object-cover" style={{maxHeight: '400px'}} />
                      <button 
                        onClick={() => openLightbox(activeVersion.screenshot, activeVersion.id, `Annotations: ${activeVersion.id}`)}
                        className="absolute inset-0 w-full h-full bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center cursor-pointer focus-visible outline-none"
                      >
                        <span className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 font-bold px-6 py-3 rounded-full flex items-center gap-2 transform scale-95 group-hover:scale-100 transition-all shadow-xl">
                          <Target size={18} /> Inspect Annotations
                        </span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mb-8 relative rounded-xl overflow-hidden border border-gray-200 group">
                    <img src={asset(activeVersion.screenshot)} alt={activeVersion.title} className="w-full object-cover object-top" style={{maxHeight: '600px'}} />
                    <button 
                      onClick={() => openLightbox(activeVersion.screenshot, activeVersion.id, `Annotations: ${activeVersion.id}`)}
                      className="absolute inset-0 w-full h-full bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center cursor-pointer focus-visible outline-none"
                      aria-label={`View annotated screenshot for ${activeVersion.id}`}
                    >
                      <span className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 font-bold px-6 py-3 rounded-full flex items-center gap-2 transform scale-95 group-hover:scale-100 transition-all shadow-xl">
                        <Target size={18} /> Inspect Annotations
                      </span>
                    </button>
                  </div>
                )}
                
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    {activeVersion.problem && (
                      <div><strong className="text-red-700 block text-xs uppercase mb-1">The Problem</strong><p className="text-sm text-gray-800 bg-red-50 p-3 rounded">{activeVersion.problem}</p></div>
                    )}
                    {activeVersion.exploration && (
                      <div><strong className="text-gray-500 block text-xs uppercase mb-1">Exploration</strong><p className="text-sm text-gray-700">{activeVersion.exploration}</p></div>
                    )}
                    {activeVersion.evidence && (
                      <div><strong className="text-indigo-700 block text-xs uppercase mb-1">Evidence / Feedback</strong><p className="text-sm text-gray-800 bg-indigo-50 p-3 rounded">{activeVersion.evidence}</p></div>
                    )}
                  </div>
                  <div className="space-y-4">
                    {activeVersion.decision && (
                      <div><strong className="text-gray-900 block text-xs uppercase mb-1">Decision</strong><p className="text-sm text-gray-800 font-medium">{activeVersion.decision}</p></div>
                    )}
                    {activeVersion.result && (
                      <div><strong className="text-green-700 block text-xs uppercase mb-1">Result</strong><p className="text-sm text-gray-800 bg-green-50 p-3 rounded">{activeVersion.result}</p></div>
                    )}
                    {activeVersion.next && (
                      <div><strong className="text-gray-500 block text-xs uppercase mb-1">Next</strong><p className="text-sm text-gray-700">{activeVersion.next}</p></div>
                    )}
                    <div className="text-xs text-gray-400 flex justify-between border-t border-gray-100 pt-4 mt-4">
                      <span>Source: {activeVersion.source}</span>
                      {activeVersion.note && <span className="italic">{activeVersion.note}</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <h4 className="font-display font-bold text-2xl mb-6">Before & After Stories</h4>
            {/* The parent <ComparisonSlider /> internally handles the story rendering and selection. */}
            <ComparisonSlider beforeImage="case-study/v4.jpg" afterImage="case-study/v5.jpg" />
          </section>

          {/* 07. FEEDBACK */}
          <section id="feedback" className="cs-section">
            <h2 className="cs-eyebrow mb-4">07. Feedback & Decisions</h2>
            <h3 className="cs-h2 mb-8">From review to refinement.</h3>

            <div className="grid lg:grid-cols-2 gap-6">
              {contentData.feedback.map(fb => (
                <div key={fb.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <button 
                    className="w-full p-6 text-left hover:bg-gray-50 flex items-start justify-between focus-visible"
                    onClick={() => setExpandedFeedback(prev => ({...prev, [fb.id]: !prev[fb.id]}))}
                    aria-expanded={expandedFeedback[fb.id]}
                  >
                    <div>
                      <div className="flex flex-wrap gap-2 mb-2">
                        <span className="cs-pill bg-indigo-100 text-indigo-800 font-mono text-[10px]">Req: {fb.requestedNumber}</span>
                        <span className="cs-pill bg-gray-100 font-mono text-[10px]">Src: {fb.sourceNumber}</span>
                        <span className="cs-pill text-[10px]">{fb.status}</span>
                      </div>
                      <h4 className="font-bold text-lg text-gray-900">{fb.title}</h4>
                    </div>
                    <ChevronRight className={`shrink-0 mt-1 transition-transform ${expandedFeedback[fb.id] ? 'rotate-90' : ''}`} />
                  </button>
                  
                  {expandedFeedback[fb.id] && (
                    <div className="p-6 pt-0 border-t border-gray-100 bg-gray-50/50 space-y-4">
                      <blockquote className="border-l-4 border-indigo-500 pl-4 py-1 text-gray-700 italic text-sm">
                        "{fb.quote}"
                      </blockquote>
                      <div className="grid grid-cols-2 gap-4 text-sm mt-4">
                        <div>
                          <strong className="block text-xs uppercase text-gray-400 mb-1">Problem</strong>
                          <p className="text-gray-800">{fb.problem}</p>
                        </div>
                        <div>
                          <strong className="block text-xs uppercase text-indigo-400 mb-1">Decision</strong>
                          <p className="text-indigo-900 font-medium">{fb.decision}</p>
                        </div>
                      </div>
                      <div className="bg-white p-4 rounded border border-gray-200 mt-2 text-sm">
                        <strong className="block text-xs uppercase text-gray-400 mb-1">Outcome & Visual</strong>
                        <p className="text-gray-800">{fb.outcome}</p>
                        <p className="text-gray-500 mt-1 italic">{fb.visual}</p>
                      </div>
                      <div className="text-xs text-gray-400 text-right">Source: {fb.source}</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* 08. INTERACTIONS */}
          <section id="interactions" className="cs-section">
            <h2 className="cs-eyebrow mb-4">08. Interaction Design & AI Process</h2>
            <h3 className="cs-h2 mb-8">Progressive disclosure flow.</h3>
            
            <div className="bg-white p-6 md:p-8 rounded-2xl border border-gray-200 shadow-sm mb-12">
              <h4 className="font-display font-bold text-xl mb-6">Interaction Map</h4>
              <div className="space-y-4">
                {contentData.interactionSteps.map((step, i) => (
                  <details key={i} className="bg-gray-50 rounded-lg group cursor-pointer border border-gray-200 [&_summary::-webkit-details-marker]:hidden">
                    <summary className="p-4 flex items-center justify-between font-bold text-gray-900 focus-visible outline-none">
                      <div className="flex gap-4 items-center">
                        <div className="shrink-0 w-8 h-8 bg-indigo-100 text-indigo-700 rounded-full flex items-center justify-center text-sm">{i + 1}</div>
                        {step.title}
                      </div>
                      <ChevronRight className="transition-transform group-open:rotate-90 text-gray-400" />
                    </summary>
                    <div className="p-4 pt-0 md:pl-16 text-sm text-gray-600">
                      <p>{step.detail}</p>
                      {step.note && <p className="text-xs text-indigo-600 mt-2 italic bg-indigo-50 p-2 rounded inline-block">Note: {step.note}</p>}
                    </div>
                  </details>
                ))}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-indigo-900 text-white p-8 rounded-2xl">
                <h4 className="font-display font-bold text-xl mb-4 text-indigo-100">AI Prototyping Workflow</h4>
                <p className="text-indigo-200 text-sm mb-6">
                  Replit was used to quickly implement functional versions of the dashboard. This was an intended prototyping workflow to make static concepts tangible before Hi-Fi Figma delivery.
                </p>
                <div className="space-y-3 font-mono text-xs text-indigo-300">
                  <div className="flex items-center gap-2"><ArrowRight size={14} /> UX Thinking & Requirements</div>
                  <div className="flex items-center gap-2"><ArrowRight size={14} /> User stories & low-fidelity exploration</div>
                  <div className="flex items-center gap-2"><ArrowRight size={14} /> AI-assisted Prototyping (Replit)</div>
                  <div className="flex items-center gap-2"><ArrowRight size={14} /> Interaction checks & chart review</div>
                  <div className="flex items-center gap-2"><ArrowRight size={14} /> Stakeholder Annotations</div>
                  <div className="flex items-center gap-2"><ArrowRight size={14} /> Code Iteration (V1 → V5)</div>
                  <div className="flex items-center gap-2 text-white font-bold"><ArrowRight size={14} /> Next: Hi-fi Figma design</div>
                </div>
              </div>
              <div className="p-8 rounded-2xl border border-gray-200 bg-white">
                 <h4 className="font-display font-bold text-xl mb-4">UX Responsibility</h4>
                 <ul className="space-y-2 text-sm text-gray-700">
                   <li><CheckCircle2 size={16} className="inline text-green-500 mr-2" /> Problem framing & KPIs</li>
                   <li><CheckCircle2 size={16} className="inline text-green-500 mr-2" /> Meaningful metric selection</li>
                   <li><CheckCircle2 size={16} className="inline text-green-500 mr-2" /> Evaluating visualisations</li>
                   <li><CheckCircle2 size={16} className="inline text-green-500 mr-2" /> Interpreting stakeholder feedback</li>
                 </ul>
              </div>
            </div>
          </section>

          {/* 09. DESIGN SYSTEM */}
          <section id="designsystem" className="cs-section">
            <h2 className="cs-eyebrow mb-4">09. Design System</h2>
            <h3 className="cs-h2 mb-8">Fiber integration.</h3>
            <p className="cs-p max-w-3xl mb-12">
              The dashboard moves toward Fiber through shared card and control patterns, text styles and chart tokens. The implementation includes custom heatmap, radar and Sankey components using a common token layer. This is evidence of systemisation, not a claim that every chart is a native Fiber component or that the full interface has passed a conformance review.
            </p>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="border border-gray-200 p-6 rounded-xl bg-white shadow-sm text-center">
                <LineChart className="mx-auto text-indigo-500 mb-4" size={32} />
                <h4 className="font-bold text-gray-900 mb-2">Fiber Components</h4>
                <p className="text-sm text-gray-600">Standard implementation of filters, tooltips, cards, grouped bars, and axes.</p>
              </div>
              <div className="border border-indigo-200 p-6 rounded-xl bg-indigo-50 text-center">
                <PieChart className="mx-auto text-indigo-500 mb-4" size={32} />
                <h4 className="font-bold text-indigo-900 mb-2">Custom Visualisations</h4>
                <p className="text-sm text-indigo-700">Specific needs (Temporal Heatmap, Radar, Sankey) built custom.</p>
              </div>
              <div className="border border-gray-200 p-6 rounded-xl bg-white shadow-sm text-center">
                <Activity className="mx-auto text-indigo-500 mb-4" size={32} />
                <h4 className="font-bold text-gray-900 mb-2">Token Mapping</h4>
                <p className="text-sm text-gray-600">Shared mappings in <code>chartTokens.ts</code> connect charts to Fiber colours.</p>
              </div>
            </div>
            <FiberDetails />
          </section>

          {/* 10. EVALUATION */}
          <section id="evaluation" className="cs-section">
            <h2 className="cs-eyebrow mb-4">10. Evaluation</h2>
            <h3 className="cs-h2 mb-8">Reviewing the design.</h3>
            
            <div className="bg-orange-50 border border-orange-200 p-4 rounded-xl flex gap-3 text-orange-900 text-sm mb-8">
              <Info className="shrink-0 text-orange-600 mt-0.5" size={18} />
              <div>
                <strong>Evidence Note:</strong> No formal documented usability testing study or quantitative outcome metrics were found. Evaluation was performed via stakeholder/design prototype reviews and annotation iterations.
              </div>
            </div>

            <div className="space-y-4">
              {contentData.evaluations.map((ev, i) => (
                <div key={i} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                  <div className="flex flex-col md:flex-row gap-6">
                    <div className="md:w-1/4">
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Method</div>
                      <div className="font-bold text-gray-900">{ev.method}</div>
                      <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1 mt-4">Looked For</div>
                      <div className="text-sm text-gray-600">{ev.lookedFor}</div>
                    </div>
                    <div className="md:w-3/4 grid sm:grid-cols-2 gap-4">
                      <div className="bg-gray-50 p-4 rounded">
                        <div className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Evidence / Feedback</div>
                        <p className="text-sm text-gray-800">{ev.evidence}</p>
                      </div>
                      <div className="bg-indigo-50 p-4 rounded border border-indigo-100">
                        <div className="text-xs font-bold text-indigo-700 uppercase tracking-wider mb-1">Design Response</div>
                        <p className="text-sm text-indigo-900">{ev.response}</p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 text-xs text-gray-400 italic">Limitation: {ev.limitation}</div>
                </div>
              ))}
            </div>
          </section>

          {/* 11. V5 RESULT */}
          <section id="v5" className="cs-section">
            <h2 className="cs-eyebrow mb-4">11. The Result</h2>
            <h3 className="cs-h2 mb-8">V5 — Consolidating the Direction</h3>
            <p className="cs-p max-w-3xl mb-8">
              The V5 prototype consolidates the requirements, KPI definitions, interactions, and critical stakeholder feedback.
            </p>

            {/* Path to V5 */}
            <div className="flex flex-wrap items-center gap-2 text-sm font-bold text-gray-400 mb-12">
              <span className="bg-gray-100 px-3 py-1 rounded-full text-gray-700">Requirements</span> <ArrowRight size={14} />
              <button onClick={() => { setActiveVersionId('V1'); document.getElementById('iterations')?.scrollIntoView(); }} className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700 transition-colors focus-visible">Exploration</button> <ArrowRight size={14} />
              <button onClick={() => document.getElementById('feedback')?.scrollIntoView()} className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700 transition-colors focus-visible">Feedback</button> <ArrowRight size={14} />
              <button onClick={() => { setActiveVersionId('V4'); document.getElementById('iterations')?.scrollIntoView(); }} className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-gray-700 transition-colors focus-visible">Iteration</button> <ArrowRight size={14} />
              <button 
                className="bg-indigo-600 px-4 py-2 rounded-full text-white shadow hover:bg-indigo-700 transition-colors focus-visible"
                onClick={() => { setActiveVersionId('V5'); document.getElementById('iterations')?.scrollIntoView(); }}
              >
                V5 Final
              </button>
            </div>

            <div className="space-y-8">
              <button 
                className="w-full relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 group cursor-pointer focus-visible text-left block" 
                onClick={() => openLightbox('/case-study/v5.jpg', 'V5', 'V5 Final Overview')}
                aria-label="Expand V5 Dashboard Top View"
              >
                <img src={asset('/case-study/v5.jpg')} alt="V5 Master" className="w-full" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 font-bold px-6 py-3 rounded-full flex items-center gap-2 transform scale-95 group-hover:scale-100 transition-all shadow-xl">
                    <ZoomIn size={18} aria-hidden="true" /> Expand Dashboard Top
                  </span>
                </div>
              </button>

              <button 
                className="w-full relative rounded-2xl overflow-hidden shadow-xl border border-gray-200 group cursor-pointer focus-visible text-left block" 
                onClick={() => openLightbox('/case-study/v5-detail.jpg', 'V5-detail', 'V5 · Temporal, affinity and migration')}
                aria-label="Expand V5 Detail Views"
              >
                <img src={asset('/case-study/v5-detail.jpg')} alt="V5 Detail Views" className="w-full" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                  <span className="opacity-0 group-hover:opacity-100 bg-white text-gray-900 font-bold px-6 py-3 rounded-full flex items-center gap-2 transform scale-95 group-hover:scale-100 transition-all shadow-xl">
                    <ZoomIn size={18} aria-hidden="true" /> Expand Detail Views
                  </span>
                </div>
              </button>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
              {contentData.outcomes.map((outcome, i) => (
                <div key={i} className="bg-white border border-gray-200 p-6 rounded-xl shadow-sm">
                  <h4 className="font-bold text-gray-900 mb-2">{outcome.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{outcome.detail}</p>
                </div>
              ))}
            </div>
          </section>

          {/* 12. LEARNINGS & NEXT PHASE */}
          <section id="learnings" className="cs-section pb-12 border-none">
            <h2 className="cs-eyebrow mb-4">12. Wrap Up</h2>
            <h3 className="cs-h2 mb-12">Learnings & Next Steps</h3>

            <div className="grid lg:grid-cols-2 gap-12">
              <div className="bg-indigo-900 text-white p-8 md:p-10 rounded-2xl">
                <h4 className="font-display font-bold text-2xl mb-8 text-indigo-100">UX Reflections</h4>
                <ul className="space-y-6">
                  {contentData.learnings.map((learning, i) => (
                    <li key={i} className="flex gap-4">
                      <div className="w-8 h-8 rounded-full bg-indigo-800 text-indigo-300 flex items-center justify-center font-bold shrink-0 text-sm">
                        {i + 1}
                      </div>
                      <div>
                        <strong className="block text-indigo-50 mb-1">{learning.title}</strong>
                        <p className="text-indigo-200 text-sm leading-snug">{learning.detail}</p>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-gray-200 p-8 md:p-10 rounded-2xl flex flex-col justify-center">
                <h4 className="font-display font-bold text-2xl mb-6">Moving Forward</h4>
                <p className="cs-p mb-8 text-sm">
                  The intended next steps are V5 prototype → Hi-fi Figma design → implementation refinement. The brief also moves the designer's focus to the next project or sprint; that transition requires confirmation. Metric definitions and the current-versus-intended chart differences still need to be resolved during handoff.
                </p>
                
                <div className="bg-orange-50 border border-orange-200 p-6 rounded-xl">
                  <h5 className="font-bold text-orange-900 mb-2">Phase 2: Comparison Mode</h5>
                  <p className="text-orange-800 text-sm">
                    Comparison Mode remains strictly Phase 2. The foundational logic of single-audience exploration must be solid before introducing cross-audience dimensional comparisons.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* EVIDENCE LEDGER */}
          <div className="mt-12 bg-gray-100 rounded-xl border border-gray-200 overflow-hidden">
            <details className="group [&_summary::-webkit-details-marker]:hidden">
              <summary className="p-6 cursor-pointer focus-visible outline-none flex items-center justify-between">
                <h4 className="font-bold text-gray-700 uppercase tracking-wider text-xs flex items-center gap-2">
                  <ExternalLink size={14} /> Source Evidence Ledger
                </h4>
                <ChevronRight className="transition-transform group-open:rotate-90 text-gray-400" size={16} />
              </summary>
              <div className="p-6 pt-0 border-t border-gray-200">
                <div className="mb-4 text-xs text-gray-500">
                  <strong className="text-gray-700">Limitations:</strong> All data in this case study is sourced strictly from available prototype files, artifact versions, and API-persisted annotations. Data visualisations use synthetic deterministic mock data; no real production metrics are claimed. Evaluation evidence relies solely on documented stakeholder reviews—no formal external usability testing was located.
                </div>
                <ul className="space-y-2 font-mono text-[10px] text-gray-500">
                  {contentData.sources.map((s, i) => (
                    <li key={i}>[{s.id}] {s.title} — {s.reference} ({s.kind})</li>
                  ))}
                </ul>
              </div>
            </details>
          </div>

        </main>
      </div>

      {/* Global Lightbox */}
      <Lightbox 
        isOpen={lightbox.isOpen} 
        onClose={() => setLightbox(l => ({...l, isOpen: false}))} 
        imageSrc={lightbox.src}
        hotspots={lightbox.hotspots}
        title={lightbox.title}
      />
    </div>
  );
}
