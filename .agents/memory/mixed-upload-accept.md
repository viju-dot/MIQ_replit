---
name: Mixed upload accept rules
description: The shared Fiber upload control needs extension-aware validation when one input accepts multiple file types.
---

When a FiberDropZone accepts multiple extensions, validate the selected filename against the declared extension list rather than checking whether the accept string contains a particular MIME label.

**Why:** A mixed `.csv`/`.xlsx` accept string was previously treated as CSV-only, so the native input advertised XLSX while the runtime rejected it.

**How to apply:** For future upload controls, keep the `accept` attribute, visible guidance, and client-side filename validation derived from the same set of allowed extensions.