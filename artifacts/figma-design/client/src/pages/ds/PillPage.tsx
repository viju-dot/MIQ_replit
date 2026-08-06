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
        gap: "var(--numbers-4, 4px)",
        paddingTop: "var(--numbers-2, 2px)",
        paddingBottom: "var(--numbers-2, 2px)",
        paddingLeft: isStandard ? "var(--odd-numbers-10, 10px)" : "var(--numbers-8, 8px)",
        paddingRight: isStandard ? "var(--numbers-8, 8px)" : "var(--numbers-6, 6px)",
        height: isStandard ? "var(--old-sizing-24, 24px)" : "var(--old-sizing-18, 18px)",
        borderRadius: "var(--old-radiuses-round, 100px)",
        backgroundColor: colors.bg,
        border: colors.border
          ? `var(--old-stroke-thickness-1, 1px) solid ${colors.border}`
          : undefined,
      }}
    >
      <span
        className="whitespace-nowrap"
        style={{
          ...fontMedium,
          fontSize: isStandard
            ? "var(--body-md-medium-size, 14px)"
            : "var(--body-sm-medium-size, 12px)",
          lineHeight: isStandard
            ? "var(--body-md-medium-line-height, 20px)"
            : "var(--body-sm-medium-line-height, 18px)",
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
  bg: "var(--container-dynamic-neutral-subtle-background-disabled, rgba(113,113,128,0.1))",
  fg: "var(--container-dynamic-neutral-subtle-foreground-disabled, #a8a8b2)",
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
        ? {
            bg: "#662994",
            fg: "var(--container-dynamic-brand-bold-foreground-hover, #ffffff)",
            icon: "close-white-hover.svg",
          }
        : {
            bg: "var(--container-dynamic-brand-bold-background-default, #7c33b5)",
            fg: "var(--container-dynamic-brand-bold-foreground-default, #ffffff)",
            icon: "close-white.svg",
          };
    }
    // Outline
    return hover
      ? {
          bg: "var(--container-dynamic-neutral-subtle-background-hover, rgba(113,113,128,0.08))",
          border: "var(--border-dynamic-brand-hover, #662994)",
          fg: "var(--container-dynamic-brand-subtle-foreground-hover, #662994)",
          icon: "close-brand-hover.svg",
        }
      : {
          bg: "var(--surface-background-lvl1, #ffffff)",
          border: "var(--border-dynamic-brand-default, #7c33b5)",
          fg: "var(--container-dynamic-brand-subtle-foreground-default, #7c33b5)",
          icon: "close-brand.svg",
        };
  }
  if (style === "Brand (Subtle)") {
    // Subtle only has Filled variants in Figma
    return hover
      ? {
          bg: "var(--container-dynamic-brand-subtle-background-hover, #e7c7ff)",
          fg: "var(--container-dynamic-brand-subtle-foreground-hover, #662994)",
          icon: "close-brand-hover.svg",
        }
      : {
          bg: "var(--container-dynamic-brand-subtle-background-default, #f6ebff)",
          fg: "var(--container-dynamic-brand-subtle-foreground-default, #7c33b5)",
          icon: "close-brand.svg",
        };
  }
  // Warning
  if (fill === "Filled") {
    return hover
      ? {
          bg: "var(--container-dynamic-warning-bold-background-hover, #d1a600)",
          fg: "var(--container-dynamic-warning-bold-foreground-hover, #241c00)",
          icon: "close-warning-hover.svg",
        }
      : {
          bg: "var(--container-dynamic-warning-bold-background-default, #f8c500)",
          fg: "var(--container-dynamic-warning-bold-foreground-default, #241c00)",
          icon: "close-warning.svg",
        };
  }
  // Warning / Outline
  return hover
    ? {
        bg: "var(--surface-background-lvl1, #ffffff)",
        border: "var(--border-dynamic-warning-hover, #d1a600)",
        fg: "var(--container-dynamic-warning-bold-foreground-hover, #241c00)",
        icon: "close-warning-outline-hover.svg",
      }
    : {
        bg: "var(--surface-background-lvl1, #ffffff)",
        border: "var(--border-dynamic-warning-default, #f8c500)",
        fg: "var(--container-dynamic-warning-subtle-foreground-default, #483800)",
        icon: "close-warning-outline.svg",
      };
}

