---
name: Comment coordinate frames
description: Keep existing review pins stable when extending commentable surfaces.
---

When adding a commentable area outside the original prototype content, keep old pins in their original coordinate frame and identify the new area separately.

**Why:** Pin positions are percentages, not element IDs or absolute screen coordinates. Moving the original overlay to a larger parent would silently shift stakeholders' historical pins to the wrong UI elements.

**How to apply:** Treat an absent region marker on an old comment as the original content area. New areas may use separate layers and tagged anchors. Check positioning after reload, in a fresh browser, and across versions. If a short area has a composer that extends over a sibling, check hit-testing of its buttons: a later sibling's click layer may intercept them.