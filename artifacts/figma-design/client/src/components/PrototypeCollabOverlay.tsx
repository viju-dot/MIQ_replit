/* =========================================================================
 * Fiber Workspace — Prototype Collaboration Overlay
 *
 * A reusable, self-contained overlay mounted ON TOP of an ACTUAL rendered
 * prototype experience (e.g. the standalone TV Audience Intelligence app at
 * /tv-audience-intelligence). It adds lightweight, deliberately-simple version
 * control & Figma-style commenting WITHOUT any Git-like branching:
 *
 *   1. A bottom-right floating segmented button group (styled after the DS
 *      Button Group — replicated locally, not imported):
 *        [ Options / Ideation | Comments ]
 *      plus a subtle always-visible "Current version: Vn" chip.
 *   2. Options / Ideation → a Side Panel listing ALL versions (newest-first);
 *      selecting one switches the CURRENTLY VIEWED version (view-state only).
 *      It also hosts the "Show all comments" secondary list view.
 *   3. Comments → toggles COMMENT MODE on the prototype (no popover menu, no
 *      central dialog). In comment mode, clicking anywhere on the prototype
 *      drops a pin + inline composer. Comments are pinned via <PrototypeCommentLayer>
 *      rendered INSIDE the prototype's scrollable content wrapper so pins scroll
 *      with the content.
 *
 * Mounting: rendered by the prototype route page (TvAudienceApp) which wraps its
 * experience as children and mounts <PrototypeCommentLayer> inside its content
 * wrapper. The overlay looks the prototype up from prototypeRepository by
 * matching `route` (or explicit prototypeId); renders children version-unaware
 * when none is found. NOT used on the public read-only /share/:token view.
 *
 * COLOR CONVENTION: token-driven colors via inline style objects
 * (var(--token, fallbackHex)); layout / spacing / typography-size stay classes.
 * ========================================================================= */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowBendUpLeft,
  ArrowsOut,
  ChatCircle,
  Eye,
  EyeSlash,
  GitBranch,
  ListBullets,
  NotePencil,
  Paperclip,
  Trash,
  X,
} from "@phosphor-icons/react";
import {
  prototypeRepository,
  type Prototype,
  type PrototypeVersion,
} from "@/lib/prototypeStore";
import {
  commentRepository,
  COMMENT_COLORS,
  DEFAULT_COMMENT_COLOR,
  type PrototypeComment,
  type CommentAnchor,
  type CommentAttachment,
  type CommentColor,
} from "@/lib/commentStore";
import { downscaleImageFile, linkifyParts } from "@/lib/commentMedia";
import { deriveTargetLabel } from "@/lib/commentTarget";
import {
  annotationRepository,
  type DesignAnnotation,
  type AnnotationPatch,
  type NewAnnotationInput,
} from "@/lib/annotationStore";
import { AnnotationsPanelBody } from "@/components/DesignAnnotationLayer";
// Re-exported so prototype pages import the in-content layer from the same
// module as PrototypeCommentLayer (parallel structure).
export { DesignAnnotationLayer } from "@/components/DesignAnnotationLayer";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { PrototypeVersionProvider } from "@/lib/prototypeVersionContext";
import {
  PrototypeCollabProvider,
  usePrototypeCollab,
} from "@/lib/prototypeCollabContext";
import { SidePanel } from "@/pages/app/SidePanel";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

/* ------------------------------------------------------------------ */
/* Tokens                                                              */
/* ------------------------------------------------------------------ */

const C = {
  surface: "var(--surface-background-lvl1,#ffffff)",
  surface2: "var(--surface-background-lvl2,#f7f7fa)",
  border: "var(--border-static-subtle-neutral,#e1e1e8)",
  textPrimary: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
  textMuted: "var(--surface-foreground-static-neutral-lvl3,#717180)",
  textBody: "var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)",
  brandSubtle: "var(--container-dynamic-brand-subtle-background-default,#f6ebff)",
  brandFg: "var(--surface-foreground-dynamic-brand-default,#7c33b5)",
  brandBg: "var(--container-dynamic-brand-bold-background-default,#7c33b5)",
  brandBgHover: "var(--container-dynamic-brand-bold-background-hover,#702ea3)",
  brandFgOn: "var(--container-dynamic-brand-bold-foreground-default,#ffffff)",
  inputBorder: "var(--border-dynamic-neutral-subtle-default,#c6c6cc)",
  errorFg: "var(--container-dynamic-error-subtle-foreground-default,#da294b)",
  errorSubtleBg: "var(--container-dynamic-error-subtle-background-default,#fbe9ec)",
  hoverBg: "var(--container-dynamic-neutral-subtle-background-hover,#71718014)",
};

/** Six predefined, token-backed author colors (never arbitrary user input). */
const COMMENT_SWATCHES: Record<
  CommentColor,
  { label: string; value: string }
> = {
  purple: { label: "Purple", value: "var(--datavis-qualitative-4,#7c33b5)" },
  blue: { label: "Blue", value: "var(--datavis-qualitative-8,#2f6fed)" },
  orange: { label: "Orange", value: "var(--datavis-qualitative-2,#c45d10)" },
  green: { label: "Green", value: "var(--datavis-qualitative-9,#1e7d54)" },
  pink: { label: "Pink", value: "var(--datavis-qualitative-5,#c52d6f)" },
  teal: { label: "Teal", value: "var(--datavis-qualitative-10,#087f8c)" },
};

const commentColorValue = (color: CommentColor): string =>
  COMMENT_SWATCHES[color].value;

const authorInitials = (author: string): string =>
  author
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

function CommentColorPicker({
  value,
  onChange,
}: {
  value: CommentColor;
  onChange: (color: CommentColor) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-[12px] font-medium" style={{ color: C.textBody }}>
        Comment color
      </span>
      <div className="flex items-center gap-2" role="radiogroup" aria-label="Comment color">
        {COMMENT_COLORS.map((color) => {
          const selected = value === color;
          return (
            <button
              key={color}
              type="button"
              role="radio"
              aria-checked={selected}
              aria-label={COMMENT_SWATCHES[color].label}
              title={COMMENT_SWATCHES[color].label}
              onClick={() => onChange(color)}
              className="size-[24px] rounded-full border-2 outline-none transition-transform focus-visible:scale-110"
              style={{
                backgroundColor: commentColorValue(color),
                borderColor: selected ? C.textPrimary : C.surface,
                boxShadow: selected
                  ? `0 0 0 2px ${C.surface}, 0 0 0 4px ${commentColorValue(color)}`
                  : `0 0 0 1px ${C.border}`,
              }}
            />
          );
        })}
      </div>
    </div>
  );
}

