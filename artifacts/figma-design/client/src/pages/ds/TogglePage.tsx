import { useState } from "react";

const ASSET = "/figmaAssets/toggle";

type ToggleState = "Off" | "On" | "Disabled/Off" | "Disabled/On";

type StaticToggleProps = {
  compact: boolean;
  state: ToggleState;
};

/**
 * Static rendering of a single Toggle variant, matching the Figma "Toggle" page.
 * Compact = 46x24 with a 20px knob; Large (Compact=No) = 63x32 with a 28px knob.
 */
function StaticToggle({ compact, state }: StaticToggleProps): JSX.Element {
  const isOn = state === "On" || state === "Disabled/On";
  const isDisabled = state === "Disabled/Off" || state === "Disabled/On";

  // Track background
  let bgClass = "bg-[#ebebf0]"; // inactive (Off)
  if (isDisabled) {
    bgClass = "bg-[rgba(113,113,128,0.1)]";
  } else if (isOn) {
    bgClass = "bg-[#7c33b5]";
  }

  // Track sizing
  const trackClass = compact
    ? "h-[24px] w-[46px] p-[2px] max-h-[24px] max-w-[46px] min-w-[46px]"
    : "h-[32px] w-[63px] px-[3px] py-[2px] max-h-[32px] max-w-[63px]";

  const knobClass = compact ? "size-[20px]" : "size-[28px]";

  // Knob asset per size + state
  let knobSrc: string;
  if (compact) {
    if (state === "Off") knobSrc = `${ASSET}/compact-off.svg`;
    else if (state === "On") knobSrc = `${ASSET}/compact-on.svg`;
    else if (state === "Disabled/On") knobSrc = `${ASSET}/compact-disabled-on.svg`;
    else knobSrc = `${ASSET}/compact-disabled-off.svg`;
  } else {
    if (state === "Off") knobSrc = `${ASSET}/large-off.svg`;
    else if (state === "On") knobSrc = `${ASSET}/large-on.svg`;
    else if (state === "Disabled/On") knobSrc = `${ASSET}/large-disabled-off.svg`;
    else knobSrc = `${ASSET}/large-disabled-off.svg`;
  }

  return (
    <div
      className={`relative flex items-center rounded-[20px] ${trackClass} ${bgClass} ${
        isOn ? "justify-end" : ""
      }`}
      role="switch"
      aria-checked={isOn}
      aria-disabled={isDisabled}
    >
      <div className={`relative shrink-0 ${knobClass}`}>
        <img
          alt=""
          className="absolute inset-0 block size-full max-w-none"
          src={knobSrc}
        />
      </div>
    </div>
  );
}

/**
 * Interactive controlled toggle (real hover/checked state) — compact & large.
 */
function InteractiveToggle({ compact }: { compact: boolean }): JSX.Element {
  const [on, setOn] = useState(false);

  const trackClass = compact
    ? "h-[24px] w-[46px] p-[2px] max-h-[24px] max-w-[46px] min-w-[46px]"
    : "h-[32px] w-[63px] px-[3px] py-[2px] max-h-[32px] max-w-[63px]";
  const knobClass = compact ? "size-[20px]" : "size-[28px]";

  const knobSrc = compact
    ? on
      ? `${ASSET}/compact-on.svg`
      : `${ASSET}/compact-off.svg`
    : on
      ? `${ASSET}/large-on.svg`
      : `${ASSET}/large-off.svg`;

  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className={`relative flex cursor-pointer items-center rounded-[20px] ${trackClass} ${
        on ? "justify-end bg-[#7c33b5]" : "bg-[#ebebf0]"
      }`}
      role="switch"
      aria-checked={on}
    >
      <div className={`relative shrink-0 ${knobClass}`}>
        <img
          alt=""
          className="absolute inset-0 block size-full max-w-none"
          src={knobSrc}
        />
      </div>
    </button>
  );
}

const states: ToggleState[] = ["Off", "On", "Disabled/Off", "Disabled/On"];

export default function TogglePage(): JSX.Element {
  return (
    <section aria-label="Toggle component variants" className="flex flex-col gap-6">
      {/* Compact toggles */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <p className="mb-4 text-[14px] font-medium text-[#13131a]">
          Compact
        </p>
        <div className="flex flex-wrap gap-x-10 gap-y-6">
          {states.map((state) => (
            <div key={`compact-${state}`} className="flex flex-col items-start gap-2">
              <span className="text-[12px] text-[#a8a8b2]">{state}</span>
              <StaticToggle compact state={state} />
            </div>
          ))}
        </div>
      </div>

      {/* Large (Compact=No) toggles */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <p className="mb-4 text-[14px] font-medium text-[#13131a]">
          Large
        </p>
        <div className="flex flex-wrap gap-x-10 gap-y-6">
          {states.map((state) => (
            <div key={`large-${state}`} className="flex flex-col items-start gap-2">
              <span className="text-[12px] text-[#a8a8b2]">{state}</span>
              <StaticToggle compact={false} state={state} />
            </div>
          ))}
        </div>
      </div>

      {/* Interactive */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <p className="mb-4 text-[14px] font-medium text-[#13131a]">
          Interactive
        </p>
        <div className="flex flex-wrap gap-x-10 gap-y-6">
          <div className="flex flex-col items-start gap-2">
            <span className="text-[12px] text-[#a8a8b2]">Compact (click to toggle)</span>
            <InteractiveToggle compact />
          </div>
          <div className="flex flex-col items-start gap-2">
            <span className="text-[12px] text-[#a8a8b2]">Large (click to toggle)</span>
            <InteractiveToggle compact={false} />
          </div>
        </div>
      </div>
    </section>
  );
}
