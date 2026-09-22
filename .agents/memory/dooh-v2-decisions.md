---
name: DOOH prototype scope and duplicate safety
description: Why DOOH's MVP keeps mock intelligence, existing persistence, and additive duplicate versions
---

Treat the DOOH V2 brief as a minimal mock-data planning prototype, not authorization to connect a DSP or make live campaign bookings.

**Why:** The brief explicitly requested mock screens/intelligence and a minimal Phase 1 implementation. Saved audiences already had real persistence, which should not be replaced with browser-only state just because the example brief used React state.

**How to apply:** Preserve the persistent audience library and distinguish simulated forecasts from actual inventory or activation. Keep previous prototype versions and unrelated TV case-study evidence intact.

Interpret duplicate-name “override” as an explicitly confirmed new version, never an overwrite of an existing audience.

**Why:** Existing audiences may already be reused in plans and are protected by a case-insensitive unique-name constraint. Dropping that protection or silently overwriting geography would be more destructive than the brief's duplicate warning implies.

**How to apply:** Show the duplicate warning and versioned-save action before opting into server-side unique suffixing. Report the actual saved name; preserve the original audience and its metadata.