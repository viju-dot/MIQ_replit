import { useState } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

/* ------------------------------------------------------------------ *
 * Shared design tokens (Tailwind v4 var() fallbacks flattened to v3) *
 * ------------------------------------------------------------------ */

const fontMedium = { fontFamily: '"DM Sans", Helvetica', fontWeight: 500 } as const;
const fontRegular = { fontFamily: '"DM Sans", Helvetica', fontWeight: 400 } as const;

const ASSET = "/figmaAssets/badges";

/* ------------------------------------------------------------------ *
 * Badge / Standard                                                    *
 * ------------------------------------------------------------------ */

type StdType = "neutral" | "brand" | "info" | "success" | "warning" | "danger";
type StdStyle = "Filled" | "Outline" | "duotone";

type StdColors = {
  bg?: string;
  border?: string;
  fg: string;
};

// Resolve the visual colors for a standard badge given type + style.
function stdColors(type: StdType, style: StdStyle): StdColors {
  const map: Record<StdType, Record<StdStyle, StdColors>> = {
    neutral: {
      Filled: {
        bg: "var(--container-static-neutral-bold-background,#4b4b59)",
        fg: "var(--container-static-neutral-bold-foreground,#f7f7fa)",
      },
      Outline: {
        border: "var(--border-static-bold-neutral,#4b4b59)",
        fg: "var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)",
      },
      duotone: {
        bg: "var(--container-static-neutral-subtle-background,#ebebf0)",
        fg: "var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)",
      },
    },
    brand: {
      Filled: {
        bg: "var(--container-dynamic-brand-bold-background-default,#7c33b5)",
        fg: "var(--container-dynamic-brand-bold-foreground-default,#ffffff)",
      },
      Outline: { border: "var(--container-dynamic-brand-subtle-background-hover,#e7c7ff)", fg: "#411661" },
      duotone: { bg: "var(--container-dynamic-brand-subtle-background-default,#f6ebff)", fg: "#411661" },
    },
    info: {
      Filled: {
        bg: "var(--container-static-info-bold-background,#2360db)",
        fg: "var(--container-static-info-bold-foreground,#ffffff)",
      },
      Outline: {
        border: "var(--border-static-bold-info,#2360db)",
        fg: "var(--container-dynamic-info-subtle-foreground-selected,#1344a8)",
      },
      duotone: {
        bg: "var(--container-dynamic-info-subtle-background-selected,#ebf1ff)",
        fg: "var(--container-dynamic-info-subtle-foreground-selected,#1344a8)",
      },
    },
    success: {
      Filled: {
        bg: "var(--container-static-success-bold-background,#1e8158)",
        fg: "var(--container-static-success-bold-foreground,#ffffff)",
      },
      Outline: {
        border: "var(--container-dynamic-success-subtle-foreground-default,#1e8158)",
        fg: "var(--container-static-success-subtle-foreground-variation,#115639)",
      },
      duotone: { bg: "#e5f2ec", fg: "var(--container-static-success-subtle-foreground-variation,#115639)" },
    },
    warning: {
      Filled: {
        bg: "var(--container-static-warning-bold-background,#f8c500)",
        fg: "var(--container-dynamic-warning-bold-foreground-default,#241c00)",
      },
      Outline: {
        border: "var(--border-static-bold-warning,#f8c500)",
        fg: "var(--container-dynamic-warning-subtle-foreground-default,#483800)",
      },
      duotone: { bg: "#fff8dd", fg: "var(--container-dynamic-warning-subtle-foreground-default,#483800)" },
    },
    danger: {
      Filled: {
        bg: "var(--container-static-error-bold-background,#da294b)",
        fg: "var(--container-static-error-bold-foreground,#ffffff)",
      },
      Outline: {
        border: "var(--border-static-bold-error,#da294b)",
        fg: "var(--container-dynamic-error-subtle-foreground-selected,#ad102c)",
      },
      duotone: { bg: "#ffe9ed", fg: "var(--container-dynamic-error-subtle-foreground-selected,#ad102c)" },
    },
  };
  return map[type][style];
}

