import { CSSProperties } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

/**
 * Logos (Figma page 186:2718)
 * Faithful reproduction of the actual UI components/variants:
 *  - Sigma Logo (Linear / IconLight / Full / Favicon)
 *  - MiQ logo + MiQ-Footer
 *  - Temp-favicon-up + i-Dot
 *  - Loading (4 variants)
 *  - Text & tokens note (from the "Logos" content frame)
 *
 * All Figma asset URLs downloaded to /figmaAssets/logos/.
 * Tailwind v4 CSS-var arbitrary values converted to plain fallbacks and
 * v4-only mask utilities converted to inline styles.
 */

const A = "/figmaAssets/logos";

/** Build an inline mask style from Figma's mask utilities. */
function mask(
  url: string,
  size: string,
  position?: string,
): CSSProperties {
  const style: CSSProperties = {
    WebkitMaskImage: `url("${url}")`,
    maskImage: `url("${url}")`,
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskSize: size,
    maskSize: size,
  };
  if (position) {
    style.WebkitMaskPosition = position;
    style.maskPosition = position;
  }
  return style;
}

/* ------------------------------------------------------------------ */
/* MiQ                                                                */
/* ------------------------------------------------------------------ */

function MiQ({ className }: { className?: string }) {
  return (
    <div
      className={
        className ||
        "content-stretch flex flex-col h-[1148.38px] items-start overflow-clip px-[8px] py-[9px] relative w-[2717.57px]"
      }
      data-name="MiQ"
    >
      <div className="flex-[1_0_0] grid-rows-[max-content] inline-grid leading-[0] min-h-px place-items-start relative w-full">
        <div className="col-1 grid-rows-[max-content] inline-grid ml-0 mt-[0.01px] place-items-start relative row-1 w-[99.99%]">
          <div className="col-1 grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1 w-full">
            <div
              className="col-1 h-[2709.73px] ml-[-0.2%] mt-[-777.68px] relative row-1 w-[100.31%]"
              style={mask(`${A}/miq-group.svg`, "2701.36px 1130.37px", "5.37px 777.68px")}
            >
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/miq-group1.svg`} />
            </div>
          </div>
        </div>
        <div className="col-1 grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1 w-full">
          <div className="col-1 grid-rows-[max-content] inline-grid ml-[46.38%] mt-[268.33px] place-items-start relative row-1 w-[6.66%]">
            <div className="col-1 grid-rows-[max-content] inline-grid ml-0 mt-[-55.31px] place-items-start relative row-1 w-full">
              <div
                className="col-1 h-[684.88px] mix-blend-multiply ml-0 mt-0 relative row-1 w-full"
                style={mask(`${A}/miq-group2.svg`, "180px 823.36px", "0px 55.31px")}
              >
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/miq-group3.svg`} />
              </div>
            </div>
          </div>
          <div className="col-1 grid-rows-[max-content] inline-grid ml-0 mt-[17.69px] place-items-start relative row-1 w-[39.75%]">
            <div className="col-1 grid-rows-[max-content] inline-grid ml-[16.76%] mt-0 place-items-start relative row-1 w-[66.48%]">
              <div className="col-1 grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1 w-full">
                <div
                  className="col-1 h-[611.15px] mix-blend-multiply ml-0 mt-0 relative row-1 w-1/2"
                  style={mask(`${A}/miq-group4.svg`, "1074px 1074px", "-180px 0px")}
                >
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/miq-group5.svg`} />
                </div>
                <div
                  className="col-1 h-[611.15px] mix-blend-multiply ml-1/2 mt-0 relative row-1 w-1/2"
                  style={mask(`${A}/miq-group4.svg`, "1074px 1074px", "-537.02px 0px")}
                >
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/miq-group6.svg`} />
                </div>
              </div>
            </div>
          </div>
          <div className="col-1 grid-rows-[max-content] inline-grid ml-[59.05%] mt-0 place-items-start relative row-1 w-[40.95%]">
            <div className="col-1 grid-rows-[max-content] inline-grid ml-0 mt-0 place-items-start relative row-1 w-full">
              <div
                className="col-1 h-[649.56px] mix-blend-multiply ml-[19.44%] mt-[623.69px] relative row-1 w-[58.72%]"
                style={mask(`${A}/miq-group7.svg`, "1106.24px 1130.38px", "-215.07px -623.69px")}
              >
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/miq-group8.svg`} />
              </div>
              <div
                className="col-1 h-[1130.38px] ml-0 mt-0 relative row-1 w-full"
                style={mask(`${A}/miq-group7.svg`, "1106.24px 1130.38px")}
              >
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/miq-vector.svg`} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* MiQ-Footer                                                         */
/* ------------------------------------------------------------------ */

