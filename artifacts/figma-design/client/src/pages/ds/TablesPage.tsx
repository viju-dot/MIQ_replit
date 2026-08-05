import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

/**
 * Tables — Design System playground.
 * Each atomic table building-block from the Figma "Tables" page is now an
 * interactive Playground with controls mapped to its real Figma variant axes:
 *   - Cell Body Content (Strong / Number)
 *   - Cell/Text (State, Checkbox, Children/Expand, Logo, Icon-right, Indent, Label)
 *   - Column Header (Checkbox, Label)
 *   - Cell/Action (Icon amount, State)
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
        className={`[word-break:break-word] leading-[18px] not-italic relative text-[12px] text-[#13131a] ${
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
    <div className="bg-[#f7f7fa] border-[#e1e1e8] border-b border-solid flex h-[40px] items-center py-[10px] relative w-[192px]">
      <div className="flex h-[20px] items-center relative shrink-0 w-[12px]" />
      {hasCheckbox && (
        <div className="flex items-center overflow-clip pr-[4px] relative shrink-0">
          <CheckboxUnchecked />
        </div>
      )}
      <div className="flex flex-1 items-start min-w-px relative">
        <p className="[word-break:break-word] flex-1 font-medium leading-[20px] min-w-px not-italic overflow-hidden relative text-[14px] text-[#282833] text-ellipsis whitespace-nowrap">
          {text}
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
/* Playground configs                                                  */
/* ------------------------------------------------------------------ */

const cellBodyConfig: PlaygroundConfig = {
  name: "Cell Body Content",
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
    "text/body/color": "#13131a",
    "text/size/body": "12px",
    "text/line-height/body": "18px",
    "font/number-features": '"lnum" 1, "tnum" 1',
    "size/width": "160px",
  },
};

const cellTextConfig: PlaygroundConfig = {
  name: "Cell / Text",
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
    "container/background/default": "#ffffff",
    "container/background/hover": "rgba(113,113,128,0.08)",
    "container/background/selected": "#f6ebff",
    "text/color/default": "#13131a",
    "text/color/selected": "#7c33b5",
    "border/divider": "#e1e1e8",
    "checkbox/border": "#c6c6cc",
    "checkbox/fill/checked": "#7c33b5",
    "size/height": "40px",
    "size/width": "192px",
    "indent/level-1": "40px",
    "indent/level-2": "72px",
  },
};

const columnHeaderConfig: PlaygroundConfig = {
  name: "Column Header",
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
    "container/background": "#f7f7fa",
    "text/color": "#282833",
    "text/size": "14px",
    "text/line-height": "20px",
    "border/divider": "#e1e1e8",
    "size/height": "40px",
    "size/width": "192px",
  },
};

const cellActionConfig: PlaygroundConfig = {
  name: "Cell / Action",
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
    "container/background/default": "#ffffff",
    "container/background/hover": "rgba(113,113,128,0.08)",
    "container/background/selected": "#f6ebff",
    "border/divider": "#e1e1e8",
    "size/height": "44px",
    "size/width": "118px",
  },
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function TablesPage(): JSX.Element {
  return (
    <section aria-label="Tables components" className="flex flex-col gap-6">
      <Playground config={cellBodyConfig} />
      <Playground config={cellTextConfig} />
      <Playground config={columnHeaderConfig} />
      <Playground config={cellActionConfig} />
    </section>
  );
}
