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
  Copy,
  DotsThreeVertical,
  FloppyDisk,
  MagnifyingGlass,
  PaperPlaneRight,
  PencilSimple,
  Plus,
  Robot,
  Sparkle,
  Trash,
  User,
  X,
} from "@phosphor-icons/react";

import {
  RULE_CATEGORIES,
  draftToRule,
  ensureSeeded,
  newId,
  ruleRepository,
  type Rule,
  type RuleCategory,
  type RuleDraft,
  type RuleMessage,
} from "@/lib/ruleStore";
import { parseRuleFromConversation, summariseDraft } from "@/lib/ruleParser";

/*
 * Component Rules — a reusable rule-engine workspace inside the Design System.
 *
 * Left panel: rules library (search, category filters, rule cards, per-rule
 * actions). Right panel: a conversational rule builder that turns natural
 * language into a structured rule draft (parser lives in lib/ruleParser.ts,
 * behind an async interface so an AI backend can replace it later).
 *
 * Rules are creation/management only — they are NOT yet applied to components.
 * Future seams (templates, inheritance, version history, Figma validation,
 * apply-to-components, conflict detection) are documented in lib/ruleStore.ts.
 *
 * TOKEN CONVENTION: token-driven colours are applied via inline `style` objects
 * (see the `T` palette + `useHover` helper below), NOT Tailwind arbitrary color
 * utilities — arbitrary rgba/var() color classes can silently fail in this
 * project. Layout/spacing/radius arbitrary classes are fine and are kept.
 * Every colour references a Figma token with a hex fallback so dark mode flips
 * via [data-theme="dark"] with no per-component conditionals.
 */

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
  errorBoldBg: "var(--container-dynamic-error-bold-background-default,#ad102c)",
  dangerStateFg: "var(--surface-foreground-static-error,#da294b)",
  elevationRegular: "var(--elevation-regular)",
  elevationSelected: "var(--elevation-selected)",
} as const;

const nowIso = () => new Date().toISOString();

/**
 * Small hover helper: toggles a background token on pointer enter/leave via
 * inline styles (arbitrary `hover:bg-[var(...)]` color utilities are avoided
 * per the token convention). Returns props to spread onto an element.
 */
