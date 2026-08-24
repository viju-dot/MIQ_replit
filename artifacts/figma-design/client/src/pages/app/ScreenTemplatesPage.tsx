/* =========================================================================
 * MIQ Collaborative Frameworks — Screen Templates (/screen-templates)
 *
 * A READ-ONLY reference library of best-practice Fiber Design System screens.
 * Each template is now a LIVE front-end screen built from real Fiber components
 * (registered in templates/registry.tsx), NOT a screenshot. Component pages and
 * Component Rules teach the AI about individual components; Screen Templates
 * teach it how those components are *composed* into complete product screens.
 *
 * ROUTES (registered in App.tsx):
 *   /screen-templates      → gallery of cards with LIVE miniatures
 *   /screen-templates/:id  → detail page: the LIVE screen in a viewer region
 *
 * The live template screens are designed light-mode at fixed widths
 * (canvasSize.width). The gallery miniature scales the real component down via
 * CSS transform; the detail viewer renders it at natural width, horizontally
 * centered, with horizontal scroll when the viewport is narrower. Both wrap the
 * render region in a light surface so it stays correct in app dark mode.
 *
 * COLOR CONVENTION: token-driven colors use inline style objects
 * (var(--token, fallbackHex)); layout / spacing / typography-size stay classes.
 * ========================================================================= */

import { Suspense, useEffect, useRef, useState } from "react";
import { Link, useParams } from "wouter";
import {
  SquaresFour,
  ArrowLeft,
  ArrowSquareOut,
  Cube,
  Browsers,
} from "@phosphor-icons/react";
import {
  screenTemplateRepository,
  type ScreenTemplate,
} from "@/lib/screenTemplateStore";
import { getTemplateComponent } from "@/templates/registry";

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
  // A fixed light backdrop for the live render region (screens are light-mode).
  viewerBg: "#f7f7fa",
};

/* ---------------------------------------------------------------------- */
/* Shared bits                                                             */
/* ---------------------------------------------------------------------- */

/**
 * The HTML `inert` attribute makes a subtree non-interactive AND removes every
 * descendant from the tab order (unlike pointer-events:none + aria-hidden,
 * which leaves focusable controls tabbable). React 18's types don't include
 * `inert`, so spread it via `any`. Presence of the attribute (even "") is what
 * activates it in the DOM.
 */
const INERT_PROPS = { inert: "" } as unknown as Record<string, unknown>;

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

/** Loading placeholder used while a live screen lazily loads. */
function ScreenLoading() {
  return (
    <div className="flex h-[240px] w-full items-center justify-center">
      <span className="text-[13px]" style={{ color: C.textMuted }}>
        Loading live screen…
      </span>
    </div>
  );
}

/** Fallback shown when a template id has no registered live component. */
function NoLiveImplementation() {
  return (
    <div
      className="flex h-[240px] w-full flex-col items-center justify-center gap-1 p-6 text-center"
      style={{ backgroundColor: C.canvasBg }}
    >
      <p className="text-[14px] font-medium" style={{ color: C.textPrimary }}>
        No live implementation
      </p>
      <p className="text-[12px]" style={{ color: C.textMuted }}>
        A live screen has not been registered for this template yet.
      </p>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Live miniature (gallery thumbnail)                                      */
/* ---------------------------------------------------------------------- */

const MINI_HEIGHT = 200; // px — fixed card preview height

/**
 * A lightweight neutral placeholder shown before a miniature enters the
 * viewport — a subtle animated skeleton the size of the preview box. It keeps
 * the gallery cheap: full screen components are NOT mounted until near-view.
 */
function MiniatureSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="flex h-full w-full items-end"
      style={{ backgroundColor: C.viewerBg }}
    >
      <div className="w-full animate-pulse p-4">
        <div className="mb-3 h-10 w-full rounded" style={{ backgroundColor: C.hoverBg }} />
        <div className="mb-2 h-4 w-2/3 rounded" style={{ backgroundColor: C.hoverBg }} />
        <div className="h-4 w-1/2 rounded" style={{ backgroundColor: C.hoverBg }} />
      </div>
    </div>
  );
}

/**
 * True once the referenced element has come within `rootMargin` of the
 * viewport at least once. Latches to true (once visible we keep it mounted).
 */
function useNearViewport(
  ref: React.RefObject<Element>,
  rootMargin = "200px",
): boolean {
  const [near, setNear] = useState(false);
  useEffect(() => {
    if (near) return; // already latched
    const el = ref.current;
    if (!el) return;
    // No IntersectionObserver (SSR / very old env) → mount immediately.
    if (typeof IntersectionObserver === "undefined") {
      setNear(true);
      return;
    }
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNear(true);
          obs.disconnect();
        }
      },
      { rootMargin },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [ref, rootMargin, near]);
  return near;
}

/**
 * Renders the ACTUAL template component scaled down to fit a fixed-height,
 * clipped container — but only once the card is near the viewport
 * (IntersectionObserver-gated) so the gallery doesn't eagerly mount all 8 full
 * screens. Once mounted it stays mounted.
 *
 * The render subtree is marked `inert` (removes tab stops + blocks interaction)
 * and aria-hidden, so the surrounding card <Link> owns all interaction and no
 * hidden control is keyboard-reachable.
 */
