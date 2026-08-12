/* =========================================================================
 * Screen Template — OMC Activation - Competitive Conquesting (60948-294415)
 *
 * LIVE front-end reproduction of the Figma reference
 * (design-refs/screen-templates/code/60948-294415.txt).
 *
 * Fixed natural width 1280px, light-mode, no footer chrome (this screen has
 * its own in-body Footer AL bar). Shared top chrome from "@/templates/chrome".
 * ========================================================================= */

import { TemplateNavigation } from "@/templates/chrome";
import { Checkbox } from "@/components/ui/checkbox";

const ASSET = `${import.meta.env.BASE_URL}figmaAssets/screen-templates/60948-294415/`;

const imgIconCheckCircle = `${ASSET}9e17f1bc-d595-4fd4-963e-0f68b698e89a.svg`;
const imgStep1LineContainer = `${ASSET}62a65f72-1d11-41c4-ba82-adfcc99fe69c.svg`;
const imgStep2LineContainer = `${ASSET}126b3667-1167-43bf-938e-a1bc7294c932.svg`;
const imgStepperInactive4 = `${ASSET}2b042d55-1fd0-4ae2-9317-fa70cc1d6137.svg`;
const imgCircle = `${ASSET}b4bf04c8-4123-4fda-9994-29f52ec3a513.svg`;
const imgStep4LineContainer = `${ASSET}ae0c69ff-a166-473d-ac38-60fff2fd6202.svg`;
const imgStepperInactive5 = `${ASSET}0080f500-e899-4131-9b2b-956ba7d28473.svg`;
const imgLineContainer = `${ASSET}c6bf9101-8eb9-4669-831b-303c98b9b0c2.svg`;
const imgVectorFrame3 = `${ASSET}3b5cbfbc-60bd-41d7-80ec-7b3c68b8a227.svg`;
const imgVectorFrame4 = `${ASSET}560e09ff-4eb6-4b48-a9a2-fc64e09aff92.svg`;
const imgVectorFrame5 = `${ASSET}34685113-5995-43ed-a7a5-28714aa8b0a4.svg`;
const imgActivationPlanInfo = `${ASSET}056b2486-3481-4938-b3cf-bc5a41e15d41.svg`;

const FONT = '"DM Sans", sans-serif';

/* Token color values (var(--token, fallbackHex)). */
const C = {
  bgLvl2: "var(--surface-background-lvl2,#f7f7fa)",
  bgLvl1: "var(--surface-background-lvl1,#ffffff)",
  neutralLvl1: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
  neutralLvl2: "var(--surface-foreground-static-neutral-lvl2,#282833)",
  neutralLvl3: "var(--surface-foreground-static-neutral-lvl3,#717180)",
  borderSubtle: "var(--border-static-subtle-neutral,#e1e1e8)",
  borderInputSubtle: "var(--border-dynamic-neutral-subtle-default,#c6c6cc)",
  borderInfo: "var(--border-static-bold-info,#2360db)",
  borderBrand: "var(--border-dynamic-brand-default,#7c33b5)",
  brand: "var(--container-dynamic-brand-subtle-foreground-default,#7c33b5)",
  progressNeutral: "var(--progress-neutral,#e1e1e8)",
  progressBrand: "var(--progress-brand,#7c33b5)",
  tabsTrackBg: "var(--container-dynamic-neutral-subtle-background-default-variation,#ebebf0)",
  tabsSelBg: "var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)",
  tabsRegularFg: "var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)",
  tabsSelFg: "var(--container-dynamic-brand-subtle-foreground-selected,#7c33b5)",
  inputRegularFg: "var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)",
  inputVariationFg: "var(--container-dynamic-neutral-subtle-foreground-default-variation,#13131a)",
  btnBorderNeutral: "var(--border-dynamic-neutral-bold-default,#4b4b59)",
  btnDisabledBg: "var(--container-dynamic-neutral-subtle-background-disabled,rgba(113,113,128,0.1))",
  btnDisabledFg: "var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)",
};

/* Reproduces the "Check/m" and "Check/s" checked (selected) checkbox visual.
 * Uses the real DS Checkbox styled to match Figma. */