function MiQFooter({ className }: { className?: string }) {
  return (
    <div className={className || "h-[55.998px] relative w-[100px]"} data-name="MiQ-Footer">
      <div className="absolute contents inset-0">
        <div className="absolute contents inset-[46.54%_14.84%_0_14.31%]">
          <div className="absolute contents inset-[46.54%_14.84%_0_14.31%]">
            <div
              className="absolute inset-[9.76%_14.76%_-37.91%_14.17%]"
              style={mask(`${A}/footer-group.svg`, "70.846px 29.937px", "0.141px 20.596px")}
            >
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/footer-group1.svg`} />
            </div>
          </div>
        </div>
        <div className="absolute inset-[0_0_82.18%_0]">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/footer-poweredby.svg`} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Loading 2 (4 variants)                                             */
/* ------------------------------------------------------------------ */

const upGradient =
  "conic-gradient(from 180deg at 50% 50%, #ff2000 0deg, #ff6500 90deg, #ffca01 180deg, #ea00ad 360deg)";

function Loading2({ variant }: { variant: "1" | "2" | "3" | "4" }) {
  const is2 = variant === "2";
  const is3 = variant === "3";
  const is4 = variant === "4";
  const isSpinner = is2 || is3 || is4;
  const ellipse = is4
    ? `${A}/loading-ellipse17.svg`
    : is3
      ? `${A}/loading-ellipse16.svg`
      : `${A}/loading-ellipse15.svg`;
  return (
    <div className="relative size-[48px]">
      <div
        className={`absolute ${isSpinner ? "flex inset-0 items-center justify-center" : "inset-[2.89%_0_0_0]"}`}
        style={isSpinner ? { containerType: "size" } : undefined}
      >
        {isSpinner && (
          <div
            className="flex-none"
            style={{
              width: is4 ? "100cqh" : is3 ? "100cqw" : "100cqh",
              height: is4 ? "100cqw" : is3 ? "100cqh" : "100cqw",
              transform: is4 ? "rotate(-90deg)" : is3 ? "rotate(180deg)" : "rotate(90deg)",
            }}
          >
            <div className="relative size-full">
              <div className="absolute inset-[2.89%_0_0_0]">
                <img alt="" className="block max-w-none size-full" src={ellipse} />
              </div>
            </div>
          </div>
        )}
        {variant === "1" && (
          <img
            alt=""
            className="block max-w-none size-full"
            src={`${A}/loading-ellipse15.svg`}
          />
        )}
      </div>
      {/* UP gradient ring backdrop to convey the loader look */}
      {isSpinner && (
        <div
          className="absolute inset-0 rounded-full opacity-20"
          style={{ background: upGradient }}
          aria-hidden
        />
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* i-Dot                                                              */
/* ------------------------------------------------------------------ */

function IDot({ className }: { className?: string }) {
  return (
    <div className={className || "h-[303.36px] relative w-[180px]"} data-name="i-Dot">
      <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/idot.svg`} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Temp-favicon-up                                                    */
/* ------------------------------------------------------------------ */

function TempFaviconUp({ className }: { className?: string }) {
  return (
    <div
      className={className || "overflow-clip relative size-[400px]"}
      style={{
        backgroundImage:
          "linear-gradient(225deg, rgb(255, 202, 1) 0%, rgb(255, 101, 0) 36.635%, rgb(255, 32, 0) 68.292%, rgb(234, 0, 173) 100%)",
      }}
      data-name="Temp-favicon-up"
    >
      <div className="-translate-x-1/2 -translate-y-1/2 absolute h-[303.36px] left-1/2 top-[calc(50%-0.32px)] w-[180px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/favicon-idot.svg`} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sigma Logo                                                         */
/* ------------------------------------------------------------------ */

type SigmaType = "Linear" | "IconLight" | "Full" | "Favicon";

function SigmaLogo({ type }: { type: SigmaType }) {
  const isFavicon = type === "Favicon";
  const isFull = type === "Full";
  const isIconLight = type === "IconLight";

  const rootClass = isFavicon
    ? "relative overflow-clip size-[400px]"
    : isFull
      ? "relative aspect-[1975.199951171875/1233.97998046875] w-[180px]"
      : isIconLight
        ? "relative h-[120px] w-[77px]"
        : "relative h-[28px] overflow-clip w-[249px]";

  return (
    <div className={rootClass}>
      {/* SHADOWS block for IconLight / Full */}
      {(isIconLight || isFull) && (
        <div className="absolute contents inset-0" data-name="SHADOWS">
          {isIconLight && (
            <div className="absolute contents inset-[0_0_22.57%_0.15%]">
              <div className="absolute contents inset-[-117.42%_-113.09%_-82.2%_-149.35%]">
                <div
                  className="absolute inset-[0_-0.26%_22.57%_0.15%]"
                  style={mask(`${A}/sigma-imgVector6.svg`, "76.885px 92.918px")}
                >
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector7.svg`} />
                </div>
                <div
                  className="absolute flex inset-[-117.42%_-113.09%_22.05%_-89.5%] items-center justify-center"
                  style={{ containerType: "size" }}
                >
                  <div className="flex-none" style={{ width: "100cqh", height: "100cqw", transform: "rotate(-90deg)" }}>
                    <div
                      className="relative size-full"
                      style={mask(`${A}/sigma-imgVector6.svg`, "76.885px 92.918px", "69.031px 140.902px")}
                    >
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector8.svg`} />
                    </div>
                  </div>
                </div>
                <div
                  className="absolute inset-[34.95%_236.76%_61.15%_-149.35%]"
                  style={mask(`${A}/sigma-imgVector6.svg`, "76.885px 92.918px", "115.115px -41.945px")}
                >
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector9.svg`} />
                </div>
                <div
                  className="absolute inset-[156.46%_77.76%_-82.2%_-46.01%] mix-blend-multiply"
                  style={mask(`${A}/sigma-imgVector6.svg`, "76.885px 92.918px", "35.544px -187.749px")}
                >
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgGroup14.svg`} />
                </div>
                <div
                  className="absolute inset-[130.72%_77.76%_-56.46%_-46.01%] mix-blend-multiply"
                  style={mask(`${A}/sigma-imgVector6.svg`, "76.885px 92.918px", "35.544px -156.863px")}
                >
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgGroup15.svg`} />
                </div>
              </div>
            </div>
          )}

          {/* Guides */}
          <div
            className={`absolute ${isFull ? "contents inset-0" : "inset-[88.93%_0.03%_0_0]"}`}
            data-name="Guides"
          >
            {isIconLight && (
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgGuides.svg`} />
            )}
            {isFull && (
              <>
                <div className="absolute inset-[1.05%_46.96%_80.98%_46.38%]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector10.svg`} />
                </div>
                <div className="absolute inset-[1.05%_60.25%_35.32%_0]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector11.svg`} />
                </div>
                <div className="absolute contents inset-[0_0.01%_33.03%_0]">
                  <div className="absolute contents inset-[-46.08%_-0.1%_-14.47%_-0.2%]">
                    <div
                      className="absolute inset-[-46.08%_-0.1%_-14.47%_-0.2%]"
                      style={mask(`${A}/sigma-imgVector12.svg`, "179.983px 75.01px", "0.358px 51.607px")}
                    >
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector13.svg`} />
                    </div>
                  </div>
                </div>
                <div className="absolute contents inset-[15.9%_46.96%_35.32%_46.38%]">
                  <div className="absolute contents inset-[12.62%_46.96%_46.8%_46.38%]">
                    <div className="absolute contents inset-[12.62%_46.96%_46.8%_46.38%] mix-blend-multiply">
                      <div
                        className="absolute inset-[12.62%_46.96%_46.8%_46.38%] mix-blend-multiply opacity-60"
                        style={mask(`${A}/sigma-imgVector14.svg`, "11.994px 54.638px", "0px 3.67px")}
                      >
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector15.svg`} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute contents inset-[1.05%_60.25%_35.32%_0]">
                  <div className="absolute contents inset-[1.05%_66.91%_62.74%_6.66%]">
                    <div className="absolute contents inset-[1.05%_80.12%_62.74%_6.66%] mix-blend-multiply">
                      <div
                        className="absolute inset-[1.05%_80.12%_62.74%_6.66%] mix-blend-multiply opacity-60"
                        style={mask(`${A}/sigma-imgVector16.svg`, "71.558px 71.27px", "-11.994px 0px")}
                      >
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector17.svg`} />
                      </div>
                    </div>
                    <div className="absolute contents inset-[1.05%_66.91%_62.74%_19.88%] mix-blend-multiply">
                      <div
                        className="absolute inset-[1.05%_66.91%_62.74%_19.88%] mix-blend-multiply opacity-60"
                        style={mask(`${A}/sigma-imgVector16.svg`, "71.558px 71.27px", "-35.781px 0px")}
                      >
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector18.svg`} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute contents inset-[0_0_33.03%_59.05%]">
                  <div className="absolute contents inset-[0_0_24.56%_59.05%]">
                    <div className="absolute contents inset-[36.95%_8.94%_24.56%_67.01%] mix-blend-multiply">
                      <div
                        className="absolute inset-[36.95%_8.94%_24.56%_67.01%] mix-blend-multiply opacity-60"
                        style={mask(`${A}/sigma-imgVector19.svg`, "73.706px 75.01px", "-14.329px -41.387px")}
                      >
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector20.svg`} />
                      </div>
                    </div>
                    <div
                      className="absolute inset-[0_0_33.03%_59.05%]"
                      style={mask(`${A}/sigma-imgVector19.svg`, "73.706px 75.01px")}
                    >
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector21.svg`} />
                    </div>
                  </div>
                </div>
                <div className="absolute contents inset-[16.05%_46.99%_34.95%_46.35%]">
                  <div className="absolute contents inset-[12.75%_46.99%_46.49%_46.35%]">
                    <div className="absolute contents inset-[12.75%_46.99%_46.49%_46.35%] mix-blend-multiply">
                      <div
                        className="absolute inset-[12.75%_46.99%_46.49%_46.35%] mix-blend-multiply opacity-60"
                        style={mask(`${A}/sigma-imgVector22.svg`, "11.991px 54.88px", "0px 3.687px")}
                      >
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector23.svg`} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute contents inset-[0.08%_0.04%_32.65%_59.02%]">
                  <div className="absolute contents inset-[0.08%_0.04%_24.15%_59.02%]">
                    <div className="absolute contents inset-[37.19%_8.98%_24.15%_66.98%] mix-blend-multiply">
                      <div
                        className="absolute inset-[37.19%_8.98%_24.15%_66.98%] mix-blend-multiply opacity-60"
                        style={mask(`${A}/sigma-imgVector24.svg`, "73.693px 75.344px", "-14.328px -41.57px")}
                      >
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector25.svg`} />
                      </div>
                    </div>
                    <div
                      className="absolute inset-[0.08%_0.04%_32.65%_59.02%]"
                      style={mask(`${A}/sigma-imgVector24.svg`, "73.693px 75.344px")}
                    >
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector26.svg`} />
                    </div>
                  </div>
                </div>
                <div className="absolute inset-[78.55%_72.93%_0_19.65%]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector27.svg`} />
                </div>
                <div className="absolute inset-[78.86%_62.75%_0.31%_35.61%]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector28.svg`} />
                </div>
                <div className="absolute inset-[78.56%_41.33%_0_45.81%]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector29.svg`} />
                </div>
                <div className="absolute inset-[78.86%_19.88%_0.31%_66.95%]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector30.svg`} />
                </div>
                <div className="absolute inset-[78.86%_0.26%_0.31%_88.08%]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector31.svg`} />
                </div>
              </>
            )}
          </div>

          {isIconLight && (
            <>
              <div className="absolute inset-[38.71%_31.6%_35.55%_0.16%] mix-blend-multiply">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgGroup16.svg`} />
              </div>
              <div className="absolute inset-[12.97%_31.6%_61.29%_0.16%] mix-blend-multiply">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgGroup17.svg`} />
              </div>
            </>
          )}

          {isFull && (
            <>
              <div className="absolute contents inset-[78.72%_89.06%_0.26%_0.01%]">
                <div className="absolute contents inset-[46.83%_76.67%_-28.19%_-9.81%]">
                  <div
                    className="absolute inset-[78.72%_89.03%_0.26%_0.01%]"
                    style={mask(`${A}/sigma-imgVector32.svg`, "19.685px 23.549px")}
                  >
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector33.svg`} />
                  </div>
                  <div
                    className="absolute flex inset-[46.83%_76.67%_0.12%_-9.81%] items-center justify-center"
                    style={{ containerType: "size" }}
                  >
                    <div className="flex-none" style={{ width: "100cqh", height: "100cqw", transform: "rotate(-90deg)" }}>
                      <div
                        className="relative size-full"
                        style={mask(`${A}/sigma-imgVector32.svg`, "19.685px 23.549px", "17.673px 35.709px")}
                      >
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector34.svg`} />
                      </div>
                    </div>
                  </div>
                  <div className="absolute contents inset-[121.2%_97.57%_-28.19%_-5.05%] mix-blend-multiply">
                    <div
                      className="absolute inset-[121.2%_97.57%_-28.19%_-5.05%] mix-blend-multiply opacity-60"
                      style={mask(`${A}/sigma-imgVector32.svg`, "19.685px 23.549px", "9.1px -47.583px")}
                    >
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector35.svg`} />
                    </div>
                  </div>
                  <div className="absolute contents inset-[114.21%_97.57%_-21.2%_-5.05%] mix-blend-multiply">
                    <div
                      className="absolute inset-[114.21%_97.57%_-21.2%_-5.05%] mix-blend-multiply opacity-60"
                      style={mask(`${A}/sigma-imgVector32.svg`, "19.685px 23.549px", "9.1px -39.755px")}
                    >
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector36.svg`} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute contents inset-[89.23%_92.52%_3.78%_0.01%] mix-blend-multiply">
                <div className="absolute inset-[89.23%_92.52%_3.78%_0.01%] mix-blend-multiply opacity-60">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector37.svg`} />
                </div>
              </div>
              <div className="absolute contents inset-[82.24%_92.52%_10.77%_0.01%] mix-blend-multiply">
                <div className="absolute inset-[82.24%_92.52%_10.77%_0.01%] mix-blend-multiply opacity-60">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector38.svg`} />
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* Linear wordmark */}
      {type === "Linear" && (
        <div className="absolute contents inset-[2.9%_0.34%_2.73%_0.46%]">
          <div className="absolute contents inset-[2.9%_0.34%_2.73%_0.46%]">
            <div className="absolute contents inset-[2.9%_0.34%_2.73%_0.46%]">
              <div className="absolute contents inset-[2.91%_74.17%_2.73%_0.46%]">
                <div className="absolute contents inset-[2.93%_74.18%_2.73%_0.46%]">
                  <div className="absolute inset-[4.41%_86.09%_70.27%_12.22%]">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector.svg`} />
                  </div>
                  <div className="absolute inset-[4.41%_89.46%_5.96%_0.46%]">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector1.svg`} />
                  </div>
                  <div className="absolute contents inset-[2.93%_74.18%_2.73%_0.46%]">
                    <div
                      className="absolute inset-[-61.97%_74.15%_-64.18%_0.41%]"
                      style={mask(`${A}/sigma-imgGroup.svg`, "63.156px 26.415px", "0.126px 18.174px")}
                    >
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgGroup1.svg`} />
                    </div>
                  </div>
                </div>
                <div className="absolute contents inset-[25.31%_86.08%_5.96%_12.23%]">
                  <div className="absolute contents inset-[20.69%_86.08%_22.14%_12.23%]">
                    <div
                      className="absolute inset-[20.69%_86.08%_22.14%_12.23%] mix-blend-multiply"
                      style={mask(`${A}/sigma-imgGroup2.svg`, "4.209px 19.245px", "0px 1.292px")}
                    >
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgGroup3.svg`} />
                    </div>
                  </div>
                </div>
                <div className="absolute contents inset-[4.39%_89.45%_5.96%_0.46%]">
                  <div className="absolute contents inset-[4.39%_91.14%_44.6%_2.15%]">
                    <div className="absolute contents inset-[4.39%_91.14%_44.6%_2.15%]">
                      <div
                        className="absolute inset-[4.39%_94.5%_44.6%_2.15%] mix-blend-multiply"
                        style={mask(`${A}/sigma-imgGroup4.svg`, "25.115px 25.104px", "-4.209px 0px")}
                      >
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgGroup5.svg`} />
                      </div>
                      <div
                        className="absolute inset-[4.39%_91.14%_44.6%_5.5%] mix-blend-multiply"
                        style={mask(`${A}/sigma-imgGroup4.svg`, "25.115px 25.104px", "-12.558px 0px")}
                      >
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgGroup6.svg`} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute contents inset-[2.91%_74.17%_2.73%_15.44%]">
                  <div className="absolute contents inset-[2.91%_74.17%_-9.2%_15.44%]">
                    <div
                      className="absolute inset-[54.97%_76.44%_-9.2%_17.46%] mix-blend-multiply"
                      style={mask(`${A}/sigma-imgGroup7.svg`, "25.869px 26.421px", "-5.029px -14.577px")}
                    >
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgGroup8.svg`} />
                    </div>
                    <div
                      className="absolute inset-[2.91%_74.17%_2.73%_15.44%]"
                      style={mask(`${A}/sigma-imgGroup7.svg`, "25.869px 26.421px")}
                    >
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector2.svg`} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute inset-[2.9%_0.34%_4.22%_38.74%]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgGroup9.svg`} />
              </div>
            </div>
            <div className="absolute contents inset-[27.21%_65.52%_26.68%_30.16%]">
              <div className="absolute contents inset-[27.21%_65.52%_26.68%_30.16%]">
                <div className="absolute contents inset-[-42.71%_60.63%_-35.7%_26.28%]">
                  <div
                    className="absolute inset-[27.21%_65.51%_26.68%_30.16%]"
                    style={mask(`${A}/sigma-imgVector3.svg`, "10.753px 12.91px")}
                  >
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector4.svg`} />
                  </div>
                  <div
                    className="absolute flex inset-[-42.71%_60.63%_26.38%_26.28%] items-center justify-center"
                    style={{ containerType: "size" }}
                  >
                    <div className="flex-none" style={{ width: "100cqh", height: "100cqw", transform: "rotate(-90deg)" }}>
                      <div
                        className="relative size-full"
                        style={mask(`${A}/sigma-imgVector3.svg`, "10.753px 12.91px", "9.654px 19.577px")}
                      >
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector5.svg`} />
                      </div>
                    </div>
                  </div>
                  <div className="absolute contents inset-[105.05%_68.89%_-35.7%_28.16%]">
                    <div
                      className="absolute inset-[120.37%_68.89%_-35.7%_28.16%] mix-blend-multiply"
                      style={mask(`${A}/sigma-imgVector3.svg`, "10.753px 12.91px", "4.971px -26.085px")}
                    >
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgGroup10.svg`} />
                    </div>
                    <div
                      className="absolute inset-[105.05%_68.89%_-20.37%_28.16%] mix-blend-multiply"
                      style={mask(`${A}/sigma-imgVector3.svg`, "10.753px 12.91px", "4.971px -21.794px")}
                    >
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgGroup11.svg`} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute contents inset-[34.94%_66.89%_34.41%_30.16%]">
                <div className="absolute inset-[50.26%_66.89%_34.41%_30.16%] mix-blend-multiply">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgGroup12.svg`} />
                </div>
                <div className="absolute inset-[34.94%_66.89%_49.74%_30.16%] mix-blend-multiply">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgGroup13.svg`} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Favicon */}
      {isFavicon && (
        <div className="-translate-x-1/2 absolute aspect-[249/300] bottom-[7.5%] left-1/2 top-[7.5%]">
          <div className="absolute contents inset-[0_0.26%_0_0.05%]">
            <div className="absolute contents inset-[0_0.26%_0_0.05%]">
              <div className="absolute contents inset-[-151.64%_-112.65%_-135.3%_-149.22%]">
                <div
                  className="absolute inset-[0_0_0_0.05%]"
                  style={mask(`${A}/sigma-imgVector39.svg`, "281.134px 340px", "0px -0.002px")}
                >
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector40.svg`} />
                </div>
                <div
                  className="absolute flex inset-[-151.64%_-112.65%_-0.66%_-89.46%] items-center justify-center"
                  style={{ containerType: "size" }}
                >
                  <div className="flex-none" style={{ width: "100cqh", height: "100cqw", transform: "rotate(-90deg)" }}>
                    <div
                      className="relative size-full"
                      style={mask(`${A}/sigma-imgVector39.svg`, "281.134px 340px", "252.416px 515.579px")}
                    >
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector41.svg`} />
                    </div>
                  </div>
                </div>
                <div
                  className="absolute inset-[45.14%_236.65%_49.83%_-149.22%]"
                  style={mask(`${A}/sigma-imgVector39.svg`, "281.134px 340px", "420.924px -153.482px")}
                >
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector42.svg`} />
                </div>
                <div className="absolute contents inset-[202.06%_77.9%_-135.3%_-46.04%] mix-blend-multiply">
                  <div
                    className="absolute inset-[202.06%_77.9%_-135.3%_-46.04%] mix-blend-multiply opacity-60"
                    style={mask(`${A}/sigma-imgVector39.svg`, "281.134px 340px", "129.968px -687px")}
                  >
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector43.svg`} />
                  </div>
                </div>
                <div className="absolute contents inset-[168.82%_77.9%_-102.06%_-46.04%] mix-blend-multiply">
                  <div
                    className="absolute inset-[168.82%_77.9%_-102.06%_-46.04%] mix-blend-multiply opacity-60"
                    style={mask(`${A}/sigma-imgVector39.svg`, "281.134px 340px", "129.968px -573.984px")}
                  >
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector44.svg`} />
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute bottom-[16.76%] contents left-[0.05%] mix-blend-multiply right-[31.81%] top-1/2">
              <div className="absolute bottom-[16.76%] left-[0.05%] mix-blend-multiply opacity-60 right-[31.81%] top-1/2">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector45.svg`} />
              </div>
            </div>
            <div className="absolute bottom-1/2 contents left-[0.05%] mix-blend-multiply right-[31.81%] top-[16.75%]">
              <div className="absolute bottom-1/2 left-[0.05%] mix-blend-multiply opacity-60 right-[31.81%] top-[16.75%]">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${A}/sigma-imgVector46.svg`} />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Playground configs                                                 */
