import React from 'react';
import { kpis, useCases, versions } from './content';
import './EditorialMetrics.css';

export function SegmentedMetricCard({ 
  label, 
  value, 
  totalSegments, 
  filledSegments, 
  description,
  footnote,
  accentClass = ''
}: { 
  label: string; 
  value: string | number; 
  totalSegments: number; 
  filledSegments: number; 
  description: string;
  footnote?: string;
  accentClass?: string;
}) {
  return (
    <div className="cs-insight-card">
      <div className="cs-insight-label">{label}</div>
      <div className="cs-insight-value">{value}</div>
      <div className={`cs-insight-segments ${accentClass}`} aria-hidden="true">
        {Array.from({ length: totalSegments }).map((_, i) => (
          <div 
            key={i} 
            className={`cs-insight-segment ${i < filledSegments ? 'filled' : 'empty'}`} 
          />
        ))}
      </div>
      <p className="cs-insight-desc">{description}</p>
      {footnote && <p className="cs-insight-footnote">{footnote}</p>}
    </div>
  );
}

export function EditorialMetrics() {
  return (
    <div className="cs-editorial-metrics">
      <SegmentedMetricCard 
        label="SCOPE"
        value={kpis.length}
        totalSegments={kpis.length}
        filledSegments={kpis.length}
        description="Strictly defined Phase 1 KPI areas forming the core analytical journey."
        footnote="Each stripe group represents one KPI area."
        accentClass="cs-accent-purple"
      />
      <SegmentedMetricCard 
        label="EVOLUTION"
        value={versions.length}
        totalSegments={versions.length}
        filledSegments={versions.length}
        description="Recorded prototype iterations, documenting the product's functional expansion."
        footnote={`One stripe group per version. ${new Set(versions.map(v => v.screenshot)).size} unique renderer captures; V1 and V2 share a renderer.`}
        accentClass="cs-accent-lime"
      />
      <SegmentedMetricCard 
        label="FOUNDATION"
        value={useCases.length}
        totalSegments={useCases.length}
        filledSegments={useCases.length}
        description="Core planning use cases representing the target audience's business questions."
        footnote="Each stripe group represents one use case."
        accentClass="cs-accent-violet"
      />
    </div>
  );
}

export function NarrativePivotBand() {
  return (
    <div className="cs-narrative-band">
      <div className="cs-narrative-container">
        <h3 className="cs-narrative-title">Three metrics. Two scales.<br />A clearer way to read.</h3>
        <p className="cs-narrative-text">
          Establishing a clear visual system meant separating competing measurements. Rather than plotting everything, the design organises metrics into a disciplined hierarchy:
        </p>
        <div className="cs-narrative-stats">
          <div className="cs-narrative-stat">
            <span className="cs-narrative-number">3</span>
            <span className="cs-narrative-label">Core viewing metrics</span>
          </div>
          <div className="cs-narrative-stat">
            <span className="cs-narrative-number">2</span>
            <span className="cs-narrative-label">Plotted series</span>
          </div>
          <div className="cs-narrative-stat">
            <span className="cs-narrative-number">1</span>
            <span className="cs-narrative-label">Baseline benchmark</span>
          </div>
        </div>
      </div>
    </div>
  );
}
