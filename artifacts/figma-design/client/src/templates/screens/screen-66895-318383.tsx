/* =========================================================================
 * Screen Template — Campaign Planning · Stage 1 (66895-318383)
 *
 * LIVE front-end reproduction of the Figma reference
 * (design-refs/screen-templates/code/66895-318383.txt). Fixed natural width
 * 1024px, light mode. Chrome composed from "@/templates/chrome"; body built
 * from real Fiber DS primitives where they match (Card, Button, Input,
 * Separator, Badge, RadioGroup, Checkbox) plus faithful custom JSX for the
 * stepper, selectable tiles and removable pills.
 *
 * COLOR CONVENTION: token colors as inline style var(--token, #hexFallback).
 * ASSETS: `${import.meta.env.BASE_URL}figmaAssets/screen-templates/66895-318383/<file>`.
 * ========================================================================= */

import { type CSSProperties } from "react";
import { Search, Plus, Calendar, X, Check } from "lucide-react";

import { TemplateNavigation, TemplateFooter } from "@/templates/chrome";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const FONT = '"DM Sans", sans-serif';

/* ----------------------------- design tokens ---------------------------- */
const C = {
  pageBg: "var(--surface-background-lvl2,#f7f7fa)",
  cardBg: "var(--surface-background-lvl1,#ffffff)",
  textLvl1: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
  textLvl2: "var(--surface-foreground-static-neutral-lvl2,#282833)",
  subtleFg: "var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)",
  borderSubtle: "var(--border-dynamic-neutral-subtle-default,#c6c6cc)",
  borderBold: "var(--border-dynamic-neutral-bold-default,#4b4b59)",
  borderStatic: "var(--border-static-subtle-neutral,#e1e1e8)",
  brand: "var(--container-dynamic-brand-subtle-foreground-delected,#7c33b5)",
  brandBorder: "var(--border-dynamic-brand-selected,#7c33b5)",
  brandBg: "var(--container-dynamic-brand-subtle-background-selected,#f6ebff)",
  brandPillBg: "var(--container-dynamic-brand-subtle-background-default,#f6ebff)",
  progressNeutral: "var(--progress-neutral,#e1e1e8)",
  brandBoldBg: "var(--container-dynamic-brand-bold-background-default,#7c33b5)",
  brandBoldFg: "var(--container-dynamic-brand-bold-foreground-default,#ffffff)",
  panelBg: "var(--surface-background-lvl2,#f7f7fa)",
};

/* -------------------------------- Section title ------------------------- */
function SectionTitle({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex w-full flex-col items-start gap-[8px]" style={{ fontFamily: FONT }}>
      <p className="w-full text-[14px] font-medium leading-[20px]" style={{ color: C.textLvl1 }}>
        {title}
      </p>
      <p className="w-full text-[12px] font-normal leading-[18px]" style={{ color: C.textLvl2 }}>
        {description}
      </p>
    </div>
  );
}

