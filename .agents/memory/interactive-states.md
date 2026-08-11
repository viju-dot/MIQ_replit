---
name: Interactive state pattern for Fiber explorer pages
description: Conventions used when wiring Figma state variants (hover/focus/disabled/selected) into ds playground pages
---

- Tailwind arbitrary color classes containing `var()` or `rgba(...)` (e.g. `hover:bg-[rgba(...)]`, `bg-[var(--x,rgba(...))]`) SILENTLY FAIL in this Vite/Tailwind setup — drive state-dependent colors with inline `style` objects (React hover/focus state) instead. **Why:** commas in arbitrary values break class parsing; a full code-review round was needed to purge them.
- State-resolution policy (uniform across all ds pages): a Properties-panel-forced state stays forced; natural pointer/keyboard interaction only derives states when the panel base is Default; disabled always wins and suppresses hover/active/click.
- Never invent states absent from `design-refs/<slug>.md` (e.g. action-bar/carousel have only State=Default; radio/toggle have no hover variant).
- Interactive previews must be native buttons/inputs or complete ARIA composites (role + tabIndex + Enter/Space); no nested interactive controls.
