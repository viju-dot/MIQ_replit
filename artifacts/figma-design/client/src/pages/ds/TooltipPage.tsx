const A = "/figmaAssets/tooltip";

// Descriptive tooltip arrows
const dArrow = `${A}/desc-arrow-0.svg`;
const dArrow1 = `${A}/desc-arrow-1.svg`;
const dArrow2 = `${A}/desc-arrow-2.svg`;
const dArrow3 = `${A}/desc-arrow-3.svg`;
const dArrow4 = `${A}/desc-arrow-4.svg`;
const dArrow5 = `${A}/desc-arrow-5.svg`;
const dArrow6 = `${A}/desc-arrow-6.svg`;
const dArrow7 = `${A}/desc-arrow-7.svg`;
const dArrow8 = `${A}/desc-arrow-8.svg`;
const dArrow9 = `${A}/desc-arrow-9.svg`;
const dArrow10 = `${A}/desc-arrow-10.svg`;
const dArrow11 = `${A}/desc-arrow-11.svg`;
const dArrow12 = `${A}/desc-arrow-12.svg`;
const dArrow13 = `${A}/desc-arrow-13.svg`;
const dArrow14 = `${A}/desc-arrow-14.svg`;

// Standard tooltip arrows
const sArrow = `${A}/std-arrow-0.svg`;
const sArrow1 = `${A}/std-arrow-1.svg`;
const sArrow2 = `${A}/std-arrow-2.svg`;
const sArrow3 = `${A}/std-arrow-3.svg`;
const sArrow4 = `${A}/std-arrow-4.svg`;
const sArrow5 = `${A}/std-arrow-5.svg`;

// Interactive tooltip arrows
const iArrow = `${A}/int-arrow-0.svg`;
const iArrow1 = `${A}/int-arrow-1.svg`;

// Number tooltip triangles
const nTri = `${A}/num-triangle-0.svg`;
const nTri1 = `${A}/num-triangle-1.svg`;
const nTri2 = `${A}/num-triangle-2.svg`;
const nTri3 = `${A}/num-triangle-3.svg`;

const shadow =
  "drop-shadow-[0px_1px_2px_rgba(113,113,128,0.08)] drop-shadow-[0px_12px_10px_rgba(113,113,128,0.1)]";

const descText =
  "Lorem ipsum dolor sit amet consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore sed et.";

/* ------------------------------------------------------------------ */
/* Descriptive Tooltip                                                */
/* ------------------------------------------------------------------ */

type DescArrow =
  | "Left"
  | "Right"
  | "Top-Left"
  | "Bottom-Left"
  | "Bottom-Right"
  | "Bottom-Middle"
  | "Top-Middle"
  | "Top-Right";

