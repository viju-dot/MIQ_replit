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
import { ChatCircle, GitBranch, ListBullets, Trash } from "@phosphor-icons/react";
import {
  prototypeRepository,
  type Prototype,
  type PrototypeVersion,
} from "@/lib/prototypeStore";
import {
  commentRepository,
  type PrototypeComment,
  type CommentAnchor,
} from "@/lib/commentStore";
import { deriveTargetLabel } from "@/lib/commentTarget";
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
  hoverBg: "var(--container-dynamic-neutral-subtle-background-hover,#71718014)",
};

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

/* ------------------------------------------------------------------ */
/* Local DS-style segmented button group                              */
/* ------------------------------------------------------------------ */

type Side = "Left" | "Right";

function radiusStyle(side: Side): React.CSSProperties {
  const r = "var(--old-radiuses-2,2px)";
  if (side === "Left") {
    return { borderTopLeftRadius: r, borderBottomLeftRadius: r };
  }
  return { borderTopRightRadius: r, borderBottomRightRadius: r };
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

function CommentsPanelBody({
  comments,
  versions,
}: {
  comments: PrototypeComment[];
  versions: PrototypeVersion[];
}) {
  const [filter, setFilter] = useState<string>("All");
  const filtered =
    filter === "All"
      ? comments
      : comments.filter((c) => c.versionName === filter);

  const chips = ["All", ...versions.map((v) => v.name).reverse()];

  return (
    <div className="flex flex-col gap-[var(--spacing-200,16px)] p-[var(--spacing-300,24px)]">
      {/* Version filter chips */}
      <div className="flex flex-wrap items-center gap-1.5" role="group" aria-label="Filter comments by version">
        {chips.map((chip) => {
          const active = filter === chip;
          return (
            <button
              key={chip}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(chip)}
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

      {filtered.length === 0 ? (
        <div
          className="flex flex-col items-center gap-2 rounded-[var(--radius-100,8px)] border border-dashed p-[var(--spacing-400,32px)] text-center"
          style={{ borderColor: C.border }}
        >
          <ChatCircle size={24} style={{ color: C.textMuted }} aria-hidden />
          <p className="text-[length:var(--body-md-medium-size,14px)] font-medium" style={{ color: C.textPrimary }}>
            No comments yet
          </p>
          <p className="text-[12px]" style={{ color: C.textMuted }}>
            {filter === "All"
              ? "Turn on comment mode and click the prototype to leave feedback."
              : `No comments left against ${filter}.`}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-[var(--spacing-150,12px)]">
          {filtered.map((c) => (
            <li
              key={c.id}
              className="flex flex-col gap-1.5 rounded-[var(--radius-100,8px)] border border-solid p-[var(--spacing-200,16px)]"
              style={{ backgroundColor: C.surface, borderColor: C.border }}
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className="text-[length:var(--body-md-medium-size,14px)] font-semibold"
                  style={{ color: C.textPrimary }}
                >
                  {c.author}
                </span>
                <span
                  className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
                  style={{ backgroundColor: C.brandSubtle, color: C.brandFg }}
                >
                  {c.versionName}
                </span>
              </div>
              {/* Target label — where on the prototype this comment is pinned. */}
              <p className="text-[11px] font-medium" style={{ color: C.textMuted }}>
                {c.anchor ? c.anchor.targetLabel : "Unpinned"}
              </p>
              <p
                className="whitespace-pre-wrap text-[length:var(--body-sm-regular-size,12px)]"
                style={{ color: C.textBody }}
              >
                {c.text}
              </p>
              <p className="text-[11px]" style={{ color: C.textMuted }}>
                {c.versionName} · {fmtDate(c.createdAt)} · {fmtTime(c.createdAt)}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
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
}

function InlineComposer({
  draft,
  authors,
  onPost,
  onCancel,
}: {
  draft: DraftPin;
  authors: string[];
  onPost: (author: string, text: string) => void;
  onCancel: () => void;
}) {
  const [choice, setChoice] = useState<string>(
    authors.length > 0 ? authors[0] : NEW_NAME,
  );
  const [newName, setNewName] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => textRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, []);

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
    onPost(resolvedName, text.trim());
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
            setError(null);
          }}
          newName={newName}
          onNewNameChange={(v) => {
            setNewName(v);
            setError(null);
          }}
        />
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
/* Marker pin + bubble                                                 */
/* ------------------------------------------------------------------ */

function MarkerBubble({
  comment,
  flipRight,
  flipUp,
  onDelete,
  onClose,
}: {
  comment: PrototypeComment;
  flipRight: boolean;
  flipUp: boolean;
  onDelete: () => void;
  onClose: () => void;
}) {
  const [delHover, setDelHover] = useState(false);
  return (
    <div
      role="dialog"
      aria-label={`Comment by ${comment.author}`}
      onClick={(e) => e.stopPropagation()}
      className="pointer-events-auto absolute z-[4] w-[260px] rounded-[var(--radius-100,8px)] border border-solid p-[var(--spacing-200,16px)] shadow-lg"
      style={{
        left: "50%",
        top: "50%",
        transform: `translate(${flipRight ? "-100%" : "0"}, ${
          flipUp ? "-100%" : "0"
        }) translate(${flipRight ? "-14px" : "14px"}, ${flipUp ? "-14px" : "14px"})`,
        backgroundColor: C.surface,
        borderColor: C.border,
      }}
    >
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center justify-between gap-2">
          <span
            className="text-[length:var(--body-md-medium-size,14px)] font-semibold"
            style={{ color: C.textPrimary }}
          >
            {comment.author}
          </span>
          <button
            type="button"
            aria-label="Delete comment"
            onClick={onDelete}
            onMouseEnter={() => setDelHover(true)}
            onMouseLeave={() => setDelHover(false)}
            className="flex size-[24px] items-center justify-center rounded-[var(--radius-50,4px)] transition-colors"
            style={{ backgroundColor: delHover ? C.hoverBg : "transparent" }}
          >
            <Trash size={14} style={{ color: delHover ? C.errorFg : C.textMuted }} />
          </button>
        </div>
        {comment.anchor && (
          <p className="text-[11px] font-medium" style={{ color: C.textMuted }}>
            {comment.anchor.targetLabel}
          </p>
        )}
        <p
          className="whitespace-pre-wrap text-[length:var(--body-sm-regular-size,12px)]"
          style={{ color: C.textBody }}
        >
          {comment.text}
        </p>
        <p className="text-[11px]" style={{ color: C.textMuted }}>
          {comment.versionName} · {fmtDate(comment.createdAt)} · {fmtTime(comment.createdAt)}
        </p>
        <div className="mt-1 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="text-[11px] font-medium underline-offset-2 hover:underline"
            style={{ color: C.textMuted }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function Marker({
  comment,
  index,
  open,
  onToggle,
  onDelete,
}: {
  comment: PrototypeComment;
  index: number;
  open: boolean;
  onToggle: () => void;
  onDelete: () => void;
}) {
  const anchor = comment.anchor;
  if (!anchor) return null;
  const flipRight = anchor.xPct > 60;
  const flipUp = anchor.yPct > 60;
  return (
    <div
      className="absolute"
      style={{ left: `${anchor.xPct}%`, top: `${anchor.yPct}%` }}
    >
      {/* The pin is positioned at the anchor point (its bottom-left tip). */}
      <button
        type="button"
        aria-label={`Comment ${index + 1} by ${comment.author}`}
        aria-expanded={open}
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        className="pointer-events-auto relative flex size-[26px] -translate-x-1/2 -translate-y-full items-center justify-center rounded-full rounded-bl-none border-2 text-[11px] font-semibold shadow-md outline-none focus-visible:z-[5]"
        style={{
          backgroundColor: C.brandBg,
          borderColor: C.brandFgOn,
          color: C.brandFgOn,
          ...(open ? { boxShadow: FOCUS_RING } : null),
        }}
      >
        {index + 1}
      </button>
      {open && (
        <MarkerBubble
          comment={comment}
          flipRight={flipRight}
          flipUp={flipUp}
          onDelete={onDelete}
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

  if (!collab) return null;

  const { markers, authors, addComment, removeComment, viewedVersion } = collab;

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
    setDraft({ xPct, yPct, targetLabel });
  }

  function postDraft(author: string, text: string) {
    if (!draft) return;
    addComment(author, text, {
      xPct: draft.xPct,
      yPct: draft.yPct,
      targetLabel: draft.targetLabel,
    });
    setDraft(null);
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

      {/* Markers for the currently VIEWED version. */}
      {markers.map((c, i) => (
        <Marker
          key={c.id}
          comment={c}
          index={i}
          open={openMarkerId === c.id}
          onToggle={() =>
            setOpenMarkerId((cur) => (cur === c.id ? null : c.id))
          }
          onDelete={() => {
            removeComment(c.id);
            setOpenMarkerId(null);
          }}
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
              style={{ backgroundColor: C.brandBg, borderColor: C.brandFgOn }}
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

  // Escape exits comment mode.
  useEffect(() => {
    if (!commentMode) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setCommentMode(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [commentMode]);

  // No matching prototype (or no versions) → render children version-unaware.
  if (!proto || proto.versions.length === 0) return <>{children}</>;

  const viewedVersion =
    proto.versions.find((v) => v.id === viewedVersionId) ??
    proto.versions[proto.versions.length - 1];
  const isNewest =
    viewedVersion.id === proto.versions[proto.versions.length - 1].id;

  const reconcile = () => setTick((t) => t + 1);

  // Markers = comments for the viewed version WITH a valid anchor.
  const markers = comments
    .filter((c) => c.versionId === viewedVersion.id && c.anchor)
    // Oldest-first so numbered pins read 1..n chronologically.
    .slice()
    .reverse();

  function addComment(author: string, text: string, anchor: CommentAnchor) {
    if (!proto) return;
    commentRepository.add({
      prototypeId: proto.id,
      versionId: viewedVersion.id,
      versionName: viewedVersion.name,
      author,
      text,
      anchor,
    });
    setTick((t) => t + 1);
  }

  function removeComment(id: string) {
    commentRepository.remove(id);
    setTick((t) => t + 1);
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
          markers,
          authors,
          addComment,
          removeComment,
        }}
      >
        {/* Prototype content — re-mounted per viewed version so version
            switching actually drives the render. */}
        <div key={viewedVersion.id} className="contents">
          {children}
        </div>

        {/* Floating control cluster — bottom-right, ~24px from edges. */}
        <div
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
              label="Options / Ideation"
              onClick={() => {
                reconcile();
                setOptionsOpen(true);
              }}
            />
            <Segment
              side="Right"
              selected={commentMode}
              overlap={false}
              icon={<ChatCircle size={16} />}
              label="Comments"
              ariaPressed={commentMode}
              onClick={() => setCommentMode((v) => !v)}
            />
          </div>
        </div>

        {/* Options / Ideation — Side Panel (version list + secondary comments). */}
        <SidePanel
          open={optionsOpen}
          onClose={() => setOptionsOpen(false)}
          title="Options / Ideation"
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
          <CommentsPanelBody comments={comments} versions={proto.versions} />
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
