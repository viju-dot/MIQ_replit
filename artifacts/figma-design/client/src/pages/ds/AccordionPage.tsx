import { useState } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

const ASSET = "/figmaAssets/accordion";

type Border = "top&bottom" | "full";
type LeftSlot = "Drag" | "Icon" | "Check-box";

type AccordionProps = {
  type: "Collapse" | "Expanded";
  leftSlot?: LeftSlot;
  background?: boolean;
  border?: Border;
  disabled?: boolean;
  title?: string;
  body?: string;
};

/**
 * Faithful reproduction of the Figma "Accordion" component.
 * 600px wide (min 320px), 40px collapsed header, expandable body.
 */
function Accordion({
  type,
  leftSlot = "Drag",
  background = false,
  border = "top&bottom",
  disabled = false,
  title = "Accordion Title",
  body = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor labore incididunt et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
}: AccordionProps) {
  const [expanded, setExpanded] = useState(type === "Expanded");
  const [hovered, setHovered] = useState(false);
  const isExpanded = expanded;
  const [checked, setChecked] = useState(false);

  // Root background (inline style — an rgba() fallback inside an arbitrary
  // Tailwind class breaks class parsing because of the commas):
  //  - disabled => subtle disabled grey
  //  - otherwise background on => white
  let rootBgColor: string | undefined;
  if (disabled) {
    rootBgColor =
      "var(--container-dynamic-neutral-subtle-background-disabled, rgba(113,113,128,0.1))";
  } else if (background) {
    rootBgColor = "var(--surface-background-lvl1, #ffffff)";
  }

  // Header rounding
  let headerRadius = "";
  if (type === "Collapse" && border === "full") {
    headerRadius = "rounded-[var(--radius-25,2px)]";
  } else if (border === "full") {
    headerRadius = "rounded-tl-[var(--radius-25,2px)] rounded-tr-[var(--radius-25,2px)]";
  }

  // Expanded body rounding / side borders (only for full border)
  const bodyFullBorder =
    border === "full" ? "border-l border-r rounded-bl-[var(--radius-25,2px)] rounded-br-[var(--radius-25,2px)]" : "";

  const textColor = disabled
    ? "text-[var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)]"
    : "text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]";
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
      className="flex w-[600px] max-w-full flex-col items-start"
      style={rootBgColor ? { backgroundColor: rootBgColor } : undefined}
    >
      <div className="flex w-full min-w-[180px] flex-col items-start">
        <div className="flex w-full flex-col items-start">
          {/* Header row.
             The expand/collapse trigger is an absolutely-positioned <button>
             that fills the header (accordionTriggerId). The visible header is a
             presentation container so we never nest an interactive control (the
             checkbox) inside another interactive control — the checkbox sits in
             the normal flow above the trigger via z-index. */}
          <div className="flex w-full flex-col items-start">
            <div
              onMouseEnter={() => !disabled && setHovered(true)}
              onMouseLeave={() => setHovered(false)}
              className={`relative flex w-full flex-col items-start overflow-clip border-b border-t border-solid border-[var(--border-static-subtle-neutral,#e1e1e8)] px-3 py-2 transition-colors duration-150 ${headerRadius}`}
              style={
                hovered && !disabled
                  ? {
                      backgroundColor:
                        "var(--container-dynamic-neutral-subtle-background-hover, rgba(113,113,128,0.08))",
                    }
                  : undefined
              }
            >
              {/* Full-header expand/collapse trigger (sits behind the content) */}
              <button
                type="button"
                disabled={disabled}
                aria-expanded={isExpanded}
                aria-label={`${isExpanded ? "Collapse" : "Expand"} ${title}`}
                onClick={() => !disabled && setExpanded((e) => !e)}
                className={`absolute inset-0 z-0 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--border-dynamic-brand-default,#7c33b5)] ${headerRadius} ${disabled ? "cursor-not-allowed" : "cursor-pointer"}`}
              />
              <div className="pointer-events-none relative z-10 flex w-full items-center gap-5">
                {/* Title-Left */}
                <div className="relative flex min-w-px flex-1 items-center gap-1.5">
                  {leftSlot === "Check-box" ? (
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => setChecked((c) => !c)}
                      className="pointer-events-auto flex shrink-0 items-center justify-center rounded-[var(--radius-25,2px)] p-0.5 disabled:cursor-not-allowed"
                      aria-pressed={checked}
                      aria-label="Toggle"
                    >
                      <div className="flex size-5 shrink-0 items-center justify-center rounded-[var(--radius-25,2px)] p-[7px]">
                        <div className="flex shrink-0 items-center overflow-clip p-0.5">
                          <div
                            className={`size-4 shrink-0 overflow-clip rounded-[var(--radius-25,2px)] border-[1.5px] border-solid transition-colors duration-150 ${
                              checked
                                ? "border-[var(--border-dynamic-brand-default,#7c33b5)] bg-[var(--container-dynamic-brand-bold-background-default,#7c33b5)]"
                                : "border-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)]"
                            }`}
                          />
                        </div>
                      </div>
                    </button>
                  ) : leftSlot === "Icon" ? null : (
                    <div className="flex shrink-0 items-center justify-center rounded-[var(--radius-25,2px)] p-0.5">
                      <div className="flex size-5 shrink-0 items-center justify-center p-0.5">
                        <img
                          alt=""
                          className="block size-5 max-w-none"
                          src={dragIcon}
                        />
                      </div>
                    </div>
                  )}
                  <div className="flex h-6 min-w-px flex-1 items-center gap-2">
                    <p
                      className={`min-w-px flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)] [font-family:'DM_Sans',Helvetica] ${textColor}`}
                    >
                      {title}
                    </p>
                  </div>
                </div>
                {/* Right actions */}
                <div className="flex shrink-0 items-center gap-2">
                  <div className="flex shrink-0 items-center justify-center rounded-[var(--radius-25,2px)] p-0.5">
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
                  <div className="flex w-6 shrink-0 items-center justify-center rounded-[var(--radius-25,2px)] p-0.5">
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
              className={`flex w-full items-center overflow-clip border-b border-solid border-[var(--border-static-subtle-neutral,#e1e1e8)] px-4 pb-3 pt-4 ${bodyFullBorder}`}
            >
              <div className="flex min-w-px flex-1 flex-wrap content-start items-start">
                <div className="flex min-w-px flex-1 items-center">
                  <p
                    className={`min-w-px flex-1 text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)] [font-family:'DM_Sans',Helvetica] [word-break:break-word] ${textColor}`}
                  >
                    {body}
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

