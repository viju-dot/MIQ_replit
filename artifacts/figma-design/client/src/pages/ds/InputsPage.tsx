import { useState } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

const A = "/figmaAssets/inputs";

const eyeSlash = {
  default: `${A}/eye-slash-default.svg`,
  focus: `${A}/eye-slash-focus.svg`,
  disabled: `${A}/eye-slash-disabled.svg`,
};
const eye = {
  default: `${A}/eye-default.svg`,
  focus: `${A}/eye-focus.svg`,
  disabled: `${A}/eye-disabled.svg`,
};
const calendar = {
  default: `${A}/calendar-default.svg`,
  focus: `${A}/calendar-focus.svg`,
  disabled: `${A}/calendar-disabled.svg`,
};
const calendarSm = {
  default: `${A}/calendar-sm-default.svg`,
  focus: `${A}/calendar-sm-focus.svg`,
  disabled: `${A}/calendar-sm-disabled.svg`,
};

type StdState =
  | "Default"
  | "Hover"
  | "Active / Focus"
  | "Filled"
  | "Disabled"
  | "Error";

const STD_STATES: StdState[] = [
  "Default",
  "Hover",
  "Active / Focus",
  "Filled",
  "Disabled",
  "Error",
];

/**
 * Live interaction hook shared by the input fields.
 *
 * The panel `state` selector is the base/source-of-truth state. On top of it we
 * layer real :hover/:focus/:active from the actual field so natural interaction
 * matches the corresponding Figma variant exactly:
 *   - Disabled always wins (no hover/focus/active).
 *   - When the panel forces an explicit interactive state (Hover / Active/Focus /
 *     Error) we keep it, but still allow focusing to reach Active/Focus.
 *   - When the panel is a resting state (Default / Filled) hover -> Hover and
 *     focus/active -> Active / Focus, then falls back to the base state.
 */
function useFieldInteraction(base: StdState) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const isDisabled = base === "Disabled";

  let effective: StdState = base;
  if (!isDisabled) {
    if (focus) effective = "Active / Focus";
    else if (base === "Error") effective = "Error";
    else if (hover || base === "Hover") effective = "Hover";
  }

  const handlers = isDisabled
    ? {}
    : {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        onFocus: () => setFocus(true),
        onBlur: () => setFocus(false),
      };

  return { effective, isDisabled, handlers };
}

/* ---------- shared style helpers ---------- */

function containerStyle(state: StdState): {
  background: string;
  borderColor: string;
} {
  switch (state) {
    case "Hover":
      return {
        background:
          "var(--container-dynamic-neutral-subtle-background-hover,rgba(113,113,128,0.08))",
        borderColor: "var(--border-dynamic-neutral-subtle-default,#c6c6cc)",
      };
    case "Active / Focus":
      return {
        background:
          "var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)",
        borderColor: "var(--border-dynamic-brand-selected,#7c33b5)",
      };
    case "Disabled":
      return {
        background:
          "var(--container-dynamic-neutral-subtle-background-disabled,rgba(113,113,128,0.1))",
        borderColor:
          "var(--container-dynamic-neutral-subtle-background-disabled,rgba(113,113,128,0.1))",
      };
    case "Error":
      return {
        background:
          "var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)",
        borderColor: "var(--border-dynamic-error-default,#da294b)",
      };
    default:
      return {
        background:
          "var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)",
        borderColor: "var(--border-dynamic-neutral-subtle-default,#c6c6cc)",
      };
  }
}

function textColor(state: StdState): string {
  switch (state) {
    case "Filled":
    case "Error":
      return "var(--container-dynamic-neutral-subtle-foreground-default-variation,#13131a)";
    case "Active / Focus":
      return "var(--container-dynamic-neutral-subtle-foreground-default-variation,#13131a)";
    case "Disabled":
      return "var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)";
    default:
      return "var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)";
  }
}

/* ---------- Input / Standard ---------- */

type Metadata = "No" | "Right" | "Left";

