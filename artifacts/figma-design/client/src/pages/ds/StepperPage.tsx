import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

const ASSET = "/figmaAssets/stepper";

type IndicatorState =
  | "active-none"
  | "inactive-none"
  | "active-waiting"
  | "active-warning"
  | "active-success"
  | "active-error"
  | "complete-success"
  | "complete-warning";

/**
 * A single 24px stepper indicator. Several of the source SVGs are exported on a
 * 56x56 canvas (the icon circle is centered at 28,20 with a drop shadow), so we
 * reproduce the Figma inset math to render them cleanly inside a 24px box.
 */
function StepperIndicator({ state }: { state: IndicatorState }) {
  return (
    <div className="relative shrink-0 size-[24px]">
      {state === "active-none" && (
        <>
          <div className="absolute inset-[-33.33%_-66.67%_-100%_-66.67%]">
            <img alt="" className="block max-w-none size-full" src={`${ASSET}/active-none.svg`} />
          </div>
          <div className="absolute inset-[31.25%]">
            <img
              alt=""
              className="absolute block inset-0 max-w-none size-full"
              src={`${ASSET}/active-none-circle.svg`}
            />
          </div>
        </>
      )}

      {state === "inactive-none" && (
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${ASSET}/inactive-none.svg`} />
      )}

      {state === "active-waiting" && (
        <>
          <div className="absolute inset-[-33.33%_-66.67%_-100%_-66.67%]">
            <img alt="" className="block max-w-none size-full" src={`${ASSET}/active-none.svg`} />
          </div>
          <div className="absolute left-1/2 top-1/2 size-[16px] -translate-x-1/2 -translate-y-1/2 overflow-visible">
            <img
              alt=""
              className="absolute block max-w-none size-full inset-[9.36%_9.36%_9.43%_9.43%]"
              src={`${ASSET}/active-waiting-vector.svg`}
            />
          </div>
        </>
      )}

      {state === "active-warning" && (
        <div className="absolute left-1/2 top-1/2 size-[24px] -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-[-33.33%_-66.67%_-100%_-66.67%]">
            <img alt="" className="block max-w-none size-full" src={`${ASSET}/active-warning-frame.svg`} />
          </div>
        </div>
      )}

      {state === "active-success" && (
        <div className="absolute left-1/2 top-1/2 size-[24px] -translate-x-1/2 -translate-y-1/2">
          <div className="absolute inset-[-33.33%_-66.67%_-100%_-66.67%]">
            <img alt="" className="block max-w-none size-full" src={`${ASSET}/active-success-vector.svg`} />
          </div>
        </div>
      )}

      {state === "active-error" && (
        <div className="absolute left-1/2 top-1/2 flex size-[24px] items-center justify-center -translate-x-1/2 -translate-y-1/2 p-[2px]">
          <div className="relative size-[24px] shrink-0">
            <div className="absolute inset-[-33.33%_-66.67%_-100%_-66.67%]">
              <img alt="" className="block max-w-none size-full" src={`${ASSET}/active-error-frame.svg`} />
            </div>
          </div>
        </div>
      )}

      {state === "complete-success" && (
        <div className="absolute left-1/2 top-1/2 size-[24px] -translate-x-1/2 -translate-y-1/2">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${ASSET}/complete-success.svg`} />
        </div>
      )}

      {state === "complete-warning" && (
        <div className="absolute left-1/2 top-1/2 size-[24px] -translate-x-1/2 -translate-y-1/2">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={`${ASSET}/complete-warning.svg`} />
        </div>
      )}
    </div>
  );
}

/* ---------- Stage + metadata (labels underneath / beside an indicator) ---------- */

