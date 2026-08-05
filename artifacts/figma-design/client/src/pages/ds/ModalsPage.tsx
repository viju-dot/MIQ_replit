import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

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
        <p className="[word-break:break-word] flex-1 font-['DM_Sans',Helvetica] font-normal leading-[20px] min-w-px text-[14px] text-[#13131a]">
          {text}
        </p>
      </div>
    );
  }

  if (type === "notification") {
    return (
      <div className="relative flex flex-1 items-start gap-2 min-w-px rounded-[2px] border border-solid border-[#da294b] bg-white p-5">
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
              <p className="[word-break:break-word] font-['DM_Sans',Helvetica] font-medium leading-[20px] text-[14px] text-[#13131a] w-full shrink-0">
                {title}
              </p>
            </div>
          </div>
          <div className="flex items-start pl-8 pt-[5px] w-full shrink-0">
            <p className="[word-break:break-word] flex-1 font-['DM_Sans',Helvetica] font-normal leading-[20px] min-w-px text-[14px] text-[#13131a]">
              {description}
            </p>
          </div>
        </div>
        <div
          className="absolute inset-[-1px] z-[1] rounded-[2px] border border-solid border-[#da294b] bg-white"
          style={{
            boxShadow:
              "0px 1px 4px 0px rgba(113,113,128,0.08), 0px 16px 24px 0px rgba(113,113,128,0.12)",
          }}
        />
      </div>
    );
  }

  // custom (empty placeholder container)
  return <div className="h-[76px] w-full bg-white shrink-0" />;
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
      className="flex flex-col items-start min-w-[180px] rounded-[2px]"
      style={{
        width: fluid ? "100%" : numericWidth,
        maxWidth: numericWidth,
        filter: `drop-shadow(0px 1px 2px rgba(113,113,128,0.08)) drop-shadow(0px 8px 8px rgba(113,113,128,0.04))`,
      }}
    >
      {/* Header */}
      <div className="flex h-[50px] w-full items-start shrink-0 rounded-t-[2px] border-b border-solid border-[#e1e1e8] bg-white pl-4 pr-[11px] py-[13px]">
        <div className="flex flex-1 items-start gap-2 min-w-px">
          <div className="flex flex-1 flex-col items-start min-w-px overflow-hidden self-stretch">
            <p className="[word-break:break-word] font-['DM_Sans',Helvetica] font-medium leading-[24px] text-[16px] text-[#13131a] tracking-[-0.08px] w-full">
              {title ?? defaultTitle}
            </p>
          </div>
          <div className="flex items-center justify-center p-[5px] shrink-0 size-6">
            <img
              alt="Close"
              className="block size-[15px] shrink-0"
              src={ICON_X}
            />
          </div>
        </div>
      </div>

      {/* Swap Container */}
      <div className="flex w-full flex-col items-start bg-white p-4 shrink-0">
        <SwapInstance type={swap} />
      </div>

      {/* Footer */}
      <div
        className={`flex w-full flex-wrap items-center justify-center gap-x-4 bg-[#f7f7fa] p-4 shrink-0 ${
          isLarge ? "h-[66px]" : "h-[56px]"
        }`}
      >
        <div className="flex flex-1 items-center justify-end gap-4 min-w-px">
          <div className="flex items-center gap-1 rounded-[2px] shrink-0">
            <p className="[word-break:break-word] font-['DM_Sans',Helvetica] font-medium leading-[20px] text-[14px] text-[#7c33b5] text-center whitespace-nowrap">
              Cancel
            </p>
          </div>
          <div
            className={`flex items-center justify-end gap-0 rounded-[2px] bg-[#7c33b5] shrink-0 ${
              isLarge ? "px-3 py-[7px]" : "px-[6px] py-[2px]"
            }`}
          >
            <div className="flex items-center justify-center gap-1 rounded-[2px] shrink-0">
              <p className="[word-break:break-word] font-['DM_Sans',Helvetica] font-medium leading-[20px] text-[14px] text-white text-center whitespace-nowrap">
                Confirm
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const modalConfig: PlaygroundConfig = {
  name: "Modal",
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
    "container/surface/background": "#ffffff",
    "container/footer/background": "#f7f7fa",
    "border/neutral": "#e1e1e8",
    "text/primary": "#13131a",
    "text/brand": "#7c33b5",
    "container/brand/bold/background": "#7c33b5",
    "radius/modal": "2px",
    "size/header-height": "50px",
    "size/footer-height": "56px (large 66px)",
    "shadow/modal":
      "0px 1px 2px rgba(113,113,128,0.08), 0px 8px 8px rgba(113,113,128,0.04)",
  },
};

const swapConfig: PlaygroundConfig = {
  name: "Swap Instance",
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
        <div className="w-full max-w-[400px] rounded-[2px] border border-solid border-[#e1e1e8] bg-white p-4">
          <div className="flex h-[76px] w-full items-center justify-center bg-[#f7f7fa] text-[12px] text-[#a8a8b2]">
            Custom content slot
          </div>
        </div>
      );
    }
    return (
      <div className="flex w-full max-w-[400px] rounded-[2px] border border-solid border-[#e1e1e8] bg-white p-4">
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
    "container/surface/background": "#ffffff",
    "border/neutral": "#e1e1e8",
    "border/danger": "#da294b",
    "text/primary": "#13131a",
    "text/muted": "#a8a8b2",
    "container/custom/background": "#f7f7fa",
    "radius/swap": "2px",
    "shadow/notification":
      "0px 1px 4px rgba(113,113,128,0.08), 0px 16px 24px rgba(113,113,128,0.12)",
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
