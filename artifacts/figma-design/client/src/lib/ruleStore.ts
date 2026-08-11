/**
 * Component Rules — rule engine data model + persistence repository.
 *
 * This module is the single source of truth for the Component Rules workspace.
 * Rules are authored conversationally (see ruleParser.ts) but stored as a
 * structured model so that a real backend / AI service can swap in later
 * without touching the UI.
 *
 * ── Architecture seams (intentionally NOT implemented yet) ────────────────
 *  • Persistence is behind a small repository interface (localStorage today).
 *    Replace `localStorageRepository` with an HTTP/DB-backed implementation
 *    and the UI keeps working unchanged.
 *  • `version` is bumped on every edit — groundwork for a future version
 *    history / diff view.
 *  • `sourceConversation` preserves the chat that produced the rule, enabling
 *    future AI re-generation, refinement and audit.
 *  • Future: templates, rule inheritance, validation against Figma,
 *    apply-to-components, conflict detection. None are wired here.
 */

export const RULE_CATEGORIES = [
  "States",
  "Content",
  "Interaction",
  "Layout",
  "Accessibility",
] as const;

export type RuleCategory = (typeof RULE_CATEGORIES)[number];

/** A single conversational turn used to author / refine a rule. */
export interface RuleMessage {
  id: string;
  role: "user" | "assistant";
  /** For user turns: the raw text. For assistant turns: a short summary line. */
  text: string;
  /** Assistant turns may carry the draft snapshot they produced. */
  draft?: RuleDraft;
  createdAt: string;
}

/**
 * A partial rule produced by the parser. Only fields the parser actually
 * detected are populated; the UI renders "only fields it detected".
 */
export interface RuleDraft {
  name?: string;
  description?: string;
  categories?: RuleCategory[];
  targetComponents?: string[];
  supportedProperties?: string[];
  allowedVariants?: string[];
  /** States the component may legitimately enter (affirmative mentions). */
  allowedStates?: string[];
  /** States explicitly disallowed (mentioned only in a negated context). */
  prohibitedStates?: string[];
  restrictions?: string[];
  defaultBehavior?: string;
  notes?: string;
}

/** A persisted, fully-formed rule. */
export interface Rule {
  id: string;
  name: string;
  description: string;
  categories: RuleCategory[];
  targetComponents: string[];
  supportedProperties: string[];
  allowedVariants: string[];
  allowedStates: string[];
  /** States explicitly disallowed for the target components. */
  prohibitedStates: string[];
  restrictions: string[];
  defaultBehavior: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
  /** Bumped on every edit — groundwork for version history. */
  version: number;
  /** The conversation that authored this rule (AI re-gen / audit seam). */
  sourceConversation: RuleMessage[];
}

const STORAGE_KEY = "fiber:design-system:component-rules:v1";

/* ---------------------------------------------------------------------- */
/* id + time helpers                                                       */
/* ---------------------------------------------------------------------- */

export function newId(prefix = "rule"): string {
  const rand =
    typeof crypto !== "undefined" && "randomUUID" in crypto
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);
  return `${prefix}_${rand}`;
}

function nowIso(): string {
  return new Date().toISOString();
}

/** Normalise a draft (which may be sparse) into a complete Rule. */
export function draftToRule(
  draft: RuleDraft,
  conversation: RuleMessage[],
  base?: Rule,
): Rule {
  const ts = nowIso();
  return {
    id: base?.id ?? newId(),
    name: draft.name?.trim() || base?.name || "Untitled rule",
    description: draft.description?.trim() || base?.description || "",
    categories: draft.categories ?? base?.categories ?? [],
    targetComponents: draft.targetComponents ?? base?.targetComponents ?? [],
    supportedProperties: draft.supportedProperties ?? base?.supportedProperties ?? [],
    allowedVariants: draft.allowedVariants ?? base?.allowedVariants ?? [],
    allowedStates: draft.allowedStates ?? base?.allowedStates ?? [],
    prohibitedStates: draft.prohibitedStates ?? base?.prohibitedStates ?? [],
    restrictions: draft.restrictions ?? base?.restrictions ?? [],
    defaultBehavior: draft.defaultBehavior?.trim() || base?.defaultBehavior || "",
    notes: draft.notes?.trim() || base?.notes || "",
    createdAt: base?.createdAt ?? ts,
    updatedAt: ts,
    version: base ? base.version + 1 : 1,
    sourceConversation: conversation,
  };
}

