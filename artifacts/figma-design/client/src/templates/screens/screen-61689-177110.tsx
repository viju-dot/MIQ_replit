/* =========================================================================
 * Screen Template — Activation Strategy Review (61689-177110)
 *
 * LIVE front-end screen reproduced from the harvested Figma reference code at
 * design-refs/screen-templates/code/61689-177110.txt. Composes the shared
 * chrome (TemplateNavigation / TemplateFooter) around the review body, and
 * uses real Fiber DS primitives (Tabs, Card, Separator) where they match the
 * design. Custom compositions (stepper, KPI grids, selected-option rows) are
 * built as faithful JSX. Static, read-only reference implementation.
 * ========================================================================= */

import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TemplateFooter, TemplateNavigation } from "@/templates/chrome";

const ASSET_BASE = `${import.meta.env.BASE_URL}figmaAssets/screen-templates/61689-177110/`;

const imgIconCheckCircle = `${ASSET_BASE}ee8179ad-732f-4457-8273-65abad75c508.svg`;
const imgStep1LineContainer = `${ASSET_BASE}72e36b38-631d-4f26-826c-413ed7d5b1cc.svg`;
const imgStep2LineContainer = `${ASSET_BASE}2f6b5a4d-bee0-4056-b4f2-f21e59e7428c.svg`;
const imgStep4LineContainer = `${ASSET_BASE}bab5a3d1-300d-410c-82bf-c068fa0b00d8.svg`;
const imgStepperInactive5 = `${ASSET_BASE}7a019ee4-a2b7-4f08-bf57-d740e8de38ad.svg`;
const imgCircle = `${ASSET_BASE}dd258d6a-0a8e-4f4a-b9e5-eb0fb459131d.svg`;
const imgCheckOption = `${ASSET_BASE}16fe4ff9-d5db-409b-a436-56389803a709.svg`;
const imgCheckOptionAlt = `${ASSET_BASE}a547d723-0596-4362-b340-2fd7de3af162.svg`;

const FONT = '"DM Sans", sans-serif';

const C = {
  bgLvl2: "var(--surface-background-lvl2,#f7f7fa)",
  surfaceLvl1: "var(--surface-background-lvl1,#ffffff)",
  textLvl1: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
  textLvl3: "var(--surface-foreground-static-neutral-lvl3,#717180)",
  borderSubtle: "var(--border-static-subtle-neutral,#e1e1e8)",
  progressNeutral: "var(--progress-neutral,#e1e1e8)",
  tabsTrackBg: "var(--container-dynamic-neutral-subtle-background-default-variation,#ebebf0)",
  tabInactiveFg: "var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)",
  tabActiveBg: "var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)",
  tabActiveFg: "var(--container-dynamic-brand-subtle-foreground-selected,#7c33b5)",
};

const CARD_SHADOW =
  "0px 1px 4px 0px rgba(113,113,128,0.08), 0px 8px 16px 0px rgba(113,113,128,0.04)";

/* ---------------------------------------------------------------------- */
/* Helpers                                                                 */
/* ---------------------------------------------------------------------- */

function StepDone({ label1, label2 }: { label1: string; label2: string }) {
  return (
    <div className="flex w-[24px] shrink-0 flex-col items-center gap-[12px]">
      <div className="relative size-[24px] shrink-0">
        <img alt="" aria-hidden="true" src={imgIconCheckCircle} className="absolute inset-0 block size-full max-w-none" />
      </div>
      <div
        className="shrink-0 whitespace-nowrap text-center text-[14px] leading-[20px]"
        style={{ color: C.textLvl1 }}
      >
        <p className="mb-0 leading-[20px]">{label1}</p>
        <p className="leading-[20px]">{label2}</p>
      </div>
    </div>
  );
}

function StepLine({ src }: { src: string }) {
  return (
    <div className="relative h-[24px] min-w-px flex-1">
      <img alt="" aria-hidden="true" src={src} className="absolute inset-0 block size-full max-w-none" />
    </div>
  );
}

