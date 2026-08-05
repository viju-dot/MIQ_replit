type ActionBarType = "Brand" | "White";

type ActionSpec = {
  icon: string;
  size: string;
  wrapClass: string;
  label: string;
};

const brandActions: ActionSpec[] = [
  {
    icon: "/figmaAssets/action-bar/brand-action1.svg",
    size: "size-[15.625px]",
    wrapClass: "p-[2px]",
    label: "Action 1",
  },
  {
    icon: "/figmaAssets/action-bar/brand-action2.svg",
    size: "size-[16.25px]",
    wrapClass: "p-[2px]",
    label: "Action 2",
  },
  {
    icon: "/figmaAssets/action-bar/brand-action3.svg",
    size: "h-[16.25px] w-[15px]",
    wrapClass: "px-[3px] py-[2px]",
    label: "Action 3",
  },
];

const whiteActions: ActionSpec[] = [
  {
    icon: "/figmaAssets/action-bar/white-action1.svg",
    size: "size-[15.625px]",
    wrapClass: "p-[2px]",
    label: "Action 1",
  },
  {
    icon: "/figmaAssets/action-bar/white-action2.svg",
    size: "size-[16.25px]",
    wrapClass: "p-[2px]",
    label: "Action2",
  },
  {
    icon: "/figmaAssets/action-bar/white-action3.svg",
    size: "h-[16.25px] w-[15px]",
    wrapClass: "px-[3px] py-[2px]",
    label: "Action 3",
  },
];

function ActionBar({ type }: { type: ActionBarType }): JSX.Element {
  const isWhite = type === "White";
  const actions = isWhite ? whiteActions : brandActions;
  const selectIcon = isWhite
    ? "/figmaAssets/action-bar/white-select-icon.svg"
    : "/figmaAssets/action-bar/brand-select-icon.svg";
  const actionTextClass = isWhite ? "text-[#7c33b5]" : "text-[#f7f7fa]";

  return (
    <div
      className={`flex w-full items-center justify-between gap-4 rounded-[2px] px-4 py-[3px] ${
        isWhite ? "bg-white" : "bg-[#7c33b5]"
      }`}
    >
      {/* Left */}
      <div className="flex shrink-0 items-center gap-[11px]">
        <div className="flex shrink-0 items-center gap-[8px]">
          <div className="flex shrink-0 items-center justify-center rounded-[2px] p-[7px]">
            <div className="flex size-[20px] shrink-0 items-center justify-center p-[2px]">
              <div className="relative size-[12.5px] shrink-0">
                <img
                  alt=""
                  className="absolute inset-0 block size-full max-w-none"
                  src={selectIcon}
                />
              </div>
            </div>
          </div>
          <p
            className={`whitespace-nowrap font-['DM_Sans',Helvetica] text-[14px] font-medium leading-[20px] [word-break:break-word] ${
              isWhite ? "text-[#13131a]" : "text-white"
            }`}
          >
            6 users selected
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-4">
        {actions.map((action) => (
          <div
            key={action.label}
            className="flex shrink-0 items-center justify-center rounded-[2px] px-[12px] py-[7px]"
          >
            <div className="flex shrink-0 items-center justify-center gap-[4px] rounded-[2px]">
              <div
                className={`flex size-[20px] shrink-0 items-center justify-center ${action.wrapClass}`}
              >
                <div className={`relative shrink-0 ${action.size}`}>
                  <img
                    alt=""
                    className="absolute inset-0 block size-full max-w-none"
                    src={action.icon}
                  />
                </div>
              </div>
              <p
                className={`whitespace-nowrap text-center font-['DM_Sans',Helvetica] text-[14px] font-medium leading-[20px] [word-break:break-word] ${actionTextClass}`}
              >
                {action.label}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ActionBarPage(): JSX.Element {
  return (
    <section aria-label="Action Bar" className="flex flex-col gap-6">
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <div className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <span className="px-1 text-[12px] text-[#a8a8b2]">Type = Brand</span>
            <ActionBar type="Brand" />
          </div>
          <div className="flex flex-col gap-2">
            <span className="px-1 text-[12px] text-[#a8a8b2]">Type = White</span>
            <ActionBar type="White" />
          </div>
        </div>
      </div>
    </section>
  );
}
