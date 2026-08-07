const imgGroup257 = "https://www.figma.com/api/mcp/asset/cd5af0d5-49d8-47ef-a05b-b38c89c829ce.svg";
const imgVectorFrame = "https://www.figma.com/api/mcp/asset/dcc0b1dd-a275-4bf0-87db-961e14884263.svg";
const imgEllipse15 = "https://www.figma.com/api/mcp/asset/d7f07f3b-1d37-4e71-a4ee-19d1a1222ed6.svg";
const imgVectorFrame1 = "https://www.figma.com/api/mcp/asset/73d82547-0f4e-4f0e-9b14-1cbeee7c7424.svg";
const imgEllipse14 = "https://www.figma.com/api/mcp/asset/1f815d22-50c6-4905-a789-8c03cd770047.svg";
const imgVectorFrame2 = "https://www.figma.com/api/mcp/asset/0ff39ced-8279-4ad3-b8c8-adf68733f51b.svg";

type IllustrationsProps = {
  className?: string;
  style?: "Mixed";
  template?: "ScreenLock";
};

function Illustrations({ className, style = "Mixed", template = "ScreenLock" }: IllustrationsProps) {
  return (
    <div className={className || "overflow-clip relative size-[200px]"} data-node-id="39175:91479">
      <div className="absolute inset-[19.73%_0_0.12%_0]" data-node-id="39175:91480">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup257} />
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
  prop1Button?: boolean;
  prop2Button?: boolean;
  prop3Button?: boolean;
};

export default function EmptyState({ className, actions = true, description = "Sorry. You are not authorized to view this page", ellipse1 = false, ellipse2 = false, heading = "Place holder here!", prop1Button = true, prop2Button = true, prop3Button = true }: EmptyStateProps) {
  return (
    <div className={className || "content-stretch flex flex-col items-start min-w-[280px] relative w-[587px]"} data-node-id="39462:71969" data-name="Empty State">
      <div className="content-stretch flex flex-col gap-[var(--spacing\/300,24px)] items-center relative shrink-0 w-full" data-node-id="39462:71937" data-name="Empty State">
        <Illustrations className="overflow-clip relative shrink-0 size-[200px]" />
        <div className="content-stretch flex flex-col gap-[var(--spacing\/250,20px)] items-center relative shrink-0 w-full" data-node-id="39462:71939" data-name="Content">
          <div className="[word-break:break-word] content-stretch flex flex-col font-['DM_Sans:Medium'] gap-[var(--spacing\/100,8px)] items-center not-italic relative shrink-0 text-center w-full" data-node-id="39462:71940" data-name="Text">
            <p className="leading-[32px] relative shrink-0 text-[24px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] tracking-[-0.36px] w-full" data-node-id="39462:71941">
              {heading}
            </p>
            <p className="leading-[24px] relative shrink-0 text-[16px] text-[color:var(--surface/foreground/static/neutral/lvl3,#717180)] tracking-[-0.08px] w-full" data-node-id="39462:71942">
              {description}
            </p>
          </div>
          {actions && (
            <div className="content-center flex flex-wrap gap-[var(--spacing\/150,12px)] items-center justify-center relative shrink-0 w-full" data-node-id="39462:71943" data-name="Actions">
              {prop3Button && (
                <div className="border-[length:var(--stroke_weight\/15,1px)] border-[var(--border/dynamic/neutral/bold/default,#4b4b59)] border-solid content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-center px-[var(--spacing\/150,12px)] py-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="39462:71944" data-name="Button">
                  <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-center justify-center relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I39462:71944;45750:1617" data-name="button-medium">
                    <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I39462:71944;45750:1618" data-name="Style=Regular, Size=20, State=Default">
                      <div className="relative shrink-0 size-[16.25px]" data-node-id="I39462:71944;45750:1618;28637:11394" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame} />
                      </div>
                    </div>
                    <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] text-center whitespace-nowrap" data-node-id="I39462:71944;45750:1619">
                      Default
                    </p>
                    <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I39462:71944;45750:1620" data-name="Style=Regular, Size=20, State=Default">
                      <div className="relative shrink-0 size-[16.25px]" data-node-id="I39462:71944;45750:1620;28637:11394" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {ellipse1 && (
                <div className="relative shrink-0 size-[4px]" data-node-id="53852:23500">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse15} />
                </div>
              )}
              {prop2Button && (
                <div className="border-[length:var(--stroke_weight\/15,1px)] border-[var(--border/dynamic/brand/default,#7c33b5)] border-solid content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-center px-[var(--spacing\/150,12px)] py-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="53852:23475" data-name="Button">
                  <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-center justify-center relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I53852:23475;45750:1600" data-name="button-medium">
                    <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I53852:23475;45750:1601" data-name="Style=Regular, Size=20, State=Default">
                      <div className="relative shrink-0 size-[16.25px]" data-node-id="I53852:23475;45750:1601;28637:11394" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame1} />
                      </div>
                    </div>
                    <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/Brand/Subtle/foreground/default,#7c33b5)] text-center whitespace-nowrap" data-node-id="I53852:23475;45750:1602">
                      Default
                    </p>
                    <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I53852:23475;45750:1603" data-name="Style=Regular, Size=20, State=Default">
                      <div className="relative shrink-0 size-[16.25px]" data-node-id="I53852:23475;45750:1603;28637:11394" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame1} />
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {ellipse2 && (
                <div className="relative shrink-0 size-[4px]" data-node-id="39462:71945">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse14} />
                </div>
              )}
              {prop1Button && (
                <div className="bg-[var(--container/dynamic/brand/bold/background/default,#7c33b5)] content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-center px-[var(--spacing\/150,12px)] py-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="39462:71946" data-name="Button">
                  <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-center justify-center relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I39462:71946;45750:1539" data-name="button-medium">
                    <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I39462:71946;45750:1540" data-name="Style=Regular, Size=20, State=Default">
                      <div className="relative shrink-0 size-[16.25px]" data-node-id="I39462:71946;45750:1540;28637:11394" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame2} />
                      </div>
                    </div>
                    <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/brand/bold/foreground/default,white)] text-center whitespace-nowrap" data-node-id="I39462:71946;45750:1541">
                      Default
                    </p>
                    <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I39462:71946;45750:1542" data-name="Style=Regular, Size=20, State=Default">
                      <div className="relative shrink-0 size-[16.25px]" data-node-id="I39462:71946;45750:1542;28637:11394" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame2} />
                      </div>
                    </div>
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
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
These styles are contained in the design: Headline Md/Medium: Font(family: "DM Sans", style: Medium, size: 24, weight: 500, lineHeight: 32, letterSpacing: -1.5), Headline Xs/Medium: Font(family: "DM Sans", style: Medium, size: 16, weight: 500, lineHeight: 24, letterSpacing: -0.5), Body Md/Medium: Font(family: "DM Sans", style: Medium, size: 14, weight: 500, lineHeight: 20, letterSpacing: 0).
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.