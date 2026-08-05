import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

const fontMedium = { fontFamily: '"DM Sans", Helvetica', fontWeight: 500 } as const;

const ASSET = "/figmaAssets/pill";

type Size = "Compact" | "Standard";

type PillColors = {
  bg?: string;
  border?: string;
  fg: string;
  /** close-icon svg (relative to ASSET) */
  icon: string;
};

/* ------------------------------------------------------------------ *
 * Generic pill renderer (shared shape between Removable & Draggable)  *
 * ------------------------------------------------------------------ */
function Pill({
  label,
  size,
  colors,
}: {
  label: string;
  size: Size;
  colors: PillColors;
}) {
  const isStandard = size === "Standard";
  return (
    <div
      className="flex items-center justify-center shrink-0"
      style={{
        gap: 4,
        paddingTop: 2,
        paddingBottom: 2,
        paddingLeft: isStandard ? 10 : 8,
        paddingRight: isStandard ? 8 : 6,
        height: isStandard ? 24 : 18,
        borderRadius: 100,
        backgroundColor: colors.bg,
        border: colors.border ? `1px solid ${colors.border}` : undefined,
      }}
    >
      <span
        className="whitespace-nowrap"
        style={{
          ...fontMedium,
          fontSize: isStandard ? 14 : 12,
          lineHeight: isStandard ? "20px" : "18px",
          color: colors.fg,
        }}
      >
        {label}
      </span>
      <span
        className="relative shrink-0 inline-flex items-center justify-center overflow-hidden"
        style={{ width: 16, height: 16 }}
      >
        <img
          alt=""
          className="block"
          style={{ width: "10.001px", height: "10.001px" }}
          src={`${ASSET}/${colors.icon}`}
        />
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ *
 * Colour resolution (exact Figma values from the original file)       *
 * ------------------------------------------------------------------ */

const disabledColors = (icon: string): PillColors => ({
  bg: "rgba(113,113,128,0.1)",
  fg: "#a8a8b2",
  icon,
});

// Removable pill — resolves colors from Style / Fill / State axes
function resolveRemovable(
  style: string,
  fill: string,
  state: string,
): PillColors {
  const hover = state === "Hover";
  if (style === "Brand (Bold)") {
    if (fill === "Filled") {
      return hover
        ? { bg: "#662994", fg: "#ffffff", icon: "close-white-hover.svg" }
        : { bg: "#7c33b5", fg: "#ffffff", icon: "close-white.svg" };
    }
    // Outline
    return hover
      ? {
          bg: "rgba(113,113,128,0.08)",
          border: "#662994",
          fg: "#662994",
          icon: "close-brand-hover.svg",
        }
      : { bg: "#ffffff", border: "#7c33b5", fg: "#7c33b5", icon: "close-brand.svg" };
  }
  if (style === "Brand (Subtle)") {
    // Subtle only has Filled variants in Figma
    return hover
      ? { bg: "#e7c7ff", fg: "#662994", icon: "close-brand-hover.svg" }
      : { bg: "#f6ebff", fg: "#7c33b5", icon: "close-brand.svg" };
  }
  // Warning
  if (fill === "Filled") {
    return hover
      ? { bg: "#d1a600", fg: "#241c00", icon: "close-warning-hover.svg" }
      : { bg: "#f8c500", fg: "#241c00", icon: "close-warning.svg" };
  }
  // Warning / Outline
  return hover
    ? { bg: "#ffffff", border: "#d1a600", fg: "#241c00", icon: "close-warning-outline-hover.svg" }
    : { bg: "#ffffff", border: "#f8c500", fg: "#483800", icon: "close-warning-outline.svg" };
}

// Draggable pill — Brand (Bold) only, Fill / State axes
function resolveDraggable(fill: string, state: string): PillColors {
  const activeState = state === "Active";
  if (fill === "Filled") {
    return activeState
      ? { bg: "#7c33b5", fg: "#ffffff", icon: "drag-close-white.svg" }
      : { bg: "#662994", fg: "#ffffff", icon: "drag-close-white-hover.svg" };
  }
  // Outline
  return activeState
    ? { bg: "#ffffff", border: "#7c33b5", fg: "#7c33b5", icon: "drag-close-brand.svg" }
    : {
        bg: "rgba(113,113,128,0.08)",
        border: "#662994",
        fg: "#662994",
        icon: "drag-close-brand-hover.svg",
      };
}

/* ------------------------------------------------------------------ *
 * Playground configs                                                  *
 * ------------------------------------------------------------------ */

const removableConfig: PlaygroundConfig = {
  name: "Pill / Removable",
  description:
    "Dismissible tag with a close affordance. Style, fill and state axes with Compact & Standard sizes.",
  controls: [
    {
      kind: "select",
      name: "style",
      label: "Style",
      options: ["Brand (Bold)", "Brand (Subtle)", "Warning"],
      defaultValue: "Brand (Bold)",
      asTabs: true,
    },
    {
      kind: "select",
      name: "fill",
      label: "Fill",
      options: ["Filled", "Outline"],
      defaultValue: "Filled",
    },
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Active", "Hover", "Disabled"],
      defaultValue: "Active",
    },
    {
      kind: "select",
      name: "size",
      label: "Size",
      options: ["Compact", "Standard"],
      defaultValue: "Standard",
    },
    { kind: "text", name: "label", label: "Label", defaultValue: "Label title" },
  ],
  render: (props: PropValues) => {
    const style = String(props.style);
    const fill = String(props.fill);
    const state = String(props.state);
    const size = props.size === "Compact" ? "Compact" : "Standard";
    const label = String(props.label);

    // Brand (Subtle) has no Outline variant in Figma — fall back to Filled.
    const effectiveFill = style === "Brand (Subtle)" ? "Filled" : fill;

    if (state === "Disabled") {
      const icon =
        size === "Compact" ? "close-disabled-compact.svg" : "close-disabled-standard.svg";
      return <Pill label={label} size={size} colors={disabledColors(icon)} />;
    }
    return (
      <Pill
        label={label}
        size={size}
        colors={resolveRemovable(style, effectiveFill, state)}
      />
    );
  },
  tokens: {
    "container/brand/bold/background": "#7c33b5",
    "container/brand/bold/hover": "#662994",
    "container/brand/subtle/background": "#f6ebff",
    "container/brand/subtle/hover": "#e7c7ff",
    "container/warning/background": "#f8c500",
    "container/warning/hover": "#d1a600",
    "container/disabled/background": "rgba(113,113,128,0.1)",
    "outline/hover/overlay": "rgba(113,113,128,0.08)",
    "foreground/on-brand": "#ffffff",
    "foreground/brand": "#7c33b5",
    "foreground/warning": "#241c00",
    "foreground/disabled": "#a8a8b2",
    "radius/pill": "100px",
    "size/compact": "h 18 (font 12/18)",
    "size/standard": "h 24 (font 14/20)",
  },
};

const draggableConfig: PlaygroundConfig = {
  name: "Pill / Draggable",
  description:
    "Draggable tag with drag handle + close affordance. Brand (Bold) fill and state axes with Compact & Standard sizes.",
  controls: [
    {
      kind: "select",
      name: "fill",
      label: "Fill",
      options: ["Filled", "Outline"],
      defaultValue: "Filled",
      asTabs: true,
    },
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Active", "Hover", "Pressed", "Disabled"],
      defaultValue: "Active",
    },
    {
      kind: "select",
      name: "size",
      label: "Size",
      options: ["Compact", "Standard"],
      defaultValue: "Standard",
    },
    { kind: "text", name: "label", label: "Label", defaultValue: "Collect" },
  ],
  render: (props: PropValues) => {
    const fill = String(props.fill);
    const state = String(props.state);
    const size = props.size === "Compact" ? "Compact" : "Standard";
    const label = String(props.label);

    if (state === "Disabled") {
      return (
        <Pill label={label} size={size} colors={disabledColors("drag-close-disabled.svg")} />
      );
    }
    // Hover and Pressed share the same appearance in Figma.
    return <Pill label={label} size={size} colors={resolveDraggable(fill, state)} />;
  },
  tokens: {
    "container/brand/bold/background": "#7c33b5",
    "container/brand/bold/hover": "#662994",
    "container/disabled/background": "rgba(113,113,128,0.1)",
    "outline/hover/overlay": "rgba(113,113,128,0.08)",
    "foreground/on-brand": "#ffffff",
    "foreground/brand": "#7c33b5",
    "foreground/disabled": "#a8a8b2",
    "radius/pill": "100px",
    "size/compact": "h 18 (font 12/18)",
    "size/standard": "h 24 (font 14/20)",
  },
};

export default function PillPage() {
  return (
    <section aria-label="Pill component playground" className="flex flex-col gap-6">
      <Playground config={removableConfig} />
      <Playground config={draggableConfig} />
    </section>
  );
}
