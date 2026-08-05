import { useState } from "react";

/* =========================================================================
 * Cards (Figma page node 65:24)
 * Component groups: Smart Card, Smart Wide Card, Header, Footer, Content,
 * Swap Instance, Terms & Policy Card.
 * Documentation / annotation frames are intentionally skipped.
 * ========================================================================= */

const STAR = "/figmaAssets/cards/star.svg";
const STAR_DISABLED = "/figmaAssets/cards/star-disabled.svg";
const STAR_24 = "/figmaAssets/cards/star-24.svg";
const DRAG = "/figmaAssets/cards/drag-dots.svg";

/* ---------- shared atoms ---------- */

function StarIcon({ size = 20, src = STAR }: { size?: number; src?: string }) {
  return (
    <span
      className="flex items-center justify-center shrink-0"
      style={{ width: size, height: size }}
    >
      <img alt="" className="block max-w-none w-full h-full" src={src} />
    </span>
  );
}

function DragSection({
  disabled = false,
  hover = false,
}: {
  disabled?: boolean;
  hover?: boolean;
}) {
  return (
    <div className="flex items-center self-stretch shrink-0">
      <div
        className={`flex h-full w-[40px] items-center justify-center border-r border-solid border-[#e1e1e8] rounded-l-[2px] shrink-0 ${
          hover
            ? "bg-[rgba(113,113,128,0.08)]"
            : disabled
              ? ""
              : "bg-white"
        }`}
      >
        <span className="flex items-center justify-center shrink-0 w-[24px] h-[24px] overflow-hidden">
          <img alt="" className="block max-w-none w-full h-full" src={DRAG} />
        </span>
      </div>
    </div>
  );
}

/* Small solid brand button */
function BtnCompactSolid({ disabled = false }: { disabled?: boolean }) {
  return (
    <div className="flex h-[24px] items-start rounded-[2px] shrink-0">
      <div
        className={`flex h-[24px] items-center justify-center pl-[6px] pr-[6px] py-[2px] rounded-[2px] shrink-0 ${
          disabled ? "bg-[rgba(113,113,128,0.1)]" : "bg-[#7c33b5]"
        }`}
      >
        <p
          className="font-medium leading-[20px] text-[14px] text-center whitespace-nowrap"
          style={{
            fontFamily: '"DM Sans", Helvetica',
            color: disabled ? "#a8a8b2" : "white",
          }}
        >
          Compact
        </p>
      </div>
    </div>
  );
}

/* Small outline button */
function BtnCompactOutline({ disabled = false }: { disabled?: boolean }) {
  return (
    <div className="flex h-[24px] items-start rounded-[2px] shrink-0">
      <div
        className={`flex h-[24px] items-center justify-center pl-[6px] pr-[6px] py-[2px] rounded-[2px] border border-solid shrink-0 ${
          disabled ? "border-[#a8a8b2]" : "border-[#4b4b59]"
        }`}
      >
        <p
          className="font-medium leading-[20px] text-[14px] text-center whitespace-nowrap"
          style={{
            fontFamily: '"DM Sans", Helvetica',
            color: disabled ? "#a8a8b2" : "#4b4b59",
          }}
        >
          Compact
        </p>
      </div>
    </div>
  );
}

function LinkButton({ disabled = false }: { disabled?: boolean }) {
  return (
    <div className="flex items-start shrink-0">
      <p
        className="font-medium leading-[20px] text-[14px] text-center whitespace-nowrap"
        style={{
          fontFamily: '"DM Sans", Helvetica',
          color: disabled ? "#a8a8b2" : "#7c33b5",
        }}
      >
        Link
      </p>
    </div>
  );
}

function IconButton({ src = STAR, size = 20 }: { src?: string; size?: number }) {
  return (
    <div className="flex items-center p-[2px] rounded-[2px] shrink-0">
      <StarIcon size={size} src={src} />
    </div>
  );
}

