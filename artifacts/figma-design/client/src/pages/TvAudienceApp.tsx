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

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import TvAudienceDashboardPage from "@/pages/ds/TvAudienceDashboardPage";

const A = "/figmaAssets/navigation";
const FONT = '"DM Sans", Helvetica';

const PRIMARY_NAV_H = 64;
const SECONDARY_NAV_H = 56;
const HEADER_H = PRIMARY_NAV_H + SECONDARY_NAV_H; // 120px total sticky header

/* ---------------------------------------------------------- Sigma Logo ----- */
/* Copied verbatim from NavigationPage.tsx SigmaLogo anatomy. */
function SigmaLogo() {
  return (
    <div className="relative size-[24px] overflow-clip" data-name="Sigma Logo">
      <div className="absolute bottom-[7.5%] left-1/2 top-[7.5%] aspect-[249/300] -translate-x-1/2">
        <div className="absolute inset-[0_0.26%_0_0.05%]">
          <div className="absolute inset-[0_0.26%_0_0.05%]">
            <div className="absolute inset-[-151.64%_-112.65%_-135.3%_-149.22%]">
              <div
                className="absolute inset-[0_0_0_0.05%]"
                style={{
                  maskImage: `url("${A}/pn-logo-mask.svg")`,
                  maskRepeat: "no-repeat",
                  maskPosition: "0px -0.002px",
                  maskSize: "281.134px 340px",
                }}
              >
                <img alt="" className="absolute inset-0 block size-full max-w-none" src={`${A}/pn-logo-1.svg`} />
              </div>
              <div className="absolute inset-[-151.64%_-112.65%_-0.66%_-89.46%] flex items-center justify-center" style={{ containerType: "size" }}>
                <div className="h-[100cqw] w-[100cqh] flex-none -rotate-90">
                  <div
                    className="relative size-full"
                    style={{
                      maskImage: `url("${A}/pn-logo-mask.svg")`,
                      maskRepeat: "no-repeat",
                      maskPosition: "252.416px 515.579px",
                      maskSize: "281.134px 340px",
                    }}
                  >
                    <img alt="" className="absolute inset-0 block size-full max-w-none" src={`${A}/pn-logo-2.svg`} />
                  </div>
                </div>
              </div>
              <div
                className="absolute inset-[45.14%_236.65%_49.83%_-149.22%]"
                style={{
                  maskImage: `url("${A}/pn-logo-mask.svg")`,
                  maskRepeat: "no-repeat",
                  maskPosition: "420.924px -153.482px",
                  maskSize: "281.134px 340px",
                }}
              >
                <img alt="" className="absolute inset-0 block size-full max-w-none" src={`${A}/pn-logo-3.svg`} />
              </div>
              <div className="absolute inset-[202.06%_77.9%_-135.3%_-46.04%] mix-blend-multiply">
                <div
                  className="absolute inset-[202.06%_77.9%_-135.3%_-46.04%] opacity-60 mix-blend-multiply"
                  style={{
                    maskImage: `url("${A}/pn-logo-mask.svg")`,
                    maskRepeat: "no-repeat",
                    maskPosition: "129.968px -687px",
                    maskSize: "281.134px 340px",
                  }}
                >
                  <img alt="" className="absolute inset-0 block size-full max-w-none" src={`${A}/pn-logo-4.svg`} />
                </div>
              </div>
              <div className="absolute inset-[168.82%_77.9%_-102.06%_-46.04%] mix-blend-multiply">
                <div
                  className="absolute inset-[168.82%_77.9%_-102.06%_-46.04%] opacity-60 mix-blend-multiply"
                  style={{
                    maskImage: `url("${A}/pn-logo-mask.svg")`,
                    maskRepeat: "no-repeat",
                    maskPosition: "129.968px -573.984px",
                    maskSize: "281.134px 340px",
                  }}
                >
                  <img alt="" className="absolute inset-0 block size-full max-w-none" src={`${A}/pn-logo-5.svg`} />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-[16.76%] left-[0.05%] right-[31.81%] top-1/2 mix-blend-multiply">
            <div className="absolute bottom-[16.76%] left-[0.05%] right-[31.81%] top-1/2 opacity-60 mix-blend-multiply">
              <img alt="" className="absolute inset-0 block size-full max-w-none" src={`${A}/pn-logo-6.svg`} />
            </div>
          </div>
          <div className="absolute bottom-1/2 left-[0.05%] right-[31.81%] top-[16.75%] mix-blend-multiply">
            <div className="absolute bottom-1/2 left-[0.05%] right-[31.81%] top-[16.75%] opacity-60 mix-blend-multiply">
              <img alt="" className="absolute inset-0 block size-full max-w-none" src={`${A}/pn-logo-7.svg`} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------- Theme toggle ------ */
/* Light/Dark switch wired to the app-wide ThemeProvider (useTheme). Styled to
 * sit on the dark MiQ primary bar. */
function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const dark = theme === "dark";
  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="flex h-[var(--height-34,34px)] items-center gap-[var(--numbers-8,8px)] rounded-[var(--radiuses-small,2px)] bg-[rgba(255,255,255,0.2)] px-[var(--numbers-12,12px)] py-[var(--numbers-4,4px)] transition-colors hover:bg-[rgba(255,255,255,0.3)]"
      style={{ fontFamily: FONT }}
    >
      {dark ? (
        <Moon className="h-4 w-4 text-[var(--container-dynamic-brand-bold-foreground-default,#ffffff)]" aria-hidden />
      ) : (
        <Sun className="h-4 w-4 text-[var(--container-dynamic-brand-bold-foreground-default,#ffffff)]" aria-hidden />
      )}
      <span className="whitespace-nowrap text-[length:var(--body-md-regular-size,14px)] font-normal leading-[var(--body-md-regular-line-height,20px)] text-[var(--container-dynamic-brand-bold-foreground-default,#ffffff)]">
        {dark ? "Dark" : "Light"}
      </span>
    </button>
  );
}

