import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

const ASSET = "/figmaAssets/action-bar";

type ActionBarType = "Brand" | "White";

type ActionSpec = {
  icon: string;
  size: string;
  wrapClass: string;
  label: string;
};

const brandActions: ActionSpec[] = [
  {
    icon: `${ASSET}/brand-action1.svg`,
    size: "size-[15.625px]",
    wrapClass: "p-[2px]",
    label: "Action 1",
  },
  {
    icon: `${ASSET}/brand-action2.svg`,
    size: "size-[16.25px]",
    wrapClass: "p-[2px]",
    label: "Action 2",
  },
  {
    icon: `${ASSET}/brand-action3.svg`,
    size: "h-[16.25px] w-[15px]",
    wrapClass: "px-[3px] py-[2px]",
    label: "Action 3",
  },
];

const whiteActions: ActionSpec[] = [
  {
    icon: `${ASSET}/white-action1.svg`,
    size: "size-[15.625px]",
    wrapClass: "p-[2px]",
    label: "Action 1",
  },
  {
    icon: `${ASSET}/white-action2.svg`,
    size: "size-[16.25px]",
    wrapClass: "p-[2px]",
    label: "Action2",
  },
  {
    icon: `${ASSET}/white-action3.svg`,
    size: "h-[16.25px] w-[15px]",
    wrapClass: "px-[3px] py-[2px]",
    label: "Action 3",
  },
];

function ActionBar({
  type,
  selectionLabel,
}: {
  type: ActionBarType;
  selectionLabel: string;
}): JSX.Element {
  const isWhite = type === "White";
  const actions = isWhite ? whiteActions : brandActions;
  const selectIcon = isWhite
    ? `${ASSET}/white-select-icon.svg`
    : `${ASSET}/brand-select-icon.svg`;
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
            {selectionLabel}
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

const config: PlaygroundConfig = {
  name: "Action Bar",
  description:
    "Contextual bulk-action bar shown when rows are selected — Brand and White types.",
  controls: [
    {
      kind: "select",
      name: "type",
      label: "Type",
      options: ["Brand", "White"],
      defaultValue: "Brand",
      asTabs: true,
    },
    {
      kind: "text",
      name: "selectionLabel",
      label: "Selection text",
      defaultValue: "6 users selected",
      placeholder: "e.g. 6 users selected",
    },
  ],
  render: (props: PropValues) => (
    <div className="w-full max-w-[720px]">
      <ActionBar
        type={props.type === "White" ? "White" : "Brand"}
        selectionLabel={String(props.selectionLabel)}
      />
    </div>
  ),
  tokens: {
    "container/brand/bold/background": "#7c33b5",
    "container/white/background": "#ffffff",
    "text/brand": "#7c33b5",
    "text/on-brand": "#f7f7fa",
    "text/default": "#13131a",
    "text/on-brand/strong": "#ffffff",
    "radius/bar": "2px",
    "spacing/bar-x": "16px",
    "spacing/bar-y": "3px",
    "spacing/actions-gap": "16px",
  },
};

export default function ActionBarPage(): JSX.Element {
  return (
    <section aria-label="Action Bar component playground" className="flex flex-col gap-6">
      <Playground config={config} />
    </section>
  );
}
