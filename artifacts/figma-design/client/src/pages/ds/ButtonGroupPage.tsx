const ASSET = "/figmaAssets/button-group";

type Side = "Left" | "Middle" | "Right";
type State = "Selected" | "Unselected" | "Hover" | "Disabled";

// ---------------------------------------------------------------------------
// Design tokens (converted from Figma CSS variables to plain fallback values)
// ---------------------------------------------------------------------------
const BG: Record<State, string> = {
  Selected: "#ebebf0",
  Unselected: "#ffffff",
  Hover: "rgba(113,113,128,0.08)",
  Disabled: "rgba(113,113,128,0.1)",
};
const TEXT: Record<State, string> = {
  Selected: "#13131a",
  Unselected: "#4b4b59",
  Hover: "#13131a",
  Disabled: "#a8a8b2",
};
const BORDER = (state: State) => (state === "Disabled" ? "#e1e1e8" : "#c6c6cc");

// End-corner radius depending on side (adjacent sides overlap by -1px)
function radiusStyle(side: Side): React.CSSProperties {
  if (side === "Left") {
    return { borderTopLeftRadius: 2, borderBottomLeftRadius: 2 };
  }
  if (side === "Right") {
    return { borderTopRightRadius: 2, borderBottomRightRadius: 2 };
  }
  return {};
}

// ---------------------------------------------------------------------------
// Icon (table) button — single segment
// ---------------------------------------------------------------------------
function iconSrc(state: State, compact: boolean): string {
  const size = compact ? "small" : "medium";
  const key =
    state === "Disabled"
      ? "disabled"
      : state === "Hover"
        ? "hover"
        : state === "Unselected"
          ? "unselected"
          : "selected";
  return `${ASSET}/table-${key}-${size}.svg`;
}

type IconSegmentProps = {
  side: Side;
  state: State;
  compact: boolean;
  overlap?: boolean;
};