function StandardField(props: {
  state: StdState;
  title?: boolean;
  titleText?: string;
  placeholderText?: string;
  errorText?: string;
  iconRight?: boolean;
  metadata?: Metadata;
  compact?: boolean;
}) {
  const {
    state,
    title = false,
    titleText = "Title:",
    placeholderText = "Placeholder",
    errorText = "Error message",
    iconRight = false,
    metadata = "No",
    compact = false,
  } = props;

  const { effective, isDisabled, handlers } = useFieldInteraction(state);
  const cs = containerStyle(effective);
  const isError = state === "Error";

  const value =
    state === "Filled"
      ? "Value"
      : state === "Error"
        ? "Value"
        : state === "Active / Focus"
          ? "Valu"
          : placeholderText;

  const fieldH = compact
    ? "var(--old-sizing-24,24px)"
    : "var(--sizing-34,34px)";
  const fontSize = compact
    ? "var(--body-sm-regular-size,12px)"
    : "var(--body-md-regular-size,14px)";
  const lineHeight = compact
    ? "var(--body-sm-regular-line-height,18px)"
    : "var(--body-md-regular-line-height,20px)";

  const metaBadge =
    metadata === "No" ? null : (
      <span
        className="flex h-[18px] items-center justify-center rounded-[2px] px-[3px]"
        style={{
          background:
            "var(--container-dynamic-brand-subtle-background-default,#f6ebff)",
          color:
            "var(--container-dynamic-brand-subtle-foreground-default,#7c33b5)",
          fontSize,
          lineHeight,
        }}
      >
        Meta
      </span>
    );

  return (
    <div className="flex w-full max-w-[284px] flex-col gap-[2px]">
      {title && (
        <div
          className="whitespace-nowrap overflow-hidden text-ellipsis"
          style={{
            fontFamily: "'DM Sans', Helvetica",
            fontWeight: "var(--body-md-medium-weight,500)",
            fontSize: "var(--body-md-medium-size,14px)",
            lineHeight: "var(--body-md-medium-line-height,20px)",
            color: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
          }}
        >
          {titleText}
        </div>
      )}
      <div
        className="flex w-full flex-col rounded-[2px] border border-solid transition-colors duration-150"
        style={{
          background: cs.background,
          borderColor: cs.borderColor,
          cursor: isDisabled ? "not-allowed" : "text",
        }}
        tabIndex={isDisabled ? -1 : 0}
        aria-disabled={isDisabled || undefined}
        {...handlers}
      >
        <div
          className="flex w-full items-center gap-[8px] rounded-[2px]"
          style={{
            paddingLeft: "12px",
            paddingRight: iconRight || metadata === "Right" ? "8px" : "12px",
          }}
        >
          {metadata === "Left" && (
            <span className="flex items-center" style={{ minHeight: fieldH }}>
              {metaBadge}
            </span>
          )}
          <div
            className="flex min-w-px flex-1 items-center overflow-hidden"
            style={{ height: fieldH }}
          >
            <p
              className="overflow-hidden text-ellipsis whitespace-nowrap transition-colors duration-150"
              style={{
                fontFamily: "'DM Sans', Helvetica",
                fontWeight: "var(--body-md-regular-weight,400)",
                fontSize,
                lineHeight,
                color: textColor(state === "Filled" || state === "Error" ? state : effective),
              }}
            >
              {value}
            </p>
          </div>
          {metadata === "Right" && (
            <span className="flex items-center" style={{ height: fieldH }}>
              {metaBadge}
            </span>
          )}
          {iconRight && (
            <span
              className="flex shrink-0 items-center justify-center"
              style={{ width: "24px", height: "24px" }}
            >
              <span
                className="rounded-full"
                style={{
                  width: "16px",
                  height: "16px",
                  background: isDisabled
                    ? "var(--border-dynamic-neutral-subtle-default,#c6c6cc)"
                    : "var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)",
                  color: "#fff",
                  fontSize: "11px",
                  lineHeight: "16px",
                  textAlign: "center",
                }}
              >
                i
              </span>
            </span>
          )}
        </div>
      </div>
      {isError && (
        <p
          style={{
            fontFamily: "'DM Sans', Helvetica",
            fontWeight: "var(--body-sm-regular-weight,400)",
            fontSize: "var(--body-sm-regular-size,12px)",
            lineHeight: "var(--body-sm-regular-line-height,18px)",
            color: "var(--surface-foreground-static-error,#da294b)",
          }}
        >
          {errorText}
        </p>
      )}
    </div>
  );
}