function useHover(hoverBg: string): {
  hovered: boolean;
  bg: string | undefined;
  handlers: { onMouseEnter: () => void; onMouseLeave: () => void };
} {
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

/* ====================================================================== */
/* Small shared atoms                                                      */
/* ====================================================================== */

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

function CategoryBadge({ category }: { category: RuleCategory }) {
  return (
    <span
      className="inline-flex items-center rounded-[var(--spacing-mega,40px)] px-2 py-0.5 text-[11px] font-medium"
      style={{ fontFamily: FONT, background: T.brandSubtleBg, color: T.brandSubtleFg }}
    >
      {category}
    </span>
  );
}

function PrimaryButton({
  children,
  onClick,
  type = "button",
  disabled,
}: {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className="inline-flex shrink-0 items-center justify-center gap-1.5 whitespace-nowrap rounded-[var(--radius-50,4px)] px-3 py-2 text-[14px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-60"
      style={{ fontFamily: FONT, background: T.brandBoldBg, color: T.brandBoldFg }}
    >
      {children}
    </button>
  );
}

function GhostButton({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  const hover = useHover(T.neutralHoverBg);
  return (
    <button
      type="button"
      onClick={onClick}
      {...hover.handlers}
      className="inline-flex items-center justify-center gap-1.5 rounded-[var(--radius-50,4px)] border px-3 py-2 text-[14px] font-medium transition-colors"
      style={{ fontFamily: FONT, borderColor: T.border, color: T.textBody, background: hover.bg }}
    >
      {children}
    </button>
  );
}

/** Menu item button with token-driven hover, used inside the actions menu. */
function MenuItem({
  icon,
  label,
  onClick,
  danger,
}: {
  icon: ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  const hover = useHover(danger ? T.errorSubtleBg : T.neutralHoverBg);
  return (
    <button
      type="button"
      onClick={onClick}
      {...hover.handlers}
      className="flex w-full items-center gap-2 px-3 py-2 text-[13px] transition-colors"
      style={{ color: danger ? T.dangerStateFg : T.textBody, background: hover.bg }}
    >
      {icon} {label}
    </button>
  );
}

/* ====================================================================== */
/* Left panel — rules library                                              */
/* ====================================================================== */

function RuleActions({
  onEdit,
  onDuplicate,
  onDelete,
}: {
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const trigger = useHover(T.neutralHoverBg);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label="Rule actions"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        {...trigger.handlers}
        className="flex h-7 w-7 items-center justify-center rounded-[var(--radius-50,4px)] transition-colors"
        style={{ color: trigger.hovered ? T.textBody : T.textMuted, background: trigger.bg }}
      >
        <DotsThreeVertical size={18} weight="bold" />
      </button>
      {open && (
        <div
          role="menu"
          className="absolute right-0 top-8 z-20 w-40 overflow-hidden rounded-[var(--radius-100,8px)] border"
          style={{ borderColor: T.border, background: T.surface, boxShadow: T.elevationRegular }}
        >
          <MenuItem
            icon={<PencilSimple size={15} />}
            label="Edit"
            onClick={() => {
              setOpen(false);
              onEdit();
            }}
          />
          <MenuItem
            icon={<Copy size={15} />}
            label="Duplicate"
            onClick={() => {
              setOpen(false);
              onDuplicate();
            }}
          />
          <MenuItem
            icon={<Trash size={15} />}
            label="Delete"
            danger
            onClick={() => {
              setOpen(false);
              onDelete();
            }}
          />
        </div>
      )}
    </div>
  );
}

/**
 * A rule card. Accessibility structure (fixes nested-interactive ARIA):
 *  - The card is a plain <div> container (NOT interactive).
 *  - Selection is a real, full-card-covering <button> layered UNDER the content
 *    (absolute inset-0) — it provides the click + keyboard (Enter/Space) target.
 *  - The actions menu is a SIBLING positioned above the selection button
 *    (higher z-index), so its buttons are never descendants of another
 *    interactive element and their events don't select the card.
 */
function RuleCard({
  rule,
  selected,
  onSelect,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  rule: Rule;
  selected: boolean;
  onSelect: () => void;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}) {
  const hover = useHover(T.neutralHoverBg);
  const cardStyle: CSSProperties = selected
    ? { borderColor: T.brandSelectedBorder, background: T.brandSubtleSelectedBg }
    : { borderColor: T.border, background: hover.bg ?? T.surface };

  return (
    <div
      className="relative rounded-[var(--radius-100,8px)] border p-3 transition-colors"
      style={cardStyle}
      {...(selected ? {} : hover.handlers)}
    >
      {/* Full-card selection target sits UNDER the content and actions. */}
      <button
        type="button"
        onClick={onSelect}
        aria-pressed={selected}
        aria-label={`Open rule ${rule.name}`}
        className="absolute inset-0 z-0 h-full w-full cursor-pointer rounded-[var(--radius-100,8px)]"
      />

      {/* Content is non-interactive and pointer-transparent so clicks reach the
          selection button, except the actions menu which re-enables pointers. */}
      <div className="pointer-events-none relative z-10">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="min-w-0 break-words text-[14px] font-semibold"
            style={{ fontFamily: FONT, color: T.textPrimary }}
          >
            {rule.name}
          </h3>
          <div className="pointer-events-auto">
            <RuleActions onEdit={onEdit} onDuplicate={onDuplicate} onDelete={onDelete} />
          </div>
        </div>
        {rule.categories.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-1">
            {rule.categories.map((c) => (
              <CategoryBadge key={c} category={c} />
            ))}
          </div>
        )}
        {rule.description && (
          <p
            className="mt-2 line-clamp-2 text-[12px]"
            style={{ fontFamily: FONT, color: T.textBody }}
          >
            {rule.description}
          </p>
        )}
        {rule.targetComponents.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {rule.targetComponents.slice(0, 5).map((t) => (
              <Pill key={t}>{t}</Pill>
            ))}
            {rule.targetComponents.length > 5 && <Pill>+{rule.targetComponents.length - 5}</Pill>}
          </div>
        )}
      </div>
    </div>
  );
}

function LeftPanel({
  rules,
  selectedId,
  onSelect,
  onNew,
  onEdit,
  onDuplicate,
  onDelete,
}: {
  rules: Rule[];
  selectedId?: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [activeCategories, setActiveCategories] = useState<RuleCategory[]>([]);

  const toggleCategory = (c: RuleCategory) =>
    setActiveCategories((prev) =>
      prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c],
    );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rules.filter((r) => {
      const matchesQuery =
        !q ||
        r.name.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.targetComponents.some((t) => t.toLowerCase().includes(q));
      const matchesCat =
        activeCategories.length === 0 ||
        activeCategories.some((c) => r.categories.includes(c));
      return matchesQuery && matchesCat;
    });
  }, [rules, query, activeCategories]);

  return (
    <div
      className="flex h-full min-h-0 w-full flex-col overflow-hidden"
      style={{ background: T.surface }}
    >
      <div className="shrink-0 border-b p-4" style={{ borderColor: T.border }}>
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2
              className="min-w-0 truncate text-[15px] font-semibold"
              style={{ fontFamily: FONT, color: T.textPrimary }}
            >
              Global Rules Library
            </h2>
            <p className="mt-0.5 text-[12px]" style={{ fontFamily: FONT, color: T.textMuted }}>
              Reusable rules shared across components. Component-specific rules live in each
              component's side panel.
            </p>
          </div>
          <PrimaryButton onClick={onNew}>
            <Plus size={16} weight="bold" /> New rule
          </PrimaryButton>
        </div>

        {/* Search (Fiber input styling) */}
        <div
          className="mt-3 flex items-center gap-2 rounded-[var(--radius-25,2px)] border px-3"
          style={{ height: "var(--sizing-34,34px)", borderColor: T.border, background: T.neutralFieldBg }}
        >
          <MagnifyingGlass size={16} className="shrink-0" style={{ color: T.textMuted }} />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search rules"
            className="w-full min-w-0 bg-transparent text-[14px] outline-none"
            style={{ fontFamily: FONT, color: T.textPrimary }}
          />
          {query && (
            <button type="button" aria-label="Clear search" onClick={() => setQuery("")} className="shrink-0">
              <X size={14} style={{ color: T.textMuted }} />
            </button>
          )}
        </div>

        {/* Category filter chips */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {RULE_CATEGORIES.map((c) => {
            const active = activeCategories.includes(c);
            return (
              <button
                key={c}
                type="button"
                aria-pressed={active}
                onClick={() => toggleCategory(c)}
                className="inline-flex items-center rounded-[var(--spacing-mega,40px)] border px-2.5 py-1 text-[12px] font-medium transition-colors"
                style={{
                  fontFamily: FONT,
                  borderColor: active ? T.brandSelectedBorder : T.neutralBorderDefault,
                  background: active ? T.brandSubtleSelectedBg : "transparent",
                  color: active ? T.brandSubtleFg : T.textBody,
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
      </div>

      {/* Rule cards */}
      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto p-3">
        {filtered.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <Sparkle size={28} style={{ color: T.textMuted }} />
            <p className="mt-3 text-[14px] font-medium" style={{ fontFamily: FONT, color: T.textPrimary }}>
              {rules.length === 0 ? "No global rules yet" : "No rules match your filters"}
            </p>
            <p className="mt-1 text-[12px]" style={{ fontFamily: FONT, color: T.textBody }}>
              {rules.length === 0
                ? "Describe a behaviour on the right to define a reusable rule shared across components."
                : "Try a different search term or clear the category filters."}
            </p>
          </div>
        ) : (
          filtered.map((r) => (
            <RuleCard
              key={r.id}
              rule={r}
              selected={r.id === selectedId}
              onSelect={() => onSelect(r.id)}
              onEdit={() => onEdit(r.id)}
              onDuplicate={() => onDuplicate(r.id)}
              onDelete={() => onDelete(r.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}

/* ====================================================================== */
/* Structured draft summary card                                           */
/* ====================================================================== */

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

function PillRow({ values }: { values: string[] }) {
  return (
    <div className="flex flex-wrap gap-1">
      {values.map((v) => (
        <Pill key={v}>{v}</Pill>
      ))}
    </div>
  );
}

function DraftSummary({ draft }: { draft: RuleDraft }) {
  const has = (v?: unknown[] | string) =>
    Array.isArray(v) ? v.length > 0 : Boolean(v && String(v).trim());

  return (
    <div className="flex min-w-0 flex-col gap-3 break-words">
      {has(draft.name) && (
        <Field label="Rule name">
          <span className="text-[15px] font-semibold" style={{ fontFamily: FONT, color: T.textPrimary }}>
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
      {has(draft.categories) && (
        <Field label="Categories">
          <div className="flex flex-wrap gap-1">
            {draft.categories!.map((c) => (
              <CategoryBadge key={c} category={c} />
            ))}
          </div>
        </Field>
      )}
      {has(draft.targetComponents) && (
        <Field label="Target components">
          <PillRow values={draft.targetComponents!} />
        </Field>
      )}
      {has(draft.supportedProperties) && (
        <Field label="Properties">
          <PillRow values={draft.supportedProperties!} />
        </Field>
      )}
      {has(draft.allowedVariants) && (
        <Field label="Variants">
          <PillRow values={draft.allowedVariants!} />
        </Field>
      )}
      {has(draft.allowedStates) && (
        <Field label="Allowed states">
          <PillRow values={draft.allowedStates!} />
        </Field>
      )}
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
      {has(draft.notes) && (
        <Field label="Notes">
          <span className="text-[13px]" style={{ fontFamily: FONT, color: T.textBody }}>
            {draft.notes}
          </span>
        </Field>
      )}
    </div>
  );
}

/* ====================================================================== */
/* Right panel — conversational rule builder                               */
/* ====================================================================== */

const EMPTY_SUGGESTIONS = [
  "Buttons should always have a text label. Leading and trailing icons are optional.",
  "Disabled buttons cannot receive hover states and must not respond to clicks.",
  "Loading state disables interaction. Chips are not loading by default.",
];

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

function RightPanel({
  selectedRule,
  onSaved,
  onClearSelection,
  resetKey,
}: {
  selectedRule?: Rule;
  onSaved: (rule: Rule) => void;
  onClearSelection: () => void;
  resetKey: number;
}) {
  const [messages, setMessages] = useState<RuleMessage[]>([]);
  const [draft, setDraft] = useState<RuleDraft | undefined>(undefined);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const closeHover = useHover(T.neutralHoverBg);

  /*
   * Session token — guards against the async-draft race. Each time the
   * selection/session changes (or "New rule" is pressed), we mint a fresh
   * token. A parse result is only applied if the token still matches the
   * session that was active when the parse started; stale results are dropped.
   */
  const sessionRef = useRef(0);

  // Load the selected rule's conversation, or start fresh. Bumping the session
  // token here invalidates any in-flight parse from the previous selection.
  useEffect(() => {
    sessionRef.current += 1;
    if (selectedRule) {
      setMessages(selectedRule.sourceConversation ?? []);
      setDraft(ruleToDraft(selectedRule));
    } else {
      setMessages([]);
      setDraft(undefined);
    }
    setInput("");
    setBusy(false);
  }, [selectedRule, resetKey]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    setInput("");
    setBusy(true);

    // Capture the session this parse belongs to.
    const session = sessionRef.current;

    const userMsg: RuleMessage = {
      id: newId("msg"),
      role: "user",
      text: trimmed,
      createdAt: nowIso(),
    };
    const withUser = [...messages, userMsg];
    setMessages(withUser);

    // Parser is async on purpose — an AI backend can replace it transparently.
    const nextDraft = await parseRuleFromConversation(withUser);

    // Discard the result if the user switched selection while parsing.
    if (session !== sessionRef.current) return;

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
    const rule = draftToRule(draft, messages, selectedRule);
    if (selectedRule) ruleRepository.update(rule);
    else ruleRepository.create(rule);
    onSaved(rule);
  };

  const isEditing = Boolean(selectedRule);
  const hasDraft = draft && Object.values(draft).some((v) => (Array.isArray(v) ? v.length : v));

  return (
    <div
      className="flex h-full min-h-0 w-full flex-col overflow-hidden"
      style={{ background: T.canvas }}
    >
      <div
        className="flex shrink-0 items-center justify-between gap-2 border-b px-5 py-4"
        style={{ borderColor: T.border, background: T.surface }}
      >
        <div className="flex min-w-0 items-center gap-2">
          <div
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-50,4px)]"
            style={{ background: T.brandSubtleBg, color: T.brandSubtleFg }}
          >
            <Sparkle size={18} weight="fill" />
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-[15px] font-semibold" style={{ fontFamily: FONT, color: T.textPrimary }}>
              {isEditing ? `Editing “${selectedRule!.name}”` : "Teach a new rule"}
            </h2>
            <p className="truncate text-[12px]" style={{ fontFamily: FONT, color: T.textMuted }}>
              {isEditing
                ? `Version ${selectedRule!.version} · refine in natural language`
                : "Describe how a component should behave"}
            </p>
          </div>
        </div>
        {isEditing && (
          <button
            type="button"
            aria-label="Close and start a new rule"
            onClick={onClearSelection}
            {...closeHover.handlers}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[var(--radius-50,4px)]"
            style={{ color: T.textMuted, background: closeHover.bg }}
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Conversation */}
      <div ref={scrollRef} className="min-h-0 min-w-0 flex-1 space-y-4 overflow-y-auto p-5">
        {messages.length === 0 && !hasDraft ? (
          <div className="flex h-full flex-col items-center justify-center px-6 text-center">
            <div
              className="flex h-12 w-12 items-center justify-center rounded-full"
              style={{ background: T.brandSubtleBg, color: T.brandSubtleFg }}
            >
              <Robot size={24} />
            </div>
            <p className="mt-3 text-[15px] font-semibold" style={{ fontFamily: FONT, color: T.textPrimary }}>
              Describe a component rule
            </p>
            <p className="mt-1 max-w-sm text-[13px]" style={{ fontFamily: FONT, color: T.textBody }}>
              Write it the way you'd explain it to a teammate. I'll turn it into a structured rule
              you can review and save.
            </p>
            <div className="mt-5 flex w-full max-w-sm flex-col gap-2">
              {EMPTY_SUGGESTIONS.map((s) => (
                <SuggestionButton key={s} text={s} onClick={() => void send(s)} />
              ))}
            </div>
          </div>
        ) : (
          <>
            {/* When editing an existing rule with no stored chat, show its summary. */}
            {messages.length === 0 && draft && (
              <div
                className="rounded-[var(--radius-100,8px)] border p-4"
                style={{ borderColor: T.border, background: T.surface }}
              >
                <p className="mb-3 text-[12px]" style={{ fontFamily: FONT, color: T.textMuted }}>
                  Current rule definition — add a message below to refine it.
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

      {/* Save / Refine affordances */}
      {hasDraft && (
        <div
          className="flex shrink-0 items-center justify-between gap-2 border-t px-5 py-3"
          style={{ borderColor: T.border, background: T.surface }}
        >
          <span className="min-w-0 truncate text-[12px]" style={{ fontFamily: FONT, color: T.textMuted }}>
            Keep typing below to refine, or save the rule.
          </span>
          <div className="flex shrink-0 items-center gap-2">
            <PrimaryButton onClick={handleSave}>
              <FloppyDisk size={16} /> {isEditing ? "Save changes" : "Save rule"}
            </PrimaryButton>
          </div>
        </div>
      )}

      {/* Composer */}
      <form
        onSubmit={handleSubmit}
        className="shrink-0 border-t p-4"
        style={{ borderColor: T.border, background: T.surface }}
      >
        <div
          className="flex items-end gap-2 rounded-[var(--radius-100,8px)] border px-3 py-2"
          style={{ borderColor: T.border, background: T.neutralFieldBg }}
        >
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send(input);
              }
            }}
            rows={1}
            placeholder={isEditing ? "Refine this rule…" : "Describe how the component should behave…"}
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
  };
}

/* ====================================================================== */
/* Delete confirm dialog                                                   */
/* ====================================================================== */

function ConfirmDelete({
  rule,
  onCancel,
  onConfirm,
}: {
  rule: Rule;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onCancel} aria-hidden />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-sm rounded-[var(--radius-100,8px)] border p-5"
        style={{ borderColor: T.border, background: T.surface, boxShadow: T.elevationSelected }}
      >
        <h3 className="text-[16px] font-semibold" style={{ fontFamily: FONT, color: T.textPrimary }}>
          Delete rule?
        </h3>
        <p className="mt-2 text-[13px]" style={{ fontFamily: FONT, color: T.textBody }}>
          “{rule.name}” will be permanently removed. This cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <GhostButton onClick={onCancel}>Cancel</GhostButton>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 rounded-[var(--radius-50,4px)] px-3 py-2 text-[14px] font-medium transition-colors"
            style={{ fontFamily: FONT, background: T.errorBoldBg, color: "#ffffff" }}
          >
            <Trash size={15} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* ====================================================================== */
/* Page                                                                    */
/* ====================================================================== */

export default function ComponentRulesPage() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const [pendingDelete, setPendingDelete] = useState<Rule | undefined>(undefined);
  // Bumped to force the builder to reset (e.g. "New rule" pressed twice).
  const [builderKey, setBuilderKey] = useState(0);

  useEffect(() => {
    // Seed on first run, then show ONLY global rules — component-specific rules
    // are authored + shown in each component's side panel, not here.
    ensureSeeded();
    setRules(ruleRepository.listGlobal());
  }, []);

  const refresh = () => setRules(ruleRepository.listGlobal());
  const selectedRule = rules.find((r) => r.id === selectedId);

  const handleNew = () => {
    setSelectedId(undefined);
    setBuilderKey((k) => k + 1);
  };

  const handleSaved = (rule: Rule) => {
    refresh();
    setSelectedId(rule.id);
  };

  const handleDuplicate = (id: string) => {
    const original = ruleRepository.get(id);
    if (!original) return;
    const copy: Rule = {
      ...original,
      id: newId(),
      name: `${original.name} (copy)`,
      version: 1,
      createdAt: nowIso(),
      updatedAt: nowIso(),
    };
    ruleRepository.create(copy);
    refresh();
    setSelectedId(copy.id);
    setBuilderKey((k) => k + 1);
  };

  const handleDelete = (id: string) => {
    const rule = ruleRepository.get(id);
    if (rule) setPendingDelete(rule);
  };

  const confirmDelete = () => {
    if (!pendingDelete) return;
    ruleRepository.remove(pendingDelete.id);
    if (selectedId === pendingDelete.id) {
      setSelectedId(undefined);
      setBuilderKey((k) => k + 1);
    }
    setPendingDelete(undefined);
    refresh();
  };

  return (
    <div
      className="flex w-full max-w-full flex-col overflow-hidden md:h-[calc(100vh-57px)] md:min-h-0 md:flex-row"
      style={{ background: T.canvas }}
    >
      {/* Left — rules library */}
      <aside
        className="h-[60vh] w-full shrink-0 overflow-hidden border-b md:h-auto md:w-[340px] md:min-w-[340px] md:border-b-0 md:border-r"
        style={{ borderColor: T.border }}
      >
        <LeftPanel
          rules={rules}
          selectedId={selectedId}
          onSelect={(id) => {
            setSelectedId(id);
            setBuilderKey((k) => k + 1);
          }}
          onNew={handleNew}
          onEdit={(id) => {
            setSelectedId(id);
            setBuilderKey((k) => k + 1);
          }}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      </aside>

      {/* Right — conversational builder */}
      <section className="flex min-h-[70vh] min-w-0 flex-1 flex-col overflow-hidden md:min-h-0">
        <RightPanel
          selectedRule={selectedRule}
          onSaved={handleSaved}
          onClearSelection={handleNew}
          resetKey={builderKey}
        />
      </section>

      {pendingDelete && (
        <ConfirmDelete
          rule={pendingDelete}
          onCancel={() => setPendingDelete(undefined)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
