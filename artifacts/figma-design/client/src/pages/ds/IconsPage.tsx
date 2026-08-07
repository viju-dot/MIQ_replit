/**
 * Icons page — interactive browsing playground for the Figma "Icons" catalog frame.
 *
 * The Fiber icon library is built directly on Phosphor icons, so each of the 109
 * Figma icon component sets ("Icon/<name>") maps 1:1 to a Phosphor React component.
 * Rather than hand-authoring 109×3×4 inline SVGs, we render the real Phosphor
 * glyphs and drive them from the Figma variant axes:
 *   - Style = Regular | Fill | Duotone   -> Phosphor weight regular | fill | duotone
 *   - Size  = 16 | 20 | 24 | 32          -> Phosphor `size`
 *   - State = Default                    (only state authored in the Figma frame)
 *
 * A couple of the Figma sets are "directional" families whose Figma variants use a
 * Pointing axis (Up/Down/Left/Right). Phosphor ships those as discrete components
 * (ArrowUp/ArrowDown/... , CaretUp/CaretDown/...), so the Pointing control selects
 * the matching Phosphor export for the arrow/caret families.
 *
 * Mapping exceptions (documented inline in ICONS below):
 *   - "ai"      -> Sparkle    (Figma "Icon/ai" is an AI-sparkle mark with Size-only
 *                              variants; Phosphor has no "Ai" export, Sparkle is the
 *                              closest semantic + visual match.)
 *   - "arrow"   -> ArrowUp (+ directional siblings) — the Figma set is a single
 *                              directional arrow whose Pointing variant rotates it.
 *   - "caret"   -> CaretUp (+ directional siblings) — same directional pattern.
 *   - "graph"   -> GraphIcon aliased via `Graph` (Phosphor export "Graph").
 */

import { useMemo, useState } from "react";
import type { ComponentType } from "react";
import {
  // directional arrow family
  ArrowUp,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  // directional caret family
  CaretUp,
  CaretDown,
  CaretLeft,
  CaretRight,
  // everything else
  Sparkle,
  ArrowCounterClockwise,
  ArrowsHorizontal,
  ArrowsLeftRight,
  ArrowsOut,
  ArrowSquareOut,
  Asterisk,
  Baby,
  Basket,
  Bell,
  Binoculars,
  BookmarkSimple,
  Briefcase,
  Broadcast,
  Browser,
  Calendar,
  CalendarBlank,
  Cards,
  CaretUpDown,
  CellSignalFull,
  ChartBar,
  ChartLine,
  Chat,
  ChatCircleDots,
  Check,
  CheckCircle,
  Circle,
  CircleNotch,
  ClipboardText,
  Clock,
  ClockCountdown,
  Confetti,
  Cookie,
  Copy,
  Cursor,
  Desktop,
  DeviceTablet,
  DotsSixVertical,
  DotsThree,
  Download,
  ExclamationMark,
  Export,
  Eye,
  EyeSlash,
  FileCode,
  FileImage,
  FileMagnifyingGlass,
  FileText,
  FileVideo,
  FileXls,
  FilmStrip,
  Fire,
  Folder,
  Funnel,
  GameController,
  Gear,
  Graph,
  HandCoins,
  Handshake,
  Heart,
  Heartbeat,
  HourglassLow,
  House,
  IdentificationCard,
  Info,
  Lightbulb,
  Lightning,
  List,
  LockOpen,
  MagnifyingGlass,
  MetaLogo,
  NotePencil,
  PlusCircle,
  Receipt,
  RocketLaunch,
  Scales,
  Shapes,
  ShareNetwork,
  ShieldCheck,
  ShirtFolded,
  ShootingStar,
  SidebarSimple,
  SignOut,
  Signpost,
  SlidersHorizontal,
  SortAscending,
  SortDescending,
  SpeakerHigh,
  Square,
  Star,
  StopCircle,
  Student,
  Table,
  TelevisionSimple,
  Translate,
  Trash,
  TrendDown,
  TrendUp,
  User,
  UserCircle,
  UserPlus,
  UsersThree,
  VideoCamera,
  Warning,
  WarningCircle,
  Watch,
  X,
  type IconProps,
  type IconWeight,
} from "@phosphor-icons/react";

import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

type PhosphorIcon = ComponentType<IconProps>;

type IconStyle = "Regular" | "Fill" | "Duotone";
type Pointing = "Up" | "Down" | "Left" | "Right";

