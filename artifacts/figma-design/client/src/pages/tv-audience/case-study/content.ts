import type {
  Context,
  Evaluation,
  Feedback,
  InteractionStep,
  KPI,
  Learning,
  Outcome,
  Source,
  UseCase,
  Version,
} from "./types";

export const context: Context = {
  role: "Product / UX design; AI-assisted prototyping",
  scope:
    "Phase 1 audience-led dashboard, KPI architecture, data visualisation and interaction design",
  timeline:
    "V1–V5 iterative prototype sequence; registry dates omitted because they are not reliable historical evidence",
  users:
    "Sales / Trader teams in the case-study brief; V5 personas and permissions still require product clarification",
  markets: "United Kingdom, Germany, France, Italy and Spain",
  status:
    "V5 prototype and production handoff specification; deterministic synthetic data, not a production feed",
};

export const versions: Version[] = [
  {
    id: "V1",
    title: "Starting with audience exploration",
    stage: "Initial concept",
    screenshot: "case-study/v1.jpg",
    problem:
      "The first recorded concept needed a simple way to browse TV audience segments and read a basic audience overview.",
    exploration:
      "The registry describes an explorer-and-overview concept without activation.",
    evidence:
      "The frozen registry snapshot records a Draft segment explorer and basic audience overview.",
    decision:
      "Keep the first step narrow: establish audience discovery and summary before adding a broader workflow.",
    result: "A baseline product concept was recorded for later iteration.",
    next: "Test how the audience definition could connect to an activation journey.",
    source: "prototype-registry",
    note:
      "Observed renderer caveat: V1 and V2 both use the same current dashboard renderer. This image is an available renderer capture, not a distinct archival V1 screen.",
  },
  {
    id: "V2",
    title: "Extending the recorded product journey",
    stage: "Activation and filter refinement",
    screenshot: "case-study/v1.jpg",
    problem:
      "The initial recorded concept stopped at exploration and did not cover activation.",
    exploration:
      "The registry describes an activation flow, refined filters and dark-mode support.",
    evidence:
      "These changes are registry descriptions; the repository does not preserve a separate V2 renderer.",
    decision:
      "Extend the concept from audience browsing toward an end-to-end explore-and-activate experience.",
    result:
      "The product record broadened from overview to activation and presentation states.",
    next: "Reframe the experience around connected content-planning questions.",
    source: "prototype-registry",
    note:
      "Observed renderer caveat: V2 shares the dashboard renderer and screenshot with V1. Do not read this image as proof of the recorded V2 changes.",
  },
  {
    id: "V3",
    title: "Turning requirements into a connected analysis journey",
    stage: "Content Planner ideation",
    screenshot: "case-study/v3.jpg",
    problem:
      "Audience scale alone could not answer where viewing happened, what content mattered or what viewers watched next.",
    exploration:
      "V3 introduced a single-page Understand → Discover journey with connected KPI areas and market-aware filtering.",
    evidence:
      "The V3 source implements type, temporal, genre, platform share, affinity, shows and migration views. Genre uses horizontal bars; platform share uses 100% stacked horizontal bars; affinity uses diverging index bars around the national baseline.",
    decision:
      "Organise the dashboard around analytical questions and let selections carry context into later modules.",
    result:
      "The prototype made cross-filtering and the relationship between genre, platform, affinity, shows and migration tangible.",
    next:
      "Align the information hierarchy and visual language more closely to the agreed wireframe and Fiber patterns.",
    source: "v3-source",
    note:
      "Observed V3 implementation. Values are deterministic synthetic prototype data.",
  },
  {
    id: "V4",
    title: "Consolidating the visualisation system",
    stage: "Wireframe-faithful build",
    screenshot: "case-study/v4.jpg",
    problem:
      "The connected V3 journey still needed a clearer executive hierarchy and a more consistent visualisation system.",
    exploration:
      "V4 added overview tiles, a merged donut-and-channel card, grouped bar/line combinations, a temporal heatmap, an eight-axis radar and a custom Sankey.",
    evidence:
      "The V4 source replaces V3 genre horizontal bars with combo charts and replaces diverging affinity bars with a radar. Its registry snapshot records the wireframe-faithful layout, global environment control, chart-token layer and cross-filter chain.",
    decision:
      "Use shared cards, system tokens and visual forms tailored to each analytical question.",
    result:
      "The dashboard became a coherent, wireframe-faithful basis for stakeholder annotation.",
    next:
      "Resolve chart hierarchy, controls, labels and drilldown requests through the V5 feedback round.",
    source: "v4-source",
    note:
      "Observed V4 implementation. This is a real source-level delta from V3, not a measured usability outcome.",
  },
  {
    id: "V5",
    title: "Consolidating the direction",
    stage: "Stakeholder-feedback revisions",
    screenshot: "case-study/v5.jpg",
    problem:
      "Review annotations identified unresolved hierarchy, metric-scale, naming and detail-state issues.",
    exploration:
      "V5 retained the six-card dashboard while refining controls, two-series charts, chart accessibility, naming and detail states.",
    evidence:
      "Resolved annotations request the show drilldown and naming changes; the live source and handoff specification confirm the four-week dual-line show detail, vertical two-series destination chart, radar detail and one-hour Sankey.",
    decision:
      "Keep overview and detail complementary, give unlike metrics independent axes, and treat Index as supporting context rather than a third plotted series.",
    result:
      "V5 provides a traceable Phase 1 prototype for audience definition, viewing mix, content discovery, temporal concentration, affinity and migration.",
    next:
      "Move the V5 direction into hi-fi Figma and implementation refinement after product and data definitions are confirmed. Comparison Mode remains Phase 2.",
    source: "v5-handoff",
    note:
      "Observed V5, not a production outcome. Index labels still append a percent sign in several charts; the semantic correction is pending clarification.",
  },
];