function AuthorAvatar({
  author,
  color,
  small = false,
}: {
  author: string;
  color: CommentColor;
  small?: boolean;
}) {
  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-full font-semibold ${
        small ? "size-[22px] text-[9px]" : "size-[28px] text-[10px]"
      }`}
      style={{ backgroundColor: commentColorValue(color), color: C.brandFgOn }}
      aria-hidden
    >
      {authorInitials(author)}
    </span>
  );
}

/** UI text shown in place of a soft-deleted comment's body. */
const DELETED_TEXT = "This comment was deleted.";

const isDeleted = (c: PrototypeComment): boolean => Boolean(c.deletedAt);

/** A small pill: version tag, or a muted "Deleted" status badge. */
function StatusBadge({ deleted }: { deleted: boolean }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={
        deleted
          ? { backgroundColor: C.errorSubtleBg, color: C.errorFg }
          : { backgroundColor: C.brandSubtle, color: C.brandFg }
      }
    >
      {deleted ? "Deleted" : "Active"}
    </span>
  );
}

/**
 * Render comment body text with http(s) URLs auto-linkified at render time.
 * Links open in a new tab (rel="noopener noreferrer") so the reviewer keeps the
 * prototype open. Not used for deleted bodies (those show the deleted message).
 * The rendered <a> is inline text — safe inside list rows since those rows are
 * NOT buttons (verified), so this creates no nested interactive controls.
 */
function CommentText({ text }: { text: string }) {
  const parts = linkifyParts(text);
  return (
    <p
      className="whitespace-pre-wrap break-words text-[length:var(--body-sm-regular-size,12px)]"
      style={{ color: C.textBody }}
    >
      {parts.map((p, i) =>
        p.href ? (
          <a
            key={i}
            href={p.href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
            style={{ color: C.brandFg }}
            onClick={(e) => e.stopPropagation()}
          >
            {p.text}
          </a>
        ) : (
          <span key={i}>{p.text}</span>
        ),
      )}
    </p>
  );
}

/**
 * A comment's image attachment: a constrained rounded thumbnail with an Expand
 * affordance that opens the DS Dialog showing the image large (object-contain,
 * fit-to-viewport). Reuses the shared Dialog component.
 */
function AttachmentThumb({
  attachment,
  authorLabel,
}: {
  attachment: CommentAttachment;
  authorLabel: string;
}) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          setOpen(true);
        }}
        aria-label="Expand attached image"
        className="group relative mt-0.5 block w-fit overflow-hidden rounded-[var(--radius-100,8px)] border border-solid outline-none"
        style={{ borderColor: C.border, backgroundColor: C.surface2 }}
      >
        <img
          src={attachment.dataUrl}
          alt={`Attachment from ${authorLabel}`}
          className="block max-h-[140px] max-w-full object-contain"
          style={{ maxWidth: "220px" }}
        />
        <span
          className="absolute bottom-1 right-1 flex items-center gap-1 rounded-[var(--radius-50,4px)] px-1.5 py-0.5 text-[10px] font-medium"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "#ffffff" }}
          aria-hidden
        >
          <ArrowsOut size={11} />
          Expand
        </span>
      </button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-[92vw] border-0 bg-transparent p-0 shadow-none sm:max-w-[92vw]">
          <DialogTitle className="sr-only">
            Attachment from {authorLabel}
          </DialogTitle>
          <img
            src={attachment.dataUrl}
            alt={`Attachment from ${authorLabel}`}
            className="mx-auto max-h-[86vh] w-auto max-w-full rounded-[var(--radius-100,8px)] object-contain"
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

// DS Button Group segment tokens (mirrored from ds/ButtonGroupPage.tsx).
const SEG = {
  selectedBg:
    "var(--container-dynamic-neutral-subtle-background-default-variation,#ebebf0)",
  unselectedBg:
    "var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)",
  hoverBg: "var(--container-dynamic-neutral-subtle-background-hover,rgba(113,113,128,0.08))",
  selectedFg: "var(--container-dynamic-neutral-subtle-foreground-selected,#13131a)",
  unselectedFg:
    "var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)",
  hoverFg: "var(--container-dynamic-neutral-subtle-foreground-hover,#13131a)",
  border: "var(--border-dynamic-neutral-subtle-default,#c6c6cc)",
};

const FOCUS_RING =
  "0 0 0 2px var(--surface-background-lvl1,#ffffff), 0 0 0 4px var(--border-dynamic-brand-selected,#7c33b5)";

/* ------------------------------------------------------------------ */
/* Date / version helpers                                             */
/* ------------------------------------------------------------------ */

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
function fmtTime(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  return d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" });
}

/** Best available description text for a version (snapshot → version → proto). */
function versionDescription(v: PrototypeVersion, proto: Prototype): string {
  return (
    v.description?.trim() ||
    v.snapshot?.description?.trim() ||
    proto.description ||
    "No description"
  );
}

const SESSION_KEY = (id: string) => `fiber:ai-prototype:viewed-version:${id}`;

const NEW_NAME = "__new__";

/** localStorage key for the "hide annotations" canvas preference (feedback #3). */
const HIDE_ANNOTATIONS_KEY = "fiber:ai-prototype:hide-annotations";

/* ------------------------------------------------------------------ */
/* Local DS-style segmented button group                              */
/* ------------------------------------------------------------------ */

type Side = "Left" | "Mid" | "Right";

function radiusStyle(side: Side): React.CSSProperties {
  const r = "var(--old-radiuses-2,2px)";
  if (side === "Left") {
    return { borderTopLeftRadius: r, borderBottomLeftRadius: r };
  }
  if (side === "Right") {
    return { borderTopRightRadius: r, borderBottomRightRadius: r };
  }
  // Middle segment — square on both ends.
  return {};
}

function Segment({
  side,
  selected,
  overlap,
  icon,
  label,
  onClick,
  ariaPressed,
}: {
  side: Side;
  selected: boolean;
  overlap: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  ariaPressed?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const bg = selected ? SEG.selectedBg : hover ? SEG.hoverBg : SEG.unselectedBg;
  const fg = selected ? SEG.selectedFg : hover ? SEG.hoverFg : SEG.unselectedFg;
  return (
    <button
      type="button"
      aria-pressed={ariaPressed ?? selected}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={(e) => setFocused(e.currentTarget.matches(":focus-visible"))}
      onBlur={() => setFocused(false)}
      className={`relative flex h-[34px] shrink-0 items-center gap-1.5 border border-solid px-[var(--spacing-200,16px)] outline-none transition-colors duration-150 ${
        focused ? "z-10" : ""
      } ${overlap ? "mr-[var(--odd-numbers-1,-1px)]" : ""}`}
      style={{
        backgroundColor: bg,
        borderColor: SEG.border,
        color: fg,
        ...radiusStyle(side),
        ...(focused ? { boxShadow: FOCUS_RING } : null),
      }}
    >
      <span className="flex items-center" aria-hidden>
        {icon}
      </span>
      <span className="whitespace-nowrap font-['DM_Sans'] text-[length:var(--body-md-medium-size,14px)] font-medium leading-[var(--body-md-medium-line-height,20px)]">
        {label}
      </span>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Version list row (Options / Ideation panel)                        */
/* ------------------------------------------------------------------ */

function VersionRow({
  version,
  proto,
  viewing,
  onSelect,
}: {
  version: PrototypeVersion;
  proto: Prototype;
  viewing: boolean;
  onSelect: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onSelect}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-current={viewing ? "true" : undefined}
      className="flex w-full flex-col items-start gap-1 rounded-[var(--radius-100,8px)] border border-solid p-[var(--spacing-200,16px)] text-left transition-colors"
      style={{
        backgroundColor: viewing ? C.brandSubtle : hover ? C.hoverBg : C.surface,
        borderColor: viewing ? C.brandFg : C.border,
      }}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <span
          className="text-[length:var(--body-md-medium-size,14px)] font-semibold"
          style={{ color: viewing ? C.brandFg : C.textPrimary }}
        >
          {version.name}
        </span>
        {viewing ? (
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: C.brandFg, color: C.brandFgOn }}
          >
            Viewing
          </span>
        ) : (
          <span className="text-[12px]" style={{ color: C.textMuted }}>
            {fmtDate(version.createdAt)} · {fmtTime(version.createdAt)}
          </span>
        )}
      </div>
      {viewing && (
        <span className="text-[12px]" style={{ color: C.textMuted }}>
          {fmtDate(version.createdAt)} · {fmtTime(version.createdAt)}
        </span>
      )}
      <p className="text-[length:var(--body-sm-regular-size,12px)]" style={{ color: C.textBody }}>
        {versionDescription(version, proto)}
      </p>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Comments list (Show all comments panel — secondary list view)      */
/* ------------------------------------------------------------------ */

type StatusFilter = "All" | "Active" | "Deleted";
type SortOrder = "Newest" | "Oldest";

/** A small segmented pill control (single-select). */
function SegmentedPills<T extends string>({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: readonly T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div
      className="inline-flex items-center rounded-full border border-solid p-0.5"
      role="group"
      aria-label={label}
      style={{ borderColor: C.border, backgroundColor: C.surface }}
    >
      {options.map((opt) => {
        const active = value === opt;
        return (
          <button
            key={opt}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(opt)}
            className="rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors"
            style={{
              backgroundColor: active ? C.brandFg : "transparent",
              color: active ? C.brandFgOn : C.textBody,
            }}
          >
            {opt}
          </button>
        );
      })}
    </div>
  );
}

function CommentsPanelBody({
  comments,
  versions,
  authors,
  onReply,
  onSoftDelete,
}: {
  comments: PrototypeComment[];
  versions: PrototypeVersion[];
  authors: string[];
  onReply: (
    parentId: string,
    author: string,
    color: CommentColor,
    text: string,
    attachment: CommentAttachment | null,
  ) => boolean;
  onSoftDelete: (id: string) => void;
}) {
  const [versionFilter, setVersionFilter] = useState<string>("All");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("All");
  const [sort, setSort] = useState<SortOrder>("Newest");

  const chips = ["All", ...versions.map((v) => v.name).reverse()];

  // Build threads: top-level comments (no parentId) with their replies.
  const topLevel = comments.filter((c) => !c.parentId);
  const repliesFor = (parentId: string) =>
    comments
      .filter((c) => c.parentId === parentId)
      .slice()
      .sort((a, b) => Date.parse(a.createdAt) - Date.parse(b.createdAt));

  // Status filter (simple + predictable):
  //  • Active:  only threads whose PARENT is active (Active NEVER shows a
  //             deleted parent card). Nested replies are rendered as-is.
  //  • Deleted: only threads whose parent is deleted OR that contain at least
  //             one deleted reply.
  //  • All:     everything.
  const threadMatchesStatus = (parent: PrototypeComment): boolean => {
    if (statusFilter === "All") return true;
    if (statusFilter === "Active") return !isDeleted(parent);
    // Deleted
    return isDeleted(parent) || repliesFor(parent.id).some(isDeleted);
  };

  let threads = topLevel.filter((parent) => {
    if (versionFilter !== "All" && parent.versionName !== versionFilter)
      return false;
    return threadMatchesStatus(parent);
  });

  threads = threads.slice().sort((a, b) => {
    const diff = Date.parse(a.createdAt) - Date.parse(b.createdAt);
    return sort === "Newest" ? -diff : diff;
  });

  return (
    <div className="flex flex-col gap-[var(--spacing-200,16px)] p-[var(--spacing-300,24px)]">
      {/* Status + sort controls */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <SegmentedPills
          label="Filter comments by status"
          options={["All", "Active", "Deleted"]}
          value={statusFilter}
          onChange={setStatusFilter}
        />
        <SegmentedPills
          label="Sort comments"
          options={["Newest", "Oldest"]}
          value={sort}
          onChange={setSort}
        />
      </div>

      {/* Version filter chips */}
      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter comments by version">
        {chips.map((chip) => {
          const active = versionFilter === chip;
          return (
            <button
              key={chip}
              type="button"
              aria-pressed={active}
              onClick={() => setVersionFilter(chip)}
              className="rounded-full border border-solid px-2.5 py-1 text-[12px] font-medium transition-colors"
              style={{
                backgroundColor: active ? C.brandFg : C.surface,
                borderColor: active ? C.brandFg : C.border,
                color: active ? C.brandFgOn : C.textBody,
              }}
            >
              {chip}
            </button>
          );
        })}
      </div>

      {threads.length === 0 ? (
        <div
          className="flex flex-col items-center gap-2 rounded-[var(--radius-100,8px)] border border-dashed p-[var(--spacing-400,32px)] text-center"
          style={{ borderColor: C.border }}
        >
          <ChatCircle size={24} style={{ color: C.textMuted }} aria-hidden />
          <p className="text-[length:var(--body-md-medium-size,14px)] font-medium" style={{ color: C.textPrimary }}>
            No comments
          </p>
          <p className="text-[12px]" style={{ color: C.textMuted }}>
            {versionFilter === "All" && statusFilter === "All"
              ? "Turn on comment mode and click the prototype to leave feedback."
              : "No comments match the current filters."}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-[var(--spacing-150,12px)]">
          {threads.map((c) => (
            <CommentThreadCard
              key={c.id}
              parent={c}
              replies={repliesFor(c.id)}
              authors={authors}
              onReply={onReply}
              onSoftDelete={onSoftDelete}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

/** A thread card in the list: parent (active or deleted) + nested replies. */
function CommentThreadCard({
  parent,
  replies,
  authors,
  onReply,
  onSoftDelete,
}: {
  parent: PrototypeComment;
  replies: PrototypeComment[];
  authors: string[];
  onReply: (
    parentId: string,
    author: string,
    color: CommentColor,
    text: string,
    attachment: CommentAttachment | null,
  ) => boolean;
  onSoftDelete: (id: string) => void;
}) {
  const [delHover, setDelHover] = useState(false);
  const [replying, setReplying] = useState(false);
  const deleted = isDeleted(parent);
  return (
    <li
      className="flex flex-col gap-1.5 rounded-[var(--radius-100,8px)] border border-solid p-[var(--spacing-200,16px)]"
      style={{
        backgroundColor: C.surface,
        borderColor: deleted ? C.border : commentColorValue(parent.color),
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AuthorAvatar author={parent.author} color={parent.color} />
          <span
            className="text-[length:var(--body-md-medium-size,14px)] font-semibold"
            style={{ color: C.textPrimary }}
          >
            {parent.author}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {deleted && <StatusBadge deleted />}
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: C.brandSubtle, color: C.brandFg }}
          >
            {parent.versionName}
          </span>
          {!deleted && (
            <button
              type="button"
              aria-label="Delete comment"
              onClick={() => onSoftDelete(parent.id)}
              onMouseEnter={() => setDelHover(true)}
              onMouseLeave={() => setDelHover(false)}
              className="flex size-[22px] items-center justify-center rounded-[var(--radius-50,4px)] transition-colors"
              style={{ backgroundColor: delHover ? C.hoverBg : "transparent" }}
            >
              <Trash size={13} style={{ color: delHover ? C.errorFg : C.textMuted }} />
            </button>
          )}
        </div>
      </div>
      {/* Target label — where on the prototype this comment is pinned. */}
      <p className="text-[11px] font-medium" style={{ color: C.textMuted }}>
        {parent.anchor ? parent.anchor.targetLabel : "Unpinned"}
      </p>
      {deleted ? (
        <p
          className="whitespace-pre-wrap text-[length:var(--body-sm-regular-size,12px)] italic"
          style={{ color: C.textMuted }}
        >
          {DELETED_TEXT}
        </p>
      ) : (
        <>
          <CommentText text={parent.text} />
          {parent.attachment && (
            <AttachmentThumb
              attachment={parent.attachment}
              authorLabel={parent.author}
            />
          )}
        </>
      )}
      <p className="text-[11px]" style={{ color: C.textMuted }}>
        {parent.versionName} · {fmtDate(parent.createdAt)} · {fmtTime(parent.createdAt)}
      </p>

      {/* Replies (stay visible even if the parent is deleted). */}
      {replies.length > 0 && (
        <div className="mt-1 flex flex-col gap-2">
          {replies.map((r) => (
            <ReplyRow key={r.id} reply={r} onSoftDelete={onSoftDelete} />
          ))}
        </div>
      )}

      {/* Reply action / composer. A deleted PARENT is READ-ONLY: no Reply
          action (its still-active replies keep their own delete actions). */}
      {!deleted &&
        (replying ? (
          <div className="mt-1">
            <ReplyComposer
              authors={authors}
              onPost={(author, color, text, attachment) => {
                const ok = onReply(parent.id, author, color, text, attachment);
                if (ok) setReplying(false);
                return ok;
              }}
              onCancel={() => setReplying(false)}
            />
          </div>
        ) : (
          <div className="mt-1">
            <button
              type="button"
              onClick={() => setReplying(true)}
              className="flex items-center gap-1 text-[11px] font-medium underline-offset-2 hover:underline"
              style={{ color: C.brandFg }}
            >
              <ArrowBendUpLeft size={13} />
              Reply
            </button>
          </div>
        ))}
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Name field (combobox-lite) — shared by the inline composer          */
/* ------------------------------------------------------------------ */

function NameField({
  authors,
  choice,
  onChoiceChange,
  newName,
  onNewNameChange,
}: {
  authors: string[];
  choice: string;
  onChoiceChange: (v: string) => void;
  newName: string;
  onNewNameChange: (v: string) => void;
}) {
  const usingNew = choice === NEW_NAME;
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="collab-comment-name" style={{ color: C.textBody }}>
        Name
      </Label>
      <Select value={choice} onValueChange={onChoiceChange}>
        <SelectTrigger id="collab-comment-name" aria-label="Commenter name">
          <SelectValue placeholder="Select a name" />
        </SelectTrigger>
        <SelectContent>
          {authors.map((a) => (
            <SelectItem key={a} value={a}>
              {a}
            </SelectItem>
          ))}
          <SelectItem value={NEW_NAME}>New name…</SelectItem>
        </SelectContent>
      </Select>
      {usingNew && (
        <Input
          aria-label="New commenter name"
          placeholder="Enter your name"
          value={newName}
          onChange={(e) => onNewNameChange(e.target.value)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Inline composer (Figma-style — anchored next to the click point)    */
/* ------------------------------------------------------------------ */

interface DraftPin {
  xPct: number;
  yPct: number;
  targetLabel: string;
  color: CommentColor;
}

/**
 * A single attachment control for a composer: paperclip button (opens a hidden
 * file input) → downscales the chosen image and shows a small removable
 * thumbnail preview before posting. One image per comment.
 */
function AttachmentPicker({
  attachment,
  onPick,
  onRemove,
  onError,
}: {
  attachment: CommentAttachment | null;
  onPick: (a: CommentAttachment) => void;
  onRemove: () => void;
  onError: (msg: string) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);

  async function handleFile(file: File | undefined) {
    if (!file) return;
    setBusy(true);
    try {
      const a = await downscaleImageFile(file);
      onPick(a);
    } catch {
      onError("Couldn't read that image. Try another file.");
    } finally {
      setBusy(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  return (
    <div className="flex flex-col gap-1.5">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => handleFile(e.target.files?.[0])}
      />
      {attachment ? (
        <div
          className="relative w-fit overflow-hidden rounded-[var(--radius-100,8px)] border border-solid"
          style={{ borderColor: C.border, backgroundColor: C.surface2 }}
        >
          <img
            src={attachment.dataUrl}
            alt="Attachment preview"
            className="block max-h-[96px] object-contain"
            style={{ maxWidth: "180px" }}
          />
          <button
            type="button"
            aria-label="Remove attachment"
            onClick={onRemove}
            className="absolute right-1 top-1 flex size-[20px] items-center justify-center rounded-full"
            style={{ backgroundColor: "rgba(0,0,0,0.6)", color: "#ffffff" }}
          >
            <X size={12} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          title="Attach an image"
          aria-label="Attach an image"
          className="flex w-fit items-center gap-1.5 rounded-[var(--radius-100,8px)] border border-solid px-[var(--spacing-150,12px)] py-[var(--spacing-100,8px)] text-[length:var(--body-sm-medium-size,12px)] font-medium transition-colors"
          style={{ borderColor: C.border, color: C.textBody, backgroundColor: C.surface }}
        >
          <Paperclip size={14} />
          {busy ? "Processing…" : "Attach image"}
        </button>
      )}
    </div>
  );
}

function InlineComposer({
  draft,
  authors,
  onPost,
  onCancel,
  onColorChange,
}: {
  draft: DraftPin;
  authors: string[];
  /** Returns true if the comment was saved; false on failure (quota). */
  onPost: (
    author: string,
    color: CommentColor,
    text: string,
    attachment: CommentAttachment | null,
  ) => boolean;
  onCancel: () => void;
  onColorChange: (color: CommentColor) => void;
}) {
  const [choice, setChoice] = useState<string>(
    authors.length > 0 ? authors[0] : NEW_NAME,
  );
  const [newName, setNewName] = useState("");
  const [color, setColor] = useState<CommentColor>(() =>
    authors.length > 0
      ? commentRepository.colorForAuthor(authors[0])
      : DEFAULT_COMMENT_COLOR,
  );
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<CommentAttachment | null>(null);
  const [error, setError] = useState<string | null>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => textRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, []);
  useEffect(() => {
    onColorChange(color);
  }, [color, onColorChange]);

  // Flip horizontally / vertically near the wrapper edges so it stays on screen.
  const flipRight = draft.xPct > 60;
  const flipUp = draft.yPct > 60;

  const resolvedName = choice === NEW_NAME ? newName.trim() : choice.trim();

  function post() {
    if (resolvedName.length === 0) {
      setError("Please enter a name.");
      return;
    }
    if (text.trim().length === 0) {
      setError("Please enter a comment.");
      return;
    }
    // onPost returns false on quota failure — keep text + attachment so the
    // user can remove the image and retry.
    const ok = onPost(resolvedName, color, text.trim(), attachment);
    if (!ok) {
      setError("Image too large to attach. Remove it and try again.");
    }
  }

  return (
    <div
      role="dialog"
      aria-label="New comment"
      onClick={(e) => e.stopPropagation()}
      className="absolute z-[3] w-[280px] rounded-[var(--radius-100,8px)] border border-solid p-[var(--spacing-200,16px)] shadow-lg"
      style={{
        left: `${draft.xPct}%`,
        top: `${draft.yPct}%`,
        transform: `translate(${flipRight ? "-100%" : "0"}, ${
          flipUp ? "-100%" : "0"
        }) translate(${flipRight ? "-12px" : "12px"}, ${flipUp ? "-12px" : "12px"})`,
        backgroundColor: C.surface,
        borderColor: C.border,
      }}
    >
      <div className="flex flex-col gap-[var(--spacing-150,12px)]">
        <p className="text-[11px] font-medium" style={{ color: C.textMuted }}>
          {draft.targetLabel}
        </p>
        <NameField
          authors={authors}
          choice={choice}
          onChoiceChange={(v) => {
            setChoice(v);
            if (v !== NEW_NAME) setColor(commentRepository.colorForAuthor(v));
            setError(null);
          }}
          newName={newName}
          onNewNameChange={(v) => {
            setNewName(v);
            setError(null);
          }}
        />
        <CommentColorPicker value={color} onChange={setColor} />
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="collab-comment-text" style={{ color: C.textBody }}>
            Comment
          </Label>
          <Textarea
            id="collab-comment-text"
            ref={textRef}
            rows={3}
            placeholder="Share your feedback…"
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setError(null);
            }}
          />
        </div>
        <AttachmentPicker
          attachment={attachment}
          onPick={(a) => {
            setAttachment(a);
            setError(null);
          }}
          onRemove={() => setAttachment(null)}
          onError={(msg) => setError(msg)}
        />
        {error && (
          <p role="alert" className="text-[12px]" style={{ color: C.errorFg }}>
            {error}
          </p>
        )}
        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-[var(--radius-100,8px)] border border-solid px-[var(--spacing-150,12px)] py-[var(--spacing-100,8px)] text-[length:var(--body-sm-medium-size,12px)] font-medium"
            style={{ borderColor: C.border, color: C.textBody, backgroundColor: C.surface }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={post}
            className="rounded-[var(--radius-100,8px)] px-[var(--spacing-150,12px)] py-[var(--spacing-100,8px)] text-[length:var(--body-sm-medium-size,12px)] font-medium"
            style={{ backgroundColor: C.brandBg, color: C.brandFgOn }}
          >
            Post
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Reply composer (used inside a thread — bubble + list)               */
/* ------------------------------------------------------------------ */

function ReplyComposer({
  authors,
  onPost,
  onCancel,
}: {
  authors: string[];
  /** Returns true if the reply was saved; false on failure (quota). */
  onPost: (
    author: string,
    color: CommentColor,
    text: string,
    attachment: CommentAttachment | null,
  ) => boolean;
  onCancel: () => void;
}) {
  const [choice, setChoice] = useState<string>(
    authors.length > 0 ? authors[0] : NEW_NAME,
  );
  const [newName, setNewName] = useState("");
  const [color, setColor] = useState<CommentColor>(() =>
    authors.length > 0
      ? commentRepository.colorForAuthor(authors[0])
      : DEFAULT_COMMENT_COLOR,
  );
  const [text, setText] = useState("");
  const [attachment, setAttachment] = useState<CommentAttachment | null>(null);
  const [error, setError] = useState<string | null>(null);

  const resolvedName = choice === NEW_NAME ? newName.trim() : choice.trim();

  function post() {
    if (resolvedName.length === 0) {
      setError("Please enter a name.");
      return;
    }
    if (text.trim().length === 0) {
      setError("Please enter a reply.");
      return;
    }
    const ok = onPost(resolvedName, color, text.trim(), attachment);
    if (!ok) {
      setError("Image too large to attach. Remove it and try again.");
    }
  }

  return (
    <div
      className="flex flex-col gap-[var(--spacing-150,12px)] rounded-[var(--radius-100,8px)] border border-solid p-[var(--spacing-150,12px)]"
      style={{ borderColor: C.border, backgroundColor: C.surface2 }}
    >
      <NameField
        authors={authors}
        choice={choice}
        onChoiceChange={(v) => {
          setChoice(v);
          if (v !== NEW_NAME) setColor(commentRepository.colorForAuthor(v));
          setError(null);
        }}
        newName={newName}
        onNewNameChange={(v) => {
          setNewName(v);
          setError(null);
        }}
      />
      <CommentColorPicker value={color} onChange={setColor} />
      <Textarea
        aria-label="Reply"
        rows={2}
        placeholder="Write a reply…"
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          setError(null);
        }}
      />
      <AttachmentPicker
        attachment={attachment}
        onPick={(a) => {
          setAttachment(a);
          setError(null);
        }}
        onRemove={() => setAttachment(null)}
        onError={(msg) => setError(msg)}
      />
      {error && (
        <p role="alert" className="text-[12px]" style={{ color: C.errorFg }}>
          {error}
        </p>
      )}
      <div className="flex items-center justify-end gap-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-[var(--radius-100,8px)] border border-solid px-[var(--spacing-150,12px)] py-[var(--spacing-100,8px)] text-[length:var(--body-sm-medium-size,12px)] font-medium"
          style={{ borderColor: C.border, color: C.textBody, backgroundColor: C.surface }}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={post}
          className="rounded-[var(--radius-100,8px)] px-[var(--spacing-150,12px)] py-[var(--spacing-100,8px)] text-[length:var(--body-sm-medium-size,12px)] font-medium"
          style={{ backgroundColor: C.brandBg, color: C.brandFgOn }}
        >
          Reply
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Thread reply rows (shared by bubble + list)                         */
/* ------------------------------------------------------------------ */

/** A single reply row with author/time and (when active) a soft-delete action. */
function ReplyRow({
  reply,
  onSoftDelete,
}: {
  reply: PrototypeComment;
  onSoftDelete: (id: string) => void;
}) {
  const [delHover, setDelHover] = useState(false);
  const deleted = isDeleted(reply);
  return (
    <div
      className="flex flex-col gap-1 border-l-2 pl-[var(--spacing-150,12px)]"
      style={{
        borderColor: deleted ? C.border : commentColorValue(reply.color),
        opacity: deleted ? 0.7 : 1,
      }}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <AuthorAvatar author={reply.author} color={reply.color} small />
          <span
            className="text-[length:var(--body-sm-medium-size,12px)] font-semibold"
            style={{ color: C.textPrimary }}
          >
            {reply.author}
          </span>
        </div>
        {deleted ? (
          <StatusBadge deleted />
        ) : (
          <button
            type="button"
            aria-label="Delete reply"
            onClick={() => onSoftDelete(reply.id)}
            onMouseEnter={() => setDelHover(true)}
            onMouseLeave={() => setDelHover(false)}
            className="flex size-[22px] items-center justify-center rounded-[var(--radius-50,4px)] transition-colors"
            style={{ backgroundColor: delHover ? C.hoverBg : "transparent" }}
          >
            <Trash size={13} style={{ color: delHover ? C.errorFg : C.textMuted }} />
          </button>
        )}
      </div>
      {deleted ? (
        <p
          className="whitespace-pre-wrap text-[length:var(--body-sm-regular-size,12px)] italic"
          style={{ color: C.textMuted }}
        >
          {DELETED_TEXT}
        </p>
      ) : (
        <>
          <CommentText text={reply.text} />
          {reply.attachment && (
            <AttachmentThumb
              attachment={reply.attachment}
              authorLabel={reply.author}
            />
          )}
        </>
      )}
      <p className="text-[11px]" style={{ color: C.textMuted }}>
        {fmtDate(reply.createdAt)} · {fmtTime(reply.createdAt)}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Marker pin + bubble                                                 */
/* ------------------------------------------------------------------ */

function MarkerBubble({
  comment,
  replies,
  authors,
  flipRight,
  flipUp,
  onReply,
  onSoftDelete,
  onClose,
}: {
  comment: PrototypeComment;
  replies: PrototypeComment[];
  authors: string[];
  flipRight: boolean;
  flipUp: boolean;
  onReply: (
    parentId: string,
    author: string,
    color: CommentColor,
    text: string,
    attachment: CommentAttachment | null,
  ) => boolean;
  onSoftDelete: (id: string) => void;
  onClose: () => void;
}) {
  const [delHover, setDelHover] = useState(false);
  const [replying, setReplying] = useState(false);
  const parentDeleted = isDeleted(comment);
  return (
    <div
      role="dialog"
      aria-label={`Comment thread by ${comment.author}`}
      onClick={(e) => e.stopPropagation()}
      className="pointer-events-auto absolute z-[4] flex max-h-[60vh] w-[280px] flex-col gap-1.5 overflow-auto rounded-[var(--radius-100,8px)] border border-solid p-[var(--spacing-200,16px)] shadow-lg"
      style={{
        left: "50%",
        top: "50%",
        transform: `translate(${flipRight ? "-100%" : "0"}, ${
          flipUp ? "-100%" : "0"
        }) translate(${flipRight ? "-14px" : "14px"}, ${flipUp ? "-14px" : "14px"})`,
        backgroundColor: C.surface,
        borderColor: parentDeleted ? C.border : commentColorValue(comment.color),
      }}
    >
      {/* Parent comment */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <AuthorAvatar author={comment.author} color={comment.color} />
          <span
            className="text-[length:var(--body-md-medium-size,14px)] font-semibold"
            style={{ color: C.textPrimary }}
          >
            {comment.author}
          </span>
        </div>
        {parentDeleted ? (
          <StatusBadge deleted />
        ) : (
          <button
            type="button"
            aria-label="Delete comment"
            onClick={() => onSoftDelete(comment.id)}
            onMouseEnter={() => setDelHover(true)}
            onMouseLeave={() => setDelHover(false)}
            className="flex size-[24px] items-center justify-center rounded-[var(--radius-50,4px)] transition-colors"
            style={{ backgroundColor: delHover ? C.hoverBg : "transparent" }}
          >
            <Trash size={14} style={{ color: delHover ? C.errorFg : C.textMuted }} />
          </button>
        )}
      </div>
      {comment.anchor && (
        <p className="text-[11px] font-medium" style={{ color: C.textMuted }}>
          {comment.anchor.targetLabel}
        </p>
      )}
      {parentDeleted ? (
        <p
          className="whitespace-pre-wrap text-[length:var(--body-sm-regular-size,12px)] italic"
          style={{ color: C.textMuted }}
        >
          {DELETED_TEXT}
        </p>
      ) : (
        <>
          <CommentText text={comment.text} />
          {comment.attachment && (
            <AttachmentThumb
              attachment={comment.attachment}
              authorLabel={comment.author}
            />
          )}
        </>
      )}
      <p className="text-[11px]" style={{ color: C.textMuted }}>
        {comment.versionName} · {fmtDate(comment.createdAt)} · {fmtTime(comment.createdAt)}
      </p>

      {/* Replies */}
      {replies.length > 0 && (
        <div className="mt-1 flex flex-col gap-2">
          {replies.map((r) => (
            <ReplyRow key={r.id} reply={r} onSoftDelete={onSoftDelete} />
          ))}
        </div>
      )}

      {/* Reply composer / actions. A deleted PARENT is READ-ONLY: no Reply
          action — only Close (its active replies keep their own delete). */}
      {replying ? (
        <div className="mt-1">
          <ReplyComposer
            authors={authors}
            onPost={(author, color, text, attachment) => {
              const ok = onReply(comment.id, author, color, text, attachment);
              if (ok) setReplying(false);
              return ok;
            }}
            onCancel={() => setReplying(false)}
          />
        </div>
      ) : (
        <div className="mt-1 flex items-center justify-between">
          {parentDeleted ? (
            <span />
          ) : (
            <button
              type="button"
              onClick={() => setReplying(true)}
              className="flex items-center gap-1 text-[11px] font-medium underline-offset-2 hover:underline"
              style={{ color: C.brandFg }}
            >
              <ArrowBendUpLeft size={13} />
              Reply
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] font-medium underline-offset-2 hover:underline"
            style={{ color: C.textMuted }}
          >
            Close
          </button>
        </div>
      )}
    </div>
  );
}

function Marker({
  comment,
  index,
  replies,
  authors,
  open,
  onToggle,
  onReply,
  onSoftDelete,
}: {
  comment: PrototypeComment;
  index: number;
  replies: PrototypeComment[];
  authors: string[];
  open: boolean;
  onToggle: () => void;
  onReply: (
    parentId: string,
    author: string,
    color: CommentColor,
    text: string,
    attachment: CommentAttachment | null,
  ) => boolean;
  onSoftDelete: (id: string) => void;
}) {
  const anchor = comment.anchor;
  if (!anchor) return null;
  const flipRight = anchor.xPct > 60;
  const flipUp = anchor.yPct > 60;
  const deleted = isDeleted(comment);
  const label = deleted
    ? `Deleted comment ${index + 1} by ${comment.author}`
    : `Comment ${index + 1} by ${comment.author}`;
  return (
    <div
      className="absolute"
      style={{ left: `${anchor.xPct}%`, top: `${anchor.yPct}%` }}
    >
      {/* The pin is positioned at the anchor point (its bottom-left tip). A
          deleted comment renders a MUTED/GHOST pin (dashed, neutral) that still
          opens its thread, but is visually distinct from active pins. */}
      <button
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className={`pointer-events-auto relative flex size-[26px] -translate-x-1/2 -translate-y-full items-center justify-center rounded-full rounded-bl-none border-2 text-[11px] font-semibold shadow-md outline-none focus-visible:z-[5] ${
          deleted ? "border-dashed" : ""
        }`}
        style={{
          backgroundColor: deleted
            ? C.surface2
            : commentColorValue(comment.color),
          borderColor: deleted ? C.textMuted : C.brandFgOn,
          color: deleted ? C.textMuted : C.brandFgOn,
          opacity: deleted ? 0.85 : 1,
          ...(open
            ? {
                boxShadow: `0 0 0 2px ${C.surface}, 0 0 0 4px ${commentColorValue(comment.color)}`,
              }
            : null),
        }}
      >
        {index + 1}
      </button>
      {open && (
        <MarkerBubble
          comment={comment}
          replies={replies}
          authors={authors}
          flipRight={flipRight}
          flipUp={flipUp}
          onReply={onReply}
          onSoftDelete={onSoftDelete}
          onClose={onToggle}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Comment layer — mounted INSIDE the prototype's content wrapper      */
/* so pins scroll with the content.                                    */
/* ------------------------------------------------------------------ */

/**
 * The in-content comment layer. Mount this as a direct child of the prototype
 * CANVAS — the positioned box whose geometry exactly matches the visual
 * prototype (e.g. the centered, max-width <main>), NOT a full-viewport-width
 * wrapper. Anchors are stored as percentages of this box and markers render
 * absolutely inside it, so pins track prototype elements on any viewport,
 * including above the canvas max-width where the canvas is narrower than the
 * viewport. Renders markers for the viewed version and, in comment mode, a
 * click-capture overlay (covering the canvas box) that drops pins. Renders
 * nothing when there is no collaboration context (e.g. /share view).
 */
export function PrototypeCommentLayer(): JSX.Element | null {
  const collab = usePrototypeCollab();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<DraftPin | null>(null);
  const [openMarkerId, setOpenMarkerId] = useState<string | null>(null);

  // Exit any open draft when leaving comment mode.
  const commentMode = collab?.commentMode ?? false;
  useEffect(() => {
    if (!commentMode) setDraft(null);
  }, [commentMode]);

  // "Comment instead" (§15): the annotation layer converts a drawn region into
  // an anchored comment by firing this event with the region-center anchor.
  useEffect(() => {
    function onStartComment(ev: Event) {
      const anchor = (ev as CustomEvent<CommentAnchor>).detail;
      if (!anchor || typeof anchor.xPct !== "number") return;
      setOpenMarkerId(null);
      setDraft({
        xPct: anchor.xPct,
        yPct: anchor.yPct,
        targetLabel: anchor.targetLabel || "Selected region",
        color: commentRepository.colorForAuthor(
          commentRepository.listAuthors()[0] ?? "",
        ),
      });
    }
    window.addEventListener("fiber:start-comment", onStartComment as EventListener);
    return () =>
      window.removeEventListener("fiber:start-comment", onStartComment as EventListener);
  }, []);

  if (!collab) return null;

  const {
    markers,
    authors,
    repliesOf,
    addComment,
    addReply,
    softDeleteComment,
    viewedVersion,
  } = collab;

  function handleCaptureClick(e: React.MouseEvent<HTMLDivElement>) {
    // The layer's parent IS the canvas box (centered, max-width). Measure
    // against it so percentages track prototype elements regardless of the
    // side gutters that appear when the viewport exceeds the canvas max-width.
    const host = wrapRef.current?.parentElement;
    if (!host) return;
    const rect = host.getBoundingClientRect();
    // Percentages relative to the FULL scrollable content of the canvas, not
    // just the visible viewport, so pins stay put when the content scrolls.
    const xPx = e.clientX - rect.left + host.scrollLeft;
    const yPx = e.clientY - rect.top + host.scrollTop;
    const width = host.scrollWidth || rect.width;
    const height = host.scrollHeight || rect.height;
    if (width <= 0 || height <= 0) return;
    const xPct = Math.min(100, Math.max(0, (xPx / width) * 100));
    const yPct = Math.min(100, Math.max(0, (yPx / height) * 100));
    // Identify the clicked element BENEATH the capture overlay. Temporarily
    // ignore pointer events on the capture element itself so elementFromPoint
    // returns the real prototype node under the cursor, not the overlay.
    const captureEl = e.currentTarget;
    const prevPE = captureEl.style.pointerEvents;
    captureEl.style.pointerEvents = "none";
    const beneath = document.elementFromPoint(e.clientX, e.clientY);
    captureEl.style.pointerEvents = prevPE;
    const targetLabel = deriveTargetLabel(beneath, host);
    setOpenMarkerId(null);
    setDraft({
      xPct,
      yPct,
      targetLabel,
      color:
        authors.length > 0
          ? commentRepository.colorForAuthor(authors[0])
          : DEFAULT_COMMENT_COLOR,
    });
  }

  function postDraft(
    author: string,
    color: CommentColor,
    text: string,
    attachment: CommentAttachment | null,
  ): boolean {
    if (!draft) return false;
    const ok = addComment(
      author,
      color,
      text,
      { xPct: draft.xPct, yPct: draft.yPct, targetLabel: draft.targetLabel },
      attachment,
    );
    if (ok) setDraft(null);
    return ok;
  }

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none absolute inset-0 z-[2]"
      aria-hidden={!commentMode && markers.length === 0 ? true : undefined}
    >
      {/* Click-capture overlay — only in comment mode. Sits ABOVE the (possibly
          inert) prototype content so clicks always register. */}
      {commentMode && (
        <div
          className="pointer-events-auto absolute inset-0"
          style={{ cursor: "crosshair" }}
          onClick={handleCaptureClick}
          role="presentation"
        />
      )}

      {/* Markers for the currently VIEWED version (top-level; deleted show as
          muted ghost pins). Numbering is chronological across all top-level
          pins so numbers stay stable when a comment is deleted. */}
      {markers.map((c, i) => (
        <Marker
          key={c.id}
          comment={c}
          index={i}
          replies={repliesOf(c.id)}
          authors={authors}
          open={openMarkerId === c.id}
          onToggle={() =>
            setOpenMarkerId((cur) => (cur === c.id ? null : c.id))
          }
          onReply={addReply}
          onSoftDelete={softDeleteComment}
        />
      ))}

      {/* Inline composer for a fresh pin. */}
      {draft && (
        <div className="pointer-events-auto">
          {/* A placeholder pin at the draft location. */}
          <div
            className="absolute"
            style={{ left: `${draft.xPct}%`, top: `${draft.yPct}%` }}
          >
            <span
              className="absolute flex size-[26px] -translate-x-1/2 -translate-y-full items-center justify-center rounded-full rounded-bl-none border-2 shadow-md"
              style={{
                backgroundColor: commentColorValue(draft.color),
                borderColor: C.brandFgOn,
              }}
              aria-hidden
            >
              <ChatCircle size={13} style={{ color: C.brandFgOn }} />
            </span>
          </div>
          <InlineComposer
            draft={draft}
            authors={authors}
            onPost={postDraft}
            onCancel={() => setDraft(null)}
            onColorChange={(color) =>
              setDraft((current) =>
                current && current.color !== color
                  ? { ...current, color }
                  : current,
              )
            }
          />
        </div>
      )}

      {/* Keep viewedVersion referenced for future per-version marker styling. */}
      <span hidden aria-hidden data-viewed-version={viewedVersion.id} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Overlay + providers (wraps the prototype content)                   */
/* ------------------------------------------------------------------ */

export interface PrototypeCollabOverlayProps {
  /** Explicit prototype id. If omitted, `route` is used to look one up. */
  prototypeId?: string;
  /** Route to match against prototypeRepository (e.g. "/tv-audience-intelligence"). */
  route?: string;
  /**
   * The prototype experience to render. It is re-mounted (keyed by the viewed
   * version id) whenever the viewed version changes, and can consume the viewed
   * version via usePrototypeVersion() and the collab state via usePrototypeCollab().
   * When no matching prototype exists, the children are rendered as-is.
   */
  children: ReactNode;
}

export function PrototypeCollabOverlay({
  prototypeId,
  route,
  children,
}: PrototypeCollabOverlayProps): JSX.Element {
  // A refresh tick re-reads the repository (prototype + comments).
  const [tick, setTick] = useState(0);

  // Re-read the prototype from the repository on every tick so store updates
  // (e.g. a newly-added version) are reflected — NOT memoized only on route/id.
  const proto = useMemo<Prototype | undefined>(() => {
    if (prototypeId) return prototypeRepository.get(prototypeId);
    if (route) return prototypeRepository.list().find((p) => p.route === route);
    return undefined;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prototypeId, route, tick]);

  // Versions newest-first (store keeps them oldest-first, append-only).
  const versionsNewestFirst = useMemo(
    () => (proto ? [...proto.versions].reverse() : []),
    [proto],
  );

  // View-state ONLY: which version the user is currently looking at.
  const [viewedVersionId, setViewedVersionId] = useState<string>(() => {
    if (!proto || proto.versions.length === 0) return "";
    const newest = proto.versions[proto.versions.length - 1];
    if (typeof window !== "undefined") {
      const saved = window.sessionStorage.getItem(SESSION_KEY(proto.id));
      if (saved && proto.versions.some((v) => v.id === saved)) return saved;
    }
    return newest.id;
  });

  const [optionsOpen, setOptionsOpen] = useState(false);
  const [showCommentsOpen, setShowCommentsOpen] = useState(false);
  const [commentMode, setCommentMode] = useState(false);
  const [annotationMode, setAnnotationMode] = useState(false);
  // Active selection tool within annotation mode. "elements" is the PRIMARY
  // hover→click picker (spec §8); "region" is the secondary drag tool.
  const [selectMode, setSelectMode] = useState<"elements" | "region">("elements");
  // Hide-annotations preference (feedback #3) — persisted so a resolved design
  // stays uncluttered across reloads. Hiding never deletes annotations.
  const [hideAnnotations, setHideAnnotationsState] = useState<boolean>(() => {
    try {
      return localStorage.getItem(HIDE_ANNOTATIONS_KEY) === "1";
    } catch {
      return false;
    }
  });
  const setHideAnnotations = (hidden: boolean) => {
    setHideAnnotationsState(hidden);
    try {
      localStorage.setItem(HIDE_ANNOTATIONS_KEY, hidden ? "1" : "0");
    } catch {
      /* ignore quota / disabled storage */
    }
  };

  // Annotation create/edit uses the shared SidePanel. Close either collaboration
  // list panel first so drawers never stack or fight over focus/inert state.
  useEffect(() => {
    const onAnnotationEditorOpen = () => {
      setOptionsOpen(false);
      setShowCommentsOpen(false);
    };
    window.addEventListener(
      "fiber:annotation-editor-open",
      onAnnotationEditorOpen,
    );
    return () =>
      window.removeEventListener(
        "fiber:annotation-editor-open",
        onAnnotationEditorOpen,
      );
  }, []);

  // Read comments (re-reads whenever tick / prototype changes).
  const comments = useMemo<PrototypeComment[]>(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => (proto ? commentRepository.list(proto.id) : []),
    [proto, tick],
  );
  const authors = useMemo<string[]>(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => commentRepository.listAuthors(),
    [tick],
  );

  // Read design annotations (re-reads whenever tick / prototype changes).
  const allAnnotations = useMemo<DesignAnnotation[]>(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => (proto ? annotationRepository.list(proto.id) : []),
    [proto, tick],
  );
  // Mirror stored design annotations to the console AND the shared API server
  // so feedback left in the preview is visible to the implementation workflow
  // (this browser's localStorage is otherwise unreachable). Best-effort only.
  useEffect(() => {
    if (!proto || allAnnotations.length === 0) return;
    try {
      console.log("[design-annotations]", JSON.stringify(allAnnotations));
    } catch {
      // Best-effort only.
    }
    const controller = new AbortController();
    fetch(`/api/annotation-mirror/${encodeURIComponent(proto.id)}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ annotations: allAnnotations }),
      signal: controller.signal,
    }).catch(() => {
      // Best-effort only; never disturb the prototype.
    });
    return () => controller.abort();
  }, [proto, allAnnotations]);

  // Authors combobox draws from BOTH comment + annotation authors so a name
  // used in either surface is offered in the other (single collaborator list).
  const annotationAuthors = useMemo<string[]>(
    // eslint-disable-next-line react-hooks/exhaustive-deps
    () => annotationRepository.listAuthors(),
    [tick],
  );
  const combinedAuthors = useMemo<string[]>(() => {
    const seen = new Set<string>();
    const out: string[] = [];
    for (const a of [...authors, ...annotationAuthors]) {
      const key = a.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        out.push(a);
      }
    }
    return out.sort((a, b) => a.localeCompare(b));
  }, [authors, annotationAuthors]);

  const selectVersion = useCallback(
    (id: string) => {
      setViewedVersionId(id);
      if (proto && typeof window !== "undefined") {
        window.sessionStorage.setItem(SESSION_KEY(proto.id), id);
      }
    },
    [proto],
  );

  // Reconcile the viewed selection: fall back to the newest version + repair
  // state/sessionStorage when the current selection no longer exists.
  useEffect(() => {
    if (!proto || proto.versions.length === 0) return;
    const exists = proto.versions.some((v) => v.id === viewedVersionId);
    if (!exists) {
      selectVersion(proto.versions[proto.versions.length - 1].id);
    }
  }, [proto, viewedVersionId, selectVersion]);

  // Escape exits comment / annotation mode.
  useEffect(() => {
    if (!commentMode && !annotationMode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setCommentMode(false);
        setAnnotationMode(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [commentMode, annotationMode]);

  // No matching prototype (or no versions) → render children version-unaware.
  if (!proto || proto.versions.length === 0) return <>{children}</>;

  const viewedVersion =
    proto.versions.find((v) => v.id === viewedVersionId) ??
    proto.versions[proto.versions.length - 1];
  const isNewest =
    viewedVersion.id === proto.versions[proto.versions.length - 1].id;

  const reconcile = () => setTick((t) => t + 1);

  // Markers = TOP-LEVEL comments (no parentId) for the viewed version WITH a
  // valid anchor. Soft-deleted ones are included so their original location can
  // still be shown (as a muted/ghost pin).
  const markers = comments
    .filter(
      (c) => !c.parentId && c.versionId === viewedVersion.id && c.anchor,
    )
    // Oldest-first so numbered pins read 1..n chronologically.
    .slice()
    .reverse();

  // Replies grouped by parent id, oldest-first for readable threads.
  const repliesOf = (parentId: string): PrototypeComment[] =>
    comments
      .filter((c) => c.parentId === parentId)
      .slice()
      .reverse();

  function addComment(
    author: string,
    color: CommentColor,
    text: string,
    anchor: CommentAnchor,
    attachment: CommentAttachment | null,
  ): boolean {
    if (!proto) return false;
    try {
      commentRepository.add({
        prototypeId: proto.id,
        versionId: viewedVersion.id,
        versionName: viewedVersion.name,
        author,
        color,
        text,
        anchor,
        attachment: attachment ?? undefined,
      });
    } catch {
      // Persist failed (e.g. localStorage quota with a large image). Signal the
      // composer so it can surface an inline error without losing typed text.
      return false;
    }
    setTick((t) => t + 1);
    return true;
  }

  function addReply(
    parentId: string,
    author: string,
    color: CommentColor,
    text: string,
    attachment: CommentAttachment | null,
  ): boolean {
    if (!proto) return false;
    // A reply inherits the PARENT's version so the whole thread maps to one
    // version. Find the parent among all comments for this prototype.
    const parent = comments.find((c) => c.id === parentId);
    try {
      commentRepository.add({
        prototypeId: proto.id,
        versionId: parent?.versionId ?? viewedVersion.id,
        versionName: parent?.versionName ?? viewedVersion.name,
        author,
        color,
        text,
        parentId,
        attachment: attachment ?? undefined,
      });
    } catch {
      return false;
    }
    setTick((t) => t + 1);
    return true;
  }

  function softDeleteComment(id: string) {
    commentRepository.softDelete(id);
    setTick((t) => t + 1);
  }

  // Design annotations for the VIEWED version, chronological (oldest-first) so
  // #NN markers read naturally. Version-scoped like comments.
  const annotations = allAnnotations
    .filter((a) => a.versionId === viewedVersion.id)
    .slice()
    .sort((a, b) => a.seq - b.seq);

  function addAnnotation(
    input: Omit<NewAnnotationInput, "prototypeId" | "versionId" | "versionName">,
  ): DesignAnnotation | null {
    if (!proto) return null;
    try {
      const created = annotationRepository.add({
        ...input,
        prototypeId: proto.id,
        versionId: viewedVersion.id,
        versionName: viewedVersion.name,
      });
      setTick((t) => t + 1);
      return created;
    } catch {
      // Persist failed (e.g. localStorage quota). Signal the editor.
      return null;
    }
  }

  function updateAnnotation(id: string, patch: AnnotationPatch) {
    annotationRepository.update(id, patch);
    setTick((t) => t + 1);
  }

  function deleteAnnotation(id: string) {
    annotationRepository.remove(id);
    setTick((t) => t + 1);
  }

  // "Comment instead" (§15): switch out of annotation mode into comment mode and
  // hand the composer a pre-anchored pin at the region center via a window event
  // the comment layer listens for.
  function startCommentAt(anchor: CommentAnchor) {
    setAnnotationMode(false);
    setCommentMode(true);
    if (typeof window !== "undefined") {
      // Defer so comment mode has mounted the capture layer before it pins.
      window.setTimeout(() => {
        window.dispatchEvent(
          new CustomEvent("fiber:start-comment", { detail: anchor }),
        );
      }, 0);
    }
  }

  return (
    <PrototypeVersionProvider
      value={{
        prototype: proto,
        viewedVersion,
        isNewest,
        setViewedVersionId: selectVersion,
      }}
    >
      <PrototypeCollabProvider
        value={{
          prototype: proto,
          viewedVersion,
          commentMode,
          annotationMode,
          selectMode,
          setSelectMode,
          hideAnnotations,
          setHideAnnotations,
          startCommentAt,
          markers,
          authors: combinedAuthors,
          repliesOf,
          addComment,
          addReply,
          softDeleteComment,
          annotations,
          addAnnotation,
          updateAnnotation,
          deleteAnnotation,
        }}
      >
        {/* Prototype content — re-mounted per viewed version so version
            switching actually drives the render. */}
        <div key={viewedVersion.id} className="contents">
          {children}
        </div>

        {/* Floating control cluster — bottom-right, ~24px from edges. */}
        <div
          data-design-annotation-floating-panel
          className="fixed bottom-[24px] right-[24px] z-40 flex flex-col items-end gap-2"
          style={{ fontFamily: '"DM Sans", Helvetica' }}
        >
          {/* Current version chip — always visible. */}
          <div
            className="flex items-center gap-1.5 rounded-full border border-solid px-3 py-1 shadow-sm"
            style={{ backgroundColor: C.surface, borderColor: C.border }}
            title={versionDescription(viewedVersion, proto)}
          >
            <span
              className="size-1.5 rounded-full"
              style={{ backgroundColor: C.brandFg }}
              aria-hidden
            />
            <span className="text-[12px] font-medium" style={{ color: C.textBody }}>
              Current version:{" "}
              <span style={{ color: C.brandFg }}>{viewedVersion.name}</span>
            </span>
          </div>

          {/* Comment-mode hint. */}
          {commentMode && (
            <div
              className="rounded-full border border-solid px-3 py-1 shadow-sm"
              style={{ backgroundColor: C.brandSubtle, borderColor: C.brandFg }}
              role="status"
            >
              <span className="text-[12px] font-medium" style={{ color: C.brandFg }}>
                Comment mode — click the prototype to pin. Esc to exit.
              </span>
            </div>
          )}

          {/* Annotation-mode contextual toolbar (spec §19). Select Elements is
              the PRIMARY tool (hover→click); Select Region is secondary; Page-
              level stays available. */}
          {annotationMode && (
            <div
              data-annotation-ui
              className="flex flex-col items-end gap-1.5 rounded-[var(--radius-100,8px)] border border-solid p-2 shadow-sm"
              style={{ backgroundColor: C.surface, borderColor: C.brandFg }}
              role="group"
              aria-label="Design Annotation"
            >
              <div className="flex w-full items-center justify-between gap-2">
                <span className="px-1 text-[11px] font-semibold" style={{ color: C.brandFg }}>
                  Design Annotation
                </span>
                <button
                  type="button"
                  aria-label="Exit Design Annotation"
                  onClick={() => setAnnotationMode(false)}
                  className="flex size-[20px] items-center justify-center rounded-[var(--radius-50,4px)]"
                  style={{ color: C.textMuted }}
                >
                  <X size={14} />
                </button>
              </div>
              {/* Tool toggle */}
              <div
                className="flex items-center rounded-full border border-solid p-0.5"
                style={{ borderColor: C.border, backgroundColor: C.surface }}
                role="radiogroup"
                aria-label="Selection tool"
              >
                <button
                  type="button"
                  role="radio"
                  aria-checked={selectMode === "elements"}
                  onClick={() => setSelectMode("elements")}
                  className="rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors"
                  style={
                    selectMode === "elements"
                      ? { backgroundColor: C.brandBg, color: C.brandFgOn }
                      : { backgroundColor: "transparent", color: C.textBody }
                  }
                >
                  Select Elements
                </button>
                <button
                  type="button"
                  role="radio"
                  aria-checked={selectMode === "region"}
                  onClick={() => setSelectMode("region")}
                  className="rounded-full px-2.5 py-1 text-[12px] font-medium transition-colors"
                  style={
                    selectMode === "region"
                      ? { backgroundColor: C.brandBg, color: C.brandFgOn }
                      : { backgroundColor: "transparent", color: C.textBody }
                  }
                >
                  Select Region
                </button>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    if (typeof window !== "undefined") {
                      window.dispatchEvent(new CustomEvent("fiber:new-page-annotation"));
                    }
                  }}
                  className="rounded-full border border-solid px-2.5 py-1 text-[11px] font-medium"
                  style={{ borderColor: C.border, color: C.textBody, backgroundColor: C.surface }}
                >
                  Page-level annotation
                </button>
                {/* Hide / show existing markers on the canvas (feedback #3). */}
                <button
                  type="button"
                  aria-pressed={hideAnnotations}
                  onClick={() => setHideAnnotations(!hideAnnotations)}
                  className="flex items-center gap-1 rounded-full border border-solid px-2.5 py-1 text-[11px] font-medium transition-colors"
                  style={{
                    borderColor: hideAnnotations ? C.brandFg : C.border,
                    color: hideAnnotations ? C.brandFg : C.textBody,
                    backgroundColor: hideAnnotations ? C.brandSubtle : C.surface,
                  }}
                >
                  {hideAnnotations ? <EyeSlash size={12} /> : <Eye size={12} />}
                  {hideAnnotations ? "Show markers" : "Hide markers"}
                </button>
              </div>
              <span className="px-1 text-[11px]" style={{ color: C.textMuted }}>
                {selectMode === "elements"
                  ? "Hover an element, click to select. ⌘/Ctrl-click for more. Esc to exit."
                  : "Drag over an area to select. Esc to exit."}
              </span>
            </div>
          )}

          {/* Segmented button group (DS Button Group style). */}
          <div
            className="flex items-start rounded-[var(--old-radiuses-2,2px)] shadow-md"
            role="group"
            aria-label="Prototype collaboration"
            style={{ backgroundColor: C.surface }}
          >
            <Segment
              side="Left"
              selected={optionsOpen}
              overlap
              icon={<GitBranch size={16} />}
              label="Options"
              onClick={() => {
                reconcile();
                setOptionsOpen(true);
              }}
            />
            <Segment
              side="Mid"
              selected={commentMode}
              overlap
              icon={<ChatCircle size={16} />}
              label="Comments"
              ariaPressed={commentMode}
              onClick={() => {
                setCommentMode((v) => {
                  const next = !v;
                  // Comment + annotation modes are mutually exclusive.
                  if (next) setAnnotationMode(false);
                  return next;
                });
              }}
            />
            <Segment
              side="Right"
              selected={annotationMode}
              overlap={false}
              icon={<NotePencil size={16} />}
              label="Design Annotation"
              ariaPressed={annotationMode}
              onClick={() => {
                setAnnotationMode((v) => {
                  const next = !v;
                  if (next) {
                    setCommentMode(false);
                    // Entering annotation mode defaults to the PRIMARY element
                    // picker (spec §8) — NOT region drawing.
                    setSelectMode("elements");
                  }
                  return next;
                });
              }}
            />
          </div>
        </div>

        {/* Options / Ideation — Side Panel (version list + secondary comments). */}
        <SidePanel
          open={optionsOpen}
          onClose={() => setOptionsOpen(false)}
          title="Options"
          subtitle={`${proto.name} · viewing ${viewedVersion.name}`}
          size="400"
        >
          <div className="flex flex-col gap-[var(--spacing-150,12px)] p-[var(--spacing-300,24px)]">
            <p className="text-[12px]" style={{ color: C.textMuted }}>
              Select a version to view it. This changes what you are viewing only —
              it does not modify saved versions.
            </p>
            {versionsNewestFirst.map((v) => (
              <VersionRow
                key={v.id}
                version={v}
                proto={proto}
                viewing={v.id === viewedVersion.id}
                onSelect={() => selectVersion(v.id)}
              />
            ))}

            {/* Secondary entry point to the full comments list view. */}
            <ShowAllCommentsButton
              count={comments.length}
              onClick={() => {
                reconcile();
                setShowCommentsOpen(true);
              }}
            />

            {/* Design Annotations section (spec §22). */}
            <div
              className="mt-2 border-t pt-[var(--spacing-200,16px)]"
              style={{ borderColor: C.border }}
            >
              <h3
                className="mb-2 text-[length:var(--body-md-medium-size,14px)] font-semibold"
                style={{ color: C.textPrimary }}
              >
                Design Annotations
              </h3>
              <AnnotationsPanelBody
                annotations={annotations}
                hideAnnotations={hideAnnotations}
                onToggleHide={() => setHideAnnotations(!hideAnnotations)}
                onRowActivate={() => setOptionsOpen(false)}
                onNewAnnotation={() => {
                  setCommentMode(false);
                  setAnnotationMode(true);
                  setSelectMode("elements");
                  setOptionsOpen(false);
                }}
                onNewPageLevel={() => {
                  setCommentMode(false);
                  setAnnotationMode(true);
                  setSelectMode("elements");
                  setOptionsOpen(false);
                  if (typeof window !== "undefined") {
                    window.setTimeout(() => {
                      window.dispatchEvent(new CustomEvent("fiber:new-page-annotation"));
                    }, 0);
                  }
                }}
              />
            </div>
          </div>
        </SidePanel>

        {/* Show all comments — Side Panel (secondary list view). */}
        <SidePanel
          open={showCommentsOpen}
          onClose={() => setShowCommentsOpen(false)}
          title="Comments"
          subtitle={`${proto.name} · ${comments.length} total`}
          size="400"
        >
          <CommentsPanelBody
            comments={comments}
            versions={proto.versions}
            authors={authors}
            onReply={addReply}
            onSoftDelete={softDeleteComment}
          />
        </SidePanel>
      </PrototypeCollabProvider>
    </PrototypeVersionProvider>
  );
}

function ShowAllCommentsButton({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="mt-2 flex w-full items-center justify-center gap-2 rounded-[var(--radius-100,8px)] border border-solid px-[var(--spacing-200,16px)] py-[var(--spacing-150,12px)] text-[length:var(--body-md-medium-size,14px)] font-medium transition-colors"
      style={{
        borderColor: C.border,
        color: C.textBody,
        backgroundColor: hover ? C.hoverBg : C.surface,
      }}
    >
      <ListBullets size={16} />
      Show all comments ({count})
    </button>
  );
}