function IconSegment({ side, state, compact, overlap = false }: IconSegmentProps) {
  const boxClass = compact ? "h-[24px] w-[34px]" : "size-[34px]";
  const iconBoxSize = compact ? 16 : 24;
  return (
    <div
      className={`relative shrink-0 overflow-hidden ${boxClass} ${overlap ? "mr-[-1px]" : ""}`}
      style={radiusStyle(side)}
    >
      {/* base fill + border */}
      <div
        className="absolute inset-0 border border-solid"
        style={{
          backgroundColor: BG[state],
          borderColor: BORDER(state),
          ...radiusStyle(side),
        }}
      />
      {/* icon */}
      <div
        className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center justify-center"
        style={{ width: iconBoxSize, height: iconBoxSize }}
      >
        <img
          alt=""
          className="block size-full max-w-none"
          src={iconSrc(state, compact)}
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Text button — single segment
// ---------------------------------------------------------------------------
type TextSegmentProps = {
  side: Side;
  state: State;
  compact: boolean;
  overlap?: boolean;
};

function TextSegment({ side, state, compact, overlap = false }: TextSegmentProps) {
  return (
    <div
      className={`relative flex shrink-0 items-center justify-center px-[24px] border border-solid ${
        compact ? "h-[24px] py-[2.5px]" : "h-[34px] py-[7px]"
      } ${overlap ? "mr-[-1px]" : ""}`}
      style={{
        backgroundColor: BG[state],
        borderColor: BORDER(state),
        ...radiusStyle(side),
      }}
    >
      <p
        className={`whitespace-nowrap text-center font-['DM_Sans'] ${
          compact ? "text-[12px] leading-[18px]" : "text-[14px] leading-[20px]"
        }`}
        style={{ color: TEXT[state] }}
      >
        Button
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Composed groups
// ---------------------------------------------------------------------------
function sideForIndex(index: number, total: number): Side {
  if (index === 0) return "Left";
  if (index === total - 1) return "Right";
  return "Middle";
}

type TextGroupProps = { amount: number; compact: boolean };

function TextButtonGroup({ amount, compact }: TextGroupProps) {
  // First item selected, remaining unselected — matches the Figma composite.
  return (
    <div className="flex items-start">
      {Array.from({ length: amount }).map((_, i) => (
        <TextSegment
          key={i}
          side={sideForIndex(i, amount)}
          state={i === 0 ? "Selected" : "Unselected"}
          compact={compact}
          overlap={i < amount - 1}
        />
      ))}
    </div>
  );
}

type IconGroupProps = { amount: number; compact: boolean };

function IconButtonGroup({ amount, compact }: IconGroupProps) {
  // First item selected, remaining unselected.
  return (
    <div className="flex items-start">
      {Array.from({ length: amount }).map((_, i) => (
        <IconSegment
          key={i}
          side={sideForIndex(i, amount)}
          state={i === 0 ? "Selected" : "Unselected"}
          compact={compact}
          overlap={i < amount - 1}
        />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers for the showcase layout
// ---------------------------------------------------------------------------
function Card({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
      <h2 className="mb-4 text-[14px] font-medium text-[#13131a] font-['DM_Sans']">
        {title}
      </h2>
      {children}
    </div>
  );
}

function Caption({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[12px] leading-[18px] text-[#a8a8b2] font-['DM_Sans']">
      {children}
    </span>
  );
}

function Variant({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <Caption>{label}</Caption>
      {children}
    </div>
  );
}

const STATES: State[] = ["Selected", "Unselected", "Hover", "Disabled"];
const SIDES: Side[] = ["Left", "Middle", "Right"];
const AMOUNTS = [2, 3, 4, 5];

export default function ButtonGroupPage() {
  return (
    <section className="flex flex-col gap-6">
      {/* Text button group — composed */}
      <Card title="Button Group">
        <div className="flex flex-wrap gap-x-12 gap-y-6">
          <div className="flex flex-col gap-4">
            <Caption>Compact=No</Caption>
            <div className="flex flex-col gap-4">
              {AMOUNTS.map((n) => (
                <Variant key={n} label={`${n} Items`}>
                  <TextButtonGroup amount={n} compact={false} />
                </Variant>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Caption>Compact=Yes</Caption>
            <div className="flex flex-col gap-4">
              {AMOUNTS.map((n) => (
                <Variant key={n} label={`${n} Items`}>
                  <TextButtonGroup amount={n} compact />
                </Variant>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Icon button group — composed */}
      <Card title="Button Icon Group">
        <div className="flex flex-wrap gap-x-12 gap-y-6">
          <div className="flex flex-col gap-4">
            <Caption>Compact=No</Caption>
            <div className="flex flex-col gap-4">
              {AMOUNTS.map((n) => (
                <Variant key={n} label={`${n} Items`}>
                  <IconButtonGroup amount={n} compact={false} />
                </Variant>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Caption>Compact=Yes</Caption>
            <div className="flex flex-col gap-4">
              {AMOUNTS.map((n) => (
                <Variant key={n} label={`${n} Items`}>
                  <IconButtonGroup amount={n} compact />
                </Variant>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Text individuals — every side / state / size */}
      <Card title="Button Group [individuals]">
        <div className="flex flex-col gap-6">
          {[false, true].map((compact) => (
            <div key={compact ? "c" : "n"} className="flex flex-col gap-4">
              <Caption>{compact ? "Compact=Yes" : "Compact=No"}</Caption>
              <div className="flex flex-wrap gap-x-10 gap-y-4">
                {SIDES.map((side) => (
                  <div key={side} className="flex flex-col gap-4">
                    {STATES.map((state) => (
                      <Variant key={state} label={`${side} / ${state}`}>
                        <div className="flex">
                          <TextSegment
                            side={side}
                            state={state}
                            compact={compact}
                          />
                        </div>
                      </Variant>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Icon individuals — every side / state / size */}
      <Card title="Button Group Icon [individuals]">
        <div className="flex flex-col gap-6">
          {[false, true].map((compact) => (
            <div key={compact ? "c" : "n"} className="flex flex-col gap-4">
              <Caption>{compact ? "Compact=Yes" : "Compact=No"}</Caption>
              <div className="flex flex-wrap gap-x-10 gap-y-4">
                {SIDES.map((side) => (
                  <div key={side} className="flex flex-col gap-4">
                    {STATES.map((state) => (
                      <Variant key={state} label={`${side} / ${state}`}>
                        <div className="flex">
                          <IconSegment
                            side={side}
                            state={state}
                            compact={compact}
                          />
                        </div>
                      </Variant>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </section>
  );
}
