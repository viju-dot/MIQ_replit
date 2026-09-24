---
name: Optional numeric input modes
description: A numeric input uses an empty-string sentinel for an explicit mode such as Freehand.
---

When a controlled numeric input uses `""` as a mode sentinel, an intermediate empty value during editing must not immediately switch modes or disable the input. Keep the current mode while the user edits, and change the sentinel only through the explicit mode control.

**Why:** Clearing a controlled number field emits an empty input event before the replacement value is typed. Treating that transient value as a mode change can disable the field mid-edit and make the feature appear broken.

**How to apply:** Guard empty and non-numeric intermediate values in `onChange`; restore a valid minimum/default on blur if needed. Keep checkbox/tab actions responsible for enabling the sentinel mode.