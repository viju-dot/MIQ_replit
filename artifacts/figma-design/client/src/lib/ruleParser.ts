/**
 * Component Rules — conversational rule parser.
 *
 * Turns a natural-language conversation into a structured {@link RuleDraft}.
 *
 * ── Backend-swap seam ─────────────────────────────────────────────────────
 * The public entry point is `parseRuleFromConversation(messages): Promise<RuleDraft>`.
 * Today it runs a purely local, heuristic keyword extractor (no network, no
 * LLM). To move to a real AI backend later, replace the body of
 * `parseRuleFromConversation` with an API call that returns the same
 * `RuleDraft` shape — every caller stays unchanged.
 *
 * The parser merges the whole conversation so that follow-up user messages
 * REFINE the draft (new detected facts are unioned into the running draft)
 * rather than replacing it — it should feel like teaching the design system.
 */

import { dsPages } from "@/pages/registry";
import {
  RULE_CATEGORIES,
  type RuleCategory,
  type RuleDraft,
  type RuleMessage,
} from "@/lib/ruleStore";

/** Known component slugs, excluding system/workspace pages. */
function knownComponentSlugs(): string[] {
  return dsPages.filter((p) => p.group !== "System").map((p) => p.slug);
}

const STATE_WORDS = [
  "hover",
  "focus",
  "active",
  "disabled",
  "loading",
  "selected",
  "pressed",
  "error",
];

// Word → category heuristics.
const CATEGORY_HINTS: Record<RuleCategory, RegExp> = {
  States: /\b(state|hover|focus|active|disabled|loading|selected|pressed|error)\b/i,
  Content: /\b(label|text|content|copy|icon|placeholder|title)\b/i,
  Interaction: /\b(click|tap|interact|hover|drag|keyboard|press|submit|toggle)\b/i,
  Layout: /\b(layout|spacing|align|position|size|width|leading|trailing|padding)\b/i,
  Accessibility: /\b(accessib|aria|screen reader|contrast|focus ring|keyboard)\b/i,
};