/* ------------------------------------------------------------------ */

/** Wrap a fixed-size logo so it scales down nicely inside the preview area. */
function SigmaFrame({ type }: { type: SigmaType }) {
  if (type === "Favicon") {
    return (
      <div className="size-[240px] max-w-full">
        <SigmaLogo type="Favicon" />
      </div>
    );
  }
  return <SigmaLogo type={type} />;
}

const sigmaConfig: PlaygroundConfig = {
  name: "Sigma Logo",
  scopeId: "logos/sigma-logo",
  description: "The Sigma product mark — Linear wordmark, IconLight, Full lockup, and Favicon.",
  controls: [
    {
      kind: "select",
      name: "type",
      label: "Type",
      options: ["Linear", "IconLight", "Full", "Favicon"],
      defaultValue: "Linear",
      asTabs: true,
    },
  ],
  render: (props) => <SigmaFrame type={props.type as SigmaType} />,
  tokens: {
    "UP Gradient": "var(--up-gradient)",
    "size/linear": "249×28",
    "size/iconLight": "77×120",
    "size/full": "180 × aspect 1975.2/1233.98",
    "size/favicon": "400×400 (aspect 249/300 inner)",
    "gradient/up": upGradient,
  },
};

const miqConfig: PlaygroundConfig = {
  name: "MiQ",
  scopeId: "logos/miq",
  description: "The MiQ master logo and the compact “Powered by MiQ” footer mark.",
  controls: [
    {
      kind: "select",
      name: "type",
      label: "Type",
      options: ["Logo", "Footer"],
      defaultValue: "Logo",
      asTabs: true,
    },
  ],
  render: (props) =>
    props.type === "Footer" ? (
      <div className="w-[100px]">
        <MiQFooter />
      </div>
    ) : (
      <div className="w-full max-w-[520px] overflow-hidden">
        <MiQ className="content-stretch flex flex-col aspect-[2717.57/1148.38] w-full items-start overflow-clip relative" />
      </div>
    ),
  tokens: {
    "size/logo": "2717.57×1148.38 (scaled to fit)",
    "size/footer": "100×55.998",
  },
};