function StageAndMetadata({
  active = false,
  hasMetadata = false,
  metadata = "Metadata of stage",
  stageName = "Step 1",
}: {
  active?: boolean;
  hasMetadata?: boolean;
  metadata?: string;
  stageName?: string;
}) {
  return (
    <div className="flex flex-col items-start gap-[var(--spacing-25,2px)]">
      <p
        className={`whitespace-nowrap text-center text-[length:var(--body-md-medium-size,14px)] leading-[var(--body-md-medium-line-height,20px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] ${
          active ? "font-medium" : "font-normal"
        }`}
      >
        {stageName}
      </p>
      {hasMetadata && (
        <div className="flex max-h-[38px] max-w-[108px] items-start justify-center gap-[var(--spacing-50,4px)]">
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-center text-[length:var(--body-sm-regular-size,12px)] font-normal leading-[var(--body-sm-regular-line-height,18px)] text-[var(--surface-foreground-static-neutral-lvl3,#717180)]">
            {metadata}
          </p>
        </div>
      )}
    </div>
  );
}

/* ---------- Horizontal stepper ---------- */

function HStep({
  state,
  stageName,
  active = false,
  hasMetadata = false,
  fixedWidth = true,
}: {
  state: IndicatorState;
  stageName: string;
  active?: boolean;
  hasMetadata?: boolean;
  fixedWidth?: boolean;
}) {
  return (
    <div className={`flex shrink-0 flex-col items-start gap-[var(--spacing-150,12px)] ${fixedWidth ? "w-[var(--sizing-lg,24px)]" : ""}`}>
      <StepperIndicator state={state} />
      <StageAndMetadata active={active} hasMetadata={hasMetadata} stageName={stageName} />
    </div>
  );
}

function HLine() {
  return (
    <div className="relative h-[24px] min-w-px flex-[1_0_0]">
      <div className="absolute left-0 right-0 top-[11px] h-[2px] bg-[var(--progress-neutral,#e1e1e8)]" />
    </div>
  );
}

function StepperHorizontal({ steps, withMetadata = false }: { steps: number; withMetadata?: boolean }) {
  const items = Array.from({ length: steps }, (_, i) => i + 1);
  return (
    <div className="flex w-full flex-col items-start">
      <div className="flex w-full items-start">
        {items.map((n, idx) => (
          <div key={n} className="flex flex-[1_0_0] items-start last:flex-none">
            <HStep
              state={n === 1 ? "active-none" : "inactive-none"}
              stageName={`Step ${n}`}
              active={n === 1}
              hasMetadata={withMetadata}
              fixedWidth={idx !== items.length - 1}
            />
            {idx !== items.length - 1 && <HLine />}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Vertical stepper ---------- */

function StepperVertical({ steps }: { steps: number }) {
  const items = Array.from({ length: steps }, (_, i) => i + 1);
  return (
    <div className="flex flex-col items-start">
      {items.map((n, idx) => (
        <div key={n} className="flex flex-col items-start">
          <div className="flex h-[var(--sizing-lg,24px)] items-start gap-[var(--spacing-150,12px)]">
            <StepperIndicator state={n === 1 ? "active-none" : "inactive-none"} />
            <StageAndMetadata active={n === 1} stageName={`Step ${n}`} />
          </div>
          {idx !== items.length - 1 && (
            <div className="flex items-center pl-[11px]">
              <div className={`h-[40px] w-[2px] ${n === 1 ? "bg-[var(--progress-brand,#7c33b5)]" : "bg-[var(--progress-neutral,#e1e1e8)]"}`} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------- Playground configs ---------- */

const stateLabelToKey: Record<string, IndicatorState> = {
  "Active · None": "active-none",
  "Inactive · None": "inactive-none",
  "Active · Waiting": "active-waiting",
  "Active · Warning": "active-warning",
  "Active · Success": "active-success",
  "Active · Error": "active-error",
  "Complete · Success": "complete-success",
  "Complete · Warning": "complete-warning",
};

const indicatorConfig: PlaygroundConfig = {
  name: "Stepper Indicator",
  description: "The 24px indicator dot — explore each State × Status combination.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State · Status",
      options: Object.keys(stateLabelToKey),
      defaultValue: "Active · None",
      asTabs: true,
    },
  ],
  render: (props) => {
    const state = stateLabelToKey[String(props.state)] ?? "active-none";
    return (
      <div className="flex h-9 items-center justify-center">
        <StepperIndicator state={state} />
      </div>
    );
  },
  tokens: {
    "progress/brand": "var(--progress-brand)",
    "progress/neutral": "var(--progress-neutral)",
    "sizing/lg": "var(--sizing-lg)",
  },
};

const stageConfig: PlaygroundConfig = {
  name: "Stage & Metadata",
  description: "Step label with optional metadata line beside an indicator.",
  controls: [
    { kind: "boolean", name: "active", label: "Active", defaultValue: true },
    { kind: "boolean", name: "hasMetadata", label: "Metadata", defaultValue: true },
    { kind: "text", name: "stageName", label: "Stage name", defaultValue: "Step 1", placeholder: "Step 1" },
    {
      kind: "text",
      name: "metadata",
      label: "Metadata text",
      defaultValue: "Metadata of stage",
      placeholder: "Metadata of stage",
    },
  ],
  render: (props) => {
    const active = props.active === true;
    return (
      <div className="flex items-start gap-3">
        <StepperIndicator state={active ? "active-none" : "inactive-none"} />
        <StageAndMetadata
          active={active}
          hasMetadata={props.hasMetadata === true}
          stageName={String(props.stageName || "Step 1")}
          metadata={String(props.metadata || "Metadata of stage")}
        />
      </div>
    );
  },
  tokens: {
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "surface/foreground/static/neutral/lvl3": "var(--surface-foreground-static-neutral-lvl3)",
    "Body Md/Medium": "var(--body-md-medium-size)",
    "Body Sm/Regular": "var(--body-sm-regular-size)",
  },
};

const horizontalConfig: PlaygroundConfig = {
  name: "Stepper — Horizontal",
  description: "Horizontal progress stepper with a configurable number of steps.",
  controls: [
    {
      kind: "select",
      name: "steps",
      label: "Steps",
      options: ["2", "3", "4", "5"],
      defaultValue: "4",
      asTabs: true,
    },
    { kind: "boolean", name: "metadata", label: "Metadata", defaultValue: false },
  ],
  render: (props) => (
    <div className="w-full max-w-[920px]">
      <StepperHorizontal steps={Number(props.steps) || 4} withMetadata={props.metadata === true} />
    </div>
  ),
  tokens: {
    "progress/brand": "var(--progress-brand)",
    "progress/neutral": "var(--progress-neutral)",
    "spacing/25": "var(--spacing-25)",
  },
};

const verticalConfig: PlaygroundConfig = {
  name: "Stepper — Vertical",
  description: "Vertical progress stepper with a configurable number of steps.",
  controls: [
    {
      kind: "select",
      name: "steps",
      label: "Steps",
      options: ["2", "3", "4", "5"],
      defaultValue: "4",
      asTabs: true,
    },
  ],
  render: (props) => <StepperVertical steps={Number(props.steps) || 4} />,
  tokens: {
    "progress/brand": "var(--progress-brand)",
    "progress/neutral": "var(--progress-neutral)",
    "spacing/25": "var(--spacing-25)",
  },
};

/* ---------- Reference tables (status usage & glossary) ---------- */

const statusUsage: { state: IndicatorState; title: string; desc: string }[] = [
  {
    state: "active-none",
    title: "State: In progress / Status: Active",
    desc: "The user/object is currently at this stage, but they have not completed this step, nor any other backend process is taking place.",
  },
  {
    state: "active-waiting",
    title: "State: In progress / Status: Waiting",
    desc: "The user/object is currently at this stage, and the backend process they have initiated is still going on.",
  },
  {
    state: "active-warning",
    title: "State: In progress / Status: Warning",
    desc: "The user/object is currently at this stage, but the backend process they had initiated has returned with an outcome of warning. They can proceed, to the next stage or stay in the current stage and fix the warning.",
  },
  {
    state: "active-success",
    title: "State: In progress / Status: Success",
    desc: "The user/object is currently at this stage, and the backend process they initiated has completed successfully. This should be used only if the next step is determined by automatic action.",
  },
  {
    state: "active-error",
    title: "State: In progress / Status: Error",
    desc: "The user/object is currently at this stage, and the backend process they initiated has completed with an error. The user/object cannot proceed to the next stage without fixing the error.",
  },
  {
    state: "complete-success",
    title: "State: Complete / Status: Success",
    desc: "The user/object has completed this stage and is currently at a later stage.",
  },
  {
    state: "complete-warning",
    title: "State: In progress / Status: Warning",
    desc: "The user/object has completed this stage and is currently at a later stage. They are though aware that they have completed that step with a warning.",
  },
  {
    state: "inactive-none",
    title: "State: Future / Status: Incomplete",
    desc: "The user/object has not yet reached this stage.",
  },
];

function GlossaryBadge({ label }: { label: string }) {
  return (
    <div className="flex h-[34px] items-center rounded-[var(--radiuses-small,2px)] bg-[var(--container-static-neutral-bold-background,#4b4b59)] p-[var(--numbers-8,8px)]">
      <p className="whitespace-nowrap text-center text-[length:var(--body-md-medium-size,14px)] font-medium leading-[var(--body-md-medium-line-height,20px)] text-[var(--container-static-neutral-bold-foreground,#f7f7fa)]">{label}</p>
    </div>
  );
}

const glossary = [
  { badge: "Stage", text: "Are the steps of a process, its different phases. They can be linear or non linear." },
  { badge: "State", text: "The condition of something at a specific time." },
  {
    badge: "Status",
    text: "Express the outcome of a step. When there are background processes involved, they can yield different outcomes.",
  },
];

/* ---------- Page ---------- */

export default function StepperPage() {
  return (
    <section aria-label="Stepper component playground" className="flex flex-col gap-6">
      <Playground config={indicatorConfig} />
      <Playground config={stageConfig} />
      <Playground config={horizontalConfig} />
      <Playground config={verticalConfig} />

      {/* Reference material kept collapsed by default */}
      <details className="rounded-xl border border-[var(--border-static-subtle-neutral,#e1e1e8)] bg-[var(--surface-background-lvl1,#ffffff)]">
        <summary className="cursor-pointer px-4 py-3 text-[length:var(--body-md-medium-size,14px)] font-medium text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]">
          Reference — Glossary &amp; status usage
        </summary>
        <div className="flex flex-col gap-8 border-t border-[var(--border-static-subtle-neutral,#e1e1e8)] px-4 py-5">
          {/* Glossary */}
          <div className="flex flex-col gap-3">
            {glossary.map((d) => (
              <div key={d.badge} className="flex items-start gap-3">
                <GlossaryBadge label={d.badge} />
                <p className="pt-[6px] text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]">{d.text}</p>
              </div>
            ))}
          </div>

          {/* Status usage */}
          <div className="flex flex-col gap-6">
            {statusUsage.map((row, i) => (
              <div key={i} className="flex items-start gap-5">
                <StepperIndicator state={row.state} />
                <div className="w-[220px] shrink-0 text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]">
                  {row.title.split(" / ").map((t) => (
                    <p key={t}>{t}</p>
                  ))}
                </div>
                <p className="min-w-px flex-[1_0_0] text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)] text-[var(--surface-foreground-static-neutral-lvl3,#717180)]">{row.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </details>
    </section>
  );
}
