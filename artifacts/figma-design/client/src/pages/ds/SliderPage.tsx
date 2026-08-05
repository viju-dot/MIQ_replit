import { useState } from "react";

/**
 * Slider design-system page.
 *
 * Faithful reproduction of the Figma "Slider" page. Two core primitives are
 * modeled:
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
  state = "Default",
  type = "Discrete",
}: IndicatorProps): JSX.Element {
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
    <div
      className={`flex flex-col items-center justify-end relative ${containerCls}`}
    >
      {isDefaultOrActive && showNumberTooltip && (
        <div
          className="flex flex-col items-center relative shrink-0"
          style={{
            filter:
              "drop-shadow(0px 1px 2px rgba(113,113,128,0.08)) drop-shadow(0px 12px 10px rgba(113,113,128,0.1))",
          }}
        >
          <div className="bg-[#717180] flex flex-col items-center justify-center px-[4px] relative rounded-[2px] shrink-0">
            <p className="font-medium leading-[18px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
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
              "drop-shadow(0px 1px 2px rgba(113,113,128,0.08)) drop-shadow(0px 12px 10px rgba(113,113,128,0.1))",
          }}
        >
          <div className="bg-[rgba(113,113,128,0.1)] flex flex-col items-center justify-center px-[4px] relative rounded-[2px] shrink-0">
            <p className="font-medium leading-[18px] not-italic relative shrink-0 text-[12px] text-[#a8a8b2] whitespace-nowrap">
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
    </div>
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
    ? "bg-[rgba(113,113,128,0.1)] h-[4px]"
    : isDiscreteAndDisabled
      ? "bg-[rgba(113,113,128,0.1)] h-[8px]"
      : isContinuousAndActiveAnd1
        ? "bg-[#7c33b5] h-[4px]"
        : isContinuousAndActiveAnd2
          ? "bg-[#e1e1e8] h-[4px]"
          : isDiscreteAndActiveAnd1
            ? "bg-[#7c33b5] h-[8px]"
            : "bg-[#e1e1e8] h-[8px]";

  // Fill bar (the coloured portion). For count=1 fill starts from left; here we
  // render it full width matching the reference geometry (300px frame).
  const fillCls = isContinuousAndDisabled
    ? "bg-[rgba(113,113,128,0.1)] h-[4px] rounded-[4px]"
    : isDiscreteAndDisabled
      ? "bg-[rgba(113,113,128,0.1)] h-[8px] rounded-[4px]"
      : isContinuousAndActiveAnd1
        ? "bg-[#ebebf0] h-[4px] rounded-[4px]"
        : isContinuousAndActiveAnd2
          ? "bg-[#7c33b5] h-[4px] rounded-[4px]"
          : isDiscreteAndActiveAnd1
            ? "bg-[#ebebf0] h-[8px] rounded-[4px]"
            : "bg-[#7c33b5] h-[8px] rounded-[4px]";

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
          className={`-translate-y-1/2 absolute left-0 right-0 rounded-[4px] top-1/2 ${bgCls}`}
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
            <div className="relative rounded-[100px] shrink-0 size-[4px]" />
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className={`relative shrink-0 size-[4px] ${
                  isDiscreteAndDisabled
                    ? "bg-[#c6c6cc] rounded-[2px]"
                    : "bg-white rounded-[100px]"
                }`}
              />
            ))}
            <div className="relative rounded-[100px] shrink-0 size-[4px]" />
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Interactive demo slider                                             */
/* ------------------------------------------------------------------ */

function InteractiveSlider(): JSX.Element {
  const [value, setValue] = useState(50);
  return (
    <div className="flex w-[300px] max-w-full flex-col gap-2">
      <input
        type="range"
        min={0}
        max={100}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        className="w-full accent-[#7c33b5]"
        aria-label="Interactive slider"
      />
      <span className="font-body-sm-medium text-[12px] font-medium leading-[18px] text-[#717180]">
        Value: {value}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page layout helpers                                                 */
/* ------------------------------------------------------------------ */

function Caption({ children }: { children: React.ReactNode }): JSX.Element {
  return <span className="text-[12px] text-[#a8a8b2]">{children}</span>;
}

function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
      <h2 className="mb-4 text-[14px] font-medium text-[#13131a]">{title}</h2>
      {children}
    </div>
  );
}

