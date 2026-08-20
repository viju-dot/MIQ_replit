/* =========================================================================
 * TV Audience Intelligence — STANDALONE product page (/tv-audience-intelligence)
 *
 * Rendered OUTSIDE the design-system explorer (no explorer sidebar). It provides
 * a proper Fiber navigation header (Primary Navigation + Secondary Navigation
 * "Intelligence" module) and then renders the existing dashboard body.
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
import { Translate, CaretDown } from "@phosphor-icons/react";
import { useTheme } from "@/lib/theme";
import TvAudienceDashboardPage from "@/pages/ds/TvAudienceDashboardPage";
import { PrototypeCollabOverlay } from "@/components/PrototypeCollabOverlay";
import { usePrototypeVersion } from "@/lib/prototypeVersionContext";
import type { PrototypeVersion, Prototype } from "@/lib/prototypeStore";

const A = "/figmaAssets/navigation";
const FONT = '"DM Sans", Helvetica';

// Per the Figma "Primary Navigation" COMPONENT_SET both variants are 64px tall.
const PRIMARY_NAV_H = 64;
const SECONDARY_NAV_H = 56;
const HEADER_H = PRIMARY_NAV_H + SECONDARY_NAV_H; // 120px total sticky header

// Center nav modules. "Audiences" is the ACTIVE item (matches the Figma spec).
const NAV_ITEMS = ["Intelligence", "Audiences", "Creatives", "Campaigns", "Reports"] as const;
const ACTIVE_ITEM: (typeof NAV_ITEMS)[number] = "Audiences";

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

/* ------------------------------------------------ Language selector -------- */
/* JSON: 122×34, radius 2, bg rgba(255,255,255,0.2), padding 12/4, gap 8;
 * translate icon 20 + "English" (DM Sans Regular 14/20 white) + caret-down 20. */
function LanguageSelector() {
  return (
    <button
      type="button"
      aria-label="Language: English"
      className="relative flex h-[34px] shrink-0 items-center justify-center gap-[var(--numbers-8,8px)] rounded-[var(--radiuses-small,2px)] bg-[rgba(255,255,255,0.2)] px-[var(--numbers-12,12px)] py-[var(--numbers-4,4px)] transition-colors hover:bg-[rgba(255,255,255,0.3)]"
      style={{ fontFamily: FONT }}
      data-name="language"
    >
      <span className="relative flex items-center gap-[var(--numbers-4,4px)]">
        <Translate size={20} weight="regular" style={{ color: ON_DARK }} aria-hidden />
        <span className="whitespace-nowrap text-[length:var(--body-md-regular-size,14px)] font-normal not-italic leading-[var(--body-md-regular-line-height,20px)]" style={{ color: ON_DARK }}>
          English
        </span>
      </span>
      <CaretDown size={20} weight="regular" style={{ color: ON_DARK }} aria-hidden />
    </button>
  );
}

/* The right-hand cluster, per user request: theme toggle, language selector,
 * diamond, avatar (gap 20). Search/flask/bell/heart removed. */
