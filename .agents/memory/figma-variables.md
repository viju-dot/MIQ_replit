---
name: Figma variable harvesting
description: How Figma MCP exposes design tokens for the Fiber file, and its limits
---

# Figma variable harvesting (Fiber design system)

- `mcpFigma_getVariableDefs` fails on page-level (canvas) nodes ("nothing selected"); call it on frame/instance nodes found via `getMetadata` on the page node. Its `content` is a plain JSON **string**, not an array.
- It resolves variables in the node's **current mode only** — the dark variable collection is not machine-readable. **Why:** attempting to fetch dark values from dark-styled frames returns almost no color variables. **How to apply:** harvest light values per frame; dark overrides must come from Figma dark-frame evidence or be derived from the system's own palette and documented as approximations (see the header of `artifacts/figma-design/client/src/styles/tokens.css`).
- Figma emits non-CSS values for some variables: `Font(...)` (split into -family/-size/-weight/-line-height/-letter-spacing vars) and `Effect(...)` shadows (convert to `box-shadow` syntax) — leaving them raw breaks PostCSS/Vite with "Unknown word Effect".
- Theme sync pattern used: ThemeProvider sets `data-theme` on `<html>`; `tokens.css` has `:root` + `[data-theme="dark"]`; components reference `var(--token, lightFallback)`. Intentional Figma dark *variants* (e.g. Secondary Navigation "Dark surface") keep fixed literals — they are variants, not theme state.
- Per-page token maps live in `design-refs/tokens/<slug>.json` for future re-mapping.
- `downloadAssets` SVG exports of Fiber illustration symbols embed Figma canvas chrome (a full-size #E5E5E5 rect + huge negative-offset parent-frame rects with dashed #9747FF stroke) — strip those rects after download. Occasionally an MCP response fails the platform security scan (false positive on batched asset URLs); retrying one call at a time works.
- The Fiber icon library is Phosphor: Figma sets "Icon/<name>" map 1:1 to @phosphor-icons/react exports; Style Regular/Fill/Duotone = Phosphor weights, sizes 16/20/24/32.
- Navigation has NO SM/MD/LG/XL size variants in Figma (verified); real axes are Primary state/menu, Secondary Module ×5 (+ Dark surface variant), composite Navigation, User Menu Type×Version, Avatar State/Plan/Size.
