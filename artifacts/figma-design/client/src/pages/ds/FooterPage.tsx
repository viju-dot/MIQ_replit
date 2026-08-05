import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

type ButtonSize = "medium" | "small";

function LinkButton({ label = "Link" }: { label?: string }) {
  return (
    <div className="flex items-center gap-1 rounded-[2px] shrink-0">
      <p className="font-['DM_Sans:Medium',_Helvetica] font-medium leading-[20px] text-[14px] text-[#7c33b5] text-center whitespace-nowrap">
        {label}
      </p>
    </div>
  );
}

function OutlineButton({
  size = "medium",
  label = "Default",
}: {
  size?: ButtonSize;
  label?: string;
}) {
  const pad = size === "small" ? "px-[6px] py-[2px]" : "px-[12px] py-[7px]";
  return (
    <div
      className={`flex items-center justify-end gap-0 rounded-[2px] border border-solid border-[#4b4b59] shrink-0 ${pad}`}
    >
      <div className="flex items-center justify-center gap-1 rounded-[2px] shrink-0">
        <p className="font-['DM_Sans:Medium',_Helvetica] font-medium leading-[20px] text-[14px] text-[#4b4b59] text-center whitespace-nowrap">
          {label}
        </p>
      </div>
    </div>
  );
}

function BrandButton({
  size = "medium",
  label = "Default",
}: {
  size?: ButtonSize;
  label?: string;
}) {
  const pad = size === "small" ? "px-[6px] py-[2px]" : "px-[12px] py-[7px]";
  return (
    <div
      className={`flex items-center justify-end gap-0 rounded-[2px] bg-[#7c33b5] shrink-0 ${pad}`}
    >
      <div className="flex items-center justify-center gap-1 rounded-[2px] shrink-0">
        <p className="font-['DM_Sans:Medium',_Helvetica] font-medium leading-[20px] text-[14px] text-white text-center whitespace-nowrap">
          {label}
        </p>
      </div>
    </div>
  );
}

/** Footer - Page (Type=Default): ActionsLeft / ActionsRight axes */
function FooterPageBar({
  actionsLeft = false,
  actionsRight = true,
  primaryLabel = "Default",
}: {
  actionsLeft?: boolean;
  actionsRight?: boolean;
  primaryLabel?: string;
}) {
  return (
    <div
      className="flex flex-wrap items-center justify-between content-center relative w-full min-h-[66px] bg-white"
      style={{
        filter:
          "drop-shadow(0px -1px 2px rgba(113,113,128,0.12)) drop-shadow(0px -8px 8px rgba(113,113,128,0.08))",
      }}
    >
      {actionsLeft && (
        <div className="flex flex-1 min-w-px items-center gap-4 px-4 py-4 relative">
          <LinkButton />
          <OutlineButton />
          <BrandButton label={primaryLabel} />
        </div>
      )}
      {actionsRight && (
        <div className="flex flex-1 min-w-px items-center justify-end gap-4 px-4 py-4 relative">
          <LinkButton />
          <OutlineButton />
          <BrandButton label={primaryLabel} />
        </div>
      )}
    </div>
  );
}

/** Footer - Modal (IsCompact=No | Yes) with ActionsLeft / ActionsRight axes */
function FooterModal({
  compact = false,
  actionsLeft = false,
  actionsRight = true,
  primaryLabel = "Default",
}: {
  compact?: boolean;
  actionsLeft?: boolean;
  actionsRight?: boolean;
  primaryLabel?: string;
}) {
  const btnSize: ButtonSize = compact ? "small" : "medium";
  const minH = compact ? "min-h-[56px]" : "min-h-[66px]";
  return (
    <div
      className={`flex flex-wrap items-center justify-between p-4 relative w-full ${minH} bg-[#f7f7fa]`}
    >
      {actionsLeft && (
        <div className="flex flex-1 min-w-px items-center gap-4 relative">
          <LinkButton />
          <OutlineButton size={btnSize} />
          <BrandButton size={btnSize} label={primaryLabel} />
        </div>
      )}
      {actionsRight && (
        <div className="flex flex-1 min-w-px items-center justify-end gap-4 relative">
          <LinkButton />
          <BrandButton size={btnSize} label={primaryLabel} />
        </div>
      )}
    </div>
  );
}

const pageConfig: PlaygroundConfig = {
  name: "Footer — Page",
  description:
    "Page footer bar (Type=Default). Toggle the left / right action groups.",
  controls: [
    {
      kind: "boolean",
      name: "actionsLeft",
      label: "Actions Left",
      defaultValue: false,
    },
    {
      kind: "boolean",
      name: "actionsRight",
      label: "Actions Right",
      defaultValue: true,
    },
    {
      kind: "text",
      name: "primaryLabel",
      label: "Primary Button",
      defaultValue: "Default",
      placeholder: "Button label",
    },
  ],
  render: (props) => (
    <div className="w-full max-w-[720px]">
      <FooterPageBar
        actionsLeft={props.actionsLeft === true}
        actionsRight={props.actionsRight === true}
        primaryLabel={String(props.primaryLabel ?? "Default")}
      />
    </div>
  ),
  tokens: {
    "container/background": "#ffffff",
    "container/brand/bold/background": "#7c33b5",
    "text/brand": "#7c33b5",
    "text/neutral/strong": "#4b4b59",
    "border/neutral": "#4b4b59",
    "radius/button": "2px",
    "spacing/gap": "16px",
    "spacing/padding": "16px",
    "size/min-height": "66px",
    "shadow/top": "0px -1px 2px rgba(113,113,128,0.12), 0px -8px 8px rgba(113,113,128,0.08)",
  },
};

const modalConfig: PlaygroundConfig = {
  name: "Footer — Modal",
  description:
    "Modal footer. Compact reduces height and shrinks button padding.",
  controls: [
    {
      kind: "select",
      name: "compact",
      label: "Is Compact",
      options: ["No", "Yes"],
      defaultValue: "No",
      asTabs: true,
    },
    {
      kind: "boolean",
      name: "actionsLeft",
      label: "Actions Left",
      defaultValue: false,
    },
    {
      kind: "boolean",
      name: "actionsRight",
      label: "Actions Right",
      defaultValue: true,
    },
    {
      kind: "text",
      name: "primaryLabel",
      label: "Primary Button",
      defaultValue: "Default",
      placeholder: "Button label",
    },
  ],
  render: (props) => (
    <div className="w-full max-w-[720px]">
      <FooterModal
        compact={props.compact === "Yes"}
        actionsLeft={props.actionsLeft === true}
        actionsRight={props.actionsRight === true}
        primaryLabel={String(props.primaryLabel ?? "Default")}
      />
    </div>
  ),
  tokens: {
    "container/background": "#f7f7fa",
    "container/brand/bold/background": "#7c33b5",
    "text/brand": "#7c33b5",
    "text/neutral/strong": "#4b4b59",
    "border/neutral": "#4b4b59",
    "radius/button": "2px",
    "spacing/gap": "16px",
    "spacing/padding": "16px",
    "size/min-height/default": "66px",
    "size/min-height/compact": "56px",
  },
};

export default function FooterPage(): JSX.Element {
  return (
    <section aria-label="Footer component playground" className="flex flex-col gap-6">
      <Playground config={pageConfig} />
      <Playground config={modalConfig} />
    </section>
  );
}
