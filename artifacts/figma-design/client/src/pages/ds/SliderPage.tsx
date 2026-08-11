import { useState } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

/**
 * Slider design-system playground.
 *
 * Faithful reproduction of the Figma "Slider" page, refactored into interactive
 * playgrounds. Two core primitives are modeled:
 *   - Indicator  : the draggable knob/thumb (with optional number tooltip)
 *   - SliderTrack: the full slider (track background + fill + one or two knobs)
 *
 * Tailwind v4 CSS-variable arbitrary values from the reference have been
 * replaced with their plain fallback hex/rgba values for Tailwind v3.
 */

const ASSET = "/figmaAssets/slider";

const markerSrc = {
  discreteDefault: `${ASSET}/marker-discrete-default.svg`,
  discreteActive: `${ASSET}/marker-discrete-active.svg`,
  discreteDisabled: `${ASSET}/marker-discrete-disabled.svg`,
  continuousDefault: `${ASSET}/marker-continuous-default.svg`,
  continuousActive: `${ASSET}/marker-continuous-active.svg`,
  continuousDisabled: `${ASSET}/marker-continuous-disabled.svg`,
} as const;

const triangleSrc = `${ASSET}/triangle.svg`;
const triangleDisabledSrc = `${ASSET}/triangle-disabled.svg`;

type IndicatorType = "Discrete" | "Continuous";
type IndicatorState = "Default" | "Active" | "Disabled";

/* ------------------------------------------------------------------ */
/* Indicator (knob)                                                    */
/* ------------------------------------------------------------------ */

type IndicatorProps = {
  showNumberTooltip?: boolean;
  state?: IndicatorState;
  type?: IndicatorType;
};

