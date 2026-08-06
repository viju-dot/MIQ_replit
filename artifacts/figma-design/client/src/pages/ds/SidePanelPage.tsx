import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

const A = "/figmaAssets/side-panel";

/* ------------------------------------------------------------------ */
/* Header Action                                                       */
/* ------------------------------------------------------------------ */

function HeaderActionPagination() {
  return (
    <div className="flex h-[42px] flex-col items-end justify-end shrink-0">
      <div className="flex items-center justify-end bg-[var(--surface-background-lvl1,#ffffff)] shrink-0">
        <div className="flex items-center justify-center p-[7px] rounded-[var(--radiuses-small,2px)] shrink-0">
          <div className="flex items-center justify-center p-[2px] size-[20px] shrink-0">
            <img alt="" className="block size-full max-w-none" src={`${A}/caret-left.svg`} />
          </div>
        </div>
        <div className="flex items-center justify-center p-[7px] rounded-[var(--radiuses-small,2px)] shrink-0">
          <div className="flex items-center justify-center p-[2px] size-[20px] shrink-0">
            <img alt="" className="block size-full max-w-none" src={`${A}/caret-right.svg`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function HeaderActionClose() {
  return (
    <div className="flex flex-col items-end justify-center shrink-0">
      <div className="flex items-center justify-center p-[7px] rounded-[var(--radiuses-small,2px)] shrink-0">
        <div className="flex items-center justify-center p-[5px] size-[20px] shrink-0">
          <img alt="Close" className="block size-full max-w-none" src={`${A}/x-close.svg`} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sub-nav bits                                                        */
/* ------------------------------------------------------------------ */

function DateInput() {
  return (
    <div className="flex w-[156px] flex-col items-start gap-0 rounded-[var(--radiuses-small,2px)] border border-solid border-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)] bg-[var(--surface-background-lvl1,#ffffff)] shrink-0">
      <div className="flex w-full items-center gap-2 rounded-[var(--radiuses-small,2px)] pl-[12px] pr-[8px] shrink-0">
        <div className="flex min-w-0 flex-1 items-start gap-2 py-[2.5px]">
          <div className="flex min-w-0 flex-1 flex-col justify-center overflow-hidden text-ellipsis whitespace-nowrap font-['DM_Sans:Regular',_Helvetica] text-[length:var(--body-sm-regular-size,12px)] leading-[var(--body-sm-regular-line-height,18px)] text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)]">
            <p className="overflow-hidden text-ellipsis leading-[var(--body-sm-regular-line-height,18px)]">February, 2022</p>
          </div>
        </div>
        <div className="flex h-[24px] items-center justify-center shrink-0">
          <div className="flex items-center justify-center p-[2px] size-[16px] shrink-0">
            <img alt="" className="block h-[13px] w-[12px] max-w-none" src={`${A}/calendar-blank.svg`} />
          </div>
        </div>
      </div>
    </div>
  );
}

function CampaignLink() {
  return (
    <div className="flex items-center justify-end gap-1 shrink-0">
      <div className="flex items-center justify-center size-[24px] shrink-0">
        <img alt="" className="block size-[24px] max-w-none" src={`${A}/arrow-square-out.svg`} />
      </div>
      <p className="whitespace-nowrap text-center font-['DM_Sans:Medium',_Helvetica] font-medium text-[length:var(--body-md-medium-size,14px)] leading-[var(--body-md-medium-line-height,20px)] text-[var(--surface-foreground-dynamic-brand-default,#7c33b5)]">
        Full campaign details
      </p>
    </div>
  );
}

function SmallOutlineButton() {
  return (
    <div className="flex h-[24px] items-start gap-0 rounded-[var(--radiuses-small,2px)] shrink-0">
      <div className="flex h-[24px] items-center justify-center gap-[10px] rounded-[var(--radiuses-small,2px)] border border-solid border-[var(--border-dynamic-neutral-bold-default,#4b4b59)] pl-[6px] pr-[6px] py-[2px] shrink-0">
        <div className="flex flex-col justify-center whitespace-nowrap text-center font-['DM_Sans:Medium',_Helvetica] font-medium text-[length:var(--body-md-medium-size,14px)] leading-[var(--body-md-medium-line-height,20px)] text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)]">
          <p className="leading-[var(--body-md-medium-line-height,20px)]">Button</p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

function FooterActions() {
  return (
    <div className="flex flex-1 items-center justify-end gap-4 min-w-px px-4 py-4">
      <div className="flex items-center gap-1 rounded-[var(--radiuses-small,2px)] shrink-0">
        <p className="whitespace-nowrap text-center font-['DM_Sans:Medium',_Helvetica] font-medium text-[length:var(--body-md-medium-size,14px)] leading-[var(--body-md-medium-line-height,20px)] text-[var(--surface-foreground-dynamic-brand-default,#7c33b5)]">
          Link
        </p>
      </div>
      <div className="flex items-center justify-end gap-0 rounded-[var(--radiuses-small,2px)] border border-solid border-[var(--border-dynamic-neutral-bold-default,#4b4b59)] px-[12px] py-[7px] shrink-0">
        <div className="flex items-center justify-center gap-1 rounded-[var(--radiuses-small,2px)] shrink-0">
          <p className="whitespace-nowrap text-center font-['DM_Sans:Medium',_Helvetica] font-medium text-[length:var(--body-md-medium-size,14px)] leading-[var(--body-md-medium-line-height,20px)] text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)]">
            Default
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-0 rounded-[var(--radiuses-small,2px)] bg-[var(--container-dynamic-brand-bold-background-default,#7c33b5)] px-[12px] py-[7px] shrink-0">
        <div className="flex items-center justify-center gap-1 rounded-[var(--radiuses-small,2px)] shrink-0">
          <p className="whitespace-nowrap text-center font-['DM_Sans:Medium',_Helvetica] font-medium text-[length:var(--body-md-medium-size,14px)] leading-[var(--body-md-medium-line-height,20px)] text-[var(--container-dynamic-brand-bold-foreground-default,#ffffff)]">
            Default
          </p>
        </div>
      </div>
    </div>
  );
}

function SidePanelFooter() {
  return (
    <div
      className="flex h-[66px] w-full flex-wrap items-center justify-center content-center bg-[var(--surface-background-lvl1,#ffffff)] shrink-0"
      style={{
        filter:
          "drop-shadow(0px -1px 2px var(--shadow-lvl12, rgba(113,113,128,0.12))) drop-shadow(0px -8px 8px var(--shadow-lvl8, rgba(113,113,128,0.08)))",
      }}
    >
      <FooterActions />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Side Panel                                                          */
/* ------------------------------------------------------------------ */

type SidePanelProps = {
  size?: "400" | "600" | "800";
  subnav?: boolean;
  subtitle?: boolean;
  titleIcon?: boolean;
};

function TitleArea({
  subtitle,
  titleIcon,
  fullWidthTitle,
}: {
  subtitle: boolean;
  titleIcon: boolean;
  fullWidthTitle: boolean;
}) {
  return (
    <div className="flex min-w-px flex-1 flex-col items-start gap-1">
      <div className={`flex items-center gap-2 shrink-0 ${fullWidthTitle ? "w-full" : ""}`}>
        {titleIcon && (
          <div className="flex items-center justify-center p-[2px] size-[24px] shrink-0">
            <img
              alt=""
              className="block size-[19.25px] max-w-none"
              src={`${A}/user-circle.svg`}
            />
          </div>
        )}
        <div className="flex min-w-0 flex-1 flex-col justify-center overflow-hidden text-ellipsis whitespace-nowrap font-['DM_Sans:Medium',_Helvetica] font-medium text-[length:var(--body-md-medium-size,14px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]">
          <p className="overflow-hidden text-ellipsis leading-[var(--body-md-medium-line-height,20px)]">Title</p>
        </div>
      </div>
      {subtitle && (
        <div className="flex w-full items-start shrink-0">
          <div className="flex min-w-0 flex-1 flex-col justify-center self-stretch overflow-hidden text-ellipsis whitespace-nowrap font-['DM_Sans:Regular',_Helvetica] text-[length:var(--body-sm-regular-size,12px)] text-[var(--surface-foreground-static-neutral-lvl2,#282833)]">
            <p className="overflow-hidden text-ellipsis leading-[var(--body-sm-regular-line-height,18px)]">Subtitle</p>
          </div>
        </div>
      )}
    </div>
  );
}

function SidePanel({
  size = "400",
  subnav = true,
  subtitle = true,
  titleIcon = false,
}: SidePanelProps) {
  const is400 = size === "400";
  const is600 = size === "600";
  const is800 = size === "800";

  const widthClass = is800 ? "w-[800px]" : is600 ? "w-[600px]" : "w-[400px]";

  return (
    <div
      className={`flex h-[720px] max-w-full flex-col bg-[var(--surface-background-lvl2,#f7f7fa)] ${widthClass}`}
      style={{
        filter:
          "drop-shadow(0px 1px 2px var(--shadow-lvl8, rgba(113,113,128,0.08))) drop-shadow(0px 8px 8px var(--shadow-lvl4, rgba(113,113,128,0.04)))",
      }}
    >
      {/* Header (all sizes share a header bar) */}
      {is400 ? (
        <div className="flex w-full flex-col items-start shrink-0">
          <div className="flex w-full flex-wrap items-center content-center gap-[10px_16px] bg-[var(--surface-background-lvl3,#ebebf0)] p-[16px] shrink-0">
            <TitleArea subtitle={subtitle} titleIcon={titleIcon} fullWidthTitle />
            <HeaderActionPagination />
          </div>
          {subnav && (
            <div className="flex w-full items-start gap-0 border-b border-solid border-[var(--border-static-subtle-neutral,#e1e1e8)] bg-[var(--surface-background-lvl1,#ffffff)] px-[16px] py-[8px] shrink-0">
              <div className="flex min-w-px flex-1 flex-wrap items-start justify-between content-start gap-y-4">
                <DateInput />
                <CampaignLink />
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex w-full items-center gap-[10px] bg-[var(--surface-background-lvl3,#ebebf0)] p-[16px] shrink-0">
            <div className="flex flex-1 flex-row items-center self-stretch">
              <TitleArea subtitle={subtitle} titleIcon={titleIcon} fullWidthTitle={is800} />
            </div>
            <HeaderActionPagination />
          </div>
          {subnav && (
            <div className="flex w-full flex-wrap items-start gap-y-4 border-b border-solid border-[var(--border-static-subtle-neutral,#e1e1e8)] bg-[var(--surface-background-lvl1,#ffffff)] px-[16px] py-[8px] shrink-0">
              <div className="flex min-w-[288px] flex-1 flex-wrap items-center justify-between content-center gap-y-4">
                <div className="flex flex-wrap items-center gap-4 content-center shrink-0">
                  <div className="flex flex-col justify-center whitespace-nowrap font-['DM_Sans:Medium',_Helvetica] font-medium text-[length:var(--headline-xs-medium-size,16px)] leading-[var(--headline-xs-medium-line-height,24px)] tracking-[-0.08px] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]">
                    <p className="leading-[var(--headline-xs-medium-line-height,24px)]">Text</p>
                  </div>
                  <DateInput />
                </div>
                {is800 ? (
                  <div className="flex flex-wrap items-center gap-4 content-center min-w-[288px] shrink-0">
                    <div className="flex items-center gap-4 shrink-0">
                      <SmallOutlineButton />
                      <SmallOutlineButton />
                    </div>
                    <CampaignLink />
                  </div>
                ) : (
                  <CampaignLink />
                )}
              </div>
            </div>
          )}
        </>
      )}

      {/* Swap container (body content placeholder) */}
      <div className="flex min-h-px flex-1 flex-col items-start w-full">
        <div className="min-h-px w-full flex-1 bg-[var(--surface-background-lvl3,#ebebf0)]" />
      </div>

      {/* Footer */}
      <SidePanelFooter />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Playground configs                                                  */
/* ------------------------------------------------------------------ */

const sidePanelConfig: PlaygroundConfig = {
  name: "Side Panel",
  description:
    "Slide-over panel — Size (400/600/800) with optional sub-navigation, subtitle, and title icon.",
  controls: [
    {
      kind: "select",
      name: "size",
      label: "Size",
      options: ["400", "600", "800"],
      defaultValue: "600",
      asTabs: true,
    },
    { kind: "boolean", name: "subnav", label: "Sub-navigation", defaultValue: true },
    { kind: "boolean", name: "subtitle", label: "Subtitle", defaultValue: true },
    { kind: "boolean", name: "titleIcon", label: "Title icon", defaultValue: false },
  ],
  render: (props) => (
    <SidePanel
      size={props.size as "400" | "600" | "800"}
      subnav={props.subnav === true}
      subtitle={props.subtitle === true}
      titleIcon={props.titleIcon === true}
    />
  ),
  tokens: {
    "surface/background/lvl2": "var(--surface-background-lvl2)",
    "surface/background/lvl3": "var(--surface-background-lvl3)",
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "border/dynamic/neutral/subtle/default": "var(--border-dynamic-neutral-subtle-default)",
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "surface/foreground/static/neutral/lvl2": "var(--surface-foreground-static-neutral-lvl2)",
    "surface/foreground/dynamic/brand/default": "var(--surface-foreground-dynamic-brand-default)",
    "surface/foreground/dynamic/neutral/default/regular": "var(--surface-foreground-dynamic-neutral-default-regular)",
    "Radiuses/small": "var(--radiuses-small)",
    "Headline Xs/Medium": "var(--headline-xs-medium-size)",
    "Body Md/Medium": "var(--body-md-medium-size)",
    "Body Sm/Regular": "var(--body-sm-regular-size)",
  },
};

const headerActionConfig: PlaygroundConfig = {
  name: "Header Action",
  description: "Trailing header controls — Pagination (caret prev/next) or Close.",
  controls: [
    {
      kind: "select",
      name: "type",
      label: "Type",
      options: ["Pagination", "Close"],
      defaultValue: "Pagination",
      asTabs: true,
    },
  ],
  render: (props) => (
    <div className="bg-[var(--surface-background-lvl3,#ebebf0)] p-2">
      {props.type === "Close" ? <HeaderActionClose /> : <HeaderActionPagination />}
    </div>
  ),
  tokens: {
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "surface/background/lvl3": "var(--surface-background-lvl3)",
    "Radiuses/small": "var(--radiuses-small)",
  },
};

const footerConfig: PlaygroundConfig = {
  name: "Side Panel Footer",
  description: "Actions-right footer — Link, Default outline button, and Default filled button.",
  controls: [],
  render: () => (
    <div className="w-full max-w-[1075px]">
      <SidePanelFooter />
    </div>
  ),
  tokens: {
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "container/dynamic/brand/bold/background/default": "var(--container-dynamic-brand-bold-background-default)",
    "container/dynamic/brand/bold/foreground/default": "var(--container-dynamic-brand-bold-foreground-default)",
    "border/dynamic/neutral/bold/default": "var(--border-dynamic-neutral-bold-default)",
    "surface/foreground/dynamic/brand/default": "var(--surface-foreground-dynamic-brand-default)",
    "surface/foreground/dynamic/neutral/default/regular": "var(--surface-foreground-dynamic-neutral-default-regular)",
    "Radiuses/small": "var(--radiuses-small)",
    "Body Md/Medium": "var(--body-md-medium-size)",
  },
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function SidePanelPage() {
  return (
    <section aria-label="Side Panel component playground" className="flex flex-col gap-6">
      <Playground config={sidePanelConfig} />
      <Playground config={headerActionConfig} />
      <Playground config={footerConfig} />
    </section>
  );
}
