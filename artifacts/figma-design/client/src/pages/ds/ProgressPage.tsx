import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

type ProgressState = "Alert" | "Info" | "Success" | "Warning" | "Pause";

const STATE_COLORS: Record<ProgressState, string> = {
  Alert: "var(--progress-error, #da294b)",
  Info: "var(--progress-info, #2360db)",
  Success: "var(--progress-success, #1e8158)",
  Warning: "var(--progress-warning, #f8c500)",
  Pause: "var(--progress-orange, #c76217)",
};

const BASE_COLOR = "var(--progress-neutral, #e1e1e8)";
const LABEL_COLOR = "var(--surface-foreground-static-neutral-lvl1, #13131a)";

/**
 * Fiber progress bar — parametric across the real Figma variant axes:
 * State (color), a left label (e.g. "0 minutes remaining"), and a right
 * percentage label. Exact Figma geometry/classes are preserved for both
 * the bar-only form and the labelled form.
 */
function FiberProgress({
  state,
  leftLabel,
  rightLabel,
  leftText,
  rightText,
}: {
  state: ProgressState;
  leftLabel: boolean;
  rightLabel: boolean;
  leftText: string;
  rightText: string;
}): JSX.Element {
  const fill = STATE_COLORS[state];
  const hasLabels = leftLabel || rightLabel;

  // Bar-only variant (no labels): height 6px, width 288px, fill 63.89%.
  if (!hasLabels) {
    return (
      <div className="relative h-[6px] w-[288px] rounded-[var(--old-radiuses-4,4px)]">
        <div
          className="absolute inset-0 rounded-[var(--old-radiuses-4,4px)]"
          style={{ backgroundColor: BASE_COLOR }}
        />
        <div
          className="absolute rounded-[var(--old-radiuses-4,4px)]"
          style={{ top: 0, bottom: 0, left: 0, right: "36.11%", backgroundColor: fill }}
        />
      </div>
    );
  }

  // Labelled variants: 32px tall container, bar pinned to bottom (top 81.25%),
  // fill 53.7%. Width 287px when right-only, 322px when a left label exists.
  const width = leftLabel ? "w-[322px]" : "w-[287px]";

  return (
    <div className={`relative h-[32px] ${width}`}>
      {leftLabel && (
        <p
          className="absolute left-0 top-0 whitespace-nowrap font-['DM_Sans'] text-[length:var(--body-sm-regular-size,12px)] not-italic leading-[var(--body-sm-regular-line-height,18px)]"
          style={{ color: LABEL_COLOR, right: "64.6%", bottom: "43.75%" }}
        >
          {leftText}
        </p>
      )}
      {rightLabel && (
        <p
          className="absolute whitespace-nowrap text-right font-['DM_Sans'] text-[length:var(--body-sm-regular-size,12px)] not-italic leading-[var(--body-sm-regular-line-height,18px)]"
          style={{ color: LABEL_COLOR, left: "92.24%", top: 0, right: 0, bottom: "43.75%" }}
        >
          {rightText}
        </p>
      )}
      <div
        className="absolute rounded-[var(--old-radiuses-4,4px)]"
        style={{ top: "81.25%", bottom: 0, left: 0, right: 0, backgroundColor: BASE_COLOR }}
      />
      <div
        className="absolute rounded-[var(--old-radiuses-4,4px)]"
        style={{ top: "81.25%", bottom: 0, left: 0, right: "46.27%", backgroundColor: fill }}
      />
    </div>
  );
}

const config: PlaygroundConfig = {
  name: "Progress bar",
  scopeId: "progress/progress-bar",
  description:
    "Linear progress indicator — state color, with optional left (status) and right (percentage) labels.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Alert", "Info", "Success", "Warning", "Pause"],
      defaultValue: "Info",
      asTabs: true,
    },
    { kind: "boolean", name: "leftLabel", label: "Left label", defaultValue: false },
    { kind: "boolean", name: "rightLabel", label: "Right label", defaultValue: false },
    {
      kind: "text",
      name: "leftText",
      label: "Left label text",
      defaultValue: "0 minutes remaining",
      placeholder: "0 minutes remaining",
    },
    {
      kind: "text",
      name: "rightText",
      label: "Right label text",
      defaultValue: "55%",
      placeholder: "55%",
    },
  ],
  render: (props) => (
    <FiberProgress
      state={props.state as ProgressState}
      leftLabel={props.leftLabel === true}
      rightLabel={props.rightLabel === true}
      leftText={String(props.leftText)}
      rightText={String(props.rightText)}
    />
  ),
  tokens: {
    "progress/error": "var(--progress-error)",
    "progress/info": "var(--progress-info)",
    "progress/success": "var(--progress-success)",
    "progress/warning": "var(--progress-warning)",
    "progress/orange": "var(--progress-orange)",
    "progress/neutral": "var(--progress-neutral)",
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "Body Sm/Regular": "var(--body-sm-regular-size)",
    "[old]Radiuses/4": "var(--old-radiuses-4)",
    "[old]Sizing/6": "var(--old-sizing-6)",
    "[old]Sizing/32": "var(--old-sizing-32)",
  },
};

export default function ProgressPage(): JSX.Element {
  return (
    <section aria-label="Progress bar component playground" className="flex flex-col gap-6">
      <Playground config={config} />
    </section>
  );
}
