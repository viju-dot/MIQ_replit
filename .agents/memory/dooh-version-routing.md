---
name: DOOH version routing
description: How DOOH version labels, URL tokens, seeded versions, and renderer reuse fit together.
---

DOOH version identity is independent from the renderer directory name. A new visible version needs a canonical seeded version ID, URL-token resolution, and migration for existing local prototype records; it may still reuse the latest renderer implementation.

**Why:** The upload-preview work was implemented in the shared planner folder but remained visibly V2 because the registry only contained V1 and V2.

**How to apply:** When shipping a DOOH versioned change, verify the version chip, direct `?version=` route, prototype seed, and local-storage reconciliation—not just the feature component.