export const kpis: KPI[] = [
  {
    id: "consumption-time",
    title: "Consumption by Type & Time Spent",
    question:
      "How is viewing split across Linear TV, Streaming and FAST, and which channels or apps matter?",
    metrics:
      "Type: share of viewing minutes and estimated minutes per household. Destination: average minutes/week, share of watch time and Index.",
    dimensions:
      "Media type, then channel/app within the selected platform.",
    chart:
      "Observed V5: a 200px donut beside grouped vertical bars with independent minute and share axes.",
    interaction:
      "Selecting a donut arc or legend item scopes downstream views and synchronises platform tabs. Destination bars provide hover/focus detail but no drilldown.",
    rationale:
      "The donut makes the three-part viewing mix legible, while separate axes prevent unlike destination metrics from sharing a misleading scale. Index remains supporting context.",
    result:
      "Type and destination answer related questions inside one 20/80 SmartCard.",
    status: "Observed V5",
    note:
      "Linear, Streaming and FAST are implemented; Homescreen is not. Index is conceptually a benchmark, but current destination labels add %, a known correction pending product/data clarification.",
    sources: ["v5-handoff", "v5-source", "annotation-42"],
  },
  {
    id: "temporal",
    title: "Temporal Insights",
    question:
      "When does this audience watch, and how concentrated is viewing by day and daypart?",
    metrics:
      "Average minutes watched per household and percentage of households watching.",
    dimensions:
      "Monday–Sunday × Early AM, Morning, Daytime, Afternoon, Primetime and Late Night; local platform, channel/app and lookback controls.",
    chart:
      "Observed V5: 7×6 heatmap with direct values and a six-step minutes ramp.",
    interaction:
      "Platform rebuilds the channel/app options; lookback and channel/app rederive cells. Cells expose hover/focus tooltips and do not drill down.",
    rationale:
      "A matrix supports scanning recurring day/daypart concentrations without implying a continuous time series.",
    result:
      "The card connects schedule timing with the active audience and viewing context.",
    status: "Observed V5",
    note:
      "Day-over-year/week-over-week definitions, timezone and daypart boundaries still require product/data clarification.",
    sources: ["v5-handoff", "v5-source", "annotation-17"],
  },
  {
    id: "genre",
    title: "Viewership by Genre",
    question:
      "What does the audience watch, and which genres matter within the selected platform?",
    metrics:
      "Average minutes/week, share of watch time and Index as supporting text.",
    dimensions:
      "Twelve rendered IAB genre categories within audience, environment, type and platform context.",
    chart:
      "Observed V5: grouped vertical bars with independent axes; Index appears beneath category labels rather than as a third series.",
    interaction:
      "Switch Trends to Genres, then click a genre to constrain the shared show and behaviour universe.",
    rationale:
      "Absolute viewing measures answer popularity; Index adds relative context without competing on the plotted scales.",
    result:
      "Genre selection becomes a useful cross-filter for show discovery and migration.",
    status: "Observed V5",
    note:
      "The live code does not update affinity from genre selection. Current Index labels append %, although Index 100 means the national average.",
    sources: ["v5-handoff", "v5-source"],
  },
  {
    id: "shows",
    title: "Top 10 Indexing Shows",
    question:
      "Which ten shows index highest, and how does a selected show's consumption change over time?",
    metrics:
      "Overview: average minutes/household, rendered share of watch time and Index. Detail: households watching and average minutes watched per household.",
    dimensions:
      "Show constrained by platform, type, environment and genre; detail spans Week 1–4.",
    chart:
      "Observed V5: grouped vertical bars for overview and a dual-axis, two-line time series for selected-show detail.",
    interaction:
      "Select a bar or show from the dependent dropdown to open detail; choose All shows to return to overview. Hover/focus reveals both weekly metrics.",
    rationale:
      "Progressive disclosure preserves comparison while making a specific title's movement inspectable.",
    result:
      "The flow is Top Indexing Shows → select show → four-week detail → return to overview.",
    status: "Observed V5; supported by annotation #37",
    note:
      "The implemented field is named household reach while the UI renders '% of total watch time'; the denominator requires clarification. Index % suffix is also pending correction.",
    sources: ["v5-handoff", "v5-source", "annotation-37"],
  },
  {
    id: "platform-share",
    title: "Share of Viewing Minutes by Platform",
    question: "Where does this audience's viewing time happen?",
    metrics:
      "Share of viewing minutes, with estimated minutes per household as support.",
    dimensions: "Linear TV, Streaming and FAST.",
    chart:
      "Intended direction in the brief: horizontal stacked bar. Observed V5: no separate stacked-bar KPI; platform share is represented by the donut in the merged media-type card.",
    interaction:
      "Observed V5 donut selection acts as a downstream type scope.",
    rationale:
      "The brief separates platform distribution from affinity. The live design consolidates distribution with destination time-spent to reduce duplicated media-type context.",
    result:
      "The question is represented, but not in the separate card or horizontal form requested by the case-study brief.",
    status: "Intended direction differs from observed V5",
    note:
      "Do not present a horizontal stacked bar as delivered V5 functionality. V3 did implement horizontal 100% stacked platform-share bars by genre, but that is not the live V5 form.",
    sources: ["case-study-brief", "v3-source", "v5-handoff", "v5-source"],
  },
  {
    id: "affinity",
    title: "Cultural Affinity",
    question:
      "Where does this audience over- or under-index against the national average, and which shows relate to the selected parameter?",
    metrics: "Parameter Index; selected-detail viewers and show Index.",
    dimensions:
      "Food, Travel, Comedy, Documentary, News, Music, Lifestyle and Sports, plus five mapped shows.",
    chart:
      "Intended direction in the brief: selected-genre star diagram. Observed V5: eight-axis radar with numeric rings and a dashed national baseline at 100, followed by a top-five list.",
    interaction:
      "Pointer or keyboard selection changes the selected parameter, rank and related-show detail; list rows do not drill down.",
    rationale:
      "The radar keeps all eight parameters comparable to one benchmark; the detail list turns a selected signal into named content.",
    result:
      "Affinity is distinct from genre popularity and from the migration card.",
    status: "Observed V5 differs from brief visual direction",
    note:
      "The live radar is not a star diagram centred on a selected genre, and genre selection does not anchor affinity. Taxonomy, mapping and benchmark feed require clarification.",
    sources: [
      "case-study-brief",
      "v5-handoff",
      "v5-source",
      "annotation-18",
      "annotation-20",
      "annotation-41",
    ],
  },
  {
    id: "migration",
    title: "Migration Signals",
    question:
      "Where do viewers of a selected source show go next within one hour?",
    metrics: "Flow share and drop from source.",
    dimensions:
      "Source show/network → behaviour → destination show/network or Other/stopped watching.",
    chart:
      "Observed V5: custom Sankey showing the top three behaviour branches and two strongest named destinations plus Other/stopped watching.",
    interaction:
      "The show dropdown changes the source and flows. Ribbons expose hover detail; there is no click drilldown.",
    rationale:
      "Ribbon width communicates relative pathways while preserving the behavioural journey from source to outcome.",
    result:
      "The card answers a next-action question rather than reducing migration to a generic ranking.",
    status: "Observed V5",
    note:
      "Cohort, denominator, attribution and migration methodology require product/data clarification.",
    sources: ["v5-handoff", "v5-source", "annotation-40"],
  },
];

