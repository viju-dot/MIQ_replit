import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

const ASSET = "/figmaAssets/empty-state";

const illustrations = {
  screenLock: `${ASSET}/illustration-screenlock.svg`,
  womanMagnifying: `${ASSET}/illustration-woman-magnifying.svg`,
  launchAirplane: `${ASSET}/illustration-launch-airplane.svg`,
} as const;

const imgButtonIconNeutral = `${ASSET}/button-icon-neutral.svg`;
const imgButtonIconBrand = `${ASSET}/button-icon-brand.svg`;
const imgButtonIconBold = `${ASSET}/button-icon-bold.svg`;
const imgEllipseDot1 = `${ASSET}/ellipse-dot-1.svg`;
const imgEllipseDot2 = `${ASSET}/ellipse-dot-2.svg`;

type IllustrationKey = keyof typeof illustrations;

const ILLUSTRATION_LABELS: Record<string, IllustrationKey> = {
  ScreenLock: "screenLock",
  WomanMagnifyingGlass: "womanMagnifying",
  LaunchAirplane: "launchAirplane",
};

function ButtonIcon({ src }: { src: string }) {
  return (
    <div className="flex items-center justify-center p-[2px] shrink-0 size-[20px]">
      <div className="relative shrink-0 size-[16.25px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={src} />
      </div>
    </div>
  );
}

type EmptyStateProps = {
  className?: string;
  actions?: boolean;
  description?: string;
  ellipse1?: boolean;
  ellipse2?: boolean;
  heading?: string;
  illustration?: IllustrationKey;
  prop1Button?: boolean;
  prop2Button?: boolean;
  prop3Button?: boolean;
};

function EmptyState({
  className,
  actions = true,
  description = "Sorry. You are not authorized to view this page",
  ellipse1 = false,
  ellipse2 = false,
  heading = "Place holder here!",
  illustration = "screenLock",
  prop1Button = true,
  prop2Button = true,
  prop3Button = true,
}: EmptyStateProps) {
  return (
    <div
      className={
        className ||
        "flex flex-col items-start min-w-[280px] w-full max-w-[587px]"
      }
      data-name="Empty State"
    >
      <div className="flex flex-col gap-[24px] items-center w-full">
        {/* Illustration */}
        <div className="overflow-clip relative shrink-0 size-[200px]">
          <img
            alt=""
            className="absolute block inset-0 max-w-none size-full object-contain"
            src={illustrations[illustration]}
          />
        </div>

        {/* Content */}
        <div className="flex flex-col gap-[20px] items-center w-full">
          <div className="[word-break:break-word] flex flex-col gap-[8px] items-center text-center w-full">
            <p className="leading-[32px] shrink-0 text-[24px] font-medium text-[#13131a] tracking-[-0.36px] w-full">
              {heading}
            </p>
            <p className="leading-[24px] shrink-0 text-[16px] text-[#717180] tracking-[-0.08px] w-full">
              {description}
            </p>
          </div>

          {actions && (
            <div className="content-center flex flex-wrap gap-[12px] items-center justify-center w-full">
              {/* Tertiary / neutral outlined button */}
              {prop3Button && (
                <div className="border border-solid border-[#4b4b59] flex gap-0 items-center justify-center px-[12px] py-[7px] rounded-[2px] shrink-0">
                  <div className="flex gap-[4px] items-center justify-center rounded-[2px] shrink-0">
                    <ButtonIcon src={imgButtonIconNeutral} />
                    <p className="leading-[20px] text-[14px] font-medium text-[#4b4b59] text-center whitespace-nowrap">
                      Default
                    </p>
                    <ButtonIcon src={imgButtonIconNeutral} />
                  </div>
                </div>
              )}

              {ellipse1 && (
                <div className="relative shrink-0 size-[4px]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipseDot1} />
                </div>
              )}

              {/* Secondary / brand outlined button */}
              {prop2Button && (
                <div className="border border-solid border-[#7c33b5] flex gap-0 items-center justify-center px-[12px] py-[7px] rounded-[2px] shrink-0">
                  <div className="flex gap-[4px] items-center justify-center rounded-[2px] shrink-0">
                    <ButtonIcon src={imgButtonIconBrand} />
                    <p className="leading-[20px] text-[14px] font-medium text-[#7c33b5] text-center whitespace-nowrap">
                      Default
                    </p>
                    <ButtonIcon src={imgButtonIconBrand} />
                  </div>
                </div>
              )}

              {ellipse2 && (
                <div className="relative shrink-0 size-[4px]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipseDot2} />
                </div>
              )}

              {/* Primary / brand bold button */}
              {prop1Button && (
                <div className="bg-[#7c33b5] flex gap-0 items-center justify-center px-[12px] py-[7px] rounded-[2px] shrink-0">
                  <div className="flex gap-[4px] items-center justify-center rounded-[2px] shrink-0">
                    <ButtonIcon src={imgButtonIconBold} />
                    <p className="leading-[20px] text-[14px] font-medium text-white text-center whitespace-nowrap">
                      Default
                    </p>
                    <ButtonIcon src={imgButtonIconBold} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const config: PlaygroundConfig = {
  name: "Empty State",
  description:
    "Placeholder layout with illustration, heading, description, and up to three actions.",
  controls: [
    {
      kind: "select",
      name: "illustration",
      label: "Illustration",
      options: ["ScreenLock", "WomanMagnifyingGlass", "LaunchAirplane"],
      defaultValue: "ScreenLock",
      asTabs: true,
    },
    {
      kind: "text",
      name: "heading",
      label: "Heading",
      defaultValue: "Place holder here!",
      placeholder: "Heading text",
    },
    {
      kind: "text",
      name: "description",
      label: "Description",
      defaultValue: "Sorry. You are not authorized to view this page",
      placeholder: "Description text",
    },
    { kind: "boolean", name: "actions", label: "Show actions", defaultValue: true },
    { kind: "boolean", name: "prop1Button", label: "Primary button", defaultValue: true },
    { kind: "boolean", name: "prop2Button", label: "Secondary button", defaultValue: true },
    { kind: "boolean", name: "prop3Button", label: "Tertiary button", defaultValue: true },
    { kind: "boolean", name: "ellipse1", label: "Dot separator 1", defaultValue: false },
    { kind: "boolean", name: "ellipse2", label: "Dot separator 2", defaultValue: false },
  ],
  render: (props: PropValues) => (
    <EmptyState
      illustration={ILLUSTRATION_LABELS[String(props.illustration)] ?? "screenLock"}
      heading={String(props.heading)}
      description={String(props.description)}
      actions={props.actions === true}
      prop1Button={props.prop1Button === true}
      prop2Button={props.prop2Button === true}
      prop3Button={props.prop3Button === true}
      ellipse1={props.ellipse1 === true}
      ellipse2={props.ellipse2 === true}
    />
  ),
  tokens: {
    "container/brand/bold/background": "#7c33b5",
    "border/brand": "#7c33b5",
    "border/neutral": "#4b4b59",
    "text/heading": "#13131a",
    "text/description": "#717180",
    "text/action/neutral": "#4b4b59",
    "text/action/brand": "#7c33b5",
    "radius/button": "2px",
    "size/illustration": "200px",
    "gap/content": "24px",
  },
};

export default function EmptyStatePage(): JSX.Element {
  return (
    <section aria-label="Empty State component playground" className="flex flex-col gap-6">
      <Playground config={config} />
    </section>
  );
}
