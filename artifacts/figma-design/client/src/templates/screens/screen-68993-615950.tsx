/* =========================================================================
 * Screen Template — Campaign Planning - Step 4 (68993-615950)
 *
 * LIVE reproduction of the Figma reference
 * (design-refs/screen-templates/code/68993-615950.txt).
 *
 * Fixed natural width 1280px, light-mode. Composes shared chrome
 * (TemplateNavigation / TemplateFooter) and real Fiber DS primitives
 * (Tabs, Badge) where they match; chart compositions use the localized
 * SVG assets + faithful flex JSX.
 * ========================================================================= */

import { TemplateNavigation, TemplateFooter } from "@/templates/chrome";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

const FONT = '"DM Sans", sans-serif';
const ASSET = `${import.meta.env.BASE_URL}figmaAssets/screen-templates/68993-615950/`;

/* Localized assets ------------------------------------------------------- */
const imgLine70 = `${ASSET}17fd5c86-d846-4861-8bac-6b380f89dbaf.svg`;
const imgVectorFrame1 = `${ASSET}753dcfb9-7edb-4ee3-af57-3ccc340d8201.svg`;
const imgGridline = `${ASSET}065593ae-5f5f-44d0-a596-f3c8f0a0e8c2.svg`;
const imgGridline1 = `${ASSET}9bf9b1bf-e4b9-4e78-b1f3-515d4a024ff9.svg`;
const imgLine = `${ASSET}d8f713ba-61de-4d2d-a392-a05853038bb8.svg`;
const imgLine1 = `${ASSET}4115df15-eac6-41fa-9a3d-48c069320493.svg`;
const imgMarker1 = `${ASSET}4249cc21-9f86-4b97-9e30-7ebec03b175c.svg`;
const imgMarker2 = `${ASSET}2c793a32-2cb2-4d33-8cc9-ebdf05198690.svg`;
const imgMarker3 = `${ASSET}67c7a27f-e46d-4ce6-82fd-ff3690cfc7b0.svg`;
const imgMarker4 = `${ASSET}17ee06c7-0673-426b-aae0-c3cb30e2f74a.svg`;
const imgMarker5 = `${ASSET}ed0512b3-7cb2-409f-9c75-d2d57fe987e2.svg`;
const imgVectorFrame2 = `${ASSET}4bd7793b-4131-46f0-ad7f-3e2394c7ed5e.svg`;

/* Token colors ----------------------------------------------------------- */
const C = {
  bgLvl2: "var(--surface-background-lvl2,#f7f7fa)",
  surfaceLvl1: "var(--surface-background-lvl1,#ffffff)",
  neutralLvl1: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
  neutralLvl2: "var(--surface-foreground-static-neutral-lvl2,#282833)",
  neutralLvl3: "var(--surface-foreground-static-neutral-lvl3,#717180)",
  borderSubtle: "var(--border-dynamic-neutral-subtle-default,#c6c6cc)",
  warningBorder: "var(--border-static-bold-warning,#f8c500)",
  warningFg: "var(--container-static-warning-subtle-foreground-variation,#483800)",
  pillBg: "var(--container-dynamic-brand-subtle-background-default,#f6ebff)",
  pillFg: "var(--container-dynamic-brand-subtle-foreground-default,#7c33b5)",
  tabsBg: "var(--container-dynamic-neutral-subtle-background-default-variation,#ebebf0)",
  tabActiveBg: "var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)",
  tabActiveFg: "var(--container-dynamic-brand-subtle-foreground-delected,#7c33b5)",
  tabFg: "var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)",
  datavis1: "var(--datavis-qualitative-1,#fbbb3b)",
};

const CHANNELS = [
  "YouTube",
  "Online video",
  "Linear TV",
  "7plus",
  "9Now",
  "10Play",
  "Netflix Ads",
  "SBS on demand",
  "Prime video",
  "Disney+",
];

/* Bar heights (index of first coloured cell from bottom, of 10 rows) per
 * channel — replicates the incremental-reach bar heights from the reference. */
