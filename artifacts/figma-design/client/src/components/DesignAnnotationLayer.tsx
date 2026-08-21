/* =========================================================================
 * Fiber Workspace — Design Annotation Layer
 *
 * The in-content layer + editor/details/panel for the region-based Design
 * Annotation feature (spec: attached_assets/Pasted-Task-Design-Annotation-...).
 * A SIBLING to the comment layer (PrototypeCommentLayer) — mounted as a direct
 * child of the prototype CANVAS (the centered, max-width <main>) so regions and
 * markers are stored/measured against the SAME coordinate root as comments and
 * scale across viewports. Renders nothing without collab context (e.g. /share).
 *
 *   • Region mode: click-and-drag over the canvas draws a rectangle (crosshair,
 *     capture overlay); on release the annotation editor opens. The selection
 *     never modifies the underlying design.
 *   • Submitted regions stay visible: subtle brand border + tint overlay + a
 *     numbered marker at the region's top-right; clicking it opens details.
 *   • Page-level annotations (no region) render their markers in a fixed rail.
 *   • Details: full metadata, status editing, Edit / Move / Resize / Delete /
 *     Resolve / Reopen. Move drags the body; a corner handle resizes.
 *
 * COLOR CONVENTION (matches the rest of the app): token-driven colors via inline
 * style objects (var(--token, fallbackHex)); layout/spacing/type-size stay
 * classes. No Tailwind arbitrary var() color classes; no nested interactive
 * controls; no JSX generics.
 * ========================================================================= */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowsOutCardinal,
  Check,
  NotePencil,
  PencilSimple,
  Trash,
  X,
} from "@phosphor-icons/react";
import { usePrototypeCollab } from "@/lib/prototypeCollabContext";
import {
  CHANGE_TYPES,
  DS_GUIDANCE_OPTIONS,
  DEFAULT_DS_GUIDANCE,
  APPLY_SCOPES,
  DEFAULT_APPLY_SCOPE,
  ANNOTATION_STATUSES,
  scopeLabel,
  type ChangeType,
  type DsGuidance,
  type ApplyScope,
  type AnnotationStatus,
  type AnnotationRegion,
  type DesignAnnotation,
  type SelectedElement,
  type SelectionKind,
} from "@/lib/annotationStore";
import { deriveRegionLabel, type RegionPxRect } from "@/lib/commentTarget";
import {
  elementAtPoint,
  elementsInRegion,
  meaningfulChain,
  toPick,
  boundingPct,
  commonSectionLabel,
  type ElementPick,
  type CanvasMetrics,
  type PctRect,
} from "@/lib/elementSelect";
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
/* Tokens (shared subset — mirrors PrototypeCollabOverlay's C)         */
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
  brandFgOn: "var(--container-dynamic-brand-bold-foreground-default,#ffffff)",
  hoverBg: "var(--container-dynamic-neutral-subtle-background-hover,#71718014)",
  errorFg: "var(--container-dynamic-error-subtle-foreground-default,#da294b)",
  successFg: "var(--container-dynamic-success-subtle-foreground-default,#1e7d54)",
  successSubtleBg: "var(--container-dynamic-success-subtle-background-default,#e5f4ec)",
  warnFg: "var(--container-dynamic-warning-subtle-foreground-default,#8a5a00)",
  warnSubtleBg: "var(--container-dynamic-warning-subtle-background-default,#fdf3e2)",
  infoFg: "var(--container-dynamic-info-subtle-foreground-default,#1f5fbf)",
  infoSubtleBg: "var(--container-dynamic-info-subtle-background-default,#e8f0fc)",
};

const NEW_NAME = "__new__";

/** Two-digit annotation number (01, 02 …). */
function pad2(n: number): string {
  return n < 10 ? `0${n}` : String(n);
}

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

/* ------------------------------------------------------------------ */
/* Status badge                                                        */
/* ------------------------------------------------------------------ */

function statusColors(status: AnnotationStatus): { bg: string; fg: string } {
  switch (status) {
    case "Applied":
    case "Resolved":
      return { bg: C.successSubtleBg, fg: C.successFg };
    case "In progress":
      return { bg: C.infoSubtleBg, fg: C.infoFg };
    case "Needs review":
      return { bg: C.warnSubtleBg, fg: C.warnFg };
    case "Open":
    default:
      return { bg: C.brandSubtle, fg: C.brandFg };
  }
}

function StatusBadge({ status }: { status: AnnotationStatus }) {
  const { bg, fg } = statusColors(status);
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ backgroundColor: bg, color: fg }}
    >
      {status}
    </span>
  );
}

/* ------------------------------------------------------------------ */
/* Element chips (structured selected-element references, §12/§13)     */
/* ------------------------------------------------------------------ */