export const feedback: Feedback[] = [
  {
    id: "brief-17",
    sourceNumber: "Annotation #37",
    requestedNumber: "Brief reference #17",
    title: "Preserve overview, add show detail",
    quote: "Add show-level drilldown with consumption trend",
    problem:
      "A ranked show overview could not explain how consumption of one title changed over time.",
    decision:
      "Keep the Top Indexing Shows overview and add a selected-show detail state.",
    visual:
      "Four-week, two-line chart with separate axes for average minutes per household and households watching.",
    outcome:
      "V5 supports overview → selected show → weekly detail → overview.",
    status: "Observed in V5",
    source:
      "The brief calls this #17; the matching persisted evidence is V5 annotation #37. Stored annotation #17 is a different temporal-filter alignment request.",
  },
  {
    id: "brief-19",
    sourceNumber: "No matched persisted annotation",
    requestedNumber: "Brief reference #19",
    title: "Make controls context-aware",
    quote:
      "The dropdown should change depending on whether the user selects Genre or Show.",
    problem:
      "A static secondary control can become irrelevant when the analytical dimension changes.",
    decision:
      "Treat the Shows/Genres choice as the parent control and expose only controls relevant to the active view.",
    visual:
      "V5 shows a dependent show dropdown in Shows view; Genres are selected directly from chart marks rather than a second genre dropdown.",
    outcome:
      "The implemented interaction is context-aware, but it is not the exact two-dropdown pattern described in the brief.",
    status: "Partially observed; brief intent only",
    source:
      "Case-study brief lines 414–426 and live V5/requirements. No persisted annotation was associated with this brief number.",
  },
  {
    id: "brief-20",
    sourceNumber: "Annotation #42",
    requestedNumber: "Brief reference #20",
    title: "Remove Index from the plotted scales",
    quote: "Keep the Index visible on the X-axis as a percentage label",
    problem:
      "Plotting minutes, share and Index as three axes would make scale comparison harder to interpret.",
    decision:
      "Plot minutes and share as two bar series on independent axes; keep Index in labels and hover detail.",
    visual:
      "Two-series vertical bar chart with Index as supporting category text, not a third series.",
    outcome:
      "V5 implements the two-series structure for channel/app, shows and genres.",
    status: "Observed in V5; label semantics pending",
    source:
      "Brief reference #20 is supported by persisted V5 annotation #42, not stored annotation #20. Current Index labels still append %, which the handoff flags for clarification.",
  },
  {
    id: "brief-22",
    sourceNumber: "Annotation #42",
    requestedNumber: "Brief reference #22",
    title: "Clarify the second viewing metric",
    quote: "Secondary Y-axis: % of watch time",
    problem:
      "The second series needed an explicit meaning and its own scale.",
    decision:
      "Use average minutes/week as the primary measure and share of watch time as the secondary measure.",
    visual:
      "Two vertical bar series with independently labelled Y-axes and all metrics in the tooltip.",
    outcome: "The channel/app chart follows this structure in V5.",
    status: "Observed in V5",
    source:
      "Brief reference #22 aligns with persisted V5 annotation #42. Stored annotation #22 instead requests removal of the media-card alert.",
  },
  {
    id: "brief-18",
    sourceNumber: "Annotation #42",
    requestedNumber: "Brief reference #18",
    title: "Keep Index visible but secondary",
    quote: "Index (%) shown as the supporting label for each category",
    problem:
      "A benchmark is useful only if it is visible and clearly separated from absolute viewing measures.",
    decision:
      "Label Index beneath categories and retain it in hover detail without adding an Index axis.",
    visual: "Supporting X-axis label and tooltip line.",
    outcome:
      "Index is visible in V5, although the displayed % suffix conflicts with its benchmark semantics.",
    status: "Observed with correction pending",
    source:
      "Brief reference #18 is supported by V5 annotation #42 and the handoff. Stored annotation #18 concerns the affinity radar and is separate review history.",
  },
  {
    id: "annotation-17-history",
    sourceNumber: "Annotation #17",
    requestedNumber: "Additional review history",
    title: "Compact the temporal destination filter",
    quote: "align a right side with filter and make it compact",
    problem:
      "The All channels/apps control did not align with the other local controls.",
    decision:
      "Place local temporal controls together on the right in compact variants.",
    visual:
      "Compact channel/app and lookback controls aligned beside the platform tabs.",
    outcome:
      "The V5 Temporal card groups its local controls in the card header.",
    status: "Resolved annotation",
    source:
      "Persisted V4 annotation #17; target: All channels / apps. This is not the show-drilldown item labelled #17 in the case-study brief.",
  },
  {
    id: "annotation-18-history",
    sourceNumber: "Annotation #18",
    requestedNumber: "Additional review history",
    title: "Make the affinity radar actionable",
    quote:
      "8 parameters FOOD TRAVEL COMEDY DOCUMENTARY NEWS MUSIC LIFESTYLE SPORTS",
    problem:
      "The affinity view needed a fixed eight-parameter structure, readable grid values and a useful selected state.",
    decision:
      "Use eight fixed axes, numeric rings, a default selection and selected-parameter detail.",
    visual:
      "Eight-axis radar with national baseline and a parameter-driven detail area.",
    outcome:
      "V5 renders all eight parameters and defaults to the highest Index.",
    status: "Resolved annotation",
    source:
      "Persisted V4 annotation #18. It is unrelated to the Index-visibility theme labelled #18 in the case-study brief.",
  },
  {
    id: "annotation-19-history",
    sourceNumber: "Annotation #19",
    requestedNumber: "Additional review history",
    title: "Separate chart legend and controls",
    quote: "left should be chart legends and right can be filters",
    problem:
      "Legends and controls competed for the same visual position.",
    decision:
      "Give explanatory legend content and interactive controls distinct alignment.",
    visual:
      "Legend at the left of the chart header; compact controls at the right.",
    outcome: "The Trends card uses clearer header grouping.",
    status: "Resolved annotation",
    source:
      "Persisted V4 annotation #19. It does not request dependent Genre/Show dropdowns.",
  },
  {
    id: "annotation-20-history",
    sourceNumber: "Annotation #20",
    requestedNumber: "Additional review history",
    title: "Keep affinity detail inside its own card",
    quote: "show below top 5 shows",
    problem:
      "Affinity selection needed an explicit result without appearing to control Migration Signals.",
    decision:
      "Update a top-five show list inside the affinity card and use a restrained selected mark.",
    visual:
      "Selected radar label/vertex plus ranked viewers and Index rows below.",
    outcome: "V5 selection updates only affinity detail.",
    status: "Resolved annotation",
    source:
      "Persisted V4 annotation #20. It is separate from the three-axis theme labelled #20 in the case-study brief.",
  },
  {
    id: "annotation-22-history",
    sourceNumber: "Annotation #22",
    requestedNumber: "Additional review history",
    title: "Reduce media-card explanation",
    quote: "remove a alert component",
    problem:
      "The merged media card contained more explanatory UI than the reviewer wanted.",
    decision:
      "Remove the alert while retaining the type and time-spent interaction.",
    visual:
      "A quieter merged media card without the informational alert.",
    outcome: "V5 keeps the 20/80 card and omits that alert.",
    status: "Resolved annotation",
    source:
      "Persisted V4 annotation #22. It is unrelated to the metric-definition theme labelled #22 in the case-study brief.",
  },
  {
    id: "annotation-38",
    sourceNumber: "Annotation #38",
    requestedNumber: "Additional V5 review history",
    title: "Rename the media section",
    quote: "TV viewership by media type",
    problem:
      "The former title described component parts rather than the audience question.",
    decision: "Rename the section around the viewing concept.",
    visual:
      "Section title changed from Consumption by type and time spent.",
    outcome: "The new title appears in V5.",
    status: "Resolved annotation",
    source: "Persisted V5 annotation #38.",
  },
  {
    id: "annotation-39",
    sourceNumber: "Annotation #39",
    requestedNumber: "Additional V5 review history",
    title: "Rename Trends",
    quote: "Content viewership trends",
    problem: "Trends alone did not identify what was being analysed.",
    decision: "Name the section for content viewership.",
    visual: "Section title changed from Trends.",
    outcome: "The new title appears in V5.",
    status: "Resolved annotation",
    source: "Persisted V5 annotation #39.",
  },
  {
    id: "annotation-40",
    sourceNumber: "Annotation #40",
    requestedNumber: "Additional V5 review history",
    title: "Rename Migration Signals",
    quote: "TV user behaviour",
    problem:
      "Migration Signals used specialist language without stating the user behaviour.",
    decision: "Rename the section around the behavioural question.",
    visual: "Section title changed while retaining the one-hour Sankey.",
    outcome: "The new title appears in V5.",
    status: "Resolved annotation",
    source: "Persisted V5 annotation #40.",
  },
];

