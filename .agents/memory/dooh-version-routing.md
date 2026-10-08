---
name: DOOH version routing
description: How DOOH version labels, URL tokens, seeded versions, and renderer reuse fit together.
---

DOOH version identity is independent from the renderer directory name. A new visible version needs a canonical seeded version ID, URL-token resolution, and migration for existing local prototype records; it may still reuse the latest renderer implementation.

**Why:** The upload-preview work was implemented in the shared planner folder but remained visibly V2 because the registry only contained V1 and V2.

**How to apply:** When shipping a DOOH versioned change, verify the version chip, direct `?version=` route, prototype seed, and local-storage reconciliation—not just the feature component.

Version-dependent initial state must wait for resolved version metadata or reinitialize when the version gate changes.

**Why:** Shared version metadata hydrates asynchronously. A direct V4 demo can initially mount as the legacy renderer, causing one-time state initializers to omit V4-only demo uploads even after the City tab becomes visible.

**How to apply:** Verify V4-only demo records as well as visible controls on fresh direct navigation. Use version identity in the planner's mount key when initial state depends on that identity; changing a prop alone does not rerun state initializers.