const config: PlaygroundConfig = {
  name: "Accordion",
  scopeId: "accordion/accordion",
  description:
    "Collapsible container — Collapse / Expanded types, border style, background, disabled, and an editable left slot.",
  controls: [
    {
      kind: "select",
      name: "type",
      label: "Type",
      options: ["Collapse", "Expanded"],
      defaultValue: "Collapse",
      asTabs: true,
    },
    {
      kind: "select",
      name: "leftSlot",
      label: "Left slot",
      options: ["Drag", "Icon", "Check-box"],
      defaultValue: "Drag",
    },
    {
      kind: "select",
      name: "border",
      label: "Border",
      options: ["top&bottom", "full"],
      defaultValue: "top&bottom",
    },
    { kind: "boolean", name: "background", label: "Background", defaultValue: false },
    { kind: "boolean", name: "disabled", label: "Disabled", defaultValue: false },
    {
      kind: "text",
      name: "title",
      label: "Title",
      defaultValue: "Accordion Title",
      placeholder: "Accordion Title",
    },
    {
      kind: "text",
      name: "body",
      label: "Body text",
      defaultValue:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor labore incididunt et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      placeholder: "Body text (Expanded only)",
    },
  ],
  render: (props) => (
    <Accordion
      key={String(props.type)}
      type={props.type === "Expanded" ? "Expanded" : "Collapse"}
      leftSlot={props.leftSlot as LeftSlot}
      border={props.border as Border}
      background={props.background === true}
      disabled={props.disabled === true}
      title={String(props.title)}
      body={String(props.body)}
    />
  ),
  tokens: {
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "surface/foreground/dynamic/neutral/disabled": "var(--surface-foreground-dynamic-neutral-disabled)",
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "container/dynamic/neutral/subtle/background/disabled":
      "var(--container-dynamic-neutral-subtle-background-disabled)",
    "container/dynamic/neutral/subtle/background/hover":
      "var(--container-dynamic-neutral-subtle-background-hover)",
    "container/dynamic/brand/bold/background/default":
      "var(--container-dynamic-brand-bold-background-default)",
    "border/dynamic/brand/default": "var(--border-dynamic-brand-default)",
    "border/dynamic/neutral/subtle/default": "var(--border-dynamic-neutral-subtle-default)",
    "radius/25": "var(--radius-25)",
    "Body Md/Regular": "var(--body-md-regular-size) / var(--body-md-regular-line-height)",
  },
};

export default function AccordionPage() {
  return (
    <section aria-label="Accordion component playground" className="flex flex-col gap-6">
      <Playground config={config} />
    </section>
  );
}