function Indicator({
  showNumberTooltip = false,
  state: baseState = "Default",
  type = "Discrete",
}: IndicatorProps): JSX.Element {
  const [hover, setHover] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [focus, setFocus] = useState(false);
  const isBaseDisabled = baseState === "Disabled";

  // Policy: the panel state is FORCED. Live hover/press/focus only derive a
  // state when the panel base is "Default"; a forced "Active"/"Disabled" stays.
  // Disabled always wins and suppresses interaction. Interaction promotes the
  // knob to the Figma "Active" variant + the hover glow the Figma design note
  // specifies (rgba(168,87,229,0.2)).
  const interacting = !isBaseDisabled && (hover || pressed || focus);
  const showGlow = interacting;
  const state: IndicatorState =
    baseState === "Default" && interacting ? "Active" : baseState;

  const interactionHandlers = isBaseDisabled
    ? {}
    : {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => {
          setHover(false);
          setPressed(false);
        },
        onMouseDown: () => setPressed(true),
        onMouseUp: () => setPressed(false),
        onFocus: () => setFocus(true),
        onBlur: () => setFocus(false),
      };

  const isContinuousAndActive = type === "Continuous" && state === "Active";
  const isContinuousAndDefault = type === "Continuous" && state === "Default";
  const isContinuousAndDisabled = type === "Continuous" && state === "Disabled";
  const isDefaultOrActive = state === "Default" || state === "Active";
  const isDisabled = state === "Disabled";
  const isDiscreteAndActive = type === "Discrete" && state === "Active";

  // Container sizing
  const containerCls = isContinuousAndActive
    ? "gap-[7px] pb-[4px] size-[18px]"
    : type === "Continuous"
      ? "gap-[4px] size-[18px]"
      : "gap-[4px] size-[24px]";

  // Active/default marker source
  const activeMarker = isContinuousAndActive
    ? markerSrc.continuousActive
    : isContinuousAndDefault
      ? markerSrc.continuousDefault
      : isDiscreteAndActive
        ? markerSrc.discreteActive
        : markerSrc.discreteDefault;

  const disabledMarker = isContinuousAndDisabled
    ? markerSrc.continuousDisabled
    : markerSrc.discreteDisabled;

  const markerBoxCls = isContinuousAndActive
    ? "h-[11px] w-[32px]"
    : isContinuousAndDefault
      ? "size-[18px]"
      : "size-[24px]";

  return (
    <button
      type="button"
      aria-label={showNumberTooltip ? "Slider value 100" : "Slider handle"}
      aria-disabled={isBaseDisabled || undefined}
      disabled={isBaseDisabled}
      className={`flex flex-col items-center justify-end relative appearance-none border-0 bg-transparent p-0 transition-[filter] duration-150 ${
        isBaseDisabled ? "cursor-not-allowed" : "cursor-grab active:cursor-grabbing"
      } ${containerCls}`}
      style={
        showGlow
          ? {
              filter:
                "drop-shadow(0 0 3px var(--slider-hover-glow, rgba(168,87,229,0.2))) drop-shadow(0 0 3px var(--slider-hover-glow, rgba(168,87,229,0.2)))",
            }
          : undefined
      }
      {...interactionHandlers}
    >
      {isDefaultOrActive && showNumberTooltip && (
        <div
          className="flex flex-col items-center relative shrink-0"
          style={{
            filter:
              "drop-shadow(0px 1px 2px var(--shadow-lvl8, rgba(113,113,128,0.08))) drop-shadow(0px 12px 10px var(--shadow-lvl10, rgba(113,113,128,0.1)))",
          }}
        >
          <div className="bg-[var(--surface-background-lvl5,#717180)] flex flex-col items-center justify-center px-[4px] relative rounded-[var(--radius-25,2px)] shrink-0">
            <p className="font-medium leading-[var(--body-sm-medium-line-height,18px)] not-italic relative shrink-0 text-[length:var(--body-sm-medium-size,12px)] text-[var(--controls-foreground-default,#ffffff)] whitespace-nowrap">
              100
            </p>
          </div>
          <div className="flex items-center justify-center relative shrink-0">
            <div className="flex-none rotate-180">
              <div className="h-[4px] relative w-[8px]">
                <img
                  alt=""
                  className="block max-w-none w-full h-full"
                  src={triangleSrc}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {isDefaultOrActive && (
        <div className={`relative shrink-0 ${markerBoxCls}`}>
          <img
            alt=""
            className="block max-w-none w-full h-full"
            src={activeMarker}
          />
        </div>
      )}

      {isDisabled && showNumberTooltip && (
        <div
          className="flex flex-col items-center relative shrink-0"
          style={{
            filter:
              "drop-shadow(0px 1px 2px var(--shadow-lvl8, rgba(113,113,128,0.08))) drop-shadow(0px 12px 10px var(--shadow-lvl10, rgba(113,113,128,0.1)))",
          }}
        >
          <div className="bg-[var(--controls-background-disabled,rgba(113,113,128,0.1))] flex flex-col items-center justify-center px-[4px] relative rounded-[var(--radius-25,2px)] shrink-0">
            <p className="font-medium leading-[var(--body-sm-medium-line-height,18px)] not-italic relative shrink-0 text-[length:var(--body-sm-medium-size,12px)] text-[var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)] whitespace-nowrap">
              100
            </p>
          </div>
          <div className="flex items-center justify-center relative shrink-0">
            <div className="flex-none rotate-180">
              <div className="h-[4px] relative w-[8px]">
                <img
                  alt=""
                  className="block max-w-none w-full h-full"
                  src={triangleDisabledSrc}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {isDisabled && (
        <div
          className={`relative shrink-0 ${isContinuousAndDisabled ? "size-[18px]" : "size-[24px]"}`}
        >
          <img
            alt=""
            className="block w-full h-full max-w-none"
            src={disabledMarker}
          />
        </div>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Slider (track + fill + knobs)                                       */
/* ------------------------------------------------------------------ */

type SliderType = "Discrete" | "Continuous";
type SliderState = "Active" | "Disabled";
type SliderCount = "1" | "2";

type SliderTrackProps = {
  sliderCount?: SliderCount;
  state?: SliderState;
  type?: SliderType;
};

function SliderTrack({
  sliderCount = "2",
  state = "Active",
  type = "Discrete",
}: SliderTrackProps): JSX.Element {
  const isContinuous = type === "Continuous";
  const isContinuousAnd2 = isContinuous && sliderCount === "2";
  const isContinuousAndActiveAnd1 =
    isContinuous && state === "Active" && sliderCount === "1";
  const isContinuousAndActiveAnd2 =
    isContinuous && state === "Active" && sliderCount === "2";
  const isContinuousAndDisabled = isContinuous && state === "Disabled";
  const isDiscreteAndActiveAnd1 =
    type === "Discrete" && state === "Active" && sliderCount === "1";
  const isDiscreteAndDisabled = type === "Discrete" && state === "Disabled";

  // Background bar (behind the fill), full width, centered.
  const bgCls = isContinuousAndDisabled
    ? "bg-[var(--controls-background-disabled,rgba(113,113,128,0.1))] h-[4px]"
    : isDiscreteAndDisabled
      ? "bg-[var(--controls-background-disabled,rgba(113,113,128,0.1))] h-[8px]"
      : isContinuousAndActiveAnd1
        ? "bg-[var(--controls-background-active,#7c33b5)] h-[4px]"
        : isContinuousAndActiveAnd2
          ? "bg-[var(--border-static-subtle-neutral,#e1e1e8)] h-[4px]"
          : isDiscreteAndActiveAnd1
            ? "bg-[var(--controls-background-active,#7c33b5)] h-[8px]"
            : "bg-[var(--border-static-subtle-neutral,#e1e1e8)] h-[8px]";

  // Fill bar (the coloured portion). For count=1 fill starts from left; here we
  // render it full width matching the reference geometry (300px frame).
  const fillCls = isContinuousAndDisabled
    ? "bg-[var(--controls-background-disabled,rgba(113,113,128,0.1))] h-[4px] rounded-[var(--radius-50,4px)]"
    : isDiscreteAndDisabled
      ? "bg-[var(--controls-background-disabled,rgba(113,113,128,0.1))] h-[8px] rounded-[var(--radius-50,4px)]"
      : isContinuousAndActiveAnd1
        ? "bg-[var(--controls-background-inactive,#ebebf0)] h-[4px] rounded-[var(--radius-50,4px)]"
        : isContinuousAndActiveAnd2
          ? "bg-[var(--controls-background-active,#7c33b5)] h-[4px] rounded-[var(--radius-50,4px)]"
          : isDiscreteAndActiveAnd1
            ? "bg-[var(--controls-background-inactive,#ebebf0)] h-[8px] rounded-[var(--radius-50,4px)]"
            : "bg-[var(--controls-background-active,#7c33b5)] h-[8px] rounded-[var(--radius-50,4px)]";

  const indicatorState: IndicatorState =
    state === "Disabled" ? "Disabled" : "Active";

  return (
    <div
      className={`flex items-center relative w-[300px] max-w-full ${isContinuous ? "h-[18px]" : "h-[24px]"}`}
    >
      <div
        className={`flex flex-1 flex-col items-start justify-center min-w-px relative ${isContinuous ? "h-[18px]" : "h-[24px]"}`}
      >
        {/* Background bar */}
        <div
          className={`-translate-y-1/2 absolute left-0 right-0 rounded-[var(--radius-50,4px)] top-1/2 ${bgCls}`}
        />

        {/* Fill bar */}
        <div className={`relative shrink-0 w-full ${fillCls}`}>
          {/* Knob max (right) — present for count=2 */}
          {sliderCount === "2" && (
            <div
              className={`-translate-y-1/2 absolute h-[12px] right-0 top-1/2 ${isContinuousAnd2 ? "w-[18px]" : "w-[24px]"}`}
            >
              <div
                className={`absolute flex flex-col items-center justify-end left-0 ${isContinuousAnd2 ? "gap-[4px] size-[18px] top-[-3px]" : "gap-[4px] size-[24px] top-[-6px]"}`}
              >
                <Indicator type={type} state={indicatorState} />
              </div>
            </div>
          )}

          {/* Knob min (left) — always present, carries the number tooltip */}
          <div
            className={`-translate-y-1/2 absolute h-[12px] left-0 top-1/2 ${isContinuous ? "w-[18px]" : "w-[24px]"}`}
          >
            <div
              className={`absolute flex flex-col items-center justify-end left-0 ${isContinuous ? "gap-[4px] size-[18px] top-[-3px]" : "gap-[4px] size-[24px] top-[-6px]"}`}
            >
              <Indicator
                type={type}
                state={indicatorState}
                showNumberTooltip
              />
            </div>
          </div>
        </div>

        {/* Steps (discrete only) */}
        {type === "Discrete" && (
          <div className="-translate-y-1/2 absolute flex h-[8px] items-center justify-between left-0 right-0 top-1/2">
            <div className="relative rounded-[var(--old-radiuses-round,100px)] shrink-0 size-[4px]" />
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`relative shrink-0 size-[4px] ${
                  isDiscreteAndDisabled
                    ? "bg-[var(--controls-foreground-disabled,#c6c6cc)] rounded-[var(--radius-25,2px)]"
                    : "bg-[var(--controls-foreground-default,#ffffff)] rounded-[var(--old-radiuses-round,100px)]"
                }`}
              />
            ))}
            <div className="relative rounded-[var(--old-radiuses-round,100px)] shrink-0 size-[4px]" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Playground configs                                                  */
/* ------------------------------------------------------------------ */

const sliderConfig: PlaygroundConfig = {
  name: "Slider",
  description:
    "Track with fill and one or two knobs. Discrete (stepped) or Continuous, in Active and Disabled states.",
  controls: [
    {
      kind: "select",
      name: "type",
      label: "Type",
      options: ["Discrete", "Continuous"],
      defaultValue: "Discrete",
      asTabs: true,
    },
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Active", "Disabled"],
      defaultValue: "Active",
    },
    {
      kind: "select",
      name: "sliderCount",
      label: "Knob count",
      options: ["1", "2"],
      defaultValue: "2",
    },
  ],
  render: (props: PropValues) => (
    <SliderTrack
      type={props.type as SliderType}
      state={props.state as SliderState}
      sliderCount={props.sliderCount as SliderCount}
    />
  ),
  tokens: {
    "controls/background/active": "var(--controls-background-active)",
    "controls/background/inactive": "var(--controls-background-inactive)",
    "controls/background/disabled": "var(--controls-background-disabled)",
    "controls/foreground/default": "var(--controls-foreground-default)",
    "controls/foreground/disabled": "var(--controls-foreground-disabled)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "radius/50": "var(--radius-50)",
    "[old]radiuses/round": "var(--old-radiuses-round)",
  },
};

const indicatorConfig: PlaygroundConfig = {
  name: "Indicator (Knob)",
  description:
    "The draggable thumb. Discrete or Continuous, in Default, Active and Disabled states, with an optional value tooltip.",
  controls: [
    {
      kind: "select",
      name: "type",
      label: "Type",
      options: ["Discrete", "Continuous"],
      defaultValue: "Discrete",
      asTabs: true,
    },
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Default", "Active", "Disabled"],
      defaultValue: "Active",
    },
    {
      kind: "boolean",
      name: "showNumberTooltip",
      label: "Number tooltip",
      defaultValue: false,
    },
  ],
  render: (props: PropValues) => (
    <Indicator
      type={props.type as IndicatorType}
      state={props.state as IndicatorState}
      showNumberTooltip={props.showNumberTooltip === true}
    />
  ),
  tokens: {
    "surface/background/lvl5": "var(--surface-background-lvl5)",
    "controls/background/disabled": "var(--controls-background-disabled)",
    "controls/foreground/default": "var(--controls-foreground-default)",
    "surface/foreground/dynamic/neutral/disabled":
      "var(--surface-foreground-dynamic-neutral-disabled)",
    "radius/25": "var(--radius-25)",
    "body/sm/medium": "var(--body-sm-medium-size)",
    "shadow/lvl8": "var(--shadow-lvl8)",
    "shadow/lvl10": "var(--shadow-lvl10)",
  },
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function SliderPage(): JSX.Element {
  return (
    <section
      aria-label="Slider component playground"
      className="flex flex-col gap-6"
    >
      <Playground config={sliderConfig} />
      <Playground config={indicatorConfig} />
    </section>
  );
}
