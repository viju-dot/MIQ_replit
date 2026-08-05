import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

const ASSET = "/figmaAssets/context-menu";

const shadowStyle = {
  filter:
    "drop-shadow(0px 1px 2px rgba(113,113,128,0.08)) drop-shadow(0px 8px 8px rgba(113,113,128,0.04))",
};

/* ------------------------------------------------------------------ */
/* Menu Items component (State variants)                              */
/* ------------------------------------------------------------------ */

type MenuItemState =
  | "Default"
  | "Hover"
  | "Disabled"
  | "Selected"
  | "Unselected";

type MenuItemProps = {
  state?: MenuItemState;
  addIconRight?: boolean;
  label?: string;
};

function XCircleIcon({ src }: { src: string }) {
  return (
    <div className="flex items-center p-[2px] shrink-0">
      <div className="flex items-center justify-center overflow-hidden p-[2px] shrink-0 size-[20px]">
        <div className="relative shrink-0 size-[16.25px]">
          <img
            alt=""
            className="absolute block inset-0 max-w-none size-full"
            src={src}
          />
        </div>
      </div>
    </div>
  );
}

function CaretIcon({ src }: { src: string }) {
  return (
    <div className="flex items-center p-[2px] shrink-0">
      <div className="flex items-center justify-center shrink-0 size-[20px]">
        <div className="relative shrink-0 size-[20px]">
          <img
            alt=""
            className="absolute block inset-0 max-w-none size-full"
            src={src}
          />
        </div>
      </div>
    </div>
  );
}