const BAR_FILL = [4, 5, 8, 4, 4, 6, 4, 5, 3, 4];

/* ---------- small sub-components ---------- */

function Separator({ className }: { className?: string }) {
  return (
    <div className={className || "relative flex w-full items-center"}>
      <div className="relative h-0 min-w-px flex-1">
        <div className="absolute inset-[-1px_0_0_0]">
          <img alt="" className="block size-full max-w-none" src={imgLine70} />
        </div>
      </div>
    </div>
  );
}

function MetricTile({
  label,
  value,
  sub,
  minWidth = 140,
  children,
}: {
  label: string;
  value?: string;
  sub?: string;
  minWidth?: number;
  children?: React.ReactNode;
}) {
  return (
    <div
      className="relative flex flex-1 items-center gap-[6px] rounded-[2px] border border-solid p-[16px]"
      style={{
        minWidth,
        backgroundColor: C.surfaceLvl1,
        borderColor: C.borderSubtle,
      }}
    >
      <div className="flex shrink-0 flex-col items-start gap-[6px]" style={{ width: children ? "100%" : undefined }}>
        <p
          className="whitespace-nowrap text-center text-[12px] leading-[18px]"
          style={{ color: C.neutralLvl3 }}
        >
          {label}
        </p>
        {value !== undefined && (
          <p
            className="whitespace-nowrap text-center text-[20px] font-semibold leading-[28px] tracking-[-0.2px]"
            style={{ color: C.neutralLvl1 }}
          >
            {value}
          </p>
        )}
        {sub !== undefined && (
          <p
            className="whitespace-nowrap text-center text-[12px] leading-[18px]"
            style={{ color: C.neutralLvl2 }}
          >
            {sub}
          </p>
        )}
        {children}
      </div>
    </div>
  );
}

function RemovablePill({ label }: { label: string }) {
  return (
    <div
      className="flex h-[18px] items-center justify-center gap-[4px] rounded-[100px] py-[2px] pl-[8px] pr-[6px]"
      style={{ backgroundColor: C.pillBg }}
    >
      <span className="text-[12px] font-medium leading-[18px]" style={{ color: C.pillFg }}>
        {label}
      </span>
      <span className="relative size-[16px] overflow-hidden">
        <img alt="" aria-hidden="true" className="absolute left-[3px] top-[3px] size-[10px]" src={imgVectorFrame1} />
      </span>
    </div>
  );
}

