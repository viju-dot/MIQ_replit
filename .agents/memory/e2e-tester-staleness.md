---
name: E2E tester staleness
description: Long-lived testing subagents can report false FAILs from stale browser/session context.
---
A long-lived Playwright tester session can produce false negatives: it may act on a stale HMR module, mistake hover/default-tab state for a selection, or reply against an earlier task's context.

**Why:** During V4 cross-filter verification (Aug 2026), the reused tester reported the scope filter broken three times; the code was correct, and a FRESH tester with DOM-level assertions (aria-pressed, exact chip text) passed everything first try.

**How to apply:** If a reused tester reports a failure that contradicts a verified code path, don't loop fixes — first trace the code yourself, then re-verify with a NEW tester name, a hard reload step, and machine-checkable assertions (aria attributes, exact strings) instead of visual interpretation.
