import { useState } from "react";

/* Assets downloaded from Figma (temporary URLs) into /public/figmaAssets/list */
const imgAvatar = "/figmaAssets/list/avatar.png";
const imgButtonIcon = "/figmaAssets/list/button-icon.svg";

/* ---------------------------------------------------------------------------
 * Avatar (40) with "Pro" badge — used as a leftItem in the List component
 * ------------------------------------------------------------------------- */
function Avatar() {
  return (
    <div className="flex items-center overflow-hidden px-[2px] relative shrink-0">
      <div className="h-[40px] relative shrink-0 w-[36px]">
        <div className="absolute left-[2px] top-0 h-[32px] w-[32px] rounded-[24px] overflow-hidden">
          <img
            alt=""
            className="absolute inset-0 max-w-none h-full w-full object-cover pointer-events-none rounded-[24px]"
            src={imgAvatar}
          />
        </div>
        {/* Pro badge */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex items-start">
          <div className="flex h-[18px] items-center justify-center gap-[4px] rounded-[100px] bg-gradient-to-r from-[#d71a82] to-[#f456ca] px-[8px] py-[2px]">
            <p className="leading-[18px] text-[12px] font-medium text-white text-center whitespace-nowrap">
              Pro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Checkbox element (leftItem default) — mirrors the Figma checkbox visuals
 * ------------------------------------------------------------------------- */
function LeftCheckbox({
  checked = false,
  disabled = false,
  onChange,
}: {
  checked?: boolean;
  disabled?: boolean;
  onChange?: () => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onChange}
      aria-checked={checked}
      role="checkbox"
      className="flex items-center justify-center overflow-hidden p-[2px] rounded-[2px] shrink-0 all-unset cursor-pointer disabled:cursor-not-allowed"
    >
      <div className="flex items-center overflow-hidden p-[2px] shrink-0">
        <div
          className={`flex h-[16px] w-[16px] items-center justify-center rounded-[2px] border-[1.5px] border-solid ${
            checked
              ? disabled
                ? "border-transparent bg-[#7171801a]"
                : "border-[#7c33b5] bg-[#7c33b5]"
              : "border-[#c6c6cc] bg-transparent"
          }`}
        >
          {checked && (
            <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M1 4L3.5 6.5L9 1"
                stroke={disabled ? "#a8a8b2" : "#ffffff"}
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}

/* ---------------------------------------------------------------------------
 * Trailing action button (rightItem default)
 * ------------------------------------------------------------------------- */
function TrailingButton() {
  return (
    <div className="flex items-center justify-center rounded-[2px] bg-[#7c33b5] p-[2px] shrink-0">
      <div className="flex items-center justify-center p-[2px] h-[20px] w-[20px]">
        <img alt="" className="h-[16.25px] w-[16.25px]" src={imgButtonIcon} />
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * List item — faithful reproduction of the Figma "List item" component
 * ------------------------------------------------------------------------- */
type ListItemProps = {
  headingValue?: string;
  descriptionValue?: string;
  description?: boolean;
  leftSlot?: boolean;
  leftItem?: React.ReactNode;
  rightSlot?: boolean;
  rightItem?: React.ReactNode;
  contentSlot?: boolean;
  contentItem?: React.ReactNode;
  hasSeparator?: boolean;
  checked?: boolean;
  disabled?: boolean;
  onCheckChange?: () => void;
  /* visual state background */
  backgroundClass?: string;
  headingClass?: string;
};

function ListItem({
  headingValue = "Placeholder text",
  descriptionValue = "Description",
  description = false,
  leftSlot = true,
  leftItem,
  rightSlot = false,
  rightItem,
  contentSlot = false,
  contentItem,
  hasSeparator = true,
  checked = false,
  disabled = false,
  onCheckChange,
  backgroundClass = "",
  headingClass = "text-[#13131a]",
}: ListItemProps) {
  return (
    <div className="flex flex-col items-start relative w-full min-w-[200px]">
      <div
        className={`flex flex-col gap-[8px] items-start justify-center p-[8px] relative w-full ${backgroundClass}`}
      >
        <div className="flex gap-[8px] items-start relative w-full">
          {/* leftSlot */}
          {leftSlot && (
            <div className="flex gap-[8px] items-center relative shrink-0">
              <div className="flex flex-col items-start overflow-hidden relative shrink-0">
                {leftItem ?? (
                  <LeftCheckbox
                    checked={checked}
                    disabled={disabled}
                    onChange={onCheckChange}
                  />
                )}
              </div>
            </div>
          )}
          {/* centreSlot */}
          <div className="flex flex-1 flex-col gap-[8px] items-start min-w-0 pt-[2px] relative self-stretch">
            <div className="flex flex-col gap-[4px] items-start relative w-full">
              <p
                className={`leading-[20px] overflow-hidden text-ellipsis whitespace-nowrap text-[14px] w-full ${headingClass}`}
              >
                {headingValue}
              </p>
              {description && (
                <p className="h-[18px] leading-[18px] overflow-hidden text-ellipsis whitespace-nowrap text-[12px] text-[#4b4b59] w-full">
                  {descriptionValue}
                </p>
              )}
            </div>
            {contentSlot && (
              <div className="h-[27px] relative w-full">{contentItem}</div>
            )}
          </div>
          {/* trailingSlot */}
          {rightSlot && (
            <div className="flex gap-[8px] items-center justify-end relative shrink-0">
              <div className="flex gap-[8px] h-[24px] items-center justify-end overflow-hidden shrink-0">
                {rightItem ?? <TrailingButton />}
              </div>
            </div>
          )}
        </div>
      </div>
      {hasSeparator && <div className="h-0 w-full border-t border-[#e1e1e8]" />}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * List — the wrapper component (listWrapper + optional scrollbar)
 * ------------------------------------------------------------------------- */
function List({
  children,
  hasScroll = false,
  className = "",
}: {
  children: React.ReactNode;
  hasScroll?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-start min-w-[200px] w-[281px] ${className}`}>
      <div className="flex flex-1 flex-col items-start min-w-0 overflow-hidden relative">
        {children}
      </div>
      {hasScroll && (
        <div className="flex items-center justify-center self-stretch shrink-0 w-[12px] py-[2px]">
          <div className="w-[8px] flex-1 rounded-[100px] bg-[#e1e1e8]" />
        </div>
      )}
    </div>
  );
}

/* ---------------------------------------------------------------------------
 * Small caption label
 * ------------------------------------------------------------------------- */
function Caption({ children }: { children: React.ReactNode }) {
  return <span className="text-[12px] text-[#a8a8b2]">{children}</span>;
}

const cardClass =
  "rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5";

/* ---------------------------------------------------------------------------
 * Page
 * ------------------------------------------------------------------------- */
export default function ListPage() {
  const [defaultChecked, setDefaultChecked] = useState(false);
  const [selectedChecked, setSelectedChecked] = useState(true);

  return (
    <section className="flex flex-col gap-6">
      {/* ============================ STATES ============================ */}
      <div className={cardClass}>
        <p className="mb-4 text-[14px] font-medium text-[#13131a]">
          List item — States
        </p>
        <div className="flex flex-col gap-6">
          {/* Default (interactive) */}
          <div className="flex flex-col gap-1">
            <Caption>Default — the standard resting state</Caption>
            <div className="w-[211px]">
              <ListItem
                checked={defaultChecked}
                onCheckChange={() => setDefaultChecked((v) => !v)}
                hasSeparator
              />
            </div>
          </div>

          {/* Hover */}
          <div className="flex flex-col gap-1">
            <Caption>Hover — applies a subtle background colour</Caption>
            <div className="w-[211px]">
              <ListItem backgroundClass="bg-[#71718014]" hasSeparator />
            </div>
          </div>

          {/* Selected */}
          <div className="flex flex-col gap-1">
            <Caption>Selected — used in single/multi-selection lists</Caption>
            <div className="w-[211px]">
              <ListItem
                checked={selectedChecked}
                onCheckChange={() => setSelectedChecked((v) => !v)}
                backgroundClass="bg-[#f6ebff]"
                headingClass="text-[#7c33b5]"
                hasSeparator
              />
            </div>
          </div>

          {/* Disabled */}
          <div className="flex flex-col gap-1">
            <Caption>Disabled — a non-selectable item</Caption>
            <div className="w-[211px]">
              <ListItem
                disabled
                headingClass="text-[#a8a8b2]"
                hasSeparator
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================== PROPERTIES ========================== */}
      <div className={cardClass}>
        <p className="mb-4 text-[14px] font-medium text-[#13131a]">
          List item — Properties &amp; slots
        </p>
        <div className="flex flex-wrap gap-8">
          {/* leftSlot */}
          <div className="flex flex-col gap-1">
            <Caption>leftSlot — objects at the start of the row</Caption>
            <div className="w-[394px] max-w-full">
              <ListItem description descriptionValue="Description" hasSeparator />
            </div>
          </div>

          {/* heading */}
          <div className="flex flex-col gap-1">
            <Caption>heading — main label displayed</Caption>
            <div className="w-[394px] max-w-full">
              <ListItem
                headingValue="Placeholder text"
                description
                descriptionValue="Description"
                hasSeparator
              />
            </div>
          </div>

          {/* description */}
          <div className="flex flex-col gap-1">
            <Caption>description — text below the heading</Caption>
            <div className="w-[394px] max-w-full">
              <ListItem description descriptionValue="Description" hasSeparator />
            </div>
          </div>

          {/* rightSlot */}
          <div className="flex flex-col gap-1">
            <Caption>rightSlot — objects at the end of the row</Caption>
            <div className="w-[394px] max-w-full">
              <ListItem description descriptionValue="Description" rightSlot hasSeparator />
            </div>
          </div>

          {/* contentSlot */}
          <div className="flex flex-col gap-1">
            <Caption>contentSlot — objects at the bottom of the item</Caption>
            <div className="w-[394px] max-w-full">
              <ListItem
                description
                descriptionValue="Description"
                contentSlot
                contentItem={
                  <div className="h-[27px] w-full rounded-[6px] bg-[#f7f7fa]" />
                }
                hasSeparator
              />
            </div>
          </div>
        </div>
      </div>

      {/* ============================ LIST ============================= */}
      <div className={cardClass}>
        <p className="mb-4 text-[14px] font-medium text-[#13131a]">
          List — wrapper component
        </p>
        <div className="flex flex-wrap gap-8">
          {/* Default checkbox list */}
          <div className="flex flex-col gap-1">
            <Caption>listWrapper — checkbox list items</Caption>
            <List hasScroll={false}>
              <ListItem headingValue="Placeholder text" />
              <ListItem headingValue="Placeholder text" />
              <ListItem headingValue="Placeholder text" />
              <ListItem headingValue="Placeholder text" hasSeparator={false} />
            </List>
          </div>

          {/* Avatar list */}
          <div className="flex flex-col gap-1">
            <Caption>Avatar leftItem + description</Caption>
            <List hasScroll={false}>
              <ListItem
                leftItem={<Avatar />}
                headingValue="Sammy Tailor"
                description
                descriptionValue="Agency director"
              />
              <ListItem
                leftItem={<Avatar />}
                headingValue="Sammy Tailor"
                description
                descriptionValue="Agency director"
                hasSeparator={false}
              />
            </List>
          </div>

          {/* hasScroll */}
          <div className="flex flex-col gap-1">
            <Caption>hasScroll — displays a scrollbar</Caption>
            <List hasScroll>
              <ListItem
                leftItem={<Avatar />}
                headingValue="Sammy Tailor"
                description
                descriptionValue="Agency director"
              />
              <ListItem
                leftItem={<Avatar />}
                headingValue="Sammy Tailor"
                description
                descriptionValue="Agency director"
                hasSeparator={false}
              />
            </List>
          </div>
        </div>
      </div>
    </section>
  );
}
