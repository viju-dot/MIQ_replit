/* =========================================================================
 * Screen Template — Plan Channel (67205-212808)
 *
 * LIVE front-end reproduction of the Figma reference at
 * design-refs/screen-templates/code/67205-212808.txt.
 *
 * A tall "Create campaign planning" screen composed inside the standard page
 * shell: the shared <TemplateNavigation> (Audiences active) over a padded body
 * (64px side margins → 1152px content column) carrying a two-column channel
 * planning layout, with the shared <TemplateFooter> pinned at the bottom.
 *
 * DS primitives used: Input, Badge, Separator, Checkbox (chrome supplies the
 * nav/footer Buttons). Bespoke tiles / steppers / channel-pill rows / pacing
 * bar charts are faithful JSX/inline-SVG built from the reference; exported
 * stepper SVGs are used as localized image assets where the reference uses them.
 * ========================================================================= */

import { TemplateNavigation, TemplateFooter } from "@/templates/chrome";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";

const ASSET = `${import.meta.env.BASE_URL}figmaAssets/screen-templates/67205-212808/`;

// Localized assets from the reference declarations.
const imgLine70 = `${ASSET}214068f9-b8d9-414f-95cc-c168a8884469.svg`;
const imgVector9 = `${ASSET}8dbf6d1d-d72f-4899-89bf-7cbf70037a5b.svg`;
const imgVectorFrame1 = `${ASSET}42de7b93-eef2-4bab-a4c1-8fb86e313f27.svg`;
const imgIconCheckCircle = `${ASSET}ed6f27e6-47b2-4b23-8f36-87a8b042224e.svg`;
const imgStep1LineContainer = `${ASSET}adf84baf-e82e-4ff2-bb20-a6a1303d5a02.svg`;
const imgStepperInactive2 = `${ASSET}29ada4d3-0acd-4c2d-b1c8-9bfff5af79b8.svg`;
const imgCircle = `${ASSET}61094fbc-322a-4546-b525-ec690d072ea8.svg`;
const imgStep2LineContainer = `${ASSET}c022084a-efee-4b5d-8d9a-6bd1abcd27f6.svg`;
const imgStepperInactive3 = `${ASSET}8622018d-6c7f-4a6a-85df-515daa87911f.svg`;
const imgLineContainer = `${ASSET}1cbe56c3-1c5e-4600-b3b2-bf6cad1b0012.svg`;
const imgVectorFrame2 = `${ASSET}3b91d51b-3764-40a5-a838-afd07eca9570.svg`;
const imgVectorFrame3 = `${ASSET}82a40203-7519-4ff9-b0b5-502ecbec6bc4.svg`;
const imgVectorFrame4 = `${ASSET}24a340c8-5fe5-4992-9784-576529bdd706.svg`;

/* -------- design tokens (var(--token, hexFallback)) -------- */
const C = {
  bgLvl2: "var(--surface-background-lvl2,#f7f7fa)",
  surfaceLvl1: "var(--surface-background-lvl1,#ffffff)",
  neutralLvl1: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
  neutralLvl2: "var(--surface-foreground-static-neutral-lvl2,#282833)",
  subtleFg: "var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)",
  inputBorder: "var(--border-dynamic-neutral-subtle-default,#c6c6cc)",
  brand: "var(--container-dynamic-brand-bold-background-default,#7c33b5)",
  brandBorder: "var(--border-dynamic-brand-default,#7c33b5)",
  brandSubtleFg: "var(--container-dynamic-brand-subtle-foreground-default,#7c33b5)",
  neutralBoldBorder: "var(--border-dynamic-neutral-bold-default,#4b4b59)",
  infoBorder: "var(--border-static-bold-info,#2360db)",
  progressNeutral: "var(--progress-neutral,#e1e1e8)",
  warnBg: "var(--container-static-warning-subtle-background,#fff7d6)",
  warnFg: "var(--container-static-warning-subtle-foreground-variation,#483800)",
  infoBg: "var(--container-static-info-subtle-background,#ebf1ff)",
  infoFg: "var(--container-static-info-subtle-foreground-variation,#1344a8)",
  successBg: "var(--container-static-success-subtle-background,#e7faef)",
  successFg: "var(--container-static-success-subtle-foreground-variation,#115639)",
  neutralPillBg: "var(--container-static-neutral-subtle-background,#ebebf0)",
  neutralPillFg: "var(--container-static-neutral-subtle-foreground,#4b4b59)",
  bgLvl2Inner: "var(--surface-background-lvl2,#f7f7fa)",
  brandSubtleBg: "var(--container-static-brand-subtle-background,#f9f0ff)",
  successFgBanner: "var(--container-static-success-subtle-foreground,#0a7a4a)",
  cardShadow:
    "0px 1px 4px 0px rgba(113,113,128,0.08), 0px 8px 16px 0px rgba(113,113,128,0.04)",
};

const FONT = '"DM Sans", sans-serif';

/* -------- small local sub-components -------- */

function SmartCard({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex w-full min-w-[180px] items-start overflow-hidden rounded-[2px]"
      style={{ backgroundColor: C.surfaceLvl1, boxShadow: C.cardShadow }}
    >
      <div className="flex min-w-px flex-1 flex-col items-start">{children}</div>
    </div>
  );
}

function CardHeader({ title }: { title: string }) {
  return (
    <div className="flex w-full flex-col items-start">
      <div className="flex w-full items-center gap-[8px] p-[16px]">
        <div className="flex min-w-px flex-1 items-center gap-[8px] py-0 pr-[10px]">
          <p
            className="whitespace-nowrap text-[16px] font-medium leading-[24px] tracking-[-0.08px]"
            style={{ color: C.neutralLvl1 }}
          >
            {title}
          </p>
        </div>
      </div>
      <div className="relative h-0 w-full">
        <div className="absolute inset-[-1px_0_0_0]">
          <img alt="" src={imgLineContainer} className="block size-full max-w-none" />
        </div>
      </div>
    </div>
  );
}