// Icon per type: neutral/brand => fire, info => info, success => check-circle,
// warning/danger => warning. duotone neutral uses eye.
function stdIcon(type: StdType, style: StdStyle, compact: boolean): string {
  if (type === "success") return `${ASSET}/check-circle-16.svg`;
  if (type === "warning" || type === "danger") return `${ASSET}/warning-16.svg`;
  if (type === "info") return compact ? `${ASSET}/info-16.svg` : `${ASSET}/info-24.svg`;
  if (type === "neutral" && style === "duotone" && compact)
    return `${ASSET}/eye-16.svg`;
  return compact ? `${ASSET}/fire-16.svg` : `${ASSET}/fire-24.svg`;
}

type BadgeStandardProps = {
  type?: StdType;
  style?: StdStyle;
  icon?: boolean;
  compact?: boolean;
  label?: string;
};

function BadgeStandard({
  type = "neutral",
  style = "Filled",
  icon = false,
  compact = false,
  label,
}: BadgeStandardProps) {
  const c = stdColors(type, style);
  const iconSrc = stdIcon(type, style, compact);
  const iconPx = compact ? 16 : 24;

  const containerStyle: React.CSSProperties = {
    backgroundColor: c.bg,
    ...(c.border
      ? { border: `1px solid ${c.border}` }
      : {}),
    color: c.fg,
  };

  if (compact) {
    return (
      <div
        className="inline-flex h-[18px] items-center justify-center gap-[2px] rounded-[var(--radius-25,2px)]"
        style={{
          ...containerStyle,
          paddingLeft: icon ? 2 : 3,
          paddingRight: 3,
        }}
      >
        {icon && (
          <span className="flex size-[16px] items-center justify-center">
            <img alt="" className="block max-w-none" src={iconSrc} />
          </span>
        )}
        <p
          className="whitespace-nowrap text-center text-[length:var(--body-sm-medium-size,12px)] leading-[var(--body-sm-medium-line-height,18px)]"
          style={{ ...fontMedium, color: c.fg }}
        >
          {label ?? "Badge Small"}
        </p>
      </div>
    );
  }

  return (
    <div
      className="inline-flex h-[34px] items-center justify-center gap-[4px] rounded-[var(--radius-25,2px)]"
      style={{
        ...containerStyle,
        paddingLeft: icon ? 6 : 8,
        paddingRight: 8,
        paddingTop: 8,
        paddingBottom: 8,
      }}
    >
      {icon && (
        <span className="flex size-[24px] items-center justify-center">
          <img
            alt=""
            className="block max-w-none"
            style={{ width: iconPx, height: iconPx }}
            src={iconSrc}
          />
        </span>
      )}
      <p
        className="whitespace-nowrap text-center text-[length:var(--body-md-medium-size,14px)] leading-[var(--body-md-medium-line-height,20px)]"
        style={{ ...fontMedium, color: c.fg }}
      >
        {label ?? "Badge Large"}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Badge / Rounded                                                     *
 * ------------------------------------------------------------------ */

type RoundedType =
  | "Brand (Bold)"
  | "Neutral (Subtle)"
  | "Brand (Subtle)"
  | "Info"
  | "Success"
  | "Warning"
  | "Danger";
type RoundedSize = "Standard" | "Compact";
type RoundedStyle = "Filled" | "Outline";

function roundedColors(
  type: RoundedType,
  style: RoundedStyle,
): StdColors {
  const filled: Record<RoundedType, StdColors> = {
    "Brand (Bold)": {
      bg: "var(--container-dynamic-brand-bold-background-default,#7c33b5)",
      fg: "var(--container-dynamic-brand-bold-foreground-default,#ffffff)",
    },
    "Neutral (Subtle)": {
      bg: "var(--container-static-neutral-subtle-background,#ebebf0)",
      fg: "var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)",
    },
    "Brand (Subtle)": { bg: "var(--container-dynamic-brand-subtle-background-default,#f6ebff)", fg: "#411661" },
    Info: {
      bg: "var(--container-static-info-bold-background,#2360db)",
      fg: "var(--container-static-info-bold-foreground,#ffffff)",
    },
    Success: {
      bg: "var(--container-static-success-bold-background,#1e8158)",
      fg: "var(--container-static-success-bold-foreground,#ffffff)",
    },
    Warning: {
      bg: "var(--container-static-warning-bold-background,#f8c500)",
      fg: "var(--container-dynamic-warning-bold-foreground-default,#241c00)",
    },
    Danger: {
      bg: "var(--container-static-error-bold-background,#da294b)",
      fg: "var(--container-static-error-bold-foreground,#ffffff)",
    },
  };
  const outline: Record<RoundedType, StdColors> = {
    "Brand (Bold)": { border: "var(--border-dynamic-brand-default,#7c33b5)", fg: "#411661" },
    "Neutral (Subtle)": {
      border: "var(--border-static-bold-neutral,#4b4b59)",
      fg: "var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)",
    },
    "Brand (Subtle)": { border: "var(--container-dynamic-brand-subtle-background-hover,#e7c7ff)", fg: "#411661" },
    Info: {
      border: "var(--border-static-bold-info,#2360db)",
      fg: "var(--container-dynamic-info-subtle-foreground-selected,#1344a8)",
    },
    Success: {
      border: "var(--container-dynamic-success-subtle-foreground-default,#1e8158)",
      fg: "var(--container-static-success-subtle-foreground-variation,#115639)",
    },
    Warning: {
      border: "var(--border-static-bold-warning,#f8c500)",
      fg: "var(--container-dynamic-warning-subtle-foreground-default,#483800)",
    },
    Danger: {
      border: "var(--border-static-bold-error,#da294b)",
      fg: "var(--container-dynamic-error-subtle-foreground-selected,#ad102c)",
    },
  };
  return style === "Filled" ? filled[type] : outline[type];
}

type BadgeRoundedProps = {
  type: RoundedType;
  size: RoundedSize;
  style: RoundedStyle;
  label?: string;
};

function BadgeRounded({ type, size, style, label }: BadgeRoundedProps) {
  const c = roundedColors(type, style);
  const compact = size === "Compact";
  return (
    <div
      className="inline-flex items-center justify-center gap-[4px] rounded-[var(--old-radiuses-round,100px)] px-[8px] py-[2px]"
      style={{
        backgroundColor: c.bg,
        ...(c.border ? { border: `1px solid ${c.border}` } : {}),
        height: compact ? 18 : 24,
      }}
    >
      <p
        className="whitespace-nowrap text-center"
        style={{
          ...fontMedium,
          color: c.fg,
          fontSize: compact ? 12 : 14,
          lineHeight: compact ? "18px" : "20px",
        }}
      >
        {label ?? "Label title"}
      </p>
    </div>
  );
}

// Pro / Pro+ gradient rounded badges.
function BadgePro({ variant }: { variant: "Pro" | "Pro+" }) {
  const gradient =
    variant === "Pro+"
      ? "linear-gradient(to right, var(--gradients-sigma-1,#d71982) 25.5%, var(--gradients-sigma-2,#ff540c) 59.4%, var(--gradients-sigma-3,#f0e812) 100%)"
      : "linear-gradient(to right, #d71a82 50.5%, #f456ca 100%)";
  return (
    <div
      className="inline-flex h-[18px] items-center justify-center gap-[4px] rounded-[var(--old-radiuses-round,100px)] px-[8px] py-[2px]"
      style={{ backgroundImage: gradient }}
    >
      <p
        className="whitespace-nowrap text-center text-[length:var(--body-sm-medium-size,12px)] leading-[var(--body-sm-medium-line-height,18px)]"
        style={{ ...fontMedium, color: "var(--container-static-brand-bold-foreground,#ffffff)" }}
      >
        {variant}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Badge / With digits                                                 *
 * ------------------------------------------------------------------ */

type DigitsVariant = "Single" | "Brand (Subtle)" | "Disabled" | "Double" | "Max";

function BadgeDigits({ variant }: { variant: DigitsVariant }) {
  const value =
    variant === "Max" ? "99+" : variant === "Double" ? "12" : "4";
  let bg = "var(--container-static-neutral-subtle-background,#ebebf0)";
  let fg = "var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)";
  if (variant === "Brand (Subtle)") {
    bg = "var(--container-dynamic-brand-subtle-background-default,#f6ebff)";
    fg = "var(--container-static-brand-subtle-foreground-variation,#662994)";
  } else if (variant === "Disabled") {
    bg = "var(--controls-background-disabled,rgba(113,113,128,0.1))";
    fg = "var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)";
  }
  return (
    <div
      className="inline-flex h-[18px] items-center justify-center rounded-[var(--old-radiuses-round,100px)] px-[8px]"
      style={{ backgroundColor: bg }}
    >
      <p
        className="whitespace-nowrap text-center text-[length:var(--body-sm-medium-size,12px)] leading-[var(--body-sm-medium-line-height,18px)]"
        style={{ ...fontMedium, color: fg }}
      >
        {value}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Badge / Circular                                                    *
 * ------------------------------------------------------------------ */

function BadgeCircular({ size }: { size: 24 | 32 | 40 }) {
  const src =
    size === 40
      ? `${ASSET}/circular-40.svg`
      : size === 32
        ? `${ASSET}/circular-32.svg`
        : `${ASSET}/circular-24.svg`;
  const fontSize = size === 40 ? 16 : size === 32 ? 14 : 12;
  const lineHeight = size === 40 ? "24px" : size === 32 ? "20px" : "18px";
  return (
    <div className="relative" style={{ width: size, height: size }}>
      <img
        alt=""
        className="absolute inset-0 block size-full max-w-none"
        src={src}
      />
      <p
        className="absolute left-1/2 -translate-x-1/2 text-center"
        style={{
          ...fontMedium,
          color: "var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)",
          fontSize,
          lineHeight,
          top: `calc(50% - ${size === 40 ? 12 : size === 32 ? 10 : 9}px)`,
        }}
      >
        M
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Badge / Description (interactive checkbox)                          *
 * ------------------------------------------------------------------ */

type DescriptionProps = {
  checkbox: boolean;
  disabled?: boolean;
  title?: string;
  metadata?: string;
};

function BadgeDescription({
  checkbox,
  disabled = false,
  title = "Title",
  metadata = "Metadata",
}: DescriptionProps) {
  const [checked, setChecked] = useState(false);

  const bg = disabled
    ? "var(--controls-background-disabled,rgba(113,113,128,0.1))"
    : "var(--container-static-neutral-subtle-background,#ebebf0)";
  const border = disabled
    ? "var(--border-dynamic-neutral-subtle-disabled,#e1e1e8)"
    : "var(--border-dynamic-neutral-subtle-default,#c6c6cc)";
  const titleColor = disabled
    ? "var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)"
    : "var(--surface-foreground-static-neutral-lvl1,#13131a)";

  return (
    <div
      className="flex w-[200px] items-start gap-[5px] rounded-[var(--radius-50,4px)]"
      style={{ backgroundColor: bg, border: `1px solid ${border}` }}
    >
      <div className="flex flex-1 items-start gap-[5px] px-[8px] py-[5px]">
        <div className="flex flex-1 items-start gap-[6px]">
          {checkbox && (
            <div className="flex items-center justify-center p-[2px]">
              <div className="flex items-center p-[2px]">
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => !disabled && setChecked((v) => !v)}
                  className="flex size-[16px] items-center justify-center overflow-hidden rounded-[var(--radius-25,2px)]"
                  style={{
                    border: `1.5px solid ${
                      checked && !disabled
                        ? "var(--controls-background-active,#7c33b5)"
                        : border
                    }`,
                    backgroundColor: checked
                      ? disabled
                        ? "var(--controls-background-disabled,rgba(113,113,128,0.1))"
                        : "var(--controls-background-active,#7c33b5)"
                      : "transparent",
                    cursor: disabled ? "default" : "pointer",
                  }}
                  aria-label="Toggle"
                >
                  {checked && !disabled && (
                    <svg
                      width="10"
                      height="10"
                      viewBox="0 0 10 10"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M8.5 2.5L3.75 7.25L1.5 5"
                        stroke="var(--controls-foreground-default,#ffffff)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}
          <div className="flex flex-1 items-center justify-center pt-[3px]">
            <p
              className="flex-1 text-[length:var(--body-sm-medium-size,12px)] leading-[var(--body-sm-medium-line-height,18px)]"
              style={{ color: titleColor }}
            >
              <span style={fontMedium}>{title}: </span>
              <span style={fontRegular}>{metadata}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-start gap-[4px] self-stretch">
        <span className="flex w-[16px] items-start justify-end pt-[4px]">
          <span className="flex size-[16px] items-center justify-center">
            <img alt="" className="block size-[10px]" src={`${ASSET}/close-x.svg`} />
          </span>
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Playground configs                                                  *
 * ------------------------------------------------------------------ */

const standardConfig: PlaygroundConfig = {
  name: "Badge / Standard",
  description:
    "Rectangular status badge — Type, Style, optional icon, and Compact/Standard size.",
  controls: [
    {
      kind: "select",
      name: "type",
      label: "Type",
      options: ["neutral", "brand", "info", "success", "warning", "danger"],
      defaultValue: "brand",
      asTabs: true,
    },
    {
      kind: "select",
      name: "style",
      label: "Style",
      options: ["Filled", "Outline", "duotone"],
      defaultValue: "Filled",
    },
    { kind: "boolean", name: "compact", label: "Compact", defaultValue: false },
    { kind: "boolean", name: "icon", label: "Icon", defaultValue: false },
    {
      kind: "text",
      name: "label",
      label: "Label",
      defaultValue: "",
      placeholder: "Badge Large",
    },
  ],
  render: (props) => (
    <BadgeStandard
      type={props.type as StdType}
      style={props.style as StdStyle}
      compact={props.compact === true}
      icon={props.icon === true}
      label={typeof props.label === "string" && props.label ? props.label : undefined}
    />
  ),
  tokens: {
    "container/static/neutral/bold/background": "var(--container-static-neutral-bold-background)",
    "container/dynamic/brand/bold/background/default": "var(--container-dynamic-brand-bold-background-default)",
    "container/static/info/bold/background": "var(--container-static-info-bold-background)",
    "container/static/success/bold/background": "var(--container-static-success-bold-background)",
    "container/static/warning/bold/background": "var(--container-static-warning-bold-background)",
    "container/static/error/bold/background": "var(--container-static-error-bold-background)",
    "radius/25": "var(--radius-25)",
    "Body Md/Medium": "var(--body-md-medium-size)",
    "Body Sm/Medium": "var(--body-sm-medium-size)",
  },
};

const roundedConfig: PlaygroundConfig = {
  name: "Badge / Rounded",
  description:
    "Pill badge — Type, Filled/Outline style, and Standard/Compact size. Pro variants use brand gradients.",
  controls: [
    {
      kind: "select",
      name: "type",
      label: "Type",
      options: [
        "Brand (Bold)",
        "Neutral (Subtle)",
        "Brand (Subtle)",
        "Info",
        "Success",
        "Warning",
        "Danger",
        "Pro",
        "Pro+",
      ],
      defaultValue: "Brand (Bold)",
      asTabs: true,
    },
    {
      kind: "select",
      name: "style",
      label: "Style",
      options: ["Filled", "Outline"],
      defaultValue: "Filled",
    },
    {
      kind: "select",
      name: "size",
      label: "Size",
      options: ["Standard", "Compact"],
      defaultValue: "Standard",
    },
    {
      kind: "text",
      name: "label",
      label: "Label",
      defaultValue: "",
      placeholder: "Label title",
    },
  ],
  render: (props) => {
    if (props.type === "Pro" || props.type === "Pro+") {
      return <BadgePro variant={props.type as "Pro" | "Pro+"} />;
    }
    return (
      <BadgeRounded
        type={props.type as RoundedType}
        style={props.style as RoundedStyle}
        size={props.size as RoundedSize}
        label={
          typeof props.label === "string" && props.label ? props.label : undefined
        }
      />
    );
  },
  tokens: {
    "container/dynamic/brand/bold/background/default": "var(--container-dynamic-brand-bold-background-default)",
    "container/static/neutral/subtle/background": "var(--container-static-neutral-subtle-background)",
    "container/dynamic/brand/subtle/background/default": "var(--container-dynamic-brand-subtle-background-default)",
    "old/radiuses/round": "var(--old-radiuses-round)",
    "gradients/sigma/1": "var(--gradients-sigma-1)",
    "gradients/sigma/2": "var(--gradients-sigma-2)",
    "gradients/sigma/3": "var(--gradients-sigma-3)",
    "Body Md/Medium": "var(--body-md-medium-size)",
    "Body Sm/Medium": "var(--body-sm-medium-size)",
  },
};

const digitsConfig: PlaygroundConfig = {
  name: "Badge / With digits",
  description: "Numeric counter pill — Single, Brand, Disabled, Double, or Max value.",
  controls: [
    {
      kind: "select",
      name: "variant",
      label: "Variant",
      options: ["Single", "Brand (Subtle)", "Disabled", "Double", "Max"],
      defaultValue: "Single",
      asTabs: true,
    },
  ],
  render: (props) => <BadgeDigits variant={props.variant as DigitsVariant} />,
  tokens: {
    "container/static/neutral/subtle/background": "var(--container-static-neutral-subtle-background)",
    "container/dynamic/brand/subtle/background/default": "var(--container-dynamic-brand-subtle-background-default)",
    "controls/background/disabled": "var(--controls-background-disabled)",
    "container/dynamic/neutral/subtle/foreground/default/regular": "var(--container-dynamic-neutral-subtle-foreground-default-regular)",
    "container/static/brand/subtle/foreground/variation": "var(--container-static-brand-subtle-foreground-variation)",
    "container/dynamic/neutral/subtle/foreground/disabled": "var(--container-dynamic-neutral-subtle-foreground-disabled)",
    "old/radiuses/round": "var(--old-radiuses-round)",
  },
};

const circularConfig: PlaygroundConfig = {
  name: "Badge / Circular",
  description: "Circular avatar-style badge — 24, 32, or 40px.",
  controls: [
    {
      kind: "select",
      name: "size",
      label: "Size",
      options: ["24", "32", "40"],
      defaultValue: "40",
      asTabs: true,
    },
  ],
  render: (props) => (
    <BadgeCircular size={Number(props.size) as 24 | 32 | 40} />
  ),
  tokens: {
    "container/dynamic/neutral/subtle/foreground/default/regular": "var(--container-dynamic-neutral-subtle-foreground-default-regular)",
    "size/sm": "24px · text 12px",
    "size/md": "32px · text 14px",
    "size/lg": "40px · text 16px",
  },
};

const descriptionConfig: PlaygroundConfig = {
  name: "Badge / Description",
  description:
    "Metadata chip with optional checkbox and dismiss — supports Active and Disabled states.",
  controls: [
    {
      kind: "boolean",
      name: "checkbox",
      label: "Checkbox",
      defaultValue: true,
    },
    {
      kind: "boolean",
      name: "disabled",
      label: "Disabled",
      defaultValue: false,
    },
    {
      kind: "text",
      name: "title",
      label: "Title",
      defaultValue: "Title",
      placeholder: "Title",
    },
    {
      kind: "text",
      name: "metadata",
      label: "Metadata",
      defaultValue: "Metadata",
      placeholder: "Metadata",
    },
  ],
  render: (props) => (
    <BadgeDescription
      key={`${props.checkbox}-${props.disabled}`}
      checkbox={props.checkbox === true}
      disabled={props.disabled === true}
      title={typeof props.title === "string" ? props.title : "Title"}
      metadata={typeof props.metadata === "string" ? props.metadata : "Metadata"}
    />
  ),
  tokens: {
    "container/static/neutral/subtle/background": "var(--container-static-neutral-subtle-background)",
    "controls/background/disabled": "var(--controls-background-disabled)",
    "border/dynamic/neutral/subtle/default": "var(--border-dynamic-neutral-subtle-default)",
    "border/dynamic/neutral/subtle/disabled": "var(--border-dynamic-neutral-subtle-disabled)",
    "controls/background/active": "var(--controls-background-active)",
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "container/dynamic/neutral/subtle/foreground/disabled": "var(--container-dynamic-neutral-subtle-foreground-disabled)",
    "radius/50": "var(--radius-50)",
  },
};

/* ------------------------------------------------------------------ *
 * Page                                                                *
 * ------------------------------------------------------------------ */

export default function Badges(): JSX.Element {
  return (
    <section className="flex flex-col gap-6" aria-label="Badges">
      <Playground config={standardConfig} />
      <Playground config={roundedConfig} />
      <Playground config={digitsConfig} />
      <Playground config={circularConfig} />
      <Playground config={descriptionConfig} />
    </section>
  );
}
