/* =========================================================================
 * Fiber Workspace — Flow Chart landing (/flow-chart)
 *
 * Lists prototypes (from prototypeStore) as entry points into their per-
 * prototype Flow Chart context view (/flow-chart/:prototypeId).
 *
 * FUTURE WORKFLOW: flows here will map AI Prototype outputs and feed Usability
 * Testing. Not implemented yet.
 * ========================================================================= */

import { FlowArrow } from "@phosphor-icons/react";
import { ModuleLanding } from "./ModuleLanding";

export default function FlowChartPage(): JSX.Element {
  return (
    <ModuleLanding
      title="Flow Chart"
      description="Design user flows, AI workflows and decision trees, with version history to track how each flow evolves over time. Select a prototype to map its flows."
      moduleIcon={FlowArrow}
      toHref={(id) => `/flow-chart/${id}`}
      emptyLabel="No prototypes yet. Create one in AI Prototype to start mapping flows."
    />
  );
}
