/* =========================================================================
 * Fiber Screen Templates — shared product chrome
 *
 * Two faithful shared components reproduced from the harvested Figma
 * reference code (design-refs/screen-templates/code/*.txt). Every LIVE template
 * screen composes these around its body content:
 *
 *   <TemplateNavigation activeItem="Audiences" />   ← 120px top region
 *   … screen body …
 *   <TemplateFooter primaryLabel="Continue" />      ← 66px Footer - Page
 *
 * The nav shell is identical across all 8 screens (dark MIQ Primary Navigation
 * bar over a light Secondary Navigation bar). The footer shell is identical
 * too; only the two action-button labels differ per screen, so they are props.
 * Some screens hide the footer — those screens simply don't render it.
 *
 * COLOR CONVENTION: token color values are inline styles as var(--token,
 * fallbackHex) (hex fallbacks taken from the reference code). Spacing / radius /
 * typography use literal px so the fixed-width screens render pixel-faithfully.
 * Assets are referenced as `${import.meta.env.BASE_URL}figmaAssets/...`
 * (BASE_URL includes the trailing slash).
 * ========================================================================= */

import { type CSSProperties } from "react";

/** Shared asset base for the chrome (harvested with the 60141 screen). */
const ASSET_BASE = `${import.meta.env.BASE_URL}figmaAssets/screen-templates/60141-191669/`;

// The clean, self-contained Sigma lettermark path (used as a CSS mask so it can
// be painted white on the dark navigation bar).
const LOGO_MASK = `${ASSET_BASE}b8a4c7aa-df5d-4cb6-8f68-217ef629d164.svg`;
// Language "translate" glyph + caret from the reference nav.
const IMG_TRANSLATE = `${ASSET_BASE}ffa46307-9727-40f4-995e-d30179427b36.svg`;
const IMG_CARET = `${ASSET_BASE}0219cd14-84bb-4da7-bb31-d16421c319ed.svg`;
const IMG_AVATAR = `${ASSET_BASE}37aa3711-3cb4-437b-94ce-d17565b9fb17.svg`;

// Token color values (var(--token, fallbackHex)) — fallbacks from reference.
const C = {
  navBg: "var(--surface-background-miq,#2b0030)",
  surfaceLvl1: "var(--surface-background-lvl1,#ffffff)",
  navInactive: "var(--surface-foreground-dynamic-neutral-inversed-default-variation,rgba(255,255,255,0.8))",
  navActive: "var(--surface-foreground-dynamic-neutral-inversed-selected,#ffffff)",
  navItemDivider: "rgba(255,255,255,0.2)",
  textNeutralLvl1: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
  secondaryActive: "var(--surface-foreground-dynamic-neutral-default-variation,#13131a)",
  secondaryRegular: "var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)",
  footerBg: "var(--surface-background-lvl1,#ffffff)",
  btnSecondaryBorder: "var(--border-dynamic-neutral-bold-default,#4b4b59)",
  btnSecondaryFg: "var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)",
  btnPrimaryBg: "var(--container-dynamic-brand-bold-background-default,#7c33b5)",
  btnPrimaryFg: "var(--container-dynamic-brand-bold-foreground-default,#ffffff)",
  brandGradient: "linear-gradient(90deg,#d71982 25.5%,#ff540c 59.4%,#f0e812 100%)",
};

const FONT = '"DM Sans", sans-serif';

/* ---------------------------------------------------------------------- */
/* TemplateNavigation                                                      */
/* ---------------------------------------------------------------------- */

/** Primary product nav labels (MIQ Sigma app), left → right. */
const PRIMARY_ITEMS = [
  "Intelligence",
  "Audiences",
  "Creatives",
  "Campaigns",
  "Reports",
] as const;
export type PrimaryNavItem = (typeof PRIMARY_ITEMS)[number];

/** Secondary nav labels shown under the primary bar. */
const SECONDARY_ITEMS = ["My audience", "Saved audiences", "Monitor"] as const;

export interface TemplateNavigationProps {
  /**
   * The active primary nav item. Defaults to "Audiences" (as in the reference
   * frames). The active item gets the brand gradient underline + brighter text.
   */
  activeItem?: PrimaryNavItem;
  className?: string;
}

/**
 * The 120px-tall "Navigation" region reproduced from the reference code:
 * a dark MIQ Primary Navigation bar (64px) over a light Secondary Navigation
 * bar (56px).
 */
