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

function MetricsCardContent() {
  return (
    <div className="flex gap-[6px] items-center p-0 relative">
      <div className="flex flex-col gap-[6px] items-start relative shrink-0">
        {/* Top icon */}
        <UsersIcon />
        {/* Context Label Top */}
        <div className="flex gap-0 items-center p-0 relative shrink-0 w-full">
          <div className="flex gap-[8px] items-center p-0 relative shrink-0">
            <p className="[word-break:break-word] font-['DM_Sans'] font-normal leading-[18px] not-italic relative shrink-0 text-[12px] text-[#717180] text-center whitespace-nowrap">
              text description here
            </p>
          </div>
          <UsersIcon />
        </div>
        {/* Value + name */}
        <div className="flex gap-[6px] items-end p-0 relative shrink-0">
          <MetricsValue />
          <div className="flex gap-[8px] items-center pb-[2px] pt-0 px-0 relative shrink-0">
            <p className="[word-break:break-word] font-['DM_Sans'] font-normal leading-[18px] not-italic relative shrink-0 text-[12px] text-[#282833] text-center whitespace-nowrap">
              metrics name here
            </p>
          </div>
        </div>
        {/* Context Label Bottom */}
        <div className="flex gap-0 items-center p-0 relative shrink-0 w-full">
          <div className="flex gap-[8px] items-center relative shrink-0">
            <div className="flex gap-[10px] items-start p-0 relative rounded-[2px] shrink-0">
              <div className="bg-[#e7faef] flex gap-[2px] h-[18px] items-center justify-center px-[3px] py-0 relative rounded-[2px] shrink-0">
                <p className="[word-break:break-word] font-['DM_Sans'] font-medium leading-[18px] not-italic relative shrink-0 text-[12px] text-[#115639] text-center whitespace-nowrap">
                  +2.1%
                </p>
              </div>
            </div>
            <p className="[word-break:break-word] font-['DM_Sans'] font-normal leading-[18px] not-italic relative shrink-0 text-[12px] text-[#282833] text-center whitespace-nowrap">
              text description here
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

function MetricsTile({ state = "Default" }: { state?: MetricsTileState }) {
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
  const badgeText = isDisabled ? "#a8a8b2" : "#115639";
  const bottomText = isDisabled ? "#a8a8b2" : "#282833";

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
              text description here
            </p>
          </div>
          <UsersIcon src={iconSrc} />
        </div>
        {/* Value + name */}
        <div className="flex gap-[6px] items-end p-0 relative shrink-0">
          <MetricsValue color={valueColor} />
          <div className="flex gap-0 items-center pb-[2px] pt-0 px-0 relative shrink-0">
            <p
              className="[word-break:break-word] font-['DM_Sans'] font-normal leading-[18px] not-italic relative shrink-0 text-[12px] text-center whitespace-nowrap"
              style={{ color: nameColor }}
            >
              metrics name here
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
                  style={{ color: badgeText }}
                >
                  +2.1%
                </p>
              </div>
            </div>
            <p
              className="[word-break:break-word] font-['DM_Sans'] font-normal leading-[18px] not-italic relative shrink-0 text-[12px] text-center whitespace-nowrap"
              style={{ color: bottomText }}
            >
              text description here
            </p>
          </div>
          <UsersIcon src={iconSrc} />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Compact Metrics Tile instance ---------------- */

function MetricsTileCompact() {
  return (
    <div className="bg-white border border-[#c6c6cc] border-solid flex gap-[6px] items-center p-[16px] relative rounded-[2px]">
      <div className="flex flex-col gap-[6px] items-start p-0 relative shrink-0">
        <div className="flex gap-[6px] items-end p-0 relative shrink-0">
          <div className="flex items-center justify-center relative shrink-0">
            <p className="[word-break:break-word] font-['DM_Sans'] font-semibold leading-[28px] not-italic relative shrink-0 text-[20px] text-[#13131a] text-center tracking-[-0.2px] w-[68px]">
              8.3% M
            </p>
          </div>
        </div>
        <div className="flex gap-0 items-center p-0 relative shrink-0 w-full">
          <div className="flex gap-[8px] items-center p-0 relative shrink-0">
            <p className="[word-break:break-word] font-['DM_Sans'] font-normal leading-[18px] not-italic relative shrink-0 text-[12px] text-[#282833] text-center whitespace-nowrap">
              text description here
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Helpers ---------------- */

function Caption({ children }: { children: React.ReactNode }) {
  return <span className="text-[12px] text-[#a8a8b2]">{children}</span>;
}

const cardClass =
  "rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5";

export default function MetricsPage() {
  return (
    <section className="flex flex-col gap-6">
      {/* Metrics Value */}
      <div className={cardClass}>
        <div className="mb-3 text-[12px] font-medium text-[#717180]">
          Metrics Value
        </div>
        <div className="flex flex-wrap gap-10">
          <div className="flex flex-col gap-1">
            <Caption>Small</Caption>
            <MetricsValue size="Small" />
          </div>
          <div className="flex flex-col gap-1">
            <Caption>Regular</Caption>
            <MetricsValue size="Regular" />
          </div>
          <div className="flex flex-col gap-1">
            <Caption>Large</Caption>
            <MetricsValue size="Large" />
          </div>
        </div>
      </div>

      {/* Metrics Card Content */}
      <div className={cardClass}>
        <div className="mb-3 text-[12px] font-medium text-[#717180]">
          Metrics Card Content
        </div>
        <div className="flex flex-wrap gap-10">
          <div className="flex flex-col gap-1">
            <Caption>Type=Default</Caption>
            <MetricsCardContent />
          </div>
        </div>
      </div>

      {/* Metrics Tile */}
      <div className={cardClass}>
        <div className="mb-3 text-[12px] font-medium text-[#717180]">
          Metrics tile
        </div>
        <div className="flex flex-wrap items-start gap-10">
          <div className="flex flex-col gap-1">
            <Caption>State=Default</Caption>
            <MetricsTile state="Default" />
          </div>
          <div className="flex flex-col gap-1">
            <Caption>State=Hover</Caption>
            <MetricsTile state="Hover" />
          </div>
          <div className="flex flex-col gap-1">
            <Caption>State=Selected</Caption>
            <MetricsTile state="Selected" />
          </div>
          <div className="flex flex-col gap-1">
            <Caption>State=Disabled</Caption>
            <MetricsTile state="Disabled" />
          </div>
        </div>
      </div>

      {/* Compact Metrics Tile instance */}
      <div className={cardClass}>
        <div className="mb-3 text-[12px] font-medium text-[#717180]">
          Metrics tile (compact)
        </div>
        <div className="flex flex-wrap items-start gap-10">
          <div className="flex flex-col gap-1">
            <Caption>Value + label</Caption>
            <div className="w-[149px]">
              <MetricsTileCompact />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
