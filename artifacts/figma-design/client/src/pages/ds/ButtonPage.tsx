import { useState } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

/**
 * Fiber Design System — Button page.
 *
 * Faithful reproduction of the "Buttons" Figma page, refactored into
 * interactive Playground blocks. All Tailwind v4 CSS-variable arbitrary
 * values from the reference have been replaced with their plain fallback
 * hex values for Tailwind v3.
 *
 * Design tokens extracted from the original file:
 *  - brand bold background default  #7c33b5
 *  - brand bold background hover    #702ea3
 *  - brand bold foreground          #ffffff
 *  - brand subtle foreground        #7c33b5
 *  - border brand default           #7c33b5
 *  - destructive (danger) bold      #d92d20  (fill red family)
 *  - neutral disabled surface       #7171801a
 *  - neutral disabled foreground    #a8a8b2
 *  - hover slide palette   #7c33b5 #702ea3 #7c2ea3 #882ea3 #902d9f #9b2d9f #9f2d98
 */

const caretSrc = "/figmaAssets/button/caret.svg";

// ----------------------------------------------------------------------------
// Small building blocks
// ----------------------------------------------------------------------------

type Size = "default" | "compact";

const sizeBox: Record<Size, { h: string; text: string; px: string; icon: string }> = {
  default: {
    h: "h-[var(--height-34,34px)]",
    text: "text-[length:var(--body-md-medium-size,14px)] leading-[var(--body-md-medium-line-height,20px)]",
    px: "px-[var(--spacing-150,12px)] py-[var(--odd-numbers-7,7px)]",
    icon: "size-[20px]",
  },
  compact: {
    h: "h-[24px]",
    text: "text-[length:var(--body-sm-medium-size,12px)] leading-[var(--body-sm-medium-line-height,18px)]",
    px: "px-[var(--spacing-100,8px)] py-[3px]",
    icon: "size-[16px]",
  },
};

// A simple caret icon used by dropdown buttons.
function Caret({ size = "size-[20px]", invert = false }: { size?: string; invert?: boolean }) {
  return (
    <span className={`relative shrink-0 ${size}`}>
      <img
        alt=""
        className="absolute inset-0 block size-full max-w-none"
        src={caretSrc}
        style={invert ? { filter: "brightness(0) invert(1)" } : undefined}
      />
    </span>
  );
}

// ----------------------------------------------------------------------------
// Button variants (fill / outline / none) × (primary / secondary / destructive)
// ----------------------------------------------------------------------------

type Variant = "primary" | "secondary" | "destructive";
type Appearance = "fill" | "outline" | "none";
type State = "default" | "hover" | "disabled";

const fillColors: Record<Variant, { bg: string; hoverBg: string }> = {
  primary: {
    bg: "var(--container-dynamic-brand-bold-background-default,#7c33b5)",
    hoverBg: "var(--container-dynamic-brand-bold-background-hover,#702ea3)",
  },
  secondary: {
    bg: "var(--container-dynamic-neutral-subtle-background-hover,#71718014)",
    hoverBg: "#71718029",
  },
  destructive: { bg: "#d92d20", hoverBg: "#b42318" },
};

const outlineColors: Record<Variant, { border: string; fg: string }> = {
  primary: {
    border: "var(--border-dynamic-brand-default,#7c33b5)",
    fg: "var(--surface-foreground-dynamic-brand-default,#7c33b5)",
  },
  secondary: {
    border: "var(--border-dynamic-neutral-subtle-default,#c6c6cc)",
    fg: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
  },
  destructive: { border: "#d92d20", fg: "#d92d20" },
};

const noneColors: Record<Variant, string> = {
  primary: "var(--surface-foreground-dynamic-brand-default,#7c33b5)",
  secondary: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
  destructive: "#d92d20",
};

// Raw hex values used only to build the low-opacity hover tints (color + "14")
// where the "14" alpha suffix cannot be appended to a var() reference.
const outlineHoverTint: Record<Variant, string> = {
  primary: "#7c33b5",
  secondary: "#c6c6cc",
  destructive: "#d92d20",
};

const noneHoverTint: Record<Variant, string> = {
  primary: "#7c33b5",
  secondary: "#13131a",
  destructive: "#d92d20",
};

