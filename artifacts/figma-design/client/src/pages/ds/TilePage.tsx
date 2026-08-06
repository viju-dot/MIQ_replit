import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

const ASSET = {
  television: "/figmaAssets/tile/television-default.svg",
  info: "/figmaAssets/tile/info.svg",
  buttonIcon: "/figmaAssets/tile/button-icon.svg",
  check: "/figmaAssets/tile/check.svg",
  tvCompactDefault: "/figmaAssets/tile/television-compact-default.svg",
  tvCompactHover: "/figmaAssets/tile/television-compact-hover.svg",
  tvCompactSelected: "/figmaAssets/tile/television-compact-selected.svg",
  tvCompactDisabled: "/figmaAssets/tile/television-compact-disabled.svg",
} as const;

type State = "Default" | "Hover" | "Selected" | "Disabled";

/* ------------------------------------------------------------------ */
/* Static / Compact tile                                               */
/* ------------------------------------------------------------------ */
function StaticCompactTile({
  heading = "Place holder",
  description = false,
  descriptionText = "Placeholder text",
}: {
  heading?: string;
  description?: boolean;
  descriptionText?: string;
}) {
  return (
    <div className="flex w-[363px] max-w-full min-w-[240px] flex-col items-start justify-center overflow-clip rounded-[var(--radius-25,2px)] border border-solid border-[var(--border-static-subtle-neutral,#e1e1e8)] bg-[var(--surface-background-lvl1,#ffffff)] px-2 py-1.5">
      <div className="flex h-[34px] w-full items-center gap-2">
        <div className="flex min-w-px flex-1 items-center gap-1">
          <div className="flex size-[20px] shrink-0 items-center justify-center overflow-clip">
            <img alt="" className="block size-full max-w-none" src={ASSET.television} />
          </div>
          <div className="flex min-w-px flex-1 flex-col items-start justify-center">
            <div className="flex h-[20px] w-full flex-col justify-center overflow-hidden text-ellipsis whitespace-nowrap font-['DM_Sans'] text-[length:var(--body-md-medium-size,14px)] font-medium leading-[var(--body-md-medium-line-height,20px)] text-[var(--surface-foreground-static-neutral-lvl2,#282833)] [word-break:break-word]">
              <p className="overflow-hidden text-ellipsis leading-[var(--body-md-medium-line-height,20px)]">{heading}</p>
            </div>
          </div>
        </div>
        <div className="flex shrink-0 items-center justify-end gap-2">
          <div className="flex size-[20px] shrink-0 items-center justify-center">
            <img alt="" className="block size-full max-w-none" src={ASSET.info} />
          </div>
          <div className="flex shrink-0 items-center justify-center rounded-[var(--radius-25,2px)] border border-solid border-[var(--border-dynamic-brand-default,#7c33b5)] p-[7px]">
            <div className="flex size-[20px] shrink-0 items-center justify-center overflow-clip p-[2px]">
              <div className="relative size-[15px] shrink-0">
                <img alt="" className="absolute inset-0 block size-full max-w-none" src={ASSET.buttonIcon} />
              </div>
            </div>
          </div>
        </div>
      </div>
      {description && (
        <div className="flex w-full items-center gap-[10px]">
          <div className="flex h-full w-[120px] flex-col justify-center overflow-hidden text-ellipsis whitespace-nowrap font-['DM_Sans'] text-[length:var(--body-md-regular-size,14px)] font-normal leading-[var(--body-md-regular-line-height,20px)] text-[var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)] [word-break:break-word]">
            <p className="overflow-hidden text-ellipsis leading-[var(--body-md-regular-line-height,20px)]">{descriptionText}</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dynamic / Standard tile (checkbox + title + description)            */
/* ------------------------------------------------------------------ */
const standardStyles: Record<State, { container: string; title: string; desc: string }> = {
  Default: {
    container:
      "border-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)] bg-[var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)]",
    title: "text-[var(--container-dynamic-neutral-subtle-foreground-default-variation,#13131a)]",
    desc: "text-[var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)]",
  },
  Hover: {
    container:
      "border-[var(--border-dynamic-neutral-subtle-hover,#a8a8b2)] bg-[var(--container-dynamic-neutral-subtle-background-hover,rgba(113,113,128,0.08))]",
    title: "text-[var(--container-dynamic-neutral-subtle-foreground-default-variation,#13131a)]",
    desc: "text-[var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)]",
  },
  Selected: {
    container:
      "border-[var(--border-dynamic-brand-selected,#7c33b5)] bg-[var(--container-dynamic-brand-subtle-background-selected,#f6ebff)]",
    title: "text-[var(--container-dynamic-brand-subtle-foreground-delected,#7c33b5)]",
    desc: "text-[var(--container-dynamic-brand-subtle-foreground-delected,#7c33b5)]",
  },
  Disabled: {
    container:
      "border-[var(--border-dynamic-neutral-subtle-disabled,#e1e1e8)] bg-[var(--container-dynamic-neutral-subtle-background-disabled,rgba(113,113,128,0.1))]",
    title: "text-[var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)]",
    desc: "text-[var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)]",
  },
};

function StandardCheckbox({ state }: { state: State }) {
  if (state === "Selected") {
    return (
      <div className="flex shrink-0 items-center justify-center overflow-clip rounded-[var(--radius-25,2px)] p-[2px]">
        <div className="flex shrink-0 items-center overflow-clip p-[2px]">
          <div className="relative size-[16px] shrink-0 overflow-clip rounded-[var(--radius-25,2px)] bg-[var(--controls-background-selected,#7c33b5)]">
            <div className="absolute left-0 top-0 flex size-[16px] flex-col items-center justify-center overflow-clip px-px py-[3px]">
              <div className="relative h-[9.001px] w-[12.501px] shrink-0">
                <img alt="" className="absolute inset-0 block size-full max-w-none" src={ASSET.check} />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  const borderColor =
    state === "Disabled"
      ? "border-[var(--border-dynamic-neutral-subtle-disabled,#e1e1e8)]"
      : "border-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)]";
  return (
    <div className="flex shrink-0 items-center justify-center overflow-clip rounded-[var(--radius-25,2px)] p-[2px]">
      <div className="flex shrink-0 items-center overflow-clip p-[2px]">
        <div
          className={`size-[16px] shrink-0 overflow-clip rounded-[var(--radius-25,2px)] border-[1.5px] border-solid ${borderColor}`}
        />
      </div>
    </div>
  );
}

function DynamicStandardTile({
  state,
  title = "Title of selection",
  description = "Descriptive text for selection",
}: {
  state: State;
  title?: string;
  description?: string;
}) {
  const s = standardStyles[state];
  return (
    <div
      className={`flex w-[363px] max-w-full min-w-[180px] flex-col items-start gap-2 overflow-clip rounded-[var(--radius-25,2px)] border border-solid p-4 ${s.container}`}
    >
      {/* Header and actions */}
      <div className="flex w-full items-center gap-2">
        <div className="relative size-[24px] shrink-0">
          <div className="absolute left-0 top-1/2 size-[24px] -translate-y-1/2">
            <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-1">
              <StandardCheckbox state={state} />
            </div>
          </div>
        </div>
        <div className="flex min-w-px flex-1 flex-col items-start justify-center gap-[10px]">
          <div
            className={`flex w-full flex-col justify-center overflow-hidden text-ellipsis whitespace-nowrap font-['DM_Sans'] text-[length:var(--body-md-medium-size,14px)] font-medium leading-[0] [word-break:break-word] ${s.title}`}
          >
            <p className="overflow-hidden text-ellipsis leading-[var(--body-md-medium-line-height,20px)]">{title}</p>
          </div>
        </div>
      </div>
      {/* Description */}
      <div className="flex w-full flex-wrap content-start items-start">
        <div className="flex min-w-px flex-1 items-center">
          <p
            className={`min-w-px flex-1 font-['DM_Sans'] text-[length:var(--body-md-regular-size,14px)] font-normal leading-[var(--body-md-regular-line-height,20px)] [word-break:break-word] ${s.desc}`}
          >
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dynamic / Compact tile (icon + CTV label)                           */
/* ------------------------------------------------------------------ */
const compactStyles: Record<State, { container: string; text: string; icon: string }> = {
  Default: {
    container:
      "border-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)] bg-[var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)]",
    text: "text-[var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)]",
    icon: ASSET.tvCompactDefault,
  },
  Hover: {
    container:
      "border-[var(--border-dynamic-neutral-subtle-hover,#a8a8b2)] bg-[var(--container-dynamic-neutral-subtle-background-hover,rgba(113,113,128,0.08))]",
    text: "text-[var(--container-dynamic-neutral-subtle-foreground-default-variation,#13131a)]",
    icon: ASSET.tvCompactHover,
  },
  Selected: {
    container:
      "border-[var(--border-dynamic-brand-selected,#7c33b5)] bg-[var(--container-dynamic-brand-subtle-background-selected,#f6ebff)]",
    text: "text-[var(--container-dynamic-brand-subtle-foreground-delected,#7c33b5)]",
    icon: ASSET.tvCompactSelected,
  },
  Disabled: {
    container:
      "border-[var(--border-dynamic-neutral-subtle-disabled,#e1e1e8)] bg-[var(--container-dynamic-neutral-subtle-background-disabled,rgba(113,113,128,0.1))]",
    text: "text-[var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)]",
    icon: ASSET.tvCompactDisabled,
  },
};

function DynamicCompactTile({ state, label = "CTV" }: { state: State; label?: string }) {
  const s = compactStyles[state];
  return (
    <div
      className={`flex flex-col items-center justify-center overflow-clip rounded-[var(--radius-25,2px)] border border-solid px-6 py-3 ${s.container}`}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="flex size-[20px] shrink-0 items-center justify-center overflow-clip">
          <div className="relative size-[20px] shrink-0">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={s.icon} />
          </div>
        </div>
        <div className="flex items-center justify-center py-px">
          <div
            className={`flex flex-col justify-center overflow-hidden text-ellipsis whitespace-nowrap text-center font-['DM_Sans'] text-[length:var(--body-sm-medium-size,12px)] font-medium leading-[0] [word-break:break-word] ${s.text}`}
          >
            <p className="overflow-hidden text-ellipsis leading-[var(--body-sm-medium-line-height,18px)]">{label}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Dynamic / Mini tile (icon only)                                     */
/* ------------------------------------------------------------------ */
function DynamicMiniTile({ state }: { state: State }) {
  const s = compactStyles[state];
  return (
    <div
      className={`flex flex-col items-center justify-center overflow-clip rounded-[var(--radius-25,2px)] border border-solid p-[7px] ${s.container}`}
    >
      <div className="flex flex-col items-center justify-center">
        <div className="flex size-[20px] shrink-0 items-center justify-center overflow-clip">
          <div className="relative size-[20px] shrink-0">
            <img alt="" className="absolute inset-0 block size-full max-w-none" src={s.icon} />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Playground configs                                                  */
/* ------------------------------------------------------------------ */
const STATE_OPTIONS = ["Default", "Hover", "Selected", "Disabled"];

const commonTokens = {
  "controls/background/selected": "var(--controls-background-selected)",
  "container/dynamic/brand/subtle/background/selected": "var(--container-dynamic-brand-subtle-background-selected)",
  "container/dynamic/brand/subtle/foreground/delected": "var(--container-dynamic-brand-subtle-foreground-delected)",
  "container/dynamic/neutral/subtle/background/default/regular":
    "var(--container-dynamic-neutral-subtle-background-default-regular)",
  "container/dynamic/neutral/subtle/background/hover": "var(--container-dynamic-neutral-subtle-background-hover)",
  "container/dynamic/neutral/subtle/background/disabled": "var(--container-dynamic-neutral-subtle-background-disabled)",
  "container/dynamic/neutral/subtle/foreground/default/regular":
    "var(--container-dynamic-neutral-subtle-foreground-default-regular)",
  "container/dynamic/neutral/subtle/foreground/default/variation":
    "var(--container-dynamic-neutral-subtle-foreground-default-variation)",
  "container/dynamic/neutral/subtle/foreground/disabled": "var(--container-dynamic-neutral-subtle-foreground-disabled)",
  "border/dynamic/neutral/subtle/default": "var(--border-dynamic-neutral-subtle-default)",
  "border/dynamic/neutral/subtle/hover": "var(--border-dynamic-neutral-subtle-hover)",
  "border/dynamic/neutral/subtle/disabled": "var(--border-dynamic-neutral-subtle-disabled)",
  "border/dynamic/brand/selected": "var(--border-dynamic-brand-selected)",
  "radius/25": "var(--radius-25)",
  "Body Md/Medium": "var(--body-md-medium-size)",
  "Body Md/Regular": "var(--body-md-regular-size)",
  "Body Sm/Medium": "var(--body-sm-medium-size)",
};

const staticCompactConfig: PlaygroundConfig = {
  name: "Tile — Static / Compact",
  description: "Compact static tile with leading icon, info + action button, and optional description row.",
  controls: [
    { kind: "text", name: "heading", label: "Heading", defaultValue: "Place holder", placeholder: "Heading" },
    { kind: "boolean", name: "description", label: "Show description", defaultValue: false },
    {
      kind: "text",
      name: "descriptionText",
      label: "Description text",
      defaultValue: "Placeholder text",
      placeholder: "Description",
    },
  ],
  render: (props) => (
    <StaticCompactTile
      heading={String(props.heading)}
      description={props.description === true}
      descriptionText={String(props.descriptionText)}
    />
  ),
  tokens: {
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "border/dynamic/brand/default": "var(--border-dynamic-brand-default)",
    "surface/foreground/static/neutral/lvl2": "var(--surface-foreground-static-neutral-lvl2)",
    "container/dynamic/neutral/subtle/foreground/default/regular":
      "var(--container-dynamic-neutral-subtle-foreground-default-regular)",
    "radius/25": "var(--radius-25)",
    "Body Md/Medium": "var(--body-md-medium-size)",
    "Body Md/Regular": "var(--body-md-regular-size)",
  },
};

const dynamicStandardConfig: PlaygroundConfig = {
  name: "Tile — Dynamic / Standard",
  description: "Selectable tile with checkbox, title and description across interaction states.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: STATE_OPTIONS,
      defaultValue: "Default",
      asTabs: true,
    },
    {
      kind: "text",
      name: "title",
      label: "Title",
      defaultValue: "Title of selection",
      placeholder: "Title",
    },
    {
      kind: "text",
      name: "description",
      label: "Description",
      defaultValue: "Descriptive text for selection",
      placeholder: "Description",
    },
  ],
  render: (props) => (
    <DynamicStandardTile
      state={props.state as State}
      title={String(props.title)}
      description={String(props.description)}
    />
  ),
  tokens: commonTokens,
};

const dynamicCompactConfig: PlaygroundConfig = {
  name: "Tile — Dynamic / Compact",
  description: "Selectable compact tile with icon and label across interaction states.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: STATE_OPTIONS,
      defaultValue: "Default",
      asTabs: true,
    },
    { kind: "text", name: "label", label: "Label", defaultValue: "CTV", placeholder: "Label" },
  ],
  render: (props) => <DynamicCompactTile state={props.state as State} label={String(props.label)} />,
  tokens: commonTokens,
};

const dynamicMiniConfig: PlaygroundConfig = {
  name: "Tile — Dynamic / Mini",
  description: "Selectable icon-only tile across interaction states.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: STATE_OPTIONS,
      defaultValue: "Default",
      asTabs: true,
    },
  ],
  render: (props) => <DynamicMiniTile state={props.state as State} />,
  tokens: commonTokens,
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */
export default function TilePage() {
  return (
    <section className="flex flex-col gap-6 font-['DM_Sans']" aria-label="Tile component playground">
      <Playground config={staticCompactConfig} />
      <Playground config={dynamicStandardConfig} />
      <Playground config={dynamicCompactConfig} />
      <Playground config={dynamicMiniConfig} />
    </section>
  );
}
