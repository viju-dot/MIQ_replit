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
    <div className="flex flex-col items-start gap-[2px]">
      <p
        className={`whitespace-nowrap text-center text-[14px] leading-[20px] text-[#13131a] ${
          active ? "font-medium" : "font-normal"
        }`}
      >
        {stageName}
      </p>
      {hasMetadata && (
        <div className="flex max-h-[38px] max-w-[108px] items-start justify-center gap-[4px]">
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-center text-[12px] font-normal leading-[18px] text-[#717180]">
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
    <div className={`flex shrink-0 flex-col items-start gap-[12px] ${fixedWidth ? "w-[24px]" : ""}`}>
      <StepperIndicator state={state} />
      <StageAndMetadata active={active} hasMetadata={hasMetadata} stageName={stageName} />
    </div>
  );
}

function HLine() {
  return (
    <div className="relative h-[24px] min-w-px flex-[1_0_0]">
      <div className="absolute left-0 right-0 top-[11px] h-[2px] bg-[#e1e1e8]" />
    </div>
  );
}

function StepperHorizontal({ steps }: { steps: 2 | 3 | 4 | 5 }) {
  const withMetadata = steps === 5;
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

function StepperVertical({ steps }: { steps: 2 | 3 | 4 | 5 }) {
  const items = Array.from({ length: steps }, (_, i) => i + 1);
  return (
    <div className="flex flex-col items-start">
      {items.map((n, idx) => (
        <div key={n} className="flex flex-col items-start">
          <div className="flex h-[24px] items-start gap-[12px]">
            <StepperIndicator state={n === 1 ? "active-none" : "inactive-none"} />
            <StageAndMetadata active={n === 1} stageName={`Step ${n}`} />
          </div>
          {idx !== items.length - 1 && (
            <div className="flex items-center pl-[11px]">
              <div className={`h-[40px] w-[2px] ${n === 1 ? "bg-[#7c33b5]" : "bg-[#e1e1e8]"}`} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------- Small helpers ---------- */

function Caption({ children }: { children: React.ReactNode }) {
  return <span className="text-[12px] text-[#a8a8b2]">{children}</span>;
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-4 rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
      <h2 className="text-[16px] font-medium text-[#13131a]">{title}</h2>
      {children}
    </div>
  );
}

function GlossaryBadge({ label }: { label: string }) {
  return (
    <div className="flex h-[34px] items-center rounded-[2px] bg-[#4b4b59] p-[8px]">
      <p className="whitespace-nowrap text-center text-[14px] font-medium leading-[20px] text-[#f7f7fa]">{label}</p>
    </div>
  );
}

/* ---------- Page ---------- */

const indicatorStates: { state: IndicatorState; label: string }[] = [
  { state: "active-none", label: "Active · Status None" },
  { state: "inactive-none", label: "Inactive · Status None" },
  { state: "active-waiting", label: "Active · Waiting" },
  { state: "active-warning", label: "Active · Warning" },
  { state: "active-success", label: "Active · Success" },
  { state: "active-error", label: "Active · Error" },
  { state: "complete-success", label: "Complete · Success" },
  { state: "complete-warning", label: "Complete · Warning" },
];

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

export default function StepperPage() {
  return (
    <section className="flex flex-col gap-8">
      {/* Glossary */}
      <Card title="Glossary">
        <div className="flex flex-col gap-3">
          {[
            { badge: "Stage", text: "Are the steps of a process, its different phases. They can be linear or non linear." },
            { badge: "State", text: "The condition of something at a specific time." },
            {
              badge: "Status",
              text: "Express the outcome of a step. When there are background processes involved, they can yield different outcomes.",
            },
          ].map((d) => (
            <div key={d.badge} className="flex items-start gap-3">
              <GlossaryBadge label={d.badge} />
              <p className="pt-[6px] text-[14px] leading-[20px] text-[#13131a]">{d.text}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Indicator states */}
      <Card title="Stepper indicator — states">
        <div className="flex flex-wrap gap-6">
          {indicatorStates.map((s) => (
            <div key={s.state} className="flex flex-col items-center gap-2">
              <div className="flex h-9 items-center justify-center">
                <StepperIndicator state={s.state} />
              </div>
              <Caption>{s.label}</Caption>
            </div>
          ))}
        </div>
      </Card>

      {/* Status usage */}
      <Card title="Status usage">
        <div className="flex flex-col gap-6">
          {statusUsage.map((row, i) => (
            <div key={i} className="flex items-start gap-5">
              <StepperIndicator state={row.state} />
              <div className="w-[220px] shrink-0 text-[14px] leading-[20px] text-[#13131a]">
                {row.title.split(" / ").map((t) => (
                  <p key={t}>{t}</p>
                ))}
              </div>
              <p className="min-w-px flex-[1_0_0] text-[14px] leading-[20px] text-[#717180]">{row.desc}</p>
            </div>
          ))}
        </div>
      </Card>

      {/* Horizontal steppers */}
      <Card title="Stepper — Horizontal">
        <div className="flex flex-col gap-8">
          {([2, 3, 4, 5] as const).map((n) => (
            <div key={n} className="flex flex-col gap-2">
              <Caption>{`${n} Steps`}</Caption>
              <div className="max-w-[920px]">
                <StepperHorizontal steps={n} />
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Vertical steppers */}
      <Card title="Stepper — Vertical">
        <div className="flex flex-wrap items-start gap-12">
          {([2, 3, 4, 5] as const).map((n) => (
            <div key={n} className="flex flex-col gap-2">
              <Caption>{`${n} Steps`}</Caption>
              <StepperVertical steps={n} />
            </div>
          ))}
        </div>
      </Card>

      {/* Stage + metadata */}
      <Card title="Stage and metadata">
        <div className="flex flex-wrap gap-10">
          <div className="flex flex-col gap-2">
            <Caption>Active = True</Caption>
            <div className="flex items-start gap-3">
              <StepperIndicator state="active-none" />
              <StageAndMetadata active hasMetadata stageName="Step 1" />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Caption>Active = False</Caption>
            <div className="flex items-start gap-3">
              <StepperIndicator state="inactive-none" />
              <StageAndMetadata hasMetadata stageName="Step 1" />
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}