type DemoButtonProps = {
  variant: Variant;
  appearance: Appearance;
  state?: State;
  size?: Size;
  iconOnly?: boolean;
  inverse?: boolean;
  fullWidth?: boolean;
  label?: string;
};

function DemoButton({
  variant,
  appearance,
  state = "default",
  size = "default",
  iconOnly = false,
  inverse = false,
  fullWidth = false,
  label = "Default",
}: DemoButtonProps) {
  const box = sizeBox[size];
  const disabled = state === "disabled";
  const hover = state === "hover";

  const style: React.CSSProperties = {};

  if (appearance === "fill") {
    if (inverse) {
      // Inverse primary fill: white surface, brand foreground.
      style.backgroundColor = "var(--surface-background-lvl1,#ffffff)";
      style.color = "var(--surface-foreground-dynamic-brand-default,#7c33b5)";
    } else if (variant === "secondary") {
      style.backgroundColor = hover ? fillColors.secondary.hoverBg : fillColors.secondary.bg;
      style.color = "var(--surface-foreground-static-neutral-lvl1,#13131a)";
    } else {
      style.backgroundColor = hover ? fillColors[variant].hoverBg : fillColors[variant].bg;
      style.color = "var(--container-dynamic-brand-bold-foreground-default,#ffffff)";
    }
  } else if (appearance === "outline") {
    const c = outlineColors[variant];
    style.border = `1px solid ${inverse ? "var(--surface-background-lvl1,#ffffff)" : c.border}`;
    style.color = inverse ? "var(--surface-background-lvl1,#ffffff)" : c.fg;
    style.backgroundColor = hover ? `${outlineHoverTint[variant]}14` : "transparent";
    if (inverse) style.backgroundColor = "transparent";
  } else {
    // appearance === "none"
    style.color = inverse ? "var(--surface-background-lvl1,#ffffff)" : noneColors[variant];
    style.backgroundColor = hover ? `${noneHoverTint[variant]}14` : "transparent";
  }

  if (disabled) {
    if (appearance === "fill" && !inverse && variant !== "secondary") {
      style.backgroundColor = "var(--container-dynamic-neutral-subtle-background-disabled,#7171801a)";
      style.color = "var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)";
    } else if (appearance === "fill" && variant === "secondary") {
      style.backgroundColor = "#7171800a";
      style.color = "var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)";
    } else if (appearance === "fill" && inverse) {
      style.backgroundColor = "#ffffff29";
      style.color = "#ffffff8a";
    } else if (appearance === "outline") {
      style.border = `1px solid ${inverse ? "#ffffff52" : "var(--border-dynamic-neutral-subtle-default,#c6c6cc)"}`;
      style.color = inverse ? "#ffffff8a" : "var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)";
      style.backgroundColor = "transparent";
    } else {
      style.color = inverse ? "#ffffff8a" : "var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)";
      style.backgroundColor = "transparent";
    }
  }

  return (
    <button
      type="button"
      disabled={disabled}
      style={style}
      className={`inline-flex items-center justify-center gap-[var(--numbers-6,6px)] rounded-[var(--radiuses-small,2px)] font-medium [font-weight:var(--body-md-medium-weight,500)] ${box.h} ${
        fullWidth ? "w-full" : ""
      } ${
        iconOnly ? (size === "compact" ? "w-[24px] px-0" : "w-[var(--height-34,34px)] px-0") : box.px
      } ${box.text} ${disabled ? "cursor-not-allowed" : ""}`}
    >
      {iconOnly ? (
        <span
          className={`inline-block ${size === "compact" ? "size-[16px]" : "size-[20px]"} rounded-[var(--radiuses-small,2px)]`}
          style={{ backgroundColor: "currentColor", WebkitMaskImage: "none" }}
          aria-hidden
        />
      ) : (
        <span className="whitespace-nowrap">{label}</span>
      )}
    </button>
  );
}

// ----------------------------------------------------------------------------
// Animated hover (primary solid, standard) — reproduces the 5 frames
// ----------------------------------------------------------------------------

const slidePalette = ["#7c33b5", "#702ea3", "#7c2ea3", "#882ea3", "#902d9f", "#9b2d9f", "#9f2d98"];