/* ---------------------------------------------------------------------- */
/* Repository interface (backend-swap seam)                                */
/* ---------------------------------------------------------------------- */

export interface RuleRepository {
  list(): Rule[];
  get(id: string): Rule | undefined;
  create(rule: Rule): Rule;
  update(rule: Rule): Rule;
  remove(id: string): void;
}

function isStringArray(v: unknown): v is string[] {
  return Array.isArray(v) && v.every((x) => typeof x === "string");
}

/**
 * Validate + coerce a single persisted record into a well-formed Rule at the
 * repository boundary. Returns null for records missing required identity
 * fields (id/name) so the UI NEVER sees a malformed Rule — every field the UI
 * touches (localeCompare on updatedAt, list ops, .map) is guaranteed present.
 */
function coerceRule(raw: unknown): Rule | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  // Required identity — drop the record if these are unusable.
  if (typeof r.id !== "string" || r.id.length === 0) return null;
  if (typeof r.name !== "string" || r.name.length === 0) return null;

  const str = (v: unknown, fallback = ""): string =>
    typeof v === "string" ? v : fallback;
  const strArr = (v: unknown): string[] => (isStringArray(v) ? v : []);
  const categories = Array.isArray(r.categories)
    ? (r.categories.filter(
        (c): c is RuleCategory =>
          typeof c === "string" && (RULE_CATEGORIES as readonly string[]).includes(c),
      ) as RuleCategory[])
    : [];
  const conversation = Array.isArray(r.sourceConversation)
    ? (r.sourceConversation.filter(
        (m): m is RuleMessage =>
          !!m &&
          typeof m === "object" &&
          typeof (m as Record<string, unknown>).id === "string" &&
          ((m as Record<string, unknown>).role === "user" ||
            (m as Record<string, unknown>).role === "assistant"),
      ) as RuleMessage[])
    : [];

  // Timestamps must be non-empty strings so updatedAt.localeCompare is safe.
  const createdAt = str(r.createdAt) || nowIso();
  const updatedAt = str(r.updatedAt) || createdAt;
  const version =
    typeof r.version === "number" && Number.isFinite(r.version) ? r.version : 1;

  return {
    id: r.id,
    name: r.name,
    description: str(r.description),
    categories,
    targetComponents: strArr(r.targetComponents),
    supportedProperties: strArr(r.supportedProperties),
    allowedVariants: strArr(r.allowedVariants),
    allowedStates: strArr(r.allowedStates),
    prohibitedStates: strArr(r.prohibitedStates),
    restrictions: strArr(r.restrictions),
    defaultBehavior: str(r.defaultBehavior),
    notes: str(r.notes),
    createdAt,
    updatedAt,
    version,
    sourceConversation: conversation,
  };
}

function readAll(): Rule[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Coerce/skip invalid entries so downstream code only ever sees valid Rules.
    return parsed
      .map(coerceRule)
      .filter((r): r is Rule => r !== null);
  } catch {
    return [];
  }
}

function writeAll(rules: Rule[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(rules));
  } catch {
    /* storage full / unavailable — non-fatal for a local authoring tool */
  }
}

export const localStorageRepository: RuleRepository = {
  list() {
    return readAll().sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
  },
  get(id) {
    return readAll().find((r) => r.id === id);
  },
  create(rule) {
    const all = readAll();
    all.push(rule);
    writeAll(all);
    return rule;
  },
  update(rule) {
    const all = readAll();
    const idx = all.findIndex((r) => r.id === rule.id);
    if (idx >= 0) all[idx] = rule;
    else all.push(rule);
    writeAll(all);
    return rule;
  },
  remove(id) {
    writeAll(readAll().filter((r) => r.id !== id));
  },
};

