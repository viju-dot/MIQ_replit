# Pagination (page node 186:2494)

## Page structure (XML metadata)

<canvas id="186:2494" name="Pagination" x="0" y="0" width="0" height="0">
  <frame id="49788:4537" name="Elevation" x="-2390" y="-1098" width="1108" height="1459">
    <instance id="49788:4538" name="_title" x="80" y="80" width="948" height="488" />
    <frame id="49792:16080" name="Frame 1" x="80" y="631" width="948" height="748">
      <frame id="49792:16079" name="Frame 1" x="0" y="0" width="948" height="361">
        <text id="49788:16075" name="Pagination" x="48" y="48" width="852" height="24" />
        <frame id="49788:16065" name="Frame 1" x="380" y="135" width="188" height="178">
          <frame id="49788:16066" name="Frame 1" x="29" y="0" width="152" height="42">
            <text id="49788:16067" name="Button - icon only:true" x="0" y="0" width="152" height="20" />
            <vector id="49788:16068" name="Vector 2" x="43" y="42" width="66" height="12" />
          </frame>
          <frame id="49788:4974" name="wrapper" x="0" y="52" width="147" height="74">
            <symbol id="4408:9644" name="Pagination" x="14" y="20" width="119" height="34" />
          </frame>
          <frame id="49788:16070" name="Frame 2" x="-5" y="136" width="102" height="42">
            <vector id="49788:16071" name="Vector 1" x="18" y="0" width="66" height="12" />
            <text id="49788:16072" name="Pagination label" x="0" y="22" width="102" height="20" />
          </frame>
        </frame>
      </frame>
      <frame id="49788:16078" name="Frame 1" x="0" y="385" width="948" height="363">
        <text id="49788:16077" name="Pagination label" x="48" y="48" width="852" height="24" />
        <frame id="4405:9678" name="Pagination/label" x="438" y="135" width="72" height="180">
          <symbol id="4405:9663" name="isDisabled=False, isInverted=False" x="14" y="20" width="44" height="20" />
          <symbol id="4408:9619" name="isDisabled=True, isInverted=False" x="14" y="60" width="44" height="20" />
          <symbol id="4405:9679" name="isDisabled=False, isInverted=True" x="14" y="100" width="44" height="20" />
          <symbol id="49311:19329" name="isDisabled=True, isInverted=True" x="14" y="140" width="44" height="20" />
        </frame>
      </frame>
    </frame>
  </frame>
</canvas>
IMPORTANT: After you call this tool, you MUST call get_design_context if trying to implement the design, since this tool only returns metadata. If you do not call get_design_context, the agent will not be able to implement the design.


## frame "Elevation" (49788:4537, 1108x1459)

const imgVectorFrame = "https://www.figma.com/api/mcp/asset/7d5eb0b8-27a7-43cb-8aaf-6487912c4b85.svg";
const imgVectorFrame1 = "https://www.figma.com/api/mcp/asset/bc983658-7e4e-422b-b4d8-d234ed361429.svg";
const imgImage1 = "https://www.figma.com/api/mcp/asset/adde1972-d68f-4826-a42a-e66e03f0e10c.png";
const imgLine1 = "https://www.figma.com/api/mcp/asset/e33f42f9-1d78-4287-aa00-f09ae086e244.svg";
const imgVector2 = "https://www.figma.com/api/mcp/asset/10a8b9e0-88cb-41c5-9751-a807f2aeeac3.svg";

type PaginationLabelProps = {
  className?: string;
  isDisabled?: boolean;
  isInverted?: boolean;
  labelValue?: string;
};

function PaginationLabel({ className, isDisabled = false, isInverted = false, labelValue = "x of y" }: PaginationLabelProps) {
  const isIsDisabledAndIsInverted = isDisabled && isInverted;
  const isIsDisabledAndNotIsInverted = isDisabled && !isInverted;
  const isNotIsDisabledAndIsInverted = !isDisabled && isInverted;
  return (
    <div className={className || "content-stretch flex items-center justify-end pr-[8px] relative"} id={isIsDisabledAndIsInverted ? "node-49311_19329" : isNotIsDisabledAndIsInverted ? "node-4405_9679" : isIsDisabledAndNotIsInverted ? "node-4408_9619" : "node-4405_9663"}>
      {!isDisabled && !isInverted && (
        <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] text-right whitespace-nowrap" data-node-id="4405:9662">
          {labelValue}
        </p>
      )}
      {isIsDisabledAndNotIsInverted && (
        <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--surface/foreground/dynamic/neutral/disabled,#a8a8b2)] text-right whitespace-nowrap" data-node-id="4408:9620">
          {labelValue}
        </p>
      )}
      {isNotIsDisabledAndIsInverted && (
        <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--surface/foreground/static/neutral/inversed,white)] text-right whitespace-nowrap" data-node-id="4405:9680">
          {labelValue}
        </p>
      )}
      {isIsDisabledAndIsInverted && (
        <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--surface/foreground/dynamic/neutral/inversed/disabled,rgba(255,255,255,0.24))] text-right whitespace-nowrap" data-node-id="49311:19330">
          {labelValue}
        </p>
      )}
    </div>
  );
}

