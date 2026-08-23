/* =========================================================================
 * TV Audience Intelligence — STANDALONE product page (/tv-audience-intelligence)
 *
 * Rendered OUTSIDE the design-system explorer (no explorer sidebar). It provides
 * a proper Fiber navigation header (Primary Navigation + Secondary Navigation
 * "Reports" module) and then renders the existing dashboard body.
 *
 * The navigation anatomy + tokens are copied locally from
 * client/src/pages/ds/NavigationPage.tsx (per requirement — do not import the
 * playground). The dashboard itself is imported (not duplicated) from
 * client/src/pages/ds/TvAudienceDashboardPage.tsx.
 *
 * The header is full-width and sticky. The dashboard's sticky filter bar reads
 * the --tv-filter-top CSS var (set here to the header height) so the two sticky
 * regions stack instead of overlapping.
 * ========================================================================= */

import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { CaretDown } from "@phosphor-icons/react";
import { useTheme } from "@/lib/theme";
import { useAutoHideHeader } from "@/hooks/useAutoHideHeader";
import TvAudienceDashboardPage from "@/pages/ds/TvAudienceDashboardPage";
import V3ContentPlanner from "@/pages/tv-audience/v3/V3ContentPlanner";
import V4ContentPlanner from "@/pages/tv-audience/v4/V4ContentPlanner";
import {
  PrototypeCollabOverlay,
  PrototypeCommentLayer,
  DesignAnnotationLayer,
} from "@/components/PrototypeCollabOverlay";
import { usePrototypeVersion } from "@/lib/prototypeVersionContext";
import type { PrototypeVersion, Prototype } from "@/lib/prototypeStore";

const A = "/figmaAssets/navigation";
const FONT = '"DM Sans", Helvetica';

// Per the Figma "Primary Navigation" COMPONENT_SET both variants are 64px tall.
const PRIMARY_NAV_H = 64;
const SECONDARY_NAV_H = 56;
const HEADER_H = PRIMARY_NAV_H + SECONDARY_NAV_H; // 120px total sticky header

// This product experience belongs to the Reports module.
const NAV_ITEMS = ["Intelligence", "Audiences", "Creatives", "Campaigns", "Reports"] as const;
const ACTIVE_ITEM: (typeof NAV_ITEMS)[number] = "Reports";

// The active-item 4px gradient underline (literal stops from the JSON:
// #d71982 @ 25.52% → #ff540c @ 59.375% → #dad310 @ 100%).
const UNDERLINE_GRADIENT =
  "linear-gradient(90deg, #d71982 25.52%, #ff540c 59.375%, #dad310 100%)";

// On-dark hardcoded whites (the bar is always dark, regardless of app theme).
const ON_DARK = "#ffffff";
const ON_DARK_MUTED = "rgba(255,255,255,0.8)"; // #ffffffcc — inactive menu items

/* ---------------------------------------------------------- Sigma Logo ----- */
/* The MiQ Sigma "Σ" mark rendered as a self-contained inline SVG filled with
 * the sigma pink→orange→yellow gradient. (The original mask-composited asset
 * version from NavigationPage.tsx did not render reliably here, so this uses a
 * simple, robust vector that matches the Figma reference.) */
function SigmaLogo() {
  return (
    <img
      className="block h-[24px] w-[20px] shrink-0"
      src={`${import.meta.env.BASE_URL}figmaAssets/sigma-lettermark.svg`}
      alt="MiQ Sigma"
      data-name="Sigma Logo"
    />
  );
}

/* ------------------------------------------------------- Theme toggle ------ */
/* Light/Dark switch wired to the app-wide ThemeProvider (useTheme). Styled to
 * sit on the dark MiQ primary bar. */
/* Icon-only, unobtrusive (not part of the Figma spec — our own affordance).
 * Styled like the other on-dark right-cluster icon buttons. */
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex size-[24px] shrink-0 items-center justify-center rounded-[var(--radiuses-small,2px)] transition-colors hover:bg-[rgba(255,255,255,0.15)]"
    >
      {/* Bar is always dark → hardcode white (never theme-flip). */}
      {dark ? (
        <Moon className="h-5 w-5" style={{ color: ON_DARK }} aria-hidden />
      ) : (
        <Sun className="h-5 w-5" style={{ color: ON_DARK }} aria-hidden />
      )}
    </button>
  );
}

/* The right-hand cluster, per user request: theme toggle, diamond, avatar
 * (gap 20). Search/flask/bell/heart/language removed. */
