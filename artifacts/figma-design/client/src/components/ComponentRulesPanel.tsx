/**
 * Component Rules — side panel body.
 *
 * Rendered inside the reusable Fiber <SidePanel> drawer (see
 * pages/app/SidePanel.tsx) directly from a component page, so the user can
 * teach a component how to behave WHILE looking at its live preview — no
 * navigating away.
 *
 * Layout:
 *  - Property Assistant (left): the component's real metadata as clickable
 *    chips grouped by family (Variants, States, Size Variants, …). Clicking a
 *    chip inserts a smart placeholder like `{State}` at the editor cursor.
 *  - Rule builder (right): the SAME conversational engine used by the Global
 *    Rules Library (lib/ruleParser.ts). Rules saved here are scoped to THIS
 *    component only (componentSlug) — never global.
 *
 * TOKEN CONVENTION: colours are applied via inline `style` objects using
 * var(--token, fallback) — never Tailwind arbitrary color utilities. No nested
 * interactive controls; chips/list rows are plain buttons.
 */

import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import {
  ArrowClockwise,
  FloppyDisk,
  PaperPlaneRight,
  PencilSimple,
  Plus,
  Robot,
  Sparkle,
  Trash,
  User,
} from "@phosphor-icons/react";

import type { ComponentMeta, ComponentProperty } from "@/lib/componentMeta";
import {
  draftToRule,
  newId,
  ruleRepository,
  type Rule,
  type RuleDraft,
  type RuleMessage,
} from "@/lib/ruleStore";
import { parseRuleFromConversation, summariseDraft } from "@/lib/ruleParser";

const FONT = "'DM Sans', Helvetica, sans-serif";

/* Token palette resolved as CSS values (var + hex fallback) for inline styles. */
const T = {
  surface: "var(--surface-background-lvl1,#ffffff)",
  canvas: "var(--surface-background-lvl2,#f7f7fa)",
  border: "var(--border-static-subtle-neutral,#e1e1e8)",
  textPrimary: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
  textBody: "var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)",
  textMuted: "var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)",
  brandFg: "var(--surface-foreground-dynamic-brand-default,#7c33b5)",
  brandBoldBg: "var(--container-dynamic-brand-bold-background-default,#7c33b5)",
  brandBoldFg: "var(--container-dynamic-brand-bold-foreground-default,#ffffff)",
  brandSubtleBg: "var(--container-dynamic-brand-subtle-background-default,#f6ebff)",
  brandSubtleSelectedBg: "var(--container-dynamic-brand-subtle-background-selected,#f6ebff)",
  brandSubtleFg: "var(--container-dynamic-brand-subtle-foreground-default,#7c33b5)",
  brandSelectedBorder: "var(--border-dynamic-brand-selected,#7c33b5)",
  neutralSubtleBg: "var(--container-static-neutral-subtle-background,#ebebf0)",
  neutralSubtleFg: "var(--container-static-neutral-subtle-foreground,#4b4b59)",
  neutralHoverBg: "var(--container-dynamic-neutral-subtle-background-hover,#71718014)",
  neutralFieldBg: "var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)",
  neutralVariationBg: "var(--container-dynamic-neutral-subtle-background-default-variation,#ebebf0)",
  neutralBorderDefault: "var(--border-dynamic-neutral-subtle-default,#c6c6cc)",
  errorFg: "var(--surface-foreground-static-error,#da294b)",
  errorSubtleBg: "var(--container-dynamic-error-subtle-background-selected,#ffedef)",
} as const;

const nowIso = () => new Date().toISOString();

/** Hover-background helper (inline styles can't express :hover). */
function useHover(hoverBg: string) {
  const [hovered, setHovered] = useState(false);
  return {
    hovered,
    bg: hovered ? hoverBg : undefined,
    handlers: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
    },
  };
}

/* ---------------------------------------------------------------------- */
/* Small atoms                                                             */
/* ---------------------------------------------------------------------- */

function Pill({ children }: { children: ReactNode }) {
  return (
    <span
      className="inline-flex items-center rounded-[var(--radius-25,2px)] px-1.5 py-0.5 text-[11px] font-medium"
      style={{ fontFamily: FONT, background: T.neutralSubtleBg, color: T.neutralSubtleFg }}
    >
      {children}
    </span>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span
        className="text-[11px] font-medium uppercase tracking-wide"
        style={{ fontFamily: FONT, color: T.textMuted }}
      >
        {label}
      </span>
      {children}
    </div>
  );
}

