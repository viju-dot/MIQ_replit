# TV Audience & Content Planner case-study evidence outline

## Evidence policy

This outline separates three kinds of material:

1. **Observed implementation** — behaviour visible in the V3, V4 or V5 source and described in the V5-derived functional requirements.
2. **Recorded review evidence** — persisted stakeholder/design annotations and version-registry descriptions.
3. **Intended direction** — requests in the uploaded case-study brief that may not match the live V5 implementation.

No participant research, usability-study result, task-success measure, score, percentage improvement or production business outcome was found. Prototype values are deterministic synthetic data, not a production feed. Registry seed timestamps are omitted because they are not reliable historical design dates. No person names or annotation-author details are used.

## Hero and context

- **Title:** TV Audience & Content Planner
- **Subtitle:** Turning complex TV audience behaviour into actionable media-planning insights.
- **Role:** Product / UX design; AI-assisted prototyping.
- **Scope:** Phase 1 audience-led dashboard, KPI architecture, data visualisation and interaction design.
- **Timeline:** V1–V5 iterative prototype sequence; no dates.
- **Users:** Sales / Trader teams is supplied by the case-study brief. The V5 requirements explicitly say personas and permissions require product clarification.
- **Markets:** United Kingdom, Germany, France, Italy and Spain.
- **Status:** V5 prototype and production-handoff specification. Comparison Mode remains Phase 2.

## Problem framing

The brief frames the problem as turning a large amount of audience and viewing data into insights that can be understood, compared and acted on. The implementation supports concrete planning questions: audience scale, Linear/Streaming/FAST mix, important channels/apps, shows and genres, day/daypart concentration, affinity against a national benchmark, and one-hour post-show behaviour.

The evidence-backed complexity story is:

- multiple media types and market-specific inventories;
- absolute, proportional and relative metrics with different scales;
- audience, platform, content, time and migration dimensions;
- staged global filters plus immediate and local state;
- cross-filtering and dependent controls;
- production definitions still required for feeds, denominators, benchmarks, taxonomy and methodology.

## Users and use cases

### Viewing behaviour

**Question:** How does my audience consume TV?

Use Overview, Consumption by Type, platform share as represented in the merged media card, and Temporal Insights.

### Media planning

**Question:** Where should I activate to reach this audience?

Use media-type mix, channel/app time spent and temporal concentration. The dashboard supports planning insight; activation is not a delivered V5 Phase 1 interaction.

### Content targeting

**Question:** What content and genres over-index for this audience?

Use Viewership by Genre, Top Indexing Shows, Content Affinity and TV User Behaviour. Popularity, affinity and migration must remain distinct concepts.

## Requirements to information architecture

The case-study narrative uses exactly seven topics:

1. Consumption by Type & Time Spent
2. Temporal Insights
3. Viewership by Genre
4. Top Indexing Shows
5. Share of Viewing Minutes by Platform
6. Content/Cultural Affinity
7. Migration Signals / TV User Behaviour

The live V5 has six Overview metrics and six SmartCards. Topic 5 is not a separate implemented card: its Linear/Streaming/FAST distribution is represented by the donut inside the merged media-type card. This distinction must be visible in the case study.

Comparison Mode is explicitly Phase 2 and must not appear as delivered Phase 1 functionality.

## Version narrative

### V1 — Initial concept

- **Problem:** establish audience discovery and a basic overview.
- **Recorded exploration:** segment explorer and overview only; no activation.
- **Decision:** keep the initial product record narrow.
- **Result:** a baseline concept was available for extension.
- **Provenance note:** V1 and V2 both map to the current dashboard renderer. `case-study/v1.jpg` is an available renderer capture, not a distinct archival V1 image.

### V2 — Activation and filter refinement

- **Problem:** the recorded V1 journey ended at exploration.
- **Recorded exploration:** activation flow, refined filters and dark-mode support.
- **Decision:** broaden the record toward explore-and-activate.
- **Result:** a fuller product journey was described.
- **Provenance note:** V2 deliberately reuses `case-study/v1.jpg`; there is no separate V2 renderer or verified archival screenshot.

