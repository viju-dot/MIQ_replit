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
  color = "#13131a",
}: MetricsValueProps) {
  if (size === "Regular") {
    return (
      <div className="flex items-center justify-center relative">
        <p
          className="[word-break:break-word] font-['DM_Sans'] font-semibold leading-[32px] not-italic relative shrink-0 text-[24px] text-center tracking-[-0.36px] whitespace-nowrap"
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
          className="[word-break:break-word] font-['DM_Sans'] font-semibold leading-[36px] not-italic relative shrink-0 text-[28px] text-center tracking-[-0.56px] whitespace-nowrap"
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
        className="[word-break:break-word] font-['DM_Sans'] font-semibold leading-[28px] not-italic relative shrink-0 text-[20px] text-center tracking-[-0.2px] w-[68px]"
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
    <div className="flex gap-[6px] items-center p-0 relative">
      <div className="flex flex-col gap-[6px] items-start relative shrink-0">
        {/* Top icon */}
        <UsersIcon />
        {/* Context Label Top */}
        <div className="flex gap-0 items-center p-0 relative shrink-0 w-full">
          <div className="flex gap-[8px] items-center p-0 relative shrink-0">
            <p className="[word-break:break-word] font-['DM_Sans'] font-normal leading-[18px] not-italic relative shrink-0 text-[12px] text-[#717180] text-center whitespace-nowrap">
              {descriptionText}
            </p>
          </div>
          <UsersIcon />
        </div>
        {/* Value + name */}
        <div className="flex gap-[6px] items-end p-0 relative shrink-0">
          <MetricsValue metricValue={metricValue} />
          <div className="flex gap-[8px] items-center pb-[2px] pt-0 px-0 relative shrink-0">
            <p className="[word-break:break-word] font-['DM_Sans'] font-normal leading-[18px] not-italic relative shrink-0 text-[12px] text-[#282833] text-center whitespace-nowrap">
              {metricsName}
            </p>
          </div>
        </div>
        {/* Context Label Bottom */}
        <div className="flex gap-0 items-center p-0 relative shrink-0 w-full">
          <div className="flex gap-[8px] items-center relative shrink-0">
            <div className="flex gap-[10px] items-start p-0 relative rounded-[2px] shrink-0">
              <div className="bg-[#e7faef] flex gap-[2px] h-[18px] items-center justify-center px-[3px] py-0 relative rounded-[2px] shrink-0">
                <p className="[word-break:break-word] font-['DM_Sans'] font-medium leading-[18px] not-italic relative shrink-0 text-[12px] text-[#115639] text-center whitespace-nowrap">
                  {badgeText}
                </p>
              </div>
            </div>
            <p className="[word-break:break-word] font-['DM_Sans'] font-normal leading-[18px] not-italic relative shrink-0 text-[12px] text-[#282833] text-center whitespace-nowrap">
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
    containerStyle = { backgroundColor: "white", borderColor: "#7c33b5" };
  } else if (isDisabled) {
    containerStyle = {
      backgroundColor: "rgba(113,113,128,0.1)",
      borderColor: "#c6c6cc",
    };
  } else if (isHover) {
    containerStyle = {
      backgroundColor: "rgba(113,113,128,0.08)",
      borderColor: "#c6c6cc",
    };
  } else {
    containerStyle = { backgroundColor: "white", borderColor: "#c6c6cc" };
  }

  const iconSrc = isDisabled ? imgUsersThreeDisabled : imgUsersThree;
  const labelTopColor = isDisabled ? "#a8a8b2" : "#717180";
  const nameColor = isDisabled ? "#a8a8b2" : "#282833";
  const valueColor = isDisabled ? "#a8a8b2" : "#13131a";
  const badgeBg = isDisabled ? "rgba(113,113,128,0.1)" : "#e7faef";
  const badgeTextColor = isDisabled ? "#a8a8b2" : "#115639";
  const bottomTextColor = isDisabled ? "#a8a8b2" : "#282833";

  return (
    <div
      className="border border-solid flex gap-[6px] items-center p-[16px] relative rounded-[2px]"
      style={containerStyle}
    >
      <div className="flex flex-col gap-[6px] items-start p-0 relative shrink-0">
        {/* Top icon */}
        <UsersIcon src={iconSrc} />
        {/* Context Label Top */}
        <div className="flex gap-0 items-center p-0 relative shrink-0 w-full">
          <div className="flex gap-[8px] items-center relative shrink-0">
            <p
              className="[word-break:break-word] font-['DM_Sans'] font-normal leading-[18px] not-italic relative shrink-0 text-[12px] text-center whitespace-nowrap"
              style={{ color: labelTopColor }}
            >
              {descriptionText}
            </p>
          </div>
          <UsersIcon src={iconSrc} />
        </div>
        {/* Value + name */}
        <div className="flex gap-[6px] items-end p-0 relative shrink-0">
          <MetricsValue color={valueColor} metricValue={metricValue} />
          <div className="flex gap-0 items-center pb-[2px] pt-0 px-0 relative shrink-0">
            <p
              className="[word-break:break-word] font-['DM_Sans'] font-normal leading-[18px] not-italic relative shrink-0 text-[12px] text-center whitespace-nowrap"
              style={{ color: nameColor }}
            >
              {metricsName}
            </p>
          </div>
        </div>
        {/* Context Label Bottom */}
        <div className="flex gap-0 items-center p-0 relative shrink-0 w-full">
          <div className="flex gap-[8px] items-center p-0 relative shrink-0">
            <div className="flex gap-[10px] items-start relative rounded-[2px] shrink-0">
              <div
                className="flex gap-[2px] h-[18px] items-center justify-center px-[3px] py-0 relative rounded-[2px] shrink-0"
                style={{ backgroundColor: badgeBg }}
              >
                <p
                  className="[word-break:break-word] font-['DM_Sans'] font-medium leading-[18px] not-italic relative shrink-0 text-[12px] text-center whitespace-nowrap"
                  style={{ color: badgeTextColor }}
                >
                  {badgeText}
                </p>
              </div>
            </div>
            <p
              className="[word-break:break-word] font-['DM_Sans'] font-normal leading-[18px] not-italic relative shrink-0 text-[12px] text-center whitespace-nowrap"
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
    <div className="bg-white border border-[#c6c6cc] border-solid flex gap-[6px] items-center p-[16px] relative rounded-[2px]">
      <div className="flex flex-col gap-[6px] items-start p-0 relative shrink-0">
        <div className="flex gap-[6px] items-end p-0 relative shrink-0">
          <div className="flex items-center justify-center relative shrink-0">
            <p className="[word-break:break-word] font-['DM_Sans'] font-semibold leading-[28px] not-italic relative shrink-0 text-[20px] text-[#13131a] text-center tracking-[-0.2px] w-[68px]">
              {metricValue}
            </p>
          </div>
        </div>
        <div className="flex gap-0 items-center p-0 relative shrink-0 w-full">
          <div className="flex gap-[8px] items-center p-0 relative shrink-0">
            <p className="[word-break:break-word] font-['DM_Sans'] font-normal leading-[18px] not-italic relative shrink-0 text-[12px] text-[#282833] text-center whitespace-nowrap">
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
    "text/default/bold": "#13131a",
    "size/small": "20px / lh 28px / tracking -0.2px",
    "size/regular": "24px / lh 32px / tracking -0.36px",
    "size/large": "28px / lh 36px / tracking -0.56px",
    "font/family": "DM Sans",
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
    "text/description": "#717180",
    "text/name": "#282833",
    "text/value": "#13131a",
    "badge/positive/background": "#e7faef",
    "badge/positive/text": "#115639",
    "radius/badge": "2px",
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
    "container/default/background": "#ffffff",
    "container/default/border": "#c6c6cc",
    "container/hover/background": "rgba(113,113,128,0.08)",
    "container/selected/border": "#7c33b5",
    "container/disabled/background": "rgba(113,113,128,0.1)",
    "text/disabled": "#a8a8b2",
    "radius/tile": "2px",
    "padding/tile": "16px",
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
    "container/background": "#ffffff",
    "container/border": "#c6c6cc",
    "text/value": "#13131a",
    "text/description": "#282833",
    "radius/tile": "2px",
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