/* ---------- Input / Password ---------- */

function PasswordField(props: {
  state: StdState;
  eyeShown: boolean;
  title?: boolean;
  titleText?: string;
  errorText?: string;
}) {
  const {
    state,
    eyeShown,
    title = false,
    titleText = "Title:",
    errorText = "Incorrect password",
  } = props;
  const { effective, isDisabled, handlers } = useFieldInteraction(state);
  const cs = containerStyle(effective);
  const isError = state === "Error";

  const value =
    state === "Filled"
      ? eyeShown
        ? "Test123"
        : "*******"
      : state === "Error"
        ? eyeShown
          ? "Test1234"
          : "*******"
        : state === "Active / Focus"
          ? eyeShown
            ? "Test"
            : "****"
          : isDisabled
            ? eyeShown
              ? "Test123"
              : "*******"
            : "Password";

  const iconSrc = eyeShown
    ? isDisabled
      ? eye.disabled
      : effective === "Active / Focus"
        ? eye.focus
        : eye.default
    : isDisabled
      ? eyeSlash.disabled
      : effective === "Active / Focus"
        ? eyeSlash.focus
        : eyeSlash.default;

  return (
    <div className="flex w-full max-w-[284px] flex-col gap-[2px]">
      {title && (
        <div
          className="whitespace-nowrap overflow-hidden text-ellipsis"
          style={{
            fontFamily: "'DM Sans', Helvetica",
            fontWeight: "var(--body-md-medium-weight,500)",
            fontSize: "var(--body-md-medium-size,14px)",
            lineHeight: "var(--body-md-medium-line-height,20px)",
            color: "var(--surface-foreground-static-neutral-lvl1,#13131a)",
          }}
        >
          {titleText}
        </div>
      )}
      <div
        className="flex w-full flex-col rounded-[2px] border border-solid transition-colors duration-150"
        style={{
          background: cs.background,
          borderColor: cs.borderColor,
          cursor: isDisabled ? "not-allowed" : "text",
        }}
        tabIndex={isDisabled ? -1 : 0}
        aria-disabled={isDisabled || undefined}
        {...handlers}
      >
        <div
          className="flex w-full items-center gap-[8px] rounded-[2px]"
          style={{ paddingLeft: "12px", paddingRight: "9px" }}
        >
          <div
            className="flex min-w-px flex-1 items-center overflow-hidden"
            style={{ height: "var(--sizing-34,34px)" }}
          >
            <p
              className="overflow-hidden text-ellipsis whitespace-nowrap transition-colors duration-150"
              style={{
                fontFamily: "'DM Sans', Helvetica",
                fontWeight: "var(--body-md-regular-weight,400)",
                fontSize: "var(--body-md-regular-size,14px)",
                lineHeight: "var(--body-md-regular-line-height,20px)",
                color: textColor(state === "Filled" || state === "Error" ? state : effective),
              }}
            >
              {value}
            </p>
          </div>
          <span
            className="flex shrink-0 items-center justify-center"
            style={{ width: "24px", height: "24px" }}
          >
            <img
              alt=""
              src={iconSrc}
              style={
                eyeShown
                  ? { width: "22.5px", height: "15px" }
                  : { width: "24px", height: "24px" }
              }
            />
          </span>
        </div>
      </div>
      {isError && (
        <p
          style={{
            fontFamily: "'DM Sans', Helvetica",
            fontWeight: "var(--body-sm-regular-weight,400)",
            fontSize: "var(--body-sm-regular-size,12px)",
            lineHeight: "var(--body-sm-regular-line-height,18px)",
            color: "var(--surface-foreground-static-error,#da294b)",
          }}
        >
          {errorText}
        </p>
      )}
    </div>
  );
}

