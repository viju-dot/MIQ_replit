import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

type ChipState =
  | "Default"
  | "Default-Hover"
  | "Selected"
  | "Selected-Hover"
  | "Disabled";
type ChipSize = "Large" | "Small";
type ChipStatus =
  | "Primary"
  | "All"
  | "Danger"
  | "Warning"
  | "Info"
  | "Success";

type ChipProps = {
  state?: ChipState;
  size?: ChipSize;
  status?: ChipStatus;
  action?: boolean;
  menu?: boolean;
  label?: string;
};

const ICON_BY_STATUS: Record<ChipStatus, { lg: string; sm: string }> = {
  Primary: { lg: "circle-lg", sm: "circle-default" },
  All: { lg: "circle-lg", sm: "circle-default" },
  Danger: { lg: "close-danger-lg", sm: "close-danger-sm" },
  Warning: { lg: "warning-lg", sm: "warning-sm" },
  Info: { lg: "info-lg", sm: "info-sm" },
  Success: { lg: "success-lg", sm: "success-sm" },
};

function Chip({
  state = "Default",
  size = "Large",
  status = "All",
  action = true,
  menu = false,
  label = "3 campaign budget changes",
}: ChipProps) {
  const isLarge = size === "Large";
  const selected = state === "Selected" || state === "Selected-Hover";
  const hover = state === "Default-Hover" || state === "Selected-Hover";
  const disabled = state === "Disabled";

  // Container background / border
  let bgClass = "bg-white";
  let borderStyle = "1px solid #c6c6cc";
  let textColor = "#13131a";

  if (disabled) {
    bgClass = "bg-[rgba(113,113,128,0.1)]";
    borderStyle = "1px solid transparent";
    textColor = "#a8a8b2";
  } else if (selected) {
    bgClass = "bg-[#f6ebff]";
    borderStyle = "1px solid #7c33b5";
    textColor = "#7c33b5";
    if (state === "Selected-Hover") {
      bgClass = "bg-[#efdcff]";
    }
  } else if (hover) {
    bgClass = "bg-[rgba(113,113,128,0.08)]";
  }

  const iconName = ICON_BY_STATUS[status];
  const iconSrc = `/figmaAssets/chip/${isLarge ? iconName.lg : iconName.sm}.svg`;

  return (
    <div
      className={`inline-flex items-center justify-center rounded-[40px] ${bgClass} ${
        isLarge ? "h-[34px] px-3 py-0.5" : "h-6 px-2 py-0.5"
      }`}
      style={{ border: borderStyle, gap: "4px" }}
      data-name={`State=${state}, Status=${status}, Size=${size}, Menu=${menu ? "Yes" : "No"}`}
    >
      <div className="flex shrink-0 items-center justify-center gap-1">
        {action && (
          <span
            className={`flex shrink-0 items-center justify-center ${
              isLarge ? "size-6" : "size-4"
            }`}
          >
            <img
              alt=""
              className={`block max-w-none ${isLarge ? "size-[19.5px]" : "size-[13px]"}`}
              src={iconSrc}
              style={{
                opacity: disabled ? 0.6 : 1,
                filter: selected
                  ? "invert(24%) sepia(63%) saturate(2200%) hue-rotate(258deg) brightness(70%) contrast(95%)"
                  : undefined,
              }}
            />
          </span>
        )}
        <span
          className="whitespace-nowrap font-['DM_Sans',Helvetica] font-medium"
          style={{
            color: textColor,
            fontSize: isLarge ? "14px" : "12px",
            lineHeight: isLarge ? "20px" : "18px",
          }}
        >
          {label}
        </span>
      </div>
      {menu && (
        <>
          <span
            aria-hidden
            className="shrink-0 self-stretch"
            style={{
              width: "1px",
              backgroundColor: disabled ? "#d3d3d8" : "#e1e1e8",
              margin: "4px 0",
            }}
          />
          <span
            className={`flex shrink-0 items-center justify-center ${
              isLarge ? "size-6" : "size-4"
            }`}
          >
            <img
              alt="Menu"
              className={`block max-w-none ${isLarge ? "size-6" : "size-4"}`}
              src="/figmaAssets/chip/dots-three-vertical.svg"
              style={{ opacity: disabled ? 0.6 : 1 }}
            />
          </span>
        </>
      )}
    </div>
  );
}

const CHIP_STATES: ChipState[] = [
  "Default",
  "Default-Hover",
  "Selected",
  "Selected-Hover",
  "Disabled",
];
const CHIP_STATUSES: ChipStatus[] = [
  "All",
  "Danger",
  "Warning",
  "Info",
  "Success",
];

const chipConfig: PlaygroundConfig = {
  name: "Chip",
  description:
    "Chips let users make single or multiple selections from a set of items. Explore size, status, state, editable label and the optional menu affordance.",
  controls: [
    {
      kind: "select",
      name: "size",
      label: "Size",
      options: ["Large", "Small"],
      defaultValue: "Large",
      asTabs: true,
    },
    {
      kind: "select",
      name: "status",
      label: "Status",
      options: CHIP_STATUSES,
      defaultValue: "Danger",
    },
    {
      kind: "select",
      name: "state",
      label: "State",
      options: CHIP_STATES,
      defaultValue: "Default",
    },
    { kind: "boolean", name: "action", label: "Show icon", defaultValue: true },
    { kind: "boolean", name: "menu", label: "Menu", defaultValue: false },
    {
      kind: "text",
      name: "label",
      label: "Label",
      defaultValue: "3 campaign budget changes",
      placeholder: "Chip label",
    },
  ],
  render: (props: PropValues) => (
    <Chip
      size={props.size as ChipSize}
      status={props.status as ChipStatus}
      state={props.state as ChipState}
      action={props.action === true}
      menu={props.menu === true}
      label={String(props.label)}
    />
  ),
  tokens: {
    "container/default/background": "#ffffff",
    "container/default/border": "#c6c6cc",
    "container/hover/background": "rgba(113,113,128,0.08)",
    "container/selected/background": "#f6ebff",
    "container/selected/background/hover": "#efdcff",
    "container/selected/border": "#7c33b5",
    "container/disabled/background": "rgba(113,113,128,0.1)",
    "text/default": "#13131a",
    "text/selected": "#7c33b5",
    "text/disabled": "#a8a8b2",
    "divider/default": "#e1e1e8",
    "divider/disabled": "#d3d3d8",
    "radius/container": "40px",
    "size/large": "34px (text 14/20)",
    "size/small": "24px (text 12/18)",
    "gap/content": "4px",
  },
};

export default function ChipPage(): JSX.Element {
  return (
    <section aria-label="Chip component playground" className="flex flex-col gap-6">
      <Playground config={chipConfig} />
    </section>
  );
}
