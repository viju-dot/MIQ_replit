import { useEffect, useState } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

/* =========================================================================
 * Cards (Figma page node 65:24)
 * Component groups: Smart Card, Smart Wide Card, Header, Footer, Content,
 * Swap Instance, Terms & Policy Card.
 * Each distinct component is exposed as an interactive Playground whose
 * controls map to the real Figma variant axes. All JSX/classes/assets are
 * reused verbatim from the original Figma import — only interaction changed.
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
        className="flex h-full w-[40px] items-center justify-center border-r border-solid border-[var(--border-static-subtle-neutral,#e1e1e8)] rounded-l-[var(--radius-25,2px)] shrink-0"
        style={{
          backgroundColor: hover
            ? "var(--surface-background-hover,rgba(113,113,128,0.08))"
            : disabled
              ? undefined
              : "var(--surface-background-lvl1,#ffffff)",
        }}
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
    <div className="flex h-[24px] items-start rounded-[var(--radius-25,2px)] shrink-0">
      <div
        className={`flex h-[24px] items-center justify-center pl-[var(--spacing-75,6px)] pr-[var(--spacing-75,6px)] py-[2px] rounded-[var(--radius-25,2px)] shrink-0 ${
          disabled ? "bg-[rgba(113,113,128,0.1)]" : "bg-[var(--container-dynamic-brand-bold-background-default,#7c33b5)]"
        }`}
      >
        <p
          className="font-medium leading-[var(--body-md-medium-line-height,20px)] text-[length:var(--body-md-medium-size,14px)] text-center whitespace-nowrap"
          style={{
            fontFamily: '"DM Sans", Helvetica',
            color: disabled
              ? "var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)"
              : "var(--container-dynamic-brand-bold-foreground-default,#ffffff)",
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
    <div className="flex h-[24px] items-start rounded-[var(--radius-25,2px)] shrink-0">
      <div
        className={`flex h-[24px] items-center justify-center pl-[var(--spacing-75,6px)] pr-[var(--spacing-75,6px)] py-[2px] rounded-[var(--radius-25,2px)] border border-solid shrink-0 ${
          disabled ? "border-[var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)]" : "border-[var(--border-dynamic-neutral-bold-default,#4b4b59)]"
        }`}
      >
        <p
          className="font-medium leading-[var(--body-md-medium-line-height,20px)] text-[length:var(--body-md-medium-size,14px)] text-center whitespace-nowrap"
          style={{
            fontFamily: '"DM Sans", Helvetica',
            color: disabled
              ? "var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)"
              : "var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)",
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
        className="font-medium leading-[var(--body-md-medium-line-height,20px)] text-[length:var(--body-md-medium-size,14px)] text-center whitespace-nowrap"
        style={{
          fontFamily: '"DM Sans", Helvetica',
          color: disabled
            ? "var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)"
            : "var(--surface-foreground-dynamic-brand-default,#7c33b5)",
        }}
      >
        Link
      </p>
    </div>
  );
}

function IconButton({ src = STAR, size = 20 }: { src?: string; size?: number }) {
  return (
    <div className="flex items-center p-[2px] rounded-[var(--radius-25,2px)] shrink-0">
      <StarIcon size={size} src={src} />
    </div>
  );
}

/* Card footer used inside Smart Card / Smart Wide Card */
function CardFooter({ disabled = false }: { disabled?: boolean }) {
  return (
    <div className="flex flex-wrap content-end items-end justify-between overflow-hidden border-t border-solid border-[var(--border-static-subtle-neutral,#e1e1e8)] p-[var(--spacing-200,16px)] w-full shrink-0 gap-2">
      <div className="flex gap-[var(--spacing-100,8px)] items-center shrink-0">
        <IconButton src={disabled ? STAR_DISABLED : STAR} />
        <BtnCompactSolid disabled={disabled} />
        <LinkButton disabled={disabled} />
      </div>
      <div className="flex gap-[var(--spacing-100,8px)] items-center justify-end shrink-0">
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
  const titleColor = disabled
    ? "var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)"
    : "var(--surface-foreground-static-neutral-lvl1,#13131a)";
  const starSrc = disabled ? STAR_DISABLED : STAR;
  if (rightTab) {
    return (
      <div className="flex flex-col w-full">
        <div className="flex flex-wrap content-end items-end gap-[var(--spacing-100,8px)] px-[var(--spacing-200,16px)] w-full">
          <div className="flex flex-1 min-w-0 items-center gap-[var(--spacing-100,8px)] py-[var(--spacing-200,16px)]">
            <IconButton src={starSrc} />
            <div className="flex flex-1 min-w-0 items-center gap-[var(--spacing-100,8px)] pr-[var(--spacing-100,8px)]">
              <p
                className="font-medium leading-[var(--headline-xs-medium-line-height,24px)] text-[length:var(--headline-xs-medium-size,16px)] tracking-[-0.08px] whitespace-nowrap"
                style={{ fontFamily: '"DM Sans", Helvetica', color: titleColor }}
              >
                Card Title
              </p>
              <IconButton src={starSrc} />
            </div>
          </div>
          <div className="flex items-end justify-center shrink-0">
            <div className="flex flex-col items-center justify-end gap-[var(--spacing-100,8px)]">
              <div className="flex items-center px-[var(--spacing-200,16px)]">
                <p
                  className="leading-[var(--body-md-medium-line-height,20px)] text-[length:var(--body-md-medium-size,14px)] whitespace-nowrap"
                  style={{ fontFamily: '"DM Sans", Helvetica', color: "var(--surface-foreground-dynamic-brand-default,#7c33b5)" }}
                >
                  Tab
                </p>
              </div>
              <div className="w-full h-0 border-t border-solid border-[var(--border-dynamic-brand-selected,#7c33b5)]" />
            </div>
            <div className="flex flex-col items-center justify-end gap-[var(--spacing-100,8px)]">
              <div className="flex items-center px-[var(--spacing-200,16px)]">
                <p
                  className="leading-[var(--body-md-medium-line-height,20px)] text-[length:var(--body-md-medium-size,14px)] whitespace-nowrap"
                  style={{ fontFamily: '"DM Sans", Helvetica', color: "var(--surface-foreground-static-neutral-lvl1,#13131a)" }}
                >
                  Tab
                </p>
              </div>
              <div className="w-full h-0 border-t border-solid border-[var(--border-static-subtle-neutral,#e1e1e8)]" />
            </div>
          </div>
        </div>
        <div className="w-full h-0 border-t border-solid border-[var(--border-static-subtle-neutral,#e1e1e8)]" />
      </div>
    );
  }
  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center gap-[var(--spacing-100,8px)] p-[var(--spacing-200,16px)] w-full">
        <IconButton src={starSrc} />
        <div className="flex flex-1 min-w-0 items-center gap-[var(--spacing-100,8px)] pr-[var(--spacing-100,8px)]">
          <p
            className="font-medium leading-[var(--headline-xs-medium-line-height,24px)] text-[length:var(--headline-xs-medium-size,16px)] tracking-[-0.08px] whitespace-nowrap"
            style={{ fontFamily: '"DM Sans", Helvetica', color: titleColor }}
          >
            Card Title
          </p>
          <IconButton src={starSrc} />
        </div>
        <IconButton src={starSrc} />
      </div>
      <div className="w-full h-0 border-t border-solid border-[var(--border-static-subtle-neutral,#e1e1e8)]" />
    </div>
  );
}

