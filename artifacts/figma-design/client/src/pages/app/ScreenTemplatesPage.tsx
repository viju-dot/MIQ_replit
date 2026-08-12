/* =========================================================================
 * Fiber Workspace — Screen Templates (/screen-templates)
 *
 * A READ-ONLY reference library of best-practice Fiber Design System screens.
 * Component pages and Component Rules teach the AI about individual components;
 * Screen Templates teach it how those components are *composed* into complete
 * product screens (layout patterns, Auto Layout usage, spacing, hierarchy).
 * There is NO editing here — these are references that will ground future
 * AI-generated prototypes.
 *
 * ROUTES (registered in App.tsx):
 *   /screen-templates      → gallery of template cards (this default export)
 *   /screen-templates/:id  → read-only detail page (ScreenTemplateDetailPage)
 *
 * COLOR CONVENTION: token-driven colors use inline style objects
 * (var(--token, fallbackHex)); layout / spacing / typography-size stay classes.
 * ========================================================================= */

import { useState } from "react";
import { Link, useParams } from "wouter";
import {
  SquaresFour,
  Stack,
  ArrowLeft,
  ArrowSquareOut,
  Cube,
  Browsers,
  Layout,
  type IconProps,
} from "@phosphor-icons/react";
import {
  screenTemplateRepository,
  previewUrl,
  type ScreenTemplate,
  type AutoLayoutNode,
} from "@/lib/screenTemplateStore";

const C = {
  surface: "var(--surface-background-lvl1,#ffffff)",
  canvasBg: "var(--surface-background-lvl2,#f7f7fa)",
  border: "var(--border-static-subtle-neutral,#e1e1e8)",
  textPrimary: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
  textMuted: "var(--surface-foreground-static-neutral-lvl3,#717180)",
  textBody: "var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)",
  brandSubtle: "var(--container-dynamic-brand-subtle-background-default,#f6ebff)",
  brandFg: "var(--surface-foreground-dynamic-brand-default,#7c33b5)",
  hoverBg: "var(--container-dynamic-neutral-subtle-background-hover,#71718014)",
};

/* ---------------------------------------------------------------------- */
/* Shared bits                                                             */
/* ---------------------------------------------------------------------- */

/** A small component tag pill. */
function ComponentTag({ label }: { label: string }) {
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
      style={{ backgroundColor: C.hoverBg, color: C.textBody }}
    >
      {label}
    </span>
  );
}

/* ---------------------------------------------------------------------- */
/* Gallery (/screen-templates)                                             */
/* ---------------------------------------------------------------------- */

