const ICON_X = "/figmaAssets/modals/icon-x.svg";
const ICON_WARNING = "/figmaAssets/modals/icon-warning.svg";

const MODAL_SHADOW =
  "0px 1px 2px 0px rgba(113,113,128,0.08), 0px 8px 8px 0px rgba(113,113,128,0.04)";

const PLACEHOLDER_TEXT =
  "This is place holder text. The basic dialog for modals should contain only valuable and relevant information. Loren ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Nec sagittis aliquam malesuada bibendum arcu. Blandit libero volutpat sed cras ornare arcu dui vivamus. Morbi tristique senectus.";

type SwapType = "custom" | "text" | "notification";

function SwapInstance({ type = "custom" }: { type?: SwapType }) {
  if (type === "text") {
    return (
      <div className="flex flex-1 items-start relative">
        <p className="[word-break:break-word] flex-1 font-['DM_Sans',Helvetica] font-normal leading-[20px] min-w-px text-[14px] text-[#13131a]">
          {PLACEHOLDER_TEXT}
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
                Title
              </p>
            </div>
          </div>
          <div className="flex items-start pl-8 pt-[5px] w-full shrink-0">
            <p className="[word-break:break-word] flex-1 font-['DM_Sans',Helvetica] font-normal leading-[20px] min-w-px text-[14px] text-[#13131a]">
              Description
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

const caption = "text-[12px] text-[#a8a8b2]";
const cardClass =
  "rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5";

export default function ModalsPage() {
  const sizes: ModalSize[] = ["400px", "600px", "800px", "1000px"];

  return (
    <section className="flex flex-col gap-8">
      {/* Modal sizes */}
      <div className={cardClass}>
        <p className="mb-4 font-['DM_Sans',Helvetica] font-medium text-[14px] text-[#13131a]">
          Modal — Sizes
        </p>
        <div className="flex flex-col gap-8">
          {sizes.map((size) => (
            <div key={size} className="flex flex-col gap-1">
              <span className={caption}>Size={size}</span>
              <Modal size={size} swap="custom" fluid />
            </div>
          ))}
        </div>
      </div>

      {/* Swap Instance types */}
      <div className={cardClass}>
        <p className="mb-4 font-['DM_Sans',Helvetica] font-medium text-[14px] text-[#13131a]">
          Swap Instance — Content types
        </p>
        <div className="flex flex-wrap gap-8">
          <div className="flex flex-col gap-1 w-full max-w-[400px]">
            <span className={caption}>type=text</span>
            <div className="w-full rounded-[2px] border border-solid border-[#e1e1e8] bg-white p-4">
              <SwapInstance type="text" />
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full max-w-[400px]">
            <span className={caption}>type=notification</span>
            <div className="flex w-full rounded-[2px] border border-solid border-[#e1e1e8] bg-white p-4">
              <SwapInstance type="notification" />
            </div>
          </div>
          <div className="flex flex-col gap-1 w-full max-w-[400px]">
            <span className={caption}>type=custom</span>
            <div className="w-full rounded-[2px] border border-solid border-[#e1e1e8] bg-white p-4">
              <div className="flex h-[76px] w-full items-center justify-center bg-[#f7f7fa] text-[12px] text-[#a8a8b2]">
                Custom content slot
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals with content examples */}
      <div className={cardClass}>
        <p className="mb-4 font-['DM_Sans',Helvetica] font-medium text-[14px] text-[#13131a]">
          Modal — With content
        </p>
        <div className="flex flex-wrap items-start gap-8">
          <div className="flex flex-col gap-1 w-full max-w-[400px]">
            <span className={caption}>Modal + Text content</span>
            <Modal size="400px" title="Modal" swap="text" fluid />
          </div>
          <div className="flex flex-col gap-1 w-full max-w-[400px]">
            <span className={caption}>Modal + Notification</span>
            <Modal size="400px" title="Modal" swap="notification" fluid />
          </div>
        </div>
      </div>

      {/* Responsive example */}
      <div className={cardClass}>
        <p className="mb-2 font-['DM_Sans',Helvetica] font-medium text-[20px] text-[#13131a] tracking-[-0.2px]">
          Modal Responsive Example
        </p>
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          {/* Description */}
          <div className="flex w-full flex-col items-start gap-5 lg:max-w-[486px]">
            <p className="[word-break:break-word] font-['DM_Sans',Helvetica] font-medium leading-[40px] text-[32px] text-[#13131a] tracking-[-0.64px]">
              Responsiveness for Modal component
            </p>
            <div className="[word-break:break-word] font-['DM_Sans',Helvetica] font-normal text-[16px] text-[#13131a] w-full">
              <p className="leading-[24px] mb-0">
                On mobile devices the modal must adjust its size and layout based
                on the viewport width.
              </p>
              <p className="leading-[24px] mb-0">&nbsp;</p>
              <p className="leading-[24px]">
                The modal component must be able to accommodate various content
                types, including text, notifications, and other components,
                components in the modal should wrap properly.
              </p>
            </div>
          </div>

          {/* Demo area */}
          <div className="flex flex-1 flex-col gap-10 rounded-[6px] border border-solid border-[#e1e1e8] bg-[#ebebf0] p-8 overflow-hidden">
            <div className="flex flex-col gap-4">
              <p className="[word-break:break-word] font-['DM_Sans',Helvetica] font-medium leading-[28px] text-[20px] text-[#13131a] tracking-[-0.2px]">
                Example of Modal Component in Desktop
              </p>
              <Modal size="1000px" title="Modal Tablet" swap="text" fluid />
            </div>
            <div className="flex flex-col gap-4">
              <p className="[word-break:break-word] font-['DM_Sans',Helvetica] font-medium leading-[28px] text-[20px] text-[#13131a] tracking-[-0.2px]">
                Example of Modal Component in Tablet
              </p>
              <Modal size="768px" title="Modal Tablet" swap="text" fluid />
            </div>
            <div className="flex flex-col gap-4">
              <p className="[word-break:break-word] font-['DM_Sans',Helvetica] font-medium leading-[28px] text-[20px] text-[#13131a] tracking-[-0.2px]">
                Example of Modal Component in Tablet
              </p>
              <Modal size="640px" title="Modal Mobile 640px" swap="text" fluid />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
