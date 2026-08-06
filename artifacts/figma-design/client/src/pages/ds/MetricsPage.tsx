import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

const imgUsersThree = "/figmaAssets/metrics/users-three.svg";
const imgUsersThreeDisabled = "/figmaAssets/metrics/users-three-disabled.svg";

function UsersIcon({ src = imgUsersThree }: { src?: string }) {
  return (
    <div className="flex flex-col gap-0 items-center justify-center px-0 py-[2px] relative shrink-0 size-[24px]">
      <div className="h-[16.527px] relative shrink-0 w-[22.503px]">
        <img
          alt=""
          className="absolute block inset-0 max-w-none size-full"
          src={src}
        />
      </div>
    </div>
  );
}

/* ---------------- Metrics Value ---------------- */

type MetricsValueProps = {
  metricValue?: string;
  size?: "Small" | "Regular" | "Large";
  color?: string;
};

function MetricsValue({
  metricValue = "8.3% M",
  size = "Small",
  color = "var(--surface-foreground-static-neutral-lvl1, #13131a)",
}: MetricsValueProps) {
  if (size === "Regular") {
    return (
      <div className="flex items-center justify-center relative">
        <p
          className="[word-break:break-word] font-[var(--headline-md-semibold-family,'DM_Sans')] font-semibold leading-[var(--headline-md-semibold-line-height,32px)] not-italic relative shrink-0 text-[length:var(--headline-md-semibold-size,24px)] text-center tracking-[-0.36px] whitespace-nowrap"
          style={{ color }}
        >
          {metricValue}
        </p>
      </div>
    );
  }
  if (size === "Large") {
    return (
      <div className="flex items-center justify-center relative">
        <p
          className="[word-break:break-word] font-[var(--headline-lg-semibold-family,'DM_Sans')] font-semibold leading-[var(--headline-lg-semibold-line-height,36px)] not-italic relative shrink-0 text-[length:var(--headline-lg-semibold-size,28px)] text-center tracking-[-0.56px] whitespace-nowrap"
          style={{ color }}
        >
          {metricValue}
        </p>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center relative">
      <p
        className="[word-break:break-word] font-[var(--headline-sm-semibold-family,'DM_Sans')] font-semibold leading-[var(--headline-sm-semibold-line-height,28px)] not-italic relative shrink-0 text-[length:var(--headline-sm-semibold-size,20px)] text-center tracking-[-0.2px] w-[68px]"
        style={{ color }}
      >
        {metricValue}
      </p>
    </div>
  );
}

/* ---------------- Metrics Card Content ---------------- */

function MetricsCardContent({
  descriptionText = "text description here",
  metricsName = "metrics name here",
  metricValue = "8.3% M",
  badgeText = "+2.1%",
  bottomText = "text description here",
}: {
  descriptionText?: string;
  metricsName?: string;
  metricValue?: string;
  badgeText?: string;
  bottomText?: string;
}) {
  return (
    <div className="flex gap-[var(--spacing-75,6px)] items-center p-0 relative">
      <div className="flex flex-col gap-[var(--spacing-75,6px)] items-start relative shrink-0">
        {/* Top icon */}
        <UsersIcon />
        {/* Context Label Top */}
        <div className="flex gap-0 items-center p-0 relative shrink-0 w-full">
          <div className="flex gap-[var(--spacing-100,8px)] items-center p-0 relative shrink-0">
            <p className="[word-break:break-word] font-[var(--body-sm-regular-family,'DM_Sans')] font-normal leading-[var(--body-sm-regular-line-height,18px)] not-italic relative shrink-0 text-[length:var(--body-sm-regular-size,12px)] text-[var(--surface-foreground-static-neutral-lvl3,#717180)] text-center whitespace-nowrap">
              {descriptionText}
            </p>
          </div>
          <UsersIcon />
        </div>
        {/* Value + name */}
        <div className="flex gap-[var(--spacing-75,6px)] items-end p-0 relative shrink-0">
          <MetricsValue metricValue={metricValue} />
          <div className="flex gap-[var(--spacing-100,8px)] items-center pb-[var(--spacing-25,2px)] pt-0 px-0 relative shrink-0">
            <p className="[word-break:break-word] font-[var(--body-sm-regular-family,'DM_Sans')] font-normal leading-[var(--body-sm-regular-line-height,18px)] not-italic relative shrink-0 text-[length:var(--body-sm-regular-size,12px)] text-[var(--surface-foreground-static-neutral-lvl2,#282833)] text-center whitespace-nowrap">
              {metricsName}
            </p>
          </div>
        </div>
        {/* Context Label Bottom */}
        <div className="flex gap-0 items-center p-0 relative shrink-0 w-full">
          <div className="flex gap-[var(--spacing-100,8px)] items-center relative shrink-0">
            <div className="flex gap-[var(--odd-numbers-10,10px)] items-start p-0 relative rounded-[var(--radiuses-small,2px)] shrink-0">
              <div className="bg-[var(--container-static-success-subtle-background,#e7faef)] flex gap-[var(--spacing-25,2px)] h-[var(--old-sizing-18,18px)] items-center justify-center px-[var(--odd-numbers-3,3px)] py-0 relative rounded-[var(--radiuses-small,2px)] shrink-0">
                <p className="[word-break:break-word] font-[var(--body-sm-medium-family,'DM_Sans')] font-medium leading-[var(--body-sm-medium-line-height,18px)] not-italic relative shrink-0 text-[length:var(--body-sm-medium-size,12px)] text-[var(--container-static-success-subtle-foreground-variation,#115639)] text-center whitespace-nowrap">
                  {badgeText}
                </p>
              </div>
            </div>
            <p className="[word-break:break-word] font-[var(--body-sm-regular-family,'DM_Sans')] font-normal leading-[var(--body-sm-regular-line-height,18px)] not-italic relative shrink-0 text-[length:var(--body-sm-regular-size,12px)] text-[var(--surface-foreground-static-neutral-lvl2,#282833)] text-center whitespace-nowrap">
              {bottomText}
            </p>
          </div>
          <UsersIcon />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Metrics Tile ---------------- */

type MetricsTileState = "Default" | "Hover" | "Selected" | "Disabled";

function MetricsTile({
  state = "Default",
  descriptionText = "text description here",
  metricsName = "metrics name here",
  metricValue = "8.3% M",
  badgeText = "+2.1%",
  bottomText = "text description here",
}: {
  state?: MetricsTileState;
  descriptionText?: string;
  metricsName?: string;
  metricValue?: string;
  badgeText?: string;
  bottomText?: string;
}) {
  const isDisabled = state === "Disabled";
  const isSelected = state === "Selected";
  const isHover = state === "Hover";

  let containerStyle: React.CSSProperties;
  if (isSelected) {
    containerStyle = {
      backgroundColor:
        "var(--container-dynamic-neutral-subtle-background-default-regular, #ffffff)",
      borderColor: "var(--border-dynamic-brand-selected, #7c33b5)",
    };
  } else if (isDisabled) {
    containerStyle = {
      backgroundColor:
        "var(--container-dynamic-neutral-subtle-background-disabled, rgba(113,113,128,0.1))",
      borderColor: "var(--border-dynamic-neutral-subtle-default, #c6c6cc)",
    };
  } else if (isHover) {
    containerStyle = {
      backgroundColor:
        "var(--container-dynamic-neutral-subtle-background-hover, rgba(113,113,128,0.08))",
      borderColor: "var(--border-dynamic-neutral-subtle-default, #c6c6cc)",
    };
  } else {
    containerStyle = {
      backgroundColor:
        "var(--container-dynamic-neutral-subtle-background-default-regular, #ffffff)",
      borderColor: "var(--border-dynamic-neutral-subtle-default, #c6c6cc)",
    };
  }

  const iconSrc = isDisabled ? imgUsersThreeDisabled : imgUsersThree;
  const labelTopColor = isDisabled
    ? "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)"
    : "var(--surface-foreground-static-neutral-lvl3, #717180)";
  const nameColor = isDisabled
    ? "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)"
    : "var(--surface-foreground-static-neutral-lvl2, #282833)";
  const valueColor = isDisabled
    ? "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)"
    : "var(--surface-foreground-static-neutral-lvl1, #13131a)";
  const badgeBg = isDisabled
    ? "var(--container-dynamic-neutral-subtle-background-disabled, rgba(113,113,128,0.1))"
    : "var(--container-static-success-subtle-background, #e7faef)";
  const badgeTextColor = isDisabled
    ? "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)"
    : "var(--container-static-success-subtle-foreground-variation, #115639)";
  const bottomTextColor = isDisabled
    ? "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)"
    : "var(--surface-foreground-static-neutral-lvl2, #282833)";

  return (
    <div
      className="border border-solid flex gap-[var(--spacing-75,6px)] items-center p-[var(--spacing-200,16px)] relative rounded-[var(--radiuses-small,2px)]"
      style={containerStyle}
    >
      <div className="flex flex-col gap-[var(--spacing-75,6px)] items-start p-0 relative shrink-0">
        {/* Top icon */}
        <UsersIcon src={iconSrc} />
        {/* Context Label Top */}
        <div className="flex gap-0 items-center p-0 relative shrink-0 w-full">
          <div className="flex gap-[var(--spacing-100,8px)] items-center relative shrink-0">
            <p
              className="[word-break:break-word] font-[var(--body-sm-regular-family,'DM_Sans')] font-normal leading-[var(--body-sm-regular-line-height,18px)] not-italic relative shrink-0 text-[length:var(--body-sm-regular-size,12px)] text-center whitespace-nowrap"
              style={{ color: labelTopColor }}
            >
              {descriptionText}
            </p>
          </div>
          <UsersIcon src={iconSrc} />
        </div>
        {/* Value + name */}
        <div className="flex gap-[var(--spacing-75,6px)] items-end p-0 relative shrink-0">
          <MetricsValue color={valueColor} metricValue={metricValue} />
          <div className="flex gap-0 items-center pb-[var(--spacing-25,2px)] pt-0 px-0 relative shrink-0">
            <p
              className="[word-break:break-word] font-[var(--body-sm-regular-family,'DM_Sans')] font-normal leading-[var(--body-sm-regular-line-height,18px)] not-italic relative shrink-0 text-[length:var(--body-sm-regular-size,12px)] text-center whitespace-nowrap"
              style={{ color: nameColor }}
            >
              {metricsName}
            </p>
          </div>
        </div>
        {/* Context Label Bottom */}
        <div className="flex gap-0 items-center p-0 relative shrink-0 w-full">
          <div className="flex gap-[var(--spacing-100,8px)] items-center p-0 relative shrink-0">
            <div className="flex gap-[var(--odd-numbers-10,10px)] items-start relative rounded-[var(--radiuses-small,2px)] shrink-0">
              <div
                className="flex gap-[var(--spacing-25,2px)] h-[var(--old-sizing-18,18px)] items-center justify-center px-[var(--odd-numbers-3,3px)] py-0 relative rounded-[var(--radiuses-small,2px)] shrink-0"
                style={{ backgroundColor: badgeBg }}
              >
                <p
                  className="[word-break:break-word] font-[var(--body-sm-medium-family,'DM_Sans')] font-medium leading-[var(--body-sm-medium-line-height,18px)] not-italic relative shrink-0 text-[length:var(--body-sm-medium-size,12px)] text-center whitespace-nowrap"
                  style={{ color: badgeTextColor }}
                >
                  {badgeText}
                </p>
              </div>
            </div>
            <p
              className="[word-break:break-word] font-[var(--body-sm-regular-family,'DM_Sans')] font-normal leading-[var(--body-sm-regular-line-height,18px)] not-italic relative shrink-0 text-[length:var(--body-sm-regular-size,12px)] text-center whitespace-nowrap"
              style={{ color: bottomTextColor }}
            >
              {bottomText}
            </p>
          </div>
          <UsersIcon src={iconSrc} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Compact Metrics Tile instance ---------------- */

function MetricsTileCompact({
  metricValue = "8.3% M",
  descriptionText = "text description here",
}: {
  metricValue?: string;
  descriptionText?: string;
}) {
  return (
    <div className="bg-[var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)] border border-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)] border-solid flex gap-[var(--spacing-75,6px)] items-center p-[var(--spacing-200,16px)] relative rounded-[var(--radiuses-small,2px)]">
      <div className="flex flex-col gap-[var(--spacing-75,6px)] items-start p-0 relative shrink-0">
        <div className="flex gap-[var(--spacing-75,6px)] items-end p-0 relative shrink-0">
          <div className="flex items-center justify-center relative shrink-0">
            <p className="[word-break:break-word] font-[var(--headline-sm-semibold-family,'DM_Sans')] font-semibold leading-[var(--headline-sm-semibold-line-height,28px)] not-italic relative shrink-0 text-[length:var(--headline-sm-semibold-size,20px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] text-center tracking-[-0.2px] w-[68px]">
              {metricValue}
            </p>
          </div>
        </div>
        <div className="flex gap-0 items-center p-0 relative shrink-0 w-full">
          <div className="flex gap-[var(--spacing-100,8px)] items-center p-0 relative shrink-0">
            <p className="[word-break:break-word] font-[var(--body-sm-regular-family,'DM_Sans')] font-normal leading-[var(--body-sm-regular-line-height,18px)] not-italic relative shrink-0 text-[length:var(--body-sm-regular-size,12px)] text-[var(--surface-foreground-static-neutral-lvl2,#282833)] text-center whitespace-nowrap">
              {descriptionText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Playground configs ---------------- */

const metricsValueConfig: PlaygroundConfig = {
  name: "Metrics Value",
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

const metricsTileConfig: PlaygroundConfig = {
  name: "Metrics Tile",
  description:
    "Selectable metrics card with Default, Hover, Selected and Disabled states.",
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
    "border/dynamic/neutral/subtle/default":
      "var(--border-dynamic-neutral-subtle-default)",
    "container/dynamic/neutral/subtle/background/hover":
      "var(--container-dynamic-neutral-subtle-background-hover)",
    "border/dynamic/brand/selected": "var(--border-dynamic-brand-selected)",
    "container/dynamic/neutral/subtle/background/disabled":
      "var(--container-dynamic-neutral-subtle-background-disabled)",
    "surface/foreground/dynamic/neutral/disabled":
      "var(--surface-foreground-dynamic-neutral-disabled)",
    "Radiuses/small": "var(--radiuses-small)",
    "spacing/200": "var(--spacing-200)",
  },
};

const metricsTileCompactConfig: PlaygroundConfig = {
  name: "Metrics Tile (Compact)",
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
      <Playground config={metricsTileConfig} />
      <Playground config={metricsTileCompactConfig} />
    </section>
  );
}