const STYLE_OPTIONS: IconStyle[] = ["Regular", "Fill", "Duotone"];
const SIZE_OPTIONS = ["16", "20", "24", "32"] as const;

/** Figma Style variant -> Phosphor icon weight. */
const WEIGHT_FOR_STYLE: Record<IconStyle, IconWeight> = {
  Regular: "regular",
  Fill: "fill",
  Duotone: "duotone",
};

const ICON_COLOR = "var(--surface-foreground-static-neutral-lvl1, #13131a)";

/* ------------------------------------------------------------------ *
 * Directional families — Figma exposes a Pointing axis; Phosphor ships
 * one component per direction.
 * ------------------------------------------------------------------ */

const ARROW_BY_POINTING: Record<Pointing, PhosphorIcon> = {
  Up: ArrowUp,
  Down: ArrowDown,
  Left: ArrowLeft,
  Right: ArrowRight,
};

const CARET_BY_POINTING: Record<Pointing, PhosphorIcon> = {
  Up: CaretUp,
  Down: CaretDown,
  Left: CaretLeft,
  Right: CaretRight,
};

/* ------------------------------------------------------------------ *
 * Icon catalog — one entry per Figma "Icon/<name>" component set.
 * `directional` families resolve their component from the Pointing axis.
 * ------------------------------------------------------------------ */

type IconEntry = {
  /** kebab name exactly as in icon-names.txt (Figma set is "Icon/<name>"). */
  name: string;
  /** Phosphor component (undefined for directional families). */
  Comp?: PhosphorIcon;
  /** true for arrow/caret (Pointing axis Up/Down/Left/Right). */
  directional?: boolean;
  /** resolver for directional families. */
  byPointing?: Record<Pointing, PhosphorIcon>;
};

