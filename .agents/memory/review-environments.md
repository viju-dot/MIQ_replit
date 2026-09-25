---
name: Review environment isolation
description: Development and published collaboration feedback live in distinct database environments.
---

Review comments and design annotations written in the workspace preview are not automatically present on the published site. Publishing updates application code and may reconcile schema, but it does not copy feedback records between development and production.

**Why:** Assuming development comments appear on the stakeholder-facing published site creates an apparently empty review, even when both databases and APIs work correctly.

**How to apply:** Before telling someone to share a published prototype, compare aggregate record availability in both environments and distinguish a successful code publish from transferring existing review content. Never overwrite published feedback as a shortcut to copying development records.