/* ---------- Input / Range ---------- */

type RangeState =
  | "Default"
  | "Hover"
  | "ActiveStart"
  | "StartFilled"
  | "Filled"
  | "Disabled"
  | "Error";

const RANGE_STATES: RangeState[] = [
  "Default",
  "Hover",
  "ActiveStart",
  "StartFilled",
  "Filled",
  "Disabled",
  "Error",
];

function rangeContainer(state: RangeState): {
  background: string;
  borderColor: string;
} {
  switch (state) {
    case "Hover":
      return {
        background:
          "var(--container-dynamic-neutral-subtle-background-hover,rgba(113,113,128,0.08))",
        borderColor: "var(--border-dynamic-neutral-subtle-default,#c6c6cc)",
      };
    case "ActiveStart":
    case "StartFilled":
      return {
        background:
          "var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)",
        borderColor: "var(--border-dynamic-brand-selected,#7c33b5)",
      };
    case "Disabled":
      return {
        background:
          "var(--container-dynamic-neutral-subtle-background-disabled,rgba(113,113,128,0.1))",
        borderColor:
          "var(--container-dynamic-neutral-subtle-background-disabled,rgba(113,113,128,0.1))",
      };
    case "Error":
      return {
        background:
          "var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)",
        borderColor: "var(--border-dynamic-error-default,#da294b)",
      };
    default:
      return {
        background:
          "var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)",
        borderColor: "var(--border-dynamic-neutral-subtle-default,#c6c6cc)",
      };
  }
}

/**
 * Live interaction for the Range field. Mirrors useFieldInteraction but uses
 * the range's own state axis: hover -> Hover, focus -> ActiveStart.
 */
function useRangeInteraction(base: RangeState) {
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const isDisabled = base === "Disabled";

  let effective: RangeState = base;
  if (!isDisabled) {
    if (focus && (base === "Default" || base === "Hover")) effective = "ActiveStart";
    else if (base === "Error") effective = "Error";
    else if (hover && base === "Default") effective = "Hover";
  }

  const handlers = isDisabled
    ? {}
    : {
        onMouseEnter: () => setHover(true),
        onMouseLeave: () => setHover(false),
        onFocus: () => setFocus(true),
        onBlur: () => setFocus(false),
      };

  return { effective, isDisabled, handlers };
}

function rangeText(state: RangeState): string {
  if (state === "StartFilled" || state === "Error" || state === "Filled")
    return "var(--container-dynamic-neutral-subtle-foreground-default-variation,#13131a)";
  if (state === "Disabled")
    return "var(--container-dynamic-neutral-subtle-foreground-disabled,#a8a8b2)";
  return "var(--container-dynamic-neutral-subtle-foreground-default-regular,#4b4b59)";
}

