import { useState } from "react";
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
    <div className="relative flex h-[64px] w-full items-center justify-between bg-[var(--surface-background-miq,#2b0030)] p-[var(--spacing-24,24px)]">
      {/* Menu item (Intelligence) */}
      <div className="relative flex shrink-0 items-center gap-0">
        <div className="relative flex h-[64px] shrink-0 items-center justify-center gap-[32px]">
          <div className="relative h-full w-[100px]">
            <p className="absolute left-[calc(50%-43.23px)] top-[calc(50%-10px)] whitespace-nowrap text-[length:var(--body-lg-medium-size,16px)] font-medium not-italic leading-[var(--body-lg-medium-line-height,24px)] text-[var(--container-dynamic-brand-bold-foreground-default,#ffffff)]">
              {activeLabel}
            </p>
            <div className="absolute bottom-0 left-[calc(50%-1px)] h-[4px] w-[100px] -translate-x-1/2 rounded-tl-[var(--radiuses-small,2px)] rounded-tr-[var(--radiuses-small,2px)] bg-gradient-to-r from-[var(--gradients-sigma-1,#d71982)] via-[var(--gradients-sigma-2,#ff540c)] to-[#dad310] from-[25.521%] via-[59.375%]" />
          </div>
        </div>
        {showMenuCaret && (
          <div className="flex flex-row items-center self-stretch">
            <div className="relative flex h-full w-[24px] shrink-0 items-center justify-center px-[4px] pb-[2px] pt-[6px]">
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
      <div className="relative flex shrink-0 items-center gap-[16px]">
        <SigmaLogo />
      </div>

      {/* Right side */}
      <div className="relative flex shrink-0 items-center justify-end gap-[20px]">
        <div className="relative flex h-[var(--height-34,34px)] shrink-0 items-center justify-center gap-[var(--numbers-8,8px)] rounded-[var(--radiuses-small,2px)] bg-[rgba(255,255,255,0.2)] px-[var(--numbers-12,12px)] py-[var(--numbers-4,4px)]">
          <div className="relative flex shrink-0 items-center gap-[4px]">
            <div className="relative flex size-[20px] shrink-0 items-center justify-center overflow-clip p-[2px]">
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
          <div className="relative flex size-[20px] shrink-0 items-center justify-center">
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
        <div className="relative size-[24px] shrink-0">
          <div className="absolute left-1/2 top-1/2 size-[20px] -translate-x-1/2 -translate-y-1/2">
            <img
              alt=""
              className="absolute inset-0 block size-full max-w-none"
              src={`${A}/pn-diamond.svg`}
            />
          </div>
        </div>

        {/* Avatar (Initials + Pro+ badge) */}
        <div className="relative flex shrink-0 items-center overflow-clip px-[3px]">
          <div className="relative h-[40px] w-[36px] shrink-0">
            <div className="absolute left-1/2 top-0 size-[32px] -translate-x-1/2">
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
            <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-start">
              <div className="relative flex h-[18px] shrink-0 items-start">
                <div className="relative flex h-[18px] shrink-0 items-center justify-center gap-[var(--numbers-4,4px)] rounded-[100px] bg-gradient-to-r from-[var(--gradients-sigma-1,#d71982)] via-[var(--gradients-sigma-2,#ff540c)] to-[var(--gradients-sigma-3,#f0e812)] from-[25.521%] via-[59.375%] px-[var(--numbers-8,8px)] py-[var(--numbers-2,2px)]">
                  <p className="whitespace-nowrap text-center text-[length:var(--body-sm-medium-size,12px)] font-medium not-italic leading-[var(--body-sm-medium-line-height,18px)] text-[var(--container-dynamic-brand-bold-foreground-default,#ffffff)]">
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
/* ------------------------------------------------------------------ */

type Module =
  | "Audiences"
  | "Campaigns"
  | "Reports"
  | "Creatives"
  | "Intelligence";

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
      <p className="whitespace-nowrap text-center text-[length:var(--body-sm-medium-size,12px)] font-medium not-italic leading-[var(--body-sm-medium-line-height,18px)] text-[var(--container-static-neutral-bold-foreground,#f7f7fa)]">
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
      style={{
        filter:
          "drop-shadow(0px 1px 2px var(--shadow-lvl8, rgba(113,113,128,0.08))) drop-shadow(0px 8px 8px var(--shadow-lvl4, rgba(113,113,128,0.04)))",
      }}
    >
      <div className="absolute left-1/2 top-[calc(50%+0.5px)] flex -translate-x-1/2 -translate-y-1/2 items-center gap-[var(--spacing-24,24px)] whitespace-nowrap text-[length:var(--body-md-regular-size,14px)] not-italic leading-[var(--body-md-regular-line-height,20px)]">
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
/* Navigation Secondary (title + action buttons bar)                   */
/* ------------------------------------------------------------------ */

function NavigationSecondaryBar({ title }: { title: string }): JSX.Element {
  return (
    <div className="relative h-[56px] w-full bg-[var(--surface-background-lvl1,#ffffff)]">
      <div className="absolute inset-x-0 bottom-0">
        <img
          alt=""
          className="block h-auto w-full max-w-none"
          src={`${A}/nav-secondary-bg.svg`}
        />
      </div>
      <div className="absolute left-[24px] right-[24px] top-[11px] flex items-center justify-between">
        <p className="whitespace-nowrap text-[length:var(--headline-sm-medium-size,20px)] font-medium not-italic leading-[var(--headline-sm-medium-line-height,28px)] tracking-[-0.2px] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] [word-break:break-word]">
          {title}
        </p>
        <div className="relative flex flex-1 items-start justify-end gap-[var(--numbers-12,12px)]">
          <div className="relative flex h-[var(--height-34,34px)] shrink-0 items-start rounded-[var(--radiuses-small,2px)]">
            <div className="relative flex h-[var(--height-34,34px)] shrink-0 items-center justify-center rounded-[var(--radiuses-small,2px)] border border-solid border-[var(--border-dynamic-neutral-bold-default,#4b4b59)] px-[var(--numbers-12,12px)] py-[var(--odd-numbers-7,7px)]">
              <p className="whitespace-nowrap text-center text-[length:var(--body-md-medium-size,14px)] font-medium not-italic leading-[var(--body-md-medium-line-height,20px)] text-[var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)]">
                Button
              </p>
            </div>
          </div>
          <div className="relative flex h-[var(--height-34,34px)] shrink-0 items-start rounded-[var(--radiuses-small,2px)]">
            <div className="relative flex h-[var(--height-34,34px)] shrink-0 items-center justify-center rounded-[var(--radiuses-small,2px)] bg-[var(--container-dynamic-neutral-bold-background-default,#4b4b59)] px-[var(--numbers-12,12px)] py-[var(--odd-numbers-7,7px)]">
              <p className="whitespace-nowrap text-center text-[length:var(--body-md-medium-size,14px)] font-medium not-italic leading-[var(--body-md-medium-line-height,20px)] text-[var(--container-dynamic-neutral-bold-foreground-default,#ffffff)]">
                Button
              </p>
            </div>
          </div>
          <div className="relative flex shrink-0 items-start rounded-[var(--radiuses-small,2px)]">
            <div className="relative flex h-[var(--height-34,34px)] shrink-0 items-center justify-center rounded-[var(--radiuses-small,2px)] bg-[var(--container-dynamic-brand-bold-background-default,#7c33b5)] px-[var(--numbers-12,12px)] py-[var(--odd-numbers-7,7px)]">
              <p className="whitespace-nowrap text-center text-[length:var(--body-md-medium-size,14px)] font-medium not-italic leading-[var(--body-md-medium-line-height,20px)] text-[var(--container-dynamic-brand-bold-foreground-default,#ffffff)]">
                Button
              </p>
            </div>
          </div>
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
    >
      <div className="relative flex min-w-0 flex-1 items-center gap-[var(--numbers-12,12px)]">
        <div className="relative flex size-[24px] shrink-0 flex-col items-center justify-center px-[var(--numbers-2,2px)] py-[var(--odd-numbers-3,3px)]">
          <div className="relative h-[18px] w-[21px] shrink-0">
            <img
              alt=""
              className="absolute inset-0 block size-full max-w-none"
              src={isHover ? `${A}/umr-heart-hover.svg` : `${A}/umr-heart-default.svg`}
            />
          </div>
        </div>
        <p className="min-w-0 flex-1 text-[length:var(--body-md-regular-size,14px)] font-normal not-italic leading-[var(--body-md-regular-line-height,20px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]">
          {menu}
        </p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* User Menu (dropdown card) — MiQer / UFP / v2                        */
/* ------------------------------------------------------------------ */

function MenuRow({
  icon,
  label,
  toggle,
}: {
  icon?: string;
  label: string;
  toggle?: boolean;
}): JSX.Element {
  const [on, setOn] = useState(true);
  return (
    <div className="relative flex h-[32px] w-[242px] items-center gap-[var(--spacing-24,24px)] rounded-[var(--radiuses-small,2px)] bg-[var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)] p-[var(--numbers-4,4px)]">
      <div className="relative flex min-w-0 flex-1 items-center gap-[var(--numbers-12,12px)]">
        {icon && (
          <div className="relative flex size-[24px] shrink-0 items-center justify-center p-[var(--numbers-2,2px)]">
            <img
              alt=""
              className="block size-full max-w-none object-contain"
              src={icon}
            />
          </div>
        )}
        <p className="min-w-0 flex-1 text-[length:var(--body-md-regular-size,14px)] font-normal not-italic leading-[var(--body-md-regular-line-height,20px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]">
          {label}
        </p>
      </div>
      {toggle && (
        <button
          type="button"
          onClick={() => setOn((v) => !v)}
          className={`relative flex h-[24px] max-h-[24px] w-[46px] min-w-[46px] max-w-[46px] items-center rounded-[20px] p-[var(--numbers-2,2px)] ${
            on
              ? "justify-end bg-[var(--controls-background-active,#7c33b5)]"
              : "justify-start bg-[var(--controls-background-inactive,#ebebf0)]"
          }`}
          aria-pressed={on}
        >
          <span className="block size-[20px] rounded-full bg-[var(--controls-foreground-default,#ffffff)] shadow" />
        </button>
      )}
    </div>
  );
}

function UserMenu(): JSX.Element {
  return (
    <div
      className="relative flex w-[274px] flex-col items-start rounded-[var(--radiuses-small,2px)] bg-[var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)] py-[16px]"
      style={{
        filter:
          "drop-shadow(0px 1px 2px var(--shadow-lvl8, rgba(113,113,128,0.08))) drop-shadow(0px 12px 10px var(--shadow-lvl10, rgba(113,113,128,0.1)))",
      }}
    >
      <div className="relative flex w-full shrink-0 flex-col items-start gap-[16px] px-[16px]">
        {/* Profile */}
        <div className="relative flex h-[44px] shrink-0 items-center gap-[16px]">
          <div className="relative flex shrink-0 items-center overflow-clip">
            <div className="relative size-[44px] shrink-0 rounded-[33px]">
              <img
                alt=""
                className="pointer-events-none absolute inset-0 size-full max-w-none rounded-[33px] object-cover"
                src={`${A}/um-avatar-picture.png`}
              />
            </div>
          </div>
          <div className="relative flex shrink-0 flex-col items-start justify-center whitespace-nowrap">
            <p className="text-[length:var(--body-lg-medium-size,16px)] font-medium leading-[var(--body-lg-medium-line-height,24px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]">
              Sammy Tailor
            </p>
            <p className="text-[length:var(--body-sm-regular-size,12px)] font-normal leading-[var(--body-sm-regular-line-height,18px)] text-[var(--surface-foreground-static-neutral-lvl3,#717180)]">
              Agency Director
            </p>
          </div>
        </div>

        {/* Toggles */}
        <div className="relative flex w-full shrink-0 flex-col items-start gap-[var(--numbers-12,12px)]">
          <MenuRow icon={`${A}/um-laptop.svg`} label="Pixels and searches" toggle />
          <MenuRow icon={`${A}/um-moon.svg`} label="Dark mode" toggle />
        </div>

        {/* Separator */}
        <div className="relative h-0 w-full shrink-0">
          <div className="absolute inset-x-0 top-0 border-t border-[var(--border-static-subtle-neutral,#e1e1e8)]" />
        </div>

        {/* Section 2 */}
        <div className="relative flex w-full shrink-0 flex-col items-start gap-[var(--numbers-12,12px)]">
          <MenuRow icon={`${A}/um-gear.svg`} label="Settings" />
          <MenuRow icon={`${A}/um-heart.svg`} label="Pixels and searches" />
          <MenuRow icon={`${A}/um-flask.svg`} label="Innovation labs" />
        </div>

        {/* Separator */}
        <div className="relative h-0 w-full shrink-0">
          <div className="absolute inset-x-0 top-0 border-t border-[var(--border-static-subtle-neutral,#e1e1e8)]" />
        </div>

        {/* Sign out */}
        <div className="relative flex w-full items-center p-[var(--numbers-4,4px)]">
          <MenuRow icon={`${A}/um-signout.svg`} label="Sign out" />
        </div>
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
  const gradient =
    label === "Pro+"
      ? "bg-gradient-to-r from-[var(--gradients-sigma-1,#d71982)] via-[var(--gradients-sigma-2,#ff540c)] to-[var(--gradients-sigma-3,#f0e812)] from-[25.521%] via-[59.375%]"
      : "bg-gradient-to-r from-[#d71a82] to-[#f456ca] from-[50.481%]";
  return (
    <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-start">
      <div className="relative flex h-[18px] shrink-0 items-start">
        <div
          className={`relative flex h-[18px] shrink-0 items-center justify-center gap-[var(--numbers-4,4px)] rounded-[100px] px-[var(--numbers-8,8px)] py-[var(--numbers-2,2px)] ${gradient}`}
        >
          <p className="whitespace-nowrap text-center text-[length:var(--body-sm-medium-size,12px)] font-medium not-italic leading-[var(--body-sm-medium-line-height,18px)] text-[var(--container-dynamic-brand-bold-foreground-default,#ffffff)]">
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
      <div className="relative flex items-center overflow-clip px-[3px]">
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
      <div className={`relative flex items-center overflow-clip ${pad}`}>
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
    <div className="relative flex items-center overflow-clip">
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
/* Playground configs                                                  */
/* ------------------------------------------------------------------ */

const primaryNavConfig: PlaygroundConfig = {
  name: "Primary Navigation",
  description:
    "Top-level app bar — active module, centered Sigma logo, language selector and Pro+ avatar.",
  controls: [
    {
      kind: "text",
      name: "activeLabel",
      label: "Active module",
      defaultValue: "Intelligence",
      placeholder: "Module name",
    },
    { kind: "boolean", name: "menu", label: "Show menu caret", defaultValue: true },
    {
      kind: "text",
      name: "language",
      label: "Language",
      defaultValue: "English",
      placeholder: "Language",
    },
  ],
  render: (props) => (
    <div className="w-full min-w-[640px] overflow-hidden rounded-[4px]">
      <PrimaryNavigation
        activeLabel={String(props.activeLabel)}
        showMenuCaret={props.menu === true}
        language={String(props.language)}
      />
    </div>
  ),
  tokens: {
    "surface/background/miq": "var(--surface-background-miq)",
    "container/dynamic/brand/bold/foreground/default": "var(--container-dynamic-brand-bold-foreground-default)",
    "gradients/sigma/1": "var(--gradients-sigma-1)",
    "gradients/sigma/2": "var(--gradients-sigma-2)",
    "gradients/sigma/3": "var(--gradients-sigma-3)",
    "Body Lg/Medium": "var(--body-lg-medium-size)",
    "Body Md/Regular": "var(--body-md-regular-size)",
    "Body Sm/Medium": "var(--body-sm-medium-size)",
    "Radiuses/small": "var(--radiuses-small)",
    "spacing/24": "var(--spacing-24)",
    "numbers/8": "var(--numbers-8)",
  },
};

const MODULES: Module[] = [
  "Audiences",
  "Intelligence",
  "Campaigns",
  "Reports",
  "Creatives",
];

const secondaryNavConfig: PlaygroundConfig = {
  name: "Secondary Navigation",
  description: "Module sub-navigation bar. Switch modules and toggle the dark surface.",
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
    <div className="w-full min-w-[320px] overflow-hidden rounded-[4px] border border-[#f0f0f4]">
      <SecondaryNavigation
        module={props.module as Module}
        dark={props.dark === true}
      />
    </div>
  ),
  tokens: {
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "surface/foreground/dynamic/neutral/default/regular": "var(--surface-foreground-dynamic-neutral-default-regular)",
    "container/dynamic/neutral/bold/background/default": "var(--container-dynamic-neutral-bold-background-default)",
    "container/static/neutral/bold/foreground": "var(--container-static-neutral-bold-foreground)",
    "Body Md/Regular": "var(--body-md-regular-size)",
    "Body Sm/Medium": "var(--body-sm-medium-size)",
    "spacing/24": "var(--spacing-24)",
  },
};

const navSecondaryBarConfig: PlaygroundConfig = {
  name: "Navigation Secondary (title + actions)",
  description: "Page title bar with secondary, primary and brand action buttons.",
  controls: [
    {
      kind: "text",
      name: "title",
      label: "Title",
      defaultValue: "Placeholder…",
      placeholder: "Page title",
    },
  ],
  render: (props) => (
    <div className="w-full min-w-[520px] overflow-hidden rounded-[4px] border border-[#f0f0f4]">
      <NavigationSecondaryBar title={String(props.title)} />
    </div>
  ),
  tokens: {
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "border/dynamic/neutral/bold/default": "var(--border-dynamic-neutral-bold-default)",
    "container/dynamic/neutral/bold/background/default": "var(--container-dynamic-neutral-bold-background-default)",
    "container/dynamic/brand/bold/background/default": "var(--container-dynamic-brand-bold-background-default)",
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "Headline Sm/Medium": "var(--headline-sm-medium-size)",
    "Body Md/Medium": "var(--body-md-medium-size)",
    "Height/34": "var(--height-34)",
    "Radiuses/small": "var(--radiuses-small)",
  },
};

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
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "Body Md/Regular": "var(--body-md-regular-size)",
    "Radiuses/small": "var(--radiuses-small)",
  },
};

const userMenuConfig: PlaygroundConfig = {
  name: "User Menu",
  description: "Profile dropdown card — Type=MiQer, Platform=UFP. Toggles are interactive.",
  controls: [],
  render: () => <UserMenu />,
  tokens: {
    "container/dynamic/neutral/subtle/background/default/regular": "var(--container-dynamic-neutral-subtle-background-default-regular)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "controls/background/active": "var(--controls-background-active)",
    "controls/background/inactive": "var(--controls-background-inactive)",
    "controls/foreground/default": "var(--controls-foreground-default)",
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "surface/foreground/static/neutral/lvl3": "var(--surface-foreground-static-neutral-lvl3)",
    "Body Lg/Medium": "var(--body-lg-medium-size)",
    "Body Sm/Regular": "var(--body-sm-regular-size)",
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
    "container/dynamic/brand/bold/foreground/default": "var(--container-dynamic-brand-bold-foreground-default)",
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
      <Playground config={navSecondaryBarConfig} />
      <Playground config={userMenuRowConfig} />
      <Playground config={userMenuConfig} />
      <Playground config={avatarConfig} />
    </section>
  );
}
