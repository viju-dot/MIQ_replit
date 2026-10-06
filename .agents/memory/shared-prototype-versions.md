---
name: Shared prototype versions
description: Safe synchronization rules for prototype version history across browser-local stores and the shared collaboration database.
---

Treat each version as an independently upserted shared record. Never replace the full shared history from one browser's local snapshot; a stale browser may not know about newer collaborators' versions. During migration, preserve a requested version label when it is unused, because a newly created V4 can reach the server before its older seeded versions.

**Why:** A browser-local duplicate may be saved before shared history hydration. Assigning labels solely from the server's current maximum would rename that version incorrectly, while whole-list writes could erase versions created elsewhere.

**How to apply:** For future version-history changes, use per-version writes with update-time conflict protection, merge fetched entries by ID, and serialize label allocation per prototype.