/* --------------------------------------------------- Primary Navigation ---- */
/* Anatomy copied from NavigationPage.tsx PrimaryNavigation. */
function PrimaryNavigation() {
  return (
    <div
      className="relative flex w-full items-center justify-between bg-[var(--surface-background-miq,#2b0030)] p-[var(--spacing-24,24px)]"
      style={{ height: PRIMARY_NAV_H }}
      data-name="Primary Navigation"
    >
      {/* Active module (Intelligence) with gradient underline */}
      <div className="relative flex shrink-0 items-center gap-0" data-name="Menu item">
        <div className="relative flex h-[64px] shrink-0 items-center justify-center gap-[32px]" data-name="Menu">
          <div className="relative flex h-full items-center px-[var(--numbers-4,4px)]" data-name="Intelligence">
            <p className="whitespace-nowrap text-[length:var(--body-lg-medium-size,16px)] font-medium not-italic leading-[var(--body-lg-medium-line-height,24px)] text-[var(--container-dynamic-brand-bold-foreground-default,#ffffff)]" style={{ fontFamily: FONT }}>
              Intelligence
            </p>
            <div className="absolute bottom-0 left-1/2 h-[4px] w-full -translate-x-1/2 rounded-tl-[var(--radiuses-small,2px)] rounded-tr-[var(--radiuses-small,2px)] bg-gradient-to-r from-[var(--gradients-sigma-1,#d71982)] via-[var(--gradients-sigma-2,#ff540c)] to-[var(--gradients-sigma-3,#dad310)] from-[25.521%] via-[59.375%]" />
          </div>
        </div>
      </div>

      {/* Centered Sigma logo */}
      <div className="relative flex shrink-0 items-center gap-[16px]" data-name="Logo and tags">
        <SigmaLogo />
      </div>

      {/* Right cluster: theme toggle + diamond + avatar */}
      <div className="relative flex shrink-0 items-center justify-end gap-[20px]" data-name="right">
        <ThemeToggle />

        <div className="relative size-[24px] shrink-0" data-name="Single Diamond">
          <div className="absolute left-1/2 top-1/2 size-[20px] -translate-x-1/2 -translate-y-1/2">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={`${A}/pn-diamond.svg`} />
          </div>
        </div>

        {/* Avatar (initials + Pro+ badge) */}
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
              <div className="relative flex h-[18px] shrink-0 items-center justify-center gap-[var(--numbers-4,4px)] rounded-[100px] bg-gradient-to-r from-[var(--gradients-sigma-1,#d71982)] via-[var(--gradients-sigma-2,#ff540c)] to-[var(--gradients-sigma-3,#f0e812)] from-[25.521%] via-[59.375%] px-[var(--numbers-8,8px)] py-[var(--numbers-2,2px)]">
                <p className="whitespace-nowrap text-center text-[length:var(--body-sm-medium-size,12px)] font-medium not-italic leading-[var(--body-sm-medium-line-height,18px)] text-[var(--container-static-brand-bold-foreground,#ffffff)]" style={{ fontFamily: FONT }}>
                  Pro+
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
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
        className="absolute left-[var(--spacing-24,24px)] top-1/2 flex -translate-y-1/2 items-center gap-[var(--spacing-24,24px)] whitespace-nowrap text-[length:var(--body-md-regular-size,14px)] not-italic leading-[var(--body-md-regular-line-height,20px)]"
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

export default function TvAudienceApp() {
  return (
    <div
      className="flex min-h-screen flex-col bg-[var(--surface-background-lvl2,#f7f7fa)]"
      style={{ fontFamily: FONT, ["--tv-filter-top" as string]: `${HEADER_H}px` }}
    >
      {/* Full-width sticky Fiber navigation header */}
      <header className="sticky top-0 z-50 w-full">
        <PrimaryNavigation />
        <SecondaryNavigation />
      </header>

      {/* Dashboard body — imported, not duplicated. The dashboard's own filter
          bar padding uses -mx-6 / -mx-10, so mirror that px-6 / px-10 here. */}
      <main className="mx-auto w-full max-w-[1440px] px-6 py-8 md:px-10">
        <TvAudienceDashboardPage />
      </main>
    </div>
  );
}
