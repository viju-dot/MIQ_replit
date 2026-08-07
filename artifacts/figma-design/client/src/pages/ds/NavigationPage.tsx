import { useLayoutEffect, useRef, useState } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

const A = "/figmaAssets/navigation";

/* ------------------------------------------------------------------ */
/* Sigma Logo (Primary Navigation)                                     */
/* ------------------------------------------------------------------ */

function SigmaLogo(): JSX.Element {
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
                <img
                  alt=""
                  className="absolute inset-0 block size-full max-w-none"
                  src={`${A}/pn-logo-1.svg`}
                />
              </div>
              <div
                className="absolute inset-[-151.64%_-112.65%_-0.66%_-89.46%] flex items-center justify-center"
                style={{ containerType: "size" }}
              >
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
                    <img
                      alt=""
                      className="absolute inset-0 block size-full max-w-none"
                      src={`${A}/pn-logo-2.svg`}
                    />
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
                <img
                  alt=""
                  className="absolute inset-0 block size-full max-w-none"
                  src={`${A}/pn-logo-3.svg`}
                />
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
                  <img
                    alt=""
                    className="absolute inset-0 block size-full max-w-none"
                    src={`${A}/pn-logo-4.svg`}
                  />
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
                  <img
                    alt=""
                    className="absolute inset-0 block size-full max-w-none"
                    src={`${A}/pn-logo-5.svg`}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="absolute bottom-[16.76%] left-[0.05%] right-[31.81%] top-1/2 mix-blend-multiply">
            <div className="absolute bottom-[16.76%] left-[0.05%] right-[31.81%] top-1/2 opacity-60 mix-blend-multiply">
              <img
                alt=""
                className="absolute inset-0 block size-full max-w-none"
                src={`${A}/pn-logo-6.svg`}
              />
            </div>
          </div>
          <div className="absolute bottom-1/2 left-[0.05%] right-[31.81%] top-[16.75%] mix-blend-multiply">
            <div className="absolute bottom-1/2 left-[0.05%] right-[31.81%] top-[16.75%] opacity-60 mix-blend-multiply">
              <img
                alt=""
                className="absolute inset-0 block size-full max-w-none"
                src={`${A}/pn-logo-7.svg`}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Primary Navigation                                                  */
/* Figma: State=Default, Menu=False — 1440x64                          */
/* ------------------------------------------------------------------ */

function PrimaryNavigation({
  activeLabel,
  showMenuCaret,
  language,
}: {
  activeLabel: string;
  showMenuCaret: boolean;
  language: string;
}): JSX.Element {
  return (
    <div className="relative flex h-[64px] w-full items-center justify-between bg-[var(--surface-background-miq,#2b0030)] p-[var(--spacing-24,24px)]" data-name="Primary Navigation">
      {/* Menu item (Intelligence) */}
      <div className="relative flex shrink-0 items-center gap-0" data-name="Menu item">
        <div className="relative flex h-[64px] shrink-0 items-center justify-center gap-[32px]" data-name="Menu">
          <div className="relative h-full w-[100px]" data-name="Intelligence">
            <p className="absolute left-[calc(50%-43.23px)] top-[calc(50%-10px)] whitespace-nowrap text-[length:var(--body-lg-medium-size,16px)] font-medium not-italic leading-[var(--body-lg-medium-line-height,24px)] text-[var(--container-dynamic-brand-bold-foreground-default,#ffffff)]">
              {activeLabel}
            </p>
            <div className="absolute bottom-0 left-[calc(50%-1px)] h-[4px] w-[100px] -translate-x-1/2 rounded-tl-[var(--radiuses-small,2px)] rounded-tr-[var(--radiuses-small,2px)] bg-gradient-to-r from-[var(--gradients-sigma-1,#d71982)] via-[var(--gradients-sigma-2,#ff540c)] to-[var(--gradients-sigma-3,#dad310)] from-[25.521%] via-[59.375%]" />
          </div>
        </div>
        {showMenuCaret && (
          <div className="flex flex-row items-center self-stretch">
            <div className="relative flex h-full w-[24px] shrink-0 items-center justify-center px-[4px] pb-[2px] pt-[6px]" data-name="Icon/caret">
              <div className="relative size-[24px] shrink-0">
                <img
                  alt=""
                  className="absolute inset-0 block size-full max-w-none"
                  src={`${A}/pn-caret.svg`}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logo (centered) */}
      <div className="relative flex shrink-0 items-center gap-[16px]" data-name="Logo and tags">
        <SigmaLogo />
      </div>

      {/* Right side */}
      <div className="relative flex shrink-0 items-center justify-end gap-[20px]" data-name="right">
        <div className="relative flex h-[var(--height-34,34px)] shrink-0 items-center justify-center gap-[var(--numbers-8,8px)] rounded-[var(--radiuses-small,2px)] bg-[rgba(255,255,255,0.2)] px-[var(--numbers-12,12px)] py-[var(--numbers-4,4px)]" data-name="language">
          <div className="relative flex shrink-0 items-center gap-[4px]">
            <div className="relative flex size-[20px] shrink-0 items-center justify-center overflow-clip p-[2px]" data-name="Icon/translate">
              <div className="relative h-[15.625px] w-[17.5px] shrink-0">
                <img
                  alt=""
                  className="absolute inset-0 block size-full max-w-none"
                  src={`${A}/pn-translate.svg`}
                />
              </div>
            </div>
            <p className="whitespace-nowrap text-[length:var(--body-md-regular-size,14px)] font-normal not-italic leading-[var(--body-md-regular-line-height,20px)] text-[var(--container-dynamic-brand-bold-foreground-default,#ffffff)]">
              {language}
            </p>
          </div>
          <div className="relative flex size-[20px] shrink-0 items-center justify-center" data-name="Icon/caret">
            <div className="relative size-[20px] shrink-0">
              <img
                alt=""
                className="absolute inset-0 block size-full max-w-none"
                src={`${A}/pn-lang-caret.svg`}
              />
            </div>
          </div>
        </div>

        {/* Single diamond */}
        <div className="relative size-[24px] shrink-0" data-name="Single Diamond">
          <div className="absolute left-1/2 top-1/2 size-[20px] -translate-x-1/2 -translate-y-1/2">
            <img
              alt=""
              className="absolute inset-0 block size-full max-w-none"
              src={`${A}/pn-diamond.svg`}
            />
          </div>
        </div>

        {/* Avatar (Initials + Pro+ badge) */}
        <div className="relative flex shrink-0 items-center overflow-clip px-[3px]" data-name="Avatar">
          <div className="relative h-[40px] w-[36px] shrink-0">
            <div className="absolute left-1/2 top-0 size-[32px] -translate-x-1/2" data-name="Initials">
              <div className="absolute left-0 top-0 size-[32px]">
                <img
                  alt=""
                  className="absolute inset-0 block size-full max-w-none"
                  src={`${A}/pn-avatar-ellipse.svg`}
                />
              </div>
              <p className="absolute left-[calc(50%+8px)] top-[7px] -translate-x-full whitespace-nowrap text-right text-[length:var(--body-md-medium-size,14px)] font-medium not-italic leading-normal text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]">
                JS
              </p>
            </div>
            <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-start" data-name="Badge/rounded">
              <div className="relative flex h-[18px] shrink-0 items-start">
                <div className="relative flex h-[18px] shrink-0 items-center justify-center gap-[var(--numbers-4,4px)] rounded-[100px] bg-gradient-to-r from-[var(--gradients-sigma-1,#d71982)] via-[var(--gradients-sigma-2,#ff540c)] to-[var(--gradients-sigma-3,#f0e812)] from-[25.521%] via-[59.375%] px-[var(--numbers-8,8px)] py-[var(--numbers-2,2px)]">
                  <p className="whitespace-nowrap text-center text-[length:var(--body-sm-medium-size,12px)] font-medium not-italic leading-[var(--body-sm-medium-line-height,18px)] text-[var(--container-static-brand-bold-foreground,#ffffff)]">
                    Pro+
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Secondary Navigation                                                */
/* Figma component set: Module=Audiences|Intelligence|Campaigns|       */
/* Reports|Creatives — 1440x56                                         */
/* ------------------------------------------------------------------ */

type Module =
  | "Audiences"
  | "Intelligence"
  | "Campaigns"
  | "Reports"
  | "Creatives";

const SECONDARY_ITEMS: Record<Module, { label: string; active?: boolean }[]> = {
  Audiences: [
    { label: "My audience", active: true },
    { label: "Saved audiences" },
    { label: "Monitor" },
  ],
  Campaigns: [
    { label: "Overview", active: true },
    { label: "Bookings" },
    { label: "Setup" },
    { label: "Resources" },
  ],
  Reports: [
    { label: "Standard", active: true },
    { label: "Advanced" },
  ],
  Creatives: [
    { label: "Showcase", active: true },
    { label: "Resources" },
    { label: "Mocks" },
    { label: "Favorites" },
  ],
  Intelligence: [{ label: "Watching", active: true }],
};

function StandardBadge({ children }: { children: React.ReactNode }): JSX.Element {
  return (
    <div className="relative flex h-[18px] shrink-0 items-center justify-center gap-[var(--numbers-2,2px)] rounded-[var(--radiuses-small,2px)] bg-[var(--container-dynamic-neutral-bold-background-default,#4b4b59)] px-[3px] py-0">
      <p className="whitespace-nowrap text-center text-[length:var(--body-sm-medium-size,12px)] font-medium not-italic leading-[var(--body-sm-medium-line-height,18px)] text-[var(--container-dynamic-neutral-bold-foreground-default,#ffffff)]">
        {children}
      </p>
    </div>
  );
}

function SecondaryNavigation({
  module,
  dark = false,
}: {
  module: Module;
  dark?: boolean;
}): JSX.Element {
  // "Dark surface" is a Figma component VARIANT (an intentionally dark bar
  // usable in either theme), not theme sync — its literals come from the
  // Figma dark-variant frame and stay fixed regardless of [data-theme].
  const bg = dark ? "bg-[#2d2b34]" : "bg-[var(--surface-background-lvl1,#ffffff)]";
  const activeColor = dark
    ? "text-[#e1e1e8]"
    : "text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]";
  const regularColor = dark
    ? "text-[#c6c6cc]"
    : "text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)]";

  return (
    <div
      className={`relative h-[56px] w-full ${bg}`}
      data-name="Secondary Navigation"
      style={{
        filter:
          "drop-shadow(0px 1px 2px var(--shadow-lvl8, rgba(113,113,128,0.08))) drop-shadow(0px 8px 8px var(--shadow-lvl4, rgba(113,113,128,0.04)))",
      }}
    >
      <div className="absolute left-1/2 top-[calc(50%+0.5px)] flex -translate-x-1/2 -translate-y-1/2 items-center gap-[var(--spacing-24,24px)] whitespace-nowrap text-[length:var(--body-md-regular-size,14px)] not-italic leading-[var(--body-md-regular-line-height,20px)]" data-name="Menu Items">
        {module === "Intelligence" ? (
          <>
            <p className={`shrink-0 font-semibold ${activeColor}`}>Watching</p>
            <div className="relative flex shrink-0 items-center gap-[var(--numbers-8,8px)]">
              <p className={`shrink-0 font-normal ${regularColor}`}>Browsing</p>
              <StandardBadge>Beta</StandardBadge>
            </div>
            <div className="relative flex shrink-0 items-center gap-[var(--numbers-4,4px)]">
              <p className={`shrink-0 font-normal ${regularColor}`}>Browsing</p>
              <StandardBadge>Classic</StandardBadge>
            </div>
            <p className={`shrink-0 font-normal ${regularColor}`}>Buying</p>
          </>
        ) : (
          SECONDARY_ITEMS[module].map((item) => (
            <p
              key={item.label}
              className={`shrink-0 ${
                item.active
                  ? `font-semibold ${activeColor}`
                  : `font-normal ${regularColor}`
              }`}
            >
              {item.label}
            </p>
          ))
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Navigation (composite) — Primary + Secondary stacked, 1440x120      */
/* Figma: Navigation / hasSecondaryNav=true                            */
/* ------------------------------------------------------------------ */

function NavigationComposite({
  activeLabel,
  language,
  module,
  hasSecondaryNav,
}: {
  activeLabel: string;
  language: string;
  module: Module;
  hasSecondaryNav: boolean;
}): JSX.Element {
  return (
    <div className="relative flex w-full flex-col items-start" data-name="Navigation">
      <PrimaryNavigation
        activeLabel={activeLabel}
        showMenuCaret={false}
        language={language}
      />
      {hasSecondaryNav && <SecondaryNavigation module={module} />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* User Menu (component set: Type=MiQer|External x Version=2|3)         */
/* ------------------------------------------------------------------ */

type UserMenuType = "MiQer" | "External";
type UserMenuVersion = "2" | "3";

function ToggleControl({ initial }: { initial: boolean }): JSX.Element {
  const [on, setOn] = useState(initial);
  return (
    <button
      type="button"
      onClick={() => setOn((v) => !v)}
      className={`relative flex h-[24px] max-h-[24px] w-[46px] min-w-[46px] max-w-[46px] items-center rounded-[20px] p-[var(--numbers-2,2px)] ${
        on
          ? "justify-end bg-[var(--controls-background-active,#7c33b5)]"
          : "justify-start bg-[var(--controls-background-inactive,#ebebf0)]"
      }`}
      aria-pressed={on}
      data-name="Toggle"
    >
      <span className="block size-[20px] rounded-full bg-[var(--controls-foreground-default,#ffffff)] shadow" />
    </button>
  );
}

function MenuRow({
  icon,
  label,
  toggleInitial,
}: {
  icon?: string;
  label: string;
  toggleInitial?: boolean;
}): JSX.Element {
  return (
    <div className="relative flex h-[32px] w-[242px] items-center gap-[var(--spacing-24,24px)] rounded-[var(--radiuses-small,2px)] bg-[var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)] p-[var(--numbers-4,4px)]" data-name="User Menu Row">
      <div className="relative flex min-w-0 flex-1 items-center gap-[var(--numbers-12,12px)]" data-name="Row">
        {icon && (
          <div className="relative flex size-[24px] shrink-0 items-center justify-center p-[var(--numbers-2,2px)]">
            <img
              alt=""
              className="block size-full max-w-none object-contain"
              src={icon}
            />
          </div>
        )}
        <p className="min-w-0 flex-1 text-[length:var(--body-md-regular-size,14px)] font-normal not-italic leading-[var(--body-md-regular-line-height,20px)] text-[var(--container-dynamic-neutral-subtle-foreground-default-variation,#13131a)]">
          {label}
        </p>
      </div>
      {toggleInitial !== undefined && <ToggleControl initial={toggleInitial} />}
    </div>
  );
}

function MenuSeparator(): JSX.Element {
  return (
    <div className="relative h-0 w-full shrink-0" data-name="Separator">
      <div className="absolute inset-x-0 top-0 border-t border-[var(--border-static-subtle-neutral,#e1e1e8)]" />
    </div>
  );
}

function UserMenu({
  type,
  version,
}: {
  type: UserMenuType;
  version: UserMenuVersion;
}): JSX.Element {
  const isExternal = type === "External";
  return (
    <div
      className="relative flex w-[274px] flex-col items-start rounded-[var(--old-radiuses-2,2px)] bg-[var(--surface-background-lvl1,#ffffff)] py-[16px]"
      data-name="User Menu"
      style={{
        filter:
          "drop-shadow(0px 1px 2px var(--shadow-lvl8, rgba(113,113,128,0.08))) drop-shadow(0px 12px 10px var(--shadow-lvl10, rgba(113,113,128,0.1)))",
      }}
    >
      <div className="relative flex w-full shrink-0 flex-col items-start gap-[16px] px-[16px]" data-name="Menu">
        {/* Profile */}
        <div className="relative flex h-[44px] shrink-0 items-center gap-[16px]" data-name="Profile">
          <div className="relative flex shrink-0 items-center overflow-clip" data-name="Avatar">
            <div className="relative size-[44px] shrink-0 rounded-[33px]">
              <img
                alt=""
                className="pointer-events-none absolute inset-0 size-full max-w-none rounded-[33px] object-cover"
                src={`${A}/um-avatar-picture.png`}
              />
            </div>
          </div>
          <div className="relative flex shrink-0 flex-col items-start justify-center whitespace-nowrap" data-name="Name and title">
            <p className="text-[length:var(--body-lg-medium-size,16px)] font-medium leading-[var(--body-lg-medium-line-height,24px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]">
              Sammy Tailor
            </p>
            <p className="text-[length:var(--body-sm-regular-size,12px)] font-normal leading-[var(--body-sm-regular-line-height,18px)] text-[var(--surface-foreground-static-neutral-lvl3,#717180)]">
              {isExternal ? "Client Partner" : "Agency Director"}
            </p>
          </div>
        </div>

        {/* Toggles */}
        <div className="relative flex w-full shrink-0 flex-col items-start gap-[var(--numbers-12,12px)]" data-name="Toggles">
          <MenuRow icon={`${A}/um-laptop.svg`} label="Pixels and searches" toggleInitial={false} />
          <MenuRow icon={`${A}/um-moon.svg`} label="Dark mode" toggleInitial={false} />
        </div>

        <MenuSeparator />

        {/* Section 2 */}
        <div className="relative flex w-full shrink-0 flex-col items-start gap-[var(--numbers-12,12px)]" data-name="Section 2">
          <MenuRow icon={`${A}/um-gear.svg`} label="Settings" />
          <MenuRow icon={`${A}/um-heart.svg`} label="Pixels and searches" />
          <MenuRow icon={`${A}/um-flask.svg`} label="Innovation labs" />
          {/* External accounts get account-switching and support entries */}
          {isExternal && (
            <MenuRow icon={`${A}/um-user-switch.svg`} label="Switch account" />
          )}
          {/* Version 3 adds an integrations entry */}
          {version === "3" && (
            <MenuRow icon={`${A}/um-plug.svg`} label="Integrations" />
          )}
        </div>

        <MenuSeparator />

        {/* Section 4 */}
        <div className="relative flex w-full shrink-0 flex-col items-start gap-[var(--numbers-12,12px)]" data-name="Section 4">
          <MenuRow label="Partnerships" />
        </div>

        {/* Section 3 */}
        <div className="relative flex w-full shrink-0 flex-col items-start gap-[var(--numbers-12,12px)]" data-name="Section 3">
          <MenuRow label="Terms & policies" />
          {/* Version 3 surfaces an in-menu help link */}
          {version === "3" && (
            <MenuRow icon={`${A}/um-question.svg`} label="Help & support" />
          )}
        </div>

        <MenuSeparator />

        {/* Sign out */}
        <div className="relative flex w-full items-center p-[var(--numbers-4,4px)]" data-name="Sign out">
          <MenuRow icon={`${A}/um-signout.svg`} label="Sign out" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* User Menu Row (Default / Hover)                                     */
/* ------------------------------------------------------------------ */

function UserMenuRow({
  state,
  menu = "Pixels and searches",
}: {
  state: "Default" | "Hover";
  menu?: string;
}): JSX.Element {
  const isHover = state === "Hover";
  return (
    <div
      className={`relative flex h-[32px] w-[242px] items-center gap-[var(--spacing-24,24px)] rounded-[var(--radiuses-small,2px)] p-[var(--numbers-4,4px)] ${
        isHover
          ? "bg-[var(--container-dynamic-neutral-subtle-background-hover,rgba(113,113,128,0.08))]"
          : "bg-[var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)]"
      }`}
      data-name="User Menu Row"
    >
      <div className="relative flex min-w-0 flex-1 items-center gap-[var(--numbers-12,12px)]" data-name="Row">
        <div className="relative flex size-[24px] shrink-0 flex-col items-center justify-center px-[var(--numbers-2,2px)] py-[var(--odd-numbers-3,3px)]">
          <div className="relative h-[18px] w-[21px] shrink-0">
            <img
              alt=""
              className="absolute inset-0 block size-full max-w-none"
              src={isHover ? `${A}/umr-heart-hover.svg` : `${A}/umr-heart-default.svg`}
            />
          </div>
        </div>
        <p className="min-w-0 flex-1 text-[length:var(--body-md-regular-size,14px)] font-normal not-italic leading-[var(--body-md-regular-line-height,20px)] text-[var(--container-dynamic-neutral-subtle-foreground-default-variation,#13131a)]">
          {menu}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Avatar                                                              */
/* ------------------------------------------------------------------ */

type AvatarPlan = "Pro" | "Standard";
type AvatarState = "Picture" | "Initials";

function ProBadge({ label }: { label: string }): JSX.Element {
  // "Pro" badge uses a magenta brand gradient. The start stop maps to the
  // brand token --gradients-sigma-1 (#d71982 ≈ the #d71a82 Figma start). The
  // lighter #f456ca end stop has no matching token in tokens.css, so it is
  // referenced via a descriptive (currently-undefined) var and always resolves
  // to the original Figma hex fallback — keeping the gradient pixel-accurate
  // while still routing through var() rather than a bare literal.
  const gradient =
    label === "Pro+"
      ? "bg-gradient-to-r from-[var(--gradients-sigma-1,#d71982)] via-[var(--gradients-sigma-2,#ff540c)] to-[var(--gradients-sigma-3,#f0e812)] from-[25.521%] via-[59.375%]"
      : "bg-gradient-to-r from-[var(--gradients-sigma-1,#d71a82)] to-[var(--gradients-pro-badge-end,#f456ca)] from-[50.481%]";
  return (
    <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-start">
      <div className="relative flex h-[18px] shrink-0 items-start">
        <div
          className={`relative flex h-[18px] shrink-0 items-center justify-center gap-[var(--numbers-4,4px)] rounded-[100px] px-[var(--numbers-8,8px)] py-[var(--numbers-2,2px)] ${gradient}`}
        >
          <p className="whitespace-nowrap text-center text-[length:var(--body-sm-medium-size,12px)] font-medium not-italic leading-[var(--body-sm-medium-line-height,18px)] text-[var(--container-static-brand-bold-foreground,#ffffff)]">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}

function Avatar({
  plan,
  size,
  state,
}: {
  plan: AvatarPlan;
  size: 40 | 44;
  state: AvatarState;
}): JSX.Element {
  // Pro variants: 32px content inside 36px wide box + badge (40 tall) / 36px content (44 tall)
  if (plan === "Pro") {
    const contentSize = size === 44 ? 36 : 32;
    const rounded = size === 44 ? "rounded-[27px]" : "rounded-[24px]";
    return (
      <div className="relative flex items-center overflow-clip px-[3px]" data-name="Avatar">
        <div
          className="relative shrink-0"
          style={{ width: 36, height: size }}
        >
          {state === "Picture" ? (
            <>
              <div
                className={`absolute top-0 ${rounded}`}
                style={{
                  left: size === 44 ? 0 : 2,
                  width: contentSize,
                  height: contentSize,
                }}
              >
                <img
                  alt=""
                  className={`pointer-events-none absolute inset-0 size-full max-w-none object-cover ${rounded}`}
                  src={`${A}/av-picture.png`}
                />
              </div>
              <ProBadge label="Pro" />
            </>
          ) : (
            <>
              <div
                className="absolute left-1/2 top-0 -translate-x-1/2"
                style={{ width: contentSize, height: contentSize }}
              >
                <div
                  className="absolute left-0 top-0"
                  style={{ width: contentSize, height: contentSize }}
                >
                  <img
                    alt=""
                    className="absolute inset-0 block size-full max-w-none"
                    src={size === 44 ? `${A}/av-ellipse-2.svg` : `${A}/av-ellipse-1.svg`}
                  />
                </div>
                <p
                  className="absolute -translate-x-full whitespace-nowrap text-right font-medium not-italic leading-normal text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]"
                  style={{
                    left: size === 44 ? "calc(50% + 9px)" : "calc(50% + 8px)",
                    top: size === 44 ? "7.88px" : "7px",
                    fontSize: size === 44 ? "15.75px" : "14px",
                  }}
                >
                  JS
                </p>
              </div>
              <ProBadge label="Pro+" />
            </>
          )}
        </div>
      </div>
    );
  }

  // Standard variants
  if (state === "Picture") {
    const rounded = size === 44 ? "rounded-[33px]" : "rounded-[24px]";
    const contentSize = size === 44 ? 44 : 32;
    const pad = size === 40 ? "p-[4px]" : "";
    return (
      <div className={`relative flex items-center overflow-clip ${pad}`} data-name="Avatar">
        <div
          className={`relative shrink-0 ${rounded}`}
          style={{ width: contentSize, height: contentSize }}
        >
          <img
            alt=""
            className={`pointer-events-none absolute inset-0 size-full max-w-none object-cover ${rounded}`}
            src={`${A}/av-picture.png`}
          />
        </div>
      </div>
    );
  }

  // Standard + Initials
  return (
    <div className="relative flex items-center overflow-clip" data-name="Avatar">
      <div className="relative shrink-0" style={{ width: size, height: size }}>
        <div className="absolute left-0 top-0" style={{ width: size, height: size }}>
          <img
            alt=""
            className="absolute inset-0 block size-full max-w-none"
            src={size === 40 ? `${A}/av-ellipse-4.svg` : `${A}/av-ellipse-3.svg`}
          />
        </div>
        <p
          className="absolute -translate-x-full whitespace-nowrap text-right font-medium not-italic leading-normal text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]"
          style={{
            left: size === 40 ? "calc(50% + 10px)" : "calc(50% + 11px)",
            top: size === 40 ? "8.75px" : "9.63px",
            fontSize: size === 40 ? "17.5px" : "19.25px",
          }}
        >
          JS
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Wide-preview wrapper — 1440px designs scroll gracefully             */
/* ------------------------------------------------------------------ */

/**
 * Renders its child at the true Figma design width (default 1440px) and
 * uniformly scales it down with `transform: scale` so the whole component
 * fits the measured container width. Because many of these components use
 * centered absolute positioning (left-1/2 / -translate-x-1/2) anchored to the
 * 1440px frame, we must render at the real width and scale — narrowing the
 * frame directly would shift/clip the content. We never scale above 1.
 */
function WidePreview({
  children,
  designWidth = 1440,
}: {
  children: React.ReactNode;
  designWidth?: number;
}): JSX.Element {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  const [contentHeight, setContentHeight] = useState(0);

  useLayoutEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const measure = () => {
      const available = container.clientWidth;
      if (available > 0) {
        setScale(Math.min(1, available / designWidth));
      }
      // Natural (unscaled) height of the 1440px design.
      setContentHeight(content.offsetHeight);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(container);
    ro.observe(content);
    return () => ro.disconnect();
  }, [designWidth, children]);

  return (
    <div ref={containerRef} className="w-full overflow-hidden">
      {/* Reserve the *scaled* footprint so the transformed child (whose layout
          box keeps its unscaled size) doesn't leave extra empty space. */}
      <div
        style={{
          width: designWidth * scale,
          maxWidth: "100%",
          height: contentHeight * scale || undefined,
        }}
      >
        <div
          ref={contentRef}
          style={{
            width: designWidth,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Playground configs (one per top-level Figma variant)               */
/* ------------------------------------------------------------------ */

const MODULES: Module[] = [
  "Audiences",
  "Intelligence",
  "Campaigns",
  "Reports",
  "Creatives",
];

const primaryNavConfig: PlaygroundConfig = {
  name: "Primary Navigation",
  description:
    "State=Default, Menu=False (1440×64). Top-level app bar — active module, centered Sigma logo, language selector and Pro+ avatar.",
  controls: [
    {
      kind: "text",
      name: "activeLabel",
      label: "Active module",
      defaultValue: "Intelligence",
      placeholder: "Module name",
    },
    { kind: "boolean", name: "menu", label: "Menu (caret)", defaultValue: false },
    {
      kind: "text",
      name: "language",
      label: "Language",
      defaultValue: "English",
      placeholder: "Language",
    },
  ],
  render: (props) => (
    <WidePreview>
      <div className="overflow-hidden rounded-[4px]">
        <PrimaryNavigation
          activeLabel={String(props.activeLabel)}
          showMenuCaret={props.menu === true}
          language={String(props.language)}
        />
      </div>
    </WidePreview>
  ),
  tokens: {
    "surface/background/miq": "var(--surface-background-miq)",
    "container/dynamic/brand/bold/foreground/default": "var(--container-dynamic-brand-bold-foreground-default)",
    "container/static/brand/bold/foreground": "var(--container-static-brand-bold-foreground)",
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "gradients/sigma/1": "var(--gradients-sigma-1)",
    "gradients/sigma/2": "var(--gradients-sigma-2)",
    "gradients/sigma/3": "var(--gradients-sigma-3)",
    "Body Lg/Medium": "var(--body-lg-medium-size)",
    "Body Md/Regular": "var(--body-md-regular-size)",
    "Body Sm/Medium": "var(--body-sm-medium-size)",
    "Radiuses/small": "var(--radiuses-small)",
    "Height/34": "var(--height-34)",
    "spacing/24": "var(--spacing-24)",
    "numbers/8": "var(--numbers-8)",
  },
};

const secondaryNavConfig: PlaygroundConfig = {
  name: "Secondary Navigation",
  description:
    "Module sub-navigation bar (1440×56). Module=Audiences | Intelligence | Campaigns | Reports | Creatives. Toggle the Dark surface variant.",
  controls: [
    {
      kind: "select",
      name: "module",
      label: "Module",
      options: MODULES as string[],
      defaultValue: "Audiences",
      asTabs: true,
    },
    { kind: "boolean", name: "dark", label: "Dark surface", defaultValue: false },
  ],
  render: (props) => (
    <WidePreview>
      <div className="overflow-hidden rounded-[4px] border border-[var(--border-static-subtle-neutral,#e1e1e8)]">
        <SecondaryNavigation
          module={props.module as Module}
          dark={props.dark === true}
        />
      </div>
    </WidePreview>
  ),
  tokens: {
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "surface/foreground/dynamic/neutral/default/regular": "var(--surface-foreground-dynamic-neutral-default-regular)",
    "container/dynamic/neutral/bold/background/default": "var(--container-dynamic-neutral-bold-background-default)",
    "container/dynamic/neutral/bold/foreground/default": "var(--container-dynamic-neutral-bold-foreground-default)",
    "Body Md/Regular": "var(--body-md-regular-size)",
    "Body Sm/Medium": "var(--body-sm-medium-size)",
    "shadow/lvl8": "var(--shadow-lvl8)",
    "spacing/24": "var(--spacing-24)",
  },
};

const compositeConfig: PlaygroundConfig = {
  name: "Navigation",
  description:
    "Composite (1440×120) — Primary Navigation stacked over Secondary Navigation. Toggle the secondary bar and pick its module.",
  controls: [
    {
      kind: "select",
      name: "module",
      label: "Secondary module",
      options: MODULES as string[],
      defaultValue: "Audiences",
      asTabs: true,
    },
    {
      kind: "boolean",
      name: "hasSecondaryNav",
      label: "Show secondary nav",
      defaultValue: true,
    },
    {
      kind: "text",
      name: "activeLabel",
      label: "Active module",
      defaultValue: "Intelligence",
      placeholder: "Module name",
    },
    {
      kind: "text",
      name: "language",
      label: "Language",
      defaultValue: "English",
      placeholder: "Language",
    },
  ],
  render: (props) => (
    <WidePreview>
      <div className="overflow-hidden rounded-[4px]">
        <NavigationComposite
          activeLabel={String(props.activeLabel)}
          language={String(props.language)}
          module={props.module as Module}
          hasSecondaryNav={props.hasSecondaryNav === true}
        />
      </div>
    </WidePreview>
  ),
  tokens: {
    "surface/background/miq": "var(--surface-background-miq)",
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "container/dynamic/brand/bold/foreground/default": "var(--container-dynamic-brand-bold-foreground-default)",
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "surface/foreground/dynamic/neutral/default/regular": "var(--surface-foreground-dynamic-neutral-default-regular)",
    "gradients/sigma/1": "var(--gradients-sigma-1)",
    "gradients/sigma/2": "var(--gradients-sigma-2)",
    "gradients/sigma/3": "var(--gradients-sigma-3)",
    "Body Lg/Medium": "var(--body-lg-medium-size)",
    "Body Md/Regular": "var(--body-md-regular-size)",
    "spacing/24": "var(--spacing-24)",
  },
};

const userMenuConfig: PlaygroundConfig = {
  name: "User Menu",
  description:
    "Profile dropdown component set — Type=MiQer | External × Version=2 | 3. Toggles are interactive.",
  controls: [
    {
      kind: "select",
      name: "type",
      label: "Type",
      options: ["MiQer", "External"],
      defaultValue: "MiQer",
      asTabs: true,
    },
    {
      kind: "select",
      name: "version",
      label: "Version",
      options: ["2", "3"],
      defaultValue: "2",
    },
  ],
  render: (props) => (
    <UserMenu
      type={props.type as UserMenuType}
      version={props.version as UserMenuVersion}
    />
  ),
  tokens: {
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "controls/background/inactive": "var(--controls-background-inactive)",
    "controls/foreground/default": "var(--controls-foreground-default)",
    "container/dynamic/neutral/subtle/background/default/regular": "var(--container-dynamic-neutral-subtle-background-default-regular)",
    "container/dynamic/neutral/subtle/foreground/default/variation": "var(--container-dynamic-neutral-subtle-foreground-default-variation)",
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "surface/foreground/static/neutral/lvl3": "var(--surface-foreground-static-neutral-lvl3)",
    "Body Lg/Medium": "var(--body-lg-medium-size)",
    "Body Sm/Regular": "var(--body-sm-regular-size)",
    "Body Md/Regular": "var(--body-md-regular-size)",
  },
};

/* Sub-part playgrounds (component pieces referenced by the sets above) */

const userMenuRowConfig: PlaygroundConfig = {
  name: "User Menu Row",
  description: "Single menu row — Default and Hover states, with editable label.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Default", "Hover"],
      defaultValue: "Default",
      asTabs: true,
    },
    {
      kind: "text",
      name: "label",
      label: "Label",
      defaultValue: "Pixels and searches",
      placeholder: "Menu label",
    },
  ],
  render: (props) => (
    <UserMenuRow
      state={props.state as "Default" | "Hover"}
      menu={String(props.label)}
    />
  ),
  tokens: {
    "container/dynamic/neutral/subtle/background/default/regular": "var(--container-dynamic-neutral-subtle-background-default-regular)",
    "container/dynamic/neutral/subtle/background/hover": "var(--container-dynamic-neutral-subtle-background-hover)",
    "container/dynamic/neutral/subtle/foreground/default/variation": "var(--container-dynamic-neutral-subtle-foreground-default-variation)",
    "Body Md/Regular": "var(--body-md-regular-size)",
    "Radiuses/small": "var(--radiuses-small)",
  },
};

const avatarConfig: PlaygroundConfig = {
  name: "Avatar",
  description: "Account avatar — Pro/Standard plan, Picture/Initials state, and two sizes.",
  controls: [
    {
      kind: "select",
      name: "plan",
      label: "Plan",
      options: ["Pro", "Standard"],
      defaultValue: "Pro",
      asTabs: true,
    },
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Picture", "Initials"],
      defaultValue: "Picture",
    },
    {
      kind: "select",
      name: "size",
      label: "Size",
      options: ["40", "44"],
      defaultValue: "40",
    },
  ],
  render: (props) => (
    <Avatar
      plan={props.plan as AvatarPlan}
      state={props.state as AvatarState}
      size={props.size === "44" ? 44 : 40}
    />
  ),
  tokens: {
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "container/static/brand/bold/foreground": "var(--container-static-brand-bold-foreground)",
    "gradients/sigma/1": "var(--gradients-sigma-1)",
    "gradients/sigma/2": "var(--gradients-sigma-2)",
    "gradients/sigma/3": "var(--gradients-sigma-3)",
    "Body Sm/Medium": "var(--body-sm-medium-size)",
  },
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function NavigationPage(): JSX.Element {
  return (
    <section aria-label="Navigation component playgrounds" className="flex flex-col gap-6">
      <Playground config={primaryNavConfig} />
      <Playground config={secondaryNavConfig} />
      <Playground config={compositeConfig} />
      <Playground config={userMenuConfig} />
      <Playground config={userMenuRowConfig} />
      <Playground config={avatarConfig} />
    </section>
  );
}
