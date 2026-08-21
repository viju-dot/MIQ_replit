import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";
import { MetricsTile, type MetricsTileState } from "@/components/ds/MetricsTile";

/* The "Metrics Tile" playground — the full DS tile with Default / Hover /
 * Selected / Disabled states. The component lives in the shared
 * @/components/ds/MetricsTile module so product prototypes reuse it. */

const metricsTileConfig: PlaygroundConfig = {
  name: "Metrics Tile",
  scopeId: "metrics-tile/metrics-tile",
  description:
    "The full metrics tile card with icon, description, value, name and delta badge across Default, Hover, Selected and Disabled states.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Default", "Hover", "Selected", "Disabled"],
      defaultValue: "Default",
      asTabs: true,
    },
    {
      kind: "text",
      name: "metricValue",
      label: "Value",
      defaultValue: "8.3% M",
      placeholder: "8.3% M",
    },
    {
      kind: "text",
      name: "metricsName",
      label: "Metrics name",
      defaultValue: "metrics name here",
      placeholder: "metrics name here",
    },
    {
      kind: "text",
      name: "descriptionText",
      label: "Description",
      defaultValue: "text description here",
      placeholder: "text description here",
    },
    {
      kind: "text",
      name: "badgeText",
      label: "Delta badge",
      defaultValue: "+2.1%",
      placeholder: "+2.1%",
    },
    {
      kind: "text",
      name: "bottomText",
      label: "Bottom description",
      defaultValue: "text description here",
      placeholder: "text description here",
    },
  ],
  render: (props) => (
    <MetricsTile
      state={props.state as MetricsTileState}
      metricValue={String(props.metricValue)}
      metricsName={String(props.metricsName)}
      descriptionText={String(props.descriptionText)}
      badgeText={String(props.badgeText)}
      bottomText={String(props.bottomText)}
    />
  ),
  tokens: {
    "container/dynamic/neutral/subtle/background/default/regular":
      "var(--container-dynamic-neutral-subtle-background-default-regular)",
    "container/dynamic/neutral/subtle/background/hover":
      "var(--container-dynamic-neutral-subtle-background-hover)",
    "container/dynamic/neutral/subtle/background/disabled":
      "var(--container-dynamic-neutral-subtle-background-disabled)",
    "border/dynamic/neutral/subtle/default":
      "var(--border-dynamic-neutral-subtle-default)",
    "border/dynamic/brand/selected": "var(--border-dynamic-brand-selected)",
    "container/static/success/subtle/background":
      "var(--container-static-success-subtle-background)",
    "container/static/success/subtle/foreground/variation":
      "var(--container-static-success-subtle-foreground-variation)",
    "Radiuses/small": "var(--radiuses-small)",
  },
};

export default function MetricsTilePage() {
  return (
    <section
      aria-label="Metrics Tile component playground"
      className="flex flex-col gap-6"
    >
      <Playground config={metricsTileConfig} />
    </section>
  );
}