/* -------------------------------- Selectable tile ----------------------- */
function Tile({
  title,
  subtitle,
  selected = false,
  checkbox = false,
}: {
  title: string;
  subtitle: string;
  selected?: boolean;
  checkbox?: boolean;
}) {
  const style: CSSProperties = {
    backgroundColor: selected ? C.brandBg : C.cardBg,
    borderColor: selected ? C.brandBorder : C.borderSubtle,
    fontFamily: FONT,
  };
  const fg = selected ? C.brand : C.textLvl1;
  const subFg = selected ? C.brand : C.subtleFg;
  return (
    <div
      className="flex min-w-[180px] flex-[1_0_0] flex-col items-start overflow-hidden rounded-[2px] border border-solid p-[16px]"
      style={style}
    >
      <div className="flex w-full flex-col items-start gap-[8px]">
        <div className="flex w-full items-center gap-[8px]">
          {checkbox && (
            <span className="flex size-[24px] shrink-0 items-center justify-center">
              <span
                className="flex size-[16px] items-center justify-center rounded-[2px]"
                style={{ backgroundColor: "var(--controls-background-selected,#7c33b5)" }}
              >
                <Check className="size-[12px]" strokeWidth={2.5} style={{ color: "#ffffff" }} />
              </span>
            </span>
          )}
          <div className="flex min-w-0 flex-[1_0_0] flex-col items-start justify-center gap-[10px]">
            <p
              className="w-full overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-medium leading-[20px]"
              style={{ color: fg }}
            >
              {title}
            </p>
          </div>
        </div>
        <div className="flex w-full items-center">
          <p className="min-w-0 flex-[1_0_0] text-[14px] font-normal leading-[20px]" style={{ color: subFg }}>
            {subtitle}
          </p>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- Removable pill ------------------------ */
function Pill({ label }: { label: string }) {
  return (
    <span
      className="flex h-[18px] items-center justify-center gap-[4px] rounded-[100px] py-[2px] pl-[8px] pr-[6px]"
      style={{ backgroundColor: C.brandPillBg, fontFamily: FONT }}
    >
      <span className="whitespace-nowrap text-[12px] font-medium leading-[18px]" style={{ color: C.brand }}>
        {label}
      </span>
      <span className="flex size-[16px] items-center justify-center" aria-hidden="true">
        <X className="size-[10px]" strokeWidth={2} style={{ color: C.brand }} />
      </span>
    </span>
  );
}

/* -------------------------------- Radio pill (custom) ------------------- */
function RadioOption({ label, checked }: { label: string; checked?: boolean }) {
  return (
    <span className="flex shrink-0 items-center gap-[4px]" style={{ fontFamily: FONT }}>
      <span
        className="flex size-[16px] items-center justify-center rounded-full border-2"
        style={{
          borderColor: checked ? C.brand : C.borderBold,
        }}
        aria-hidden="true"
      >
        {checked && <span className="size-[8px] rounded-full" style={{ backgroundColor: C.brand }} />}
      </span>
      <span className="whitespace-nowrap text-[14px] font-normal leading-[20px]" style={{ color: C.textLvl1 }}>
        {label}
      </span>
    </span>
  );
}

/* ============================= main screen ============================== */
export default function Screen_66895_318383(): JSX.Element {
  const geographyTiles: Array<{ title: string; subtitle: string; selected?: boolean }> = [
    { title: "National", subtitle: "Australia wide" },
    { title: "New South Wales", subtitle: "Metro only", selected: true },
    { title: "Victoria", subtitle: "Regional only" },
    { title: "Queensland", subtitle: "Metro only" },
    { title: "South Australia", subtitle: "SA metro + regional" },
    { title: "Western Australia", subtitle: "WA metro + regional" },
    { title: "Tasmania", subtitle: "Regional only" },
    { title: "Northern territory", subtitle: "NT" },
    { title: "Australian capital territory", subtitle: "ACT" },
    { title: "Metro 5 cities", subtitle: "Sydney, Melbourne, Brisbane, Adelaide, Perth" },
  ];

  const selectedStates = ["VIC regional", "QLD metro", "South Australia", "Western Australia", "TAS regional", "National"];

  const brandTiles: Array<{ title: string; subtitle: string; selected?: boolean }> = [
    { title: "Automotive", subtitle: "Cars, motorcycles, vehicles" },
    { title: "Finance & insurance", subtitle: "Banking, insurance, investments" },
    { title: "Retail", subtitle: "General retail and e-commerce" },
    { title: "FMCG", subtitle: "Fast-moving consumer goods" },
    { title: "Technology", subtitle: "Electronics, software, devices", selected: true },
    { title: "Telecommunications", subtitle: "Mobile, internet, telecom" },
    { title: "Travel & tourism", subtitle: "Airlines, hotels, tourism" },
    { title: "Entertainment", subtitle: "Movies, gaming, events" },
    { title: "Health & wellness", subtitle: "Healthcare, fitness, pharma" },
    { title: "Food & beverage", subtitle: "Restaurants, QSR, beverages" },
  ];

  const ageTiles: Array<{ title: string; subtitle: string; selected?: boolean }> = [
    { title: "18-24", subtitle: "Young adults", selected: true },
    { title: "25-34", subtitle: "Young professionals", selected: true },
    { title: "35-44", subtitle: "Established adults", selected: true },
    { title: "45-54", subtitle: "Middle-aged adults" },
    { title: "55-64", subtitle: "Pre-retirees" },
    { title: "65+", subtitle: "Retirees and seniors" },
    { title: "18-39", subtitle: "Young to mid adults" },
    { title: "25-54", subtitle: "Core demo" },
    { title: "18+", subtitle: "All adults" },
  ];

  return (
    <div
      className="flex w-[1024px] flex-col items-start gap-[32px] pb-0"
      style={{ backgroundColor: C.pageBg, fontFamily: FONT }}
    >
      {/* -------------------------------- chrome ---------------------------- */}
      <TemplateNavigation activeItem="Audiences" />

      {/* -------------------------------- body ------------------------------ */}
      <div className="flex w-full items-start px-[32px] pb-[32px]">
        <div className="flex min-w-0 flex-[1_0_0] flex-col items-start gap-[24px]">
          {/* Title row */}
          <div className="flex w-full items-start justify-between">
            <div className="flex min-w-0 flex-[1_0_0] flex-col items-start gap-[8px]">
              <p
                className="w-full text-[32px] font-semibold leading-[40px] tracking-[-0.64px]"
                style={{ color: C.textLvl1 }}
              >
                Create campaign planning
              </p>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex w-full flex-col items-start">
            <div className="flex w-full items-start justify-between">
              {/* End point left */}
              <div className="flex w-[60px] shrink-0 flex-col items-start py-[10px]">
                <div className="h-[2px] w-full" style={{ backgroundColor: "var(--progress-neutral,#e1e1e8)" }} />
              </div>
              {/* Step 1 - Audience (active) */}
              <StepNode label="Audience" state="active" />
              {/* Line 1 */}
              <div className="relative h-[24px] min-w-0 flex-[1_0_0] self-center">
                <div className="h-[2px] w-full" style={{ backgroundColor: C.progressNeutral }} />
              </div>
              {/* Step 2 - Channel */}
              <StepNode label="Channel" state="inactive" />
              {/* Line 2 */}
              <div className="relative h-[24px] min-w-0 flex-[1_0_0] self-center">
                <div className="h-[2px] w-full" style={{ backgroundColor: C.progressNeutral }} />
              </div>
              {/* Step 3 - Forecast */}
              <StepNode label="Forecast" state="inactive" />
              {/* End point right */}
              <div className="flex w-[60px] shrink-0 flex-col items-start py-[11px]">
                <div className="h-[2px] w-full" style={{ backgroundColor: C.progressNeutral }} />
              </div>
            </div>
          </div>

          {/* Smart Card */}
          <Card
            className="w-full overflow-hidden rounded-[2px] border-0 p-0"
            style={{
              backgroundColor: C.cardBg,
              boxShadow:
                "0px 1px 4px rgba(113,113,128,0.08), 0px 8px 16px rgba(113,113,128,0.04)",
            }}
          >
            {/* Header */}
            <div className="flex w-full items-center gap-[8px] p-[16px]">
              <p
                className="whitespace-nowrap text-[16px] font-medium leading-[24px] tracking-[-0.08px]"
                style={{ color: C.textLvl1 }}
              >
                Define your target audience
              </p>
            </div>
            <Separator style={{ backgroundColor: C.borderStatic }} />

            {/* Content */}
            <div className="flex w-full flex-col items-start gap-[16px] p-[16px]">
              {/* Keywords + Campaign dates row */}
              <div className="flex w-full items-start gap-[24px]">
                {/* Keywords & interests */}
                <div className="flex min-w-0 flex-[1_0_0] flex-col items-start gap-[16px]">
                  <SectionTitle
                    title="Keywords & interests"
                    description="Add keywords to refine your audience (optional)"
                  />
                  <div className="flex w-full items-center gap-[16px]">
                    <div className="relative flex min-w-[180px] flex-[1_0_0] items-center">
                      <Search
                        className="pointer-events-none absolute left-[8px] size-[20px]"
                        style={{ color: C.subtleFg }}
                        aria-hidden="true"
                      />
                      <Input
                        aria-label="Search keywords and interests"
                        placeholder="Search…"
                        className="h-[34px] w-full rounded-[2px] pl-[36px] text-[14px] leading-[20px]"
                        style={{
                          borderColor: C.borderSubtle,
                          color: C.subtleFg,
                          fontFamily: FONT,
                        }}
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="flex h-[34px] shrink-0 items-center gap-[4px] rounded-[2px] border-solid px-[12px] py-[7px]"
                      style={{ borderColor: C.borderBold }}
                    >
                      <Plus className="size-[16px]" style={{ color: C.subtleFg }} aria-hidden="true" />
                      <span
                        className="text-[14px] font-medium leading-[20px]"
                        style={{ color: C.subtleFg }}
                      >
                        Add
                      </span>
                    </Button>
                  </div>
                </div>

                {/* Campaign dates */}
                <div className="flex min-w-0 max-w-[340px] flex-[1_0_0] flex-col items-start gap-[16px]">
                  <SectionTitle title="Campaign dates" description="Define when your campaign will run" />
                  <div
                    className="flex h-[34px] w-full items-center gap-[8px] rounded-[2px] border border-solid pl-[12px] pr-[8px]"
                    style={{ backgroundColor: C.cardBg, borderColor: C.borderSubtle }}
                  >
                    <span className="whitespace-nowrap text-[14px] font-normal leading-[20px]" style={{ color: C.subtleFg }}>
                      Start date
                    </span>
                    <span className="text-[14px] leading-[20px]" style={{ color: C.subtleFg }}>
                      -
                    </span>
                    <span className="min-w-0 flex-[1_0_0] overflow-hidden text-ellipsis whitespace-nowrap text-[14px] font-normal leading-[20px]" style={{ color: C.subtleFg }}>
                      End date
                    </span>
                    <Calendar className="size-[18px] shrink-0" style={{ color: C.subtleFg }} aria-hidden="true" />
                  </div>
                </div>
              </div>

              <Separator style={{ backgroundColor: C.borderStatic }} />

              {/* Geography */}
              <div className="flex w-full flex-col items-start gap-[16px]">
                <SectionTitle title="Geography" description="Select the geographic market for your campaign" />
                <div className="flex w-full items-start gap-[24px]">
                  {/* Tiles grid */}
                  <div className="flex min-w-0 flex-[1_0_0] flex-wrap content-start items-start gap-[16px]">
                    {geographyTiles.map((t) => (
                      <Tile key={t.title} title={t.title} subtitle={t.subtitle} selected={t.selected} />
                    ))}
                  </div>

                  {/* Right panel: NSW targeting */}
                  <div
                    className="flex h-[464px] min-w-0 flex-[1_0_0] flex-col items-start gap-[20px] border border-solid px-[16px] py-[8px]"
                    style={{ backgroundColor: C.panelBg, borderColor: C.borderStatic }}
                  >
                    <div className="flex w-full flex-col items-start gap-[28px]">
                      {/* State select */}
                      <div className="flex w-full flex-col items-start gap-[8px]">
                        <div className="flex w-full items-start">
                          <p
                            className="min-w-0 flex-[1_0_0] overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-medium leading-[18px]"
                            style={{ color: C.textLvl1 }}
                          >
                            New south wales - How would you like to target?
                          </p>
                        </div>
                        <div className="flex w-full flex-wrap content-start items-start gap-[8px]">
                          <RadioOption label="Full state" checked />
                          <RadioOption label="Metro only" />
                          <RadioOption label="Regional only" />
                        </div>
                      </div>

                      <Separator style={{ backgroundColor: C.borderStatic }} />

                      {/* State selected */}
                      <div className="flex w-full flex-col items-start gap-[8px]">
                        <div className="flex w-full items-start">
                          <p
                            className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] font-medium leading-[18px]"
                            style={{ color: C.textLvl1 }}
                          >
                            Selected:
                          </p>
                        </div>
                        <div className="flex w-full flex-wrap content-start items-start gap-[8px]">
                          {selectedStates.map((s) => (
                            <Pill key={s} label={s} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <Separator style={{ backgroundColor: C.borderStatic }} />

              {/* Brand category */}
              <div className="flex w-full flex-col items-start gap-[16px]">
                <SectionTitle title="Brand category" description="Select your brand category (optional)" />
                <div className="flex w-full flex-wrap content-start items-start gap-[16px]">
                  {brandTiles.map((t) => (
                    <Tile key={t.title} title={t.title} subtitle={t.subtitle} selected={t.selected} />
                  ))}
                </div>
              </div>

              <Separator style={{ backgroundColor: C.borderStatic }} />

              {/* Age range */}
              <div className="flex w-full flex-col items-start gap-[16px]">
                <SectionTitle title="Age range" description="Select one or more age ranges (can select multiple)" />
                <div className="flex w-full flex-wrap content-start items-start gap-[16px]">
                  {ageTiles.map((t) => (
                    <Tile
                      key={t.title}
                      title={t.title}
                      subtitle={t.subtitle}
                      selected={t.selected}
                      checkbox={t.selected}
                    />
                  ))}
                </div>
              </div>

              <Separator style={{ backgroundColor: C.borderStatic }} />

              {/* Gender */}
              <div className="flex w-full flex-col items-start gap-[16px]">
                <SectionTitle title="Gender" description="Select the target gender" />
                <div className="flex w-full flex-wrap content-start items-start gap-[16px]">
                  <RadioOption label="All" />
                  <RadioOption label="Male" checked />
                  <RadioOption label="Female" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* -------------------------------- footer ---------------------------- */}
      <TemplateFooter
        secondaryLabel="Cancel"
        primaryLabel="Continue to channel planning"
        screenMargin={32}
      />
    </div>
  );
}

/* -------------------------------- Stepper node -------------------------- */
function StepNode({ label, state }: { label: string; state: "active" | "inactive" }) {
  const active = state === "active";
  return (
    <div className="flex w-[24px] shrink-0 flex-col items-center gap-[12px]" style={{ fontFamily: FONT }}>
      <span
        className="flex size-[24px] items-center justify-center rounded-full"
        style={
          active
            ? { backgroundColor: "var(--container-dynamic-brand-bold-background-default,#7c33b5)" }
            : { border: "2px solid var(--progress-neutral,#e1e1e8)", backgroundColor: "transparent" }
        }
        aria-hidden="true"
      >
        {active && <span className="size-[8px] rounded-full" style={{ backgroundColor: "#ffffff" }} />}
      </span>
      <span
        className="whitespace-nowrap text-center text-[14px] leading-[20px]"
        style={{ color: C.textLvl1, fontWeight: active ? 500 : 400 }}
      >
        {label}
      </span>
    </div>
  );
}
