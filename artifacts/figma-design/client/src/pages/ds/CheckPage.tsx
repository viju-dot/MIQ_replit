import { useState } from "react";

const CHECK_ICON = "/figmaAssets/check/check.svg";
const CHECK_ICON_DISABLED = "/figmaAssets/check/check-disabled.svg";
const MINUS_ICON = "/figmaAssets/check/minus.svg";
const MINUS_ICON_DISABLED = "/figmaAssets/check/minus-disabled.svg";

type Variant =
  | "Unchecked"
  | "Unchecked Error"
  | "Checked"
  | "Checked Error"
  | "Partial"
  | "Partial Error";

type State = "Default" | "Hover";

type CheckboxProps = {
  variant?: Variant;
  state?: State;
  disabled?: boolean;
  isCompact?: boolean;
  hasLabel?: boolean;
  labelValue?: string;
};

/**
 * Faithful reproduction of the Fiber "Checkbox" Figma component.
 * Tailwind v4 CSS-variable arbitrary values have been converted to plain
 * fallback values for Tailwind v3.
 */
function Checkbox({
  variant = "Unchecked",
  state = "Default",
  disabled = false,
  isCompact = true,
  hasLabel = true,
  labelValue = "Option",
}: CheckboxProps) {
  const isChecked = variant === "Checked" || variant === "Checked Error";
  const isPartial = variant === "Partial" || variant === "Partial Error";
  const isUnchecked = variant === "Unchecked" || variant === "Unchecked Error";
  const isError =
    variant === "Unchecked Error" ||
    variant === "Checked Error" ||
    variant === "Partial Error";
  const isFilled = isChecked || isPartial;

  // 16px container box styling
  let boxClass: string;
  if (!disabled && (variant === "Checked Error" || variant === "Partial Error")) {
    boxClass = "bg-[#7c33b5] border-[1.5px] border-[#da294b] border-solid";
  } else if (state === "Default" && disabled && isFilled) {
    boxClass = "bg-[rgba(113,113,128,0.1)]";
  } else if (!disabled && (variant === "Checked" || variant === "Partial")) {
    boxClass = "bg-[#7c33b5]";
  } else if (state === "Default" && disabled && isUnchecked) {
    boxClass = "border-[1.5px] border-[#e1e1e8] border-solid";
  } else if (variant === "Unchecked" && state === "Hover" && !disabled) {
    boxClass = "border-[1.5px] border-[#a8a8b2] border-solid";
  } else if (variant === "Unchecked Error" && !disabled) {
    boxClass = "border-[1.5px] border-[#da294b] border-solid";
  } else {
    boxClass = "border-[1.5px] border-[#c6c6cc] border-solid";
  }

  // Wrapper padding + hover background
  const hoverBg = state === "Hover" && !disabled;
  const wrapperPad = isCompact ? "p-[2px]" : "p-[7px]";
  const wrapperBg = hoverBg ? "bg-[rgba(113,113,128,0.08)]" : "";

  // Gap between control and label
  const gap =
    !isCompact && (!disabled || (state === "Default" && disabled))
      ? "gap-[2px]"
      : "gap-[4px]";

  // Label visibility mirrors the reference logic
  const showLabelEnabled =
    !disabled &&
    (isCompact ||
      (state === "Hover" && !isCompact) ||
      (variant === "Unchecked Error" && state === "Default" && !isCompact));
  const showLabelDisabled =
    state === "Default" &&
    disabled &&
    (isCompact ||
      (variant === "Unchecked Error" && !isCompact) ||
      (variant === "Checked Error" && !isCompact) ||
      (variant === "Partial Error" && !isCompact));
  const showLabelDefaultNonCompact =
    state === "Default" &&
    !isCompact &&
    (variant === "Unchecked" ||
      variant === "Checked" ||
      (variant === "Checked Error" && !disabled) ||
      variant === "Partial" ||
      (variant === "Partial Error" && !disabled));

  const showLabel =
    hasLabel && (showLabelEnabled || showLabelDisabled || showLabelDefaultNonCompact);

  const labelColor =
    disabled &&
    (variant === "Unchecked" ||
      variant === "Checked" ||
      variant === "Partial")
      ? "#a8a8b2"
      : disabled
        ? "#a8a8b2"
        : "#13131a";

  const checkSrc =
    state === "Default" && disabled ? CHECK_ICON_DISABLED : CHECK_ICON;
  const minusSrc =
    state === "Default" && disabled ? MINUS_ICON_DISABLED : MINUS_ICON;

  return (
    <div className={`flex items-center relative ${gap}`}>
      <div
        className={`flex items-center justify-center overflow-hidden rounded-[2px] shrink-0 ${wrapperPad} ${wrapperBg}`}
      >
        <div className="flex items-center overflow-hidden p-[2px] shrink-0">
          <div
            className={`overflow-hidden relative rounded-[2px] shrink-0 h-[16px] w-[16px] ${boxClass}`}
          >
            {isChecked && (
              <div className="absolute left-0 top-0 h-[16px] w-[16px] flex flex-col items-center justify-center overflow-hidden px-px py-[3px]">
                <div className="relative shrink-0 h-[9.001px] w-[12.501px]">
                  <img
                    alt=""
                    className="absolute inset-0 block max-w-none h-full w-full"
                    src={checkSrc}
                  />
                </div>
              </div>
            )}
            {isPartial && (
              <div className="absolute left-0 top-0 h-[16px] w-[16px] flex flex-col items-center justify-center overflow-hidden px-[2px] py-[8px]">
                <div className="relative shrink-0 h-px w-[12px]">
                  <img
                    alt=""
                    className="absolute inset-0 block max-w-none h-full w-full"
                    src={minusSrc}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      {showLabel && (
        <p
          className="[word-break:break-word] font-['DM_Sans'] leading-[20px] not-italic relative shrink-0 text-[14px] whitespace-nowrap"
          style={{ color: labelColor }}
        >
          {labelValue}
        </p>
      )}
    </div>
  );
}

/** An interactive compact checkbox demoing real toggle behavior. */
function InteractiveCheckbox() {
  const [checked, setChecked] = useState(false);
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      className="all-unset cursor-pointer"
      onClick={() => setChecked((c) => !c)}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-pressed={checked}
    >
      <Checkbox
        variant={checked ? "Checked" : "Unchecked"}
        state={hover ? "Hover" : "Default"}
        labelValue="Toggle me"
      />
    </button>
  );
}

type VariantSpec = {
  caption: string;
  variant: Variant;
  state: State;
  disabled: boolean;
};

const VARIANT_MATRIX: VariantSpec[] = [
  { caption: "Default", variant: "Unchecked", state: "Default", disabled: false },
  { caption: "Hover", variant: "Unchecked", state: "Hover", disabled: false },
  { caption: "Disabled", variant: "Unchecked", state: "Default", disabled: true },
  { caption: "Checked", variant: "Checked", state: "Default", disabled: false },
  { caption: "Checked · Hover", variant: "Checked", state: "Hover", disabled: false },
  { caption: "Checked · Disabled", variant: "Checked", state: "Default", disabled: true },
  { caption: "Partial", variant: "Partial", state: "Default", disabled: false },
  { caption: "Partial · Hover", variant: "Partial", state: "Hover", disabled: false },
  { caption: "Partial · Disabled", variant: "Partial", state: "Default", disabled: true },
];

const ERROR_MATRIX: VariantSpec[] = [
  { caption: "Unchecked Error", variant: "Unchecked Error", state: "Default", disabled: false },
  { caption: "Unchecked Error · Hover", variant: "Unchecked Error", state: "Hover", disabled: false },
  { caption: "Unchecked Error · Disabled", variant: "Unchecked Error", state: "Default", disabled: true },
  { caption: "Checked Error", variant: "Checked Error", state: "Default", disabled: false },
  { caption: "Checked Error · Hover", variant: "Checked Error", state: "Hover", disabled: false },
  { caption: "Checked Error · Disabled", variant: "Checked Error", state: "Default", disabled: true },
  { caption: "Partial Error", variant: "Partial Error", state: "Default", disabled: false },
  { caption: "Partial Error · Hover", variant: "Partial Error", state: "Hover", disabled: false },
  { caption: "Partial Error · Disabled", variant: "Partial Error", state: "Default", disabled: true },
];

function VariantGrid({
  specs,
  isCompact,
}: {
  specs: VariantSpec[];
  isCompact: boolean;
}) {
  return (
    <div className="flex flex-wrap gap-x-8 gap-y-5">
      {specs.map((spec) => (
        <div key={spec.caption} className="flex min-w-[140px] flex-col gap-1.5">
          <span className="text-[12px] text-[#a8a8b2]">{spec.caption}</span>
          <Checkbox
            variant={spec.variant}
            state={spec.state}
            disabled={spec.disabled}
            isCompact={isCompact}
          />
        </div>
      ))}
    </div>
  );
}

const cardClass =
  "rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5";

export default function CheckPage() {
  return (
    <section className="flex flex-col gap-6">
      {/* Compact checkboxes */}
      <div className={cardClass}>
        <p className="mb-4 text-[12px] text-[#a8a8b2]">
          Checkbox · Compact
        </p>
        <VariantGrid specs={VARIANT_MATRIX} isCompact={true} />
      </div>

      {/* Compact error checkboxes */}
      <div className={cardClass}>
        <p className="mb-4 text-[12px] text-[#a8a8b2]">
          Checkbox · Compact · Error
        </p>
        <VariantGrid specs={ERROR_MATRIX} isCompact={true} />
      </div>

      {/* Non-compact checkboxes */}
      <div className={cardClass}>
        <p className="mb-4 text-[12px] text-[#a8a8b2]">
          Checkbox · Standard
        </p>
        <VariantGrid specs={VARIANT_MATRIX} isCompact={false} />
      </div>

      {/* Non-compact error checkboxes */}
      <div className={cardClass}>
        <p className="mb-4 text-[12px] text-[#a8a8b2]">
          Checkbox · Standard · Error
        </p>
        <VariantGrid specs={ERROR_MATRIX} isCompact={false} />
      </div>

      {/* Checkbox-Element (control only, no label) */}
      <div className={cardClass}>
        <p className="mb-4 text-[12px] text-[#a8a8b2]">
          Checkbox-Element (control only)
        </p>
        <div className="flex flex-wrap gap-x-8 gap-y-5">
          <div className="flex min-w-[140px] flex-col gap-1.5">
            <span className="text-[12px] text-[#a8a8b2]">isCompact = true</span>
            <Checkbox variant="Unchecked" isCompact={true} hasLabel={false} />
          </div>
          <div className="flex min-w-[140px] flex-col gap-1.5">
            <span className="text-[12px] text-[#a8a8b2]">isCompact = false</span>
            <Checkbox variant="Unchecked" isCompact={false} hasLabel={false} />
          </div>
        </div>
      </div>

      {/* Interactive */}
      <div className={cardClass}>
        <p className="mb-4 text-[12px] text-[#a8a8b2]">Interactive</p>
        <InteractiveCheckbox />
      </div>
    </section>
  );
}
