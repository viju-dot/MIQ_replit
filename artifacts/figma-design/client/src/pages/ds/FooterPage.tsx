import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

type ButtonSize = "medium" | "small";

function LinkButton({ label = "Link" }: { label?: string }) {
  return (
    <div className="flex items-center gap-1 rounded-[var(--radiuses-small,2px)] shrink-0">
      <p className="font-['DM_Sans:Medium',_Helvetica] font-medium leading-[var(--body-md-medium-line-height,20px)] text-[length:var(--body-md-medium-size,14px)] text-[var(--surface-foreground-dynamic-brand-default,#7c33b5)] text-center whitespace-nowrap">
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
  const pad =
    size === "small"
      ? "px-[var(--spacing-75,6px)] py-[var(--spacing-container-s,2px)]"
      : "px-[var(--spacing-150,12px)] py-[var(--spacing-container-m,7px)]";
  return (
    <div
      className={`flex items-center justify-end gap-0 rounded-[var(--radiuses-small,2px)] border border-solid border-[var(--border-dynamic-neutral-bold-default,#4b4b59)] shrink-0 ${pad}`}
    >
      <div className="flex items-center justify-center gap-1 rounded-[var(--radiuses-small,2px)] shrink-0">
        <p className="font-['DM_Sans:Medium',_Helvetica] font-medium leading-[var(--body-md-medium-line-height,20px)] text-[length:var(--body-md-medium-size,14px)] text-[var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)] text-center whitespace-nowrap">
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
  const pad =
    size === "small"
      ? "px-[var(--spacing-75,6px)] py-[var(--spacing-container-s,2px)]"
      : "px-[var(--spacing-150,12px)] py-[var(--spacing-container-m,7px)]";
  return (
    <div
      className={`flex items-center justify-end gap-0 rounded-[var(--radiuses-small,2px)] bg-[var(--container-dynamic-brand-bold-background-default,#7c33b5)] shrink-0 ${pad}`}
    >
      <div className="flex items-center justify-center gap-1 rounded-[var(--radiuses-small,2px)] shrink-0">
        <p className="font-['DM_Sans:Medium',_Helvetica] font-medium leading-[var(--body-md-medium-line-height,20px)] text-[length:var(--body-md-medium-size,14px)] text-[var(--container-dynamic-brand-bold-foreground-default,#ffffff)] text-center whitespace-nowrap">
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
      className="flex flex-wrap items-center justify-between content-center relative w-full min-h-[66px] bg-[var(--surface-background-lvl1,#ffffff)]"
      style={{
        filter:
          "drop-shadow(0px -1px 2px var(--shadow-lvl12, rgba(113,113,128,0.12))) drop-shadow(0px -8px 8px var(--shadow-lvl8, rgba(113,113,128,0.08)))",
      }}
    >
      {actionsLeft && (
        <div className="flex flex-1 min-w-px items-center gap-[var(--spacing-200,16px)] px-[var(--spacing-200,16px)] py-[var(--spacing-200,16px)] relative">
          <LinkButton />
          <OutlineButton />
          <BrandButton label={primaryLabel} />
        </div>
      )}
      {actionsRight && (
        <div className="flex flex-1 min-w-px items-center justify-end gap-[var(--spacing-200,16px)] px-[var(--spacing-200,16px)] py-[var(--spacing-200,16px)] relative">
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
      className={`flex flex-wrap items-center justify-between p-[var(--spacing-200,16px)] relative w-full ${minH} bg-[var(--surface-background-lvl2,#f7f7fa)]`}
    >
      {actionsLeft && (
        <div className="flex flex-1 min-w-px items-center gap-[var(--spacing-200,16px)] relative">
          <LinkButton />
          <OutlineButton size={btnSize} />
          <BrandButton size={btnSize} label={primaryLabel} />
        </div>
      )}
      {actionsRight && (
        <div className="flex flex-1 min-w-px items-center justify-end gap-[var(--spacing-200,16px)] relative">
          <LinkButton />
          <BrandButton size={btnSize} label={primaryLabel} />
        </div>
      )}
    </div>
  );
}

const pageConfig: PlaygroundConfig = {
  name: "Footer — Page",
  scopeId: "footer/footer-page",
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
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "container/dynamic/brand/bold/background/default":
      "var(--container-dynamic-brand-bold-background-default)",
    "container/dynamic/brand/bold/foreground/default":
      "var(--container-dynamic-brand-bold-foreground-default)",
    "surface/foreground/dynamic/brand/default":
      "var(--surface-foreground-dynamic-brand-default)",
    "container/dynamic/neutral/subtle/foreground/default/regular":
      "var(--container-dynamic-neutral-subtle-foreground-default-regular)",
    "border/dynamic/neutral/bold/default":
      "var(--border-dynamic-neutral-bold-default)",
    "Radiuses/small": "var(--radiuses-small)",
    "spacing/200": "var(--spacing-200)",
    "spacing/150": "var(--spacing-150)",
    "spacing/container/m": "var(--spacing-container-m)",
    "shadow/lvl12": "var(--shadow-lvl12)",
    "shadow/lvl8": "var(--shadow-lvl8)",
  },
};

const modalConfig: PlaygroundConfig = {
  name: "Footer — Modal",
  scopeId: "footer/footer-modal",
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
    "surface/background/lvl2": "var(--surface-background-lvl2)",
    "container/dynamic/brand/bold/background/default":
      "var(--container-dynamic-brand-bold-background-default)",
    "container/dynamic/brand/bold/foreground/default":
      "var(--container-dynamic-brand-bold-foreground-default)",
    "surface/foreground/dynamic/brand/default":
      "var(--surface-foreground-dynamic-brand-default)",
    "container/dynamic/neutral/subtle/foreground/default/regular":
      "var(--container-dynamic-neutral-subtle-foreground-default-regular)",
    "border/dynamic/neutral/bold/default":
      "var(--border-dynamic-neutral-bold-default)",
    "Radiuses/small": "var(--radiuses-small)",
    "spacing/200": "var(--spacing-200)",
    "spacing/150": "var(--spacing-150)",
    "spacing/container/m": "var(--spacing-container-m)",
    "spacing/75": "var(--spacing-75)",
    "spacing/container/s": "var(--spacing-container-s)",
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