function Pagination({ className }: { className?: string }) {
  return (
    <div className={className || "content-stretch flex items-center justify-end relative"} data-node-id="4408:9644" data-name="Pagination">
      <div className="content-stretch flex items-center justify-end pr-[var(--numbers\/8,8px)] relative shrink-0" data-node-id="4408:9622" data-name="Pagination/label">
        <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] text-right whitespace-nowrap" data-node-id="I4408:9622;4405:9662">
          1 of 20
        </p>
      </div>
      <div className="content-stretch flex items-center justify-center p-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="49251:42265" data-name="Button">
        <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I49251:42265;45750:1679" data-name="Style=Regular,Size=20,State=Default,Pointing=Left">
          <div className="relative shrink-0 size-[20px]" data-node-id="I49251:42265;45750:1679;20202:945" data-name="Vector frame">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame} />
          </div>
        </div>
      </div>
      <div
        className="content-stretch flex items-center justify-center p-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0"
        data-node-id="49251:23186"
        data-development-annotations="Now instead of having a separate control for pagination we'll reuse icon button to align with the principals of Atomic design:

Button - Atom

Pagination - Molecule (label+ button)"
        data-name="Button"
      >
        <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I49251:23186;45750:1679" data-name="Style=Regular,Size=20,State=Default,Pointing=Right">
          <div className="relative shrink-0 size-[20px]" data-node-id="I49251:23186;45750:1679;20202:941" data-name="Vector frame">
            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame1} />
          </div>
        </div>
      </div>
    </div>
  );
}

type TitleProps = {
  className?: string;
  description?: string;
  title?: string;
};