export const sources: Source[] = [
  {
    id: "case-study-brief",
    title: "Uploaded case-study brief",
    reference:
      "attached_assets/Pasted-TASK-Create-an-Interactive-UX-Case-Study-for-the-TV-Aud_1789733880892.txt",
    kind:
      "Requested narrative and intended directions; not independent research or proof of implementation",
  },
  {
    id: "v5-handoff",
    title: "Phase 1 Functional Requirements",
    reference: "TV_Audience_Content_Planner_Phase_1_Functional_Requirements.md",
    kind:
      "Production handoff derived from rendered V5; authoritative scope and traceability",
  },
  {
    id: "prototype-registry",
    title: "Prototype version registry",
    reference:
      "artifacts/figma-design/client/src/lib/prototypeStore.ts",
    kind:
      "Stored version descriptions and renderer inputs; timestamps excluded as historical evidence",
  },
  {
    id: "renderer-map",
    title: "TV prototype renderer mapping",
    reference:
      "artifacts/figma-design/client/src/pages/TvAudienceApp.tsx",
    kind:
      "Implementation evidence that V1/V2 share dashboard and V3/V4/V5 have dedicated renderers",
  },
  {
    id: "v3-source",
    title: "V3 Content Planner source",
    reference:
      "artifacts/figma-design/client/src/pages/tv-audience/v3/",
    kind: "Observed implementation evidence",
  },
  {
    id: "v4-source",
    title: "V4 Content Planner source",
    reference:
      "artifacts/figma-design/client/src/pages/tv-audience/v4/",
    kind: "Observed implementation evidence",
  },
  {
    id: "v5-source",
    title: "V5 Content Planner source",
    reference:
      "artifacts/figma-design/client/src/pages/tv-audience/v5/",
    kind:
      "Observed implementation evidence; deterministic synthetic prototype model",
  },
  {
    id: "annotation-api",
    title: "Persisted design annotations",
    reference:
      "GET /api/prototypes/tv-audience-intelligence/annotations",
    kind: "Stakeholder/design review history; not user-study evidence",
  },
  {
    id: "annotation-17",
    title: "Stored annotation #17",
    reference:
      "Annotation API sequence 17, target All channels / apps",
    kind: "Resolved V4 review note",
  },
  {
    id: "annotation-18",
    title: "Stored annotation #18",
    reference:
      "Annotation API sequence 18, target Cultural affinity",
    kind: "Resolved V4 review note",
  },
  {
    id: "annotation-20",
    title: "Stored annotation #20",
    reference:
      "Annotation API sequence 20, target Cultural affinity",
    kind: "Resolved V4 review note",
  },
  {
    id: "annotation-37",
    title: "Stored annotation #37",
    reference: "Annotation API sequence 37, target Trends",
    kind: "Resolved V5 show-drilldown request",
  },
  {
    id: "annotation-40",
    title: "Stored annotation #40",
    reference:
      "Annotation API sequence 40, target Migration signals",
    kind: "Resolved V5 naming request",
  },
  {
    id: "annotation-41",
    title: "Stored annotation #41",
    reference:
      "Annotation API sequence 41, target Cultural affinity",
    kind: "Resolved V5 naming and description request",
  },
  {
    id: "annotation-42",
    title: "Stored annotation #42",
    reference:
      "Annotation API sequence 42, target Time Spent by Channel / App",
    kind: "Resolved V5 two-series vertical-bar request",
  },
];