/* Card footer used inside Smart Card / Smart Wide Card */
function CardFooter({ disabled = false }: { disabled?: boolean }) {
  return (
    <div className="flex flex-wrap content-end items-end justify-between overflow-hidden border-t border-solid border-[#e1e1e8] p-[16px] w-full shrink-0 gap-2">
      <div className="flex gap-[8px] items-center shrink-0">
        <IconButton src={disabled ? STAR_DISABLED : STAR} />
        <BtnCompactSolid disabled={disabled} />
        <LinkButton disabled={disabled} />
      </div>
      <div className="flex gap-[8px] items-center justify-end shrink-0">
        <LinkButton disabled={disabled} />
        <BtnCompactOutline disabled={disabled} />
        <BtnCompactSolid disabled={disabled} />
      </div>
    </div>
  );
}

/* ---------- Header ---------- */

function CardHeader({
  disabled = false,
  rightTab = false,
}: {
  disabled?: boolean;
  rightTab?: boolean;
}) {
  const titleColor = disabled ? "#a8a8b2" : "#13131a";
  const starSrc = disabled ? STAR_DISABLED : STAR;
  if (rightTab) {
    return (
      <div className="flex flex-col w-full">
        <div className="flex flex-wrap content-end items-end gap-[8px] px-[16px] w-full">
          <div className="flex flex-1 min-w-0 items-center gap-[8px] py-[16px]">
            <IconButton src={starSrc} />
            <div className="flex flex-1 min-w-0 items-center gap-[8px] pr-[8px]">
              <p
                className="font-medium leading-[24px] text-[16px] tracking-[-0.08px] whitespace-nowrap"
                style={{ fontFamily: '"DM Sans", Helvetica', color: titleColor }}
              >
                Card Title
              </p>
              <IconButton src={starSrc} />
            </div>
          </div>
          <div className="flex items-end justify-center shrink-0">
            <div className="flex flex-col items-center justify-end gap-[8px]">
              <div className="flex items-center px-[16px]">
                <p
                  className="leading-[20px] text-[14px] whitespace-nowrap"
                  style={{ fontFamily: '"DM Sans", Helvetica', color: "#7c33b5" }}
                >
                  Tab
                </p>
              </div>
              <div className="w-full h-0 border-t border-solid border-[#7c33b5]" />
            </div>
            <div className="flex flex-col items-center justify-end gap-[8px]">
              <div className="flex items-center px-[16px]">
                <p
                  className="leading-[20px] text-[14px] whitespace-nowrap"
                  style={{ fontFamily: '"DM Sans", Helvetica', color: "#13131a" }}
                >
                  Tab
                </p>
              </div>
              <div className="w-full h-0 border-t border-solid border-[#e1e1e8]" />
            </div>
          </div>
        </div>
        <div className="w-full h-0 border-t border-solid border-[#e1e1e8]" />
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-[8px] p-[16px] w-full">
        <IconButton src={starSrc} />
        <div className="flex flex-1 min-w-0 items-center gap-[8px] pr-[8px]">
          <p
            className="font-medium leading-[24px] text-[16px] tracking-[-0.08px] whitespace-nowrap"
            style={{ fontFamily: '"DM Sans", Helvetica', color: titleColor }}
          >
            Card Title
          </p>
          <IconButton src={starSrc} />
        </div>
        <IconButton src={starSrc} />
      </div>
      <div className="w-full h-0 border-t border-solid border-[#e1e1e8]" />
    </div>
  );
}

/* dashed placeholder container ("Swap Instance" container variant) */
function PlaceholderBox({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-[rgba(209,148,255,0.2)] border border-dashed border-[#d194ff] w-full ${className}`}
    />
  );
}

/* ---------- Smart Card ---------- */

type SmartCardState = "default" | "selected" | "disabled" | "hover";

function SmartCard({
  state = "default",
  showHeader = true,
  showFooter = false,
  showDragSection = false,
}: {
  state?: SmartCardState;
  showHeader?: boolean;
  showFooter?: boolean;
  showDragSection?: boolean;
}) {
  const isSelected = state === "selected";
  const isDisabled = state === "disabled";
  const isHover = state === "hover";

  const shadow = isHover
    ? "0px 1px 4px 0px rgba(113,113,128,0.08), 0px 12px 20px 0px rgba(113,113,128,0.1)"
    : isSelected
      ? "0px 1px 4px 0px rgba(113,113,128,0.08), 0px 16px 24px 0px rgba(113,113,128,0.12)"
      : "0px 1px 4px 0px rgba(113,113,128,0.08), 0px 8px 16px 0px rgba(113,113,128,0.04)";

  return (
    <div
      className={`flex items-start min-w-[180px] overflow-hidden rounded-[2px] ${
        isDisabled ? "bg-[rgba(113,113,128,0.1)]" : "bg-white"
      } ${isSelected ? "border border-solid border-[#7c33b5]" : ""}`}
      style={{ boxShadow: shadow }}
    >
      {showDragSection && (
        <DragSection disabled={isDisabled} hover={isHover} />
      )}
      <div className="flex flex-col items-start w-[400px]">
        {showHeader && <CardHeader disabled={isDisabled} />}
        <div className="flex flex-col gap-[8px] items-start p-[16px] w-full">
          <PlaceholderBox className="h-[193px]" />
        </div>
        {showFooter && <CardFooter disabled={isDisabled} />}
      </div>
    </div>
  );
}

/* ---------- Smart Wide Card ---------- */

type WideStyle =
  | "Simple"
  | "Simple Filled"
  | "Line"
  | "Line Filled"
  | "Box Filled"
  | "Box"
  | "Draggable";

function WideTitleRow({ multipleIcons = false }: { multipleIcons?: boolean }) {
  return (
    <div className="flex items-center gap-[8px] w-full">
      <p
        className="flex-1 min-w-0 font-medium leading-[24px] text-[16px] tracking-[-0.08px]"
        style={{ fontFamily: '"DM Sans", Helvetica', color: "#13131a" }}
      >
        Card Title
      </p>
      {multipleIcons ? (
        <div className="flex items-center gap-[8px] shrink-0">
          <StarIcon size={24} src={STAR_24} />
          <StarIcon size={24} src={STAR_24} />
          <StarIcon size={24} src={STAR_24} />
        </div>
      ) : (
        <StarIcon size={24} src={STAR_24} />
      )}
    </div>
  );
}

function WideDescription() {
  return (
    <p
      className="flex-1 min-w-0 leading-[20px] text-[14px] w-full"
      style={{ fontFamily: '"DM Sans", Helvetica', color: "#13131a" }}
    >
      Example Text
    </p>
  );
}

function SmartWideCard({
  style = "Simple",
  footer = true,
}: {
  style?: WideStyle;
  footer?: boolean;
}) {
  const cardShadow =
    "drop-shadow(0px 1px 2px rgba(113,113,128,0.08)) drop-shadow(0px 8px 8px rgba(113,113,128,0.04))";

  /* Simple / Simple Filled / Draggable: placeholder only */
  if (style === "Simple" || style === "Simple Filled" || style === "Draggable") {
    return (
      <div
        className="flex items-start bg-white rounded-[2px] w-full p-[16px] gap-[16px]"
        style={{ filter: cardShadow }}
      >
        {style === "Draggable" && (
          <span className="flex items-center justify-center shrink-0 w-[24px] h-[24px] overflow-hidden">
            <img alt="" className="block max-w-none w-full h-full" src={DRAG} />
          </span>
        )}
        <div className="flex flex-col gap-[16px] flex-1 min-w-0">
          <PlaceholderBox className="h-[80px]" />
          {footer && (
            <div className="flex items-center justify-end gap-[8px]">
              <LinkButton />
              <BtnCompactOutline />
              <BtnCompactSolid />
            </div>
          )}
        </div>
      </div>
    );
  }

  /* Line: title row + separator + placeholder + optional footer */
  if (style === "Line") {
    return (
      <div
        className="flex flex-col gap-[16px] bg-white rounded-[2px] w-full py-[16px]"
        style={{ filter: cardShadow }}
      >
        <div className="px-[16px]">
          <WideTitleRow />
        </div>
        <div className="w-full h-0 border-t border-solid border-[#e1e1e8]" />
        <div className="px-[16px]">
          <PlaceholderBox className="h-[60px]" />
        </div>
        {footer && (
          <div className="flex items-center justify-end gap-[8px] px-[16px]">
            <LinkButton />
            <BtnCompactOutline />
            <BtnCompactSolid />
          </div>
        )}
      </div>
    );
  }

  /* Line Filled: title with icons, separator, description, footer */
  if (style === "Line Filled") {
    return (
      <div
        className="flex flex-col gap-[16px] bg-white rounded-[2px] w-full py-[16px]"
        style={{ filter: cardShadow }}
      >
        <div className="flex items-start justify-between px-[16px]">
          <div className="flex items-center gap-[8px]">
            <StarIcon size={24} src={STAR_24} />
            <p
              className="font-medium leading-[19px] text-[16px] tracking-[-0.32px]"
              style={{ fontFamily: '"DM Sans", Helvetica', color: "#13131a" }}
            >
              Card Title
            </p>
          </div>
          <div className="flex items-center gap-[8px] shrink-0">
            <StarIcon size={24} src={STAR_24} />
            <StarIcon size={24} src={STAR_24} />
            <StarIcon size={24} src={STAR_24} />
          </div>
        </div>
        <div className="w-full h-0 border-t border-solid border-[#e1e1e8]" />
        {footer && (
          <>
            <div className="px-[16px]">
              <WideDescription />
            </div>
            <div className="px-[16px]">
              <CardFooter />
            </div>
          </>
        )}
      </div>
    );
  }

  /* Box Filled: bordered content box + optional footer */
  if (style === "Box Filled") {
    return (
      <div
        className="flex flex-col gap-[16px] bg-white rounded-[2px] w-full p-[16px]"
        style={{ filter: cardShadow }}
      >
        <div className="flex items-start justify-between">
          {footer && (
            <StarIcon size={24} src={STAR_24} />
          )}
          <div className="flex flex-1 min-w-0 items-start justify-end gap-[8px]">
            <p
              className="flex-1 min-w-0 font-medium leading-[19px] text-[16px] tracking-[-0.32px] pl-[8px] pr-[10px] pt-[3px] pb-[2px]"
              style={{ fontFamily: '"DM Sans", Helvetica', color: "#13131a" }}
            >
              Card Title
            </p>
            <div className="flex items-center gap-[8px] shrink-0">
              <StarIcon size={24} src={STAR_24} />
              <StarIcon size={24} src={STAR_24} />
              <StarIcon size={24} src={STAR_24} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[8px] items-start p-[16px] border border-solid border-[#e1e1e8] w-full">
          <WideDescription />
        </div>
        {footer && <CardFooter />}
      </div>
    );
  }

  /* Box: title row, bordered box, optional footer */
  return (
    <div
      className="flex flex-col items-start bg-white rounded-[2px] w-full p-[16px] gap-[16px]"
      style={{ filter: cardShadow }}
    >
      <WideTitleRow />
      <PlaceholderBox className="flex-1 min-h-[80px] border-solid border-[#e1e1e8]" />
      {footer && (
        <div className="flex items-center justify-end gap-[8px] w-full">
          <LinkButton />
          <BtnCompactOutline />
          <BtnCompactSolid />
        </div>
      )}
    </div>
  );
}

/* ---------- Footer (standalone component) ---------- */

function StandaloneFooter({
  leftFooter = true,
  rightFooter = true,
}: {
  leftFooter?: boolean;
  rightFooter?: boolean;
}) {
  return (
    <div className="flex flex-wrap content-end items-end justify-between gap-2 w-full max-w-[368px]">
      {leftFooter && (
        <div className="flex gap-[8px] items-center shrink-0">
          <IconButton src={STAR} />
          <BtnCompactSolid />
          <LinkButton />
        </div>
      )}
      {rightFooter && (
        <div className="flex gap-[8px] items-center justify-end shrink-0">
          <LinkButton />
          <BtnCompactOutline />
          <BtnCompactSolid />
        </div>
      )}
    </div>
  );
}

/* ---------- Content ---------- */

function CardContent({
  type = "box with line",
}: {
  type?: "box with line" | "outlined box" | "two box";
}) {
  if (type === "box with line") {
    return (
      <div className="flex flex-col gap-[8px] items-start bg-white p-[16px] w-[368px] h-[225px]">
        <PlaceholderBox className="flex-1 min-h-0" />
      </div>
    );
  }
  if (type === "outlined box") {
    return (
      <div className="flex flex-col items-center pb-[16px] px-[16px] bg-white w-[368px]">
        <div className="flex flex-col items-start p-[16px] h-[209px] border border-solid border-[#e1e1e8] w-full">
          <PlaceholderBox className="flex-1 min-h-0" />
        </div>
      </div>
    );
  }
  /* two box */
  return (
    <div className="flex flex-col items-start p-[16px] bg-white w-[368px] h-[169px]">
      <div className="flex flex-1 flex-col items-start p-[16px] border border-solid border-[#e1e1e8] w-full min-h-0 -mb-px">
        <PlaceholderBox className="flex-1 min-h-0" />
      </div>
      <div className="flex flex-1 flex-col items-start p-[16px] border border-solid border-[#e1e1e8] w-full min-h-0">
        <PlaceholderBox className="flex-1 min-h-0" />
      </div>
    </div>
  );
}

/* ---------- Swap Instance ---------- */

function SwapInstance({ type = "container" }: { type?: "container" | "text" }) {
  if (type === "text") {
    return (
      <div className="flex items-center w-[200px] h-[168px]">
        <p
          className="flex-1 min-w-0 leading-[20px] text-[14px]"
          style={{ fontFamily: '"DM Sans", Helvetica', color: "#13131a" }}
        >
          Text
        </p>
      </div>
    );
  }
  return (
    <div className="bg-[rgba(209,148,255,0.2)] border border-dashed border-[#d194ff] w-[200px] h-[168px]" />
  );
}

/* ---------- Terms & Policy Card ---------- */

function TermsPolicyCard() {
  return (
    <div className="relative flex flex-col items-start rounded-[2px] w-full max-w-[588px] min-h-[248px]">
      <div className="flex gap-[10px] items-start pb-[16px] pt-[72px] px-[16px] w-full">
        <div className="absolute left-0 top-0 flex flex-col items-start w-full">
          <div
            className="flex flex-col gap-[16px] items-start px-0 py-[16px] bg-white rounded-[2px] w-full"
            style={{
              filter:
                "drop-shadow(0px 1px 2px rgba(113,113,128,0.08)) drop-shadow(0px 8px 8px rgba(113,113,128,0.04))",
            }}
          >
            <div className="flex flex-wrap content-start gap-[8px] items-start px-[16px] w-full">
              <div className="flex flex-1 min-w-0 items-center pr-[10px]">
                <p
                  className="flex-1 min-w-0 font-medium leading-[24px] text-[16px] tracking-[-0.08px]"
                  style={{ fontFamily: '"DM Sans", Helvetica', color: "#13131a" }}
                >
                  Privacy Statement
                </p>
              </div>
            </div>
            <div className="w-full h-0 border-t border-solid border-[#e1e1e8]" />
          </div>
        </div>
        <p
          className="flex-1 min-w-0 leading-[20px] text-[14px]"
          style={{ fontFamily: '"DM Sans", Helvetica', color: "#13131a" }}
        >
          {`MiQ Digital Limited (“MiQ” or “we” or “us” or “our”) is committed to protecting the personal data of individuals whose personal data we process. This Statement is incorporated by reference into our MiQ Privacy Policy which is located at https://www.wearemiq.com/privacy-and-compliance/privacy-policy/ (“Privacy Policy”) MiQ is committed to working with you to obtain a fair and rapid resolution of any queries, complaints, or disputes about privacy. If you should have any questions about this Policy, our Privacy Policy or our information collection, retention, use and sharing practices, please contact us at privacy@miqdigital.com.`}
        </p>
      </div>
    </div>
  );
}

/* ========================================================================= */

const groupCard =
  "rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5";
const caption = "text-[12px] text-[#a8a8b2]";

function Variant({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className={caption}>{label}</span>
      {children}
    </div>
  );
}

export default function CardsPage(): JSX.Element {
  const [dragDemo, setDragDemo] = useState(true);

  return (
    <section className="flex flex-col gap-8" aria-label="Cards">
      {/* Smart Card */}
      <div className={groupCard}>
        <span className={`${caption} mb-4 block`}>Smart Card — states</span>
        <div className="flex flex-wrap gap-8">
          <Variant label="Default">
            <div className="w-[400px] max-w-full">
              <SmartCard state="default" showFooter />
            </div>
          </Variant>
          <Variant label="Selected">
            <div className="w-[400px] max-w-full">
              <SmartCard state="selected" showFooter />
            </div>
          </Variant>
          <Variant label="Disabled">
            <div className="w-[400px] max-w-full">
              <SmartCard state="disabled" showFooter />
            </div>
          </Variant>
          <Variant label="Hover">
            <div className="w-[400px] max-w-full">
              <SmartCard state="hover" showFooter />
            </div>
          </Variant>
          <Variant label="With drag handle">
            <div className="w-[440px] max-w-full">
              <SmartCard state="default" showFooter showDragSection />
            </div>
          </Variant>
          <Variant label="No footer">
            <div className="w-[400px] max-w-full">
              <SmartCard state="default" />
            </div>
          </Variant>
        </div>
      </div>

      {/* Smart Wide Card */}
      <div className={groupCard}>
        <span className={`${caption} mb-4 block`}>
          Smart Wide Card — style × footer
        </span>
        <div className="flex flex-col gap-6 max-w-[1200px]">
          {(
            [
              "Simple",
              "Simple Filled",
              "Line",
              "Line Filled",
              "Box Filled",
              "Box",
            ] as WideStyle[]
          ).map((style) => (
            <div key={style} className="flex flex-col gap-4">
              <Variant label={`${style}, Footer On`}>
                <SmartWideCard style={style} footer />
              </Variant>
              <Variant label={`${style}, Footer Off`}>
                <SmartWideCard style={style} footer={false} />
              </Variant>
            </div>
          ))}
          <Variant label="Draggable, Footer Off">
            <SmartWideCard style="Draggable" footer={false} />
          </Variant>
        </div>
      </div>

      {/* Header */}
      <div className={groupCard}>
        <span className={`${caption} mb-4 block`}>Header</span>
        <div className="flex flex-col gap-6 max-w-[400px]">
          <Variant label="right-tab = false">
            <div className="bg-white">
              <CardHeader />
            </div>
          </Variant>
          <Variant label="right-tab = true">
            <div className="bg-white">
              <CardHeader rightTab />
            </div>
          </Variant>
        </div>
      </div>

      {/* Footer */}
      <div className={groupCard}>
        <span className={`${caption} mb-4 block`}>Footer</span>
        <div className="flex flex-col gap-6 max-w-[400px]">
          <Variant label="left = true, right = true">
            <StandaloneFooter leftFooter rightFooter />
          </Variant>
          <Variant label="left = false, right = true">
            <StandaloneFooter leftFooter={false} rightFooter />
          </Variant>
          <Variant label="left = true, right = false">
            <StandaloneFooter leftFooter rightFooter={false} />
          </Variant>
        </div>
      </div>

      {/* Content */}
      <div className={groupCard}>
        <span className={`${caption} mb-4 block`}>Content</span>
        <div className="flex flex-wrap gap-8">
          <Variant label="box with line">
            <CardContent type="box with line" />
          </Variant>
          <Variant label="outlined box">
            <CardContent type="outlined box" />
          </Variant>
          <Variant label="two box">
            <CardContent type="two box" />
          </Variant>
        </div>
      </div>

      {/* Swap Instance */}
      <div className={groupCard}>
        <span className={`${caption} mb-4 block`}>Swap Instance</span>
        <div className="flex flex-wrap gap-8">
          <Variant label="type = container">
            <SwapInstance type="container" />
          </Variant>
          <Variant label="type = text">
            <SwapInstance type="text" />
          </Variant>
        </div>
      </div>

      {/* Terms & Policy Card */}
      <div className={groupCard}>
        <span className={`${caption} mb-4 block`}>Terms &amp; Policy Card</span>
        <TermsPolicyCard />
      </div>

      {/* Interactive drag demo (real state) */}
      <div className={groupCard}>
        <span className={`${caption} mb-4 block`}>
          Smart Card — interactive drag toggle
        </span>
        <button
          type="button"
          onClick={() => setDragDemo((v) => !v)}
          className="mb-3 rounded-[2px] bg-[#7c33b5] px-3 py-1.5 text-[14px] text-white"
          style={{ fontFamily: '"DM Sans", Helvetica' }}
        >
          {dragDemo ? "Hide drag handle" : "Show drag handle"}
        </button>
        <div className="w-[440px] max-w-full">
          <SmartCard state="default" showFooter showDragSection={dragDemo} />
        </div>
      </div>
    </section>
  );
}