const ICONS: IconEntry[] = [
  { name: "ai", Comp: Sparkle }, // exception: no Phosphor "Ai"; Sparkle is closest AI mark
  { name: "arrow", directional: true, byPointing: ARROW_BY_POINTING },
  { name: "arrow-counter-clockwise", Comp: ArrowCounterClockwise },
  { name: "arrows-horizontal", Comp: ArrowsHorizontal },
  { name: "arrows-left-right", Comp: ArrowsLeftRight },
  { name: "arrows-out", Comp: ArrowsOut },
  { name: "arrow-square-out", Comp: ArrowSquareOut },
  { name: "asterisk", Comp: Asterisk },
  { name: "baby", Comp: Baby },
  { name: "basket", Comp: Basket },
  { name: "bell", Comp: Bell },
  { name: "binoculars", Comp: Binoculars },
  { name: "bookmark-simple", Comp: BookmarkSimple },
  { name: "briefcase", Comp: Briefcase },
  { name: "broadcast", Comp: Broadcast },
  { name: "browser", Comp: Browser },
  { name: "calendar", Comp: Calendar },
  { name: "calendar-blank", Comp: CalendarBlank },
  { name: "cards", Comp: Cards },
  { name: "caret", directional: true, byPointing: CARET_BY_POINTING },
  { name: "caret-up-down", Comp: CaretUpDown },
  { name: "cell-signal-full", Comp: CellSignalFull },
  { name: "chart-bar", Comp: ChartBar },
  { name: "chart-line", Comp: ChartLine },
  { name: "chat", Comp: Chat },
  { name: "chat-circle-dots", Comp: ChatCircleDots },
  { name: "check", Comp: Check },
  { name: "check-circle", Comp: CheckCircle },
  { name: "circle", Comp: Circle },
  { name: "circle-notch", Comp: CircleNotch },
  { name: "clipboard-text", Comp: ClipboardText },
  { name: "clock", Comp: Clock },
  { name: "clock-countdown", Comp: ClockCountdown },
  { name: "confetti", Comp: Confetti },
  { name: "cookie", Comp: Cookie },
  { name: "copy", Comp: Copy },
  { name: "cursor", Comp: Cursor },
  { name: "desktop", Comp: Desktop },
  { name: "device-tablet", Comp: DeviceTablet },
  { name: "dots-six-vertical", Comp: DotsSixVertical },
  { name: "dots-three", Comp: DotsThree },
  { name: "download", Comp: Download },
  { name: "exclamation-mark", Comp: ExclamationMark },
  { name: "export", Comp: Export },
  { name: "eye", Comp: Eye },
  { name: "eye-slash", Comp: EyeSlash },
  { name: "file-code", Comp: FileCode },
  { name: "file-image", Comp: FileImage },
  { name: "file-magnifying-glass", Comp: FileMagnifyingGlass },
  { name: "file-text", Comp: FileText },
  { name: "file-video", Comp: FileVideo },
  { name: "file-xls", Comp: FileXls },
  { name: "film-strip", Comp: FilmStrip },
  { name: "fire", Comp: Fire },
  { name: "folder", Comp: Folder },
  { name: "funnel", Comp: Funnel },
  { name: "game-controller", Comp: GameController },
  { name: "gear", Comp: Gear },
  { name: "graph", Comp: Graph },
  { name: "hand-coins", Comp: HandCoins },
  { name: "handshake", Comp: Handshake },
  { name: "heart", Comp: Heart },
  { name: "heartbeat", Comp: Heartbeat },
  { name: "hourglass-low", Comp: HourglassLow },
  { name: "house", Comp: House },
  { name: "identification-card", Comp: IdentificationCard },
  { name: "info", Comp: Info },
  { name: "lightbulb", Comp: Lightbulb },
  { name: "lightning", Comp: Lightning },
  { name: "list", Comp: List },
  { name: "lock-open", Comp: LockOpen },
  { name: "magnifying-glass", Comp: MagnifyingGlass },
  { name: "MetaLogo", Comp: MetaLogo }, // Figma name is literally "Icon/MetaLogo"
  { name: "note-pencil", Comp: NotePencil },
  { name: "plus-circle", Comp: PlusCircle },
  { name: "receipt", Comp: Receipt },
  { name: "rocket-launch", Comp: RocketLaunch },
  { name: "scales", Comp: Scales },
  { name: "shapes", Comp: Shapes },
  { name: "share-network", Comp: ShareNetwork },
  { name: "shield-check", Comp: ShieldCheck },
  { name: "shirt-folded", Comp: ShirtFolded },
  { name: "shooting-star", Comp: ShootingStar },
  { name: "sidebar-simple", Comp: SidebarSimple },
  { name: "sign-out", Comp: SignOut },
  { name: "signpost", Comp: Signpost },
  { name: "sliders-horizontal", Comp: SlidersHorizontal },
  { name: "sort-ascending", Comp: SortAscending },
  { name: "sort-descending", Comp: SortDescending },
  { name: "speaker-high", Comp: SpeakerHigh },
  { name: "square", Comp: Square },
  { name: "star", Comp: Star },
  { name: "stop-circle", Comp: StopCircle },
  { name: "student", Comp: Student },
  { name: "table", Comp: Table },
  { name: "television-simple", Comp: TelevisionSimple },
  { name: "translate", Comp: Translate },
  { name: "trash", Comp: Trash },
  { name: "trend-down", Comp: TrendDown },
  { name: "trend-up", Comp: TrendUp },
  { name: "user", Comp: User },
  { name: "user-circle", Comp: UserCircle },
  { name: "user-plus", Comp: UserPlus },
  { name: "users-three", Comp: UsersThree },
  { name: "video-camera", Comp: VideoCamera },
  { name: "warning", Comp: Warning },
  { name: "warning-circle", Comp: WarningCircle },
  { name: "watch", Comp: Watch },
  { name: "x", Comp: X },
];

/** Resolve the Phosphor component to render for an entry + current Pointing. */
function resolveComp(entry: IconEntry, pointing: Pointing): PhosphorIcon {
  if (entry.directional && entry.byPointing) return entry.byPointing[pointing];
  return entry.Comp as PhosphorIcon;
}

/* ------------------------------------------------------------------ *
 * Interactive gallery preview
 * ------------------------------------------------------------------ */

function GlyphBox({
  Comp,
  size,
  weight,
}: {
  Comp: PhosphorIcon;
  size: number;
  weight: IconWeight;
}): JSX.Element {
  return (
    <span className="flex items-center justify-center" style={{ color: ICON_COLOR }}>
      <Comp size={size} weight={weight} color={ICON_COLOR} />
    </span>
  );
}