function DSCheckbox({
  checked,
  indeterminate,
  label,
  labelClassName,
  wrapperClassName,
}: {
  checked?: boolean;
  indeterminate?: boolean;
  label: string;
  labelClassName?: string;
  wrapperClassName?: string;
}) {
  return (
    <div className={`flex w-full items-center gap-[2px] ${wrapperClassName ?? ""}`}>
      <span className="flex items-center justify-center p-[2px]">
        {indeterminate ? (
          <span
            className="flex size-[16px] items-center justify-center rounded-[2px]"
            style={{ backgroundColor: C.progressBrand }}
            role="checkbox"
            aria-checked="mixed"
            aria-label={label}
          >
            <span className="h-px w-[12px]" style={{ backgroundColor: "#ffffff" }} />
          </span>
        ) : (
          <Checkbox
            checked={checked ?? false}
            aria-label={label}
            className="size-[16px] rounded-[2px] border-0 data-[state=checked]:text-white"
            style={{ backgroundColor: C.progressBrand }}
          />
        )}
      </span>
      <p
        className={`text-[14px] leading-[20px] ${labelClassName ?? ""}`}
        style={{ color: C.neutralLvl1, fontFamily: FONT, fontWeight: 400 }}
      >
        {label}
      </p>
    </div>
  );
}

function HorizontalSeparator() {
  return (
    <div className="relative h-px w-full" aria-hidden="true">
      <div
        className="absolute inset-0 border-solid"
        style={{ borderWidth: 1, borderColor: C.borderSubtle }}
      />
    </div>
  );
}

/* One stepper node: a 24px circle + label under it. */
function StepNode({
  iconSrc,
  fallbackDouble,
  label,
  labelWeight = 400,
}: {
  iconSrc: string;
  fallbackDouble?: { ring: string; circle: string };
  label: string;
  labelWeight?: number;
}) {
  return (
    <div className="flex w-[24px] shrink-0 flex-col items-center gap-[12px]">
      <div className="relative size-[24px] shrink-0">
        {fallbackDouble ? (
          <>
            <div className="absolute inset-[-33.33%_-66.67%_-100%_-66.67%]">
              <img alt="" className="block size-full max-w-none" src={fallbackDouble.ring} />
            </div>
            <div className="absolute inset-[31.25%]">
              <img alt="" className="absolute inset-0 block size-full max-w-none" src={fallbackDouble.circle} />
            </div>
          </>
        ) : (
          <img alt="" className="absolute inset-0 block size-full max-w-none" src={iconSrc} />
        )}
      </div>
      <div className="flex w-full items-center justify-center">
        <p
          className="whitespace-nowrap text-center text-[14px] leading-[20px]"
          style={{ color: C.neutralLvl1, fontFamily: FONT, fontWeight: labelWeight }}
        >
          {label}
        </p>
      </div>
    </div>
  );
}

/* A labelled competitor progress row (Praluent / Leqvio / Nexletol). */
function CompetitorRow({ name, zips }: { name: string; zips: string }) {
  return (
    <div className="flex w-full shrink-0 flex-col items-start gap-[8px]">
      <div className="flex w-full items-center justify-between">
        <p
          className="whitespace-nowrap text-[12px] leading-[18px]"
          style={{ color: C.neutralLvl1, fontFamily: FONT, fontWeight: 500 }}
        >
          {name}
        </p>
        <p
          className="whitespace-nowrap text-[14px] leading-[20px]"
          style={{ color: C.neutralLvl2, fontFamily: FONT, fontWeight: 500 }}
        >
          {zips}
        </p>
      </div>
      <div className="relative h-[6px] w-full">
        <div className="absolute inset-0 rounded-[4px]" style={{ backgroundColor: C.progressNeutral }} />
        <div
          className="absolute inset-y-0 left-0 rounded-[4px]"
          style={{ backgroundColor: C.progressBrand, right: "36.11%" }}
        />
      </div>
    </div>
  );
}

