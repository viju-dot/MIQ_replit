import { useState, type CSSProperties } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

type DropdownState = "Default" | "Hover" | "Selected" | "Disabled" | "Selected Disabled" | "Loading";

/**
 * Exact Figma per-state styling as inline style values (background + text color).
 * Tailwind arbitrary classes with var()/rgba are unreliable in this project, so
 * state-driven colors are applied via inline styles; var(--token, fallback)
 * preserves token fidelity.
 */
const STATE_STYLES: Record<
  DropdownState,
  { background?: string; color: string }
> = {
  Default: {
    color: "var(--container-dynamic-neutral-subtle-foreground-default-variation,#13131a)",
  },
  Hover: {
    background: "var(--container-dynamic-neutral-subtle-background-hover,rgba(113,113,128,0.08))",
    color: "var(--container-dynamic-neutral-subtle-foreground-hover,#13131a)",
  },
  Selected: {
    background: "var(--container-dynamic-brand-subtle-background-selected,#f6ebff)",
    color: "var(--container-dynamic-brand-subtle-foreground-delected,#7c33b5)",
  },
  Disabled: {
    color: "var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)",
  },
  "Selected Disabled": {
    background: "var(--container-dynamic-neutral-subtle-background-disabled,rgba(113,113,128,0.1))",
    color: "var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)",
  },
  Loading: {
    background: "var(--container-dynamic-neutral-subtle-background-disabled,rgba(113,113,128,0.1))",
    color: "var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)",
  },
};

/** Visual-only checkbox box (the whole row is the interactive control). */
function CheckboxBox({
  checked,
  disabled,
}: {
  checked: boolean;
  disabled: boolean;
}): JSX.Element {
  const style: CSSProperties = checked
    ? disabled
      ? {
          borderColor: "transparent",
          background: "var(--container-dynamic-neutral-subtle-background-disabled,rgba(113,113,128,0.1))",
        }
      : {
          borderColor: "var(--controls-background-selected,#7c33b5)",
          background: "var(--controls-background-selected,#7c33b5)",
        }
    : {
        borderColor: "var(--border-dynamic-neutral-subtle-default,#c6c6cc)",
        background: "transparent",
      };
  return (
    <span
      aria-hidden="true"
      className="flex h-4 w-4 shrink-0 items-center justify-center rounded-sm border-[1.5px] transition-colors duration-150"
      style={style}
    >
      {checked && (
        <img alt="" className="h-4 w-4" src="/figmaAssets/icon-check.svg" />
      )}
    </span>
  );
}

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
  const [hover, setHover] = useState(false);
  const [selected, setSelected] = useState(state === "Selected");
  const isDisabled = state === "Disabled" || state === "Selected Disabled";
  const isLoading = state === "Loading";
  // Only the "Default" panel state is fully interactive (toggle select + hover).
  // Panel-forced states (Hover / Selected / Selected Disabled / Disabled) stay
  // forced; disabled/loading suppress interaction entirely.
  const interactive = state === "Default";

  // Effective visual state: panel state is FORCED. When base is "Default" we
  // derive Selected (click) / Hover (pointer) from live interaction.
  let effectiveState: DropdownState = state;
  if (state === "Default") {
    if (selected) effectiveState = "Selected";
    else if (hover) effectiveState = "Hover";
  }
  const style = STATE_STYLES[effectiveState];

  // Loading state renders the dedicated loading row (exact Figma).
  if (state === "Loading") {
    return (
      <div className="flex w-full max-w-[276px] items-center gap-2 border-b border-[var(--border-static-subtle-neutral,#e1e1e8)] px-3 py-2" style={{ background: STATE_STYLES.Loading.background }}>
        <span
          className="flex h-6 items-center font-body-md-regular text-[length:var(--body-md-regular-size,14px)] font-[number:var(--body-md-regular-weight,400)] leading-[var(--body-md-regular-line-height,20px)] tracking-[var(--body-md-regular-letter-spacing,0px)]"
          style={{ color: STATE_STYLES.Loading.color }}
        >
          Loading...
        </span>
      </div>
    );
  }

  // Checkbox visual reflects selection: forced Selected states are checked; in
  // interactive Default state it follows the live selection.
  const boxChecked = hasCheckbox
    ? state === "Selected" || state === "Selected Disabled"
      ? true
      : interactive
        ? selected
        : checked
    : false;

  return (
    <button
      type="button"
      aria-pressed={interactive ? selected : undefined}
      aria-disabled={isDisabled || undefined}
      disabled={isDisabled}
      onMouseEnter={interactive ? () => setHover(true) : undefined}
      onMouseLeave={interactive ? () => setHover(false) : undefined}
      onClick={interactive ? () => setSelected((s) => !s) : undefined}
      className={`flex w-full max-w-[276px] items-center gap-2 border-b border-[var(--border-static-subtle-neutral,#e1e1e8)] px-3 py-2 text-left transition-colors duration-150 ${
        interactive ? "cursor-pointer" : "cursor-default"
      } ${isDisabled ? "cursor-not-allowed" : ""} ${hasCheckbox ? "pl-2" : ""}`}
      style={{ background: style.background }}
    >
      <div className="flex min-w-0 flex-1 items-center gap-2">
        <div className="flex h-6 min-w-0 flex-1 items-center gap-1.5">
          {hasCheckbox && <CheckboxBox checked={boxChecked} disabled={isDisabled} />}
          <span
            className="flex items-center whitespace-nowrap font-body-md-regular text-[length:var(--body-md-regular-size,14px)] font-[number:var(--body-md-regular-weight,400)] leading-[var(--body-md-regular-line-height,20px)] tracking-[var(--body-md-regular-letter-spacing,0px)] transition-colors duration-150"
            style={{ color: style.color }}
          >
            {label || "Field 1"}
          </span>
        </div>
        {hasCaret && (
          <img
            className="h-6 w-6 shrink-0"
            alt="Icon caret"
            src="/figmaAssets/icon-caret.svg"
          />
        )}
      </div>
    </button>
  );
}

const config: PlaygroundConfig = {
  name: "Dropdown Row",
  scopeId: "dropdowns/dropdown-row",
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
    "container/dynamic/neutral/subtle/background/hover":
      "var(--container-dynamic-neutral-subtle-background-hover)",
    "container/dynamic/brand/subtle/background/selected":
      "var(--container-dynamic-brand-subtle-background-selected)",
    "container/dynamic/neutral/subtle/background/disabled":
      "var(--container-dynamic-neutral-subtle-background-disabled)",
    "container/dynamic/brand/subtle/foreground/delected":
      "var(--container-dynamic-brand-subtle-foreground-delected)",
    "container/dynamic/neutral/subtle/foreground/default/variation":
      "var(--container-dynamic-neutral-subtle-foreground-default-variation)",
    "container/dynamic/neutral/subtle/foreground/hover":
      "var(--container-dynamic-neutral-subtle-foreground-hover)",
    "container/dynamic/neutral/subtle/foreground/disabled":
      "var(--container-dynamic-neutral-subtle-foreground-disabled)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "border/dynamic/neutral/subtle/default": "var(--border-dynamic-neutral-subtle-default)",
    "controls/background/selected": "var(--controls-background-selected)",
    "Body Md/Regular": "var(--body-md-regular-size)",
  },
};

export default function Dropdowns(): JSX.Element {
  return (
    <section aria-label="Dropdown component playground" className="flex flex-col gap-6">
      <Playground config={config} />
    </section>
  );
}