function RangeField(props: {
  state: RangeState;
  compact?: boolean;
  errorText?: string;
}) {
  const { state, compact = false, errorText = "This date range is not valid" } = props;
  const { effective, isDisabled, handlers } = useRangeInteraction(state);
  const cs = rangeContainer(effective);
  const isError = state === "Error";
  const isFilledLike = state === "Error" || state === "Filled";
  const showStartBadge = effective === "ActiveStart" || state === "StartFilled";

  const startText = isFilledLike
    ? "31/05/2023"
    : state === "StartFilled"
      ? "31/05/2022"
      : "Start date";
  const endText = isFilledLike ? "10/06/2023" : "End date";

  const fieldH = compact
    ? "var(--old-sizing-24,24px)"
    : "var(--sizing-34,34px)";
  const fontSize = compact
    ? "var(--body-sm-regular-size,12px)"
    : "var(--body-md-regular-size,14px)";
  const lineHeight = compact
    ? "var(--body-sm-regular-line-height,18px)"
    : "var(--body-md-regular-line-height,20px)";
  const calIcon = isDisabled
    ? (compact ? calendarSm.disabled : calendar.disabled)
    : compact
      ? calendarSm.default
      : calendar.default;
  const calSize = compact
    ? { w: "12px", h: "13px", box: "16px" }
    : { w: "18px", h: "19.5px", box: "24px" };

  return (
    <div className="flex w-full max-w-[250px] flex-col gap-[8px]">
      <div
        className="flex w-full items-center gap-[8px] rounded-[2px] border border-solid transition-colors duration-150"
        style={{
          background: cs.background,
          borderColor: cs.borderColor,
          paddingLeft: "12px",
          paddingRight: "8px",
          minHeight: fieldH,
          cursor: isDisabled ? "not-allowed" : "text",
        }}
        tabIndex={isDisabled ? -1 : 0}
        aria-disabled={isDisabled || undefined}
        {...handlers}
      >
        {showStartBadge ? (
          <span
            className="flex h-[18px] items-center justify-center rounded-[2px] px-[3px]"
            style={{
              background:
                "var(--container-dynamic-brand-subtle-background-default,#f6ebff)",
              color:
                "var(--container-dynamic-brand-subtle-foreground-default,#7c33b5)",
              fontSize,
              lineHeight,
            }}
          >
            dd/MM/YYYY
          </span>
        ) : (
          <span
            className="whitespace-nowrap"
            style={{ fontFamily: "'DM Sans', Helvetica", fontWeight: "var(--body-md-regular-weight,400)", fontSize, lineHeight, color: rangeText(state) }}
          >
            {startText}
          </span>
        )}
        <span
          style={{ fontFamily: "'DM Sans', Helvetica", fontWeight: "var(--body-md-regular-weight,400)", fontSize, lineHeight, color: rangeText(state) }}
        >
          -
        </span>
        <span
          className="min-w-px flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
          style={{ fontFamily: "'DM Sans', Helvetica", fontWeight: "var(--body-md-regular-weight,400)", fontSize, lineHeight, color: rangeText(state) }}
        >
          {endText}
        </span>
        <span
          className="flex shrink-0 items-center justify-center"
          style={{ width: calSize.box, height: calSize.box }}
        >
          <img alt="" src={calIcon} style={{ width: calSize.w, height: calSize.h }} />
        </span>
      </div>
      {isError && (
        <p
          style={{
            fontFamily: "'DM Sans', Helvetica",
            fontWeight: "var(--body-sm-regular-weight,400)",
            fontSize: "var(--body-sm-regular-size,12px)",
            lineHeight: "var(--body-sm-regular-line-height,18px)",
            color: "var(--surface-foreground-static-error,#da294b)",
          }}
        >
          {errorText}
        </p>
      )}
    </div>
  );
}

/* ---------- Playground configs ---------- */

const sharedTokens = {
  "border/dynamic/neutral/subtle/default": "var(--border-dynamic-neutral-subtle-default)",
  "border/dynamic/brand/selected": "var(--border-dynamic-brand-selected)",
  "border/dynamic/error/default": "var(--border-dynamic-error-default)",
  "container/dynamic/neutral/subtle/background/default/regular": "var(--container-dynamic-neutral-subtle-background-default-regular)",
  "container/dynamic/neutral/subtle/background/hover": "var(--container-dynamic-neutral-subtle-background-hover)",
  "container/dynamic/neutral/subtle/background/disabled": "var(--container-dynamic-neutral-subtle-background-disabled)",
  "container/dynamic/neutral/subtle/foreground/default/regular": "var(--container-dynamic-neutral-subtle-foreground-default-regular)",
  "container/dynamic/neutral/subtle/foreground/default/variation": "var(--container-dynamic-neutral-subtle-foreground-default-variation)",
  "container/dynamic/neutral/subtle/foreground/disabled": "var(--container-dynamic-neutral-subtle-foreground-disabled)",
  "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
  "surface/foreground/static/error": "var(--surface-foreground-static-error)",
  "container/dynamic/brand/subtle/background/default": "var(--container-dynamic-brand-subtle-background-default)",
  "container/dynamic/brand/subtle/foreground/default": "var(--container-dynamic-brand-subtle-foreground-default)",
  "Body Md/Regular": "var(--body-md-regular-size)",
  "Body Md/Medium": "var(--body-md-medium-size)",
  "Body Sm/Regular": "var(--body-sm-regular-size)",
  "[old]Radiuses/2": "var(--old-radiuses-2)",
  "[old]Sizing/34": "var(--sizing-34)",
};

