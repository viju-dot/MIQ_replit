---
name: DOOH V5 map-only scope
description: User-defined boundaries for the V5 map exploration and comparison previews.
---

DOOH V5 is a map-only exploration based on V4. Keep the filter panel unchanged and preserve V1–V4.

**Why:** The user explicitly requested a new V5 to compare bubble and hexagon alternatives to numbered overview clusters, with no filter-side changes. Text descriptions alone were insufficient to review the options.

**How to apply:** Keep changes within the map and its view controls. Provide actual comparable visual previews using the same inventory and geography. Alternative encodings disclose exact counts on hover; the original V4 comparison view retains its numbered clusters as explicitly requested. Reuse the existing V4 filter behavior unless the user explicitly expands the scope.

Use Fiber brand color tokens for the V5 heatmap density ramp, not green or teal.

**Why:** The user explicitly rejected the green heatmap and requested Fiber token colors.

**How to apply:** Keep the density surface, legend, hover outline, and focus treatment aligned with Fiber's subtle-to-bold purple brand ramp. Do not introduce a separate green density palette.

V4 Map cluster totals mean visible, filtered screen locations—not the full city inventory or screens outside the viewport.

**Why:** The user explicitly requires counts to update on zoom, pan, and geographic coverage changes, with every represented screen counted once. They allow equal labels only when the underlying data genuinely produces them and require demo inventory to be identified.

**How to apply:** Preserve that visible-coverage meaning when changing clustering, caching, or rendering buffers. Split and merge clusters from the underlying locations rather than manufacturing varied numbers or changing the inventory to improve the appearance.
