import { CHART, HEAT_RAMP } from "../v4/chartTokens";

export function ChallengeCards() {
  const challenges = [
    ["Multiple TV types", "Linear, Streaming and FAST need a common planning context."],
    ["Multiple metrics", "Minutes, share and Index cannot be read as equivalent measures."],
    ["Large datasets", "Top lists and progressive disclosure keep the overview usable."],
    ["Audience dimensions", "Market, household and demographic choices change the audience."],
    ["Time-based behaviour", "Dayparts, weekdays and show trends need different time views."],
    ["Genre and show relationships", "A genre choice should lead to relevant content, not unrelated detail."],
    ["Complex visualisations", "Distribution, affinity and migration answer different questions."],
    ["Actionable insights", "The goal is planning guidance—not simply more charts."],
  ];
  return <div className="grid sm:grid-cols-2 gap-3 mb-12">{challenges.map(([title, detail], i) =>
    <article key={title} className="p-5 rounded-xl border border-gray-200 bg-white">
      <span className="text-xs font-bold text-indigo-600">{String(i + 1).padStart(2, "0")}</span>
      <h4 className="font-semibold my-2">{title}</h4><p className="text-sm text-gray-600">{detail}</p>
    </article>)}</div>;
}

export function FiberDetails() {
  return <div className="mt-8 space-y-6">
    <div className="rounded-xl border p-6 bg-white">
      <h4 className="font-semibold mb-4">A shared colour language</h4>
      <div className="flex flex-wrap gap-5">
        {[["Linear TV", CHART.primary], ["Streaming", CHART.secondary], ["FAST", CHART.tertiary], ["Supporting series", CHART.line]].map(([name, color]) =>
          <div key={name} className="flex items-center gap-2 text-xs"><span className="block size-5 rounded" style={{ backgroundColor: color }} />{name}</div>)}
      </div>
      <div className="mt-5 flex gap-1" aria-label="Fiber sequential heatmap colour ramp">
        {HEAT_RAMP.map(color => <span key={color} className="h-5 flex-1" style={{ backgroundColor: color }} />)}
      </div>
      <p className="text-xs text-gray-600 mt-2">Low → high intensity. These samples use the same chart-token mappings as the prototype, not this case study's editorial palette.</p>
    </div>
    <div className="grid sm:grid-cols-2 gap-4 text-sm">
      <article className="p-5 border rounded-xl bg-white"><h4 className="font-semibold mb-2">Typography & spacing</h4><p className="text-gray-600">DM Sans and Fiber text tokens establish chart and card hierarchy. Shared SmartCards and repeated header/body spacing replace the more varied exploratory sections.</p></article>
      <article className="p-5 border rounded-xl bg-white"><h4 className="font-semibold mb-2">Axes & tooltips</h4><p className="text-gray-600">Token-based grid lines and labels stay secondary. Tooltips supply metric context; Index belongs in supporting information, not a third axis.</p></article>
      <article className="p-5 border rounded-xl bg-white"><h4 className="font-semibold mb-2">Cards & filters</h4><p className="text-gray-600">SmartCards, searchable dropdowns, tabs and toggle controls provide a repeated framework. V5 separates applied global filters from local selections.</p></article>
      <article className="p-5 border rounded-xl bg-white"><h4 className="font-semibold mb-2">Interaction states</h4><p className="text-gray-600">Selected marks, hover detail, focusable chart elements and disabled Apply states expose what can change and what is currently active.</p></article>
    </div>
  </div>;
}