/** A read-only Input/Standard field with an aligned right-hand suffix label. */
function SuffixInput({
  value,
  suffix,
  ariaLabel,
}: {
  value: string;
  suffix: string;
  ariaLabel: string;
}) {
  return (
    <div
      className="flex w-full flex-col items-start rounded-[2px] border border-solid"
      style={{ backgroundColor: C.surfaceLvl1, borderColor: C.inputBorder }}
    >
      <div className="flex w-full items-center gap-[8px] rounded-[2px] px-[12px]">
        <div className="flex min-w-px flex-1 items-center gap-[8px] py-[2.5px] text-[12px]">
          <Input
            aria-label={ariaLabel}
            defaultValue={value}
            readOnly
            className="h-auto min-w-px flex-1 rounded-none border-0 bg-transparent p-0 text-[12px] leading-[18px] shadow-none focus-visible:ring-0 focus-visible:ring-offset-0"
            style={{ color: C.subtleFg }}
          />
          <span
            className="whitespace-nowrap text-right text-[12px] leading-[18px]"
            style={{ color: C.subtleFg }}
          >
            {suffix}
          </span>
        </div>
      </div>
    </div>
  );
}

/** A channel row: label + Base reach/CPM meta on the left, CPM + Allocation fields on the right. */
function ChannelPillRow({ name, meta }: { name: string; meta: string }) {
  return (
    <div className="flex w-full flex-wrap content-start items-start gap-x-[56px] gap-y-[12px]">
      <div className="flex shrink-0 flex-col items-start gap-[8px] whitespace-nowrap">
        <p
          className="text-[14px] font-medium leading-[20px]"
          style={{ color: C.neutralLvl1 }}
        >
          {name}
        </p>
        <p className="text-[12px] leading-[18px]" style={{ color: C.neutralLvl2 }}>
          {meta}
        </p>
      </div>
      <div className="flex min-w-px flex-1 items-center gap-[12px]">
        <div className="flex min-w-px flex-1 flex-col items-start gap-[4px]">
          <p
            className="whitespace-nowrap text-[12px] font-medium leading-[18px]"
            style={{ color: C.neutralLvl1 }}
          >
            CPM
          </p>
          <SuffixInput value="12" suffix="USD" ariaLabel={`${name} CPM`} />
        </div>
        <div className="flex min-w-px flex-1 flex-col items-start gap-[4px]">
          <p
            className="whitespace-nowrap text-[12px] font-medium leading-[18px]"
            style={{ color: C.neutralLvl1 }}
          >
            Allocation
          </p>
          <SuffixInput value="20" suffix="%" ariaLabel={`${name} allocation`} />
        </div>
      </div>
    </div>
  );
}

function SectionSeparator() {
  return (
    <div className="relative flex w-full items-center">
      <div className="relative h-0 min-w-px flex-1">
        <div className="absolute inset-[-1px_0_0_0]">
          <img alt="" src={imgLine70} className="block size-full max-w-none" />
        </div>
      </div>
    </div>
  );
}