// The UI imports this alias so swapping the backend is a one-line change.
export const ruleRepository: RuleRepository = localStorageRepository;

/* ---------------------------------------------------------------------- */
/* Seed data                                                               */
/* ---------------------------------------------------------------------- */

function seedMessage(text: string, role: RuleMessage["role"] = "user"): RuleMessage {
  return { id: newId("msg"), role, text, createdAt: nowIso() };
}

function makeSeed(
  partial: Omit<Rule, "id" | "createdAt" | "updatedAt" | "version" | "sourceConversation"> & {
    conversation: string;
  },
): Rule {
  const ts = nowIso();
  const { conversation, ...rule } = partial;
  return {
    ...rule,
    id: newId(),
    createdAt: ts,
    updatedAt: ts,
    version: 1,
    sourceConversation: [seedMessage(conversation)],
  };
}

export function seedRules(): Rule[] {
  return [
    makeSeed({
      name: "Disabled State",
      description:
        "Interactive components share one disabled contract: reduced emphasis, no hover, and no pointer interaction.",
      categories: ["States", "Interaction", "Accessibility"],
      targetComponents: ["button", "inputs", "dropdowns", "check", "toggle"],
      supportedProperties: ["disabled"],
      allowedVariants: [],
      allowedStates: ["disabled"],
      prohibitedStates: ["hover"],
      restrictions: [
        "Disabled components cannot receive hover states.",
        "Disabled components must not respond to clicks or keyboard activation.",
      ],
      defaultBehavior: "Components are enabled by default.",
      notes: "Keep a visible focus affordance suppressed while disabled to signal non-interactivity.",
      conversation:
        "Disabled buttons, inputs, dropdowns, checks and toggles should look muted and cannot receive hover states. Disabled components must not respond to clicks. Components are enabled by default.",
    }),
    makeSeed({
      name: "Icon Usage",
      description:
        "Icons support labels rather than replace them. Leading and trailing icons are optional and must stay decorative.",
      categories: ["Content", "Layout"],
      targetComponents: ["button", "chip"],
      supportedProperties: ["leadingIcon", "trailingIcon"],
      allowedVariants: [],
      allowedStates: [],
      prohibitedStates: [],
      restrictions: [
        "Buttons must always have a text label.",
        "Icon-only buttons are not allowed unless an aria-label is provided.",
      ],
      defaultBehavior: "No icons are shown by default; icons are opt-in.",
      notes: "Leading and trailing icons are optional and should inherit the text colour.",
      conversation:
        "Buttons and chips should always have a text label. Leading and trailing icons are optional. Icon-only buttons are not allowed unless an aria-label is provided.",
    }),
    makeSeed({
      name: "Loading Behaviour",
      description:
        "While loading, actionable components communicate progress and lock interaction to prevent duplicate submissions.",
      categories: ["States", "Interaction"],
      targetComponents: ["button"],
      supportedProperties: ["loading"],
      allowedVariants: [],
      allowedStates: ["loading"],
      prohibitedStates: [],
      restrictions: [
        "Loading state disables interaction until it resolves.",
        "The label must never disappear while loading.",
      ],
      defaultBehavior: "Components are not loading by default.",
      notes: "",
      conversation:
        "Loading state disables interaction. Buttons should keep their label while loading and show a spinner.",
    }),
  ];
}

/**
 * Ensure the store is seeded on first run so the workspace is never empty.
 * Returns the current rule list.
 */
export function ensureSeeded(): Rule[] {
  if (typeof window === "undefined") return seedRules();
  const existing = ruleRepository.list();
  if (existing.length > 0) return existing;
  const seeds = seedRules();
  seeds.forEach((r) => ruleRepository.create(r));
  return ruleRepository.list();
}
