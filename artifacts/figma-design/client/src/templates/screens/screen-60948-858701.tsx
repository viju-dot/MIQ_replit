/* =========================================================================
 * Screen Template — OMC Activation - Reach & Frequency Optimization (60948-858701)
 *
 * LIVE front-end screen reproduced from the harvested Figma reference code at
 * design-refs/screen-templates/code/60948-858701.txt. Fixed natural width
 * (1280px), light-mode. Composes the shared TemplateNavigation chrome; this
 * screen has NO footer chrome (it renders its own in-body action bar).
 * ========================================================================= */

import { type CSSProperties, type ReactNode } from "react";
import { TemplateNavigation } from "@/templates/chrome";
import { Checkbox } from "@/components/ui/checkbox";

/* ------------------------------------------------------------------ */
/* Assets                                                              */
/* ------------------------------------------------------------------ */
const A = `${import.meta.env.BASE_URL}figmaAssets/screen-templates/60948-858701/`;
const imgIconCheckCircle = `${A}34d68757-9202-43bc-9d8a-bf5c5ac056a3.svg`;
const imgStep1LineContainer = `${A}b7b2040e-3029-4666-add1-e82f0c7b65ef.svg`;
const imgStep2LineContainer = `${A}6f94b978-b51f-4b4d-b153-0ad441675b07.svg`;
const imgStepperInactive4 = `${A}7365c058-b6df-49f5-9310-6e219ab150f0.svg`;
const imgCircle = `${A}045735f4-5977-4f8b-883b-851a9f79f206.svg`;
const imgStep4LineContainer = `${A}657252d6-bff0-4ec7-951f-97aa052365e9.svg`;
const imgStepperInactive5 = `${A}a974969c-ce9a-498e-b733-e81990ed4d05.svg`;
const imgLineContainer = `${A}0a92d5b1-26e5-49e7-afc3-39bcc95cf503.svg`;
const imgInfoIcon = `${A}75de325c-d90d-4a11-b19a-4cd92f94e913.svg`;
const imgCaret = `${A}b27628e1-e32e-4740-99e1-f55b3abad8bb.svg`;
const imgChipCheck = `${A}c49ef76d-ddb0-4241-8c7e-efac7814f830.svg`;
const imgLineContainer1 = `${A}d3328250-0fc0-4936-972a-a5a52268e3ce.svg`;
const img3Slices = `${A}3b191c71-df9c-4e29-972f-a14889628312.svg`;
const img3Slices1 = `${A}9c94fe84-d55a-4889-abfe-71c99fbaac8a.svg`;
const img3Slices2 = `${A}7a44e8ca-04fe-49dc-aada-1a73596f1b2a.svg`;
const imgMarker1 = `${A}623c16a3-3f14-4373-a0f4-ca68d17b6c68.svg`;
const imgMarker2 = `${A}65efe4b4-cf2b-4c55-90f8-b005af01e658.svg`;
const imgMarker3 = `${A}cdf8e48e-3d1e-407d-bec5-34998f075fef.svg`;

/* ------------------------------------------------------------------ */
/* Tokens                                                              */
/* ------------------------------------------------------------------ */
const FONT = '"DM Sans", sans-serif';
const C = {
  bgLvl1: "var(--surface-background-lvl1,#ffffff)",
  bgLvl2: "var(--surface-background-lvl2,#f7f7fa)",
  neutralLvl1: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
  neutralLvl2: "var(--surface-foreground-static-neutral-lvl2,#282833)",
  neutralLvl3: "var(--surface-foreground-static-neutral-lvl3,#717180)",
  dynRegular: "var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)",
  dynDisabled: "var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)",
  borderSubtle: "var(--border-static-subtle-neutral,#e1e1e8)",
  borderInputSubtle: "var(--border-dynamic-neutral-subtle-default,#c6c6cc)",
  borderInfo: "var(--border-static-bold-info,#2360db)",
  borderBold: "var(--border-dynamic-neutral-bold-default,#4b4b59)",
  tabsTrackBg: "var(--container-dynamic-neutral-subtle-background-default-variation,#ebebf0)",
  tabSelectedFg: "var(--container-dynamic-brand-subtle-foreground-delected,#7c33b5)",
  chipBg: "var(--container-dynamic-neutral-subtle-background-disabled,rgba(113,113,128,0.1))",
  chipFg: "var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)",
  progressNeutral: "var(--progress-neutral,#e1e1e8)",
  cellFg: "var(--container-dynamic-neutral-subtle-foreground-default-variation,#13131a)",
  buttonDisabledBg: "var(--container-dynamic-neutral-subtle-background-disabled,rgba(113,113,128,0.1))",
  buttonDisabledFg: "var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)",
};

