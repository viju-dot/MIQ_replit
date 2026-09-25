---
name: Cross-filter clearing
description: Keep dashboard scope indicators and downstream content consistent.
---

When a consumption cross-filter is removed, clear its dependent local tab selections as well as the source selection. Do not reset independent tab choices on the dashboard's initial render.

**Why:** A pre-publish browser check found that removing the Streaming indicator left the TV dashboard's downstream content and status copy on Streaming. The UI appeared unfiltered while still showing scoped data.

**How to apply:** For new linked cross-filters, verify both selection and explicit removal across each affected chart, tab, and status label. Keep global staged filters separate from local consumption scopes.