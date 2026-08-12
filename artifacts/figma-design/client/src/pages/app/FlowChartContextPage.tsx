/* =========================================================================
 * Fiber Workspace — Flow Chart, scoped to a prototype (/flow-chart/:id)
 *
 * Structure only: breadcrumb, prototype name + status, and Fiber tabs
 * (Overview | Flows | Versions) with empty states. No editor.
 * ========================================================================= */

import { useParams } from "wouter";
import { FlowArrow } from "@phosphor-icons/react";
import { ModuleContextView } from "./ModuleContextView";

const TABS = [
  {
    id: "overview",
    label: "Overview",
    empty: "An overview of this prototype's flows will appear here.",
  },
  {
    id: "flows",
    label: "Flows",
    empty: "User flows, AI workflows and decision trees for this prototype will live here.",
  },
  {
    id: "versions",
    label: "Versions",
    empty: "Version history will track how each flow evolves over time.",
  },
];

export default function FlowChartContextPage(): JSX.Element {
  const params = useParams();
  return (
    <ModuleContextView
      prototypeId={params.prototypeId ?? ""}
      moduleLabel="Flow Chart"
      moduleIcon={FlowArrow}
      intro="Map user flows, AI workflows and decision trees for this prototype."
      tabs={TABS}
    />
  );
}
