---
name: DOOH version routing
description: How DOOH version labels, URL tokens, seeded versions, and renderer reuse fit together.
---

DOOH version identity is independent from the renderer directory name. A new visible version needs a canonical seeded version ID, URL-token resolution, and migration for existing local prototype records; it may still reuse the latest renderer implementation.

**Why:** The upload-preview work was implemented in the shared planner folder but remained visibly V2 because the registry only contained V1 and V2.

**How to apply:** When shipping a DOOH versioned change, verify the version chip, direct `?version=` route, prototype seed, and local-storage reconciliation—not just the feature component.

New public DOOH versions must be available from the shipped registry, not only from a version saved in the development review history.

**Why:** V4 features existed in the published bundle but the published Options panel only offered V1–V3. Republishing and refreshing could not expose V4 because development version metadata was not part of the production history.

**How to apply:** Backfill missing built-in versions for old browsers. Preserve an already-saved same-label V4 identity and its review links, including when it arrives from shared history, instead of creating a second placeholder that the server renames. An already-auto-renamed built-in placeholder must not take precedence over the real V4; leave shared history intact and resolve the existing V4 for the UI. Test this collision against shared metadata, not only an empty server mock. Keep an intentional older selection valid; provide the V4 picker entry and direct V4 URL rather than renaming or changing V3.

New exploration branches must not unarchive or replace old review versions merely because their requested label matches archived history.

**Why:** An archived DOOH V5 existed before the new map-only V5 request. Historical label allocation could rename the new canonical branch to V7, despite the requested public V5 identity.

**How to apply:** Preserve the archived record's ID, status, and metadata. Let the new canonical branch coexist under its requested label when no active record holds it. Reconcile an already-auto-renamed, untouched new seed in place, never by deleting or overwriting archived history. Scope TV-specific same-label canonicalization to TV; DOOH IDs carry separate review histories.

Version-dependent initial state must wait for resolved version metadata or reinitialize when the version gate changes.

**Why:** Shared version metadata hydrates asynchronously. A direct V4 demo can initially mount as the legacy renderer, causing one-time state initializers to omit V4-only demo uploads even after the City tab becomes visible.

**How to apply:** Verify V4-only demo records as well as visible controls on fresh direct navigation. Use version identity in the planner's mount key when initial state depends on that identity; changing a prop alone does not rerun state initializers.