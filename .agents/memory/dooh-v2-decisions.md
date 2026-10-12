---
name: DOOH prototype scope and duplicate safety
description: Why DOOH's MVP keeps mock intelligence, existing persistence, and additive duplicate versions
---

Smart selection should infer geography only, not independent commercial or audience preferences.

**Why:** The user wants map captures reflected in relevant sidebar filters while keeping settings such as budget an individual choice.

**How to apply:** Represent captured circles as visible, removable geographic constraints. Preserve manually chosen facets; do not infer budget, publishers, or venue selections from whichever billboards happen to fall inside a circle.

Keep prototype version identity separate from the V1/V2 rendering implementation.

**Why:** Users duplicate versions for review. Restricting navigation to renderer names silently resets those duplicates to V2 and loses their review context.

**How to apply:** Carry the selected version identity through opening, module navigation, and save/use links; choose the layout from the duplicate's ancestry. Do not treat a new version label as a new independent code snapshot.

Keep the searchable screen-information table in Screen List and the optional vertical Plan Overview on the map only.

**Why:** The user corrected an earlier misinterpretation: repeating Plan Overview in both tabs removes needed screen details and adds redundant information.

**How to apply:** Preserve search, screen details, and selection in Screen List. Reuse Fiber Smart Card and Metrics components for the map summary; keep it dismissible and clear of map controls. Do not replace the table with summary metrics.

For previous DOOH versions, keep facet search, the global All action, and selected values visible immediately when a filter is enabled. V4 uses searchable, scrollable Venue Type and Publisher dropdowns with selected options first, plus All, a selected count, and up to five removable Fiber pills outside.

**Why:** The original brief prioritized immediate visibility; V4 replaces search-only controls with dropdowns supporting many options. The user rejected both Recent and the subsequent accordion, preferring immediately visible Fiber pills limited to five with a clickable remaining-count pill.

**How to apply:** Preserve older versions' inline facets. In V4 keep search and all options inside the multi-select dropdown, selected options before remaining options. Outside show All, the selected count, and the first five removable Fiber pills; a “N more” pill reveals the rest. Do not restore Recent or an accordion, or cap the number of selections.

Publisher screen-count labels belong only to the V4 Publisher filter, not Venue Type or older versions.

**Why:** The user explicitly requested publisher-only inventory counts in search/dropdown options and selected pills, plus a right-aligned screen total beside the selected heading.

**How to apply:** Use actual prototype inventory counts rather than illustrative example numbers. Total the inventory belonging to the selected publishers; All includes every publisher. Keep publisher inventory totals distinct from the plan's matched-screen count after other constraints.

V4 Plan Overview prioritizes Matched Screens, Selected Screens, then Estimated Impressions; a plain “Other est” title with one Fiber toggle reveals both financial metric tiles below.

**Why:** Stakeholders want financial figures optionally hidden during client demos. The user rejected per-tile CPM/spend switches, requested one grouped control without changing the metric components, and renamed it “Other est.” These are presentation controls, not authorization.

**How to apply:** Default Other est off and omit both financial tiles until enabled. Keep their standard Fiber appearance and budget-use badge when shown, without individual switches or “Hidden” placeholders. Preserve the separate Screen List CPM toggle, clear CPM sorting when hidden, and retain state across tab switches and overview mounts. Do not change calculations or older versions.

Treat the DOOH V2 brief as a minimal mock-data planning prototype, not authorization to connect a DSP or make live campaign bookings.

**Why:** The brief explicitly requested mock screens/intelligence and a minimal Phase 1 implementation. Saved audiences already had real persistence, which should not be replaced with browser-only state just because the example brief used React state.

**How to apply:** Preserve the persistent audience library and distinguish simulated forecasts from actual inventory or activation. Keep previous prototype versions and unrelated TV case-study evidence intact.

Interpret duplicate-name “override” as an explicitly confirmed new version, never an overwrite of an existing audience.

**Why:** Existing audiences may already be reused in plans and are protected by a case-insensitive unique-name constraint. Dropping that protection or silently overwriting geography would be more destructive than the brief's duplicate warning implies.

**How to apply:** Show the duplicate warning and versioned-save action before opting into server-side unique suffixing. Report the actual saved name; preserve the original audience and its metadata.

Use the TV Audience Planner's Fiber navigation as the reference for DOOH's product header.

Keep source provenance visible on the map when multiple targeting inputs are active.

**Why:** A map of matched screens without explaining whether results came from a geo audience, planning zone, postcode, or POI makes the inventory look arbitrary.

**How to apply:** Use stable source colors and a bottom-left Match Source legend with independent counts and explicit inactive states. Keep the legend above fixed collaboration controls and separate from map controls.

**Why:** The user rejected a custom MiQ wordmark/breadcrumb/demo-controls header in favor of the existing Fiber primary and Reports secondary navigation.

**How to apply:** Keep Reports / Advanced active for DOOH, and place planner-specific tabs below the product navigation rather than rebuilding the top bar. The user also rejected custom styling for the module tabs: reuse the actual Fiber catalogue component and its states, not a visually similar custom tab bar.

