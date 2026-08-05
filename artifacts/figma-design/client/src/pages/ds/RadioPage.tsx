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
  dark,
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
      <div className="relative size-[24px]">
        <div className="absolute left-0 size-[24px] top-0">
          <img
            alt=""
            className="absolute block inset-0 max-w-none size-full"
            src={src}
          />
        </div>
      </div>
    );
  }

  const enabledText = dark ? "text-[#f7f7fa]" : "text-[#13131a]";

  return (
    <div className="flex gap-[4px] items-center">
      <div className="relative shrink-0 size-[24px]">
        <div className="absolute left-0 size-[24px] top-0">
          <img
            alt=""
            className="absolute block inset-0 max-w-none size-full"
            src={src}
          />
        </div>
      </div>
      <div
        className={`flex flex-col justify-center leading-[0] not-italic relative shrink-0 text-[14px] whitespace-nowrap ${
          disabled ? "text-[#a8a8b2]" : enabledText
        }`}
        style={{ fontFamily: '"DM Sans", Helvetica', fontWeight: 400 }}
      >
        <p className="leading-[20px]">{labelText || "Option"}</p>
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
    "label/default": "#13131a",
    "label/disabled": "#a8a8b2",
    "size/control": "24px",
    "gap/label": "4px",
    "type/label": "14px / 20px",
    "font/family": "DM Sans",
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
  const titleColor = dark ? "text-[#f7f7fa]" : "text-[#13131a]";
  const options = [0, 1, 2];
  return (
    <div className="flex flex-col gap-[6px] items-start">
      <p
        className={`leading-[20px] not-italic relative shrink-0 text-[14px] ${titleColor} whitespace-nowrap`}
        style={{ fontFamily: '"DM Sans", Helvetica', fontWeight: 400 }}
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
    "title/color": "#13131a",
    "gap/options": "6px",
    "type/title": "14px / 20px",
    "font/family": "DM Sans",
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
      style={{ fontFamily: '"DM Sans", Helvetica' }}
    >
      <Playground config={radioConfig} />
      <Playground config={groupConfig} />
    </section>
  );
}