/** Split a blob of text into sentence-like clauses. */
function toSentences(text: string): string[] {
  return text
    .split(/(?<=[.!?])\s+|\n+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function unique(values: string[]): string[] {
  return Array.from(new Set(values));
}

/** Detect component slugs mentioned in the text (singular + plural aware). */
function detectComponents(text: string, slugs: string[]): string[] {
  const lower = text.toLowerCase();
  const hits: string[] = [];
  for (const slug of slugs) {
    // Match the slug and a few natural aliases (drop trailing 's', words split).
    const words = slug.replace(/-/g, " ");
    const singular = words.endsWith("s") ? words.slice(0, -1) : words;
    const candidates = unique([words, singular, `${singular}s`]);
    if (candidates.some((c) => new RegExp(`\\b${escapeRe(c)}\\b`, "i").test(lower))) {
      hits.push(slug);
    }
  }
  return hits;
}

function escapeRe(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** State words present anywhere in a piece of text. */
function statesIn(text: string): string[] {
  const lower = text.toLowerCase();
  return STATE_WORDS.filter((w) => new RegExp(`\\b${w}\\b`).test(lower));
}

// Negation / prohibition markers. A sentence carrying one of these is treated
// as prohibiting the states it mentions rather than permitting them.
const NEGATION_RE =
  /\b(cannot|can't|can not|never|must not|mustn't|should not|shouldn't|not allowed|no|without|disallow|forbid|prevent|suppress|does not|doesn't|do not|don't)\b/i;

function isNegated(sentence: string): boolean {
  return NEGATION_RE.test(sentence);
}

/**
 * Classify state mentions per sentence: states appearing only in negated
 * sentences are prohibited; states appearing in any affirmative sentence are
 * allowed. If a state appears in both contexts, the affirmative wins (it is a
 * legitimate state that is merely restricted in some case).
 *
 * NOTE: the subject-state of a negated sentence (e.g. "disabled" in "Disabled
 * buttons cannot receive hover states") stays ALLOWED — only the states in the
 * predicate of the negation are prohibited. We approximate this by treating the
 * FIRST state token as the subject when the sentence starts with/leads on it.
 */
function classifyStates(sentences: string[]): {
  allowed: string[];
  prohibited: string[];
} {
  const allowed = new Set<string>();
  const prohibited = new Set<string>();

  for (const sentence of sentences) {
    const states = statesIn(sentence);
    if (states.length === 0) continue;

    if (isNegated(sentence)) {
      const lower = sentence.toLowerCase();
      // Heuristic subject detection: the earliest-mentioned state that appears
      // BEFORE the negation marker is the sentence's subject and stays allowed.
      const negIdx = lower.search(NEGATION_RE);
      for (const s of states) {
        const stateIdx = lower.indexOf(s);
        const beforeNegation = negIdx >= 0 && stateIdx >= 0 && stateIdx < negIdx;
        if (beforeNegation) allowed.add(s);
        else prohibited.add(s);
      }
    } else {
      for (const s of states) allowed.add(s);
    }
  }

  // Affirmative context wins over prohibited if a state shows up in both.
  allowed.forEach((s) => prohibited.delete(s));

  return { allowed: Array.from(allowed), prohibited: Array.from(prohibited) };
}

function detectCategories(text: string): RuleCategory[] {
  return RULE_CATEGORIES.filter((c) => CATEGORY_HINTS[c].test(text));
}

/** Sentences that read like hard constraints. */
function detectRestrictions(sentences: string[]): string[] {
  const re = /\b(always|never|must|cannot|can't|can not|should not|shouldn't|not allowed|required|mandatory|only)\b/i;
  return sentences.filter((s) => re.test(s));
}

/** Sentences describing optional / supported properties. */
function detectProperties(sentences: string[]): string[] {
  const props: string[] = [];
  for (const s of sentences) {
    if (/\boptional\b/i.test(s) || /\bcan (have|include|show)\b/i.test(s)) {
      // Pull likely property nouns.
      const matches = s.match(
        /\b(leading icon|trailing icon|icon|label|text|placeholder|title|helper text|badge|tooltip|avatar)\b/gi,
      );
      if (matches) props.push(...matches.map((m) => m.toLowerCase()));
    }
  }
  return unique(props);
}

/** Sentences describing default behaviour. */
function detectDefault(sentences: string[]): string | undefined {
  const hit = sentences.find((s) => /\bby default\b|\bdefaults? to\b|\bdefault (state|value|behaviou?r)\b/i.test(s));
  return hit?.trim();
}

/** Suggest a concise rule name from the strongest signal available. */
function suggestName(components: string[], states: string[], categories: RuleCategory[]): string {
  if (states.length === 1) {
    return `${capitalize(states[0])} State`;
  }
  if (components.length === 1) {
    return `${titleCaseSlug(components[0])} Rule`;
  }
  if (categories.length > 0) {
    return `${categories[0]} Rule`;
  }
  return "New rule";
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function titleCaseSlug(slug: string): string {
  return slug
    .split("-")
    .map(capitalize)
    .join(" ");
}

/** Merge two drafts, unioning list fields and preferring newer scalars. */
function mergeDrafts(base: RuleDraft, next: RuleDraft): RuleDraft {
  const mergeList = (a?: string[], b?: string[]) =>
    a || b ? unique([...(a ?? []), ...(b ?? [])]) : undefined;
  return {
    name: next.name ?? base.name,
    description: next.description ?? base.description,
    categories: mergeList(base.categories, next.categories) as RuleCategory[] | undefined,
    targetComponents: mergeList(base.targetComponents, next.targetComponents),
    supportedProperties: mergeList(base.supportedProperties, next.supportedProperties),
    allowedVariants: mergeList(base.allowedVariants, next.allowedVariants),
    allowedStates: mergeList(base.allowedStates, next.allowedStates),
    prohibitedStates: mergeList(base.prohibitedStates, next.prohibitedStates),
    restrictions: mergeList(base.restrictions, next.restrictions),
    defaultBehavior: next.defaultBehavior ?? base.defaultBehavior,
    notes: next.notes ?? base.notes,
  };
}

/** Parse a single user message into a sparse draft. */
function parseMessage(text: string, slugs: string[]): RuleDraft {
  const sentences = toSentences(text);
  const components = detectComponents(text, slugs);
  // Restriction/negation classification runs BEFORE affirmative state
  // extraction so negated states never leak into allowedStates.
  const { allowed: allowedStates, prohibited: prohibitedStates } =
    classifyStates(sentences);
  const categories = detectCategories(text);
  const restrictions = detectRestrictions(sentences);
  const properties = detectProperties(sentences);
  const defaultBehavior = detectDefault(sentences);

  const draft: RuleDraft = {};
  if (components.length) draft.targetComponents = components;
  if (allowedStates.length) draft.allowedStates = allowedStates;
  if (prohibitedStates.length) draft.prohibitedStates = prohibitedStates;
  if (categories.length) draft.categories = categories;
  if (restrictions.length) draft.restrictions = restrictions;
  if (properties.length) draft.supportedProperties = properties;
  if (defaultBehavior) draft.defaultBehavior = defaultBehavior;

  // Use the first sentence that is not itself a restriction as a description.
  const descriptor = sentences.find((s) => !restrictions.includes(s));
  if (descriptor) draft.description = descriptor;

  return draft;
}

/**
 * Public entry point — parse a whole conversation into a merged RuleDraft.
 *
 * Async on purpose: a future AI backend will be network-bound. Callers should
 * `await` it.
 */
export async function parseRuleFromConversation(
  messages: RuleMessage[],
): Promise<RuleDraft> {
  const slugs = knownComponentSlugs();
  const userMessages = messages.filter((m) => m.role === "user");

  let merged: RuleDraft = {};
  for (const msg of userMessages) {
    merged = mergeDrafts(merged, parseMessage(msg.text, slugs));
  }

  // Cross-message reconciliation: if a state ended up in BOTH lists across the
  // conversation, treat the affirmative mention as authoritative.
  if (merged.allowedStates?.length && merged.prohibitedStates?.length) {
    const allowedSet = new Set(merged.allowedStates);
    merged.prohibitedStates = merged.prohibitedStates.filter((s) => !allowedSet.has(s));
    if (merged.prohibitedStates.length === 0) delete merged.prohibitedStates;
  }

  // Derive a suggested name once, from the merged signal.
  if (!merged.name) {
    merged.name = suggestName(
      merged.targetComponents ?? [],
      merged.allowedStates ?? [],
      merged.categories ?? [],
    );
  }

  return merged;
}

/** A short human-readable summary the assistant "says" alongside a draft. */
export function summariseDraft(draft: RuleDraft): string {
  const parts: string[] = [];
  if (draft.targetComponents?.length)
    parts.push(`${draft.targetComponents.length} target component(s)`);
  if (draft.restrictions?.length) parts.push(`${draft.restrictions.length} restriction(s)`);
  if (draft.allowedStates?.length) parts.push(`${draft.allowedStates.length} allowed state(s)`);
  if (draft.prohibitedStates?.length)
    parts.push(`${draft.prohibitedStates.length} prohibited state(s)`);
  if (draft.supportedProperties?.length)
    parts.push(`${draft.supportedProperties.length} property(ies)`);
  if (parts.length === 0)
    return "I couldn't detect specific rule details yet — try naming a component and what it must or must not do.";
  return `Here's the draft I put together — I detected ${parts.join(", ")}. Review and save, or refine it.`;
}
