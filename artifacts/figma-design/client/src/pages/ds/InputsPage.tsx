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

/* ---------- shared style helpers ---------- */

function containerStyle(state: StdState): {
  background: string;
  borderColor: string;
} {
  switch (state) {
    case "Hover":
      return { background: "rgba(113,113,128,0.08)", borderColor: "#c6c6cc" };
    case "Active / Focus":
      return { background: "#ffffff", borderColor: "#7c33b5" };
    case "Disabled":
      return {
        background: "rgba(113,113,128,0.1)",
        borderColor: "rgba(113,113,128,0.1)",
      };
    case "Error":
      return { background: "#ffffff", borderColor: "#da294b" };
    default:
      return { background: "#ffffff", borderColor: "#c6c6cc" };
  }
}

function textColor(state: StdState): string {
  switch (state) {
    case "Filled":
    case "Error":
      return "#13131a";
    case "Active / Focus":
      return "#13131a";
    case "Disabled":
      return "#a8a8b2";
    default:
      return "#4b4b59";
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

  const cs = containerStyle(state);
  const isError = state === "Error";
  const isDisabled = state === "Disabled";

  const value =
    state === "Filled"
      ? "Value"
      : state === "Error"
        ? "Value"
        : state === "Active / Focus"
          ? "Valu"
          : placeholderText;

  const fieldH = compact ? "24px" : "34px";
  const fontSize = compact ? "12px" : "14px";
  const lineHeight = compact ? "18px" : "20px";

  const metaBadge =
    metadata === "No" ? null : (
      <span
        className="flex h-[18px] items-center justify-center rounded-[2px] px-[3px]"
        style={{ background: "#f6ebff", color: "#7c33b5", fontSize, lineHeight }}
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
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "20px",
            color: "#13131a",
          }}
        >
          {titleText}
        </div>
      )}
      <div
        className="flex w-full flex-col rounded-[2px] border border-solid"
        style={{ background: cs.background, borderColor: cs.borderColor }}
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
              className="overflow-hidden text-ellipsis whitespace-nowrap"
              style={{
                fontFamily: "'DM Sans', Helvetica",
                fontWeight: 400,
                fontSize,
                lineHeight,
                color: textColor(state),
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
                  background: isDisabled ? "#c6c6cc" : "#a8a8b2",
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
            fontWeight: 400,
            fontSize: "12px",
            lineHeight: "18px",
            color: "#da294b",
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
  const cs = containerStyle(state);
  const isError = state === "Error";
  const isDisabled = state === "Disabled";

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
      : state === "Active / Focus"
        ? eye.focus
        : eye.default
    : isDisabled
      ? eyeSlash.disabled
      : state === "Active / Focus"
        ? eyeSlash.focus
        : eyeSlash.default;

  return (
    <div className="flex w-full max-w-[284px] flex-col gap-[2px]">
      {title && (
        <div
          className="whitespace-nowrap overflow-hidden text-ellipsis"
          style={{
            fontFamily: "'DM Sans', Helvetica",
            fontWeight: 500,
            fontSize: "14px",
            lineHeight: "20px",
            color: "#13131a",
          }}
        >
          {titleText}
        </div>
      )}
      <div
        className="flex w-full flex-col rounded-[2px] border border-solid"
        style={{ background: cs.background, borderColor: cs.borderColor }}
      >
        <div
          className="flex w-full items-center gap-[8px] rounded-[2px]"
          style={{ paddingLeft: "12px", paddingRight: "9px" }}
        >
          <div
            className="flex min-w-px flex-1 items-center overflow-hidden"
            style={{ height: "34px" }}
          >
            <p
              className="overflow-hidden text-ellipsis whitespace-nowrap"
              style={{
                fontFamily: "'DM Sans', Helvetica",
                fontWeight: 400,
                fontSize: "14px",
                lineHeight: "20px",
                color: textColor(state),
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
            fontWeight: 400,
            fontSize: "12px",
            lineHeight: "18px",
            color: "#da294b",
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
      return { background: "rgba(113,113,128,0.08)", borderColor: "#c6c6cc" };
    case "ActiveStart":
    case "StartFilled":
      return { background: "#ffffff", borderColor: "#7c33b5" };
    case "Disabled":
      return {
        background: "rgba(113,113,128,0.1)",
        borderColor: "rgba(113,113,128,0.1)",
      };
    case "Error":
      return { background: "#ffffff", borderColor: "#da294b" };
    default:
      return { background: "#ffffff", borderColor: "#c6c6cc" };
  }
}

function rangeText(state: RangeState): string {
  if (state === "StartFilled" || state === "Error" || state === "Filled")
    return "#13131a";
  if (state === "Disabled") return "#a8a8b2";
  return "#4b4b59";
}

function RangeField(props: {
  state: RangeState;
  compact?: boolean;
  errorText?: string;
}) {
  const { state, compact = false, errorText = "This date range is not valid" } = props;
  const cs = rangeContainer(state);
  const isError = state === "Error";
  const isDisabled = state === "Disabled";
  const isFilledLike = state === "Error" || state === "Filled";
  const showStartBadge = state === "ActiveStart" || state === "StartFilled";

  const startText = isFilledLike
    ? "31/05/2023"
    : state === "StartFilled"
      ? "31/05/2022"
      : "Start date";
  const endText = isFilledLike ? "10/06/2023" : "End date";

  const fieldH = compact ? "24px" : "34px";
  const fontSize = compact ? "12px" : "14px";
  const lineHeight = compact ? "18px" : "20px";
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
        className="flex w-full items-center gap-[8px] rounded-[2px] border border-solid"
        style={{
          background: cs.background,
          borderColor: cs.borderColor,
          paddingLeft: "12px",
          paddingRight: "8px",
          minHeight: fieldH,
        }}
      >
        {showStartBadge ? (
          <span
            className="flex h-[18px] items-center justify-center rounded-[2px] px-[3px]"
            style={{ background: "#f6ebff", color: "#7c33b5", fontSize, lineHeight }}
          >
            dd/MM/YYYY
          </span>
        ) : (
          <span
            className="whitespace-nowrap"
            style={{ fontFamily: "'DM Sans', Helvetica", fontWeight: 400, fontSize, lineHeight, color: rangeText(state) }}
          >
            {startText}
          </span>
        )}
        <span
          style={{ fontFamily: "'DM Sans', Helvetica", fontWeight: 400, fontSize, lineHeight, color: rangeText(state) }}
        >
          -
        </span>
        <span
          className="min-w-px flex-1 overflow-hidden text-ellipsis whitespace-nowrap"
          style={{ fontFamily: "'DM Sans', Helvetica", fontWeight: 400, fontSize, lineHeight, color: rangeText(state) }}
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
            fontWeight: 400,
            fontSize: "12px",
            lineHeight: "18px",
            color: "#da294b",
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
  "border/neutral/default": "#c6c6cc",
  "border/brand/focus": "#7c33b5",
  "border/error": "#da294b",
  "container/hover/background": "rgba(113,113,128,0.08)",
  "container/disabled/background": "rgba(113,113,128,0.1)",
  "text/neutral/placeholder": "#4b4b59",
  "text/neutral/value": "#13131a",
  "text/disabled": "#a8a8b2",
  "text/error": "#da294b",
  "badge/brand/background": "#f6ebff",
  "badge/brand/text": "#7c33b5",
  "radius/field": "2px",
  "size/default/height": "34px",
  "size/compact/height": "24px",
};

const standardConfig: PlaygroundConfig = {
  name: "Input / Standard",
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