function Title({ className, description = "Typography can help create clear hierarchies, organize information, and guide users through a product or experience.", title = "Typography" }: TitleProps) {
  return (
    <div className={className || "content-stretch flex flex-col gap-[var(--spacing\\/800,64px)] items-start relative w-[1840px]"} data-node-id="44136:261" data-name="_title">
      <div className="content-stretch flex flex-col gap-[32px] items-start pb-[var(--spacing\/400,32px)] relative shrink-0 w-[611.356px]" data-node-id="44136:259" data-name="watermark">
        <div className="h-[4px] relative shrink-0 w-[89.04px]" data-node-id="44136:257" data-name="image 1">
          <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
        </div>
        <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[normal] min-w-full not-italic relative shrink-0 text-[28px] text-[color:var(--surface/foreground/static/neutral/lvl3,#717180)] tracking-[5.6px] uppercase w-[min-content]" data-node-id="44136:256">
          Fiber Design System
        </p>
      </div>
      <div className="[word-break:break-word] content-stretch flex flex-col gap-[var(--spacing\/500,40px)] items-start not-italic relative shrink-0 w-full" data-node-id="44136:260" data-name="text">
        <div className="flex flex-col font-['DM_Sans:SemiBold'] justify-center leading-[0] relative shrink-0 text-[80px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] tracking-[-2px] w-full" data-node-id="44136:254">
          <p className="leading-[120px]">{title}</p>
        </div>
        <p className="font-['DM_Sans:Regular'] leading-[48px] relative shrink-0 text-[40px] text-[color:var(--surface/foreground/static/neutral/lvl3,#717180)] tracking-[-1px] w-full" data-node-id="44136:255">
          {description}
        </p>
      </div>
      <div className="h-0 relative shrink-0 w-full" data-node-id="44136:258">
        <div className="absolute inset-[-1px_0_0_0]">
          <img alt="" className="block max-w-none size-full" src={imgLine1} />
        </div>
      </div>
    </div>
  );
}

export default function Elevation() {
  return (
    <div className="bg-[var(--surface/background/lvl2,#f7f7fa)] border-[#ffca01] border-solid border-t-8 content-stretch flex flex-col gap-[63px] items-start p-[80px] relative size-full" data-node-id="49788:4537" data-name="Elevation">
      <Title className="content-stretch flex flex-col gap-[var(--spacing\/800,64px)] items-start relative shrink-0 w-full" description="Pagination is a navigation component that allows users to navigate through multiple pages of content" title="Pagination" />
      <div className="content-stretch flex flex-col gap-[var(--spacing\/300,24px)] items-start relative rounded-[56px] shrink-0 w-full" data-node-id="49792:16080">
        <div className="bg-[var(--Colours/Neutral/200,#ebebf0)] content-stretch flex flex-col gap-[63px] items-center justify-center p-[48px] relative rounded-[56px] shrink-0 w-full" data-node-id="49792:16079">
          <div className="[word-break:break-word] flex flex-col font-['DM_Sans:Medium'] justify-center leading-[0] min-w-full not-italic relative shrink-0 text-[16px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] tracking-[-0.08px] w-[min-content]" data-node-id="49788:16075">
            <p className="leading-[24px]">Pagination</p>
          </div>
          <div className="h-[178px] relative shrink-0 w-[188px]" data-node-id="49788:16065">
            <div className="absolute content-stretch flex flex-col gap-[10px] items-center left-[29px] top-0 w-[152px]" data-node-id="49788:16066">
              <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[20px] not-italic relative shrink-0 text-[#ea00ad] text-[14px] text-right w-[152px]" data-node-id="49788:16067">
                Button - icon only:true
              </p>
              <div className="flex items-center justify-center relative shrink-0" data-node-id="49788:16068">
                <div className="-scale-y-100 flex-none">
                  <div className="h-[12px] relative w-[66px]">
                    <div className="absolute inset-[0_-0.76%_-4.17%_-0.76%]">
                      <img alt="" className="block max-w-none size-full" src={imgVector2} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute border border-[#9747ff] border-dashed content-stretch flex flex-col items-start left-0 px-[14px] py-[20px] rounded-[5px] top-[52px]" data-node-id="49788:4974" data-name="wrapper">
              <Pagination className="content-stretch flex items-center justify-end relative shrink-0" />
            </div>
            <div className="absolute content-stretch flex flex-col gap-[10px] items-center justify-center left-[-5px] top-[136px]" data-node-id="49788:16070">
              <div className="h-[12px] relative shrink-0 w-[66px]" data-node-id="49788:16071">
                <div className="absolute inset-[0_-0.76%_-4.17%_-0.76%]">
                  <img alt="" className="block max-w-none size-full" src={imgVector2} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[20px] not-italic relative shrink-0 text-[#ea00ad] text-[14px] text-right whitespace-nowrap" data-node-id="49788:16072">
                Pagination label
              </p>
            </div>
          </div>
        </div>
        <div
          className="bg-[var(--Colours/Neutral/200,#ebebf0)] content-stretch flex flex-col items-center justify-center p-[48px] relative rounded-[56px] shrink-0 w-full"
          data-node-id="49788:16078"
          data-development-annotations="Updated label properties:

isInverted: true/false

isDisabled: true/false"
        >
          <div className="[word-break:break-word] flex flex-col font-['DM_Sans:Medium'] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] tracking-[-0.08px] w-full" data-node-id="49788:16077">
            <p className="leading-[24px]">Pagination label</p>
          </div>
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
These styles are contained in the design: Display Sm/Regular: Font(family: "DM Sans", style: Regular, size: 40, weight: 400, lineHeight: 48, letterSpacing: -2.5), Headline Xs/Medium: Font(family: "DM Sans", style: Medium, size: 16, weight: 500, lineHeight: 24, letterSpacing: -0.5), Body Md/Regular: Font(family: "DM Sans", style: Regular, size: 14, weight: 400, lineHeight: 20, letterSpacing: 0).
Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## Icon/caret
**Node ID:** 20195:11607

To find those carets, simply add the direction they are pointing to.

  

  

  

caret-right, caret-left (for regular)

  

caret-fill-right (for fill) and so on
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
Some elements have annotation data attributes. They provide extra information about how the element should be implemented.IMPORTANT: Do not ignore these annotation attributes. They should not appear in your final code.