const faviconConfig: PlaygroundConfig = {
  name: "Favicon & i-Dot",
  scopeId: "logos/favicon-and-i-dot",
  description: "The gradient favicon tile and the standalone i-Dot mark.",
  controls: [
    {
      kind: "select",
      name: "type",
      label: "Type",
      options: ["Temp-favicon-up", "i-Dot"],
      defaultValue: "Temp-favicon-up",
      asTabs: true,
    },
  ],
  render: (props) =>
    props.type === "i-Dot" ? (
      <div className="h-[200px] w-[118.7px]">
        <IDot className="relative size-full" />
      </div>
    ) : (
      <div className="size-[240px] max-w-full">
        <TempFaviconUp className="overflow-clip relative size-full" />
      </div>
    ),
  tokens: {
    "gradient/favicon":
      "linear-gradient(225deg, #ffca01 0%, #ff6500 36.635%, #ff2000 68.292%, #ea00ad 100%)",
    "size/favicon": "400×400",
    "size/i-dot": "180×303.36",
  },
};

const loadingConfig: PlaygroundConfig = {
  name: "Loading",
  scopeId: "logos/loading",
  description: "Loader spinner — four rotational variants over the UP gradient ring.",
  controls: [
    {
      kind: "select",
      name: "variant",
      label: "Variant",
      options: ["1", "2", "3", "4"],
      defaultValue: "1",
      asTabs: true,
    },
  ],
  render: (props) => <Loading2 variant={props.variant as "1" | "2" | "3" | "4"} />,
  tokens: {
    "UP Gradient": "var(--up-gradient)",
    "size": "48×48",
    "gradient/up": upGradient,
  },
};

