import { useState } from "react";

/**
 * Tables — Design System page.
 * Renders the atomic table building-block components and their variants that
 * have dedicated reference code on the Figma "Tables" page:
 *   - Cell Body Content (Strong / Number)
 *   - Cell/Text (states, children/expand, checkbox, logo, icon-right)
 *   - Cell/Action (icon amount 1-3, states)
 *   - Column Header cell (extracted from Table/Column reference markup)
 * Documentation / annotation frames ("Tables Use Cases", "How to use component")
 * are intentionally skipped.
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

/* ------------------------------------------------------------------ */
/* Shared atoms                                                        */
/* ------------------------------------------------------------------ */

function Caption({ children }: { children: React.ReactNode }) {
  return <span className="text-[12px] text-[#a8a8b2]">{children}</span>;
}

function Group({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
      <h3 className="mb-4 text-[14px] font-medium text-[#282833]">{title}</h3>
      <div className="flex flex-wrap items-start gap-x-8 gap-y-6">
        {children}
      </div>
    </div>
  );
}

function Variant({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Caption>{label}</Caption>
      {children}
    </div>
  );
}

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
    <div className="flex items-center justify-center overflow-clip p-[2px] relative rounded-[2px] shrink-0">
      <div className="flex items-center overflow-clip p-[2px] relative shrink-0">
        <div className="border-[1.5px] border-[#c6c6cc] border-solid overflow-clip relative rounded-[2px] shrink-0 size-[16px]" />
      </div>
    </div>
  );
}