### V3 — Content Planner ideation

- **Problem:** audience overview alone did not answer content-planning questions.
- **Observed exploration:** a connected Understand → Discover dashboard with market-aware filters and eight KPI areas.
- **Observed visual forms:** horizontal genre bars; horizontal 100% stacked platform-share bars by genre; diverging affinity Index bars around 100; show table; temporal heatmap; simplified Sankey-style pathway.
- **Decision:** make selections carry context through a question-led analysis journey.
- **Result:** the relationship between type, genre, platform, affinity, shows and migration became interactive.

### V4 — Wireframe-faithful system

- **Problem:** V3 needed stronger hierarchy and closer alignment with the agreed wireframe and design system.
- **Observed delta from V3:** Overview tiles and a merged type/time-spent card; genre/show combo charts in place of V3's genre horizontal bars/table pattern; eight-axis radar in place of V3's diverging affinity bars; custom Sankey; chart-token layer.
- **Decision:** use shared cards and question-specific visualisations.
- **Result:** a coherent implementation became the basis for detailed annotation.

### V5 — Stakeholder-feedback revisions

- **Problem:** annotations identified issues in controls, naming, metric scales and detail states.
- **Evidence:** V5 annotations #37–#42 and live source.
- **Decision:** retain overview plus detail, use independent axes for unlike measures, keep Index supporting, and clarify section names.
- **Observed result:** staged audience filters, media-type cross-filtering, vertical two-series destination and trend charts, four-week show detail, temporal heatmap, radar plus top-five detail, and one-hour Sankey.
- **Limit:** this is a prototype/specification result, not evidence of production impact or user-study validation.

## KPI design stories

### 1. Consumption by Type & Time Spent

- **Question:** What share of viewing is Linear TV, Streaming or FAST, and which destinations matter?
- **Metrics:** share of viewing minutes and estimated minutes/household; average minutes/week, share of watch time and Index for channel/app.
- **Observed V5:** 200px donut plus grouped vertical destination bars with independent axes.
- **Interaction:** type toggles downstream scope and synchronises Channel, Trends and Temporal platform tabs.
- **Decision rationale:** distribution and destination ranking are related but need different visual forms; Index should not become a third plotted scale.
- **Caveats:** Homescreen is not implemented. Current Index labels append `%`, even though Index 100 means national average.

### 2. Temporal Insights

- **Question:** When does the audience watch?
- **Metrics:** average minutes watched per household and percentage of households watching.
- **Observed V5:** 7×6 day/daypart heatmap with direct values and hover/focus detail.
- **Interaction:** platform, channel/app and lookback are local controls; cells do not drill down.
- **Caveats:** timezone, daypart and DoY/WoW definitions require clarification.

### 3. Viewership by Genre

- **Question:** What does the audience watch?
- **Metrics:** average minutes/week, share of watch time and Index.
- **Observed V5:** grouped vertical bars with two axes and supporting Index labels.
- **Interaction:** a selected genre constrains Shows and Behaviour.
- **Decision rationale:** minutes/share express popularity; Index expresses relative strength.
- **Caveat:** genre does not update live affinity.

### 4. Top Indexing Shows

- **Question:** Which shows index highest, and how does a selected title move over time?
- **Observed overview:** grouped bars sorted by Index.
- **Observed detail:** Week 1–4 dual-line chart for households watching and average minutes/household.
- **Interaction:** bar/dropdown opens detail; All shows returns to overview.
- **Evidence:** persisted V5 annotation #37 explicitly asks to keep overview and add this detail state.
- **Caveat:** the underlying `hhPct` naming and rendered `% of total watch time` label conflict and require clarification.

### 5. Share of Viewing Minutes by Platform

