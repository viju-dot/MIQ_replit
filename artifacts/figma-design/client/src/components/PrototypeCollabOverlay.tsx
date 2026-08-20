/* =========================================================================
 * Fiber Workspace — Prototype Collaboration Overlay
 *
 * A reusable, self-contained overlay mounted ON TOP of an ACTUAL rendered
 * prototype experience (e.g. the standalone TV Audience Intelligence app at
 * /tv-audience-intelligence). It adds lightweight, deliberately-simple version
 * control & collaboration WITHOUT any Git-like branching:
 *
 *   1. A bottom-right floating segmented button group (styled after the DS
 *      Button Group — replicated locally, not imported) with two segments:
 *        [ Options / Ideation | Comments ]
 *      plus a subtle always-visible "Current version: Vn" chip.
 *   2. Options / Ideation → a Side Panel listing ALL versions (newest-first).
 *      Selecting a version switches the CURRENTLY VIEWED version (view-state
 *      only — it never mutates the stored versions). The chip + selected-row
 *      highlight update immediately.
 *   3. Comments → a small DS popover anchored to the button group with two
 *      actions: "Add new comment" (DS Dialog, combobox-lite name + textarea)
 *      and "Show all comments" (Side Panel, newest-first, badged/filterable by
 *      version). Comments are saved against the prototype + CURRENTLY VIEWED
 *      version.
 *
 * Mounting: rendered by the prototype route page (TvAudienceApp). It looks the
 * prototype up from prototypeRepository by matching `route` (or an explicit
 * prototypeId), and renders nothing if none is found. NOT used on the public
 * read-only /share/:token view.
 *
 * COLOR CONVENTION: token-driven colors via inline style objects
 * (var(--token, fallbackHex)); layout / spacing / typography-size stay classes.
 * The overlay's own chrome sits above the prototype UI (z-40) but BELOW any app
 * modals it opens (SidePanel z-50 / DS Dialog z-50 portal).
 * ========================================================================= */

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { ChatCircle, GitBranch } from "@phosphor-icons/react";
import {
  prototypeRepository,
  type Prototype,
  type PrototypeVersion,
} from "@/lib/prototypeStore";
import {
  commentRepository,
  type PrototypeComment,
} from "@/lib/commentStore";
import { PrototypeVersionProvider } from "@/lib/prototypeVersionContext";
import { SidePanel } from "@/pages/app/SidePanel";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
  ariaExpanded,
  ariaHaspopup,
  buttonRef,
}: {
  side: Side;
  selected: boolean;
  overlap: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  ariaExpanded?: boolean;
  ariaHaspopup?: boolean;
  buttonRef?: React.Ref<HTMLButtonElement>;
}) {
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const bg = selected ? SEG.selectedBg : hover ? SEG.hoverBg : SEG.unselectedBg;
  const fg = selected ? SEG.selectedFg : hover ? SEG.hoverFg : SEG.unselectedFg;
  return (
    <button
      ref={buttonRef}
      type="button"
      aria-pressed={selected}
      aria-expanded={ariaExpanded}
      aria-haspopup={ariaHaspopup ? "dialog" : undefined}
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
/* Add-comment dialog                                                  */
/* ------------------------------------------------------------------ */

const NEW_NAME = "__new__";

function AddCommentDialog({
  open,
  onOpenChange,
  authors,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  authors: string[];
  onSubmit: (author: string, text: string) => void;
}) {
  const [nameChoice, setNameChoice] = useState<string>(NEW_NAME);
  const [newName, setNewName] = useState("");
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Reset local state whenever the dialog is (re)opened.
  function handleOpenChange(v: boolean) {
    if (v) {
      setNameChoice(authors.length > 0 ? authors[0] : NEW_NAME);
      setNewName("");
      setText("");
      setError(null);
    }
    onOpenChange(v);
  }

  const usingNew = nameChoice === NEW_NAME;
  const resolvedName = usingNew ? newName.trim() : nameChoice.trim();

  function submit() {
    if (resolvedName.length === 0) {
      setError("Please enter a name.");
      return;
    }
    if (text.trim().length === 0) {
      setError("Please enter a comment.");
      return;
    }
    onSubmit(resolvedName, text.trim());
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent
        className="max-w-md"
        style={{ backgroundColor: C.surface, borderColor: C.border }}
      >
        <DialogHeader>
          <DialogTitle style={{ color: C.textPrimary }}>Add new comment</DialogTitle>
          <DialogDescription style={{ color: C.textMuted }}>
            Your feedback is saved against the version you are currently viewing.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-[var(--spacing-200,16px)]">
          {/* Name — combobox-lite: pick an existing commenter or add a new name. */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="collab-comment-name" style={{ color: C.textBody }}>
              Name
            </Label>
            <Select
              value={nameChoice}
              onValueChange={(v) => {
                setNameChoice(v);
                setError(null);
              }}
            >
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
                onChange={(e) => {
                  setNewName(e.target.value);
                  setError(null);
                }}
              />
            )}
          </div>

          {/* Comment body */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="collab-comment-text" style={{ color: C.textBody }}>
              Comment
            </Label>
            <Textarea
              id="collab-comment-text"
              rows={4}
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
        </div>

        <div className="mt-2 flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-[var(--radius-100,8px)] border border-solid px-[var(--spacing-200,16px)] py-[var(--spacing-100,8px)] text-[length:var(--body-md-medium-size,14px)] font-medium transition-colors"
            style={{ borderColor: C.border, color: C.textBody, backgroundColor: C.surface }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={submit}
            className="rounded-[var(--radius-100,8px)] px-[var(--spacing-200,16px)] py-[var(--spacing-100,8px)] text-[length:var(--body-md-medium-size,14px)] font-medium transition-colors"
            style={{ backgroundColor: C.brandBg, color: C.brandFgOn }}
          >
            Submit
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/* Comments list (Show all comments panel)                            */
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
              ? "Be the first to leave feedback on this prototype."
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
/* Popover action (inline hover — no Tailwind var() hover classes)     */
/* ------------------------------------------------------------------ */

function PopoverAction({
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
}) {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex items-center gap-2 rounded-[var(--radius-100,8px)] px-2.5 py-2 text-left text-[length:var(--body-md-regular-size,14px)] transition-colors"
      style={{ color: C.textBody, backgroundColor: hover ? C.hoverBg : "transparent" }}
    >
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Overlay + version provider (wraps the prototype content)            */
/* ------------------------------------------------------------------ */

export interface PrototypeCollabOverlayProps {
  /** Explicit prototype id. If omitted, `route` is used to look one up. */
  prototypeId?: string;
  /** Route to match against prototypeRepository (e.g. "/tv-audience-intelligence"). */
  route?: string;
  /**
   * The prototype experience to render. It is re-mounted (keyed by the viewed
   * version id) whenever the viewed version changes, and can consume the viewed
   * version via usePrototypeVersion(). When no matching prototype exists, the
   * children are rendered as-is (version-unaware).
   */
  children: ReactNode;
}

export function PrototypeCollabOverlay({
  prototypeId,
  route,
  children,
}: PrototypeCollabOverlayProps): JSX.Element {
  // A refresh tick re-reads the repository (prototype + comments). Bumped when a
  // panel opens (reconcile against store updates) and after adding a comment.
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

  // View-state ONLY: which version the user is currently looking at. Defaults
  // to the newest (= current). Persist last-viewed per prototype in session.
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
  const [commentsPopoverOpen, setCommentsPopoverOpen] = useState(false);
  const [addCommentOpen, setAddCommentOpen] = useState(false);
  const [showCommentsOpen, setShowCommentsOpen] = useState(false);

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

  // Reconcile the viewed selection whenever the prototype/versions change: if
  // the current selection points to a version that no longer exists, fall back
  // to the newest AND repair state + sessionStorage.
  useEffect(() => {
    if (!proto || proto.versions.length === 0) return;
    const exists = proto.versions.some((v) => v.id === viewedVersionId);
    if (!exists) {
      const newestId = proto.versions[proto.versions.length - 1].id;
      selectVersion(newestId);
    }
  }, [proto, viewedVersionId, selectVersion]);

  // No matching prototype (or no versions) → render children version-unaware.
  if (!proto || proto.versions.length === 0) return <>{children}</>;

  const viewedVersion =
    proto.versions.find((v) => v.id === viewedVersionId) ??
    proto.versions[proto.versions.length - 1];
  const isNewest =
    viewedVersion.id === proto.versions[proto.versions.length - 1].id;

  // Re-reads the store when a panel opens so stale selections/comments repair.
  const reconcile = () => setTick((t) => t + 1);

  function handleAddComment(author: string, text: string) {
    if (!proto) return;
    commentRepository.add({
      prototypeId: proto.id,
      versionId: viewedVersion.id,
      versionName: viewedVersion.name,
      author,
      text,
    });
    setTick((t) => t + 1);
    // Surface it immediately in the comments list.
    setShowCommentsOpen(true);
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
      {/* Prototype content — re-mounted per viewed version so version switching
          actually drives the render, not just the chip. */}
      <div key={viewedVersion.id} className="contents">
        {children}
      </div>

      {/* Floating control cluster — bottom-right, ~24px from edges, above the
          prototype UI (z-40) but below SidePanel / Dialog portals (z-50). */}
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
              setCommentsPopoverOpen(false);
              reconcile();
              setOptionsOpen(true);
            }}
            ariaExpanded={optionsOpen}
          />
          <Popover open={commentsPopoverOpen} onOpenChange={setCommentsPopoverOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                aria-pressed={commentsPopoverOpen}
                aria-expanded={commentsPopoverOpen}
                className="relative flex h-[34px] shrink-0 items-center gap-1.5 border border-solid px-[var(--spacing-200,16px)] outline-none transition-colors duration-150 focus-visible:z-10"
                style={{
                  backgroundColor: commentsPopoverOpen ? SEG.selectedBg : SEG.unselectedBg,
                  borderColor: SEG.border,
                  color: commentsPopoverOpen ? SEG.selectedFg : SEG.unselectedFg,
                  borderTopRightRadius: "var(--old-radiuses-2,2px)",
                  borderBottomRightRadius: "var(--old-radiuses-2,2px)",
                }}
              >
                <span className="flex items-center" aria-hidden>
                  <ChatCircle size={16} />
                </span>
                <span className="whitespace-nowrap font-['DM_Sans'] text-[length:var(--body-md-medium-size,14px)] font-medium leading-[var(--body-md-medium-line-height,20px)]">
                  Comments
                </span>
              </button>
            </PopoverTrigger>
            <PopoverContent
              side="top"
              align="end"
              className="z-40 w-56 p-1.5"
              style={{ backgroundColor: C.surface, borderColor: C.border }}
            >
              <div className="flex flex-col">
                <PopoverAction
                  label="Add new comment"
                  onClick={() => {
                    setCommentsPopoverOpen(false);
                    setAddCommentOpen(true);
                  }}
                />
                <PopoverAction
                  label="Show all comments"
                  onClick={() => {
                    setCommentsPopoverOpen(false);
                    reconcile();
                    setShowCommentsOpen(true);
                  }}
                />
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Options / Ideation — Side Panel (version list). */}
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
        </div>
      </SidePanel>

      {/* Show all comments — Side Panel. */}
      <SidePanel
        open={showCommentsOpen}
        onClose={() => setShowCommentsOpen(false)}
        title="Comments"
        subtitle={`${proto.name} · ${comments.length} total`}
        size="400"
      >
        <CommentsPanelBody comments={comments} versions={proto.versions} />
      </SidePanel>

      {/* Add new comment — DS Dialog. */}
      <AddCommentDialog
        open={addCommentOpen}
        onOpenChange={setAddCommentOpen}
        authors={authors}
        onSubmit={handleAddComment}
      />
    </PrototypeVersionProvider>
  );
}