function LiveMiniature({ template }: { template: ScreenTemplate }) {
  const Comp = getTemplateComponent(template.id);
  const width = template.canvasSize.width || 1280;
  const boxRef = useRef<HTMLDivElement>(null);
  const near = useNearViewport(boxRef, "200px");

  return (
    <div
      ref={boxRef}
      aria-hidden="true"
      {...INERT_PROPS}
      className="relative h-[200px] w-full overflow-hidden border-b"
      style={{ backgroundColor: C.viewerBg, borderColor: C.border }}
    >
      {!near ? (
        <MiniatureSkeleton />
      ) : Comp ? (
        <MiniatureScale width={width}>
          <Suspense fallback={<MiniatureSkeleton />}>
            <Comp />
          </Suspense>
        </MiniatureScale>
      ) : (
        <NoLiveImplementation />
      )}
    </div>
  );
}

/**
 * Scales its children (a natural-width screen) down so the screen's width fits
 * the card. Uses a probe container to size the scaled block; the screen is
 * top-anchored and clipped to MINI_HEIGHT by the parent.
 */
function MiniatureScale({
  width,
  children,
}: {
  width: number;
  children: React.ReactNode;
}) {
  // We don't know the intrinsic height, so scale purely by width and clip.
  // Measure the card width via a ref-less CSS trick: the outer container is
  // full-width; we scale by (containerWidth / screenWidth). Since we can't read
  // the container synchronously here, we scale to a nominal card width and let
  // overflow clip. Use a CSS custom approach: place the screen at natural width
  // and scale via transform with transform-origin top-left, sizing the wrapper
  // to 100% and letting the transform map screenWidth → 100%.
  return (
    <div
      className="pointer-events-none absolute left-0 top-0"
      style={{
        width,
        transform: `scale(var(--mini-scale))`,
        transformOrigin: "top left",
        // Fallback scale if the CSS var isn't set (roughly 360/width).
        // The container query below sets --mini-scale to containerWidth/width.
        // @ts-expect-error custom property
        "--mini-scale": `calc(100cqw / ${width})`,
      }}
    >
      {children}
    </div>
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
      {/* Live miniature — a real, scaled-down, non-interactive render. The
          container query context lets the miniature scale to the card width. */}
      <div style={{ containerType: "inline-size", height: MINI_HEIGHT }}>
        <LiveMiniature template={template} />
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
          A reference library of best-practice Fiber Design System screens. Each template is a live
          front-end screen built from real Fiber components — capturing how components are composed
          into complete interfaces — and will ground future AI-generated prototypes so they match
          our real product design language.
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
      className="inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-50,4px)] border px-3 py-2 text-[13px] font-medium transition-colors"
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

/**
 * The primary live-screen viewer. Renders the real template component at its
 * natural width (canvasSize.width), horizontally centered, with horizontal
 * scroll when the viewport is narrower. The surface stays light (screens are
 * light-mode) so it renders correctly under app dark mode.
 */
function LiveScreenViewer({ template }: { template: ScreenTemplate }) {
  const Comp = getTemplateComponent(template.id);
  const width = template.canvasSize.width || 1280;

  return (
    <div
      className="overflow-x-auto rounded-[var(--radius-100,8px)] border border-solid p-[var(--spacing-300,24px)]"
      style={{ backgroundColor: C.viewerBg, borderColor: C.border }}
    >
      <div className="mx-auto" style={{ width }}>
        {/* The rendered template is a static reference implementation: `inert`
            removes every descendant from the tab order and blocks interaction,
            so the detail screen is read-only for mouse AND keyboard users. */}
        <div
          {...INERT_PROPS}
          className="overflow-hidden rounded-[var(--radius-50,4px)] shadow-sm"
          style={{ backgroundColor: C.surface }}
        >
          {Comp ? (
            <Suspense fallback={<ScreenLoading />}>
              <Comp />
            </Suspense>
          ) : (
            <NoLiveImplementation />
          )}
        </div>
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
    <div className="mx-auto w-full max-w-[1280px] px-6 py-8 md:px-10 md:py-10">
      <BackLink />

      {/* Compact info bar */}
      <div
        className="mt-[var(--spacing-250,20px)] flex flex-col gap-[var(--spacing-150,12px)] rounded-[var(--radius-100,8px)] border border-solid p-[var(--spacing-300,24px)] md:flex-row md:items-start md:justify-between"
        style={{ backgroundColor: C.surface, borderColor: C.border }}
      >
        <div className="flex min-w-0 flex-col gap-[var(--spacing-100,8px)]">
          <h1
            className="text-[length:var(--headline-md-semibold-size,24px)] font-semibold tracking-[-0.5px]"
            style={{ color: C.textPrimary }}
          >
            {template.name}
          </h1>
          <p
            className="max-w-[720px] text-[length:var(--body-md-regular-size,14px)]"
            style={{ color: C.textMuted }}
          >
            {template.description}
          </p>
          {template.associatedComponents.length > 0 && (
            <div className="mt-[var(--spacing-50,4px)] flex flex-wrap items-center gap-1.5">
              <span
                className="mr-1 inline-flex items-center gap-1 text-[11px] font-medium uppercase tracking-wide"
                style={{ color: C.textMuted }}
              >
                <Cube size={13} style={{ color: C.brandFg }} />
                Components
              </span>
              {template.associatedComponents.map((c) => (
                <ComponentTag key={c} label={c} />
              ))}
            </div>
          )}
          <p className="text-[11px]" style={{ color: C.textMuted }}>
            Live screen · {template.canvasSize.width} × {template.canvasSize.height} px · Reference
            implementation — interactions disabled
          </p>
        </div>
        {template.figmaUrl && <FigmaLink href={template.figmaUrl} />}
      </div>

      {/* Primary content: the LIVE screen */}
      <div className="mt-[var(--spacing-250,20px)]">
        <LiveScreenViewer template={template} />
      </div>
    </div>
  );
}