/* dashed placeholder container ("Swap Instance" container variant) */
function PlaceholderBox({ className = "" }: { className?: string }) {
  return (
    <div
      className={`bg-[rgba(209,148,255,0.2)] border border-dashed border-[var(--colours-blue-300,#d194ff)] w-full ${className}`}
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
  // State-resolution policy:
  //  - A panel-forced state (hover / selected / disabled) stays FORCED.
  //  - Natural pointer hover only derives the Hover elevation when the panel
  //    base is Default.
  //  - Disabled always wins.
  // The card contains its own interactive controls (header/footer buttons,
  // drag handle), so the container itself is NOT a button/role — it only
  // applies the decorative Hover elevation on pointer hover. Selection is a
  // panel-forced preview state (no invalid container-level ARIA / nested
  // interactive controls).
  const [hovered, setHovered] = useState(false);
  useEffect(() => {
    setHovered(false);
  }, [state]);

  const baseDisabled = state === "disabled";
  let effective: SmartCardState = state;
  if (state === "default" && hovered) effective = "hover";

  const isSelected = effective === "selected";
  const isDisabled = effective === "disabled";
  const isHover = effective === "hover";

  const interactiveHandlers =
    baseDisabled || state !== "default"
      ? {}
      : {
          onMouseEnter: () => setHovered(true),
          onMouseLeave: () => setHovered(false),
        };

  const shadow = isHover
    ? "0px 1px 4px 0px var(--shadow-lvl8,rgba(113,113,128,0.08)), 0px 12px 20px 0px var(--shadow-lvl10,rgba(113,113,128,0.1))"
    : isSelected
      ? "0px 1px 4px 0px var(--shadow-lvl8,rgba(113,113,128,0.08)), 0px 16px 24px 0px var(--shadow-lvl12,rgba(113,113,128,0.12))"
      : "0px 1px 4px 0px var(--shadow-lvl8,rgba(113,113,128,0.08)), 0px 8px 16px 0px var(--shadow-lvl4,rgba(113,113,128,0.04))";

  return (
    <div
      {...interactiveHandlers}
      style={{
        boxShadow: shadow,
        cursor: isDisabled ? "not-allowed" : undefined,
        backgroundColor: isDisabled
          ? "rgba(113,113,128,0.1)"
          : "var(--surface-background-lvl1,#ffffff)",
      }}
      className={`flex items-start min-w-[180px] overflow-hidden rounded-[var(--radius-25,2px)] transition-shadow duration-150 ${
        isSelected ? "border border-solid border-[var(--border-dynamic-brand-selected,#7c33b5)]" : ""
      }`}
    >
      {showDragSection && (
        <DragSection disabled={isDisabled} hover={isHover} />
      )}
      <div className="flex flex-col items-start w-[400px]">
        {showHeader && <CardHeader disabled={isDisabled} />}
        <div className="flex flex-col gap-[var(--spacing-100,8px)] items-start p-[var(--spacing-200,16px)] w-full">
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
    <div className="flex items-center gap-[var(--spacing-100,8px)] w-full">
      <p
        className="flex-1 min-w-0 font-medium leading-[var(--headline-xs-medium-line-height,24px)] text-[length:var(--headline-xs-medium-size,16px)] tracking-[-0.08px]"
        style={{ fontFamily: '"DM Sans", Helvetica', color: "var(--surface-foreground-static-neutral-lvl1,#13131a)" }}
      >
        Card Title
      </p>
      {multipleIcons ? (
        <div className="flex items-center gap-[var(--spacing-100,8px)] shrink-0">
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
      className="flex-1 min-w-0 leading-[var(--body-md-medium-line-height,20px)] text-[length:var(--body-md-medium-size,14px)] w-full"
      style={{ fontFamily: '"DM Sans", Helvetica', color: "var(--surface-foreground-static-neutral-lvl1,#13131a)" }}
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
    "drop-shadow(0px 1px 2px var(--shadow-lvl8,rgba(113,113,128,0.08))) drop-shadow(0px 8px 8px var(--shadow-lvl4,rgba(113,113,128,0.04)))";

  /* Simple / Simple Filled / Draggable: placeholder only */
  if (style === "Simple" || style === "Simple Filled" || style === "Draggable") {
    return (
      <div
        className="flex items-start bg-[var(--surface-background-lvl1,#ffffff)] rounded-[var(--radius-25,2px)] w-full p-[var(--spacing-200,16px)] gap-[var(--spacing-200,16px)]"
        style={{ filter: cardShadow }}
      >
        {style === "Draggable" && (
          <span className="flex items-center justify-center shrink-0 w-[24px] h-[24px] overflow-hidden">
            <img alt="" className="block max-w-none w-full h-full" src={DRAG} />
          </span>
        )}
        <div className="flex flex-col gap-[var(--spacing-200,16px)] flex-1 min-w-0">
          <PlaceholderBox className="h-[80px]" />
          {footer && (
            <div className="flex items-center justify-end gap-[var(--spacing-100,8px)]">
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
        className="flex flex-col gap-[var(--spacing-200,16px)] bg-[var(--surface-background-lvl1,#ffffff)] rounded-[var(--radius-25,2px)] w-full py-[var(--spacing-200,16px)]"
        style={{ filter: cardShadow }}
      >
        <div className="px-[var(--spacing-200,16px)]">
          <WideTitleRow />
        </div>
        <div className="w-full h-0 border-t border-solid border-[var(--border-static-subtle-neutral,#e1e1e8)]" />
        <div className="px-[var(--spacing-200,16px)]">
          <PlaceholderBox className="h-[60px]" />
        </div>
        {footer && (
          <div className="flex items-center justify-end gap-[var(--spacing-100,8px)] px-[var(--spacing-200,16px)]">
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
        className="flex flex-col gap-[var(--spacing-200,16px)] bg-[var(--surface-background-lvl1,#ffffff)] rounded-[var(--radius-25,2px)] w-full py-[var(--spacing-200,16px)]"
        style={{ filter: cardShadow }}
      >
        <div className="flex items-start justify-between px-[var(--spacing-200,16px)]">
          <div className="flex items-center gap-[var(--spacing-100,8px)]">
            <StarIcon size={24} src={STAR_24} />
            <p
              className="font-medium leading-[19px] text-[length:var(--headline-xs-medium-size,16px)] tracking-[-0.32px]"
              style={{ fontFamily: '"DM Sans", Helvetica', color: "var(--surface-foreground-static-neutral-lvl1,#13131a)" }}
            >
              Card Title
            </p>
          </div>
          <div className="flex items-center gap-[var(--spacing-100,8px)] shrink-0">
            <StarIcon size={24} src={STAR_24} />
            <StarIcon size={24} src={STAR_24} />
            <StarIcon size={24} src={STAR_24} />
          </div>
        </div>
        <div className="w-full h-0 border-t border-solid border-[var(--border-static-subtle-neutral,#e1e1e8)]" />
        {footer && (
          <>
            <div className="px-[var(--spacing-200,16px)]">
              <WideDescription />
            </div>
            <div className="px-[var(--spacing-200,16px)]">
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
        className="flex flex-col gap-[var(--spacing-200,16px)] bg-[var(--surface-background-lvl1,#ffffff)] rounded-[var(--radius-25,2px)] w-full p-[var(--spacing-200,16px)]"
        style={{ filter: cardShadow }}
      >
        <div className="flex items-start justify-between">
          {footer && (
            <StarIcon size={24} src={STAR_24} />
          )}
          <div className="flex flex-1 min-w-0 items-start justify-end gap-[var(--spacing-100,8px)]">
            <p
              className="flex-1 min-w-0 font-medium leading-[19px] text-[length:var(--headline-xs-medium-size,16px)] tracking-[-0.32px] pl-[var(--spacing-100,8px)] pr-[10px] pt-[3px] pb-[2px]"
              style={{ fontFamily: '"DM Sans", Helvetica', color: "var(--surface-foreground-static-neutral-lvl1,#13131a)" }}
            >
              Card Title
            </p>
            <div className="flex items-center gap-[var(--spacing-100,8px)] shrink-0">
              <StarIcon size={24} src={STAR_24} />
              <StarIcon size={24} src={STAR_24} />
              <StarIcon size={24} src={STAR_24} />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-[var(--spacing-100,8px)] items-start p-[var(--spacing-200,16px)] border border-solid border-[var(--border-static-subtle-neutral,#e1e1e8)] w-full">
          <WideDescription />
        </div>
        {footer && <CardFooter />}
      </div>
    );
  }

  /* Box: title row, bordered box, optional footer */
  return (
    <div
      className="flex flex-col items-start bg-[var(--surface-background-lvl1,#ffffff)] rounded-[var(--radius-25,2px)] w-full p-[var(--spacing-200,16px)] gap-[var(--spacing-200,16px)]"
      style={{ filter: cardShadow }}
    >
      <WideTitleRow />
      <PlaceholderBox className="flex-1 min-h-[80px] border-solid border-[var(--border-static-subtle-neutral,#e1e1e8)]" />
      {footer && (
        <div className="flex items-center justify-end gap-[var(--spacing-100,8px)] w-full">
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
        <div className="flex gap-[var(--spacing-100,8px)] items-center shrink-0">
          <IconButton src={STAR} />
          <BtnCompactSolid />
          <LinkButton />
        </div>
      )}
      {rightFooter && (
        <div className="flex gap-[var(--spacing-100,8px)] items-center justify-end shrink-0">
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
      <div className="flex flex-col gap-[var(--spacing-100,8px)] items-start bg-[var(--surface-background-lvl1,#ffffff)] p-[var(--spacing-200,16px)] w-[368px] h-[225px]">
        <PlaceholderBox className="flex-1 min-h-0" />
      </div>
    );
  }
  if (type === "outlined box") {
    return (
      <div className="flex flex-col items-center pb-[var(--spacing-200,16px)] px-[var(--spacing-200,16px)] bg-[var(--surface-background-lvl1,#ffffff)] w-[368px]">
        <div className="flex flex-col items-start p-[var(--spacing-200,16px)] h-[209px] border border-solid border-[var(--border-static-subtle-neutral,#e1e1e8)] w-full">
          <PlaceholderBox className="flex-1 min-h-0" />
        </div>
      </div>
    );
  }
  /* two box */
  return (
    <div className="flex flex-col items-start p-[var(--spacing-200,16px)] bg-[var(--surface-background-lvl1,#ffffff)] w-[368px] h-[169px]">
      <div className="flex flex-1 flex-col items-start p-[var(--spacing-200,16px)] border border-solid border-[var(--border-static-subtle-neutral,#e1e1e8)] w-full min-h-0 -mb-px">
        <PlaceholderBox className="flex-1 min-h-0" />
      </div>
      <div className="flex flex-1 flex-col items-start p-[var(--spacing-200,16px)] border border-solid border-[var(--border-static-subtle-neutral,#e1e1e8)] w-full min-h-0">
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
          className="flex-1 min-w-0 leading-[var(--body-md-medium-line-height,20px)] text-[length:var(--body-md-medium-size,14px)]"
          style={{ fontFamily: '"DM Sans", Helvetica', color: "var(--surface-foreground-static-neutral-lvl1,#13131a)" }}
        >
          Text
        </p>
      </div>
    );
  }
  return (
    <div className="bg-[rgba(209,148,255,0.2)] border border-dashed border-[var(--colours-blue-300,#d194ff)] w-[200px] h-[168px]" />
  );
}

/* ---------- Terms & Policy Card ---------- */

function TermsPolicyCard() {
  return (
    <div className="relative flex flex-col items-start rounded-[var(--radius-25,2px)] w-full max-w-[588px] min-h-[248px]">
      <div className="flex gap-[10px] items-start pb-[var(--spacing-200,16px)] pt-[72px] px-[var(--spacing-200,16px)] w-full">
        <div className="absolute left-0 top-0 flex flex-col items-start w-full">
          <div
            className="flex flex-col gap-[var(--spacing-200,16px)] items-start px-0 py-[var(--spacing-200,16px)] bg-[var(--surface-background-lvl1,#ffffff)] rounded-[var(--radius-25,2px)] w-full"
            style={{
              filter:
                "drop-shadow(0px 1px 2px var(--shadow-lvl8,rgba(113,113,128,0.08))) drop-shadow(0px 8px 8px var(--shadow-lvl4,rgba(113,113,128,0.04)))",
            }}
          >
            <div className="flex flex-wrap content-start gap-[var(--spacing-100,8px)] items-start px-[var(--spacing-200,16px)] w-full">
              <div className="flex flex-1 min-w-0 items-center pr-[10px]">
                <p
                  className="flex-1 min-w-0 font-medium leading-[var(--headline-xs-medium-line-height,24px)] text-[length:var(--headline-xs-medium-size,16px)] tracking-[-0.08px]"
                  style={{ fontFamily: '"DM Sans", Helvetica', color: "var(--surface-foreground-static-neutral-lvl1,#13131a)" }}
                >
                  Privacy Statement
                </p>
              </div>
            </div>
            <div className="w-full h-0 border-t border-solid border-[var(--border-static-subtle-neutral,#e1e1e8)]" />
          </div>
        </div>
        <p
          className="flex-1 min-w-0 leading-[var(--body-md-medium-line-height,20px)] text-[length:var(--body-md-medium-size,14px)]"
          style={{ fontFamily: '"DM Sans", Helvetica', color: "var(--surface-foreground-static-neutral-lvl1,#13131a)" }}
        >
          {`MiQ Digital Limited (“MiQ” or “we” or “us” or “our”) is committed to protecting the personal data of individuals whose personal data we process. This Statement is incorporated by reference into our MiQ Privacy Policy which is located at https://www.wearemiq.com/privacy-and-compliance/privacy-policy/ (“Privacy Policy”) MiQ is committed to working with you to obtain a fair and rapid resolution of any queries, complaints, or disputes about privacy. If you should have any questions about this Policy, our Privacy Policy or our information collection, retention, use and sharing practices, please contact us at privacy@miqdigital.com.`}
        </p>
      </div>
    </div>
  );
}

/* =========================================================================
 * Playground configs — one per distinct component.
 * ========================================================================= */

const smartCardConfig: PlaygroundConfig = {
  name: "Smart Card",
  scopeId: "cards/smart-card",
  description: "Container card with header, content and footer slots.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Default", "Selected", "Disabled", "Hover"],
      defaultValue: "Default",
      asTabs: true,
    },
    { kind: "boolean", name: "showHeader", label: "Header", defaultValue: true },
    { kind: "boolean", name: "showFooter", label: "Footer", defaultValue: true },
    {
      kind: "boolean",
      name: "showDragSection",
      label: "Drag handle",
      defaultValue: false,
    },
  ],
  render: (props) => {
    const map: Record<string, SmartCardState> = {
      Default: "default",
      Selected: "selected",
      Disabled: "disabled",
      Hover: "hover",
    };
    return (
      <div className="w-[440px] max-w-full">
        <SmartCard
          state={map[String(props.state)] ?? "default"}
          showHeader={props.showHeader === true}
          showFooter={props.showFooter === true}
          showDragSection={props.showDragSection === true}
        />
      </div>
    );
  },
  tokens: {
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "border/dynamic/brand/selected": "var(--border-dynamic-brand-selected)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "radius/25": "var(--radius-25)",
    "Elevation Hover": "var(--elevation-hover)",
    "Elevation Selected": "var(--elevation-selected)",
    "Elevation Regular": "var(--elevation-regular)",
  },
};

const smartWideCardConfig: PlaygroundConfig = {
  name: "Smart Wide Card",
  scopeId: "cards/smart-wide-card",
  description: "Full-width card with multiple layout styles.",
  controls: [
    {
      kind: "select",
      name: "style",
      label: "Style",
      options: [
        "Simple",
        "Simple Filled",
        "Line",
        "Line Filled",
        "Box Filled",
        "Box",
        "Draggable",
      ],
      defaultValue: "Simple",
      asTabs: true,
    },
    { kind: "boolean", name: "footer", label: "Footer", defaultValue: true },
  ],
  render: (props) => (
    <div className="w-full max-w-[600px]">
      <SmartWideCard
        style={String(props.style) as WideStyle}
        footer={props.footer === true}
      />
    </div>
  ),
  tokens: {
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "radius/25": "var(--radius-25)",
    "spacing/200": "var(--spacing-200)",
    "spacing/100": "var(--spacing-100)",
    "shadow/lvl8": "var(--shadow-lvl8)",
    "shadow/lvl4": "var(--shadow-lvl4)",
  },
};

const headerConfig: PlaygroundConfig = {
  name: "Header",
  scopeId: "cards/header",
  description: "Card header — with optional right-aligned tabs.",
  controls: [
    { kind: "boolean", name: "rightTab", label: "Right tabs", defaultValue: false },
    { kind: "boolean", name: "disabled", label: "Disabled", defaultValue: false },
  ],
  render: (props) => (
    <div className="w-[400px] max-w-full bg-[var(--surface-background-lvl1,#ffffff)]">
      <CardHeader
        rightTab={props.rightTab === true}
        disabled={props.disabled === true}
      />
    </div>
  ),
  tokens: {
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "surface/foreground/dynamic/neutral/disabled": "var(--surface-foreground-dynamic-neutral-disabled)",
    "surface/foreground/dynamic/brand/default": "var(--surface-foreground-dynamic-brand-default)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "border/dynamic/brand/selected": "var(--border-dynamic-brand-selected)",
    "spacing/200": "var(--spacing-200)",
    "spacing/100": "var(--spacing-100)",
  },
};

const footerConfig: PlaygroundConfig = {
  name: "Footer",
  scopeId: "cards/footer",
  description: "Card footer — left and right action groups toggle independently.",
  controls: [
    { kind: "boolean", name: "leftFooter", label: "Left group", defaultValue: true },
    { kind: "boolean", name: "rightFooter", label: "Right group", defaultValue: true },
  ],
  render: (props) => (
    <StandaloneFooter
      leftFooter={props.leftFooter === true}
      rightFooter={props.rightFooter === true}
    />
  ),
  tokens: {
    "container/dynamic/brand/bold/background/default": "var(--container-dynamic-brand-bold-background-default)",
    "container/dynamic/brand/bold/foreground/default": "var(--container-dynamic-brand-bold-foreground-default)",
    "border/dynamic/neutral/bold/default": "var(--border-dynamic-neutral-bold-default)",
    "surface/foreground/dynamic/brand/default": "var(--surface-foreground-dynamic-brand-default)",
    "surface/foreground/dynamic/neutral/default/regular": "var(--surface-foreground-dynamic-neutral-default-regular)",
    "surface/foreground/dynamic/neutral/disabled": "var(--surface-foreground-dynamic-neutral-disabled)",
    "spacing/100": "var(--spacing-100)",
  },
};

const contentConfig: PlaygroundConfig = {
  name: "Content",
  scopeId: "cards/content",
  description: "Card content area — three layout types.",
  controls: [
    {
      kind: "select",
      name: "type",
      label: "Type",
      options: ["box with line", "outlined box", "two box"],
      defaultValue: "box with line",
      asTabs: true,
    },
  ],
  render: (props) => (
    <CardContent
      type={String(props.type) as "box with line" | "outlined box" | "two box"}
    />
  ),
  tokens: {
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "Colours/Blue/300": "var(--colours-blue-300)",
    "spacing/200": "var(--spacing-200)",
    "spacing/100": "var(--spacing-100)",
  },
};

const swapInstanceConfig: PlaygroundConfig = {
  name: "Swap Instance",
  scopeId: "cards/swap-instance",
  description: "Swappable content slot — dashed container or text.",
  controls: [
    {
      kind: "select",
      name: "type",
      label: "Type",
      options: ["container", "text"],
      defaultValue: "container",
      asTabs: true,
    },
  ],
  render: (props) => (
    <SwapInstance type={String(props.type) as "container" | "text"} />
  ),
  tokens: {
    "Colours/Blue/300": "var(--colours-blue-300)",
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "Body Md/Medium": "var(--body-md-medium-size)",
  },
};

const termsPolicyConfig: PlaygroundConfig = {
  name: "Terms & Policy Card",
  scopeId: "cards/terms-and-policy-card",
  description: "Long-form policy content card with a titled header band.",
  controls: [],
  render: () => (
    <div className="w-full max-w-[588px]">
      <TermsPolicyCard />
    </div>
  ),
  tokens: {
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "radius/25": "var(--radius-25)",
    "shadow/lvl8": "var(--shadow-lvl8)",
    "shadow/lvl4": "var(--shadow-lvl4)",
  },
};

/* ========================================================================= */

export default function CardsPage(): JSX.Element {
  return (
    <section className="flex flex-col gap-6" aria-label="Cards">
      <Playground config={smartCardConfig} />
      <Playground config={smartWideCardConfig} />
      <Playground config={headerConfig} />
      <Playground config={footerConfig} />
      <Playground config={contentConfig} />
      <Playground config={swapInstanceConfig} />
      <Playground config={termsPolicyConfig} />
    </section>
  );
}