/* ------------------------------------------------------------------ */
/* Page                                                               */
/* ------------------------------------------------------------------ */

export default function LogosPage(): JSX.Element {
  return (
    <section aria-label="Logos component playground" className="flex flex-col gap-6">
      <Playground config={sigmaConfig} />
      <Playground config={miqConfig} />
      <Playground config={faviconConfig} />
      <Playground config={loadingConfig} />

      {/* Text and tokens note (from the "Logos" content frame) */}
      <div className="rounded-xl border border-[var(--border-static-subtle-neutral,#e1e1e8)] bg-[var(--surface-background-lvl1,#ffffff)] shadow-[var(--elevation-regular)] p-6">
        <div className="flex flex-col gap-[10px]">
          <p className="font-['DM_Sans:Medium',_Helvetica] text-[length:var(--headline-md-semibold-size,24px)] font-medium leading-[var(--headline-md-semibold-line-height,32px)] tracking-[-0.36px] text-[var(--surface-foreground-static-neutral-lvl3,#717180)]">
            Token for text
          </p>
          <p className="font-['DM_Sans:Medium',_Helvetica] text-[length:var(--headline-lg-semibold-size,28px)] font-medium leading-[var(--headline-lg-semibold-line-height,36px)] tracking-[-0.56px] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]">
            The text in the logos is using lvl2 foreground. Even if the original
            assets had white text, they could not be used in all contexts of the
            application. The change guarantees that the logo can be used in both
            dark and light mode.
          </p>
        </div>
      </div>
    </section>
  );
}
