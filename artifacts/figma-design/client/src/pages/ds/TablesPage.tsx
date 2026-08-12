import { useEffect, useState } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

/**
 * Tables — Design System playground.
 *
 * Primary: the full "Table Layout" master component composed exactly as in Figma:
 *   Table Layout = Table header (title bar) + Table Conteiner
 *     [ Filters row, optional Alert, Table Master (Column Header + Cell rows),
 *       Footer container with Pagination ].
 *
 * Secondary: the atomic table building-blocks preserved from the original page:
 *   - Cell Body Content (Strong / Number)
 *   - Cell/Text (State, Checkbox, Children/Expand, Logo, Icon-right, Indent, Label)
 *   - Column Header (Checkbox, Label)
 *   - Cell/Action (Icon amount, State)
 *
 * All Figma component / variant / property NAMES are preserved so Developer Mode
 * surfaces the real Figma names.
 */

const ASSET = "/figmaAssets/tables";
const imgCaretCollapsed = `${ASSET}/caret-collapsed.svg`;
const imgCaretExpanded = `${ASSET}/caret-expanded.svg`;
const imgCaretCollapsedSel = `${ASSET}/caret-collapsed-sel.svg`;
const imgCaretExpandedSel = `${ASSET}/caret-expanded-sel.svg`;
const imgCheck = `${ASSET}/check.svg`;
const imgArrowSquareOut = `${ASSET}/arrow-square-out.svg`;
const imgTtdInner = `${ASSET}/ttd-inner.svg`;
const imgTtdOuter = `${ASSET}/ttd-outer.svg`;
const imgActionEye = `${ASSET}/action-eye.svg`;
const imgActionEdit = `${ASSET}/action-edit.svg`;
const imgActionDots = `${ASSET}/action-dots.svg`;
const imgPagCaretLeft = `/figmaAssets/pagination/caret-left.svg`;
const imgPagCaretRight = `/figmaAssets/pagination/caret-right.svg`;

/* ------------------------------------------------------------------ */
/* Shared atoms (unchanged Figma markup)                               */
/* ------------------------------------------------------------------ */

function TtdLogo() {
  return (
    <div className="flex items-center overflow-clip pr-[16px] relative shrink-0">
      <div className="relative shrink-0 size-[24px]">
        <div className="absolute inset-[15.63%_18.75%]">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgTtdInner} />
        </div>
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgTtdOuter} />
      </div>
    </div>
  );
}

function CheckboxUnchecked() {
  return (
    <div className="flex items-center justify-center overflow-clip p-[2px] relative rounded-[var(--radius-25,2px)] shrink-0">
      <div className="flex items-center overflow-clip p-[2px] relative shrink-0">
        <div className="border-[1.5px] border-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)] border-solid overflow-clip relative rounded-[var(--radius-25,2px)] shrink-0 size-[16px]" />
      </div>
    </div>
  );
}

function CheckboxChecked() {
  return (
    <div className="flex items-center justify-center overflow-clip p-[2px] relative rounded-[var(--radius-25,2px)] shrink-0">
      <div className="flex items-center overflow-clip p-[2px] relative shrink-0">
        <div className="bg-[var(--container-dynamic-brand-bold-background-default,#7c33b5)] overflow-clip relative rounded-[var(--radius-25,2px)] shrink-0 size-[16px]">
          <div className="absolute flex flex-col items-center justify-center left-0 overflow-clip px-px py-[3px] size-[16px] top-0">
            <div className="h-[9.001px] relative shrink-0 w-[12.501px]">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCheck} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function CaretIcon({ src }: { src: string }) {
  return (
    <div className="flex items-center p-[2px] relative rounded-[var(--radius-25,2px)] shrink-0">
      <div className="flex items-center justify-center relative shrink-0 size-[20px]">
        <div className="relative shrink-0 size-[20px]">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={src} />
        </div>
      </div>
    </div>
  );
}

function ArrowSquareOut() {
  return (
    <div className="flex items-center overflow-clip pl-[16px] relative shrink-0">
      <div className="flex items-center justify-center overflow-clip p-[3px] relative shrink-0 size-[20px]">
        <div className="relative shrink-0 size-[15px]">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgArrowSquareOut} />
        </div>
      </div>
    </div>
  );
}

/* Inline icons used by the Table header / Alert (no static asset needed). */

function IconSlidersHorizontal() {
  return (
    <svg
      className="size-[24px] shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--container-dynamic-neutral-subtle-foreground-default-regular, #4b4b59)"
      strokeWidth="1.5"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <line x1="3" y1="8" x2="21" y2="8" />
      <line x1="3" y1="16" x2="21" y2="16" />
      <circle cx="9" cy="8" r="2.2" fill="var(--surface-background-lvl1, #ffffff)" />
      <circle cx="15" cy="16" r="2.2" fill="var(--surface-background-lvl1, #ffffff)" />
    </svg>
  );
}

function IconCaretDown({ stroke = "white" }: { stroke?: string }) {
  return (
    <svg
      className="size-[20px] shrink-0"
      viewBox="0 0 20 20"
      fill="none"
      stroke={stroke}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 8l5 5 5-5" />
    </svg>
  );
}

