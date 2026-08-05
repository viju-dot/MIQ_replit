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

function Caption({ children }: { children: React.ReactNode }) {
  return <span className="text-[12px] text-[#a8a8b2]">{children}</span>;
}

function GroupCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
      <span className="text-[12px] font-medium text-[#717180]">{title}</span>
      <div className="flex flex-wrap gap-x-10 gap-y-8">{children}</div>
    </div>
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
    <div className="flex flex-col gap-3">
      <Caption>{label}</Caption>
      <div className="rounded-[5px] bg-[#f7f7fa] p-8 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

export default function EmptyStatePage(): JSX.Element {
  return (
    <section aria-label="Empty State component variants" className="flex flex-col gap-6">
      {/* Default component with full actions */}
      <GroupCard title="Empty State — default">
        <Variant label="Default (3 actions)">
          <EmptyState />
        </Variant>
      </GroupCard>

      {/* Action count variants */}
      <GroupCard title="Action variants">
        <Variant label="Primary only">
          <EmptyState prop2Button={false} prop3Button={false} />
        </Variant>
        <Variant label="Primary + Secondary">
          <EmptyState prop3Button={false} />
        </Variant>
        <Variant label="No actions">
          <EmptyState actions={false} />
        </Variant>
      </GroupCard>

      {/* Separators between actions */}
      <GroupCard title="With dot separators">
        <Variant label="Ellipse separators">
          <EmptyState ellipse1 ellipse2 />
        </Variant>
      </GroupCard>

      {/* Illustration variants */}
      <GroupCard title="Illustration templates">
        <Variant label="ScreenLock">
          <EmptyState
            illustration="screenLock"
            heading="Access locked"
            description="Sorry. You are not authorized to view this page"
            prop2Button={false}
            prop3Button={false}
          />
        </Variant>
        <Variant label="WomanMagnifyingGlass">
          <EmptyState
            illustration="womanMagnifying"
            heading="No results found"
            description="Try adjusting your search or filters to find what you are looking for"
            prop2Button={false}
            prop3Button={false}
          />
        </Variant>
        <Variant label="LaunchAirplane">
          <EmptyState
            illustration="launchAirplane"
            heading="Nothing here yet"
            description="Get started by creating your first item"
            prop2Button={false}
            prop3Button={false}
          />
        </Variant>
      </GroupCard>
    </section>
  );
}