function DraftSummary({ draft }: { draft: RuleDraft }) {
  const has = (v?: unknown[] | string) =>
    Array.isArray(v) ? v.length > 0 : Boolean(v && String(v).trim());
  const pills = (values: string[]) => (
    <div className="flex flex-wrap gap-1">
      {values.map((v) => (
        <Pill key={v}>{v}</Pill>
      ))}
    </div>
  );

  return (
    <div className="flex min-w-0 flex-col gap-3 break-words">
      {has(draft.name) && (
        <Field label="Rule name">
          <span className="text-[14px] font-semibold" style={{ fontFamily: FONT, color: T.textPrimary }}>
            {draft.name}
          </span>
        </Field>
      )}
      {has(draft.description) && (
        <Field label="Description">
          <span className="text-[13px]" style={{ fontFamily: FONT, color: T.textBody }}>
            {draft.description}
          </span>
        </Field>
      )}
      {has(draft.targetComponents) && (
        <Field label="Target components">{pills(draft.targetComponents!)}</Field>
      )}
      {has(draft.supportedProperties) && (
        <Field label="Properties">{pills(draft.supportedProperties!)}</Field>
      )}
      {has(draft.allowedStates) && <Field label="Allowed states">{pills(draft.allowedStates!)}</Field>}
      {has(draft.prohibitedStates) && (
        <Field label="Prohibited states">
          <div className="flex flex-wrap gap-1">
            {draft.prohibitedStates!.map((s) => (
              <span
                key={s}
                className="inline-flex items-center rounded-[var(--radius-25,2px)] px-1.5 py-0.5 text-[11px] font-medium line-through"
                style={{ fontFamily: FONT, background: T.errorSubtleBg, color: T.errorFg }}
              >
                {s}
              </span>
            ))}
          </div>
        </Field>
      )}
      {has(draft.restrictions) && (
        <Field label="Restrictions">
          <ul className="flex flex-col gap-1">
            {draft.restrictions!.map((r, i) => (
              <li key={i} className="text-[13px]" style={{ fontFamily: FONT, color: T.textBody }}>
                • {r}
              </li>
            ))}
          </ul>
        </Field>
      )}
      {has(draft.defaultBehavior) && (
        <Field label="Default behaviour">
          <span className="text-[13px]" style={{ fontFamily: FONT, color: T.textBody }}>
            {draft.defaultBehavior}
          </span>
        </Field>
      )}
    </div>
  );
}