function RightCluster() {
  return (
    <div className="relative flex shrink-0 items-center justify-end gap-[20px]" data-name="right">
      <ThemeToggle />

      {/* Single Diamond (24) */}
      <div className="relative size-[24px] shrink-0" data-name="Single Diamond">
        <div className="absolute left-1/2 top-1/2 size-[20px] -translate-x-1/2 -translate-y-1/2">
          <img alt="" className="absolute inset-0 block size-full max-w-none" src={`${A}/pn-diamond.svg`} />
        </div>
      </div>

      {/* Avatar (Initials, Plan=Pro, 40) */}
      <Avatar />
    </div>
  );
}

/* Avatar — Initials "JS" with the "Pro" magenta-gradient pill (JSON Plan=Pro). */
function Avatar() {
  return (
    <div className="relative flex shrink-0 items-center overflow-clip px-[3px]" data-name="Avatar">
      <div className="relative h-[40px] w-[36px] shrink-0">
        <div className="absolute left-1/2 top-0 size-[32px] -translate-x-1/2" data-name="Initials">
          <div className="absolute left-0 top-0 size-[32px]">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={`${A}/pn-avatar-ellipse.svg`} />
          </div>
          <p className="absolute left-[calc(50%+8px)] top-[7px] -translate-x-full whitespace-nowrap text-right text-[length:var(--body-md-medium-size,14px)] font-medium not-italic leading-normal text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]" style={{ fontFamily: FONT }}>
            JS
          </p>
        </div>
        <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-start" data-name="Badge/rounded">
          <div
            className="relative flex h-[18px] shrink-0 items-center justify-center rounded-[100px] px-[var(--numbers-8,8px)] py-[var(--numbers-2,2px)]"
            style={{ background: UNDERLINE_GRADIENT }}
          >
            <p className="whitespace-nowrap text-center text-[length:var(--body-sm-medium-size,12px)] font-medium not-italic leading-[var(--body-sm-medium-line-height,18px)]" style={{ fontFamily: FONT, color: ON_DARK }}>
              Pro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------- Menu item (single, active) --- */
/* A module label with the 4px gradient underline pinned to the 64px frame
 * bottom (JSON "Menu item"/"Intelligence" > "Brands" + "On" rectangle). */
function ActiveMenuLabel({ label }: { label: string }) {
  return (
    <div className="relative flex h-full items-center" data-name={label}>
      <span
        className="whitespace-nowrap text-[length:var(--body-lg-medium-size,16px)] font-medium not-italic leading-[var(--body-lg-medium-line-height,24px)]"
        style={{ color: ON_DARK }}
      >
        {label}
      </span>
      <div
        className="absolute bottom-0 left-0 h-[4px] w-full rounded-tl-[var(--radiuses-small,2px)] rounded-tr-[var(--radiuses-small,2px)]"
        style={{ background: UNDERLINE_GRADIENT }}
      />
    </div>
  );
}

/* ------------------------------------ SM variant: collapsed module menu ---- */
/* JSON "Menu item" (sm): active module label + gradient underline + caret-down,
 * collapsing the module list into a single dropdown. */
function CollapsedMenu() {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative flex h-full shrink-0 items-center" data-name="Menu item">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className="flex h-full items-center gap-[10px]"
        style={{ fontFamily: FONT }}
      >
        <ActiveMenuLabel label={ACTIVE_ITEM} />
        <CaretDown
          size={24}
          weight="regular"
          style={{ color: ON_DARK, transform: open ? "rotate(180deg)" : undefined, transition: "transform 120ms" }}
          aria-hidden
        />
      </button>

      {open && (
        <ul
          role="menu"
          className="absolute left-0 top-[calc(100%+4px)] z-50 min-w-[180px] overflow-hidden rounded-[var(--radiuses-small,2px)] bg-[var(--surface-background-lvl1,#ffffff)] py-[var(--numbers-4,4px)] shadow-lg"
          style={{ fontFamily: FONT }}
        >
          {NAV_ITEMS.map((item) => {
            const active = item === ACTIVE_ITEM;
            return (
              <li key={item} role="none">
                <button
                  role="menuitem"
                  type="button"
                  onClick={() => setOpen(false)}
                  className="flex w-full items-center px-[var(--spacing-100,8px)] py-[var(--numbers-8,8px)] text-left text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)] hover:bg-[var(--surface-background-lvl2,#f7f7fa)]"
                  style={{
                    color: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
                    fontWeight: active ? 600 : 400,
                  }}
                >
                  {item}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

/* Deterministic breakpoint hook (avoids relying on Tailwind lg: variants, which
 * were not switching reliably here). Returns true when viewport >= `minWidth`. */
function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState<boolean>(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange(); // sync immediately (handles SSR/hydration + late mount)
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}

/* --------------------------------------------------- Primary Navigation ---- */
/* Rebuilt to the Figma "Primary Navigation" COMPONENT_SET spec. Responsive via
 * a matchMedia hook (deterministic): the "large" variant (logo-left + centered
 * full module list) renders at >=1024px; the "sm" variant (collapsed module
 * dropdown + logo) renders below 1024px. Both are 64px tall on the #2b0030 MiQ
 * surface with 24px padding, space-between, sharing the same right cluster. */
function PrimaryNavigation() {
  const isLarge = useMediaQuery("(min-width: 1024px)");
  return (
    <div
      className="relative flex w-full items-center justify-between bg-[var(--surface-background-miq,#2b0030)] px-[var(--spacing-24,24px)]"
      style={{ height: PRIMARY_NAV_H }}
      data-name="Primary Navigation"
    >
      {isLarge ? (
        <>
          {/* LARGE: Sigma logo FIRST (leftmost) */}
          <div className="relative flex h-full shrink-0 items-center" data-name="Logo and tags">
            <SigmaLogo />
          </div>

          {/* LARGE: centered "Menu list" (gap 32) */}
          <nav
            aria-label="Primary modules"
            className="flex h-full min-w-0 items-center gap-[var(--spacing-400,32px)]"
            style={{ fontFamily: FONT }}
          >
            {NAV_ITEMS.map((item) => {
              const active = item === ACTIVE_ITEM;
              if (active) return <ActiveMenuLabel key={item} label={item} />;
              return (
                <div key={item} className="relative flex h-full items-center" data-name={item}>
                  <span
                    className="whitespace-nowrap text-[length:var(--body-lg-medium-size,16px)] font-medium not-italic leading-[var(--body-lg-medium-line-height,24px)]"
                    style={{ color: ON_DARK_MUTED }}
                  >
                    {item}
                  </span>
                </div>
              );
            })}
          </nav>
        </>
      ) : (
        /* SM: collapsed module dropdown + logo */
        <div className="flex h-full items-center gap-[var(--spacing-24,24px)]">
          <CollapsedMenu />
          <div className="relative flex shrink-0 items-center" data-name="Logo and tags">
            <SigmaLogo />
          </div>
        </div>
      )}

      {/* Shared right cluster */}
      <RightCluster />
    </div>
  );
}

/* ------------------------------------------------- Secondary Navigation ---- */
/* Reports module row. Anatomy/tokens and labels match the Reports variant in
 * NavigationPage.tsx SecondaryNavigation. */
function SecondaryNavigation() {
  const activeColor = "text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]";
  const regularColor = "text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)]";
  return (
    <div
      className="relative w-full bg-[var(--surface-background-lvl1,#ffffff)]"
      style={{
        height: SECONDARY_NAV_H,
        filter:
          "drop-shadow(0px 1px 2px var(--shadow-lvl8, rgba(113,113,128,0.08))) drop-shadow(0px 8px 8px var(--shadow-lvl4, rgba(113,113,128,0.04)))",
      }}
      data-name="Secondary Navigation"
    >
      <nav
        aria-label="Reports sections"
        className="absolute left-1/2 top-[calc(50%+0.5px)] flex -translate-x-1/2 -translate-y-1/2 items-center gap-[var(--spacing-24,24px)] whitespace-nowrap text-[length:var(--body-md-regular-size,14px)] not-italic leading-[var(--body-md-regular-line-height,20px)]"
        style={{ fontFamily: FONT }}
      >
        <a href="/tv-audience-intelligence" aria-current="page" className={`shrink-0 font-semibold ${activeColor}`}>
          Standard
        </a>
        <span className={`shrink-0 font-normal ${regularColor}`}>Advanced</span>
      </nav>
    </div>
  );
}

/* ------------------------------------------------------------- Page -------- */

/* ------------------------------------------ Version → renderer map --------- */
/* A version-bound renderer registry so future per-version prototype renderers
 * can plug in (keyed by version id). Unknown versions fall back to the current
 * dashboard. Version selection and current-version context remain available in
 * the collaboration overlay controls. */

type VersionRenderer = (args: {
  prototype: Prototype;
  version: PrototypeVersion;
  isNewest: boolean;
}) => JSX.Element;

const DEFAULT_RENDERER: VersionRenderer = () => <TvAudienceDashboardPage />;

const VERSION_RENDERERS: Record<string, VersionRenderer> = {
  // V4 (newest/live) = wireframe-faithful Content Planner. V3 = Content Planner
  // ideation. V1 & V2 fall back to the existing dashboard renderer (frozen).
  tvai_v3: () => <V3ContentPlanner />,
  tvai_v4: () => <V4ContentPlanner />,
};

/** The prototype body — version-aware. Consumes the version context. */
function PrototypeBody() {
  const ctx = usePrototypeVersion();
  if (!ctx) return <TvAudienceDashboardPage />;
  const render =
    VERSION_RENDERERS[ctx.viewedVersion.id] ?? DEFAULT_RENDERER;
  return render({
    prototype: ctx.prototype,
    version: ctx.viewedVersion,
    isNewest: ctx.isNewest,
  });
}

/**
 * The version-bound content region. The centered <main> IS the comment
 * coordinate root (position: relative, max-w-[1440px]): comment anchors are
 * measured against — and markers rendered inside — this exact box, so pins
 * track prototype elements on any viewport, including > 1440px where the
 * canvas is narrower than the viewport. Older (non-newest) versions render
 * interaction-disabled; comment-mode clicks still register because the layer's
 * click-capture overlay sits above the (inert) body content.
 */
function PrototypeContentRegion() {
  const ctx = usePrototypeVersion();
  const inert = ctx ? !ctx.isNewest : false;
  return (
    // <main> is the positioned canvas. The dashboard's own filter bar padding
    // uses -mx-6 / -mx-10, so mirror that px-6 / px-10 here.
    <main className="relative mx-auto w-full max-w-[1440px] px-6 pt-24 pb-8 md:px-10">
      {/* Prototype body — imported, not duplicated. Wrapped so inert styling
          applies only to the body, never to the comment layer sibling. */}
      <div
        aria-hidden={inert || undefined}
        style={inert ? { pointerEvents: "none" } : undefined}
      >
        <PrototypeBody />
      </div>

      {/* Figma-style comment layer — markers + click-capture, scoped to this
          canvas. Renders nothing without collab context (e.g. /share). */}
      <PrototypeCommentLayer />

      {/* Design Annotation layer — region drag-capture, region overlays +
          numbered markers, editor/details, scoped to this same canvas. Renders
          nothing without collab context (e.g. /share). */}
      <DesignAnnotationLayer />
    </main>
  );
}

/** The full prototype experience (header + body). Rendered as
 *  the overlay's children so it is re-mounted when the viewed version changes.
 *
 *  The Fiber navigation header is auto-hiding (floating), not sticky: at the
 *  top of the page it sits in flow; once scrolled past it floats away and only
 *  reappears on hover (slim top zone or the header) or keyboard focus.
 *
 *  The V4/V3 sticky filter bars read --tv-filter-top to sit below the header.
 *  When the header floats away, that offset becomes 0 so the filters stick to
 *  the very top of the viewport; when scrolled back to the top it restores to
 *  the header height. The floating header uses a higher z-index than the stuck
 *  filter bar (z-40), so a revealed header overlays it without pushing content. */
function TvAudienceExperience() {
  const auto = useAutoHideHeader();
  const floating = auto.mode === "floating";
  // At top → filters offset by header height; floating/hidden → offset 0.
  const filterTop = floating ? 0 : auto.headerHeight || HEADER_H;

  return (
    <div
      className="flex min-h-screen flex-col bg-[var(--surface-background-lvl2,#f7f7fa)]"
      style={{ fontFamily: FONT, ["--tv-filter-top" as string]: `${filterTop}px` }}
    >
      {/* Slim invisible hover zone pinned to the top of the viewport. Only
          matters while floating; it reveals the hidden header on hover. */}
      {floating && (
        <div
          aria-hidden
          className="fixed inset-x-0 top-0 z-[60] h-4"
          {...auto.hoverZoneHandlers}
        />
      )}

      {/* In-flow spacer. On window-scroll (this page) keep the header height so
          the document does not jump; on an inner-scroll topology collapse it to
          0 so content can reach the viewport top. */}
      {floating && auto.windowScroller && auto.headerHeight > 0 && (
        <div aria-hidden style={{ height: auto.headerHeight }} />
      )}

      {/* Full-width auto-hiding Fiber navigation header */}
      <header
        ref={auto.headerRef}
        {...auto.headerHandlers}
        className={`${floating ? "fixed left-0 right-0 top-0 z-[70]" : "relative z-50"} w-full transition-transform duration-200 ease-out`}
        style={{
          transform: `translateY(${auto.translateY})`,
          boxShadow:
            floating && auto.revealed
              ? "0px 8px 24px var(--shadow-lvl4, rgba(113,113,128,0.12))"
              : "none",
        }}
      >
        <PrimaryNavigation />
        <SecondaryNavigation />
      </header>

      <PrototypeContentRegion />
    </div>
  );
}

export default function TvAudienceApp() {
  // The overlay both PROVIDES the version context (so the experience below is
  // version-aware and re-mounts on version switch) AND renders the floating
  // collaboration controls. It looks the prototype up by route from the
  // registry; if none matches, it renders the children version-unaware. NOT
  // used on the public /share/:token view.
  return (
    <PrototypeCollabOverlay route="/tv-audience-intelligence">
      <TvAudienceExperience />
    </PrototypeCollabOverlay>
  );
}