function RightCluster() {
  return (
    <div className="relative flex shrink-0 items-center justify-end gap-[20px]" data-name="right">
      <ThemeToggle />

      <LanguageSelector />

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
/* Intelligence module row with "TV Audience Intelligence" as active item.
 * Anatomy/tokens copied from NavigationPage.tsx SecondaryNavigation. */
function StandardBadge({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex h-[18px] shrink-0 items-center justify-center gap-[var(--numbers-2,2px)] rounded-[var(--radiuses-small,2px)] bg-[var(--container-dynamic-neutral-bold-background-default,#4b4b59)] px-[3px] py-0">
      <p className="whitespace-nowrap text-center text-[length:var(--body-sm-medium-size,12px)] font-medium not-italic leading-[var(--body-sm-medium-line-height,18px)] text-[var(--container-dynamic-neutral-bold-foreground-default,#ffffff)]" style={{ fontFamily: FONT }}>
        {children}
      </p>
    </div>
  );
}

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
        aria-label="Intelligence sections"
        className="absolute left-1/2 top-[calc(50%+0.5px)] flex -translate-x-1/2 -translate-y-1/2 items-center gap-[var(--spacing-24,24px)] whitespace-nowrap text-[length:var(--body-md-regular-size,14px)] not-italic leading-[var(--body-md-regular-line-height,20px)]"
        style={{ fontFamily: FONT }}
      >
        <a href="/tv-audience-intelligence" aria-current="page" className={`shrink-0 font-semibold ${activeColor}`}>
          TV Audience Intelligence
        </a>
        <span className={`shrink-0 font-normal ${regularColor}`}>Watching</span>
        <span className="relative flex shrink-0 items-center gap-[var(--numbers-8,8px)]">
          <span className={`shrink-0 font-normal ${regularColor}`}>Browsing</span>
          <StandardBadge>Beta</StandardBadge>
        </span>
        <span className={`shrink-0 font-normal ${regularColor}`}>Buying</span>
      </nav>
    </div>
  );
}

/* ------------------------------------------------------------- Page -------- */

/* ---------------------------------------------------- Version strip -------- */
/* A version-context strip rendered INSIDE the prototype (under its own nav) so
 * switching versions visibly changes the prototype itself, not just the
 * floating chip. Older versions show their FROZEN snapshot values; the newest
 * version shows the live prototype values. */

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const STATUS_STYLE: Record<string, { bg: string; fg: string }> = {
  Live: {
    bg: "var(--container-dynamic-success-subtle-background-default,#e7faef)",
    fg: "var(--container-dynamic-success-subtle-foreground-default,#1e8158)",
  },
  Draft: {
    bg: "var(--container-dynamic-neutral-subtle-background-hover,#71718014)",
    fg: "var(--surface-foreground-static-neutral-lvl3,#717180)",
  },
  Archived: {
    bg: "var(--container-dynamic-neutral-subtle-background-hover,#71718014)",
    fg: "var(--surface-foreground-static-neutral-lvl3,#717180)",
  },
};

function VersionContextStrip() {
  const ctx = usePrototypeVersion();
  // Rendered version-unaware (e.g. the /share view) → no strip.
  if (!ctx) return null;

  const { prototype, viewedVersion, isNewest } = ctx;
  // Newest = live prototype values; older = frozen snapshot values.
  const description = isNewest
    ? prototype.description
    : viewedVersion.snapshot?.description ||
      viewedVersion.description ||
      prototype.description;
  const status = isNewest
    ? prototype.status
    : viewedVersion.snapshot?.status || prototype.status;
  const st = STATUS_STYLE[status] ?? STATUS_STYLE.Draft;

  return (
    <div
      className="w-full border-b border-solid"
      style={{
        backgroundColor: "var(--surface-background-lvl1,#ffffff)",
        borderColor: "var(--border-static-subtle-neutral,#e1e1e8)",
      }}
      aria-label="Prototype version context"
    >
      <div className="mx-auto flex w-full max-w-[1440px] flex-col gap-2 px-6 py-3 md:flex-row md:items-center md:justify-between md:px-10">
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-semibold"
            style={{
              backgroundColor:
                "var(--container-dynamic-brand-subtle-background-default,#f6ebff)",
              color: "var(--surface-foreground-dynamic-brand-default,#7c33b5)",
            }}
          >
            {viewedVersion.name}
          </span>
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium"
            style={{ backgroundColor: st.bg, color: st.fg }}
          >
            {status}
          </span>
          {isNewest ? (
            <span
              className="text-[12px] font-medium"
              style={{ color: "var(--surface-foreground-static-neutral-lvl3,#717180)" }}
            >
              Live · current
            </span>
          ) : (
            <span
              className="text-[12px] font-medium"
              style={{ color: "var(--surface-foreground-static-neutral-lvl3,#717180)" }}
            >
              Snapshot · {fmtDate(viewedVersion.createdAt)}
            </span>
          )}
        </div>
        <p
          className="min-w-0 truncate text-[length:var(--body-md-regular-size,14px)]"
          style={{
            color: "var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)",
          }}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------ Version → renderer map --------- */
/* A version-bound renderer registry so future per-version prototype renderers
 * can plug in (keyed by version id). Unknown versions fall back to the current
 * dashboard. The version-aware strip above communicates which version's
 * (frozen or live) values are in effect. */

type VersionRenderer = (args: {
  prototype: Prototype;
  version: PrototypeVersion;
  isNewest: boolean;
}) => JSX.Element;

const DEFAULT_RENDERER: VersionRenderer = () => <TvAudienceDashboardPage />;

const VERSION_RENDERERS: Record<string, VersionRenderer> = {
  // e.g. "tvai_v1": () => <TvAudienceDashboardPageV1 />,
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

/** The full prototype experience (header + version strip + body). Rendered as
 *  the overlay's children so it is re-mounted when the viewed version changes. */
function TvAudienceExperience() {
  return (
    <div
      className="flex min-h-screen flex-col bg-[var(--surface-background-lvl2,#f7f7fa)]"
      style={{ fontFamily: FONT, ["--tv-filter-top" as string]: `${HEADER_H}px` }}
    >
      {/* Full-width sticky Fiber navigation header */}
      <header className="sticky top-0 z-50 w-full">
        <PrimaryNavigation />
        <SecondaryNavigation />
        {/* Version-context strip lives directly under the prototype's own nav. */}
        <VersionContextStrip />
      </header>

      {/* Dashboard body — imported, not duplicated. The dashboard's own filter
          bar padding uses -mx-6 / -mx-10, so mirror that px-6 / px-10 here. */}
      <main className="mx-auto w-full max-w-[1440px] px-6 py-8 md:px-10">
        <PrototypeBody />
      </main>
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
