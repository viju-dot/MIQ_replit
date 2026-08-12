---
name: Share backend & api-server quirks
description: Where prototype share links persist, and figma-design/api-server service gotchas
---

- figma-design's `server/` directory is DEAD scaffolding: its dev script runs Vite only and production serves static — Express code there never executes. Backend work goes in the shared `artifacts/api-server` (proxied at `/api`, same origin, so root-relative `/api/...` fetches work since figma-design BASE_PATH is "/").
- **Why:** a share-links feature was first built on localStorage and failed cross-browser; the fix landed in api-server (`src/routes/shares.ts`, in-memory store — restarts clear shares).
- api-server's dev workflow is a one-shot `build && start`, NOT a watch: after changing its code, rebuild happens via the dev script but you MUST restart the `artifacts/api-server: API Server` workflow for changes to serve.
- Client-side auth (`fiber.auth` sessionStorage gate, single credential) is an intentional, documented prototype gate — user knows; don't re-flag it every review.
- Modal/drawer effect gotcha: capturing `document.activeElement` as the focus-restore target inside a useEffect that depends on a callback prop re-captures an in-panel element when the parent re-renders. Keep such effects keyed on `open` only (callback via ref) and retry focus restore (0/50/150ms) — mouse closes land focus on body after the first attempt.
