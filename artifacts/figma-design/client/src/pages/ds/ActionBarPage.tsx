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
  const actionTextClass = isWhite
    ? "text-[var(--container-dynamic-brand-subtle-foreground-default,#7c33b5)]"
    : "text-[var(--container-dynamic-neutral-inverse-foreground-default,#f7f7fa)]";

  return (
    <div
      className={`flex w-full items-center justify-between gap-4 rounded-[var(--radiuses-small,2px)] px-4 py-[var(--spacing-container-l,3px)] ${
        isWhite
          ? "bg-[var(--surface-background-lvl1,#ffffff)]"
          : "bg-[var(--surface-background-brand,#7c33b5)]"
      }`}
    >
      {/* Left */}
      <div className="flex shrink-0 items-center gap-[var(--odd-numbers-11,11px)]">
        <div className="flex shrink-0 items-center gap-[var(--numbers-8,8px)]">
          <button
            type="button"
            aria-label="Toggle selection"
            className="flex shrink-0 items-center justify-center rounded-[var(--radiuses-small,2px)] p-[var(--spacing-container-m,7px)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-dynamic-brand-selected,#7c33b5)]"
          >
            <div className="flex size-[20px] shrink-0 items-center justify-center p-[2px]">
              <div className="relative size-[12.5px] shrink-0">
                <img
                  alt=""
                  className="absolute inset-0 block size-full max-w-none"
                  src={selectIcon}
                />
              </div>
            </div>
          </button>
          <p
            className={`whitespace-nowrap font-['DM_Sans',Helvetica] text-[length:var(--body-md-medium-size,14px)] font-medium leading-[var(--body-md-medium-line-height,20px)] [word-break:break-word] ${
              isWhite
                ? "text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]"
                : "text-[var(--container-dynamic-neutral-inverse-foreground-hover,#ffffff)]"
            }`}
          >
            {selectionLabel}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex shrink-0 flex-wrap items-center justify-end gap-4">
        {actions.map((action) => (
          <button
            type="button"
            key={action.label}
            className="flex shrink-0 items-center justify-center rounded-[var(--radiuses-small,2px)] px-[var(--spacing-150,12px)] py-[var(--spacing-container-m,7px)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-dynamic-brand-selected,#7c33b5)]"
          >
            <div className="flex shrink-0 items-center justify-center gap-[var(--spacing-50,4px)] rounded-[var(--radiuses-small,2px)]">
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
                className={`whitespace-nowrap text-center font-['DM_Sans',Helvetica] text-[length:var(--body-md-medium-size,14px)] font-medium leading-[var(--body-md-medium-line-height,20px)] [word-break:break-word] ${actionTextClass}`}
              >
                {action.label}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

const config: PlaygroundConfig = {
  name: "Action Bar",
  scopeId: "action-bar/action-bar",
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
    "surface/background/brand": "var(--surface-background-brand)",
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "container/dynamic/Brand/Subtle/foreground/default":
      "var(--container-dynamic-brand-subtle-foreground-default)",
    "container/dynamic/neutral/inverse/foreground/default":
      "var(--container-dynamic-neutral-inverse-foreground-default)",
    "container/dynamic/neutral/inverse/foreground/hover":
      "var(--container-dynamic-neutral-inverse-foreground-hover)",
    "surface/foreground/static/neutral/lvl1":
      "var(--surface-foreground-static-neutral-lvl1)",
    "Body Md/Medium": "var(--body-md-medium-size)",
    "Radiuses/small": "var(--radiuses-small)",
    "spacing/200": "var(--spacing-200)",
    "spacing/150": "var(--spacing-150)",
    "spacing/container/l": "var(--spacing-container-l)",
    "spacing/container/m": "var(--spacing-container-m)",
    "spacing/50": "var(--spacing-50)",
    "numbers/8": "var(--numbers-8)",
    "odd_numbers/11": "var(--odd-numbers-11)",
  },
};

export default function ActionBarPage(): JSX.Element {
  return (
    <section aria-label="Action Bar component playground" className="flex flex-col gap-6">
      <Playground config={config} />
    </section>
  );
}
