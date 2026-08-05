type ProgressState = "Alert" | "Info" | "Success" | "Warning" | "Pause";

const STATE_COLORS: Record<ProgressState, string> = {
  Alert: "#da294b",
  Info: "#2360db",
  Success: "#1e8158",
  Warning: "#f8c500",
  Pause: "#c76217",
};

const STATES: ProgressState[] = ["Alert", "Info", "Success", "Warning", "Pause"];

const BASE_COLOR = "#e1e1e8";
const LABEL_COLOR = "#13131a";
const CAPTION = "text-[12px] text-[#a8a8b2]";

/** Bar-only variant (no labels). height 6px, width 288px, fill 63.89% */
function BarOnly({ state }: { state: ProgressState }) {
  return (
    <div className="relative h-[6px] w-[288px] rounded-[4px]">
      <div
        className="absolute inset-0 rounded-[4px]"
        style={{ backgroundColor: BASE_COLOR }}
      />
      <div
        className="absolute rounded-[4px]"
        style={{
          top: 0,
          bottom: 0,
          left: 0,
          right: "36.11%",
          backgroundColor: STATE_COLORS[state],
        }}
      />
    </div>
  );
}

/** Label-right-only variant. height 32px, width 287px, "55%" right-aligned label above, fill 53.66% */
function LabelRight({ state }: { state: ProgressState }) {
  return (
    <div className="relative h-[32px] w-[287px]">
      <p
        className="absolute right-px top-0 w-[27px] text-right font-['DM_Sans'] text-[12px] not-italic leading-[18px]"
        style={{ color: LABEL_COLOR }}
      >
        55%
      </p>
      <div
        className="absolute rounded-[4px]"
        style={{ top: "81.25%", bottom: 0, left: 0, right: 0, backgroundColor: BASE_COLOR }}
      />
      <div
        className="absolute rounded-[4px]"
        style={{
          top: "81.25%",
          bottom: 0,
          left: 0,
          right: "46.34%",
          backgroundColor: STATE_COLORS[state],
        }}
      />
    </div>
  );
}

/** Label-left + label-right variant. height 32px, width 322px, "0 minutes remaining" left + "55%" right, fill 53.73% */
function LabelBoth({ state }: { state: ProgressState }) {
  return (
    <div className="relative h-[32px] w-[322px]">
      <p
        className="absolute left-0 top-0 whitespace-nowrap font-['DM_Sans'] text-[12px] not-italic leading-[18px]"
        style={{ color: LABEL_COLOR, right: "64.6%", bottom: "43.75%" }}
      >
        0 minutes remaining
      </p>
      <p
        className="absolute whitespace-nowrap text-right font-['DM_Sans'] text-[12px] not-italic leading-[18px]"
        style={{ color: LABEL_COLOR, left: "92.24%", top: 0, right: 0, bottom: "43.75%" }}
      >
        55%
      </p>
      <div
        className="absolute rounded-[4px]"
        style={{ top: "81.25%", bottom: 0, left: 0, right: 0, backgroundColor: BASE_COLOR }}
      />
      <div
        className="absolute rounded-[4px]"
        style={{
          top: "81.25%",
          bottom: 0,
          left: 0,
          right: "46.27%",
          backgroundColor: STATE_COLORS[state],
        }}
      />
    </div>
  );
}

/** Label-left only variant. height 32px, width 322px, "0 minutes remaining" left, fill 53.73% */
function LabelLeft({ state }: { state: ProgressState }) {
  return (
    <div className="relative h-[32px] w-[322px]">
      <p
        className="absolute left-0 top-0 whitespace-nowrap font-['DM_Sans'] text-[12px] not-italic leading-[18px]"
        style={{ color: LABEL_COLOR, right: "64.6%", bottom: "43.75%" }}
      >
        0 minutes remaining
      </p>
      <div
        className="absolute rounded-[4px]"
        style={{ top: "81.25%", bottom: 0, left: 0, right: 0, backgroundColor: BASE_COLOR }}
      />
      <div
        className="absolute rounded-[4px]"
        style={{
          top: "81.25%",
          bottom: 0,
          left: 0,
          right: "46.27%",
          backgroundColor: STATE_COLORS[state],
        }}
      />
    </div>
  );
}

export default function ProgressPage(): JSX.Element {
  return (
    <section aria-label="Progress bar states" className="flex flex-col gap-8">
      {/* Bar only — no labels */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <h3 className="mb-4 text-[14px] font-medium text-[#13131a]">
          Progress bar (no labels)
        </h3>
        <div className="flex flex-wrap gap-x-24 gap-y-6">
          {STATES.map((state) => (
            <div key={state} className="flex flex-col gap-2">
              <span className={CAPTION}>{state}</span>
              <BarOnly state={state} />
            </div>
          ))}
        </div>
      </div>

      {/* Label right */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <h3 className="mb-4 text-[14px] font-medium text-[#13131a]">
          Progress bar + right label
        </h3>
        <div className="flex flex-wrap gap-x-24 gap-y-6">
          {STATES.map((state) => (
            <div key={state} className="flex flex-col gap-2">
              <span className={CAPTION}>{state} · Label right</span>
              <LabelRight state={state} />
            </div>
          ))}
        </div>
      </div>

      {/* Label left + right */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <h3 className="mb-4 text-[14px] font-medium text-[#13131a]">
          Progress bar + left &amp; right labels
        </h3>
        <div className="flex flex-wrap gap-x-24 gap-y-6">
          {STATES.map((state) => (
            <div key={state} className="flex flex-col gap-2">
              <span className={CAPTION}>{state} · Label left + right</span>
              <LabelBoth state={state} />
            </div>
          ))}
        </div>
      </div>

      {/* Label left only */}
      <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
        <h3 className="mb-4 text-[14px] font-medium text-[#13131a]">
          Progress bar + left label
        </h3>
        <div className="flex flex-wrap gap-x-24 gap-y-6">
          {STATES.map((state) => (
            <div key={state} className="flex flex-col gap-2">
              <span className={CAPTION}>{state} · Label left</span>
              <LabelLeft state={state} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
