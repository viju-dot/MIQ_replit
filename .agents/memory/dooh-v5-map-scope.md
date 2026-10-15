---
name: DOOH V5 scope
description: User-defined boundaries for V5 map exploration and the POI/LatLong radius exception.
---

DOOH V5 is a map exploration based on V4. Preserve V1–V4 and keep existing filters unchanged except for explicitly requested V5-only additions.

**Why:** The user explicitly requested a new V5 to compare bubble and hexagon alternatives to numbered overview clusters, with no filter-side changes. Text descriptions alone were insufficient to review the options.

**How to apply:** Keep changes within the map and its view controls. Provide actual comparable visual previews using the same inventory and geography. Alternative encodings disclose exact counts on hover; the original V4 comparison view retains its numbered clusters as explicitly requested. Reuse the existing V4 filter behavior unless the user explicitly expands the scope.

The user expanded V5 scope to restore "Radius around points" for Location → POI and Lat/Long only. Do not restore it to V4 or expose it for other V5 location methods.

**Why:** The user specifically requested the former radius feature in V5 only, for these two subfilters, with everything else unchanged.

**How to apply:** Preserve the existing slider, exact input, and meters/kilometers behavior. Radius edits in POI/LatLong must not change the previously fixed coverage of Saved Audience, Postcode, or City.

V5 also permits local "Clear all" actions only for POI, Venue Type, Publisher, and Creative resolutions—not Creative format or every filter globally.

**Why:** The user explicitly limited the clearing action to these selections and required Fiber styling with proper alignment, leaving historical versions and other filter settings unchanged.

**How to apply:** Clear only the local selection, preserve enabled toggles and independent values (especially Creative format and Location radius), and gate new controls to V5.

Use Fiber brand color tokens for the V5 heatmap density ramp, not green or teal.

**Why:** The user explicitly rejected the green heatmap and requested Fiber token colors.

**How to apply:** Keep the density surface, legend, hover outline, and focus treatment aligned with Fiber's subtle-to-bold purple brand ramp. Do not introduce a separate green density palette.

V4 Map cluster totals mean visible, filtered screen locations—not the full city inventory or screens outside the viewport.

**Why:** The user explicitly requires counts to update on zoom, pan, and geographic coverage changes, with every represented screen counted once. They allow equal labels only when the underlying data genuinely produces them. They subsequently asked to remove the visible demo/count status box alone.

**How to apply:** Preserve that visible-coverage meaning when changing clustering, caching, or rendering buffers. Split and merge clusters from the underlying locations rather than manufacturing varied numbers or changing the inventory to improve the appearance.
