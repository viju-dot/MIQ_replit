/* =========================================================================
 * Fiber Workspace — Usability Testing, scoped to a prototype
 * (/usability-testing/:id)
 *
 * Structure only: breadcrumb, prototype name + status, and Fiber tabs
 * (Overview | Sessions | Findings) with empty states. No functionality.
 * ========================================================================= */

import { useParams } from "wouter";
import { TestTube } from "@phosphor-icons/react";
import { ModuleContextView } from "./ModuleContextView";

const TABS = [
  {
    id: "overview",
    label: "Overview",
    empty: "A summary of testing activity for this prototype will appear here.",
  },
  {
    id: "sessions",
    label: "Sessions",
    empty: "Usability sessions run against this prototype will be listed here.",
  },
  {
    id: "findings",
    label: "Findings",
    empty: "Findings and usability signals captured during testing will surface here.",
  },
];

export default function UsabilityTestingContextPage(): JSX.Element {
  const params = useParams();
  return (
    <ModuleContextView
      prototypeId={params.prototypeId ?? ""}
      moduleLabel="Usability Testing"
      moduleIcon={TestTube}
      intro="Validate this prototype against real usability signals before it ships."
      tabs={TABS}
    />
  );
}
