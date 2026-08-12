/* =========================================================================
 * Screen Template — OMC Activation - Step 1 (60141-191669)
 *
 * LIVE front-end reproduction of the Figma reference
 * (design-refs/screen-templates/code/60141-191669.txt) built from real Fiber
 * Design System primitives where a component matches, and faithful JSX for the
 * bespoke pieces (stepper, strategy tiles). Fixed 1280px natural width, light
 * mode, no shared TemplateFooter (this frame hides it — the Back / Next actions
 * live inside the screen body's own "Footer AL" bar).
 * ========================================================================= */

import { TemplateNavigation } from "@/templates/chrome";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const ASSET_BASE = `${import.meta.env.BASE_URL}figmaAssets/screen-templates/60141-191669/`;
const IMG_INFO = `${ASSET_BASE}38b95482-c451-431a-8a03-8146a8430343.svg`;

const FONT = '"DM Sans", sans-serif';

/* Token color values (var(--token, fallbackHex)). */
const C = {
  pageBg: "var(--surface-background-lvl2,#f7f7fa)",
  surfaceLvl1: "var(--surface-background-lvl1,#ffffff)",
  textLvl1: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
  textLvl3: "#717180",
  neutralRegular: "var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)",
  brand: "var(--container-dynamic-brand-subtle-foreground-selected,#7c33b5)",
  brandBoldBg: "var(--container-dynamic-brand-bold-background-default,#7c33b5)",
  brandBoldFg: "var(--container-dynamic-brand-bold-foreground-default,#ffffff)",
  tabsTrackBg: "var(--container-dynamic-neutral-subtle-background-default-variation,#ebebf0)",
  tabActiveBg: "var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)",
  progressNeutral: "var(--progress-neutral,#e1e1e8)",
  stepperActive: "var(--container-dynamic-brand-bold-background-default,#7c33b5)",
  tileSelectedBg: "var(--container-dynamic-brand-subtle-background-selected,#f6ebff)",
  tileSelectedBorder: "var(--border-dynamic-brand-selected,#7c33b5)",
  tileBorder: "var(--border-dynamic-neutral-subtle-default,#c6c6cc)",
  tileDisabledBg: "var(--container-dynamic-neutral-subtle-background-disabled,rgba(113,113,128,0.1))",
  tileDisabledBorder: "var(--border-dynamic-neutral-subtle-disabled,#e1e1e8)",
  tileDisabledFg: "var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)",
  infoBorder: "var(--border-static-bold-info,#2360db)",
  btnSecondaryBorder: "var(--border-dynamic-neutral-bold-default,#4b4b59)",
};

const ELEVATION =
  "0px 1px 4px rgba(113,113,128,0.08), 0px 8px 16px rgba(113,113,128,0.04)";

/* ---------------------------------------------------------------------- */
/* Horizontal stepper                                                     */
/* ---------------------------------------------------------------------- */

type StepState = "active" | "inactive";

const STEPS: { label: string; state: StepState }[] = [
  { label: "Choose strategy", state: "active" },
  { label: "Campaign parameters", state: "inactive" },
  { label: "Audience segments", state: "inactive" },
  { label: "Custom tactic", state: "inactive" },
  { label: "Review plan", state: "inactive" },
];

function StepDot({ state }: { state: StepState }) {
  if (state === "active") {
    return (
      <span
        aria-hidden="true"
        className="block size-[24px] rounded-full"
        style={{
          border: `2px solid ${C.stepperActive}`,
          padding: "5px",
          boxSizing: "border-box",
        }}
      >
        <span
          className="block size-full rounded-full"
          style={{ backgroundColor: C.stepperActive }}
        />
      </span>
    );
  }
  return (
    <span
      aria-hidden="true"
      className="block size-[24px] rounded-full"
      style={{ border: `2px solid ${C.progressNeutral}`, boxSizing: "border-box" }}
    />
  );
}