function IconsGallery({ props }: { props: PropValues; dark: boolean }): JSX.Element {
  const style = props.style as IconStyle;
  const size = Number(props.size);
  const pointing = (props.pointing as Pointing) ?? "Up";
  const weight = WEIGHT_FOR_STYLE[style];

  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return ICONS;
    return ICONS.filter((e) => e.name.toLowerCase().includes(q));
  }, [query]);

  const selectedEntry = selected ? ICONS.find((e) => e.name === selected) ?? null : null;

  const cardBase =
    "flex flex-col items-center gap-2.5 rounded-[6px] border p-4 transition-colors cursor-pointer border-[var(--border-static-subtle-neutral,#e1e1e8)] bg-[var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)] hover:bg-[var(--container-dynamic-neutral-subtle-background-default-variation,#ebebf0)]";
  const captionCls =
    "text-center break-all text-[length:var(--body-sm-regular-size,12px)] leading-[var(--body-sm-regular-line-height,18px)] text-[var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)]";

  return (
    <div className="flex w-full flex-col gap-4">
      {/* Search */}
      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <span className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2">
            <MagnifyingGlass size={16} color="var(--container-dynamic-neutral-subtle-foreground-disabled, #a8a8b2)" />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 109 icons…"
            className="w-full rounded-[6px] border border-[var(--border-static-subtle-neutral,#e1e1e8)] bg-[var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)] py-2 pl-8 pr-3 text-[13px] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] placeholder:text-[var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)] focus:outline-none"
          />
        </div>
        <span className="shrink-0 text-[12px] text-[var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)]">
          {filtered.length} / {ICONS.length}
        </span>
      </div>

      {/* Selected-icon detail (Developer Mode style) */}
      {selectedEntry && (
        <div className="flex items-center justify-between gap-4 rounded-[6px] border border-[var(--border-static-subtle-neutral,#e1e1e8)] bg-[var(--container-dynamic-neutral-subtle-background-default-variation,#ebebf0)] p-4">
          <div className="flex items-center gap-4">
            <div className="flex h-[48px] w-[48px] items-center justify-center rounded-[6px] bg-[var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)]">
              <GlyphBox Comp={resolveComp(selectedEntry, pointing)} size={32} weight={weight} />
            </div>
            <div className="flex flex-col gap-1">
              <span className="font-mono text-[13px] font-semibold text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]">
                Icon/{selectedEntry.name}
              </span>
              <span className="text-[11px] text-[var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)]">
                Style={style}, Size={size}, State=Default
                {selectedEntry.directional ? `, Pointing=${pointing}` : ""}
              </span>
              <span className="text-[11px] text-[var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)]">
                Variants: Style=Regular|Fill|Duotone · Size=16|20|24|32
                {selectedEntry.directional ? " · Pointing=Up|Down|Left|Right" : ""}
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setSelected(null)}
            aria-label="Close detail"
            className="flex h-7 w-7 items-center justify-center rounded-[6px] hover:bg-[var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)]"
          >
            <X size={16} color={ICON_COLOR} />
          </button>
        </div>
      )}

      {/* Grid */}
      <div className="grid w-full grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {filtered.map((entry) => {
          const Comp = resolveComp(entry, pointing);
          const active = selected === entry.name;
          return (
            <button
              type="button"
              key={entry.name}
              onClick={() => setSelected((s) => (s === entry.name ? null : entry.name))}
              className={`${cardBase} ${
                active ? "outline outline-2 outline-[var(--border-static-subtle-neutral,#e1e1e8)]" : ""
              }`}
              title={`Icon/${entry.name}`}
            >
              <div className="flex h-[48px] w-[48px] items-center justify-center">
                <GlyphBox Comp={Comp} size={size} weight={weight} />
              </div>
              <span className={captionCls}>{entry.name}</span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <p className="py-8 text-center text-[13px] text-[var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)]">
          No icons match “{query}”.
        </p>
      )}
    </div>
  );
}

const config: PlaygroundConfig = {
  name: "Icons",
  description:
    "Phosphor-based icon catalog — all 109 Fiber icon sets. Browse across Regular / Fill / Duotone styles and four sizes, search by name, and click an icon to inspect its Figma name and variants.",
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
      label: "Pointing (arrow / caret)",
      options: ["Up", "Down", "Left", "Right"],
      defaultValue: "Up",
    },
  ],
  render: (props, theme) => <IconsGallery props={props} dark={theme === "dark"} />,
  tokens: {
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "container/dynamic/neutral/subtle/background/default/regular":
      "var(--container-dynamic-neutral-subtle-background-default-regular)",
    "container/dynamic/neutral/subtle/background/default/variation":
      "var(--container-dynamic-neutral-subtle-background-default-variation)",
    "container/dynamic/neutral/subtle/foreground/disabled":
      "var(--container-dynamic-neutral-subtle-foreground-disabled)",
  },
};

export default function IconsPage(): JSX.Element {
  return (
    <section aria-label="Icon catalog playground" className="flex flex-col gap-6">
      <Playground config={config} />
    </section>
  );
}