/** Left-column "auto allocate" preset tile with a title, badge, and description. */
function AllocateTile({
  title,
  desc,
  desc2,
  badge,
}: {
  title: string;
  desc: string;
  desc2?: string;
  badge:
    | { kind: "simple" }
    | { kind: "reach" }
    | { kind: "smart" }
    | { kind: "mmm" };
}) {
  return (
    <div
      className="flex w-full min-w-[180px] flex-col items-start overflow-hidden rounded-[2px] border border-solid p-[16px]"
      style={{ backgroundColor: C.surfaceLvl1, borderColor: C.inputBorder }}
    >
      <div className="flex w-full flex-col items-start gap-[8px]">
        <div className="flex w-full items-center gap-[8px]">
          <div className="flex min-w-px flex-1 flex-col items-start justify-center gap-[10px]">
            <p
              className="min-w-full overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-medium leading-[20px]"
              style={{ color: C.neutralLvl1 }}
            >
              {title}
            </p>
            {badge.kind === "simple" && (
              <span
                className="flex h-[18px] items-center justify-center rounded-[2px] px-[3px] text-center text-[12px] font-medium leading-[18px]"
                style={{ backgroundColor: C.warnBg, color: C.warnFg }}
              >
                Simple
              </span>
            )}
            {badge.kind === "reach" && (
              <span
                className="flex h-[18px] items-center justify-center rounded-[2px] px-[3px] text-center text-[12px] font-medium leading-[18px]"
                style={{ backgroundColor: C.infoBg, color: C.infoFg }}
              >
                Reach
              </span>
            )}
            {badge.kind === "smart" && (
              <span
                className="flex h-[18px] items-center justify-center rounded-[2px] py-0 pl-[2px] pr-[3px] text-center text-[12px] font-medium leading-[18px]"
                style={{ backgroundColor: C.successBg, color: C.successFg }}
              >
                Smart
              </span>
            )}
            {badge.kind === "mmm" && (
              <span
                className="flex items-center justify-center gap-[4px] rounded-[2px] border border-solid px-[6px] py-[2px]"
                style={{ borderColor: C.brandBorder }}
              >
                <span className="flex size-[20px] items-center justify-center px-[3px] py-[2px]">
                  <img alt="" src={imgVectorFrame3} className="h-[16.25px] w-[15px]" />
                </span>
                <span
                  className="whitespace-nowrap text-center text-[14px] font-medium leading-[20px]"
                  style={{ color: C.brandSubtleFg }}
                >
                  MMM channel score
                </span>
              </span>
            )}
          </div>
        </div>
        <div className="flex w-full flex-wrap content-start items-start">
          <div className="flex min-w-px flex-1 items-center">
            <div
              className="min-w-px flex-1 text-[14px] leading-[20px]"
              style={{ color: C.subtleFg }}
            >
              <p className="mb-0 leading-[20px]">{desc}</p>
              <p className="leading-[20px]">{desc2 ?? "\u200b"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/** Right-panel "Selected channels" metric row. */
function SelectedChannelRow({ name, pct, value }: { name: string; pct: string; value: string }) {
  return (
    <div className="flex w-full items-start justify-between">
      <div className="flex shrink-0 items-start">
        <div className="flex w-[34px] shrink-0 items-start gap-[4px]">
          <p
            className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-medium leading-[20px]"
            style={{ color: C.neutralLvl1 }}
          >
            {name}
          </p>
        </div>
      </div>
      <div className="flex w-[71px] shrink-0 flex-col items-end gap-[4px]">
        <div className="flex w-full items-center">
          <p
            className="w-[68px] text-right text-[20px] font-semibold leading-[28px] tracking-[-0.2px]"
            style={{ color: C.neutralLvl1 }}
          >
            {pct}
          </p>
        </div>
        <p
          className="w-full text-right text-[12px] leading-[18px]"
          style={{ color: C.neutralLvl2 }}
        >
          {value}
        </p>
      </div>
    </div>
  );
}

/** Trend-line icon for the Forecast summary header. */
function TrendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path
        d="M2 13.5L7 8.5L10.5 12L18 4.5"
        stroke={C.neutralLvl1}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M13 4.5H18V9.5"
        stroke={C.neutralLvl1}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** A metric row in the Forecast summary card. */
function ForecastMetric({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="flex w-full flex-col items-start gap-[2px] py-[12px]">
      <p className="text-[12px] leading-[18px]" style={{ color: C.neutralLvl2 }}>
        {label}
      </p>
      <p
        className="text-[24px] font-semibold leading-[32px] tracking-[-0.24px]"
        style={{ color: C.neutralLvl1 }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-[12px] leading-[18px]" style={{ color: C.neutralLvl2 }}>
          {sub}
        </p>
      )}
    </div>
  );
}

/** Info banner with an outlined border (used inside cards). */
function InfoBanner({ text }: { text: string }) {
  return (
    <div
      className="flex items-start gap-[8px] rounded-[2px] border border-solid px-[8px] py-[2px]"
      style={{ backgroundColor: C.surfaceLvl1, borderColor: C.infoBorder }}
    >
      <span className="flex size-[20px] items-center justify-center">
        <img alt="" src={imgVectorFrame2} className="size-[20px]" />
      </span>
      <div className="flex flex-col items-start overflow-hidden pt-px">
        <p
          className="text-[12px] font-medium leading-[18px]"
          style={{ color: C.neutralLvl1 }}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

/** A light-grey inset box (Campaign period / Impact preview containers). */
function InsetBox({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="flex w-full flex-col items-start gap-[8px] rounded-[2px] p-[16px]"
      style={{ backgroundColor: C.bgLvl2Inner }}
    >
      {children}
    </div>
  );
}

/** A metric tile used inside Impact preview rows. */
function ImpactTile({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex min-w-px flex-1 flex-col items-start gap-[8px] rounded-[2px] border border-solid p-[16px]"
      style={{ backgroundColor: C.surfaceLvl1, borderColor: C.inputBorder }}
    >
      <p className="text-[12px] leading-[18px]" style={{ color: C.neutralLvl2 }}>
        {label}
      </p>
      <p
        className="text-[24px] font-semibold leading-[32px] tracking-[-0.24px]"
        style={{ color: C.neutralLvl1 }}
      >
        {value}
      </p>
    </div>
  );
}

/** A selected day-part card (purple tinted). */
function DayPartCard({ title, time, desc }: { title: string; time: string; desc: string }) {
  return (
    <div
      className="flex min-w-px flex-1 flex-col items-start gap-[8px] rounded-[2px] border border-solid p-[16px]"
      style={{ backgroundColor: C.brandSubtleBg, borderColor: C.brand }}
    >
      <p
        className="text-[16px] font-medium leading-[24px] tracking-[-0.08px]"
        style={{ color: C.brand }}
      >
        {title}
      </p>
      <span
        className="flex h-[20px] items-center justify-center rounded-[2px] px-[6px] text-[12px] font-medium leading-[18px]"
        style={{ backgroundColor: C.neutralPillBg, color: C.neutralPillFg }}
      >
        {time}
      </span>
      <p className="text-[14px] leading-[20px]" style={{ color: C.brand }}>
        {desc}
      </p>
    </div>
  );
}

/** Advanced planning features card. */
function AdvancedPlanningCard() {
  return (
    <SmartCard>
      <CardHeader title="Advanced planning features" />
      <div className="flex w-full flex-col items-start gap-[16px] p-[16px]">
        <InfoBanner text="Configure day part targeting, creative duration, and flighting strategy" />

        {/* Campaign period */}
        <InsetBox>
          <p
            className="text-[14px] font-medium leading-[20px]"
            style={{ color: C.neutralLvl1 }}
          >
            Campaign period
          </p>
          <p className="text-[12px] leading-[18px]" style={{ color: C.neutralLvl2 }}>
            14 May 2026 – 29 May 2026 (3 weeks)
          </p>
        </InsetBox>

        {/* Day part planning */}
        <div className="flex w-full flex-col items-start gap-[4px]">
          <p
            className="text-[16px] font-medium leading-[24px] tracking-[-0.08px]"
            style={{ color: C.neutralLvl1 }}
          >
            Day part planning
          </p>
          <p className="text-[14px] leading-[20px]" style={{ color: C.neutralLvl2 }}>
            Select standard day parts for time-of-day targeting
          </p>
        </div>

        {/* Day type segmented control */}
        <div className="flex w-full flex-col items-start gap-[8px]">
          <p
            className="text-[14px] font-medium leading-[20px]"
            style={{ color: C.neutralLvl1 }}
          >
            Day type
          </p>
          <div
            className="flex w-full items-stretch overflow-hidden rounded-[2px] border border-solid"
            style={{ borderColor: C.inputBorder }}
            role="tablist"
            aria-label="Day type"
          >
            {(["Weekday", "Weekend", "Both"] as const).map((t, i) => {
              const active = i === 0;
              return (
                <div
                  key={t}
                  role="tab"
                  aria-selected={active}
                  className="flex min-w-px flex-1 items-center justify-center px-[12px] py-[8px] text-[14px] leading-[20px]"
                  style={{
                    backgroundColor: active ? C.neutralPillBg : C.surfaceLvl1,
                    color: C.neutralLvl1,
                    fontWeight: active ? 500 : 400,
                    borderLeft: i > 0 ? `1px solid ${C.inputBorder}` : undefined,
                  }}
                >
                  {t}
                </div>
              );
            })}
          </div>
        </div>

        {/* Select day part */}
        <div className="flex w-full flex-col items-start gap-[12px]">
          <div className="flex w-full items-center justify-between">
            <p className="text-[12px] leading-[18px]" style={{ color: C.neutralLvl2 }}>
              Select day par...
            </p>
            <button
              type="button"
              className="text-[14px] font-medium leading-[20px]"
              style={{ color: C.brand }}
            >
              Clear all
            </button>
          </div>
          <div className="flex w-full items-stretch gap-[16px]">
            <DayPartCard title="Early morning" time="5:00 AM – 9:00 AM" desc="Breakfast TV and early progra..." />
            <DayPartCard title="Daytime" time="9:00 AM – 4:00 PM" desc="Daytime programming" />
            <DayPartCard title="Early fringe" time="4:00 PM – 6:00 PM" desc="Early evening lead-in" />
          </div>
          <div className="flex w-full items-stretch gap-[16px]">
            <DayPartCard title="Primetime" time="6:00 PM – 10:30 PM" desc="Peak viewing hours" />
            <DayPartCard title="Late fringe" time="10:30 PM – 12:00 AM" desc="Late night programming" />
            <div className="min-w-px flex-1" aria-hidden="true" />
          </div>
        </div>

        {/* Impact preview */}
        <InsetBox>
          <p
            className="text-[14px] font-medium leading-[20px]"
            style={{ color: C.neutralLvl1 }}
          >
            Impact preview
          </p>
          <div className="flex w-full items-stretch gap-[16px]">
            <ImpactTile label="Reach impact" value="–14%" />
            <ImpactTile label="CPM impact" value="–22%" />
            <ImpactTile label="Frequency" value="–15%" />
          </div>
        </InsetBox>
      </div>
    </SmartCard>
  );
}

/** A creative-duration selectable card. */
function DurationCard({
  title,
  selected,
  standard,
  metrics,
}: {
  title: string;
  selected?: boolean;
  standard?: boolean;
  metrics: { label: string; value: string }[];
}) {
  return (
    <div
      className="flex min-w-px flex-1 flex-col items-start gap-[8px] rounded-[2px] border border-solid p-[16px]"
      style={{
        backgroundColor: selected ? C.brandSubtleBg : C.surfaceLvl1,
        borderColor: selected ? C.brand : C.inputBorder,
      }}
    >
      <div className="flex w-full items-center gap-[8px]">
        <Checkbox
          checked={!!selected}
          aria-label={title}
          className="size-[16px] rounded-[2px]"
          style={
            selected
              ? { backgroundColor: C.brand, borderColor: C.brand, color: "#ffffff" }
              : { borderColor: C.inputBorder }
          }
        />
        <p
          className="text-[16px] font-medium leading-[24px] tracking-[-0.08px]"
          style={{ color: selected ? C.brand : C.neutralLvl1 }}
        >
          {title}
        </p>
      </div>
      {standard && (
        <p className="text-[12px] leading-[18px]" style={{ color: C.neutralLvl2 }}>
          Industry standard
        </p>
      )}
      <div className="flex w-full flex-col items-start gap-[4px]">
        {metrics.map((m) => (
          <div key={m.label} className="flex w-full items-center justify-between">
            <span className="text-[12px] leading-[18px]" style={{ color: C.neutralLvl2 }}>
              {m.label}
            </span>
            <span
              className="text-[14px] font-medium leading-[20px]"
              style={{ color: C.neutralLvl1 }}
            >
              {m.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/** Creative duration card. */
function CreativeDurationCard() {
  return (
    <SmartCard>
      <CardHeader title="Creative duration" />
      <div className="flex w-full flex-col items-start gap-[16px] p-[16px]">
        <p className="text-[14px] leading-[20px]" style={{ color: C.neutralLvl2 }}>
          Select ad duration to optimize for cost, reach, or impact
        </p>
        <div className="flex w-full items-stretch gap-[16px]">
          <DurationCard
            title="15 seconds"
            selected
            metrics={[
              { label: "CPM", value: "+40%" },
              { label: "Reach", value: "+8%" },
              { label: "Recall", value: "–28%" },
            ]}
          />
          <DurationCard
            title="30 seconds"
            standard
            metrics={[
              { label: "CPM", value: "Baseline" },
              { label: "Reach", value: "Baseline" },
              { label: "Recall", value: "Baseline" },
            ]}
          />
          <DurationCard
            title="60 seconds"
            metrics={[
              { label: "CPM", value: "+40%" },
              { label: "Reach", value: "+8%" },
              { label: "Recall", value: "–28%" },
            ]}
          />
        </div>

        {/* Impact preview */}
        <InsetBox>
          <p
            className="text-[14px] font-medium leading-[20px]"
            style={{ color: C.neutralLvl1 }}
          >
            Impact preview
          </p>
          <div className="flex w-full items-stretch gap-[16px]">
            <ImpactTile label="CPM" value="+70%" />
            <ImpactTile label="Recall effectiveness" value="+35%" />
          </div>
        </InsetBox>

        {/* Best For banner */}
        <span
          className="flex items-center rounded-[2px] px-[8px] py-[2px] text-[12px] font-medium leading-[18px]"
          style={{ backgroundColor: C.successBg, color: C.successFg }}
        >
          Best For: High-frequency campaigns, simple messages, brand maintenance, budget-conscious...
        </span>

        {/* Note */}
        <div className="flex w-full items-start gap-[8px]">
          <span className="flex size-[20px] items-center justify-center">
            <img alt="" src={imgVectorFrame4} className="size-[20px]" />
          </span>
          <p
            className="min-w-px flex-1 text-[14px] font-medium leading-[20px]"
            style={{ color: C.neutralLvl1 }}
          >
            Note: Duration impacts are applied to all channels in the plan. Multipliers are based on industry benchmarks and will affect reach calculations, CPM rates, and frequency estimates.
          </p>
        </div>
      </div>
    </SmartCard>
  );
}

/** A single quintile pill (20% chip + Q label). */
function QuintilePill({ label, shade }: { label: string; shade: string }) {
  return (
    <div className="flex flex-col items-center gap-[4px]">
      <span
        className="flex h-[18px] items-center justify-center rounded-[2px] px-[6px] text-center text-[12px] font-medium leading-[18px]"
        style={{ backgroundColor: shade, color: "#ffffff" }}
      >
        20%
      </span>
      <span className="text-[12px] leading-[18px]" style={{ color: C.neutralLvl2 }}>
        {label}
      </span>
    </div>
  );
}

/** A pacing-preset card with a Q1–Q5 mini gradient bar. */
function PacingCard({
  title,
  desc,
  shades,
  selected,
}: {
  title: string;
  desc: string;
  shades: string[];
  selected?: boolean;
}) {
  return (
    <div
      className="flex min-w-px flex-1 flex-col items-start gap-[12px] rounded-[2px] border border-solid p-[16px]"
      style={{
        backgroundColor: selected ? C.brandSubtleBg : C.surfaceLvl1,
        borderColor: selected ? C.brand : C.inputBorder,
      }}
    >
      <p
        className="text-[16px] font-medium leading-[24px] tracking-[-0.08px]"
        style={{ color: selected ? C.brand : C.neutralLvl1 }}
      >
        {title}
      </p>
      <p
        className="overflow-hidden text-ellipsis whitespace-nowrap text-[14px] leading-[20px]"
        style={{ color: C.neutralLvl2, maxWidth: "100%" }}
      >
        {desc}
      </p>
      <div className="flex w-full items-start justify-between">
        {["Q1", "Q2", "Q3", "Q4", "Q5"].map((q, i) => (
          <QuintilePill key={q} label={q} shade={shades[i]} />
        ))}
      </div>
    </div>
  );
}

/** Flighting strategy pacing-preset card. */
function FlightingStrategyCard() {
  // dark → light purple gradient shades
  const asc = ["#3d0a5c", "#5b1e8f", "#7c33b5", "#a566d1", "#cca4e6"];
  const descShades = [...asc].reverse();
  return (
    <SmartCard>
      <CardHeader title="Flighting strategy" />
      <div className="flex w-full flex-col items-start gap-[16px] p-[16px]">
        <p className="text-[14px] leading-[20px]" style={{ color: C.neutralLvl2 }}>
          Select how to distribute budget across campaign duration (quintiles)
        </p>
        <div className="flex w-full flex-col items-start gap-[12px]">
          <p
            className="text-[14px] font-medium leading-[20px]"
            style={{ color: C.neutralLvl1 }}
          >
            Select pacing preset
          </p>
          <div className="flex w-full items-stretch gap-[16px]">
            <PacingCard
              title="Early morning"
              desc="Distribute budget evenly acros..."
              shades={asc}
            />
            <PacingCard
              title="Front loaded"
              desc="Concentrate budget in early q..."
              shades={asc}
            />
            <PacingCard
              title="Back loaded"
              desc="Build momentum with increas..."
              shades={descShades}
            />
          </div>

          {/* Custom (selected) */}
          <div
            className="flex w-full flex-col items-start gap-[12px] rounded-[2px] border border-solid p-[16px]"
            style={{ backgroundColor: C.brandSubtleBg, borderColor: C.brand }}
          >
            <p
              className="text-[16px] font-medium leading-[24px] tracking-[-0.08px]"
              style={{ color: C.brand }}
            >
              Custom
            </p>
            <p className="text-[14px] leading-[20px]" style={{ color: C.neutralLvl2 }}>
              Define your own quintile budget distribution
            </p>
            <div className="flex w-full items-start justify-between">
              {["Q1", "Q2", "Q3", "Q4", "Q5"].map((q, i) => (
                <QuintilePill key={q} label={q} shade={asc[i]} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </SmartCard>
  );
}

/** Quintile budget splits card (Q1–Q5 inputs). */
function QuintileBudgetCard() {
  return (
    <SmartCard>
      <CardHeader title="Quintile budget splits" />
      <div className="flex w-full flex-col items-start gap-[16px] p-[16px]">
        <div className="flex w-full items-start gap-[16px]">
          {["Q1", "Q2", "Q3", "Q4", "Q5"].map((q) => (
            <div key={q} className="flex min-w-px flex-1 flex-col items-start gap-[4px]">
              <p
                className="text-[12px] font-medium leading-[18px]"
                style={{ color: C.neutralLvl1 }}
              >
                {q}
              </p>
              <SuffixInput value="20" suffix="%" ariaLabel={`${q} budget split`} />
            </div>
          ))}
        </div>
        <span
          className="flex items-center gap-[4px] rounded-[2px] px-[8px] py-[2px] text-[12px] font-medium leading-[18px]"
          style={{ backgroundColor: C.successBg, color: C.successFg }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <circle cx="7" cy="7" r="6.25" stroke={C.successFg} strokeWidth="1.2" />
            <path
              d="M4.2 7.2L6 9L9.8 5"
              stroke={C.successFg}
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Quintile splits valid
        </span>
      </div>
    </SmartCard>
  );
}

/** Flighting impact preview card. */
function FlightingImpactCard() {
  return (
    <SmartCard>
      <div className="flex w-full flex-col items-start gap-[8px] p-[16px]">
        <p
          className="text-[14px] font-medium leading-[20px]"
          style={{ color: C.neutralLvl1 }}
        >
          Impact preview
        </p>
        <div
          className="flex w-full items-center justify-center rounded-[2px] p-[16px]"
          style={{ backgroundColor: C.bgLvl2Inner }}
        >
          <p className="text-[14px] leading-[20px]" style={{ color: C.neutralLvl2 }}>
            Steady reach build, consistent CPM, optimal for sustained awareness
          </p>
        </div>
      </div>
    </SmartCard>
  );
}

export default function Screen_67205_212808(): JSX.Element {
  const selectedChannels = [
    { name: "Netflix Ads", pct: "+0.2%", value: "$1,234" },
    { name: "Prime video", pct: "+0.2%", value: "$1,234" },
    { name: "Disney+", pct: "+0.0%", value: "$122" },
    { name: "YouTube", pct: "+0.1%", value: "$123" },
    { name: "Online video", pct: "+0.1%", value: "$123" },
  ];

  return (
    <div
      className="relative flex w-[1280px] flex-col items-start gap-[32px] pb-[66px]"
      style={{ backgroundColor: C.bgLvl2, fontFamily: FONT }}
    >
      {/* Shared chrome: dark MIQ primary nav + light secondary nav */}
      <TemplateNavigation activeItem="Audiences" />

      {/* Body */}
      <div className="flex w-full items-start overflow-hidden px-[64px] pb-[32px]">
        <div className="flex min-w-px flex-1 flex-col items-start gap-[24px]">
          {/* Page title + (hidden) actions */}
          <div className="flex h-[68px] w-full items-start justify-between">
            <div className="flex min-w-px flex-1 flex-col items-start gap-[8px]">
              <p
                className="min-w-full text-[32px] font-semibold leading-[40px] tracking-[-0.64px]"
                style={{ color: C.neutralLvl1 }}
              >
                Create campaign planning
              </p>
            </div>
            <div className="flex shrink-0 items-center gap-[16px] opacity-0">
              <span
                className="flex items-center justify-center gap-[4px] rounded-[2px] border border-solid px-[12px] py-[7px]"
                style={{ borderColor: C.neutralBoldBorder }}
              >
                <span className="flex size-[20px] flex-col items-center justify-center p-[2px]">
                  <img alt="" src={imgVector9} className="h-[16.25px] w-[16.251px]" />
                </span>
                <span
                  className="whitespace-nowrap text-center text-[14px] font-medium leading-[20px]"
                  style={{ color: C.subtleFg }}
                >
                  Compare
                </span>
              </span>
              <span
                className="flex items-center justify-center gap-[4px] rounded-[2px] px-[12px] py-[7px]"
                style={{ backgroundColor: C.brand }}
              >
                <span className="flex size-[20px] items-center justify-center p-[3px]">
                  <img alt="" src={imgVectorFrame1} className="size-[15px]" />
                </span>
                <span
                  className="whitespace-nowrap text-center text-[14px] font-medium leading-[20px]"
                  style={{ color: "#ffffff" }}
                >
                  New plan
                </span>
              </span>
            </div>
          </div>

          {/* Stepper Horizontal */}
          <div className="flex w-full flex-col items-start">
            <div className="flex w-full items-start justify-between">
              <div className="flex w-[60px] shrink-0 flex-col items-start py-[10px]">
                <div
                  className="h-[2px] w-full"
                  style={{ backgroundColor: C.progressNeutral }}
                />
              </div>
              {/* Step 1 - complete */}
              <div className="flex w-[24px] shrink-0 flex-col items-center gap-[12px]">
                <div className="relative size-[24px]">
                  <img
                    alt=""
                    src={imgIconCheckCircle}
                    className="absolute inset-0 block size-full max-w-none"
                  />
                </div>
                <p
                  className="whitespace-nowrap text-center text-[14px] font-medium leading-[20px]"
                  style={{ color: C.neutralLvl1 }}
                >
                  Audience
                </p>
              </div>
              <div className="relative h-[24px] min-w-px flex-1">
                <img
                  alt=""
                  src={imgStep1LineContainer}
                  className="absolute inset-0 block size-full max-w-none"
                />
              </div>
              {/* Step 2 - active */}
              <div className="flex w-[24px] shrink-0 flex-col items-center gap-[12px]">
                <div className="relative size-[24px]">
                  <div className="absolute inset-[-33.33%_-66.67%_-100%_-66.67%]">
                    <img alt="" src={imgStepperInactive2} className="block size-full max-w-none" />
                  </div>
                  <div className="absolute inset-[31.25%]">
                    <img alt="" src={imgCircle} className="absolute inset-0 block size-full max-w-none" />
                  </div>
                </div>
                <p
                  className="whitespace-nowrap text-center text-[14px] font-medium leading-[20px]"
                  style={{ color: C.neutralLvl1 }}
                >
                  Channel
                </p>
              </div>
              <div className="relative h-[24px] min-w-px flex-1">
                <img
                  alt=""
                  src={imgStep2LineContainer}
                  className="absolute inset-0 block size-full max-w-none"
                />
              </div>
              {/* Step 3 - inactive */}
              <div className="flex w-[24px] shrink-0 flex-col items-center gap-[12px]">
                <div className="relative size-[24px]">
                  <img
                    alt=""
                    src={imgStepperInactive3}
                    className="absolute inset-0 block size-full max-w-none"
                  />
                </div>
                <p
                  className="whitespace-nowrap text-center text-[14px] leading-[20px]"
                  style={{ color: C.neutralLvl1 }}
                >
                  Forecast
                </p>
              </div>
              <div className="flex w-[60px] shrink-0 flex-col items-start py-[11px]">
                <div
                  className="h-[2px] w-full"
                  style={{ backgroundColor: C.progressNeutral }}
                />
              </div>
            </div>
          </div>

          {/* Plan channel context screen: two columns */}
          <div className="flex w-full flex-wrap content-start items-start gap-[24px]">
            {/* Left column */}
            <div className="flex min-w-px flex-1 flex-col items-start gap-[24px]">
              {/* Card: Plan your channel mix */}
              <SmartCard>
                <CardHeader title="Plan your channel mix" />
                <div className="flex w-full flex-col items-start gap-[8px] p-[16px]">
                  <div className="flex w-full flex-col items-start gap-[16px]">
                    <div className="flex w-[276px] flex-col items-start gap-[8px]">
                      <p
                        className="w-full text-[14px] font-medium leading-[20px]"
                        style={{ color: C.neutralLvl1 }}
                      >
                        Total campaign budget
                      </p>
                      <p
                        className="w-full text-[12px] leading-[18px]"
                        style={{ color: C.neutralLvl2 }}
                      >
                        Set your total available budget
                      </p>
                    </div>
                    <div className="flex w-full items-start gap-[16px]">
                      <div className="flex min-w-px flex-1 flex-col items-start gap-[8px]">
                        <p
                          className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-medium leading-[18px]"
                          style={{ color: C.neutralLvl1 }}
                        >
                          Budget (AUD)
                        </p>
                        <div
                          className="flex w-full flex-col items-start rounded-[2px] border border-solid"
                          style={{ backgroundColor: C.surfaceLvl1, borderColor: C.inputBorder }}
                        >
                          <div className="flex w-full items-center gap-[8px] rounded-[2px] px-[12px]">
                            <div className="flex h-[34px] min-w-px flex-1 items-center gap-[8px] py-[8px] text-[14px]">
                              <span
                                className="min-w-px flex-1 overflow-hidden text-ellipsis leading-[20px]"
                                style={{ color: C.subtleFg }}
                              >
                                Default
                              </span>
                              <span
                                className="min-w-px flex-1 overflow-hidden text-ellipsis text-right leading-[20px]"
                                style={{ color: C.subtleFg }}
                              >
                                0% of budget allocated
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SmartCard>

              {/* Card: Auto allocate budget */}
              <SmartCard>
                <CardHeader title="Auto allocate budget" />
                <div className="flex w-full flex-col items-start gap-[8px] p-[16px]">
                  <div className="flex w-full flex-col items-start gap-[16px]">
                    {/* Info notification */}
                    <div className="flex h-[24px] flex-col items-start rounded-[2px]">
                      <div
                        className="flex items-start gap-[8px] rounded-[2px] border border-solid px-[8px] py-[2px]"
                        style={{ backgroundColor: C.surfaceLvl1, borderColor: C.infoBorder }}
                      >
                        <span className="flex size-[20px] items-center justify-center">
                          <img alt="" src={imgVectorFrame2} className="size-[20px]" />
                        </span>
                        <div className="flex flex-col items-start overflow-hidden pt-px">
                          <p
                            className="w-full text-[12px] font-medium leading-[18px]"
                            style={{ color: C.neutralLvl1 }}
                          >
                            Use smart algorithms to automatically distribute your budget across channels
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Preset tiles */}
                    <div className="flex w-full flex-col items-start gap-[20px]">
                      <div className="flex w-full flex-col items-start justify-center gap-[12px]">
                        <AllocateTile
                          title="Even split"
                          badge={{ kind: "simple" }}
                          desc="Divide budget equally across all 10 channels"
                        />
                        <AllocateTile
                          title="Weighted by reach"
                          badge={{ kind: "reach" }}
                          desc="Allocate more to channels with higher base reach potential"
                        />
                        <AllocateTile
                          title="Weighted by efficiency"
                          badge={{ kind: "smart" }}
                          desc="Optimize for best reach per dollar"
                          desc2="(lower CPM + higher reach)"
                        />
                        <AllocateTile
                          title="MMM-based"
                          badge={{ kind: "mmm" }}
                          desc="Use MMM channel scores + optimization algorithm for allocation"
                        />
                      </div>

                      {/* Tip notification */}
                      <div className="flex w-full flex-col items-start gap-[8px]">
                        <div className="flex w-full flex-col items-start rounded-[2px]">
                          <div className="flex w-full items-start gap-[8px] rounded-[2px] py-[5px]">
                            <span className="flex size-[20px] items-center justify-center">
                              <img alt="" src={imgVectorFrame4} className="size-[20px]" />
                            </span>
                            <div className="flex min-w-px flex-1 flex-col items-start overflow-hidden pt-px">
                              <p
                                className="w-full text-[14px] font-medium leading-[20px]"
                                style={{ color: C.neutralLvl1 }}
                              >
                                Tip: Click any algorithm to automatically allocate your USD 12,345 budget. You can still manually adjust individual channel budgets afterward.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SmartCard>

              {/* Card: Channels (Linear TV / BVOD) */}
              <SmartCard>
                <div className="flex w-full flex-col items-start gap-[8px] p-[16px]">
                  <div className="flex w-full flex-col items-start gap-[20px]">
                    {/* Linear TV group */}
                    <div className="flex w-full flex-col items-start gap-[12px]">
                      <div className="flex shrink-0 items-center gap-[8px]">
                        <p
                          className="whitespace-nowrap text-[16px] font-medium leading-[24px] tracking-[-0.08px]"
                          style={{ color: C.neutralLvl1 }}
                        >
                          Linear TV
                        </p>
                        <span
                          className="flex h-[18px] items-center justify-center rounded-full px-[8px] py-[2px] text-center text-[12px] font-medium leading-[18px]"
                          style={{ backgroundColor: C.neutralPillBg, color: C.neutralPillFg }}
                        >
                          Traditional broadcast
                        </span>
                      </div>
                      <ChannelPillRow name="Linear TV" meta="Base reach: 65% · CPM: USD 28" />
                    </div>

                    <SectionSeparator />

                    {/* BVOD group */}
                    <div className="flex w-full flex-col items-start gap-[12px]">
                      <div className="flex shrink-0 items-center gap-[8px]">
                        <p
                          className="whitespace-nowrap text-[16px] font-medium leading-[24px] tracking-[-0.08px]"
                          style={{ color: C.neutralLvl1 }}
                        >
                          BVOD
                        </p>
                        <span
                          className="flex h-[18px] items-center justify-center rounded-full px-[8px] py-[2px] text-center text-[12px] font-medium leading-[18px]"
                          style={{ backgroundColor: C.neutralPillBg, color: C.neutralPillFg }}
                        >
                          Broadcaster on demand
                        </span>
                      </div>
                      <div className="flex w-full flex-col items-start gap-[12px]">
                        <ChannelPillRow name="7plus" meta="Base reach: 18% · CPM: USD 12" />
                        <ChannelPillRow name="9 now" meta="Base reach: 18% · CPM: USD 12" />
                        <ChannelPillRow name="10 play" meta="Base reach: 18% · CPM: USD 12" />
                        <ChannelPillRow name="SBS on demand" meta="Base reach: 18% · CPM: USD 12" />
                      </div>
                    </div>

                    <SectionSeparator />

                    {/* SVOD group */}
                    <div className="flex w-full flex-col items-start gap-[12px]">
                      <div className="flex shrink-0 items-center gap-[8px]">
                        <p
                          className="whitespace-nowrap text-[16px] font-medium leading-[24px] tracking-[-0.08px]"
                          style={{ color: C.neutralLvl1 }}
                        >
                          SVOD
                        </p>
                        <span
                          className="flex h-[18px] items-center justify-center rounded-full px-[8px] py-[2px] text-center text-[12px] font-medium leading-[18px]"
                          style={{ backgroundColor: C.neutralPillBg, color: C.neutralPillFg }}
                        >
                          Streaming services
                        </span>
                      </div>
                      <div className="flex w-full flex-col items-start gap-[12px]">
                        <ChannelPillRow name="Netflix Ads" meta="Base reach: 18% · CPM: USD 12" />
                        <ChannelPillRow name="Prime video" meta="Base reach: 18% · CPM: USD 12" />
                        <ChannelPillRow name="Disney+" meta="Base reach: 18% · CPM: USD 12" />
                      </div>
                    </div>

                    <SectionSeparator />

                    {/* Online video group */}
                    <div className="flex w-full flex-col items-start gap-[12px]">
                      <div className="flex shrink-0 items-center gap-[8px]">
                        <p
                          className="whitespace-nowrap text-[16px] font-medium leading-[24px] tracking-[-0.08px]"
                          style={{ color: C.neutralLvl1 }}
                        >
                          Online video
                        </p>
                        <span
                          className="flex h-[18px] items-center justify-center rounded-full px-[8px] py-[2px] text-center text-[12px] font-medium leading-[18px]"
                          style={{ backgroundColor: C.neutralPillBg, color: C.neutralPillFg }}
                        >
                          Digital platforms
                        </span>
                      </div>
                      <div className="flex w-full flex-col items-start gap-[12px]">
                        <ChannelPillRow name="YouTube" meta="Base reach: 18% · CPM: USD 12" />
                        <ChannelPillRow name="Online video" meta="Base reach: 18% · CPM: USD 12" />
                      </div>
                    </div>
                  </div>
                </div>
              </SmartCard>

              {/* Card: Advanced planning features */}
              <AdvancedPlanningCard />

              {/* Card: Creative duration */}
              <CreativeDurationCard />

              {/* Card: Flighting strategy pacing presets */}
              <FlightingStrategyCard />

              {/* Card: Quintile budget splits */}
              <QuintileBudgetCard />

              {/* Card: Flighting impact preview */}
              <FlightingImpactCard />

              {/* Final note */}
              <div className="flex w-full items-start gap-[8px] py-[5px]">
                <span className="flex size-[20px] items-center justify-center">
                  <img alt="" src={imgVectorFrame4} className="size-[20px]" />
                </span>
                <p
                  className="min-w-px flex-1 text-[14px] font-medium leading-[20px]"
                  style={{ color: C.neutralLvl1 }}
                >
                  Note: Modeling outputs, reach curves, and performance breakdowns will be shown in the Forecast section after you complete channel planning.
                </p>
              </div>
            </div>

            {/* Right column: Forecast summary + Selected channels */}
            <div className="flex w-[276px] shrink-0 flex-col items-start gap-[24px]">
              {/* Forecast summary */}
              <SmartCard>
                <div className="flex w-full flex-col items-start">
                  <div className="flex w-full items-center gap-[8px] p-[16px]">
                    <span className="flex size-[24px] items-center justify-center">
                      <TrendIcon />
                    </span>
                    <p
                      className="whitespace-nowrap text-[16px] font-medium leading-[24px] tracking-[-0.08px]"
                      style={{ color: C.neutralLvl1 }}
                    >
                      Forecast summary
                    </p>
                  </div>
                  <div className="relative h-0 w-full">
                    <div className="absolute inset-[-1px_0_0_0]">
                      <img alt="" src={imgLineContainer} className="block size-full max-w-none" />
                    </div>
                  </div>
                  <div className="flex w-full flex-col items-start p-[16px]">
                    <ForecastMetric
                      label="Total reach"
                      value="1.0%"
                      sub="of target audience"
                    />
                    <SectionSeparator />
                    <ForecastMetric
                      label="Effective frequency"
                      value="2.30"
                      sub="Average impressions per person"
                    />
                    <SectionSeparator />
                    <ForecastMetric
                      label="Efficiency"
                      value="USD 4"
                      sub="Cost per reach point (000s)"
                    />
                    <SectionSeparator />
                    <ForecastMetric label="Total impressions" value="534,884" />
                    <SectionSeparator />
                    <ForecastMetric label="Total spend" value="USD 4,428" />
                  </div>
                </div>
              </SmartCard>

              {/* Selected channels */}
              <SmartCard>
                <div className="flex w-full flex-col items-start gap-[8px] p-[16px]">
                  <div className="flex w-full flex-col items-start gap-[16px]">
                    <div className="flex w-full items-center gap-[8px]">
                      <p
                        className="whitespace-nowrap text-[16px] font-medium leading-[24px] tracking-[-0.08px]"
                        style={{ color: C.neutralLvl1 }}
                      >
                        Selected channels
                      </p>
                      <Badge
                        className="h-[18px] rounded-full border-0 px-[8px] py-[2px] text-[12px] font-medium leading-[18px]"
                        style={{ backgroundColor: C.neutralPillBg, color: C.neutralPillFg }}
                      >
                        5
                      </Badge>
                    </div>
                    <Separator style={{ backgroundColor: C.inputBorder }} />
                    <div className="flex w-full items-center justify-between">
                      <p className="text-[12px] leading-[18px]" style={{ color: C.neutralLvl2 }}>
                        Channel
                      </p>
                      <p className="text-[12px] leading-[18px]" style={{ color: C.neutralLvl2 }}>
                        Reach
                      </p>
                    </div>
                    <div className="flex w-full flex-col items-start gap-[8px]">
                      {selectedChannels.map((ch, i) => (
                        <div key={ch.name} className="flex w-full flex-col items-start gap-[8px]">
                          <SelectedChannelRow name={ch.name} pct={ch.pct} value={ch.value} />
                          {i < selectedChannels.length - 1 && <SectionSeparator />}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </SmartCard>
            </div>
          </div>
        </div>
      </div>

      {/* Footer (pinned) */}
      <div className="absolute bottom-0 left-0 right-0 flex h-[66px] flex-col items-start justify-end">
        <TemplateFooter secondaryLabel="Cancel" primaryLabel="Continue to channel planning" />
      </div>
    </div>
  );
}
