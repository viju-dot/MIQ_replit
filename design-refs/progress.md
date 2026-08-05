# Progress (page node 186:1264)

## Page structure (XML metadata)

<canvas id="186:1264" name="Progress" x="0" y="0" width="0" height="0">
  <frame id="351:1832" name="Progress" x="-941" y="-485" width="1918" height="288">
    <symbol id="186:1265" name="State=Alert, Label Right=False, Label Left=False" x="20" y="20" width="288" height="6" />
    <symbol id="186:1286" name="State=Info, Label Right=False, Label Left=False" x="408" y="20" width="288" height="6" />
    <symbol id="186:1289" name="State=Success, Label Right=False, Label Left=False" x="796" y="20" width="288" height="6" />
    <symbol id="186:1292" name="State=Warning, Label Right=False, Label Left=False" x="1184" y="20" width="288" height="6" />
    <symbol id="186:1295" name="State=Pause, Label Right=False, Label Left=False" x="1572" y="20" width="288" height="6" />
    <symbol id="186:1268" name="State=Alert, Label Right=True, Label Left=False" x="20" y="82" width="287" height="32" />
    <symbol id="6146:11983" name="State=Info, Label Right=True, Label Left=False" x="408" y="82" width="287" height="32" />
    <symbol id="6146:11991" name="State=Success, Label Right=True, Label Left=False" x="796" y="82" width="287" height="32" />
    <symbol id="6146:11999" name="State=Warning, Label Right=True, Label Left=False" x="1184" y="82" width="287" height="32" />
    <symbol id="6146:12007" name="State=Pause, Label Right=True, Label Left=False" x="1572" y="82" width="287" height="32" />
    <symbol id="186:1272" name="State=Alert, Label Right=True, Label Left=True" x="20" y="159" width="322" height="32" />
    <symbol id="46958:33995" name="State=Alert, Label Right=False, Label Left=True" x="20" y="236" width="322" height="32" />
    <symbol id="6146:12016" name="State=Info, Label Right=True, Label Left=True" x="408" y="159" width="322" height="32" />
    <symbol id="46958:34000" name="State=Info, Label Right=False, Label Left=True" x="408" y="236" width="322" height="32" />
    <symbol id="6146:12026" name="State=Success, Label Right=True, Label Left=True" x="796" y="159" width="322" height="32" />
    <symbol id="46958:34005" name="State=Success, Label Right=False, Label Left=True" x="796" y="236" width="322" height="32" />
    <symbol id="6146:12036" name="State=Warning, Label Right=True, Label Left=True" x="1184" y="159" width="322" height="32" />
    <symbol id="46958:34010" name="State=Warning, Label Right=False, Label Left=True" x="1184" y="236" width="322" height="32" />
    <symbol id="6146:12046" name="State=Pause, Label Right=True, Label Left=True" x="1572" y="159" width="322" height="32" />
    <symbol id="46958:34015" name="State=Pause, Label Right=False, Label Left=True" x="1572" y="236" width="322" height="32" />
  </frame>
  <frame id="32202:1428" name="Progress bar" x="-3255" y="-485" width="2145" height="1149">
    <frame id="32202:1429" name="Content" x="100" y="100" width="1945" height="949">
      <frame id="32202:1430" name="Fiber" x="0" y="0" width="217.78305053710938" height="38">
        <text id="32202:1431" name="FIBER DESIGN SYSTEM" x="1.125" y="18" width="216.65805053710938" height="20" />
        <rounded-rectangle id="32202:1432" name="image 1" x="0" y="0" width="33.677425384521484" height="2" />
      </frame>
      <text id="32202:1433" name="Progress bar qa" x="0" y="110" width="1945" height="68" />
      <line id="32202:1434" name="Line 1" x="0" y="250" width="1593" height="0" />
      <frame id="32202:1435" name="Neutral" x="0" y="322" width="1945" height="627">
        <frame id="32202:1436" name="Frame 12" x="30" y="46" width="1885" height="535">
          <text id="32202:1437" name="All variables colours matching" x="0" y="0" width="582" height="48" />
          <instance id="32202:1641" name="Icon/check-circle" x="596" y="27" width="32" height="32" />
        </frame>
      </frame>
    </frame>
  </frame>