function IconInfo() {
  return (
    <svg
      className="size-[20px] shrink-0"
      viewBox="0 0 20 20"
      fill="none"
      stroke="var(--border-static-bold-info, #2360db)"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="10" cy="10" r="7.5" />
      <line x1="10" y1="9" x2="10" y2="14" />
      <circle cx="10" cy="6.5" r="0.6" fill="var(--border-static-bold-info, #2360db)" stroke="none" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Cell Body Content (3108:8213)                                       */
/* ------------------------------------------------------------------ */

function CellBodyContent({
  strong = false,
  number = false,
  text = "Cell content",
}: {
  strong?: boolean;
  number?: boolean;
  text?: string;
}) {
  const numberStyle = number
    ? ({ fontFeatureSettings: '"lnum" 1, "tnum" 1' } as React.CSSProperties)
    : undefined;
  return (
    <div className="flex items-start relative w-[160px]">
      <p
        className={`[word-break:break-word] leading-[var(--body-sm-regular-line-height,18px)] not-italic relative text-[length:var(--body-sm-regular-size,12px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] ${
          number
            ? `flex-1 min-w-px text-right ${strong ? "font-medium" : "font-normal"}`
            : `shrink-0 whitespace-nowrap ${strong ? "font-medium" : "font-normal"}`
        }`}
        style={numberStyle}
      >
        {number ? "123" : text}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cell/Text (3218:9322 + 47446:* instances)                          */
/* ------------------------------------------------------------------ */

type CellTextState = "Default" | "Hover" | "Selected";

function CellText({
  state = "Default",
  hasCheck = false,
  checked = false,
  hasChildren = false,
  isExpanded = false,
  hasLogo = false,
  hasIconRight = false,
  indent = 0,
  text = "Cell content",
}: {
  state?: CellTextState;
  hasCheck?: boolean;
  checked?: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
  hasLogo?: boolean;
  hasIconRight?: boolean;
  indent?: 0 | 1 | 2;
  text?: string;
}) {
  const bgColor =
    state === "Selected"
      ? "var(--container-dynamic-brand-subtle-background-selected,#f6ebff)"
      : state === "Hover"
        ? "var(--container-dynamic-neutral-subtle-background-hover,rgba(113,113,128,0.08))"
        : "var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)";
  const pl = indent === 2 ? "pl-[72px]" : indent === 1 ? "pl-[40px]" : "pl-[var(--spacing-150,12px)]";
  const textCls =
    state === "Selected"
      ? "font-medium text-[var(--surface-foreground-dynamic-brand-default,#7c33b5)]"
      : "font-normal text-[var(--container-dynamic-neutral-subtle-foreground-default-variation,#13131a)]";

  const caretSrc =
    state === "Selected"
      ? isExpanded
        ? imgCaretExpandedSel
        : imgCaretCollapsedSel
      : isExpanded
        ? imgCaretExpanded
        : imgCaretCollapsed;

  return (
    <div
      style={{ backgroundColor: bgColor }}
      className={`${pl} border-[var(--border-static-subtle-neutral,#e1e1e8)] border-b border-solid flex gap-[var(--spacing-50,4px)] h-[40px] items-center pr-[var(--spacing-200,16px)] relative w-[192px]`}
    >
      {hasLogo && <TtdLogo />}
      {hasChildren && (
        <div className="flex gap-[var(--spacing-50,4px)] items-center relative shrink-0">
          {hasCheck &&
            (checked || state === "Selected" ? <CheckboxChecked /> : <CheckboxUnchecked />)}
          <div className="flex items-center relative shrink-0">
            <CaretIcon src={caretSrc} />
          </div>
        </div>
      )}
      {!hasChildren && hasCheck && (
        <div className="flex items-center overflow-clip relative shrink-0">
          {checked || state === "Selected" ? <CheckboxChecked /> : <CheckboxUnchecked />}
        </div>
      )}
      <div className="flex flex-1 items-start min-w-px relative">
        <p
          className={`[word-break:break-word] flex-1 leading-[var(--body-sm-regular-line-height,18px)] min-w-px not-italic overflow-hidden relative text-[length:var(--body-sm-regular-size,12px)] text-ellipsis whitespace-nowrap ${textCls}`}
        >
          {text}
        </p>
      </div>
      {hasIconRight && <ArrowSquareOut />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Column Header cell (extracted from Table/Column reference)          */
/* ------------------------------------------------------------------ */

function ColumnHeader({
  hasCheckbox = false,
  text = "Column Header",
}: {
  hasCheckbox?: boolean;
  text?: string;
}) {
  return (
    <div className="bg-[var(--surface-background-lvl2,#f7f7fa)] border-[var(--border-static-subtle-neutral,#e1e1e8)] border-b border-solid flex h-[40px] items-center py-[10px] relative w-[192px]">
      <div className="flex h-[20px] items-center relative shrink-0 w-[12px]" />
      {hasCheckbox && (
        <div className="flex items-center overflow-clip pr-[var(--spacing-50,4px)] relative shrink-0">
          <CheckboxUnchecked />
        </div>
      )}
      <div className="flex flex-1 items-start min-w-px relative">
        <p className="[word-break:break-word] flex-1 font-medium leading-[var(--body-md-medium-line-height,20px)] min-w-px not-italic overflow-hidden relative text-[length:var(--body-md-medium-size,14px)] text-[var(--surface-foreground-static-neutral-lvl2,#282833)] text-ellipsis whitespace-nowrap">
          {text}
        </p>
      </div>
      <div className="flex h-[20px] items-center justify-end relative shrink-0 w-[16px]">
        <div className="h-[20px] relative shrink-0 w-px">
          <div className="absolute border border-[var(--border-static-subtle-neutral,#e1e1e8)] border-solid inset-0" />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Cell/Action (14322:28537)                                           */
/* ------------------------------------------------------------------ */

type ActionState = "Default" | "Hover" | "Selected";

function ActionButton({ src }: { src: string }) {
  return (
    <div className="flex items-center justify-center p-[7px] relative rounded-[var(--radius-25,2px)] shrink-0">
      <div className="flex items-center justify-center p-[2px] relative shrink-0 size-[20px]">
        <div className="relative shrink-0 size-[15.625px]">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={src} />
        </div>
      </div>
    </div>
  );
}

function CellAction({
  iconAmount = 1,
  state = "Default",
}: {
  iconAmount?: 1 | 2 | 3;
  state?: ActionState;
}) {
  const bgColor =
    state === "Selected"
      ? "var(--container-dynamic-brand-subtle-background-selected,#f6ebff)"
      : state === "Hover"
        ? "var(--container-dynamic-neutral-subtle-background-hover,rgba(113,113,128,0.08))"
        : "var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)";

  // Icon set per amount (dots menu shown for 3-icon, extra icons revealed on hover/selected)
  const icons: string[] =
    iconAmount === 1
      ? [imgActionEdit]
      : iconAmount === 2
        ? [imgActionEye, imgActionEdit]
        : [imgActionDots, imgActionEye, imgActionEdit];

  return (
    <div
      style={{ backgroundColor: bgColor }}
      className="border-[var(--border-static-subtle-neutral,#e1e1e8)] border-b border-solid flex h-[44px] items-center justify-end px-[8px] py-[5px] relative w-[118px]"
    >
      {iconAmount === 1 ? (
        <div className="flex items-center justify-center p-[7px] relative rounded-[var(--radius-25,2px)] shrink-0">
          <div className="flex items-center justify-center p-[2px] relative shrink-0 size-[20px]">
            <div className="h-[16.25px] relative shrink-0 w-[15px]">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgActionEdit} />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-end relative shrink-0">
          {icons.map((src, i) => (
            <ActionButton key={i} src={src} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ================================================================== */
/* Table Layout — full composed master component                       */
/* ================================================================== */

/* --- Table header (28603:24898 / 28587:17190) --- */

function TableHeaderBar({ title = "Overview" }: { title?: string }) {
  return (
    <div
      className="flex items-center justify-between relative shrink-0 w-full"
      data-name="Table header"
    >
      <p className="[word-break:break-word] font-semibold leading-[32px] not-italic relative shrink-0 text-[24px] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] tracking-[-0.36px] whitespace-nowrap">
        {title}
      </p>
      <div className="flex gap-[24px] items-center justify-end relative shrink-0" data-name="Right">
        <div className="flex gap-[16px] items-center justify-end relative shrink-0" data-name="Actions">
          {/* Secondary Button — Geo filters */}
          <div className="flex items-center justify-end relative shrink-0" data-name="Button">
            <div className="border-[1px] border-[var(--border-dynamic-neutral-bold-default,#4b4b59)] border-solid flex gap-[4px] h-[34px] items-center justify-center pl-[8px] pr-[12px] py-[8px] relative rounded-[var(--radius-25,2px)] shrink-0">
              <IconSlidersHorizontal />
              <p className="[word-break:break-word] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)] text-center whitespace-nowrap">
                Geo filters
              </p>
            </div>
          </div>
          {/* Primary Button Dropdown — Export */}
          <div className="flex items-center justify-end relative rounded-[var(--radius-25,2px)] shrink-0" data-name="Button Dropdown">
            <div className="bg-[var(--container-dynamic-brand-bold-background-default,#7c33b5)] flex gap-[2px] h-[34px] items-center justify-center pl-[12px] pr-[4px] py-[7px] relative rounded-[var(--radius-25,2px)] shrink-0">
              <p className="[word-break:break-word] font-medium leading-[20px] not-italic relative shrink-0 text-[14px] text-[var(--container-dynamic-brand-bold-foreground-default,#ffffff)] whitespace-nowrap">
                Export
              </p>
              <IconCaretDown stroke="var(--container-dynamic-brand-bold-foreground-default, #ffffff)" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Filters (28603:21770) --- */

function FiltersRow() {
  return (
    <div className="flex items-center overflow-clip relative shrink-0 w-full" data-name="Filters">
      <div className="flex flex-1 gap-[16px] items-center min-w-px p-[16px] relative" data-name="Container">
        {/* Input/Standard — Filter keywords */}
        <div className="bg-[var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)] border-[1px] border-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)] border-solid flex flex-1 flex-col items-start min-w-px relative rounded-[var(--radius-25,2px)]">
          <div className="flex gap-[8px] items-center px-[12px] relative rounded-[var(--radius-25,2px)] shrink-0 w-full">
            <div className="flex flex-1 gap-[8px] h-[34px] items-start min-w-px py-[8px] relative">
              <div className="[word-break:break-word] flex flex-1 flex-col font-normal h-full justify-center leading-[0] min-w-px not-italic overflow-hidden relative text-[14px] text-[var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)] text-ellipsis whitespace-nowrap">
                <p className="leading-[20px] overflow-hidden text-ellipsis">Filter keywords...</p>
              </div>
            </div>
          </div>
        </div>
        {/* Right Side */}
        <div className="flex gap-[16px] items-center relative shrink-0" data-name="Right Side">
          {/* Dropdown Closed */}
          <div className="bg-[var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)] border-[1px] border-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)] border-solid flex flex-col items-start justify-center relative rounded-[var(--radius-25,2px)] shrink-0 w-[274px]" data-name="Dropdown Closed">
            <div className="flex gap-[8px] items-center justify-end pl-[12px] pr-[6px] relative shrink-0 w-full">
              <div className="flex flex-1 items-start min-w-px py-[7px] relative">
                <div className="[word-break:break-word] flex flex-1 flex-col font-normal justify-center leading-[0] min-w-px not-italic overflow-hidden relative text-[14px] text-[var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)] text-ellipsis whitespace-nowrap">
                  <p className="leading-[20px] overflow-hidden text-ellipsis">Default / Hover</p>
                </div>
              </div>
              <IconCaretDown stroke="var(--container-dynamic-neutral-subtle-foreground-default-regular, #4b4b59)" />
            </div>
          </div>
          {/* Button Group — Domain / Category */}
          <div className="flex items-start relative shrink-0" data-name="Button Group">
            <div className="bg-[var(--container-dynamic-neutral-subtle-background-default-variation,#ebebf0)] border-[1px] border-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)] border-solid flex gap-[10px] h-[34px] items-center mr-[-1px] px-[24px] py-[7px] relative rounded-bl-[var(--radius-25,2px)] rounded-tl-[var(--radius-25,2px)] shrink-0">
              <p className="[word-break:break-word] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-[var(--container-dynamic-neutral-subtle-foreground-selected,#13131a)] text-center whitespace-nowrap">
                Domain
              </p>
            </div>
            <div className="bg-[var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)] border-[1px] border-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)] border-solid flex gap-[10px] h-[34px] items-center px-[24px] py-[7.5px] relative rounded-br-[var(--radius-25,2px)] rounded-tr-[var(--radius-25,2px)] shrink-0">
              <p className="[word-break:break-word] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-[var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)] text-center whitespace-nowrap">
                Category
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* --- Alert (28753:48062) --- */

function TableAlert() {
  return (
    <div
      className="bg-[var(--surface-background-lvl1,#ffffff)] border-[1px] border-[var(--border-static-bold-info,#2360db)] border-solid flex gap-[8px] items-start px-[12px] py-[7px] relative rounded-[var(--radius-25,2px)] shrink-0 w-full"
      data-name="Alert"
    >
      <IconInfo />
      <div className="flex flex-1 flex-col items-start min-w-px relative" data-name="Content">
        <p className="[word-break:break-word] font-medium leading-[0] not-italic relative shrink-0 text-[0px] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] w-full">
          <span className="leading-[20px] text-[14px]">{`Pixels selected as dimension - Go to `}</span>
          <span className="leading-[20px] text-[var(--surface-foreground-dynamic-brand-default,#7c33b5)] text-[14px]">
            client reporting
          </span>
        </p>
      </div>
    </div>
  );
}

/* --- Table Master column-header cell (inline, tuned to master widths) --- */

function MasterColumnHeader({
  text,
  hasCheckbox = false,
  numeric = false,
}: {
  text: string;
  hasCheckbox?: boolean;
  numeric?: boolean;
}) {
  return (
    <div
      className="bg-[var(--surface-background-lvl2,#f7f7fa)] border-[var(--border-static-subtle-neutral,#e1e1e8)] border-b border-solid flex h-[40px] items-center py-[10px] relative shrink-0 w-full"
      data-name="Column Header"
    >
      <div className="flex h-[20px] items-center relative shrink-0 w-[12px]" />
      {hasCheckbox && (
        <div className="flex items-center overflow-clip pr-[var(--spacing-50,4px)] relative shrink-0">
          <CheckboxUnchecked />
        </div>
      )}
      <div className="flex flex-1 items-start min-w-px relative">
        <p
          className={`[word-break:break-word] flex-1 font-medium leading-[var(--body-md-medium-line-height,20px)] min-w-px not-italic overflow-hidden relative text-[length:var(--body-md-medium-size,14px)] text-[var(--surface-foreground-static-neutral-lvl2,#282833)] text-ellipsis whitespace-nowrap ${
            numeric ? "text-right" : ""
          }`}
        >
          {text}
        </p>
      </div>
      <div className="flex h-[20px] items-center justify-end relative shrink-0 w-[16px]">
        <div className="h-[20px] relative shrink-0 w-px">
          <div className="absolute border border-[var(--border-static-subtle-neutral,#e1e1e8)] border-solid inset-0" />
        </div>
      </div>
    </div>
  );
}

/* --- Table Master data cell (Cell/Text with Cell Body Content) --- */

type RowState = "Default" | "Hover" | "Selected";

function MasterCell({
  text,
  rowState = "Default",
  hasCheckbox = false,
  checked = false,
  numeric = false,
}: {
  text: string;
  rowState?: RowState;
  hasCheckbox?: boolean;
  checked?: boolean;
  numeric?: boolean;
}) {
  // Inline background (Tailwind v3 arbitrary bg-[var(--x,rgba(...))] with an
  // rgba fallback silently fails to compile here).
  const bgColor =
    rowState === "Selected"
      ? "var(--container-dynamic-brand-subtle-background-selected,#f6ebff)"
      : rowState === "Hover"
        ? "var(--container-dynamic-neutral-subtle-background-hover,rgba(113,113,128,0.08))"
        : "var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)";
  const numberStyle = numeric
    ? ({ fontFeatureSettings: '"lnum" 1, "tnum" 1' } as React.CSSProperties)
    : undefined;
  return (
    <div
      style={{ backgroundColor: bgColor }}
      className="border-[var(--border-static-subtle-neutral,#e1e1e8)] border-b border-solid flex gap-[var(--spacing-50,4px)] h-[40px] items-center pl-[var(--spacing-150,12px)] pr-[var(--spacing-200,16px)] relative shrink-0 w-full transition-colors duration-150"
      data-name="Cell/Text"
    >
      {hasCheckbox && (
        <div className="flex items-center overflow-clip relative shrink-0" data-name="Checkbox Container">
          {checked ? <CheckboxChecked /> : <CheckboxUnchecked />}
        </div>
      )}
      <div className="flex flex-1 items-start min-w-px relative" data-name="Cell Body Content">
        <p
          className={`[word-break:break-word] flex-1 font-normal leading-[var(--body-sm-regular-line-height,18px)] min-w-px not-italic overflow-hidden relative text-[length:var(--body-sm-regular-size,12px)] text-[var(--container-dynamic-neutral-subtle-foreground-default-variation,#13131a)] text-ellipsis whitespace-nowrap ${
            numeric ? "text-right" : ""
          }`}
          style={numberStyle}
        >
          {text}
        </p>
      </div>
    </div>
  );
}

/* --- Pagination (28603:21773) --- */

function PaginationBar({ total = 20 }: { total?: number }) {
  const [page, setPage] = useState(1);
  const safeTotal = Math.max(1, total);
  const current = Math.min(page, safeTotal);
  return (
    <div
      className="bg-[var(--surface-background-lvl1,#ffffff)] flex items-center justify-end relative shrink-0"
      data-name="Pagination"
    >
      <div className="flex items-center justify-end pr-[8px] relative shrink-0" data-name="Pagination/label">
        <p className="[word-break:break-word] font-normal leading-[20px] not-italic relative shrink-0 text-[14px] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] text-right whitespace-nowrap">
          {current} of {safeTotal}
        </p>
      </div>
      <button
        type="button"
        aria-label="Previous page"
        disabled={current <= 1}
        onClick={() => setPage(() => Math.max(1, current - 1))}
        className="flex items-center justify-center p-[7px] relative rounded-[var(--radius-25,2px)] shrink-0 transition-colors hover:bg-[var(--container-dynamic-neutral-subtle-background-hover,rgba(113,113,128,0.08))] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <span className="flex items-center justify-center p-[2px] size-[20px]">
          <img alt="" className="block max-w-none size-[20px]" src={imgPagCaretLeft} />
        </span>
      </button>
      <button
        type="button"
        aria-label="Next page"
        disabled={current >= safeTotal}
        onClick={() => setPage(() => Math.min(safeTotal, current + 1))}
        className="flex items-center justify-center p-[7px] relative rounded-[var(--radius-25,2px)] shrink-0 transition-colors hover:bg-[var(--container-dynamic-neutral-subtle-background-hover,rgba(113,113,128,0.08))] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
      >
        <span className="flex items-center justify-center p-[2px] size-[20px]">
          <img alt="" className="block max-w-none size-[20px]" src={imgPagCaretRight} />
        </span>
      </button>
    </div>
  );
}

/* --- Column definitions & realistic sample data --- */

type ColumnDef = {
  key: string;
  header: string;
  width: string;
  numeric?: boolean;
  checkbox?: boolean; // first column carries selection checkbox
};

const ALL_COLUMNS: ColumnDef[] = [
  { key: "name", header: "Column Header", width: "153px", checkbox: true },
  { key: "fill", header: "Fill", width: "336px" },
  { key: "impressions", header: "Column Header", width: "191px", numeric: true },
  { key: "reach", header: "Column Header", width: "160px" },
  { key: "ctr", header: "Column Header", width: "160px" },
  { key: "spend", header: "Column Header", width: "160px" },
];

type RowData = {
  name: string;
  fill: string;
  impressions: string;
  reach: string;
  ctr: string;
  spend: string;
};

const SAMPLE_ROWS: RowData[] = [
  { name: "Cell content", fill: "DE - DV360 - Display", impressions: "12,393", reach: "Cell content", ctr: "Cell content", spend: "Cell content" },
  { name: "Cell content", fill: "DE - DV360 - Display", impressions: "12,393", reach: "Cell content", ctr: "Cell content", spend: "Cell content" },
  { name: "Cell content", fill: "DE - DV360 - Display", impressions: "12,393", reach: "Cell content", ctr: "Cell content", spend: "Cell content" },
  { name: "Cell content", fill: "DE - DV360 - Display", impressions: "12,393", reach: "Cell content", ctr: "Cell content", spend: "Cell content" },
  { name: "Cell content", fill: "DE - DV360 - Display", impressions: "12,393", reach: "Cell content", ctr: "Cell content", spend: "Cell content" },
  { name: "Cell content", fill: "DE - DV360 - Display", impressions: "12,393", reach: "Cell content", ctr: "Cell content", spend: "Cell content" },
  { name: "Cell content", fill: "DE - DV360 - Display", impressions: "12,393", reach: "Cell content", ctr: "Cell content", spend: "Cell content" },
  { name: "Cell content", fill: "DE - DV360 - Display", impressions: "12,393", reach: "Cell content", ctr: "Cell content", spend: "Cell content" },
  { name: "Cell content", fill: "Cell content", impressions: "12,393", reach: "Cell content", ctr: "Cell content", spend: "Cell content" },
  { name: "Cell content", fill: "Cell content", impressions: "12,393", reach: "Cell content", ctr: "Cell content", spend: "Cell content" },
  { name: "Cell content", fill: "Cell content", impressions: "57,393", reach: "Cell content", ctr: "Cell content", spend: "Cell content" },
  { name: "Cell content", fill: "Cell content", impressions: "12,393", reach: "Cell content", ctr: "Cell content", spend: "Cell content" },
  { name: "Cell content", fill: "Cell content", impressions: "12,393", reach: "Cell content", ctr: "Cell content", spend: "Cell content" },
  { name: "Cell content", fill: "Cell content", impressions: "12,393", reach: "Cell content", ctr: "Cell content", spend: "Cell content" },
];

/* --- Table Master (28603:21771) — column-oriented composition --- */

function TableMaster({
  columnCount,
  rowCount,
  hoverRow,
  selectedRow,
}: {
  columnCount: number;
  rowCount: number;
  hoverRow: number;
  selectedRow: number;
}) {
  const columns = ALL_COLUMNS.slice(0, Math.max(1, Math.min(columnCount, ALL_COLUMNS.length)));
  const rows = SAMPLE_ROWS.slice(0, Math.max(1, Math.min(rowCount, SAMPLE_ROWS.length)));

  // State-resolution policy:
  //  - Panel-selected `selectedRow` / `hoverRow` are FORCED — that row stays
  //    Selected / Hover and live interaction cannot remove the forced row.
  //  - Live clicks select ADDITIONAL rows; live hover highlights the whole row
  //    across all columns (mirroring the Figma Hover / Selected row variants).
  //  - The forced hover row wins for its own row regardless of pointer.
  const [liveHover, setLiveHover] = useState<number>(-1);
  const [liveSelected, setLiveSelected] = useState<Set<number>>(new Set());
  useEffect(() => {
    setLiveSelected(new Set());
    setLiveHover(-1);
  }, [selectedRow, rowCount]);

  const isSelected = (i: number) => i === selectedRow || liveSelected.has(i);
  const effHover = liveHover >= 0 ? liveHover : hoverRow;
  const rowStateFor = (i: number): RowState =>
    isSelected(i) ? "Selected" : i === effHover ? "Hover" : "Default";

  const toggleSelect = (i: number) => {
    if (i === selectedRow) return; // forced selection cannot be removed
    setLiveSelected((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div
      className="border-[var(--border-static-subtle-neutral,#e1e1e8)] border-l border-r border-solid border-t flex items-start overflow-clip relative shrink-0 w-full"
      data-name="Table Master"
    >
      <div className="flex flex-1 items-start min-w-px relative" data-name="Columns">
        {columns.map((col) => (
          <div
            key={col.key}
            className="flex flex-col items-start relative shrink-0"
            style={{ width: col.width }}
            data-name="Table/Column"
          >
            <MasterColumnHeader
              text={col.header}
              hasCheckbox={col.checkbox === true}
              numeric={col.numeric === true}
            />
            {rows.map((row, i) => {
              const selectable = col.checkbox === true;
              const forcedRow = i === selectedRow;
              // Only the checkbox (first) column exposes the row-selection
              // control with full keyboard/ARIA semantics; other columns just
              // mirror hover so the whole row highlights. The forced panel row
              // is not operable (its state is locked).
              const a11y =
                selectable && !forcedRow
                  ? {
                      role: "checkbox" as const,
                      "aria-checked": isSelected(i),
                      "aria-label": `Select row ${i + 1}`,
                      tabIndex: 0,
                      onClick: () => toggleSelect(i),
                      onKeyDown: (e: React.KeyboardEvent) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          toggleSelect(i);
                        }
                      },
                    }
                  : {};
              return (
                <div
                  key={i}
                  {...a11y}
                  className={`w-full outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--border-dynamic-brand-selected,#7c33b5)] ${
                    selectable && !forcedRow ? "cursor-pointer" : ""
                  }`}
                  onMouseEnter={() => setLiveHover(i)}
                  onMouseLeave={() => setLiveHover((h) => (h === i ? -1 : h))}
                >
                  <MasterCell
                    text={row[col.key as keyof RowData]}
                    rowState={rowStateFor(i)}
                    hasCheckbox={col.checkbox === true}
                    checked={rowStateFor(i) === "Selected"}
                    numeric={col.numeric === true}
                  />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

/* --- Table Layout (28603:22623) — master composition --- */

function TableLayout({
  tableHeader = true,
  filters = true,
  message = true,
  footer = true,
  pagination = true,
  columnCount = 6,
  rowCount = 14,
  hoverRow = -1,
  selectedRow = -1,
}: {
  tableHeader?: boolean;
  filters?: boolean;
  message?: boolean;
  footer?: boolean;
  pagination?: boolean;
  columnCount?: number;
  rowCount?: number;
  hoverRow?: number;
  selectedRow?: number;
}) {
  return (
    <div
      className="flex flex-col gap-[20px] items-start relative w-full max-w-[1200px]"
      data-name="Table Layout"
    >
      {tableHeader && <TableHeaderBar />}
      <div
        className="bg-[var(--surface-background-lvl1,#ffffff)] flex flex-col items-center justify-center relative rounded-[var(--radius-25,2px)] shrink-0 w-full"
        style={{
          filter:
            "drop-shadow(0px 1px 2px var(--shadow-lvl8, rgba(113,113,128,0.08))) drop-shadow(0px 8px 8px var(--shadow-lvl4, rgba(113,113,128,0.04)))",
        }}
        data-name="Table Conteiner"
      >
        {filters && <FiltersRow />}
        <div
          className="flex flex-col gap-[16px] items-center justify-center pb-[16px] px-[16px] relative shrink-0 w-full"
          data-name="Bottom"
        >
          {message && <TableAlert />}
          <TableMaster
            columnCount={columnCount}
            rowCount={rowCount}
            hoverRow={hoverRow}
            selectedRow={selectedRow}
          />
          {footer && (
            <div
              className="flex flex-col gap-[10px] items-end justify-center relative shrink-0 w-full"
              data-name="Footer container"
            >
              {pagination && <PaginationBar total={20} />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Playground configs                                                  */
/* ------------------------------------------------------------------ */

const tableLayoutConfig: PlaygroundConfig = {
  name: "Table Layout",
  scopeId: "tables/table-layout",
  description:
    "Full composed master — Table header + Table Conteiner (Filters, Alert, Table Master, Footer container with Pagination). Toggle parts and row/column config; hover & select individual rows.",
  controls: [
    { kind: "boolean", name: "tableHeader", label: "Table header", defaultValue: true },
    { kind: "boolean", name: "filters", label: "Filters", defaultValue: true },
    { kind: "boolean", name: "message", label: "Alert", defaultValue: true },
    { kind: "boolean", name: "footer", label: "Footer container", defaultValue: true },
    { kind: "boolean", name: "pagination", label: "Pagination", defaultValue: true },
    {
      kind: "select",
      name: "columnCount",
      label: "Columns",
      options: ["2", "3", "4", "5", "6"],
      defaultValue: "6",
    },
    {
      kind: "select",
      name: "rowCount",
      label: "Rows",
      options: ["4", "6", "8", "10", "14"],
      defaultValue: "14",
    },
    {
      kind: "select",
      name: "hoverRow",
      label: "Hover row",
      options: ["None", "1", "2", "3", "4", "5"],
      defaultValue: "None",
    },
    {
      kind: "select",
      name: "selectedRow",
      label: "Selected row",
      options: ["None", "1", "2", "3", "4", "5"],
      defaultValue: "None",
    },
  ],
  render: (p: PropValues) => {
    const toIdx = (v: string | boolean) => (v === "None" ? -1 : Number(v) - 1);
    return (
      <TableLayout
        tableHeader={p.tableHeader === true}
        filters={p.filters === true}
        message={p.message === true}
        footer={p.footer === true}
        pagination={p.pagination === true}
        columnCount={Number(p.columnCount)}
        rowCount={Number(p.rowCount)}
        hoverRow={toIdx(p.hoverRow)}
        selectedRow={toIdx(p.selectedRow)}
      />
    );
  },
  tokens: {
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "surface/background/lvl2": "var(--surface-background-lvl2)",
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "surface/foreground/static/neutral/lvl2": "var(--surface-foreground-static-neutral-lvl2)",
    "surface/foreground/dynamic/brand/default": "var(--surface-foreground-dynamic-brand-default)",
    "container/dynamic/brand/bold/background/default": "var(--container-dynamic-brand-bold-background-default)",
    "container/dynamic/neutral/subtle/background/default/regular": "var(--container-dynamic-neutral-subtle-background-default-regular)",
    "container/dynamic/neutral/subtle/background/default/variation": "var(--container-dynamic-neutral-subtle-background-default-variation)",
    "container/dynamic/neutral/subtle/background/hover": "var(--container-dynamic-neutral-subtle-background-hover)",
    "container/dynamic/brand/subtle/background/selected": "var(--container-dynamic-brand-subtle-background-selected)",
    "container/dynamic/neutral/subtle/foreground/default/regular": "var(--container-dynamic-neutral-subtle-foreground-default-regular)",
    "container/dynamic/neutral/subtle/foreground/default/variation": "var(--container-dynamic-neutral-subtle-foreground-default-variation)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "border/static/bold/info": "var(--border-static-bold-info)",
    "border/dynamic/neutral/subtle/default": "var(--border-dynamic-neutral-subtle-default)",
    "shadow/lvl8": "var(--shadow-lvl8)",
    "radius/25": "var(--radius-25)",
    "spacing/150": "var(--spacing-150)",
    "spacing/200": "var(--spacing-200)",
    "Body Md/Medium": "var(--body-md-medium-size)",
    "Body Sm/Regular": "var(--body-sm-regular-size)",
  },
};

const cellBodyConfig: PlaygroundConfig = {
  name: "Cell Body Content",
  scopeId: "tables/cell-body-content",
  description: "Table body text — Strong weight and Number (tabular/right-aligned) variants.",
  controls: [
    { kind: "boolean", name: "strong", label: "Strong", defaultValue: false },
    { kind: "boolean", name: "number", label: "Number", defaultValue: false },
    {
      kind: "text",
      name: "text",
      label: "Text",
      defaultValue: "Cell content",
      placeholder: "Cell content",
    },
  ],
  render: (p: PropValues) => (
    <CellBodyContent
      strong={p.strong === true}
      number={p.number === true}
      text={String(p.text)}
    />
  ),
  tokens: {
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "Body Sm/Regular": "var(--body-sm-regular-size)",
    "Body Sm/Medium": "var(--body-sm-medium-size)",
  },
};

const cellTextConfig: PlaygroundConfig = {
  name: "Cell / Text",
  scopeId: "tables/cell-text",
  description: "Primary table cell — interaction states plus checkbox, tree, logo and link options.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Default", "Hover", "Selected"],
      defaultValue: "Default",
      asTabs: true,
    },
    { kind: "boolean", name: "hasCheck", label: "Checkbox", defaultValue: false },
    { kind: "boolean", name: "checked", label: "Checked", defaultValue: false },
    { kind: "boolean", name: "hasChildren", label: "Has children", defaultValue: false },
    { kind: "boolean", name: "isExpanded", label: "Expanded", defaultValue: false },
    { kind: "boolean", name: "hasLogo", label: "Logo", defaultValue: false },
    { kind: "boolean", name: "hasIconRight", label: "Icon right", defaultValue: false },
    {
      kind: "select",
      name: "indent",
      label: "Indent",
      options: ["0", "1", "2"],
      defaultValue: "0",
    },
    {
      kind: "text",
      name: "text",
      label: "Text",
      defaultValue: "Cell content",
      placeholder: "Cell content",
    },
  ],
  render: (p: PropValues) => (
    <CellText
      state={p.state as CellTextState}
      hasCheck={p.hasCheck === true}
      checked={p.checked === true}
      hasChildren={p.hasChildren === true}
      isExpanded={p.isExpanded === true}
      hasLogo={p.hasLogo === true}
      hasIconRight={p.hasIconRight === true}
      indent={Number(p.indent) as 0 | 1 | 2}
      text={String(p.text)}
    />
  ),
  tokens: {
    "container/dynamic/neutral/subtle/background/default/regular": "var(--container-dynamic-neutral-subtle-background-default-regular)",
    "container/dynamic/neutral/subtle/background/hover": "var(--container-dynamic-neutral-subtle-background-hover)",
    "container/dynamic/brand/subtle/background/selected": "var(--container-dynamic-brand-subtle-background-selected)",
    "container/dynamic/neutral/subtle/foreground/default/variation": "var(--container-dynamic-neutral-subtle-foreground-default-variation)",
    "surface/foreground/dynamic/brand/default": "var(--surface-foreground-dynamic-brand-default)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "border/dynamic/neutral/subtle/default": "var(--border-dynamic-neutral-subtle-default)",
    "container/dynamic/brand/bold/background/default": "var(--container-dynamic-brand-bold-background-default)",
    "radius/25": "var(--radius-25)",
    "spacing/50": "var(--spacing-50)",
    "spacing/150": "var(--spacing-150)",
    "spacing/200": "var(--spacing-200)",
    "Body Sm/Regular": "var(--body-sm-regular-size)",
  },
};

const columnHeaderConfig: PlaygroundConfig = {
  name: "Column Header",
  scopeId: "tables/column-header",
  description: "Table column header cell — optional selection checkbox.",
  controls: [
    { kind: "boolean", name: "hasCheckbox", label: "Checkbox", defaultValue: false },
    {
      kind: "text",
      name: "text",
      label: "Label",
      defaultValue: "Column Header",
      placeholder: "Column Header",
    },
  ],
  render: (p: PropValues) => (
    <ColumnHeader hasCheckbox={p.hasCheckbox === true} text={String(p.text)} />
  ),
  tokens: {
    "surface/background/lvl2": "var(--surface-background-lvl2)",
    "surface/foreground/static/neutral/lvl2": "var(--surface-foreground-static-neutral-lvl2)",
    "Body Md/Medium": "var(--body-md-medium-size)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "border/dynamic/neutral/subtle/default": "var(--border-dynamic-neutral-subtle-default)",
    "spacing/50": "var(--spacing-50)",
  },
};

const cellActionConfig: PlaygroundConfig = {
  name: "Cell / Action",
  scopeId: "tables/cell-action",
  description: "Row action cell — 1 to 3 icon buttons across interaction states.",
  controls: [
    {
      kind: "select",
      name: "iconAmount",
      label: "Icon amount",
      options: ["1", "2", "3"],
      defaultValue: "1",
      asTabs: true,
    },
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Default", "Hover", "Selected"],
      defaultValue: "Default",
    },
  ],
  render: (p: PropValues) => (
    <CellAction
      iconAmount={Number(p.iconAmount) as 1 | 2 | 3}
      state={p.state as ActionState}
    />
  ),
  tokens: {
    "container/dynamic/neutral/subtle/background/default/regular": "var(--container-dynamic-neutral-subtle-background-default-regular)",
    "container/dynamic/neutral/subtle/background/hover": "var(--container-dynamic-neutral-subtle-background-hover)",
    "container/dynamic/brand/subtle/background/selected": "var(--container-dynamic-brand-subtle-background-selected)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "radius/25": "var(--radius-25)",
  },
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function TablesPage(): JSX.Element {
  return (
    <section aria-label="Tables components" className="flex flex-col gap-6">
      <Playground config={tableLayoutConfig} />
      <Playground config={cellBodyConfig} />
      <Playground config={cellTextConfig} />
      <Playground config={columnHeaderConfig} />
      <Playground config={cellActionConfig} />
    </section>
  );
}