function AnimatedHoverButton({ dark = false }: { dark?: boolean }) {
  const base = dark
    ? "var(--illustration-brand-2,#a857e5)"
    : "var(--container-dynamic-brand-bold-background-default,#7c33b5)";
  return (
    <button
      type="button"
      className="group relative inline-flex h-[var(--height-34,34px)] items-center justify-center overflow-hidden rounded-[var(--radiuses-small,2px)] px-[var(--spacing-150,12px)] py-[var(--odd-numbers-7,7px)] text-[length:var(--body-md-medium-size,14px)] font-medium leading-[var(--body-md-medium-line-height,20px)] text-white"
      style={{ backgroundColor: base }}
    >
      {/* Sliding multi-colour background that reveals on hover (-45deg). */}
      <span
        className="pointer-events-none absolute -left-[60%] top-1/2 hidden h-[150px] w-[150px] -translate-y-1/2 -rotate-[135deg] transition-transform duration-300 group-hover:flex"
        aria-hidden
      >
        <span className="flex h-full w-full items-center">
          {slidePalette.map((c) => (
            <span key={c} className="h-full flex-1" style={{ backgroundColor: c }} />
          ))}
        </span>
      </span>
      <span className="relative z-10 whitespace-nowrap">Default</span>
    </button>
  );
}

// Static representation of the 5 animation frames (Default → hover4).
function AnimationFrames() {
  const positions = [-52.79, -40.79, -28.79, -17.33];
  return (
    <div className="flex flex-wrap items-center justify-center gap-3">
      <div className="flex flex-col items-center gap-1">
        <div
          className="inline-flex h-[var(--height-34,34px)] items-center justify-center rounded-[var(--radiuses-small,2px)] px-[var(--spacing-150,12px)] py-[var(--odd-numbers-7,7px)] text-[length:var(--body-md-medium-size,14px)] font-medium leading-[var(--body-md-medium-line-height,20px)] text-white"
          style={{ backgroundColor: "var(--container-dynamic-brand-bold-background-default,#7c33b5)" }}
        >
          Default
        </div>
        <span className="text-[length:var(--body-sm-medium-size,12px)] text-[var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)]">Default</span>
      </div>
      {positions.map((left, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div className="relative inline-flex h-[var(--height-34,34px)] items-center justify-center overflow-hidden rounded-[var(--radiuses-small,2px)] px-[var(--spacing-150,12px)] py-[var(--odd-numbers-7,7px)] text-[length:var(--body-md-medium-size,14px)] font-medium leading-[var(--body-md-medium-line-height,20px)] text-white">
            <span
              className="pointer-events-none absolute top-1/2 flex size-[150px] -translate-y-1/2 -rotate-[135deg] items-center"
              style={{ left }}
              aria-hidden
            >
              <span className="flex h-[80px] w-[133px] items-center">
                {slidePalette.map((c) => (
                  <span key={c} className="h-full flex-1" style={{ backgroundColor: c }} />
                ))}
              </span>
            </span>
            <span className="relative z-10 whitespace-nowrap">Default</span>
          </div>
          <span className="text-[length:var(--body-sm-medium-size,12px)] text-[var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)]">{`hover${i + 1}`}</span>
        </div>
      ))}
    </div>
  );
}

// ----------------------------------------------------------------------------
// Dropdown buttons (solid primary, standard + rounded) and Back-to-top
// ----------------------------------------------------------------------------

function ButtonDropdown({ rounded = false }: { rounded?: boolean }) {
  return (
    <div
      className={`inline-flex h-[var(--height-34,34px)] items-center gap-[var(--numbers-2,2px)] py-[var(--odd-numbers-7,7px)] pl-[var(--spacing-150,12px)] pr-[var(--spacing-100,8px)] text-[length:var(--body-md-medium-size,14px)] font-medium leading-[var(--body-md-medium-line-height,20px)] text-white ${
        rounded ? "rounded-[var(--old-radiuses-round,100px)]" : "rounded-[var(--radiuses-small,2px)] pr-[var(--spacing-50,4px)]"
      }`}
      style={{ backgroundColor: "var(--container-dynamic-brand-bold-background-default,#7c33b5)" }}
    >
      <span className="whitespace-nowrap">Default</span>
      <Caret invert />
    </div>
  );
}