function CardHeaderBar({ title }: { title: string }) {
  return (
    <div className="flex w-full flex-col items-start">
      <div className="flex w-full items-center gap-[8px] p-[16px]">
        <p
          className="shrink-0 whitespace-nowrap text-[16px] font-medium leading-[24px]"
          style={{ color: C.textLvl1, letterSpacing: "-0.08px" }}
        >
          {title}
        </p>
      </div>
      <div className="h-0 w-full" style={{ borderTop: `1px solid ${C.borderSubtle}` }} />
    </div>
  );
}

function KpiItem({ label, value, minWidth = 200 }: { label: string; value: string; minWidth?: number }) {
  return (
    <div className="flex flex-1 flex-col items-start gap-[8px]" style={{ minWidth }}>
      <p className="shrink-0 text-[12px] leading-[18px]" style={{ color: C.textLvl3 }}>
        {label}
      </p>
      <p
        className="shrink-0 text-[16px] font-medium leading-[24px]"
        style={{ color: C.textLvl1, letterSpacing: "-0.08px" }}
      >
        {value}
      </p>
    </div>
  );
}

function SelectedOption({
  title,
  body,
  icon = imgCheckOption,
  fullWidth = false,
}: {
  title: string;
  body: string;
  icon?: string;
  fullWidth?: boolean;
}) {
  return (
    <div className={`flex flex-col items-start gap-[8px] ${fullWidth ? "w-full" : ""}`}>
      <div className="flex w-full items-center gap-[8px]">
        <span className="flex size-[24px] shrink-0 items-center justify-center p-[2px]">
          <img alt="" aria-hidden="true" src={icon} className="size-[16.25px]" />
        </span>
        <p
          className="shrink-0 whitespace-nowrap text-[14px] font-medium leading-[20px]"
          style={{ color: C.textLvl1 }}
        >
          {title}
        </p>
      </div>
      <p className="w-full text-[14px] leading-[20px] text-black">{body}</p>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Screen                                                                  */
/* ---------------------------------------------------------------------- */

export default function Screen_61689_177110(): JSX.Element {
  return (
    <div
      className="relative flex w-[1280px] flex-col items-start gap-[32px] pb-[66px]"
      style={{ backgroundColor: C.bgLvl2, fontFamily: FONT }}
    >
      {/* Navigation chrome */}
      <TemplateNavigation activeItem="Audiences" />

      {/* Body */}
      <div className="flex w-full items-start overflow-clip px-[64px] pb-[32px]">
        <div className="flex min-w-px flex-1 flex-col items-start gap-[24px]">
          <div className="flex w-full flex-col items-start gap-[24px]" style={{ backgroundColor: C.bgLvl2 }}>
            <div className="flex w-full flex-col items-center gap-[24px]">
              {/* Header + tabs */}
              <div className="flex w-full flex-col items-start gap-[24px]">
                <div className="flex w-full flex-col items-start gap-[8px]">
                  <div className="flex w-full items-center gap-[8px]">
                    <p
                      className="shrink-0 whitespace-nowrap text-[32px] font-semibold leading-[40px]"
                      style={{ color: C.textLvl1, letterSpacing: "-0.64px" }}
                    >
                      OMC Healthcare Hub
                    </p>
                  </div>
                  <p
                    className="w-full min-w-full text-[14px] font-medium leading-[20px]"
                    style={{ color: C.textLvl1 }}
                  >
                    All patient data is aggregated at ZIP+3 level in compliance with HIPAA Safe Harbor de-identification
                    standards (45 CFR §164.514(b)(2)). No individual patient identifiers are used.
                  </p>
                </div>

                {/* Tabs (pill) — Activation strategy selected */}
                <Tabs value="activation">
                  <TabsList
                    className="flex h-[34px] items-center gap-0 rounded-[100px] p-[2px]"
                    style={{ backgroundColor: C.tabsTrackBg }}
                  >
                    <TabsTrigger
                      value="intelligence"
                      className="flex h-[30px] items-center rounded-[20px] px-[16px] py-[5px] text-[14px] font-normal leading-[20px] data-[state=active]:shadow-none"
                      style={{ color: C.tabInactiveFg }}
                    >
                      Intelligence
                    </TabsTrigger>
                    <TabsTrigger
                      value="activation"
                      className="flex h-[30px] items-center rounded-[20px] px-[16px] py-[5px] text-[14px] font-normal leading-[20px] data-[state=active]:shadow-none"
                      style={{ backgroundColor: C.tabActiveBg, color: C.tabActiveFg }}
                    >
                      Activation strategy
                    </TabsTrigger>
                    <TabsTrigger
                      value="campaign"
                      className="flex h-[30px] items-center rounded-[20px] px-[16px] py-[5px] text-[14px] font-normal leading-[20px] data-[state=active]:shadow-none"
                      style={{ color: C.tabInactiveFg }}
                    >
                      Campaign performance
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>

              {/* Stepper */}
              <div className="flex w-full max-w-[1152px] flex-col items-center">
                <div className="flex w-full items-start justify-between">
                  <div className="flex w-[60px] shrink-0 flex-col items-start py-[11px]">
                    <div className="h-[2px] w-full" style={{ backgroundColor: C.progressNeutral }} />
                  </div>
                  <StepDone label1="Choose" label2="strategy" />
                  <StepLine src={imgStep1LineContainer} />
                  <StepDone label1="Campaign " label2="parameters" />
                  <StepLine src={imgStep2LineContainer} />
                  <StepDone label1="Audience " label2="segments" />
                  <StepLine src={imgStep2LineContainer} />
                  <StepDone label1="Custom " label2="tactic" />
                  <StepLine src={imgStep4LineContainer} />
                  {/* Step 5 — current (Review plan) */}
                  <div className="flex w-[24px] shrink-0 flex-col items-center gap-[12px]">
                    <div className="relative size-[24px] shrink-0">
                      <div className="absolute inset-[-33.33%_-66.67%_-100%_-66.67%]">
                        <img alt="" aria-hidden="true" src={imgStepperInactive5} className="block size-full max-w-none" />
                      </div>
                      <div className="absolute inset-[31.25%]">
                        <img alt="" aria-hidden="true" src={imgCircle} className="absolute inset-0 block size-full max-w-none" />
                      </div>
                    </div>
                    <div
                      className="flex shrink-0 items-center justify-center whitespace-nowrap text-center text-[14px] font-medium leading-[20px]"
                      style={{ color: C.textLvl1 }}
                    >
                      <div>
                        <p className="mb-0 leading-[20px]">Review </p>
                        <p className="leading-[20px]">plan</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex w-[60px] shrink-0 flex-col items-start py-[11px]">
                    <div className="h-[2px] w-full" style={{ backgroundColor: C.progressNeutral }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Card: Plan overview */}
            <Card
              className="flex w-full min-w-[180px] items-start overflow-clip rounded-[2px] border-0"
              style={{ backgroundColor: C.surfaceLvl1, boxShadow: CARD_SHADOW }}
            >
              <div className="flex min-w-px flex-1 flex-col items-start">
                <CardHeaderBar title="Plan overview" />
                <div className="flex w-full flex-col items-start gap-[8px] p-[16px]">
                  <div className="flex w-full flex-col items-start gap-[16px]">
                    <div className="flex w-full flex-wrap content-center items-center gap-[12px]">
                      <KpiItem label="Strategy" value="DTC-HCP synergy" />
                      <KpiItem label="Brand" value="Capvaxive" />
                      <KpiItem label="Type" value="DTC" />
                      <KpiItem label="Channels" value="CTV, Display, OLV, Youtube" />
                    </div>
                    <Separator className="w-full" style={{ backgroundColor: C.borderSubtle }} />
                    <div className="flex w-full min-w-[450px] flex-col items-start gap-[8px]">
                      <p className="shrink-0 whitespace-nowrap text-[12px] leading-[18px]" style={{ color: C.textLvl3 }}>
                        Synergy goal
                      </p>
                      <p
                        className="w-full min-w-full text-[16px] font-medium leading-[24px]"
                        style={{ color: C.textLvl1, letterSpacing: "-0.08px" }}
                      >
                        Launch a DTC campaign guided by past or current HCP performance
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Card: Selected custom tactics */}
            <div className="flex w-full items-start">
              <Card
                className="flex min-w-[180px] flex-1 items-start self-stretch overflow-clip rounded-[2px] border-0"
                style={{ backgroundColor: C.surfaceLvl1, boxShadow: CARD_SHADOW }}
              >
                <div className="flex min-w-px flex-1 flex-col items-start">
                  <CardHeaderBar title="Selected custom tactics" />
                  <div className="flex w-full flex-col items-start gap-[8px] p-[16px]">
                    <div className="flex w-full flex-col items-start gap-[16px]">
                      <SelectedOption title="Frequency capping" body="Cap at 12x across 4 channels" />
                      <Separator className="w-full" style={{ backgroundColor: C.borderSubtle }} />
                      <SelectedOption title="Optimized budget allocation" body="Total budget: USD 5,000,000" />
                      <div className="h-px w-full" style={{ borderTop: `1px solid ${C.borderSubtle}` }} />
                      <SelectedOption title="Channel projections" body="Cap at 12x across 4 channels" />
                      <div className="h-px w-full" style={{ borderTop: `1px solid ${C.borderSubtle}` }} />
                      <SelectedOption title="Smart budget allocation" body="Optimized budget across 4 channels" fullWidth />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Card: DTC-HCP synergy configuration */}
            <Card
              className="flex w-full min-w-[180px] items-start overflow-clip rounded-[2px] border-0"
              style={{ backgroundColor: C.surfaceLvl1, boxShadow: CARD_SHADOW }}
            >
              <div className="flex min-w-px flex-1 flex-col items-start">
                <CardHeaderBar title="DTC-HCP synergy configuration" />
                <div className="flex w-full flex-col items-start gap-[8px] p-[16px]">
                  <div className="flex w-full flex-col items-start gap-[16px]">
                    <div className="flex w-full flex-wrap content-center items-center gap-[12px]">
                      <KpiItem label="Linked campaigns" value="0" />
                      <KpiItem label="Geo activation" value="Enabled" />
                      <KpiItem label="Provider activation" value="Disabled" />
                      <KpiItem label="Audience activation" value="Enabled" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            {/* Card: Activation plan summary */}
            <div className="flex w-full items-start">
              <Card
                className="flex min-w-[180px] flex-1 items-start self-stretch overflow-clip rounded-[2px] border-0"
                style={{ backgroundColor: C.surfaceLvl1, boxShadow: CARD_SHADOW }}
              >
                <div className="flex min-w-px flex-1 flex-col items-start">
                  <CardHeaderBar title="Activation plan summary" />
                  <div className="flex w-full flex-col items-start gap-[8px] p-[16px]">
                    <div className="flex w-full flex-col items-start gap-[16px]">
                      <SelectedOption title="Frequency capping" body="Cap at 12x across 4 channels" />
                      <Separator className="w-full" style={{ backgroundColor: C.borderSubtle }} />
                      <SelectedOption
                        title="Optimized budget allocation"
                        body="Total budget: USD 5,000,000"
                        icon={imgCheckOptionAlt}
                      />
                      <div className="h-px w-full" style={{ borderTop: `1px solid ${C.borderSubtle}` }} />
                      <SelectedOption title="Channel projections" body="Cap at 12x across 4 channels" />
                      <div className="h-px w-full" style={{ borderTop: `1px solid ${C.borderSubtle}` }} />
                      <SelectedOption title="Smart budget allocation" body="Optimized budget across 4 channels" fullWidth />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>

      {/* Footer chrome */}
      <div className="absolute bottom-0 left-0 right-0">
        <TemplateFooter secondaryLabel="Back" primaryLabel="Download excel" screenMargin={64} />
      </div>
    </div>
  );
}
