---
name: Map tile service validation
description: Validate rendered tiles, not just HTTP success, when choosing a basemap provider.
---

Do not assume CARTO's legacy public Positron endpoint is key-free.

**Why:** On 2026-09-23 it returned blurred map images marked “API KEY REQUIRED” in the preview despite loading successfully. A successful tile response does not prove a usable basemap.

**How to apply:** Visually inspect actual tiles before adopting a provider. If credentials are required, use the proper integration flow or a genuinely public alternative; do not ship watermarked tiles or try to bypass access requirements.