function CheckboxBox({ checked }: { checked?: boolean }) {
  return (
    <div className="flex items-center justify-center overflow-hidden p-[2px] rounded-[2px] shrink-0">
      <div className="flex items-center overflow-hidden p-[2px] shrink-0">
        <div
          className={`overflow-hidden relative rounded-[2px] shrink-0 size-[16px] ${
            checked ? "bg-[#7c33b5]" : "border-[1.5px] border-[#c6c6cc]"
          }`}
        >
          {checked && (
            <div className="absolute flex flex-col items-center justify-center left-0 overflow-hidden px-px py-[3px] size-[16px] top-0">
              <div className="h-[9.001px] relative shrink-0 w-[12.501px]">
                <img
                  alt=""
                  className="absolute block inset-0 max-w-none size-full"
                  src={`${ASSET}/check.svg`}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MenuItem({
  state = "Default",
  addIconRight = false,
  label = "Item",
}: MenuItemProps) {
  const isDefault = state === "Default";
  const isHover = state === "Hover";
  const isDisabled = state === "Disabled";
  const isSelected = state === "Selected";
  const isUnselected = state === "Unselected";

  if (isDisabled) {
    return (
      <div className="flex items-center gap-[4px] bg-white border-b border-[#e1e1e8] border-solid pl-[8px] pr-[12px] py-[8px]">
        <XCircleIcon src={`${ASSET}/x-circle-disabled.svg`} />
        <p className="font-['DM_Sans'] leading-[20px] text-[14px] text-[#a8a8b2] whitespace-nowrap">
          {label}
        </p>
        {addIconRight && <CaretIcon src={`${ASSET}/caret-disabled.svg`} />}
      </div>
    );
  }

  const bg = isSelected
    ? "bg-[#f6ebff]"
    : isHover
      ? "bg-[#71718014]"
      : "bg-white";

  return (
    <div
      className={`flex items-center gap-[4px] border-b border-[#e1e1e8] border-solid pl-[8px] pr-[12px] py-[8px] ${bg}`}
    >
      {(isDefault || isHover) && (
        <>
          <XCircleIcon
            src={
              isHover ? `${ASSET}/x-circle-hover.svg` : `${ASSET}/x-circle.svg`
            }
          />
          <p
            className={`font-['DM_Sans'] leading-[20px] text-[14px] whitespace-nowrap ${
              isHover ? "text-[#13131a]" : "text-[#4b4b59]"
            }`}
          >
            {label}
          </p>
          {addIconRight && (
            <CaretIcon
              src={
                isHover ? `${ASSET}/caret-hover.svg` : `${ASSET}/caret.svg`
              }
            />
          )}
        </>
      )}
      {(isSelected || isUnselected) && (
        <>
          <div className="flex items-center gap-[4px] shrink-0">
            <CheckboxBox checked={isSelected} />
            <p
              className={`font-['DM_Sans'] leading-[20px] text-[14px] whitespace-nowrap ${
                isSelected ? "text-[#7c33b5]" : "text-[#13131a]"
              }`}
            >
              {label}
            </p>
          </div>
          {addIconRight && (
            <CaretIcon
              src={
                isSelected
                  ? `${ASSET}/caret-selected.svg`
                  : `${ASSET}/caret.svg`
              }
            />
          )}
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Context Menus component (Amount = 1..5 items)                       */
/* ------------------------------------------------------------------ */

function ContextMenuRow({ label }: { label: string }) {
  return (
    <div className="bg-white border-b border-[#e1e1e8] border-solid flex gap-[4px] items-center pl-[8px] pr-[12px] py-[8px] shrink-0 w-full">
      <div className="flex items-center p-[2px] shrink-0 size-[24px]">
        <div className="flex items-center justify-center overflow-hidden p-[2px] shrink-0 size-[20px]">
          <div className="relative shrink-0 size-[16.25px]">
            <img
              alt=""
              className="absolute block inset-0 max-w-none size-full"
              src={`${ASSET}/x-circle-menus.svg`}
            />
          </div>
        </div>
      </div>
      <p className="font-['DM_Sans'] leading-[20px] text-[14px] text-[#4b4b59] whitespace-nowrap">
        {label}
      </p>
    </div>
  );
}

function ContextMenus({ amount, label }: { amount: number; label: string }) {
  return (
    <div
      className="flex flex-col items-start w-[141px] rounded-[2px] overflow-hidden"
      style={shadowStyle}
    >
      {Array.from({ length: amount }).map((_, i) => (
        <ContextMenuRow key={i} label={label} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Context Menu - Checkbox component (1..5 items)                      */
/* ------------------------------------------------------------------ */

function CheckboxRow({ label }: { label: string }) {
  return (
    <div className="bg-white border-b border-[#e1e1e8] border-solid flex gap-[4px] items-center pl-[8px] pr-[12px] py-[8px] shrink-0 w-full">
      <CheckboxBox />
      <p className="font-['DM_Sans'] leading-[20px] text-[14px] text-[#13131a] whitespace-nowrap">
        {label}
      </p>
    </div>
  );
}

function ContextMenuCheckbox({
  amount,
  label,
}: {
  amount: number;
  label: string;
}) {
  return (
    <div
      className="flex flex-col items-start w-[130px] rounded-[2px] overflow-hidden"
      style={shadowStyle}
    >
      {Array.from({ length: amount }).map((_, i) => (
        <CheckboxRow key={i} label={label} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Alert instance                                                      */
/* ------------------------------------------------------------------ */

function Alert() {
  return (
    <div className="bg-white border border-[#2360db] border-solid flex flex-col items-start rounded-[2px] max-w-[450px] w-full">
      <div className="bg-white border border-[#2360db] border-solid flex gap-[8px] items-start px-[8px] py-[2px] rounded-[2px] w-full">
        <div className="flex items-center justify-center shrink-0 size-[20px]">
          <div className="relative shrink-0 size-[20px]">
            <img
              alt=""
              className="absolute block inset-0 max-w-none size-full"
              src={`${ASSET}/info.svg`}
            />
          </div>
        </div>
        <div className="flex flex-1 flex-col items-start min-w-px overflow-hidden self-stretch">
          <p className="font-['DM_Sans'] leading-[20px] text-[14px] text-black w-full">
            The context menu is not using the menu item component. This is
            something that needs/should be addressed in the future.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Playground configs                                                  */
/* ------------------------------------------------------------------ */

const menuItemConfig: PlaygroundConfig = {
  name: "Menu Item",
  description:
    "Single menu row — explore each interaction State, optional right caret icon, and the label text.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Default", "Hover", "Disabled", "Selected", "Unselected"],
      defaultValue: "Default",
      asTabs: true,
    },
    {
      kind: "boolean",
      name: "addIconRight",
      label: "Add icon right (caret)",
      defaultValue: false,
    },
    {
      kind: "text",
      name: "label",
      label: "Label",
      defaultValue: "Item",
      placeholder: "Item",
    },
  ],
  render: (props: PropValues) => (
    <div
      className="w-[141px] rounded-[2px] overflow-hidden"
      style={shadowStyle}
    >
      <MenuItem
        state={props.state as MenuItemState}
        addIconRight={props.addIconRight === true}
        label={String(props.label)}
      />
    </div>
  ),
  tokens: {
    "container/default/background": "#ffffff",
    "container/hover/background": "rgba(113,113,128,0.08)",
    "container/selected/background": "#f6ebff",
    "border/divider": "#e1e1e8",
    "text/default": "#4b4b59",
    "text/hover": "#13131a",
    "text/disabled": "#a8a8b2",
    "text/selected": "#7c33b5",
    "checkbox/checked/background": "#7c33b5",
    "checkbox/unchecked/border": "#c6c6cc",
    "radius/menu": "2px",
    "spacing/padding": "pl-8 pr-12 py-8",
  },
};

const contextMenusConfig: PlaygroundConfig = {
  name: "Context Menu",
  description: "Stacked menu rows — set how many items appear and their label.",
  controls: [
    {
      kind: "select",
      name: "amount",
      label: "Amount",
      options: ["1", "2", "3", "4", "5"],
      defaultValue: "3",
      asTabs: true,
    },
    {
      kind: "text",
      name: "label",
      label: "Item label",
      defaultValue: "Item",
      placeholder: "Item",
    },
  ],
  render: (props: PropValues) => (
    <ContextMenus
      amount={Number(props.amount)}
      label={String(props.label)}
    />
  ),
  tokens: {
    "container/background": "#ffffff",
    "border/divider": "#e1e1e8",
    "text/item": "#4b4b59",
    "width/menu": "141px",
    "radius/menu": "2px",
    "shadow/menu":
      "0px 1px 2px rgba(113,113,128,0.08), 0px 8px 8px rgba(113,113,128,0.04)",
  },
};

const contextMenuCheckboxConfig: PlaygroundConfig = {
  name: "Context Menu — Checkbox",
  description:
    "Stacked checkbox rows — set how many options appear and their label.",
  controls: [
    {
      kind: "select",
      name: "amount",
      label: "Amount",
      options: ["1", "2", "3", "4", "5"],
      defaultValue: "3",
      asTabs: true,
    },
    {
      kind: "text",
      name: "label",
      label: "Option label",
      defaultValue: "Option",
      placeholder: "Option",
    },
  ],
  render: (props: PropValues) => (
    <ContextMenuCheckbox
      amount={Number(props.amount)}
      label={String(props.label)}
    />
  ),
  tokens: {
    "container/background": "#ffffff",
    "border/divider": "#e1e1e8",
    "text/option": "#13131a",
    "checkbox/unchecked/border": "#c6c6cc",
    "width/menu": "130px",
    "radius/menu": "2px",
    "shadow/menu":
      "0px 1px 2px rgba(113,113,128,0.08), 0px 8px 8px rgba(113,113,128,0.04)",
  },
};

const alertConfig: PlaygroundConfig = {
  name: "Implementation Note",
  description:
    "Info alert documenting that the context menu does not yet reuse the menu item component.",
  controls: [],
  render: () => <Alert />,
  tokens: {
    "container/background": "#ffffff",
    "border/info": "#2360db",
    "text/body": "#000000",
    "radius/alert": "2px",
  },
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function ContextMenuPage(): JSX.Element {
  return (
    <section
      aria-label="Context Menu component playground"
      className="flex flex-col gap-6 font-['DM_Sans']"
    >
      <Playground config={menuItemConfig} />
      <Playground config={contextMenusConfig} />
      <Playground config={contextMenuCheckboxConfig} />
      <Playground config={alertConfig} />
    </section>
  );
}