function TemplateCard({ template }: { template: ScreenTemplate }) {
  const [hover, setHover] = useState(false);
  const shown = template.associatedComponents.slice(0, 4);
  const extra = template.associatedComponents.length - shown.length;
  return (
    <Link
      href={`/screen-templates/${template.id}`}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label={`View screen template: ${template.name}`}
      className="flex flex-col overflow-hidden rounded-[var(--radius-100,8px)] border border-solid transition-colors"
      style={{
        backgroundColor: C.surface,
        borderColor: hover ? C.brandFg : C.border,
      }}
    >
      {/* Thumbnail — top-anchored crop of the tall screen preview. */}
      <div
        className="relative h-[200px] w-full overflow-hidden border-b"
        style={{ backgroundColor: C.canvasBg, borderColor: C.border }}
      >
        <img
          src={previewUrl(template)}
          alt={`Preview of ${template.name}`}
          loading="lazy"
          className="absolute left-0 top-0 w-full object-cover object-top"
        />
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-[var(--spacing-100,8px)] p-[var(--spacing-250,20px)]">
        <h2
          className="text-[length:var(--headline-xs-medium-size,16px)] font-semibold transition-colors"
          style={{ color: hover ? C.brandFg : C.textPrimary }}
        >
          {template.name}
        </h2>
        <p
          className="text-[length:var(--body-md-regular-size,14px)]"
          style={{ color: C.textMuted }}
        >
          {template.description}
        </p>

        {shown.length > 0 && (
          <div className="mt-auto flex flex-wrap gap-1.5 pt-[var(--spacing-100,8px)]">
            {shown.map((c) => (
              <ComponentTag key={c} label={c} />
            ))}
            {extra > 0 && <ComponentTag label={`+${extra} more`} />}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function ScreenTemplatesPage(): JSX.Element {
  const templates = screenTemplateRepository.list();

  return (
    <div className="mx-auto w-full max-w-[1080px] px-6 py-8 md:px-10 md:py-10">
      {/* Header */}
      <div className="flex flex-col gap-[var(--spacing-100,8px)]">
        <span
          className="flex size-[40px] items-center justify-center rounded-[var(--radius-50,4px)]"
          style={{ backgroundColor: C.brandSubtle }}
        >
          <SquaresFour size={22} weight="fill" style={{ color: C.brandFg }} />
        </span>
        <h1
          className="mt-[var(--spacing-100,8px)] text-[length:var(--headline-lg-semibold-size,28px)] font-semibold tracking-[-1px]"
          style={{ color: C.textPrimary }}
        >
          Screen Templates
        </h1>
        <p
          className="max-w-[680px] text-[length:var(--body-lg-regular-size,16px)]"
          style={{ color: C.textMuted }}
        >
          A reference library of best-practice Fiber Design System screens. These templates capture
          how components are composed into complete interfaces — layout patterns, Auto Layout usage,
          spacing and component hierarchy — and will ground future AI-generated prototypes so they
          match our real product design language.
        </p>
      </div>

      {/* Gallery */}
      <div className="mt-[var(--spacing-400,32px)]">
        <p
          className="pb-[var(--spacing-150,12px)] text-[13px] font-medium uppercase tracking-wide"
          style={{ color: C.textMuted }}
        >
          {templates.length} {templates.length === 1 ? "template" : "templates"}
        </p>
        <div className="grid grid-cols-1 gap-[var(--spacing-250,20px)] sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => (
            <TemplateCard key={t.id} template={t} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Detail (/screen-templates/:id)                                          */
/* ---------------------------------------------------------------------- */

/** A titled section with an icon header. */
function DetailSection({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ComponentType<IconProps>;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section
      className="flex flex-col gap-[var(--spacing-150,12px)] rounded-[var(--radius-100,8px)] border border-solid p-[var(--spacing-300,24px)]"
      style={{ backgroundColor: C.surface, borderColor: C.border }}
    >
      <div className="flex items-center gap-[var(--spacing-100,8px)]">
        <Icon size={18} style={{ color: C.brandFg }} />
        <h2
          className="text-[length:var(--headline-xs-medium-size,16px)] font-semibold"
          style={{ color: C.textPrimary }}
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}

/** Recursively render the Auto Layout hierarchy as an indented tree. */
function HierarchyTree({ nodes, depth = 0 }: { nodes: AutoLayoutNode[]; depth?: number }) {
  return (
    <ul className={depth === 0 ? "flex flex-col gap-[var(--spacing-100,8px)]" : "flex flex-col gap-[var(--spacing-100,8px)]"}>
      {nodes.map((node, i) => (
        <li key={`${node.name}-${i}`} className="flex flex-col gap-[var(--spacing-100,8px)]">
          <div
            className="flex flex-col gap-0.5 rounded-[var(--radius-50,4px)] border border-solid px-[var(--spacing-150,12px)] py-[var(--spacing-100,8px)]"
            style={{ backgroundColor: C.canvasBg, borderColor: C.border }}
          >
            <div className="flex items-center gap-[var(--spacing-100,8px)]">
              <span
                className="inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide"
                style={{ backgroundColor: C.brandSubtle, color: C.brandFg }}
              >
                {node.kind}
              </span>
              <span
                className="text-[length:var(--body-md-medium-size,14px)] font-medium"
                style={{ color: C.textPrimary }}
              >
                {node.name}
              </span>
            </div>
            {node.note && (
              <p
                className="text-[length:var(--body-sm-regular-size,12px)]"
                style={{ color: C.textMuted }}
              >
                {node.note}
              </p>
            )}
          </div>
          {node.children && node.children.length > 0 && (
            <div
              className="ml-[var(--spacing-250,20px)] border-l pl-[var(--spacing-200,16px)]"
              style={{ borderColor: C.border }}
            >
              <HierarchyTree nodes={node.children} depth={depth + 1} />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

/** Back-to-gallery link. */
function BackLink() {
  const [hover, setHover] = useState(false);
  return (
    <Link
      href="/screen-templates"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors"
      style={{ color: hover ? C.brandFg : C.textBody }}
    >
      <ArrowLeft size={15} />
      Back to Screen Templates
    </Link>
  );
}

/** External Figma link (a sibling control, never nested). */
function FigmaLink({ href }: { href: string }) {
  const [hover, setHover] = useState(false);
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="inline-flex items-center gap-1.5 rounded-[var(--radius-50,4px)] border px-3 py-2 text-[13px] font-medium transition-colors"
      style={{
        borderColor: C.border,
        backgroundColor: hover ? C.hoverBg : C.surface,
        color: hover ? C.brandFg : C.textBody,
      }}
    >
      <ArrowSquareOut size={15} />
      Open in Figma
    </a>
  );
}

/** Not-found state for bad template ids. */
function TemplateNotFound({ id }: { id: string }) {
  return (
    <div className="mx-auto w-full max-w-[720px] px-6 py-8 md:px-10 md:py-10">
      <BackLink />
      <div
        className="mt-[var(--spacing-300,24px)] flex flex-col items-center gap-[var(--spacing-150,12px)] rounded-[var(--radius-100,8px)] border border-dashed p-[var(--spacing-500,40px)] text-center"
        style={{ borderColor: C.border }}
      >
        <span
          className="flex size-[48px] items-center justify-center rounded-full"
          style={{ backgroundColor: C.hoverBg }}
        >
          <Browsers size={24} style={{ color: C.textMuted }} />
        </span>
        <h1
          className="text-[length:var(--headline-sm-semibold-size,20px)] font-semibold"
          style={{ color: C.textPrimary }}
        >
          Template not found
        </h1>
        <p
          className="max-w-[420px] text-[length:var(--body-md-regular-size,14px)]"
          style={{ color: C.textMuted }}
        >
          No screen template exists for{" "}
          <span className="font-medium" style={{ color: C.textBody }}>
            “{id}”
          </span>
          . It may have been removed, or the link is incorrect.
        </p>
      </div>
    </div>
  );
}

export function ScreenTemplateDetailPage(): JSX.Element {
  const params = useParams();
  const id = params.id ?? "";
  const template = id ? screenTemplateRepository.get(id) : undefined;

  if (!template) return <TemplateNotFound id={id} />;

  return (
    <div className="mx-auto w-full max-w-[1080px] px-6 py-8 md:px-10 md:py-10">
      <BackLink />

      {/* Title row */}
      <div className="mt-[var(--spacing-250,20px)] flex flex-col gap-[var(--spacing-200,16px)] md:flex-row md:items-start md:justify-between">
        <div className="flex flex-col gap-[var(--spacing-100,8px)]">
          <h1
            className="text-[length:var(--headline-lg-semibold-size,28px)] font-semibold tracking-[-1px]"
            style={{ color: C.textPrimary }}
          >
            {template.name}
          </h1>
          <p
            className="max-w-[640px] text-[length:var(--body-lg-regular-size,16px)]"
            style={{ color: C.textMuted }}
          >
            {template.description}
          </p>
          <p
            className="text-[length:var(--body-sm-regular-size,12px)]"
            style={{ color: C.textMuted }}
          >
            Canvas {template.canvasSize.width} × {template.canvasSize.height} px · Reference only
          </p>
        </div>
        {template.figmaUrl && (
          <div className="shrink-0">
            <FigmaLink href={template.figmaUrl} />
          </div>
        )}
      </div>

      <div className="mt-[var(--spacing-400,32px)] grid grid-cols-1 gap-[var(--spacing-250,20px)] lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* Left: full scrollable preview */}
        <DetailSection icon={Browsers} title="Preview">
          <p
            className="text-[length:var(--body-sm-regular-size,12px)]"
            style={{ color: C.textMuted }}
          >
            Full screen preview — scroll to see the complete composition.
          </p>
          <div
            className="max-h-[720px] overflow-auto rounded-[var(--radius-50,4px)] border"
            style={{ backgroundColor: C.canvasBg, borderColor: C.border }}
          >
            <img
              src={previewUrl(template)}
              alt={`Full preview of ${template.name}`}
              className="block w-full"
            />
          </div>
        </DetailSection>

        {/* Right: structured metadata */}
        <div className="flex flex-col gap-[var(--spacing-250,20px)]">
          <DetailSection icon={Layout} title="Layout Structure">
            <p
              className="text-[length:var(--body-md-regular-size,14px)] leading-relaxed"
              style={{ color: C.textBody }}
            >
              {template.layoutStructure}
            </p>
          </DetailSection>

          <DetailSection icon={Cube} title="Associated Components">
            {template.associatedComponents.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {template.associatedComponents.map((c) => (
                  <ComponentTag key={c} label={c} />
                ))}
              </div>
            ) : (
              <p
                className="text-[length:var(--body-md-regular-size,14px)]"
                style={{ color: C.textMuted }}
              >
                No components recorded.
              </p>
            )}
          </DetailSection>

          {template.designNotes && (
            <DetailSection icon={Stack} title="Design Notes">
              <p
                className="text-[length:var(--body-md-regular-size,14px)] leading-relaxed"
                style={{ color: C.textBody }}
              >
                {template.designNotes}
              </p>
            </DetailSection>
          )}
        </div>
      </div>

      {/* Auto Layout hierarchy — full width below */}
      <div className="mt-[var(--spacing-250,20px)]">
        <DetailSection icon={Stack} title="Auto Layout Hierarchy">
          <p
            className="text-[length:var(--body-sm-regular-size,12px)]"
            style={{ color: C.textMuted }}
          >
            The vertical page flow captured from the source Figma frame.
          </p>
          {template.autoLayoutHierarchy.length > 0 ? (
            <HierarchyTree nodes={template.autoLayoutHierarchy} />
          ) : (
            <p
              className="text-[length:var(--body-md-regular-size,14px)]"
              style={{ color: C.textMuted }}
            >
              No hierarchy recorded.
            </p>
          )}
        </DetailSection>
      </div>
    </div>
  );
}
