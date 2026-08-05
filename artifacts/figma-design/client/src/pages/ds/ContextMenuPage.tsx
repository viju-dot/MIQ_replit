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

function MenuItem({ state = "Default", addIconRight = false }: MenuItemProps) {
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
          Item
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
            Item
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
              Item
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

function ContextMenuRow() {
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
        Item
      </p>
    </div>
  );
}

function ContextMenus({ amount }: { amount: number }) {
  return (
    <div
      className="flex flex-col items-start w-[141px] rounded-[2px] overflow-hidden"
      style={shadowStyle}
    >
      {Array.from({ length: amount }).map((_, i) => (
        <ContextMenuRow key={i} />
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Context Menu - Checkbox component (1..5 items)                      */
/* ------------------------------------------------------------------ */

function CheckboxRow() {
  return (
    <div className="bg-white border-b border-[#e1e1e8] border-solid flex gap-[4px] items-center pl-[8px] pr-[12px] py-[8px] shrink-0 w-full">
      <CheckboxBox />
      <p className="font-['DM_Sans'] leading-[20px] text-[14px] text-[#13131a] whitespace-nowrap">
        Option
      </p>
    </div>
  );
}

function ContextMenuCheckbox({ amount }: { amount: number }) {
  return (
    <div
      className="flex flex-col items-start w-[130px] rounded-[2px] overflow-hidden"
      style={shadowStyle}
    >
      {Array.from({ length: amount }).map((_, i) => (
        <CheckboxRow key={i} />
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
/* Shared layout helpers                                               */
/* ------------------------------------------------------------------ */

const cardClass =
  "rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5";
const captionClass = "text-[12px] text-[#a8a8b2]";

function Variant({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <span className={captionClass}>{label}</span>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

const menuItemStates: MenuItemState[] = [
  "Default",
  "Hover",
  "Disabled",
  "Selected",
  "Unselected",
];

export default function ContextMenuPage() {
  return (
    <section className="flex flex-col gap-6 font-['DM_Sans']">
      {/* Alert */}
      <div className={cardClass}>
        <Variant label="Alert / Info">
          <Alert />
        </Variant>
      </div>

      {/* Menu Items — States */}
      <div className={cardClass}>
        <div className="flex flex-col gap-4">
          <span className="text-[14px] font-medium text-[#13131a]">
            Menu items
          </span>
          <div className="flex flex-wrap gap-8">
            {menuItemStates.map((state) => (
              <Variant key={state} label={`State = ${state}`}>
                <div
                  className="w-[141px] rounded-[2px] overflow-hidden"
                  style={shadowStyle}
                >
                  <MenuItem state={state} />
                </div>
              </Variant>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items — with right icon (caret) */}
      <div className={cardClass}>
        <div className="flex flex-col gap-4">
          <span className="text-[14px] font-medium text-[#13131a]">
            Menu items — Add icon right
          </span>
          <div className="flex flex-wrap gap-8">
            {menuItemStates.map((state) => (
              <Variant key={state} label={`State = ${state}`}>
                <div
                  className="w-[141px] rounded-[2px] overflow-hidden"
                  style={shadowStyle}
                >
                  <MenuItem state={state} addIconRight />
                </div>
              </Variant>
            ))}
          </div>
        </div>
      </div>

      {/* Context Menus — Amount */}
      <div className={cardClass}>
        <div className="flex flex-col gap-4">
          <span className="text-[14px] font-medium text-[#13131a]">
            Context Menus
          </span>
          <div className="flex flex-wrap gap-8 items-start">
            {[1, 2, 3, 4, 5].map((n) => (
              <Variant
                key={n}
                label={`Amount = ${n} ${n === 1 ? "item" : "items"}`}
              >
                <ContextMenus amount={n} />
              </Variant>
            ))}
          </div>
        </div>
      </div>

      {/* Context Menu - Checkbox */}
      <div className={cardClass}>
        <div className="flex flex-col gap-4">
          <span className="text-[14px] font-medium text-[#13131a]">
            Context Menu - Checkbox
          </span>
          <div className="flex flex-wrap gap-8 items-start">
            {[1, 2, 3, 4, 5].map((n) => (
              <Variant
                key={n}
                label={`Property = ${n} ${n === 1 ? "item" : "items"}`}
              >
                <ContextMenuCheckbox amount={n} />
              </Variant>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