function StepperHorizontal() {
  return (
    <div className="flex w-full max-w-[1152px] flex-col items-center">
      <div className="flex w-full items-start justify-between">
        {/* End Point Left */}
        <div className="flex w-[60px] shrink-0 flex-col items-start py-[11px]">
          <div className="h-[2px] w-full" style={{ backgroundColor: C.progressNeutral }} />
        </div>

        {STEPS.map((step, i) => (
          <div key={step.label} className="contents">
            {/* Step container */}
            <div className="flex w-[24px] shrink-0 flex-col items-center gap-[12px]">
              <StepDot state={step.state} />
              <div className="flex items-center justify-center">
                <p
                  className="whitespace-nowrap text-center text-[14px] leading-[20px]"
                  style={{
                    color: C.textLvl1,
                    fontWeight: step.state === "active" ? 500 : 400,
                  }}
                >
                  {step.label}
                </p>
              </div>
            </div>

            {/* Connector line (after every step except the last) */}
            {i < STEPS.length - 1 && (
              <div className="relative h-[24px] min-w-px flex-1 self-stretch">
                <span
                  aria-hidden="true"
                  className="absolute left-0 right-0 top-[11px] h-[2px]"
                  style={{
                    backgroundColor: i === 0 ? C.stepperActive : C.progressNeutral,
                  }}
                />
              </div>
            )}
          </div>
        ))}

        {/* End Point Right */}
        <div className="flex w-[60px] shrink-0 flex-col items-start py-[11px]">
          <div className="h-[2px] w-full" style={{ backgroundColor: C.progressNeutral }} />
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Strategy tile                                                          */
/* ---------------------------------------------------------------------- */

type Tile = {
  id: string;
  title: string;
  lines: string[];
  metric: string;
  state: "selected" | "default" | "disabled";
};

const TILES: Tile[] = [
  {
    id: "reach-frequency",
    title: "Reach & Frequency",
    lines: ["Optimize ad exposure across channels."],
    metric: "Avg +18% NRx lift in pilot campaigns",
    state: "selected",
  },
  {
    id: "competitive-conquesting",
    title: "Competitive Conquesting",
    lines: ["Intercept competitor-treated patients"],
    metric: "38% overlap with competitor audiences identified",
    state: "default",
  },
  {
    id: "dtc-hcp-synergy",
    title: "DTC-HCP Synergy",
    lines: ["Coordinate patient & provider messaging"],
    metric: "2.4x higher engagement with synced messaging",
    state: "default",
  },
  {
    id: "patient-access",
    title: "Patient Access & Rare Disease Precision",
    lines: [
      "Surface hidden audiences in underserved geos and securely activate rare disease audiences",
    ],
    metric: "",
    state: "disabled",
  },
];

function StrategyTile({ tile }: { tile: Tile }) {
  const selected = tile.state === "selected";
  const disabled = tile.state === "disabled";

  const bg = selected
    ? C.tileSelectedBg
    : disabled
      ? C.tileDisabledBg
      : C.surfaceLvl1;
  const borderColor = selected
    ? C.tileSelectedBorder
    : disabled
      ? C.tileDisabledBorder
      : C.tileBorder;
  const titleColor = selected ? C.brand : disabled ? C.tileDisabledFg : C.textLvl1;
  const bodyColor = selected ? C.brand : disabled ? C.tileDisabledFg : C.neutralRegular;
  const metricColor = disabled ? C.tileDisabledFg : C.textLvl3;

  return (
    <div
      className="flex min-h-[164px] min-w-[180px] flex-1 flex-col items-start overflow-hidden rounded-[2px] p-[16px]"
      style={{ backgroundColor: bg, border: `1px solid ${borderColor}` }}
    >
      <div className="flex w-full flex-col items-start gap-[8px]">
        {/* Header and actions */}
        <div className="flex w-full items-center gap-[8px]">
          <span className="flex size-[24px] shrink-0 items-center">
            <RadioGroupItem
              value={tile.id}
              aria-label={tile.title}
              disabled={disabled}
              className="size-[20px]"
              style={{
                borderColor: selected ? C.brand : disabled ? C.tileDisabledFg : C.tileBorder,
                color: C.brand,
              }}
            />
          </span>
          <div className="flex min-w-px flex-1 flex-col items-start justify-center gap-[10px]">
            <p
              className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-medium leading-[20px]"
              style={{ color: titleColor }}
            >
              {tile.title}
            </p>
          </div>
        </div>

        {/* Body copy */}
        <div className="flex w-full items-start">
          <div className="min-w-px flex-1 text-[14px] leading-[20px]" style={{ color: bodyColor }}>
            {tile.lines.map((line) => (
              <p key={line} className="mb-0 leading-[20px]">
                {line}
              </p>
            ))}
            <p className="mb-0 leading-[20px]">&#8203;</p>
            {tile.metric ? (
              <p className="leading-[20px]" style={{ color: metricColor }}>
                {tile.metric}
              </p>
            ) : (
              <p className="leading-[20px]">&#8203;</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------- */
/* Screen                                                                 */
/* ---------------------------------------------------------------------- */

export default function Screen_60141_191669(): JSX.Element {
  return (
    <div
      className="flex w-[1280px] flex-col items-start gap-[32px]"
      style={{ backgroundColor: C.pageBg, fontFamily: FONT }}
    >
      {/* Shared chrome — Audiences is the active primary nav item */}
      <div className="flex w-full flex-col items-start">
        <TemplateNavigation activeItem="Audiences" />
      </div>

      {/* Body */}
      <div className="flex w-full flex-1 items-start overflow-hidden px-0 pb-[32px]">
        <div className="flex w-full flex-1 flex-col items-center gap-[24px]">
          <div className="flex w-full flex-col items-start gap-[24px] px-[16px]">
            {/* Page header */}
            <div className="flex w-full flex-col items-start gap-[8px]">
              <p
                className="whitespace-nowrap text-[32px] font-semibold leading-[40px] tracking-[-0.64px]"
                style={{ color: C.textLvl1 }}
              >
                OMC Healthcare Hub
              </p>
              <p
                className="w-full text-[14px] font-medium leading-[20px]"
                style={{ color: C.textLvl1 }}
              >
                All patient data is aggregated at ZIP+3 level in compliance with HIPAA Safe
                Harbor de-identification standards (45 CFR §164.514(b)(2)). No individual
                patient identifiers are used.
              </p>
            </div>

            {/* Segmented tabs */}
            <Tabs defaultValue="activation-strategy" className="shrink-0">
              <TabsList
                className="flex h-[34px] items-center gap-0 rounded-[100px] p-[2px]"
                style={{ backgroundColor: C.tabsTrackBg }}
              >
                {[
                  { value: "intelligence", label: "Intelligence" },
                  { value: "activation-strategy", label: "Activation strategy" },
                  { value: "campaign-performance", label: "Campaign performance" },
                ].map((t) => {
                  const active = t.value === "activation-strategy";
                  return (
                    <TabsTrigger
                      key={t.value}
                      value={t.value}
                      className="flex h-[30px] items-center rounded-[20px] px-[16px] py-[5px] text-[14px] font-normal leading-[20px] data-[state=active]:shadow-none"
                      style={{
                        backgroundColor: active ? C.tabActiveBg : "transparent",
                        color: active ? C.brand : C.neutralRegular,
                      }}
                    >
                      {t.label}
                    </TabsTrigger>
                  );
                })}
              </TabsList>
            </Tabs>

            {/* Stepper */}
            <div className="flex w-full flex-col items-center">
              <StepperHorizontal />
            </div>

            {/* Smart card */}
            <Card
              className="flex w-full min-w-[180px] items-start overflow-hidden rounded-[2px] border-0 p-0"
              style={{ backgroundColor: C.surfaceLvl1, boxShadow: ELEVATION }}
            >
              <div className="flex min-w-px flex-1 flex-col items-start">
                {/* Card header */}
                <div className="flex w-full flex-col items-start">
                  <div className="flex w-full items-center gap-[8px] p-[16px]">
                    <div className="flex min-w-px flex-1 items-center gap-[8px] pr-[10px]">
                      <p
                        className="whitespace-nowrap text-[16px] font-medium leading-[24px] tracking-[-0.08px]"
                        style={{ color: C.textLvl1 }}
                      >
                        Plan new campaign
                      </p>
                    </div>
                  </div>
                  <Separator style={{ backgroundColor: C.progressNeutral }} />
                </div>

                {/* Card content */}
                <div className="flex w-full flex-col items-start gap-[8px] p-[16px]">
                  <div className="flex w-full flex-col items-start gap-[24px] rounded-[2px]">
                    {/* Info notification */}
                    <div className="flex w-full max-w-[1042px] flex-col items-start rounded-[2px]">
                      <div
                        className="flex w-full items-start gap-[8px] rounded-[2px] px-[8px] py-[2px]"
                        style={{
                          backgroundColor: C.surfaceLvl1,
                          border: `1px solid ${C.infoBorder}`,
                        }}
                      >
                        <span className="flex size-[20px] shrink-0 items-center justify-center">
                          <img alt="" aria-hidden="true" src={IMG_INFO} className="size-[20px]" />
                        </span>
                        <div className="flex min-w-px flex-1 flex-col items-start self-stretch overflow-hidden pt-px">
                          <p
                            className="w-full text-[12px] font-medium leading-[18px]"
                            style={{ color: C.textLvl1 }}
                          >
                            Select an activation strategy to build your campaign. Each strategy
                            leverages real-world data from MiQ and PurpleLab to target the right
                            patients and providers across channels.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Strategy tiles */}
                    <RadioGroup
                      defaultValue="reach-frequency"
                      aria-label="Activation strategy"
                      className="flex w-full flex-wrap content-start items-start gap-[24px]"
                    >
                      {TILES.map((tile) => (
                        <StrategyTile key={tile.id} tile={tile} />
                      ))}
                    </RadioGroup>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* In-body page footer (Footer AL) — Back / Next actions */}
          <div
            className="flex h-[66px] w-full flex-col items-end justify-end"
            style={{
              backgroundColor: C.surfaceLvl1,
              boxShadow:
                "0px -1px 2px rgba(113,113,128,0.12), 0px -8px 8px rgba(113,113,128,0.08)",
            }}
          >
            <div className="flex w-full flex-wrap content-center items-center justify-between gap-y-[16px] p-[16px]">
              {/* Hidden link buttons placeholder (opacity 0 in reference) */}
              <div className="flex shrink-0 items-start justify-end opacity-0" aria-hidden="true">
                <p
                  className="whitespace-nowrap text-center text-[14px] font-medium leading-[20px]"
                  style={{ color: C.brand }}
                >
                  Back
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-[8px]">
                <Button
                  type="button"
                  variant="outline"
                  className="h-[34px] rounded-[2px] px-[12px] py-[7px] text-[14px] font-medium leading-[20px] shadow-none"
                  style={{
                    border: `1px solid ${C.btnSecondaryBorder}`,
                    color: C.neutralRegular,
                    backgroundColor: "transparent",
                  }}
                >
                  Back
                </Button>
                <Button
                  type="button"
                  className="h-[34px] rounded-[2px] px-[12px] py-[7px] text-[14px] font-medium leading-[20px] shadow-none"
                  style={{ backgroundColor: C.brandBoldBg, color: C.brandBoldFg }}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
