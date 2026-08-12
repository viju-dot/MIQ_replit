import { useEffect, useState } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

const ASSET = "/figmaAssets/toggle";

// Focus ring via inline boxShadow (var() in Tailwind arbitrary ring classes
// silently fails in this project, so it is driven from focus-visible state).
const FOCUS_RING =
  "0 0 0 2px var(--surface-background-lvl1,#ffffff), 0 0 0 4px var(--border-dynamic-brand-selected,#7c33b5)";

function FiberToggle({
  compact,
  on,
  disabled,
}: {
  compact: boolean;
  on: boolean;
  disabled: boolean;
}): JSX.Element {
  // Natural interactivity: clicking flips the switch. The panel "On" control
  // seeds the state and re-syncs when changed, keeping it authoritative.
  const [checked, setChecked] = useState(on);
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    setChecked(on);
  }, [on]);
  const isOn = !disabled && checked;
  // Track background (Figma control tokens)
  let bgClass = "bg-[var(--controls-background-inactive,#ebebf0)]";
  if (disabled) bgClass = "bg-[var(--controls-background-disabled,rgba(113,113,128,0.1))]";
  else if (isOn) bgClass = "bg-[var(--controls-background-active,#7c33b5)]";

  const trackClass = compact
    ? "h-[24px] w-[46px] p-[2px] max-h-[24px] max-w-[46px] min-w-[46px]"
    : "h-[32px] w-[63px] px-[3px] py-[2px] max-h-[32px] max-w-[63px]";
  const knobClass = compact ? "size-[20px]" : "size-[28px]";

  let knobSrc: string;
  if (compact) {
    if (disabled) knobSrc = isOn ? `${ASSET}/compact-disabled-on.svg` : `${ASSET}/compact-disabled-off.svg`;
    else knobSrc = isOn ? `${ASSET}/compact-on.svg` : `${ASSET}/compact-off.svg`;
  } else {
    if (disabled) knobSrc = `${ASSET}/large-disabled-off.svg`;
    else knobSrc = isOn ? `${ASSET}/large-on.svg` : `${ASSET}/large-off.svg`;
  }

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => !disabled && setChecked((c) => !c)}
      onFocus={(e) => setFocused(e.currentTarget.matches(":focus-visible"))}
      onBlur={() => setFocused(false)}
      className={`relative flex items-center rounded-[20px] transition-colors duration-150 outline-none ${trackClass} ${bgClass} ${
        isOn ? "justify-end" : ""
      } ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
      style={focused && !disabled ? { boxShadow: FOCUS_RING } : undefined}
      role="switch"
      aria-checked={isOn}
      aria-disabled={disabled}
    >
      <div className={`relative shrink-0 ${knobClass}`}>
        <img alt="" className="absolute inset-0 block size-full max-w-none" src={knobSrc} />
      </div>
    </button>
  );
}

const config: PlaygroundConfig = {
  name: "Toggle",
  scopeId: "toggle/toggle",
  description: "Switch control — Compact and Large sizes, with disabled states.",
  controls: [
    {
      kind: "select",
      name: "size",
      label: "Size",
      options: ["Compact", "Large"],
      defaultValue: "Compact",
      asTabs: true,
    },
    { kind: "boolean", name: "on", label: "On", defaultValue: true },
    { kind: "boolean", name: "disabled", label: "Disabled", defaultValue: false },
  ],
  render: (props) => (
    <FiberToggle
      compact={props.size === "Compact"}
      on={props.on === true}
      disabled={props.disabled === true}
    />
  ),
  tokens: {
    "controls/background/active": "var(--controls-background-active)",
    "controls/background/inactive": "var(--controls-background-inactive)",
    "controls/background/disabled": "var(--controls-background-disabled)",
    "radius/track": "20px",
    "size/compact": "46×24 (knob 20px)",
    "size/large": "63×32 (knob 28px)",
  },
};

export default function TogglePage(): JSX.Element {
  return (
    <section aria-label="Toggle component playground" className="flex flex-col gap-6">
      <Playground config={config} />
    </section>
  );
}
