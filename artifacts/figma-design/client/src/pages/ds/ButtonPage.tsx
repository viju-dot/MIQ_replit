import { useState } from "react";

/**
 * Fiber Design System — Button page.
 *
 * Faithful reproduction of the "Buttons" Figma page. All Tailwind v4
 * CSS-variable arbitrary values from the reference have been replaced with
 * their plain fallback hex values for Tailwind v3.
 *
 * Design tokens extracted from design-refs/button.md:
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
  default: { h: "h-[34px]", text: "text-[14px] leading-[20px]", px: "px-[12px] py-[7px]", icon: "size-[20px]" },
  compact: { h: "h-[24px]", text: "text-[12px] leading-[18px]", px: "px-[8px] py-[3px]", icon: "size-[16px]" },
};

function Caption({ children }: { children: React.ReactNode }) {
  return <span className="text-[12px] text-[#a8a8b2]">{children}</span>;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
      <h3 className="mb-4 text-[16px] font-medium text-[#13131a]">{title}</h3>
      <div className="flex flex-wrap gap-x-8 gap-y-5">{children}</div>
    </div>
  );
}

function Cell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-start gap-2">
      <Caption>{label}</Caption>
      <div className="flex flex-wrap items-center gap-3">{children}</div>
    </div>
  );
}

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
  primary: { bg: "#7c33b5", hoverBg: "#702ea3" },
  secondary: { bg: "#71718014", hoverBg: "#71718029" },
  destructive: { bg: "#d92d20", hoverBg: "#b42318" },
};

const outlineColors: Record<Variant, { border: string; fg: string }> = {
  primary: { border: "#7c33b5", fg: "#7c33b5" },
  secondary: { border: "#c6c6cc", fg: "#13131a" },
  destructive: { border: "#d92d20", fg: "#d92d20" },
};

const noneColors: Record<Variant, string> = {
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
      style.backgroundColor = "#ffffff";
      style.color = "#7c33b5";
    } else if (variant === "secondary") {
      style.backgroundColor = hover ? fillColors.secondary.hoverBg : fillColors.secondary.bg;
      style.color = "#13131a";
    } else {
      style.backgroundColor = hover ? fillColors[variant].hoverBg : fillColors[variant].bg;
      style.color = "#ffffff";
    }
  } else if (appearance === "outline") {
    const c = outlineColors[variant];
    style.border = `1px solid ${inverse ? "#ffffff" : c.border}`;
    style.color = inverse ? "#ffffff" : c.fg;
    style.backgroundColor = hover ? `${c.border}14` : "transparent";
    if (inverse) style.backgroundColor = "transparent";
  } else {
    // appearance === "none"
    style.color = inverse ? "#ffffff" : noneColors[variant];
    style.backgroundColor = hover ? `${noneColors[variant]}14` : "transparent";
  }

  if (disabled) {
    if (appearance === "fill" && !inverse && variant !== "secondary") {
      style.backgroundColor = "#7171801a";
      style.color = "#a8a8b2";
    } else if (appearance === "fill" && variant === "secondary") {
      style.backgroundColor = "#7171800a";
      style.color = "#a8a8b2";
    } else if (appearance === "fill" && inverse) {
      style.backgroundColor = "#ffffff29";
      style.color = "#ffffff8a";
    } else if (appearance === "outline") {
      style.border = `1px solid ${inverse ? "#ffffff52" : "#c6c6cc"}`;
      style.color = inverse ? "#ffffff8a" : "#a8a8b2";
      style.backgroundColor = "transparent";
    } else {
      style.color = inverse ? "#ffffff8a" : "#a8a8b2";
      style.backgroundColor = "transparent";
    }
  }

  return (
    <button
      type="button"
      disabled={disabled}
      style={style}
      className={`inline-flex items-center justify-center gap-[6px] rounded-[2px] font-medium ${box.h} ${
        iconOnly ? (size === "compact" ? "w-[24px] px-0" : "w-[34px] px-0") : box.px
      } ${box.text} ${disabled ? "cursor-not-allowed" : ""}`}
    >
      {iconOnly ? (
        <span
          className={`inline-block ${size === "compact" ? "size-[16px]" : "size-[20px]"} rounded-[2px]`}
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
  const base = dark ? "#a857e5" : "#7c33b5";
  return (
    <button
      type="button"
      className="group relative inline-flex h-[34px] items-center justify-center overflow-hidden rounded-[2px] px-[12px] py-[7px] text-[14px] font-medium leading-[20px] text-white"
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
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex flex-col items-center gap-1">
        <div
          className="inline-flex h-[34px] items-center justify-center rounded-[2px] px-[12px] py-[7px] text-[14px] font-medium leading-[20px] text-white"
          style={{ backgroundColor: "#7c33b5" }}
        >
          Default
        </div>
        <Caption>Default</Caption>
      </div>
      {positions.map((left, i) => (
        <div key={i} className="flex flex-col items-center gap-1">
          <div className="relative inline-flex h-[34px] items-center justify-center overflow-hidden rounded-[2px] px-[12px] py-[7px] text-[14px] font-medium leading-[20px] text-white">
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
          <Caption>{`hover${i + 1}`}</Caption>
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
      className={`inline-flex h-[34px] items-center gap-[2px] py-[7px] pl-[12px] pr-[8px] text-[14px] font-medium leading-[20px] text-white ${
        rounded ? "rounded-[100px]" : "rounded-[2px] pr-[4px]"
      }`}
      style={{ backgroundColor: "#7c33b5" }}
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
      className={`inline-flex h-[34px] items-center gap-[4px] overflow-hidden py-[7px] text-[14px] font-medium leading-[20px] text-white ${
        hover ? "rounded-l-[2px] pl-[4px] pr-[12px]" : "w-[34px] justify-center rounded-[2px]"
      }`}
      style={{ backgroundColor: hover ? "#9f2d98" : "#7c33b5" }}
    >
      <Caret invert size="size-[24px]" />
      {hover && <span className="whitespace-nowrap">Back to top</span>}
    </button>
  );
}

// ----------------------------------------------------------------------------
// Page
// ----------------------------------------------------------------------------

const variants: Variant[] = ["primary", "secondary", "destructive"];

export default function ButtonPage(): JSX.Element {
  return (
    <section aria-label="Button component variants" className="flex flex-col gap-6">
      {/* Solid (fill) buttons */}
      <Card title="Solid (fill)">
        {variants.map((v) => (
          <Cell key={v} label={v[0].toUpperCase() + v.slice(1)}>
            <div className="flex flex-col gap-1">
              <DemoButton variant={v} appearance="fill" state="default" />
              <Caption>Default</Caption>
            </div>
            <div className="flex flex-col gap-1">
              <DemoButton variant={v} appearance="fill" state="hover" />
              <Caption>Hover</Caption>
            </div>
            <div className="flex flex-col gap-1">
              <DemoButton variant={v} appearance="fill" state="disabled" />
              <Caption>Disabled</Caption>
            </div>
          </Cell>
        ))}
      </Card>

      {/* Outline buttons */}
      <Card title="Outline">
        {variants.map((v) => (
          <Cell key={v} label={v[0].toUpperCase() + v.slice(1)}>
            <div className="flex flex-col gap-1">
              <DemoButton variant={v} appearance="outline" state="default" />
              <Caption>Default</Caption>
            </div>
            <div className="flex flex-col gap-1">
              <DemoButton variant={v} appearance="outline" state="hover" />
              <Caption>Hover</Caption>
            </div>
            <div className="flex flex-col gap-1">
              <DemoButton variant={v} appearance="outline" state="disabled" />
              <Caption>Disabled</Caption>
            </div>
          </Cell>
        ))}
      </Card>

      {/* Ghost (none) buttons */}
      <Card title="Ghost (none)">
        {variants.map((v) => (
          <Cell key={v} label={v[0].toUpperCase() + v.slice(1)}>
            <div className="flex flex-col gap-1">
              <DemoButton variant={v} appearance="none" state="default" />
              <Caption>Default</Caption>
            </div>
            <div className="flex flex-col gap-1">
              <DemoButton variant={v} appearance="none" state="hover" />
              <Caption>Hover</Caption>
            </div>
            <div className="flex flex-col gap-1">
              <DemoButton variant={v} appearance="none" state="disabled" />
              <Caption>Disabled</Caption>
            </div>
          </Cell>
        ))}
      </Card>

      {/* Compact size */}
      <Card title="Compact size">
        <Cell label="Solid">
          <DemoButton variant="primary" appearance="fill" size="compact" />
          <DemoButton variant="secondary" appearance="fill" size="compact" />
          <DemoButton variant="destructive" appearance="fill" size="compact" />
        </Cell>
        <Cell label="Outline">
          <DemoButton variant="primary" appearance="outline" size="compact" />
          <DemoButton variant="secondary" appearance="outline" size="compact" />
          <DemoButton variant="destructive" appearance="outline" size="compact" />
        </Cell>
        <Cell label="Ghost">
          <DemoButton variant="primary" appearance="none" size="compact" />
          <DemoButton variant="secondary" appearance="none" size="compact" />
          <DemoButton variant="destructive" appearance="none" size="compact" />
        </Cell>
      </Card>

      {/* Icon-only buttons */}
      <Card title="Icon only">
        <Cell label="Default size">
          <DemoButton variant="primary" appearance="fill" iconOnly />
          <DemoButton variant="secondary" appearance="fill" iconOnly />
          <DemoButton variant="primary" appearance="outline" iconOnly />
          <DemoButton variant="destructive" appearance="fill" iconOnly />
        </Cell>
        <Cell label="Compact size">
          <DemoButton variant="primary" appearance="fill" iconOnly size="compact" />
          <DemoButton variant="secondary" appearance="fill" iconOnly size="compact" />
          <DemoButton variant="primary" appearance="outline" iconOnly size="compact" />
          <DemoButton variant="destructive" appearance="fill" iconOnly size="compact" />
        </Cell>
      </Card>

      {/* Inverse buttons (on dark surface) */}
      <Card title="Inverse (on dark surface)">
        <div className="flex w-full flex-wrap items-start gap-8 rounded-[6px] bg-[#1b181f] p-6">
          <div className="flex flex-col gap-1">
            <DemoButton variant="primary" appearance="fill" inverse />
            <span className="text-[12px] text-[#c6c6cc]">Solid</span>
          </div>
          <div className="flex flex-col gap-1">
            <DemoButton variant="secondary" appearance="outline" inverse />
            <span className="text-[12px] text-[#c6c6cc]">Outline</span>
          </div>
          <div className="flex flex-col gap-1">
            <DemoButton variant="secondary" appearance="none" inverse />
            <span className="text-[12px] text-[#c6c6cc]">Ghost</span>
          </div>
          <div className="flex flex-col gap-1">
            <DemoButton variant="primary" appearance="fill" inverse state="disabled" />
            <span className="text-[12px] text-[#c6c6cc]">Disabled</span>
          </div>
        </div>
      </Card>

      {/* Dropdown buttons */}
      <Card title="Dropdown buttons">
        <Cell label="Solid dropdown, standard">
          <ButtonDropdown />
        </Cell>
        <Cell label="Solid round dropdown, standard">
          <ButtonDropdown rounded />
        </Cell>
      </Card>

      {/* Back to top */}
      <Card title="Back-to-top (hover to expand)">
        <Cell label="Collapsed / Hover">
          <BackToTop />
        </Cell>
      </Card>

      {/* Hover animation */}
      <Card title="Button hover animation (primary solid, standard)">
        <Cell label="Light mode (hover me)">
          <AnimatedHoverButton />
        </Cell>
        <Cell label="Dark mode (hover me)">
          <div className="rounded-[6px] bg-[#1b181f] p-4">
            <AnimatedHoverButton dark />
          </div>
        </Cell>
        <div className="flex w-full flex-col items-start gap-2">
          <Caption>Animation frames (Default → hover4)</Caption>
          <AnimationFrames />
        </div>
      </Card>
    </section>
  );
}
