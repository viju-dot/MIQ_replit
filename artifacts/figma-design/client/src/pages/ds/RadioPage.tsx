import { useState } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

const ASSET = "/figmaAssets/radio";

const imgSelected = `${ASSET}/selected.svg`;
const imgSelectedDisabled = `${ASSET}/selected-disabled.svg`;
const imgUnselected = `${ASSET}/unselected.svg`;
const imgUnselectedDisabled = `${ASSET}/unselected-disabled.svg`;
const imgUnselectedDisabledLabel = `${ASSET}/unselected-disabled2.svg`;

function radioSrc(selected: boolean, disabled: boolean, label: boolean): string {
  if (selected) {
    return disabled ? imgSelectedDisabled : imgSelected;
  }
  // unselected
  if (disabled) {
    return label ? imgUnselectedDisabledLabel : imgUnselectedDisabled;
  }
  return imgUnselected;
}

function Radio({
  selected,
  label,
  labelText,
  disabled,
  dark: _dark,
}: {
  selected: boolean;
  label: boolean;
  labelText: string;
  disabled: boolean;
  dark: boolean;
}): JSX.Element {
  const src = radioSrc(selected, disabled, label);

  if (!label) {
    return (
      <div className="relative size-[var(--sizing-lg,24px)]">
        <div className="absolute left-0 size-[var(--sizing-lg,24px)] top-0">
          <img
            alt=""
            className="absolute block inset-0 max-w-none size-full"
            src={src}
          />
        </div>
      </div>
    );
  }

  const enabledText =
    "text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]";

  return (
    <div className="flex gap-[var(--numbers-4,4px)] items-center">
      <div className="relative shrink-0 size-[var(--sizing-lg,24px)]">
        <div className="absolute left-0 size-[var(--sizing-lg,24px)] top-0">
          <img
            alt=""
            className="absolute block inset-0 max-w-none size-full"
            src={src}
          />
        </div>
      </div>
      <div
        className={`flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-[length:var(--body-md-regular-size,14px)] whitespace-nowrap ${
          disabled
            ? "text-[var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)]"
            : enabledText
        }`}
        style={{
          fontFamily: 'var(--body-md-regular-family, "DM Sans", Helvetica)',
          fontWeight: "var(--body-md-regular-weight, 400)",
        }}
      >
        <p className="leading-[var(--body-md-regular-line-height,20px)]">
          {labelText || "Option"}
        </p>
      </div>
    </div>
  );
}

const radioConfig: PlaygroundConfig = {
  name: "Radio",
  description:
    "Single-select control — Selected / Unselected states, optional label with editable text, and disabled variants.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Selected", "Unselected"],
      defaultValue: "Selected",
      asTabs: true,
    },
    { kind: "boolean", name: "label", label: "Label", defaultValue: true },
    {
      kind: "text",
      name: "labelText",
      label: "Label text",
      defaultValue: "Option",
      placeholder: "Option",
    },
    { kind: "boolean", name: "disabled", label: "Disabled", defaultValue: false },
  ],
  render: (props, theme) => (
    <Radio
      selected={props.state === "Selected"}
      label={props.label === true}
      labelText={String(props.labelText ?? "")}
      disabled={props.disabled === true}
      dark={theme === "dark"}
    />
  ),
  tokens: {
    "surface/foreground/static/neutral/lvl1":
      "var(--surface-foreground-static-neutral-lvl1)",
    "surface/foreground/dynamic/neutral/disabled":
      "var(--surface-foreground-dynamic-neutral-disabled)",
    "sizing/lg": "var(--sizing-lg)",
    "numbers/4": "var(--numbers-4)",
    "Body Md/Regular": "var(--body-md-regular-size)",
  },
};

function RadioGroup({
  labelText,
  selectedIndex,
  onSelect,
  dark,
}: {
  labelText: string;
  selectedIndex: number;
  onSelect: (i: number) => void;
  dark: boolean;
}): JSX.Element {
  const titleColor =
    "text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]";
  const options = [0, 1, 2];
  return (
    <div className="flex flex-col gap-[var(--numbers-6,6px)] items-start">
      <p
        className={`leading-[var(--body-md-regular-line-height,20px)] not-italic relative shrink-0 text-[length:var(--body-md-regular-size,14px)] ${titleColor} whitespace-nowrap`}
        style={{
          fontFamily: 'var(--body-md-regular-family, "DM Sans", Helvetica)',
          fontWeight: "var(--body-md-regular-weight, 400)",
        }}
      >
        {labelText || "Radio group title:"}
      </p>
      {options.map((i) => (
        <button
          key={i}
          type="button"
          onClick={() => onSelect(i)}
          className="cursor-pointer bg-transparent p-0 border-0"
        >
          <Radio
            selected={selectedIndex === i}
            label
            labelText="Option"
            disabled={false}
            dark={dark}
          />
        </button>
      ))}
    </div>
  );
}

// Local interactive state for the group preview lives here so the
// group selection is clickable while remaining Figma-faithful.
let groupSelected = 0;

const groupConfig: PlaygroundConfig = {
  name: "Radio group",
  description: "A titled set of radios where only one option can be selected at a time.",
  controls: [
    {
      kind: "text",
      name: "title",
      label: "Group title",
      defaultValue: "Radio group title:",
      placeholder: "Radio group title:",
    },
  ],
  render: (props, theme) => (
    <GroupPreview
      title={String(props.title ?? "")}
      dark={theme === "dark"}
    />
  ),
  tokens: {
    "surface/foreground/static/neutral/lvl1":
      "var(--surface-foreground-static-neutral-lvl1)",
    "numbers/6": "var(--numbers-6)",
    "Body Md/Regular": "var(--body-md-regular-size)",
  },
};

function GroupPreview({ title, dark }: { title: string; dark: boolean }): JSX.Element {
  // Uses the module-level selection index; re-render is triggered by the
  // parent Playground controls, and clicking updates via a small forced state.
  const [, setTick] = useState(0);
  return (
    <RadioGroup
      labelText={title}
      selectedIndex={groupSelected}
      onSelect={(i) => {
        groupSelected = i;
        setTick((t) => t + 1);
      }}
      dark={dark}
    />
  );
}

export default function RadioPage(): JSX.Element {
  return (
    <section
      aria-label="Radio component playground"
      className="flex flex-col gap-6"
      style={{ fontFamily: 'var(--body-md-regular-family, "DM Sans", Helvetica)' }}
    >
      <Playground config={radioConfig} />
      <Playground config={groupConfig} />
    </section>
  );
}