export const useCases: UseCase[] = [
  {
    id: "viewing-behaviour",
    title: "Viewing behaviour",
    question: "How does my audience consume TV?",
    detail:
      "Read audience scale, media-type mix and day/daypart concentration within the applied audience context.",
    kpis: ["consumption-time", "temporal", "platform-share"],
  },
  {
    id: "media-planning",
    title: "Media planning",
    question: "Where should I activate to reach this audience?",
    detail:
      "Identify important platforms and destinations, then inspect when viewing is concentrated. Activation itself is not part of the V5 Phase 1 dashboard.",
    kpis: ["consumption-time", "platform-share", "temporal"],
  },
  {
    id: "content-targeting",
    title: "Content targeting",
    question: "What content and genres over-index for this audience?",
    detail:
      "Move from genre popularity to indexed shows, affinity context and post-show behaviour.",
    kpis: ["genre", "shows", "affinity", "migration"],
  },
];

export const evaluations: Evaluation[] = [
  {
    method: "Stakeholder annotation review",
    lookedFor:
      "Hierarchy, naming, control placement, metric clarity and useful detail states.",
    evidence:
      "The persisted annotation API contains resolved V4 and V5 review notes, including #17–#22 and #37–#42.",
    response:
      "V5 incorporates compact/local control grouping, an actionable affinity detail, section renaming, two-series destination bars and a show-level trend.",
    limitation:
      "Annotations are stakeholder/design feedback, not participant-based usability evidence.",
  },
  {
    method: "Artifact comparison",
    lookedFor:
      "Whether claimed visualisation changes are present in the implemented renderers.",
    evidence:
      "Source comparison shows V3 horizontal genre and affinity bars, V3 platform-share stacks, V4 combo/radar/Sankey forms and V5 refinements.",
    response:
      "The case study labels implemented deltas as Observed and brief-only requests as Intended direction.",
    limitation:
      "V1 and V2 share one current renderer, so there are no distinct archival screens to compare.",
  },
  {
    method: "Requirement traceability",
    lookedFor:
      "Coverage of Phase 1 questions, controls, states, cross-filtering, chart encodings and acceptance criteria.",
    evidence:
      "The V5-derived handoff traces six SmartCards, seven narrative KPI topics, show/affinity detail, PDF export and the Phase 2 boundary.",
    response:
      "Each KPI story cites the handoff and flags unresolved definitions rather than presenting them as settled.",
    limitation:
      "Traceability demonstrates specification coverage, not task success, comprehension or business impact.",
  },
  {
    method: "Prototype interaction review",
    lookedFor:
      "Whether overview, cross-filter and detail interactions form a coherent analytical sequence.",
    evidence:
      "Live source confirms staged Apply/Clear, immediate environment, type synchronisation, genre/show dependencies, four-week show detail, affinity detail and migration source selection.",
    response:
      "The final story distinguishes cross-filters from drilldowns and documents reset/dependency behaviour.",
    limitation:
      "No research protocol, participant count, task metrics, interview synthesis or measured user-study outcome is documented.",
  },
];

