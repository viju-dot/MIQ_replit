/* =========================================================================
 * Fiber Workspace — Usability Testing landing (/usability-testing)
 *
 * Lists prototypes (from prototypeStore) as entry points into their per-
 * prototype Usability Testing context view (/usability-testing/:prototypeId).
 *
 * FUTURE WORKFLOW: validates AI Prototype outputs (and their Flow Chart maps).
 * Not implemented yet.
 * ========================================================================= */

import { TestTube } from "@phosphor-icons/react";
import { ModuleLanding } from "./ModuleLanding";

export default function UsabilityTestingPage(): JSX.Element {
  return (
    <ModuleLanding
      title="Usability Testing"
      description="Validate the outputs of your AI Prototypes against real usability signals before they ship. Select a prototype to review its testing workspace."
      moduleIcon={TestTube}
      toHref={(id) => `/usability-testing/${id}`}
      emptyLabel="No prototypes yet. Create one in AI Prototype to start testing."
    />
  );
}