const cardShadow =
  "0px 1px 4px 0px rgba(113,113,128,0.08), 0px 8px 16px 0px rgba(113,113,128,0.04)";

/* ------------------------------------------------------------------ */
/* Small building blocks                                               */
/* ------------------------------------------------------------------ */

/** White smart-card with a header row + divider. */
function SmartCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div
      className="flex w-full min-w-[180px] shrink-0 flex-col items-start overflow-hidden rounded-[2px]"
      style={{ backgroundColor: C.bgLvl1, boxShadow: cardShadow }}
    >
      {/* Header */}
      <div className="flex w-full items-center gap-[8px] p-[16px]">
        <p
          className="whitespace-nowrap text-[16px] font-medium leading-[24px]"
          style={{ color: C.neutralLvl1, letterSpacing: "-0.08px" }}
        >
          {title}
        </p>
      </div>
      <div className="h-0 w-full">
        <img alt="" className="block w-full" src={imgLineContainer} />
      </div>
      {/* Content */}
      <div className="flex w-full shrink-0 flex-col items-start gap-[8px] p-[16px]">
        {children}
      </div>
    </div>
  );
}

/** Read-only "Input/Standard" with a leading unit prefix (USD) + value. */
function PrefixInput({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-[56px] w-full shrink-0 flex-col items-start gap-[2px] rounded-[2px]">
      <div className="flex h-[20px] w-full items-start">
        <span
          className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-medium leading-[20px]"
          style={{ color: C.neutralLvl1 }}
        >
          {label}
        </span>
      </div>
      <div
        className="flex h-[34px] w-full items-center rounded-[2px] border border-solid"
        style={{ backgroundColor: "#ffffff", borderColor: C.borderInputSubtle }}
      >
        <div
          className="flex h-[34px] flex-1 items-center gap-[8px] px-[12px] text-[14px] leading-[20px]"
          style={{ color: C.dynRegular }}
        >
          <span className="shrink-0">USD</span>
          <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
            {value}
          </span>
        </div>
      </div>
    </div>
  );
}

/** Read-only "Dropdown Closed" showing a value + caret. */
function DropdownField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex h-[56px] w-full shrink-0 flex-col items-start gap-[2px] rounded-[2px]">
      <div className="flex h-[20px] w-full items-start">
        <span
          className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-medium leading-[20px]"
          style={{ color: C.neutralLvl1 }}
        >
          {label}
        </span>
      </div>
      <div
        className="flex h-[34px] w-full items-center justify-center rounded-[2px] border border-solid"
        style={{ backgroundColor: "#ffffff", borderColor: C.borderInputSubtle }}
      >
        <div className="flex w-full items-center gap-[8px] pl-[12px] pr-[6px]">
          <div className="flex flex-1 items-center py-[7px]">
            <span
              className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[14px] leading-[20px]"
              style={{ color: C.dynRegular }}
            >
              {value}
            </span>
          </div>
          <img alt="" className="size-[20px]" src={imgCaret} />
        </div>
      </div>
    </div>
  );
}

