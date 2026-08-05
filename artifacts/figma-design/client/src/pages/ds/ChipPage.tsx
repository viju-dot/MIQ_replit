import { useState } from "react";

type ChipState =
  | "Default"
  | "Default-Hover"
  | "Selected"
  | "Selected-Hover"
  | "Disabled";
type ChipSize = "Large" | "Small";
type ChipStatus =
  | "Primary"
  | "All"
  | "Danger"
  | "Warning"
  | "Info"
  | "Success";

type ChipProps = {
  state?: ChipState;
  size?: ChipSize;
  status?: ChipStatus;
  action?: boolean;
  menu?: boolean;
  label?: string;
};

const ICON_BY_STATUS: Record<ChipStatus, { lg: string; sm: string }> = {
  Primary: { lg: "circle-lg", sm: "circle-default" },
  All: { lg: "circle-lg", sm: "circle-default" },
  Danger: { lg: "close-danger-lg", sm: "close-danger-sm" },
  Warning: { lg: "warning-lg", sm: "warning-sm" },
  Info: { lg: "info-lg", sm: "info-sm" },
  Success: { lg: "success-lg", sm: "success-sm" },
};

function Chip({
  state = "Default",
  size = "Large",
  status = "All",
  action = true,
  menu = false,
  label = "3 campaign budget changes",
}: ChipProps) {
  const isLarge = size === "Large";
  const selected = state === "Selected" || state === "Selected-Hover";
  const hover = state === "Default-Hover" || state === "Selected-Hover";
  const disabled = state === "Disabled";

  // Container background / border
  let bgClass = "bg-white";
  let borderStyle = "1px solid #c6c6cc";
  let textColor = "#13131a";

  if (disabled) {
    bgClass = "bg-[rgba(113,113,128,0.1)]";
    borderStyle = "1px solid transparent";
    textColor = "#a8a8b2";
  } else if (selected) {
    bgClass = "bg-[#f6ebff]";
    borderStyle = "1px solid #7c33b5";
    textColor = "#7c33b5";
    if (state === "Selected-Hover") {
      bgClass = "bg-[#efdcff]";
    }
  } else if (hover) {
    bgClass = "bg-[rgba(113,113,128,0.08)]";
  }

  const iconName = ICON_BY_STATUS[status];
  const iconSrc = `/figmaAssets/chip/${isLarge ? iconName.lg : iconName.sm}.svg`;

  return (
    <div
      className={`inline-flex items-center justify-center rounded-[40px] ${bgClass} ${
        isLarge ? "h-[34px] px-3 py-0.5" : "h-6 px-2 py-0.5"
      }`}
      style={{ border: borderStyle, gap: "4px" }}
      data-name={`State=${state}, Status=${status}, Size=${size}, Menu=${menu ? "Yes" : "No"}`}
    >
      <div className="flex shrink-0 items-center justify-center gap-1">
        {action && (
          <span
            className={`flex shrink-0 items-center justify-center ${
              isLarge ? "size-6" : "size-4"
            }`}
          >
            <img
              alt=""
              className={`block max-w-none ${isLarge ? "size-[19.5px]" : "size-[13px]"}`}
              src={iconSrc}
              style={{
                opacity: disabled ? 0.6 : 1,
                filter: selected
                  ? "invert(24%) sepia(63%) saturate(2200%) hue-rotate(258deg) brightness(70%) contrast(95%)"
                  : undefined,
              }}
            />
          </span>
        )}
        <span
          className="whitespace-nowrap font-['DM_Sans',Helvetica] font-medium"
          style={{
            color: textColor,
            fontSize: isLarge ? "14px" : "12px",
            lineHeight: isLarge ? "20px" : "18px",
          }}
        >
          {label}
        </span>
      </div>
      {menu && (
        <>
          <span
            aria-hidden
            className="shrink-0 self-stretch"
            style={{
              width: "1px",
              backgroundColor: disabled ? "#d3d3d8" : "#e1e1e8",
              margin: "4px 0",
            }}
          />
          <span
            className={`flex shrink-0 items-center justify-center ${
              isLarge ? "size-6" : "size-4"
            }`}
          >
            <img
              alt="Menu"
              className={`block max-w-none ${isLarge ? "size-6" : "size-4"}`}
              src="/figmaAssets/chip/dots-three-vertical.svg"
              style={{ opacity: disabled ? 0.6 : 1 }}
            />
          </span>
        </>
      )}
    </div>
  );
}

type GroupProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
};

function Group({ title, description, children }: GroupProps) {
  return (
    <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
      <div className="mb-4">
        <h3 className="font-['DM_Sans',Helvetica] text-[16px] font-semibold text-[#13131a]">
          {title}
        </h3>
        {description && (
          <p className="mt-1 max-w-2xl font-['DM_Sans',Helvetica] text-[12px] leading-[18px] text-[#71718a]">
            {description}
          </p>
        )}
      </div>
      {children}
    </div>
  );
}

type CellProps = { caption: string; children: React.ReactNode };
function Cell({ caption, children }: CellProps) {
  return (
    <div className="flex flex-col items-start gap-1.5">
      <span className="text-[12px] text-[#a8a8b2]">{caption}</span>
      <div className="flex items-center">{children}</div>
    </div>
  );
}

const STATUSES: ChipStatus[] = [
  "All",
  "Danger",
  "Warning",
  "Info",
  "Success",
];

const NON_DISABLED_STATES: { state: ChipState; label: string }[] = [
  { state: "Default", label: "Default" },
  { state: "Default-Hover", label: "Default-Hover" },
  { state: "Selected", label: "Selected" },
  { state: "Selected-Hover", label: "Selected-Hover" },
];