export const outcomes: Outcome[] = [
  {
    title: "A question-led information architecture",
    detail:
      "Complex audience and viewing data is organised into scale, mix, destinations, content, timing, affinity and behaviour.",
  },
  {
    title: "Clearer metric hierarchy",
    detail:
      "Minutes and share use independent axes while Index is supporting benchmark context, not a third plotted series.",
  },
  {
    title: "Overview-to-detail movement",
    detail:
      "A show can be compared in the top-ten overview and then inspected across four weeks without losing audience context.",
  },
  {
    title: "Connected exploration",
    detail:
      "Type and genre selections constrain relevant downstream modules; global changes reset dependent state.",
  },
  {
    title: "Distinct analytical purposes",
    detail:
      "Viewing distribution, genre popularity, relative affinity and post-show migration are presented as different questions.",
  },
  {
    title: "A traceable Phase 1 direction",
    detail:
      "V5 consolidates requirements and stakeholder annotations into a handoff-ready prototype, without claiming production or user-study outcomes.",
  },
];

export const learnings: Learning[] = [
  {
    title: "Start with the question, not the chart",
    detail:
      "Platform distribution, relative affinity and behavioural migration can look related, but each needs a different metric and interaction model.",
  },
  {
    title: "Separate unlike measures",
    detail:
      "Absolute minutes, share and relative Index should not compete on one scale; hierarchy is part of analytical accuracy.",
  },
  {
    title: "Use progressive disclosure for detail",
    detail:
      "Keeping the show overview while adding a selected-title trend protects comparison and supports focused inspection.",
  },
  {
    title: "Treat annotations as evidence with limits",
    detail:
      "Stored review notes can explain why a design changed, but they do not establish participant validation or measured impact.",
  },
  {
    title: "Compare implementation, not labels alone",
    detail:
      "V1/V2 share a renderer, while V3–V5 preserve real source-level visualisation differences; provenance determines what can be claimed.",
  },
  {
    title: "Keep intended and observed states explicit",
    detail:
      "The brief's horizontal platform bar and star affinity concept are design directions, while live V5 uses a merged donut and radar.",
  },
];

