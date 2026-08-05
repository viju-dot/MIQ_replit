/**
 * Icons page — interactive browsing playground for the Figma "Icons" catalog frame.
 *
 * This is a gallery/asset page, so instead of a single-component props preview it
 * offers a grid of every icon family, explored via controls (Style, Size and, for
 * directional families, Pointing). The glyphs are the exact hand-authored inline
 * SVGs reproduced from the Figma frame — colors, stroke widths and paths unchanged.
 */

import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

type IconStyle = "Regular" | "Fill" | "Duotone";
type Pointing = "Up" | "Down" | "Left" | "Right";

const ICON_COLOR = "#13131a";
const DUOTONE_FILL = "#71718033"; // subtle neutral accent for duotone bodies

const rotationForPointing: Record<Pointing, number> = {
  Up: 0,
  Down: 180,
  Left: -90,
  Right: 90,
};

type SvgProps = {
  size: number;
  style: IconStyle;
  pointing?: Pointing;
};

/* ------------------------------------------------------------------ *
 * Per-family glyph renderers (24x24 viewBox, scaled via width/height)
 * ------------------------------------------------------------------ */

function ArrowGlyph({ size, style, pointing = "Up" }: SvgProps) {
  const rot = rotationForPointing[pointing];
  if (style === "Fill") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: `rotate(${rot}deg)` }}>
        <path
          d="M12 3.5a1 1 0 0 1 .7.29l7 7a1 1 0 0 1-1.4 1.42L13 7.4V19.5a1 1 0 1 1-2 0V7.4l-5.3 4.81A1 1 0 1 1 4.3 10.8l7-7A1 1 0 0 1 12 3.5Z"
          fill={ICON_COLOR}
        />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: `rotate(${rot}deg)` }}>
      {style === "Duotone" && (
        <path d="M12 4.5 5 11.5h4V19h6v-7.5h4L12 4.5Z" fill={DUOTONE_FILL} />
      )}
      <path
        d="M12 19.5V4.75M12 4.75 5.5 11.25M12 4.75l6.5 6.5"
        stroke={ICON_COLOR}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CaretGlyph({ size, style, pointing = "Up" }: SvgProps) {
  const rot = rotationForPointing[pointing];
  if (style === "Fill") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: `rotate(${rot}deg)` }}>
        <path d="M12 8 4.5 15.5h15L12 8Z" fill={ICON_COLOR} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" style={{ transform: `rotate(${rot}deg)` }}>
      {style === "Duotone" && <path d="M12 8 4.5 15.5h15L12 8Z" fill={DUOTONE_FILL} />}
      <path
        d="M5 15 12 8l7 7"
        stroke={ICON_COLOR}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CaretUpDownGlyph({ size, style }: SvgProps) {
  if (style === "Fill") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 3 7 8.5h10L12 3Z" fill={ICON_COLOR} />
        <path d="M12 21 7 15.5h10L12 21Z" fill={ICON_COLOR} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {style === "Duotone" && (
        <>
          <path d="M12 3 7 8.5h10L12 3Z" fill={DUOTONE_FILL} />
          <path d="M12 21 7 15.5h10L12 21Z" fill={DUOTONE_FILL} />
        </>
      )}
      <path d="M7.5 8.5 12 4l4.5 4.5" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M7.5 15.5 12 20l4.5-4.5" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashGlyph({ size, style }: SvgProps) {
  if (style === "Fill") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path
          d="M9 3.5h6a1 1 0 0 1 1 1V6h3.25a.75.75 0 0 1 0 1.5H4.75a.75.75 0 0 1 0-1.5H8V4.5a1 1 0 0 1 1-1Zm-3 6h12l-.83 10.05A1.5 1.5 0 0 1 15.68 21H8.32a1.5 1.5 0 0 1-1.49-1.45L6 9.5Z"
          fill={ICON_COLOR}
        />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {style === "Duotone" && <path d="M6 6.75h12l-.9 12.1a1.5 1.5 0 0 1-1.5 1.4H8.4a1.5 1.5 0 0 1-1.5-1.4L6 6.75Z" fill={DUOTONE_FILL} />}
      <path d="M4.75 6.75h14.5" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8.5 6.75V5.5a1.25 1.25 0 0 1 1.25-1.25h4.5A1.25 1.25 0 0 1 15.5 5.5v1.25" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6.5 6.75 7.4 18.9a1.5 1.5 0 0 0 1.5 1.35h6.2a1.5 1.5 0 0 0 1.5-1.35L17.5 6.75" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 10.5v6M14 10.5v6" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function WarningCircleGlyph({ size, style }: SvgProps) {
  if (style === "Fill") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Zm0 14.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm.75-4.25a.75.75 0 0 1-1.5 0V7.5a.75.75 0 0 1 1.5 0v5.25Z" fill={ICON_COLOR} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {style === "Duotone" && <circle cx="12" cy="12" r="9" fill={DUOTONE_FILL} />}
      <circle cx="12" cy="12" r="9" stroke={ICON_COLOR} strokeWidth="1.5" />
      <path d="M12 7.5v5.5" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="16" r="1" fill={ICON_COLOR} />
    </svg>
  );
}