export default function Screen_60948_294415(): JSX.Element {
  return (
    <div
      className="flex w-[1280px] flex-col items-start gap-[32px] pb-0"
      style={{ backgroundColor: C.bgLvl2, fontFamily: FONT }}
    >
      {/* Navigation chrome */}
      <TemplateNavigation activeItem="Audiences" className="shrink-0" />

      {/* Body */}
      <div className="flex w-full flex-1 items-start overflow-clip px-0 pb-[32px]">
        <div className="flex flex-1 flex-col items-start gap-[24px]">
          <div
            className="flex w-full shrink-0 flex-col items-start gap-[24px] px-[16px] pb-0"
            style={{ backgroundColor: C.bgLvl2 }}
          >
            <div className="flex w-full shrink-0 flex-col items-center gap-[24px] pb-0">
              {/* Header + tabs */}
              <div className="flex w-full shrink-0 flex-col items-start gap-[24px]">
                {/* Page header */}
                <div className="flex w-full shrink-0 flex-col items-start gap-[8px]">
                  <div className="flex w-full shrink-0 items-center gap-[8px]">
                    <p
                      className="whitespace-nowrap text-[32px] leading-[40px]"
                      style={{
                        color: C.neutralLvl1,
                        fontFamily: FONT,
                        fontWeight: 600,
                        letterSpacing: "-0.64px",
                      }}
                    >
                      OMC Healthcare Hub
                    </p>
                  </div>
                  <p
                    className="w-full text-[14px] leading-[20px]"
                    style={{ color: C.neutralLvl1, fontFamily: FONT, fontWeight: 500 }}
                  >
                    All patient data is aggregated at ZIP+3 level in compliance with HIPAA Safe
                    Harbor de-identification standards (45 CFR §164.514(b)(2)). No individual patient
                    identifiers are used.
                  </p>
                </div>

                {/* Pill tabs (Intelligence / Activation strategy / Campaign performance) */}
                <div
                  className="flex h-[34px] shrink-0 items-center rounded-[100px] p-[2px]"
                  style={{ backgroundColor: C.tabsTrackBg }}
                  role="tablist"
                  aria-label="OMC section"
                >
                  <div
                    className="flex h-[30px] shrink-0 items-center rounded-[20px] px-[16px] py-[5px]"
                    role="tab"
                    aria-selected="false"
                  >
                    <p
                      className="whitespace-nowrap text-[14px] leading-[20px]"
                      style={{ color: C.tabsRegularFg, fontFamily: FONT, fontWeight: 400 }}
                    >
                      Intelligence
                    </p>
                  </div>
                  <div
                    className="flex h-[30px] shrink-0 items-center rounded-[20px] px-[16px] py-[5px]"
                    style={{ backgroundColor: C.tabsSelBg }}
                    role="tab"
                    aria-selected="true"
                  >
                    <p
                      className="whitespace-nowrap text-[14px] leading-[20px]"
                      style={{ color: C.tabsSelFg, fontFamily: FONT, fontWeight: 400 }}
                    >
                      Activation strategy
                    </p>
                  </div>
                  <div
                    className="flex h-[30px] shrink-0 items-center rounded-[20px] px-[16px] py-[5px]"
                    role="tab"
                    aria-selected="false"
                  >
                    <p
                      className="whitespace-nowrap text-[14px] leading-[20px]"
                      style={{ color: C.tabsRegularFg, fontFamily: FONT, fontWeight: 400 }}
                    >
                      Campaign performance
                    </p>
                  </div>
                </div>
              </div>

              {/* Stepper */}
              <div className="flex w-full max-w-[1152px] shrink-0 flex-col items-center">
                <div className="flex w-full shrink-0 items-start justify-between">
                  {/* End Point Left */}
                  <div className="flex w-[60px] shrink-0 flex-col items-start py-[11px]">
                    <div className="h-[2px] w-full shrink-0" style={{ backgroundColor: C.progressNeutral }} />
                  </div>

                  <StepNode iconSrc={imgIconCheckCircle} label="Choose strategy" />
                  <div className="relative h-[24px] min-w-px flex-1">
                    <img alt="" className="absolute inset-0 block size-full max-w-none" src={imgStep1LineContainer} />
                  </div>

                  <StepNode iconSrc={imgIconCheckCircle} label="Campaign parameters" />
                  <div className="relative h-[24px] min-w-px flex-1">
                    <img alt="" className="absolute inset-0 block size-full max-w-none" src={imgStep2LineContainer} />
                  </div>

                  <StepNode iconSrc={imgIconCheckCircle} label="Audience segments" />
                  <div className="relative h-[24px] min-w-px flex-1">
                    <img alt="" className="absolute inset-0 block size-full max-w-none" src={imgStep2LineContainer} />
                  </div>

                  <StepNode
                    iconSrc={imgStepperInactive4}
                    fallbackDouble={{ ring: imgStepperInactive4, circle: imgCircle }}
                    label="Custom tactic"
                    labelWeight={500}
                  />
                  <div className="relative h-[24px] min-w-px flex-1">
                    <img alt="" className="absolute inset-0 block size-full max-w-none" src={imgStep4LineContainer} />
                  </div>

                  <StepNode iconSrc={imgStepperInactive5} label="Review plan" />

                  {/* End Point Right */}
                  <div className="flex w-[60px] shrink-0 flex-col items-start py-[11px]">
                    <div className="h-[2px] w-full shrink-0" style={{ backgroundColor: C.progressNeutral }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Card — Competitive conquesting */}
            <div
              className="flex w-full min-w-[180px] shrink-0 items-start overflow-clip rounded-[2px]"
              style={{
                backgroundColor: C.bgLvl1,
                boxShadow:
                  "0px 1px 4px 0px rgba(113,113,128,0.08), 0px 8px 16px 0px rgba(113,113,128,0.04)",
              }}
            >
              <div className="flex min-w-px flex-1 flex-col items-start">
                {/* Card header */}
                <div className="flex w-full shrink-0 flex-col items-start">
                  <div className="flex w-full shrink-0 items-center gap-[8px] p-[16px]">
                    <div className="flex min-w-px flex-1 items-center gap-[8px] pr-[10px]">
                      <p
                        className="whitespace-nowrap text-[16px] leading-[24px]"
                        style={{
                          color: C.neutralLvl1,
                          fontFamily: FONT,
                          fontWeight: 500,
                          letterSpacing: "-0.08px",
                        }}
                      >
                        Competitive conquesting
                      </p>
                    </div>
                  </div>
                  <div className="relative h-0 w-full shrink-0">
                    <div className="absolute inset-x-0 top-[-1px]">
                      <img alt="" className="block size-full max-w-none" src={imgLineContainer} />
                    </div>
                  </div>
                </div>

                {/* Card content */}
                <div className="flex w-full shrink-0 flex-col items-start gap-[8px] p-[16px]">
                  <div className="flex w-full shrink-0 items-start gap-[24px]">
                    {/* Left tile: Select Competitors */}
                    <div
                      className="flex min-w-px max-w-[320px] flex-1 flex-col items-start gap-[16px] self-stretch border border-solid px-[16px] py-[8px]"
                      style={{ backgroundColor: C.bgLvl2, borderColor: C.borderSubtle }}
                    >
                      <div className="flex w-full shrink-0 flex-col items-start gap-[8px]">
                        <div className="flex w-full shrink-0 items-start">
                          <p
                            className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[14px] leading-[20px]"
                            style={{ color: C.neutralLvl1, fontFamily: FONT, fontWeight: 500 }}
                          >
                            Select competitors
                          </p>
                        </div>
                        <div className="flex w-full shrink-0 flex-col items-start gap-[16px]">
                          <DSCheckbox checked label="Praluent" />
                          <DSCheckbox checked label="Leqvio" />
                          <DSCheckbox checked label="Nexletol" />
                        </div>
                      </div>

                      <HorizontalSeparator />

                      {/* Selected competitors — indeterminate check + label */}
                      <div className="flex w-full shrink-0 flex-wrap content-center items-center gap-[8px]">
                        <DSCheckbox
                          indeterminate
                          label="Include competitor segments in plan"
                          wrapperClassName="flex-1 min-w-px gap-[4px] items-start"
                          labelClassName="flex-1 min-w-px"
                        />
                      </div>

                      {/* Dropdown Closed — Conquest strategy */}
                      <div className="flex h-[56px] w-full shrink-0 flex-col items-start gap-[2px] rounded-[2px]">
                        <div className="flex h-[20px] w-full shrink-0 items-start">
                          <p
                            className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] leading-[20px]"
                            style={{ color: C.neutralLvl1, fontFamily: FONT, fontWeight: 500 }}
                          >
                            Conquest strategy
                          </p>
                        </div>
                        <div
                          className="flex w-full shrink-0 flex-col items-start rounded-[2px] border border-solid"
                          style={{ backgroundColor: C.tabsSelBg, borderColor: C.borderInputSubtle }}
                        >
                          <div className="flex w-full shrink-0 items-center gap-[8px] pl-[12px] pr-[6px]">
                            <div className="flex h-[34px] min-w-px flex-1 items-start py-[7px]">
                              <p
                                className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[14px] leading-[20px]"
                                style={{ color: C.inputVariationFg, fontFamily: FONT, fontWeight: 400 }}
                              >
                                Aggressive conquest
                              </p>
                            </div>
                            <span className="flex size-[20px] items-center justify-center">
                              <img alt="" aria-hidden="true" className="size-[20px]" src={imgVectorFrame3} />
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Input/Standard — Conquest campaign budget */}
                      <div className="flex h-[56px] w-full shrink-0 flex-col items-start gap-[2px] rounded-[2px]">
                        <div className="flex h-[20px] w-full shrink-0 items-start">
                          <p
                            className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] leading-[20px]"
                            style={{ color: C.neutralLvl1, fontFamily: FONT, fontWeight: 500 }}
                          >
                            Conquest campaign budget
                          </p>
                        </div>
                        <div
                          className="flex h-[34px] w-full shrink-0 items-center rounded-[2px] border border-solid px-[12px]"
                          style={{ backgroundColor: C.tabsSelBg, borderColor: C.borderInputSubtle }}
                        >
                          <div className="flex h-[34px] min-w-px flex-1 items-center gap-[8px]">
                            <span
                              className="overflow-hidden text-ellipsis text-[14px] leading-[20px]"
                              style={{ color: C.inputRegularFg, fontFamily: FONT, fontWeight: 400 }}
                            >
                              USD
                            </span>
                            <span
                              className="flex-1 overflow-hidden text-ellipsis text-[14px] leading-[20px]"
                              style={{ color: C.inputVariationFg, fontFamily: FONT, fontWeight: 400 }}
                            >
                              2,000,000
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Include conquest strategy in plan */}
                      <DSCheckbox
                        indeterminate
                        label="Include conquest strategy in plan"
                        wrapperClassName="gap-[4px] items-center"
                        labelClassName="flex-1 min-w-px"
                      />
                    </div>

                    {/* Right tile: Brand-Competitor Rx comparison */}
                    <div
                      className="flex min-w-px flex-1 flex-col items-start gap-[24px] self-stretch border border-solid px-[16px] py-[8px]"
                      style={{ backgroundColor: C.bgLvl2, borderColor: C.borderSubtle }}
                    >
                      <div className="flex w-full shrink-0 flex-col items-start gap-[8px]">
                        {/* Info notification */}
                        <div className="flex w-full max-w-[370px] shrink-0 flex-col items-start rounded-[2px]">
                          <div
                            className="flex w-full shrink-0 items-start gap-[8px] rounded-[2px] border border-solid px-[8px] py-[2px]"
                            style={{ backgroundColor: C.bgLvl1, borderColor: C.borderInfo }}
                          >
                            <span className="flex size-[20px] shrink-0 items-center justify-center">
                              <img alt="" aria-hidden="true" className="size-[20px]" src={imgVectorFrame4} />
                            </span>
                            <div className="flex min-w-px flex-1 flex-col items-start self-stretch overflow-clip pt-px">
                              <p
                                className="w-full text-[12px] leading-[18px]"
                                style={{ color: C.neutralLvl1, fontFamily: FONT, fontWeight: 500 }}
                              >
                                Target geos based on Brand-Competitor Rx comparison
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Sub-tabs */}
                        <div
                          className="flex h-[34px] w-full shrink-0 items-center justify-center rounded-[100px] p-[2px]"
                          style={{ backgroundColor: C.tabsTrackBg }}
                          role="tablist"
                          aria-label="Rx comparison"
                        >
                          <div
                            className="flex h-[30px] min-w-px flex-1 items-center justify-center rounded-[20px] px-[16px] py-[5px]"
                            style={{ backgroundColor: C.tabsSelBg }}
                            role="tab"
                            aria-selected="true"
                          >
                            <p
                              className="flex-1 text-center text-[14px] leading-[20px]"
                              style={{ color: C.tabsSelFg, fontFamily: FONT, fontWeight: 400 }}
                            >
                              High competitor - Low brand Rx
                            </p>
                          </div>
                          <div
                            className="flex h-[30px] min-w-px flex-1 items-center justify-center rounded-[20px] px-[16px] py-[5px]"
                            role="tab"
                            aria-selected="false"
                          >
                            <p
                              className="flex-1 text-center text-[14px] leading-[20px]"
                              style={{ color: C.tabsRegularFg, fontFamily: FONT, fontWeight: 400 }}
                            >
                              High competitor - High brand Rx
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Progress rows */}
                      <div className="flex w-full shrink-0 flex-col items-start gap-[24px]">
                        <CompetitorRow name="Praluent" zips="188 ZIPs" />
                        <CompetitorRow name="Leqvio" zips="150 ZIPs" />
                        <CompetitorRow name="Nexletol" zips="107 ZIPs" />
                      </div>

                      <HorizontalSeparator />

                      {/* Total + include */}
                      <div className="flex w-full flex-1 flex-col items-start gap-[16px]">
                        <div className="flex w-full shrink-0 flex-col items-start gap-[8px]">
                          <div className="flex w-full shrink-0 items-center justify-between">
                            <p
                              className="whitespace-nowrap text-[12px] leading-[18px]"
                              style={{ color: C.neutralLvl1, fontFamily: FONT, fontWeight: 500 }}
                            >
                              Total Target ZIPs
                            </p>
                            <p
                              className="whitespace-nowrap text-[16px] leading-[24px]"
                              style={{ color: C.brand, fontFamily: FONT, fontWeight: 400 }}
                            >
                              107 ZIPs
                            </p>
                          </div>
                          <p
                            className="w-full text-[12px] leading-[18px]"
                            style={{ color: C.neutralLvl3, fontFamily: FONT, fontWeight: 400 }}
                          >
                            Based on de-identified claims data aggregated at ZIP+3 level. Target geos
                            represent ZIP codes with significant competitor prescription activity.
                          </p>
                        </div>
                        <DSCheckbox
                          indeterminate
                          label="Include these target geos in your plan"
                          wrapperClassName="h-[24px] gap-[4px] items-start"
                          labelClassName="flex-1 min-w-px"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Competitor intelligence summary block */}
                  <div
                    className="flex w-full shrink-0 flex-col items-end justify-end gap-[16px] border border-solid px-[16px] py-[8px]"
                    style={{ backgroundColor: C.bgLvl2, borderColor: C.borderSubtle }}
                  >
                    <div className="flex w-full shrink-0 flex-col items-start gap-[8px]">
                      <div className="flex shrink-0 items-start">
                        <p
                          className="whitespace-nowrap text-[14px] leading-[20px]"
                          style={{ color: C.neutralLvl1, fontFamily: FONT, fontWeight: 500 }}
                        >
                          Competitor intelligence summary
                        </p>
                      </div>
                      <p
                        className="w-full text-[12px] leading-[18px]"
                        style={{ color: C.neutralLvl3, fontFamily: FONT, fontWeight: 400 }}
                      >
                        Detailed competitive landscape analysis including SOV trends, prescriber
                        switching patterns, and geographic opportunity mapping.
                      </p>
                    </div>
                    <div className="flex h-[24px] shrink-0 items-start justify-center">
                      <div
                        className="flex h-[24px] shrink-0 items-center gap-[2px] rounded-[2px] border border-solid py-[2px] pl-[6px] pr-[4px]"
                        style={{ borderColor: C.borderBrand }}
                      >
                        <p
                          className="whitespace-nowrap text-[14px] leading-[20px]"
                          style={{ color: C.brand, fontFamily: FONT, fontWeight: 500 }}
                        >
                          View competitor intelligence
                        </p>
                        <span className="flex size-[20px] items-center justify-center p-[3px]">
                          <img alt="" aria-hidden="true" className="size-[15px]" src={imgVectorFrame5} />
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Smart Card — Activation plan */}
            <div
              className="flex w-full min-w-[180px] shrink-0 items-start overflow-clip rounded-[2px]"
              style={{
                backgroundColor: C.bgLvl1,
                boxShadow:
                  "0px 1px 4px 0px rgba(113,113,128,0.08), 0px 8px 16px 0px rgba(113,113,128,0.04)",
              }}
            >
              <div className="flex min-w-px flex-1 flex-col items-start">
                <div className="flex w-full shrink-0 flex-col items-start">
                  <div className="flex w-full shrink-0 items-center gap-[8px] p-[16px]">
                    <div className="flex min-w-px flex-1 items-center gap-[8px] pr-[10px]">
                      <p
                        className="whitespace-nowrap text-[16px] leading-[24px]"
                        style={{
                          color: C.neutralLvl1,
                          fontFamily: FONT,
                          fontWeight: 500,
                          letterSpacing: "-0.08px",
                        }}
                      >
                        Activation plan
                      </p>
                    </div>
                  </div>
                  <div className="relative h-0 w-full shrink-0">
                    <div className="absolute inset-x-0 top-[-1px]">
                      <img alt="" className="block size-full max-w-none" src={imgLineContainer} />
                    </div>
                  </div>
                </div>

                <div className="flex w-full shrink-0 flex-col items-start gap-[8px] p-[16px]">
                  <div className="flex w-full shrink-0 flex-col items-start gap-[8px]">
                    {/* Info notification */}
                    <div
                      className="flex w-full max-w-[376px] shrink-0 items-start gap-[8px] rounded-[2px] border border-solid px-[8px] py-[2px]"
                      style={{ backgroundColor: C.bgLvl1, borderColor: C.borderInfo }}
                    >
                      <span className="flex size-[20px] shrink-0 items-center justify-center">
                        <img alt="" aria-hidden="true" className="size-[20px]" src={imgActivationPlanInfo} />
                      </span>
                      <div className="flex min-w-px flex-1 flex-col items-start self-stretch overflow-clip pt-px">
                        <p
                          className="w-full text-[12px] leading-[18px]"
                          style={{ color: C.neutralLvl1, fontFamily: FONT, fontWeight: 500 }}
                        >
                          Tactics selected from the insights above will appear here:
                        </p>
                      </div>
                    </div>

                    {/* Empty state */}
                    <div className="flex w-full shrink-0 flex-col items-center justify-center gap-[20px] px-[16px] py-[8px]">
                      <p
                        className="whitespace-nowrap text-center text-[14px] leading-[20px]"
                        style={{ color: C.neutralLvl3, fontFamily: FONT, fontWeight: 500 }}
                      >
                        No tactics selected yet. Select competitors, configure a strategy, or include
                        target geos above.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer AL (in-body sticky footer bar) */}
          <div
            className="flex w-full shrink-0 flex-col items-end justify-end"
            style={{
              backgroundColor: C.bgLvl1,
              filter:
                "drop-shadow(0px -1px 2px rgba(113,113,128,0.12)) drop-shadow(0px -8px 8px rgba(113,113,128,0.08))",
            }}
          >
            <div className="flex w-full shrink-0 flex-wrap content-center items-center justify-between gap-y-[16px] p-[16px]">
              <div className="flex shrink-0 items-start justify-end opacity-0" aria-hidden="true">
                <p
                  className="whitespace-nowrap text-center text-[14px] leading-[20px]"
                  style={{ color: C.brand, fontFamily: FONT, fontWeight: 500 }}
                >
                  Back
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-[8px]">
                {/* Back (outlined) */}
                <div
                  className="flex h-[34px] shrink-0 items-center justify-center rounded-[2px] border border-solid px-[12px] py-[7px]"
                  style={{ borderColor: C.btnBorderNeutral }}
                >
                  <p
                    className="whitespace-nowrap text-center text-[14px] leading-[20px]"
                    style={{ color: C.inputRegularFg, fontFamily: FONT, fontWeight: 500 }}
                  >
                    Back
                  </p>
                </div>
                {/* Next (disabled) */}
                <div
                  className="flex h-[34px] shrink-0 items-center justify-center rounded-[2px] px-[12px] py-[7px]"
                  style={{ backgroundColor: C.btnDisabledBg }}
                  aria-disabled="true"
                >
                  <p
                    className="whitespace-nowrap text-center text-[14px] leading-[20px]"
                    style={{ color: C.btnDisabledFg, fontFamily: FONT, fontWeight: 500 }}
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
  );
}