export const interactionSteps: InteractionStep[] = [
  {
    title: "Define the audience",
    detail:
      "Stage country, Mosaic, age and gender, TV-consumption, children and date-range values, then Apply.",
    note: "Draft filter edits do not affect metrics or export until Apply.",
  },
  {
    title: "Read the overview",
    detail:
      "Establish audience scale, viewing volume, consumption, destinations and reach before exploring detail.",
    note:
      "Overview tiles are read-only and their production calculations require clarification.",
  },
  {
    title: "Choose the viewing context",
    detail:
      "Switch All/Addressable and optionally select Linear TV, Streaming or FAST from the donut.",
    note:
      "The environment is immediate; a type selection synchronises Channel, Trends and Temporal tabs.",
  },
  {
    title: "Explore destinations and content",
    detail:
      "Compare channel/app time spent, then switch Content viewership trends between Shows and Genres.",
    note:
      "Genre constrains Shows and Behaviour, but does not update affinity in the live V5 code.",
  },
  {
    title: "Open show detail",
    detail:
      "Select a show to replace the overview chart with its Week 1–4 dual-line trend; choose All shows to return.",
    note:
      "This interaction is explicitly requested by persisted annotation #37.",
  },
  {
    title: "Inspect timing, affinity and migration",
    detail:
      "Review day/daypart concentration, select an affinity parameter for its top-five detail, and choose a migration source.",
    note:
      "Heatmap and Sankey marks provide hover detail, not drilldown.",
  },
  {
    title: "Export the applied view",
    detail:
      "Export a PDF of the applied audience and environment context.",
    note:
      "Prototype collaboration overlays are tooling and are excluded from product scope and export.",
  },
];