function WarningGlyph({ size, style }: SvgProps) {
  if (style === "Fill") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M13.3 3.7a1.5 1.5 0 0 0-2.6 0L2.3 18.5A1.5 1.5 0 0 0 3.6 20.75h16.8A1.5 1.5 0 0 0 21.7 18.5L13.3 3.7ZM12 17.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm.75-4.25a.75.75 0 0 1-1.5 0V9a.75.75 0 0 1 1.5 0v4.25Z" fill={ICON_COLOR} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {style === "Duotone" && <path d="M11.13 4.2a1 1 0 0 1 1.74 0l8 14A1 1 0 0 1 20 19.75H4a1 1 0 0 1-.87-1.5l8-14.05Z" fill={DUOTONE_FILL} />}
      <path d="M11.13 4.2a1 1 0 0 1 1.74 0l8 14A1 1 0 0 1 20 19.75H4a1 1 0 0 1-.87-1.5l8-14.05Z" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M12 9v4" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="12" cy="16.25" r="1" fill={ICON_COLOR} />
    </svg>
  );
}

function CheckCircleGlyph({ size, style }: SvgProps) {
  if (style === "Fill") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Zm4.28 7.53-5 5a.75.75 0 0 1-1.06 0l-2.5-2.5a.75.75 0 1 1 1.06-1.06l1.97 1.97 4.47-4.47a.75.75 0 1 1 1.06 1.06Z" fill={ICON_COLOR} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {style === "Duotone" && <circle cx="12" cy="12" r="9" fill={DUOTONE_FILL} />}
      <circle cx="12" cy="12" r="9" stroke={ICON_COLOR} strokeWidth="1.5" />
      <path d="m8.5 12 2.5 2.5 4.5-4.5" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function XGlyph({ size, style }: SvgProps) {
  if (style === "Fill") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2.5a9.5 9.5 0 1 0 0 19 9.5 9.5 0 0 0 0-19Zm3.53 12.47a.75.75 0 1 1-1.06 1.06L12 13.06l-2.47 2.47a.75.75 0 1 1-1.06-1.06L10.94 12 8.47 9.53a.75.75 0 0 1 1.06-1.06L12 10.94l2.47-2.47a.75.75 0 1 1 1.06 1.06L13.06 12l2.47 2.47Z" fill={ICON_COLOR} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {style === "Duotone" && <circle cx="12" cy="12" r="9" fill={DUOTONE_FILL} />}
      <path d="M6.5 6.5 17.5 17.5M17.5 6.5 6.5 17.5" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserCircleGlyph({ size, style }: SvgProps) {
  if (style === "Fill") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2.5a9.5 9.5 0 0 0-6.3 16.62 7 7 0 0 1 12.6 0A9.5 9.5 0 0 0 12 2.5Zm0 9.5a3 3 0 1 1 0-6 3 3 0 0 1 0 6Z" fill={ICON_COLOR} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {style === "Duotone" && <circle cx="12" cy="12" r="9" fill={DUOTONE_FILL} />}
      <circle cx="12" cy="12" r="9" stroke={ICON_COLOR} strokeWidth="1.5" />
      <circle cx="12" cy="10" r="3" stroke={ICON_COLOR} strokeWidth="1.5" />
      <path d="M6.2 18.4a6.5 6.5 0 0 1 11.6 0" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function UserPlusGlyph({ size, style }: SvgProps) {
  if (style === "Fill") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="9.5" cy="8" r="4" fill={ICON_COLOR} />
        <path d="M9.5 13c-3.6 0-6.5 2.3-7.4 5.4A1 1 0 0 0 3.05 19.7h12.9a1 1 0 0 0 .95-1.3C15.99 15.3 13.1 13 9.5 13Z" fill={ICON_COLOR} />
        <path d="M19 8.5v5M16.5 11h5" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {style === "Duotone" && <circle cx="9.5" cy="8" r="4" fill={DUOTONE_FILL} />}
      <circle cx="9.5" cy="8" r="4" stroke={ICON_COLOR} strokeWidth="1.5" />
      <path d="M3.2 18.8a6.7 6.7 0 0 1 12.6 0" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M19 8.5v5M16.5 11h5" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function GearGlyph({ size, style }: SvgProps) {
  const teeth = (
    <path
      d="M12 2.75c.6 0 1.16.05 1.7.15l.4 2.3 1.9.79 1.9-1.35c.86.66 1.6 1.4 2.26 2.26l-1.35 1.9.79 1.9 2.3.4c.1.54.15 1.1.15 1.7s-.05 1.16-.15 1.7l-2.3.4-.79 1.9 1.35 1.9a11.4 11.4 0 0 1-2.26 2.26l-1.9-1.35-1.9.79-.4 2.3c-.54.1-1.1.15-1.7.15s-1.16-.05-1.7-.15l-.4-2.3-1.9-.79-1.9 1.35a11.4 11.4 0 0 1-2.26-2.26l1.35-1.9-.79-1.9-2.3-.4A11.7 11.7 0 0 1 2.75 12c0-.6.05-1.16.15-1.7l2.3-.4.79-1.9-1.35-1.9A11.4 11.4 0 0 1 6.9 3.84l1.9 1.35 1.9-.79.4-2.3c.54-.1 1.1-.15 1.7-.15Z"
    />
  );
  if (style === "Fill") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        {teeth && <g fill={ICON_COLOR}>{teeth}</g>}
        <circle cx="12" cy="12" r="3" fill="#fff" />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {style === "Duotone" && <g fill={DUOTONE_FILL}>{teeth}</g>}
      <g stroke={ICON_COLOR} strokeWidth="1.5" strokeLinejoin="round" fill="none">{teeth}</g>
      <circle cx="12" cy="12" r="3" stroke={ICON_COLOR} strokeWidth="1.5" />
    </svg>
  );
}

function ChartLineGlyph({ size, style }: SvgProps) {
  if (style === "Fill") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M4.5 3.5a.75.75 0 0 1 .75.75v13.5c0 .28.22.5.5.5h14a.75.75 0 0 1 0 1.5H5.75A1.75 1.75 0 0 1 4 17.75V4.25a.75.75 0 0 1 .5-.75Z" fill={ICON_COLOR} />
        <path d="M18.53 6.97a.75.75 0 0 1 1.06 1.06l-4.5 4.5a.75.75 0 0 1-1.06 0L11.5 10 8.53 12.97a.75.75 0 0 1-1.06-1.06l3.5-3.5a.75.75 0 0 1 1.06 0L14.5 10.94l4.03-3.97Z" fill={ICON_COLOR} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {style === "Duotone" && <path d="M5 5v13a1 1 0 0 0 1 1h13L14.5 12 11.5 15 8 11.5 5 5Z" fill={DUOTONE_FILL} />}
      <path d="M5 4.75V18a1 1 0 0 0 1 1h13.25" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" />
      <path d="m8 12 3.5-3.5 3 3L19.25 7" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function CircleGlyph({ size, style }: SvgProps) {
  if (style === "Fill") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="9" fill={ICON_COLOR} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {style === "Duotone" && <circle cx="12" cy="12" r="9" fill={DUOTONE_FILL} />}
      <circle cx="12" cy="12" r="9" stroke={ICON_COLOR} strokeWidth="1.5" />
    </svg>
  );
}

function BellGlyph({ size, style }: SvgProps) {
  if (style === "Fill") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d="M12 2.5a6 6 0 0 0-6 6c0 3.2-.8 5.1-1.5 6.1a1 1 0 0 0 .82 1.6h13.36a1 1 0 0 0 .82-1.6C18.8 13.6 18 11.7 18 8.5a6 6 0 0 0-6-6Z" fill={ICON_COLOR} />
        <path d="M9.5 18.5a2.5 2.5 0 0 0 5 0h-5Z" fill={ICON_COLOR} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {style === "Duotone" && <path d="M12 3.25a5.5 5.5 0 0 0-5.5 5.5c0 3.3-.85 5.35-1.6 6.4a.5.5 0 0 0 .4.8h13.4a.5.5 0 0 0 .4-.8c-.75-1.05-1.6-3.1-1.6-6.4a5.5 5.5 0 0 0-5.5-5.5Z" fill={DUOTONE_FILL} />}
      <path d="M12 3.25a5.5 5.5 0 0 0-5.5 5.5c0 3.3-.85 5.35-1.6 6.4a.5.5 0 0 0 .4.8h13.4a.5.5 0 0 0 .4-.8c-.75-1.05-1.6-3.1-1.6-6.4a5.5 5.5 0 0 0-5.5-5.5Z" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinejoin="round" />
      <path d="M9.75 18.5a2.25 2.25 0 0 0 4.5 0" stroke={ICON_COLOR} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function StarGlyph({ size, style }: SvgProps) {
  const d = "M12 3.5l2.6 5.27 5.82.85-4.21 4.1.99 5.8L12 16.78 6.8 19.52l.99-5.8-4.21-4.1 5.82-.85L12 3.5Z";
  if (style === "Fill") {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
        <path d={d} fill={ICON_COLOR} />
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {style === "Duotone" && <path d={d} fill={DUOTONE_FILL} />}
      <path d={d} stroke={ICON_COLOR} strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

/* ------------------------------------------------------------------ *
 * Icon family catalog definitions (mirrors the Figma frame variants)
 * ------------------------------------------------------------------ */

type Glyph = (props: SvgProps) => JSX.Element;

type IconFamily = {
  name: string; // e.g. "Icon/arrow"
  glyph: Glyph;
  directional: boolean; // has Pointing Up/Down/Left/Right
};

const FAMILIES: IconFamily[] = [
  { name: "Icon/arrow", glyph: ArrowGlyph, directional: true },
  { name: "Icon/caret", glyph: CaretGlyph, directional: true },
  { name: "Icon/trash", glyph: TrashGlyph, directional: false },
  { name: "Icon/warning-circle", glyph: WarningCircleGlyph, directional: false },
  { name: "Icon/user-circle", glyph: UserCircleGlyph, directional: false },
  { name: "Icon/user-plus", glyph: UserPlusGlyph, directional: false },
  { name: "Icon/warning", glyph: WarningGlyph, directional: false },
  { name: "Icon/check-circle", glyph: CheckCircleGlyph, directional: false },
  { name: "Icon/x", glyph: XGlyph, directional: false },
  { name: "Icon/gear", glyph: GearGlyph, directional: false },
  { name: "Icon/chart-line", glyph: ChartLineGlyph, directional: false },
  { name: "Icon/circle", glyph: CircleGlyph, directional: false },
  { name: "Icon/bell", glyph: BellGlyph, directional: false },
  { name: "Icon/caret-up-down", glyph: CaretUpDownGlyph, directional: false },
  { name: "Icon/star", glyph: StarGlyph, directional: false },
];

/* ------------------------------------------------------------------ *
 * Interactive gallery preview
 * ------------------------------------------------------------------ */

const STYLE_OPTIONS: IconStyle[] = ["Regular", "Fill", "Duotone"];
const SIZE_OPTIONS = ["16", "20", "24", "32"] as const;
const POINTING_OPTIONS: Pointing[] = ["Up", "Down", "Left", "Right"];

function IconsGallery({ props, dark }: { props: PropValues; dark: boolean }): JSX.Element {
  const style = props.style as IconStyle;
  const size = Number(props.size);
  const pointing = props.pointing as Pointing;

  const cardCls = dark
    ? "border-[#33333d] bg-[#26262e] text-[#f7f7fa]"
    : "border-[#e1e1e8] bg-white text-[#13131a]";
  const captionCls = dark ? "text-[#a8a8b2]" : "text-[#a8a8b2]";

  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {FAMILIES.map((family) => (
        <div
          key={family.name}
          className={`flex flex-col items-center gap-2.5 rounded-[6px] border p-4 ${cardCls}`}
        >
          <div className="flex h-[48px] w-[48px] items-center justify-center">
            <family.glyph
              size={size}
              style={style}
              pointing={family.directional ? pointing : undefined}
            />
          </div>
          <span className={`text-[12px] leading-[18px] ${captionCls}`}>
            {family.name.replace("Icon/", "")}
          </span>
        </div>
      ))}
    </div>
  );
}

const config: PlaygroundConfig = {
  name: "Icons",
  description:
    "Phosphor-style icon catalog — browse every family across Regular / Fill / Duotone styles, four sizes, and directional pointing.",
  controls: [
    {
      kind: "select",
      name: "style",
      label: "Style",
      options: STYLE_OPTIONS,
      defaultValue: "Regular",
      asTabs: true,
    },
    {
      kind: "select",
      name: "size",
      label: "Size",
      options: [...SIZE_OPTIONS],
      defaultValue: "24",
    },
    {
      kind: "select",
      name: "pointing",
      label: "Pointing (directional)",
      options: POINTING_OPTIONS,
      defaultValue: "Up",
    },
  ],
  render: (props, theme) => <IconsGallery props={props} dark={theme === "dark"} />,
  tokens: {
    "color/icon/default": ICON_COLOR,
    "color/icon/duotone-fill": DUOTONE_FILL,
    "color/caption": "#a8a8b2",
    "size/16": "16px",
    "size/20": "20px",
    "size/24": "24px",
    "size/32": "32px",
    "radius/card": "6px",
  },
};

export default function IconsPage(): JSX.Element {
  return (
    <section aria-label="Icon catalog playground" className="flex flex-col gap-6">
      <Playground config={config} />
    </section>
  );
}