// Draggable pill — Brand (Bold) only, Fill / State axes
function resolveDraggable(fill: string, state: string): PillColors {
  const activeState = state === "Active";
  if (fill === "Filled") {
    return activeState
      ? {
          bg: "var(--container-dynamic-brand-bold-background-default, #7c33b5)",
          fg: "var(--container-dynamic-brand-bold-foreground-default, #ffffff)",
          icon: "drag-close-white.svg",
        }
      : {
          bg: "#662994",
          fg: "var(--container-dynamic-brand-bold-foreground-hover, #ffffff)",
          icon: "drag-close-white-hover.svg",
        };
  }
  // Outline
  return activeState
    ? {
        bg: "var(--surface-background-lvl1, #ffffff)",
        border: "var(--border-dynamic-brand-default, #7c33b5)",
        fg: "var(--container-dynamic-brand-subtle-foreground-default, #7c33b5)",
        icon: "drag-close-brand.svg",
      }
    : {
        bg: "var(--container-dynamic-neutral-subtle-background-hover, rgba(113,113,128,0.08))",
        border: "var(--border-dynamic-brand-hover, #662994)",
        fg: "var(--container-dynamic-brand-subtle-foreground-hover, #662994)",
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
    "container/dynamic/brand/bold/background/default": "var(--container-dynamic-brand-bold-background-default)",
    "container/dynamic/brand/bold/foreground/default": "var(--container-dynamic-brand-bold-foreground-default)",
    "container/dynamic/brand/subtle/background/default": "var(--container-dynamic-brand-subtle-background-default)",
    "container/dynamic/brand/subtle/background/hover": "var(--container-dynamic-brand-subtle-background-hover)",
    "container/dynamic/Brand/Subtle/foreground/default": "var(--container-dynamic-brand-subtle-foreground-default)",
    "container/dynamic/brand/subtle/foreground/hover": "var(--container-dynamic-brand-subtle-foreground-hover)",
    "border/dynamic/brand/default": "var(--border-dynamic-brand-default)",
    "border/dynamic/brand/hover": "var(--border-dynamic-brand-hover)",
    "border/dynamic/warning/default": "var(--border-dynamic-warning-default)",
    "border/dynamic/warning/hover": "var(--border-dynamic-warning-hover)",
    "container/dynamic/warning/bold/background/default": "var(--container-dynamic-warning-bold-background-default)",
    "container/dynamic/warning/bold/background/hover": "var(--container-dynamic-warning-bold-background-hover)",
    "container/dynamic/warning/bold/foreground/default": "var(--container-dynamic-warning-bold-foreground-default)",
    "container/dynamic/warning/subtle/foreground/default": "var(--container-dynamic-warning-subtle-foreground-default)",
    "container/dynamic/neutral/subtle/background/disabled": "var(--container-dynamic-neutral-subtle-background-disabled)",
    "container/dynamic/neutral/subtle/background/hover": "var(--container-dynamic-neutral-subtle-background-hover)",
    "container/dynamic/neutral/subtle/foreground/disabled": "var(--container-dynamic-neutral-subtle-foreground-disabled)",
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "[old]Radiuses/round": "var(--old-radiuses-round)",
    "[old]Sizing/18": "var(--old-sizing-18)",
    "[old]Sizing/24": "var(--old-sizing-24)",
    "Body Md/Medium": "var(--body-md-medium-size) / var(--body-md-medium-line-height)",
    "Body Sm/Medium": "var(--body-sm-medium-size) / var(--body-sm-medium-line-height)",
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
    "container/dynamic/brand/bold/background/default": "var(--container-dynamic-brand-bold-background-default)",
    "container/dynamic/brand/bold/foreground/default": "var(--container-dynamic-brand-bold-foreground-default)",
    "container/dynamic/Brand/Subtle/foreground/default": "var(--container-dynamic-brand-subtle-foreground-default)",
    "container/dynamic/brand/subtle/foreground/hover": "var(--container-dynamic-brand-subtle-foreground-hover)",
    "border/dynamic/brand/default": "var(--border-dynamic-brand-default)",
    "border/dynamic/brand/hover": "var(--border-dynamic-brand-hover)",
    "container/dynamic/neutral/subtle/background/disabled": "var(--container-dynamic-neutral-subtle-background-disabled)",
    "container/dynamic/neutral/subtle/background/hover": "var(--container-dynamic-neutral-subtle-background-hover)",
    "container/dynamic/neutral/subtle/foreground/disabled": "var(--container-dynamic-neutral-subtle-foreground-disabled)",
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "[old]Radiuses/round": "var(--old-radiuses-round)",
    "[old]Sizing/18": "var(--old-sizing-18)",
    "[old]Sizing/24": "var(--old-sizing-24)",
    "Body Md/Medium": "var(--body-md-medium-size) / var(--body-md-medium-line-height)",
    "Body Sm/Medium": "var(--body-sm-medium-size) / var(--body-sm-medium-line-height)",
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
