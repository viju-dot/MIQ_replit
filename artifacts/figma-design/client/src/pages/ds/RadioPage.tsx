import { useEffect, useState } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

const ASSET = "/figmaAssets/radio";

// Focus ring via inline boxShadow (var() in Tailwind arbitrary ring classes
// silently fails in this project, so it is driven from focus-visible state).
const FOCUS_RING =
  "0 0 0 2px var(--surface-background-lvl1,#ffffff), 0 0 0 4px var(--border-dynamic-brand-selected,#7c33b5)";

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
  onSelect,
}: {
  selected: boolean;
  label: boolean;
  labelText: string;
  disabled: boolean;
  dark: boolean;
  onSelect?: () => void;
}): JSX.Element {
  const src = radioSrc(selected, disabled, label);
  const [focused, setFocused] = useState(false);

  const control = (
    <div className="relative shrink-0 size-[var(--sizing-lg,24px)]">
      <div className="absolute left-0 size-[var(--sizing-lg,24px)] top-0">
        <img
          alt=""
          className="absolute block inset-0 max-w-none size-full transition-opacity duration-150"
          src={src}
        />
      </div>
    </div>
  );

  if (!label) {
    // Interactive when a selection handler is supplied (its nature is to
    // select on click). Disabled suppresses the interaction.
    if (onSelect) {
      return (
        <button
          type="button"
          role="radio"
          aria-checked={selected}
          aria-disabled={disabled}
          disabled={disabled}
          onClick={() => !disabled && onSelect()}
          onFocus={(e) => setFocused(e.currentTarget.matches(":focus-visible"))}
          onBlur={() => setFocused(false)}
          className={`relative inline-flex border-0 bg-transparent p-0 outline-none rounded-full ${
            disabled ? "cursor-not-allowed" : "cursor-pointer"
          }`}
          style={focused && !disabled ? { boxShadow: FOCUS_RING } : undefined}
        >
          {control}
        </button>
      );
    }
    return <div className="relative size-[var(--sizing-lg,24px)]">{control}</div>;
  }

  const enabledText =
    "text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]";

  const body = (
    <>
      {control}
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
    </>
  );

  if (onSelect) {
    return (
      <button
        type="button"
        role="radio"
        aria-checked={selected}
        aria-disabled={disabled}
        disabled={disabled}
        onClick={() => !disabled && onSelect()}
        onFocus={(e) => setFocused(e.currentTarget.matches(":focus-visible"))}
        onBlur={() => setFocused(false)}
        className={`flex gap-[var(--numbers-4,4px)] items-center border-0 bg-transparent p-0 text-left outline-none rounded-[2px] ${
          disabled ? "cursor-not-allowed" : "cursor-pointer"
        }`}
        style={focused && !disabled ? { boxShadow: FOCUS_RING } : undefined}
      >
        {body}
      </button>
    );
  }

  return <div className="flex gap-[var(--numbers-4,4px)] items-center">{body}</div>;
}

// Interactive wrapper for the single-radio playground: clicking toggles the
// selection (its nature), while the panel "State" control seeds/re-syncs it.
function SingleRadioPreview({
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
  const [checked, setChecked] = useState(selected);
  useEffect(() => {
    setChecked(selected);
  }, [selected]);
  return (
    <Radio
      selected={!disabled && checked}
      label={label}
      labelText={labelText}
      disabled={disabled}
      dark={dark}
      onSelect={() => setChecked((c) => !c)}
    />
  );
}

const radioConfig: PlaygroundConfig = {
  name: "Radio",
  scopeId: "radio/radio",
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
    <SingleRadioPreview
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
    <div
      role="radiogroup"
      aria-label={labelText || "Radio group title:"}
      className="flex flex-col gap-[var(--numbers-6,6px)] items-start"
    >
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
        <RadioOption
          key={i}
          selected={selectedIndex === i}
          onSelect={() => onSelect(i)}
          dark={dark}
        />
      ))}
    </div>
  );
}

// One selectable option inside a radio group. The outer <button> is the single
// interactive element; the Radio it renders is non-interactive (no onSelect),
// so there are no nested interactive controls.
function RadioOption({
  selected,
  onSelect,
  dark,
}: {
  selected: boolean;
  onSelect: () => void;
  dark: boolean;
}): JSX.Element {
  const [focused, setFocused] = useState(false);
  return (
    <button
      type="button"
      role="radio"
      aria-checked={selected}
      onClick={onSelect}
      onFocus={(e) => setFocused(e.currentTarget.matches(":focus-visible"))}
      onBlur={() => setFocused(false)}
      className="cursor-pointer bg-transparent p-0 border-0 outline-none rounded-[2px]"
      style={focused ? { boxShadow: FOCUS_RING } : undefined}
    >
      <Radio selected={selected} label labelText="Option" disabled={false} dark={dark} />
    </button>
  );
}

// Local interactive state for the group preview lives here so the
// group selection is clickable while remaining Figma-faithful.
let groupSelected = 0;

const groupConfig: PlaygroundConfig = {
  name: "Radio group",
  scopeId: "radio/radio-group",
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
