import { useState } from "react";

/* ------------------------------------------------------------------ *
 * Shared design tokens (Tailwind v4 var() fallbacks flattened to v3) *
 * ------------------------------------------------------------------ */

const caption = "text-[12px] text-[#a8a8b2]";
const cardClass =
  "rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5";
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
      Filled: { bg: "#4b4b59", fg: "#f7f7fa" },
      Outline: { border: "#4b4b59", fg: "#4b4b59" },
      duotone: { bg: "#ebebf0", fg: "#4b4b59" },
    },
    brand: {
      Filled: { bg: "#7c33b5", fg: "#ffffff" },
      Outline: { border: "#e7c7ff", fg: "#411661" },
      duotone: { bg: "#f6ebff", fg: "#411661" },
    },
    info: {
      Filled: { bg: "#2360db", fg: "#ffffff" },
      Outline: { border: "#2360db", fg: "#1344a8" },
      duotone: { bg: "#ebf1ff", fg: "#1344a8" },
    },
    success: {
      Filled: { bg: "#1e8158", fg: "#ffffff" },
      Outline: { border: "#1e8158", fg: "#115639" },
      duotone: { bg: "#e5f2ec", fg: "#115639" },
    },
    warning: {
      Filled: { bg: "#f8c500", fg: "#241c00" },
      Outline: { border: "#f8c500", fg: "#483800" },
      duotone: { bg: "#fff8dd", fg: "#483800" },
    },
    danger: {
      Filled: { bg: "#da294b", fg: "#ffffff" },
      Outline: { border: "#da294b", fg: "#ad102c" },
      duotone: { bg: "#ffe9ed", fg: "#ad102c" },
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
};

function BadgeStandard({
  type = "neutral",
  style = "Filled",
  icon = false,
  compact = false,
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
        className="inline-flex h-[18px] items-center justify-center gap-[2px] rounded-[2px]"
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
          className="whitespace-nowrap text-center text-[12px] leading-[18px]"
          style={{ ...fontMedium, color: c.fg }}
        >
          Badge Small
        </p>
      </div>
    );
  }

  return (
    <div
      className="inline-flex h-[34px] items-center justify-center gap-[4px] rounded-[2px]"
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
        className="whitespace-nowrap text-center text-[14px] leading-[20px]"
        style={{ ...fontMedium, color: c.fg }}
      >
        Badge Large
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
    "Brand (Bold)": { bg: "#7c33b5", fg: "#ffffff" },
    "Neutral (Subtle)": { bg: "#ebebf0", fg: "#4b4b59" },
    "Brand (Subtle)": { bg: "#f6ebff", fg: "#411661" },
    Info: { bg: "#2360db", fg: "#ffffff" },
    Success: { bg: "#1e8158", fg: "#ffffff" },
    Warning: { bg: "#f8c500", fg: "#241c00" },
    Danger: { bg: "#da294b", fg: "#ffffff" },
  };
  const outline: Record<RoundedType, StdColors> = {
    "Brand (Bold)": { border: "#7c33b5", fg: "#411661" },
    "Neutral (Subtle)": { border: "#4b4b59", fg: "#4b4b59" },
    "Brand (Subtle)": { border: "#e7c7ff", fg: "#411661" },
    Info: { border: "#2360db", fg: "#1344a8" },
    Success: { border: "#1e8158", fg: "#115639" },
    Warning: { border: "#f8c500", fg: "#483800" },
    Danger: { border: "#da294b", fg: "#ad102c" },
  };
  return style === "Filled" ? filled[type] : outline[type];
}

type BadgeRoundedProps = {
  type: RoundedType;
  size: RoundedSize;
  style: RoundedStyle;
};

function BadgeRounded({ type, size, style }: BadgeRoundedProps) {
  const c = roundedColors(type, style);
  const compact = size === "Compact";
  return (
    <div
      className="inline-flex items-center justify-center gap-[4px] rounded-[100px] px-[8px] py-[2px]"
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
        Label title
      </p>
    </div>
  );
}

