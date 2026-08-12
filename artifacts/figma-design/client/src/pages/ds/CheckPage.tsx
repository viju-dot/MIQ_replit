import { useEffect, useState } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

// Focus ring via inline boxShadow (var() in Tailwind arbitrary ring classes
// silently fails in this project, so it is driven from focus-visible state).
const FOCUS_RING =
  "0 0 0 2px var(--surface-background-lvl1,#ffffff), 0 0 0 4px var(--border-dynamic-brand-selected,#7c33b5)";

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
  /** When provided, the control becomes clickable (toggles checked/unchecked). */
  onToggle?: () => void;
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
  onToggle,
}: CheckboxProps) {
  // State-resolution policy: a panel-forced "Hover" stays forced; natural
  // pointer hover only derives Hover when the panel base is "Default".
  // Disabled always wins and suppresses hover/click.
  const [pointerHover, setPointerHover] = useState(false);
  const [focused, setFocused] = useState(false);
  if (!disabled && state === "Default" && pointerHover) state = "Hover";
  const interactive = !disabled && !!onToggle;
  const isChecked = variant === "Checked" || variant === "Checked Error";
  const isPartial = variant === "Partial" || variant === "Partial Error";
  const isUnchecked = variant === "Unchecked" || variant === "Unchecked Error";
  const isFilled = isChecked || isPartial;

  // 16px container box styling — driven by inline styles because Tailwind
  // arbitrary classes with var()/rgba silently fail in this project.
  const boxStyle: React.CSSProperties = {};
  if (!disabled && (variant === "Checked Error" || variant === "Partial Error")) {
    boxStyle.backgroundColor = "var(--controls-background-selected,#7c33b5)";
    boxStyle.border = "1.5px solid var(--border-dynamic-error-default,#da294b)";
  } else if (state === "Default" && disabled && isFilled) {
    boxStyle.backgroundColor = "var(--controls-background-disabled,rgba(113,113,128,0.1))";
  } else if (!disabled && (variant === "Checked" || variant === "Partial")) {
    boxStyle.backgroundColor = "var(--controls-background-selected,#7c33b5)";
  } else if (state === "Default" && disabled && isUnchecked) {
    boxStyle.border = "1.5px solid var(--border-dynamic-neutral-subtle-disabled,#e1e1e8)";
  } else if (variant === "Unchecked" && state === "Hover" && !disabled) {
    boxStyle.border = "1.5px solid var(--border-dynamic-neutral-subtle-hover,#a8a8b2)";
  } else if (variant === "Unchecked Error" && !disabled) {
    boxStyle.border = "1.5px solid var(--border-dynamic-error-default,#da294b)";
  } else {
    boxStyle.border = "1.5px solid var(--border-dynamic-neutral-subtle-default,#c6c6cc)";
  }

  // Wrapper padding + hover background
  const hoverBg = state === "Hover" && !disabled;
  const wrapperPad = isCompact
    ? "p-[var(--spacing-container-s,2px)]"
    : "p-[var(--spacing-container-m,7px)]";
  const wrapperBg: React.CSSProperties = hoverBg
    ? { backgroundColor: "var(--container-dynamic-neutral-subtle-background-hover,rgba(113,113,128,0.08))" }
    : {};

  // Gap between control and label
  const gap =
    !isCompact && (!disabled || (state === "Default" && disabled))
      ? "gap-[var(--spacing-25,2px)]"
      : "gap-[var(--spacing-50,4px)]";

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
      ? "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)"
      : disabled
        ? "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)"
        : "var(--surface-foreground-static-neutral-lvl1, #13131a)";

  const checkSrc =
    state === "Default" && disabled ? CHECK_ICON_DISABLED : CHECK_ICON;
  const minusSrc =
    state === "Default" && disabled ? MINUS_ICON_DISABLED : MINUS_ICON;

  const rootClass = `flex items-center relative ${gap}`;
  const inner = (
    <>
      <div
        className={`flex items-center justify-center overflow-hidden rounded-[var(--radius-25,2px)] shrink-0 transition-colors duration-150 ${wrapperPad}`}
        style={wrapperBg}
      >
        <div className="flex items-center overflow-hidden p-[var(--spacing-container-s,2px)] shrink-0">
          <div
            className="overflow-hidden relative rounded-[var(--radius-25,2px)] shrink-0 h-[16px] w-[16px] transition-colors duration-150"
            style={boxStyle}
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
          className="[word-break:break-word] font-['DM_Sans'] [font-family:var(--body-md-regular-family,'DM_Sans')] [font-weight:var(--body-md-regular-weight,400)] leading-[var(--body-md-regular-line-height,20px)] not-italic relative shrink-0 text-[length:var(--body-md-regular-size,14px)] whitespace-nowrap"
          style={{ color: labelColor }}
        >
          {labelValue}
        </p>
      )}
    </>
  );

  if (interactive) {
    return (
      <button
        type="button"
        role="checkbox"
        aria-checked={isPartial ? "mixed" : isChecked}
        aria-disabled={disabled}
        onMouseEnter={() => setPointerHover(true)}
        onMouseLeave={() => setPointerHover(false)}
        onFocus={(e) => setFocused(e.currentTarget.matches(":focus-visible"))}
        onBlur={() => setFocused(false)}
        onClick={onToggle}
        className={`${rootClass} border-0 bg-transparent p-0 text-left outline-none rounded-[2px] cursor-pointer`}
        style={focused ? { boxShadow: FOCUS_RING } : undefined}
      >
        {inner}
      </button>
    );
  }

  return (
    <div
      className={`${rootClass} ${disabled ? "cursor-not-allowed" : ""}`}
      onMouseEnter={() => !disabled && setPointerHover(true)}
      onMouseLeave={() => setPointerHover(false)}
    >
      {inner}
    </div>
  );
}

