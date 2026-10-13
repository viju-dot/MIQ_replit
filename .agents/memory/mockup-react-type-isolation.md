---
name: React types in extracted mockups
description: Avoid cross-artifact React declaration conflicts when extracting legacy UI into the sandbox.
---

Keep React type resolution local to each artifact when copying components between runtimes. Do not upgrade the source application's React merely to resolve sandbox type errors.

**Why:** Extracting legacy DOOH map code into the newer sandbox exposed incompatible ReactNode and Context declarations, including bigint errors, even after aligning runtime dependencies. Transitive UI declarations had resolved a different React type family.

**How to apply:** When extracted UI shows these errors, check both the runtime peers and the declaration resolution tree. Ensure the sandbox's TypeScript resolves its own installed React declarations consistently, while leaving the source app's runtime and declaration family intact.