function BackToTop() {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className={`inline-flex h-[var(--height-34,34px)] items-center gap-[var(--spacing-50,4px)] overflow-hidden py-[var(--odd-numbers-7,7px)] text-[length:var(--body-md-medium-size,14px)] font-medium leading-[var(--body-md-medium-line-height,20px)] text-white ${
        hover ? "rounded-l-[var(--radiuses-small,2px)] pl-[var(--spacing-50,4px)] pr-[var(--spacing-150,12px)]" : "w-[var(--height-34,34px)] justify-center rounded-[var(--radiuses-small,2px)]"
      }`}
      style={{ backgroundColor: hover ? "#9f2d98" : "var(--container-dynamic-brand-bold-background-default,#7c33b5)" }}
    >
      <Caret invert size="size-[24px]" />
      {hover && <span className="whitespace-nowrap">Back to top</span>}
    </button>
  );
}

// ----------------------------------------------------------------------------
// Playground configs
// ----------------------------------------------------------------------------

const buttonConfig: PlaygroundConfig = {
  name: "Button",
  description:
    "Core action button — Fill / Outline / Ghost appearances × Primary / Secondary / Destructive, with size, state, icon-only and label controls.",
  controls: [
    {
      kind: "select",
      name: "appearance",
      label: "Appearance",
      options: ["Solid (fill)", "Outline", "Ghost (none)"],
      defaultValue: "Solid (fill)",
      asTabs: true,
    },
    {
      kind: "select",
      name: "variant",
      label: "Variant",
      options: ["Primary", "Secondary", "Destructive"],
      defaultValue: "Primary",
    },
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Default", "Hover", "Disabled"],
      defaultValue: "Default",
    },
    {
      kind: "select",
      name: "size",
      label: "Size",
      options: ["Default", "Compact"],
      defaultValue: "Default",
    },
    { kind: "boolean", name: "iconOnly", label: "Icon only", defaultValue: false },
    { kind: "text", name: "label", label: "Label", defaultValue: "Default", placeholder: "Button label" },
  ],
  render: (props) => {
    const appearance: Appearance =
      props.appearance === "Outline"
        ? "outline"
        : props.appearance === "Ghost (none)"
          ? "none"
          : "fill";
    const variant = String(props.variant).toLowerCase() as Variant;
    const state = String(props.state).toLowerCase() as State;
    const size: Size = props.size === "Compact" ? "compact" : "default";
    return (
      <DemoButton
        appearance={appearance}
        variant={variant}
        state={state}
        size={size}
        iconOnly={props.iconOnly === true}
        label={String(props.label)}
      />
    );
  },
  tokens: {
    "container/dynamic/brand/bold/background/default": "var(--container-dynamic-brand-bold-background-default)",
    "container/dynamic/brand/bold/background/hover": "var(--container-dynamic-brand-bold-background-hover)",
    "container/dynamic/brand/bold/foreground/default": "var(--container-dynamic-brand-bold-foreground-default)",
    "container/dynamic/neutral/subtle/background/hover": "var(--container-dynamic-neutral-subtle-background-hover)",
    "container/dynamic/neutral/subtle/background/disabled": "var(--container-dynamic-neutral-subtle-background-disabled)",
    "surface/foreground/dynamic/brand/default": "var(--surface-foreground-dynamic-brand-default)",
    "surface/foreground/dynamic/neutral/disabled": "var(--surface-foreground-dynamic-neutral-disabled)",
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "border/dynamic/brand/default": "var(--border-dynamic-brand-default)",
    "border/dynamic/neutral/subtle/default": "var(--border-dynamic-neutral-subtle-default)",
    "radiuses/small": "var(--radiuses-small)",
    "height/34": "var(--height-34)",
    "Body Md/Medium": "var(--body-md-medium-size)",
  },
};