/* Chart chrome: shared Y-axis + gridlines + X-axis labels */
function ChartFrame({
  yLabel,
  xLabels,
  xAxisTitle,
  gridSrc = imgGridline,
  children,
  height = 300,
}: {
  yLabel: string;
  xLabels: string[];
  xAxisTitle: string;
  gridSrc?: string;
  children: React.ReactNode;
  height?: number;
}) {
  return (
    <div
      className="relative flex w-full min-w-[580px] flex-col items-start gap-[16px] overflow-hidden px-[8px] pb-[8px]"
      style={{ height, minHeight: height }}
    >
      <div className="relative flex min-h-px w-full flex-1 items-center gap-[8px] overflow-hidden">
        {/* Y-axis */}
        <div className="relative flex h-full shrink-0 items-center gap-[4px] overflow-hidden pb-[40px]">
          <div className="flex h-[69px] w-[20px] shrink-0 items-center justify-center">
            <div className="flex-none -rotate-90">
              <p
                className="whitespace-nowrap text-center text-[14px] leading-[20px]"
                style={{ color: C.neutralLvl1 }}
              >
                {yLabel}
              </p>
            </div>
          </div>
          <div
            className="relative flex h-full shrink-0 flex-col items-end justify-between whitespace-nowrap text-right text-[14px] leading-[20px]"
            style={{ color: C.neutralLvl1 }}
          >
            <p>100</p>
            <p>75</p>
            <p>50</p>
            <p>25</p>
            <p>0</p>
          </div>
        </div>
        {/* Right (plot + x-axis) */}
        <div className="relative flex h-full min-w-px flex-1 flex-col items-start overflow-hidden">
          <div className="relative min-h-px w-full flex-1 overflow-hidden">
            {/* Gridlines */}
            <div className="absolute inset-0 flex flex-col items-center justify-between overflow-hidden pb-[6px] pt-[12px]">
              {[0, 1, 2, 3, 4].map((i) => (
                <div key={i} className="relative h-0 w-full shrink-0">
                  <div className="absolute inset-[-1px_0_0_0]">
                    <img alt="" className="block size-full max-w-none" src={gridSrc} />
                  </div>
                </div>
              ))}
            </div>
            {children}
          </div>
          {/* X-axis */}
          <div className="relative flex w-full shrink-0 flex-col items-center gap-[4px]">
            <div className="relative flex w-full items-center">
              {xLabels.map((t, i) => (
                <div
                  key={`${t}-${i}`}
                  className={`relative flex min-w-px flex-1 items-center justify-center ${i === 0 ? "px-[24px]" : ""}`}
                >
                  <p
                    className="whitespace-nowrap text-center text-[14px] leading-[20px]"
                    style={{ color: C.neutralLvl1 }}
                  >
                    {t}
                  </p>
                </div>
              ))}
            </div>
            <p
              className="w-full text-center text-[14px] leading-[20px]"
              style={{ color: C.neutralLvl1 }}
            >
              {xAxisTitle}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- main screen ---------- */

export default function Screen_68993_615950(): JSX.Element {
  return (
    <div
      className="flex w-[1280px] flex-col items-start gap-[32px]"
      style={{ backgroundColor: C.bgLvl2, fontFamily: FONT }}
    >
      <TemplateNavigation activeItem="Audiences" />

      {/* Body */}
      <div className="flex w-full items-start overflow-hidden px-[64px] pb-[32px]">
        <div className="relative flex min-w-px flex-1 flex-col items-start gap-[24px]">
          {/* Header */}
          <div className="flex w-full shrink-0 items-start gap-[24px]">
            <div className="flex min-w-px flex-1 items-start justify-center">
              <div className="flex min-w-px flex-1 flex-col items-start gap-[8px]">
                <div className="flex w-full shrink-0 items-center gap-[8px]">
                  <p
                    className="whitespace-nowrap text-[32px] font-semibold leading-[40px] tracking-[-0.64px]"
                    style={{ color: C.neutralLvl1 }}
                  >
                    Plan name
                  </p>
                  <Badge
                    variant="outline"
                    className="h-[24px] gap-[4px] rounded-[100px] border-solid px-[8px] py-[2px] text-[14px] font-medium leading-[20px]"
                    style={{ borderColor: C.warningBorder, color: C.warningFg }}
                  >
                    Draft
                  </Badge>
                </div>
                <p
                  className="whitespace-nowrap text-[14px] font-medium leading-[20px]"
                  style={{ color: C.neutralLvl1 }}
                >
                  Created 5 may 2026
                </p>
              </div>
            </div>
          </div>

          {/* Plan draft & step content */}
          <div className="flex w-full shrink-0 flex-col items-start gap-[24px]">
            {/* Metrics + target audience */}
            <div className="flex w-full shrink-0 flex-col items-start gap-[24px]">
              {/* Top metric tiles */}
              <div className="flex w-full shrink-0 flex-wrap content-center items-center gap-[16px]">
                <MetricTile label="Total reach" value="93.2%" sub="of target audience" />
                <MetricTile label="Total budget (USD)" value="234,567" sub="allocated" />
                <MetricTile label="Impressions" value="23,033,366" sub="total" />
                <MetricTile label="Efficiency (USD)" value="3" sub="cost per point (000s)" />
              </div>

              {/* Target audience */}
              <div className="flex w-full shrink-0 flex-col items-start gap-[16px]">
                <div className="flex h-[20px] w-full shrink-0 flex-col items-start gap-[8px]">
                  <p
                    className="w-full text-[14px] font-medium leading-[20px]"
                    style={{ color: C.neutralLvl1 }}
                  >
                    Target audience
                  </p>
                </div>
                <div className="flex w-full min-w-[576px] shrink-0 flex-wrap content-start items-start gap-[8px]">
                  <MetricTile label="Geography" value="Victoria" minWidth={189} />
                  <MetricTile label="Brand category" value="Retail" minWidth={189} />
                  <MetricTile label="Gender" value="All" minWidth={189} />
                  <MetricTile label="Age range" minWidth={576}>
                    <div className="flex w-full shrink-0 flex-wrap content-start items-start gap-[8px]">
                      <RemovablePill label="18+" />
                      <RemovablePill label="25-34" />
                      <RemovablePill label="18-24" />
                      <RemovablePill label="35-44" />
                    </div>
                  </MetricTile>
                </div>
              </div>
            </div>

            {/* Campaign forecast */}
            <div className="flex w-full shrink-0 flex-col items-start gap-[16px]">
              {/* Tabs */}
              <Tabs defaultValue="reach-spend">
                <TabsList
                  className="h-[34px] gap-0 rounded-[100px] p-[2px]"
                  style={{ backgroundColor: C.tabsBg }}
                >
                  {[
                    { v: "reach-spend", label: "Reach & spend" },
                    { v: "audience", label: "Audience" },
                    { v: "media-plan", label: "Media plan" },
                    { v: "flighting", label: "Flighting" },
                  ].map((t) => (
                    <TabsTrigger
                      key={t.v}
                      value={t.v}
                      className="h-[30px] rounded-[20px] px-[16px] py-[5px] text-[14px] font-normal leading-[20px] data-[state=active]:shadow-none"
                      style={{
                        color: t.v === "reach-spend" ? C.tabActiveFg : C.tabFg,
                      }}
                    >
                      {t.label}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>

              {/* Smart Card */}
              <div
                className="relative flex w-full min-w-[180px] shrink-0 items-start overflow-hidden rounded-[2px]"
                style={{
                  backgroundColor: C.surfaceLvl1,
                  boxShadow:
                    "0px 1px 4px rgba(113,113,128,0.08), 0px 8px 16px rgba(113,113,128,0.04)",
                }}
              >
                <div className="flex min-w-px flex-1 flex-col items-start">
                  <div className="flex w-full shrink-0 flex-col items-start gap-[8px] p-[16px]">
                    <div className="flex w-full shrink-0 flex-col items-start gap-[24px]">
                      <div className="flex w-full shrink-0 flex-col items-start gap-[16px]">
                        {/* Chart 1: Incremental reach by channel */}
                        <div className="flex w-full shrink-0 flex-col items-start gap-[16px]">
                          <div className="flex w-full shrink-0 flex-col items-start gap-[4px]">
                            <p
                              className="w-full text-[16px] font-medium leading-[24px] tracking-[-0.08px]"
                              style={{ color: C.neutralLvl1 }}
                            >
                              Incremental reach by channel
                            </p>
                            <p
                              className="w-full text-[12px] leading-[18px]"
                              style={{ color: C.neutralLvl2 }}
                            >
                              Contribution of each channel to total reach
                            </p>
                          </div>
                          <ChartFrame
                            yLabel="Reach %"
                            xLabels={CHANNELS}
                            xAxisTitle="Channels"
                          >
                            <div className="absolute inset-[0_0_7px_0] flex items-center justify-between">
                              {BAR_FILL.map((fill, ci) => (
                                <div
                                  key={ci}
                                  className="relative flex h-full min-w-px flex-1 flex-col items-center justify-between overflow-hidden px-[32px]"
                                >
                                  {Array.from({ length: 10 }).map((_, ri) => {
                                    // rows top→bottom; fill the bottom `fill` rows
                                    const filled = ri >= 10 - fill;
                                    return (
                                      <div
                                        key={ri}
                                        className="relative max-w-[24px] min-w-[16px] min-h-px w-full flex-1"
                                        style={filled ? { backgroundColor: C.datavis1 } : undefined}
                                      />
                                    );
                                  })}
                                </div>
                              ))}
                            </div>
                          </ChartFrame>
                        </div>
                      </div>

                      <Separator className="relative flex w-full shrink-0 items-center" />

                      {/* Chart 2: Cumulative reach build */}
                      <div className="flex w-full shrink-0 flex-col items-start gap-[16px]">
                        <div className="flex w-full shrink-0 flex-col items-start gap-[4px]">
                          <p
                            className="w-full text-[16px] font-medium leading-[24px] tracking-[-0.08px]"
                            style={{ color: C.neutralLvl1 }}
                          >
                            Cumulative reach build
                          </p>
                          <p
                            className="w-full text-[12px] leading-[18px]"
                            style={{ color: C.neutralLvl2 }}
                          >
                            How reach accumulates across channels
                          </p>
                        </div>
                        <ChartFrame
                          yLabel="Cumulative reach %"
                          xLabels={CHANNELS}
                          xAxisTitle="Channels"
                        >
                          <div className="absolute inset-[0_0_7px_0] flex items-center justify-center">
                            <div className="relative flex min-w-px flex-1 items-center justify-center">
                              <div className="w-full flex-none -scale-y-100">
                                <div className="relative h-[67.94px] w-full">
                                  <div className="absolute inset-[-2.21%_-0.14%]">
                                    <img alt="" className="block size-full max-w-none" src={imgLine} />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </ChartFrame>
                      </div>

                      <Separator className="relative flex w-full shrink-0 items-center" />

                      {/* Chart 3: Reach vs spend curve */}
                      <div className="flex w-full shrink-0 flex-col items-start gap-[16px]">
                        <div className="flex w-full shrink-0 flex-col items-start gap-[4px]">
                          <p
                            className="w-full text-[16px] font-medium leading-[24px] tracking-[-0.08px]"
                            style={{ color: C.neutralLvl1 }}
                          >
                            Reach vs spend curve
                          </p>
                          <p
                            className="w-full text-[12px] leading-[18px]"
                            style={{ color: C.neutralLvl2 }}
                          >
                            Diminishing returns visualization - showing efficiency at different spend levels
                          </p>
                        </div>

                        <div className="flex w-full min-w-[580px] shrink-0 flex-col items-start gap-[16px] overflow-hidden px-[8px] pb-[8px]">
                          {/* Legend + notification */}
                          <div className="flex w-full shrink-0 flex-col items-start gap-[8px]">
                            <div className="flex w-full shrink-0 flex-wrap content-start items-start gap-[16px] overflow-hidden">
                              {[
                                { label: "Total", marker: imgMarker1 },
                                { label: "YouTube", marker: imgMarker2 },
                                { label: "Online video", marker: imgMarker3 },
                                { label: "Linear TV", marker: imgMarker4 },
                                { label: "7plus", marker: imgMarker5 },
                              ].map((l) => (
                                <div key={l.label} className="flex shrink-0 items-center gap-[12px]">
                                  <div className="relative size-[16px] shrink-0">
                                    <img alt="" className="absolute inset-0 block size-full max-w-none" src={l.marker} />
                                  </div>
                                  <p
                                    className="whitespace-nowrap text-[14px] leading-[20px]"
                                    style={{ color: C.neutralLvl1 }}
                                  >
                                    {l.label}
                                  </p>
                                </div>
                              ))}
                              {["9Now", "10pay", "Netflix Ads", "SBS on demand", "Prime video", "Disney+"].map((l) => (
                                <div key={l} className="flex shrink-0 items-center gap-[12px]">
                                  <p
                                    className="whitespace-nowrap text-[14px] leading-[20px]"
                                    style={{ color: C.neutralLvl3 }}
                                  >
                                    {l}
                                  </p>
                                </div>
                              ))}
                            </div>
                            {/* Notification */}
                            <div className="flex shrink-0 flex-col items-start">
                              <div className="flex h-[24px] shrink-0 flex-col items-start">
                                <div className="flex w-full shrink-0 flex-col items-start rounded-[2px]">
                                  <div className="flex shrink-0 items-start gap-[4px] rounded-[2px] py-[2px]">
                                    <div className="flex size-[20px] shrink-0 flex-col items-center justify-center px-px py-[2px]">
                                      <div className="relative h-[15.625px] w-[17.5px] shrink-0">
                                        <img alt="" className="absolute inset-0 block size-full max-w-none" src={imgVectorFrame2} />
                                      </div>
                                    </div>
                                    <div className="flex shrink-0 flex-col items-start self-stretch overflow-hidden pt-px">
                                      <p
                                        className="w-full text-[12px] font-medium leading-[18px]"
                                        style={{ color: C.neutralLvl1 }}
                                      >
                                        Maximum 5 channels can be selected. Unselect one channel to choose another.
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Line plot */}
                          <div className="relative flex h-[256px] w-full shrink-0 items-center gap-[8px] overflow-hidden">
                            {/* Y-axis */}
                            <div className="relative flex h-full shrink-0 items-center gap-[4px] overflow-hidden pb-[40px]">
                              <div className="flex h-[69px] w-[20px] shrink-0 items-center justify-center">
                                <div className="flex-none -rotate-90">
                                  <p
                                    className="whitespace-nowrap text-center text-[14px] leading-[20px]"
                                    style={{ color: C.neutralLvl1 }}
                                  >
                                    Reach %
                                  </p>
                                </div>
                              </div>
                              <div
                                className="relative flex h-full shrink-0 flex-col items-end justify-between whitespace-nowrap text-right text-[14px] leading-[20px]"
                                style={{ color: C.neutralLvl1 }}
                              >
                                <p>100</p>
                                <p>75</p>
                                <p>50</p>
                                <p>25</p>
                                <p>0</p>
                              </div>
                            </div>
                            {/* Right */}
                            <div className="relative flex h-full min-w-px flex-1 flex-col items-start overflow-hidden">
                              <div className="relative min-h-px w-full flex-1 overflow-hidden">
                                <div className="absolute inset-[0_-313px_0_0] flex flex-col items-center justify-between overflow-hidden pb-[6px] pt-[12px]">
                                  {[0, 1, 2, 3, 4].map((i) => (
                                    <div key={i} className="relative h-0 w-full shrink-0">
                                      <div className="absolute inset-[-1px_0_0_0]">
                                        <img alt="" className="block size-full max-w-none" src={imgGridline1} />
                                      </div>
                                    </div>
                                  ))}
                                </div>
                                <div className="absolute inset-[0_0_7px_0] flex items-center justify-center">
                                  <div className="relative h-full min-w-px flex-1">
                                    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
                                      <div className="relative h-full min-w-px flex-1">
                                        <div className="absolute inset-[-0.24%_0]">
                                          <img alt="" className="block size-full max-w-none" src={imgLine1} />
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* X-axis */}
                              <div className="relative flex w-full shrink-0 flex-col items-center gap-[4px]">
                                <div className="relative flex w-full items-center">
                                  {["12", "82", "152", "188", "235"].map((t, i) => (
                                    <div
                                      key={t}
                                      className={`relative flex min-w-px flex-1 items-center justify-center ${i === 0 ? "px-[24px]" : ""}`}
                                    >
                                      <p
                                        className="whitespace-nowrap text-center text-[14px] leading-[20px]"
                                        style={{ color: C.neutralLvl1 }}
                                      >
                                        {t}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                                <p
                                  className="w-full text-center text-[14px] leading-[20px]"
                                  style={{ color: C.neutralLvl1 }}
                                >
                                  Spend AUD
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TemplateFooter secondaryLabel="Back to channels" primaryLabel="Save & continue to activation" />
    </div>
  );
}
