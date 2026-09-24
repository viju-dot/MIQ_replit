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

Keep facet search, the global All action, and selected values visible immediately when a filter is enabled.

**Why:** The user rejected hiding these controls and selections inside Venue Type and Publisher dropdowns; visibility matters more than compactness here.

**How to apply:** Future facet refinements may scroll option lists, but must not require opening a dropdown to search, select All, or inspect existing selections.

Treat the DOOH V2 brief as a minimal mock-data planning prototype, not authorization to connect a DSP or make live campaign bookings.

**Why:** The brief explicitly requested mock screens/intelligence and a minimal Phase 1 implementation. Saved audiences already had real persistence, which should not be replaced with browser-only state just because the example brief used React state.

**How to apply:** Preserve the persistent audience library and distinguish simulated forecasts from actual inventory or activation. Keep previous prototype versions and unrelated TV case-study evidence intact.

Interpret duplicate-name “override” as an explicitly confirmed new version, never an overwrite of an existing audience.

**Why:** Existing audiences may already be reused in plans and are protected by a case-insensitive unique-name constraint. Dropping that protection or silently overwriting geography would be more destructive than the brief's duplicate warning implies.

**How to apply:** Show the duplicate warning and versioned-save action before opting into server-side unique suffixing. Report the actual saved name; preserve the original audience and its metadata.

Use the TV Audience Planner's Fiber navigation as the reference for DOOH's product header.

**Why:** The user rejected a custom MiQ wordmark/breadcrumb/demo-controls header in favor of the existing Fiber primary and Reports secondary navigation.

**How to apply:** Keep Reports / Advanced active for DOOH, and place planner-specific tabs below the product navigation rather than rebuilding the top bar. The user also rejected custom styling for the module tabs: reuse the actual Fiber catalogue component and its states, not a visually similar custom tab bar.

Keep the planner navigation limited to Geo Planner and DOOH, using Fiber rounded tabs below the page heading, without breadcrumbs or extra version/exit controls.

**Why:** The user explicitly wants only these two modules in navigation and considers the bottom-right collaboration controls sufficient for version and exit actions.

**How to apply:** Do not reintroduce a Saved Audiences navigation tab or duplicate toolbar controls when extending the planner. Preserve saved-audience data and reuse functionality. “Tabs Bar — rounded” means the complete catalogue bar, including its shared neutral rounded track—not isolated pill items; the user explicitly rejected the latter.