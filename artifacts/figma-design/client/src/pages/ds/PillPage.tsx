const caption = "text-[12px] text-[#a8a8b2]";
const cardClass =
  "rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5";
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
 * Colour tables                                                       *
 * ------------------------------------------------------------------ */

type VariantRow = {
  caption: string;
  colors: PillColors;
};

// Removable pill — label "Label title"
const removableVariants: VariantRow[] = [
  {
    caption: "Brand (Bold) / Filled / Active",
    colors: { bg: "#7c33b5", fg: "#ffffff", icon: "close-white.svg" },
  },
  {
    caption: "Brand (Bold) / Filled / Hover",
    colors: { bg: "#662994", fg: "#ffffff", icon: "close-white-hover.svg" },
  },
  {
    caption: "Brand (Subtle) / Filled / Active",
    colors: { bg: "#f6ebff", fg: "#7c33b5", icon: "close-brand.svg" },
  },
  {
    caption: "Brand (Subtle) / Filled / Hover",
    colors: { bg: "#e7c7ff", fg: "#662994", icon: "close-brand-hover.svg" },
  },
  {
    caption: "Brand (Bold) / Outline / Active",
    colors: { bg: "#ffffff", border: "#7c33b5", fg: "#7c33b5", icon: "close-brand.svg" },
  },
  {
    caption: "Brand (Bold) / Outline / Hover",
    colors: {
      bg: "rgba(113,113,128,0.08)",
      border: "#662994",
      fg: "#662994",
      icon: "close-brand-hover.svg",
    },
  },
  {
    caption: "Warning / Filled / Active",
    colors: { bg: "#f8c500", fg: "#241c00", icon: "close-warning.svg" },
  },
  {
    caption: "Warning / Filled / Hover",
    colors: { bg: "#d1a600", fg: "#241c00", icon: "close-warning-hover.svg" },
  },
  {
    caption: "Warning / Outline / Active",
    colors: {
      bg: "#ffffff",
      border: "#f8c500",
      fg: "#483800",
      icon: "close-warning-outline.svg",
    },
  },
  {
    caption: "Warning / Outline / Hover",
    colors: {
      bg: "#ffffff",
      border: "#d1a600",
      fg: "#241c00",
      icon: "close-warning-outline-hover.svg",
    },
  },
];

const removableDisabled: { caption: string; size: Size; icon: string }[] = [
  { caption: "Disabled / Compact", size: "Compact", icon: "close-disabled-compact.svg" },
  { caption: "Disabled / Standard", size: "Standard", icon: "close-disabled-standard.svg" },
];

// Draggable pill — label "Collect"
const draggableVariants: VariantRow[] = [
  {
    caption: "Brand (Bold) / Filled / Active",
    colors: { bg: "#7c33b5", fg: "#ffffff", icon: "drag-close-white.svg" },
  },
  {
    caption: "Brand (Bold) / Filled / Hover",
    colors: { bg: "#662994", fg: "#ffffff", icon: "drag-close-white-hover.svg" },
  },
  {
    caption: "Brand (Bold) / Filled / Pressed",
    colors: { bg: "#662994", fg: "#ffffff", icon: "drag-close-white-hover.svg" },
  },
  {
    caption: "Brand (Bold) / Outline / Active",
    colors: { bg: "#ffffff", border: "#7c33b5", fg: "#7c33b5", icon: "drag-close-brand.svg" },
  },
  {
    caption: "Brand (Bold) / Outline / Hover",
    colors: {
      bg: "rgba(113,113,128,0.08)",
      border: "#662994",
      fg: "#662994",
      icon: "drag-close-brand-hover.svg",
    },
  },
  {
    caption: "Brand (Bold) / Outline / Pressed",
    colors: {
      bg: "rgba(113,113,128,0.08)",
      border: "#662994",
      fg: "#662994",
      icon: "drag-close-brand-hover.svg",
    },
  },
];

const draggableDisabled: { caption: string; size: Size; icon: string }[] = [
  { caption: "Disabled / Compact", size: "Compact", icon: "drag-close-disabled.svg" },
  { caption: "Disabled / Standard", size: "Standard", icon: "drag-close-disabled.svg" },
];

const disabledColors = (icon: string): PillColors => ({
  bg: "rgba(113,113,128,0.1)",
  fg: "#a8a8b2",
  icon,
});

/* ------------------------------------------------------------------ *
 * A labelled cell showing both Compact & Standard sizes               *
 * ------------------------------------------------------------------ */
function VariantCell({
  caption: cap,
  label,
  colors,
}: {
  caption: string;
  label: string;
  colors: PillColors;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className={caption}>{cap}</span>
      <div className="flex flex-wrap items-center gap-3">
        <Pill label={label} size="Compact" colors={colors} />
        <Pill label={label} size="Standard" colors={colors} />
      </div>
    </div>
  );
}

function DisabledCell({
  caption: cap,
  label,
  size,
  icon,
}: {
  caption: string;
  label: string;
  size: Size;
  icon: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className={caption}>{cap}</span>
      <div className="flex flex-wrap items-center gap-3">
        <Pill label={label} size={size} colors={disabledColors(icon)} />
      </div>
    </div>
  );
}

export default function PillPage() {
  return (
    <section className="flex flex-col gap-8">
      {/* Pill / Removable */}
      <div className={cardClass}>
        <div className="mb-4 flex flex-col gap-1">
          <h2
            style={{ ...fontMedium, fontSize: 16, color: "#13131a" }}
          >
            Pill / Removable
          </h2>
          <span className={caption}>
            Compact &amp; Standard sizes shown per variant
          </span>
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-6">
          {removableVariants.map((v) => (
            <VariantCell
              key={v.caption}
              caption={v.caption}
              label="Label title"
              colors={v.colors}
            />
          ))}
          {removableDisabled.map((d) => (
            <DisabledCell
              key={d.caption}
              caption={d.caption}
              label="Disabled"
              size={d.size}
              icon={d.icon}
            />
          ))}
        </div>
      </div>

      {/* Pill / Draggable */}
      <div className={cardClass}>
        <div className="mb-4 flex flex-col gap-1">
          <h2 style={{ ...fontMedium, fontSize: 16, color: "#13131a" }}>
            Pill / Draggable
          </h2>
          <span className={caption}>
            Compact &amp; Standard sizes shown per variant
          </span>
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-6">
          {draggableVariants.map((v) => (
            <VariantCell
              key={v.caption}
              caption={v.caption}
              label="Collect"
              colors={v.colors}
            />
          ))}
          {draggableDisabled.map((d) => (
            <DisabledCell
              key={d.caption}
              caption={d.caption}
              label="Collect"
              size={d.size}
              icon={d.icon}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
