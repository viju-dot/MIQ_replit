import { useId, useState } from "react";
import { ArrowDown, ArrowUpRight, Check, SlidersHorizontal } from "lucide-react";
import { kpis, useCases } from "./content";
import "./UseCaseFlow.css";

const outcomes = [
  {
    title: "Build a viewing profile",
    detail: "Connect audience scale, viewing mix and daypart concentration before narrowing the planning question.",
    boundary: "A reading path through the prototype, not a measured audience-research outcome.",
  },
  {
    title: "Inform a media shortlist",
    detail: "Use destination viewing and timing patterns to identify channels, apps and dayparts worth evaluating.",
    boundary: "Planning guidance only. Campaign activation is not implemented in the Phase 1 dashboard.",
  },
  {
    title: "Build a content hypothesis",
    detail: "Use indexed shows, genre context and next-viewing behaviour to identify content worth investigating.",
    boundary: "Genre scopes Shows and Behaviour. Cultural Affinity is a separate signal, not a genre-dependent drilldown.",
  },
];

export function UseCaseFlow({ onExploreKpi }: { onExploreKpi: (id: string) => void }) {
  const [caseIndex, setCaseIndex] = useState(0);
  const [selectedId, setSelectedId] = useState(useCases[0].kpis[0]);
  const detailId = useId();
  const current = useCases[caseIndex];
  const selected = kpis.find(kpi => kpi.id === selectedId)!;
  const outcome = outcomes[caseIndex];
  return (
    <div className="csf-root">
      <div className="csf-heading">
        <div><span className="csf-eyebrow">FROM QUESTION TO DECISION</span>
          <h3>Follow the planning logic.</h3></div>
        <p>Choose a use case, then a KPI to see how the question becomes an investigation.</p>
      </div>
      <div className="csf-tabs" role="group" aria-label="Choose a use-case flow">
        {useCases.map((item, i) => <button key={item.id} type="button" aria-pressed={caseIndex === i}
          onClick={() => { setCaseIndex(i); setSelectedId(item.kpis[0]); }}>
          <span>0{i + 1}</span>{item.title}
        </button>)}
      </div>
      <div className="csf-question" aria-live="polite">
        <span className="csf-eyebrow">01 / THE QUESTION</span>
        <p>{current.question}</p>
      </div>
      <div className="csf-connector" aria-hidden="true"><ArrowDown size={17} /></div>
      <div className="csf-audience">
        <SlidersHorizontal size={20} aria-hidden="true" />
        <div><span className="csf-eyebrow">02 / SET THE CONTEXT</span>
          <strong>Define audience <span aria-hidden="true">→</span> Apply filters</strong>
          <p>Market, demographic and household choices establish the shared audience context.</p>
        </div>
        <span className="csf-applied"><Check size={12} aria-hidden="true" /> Applied audience</span>
      </div>
      <div className="csf-connector" aria-hidden="true"><ArrowDown size={17} /></div>
      <p className="csf-branch-label csf-eyebrow">03 / EXPLORE THE RELEVANT SIGNALS · SELECT A NODE</p>
      <div className={`csf-branches csf-branches-${current.kpis.length}`}>
        {current.kpis.map((id, i) => {
          const kpi = kpis.find(item => item.id === id)!;
          return <button type="button" className="csf-node" key={id} aria-pressed={selectedId === id}
            aria-controls={detailId} onClick={() => setSelectedId(id)}>
            <span className="csf-node-index">SIGNAL {String(i + 1).padStart(2, "0")}</span>
            <strong>{kpi.title}</strong>
            <span className="csf-node-action">{selectedId === id ? "Selected signal" : "Inspect signal"} <ArrowUpRight size={14} aria-hidden="true" /></span>
          </button>;
        })}
      </div>
      <div className="csf-connector" aria-hidden="true"><ArrowDown size={17} /></div>
      <div className="csf-detail" id={detailId} aria-live="polite">
        <div>
          <span className="csf-eyebrow">04 / INTERPRET & INSPECT</span>
          <h4>{selected.title}</h4>
          <p>{selected.interaction}</p>
        </div>
        <button type="button" onClick={() => onExploreKpi(selected.id)}>
          Explore this KPI <ArrowUpRight size={16} aria-hidden="true" />
        </button>
      </div>
      <div className="csf-connector" aria-hidden="true"><ArrowDown size={17} /></div>
      <div className="csf-outcome">
        <div><span className="csf-eyebrow">05 / PLANNING DECISION</span>
          <h4>{outcome.title}</h4></div>
        <p>{outcome.detail}</p>
      </div>
      <p className="csf-boundary">{outcome.boundary}</p>
    </div>
  );
}