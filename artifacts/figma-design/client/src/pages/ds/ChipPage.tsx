import { useEffect, useState } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

// Focus ring via inline boxShadow (var() in Tailwind arbitrary ring classes
// silently fails in this project, so it is driven from focus-visible state).
const FOCUS_RING =
  "0 0 0 2px var(--surface-background-lvl1,#ffffff), 0 0 0 4px var(--border-dynamic-brand-selected,#7c33b5)";

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
  const baseState = state;
  const disabled = baseState === "Disabled";

  // State-resolution policy: a panel-forced state (Selected / *-Hover) stays
  // forced during live interaction. Natural interaction (click-to-toggle,
  // pointer hover) only derives states when the panel base is "Default".
  // Disabled always wins and suppresses hover/click.
  const isDefaultBase = baseState === "Default";
  const baseSelected = baseState === "Selected" || baseState === "Selected-Hover";
  const baseHover = baseState === "Default-Hover" || baseState === "Selected-Hover";

  const [selectedState, setSelectedState] = useState(false);
  const [pointerHover, setPointerHover] = useState(false);
  const [focused, setFocused] = useState(false);
  // Reset local interaction whenever the panel base changes.
  useEffect(() => {
    setSelectedState(false);
    setPointerHover(false);
  }, [baseState]);

  const selected = disabled
    ? false
    : isDefaultBase
      ? selectedState
      : baseSelected;
  const hover = disabled
    ? false
    : isDefaultBase
      ? pointerHover
      : baseHover;

  // Recompose the effective ChipState so all downstream styling is derived
  // from the same Figma variant logic.
  state = disabled
    ? "Disabled"
    : selected
      ? hover
        ? "Selected-Hover"
        : "Selected"
      : hover
        ? "Default-Hover"
        : "Default";

  // Container background / border
  let bgClass =
    "bg-[var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)]";
  let borderStyle =
    "1px solid var(--border-dynamic-neutral-subtle-default,#c6c6cc)";
  let textColor =
    "var(--container-dynamic-neutral-subtle-foreground-default-variation,#13131a)";

  if (disabled) {
    bgClass =
      "bg-[var(--container-dynamic-neutral-subtle-background-disabled,rgba(113,113,128,0.1))]";
    borderStyle = "1px solid transparent";
    textColor =
      "var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)";
  } else if (selected) {
    bgClass =
      "bg-[var(--container-dynamic-brand-subtle-background-selected,#f6ebff)]";
    borderStyle = "1px solid var(--border-dynamic-brand-selected,#7c33b5)";
    textColor =
      "var(--container-dynamic-brand-subtle-foreground-delected,#7c33b5)";
    if (state === "Selected-Hover") {
      bgClass = "bg-[#efdcff]";
    }
  } else if (hover) {
    bgClass =
      "bg-[var(--container-dynamic-neutral-subtle-background-hover,rgba(113,113,128,0.08))]";
  }

  const iconName = ICON_BY_STATUS[status];
  const iconSrc = `/figmaAssets/chip/${isLarge ? iconName.lg : iconName.sm}.svg`;

  return (
    <button
      type="button"
      disabled={disabled}
      aria-disabled={disabled}
      aria-pressed={selected}
      onMouseEnter={() => isDefaultBase && !disabled && setPointerHover(true)}
      onMouseLeave={() => setPointerHover(false)}
      onFocus={(e) => setFocused(e.currentTarget.matches(":focus-visible"))}
      onBlur={() => setFocused(false)}
      onClick={() => isDefaultBase && !disabled && setSelectedState((s) => !s)}
      className={`inline-flex items-center justify-center rounded-[var(--spacing-mega,40px)] transition-colors duration-150 outline-none ${bgClass} ${
        disabled ? "cursor-not-allowed" : "cursor-pointer"
      } ${
        isLarge ? "h-[34px] px-3 py-0.5" : "h-6 px-2 py-0.5"
      }`}
      style={{
        border: borderStyle,
        gap: "var(--numbers-4, 4px)",
        ...(focused && !disabled ? { boxShadow: FOCUS_RING } : null),
      }}
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
            fontSize: isLarge
              ? "var(--body-md-medium-size, 14px)"
              : "var(--body-sm-medium-size, 12px)",
            lineHeight: isLarge
              ? "var(--body-md-medium-line-height, 20px)"
              : "var(--body-sm-medium-line-height, 18px)",
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
              width: "var(--old-stroke-thickness-1, 1px)",
              backgroundColor: disabled
                ? "#d3d3d8"
                : "var(--border-dynamic-neutral-subtle-disabled, #e1e1e8)",
              margin: "var(--numbers-4, 4px) 0",
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
    </button>
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
  scopeId: "chip/chip",
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
    "container/dynamic/neutral/subtle/background/default/regular":
      "var(--container-dynamic-neutral-subtle-background-default-regular)",
    "border/dynamic/neutral/subtle/default":
      "var(--border-dynamic-neutral-subtle-default)",
    "container/dynamic/neutral/subtle/background/hover":
      "var(--container-dynamic-neutral-subtle-background-hover)",
    "container/dynamic/brand/subtle/background/selected":
      "var(--container-dynamic-brand-subtle-background-selected)",
    "border/dynamic/brand/selected": "var(--border-dynamic-brand-selected)",
    "container/dynamic/brand/subtle/foreground/delected":
      "var(--container-dynamic-brand-subtle-foreground-delected)",
    "container/dynamic/neutral/subtle/background/disabled":
      "var(--container-dynamic-neutral-subtle-background-disabled)",
    "container/dynamic/neutral/subtle/foreground/default/variation":
      "var(--container-dynamic-neutral-subtle-foreground-default-variation)",
    "container/dynamic/neutral/subtle/foreground/disabled":
      "var(--container-dynamic-neutral-subtle-foreground-disabled)",
    "border/dynamic/neutral/subtle/disabled":
      "var(--border-dynamic-neutral-subtle-disabled)",
    "Spacing/mega": "var(--spacing-mega)",
    "Body Md/Medium": "var(--body-md-medium-size) / var(--body-md-medium-line-height)",
    "Body Sm/Medium": "var(--body-sm-medium-size) / var(--body-sm-medium-line-height)",
    "numbers/4": "var(--numbers-4)",
  },
};

export default function ChipPage(): JSX.Element {
  return (
    <section aria-label="Chip component playground" className="flex flex-col gap-6">
      <Playground config={chipConfig} />
    </section>
  );
}
