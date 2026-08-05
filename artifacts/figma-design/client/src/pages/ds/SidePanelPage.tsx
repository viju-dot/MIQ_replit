import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

const A = "/figmaAssets/side-panel";

/* ------------------------------------------------------------------ */
/* Header Action                                                       */
/* ------------------------------------------------------------------ */

function HeaderActionPagination() {
  return (
    <div className="flex h-[42px] flex-col items-end justify-end shrink-0">
      <div className="flex items-center justify-end bg-white shrink-0">
        <div className="flex items-center justify-center p-[7px] rounded-[2px] shrink-0">
          <div className="flex items-center justify-center p-[2px] size-[20px] shrink-0">
            <img alt="" className="block size-full max-w-none" src={`${A}/caret-left.svg`} />
          </div>
        </div>
        <div className="flex items-center justify-center p-[7px] rounded-[2px] shrink-0">
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
      <div className="flex items-center justify-center p-[7px] rounded-[2px] shrink-0">
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
    <div className="flex w-[156px] flex-col items-start gap-0 rounded-[2px] border border-solid border-[#c6c6cc] bg-white shrink-0">
      <div className="flex w-full items-center gap-2 rounded-[2px] pl-[12px] pr-[8px] shrink-0">
        <div className="flex min-w-0 flex-1 items-start gap-2 py-[2.5px]">
          <div className="flex min-w-0 flex-1 flex-col justify-center overflow-hidden text-ellipsis whitespace-nowrap font-['DM_Sans:Regular',_Helvetica] text-[12px] leading-[18px] text-[#4b4b59]">
            <p className="overflow-hidden text-ellipsis leading-[18px]">February, 2022</p>
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
      <p className="whitespace-nowrap text-center font-['DM_Sans:Medium',_Helvetica] font-medium text-[14px] leading-[20px] text-[#7c33b5]">
        Full campaign details
      </p>
    </div>
  );
}

function SmallOutlineButton() {
  return (
    <div className="flex h-[24px] items-start gap-0 rounded-[2px] shrink-0">
      <div className="flex h-[24px] items-center justify-center gap-[10px] rounded-[2px] border border-solid border-[#4b4b59] pl-[6px] pr-[6px] py-[2px] shrink-0">
        <div className="flex flex-col justify-center whitespace-nowrap text-center font-['DM_Sans:Medium',_Helvetica] font-medium text-[14px] leading-[20px] text-[#4b4b59]">
          <p className="leading-[20px]">Button</p>
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
      <div className="flex items-center gap-1 rounded-[2px] shrink-0">
        <p className="whitespace-nowrap text-center font-['DM_Sans:Medium',_Helvetica] font-medium text-[14px] leading-[20px] text-[#7c33b5]">
          Link
        </p>
      </div>
      <div className="flex items-center justify-end gap-0 rounded-[2px] border border-solid border-[#4b4b59] px-[12px] py-[7px] shrink-0">
        <div className="flex items-center justify-center gap-1 rounded-[2px] shrink-0">
          <p className="whitespace-nowrap text-center font-['DM_Sans:Medium',_Helvetica] font-medium text-[14px] leading-[20px] text-[#4b4b59]">
            Default
          </p>
        </div>
      </div>
      <div className="flex items-center justify-end gap-0 rounded-[2px] bg-[#7c33b5] px-[12px] py-[7px] shrink-0">
        <div className="flex items-center justify-center gap-1 rounded-[2px] shrink-0">
          <p className="whitespace-nowrap text-center font-['DM_Sans:Medium',_Helvetica] font-medium text-[14px] leading-[20px] text-white">
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
      className="flex h-[66px] w-full flex-wrap items-center justify-center content-center bg-white shrink-0"
      style={{
        filter:
          "drop-shadow(0px -1px 2px rgba(113,113,128,0.12)) drop-shadow(0px -8px 8px rgba(113,113,128,0.08))",
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
        <div className="flex min-w-0 flex-1 flex-col justify-center overflow-hidden text-ellipsis whitespace-nowrap font-['DM_Sans:Medium',_Helvetica] font-medium text-[14px] text-[#13131a]">
          <p className="overflow-hidden text-ellipsis leading-[20px]">Title</p>
        </div>
      </div>
      {subtitle && (
        <div className="flex w-full items-start shrink-0">
          <div className="flex min-w-0 flex-1 flex-col justify-center self-stretch overflow-hidden text-ellipsis whitespace-nowrap font-['DM_Sans:Regular',_Helvetica] text-[12px] text-[#282833]">
            <p className="overflow-hidden text-ellipsis leading-[18px]">Subtitle</p>
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
      className={`flex h-[720px] max-w-full flex-col bg-[#f7f7fa] ${widthClass}`}
      style={{
        filter:
          "drop-shadow(0px 1px 2px rgba(113,113,128,0.08)) drop-shadow(0px 8px 8px rgba(113,113,128,0.04))",
      }}
    >
      {/* Header (all sizes share a header bar) */}
      {is400 ? (
        <div className="flex w-full flex-col items-start shrink-0">
          <div className="flex w-full flex-wrap items-center content-center gap-[10px_16px] bg-[#ebebf0] p-[16px] shrink-0">
            <TitleArea subtitle={subtitle} titleIcon={titleIcon} fullWidthTitle />
            <HeaderActionPagination />
          </div>
          {subnav && (
            <div className="flex w-full items-start gap-0 border-b border-solid border-[#e1e1e8] bg-white px-[16px] py-[8px] shrink-0">
              <div className="flex min-w-px flex-1 flex-wrap items-start justify-between content-start gap-y-4">
                <DateInput />
                <CampaignLink />
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          <div className="flex w-full items-center gap-[10px] bg-[#ebebf0] p-[16px] shrink-0">
            <div className="flex flex-1 flex-row items-center self-stretch">
              <TitleArea subtitle={subtitle} titleIcon={titleIcon} fullWidthTitle={is800} />
            </div>
            <HeaderActionPagination />
          </div>
          {subnav && (
            <div className="flex w-full flex-wrap items-start gap-y-4 border-b border-solid border-[#e1e1e8] bg-white px-[16px] py-[8px] shrink-0">
              <div className="flex min-w-[288px] flex-1 flex-wrap items-center justify-between content-center gap-y-4">
                <div className="flex flex-wrap items-center gap-4 content-center shrink-0">
                  <div className="flex flex-col justify-center whitespace-nowrap font-['DM_Sans:Medium',_Helvetica] font-medium text-[16px] leading-[24px] tracking-[-0.08px] text-[#13131a]">
                    <p className="leading-[24px]">Text</p>
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
        <div className="min-h-px w-full flex-1 bg-[#ebebf0]" />
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
    "container/surface/background": "#f7f7fa",
    "container/header/background": "#ebebf0",
    "container/body/background": "#ebebf0",
    "container/footer/background": "#ffffff",
    "border/divider": "#e1e1e8",
    "text/title": "#13131a",
    "text/subtitle": "#282833",
    "text/brand": "#7c33b5",
    "size/400": "400px",
    "size/600": "600px",
    "size/800": "800px",
    "size/height": "720px",
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
    <div className="bg-[#ebebf0] p-2">
      {props.type === "Close" ? <HeaderActionClose /> : <HeaderActionPagination />}
    </div>
  ),
  tokens: {
    "container/action/background": "#ffffff",
    "radius/action": "2px",
    "size/icon": "20px",
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
    "container/footer/background": "#ffffff",
    "button/primary/background": "#7c33b5",
    "button/secondary/border": "#4b4b59",
    "text/link": "#7c33b5",
    "text/default": "#4b4b59",
    "radius/button": "2px",
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
