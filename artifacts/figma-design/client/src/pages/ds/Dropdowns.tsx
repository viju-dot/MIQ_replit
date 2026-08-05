import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

type DropdownState = "Default" | "Hover" | "Selected" | "Disabled" | "Selected Disabled" | "Loading";

/** Exact Figma per-state styling (background + text color). */
const STATE_STYLES: Record<
  DropdownState,
  { backgroundClass?: string; textClass?: string }
> = {
  Default: { textClass: "text-[#13131a]" },
  Hover: { backgroundClass: "bg-[#71718014]", textClass: "text-[#13131a]" },
  Selected: { backgroundClass: "bg-[#f6ebff]", textClass: "text-[#7c33b5]" },
  Disabled: { textClass: "text-[#a8a8b2]" },
  "Selected Disabled": { backgroundClass: "bg-[#7171801a]", textClass: "text-[#a8a8b2]" },
  Loading: { backgroundClass: "bg-[#7171801a]", textClass: "text-[#a8a8b2]" },
};

function FiberDropdownRow({
  state,
  hasCheckbox,
  checked,
  hasCaret,
  label,
}: {
  state: DropdownState;
  hasCheckbox: boolean;
  checked: boolean;
  hasCaret: boolean;
  label: string;
}): JSX.Element {
  const [localChecked, setLocalChecked] = useState(checked);
  const isDisabled = state === "Disabled" || state === "Selected Disabled";
  const style = STATE_STYLES[state];

  // Loading state renders the dedicated loading row (exact Figma).
  if (state === "Loading") {
    return (
      <article className="flex w-full max-w-[276px] items-center gap-2 border-b border-[#e1e1e8] bg-[#7171801a] px-3 py-2">
        <span className="flex h-6 items-center font-body-md-regular text-[length:var(--body-md-regular-font-size)] font-[number:var(--body-md-regular-font-weight)] leading-[var(--body-md-regular-line-height)] tracking-[var(--body-md-regular-letter-spacing)] text-[#a8a8b2]">
          Loading...
        </span>
      </article>
    );
  }

  return (
    <article
      className={`flex w-full max-w-[276px] items-center gap-2 border-b border-[#e1e1e8] px-3 py-2 ${
        hasCheckbox ? "pl-2" : ""
      } ${style.backgroundClass ?? ""}`}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="flex h-6 min-w-0 flex-1 items-center gap-1.5">
          {hasCheckbox && (
            <Checkbox
              id="dropdown-field"
              checked={isDisabled ? checked : localChecked}
              disabled={isDisabled}
              onCheckedChange={(value) => setLocalChecked(value === true)}
              aria-label="Field 1"
              className="h-4 w-4 shrink-0 rounded-sm border-[1.5px] border-[#c6c6cc] data-[state=checked]:border-[#7c33b5] data-[state=checked]:bg-[#7c33b5] disabled:border-[#c6c6cc] disabled:opacity-100 data-[state=checked]:disabled:border-transparent data-[state=checked]:disabled:bg-[#7171801a]"
            />
          )}
          <label
            htmlFor={hasCheckbox ? "dropdown-field" : undefined}
            className={`flex items-center whitespace-nowrap font-body-md-regular text-[length:var(--body-md-regular-font-size)] font-[number:var(--body-md-regular-font-weight)] leading-[var(--body-md-regular-line-height)] tracking-[var(--body-md-regular-letter-spacing)] ${
              style.textClass ?? "text-[#13131a]"
            }`}
          >
            {label || "Field 1"}
          </label>
        </div>
        {hasCaret && (
          <img
            className="h-6 w-6 shrink-0"
            alt="Icon caret"
            src="/figmaAssets/icon-caret.svg"
          />
        )}
      </div>
    </article>
  );
}

const config: PlaygroundConfig = {
  name: "Dropdown Row",
  description:
    "Selectable list-field row — supports checkbox, caret affordance and Default / Hover / Selected / Disabled / Loading states.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Default", "Hover", "Selected", "Disabled", "Selected Disabled", "Loading"],
      defaultValue: "Default",
      asTabs: true,
    },
    { kind: "boolean", name: "checkbox", label: "Checkbox", defaultValue: false },
    { kind: "boolean", name: "checked", label: "Checked", defaultValue: false },
    { kind: "boolean", name: "caret", label: "Caret", defaultValue: false },
    { kind: "text", name: "label", label: "Label", defaultValue: "Field 1", placeholder: "Field 1" },
  ],
  render: (props: PropValues) => {
    const state = props.state as DropdownState;
    const checked =
      state === "Selected" || state === "Selected Disabled"
        ? true
        : props.checked === true;
    return (
      <FiberDropdownRow
        key={`${state}-${String(props.checkbox)}-${String(checked)}`}
        state={state}
        hasCheckbox={props.checkbox === true}
        checked={checked}
        hasCaret={props.caret === true}
        label={String(props.label ?? "")}
      />
    );
  },
  tokens: {
    "container/hover/background": "#71718014",
    "container/selected/background": "#f6ebff",
    "container/disabled/background": "#7171801a",
    "content/selected/text": "#7c33b5",
    "content/default/text": "#13131a",
    "content/disabled/text": "#a8a8b2",
    "border/divider": "#e1e1e8",
    "checkbox/border": "#c6c6cc",
    "checkbox/checked": "#7c33b5",
    "spacing/row-padding": "12px / 8px",
    "size/max-width": "276px",
  },
};

export default function Dropdowns(): JSX.Element {
  return (
    <section aria-label="Dropdown component playground" className="flex flex-col gap-6">
      <Playground config={config} />
    </section>
  );
}