- **Intended direction:** the brief requests a separate horizontal stacked bar.
- **Observed V5:** no separate stacked card; Linear/Streaming/FAST share appears as the donut in the merged media-type card.
- **Historical implementation:** V3 had horizontal 100% stacked platform-share bars by genre.
- **Editorial rule:** label the horizontal bar “Intended direction,” never “Final V5.”

### 6. Content Affinity

- **Intended direction:** the brief describes a selected-genre star diagram.
- **Observed V5:** eight-axis radar for Food, Travel, Comedy, Documentary, News, Music, Lifestyle and Sports, with rings at 50/100/150/200 and a dashed national baseline at 100.
- **Interaction:** selecting a parameter updates rank and a top-five show list.
- **Decision rationale:** the radar compares eight parameters to one benchmark; detail makes selection actionable.
- **Caveat:** it is not a star diagram centred on a selected genre, and live genre selection does not anchor affinity.

### 7. TV User Behaviour

- **Question:** What does the audience watch next within one hour?
- **Metrics:** flow share and drop from source.
- **Observed V5:** custom Sankey, top three behaviour branches, two strongest named destinations and Other/stopped watching.
- **Interaction:** source-show dropdown updates flows; ribbons are hover-only.
- **Caveat:** cohort, denominator and migration methodology require clarification.

## Feedback-number reconciliation

The uploaded brief's numbers #17, #18, #19, #20 and #22 do not identify the same records as persisted API annotation sequences #17, #18, #19, #20 and #22. The UI copy must use **Brief reference #N** for the requested themes and must not imply a false source association.

### Brief reference #17 — show drilldown

- **Actual supporting record:** V5 annotation #37.
- **Short quote:** “Add show-level drilldown with consumption trend.”
- **Observed response:** keep Top Indexing Shows overview; add Week 1–4 dual-line detail and return path.
- **Stored annotation #17 is different:** “align a right side with filter and make it compact,” targeting All channels/apps.

### Brief reference #19 — dependent Genre/Show control

- **Actual supporting record:** no persisted annotation confidently matched.
- **Observed V5:** Shows/Genres is a parent switch; Shows view has a dependent show dropdown; Genres are direct chart selections, not a second dropdown.
- **Stored annotation #19 is different:** “left should be chart legends and right can be filters.”

### Brief reference #20 — no third Index axis

- **Actual supporting record:** V5 annotation #42.
- **Short quote:** “Keep the Index visible on the X-axis as a percentage label.”
- **Observed response:** two vertical bar series and two axes; Index remains supporting text/tooltip.
- **Stored annotation #20 is different:** it asks for an affinity top-five list and independence from Migration Signals.

### Brief reference #22 — secondary watch-time metric

- **Actual supporting record:** V5 annotation #42.
- **Short quote:** “Secondary Y-axis: % of watch time.”
- **Observed response:** average minutes/week plus share of watch time on independent axes.
- **Stored annotation #22 is different:** “remove a alert component.”

### Brief reference #18 — Index visibility

- **Actual supporting record:** V5 annotation #42 and the handoff.
- **Short quote:** “Index (%) shown as the supporting label for each category.”
- **Observed response:** supporting category label and tooltip, no Index series.
- **Stored annotation #18 is different:** it requests the affinity radar's eight parameters, grid numbers and default selection.

### Additional persisted review history

- **#17:** compact/right-align All channels/apps.
- **#18:** eight fixed affinity parameters, grid values and default selection.
- **#19:** legend left, filters right.
- **#20:** selected affinity parameter reveals a top-five show list inside its own card.
- **#22:** remove the media-card alert.
- **#37:** add show-level consumption drilldown without replacing overview.
- **#38:** rename Consumption by type and time spent to TV viewership by media type.
- **#39:** rename Trends to Content viewership trends.
- **#40:** rename Migration signals to TV user behaviour.
- **#41:** rename Cultural affinity to Content affinity and clarify its description.
- **#42:** redesign Time Spent by Channel/App as a Fiber two-series vertical bar chart, keeping Index as supporting information.