const standardConfig: PlaygroundConfig = {
  name: "Input / Standard",
  scopeId: "inputs/input-standard",
  description:
    "Text field with State, optional Title, right info icon, and metadata badge (left/right).",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: STD_STATES,
      defaultValue: "Default",
      asTabs: true,
    },
    { kind: "boolean", name: "compact", label: "Compact", defaultValue: false },
    { kind: "boolean", name: "title", label: "Show title", defaultValue: false },
    { kind: "boolean", name: "iconRight", label: "Info icon (right)", defaultValue: false },
    {
      kind: "select",
      name: "metadata",
      label: "Metadata badge",
      options: ["No", "Right", "Left"],
      defaultValue: "No",
    },
    { kind: "text", name: "titleText", label: "Title text", defaultValue: "Title:" },
    {
      kind: "text",
      name: "placeholderText",
      label: "Placeholder text",
      defaultValue: "Placeholder",
    },
    { kind: "text", name: "errorText", label: "Error message", defaultValue: "Error message" },
  ],
  render: (props: PropValues) => (
    <StandardField
      state={props.state as StdState}
      compact={props.compact === true}
      title={props.title === true}
      iconRight={props.iconRight === true}
      metadata={props.metadata as Metadata}
      titleText={String(props.titleText)}
      placeholderText={String(props.placeholderText)}
      errorText={String(props.errorText)}
    />
  ),
  tokens: sharedTokens,
};

const passwordConfig: PlaygroundConfig = {
  name: "Input / Password",
  scopeId: "inputs/input-password",
  description: "Password field with State, optional Title, and toggle to show/hide the value.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: STD_STATES,
      defaultValue: "Default",
      asTabs: true,
    },
    { kind: "boolean", name: "eyeShown", label: "Show password", defaultValue: false },
    { kind: "boolean", name: "title", label: "Show title", defaultValue: false },
    { kind: "text", name: "titleText", label: "Title text", defaultValue: "Title:" },
    {
      kind: "text",
      name: "errorText",
      label: "Error message",
      defaultValue: "Incorrect password",
    },
  ],
  render: (props: PropValues) => (
    <PasswordField
      state={props.state as StdState}
      eyeShown={props.eyeShown === true}
      title={props.title === true}
      titleText={String(props.titleText)}
      errorText={String(props.errorText)}
    />
  ),
  tokens: sharedTokens,
};

const rangeConfig: PlaygroundConfig = {
  name: "Input / Range",
  scopeId: "inputs/input-range",
  description: "Date range field with per-state appearance and a compact size.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: RANGE_STATES,
      defaultValue: "Default",
      asTabs: true,
    },
    { kind: "boolean", name: "compact", label: "Compact", defaultValue: false },
    {
      kind: "text",
      name: "errorText",
      label: "Error message",
      defaultValue: "This date range is not valid",
    },
  ],
  render: (props: PropValues) => (
    <RangeField
      state={props.state as RangeState}
      compact={props.compact === true}
      errorText={String(props.errorText)}
    />
  ),
  tokens: {
    ...sharedTokens,
    "badge/format": "dd/MM/YYYY",
  },
};

/* ---------- Page ---------- */

export default function InputsPage() {
  return (
    <section aria-label="Inputs component playgrounds" className="flex flex-col gap-8">
      <Playground config={standardConfig} />
      <Playground config={passwordConfig} />
      <Playground config={rangeConfig} />
    </section>
  );
}