export function TemplateNavigation({
  activeItem = "Audiences",
  className,
}: TemplateNavigationProps) {
  return (
    <div className={`flex w-full flex-col items-start ${className ?? ""}`}>
      {/* Primary Navigation (dark MIQ bar, 64px) */}
      <div
        className="flex h-[64px] w-full items-center justify-between p-[24px]"
        style={{ backgroundColor: C.navBg }}
      >
        {/* Logo */}
        <div className="flex shrink-0 items-center gap-[16px]">
          <span
            aria-label="Sigma"
            role="img"
            className="block size-[24px] shrink-0"
            style={{
              backgroundColor: C.navActive,
              WebkitMaskImage: `url("${LOGO_MASK}")`,
              maskImage: `url("${LOGO_MASK}")`,
              WebkitMaskRepeat: "no-repeat",
              maskRepeat: "no-repeat",
              WebkitMaskPosition: "center",
              maskPosition: "center",
              WebkitMaskSize: "contain",
              maskSize: "contain",
            }}
          />
        </div>

        {/* Menu list */}
        <nav
          aria-label="Primary"
          className="flex h-[64px] shrink-0 items-center justify-center gap-[32px]"
        >
          {PRIMARY_ITEMS.map((label) => {
            const active = label === activeItem;
            return (
              <div key={label} className="relative flex h-full items-center">
                <span
                  className="whitespace-nowrap text-[16px] font-medium leading-[24px]"
                  style={{ color: active ? C.navActive : C.navInactive }}
                >
                  {label}
                </span>
                {active && (
                  <span
                    aria-hidden="true"
                    className="absolute bottom-0 left-0 h-[4px] w-full rounded-t-[2px]"
                    style={{ backgroundImage: C.brandGradient }}
                  />
                )}
              </div>
            );
          })}
        </nav>

        {/* Right cluster: language + diamond + avatar */}
        <div className="flex shrink-0 items-center justify-end gap-[20px]">
          <div
            className="flex h-[34px] items-center justify-center gap-[8px] rounded-[2px] px-[12px] py-[4px]"
            style={{ backgroundColor: C.navItemDivider }}
          >
            <span className="flex size-[20px] items-center justify-center p-[2px]">
              <img
                alt=""
                aria-hidden="true"
                src={IMG_TRANSLATE}
                className="h-[15.625px] w-[17.5px]"
              />
            </span>
            <span
              className="whitespace-nowrap text-[14px] leading-[20px]"
              style={{ color: C.navActive }}
            >
              English
            </span>
            <img alt="" aria-hidden="true" src={IMG_CARET} className="size-[20px]" />
          </div>
          <div className="relative size-[42px] shrink-0 overflow-hidden">
            <span className="absolute left-1/2 top-0 size-[32px] -translate-x-1/2">
              <img alt="" aria-hidden="true" src={IMG_AVATAR} className="size-[32px]" />
              <span
                className="absolute right-0 top-[7px] whitespace-nowrap text-[14px] font-medium"
                style={{ color: C.textNeutralLvl1 }}
              >
                JS
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Secondary Navigation (light bar, 56px) */}
      <div
        className="flex h-[56px] w-full items-center"
        style={{
          backgroundColor: C.surfaceLvl1,
          boxShadow:
            "0px 1px 2px rgba(113,113,128,0.08), 0px 8px 8px rgba(113,113,128,0.04)",
        }}
      >
        <nav
          aria-label="Secondary"
          className="flex items-center gap-[24px] pl-[24px]"
        >
          {SECONDARY_ITEMS.map((label, i) => (
            <span
              key={label}
              className="whitespace-nowrap text-[14px] leading-[20px]"
              style={{
                color: i === 0 ? C.secondaryActive : C.secondaryRegular,
                fontWeight: i === 0 ? 600 : 400,
              }}
            >
              {label}
            </span>
          ))}
        </nav>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* TemplateFooter                                                          */
/* ---------------------------------------------------------------------- */

export interface TemplateFooterProps {
  /** Secondary (outlined) button label. Default "Back". */
  secondaryLabel?: string;
  /** Primary (brand) button label. Default "Continue". */
  primaryLabel?: string;
  /**
   * Horizontal screen margin in px for the actions row. 64 for 1280px screens,
   * 32 for the 1024px screen. Default 64.
   */
  screenMargin?: number;
  className?: string;
}

/**
 * The "Footer - Page" region reproduced from the reference code: a 66px white
 * bar with a top drop-shadow, right-aligned Back / primary action buttons.
 * Screens that hide the footer simply don't render this component.
 */
export function TemplateFooter({
  secondaryLabel = "Back",
  primaryLabel = "Continue",
  screenMargin = 64,
  className,
}: TemplateFooterProps) {
  const rowStyle: CSSProperties = {
    paddingLeft: screenMargin,
    paddingRight: screenMargin,
  };
  return (
    <div
      className={`flex h-[66px] w-full flex-wrap items-center justify-center gap-y-[16px] ${className ?? ""}`}
      style={{
        backgroundColor: C.footerBg,
        boxShadow:
          "0px -1px 2px rgba(113,113,128,0.12), 0px -8px 8px rgba(113,113,128,0.08)",
        fontFamily: FONT,
      }}
    >
      <div
        className="flex min-w-0 flex-1 items-center justify-end gap-[16px] py-[16px]"
        style={rowStyle}
      >
        {/* Secondary (outlined) button */}
        <span
          className="flex items-center justify-end rounded-[2px] border border-solid px-[12px] py-[7px]"
          style={{ borderColor: C.btnSecondaryBorder }}
        >
          <span
            className="whitespace-nowrap text-center text-[14px] font-medium leading-[20px]"
            style={{ color: C.btnSecondaryFg }}
          >
            {secondaryLabel}
          </span>
        </span>
        {/* Primary (brand) button */}
        <span
          className="flex items-center justify-end rounded-[2px] px-[12px] py-[7px]"
          style={{ backgroundColor: C.btnPrimaryBg }}
        >
          <span
            className="whitespace-nowrap text-center text-[14px] font-medium leading-[20px]"
            style={{ color: C.btnPrimaryFg }}
          >
            {primaryLabel}
          </span>
        </span>
      </div>
    </div>
  );
}
