---
name: Collaboration persistence
description: Durable comments and design annotations across reloads, collaborators, API restarts, and published sessions.
---

The shared review surfaces should treat Postgres as the source of truth, keep the last local copy visible during temporary API failures, and rehydrate while a prototype remains open so other viewers see updates without manual refreshes. Any implementation mirror must use the same durable records rather than an API-process memory map.

**Why:** Browser localStorage is private to one viewer, and process memory disappears on API restart; either source makes collaboration feedback look like it vanished.

**How to apply:** When adding or changing comments/annotations, verify the `/api/prototypes/:prototypeId/...` records, preserve cached fallback behavior, and keep a modest polling or push mechanism for already-open viewers. Republish before claiming the live app has the fix.