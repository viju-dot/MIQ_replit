import { useState } from "react";

const ASSET = "/figmaAssets/accordion";

type Border = "top&bottom" | "full";

type AccordionProps = {
  type: "Collapse" | "Expanded";
  background?: boolean;
  border?: Border;
  disabled?: boolean;
};

/**
 * Faithful reproduction of the Figma "Accordion" component.
 * 600px wide (min 320px), 40px collapsed header, expandable body.
 */
function Accordion({
  type,
  background = false,
  border = "top&bottom",
  disabled = false,
}: AccordionProps) {
  const isExpanded = type === "Expanded";

  // Root background:
  //  - collapse + background + full => white
  //  - disabled => subtle disabled grey
  //  - otherwise background on => white
  let rootBg = "";
  if (disabled) {
    rootBg = "bg-[rgba(113,113,128,0.1)]";
  } else if (background) {
    rootBg = "bg-white";
  }

  // Header rounding
  let headerRadius = "";
  if (type === "Collapse" && border === "full") {
    headerRadius = "rounded-[2px]";
  } else if (border === "full") {
    headerRadius = "rounded-tl-[2px] rounded-tr-[2px]";
  }

  // Expanded body rounding / side borders (only for full border)
  const bodyFullBorder =
    border === "full" ? "border-l border-r rounded-bl-[2px] rounded-br-[2px]" : "";

  const textColor = disabled ? "text-[#a8a8b2]" : "text-[#13131a]";
  const dragIcon = disabled ? `${ASSET}/drag-left-disabled.svg` : `${ASSET}/drag-left.svg`;
  const actionIcon = disabled
    ? `${ASSET}/action-dots-disabled.svg`
    : `${ASSET}/action-dots.svg`;
  const caretIcon = isExpanded
    ? disabled
      ? `${ASSET}/caret-down-disabled.svg`
      : `${ASSET}/caret-down.svg`
    : disabled
      ? `${ASSET}/caret-down-collapse-disabled.svg`
      : `${ASSET}/caret-down-collapse.svg`;

  return (
    <div
      className={`flex w-[600px] max-w-full flex-col items-start ${rootBg}`}
    >
      <div className="flex w-full min-w-[180px] flex-col items-start">
        <div className="flex w-full flex-col items-start">
          {/* Header row */}
          <div className="flex w-full flex-col items-start">
            <div
              className={`flex w-full flex-col items-start overflow-clip border-b border-t border-solid border-[#e1e1e8] px-3 py-2 ${headerRadius}`}
            >
              <div className="flex w-full items-center gap-5">
                {/* Title-Left */}
                <div className="relative flex min-w-px flex-1 items-center gap-1.5">
                  <div className="flex shrink-0 items-center justify-center rounded-[2px] p-0.5">
                    <div className="flex size-5 shrink-0 items-center justify-center p-0.5">
                      <img
                        alt=""
                        className="block size-5 max-w-none"
                        src={dragIcon}
                      />
                    </div>
                  </div>
                  <div className="flex h-6 min-w-px flex-1 items-center gap-2">
                    <p
                      className={`min-w-px flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[14px] leading-[20px] [font-family:'DM_Sans',Helvetica] ${textColor}`}
                    >
                      Accordion Title
                    </p>
                  </div>
                </div>
                {/* Right actions */}
                <div className="flex shrink-0 items-center gap-2">
                  <div className="flex shrink-0 items-center justify-center rounded-[2px] p-0.5">
                    <div className="flex size-5 shrink-0 items-center justify-center p-0.5">
                      <div className="relative h-[16.25px] w-[15px] shrink-0">
                        <img
                          alt=""
                          className="absolute inset-0 block size-full max-w-none"
                          src={actionIcon}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="flex w-6 shrink-0 items-center justify-center rounded-[2px] p-0.5">
                    <div className="flex size-5 shrink-0 items-center justify-center p-0.5">
                      <img
                        alt=""
                        className="block size-5 max-w-none"
                        src={caretIcon}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Expanded body */}
          {isExpanded && (
            <div
              className={`flex w-full items-center overflow-clip border-b border-solid border-[#e1e1e8] px-4 pb-3 pt-4 ${bodyFullBorder}`}
            >
              <div className="flex min-w-px flex-1 flex-wrap content-start items-start">
                <div className="flex min-w-px flex-1 items-center">
                  <p
                    className={`min-w-px flex-1 text-[14px] leading-[20px] [font-family:'DM_Sans',Helvetica] [word-break:break-word] ${textColor}`}
                  >
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
                    eiusmod tempor labore incididunt et dolore magna aliqua. Ut enim
                    ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Header symbol with a checkbox on the left (Left=Check-box variant).
 */
function AccordionHeaderCheckbox() {
  const [checked, setChecked] = useState(false);
  return (
    <div className="flex w-[600px] max-w-full flex-col items-start">
      <div className="flex w-full flex-col items-start">
        <div className="flex w-full flex-col items-start overflow-clip border-b border-t border-solid border-[#e1e1e8] px-3 py-2">
          <div className="flex w-full items-center gap-5">
            <div className="flex min-w-px flex-1 items-center gap-1.5">
              <button
                type="button"
                onClick={() => setChecked((c) => !c)}
                className="flex shrink-0 items-center justify-center rounded-[2px] p-0.5"
                aria-pressed={checked}
                aria-label="Toggle"
              >
                <div className="flex size-5 shrink-0 items-center justify-center rounded-[2px] p-[7px]">
                  <div className="flex shrink-0 items-center overflow-clip p-0.5">
                    <div
                      className={`size-4 shrink-0 overflow-clip rounded-[2px] border-[1.5px] border-solid ${
                        checked
                          ? "border-[#7c33b5] bg-[#7c33b5]"
                          : "border-[#c6c6cc]"
                      }`}
                    />
                  </div>
                </div>
              </button>
              <div className="flex h-6 min-w-px flex-1 items-center gap-2">
                <p className="min-w-px flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[14px] leading-[20px] text-[#13131a] [font-family:'DM_Sans',Helvetica]">
                  Accordion Title
                </p>
              </div>
            </div>
            <div className="flex shrink-0 items-center gap-2">
              <div className="flex shrink-0 items-center justify-center rounded-[2px] p-0.5">
                <div className="flex size-5 shrink-0 items-center justify-center p-0.5">
                  <div className="relative h-[16.25px] w-[15px] shrink-0">
                    <img
                      alt=""
                      className="absolute inset-0 block size-full max-w-none"
                      src={`${ASSET}/action-dots.svg`}
                    />
                  </div>
                </div>
              </div>
              <div className="flex w-6 shrink-0 items-center justify-center rounded-[2px] p-0.5">
                <div className="flex size-5 shrink-0 items-center justify-center p-0.5">
                  <img
                    alt=""
                    className="block size-5 max-w-none"
                    src={`${ASSET}/caret-down-collapse.svg`}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Header symbol with an icon on the left (Left=Icon variant).
 */
function AccordionHeaderIcon() {
  return <Accordion type="Collapse" />;
}

type Caption = { label: string };

function VariantBlock({
  label,
  children,
}: Caption & { children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <span className="px-1 text-[12px] text-[#a8a8b2]">{label}</span>
      {children}
    </div>
  );
}

function CardGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
      <span className="mb-4 block text-[12px] font-medium text-[#a8a8b2]">
        {title}
      </span>
      <div className="flex flex-wrap gap-8">{children}</div>
    </div>
  );
}

export default function AccordionPage() {
  return (
    <section aria-label="Accordion component" className="flex flex-col gap-6">
      {/* Collapsed states */}
      <CardGroup title="Collapse">
        <VariantBlock label="Default · Off · top&bottom">
          <Accordion type="Collapse" border="top&bottom" />
        </VariantBlock>
        <VariantBlock label="Default · Off · full">
          <Accordion type="Collapse" border="full" />
        </VariantBlock>
        <VariantBlock label="Disabled · Off · top&bottom">
          <Accordion type="Collapse" border="top&bottom" disabled />
        </VariantBlock>
        <VariantBlock label="Default · On · top&bottom">
          <Accordion type="Collapse" border="top&bottom" background />
        </VariantBlock>
        <VariantBlock label="Default · On · full">
          <Accordion type="Collapse" border="full" background />
        </VariantBlock>
      </CardGroup>

      {/* Expanded states */}
      <CardGroup title="Expanded">
        <VariantBlock label="Default · Off · top&bottom">
          <Accordion type="Expanded" border="top&bottom" />
        </VariantBlock>
        <VariantBlock label="Default · Off · full">
          <Accordion type="Expanded" border="full" />
        </VariantBlock>
        <VariantBlock label="Disabled · Off · top&bottom">
          <Accordion type="Expanded" border="top&bottom" disabled />
        </VariantBlock>
        <VariantBlock label="Default · On · top&bottom">
          <Accordion type="Expanded" border="top&bottom" background />
        </VariantBlock>
        <VariantBlock label="Default · On · full">
          <Accordion type="Expanded" border="full" background />
        </VariantBlock>
      </CardGroup>

      {/* Header left-slot variants */}
      <CardGroup title="Header left slot">
        <VariantBlock label="Left = Icon">
          <AccordionHeaderIcon />
        </VariantBlock>
        <VariantBlock label="Left = Check-box (interactive)">
          <AccordionHeaderCheckbox />
        </VariantBlock>
      </CardGroup>

      {/* Row interaction states */}
      <CardGroup title="Row states">
        <VariantBlock label="Default">
          <Accordion type="Collapse" background />
        </VariantBlock>
        <VariantBlock label="Hover">
          <div className="flex w-[600px] max-w-full flex-col bg-[rgba(113,113,128,0.08)]">
            <Accordion type="Collapse" />
          </div>
        </VariantBlock>
        <VariantBlock label="Hover actions">
          <div className="flex w-[600px] max-w-full flex-col bg-[rgba(113,113,128,0.08)]">
            <Accordion type="Collapse" />
          </div>
        </VariantBlock>
      </CardGroup>
    </section>
  );
}