/** Read-only chips listing selected element labels. */
function ElementChips({ elements }: { elements: SelectedElement[] }) {
  if (elements.length === 0) return null;
  return (
    <div className="flex flex-wrap gap-1.5">
      {elements.map((el, i) => (
        <span
          key={`${el.label}-${i}`}
          className="inline-flex items-center rounded-full border border-solid px-2 py-0.5 text-[11px] font-medium"
          style={{
            borderColor: C.brandFg,
            color: C.brandFg,
            backgroundColor: C.brandSubtle,
          }}
          title={el.path.length > 0 ? el.path.join(" › ") : el.label}
        >
          {el.label}
        </span>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Name field (author picker — mirrors the comment composer)           */
/* ------------------------------------------------------------------ */

function NameField({
  id,
  authors,
  choice,
  onChoiceChange,
  newName,
  onNewNameChange,
}: {
  id: string;
  authors: string[];
  choice: string;
  onChoiceChange: (v: string) => void;
  newName: string;
  onNewNameChange: (v: string) => void;
}) {
  const usingNew = choice === NEW_NAME;
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={id} style={{ color: C.textBody }}>
        Author
      </Label>
      <Select value={choice} onValueChange={onChoiceChange}>
        <SelectTrigger id={id} aria-label="Annotation author">
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
          aria-label="New author name"
          placeholder="Enter your name"
          value={newName}
          onChange={(e) => onNewNameChange(e.target.value)}
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Small building blocks: pill toggles + radio group                   */
/* ------------------------------------------------------------------ */

/** Multi-select chip toggles (change types). */
function TypeToggles({
  value,
  onToggle,
}: {
  value: ChangeType[];
  onToggle: (t: ChangeType) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5" role="group" aria-label="Change type">
      {CHANGE_TYPES.map((t) => {
        const active = value.includes(t);
        return (
          <button
            key={t}
            type="button"
            aria-pressed={active}
            onClick={() => onToggle(t)}
            className="rounded-full border border-solid px-2.5 py-1 text-[12px] font-medium transition-colors"
            style={{
              backgroundColor: active ? C.brandFg : C.surface,
              borderColor: active ? C.brandFg : C.border,
              color: active ? C.brandFgOn : C.textBody,
            }}
          >
            {t}
          </button>
        );
      })}
    </div>
  );
}

/** A radio-style single-select list (apply scope). */
function ScopeRadios({
  value,
  onChange,
  kind,
}: {
  value: ApplyScope;
  onChange: (s: ApplyScope) => void;
  kind: SelectionKind;
}) {
  return (
    <div className="flex flex-col gap-1" role="radiogroup" aria-label="Apply change to">
      {APPLY_SCOPES.map((s) => {
        const active = value === s;
        return (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => onChange(s)}
            className="flex items-center gap-2 rounded-[var(--radius-100,8px)] border border-solid px-[var(--spacing-150,12px)] py-[var(--spacing-100,8px)] text-left text-[12px] font-medium transition-colors"
            style={{
              backgroundColor: active ? C.brandSubtle : C.surface,
              borderColor: active ? C.brandFg : C.border,
              color: active ? C.brandFg : C.textBody,
            }}
          >
            <span
              className="flex size-[14px] shrink-0 items-center justify-center rounded-full border-2"
              style={{ borderColor: active ? C.brandFg : C.border }}
              aria-hidden
            >
              {active && (
                <span
                  className="size-[6px] rounded-full"
                  style={{ backgroundColor: C.brandFg }}
                />
              )}
            </span>
            {scopeLabel(s, kind)}
          </button>
        );
      })}
    </div>
  );
}

/** Short human note describing the impact of a broader scope (spec §10). */
function scopeImpactNote(scope: ApplyScope): string | null {
  switch (scope) {
    case "Similar elements in this section":
      return "Applies to similar elements within this section — not just the selected region.";
    case "All matching elements on this page":
      return "Applies to every matching element on this page. Review before submitting.";
    case "All matching elements across the prototype":
      return "Applies across the whole prototype. This is a broad change — use with care.";
    case "Selected region only":
    default:
      return null;
  }
}

/* ------------------------------------------------------------------ */
/* Editor draft (region + form state)                                  */
/* ------------------------------------------------------------------ */

/** A pending selection being authored (percent coords of the canvas). */
export interface AnnotationDraft {
  selectionKind: SelectionKind;
  region: AnnotationRegion | null; // null = page-level
  elements: SelectedElement[];
  sectionLabel: string;
}

interface EditorValues {
  what: string;
  why: string;
  types: ChangeType[];
  dsGuidance: DsGuidance;
  scope: ApplyScope;
}

const EMPTY_EDITOR: EditorValues = {
  what: "",
  why: "",
  types: [],
  dsGuidance: DEFAULT_DS_GUIDANCE,
  scope: DEFAULT_APPLY_SCOPE,
};

/* ------------------------------------------------------------------ */
/* Annotation editor (form + summary step)                             */
/* ------------------------------------------------------------------ */

function AnnotationEditor({
  title,
  authors,
  areaLabel,
  sectionLabel,
  elements,
  selectionKind,
  seqLabel,
  initial,
  initialAuthor,
  submitLabel,
  showCommentInstead,
  onCommentInstead,
  onSubmit,
  onCancel,
}: {
  title: string;
  authors: string[];
  areaLabel: string;
  sectionLabel: string;
  elements: SelectedElement[];
  selectionKind: SelectionKind;
  seqLabel: string;
  initial: EditorValues;
  initialAuthor?: string;
  submitLabel: string;
  showCommentInstead: boolean;
  onCommentInstead?: () => void;
  /** Returns true if saved; false on failure (keeps the form open). */
  onSubmit: (values: EditorValues, author: string) => boolean;
  onCancel: () => void;
}) {
  // Prefer the annotation's existing author (edit mode). It is always offered
  // in the Select because the author list is the combined collaborator set.
  const [choice, setChoice] = useState<string>(() => {
    if (initialAuthor && authors.includes(initialAuthor)) return initialAuthor;
    if (initialAuthor) return NEW_NAME;
    return authors.length > 0 ? authors[0] : NEW_NAME;
  });
  const [newName, setNewName] = useState<string>(
    initialAuthor && !authors.includes(initialAuthor) ? initialAuthor : "",
  );
  const [values, setValues] = useState<EditorValues>(initial);
  const [step, setStep] = useState<"form" | "summary">("form");
  const [error, setError] = useState<string | null>(null);
  const whatRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => whatRef.current?.focus(), 0);
    return () => window.clearTimeout(t);
  }, []);

  const resolvedName = choice === NEW_NAME ? newName.trim() : choice.trim();

  function toReview() {
    if (values.what.trim().length === 0) {
      setError("Describe what needs to change.");
      whatRef.current?.focus();
      return;
    }
    if (resolvedName.length === 0) {
      setError("Please enter an author name.");
      return;
    }
    setError(null);
    setStep("summary");
  }

  function submit() {
    const ok = onSubmit(
      { ...values, what: values.what.trim(), why: values.why.trim() },
      resolvedName,
    );
    if (!ok) setError("Couldn't save the annotation. Try again.");
  }

  const impact = scopeImpactNote(values.scope);

  return (
    <div className="flex flex-col gap-[var(--spacing-200,16px)]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <h3
            className="text-[length:var(--body-md-medium-size,14px)] font-semibold"
            style={{ color: C.textPrimary }}
          >
            {title}
          </h3>
          <span className="text-[11px] font-medium" style={{ color: C.textMuted }}>
            {seqLabel}
          </span>
        </div>
        <button
          type="button"
          aria-label="Cancel"
          onClick={onCancel}
          className="flex size-[24px] items-center justify-center rounded-[var(--radius-50,4px)]"
          style={{ color: C.textMuted }}
        >
          <X size={16} />
        </button>
      </div>

      {step === "form" ? (
        <>
          {/* Selected summary — section + element chips (spec §11/§12). */}
          <div
            className="flex flex-col gap-1.5 rounded-[var(--radius-100,8px)] border border-solid px-[var(--spacing-150,12px)] py-[var(--spacing-100,8px)]"
            style={{ borderColor: C.border, backgroundColor: C.surface2 }}
          >
            <p className="text-[11px] font-medium" style={{ color: C.textMuted }}>
              Selected
            </p>
            <p className="text-[12px] font-medium" style={{ color: C.textPrimary }}>
              {sectionLabel || areaLabel}
            </p>
            {elements.length > 0 && (
              <>
                <p className="text-[11px] font-medium" style={{ color: C.textMuted }}>
                  {elements.length === 1 ? "Element" : `Contains ${elements.length} elements`}
                </p>
                <ElementChips elements={elements} />
              </>
            )}
          </div>

          {/* What needs to change? (required) */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="anno-what" style={{ color: C.textBody }}>
              What needs to change?
            </Label>
            <Textarea
              id="anno-what"
              ref={whatRef}
              rows={4}
              placeholder="Describe the design change you want..."
              value={values.what}
              onChange={(e) => {
                setValues((v) => ({ ...v, what: e.target.value }));
                setError(null);
              }}
            />
          </div>

          {/* Change type (optional, multi-select) */}
          <div className="flex flex-col gap-1.5">
            <Label style={{ color: C.textBody }}>Change type (optional)</Label>
            <TypeToggles
              value={values.types}
              onToggle={(t) =>
                setValues((v) => ({
                  ...v,
                  types: v.types.includes(t)
                    ? v.types.filter((x) => x !== t)
                    : [...v.types, t],
                }))
              }
            />
          </div>

          {/* Design system guidance (optional) */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="anno-ds" style={{ color: C.textBody }}>
              Design system guidance
            </Label>
            <Select
              value={values.dsGuidance}
              onValueChange={(v) =>
                setValues((prev) => ({ ...prev, dsGuidance: v as DsGuidance }))
              }
            >
              <SelectTrigger id="anno-ds" aria-label="Design system guidance">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {DS_GUIDANCE_OPTIONS.map((o) => (
                  <SelectItem key={o} value={o}>
                    {o}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Why should this change? (optional) */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="anno-why" style={{ color: C.textBody }}>
              Why should this change? (optional)
            </Label>
            <Textarea
              id="anno-why"
              rows={3}
              placeholder="Explain the user or business need behind this change..."
              value={values.why}
              onChange={(e) => setValues((v) => ({ ...v, why: e.target.value }))}
            />
          </div>

          {/* Apply scope (radio) */}
          <div className="flex flex-col gap-1.5">
            <Label style={{ color: C.textBody }}>Apply change to</Label>
            <ScopeRadios
              value={values.scope}
              onChange={(s) => setValues((v) => ({ ...v, scope: s }))}
              kind={selectionKind}
            />
            {impact && (
              <p
                className="rounded-[var(--radius-100,8px)] px-[var(--spacing-150,12px)] py-[var(--spacing-100,8px)] text-[11px] font-medium"
                style={{ backgroundColor: C.warnSubtleBg, color: C.warnFg }}
                role="note"
              >
                {impact}
              </p>
            )}
          </div>

          <NameField
            id="anno-author"
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

          {error && (
            <p role="alert" className="text-[12px]" style={{ color: C.errorFg }}>
              {error}
            </p>
          )}

          <div className="flex items-center justify-between gap-2">
            {showCommentInstead ? (
              <button
                type="button"
                onClick={onCommentInstead}
                className="text-[11px] font-medium underline underline-offset-2"
                style={{ color: C.textMuted }}
              >
                Comment instead
              </button>
            ) : (
              <span />
            )}
            <div className="flex items-center gap-2">
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
                onClick={toReview}
                className="rounded-[var(--radius-100,8px)] px-[var(--spacing-150,12px)] py-[var(--spacing-100,8px)] text-[length:var(--body-sm-medium-size,12px)] font-medium"
                style={{ backgroundColor: C.brandBg, color: C.brandFgOn }}
              >
                Review
              </button>
            </div>
          </div>
        </>
      ) : (
        /* Summary step (spec §11) */
        <div className="flex flex-col gap-[var(--spacing-150,12px)]">
          <div
            className="flex flex-col gap-[var(--spacing-150,12px)] rounded-[var(--radius-100,8px)] border border-solid p-[var(--spacing-200,16px)]"
            style={{ borderColor: C.border, backgroundColor: C.surface2 }}
          >
            <SummaryRow label="Selected" value={sectionLabel || areaLabel} />
            {elements.length > 0 && (
              <div className="flex flex-col gap-1">
                <span
                  className="text-[11px] font-medium uppercase tracking-wide"
                  style={{ color: C.textMuted }}
                >
                  Contains
                </span>
                <ElementChips elements={elements} />
              </div>
            )}
            <SummaryRow label="Change" value={values.what.trim()} />
            {values.why.trim() && <SummaryRow label="Reason" value={values.why.trim()} />}
            <SummaryRow label="Design system" value={values.dsGuidance} />
            {values.types.length > 0 && (
              <SummaryRow label="Type" value={values.types.join(", ")} />
            )}
            <SummaryRow label="Scope" value={scopeLabel(values.scope, selectionKind)} />
            <SummaryRow label="Author" value={resolvedName} />
          </div>
          {error && (
            <p role="alert" className="text-[12px]" style={{ color: C.errorFg }}>
              {error}
            </p>
          )}
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setStep("form")}
              className="rounded-[var(--radius-100,8px)] border border-solid px-[var(--spacing-150,12px)] py-[var(--spacing-100,8px)] text-[length:var(--body-sm-medium-size,12px)] font-medium"
              style={{ borderColor: C.border, color: C.textBody, backgroundColor: C.surface }}
            >
              Back
            </button>
            <button
              type="button"
              onClick={submit}
              className="rounded-[var(--radius-100,8px)] px-[var(--spacing-150,12px)] py-[var(--spacing-100,8px)] text-[length:var(--body-sm-medium-size,12px)] font-medium"
              style={{ backgroundColor: C.brandBg, color: C.brandFgOn }}
            >
              {submitLabel}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-medium uppercase tracking-wide" style={{ color: C.textMuted }}>
        {label}
      </span>
      <span className="whitespace-pre-wrap break-words text-[12px]" style={{ color: C.textPrimary }}>
        {value}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Details view                                                        */
/* ------------------------------------------------------------------ */

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[11px] font-medium uppercase tracking-wide" style={{ color: C.textMuted }}>
        {label}
      </span>
      <span className="whitespace-pre-wrap break-words text-[12px]" style={{ color: C.textPrimary }}>
        {value}
      </span>
    </div>
  );
}

function AnnotationDetails({
  annotation,
  onEdit,
  onStatusChange,
  onToggleMove,
  moveActive,
  onDelete,
  onClose,
  showMove,
}: {
  annotation: DesignAnnotation;
  onEdit: () => void;
  onStatusChange: (s: AnnotationStatus) => void;
  onToggleMove: () => void;
  moveActive: boolean;
  onDelete: () => void;
  onClose: () => void;
  showMove: boolean;
}) {
  const a = annotation;
  const resolved = a.status === "Resolved";
  return (
    <div className="flex flex-col gap-[var(--spacing-150,12px)]">
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5">
          <h3
            className="text-[length:var(--body-md-medium-size,14px)] font-semibold"
            style={{ color: C.textPrimary }}
          >
            Design annotation #{pad2(a.seq)}
          </h3>
          <span className="text-[11px]" style={{ color: C.textMuted }}>
            {a.author} · {a.versionName} · {fmtDate(a.createdAt)} · {fmtTime(a.createdAt)}
          </span>
        </div>
        <button
          type="button"
          aria-label="Close details"
          onClick={onClose}
          className="flex size-[24px] items-center justify-center rounded-[var(--radius-50,4px)]"
          style={{ color: C.textMuted }}
        >
          <X size={16} />
        </button>
      </div>

      {/* Status editor */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-medium uppercase tracking-wide" style={{ color: C.textMuted }}>
          Status
        </span>
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Annotation status">
          {ANNOTATION_STATUSES.map((s) => {
            const active = a.status === s;
            const { bg, fg } = statusColors(s);
            return (
              <button
                key={s}
                type="button"
                aria-pressed={active}
                onClick={() => onStatusChange(s)}
                className="rounded-full border border-solid px-2.5 py-1 text-[11px] font-medium transition-colors"
                style={{
                  backgroundColor: active ? bg : C.surface,
                  borderColor: active ? fg : C.border,
                  color: active ? fg : C.textBody,
                }}
              >
                {s}
              </button>
            );
          })}
        </div>
      </div>

      <DetailField
        label="Selected"
        value={a.sectionLabel || (a.region ? a.region.label : "Entire page")}
      />
      {a.elements.length > 0 && (
        <div className="flex flex-col gap-1">
          <span
            className="text-[11px] font-medium uppercase tracking-wide"
            style={{ color: C.textMuted }}
          >
            Selected elements
          </span>
          <ElementChips elements={a.elements} />
        </div>
      )}
      <DetailField label="What needs to change" value={a.what} />
      {a.why && <DetailField label="Why" value={a.why} />}
      {a.types.length > 0 && <DetailField label="Change type" value={a.types.join(", ")} />}
      <DetailField label="Design system guidance" value={a.dsGuidance} />
      <DetailField label="Scope" value={scopeLabel(a.scope, a.selectionKind)} />

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <ActionButton icon={<PencilSimple size={14} />} label="Edit" onClick={onEdit} />
        {showMove && a.region && (
          <ActionButton
            icon={<ArrowsOutCardinal size={14} />}
            label={moveActive ? "Done moving" : "Move / Resize"}
            active={moveActive}
            onClick={onToggleMove}
          />
        )}
        <ActionButton
          icon={<Check size={14} />}
          label={resolved ? "Reopen" : "Resolve"}
          onClick={() => onStatusChange(resolved ? "Open" : "Resolved")}
        />
        <ActionButton
          icon={<Trash size={14} />}
          label="Delete"
          danger
          onClick={onDelete}
        />
      </div>
    </div>
  );
}

function ActionButton({
  icon,
  label,
  onClick,
  danger,
  active,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
  active?: boolean;
}) {
  const [hover, setHover] = useState(false);
  const fg = danger ? C.errorFg : active ? C.brandFg : C.textBody;
  return (
    <button
      type="button"
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex items-center gap-1.5 rounded-[var(--radius-100,8px)] border border-solid px-[var(--spacing-150,12px)] py-[var(--spacing-100,8px)] text-[12px] font-medium transition-colors"
      style={{
        borderColor: active ? C.brandFg : C.border,
        color: fg,
        backgroundColor: active ? C.brandSubtle : hover ? C.hoverBg : C.surface,
      }}
    >
      {icon}
      {label}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Anchored popover (editor / details, positioned near the region)     */
/* ------------------------------------------------------------------ */

function AnchoredPopover({
  anchorXPct,
  anchorYPct,
  children,
}: {
  anchorXPct: number;
  anchorYPct: number;
  children: React.ReactNode;
}) {
  const flipRight = anchorXPct > 55;
  const flipUp = anchorYPct > 55;
  return (
    <div
      role="dialog"
      aria-label="Design annotation"
      onMouseDown={(e) => e.stopPropagation()}
      onClick={(e) => e.stopPropagation()}
      className="pointer-events-auto absolute z-[8] max-h-[70vh] w-[320px] overflow-auto rounded-[var(--radius-100,8px)] border border-solid p-[var(--spacing-200,16px)] shadow-lg"
      style={{
        left: `${anchorXPct}%`,
        top: `${anchorYPct}%`,
        transform: `translate(${flipRight ? "-100%" : "0"}, ${
          flipUp ? "-100%" : "0"
        }) translate(${flipRight ? "-12px" : "12px"}, ${flipUp ? "-12px" : "12px"})`,
        backgroundColor: C.surface,
        borderColor: C.border,
      }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Region overlay + numbered marker                                    */
/* ------------------------------------------------------------------ */

/** Type of an in-progress move/resize gesture on an existing region. */
type DragKind = "move" | "resize" | null;

function RegionShape({
  annotation,
  moveActive,
  pulsing,
  onMarkerClick,
  onGestureStart,
}: {
  annotation: DesignAnnotation;
  moveActive: boolean;
  pulsing: boolean;
  onMarkerClick: () => void;
  onGestureStart: (kind: Exclude<DragKind, null>, e: React.MouseEvent) => void;
}) {
  const r = annotation.region;
  if (!r) return null;
  const resolved = annotation.status === "Resolved" || annotation.status === "Applied";
  const borderCol = resolved ? C.textMuted : C.brandFg;
  return (
    <div
      data-annotation-region={annotation.id}
      className={`absolute ${pulsing ? "animate-pulse" : ""}`}
      style={{
        left: `${r.xPct}%`,
        top: `${r.yPct}%`,
        width: `${r.wPct}%`,
        height: `${r.hPct}%`,
      }}
    >
      {/* Region tint + border. Subtle so it never obscures the design. */}
      <div
        className={`absolute inset-0 rounded-[var(--radius-100,8px)] border-2 ${
          moveActive ? "cursor-move" : ""
        }`}
        style={{
          borderColor: borderCol,
          backgroundColor: resolved
            ? "var(--container-dynamic-neutral-subtle-background-default-variation,#71718014)"
            : "var(--container-dynamic-brand-subtle-background-default,#f6ebff)",
          opacity: 0.28,
          pointerEvents: moveActive ? "auto" : "none",
        }}
        onMouseDown={(e) => {
          if (moveActive) onGestureStart("move", e);
        }}
        aria-hidden
      />

      {/* Resize handle (bottom-right) — only while moving/resizing. */}
      {moveActive && (
        <button
          type="button"
          aria-label="Resize region"
          onMouseDown={(e) => {
            e.stopPropagation();
            onGestureStart("resize", e);
          }}
          className="absolute z-[2] flex size-[16px] cursor-nwse-resize items-center justify-center rounded-full border-2"
          style={{
            right: "-8px",
            bottom: "-8px",
            backgroundColor: C.surface,
            borderColor: C.brandFg,
          }}
        />
      )}

      {/* Numbered marker at the region's top-right, outside the edge. */}
      <button
        type="button"
        aria-label={`Open design annotation ${pad2(annotation.seq)}`}
        onClick={(e) => {
          e.stopPropagation();
          onMarkerClick();
        }}
        className="pointer-events-auto absolute flex h-[22px] min-w-[26px] items-center justify-center rounded-full border-2 px-1 text-[11px] font-semibold shadow-md outline-none"
        style={{
          top: "-11px",
          right: "-8px",
          backgroundColor: resolved ? C.surface2 : C.brandBg,
          borderColor: resolved ? C.textMuted : C.brandFgOn,
          color: resolved ? C.textMuted : C.brandFgOn,
        }}
      >
        {pad2(annotation.seq)}
      </button>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* The layer                                                           */
/* ------------------------------------------------------------------ */

/** Percent-space rect while drawing a fresh selection. */
interface DrawRect {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

function normalizeDraw(d: DrawRect): { xPct: number; yPct: number; wPct: number; hPct: number } {
  const x = Math.min(d.x0, d.x1);
  const y = Math.min(d.y0, d.y1);
  return {
    xPct: x,
    yPct: y,
    wPct: Math.abs(d.x1 - d.x0),
    hPct: Math.abs(d.y1 - d.y0),
  };
}

/** Minimum drag size (percent of canvas) to count as a region. */
const MIN_REGION_PCT = 2;

/** Convert a live element pick into the persisted SelectedElement shape. */
function pickToElement(p: ElementPick): SelectedElement {
  return {
    label: p.label,
    path: p.path,
    rectPct: p.rectPct,
    ...(p.annotateKey ? { annotateKey: p.annotateKey } : {}),
  };
}

export function DesignAnnotationLayer(): JSX.Element | null {
  const collab = usePrototypeCollab();
  const wrapRef = useRef<HTMLDivElement>(null);

  // Fresh-draw gesture state (percent coords).
  const [drawing, setDrawing] = useState<DrawRect | null>(null);
  // The editor draft (region | page-level) awaiting authoring.
  const [draft, setDraft] = useState<AnnotationDraft | null>(null);
  // Open annotation id (details), and whether it's in edit / move mode.
  const [openId, setOpenId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [movingId, setMovingId] = useState<string | null>(null);
  const [pulseId, setPulseId] = useState<string | null>(null);

  // Live move/resize gesture (updates stored pcts on release).
  const gestureRef = useRef<{
    id: string;
    kind: Exclude<DragKind, null>;
    startX: number;
    startY: number;
    orig: AnnotationRegion;
  } | null>(null);
  const [gestureRegion, setGestureRegion] = useState<AnnotationRegion | null>(null);
  // Mirror of the live gesture geometry so the mouseup handler can persist it
  // without reading it from inside a setState updater (which runs in render).
  const liveRegionRef = useRef<AnnotationRegion | null>(null);

  // Element-selection state (PRIMARY workflow).
  //   hoverRect/hoverLabel/hoverPath — the boundary under the cursor.
  //   picks — the committed multi-selection awaiting [Annotate].
  const [hoverRect, setHoverRect] = useState<PctRect | null>(null);
  const [hoverLabel, setHoverLabel] = useState<string>("");
  const [hoverPath, setHoverPath] = useState<string[]>([]);
  const [picks, setPicks] = useState<ElementPick[]>([]);
  // A dragged region awaiting [Annotate] (smart region, spec §9/§20).
  const [pendingRegion, setPendingRegion] = useState<{
    region: AnnotationRegion;
    elements: SelectedElement[];
    sectionLabel: string;
  } | null>(null);
  const hoverElRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);

  const annotationMode = collab?.annotationMode ?? false;
  const selectMode = collab?.selectMode ?? "elements";

  // Leaving annotation mode clears any in-progress draw/draft/hover/selection.
  useEffect(() => {
    if (!annotationMode) {
      setDrawing(null);
      setDraft(null);
      setHoverRect(null);
      setHoverLabel("");
      setHoverPath([]);
      setPicks([]);
      setPendingRegion(null);
      hoverElRef.current = null;
    }
  }, [annotationMode]);

  // Switching tool clears the current hover + region draw + any pending
  // selection so the two tools don't leak into each other.
  useEffect(() => {
    setHoverRect(null);
    setHoverLabel("");
    setHoverPath([]);
    setDrawing(null);
    setPicks([]);
    setPendingRegion(null);
  }, [selectMode]);

  // Measure the canvas box (the layer's parent) in px, incl. scroll extent.
  const measure = useCallback(() => {
    const host = wrapRef.current?.parentElement;
    if (!host) return null;
    const rect = host.getBoundingClientRect();
    const width = host.scrollWidth || rect.width;
    const height = host.scrollHeight || rect.height;
    if (width <= 0 || height <= 0) return null;
    return { host, rect, width, height };
  }, []);

  const toPct = useCallback(
    (clientX: number, clientY: number) => {
      const m = measure();
      if (!m) return null;
      const xPx = clientX - m.rect.left + m.host.scrollLeft;
      const yPx = clientY - m.rect.top + m.host.scrollTop;
      return {
        xPct: Math.min(100, Math.max(0, (xPx / m.width) * 100)),
        yPct: Math.min(100, Math.max(0, (yPx / m.height) * 100)),
      };
    },
    [measure],
  );

  // While drawing a region, suppress text selection on the whole document so a
  // fast drag can't select page content underneath the overlay.
  useEffect(() => {
    if (!drawing) return;
    const prev = document.body.style.userSelect;
    document.body.style.userSelect = "none";
    return () => {
      document.body.style.userSelect = prev;
    };
  }, [drawing !== null]); // eslint-disable-line react-hooks/exhaustive-deps

  /* ---- element hover + click (PRIMARY, spec §3/§4/§18) ---- */
  // Capture-phase listeners on the canvas host: hover shows a boundary; click
  // selects (single) or toggles (⌘/Ctrl/Shift) WITHOUT triggering the
  // underlying control. Only active in element mode with no draft/editor open.
  const elementModeActive =
    annotationMode && selectMode === "elements" && !draft && !editingId;

  const resolveHover = useCallback(
    (clientX: number, clientY: number) => {
      const m = measure();
      if (!m) return;
      const el = elementAtPoint(clientX, clientY, m.host);
      if (!el || el === m.host) {
        hoverElRef.current = null;
        setHoverRect(null);
        setHoverLabel("");
        setHoverPath([]);
        return;
      }
      if (el === hoverElRef.current) return; // unchanged — skip work
      hoverElRef.current = el;
      const pick = toPick(el, m.host, m as CanvasMetrics);
      if (!pick) {
        setHoverRect(null);
        setHoverLabel("");
        setHoverPath([]);
        return;
      }
      setHoverRect(pick.rectPct);
      setHoverLabel(pick.label);
      setHoverPath(pick.path);
    },
    [measure],
  );

  useEffect(() => {
    if (!elementModeActive) return;
    const m = measure();
    const host = m?.host;
    if (!host) return;

    const onMoveCapture = (ev: MouseEvent) => {
      if (rafRef.current !== null) return;
      const x = ev.clientX;
      const y = ev.clientY;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        resolveHover(x, y);
      });
    };
    // Capture-phase: intercept BEFORE the underlying control (spec §18).
    const onClickCapture = (ev: MouseEvent) => {
      const target = ev.target as Element | null;
      if (target && target.closest("[data-annotation-ui]")) return; // our chrome
      ev.preventDefault();
      ev.stopPropagation();
      const el = elementAtPoint(ev.clientX, ev.clientY, host);
      if (!el || el === host) return;
      const pick = toPick(el, host, m as CanvasMetrics);
      if (!pick) return;
      const additive = ev.metaKey || ev.ctrlKey || ev.shiftKey;
      setPendingRegion(null);
      setOpenId(null);
      setPicks((cur) => {
        const idx = cur.findIndex((p) => p.el === pick.el);
        if (additive) {
          return idx >= 0 ? cur.filter((_, i) => i !== idx) : [...cur, pick];
        }
        // Plain click: single selection (replaces).
        return idx >= 0 && cur.length === 1 ? [] : [pick];
      });
    };
    // Swallow mouse/pointer events so controls never react (spec §18).
    const swallow = (ev: Event) => {
      const target = ev.target as Element | null;
      if (target && target.closest("[data-annotation-ui]")) return;
      ev.preventDefault();
      ev.stopPropagation();
    };

    host.addEventListener("mousemove", onMoveCapture, true);
    host.addEventListener("click", onClickCapture, true);
    host.addEventListener("mousedown", swallow, true);
    host.addEventListener("mouseup", swallow, true);
    host.addEventListener("dblclick", swallow, true);
    // Radix / pointer-based controls open on pointerdown — swallow those too so
    // no dropdown/menu opens while selecting (spec §18).
    host.addEventListener("pointerdown", swallow, true);
    host.addEventListener("pointerup", swallow, true);
    return () => {
      host.removeEventListener("mousemove", onMoveCapture, true);
      host.removeEventListener("click", onClickCapture, true);
      host.removeEventListener("mousedown", swallow, true);
      host.removeEventListener("mouseup", swallow, true);
      host.removeEventListener("dblclick", swallow, true);
      host.removeEventListener("pointerdown", swallow, true);
      host.removeEventListener("pointerup", swallow, true);
      if (rafRef.current !== null) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [elementModeActive, measure, resolveHover]);

  /* ---- re-target selection up the hierarchy (breadcrumb, §5) ---- */
  // `depthFromRoot` indexes the crumb path (root→element). Re-select the
  // ancestor at that meaningful level. Anchor off the currently-selected single
  // pick (preferred, survives after the click) or the live hover element.
  function selectCrumb(depthFromRoot: number) {
    const el = picks.length === 1 ? picks[0].el : hoverElRef.current;
    const m = measure();
    if (!el || !m) return;
    // meaningfulChain is element→root; reverse it to root→element to match path.
    const chain = meaningfulChain(el, m.host).reverse();
    const node = chain[depthFromRoot] ?? el;
    const pick = toPick(node, m.host, m as CanvasMetrics);
    if (!pick) return;
    setPicks([pick]);
    hoverElRef.current = node;
    setHoverRect(pick.rectPct);
    setHoverLabel(pick.label);
    setHoverPath(pick.path);
  }

  /* ---- fresh draw handlers (capture overlay) ---- */
  function onCaptureDown(e: React.MouseEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    // Suppress the browser's native text selection so the drag becomes a clean
    // rubber-band rectangle (defect: dragging selected page text instead).
    e.preventDefault();
    const p = toPct(e.clientX, e.clientY);
    if (!p) return;
    setOpenId(null);
    setPicks([]);
    setPendingRegion(null);
    setDrawing({ x0: p.xPct, y0: p.yPct, x1: p.xPct, y1: p.yPct });
  }
  function onCaptureMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!drawing) return;
    const p = toPct(e.clientX, e.clientY);
    if (!p) return;
    setDrawing((d) => (d ? { ...d, x1: p.xPct, y1: p.yPct } : d));
  }
  function onCaptureUp() {
    if (!drawing) return;
    const norm = normalizeDraw(drawing);
    setDrawing(null);
    if (norm.wPct < MIN_REGION_PCT || norm.hPct < MIN_REGION_PCT) {
      // Too small to be a region — ignore (treat as a mis-click).
      return;
    }
    // Derive the area label + detect the meaningful elements inside (smart
    // region, spec §9). Show the selection pill; the user presses Annotate.
    const m = measure();
    let label = "Selected region";
    let elements: SelectedElement[] = [];
    let sectionLabel = "";
    if (m) {
      const rectPx: RegionPxRect = {
        x: (norm.xPct / 100) * m.width,
        y: (norm.yPct / 100) * m.height,
        w: (norm.wPct / 100) * m.width,
        h: (norm.hPct / 100) * m.height,
      };
      label = deriveRegionLabel(m.host, rectPx);
      const found = elementsInRegion(m.host, rectPx, m as CanvasMetrics);
      elements = found.map(pickToElement);
      sectionLabel = commonSectionLabel(found);
    }
    setPicks([]);
    setPendingRegion({
      region: { ...norm, label },
      elements,
      sectionLabel,
    });
  }

  /* ---- move / resize an existing region ---- */
  const beginGesture = useCallback(
    (id: string, region: AnnotationRegion, kind: Exclude<DragKind, null>, e: React.MouseEvent) => {
      e.preventDefault();
      const p = toPct(e.clientX, e.clientY);
      if (!p) return;
      gestureRef.current = { id, kind, startX: p.xPct, startY: p.yPct, orig: region };
      liveRegionRef.current = region;
      setGestureRegion(region);
    },
    [toPct],
  );

  useEffect(() => {
    if (!gestureRef.current) return;
    function onMove(ev: MouseEvent) {
      const g = gestureRef.current;
      if (!g) return;
      const m = measureRef.current();
      if (!m) return;
      const xPct = Math.min(100, Math.max(0, ((ev.clientX - m.rect.left + m.host.scrollLeft) / m.width) * 100));
      const yPct = Math.min(100, Math.max(0, ((ev.clientY - m.rect.top + m.host.scrollTop) / m.height) * 100));
      const dx = xPct - g.startX;
      const dy = yPct - g.startY;
      let next: AnnotationRegion;
      if (g.kind === "move") {
        const nx = Math.min(100 - g.orig.wPct, Math.max(0, g.orig.xPct + dx));
        const ny = Math.min(100 - g.orig.hPct, Math.max(0, g.orig.yPct + dy));
        next = { ...g.orig, xPct: nx, yPct: ny };
      } else {
        const nw = Math.min(100 - g.orig.xPct, Math.max(MIN_REGION_PCT, g.orig.wPct + dx));
        const nh = Math.min(100 - g.orig.yPct, Math.max(MIN_REGION_PCT, g.orig.hPct + dy));
        next = { ...g.orig, wPct: nw, hPct: nh };
      }
      liveRegionRef.current = next;
      setGestureRegion(next);
    }
    function onUp() {
      const g = gestureRef.current;
      if (!g) return;
      gestureRef.current = null;
      // Persist the final geometry from the ref (NOT from inside a setState
      // updater — that runs during render and would update the parent context
      // mid-render). This runs in a real event handler, which is safe.
      const cur = liveRegionRef.current;
      liveRegionRef.current = null;
      setGestureRegion(null);
      if (cur && collab) {
        // Re-derive the area label from the new geometry.
        const m = measureRef.current();
        let label = cur.label;
        if (m) {
          const rectPx: RegionPxRect = {
            x: (cur.xPct / 100) * m.width,
            y: (cur.yPct / 100) * m.height,
            w: (cur.wPct / 100) * m.width,
            h: (cur.hPct / 100) * m.height,
          };
          label = deriveRegionLabel(m.host, rectPx);
        }
        collab.updateAnnotation(g.id, { region: { ...cur, label } });
      }
    }
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    // Re-subscribe whenever a gesture begins (gestureRegion transitions null→set).
  }, [gestureRegion === null, collab]); // eslint-disable-line react-hooks/exhaustive-deps

  // Keep a stable ref to measure() for the window listeners above.
  const measureRef = useRef(measure);
  measureRef.current = measure;

  // Open the page-level editor (no region) on request from the contextual
  // toolbar / panel.
  useEffect(() => {
    function onNewPage() {
      setOpenId(null);
      setEditingId(null);
      setDrawing(null);
      setPicks([]);
      setPendingRegion(null);
      setDraft({
        selectionKind: "page",
        region: null,
        elements: [],
        sectionLabel: "",
      });
    }
    window.addEventListener("fiber:new-page-annotation", onNewPage);
    return () => window.removeEventListener("fiber:new-page-annotation", onNewPage);
  }, []);

  // Focus/pulse a region when requested from the panel (custom event).
  useEffect(() => {
    function onFocusRegion(ev: Event) {
      const id = (ev as CustomEvent<string>).detail;
      if (typeof id !== "string") return;
      setOpenId(id);
      setEditingId(null);
      setMovingId(null);
      setPulseId(id);
      window.setTimeout(() => setPulseId((cur) => (cur === id ? null : cur)), 1200);
      // Scroll the region into view.
      const el = wrapRef.current?.querySelector(`[data-annotation-region="${id}"]`);
      if (el && "scrollIntoView" in el) {
        (el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
    window.addEventListener("fiber:focus-annotation", onFocusRegion as EventListener);
    return () =>
      window.removeEventListener("fiber:focus-annotation", onFocusRegion as EventListener);
  }, []);

  if (!collab) return null;

  const { annotations, authors, addAnnotation, updateAnnotation, deleteAnnotation } = collab;

  const openAnnotation = openId ? annotations.find((a) => a.id === openId) ?? null : null;
  const editingAnnotation = editingId ? annotations.find((a) => a.id === editingId) ?? null : null;

  // Page-level annotations render markers in a fixed rail.
  const pageLevel = annotations.filter((a) => !a.region);
  const regional = annotations.filter((a) => a.region);

  const drawNorm = drawing ? normalizeDraw(drawing) : null;

  function submitDraft(values: EditorValues, author: string): boolean {
    if (!draft) return false;
    const created = addAnnotation({
      author,
      selectionKind: draft.selectionKind,
      region: draft.region,
      elements: draft.elements,
      sectionLabel: draft.sectionLabel,
      what: values.what,
      why: values.why,
      types: values.types,
      dsGuidance: values.dsGuidance,
      scope: values.scope,
    });
    if (created) {
      setDraft(null);
      setPicks([]);
      setPendingRegion(null);
      setOpenId(created.id);
      return true;
    }
    return false;
  }

  // Build a draft from the current element selection and open the editor (§20:
  // the user presses Annotate — selection does not auto-open the editor).
  function annotatePicks() {
    if (picks.length === 0) return;
    const elements = picks.map(pickToElement);
    const bound = boundingPct(picks.map((p) => p.rectPct));
    const sectionLabel = commonSectionLabel(picks);
    const label =
      elements.length === 1
        ? elements[0].label
        : `${elements.length} elements${sectionLabel ? ` · ${sectionLabel}` : ""}`;
    const region: AnnotationRegion | null = bound
      ? { ...bound, label }
      : null;
    setDraft({
      selectionKind: "elements",
      region,
      elements,
      sectionLabel,
    });
  }

  // Build a draft from the pending region (smart region → Annotate, §9).
  function annotateRegion() {
    if (!pendingRegion) return;
    setDraft({
      selectionKind: "region",
      region: pendingRegion.region,
      elements: pendingRegion.elements,
      sectionLabel: pendingRegion.sectionLabel,
    });
  }

  function submitEdit(values: EditorValues, _author: string): boolean {
    if (!editingAnnotation) return false;
    updateAnnotation(editingAnnotation.id, {
      what: values.what,
      why: values.why,
      types: values.types,
      dsGuidance: values.dsGuidance,
      scope: values.scope,
    });
    setEditingId(null);
    return true;
  }

  // "Comment instead" (§15) — convert a selection into an anchored comment at
  // its center. Works for both the draft editor and the raw selection pill.
  function commentInsteadAt(region: AnnotationRegion | null, fallbackLabel: string) {
    if (!region) return;
    const cx = Math.min(100, Math.max(0, region.xPct + region.wPct / 2));
    const cy = Math.min(100, Math.max(0, region.yPct + region.hPct / 2));
    setDraft(null);
    setPicks([]);
    setPendingRegion(null);
    collab?.startCommentAt({ xPct: cx, yPct: cy, targetLabel: region.label || fallbackLabel });
  }

  function commentInstead() {
    if (!draft || !draft.region) return;
    commentInsteadAt(draft.region, draft.sectionLabel || "Selected region");
  }

  // Bounding rect (percent) of the current element selection, for the pill +
  // "comment instead" anchor.
  const picksBound = picks.length > 0 ? boundingPct(picks.map((p) => p.rectPct)) : null;

  // Breadcrumb path (root→element) shown in the pill when exactly one element
  // is selected. Prefer the selected pick's own path (persists after click);
  // fall back to the live hover path while nothing is selected yet.
  const crumbPath =
    picks.length === 1
      ? picks[0].path
      : picks.length === 0
        ? hoverPath
        : [];

  const regionModeActive =
    annotationMode && selectMode === "region" && !draft && !editingAnnotation;

  return (
    <div
      ref={wrapRef}
      data-annotation-ui
      className="pointer-events-none absolute inset-0 z-[6]"
    >
      {/* Region-mode crosshair capture overlay (drag to draw). */}
      {regionModeActive && (
        <div
          data-annotation-ui
          className="pointer-events-auto absolute inset-0"
          style={{
            cursor: "crosshair",
            userSelect: "none",
            WebkitUserSelect: "none",
            touchAction: "none",
          }}
          onMouseDown={onCaptureDown}
          onMouseMove={onCaptureMove}
          onMouseUp={onCaptureUp}
          onMouseLeave={onCaptureUp}
          role="presentation"
        />
      )}

      {/* Element-mode hover boundary + contextual label + breadcrumb (§3/§5). */}
      {elementModeActive && hoverRect && hoverRect.wPct > 0 && (
        <div
          data-annotation-ui
          className="pointer-events-none absolute rounded-[var(--radius-50,4px)] border-2"
          style={{
            left: `${hoverRect.xPct}%`,
            top: `${hoverRect.yPct}%`,
            width: `${hoverRect.wPct}%`,
            height: `${hoverRect.hPct}%`,
            borderColor: C.brandFg,
            backgroundColor: C.brandSubtle,
            boxShadow: "0 0 0 1px rgba(255,255,255,0.6)",
          }}
          aria-hidden
        >
          {/* Contextual label at the top-left of the boundary. */}
          <span
            className="pointer-events-none absolute left-0 flex max-w-[240px] items-center gap-1 truncate rounded-[var(--radius-50,4px)] px-1.5 py-0.5 text-[11px] font-semibold shadow-sm"
            style={{
              top: hoverRect.yPct < 6 ? "2px" : "-20px",
              backgroundColor: C.brandBg,
              color: C.brandFgOn,
            }}
          >
            {hoverLabel || "Element"}
          </span>
        </div>
      )}

      {/* Committed element selections (highlight boxes). */}
      {elementModeActive &&
        picks.map((p, i) => (
          <div
            key={`pick-${i}`}
            data-annotation-ui
            className="pointer-events-none absolute rounded-[var(--radius-50,4px)] border-2"
            style={{
              left: `${p.rectPct.xPct}%`,
              top: `${p.rectPct.yPct}%`,
              width: `${p.rectPct.wPct}%`,
              height: `${p.rectPct.hPct}%`,
              borderColor: C.brandFg,
              backgroundColor: C.brandSubtle,
              opacity: 0.55,
            }}
            aria-hidden
          />
        ))}

      {/* In-progress draw rectangle (region mode). */}
      {drawNorm && drawNorm.wPct > 0 && drawNorm.hPct > 0 && (
        <div
          data-annotation-ui
          className="absolute rounded-[var(--radius-100,8px)] border-2"
          style={{
            left: `${drawNorm.xPct}%`,
            top: `${drawNorm.yPct}%`,
            width: `${drawNorm.wPct}%`,
            height: `${drawNorm.hPct}%`,
            borderColor: C.brandFg,
            backgroundColor: C.brandSubtle,
            opacity: 0.4,
          }}
          aria-hidden
        />
      )}

      {/* Pending region highlight (drawn, awaiting Annotate). */}
      {pendingRegion && !draft && (
        <div
          data-annotation-ui
          className="pointer-events-none absolute rounded-[var(--radius-100,8px)] border-2"
          style={{
            left: `${pendingRegion.region.xPct}%`,
            top: `${pendingRegion.region.yPct}%`,
            width: `${pendingRegion.region.wPct}%`,
            height: `${pendingRegion.region.hPct}%`,
            borderColor: C.brandFg,
            backgroundColor: C.brandSubtle,
            opacity: 0.4,
          }}
          aria-hidden
        />
      )}

      {/* Submitted regional annotations. */}
      {regional.map((a) => {
        const live = movingId === a.id && gestureRegion ? { ...a, region: gestureRegion } : a;
        return (
          <RegionShape
            key={a.id}
            annotation={live}
            moveActive={movingId === a.id}
            pulsing={pulseId === a.id}
            onMarkerClick={() => {
              setOpenId((cur) => (cur === a.id ? null : a.id));
              setEditingId(null);
            }}
            onGestureStart={(kind, e) => {
              if (a.region) beginGesture(a.id, gestureRegion ?? a.region, kind, e);
            }}
          />
        );
      })}

      {/* Page-level markers in a fixed rail (top-right of the canvas). */}
      {pageLevel.length > 0 && (
        <div className="pointer-events-auto absolute right-2 top-2 z-[7] flex flex-col items-end gap-1.5">
          {pageLevel.map((a) => {
            const resolved = a.status === "Resolved" || a.status === "Applied";
            return (
              <button
                key={a.id}
                type="button"
                aria-label={`Open page-level annotation ${pad2(a.seq)}`}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenId((cur) => (cur === a.id ? null : a.id));
                  setEditingId(null);
                }}
                className="flex h-[22px] min-w-[26px] items-center justify-center gap-1 rounded-full border-2 px-1.5 text-[11px] font-semibold shadow-md outline-none"
                style={{
                  backgroundColor: resolved ? C.surface2 : C.brandBg,
                  borderColor: resolved ? C.textMuted : C.brandFgOn,
                  color: resolved ? C.textMuted : C.brandFgOn,
                }}
              >
                <NotePencil size={11} />
                {pad2(a.seq)}
              </button>
            );
          })}
        </div>
      )}

      {/* Selection confirmation pill (§20) — element multi-select or pending
          region. Never auto-opens the editor; the user presses Annotate. */}
      {!draft && (picks.length > 0 || pendingRegion) && (
        <div
          data-annotation-ui
          className="pointer-events-auto absolute left-1/2 top-3 z-[9] flex max-w-[92%] -translate-x-1/2 flex-col gap-1.5 rounded-[var(--radius-100,8px)] border border-solid p-2 shadow-lg"
          style={{ backgroundColor: C.surface, borderColor: C.brandFg }}
          role="status"
        >
          {/* Breadcrumb of the single selected element (§5). Derived from the
              selected pick's own path so it persists after the click (hover
              state is cleared once the pointer stops moving). */}
          {selectMode === "elements" && crumbPath.length > 1 && (
            <div className="flex flex-wrap items-center gap-1 px-1">
              {crumbPath.map((crumb, i) => (
                <span key={`${crumb}-${i}`} className="flex items-center gap-1">
                  {i > 0 && (
                    <span className="text-[11px]" style={{ color: C.textMuted }} aria-hidden>
                      ›
                    </span>
                  )}
                  <button
                    type="button"
                    onClick={() => selectCrumb(i)}
                    className="rounded-full border border-solid px-1.5 py-0.5 text-[11px] font-medium transition-colors"
                    style={{
                      borderColor: i === crumbPath.length - 1 ? C.brandFg : C.border,
                      color: i === crumbPath.length - 1 ? C.brandFg : C.textBody,
                      backgroundColor:
                        i === crumbPath.length - 1 ? C.brandSubtle : C.surface,
                    }}
                  >
                    {crumb}
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-1 text-[12px] font-semibold" style={{ color: C.textPrimary }}>
              {selectMode === "elements"
                ? `${picks.length} element${picks.length === 1 ? "" : "s"} selected`
                : pendingRegion
                  ? pendingRegion.elements.length > 0
                    ? `${pendingRegion.elements.length} element${
                        pendingRegion.elements.length === 1 ? "" : "s"
                      } selected`
                    : "Region selected"
                  : ""}
            </span>
            <div className="ml-auto flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => {
                  setPicks([]);
                  setPendingRegion(null);
                }}
                className="rounded-[var(--radius-100,8px)] border border-solid px-2.5 py-1 text-[12px] font-medium"
                style={{ borderColor: C.border, color: C.textBody, backgroundColor: C.surface }}
              >
                Clear
              </button>
              <button
                type="button"
                onClick={() =>
                  commentInsteadAt(
                    selectMode === "elements"
                      ? picksBound
                        ? { ...picksBound, label: hoverLabel || "Selected elements" }
                        : null
                      : pendingRegion?.region ?? null,
                    "Selected region",
                  )
                }
                className="rounded-[var(--radius-100,8px)] border border-solid px-2.5 py-1 text-[12px] font-medium"
                style={{ borderColor: C.border, color: C.textBody, backgroundColor: C.surface }}
              >
                Comment instead
              </button>
              <button
                type="button"
                onClick={() => (selectMode === "elements" ? annotatePicks() : annotateRegion())}
                className="rounded-[var(--radius-100,8px)] px-2.5 py-1 text-[12px] font-medium"
                style={{ backgroundColor: C.brandBg, color: C.brandFgOn }}
              >
                Annotate
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Editor for a fresh draft. */}
      {draft && (
        <AnchoredPopover
          anchorXPct={draft.region ? draft.region.xPct : 50}
          anchorYPct={draft.region ? draft.region.yPct : 8}
        >
          <AnnotationEditor
            title="Design annotation"
            authors={authors}
            areaLabel={draft.region ? draft.region.label : "Entire page"}
            sectionLabel={draft.sectionLabel}
            elements={draft.elements}
            selectionKind={draft.selectionKind}
            seqLabel="New annotation"
            initial={EMPTY_EDITOR}
            submitLabel="Add annotation"
            showCommentInstead={Boolean(draft.region)}
            onCommentInstead={commentInstead}
            onSubmit={submitDraft}
            onCancel={() => {
              setDraft(null);
              setPicks([]);
              setPendingRegion(null);
            }}
          />
        </AnchoredPopover>
      )}

      {/* Edit an existing annotation. */}
      {editingAnnotation && (
        <AnchoredPopover
          anchorXPct={editingAnnotation.region ? editingAnnotation.region.xPct : 50}
          anchorYPct={editingAnnotation.region ? editingAnnotation.region.yPct : 8}
        >
          <AnnotationEditor
            title="Edit annotation"
            authors={authors}
            areaLabel={editingAnnotation.region ? editingAnnotation.region.label : "Entire page"}
            sectionLabel={editingAnnotation.sectionLabel}
            elements={editingAnnotation.elements}
            selectionKind={editingAnnotation.selectionKind}
            seqLabel={`Design annotation #${pad2(editingAnnotation.seq)}`}
            initial={{
              what: editingAnnotation.what,
              why: editingAnnotation.why,
              types: editingAnnotation.types,
              dsGuidance: editingAnnotation.dsGuidance,
              scope: editingAnnotation.scope,
            }}
            initialAuthor={editingAnnotation.author}
            submitLabel="Save changes"
            showCommentInstead={false}
            onSubmit={submitEdit}
            onCancel={() => setEditingId(null)}
          />
        </AnchoredPopover>
      )}

      {/* Details for an open annotation (not while editing it). */}
      {openAnnotation && editingId !== openAnnotation.id && (
        <AnchoredPopover
          anchorXPct={openAnnotation.region ? openAnnotation.region.xPct : 50}
          anchorYPct={openAnnotation.region ? openAnnotation.region.yPct : 8}
        >
          <AnnotationDetails
            annotation={openAnnotation}
            showMove={openAnnotation.selectionKind === "region"}
            moveActive={movingId === openAnnotation.id}
            onEdit={() => {
              setEditingId(openAnnotation.id);
              setMovingId(null);
            }}
            onStatusChange={(s) => updateAnnotation(openAnnotation.id, { status: s })}
            onToggleMove={() =>
              setMovingId((cur) => (cur === openAnnotation.id ? null : openAnnotation.id))
            }
            onDelete={() => {
              deleteAnnotation(openAnnotation.id);
              setOpenId(null);
              setMovingId(null);
            }}
            onClose={() => {
              setOpenId(null);
              setMovingId(null);
            }}
          />
        </AnchoredPopover>
      )}
    </div>
  );
}

/* ================================================================== */
/* Annotation panel body (rendered in the Options / Ideation panel)   */
/* ================================================================== */

/** Fire the focus-region event the layer listens for (scroll + pulse + open). */
export function focusAnnotation(id: string): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("fiber:focus-annotation", { detail: id }));
}

type PanelFilter = "All" | "Open" | "In progress" | "Applied" | "Resolved";

const PANEL_FILTERS: readonly PanelFilter[] = [
  "All",
  "Open",
  "In progress",
  "Applied",
  "Resolved",
];

function matchesFilter(a: DesignAnnotation, f: PanelFilter): boolean {
  if (f === "All") return true;
  return a.status === f;
}

/**
 * The Design Annotations section for the Options / Ideation side panel. Lists
 * the viewed version's annotations with a status filter and a "+ New
 * annotation" action that enters region mode. Clicking a row focuses the region
 * (pulse) + opens details via a window event the layer handles.
 */
export function AnnotationsPanelBody({
  annotations,
  onNewAnnotation,
  onNewPageLevel,
  onRowActivate,
}: {
  annotations: DesignAnnotation[];
  onNewAnnotation: () => void;
  onNewPageLevel: () => void;
  /** Called when a row is activated (e.g. to close the side panel). */
  onRowActivate?: () => void;
}) {
  const [filter, setFilter] = useState<PanelFilter>("All");

  // Chronological (oldest-first) so #NN reads naturally in the list.
  const ordered = useMemo(
    () => annotations.slice().sort((a, b) => a.seq - b.seq),
    [annotations],
  );
  const rows = ordered.filter((a) => matchesFilter(a, filter));

  return (
    <div className="flex flex-col gap-[var(--spacing-200,16px)]">
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onNewAnnotation}
          className="flex items-center gap-1.5 rounded-[var(--radius-100,8px)] px-[var(--spacing-150,12px)] py-[var(--spacing-100,8px)] text-[length:var(--body-sm-medium-size,12px)] font-medium"
          style={{ backgroundColor: C.brandBg, color: C.brandFgOn }}
        >
          <NotePencil size={14} />
          New annotation
        </button>
        <button
          type="button"
          onClick={onNewPageLevel}
          className="flex items-center gap-1.5 rounded-[var(--radius-100,8px)] border border-solid px-[var(--spacing-150,12px)] py-[var(--spacing-100,8px)] text-[length:var(--body-sm-medium-size,12px)] font-medium"
          style={{ borderColor: C.border, color: C.textBody, backgroundColor: C.surface }}
        >
          Page-level
        </button>
      </div>

      {/* Status filter pills */}
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter annotations by status">
        {PANEL_FILTERS.map((f) => {
          const active = filter === f;
          return (
            <button
              key={f}
              type="button"
              aria-pressed={active}
              onClick={() => setFilter(f)}
              className="rounded-full border border-solid px-2.5 py-1 text-[12px] font-medium transition-colors"
              style={{
                backgroundColor: active ? C.brandFg : C.surface,
                borderColor: active ? C.brandFg : C.border,
                color: active ? C.brandFgOn : C.textBody,
              }}
            >
              {f}
            </button>
          );
        })}
      </div>

      {rows.length === 0 ? (
        <div
          className="flex flex-col items-center gap-2 rounded-[var(--radius-100,8px)] border border-dashed p-[var(--spacing-400,32px)] text-center"
          style={{ borderColor: C.border }}
        >
          <NotePencil size={24} style={{ color: C.textMuted }} aria-hidden />
          <p className="text-[length:var(--body-md-medium-size,14px)] font-medium" style={{ color: C.textPrimary }}>
            No design annotations
          </p>
          <p className="text-[12px]" style={{ color: C.textMuted }}>
            {annotations.length === 0
              ? "Start a new annotation, then hover the design and click an element to select it."
              : "No annotations match this filter."}
          </p>
        </div>
      ) : (
        <ul className="flex flex-col gap-[var(--spacing-150,12px)]">
          {rows.map((a) => (
            <li key={a.id}>
              <AnnotationRow annotation={a} onActivate={onRowActivate} />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AnnotationRow({
  annotation,
  onActivate,
}: {
  annotation: DesignAnnotation;
  onActivate?: () => void;
}) {
  const [hover, setHover] = useState(false);
  const a = annotation;
  const area =
    a.sectionLabel || (a.region ? a.region.label : "Entire page");
  return (
    <button
      type="button"
      onClick={() => {
        focusAnnotation(a.id);
        onActivate?.();
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex w-full flex-col items-start gap-1.5 rounded-[var(--radius-100,8px)] border border-solid p-[var(--spacing-200,16px)] text-left transition-colors"
      style={{ borderColor: C.border, backgroundColor: hover ? C.hoverBg : C.surface }}
    >
      <div className="flex w-full items-center justify-between gap-2">
        <span
          className="text-[length:var(--body-md-medium-size,14px)] font-semibold"
          style={{ color: C.textPrimary }}
        >
          #{pad2(a.seq)} · {area}
        </span>
        <StatusBadge status={a.status} />
      </div>
      {/* Structured element references (§13). */}
      {a.elements.length > 0 && <ElementChips elements={a.elements} />}
      <p className="line-clamp-2 text-[length:var(--body-sm-regular-size,12px)]" style={{ color: C.textBody }}>
        {a.what}
      </p>
      {a.types.length > 0 && (
        <span className="text-[11px] font-medium" style={{ color: C.textMuted }}>
          {a.types.join(", ")}
        </span>
      )}
    </button>
  );
}