All are persisted as Resolved review annotations. Resolved status shows review workflow state, not user validation.

## Evaluation evidence

### Stakeholder annotation review

- **Looked for:** hierarchy, naming, component consistency, metric clarity and useful detail states.
- **Evidence:** resolved V4/V5 annotations.
- **Response:** compact/local control grouping, clearer names, affinity detail, show drilldown and revised destination chart.
- **Limitation:** stakeholder/design feedback only.

### Artifact comparison

- **Looked for:** real changes between implemented versions.
- **Evidence:** V3/V4/V5 source comparison.
- **Response:** document only source-observed chart and interaction deltas.
- **Limitation:** V1/V2 have no distinct renderers or archival screenshots.

### Requirement traceability

- **Looked for:** coverage of Phase 1 questions, controls, states and acceptance criteria.
- **Evidence:** V5-derived functional requirements.
- **Response:** map each KPI story to metrics, dimensions, chart, interaction and unresolved definitions.
- **Limitation:** requirement coverage is not a measured outcome.

### Prototype interaction review

- **Looked for:** coherent filter, cross-filter and detail behaviour.
- **Evidence:** implemented staged/apply state, media-type synchronisation, genre/show dependency, show detail, affinity detail and migration source selection.
- **Response:** distinguish cross-filters from drilldowns and identify resets.
- **Limitation:** no documented research protocol, participants, task results or quantitative evaluation.

## Outcomes that can be claimed

- Complex audience data is structured into clear insight areas.
- Unlike metrics have clearer hierarchy and independent scales.
- Index is treated as supporting relative context, although the visible `%` suffix still needs correction.
- Users can move from a show overview to a specific four-week trend.
- Type, genre and show context connect relevant modules.
- Distribution, popularity, affinity and migration answer distinct questions.
- V5 provides a traceable prototype and handoff direction.

Do not claim improved conversion, efficiency, comprehension, task success, adoption or revenue.

## Learnings

- Begin with the analytical question, not a preferred visual form.
- Give absolute, proportional and relative metrics separate visual roles.
- Use progressive disclosure when comparison and detail are both important.
- Treat persisted annotations as decision evidence, not user-study evidence.
- Verify version claims against renderer provenance.
- Label brief intent and live implementation separately when they diverge.

## Interaction story

1. Stage six audience/date filters and Apply.
2. Read six Overview metrics.
3. Choose All/Addressable and optionally select a media type.
4. Compare destination time spent and switch Trends between Shows and Genres.
5. Select a show to open four-week detail; return with All shows.
6. Inspect Temporal concentration, select an affinity parameter and select a migration source.
7. Export the applied view.

Comparison Mode remains outside this Phase 1 journey.

## Next phase

V5 prototype → hi-fi Figma design → final implementation refinement.

Before production, product/data owners must confirm personas and permissions, feeds and refresh expectations, metric denominators, Index semantics and suffix, Mosaic outside the UK, addressable classification, date/week/timezone logic, affinity mapping, genre-to-affinity intent and migration methodology. Comparison Mode remains Phase 2.

## Source register

- Uploaded case-study brief: requested narrative and intended directions, not independent evidence.
- `TV_Audience_Content_Planner_Phase_1_Functional_Requirements.md`: V5-derived scope, behaviour, acceptance criteria and unresolved definitions.
- `artifacts/figma-design/client/src/lib/prototypeStore.ts`: recorded version descriptions; dates intentionally omitted.
- `artifacts/figma-design/client/src/pages/TvAudienceApp.tsx`: renderer mapping and V1/V2 shared-renderer caveat.
- `artifacts/figma-design/client/src/pages/tv-audience/v3/`: observed V3 source.
- `artifacts/figma-design/client/src/pages/tv-audience/v4/`: observed V4 source.
- `artifacts/figma-design/client/src/pages/tv-audience/v5/`: observed V5 source and synthetic model.
- `GET /api/prototypes/tv-audience-intelligence/annotations`: persisted review annotations; no names or PII exported.