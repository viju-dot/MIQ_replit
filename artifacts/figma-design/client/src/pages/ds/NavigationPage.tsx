import { useState } from "react";

const A = "/figmaAssets/navigation";

/* ------------------------------------------------------------------ */
/* Reusable caption + card group helpers                               */
/* ------------------------------------------------------------------ */

function Caption({ children }: { children: React.ReactNode }): JSX.Element {
  return <span className="text-[12px] text-[#a8a8b2]">{children}</span>;
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
      <h3 className="mb-4 text-[14px] font-medium text-[#13131a]">{title}</h3>
      <div className="flex flex-col gap-6">{children}</div>
    </div>
  );
}

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

function PrimaryNavigation(): JSX.Element {
  return (
    <div className="relative flex h-[64px] w-full items-center justify-between bg-[#2b0030] p-[24px]">
      {/* Menu item (Intelligence) */}
      <div className="relative flex shrink-0 items-center gap-0">
        <div className="relative flex h-[64px] shrink-0 items-center justify-center gap-[32px]">
          <div className="relative h-full w-[100px]">
            <p className="absolute left-[calc(50%-43.23px)] top-[calc(50%-10px)] whitespace-nowrap text-[16px] font-medium not-italic leading-[24px] text-white">
              Intelligence
            </p>
            <div className="absolute bottom-0 left-[calc(50%-1px)] h-[4px] w-[100px] -translate-x-1/2 rounded-tl-[2px] rounded-tr-[2px] bg-gradient-to-r from-[#d71982] via-[#ff540c] to-[#dad310] from-[25.521%] via-[59.375%]" />
          </div>
        </div>
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
      </div>

      {/* Logo (centered) */}
      <div className="relative flex shrink-0 items-center gap-[16px]">
        <SigmaLogo />
      </div>

      {/* Right side */}
      <div className="relative flex shrink-0 items-center justify-end gap-[20px]">
        <div className="relative flex h-[34px] shrink-0 items-center justify-center gap-[8px] rounded-[2px] bg-[rgba(255,255,255,0.2)] px-[12px] py-[4px]">
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
            <p className="whitespace-nowrap text-[14px] font-normal not-italic leading-[20px] text-white">
              English
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
              <p className="absolute left-[calc(50%+8px)] top-[7px] -translate-x-full whitespace-nowrap text-right text-[14px] font-medium not-italic leading-normal text-[#13131a]">
                JS
              </p>
            </div>
            <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-start">
              <div className="relative flex h-[18px] shrink-0 items-start">
                <div className="relative flex h-[18px] shrink-0 items-center justify-center gap-[4px] rounded-[100px] bg-gradient-to-r from-[#d71982] via-[#ff540c] to-[#f0e812] from-[25.521%] via-[59.375%] px-[8px] py-[2px]">
                  <p className="whitespace-nowrap text-center text-[12px] font-medium not-italic leading-[18px] text-white">
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
    <div className="relative flex h-[18px] shrink-0 items-center justify-center gap-[2px] rounded-[2px] bg-[#4b4b59] px-[3px] py-0">
      <p className="whitespace-nowrap text-center text-[12px] font-medium not-italic leading-[18px] text-[#f7f7fa]">
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
  const bg = dark ? "bg-[#2d2b34]" : "bg-white";
  const activeColor = dark ? "text-[#e1e1e8]" : "text-[#13131a]";
  const regularColor = dark ? "text-[#c6c6cc]" : "text-[#4b4b59]";

  return (
    <div
      className={`relative h-[56px] w-full ${bg}`}
      style={{
        filter:
          "drop-shadow(0px 1px 2px rgba(113,113,128,0.08)) drop-shadow(0px 8px 8px rgba(113,113,128,0.04))",
      }}
    >
      <div className="absolute left-1/2 top-[calc(50%+0.5px)] flex -translate-x-1/2 -translate-y-1/2 items-center gap-[24px] whitespace-nowrap text-[14px] not-italic leading-[20px]">
        {module === "Intelligence" ? (
          <>
            <p className={`shrink-0 font-semibold ${activeColor}`}>Watching</p>
            <div className="relative flex shrink-0 items-center gap-[8px]">
              <p className={`shrink-0 font-normal ${regularColor}`}>Browsing</p>
              <StandardBadge>Beta</StandardBadge>
            </div>
            <div className="relative flex shrink-0 items-center gap-[4px]">
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

function NavigationSecondaryBar(): JSX.Element {
  return (
    <div className="relative h-[56px] w-full bg-white">
      <div className="absolute inset-x-0 bottom-0">
        <img
          alt=""
          className="block h-auto w-full max-w-none"
          src={`${A}/nav-secondary-bg.svg`}
        />
      </div>
      <div className="absolute left-[24px] right-[24px] top-[11px] flex items-center justify-between">
        <p className="whitespace-nowrap text-[20px] font-medium not-italic leading-[28px] tracking-[-0.2px] text-[#13131a] [word-break:break-word]">
          Placeholder…
        </p>
        <div className="relative flex flex-1 items-start justify-end gap-[12px]">
          <div className="relative flex h-[34px] shrink-0 items-start rounded-[2px]">
            <div className="relative flex h-[34px] shrink-0 items-center justify-center rounded-[2px] border border-solid border-[#4b4b59] px-[12px] py-[7px]">
              <p className="whitespace-nowrap text-center text-[14px] font-medium not-italic leading-[20px] text-[#4b4b59]">
                Button
              </p>
            </div>
          </div>
          <div className="relative flex h-[34px] shrink-0 items-start rounded-[2px]">
            <div className="relative flex h-[34px] shrink-0 items-center justify-center rounded-[2px] bg-[#4b4b59] px-[12px] py-[7px]">
              <p className="whitespace-nowrap text-center text-[14px] font-medium not-italic leading-[20px] text-white">
                Button
              </p>
            </div>
          </div>
          <div className="relative flex shrink-0 items-start rounded-[2px]">
            <div className="relative flex h-[34px] shrink-0 items-center justify-center rounded-[2px] bg-[#7c33b5] px-[12px] py-[7px]">
              <p className="whitespace-nowrap text-center text-[14px] font-medium not-italic leading-[20px] text-white">
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
      className={`relative flex h-[32px] w-[242px] items-center gap-[24px] rounded-[2px] p-[4px] ${
        isHover ? "bg-[rgba(113,113,128,0.08)]" : "bg-white"
      }`}
    >
      <div className="relative flex min-w-0 flex-1 items-center gap-[12px]">
        <div className="relative flex size-[24px] shrink-0 flex-col items-center justify-center px-[2px] py-[3px]">
          <div className="relative h-[18px] w-[21px] shrink-0">
            <img
              alt=""
              className="absolute inset-0 block size-full max-w-none"
              src={isHover ? `${A}/umr-heart-hover.svg` : `${A}/umr-heart-default.svg`}
            />
          </div>
        </div>
        <p className="min-w-0 flex-1 text-[14px] font-normal not-italic leading-[20px] text-[#13131a]">
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
    <div className="relative flex h-[32px] w-[242px] items-center gap-[24px] rounded-[2px] bg-white p-[4px]">
      <div className="relative flex min-w-0 flex-1 items-center gap-[12px]">
        {icon && (
          <div className="relative flex size-[24px] shrink-0 items-center justify-center p-[2px]">
            <img
              alt=""
              className="block size-full max-w-none object-contain"
              src={icon}
            />
          </div>
        )}
        <p className="min-w-0 flex-1 text-[14px] font-normal not-italic leading-[20px] text-[#13131a]">
          {label}
        </p>
      </div>
      {toggle && (
        <button
          type="button"
          onClick={() => setOn((v) => !v)}
          className={`relative flex h-[24px] max-h-[24px] w-[46px] min-w-[46px] max-w-[46px] items-center rounded-[20px] p-[2px] ${
            on ? "justify-end bg-[#7c33b5]" : "justify-start bg-[#ebebf0]"
          }`}
          aria-pressed={on}
        >
          <span className="block size-[20px] rounded-full bg-white shadow" />
        </button>
      )}
    </div>
  );
}

function UserMenu(): JSX.Element {
  return (
    <div
      className="relative flex w-[274px] flex-col items-start rounded-[2px] bg-white py-[16px]"
      style={{
        filter:
          "drop-shadow(0px 1px 2px rgba(113,113,128,0.08)) drop-shadow(0px 12px 10px rgba(113,113,128,0.1))",
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
            <p className="text-[16px] font-medium leading-[24px] text-[#13131a]">
              Sammy Tailor
            </p>
            <p className="text-[12px] font-normal leading-[18px] text-[#717180]">
              Agency Director
            </p>
          </div>
        </div>

        {/* Toggles */}
        <div className="relative flex w-full shrink-0 flex-col items-start gap-[12px]">
          <MenuRow icon={`${A}/um-laptop.svg`} label="Pixels and searches" toggle />
          <MenuRow icon={`${A}/um-moon.svg`} label="Dark mode" toggle />
        </div>

        {/* Separator */}
        <div className="relative h-0 w-full shrink-0">
          <div className="absolute inset-x-0 top-0 border-t border-[#e1e1e8]" />
        </div>

        {/* Section 2 */}
        <div className="relative flex w-full shrink-0 flex-col items-start gap-[12px]">
          <MenuRow icon={`${A}/um-gear.svg`} label="Settings" />
          <MenuRow icon={`${A}/um-heart.svg`} label="Pixels and searches" />
          <MenuRow icon={`${A}/um-flask.svg`} label="Innovation labs" />
        </div>

        {/* Separator */}
        <div className="relative h-0 w-full shrink-0">
          <div className="absolute inset-x-0 top-0 border-t border-[#e1e1e8]" />
        </div>

        {/* Sign out */}
        <div className="relative flex w-full items-center p-[4px]">
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
      ? "bg-gradient-to-r from-[#d71982] via-[#ff540c] to-[#f0e812] from-[25.521%] via-[59.375%]"
      : "bg-gradient-to-r from-[#d71a82] to-[#f456ca] from-[50.481%]";
  return (
    <div className="absolute bottom-0 left-1/2 flex -translate-x-1/2 items-start">
      <div className="relative flex h-[18px] shrink-0 items-start">
        <div
          className={`relative flex h-[18px] shrink-0 items-center justify-center gap-[4px] rounded-[100px] px-[8px] py-[2px] ${gradient}`}
        >
          <p className="whitespace-nowrap text-center text-[12px] font-medium not-italic leading-[18px] text-white">
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
                  className="absolute -translate-x-full whitespace-nowrap text-right font-medium not-italic leading-normal text-[#13131a]"
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
          className="absolute -translate-x-full whitespace-nowrap text-right font-medium not-italic leading-normal text-[#13131a]"
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
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function NavigationPage(): JSX.Element {
  return (
    <section aria-label="Navigation components" className="flex flex-col gap-8">
      <Group title="Primary Navigation">
        <div className="flex flex-col gap-2">
          <Caption>State=Default, Menu=False</Caption>
          <div className="overflow-hidden rounded-[4px]">
            <PrimaryNavigation />
          </div>
        </div>
      </Group>

      <Group title="Secondary Navigation">
        {(
          [
            "Audiences",
            "Intelligence",
            "Campaigns",
            "Reports",
            "Creatives",
          ] as Module[]
        ).map((m) => (
          <div key={m} className="flex flex-col gap-2">
            <Caption>Module={m}</Caption>
            <div className="overflow-hidden rounded-[4px] border border-[#f0f0f4]">
              <SecondaryNavigation module={m} />
            </div>
          </div>
        ))}
        <div className="flex flex-col gap-2">
          <Caption>Module=Audiences (dark)</Caption>
          <div className="overflow-hidden rounded-[4px]">
            <SecondaryNavigation module="Audiences" dark />
          </div>
        </div>
      </Group>

      <Group title="Navigation Secondary (title + actions)">
        <div className="flex flex-col gap-2">
          <Caption>Placeholder title with buttons</Caption>
          <div className="overflow-hidden rounded-[4px] border border-[#f0f0f4]">
            <NavigationSecondaryBar />
          </div>
        </div>
      </Group>

      <Group title="User Menu Row">
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col gap-2">
            <Caption>State=Default</Caption>
            <UserMenuRow state="Default" />
          </div>
          <div className="flex flex-col gap-2">
            <Caption>State=Hover</Caption>
            <UserMenuRow state="Hover" />
          </div>
        </div>
      </Group>

      <Group title="User Menu">
        <div className="flex flex-col gap-2">
          <Caption>Type=MiQer, Platform=UFP</Caption>
          <UserMenu />
        </div>
      </Group>

      <Group title="Avatar">
        <div className="flex flex-wrap items-end gap-x-10 gap-y-6">
          {(
            [
              { plan: "Pro", state: "Picture", size: 40 },
              { plan: "Pro", state: "Picture", size: 44 },
              { plan: "Standard", state: "Picture", size: 40 },
              { plan: "Standard", state: "Picture", size: 44 },
              { plan: "Pro", state: "Initials", size: 40 },
              { plan: "Pro", state: "Initials", size: 44 },
              { plan: "Standard", state: "Initials", size: 44 },
              { plan: "Standard", state: "Initials", size: 40 },
            ] as { plan: AvatarPlan; state: AvatarState; size: 40 | 44 }[]
          ).map((v, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Caption>{`${v.state}, ${v.plan}, ${v.size}`}</Caption>
              <Avatar plan={v.plan} state={v.state} size={v.size} />
            </div>
          ))}
        </div>
      </Group>
    </section>
  );
}