function Variant({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="flex flex-col gap-2">
      <Caption>{label}</Caption>
      <div className="flex min-h-[40px] items-center">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function SliderPage(): JSX.Element {
  return (
    <section className="flex flex-col gap-8" aria-label="Slider component variants">
      {/* Sliders — Active state */}
      <Card title="Slider — Active">
        <div className="flex flex-wrap gap-x-16 gap-y-8">
          <Variant label="Discrete · Count 2">
            <SliderTrack type="Discrete" state="Active" sliderCount="2" />
          </Variant>
          <Variant label="Discrete · Count 1">
            <SliderTrack type="Discrete" state="Active" sliderCount="1" />
          </Variant>
          <Variant label="Continuous · Count 2">
            <SliderTrack type="Continuous" state="Active" sliderCount="2" />
          </Variant>
          <Variant label="Continuous · Count 1">
            <SliderTrack type="Continuous" state="Active" sliderCount="1" />
          </Variant>
        </div>
      </Card>

      {/* Sliders — Disabled state */}
      <Card title="Slider — Disabled">
        <div className="flex flex-wrap gap-x-16 gap-y-8">
          <Variant label="Discrete · Count 2">
            <SliderTrack type="Discrete" state="Disabled" sliderCount="2" />
          </Variant>
          <Variant label="Discrete · Count 1">
            <SliderTrack type="Discrete" state="Disabled" sliderCount="1" />
          </Variant>
          <Variant label="Continuous · Count 2">
            <SliderTrack type="Continuous" state="Disabled" sliderCount="2" />
          </Variant>
          <Variant label="Continuous · Count 1">
            <SliderTrack type="Continuous" state="Disabled" sliderCount="1" />
          </Variant>
        </div>
      </Card>

      {/* Indicators (knobs) */}
      <Card title="Indicator (Knob)">
        <div className="flex flex-wrap gap-x-12 gap-y-8">
          <Variant label="Discrete · Default">
            <Indicator type="Discrete" state="Default" />
          </Variant>
          <Variant label="Discrete · Active">
            <Indicator type="Discrete" state="Active" />
          </Variant>
          <Variant label="Discrete · Disabled">
            <Indicator type="Discrete" state="Disabled" />
          </Variant>
          <Variant label="Continuous · Default">
            <Indicator type="Continuous" state="Default" />
          </Variant>
          <Variant label="Continuous · Active">
            <Indicator type="Continuous" state="Active" />
          </Variant>
          <Variant label="Continuous · Disabled">
            <Indicator type="Continuous" state="Disabled" />
          </Variant>
        </div>
      </Card>

      {/* Indicators with number tooltip */}
      <Card title="Indicator — with Number Tooltip">
        <div className="flex flex-wrap gap-x-12 gap-y-10 pt-6">
          <Variant label="Discrete · Default">
            <Indicator type="Discrete" state="Default" showNumberTooltip />
          </Variant>
          <Variant label="Discrete · Active">
            <Indicator type="Discrete" state="Active" showNumberTooltip />
          </Variant>
          <Variant label="Discrete · Disabled">
            <Indicator type="Discrete" state="Disabled" showNumberTooltip />
          </Variant>
          <Variant label="Continuous · Active">
            <Indicator type="Continuous" state="Active" showNumberTooltip />
          </Variant>
          <Variant label="Continuous · Disabled">
            <Indicator type="Continuous" state="Disabled" showNumberTooltip />
          </Variant>
        </div>
      </Card>

      {/* Interactive example */}
      <Card title="Interactive">
        <Variant label="Drag to change value">
          <InteractiveSlider />
        </Variant>
      </Card>
    </section>
  );
}
