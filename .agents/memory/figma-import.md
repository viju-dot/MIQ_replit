---
name: Figma import pipeline for Fiber Design System
description: How the Figma MCP behaves for this file and how pages were imported into the explorer app
---

- File F1HHpq2d3SfsJGdS9HYXdA only lists page "Cover" via get_metadata without nodeId; other pages exist but must be reached by direct node IDs (user supplies per-page links, saved in attached_assets).
- `get_design_context` fails at canvas/page level ("nothing selected") — call `get_metadata` on the page node, then `get_design_context` per top-level frame/symbol.
- **Why:** page enumeration is restricted for this file; frame-level fetches work fine.
- **How to apply:** for new Fiber pages, reuse the fetch pipeline (refs saved to design-refs/<slug>.md), delegate page build to a general subagent, then register in client/src/pages/registry.tsx. Reference code is Tailwind v4 var()-based — replace with plain fallback hex; download figma.com/api asset URLs (temporary) into client/public/figmaAssets/<slug>/.
- `get_design_context` output caps around 170KB with one silently elided mid-file chunk (`forceCode` doesn't help; instance-path sub-node IDs like `I62298:272589;...` fail with "Failed to reach MCP server"). For very tall frames, detect the `elided` marker + compare rendered height vs canvas height, then complete missing sections from a full-height `get_screenshot` render (maxDimension ≈ canvas height, download the temp URL immediately).
- In the CodeExecution notebook, `"use impure"` fs writes sometimes fail with "executeJs is not defined" when called from a function defined in an earlier cell — inline the impure write in the same cell and keep data in a top-level variable.
