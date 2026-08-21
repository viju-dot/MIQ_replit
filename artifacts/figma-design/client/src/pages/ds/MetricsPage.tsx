import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";
import {
  MetricsValue,
  MetricsCardContent,
  MetricsTileCompact,
  type MetricsValueProps,
} from "@/components/ds/MetricsTile";

/* ---------------- Playground configs ---------------- *
 * The "Metrics Tile" playground now lives on its own page (MetricsTilePage,
 * slug "metrics-tile"). MetricsValue / MetricsCardContent / MetricsTileCompact
 * come from the shared @/components/ds/MetricsTile component. */

const metricsValueConfig: PlaygroundConfig = {
  name: "Metrics Value",
  scopeId: "metrics/metrics-value",
  description: "The numeric metric display — Small, Regular and Large sizes.",
  controls: [
    {
      kind: "select",
      name: "size",
      label: "Size",
      options: ["Small", "Regular", "Large"],
      defaultValue: "Small",
      asTabs: true,
    },
    {
      kind: "text",
      name: "metricValue",
      label: "Value",
      defaultValue: "8.3% M",
      placeholder: "8.3% M",
    },
  ],
  render: (props) => (
    <MetricsValue
      size={props.size as MetricsValueProps["size"]}
      metricValue={String(props.metricValue)}
    />
  ),
  tokens: {
    "surface/foreground/static/neutral/lvl1":
      "var(--surface-foreground-static-neutral-lvl1)",
    "Headline Sm/Semibold": "var(--headline-sm-semibold-size)",
    "Headline Md/Semibold": "var(--headline-md-semibold-size)",
    "Headline Lg/Semibold": "var(--headline-lg-semibold-size)",
  },
};

const metricsCardContentConfig: PlaygroundConfig = {
  name: "Metrics Card Content",
  scopeId: "metrics/metrics-card-content",
  description:
    "The inner content block of a metrics tile: icon, description, value, name and delta badge.",
  controls: [
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
    <MetricsCardContent
      metricValue={String(props.metricValue)}
      metricsName={String(props.metricsName)}
      descriptionText={String(props.descriptionText)}
      badgeText={String(props.badgeText)}
      bottomText={String(props.bottomText)}
    />
  ),
  tokens: {
    "surface/foreground/static/neutral/lvl3":
      "var(--surface-foreground-static-neutral-lvl3)",
    "surface/foreground/static/neutral/lvl2":
      "var(--surface-foreground-static-neutral-lvl2)",
    "surface/foreground/static/neutral/lvl1":
      "var(--surface-foreground-static-neutral-lvl1)",
    "container/static/success/subtle/background":
      "var(--container-static-success-subtle-background)",
    "container/static/success/subtle/foreground/variation":
      "var(--container-static-success-subtle-foreground-variation)",
    "Radiuses/small": "var(--radiuses-small)",
  },
};

const metricsTileCompactConfig: PlaygroundConfig = {
  name: "Metrics Tile (Compact)",
  scopeId: "metrics/metrics-tile-compact",
  description: "Condensed metrics tile showing only value and a description.",
  controls: [
    {
      kind: "text",
      name: "metricValue",
      label: "Value",
      defaultValue: "8.3% M",
      placeholder: "8.3% M",
    },
    {
      kind: "text",
      name: "descriptionText",
      label: "Description",
      defaultValue: "text description here",
      placeholder: "text description here",
    },
  ],
  render: (props) => (
    <div className="w-[149px]">
      <MetricsTileCompact
        metricValue={String(props.metricValue)}
        descriptionText={String(props.descriptionText)}
      />
    </div>
  ),
  tokens: {
    "container/dynamic/neutral/subtle/background/default/regular":
      "var(--container-dynamic-neutral-subtle-background-default-regular)",
    "border/dynamic/neutral/subtle/default":
      "var(--border-dynamic-neutral-subtle-default)",
    "surface/foreground/static/neutral/lvl1":
      "var(--surface-foreground-static-neutral-lvl1)",
    "surface/foreground/static/neutral/lvl2":
      "var(--surface-foreground-static-neutral-lvl2)",
    "Radiuses/small": "var(--radiuses-small)",
  },
};

export default function MetricsPage() {
  return (
    <section
      aria-label="Metrics component playground"
      className="flex flex-col gap-6"
    >
      <Playground config={metricsValueConfig} />
      <Playground config={metricsCardContentConfig} />
      <Playground config={metricsTileCompactConfig} />
    </section>
  );
}