Keep the planner navigation limited to Geo Planner and DOOH, using Fiber rounded tabs below the page heading, without breadcrumbs or extra version/exit controls.

**Why:** The user explicitly wants only these two modules in navigation and considers the bottom-right collaboration controls sufficient for version and exit actions.

**How to apply:** Do not reintroduce a Saved Audiences navigation tab or duplicate toolbar controls when extending the planner. Preserve saved-audience data and reuse functionality. “Tabs Bar — rounded” means the complete catalogue bar, including its shared neutral rounded track—not isolated pill items; the user explicitly rejected the latter.

For deterministic stakeholder demo presets, derive uploaded screen IDs from the real inventory after applying the same geographic and filter constraints as the visible planner.

**Why:** Hardcoded or independently generated IDs can produce an apparently populated upload card that parses to zero usable screens. Native time inputs also reject `24:00`, even when inventory availability uses minute 1440 for an all-day endpoint.

**How to apply:** Anchor the preset to an in-radius real screen, select IDs from the shared `SCREENS` data, and clamp displayed all-day end times to `23:59` while preserving a non-empty interval.

Keep Postcode and Lat/Long uploads as separate location-method states.

**Why:** Switching location methods should not destroy a previously uploaded file, but it must not show a Postcode preview under Lat/Long or apply the wrong points to the active method.

**How to apply:** Render only the selected method's upload state, restore that state's records when switching back, and let explicit file removal clear only the active method.

Match Source should summarize every populated targeting input, not only the currently selected Location method.

**Why:** The legend replaces duplicated geography controls by explaining the provenance of all map inputs. Hiding Postcode, POI, Lat/Long, or Saved Audience as soon as another method is selected makes existing data appear to disappear.

**How to apply:** Keep source presence and counts independent for Planning Zone, Saved Audience, Postcode, Lat/Long, and POI; switching tabs should only change the active editor and matching geography, not erase other legend rows.

The V3 demo preset should populate every non-audience Match Source input.

**Why:** The demo is used to explain the Match Source legend and must visibly demonstrate each supported source rather than leaving Lat/Long or POI empty.

**How to apply:** Seed valid Postcode and Lat/Long upload records, select a real POI, and keep Planning Zone enabled; leave Geo Planner unpopulated unless the demo explicitly includes a saved audience.

Location upload cards should prioritize the uploaded-file summary before the replacement drop zone.

**Why:** Reviewers need to see the current filename and selection state first, while sample-format details add noise to the Postcode and Lat/Long workflow.

**How to apply:** For both methods, show Overall preview with filename, Selected, Not selected, Full preview, and Remove file; omit the sample-format accordion and place Download sample CSV after the drop zone.

Keep the City Location subfilter and its seeded upload demo exclusive to DOOH V4.

**Why:** The user explicitly requested City with the same upload/sample/filter functionality as Postcode, without changing other prototype versions.

**How to apply:** Reuse the existing CSV validation, selection, preview, removal, and point-based matching workflow; preserve City uploads independently from other methods. Seed City only in V4 demo mode and do not remove the existing V3 demo.

Currency selection for European planning belongs to DOOH V4 only.

**Why:** The user wants to expand planning across Europe while keeping all other versions unchanged, and explicitly requires Plan Overview to follow the selected Budget-filter currency.

**How to apply:** Keep monetary labels, estimates, screen CPM, and exports consistent with the selected currency. Convert populated Budget/CPM amounts when changing currency to preserve the plan's economic value and preserve blank optional inputs. Rates are fixed prototype rates, not live FX; the user explicitly removed the explanatory text beneath the Currency field, so do not restore it there. Euro support does not imply live European inventory or activation.

Creative counts in V4 represent matching inventory, not manually checked screen rows.

**Why:** The user wants counts beside each format and resolution and an overall count for their combined selection. An option's count should describe the result of choosing it, including other active planning constraints.

**How to apply:** Keep the other creative dimension selected when counting an alternative. Include geography, screen lists, commercial filters, and budget; calculate budget allocation after the alternative selection rather than counting an already budget-truncated pool. Keep previous prototype versions unchanged.

V4 map colors must communicate actual Match Source provenance using Fiber's data-visualization palette, including uploaded Screen List, with brand-purple fallback markers rather than black.

**Why:** The user rejected the map's black pins/clusters and requested Fiber-consistent source colors, a consistent circle/polygon pattern, and full per-screen hover details after filtering.

**How to apply:** Circles and polygons share the Planning Zone source hue; dashed polygons distinguish shape without changing provenance. When sources overlap, retain one stable primary marker color but show all real source memberships individually in the tooltip. Never use generic “Matched” as provenance: the user needs the exact Geo Planner, Postcode, City, Planning Zone, Lat/Long, POI, or Screen List name. Explain full-inventory/no-source cases explicitly instead of inventing a source. Show publisher, venue, city, impressions, and selected-currency CPM; omit CPM when the seller hides it. Hovering must not recenter the map. Keep older versions unchanged.