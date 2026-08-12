import { useState } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

/**
 * Modal close button. The Figma ref annotates only ONE interaction on the
 * dialog: the close icon should change colour on hover to
 * surface/foreground/dynamic/neutral/hover. We honour that exactly by
 * rendering the X as a CSS mask and recolouring it via inline hover state
 * (Tailwind v3 arbitrary hover:* with var()/rgba silently fails here). No
 * hover is invented for Cancel / Confirm, which the ref does not define.
 */
function ModalCloseButton() {
  const [hover, setHover] = useState(false);
  return (
    <button
      type="button"
      aria-label="Close"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className="flex items-center justify-center p-[5px] shrink-0 size-6 rounded-[var(--radiuses-small,2px)] outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[var(--border-dynamic-brand-selected,#7c33b5)]"
    >
      <span
        aria-hidden
        className="block size-[15px] shrink-0 transition-colors duration-150"
        style={{
          backgroundColor: hover
            ? "var(--surface-foreground-dynamic-neutral-hover,#282833)"
            : "var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)",
          WebkitMaskImage: `url(${ICON_X})`,
          maskImage: `url(${ICON_X})`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    </button>
  );
}

const ICON_X = "/figmaAssets/modals/icon-x.svg";
const ICON_WARNING = "/figmaAssets/modals/icon-warning.svg";

const PLACEHOLDER_TEXT =
  "This is place holder text. The basic dialog for modals should contain only valuable and relevant information. Loren ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nec sagittis aliquam malesuada bibendum arcu. Blandit libero volutpat sed cras ornare arcu dui vivamus. Morbi tristique senectus.";

type SwapType = "custom" | "text" | "notification";

function SwapInstance({
  type = "custom",
  text = PLACEHOLDER_TEXT,
  title = "Title",
  description = "Description",
}: {
  type?: SwapType;
  text?: string;
  title?: string;
  description?: string;
}) {
  if (type === "text") {
    return (
      <div className="flex flex-1 items-start relative">
        <p className="[word-break:break-word] flex-1 font-['DM_Sans',Helvetica] font-normal leading-[var(--body-md-regular-line-height,20px)] min-w-px text-[length:var(--body-md-regular-size,14px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]">
          {text}
        </p>
      </div>
    );
  }

  if (type === "notification") {
    return (
      <div className="relative flex flex-1 items-start gap-2 min-w-px rounded-[var(--radiuses-small,2px)] border border-solid border-[var(--border-dynamic-error-default,#da294b)] bg-[var(--surface-background-lvl1,#ffffff)] p-5">
        <div className="relative z-[2] flex flex-1 flex-col items-start gap-[3px] min-w-px">
          <div className="flex w-full items-center gap-2 shrink-0">
            <div className="flex flex-col items-center justify-center px-px py-[2px] shrink-0 size-5">
              <img
                alt="Warning"
                className="block h-[15.625px] w-[17.501px] shrink-0"
                src={ICON_WARNING}
              />
            </div>
            <div className="flex flex-1 flex-col items-start gap-1 min-w-px overflow-hidden">
              <p className="[word-break:break-word] font-['DM_Sans',Helvetica] font-medium leading-[var(--body-md-medium-line-height,20px)] text-[length:var(--body-md-medium-size,14px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] w-full shrink-0">
                {title}
              </p>
            </div>
          </div>
          <div className="flex items-start pl-8 pt-[5px] w-full shrink-0">
            <p className="[word-break:break-word] flex-1 font-['DM_Sans',Helvetica] font-normal leading-[var(--body-md-regular-line-height,20px)] min-w-px text-[length:var(--body-md-regular-size,14px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]">
              {description}
            </p>
          </div>
        </div>
        <div
          className="absolute inset-[-1px] z-[1] rounded-[var(--radiuses-small,2px)] border border-solid border-[var(--border-dynamic-error-default,#da294b)] bg-[var(--surface-background-lvl1,#ffffff)]"
          style={{
            boxShadow:
              "0px 1px 4px 0px var(--shadow-lvl8,rgba(113,113,128,0.08)), 0px 16px 24px 0px var(--shadow-lvl12,rgba(113,113,128,0.12))",
          }}
        />
      </div>
    );
  }

  // custom (empty placeholder container)
  return (
    <div className="h-[76px] w-full bg-[var(--surface-background-lvl1,#ffffff)] shrink-0" />
  );
}

type ModalSize = "400px" | "600px" | "800px" | "1000px" | "768px" | "640px";

type ModalProps = {
  size?: ModalSize;
  title?: string;
  swap?: SwapType;
  /** when true, width is fluid up to the size cap (used for responsive demo) */
  fluid?: boolean;
};

function Modal({
  size = "400px",
  title,
  swap = "custom",
  fluid = false,
}: ModalProps) {
  const isLarge = size === "800px" || size === "1000px";
  const defaultTitle =
    size === "1000px"
      ? "Modal 1000"
      : size === "800px"
        ? "Modal 800"
        : size === "600px"
          ? "Modal 600"
          : "Modal 400";
  const numericWidth = parseInt(size, 10);

  return (
    <div
      className="flex flex-col items-start min-w-[180px] rounded-[var(--radiuses-small,2px)]"
      style={{
        width: fluid ? "100%" : numericWidth,
        maxWidth: numericWidth,
        filter: `drop-shadow(0px 1px 2px var(--shadow-lvl8,rgba(113,113,128,0.08))) drop-shadow(0px 8px 8px var(--shadow-lvl4,rgba(113,113,128,0.04)))`,
      }}
    >
      {/* Header */}
      <div className="flex h-[50px] w-full items-start shrink-0 rounded-t-[var(--radiuses-small,2px)] border-b border-solid border-[var(--border-static-subtle-neutral,#e1e1e8)] bg-[var(--surface-background-lvl1,#ffffff)] pl-4 pr-[11px] py-[13px]">
        <div className="flex flex-1 items-start gap-2 min-w-px">
          <div className="flex flex-1 flex-col items-start min-w-px overflow-hidden self-stretch">
            <p className="[word-break:break-word] font-['DM_Sans',Helvetica] font-medium leading-[var(--headline-xs-medium-line-height,24px)] text-[length:var(--headline-xs-medium-size,16px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] tracking-[-0.08px] w-full">
              {title ?? defaultTitle}
            </p>
          </div>
          <ModalCloseButton />
        </div>
      </div>

      {/* Swap Container */}
      <div className="flex w-full flex-col items-start bg-[var(--surface-background-lvl1,#ffffff)] p-4 shrink-0">
        <SwapInstance type={swap} />
      </div>

      {/* Footer */}
      <div
        className={`flex w-full flex-wrap items-center justify-center gap-x-4 bg-[var(--surface-background-lvl2,#f7f7fa)] p-4 shrink-0 ${
          isLarge ? "h-[66px]" : "h-[56px]"
        }`}
      >
        <div className="flex flex-1 items-center justify-end gap-4 min-w-px">
          <button
            type="button"
            className="flex items-center gap-1 rounded-[var(--radiuses-small,2px)] shrink-0 px-1 py-0.5 outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-dynamic-brand-selected,#7c33b5)]"
          >
            <p className="[word-break:break-word] font-['DM_Sans',Helvetica] font-medium leading-[var(--body-md-medium-line-height,20px)] text-[length:var(--body-md-medium-size,14px)] text-[var(--surface-foreground-dynamic-brand-default,#7c33b5)] text-center whitespace-nowrap">
              Cancel
            </p>
          </button>
          <button
            type="button"
            className={`flex items-center justify-end gap-0 rounded-[var(--radiuses-small,2px)] bg-[var(--container-dynamic-brand-bold-background-default,#7c33b5)] shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-[var(--border-dynamic-brand-selected,#7c33b5)] ${
              isLarge ? "px-3 py-[7px]" : "px-[6px] py-[2px]"
            }`}
          >
            <div className="flex items-center justify-center gap-1 rounded-[var(--radiuses-small,2px)] shrink-0">
              <p className="[word-break:break-word] font-['DM_Sans',Helvetica] font-medium leading-[var(--body-md-medium-line-height,20px)] text-[length:var(--body-md-medium-size,14px)] text-[var(--container-dynamic-brand-bold-foreground-default,#ffffff)] text-center whitespace-nowrap">
                Confirm
              </p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}

const modalConfig: PlaygroundConfig = {
  name: "Modal",
  scopeId: "modals/modal",
  description:
    "Dialog surface with header, swappable content area, and action footer. Explore sizes and content types.",
  controls: [
    {
      kind: "select",
      name: "size",
      label: "Size",
      options: ["400px", "600px", "800px", "1000px"],
      defaultValue: "400px",
      asTabs: true,
    },
    {
      kind: "select",
      name: "swap",
      label: "Content",
      options: ["custom", "text", "notification"],
      defaultValue: "text",
    },
    {
      kind: "text",
      name: "title",
      label: "Title",
      defaultValue: "Modal",
      placeholder: "Modal title",
    },
  ],
  render: (props: PropValues) => (
    <Modal
      size={props.size as ModalSize}
      swap={props.swap as SwapType}
      title={props.title ? String(props.title) : undefined}
      fluid
    />
  ),
  tokens: {
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "surface/background/lvl2": "var(--surface-background-lvl2)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "surface/foreground/static/neutral/lvl1":
      "var(--surface-foreground-static-neutral-lvl1)",
    "surface/foreground/dynamic/brand/default":
      "var(--surface-foreground-dynamic-brand-default)",
    "container/dynamic/brand/bold/background/default":
      "var(--container-dynamic-brand-bold-background-default)",
    "container/dynamic/brand/bold/foreground/default":
      "var(--container-dynamic-brand-bold-foreground-default)",
    "Radiuses/small": "var(--radiuses-small)",
    "Headline Xs/Medium": "var(--headline-xs-medium-size)",
    "Body Md/Medium": "var(--body-md-medium-size)",
    "Elevation Regular": "var(--shadow-lvl4) / var(--shadow-lvl8)",
  },
};

const swapConfig: PlaygroundConfig = {
  name: "Swap Instance",
  scopeId: "modals/swap-instance",
  description:
    "The swappable content slot inside a modal — Text, Notification, or a Custom component placeholder.",
  controls: [
    {
      kind: "select",
      name: "type",
      label: "Type",
      options: ["text", "notification", "custom"],
      defaultValue: "text",
      asTabs: true,
    },
    {
      kind: "text",
      name: "text",
      label: "Body text",
      defaultValue: PLACEHOLDER_TEXT,
      placeholder: "Text content",
    },
    {
      kind: "text",
      name: "title",
      label: "Notification title",
      defaultValue: "Title",
      placeholder: "Notification title",
    },
    {
      kind: "text",
      name: "description",
      label: "Notification description",
      defaultValue: "Description",
      placeholder: "Notification description",
    },
  ],
  render: (props: PropValues) => {
    const type = props.type as SwapType;
    if (type === "custom") {
      return (
        <div className="w-full max-w-[400px] rounded-[var(--radiuses-small,2px)] border border-solid border-[var(--border-static-subtle-neutral,#e1e1e8)] bg-[var(--surface-background-lvl1,#ffffff)] p-4">
          <div className="flex h-[76px] w-full items-center justify-center bg-[var(--surface-background-lvl2,#f7f7fa)] text-[12px] text-[var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)]">
            Custom content slot
          </div>
        </div>
      );
    }
    return (
      <div className="flex w-full max-w-[400px] rounded-[var(--radiuses-small,2px)] border border-solid border-[var(--border-static-subtle-neutral,#e1e1e8)] bg-[var(--surface-background-lvl1,#ffffff)] p-4">
        <SwapInstance
          type={type}
          text={String(props.text)}
          title={String(props.title)}
          description={String(props.description)}
        />
      </div>
    );
  },
  tokens: {
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "surface/background/lvl2": "var(--surface-background-lvl2)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "border/dynamic/error/default": "var(--border-dynamic-error-default)",
    "surface/foreground/static/neutral/lvl1":
      "var(--surface-foreground-static-neutral-lvl1)",
    "surface/foreground/dynamic/neutral/disabled":
      "var(--surface-foreground-dynamic-neutral-disabled)",
    "Radiuses/small": "var(--radiuses-small)",
    "Elevation Regular": "var(--shadow-lvl8) / var(--shadow-lvl12)",
  },
};

export default function ModalsPage(): JSX.Element {
  return (
    <section
      aria-label="Modals component playground"
      className="flex flex-col gap-8"
    >
      <Playground config={modalConfig} />
      <Playground config={swapConfig} />
    </section>
  );
}