/** Disabled checkbox + label + supporting caption block. */
function CaptionedCheck({
  label,
  caption,
}: {
  label: string;
  caption: string;
}) {
  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-[6px]">
      <div className="flex w-full items-center gap-[4px]">
        <span className="flex items-center justify-center p-[2px]">
          <Checkbox
            disabled
            aria-label={label}
            className="size-[16px] rounded-[2px] border-[1.5px]"
            style={{ borderColor: C.borderSubtle }}
          />
        </span>
        <p
          className="whitespace-nowrap text-[14px] leading-[20px]"
          style={{ color: C.dynDisabled }}
        >
          {label}
        </p>
      </div>
      <div className="flex w-full items-center justify-center pl-[32px] pr-[10px]">
        <p
          className="flex-1 text-[12px] leading-[18px]"
          style={{ color: C.dynDisabled }}
        >
          {caption}
        </p>
      </div>
    </div>
  );
}

/** A disabled channel selection chip. */
function ChannelChip({ label }: { label: string }) {
  return (
    <div
      className="flex h-[24px] items-center justify-center gap-[4px] rounded-[40px] px-[8px] py-[2px]"
      style={{ backgroundColor: C.chipBg }}
    >
      <div className="flex items-center justify-center gap-[4px]">
        <div className="relative size-[24px] shrink-0">
          <img alt="" className="absolute inset-0 size-full" src={imgChipCheck} />
        </div>
        <span
          className="whitespace-nowrap text-[12px] font-medium leading-[18px]"
          style={{ color: C.chipFg }}
        >
          {label}
        </span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Stepper                                                             */
/* ------------------------------------------------------------------ */

function StepColumn({
  icon,
  lines,
  weight = "regular",
  width,
}: {
  icon: ReactNode;
  lines: [string, string];
  weight?: "regular" | "medium";
  width?: string;
}) {
  return (
    <div
      className="flex shrink-0 flex-col items-center gap-[12px]"
      style={{ width: width ?? "24px" }}
    >
      <div className="relative size-[24px] shrink-0">{icon}</div>
      <div
        className="text-center text-[14px]"
        style={{
          color: C.neutralLvl1,
          fontWeight: weight === "medium" ? 500 : 400,
        }}
      >
        <p className="leading-[20px]">{lines[0]}</p>
        <p className="leading-[20px]">{lines[1]}</p>
      </div>
    </div>
  );
}

function StepperLine({ src }: { src: string }) {
  return (
    <div className="relative h-[24px] min-w-px flex-1">
      <img alt="" className="absolute inset-0 size-full" src={src} />
    </div>
  );
}

function StepperHorizontal() {
  return (
    <div className="flex w-full max-w-[1152px] flex-col items-center">
      <div className="flex w-full items-start justify-between">
        {/* End point left */}
        <div className="flex w-[60px] shrink-0 flex-col items-start py-[11px]">
          <div className="h-[2px] w-full" style={{ backgroundColor: C.progressNeutral }} />
        </div>

        <StepColumn
          icon={<img alt="" className="absolute inset-0 size-full" src={imgIconCheckCircle} />}
          lines={["Choose", "strategy"]}
        />
        <StepperLine src={imgStep1LineContainer} />
        <StepColumn
          icon={<img alt="" className="absolute inset-0 size-full" src={imgIconCheckCircle} />}
          lines={["Campaign", "parameters"]}
        />
        <StepperLine src={imgStep2LineContainer} />
        <StepColumn
          icon={<img alt="" className="absolute inset-0 size-full" src={imgIconCheckCircle} />}
          lines={["Audience", "segments"]}
        />
        <StepperLine src={imgStep2LineContainer} />
        {/* Active step 4 */}
        <StepColumn
          weight="medium"
          icon={
            <>
              <div className="absolute inset-[-33.33%_-66.67%_-100%_-66.67%]">
                <img alt="" className="size-full" src={imgStepperInactive4} />
              </div>
              <div className="absolute inset-[31.25%]">
                <img alt="" className="absolute inset-0 size-full" src={imgCircle} />
              </div>
            </>
          }
          lines={["Custom", "tactic"]}
        />
        <StepperLine src={imgStep4LineContainer} />
        <StepColumn
          icon={<img alt="" className="absolute inset-0 size-full" src={imgStepperInactive5} />}
          lines={["Review", "plan"]}
        />

        {/* End point right */}
        <div className="flex w-[60px] shrink-0 flex-col items-start py-[11px]">
          <div className="h-[2px] w-full" style={{ backgroundColor: C.progressNeutral }} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tables                                                              */
/* ------------------------------------------------------------------ */

type ChannelRow = { channel: string; col2: string; col3: string };

function ProjectionsTable({
  headerTitle,
  col2Header,
  col3Header,
  rows,
}: {
  headerTitle: string;
  col2Header: string;
  col3Header: string;
  rows: ChannelRow[];
}) {
  const cellText =
    "text-[12px] leading-[18px] font-normal whitespace-nowrap overflow-hidden text-ellipsis";
  const numStyle: CSSProperties = { fontFeatureSettings: '"lnum" 1, "tnum" 1' };
  return (
    <div className="flex w-full shrink-0 flex-col items-start">
      {/* Group header */}
      <div
        className="flex h-[40px] w-full items-center border border-solid px-[16px] py-[8px]"
        style={{ backgroundColor: C.bgLvl2, borderColor: C.borderSubtle }}
      >
        <p
          className="overflow-hidden text-ellipsis whitespace-nowrap text-[16px] font-medium leading-[24px]"
          style={{ color: C.neutralLvl2 }}
        >
          {headerTitle}
        </p>
      </div>
      {/* Table body */}
      <div
        className="flex w-full items-start overflow-hidden border-x border-t border-solid"
        style={{ borderColor: C.borderSubtle }}
      >
        {/* Channel column */}
        <div className="flex shrink-0 flex-col items-start">
          <div
            className="flex h-[40px] items-center border-b border-solid py-[10px]"
            style={{ backgroundColor: C.bgLvl2, borderColor: C.borderSubtle }}
          >
            <div className="h-[20px] w-[12px]" />
            <p
              className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-medium leading-[20px]"
              style={{ color: C.neutralLvl2 }}
            >
              Channel
            </p>
            <div className="flex h-[20px] w-[16px] items-center justify-end">
              <div className="h-[20px] w-px" style={{ backgroundColor: C.borderSubtle }} />
            </div>
          </div>
          {rows.map((r) => (
            <div
              key={r.channel}
              className="flex h-[40px] w-full items-center gap-[4px] border-b border-solid pl-[12px] pr-[16px]"
              style={{ backgroundColor: "#ffffff", borderColor: C.borderSubtle }}
            >
              <p className={cellText} style={{ color: C.cellFg }}>{r.channel}</p>
            </div>
          ))}
        </div>
        {/* Col 2 (right aligned) */}
        <div className="flex min-w-px flex-1 flex-col items-start">
          <div
            className="flex h-[40px] w-full items-center border-b border-solid py-[10px]"
            style={{ backgroundColor: C.bgLvl2, borderColor: C.borderSubtle }}
          >
            <div className="h-[20px] w-[12px]" />
            <div className="flex min-w-px flex-1 items-start justify-end">
              <p
                className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-medium leading-[20px]"
                style={{ color: C.neutralLvl2 }}
              >
                {col2Header}
              </p>
            </div>
            <div className="flex h-[20px] w-[16px] items-center justify-end">
              <div className="h-[20px] w-px" style={{ backgroundColor: C.borderSubtle }} />
            </div>
          </div>
          {rows.map((r) => (
            <div
              key={r.channel}
              className="flex h-[40px] w-full items-center justify-end gap-[4px] border-b border-solid pl-[12px] pr-[16px]"
              style={{ backgroundColor: "#ffffff", borderColor: C.borderSubtle }}
            >
              <p className={`${cellText} text-right`} style={{ color: C.cellFg, ...numStyle }}>
                {r.col2}
              </p>
            </div>
          ))}
        </div>
        {/* Col 3 (right aligned) */}
        <div className="flex min-w-px flex-1 flex-col items-start">
          <div
            className="flex h-[40px] w-full items-center border-b border-solid py-[10px]"
            style={{ backgroundColor: C.bgLvl2, borderColor: C.borderSubtle }}
          >
            <div className="h-[20px] w-[12px]" />
            <div className="flex min-w-px flex-1 items-start justify-end">
              <p
                className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-medium leading-[20px]"
                style={{ color: C.neutralLvl2 }}
              >
                {col3Header}
              </p>
            </div>
            <div className="h-[20px] w-[16px]" />
          </div>
          {rows.map((r) => (
            <div
              key={r.channel}
              className="flex h-[40px] w-full items-center justify-end gap-[4px] border-b border-solid pl-[12px] pr-[16px]"
              style={{ backgroundColor: "#ffffff", borderColor: C.borderSubtle }}
            >
              <p className={`${cellText} text-right`} style={{ color: C.neutralLvl1, ...numStyle }}>
                {r.col3}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Screen                                                              */
/* ------------------------------------------------------------------ */

export default function Screen_60948_858701(): JSX.Element {
  const tabs = ["Intelligence", "Activation strategy", "Campaign performance"];
  return (
    <div
      className="relative flex w-[1280px] flex-col items-start gap-[32px] pb-0"
      style={{ backgroundColor: C.bgLvl2, fontFamily: FONT }}
    >
      <TemplateNavigation activeItem="Audiences" />

      {/* Body */}
      <div className="flex w-full flex-1 items-start overflow-hidden px-0 pb-[32px]">
        <div className="flex min-w-px flex-1 flex-col items-start gap-[24px]">
          <div
            className="flex w-full shrink-0 flex-col items-start gap-[24px] px-[16px]"
            style={{ backgroundColor: C.bgLvl2 }}
          >
            <div className="flex w-full shrink-0 flex-col items-center gap-[24px]">
              {/* Header + tabs */}
              <div className="flex w-full shrink-0 flex-col items-start gap-[24px]">
                <div className="flex w-full shrink-0 flex-col items-start gap-[8px]">
                  <div className="flex w-full items-center gap-[8px]">
                    <p
                      className="whitespace-nowrap text-[32px] font-semibold leading-[40px]"
                      style={{ color: C.neutralLvl1, letterSpacing: "-0.64px" }}
                    >
                      OMC Healthcare Hub
                    </p>
                  </div>
                  <p
                    className="w-full text-[14px] font-medium leading-[20px]"
                    style={{ color: C.neutralLvl1 }}
                  >
                    All patient data is aggregated at ZIP+3 level in compliance with HIPAA Safe
                    Harbor de-identification standards (45 CFR §164.514(b)(2)). No individual patient
                    identifiers are used.
                  </p>
                </div>

                {/* Tabs pill group */}
                <div
                  className="flex h-[34px] shrink-0 items-center rounded-[100px] p-[2px]"
                  style={{ backgroundColor: C.tabsTrackBg }}
                >
                  {tabs.map((t) => {
                    const active = t === "Activation strategy";
                    return (
                      <div
                        key={t}
                        className="flex h-[30px] items-center rounded-[20px] px-[16px] py-[5px]"
                        style={
                          active
                            ? { backgroundColor: "#ffffff" }
                            : undefined
                        }
                      >
                        <p
                          className="whitespace-nowrap text-[14px] leading-[20px]"
                          style={{ color: active ? C.tabSelectedFg : C.dynRegular }}
                        >
                          {t}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Stepper */}
              <StepperHorizontal />
            </div>

            {/* Card 1: Reach & frequency optimization */}
            <SmartCard title="Reach & frequency optimization">
              <div className="flex w-full shrink-0 flex-col items-start gap-[20px]">
                {/* Info notification */}
                <div
                  className="flex h-[24px] w-full max-w-[552px] flex-col items-start rounded-[2px]"
                >
                  <div
                    className="flex w-full items-start gap-[8px] rounded-[2px] border border-solid px-[8px] py-[2px]"
                    style={{ backgroundColor: "#ffffff", borderColor: C.borderInfo }}
                  >
                    <div className="flex size-[20px] shrink-0 items-center justify-center">
                      <img alt="" className="size-[20px]" src={imgInfoIcon} />
                    </div>
                    <div className="flex min-w-px flex-1 flex-col items-start pt-px">
                      <p
                        className="w-full text-[12px] font-medium leading-[18px]"
                        style={{ color: C.neutralLvl1 }}
                      >
                        Configure your campaign parameters and view projected pre and post-campaign
                        insights
                      </p>
                    </div>
                  </div>
                </div>

                {/* Budget & media planning panel */}
                <div
                  className="flex w-full shrink-0 flex-col items-start gap-[16px] border border-solid px-[16px] py-[8px]"
                  style={{ backgroundColor: C.bgLvl2, borderColor: C.borderSubtle }}
                >
                  <div className="flex shrink-0 items-start">
                    <p
                      className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-medium leading-[20px]"
                      style={{ color: C.neutralLvl1 }}
                    >
                      Campaign budget &amp; media planning
                    </p>
                  </div>

                  <div className="flex w-full shrink-0 items-start gap-[16px]">
                    {/* Left col */}
                    <div className="flex min-w-px flex-1 flex-col items-start gap-[16px] self-stretch">
                      <PrefixInput label="Total campaign budget" value="2,000,000" />
                      <PrefixInput label="Budget amount ($)" value="2,000,000" />
                      <PrefixInput label="Target frequency cap" value="2,000,000" />
                      <CaptionedCheck
                        label="Apply frequency capping to plan"
                        caption="Avg +18% NRx lift in pilot campaigns"
                      />
                    </div>
                    {/* Right col */}
                    <div className="flex min-w-px flex-1 flex-col items-start gap-[16px]">
                      <DropdownField label="Media planning method" value="Default" />
                      <DropdownField label="Flight duration" value="Default" />
                      {/* Select channels */}
                      <div className="flex w-full shrink-0 flex-col items-start gap-[8px]">
                        <div className="flex shrink-0 items-start">
                          <span
                            className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-medium leading-[20px]"
                            style={{ color: C.neutralLvl1 }}
                          >
                            Select channels
                          </span>
                        </div>
                        <div className="flex w-full flex-wrap items-center gap-[8px]">
                          <ChannelChip label="Display" />
                          <ChannelChip label="CTV" />
                          <ChannelChip label="OLV" />
                          <ChannelChip label="YouTube" />
                        </div>
                      </div>
                      <CaptionedCheck
                        label="Apply optimized budget allocation"
                        caption="Total budget: USD 5,000,000"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </SmartCard>

            {/* Card 2: Pre-campaign projections */}
            <SmartCard title="Pre-campaign projections">
              <div className="flex w-full shrink-0 flex-col items-center gap-[16px]">
                <div className="flex w-full min-w-[576px] shrink-0 flex-col items-start gap-[16px]">
                  {/* Include checkbox */}
                  <div className="flex w-full flex-wrap items-center gap-[8px]">
                    <div className="flex w-[349px] shrink-0 items-center gap-[4px]">
                      <span className="flex items-center justify-center p-[2px]">
                        <Checkbox
                          disabled
                          aria-label="Include these channel projections in your plan"
                          className="size-[16px] rounded-[2px] border-[1.5px]"
                          style={{ borderColor: C.borderSubtle }}
                        />
                      </span>
                      <p
                        className="flex-1 text-[14px] leading-[20px]"
                        style={{ color: C.dynDisabled }}
                      >
                        Include these channel projections in your plan
                      </p>
                    </div>
                  </div>

                  {/* Reach & frequency table */}
                  <ProjectionsTable
                    headerTitle="Reach & frequency across channels"
                    col2Header="Estimated reach"
                    col3Header="Avg frequency"
                    rows={[
                      { channel: "CTV", col2: "1.8M", col3: "14.7" },
                      { channel: "YouTube", col2: "2.1M", col3: "8.9" },
                      { channel: "Display", col2: "900K", col3: "18.6" },
                      { channel: "OLV", col2: "1.2M", col3: "11.4" },
                    ]}
                  />
                </div>

                {/* Include smart budget checkbox */}
                <div className="flex w-full min-w-[576px] shrink-0 flex-col items-start gap-[16px]">
                  <div className="flex w-full flex-wrap items-center gap-[8px]">
                    <div className="flex w-[349px] shrink-0 items-center gap-[4px]">
                      <span className="flex items-center justify-center p-[2px]">
                        <Checkbox
                          disabled
                          aria-label="Include smart budget allocation in your plan"
                          className="size-[16px] rounded-[2px] border-[1.5px]"
                          style={{ borderColor: C.borderSubtle }}
                        />
                      </span>
                      <p
                        className="flex-1 text-[14px] leading-[20px]"
                        style={{ color: C.dynDisabled }}
                      >
                        Include smart budget allocation in your plan
                      </p>
                    </div>
                  </div>

                  {/* Smart budget planner table */}
                  <ProjectionsTable
                    headerTitle="MIQ's smart budget planner"
                    col2Header="Traditional budget"
                    col3Header="Avg Frequency"
                    rows={[
                      { channel: "CTV", col2: "$1,200,000", col3: "14.7" },
                      { channel: "YouTube", col2: "$800,000", col3: "8.9" },
                      { channel: "Display", col2: "$600,000", col3: "18.6" },
                      { channel: "OLV", col2: "$400,000", col3: "11.4" },
                    ]}
                  />
                </div>

                {/* Frequency distribution forecast (nested smart card) */}
                <div
                  className="flex w-full min-w-[180px] shrink-0 items-center justify-center overflow-hidden rounded-[2px]"
                  style={{ boxShadow: "0px 1px 2px rgba(113,113,128,0.08), 0px 8px 8px rgba(113,113,128,0.04)" }}
                >
                  <div className="flex min-w-px flex-1 flex-col items-center">
                    <div className="flex w-full flex-col items-start">
                      <div className="flex w-full items-center gap-[8px] p-[16px]">
                        <p
                          className="whitespace-nowrap text-[16px] font-medium leading-[24px]"
                          style={{ color: C.neutralLvl1, letterSpacing: "-0.08px" }}
                        >
                          Frequency distribution forecast
                        </p>
                      </div>
                      <div className="h-0 w-full">
                        <img alt="" className="block w-full" src={imgLineContainer1} />
                      </div>
                    </div>
                    {/* Chart + legend */}
                    <div className="flex w-full flex-col items-center gap-[8px] p-[16px]">
                      <div className="flex h-[193px] min-h-[300px] w-full min-w-[608px] items-center justify-center gap-[16px]">
                        <div className="flex h-full items-center justify-center p-[32px]">
                          <div className="relative aspect-[288/288] h-full shrink-0">
                            <div className="absolute inset-[-0.21%_49.79%_49.79%_20.4%]">
                              <img alt="" className="block size-full" src={img3Slices} />
                            </div>
                            <div className="absolute inset-[9.34%_49.79%_49.79%_2.24%]">
                              <img alt="" className="block size-full" src={img3Slices1} />
                            </div>
                            <div className="absolute inset-[-0.21%]">
                              <img alt="" className="block size-full" src={img3Slices2} />
                            </div>
                            <div
                              className="absolute inset-[8.05%_21.19%_14.83%_13.56%] text-center text-[14px] leading-[20px]"
                              style={{ color: C.neutralLvl1 }}
                            >
                              <p className="absolute inset-[8.05%_56.78%_83.47%_32.63%]">10%</p>
                              <p className="absolute inset-[23.73%_75.85%_67.8%_13.56%]">10%</p>
                              <p className="absolute inset-[76.69%_21.19%_14.83%_66.1%]">80%</p>
                            </div>
                          </div>
                        </div>
                        {/* Legend */}
                        <div className="flex max-w-[280px] shrink-0 flex-col items-start justify-center gap-[12px] p-[24px]">
                          {[
                            { src: imgMarker1, label: "Optimal (8-15x)" },
                            { src: imgMarker2, label: "Underexposed (<8x)" },
                            { src: imgMarker3, label: "Overexposed (>15x)" },
                          ].map((l) => (
                            <div key={l.label} className="flex shrink-0 items-center gap-[12px]">
                              <div className="relative size-[16px] shrink-0">
                                <img alt="" className="absolute inset-0 size-full" src={l.src} />
                              </div>
                              <p
                                className="whitespace-nowrap text-[14px] leading-[20px]"
                                style={{ color: C.neutralLvl1 }}
                              >
                                {l.label}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SmartCard>

            {/* Card 3: Activation plan */}
            <SmartCard title="Activation plan">
              <div className="flex w-full shrink-0 flex-col items-start gap-[8px]">
                <div className="flex shrink-0 flex-col items-center justify-center gap-[20px] px-[16px] py-[8px]">
                  <p
                    className="whitespace-nowrap text-center text-[14px] font-medium leading-[20px]"
                    style={{ color: C.neutralLvl3 }}
                  >
                    No tactics selected yet. Use the checkboxes in the sections above to add tactics
                    to your plan.
                  </p>
                </div>
              </div>
            </SmartCard>
          </div>

          {/* In-body footer action bar */}
          <div
            className="flex w-full shrink-0 flex-col items-end justify-end"
            style={{
              backgroundColor: C.bgLvl1,
              filter:
                "drop-shadow(0px -1px 2px rgba(113,113,128,0.12)) drop-shadow(0px -8px 8px rgba(113,113,128,0.08))",
            }}
          >
            <div className="flex w-full flex-wrap items-center justify-between gap-y-[16px] p-[16px]">
              {/* Hidden link buttons (opacity 0 in reference) */}
              <div className="flex shrink-0 items-start justify-end opacity-0">
                <p
                  className="whitespace-nowrap text-center text-[14px] font-medium leading-[20px]"
                  style={{ color: "var(--surface-foreground-dynamic-brand-default,#7c33b5)" }}
                >
                  Back
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-[8px]">
                {/* Back (outlined) */}
                <div className="flex h-[34px] shrink-0 items-center justify-end rounded-[2px]">
                  <div
                    className="flex h-[34px] items-center justify-center rounded-[2px] border border-solid px-[12px] py-[7px]"
                    style={{ borderColor: C.borderBold }}
                  >
                    <p
                      className="whitespace-nowrap text-center text-[14px] font-medium leading-[20px]"
                      style={{ color: C.dynRegular }}
                    >
                      Back
                    </p>
                  </div>
                </div>
                {/* Next (disabled) */}
                <div className="flex h-[34px] shrink-0 items-center justify-end rounded-[2px]">
                  <div
                    className="flex h-[34px] items-center justify-center rounded-[2px] px-[12px] py-[7px]"
                    style={{ backgroundColor: C.buttonDisabledBg }}
                  >
                    <p
                      className="whitespace-nowrap text-center text-[14px] font-medium leading-[20px]"
                      style={{ color: C.buttonDisabledFg }}
                    >
                      Next
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