export default function ChipPage(): JSX.Element {
  // Multi-select interactive demo
  const [multi, setMulti] = useState<Record<string, boolean>>({
    a: false,
    b: true,
    c: false,
  });
  // Single-select interactive demo
  const [single, setSingle] = useState<string>("b");

  const multiItems: { id: string; label: string; disabled?: boolean }[] = [
    { id: "a", label: "Unselected" },
    { id: "b", label: "Selected" },
    { id: "c", label: "Disabled", disabled: true },
  ];
  const singleItems: { id: string; label: string; disabled?: boolean }[] = [
    { id: "a", label: "Option A" },
    { id: "b", label: "Option B" },
    { id: "c", label: "Disabled", disabled: true },
  ];

  return (
    <section aria-label="Chip component variants" className="flex flex-col gap-6">
      {/* Large — all statuses, default state */}
      <Group
        title="Large — Default"
        description="Chips are components that allow users to make single or multiple selections from multiple items. Large size, 34px height."
      >
        <div className="flex flex-wrap gap-x-8 gap-y-5">
          {STATUSES.map((status) => (
            <Cell key={status} caption={status}>
              <Chip state="Default" size="Large" status={status} />
            </Cell>
          ))}
        </div>
      </Group>

      {/* Small — all statuses, default state */}
      <Group title="Small — Default" description="Small size, 24px height.">
        <div className="flex flex-wrap gap-x-8 gap-y-5">
          {STATUSES.map((status) => (
            <Cell key={status} caption={status}>
              <Chip state="Default" size="Small" status={status} />
            </Cell>
          ))}
        </div>
      </Group>

      {/* States — Large */}
      <Group
        title="States — Large"
        description="Default, Hover, Selected and Selected-Hover states. Status: danger."
      >
        <div className="flex flex-wrap gap-x-8 gap-y-5">
          {NON_DISABLED_STATES.map(({ state, label }) => (
            <Cell key={label} caption={label}>
              <Chip state={state} size="Large" status="Danger" />
            </Cell>
          ))}
          <Cell caption="Disabled">
            <Chip state="Disabled" size="Large" status="All" />
          </Cell>
        </div>
      </Group>

      {/* States — Small */}
      <Group
        title="States — Small"
        description="Default, Hover, Selected and Selected-Hover states. Status: danger."
      >
        <div className="flex flex-wrap gap-x-8 gap-y-5">
          {NON_DISABLED_STATES.map(({ state, label }) => (
            <Cell key={label} caption={label}>
              <Chip state={state} size="Small" status="Danger" />
            </Cell>
          ))}
          <Cell caption="Disabled">
            <Chip state="Disabled" size="Small" status="All" />
          </Cell>
        </div>
      </Group>

      {/* Chip with menu — Large */}
      <Group
        title="Chip with menu — Large"
        description="Both Chip versions maintain a 4px padding between the text content and the menu icon. Status: danger."
      >
        <div className="flex flex-wrap gap-x-8 gap-y-5">
          {NON_DISABLED_STATES.map(({ state, label }) => (
            <Cell key={label} caption={label}>
              <Chip state={state} size="Large" status="Danger" menu />
            </Cell>
          ))}
        </div>
      </Group>

      {/* Chip with menu — Small */}
      <Group title="Chip with menu — Small" description="Status: danger.">
        <div className="flex flex-wrap gap-x-8 gap-y-5">
          {NON_DISABLED_STATES.map(({ state, label }) => (
            <Cell key={label} caption={label}>
              <Chip state={state} size="Small" status="Danger" menu />
            </Cell>
          ))}
        </div>
      </Group>

      {/* Multi Select (interactive) */}
      <Group
        title="Multi Select"
        description="In multi-select scenarios chips toggle independently. Click to select."
      >
        <div className="flex flex-wrap gap-x-8 gap-y-5">
          {multiItems.map((item) => {
            const isSel = multi[item.id];
            const state: ChipState = item.disabled
              ? "Disabled"
              : isSel
                ? "Selected"
                : "Default";
            return (
              <div key={item.id} className="flex flex-col items-start gap-1.5">
                <span className="text-[12px] text-[#a8a8b2]">{item.label}</span>
                <button
                  type="button"
                  disabled={item.disabled}
                  onClick={() =>
                    setMulti((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                  }
                  className="cursor-pointer border-0 bg-transparent p-0 disabled:cursor-default"
                >
                  <Chip
                    state={state}
                    size="Large"
                    status={isSel && !item.disabled ? "Primary" : "All"}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </Group>

      {/* Single Select (interactive) */}
      <Group
        title="Single Select"
        description="In single-select scenarios only one chip may be selected at a time."
      >
        <div className="flex flex-wrap gap-x-8 gap-y-5">
          {singleItems.map((item) => {
            const isSel = single === item.id;
            const state: ChipState = item.disabled
              ? "Disabled"
              : isSel
                ? "Selected"
                : "Default";
            return (
              <div key={item.id} className="flex flex-col items-start gap-1.5">
                <span className="text-[12px] text-[#a8a8b2]">{item.label}</span>
                <button
                  type="button"
                  disabled={item.disabled}
                  onClick={() => setSingle(item.id)}
                  className="cursor-pointer border-0 bg-transparent p-0 disabled:cursor-default"
                >
                  <Chip
                    state={state}
                    size="Large"
                    status={isSel && !item.disabled ? "Primary" : "All"}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </Group>
    </section>
  );
}