// Pro / Pro+ gradient rounded badges.
function BadgePro({ variant }: { variant: "Pro" | "Pro+" }) {
  const gradient =
    variant === "Pro+"
      ? "linear-gradient(to right, #d71982 25.5%, #ff540c 59.4%, #f0e812 100%)"
      : "linear-gradient(to right, #d71a82 50.5%, #f456ca 100%)";
  return (
    <div
      className="inline-flex h-[18px] items-center justify-center gap-[4px] rounded-[100px] px-[8px] py-[2px]"
      style={{ backgroundImage: gradient }}
    >
      <p
        className="whitespace-nowrap text-center text-[12px] leading-[18px]"
        style={{ ...fontMedium, color: "#ffffff" }}
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
  let bg = "#ebebf0";
  let fg = "#4b4b59";
  if (variant === "Brand (Subtle)") {
    bg = "#f6ebff";
    fg = "#662994";
  } else if (variant === "Disabled") {
    bg = "rgba(113,113,128,0.1)";
    fg = "#a8a8b2";
  }
  return (
    <div
      className="inline-flex h-[18px] items-center justify-center rounded-[100px] px-[8px]"
      style={{ backgroundColor: bg }}
    >
      <p
        className="whitespace-nowrap text-center text-[12px] leading-[18px]"
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
          color: "#4b4b59",
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
};

function BadgeDescription({ checkbox, disabled = false }: DescriptionProps) {
  const [checked, setChecked] = useState(false);

  const bg = disabled ? "rgba(113,113,128,0.1)" : "#ebebf0";
  const border = disabled ? "#e1e1e8" : "#c6c6cc";
  const titleColor = disabled ? "#a8a8b2" : "#13131a";

  return (
    <div
      className="flex w-[200px] items-start gap-[5px] rounded-[4px]"
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
                  className="flex size-[16px] items-center justify-center overflow-hidden rounded-[2px]"
                  style={{
                    border: `1.5px solid ${
                      checked && !disabled ? "#7c33b5" : border
                    }`,
                    backgroundColor: checked
                      ? disabled
                        ? "rgba(113,113,128,0.1)"
                        : "#7c33b5"
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
                        stroke="#ffffff"
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
              className="flex-1 text-[12px] leading-[18px]"
              style={{ color: titleColor }}
            >
              <span style={fontMedium}>Title: </span>
              <span style={fontRegular}>Metadata</span>
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
 * Layout helpers                                                      *
 * ------------------------------------------------------------------ */

function VariantCell({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className={`${caption} px-1`} style={fontRegular}>
        {label}
      </span>
      <div className="flex min-h-[34px] items-center">{children}</div>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Page                                                                *
 * ------------------------------------------------------------------ */

const STANDARD_TYPES: StdType[] = [
  "neutral",
  "brand",
  "info",
  "success",
  "warning",
  "danger",
];
const STANDARD_STYLES: StdStyle[] = ["Filled", "Outline", "duotone"];

const ROUNDED_TYPES: RoundedType[] = [
  "Brand (Bold)",
  "Neutral (Subtle)",
  "Brand (Subtle)",
  "Info",
  "Success",
  "Warning",
  "Danger",
];

export default function Badges(): JSX.Element {
  return (
    <section className="flex flex-col gap-8" aria-label="Badges">
      {/* ---------------------------------------------------------- */}
      {/* Badge / Standard */}
      {/* ---------------------------------------------------------- */}
      <div className={cardClass}>
        <h2 className="mb-4 text-[14px]" style={fontMedium}>
          Badge / Standard
        </h2>
        <div className="flex flex-col gap-6">
          {STANDARD_TYPES.map((type) => (
            <div key={type} className="flex flex-col gap-2">
              <span className={caption} style={fontMedium}>
                Type = {type}
              </span>
              <div className="flex flex-wrap gap-x-8 gap-y-4">
                {STANDARD_STYLES.map((style) =>
                  [false, true].map((compact) =>
                    [false, true].map((icon) => (
                      <VariantCell
                        key={`${style}-${compact}-${icon}`}
                        label={`${style} · ${compact ? "compact" : "standard"} · ${
                          icon ? "icon" : "no icon"
                        }`}
                      >
                        <BadgeStandard
                          type={type}
                          style={style}
                          compact={compact}
                          icon={icon}
                        />
                      </VariantCell>
                    )),
                  ),
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Badge / Rounded */}
      {/* ---------------------------------------------------------- */}
      <div className={cardClass}>
        <h2 className="mb-4 text-[14px]" style={fontMedium}>
          Badge / Rounded
        </h2>
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          {ROUNDED_TYPES.map((type) =>
            (["Filled", "Outline"] as RoundedStyle[]).map((style) =>
              (["Standard", "Compact"] as RoundedSize[]).map((size) => (
                <VariantCell
                  key={`${type}-${style}-${size}`}
                  label={`${type} · ${style} · ${size}`}
                >
                  <BadgeRounded type={type} style={style} size={size} />
                </VariantCell>
              )),
            ),
          )}
          <VariantCell label="pro · Compact · Filled">
            <BadgePro variant="Pro" />
          </VariantCell>
          <VariantCell label="pro+ · Compact · Filled">
            <BadgePro variant="Pro+" />
          </VariantCell>
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Badge / With digits */}
      {/* ---------------------------------------------------------- */}
      <div className={cardClass}>
        <h2 className="mb-4 text-[14px]" style={fontMedium}>
          Badge / With digits
        </h2>
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          {(
            [
              "Single",
              "Brand (Subtle)",
              "Disabled",
              "Double",
              "Max",
            ] as DigitsVariant[]
          ).map((variant) => (
            <VariantCell key={variant} label={variant}>
              <BadgeDigits variant={variant} />
            </VariantCell>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Badge / Circular */}
      {/* ---------------------------------------------------------- */}
      <div className={cardClass}>
        <h2 className="mb-4 text-[14px]" style={fontMedium}>
          Badge / Circular
        </h2>
        <div className="flex flex-wrap items-end gap-x-8 gap-y-4">
          {([24, 32, 40] as const).map((size) => (
            <VariantCell key={size} label={`${size}px`}>
              <BadgeCircular size={size} />
            </VariantCell>
          ))}
        </div>
      </div>

      {/* ---------------------------------------------------------- */}
      {/* Badge / Description */}
      {/* ---------------------------------------------------------- */}
      <div className={cardClass}>
        <h2 className="mb-4 text-[14px]" style={fontMedium}>
          Badge / Description
        </h2>
        <div className="flex flex-wrap gap-x-8 gap-y-4">
          <VariantCell label="Active · Checkbox off">
            <BadgeDescription checkbox={false} />
          </VariantCell>
          <VariantCell label="Active · Checkbox on">
            <BadgeDescription checkbox={true} />
          </VariantCell>
          <VariantCell label="Disabled · Checkbox off">
            <BadgeDescription checkbox={false} disabled />
          </VariantCell>
          <VariantCell label="Disabled · Checkbox on">
            <BadgeDescription checkbox={true} disabled />
          </VariantCell>
        </div>
      </div>
    </section>
  );
}