</canvas>
IMPORTANT: After you call this tool, you MUST call get_design_context if trying to implement the design, since this tool only returns metadata. If you do not call get_design_context, the agent will not be able to implement the design.


## frame "Progress" (351:1832, 1918x288)

type ProgressProps = {
  className?: string;
  labelLeft?: boolean;
  labelRight?: boolean;
  state?: "Alert" | "Info" | "Success" | "Warning" | "Pause";
};

export default function Progress({ className, labelLeft = false, labelRight = false, state = "Alert" }: ProgressProps) {
  const isAlertAndLabelRightAndLabelLeft = state === "Alert" && labelRight && labelLeft;
  const isAlertAndLabelRightAndNotLabelLeft = state === "Alert" && labelRight && !labelLeft;
  const isAlertAndNotLabelRightAndLabelLeft = state === "Alert" && !labelRight && labelLeft;
  const isInfoAndLabelRightAndLabelLeft = state === "Info" && labelRight && labelLeft;
  const isInfoAndLabelRightAndNotLabelLeft = state === "Info" && labelRight && !labelLeft;
  const isInfoAndNotLabelRightAndLabelLeft = state === "Info" && !labelRight && labelLeft;
  const isInfoAndNotLabelRightAndNotLabelLeft = state === "Info" && !labelRight && !labelLeft;
  const isLabelLeft = labelLeft;
  const isLabelRightAndLabelLeft = labelRight && labelLeft;
  const isLabelRightAndNotLabelLeft = labelRight && !labelLeft;
  const isNotLabelRightAndLabelLeft = !labelRight && labelLeft;
  const isPauseAndLabelRightAndLabelLeft = state === "Pause" && labelRight && labelLeft;
  const isPauseAndLabelRightAndNotLabelLeft = state === "Pause" && labelRight && !labelLeft;
  const isPauseAndNotLabelRightAndLabelLeft = state === "Pause" && !labelRight && labelLeft;
  const isPauseAndNotLabelRightAndNotLabelLeft = state === "Pause" && !labelRight && !labelLeft;
  const isSuccessAndLabelRightAndLabelLeft = state === "Success" && labelRight && labelLeft;
  const isSuccessAndLabelRightAndNotLabelLeft = state === "Success" && labelRight && !labelLeft;
  const isSuccessAndNotLabelRightAndLabelLeft = state === "Success" && !labelRight && labelLeft;
  const isSuccessAndNotLabelRightAndNotLabelLeft = state === "Success" && !labelRight && !labelLeft;
  const isWarningAndLabelRightAndLabelLeft = state === "Warning" && labelRight && labelLeft;
  const isWarningAndLabelRightAndNotLabelLeft = state === "Warning" && labelRight && !labelLeft;
  const isWarningAndNotLabelRightAndLabelLeft = state === "Warning" && !labelRight && labelLeft;
  const isWarningAndNotLabelRightAndNotLabelLeft = state === "Warning" && !labelRight && !labelLeft;
  return (
    <div className={className || `relative ${isLabelLeft ? String.raw`h-[var(--\[old\]sizing\/32,32px)] w-[322px]` : isLabelRightAndNotLabelLeft ? String.raw`h-[var(--\[old\]sizing\/32,32px)] w-[287px]` : !labelRight && !labelLeft && ["Info", "Success", "Warning", "Pause"].includes(state) ? String.raw`h-[var(--\[old\]sizing\/6,6px)] w-[288px]` : String.raw`h-[var(--\[old\]sizing\/6,6px)] rounded-[var(--\[old\]radiuses\/4,4px)] w-[288px]`}`} id={isPauseAndNotLabelRightAndLabelLeft ? "node-46958_34015" : isPauseAndLabelRightAndLabelLeft ? "node-6146_12046" : isWarningAndNotLabelRightAndLabelLeft ? "node-46958_34010" : isWarningAndLabelRightAndLabelLeft ? "node-6146_12036" : isSuccessAndNotLabelRightAndLabelLeft ? "node-46958_34005" : isSuccessAndLabelRightAndLabelLeft ? "node-6146_12026" : isInfoAndNotLabelRightAndLabelLeft ? "node-46958_34000" : isInfoAndLabelRightAndLabelLeft ? "node-6146_12016" : isAlertAndNotLabelRightAndLabelLeft ? "node-46958_33995" : isAlertAndLabelRightAndLabelLeft ? "node-186_1272" : isPauseAndLabelRightAndNotLabelLeft ? "node-6146_12007" : isWarningAndLabelRightAndNotLabelLeft ? "node-6146_11999" : isSuccessAndLabelRightAndNotLabelLeft ? "node-6146_11991" : isInfoAndLabelRightAndNotLabelLeft ? "node-6146_11983" : isAlertAndLabelRightAndNotLabelLeft ? "node-186_1268" : isPauseAndNotLabelRightAndNotLabelLeft ? "node-186_1295" : isWarningAndNotLabelRightAndNotLabelLeft ? "node-186_1292" : isSuccessAndNotLabelRightAndNotLabelLeft ? "node-186_1289" : isInfoAndNotLabelRightAndNotLabelLeft ? "node-186_1286" : "node-186_1265"}>
      <div className={`${String.raw`absolute bg-[var(--progress/neutral,#e1e1e8)] rounded-[var(--\[old\]radiuses\/4,4px)] `}${isLabelRightAndNotLabelLeft || isLabelLeft ? "inset-[81.25%_0_0_0]" : "inset-0"}`} id={isPauseAndNotLabelRightAndLabelLeft ? "node-46958_34016" : isPauseAndLabelRightAndLabelLeft ? "node-6146_12047" : isWarningAndNotLabelRightAndLabelLeft ? "node-46958_34011" : isWarningAndLabelRightAndLabelLeft ? "node-6146_12037" : isSuccessAndNotLabelRightAndLabelLeft ? "node-46958_34006" : isSuccessAndLabelRightAndLabelLeft ? "node-6146_12027" : isInfoAndNotLabelRightAndLabelLeft ? "node-46958_34001" : isInfoAndLabelRightAndLabelLeft ? "node-6146_12017" : isAlertAndNotLabelRightAndLabelLeft ? "node-46958_33996" : isAlertAndLabelRightAndLabelLeft ? "node-186_1273" : isPauseAndLabelRightAndNotLabelLeft ? "node-6146_12008" : isWarningAndLabelRightAndNotLabelLeft ? "node-6146_12000" : isSuccessAndLabelRightAndNotLabelLeft ? "node-6146_11992" : isInfoAndLabelRightAndNotLabelLeft ? "node-6146_11984" : isAlertAndLabelRightAndNotLabelLeft ? "node-186_1269" : isPauseAndNotLabelRightAndNotLabelLeft ? "node-186_1296" : isWarningAndNotLabelRightAndNotLabelLeft ? "node-186_1293" : isSuccessAndNotLabelRightAndNotLabelLeft ? "node-186_1290" : isInfoAndNotLabelRightAndNotLabelLeft ? "node-186_1287" : "node-186_1266"} data-name="Base" />
      <div className={`${String.raw`absolute rounded-[var(--\[old\]radiuses\/4,4px)] `}${state === "Pause" && labelLeft ? "bg-[var(--progress/orange,#c76217)] inset-[81.25%_46.27%_0_0]" : state === "Warning" && labelLeft ? "bg-[var(--progress/warning,#f8c500)] inset-[81.25%_46.27%_0_0]" : state === "Success" && labelLeft ? "bg-[var(--progress/success,#1e8158)] inset-[81.25%_46.27%_0_0]" : state === "Info" && labelLeft ? "bg-[var(--progress/info,#2360db)] inset-[81.25%_46.27%_0_0]" : state === "Alert" && labelLeft ? "bg-[var(--progress/error,#da294b)] inset-[81.25%_46.27%_0_0]" : isPauseAndLabelRightAndNotLabelLeft ? "bg-[var(--progress/orange,#c76217)] inset-[81.25%_46.34%_0_0]" : isWarningAndLabelRightAndNotLabelLeft ? "bg-[var(--progress/warning,#f8c500)] inset-[81.25%_46.34%_0_0]" : isSuccessAndLabelRightAndNotLabelLeft ? "bg-[var(--progress/success,#1e8158)] inset-[81.25%_46.34%_0_0]" : isInfoAndLabelRightAndNotLabelLeft ? "bg-[var(--progress/info,#2360db)] inset-[81.25%_46.34%_0_0]" : isAlertAndLabelRightAndNotLabelLeft ? "bg-[var(--progress/error,#da294b)] inset-[81.25%_46.34%_0_0]" : isPauseAndNotLabelRightAndNotLabelLeft ? "bg-[var(--progress/orange,#c76217)] inset-[0_36.11%_0_0]" : isWarningAndNotLabelRightAndNotLabelLeft ? "bg-[var(--progress/warning,#f8c500)] inset-[0_36.11%_0_0]" : isSuccessAndNotLabelRightAndNotLabelLeft ? "bg-[var(--progress/success,#1e8158)] inset-[0_36.11%_0_0]" : isInfoAndNotLabelRightAndNotLabelLeft ? "bg-[var(--progress/info,#2360db)] inset-[0_36.11%_0_0]" : "bg-[var(--progress/error,#da294b)] inset-[0_36.11%_0_0]"}`} id={isPauseAndNotLabelRightAndLabelLeft ? "node-46958_34017" : isPauseAndLabelRightAndLabelLeft ? "node-6146_12048" : isWarningAndNotLabelRightAndLabelLeft ? "node-46958_34012" : isWarningAndLabelRightAndLabelLeft ? "node-6146_12038" : isSuccessAndNotLabelRightAndLabelLeft ? "node-46958_34007" : isSuccessAndLabelRightAndLabelLeft ? "node-6146_12028" : isInfoAndNotLabelRightAndLabelLeft ? "node-46958_34002" : isInfoAndLabelRightAndLabelLeft ? "node-6146_12018" : isAlertAndNotLabelRightAndLabelLeft ? "node-46958_33997" : isAlertAndLabelRightAndLabelLeft ? "node-186_1274" : isPauseAndLabelRightAndNotLabelLeft ? "node-6146_12009" : isWarningAndLabelRightAndNotLabelLeft ? "node-6146_12001" : isSuccessAndLabelRightAndNotLabelLeft ? "node-6146_11993" : isInfoAndLabelRightAndNotLabelLeft ? "node-6146_11985" : isAlertAndLabelRightAndNotLabelLeft ? "node-186_1270" : isPauseAndNotLabelRightAndNotLabelLeft ? "node-186_1297" : isWarningAndNotLabelRightAndNotLabelLeft ? "node-186_1294" : isSuccessAndNotLabelRightAndNotLabelLeft ? "node-186_1291" : isInfoAndNotLabelRightAndNotLabelLeft ? "node-186_1288" : "node-186_1267"} data-name="Color" />
      {(isLabelRightAndNotLabelLeft || isLabelLeft) && (
        <p className={`[word-break:break-word] absolute font-["DM_Sans:Regular"] leading-[18px] not-italic text-[12px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] ${isNotLabelRightAndLabelLeft ? "inset-[0_64.6%_43.75%_0] whitespace-nowrap" : isLabelRightAndLabelLeft ? "inset-[0_0_43.75%_92.24%] text-right whitespace-nowrap" : "right-px text-right top-0 w-[27px]"}`} id={isPauseAndNotLabelRightAndLabelLeft ? "node-46958_34019" : isPauseAndLabelRightAndLabelLeft ? "node-6146_12049" : isWarningAndNotLabelRightAndLabelLeft ? "node-46958_34014" : isWarningAndLabelRightAndLabelLeft ? "node-6146_12039" : isSuccessAndNotLabelRightAndLabelLeft ? "node-46958_34009" : isSuccessAndLabelRightAndLabelLeft ? "node-6146_12029" : isInfoAndNotLabelRightAndLabelLeft ? "node-46958_34004" : isInfoAndLabelRightAndLabelLeft ? "node-6146_12019" : isAlertAndNotLabelRightAndLabelLeft ? "node-46958_33999" : isAlertAndLabelRightAndLabelLeft ? "node-186_1275" : isPauseAndLabelRightAndNotLabelLeft ? "node-6146_12010" : isWarningAndLabelRightAndNotLabelLeft ? "node-6146_12002" : isSuccessAndLabelRightAndNotLabelLeft ? "node-6146_11994" : isInfoAndLabelRightAndNotLabelLeft ? "node-6146_11986" : "node-186_1271"}>
          {isNotLabelRightAndLabelLeft ? "0 minutes remaining" : labelRight ? "55%" : ""}
        </p>
      )}
      {isLabelRightAndLabelLeft && (
        <p className="[word-break:break-word] absolute font-['DM_Sans:Regular'] inset-[0_64.6%_43.75%_0] leading-[18px] not-italic text-[12px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] whitespace-nowrap" id={isPauseAndLabelRightAndLabelLeft ? "node-6146_12050" : isWarningAndLabelRightAndLabelLeft ? "node-6146_12040" : isSuccessAndLabelRightAndLabelLeft ? "node-6146_12030" : isInfoAndLabelRightAndLabelLeft ? "node-6146_12020" : "node-186_1276"}>
          0 minutes remaining
        </p>
      )}
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
These styles are contained in the design: Body Sm/Regular: Font(family: "DM Sans", style: Regular, size: 12, weight: 400, lineHeight: 18, letterSpacing: 0).
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.

## frame "Progress bar" (32202:1428, 2145x1149)

const imgImage1 = "https://www.figma.com/api/mcp/asset/121b8205-dcb8-40d4-92ba-01ecb7fd77e6.png";
const imgLine1 = "https://www.figma.com/api/mcp/asset/fe98d5a5-f890-4ece-8cc3-f396986c3e76.svg";
const imgVectorFrame = "https://www.figma.com/api/mcp/asset/0987bb08-5811-442c-b0bf-7d3cdac5f85f.svg";

export default function ProgressBar() {
  return (
    <div className="bg-[var(--surface/background/lvl2,#f7f7fa)] content-stretch flex items-center p-[100px] relative size-full" data-node-id="32202:1428" data-name="Progress bar">
      <div className="content-stretch flex flex-col gap-[72px] h-[949px] items-start relative shrink-0" data-node-id="32202:1429" data-name="Content">
        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="32202:1430" data-name="Fiber">
          <div className="[word-break:break-word] col-1 flex flex-col font-['DM_Sans:Regular'] justify-center ml-[1.13px] mt-[18px] not-italic relative row-1 text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl3,#717180)] w-[216.658px]" data-node-id="32202:1431">
            <p className="leading-[20px]">FIBER DESIGN SYSTEM</p>
          </div>
          <div className="col-1 h-[2px] ml-0 mt-0 relative row-1 w-[33.677px]" data-node-id="32202:1432" data-name="image 1">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
          </div>
        </div>
        <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[68px] min-w-full not-italic relative shrink-0 text-[56px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] tracking-[-1.4px] w-[min-content]" data-node-id="32202:1433">
          Progress bar qa
        </p>
        <div className="h-0 relative shrink-0 w-[1593px]" data-node-id="32202:1434">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine1} />
          </div>
        </div>
        <div className="bg-[var(--surface/background/lvl1,white)] content-stretch flex flex-col items-start overflow-clip px-[30px] py-[46px] relative rounded-[45px] shrink-0 w-full" data-node-id="32202:1435" data-name="Neutral">
          <div className="h-[535px] overflow-clip relative shrink-0 w-[1885px]" data-node-id="32202:1436">
            <ol className="[word-break:break-word] absolute block font-['DM_Sans:Regular'] leading-[0] left-0 list-decimal not-italic text-[40px] text-[color:var(--surface/foreground/static/neutral/lvl2,#282833)] top-0 tracking-[-1px] whitespace-nowrap" data-node-id="32202:1437" start="1">
              <li className="ms-[60px]">
                <span className="leading-[48px]">All variables colours matching</span>
              </li>
            </ol>
            <div className="absolute content-stretch flex items-center justify-center left-[596px] p-[3px] size-[32px] top-[27px]" data-node-id="32202:1641" data-name="Icon/check-circle">
              <div className="relative shrink-0 size-[26px]" data-node-id="I32202:1641;28561:11422" data-name="Vector frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame} />
              </div>
            </div>
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
These styles are contained in the design: Body Md/Regular: Font(family: "DM Sans", style: Regular, size: 14, weight: 400, lineHeight: 20, letterSpacing: 0), Display Lg/Medium: Font(family: "DM Sans", style: Medium, size: 56, weight: 500, lineHeight: 68, letterSpacing: -2.5), Display Sm/Regular: Font(family: "DM Sans", style: Regular, size: 40, weight: 400, lineHeight: 48, letterSpacing: -2.5).
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