const inverseConfig: PlaygroundConfig = {
  name: "Button — Inverse",
  description: "Buttons placed on a dark surface. Solid inverts to a white fill; outline/ghost use white foreground.",
  previewBackground: { light: "#1b181f", dark: "#1b181f" },
  controls: [
    {
      kind: "select",
      name: "appearance",
      label: "Appearance",
      options: ["Solid (fill)", "Outline", "Ghost (none)"],
      defaultValue: "Solid (fill)",
      asTabs: true,
    },
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Default", "Disabled"],
      defaultValue: "Default",
    },
    { kind: "text", name: "label", label: "Label", defaultValue: "Default", placeholder: "Button label" },
  ],
  render: (props) => {
    const appearance: Appearance =
      props.appearance === "Outline"
        ? "outline"
        : props.appearance === "Ghost (none)"
          ? "none"
          : "fill";
    const state = String(props.state).toLowerCase() as State;
    // Solid inverse uses primary; outline/ghost inverse use secondary (per Figma).
    const variant: Variant = appearance === "fill" ? "primary" : "secondary";
    return (
      <DemoButton
        appearance={appearance}
        variant={variant}
        state={state}
        inverse
        label={String(props.label)}
      />
    );
  },
  tokens: {
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "surface/foreground/dynamic/brand/default": "var(--surface-foreground-dynamic-brand-default)",
    "surface/background/lvl2": "#1b181f",
    "container/inverse/disabled": "#ffffff29",
    "foreground/inverse/disabled": "#ffffff8a",
  },
};

const dropdownConfig: PlaygroundConfig = {
  name: "Dropdown Button",
  description: "Solid primary button with a trailing caret. Toggle the rounded (pill) shape.",
  controls: [{ kind: "boolean", name: "rounded", label: "Rounded (pill)", defaultValue: false }],
  render: (props) => <ButtonDropdown rounded={props.rounded === true} />,
  tokens: {
    "container/dynamic/brand/bold/background/default": "var(--container-dynamic-brand-bold-background-default)",
    "container/dynamic/brand/bold/foreground/default": "var(--container-dynamic-brand-bold-foreground-default)",
    "radiuses/small": "var(--radiuses-small)",
    "[old]Radiuses/round": "var(--old-radiuses-round)",
  },
};

const backToTopConfig: PlaygroundConfig = {
  name: "Back-to-top",
  description: "Collapsed icon button that expands into a labelled button on hover. Hover the preview to try it.",
  controls: [],
  render: () => <BackToTop />,
  tokens: {
    "container/dynamic/brand/bold/background/default": "var(--container-dynamic-brand-bold-background-default)",
    "container/brand/bold/background-hover": "#9f2d98",
    "container/dynamic/brand/bold/foreground/default": "var(--container-dynamic-brand-bold-foreground-default)",
    "radiuses/small": "var(--radiuses-small)",
  },
};

const hoverAnimationConfig: PlaygroundConfig = {
  name: "Button hover animation",
  description: "Primary solid button with the sliding multi-colour reveal on hover. Hover the button in the preview.",
  controls: [
    { kind: "boolean", name: "dark", label: "Dark base", defaultValue: false },
  ],
  render: (props, theme) => {
    const dark = props.dark === true || theme === "dark";
    return (
      <div className="flex flex-col items-center gap-6">
        <AnimatedHoverButton dark={dark} />
        <div className="flex flex-col items-center gap-2">
          <span className="text-[length:var(--body-sm-medium-size,12px)] text-[var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)]">Animation frames (Default → hover4)</span>
          <AnimationFrames />
        </div>
      </div>
    );
  },
  tokens: {
    "container/dynamic/brand/bold/background/default": "var(--container-dynamic-brand-bold-background-default)",
    "illustration/brand/2": "var(--illustration-brand-2)",
    "slide/1": "#7c33b5",
    "slide/2": "#702ea3",
    "slide/3": "#7c2ea3",
    "slide/4": "#882ea3",
    "slide/5": "#902d9f",
    "slide/6": "#9b2d9f",
    "slide/7": "#9f2d98",
  },
};

// ----------------------------------------------------------------------------
// Page
// ----------------------------------------------------------------------------

export default function ButtonPage(): JSX.Element {
  return (
    <section aria-label="Button component playground" className="flex flex-col gap-6">
      <Playground config={buttonConfig} />
      <Playground config={inverseConfig} />
      <Playground config={dropdownConfig} />
      <Playground config={backToTopConfig} />
      <Playground config={hoverAnimationConfig} />
    </section>
  );
}
