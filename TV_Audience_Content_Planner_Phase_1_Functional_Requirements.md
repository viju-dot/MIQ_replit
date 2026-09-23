# TV Audience & Content Planner — Phase 1 Functional Requirements

**Status:** Production handoff derived from live V5  
**Route:** `/tv-audience-intelligence`  
**Phase boundary:** Phase 1 only. **Comparison Mode remains Phase 2.**

## Executive Summary

V5 is a single-page audience-led dashboard for defining a TV audience, understanding its scale and consumption, discovering platforms/channels/apps and content, inspecting temporal patterns and affinity, and viewing one-hour post-show migration. This specification covers only rendered V5 functionality. Prototype values are deterministic synthetic data, not a production feed. Unknowns use **Requires product/data clarification** or **Engineering decision required**.

## Product Scope

### Purpose, users, goals and use cases

The product supports users who need to: define a market/audience; quantify scale, volume and reach; compare Linear TV, Streaming and FAST; find channels/apps, shows and genres; inspect a show’s four-week trend; find day/daypart concentrations; identify affinity against the national average; inspect post-show behaviour; and export the applied view. V5 does not name personas or permissions: **Requires product/data clarification**.

### Phase 1 Scope

- Standalone Reports wrapper and one dashboard screen.
- Six staged global filters, Apply/Clear, immediate All/Addressable control, PDF export.
- Six Overview metrics.
- Six rendered SmartCards and all rendered visualisations/interactions/states.
- Cross-filtering, dependent controls, show/affinity details, responsive and accessible behaviour.

### User journey

Open Standard Reports → stage audience/date values → Apply → read Overview → select environment/type → inspect channel/app and show/genre performance → open show detail → inspect Temporal Insights → select an affinity parameter → select a migration source → export PDF.

The rendered page heading is **TV Audience & Content Planner**, with subtitle **Cross-platform content and audience consumption insights**.

## Dashboard Architecture

Order: title/subtitle; sticky global filters; **Overview**; All/Addressable; **TV viewership by media type** (Consumption by Type + Time Spent by Channel/App); **Content viewership trends**; mirrored All/Addressable; **Temporal Insights**; responsive **Content affinity** + **TV user behaviour**; notes.

Primary navigation is 64px, Reports active, with Intelligence/Audiences/Creatives/Campaigns displayed; full menu at ≥1024px and collapsed Reports menu below. Theme toggle and JS/Pro avatar are right. Secondary navigation is 56px: Standard active/link; Advanced inert. Header auto-hides/floats after scroll and is revealed by top hover/focus. Canvas max-width is 1440px. Prototype version/comment/annotation overlays are tooling, not product scope.

State hierarchy is staged filters → applied filters → immediate environment → optional consumption scope → module-local state. Applied global/environment changes clear type, genre, affinity, show and migration selections and show skeletons. A type selection synchronizes Channel, Trends and Temporal platform tabs and resets Temporal channel to All.

## Global Filters

All are searchable. Single-select closes after selection; multi-select stays open; search is case-insensitive; no result says “No matches.” Empty multi-selection means inclusive All.

| Filter | Exact options | Default | Behaviour |
|---|---|---|---|
| Country | United Kingdom, Germany, France, Italy, Spain | United Kingdom | All modules after Apply; determines linear inventory/commercial rules |
| Mosaic group | All Mosaic groups; City Prosperity; Prestige Positions; Country Living; Suburban Stability; Rental Hubs; Vintage Value | All Mosaic groups (empty) | All modules after Apply; All clears specifics |
| Age & gender | All genders, Male, Female × 16–24, 25–34, 35–44, 45–54, 55–64, 65+ (18) | All ages & genders (empty) | All modules after Apply |
| TV consumption | All viewers, Heavy TV, Medium TV, Light TV | All viewers | All modules after Apply |
| Children | All households; No children; Children 0–4; Children 5–11; Children 12–17 | All households (empty) | All modules after Apply; All clears specifics |
| Date range | Last 7 days; Last 15 days; Last 30 days; Last 60 days | Last 30 days | All modules after Apply |

Mosaic is rendered in all countries despite being described in code as UK-granular: **Requires product/data clarification**.

Edits are staged until Apply. Initially Apply is disabled. Pending edits enable Apply and do not affect KPIs/PDF. After non-default values are applied, the action becomes Clear all filters; Clear restores six defaults, but not environment/local tabs.

**All / Addressable channels** defaults All, updates immediately, appears twice with one synchronized state, and affects every module. Addressable excludes/reweights market-specific non-commercial inventory. Production classification: **Requires product/data clarification**.

**Export PDF** is immediate and always uses the applied filter/environment state, not un-applied draft values. While exporting, the outline button reads “Exporting…” and is disabled. The export is a paginated portrait A4 capture of the dashboard; the sticky filter bar and prototype overlays are omitted and replaced by a header containing the title, all six applied filter values, viewing environment, export date/time and the synthetic-data notice. The filename is `tv-audience-content-planner-{lowercase market code}-{YYYY-MM-DD}.pdf`. A failure is announced inline as `Export failed: {message}` or “Export failed — please try again.”

## Local Filters

| Module | Control; exact options | Default/dependency/effect |
|---|---|---|
| Type | clickable Linear TV, Streaming, FAST donut/legend | None; click again/removable chip clears; scopes downstream |
| Channel/App | Linear TV, Streaming, Fast tabs | Linear TV; synced by type; changes market inventory |
| Trends | View by show/genre switch | Shows; switching clears show |
| Trends | Linear TV, Streaming, Fast | Linear; synced by type; filters shows/reweights genres |
| Shows | All shows + unique valid shows | All; options depend on platform/type/environment/genre; selection opens detail |
| Genres | 12 rendered genre marks | None; selection toggles and restricts shared show universe |
| Temporal | platform tabs; All channels/apps + valid inventory; 7-day (DoY), 15-day (DoY), 30-day (WoW), 60-day (WoW) | Linear; All; 30-day WoW. Platform rebuilds channels; invalid channel resets All |
| Affinity | FOOD, TRAVEL, COMEDY, DOCUMENTARY, NEWS, MUSIC, LIFESTYLE, SPORTS | current highest Index; updates rank/top-five |
| Behaviour | All shows + valid scoped shows | All resolves to top-indexing show |

The data module’s `TOP_N` options and the `GenreBars`, `ShowsTable`, and `AffinityList` components exist but are not rendered; they are not delivered features. `LOOKBACK` is rendered only as the Temporal Insights lookback control.

## Filter Interaction Matrix

| Filter | Overview | Type | Channel | Trends | Temporal | Affinity | Behaviour |
|---|---:|---:|---:|---:|---:|---:|---:|
| Six applied global filters | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| All/Addressable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Type selection | — | selected | sync | sync/scope | sync | scope | scope |
| Genre selection | — | — | — | show universe | — | —* | shared show universe |
| Module-local controls | — | — | local | local | local | local detail | local |

\* Comments claim genre anchors affinity, but live affinity calculation ignores `selectedGenre`: **Requires product/data clarification**.

## KPI Requirements

### Overview

**User story:** As a dashboard user, I want a concise audience summary so that I can understand its scale and activity before exploring detail. **Business question:** how large and active is the audience?

Six Fiber MetricsTiles: **Total households** (K/M); **Total minutes viewed** (K/M); **Avg. weekly TV consumption – Streaming** (`mins`, Index); **Avg linear TV consumption** (`min/wk`, Index); **Avg. channels/apps per hh** (one decimal, Index); **Weekly TV reach** (`% of hh`, Index). Dimension: applied audience and viewing environment. No click, chart legend or tooltip. Source/calculations: **Requires product/data clarification**.

### Consumption by Type

**User story:** As a dashboard user, I want the viewing mix by media type so that I can choose the environment to investigate downstream. **Business question:** what share of minutes is Linear TV, Streaming or FAST?

Metric: share of viewing minutes, with estimated minutes per household as support. Dimension: media type. Visualisation: 200px donut (r78, stroke30), proportional share %. The clickable legend maps Linear TV to qualitative-4 purple, Streaming to qualitative-3 purple and FAST to qualitative-1 yellow, and shows each type’s one-decimal share. Centre defaults “Share of viewing”; hover or selection shows rounded share/name. Hover thickens the active arc by 4px and dims others to 35%. Arc tooltip: type; `Legend: Share of viewing`; share to one decimal; estimated integer minutes/hh. Legend tooltip omits the `Legend` line and otherwise shows the same metrics. Clicking an arc or legend row toggles the downstream type scope; the removable card chip is an equivalent clear action.

### Time Spent by Channel/App

**User story:** As a dashboard user, I want channel/app consumption ranked within a platform so that I can identify important destinations. **Business question:** which destinations matter?

Metrics: average minutes/week, share of watch time and Index. Dimension: channel/app within the selected Linear TV, Streaming or Fast tab. Up to ten destinations are shown, sorted by minutes, as grouped vertical bars. X=channel/app, >12 chars truncates to 11+ellipsis, supporting `Index N%`. Left Y=Avg min/week, five dynamic integer ticks; right Y=% of watch time, five percent ticks. The two-item legend maps minutes to qualitative-3 purple and percentage to qualitative-1 yellow. Tooltip is exactly: channel/app; `Index: N%`; `Highlight: {Index interpretation}`; `Avg min/week: {integer}`; `% of watch time: {one decimal}%`. Hover/focus dims other categories and applies a category wash. Minimum width 680px with horizontal scroll. No drilldown.

### Content Viewership Trends — Shows

**User story:** As a dashboard user, I want the highest-indexing shows for my audience so that I can inspect a relevant title. **Business question:** which ten shows index highest?

Metrics: average minutes/household, rendered `% of total watch time`, and Index supporting text. Dimension: show, constrained by platform/type/environment/genre. Grouped bars are sorted by Index. X=show + supporting `Index N%`; left Y=Avg min/HH; right Y=`% of total watch time`; independent five-tick scales. The legend maps average minutes/household to qualitative-3 purple and `% of total watch time` to qualitative-1 yellow; no line or Index legend is rendered. Tooltip is exactly: show; `Index: N%`; `Avg min / household: {integer} min`; `% of total watch time: {one decimal}%`. It does **not** include an Index interpretation. Click/category or dependent dropdown opens detail. Alert states top 10/platform. Empty title is “No shows match”; message is “No shows match these filters — change the genre filter or viewing scope.” Data property is `hhPct`/commented household reach but UI says watch time: **Requires product/data clarification**.

### Content Viewership Trends — Genres

**User story:** As a dashboard user, I want genre consumption and Index indicators so that I can constrain the show universe. **Business question:** which IAB genres matter?

Metrics: average minutes/week, share of watch time and Index supporting text. Dimension options: Comedy, News, Film, Sports, Drama, Reality, Action, Documentary, Kids, Travel, Food, Home improvement. The same grouped-bar encoding uses left Y=Avg min/week and right Y=Watch time (%), with independent five-tick scales. The legend maps average minutes/week to qualitative-3 purple and share of watch time to qualitative-1 yellow. X labels show genre plus `Index N%`. Tooltip is exactly: genre; `Index: N%`; `Avg minutes / week: {integer} min`; `Share of watch time: {one decimal}%`; it does not include Index interpretation. Click toggles genre selection and the selected category is exposed as pressed. No direct affinity update occurs in live code.

### Selected Show Consumption Over Time

**User story:** As a dashboard user, I want a selected show’s recent consumption trend so that I can understand its weekly movement. **Business question:** how did audience consumption and households watching change across four weeks?

Four-week dual-line detail. X=Week 1–4; left Y=Avg mins/hh; right Y=Households formatted M; five ticks, maxima 115% of data. Legend: Households watching=qualitative-1 yellow; Avg. minutes watched per household=qualitative-3 purple. Hover/focus shows a dashed vertical guide and tooltip: week; `Households watching: {integer}`; `Avg. minutes / household: {integer}`. Inherits all filters, environment, type, genre and Trends platform. All shows returns; another show switches detail. Relation to Date range: **Requires product/data clarification**.

### Temporal Insights

**User story:** As a dashboard user, I want audience concentration by day and daypart so that I can identify strong viewing windows. **Business question:** when does this audience watch?

Metrics: average minutes watched per household and percentage of households watching. Dimensions: day of week × daypart. The 7×6 heatmap has rows Mon–Sun and columns Early AM, Morning, Daytime, Afternoon, Primetime, Late Night. Each cell directly shows `{minutes}m` and household percentage to one decimal. Tooltip is exactly: `{day} · {daypart}`; `Avg minutes/hh: {minutes}m`; `% households: {one decimal}%`; `Heat intensity: N of 6 (low → high minutes)`. Six-step brand ramp encodes minutes; legend is `Low` → six swatches → `High` · `avg mins watched per household`. Hover/focus adds a selected outline; there is no click. Minimum width 720px with horizontal scroll. DoY/WoW definition: **Requires product/data clarification**.

### Content Affinity

**User story:** As a dashboard user, I want affinity against the national average so that I can identify the audience’s strongest content/lifestyle parameter and related shows. **Business question:** where does this audience over- or under-index, and which shows are associated with the selected parameter?

Metric: Index; detail metrics are viewers and show Index. Dimensions: eight fixed parameters and their mapped shows. Eight-axis radar, Index 0–200, numeric rings 50/100/150/200, dashed national baseline 100, unfilled qualitative-4 primary polygon. Tooltip is exactly: parameter; `Index: N`; `Highlight: {Index interpretation}`; `Baseline: National average = 100`. Pointer and Enter/Space select; selected label is bold/underlined and vertex enlarged. Default is highest Index. Supporting text states “Dashed ring = national average (100). Select a parameter to view its details.” Live detail says `{PARAMETER} — top 5 shows`, `Selected parameter · rank N of 8`, then viewer-ranked rows with list rank, compact viewers and `{index} idx`; rows are not clickable. Taxonomy/mapping/ranking/feed: **Requires product/data clarification**.

### TV User Behaviour

**User story:** As a dashboard user, I want to see post-show migration so that I can understand the audience’s next behaviour and destination. **Business question:** where do source-show viewers go within one hour?

Metric: flow share; supporting calculation displayed as drop from source. Dimensions: source show/network → behaviour → destination show/network or Other/stopped. Custom Sankey uses the top three behaviours from Stay on same channel/Switch channel/Move to streaming app/Stop watching; targets are the two strongest show · network destinations plus Other / stopped watching. “From” and “To” label the columns. Ribbon width=flow share; hover raises the ribbon opacity and dims others. Tooltip is exactly: `{behaviour} → {destination}`; `Flow share: {one decimal}%`; `Drop from source: {100 − flow share, one decimal}%`; `Window: Within 1 hour`. Show filter changes source/subtitle/flows; paths have hover but no keyboard focus, click or drilldown. Minimum 560px with horizontal scroll. A screen-reader-only list exposes every flow, and visible supporting copy identifies the source show/network and width meaning. Cohort, denominator and migration rules: **Requires product/data clarification**.

## KPI Visualisation Matrix

| KPI | User question | Primary metric | Secondary metric | Dimension | Chart | Filters | Drilldown |
|---|---|---|---|---|---|---|---|
| Overview | How large/active is the audience? | six summary metrics | four indices | audience | tiles | global, environment | No |
| Type | What is the viewing mix? | share % | estimated minutes/hh | TV type | donut | global, environment | cross-filter |
| Channel | Which destinations matter? | avg min/week | share, Index | channel/app | dual-axis bars | global, environment, type/tab | No |
| Shows | Which shows index highest? | avg min/hh | rendered share, Index | show | grouped bars | global, environment, type, platform, genre | show detail |
| Genres | Which genres matter? | avg min/week | share, Index | genre | grouped bars | global, environment, type, platform | cross-filter |
| Show detail | How does the show move weekly? | avg min/hh | households | week | dual-axis lines | inherited Shows filters | in-card detail |
| Temporal | When does the audience watch? | avg min/hh | % households | day×daypart | heatmap | global, environment, type/platform, channel/app, lookback | No |
| Affinity | Where does the audience index? | Index | viewers/show Index | parameter/show | radar+list | global, environment, type | in-card parameter detail |
| Behaviour | Where do viewers go next? | flow share | drop from source | migration path | Sankey | global, environment, type, genre, show | No |

## Chart Variations and States

- **Default:** UK/all-audience/last-30-days, All environment, no consumption type or genre selected; Linear TV tabs, Shows view, Temporal All channels/apps and 30-day (WoW); affinity detail resolves to the highest-index parameter; behaviour resolves All shows to the current top-indexing show.
- **Applied-filter/environment state:** all module data re-derives and loading skeletons precede the updated values; cross-filter/detail selections reset. Draft global edits do not alter charts.
- **Type-filtered state:** donut selection remains highlighted and a removable filter chip appears; Channel, Trends and Temporal tabs synchronize to that type, while Shows, genres, affinity and behaviour re-derive within scope. Clearing the type removes the scope but leaves platform tabs where the user last left them.
- **Alternative Trends dimension:** Shows displays the top-ten grouped chart and show dropdown; Genres displays all 12 genre groups and removes the show dropdown/alert. Toggling the switch clears show detail.
- **Show-detail state:** selecting a show replaces the grouped show chart with its four-week dual-line detail and dependent show selector.
- **Temporal alternatives:** platform changes rebuild the channel/app options; channel/app and lookback changes re-derive heatmap cells.
- **Affinity detail state:** selecting a radar parameter replaces the parameter/rank and top-five detail in place.
- **Behaviour source state:** selecting a show changes the subtitle, source copy and Sankey flows.
- **Loading/empty/error:** module skeletons, contextual empty states and inline PDF export error are as specified in Responsive / States. No Phase 1 comparison state exists.

## Chart Specifications

Index 100=national average; 150=50% above. It is not minutes or viewing percentage. Badges use arrow/text plus green/red/neutral. Radar explicitly shows baseline. Channel/show/genre currently append `%` to Index, conflicting with semantics: **Requires product/data clarification**.

Rendered mappings: Linear/primary=`--datavis-qualitative-4` `#7c33b5`; Streaming/secondary=`-3` `#a857e5`; FAST/tertiary=`-1` `#fbbb3b`; additional=`-2` `#ef8736`; line=`-5` `#ee4980`; neutral=`-7` `#e1e1e8`; positive `#115639`; negative `#da294b`; grid `#e1e1e8`; axis `#4b4b59`. Heat ramp: `#f6ebff`, `#e5c9f7`, `#cfa0ee`, `#b06fe0`, `#8a3fc9`, `#661f9e`. Grouped bars/show trend use qualitative-3 for minutes and qualitative-1 for percentage/households. Sankey uses primary, line pink and additional orange.

Tooltips are dark Fiber surfaces, portalled, max 320px/viewport-16px, 8px gap/edge, flip below, reposition on resize/ancestor scroll, and do not capture pointer.

## Drilldowns

Show bar/dropdown → in-card four-week dual-line detail; inherited state as above; All shows or view toggle returns. Radar parameter → in-card top-five detail; another parameter replaces it. Donut and genre are cross-filters, not drilldowns. No channel, heatmap, list-row or Sankey drilldown.

## Cross-KPI Interactions

Type syncs three platform tabs, scopes shows, shifts affinity, and constrains migration (Move to streaming app always targets Streaming). Genre constrains Shows and Behaviour. Affinity selection updates only its detail. Global/environment changes reset cross-filter selections. Channel/heatmap/Sankey hover never filters another card.

## Data Requirements

Known dimensions/metrics are exactly those in the KPI sections. Production source, refresh, identity, household weighting/deduplication, privacy thresholds, aggregation, denominators, taxonomy, aliases, classifications, benchmark, date/week/timezone/daypart logic, rounding/suppression, affinity and migration methodology all **Requires product/data clarification**. Synthetic `seeded/entityModel` logic is not a production specification.

| KPI | Known granularity/time/dependency | Confirmation required |
|---|---|---|
| Overview | one value per applied audience, date range and environment | metric aggregation, denominator and feed |
| Type | media type per applied audience/date/environment | minute aggregation and household estimate |
| Channel/App | channel/app within market and platform; top up to ten by minutes | inventory, aliases, share denominator and benchmark |
| Shows | show within platform/type/environment/genre; top ten by Index | show identity, `hhPct` meaning, share/reach denominator and benchmark |
| Genres | one row per rendered IAB genre within platform/type/environment | taxonomy governance, aggregation and share denominator |
| Show detail | selected show × Week 1–4 with inherited context | relationship between four weeks and global date range |
| Temporal | day × daypart within platform/channel/lookback | timezone, daypart boundaries and DoY/WoW definitions |
| Affinity | audience × parameter; selected parameter × top five shows | mapping, viewers, ranking, Index benchmark and feed |
| Behaviour | source show × behaviour × destination within one hour | cohort, attribution window, denominator, aggregation and migration rules |

## Design System Requirements

Use DM Sans, Fiber typography/spacing/surface/border/shadow/control tokens, MetricsTile, 4px SmartCards with 16px padding, searchable dropdowns, buttons, switch, rounded/underline tabs, chip, Info Alert, skeleton and empty state. Every chart is **Custom visualisation using Fiber design tokens**. Support dark tokens, keyboard selection, accessible names, non-colour cues, truncation and scrolling. No arbitrary chart palette.

## Responsive / States

Overview 2/3/6 columns; media card stacks then 20/80 at `lg`; Trends rows stack then align at `md`; affinity/behaviour stack then 3/7 at `lg`. Dropdown list max-height 220px. Exact framework breakpoints and production category virtualization: **Engineering decision required**.

Applied/global environment changes show tile loading and chart skeletons (~550ms prototype). Empty state uses illustration and contextual copy; Italy+Heavy is prototype-reachable. Export errors appear explicitly. Production API retry/partial errors: **Engineering decision required**.

## Functional Acceptance Criteria

- **Given** staged edits, **when** Apply is pressed, **then** every module updates and cross-filter selections reset.
- **Given** non-default applied filters, **when** Clear is pressed, **then** six filters return to defaults.
- **Given** either environment control, **when** changed, **then** its mirror and all modules update.
- **Given** Overview data, **when** the module renders, **then** all six exact metrics and the four applicable Index indicators use the documented formats and expose no chart interaction.
- **Given** the type donut, **when** an arc is hovered or clicked, or a legend row is hovered, focused or clicked, **then** the documented centre, dimming, tooltip and toggle behaviour appears.
- **Given** a type, **when** selected/cleared, **then** its chip and downstream scope/tabs synchronize or clear as documented.
- **Given** a Channel/App platform tab, **when** it changes, **then** up to ten valid destinations render with independent axes, the documented legend and exact tooltip, with no drilldown.
- **Given** Shows view, **when** platform/type/environment/genre changes, **then** the top-ten show universe, alert and dependent show options update consistently.
- **Given** Shows, **when** a show is selected, **then** four-week dual-axis detail opens; All shows returns.
- **Given** show detail, **when** a weekly point is hovered or focused, **then** both exact values and the dashed guide appear.
- **Given** Genres, **when** a genre is clicked, **then** its selected state toggles and the shared show/behaviour universe updates.
- **Given** Temporal platform changes, **when** a channel becomes invalid, **then** it resets to All.
- **Given** a Temporal cell, **when** hovered or focused, **then** both direct labels, selected outline and exact heat-intensity tooltip are available.
- **Given** a radar parameter, **when** clicked or Enter/Space activated, **then** rank/top-five update.
- **Given** a radar parameter, **when** hovered or focused, **then** its Index, interpretation and national baseline appear exactly as documented.
- **Given** a migration show, **when** selected, **then** source/subtitle/flows update.
- **Given** a Sankey ribbon, **when** hovered, **then** other ribbons dim and the exact path/share/drop/window tooltip appears; no click or keyboard interaction is implied.
- **Given** Export PDF, **when** activated, **then** the applied—not staged—context and rendered dashboard are exported with the documented header, exclusions, pagination and filename, while the button shows its busy state.
- **Given** loading, no-data or export-failure conditions represented by V5, **when** one occurs, **then** the corresponding documented skeleton, contextual empty state or inline error appears.
- **Given** narrow width, **when** a minimum-width chart overflows, **then** its region scrolls without clipping tooltip.
- **Given** Phase 1, **when** used, **then** no Comparison Mode control/state exists.

## Stakeholder Feedback Traceability

| Feedback | V5 solution | KPI / area affected | Status |
|---|---|---|---|
| Shared cards/merged type view | MetricsTile; one 20/80 SmartCard | Overview; Type; Channel/App | Incorporated |
| Addressable wording | All/Addressable rounded tabs | Global environment | Incorporated |
| Unlike metrics need distinct scales | independent dual axes | Channel/App; Shows; Genres; show detail | Incorporated |
| Trends as charts/dynamic dimensions | grouped bars + show/genre switch | Content viewership trends | Incorporated |
| Top-ten/show detail | alert, dependent dropdown, four-week lines | Shows | Incorporated |
| Better Index | arrows/explanation/radar rings | Overview; Channel/App; Trends; Affinity | Incorporated; suffix clarification |
| Dynamic temporal controls | platform-dependent inventory/reset | Temporal Insights | Incorporated |
| Hover/accessibility | portalled tooltips/focus labels | Rendered charts | Incorporated |
| Actionable affinity/Sankey | selected top-five; tokenized flows | Affinity; Behaviour | Incorporated |
| Comparison later | absent | Whole dashboard | Phase 2 |

## Out of Scope / Phase 2

**Comparison Mode is Phase 2**, including comparison controls, series, deltas, legends and tooltips. Also not delivered in rendered V5: the imported/unrendered Top N control and dead chart/list/table components; interaction for the displayed Advanced secondary-navigation label; unrendered drilldowns; and prototype collaboration/version tooling as production product features.

## Implementation Checklist

- **Product:** approve scope/personas/stories/clarifications.
- **Data:** contract every metric/dimension/benchmark/classification/date and relationship.
- **UX/UI:** build wrapper, six cards, controls, detail/state/responsive/theme behaviour.
- **Data visualisation:** exact charts, axes, labels, legends, tooltips, colours and accessibility.
- **Engineering:** staged/applied state, dependencies/resets, cross-KPI chain, PDF, represented errors, responsive/accessibility behaviour and tests; production API, caching and performance architecture is **Engineering decision required**.

## Open Questions / Clarifications

Target roles; feeds/SLAs; every metric denominator; show secondary meaning; Index `%` suffix; non-UK Mosaic; addressable classification; date-vs-week/DoY/WoW; affinity mapping; genre→affinity discrepancy; and migration methodology: **Requires product/data clarification**. Persistence, API retry/partial states, exact breakpoints, browser support and performance limits: **Engineering decision required**.

## Final V5 Cross-Check

- [x] Overview: six tiles.
- [x] Media type: DonutChart + DualAxisBarChart.
- [x] Trends: two ComboChart variants + ShowTrendChart.
- [x] TemporalHeatmap.
- [x] RadarChart + rendered top-five list.
- [x] MigrationSankey.
- [x] Every rendered global/local control, dependency, state, tooltip, wrapper and export.
- [x] Dead components excluded/discrepancies flagged.
- [x] Comparison Mode retained in Phase 2.
# TV Audience & Content Planner — Phase 1 Functional Requirements

**Status:** Production handoff derived from live V5  
**Route:** `/tv-audience-intelligence`  
**Phase boundary:** Phase 1 only. **Comparison Mode remains Phase 2.**

## Executive Summary

V5 is a single-page audience-led dashboard for defining a TV audience, understanding its scale and consumption, discovering platforms/channels/apps and content, inspecting temporal patterns and affinity, and viewing one-hour post-show migration. This specification covers only rendered V5 functionality. Prototype values are deterministic synthetic data, not a production feed. Unknowns use **Requires product/data clarification** or **Engineering decision required**.

## Product Scope

### Purpose, users, goals and use cases

The product supports users who need to: define a market/audience; quantify scale, volume and reach; compare Linear TV, Streaming and FAST; find channels/apps, shows and genres; inspect a show’s four-week trend; find day/daypart concentrations; identify affinity against the national average; inspect post-show behaviour; and export the applied view. V5 does not name personas or permissions: **Requires product/data clarification**.

### Phase 1 Scope

- Standalone Reports wrapper and one dashboard screen.
- Six staged global filters, Apply/Clear, immediate All/Addressable control, PDF export.
- Six Overview metrics.
- Six rendered SmartCards and all rendered visualisations/interactions/states.
- Cross-filtering, dependent controls, show/affinity details, responsive and accessible behaviour.

### User journey

Open Standard Reports → stage audience/date values → Apply → read Overview → select environment/type → inspect channel/app and show/genre performance → open show detail → inspect Temporal Insights → select an affinity parameter → select a migration source → export PDF.

The rendered page heading is **TV Audience & Content Planner**, with subtitle **Cross-platform content and audience consumption insights**.

## Dashboard Architecture

Order: title/subtitle; sticky global filters; **Overview**; All/Addressable; **TV viewership by media type** (Consumption by Type + Time Spent by Channel/App); **Content viewership trends**; mirrored All/Addressable; **Temporal Insights**; responsive **Content affinity** + **TV user behaviour**; notes.

Primary navigation is 64px, Reports active, with Intelligence/Audiences/Creatives/Campaigns displayed; full menu at ≥1024px and collapsed Reports menu below. Theme toggle and JS/Pro avatar are right. Secondary navigation is 56px: Standard active/link; Advanced inert. Header auto-hides/floats after scroll and is revealed by top hover/focus. Canvas max-width is 1440px. Prototype version/comment/annotation overlays are tooling, not product scope.

State hierarchy is staged filters → applied filters → immediate environment → optional consumption scope → module-local state. Applied global/environment changes clear type, genre, affinity, show and migration selections and show skeletons. A type selection synchronizes Channel, Trends and Temporal platform tabs and resets Temporal channel to All.

## Global Filters

All are searchable. Single-select closes after selection; multi-select stays open; search is case-insensitive; no result says “No matches.” Empty multi-selection means inclusive All.

| Filter | Exact options | Default | Behaviour |
|---|---|---|---|
| Country | United Kingdom, Germany, France, Italy, Spain | United Kingdom | All modules after Apply; determines linear inventory/commercial rules |
| Mosaic group | All Mosaic groups; City Prosperity; Prestige Positions; Country Living; Suburban Stability; Rental Hubs; Vintage Value | All Mosaic groups (empty) | All modules after Apply; All clears specifics |
| Age & gender | All genders, Male, Female × 16–24, 25–34, 35–44, 45–54, 55–64, 65+ (18) | All ages & genders (empty) | All modules after Apply |
| TV consumption | All viewers, Heavy TV, Medium TV, Light TV | All viewers | All modules after Apply |
| Children | All households; No children; Children 0–4; Children 5–11; Children 12–17 | All households (empty) | All modules after Apply; All clears specifics |
| Date range | Last 7 days; Last 15 days; Last 30 days; Last 60 days | Last 30 days | All modules after Apply |

Mosaic is rendered in all countries despite being described in code as UK-granular: **Requires product/data clarification**.

Edits are staged until Apply. Initially Apply is disabled. Pending edits enable Apply and do not affect KPIs/PDF. After non-default values are applied, the action becomes Clear all filters; Clear restores six defaults, but not environment/local tabs.

**All / Addressable channels** defaults All, updates immediately, appears twice with one synchronized state, and affects every module. Addressable excludes/reweights market-specific non-commercial inventory. Production classification: **Requires product/data clarification**.

**Export PDF** is immediate and always uses the applied filter/environment state, not un-applied draft values. While exporting, the outline button reads “Exporting…” and is disabled. The export is a paginated portrait A4 capture of the dashboard; the sticky filter bar and prototype overlays are omitted and replaced by a header containing the title, all six applied filter values, viewing environment, export date/time and the synthetic-data notice. The filename is `tv-audience-content-planner-{lowercase market code}-{YYYY-MM-DD}.pdf`. A failure is announced inline as `Export failed: {message}` or “Export failed — please try again.”

## Local Filters

| Module | Control; exact options | Default/dependency/effect |
|---|---|---|
| Type | clickable Linear TV, Streaming, FAST donut/legend | None; click again/removable chip clears; scopes downstream |
| Channel/App | Linear TV, Streaming, Fast tabs | Linear TV; synced by type; changes market inventory |
| Trends | View by show/genre switch | Shows; switching clears show |
| Trends | Linear TV, Streaming, Fast | Linear; synced by type; filters shows/reweights genres |
| Shows | All shows + unique valid shows | All; options depend on platform/type/environment/genre; selection opens detail |
| Genres | 12 rendered genre marks | None; selection toggles and restricts shared show universe |
| Temporal | platform tabs; All channels/apps + valid inventory; 7-day (DoY), 15-day (DoY), 30-day (WoW), 60-day (WoW) | Linear; All; 30-day WoW. Platform rebuilds channels; invalid channel resets All |
| Affinity | FOOD, TRAVEL, COMEDY, DOCUMENTARY, NEWS, MUSIC, LIFESTYLE, SPORTS | current highest Index; updates rank/top-five |
| Behaviour | All shows + valid scoped shows | All resolves to top-indexing show |

The data module’s `TOP_N` options and the `GenreBars`, `ShowsTable`, and `AffinityList` components exist but are not rendered; they are not delivered features. `LOOKBACK` is rendered only as the Temporal Insights lookback control.

## Filter Interaction Matrix

| Filter | Overview | Type | Channel | Trends | Temporal | Affinity | Behaviour |
|---|---:|---:|---:|---:|---:|---:|---:|
| Six applied global filters | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| All/Addressable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Type selection | — | selected | sync | sync/scope | sync | scope | scope |
| Genre selection | — | — | — | show universe | — | —* | shared show universe |
| Module-local controls | — | — | local | local | local | local detail | local |

\* Comments claim genre anchors affinity, but live affinity calculation ignores `selectedGenre`: **Requires product/data clarification**.

## KPI Requirements

### Overview

**User story:** As a dashboard user, I want a concise audience summary so that I can understand its scale and activity before exploring detail. **Business question:** how large and active is the audience?

Six Fiber MetricsTiles: **Total households** (K/M); **Total minutes viewed** (K/M); **Avg. weekly TV consumption – Streaming** (`mins`, Index); **Avg linear TV consumption** (`min/wk`, Index); **Avg. channels/apps per hh** (one decimal, Index); **Weekly TV reach** (`% of hh`, Index). Dimension: applied audience and viewing environment. No click, chart legend or tooltip. Source/calculations: **Requires product/data clarification**.

### Consumption by Type

**User story:** As a dashboard user, I want the viewing mix by media type so that I can choose the environment to investigate downstream. **Business question:** what share of minutes is Linear TV, Streaming or FAST?

Metric: share of viewing minutes, with estimated minutes per household as support. Dimension: media type. Visualisation: 200px donut (r78, stroke30), proportional share %. The clickable legend maps Linear TV to qualitative-4 purple, Streaming to qualitative-3 purple and FAST to qualitative-1 yellow, and shows each type’s one-decimal share. Centre defaults “Share of viewing”; hover or selection shows rounded share/name. Hover thickens the active arc by 4px and dims others to 35%. Arc tooltip: type; `Legend: Share of viewing`; share to one decimal; estimated integer minutes/hh. Legend tooltip omits the `Legend` line and otherwise shows the same metrics. Clicking an arc or legend row toggles the downstream type scope; the removable card chip is an equivalent clear action.

### Time Spent by Channel/App

**User story:** As a dashboard user, I want channel/app consumption ranked within a platform so that I can identify important destinations. **Business question:** which destinations matter?

Metrics: average minutes/week, share of watch time and Index. Dimension: channel/app within the selected Linear TV, Streaming or Fast tab. Up to ten destinations are shown, sorted by minutes, as grouped vertical bars. X=channel/app, >12 chars truncates to 11+ellipsis, supporting `Index N%`. Left Y=Avg min/week, five dynamic integer ticks; right Y=% of watch time, five percent ticks. The two-item legend maps minutes to qualitative-3 purple and percentage to qualitative-1 yellow. Tooltip is exactly: channel/app; `Index: N%`; `Highlight: {Index interpretation}`; `Avg min/week: {integer}`; `% of watch time: {one decimal}%`. Hover/focus dims other categories and applies a category wash. Minimum width 680px with horizontal scroll. No drilldown.

### Content Viewership Trends — Shows

**User story:** As a dashboard user, I want the highest-indexing shows for my audience so that I can inspect a relevant title. **Business question:** which ten shows index highest?

Metrics: average minutes/household, rendered `% of total watch time`, and Index supporting text. Dimension: show, constrained by platform/type/environment/genre. Grouped bars are sorted by Index. X=show + supporting `Index N%`; left Y=Avg min/HH; right Y=`% of total watch time`; independent five-tick scales. The legend maps average minutes/household to qualitative-3 purple and `% of total watch time` to qualitative-1 yellow; no line or Index legend is rendered. Tooltip is exactly: show; `Index: N%`; `Avg min / household: {integer} min`; `% of total watch time: {one decimal}%`. It does **not** include an Index interpretation. Click/category or dependent dropdown opens detail. Alert states top 10/platform. Empty title is “No shows match”; message is “No shows match these filters — change the genre filter or viewing scope.” Data property is `hhPct`/commented household reach but UI says watch time: **Requires product/data clarification**.

### Content Viewership Trends — Genres

**User story:** As a dashboard user, I want genre consumption and Index indicators so that I can constrain the show universe. **Business question:** which IAB genres matter?

Metrics: average minutes/week, share of watch time and Index supporting text. Dimension options: Comedy, News, Film, Sports, Drama, Reality, Action, Documentary, Kids, Travel, Food, Home improvement. The same grouped-bar encoding uses left Y=Avg min/week and right Y=Watch time (%), with independent five-tick scales. The legend maps average minutes/week to qualitative-3 purple and share of watch time to qualitative-1 yellow. X labels show genre plus `Index N%`. Tooltip is exactly: genre; `Index: N%`; `Avg minutes / week: {integer} min`; `Share of watch time: {one decimal}%`; it does not include Index interpretation. Click toggles genre selection and the selected category is exposed as pressed. No direct affinity update occurs in live code.

### Selected Show Consumption Over Time

**User story:** As a dashboard user, I want a selected show’s recent consumption trend so that I can understand its weekly movement. **Business question:** how did audience consumption and households watching change across four weeks?

Four-week dual-line detail. X=Week 1–4; left Y=Avg mins/hh; right Y=Households formatted M; five ticks, maxima 115% of data. Legend: Households watching=qualitative-1 yellow; Avg. minutes watched per household=qualitative-3 purple. Hover/focus shows a dashed vertical guide and tooltip: week; `Households watching: {integer}`; `Avg. minutes / household: {integer}`. Inherits all filters, environment, type, genre and Trends platform. All shows returns; another show switches detail. Relation to Date range: **Requires product/data clarification**.

### Temporal Insights

**User story:** As a dashboard user, I want audience concentration by day and daypart so that I can identify strong viewing windows. **Business question:** when does this audience watch?

Metrics: average minutes watched per household and percentage of households watching. Dimensions: day of week × daypart. The 7×6 heatmap has rows Mon–Sun and columns Early AM, Morning, Daytime, Afternoon, Primetime, Late Night. Each cell directly shows `{minutes}m` and household percentage to one decimal. Tooltip is exactly: `{day} · {daypart}`; `Avg minutes/hh: {minutes}m`; `% households: {one decimal}%`; `Heat intensity: N of 6 (low → high minutes)`. Six-step brand ramp encodes minutes; legend is `Low` → six swatches → `High` · `avg mins watched per household`. Hover/focus adds a selected outline; there is no click. Minimum width 720px with horizontal scroll. DoY/WoW definition: **Requires product/data clarification**.

### Content Affinity

**User story:** As a dashboard user, I want affinity against the national average so that I can identify the audience’s strongest content/lifestyle parameter and related shows. **Business question:** where does this audience over- or under-index, and which shows are associated with the selected parameter?

Metric: Index; detail metrics are viewers and show Index. Dimensions: eight fixed parameters and their mapped shows. Eight-axis radar, Index 0–200, numeric rings 50/100/150/200, dashed national baseline 100, unfilled qualitative-4 primary polygon. Tooltip is exactly: parameter; `Index: N`; `Highlight: {Index interpretation}`; `Baseline: National average = 100`. Pointer and Enter/Space select; selected label is bold/underlined and vertex enlarged. Default is highest Index. Supporting text states “Dashed ring = national average (100). Select a parameter to view its details.” Live detail says `{PARAMETER} — top 5 shows`, `Selected parameter · rank N of 8`, then viewer-ranked rows with list rank, compact viewers and `{index} idx`; rows are not clickable. Taxonomy/mapping/ranking/feed: **Requires product/data clarification**.

### TV User Behaviour

**User story:** As a dashboard user, I want to see post-show migration so that I can understand the audience’s next behaviour and destination. **Business question:** where do source-show viewers go within one hour?

Metric: flow share; supporting calculation displayed as drop from source. Dimensions: source show/network → behaviour → destination show/network or Other/stopped. Custom Sankey uses the top three behaviours from Stay on same channel/Switch channel/Move to streaming app/Stop watching; targets are the two strongest show · network destinations plus Other / stopped watching. “From” and “To” label the columns. Ribbon width=flow share; hover raises the ribbon opacity and dims others. Tooltip is exactly: `{behaviour} → {destination}`; `Flow share: {one decimal}%`; `Drop from source: {100 − flow share, one decimal}%`; `Window: Within 1 hour`. Show filter changes source/subtitle/flows; paths have hover but no keyboard focus, click or drilldown. Minimum 560px with horizontal scroll. A screen-reader-only list exposes every flow, and visible supporting copy identifies the source show/network and width meaning. Cohort, denominator and migration rules: **Requires product/data clarification**.

## KPI Visualisation Matrix

| KPI | User question | Primary metric | Secondary metric | Dimension | Chart | Filters | Drilldown |
|---|---|---|---|---|---|---|---|
| Overview | How large/active is the audience? | six summary metrics | four indices | audience | tiles | global, environment | No |
| Type | What is the viewing mix? | share % | estimated minutes/hh | TV type | donut | global, environment | cross-filter |
| Channel | Which destinations matter? | avg min/week | share, Index | channel/app | dual-axis bars | global, environment, type/tab | No |
| Shows | Which shows index highest? | avg min/hh | rendered share, Index | show | grouped bars | global, environment, type, platform, genre | show detail |
| Genres | Which genres matter? | avg min/week | share, Index | genre | grouped bars | global, environment, type, platform | cross-filter |
| Show detail | How does the show move weekly? | avg min/hh | households | week | dual-axis lines | inherited Shows filters | in-card detail |
| Temporal | When does the audience watch? | avg min/hh | % households | day×daypart | heatmap | global, environment, type/platform, channel/app, lookback | No |
| Affinity | Where does the audience index? | Index | viewers/show Index | parameter/show | radar+list | global, environment, type | in-card parameter detail |
| Behaviour | Where do viewers go next? | flow share | drop from source | migration path | Sankey | global, environment, type, genre, show | No |

## Chart Variations and States

- **Default:** UK/all-audience/last-30-days, All environment, no consumption type or genre selected; Linear TV tabs, Shows view, Temporal All channels/apps and 30-day (WoW); affinity detail resolves to the highest-index parameter; behaviour resolves All shows to the current top-indexing show.
- **Applied-filter/environment state:** all module data re-derives and loading skeletons precede the updated values; cross-filter/detail selections reset. Draft global edits do not alter charts.
- **Type-filtered state:** donut selection remains highlighted and a removable filter chip appears; Channel, Trends and Temporal tabs synchronize to that type, while Shows, genres, affinity and behaviour re-derive within scope. Clearing the type removes the scope but leaves platform tabs where the user last left them.
- **Alternative Trends dimension:** Shows displays the top-ten grouped chart and show dropdown; Genres displays all 12 genre groups and removes the show dropdown/alert. Toggling the switch clears show detail.
- **Show-detail state:** selecting a show replaces the grouped show chart with its four-week dual-line detail and dependent show selector.
- **Temporal alternatives:** platform changes rebuild the channel/app options; channel/app and lookback changes re-derive heatmap cells.
- **Affinity detail state:** selecting a radar parameter replaces the parameter/rank and top-five detail in place.
- **Behaviour source state:** selecting a show changes the subtitle, source copy and Sankey flows.
- **Loading/empty/error:** module skeletons, contextual empty states and inline PDF export error are as specified in Responsive / States. No Phase 1 comparison state exists.

## Chart Specifications

Index 100=national average; 150=50% above. It is not minutes or viewing percentage. Badges use arrow/text plus green/red/neutral. Radar explicitly shows baseline. Channel/show/genre currently append `%` to Index, conflicting with semantics: **Requires product/data clarification**.

Rendered mappings: Linear/primary=`--datavis-qualitative-4` `#7c33b5`; Streaming/secondary=`-3` `#a857e5`; FAST/tertiary=`-1` `#fbbb3b`; additional=`-2` `#ef8736`; line=`-5` `#ee4980`; neutral=`-7` `#e1e1e8`; positive `#115639`; negative `#da294b`; grid `#e1e1e8`; axis `#4b4b59`. Heat ramp: `#f6ebff`, `#e5c9f7`, `#cfa0ee`, `#b06fe0`, `#8a3fc9`, `#661f9e`. Grouped bars/show trend use qualitative-3 for minutes and qualitative-1 for percentage/households. Sankey uses primary, line pink and additional orange.

Tooltips are dark Fiber surfaces, portalled, max 320px/viewport-16px, 8px gap/edge, flip below, reposition on resize/ancestor scroll, and do not capture pointer.

## Drilldowns

Show bar/dropdown → in-card four-week dual-line detail; inherited state as above; All shows or view toggle returns. Radar parameter → in-card top-five detail; another parameter replaces it. Donut and genre are cross-filters, not drilldowns. No channel, heatmap, list-row or Sankey drilldown.

## Cross-KPI Interactions

Type syncs three platform tabs, scopes shows, shifts affinity, and constrains migration (Move to streaming app always targets Streaming). Genre constrains Shows and Behaviour. Affinity selection updates only its detail. Global/environment changes reset cross-filter selections. Channel/heatmap/Sankey hover never filters another card.

## Data Requirements

Known dimensions/metrics are exactly those in the KPI sections. Production source, refresh, identity, household weighting/deduplication, privacy thresholds, aggregation, denominators, taxonomy, aliases, classifications, benchmark, date/week/timezone/daypart logic, rounding/suppression, affinity and migration methodology all **Requires product/data clarification**. Synthetic `seeded/entityModel` logic is not a production specification.

| KPI | Known granularity/time/dependency | Confirmation required |
|---|---|---|
| Overview | one value per applied audience, date range and environment | metric aggregation, denominator and feed |
| Type | media type per applied audience/date/environment | minute aggregation and household estimate |
| Channel/App | channel/app within market and platform; top up to ten by minutes | inventory, aliases, share denominator and benchmark |
| Shows | show within platform/type/environment/genre; top ten by Index | show identity, `hhPct` meaning, share/reach denominator and benchmark |
| Genres | one row per rendered IAB genre within platform/type/environment | taxonomy governance, aggregation and share denominator |
| Show detail | selected show × Week 1–4 with inherited context | relationship between four weeks and global date range |
| Temporal | day × daypart within platform/channel/lookback | timezone, daypart boundaries and DoY/WoW definitions |
| Affinity | audience × parameter; selected parameter × top five shows | mapping, viewers, ranking, Index benchmark and feed |
| Behaviour | source show × behaviour × destination within one hour | cohort, attribution window, denominator, aggregation and migration rules |

## Design System Requirements

Use DM Sans, Fiber typography/spacing/surface/border/shadow/control tokens, MetricsTile, 4px SmartCards with 16px padding, searchable dropdowns, buttons, switch, rounded/underline tabs, chip, Info Alert, skeleton and empty state. Every chart is **Custom visualisation using Fiber design tokens**. Support dark tokens, keyboard selection, accessible names, non-colour cues, truncation and scrolling. No arbitrary chart palette.

## Responsive / States

Overview 2/3/6 columns; media card stacks then 20/80 at `lg`; Trends rows stack then align at `md`; affinity/behaviour stack then 3/7 at `lg`. Dropdown list max-height 220px. Exact framework breakpoints and production category virtualization: **Engineering decision required**.

Applied/global environment changes show tile loading and chart skeletons (~550ms prototype). Empty state uses illustration and contextual copy; Italy+Heavy is prototype-reachable. Export errors appear explicitly. Production API retry/partial errors: **Engineering decision required**.

## Functional Acceptance Criteria

- **Given** staged edits, **when** Apply is pressed, **then** every module updates and cross-filter selections reset.
- **Given** non-default applied filters, **when** Clear is pressed, **then** six filters return to defaults.
- **Given** either environment control, **when** changed, **then** its mirror and all modules update.
- **Given** Overview data, **when** the module renders, **then** all six exact metrics and the four applicable Index indicators use the documented formats and expose no chart interaction.
- **Given** the type donut, **when** an arc is hovered or clicked, or a legend row is hovered, focused or clicked, **then** the documented centre, dimming, tooltip and toggle behaviour appears.
- **Given** a type, **when** selected/cleared, **then** its chip and downstream scope/tabs synchronize or clear as documented.
- **Given** a Channel/App platform tab, **when** it changes, **then** up to ten valid destinations render with independent axes, the documented legend and exact tooltip, with no drilldown.
- **Given** Shows view, **when** platform/type/environment/genre changes, **then** the top-ten show universe, alert and dependent show options update consistently.
- **Given** Shows, **when** a show is selected, **then** four-week dual-axis detail opens; All shows returns.
- **Given** show detail, **when** a weekly point is hovered or focused, **then** both exact values and the dashed guide appear.
- **Given** Genres, **when** a genre is clicked, **then** its selected state toggles and the shared show/behaviour universe updates.
- **Given** Temporal platform changes, **when** a channel becomes invalid, **then** it resets to All.
- **Given** a Temporal cell, **when** hovered or focused, **then** both direct labels, selected outline and exact heat-intensity tooltip are available.
- **Given** a radar parameter, **when** clicked or Enter/Space activated, **then** rank/top-five update.
- **Given** a radar parameter, **when** hovered or focused, **then** its Index, interpretation and national baseline appear exactly as documented.
- **Given** a migration show, **when** selected, **then** source/subtitle/flows update.
- **Given** a Sankey ribbon, **when** hovered, **then** other ribbons dim and the exact path/share/drop/window tooltip appears; no click or keyboard interaction is implied.
- **Given** Export PDF, **when** activated, **then** the applied—not staged—context and rendered dashboard are exported with the documented header, exclusions, pagination and filename, while the button shows its busy state.
- **Given** loading, no-data or export-failure conditions represented by V5, **when** one occurs, **then** the corresponding documented skeleton, contextual empty state or inline error appears.
- **Given** narrow width, **when** a minimum-width chart overflows, **then** its region scrolls without clipping tooltip.
- **Given** Phase 1, **when** used, **then** no Comparison Mode control/state exists.

## Stakeholder Feedback Traceability

| Feedback | V5 solution | KPI / area affected | Status |
|---|---|---|---|
| Shared cards/merged type view | MetricsTile; one 20/80 SmartCard | Overview; Type; Channel/App | Incorporated |
| Addressable wording | All/Addressable rounded tabs | Global environment | Incorporated |
| Unlike metrics need distinct scales | independent dual axes | Channel/App; Shows; Genres; show detail | Incorporated |
| Trends as charts/dynamic dimensions | grouped bars + show/genre switch | Content viewership trends | Incorporated |
| Top-ten/show detail | alert, dependent dropdown, four-week lines | Shows | Incorporated |
| Better Index | arrows/explanation/radar rings | Overview; Channel/App; Trends; Affinity | Incorporated; suffix clarification |
| Dynamic temporal controls | platform-dependent inventory/reset | Temporal Insights | Incorporated |
| Hover/accessibility | portalled tooltips/focus labels | Rendered charts | Incorporated |
| Actionable affinity/Sankey | selected top-five; tokenized flows | Affinity; Behaviour | Incorporated |
| Comparison later | absent | Whole dashboard | Phase 2 |

## Out of Scope / Phase 2

**Comparison Mode is Phase 2**, including comparison controls, series, deltas, legends and tooltips. Also not delivered in rendered V5: the imported/unrendered Top N control and dead chart/list/table components; interaction for the displayed Advanced secondary-navigation label; unrendered drilldowns; and prototype collaboration/version tooling as production product features.

## Implementation Checklist

- **Product:** approve scope/personas/stories/clarifications.
- **Data:** contract every metric/dimension/benchmark/classification/date and relationship.
- **UX/UI:** build wrapper, six cards, controls, detail/state/responsive/theme behaviour.
- **Data visualisation:** exact charts, axes, labels, legends, tooltips, colours and accessibility.
- **Engineering:** staged/applied state, dependencies/resets, cross-KPI chain, PDF, represented errors, responsive/accessibility behaviour and tests; production API, caching and performance architecture is **Engineering decision required**.

## Open Questions / Clarifications

Target roles; feeds/SLAs; every metric denominator; show secondary meaning; Index `%` suffix; non-UK Mosaic; addressable classification; date-vs-week/DoY/WoW; affinity mapping; genre→affinity discrepancy; and migration methodology: **Requires product/data clarification**. Persistence, API retry/partial states, exact breakpoints, browser support and performance limits: **Engineering decision required**.

## Final V5 Cross-Check

- [x] Overview: six tiles.
- [x] Media type: DonutChart + DualAxisBarChart.
- [x] Trends: two ComboChart variants + ShowTrendChart.
- [x] TemporalHeatmap.
- [x] RadarChart + rendered top-five list.
- [x] MigrationSankey.
- [x] Every rendered global/local control, dependency, state, tooltip, wrapper and export.
- [x] Dead components excluded/discrepancies flagged.
- [x] Comparison Mode retained in Phase 2.
# TV Audience & Content Planner — Phase 1 Functional Requirements

**Status:** Production handoff derived from live V5  
**Route:** `/tv-audience-intelligence`  
**Phase boundary:** Phase 1 only. **Comparison Mode remains Phase 2.**

## Executive Summary

V5 is a single-page audience-led dashboard for defining a TV audience, understanding its scale and consumption, discovering platforms/channels/apps and content, inspecting temporal patterns and affinity, and viewing one-hour post-show migration. This specification covers only rendered V5 functionality. Prototype values are deterministic synthetic data, not a production feed. Unknowns use **Requires product/data clarification** or **Engineering decision required**.

## Product Scope

### Purpose, users, goals and use cases

The product supports users who need to: define a market/audience; quantify scale, volume and reach; compare Linear TV, Streaming and FAST; find channels/apps, shows and genres; inspect a show’s four-week trend; find day/daypart concentrations; identify affinity against the national average; inspect post-show behaviour; and export the applied view. V5 does not name personas or permissions: **Requires product/data clarification**.

### Phase 1 Scope

- Standalone Reports wrapper and one dashboard screen.
- Six staged global filters, Apply/Clear, immediate All/Addressable control, PDF export.
- Six Overview metrics.
- Six rendered SmartCards and all rendered visualisations/interactions/states.
- Cross-filtering, dependent controls, show/affinity details, responsive and accessible behaviour.

### User journey

Open Standard Reports → stage audience/date values → Apply → read Overview → select environment/type → inspect channel/app and show/genre performance → open show detail → inspect Temporal Insights → select an affinity parameter → select a migration source → export PDF.

The rendered page heading is **TV Audience & Content Planner**, with subtitle **Cross-platform content and audience consumption insights**.

## Dashboard Architecture

Order: title/subtitle; sticky global filters; **Overview**; All/Addressable; **TV viewership by media type** (Consumption by Type + Time Spent by Channel/App); **Content viewership trends**; mirrored All/Addressable; **Temporal Insights**; responsive **Content affinity** + **TV user behaviour**; notes.

Primary navigation is 64px, Reports active, with Intelligence/Audiences/Creatives/Campaigns displayed; full menu at ≥1024px and collapsed Reports menu below. Theme toggle and JS/Pro avatar are right. Secondary navigation is 56px: Standard active/link; Advanced inert. Header auto-hides/floats after scroll and is revealed by top hover/focus. Canvas max-width is 1440px. Prototype version/comment/annotation overlays are tooling, not product scope.

State hierarchy is staged filters → applied filters → immediate environment → optional consumption scope → module-local state. Applied global/environment changes clear type, genre, affinity, show and migration selections and show skeletons. A type selection synchronizes Channel, Trends and Temporal platform tabs and resets Temporal channel to All.

## Global Filters

All are searchable. Single-select closes after selection; multi-select stays open; search is case-insensitive; no result says “No matches.” Empty multi-selection means inclusive All.

| Filter | Exact options | Default | Behaviour |
|---|---|---|---|
| Country | United Kingdom, Germany, France, Italy, Spain | United Kingdom | All modules after Apply; determines linear inventory/commercial rules |
| Mosaic group | All Mosaic groups; City Prosperity; Prestige Positions; Country Living; Suburban Stability; Rental Hubs; Vintage Value | All Mosaic groups (empty) | All modules after Apply; All clears specifics |
| Age & gender | All genders, Male, Female × 16–24, 25–34, 35–44, 45–54, 55–64, 65+ (18) | All ages & genders (empty) | All modules after Apply |
| TV consumption | All viewers, Heavy TV, Medium TV, Light TV | All viewers | All modules after Apply |
| Children | All households; No children; Children 0–4; Children 5–11; Children 12–17 | All households (empty) | All modules after Apply; All clears specifics |
| Date range | Last 7 days; Last 15 days; Last 30 days; Last 60 days | Last 30 days | All modules after Apply |

Mosaic is rendered in all countries despite being described in code as UK-granular: **Requires product/data clarification**.

Edits are staged until Apply. Initially Apply is disabled. Pending edits enable Apply and do not affect KPIs/PDF. After non-default values are applied, the action becomes Clear all filters; Clear restores six defaults, but not environment/local tabs.

**All / Addressable channels** defaults All, updates immediately, appears twice with one synchronized state, and affects every module. Addressable excludes/reweights market-specific non-commercial inventory. Production classification: **Requires product/data clarification**.

**Export PDF** is immediate and always uses the applied filter/environment state, not un-applied draft values. While exporting, the outline button reads “Exporting…” and is disabled. The export is a paginated portrait A4 capture of the dashboard; the sticky filter bar and prototype overlays are omitted and replaced by a header containing the title, all six applied filter values, viewing environment, export date/time and the synthetic-data notice. The filename is `tv-audience-content-planner-{lowercase market code}-{YYYY-MM-DD}.pdf`. A failure is announced inline as `Export failed: {message}` or “Export failed — please try again.”

## Local Filters

| Module | Control; exact options | Default/dependency/effect |
|---|---|---|
| Type | clickable Linear TV, Streaming, FAST donut/legend | None; click again/removable chip clears; scopes downstream |
| Channel/App | Linear TV, Streaming, Fast tabs | Linear TV; synced by type; changes market inventory |
| Trends | View by show/genre switch | Shows; switching clears show |
| Trends | Linear TV, Streaming, Fast | Linear; synced by type; filters shows/reweights genres |
| Shows | All shows + unique valid shows | All; options depend on platform/type/environment/genre; selection opens detail |
| Genres | 12 rendered genre marks | None; selection toggles and restricts shared show universe |
| Temporal | platform tabs; All channels/apps + valid inventory; 7-day (DoY), 15-day (DoY), 30-day (WoW), 60-day (WoW) | Linear; All; 30-day WoW. Platform rebuilds channels; invalid channel resets All |
| Affinity | FOOD, TRAVEL, COMEDY, DOCUMENTARY, NEWS, MUSIC, LIFESTYLE, SPORTS | current highest Index; updates rank/top-five |
| Behaviour | All shows + valid scoped shows | All resolves to top-indexing show |

The data module’s `TOP_N` options and the `GenreBars`, `ShowsTable`, and `AffinityList` components exist but are not rendered; they are not delivered features. `LOOKBACK` is rendered only as the Temporal Insights lookback control.

## Filter Interaction Matrix

| Filter | Overview | Type | Channel | Trends | Temporal | Affinity | Behaviour |
|---|---:|---:|---:|---:|---:|---:|---:|
| Six applied global filters | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| All/Addressable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Type selection | — | selected | sync | sync/scope | sync | scope | scope |
| Genre selection | — | — | — | show universe | — | —* | shared show universe |
| Module-local controls | — | — | local | local | local | local detail | local |

\* Comments claim genre anchors affinity, but live affinity calculation ignores `selectedGenre`: **Requires product/data clarification**.

## KPI Requirements

### Overview

**User story:** As a dashboard user, I want a concise audience summary so that I can understand its scale and activity before exploring detail. **Business question:** how large and active is the audience?

Six Fiber MetricsTiles: **Total households** (K/M); **Total minutes viewed** (K/M); **Avg. weekly TV consumption – Streaming** (`mins`, Index); **Avg linear TV consumption** (`min/wk`, Index); **Avg. channels/apps per hh** (one decimal, Index); **Weekly TV reach** (`% of hh`, Index). Dimension: applied audience and viewing environment. No click, chart legend or tooltip. Source/calculations: **Requires product/data clarification**.

### Consumption by Type

**User story:** As a dashboard user, I want the viewing mix by media type so that I can choose the environment to investigate downstream. **Business question:** what share of minutes is Linear TV, Streaming or FAST?

Metric: share of viewing minutes, with estimated minutes per household as support. Dimension: media type. Visualisation: 200px donut (r78, stroke30), proportional share %. The clickable legend maps Linear TV to qualitative-4 purple, Streaming to qualitative-3 purple and FAST to qualitative-1 yellow, and shows each type’s one-decimal share. Centre defaults “Share of viewing”; hover or selection shows rounded share/name. Hover thickens the active arc by 4px and dims others to 35%. Arc tooltip: type; `Legend: Share of viewing`; share to one decimal; estimated integer minutes/hh. Legend tooltip omits the `Legend` line and otherwise shows the same metrics. Clicking an arc or legend row toggles the downstream type scope; the removable card chip is an equivalent clear action.

### Time Spent by Channel/App

**User story:** As a dashboard user, I want channel/app consumption ranked within a platform so that I can identify important destinations. **Business question:** which destinations matter?

Metrics: average minutes/week, share of watch time and Index. Dimension: channel/app within the selected Linear TV, Streaming or Fast tab. Up to ten destinations are shown, sorted by minutes, as grouped vertical bars. X=channel/app, >12 chars truncates to 11+ellipsis, supporting `Index N%`. Left Y=Avg min/week, five dynamic integer ticks; right Y=% of watch time, five percent ticks. The two-item legend maps minutes to qualitative-3 purple and percentage to qualitative-1 yellow. Tooltip is exactly: channel/app; `Index: N%`; `Highlight: {Index interpretation}`; `Avg min/week: {integer}`; `% of watch time: {one decimal}%`. Hover/focus dims other categories and applies a category wash. Minimum width 680px with horizontal scroll. No drilldown.

### Content Viewership Trends — Shows

**User story:** As a dashboard user, I want the highest-indexing shows for my audience so that I can inspect a relevant title. **Business question:** which ten shows index highest?

Metrics: average minutes/household, rendered `% of total watch time`, and Index supporting text. Dimension: show, constrained by platform/type/environment/genre. Grouped bars are sorted by Index. X=show + supporting `Index N%`; left Y=Avg min/HH; right Y=`% of total watch time`; independent five-tick scales. The legend maps average minutes/household to qualitative-3 purple and `% of total watch time` to qualitative-1 yellow; no line or Index legend is rendered. Tooltip is exactly: show; `Index: N%`; `Avg min / household: {integer} min`; `% of total watch time: {one decimal}%`. It does **not** include an Index interpretation. Click/category or dependent dropdown opens detail. Alert states top 10/platform. Empty title is “No shows match”; message is “No shows match these filters — change the genre filter or viewing scope.” Data property is `hhPct`/commented household reach but UI says watch time: **Requires product/data clarification**.

### Content Viewership Trends — Genres

**User story:** As a dashboard user, I want genre consumption and Index indicators so that I can constrain the show universe. **Business question:** which IAB genres matter?

Metrics: average minutes/week, share of watch time and Index supporting text. Dimension options: Comedy, News, Film, Sports, Drama, Reality, Action, Documentary, Kids, Travel, Food, Home improvement. The same grouped-bar encoding uses left Y=Avg min/week and right Y=Watch time (%), with independent five-tick scales. The legend maps average minutes/week to qualitative-3 purple and share of watch time to qualitative-1 yellow. X labels show genre plus `Index N%`. Tooltip is exactly: genre; `Index: N%`; `Avg minutes / week: {integer} min`; `Share of watch time: {one decimal}%`; it does not include Index interpretation. Click toggles genre selection and the selected category is exposed as pressed. No direct affinity update occurs in live code.

### Selected Show Consumption Over Time

**User story:** As a dashboard user, I want a selected show’s recent consumption trend so that I can understand its weekly movement. **Business question:** how did audience consumption and households watching change across four weeks?

Four-week dual-line detail. X=Week 1–4; left Y=Avg mins/hh; right Y=Households formatted M; five ticks, maxima 115% of data. Legend: Households watching=qualitative-1 yellow; Avg. minutes watched per household=qualitative-3 purple. Hover/focus shows a dashed vertical guide and tooltip: week; `Households watching: {integer}`; `Avg. minutes / household: {integer}`. Inherits all filters, environment, type, genre and Trends platform. All shows returns; another show switches detail. Relation to Date range: **Requires product/data clarification**.

### Temporal Insights

**User story:** As a dashboard user, I want audience concentration by day and daypart so that I can identify strong viewing windows. **Business question:** when does this audience watch?

Metrics: average minutes watched per household and percentage of households watching. Dimensions: day of week × daypart. The 7×6 heatmap has rows Mon–Sun and columns Early AM, Morning, Daytime, Afternoon, Primetime, Late Night. Each cell directly shows `{minutes}m` and household percentage to one decimal. Tooltip is exactly: `{day} · {daypart}`; `Avg minutes/hh: {minutes}m`; `% households: {one decimal}%`; `Heat intensity: N of 6 (low → high minutes)`. Six-step brand ramp encodes minutes; legend is `Low` → six swatches → `High` · `avg mins watched per household`. Hover/focus adds a selected outline; there is no click. Minimum width 720px with horizontal scroll. DoY/WoW definition: **Requires product/data clarification**.

### Content Affinity

**User story:** As a dashboard user, I want affinity against the national average so that I can identify the audience’s strongest content/lifestyle parameter and related shows. **Business question:** where does this audience over- or under-index, and which shows are associated with the selected parameter?

Metric: Index; detail metrics are viewers and show Index. Dimensions: eight fixed parameters and their mapped shows. Eight-axis radar, Index 0–200, numeric rings 50/100/150/200, dashed national baseline 100, unfilled qualitative-4 primary polygon. Tooltip is exactly: parameter; `Index: N`; `Highlight: {Index interpretation}`; `Baseline: National average = 100`. Pointer and Enter/Space select; selected label is bold/underlined and vertex enlarged. Default is highest Index. Supporting text states “Dashed ring = national average (100). Select a parameter to view its details.” Live detail says `{PARAMETER} — top 5 shows`, `Selected parameter · rank N of 8`, then viewer-ranked rows with list rank, compact viewers and `{index} idx`; rows are not clickable. Taxonomy/mapping/ranking/feed: **Requires product/data clarification**.

### TV User Behaviour

**User story:** As a dashboard user, I want to see post-show migration so that I can understand the audience’s next behaviour and destination. **Business question:** where do source-show viewers go within one hour?

Metric: flow share; supporting calculation displayed as drop from source. Dimensions: source show/network → behaviour → destination show/network or Other/stopped. Custom Sankey uses the top three behaviours from Stay on same channel/Switch channel/Move to streaming app/Stop watching; targets are the two strongest show · network destinations plus Other / stopped watching. “From” and “To” label the columns. Ribbon width=flow share; hover raises the ribbon opacity and dims others. Tooltip is exactly: `{behaviour} → {destination}`; `Flow share: {one decimal}%`; `Drop from source: {100 − flow share, one decimal}%`; `Window: Within 1 hour`. Show filter changes source/subtitle/flows; paths have hover but no keyboard focus, click or drilldown. Minimum 560px with horizontal scroll. A screen-reader-only list exposes every flow, and visible supporting copy identifies the source show/network and width meaning. Cohort, denominator and migration rules: **Requires product/data clarification**.

## KPI Visualisation Matrix

| KPI | User question | Primary metric | Secondary metric | Dimension | Chart | Filters | Drilldown |
|---|---|---|---|---|---|---|---|
| Overview | How large/active is the audience? | six summary metrics | four indices | audience | tiles | global, environment | No |
| Type | What is the viewing mix? | share % | estimated minutes/hh | TV type | donut | global, environment | cross-filter |
| Channel | Which destinations matter? | avg min/week | share, Index | channel/app | dual-axis bars | global, environment, type/tab | No |
| Shows | Which shows index highest? | avg min/hh | rendered share, Index | show | grouped bars | global, environment, type, platform, genre | show detail |
| Genres | Which genres matter? | avg min/week | share, Index | genre | grouped bars | global, environment, type, platform | cross-filter |
| Show detail | How does the show move weekly? | avg min/hh | households | week | dual-axis lines | inherited Shows filters | in-card detail |
| Temporal | When does the audience watch? | avg min/hh | % households | day×daypart | heatmap | global, environment, type/platform, channel/app, lookback | No |
| Affinity | Where does the audience index? | Index | viewers/show Index | parameter/show | radar+list | global, environment, type | in-card parameter detail |
| Behaviour | Where do viewers go next? | flow share | drop from source | migration path | Sankey | global, environment, type, genre, show | No |

## Chart Variations and States

- **Default:** UK/all-audience/last-30-days, All environment, no consumption type or genre selected; Linear TV tabs, Shows view, Temporal All channels/apps and 30-day (WoW); affinity detail resolves to the highest-index parameter; behaviour resolves All shows to the current top-indexing show.
- **Applied-filter/environment state:** all module data re-derives and loading skeletons precede the updated values; cross-filter/detail selections reset. Draft global edits do not alter charts.
- **Type-filtered state:** donut selection remains highlighted and a removable filter chip appears; Channel, Trends and Temporal tabs synchronize to that type, while Shows, genres, affinity and behaviour re-derive within scope. Clearing the type removes the scope but leaves platform tabs where the user last left them.
- **Alternative Trends dimension:** Shows displays the top-ten grouped chart and show dropdown; Genres displays all 12 genre groups and removes the show dropdown/alert. Toggling the switch clears show detail.
- **Show-detail state:** selecting a show replaces the grouped show chart with its four-week dual-line detail and dependent show selector.
- **Temporal alternatives:** platform changes rebuild the channel/app options; channel/app and lookback changes re-derive heatmap cells.
- **Affinity detail state:** selecting a radar parameter replaces the parameter/rank and top-five detail in place.
- **Behaviour source state:** selecting a show changes the subtitle, source copy and Sankey flows.
- **Loading/empty/error:** module skeletons, contextual empty states and inline PDF export error are as specified in Responsive / States. No Phase 1 comparison state exists.

## Chart Specifications

Index 100=national average; 150=50% above. It is not minutes or viewing percentage. Badges use arrow/text plus green/red/neutral. Radar explicitly shows baseline. Channel/show/genre currently append `%` to Index, conflicting with semantics: **Requires product/data clarification**.

Rendered mappings: Linear/primary=`--datavis-qualitative-4` `#7c33b5`; Streaming/secondary=`-3` `#a857e5`; FAST/tertiary=`-1` `#fbbb3b`; additional=`-2` `#ef8736`; line=`-5` `#ee4980`; neutral=`-7` `#e1e1e8`; positive `#115639`; negative `#da294b`; grid `#e1e1e8`; axis `#4b4b59`. Heat ramp: `#f6ebff`, `#e5c9f7`, `#cfa0ee`, `#b06fe0`, `#8a3fc9`, `#661f9e`. Grouped bars/show trend use qualitative-3 for minutes and qualitative-1 for percentage/households. Sankey uses primary, line pink and additional orange.

Tooltips are dark Fiber surfaces, portalled, max 320px/viewport-16px, 8px gap/edge, flip below, reposition on resize/ancestor scroll, and do not capture pointer.

## Drilldowns

Show bar/dropdown → in-card four-week dual-line detail; inherited state as above; All shows or view toggle returns. Radar parameter → in-card top-five detail; another parameter replaces it. Donut and genre are cross-filters, not drilldowns. No channel, heatmap, list-row or Sankey drilldown.

## Cross-KPI Interactions

Type syncs three platform tabs, scopes shows, shifts affinity, and constrains migration (Move to streaming app always targets Streaming). Genre constrains Shows and Behaviour. Affinity selection updates only its detail. Global/environment changes reset cross-filter selections. Channel/heatmap/Sankey hover never filters another card.

## Data Requirements

Known dimensions/metrics are exactly those in the KPI sections. Production source, refresh, identity, household weighting/deduplication, privacy thresholds, aggregation, denominators, taxonomy, aliases, classifications, benchmark, date/week/timezone/daypart logic, rounding/suppression, affinity and migration methodology all **Requires product/data clarification**. Synthetic `seeded/entityModel` logic is not a production specification.

| KPI | Known granularity/time/dependency | Confirmation required |
|---|---|---|
| Overview | one value per applied audience, date range and environment | metric aggregation, denominator and feed |
| Type | media type per applied audience/date/environment | minute aggregation and household estimate |
| Channel/App | channel/app within market and platform; top up to ten by minutes | inventory, aliases, share denominator and benchmark |
| Shows | show within platform/type/environment/genre; top ten by Index | show identity, `hhPct` meaning, share/reach denominator and benchmark |
| Genres | one row per rendered IAB genre within platform/type/environment | taxonomy governance, aggregation and share denominator |
| Show detail | selected show × Week 1–4 with inherited context | relationship between four weeks and global date range |
| Temporal | day × daypart within platform/channel/lookback | timezone, daypart boundaries and DoY/WoW definitions |
| Affinity | audience × parameter; selected parameter × top five shows | mapping, viewers, ranking, Index benchmark and feed |
| Behaviour | source show × behaviour × destination within one hour | cohort, attribution window, denominator, aggregation and migration rules |

## Design System Requirements

Use DM Sans, Fiber typography/spacing/surface/border/shadow/control tokens, MetricsTile, 4px SmartCards with 16px padding, searchable dropdowns, buttons, switch, rounded/underline tabs, chip, Info Alert, skeleton and empty state. Every chart is **Custom visualisation using Fiber design tokens**. Support dark tokens, keyboard selection, accessible names, non-colour cues, truncation and scrolling. No arbitrary chart palette.

## Responsive / States

Overview 2/3/6 columns; media card stacks then 20/80 at `lg`; Trends rows stack then align at `md`; affinity/behaviour stack then 3/7 at `lg`. Dropdown list max-height 220px. Exact framework breakpoints and production category virtualization: **Engineering decision required**.

Applied/global environment changes show tile loading and chart skeletons (~550ms prototype). Empty state uses illustration and contextual copy; Italy+Heavy is prototype-reachable. Export errors appear explicitly. Production API retry/partial errors: **Engineering decision required**.

## Functional Acceptance Criteria

- **Given** staged edits, **when** Apply is pressed, **then** every module updates and cross-filter selections reset.
- **Given** non-default applied filters, **when** Clear is pressed, **then** six filters return to defaults.
- **Given** either environment control, **when** changed, **then** its mirror and all modules update.
- **Given** Overview data, **when** the module renders, **then** all six exact metrics and the four applicable Index indicators use the documented formats and expose no chart interaction.
- **Given** the type donut, **when** an arc is hovered or clicked, or a legend row is hovered, focused or clicked, **then** the documented centre, dimming, tooltip and toggle behaviour appears.
- **Given** a type, **when** selected/cleared, **then** its chip and downstream scope/tabs synchronize or clear as documented.
- **Given** a Channel/App platform tab, **when** it changes, **then** up to ten valid destinations render with independent axes, the documented legend and exact tooltip, with no drilldown.
- **Given** Shows view, **when** platform/type/environment/genre changes, **then** the top-ten show universe, alert and dependent show options update consistently.
- **Given** Shows, **when** a show is selected, **then** four-week dual-axis detail opens; All shows returns.
- **Given** show detail, **when** a weekly point is hovered or focused, **then** both exact values and the dashed guide appear.
- **Given** Genres, **when** a genre is clicked, **then** its selected state toggles and the shared show/behaviour universe updates.
- **Given** Temporal platform changes, **when** a channel becomes invalid, **then** it resets to All.
- **Given** a Temporal cell, **when** hovered or focused, **then** both direct labels, selected outline and exact heat-intensity tooltip are available.
- **Given** a radar parameter, **when** clicked or Enter/Space activated, **then** rank/top-five update.
- **Given** a radar parameter, **when** hovered or focused, **then** its Index, interpretation and national baseline appear exactly as documented.
- **Given** a migration show, **when** selected, **then** source/subtitle/flows update.
- **Given** a Sankey ribbon, **when** hovered, **then** other ribbons dim and the exact path/share/drop/window tooltip appears; no click or keyboard interaction is implied.
- **Given** Export PDF, **when** activated, **then** the applied—not staged—context and rendered dashboard are exported with the documented header, exclusions, pagination and filename, while the button shows its busy state.
- **Given** loading, no-data or export-failure conditions represented by V5, **when** one occurs, **then** the corresponding documented skeleton, contextual empty state or inline error appears.
- **Given** narrow width, **when** a minimum-width chart overflows, **then** its region scrolls without clipping tooltip.
- **Given** Phase 1, **when** used, **then** no Comparison Mode control/state exists.

## Stakeholder Feedback Traceability

| Feedback | V5 solution | KPI / area affected | Status |
|---|---|---|---|
| Shared cards/merged type view | MetricsTile; one 20/80 SmartCard | Overview; Type; Channel/App | Incorporated |
| Addressable wording | All/Addressable rounded tabs | Global environment | Incorporated |
| Unlike metrics need distinct scales | independent dual axes | Channel/App; Shows; Genres; show detail | Incorporated |
| Trends as charts/dynamic dimensions | grouped bars + show/genre switch | Content viewership trends | Incorporated |
| Top-ten/show detail | alert, dependent dropdown, four-week lines | Shows | Incorporated |
| Better Index | arrows/explanation/radar rings | Overview; Channel/App; Trends; Affinity | Incorporated; suffix clarification |
| Dynamic temporal controls | platform-dependent inventory/reset | Temporal Insights | Incorporated |
| Hover/accessibility | portalled tooltips/focus labels | Rendered charts | Incorporated |
| Actionable affinity/Sankey | selected top-five; tokenized flows | Affinity; Behaviour | Incorporated |
| Comparison later | absent | Whole dashboard | Phase 2 |

## Out of Scope / Phase 2

**Comparison Mode is Phase 2**, including comparison controls, series, deltas, legends and tooltips. Also not delivered in rendered V5: the imported/unrendered Top N control and dead chart/list/table components; interaction for the displayed Advanced secondary-navigation label; unrendered drilldowns; and prototype collaboration/version tooling as production product features.

## Implementation Checklist

- **Product:** approve scope/personas/stories/clarifications.
- **Data:** contract every metric/dimension/benchmark/classification/date and relationship.
- **UX/UI:** build wrapper, six cards, controls, detail/state/responsive/theme behaviour.
- **Data visualisation:** exact charts, axes, labels, legends, tooltips, colours and accessibility.
- **Engineering:** staged/applied state, dependencies/resets, cross-KPI chain, PDF, represented errors, responsive/accessibility behaviour and tests; production API, caching and performance architecture is **Engineering decision required**.

## Open Questions / Clarifications

Target roles; feeds/SLAs; every metric denominator; show secondary meaning; Index `%` suffix; non-UK Mosaic; addressable classification; date-vs-week/DoY/WoW; affinity mapping; genre→affinity discrepancy; and migration methodology: **Requires product/data clarification**. Persistence, API retry/partial states, exact breakpoints, browser support and performance limits: **Engineering decision required**.

## Final V5 Cross-Check

- [x] Overview: six tiles.
- [x] Media type: DonutChart + DualAxisBarChart.
- [x] Trends: two ComboChart variants + ShowTrendChart.
- [x] TemporalHeatmap.
- [x] RadarChart + rendered top-five list.
- [x] MigrationSankey.
- [x] Every rendered global/local control, dependency, state, tooltip, wrapper and export.
- [x] Dead components excluded/discrepancies flagged.
- [x] Comparison Mode retained in Phase 2.
# TV Audience & Content Planner — Phase 1 Functional Requirements

**Status:** Production handoff derived from live V5  
**Route:** `/tv-audience-intelligence`  
**Phase boundary:** Phase 1 only. **Comparison Mode remains Phase 2.**

## Executive Summary

V5 is a single-page audience-led dashboard for defining a TV audience, understanding its scale and consumption, discovering platforms/channels/apps and content, inspecting temporal patterns and affinity, and viewing one-hour post-show migration. This specification covers only rendered V5 functionality. Prototype values are deterministic synthetic data, not a production feed. Unknowns use **Requires product/data clarification** or **Engineering decision required**.

## Product Scope

### Purpose, users, goals and use cases

The product supports users who need to: define a market/audience; quantify scale, volume and reach; compare Linear TV, Streaming and FAST; find channels/apps, shows and genres; inspect a show’s four-week trend; find day/daypart concentrations; identify affinity against the national average; inspect post-show behaviour; and export the applied view. V5 does not name personas or permissions: **Requires product/data clarification**.

### Phase 1 Scope

- Standalone Reports wrapper and one dashboard screen.
- Six staged global filters, Apply/Clear, immediate All/Addressable control, PDF export.
- Six Overview metrics.
- Six rendered SmartCards and all rendered visualisations/interactions/states.
- Cross-filtering, dependent controls, show/affinity details, responsive and accessible behaviour.

### User journey

Open Standard Reports → stage audience/date values → Apply → read Overview → select environment/type → inspect channel/app and show/genre performance → open show detail → inspect Temporal Insights → select an affinity parameter → select a migration source → export PDF.

The rendered page heading is **TV Audience & Content Planner**, with subtitle **Cross-platform content and audience consumption insights**.

## Dashboard Architecture

Order: title/subtitle; sticky global filters; **Overview**; All/Addressable; **TV viewership by media type** (Consumption by Type + Time Spent by Channel/App); **Content viewership trends**; mirrored All/Addressable; **Temporal Insights**; responsive **Content affinity** + **TV user behaviour**; notes.

Primary navigation is 64px, Reports active, with Intelligence/Audiences/Creatives/Campaigns displayed; full menu at ≥1024px and collapsed Reports menu below. Theme toggle and JS/Pro avatar are right. Secondary navigation is 56px: Standard active/link; Advanced inert. Header auto-hides/floats after scroll and is revealed by top hover/focus. Canvas max-width is 1440px. Prototype version/comment/annotation overlays are tooling, not product scope.

State hierarchy is staged filters → applied filters → immediate environment → optional consumption scope → module-local state. Applied global/environment changes clear type, genre, affinity, show and migration selections and show skeletons. A type selection synchronizes Channel, Trends and Temporal platform tabs and resets Temporal channel to All.

## Global Filters

All are searchable. Single-select closes after selection; multi-select stays open; search is case-insensitive; no result says “No matches.” Empty multi-selection means inclusive All.

| Filter | Exact options | Default | Behaviour |
|---|---|---|---|
| Country | United Kingdom, Germany, France, Italy, Spain | United Kingdom | All modules after Apply; determines linear inventory/commercial rules |
| Mosaic group | All Mosaic groups; City Prosperity; Prestige Positions; Country Living; Suburban Stability; Rental Hubs; Vintage Value | All Mosaic groups (empty) | All modules after Apply; All clears specifics |
| Age & gender | All genders, Male, Female × 16–24, 25–34, 35–44, 45–54, 55–64, 65+ (18) | All ages & genders (empty) | All modules after Apply |
| TV consumption | All viewers, Heavy TV, Medium TV, Light TV | All viewers | All modules after Apply |
| Children | All households; No children; Children 0–4; Children 5–11; Children 12–17 | All households (empty) | All modules after Apply; All clears specifics |
| Date range | Last 7 days; Last 15 days; Last 30 days; Last 60 days | Last 30 days | All modules after Apply |

Mosaic is rendered in all countries despite being described in code as UK-granular: **Requires product/data clarification**.

Edits are staged until Apply. Initially Apply is disabled. Pending edits enable Apply and do not affect KPIs/PDF. After non-default values are applied, the action becomes Clear all filters; Clear restores six defaults, but not environment/local tabs.

**All / Addressable channels** defaults All, updates immediately, appears twice with one synchronized state, and affects every module. Addressable excludes/reweights market-specific non-commercial inventory. Production classification: **Requires product/data clarification**.

**Export PDF** is immediate and always uses the applied filter/environment state, not un-applied draft values. While exporting, the outline button reads “Exporting…” and is disabled. The export is a paginated portrait A4 capture of the dashboard; the sticky filter bar and prototype overlays are omitted and replaced by a header containing the title, all six applied filter values, viewing environment, export date/time and the synthetic-data notice. The filename is `tv-audience-content-planner-{lowercase market code}-{YYYY-MM-DD}.pdf`. A failure is announced inline as `Export failed: {message}` or “Export failed — please try again.”

## Local Filters

| Module | Control; exact options | Default/dependency/effect |
|---|---|---|
| Type | clickable Linear TV, Streaming, FAST donut/legend | None; click again/removable chip clears; scopes downstream |
| Channel/App | Linear TV, Streaming, Fast tabs | Linear TV; synced by type; changes market inventory |
| Trends | View by show/genre switch | Shows; switching clears show |
| Trends | Linear TV, Streaming, Fast | Linear; synced by type; filters shows/reweights genres |
| Shows | All shows + unique valid shows | All; options depend on platform/type/environment/genre; selection opens detail |
| Genres | 12 rendered genre marks | None; selection toggles and restricts shared show universe |
| Temporal | platform tabs; All channels/apps + valid inventory; 7-day (DoY), 15-day (DoY), 30-day (WoW), 60-day (WoW) | Linear; All; 30-day WoW. Platform rebuilds channels; invalid channel resets All |
| Affinity | FOOD, TRAVEL, COMEDY, DOCUMENTARY, NEWS, MUSIC, LIFESTYLE, SPORTS | current highest Index; updates rank/top-five |
| Behaviour | All shows + valid scoped shows | All resolves to top-indexing show |

The data module’s `TOP_N` options and the `GenreBars`, `ShowsTable`, and `AffinityList` components exist but are not rendered; they are not delivered features. `LOOKBACK` is rendered only as the Temporal Insights lookback control.

## Filter Interaction Matrix

| Filter | Overview | Type | Channel | Trends | Temporal | Affinity | Behaviour |
|---|---:|---:|---:|---:|---:|---:|---:|
| Six applied global filters | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| All/Addressable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Type selection | — | selected | sync | sync/scope | sync | scope | scope |
| Genre selection | — | — | — | show universe | — | —* | shared show universe |
| Module-local controls | — | — | local | local | local | local detail | local |

\* Comments claim genre anchors affinity, but live affinity calculation ignores `selectedGenre`: **Requires product/data clarification**.

## KPI Requirements

### Overview

**User story:** As a dashboard user, I want a concise audience summary so that I can understand its scale and activity before exploring detail. **Business question:** how large and active is the audience?

Six Fiber MetricsTiles: **Total households** (K/M); **Total minutes viewed** (K/M); **Avg. weekly TV consumption – Streaming** (`mins`, Index); **Avg linear TV consumption** (`min/wk`, Index); **Avg. channels/apps per hh** (one decimal, Index); **Weekly TV reach** (`% of hh`, Index). Dimension: applied audience and viewing environment. No click, chart legend or tooltip. Source/calculations: **Requires product/data clarification**.

### Consumption by Type

**User story:** As a dashboard user, I want the viewing mix by media type so that I can choose the environment to investigate downstream. **Business question:** what share of minutes is Linear TV, Streaming or FAST?

Metric: share of viewing minutes, with estimated minutes per household as support. Dimension: media type. Visualisation: 200px donut (r78, stroke30), proportional share %. The clickable legend maps Linear TV to qualitative-4 purple, Streaming to qualitative-3 purple and FAST to qualitative-1 yellow, and shows each type’s one-decimal share. Centre defaults “Share of viewing”; hover or selection shows rounded share/name. Hover thickens the active arc by 4px and dims others to 35%. Arc tooltip: type; `Legend: Share of viewing`; share to one decimal; estimated integer minutes/hh. Legend tooltip omits the `Legend` line and otherwise shows the same metrics. Clicking an arc or legend row toggles the downstream type scope; the removable card chip is an equivalent clear action.

### Time Spent by Channel/App

**User story:** As a dashboard user, I want channel/app consumption ranked within a platform so that I can identify important destinations. **Business question:** which destinations matter?

Metrics: average minutes/week, share of watch time and Index. Dimension: channel/app within the selected Linear TV, Streaming or Fast tab. Up to ten destinations are shown, sorted by minutes, as grouped vertical bars. X=channel/app, >12 chars truncates to 11+ellipsis, supporting `Index N%`. Left Y=Avg min/week, five dynamic integer ticks; right Y=% of watch time, five percent ticks. The two-item legend maps minutes to qualitative-3 purple and percentage to qualitative-1 yellow. Tooltip is exactly: channel/app; `Index: N%`; `Highlight: {Index interpretation}`; `Avg min/week: {integer}`; `% of watch time: {one decimal}%`. Hover/focus dims other categories and applies a category wash. Minimum width 680px with horizontal scroll. No drilldown.

### Content Viewership Trends — Shows

**User story:** As a dashboard user, I want the highest-indexing shows for my audience so that I can inspect a relevant title. **Business question:** which ten shows index highest?

Metrics: average minutes/household, rendered `% of total watch time`, and Index supporting text. Dimension: show, constrained by platform/type/environment/genre. Grouped bars are sorted by Index. X=show + supporting `Index N%`; left Y=Avg min/HH; right Y=`% of total watch time`; independent five-tick scales. The legend maps average minutes/household to qualitative-3 purple and `% of total watch time` to qualitative-1 yellow; no line or Index legend is rendered. Tooltip is exactly: show; `Index: N%`; `Avg min / household: {integer} min`; `% of total watch time: {one decimal}%`. It does **not** include an Index interpretation. Click/category or dependent dropdown opens detail. Alert states top 10/platform. Empty title is “No shows match”; message is “No shows match these filters — change the genre filter or viewing scope.” Data property is `hhPct`/commented household reach but UI says watch time: **Requires product/data clarification**.

### Content Viewership Trends — Genres

**User story:** As a dashboard user, I want genre consumption and Index indicators so that I can constrain the show universe. **Business question:** which IAB genres matter?

Metrics: average minutes/week, share of watch time and Index supporting text. Dimension options: Comedy, News, Film, Sports, Drama, Reality, Action, Documentary, Kids, Travel, Food, Home improvement. The same grouped-bar encoding uses left Y=Avg min/week and right Y=Watch time (%), with independent five-tick scales. The legend maps average minutes/week to qualitative-3 purple and share of watch time to qualitative-1 yellow. X labels show genre plus `Index N%`. Tooltip is exactly: genre; `Index: N%`; `Avg minutes / week: {integer} min`; `Share of watch time: {one decimal}%`; it does not include Index interpretation. Click toggles genre selection and the selected category is exposed as pressed. No direct affinity update occurs in live code.

### Selected Show Consumption Over Time

**User story:** As a dashboard user, I want a selected show’s recent consumption trend so that I can understand its weekly movement. **Business question:** how did audience consumption and households watching change across four weeks?

Four-week dual-line detail. X=Week 1–4; left Y=Avg mins/hh; right Y=Households formatted M; five ticks, maxima 115% of data. Legend: Households watching=qualitative-1 yellow; Avg. minutes watched per household=qualitative-3 purple. Hover/focus shows a dashed vertical guide and tooltip: week; `Households watching: {integer}`; `Avg. minutes / household: {integer}`. Inherits all filters, environment, type, genre and Trends platform. All shows returns; another show switches detail. Relation to Date range: **Requires product/data clarification**.

### Temporal Insights

**User story:** As a dashboard user, I want audience concentration by day and daypart so that I can identify strong viewing windows. **Business question:** when does this audience watch?

Metrics: average minutes watched per household and percentage of households watching. Dimensions: day of week × daypart. The 7×6 heatmap has rows Mon–Sun and columns Early AM, Morning, Daytime, Afternoon, Primetime, Late Night. Each cell directly shows `{minutes}m` and household percentage to one decimal. Tooltip is exactly: `{day} · {daypart}`; `Avg minutes/hh: {minutes}m`; `% households: {one decimal}%`; `Heat intensity: N of 6 (low → high minutes)`. Six-step brand ramp encodes minutes; legend is `Low` → six swatches → `High` · `avg mins watched per household`. Hover/focus adds a selected outline; there is no click. Minimum width 720px with horizontal scroll. DoY/WoW definition: **Requires product/data clarification**.

### Content Affinity

**User story:** As a dashboard user, I want affinity against the national average so that I can identify the audience’s strongest content/lifestyle parameter and related shows. **Business question:** where does this audience over- or under-index, and which shows are associated with the selected parameter?

Metric: Index; detail metrics are viewers and show Index. Dimensions: eight fixed parameters and their mapped shows. Eight-axis radar, Index 0–200, numeric rings 50/100/150/200, dashed national baseline 100, unfilled qualitative-4 primary polygon. Tooltip is exactly: parameter; `Index: N`; `Highlight: {Index interpretation}`; `Baseline: National average = 100`. Pointer and Enter/Space select; selected label is bold/underlined and vertex enlarged. Default is highest Index. Supporting text states “Dashed ring = national average (100). Select a parameter to view its details.” Live detail says `{PARAMETER} — top 5 shows`, `Selected parameter · rank N of 8`, then viewer-ranked rows with list rank, compact viewers and `{index} idx`; rows are not clickable. Taxonomy/mapping/ranking/feed: **Requires product/data clarification**.

### TV User Behaviour

**User story:** As a dashboard user, I want to see post-show migration so that I can understand the audience’s next behaviour and destination. **Business question:** where do source-show viewers go within one hour?

Metric: flow share; supporting calculation displayed as drop from source. Dimensions: source show/network → behaviour → destination show/network or Other/stopped. Custom Sankey uses the top three behaviours from Stay on same channel/Switch channel/Move to streaming app/Stop watching; targets are the two strongest show · network destinations plus Other / stopped watching. “From” and “To” label the columns. Ribbon width=flow share; hover raises the ribbon opacity and dims others. Tooltip is exactly: `{behaviour} → {destination}`; `Flow share: {one decimal}%`; `Drop from source: {100 − flow share, one decimal}%`; `Window: Within 1 hour`. Show filter changes source/subtitle/flows; paths have hover but no keyboard focus, click or drilldown. Minimum 560px with horizontal scroll. A screen-reader-only list exposes every flow, and visible supporting copy identifies the source show/network and width meaning. Cohort, denominator and migration rules: **Requires product/data clarification**.

## KPI Visualisation Matrix

| KPI | User question | Primary metric | Secondary metric | Dimension | Chart | Filters | Drilldown |
|---|---|---|---|---|---|---|---|
| Overview | How large/active is the audience? | six summary metrics | four indices | audience | tiles | global, environment | No |
| Type | What is the viewing mix? | share % | estimated minutes/hh | TV type | donut | global, environment | cross-filter |
| Channel | Which destinations matter? | avg min/week | share, Index | channel/app | dual-axis bars | global, environment, type/tab | No |
| Shows | Which shows index highest? | avg min/hh | rendered share, Index | show | grouped bars | global, environment, type, platform, genre | show detail |
| Genres | Which genres matter? | avg min/week | share, Index | genre | grouped bars | global, environment, type, platform | cross-filter |
| Show detail | How does the show move weekly? | avg min/hh | households | week | dual-axis lines | inherited Shows filters | in-card detail |
| Temporal | When does the audience watch? | avg min/hh | % households | day×daypart | heatmap | global, environment, type/platform, channel/app, lookback | No |
| Affinity | Where does the audience index? | Index | viewers/show Index | parameter/show | radar+list | global, environment, type | in-card parameter detail |
| Behaviour | Where do viewers go next? | flow share | drop from source | migration path | Sankey | global, environment, type, genre, show | No |

## Chart Variations and States

- **Default:** UK/all-audience/last-30-days, All environment, no consumption type or genre selected; Linear TV tabs, Shows view, Temporal All channels/apps and 30-day (WoW); affinity detail resolves to the highest-index parameter; behaviour resolves All shows to the current top-indexing show.
- **Applied-filter/environment state:** all module data re-derives and loading skeletons precede the updated values; cross-filter/detail selections reset. Draft global edits do not alter charts.
- **Type-filtered state:** donut selection remains highlighted and a removable filter chip appears; Channel, Trends and Temporal tabs synchronize to that type, while Shows, genres, affinity and behaviour re-derive within scope. Clearing the type removes the scope but leaves platform tabs where the user last left them.
- **Alternative Trends dimension:** Shows displays the top-ten grouped chart and show dropdown; Genres displays all 12 genre groups and removes the show dropdown/alert. Toggling the switch clears show detail.
- **Show-detail state:** selecting a show replaces the grouped show chart with its four-week dual-line detail and dependent show selector.
- **Temporal alternatives:** platform changes rebuild the channel/app options; channel/app and lookback changes re-derive heatmap cells.
- **Affinity detail state:** selecting a radar parameter replaces the parameter/rank and top-five detail in place.
- **Behaviour source state:** selecting a show changes the subtitle, source copy and Sankey flows.
- **Loading/empty/error:** module skeletons, contextual empty states and inline PDF export error are as specified in Responsive / States. No Phase 1 comparison state exists.

## Chart Specifications

Index 100=national average; 150=50% above. It is not minutes or viewing percentage. Badges use arrow/text plus green/red/neutral. Radar explicitly shows baseline. Channel/show/genre currently append `%` to Index, conflicting with semantics: **Requires product/data clarification**.

Rendered mappings: Linear/primary=`--datavis-qualitative-4` `#7c33b5`; Streaming/secondary=`-3` `#a857e5`; FAST/tertiary=`-1` `#fbbb3b`; additional=`-2` `#ef8736`; line=`-5` `#ee4980`; neutral=`-7` `#e1e1e8`; positive `#115639`; negative `#da294b`; grid `#e1e1e8`; axis `#4b4b59`. Heat ramp: `#f6ebff`, `#e5c9f7`, `#cfa0ee`, `#b06fe0`, `#8a3fc9`, `#661f9e`. Grouped bars/show trend use qualitative-3 for minutes and qualitative-1 for percentage/households. Sankey uses primary, line pink and additional orange.

Tooltips are dark Fiber surfaces, portalled, max 320px/viewport-16px, 8px gap/edge, flip below, reposition on resize/ancestor scroll, and do not capture pointer.

## Drilldowns

Show bar/dropdown → in-card four-week dual-line detail; inherited state as above; All shows or view toggle returns. Radar parameter → in-card top-five detail; another parameter replaces it. Donut and genre are cross-filters, not drilldowns. No channel, heatmap, list-row or Sankey drilldown.

## Cross-KPI Interactions

Type syncs three platform tabs, scopes shows, shifts affinity, and constrains migration (Move to streaming app always targets Streaming). Genre constrains Shows and Behaviour. Affinity selection updates only its detail. Global/environment changes reset cross-filter selections. Channel/heatmap/Sankey hover never filters another card.

## Data Requirements

Known dimensions/metrics are exactly those in the KPI sections. Production source, refresh, identity, household weighting/deduplication, privacy thresholds, aggregation, denominators, taxonomy, aliases, classifications, benchmark, date/week/timezone/daypart logic, rounding/suppression, affinity and migration methodology all **Requires product/data clarification**. Synthetic `seeded/entityModel` logic is not a production specification.

| KPI | Known granularity/time/dependency | Confirmation required |
|---|---|---|
| Overview | one value per applied audience, date range and environment | metric aggregation, denominator and feed |
| Type | media type per applied audience/date/environment | minute aggregation and household estimate |
| Channel/App | channel/app within market and platform; top up to ten by minutes | inventory, aliases, share denominator and benchmark |
| Shows | show within platform/type/environment/genre; top ten by Index | show identity, `hhPct` meaning, share/reach denominator and benchmark |
| Genres | one row per rendered IAB genre within platform/type/environment | taxonomy governance, aggregation and share denominator |
| Show detail | selected show × Week 1–4 with inherited context | relationship between four weeks and global date range |
| Temporal | day × daypart within platform/channel/lookback | timezone, daypart boundaries and DoY/WoW definitions |
| Affinity | audience × parameter; selected parameter × top five shows | mapping, viewers, ranking, Index benchmark and feed |
| Behaviour | source show × behaviour × destination within one hour | cohort, attribution window, denominator, aggregation and migration rules |

## Design System Requirements

Use DM Sans, Fiber typography/spacing/surface/border/shadow/control tokens, MetricsTile, 4px SmartCards with 16px padding, searchable dropdowns, buttons, switch, rounded/underline tabs, chip, Info Alert, skeleton and empty state. Every chart is **Custom visualisation using Fiber design tokens**. Support dark tokens, keyboard selection, accessible names, non-colour cues, truncation and scrolling. No arbitrary chart palette.

## Responsive / States

Overview 2/3/6 columns; media card stacks then 20/80 at `lg`; Trends rows stack then align at `md`; affinity/behaviour stack then 3/7 at `lg`. Dropdown list max-height 220px. Exact framework breakpoints and production category virtualization: **Engineering decision required**.

Applied/global environment changes show tile loading and chart skeletons (~550ms prototype). Empty state uses illustration and contextual copy; Italy+Heavy is prototype-reachable. Export errors appear explicitly. Production API retry/partial errors: **Engineering decision required**.

## Functional Acceptance Criteria

- **Given** staged edits, **when** Apply is pressed, **then** every module updates and cross-filter selections reset.
- **Given** non-default applied filters, **when** Clear is pressed, **then** six filters return to defaults.
- **Given** either environment control, **when** changed, **then** its mirror and all modules update.
- **Given** Overview data, **when** the module renders, **then** all six exact metrics and the four applicable Index indicators use the documented formats and expose no chart interaction.
- **Given** the type donut, **when** an arc is hovered or clicked, or a legend row is hovered, focused or clicked, **then** the documented centre, dimming, tooltip and toggle behaviour appears.
- **Given** a type, **when** selected/cleared, **then** its chip and downstream scope/tabs synchronize or clear as documented.
- **Given** a Channel/App platform tab, **when** it changes, **then** up to ten valid destinations render with independent axes, the documented legend and exact tooltip, with no drilldown.
- **Given** Shows view, **when** platform/type/environment/genre changes, **then** the top-ten show universe, alert and dependent show options update consistently.
- **Given** Shows, **when** a show is selected, **then** four-week dual-axis detail opens; All shows returns.
- **Given** show detail, **when** a weekly point is hovered or focused, **then** both exact values and the dashed guide appear.
- **Given** Genres, **when** a genre is clicked, **then** its selected state toggles and the shared show/behaviour universe updates.
- **Given** Temporal platform changes, **when** a channel becomes invalid, **then** it resets to All.
- **Given** a Temporal cell, **when** hovered or focused, **then** both direct labels, selected outline and exact heat-intensity tooltip are available.
- **Given** a radar parameter, **when** clicked or Enter/Space activated, **then** rank/top-five update.
- **Given** a radar parameter, **when** hovered or focused, **then** its Index, interpretation and national baseline appear exactly as documented.
- **Given** a migration show, **when** selected, **then** source/subtitle/flows update.
- **Given** a Sankey ribbon, **when** hovered, **then** other ribbons dim and the exact path/share/drop/window tooltip appears; no click or keyboard interaction is implied.
- **Given** Export PDF, **when** activated, **then** the applied—not staged—context and rendered dashboard are exported with the documented header, exclusions, pagination and filename, while the button shows its busy state.
- **Given** loading, no-data or export-failure conditions represented by V5, **when** one occurs, **then** the corresponding documented skeleton, contextual empty state or inline error appears.
- **Given** narrow width, **when** a minimum-width chart overflows, **then** its region scrolls without clipping tooltip.
- **Given** Phase 1, **when** used, **then** no Comparison Mode control/state exists.

## Stakeholder Feedback Traceability

| Feedback | V5 solution | KPI / area affected | Status |
|---|---|---|---|
| Shared cards/merged type view | MetricsTile; one 20/80 SmartCard | Overview; Type; Channel/App | Incorporated |
| Addressable wording | All/Addressable rounded tabs | Global environment | Incorporated |
| Unlike metrics need distinct scales | independent dual axes | Channel/App; Shows; Genres; show detail | Incorporated |
| Trends as charts/dynamic dimensions | grouped bars + show/genre switch | Content viewership trends | Incorporated |
| Top-ten/show detail | alert, dependent dropdown, four-week lines | Shows | Incorporated |
| Better Index | arrows/explanation/radar rings | Overview; Channel/App; Trends; Affinity | Incorporated; suffix clarification |
| Dynamic temporal controls | platform-dependent inventory/reset | Temporal Insights | Incorporated |
| Hover/accessibility | portalled tooltips/focus labels | Rendered charts | Incorporated |
| Actionable affinity/Sankey | selected top-five; tokenized flows | Affinity; Behaviour | Incorporated |
| Comparison later | absent | Whole dashboard | Phase 2 |

## Out of Scope / Phase 2

**Comparison Mode is Phase 2**, including comparison controls, series, deltas, legends and tooltips. Also not delivered in rendered V5: the imported/unrendered Top N control and dead chart/list/table components; interaction for the displayed Advanced secondary-navigation label; unrendered drilldowns; and prototype collaboration/version tooling as production product features.

## Implementation Checklist

- **Product:** approve scope/personas/stories/clarifications.
- **Data:** contract every metric/dimension/benchmark/classification/date and relationship.
- **UX/UI:** build wrapper, six cards, controls, detail/state/responsive/theme behaviour.
- **Data visualisation:** exact charts, axes, labels, legends, tooltips, colours and accessibility.
- **Engineering:** staged/applied state, dependencies/resets, cross-KPI chain, PDF, represented errors, responsive/accessibility behaviour and tests; production API, caching and performance architecture is **Engineering decision required**.

## Open Questions / Clarifications

Target roles; feeds/SLAs; every metric denominator; show secondary meaning; Index `%` suffix; non-UK Mosaic; addressable classification; date-vs-week/DoY/WoW; affinity mapping; genre→affinity discrepancy; and migration methodology: **Requires product/data clarification**. Persistence, API retry/partial states, exact breakpoints, browser support and performance limits: **Engineering decision required**.

## Final V5 Cross-Check

- [x] Overview: six tiles.
- [x] Media type: DonutChart + DualAxisBarChart.
- [x] Trends: two ComboChart variants + ShowTrendChart.
- [x] TemporalHeatmap.
- [x] RadarChart + rendered top-five list.
- [x] MigrationSankey.
- [x] Every rendered global/local control, dependency, state, tooltip, wrapper and export.
- [x] Dead components excluded/discrepancies flagged.
- [x] Comparison Mode retained in Phase 2.
# TV Audience & Content Planner — Phase 1 Functional Requirements

**Status:** Production handoff derived from live V5  
**Route:** `/tv-audience-intelligence`  
**Phase boundary:** Phase 1 only. **Comparison Mode remains Phase 2.**

## Executive Summary

V5 is a single-page audience-led dashboard for defining a TV audience, understanding its scale and consumption, discovering platforms/channels/apps and content, inspecting temporal patterns and affinity, and viewing one-hour post-show migration. This specification covers only rendered V5 functionality. Prototype values are deterministic synthetic data, not a production feed. Unknowns use **Requires product/data clarification** or **Engineering decision required**.

## Product Scope

### Purpose, users, goals and use cases

The product supports users who need to: define a market/audience; quantify scale, volume and reach; compare Linear TV, Streaming and FAST; find channels/apps, shows and genres; inspect a show’s four-week trend; find day/daypart concentrations; identify affinity against the national average; inspect post-show behaviour; and export the applied view. V5 does not name personas or permissions: **Requires product/data clarification**.

### Phase 1 Scope

- Standalone Reports wrapper and one dashboard screen.
- Six staged global filters, Apply/Clear, immediate All/Addressable control, PDF export.
- Six Overview metrics.
- Six rendered SmartCards and all rendered visualisations/interactions/states.
- Cross-filtering, dependent controls, show/affinity details, responsive and accessible behaviour.

### User journey

Open Standard Reports → stage audience/date values → Apply → read Overview → select environment/type → inspect channel/app and show/genre performance → open show detail → inspect Temporal Insights → select an affinity parameter → select a migration source → export PDF.

The rendered page heading is **TV Audience & Content Planner**, with subtitle **Cross-platform content and audience consumption insights**.

## Dashboard Architecture

Order: title/subtitle; sticky global filters; **Overview**; All/Addressable; **TV viewership by media type** (Consumption by Type + Time Spent by Channel/App); **Content viewership trends**; mirrored All/Addressable; **Temporal Insights**; responsive **Content affinity** + **TV user behaviour**; notes.

Primary navigation is 64px, Reports active, with Intelligence/Audiences/Creatives/Campaigns displayed; full menu at ≥1024px and collapsed Reports menu below. Theme toggle and JS/Pro avatar are right. Secondary navigation is 56px: Standard active/link; Advanced inert. Header auto-hides/floats after scroll and is revealed by top hover/focus. Canvas max-width is 1440px. Prototype version/comment/annotation overlays are tooling, not product scope.

State hierarchy is staged filters → applied filters → immediate environment → optional consumption scope → module-local state. Applied global/environment changes clear type, genre, affinity, show and migration selections and show skeletons. A type selection synchronizes Channel, Trends and Temporal platform tabs and resets Temporal channel to All.

## Global Filters

All are searchable. Single-select closes after selection; multi-select stays open; search is case-insensitive; no result says “No matches.” Empty multi-selection means inclusive All.

| Filter | Exact options | Default | Behaviour |
|---|---|---|---|
| Country | United Kingdom, Germany, France, Italy, Spain | United Kingdom | All modules after Apply; determines linear inventory/commercial rules |
| Mosaic group | All Mosaic groups; City Prosperity; Prestige Positions; Country Living; Suburban Stability; Rental Hubs; Vintage Value | All Mosaic groups (empty) | All modules after Apply; All clears specifics |
| Age & gender | All genders, Male, Female × 16–24, 25–34, 35–44, 45–54, 55–64, 65+ (18) | All ages & genders (empty) | All modules after Apply |
| TV consumption | All viewers, Heavy TV, Medium TV, Light TV | All viewers | All modules after Apply |
| Children | All households; No children; Children 0–4; Children 5–11; Children 12–17 | All households (empty) | All modules after Apply; All clears specifics |
| Date range | Last 7 days; Last 15 days; Last 30 days; Last 60 days | Last 30 days | All modules after Apply |

Mosaic is rendered in all countries despite being described in code as UK-granular: **Requires product/data clarification**.

Edits are staged until Apply. Initially Apply is disabled. Pending edits enable Apply and do not affect KPIs/PDF. After non-default values are applied, the action becomes Clear all filters; Clear restores six defaults, but not environment/local tabs.

**All / Addressable channels** defaults All, updates immediately, appears twice with one synchronized state, and affects every module. Addressable excludes/reweights market-specific non-commercial inventory. Production classification: **Requires product/data clarification**.

**Export PDF** is immediate and always uses the applied filter/environment state, not un-applied draft values. While exporting, the outline button reads “Exporting…” and is disabled. The export is a paginated portrait A4 capture of the dashboard; the sticky filter bar and prototype overlays are omitted and replaced by a header containing the title, all six applied filter values, viewing environment, export date/time and the synthetic-data notice. The filename is `tv-audience-content-planner-{lowercase market code}-{YYYY-MM-DD}.pdf`. A failure is announced inline as `Export failed: {message}` or “Export failed — please try again.”

## Local Filters

| Module | Control; exact options | Default/dependency/effect |
|---|---|---|
| Type | clickable Linear TV, Streaming, FAST donut/legend | None; click again/removable chip clears; scopes downstream |
| Channel/App | Linear TV, Streaming, Fast tabs | Linear TV; synced by type; changes market inventory |
| Trends | View by show/genre switch | Shows; switching clears show |
| Trends | Linear TV, Streaming, Fast | Linear; synced by type; filters shows/reweights genres |
| Shows | All shows + unique valid shows | All; options depend on platform/type/environment/genre; selection opens detail |
| Genres | 12 rendered genre marks | None; selection toggles and restricts shared show universe |
| Temporal | platform tabs; All channels/apps + valid inventory; 7-day (DoY), 15-day (DoY), 30-day (WoW), 60-day (WoW) | Linear; All; 30-day WoW. Platform rebuilds channels; invalid channel resets All |
| Affinity | FOOD, TRAVEL, COMEDY, DOCUMENTARY, NEWS, MUSIC, LIFESTYLE, SPORTS | current highest Index; updates rank/top-five |
| Behaviour | All shows + valid scoped shows | All resolves to top-indexing show |

The data module’s `TOP_N` options and the `GenreBars`, `ShowsTable`, and `AffinityList` components exist but are not rendered; they are not delivered features. `LOOKBACK` is rendered only as the Temporal Insights lookback control.

## Filter Interaction Matrix

| Filter | Overview | Type | Channel | Trends | Temporal | Affinity | Behaviour |
|---|---:|---:|---:|---:|---:|---:|---:|
| Six applied global filters | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| All/Addressable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Type selection | — | selected | sync | sync/scope | sync | scope | scope |
| Genre selection | — | — | — | show universe | — | —* | shared show universe |
| Module-local controls | — | — | local | local | local | local detail | local |

\* Comments claim genre anchors affinity, but live affinity calculation ignores `selectedGenre`: **Requires product/data clarification**.

## KPI Requirements

### Overview

**User story:** As a dashboard user, I want a concise audience summary so that I can understand its scale and activity before exploring detail. **Business question:** how large and active is the audience?

Six Fiber MetricsTiles: **Total households** (K/M); **Total minutes viewed** (K/M); **Avg. weekly TV consumption – Streaming** (`mins`, Index); **Avg linear TV consumption** (`min/wk`, Index); **Avg. channels/apps per hh** (one decimal, Index); **Weekly TV reach** (`% of hh`, Index). Dimension: applied audience and viewing environment. No click, chart legend or tooltip. Source/calculations: **Requires product/data clarification**.

### Consumption by Type

**User story:** As a dashboard user, I want the viewing mix by media type so that I can choose the environment to investigate downstream. **Business question:** what share of minutes is Linear TV, Streaming or FAST?

Metric: share of viewing minutes, with estimated minutes per household as support. Dimension: media type. Visualisation: 200px donut (r78, stroke30), proportional share %. The clickable legend maps Linear TV to qualitative-4 purple, Streaming to qualitative-3 purple and FAST to qualitative-1 yellow, and shows each type’s one-decimal share. Centre defaults “Share of viewing”; hover or selection shows rounded share/name. Hover thickens the active arc by 4px and dims others to 35%. Arc tooltip: type; `Legend: Share of viewing`; share to one decimal; estimated integer minutes/hh. Legend tooltip omits the `Legend` line and otherwise shows the same metrics. Clicking an arc or legend row toggles the downstream type scope; the removable card chip is an equivalent clear action.

### Time Spent by Channel/App

**User story:** As a dashboard user, I want channel/app consumption ranked within a platform so that I can identify important destinations. **Business question:** which destinations matter?

Metrics: average minutes/week, share of watch time and Index. Dimension: channel/app within the selected Linear TV, Streaming or Fast tab. Up to ten destinations are shown, sorted by minutes, as grouped vertical bars. X=channel/app, >12 chars truncates to 11+ellipsis, supporting `Index N%`. Left Y=Avg min/week, five dynamic integer ticks; right Y=% of watch time, five percent ticks. The two-item legend maps minutes to qualitative-3 purple and percentage to qualitative-1 yellow. Tooltip is exactly: channel/app; `Index: N%`; `Highlight: {Index interpretation}`; `Avg min/week: {integer}`; `% of watch time: {one decimal}%`. Hover/focus dims other categories and applies a category wash. Minimum width 680px with horizontal scroll. No drilldown.

### Content Viewership Trends — Shows

**User story:** As a dashboard user, I want the highest-indexing shows for my audience so that I can inspect a relevant title. **Business question:** which ten shows index highest?

Metrics: average minutes/household, rendered `% of total watch time`, and Index supporting text. Dimension: show, constrained by platform/type/environment/genre. Grouped bars are sorted by Index. X=show + supporting `Index N%`; left Y=Avg min/HH; right Y=`% of total watch time`; independent five-tick scales. The legend maps average minutes/household to qualitative-3 purple and `% of total watch time` to qualitative-1 yellow; no line or Index legend is rendered. Tooltip is exactly: show; `Index: N%`; `Avg min / household: {integer} min`; `% of total watch time: {one decimal}%`. It does **not** include an Index interpretation. Click/category or dependent dropdown opens detail. Alert states top 10/platform. Empty title is “No shows match”; message is “No shows match these filters — change the genre filter or viewing scope.” Data property is `hhPct`/commented household reach but UI says watch time: **Requires product/data clarification**.

### Content Viewership Trends — Genres

**User story:** As a dashboard user, I want genre consumption and Index indicators so that I can constrain the show universe. **Business question:** which IAB genres matter?

Metrics: average minutes/week, share of watch time and Index supporting text. Dimension options: Comedy, News, Film, Sports, Drama, Reality, Action, Documentary, Kids, Travel, Food, Home improvement. The same grouped-bar encoding uses left Y=Avg min/week and right Y=Watch time (%), with independent five-tick scales. The legend maps average minutes/week to qualitative-3 purple and share of watch time to qualitative-1 yellow. X labels show genre plus `Index N%`. Tooltip is exactly: genre; `Index: N%`; `Avg minutes / week: {integer} min`; `Share of watch time: {one decimal}%`; it does not include Index interpretation. Click toggles genre selection and the selected category is exposed as pressed. No direct affinity update occurs in live code.

### Selected Show Consumption Over Time

**User story:** As a dashboard user, I want a selected show’s recent consumption trend so that I can understand its weekly movement. **Business question:** how did audience consumption and households watching change across four weeks?

Four-week dual-line detail. X=Week 1–4; left Y=Avg mins/hh; right Y=Households formatted M; five ticks, maxima 115% of data. Legend: Households watching=qualitative-1 yellow; Avg. minutes watched per household=qualitative-3 purple. Hover/focus shows a dashed vertical guide and tooltip: week; `Households watching: {integer}`; `Avg. minutes / household: {integer}`. Inherits all filters, environment, type, genre and Trends platform. All shows returns; another show switches detail. Relation to Date range: **Requires product/data clarification**.

### Temporal Insights

**User story:** As a dashboard user, I want audience concentration by day and daypart so that I can identify strong viewing windows. **Business question:** when does this audience watch?

Metrics: average minutes watched per household and percentage of households watching. Dimensions: day of week × daypart. The 7×6 heatmap has rows Mon–Sun and columns Early AM, Morning, Daytime, Afternoon, Primetime, Late Night. Each cell directly shows `{minutes}m` and household percentage to one decimal. Tooltip is exactly: `{day} · {daypart}`; `Avg minutes/hh: {minutes}m`; `% households: {one decimal}%`; `Heat intensity: N of 6 (low → high minutes)`. Six-step brand ramp encodes minutes; legend is `Low` → six swatches → `High` · `avg mins watched per household`. Hover/focus adds a selected outline; there is no click. Minimum width 720px with horizontal scroll. DoY/WoW definition: **Requires product/data clarification**.

### Content Affinity

**User story:** As a dashboard user, I want affinity against the national average so that I can identify the audience’s strongest content/lifestyle parameter and related shows. **Business question:** where does this audience over- or under-index, and which shows are associated with the selected parameter?

Metric: Index; detail metrics are viewers and show Index. Dimensions: eight fixed parameters and their mapped shows. Eight-axis radar, Index 0–200, numeric rings 50/100/150/200, dashed national baseline 100, unfilled qualitative-4 primary polygon. Tooltip is exactly: parameter; `Index: N`; `Highlight: {Index interpretation}`; `Baseline: National average = 100`. Pointer and Enter/Space select; selected label is bold/underlined and vertex enlarged. Default is highest Index. Supporting text states “Dashed ring = national average (100). Select a parameter to view its details.” Live detail says `{PARAMETER} — top 5 shows`, `Selected parameter · rank N of 8`, then viewer-ranked rows with list rank, compact viewers and `{index} idx`; rows are not clickable. Taxonomy/mapping/ranking/feed: **Requires product/data clarification**.

### TV User Behaviour

**User story:** As a dashboard user, I want to see post-show migration so that I can understand the audience’s next behaviour and destination. **Business question:** where do source-show viewers go within one hour?

Metric: flow share; supporting calculation displayed as drop from source. Dimensions: source show/network → behaviour → destination show/network or Other/stopped. Custom Sankey uses the top three behaviours from Stay on same channel/Switch channel/Move to streaming app/Stop watching; targets are the two strongest show · network destinations plus Other / stopped watching. “From” and “To” label the columns. Ribbon width=flow share; hover raises the ribbon opacity and dims others. Tooltip is exactly: `{behaviour} → {destination}`; `Flow share: {one decimal}%`; `Drop from source: {100 − flow share, one decimal}%`; `Window: Within 1 hour`. Show filter changes source/subtitle/flows; paths have hover but no keyboard focus, click or drilldown. Minimum 560px with horizontal scroll. A screen-reader-only list exposes every flow, and visible supporting copy identifies the source show/network and width meaning. Cohort, denominator and migration rules: **Requires product/data clarification**.

## KPI Visualisation Matrix

| KPI | User question | Primary metric | Secondary metric | Dimension | Chart | Filters | Drilldown |
|---|---|---|---|---|---|---|---|
| Overview | How large/active is the audience? | six summary metrics | four indices | audience | tiles | global, environment | No |
| Type | What is the viewing mix? | share % | estimated minutes/hh | TV type | donut | global, environment | cross-filter |
| Channel | Which destinations matter? | avg min/week | share, Index | channel/app | dual-axis bars | global, environment, type/tab | No |
| Shows | Which shows index highest? | avg min/hh | rendered share, Index | show | grouped bars | global, environment, type, platform, genre | show detail |
| Genres | Which genres matter? | avg min/week | share, Index | genre | grouped bars | global, environment, type, platform | cross-filter |
| Show detail | How does the show move weekly? | avg min/hh | households | week | dual-axis lines | inherited Shows filters | in-card detail |
| Temporal | When does the audience watch? | avg min/hh | % households | day×daypart | heatmap | global, environment, type/platform, channel/app, lookback | No |
| Affinity | Where does the audience index? | Index | viewers/show Index | parameter/show | radar+list | global, environment, type | in-card parameter detail |
| Behaviour | Where do viewers go next? | flow share | drop from source | migration path | Sankey | global, environment, type, genre, show | No |

## Chart Variations and States

- **Default:** UK/all-audience/last-30-days, All environment, no consumption type or genre selected; Linear TV tabs, Shows view, Temporal All channels/apps and 30-day (WoW); affinity detail resolves to the highest-index parameter; behaviour resolves All shows to the current top-indexing show.
- **Applied-filter/environment state:** all module data re-derives and loading skeletons precede the updated values; cross-filter/detail selections reset. Draft global edits do not alter charts.
- **Type-filtered state:** donut selection remains highlighted and a removable filter chip appears; Channel, Trends and Temporal tabs synchronize to that type, while Shows, genres, affinity and behaviour re-derive within scope. Clearing the type removes the scope but leaves platform tabs where the user last left them.
- **Alternative Trends dimension:** Shows displays the top-ten grouped chart and show dropdown; Genres displays all 12 genre groups and removes the show dropdown/alert. Toggling the switch clears show detail.
- **Show-detail state:** selecting a show replaces the grouped show chart with its four-week dual-line detail and dependent show selector.
- **Temporal alternatives:** platform changes rebuild the channel/app options; channel/app and lookback changes re-derive heatmap cells.
- **Affinity detail state:** selecting a radar parameter replaces the parameter/rank and top-five detail in place.
- **Behaviour source state:** selecting a show changes the subtitle, source copy and Sankey flows.
- **Loading/empty/error:** module skeletons, contextual empty states and inline PDF export error are as specified in Responsive / States. No Phase 1 comparison state exists.

## Chart Specifications

Index 100=national average; 150=50% above. It is not minutes or viewing percentage. Badges use arrow/text plus green/red/neutral. Radar explicitly shows baseline. Channel/show/genre currently append `%` to Index, conflicting with semantics: **Requires product/data clarification**.

Rendered mappings: Linear/primary=`--datavis-qualitative-4` `#7c33b5`; Streaming/secondary=`-3` `#a857e5`; FAST/tertiary=`-1` `#fbbb3b`; additional=`-2` `#ef8736`; line=`-5` `#ee4980`; neutral=`-7` `#e1e1e8`; positive `#115639`; negative `#da294b`; grid `#e1e1e8`; axis `#4b4b59`. Heat ramp: `#f6ebff`, `#e5c9f7`, `#cfa0ee`, `#b06fe0`, `#8a3fc9`, `#661f9e`. Grouped bars/show trend use qualitative-3 for minutes and qualitative-1 for percentage/households. Sankey uses primary, line pink and additional orange.

Tooltips are dark Fiber surfaces, portalled, max 320px/viewport-16px, 8px gap/edge, flip below, reposition on resize/ancestor scroll, and do not capture pointer.

## Drilldowns

Show bar/dropdown → in-card four-week dual-line detail; inherited state as above; All shows or view toggle returns. Radar parameter → in-card top-five detail; another parameter replaces it. Donut and genre are cross-filters, not drilldowns. No channel, heatmap, list-row or Sankey drilldown.

## Cross-KPI Interactions

Type syncs three platform tabs, scopes shows, shifts affinity, and constrains migration (Move to streaming app always targets Streaming). Genre constrains Shows and Behaviour. Affinity selection updates only its detail. Global/environment changes reset cross-filter selections. Channel/heatmap/Sankey hover never filters another card.

## Data Requirements

Known dimensions/metrics are exactly those in the KPI sections. Production source, refresh, identity, household weighting/deduplication, privacy thresholds, aggregation, denominators, taxonomy, aliases, classifications, benchmark, date/week/timezone/daypart logic, rounding/suppression, affinity and migration methodology all **Requires product/data clarification**. Synthetic `seeded/entityModel` logic is not a production specification.

| KPI | Known granularity/time/dependency | Confirmation required |
|---|---|---|
| Overview | one value per applied audience, date range and environment | metric aggregation, denominator and feed |
| Type | media type per applied audience/date/environment | minute aggregation and household estimate |
| Channel/App | channel/app within market and platform; top up to ten by minutes | inventory, aliases, share denominator and benchmark |
| Shows | show within platform/type/environment/genre; top ten by Index | show identity, `hhPct` meaning, share/reach denominator and benchmark |
| Genres | one row per rendered IAB genre within platform/type/environment | taxonomy governance, aggregation and share denominator |
| Show detail | selected show × Week 1–4 with inherited context | relationship between four weeks and global date range |
| Temporal | day × daypart within platform/channel/lookback | timezone, daypart boundaries and DoY/WoW definitions |
| Affinity | audience × parameter; selected parameter × top five shows | mapping, viewers, ranking, Index benchmark and feed |
| Behaviour | source show × behaviour × destination within one hour | cohort, attribution window, denominator, aggregation and migration rules |

## Design System Requirements

Use DM Sans, Fiber typography/spacing/surface/border/shadow/control tokens, MetricsTile, 4px SmartCards with 16px padding, searchable dropdowns, buttons, switch, rounded/underline tabs, chip, Info Alert, skeleton and empty state. Every chart is **Custom visualisation using Fiber design tokens**. Support dark tokens, keyboard selection, accessible names, non-colour cues, truncation and scrolling. No arbitrary chart palette.

## Responsive / States

Overview 2/3/6 columns; media card stacks then 20/80 at `lg`; Trends rows stack then align at `md`; affinity/behaviour stack then 3/7 at `lg`. Dropdown list max-height 220px. Exact framework breakpoints and production category virtualization: **Engineering decision required**.

Applied/global environment changes show tile loading and chart skeletons (~550ms prototype). Empty state uses illustration and contextual copy; Italy+Heavy is prototype-reachable. Export errors appear explicitly. Production API retry/partial errors: **Engineering decision required**.

## Functional Acceptance Criteria

- **Given** staged edits, **when** Apply is pressed, **then** every module updates and cross-filter selections reset.
- **Given** non-default applied filters, **when** Clear is pressed, **then** six filters return to defaults.
- **Given** either environment control, **when** changed, **then** its mirror and all modules update.
- **Given** Overview data, **when** the module renders, **then** all six exact metrics and the four applicable Index indicators use the documented formats and expose no chart interaction.
- **Given** the type donut, **when** an arc is hovered or clicked, or a legend row is hovered, focused or clicked, **then** the documented centre, dimming, tooltip and toggle behaviour appears.
- **Given** a type, **when** selected/cleared, **then** its chip and downstream scope/tabs synchronize or clear as documented.
- **Given** a Channel/App platform tab, **when** it changes, **then** up to ten valid destinations render with independent axes, the documented legend and exact tooltip, with no drilldown.
- **Given** Shows view, **when** platform/type/environment/genre changes, **then** the top-ten show universe, alert and dependent show options update consistently.
- **Given** Shows, **when** a show is selected, **then** four-week dual-axis detail opens; All shows returns.
- **Given** show detail, **when** a weekly point is hovered or focused, **then** both exact values and the dashed guide appear.
- **Given** Genres, **when** a genre is clicked, **then** its selected state toggles and the shared show/behaviour universe updates.
- **Given** Temporal platform changes, **when** a channel becomes invalid, **then** it resets to All.
- **Given** a Temporal cell, **when** hovered or focused, **then** both direct labels, selected outline and exact heat-intensity tooltip are available.
- **Given** a radar parameter, **when** clicked or Enter/Space activated, **then** rank/top-five update.
- **Given** a radar parameter, **when** hovered or focused, **then** its Index, interpretation and national baseline appear exactly as documented.
- **Given** a migration show, **when** selected, **then** source/subtitle/flows update.
- **Given** a Sankey ribbon, **when** hovered, **then** other ribbons dim and the exact path/share/drop/window tooltip appears; no click or keyboard interaction is implied.
- **Given** Export PDF, **when** activated, **then** the applied—not staged—context and rendered dashboard are exported with the documented header, exclusions, pagination and filename, while the button shows its busy state.
- **Given** loading, no-data or export-failure conditions represented by V5, **when** one occurs, **then** the corresponding documented skeleton, contextual empty state or inline error appears.
- **Given** narrow width, **when** a minimum-width chart overflows, **then** its region scrolls without clipping tooltip.
- **Given** Phase 1, **when** used, **then** no Comparison Mode control/state exists.

## Stakeholder Feedback Traceability

| Feedback | V5 solution | KPI / area affected | Status |
|---|---|---|---|
| Shared cards/merged type view | MetricsTile; one 20/80 SmartCard | Overview; Type; Channel/App | Incorporated |
| Addressable wording | All/Addressable rounded tabs | Global environment | Incorporated |
| Unlike metrics need distinct scales | independent dual axes | Channel/App; Shows; Genres; show detail | Incorporated |
| Trends as charts/dynamic dimensions | grouped bars + show/genre switch | Content viewership trends | Incorporated |
| Top-ten/show detail | alert, dependent dropdown, four-week lines | Shows | Incorporated |
| Better Index | arrows/explanation/radar rings | Overview; Channel/App; Trends; Affinity | Incorporated; suffix clarification |
| Dynamic temporal controls | platform-dependent inventory/reset | Temporal Insights | Incorporated |
| Hover/accessibility | portalled tooltips/focus labels | Rendered charts | Incorporated |
| Actionable affinity/Sankey | selected top-five; tokenized flows | Affinity; Behaviour | Incorporated |
| Comparison later | absent | Whole dashboard | Phase 2 |

## Out of Scope / Phase 2

**Comparison Mode is Phase 2**, including comparison controls, series, deltas, legends and tooltips. Also not delivered in rendered V5: the imported/unrendered Top N control and dead chart/list/table components; interaction for the displayed Advanced secondary-navigation label; unrendered drilldowns; and prototype collaboration/version tooling as production product features.

## Implementation Checklist

- **Product:** approve scope/personas/stories/clarifications.
- **Data:** contract every metric/dimension/benchmark/classification/date and relationship.
- **UX/UI:** build wrapper, six cards, controls, detail/state/responsive/theme behaviour.
- **Data visualisation:** exact charts, axes, labels, legends, tooltips, colours and accessibility.
- **Engineering:** staged/applied state, dependencies/resets, cross-KPI chain, PDF, represented errors, responsive/accessibility behaviour and tests; production API, caching and performance architecture is **Engineering decision required**.

## Open Questions / Clarifications

Target roles; feeds/SLAs; every metric denominator; show secondary meaning; Index `%` suffix; non-UK Mosaic; addressable classification; date-vs-week/DoY/WoW; affinity mapping; genre→affinity discrepancy; and migration methodology: **Requires product/data clarification**. Persistence, API retry/partial states, exact breakpoints, browser support and performance limits: **Engineering decision required**.

## Final V5 Cross-Check

- [x] Overview: six tiles.
- [x] Media type: DonutChart + DualAxisBarChart.
- [x] Trends: two ComboChart variants + ShowTrendChart.
- [x] TemporalHeatmap.
- [x] RadarChart + rendered top-five list.
- [x] MigrationSankey.
- [x] Every rendered global/local control, dependency, state, tooltip, wrapper and export.
- [x] Dead components excluded/discrepancies flagged.
- [x] Comparison Mode retained in Phase 2.
# TV Audience & Content Planner — Phase 1 Functional Requirements

**Status:** Production handoff derived from live V5  
**Route:** `/tv-audience-intelligence`  
**Phase boundary:** Phase 1 only. **Comparison Mode remains Phase 2.**

## Executive Summary

V5 is a single-page audience-led dashboard for defining a TV audience, understanding its scale and consumption, discovering platforms/channels/apps and content, inspecting temporal patterns and affinity, and viewing one-hour post-show migration. This specification covers only rendered V5 functionality. Prototype values are deterministic synthetic data, not a production feed. Unknowns use **Requires product/data clarification** or **Engineering decision required**.

## Product Scope

### Purpose, users, goals and use cases

The product supports users who need to: define a market/audience; quantify scale, volume and reach; compare Linear TV, Streaming and FAST; find channels/apps, shows and genres; inspect a show’s four-week trend; find day/daypart concentrations; identify affinity against the national average; inspect post-show behaviour; and export the applied view. V5 does not name personas or permissions: **Requires product/data clarification**.

### Phase 1 Scope

- Standalone Reports wrapper and one dashboard screen.
- Six staged global filters, Apply/Clear, immediate All/Addressable control, PDF export.
- Six Overview metrics.
- Six rendered SmartCards and all rendered visualisations/interactions/states.
- Cross-filtering, dependent controls, show/affinity details, responsive and accessible behaviour.

### User journey

Open Standard Reports → stage audience/date values → Apply → read Overview → select environment/type → inspect channel/app and show/genre performance → open show detail → inspect Temporal Insights → select an affinity parameter → select a migration source → export PDF.

The rendered page heading is **TV Audience & Content Planner**, with subtitle **Cross-platform content and audience consumption insights**.

## Dashboard Architecture

Order: title/subtitle; sticky global filters; **Overview**; All/Addressable; **TV viewership by media type** (Consumption by Type + Time Spent by Channel/App); **Content viewership trends**; mirrored All/Addressable; **Temporal Insights**; responsive **Content affinity** + **TV user behaviour**; notes.

Primary navigation is 64px, Reports active, with Intelligence/Audiences/Creatives/Campaigns displayed; full menu at ≥1024px and collapsed Reports menu below. Theme toggle and JS/Pro avatar are right. Secondary navigation is 56px: Standard active/link; Advanced inert. Header auto-hides/floats after scroll and is revealed by top hover/focus. Canvas max-width is 1440px. Prototype version/comment/annotation overlays are tooling, not product scope.

State hierarchy is staged filters → applied filters → immediate environment → optional consumption scope → module-local state. Applied global/environment changes clear type, genre, affinity, show and migration selections and show skeletons. A type selection synchronizes Channel, Trends and Temporal platform tabs and resets Temporal channel to All.

## Global Filters

All are searchable. Single-select closes after selection; multi-select stays open; search is case-insensitive; no result says “No matches.” Empty multi-selection means inclusive All.

| Filter | Exact options | Default | Behaviour |
|---|---|---|---|
| Country | United Kingdom, Germany, France, Italy, Spain | United Kingdom | All modules after Apply; determines linear inventory/commercial rules |
| Mosaic group | All Mosaic groups; City Prosperity; Prestige Positions; Country Living; Suburban Stability; Rental Hubs; Vintage Value | All Mosaic groups (empty) | All modules after Apply; All clears specifics |
| Age & gender | All genders, Male, Female × 16–24, 25–34, 35–44, 45–54, 55–64, 65+ (18) | All ages & genders (empty) | All modules after Apply |
| TV consumption | All viewers, Heavy TV, Medium TV, Light TV | All viewers | All modules after Apply |
| Children | All households; No children; Children 0–4; Children 5–11; Children 12–17 | All households (empty) | All modules after Apply; All clears specifics |
| Date range | Last 7 days; Last 15 days; Last 30 days; Last 60 days | Last 30 days | All modules after Apply |

Mosaic is rendered in all countries despite being described in code as UK-granular: **Requires product/data clarification**.

Edits are staged until Apply. Initially Apply is disabled. Pending edits enable Apply and do not affect KPIs/PDF. After non-default values are applied, the action becomes Clear all filters; Clear restores six defaults, but not environment/local tabs.

**All / Addressable channels** defaults All, updates immediately, appears twice with one synchronized state, and affects every module. Addressable excludes/reweights market-specific non-commercial inventory. Production classification: **Requires product/data clarification**.

**Export PDF** is immediate and always uses the applied filter/environment state, not un-applied draft values. While exporting, the outline button reads “Exporting…” and is disabled. The export is a paginated portrait A4 capture of the dashboard; the sticky filter bar and prototype overlays are omitted and replaced by a header containing the title, all six applied filter values, viewing environment, export date/time and the synthetic-data notice. The filename is `tv-audience-content-planner-{lowercase market code}-{YYYY-MM-DD}.pdf`. A failure is announced inline as `Export failed: {message}` or “Export failed — please try again.”

## Local Filters

| Module | Control; exact options | Default/dependency/effect |
|---|---|---|
| Type | clickable Linear TV, Streaming, FAST donut/legend | None; click again/removable chip clears; scopes downstream |
| Channel/App | Linear TV, Streaming, Fast tabs | Linear TV; synced by type; changes market inventory |
| Trends | View by show/genre switch | Shows; switching clears show |
| Trends | Linear TV, Streaming, Fast | Linear; synced by type; filters shows/reweights genres |
| Shows | All shows + unique valid shows | All; options depend on platform/type/environment/genre; selection opens detail |
| Genres | 12 rendered genre marks | None; selection toggles and restricts shared show universe |
| Temporal | platform tabs; All channels/apps + valid inventory; 7-day (DoY), 15-day (DoY), 30-day (WoW), 60-day (WoW) | Linear; All; 30-day WoW. Platform rebuilds channels; invalid channel resets All |
| Affinity | FOOD, TRAVEL, COMEDY, DOCUMENTARY, NEWS, MUSIC, LIFESTYLE, SPORTS | current highest Index; updates rank/top-five |
| Behaviour | All shows + valid scoped shows | All resolves to top-indexing show |

The data module’s `TOP_N` options and the `GenreBars`, `ShowsTable`, and `AffinityList` components exist but are not rendered; they are not delivered features. `LOOKBACK` is rendered only as the Temporal Insights lookback control.

## Filter Interaction Matrix

| Filter | Overview | Type | Channel | Trends | Temporal | Affinity | Behaviour |
|---|---:|---:|---:|---:|---:|---:|---:|
| Six applied global filters | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| All/Addressable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Type selection | — | selected | sync | sync/scope | sync | scope | scope |
| Genre selection | — | — | — | show universe | — | —* | shared show universe |
| Module-local controls | — | — | local | local | local | local detail | local |

\* Comments claim genre anchors affinity, but live affinity calculation ignores `selectedGenre`: **Requires product/data clarification**.

## KPI Requirements

### Overview

**User story:** As a dashboard user, I want a concise audience summary so that I can understand its scale and activity before exploring detail. **Business question:** how large and active is the audience?

Six Fiber MetricsTiles: **Total households** (K/M); **Total minutes viewed** (K/M); **Avg. weekly TV consumption – Streaming** (`mins`, Index); **Avg linear TV consumption** (`min/wk`, Index); **Avg. channels/apps per hh** (one decimal, Index); **Weekly TV reach** (`% of hh`, Index). Dimension: applied audience and viewing environment. No click, chart legend or tooltip. Source/calculations: **Requires product/data clarification**.

### Consumption by Type

**User story:** As a dashboard user, I want the viewing mix by media type so that I can choose the environment to investigate downstream. **Business question:** what share of minutes is Linear TV, Streaming or FAST?

Metric: share of viewing minutes, with estimated minutes per household as support. Dimension: media type. Visualisation: 200px donut (r78, stroke30), proportional share %. The clickable legend maps Linear TV to qualitative-4 purple, Streaming to qualitative-3 purple and FAST to qualitative-1 yellow, and shows each type’s one-decimal share. Centre defaults “Share of viewing”; hover or selection shows rounded share/name. Hover thickens the active arc by 4px and dims others to 35%. Arc tooltip: type; `Legend: Share of viewing`; share to one decimal; estimated integer minutes/hh. Legend tooltip omits the `Legend` line and otherwise shows the same metrics. Clicking an arc or legend row toggles the downstream type scope; the removable card chip is an equivalent clear action.

### Time Spent by Channel/App

**User story:** As a dashboard user, I want channel/app consumption ranked within a platform so that I can identify important destinations. **Business question:** which destinations matter?

Metrics: average minutes/week, share of watch time and Index. Dimension: channel/app within the selected Linear TV, Streaming or Fast tab. Up to ten destinations are shown, sorted by minutes, as grouped vertical bars. X=channel/app, >12 chars truncates to 11+ellipsis, supporting `Index N%`. Left Y=Avg min/week, five dynamic integer ticks; right Y=% of watch time, five percent ticks. The two-item legend maps minutes to qualitative-3 purple and percentage to qualitative-1 yellow. Tooltip is exactly: channel/app; `Index: N%`; `Highlight: {Index interpretation}`; `Avg min/week: {integer}`; `% of watch time: {one decimal}%`. Hover/focus dims other categories and applies a category wash. Minimum width 680px with horizontal scroll. No drilldown.

### Content Viewership Trends — Shows

**User story:** As a dashboard user, I want the highest-indexing shows for my audience so that I can inspect a relevant title. **Business question:** which ten shows index highest?

Metrics: average minutes/household, rendered `% of total watch time`, and Index supporting text. Dimension: show, constrained by platform/type/environment/genre. Grouped bars are sorted by Index. X=show + supporting `Index N%`; left Y=Avg min/HH; right Y=`% of total watch time`; independent five-tick scales. The legend maps average minutes/household to qualitative-3 purple and `% of total watch time` to qualitative-1 yellow; no line or Index legend is rendered. Tooltip is exactly: show; `Index: N%`; `Avg min / household: {integer} min`; `% of total watch time: {one decimal}%`. It does **not** include an Index interpretation. Click/category or dependent dropdown opens detail. Alert states top 10/platform. Empty title is “No shows match”; message is “No shows match these filters — change the genre filter or viewing scope.” Data property is `hhPct`/commented household reach but UI says watch time: **Requires product/data clarification**.

### Content Viewership Trends — Genres

**User story:** As a dashboard user, I want genre consumption and Index indicators so that I can constrain the show universe. **Business question:** which IAB genres matter?

Metrics: average minutes/week, share of watch time and Index supporting text. Dimension options: Comedy, News, Film, Sports, Drama, Reality, Action, Documentary, Kids, Travel, Food, Home improvement. The same grouped-bar encoding uses left Y=Avg min/week and right Y=Watch time (%), with independent five-tick scales. The legend maps average minutes/week to qualitative-3 purple and share of watch time to qualitative-1 yellow. X labels show genre plus `Index N%`. Tooltip is exactly: genre; `Index: N%`; `Avg minutes / week: {integer} min`; `Share of watch time: {one decimal}%`; it does not include Index interpretation. Click toggles genre selection and the selected category is exposed as pressed. No direct affinity update occurs in live code.

### Selected Show Consumption Over Time

**User story:** As a dashboard user, I want a selected show’s recent consumption trend so that I can understand its weekly movement. **Business question:** how did audience consumption and households watching change across four weeks?

Four-week dual-line detail. X=Week 1–4; left Y=Avg mins/hh; right Y=Households formatted M; five ticks, maxima 115% of data. Legend: Households watching=qualitative-1 yellow; Avg. minutes watched per household=qualitative-3 purple. Hover/focus shows a dashed vertical guide and tooltip: week; `Households watching: {integer}`; `Avg. minutes / household: {integer}`. Inherits all filters, environment, type, genre and Trends platform. All shows returns; another show switches detail. Relation to Date range: **Requires product/data clarification**.

### Temporal Insights

**User story:** As a dashboard user, I want audience concentration by day and daypart so that I can identify strong viewing windows. **Business question:** when does this audience watch?

Metrics: average minutes watched per household and percentage of households watching. Dimensions: day of week × daypart. The 7×6 heatmap has rows Mon–Sun and columns Early AM, Morning, Daytime, Afternoon, Primetime, Late Night. Each cell directly shows `{minutes}m` and household percentage to one decimal. Tooltip is exactly: `{day} · {daypart}`; `Avg minutes/hh: {minutes}m`; `% households: {one decimal}%`; `Heat intensity: N of 6 (low → high minutes)`. Six-step brand ramp encodes minutes; legend is `Low` → six swatches → `High` · `avg mins watched per household`. Hover/focus adds a selected outline; there is no click. Minimum width 720px with horizontal scroll. DoY/WoW definition: **Requires product/data clarification**.

### Content Affinity

**User story:** As a dashboard user, I want affinity against the national average so that I can identify the audience’s strongest content/lifestyle parameter and related shows. **Business question:** where does this audience over- or under-index, and which shows are associated with the selected parameter?

Metric: Index; detail metrics are viewers and show Index. Dimensions: eight fixed parameters and their mapped shows. Eight-axis radar, Index 0–200, numeric rings 50/100/150/200, dashed national baseline 100, unfilled qualitative-4 primary polygon. Tooltip is exactly: parameter; `Index: N`; `Highlight: {Index interpretation}`; `Baseline: National average = 100`. Pointer and Enter/Space select; selected label is bold/underlined and vertex enlarged. Default is highest Index. Supporting text states “Dashed ring = national average (100). Select a parameter to view its details.” Live detail says `{PARAMETER} — top 5 shows`, `Selected parameter · rank N of 8`, then viewer-ranked rows with list rank, compact viewers and `{index} idx`; rows are not clickable. Taxonomy/mapping/ranking/feed: **Requires product/data clarification**.

### TV User Behaviour

**User story:** As a dashboard user, I want to see post-show migration so that I can understand the audience’s next behaviour and destination. **Business question:** where do source-show viewers go within one hour?

Metric: flow share; supporting calculation displayed as drop from source. Dimensions: source show/network → behaviour → destination show/network or Other/stopped. Custom Sankey uses the top three behaviours from Stay on same channel/Switch channel/Move to streaming app/Stop watching; targets are the two strongest show · network destinations plus Other / stopped watching. “From” and “To” label the columns. Ribbon width=flow share; hover raises the ribbon opacity and dims others. Tooltip is exactly: `{behaviour} → {destination}`; `Flow share: {one decimal}%`; `Drop from source: {100 − flow share, one decimal}%`; `Window: Within 1 hour`. Show filter changes source/subtitle/flows; paths have hover but no keyboard focus, click or drilldown. Minimum 560px with horizontal scroll. A screen-reader-only list exposes every flow, and visible supporting copy identifies the source show/network and width meaning. Cohort, denominator and migration rules: **Requires product/data clarification**.

## KPI Visualisation Matrix

| KPI | User question | Primary metric | Secondary metric | Dimension | Chart | Filters | Drilldown |
|---|---|---|---|---|---|---|---|
| Overview | How large/active is the audience? | six summary metrics | four indices | audience | tiles | global, environment | No |
| Type | What is the viewing mix? | share % | estimated minutes/hh | TV type | donut | global, environment | cross-filter |
| Channel | Which destinations matter? | avg min/week | share, Index | channel/app | dual-axis bars | global, environment, type/tab | No |
| Shows | Which shows index highest? | avg min/hh | rendered share, Index | show | grouped bars | global, environment, type, platform, genre | show detail |
| Genres | Which genres matter? | avg min/week | share, Index | genre | grouped bars | global, environment, type, platform | cross-filter |
| Show detail | How does the show move weekly? | avg min/hh | households | week | dual-axis lines | inherited Shows filters | in-card detail |
| Temporal | When does the audience watch? | avg min/hh | % households | day×daypart | heatmap | global, environment, type/platform, channel/app, lookback | No |
| Affinity | Where does the audience index? | Index | viewers/show Index | parameter/show | radar+list | global, environment, type | in-card parameter detail |
| Behaviour | Where do viewers go next? | flow share | drop from source | migration path | Sankey | global, environment, type, genre, show | No |

## Chart Variations and States

- **Default:** UK/all-audience/last-30-days, All environment, no consumption type or genre selected; Linear TV tabs, Shows view, Temporal All channels/apps and 30-day (WoW); affinity detail resolves to the highest-index parameter; behaviour resolves All shows to the current top-indexing show.
- **Applied-filter/environment state:** all module data re-derives and loading skeletons precede the updated values; cross-filter/detail selections reset. Draft global edits do not alter charts.
- **Type-filtered state:** donut selection remains highlighted and a removable filter chip appears; Channel, Trends and Temporal tabs synchronize to that type, while Shows, genres, affinity and behaviour re-derive within scope. Clearing the type removes the scope but leaves platform tabs where the user last left them.
- **Alternative Trends dimension:** Shows displays the top-ten grouped chart and show dropdown; Genres displays all 12 genre groups and removes the show dropdown/alert. Toggling the switch clears show detail.
- **Show-detail state:** selecting a show replaces the grouped show chart with its four-week dual-line detail and dependent show selector.
- **Temporal alternatives:** platform changes rebuild the channel/app options; channel/app and lookback changes re-derive heatmap cells.
- **Affinity detail state:** selecting a radar parameter replaces the parameter/rank and top-five detail in place.
- **Behaviour source state:** selecting a show changes the subtitle, source copy and Sankey flows.
- **Loading/empty/error:** module skeletons, contextual empty states and inline PDF export error are as specified in Responsive / States. No Phase 1 comparison state exists.

## Chart Specifications

Index 100=national average; 150=50% above. It is not minutes or viewing percentage. Badges use arrow/text plus green/red/neutral. Radar explicitly shows baseline. Channel/show/genre currently append `%` to Index, conflicting with semantics: **Requires product/data clarification**.

Rendered mappings: Linear/primary=`--datavis-qualitative-4` `#7c33b5`; Streaming/secondary=`-3` `#a857e5`; FAST/tertiary=`-1` `#fbbb3b`; additional=`-2` `#ef8736`; line=`-5` `#ee4980`; neutral=`-7` `#e1e1e8`; positive `#115639`; negative `#da294b`; grid `#e1e1e8`; axis `#4b4b59`. Heat ramp: `#f6ebff`, `#e5c9f7`, `#cfa0ee`, `#b06fe0`, `#8a3fc9`, `#661f9e`. Grouped bars/show trend use qualitative-3 for minutes and qualitative-1 for percentage/households. Sankey uses primary, line pink and additional orange.

Tooltips are dark Fiber surfaces, portalled, max 320px/viewport-16px, 8px gap/edge, flip below, reposition on resize/ancestor scroll, and do not capture pointer.

## Drilldowns

Show bar/dropdown → in-card four-week dual-line detail; inherited state as above; All shows or view toggle returns. Radar parameter → in-card top-five detail; another parameter replaces it. Donut and genre are cross-filters, not drilldowns. No channel, heatmap, list-row or Sankey drilldown.

## Cross-KPI Interactions

Type syncs three platform tabs, scopes shows, shifts affinity, and constrains migration (Move to streaming app always targets Streaming). Genre constrains Shows and Behaviour. Affinity selection updates only its detail. Global/environment changes reset cross-filter selections. Channel/heatmap/Sankey hover never filters another card.

## Data Requirements

Known dimensions/metrics are exactly those in the KPI sections. Production source, refresh, identity, household weighting/deduplication, privacy thresholds, aggregation, denominators, taxonomy, aliases, classifications, benchmark, date/week/timezone/daypart logic, rounding/suppression, affinity and migration methodology all **Requires product/data clarification**. Synthetic `seeded/entityModel` logic is not a production specification.

| KPI | Known granularity/time/dependency | Confirmation required |
|---|---|---|
| Overview | one value per applied audience, date range and environment | metric aggregation, denominator and feed |
| Type | media type per applied audience/date/environment | minute aggregation and household estimate |
| Channel/App | channel/app within market and platform; top up to ten by minutes | inventory, aliases, share denominator and benchmark |
| Shows | show within platform/type/environment/genre; top ten by Index | show identity, `hhPct` meaning, share/reach denominator and benchmark |
| Genres | one row per rendered IAB genre within platform/type/environment | taxonomy governance, aggregation and share denominator |
| Show detail | selected show × Week 1–4 with inherited context | relationship between four weeks and global date range |
| Temporal | day × daypart within platform/channel/lookback | timezone, daypart boundaries and DoY/WoW definitions |
| Affinity | audience × parameter; selected parameter × top five shows | mapping, viewers, ranking, Index benchmark and feed |
| Behaviour | source show × behaviour × destination within one hour | cohort, attribution window, denominator, aggregation and migration rules |

## Design System Requirements

Use DM Sans, Fiber typography/spacing/surface/border/shadow/control tokens, MetricsTile, 4px SmartCards with 16px padding, searchable dropdowns, buttons, switch, rounded/underline tabs, chip, Info Alert, skeleton and empty state. Every chart is **Custom visualisation using Fiber design tokens**. Support dark tokens, keyboard selection, accessible names, non-colour cues, truncation and scrolling. No arbitrary chart palette.

## Responsive / States

Overview 2/3/6 columns; media card stacks then 20/80 at `lg`; Trends rows stack then align at `md`; affinity/behaviour stack then 3/7 at `lg`. Dropdown list max-height 220px. Exact framework breakpoints and production category virtualization: **Engineering decision required**.

Applied/global environment changes show tile loading and chart skeletons (~550ms prototype). Empty state uses illustration and contextual copy; Italy+Heavy is prototype-reachable. Export errors appear explicitly. Production API retry/partial errors: **Engineering decision required**.

## Functional Acceptance Criteria

- **Given** staged edits, **when** Apply is pressed, **then** every module updates and cross-filter selections reset.
- **Given** non-default applied filters, **when** Clear is pressed, **then** six filters return to defaults.
- **Given** either environment control, **when** changed, **then** its mirror and all modules update.
- **Given** Overview data, **when** the module renders, **then** all six exact metrics and the four applicable Index indicators use the documented formats and expose no chart interaction.
- **Given** the type donut, **when** an arc is hovered or clicked, or a legend row is hovered, focused or clicked, **then** the documented centre, dimming, tooltip and toggle behaviour appears.
- **Given** a type, **when** selected/cleared, **then** its chip and downstream scope/tabs synchronize or clear as documented.
- **Given** a Channel/App platform tab, **when** it changes, **then** up to ten valid destinations render with independent axes, the documented legend and exact tooltip, with no drilldown.
- **Given** Shows view, **when** platform/type/environment/genre changes, **then** the top-ten show universe, alert and dependent show options update consistently.
- **Given** Shows, **when** a show is selected, **then** four-week dual-axis detail opens; All shows returns.
- **Given** show detail, **when** a weekly point is hovered or focused, **then** both exact values and the dashed guide appear.
- **Given** Genres, **when** a genre is clicked, **then** its selected state toggles and the shared show/behaviour universe updates.
- **Given** Temporal platform changes, **when** a channel becomes invalid, **then** it resets to All.
- **Given** a Temporal cell, **when** hovered or focused, **then** both direct labels, selected outline and exact heat-intensity tooltip are available.
- **Given** a radar parameter, **when** clicked or Enter/Space activated, **then** rank/top-five update.
- **Given** a radar parameter, **when** hovered or focused, **then** its Index, interpretation and national baseline appear exactly as documented.
- **Given** a migration show, **when** selected, **then** source/subtitle/flows update.
- **Given** a Sankey ribbon, **when** hovered, **then** other ribbons dim and the exact path/share/drop/window tooltip appears; no click or keyboard interaction is implied.
- **Given** Export PDF, **when** activated, **then** the applied—not staged—context and rendered dashboard are exported with the documented header, exclusions, pagination and filename, while the button shows its busy state.
- **Given** loading, no-data or export-failure conditions represented by V5, **when** one occurs, **then** the corresponding documented skeleton, contextual empty state or inline error appears.
- **Given** narrow width, **when** a minimum-width chart overflows, **then** its region scrolls without clipping tooltip.
- **Given** Phase 1, **when** used, **then** no Comparison Mode control/state exists.

## Stakeholder Feedback Traceability

| Feedback | V5 solution | KPI / area affected | Status |
|---|---|---|---|
| Shared cards/merged type view | MetricsTile; one 20/80 SmartCard | Overview; Type; Channel/App | Incorporated |
| Addressable wording | All/Addressable rounded tabs | Global environment | Incorporated |
| Unlike metrics need distinct scales | independent dual axes | Channel/App; Shows; Genres; show detail | Incorporated |
| Trends as charts/dynamic dimensions | grouped bars + show/genre switch | Content viewership trends | Incorporated |
| Top-ten/show detail | alert, dependent dropdown, four-week lines | Shows | Incorporated |
| Better Index | arrows/explanation/radar rings | Overview; Channel/App; Trends; Affinity | Incorporated; suffix clarification |
| Dynamic temporal controls | platform-dependent inventory/reset | Temporal Insights | Incorporated |
| Hover/accessibility | portalled tooltips/focus labels | Rendered charts | Incorporated |
| Actionable affinity/Sankey | selected top-five; tokenized flows | Affinity; Behaviour | Incorporated |
| Comparison later | absent | Whole dashboard | Phase 2 |

## Out of Scope / Phase 2

**Comparison Mode is Phase 2**, including comparison controls, series, deltas, legends and tooltips. Also not delivered in rendered V5: the imported/unrendered Top N control and dead chart/list/table components; interaction for the displayed Advanced secondary-navigation label; unrendered drilldowns; and prototype collaboration/version tooling as production product features.

## Implementation Checklist

- **Product:** approve scope/personas/stories/clarifications.
- **Data:** contract every metric/dimension/benchmark/classification/date and relationship.
- **UX/UI:** build wrapper, six cards, controls, detail/state/responsive/theme behaviour.
- **Data visualisation:** exact charts, axes, labels, legends, tooltips, colours and accessibility.
- **Engineering:** staged/applied state, dependencies/resets, cross-KPI chain, PDF, represented errors, responsive/accessibility behaviour and tests; production API, caching and performance architecture is **Engineering decision required**.

## Open Questions / Clarifications

Target roles; feeds/SLAs; every metric denominator; show secondary meaning; Index `%` suffix; non-UK Mosaic; addressable classification; date-vs-week/DoY/WoW; affinity mapping; genre→affinity discrepancy; and migration methodology: **Requires product/data clarification**. Persistence, API retry/partial states, exact breakpoints, browser support and performance limits: **Engineering decision required**.

## Final V5 Cross-Check

- [x] Overview: six tiles.
- [x] Media type: DonutChart + DualAxisBarChart.
- [x] Trends: two ComboChart variants + ShowTrendChart.
- [x] TemporalHeatmap.
- [x] RadarChart + rendered top-five list.
- [x] MigrationSankey.
- [x] Every rendered global/local control, dependency, state, tooltip, wrapper and export.
- [x] Dead components excluded/discrepancies flagged.
- [x] Comparison Mode retained in Phase 2.
# TV Audience & Content Planner — Phase 1 Functional Requirements

**Status:** Production handoff derived from live V5  
**Route:** `/tv-audience-intelligence`  
**Phase boundary:** Phase 1 only. **Comparison Mode remains Phase 2.**

## Executive Summary

V5 is a single-page audience-led dashboard for defining a TV audience, understanding its scale and consumption, discovering platforms/channels/apps and content, inspecting temporal patterns and affinity, and viewing one-hour post-show migration. This specification covers only rendered V5 functionality. Prototype values are deterministic synthetic data, not a production feed. Unknowns use **Requires product/data clarification** or **Engineering decision required**.

## Product Scope

### Purpose, users, goals and use cases

The product supports users who need to: define a market/audience; quantify scale, volume and reach; compare Linear TV, Streaming and FAST; find channels/apps, shows and genres; inspect a show’s four-week trend; find day/daypart concentrations; identify affinity against the national average; inspect post-show behaviour; and export the applied view. V5 does not name personas or permissions: **Requires product/data clarification**.

### Phase 1 Scope

- Standalone Reports wrapper and one dashboard screen.
- Six staged global filters, Apply/Clear, immediate All/Addressable control, PDF export.
- Six Overview metrics.
- Six rendered SmartCards and all rendered visualisations/interactions/states.
- Cross-filtering, dependent controls, show/affinity details, responsive and accessible behaviour.

### User journey

Open Standard Reports → stage audience/date values → Apply → read Overview → select environment/type → inspect channel/app and show/genre performance → open show detail → inspect Temporal Insights → select an affinity parameter → select a migration source → export PDF.

The rendered page heading is **TV Audience & Content Planner**, with subtitle **Cross-platform content and audience consumption insights**.

## Dashboard Architecture

Order: title/subtitle; sticky global filters; **Overview**; All/Addressable; **TV viewership by media type** (Consumption by Type + Time Spent by Channel/App); **Content viewership trends**; mirrored All/Addressable; **Temporal Insights**; responsive **Content affinity** + **TV user behaviour**; notes.

Primary navigation is 64px, Reports active, with Intelligence/Audiences/Creatives/Campaigns displayed; full menu at ≥1024px and collapsed Reports menu below. Theme toggle and JS/Pro avatar are right. Secondary navigation is 56px: Standard active/link; Advanced inert. Header auto-hides/floats after scroll and is revealed by top hover/focus. Canvas max-width is 1440px. Prototype version/comment/annotation overlays are tooling, not product scope.

State hierarchy is staged filters → applied filters → immediate environment → optional consumption scope → module-local state. Applied global/environment changes clear type, genre, affinity, show and migration selections and show skeletons. A type selection synchronizes Channel, Trends and Temporal platform tabs and resets Temporal channel to All.

## Global Filters

All are searchable. Single-select closes after selection; multi-select stays open; search is case-insensitive; no result says “No matches.” Empty multi-selection means inclusive All.

| Filter | Exact options | Default | Behaviour |
|---|---|---|---|
| Country | United Kingdom, Germany, France, Italy, Spain | United Kingdom | All modules after Apply; determines linear inventory/commercial rules |
| Mosaic group | All Mosaic groups; City Prosperity; Prestige Positions; Country Living; Suburban Stability; Rental Hubs; Vintage Value | All Mosaic groups (empty) | All modules after Apply; All clears specifics |
| Age & gender | All genders, Male, Female × 16–24, 25–34, 35–44, 45–54, 55–64, 65+ (18) | All ages & genders (empty) | All modules after Apply |
| TV consumption | All viewers, Heavy TV, Medium TV, Light TV | All viewers | All modules after Apply |
| Children | All households; No children; Children 0–4; Children 5–11; Children 12–17 | All households (empty) | All modules after Apply; All clears specifics |
| Date range | Last 7 days; Last 15 days; Last 30 days; Last 60 days | Last 30 days | All modules after Apply |

Mosaic is rendered in all countries despite being described in code as UK-granular: **Requires product/data clarification**.

Edits are staged until Apply. Initially Apply is disabled. Pending edits enable Apply and do not affect KPIs/PDF. After non-default values are applied, the action becomes Clear all filters; Clear restores six defaults, but not environment/local tabs.

**All / Addressable channels** defaults All, updates immediately, appears twice with one synchronized state, and affects every module. Addressable excludes/reweights market-specific non-commercial inventory. Production classification: **Requires product/data clarification**.

**Export PDF** is immediate and always uses the applied filter/environment state, not un-applied draft values. While exporting, the outline button reads “Exporting…” and is disabled. The export is a paginated portrait A4 capture of the dashboard; the sticky filter bar and prototype overlays are omitted and replaced by a header containing the title, all six applied filter values, viewing environment, export date/time and the synthetic-data notice. The filename is `tv-audience-content-planner-{lowercase market code}-{YYYY-MM-DD}.pdf`. A failure is announced inline as `Export failed: {message}` or “Export failed — please try again.”

## Local Filters

| Module | Control; exact options | Default/dependency/effect |
|---|---|---|
| Type | clickable Linear TV, Streaming, FAST donut/legend | None; click again/removable chip clears; scopes downstream |
| Channel/App | Linear TV, Streaming, Fast tabs | Linear TV; synced by type; changes market inventory |
| Trends | View by show/genre switch | Shows; switching clears show |
| Trends | Linear TV, Streaming, Fast | Linear; synced by type; filters shows/reweights genres |
| Shows | All shows + unique valid shows | All; options depend on platform/type/environment/genre; selection opens detail |
| Genres | 12 rendered genre marks | None; selection toggles and restricts shared show universe |
| Temporal | platform tabs; All channels/apps + valid inventory; 7-day (DoY), 15-day (DoY), 30-day (WoW), 60-day (WoW) | Linear; All; 30-day WoW. Platform rebuilds channels; invalid channel resets All |
| Affinity | FOOD, TRAVEL, COMEDY, DOCUMENTARY, NEWS, MUSIC, LIFESTYLE, SPORTS | current highest Index; updates rank/top-five |
| Behaviour | All shows + valid scoped shows | All resolves to top-indexing show |

The data module’s `TOP_N` options and the `GenreBars`, `ShowsTable`, and `AffinityList` components exist but are not rendered; they are not delivered features. `LOOKBACK` is rendered only as the Temporal Insights lookback control.

## Filter Interaction Matrix

| Filter | Overview | Type | Channel | Trends | Temporal | Affinity | Behaviour |
|---|---:|---:|---:|---:|---:|---:|---:|
| Six applied global filters | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| All/Addressable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Type selection | — | selected | sync | sync/scope | sync | scope | scope |
| Genre selection | — | — | — | show universe | — | —* | shared show universe |
| Module-local controls | — | — | local | local | local | local detail | local |

\* Comments claim genre anchors affinity, but live affinity calculation ignores `selectedGenre`: **Requires product/data clarification**.

## KPI Requirements

### Overview

**User story:** As a dashboard user, I want a concise audience summary so that I can understand its scale and activity before exploring detail. **Business question:** how large and active is the audience?

Six Fiber MetricsTiles: **Total households** (K/M); **Total minutes viewed** (K/M); **Avg. weekly TV consumption – Streaming** (`mins`, Index); **Avg linear TV consumption** (`min/wk`, Index); **Avg. channels/apps per hh** (one decimal, Index); **Weekly TV reach** (`% of hh`, Index). Dimension: applied audience and viewing environment. No click, chart legend or tooltip. Source/calculations: **Requires product/data clarification**.

### Consumption by Type

**User story:** As a dashboard user, I want the viewing mix by media type so that I can choose the environment to investigate downstream. **Business question:** what share of minutes is Linear TV, Streaming or FAST?

Metric: share of viewing minutes, with estimated minutes per household as support. Dimension: media type. Visualisation: 200px donut (r78, stroke30), proportional share %. The clickable legend maps Linear TV to qualitative-4 purple, Streaming to qualitative-3 purple and FAST to qualitative-1 yellow, and shows each type’s one-decimal share. Centre defaults “Share of viewing”; hover or selection shows rounded share/name. Hover thickens the active arc by 4px and dims others to 35%. Arc tooltip: type; `Legend: Share of viewing`; share to one decimal; estimated integer minutes/hh. Legend tooltip omits the `Legend` line and otherwise shows the same metrics. Clicking an arc or legend row toggles the downstream type scope; the removable card chip is an equivalent clear action.

### Time Spent by Channel/App

**User story:** As a dashboard user, I want channel/app consumption ranked within a platform so that I can identify important destinations. **Business question:** which destinations matter?

Metrics: average minutes/week, share of watch time and Index. Dimension: channel/app within the selected Linear TV, Streaming or Fast tab. Up to ten destinations are shown, sorted by minutes, as grouped vertical bars. X=channel/app, >12 chars truncates to 11+ellipsis, supporting `Index N%`. Left Y=Avg min/week, five dynamic integer ticks; right Y=% of watch time, five percent ticks. The two-item legend maps minutes to qualitative-3 purple and percentage to qualitative-1 yellow. Tooltip is exactly: channel/app; `Index: N%`; `Highlight: {Index interpretation}`; `Avg min/week: {integer}`; `% of watch time: {one decimal}%`. Hover/focus dims other categories and applies a category wash. Minimum width 680px with horizontal scroll. No drilldown.

### Content Viewership Trends — Shows

**User story:** As a dashboard user, I want the highest-indexing shows for my audience so that I can inspect a relevant title. **Business question:** which ten shows index highest?

Metrics: average minutes/household, rendered `% of total watch time`, and Index supporting text. Dimension: show, constrained by platform/type/environment/genre. Grouped bars are sorted by Index. X=show + supporting `Index N%`; left Y=Avg min/HH; right Y=`% of total watch time`; independent five-tick scales. The legend maps average minutes/household to qualitative-3 purple and `% of total watch time` to qualitative-1 yellow; no line or Index legend is rendered. Tooltip is exactly: show; `Index: N%`; `Avg min / household: {integer} min`; `% of total watch time: {one decimal}%`. It does **not** include an Index interpretation. Click/category or dependent dropdown opens detail. Alert states top 10/platform. Empty title is “No shows match”; message is “No shows match these filters — change the genre filter or viewing scope.” Data property is `hhPct`/commented household reach but UI says watch time: **Requires product/data clarification**.

### Content Viewership Trends — Genres

**User story:** As a dashboard user, I want genre consumption and Index indicators so that I can constrain the show universe. **Business question:** which IAB genres matter?

Metrics: average minutes/week, share of watch time and Index supporting text. Dimension options: Comedy, News, Film, Sports, Drama, Reality, Action, Documentary, Kids, Travel, Food, Home improvement. The same grouped-bar encoding uses left Y=Avg min/week and right Y=Watch time (%), with independent five-tick scales. The legend maps average minutes/week to qualitative-3 purple and share of watch time to qualitative-1 yellow. X labels show genre plus `Index N%`. Tooltip is exactly: genre; `Index: N%`; `Avg minutes / week: {integer} min`; `Share of watch time: {one decimal}%`; it does not include Index interpretation. Click toggles genre selection and the selected category is exposed as pressed. No direct affinity update occurs in live code.

### Selected Show Consumption Over Time

**User story:** As a dashboard user, I want a selected show’s recent consumption trend so that I can understand its weekly movement. **Business question:** how did audience consumption and households watching change across four weeks?

Four-week dual-line detail. X=Week 1–4; left Y=Avg mins/hh; right Y=Households formatted M; five ticks, maxima 115% of data. Legend: Households watching=qualitative-1 yellow; Avg. minutes watched per household=qualitative-3 purple. Hover/focus shows a dashed vertical guide and tooltip: week; `Households watching: {integer}`; `Avg. minutes / household: {integer}`. Inherits all filters, environment, type, genre and Trends platform. All shows returns; another show switches detail. Relation to Date range: **Requires product/data clarification**.

### Temporal Insights

**User story:** As a dashboard user, I want audience concentration by day and daypart so that I can identify strong viewing windows. **Business question:** when does this audience watch?

Metrics: average minutes watched per household and percentage of households watching. Dimensions: day of week × daypart. The 7×6 heatmap has rows Mon–Sun and columns Early AM, Morning, Daytime, Afternoon, Primetime, Late Night. Each cell directly shows `{minutes}m` and household percentage to one decimal. Tooltip is exactly: `{day} · {daypart}`; `Avg minutes/hh: {minutes}m`; `% households: {one decimal}%`; `Heat intensity: N of 6 (low → high minutes)`. Six-step brand ramp encodes minutes; legend is `Low` → six swatches → `High` · `avg mins watched per household`. Hover/focus adds a selected outline; there is no click. Minimum width 720px with horizontal scroll. DoY/WoW definition: **Requires product/data clarification**.

### Content Affinity

**User story:** As a dashboard user, I want affinity against the national average so that I can identify the audience’s strongest content/lifestyle parameter and related shows. **Business question:** where does this audience over- or under-index, and which shows are associated with the selected parameter?

Metric: Index; detail metrics are viewers and show Index. Dimensions: eight fixed parameters and their mapped shows. Eight-axis radar, Index 0–200, numeric rings 50/100/150/200, dashed national baseline 100, unfilled qualitative-4 primary polygon. Tooltip is exactly: parameter; `Index: N`; `Highlight: {Index interpretation}`; `Baseline: National average = 100`. Pointer and Enter/Space select; selected label is bold/underlined and vertex enlarged. Default is highest Index. Supporting text states “Dashed ring = national average (100). Select a parameter to view its details.” Live detail says `{PARAMETER} — top 5 shows`, `Selected parameter · rank N of 8`, then viewer-ranked rows with list rank, compact viewers and `{index} idx`; rows are not clickable. Taxonomy/mapping/ranking/feed: **Requires product/data clarification**.

### TV User Behaviour

**User story:** As a dashboard user, I want to see post-show migration so that I can understand the audience’s next behaviour and destination. **Business question:** where do source-show viewers go within one hour?

Metric: flow share; supporting calculation displayed as drop from source. Dimensions: source show/network → behaviour → destination show/network or Other/stopped. Custom Sankey uses the top three behaviours from Stay on same channel/Switch channel/Move to streaming app/Stop watching; targets are the two strongest show · network destinations plus Other / stopped watching. “From” and “To” label the columns. Ribbon width=flow share; hover raises the ribbon opacity and dims others. Tooltip is exactly: `{behaviour} → {destination}`; `Flow share: {one decimal}%`; `Drop from source: {100 − flow share, one decimal}%`; `Window: Within 1 hour`. Show filter changes source/subtitle/flows; paths have hover but no keyboard focus, click or drilldown. Minimum 560px with horizontal scroll. A screen-reader-only list exposes every flow, and visible supporting copy identifies the source show/network and width meaning. Cohort, denominator and migration rules: **Requires product/data clarification**.

## KPI Visualisation Matrix

| KPI | User question | Primary metric | Secondary metric | Dimension | Chart | Filters | Drilldown |
|---|---|---|---|---|---|---|---|
| Overview | How large/active is the audience? | six summary metrics | four indices | audience | tiles | global, environment | No |
| Type | What is the viewing mix? | share % | estimated minutes/hh | TV type | donut | global, environment | cross-filter |
| Channel | Which destinations matter? | avg min/week | share, Index | channel/app | dual-axis bars | global, environment, type/tab | No |
| Shows | Which shows index highest? | avg min/hh | rendered share, Index | show | grouped bars | global, environment, type, platform, genre | show detail |
| Genres | Which genres matter? | avg min/week | share, Index | genre | grouped bars | global, environment, type, platform | cross-filter |
| Show detail | How does the show move weekly? | avg min/hh | households | week | dual-axis lines | inherited Shows filters | in-card detail |
| Temporal | When does the audience watch? | avg min/hh | % households | day×daypart | heatmap | global, environment, type/platform, channel/app, lookback | No |
| Affinity | Where does the audience index? | Index | viewers/show Index | parameter/show | radar+list | global, environment, type | in-card parameter detail |
| Behaviour | Where do viewers go next? | flow share | drop from source | migration path | Sankey | global, environment, type, genre, show | No |

## Chart Variations and States

- **Default:** UK/all-audience/last-30-days, All environment, no consumption type or genre selected; Linear TV tabs, Shows view, Temporal All channels/apps and 30-day (WoW); affinity detail resolves to the highest-index parameter; behaviour resolves All shows to the current top-indexing show.
- **Applied-filter/environment state:** all module data re-derives and loading skeletons precede the updated values; cross-filter/detail selections reset. Draft global edits do not alter charts.
- **Type-filtered state:** donut selection remains highlighted and a removable filter chip appears; Channel, Trends and Temporal tabs synchronize to that type, while Shows, genres, affinity and behaviour re-derive within scope. Clearing the type removes the scope but leaves platform tabs where the user last left them.
- **Alternative Trends dimension:** Shows displays the top-ten grouped chart and show dropdown; Genres displays all 12 genre groups and removes the show dropdown/alert. Toggling the switch clears show detail.
- **Show-detail state:** selecting a show replaces the grouped show chart with its four-week dual-line detail and dependent show selector.
- **Temporal alternatives:** platform changes rebuild the channel/app options; channel/app and lookback changes re-derive heatmap cells.
- **Affinity detail state:** selecting a radar parameter replaces the parameter/rank and top-five detail in place.
- **Behaviour source state:** selecting a show changes the subtitle, source copy and Sankey flows.
- **Loading/empty/error:** module skeletons, contextual empty states and inline PDF export error are as specified in Responsive / States. No Phase 1 comparison state exists.

## Chart Specifications

Index 100=national average; 150=50% above. It is not minutes or viewing percentage. Badges use arrow/text plus green/red/neutral. Radar explicitly shows baseline. Channel/show/genre currently append `%` to Index, conflicting with semantics: **Requires product/data clarification**.

Rendered mappings: Linear/primary=`--datavis-qualitative-4` `#7c33b5`; Streaming/secondary=`-3` `#a857e5`; FAST/tertiary=`-1` `#fbbb3b`; additional=`-2` `#ef8736`; line=`-5` `#ee4980`; neutral=`-7` `#e1e1e8`; positive `#115639`; negative `#da294b`; grid `#e1e1e8`; axis `#4b4b59`. Heat ramp: `#f6ebff`, `#e5c9f7`, `#cfa0ee`, `#b06fe0`, `#8a3fc9`, `#661f9e`. Grouped bars/show trend use qualitative-3 for minutes and qualitative-1 for percentage/households. Sankey uses primary, line pink and additional orange.

Tooltips are dark Fiber surfaces, portalled, max 320px/viewport-16px, 8px gap/edge, flip below, reposition on resize/ancestor scroll, and do not capture pointer.

## Drilldowns

Show bar/dropdown → in-card four-week dual-line detail; inherited state as above; All shows or view toggle returns. Radar parameter → in-card top-five detail; another parameter replaces it. Donut and genre are cross-filters, not drilldowns. No channel, heatmap, list-row or Sankey drilldown.

## Cross-KPI Interactions

Type syncs three platform tabs, scopes shows, shifts affinity, and constrains migration (Move to streaming app always targets Streaming). Genre constrains Shows and Behaviour. Affinity selection updates only its detail. Global/environment changes reset cross-filter selections. Channel/heatmap/Sankey hover never filters another card.

## Data Requirements

Known dimensions/metrics are exactly those in the KPI sections. Production source, refresh, identity, household weighting/deduplication, privacy thresholds, aggregation, denominators, taxonomy, aliases, classifications, benchmark, date/week/timezone/daypart logic, rounding/suppression, affinity and migration methodology all **Requires product/data clarification**. Synthetic `seeded/entityModel` logic is not a production specification.

| KPI | Known granularity/time/dependency | Confirmation required |
|---|---|---|
| Overview | one value per applied audience, date range and environment | metric aggregation, denominator and feed |
| Type | media type per applied audience/date/environment | minute aggregation and household estimate |
| Channel/App | channel/app within market and platform; top up to ten by minutes | inventory, aliases, share denominator and benchmark |
| Shows | show within platform/type/environment/genre; top ten by Index | show identity, `hhPct` meaning, share/reach denominator and benchmark |
| Genres | one row per rendered IAB genre within platform/type/environment | taxonomy governance, aggregation and share denominator |
| Show detail | selected show × Week 1–4 with inherited context | relationship between four weeks and global date range |
| Temporal | day × daypart within platform/channel/lookback | timezone, daypart boundaries and DoY/WoW definitions |
| Affinity | audience × parameter; selected parameter × top five shows | mapping, viewers, ranking, Index benchmark and feed |
| Behaviour | source show × behaviour × destination within one hour | cohort, attribution window, denominator, aggregation and migration rules |

## Design System Requirements

Use DM Sans, Fiber typography/spacing/surface/border/shadow/control tokens, MetricsTile, 4px SmartCards with 16px padding, searchable dropdowns, buttons, switch, rounded/underline tabs, chip, Info Alert, skeleton and empty state. Every chart is **Custom visualisation using Fiber design tokens**. Support dark tokens, keyboard selection, accessible names, non-colour cues, truncation and scrolling. No arbitrary chart palette.

## Responsive / States

Overview 2/3/6 columns; media card stacks then 20/80 at `lg`; Trends rows stack then align at `md`; affinity/behaviour stack then 3/7 at `lg`. Dropdown list max-height 220px. Exact framework breakpoints and production category virtualization: **Engineering decision required**.

Applied/global environment changes show tile loading and chart skeletons (~550ms prototype). Empty state uses illustration and contextual copy; Italy+Heavy is prototype-reachable. Export errors appear explicitly. Production API retry/partial errors: **Engineering decision required**.

## Functional Acceptance Criteria

- **Given** staged edits, **when** Apply is pressed, **then** every module updates and cross-filter selections reset.
- **Given** non-default applied filters, **when** Clear is pressed, **then** six filters return to defaults.
- **Given** either environment control, **when** changed, **then** its mirror and all modules update.
- **Given** Overview data, **when** the module renders, **then** all six exact metrics and the four applicable Index indicators use the documented formats and expose no chart interaction.
- **Given** the type donut, **when** an arc is hovered or clicked, or a legend row is hovered, focused or clicked, **then** the documented centre, dimming, tooltip and toggle behaviour appears.
- **Given** a type, **when** selected/cleared, **then** its chip and downstream scope/tabs synchronize or clear as documented.
- **Given** a Channel/App platform tab, **when** it changes, **then** up to ten valid destinations render with independent axes, the documented legend and exact tooltip, with no drilldown.
- **Given** Shows view, **when** platform/type/environment/genre changes, **then** the top-ten show universe, alert and dependent show options update consistently.
- **Given** Shows, **when** a show is selected, **then** four-week dual-axis detail opens; All shows returns.
- **Given** show detail, **when** a weekly point is hovered or focused, **then** both exact values and the dashed guide appear.
- **Given** Genres, **when** a genre is clicked, **then** its selected state toggles and the shared show/behaviour universe updates.
- **Given** Temporal platform changes, **when** a channel becomes invalid, **then** it resets to All.
- **Given** a Temporal cell, **when** hovered or focused, **then** both direct labels, selected outline and exact heat-intensity tooltip are available.
- **Given** a radar parameter, **when** clicked or Enter/Space activated, **then** rank/top-five update.
- **Given** a radar parameter, **when** hovered or focused, **then** its Index, interpretation and national baseline appear exactly as documented.
- **Given** a migration show, **when** selected, **then** source/subtitle/flows update.
- **Given** a Sankey ribbon, **when** hovered, **then** other ribbons dim and the exact path/share/drop/window tooltip appears; no click or keyboard interaction is implied.
- **Given** Export PDF, **when** activated, **then** the applied—not staged—context and rendered dashboard are exported with the documented header, exclusions, pagination and filename, while the button shows its busy state.
- **Given** loading, no-data or export-failure conditions represented by V5, **when** one occurs, **then** the corresponding documented skeleton, contextual empty state or inline error appears.
- **Given** narrow width, **when** a minimum-width chart overflows, **then** its region scrolls without clipping tooltip.
- **Given** Phase 1, **when** used, **then** no Comparison Mode control/state exists.

## Stakeholder Feedback Traceability

| Feedback | V5 solution | KPI / area affected | Status |
|---|---|---|---|
| Shared cards/merged type view | MetricsTile; one 20/80 SmartCard | Overview; Type; Channel/App | Incorporated |
| Addressable wording | All/Addressable rounded tabs | Global environment | Incorporated |
| Unlike metrics need distinct scales | independent dual axes | Channel/App; Shows; Genres; show detail | Incorporated |
| Trends as charts/dynamic dimensions | grouped bars + show/genre switch | Content viewership trends | Incorporated |
| Top-ten/show detail | alert, dependent dropdown, four-week lines | Shows | Incorporated |
| Better Index | arrows/explanation/radar rings | Overview; Channel/App; Trends; Affinity | Incorporated; suffix clarification |
| Dynamic temporal controls | platform-dependent inventory/reset | Temporal Insights | Incorporated |
| Hover/accessibility | portalled tooltips/focus labels | Rendered charts | Incorporated |
| Actionable affinity/Sankey | selected top-five; tokenized flows | Affinity; Behaviour | Incorporated |
| Comparison later | absent | Whole dashboard | Phase 2 |

## Out of Scope / Phase 2

**Comparison Mode is Phase 2**, including comparison controls, series, deltas, legends and tooltips. Also not delivered in rendered V5: the imported/unrendered Top N control and dead chart/list/table components; interaction for the displayed Advanced secondary-navigation label; unrendered drilldowns; and prototype collaboration/version tooling as production product features.

## Implementation Checklist

- **Product:** approve scope/personas/stories/clarifications.
- **Data:** contract every metric/dimension/benchmark/classification/date and relationship.
- **UX/UI:** build wrapper, six cards, controls, detail/state/responsive/theme behaviour.
- **Data visualisation:** exact charts, axes, labels, legends, tooltips, colours and accessibility.
- **Engineering:** staged/applied state, dependencies/resets, cross-KPI chain, PDF, represented errors, responsive/accessibility behaviour and tests; production API, caching and performance architecture is **Engineering decision required**.

## Open Questions / Clarifications

Target roles; feeds/SLAs; every metric denominator; show secondary meaning; Index `%` suffix; non-UK Mosaic; addressable classification; date-vs-week/DoY/WoW; affinity mapping; genre→affinity discrepancy; and migration methodology: **Requires product/data clarification**. Persistence, API retry/partial states, exact breakpoints, browser support and performance limits: **Engineering decision required**.

## Final V5 Cross-Check

- [x] Overview: six tiles.
- [x] Media type: DonutChart + DualAxisBarChart.
- [x] Trends: two ComboChart variants + ShowTrendChart.
- [x] TemporalHeatmap.
- [x] RadarChart + rendered top-five list.
- [x] MigrationSankey.
- [x] Every rendered global/local control, dependency, state, tooltip, wrapper and export.
- [x] Dead components excluded/discrepancies flagged.
- [x] Comparison Mode retained in Phase 2.
# TV Audience & Content Planner — Phase 1 Functional Requirements

**Status:** Production handoff derived from live V5  
**Route:** `/tv-audience-intelligence`  
**Phase boundary:** Phase 1 only. **Comparison Mode remains Phase 2.**

## Executive Summary

V5 is a single-page audience-led dashboard for defining a TV audience, understanding its scale and consumption, discovering platforms/channels/apps and content, inspecting temporal patterns and affinity, and viewing one-hour post-show migration. This specification covers only rendered V5 functionality. Prototype values are deterministic synthetic data, not a production feed. Unknowns use **Requires product/data clarification** or **Engineering decision required**.

## Product Scope

### Purpose, users, goals and use cases

The product supports users who need to: define a market/audience; quantify scale, volume and reach; compare Linear TV, Streaming and FAST; find channels/apps, shows and genres; inspect a show’s four-week trend; find day/daypart concentrations; identify affinity against the national average; inspect post-show behaviour; and export the applied view. V5 does not name personas or permissions: **Requires product/data clarification**.

### Phase 1 Scope

- Standalone Reports wrapper and one dashboard screen.
- Six staged global filters, Apply/Clear, immediate All/Addressable control, PDF export.
- Six Overview metrics.
- Six rendered SmartCards and all rendered visualisations/interactions/states.
- Cross-filtering, dependent controls, show/affinity details, responsive and accessible behaviour.

### User journey

Open Standard Reports → stage audience/date values → Apply → read Overview → select environment/type → inspect channel/app and show/genre performance → open show detail → inspect Temporal Insights → select an affinity parameter → select a migration source → export PDF.

The rendered page heading is **TV Audience & Content Planner**, with subtitle **Cross-platform content and audience consumption insights**.

## Dashboard Architecture

Order: title/subtitle; sticky global filters; **Overview**; All/Addressable; **TV viewership by media type** (Consumption by Type + Time Spent by Channel/App); **Content viewership trends**; mirrored All/Addressable; **Temporal Insights**; responsive **Content affinity** + **TV user behaviour**; notes.

Primary navigation is 64px, Reports active, with Intelligence/Audiences/Creatives/Campaigns displayed; full menu at ≥1024px and collapsed Reports menu below. Theme toggle and JS/Pro avatar are right. Secondary navigation is 56px: Standard active/link; Advanced inert. Header auto-hides/floats after scroll and is revealed by top hover/focus. Canvas max-width is 1440px. Prototype version/comment/annotation overlays are tooling, not product scope.

State hierarchy is staged filters → applied filters → immediate environment → optional consumption scope → module-local state. Applied global/environment changes clear type, genre, affinity, show and migration selections and show skeletons. A type selection synchronizes Channel, Trends and Temporal platform tabs and resets Temporal channel to All.

## Global Filters

All are searchable. Single-select closes after selection; multi-select stays open; search is case-insensitive; no result says “No matches.” Empty multi-selection means inclusive All.

| Filter | Exact options | Default | Behaviour |
|---|---|---|---|
| Country | United Kingdom, Germany, France, Italy, Spain | United Kingdom | All modules after Apply; determines linear inventory/commercial rules |
| Mosaic group | All Mosaic groups; City Prosperity; Prestige Positions; Country Living; Suburban Stability; Rental Hubs; Vintage Value | All Mosaic groups (empty) | All modules after Apply; All clears specifics |
| Age & gender | All genders, Male, Female × 16–24, 25–34, 35–44, 45–54, 55–64, 65+ (18) | All ages & genders (empty) | All modules after Apply |
| TV consumption | All viewers, Heavy TV, Medium TV, Light TV | All viewers | All modules after Apply |
| Children | All households; No children; Children 0–4; Children 5–11; Children 12–17 | All households (empty) | All modules after Apply; All clears specifics |
| Date range | Last 7 days; Last 15 days; Last 30 days; Last 60 days | Last 30 days | All modules after Apply |

Mosaic is rendered in all countries despite being described in code as UK-granular: **Requires product/data clarification**.

Edits are staged until Apply. Initially Apply is disabled. Pending edits enable Apply and do not affect KPIs/PDF. After non-default values are applied, the action becomes Clear all filters; Clear restores six defaults, but not environment/local tabs.

**All / Addressable channels** defaults All, updates immediately, appears twice with one synchronized state, and affects every module. Addressable excludes/reweights market-specific non-commercial inventory. Production classification: **Requires product/data clarification**.

**Export PDF** is immediate and always uses the applied filter/environment state, not un-applied draft values. While exporting, the outline button reads “Exporting…” and is disabled. The export is a paginated portrait A4 capture of the dashboard; the sticky filter bar and prototype overlays are omitted and replaced by a header containing the title, all six applied filter values, viewing environment, export date/time and the synthetic-data notice. The filename is `tv-audience-content-planner-{lowercase market code}-{YYYY-MM-DD}.pdf`. A failure is announced inline as `Export failed: {message}` or “Export failed — please try again.”

## Local Filters

| Module | Control; exact options | Default/dependency/effect |
|---|---|---|
| Type | clickable Linear TV, Streaming, FAST donut/legend | None; click again/removable chip clears; scopes downstream |
| Channel/App | Linear TV, Streaming, Fast tabs | Linear TV; synced by type; changes market inventory |
| Trends | View by show/genre switch | Shows; switching clears show |
| Trends | Linear TV, Streaming, Fast | Linear; synced by type; filters shows/reweights genres |
| Shows | All shows + unique valid shows | All; options depend on platform/type/environment/genre; selection opens detail |
| Genres | 12 rendered genre marks | None; selection toggles and restricts shared show universe |
| Temporal | platform tabs; All channels/apps + valid inventory; 7-day (DoY), 15-day (DoY), 30-day (WoW), 60-day (WoW) | Linear; All; 30-day WoW. Platform rebuilds channels; invalid channel resets All |
| Affinity | FOOD, TRAVEL, COMEDY, DOCUMENTARY, NEWS, MUSIC, LIFESTYLE, SPORTS | current highest Index; updates rank/top-five |
| Behaviour | All shows + valid scoped shows | All resolves to top-indexing show |

The data module’s `TOP_N` options and the `GenreBars`, `ShowsTable`, and `AffinityList` components exist but are not rendered; they are not delivered features. `LOOKBACK` is rendered only as the Temporal Insights lookback control.

## Filter Interaction Matrix

| Filter | Overview | Type | Channel | Trends | Temporal | Affinity | Behaviour |
|---|---:|---:|---:|---:|---:|---:|---:|
| Six applied global filters | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| All/Addressable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Type selection | — | selected | sync | sync/scope | sync | scope | scope |
| Genre selection | — | — | — | show universe | — | —* | shared show universe |
| Module-local controls | — | — | local | local | local | local detail | local |

\* Comments claim genre anchors affinity, but live affinity calculation ignores `selectedGenre`: **Requires product/data clarification**.

## KPI Requirements

### Overview

**User story:** As a dashboard user, I want a concise audience summary so that I can understand its scale and activity before exploring detail. **Business question:** how large and active is the audience?

Six Fiber MetricsTiles: **Total households** (K/M); **Total minutes viewed** (K/M); **Avg. weekly TV consumption – Streaming** (`mins`, Index); **Avg linear TV consumption** (`min/wk`, Index); **Avg. channels/apps per hh** (one decimal, Index); **Weekly TV reach** (`% of hh`, Index). Dimension: applied audience and viewing environment. No click, chart legend or tooltip. Source/calculations: **Requires product/data clarification**.

### Consumption by Type

**User story:** As a dashboard user, I want the viewing mix by media type so that I can choose the environment to investigate downstream. **Business question:** what share of minutes is Linear TV, Streaming or FAST?

Metric: share of viewing minutes, with estimated minutes per household as support. Dimension: media type. Visualisation: 200px donut (r78, stroke30), proportional share %. The clickable legend maps Linear TV to qualitative-4 purple, Streaming to qualitative-3 purple and FAST to qualitative-1 yellow, and shows each type’s one-decimal share. Centre defaults “Share of viewing”; hover or selection shows rounded share/name. Hover thickens the active arc by 4px and dims others to 35%. Arc tooltip: type; `Legend: Share of viewing`; share to one decimal; estimated integer minutes/hh. Legend tooltip omits the `Legend` line and otherwise shows the same metrics. Clicking an arc or legend row toggles the downstream type scope; the removable card chip is an equivalent clear action.

### Time Spent by Channel/App

**User story:** As a dashboard user, I want channel/app consumption ranked within a platform so that I can identify important destinations. **Business question:** which destinations matter?

Metrics: average minutes/week, share of watch time and Index. Dimension: channel/app within the selected Linear TV, Streaming or Fast tab. Up to ten destinations are shown, sorted by minutes, as grouped vertical bars. X=channel/app, >12 chars truncates to 11+ellipsis, supporting `Index N%`. Left Y=Avg min/week, five dynamic integer ticks; right Y=% of watch time, five percent ticks. The two-item legend maps minutes to qualitative-3 purple and percentage to qualitative-1 yellow. Tooltip is exactly: channel/app; `Index: N%`; `Highlight: {Index interpretation}`; `Avg min/week: {integer}`; `% of watch time: {one decimal}%`. Hover/focus dims other categories and applies a category wash. Minimum width 680px with horizontal scroll. No drilldown.

### Content Viewership Trends — Shows

**User story:** As a dashboard user, I want the highest-indexing shows for my audience so that I can inspect a relevant title. **Business question:** which ten shows index highest?

Metrics: average minutes/household, rendered `% of total watch time`, and Index supporting text. Dimension: show, constrained by platform/type/environment/genre. Grouped bars are sorted by Index. X=show + supporting `Index N%`; left Y=Avg min/HH; right Y=`% of total watch time`; independent five-tick scales. The legend maps average minutes/household to qualitative-3 purple and `% of total watch time` to qualitative-1 yellow; no line or Index legend is rendered. Tooltip is exactly: show; `Index: N%`; `Avg min / household: {integer} min`; `% of total watch time: {one decimal}%`. It does **not** include an Index interpretation. Click/category or dependent dropdown opens detail. Alert states top 10/platform. Empty title is “No shows match”; message is “No shows match these filters — change the genre filter or viewing scope.” Data property is `hhPct`/commented household reach but UI says watch time: **Requires product/data clarification**.

### Content Viewership Trends — Genres

**User story:** As a dashboard user, I want genre consumption and Index indicators so that I can constrain the show universe. **Business question:** which IAB genres matter?

Metrics: average minutes/week, share of watch time and Index supporting text. Dimension options: Comedy, News, Film, Sports, Drama, Reality, Action, Documentary, Kids, Travel, Food, Home improvement. The same grouped-bar encoding uses left Y=Avg min/week and right Y=Watch time (%), with independent five-tick scales. The legend maps average minutes/week to qualitative-3 purple and share of watch time to qualitative-1 yellow. X labels show genre plus `Index N%`. Tooltip is exactly: genre; `Index: N%`; `Avg minutes / week: {integer} min`; `Share of watch time: {one decimal}%`; it does not include Index interpretation. Click toggles genre selection and the selected category is exposed as pressed. No direct affinity update occurs in live code.

### Selected Show Consumption Over Time

**User story:** As a dashboard user, I want a selected show’s recent consumption trend so that I can understand its weekly movement. **Business question:** how did audience consumption and households watching change across four weeks?

Four-week dual-line detail. X=Week 1–4; left Y=Avg mins/hh; right Y=Households formatted M; five ticks, maxima 115% of data. Legend: Households watching=qualitative-1 yellow; Avg. minutes watched per household=qualitative-3 purple. Hover/focus shows a dashed vertical guide and tooltip: week; `Households watching: {integer}`; `Avg. minutes / household: {integer}`. Inherits all filters, environment, type, genre and Trends platform. All shows returns; another show switches detail. Relation to Date range: **Requires product/data clarification**.

### Temporal Insights

**User story:** As a dashboard user, I want audience concentration by day and daypart so that I can identify strong viewing windows. **Business question:** when does this audience watch?

Metrics: average minutes watched per household and percentage of households watching. Dimensions: day of week × daypart. The 7×6 heatmap has rows Mon–Sun and columns Early AM, Morning, Daytime, Afternoon, Primetime, Late Night. Each cell directly shows `{minutes}m` and household percentage to one decimal. Tooltip is exactly: `{day} · {daypart}`; `Avg minutes/hh: {minutes}m`; `% households: {one decimal}%`; `Heat intensity: N of 6 (low → high minutes)`. Six-step brand ramp encodes minutes; legend is `Low` → six swatches → `High` · `avg mins watched per household`. Hover/focus adds a selected outline; there is no click. Minimum width 720px with horizontal scroll. DoY/WoW definition: **Requires product/data clarification**.

### Content Affinity

**User story:** As a dashboard user, I want affinity against the national average so that I can identify the audience’s strongest content/lifestyle parameter and related shows. **Business question:** where does this audience over- or under-index, and which shows are associated with the selected parameter?

Metric: Index; detail metrics are viewers and show Index. Dimensions: eight fixed parameters and their mapped shows. Eight-axis radar, Index 0–200, numeric rings 50/100/150/200, dashed national baseline 100, unfilled qualitative-4 primary polygon. Tooltip is exactly: parameter; `Index: N`; `Highlight: {Index interpretation}`; `Baseline: National average = 100`. Pointer and Enter/Space select; selected label is bold/underlined and vertex enlarged. Default is highest Index. Supporting text states “Dashed ring = national average (100). Select a parameter to view its details.” Live detail says `{PARAMETER} — top 5 shows`, `Selected parameter · rank N of 8`, then viewer-ranked rows with list rank, compact viewers and `{index} idx`; rows are not clickable. Taxonomy/mapping/ranking/feed: **Requires product/data clarification**.

### TV User Behaviour

**User story:** As a dashboard user, I want to see post-show migration so that I can understand the audience’s next behaviour and destination. **Business question:** where do source-show viewers go within one hour?

Metric: flow share; supporting calculation displayed as drop from source. Dimensions: source show/network → behaviour → destination show/network or Other/stopped. Custom Sankey uses the top three behaviours from Stay on same channel/Switch channel/Move to streaming app/Stop watching; targets are the two strongest show · network destinations plus Other / stopped watching. “From” and “To” label the columns. Ribbon width=flow share; hover raises the ribbon opacity and dims others. Tooltip is exactly: `{behaviour} → {destination}`; `Flow share: {one decimal}%`; `Drop from source: {100 − flow share, one decimal}%`; `Window: Within 1 hour`. Show filter changes source/subtitle/flows; paths have hover but no keyboard focus, click or drilldown. Minimum 560px with horizontal scroll. A screen-reader-only list exposes every flow, and visible supporting copy identifies the source show/network and width meaning. Cohort, denominator and migration rules: **Requires product/data clarification**.

## KPI Visualisation Matrix

| KPI | User question | Primary metric | Secondary metric | Dimension | Chart | Filters | Drilldown |
|---|---|---|---|---|---|---|---|
| Overview | How large/active is the audience? | six summary metrics | four indices | audience | tiles | global, environment | No |
| Type | What is the viewing mix? | share % | estimated minutes/hh | TV type | donut | global, environment | cross-filter |
| Channel | Which destinations matter? | avg min/week | share, Index | channel/app | dual-axis bars | global, environment, type/tab | No |
| Shows | Which shows index highest? | avg min/hh | rendered share, Index | show | grouped bars | global, environment, type, platform, genre | show detail |
| Genres | Which genres matter? | avg min/week | share, Index | genre | grouped bars | global, environment, type, platform | cross-filter |
| Show detail | How does the show move weekly? | avg min/hh | households | week | dual-axis lines | inherited Shows filters | in-card detail |
| Temporal | When does the audience watch? | avg min/hh | % households | day×daypart | heatmap | global, environment, type/platform, channel/app, lookback | No |
| Affinity | Where does the audience index? | Index | viewers/show Index | parameter/show | radar+list | global, environment, type | in-card parameter detail |
| Behaviour | Where do viewers go next? | flow share | drop from source | migration path | Sankey | global, environment, type, genre, show | No |

## Chart Variations and States

- **Default:** UK/all-audience/last-30-days, All environment, no consumption type or genre selected; Linear TV tabs, Shows view, Temporal All channels/apps and 30-day (WoW); affinity detail resolves to the highest-index parameter; behaviour resolves All shows to the current top-indexing show.
- **Applied-filter/environment state:** all module data re-derives and loading skeletons precede the updated values; cross-filter/detail selections reset. Draft global edits do not alter charts.
- **Type-filtered state:** donut selection remains highlighted and a removable filter chip appears; Channel, Trends and Temporal tabs synchronize to that type, while Shows, genres, affinity and behaviour re-derive within scope. Clearing the type removes the scope but leaves platform tabs where the user last left them.
- **Alternative Trends dimension:** Shows displays the top-ten grouped chart and show dropdown; Genres displays all 12 genre groups and removes the show dropdown/alert. Toggling the switch clears show detail.
- **Show-detail state:** selecting a show replaces the grouped show chart with its four-week dual-line detail and dependent show selector.
- **Temporal alternatives:** platform changes rebuild the channel/app options; channel/app and lookback changes re-derive heatmap cells.
- **Affinity detail state:** selecting a radar parameter replaces the parameter/rank and top-five detail in place.
- **Behaviour source state:** selecting a show changes the subtitle, source copy and Sankey flows.
- **Loading/empty/error:** module skeletons, contextual empty states and inline PDF export error are as specified in Responsive / States. No Phase 1 comparison state exists.

## Chart Specifications

Index 100=national average; 150=50% above. It is not minutes or viewing percentage. Badges use arrow/text plus green/red/neutral. Radar explicitly shows baseline. Channel/show/genre currently append `%` to Index, conflicting with semantics: **Requires product/data clarification**.

Rendered mappings: Linear/primary=`--datavis-qualitative-4` `#7c33b5`; Streaming/secondary=`-3` `#a857e5`; FAST/tertiary=`-1` `#fbbb3b`; additional=`-2` `#ef8736`; line=`-5` `#ee4980`; neutral=`-7` `#e1e1e8`; positive `#115639`; negative `#da294b`; grid `#e1e1e8`; axis `#4b4b59`. Heat ramp: `#f6ebff`, `#e5c9f7`, `#cfa0ee`, `#b06fe0`, `#8a3fc9`, `#661f9e`. Grouped bars/show trend use qualitative-3 for minutes and qualitative-1 for percentage/households. Sankey uses primary, line pink and additional orange.

Tooltips are dark Fiber surfaces, portalled, max 320px/viewport-16px, 8px gap/edge, flip below, reposition on resize/ancestor scroll, and do not capture pointer.

## Drilldowns

Show bar/dropdown → in-card four-week dual-line detail; inherited state as above; All shows or view toggle returns. Radar parameter → in-card top-five detail; another parameter replaces it. Donut and genre are cross-filters, not drilldowns. No channel, heatmap, list-row or Sankey drilldown.

## Cross-KPI Interactions

Type syncs three platform tabs, scopes shows, shifts affinity, and constrains migration (Move to streaming app always targets Streaming). Genre constrains Shows and Behaviour. Affinity selection updates only its detail. Global/environment changes reset cross-filter selections. Channel/heatmap/Sankey hover never filters another card.

## Data Requirements

Known dimensions/metrics are exactly those in the KPI sections. Production source, refresh, identity, household weighting/deduplication, privacy thresholds, aggregation, denominators, taxonomy, aliases, classifications, benchmark, date/week/timezone/daypart logic, rounding/suppression, affinity and migration methodology all **Requires product/data clarification**. Synthetic `seeded/entityModel` logic is not a production specification.

| KPI | Known granularity/time/dependency | Confirmation required |
|---|---|---|
| Overview | one value per applied audience, date range and environment | metric aggregation, denominator and feed |
| Type | media type per applied audience/date/environment | minute aggregation and household estimate |
| Channel/App | channel/app within market and platform; top up to ten by minutes | inventory, aliases, share denominator and benchmark |
| Shows | show within platform/type/environment/genre; top ten by Index | show identity, `hhPct` meaning, share/reach denominator and benchmark |
| Genres | one row per rendered IAB genre within platform/type/environment | taxonomy governance, aggregation and share denominator |
| Show detail | selected show × Week 1–4 with inherited context | relationship between four weeks and global date range |
| Temporal | day × daypart within platform/channel/lookback | timezone, daypart boundaries and DoY/WoW definitions |
| Affinity | audience × parameter; selected parameter × top five shows | mapping, viewers, ranking, Index benchmark and feed |
| Behaviour | source show × behaviour × destination within one hour | cohort, attribution window, denominator, aggregation and migration rules |

## Design System Requirements

Use DM Sans, Fiber typography/spacing/surface/border/shadow/control tokens, MetricsTile, 4px SmartCards with 16px padding, searchable dropdowns, buttons, switch, rounded/underline tabs, chip, Info Alert, skeleton and empty state. Every chart is **Custom visualisation using Fiber design tokens**. Support dark tokens, keyboard selection, accessible names, non-colour cues, truncation and scrolling. No arbitrary chart palette.

## Responsive / States

Overview 2/3/6 columns; media card stacks then 20/80 at `lg`; Trends rows stack then align at `md`; affinity/behaviour stack then 3/7 at `lg`. Dropdown list max-height 220px. Exact framework breakpoints and production category virtualization: **Engineering decision required**.

Applied/global environment changes show tile loading and chart skeletons (~550ms prototype). Empty state uses illustration and contextual copy; Italy+Heavy is prototype-reachable. Export errors appear explicitly. Production API retry/partial errors: **Engineering decision required**.

## Functional Acceptance Criteria

- **Given** staged edits, **when** Apply is pressed, **then** every module updates and cross-filter selections reset.
- **Given** non-default applied filters, **when** Clear is pressed, **then** six filters return to defaults.
- **Given** either environment control, **when** changed, **then** its mirror and all modules update.
- **Given** Overview data, **when** the module renders, **then** all six exact metrics and the four applicable Index indicators use the documented formats and expose no chart interaction.
- **Given** the type donut, **when** an arc is hovered or clicked, or a legend row is hovered, focused or clicked, **then** the documented centre, dimming, tooltip and toggle behaviour appears.
- **Given** a type, **when** selected/cleared, **then** its chip and downstream scope/tabs synchronize or clear as documented.
- **Given** a Channel/App platform tab, **when** it changes, **then** up to ten valid destinations render with independent axes, the documented legend and exact tooltip, with no drilldown.
- **Given** Shows view, **when** platform/type/environment/genre changes, **then** the top-ten show universe, alert and dependent show options update consistently.
- **Given** Shows, **when** a show is selected, **then** four-week dual-axis detail opens; All shows returns.
- **Given** show detail, **when** a weekly point is hovered or focused, **then** both exact values and the dashed guide appear.
- **Given** Genres, **when** a genre is clicked, **then** its selected state toggles and the shared show/behaviour universe updates.
- **Given** Temporal platform changes, **when** a channel becomes invalid, **then** it resets to All.
- **Given** a Temporal cell, **when** hovered or focused, **then** both direct labels, selected outline and exact heat-intensity tooltip are available.
- **Given** a radar parameter, **when** clicked or Enter/Space activated, **then** rank/top-five update.
- **Given** a radar parameter, **when** hovered or focused, **then** its Index, interpretation and national baseline appear exactly as documented.
- **Given** a migration show, **when** selected, **then** source/subtitle/flows update.
- **Given** a Sankey ribbon, **when** hovered, **then** other ribbons dim and the exact path/share/drop/window tooltip appears; no click or keyboard interaction is implied.
- **Given** Export PDF, **when** activated, **then** the applied—not staged—context and rendered dashboard are exported with the documented header, exclusions, pagination and filename, while the button shows its busy state.
- **Given** loading, no-data or export-failure conditions represented by V5, **when** one occurs, **then** the corresponding documented skeleton, contextual empty state or inline error appears.
- **Given** narrow width, **when** a minimum-width chart overflows, **then** its region scrolls without clipping tooltip.
- **Given** Phase 1, **when** used, **then** no Comparison Mode control/state exists.

## Stakeholder Feedback Traceability

| Feedback | V5 solution | KPI / area affected | Status |
|---|---|---|---|
| Shared cards/merged type view | MetricsTile; one 20/80 SmartCard | Overview; Type; Channel/App | Incorporated |
| Addressable wording | All/Addressable rounded tabs | Global environment | Incorporated |
| Unlike metrics need distinct scales | independent dual axes | Channel/App; Shows; Genres; show detail | Incorporated |
| Trends as charts/dynamic dimensions | grouped bars + show/genre switch | Content viewership trends | Incorporated |
| Top-ten/show detail | alert, dependent dropdown, four-week lines | Shows | Incorporated |
| Better Index | arrows/explanation/radar rings | Overview; Channel/App; Trends; Affinity | Incorporated; suffix clarification |
| Dynamic temporal controls | platform-dependent inventory/reset | Temporal Insights | Incorporated |
| Hover/accessibility | portalled tooltips/focus labels | Rendered charts | Incorporated |
| Actionable affinity/Sankey | selected top-five; tokenized flows | Affinity; Behaviour | Incorporated |
| Comparison later | absent | Whole dashboard | Phase 2 |

## Out of Scope / Phase 2

**Comparison Mode is Phase 2**, including comparison controls, series, deltas, legends and tooltips. Also not delivered in rendered V5: the imported/unrendered Top N control and dead chart/list/table components; interaction for the displayed Advanced secondary-navigation label; unrendered drilldowns; and prototype collaboration/version tooling as production product features.

## Implementation Checklist

- **Product:** approve scope/personas/stories/clarifications.
- **Data:** contract every metric/dimension/benchmark/classification/date and relationship.
- **UX/UI:** build wrapper, six cards, controls, detail/state/responsive/theme behaviour.
- **Data visualisation:** exact charts, axes, labels, legends, tooltips, colours and accessibility.
- **Engineering:** staged/applied state, dependencies/resets, cross-KPI chain, PDF, represented errors, responsive/accessibility behaviour and tests; production API, caching and performance architecture is **Engineering decision required**.

## Open Questions / Clarifications

Target roles; feeds/SLAs; every metric denominator; show secondary meaning; Index `%` suffix; non-UK Mosaic; addressable classification; date-vs-week/DoY/WoW; affinity mapping; genre→affinity discrepancy; and migration methodology: **Requires product/data clarification**. Persistence, API retry/partial states, exact breakpoints, browser support and performance limits: **Engineering decision required**.

## Final V5 Cross-Check

- [x] Overview: six tiles.
- [x] Media type: DonutChart + DualAxisBarChart.
- [x] Trends: two ComboChart variants + ShowTrendChart.
- [x] TemporalHeatmap.
- [x] RadarChart + rendered top-five list.
- [x] MigrationSankey.
- [x] Every rendered global/local control, dependency, state, tooltip, wrapper and export.
- [x] Dead components excluded/discrepancies flagged.
- [x] Comparison Mode retained in Phase 2.
# TV Audience & Content Planner — Phase 1 Functional Requirements

**Status:** Production handoff derived from live V5  
**Route:** `/tv-audience-intelligence`  
**Phase boundary:** Phase 1 only. **Comparison Mode remains Phase 2.**

## Executive Summary

V5 is a single-page audience-led dashboard for defining a TV audience, understanding its scale and consumption, discovering platforms/channels/apps and content, inspecting temporal patterns and affinity, and viewing one-hour post-show migration. This specification covers only rendered V5 functionality. Prototype values are deterministic synthetic data, not a production feed. Unknowns use **Requires product/data clarification** or **Engineering decision required**.

## Product Scope

### Purpose, users, goals and use cases

The product supports users who need to: define a market/audience; quantify scale, volume and reach; compare Linear TV, Streaming and FAST; find channels/apps, shows and genres; inspect a show’s four-week trend; find day/daypart concentrations; identify affinity against the national average; inspect post-show behaviour; and export the applied view. V5 does not name personas or permissions: **Requires product/data clarification**.

### Phase 1 Scope

- Standalone Reports wrapper and one dashboard screen.
- Six staged global filters, Apply/Clear, immediate All/Addressable control, PDF export.
- Six Overview metrics.
- Six rendered SmartCards and all rendered visualisations/interactions/states.
- Cross-filtering, dependent controls, show/affinity details, responsive and accessible behaviour.

### User journey

Open Standard Reports → stage audience/date values → Apply → read Overview → select environment/type → inspect channel/app and show/genre performance → open show detail → inspect Temporal Insights → select an affinity parameter → select a migration source → export PDF.

The rendered page heading is **TV Audience & Content Planner**, with subtitle **Cross-platform content and audience consumption insights**.

## Dashboard Architecture

Order: title/subtitle; sticky global filters; **Overview**; All/Addressable; **TV viewership by media type** (Consumption by Type + Time Spent by Channel/App); **Content viewership trends**; mirrored All/Addressable; **Temporal Insights**; responsive **Content affinity** + **TV user behaviour**; notes.

Primary navigation is 64px, Reports active, with Intelligence/Audiences/Creatives/Campaigns displayed; full menu at ≥1024px and collapsed Reports menu below. Theme toggle and JS/Pro avatar are right. Secondary navigation is 56px: Standard active/link; Advanced inert. Header auto-hides/floats after scroll and is revealed by top hover/focus. Canvas max-width is 1440px. Prototype version/comment/annotation overlays are tooling, not product scope.

State hierarchy is staged filters → applied filters → immediate environment → optional consumption scope → module-local state. Applied global/environment changes clear type, genre, affinity, show and migration selections and show skeletons. A type selection synchronizes Channel, Trends and Temporal platform tabs and resets Temporal channel to All.

## Global Filters

All are searchable. Single-select closes after selection; multi-select stays open; search is case-insensitive; no result says “No matches.” Empty multi-selection means inclusive All.

| Filter | Exact options | Default | Behaviour |
|---|---|---|---|
| Country | United Kingdom, Germany, France, Italy, Spain | United Kingdom | All modules after Apply; determines linear inventory/commercial rules |
| Mosaic group | All Mosaic groups; City Prosperity; Prestige Positions; Country Living; Suburban Stability; Rental Hubs; Vintage Value | All Mosaic groups (empty) | All modules after Apply; All clears specifics |
| Age & gender | All genders, Male, Female × 16–24, 25–34, 35–44, 45–54, 55–64, 65+ (18) | All ages & genders (empty) | All modules after Apply |
| TV consumption | All viewers, Heavy TV, Medium TV, Light TV | All viewers | All modules after Apply |
| Children | All households; No children; Children 0–4; Children 5–11; Children 12–17 | All households (empty) | All modules after Apply; All clears specifics |
| Date range | Last 7 days; Last 15 days; Last 30 days; Last 60 days | Last 30 days | All modules after Apply |

Mosaic is rendered in all countries despite being described in code as UK-granular: **Requires product/data clarification**.

Edits are staged until Apply. Initially Apply is disabled. Pending edits enable Apply and do not affect KPIs/PDF. After non-default values are applied, the action becomes Clear all filters; Clear restores six defaults, but not environment/local tabs.

**All / Addressable channels** defaults All, updates immediately, appears twice with one synchronized state, and affects every module. Addressable excludes/reweights market-specific non-commercial inventory. Production classification: **Requires product/data clarification**.

**Export PDF** is immediate and always uses the applied filter/environment state, not un-applied draft values. While exporting, the outline button reads “Exporting…” and is disabled. The export is a paginated portrait A4 capture of the dashboard; the sticky filter bar and prototype overlays are omitted and replaced by a header containing the title, all six applied filter values, viewing environment, export date/time and the synthetic-data notice. The filename is `tv-audience-content-planner-{lowercase market code}-{YYYY-MM-DD}.pdf`. A failure is announced inline as `Export failed: {message}` or “Export failed — please try again.”

## Local Filters

| Module | Control; exact options | Default/dependency/effect |
|---|---|---|
| Type | clickable Linear TV, Streaming, FAST donut/legend | None; click again/removable chip clears; scopes downstream |
| Channel/App | Linear TV, Streaming, Fast tabs | Linear TV; synced by type; changes market inventory |
| Trends | View by show/genre switch | Shows; switching clears show |
| Trends | Linear TV, Streaming, Fast | Linear; synced by type; filters shows/reweights genres |
| Shows | All shows + unique valid shows | All; options depend on platform/type/environment/genre; selection opens detail |
| Genres | 12 rendered genre marks | None; selection toggles and restricts shared show universe |
| Temporal | platform tabs; All channels/apps + valid inventory; 7-day (DoY), 15-day (DoY), 30-day (WoW), 60-day (WoW) | Linear; All; 30-day WoW. Platform rebuilds channels; invalid channel resets All |
| Affinity | FOOD, TRAVEL, COMEDY, DOCUMENTARY, NEWS, MUSIC, LIFESTYLE, SPORTS | current highest Index; updates rank/top-five |
| Behaviour | All shows + valid scoped shows | All resolves to top-indexing show |

The data module’s `TOP_N` options and the `GenreBars`, `ShowsTable`, and `AffinityList` components exist but are not rendered; they are not delivered features. `LOOKBACK` is rendered only as the Temporal Insights lookback control.

## Filter Interaction Matrix

| Filter | Overview | Type | Channel | Trends | Temporal | Affinity | Behaviour |
|---|---:|---:|---:|---:|---:|---:|---:|
| Six applied global filters | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| All/Addressable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Type selection | — | selected | sync | sync/scope | sync | scope | scope |
| Genre selection | — | — | — | show universe | — | —* | shared show universe |
| Module-local controls | — | — | local | local | local | local detail | local |

\* Comments claim genre anchors affinity, but live affinity calculation ignores `selectedGenre`: **Requires product/data clarification**.

## KPI Requirements

### Overview

**User story:** As a dashboard user, I want a concise audience summary so that I can understand its scale and activity before exploring detail. **Business question:** how large and active is the audience?

Six Fiber MetricsTiles: **Total households** (K/M); **Total minutes viewed** (K/M); **Avg. weekly TV consumption – Streaming** (`mins`, Index); **Avg linear TV consumption** (`min/wk`, Index); **Avg. channels/apps per hh** (one decimal, Index); **Weekly TV reach** (`% of hh`, Index). Dimension: applied audience and viewing environment. No click, chart legend or tooltip. Source/calculations: **Requires product/data clarification**.

### Consumption by Type

**User story:** As a dashboard user, I want the viewing mix by media type so that I can choose the environment to investigate downstream. **Business question:** what share of minutes is Linear TV, Streaming or FAST?

Metric: share of viewing minutes, with estimated minutes per household as support. Dimension: media type. Visualisation: 200px donut (r78, stroke30), proportional share %. The clickable legend maps Linear TV to qualitative-4 purple, Streaming to qualitative-3 purple and FAST to qualitative-1 yellow, and shows each type’s one-decimal share. Centre defaults “Share of viewing”; hover or selection shows rounded share/name. Hover thickens the active arc by 4px and dims others to 35%. Arc tooltip: type; `Legend: Share of viewing`; share to one decimal; estimated integer minutes/hh. Legend tooltip omits the `Legend` line and otherwise shows the same metrics. Clicking an arc or legend row toggles the downstream type scope; the removable card chip is an equivalent clear action.

### Time Spent by Channel/App

**User story:** As a dashboard user, I want channel/app consumption ranked within a platform so that I can identify important destinations. **Business question:** which destinations matter?

Metrics: average minutes/week, share of watch time and Index. Dimension: channel/app within the selected Linear TV, Streaming or Fast tab. Up to ten destinations are shown, sorted by minutes, as grouped vertical bars. X=channel/app, >12 chars truncates to 11+ellipsis, supporting `Index N%`. Left Y=Avg min/week, five dynamic integer ticks; right Y=% of watch time, five percent ticks. The two-item legend maps minutes to qualitative-3 purple and percentage to qualitative-1 yellow. Tooltip is exactly: channel/app; `Index: N%`; `Highlight: {Index interpretation}`; `Avg min/week: {integer}`; `% of watch time: {one decimal}%`. Hover/focus dims other categories and applies a category wash. Minimum width 680px with horizontal scroll. No drilldown.

### Content Viewership Trends — Shows

**User story:** As a dashboard user, I want the highest-indexing shows for my audience so that I can inspect a relevant title. **Business question:** which ten shows index highest?

Metrics: average minutes/household, rendered `% of total watch time`, and Index supporting text. Dimension: show, constrained by platform/type/environment/genre. Grouped bars are sorted by Index. X=show + supporting `Index N%`; left Y=Avg min/HH; right Y=`% of total watch time`; independent five-tick scales. The legend maps average minutes/household to qualitative-3 purple and `% of total watch time` to qualitative-1 yellow; no line or Index legend is rendered. Tooltip is exactly: show; `Index: N%`; `Avg min / household: {integer} min`; `% of total watch time: {one decimal}%`. It does **not** include an Index interpretation. Click/category or dependent dropdown opens detail. Alert states top 10/platform. Empty title is “No shows match”; message is “No shows match these filters — change the genre filter or viewing scope.” Data property is `hhPct`/commented household reach but UI says watch time: **Requires product/data clarification**.

### Content Viewership Trends — Genres

**User story:** As a dashboard user, I want genre consumption and Index indicators so that I can constrain the show universe. **Business question:** which IAB genres matter?

Metrics: average minutes/week, share of watch time and Index supporting text. Dimension options: Comedy, News, Film, Sports, Drama, Reality, Action, Documentary, Kids, Travel, Food, Home improvement. The same grouped-bar encoding uses left Y=Avg min/week and right Y=Watch time (%), with independent five-tick scales. The legend maps average minutes/week to qualitative-3 purple and share of watch time to qualitative-1 yellow. X labels show genre plus `Index N%`. Tooltip is exactly: genre; `Index: N%`; `Avg minutes / week: {integer} min`; `Share of watch time: {one decimal}%`; it does not include Index interpretation. Click toggles genre selection and the selected category is exposed as pressed. No direct affinity update occurs in live code.

### Selected Show Consumption Over Time

**User story:** As a dashboard user, I want a selected show’s recent consumption trend so that I can understand its weekly movement. **Business question:** how did audience consumption and households watching change across four weeks?

Four-week dual-line detail. X=Week 1–4; left Y=Avg mins/hh; right Y=Households formatted M; five ticks, maxima 115% of data. Legend: Households watching=qualitative-1 yellow; Avg. minutes watched per household=qualitative-3 purple. Hover/focus shows a dashed vertical guide and tooltip: week; `Households watching: {integer}`; `Avg. minutes / household: {integer}`. Inherits all filters, environment, type, genre and Trends platform. All shows returns; another show switches detail. Relation to Date range: **Requires product/data clarification**.

### Temporal Insights

**User story:** As a dashboard user, I want audience concentration by day and daypart so that I can identify strong viewing windows. **Business question:** when does this audience watch?

Metrics: average minutes watched per household and percentage of households watching. Dimensions: day of week × daypart. The 7×6 heatmap has rows Mon–Sun and columns Early AM, Morning, Daytime, Afternoon, Primetime, Late Night. Each cell directly shows `{minutes}m` and household percentage to one decimal. Tooltip is exactly: `{day} · {daypart}`; `Avg minutes/hh: {minutes}m`; `% households: {one decimal}%`; `Heat intensity: N of 6 (low → high minutes)`. Six-step brand ramp encodes minutes; legend is `Low` → six swatches → `High` · `avg mins watched per household`. Hover/focus adds a selected outline; there is no click. Minimum width 720px with horizontal scroll. DoY/WoW definition: **Requires product/data clarification**.

### Content Affinity

**User story:** As a dashboard user, I want affinity against the national average so that I can identify the audience’s strongest content/lifestyle parameter and related shows. **Business question:** where does this audience over- or under-index, and which shows are associated with the selected parameter?

Metric: Index; detail metrics are viewers and show Index. Dimensions: eight fixed parameters and their mapped shows. Eight-axis radar, Index 0–200, numeric rings 50/100/150/200, dashed national baseline 100, unfilled qualitative-4 primary polygon. Tooltip is exactly: parameter; `Index: N`; `Highlight: {Index interpretation}`; `Baseline: National average = 100`. Pointer and Enter/Space select; selected label is bold/underlined and vertex enlarged. Default is highest Index. Supporting text states “Dashed ring = national average (100). Select a parameter to view its details.” Live detail says `{PARAMETER} — top 5 shows`, `Selected parameter · rank N of 8`, then viewer-ranked rows with list rank, compact viewers and `{index} idx`; rows are not clickable. Taxonomy/mapping/ranking/feed: **Requires product/data clarification**.

### TV User Behaviour

**User story:** As a dashboard user, I want to see post-show migration so that I can understand the audience’s next behaviour and destination. **Business question:** where do source-show viewers go within one hour?

Metric: flow share; supporting calculation displayed as drop from source. Dimensions: source show/network → behaviour → destination show/network or Other/stopped. Custom Sankey uses the top three behaviours from Stay on same channel/Switch channel/Move to streaming app/Stop watching; targets are the two strongest show · network destinations plus Other / stopped watching. “From” and “To” label the columns. Ribbon width=flow share; hover raises the ribbon opacity and dims others. Tooltip is exactly: `{behaviour} → {destination}`; `Flow share: {one decimal}%`; `Drop from source: {100 − flow share, one decimal}%`; `Window: Within 1 hour`. Show filter changes source/subtitle/flows; paths have hover but no keyboard focus, click or drilldown. Minimum 560px with horizontal scroll. A screen-reader-only list exposes every flow, and visible supporting copy identifies the source show/network and width meaning. Cohort, denominator and migration rules: **Requires product/data clarification**.

## KPI Visualisation Matrix

| KPI | User question | Primary metric | Secondary metric | Dimension | Chart | Filters | Drilldown |
|---|---|---|---|---|---|---|---|
| Overview | How large/active is the audience? | six summary metrics | four indices | audience | tiles | global, environment | No |
| Type | What is the viewing mix? | share % | estimated minutes/hh | TV type | donut | global, environment | cross-filter |
| Channel | Which destinations matter? | avg min/week | share, Index | channel/app | dual-axis bars | global, environment, type/tab | No |
| Shows | Which shows index highest? | avg min/hh | rendered share, Index | show | grouped bars | global, environment, type, platform, genre | show detail |
| Genres | Which genres matter? | avg min/week | share, Index | genre | grouped bars | global, environment, type, platform | cross-filter |
| Show detail | How does the show move weekly? | avg min/hh | households | week | dual-axis lines | inherited Shows filters | in-card detail |
| Temporal | When does the audience watch? | avg min/hh | % households | day×daypart | heatmap | global, environment, type/platform, channel/app, lookback | No |
| Affinity | Where does the audience index? | Index | viewers/show Index | parameter/show | radar+list | global, environment, type | in-card parameter detail |
| Behaviour | Where do viewers go next? | flow share | drop from source | migration path | Sankey | global, environment, type, genre, show | No |

## Chart Variations and States

- **Default:** UK/all-audience/last-30-days, All environment, no consumption type or genre selected; Linear TV tabs, Shows view, Temporal All channels/apps and 30-day (WoW); affinity detail resolves to the highest-index parameter; behaviour resolves All shows to the current top-indexing show.
- **Applied-filter/environment state:** all module data re-derives and loading skeletons precede the updated values; cross-filter/detail selections reset. Draft global edits do not alter charts.
- **Type-filtered state:** donut selection remains highlighted and a removable filter chip appears; Channel, Trends and Temporal tabs synchronize to that type, while Shows, genres, affinity and behaviour re-derive within scope. Clearing the type removes the scope but leaves platform tabs where the user last left them.
- **Alternative Trends dimension:** Shows displays the top-ten grouped chart and show dropdown; Genres displays all 12 genre groups and removes the show dropdown/alert. Toggling the switch clears show detail.
- **Show-detail state:** selecting a show replaces the grouped show chart with its four-week dual-line detail and dependent show selector.
- **Temporal alternatives:** platform changes rebuild the channel/app options; channel/app and lookback changes re-derive heatmap cells.
- **Affinity detail state:** selecting a radar parameter replaces the parameter/rank and top-five detail in place.
- **Behaviour source state:** selecting a show changes the subtitle, source copy and Sankey flows.
- **Loading/empty/error:** module skeletons, contextual empty states and inline PDF export error are as specified in Responsive / States. No Phase 1 comparison state exists.

## Chart Specifications

Index 100=national average; 150=50% above. It is not minutes or viewing percentage. Badges use arrow/text plus green/red/neutral. Radar explicitly shows baseline. Channel/show/genre currently append `%` to Index, conflicting with semantics: **Requires product/data clarification**.

Rendered mappings: Linear/primary=`--datavis-qualitative-4` `#7c33b5`; Streaming/secondary=`-3` `#a857e5`; FAST/tertiary=`-1` `#fbbb3b`; additional=`-2` `#ef8736`; line=`-5` `#ee4980`; neutral=`-7` `#e1e1e8`; positive `#115639`; negative `#da294b`; grid `#e1e1e8`; axis `#4b4b59`. Heat ramp: `#f6ebff`, `#e5c9f7`, `#cfa0ee`, `#b06fe0`, `#8a3fc9`, `#661f9e`. Grouped bars/show trend use qualitative-3 for minutes and qualitative-1 for percentage/households. Sankey uses primary, line pink and additional orange.

Tooltips are dark Fiber surfaces, portalled, max 320px/viewport-16px, 8px gap/edge, flip below, reposition on resize/ancestor scroll, and do not capture pointer.

## Drilldowns

Show bar/dropdown → in-card four-week dual-line detail; inherited state as above; All shows or view toggle returns. Radar parameter → in-card top-five detail; another parameter replaces it. Donut and genre are cross-filters, not drilldowns. No channel, heatmap, list-row or Sankey drilldown.

## Cross-KPI Interactions

Type syncs three platform tabs, scopes shows, shifts affinity, and constrains migration (Move to streaming app always targets Streaming). Genre constrains Shows and Behaviour. Affinity selection updates only its detail. Global/environment changes reset cross-filter selections. Channel/heatmap/Sankey hover never filters another card.

## Data Requirements

Known dimensions/metrics are exactly those in the KPI sections. Production source, refresh, identity, household weighting/deduplication, privacy thresholds, aggregation, denominators, taxonomy, aliases, classifications, benchmark, date/week/timezone/daypart logic, rounding/suppression, affinity and migration methodology all **Requires product/data clarification**. Synthetic `seeded/entityModel` logic is not a production specification.

| KPI | Known granularity/time/dependency | Confirmation required |
|---|---|---|
| Overview | one value per applied audience, date range and environment | metric aggregation, denominator and feed |
| Type | media type per applied audience/date/environment | minute aggregation and household estimate |
| Channel/App | channel/app within market and platform; top up to ten by minutes | inventory, aliases, share denominator and benchmark |
| Shows | show within platform/type/environment/genre; top ten by Index | show identity, `hhPct` meaning, share/reach denominator and benchmark |
| Genres | one row per rendered IAB genre within platform/type/environment | taxonomy governance, aggregation and share denominator |
| Show detail | selected show × Week 1–4 with inherited context | relationship between four weeks and global date range |
| Temporal | day × daypart within platform/channel/lookback | timezone, daypart boundaries and DoY/WoW definitions |
| Affinity | audience × parameter; selected parameter × top five shows | mapping, viewers, ranking, Index benchmark and feed |
| Behaviour | source show × behaviour × destination within one hour | cohort, attribution window, denominator, aggregation and migration rules |

## Design System Requirements

Use DM Sans, Fiber typography/spacing/surface/border/shadow/control tokens, MetricsTile, 4px SmartCards with 16px padding, searchable dropdowns, buttons, switch, rounded/underline tabs, chip, Info Alert, skeleton and empty state. Every chart is **Custom visualisation using Fiber design tokens**. Support dark tokens, keyboard selection, accessible names, non-colour cues, truncation and scrolling. No arbitrary chart palette.

## Responsive / States

Overview 2/3/6 columns; media card stacks then 20/80 at `lg`; Trends rows stack then align at `md`; affinity/behaviour stack then 3/7 at `lg`. Dropdown list max-height 220px. Exact framework breakpoints and production category virtualization: **Engineering decision required**.

Applied/global environment changes show tile loading and chart skeletons (~550ms prototype). Empty state uses illustration and contextual copy; Italy+Heavy is prototype-reachable. Export errors appear explicitly. Production API retry/partial errors: **Engineering decision required**.

## Functional Acceptance Criteria

- **Given** staged edits, **when** Apply is pressed, **then** every module updates and cross-filter selections reset.
- **Given** non-default applied filters, **when** Clear is pressed, **then** six filters return to defaults.
- **Given** either environment control, **when** changed, **then** its mirror and all modules update.
- **Given** Overview data, **when** the module renders, **then** all six exact metrics and the four applicable Index indicators use the documented formats and expose no chart interaction.
- **Given** the type donut, **when** an arc is hovered or clicked, or a legend row is hovered, focused or clicked, **then** the documented centre, dimming, tooltip and toggle behaviour appears.
- **Given** a type, **when** selected/cleared, **then** its chip and downstream scope/tabs synchronize or clear as documented.
- **Given** a Channel/App platform tab, **when** it changes, **then** up to ten valid destinations render with independent axes, the documented legend and exact tooltip, with no drilldown.
- **Given** Shows view, **when** platform/type/environment/genre changes, **then** the top-ten show universe, alert and dependent show options update consistently.
- **Given** Shows, **when** a show is selected, **then** four-week dual-axis detail opens; All shows returns.
- **Given** show detail, **when** a weekly point is hovered or focused, **then** both exact values and the dashed guide appear.
- **Given** Genres, **when** a genre is clicked, **then** its selected state toggles and the shared show/behaviour universe updates.
- **Given** Temporal platform changes, **when** a channel becomes invalid, **then** it resets to All.
- **Given** a Temporal cell, **when** hovered or focused, **then** both direct labels, selected outline and exact heat-intensity tooltip are available.
- **Given** a radar parameter, **when** clicked or Enter/Space activated, **then** rank/top-five update.
- **Given** a radar parameter, **when** hovered or focused, **then** its Index, interpretation and national baseline appear exactly as documented.
- **Given** a migration show, **when** selected, **then** source/subtitle/flows update.
- **Given** a Sankey ribbon, **when** hovered, **then** other ribbons dim and the exact path/share/drop/window tooltip appears; no click or keyboard interaction is implied.
- **Given** Export PDF, **when** activated, **then** the applied—not staged—context and rendered dashboard are exported with the documented header, exclusions, pagination and filename, while the button shows its busy state.
- **Given** loading, no-data or export-failure conditions represented by V5, **when** one occurs, **then** the corresponding documented skeleton, contextual empty state or inline error appears.
- **Given** narrow width, **when** a minimum-width chart overflows, **then** its region scrolls without clipping tooltip.
- **Given** Phase 1, **when** used, **then** no Comparison Mode control/state exists.

## Stakeholder Feedback Traceability

| Feedback | V5 solution | KPI / area affected | Status |
|---|---|---|---|
| Shared cards/merged type view | MetricsTile; one 20/80 SmartCard | Overview; Type; Channel/App | Incorporated |
| Addressable wording | All/Addressable rounded tabs | Global environment | Incorporated |
| Unlike metrics need distinct scales | independent dual axes | Channel/App; Shows; Genres; show detail | Incorporated |
| Trends as charts/dynamic dimensions | grouped bars + show/genre switch | Content viewership trends | Incorporated |
| Top-ten/show detail | alert, dependent dropdown, four-week lines | Shows | Incorporated |
| Better Index | arrows/explanation/radar rings | Overview; Channel/App; Trends; Affinity | Incorporated; suffix clarification |
| Dynamic temporal controls | platform-dependent inventory/reset | Temporal Insights | Incorporated |
| Hover/accessibility | portalled tooltips/focus labels | Rendered charts | Incorporated |
| Actionable affinity/Sankey | selected top-five; tokenized flows | Affinity; Behaviour | Incorporated |
| Comparison later | absent | Whole dashboard | Phase 2 |

## Out of Scope / Phase 2

**Comparison Mode is Phase 2**, including comparison controls, series, deltas, legends and tooltips. Also not delivered in rendered V5: the imported/unrendered Top N control and dead chart/list/table components; interaction for the displayed Advanced secondary-navigation label; unrendered drilldowns; and prototype collaboration/version tooling as production product features.

## Implementation Checklist

- **Product:** approve scope/personas/stories/clarifications.
- **Data:** contract every metric/dimension/benchmark/classification/date and relationship.
- **UX/UI:** build wrapper, six cards, controls, detail/state/responsive/theme behaviour.
- **Data visualisation:** exact charts, axes, labels, legends, tooltips, colours and accessibility.
- **Engineering:** staged/applied state, dependencies/resets, cross-KPI chain, PDF, represented errors, responsive/accessibility behaviour and tests; production API, caching and performance architecture is **Engineering decision required**.

## Open Questions / Clarifications

Target roles; feeds/SLAs; every metric denominator; show secondary meaning; Index `%` suffix; non-UK Mosaic; addressable classification; date-vs-week/DoY/WoW; affinity mapping; genre→affinity discrepancy; and migration methodology: **Requires product/data clarification**. Persistence, API retry/partial states, exact breakpoints, browser support and performance limits: **Engineering decision required**.

## Final V5 Cross-Check

- [x] Overview: six tiles.
- [x] Media type: DonutChart + DualAxisBarChart.
- [x] Trends: two ComboChart variants + ShowTrendChart.
- [x] TemporalHeatmap.
- [x] RadarChart + rendered top-five list.
- [x] MigrationSankey.
- [x] Every rendered global/local control, dependency, state, tooltip, wrapper and export.
- [x] Dead components excluded/discrepancies flagged.
- [x] Comparison Mode retained in Phase 2.
# TV Audience & Content Planner — Phase 1 Functional Requirements

**Status:** Production handoff derived from live V5  
**Route:** `/tv-audience-intelligence`  
**Phase boundary:** Phase 1 only. **Comparison Mode remains Phase 2.**

## Executive Summary

V5 is a single-page audience-led dashboard for defining a TV audience, understanding its scale and consumption, discovering platforms/channels/apps and content, inspecting temporal patterns and affinity, and viewing one-hour post-show migration. This specification covers only rendered V5 functionality. Prototype values are deterministic synthetic data, not a production feed. Unknowns use **Requires product/data clarification** or **Engineering decision required**.

## Product Scope

### Purpose, users, goals and use cases

The product supports users who need to: define a market/audience; quantify scale, volume and reach; compare Linear TV, Streaming and FAST; find channels/apps, shows and genres; inspect a show’s four-week trend; find day/daypart concentrations; identify affinity against the national average; inspect post-show behaviour; and export the applied view. V5 does not name personas or permissions: **Requires product/data clarification**.

### Phase 1 Scope

- Standalone Reports wrapper and one dashboard screen.
- Six staged global filters, Apply/Clear, immediate All/Addressable control, PDF export.
- Six Overview metrics.
- Six rendered SmartCards and all rendered visualisations/interactions/states.
- Cross-filtering, dependent controls, show/affinity details, responsive and accessible behaviour.

### User journey

Open Standard Reports → stage audience/date values → Apply → read Overview → select environment/type → inspect channel/app and show/genre performance → open show detail → inspect Temporal Insights → select an affinity parameter → select a migration source → export PDF.

The rendered page heading is **TV Audience & Content Planner**, with subtitle **Cross-platform content and audience consumption insights**.

## Dashboard Architecture

Order: title/subtitle; sticky global filters; **Overview**; All/Addressable; **TV viewership by media type** (Consumption by Type + Time Spent by Channel/App); **Content viewership trends**; mirrored All/Addressable; **Temporal Insights**; responsive **Content affinity** + **TV user behaviour**; notes.

Primary navigation is 64px, Reports active, with Intelligence/Audiences/Creatives/Campaigns displayed; full menu at ≥1024px and collapsed Reports menu below. Theme toggle and JS/Pro avatar are right. Secondary navigation is 56px: Standard active/link; Advanced inert. Header auto-hides/floats after scroll and is revealed by top hover/focus. Canvas max-width is 1440px. Prototype version/comment/annotation overlays are tooling, not product scope.

State hierarchy is staged filters → applied filters → immediate environment → optional consumption scope → module-local state. Applied global/environment changes clear type, genre, affinity, show and migration selections and show skeletons. A type selection synchronizes Channel, Trends and Temporal platform tabs and resets Temporal channel to All.

## Global Filters

All are searchable. Single-select closes after selection; multi-select stays open; search is case-insensitive; no result says “No matches.” Empty multi-selection means inclusive All.

| Filter | Exact options | Default | Behaviour |
|---|---|---|---|
| Country | United Kingdom, Germany, France, Italy, Spain | United Kingdom | All modules after Apply; determines linear inventory/commercial rules |
| Mosaic group | All Mosaic groups; City Prosperity; Prestige Positions; Country Living; Suburban Stability; Rental Hubs; Vintage Value | All Mosaic groups (empty) | All modules after Apply; All clears specifics |
| Age & gender | All genders, Male, Female × 16–24, 25–34, 35–44, 45–54, 55–64, 65+ (18) | All ages & genders (empty) | All modules after Apply |
| TV consumption | All viewers, Heavy TV, Medium TV, Light TV | All viewers | All modules after Apply |
| Children | All households; No children; Children 0–4; Children 5–11; Children 12–17 | All households (empty) | All modules after Apply; All clears specifics |
| Date range | Last 7 days; Last 15 days; Last 30 days; Last 60 days | Last 30 days | All modules after Apply |

Mosaic is rendered in all countries despite being described in code as UK-granular: **Requires product/data clarification**.

Edits are staged until Apply. Initially Apply is disabled. Pending edits enable Apply and do not affect KPIs/PDF. After non-default values are applied, the action becomes Clear all filters; Clear restores six defaults, but not environment/local tabs.

**All / Addressable channels** defaults All, updates immediately, appears twice with one synchronized state, and affects every module. Addressable excludes/reweights market-specific non-commercial inventory. Production classification: **Requires product/data clarification**.

**Export PDF** is immediate and always uses the applied filter/environment state, not un-applied draft values. While exporting, the outline button reads “Exporting…” and is disabled. The export is a paginated portrait A4 capture of the dashboard; the sticky filter bar and prototype overlays are omitted and replaced by a header containing the title, all six applied filter values, viewing environment, export date/time and the synthetic-data notice. The filename is `tv-audience-content-planner-{lowercase market code}-{YYYY-MM-DD}.pdf`. A failure is announced inline as `Export failed: {message}` or “Export failed — please try again.”

## Local Filters

| Module | Control; exact options | Default/dependency/effect |
|---|---|---|
| Type | clickable Linear TV, Streaming, FAST donut/legend | None; click again/removable chip clears; scopes downstream |
| Channel/App | Linear TV, Streaming, Fast tabs | Linear TV; synced by type; changes market inventory |
| Trends | View by show/genre switch | Shows; switching clears show |
| Trends | Linear TV, Streaming, Fast | Linear; synced by type; filters shows/reweights genres |
| Shows | All shows + unique valid shows | All; options depend on platform/type/environment/genre; selection opens detail |
| Genres | 12 rendered genre marks | None; selection toggles and restricts shared show universe |
| Temporal | platform tabs; All channels/apps + valid inventory; 7-day (DoY), 15-day (DoY), 30-day (WoW), 60-day (WoW) | Linear; All; 30-day WoW. Platform rebuilds channels; invalid channel resets All |
| Affinity | FOOD, TRAVEL, COMEDY, DOCUMENTARY, NEWS, MUSIC, LIFESTYLE, SPORTS | current highest Index; updates rank/top-five |
| Behaviour | All shows + valid scoped shows | All resolves to top-indexing show |

The data module’s `TOP_N` options and the `GenreBars`, `ShowsTable`, and `AffinityList` components exist but are not rendered; they are not delivered features. `LOOKBACK` is rendered only as the Temporal Insights lookback control.

## Filter Interaction Matrix

| Filter | Overview | Type | Channel | Trends | Temporal | Affinity | Behaviour |
|---|---:|---:|---:|---:|---:|---:|---:|
| Six applied global filters | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| All/Addressable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Type selection | — | selected | sync | sync/scope | sync | scope | scope |
| Genre selection | — | — | — | show universe | — | —* | shared show universe |
| Module-local controls | — | — | local | local | local | local detail | local |

\* Comments claim genre anchors affinity, but live affinity calculation ignores `selectedGenre`: **Requires product/data clarification**.

## KPI Requirements

### Overview

**User story:** As a dashboard user, I want a concise audience summary so that I can understand its scale and activity before exploring detail. **Business question:** how large and active is the audience?

Six Fiber MetricsTiles: **Total households** (K/M); **Total minutes viewed** (K/M); **Avg. weekly TV consumption – Streaming** (`mins`, Index); **Avg linear TV consumption** (`min/wk`, Index); **Avg. channels/apps per hh** (one decimal, Index); **Weekly TV reach** (`% of hh`, Index). Dimension: applied audience and viewing environment. No click, chart legend or tooltip. Source/calculations: **Requires product/data clarification**.

### Consumption by Type

**User story:** As a dashboard user, I want the viewing mix by media type so that I can choose the environment to investigate downstream. **Business question:** what share of minutes is Linear TV, Streaming or FAST?

Metric: share of viewing minutes, with estimated minutes per household as support. Dimension: media type. Visualisation: 200px donut (r78, stroke30), proportional share %. The clickable legend maps Linear TV to qualitative-4 purple, Streaming to qualitative-3 purple and FAST to qualitative-1 yellow, and shows each type’s one-decimal share. Centre defaults “Share of viewing”; hover or selection shows rounded share/name. Hover thickens the active arc by 4px and dims others to 35%. Arc tooltip: type; `Legend: Share of viewing`; share to one decimal; estimated integer minutes/hh. Legend tooltip omits the `Legend` line and otherwise shows the same metrics. Clicking an arc or legend row toggles the downstream type scope; the removable card chip is an equivalent clear action.

### Time Spent by Channel/App

**User story:** As a dashboard user, I want channel/app consumption ranked within a platform so that I can identify important destinations. **Business question:** which destinations matter?

Metrics: average minutes/week, share of watch time and Index. Dimension: channel/app within the selected Linear TV, Streaming or Fast tab. Up to ten destinations are shown, sorted by minutes, as grouped vertical bars. X=channel/app, >12 chars truncates to 11+ellipsis, supporting `Index N%`. Left Y=Avg min/week, five dynamic integer ticks; right Y=% of watch time, five percent ticks. The two-item legend maps minutes to qualitative-3 purple and percentage to qualitative-1 yellow. Tooltip is exactly: channel/app; `Index: N%`; `Highlight: {Index interpretation}`; `Avg min/week: {integer}`; `% of watch time: {one decimal}%`. Hover/focus dims other categories and applies a category wash. Minimum width 680px with horizontal scroll. No drilldown.

### Content Viewership Trends — Shows

**User story:** As a dashboard user, I want the highest-indexing shows for my audience so that I can inspect a relevant title. **Business question:** which ten shows index highest?

Metrics: average minutes/household, rendered `% of total watch time`, and Index supporting text. Dimension: show, constrained by platform/type/environment/genre. Grouped bars are sorted by Index. X=show + supporting `Index N%`; left Y=Avg min/HH; right Y=`% of total watch time`; independent five-tick scales. The legend maps average minutes/household to qualitative-3 purple and `% of total watch time` to qualitative-1 yellow; no line or Index legend is rendered. Tooltip is exactly: show; `Index: N%`; `Avg min / household: {integer} min`; `% of total watch time: {one decimal}%`. It does **not** include an Index interpretation. Click/category or dependent dropdown opens detail. Alert states top 10/platform. Empty title is “No shows match”; message is “No shows match these filters — change the genre filter or viewing scope.” Data property is `hhPct`/commented household reach but UI says watch time: **Requires product/data clarification**.

### Content Viewership Trends — Genres

**User story:** As a dashboard user, I want genre consumption and Index indicators so that I can constrain the show universe. **Business question:** which IAB genres matter?

Metrics: average minutes/week, share of watch time and Index supporting text. Dimension options: Comedy, News, Film, Sports, Drama, Reality, Action, Documentary, Kids, Travel, Food, Home improvement. The same grouped-bar encoding uses left Y=Avg min/week and right Y=Watch time (%), with independent five-tick scales. The legend maps average minutes/week to qualitative-3 purple and share of watch time to qualitative-1 yellow. X labels show genre plus `Index N%`. Tooltip is exactly: genre; `Index: N%`; `Avg minutes / week: {integer} min`; `Share of watch time: {one decimal}%`; it does not include Index interpretation. Click toggles genre selection and the selected category is exposed as pressed. No direct affinity update occurs in live code.

### Selected Show Consumption Over Time

**User story:** As a dashboard user, I want a selected show’s recent consumption trend so that I can understand its weekly movement. **Business question:** how did audience consumption and households watching change across four weeks?

Four-week dual-line detail. X=Week 1–4; left Y=Avg mins/hh; right Y=Households formatted M; five ticks, maxima 115% of data. Legend: Households watching=qualitative-1 yellow; Avg. minutes watched per household=qualitative-3 purple. Hover/focus shows a dashed vertical guide and tooltip: week; `Households watching: {integer}`; `Avg. minutes / household: {integer}`. Inherits all filters, environment, type, genre and Trends platform. All shows returns; another show switches detail. Relation to Date range: **Requires product/data clarification**.

### Temporal Insights

**User story:** As a dashboard user, I want audience concentration by day and daypart so that I can identify strong viewing windows. **Business question:** when does this audience watch?

Metrics: average minutes watched per household and percentage of households watching. Dimensions: day of week × daypart. The 7×6 heatmap has rows Mon–Sun and columns Early AM, Morning, Daytime, Afternoon, Primetime, Late Night. Each cell directly shows `{minutes}m` and household percentage to one decimal. Tooltip is exactly: `{day} · {daypart}`; `Avg minutes/hh: {minutes}m`; `% households: {one decimal}%`; `Heat intensity: N of 6 (low → high minutes)`. Six-step brand ramp encodes minutes; legend is `Low` → six swatches → `High` · `avg mins watched per household`. Hover/focus adds a selected outline; there is no click. Minimum width 720px with horizontal scroll. DoY/WoW definition: **Requires product/data clarification**.

### Content Affinity

**User story:** As a dashboard user, I want affinity against the national average so that I can identify the audience’s strongest content/lifestyle parameter and related shows. **Business question:** where does this audience over- or under-index, and which shows are associated with the selected parameter?

Metric: Index; detail metrics are viewers and show Index. Dimensions: eight fixed parameters and their mapped shows. Eight-axis radar, Index 0–200, numeric rings 50/100/150/200, dashed national baseline 100, unfilled qualitative-4 primary polygon. Tooltip is exactly: parameter; `Index: N`; `Highlight: {Index interpretation}`; `Baseline: National average = 100`. Pointer and Enter/Space select; selected label is bold/underlined and vertex enlarged. Default is highest Index. Supporting text states “Dashed ring = national average (100). Select a parameter to view its details.” Live detail says `{PARAMETER} — top 5 shows`, `Selected parameter · rank N of 8`, then viewer-ranked rows with list rank, compact viewers and `{index} idx`; rows are not clickable. Taxonomy/mapping/ranking/feed: **Requires product/data clarification**.

### TV User Behaviour

**User story:** As a dashboard user, I want to see post-show migration so that I can understand the audience’s next behaviour and destination. **Business question:** where do source-show viewers go within one hour?

Metric: flow share; supporting calculation displayed as drop from source. Dimensions: source show/network → behaviour → destination show/network or Other/stopped. Custom Sankey uses the top three behaviours from Stay on same channel/Switch channel/Move to streaming app/Stop watching; targets are the two strongest show · network destinations plus Other / stopped watching. “From” and “To” label the columns. Ribbon width=flow share; hover raises the ribbon opacity and dims others. Tooltip is exactly: `{behaviour} → {destination}`; `Flow share: {one decimal}%`; `Drop from source: {100 − flow share, one decimal}%`; `Window: Within 1 hour`. Show filter changes source/subtitle/flows; paths have hover but no keyboard focus, click or drilldown. Minimum 560px with horizontal scroll. A screen-reader-only list exposes every flow, and visible supporting copy identifies the source show/network and width meaning. Cohort, denominator and migration rules: **Requires product/data clarification**.

## KPI Visualisation Matrix

| KPI | User question | Primary metric | Secondary metric | Dimension | Chart | Filters | Drilldown |
|---|---|---|---|---|---|---|---|
| Overview | How large/active is the audience? | six summary metrics | four indices | audience | tiles | global, environment | No |
| Type | What is the viewing mix? | share % | estimated minutes/hh | TV type | donut | global, environment | cross-filter |
| Channel | Which destinations matter? | avg min/week | share, Index | channel/app | dual-axis bars | global, environment, type/tab | No |
| Shows | Which shows index highest? | avg min/hh | rendered share, Index | show | grouped bars | global, environment, type, platform, genre | show detail |
| Genres | Which genres matter? | avg min/week | share, Index | genre | grouped bars | global, environment, type, platform | cross-filter |
| Show detail | How does the show move weekly? | avg min/hh | households | week | dual-axis lines | inherited Shows filters | in-card detail |
| Temporal | When does the audience watch? | avg min/hh | % households | day×daypart | heatmap | global, environment, type/platform, channel/app, lookback | No |
| Affinity | Where does the audience index? | Index | viewers/show Index | parameter/show | radar+list | global, environment, type | in-card parameter detail |
| Behaviour | Where do viewers go next? | flow share | drop from source | migration path | Sankey | global, environment, type, genre, show | No |

## Chart Variations and States

- **Default:** UK/all-audience/last-30-days, All environment, no consumption type or genre selected; Linear TV tabs, Shows view, Temporal All channels/apps and 30-day (WoW); affinity detail resolves to the highest-index parameter; behaviour resolves All shows to the current top-indexing show.
- **Applied-filter/environment state:** all module data re-derives and loading skeletons precede the updated values; cross-filter/detail selections reset. Draft global edits do not alter charts.
- **Type-filtered state:** donut selection remains highlighted and a removable filter chip appears; Channel, Trends and Temporal tabs synchronize to that type, while Shows, genres, affinity and behaviour re-derive within scope. Clearing the type removes the scope but leaves platform tabs where the user last left them.
- **Alternative Trends dimension:** Shows displays the top-ten grouped chart and show dropdown; Genres displays all 12 genre groups and removes the show dropdown/alert. Toggling the switch clears show detail.
- **Show-detail state:** selecting a show replaces the grouped show chart with its four-week dual-line detail and dependent show selector.
- **Temporal alternatives:** platform changes rebuild the channel/app options; channel/app and lookback changes re-derive heatmap cells.
- **Affinity detail state:** selecting a radar parameter replaces the parameter/rank and top-five detail in place.
- **Behaviour source state:** selecting a show changes the subtitle, source copy and Sankey flows.
- **Loading/empty/error:** module skeletons, contextual empty states and inline PDF export error are as specified in Responsive / States. No Phase 1 comparison state exists.

## Chart Specifications

Index 100=national average; 150=50% above. It is not minutes or viewing percentage. Badges use arrow/text plus green/red/neutral. Radar explicitly shows baseline. Channel/show/genre currently append `%` to Index, conflicting with semantics: **Requires product/data clarification**.

Rendered mappings: Linear/primary=`--datavis-qualitative-4` `#7c33b5`; Streaming/secondary=`-3` `#a857e5`; FAST/tertiary=`-1` `#fbbb3b`; additional=`-2` `#ef8736`; line=`-5` `#ee4980`; neutral=`-7` `#e1e1e8`; positive `#115639`; negative `#da294b`; grid `#e1e1e8`; axis `#4b4b59`. Heat ramp: `#f6ebff`, `#e5c9f7`, `#cfa0ee`, `#b06fe0`, `#8a3fc9`, `#661f9e`. Grouped bars/show trend use qualitative-3 for minutes and qualitative-1 for percentage/households. Sankey uses primary, line pink and additional orange.

Tooltips are dark Fiber surfaces, portalled, max 320px/viewport-16px, 8px gap/edge, flip below, reposition on resize/ancestor scroll, and do not capture pointer.

## Drilldowns

Show bar/dropdown → in-card four-week dual-line detail; inherited state as above; All shows or view toggle returns. Radar parameter → in-card top-five detail; another parameter replaces it. Donut and genre are cross-filters, not drilldowns. No channel, heatmap, list-row or Sankey drilldown.

## Cross-KPI Interactions

Type syncs three platform tabs, scopes shows, shifts affinity, and constrains migration (Move to streaming app always targets Streaming). Genre constrains Shows and Behaviour. Affinity selection updates only its detail. Global/environment changes reset cross-filter selections. Channel/heatmap/Sankey hover never filters another card.

## Data Requirements

Known dimensions/metrics are exactly those in the KPI sections. Production source, refresh, identity, household weighting/deduplication, privacy thresholds, aggregation, denominators, taxonomy, aliases, classifications, benchmark, date/week/timezone/daypart logic, rounding/suppression, affinity and migration methodology all **Requires product/data clarification**. Synthetic `seeded/entityModel` logic is not a production specification.

| KPI | Known granularity/time/dependency | Confirmation required |
|---|---|---|
| Overview | one value per applied audience, date range and environment | metric aggregation, denominator and feed |
| Type | media type per applied audience/date/environment | minute aggregation and household estimate |
| Channel/App | channel/app within market and platform; top up to ten by minutes | inventory, aliases, share denominator and benchmark |
| Shows | show within platform/type/environment/genre; top ten by Index | show identity, `hhPct` meaning, share/reach denominator and benchmark |
| Genres | one row per rendered IAB genre within platform/type/environment | taxonomy governance, aggregation and share denominator |
| Show detail | selected show × Week 1–4 with inherited context | relationship between four weeks and global date range |
| Temporal | day × daypart within platform/channel/lookback | timezone, daypart boundaries and DoY/WoW definitions |
| Affinity | audience × parameter; selected parameter × top five shows | mapping, viewers, ranking, Index benchmark and feed |
| Behaviour | source show × behaviour × destination within one hour | cohort, attribution window, denominator, aggregation and migration rules |

## Design System Requirements

Use DM Sans, Fiber typography/spacing/surface/border/shadow/control tokens, MetricsTile, 4px SmartCards with 16px padding, searchable dropdowns, buttons, switch, rounded/underline tabs, chip, Info Alert, skeleton and empty state. Every chart is **Custom visualisation using Fiber design tokens**. Support dark tokens, keyboard selection, accessible names, non-colour cues, truncation and scrolling. No arbitrary chart palette.

## Responsive / States

Overview 2/3/6 columns; media card stacks then 20/80 at `lg`; Trends rows stack then align at `md`; affinity/behaviour stack then 3/7 at `lg`. Dropdown list max-height 220px. Exact framework breakpoints and production category virtualization: **Engineering decision required**.

Applied/global environment changes show tile loading and chart skeletons (~550ms prototype). Empty state uses illustration and contextual copy; Italy+Heavy is prototype-reachable. Export errors appear explicitly. Production API retry/partial errors: **Engineering decision required**.

## Functional Acceptance Criteria

- **Given** staged edits, **when** Apply is pressed, **then** every module updates and cross-filter selections reset.
- **Given** non-default applied filters, **when** Clear is pressed, **then** six filters return to defaults.
- **Given** either environment control, **when** changed, **then** its mirror and all modules update.
- **Given** Overview data, **when** the module renders, **then** all six exact metrics and the four applicable Index indicators use the documented formats and expose no chart interaction.
- **Given** the type donut, **when** an arc is hovered or clicked, or a legend row is hovered, focused or clicked, **then** the documented centre, dimming, tooltip and toggle behaviour appears.
- **Given** a type, **when** selected/cleared, **then** its chip and downstream scope/tabs synchronize or clear as documented.
- **Given** a Channel/App platform tab, **when** it changes, **then** up to ten valid destinations render with independent axes, the documented legend and exact tooltip, with no drilldown.
- **Given** Shows view, **when** platform/type/environment/genre changes, **then** the top-ten show universe, alert and dependent show options update consistently.
- **Given** Shows, **when** a show is selected, **then** four-week dual-axis detail opens; All shows returns.
- **Given** show detail, **when** a weekly point is hovered or focused, **then** both exact values and the dashed guide appear.
- **Given** Genres, **when** a genre is clicked, **then** its selected state toggles and the shared show/behaviour universe updates.
- **Given** Temporal platform changes, **when** a channel becomes invalid, **then** it resets to All.
- **Given** a Temporal cell, **when** hovered or focused, **then** both direct labels, selected outline and exact heat-intensity tooltip are available.
- **Given** a radar parameter, **when** clicked or Enter/Space activated, **then** rank/top-five update.
- **Given** a radar parameter, **when** hovered or focused, **then** its Index, interpretation and national baseline appear exactly as documented.
- **Given** a migration show, **when** selected, **then** source/subtitle/flows update.
- **Given** a Sankey ribbon, **when** hovered, **then** other ribbons dim and the exact path/share/drop/window tooltip appears; no click or keyboard interaction is implied.
- **Given** Export PDF, **when** activated, **then** the applied—not staged—context and rendered dashboard are exported with the documented header, exclusions, pagination and filename, while the button shows its busy state.
- **Given** loading, no-data or export-failure conditions represented by V5, **when** one occurs, **then** the corresponding documented skeleton, contextual empty state or inline error appears.
- **Given** narrow width, **when** a minimum-width chart overflows, **then** its region scrolls without clipping tooltip.
- **Given** Phase 1, **when** used, **then** no Comparison Mode control/state exists.

## Stakeholder Feedback Traceability

| Feedback | V5 solution | KPI / area affected | Status |
|---|---|---|---|
| Shared cards/merged type view | MetricsTile; one 20/80 SmartCard | Overview; Type; Channel/App | Incorporated |
| Addressable wording | All/Addressable rounded tabs | Global environment | Incorporated |
| Unlike metrics need distinct scales | independent dual axes | Channel/App; Shows; Genres; show detail | Incorporated |
| Trends as charts/dynamic dimensions | grouped bars + show/genre switch | Content viewership trends | Incorporated |
| Top-ten/show detail | alert, dependent dropdown, four-week lines | Shows | Incorporated |
| Better Index | arrows/explanation/radar rings | Overview; Channel/App; Trends; Affinity | Incorporated; suffix clarification |
| Dynamic temporal controls | platform-dependent inventory/reset | Temporal Insights | Incorporated |
| Hover/accessibility | portalled tooltips/focus labels | Rendered charts | Incorporated |
| Actionable affinity/Sankey | selected top-five; tokenized flows | Affinity; Behaviour | Incorporated |
| Comparison later | absent | Whole dashboard | Phase 2 |

## Out of Scope / Phase 2

**Comparison Mode is Phase 2**, including comparison controls, series, deltas, legends and tooltips. Also not delivered in rendered V5: the imported/unrendered Top N control and dead chart/list/table components; interaction for the displayed Advanced secondary-navigation label; unrendered drilldowns; and prototype collaboration/version tooling as production product features.

## Implementation Checklist

- **Product:** approve scope/personas/stories/clarifications.
- **Data:** contract every metric/dimension/benchmark/classification/date and relationship.
- **UX/UI:** build wrapper, six cards, controls, detail/state/responsive/theme behaviour.
- **Data visualisation:** exact charts, axes, labels, legends, tooltips, colours and accessibility.
- **Engineering:** staged/applied state, dependencies/resets, cross-KPI chain, PDF, represented errors, responsive/accessibility behaviour and tests; production API, caching and performance architecture is **Engineering decision required**.

## Open Questions / Clarifications

Target roles; feeds/SLAs; every metric denominator; show secondary meaning; Index `%` suffix; non-UK Mosaic; addressable classification; date-vs-week/DoY/WoW; affinity mapping; genre→affinity discrepancy; and migration methodology: **Requires product/data clarification**. Persistence, API retry/partial states, exact breakpoints, browser support and performance limits: **Engineering decision required**.

## Final V5 Cross-Check

- [x] Overview: six tiles.
- [x] Media type: DonutChart + DualAxisBarChart.
- [x] Trends: two ComboChart variants + ShowTrendChart.
- [x] TemporalHeatmap.
- [x] RadarChart + rendered top-five list.
- [x] MigrationSankey.
- [x] Every rendered global/local control, dependency, state, tooltip, wrapper and export.
- [x] Dead components excluded/discrepancies flagged.
- [x] Comparison Mode retained in Phase 2.
# TV Audience & Content Planner — Phase 1 Functional Requirements

**Status:** Production handoff derived from live V5  
**Route:** `/tv-audience-intelligence`  
**Phase boundary:** Phase 1 only. **Comparison Mode remains Phase 2.**

## Executive Summary

V5 is a single-page audience-led dashboard for defining a TV audience, understanding its scale and consumption, discovering platforms/channels/apps and content, inspecting temporal patterns and affinity, and viewing one-hour post-show migration. This specification covers only rendered V5 functionality. Prototype values are deterministic synthetic data, not a production feed. Unknowns use **Requires product/data clarification** or **Engineering decision required**.

## Product Scope

### Purpose, users, goals and use cases

The product supports users who need to: define a market/audience; quantify scale, volume and reach; compare Linear TV, Streaming and FAST; find channels/apps, shows and genres; inspect a show’s four-week trend; find day/daypart concentrations; identify affinity against the national average; inspect post-show behaviour; and export the applied view. V5 does not name personas or permissions: **Requires product/data clarification**.

### Phase 1 Scope

- Standalone Reports wrapper and one dashboard screen.
- Six staged global filters, Apply/Clear, immediate All/Addressable control, PDF export.
- Six Overview metrics.
- Six rendered SmartCards and all rendered visualisations/interactions/states.
- Cross-filtering, dependent controls, show/affinity details, responsive and accessible behaviour.

### User journey

Open Standard Reports → stage audience/date values → Apply → read Overview → select environment/type → inspect channel/app and show/genre performance → open show detail → inspect Temporal Insights → select an affinity parameter → select a migration source → export PDF.

The rendered page heading is **TV Audience & Content Planner**, with subtitle **Cross-platform content and audience consumption insights**.

## Dashboard Architecture

Order: title/subtitle; sticky global filters; **Overview**; All/Addressable; **TV viewership by media type** (Consumption by Type + Time Spent by Channel/App); **Content viewership trends**; mirrored All/Addressable; **Temporal Insights**; responsive **Content affinity** + **TV user behaviour**; notes.

Primary navigation is 64px, Reports active, with Intelligence/Audiences/Creatives/Campaigns displayed; full menu at ≥1024px and collapsed Reports menu below. Theme toggle and JS/Pro avatar are right. Secondary navigation is 56px: Standard active/link; Advanced inert. Header auto-hides/floats after scroll and is revealed by top hover/focus. Canvas max-width is 1440px. Prototype version/comment/annotation overlays are tooling, not product scope.

State hierarchy is staged filters → applied filters → immediate environment → optional consumption scope → module-local state. Applied global/environment changes clear type, genre, affinity, show and migration selections and show skeletons. A type selection synchronizes Channel, Trends and Temporal platform tabs and resets Temporal channel to All.

## Global Filters

All are searchable. Single-select closes after selection; multi-select stays open; search is case-insensitive; no result says “No matches.” Empty multi-selection means inclusive All.

| Filter | Exact options | Default | Behaviour |
|---|---|---|---|
| Country | United Kingdom, Germany, France, Italy, Spain | United Kingdom | All modules after Apply; determines linear inventory/commercial rules |
| Mosaic group | All Mosaic groups; City Prosperity; Prestige Positions; Country Living; Suburban Stability; Rental Hubs; Vintage Value | All Mosaic groups (empty) | All modules after Apply; All clears specifics |
| Age & gender | All genders, Male, Female × 16–24, 25–34, 35–44, 45–54, 55–64, 65+ (18) | All ages & genders (empty) | All modules after Apply |
| TV consumption | All viewers, Heavy TV, Medium TV, Light TV | All viewers | All modules after Apply |
| Children | All households; No children; Children 0–4; Children 5–11; Children 12–17 | All households (empty) | All modules after Apply; All clears specifics |
| Date range | Last 7 days; Last 15 days; Last 30 days; Last 60 days | Last 30 days | All modules after Apply |

Mosaic is rendered in all countries despite being described in code as UK-granular: **Requires product/data clarification**.

Edits are staged until Apply. Initially Apply is disabled. Pending edits enable Apply and do not affect KPIs/PDF. After non-default values are applied, the action becomes Clear all filters; Clear restores six defaults, but not environment/local tabs.

**All / Addressable channels** defaults All, updates immediately, appears twice with one synchronized state, and affects every module. Addressable excludes/reweights market-specific non-commercial inventory. Production classification: **Requires product/data clarification**.

**Export PDF** is immediate and always uses the applied filter/environment state, not un-applied draft values. While exporting, the outline button reads “Exporting…” and is disabled. The export is a paginated portrait A4 capture of the dashboard; the sticky filter bar and prototype overlays are omitted and replaced by a header containing the title, all six applied filter values, viewing environment, export date/time and the synthetic-data notice. The filename is `tv-audience-content-planner-{lowercase market code}-{YYYY-MM-DD}.pdf`. A failure is announced inline as `Export failed: {message}` or “Export failed — please try again.”

## Local Filters

| Module | Control; exact options | Default/dependency/effect |
|---|---|---|
| Type | clickable Linear TV, Streaming, FAST donut/legend | None; click again/removable chip clears; scopes downstream |
| Channel/App | Linear TV, Streaming, Fast tabs | Linear TV; synced by type; changes market inventory |
| Trends | View by show/genre switch | Shows; switching clears show |
| Trends | Linear TV, Streaming, Fast | Linear; synced by type; filters shows/reweights genres |
| Shows | All shows + unique valid shows | All; options depend on platform/type/environment/genre; selection opens detail |
| Genres | 12 rendered genre marks | None; selection toggles and restricts shared show universe |
| Temporal | platform tabs; All channels/apps + valid inventory; 7-day (DoY), 15-day (DoY), 30-day (WoW), 60-day (WoW) | Linear; All; 30-day WoW. Platform rebuilds channels; invalid channel resets All |
| Affinity | FOOD, TRAVEL, COMEDY, DOCUMENTARY, NEWS, MUSIC, LIFESTYLE, SPORTS | current highest Index; updates rank/top-five |
| Behaviour | All shows + valid scoped shows | All resolves to top-indexing show |

The data module’s `TOP_N` options and the `GenreBars`, `ShowsTable`, and `AffinityList` components exist but are not rendered; they are not delivered features. `LOOKBACK` is rendered only as the Temporal Insights lookback control.

## Filter Interaction Matrix

| Filter | Overview | Type | Channel | Trends | Temporal | Affinity | Behaviour |
|---|---:|---:|---:|---:|---:|---:|---:|
| Six applied global filters | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| All/Addressable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Type selection | — | selected | sync | sync/scope | sync | scope | scope |
| Genre selection | — | — | — | show universe | — | —* | shared show universe |
| Module-local controls | — | — | local | local | local | local detail | local |

\* Comments claim genre anchors affinity, but live affinity calculation ignores `selectedGenre`: **Requires product/data clarification**.

## KPI Requirements

### Overview

**User story:** As a dashboard user, I want a concise audience summary so that I can understand its scale and activity before exploring detail. **Business question:** how large and active is the audience?

Six Fiber MetricsTiles: **Total households** (K/M); **Total minutes viewed** (K/M); **Avg. weekly TV consumption – Streaming** (`mins`, Index); **Avg linear TV consumption** (`min/wk`, Index); **Avg. channels/apps per hh** (one decimal, Index); **Weekly TV reach** (`% of hh`, Index). Dimension: applied audience and viewing environment. No click, chart legend or tooltip. Source/calculations: **Requires product/data clarification**.

### Consumption by Type

**User story:** As a dashboard user, I want the viewing mix by media type so that I can choose the environment to investigate downstream. **Business question:** what share of minutes is Linear TV, Streaming or FAST?

Metric: share of viewing minutes, with estimated minutes per household as support. Dimension: media type. Visualisation: 200px donut (r78, stroke30), proportional share %. The clickable legend maps Linear TV to qualitative-4 purple, Streaming to qualitative-3 purple and FAST to qualitative-1 yellow, and shows each type’s one-decimal share. Centre defaults “Share of viewing”; hover or selection shows rounded share/name. Hover thickens the active arc by 4px and dims others to 35%. Arc tooltip: type; `Legend: Share of viewing`; share to one decimal; estimated integer minutes/hh. Legend tooltip omits the `Legend` line and otherwise shows the same metrics. Clicking an arc or legend row toggles the downstream type scope; the removable card chip is an equivalent clear action.

### Time Spent by Channel/App

**User story:** As a dashboard user, I want channel/app consumption ranked within a platform so that I can identify important destinations. **Business question:** which destinations matter?

Metrics: average minutes/week, share of watch time and Index. Dimension: channel/app within the selected Linear TV, Streaming or Fast tab. Up to ten destinations are shown, sorted by minutes, as grouped vertical bars. X=channel/app, >12 chars truncates to 11+ellipsis, supporting `Index N%`. Left Y=Avg min/week, five dynamic integer ticks; right Y=% of watch time, five percent ticks. The two-item legend maps minutes to qualitative-3 purple and percentage to qualitative-1 yellow. Tooltip is exactly: channel/app; `Index: N%`; `Highlight: {Index interpretation}`; `Avg min/week: {integer}`; `% of watch time: {one decimal}%`. Hover/focus dims other categories and applies a category wash. Minimum width 680px with horizontal scroll. No drilldown.

### Content Viewership Trends — Shows

**User story:** As a dashboard user, I want the highest-indexing shows for my audience so that I can inspect a relevant title. **Business question:** which ten shows index highest?

Metrics: average minutes/household, rendered `% of total watch time`, and Index supporting text. Dimension: show, constrained by platform/type/environment/genre. Grouped bars are sorted by Index. X=show + supporting `Index N%`; left Y=Avg min/HH; right Y=`% of total watch time`; independent five-tick scales. The legend maps average minutes/household to qualitative-3 purple and `% of total watch time` to qualitative-1 yellow; no line or Index legend is rendered. Tooltip is exactly: show; `Index: N%`; `Avg min / household: {integer} min`; `% of total watch time: {one decimal}%`. It does **not** include an Index interpretation. Click/category or dependent dropdown opens detail. Alert states top 10/platform. Empty title is “No shows match”; message is “No shows match these filters — change the genre filter or viewing scope.” Data property is `hhPct`/commented household reach but UI says watch time: **Requires product/data clarification**.

### Content Viewership Trends — Genres

**User story:** As a dashboard user, I want genre consumption and Index indicators so that I can constrain the show universe. **Business question:** which IAB genres matter?

Metrics: average minutes/week, share of watch time and Index supporting text. Dimension options: Comedy, News, Film, Sports, Drama, Reality, Action, Documentary, Kids, Travel, Food, Home improvement. The same grouped-bar encoding uses left Y=Avg min/week and right Y=Watch time (%), with independent five-tick scales. The legend maps average minutes/week to qualitative-3 purple and share of watch time to qualitative-1 yellow. X labels show genre plus `Index N%`. Tooltip is exactly: genre; `Index: N%`; `Avg minutes / week: {integer} min`; `Share of watch time: {one decimal}%`; it does not include Index interpretation. Click toggles genre selection and the selected category is exposed as pressed. No direct affinity update occurs in live code.

### Selected Show Consumption Over Time

**User story:** As a dashboard user, I want a selected show’s recent consumption trend so that I can understand its weekly movement. **Business question:** how did audience consumption and households watching change across four weeks?

Four-week dual-line detail. X=Week 1–4; left Y=Avg mins/hh; right Y=Households formatted M; five ticks, maxima 115% of data. Legend: Households watching=qualitative-1 yellow; Avg. minutes watched per household=qualitative-3 purple. Hover/focus shows a dashed vertical guide and tooltip: week; `Households watching: {integer}`; `Avg. minutes / household: {integer}`. Inherits all filters, environment, type, genre and Trends platform. All shows returns; another show switches detail. Relation to Date range: **Requires product/data clarification**.

### Temporal Insights

**User story:** As a dashboard user, I want audience concentration by day and daypart so that I can identify strong viewing windows. **Business question:** when does this audience watch?

Metrics: average minutes watched per household and percentage of households watching. Dimensions: day of week × daypart. The 7×6 heatmap has rows Mon–Sun and columns Early AM, Morning, Daytime, Afternoon, Primetime, Late Night. Each cell directly shows `{minutes}m` and household percentage to one decimal. Tooltip is exactly: `{day} · {daypart}`; `Avg minutes/hh: {minutes}m`; `% households: {one decimal}%`; `Heat intensity: N of 6 (low → high minutes)`. Six-step brand ramp encodes minutes; legend is `Low` → six swatches → `High` · `avg mins watched per household`. Hover/focus adds a selected outline; there is no click. Minimum width 720px with horizontal scroll. DoY/WoW definition: **Requires product/data clarification**.

### Content Affinity

**User story:** As a dashboard user, I want affinity against the national average so that I can identify the audience’s strongest content/lifestyle parameter and related shows. **Business question:** where does this audience over- or under-index, and which shows are associated with the selected parameter?

Metric: Index; detail metrics are viewers and show Index. Dimensions: eight fixed parameters and their mapped shows. Eight-axis radar, Index 0–200, numeric rings 50/100/150/200, dashed national baseline 100, unfilled qualitative-4 primary polygon. Tooltip is exactly: parameter; `Index: N`; `Highlight: {Index interpretation}`; `Baseline: National average = 100`. Pointer and Enter/Space select; selected label is bold/underlined and vertex enlarged. Default is highest Index. Supporting text states “Dashed ring = national average (100). Select a parameter to view its details.” Live detail says `{PARAMETER} — top 5 shows`, `Selected parameter · rank N of 8`, then viewer-ranked rows with list rank, compact viewers and `{index} idx`; rows are not clickable. Taxonomy/mapping/ranking/feed: **Requires product/data clarification**.

### TV User Behaviour

**User story:** As a dashboard user, I want to see post-show migration so that I can understand the audience’s next behaviour and destination. **Business question:** where do source-show viewers go within one hour?

Metric: flow share; supporting calculation displayed as drop from source. Dimensions: source show/network → behaviour → destination show/network or Other/stopped. Custom Sankey uses the top three behaviours from Stay on same channel/Switch channel/Move to streaming app/Stop watching; targets are the two strongest show · network destinations plus Other / stopped watching. “From” and “To” label the columns. Ribbon width=flow share; hover raises the ribbon opacity and dims others. Tooltip is exactly: `{behaviour} → {destination}`; `Flow share: {one decimal}%`; `Drop from source: {100 − flow share, one decimal}%`; `Window: Within 1 hour`. Show filter changes source/subtitle/flows; paths have hover but no keyboard focus, click or drilldown. Minimum 560px with horizontal scroll. A screen-reader-only list exposes every flow, and visible supporting copy identifies the source show/network and width meaning. Cohort, denominator and migration rules: **Requires product/data clarification**.

## KPI Visualisation Matrix

| KPI | User question | Primary metric | Secondary metric | Dimension | Chart | Filters | Drilldown |
|---|---|---|---|---|---|---|---|
| Overview | How large/active is the audience? | six summary metrics | four indices | audience | tiles | global, environment | No |
| Type | What is the viewing mix? | share % | estimated minutes/hh | TV type | donut | global, environment | cross-filter |
| Channel | Which destinations matter? | avg min/week | share, Index | channel/app | dual-axis bars | global, environment, type/tab | No |
| Shows | Which shows index highest? | avg min/hh | rendered share, Index | show | grouped bars | global, environment, type, platform, genre | show detail |
| Genres | Which genres matter? | avg min/week | share, Index | genre | grouped bars | global, environment, type, platform | cross-filter |
| Show detail | How does the show move weekly? | avg min/hh | households | week | dual-axis lines | inherited Shows filters | in-card detail |
| Temporal | When does the audience watch? | avg min/hh | % households | day×daypart | heatmap | global, environment, type/platform, channel/app, lookback | No |
| Affinity | Where does the audience index? | Index | viewers/show Index | parameter/show | radar+list | global, environment, type | in-card parameter detail |
| Behaviour | Where do viewers go next? | flow share | drop from source | migration path | Sankey | global, environment, type, genre, show | No |

## Chart Variations and States

- **Default:** UK/all-audience/last-30-days, All environment, no consumption type or genre selected; Linear TV tabs, Shows view, Temporal All channels/apps and 30-day (WoW); affinity detail resolves to the highest-index parameter; behaviour resolves All shows to the current top-indexing show.
- **Applied-filter/environment state:** all module data re-derives and loading skeletons precede the updated values; cross-filter/detail selections reset. Draft global edits do not alter charts.
- **Type-filtered state:** donut selection remains highlighted and a removable filter chip appears; Channel, Trends and Temporal tabs synchronize to that type, while Shows, genres, affinity and behaviour re-derive within scope. Clearing the type removes the scope but leaves platform tabs where the user last left them.
- **Alternative Trends dimension:** Shows displays the top-ten grouped chart and show dropdown; Genres displays all 12 genre groups and removes the show dropdown/alert. Toggling the switch clears show detail.
- **Show-detail state:** selecting a show replaces the grouped show chart with its four-week dual-line detail and dependent show selector.
- **Temporal alternatives:** platform changes rebuild the channel/app options; channel/app and lookback changes re-derive heatmap cells.
- **Affinity detail state:** selecting a radar parameter replaces the parameter/rank and top-five detail in place.
- **Behaviour source state:** selecting a show changes the subtitle, source copy and Sankey flows.
- **Loading/empty/error:** module skeletons, contextual empty states and inline PDF export error are as specified in Responsive / States. No Phase 1 comparison state exists.

## Chart Specifications

Index 100=national average; 150=50% above. It is not minutes or viewing percentage. Badges use arrow/text plus green/red/neutral. Radar explicitly shows baseline. Channel/show/genre currently append `%` to Index, conflicting with semantics: **Requires product/data clarification**.

Rendered mappings: Linear/primary=`--datavis-qualitative-4` `#7c33b5`; Streaming/secondary=`-3` `#a857e5`; FAST/tertiary=`-1` `#fbbb3b`; additional=`-2` `#ef8736`; line=`-5` `#ee4980`; neutral=`-7` `#e1e1e8`; positive `#115639`; negative `#da294b`; grid `#e1e1e8`; axis `#4b4b59`. Heat ramp: `#f6ebff`, `#e5c9f7`, `#cfa0ee`, `#b06fe0`, `#8a3fc9`, `#661f9e`. Grouped bars/show trend use qualitative-3 for minutes and qualitative-1 for percentage/households. Sankey uses primary, line pink and additional orange.

Tooltips are dark Fiber surfaces, portalled, max 320px/viewport-16px, 8px gap/edge, flip below, reposition on resize/ancestor scroll, and do not capture pointer.

## Drilldowns

Show bar/dropdown → in-card four-week dual-line detail; inherited state as above; All shows or view toggle returns. Radar parameter → in-card top-five detail; another parameter replaces it. Donut and genre are cross-filters, not drilldowns. No channel, heatmap, list-row or Sankey drilldown.

## Cross-KPI Interactions

Type syncs three platform tabs, scopes shows, shifts affinity, and constrains migration (Move to streaming app always targets Streaming). Genre constrains Shows and Behaviour. Affinity selection updates only its detail. Global/environment changes reset cross-filter selections. Channel/heatmap/Sankey hover never filters another card.

## Data Requirements

Known dimensions/metrics are exactly those in the KPI sections. Production source, refresh, identity, household weighting/deduplication, privacy thresholds, aggregation, denominators, taxonomy, aliases, classifications, benchmark, date/week/timezone/daypart logic, rounding/suppression, affinity and migration methodology all **Requires product/data clarification**. Synthetic `seeded/entityModel` logic is not a production specification.

| KPI | Known granularity/time/dependency | Confirmation required |
|---|---|---|
| Overview | one value per applied audience, date range and environment | metric aggregation, denominator and feed |
| Type | media type per applied audience/date/environment | minute aggregation and household estimate |
| Channel/App | channel/app within market and platform; top up to ten by minutes | inventory, aliases, share denominator and benchmark |
| Shows | show within platform/type/environment/genre; top ten by Index | show identity, `hhPct` meaning, share/reach denominator and benchmark |
| Genres | one row per rendered IAB genre within platform/type/environment | taxonomy governance, aggregation and share denominator |
| Show detail | selected show × Week 1–4 with inherited context | relationship between four weeks and global date range |
| Temporal | day × daypart within platform/channel/lookback | timezone, daypart boundaries and DoY/WoW definitions |
| Affinity | audience × parameter; selected parameter × top five shows | mapping, viewers, ranking, Index benchmark and feed |
| Behaviour | source show × behaviour × destination within one hour | cohort, attribution window, denominator, aggregation and migration rules |

## Design System Requirements

Use DM Sans, Fiber typography/spacing/surface/border/shadow/control tokens, MetricsTile, 4px SmartCards with 16px padding, searchable dropdowns, buttons, switch, rounded/underline tabs, chip, Info Alert, skeleton and empty state. Every chart is **Custom visualisation using Fiber design tokens**. Support dark tokens, keyboard selection, accessible names, non-colour cues, truncation and scrolling. No arbitrary chart palette.

## Responsive / States

Overview 2/3/6 columns; media card stacks then 20/80 at `lg`; Trends rows stack then align at `md`; affinity/behaviour stack then 3/7 at `lg`. Dropdown list max-height 220px. Exact framework breakpoints and production category virtualization: **Engineering decision required**.

Applied/global environment changes show tile loading and chart skeletons (~550ms prototype). Empty state uses illustration and contextual copy; Italy+Heavy is prototype-reachable. Export errors appear explicitly. Production API retry/partial errors: **Engineering decision required**.

## Functional Acceptance Criteria

- **Given** staged edits, **when** Apply is pressed, **then** every module updates and cross-filter selections reset.
- **Given** non-default applied filters, **when** Clear is pressed, **then** six filters return to defaults.
- **Given** either environment control, **when** changed, **then** its mirror and all modules update.
- **Given** Overview data, **when** the module renders, **then** all six exact metrics and the four applicable Index indicators use the documented formats and expose no chart interaction.
- **Given** the type donut, **when** an arc is hovered or clicked, or a legend row is hovered, focused or clicked, **then** the documented centre, dimming, tooltip and toggle behaviour appears.
- **Given** a type, **when** selected/cleared, **then** its chip and downstream scope/tabs synchronize or clear as documented.
- **Given** a Channel/App platform tab, **when** it changes, **then** up to ten valid destinations render with independent axes, the documented legend and exact tooltip, with no drilldown.
- **Given** Shows view, **when** platform/type/environment/genre changes, **then** the top-ten show universe, alert and dependent show options update consistently.
- **Given** Shows, **when** a show is selected, **then** four-week dual-axis detail opens; All shows returns.
- **Given** show detail, **when** a weekly point is hovered or focused, **then** both exact values and the dashed guide appear.
- **Given** Genres, **when** a genre is clicked, **then** its selected state toggles and the shared show/behaviour universe updates.
- **Given** Temporal platform changes, **when** a channel becomes invalid, **then** it resets to All.
- **Given** a Temporal cell, **when** hovered or focused, **then** both direct labels, selected outline and exact heat-intensity tooltip are available.
- **Given** a radar parameter, **when** clicked or Enter/Space activated, **then** rank/top-five update.
- **Given** a radar parameter, **when** hovered or focused, **then** its Index, interpretation and national baseline appear exactly as documented.
- **Given** a migration show, **when** selected, **then** source/subtitle/flows update.
- **Given** a Sankey ribbon, **when** hovered, **then** other ribbons dim and the exact path/share/drop/window tooltip appears; no click or keyboard interaction is implied.
- **Given** Export PDF, **when** activated, **then** the applied—not staged—context and rendered dashboard are exported with the documented header, exclusions, pagination and filename, while the button shows its busy state.
- **Given** loading, no-data or export-failure conditions represented by V5, **when** one occurs, **then** the corresponding documented skeleton, contextual empty state or inline error appears.
- **Given** narrow width, **when** a minimum-width chart overflows, **then** its region scrolls without clipping tooltip.
- **Given** Phase 1, **when** used, **then** no Comparison Mode control/state exists.

## Stakeholder Feedback Traceability

| Feedback | V5 solution | KPI / area affected | Status |
|---|---|---|---|
| Shared cards/merged type view | MetricsTile; one 20/80 SmartCard | Overview; Type; Channel/App | Incorporated |
| Addressable wording | All/Addressable rounded tabs | Global environment | Incorporated |
| Unlike metrics need distinct scales | independent dual axes | Channel/App; Shows; Genres; show detail | Incorporated |
| Trends as charts/dynamic dimensions | grouped bars + show/genre switch | Content viewership trends | Incorporated |
| Top-ten/show detail | alert, dependent dropdown, four-week lines | Shows | Incorporated |
| Better Index | arrows/explanation/radar rings | Overview; Channel/App; Trends; Affinity | Incorporated; suffix clarification |
| Dynamic temporal controls | platform-dependent inventory/reset | Temporal Insights | Incorporated |
| Hover/accessibility | portalled tooltips/focus labels | Rendered charts | Incorporated |
| Actionable affinity/Sankey | selected top-five; tokenized flows | Affinity; Behaviour | Incorporated |
| Comparison later | absent | Whole dashboard | Phase 2 |

## Out of Scope / Phase 2

**Comparison Mode is Phase 2**, including comparison controls, series, deltas, legends and tooltips. Also not delivered in rendered V5: the imported/unrendered Top N control and dead chart/list/table components; interaction for the displayed Advanced secondary-navigation label; unrendered drilldowns; and prototype collaboration/version tooling as production product features.

## Implementation Checklist

- **Product:** approve scope/personas/stories/clarifications.
- **Data:** contract every metric/dimension/benchmark/classification/date and relationship.
- **UX/UI:** build wrapper, six cards, controls, detail/state/responsive/theme behaviour.
- **Data visualisation:** exact charts, axes, labels, legends, tooltips, colours and accessibility.
- **Engineering:** staged/applied state, dependencies/resets, cross-KPI chain, PDF, represented errors, responsive/accessibility behaviour and tests; production API, caching and performance architecture is **Engineering decision required**.

## Open Questions / Clarifications

Target roles; feeds/SLAs; every metric denominator; show secondary meaning; Index `%` suffix; non-UK Mosaic; addressable classification; date-vs-week/DoY/WoW; affinity mapping; genre→affinity discrepancy; and migration methodology: **Requires product/data clarification**. Persistence, API retry/partial states, exact breakpoints, browser support and performance limits: **Engineering decision required**.

## Final V5 Cross-Check

- [x] Overview: six tiles.
- [x] Media type: DonutChart + DualAxisBarChart.
- [x] Trends: two ComboChart variants + ShowTrendChart.
- [x] TemporalHeatmap.
- [x] RadarChart + rendered top-five list.
- [x] MigrationSankey.
- [x] Every rendered global/local control, dependency, state, tooltip, wrapper and export.
- [x] Dead components excluded/discrepancies flagged.
- [x] Comparison Mode retained in Phase 2.
# TV Audience & Content Planner — Phase 1 Functional Requirements

**Status:** Production handoff derived from live V5  
**Route:** `/tv-audience-intelligence`  
**Phase boundary:** Phase 1 only. **Comparison Mode remains Phase 2.**

## Executive Summary

V5 is a single-page audience-led dashboard for defining a TV audience, understanding its scale and consumption, discovering platforms/channels/apps and content, inspecting temporal patterns and affinity, and viewing one-hour post-show migration. This specification covers only rendered V5 functionality. Prototype values are deterministic synthetic data, not a production feed. Unknowns use **Requires product/data clarification** or **Engineering decision required**.

## Product Scope

### Purpose, users, goals and use cases

The product supports users who need to: define a market/audience; quantify scale, volume and reach; compare Linear TV, Streaming and FAST; find channels/apps, shows and genres; inspect a show’s four-week trend; find day/daypart concentrations; identify affinity against the national average; inspect post-show behaviour; and export the applied view. V5 does not name personas or permissions: **Requires product/data clarification**.

### Phase 1 Scope

- Standalone Reports wrapper and one dashboard screen.
- Six staged global filters, Apply/Clear, immediate All/Addressable control, PDF export.
- Six Overview metrics.
- Six rendered SmartCards and all rendered visualisations/interactions/states.
- Cross-filtering, dependent controls, show/affinity details, responsive and accessible behaviour.

### User journey

Open Standard Reports → stage audience/date values → Apply → read Overview → select environment/type → inspect channel/app and show/genre performance → open show detail → inspect Temporal Insights → select an affinity parameter → select a migration source → export PDF.

The rendered page heading is **TV Audience & Content Planner**, with subtitle **Cross-platform content and audience consumption insights**.

## Dashboard Architecture

Order: title/subtitle; sticky global filters; **Overview**; All/Addressable; **TV viewership by media type** (Consumption by Type + Time Spent by Channel/App); **Content viewership trends**; mirrored All/Addressable; **Temporal Insights**; responsive **Content affinity** + **TV user behaviour**; notes.

Primary navigation is 64px, Reports active, with Intelligence/Audiences/Creatives/Campaigns displayed; full menu at ≥1024px and collapsed Reports menu below. Theme toggle and JS/Pro avatar are right. Secondary navigation is 56px: Standard active/link; Advanced inert. Header auto-hides/floats after scroll and is revealed by top hover/focus. Canvas max-width is 1440px. Prototype version/comment/annotation overlays are tooling, not product scope.

State hierarchy is staged filters → applied filters → immediate environment → optional consumption scope → module-local state. Applied global/environment changes clear type, genre, affinity, show and migration selections and show skeletons. A type selection synchronizes Channel, Trends and Temporal platform tabs and resets Temporal channel to All.

## Global Filters

All are searchable. Single-select closes after selection; multi-select stays open; search is case-insensitive; no result says “No matches.” Empty multi-selection means inclusive All.

| Filter | Exact options | Default | Behaviour |
|---|---|---|---|
| Country | United Kingdom, Germany, France, Italy, Spain | United Kingdom | All modules after Apply; determines linear inventory/commercial rules |
| Mosaic group | All Mosaic groups; City Prosperity; Prestige Positions; Country Living; Suburban Stability; Rental Hubs; Vintage Value | All Mosaic groups (empty) | All modules after Apply; All clears specifics |
| Age & gender | All genders, Male, Female × 16–24, 25–34, 35–44, 45–54, 55–64, 65+ (18) | All ages & genders (empty) | All modules after Apply |
| TV consumption | All viewers, Heavy TV, Medium TV, Light TV | All viewers | All modules after Apply |
| Children | All households; No children; Children 0–4; Children 5–11; Children 12–17 | All households (empty) | All modules after Apply; All clears specifics |
| Date range | Last 7 days; Last 15 days; Last 30 days; Last 60 days | Last 30 days | All modules after Apply |

Mosaic is rendered in all countries despite being described in code as UK-granular: **Requires product/data clarification**.

Edits are staged until Apply. Initially Apply is disabled. Pending edits enable Apply and do not affect KPIs/PDF. After non-default values are applied, the action becomes Clear all filters; Clear restores six defaults, but not environment/local tabs.

**All / Addressable channels** defaults All, updates immediately, appears twice with one synchronized state, and affects every module. Addressable excludes/reweights market-specific non-commercial inventory. Production classification: **Requires product/data clarification**.

**Export PDF** is immediate and always uses the applied filter/environment state, not un-applied draft values. While exporting, the outline button reads “Exporting…” and is disabled. The export is a paginated portrait A4 capture of the dashboard; the sticky filter bar and prototype overlays are omitted and replaced by a header containing the title, all six applied filter values, viewing environment, export date/time and the synthetic-data notice. The filename is `tv-audience-content-planner-{lowercase market code}-{YYYY-MM-DD}.pdf`. A failure is announced inline as `Export failed: {message}` or “Export failed — please try again.”

## Local Filters

| Module | Control; exact options | Default/dependency/effect |
|---|---|---|
| Type | clickable Linear TV, Streaming, FAST donut/legend | None; click again/removable chip clears; scopes downstream |
| Channel/App | Linear TV, Streaming, Fast tabs | Linear TV; synced by type; changes market inventory |
| Trends | View by show/genre switch | Shows; switching clears show |
| Trends | Linear TV, Streaming, Fast | Linear; synced by type; filters shows/reweights genres |
| Shows | All shows + unique valid shows | All; options depend on platform/type/environment/genre; selection opens detail |
| Genres | 12 rendered genre marks | None; selection toggles and restricts shared show universe |
| Temporal | platform tabs; All channels/apps + valid inventory; 7-day (DoY), 15-day (DoY), 30-day (WoW), 60-day (WoW) | Linear; All; 30-day WoW. Platform rebuilds channels; invalid channel resets All |
| Affinity | FOOD, TRAVEL, COMEDY, DOCUMENTARY, NEWS, MUSIC, LIFESTYLE, SPORTS | current highest Index; updates rank/top-five |
| Behaviour | All shows + valid scoped shows | All resolves to top-indexing show |

The data module’s `TOP_N` options and the `GenreBars`, `ShowsTable`, and `AffinityList` components exist but are not rendered; they are not delivered features. `LOOKBACK` is rendered only as the Temporal Insights lookback control.

## Filter Interaction Matrix

| Filter | Overview | Type | Channel | Trends | Temporal | Affinity | Behaviour |
|---|---:|---:|---:|---:|---:|---:|---:|
| Six applied global filters | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| All/Addressable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Type selection | — | selected | sync | sync/scope | sync | scope | scope |
| Genre selection | — | — | — | show universe | — | —* | shared show universe |
| Module-local controls | — | — | local | local | local | local detail | local |

\* Comments claim genre anchors affinity, but live affinity calculation ignores `selectedGenre`: **Requires product/data clarification**.

## KPI Requirements

### Overview

**User story:** As a dashboard user, I want a concise audience summary so that I can understand its scale and activity before exploring detail. **Business question:** how large and active is the audience?

Six Fiber MetricsTiles: **Total households** (K/M); **Total minutes viewed** (K/M); **Avg. weekly TV consumption – Streaming** (`mins`, Index); **Avg linear TV consumption** (`min/wk`, Index); **Avg. channels/apps per hh** (one decimal, Index); **Weekly TV reach** (`% of hh`, Index). Dimension: applied audience and viewing environment. No click, chart legend or tooltip. Source/calculations: **Requires product/data clarification**.

### Consumption by Type

**User story:** As a dashboard user, I want the viewing mix by media type so that I can choose the environment to investigate downstream. **Business question:** what share of minutes is Linear TV, Streaming or FAST?

Metric: share of viewing minutes, with estimated minutes per household as support. Dimension: media type. Visualisation: 200px donut (r78, stroke30), proportional share %. The clickable legend maps Linear TV to qualitative-4 purple, Streaming to qualitative-3 purple and FAST to qualitative-1 yellow, and shows each type’s one-decimal share. Centre defaults “Share of viewing”; hover or selection shows rounded share/name. Hover thickens the active arc by 4px and dims others to 35%. Arc tooltip: type; `Legend: Share of viewing`; share to one decimal; estimated integer minutes/hh. Legend tooltip omits the `Legend` line and otherwise shows the same metrics. Clicking an arc or legend row toggles the downstream type scope; the removable card chip is an equivalent clear action.

### Time Spent by Channel/App

**User story:** As a dashboard user, I want channel/app consumption ranked within a platform so that I can identify important destinations. **Business question:** which destinations matter?

Metrics: average minutes/week, share of watch time and Index. Dimension: channel/app within the selected Linear TV, Streaming or Fast tab. Up to ten destinations are shown, sorted by minutes, as grouped vertical bars. X=channel/app, >12 chars truncates to 11+ellipsis, supporting `Index N%`. Left Y=Avg min/week, five dynamic integer ticks; right Y=% of watch time, five percent ticks. The two-item legend maps minutes to qualitative-3 purple and percentage to qualitative-1 yellow. Tooltip is exactly: channel/app; `Index: N%`; `Highlight: {Index interpretation}`; `Avg min/week: {integer}`; `% of watch time: {one decimal}%`. Hover/focus dims other categories and applies a category wash. Minimum width 680px with horizontal scroll. No drilldown.

### Content Viewership Trends — Shows

**User story:** As a dashboard user, I want the highest-indexing shows for my audience so that I can inspect a relevant title. **Business question:** which ten shows index highest?

Metrics: average minutes/household, rendered `% of total watch time`, and Index supporting text. Dimension: show, constrained by platform/type/environment/genre. Grouped bars are sorted by Index. X=show + supporting `Index N%`; left Y=Avg min/HH; right Y=`% of total watch time`; independent five-tick scales. The legend maps average minutes/household to qualitative-3 purple and `% of total watch time` to qualitative-1 yellow; no line or Index legend is rendered. Tooltip is exactly: show; `Index: N%`; `Avg min / household: {integer} min`; `% of total watch time: {one decimal}%`. It does **not** include an Index interpretation. Click/category or dependent dropdown opens detail. Alert states top 10/platform. Empty title is “No shows match”; message is “No shows match these filters — change the genre filter or viewing scope.” Data property is `hhPct`/commented household reach but UI says watch time: **Requires product/data clarification**.

### Content Viewership Trends — Genres

**User story:** As a dashboard user, I want genre consumption and Index indicators so that I can constrain the show universe. **Business question:** which IAB genres matter?

Metrics: average minutes/week, share of watch time and Index supporting text. Dimension options: Comedy, News, Film, Sports, Drama, Reality, Action, Documentary, Kids, Travel, Food, Home improvement. The same grouped-bar encoding uses left Y=Avg min/week and right Y=Watch time (%), with independent five-tick scales. The legend maps average minutes/week to qualitative-3 purple and share of watch time to qualitative-1 yellow. X labels show genre plus `Index N%`. Tooltip is exactly: genre; `Index: N%`; `Avg minutes / week: {integer} min`; `Share of watch time: {one decimal}%`; it does not include Index interpretation. Click toggles genre selection and the selected category is exposed as pressed. No direct affinity update occurs in live code.

### Selected Show Consumption Over Time

**User story:** As a dashboard user, I want a selected show’s recent consumption trend so that I can understand its weekly movement. **Business question:** how did audience consumption and households watching change across four weeks?

Four-week dual-line detail. X=Week 1–4; left Y=Avg mins/hh; right Y=Households formatted M; five ticks, maxima 115% of data. Legend: Households watching=qualitative-1 yellow; Avg. minutes watched per household=qualitative-3 purple. Hover/focus shows a dashed vertical guide and tooltip: week; `Households watching: {integer}`; `Avg. minutes / household: {integer}`. Inherits all filters, environment, type, genre and Trends platform. All shows returns; another show switches detail. Relation to Date range: **Requires product/data clarification**.

### Temporal Insights

**User story:** As a dashboard user, I want audience concentration by day and daypart so that I can identify strong viewing windows. **Business question:** when does this audience watch?

Metrics: average minutes watched per household and percentage of households watching. Dimensions: day of week × daypart. The 7×6 heatmap has rows Mon–Sun and columns Early AM, Morning, Daytime, Afternoon, Primetime, Late Night. Each cell directly shows `{minutes}m` and household percentage to one decimal. Tooltip is exactly: `{day} · {daypart}`; `Avg minutes/hh: {minutes}m`; `% households: {one decimal}%`; `Heat intensity: N of 6 (low → high minutes)`. Six-step brand ramp encodes minutes; legend is `Low` → six swatches → `High` · `avg mins watched per household`. Hover/focus adds a selected outline; there is no click. Minimum width 720px with horizontal scroll. DoY/WoW definition: **Requires product/data clarification**.

### Content Affinity

**User story:** As a dashboard user, I want affinity against the national average so that I can identify the audience’s strongest content/lifestyle parameter and related shows. **Business question:** where does this audience over- or under-index, and which shows are associated with the selected parameter?

Metric: Index; detail metrics are viewers and show Index. Dimensions: eight fixed parameters and their mapped shows. Eight-axis radar, Index 0–200, numeric rings 50/100/150/200, dashed national baseline 100, unfilled qualitative-4 primary polygon. Tooltip is exactly: parameter; `Index: N`; `Highlight: {Index interpretation}`; `Baseline: National average = 100`. Pointer and Enter/Space select; selected label is bold/underlined and vertex enlarged. Default is highest Index. Supporting text states “Dashed ring = national average (100). Select a parameter to view its details.” Live detail says `{PARAMETER} — top 5 shows`, `Selected parameter · rank N of 8`, then viewer-ranked rows with list rank, compact viewers and `{index} idx`; rows are not clickable. Taxonomy/mapping/ranking/feed: **Requires product/data clarification**.

### TV User Behaviour

**User story:** As a dashboard user, I want to see post-show migration so that I can understand the audience’s next behaviour and destination. **Business question:** where do source-show viewers go within one hour?

Metric: flow share; supporting calculation displayed as drop from source. Dimensions: source show/network → behaviour → destination show/network or Other/stopped. Custom Sankey uses the top three behaviours from Stay on same channel/Switch channel/Move to streaming app/Stop watching; targets are the two strongest show · network destinations plus Other / stopped watching. “From” and “To” label the columns. Ribbon width=flow share; hover raises the ribbon opacity and dims others. Tooltip is exactly: `{behaviour} → {destination}`; `Flow share: {one decimal}%`; `Drop from source: {100 − flow share, one decimal}%`; `Window: Within 1 hour`. Show filter changes source/subtitle/flows; paths have hover but no keyboard focus, click or drilldown. Minimum 560px with horizontal scroll. A screen-reader-only list exposes every flow, and visible supporting copy identifies the source show/network and width meaning. Cohort, denominator and migration rules: **Requires product/data clarification**.

## KPI Visualisation Matrix

| KPI | User question | Primary metric | Secondary metric | Dimension | Chart | Filters | Drilldown |
|---|---|---|---|---|---|---|---|
| Overview | How large/active is the audience? | six summary metrics | four indices | audience | tiles | global, environment | No |
| Type | What is the viewing mix? | share % | estimated minutes/hh | TV type | donut | global, environment | cross-filter |
| Channel | Which destinations matter? | avg min/week | share, Index | channel/app | dual-axis bars | global, environment, type/tab | No |
| Shows | Which shows index highest? | avg min/hh | rendered share, Index | show | grouped bars | global, environment, type, platform, genre | show detail |
| Genres | Which genres matter? | avg min/week | share, Index | genre | grouped bars | global, environment, type, platform | cross-filter |
| Show detail | How does the show move weekly? | avg min/hh | households | week | dual-axis lines | inherited Shows filters | in-card detail |
| Temporal | When does the audience watch? | avg min/hh | % households | day×daypart | heatmap | global, environment, type/platform, channel/app, lookback | No |
| Affinity | Where does the audience index? | Index | viewers/show Index | parameter/show | radar+list | global, environment, type | in-card parameter detail |
| Behaviour | Where do viewers go next? | flow share | drop from source | migration path | Sankey | global, environment, type, genre, show | No |

## Chart Variations and States

- **Default:** UK/all-audience/last-30-days, All environment, no consumption type or genre selected; Linear TV tabs, Shows view, Temporal All channels/apps and 30-day (WoW); affinity detail resolves to the highest-index parameter; behaviour resolves All shows to the current top-indexing show.
- **Applied-filter/environment state:** all module data re-derives and loading skeletons precede the updated values; cross-filter/detail selections reset. Draft global edits do not alter charts.
- **Type-filtered state:** donut selection remains highlighted and a removable filter chip appears; Channel, Trends and Temporal tabs synchronize to that type, while Shows, genres, affinity and behaviour re-derive within scope. Clearing the type removes the scope but leaves platform tabs where the user last left them.
- **Alternative Trends dimension:** Shows displays the top-ten grouped chart and show dropdown; Genres displays all 12 genre groups and removes the show dropdown/alert. Toggling the switch clears show detail.
- **Show-detail state:** selecting a show replaces the grouped show chart with its four-week dual-line detail and dependent show selector.
- **Temporal alternatives:** platform changes rebuild the channel/app options; channel/app and lookback changes re-derive heatmap cells.
- **Affinity detail state:** selecting a radar parameter replaces the parameter/rank and top-five detail in place.
- **Behaviour source state:** selecting a show changes the subtitle, source copy and Sankey flows.
- **Loading/empty/error:** module skeletons, contextual empty states and inline PDF export error are as specified in Responsive / States. No Phase 1 comparison state exists.

## Chart Specifications

Index 100=national average; 150=50% above. It is not minutes or viewing percentage. Badges use arrow/text plus green/red/neutral. Radar explicitly shows baseline. Channel/show/genre currently append `%` to Index, conflicting with semantics: **Requires product/data clarification**.

Rendered mappings: Linear/primary=`--datavis-qualitative-4` `#7c33b5`; Streaming/secondary=`-3` `#a857e5`; FAST/tertiary=`-1` `#fbbb3b`; additional=`-2` `#ef8736`; line=`-5` `#ee4980`; neutral=`-7` `#e1e1e8`; positive `#115639`; negative `#da294b`; grid `#e1e1e8`; axis `#4b4b59`. Heat ramp: `#f6ebff`, `#e5c9f7`, `#cfa0ee`, `#b06fe0`, `#8a3fc9`, `#661f9e`. Grouped bars/show trend use qualitative-3 for minutes and qualitative-1 for percentage/households. Sankey uses primary, line pink and additional orange.

Tooltips are dark Fiber surfaces, portalled, max 320px/viewport-16px, 8px gap/edge, flip below, reposition on resize/ancestor scroll, and do not capture pointer.

## Drilldowns

Show bar/dropdown → in-card four-week dual-line detail; inherited state as above; All shows or view toggle returns. Radar parameter → in-card top-five detail; another parameter replaces it. Donut and genre are cross-filters, not drilldowns. No channel, heatmap, list-row or Sankey drilldown.

## Cross-KPI Interactions

Type syncs three platform tabs, scopes shows, shifts affinity, and constrains migration (Move to streaming app always targets Streaming). Genre constrains Shows and Behaviour. Affinity selection updates only its detail. Global/environment changes reset cross-filter selections. Channel/heatmap/Sankey hover never filters another card.

## Data Requirements

Known dimensions/metrics are exactly those in the KPI sections. Production source, refresh, identity, household weighting/deduplication, privacy thresholds, aggregation, denominators, taxonomy, aliases, classifications, benchmark, date/week/timezone/daypart logic, rounding/suppression, affinity and migration methodology all **Requires product/data clarification**. Synthetic `seeded/entityModel` logic is not a production specification.

| KPI | Known granularity/time/dependency | Confirmation required |
|---|---|---|
| Overview | one value per applied audience, date range and environment | metric aggregation, denominator and feed |
| Type | media type per applied audience/date/environment | minute aggregation and household estimate |
| Channel/App | channel/app within market and platform; top up to ten by minutes | inventory, aliases, share denominator and benchmark |
| Shows | show within platform/type/environment/genre; top ten by Index | show identity, `hhPct` meaning, share/reach denominator and benchmark |
| Genres | one row per rendered IAB genre within platform/type/environment | taxonomy governance, aggregation and share denominator |
| Show detail | selected show × Week 1–4 with inherited context | relationship between four weeks and global date range |
| Temporal | day × daypart within platform/channel/lookback | timezone, daypart boundaries and DoY/WoW definitions |
| Affinity | audience × parameter; selected parameter × top five shows | mapping, viewers, ranking, Index benchmark and feed |
| Behaviour | source show × behaviour × destination within one hour | cohort, attribution window, denominator, aggregation and migration rules |

## Design System Requirements

Use DM Sans, Fiber typography/spacing/surface/border/shadow/control tokens, MetricsTile, 4px SmartCards with 16px padding, searchable dropdowns, buttons, switch, rounded/underline tabs, chip, Info Alert, skeleton and empty state. Every chart is **Custom visualisation using Fiber design tokens**. Support dark tokens, keyboard selection, accessible names, non-colour cues, truncation and scrolling. No arbitrary chart palette.

## Responsive / States

Overview 2/3/6 columns; media card stacks then 20/80 at `lg`; Trends rows stack then align at `md`; affinity/behaviour stack then 3/7 at `lg`. Dropdown list max-height 220px. Exact framework breakpoints and production category virtualization: **Engineering decision required**.

Applied/global environment changes show tile loading and chart skeletons (~550ms prototype). Empty state uses illustration and contextual copy; Italy+Heavy is prototype-reachable. Export errors appear explicitly. Production API retry/partial errors: **Engineering decision required**.

## Functional Acceptance Criteria

- **Given** staged edits, **when** Apply is pressed, **then** every module updates and cross-filter selections reset.
- **Given** non-default applied filters, **when** Clear is pressed, **then** six filters return to defaults.
- **Given** either environment control, **when** changed, **then** its mirror and all modules update.
- **Given** Overview data, **when** the module renders, **then** all six exact metrics and the four applicable Index indicators use the documented formats and expose no chart interaction.
- **Given** the type donut, **when** an arc is hovered or clicked, or a legend row is hovered, focused or clicked, **then** the documented centre, dimming, tooltip and toggle behaviour appears.
- **Given** a type, **when** selected/cleared, **then** its chip and downstream scope/tabs synchronize or clear as documented.
- **Given** a Channel/App platform tab, **when** it changes, **then** up to ten valid destinations render with independent axes, the documented legend and exact tooltip, with no drilldown.
- **Given** Shows view, **when** platform/type/environment/genre changes, **then** the top-ten show universe, alert and dependent show options update consistently.
- **Given** Shows, **when** a show is selected, **then** four-week dual-axis detail opens; All shows returns.
- **Given** show detail, **when** a weekly point is hovered or focused, **then** both exact values and the dashed guide appear.
- **Given** Genres, **when** a genre is clicked, **then** its selected state toggles and the shared show/behaviour universe updates.
- **Given** Temporal platform changes, **when** a channel becomes invalid, **then** it resets to All.
- **Given** a Temporal cell, **when** hovered or focused, **then** both direct labels, selected outline and exact heat-intensity tooltip are available.
- **Given** a radar parameter, **when** clicked or Enter/Space activated, **then** rank/top-five update.
- **Given** a radar parameter, **when** hovered or focused, **then** its Index, interpretation and national baseline appear exactly as documented.
- **Given** a migration show, **when** selected, **then** source/subtitle/flows update.
- **Given** a Sankey ribbon, **when** hovered, **then** other ribbons dim and the exact path/share/drop/window tooltip appears; no click or keyboard interaction is implied.
- **Given** Export PDF, **when** activated, **then** the applied—not staged—context and rendered dashboard are exported with the documented header, exclusions, pagination and filename, while the button shows its busy state.
- **Given** loading, no-data or export-failure conditions represented by V5, **when** one occurs, **then** the corresponding documented skeleton, contextual empty state or inline error appears.
- **Given** narrow width, **when** a minimum-width chart overflows, **then** its region scrolls without clipping tooltip.
- **Given** Phase 1, **when** used, **then** no Comparison Mode control/state exists.

## Stakeholder Feedback Traceability

| Feedback | V5 solution | KPI / area affected | Status |
|---|---|---|---|
| Shared cards/merged type view | MetricsTile; one 20/80 SmartCard | Overview; Type; Channel/App | Incorporated |
| Addressable wording | All/Addressable rounded tabs | Global environment | Incorporated |
| Unlike metrics need distinct scales | independent dual axes | Channel/App; Shows; Genres; show detail | Incorporated |
| Trends as charts/dynamic dimensions | grouped bars + show/genre switch | Content viewership trends | Incorporated |
| Top-ten/show detail | alert, dependent dropdown, four-week lines | Shows | Incorporated |
| Better Index | arrows/explanation/radar rings | Overview; Channel/App; Trends; Affinity | Incorporated; suffix clarification |
| Dynamic temporal controls | platform-dependent inventory/reset | Temporal Insights | Incorporated |
| Hover/accessibility | portalled tooltips/focus labels | Rendered charts | Incorporated |
| Actionable affinity/Sankey | selected top-five; tokenized flows | Affinity; Behaviour | Incorporated |
| Comparison later | absent | Whole dashboard | Phase 2 |

## Out of Scope / Phase 2

**Comparison Mode is Phase 2**, including comparison controls, series, deltas, legends and tooltips. Also not delivered in rendered V5: the imported/unrendered Top N control and dead chart/list/table components; interaction for the displayed Advanced secondary-navigation label; unrendered drilldowns; and prototype collaboration/version tooling as production product features.

## Implementation Checklist

- **Product:** approve scope/personas/stories/clarifications.
- **Data:** contract every metric/dimension/benchmark/classification/date and relationship.
- **UX/UI:** build wrapper, six cards, controls, detail/state/responsive/theme behaviour.
- **Data visualisation:** exact charts, axes, labels, legends, tooltips, colours and accessibility.
- **Engineering:** staged/applied state, dependencies/resets, cross-KPI chain, PDF, represented errors, responsive/accessibility behaviour and tests; production API, caching and performance architecture is **Engineering decision required**.

## Open Questions / Clarifications

Target roles; feeds/SLAs; every metric denominator; show secondary meaning; Index `%` suffix; non-UK Mosaic; addressable classification; date-vs-week/DoY/WoW; affinity mapping; genre→affinity discrepancy; and migration methodology: **Requires product/data clarification**. Persistence, API retry/partial states, exact breakpoints, browser support and performance limits: **Engineering decision required**.

## Final V5 Cross-Check

- [x] Overview: six tiles.
- [x] Media type: DonutChart + DualAxisBarChart.
- [x] Trends: two ComboChart variants + ShowTrendChart.
- [x] TemporalHeatmap.
- [x] RadarChart + rendered top-five list.
- [x] MigrationSankey.
- [x] Every rendered global/local control, dependency, state, tooltip, wrapper and export.
- [x] Dead components excluded/discrepancies flagged.
- [x] Comparison Mode retained in Phase 2.
# TV Audience & Content Planner — Phase 1 Functional Requirements

**Status:** Production handoff derived from live V5  
**Route:** `/tv-audience-intelligence`  
**Phase boundary:** Phase 1 only. **Comparison Mode remains Phase 2.**

## Executive Summary

V5 is a single-page audience-led dashboard for defining a TV audience, understanding its scale and consumption, discovering platforms/channels/apps and content, inspecting temporal patterns and affinity, and viewing one-hour post-show migration. This specification covers only rendered V5 functionality. Prototype values are deterministic synthetic data, not a production feed. Unknowns use **Requires product/data clarification** or **Engineering decision required**.

## Product Scope

### Purpose, users, goals and use cases

The product supports users who need to: define a market/audience; quantify scale, volume and reach; compare Linear TV, Streaming and FAST; find channels/apps, shows and genres; inspect a show’s four-week trend; find day/daypart concentrations; identify affinity against the national average; inspect post-show behaviour; and export the applied view. V5 does not name personas or permissions: **Requires product/data clarification**.

### Phase 1 Scope

- Standalone Reports wrapper and one dashboard screen.
- Six staged global filters, Apply/Clear, immediate All/Addressable control, PDF export.
- Six Overview metrics.
- Six rendered SmartCards and all rendered visualisations/interactions/states.
- Cross-filtering, dependent controls, show/affinity details, responsive and accessible behaviour.

### User journey

Open Standard Reports → stage audience/date values → Apply → read Overview → select environment/type → inspect channel/app and show/genre performance → open show detail → inspect Temporal Insights → select an affinity parameter → select a migration source → export PDF.

The rendered page heading is **TV Audience & Content Planner**, with subtitle **Cross-platform content and audience consumption insights**.

## Dashboard Architecture

Order: title/subtitle; sticky global filters; **Overview**; All/Addressable; **TV viewership by media type** (Consumption by Type + Time Spent by Channel/App); **Content viewership trends**; mirrored All/Addressable; **Temporal Insights**; responsive **Content affinity** + **TV user behaviour**; notes.

Primary navigation is 64px, Reports active, with Intelligence/Audiences/Creatives/Campaigns displayed; full menu at ≥1024px and collapsed Reports menu below. Theme toggle and JS/Pro avatar are right. Secondary navigation is 56px: Standard active/link; Advanced inert. Header auto-hides/floats after scroll and is revealed by top hover/focus. Canvas max-width is 1440px. Prototype version/comment/annotation overlays are tooling, not product scope.

State hierarchy is staged filters → applied filters → immediate environment → optional consumption scope → module-local state. Applied global/environment changes clear type, genre, affinity, show and migration selections and show skeletons. A type selection synchronizes Channel, Trends and Temporal platform tabs and resets Temporal channel to All.

## Global Filters

All are searchable. Single-select closes after selection; multi-select stays open; search is case-insensitive; no result says “No matches.” Empty multi-selection means inclusive All.

| Filter | Exact options | Default | Behaviour |
|---|---|---|---|
| Country | United Kingdom, Germany, France, Italy, Spain | United Kingdom | All modules after Apply; determines linear inventory/commercial rules |
| Mosaic group | All Mosaic groups; City Prosperity; Prestige Positions; Country Living; Suburban Stability; Rental Hubs; Vintage Value | All Mosaic groups (empty) | All modules after Apply; All clears specifics |
| Age & gender | All genders, Male, Female × 16–24, 25–34, 35–44, 45–54, 55–64, 65+ (18) | All ages & genders (empty) | All modules after Apply |
| TV consumption | All viewers, Heavy TV, Medium TV, Light TV | All viewers | All modules after Apply |
| Children | All households; No children; Children 0–4; Children 5–11; Children 12–17 | All households (empty) | All modules after Apply; All clears specifics |
| Date range | Last 7 days; Last 15 days; Last 30 days; Last 60 days | Last 30 days | All modules after Apply |

Mosaic is rendered in all countries despite being described in code as UK-granular: **Requires product/data clarification**.

Edits are staged until Apply. Initially Apply is disabled. Pending edits enable Apply and do not affect KPIs/PDF. After non-default values are applied, the action becomes Clear all filters; Clear restores six defaults, but not environment/local tabs.

**All / Addressable channels** defaults All, updates immediately, appears twice with one synchronized state, and affects every module. Addressable excludes/reweights market-specific non-commercial inventory. Production classification: **Requires product/data clarification**.

**Export PDF** is immediate and always uses the applied filter/environment state, not un-applied draft values. While exporting, the outline button reads “Exporting…” and is disabled. The export is a paginated portrait A4 capture of the dashboard; the sticky filter bar and prototype overlays are omitted and replaced by a header containing the title, all six applied filter values, viewing environment, export date/time and the synthetic-data notice. The filename is `tv-audience-content-planner-{lowercase market code}-{YYYY-MM-DD}.pdf`. A failure is announced inline as `Export failed: {message}` or “Export failed — please try again.”

## Local Filters

| Module | Control; exact options | Default/dependency/effect |
|---|---|---|
| Type | clickable Linear TV, Streaming, FAST donut/legend | None; click again/removable chip clears; scopes downstream |
| Channel/App | Linear TV, Streaming, Fast tabs | Linear TV; synced by type; changes market inventory |
| Trends | View by show/genre switch | Shows; switching clears show |
| Trends | Linear TV, Streaming, Fast | Linear; synced by type; filters shows/reweights genres |
| Shows | All shows + unique valid shows | All; options depend on platform/type/environment/genre; selection opens detail |
| Genres | 12 rendered genre marks | None; selection toggles and restricts shared show universe |
| Temporal | platform tabs; All channels/apps + valid inventory; 7-day (DoY), 15-day (DoY), 30-day (WoW), 60-day (WoW) | Linear; All; 30-day WoW. Platform rebuilds channels; invalid channel resets All |
| Affinity | FOOD, TRAVEL, COMEDY, DOCUMENTARY, NEWS, MUSIC, LIFESTYLE, SPORTS | current highest Index; updates rank/top-five |
| Behaviour | All shows + valid scoped shows | All resolves to top-indexing show |

The data module’s `TOP_N` options and the `GenreBars`, `ShowsTable`, and `AffinityList` components exist but are not rendered; they are not delivered features. `LOOKBACK` is rendered only as the Temporal Insights lookback control.

## Filter Interaction Matrix

| Filter | Overview | Type | Channel | Trends | Temporal | Affinity | Behaviour |
|---|---:|---:|---:|---:|---:|---:|---:|
| Six applied global filters | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| All/Addressable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Type selection | — | selected | sync | sync/scope | sync | scope | scope |
| Genre selection | — | — | — | show universe | — | —* | shared show universe |
| Module-local controls | — | — | local | local | local | local detail | local |

\* Comments claim genre anchors affinity, but live affinity calculation ignores `selectedGenre`: **Requires product/data clarification**.

## KPI Requirements

### Overview

**User story:** As a dashboard user, I want a concise audience summary so that I can understand its scale and activity before exploring detail. **Business question:** how large and active is the audience?

Six Fiber MetricsTiles: **Total households** (K/M); **Total minutes viewed** (K/M); **Avg. weekly TV consumption – Streaming** (`mins`, Index); **Avg linear TV consumption** (`min/wk`, Index); **Avg. channels/apps per hh** (one decimal, Index); **Weekly TV reach** (`% of hh`, Index). Dimension: applied audience and viewing environment. No click, chart legend or tooltip. Source/calculations: **Requires product/data clarification**.

### Consumption by Type

**User story:** As a dashboard user, I want the viewing mix by media type so that I can choose the environment to investigate downstream. **Business question:** what share of minutes is Linear TV, Streaming or FAST?

Metric: share of viewing minutes, with estimated minutes per household as support. Dimension: media type. Visualisation: 200px donut (r78, stroke30), proportional share %. The clickable legend maps Linear TV to qualitative-4 purple, Streaming to qualitative-3 purple and FAST to qualitative-1 yellow, and shows each type’s one-decimal share. Centre defaults “Share of viewing”; hover or selection shows rounded share/name. Hover thickens the active arc by 4px and dims others to 35%. Arc tooltip: type; `Legend: Share of viewing`; share to one decimal; estimated integer minutes/hh. Legend tooltip omits the `Legend` line and otherwise shows the same metrics. Clicking an arc or legend row toggles the downstream type scope; the removable card chip is an equivalent clear action.

### Time Spent by Channel/App

**User story:** As a dashboard user, I want channel/app consumption ranked within a platform so that I can identify important destinations. **Business question:** which destinations matter?

Metrics: average minutes/week, share of watch time and Index. Dimension: channel/app within the selected Linear TV, Streaming or Fast tab. Up to ten destinations are shown, sorted by minutes, as grouped vertical bars. X=channel/app, >12 chars truncates to 11+ellipsis, supporting `Index N%`. Left Y=Avg min/week, five dynamic integer ticks; right Y=% of watch time, five percent ticks. The two-item legend maps minutes to qualitative-3 purple and percentage to qualitative-1 yellow. Tooltip is exactly: channel/app; `Index: N%`; `Highlight: {Index interpretation}`; `Avg min/week: {integer}`; `% of watch time: {one decimal}%`. Hover/focus dims other categories and applies a category wash. Minimum width 680px with horizontal scroll. No drilldown.

### Content Viewership Trends — Shows

**User story:** As a dashboard user, I want the highest-indexing shows for my audience so that I can inspect a relevant title. **Business question:** which ten shows index highest?

Metrics: average minutes/household, rendered `% of total watch time`, and Index supporting text. Dimension: show, constrained by platform/type/environment/genre. Grouped bars are sorted by Index. X=show + supporting `Index N%`; left Y=Avg min/HH; right Y=`% of total watch time`; independent five-tick scales. The legend maps average minutes/household to qualitative-3 purple and `% of total watch time` to qualitative-1 yellow; no line or Index legend is rendered. Tooltip is exactly: show; `Index: N%`; `Avg min / household: {integer} min`; `% of total watch time: {one decimal}%`. It does **not** include an Index interpretation. Click/category or dependent dropdown opens detail. Alert states top 10/platform. Empty title is “No shows match”; message is “No shows match these filters — change the genre filter or viewing scope.” Data property is `hhPct`/commented household reach but UI says watch time: **Requires product/data clarification**.

### Content Viewership Trends — Genres

**User story:** As a dashboard user, I want genre consumption and Index indicators so that I can constrain the show universe. **Business question:** which IAB genres matter?

Metrics: average minutes/week, share of watch time and Index supporting text. Dimension options: Comedy, News, Film, Sports, Drama, Reality, Action, Documentary, Kids, Travel, Food, Home improvement. The same grouped-bar encoding uses left Y=Avg min/week and right Y=Watch time (%), with independent five-tick scales. The legend maps average minutes/week to qualitative-3 purple and share of watch time to qualitative-1 yellow. X labels show genre plus `Index N%`. Tooltip is exactly: genre; `Index: N%`; `Avg minutes / week: {integer} min`; `Share of watch time: {one decimal}%`; it does not include Index interpretation. Click toggles genre selection and the selected category is exposed as pressed. No direct affinity update occurs in live code.

### Selected Show Consumption Over Time

**User story:** As a dashboard user, I want a selected show’s recent consumption trend so that I can understand its weekly movement. **Business question:** how did audience consumption and households watching change across four weeks?

Four-week dual-line detail. X=Week 1–4; left Y=Avg mins/hh; right Y=Households formatted M; five ticks, maxima 115% of data. Legend: Households watching=qualitative-1 yellow; Avg. minutes watched per household=qualitative-3 purple. Hover/focus shows a dashed vertical guide and tooltip: week; `Households watching: {integer}`; `Avg. minutes / household: {integer}`. Inherits all filters, environment, type, genre and Trends platform. All shows returns; another show switches detail. Relation to Date range: **Requires product/data clarification**.

### Temporal Insights

**User story:** As a dashboard user, I want audience concentration by day and daypart so that I can identify strong viewing windows. **Business question:** when does this audience watch?

Metrics: average minutes watched per household and percentage of households watching. Dimensions: day of week × daypart. The 7×6 heatmap has rows Mon–Sun and columns Early AM, Morning, Daytime, Afternoon, Primetime, Late Night. Each cell directly shows `{minutes}m` and household percentage to one decimal. Tooltip is exactly: `{day} · {daypart}`; `Avg minutes/hh: {minutes}m`; `% households: {one decimal}%`; `Heat intensity: N of 6 (low → high minutes)`. Six-step brand ramp encodes minutes; legend is `Low` → six swatches → `High` · `avg mins watched per household`. Hover/focus adds a selected outline; there is no click. Minimum width 720px with horizontal scroll. DoY/WoW definition: **Requires product/data clarification**.

### Content Affinity

**User story:** As a dashboard user, I want affinity against the national average so that I can identify the audience’s strongest content/lifestyle parameter and related shows. **Business question:** where does this audience over- or under-index, and which shows are associated with the selected parameter?

Metric: Index; detail metrics are viewers and show Index. Dimensions: eight fixed parameters and their mapped shows. Eight-axis radar, Index 0–200, numeric rings 50/100/150/200, dashed national baseline 100, unfilled qualitative-4 primary polygon. Tooltip is exactly: parameter; `Index: N`; `Highlight: {Index interpretation}`; `Baseline: National average = 100`. Pointer and Enter/Space select; selected label is bold/underlined and vertex enlarged. Default is highest Index. Supporting text states “Dashed ring = national average (100). Select a parameter to view its details.” Live detail says `{PARAMETER} — top 5 shows`, `Selected parameter · rank N of 8`, then viewer-ranked rows with list rank, compact viewers and `{index} idx`; rows are not clickable. Taxonomy/mapping/ranking/feed: **Requires product/data clarification**.

### TV User Behaviour

**User story:** As a dashboard user, I want to see post-show migration so that I can understand the audience’s next behaviour and destination. **Business question:** where do source-show viewers go within one hour?

Metric: flow share; supporting calculation displayed as drop from source. Dimensions: source show/network → behaviour → destination show/network or Other/stopped. Custom Sankey uses the top three behaviours from Stay on same channel/Switch channel/Move to streaming app/Stop watching; targets are the two strongest show · network destinations plus Other / stopped watching. “From” and “To” label the columns. Ribbon width=flow share; hover raises the ribbon opacity and dims others. Tooltip is exactly: `{behaviour} → {destination}`; `Flow share: {one decimal}%`; `Drop from source: {100 − flow share, one decimal}%`; `Window: Within 1 hour`. Show filter changes source/subtitle/flows; paths have hover but no keyboard focus, click or drilldown. Minimum 560px with horizontal scroll. A screen-reader-only list exposes every flow, and visible supporting copy identifies the source show/network and width meaning. Cohort, denominator and migration rules: **Requires product/data clarification**.

## KPI Visualisation Matrix

| KPI | User question | Primary metric | Secondary metric | Dimension | Chart | Filters | Drilldown |
|---|---|---|---|---|---|---|---|
| Overview | How large/active is the audience? | six summary metrics | four indices | audience | tiles | global, environment | No |
| Type | What is the viewing mix? | share % | estimated minutes/hh | TV type | donut | global, environment | cross-filter |
| Channel | Which destinations matter? | avg min/week | share, Index | channel/app | dual-axis bars | global, environment, type/tab | No |
| Shows | Which shows index highest? | avg min/hh | rendered share, Index | show | grouped bars | global, environment, type, platform, genre | show detail |
| Genres | Which genres matter? | avg min/week | share, Index | genre | grouped bars | global, environment, type, platform | cross-filter |
| Show detail | How does the show move weekly? | avg min/hh | households | week | dual-axis lines | inherited Shows filters | in-card detail |
| Temporal | When does the audience watch? | avg min/hh | % households | day×daypart | heatmap | global, environment, type/platform, channel/app, lookback | No |
| Affinity | Where does the audience index? | Index | viewers/show Index | parameter/show | radar+list | global, environment, type | in-card parameter detail |
| Behaviour | Where do viewers go next? | flow share | drop from source | migration path | Sankey | global, environment, type, genre, show | No |

## Chart Variations and States

- **Default:** UK/all-audience/last-30-days, All environment, no consumption type or genre selected; Linear TV tabs, Shows view, Temporal All channels/apps and 30-day (WoW); affinity detail resolves to the highest-index parameter; behaviour resolves All shows to the current top-indexing show.
- **Applied-filter/environment state:** all module data re-derives and loading skeletons precede the updated values; cross-filter/detail selections reset. Draft global edits do not alter charts.
- **Type-filtered state:** donut selection remains highlighted and a removable filter chip appears; Channel, Trends and Temporal tabs synchronize to that type, while Shows, genres, affinity and behaviour re-derive within scope. Clearing the type removes the scope but leaves platform tabs where the user last left them.
- **Alternative Trends dimension:** Shows displays the top-ten grouped chart and show dropdown; Genres displays all 12 genre groups and removes the show dropdown/alert. Toggling the switch clears show detail.
- **Show-detail state:** selecting a show replaces the grouped show chart with its four-week dual-line detail and dependent show selector.
- **Temporal alternatives:** platform changes rebuild the channel/app options; channel/app and lookback changes re-derive heatmap cells.
- **Affinity detail state:** selecting a radar parameter replaces the parameter/rank and top-five detail in place.
- **Behaviour source state:** selecting a show changes the subtitle, source copy and Sankey flows.
- **Loading/empty/error:** module skeletons, contextual empty states and inline PDF export error are as specified in Responsive / States. No Phase 1 comparison state exists.

## Chart Specifications

Index 100=national average; 150=50% above. It is not minutes or viewing percentage. Badges use arrow/text plus green/red/neutral. Radar explicitly shows baseline. Channel/show/genre currently append `%` to Index, conflicting with semantics: **Requires product/data clarification**.

Rendered mappings: Linear/primary=`--datavis-qualitative-4` `#7c33b5`; Streaming/secondary=`-3` `#a857e5`; FAST/tertiary=`-1` `#fbbb3b`; additional=`-2` `#ef8736`; line=`-5` `#ee4980`; neutral=`-7` `#e1e1e8`; positive `#115639`; negative `#da294b`; grid `#e1e1e8`; axis `#4b4b59`. Heat ramp: `#f6ebff`, `#e5c9f7`, `#cfa0ee`, `#b06fe0`, `#8a3fc9`, `#661f9e`. Grouped bars/show trend use qualitative-3 for minutes and qualitative-1 for percentage/households. Sankey uses primary, line pink and additional orange.

Tooltips are dark Fiber surfaces, portalled, max 320px/viewport-16px, 8px gap/edge, flip below, reposition on resize/ancestor scroll, and do not capture pointer.

## Drilldowns

Show bar/dropdown → in-card four-week dual-line detail; inherited state as above; All shows or view toggle returns. Radar parameter → in-card top-five detail; another parameter replaces it. Donut and genre are cross-filters, not drilldowns. No channel, heatmap, list-row or Sankey drilldown.

## Cross-KPI Interactions

Type syncs three platform tabs, scopes shows, shifts affinity, and constrains migration (Move to streaming app always targets Streaming). Genre constrains Shows and Behaviour. Affinity selection updates only its detail. Global/environment changes reset cross-filter selections. Channel/heatmap/Sankey hover never filters another card.

## Data Requirements

Known dimensions/metrics are exactly those in the KPI sections. Production source, refresh, identity, household weighting/deduplication, privacy thresholds, aggregation, denominators, taxonomy, aliases, classifications, benchmark, date/week/timezone/daypart logic, rounding/suppression, affinity and migration methodology all **Requires product/data clarification**. Synthetic `seeded/entityModel` logic is not a production specification.

| KPI | Known granularity/time/dependency | Confirmation required |
|---|---|---|
| Overview | one value per applied audience, date range and environment | metric aggregation, denominator and feed |
| Type | media type per applied audience/date/environment | minute aggregation and household estimate |
| Channel/App | channel/app within market and platform; top up to ten by minutes | inventory, aliases, share denominator and benchmark |
| Shows | show within platform/type/environment/genre; top ten by Index | show identity, `hhPct` meaning, share/reach denominator and benchmark |
| Genres | one row per rendered IAB genre within platform/type/environment | taxonomy governance, aggregation and share denominator |
| Show detail | selected show × Week 1–4 with inherited context | relationship between four weeks and global date range |
| Temporal | day × daypart within platform/channel/lookback | timezone, daypart boundaries and DoY/WoW definitions |
| Affinity | audience × parameter; selected parameter × top five shows | mapping, viewers, ranking, Index benchmark and feed |
| Behaviour | source show × behaviour × destination within one hour | cohort, attribution window, denominator, aggregation and migration rules |

## Design System Requirements

Use DM Sans, Fiber typography/spacing/surface/border/shadow/control tokens, MetricsTile, 4px SmartCards with 16px padding, searchable dropdowns, buttons, switch, rounded/underline tabs, chip, Info Alert, skeleton and empty state. Every chart is **Custom visualisation using Fiber design tokens**. Support dark tokens, keyboard selection, accessible names, non-colour cues, truncation and scrolling. No arbitrary chart palette.

## Responsive / States

Overview 2/3/6 columns; media card stacks then 20/80 at `lg`; Trends rows stack then align at `md`; affinity/behaviour stack then 3/7 at `lg`. Dropdown list max-height 220px. Exact framework breakpoints and production category virtualization: **Engineering decision required**.

Applied/global environment changes show tile loading and chart skeletons (~550ms prototype). Empty state uses illustration and contextual copy; Italy+Heavy is prototype-reachable. Export errors appear explicitly. Production API retry/partial errors: **Engineering decision required**.

## Functional Acceptance Criteria

- **Given** staged edits, **when** Apply is pressed, **then** every module updates and cross-filter selections reset.
- **Given** non-default applied filters, **when** Clear is pressed, **then** six filters return to defaults.
- **Given** either environment control, **when** changed, **then** its mirror and all modules update.
- **Given** Overview data, **when** the module renders, **then** all six exact metrics and the four applicable Index indicators use the documented formats and expose no chart interaction.
- **Given** the type donut, **when** an arc is hovered or clicked, or a legend row is hovered, focused or clicked, **then** the documented centre, dimming, tooltip and toggle behaviour appears.
- **Given** a type, **when** selected/cleared, **then** its chip and downstream scope/tabs synchronize or clear as documented.
- **Given** a Channel/App platform tab, **when** it changes, **then** up to ten valid destinations render with independent axes, the documented legend and exact tooltip, with no drilldown.
- **Given** Shows view, **when** platform/type/environment/genre changes, **then** the top-ten show universe, alert and dependent show options update consistently.
- **Given** Shows, **when** a show is selected, **then** four-week dual-axis detail opens; All shows returns.
- **Given** show detail, **when** a weekly point is hovered or focused, **then** both exact values and the dashed guide appear.
- **Given** Genres, **when** a genre is clicked, **then** its selected state toggles and the shared show/behaviour universe updates.
- **Given** Temporal platform changes, **when** a channel becomes invalid, **then** it resets to All.
- **Given** a Temporal cell, **when** hovered or focused, **then** both direct labels, selected outline and exact heat-intensity tooltip are available.
- **Given** a radar parameter, **when** clicked or Enter/Space activated, **then** rank/top-five update.
- **Given** a radar parameter, **when** hovered or focused, **then** its Index, interpretation and national baseline appear exactly as documented.
- **Given** a migration show, **when** selected, **then** source/subtitle/flows update.
- **Given** a Sankey ribbon, **when** hovered, **then** other ribbons dim and the exact path/share/drop/window tooltip appears; no click or keyboard interaction is implied.
- **Given** Export PDF, **when** activated, **then** the applied—not staged—context and rendered dashboard are exported with the documented header, exclusions, pagination and filename, while the button shows its busy state.
- **Given** loading, no-data or export-failure conditions represented by V5, **when** one occurs, **then** the corresponding documented skeleton, contextual empty state or inline error appears.
- **Given** narrow width, **when** a minimum-width chart overflows, **then** its region scrolls without clipping tooltip.
- **Given** Phase 1, **when** used, **then** no Comparison Mode control/state exists.

## Stakeholder Feedback Traceability

| Feedback | V5 solution | KPI / area affected | Status |
|---|---|---|---|
| Shared cards/merged type view | MetricsTile; one 20/80 SmartCard | Overview; Type; Channel/App | Incorporated |
| Addressable wording | All/Addressable rounded tabs | Global environment | Incorporated |
| Unlike metrics need distinct scales | independent dual axes | Channel/App; Shows; Genres; show detail | Incorporated |
| Trends as charts/dynamic dimensions | grouped bars + show/genre switch | Content viewership trends | Incorporated |
| Top-ten/show detail | alert, dependent dropdown, four-week lines | Shows | Incorporated |
| Better Index | arrows/explanation/radar rings | Overview; Channel/App; Trends; Affinity | Incorporated; suffix clarification |
| Dynamic temporal controls | platform-dependent inventory/reset | Temporal Insights | Incorporated |
| Hover/accessibility | portalled tooltips/focus labels | Rendered charts | Incorporated |
| Actionable affinity/Sankey | selected top-five; tokenized flows | Affinity; Behaviour | Incorporated |
| Comparison later | absent | Whole dashboard | Phase 2 |

## Out of Scope / Phase 2

**Comparison Mode is Phase 2**, including comparison controls, series, deltas, legends and tooltips. Also not delivered in rendered V5: the imported/unrendered Top N control and dead chart/list/table components; interaction for the displayed Advanced secondary-navigation label; unrendered drilldowns; and prototype collaboration/version tooling as production product features.

## Implementation Checklist

- **Product:** approve scope/personas/stories/clarifications.
- **Data:** contract every metric/dimension/benchmark/classification/date and relationship.
- **UX/UI:** build wrapper, six cards, controls, detail/state/responsive/theme behaviour.
- **Data visualisation:** exact charts, axes, labels, legends, tooltips, colours and accessibility.
- **Engineering:** staged/applied state, dependencies/resets, cross-KPI chain, PDF, represented errors, responsive/accessibility behaviour and tests; production API, caching and performance architecture is **Engineering decision required**.

## Open Questions / Clarifications

Target roles; feeds/SLAs; every metric denominator; show secondary meaning; Index `%` suffix; non-UK Mosaic; addressable classification; date-vs-week/DoY/WoW; affinity mapping; genre→affinity discrepancy; and migration methodology: **Requires product/data clarification**. Persistence, API retry/partial states, exact breakpoints, browser support and performance limits: **Engineering decision required**.

## Final V5 Cross-Check

- [x] Overview: six tiles.
- [x] Media type: DonutChart + DualAxisBarChart.
- [x] Trends: two ComboChart variants + ShowTrendChart.
- [x] TemporalHeatmap.
- [x] RadarChart + rendered top-five list.
- [x] MigrationSankey.
- [x] Every rendered global/local control, dependency, state, tooltip, wrapper and export.
- [x] Dead components excluded/discrepancies flagged.
- [x] Comparison Mode retained in Phase 2.
# TV Audience & Content Planner — Phase 1 Functional Requirements

**Status:** Production handoff derived from live V5  
**Route:** `/tv-audience-intelligence`  
**Phase boundary:** Phase 1 only. **Comparison Mode remains Phase 2.**

## Executive Summary

V5 is a single-page audience-led dashboard for defining a TV audience, understanding its scale and consumption, discovering platforms/channels/apps and content, inspecting temporal patterns and affinity, and viewing one-hour post-show migration. This specification covers only rendered V5 functionality. Prototype values are deterministic synthetic data, not a production feed. Unknowns use **Requires product/data clarification** or **Engineering decision required**.

## Product Scope

### Purpose, users, goals and use cases

The product supports users who need to: define a market/audience; quantify scale, volume and reach; compare Linear TV, Streaming and FAST; find channels/apps, shows and genres; inspect a show’s four-week trend; find day/daypart concentrations; identify affinity against the national average; inspect post-show behaviour; and export the applied view. V5 does not name personas or permissions: **Requires product/data clarification**.

### Phase 1 Scope

- Standalone Reports wrapper and one dashboard screen.
- Six staged global filters, Apply/Clear, immediate All/Addressable control, PDF export.
- Six Overview metrics.
- Six rendered SmartCards and all rendered visualisations/interactions/states.
- Cross-filtering, dependent controls, show/affinity details, responsive and accessible behaviour.

### User journey

Open Standard Reports → stage audience/date values → Apply → read Overview → select environment/type → inspect channel/app and show/genre performance → open show detail → inspect Temporal Insights → select an affinity parameter → select a migration source → export PDF.

The rendered page heading is **TV Audience & Content Planner**, with subtitle **Cross-platform content and audience consumption insights**.

## Dashboard Architecture

Order: title/subtitle; sticky global filters; **Overview**; All/Addressable; **TV viewership by media type** (Consumption by Type + Time Spent by Channel/App); **Content viewership trends**; mirrored All/Addressable; **Temporal Insights**; responsive **Content affinity** + **TV user behaviour**; notes.

Primary navigation is 64px, Reports active, with Intelligence/Audiences/Creatives/Campaigns displayed; full menu at ≥1024px and collapsed Reports menu below. Theme toggle and JS/Pro avatar are right. Secondary navigation is 56px: Standard active/link; Advanced inert. Header auto-hides/floats after scroll and is revealed by top hover/focus. Canvas max-width is 1440px. Prototype version/comment/annotation overlays are tooling, not product scope.

State hierarchy is staged filters → applied filters → immediate environment → optional consumption scope → module-local state. Applied global/environment changes clear type, genre, affinity, show and migration selections and show skeletons. A type selection synchronizes Channel, Trends and Temporal platform tabs and resets Temporal channel to All.

## Global Filters

All are searchable. Single-select closes after selection; multi-select stays open; search is case-insensitive; no result says “No matches.” Empty multi-selection means inclusive All.

| Filter | Exact options | Default | Behaviour |
|---|---|---|---|
| Country | United Kingdom, Germany, France, Italy, Spain | United Kingdom | All modules after Apply; determines linear inventory/commercial rules |
| Mosaic group | All Mosaic groups; City Prosperity; Prestige Positions; Country Living; Suburban Stability; Rental Hubs; Vintage Value | All Mosaic groups (empty) | All modules after Apply; All clears specifics |
| Age & gender | All genders, Male, Female × 16–24, 25–34, 35–44, 45–54, 55–64, 65+ (18) | All ages & genders (empty) | All modules after Apply |
| TV consumption | All viewers, Heavy TV, Medium TV, Light TV | All viewers | All modules after Apply |
| Children | All households; No children; Children 0–4; Children 5–11; Children 12–17 | All households (empty) | All modules after Apply; All clears specifics |
| Date range | Last 7 days; Last 15 days; Last 30 days; Last 60 days | Last 30 days | All modules after Apply |

Mosaic is rendered in all countries despite being described in code as UK-granular: **Requires product/data clarification**.

Edits are staged until Apply. Initially Apply is disabled. Pending edits enable Apply and do not affect KPIs/PDF. After non-default values are applied, the action becomes Clear all filters; Clear restores six defaults, but not environment/local tabs.

**All / Addressable channels** defaults All, updates immediately, appears twice with one synchronized state, and affects every module. Addressable excludes/reweights market-specific non-commercial inventory. Production classification: **Requires product/data clarification**.

**Export PDF** is immediate and always uses the applied filter/environment state, not un-applied draft values. While exporting, the outline button reads “Exporting…” and is disabled. The export is a paginated portrait A4 capture of the dashboard; the sticky filter bar and prototype overlays are omitted and replaced by a header containing the title, all six applied filter values, viewing environment, export date/time and the synthetic-data notice. The filename is `tv-audience-content-planner-{lowercase market code}-{YYYY-MM-DD}.pdf`. A failure is announced inline as `Export failed: {message}` or “Export failed — please try again.”

## Local Filters

| Module | Control; exact options | Default/dependency/effect |
|---|---|---|
| Type | clickable Linear TV, Streaming, FAST donut/legend | None; click again/removable chip clears; scopes downstream |
| Channel/App | Linear TV, Streaming, Fast tabs | Linear TV; synced by type; changes market inventory |
| Trends | View by show/genre switch | Shows; switching clears show |
| Trends | Linear TV, Streaming, Fast | Linear; synced by type; filters shows/reweights genres |
| Shows | All shows + unique valid shows | All; options depend on platform/type/environment/genre; selection opens detail |
| Genres | 12 rendered genre marks | None; selection toggles and restricts shared show universe |
| Temporal | platform tabs; All channels/apps + valid inventory; 7-day (DoY), 15-day (DoY), 30-day (WoW), 60-day (WoW) | Linear; All; 30-day WoW. Platform rebuilds channels; invalid channel resets All |
| Affinity | FOOD, TRAVEL, COMEDY, DOCUMENTARY, NEWS, MUSIC, LIFESTYLE, SPORTS | current highest Index; updates rank/top-five |
| Behaviour | All shows + valid scoped shows | All resolves to top-indexing show |

The data module’s `TOP_N` options and the `GenreBars`, `ShowsTable`, and `AffinityList` components exist but are not rendered; they are not delivered features. `LOOKBACK` is rendered only as the Temporal Insights lookback control.

## Filter Interaction Matrix

| Filter | Overview | Type | Channel | Trends | Temporal | Affinity | Behaviour |
|---|---:|---:|---:|---:|---:|---:|---:|
| Six applied global filters | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| All/Addressable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Type selection | — | selected | sync | sync/scope | sync | scope | scope |
| Genre selection | — | — | — | show universe | — | —* | shared show universe |
| Module-local controls | — | — | local | local | local | local detail | local |

\* Comments claim genre anchors affinity, but live affinity calculation ignores `selectedGenre`: **Requires product/data clarification**.

## KPI Requirements

### Overview

**User story:** As a dashboard user, I want a concise audience summary so that I can understand its scale and activity before exploring detail. **Business question:** how large and active is the audience?

Six Fiber MetricsTiles: **Total households** (K/M); **Total minutes viewed** (K/M); **Avg. weekly TV consumption – Streaming** (`mins`, Index); **Avg linear TV consumption** (`min/wk`, Index); **Avg. channels/apps per hh** (one decimal, Index); **Weekly TV reach** (`% of hh`, Index). Dimension: applied audience and viewing environment. No click, chart legend or tooltip. Source/calculations: **Requires product/data clarification**.

### Consumption by Type

**User story:** As a dashboard user, I want the viewing mix by media type so that I can choose the environment to investigate downstream. **Business question:** what share of minutes is Linear TV, Streaming or FAST?

Metric: share of viewing minutes, with estimated minutes per household as support. Dimension: media type. Visualisation: 200px donut (r78, stroke30), proportional share %. The clickable legend maps Linear TV to qualitative-4 purple, Streaming to qualitative-3 purple and FAST to qualitative-1 yellow, and shows each type’s one-decimal share. Centre defaults “Share of viewing”; hover or selection shows rounded share/name. Hover thickens the active arc by 4px and dims others to 35%. Arc tooltip: type; `Legend: Share of viewing`; share to one decimal; estimated integer minutes/hh. Legend tooltip omits the `Legend` line and otherwise shows the same metrics. Clicking an arc or legend row toggles the downstream type scope; the removable card chip is an equivalent clear action.

### Time Spent by Channel/App

**User story:** As a dashboard user, I want channel/app consumption ranked within a platform so that I can identify important destinations. **Business question:** which destinations matter?

Metrics: average minutes/week, share of watch time and Index. Dimension: channel/app within the selected Linear TV, Streaming or Fast tab. Up to ten destinations are shown, sorted by minutes, as grouped vertical bars. X=channel/app, >12 chars truncates to 11+ellipsis, supporting `Index N%`. Left Y=Avg min/week, five dynamic integer ticks; right Y=% of watch time, five percent ticks. The two-item legend maps minutes to qualitative-3 purple and percentage to qualitative-1 yellow. Tooltip is exactly: channel/app; `Index: N%`; `Highlight: {Index interpretation}`; `Avg min/week: {integer}`; `% of watch time: {one decimal}%`. Hover/focus dims other categories and applies a category wash. Minimum width 680px with horizontal scroll. No drilldown.

### Content Viewership Trends — Shows

**User story:** As a dashboard user, I want the highest-indexing shows for my audience so that I can inspect a relevant title. **Business question:** which ten shows index highest?

Metrics: average minutes/household, rendered `% of total watch time`, and Index supporting text. Dimension: show, constrained by platform/type/environment/genre. Grouped bars are sorted by Index. X=show + supporting `Index N%`; left Y=Avg min/HH; right Y=`% of total watch time`; independent five-tick scales. The legend maps average minutes/household to qualitative-3 purple and `% of total watch time` to qualitative-1 yellow; no line or Index legend is rendered. Tooltip is exactly: show; `Index: N%`; `Avg min / household: {integer} min`; `% of total watch time: {one decimal}%`. It does **not** include an Index interpretation. Click/category or dependent dropdown opens detail. Alert states top 10/platform. Empty title is “No shows match”; message is “No shows match these filters — change the genre filter or viewing scope.” Data property is `hhPct`/commented household reach but UI says watch time: **Requires product/data clarification**.

### Content Viewership Trends — Genres

**User story:** As a dashboard user, I want genre consumption and Index indicators so that I can constrain the show universe. **Business question:** which IAB genres matter?

Metrics: average minutes/week, share of watch time and Index supporting text. Dimension options: Comedy, News, Film, Sports, Drama, Reality, Action, Documentary, Kids, Travel, Food, Home improvement. The same grouped-bar encoding uses left Y=Avg min/week and right Y=Watch time (%), with independent five-tick scales. The legend maps average minutes/week to qualitative-3 purple and share of watch time to qualitative-1 yellow. X labels show genre plus `Index N%`. Tooltip is exactly: genre; `Index: N%`; `Avg minutes / week: {integer} min`; `Share of watch time: {one decimal}%`; it does not include Index interpretation. Click toggles genre selection and the selected category is exposed as pressed. No direct affinity update occurs in live code.

### Selected Show Consumption Over Time

**User story:** As a dashboard user, I want a selected show’s recent consumption trend so that I can understand its weekly movement. **Business question:** how did audience consumption and households watching change across four weeks?

Four-week dual-line detail. X=Week 1–4; left Y=Avg mins/hh; right Y=Households formatted M; five ticks, maxima 115% of data. Legend: Households watching=qualitative-1 yellow; Avg. minutes watched per household=qualitative-3 purple. Hover/focus shows a dashed vertical guide and tooltip: week; `Households watching: {integer}`; `Avg. minutes / household: {integer}`. Inherits all filters, environment, type, genre and Trends platform. All shows returns; another show switches detail. Relation to Date range: **Requires product/data clarification**.

### Temporal Insights

**User story:** As a dashboard user, I want audience concentration by day and daypart so that I can identify strong viewing windows. **Business question:** when does this audience watch?

Metrics: average minutes watched per household and percentage of households watching. Dimensions: day of week × daypart. The 7×6 heatmap has rows Mon–Sun and columns Early AM, Morning, Daytime, Afternoon, Primetime, Late Night. Each cell directly shows `{minutes}m` and household percentage to one decimal. Tooltip is exactly: `{day} · {daypart}`; `Avg minutes/hh: {minutes}m`; `% households: {one decimal}%`; `Heat intensity: N of 6 (low → high minutes)`. Six-step brand ramp encodes minutes; legend is `Low` → six swatches → `High` · `avg mins watched per household`. Hover/focus adds a selected outline; there is no click. Minimum width 720px with horizontal scroll. DoY/WoW definition: **Requires product/data clarification**.

### Content Affinity

**User story:** As a dashboard user, I want affinity against the national average so that I can identify the audience’s strongest content/lifestyle parameter and related shows. **Business question:** where does this audience over- or under-index, and which shows are associated with the selected parameter?

Metric: Index; detail metrics are viewers and show Index. Dimensions: eight fixed parameters and their mapped shows. Eight-axis radar, Index 0–200, numeric rings 50/100/150/200, dashed national baseline 100, unfilled qualitative-4 primary polygon. Tooltip is exactly: parameter; `Index: N`; `Highlight: {Index interpretation}`; `Baseline: National average = 100`. Pointer and Enter/Space select; selected label is bold/underlined and vertex enlarged. Default is highest Index. Supporting text states “Dashed ring = national average (100). Select a parameter to view its details.” Live detail says `{PARAMETER} — top 5 shows`, `Selected parameter · rank N of 8`, then viewer-ranked rows with list rank, compact viewers and `{index} idx`; rows are not clickable. Taxonomy/mapping/ranking/feed: **Requires product/data clarification**.

### TV User Behaviour

**User story:** As a dashboard user, I want to see post-show migration so that I can understand the audience’s next behaviour and destination. **Business question:** where do source-show viewers go within one hour?

Metric: flow share; supporting calculation displayed as drop from source. Dimensions: source show/network → behaviour → destination show/network or Other/stopped. Custom Sankey uses the top three behaviours from Stay on same channel/Switch channel/Move to streaming app/Stop watching; targets are the two strongest show · network destinations plus Other / stopped watching. “From” and “To” label the columns. Ribbon width=flow share; hover raises the ribbon opacity and dims others. Tooltip is exactly: `{behaviour} → {destination}`; `Flow share: {one decimal}%`; `Drop from source: {100 − flow share, one decimal}%`; `Window: Within 1 hour`. Show filter changes source/subtitle/flows; paths have hover but no keyboard focus, click or drilldown. Minimum 560px with horizontal scroll. A screen-reader-only list exposes every flow, and visible supporting copy identifies the source show/network and width meaning. Cohort, denominator and migration rules: **Requires product/data clarification**.

## KPI Visualisation Matrix

| KPI | User question | Primary metric | Secondary metric | Dimension | Chart | Filters | Drilldown |
|---|---|---|---|---|---|---|---|
| Overview | How large/active is the audience? | six summary metrics | four indices | audience | tiles | global, environment | No |
| Type | What is the viewing mix? | share % | estimated minutes/hh | TV type | donut | global, environment | cross-filter |
| Channel | Which destinations matter? | avg min/week | share, Index | channel/app | dual-axis bars | global, environment, type/tab | No |
| Shows | Which shows index highest? | avg min/hh | rendered share, Index | show | grouped bars | global, environment, type, platform, genre | show detail |
| Genres | Which genres matter? | avg min/week | share, Index | genre | grouped bars | global, environment, type, platform | cross-filter |
| Show detail | How does the show move weekly? | avg min/hh | households | week | dual-axis lines | inherited Shows filters | in-card detail |
| Temporal | When does the audience watch? | avg min/hh | % households | day×daypart | heatmap | global, environment, type/platform, channel/app, lookback | No |
| Affinity | Where does the audience index? | Index | viewers/show Index | parameter/show | radar+list | global, environment, type | in-card parameter detail |
| Behaviour | Where do viewers go next? | flow share | drop from source | migration path | Sankey | global, environment, type, genre, show | No |

## Chart Variations and States

- **Default:** UK/all-audience/last-30-days, All environment, no consumption type or genre selected; Linear TV tabs, Shows view, Temporal All channels/apps and 30-day (WoW); affinity detail resolves to the highest-index parameter; behaviour resolves All shows to the current top-indexing show.
- **Applied-filter/environment state:** all module data re-derives and loading skeletons precede the updated values; cross-filter/detail selections reset. Draft global edits do not alter charts.
- **Type-filtered state:** donut selection remains highlighted and a removable filter chip appears; Channel, Trends and Temporal tabs synchronize to that type, while Shows, genres, affinity and behaviour re-derive within scope. Clearing the type removes the scope but leaves platform tabs where the user last left them.
- **Alternative Trends dimension:** Shows displays the top-ten grouped chart and show dropdown; Genres displays all 12 genre groups and removes the show dropdown/alert. Toggling the switch clears show detail.
- **Show-detail state:** selecting a show replaces the grouped show chart with its four-week dual-line detail and dependent show selector.
- **Temporal alternatives:** platform changes rebuild the channel/app options; channel/app and lookback changes re-derive heatmap cells.
- **Affinity detail state:** selecting a radar parameter replaces the parameter/rank and top-five detail in place.
- **Behaviour source state:** selecting a show changes the subtitle, source copy and Sankey flows.
- **Loading/empty/error:** module skeletons, contextual empty states and inline PDF export error are as specified in Responsive / States. No Phase 1 comparison state exists.

## Chart Specifications

Index 100=national average; 150=50% above. It is not minutes or viewing percentage. Badges use arrow/text plus green/red/neutral. Radar explicitly shows baseline. Channel/show/genre currently append `%` to Index, conflicting with semantics: **Requires product/data clarification**.

Rendered mappings: Linear/primary=`--datavis-qualitative-4` `#7c33b5`; Streaming/secondary=`-3` `#a857e5`; FAST/tertiary=`-1` `#fbbb3b`; additional=`-2` `#ef8736`; line=`-5` `#ee4980`; neutral=`-7` `#e1e1e8`; positive `#115639`; negative `#da294b`; grid `#e1e1e8`; axis `#4b4b59`. Heat ramp: `#f6ebff`, `#e5c9f7`, `#cfa0ee`, `#b06fe0`, `#8a3fc9`, `#661f9e`. Grouped bars/show trend use qualitative-3 for minutes and qualitative-1 for percentage/households. Sankey uses primary, line pink and additional orange.

Tooltips are dark Fiber surfaces, portalled, max 320px/viewport-16px, 8px gap/edge, flip below, reposition on resize/ancestor scroll, and do not capture pointer.

## Drilldowns

Show bar/dropdown → in-card four-week dual-line detail; inherited state as above; All shows or view toggle returns. Radar parameter → in-card top-five detail; another parameter replaces it. Donut and genre are cross-filters, not drilldowns. No channel, heatmap, list-row or Sankey drilldown.

## Cross-KPI Interactions

Type syncs three platform tabs, scopes shows, shifts affinity, and constrains migration (Move to streaming app always targets Streaming). Genre constrains Shows and Behaviour. Affinity selection updates only its detail. Global/environment changes reset cross-filter selections. Channel/heatmap/Sankey hover never filters another card.

## Data Requirements

Known dimensions/metrics are exactly those in the KPI sections. Production source, refresh, identity, household weighting/deduplication, privacy thresholds, aggregation, denominators, taxonomy, aliases, classifications, benchmark, date/week/timezone/daypart logic, rounding/suppression, affinity and migration methodology all **Requires product/data clarification**. Synthetic `seeded/entityModel` logic is not a production specification.

| KPI | Known granularity/time/dependency | Confirmation required |
|---|---|---|
| Overview | one value per applied audience, date range and environment | metric aggregation, denominator and feed |
| Type | media type per applied audience/date/environment | minute aggregation and household estimate |
| Channel/App | channel/app within market and platform; top up to ten by minutes | inventory, aliases, share denominator and benchmark |
| Shows | show within platform/type/environment/genre; top ten by Index | show identity, `hhPct` meaning, share/reach denominator and benchmark |
| Genres | one row per rendered IAB genre within platform/type/environment | taxonomy governance, aggregation and share denominator |
| Show detail | selected show × Week 1–4 with inherited context | relationship between four weeks and global date range |
| Temporal | day × daypart within platform/channel/lookback | timezone, daypart boundaries and DoY/WoW definitions |
| Affinity | audience × parameter; selected parameter × top five shows | mapping, viewers, ranking, Index benchmark and feed |
| Behaviour | source show × behaviour × destination within one hour | cohort, attribution window, denominator, aggregation and migration rules |

## Design System Requirements

Use DM Sans, Fiber typography/spacing/surface/border/shadow/control tokens, MetricsTile, 4px SmartCards with 16px padding, searchable dropdowns, buttons, switch, rounded/underline tabs, chip, Info Alert, skeleton and empty state. Every chart is **Custom visualisation using Fiber design tokens**. Support dark tokens, keyboard selection, accessible names, non-colour cues, truncation and scrolling. No arbitrary chart palette.

## Responsive / States

Overview 2/3/6 columns; media card stacks then 20/80 at `lg`; Trends rows stack then align at `md`; affinity/behaviour stack then 3/7 at `lg`. Dropdown list max-height 220px. Exact framework breakpoints and production category virtualization: **Engineering decision required**.

Applied/global environment changes show tile loading and chart skeletons (~550ms prototype). Empty state uses illustration and contextual copy; Italy+Heavy is prototype-reachable. Export errors appear explicitly. Production API retry/partial errors: **Engineering decision required**.

## Functional Acceptance Criteria

- **Given** staged edits, **when** Apply is pressed, **then** every module updates and cross-filter selections reset.
- **Given** non-default applied filters, **when** Clear is pressed, **then** six filters return to defaults.
- **Given** either environment control, **when** changed, **then** its mirror and all modules update.
- **Given** Overview data, **when** the module renders, **then** all six exact metrics and the four applicable Index indicators use the documented formats and expose no chart interaction.
- **Given** the type donut, **when** an arc is hovered or clicked, or a legend row is hovered, focused or clicked, **then** the documented centre, dimming, tooltip and toggle behaviour appears.
- **Given** a type, **when** selected/cleared, **then** its chip and downstream scope/tabs synchronize or clear as documented.
- **Given** a Channel/App platform tab, **when** it changes, **then** up to ten valid destinations render with independent axes, the documented legend and exact tooltip, with no drilldown.
- **Given** Shows view, **when** platform/type/environment/genre changes, **then** the top-ten show universe, alert and dependent show options update consistently.
- **Given** Shows, **when** a show is selected, **then** four-week dual-axis detail opens; All shows returns.
- **Given** show detail, **when** a weekly point is hovered or focused, **then** both exact values and the dashed guide appear.
- **Given** Genres, **when** a genre is clicked, **then** its selected state toggles and the shared show/behaviour universe updates.
- **Given** Temporal platform changes, **when** a channel becomes invalid, **then** it resets to All.
- **Given** a Temporal cell, **when** hovered or focused, **then** both direct labels, selected outline and exact heat-intensity tooltip are available.
- **Given** a radar parameter, **when** clicked or Enter/Space activated, **then** rank/top-five update.
- **Given** a radar parameter, **when** hovered or focused, **then** its Index, interpretation and national baseline appear exactly as documented.
- **Given** a migration show, **when** selected, **then** source/subtitle/flows update.
- **Given** a Sankey ribbon, **when** hovered, **then** other ribbons dim and the exact path/share/drop/window tooltip appears; no click or keyboard interaction is implied.
- **Given** Export PDF, **when** activated, **then** the applied—not staged—context and rendered dashboard are exported with the documented header, exclusions, pagination and filename, while the button shows its busy state.
- **Given** loading, no-data or export-failure conditions represented by V5, **when** one occurs, **then** the corresponding documented skeleton, contextual empty state or inline error appears.
- **Given** narrow width, **when** a minimum-width chart overflows, **then** its region scrolls without clipping tooltip.
- **Given** Phase 1, **when** used, **then** no Comparison Mode control/state exists.

## Stakeholder Feedback Traceability

| Feedback | V5 solution | KPI / area affected | Status |
|---|---|---|---|
| Shared cards/merged type view | MetricsTile; one 20/80 SmartCard | Overview; Type; Channel/App | Incorporated |
| Addressable wording | All/Addressable rounded tabs | Global environment | Incorporated |
| Unlike metrics need distinct scales | independent dual axes | Channel/App; Shows; Genres; show detail | Incorporated |
| Trends as charts/dynamic dimensions | grouped bars + show/genre switch | Content viewership trends | Incorporated |
| Top-ten/show detail | alert, dependent dropdown, four-week lines | Shows | Incorporated |
| Better Index | arrows/explanation/radar rings | Overview; Channel/App; Trends; Affinity | Incorporated; suffix clarification |
| Dynamic temporal controls | platform-dependent inventory/reset | Temporal Insights | Incorporated |
| Hover/accessibility | portalled tooltips/focus labels | Rendered charts | Incorporated |
| Actionable affinity/Sankey | selected top-five; tokenized flows | Affinity; Behaviour | Incorporated |
| Comparison later | absent | Whole dashboard | Phase 2 |

## Out of Scope / Phase 2

**Comparison Mode is Phase 2**, including comparison controls, series, deltas, legends and tooltips. Also not delivered in rendered V5: the imported/unrendered Top N control and dead chart/list/table components; interaction for the displayed Advanced secondary-navigation label; unrendered drilldowns; and prototype collaboration/version tooling as production product features.

## Implementation Checklist

- **Product:** approve scope/personas/stories/clarifications.
- **Data:** contract every metric/dimension/benchmark/classification/date and relationship.
- **UX/UI:** build wrapper, six cards, controls, detail/state/responsive/theme behaviour.
- **Data visualisation:** exact charts, axes, labels, legends, tooltips, colours and accessibility.
- **Engineering:** staged/applied state, dependencies/resets, cross-KPI chain, PDF, represented errors, responsive/accessibility behaviour and tests; production API, caching and performance architecture is **Engineering decision required**.

## Open Questions / Clarifications

Target roles; feeds/SLAs; every metric denominator; show secondary meaning; Index `%` suffix; non-UK Mosaic; addressable classification; date-vs-week/DoY/WoW; affinity mapping; genre→affinity discrepancy; and migration methodology: **Requires product/data clarification**. Persistence, API retry/partial states, exact breakpoints, browser support and performance limits: **Engineering decision required**.

## Final V5 Cross-Check

- [x] Overview: six tiles.
- [x] Media type: DonutChart + DualAxisBarChart.
- [x] Trends: two ComboChart variants + ShowTrendChart.
- [x] TemporalHeatmap.
- [x] RadarChart + rendered top-five list.
- [x] MigrationSankey.
- [x] Every rendered global/local control, dependency, state, tooltip, wrapper and export.
- [x] Dead components excluded/discrepancies flagged.
- [x] Comparison Mode retained in Phase 2.
# TV Audience & Content Planner — Phase 1 Functional Requirements

**Status:** Production handoff derived from live V5  
**Route:** `/tv-audience-intelligence`  
**Phase boundary:** Phase 1 only. **Comparison Mode remains Phase 2.**

## Executive Summary

V5 is a single-page audience-led dashboard for defining a TV audience, understanding its scale and consumption, discovering platforms/channels/apps and content, inspecting temporal patterns and affinity, and viewing one-hour post-show migration. This specification covers only rendered V5 functionality. Prototype values are deterministic synthetic data, not a production feed. Unknowns use **Requires product/data clarification** or **Engineering decision required**.

## Product Scope

### Purpose, users, goals and use cases

The product supports users who need to: define a market/audience; quantify scale, volume and reach; compare Linear TV, Streaming and FAST; find channels/apps, shows and genres; inspect a show’s four-week trend; find day/daypart concentrations; identify affinity against the national average; inspect post-show behaviour; and export the applied view. V5 does not name personas or permissions: **Requires product/data clarification**.

### Phase 1 Scope

- Standalone Reports wrapper and one dashboard screen.
- Six staged global filters, Apply/Clear, immediate All/Addressable control, PDF export.
- Six Overview metrics.
- Six rendered SmartCards and all rendered visualisations/interactions/states.
- Cross-filtering, dependent controls, show/affinity details, responsive and accessible behaviour.

### User journey

Open Standard Reports → stage audience/date values → Apply → read Overview → select environment/type → inspect channel/app and show/genre performance → open show detail → inspect Temporal Insights → select an affinity parameter → select a migration source → export PDF.

The rendered page heading is **TV Audience & Content Planner**, with subtitle **Cross-platform content and audience consumption insights**.

## Dashboard Architecture

Order: title/subtitle; sticky global filters; **Overview**; All/Addressable; **TV viewership by media type** (Consumption by Type + Time Spent by Channel/App); **Content viewership trends**; mirrored All/Addressable; **Temporal Insights**; responsive **Content affinity** + **TV user behaviour**; notes.

Primary navigation is 64px, Reports active, with Intelligence/Audiences/Creatives/Campaigns displayed; full menu at ≥1024px and collapsed Reports menu below. Theme toggle and JS/Pro avatar are right. Secondary navigation is 56px: Standard active/link; Advanced inert. Header auto-hides/floats after scroll and is revealed by top hover/focus. Canvas max-width is 1440px. Prototype version/comment/annotation overlays are tooling, not product scope.

State hierarchy is staged filters → applied filters → immediate environment → optional consumption scope → module-local state. Applied global/environment changes clear type, genre, affinity, show and migration selections and show skeletons. A type selection synchronizes Channel, Trends and Temporal platform tabs and resets Temporal channel to All.

## Global Filters

All are searchable. Single-select closes after selection; multi-select stays open; search is case-insensitive; no result says “No matches.” Empty multi-selection means inclusive All.

| Filter | Exact options | Default | Behaviour |
|---|---|---|---|
| Country | United Kingdom, Germany, France, Italy, Spain | United Kingdom | All modules after Apply; determines linear inventory/commercial rules |
| Mosaic group | All Mosaic groups; City Prosperity; Prestige Positions; Country Living; Suburban Stability; Rental Hubs; Vintage Value | All Mosaic groups (empty) | All modules after Apply; All clears specifics |
| Age & gender | All genders, Male, Female × 16–24, 25–34, 35–44, 45–54, 55–64, 65+ (18) | All ages & genders (empty) | All modules after Apply |
| TV consumption | All viewers, Heavy TV, Medium TV, Light TV | All viewers | All modules after Apply |
| Children | All households; No children; Children 0–4; Children 5–11; Children 12–17 | All households (empty) | All modules after Apply; All clears specifics |
| Date range | Last 7 days; Last 15 days; Last 30 days; Last 60 days | Last 30 days | All modules after Apply |

Mosaic is rendered in all countries despite being described in code as UK-granular: **Requires product/data clarification**.

Edits are staged until Apply. Initially Apply is disabled. Pending edits enable Apply and do not affect KPIs/PDF. After non-default values are applied, the action becomes Clear all filters; Clear restores six defaults, but not environment/local tabs.

**All / Addressable channels** defaults All, updates immediately, appears twice with one synchronized state, and affects every module. Addressable excludes/reweights market-specific non-commercial inventory. Production classification: **Requires product/data clarification**.

**Export PDF** is immediate and always uses the applied filter/environment state, not un-applied draft values. While exporting, the outline button reads “Exporting…” and is disabled. The export is a paginated portrait A4 capture of the dashboard; the sticky filter bar and prototype overlays are omitted and replaced by a header containing the title, all six applied filter values, viewing environment, export date/time and the synthetic-data notice. The filename is `tv-audience-content-planner-{lowercase market code}-{YYYY-MM-DD}.pdf`. A failure is announced inline as `Export failed: {message}` or “Export failed — please try again.”

## Local Filters

| Module | Control; exact options | Default/dependency/effect |
|---|---|---|
| Type | clickable Linear TV, Streaming, FAST donut/legend | None; click again/removable chip clears; scopes downstream |
| Channel/App | Linear TV, Streaming, Fast tabs | Linear TV; synced by type; changes market inventory |
| Trends | View by show/genre switch | Shows; switching clears show |
| Trends | Linear TV, Streaming, Fast | Linear; synced by type; filters shows/reweights genres |
| Shows | All shows + unique valid shows | All; options depend on platform/type/environment/genre; selection opens detail |
| Genres | 12 rendered genre marks | None; selection toggles and restricts shared show universe |
| Temporal | platform tabs; All channels/apps + valid inventory; 7-day (DoY), 15-day (DoY), 30-day (WoW), 60-day (WoW) | Linear; All; 30-day WoW. Platform rebuilds channels; invalid channel resets All |
| Affinity | FOOD, TRAVEL, COMEDY, DOCUMENTARY, NEWS, MUSIC, LIFESTYLE, SPORTS | current highest Index; updates rank/top-five |
| Behaviour | All shows + valid scoped shows | All resolves to top-indexing show |

The data module’s `TOP_N` options and the `GenreBars`, `ShowsTable`, and `AffinityList` components exist but are not rendered; they are not delivered features. `LOOKBACK` is rendered only as the Temporal Insights lookback control.

## Filter Interaction Matrix

| Filter | Overview | Type | Channel | Trends | Temporal | Affinity | Behaviour |
|---|---:|---:|---:|---:|---:|---:|---:|
| Six applied global filters | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| All/Addressable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Type selection | — | selected | sync | sync/scope | sync | scope | scope |
| Genre selection | — | — | — | show universe | — | —* | shared show universe |
| Module-local controls | — | — | local | local | local | local detail | local |

\* Comments claim genre anchors affinity, but live affinity calculation ignores `selectedGenre`: **Requires product/data clarification**.

## KPI Requirements

### Overview

**User story:** As a dashboard user, I want a concise audience summary so that I can understand its scale and activity before exploring detail. **Business question:** how large and active is the audience?

Six Fiber MetricsTiles: **Total households** (K/M); **Total minutes viewed** (K/M); **Avg. weekly TV consumption – Streaming** (`mins`, Index); **Avg linear TV consumption** (`min/wk`, Index); **Avg. channels/apps per hh** (one decimal, Index); **Weekly TV reach** (`% of hh`, Index). Dimension: applied audience and viewing environment. No click, chart legend or tooltip. Source/calculations: **Requires product/data clarification**.

### Consumption by Type

**User story:** As a dashboard user, I want the viewing mix by media type so that I can choose the environment to investigate downstream. **Business question:** what share of minutes is Linear TV, Streaming or FAST?

Metric: share of viewing minutes, with estimated minutes per household as support. Dimension: media type. Visualisation: 200px donut (r78, stroke30), proportional share %. The clickable legend maps Linear TV to qualitative-4 purple, Streaming to qualitative-3 purple and FAST to qualitative-1 yellow, and shows each type’s one-decimal share. Centre defaults “Share of viewing”; hover or selection shows rounded share/name. Hover thickens the active arc by 4px and dims others to 35%. Arc tooltip: type; `Legend: Share of viewing`; share to one decimal; estimated integer minutes/hh. Legend tooltip omits the `Legend` line and otherwise shows the same metrics. Clicking an arc or legend row toggles the downstream type scope; the removable card chip is an equivalent clear action.

### Time Spent by Channel/App

**User story:** As a dashboard user, I want channel/app consumption ranked within a platform so that I can identify important destinations. **Business question:** which destinations matter?

Metrics: average minutes/week, share of watch time and Index. Dimension: channel/app within the selected Linear TV, Streaming or Fast tab. Up to ten destinations are shown, sorted by minutes, as grouped vertical bars. X=channel/app, >12 chars truncates to 11+ellipsis, supporting `Index N%`. Left Y=Avg min/week, five dynamic integer ticks; right Y=% of watch time, five percent ticks. The two-item legend maps minutes to qualitative-3 purple and percentage to qualitative-1 yellow. Tooltip is exactly: channel/app; `Index: N%`; `Highlight: {Index interpretation}`; `Avg min/week: {integer}`; `% of watch time: {one decimal}%`. Hover/focus dims other categories and applies a category wash. Minimum width 680px with horizontal scroll. No drilldown.

### Content Viewership Trends — Shows

**User story:** As a dashboard user, I want the highest-indexing shows for my audience so that I can inspect a relevant title. **Business question:** which ten shows index highest?

Metrics: average minutes/household, rendered `% of total watch time`, and Index supporting text. Dimension: show, constrained by platform/type/environment/genre. Grouped bars are sorted by Index. X=show + supporting `Index N%`; left Y=Avg min/HH; right Y=`% of total watch time`; independent five-tick scales. The legend maps average minutes/household to qualitative-3 purple and `% of total watch time` to qualitative-1 yellow; no line or Index legend is rendered. Tooltip is exactly: show; `Index: N%`; `Avg min / household: {integer} min`; `% of total watch time: {one decimal}%`. It does **not** include an Index interpretation. Click/category or dependent dropdown opens detail. Alert states top 10/platform. Empty title is “No shows match”; message is “No shows match these filters — change the genre filter or viewing scope.” Data property is `hhPct`/commented household reach but UI says watch time: **Requires product/data clarification**.

### Content Viewership Trends — Genres

**User story:** As a dashboard user, I want genre consumption and Index indicators so that I can constrain the show universe. **Business question:** which IAB genres matter?

Metrics: average minutes/week, share of watch time and Index supporting text. Dimension options: Comedy, News, Film, Sports, Drama, Reality, Action, Documentary, Kids, Travel, Food, Home improvement. The same grouped-bar encoding uses left Y=Avg min/week and right Y=Watch time (%), with independent five-tick scales. The legend maps average minutes/week to qualitative-3 purple and share of watch time to qualitative-1 yellow. X labels show genre plus `Index N%`. Tooltip is exactly: genre; `Index: N%`; `Avg minutes / week: {integer} min`; `Share of watch time: {one decimal}%`; it does not include Index interpretation. Click toggles genre selection and the selected category is exposed as pressed. No direct affinity update occurs in live code.

### Selected Show Consumption Over Time

**User story:** As a dashboard user, I want a selected show’s recent consumption trend so that I can understand its weekly movement. **Business question:** how did audience consumption and households watching change across four weeks?

Four-week dual-line detail. X=Week 1–4; left Y=Avg mins/hh; right Y=Households formatted M; five ticks, maxima 115% of data. Legend: Households watching=qualitative-1 yellow; Avg. minutes watched per household=qualitative-3 purple. Hover/focus shows a dashed vertical guide and tooltip: week; `Households watching: {integer}`; `Avg. minutes / household: {integer}`. Inherits all filters, environment, type, genre and Trends platform. All shows returns; another show switches detail. Relation to Date range: **Requires product/data clarification**.

### Temporal Insights

**User story:** As a dashboard user, I want audience concentration by day and daypart so that I can identify strong viewing windows. **Business question:** when does this audience watch?

Metrics: average minutes watched per household and percentage of households watching. Dimensions: day of week × daypart. The 7×6 heatmap has rows Mon–Sun and columns Early AM, Morning, Daytime, Afternoon, Primetime, Late Night. Each cell directly shows `{minutes}m` and household percentage to one decimal. Tooltip is exactly: `{day} · {daypart}`; `Avg minutes/hh: {minutes}m`; `% households: {one decimal}%`; `Heat intensity: N of 6 (low → high minutes)`. Six-step brand ramp encodes minutes; legend is `Low` → six swatches → `High` · `avg mins watched per household`. Hover/focus adds a selected outline; there is no click. Minimum width 720px with horizontal scroll. DoY/WoW definition: **Requires product/data clarification**.

### Content Affinity

**User story:** As a dashboard user, I want affinity against the national average so that I can identify the audience’s strongest content/lifestyle parameter and related shows. **Business question:** where does this audience over- or under-index, and which shows are associated with the selected parameter?

Metric: Index; detail metrics are viewers and show Index. Dimensions: eight fixed parameters and their mapped shows. Eight-axis radar, Index 0–200, numeric rings 50/100/150/200, dashed national baseline 100, unfilled qualitative-4 primary polygon. Tooltip is exactly: parameter; `Index: N`; `Highlight: {Index interpretation}`; `Baseline: National average = 100`. Pointer and Enter/Space select; selected label is bold/underlined and vertex enlarged. Default is highest Index. Supporting text states “Dashed ring = national average (100). Select a parameter to view its details.” Live detail says `{PARAMETER} — top 5 shows`, `Selected parameter · rank N of 8`, then viewer-ranked rows with list rank, compact viewers and `{index} idx`; rows are not clickable. Taxonomy/mapping/ranking/feed: **Requires product/data clarification**.

### TV User Behaviour

**User story:** As a dashboard user, I want to see post-show migration so that I can understand the audience’s next behaviour and destination. **Business question:** where do source-show viewers go within one hour?

Metric: flow share; supporting calculation displayed as drop from source. Dimensions: source show/network → behaviour → destination show/network or Other/stopped. Custom Sankey uses the top three behaviours from Stay on same channel/Switch channel/Move to streaming app/Stop watching; targets are the two strongest show · network destinations plus Other / stopped watching. “From” and “To” label the columns. Ribbon width=flow share; hover raises the ribbon opacity and dims others. Tooltip is exactly: `{behaviour} → {destination}`; `Flow share: {one decimal}%`; `Drop from source: {100 − flow share, one decimal}%`; `Window: Within 1 hour`. Show filter changes source/subtitle/flows; paths have hover but no keyboard focus, click or drilldown. Minimum 560px with horizontal scroll. A screen-reader-only list exposes every flow, and visible supporting copy identifies the source show/network and width meaning. Cohort, denominator and migration rules: **Requires product/data clarification**.

## KPI Visualisation Matrix

| KPI | User question | Primary metric | Secondary metric | Dimension | Chart | Filters | Drilldown |
|---|---|---|---|---|---|---|---|
| Overview | How large/active is the audience? | six summary metrics | four indices | audience | tiles | global, environment | No |
| Type | What is the viewing mix? | share % | estimated minutes/hh | TV type | donut | global, environment | cross-filter |
| Channel | Which destinations matter? | avg min/week | share, Index | channel/app | dual-axis bars | global, environment, type/tab | No |
| Shows | Which shows index highest? | avg min/hh | rendered share, Index | show | grouped bars | global, environment, type, platform, genre | show detail |
| Genres | Which genres matter? | avg min/week | share, Index | genre | grouped bars | global, environment, type, platform | cross-filter |
| Show detail | How does the show move weekly? | avg min/hh | households | week | dual-axis lines | inherited Shows filters | in-card detail |
| Temporal | When does the audience watch? | avg min/hh | % households | day×daypart | heatmap | global, environment, type/platform, channel/app, lookback | No |
| Affinity | Where does the audience index? | Index | viewers/show Index | parameter/show | radar+list | global, environment, type | in-card parameter detail |
| Behaviour | Where do viewers go next? | flow share | drop from source | migration path | Sankey | global, environment, type, genre, show | No |

## Chart Variations and States

- **Default:** UK/all-audience/last-30-days, All environment, no consumption type or genre selected; Linear TV tabs, Shows view, Temporal All channels/apps and 30-day (WoW); affinity detail resolves to the highest-index parameter; behaviour resolves All shows to the current top-indexing show.
- **Applied-filter/environment state:** all module data re-derives and loading skeletons precede the updated values; cross-filter/detail selections reset. Draft global edits do not alter charts.
- **Type-filtered state:** donut selection remains highlighted and a removable filter chip appears; Channel, Trends and Temporal tabs synchronize to that type, while Shows, genres, affinity and behaviour re-derive within scope. Clearing the type removes the scope but leaves platform tabs where the user last left them.
- **Alternative Trends dimension:** Shows displays the top-ten grouped chart and show dropdown; Genres displays all 12 genre groups and removes the show dropdown/alert. Toggling the switch clears show detail.
- **Show-detail state:** selecting a show replaces the grouped show chart with its four-week dual-line detail and dependent show selector.
- **Temporal alternatives:** platform changes rebuild the channel/app options; channel/app and lookback changes re-derive heatmap cells.
- **Affinity detail state:** selecting a radar parameter replaces the parameter/rank and top-five detail in place.
- **Behaviour source state:** selecting a show changes the subtitle, source copy and Sankey flows.
- **Loading/empty/error:** module skeletons, contextual empty states and inline PDF export error are as specified in Responsive / States. No Phase 1 comparison state exists.

## Chart Specifications

Index 100=national average; 150=50% above. It is not minutes or viewing percentage. Badges use arrow/text plus green/red/neutral. Radar explicitly shows baseline. Channel/show/genre currently append `%` to Index, conflicting with semantics: **Requires product/data clarification**.

Rendered mappings: Linear/primary=`--datavis-qualitative-4` `#7c33b5`; Streaming/secondary=`-3` `#a857e5`; FAST/tertiary=`-1` `#fbbb3b`; additional=`-2` `#ef8736`; line=`-5` `#ee4980`; neutral=`-7` `#e1e1e8`; positive `#115639`; negative `#da294b`; grid `#e1e1e8`; axis `#4b4b59`. Heat ramp: `#f6ebff`, `#e5c9f7`, `#cfa0ee`, `#b06fe0`, `#8a3fc9`, `#661f9e`. Grouped bars/show trend use qualitative-3 for minutes and qualitative-1 for percentage/households. Sankey uses primary, line pink and additional orange.

Tooltips are dark Fiber surfaces, portalled, max 320px/viewport-16px, 8px gap/edge, flip below, reposition on resize/ancestor scroll, and do not capture pointer.

## Drilldowns

Show bar/dropdown → in-card four-week dual-line detail; inherited state as above; All shows or view toggle returns. Radar parameter → in-card top-five detail; another parameter replaces it. Donut and genre are cross-filters, not drilldowns. No channel, heatmap, list-row or Sankey drilldown.

## Cross-KPI Interactions

Type syncs three platform tabs, scopes shows, shifts affinity, and constrains migration (Move to streaming app always targets Streaming). Genre constrains Shows and Behaviour. Affinity selection updates only its detail. Global/environment changes reset cross-filter selections. Channel/heatmap/Sankey hover never filters another card.

## Data Requirements

Known dimensions/metrics are exactly those in the KPI sections. Production source, refresh, identity, household weighting/deduplication, privacy thresholds, aggregation, denominators, taxonomy, aliases, classifications, benchmark, date/week/timezone/daypart logic, rounding/suppression, affinity and migration methodology all **Requires product/data clarification**. Synthetic `seeded/entityModel` logic is not a production specification.

| KPI | Known granularity/time/dependency | Confirmation required |
|---|---|---|
| Overview | one value per applied audience, date range and environment | metric aggregation, denominator and feed |
| Type | media type per applied audience/date/environment | minute aggregation and household estimate |
| Channel/App | channel/app within market and platform; top up to ten by minutes | inventory, aliases, share denominator and benchmark |
| Shows | show within platform/type/environment/genre; top ten by Index | show identity, `hhPct` meaning, share/reach denominator and benchmark |
| Genres | one row per rendered IAB genre within platform/type/environment | taxonomy governance, aggregation and share denominator |
| Show detail | selected show × Week 1–4 with inherited context | relationship between four weeks and global date range |
| Temporal | day × daypart within platform/channel/lookback | timezone, daypart boundaries and DoY/WoW definitions |
| Affinity | audience × parameter; selected parameter × top five shows | mapping, viewers, ranking, Index benchmark and feed |
| Behaviour | source show × behaviour × destination within one hour | cohort, attribution window, denominator, aggregation and migration rules |

## Design System Requirements

Use DM Sans, Fiber typography/spacing/surface/border/shadow/control tokens, MetricsTile, 4px SmartCards with 16px padding, searchable dropdowns, buttons, switch, rounded/underline tabs, chip, Info Alert, skeleton and empty state. Every chart is **Custom visualisation using Fiber design tokens**. Support dark tokens, keyboard selection, accessible names, non-colour cues, truncation and scrolling. No arbitrary chart palette.

## Responsive / States

Overview 2/3/6 columns; media card stacks then 20/80 at `lg`; Trends rows stack then align at `md`; affinity/behaviour stack then 3/7 at `lg`. Dropdown list max-height 220px. Exact framework breakpoints and production category virtualization: **Engineering decision required**.

Applied/global environment changes show tile loading and chart skeletons (~550ms prototype). Empty state uses illustration and contextual copy; Italy+Heavy is prototype-reachable. Export errors appear explicitly. Production API retry/partial errors: **Engineering decision required**.

## Functional Acceptance Criteria

- **Given** staged edits, **when** Apply is pressed, **then** every module updates and cross-filter selections reset.
- **Given** non-default applied filters, **when** Clear is pressed, **then** six filters return to defaults.
- **Given** either environment control, **when** changed, **then** its mirror and all modules update.
- **Given** Overview data, **when** the module renders, **then** all six exact metrics and the four applicable Index indicators use the documented formats and expose no chart interaction.
- **Given** the type donut, **when** an arc is hovered or clicked, or a legend row is hovered, focused or clicked, **then** the documented centre, dimming, tooltip and toggle behaviour appears.
- **Given** a type, **when** selected/cleared, **then** its chip and downstream scope/tabs synchronize or clear as documented.
- **Given** a Channel/App platform tab, **when** it changes, **then** up to ten valid destinations render with independent axes, the documented legend and exact tooltip, with no drilldown.
- **Given** Shows view, **when** platform/type/environment/genre changes, **then** the top-ten show universe, alert and dependent show options update consistently.
- **Given** Shows, **when** a show is selected, **then** four-week dual-axis detail opens; All shows returns.
- **Given** show detail, **when** a weekly point is hovered or focused, **then** both exact values and the dashed guide appear.
- **Given** Genres, **when** a genre is clicked, **then** its selected state toggles and the shared show/behaviour universe updates.
- **Given** Temporal platform changes, **when** a channel becomes invalid, **then** it resets to All.
- **Given** a Temporal cell, **when** hovered or focused, **then** both direct labels, selected outline and exact heat-intensity tooltip are available.
- **Given** a radar parameter, **when** clicked or Enter/Space activated, **then** rank/top-five update.
- **Given** a radar parameter, **when** hovered or focused, **then** its Index, interpretation and national baseline appear exactly as documented.
- **Given** a migration show, **when** selected, **then** source/subtitle/flows update.
- **Given** a Sankey ribbon, **when** hovered, **then** other ribbons dim and the exact path/share/drop/window tooltip appears; no click or keyboard interaction is implied.
- **Given** Export PDF, **when** activated, **then** the applied—not staged—context and rendered dashboard are exported with the documented header, exclusions, pagination and filename, while the button shows its busy state.
- **Given** loading, no-data or export-failure conditions represented by V5, **when** one occurs, **then** the corresponding documented skeleton, contextual empty state or inline error appears.
- **Given** narrow width, **when** a minimum-width chart overflows, **then** its region scrolls without clipping tooltip.
- **Given** Phase 1, **when** used, **then** no Comparison Mode control/state exists.

## Stakeholder Feedback Traceability

| Feedback | V5 solution | KPI / area affected | Status |
|---|---|---|---|
| Shared cards/merged type view | MetricsTile; one 20/80 SmartCard | Overview; Type; Channel/App | Incorporated |
| Addressable wording | All/Addressable rounded tabs | Global environment | Incorporated |
| Unlike metrics need distinct scales | independent dual axes | Channel/App; Shows; Genres; show detail | Incorporated |
| Trends as charts/dynamic dimensions | grouped bars + show/genre switch | Content viewership trends | Incorporated |
| Top-ten/show detail | alert, dependent dropdown, four-week lines | Shows | Incorporated |
| Better Index | arrows/explanation/radar rings | Overview; Channel/App; Trends; Affinity | Incorporated; suffix clarification |
| Dynamic temporal controls | platform-dependent inventory/reset | Temporal Insights | Incorporated |
| Hover/accessibility | portalled tooltips/focus labels | Rendered charts | Incorporated |
| Actionable affinity/Sankey | selected top-five; tokenized flows | Affinity; Behaviour | Incorporated |
| Comparison later | absent | Whole dashboard | Phase 2 |

## Out of Scope / Phase 2

**Comparison Mode is Phase 2**, including comparison controls, series, deltas, legends and tooltips. Also not delivered in rendered V5: the imported/unrendered Top N control and dead chart/list/table components; interaction for the displayed Advanced secondary-navigation label; unrendered drilldowns; and prototype collaboration/version tooling as production product features.

## Implementation Checklist

- **Product:** approve scope/personas/stories/clarifications.
- **Data:** contract every metric/dimension/benchmark/classification/date and relationship.
- **UX/UI:** build wrapper, six cards, controls, detail/state/responsive/theme behaviour.
- **Data visualisation:** exact charts, axes, labels, legends, tooltips, colours and accessibility.
- **Engineering:** staged/applied state, dependencies/resets, cross-KPI chain, PDF, represented errors, responsive/accessibility behaviour and tests; production API, caching and performance architecture is **Engineering decision required**.

## Open Questions / Clarifications

Target roles; feeds/SLAs; every metric denominator; show secondary meaning; Index `%` suffix; non-UK Mosaic; addressable classification; date-vs-week/DoY/WoW; affinity mapping; genre→affinity discrepancy; and migration methodology: **Requires product/data clarification**. Persistence, API retry/partial states, exact breakpoints, browser support and performance limits: **Engineering decision required**.

## Final V5 Cross-Check

- [x] Overview: six tiles.
- [x] Media type: DonutChart + DualAxisBarChart.
- [x] Trends: two ComboChart variants + ShowTrendChart.
- [x] TemporalHeatmap.
- [x] RadarChart + rendered top-five list.
- [x] MigrationSankey.
- [x] Every rendered global/local control, dependency, state, tooltip, wrapper and export.
- [x] Dead components excluded/discrepancies flagged.
- [x] Comparison Mode retained in Phase 2.
# TV Audience & Content Planner — Phase 1 Functional Requirements

**Status:** Production handoff derived from live V5  
**Route:** `/tv-audience-intelligence`  
**Phase boundary:** Phase 1 only. **Comparison Mode remains Phase 2.**

## Executive Summary

V5 is a single-page audience-led dashboard for defining a TV audience, understanding its scale and consumption, discovering platforms/channels/apps and content, inspecting temporal patterns and affinity, and viewing one-hour post-show migration. This specification covers only rendered V5 functionality. Prototype values are deterministic synthetic data, not a production feed. Unknowns use **Requires product/data clarification** or **Engineering decision required**.

## Product Scope

### Purpose, users, goals and use cases

The product supports users who need to: define a market/audience; quantify scale, volume and reach; compare Linear TV, Streaming and FAST; find channels/apps, shows and genres; inspect a show’s four-week trend; find day/daypart concentrations; identify affinity against the national average; inspect post-show behaviour; and export the applied view. V5 does not name personas or permissions: **Requires product/data clarification**.

### Phase 1 Scope

- Standalone Reports wrapper and one dashboard screen.
- Six staged global filters, Apply/Clear, immediate All/Addressable control, PDF export.
- Six Overview metrics.
- Six rendered SmartCards and all rendered visualisations/interactions/states.
- Cross-filtering, dependent controls, show/affinity details, responsive and accessible behaviour.

### User journey

Open Standard Reports → stage audience/date values → Apply → read Overview → select environment/type → inspect channel/app and show/genre performance → open show detail → inspect Temporal Insights → select an affinity parameter → select a migration source → export PDF.

The rendered page heading is **TV Audience & Content Planner**, with subtitle **Cross-platform content and audience consumption insights**.

## Dashboard Architecture

Order: title/subtitle; sticky global filters; **Overview**; All/Addressable; **TV viewership by media type** (Consumption by Type + Time Spent by Channel/App); **Content viewership trends**; mirrored All/Addressable; **Temporal Insights**; responsive **Content affinity** + **TV user behaviour**; notes.

Primary navigation is 64px, Reports active, with Intelligence/Audiences/Creatives/Campaigns displayed; full menu at ≥1024px and collapsed Reports menu below. Theme toggle and JS/Pro avatar are right. Secondary navigation is 56px: Standard active/link; Advanced inert. Header auto-hides/floats after scroll and is revealed by top hover/focus. Canvas max-width is 1440px. Prototype version/comment/annotation overlays are tooling, not product scope.

State hierarchy is staged filters → applied filters → immediate environment → optional consumption scope → module-local state. Applied global/environment changes clear type, genre, affinity, show and migration selections and show skeletons. A type selection synchronizes Channel, Trends and Temporal platform tabs and resets Temporal channel to All.

## Global Filters

All are searchable. Single-select closes after selection; multi-select stays open; search is case-insensitive; no result says “No matches.” Empty multi-selection means inclusive All.

| Filter | Exact options | Default | Behaviour |
|---|---|---|---|
| Country | United Kingdom, Germany, France, Italy, Spain | United Kingdom | All modules after Apply; determines linear inventory/commercial rules |
| Mosaic group | All Mosaic groups; City Prosperity; Prestige Positions; Country Living; Suburban Stability; Rental Hubs; Vintage Value | All Mosaic groups (empty) | All modules after Apply; All clears specifics |
| Age & gender | All genders, Male, Female × 16–24, 25–34, 35–44, 45–54, 55–64, 65+ (18) | All ages & genders (empty) | All modules after Apply |
| TV consumption | All viewers, Heavy TV, Medium TV, Light TV | All viewers | All modules after Apply |
| Children | All households; No children; Children 0–4; Children 5–11; Children 12–17 | All households (empty) | All modules after Apply; All clears specifics |
| Date range | Last 7 days; Last 15 days; Last 30 days; Last 60 days | Last 30 days | All modules after Apply |

Mosaic is rendered in all countries despite being described in code as UK-granular: **Requires product/data clarification**.

Edits are staged until Apply. Initially Apply is disabled. Pending edits enable Apply and do not affect KPIs/PDF. After non-default values are applied, the action becomes Clear all filters; Clear restores six defaults, but not environment/local tabs.

**All / Addressable channels** defaults All, updates immediately, appears twice with one synchronized state, and affects every module. Addressable excludes/reweights market-specific non-commercial inventory. Production classification: **Requires product/data clarification**.

**Export PDF** is immediate and always uses the applied filter/environment state, not un-applied draft values. While exporting, the outline button reads “Exporting…” and is disabled. The export is a paginated portrait A4 capture of the dashboard; the sticky filter bar and prototype overlays are omitted and replaced by a header containing the title, all six applied filter values, viewing environment, export date/time and the synthetic-data notice. The filename is `tv-audience-content-planner-{lowercase market code}-{YYYY-MM-DD}.pdf`. A failure is announced inline as `Export failed: {message}` or “Export failed — please try again.”

## Local Filters

| Module | Control; exact options | Default/dependency/effect |
|---|---|---|
| Type | clickable Linear TV, Streaming, FAST donut/legend | None; click again/removable chip clears; scopes downstream |
| Channel/App | Linear TV, Streaming, Fast tabs | Linear TV; synced by type; changes market inventory |
| Trends | View by show/genre switch | Shows; switching clears show |
| Trends | Linear TV, Streaming, Fast | Linear; synced by type; filters shows/reweights genres |
| Shows | All shows + unique valid shows | All; options depend on platform/type/environment/genre; selection opens detail |
| Genres | 12 rendered genre marks | None; selection toggles and restricts shared show universe |
| Temporal | platform tabs; All channels/apps + valid inventory; 7-day (DoY), 15-day (DoY), 30-day (WoW), 60-day (WoW) | Linear; All; 30-day WoW. Platform rebuilds channels; invalid channel resets All |
| Affinity | FOOD, TRAVEL, COMEDY, DOCUMENTARY, NEWS, MUSIC, LIFESTYLE, SPORTS | current highest Index; updates rank/top-five |
| Behaviour | All shows + valid scoped shows | All resolves to top-indexing show |

The data module’s `TOP_N` options and the `GenreBars`, `ShowsTable`, and `AffinityList` components exist but are not rendered; they are not delivered features. `LOOKBACK` is rendered only as the Temporal Insights lookback control.

## Filter Interaction Matrix

| Filter | Overview | Type | Channel | Trends | Temporal | Affinity | Behaviour |
|---|---:|---:|---:|---:|---:|---:|---:|
| Six applied global filters | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| All/Addressable | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Type selection | — | selected | sync | sync/scope | sync | scope | scope |
| Genre selection | — | — | — | show universe | — | —* | shared show universe |
| Module-local controls | — | — | local | local | local | local detail | local |

\* Comments claim genre anchors affinity, but live affinity calculation ignores `selectedGenre`: **Requires product/data clarification**.

## KPI Requirements

### Overview

**User story:** As a dashboard user, I want a concise audience summary so that I can understand its scale and activity before exploring detail. **Business question:** how large and active is the audience?

Six Fiber MetricsTiles: **Total households** (K/M); **Total minutes viewed** (K/M); **Avg. weekly TV consumption – Streaming** (`mins`, Index); **Avg linear TV consumption** (`min/wk`, Index); **Avg. channels/apps per hh** (one decimal, Index); **Weekly TV reach** (`% of hh`, Index). Dimension: applied audience and viewing environment. No click, chart legend or tooltip. Source/calculations: **Requires product/data clarification**.

### Consumption by Type

**User story:** As a dashboard user, I want the viewing mix by media type so that I can choose the environment to investigate downstream. **Business question:** what share of minutes is Linear TV, Streaming or FAST?

Metric: share of viewing minutes, with estimated minutes per household as support. Dimension: media type. Visualisation: 200px donut (r78, stroke30), proportional share %. The clickable legend maps Linear TV to qualitative-4 purple, Streaming to qualitative-3 purple and FAST to qualitative-1 yellow, and shows each type’s one-decimal share. Centre defaults “Share of viewing”; hover or selection shows rounded share/name. Hover thickens the active arc by 4px and dims others to 35%. Arc tooltip: type; `Legend: Share of viewing`; share to one decimal; estimated integer minutes/hh. Legend tooltip omits the `Legend` line and otherwise shows the same metrics. Clicking an arc or legend row toggles the downstream type scope; the removable card chip is an equivalent clear action.

### Time Spent by Channel/App

**User story:** As a dashboard user, I want channel/app consumption ranked within a platform so that I can identify important destinations. **Business question:** which destinations matter?

Metrics: average minutes/week, share of watch time and Index. Dimension: channel/app within the selected Linear TV, Streaming or Fast tab. Up to ten destinations are shown, sorted by minutes, as grouped vertical bars. X=channel/app, >12 chars truncates to 11+ellipsis, supporting `Index N%`. Left Y=Avg min/week, five dynamic integer ticks; right Y=% of watch time, five percent ticks. The two-item legend maps minutes to qualitative-3 purple and percentage to qualitative-1 yellow. Tooltip is exactly: channel/app; `Index: N%`; `Highlight: {Index interpretation}`; `Avg min/week: {integer}`; `% of watch time: {one decimal}%`. Hover/focus dims other categories and applies a category wash. Minimum width 680px with horizontal scroll. No drilldown.

### Content Viewership Trends — Shows

**User story:** As a dashboard user, I want the highest-indexing shows for my audience so that I can inspect a relevant title. **Business question:** which ten shows index highest?

Metrics: average minutes/household, rendered `% of total watch time`, and Index supporting text. Dimension: show, constrained by platform/type/environment/genre. Grouped bars are sorted by Index. X=show + supporting `Index N%`; left Y=Avg min/HH; right Y=`% of total watch time`; independent five-tick scales. The legend maps average minutes/household to qualitative-3 purple and `% of total watch time` to qualitative-1 yellow; no line or Index legend is rendered. Tooltip is exactly: show; `Index: N%`; `Avg min / household: {integer} min`; `% of total watch time: {one decimal}%`. It does **not** include an Index interpretation. Click/category or dependent dropdown opens detail. Alert states top 10/platform. Empty title is “No shows match”; message is “No shows match these filters — change the genre filter or viewing scope.” Data property is `hhPct`/commented household reach but UI says watch time: **Requires product/data clarification**.

### Content Viewership Trends — Genres

**User story:** As a dashboard user, I want genre consumption and Index indicators so that I can constrain the show universe. **Business question:** which IAB genres matter?

Metrics: average minutes/week, share of watch time and Index supporting text. Dimension options: Comedy, News, Film, Sports, Drama, Reality, Action, Documentary, Kids, Travel, Food, Home improvement. The same grouped-bar encoding uses left Y=Avg min/week and right Y=Watch time (%), with independent five-tick scales. The legend maps average minutes/week to qualitative-3 purple and share of watch time to qualitative-1 yellow. X labels show genre plus `Index N%`. Tooltip is exactly: genre; `Index: N%`; `Avg minutes / week: {integer} min`; `Share of watch time: {one decimal}%`; it does not include Index interpretation. Click toggles genre selection and the selected category is exposed as pressed. No direct affinity update occurs in live code.

### Selected Show Consumption Over Time

**User story:** As a dashboard user, I want a selected show’s recent consumption trend so that I can understand its weekly movement. **Business question:** how did audience consumption and households watching change across four weeks?

Four-week dual-line detail. X=Week 1–4; left Y=Avg mins/hh; right Y=Households formatted M; five ticks, maxima 115% of data. Legend: Households watching=qualitative-1 yellow; Avg. minutes watched per household=qualitative-3 purple. Hover/focus shows a dashed vertical guide and tooltip: week; `Households watching: {integer}`; `Avg. minutes / household: {integer}`. Inherits all filters, environment, type, genre and Trends platform. All shows returns; another show switches detail. Relation to Date range: **Requires product/data clarification**.

### Temporal Insights

**User story:** As a dashboard user, I want audience concentration by day and daypart so that I can identify strong viewing windows. **Business question:** when does this audience watch?

Metrics: average minutes watched per household and percentage of households watching. Dimensions: day of week × daypart. The 7×6 heatmap has rows Mon–Sun and columns Early AM, Morning, Daytime, Afternoon, Primetime, Late Night. Each cell directly shows `{minutes}m` and household percentage to one decimal. Tooltip is exactly: `{day} · {daypart}`; `Avg minutes/hh: {minutes}m`; `% households: {one decimal}%`; `Heat intensity: N of 6 (low → high minutes)`. Six-step brand ramp encodes minutes; legend is `Low` → six swatches → `High` · `avg mins watched per household`. Hover/focus adds a selected outline; there is no click. Minimum width 720px with horizontal scroll. DoY/WoW definition: **Requires product/data clarification**.

### Content Affinity

**User story:** As a dashboard user, I want affinity against the national average so that I can identify the audience’s strongest content/lifestyle parameter and related shows. **Business question:** where does this audience over- or under-index, and which shows are associated with the selected parameter?

Metric: Index; detail metrics are viewers and show Index. Dimensions: eight fixed parameters and their mapped shows. Eight-axis radar, Index 0–200, numeric rings 50/100/150/200, dashed national baseline 100, unfilled qualitative-4 primary polygon. Tooltip is exactly: parameter; `Index: N`; `Highlight: {Index interpretation}`; `Baseline: National average = 100`. Pointer and Enter/Space select; selected label is bold/underlined and vertex enlarged. Default is highest Index. Supporting text states “Dashed ring = national average (100). Select a parameter to view its details.” Live detail says `{PARAMETER} — top 5 shows`, `Selected parameter · rank N of 8`, then viewer-ranked rows with list rank, compact viewers and `{index} idx`; rows are not clickable. Taxonomy/mapping/ranking/feed: **Requires product/data clarification**.

### TV User Behaviour

**User story:** As a dashboard user, I want to see post-show migration so that I can understand the audience’s next behaviour and destination. **Business question:** where do source-show viewers go within one hour?

Metric: flow share; supporting calculation displayed as drop from source. Dimensions: source show/network → behaviour → destination show/network or Other/stopped. Custom Sankey uses the top three behaviours from Stay on same channel/Switch channel/Move to streaming app/Stop watching; targets are the two strongest show · network destinations plus Other / stopped watching. “From” and “To” label the columns. Ribbon width=flow share; hover raises the ribbon opacity and dims others. Tooltip is exactly: `{behaviour} → {destination}`; `Flow share: {one decimal}%`; `Drop from source: {100 − flow share, one decimal}%`; `Window: Within 1 hour`. Show filter changes source/subtitle/flows; paths have hover but no keyboard focus, click or drilldown. Minimum 560px with horizontal scroll. A screen-reader-only list exposes every flow, and visible supporting copy identifies the source show/network and width meaning. Cohort, denominator and migration rules: **Requires product/data clarification**.

## KPI Visualisation Matrix

| KPI | User question | Primary metric | Secondary metric | Dimension | Chart | Filters | Drilldown |
|---|---|---|---|---|---|---|---|
| Overview | How large/active is the audience? | six summary metrics | four indices | audience | tiles | global, environment | No |
| Type | What is the viewing mix? | share % | estimated minutes/hh | TV type | donut | global, environment | cross-filter |
| Channel | Which destinations matter? | avg min/week | share, Index | channel/app | dual-axis bars | global, environment, type/tab | No |
| Shows | Which shows index highest? | avg min/hh | rendered share, Index | show | grouped bars | global, environment, type, platform, genre | show detail |
| Genres | Which genres matter? | avg min/week | share, Index | genre | grouped bars | global, environment, type, platform | cross-filter |
| Show detail | How does the show move weekly? | avg min/hh | households | week | dual-axis lines | inherited Shows filters | in-card detail |
| Temporal | When does the audience watch? | avg min/hh | % households | day×daypart | heatmap | global, environment, type/platform, channel/app, lookback | No |
| Affinity | Where does the audience index? | Index | viewers/show Index | parameter/show | radar+list | global, environment, type | in-card parameter detail |
| Behaviour | Where do viewers go next? | flow share | drop from source | migration path | Sankey | global, environment, type, genre, show | No |

## Chart Variations and States

- **Default:** UK/all-audience/last-30-days, All environment, no consumption type or genre selected; Linear TV tabs, Shows view, Temporal All channels/apps and 30-day (WoW); affinity detail resolves to the highest-index parameter; behaviour resolves All shows to the current top-indexing show.
- **Applied-filter/environment state:** all module data re-derives and loading skeletons precede the updated values; cross-filter/detail selections reset. Draft global edits do not alter charts.
- **Type-filtered state:** donut selection remains highlighted and a removable filter chip appears; Channel, Trends and Temporal tabs synchronize to that type, while Shows, genres, affinity and behaviour re-derive within scope. Clearing the type removes the scope but leaves platform tabs where the user last left them.
- **Alternative Trends dimension:** Shows displays the top-ten grouped chart and show dropdown; Genres displays all 12 genre groups and removes the show dropdown/alert. Toggling the switch clears show detail.
- **Show-detail state:** selecting a show replaces the grouped show chart with its four-week dual-line detail and dependent show selector.
- **Temporal alternatives:** platform changes rebuild the channel/app options; channel/app and lookback changes re-derive heatmap cells.
- **Affinity detail state:** selecting a radar parameter replaces the parameter/rank and top-five detail in place.
- **Behaviour source state:** selecting a show changes the subtitle, source copy and Sankey flows.
- **Loading/empty/error:** module skeletons, contextual empty states and inline PDF export error are as specified in Responsive / States. No Phase 1 comparison state exists.

## Chart Specifications

Index 100=national average; 150=50% above. It is not minutes or viewing percentage. Badges use arrow/text plus green/red/neutral. Radar explicitly shows baseline. Channel/show/genre currently append `%` to Index, conflicting with semantics: **Requires product/data clarification**.

Rendered mappings: Linear/primary=`--datavis-qualitative-4` `#7c33b5`; Streaming/secondary=`-3` `#a857e5`; FAST/tertiary=`-1` `#fbbb3b`; additional=`-2` `#ef8736`; line=`-5` `#ee4980`; neutral=`-7` `#e1e1e8`; positive `#115639`; negative `#da294b`; grid `#e1e1e8`; axis `#4b4b59`. Heat ramp: `#f6ebff`, `#e5c9f7`, `#cfa0ee`, `#b06fe0`, `#8a3fc9`, `#661f9e`. Grouped bars/show trend use qualitative-3 for minutes and qualitative-1 for percentage/households. Sankey uses primary, line pink and additional orange.

Tooltips are dark Fiber surfaces, portalled, max 320px/viewport-16px, 8px gap/edge, flip below, reposition on resize/ancestor scroll, and do not capture pointer.

## Drilldowns

Show bar/dropdown → in-card four-week dual-line detail; inherited state as above; All shows or view toggle returns. Radar parameter → in-card top-five detail; another parameter replaces it. Donut and genre are cross-filters, not drilldowns. No channel, heatmap, list-row or Sankey drilldown.

## Cross-KPI Interactions

Type syncs three platform tabs, scopes shows, shifts affinity, and constrains migration (Move to streaming app always targets Streaming). Genre constrains Shows and Behaviour. Affinity selection updates only its detail. Global/environment changes reset cross-filter selections. Channel/heatmap/Sankey hover never filters another card.

## Data Requirements

Known dimensions/metrics are exactly those in the KPI sections. Production source, refresh, identity, household weighting/deduplication, privacy thresholds, aggregation, denominators, taxonomy, aliases, classifications, benchmark, date/week/timezone/daypart logic, rounding/suppression, affinity and migration methodology all **Requires product/data clarification**. Synthetic `seeded/entityModel` logic is not a production specification.

| KPI | Known granularity/time/dependency | Confirmation required |
|---|---|---|
| Overview | one value per applied audience, date range and environment | metric aggregation, denominator and feed |
| Type | media type per applied audience/date/environment | minute aggregation and household estimate |
| Channel/App | channel/app within market and platform; top up to ten by minutes | inventory, aliases, share denominator and benchmark |
| Shows | show within platform/type/environment/genre; top ten by Index | show identity, `hhPct` meaning, share/reach denominator and benchmark |
| Genres | one row per rendered IAB genre within platform/type/environment | taxonomy governance, aggregation and share denominator |
| Show detail | selected show × Week 1–4 with inherited context | relationship between four weeks and global date range |
| Temporal | day × daypart within platform/channel/lookback | timezone, daypart boundaries and DoY/WoW definitions |
| Affinity | audience × parameter; selected parameter × top five shows | mapping, viewers, ranking, Index benchmark and feed |
| Behaviour | source show × behaviour × destination within one hour | cohort, attribution window, denominator, aggregation and migration rules |

## Design System Requirements

Use DM Sans, Fiber typography/spacing/surface/border/shadow/control tokens, MetricsTile, 4px SmartCards with 16px padding, searchable dropdowns, buttons, switch, rounded/underline tabs, chip, Info Alert, skeleton and empty state. Every chart is **Custom visualisation using Fiber design tokens**. Support dark tokens, keyboard selection, accessible names, non-colour cues, truncation and scrolling. No arbitrary chart palette.

## Responsive / States

Overview 2/3/6 columns; media card stacks then 20/80 at `lg`; Trends rows stack then align at `md`; affinity/behaviour stack then 3/7 at `lg`. Dropdown list max-height 220px. Exact framework breakpoints and production category virtualization: **Engineering decision required**.

Applied/global environment changes show tile loading and chart skeletons (~550ms prototype). Empty state uses illustration and contextual copy; Italy+Heavy is prototype-reachable. Export errors appear explicitly. Production API retry/partial errors: **Engineering decision required**.

## Functional Acceptance Criteria

- **Given** staged edits, **when** Apply is pressed, **then** every module updates and cross-filter selections reset.
- **Given** non-default applied filters, **when** Clear is pressed, **then** six filters return to defaults.
- **Given** either environment control, **when** changed, **then** its mirror and all modules update.
- **Given** Overview data, **when** the module renders, **then** all six exact metrics and the four applicable Index indicators use the documented formats and expose no chart interaction.
- **Given** the type donut, **when** an arc is hovered or clicked, or a legend row is hovered, focused or clicked, **then** the documented centre, dimming, tooltip and toggle behaviour appears.
- **Given** a type, **when** selected/cleared, **then** its chip and downstream scope/tabs synchronize or clear as documented.
- **Given** a Channel/App platform tab, **when** it changes, **then** up to ten valid destinations render with independent axes, the documented legend and exact tooltip, with no drilldown.
- **Given** Shows view, **when** platform/type/environment/genre changes, **then** the top-ten show universe, alert and dependent show options update consistently.
- **Given** Shows, **when** a show is selected, **then** four-week dual-axis detail opens; All shows returns.
- **Given** show detail, **when** a weekly point is hovered or focused, **then** both exact values and the dashed guide appear.
- **Given** Genres, **when** a genre is clicked, **then** its selected state toggles and the shared show/behaviour universe updates.
- **Given** Temporal platform changes, **when** a channel becomes invalid, **then** it resets to All.
- **Given** a Temporal cell, **when** hovered or focused, **then** both direct labels, selected outline and exact heat-intensity tooltip are available.
- **Given** a radar parameter, **when** clicked or Enter/Space activated, **then** rank/top-five update.
- **Given** a radar parameter, **when** hovered or focused, **then** its Index, interpretation and national baseline appear exactly as documented.
- **Given** a migration show, **when** selected, **then** source/subtitle/flows update.
- **Given** a Sankey ribbon, **when** hovered, **then** other ribbons dim and the exact path/share/drop/window tooltip appears; no click or keyboard interaction is implied.
- **Given** Export PDF, **when** activated, **then** the applied—not staged—context and rendered dashboard are exported with the documented header, exclusions, pagination and filename, while the button shows its busy state.
- **Given** loading, no-data or export-failure conditions represented by V5, **when** one occurs, **then** the corresponding documented skeleton, contextual empty state or inline error appears.
- **Given** narrow width, **when** a minimum-width chart overflows, **then** its region scrolls without clipping tooltip.
- **Given** Phase 1, **when** used, **then** no Comparison Mode control/state exists.

## Stakeholder Feedback Traceability

| Feedback | V5 solution | KPI / area affected | Status |
|---|---|---|---|
| Shared cards/merged type view | MetricsTile; one 20/80 SmartCard | Overview; Type; Channel/App | Incorporated |
| Addressable wording | All/Addressable rounded tabs | Global environment | Incorporated |
| Unlike metrics need distinct scales | independent dual axes | Channel/App; Shows; Genres; show detail | Incorporated |
| Trends as charts/dynamic dimensions | grouped bars + show/genre switch | Content viewership trends | Incorporated |
| Top-ten/show detail | alert, dependent dropdown, four-week lines | Shows | Incorporated |
| Better Index | arrows/explanation/radar rings | Overview; Channel/App; Trends; Affinity | Incorporated; suffix clarification |
| Dynamic temporal controls | platform-dependent inventory/reset | Temporal Insights | Incorporated |
| Hover/accessibility | portalled tooltips/focus labels | Rendered charts | Incorporated |
| Actionable affinity/Sankey | selected top-five; tokenized flows | Affinity; Behaviour | Incorporated |
| Comparison later | absent | Whole dashboard | Phase 2 |

## Out of Scope / Phase 2

**Comparison Mode is Phase 2**, including comparison controls, series, deltas, legends and tooltips. Also not delivered in rendered V5: the imported/unrendered Top N control and dead chart/list/table components; interaction for the displayed Advanced secondary-navigation label; unrendered drilldowns; and prototype collaboration/version tooling as production product features.

## Implementation Checklist

- **Product:** approve scope/personas/stories/clarifications.
- **Data:** contract every metric/dimension/benchmark/classification/date and relationship.
- **UX/UI:** build wrapper, six cards, controls, detail/state/responsive/theme behaviour.
- **Data visualisation:** exact charts, axes, labels, legends, tooltips, colours and accessibility.
- **Engineering:** staged/applied state, dependencies/resets, cross-KPI chain, PDF, represented errors, responsive/accessibility behaviour and tests; production API, caching and performance architecture is **Engineering decision required**.

## Open Questions / Clarifications

Target roles; feeds/SLAs; every metric denominator; show secondary meaning; Index `%` suffix; non-UK Mosaic; addressable classification; date-vs-week/DoY/WoW; affinity mapping; genre→affinity discrepancy; and migration methodology: **Requires product/data clarification**. Persistence, API retry/partial states, exact breakpoints, browser support and performance limits: **Engineering decision required**.

## Final V5 Cross-Check

- [x] Overview: six tiles.
- [x] Media type: DonutChart + DualAxisBarChart.
- [x] Trends: two ComboChart variants + ShowTrendChart.
- [x] TemporalHeatmap.
- [x] RadarChart + rendered top-five list.
- [x] MigrationSankey.
- [x] Every rendered global/local control, dependency, state, tooltip, wrapper and export.
- [x] Dead components excluded/discrepancies flagged.
- [x] Comparison Mode retained in Phase 2.