function ChatBubble({ message }: { message: RuleMessage }) {
  const isUser = message.role === "user";
  return (
    <div className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}>
      <div
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full"
        style={{
          background: isUser ? T.neutralSubtleBg : T.brandSubtleBg,
          color: isUser ? T.neutralSubtleFg : T.brandSubtleFg,
        }}
      >
        {isUser ? <User size={15} /> : <Robot size={15} />}
      </div>
      <div className={`flex min-w-0 max-w-[85%] flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
        {message.text && (
          <div
            className="break-words rounded-[var(--radius-100,8px)] px-3 py-2 text-[13px]"
            style={{
              fontFamily: FONT,
              background: isUser ? T.brandBoldBg : T.neutralVariationBg,
              color: isUser ? T.brandBoldFg : T.textPrimary,
            }}
          >
            {message.text}
          </div>
        )}
        {message.draft && (
          <div
            className="w-full rounded-[var(--radius-100,8px)] border p-3"
            style={{ borderColor: T.border, background: T.surface }}
          >
            <DraftSummary draft={message.draft} />
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Property Assistant — clickable metadata chips                           */
/* ---------------------------------------------------------------------- */

function PropertyChip({
  property,
  onInsert,
}: {
  property: ComponentProperty;
  onInsert: (placeholder: string) => void;
}) {
  const hover = useHover(T.brandSubtleSelectedBg);
  const tooltip =
    property.options && property.options.length > 0
      ? `${property.label}: ${property.options.join(", ")}`
      : property.label;
  return (
    <button
      type="button"
      onClick={() => onInsert(property.placeholder)}
      title={tooltip}
      aria-label={`Insert ${property.label} placeholder`}
      {...hover.handlers}
      className="inline-flex items-center gap-1 rounded-[var(--spacing-mega,40px)] border px-2.5 py-1 text-[12px] font-medium transition-colors"
      style={{
        fontFamily: FONT,
        borderColor: T.brandSelectedBorder,
        background: hover.bg ?? T.brandSubtleBg,
        color: T.brandSubtleFg,
      }}
    >
      <Plus size={12} weight="bold" />
      {property.label}
    </button>
  );
}

function PropertyAssistant({
  meta,
  onInsert,
}: {
  meta: ComponentMeta;
  onInsert: (placeholder: string) => void;
}) {
  return (
    <div className="flex min-h-0 flex-col gap-4">
      <div>
        <h3 className="text-[13px] font-semibold" style={{ fontFamily: FONT, color: T.textPrimary }}>
          Property Assistant
        </h3>
        <p className="mt-0.5 text-[12px]" style={{ fontFamily: FONT, color: T.textMuted }}>
          Click a property to insert it into your rule as a smart placeholder.
        </p>
      </div>

      {meta.groups.length === 0 ? (
        <p className="text-[12px]" style={{ fontFamily: FONT, color: T.textMuted }}>
          This component doesn't expose configurable properties.
        </p>
      ) : (
        meta.groups.map((group) => (
          <div key={group.title} className="flex flex-col gap-1.5">
            <span
              className="text-[11px] font-medium uppercase tracking-wide"
              style={{ fontFamily: FONT, color: T.textMuted }}
            >
              {group.title}
            </span>
            <div className="flex flex-wrap gap-1.5">
              {group.properties.map((p) => (
                <PropertyChip key={`${group.title}-${p.name}`} property={p} onInsert={onInsert} />
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Saved (component-scoped) rules list                                     */
/* ---------------------------------------------------------------------- */

function SavedRuleRow({
  rule,
  active,
  onEdit,
  onDelete,
}: {
  rule: Rule;
  active: boolean;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const hover = useHover(T.neutralHoverBg);
  const editHover = useHover(T.neutralHoverBg);
  const delHover = useHover(T.errorSubtleBg);
  const style: CSSProperties = active
    ? { borderColor: T.brandSelectedBorder, background: T.brandSubtleSelectedBg }
    : { borderColor: T.border, background: hover.bg ?? T.surface };

  return (
    <div
      className="flex items-center gap-2 rounded-[var(--radius-100,8px)] border p-2.5"
      style={style}
      {...(active ? {} : hover.handlers)}
    >
      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium" style={{ fontFamily: FONT, color: T.textPrimary }}>
          {rule.name}
        </p>
        {rule.description && (
          <p className="truncate text-[11px]" style={{ fontFamily: FONT, color: T.textMuted }}>
            {rule.description}
          </p>
        )}
      </div>
      <button
        type="button"
        aria-label={`Edit ${rule.name}`}
        onClick={onEdit}
        {...editHover.handlers}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-50,4px)]"
        style={{ color: T.textBody, background: editHover.bg }}
      >
        <PencilSimple size={15} />
      </button>
      <button
        type="button"
        aria-label={`Delete ${rule.name}`}
        onClick={onDelete}
        {...delHover.handlers}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[var(--radius-50,4px)]"
        style={{ color: T.errorFg, background: delHover.bg }}
      >
        <Trash size={15} />
      </button>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Conversational rule builder (component-scoped)                          */
/* ---------------------------------------------------------------------- */

function RuleBuilder({
  meta,
  editingRule,
  onSaved,
  onCancelEdit,
  registerInsert,
}: {
  meta: ComponentMeta;
  editingRule?: Rule;
  onSaved: (rule: Rule) => void;
  onCancelEdit: () => void;
  /** Lets the parent wire chip clicks to this builder's insert-at-cursor. */
  registerInsert: (fn: (placeholder: string) => void) => void;
}) {
  const [messages, setMessages] = useState<RuleMessage[]>([]);
  const [draft, setDraft] = useState<RuleDraft | undefined>(undefined);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Session token guards the async parse against selection changes mid-flight.
  const sessionRef = useRef(0);

  useEffect(() => {
    sessionRef.current += 1;
    if (editingRule) {
      setMessages(editingRule.sourceConversation ?? []);
      setDraft(ruleToDraft(editingRule));
    } else {
      setMessages([]);
      setDraft(undefined);
    }
    setInput("");
    setBusy(false);
  }, [editingRule]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  /** Insert a placeholder at the textarea cursor (or append). */
  const insertPlaceholder = (placeholder: string) => {
    const el = textareaRef.current;
    setInput((cur) => {
      if (!el) return `${cur}${cur && !cur.endsWith(" ") ? " " : ""}${placeholder} `;
      const start = el.selectionStart ?? cur.length;
      const end = el.selectionEnd ?? cur.length;
      const needsSpaceBefore = start > 0 && !/\s$/.test(cur.slice(0, start));
      const token = `${needsSpaceBefore ? " " : ""}${placeholder} `;
      const next = cur.slice(0, start) + token + cur.slice(end);
      // Restore caret just after the inserted token on next tick.
      window.setTimeout(() => {
        const pos = start + token.length;
        el.focus();
        el.setSelectionRange(pos, pos);
      }, 0);
      return next;
    });
  };

  // Expose the insert fn to the parent so chips can drive it.
  useEffect(() => {
    registerInsert(insertPlaceholder);
    // insertPlaceholder is stable enough for our needs (uses refs/state setter).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [registerInsert]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setInput("");
    setBusy(true);
    const session = sessionRef.current;

    const userMsg: RuleMessage = {
      id: newId("msg"),
      role: "user",
      text: trimmed,
      createdAt: nowIso(),
    };
    const withUser = [...messages, userMsg];
    setMessages(withUser);

    const parsed = await parseRuleFromConversation(withUser);
    if (session !== sessionRef.current) return;

    // Ensure the target component is always THIS component and scope is set.
    const nextDraft: RuleDraft = {
      ...parsed,
      componentSlug: meta.slug,
      targetComponents: Array.from(
        new Set([...(parsed.targetComponents ?? []), meta.name.toLowerCase()]),
      ),
    };

    const assistantMsg: RuleMessage = {
      id: newId("msg"),
      role: "assistant",
      text: summariseDraft(nextDraft),
      draft: nextDraft,
      createdAt: nowIso(),
    };
    setMessages([...withUser, assistantMsg]);
    setDraft(nextDraft);
    setBusy(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void send(input);
  };

  const handleSave = () => {
    if (!draft) return;
    const scoped: RuleDraft = { ...draft, componentSlug: meta.slug };
    const rule = draftToRule(scoped, messages, editingRule);
    if (editingRule) ruleRepository.update(rule);
    else ruleRepository.create(rule);
    onSaved(rule);
  };

  const isEditing = Boolean(editingRule);
  const hasDraft = draft && Object.values(draft).some((v) => (Array.isArray(v) ? v.length : v));

  // Property-aware starter suggestions: each template is emitted ONLY when the
  // component actually exposes the property/kind it references. Placeholders are
  // taken verbatim from real metadata, so we never invent a {State} or label
  // rule for a component that has no such property. An empty list is fine.
  const suggestions = useMemo(() => {
    const byKind = (kind: string) => meta.properties.find((p) => p.kind === kind);
    const list: string[] = [];

    const state = byKind("state");
    if (state) {
      const opt = state.options?.[0];
      list.push(
        `When ${state.placeholder} is ${opt ?? "set"}, prevent all hover interactions on the ${meta.name}.`,
      );
    }

    const icon = byKind("icon");
    if (icon) {
      list.push(
        `If ${icon.placeholder} exists, keep the correct spacing before the ${meta.name} content.`,
      );
    }

    const variant = byKind("variant");
    if (variant) {
      const opt = variant.options?.[0];
      list.push(
        `Use ${variant.placeholder}${opt ? ` (${opt})` : ""} as the default for the ${meta.name}.`,
      );
    }

    const text = byKind("text");
    if (text) {
      list.push(`The ${meta.name} must always have a value for ${text.placeholder}.`);
    }

    const bool = byKind("boolean");
    if (bool) {
      list.push(`Keep ${bool.placeholder} off by default on the ${meta.name}.`);
    }

    return list;
  }, [meta]);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto pr-1">
        {messages.length === 0 && !hasDraft ? (
          <div className="flex flex-col items-start gap-3 py-2">
            <div className="flex items-center gap-2">
              <div
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ background: T.brandSubtleBg, color: T.brandSubtleFg }}
              >
                <Robot size={18} />
              </div>
              <p className="text-[13px] font-semibold" style={{ fontFamily: FONT, color: T.textPrimary }}>
                Describe a rule for {meta.name}
              </p>
            </div>
            <p className="text-[12px]" style={{ fontFamily: FONT, color: T.textBody }}>
              Write it in plain language and drop in the component's properties from the left.
            </p>
            {suggestions.length > 0 && (
              <div className="flex w-full flex-col gap-1.5">
                {suggestions.map((s) => (
                  <SuggestionButton key={s} text={s} onClick={() => void send(s)} />
                ))}
              </div>
            )}
          </div>
        ) : (
          <>
            {messages.length === 0 && draft && (
              <div
                className="rounded-[var(--radius-100,8px)] border p-3"
                style={{ borderColor: T.border, background: T.surface }}
              >
                <p className="mb-2 text-[12px]" style={{ fontFamily: FONT, color: T.textMuted }}>
                  Current rule — add a message below to refine it.
                </p>
                <DraftSummary draft={draft} />
              </div>
            )}
            {messages.map((m) => (
              <ChatBubble key={m.id} message={m} />
            ))}
            {busy && (
              <div className="flex items-center gap-2 pl-10">
                <ArrowClockwise size={15} className="animate-spin" style={{ color: T.textMuted }} />
                <span className="text-[12px]" style={{ fontFamily: FONT, color: T.textMuted }}>
                  Parsing your description…
                </span>
              </div>
            )}
          </>
        )}
      </div>

      {/* Save / cancel bar */}
      {(hasDraft || isEditing) && (
        <div className="mt-3 flex shrink-0 items-center justify-end gap-2">
          {isEditing && (
            <button
              type="button"
              onClick={onCancelEdit}
              className="inline-flex items-center gap-1.5 rounded-[var(--radius-50,4px)] border px-3 py-2 text-[13px] font-medium"
              style={{ fontFamily: FONT, borderColor: T.border, color: T.textBody, background: T.surface }}
            >
              New rule
            </button>
          )}
          <button
            type="button"
            onClick={handleSave}
            disabled={!hasDraft}
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-50,4px)] px-3 py-2 text-[13px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"
            style={{ fontFamily: FONT, background: T.brandBoldBg, color: T.brandBoldFg }}
          >
            <FloppyDisk size={15} /> {isEditing ? "Save changes" : "Save rule"}
          </button>
        </div>
      )}

      {/* Composer */}
      <form onSubmit={handleSubmit} className="mt-3 shrink-0">
        <div
          className="flex items-end gap-2 rounded-[var(--radius-100,8px)] border px-3 py-2"
          style={{ borderColor: T.border, background: T.neutralFieldBg }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            rows={1}
            placeholder={`Describe how ${meta.name} should behave…`}
            className="max-h-32 min-h-[24px] w-full min-w-0 resize-none bg-transparent text-[14px] outline-none"
            style={{ fontFamily: FONT, color: T.textPrimary }}
          />
          <button
            type="submit"
            aria-label="Send"
            disabled={!input.trim() || busy}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-50,4px)] transition-colors disabled:cursor-not-allowed disabled:opacity-50"
            style={{ background: T.brandBoldBg, color: T.brandBoldFg }}
          >
            <PaperPlaneRight size={16} weight="fill" />
          </button>
        </div>
      </form>
    </div>
  );
}

function SuggestionButton({ text, onClick }: { text: string; onClick: () => void }) {
  const hover = useHover(T.neutralHoverBg);
  return (
    <button
      type="button"
      onClick={onClick}
      {...hover.handlers}
      className="rounded-[var(--radius-100,8px)] border px-3 py-2 text-left text-[12px] transition-colors"
      style={{ fontFamily: FONT, borderColor: T.border, background: hover.bg ?? T.surface, color: T.textBody }}
    >
      “{text}”
    </button>
  );
}

function ruleToDraft(rule: Rule): RuleDraft {
  return {
    name: rule.name,
    description: rule.description,
    categories: rule.categories,
    targetComponents: rule.targetComponents,
    supportedProperties: rule.supportedProperties,
    allowedVariants: rule.allowedVariants,
    allowedStates: rule.allowedStates,
    prohibitedStates: rule.prohibitedStates,
    restrictions: rule.restrictions,
    defaultBehavior: rule.defaultBehavior,
    notes: rule.notes,
    componentSlug: rule.componentSlug,
  };
}

/* ---------------------------------------------------------------------- */
/* Panel body                                                              */
/* ---------------------------------------------------------------------- */

export function ComponentRulesPanelBody({ meta }: { meta: ComponentMeta }) {
  const [rules, setRules] = useState<Rule[]>([]);
  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const [builderKey, setBuilderKey] = useState(0);
  const insertRef = useRef<((placeholder: string) => void) | null>(null);

  const refresh = () => setRules(ruleRepository.listByComponent(meta.slug));
  useEffect(() => {
    refresh();
    // Re-scope whenever the inspected component changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meta.slug]);

  const editingRule = rules.find((r) => r.id === editingId);

  const handleSaved = (rule: Rule) => {
    refresh();
    setEditingId(rule.id);
  };

  const handleNew = () => {
    setEditingId(undefined);
    setBuilderKey((k) => k + 1);
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
    setBuilderKey((k) => k + 1);
  };

  const handleDelete = (id: string) => {
    ruleRepository.remove(id);
    if (editingId === id) handleNew();
    refresh();
  };

  return (
    <div
      className="flex min-h-full flex-col gap-4 p-4 md:flex-row md:gap-5"
      style={{ background: T.canvas, fontFamily: FONT }}
    >
      {/* Left column: metadata + saved rules */}
      <aside className="flex w-full flex-col gap-5 md:w-[300px] md:shrink-0">
        <div
          className="rounded-[var(--radius-100,8px)] border p-4"
          style={{ borderColor: T.border, background: T.surface }}
        >
          <PropertyAssistant meta={meta} onInsert={(p) => insertRef.current?.(p)} />
        </div>

        <div
          className="flex min-h-0 flex-col rounded-[var(--radius-100,8px)] border p-4"
          style={{ borderColor: T.border, background: T.surface }}
        >
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className="text-[13px] font-semibold" style={{ color: T.textPrimary }}>
              {meta.name} rules
            </h3>
            <button
              type="button"
              onClick={handleNew}
              className="inline-flex items-center gap-1 rounded-[var(--radius-50,4px)] px-2 py-1 text-[12px] font-medium transition-colors"
              style={{ background: T.brandBoldBg, color: T.brandBoldFg }}
            >
              <Plus size={13} weight="bold" /> New
            </button>
          </div>
          {rules.length === 0 ? (
            <p className="text-[12px]" style={{ color: T.textMuted }}>
              No rules yet for this component. Describe one on the right to teach {meta.name} how to
              behave.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {rules.map((r) => (
                <SavedRuleRow
                  key={r.id}
                  rule={r}
                  active={r.id === editingId}
                  onEdit={() => handleEdit(r.id)}
                  onDelete={() => handleDelete(r.id)}
                />
              ))}
            </div>
          )}
        </div>
      </aside>

      {/* Right column: conversational builder */}
      <section
        className="flex min-h-[420px] min-w-0 flex-1 flex-col rounded-[var(--radius-100,8px)] border p-4"
        style={{ borderColor: T.border, background: T.surface }}
      >
        <RuleBuilder
          key={builderKey}
          meta={meta}
          editingRule={editingRule}
          onSaved={handleSaved}
          onCancelEdit={handleNew}
          registerInsert={(fn) => {
            insertRef.current = fn;
          }}
        />
      </section>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Header badge shown in the drawer subtitle area (small helper)           */
/* ---------------------------------------------------------------------- */

export function ComponentRulesHeaderIcon() {
  return (
    <span
      className="inline-flex h-5 w-5 items-center justify-center rounded-[var(--radius-50,4px)]"
      style={{ background: T.brandSubtleBg, color: T.brandSubtleFg }}
    >
      <Sparkle size={12} weight="fill" />
    </span>
  );
}