/** Map the primary "Checkbox" selection + Error toggle into the concrete variant. */
function toVariant(checkbox: string, error: boolean): Variant {
  const base =
    checkbox === "Checked"
      ? "Checked"
      : checkbox === "Partial"
        ? "Partial"
        : "Unchecked";
  return (error ? `${base} Error` : base) as Variant;
}

// Interactive wrapper: clicking the checkbox toggles its checked/unchecked
// value (its nature) while the panel controls seed and re-sync the base
// selection. Partial is treated as "checked" for toggle purposes.
function CheckboxPreview({ props }: { props: PropValues }): JSX.Element {
  const base = String(props.checkbox);
  const error = props.error === true;
  const disabled = props.disabled === true;
  const forcedHover = props.state === "Hover";
  const [checkbox, setCheckbox] = useState(base);
  useEffect(() => {
    setCheckbox(base);
  }, [base]);
  return (
    <Checkbox
      variant={toVariant(checkbox, error)}
      state={forcedHover ? "Hover" : "Default"}
      disabled={disabled}
      isCompact={props.isCompact === true}
      hasLabel={props.hasLabel === true}
      labelValue={String(props.labelValue)}
      onToggle={() =>
        setCheckbox((c) => (c === "Unchecked" ? base === "Unchecked" ? "Checked" : base : "Unchecked"))
      }
    />
  );
}

const checkboxConfig: PlaygroundConfig = {
  name: "Checkbox",
  scopeId: "check/checkbox",
  description:
    "Selection control — Unchecked / Checked / Partial, with error, hover, disabled and compact axes.",
  controls: [
    {
      kind: "select",
      name: "checkbox",
      label: "Checkbox",
      options: ["Unchecked", "Checked", "Partial"],
      defaultValue: "Unchecked",
      asTabs: true,
    },
    { kind: "boolean", name: "error", label: "Error", defaultValue: false },
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Default", "Hover"],
      defaultValue: "Default",
    },
    { kind: "boolean", name: "disabled", label: "Disabled", defaultValue: false },
    { kind: "boolean", name: "isCompact", label: "Compact", defaultValue: true },
    { kind: "boolean", name: "hasLabel", label: "Show label", defaultValue: true },
    { kind: "text", name: "labelValue", label: "Label", defaultValue: "Option" },
  ],
  render: (props: PropValues) => <CheckboxPreview props={props} />,
  tokens: {
    "controls/background/selected": "var(--controls-background-selected)",
    "controls/background/disabled": "var(--controls-background-disabled)",
    "border/dynamic/error/default": "var(--border-dynamic-error-default)",
    "border/dynamic/neutral/subtle/default":
      "var(--border-dynamic-neutral-subtle-default)",
    "border/dynamic/neutral/subtle/hover":
      "var(--border-dynamic-neutral-subtle-hover)",
    "border/dynamic/neutral/subtle/disabled":
      "var(--border-dynamic-neutral-subtle-disabled)",
    "container/dynamic/neutral/subtle/background/hover":
      "var(--container-dynamic-neutral-subtle-background-hover)",
    "surface/foreground/static/neutral/lvl1":
      "var(--surface-foreground-static-neutral-lvl1)",
    "surface/foreground/dynamic/neutral/disabled":
      "var(--surface-foreground-dynamic-neutral-disabled)",
    "radius/25": "var(--radius-25)",
    "spacing/container/s": "var(--spacing-container-s)",
    "spacing/container/m": "var(--spacing-container-m)",
    "spacing/25": "var(--spacing-25)",
    "spacing/50": "var(--spacing-50)",
    "Body Md/Regular": "var(--body-md-regular-size)",
  },
};

export default function CheckPage() {
  return (
    <section aria-label="Checkbox component playground" className="flex flex-col gap-6">
      <Playground config={checkboxConfig} />
    </section>
  );
}