function DescriptiveTooltip({
  arrowPosition = "Top-Middle",
  colour = "Dark",
}: {
  arrowPosition?: DescArrow;
  colour?: "Dark" | "Light";
}) {
  const isBottomRow = ["Bottom-Right", "Bottom-Middle", "Bottom-Left"].includes(
    arrowPosition,
  );
  const isDarkAndBottomLeft = colour === "Dark" && arrowPosition === "Bottom-Left";
  const isDarkAndBottomMiddle = colour === "Dark" && arrowPosition === "Bottom-Middle";
  const isDarkAndBottomRight = colour === "Dark" && arrowPosition === "Bottom-Right";
  const isDarkAndLeft = colour === "Dark" && arrowPosition === "Left";
  const isLeft = arrowPosition === "Left";
  const isLightAndBottomLeft = colour === "Light" && arrowPosition === "Bottom-Left";
  const isLightAndBottomMiddle = colour === "Light" && arrowPosition === "Bottom-Middle";
  const isLightAndBottomRight = colour === "Light" && arrowPosition === "Bottom-Right";
  const isLightBottomRow =
    colour === "Light" &&
    ["Bottom-Right", "Bottom-Middle", "Bottom-Left"].includes(arrowPosition);
  const isLightTopRowOrLeft =
    colour === "Light" &&
    ["Top-Left", "Top-Middle", "Top-Right", "Left"].includes(arrowPosition);
  const isLightAndLeft = colour === "Light" && arrowPosition === "Left";
  const isLightAndRight = colour === "Light" && arrowPosition === "Right";
  const isLightAndTopLeft = colour === "Light" && arrowPosition === "Top-Left";
  const isLightAndTopMiddle = colour === "Light" && arrowPosition === "Top-Middle";
  const isLightAndTopRight = colour === "Light" && arrowPosition === "Top-Right";

  const rootGap =
    colour === "Dark" && ["Top-Right", "Bottom-Left"].includes(arrowPosition)
      ? ""
      : "gap-[10px]";

  const allLayout = isLightAndTopLeft
    ? "flex-col items-start"
    : ["Bottom-Right", "Bottom-Left"].includes(arrowPosition)
      ? "flex-col items-center justify-end"
      : ["Right", "Left"].includes(arrowPosition)
        ? "items-center"
        : "flex-col items-center";

  const boxBottomRight = isLightBottomRow
    ? "bg-white mb-[-14px]"
    : isLightAndRight
      ? "bg-white mr-[-14px]"
      : colour === "Dark" && isBottomRow
        ? "bg-[#282833] mb-[-14px]"
        : "bg-[#282833] mr-[-14px]";

  const textBottomRight = isLightBottomRow
    ? "text-[#13131a]"
    : isLightAndRight
      ? "text-[#282833]"
      : "text-white";

  const boxTop = isLightTopRowOrLeft
    ? "bg-white gap-[10px]"
    : colour === "Dark" && ["Top-Right", "Left"].includes(arrowPosition)
      ? "bg-[#282833] gap-[10px]"
      : "bg-[#282833] flex-col gap-[4px]";

  const textTop = isLightTopRowOrLeft ? "text-[#13131a]" : "text-white";

  return (
    <div
      className={`${shadow} flex flex-col items-start relative ${rootGap}`}
    >
      <div
        className={`flex gap-0 relative shrink-0 ${allLayout}`}
        data-name="All"
      >
        {["Right", "Bottom-Right", "Bottom-Middle", "Bottom-Left"].includes(
          arrowPosition,
        ) && (
          <div
            className={`flex gap-[10px] items-start px-4 py-3 relative rounded-[2px] shrink-0 ${boxBottomRight}`}
            data-name="Box"
          >
            <p
              className={`[word-break:break-word] font-['DM_Sans',Helvetica] leading-[20px] not-italic relative shrink-0 text-[14px] w-[228px] ${textBottomRight}`}
            >
              {descText}
            </p>
          </div>
        )}
        {["Right", "Bottom-Right", "Bottom-Middle", "Bottom-Left", "Left"].includes(
          arrowPosition,
        ) && (
          <div
            className={`flex items-center justify-center relative shrink-0 ${
              isLeft ? "mr-[-14px] size-[24.513px]" : isBottomRow ? "" : "size-[24.513px]"
            }`}
          >
            <div
              className={`flex-none ${
                isLeft ? "-rotate-90" : isBottomRow ? "rotate-180" : "rotate-90"
              }`}
            >
              <div
                className={`relative ${
                  isLightAndBottomLeft
                    ? "h-[24.513px] w-[229.513px]"
                    : arrowPosition === "Bottom-Right"
                      ? "h-[24.513px] w-[236.513px]"
                      : "size-[24.513px]"
                }`}
                data-name="Arrow"
              >
                {(["Right", "Bottom-Right", "Bottom-Middle", "Left"].includes(
                  arrowPosition,
                ) ||
                  isLightAndBottomLeft) && (
                  <img
                    alt=""
                    className="absolute block inset-0 max-w-none size-full"
                    src={
                      isLightAndLeft
                        ? dArrow14
                        : isLightAndBottomLeft
                          ? dArrow13
                          : isLightAndBottomMiddle
                            ? dArrow12
                            : isLightAndBottomRight
                              ? dArrow11
                              : isLightAndRight
                                ? dArrow10
                                : isDarkAndLeft
                                  ? dArrow6
                                  : isDarkAndBottomMiddle
                                    ? dArrow4
                                    : isDarkAndBottomRight
                                      ? dArrow3
                                      : dArrow2
                    }
                  />
                )}
                {isDarkAndBottomLeft && (
                  <div className="absolute inset-[0_-428.34%_0_0]">
                    <img
                      alt=""
                      className="block max-w-none size-full"
                      src={dArrow5}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        {(["Top-Middle", "Top-Right"].includes(arrowPosition) ||
          isLightAndTopLeft) && (
          <div
            className="mb-[-14px] relative shrink-0 size-[24.513px]"
            data-name="Arrow"
          >
            {(arrowPosition === "Top-Right" || isLightAndTopLeft) && (
              <div
                className={`absolute ${
                  isLightAndTopLeft ? "inset-[0_-40.79%_0_0]" : "inset-[0_-436.5%_0_0]"
                }`}
              >
                <img
                  alt=""
                  className="block max-w-none size-full"
                  src={
                    isLightAndTopRight ? dArrow9 : isLightAndTopLeft ? dArrow7 : dArrow1
                  }
                />
              </div>
            )}
            {arrowPosition === "Top-Middle" && (
              <img
                alt=""
                className="absolute block inset-0 max-w-none size-full"
                src={isLightAndTopMiddle ? dArrow8 : dArrow}
              />
            )}
          </div>
        )}
        {(["Top-Middle", "Top-Right", "Left"].includes(arrowPosition) ||
          isLightAndTopLeft) && (
          <div
            className={`flex items-start px-4 py-3 relative rounded-[2px] shrink-0 ${boxTop}`}
            data-name="Box"
          >
            <p
              className={`[word-break:break-word] font-['DM_Sans',Helvetica] leading-[20px] not-italic relative shrink-0 text-[14px] w-[228px] ${textTop}`}
            >
              {descText}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Standard Tooltip                                                   */
/* ------------------------------------------------------------------ */

type StdArrow = "Top-Middle" | "Bottom-Middle" | "Top-Left" | "Top-Right";

function StandardTooltip({
  arrowPosition = "Top-Middle",
  colour = "Dark",
  text = "Tooltip",
}: {
  arrowPosition?: StdArrow;
  colour?: "Dark" | "Light";
  text?: string;
}) {
  const isLightAndBottomMiddle = colour === "Light" && arrowPosition === "Bottom-Middle";
  const isLightAndTopMiddle = colour === "Light" && arrowPosition === "Top-Middle";
  const isDarkAndBottomMiddle = colour === "Dark" && arrowPosition === "Bottom-Middle";

  const allAlign =
    arrowPosition === "Top-Right"
      ? "items-end"
      : arrowPosition === "Top-Left"
        ? "items-start"
        : "items-center";

  const boxBg = isLightAndBottomMiddle
    ? "bg-white mb-[-14px]"
    : colour === "Light" && ["Top-Middle", "Top-Left", "Top-Right"].includes(arrowPosition)
      ? "bg-white"
      : isDarkAndBottomMiddle
        ? "bg-[#282833] mb-[-14px]"
        : "bg-[#282833]";

  return (
    <div className={`${shadow} flex flex-col gap-[10px] items-start relative`}>
      <div className={`flex flex-col gap-0 relative shrink-0 ${allAlign}`} data-name="All">
        {["Top-Middle", "Top-Left", "Top-Right"].includes(arrowPosition) && (
          <div
            className={`mb-[-14px] relative shrink-0 ${
              ["Top-Left", "Top-Right"].includes(arrowPosition)
                ? "h-[24.513px] w-[32.513px]"
                : "size-[24.513px]"
            }`}
            data-name="Arrow"
          >
            <img
              alt=""
              className="absolute block inset-0 max-w-none size-full"
              src={
                colour === "Light" && ["Top-Left", "Top-Right"].includes(arrowPosition)
                  ? sArrow5
                  : isLightAndTopMiddle
                    ? sArrow3
                    : colour === "Dark" && ["Top-Left", "Top-Right"].includes(arrowPosition)
                      ? sArrow2
                      : sArrow
              }
            />
          </div>
        )}
        <div
          className={`flex gap-[10px] items-start pb-[2px] pt-[3px] px-3 relative rounded-[2px] shrink-0 ${boxBg}`}
          data-name="Box"
        >
          {colour === "Dark" && (
            <p className="[word-break:break-word] font-['DM_Sans',Helvetica] leading-[20px] not-italic relative shrink-0 text-[14px] text-white whitespace-nowrap">
              {text}
            </p>
          )}
          {colour === "Light" && (
            <p className="[word-break:break-word] font-['DM_Sans',Helvetica] leading-[20px] not-italic relative shrink-0 text-[14px] text-[#13131a] whitespace-nowrap">
              {text}
            </p>
          )}
        </div>
        {arrowPosition === "Bottom-Middle" && (
          <div className="flex items-center justify-center relative shrink-0">
            <div className="flex-none rotate-180">
              <div className="relative size-[24.513px]" data-name="Arrow">
                <img
                  alt=""
                  className="absolute block inset-0 max-w-none size-full"
                  src={isLightAndBottomMiddle ? sArrow4 : sArrow1}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Interactive Tooltip                                                */
/* ------------------------------------------------------------------ */

function InteractiveTooltip({
  arrowPosition = "Top right",
  colour = "Dark",
  title = true,
}: {
  arrowPosition?: "Top right" | "Top left";
  colour?: "Dark" | "Light";
  title?: boolean;
}) {
  const isLight = colour === "Light";
  const isNotTitle = !title;
  const isLightAndNotTitleAndTopRight =
    colour === "Light" && !title && arrowPosition === "Top right";
  const isLightAndTitleAndTopRight =
    colour === "Light" && title && arrowPosition === "Top right";
  const isLightAndTitleAndTopLeft =
    colour === "Light" && title && arrowPosition === "Top left";
  const isDarkAndNotTitleAndTopRight =
    colour === "Dark" && !title && arrowPosition === "Top right";

  const boxBg = isLight ? "bg-white" : "bg-[#282833]";

  const contentText =
    colour === "Light" && title
      ? "[word-break:break-word] leading-[20px] not-italic text-[14px] text-[#13131a]"
      : isNotTitle
        ? ""
        : "[word-break:break-word] leading-[20px] not-italic text-[14px] text-white";

  const titleTextCls =
    colour === "Light" && !title
      ? "[word-break:break-word] font-['DM_Sans',Helvetica] leading-[20px] not-italic text-[14px] text-[#13131a]"
      : colour === "Dark" && !title
        ? "[word-break:break-word] font-['DM_Sans',Helvetica] leading-[20px] not-italic text-[14px] text-white"
        : "font-['DM_Sans',Helvetica] font-medium";

  const footerBg = isLightAndTitleAndTopLeft
    ? "bg-white"
    : colour === "Light" &&
        (arrowPosition === "Top right" || (!title && arrowPosition === "Top left"))
      ? "bg-white"
      : "bg-[#282833]";

  const linkText = isLight ? "text-[#7c33b5]" : "text-white";

  const arrowLeft = isLightAndNotTitleAndTopRight
    ? "left-[219px]"
    : isLightAndTitleAndTopRight
      ? "left-[223px]"
      : isDarkAndNotTitleAndTopRight
        ? "left-[225px]"
        : arrowPosition === "Top left"
          ? "left-[11px]"
          : "left-[224px]";

  return (
    <div className={`${shadow} flex flex-col items-start relative w-[260px]`}>
      <div
        className={`flex flex-col items-start overflow-clip relative rounded-[2px] shrink-0 w-full ${boxBg}`}
        data-name="Box"
      >
        <div
          className={`flex flex-col gap-[4px] items-start px-4 py-3 relative shrink-0 ${contentText}`}
        >
          <p className={`relative shrink-0 w-[228px] ${titleTextCls}`}>
            {isNotTitle
              ? "Lorem ipsum dolor sit amet tempor consectetur adipiscing elit, sed do."
              : "Title"}
          </p>
          {title && (
            <p className="font-['DM_Sans',Helvetica] relative shrink-0 w-[228px]">
              Lorem ipsum dolor sit amet tempor consectetur adipiscing elit, sed do.
            </p>
          )}
        </div>
        <div
          className={`border-[#e1e1e8] border-solid border-t-[1px] flex items-center p-4 relative shrink-0 w-[260px] ${footerBg}`}
          data-name="Link Buttons wrap"
        >
          <div
            className={`flex gap-0 items-start relative shrink-0 w-[162px] ${
              isLight ? "" : "flex-col h-[20px]"
            }`}
            data-name="Link Buttons"
          >
            <p
              className={`[word-break:break-word] font-['DM_Sans',Helvetica] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-center whitespace-nowrap ${linkText}`}
            >
              Learn more
            </p>
          </div>
          <div
            className={`flex flex-col items-end justify-center relative ${
              isLight ? "shrink-0 w-[66px]" : "flex-1 min-w-px"
            }`}
            data-name="Right align"
          >
            <div
              className={`flex gap-0 h-[24px] items-start relative shrink-0 ${
                isLight ? "flex-col" : ""
              }`}
              data-name="Button"
            >
              <div
                className={`flex gap-[10px] h-[24px] items-center justify-center pl-[6px] pr-[6px] py-[2px] relative rounded-[2px] shrink-0 ${
                  isLight
                    ? "border-[1px] border-[#7c33b5] border-solid"
                    : "bg-[#4b4b59]"
                }`}
                data-name="button-small"
              >
                {colour === "Dark" && (
                  <div className="[word-break:break-word] flex flex-col font-['DM_Sans',Helvetica] font-medium justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-white text-center whitespace-nowrap">
                    <p className="leading-[20px]">Confirm</p>
                  </div>
                )}
                {isLight && (
                  <p className="[word-break:break-word] font-['DM_Sans',Helvetica] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[#7c33b5] text-center whitespace-nowrap">
                    Confirm
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className={`absolute size-[24.513px] top-[-10px] ${arrowLeft}`}
        data-name="Arrow"
      >
        <img
          alt=""
          className="absolute block inset-0 max-w-none size-full"
          src={isLight ? iArrow1 : iArrow}
        />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Number Tooltip                                                     */
/* ------------------------------------------------------------------ */

function NumberTooltip({
  colour = "Light Purple",
  text = "50",
}: {
  colour?: "Dark" | "Light Purple" | "Light" | "Disabled Light";
  text?: string;
}) {
  const isDark = colour === "Dark";
  const isDisabledLight = colour === "Disabled Light";
  const isLight = colour === "Light";

  const bg = isDisabledLight
    ? "bg-[rgba(113,113,128,0.1)]"
    : isDark
      ? "bg-[#282833]"
      : isLight
        ? "bg-white"
        : "bg-[#717180]";

  return (
    <div className={`${shadow} flex flex-col items-center relative`}>
      <div
        className={`flex flex-col items-center justify-center px-[4px] relative rounded-[2px] shrink-0 ${bg}`}
        data-name="Number"
      >
        {["Light Purple", "Dark"].includes(colour) && (
          <p className="[word-break:break-word] font-['DM_Sans',Helvetica] font-medium leading-[18px] not-italic relative shrink-0 text-[12px] text-white whitespace-nowrap">
            {text}
          </p>
        )}
        {isLight && (
          <p className="[word-break:break-word] font-['DM_Sans',Helvetica] font-medium leading-[18px] not-italic relative shrink-0 text-[12px] text-[#13131a] whitespace-nowrap">
            {text}
          </p>
        )}
        {isDisabledLight && (
          <p className="[word-break:break-word] font-['DM_Sans',Helvetica] font-medium leading-[18px] not-italic relative shrink-0 text-[12px] text-[#a8a8b2] whitespace-nowrap">
            {text}
          </p>
        )}
      </div>
      <div className="flex items-center justify-center relative shrink-0">
        <div className="flex-none rotate-180">
          <div className="h-[4px] relative w-[8px]" data-name="Triangle">
            <div className="absolute inset-[10.36%_0_0_0]">
              <img
                alt=""
                className="block max-w-none size-full"
                src={
                  isDisabledLight ? nTri3 : isDark ? nTri2 : isLight ? nTri1 : nTri
                }
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Shared layout helpers                                              */
/* ------------------------------------------------------------------ */

function Caption({ children }: { children: React.ReactNode }) {
  return <span className="text-[12px] text-[#a8a8b2]">{children}</span>;
}

function Cell({
  label,
  dark,
  children,
}: {
  label: string;
  dark?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Caption>{label}</Caption>
      <div
        className={`flex min-h-[120px] items-center justify-center rounded-[4px] p-6 ${
          dark ? "bg-[#3a3a47]" : "bg-[#f4f4f6]"
        }`}
      >
        {children}
      </div>
    </div>
  );
}

const descPositions: DescArrow[] = [
  "Top-Left",
  "Top-Middle",
  "Top-Right",
  "Right",
  "Bottom-Right",
  "Bottom-Middle",
  "Bottom-Left",
  "Left",
];

// Dark descriptive omits Top-Left in Figma; kept full set for Light.
const descDarkPositions: DescArrow[] = [
  "Top-Middle",
  "Top-Right",
  "Right",
  "Bottom-Right",
  "Bottom-Middle",
  "Bottom-Left",
  "Left",
];

const stdPositions: StdArrow[] = [
  "Top-Middle",
  "Bottom-Middle",
  "Top-Left",
  "Top-Right",
];

export default function TooltipPage() {
  return (
    <section className="flex flex-col gap-8">
      {/* Standard Tooltip */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <h2 className="mb-4 text-[16px] font-medium text-[#13131a]">
          Standard Tooltip
        </h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(200px,1fr))] gap-5">
          {stdPositions.map((pos) => (
            <Cell key={`std-dark-${pos}`} label={`Dark · ${pos}`} dark>
              <StandardTooltip colour="Dark" arrowPosition={pos} />
            </Cell>
          ))}
          {stdPositions.map((pos) => (
            <Cell key={`std-light-${pos}`} label={`Light · ${pos}`}>
              <StandardTooltip colour="Light" arrowPosition={pos} />
            </Cell>
          ))}
        </div>
      </div>

      {/* Descriptive Tooltip */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <h2 className="mb-4 text-[16px] font-medium text-[#13131a]">
          Descriptive Tooltip
        </h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
          {descDarkPositions.map((pos) => (
            <Cell key={`desc-dark-${pos}`} label={`Dark · ${pos}`} dark>
              <DescriptiveTooltip colour="Dark" arrowPosition={pos} />
            </Cell>
          ))}
          {descPositions.map((pos) => (
            <Cell key={`desc-light-${pos}`} label={`Light · ${pos}`}>
              <DescriptiveTooltip colour="Light" arrowPosition={pos} />
            </Cell>
          ))}
        </div>
      </div>

      {/* Interactive Tooltip */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <h2 className="mb-4 text-[16px] font-medium text-[#13131a]">
          Interactive Tooltip
        </h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-5">
          <Cell label="Dark · Title · Top right" dark>
            <InteractiveTooltip colour="Dark" title arrowPosition="Top right" />
          </Cell>
          <Cell label="Dark · Title · Top left" dark>
            <InteractiveTooltip colour="Dark" title arrowPosition="Top left" />
          </Cell>
          <Cell label="Dark · No title · Top right" dark>
            <InteractiveTooltip colour="Dark" title={false} arrowPosition="Top right" />
          </Cell>
          <Cell label="Dark · No title · Top left" dark>
            <InteractiveTooltip colour="Dark" title={false} arrowPosition="Top left" />
          </Cell>
          <Cell label="Light · Title · Top right">
            <InteractiveTooltip colour="Light" title arrowPosition="Top right" />
          </Cell>
          <Cell label="Light · Title · Top left">
            <InteractiveTooltip colour="Light" title arrowPosition="Top left" />
          </Cell>
          <Cell label="Light · No title · Top left">
            <InteractiveTooltip colour="Light" title={false} arrowPosition="Top left" />
          </Cell>
          <Cell label="Light · No title · Top right">
            <InteractiveTooltip colour="Light" title={false} arrowPosition="Top right" />
          </Cell>
        </div>
      </div>

      {/* Number Tooltip */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <h2 className="mb-4 text-[16px] font-medium text-[#13131a]">
          Number Tooltip
        </h2>
        <div className="grid grid-cols-[repeat(auto-fill,minmax(140px,1fr))] gap-5">
          <Cell label="Light Purple">
            <NumberTooltip colour="Light Purple" />
          </Cell>
          <Cell label="Light">
            <NumberTooltip colour="Light" />
          </Cell>
          <Cell label="Dark" dark>
            <NumberTooltip colour="Dark" />
          </Cell>
          <Cell label="Disabled Light">
            <NumberTooltip colour="Disabled Light" />
          </Cell>
        </div>
      </div>
    </section>
  );
}