function CheckboxChecked() {
  return (
    <div className="flex items-center justify-center overflow-clip p-[2px] relative rounded-[2px] shrink-0">
      <div className="flex items-center overflow-clip p-[2px] relative shrink-0">
        <div className="bg-[#7c33b5] overflow-clip relative rounded-[2px] shrink-0 size-[16px]">
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
    <div className="flex items-center p-[2px] relative rounded-[2px] shrink-0">
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

/* ------------------------------------------------------------------ */
/* Cell Body Content (3108:8213)                                       */
/* ------------------------------------------------------------------ */

function CellBodyContent({
  strong = false,
  number = false,
}: {
  strong?: boolean;
  number?: boolean;
}) {
  const numberStyle = number
    ? ({ fontFeatureSettings: '"lnum" 1, "tnum" 1' } as React.CSSProperties)
    : undefined;
  return (
    <div className="flex items-start relative w-[160px]">
      <p
        className={`[word-break:break-word] leading-[18px] not-italic relative text-[12px] text-[#13131a] ${
          number
            ? `flex-1 min-w-px text-right ${strong ? "font-medium" : "font-normal"}`
            : `shrink-0 whitespace-nowrap ${strong ? "font-medium" : "font-normal"}`
        }`}
        style={numberStyle}
      >
        {number ? "123" : "Cell content"}
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
}: {
  state?: CellTextState;
  hasCheck?: boolean;
  checked?: boolean;
  hasChildren?: boolean;
  isExpanded?: boolean;
  hasLogo?: boolean;
  hasIconRight?: boolean;
  indent?: 0 | 1 | 2;
}) {
  const bg =
    state === "Selected"
      ? "bg-[#f6ebff]"
      : state === "Hover"
        ? "bg-[rgba(113,113,128,0.08)]"
        : "bg-white";
  const pl = indent === 2 ? "pl-[72px]" : indent === 1 ? "pl-[40px]" : "pl-[12px]";
  const textCls =
    state === "Selected"
      ? "font-medium text-[#7c33b5]"
      : "font-normal text-[#13131a]";

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
      className={`${bg} ${pl} border-[#e1e1e8] border-b border-solid flex gap-[4px] h-[40px] items-center pr-[16px] relative w-[192px]`}
    >
      {hasLogo && <TtdLogo />}
      {hasChildren && (
        <div className="flex gap-[4px] items-center relative shrink-0">
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
          className={`[word-break:break-word] flex-1 leading-[18px] min-w-px not-italic overflow-hidden relative text-[12px] text-ellipsis whitespace-nowrap ${textCls}`}
        >
          Cell content
        </p>
      </div>
      {hasIconRight && <ArrowSquareOut />}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Column Header cell (extracted from Table/Column reference)          */
/* ------------------------------------------------------------------ */

function ColumnHeader({ hasCheckbox = false }: { hasCheckbox?: boolean }) {
  return (
    <div className="bg-[#f7f7fa] border-[#e1e1e8] border-b border-solid flex h-[40px] items-center py-[10px] relative w-[192px]">
      <div className="flex h-[20px] items-center relative shrink-0 w-[12px]" />
      {hasCheckbox && (
        <div className="flex items-center overflow-clip pr-[4px] relative shrink-0">
          <CheckboxUnchecked />
        </div>
      )}
      <div className="flex flex-1 items-start min-w-px relative">
        <p className="[word-break:break-word] flex-1 font-medium leading-[20px] min-w-px not-italic overflow-hidden relative text-[14px] text-[#282833] text-ellipsis whitespace-nowrap">
          Column Header
        </p>
      </div>
      <div className="flex h-[20px] items-center justify-end relative shrink-0 w-[16px]">
        <div className="h-[20px] relative shrink-0 w-px">
          <div className="absolute border border-[#e1e1e8] border-solid inset-0" />
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
    <div className="flex items-center justify-center p-[7px] relative rounded-[2px] shrink-0">
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
  const bg =
    state === "Selected"
      ? "bg-[#f6ebff]"
      : state === "Hover"
        ? "bg-[rgba(113,113,128,0.08)]"
        : "bg-white";

  // Icon set per amount (dots menu shown for 3-icon, extra icons revealed on hover/selected)
  const icons: string[] =
    iconAmount === 1
      ? [imgActionEdit]
      : iconAmount === 2
        ? [imgActionEye, imgActionEdit]
        : [imgActionDots, imgActionEye, imgActionEdit];

  return (
    <div
      className={`${bg} border-[#e1e1e8] border-b border-solid flex h-[44px] items-center justify-end px-[8px] py-[5px] relative w-[118px]`}
    >
      {iconAmount === 1 ? (
        <div className="flex items-center justify-center p-[7px] relative rounded-[2px] shrink-0">
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

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function TablesPage(): JSX.Element {
  const [demoChecked, setDemoChecked] = useState(false);

  return (
    <section aria-label="Tables components" className="flex flex-col gap-6">
      {/* Cell Body Content */}
      <Group title="Cell Body Content">
        <Variant label="Strong=False, Number=False">
          <CellBodyContent />
        </Variant>
        <Variant label="Strong=True, Number=False">
          <CellBodyContent strong />
        </Variant>
        <Variant label="Strong=False, Number=True">
          <CellBodyContent number />
        </Variant>
        <Variant label="Strong=True, Number=True">
          <CellBodyContent strong number />
        </Variant>
      </Group>

      {/* Cell / Text — states */}
      <Group title="Cell / Text — States">
        <Variant label="Default">
          <CellText state="Default" />
        </Variant>
        <Variant label="Hover">
          <CellText state="Hover" />
        </Variant>
        <Variant label="Selected">
          <CellText state="Selected" />
        </Variant>
      </Group>

      {/* Cell / Text — checkbox + logo + icon */}
      <Group title="Cell / Text — Content options">
        <Variant label="+ Checkbox (unchecked)">
          <CellText hasCheck />
        </Variant>
        <Variant label="+ Checkbox (checked)">
          <CellText hasCheck checked />
        </Variant>
        <Variant label="+ Logo">
          <CellText hasLogo />
        </Variant>
        <Variant label="+ Icon right">
          <CellText hasIconRight />
        </Variant>
        <Variant label="Interactive checkbox">
          <div
            className="bg-white border-[#e1e1e8] border-b border-solid flex gap-[4px] h-[40px] items-center pl-[12px] pr-[16px] relative w-[192px] cursor-pointer"
            onClick={() => setDemoChecked((v) => !v)}
          >
            <div className="flex items-center overflow-clip relative shrink-0">
              {demoChecked ? <CheckboxChecked /> : <CheckboxUnchecked />}
            </div>
            <div className="flex flex-1 items-start min-w-px relative">
              <p className="[word-break:break-word] flex-1 font-normal leading-[18px] min-w-px not-italic overflow-hidden relative text-[12px] text-[#13131a] text-ellipsis whitespace-nowrap">
                Cell content
              </p>
            </div>
          </div>
        </Variant>
      </Group>

      {/* Cell / Text — expandable tree rows */}
      <Group title="Cell / Text — Expandable rows">
        <Variant label="Has children, collapsed (lvl 0)">
          <CellText hasChildren indent={0} />
        </Variant>
        <Variant label="Has children, expanded (lvl 0)">
          <CellText hasChildren isExpanded indent={0} />
        </Variant>
        <Variant label="Child (lvl 1)">
          <CellText indent={1} />
        </Variant>
        <Variant label="Child (lvl 2)">
          <CellText indent={2} />
        </Variant>
        <Variant label="Selected child (lvl 1)">
          <CellText state="Selected" indent={1} />
        </Variant>
        <Variant label="Hover child (lvl 1)">
          <CellText state="Hover" indent={1} />
        </Variant>
      </Group>

      {/* Column Header */}
      <Group title="Column Header">
        <Variant label="Default">
          <ColumnHeader />
        </Variant>
        <Variant label="Selectable (+ Checkbox)">
          <ColumnHeader hasCheckbox />
        </Variant>
      </Group>

      {/* Cell / Action */}
      <Group title="Cell / Action">
        <Variant label="Icon amount=1, Default">
          <CellAction iconAmount={1} state="Default" />
        </Variant>
        <Variant label="Icon amount=1, Hover">
          <CellAction iconAmount={1} state="Hover" />
        </Variant>
        <Variant label="Icon amount=1, Selected">
          <CellAction iconAmount={1} state="Selected" />
        </Variant>
        <Variant label="Icon amount=2, Default">
          <CellAction iconAmount={2} state="Default" />
        </Variant>
        <Variant label="Icon amount=2, Hover">
          <CellAction iconAmount={2} state="Hover" />
        </Variant>
        <Variant label="Icon amount=2, Selected">
          <CellAction iconAmount={2} state="Selected" />
        </Variant>
        <Variant label="Icon amount=3, Default">
          <CellAction iconAmount={3} state="Default" />
        </Variant>
        <Variant label="Icon amount=3, Hover">
          <CellAction iconAmount={3} state="Hover" />
        </Variant>
        <Variant label="Icon amount=3, Selected">
          <CellAction iconAmount={3} state="Selected" />
        </Variant>
      </Group>
    </section>
  );
}
