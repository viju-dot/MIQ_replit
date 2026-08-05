# Accordion (page node 186:2544)

## Page structure (XML metadata)

<canvas id="186:2544" name="Accordion" x="0" y="0" width="0" height="0">
  <frame id="47033:39410" name=".Accordion Header" x="2436" y="-1550" width="640" height="223">
    <symbol id="47033:39411" name="Left=Check-box" x="20" y="112" width="600" height="40" />
    <symbol id="47033:39407" name="Left=Icon" x="20" y="40" width="600" height="40" />
  </frame>
  <frame id="47033:39959" name="Accordion" x="3176" y="-1550" width="3384" height="456">
    <symbol id="47127:2201" name="State=Default, Type=Expanded, Background=On, Border=full" x="2740" y="209" width="600" height="128" />
    <symbol id="47127:2153" name="State=Default, Type=Expanded, Background=On, Border=top&amp;bottom" x="2060" y="209" width="600" height="128" />
    <symbol id="47127:2105" name="State=Disabled, Type=Expanded, Background=Off, Border=top&amp;bottom" x="1380" y="209" width="600" height="128" />
    <symbol id="47042:41371" name="State=Default, Type=Expanded, Background=Off, Border=full" x="700" y="209" width="600" height="128" />
    <symbol id="47033:40930" name="State=Default, Type=Expanded, Background=Off, Border=top&amp;bottom" x="20" y="209" width="600" height="128" />
    <symbol id="47127:2179" name="State=Default, Type=Collapse, Background=On, Border=full" x="2740" y="20" width="600" height="40" />
    <symbol id="47127:2131" name="State=Default, Type=Collapse, Background=On, Border=top&amp;bottom" x="2060" y="20" width="600" height="40" />
    <symbol id="47108:2335" name="State=Disabled, Type=Collapse, Background=Off, Border=top&amp;bottom" x="1380" y="20" width="600" height="40" />
    <symbol id="47033:41291" name="State=Default, Type=Collapse, Background=Off, Border=full" x="700" y="20" width="600" height="40" />
    <symbol id="47033:39954" name="State=Default, Type=Collapse, Background=Off, Border=top&amp;bottom" x="20" y="20" width="600" height="40" />
  </frame>
  <instance id="47799:17707" name="Accordion" x="3707" y="-862" width="600" height="40" />
  <instance id="47799:17730" name="Accordion" x="3707" y="-780" width="600" height="40" />
  <instance id="47799:17760" name="Accordion" x="3707" y="-696" width="600" height="40" />
  <instance id="47799:17753" name="Cursor/Pointer" x="4016" y="-752" width="24" height="24" />
  <instance id="47799:17783" name="Cursor/Pointer" x="3731" y="-676" width="24" height="24" />
  <instance id="47799:17837" name="Cursor/Pointer" x="4251" y="-680" width="24" height="24" />
  <text id="53757:16823" name="Default" x="3641" y="-857" width="47" height="20" />
  <text id="53757:16824" name="Hover" x="3641" y="-767" width="38" height="20" />
  <text id="53757:16825" name="Hover actions" x="3589" y="-684" width="90" height="20" />
</canvas>
IMPORTANT: After you call this tool, you MUST call get_design_context if trying to implement the design, since this tool only returns metadata. If you do not call get_design_context, the agent will not be able to implement the design.


## frame ".Accordion Header" (47033:39410, 640x223)

const imgVectorFrame = "https://www.figma.com/api/mcp/asset/0ec190ac-35cf-462c-86a0-571b179202f6.svg";
const imgVectorFrame1 = "https://www.figma.com/api/mcp/asset/f109eecc-9db6-4b45-9225-54e08a82fc25.svg";
const imgVectorFrame2 = "https://www.figma.com/api/mcp/asset/2841e316-77e8-4078-9d2e-84ae992d7a46.svg";

type AccordionHeaderProps = {
  className?: string;
  elementLeft?: React.ReactNode | null;
  elementRight?: React.ReactNode | null;
  left?: "Icon" | "Check-box";
  showElementleft?: boolean;
  showElementRight?: boolean;
};

export default function AccordionHeader({ className, elementLeft = null, elementRight = null, left = "Icon", showElementleft = true, showElementRight = true }: AccordionHeaderProps) {
  const isCheckBox = left === "Check-box";
  const isIcon = left === "Icon";
  return (
    <div className={className || "content-stretch flex flex-col items-start min-w-[320px] relative w-[600px]"} id={isIcon ? "node-47033_39407" : "node-47033_39411"}>
      <div className="content-stretch flex flex-col gap-[var(--spacing\/0,0px)] items-start relative shrink-0 w-full" id={isIcon ? "node-47033_39384" : "node-47033_39412"} data-name="Accordion New">
        <div className="border-[var(--border/static/subtle/neutral,#e1e1e8)] border-b-[length:var(--stroke_weight\/15,1px)] border-solid border-t-[length:var(--stroke_weight\/15,1px)] content-stretch flex flex-col gap-[var(--spacing\/0,0px)] items-start overflow-clip px-[var(--spacing\/150,12px)] py-[var(--spacing\/100,8px)] relative shrink-0 w-full" id={isIcon ? "node-47033_39385" : "node-47033_39413"} data-name="Accordion">
          <div className="content-stretch flex gap-[var(--spacing\/250,20px)] items-center relative shrink-0 w-full" id={isIcon ? "node-47153_3629" : "node-47251_5440"}>
            <div className="content-stretch flex flex-[1_0_0] gap-[var(--numbers\/6,6px)] items-center min-w-px relative" id={isIcon ? "node-47033_39389" : "node-47033_39417"} data-name="Title-Left">
              {isCheckBox &&
                showElementleft &&
                (elementLeft || (
                  <div className="content-stretch flex items-center justify-center p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="47449:2079" data-name="Button">
                    <div className="content-stretch flex items-center justify-center overflow-clip p-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0 size-[20px]" data-node-id="I47449:2079;46186:2785" data-name="isCompact=false">
                      <div className="content-stretch flex items-center overflow-clip p-[var(--spacing\/container\/s,2px)] relative shrink-0" data-node-id="I47449:2079;46186:2785;43183:10127" data-name="inner_container">
                        <div className="border-[1.5px] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid overflow-clip relative rounded-[var(--radius\/25,2px)] shrink-0 size-[16px]" data-node-id="I47449:2079;46186:2785;43183:10128" data-name="container" />
                      </div>
                    </div>
                  </div>
                ))}
              {isCheckBox && (
                <div className="content-stretch flex flex-[1_0_0] gap-[var(--numbers\/8,8px)] h-[24px] items-center min-w-px relative" data-node-id="47033:39419" data-name="Title&Button">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[20px] min-w-px not-italic overflow-hidden relative text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] text-ellipsis whitespace-nowrap" data-node-id="47033:39420">
                    Accordion Title
                  </p>
                </div>
              )}
              {isIcon &&
                showElementleft &&
                (elementLeft || (
                  <div className="content-stretch flex items-center justify-center p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="47449:2085" data-name="Button">
                    <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I47449:2085;46186:2785" data-name="Style=Regular,Size=20,State=Default">
                      <div className="relative shrink-0 size-[20px]" data-node-id="I47449:2085;46186:2785;20257:28989" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame2} />
                      </div>
                    </div>
                  </div>
                ))}
              {isIcon && (
                <div className="content-stretch flex flex-[1_0_0] gap-[var(--numbers\/8,8px)] h-[24px] items-center min-w-px relative" data-node-id="47033:39391" data-name="Title&Button">
                  <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[20px] min-w-px not-italic overflow-hidden relative text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] text-ellipsis whitespace-nowrap" data-node-id="47033:39392">
                    Accordion Title
                  </p>
                </div>
              )}
            </div>
            <div className="content-stretch flex gap-[var(--spacing\/100,8px)] items-center relative shrink-0" id={isIcon ? "node-47153_3290" : "node-47251_5425"}>
              {showElementRight &&
                (elementRight || (
                  <div className="content-stretch flex items-center justify-center p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="47449:1840" data-name="Button">
                    <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I47449:1840;46186:2785" data-name="Style=Regular,Size=20,State=Default">
                      <div className="h-[16.25px] relative shrink-0 w-[15px]" data-node-id="I47449:1840;46186:2785;28561:9585" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame} />
                      </div>
                    </div>
                  </div>
                ))}
              <div className="content-stretch flex items-center justify-center p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0 w-[24px]" id={isIcon ? "node-47033_39387" : "node-47721_1507"} data-name="Button">
                <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" id={isIcon ? "node-I47033_39387-46186_2785" : "node-I47721_1507-46186_2785"} data-name="Style=Regular,Size=20,State=Default,Pointing=Down">
                  <div className="relative shrink-0 size-[20px]" id={isIcon ? "node-I47033_39387-46186_2785-20202_762" : "node-I47721_1507-46186_2785-20202_762"} data-name="Vector frame">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame1} />
                  </div>
                </div>
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
These styles are contained in the design: Body Md/Regular: Font(family: "DM Sans", style: Regular, size: 14, weight: 400, lineHeight: 20, letterSpacing: 0).
Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## Icon/caret
**Node ID:** 20195:11607

To find those carets, simply add the direction they are pointing to.

  

  

  

caret-right, caret-left (for regular)

  

caret-fill-right (for fill) and so on
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.

## frame "Accordion" (47033:39959, 3384x456)

const imgVectorFrame = "https://www.figma.com/api/mcp/asset/ff8b8ecf-7c1a-459b-b850-ef18c73f7dc3.svg";
const imgVectorFrame1 = "https://www.figma.com/api/mcp/asset/1871198f-b50d-44ff-81e7-d6598755fa38.svg";
const imgVectorFrame2 = "https://www.figma.com/api/mcp/asset/ee7b3d75-4486-40ce-8680-cc70f8181782.svg";
const imgVectorFrame3 = "https://www.figma.com/api/mcp/asset/4ace3f5b-fdc7-4309-b2c6-584b9c24cf56.svg";
const imgVectorFrame4 = "https://www.figma.com/api/mcp/asset/01703bf1-6cd9-409c-bb8f-b00ea645b7ef.svg";
const imgVectorFrame5 = "https://www.figma.com/api/mcp/asset/e41ef364-9f68-4d80-8d1b-43fb809c6568.svg";
const imgVectorFrame6 = "https://www.figma.com/api/mcp/asset/32077803-a8e3-4d18-bbd1-4e0022115f41.svg";
const imgVectorFrame7 = "https://www.figma.com/api/mcp/asset/eac2538d-4fd3-43df-8170-bda33a36aa97.svg";

type AccordionProps = {
  className?: string;
  background?: boolean;
  border?: "top&bottom" | "full";
  instance?: React.ReactNode | null;
  state?: "Default" | "Disabled";
  type?: "Collapse" | "Expanded";
};

export default function Accordion({ className, background = false, border = "top&bottom", instance = null, state = "Default", type = "Collapse" }: AccordionProps) {
  const isDefault = state === "Default";
  const isDefaultAndCollapseAndBackgroundAndFull = state === "Default" && type === "Collapse" && background && border === "full";
  const isDefaultAndCollapseAndBackgroundAndTopBottom = state === "Default" && type === "Collapse" && background && border === "top&bottom";
  const isDefaultAndCollapseAndNotBackgroundAndFull = state === "Default" && type === "Collapse" && !background && border === "full";
  const isDefaultAndCollapseAndNotBackgroundAndTopBottom = state === "Default" && type === "Collapse" && !background && border === "top&bottom";
  const isDefaultAndExpanded = state === "Default" && type === "Expanded";
  const isDefaultAndExpandedAndBackgroundAndTopBottom = state === "Default" && type === "Expanded" && background && border === "top&bottom";
  const isDefaultAndExpandedAndNotBackgroundAndFull = state === "Default" && type === "Expanded" && !background && border === "full";
  const isDefaultAndExpandedAndNotBackgroundAndTopBottom = state === "Default" && type === "Expanded" && !background && border === "top&bottom";
  const isDisabledAndCollapseAndNotBackgroundAndTopBottom = state === "Disabled" && type === "Collapse" && !background && border === "top&bottom";
  const isDisabledAndExpandedAndNotBackgroundAndTopBottom = state === "Disabled" && type === "Expanded" && !background && border === "top&bottom";
  const isDisabledAndNotBackgroundAndTopBottom = state === "Disabled" && !background && border === "top&bottom";
  return (
    <div className={className || `content-stretch flex flex-col items-start min-w-[320px] relative w-[600px] ${isDefaultAndCollapseAndBackgroundAndFull ? String.raw`bg-[var(--surface/background/lvl1,white)] gap-[var(--spacing\/0,0px)]` : state === "Default" && !background ? "" : isDisabledAndNotBackgroundAndTopBottom ? "bg-[var(--container/dynamic/neutral/subtle/background/disabled,rgba(113,113,128,0.1))]" : "bg-[var(--surface/background/lvl1,white)]"}`} id={isDefaultAndCollapseAndNotBackgroundAndTopBottom ? "node-47033_39954" : isDefaultAndCollapseAndNotBackgroundAndFull ? "node-47033_41291" : isDisabledAndCollapseAndNotBackgroundAndTopBottom ? "node-47108_2335" : isDefaultAndCollapseAndBackgroundAndTopBottom ? "node-47127_2131" : isDefaultAndCollapseAndBackgroundAndFull ? "node-47127_2179" : isDefaultAndExpandedAndNotBackgroundAndTopBottom ? "node-47033_40930" : isDefaultAndExpandedAndNotBackgroundAndFull ? "node-47042_41371" : isDisabledAndExpandedAndNotBackgroundAndTopBottom ? "node-47127_2105" : isDefaultAndExpandedAndBackgroundAndTopBottom ? "node-47127_2153" : "node-47127_2201"}>
      <div className={`content-stretch flex flex-col items-start min-w-[180px] relative shrink-0 w-full ${isDefaultAndCollapseAndBackgroundAndFull ? String.raw`gap-[var(--spacing\/0,0px)]` : ""}`} id={isDefaultAndCollapseAndNotBackgroundAndTopBottom ? "node-47033_40443" : isDefaultAndCollapseAndNotBackgroundAndFull ? "node-47033_41292" : isDisabledAndCollapseAndNotBackgroundAndTopBottom ? "node-47108_2336" : isDefaultAndCollapseAndBackgroundAndTopBottom ? "node-47127_2132" : isDefaultAndCollapseAndBackgroundAndFull ? "node-47127_2180" : isDefaultAndExpandedAndNotBackgroundAndTopBottom ? "node-47033_40931" : isDefaultAndExpandedAndNotBackgroundAndFull ? "node-47042_41372" : isDisabledAndExpandedAndNotBackgroundAndTopBottom ? "node-47127_2106" : isDefaultAndExpandedAndBackgroundAndTopBottom ? "node-47127_2154" : "node-47127_2202"} data-name="Accordion New">
        <div className={`content-stretch flex flex-col items-start min-w-[320px] relative shrink-0 w-full ${isDefaultAndCollapseAndBackgroundAndFull ? String.raw`gap-[var(--spacing\/0,0px)]` : ""}`} id={isDefaultAndCollapseAndNotBackgroundAndTopBottom ? "node-47033_40694" : isDefaultAndCollapseAndNotBackgroundAndFull ? "node-47033_41293" : isDisabledAndCollapseAndNotBackgroundAndTopBottom ? "node-47108_2337" : isDefaultAndCollapseAndBackgroundAndTopBottom ? "node-47127_2133" : isDefaultAndCollapseAndBackgroundAndFull ? "node-47127_2181" : isDefaultAndExpandedAndNotBackgroundAndTopBottom ? "node-47033_40932" : isDefaultAndExpandedAndNotBackgroundAndFull ? "node-47042_41373" : isDisabledAndExpandedAndNotBackgroundAndTopBottom ? "node-47127_2107" : isDefaultAndExpandedAndBackgroundAndTopBottom ? "node-47127_2155" : "node-47127_2203"} data-name=".Accordion Header">
          <div className="content-stretch flex flex-col gap-[var(--spacing\/0,0px)] items-start relative shrink-0 w-full" id={isDefaultAndCollapseAndNotBackgroundAndTopBottom ? "node-I47033_40694-47033_39384" : isDefaultAndCollapseAndNotBackgroundAndFull ? "node-I47033_41293-47033_39384" : isDisabledAndCollapseAndNotBackgroundAndTopBottom ? "node-I47108_2337-47033_39384" : isDefaultAndCollapseAndBackgroundAndTopBottom ? "node-I47127_2133-47033_39384" : isDefaultAndCollapseAndBackgroundAndFull ? "node-I47127_2181-47033_39384" : isDefaultAndExpandedAndNotBackgroundAndTopBottom ? "node-I47033_40932-47033_39384" : isDefaultAndExpandedAndNotBackgroundAndFull ? "node-I47042_41373-47033_39384" : isDisabledAndExpandedAndNotBackgroundAndTopBottom ? "node-I47127_2107-47033_39384" : isDefaultAndExpandedAndBackgroundAndTopBottom ? "node-I47127_2155-47033_39384" : "node-I47127_2203-47033_39384"} data-name="Accordion New">
            <div className={`${String.raw`border-[var(--border/static/subtle/neutral,#e1e1e8)] border-b-[length:var(--stroke_weight\/15,1px)] border-solid border-t-[length:var(--stroke_weight\/15,1px)] content-stretch flex flex-col gap-[var(--spacing\/0,0px)] items-start overflow-clip px-[var(--spacing\/150,12px)] py-[var(--spacing\/100,8px)] relative shrink-0 w-full `}${state === "Default" && type === "Collapse" && border === "full" ? "rounded-[2px]" : border === "top&bottom" && ((state === "Default" && background) || !background) ? "" : "rounded-tl-[2px] rounded-tr-[2px]"}`} id={isDefaultAndCollapseAndNotBackgroundAndTopBottom ? "node-I47033_40694-47033_39385" : isDefaultAndCollapseAndNotBackgroundAndFull ? "node-I47033_41293-47033_39385" : isDisabledAndCollapseAndNotBackgroundAndTopBottom ? "node-I47108_2337-47033_39385" : isDefaultAndCollapseAndBackgroundAndTopBottom ? "node-I47127_2133-47033_39385" : isDefaultAndCollapseAndBackgroundAndFull ? "node-I47127_2181-47033_39385" : isDefaultAndExpandedAndNotBackgroundAndTopBottom ? "node-I47033_40932-47033_39385" : isDefaultAndExpandedAndNotBackgroundAndFull ? "node-I47042_41373-47033_39385" : isDisabledAndExpandedAndNotBackgroundAndTopBottom ? "node-I47127_2107-47033_39385" : isDefaultAndExpandedAndBackgroundAndTopBottom ? "node-I47127_2155-47033_39385" : "node-I47127_2203-47033_39385"} data-name="Accordion">
              <div className="content-stretch flex gap-[var(--spacing\/250,20px)] items-center relative shrink-0 w-full" id={isDefaultAndCollapseAndNotBackgroundAndTopBottom ? "node-I47033_40694-47153_3629" : isDefaultAndCollapseAndNotBackgroundAndFull ? "node-I47033_41293-47153_3629" : isDisabledAndCollapseAndNotBackgroundAndTopBottom ? "node-I47108_2337-47153_3629" : isDefaultAndCollapseAndBackgroundAndTopBottom ? "node-I47127_2133-47153_3629" : isDefaultAndCollapseAndBackgroundAndFull ? "node-I47127_2181-47153_3629" : isDefaultAndExpandedAndNotBackgroundAndTopBottom ? "node-I47033_40932-47153_3629" : isDefaultAndExpandedAndNotBackgroundAndFull ? "node-I47042_41373-47153_3629" : isDisabledAndExpandedAndNotBackgroundAndTopBottom ? "node-I47127_2107-47153_3629" : isDefaultAndExpandedAndBackgroundAndTopBottom ? "node-I47127_2155-47153_3629" : "node-I47127_2203-47153_3629"}>
                <div className="content-stretch flex flex-[1_0_0] gap-[var(--numbers\/6,6px)] items-center min-w-px relative" id={isDefaultAndCollapseAndNotBackgroundAndTopBottom ? "node-I47033_40694-47033_39389" : isDefaultAndCollapseAndNotBackgroundAndFull ? "node-I47033_41293-47033_39389" : isDisabledAndCollapseAndNotBackgroundAndTopBottom ? "node-I47108_2337-47033_39389" : isDefaultAndCollapseAndBackgroundAndTopBottom ? "node-I47127_2133-47033_39389" : isDefaultAndCollapseAndBackgroundAndFull ? "node-I47127_2181-47033_39389" : isDefaultAndExpandedAndNotBackgroundAndTopBottom ? "node-I47033_40932-47033_39389" : isDefaultAndExpandedAndNotBackgroundAndFull ? "node-I47042_41373-47033_39389" : isDisabledAndExpandedAndNotBackgroundAndTopBottom ? "node-I47127_2107-47033_39389" : isDefaultAndExpandedAndBackgroundAndTopBottom ? "node-I47127_2155-47033_39389" : "node-I47127_2203-47033_39389"} data-name="Title-Left">
                  {isDefault && (
                    <>
                      <div className="content-stretch flex items-center justify-center p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" id={isDefaultAndCollapseAndNotBackgroundAndTopBottom ? "node-I47033_40694-47449_2085" : isDefaultAndCollapseAndNotBackgroundAndFull ? "node-I47033_41293-47449_2085" : isDefaultAndCollapseAndBackgroundAndTopBottom ? "node-I47127_2133-47449_2085" : isDefaultAndCollapseAndBackgroundAndFull ? "node-I47127_2181-47449_2085" : isDefaultAndExpandedAndNotBackgroundAndTopBottom ? "node-I47033_40932-47449_2085" : isDefaultAndExpandedAndNotBackgroundAndFull ? "node-I47042_41373-47449_2085" : isDefaultAndExpandedAndBackgroundAndTopBottom ? "node-I47127_2155-47449_2085" : "node-I47127_2203-47449_2085"} data-name="variant=primary, state=default, isCompact=true, appearance=none, loadingState=none, link=false, iconOnly=True, isInverse=false, isFullWidth=false, disabled=false">
                        <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" id={isDefaultAndCollapseAndNotBackgroundAndTopBottom ? "node-I47033_40694-47449_2085-46186_2785" : isDefaultAndCollapseAndNotBackgroundAndFull ? "node-I47033_41293-47449_2085-46186_2785" : isDefaultAndCollapseAndBackgroundAndTopBottom ? "node-I47127_2133-47449_2085-46186_2785" : isDefaultAndCollapseAndBackgroundAndFull ? "node-I47127_2181-47449_2085-46186_2785" : isDefaultAndExpandedAndNotBackgroundAndTopBottom ? "node-I47033_40932-47449_2085-46186_2785" : isDefaultAndExpandedAndNotBackgroundAndFull ? "node-I47042_41373-47449_2085-46186_2785" : isDefaultAndExpandedAndBackgroundAndTopBottom ? "node-I47127_2155-47449_2085-46186_2785" : "node-I47127_2203-47449_2085-46186_2785"} data-name="Style=Regular,Size=20,State=Default">
                          <div className="relative shrink-0 size-[20px]" id={isDefaultAndCollapseAndNotBackgroundAndTopBottom ? "node-I47033_40694-47449_2085-46186_2785-20257_28989" : isDefaultAndCollapseAndNotBackgroundAndFull ? "node-I47033_41293-47449_2085-46186_2785-20257_28989" : isDefaultAndCollapseAndBackgroundAndTopBottom ? "node-I47127_2133-47449_2085-46186_2785-20257_28989" : isDefaultAndCollapseAndBackgroundAndFull ? "node-I47127_2181-47449_2085-46186_2785-20257_28989" : isDefaultAndExpandedAndNotBackgroundAndTopBottom ? "node-I47033_40932-47449_2085-46186_2785-20257_28989" : isDefaultAndExpandedAndNotBackgroundAndFull ? "node-I47042_41373-47449_2085-46186_2785-20257_28989" : isDefaultAndExpandedAndBackgroundAndTopBottom ? "node-I47127_2155-47449_2085-46186_2785-20257_28989" : "node-I47127_2203-47449_2085-46186_2785-20257_28989"} data-name="Vector frame">
                            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame} />
                          </div>
                        </div>
                      </div>
                      <div className="content-stretch flex flex-[1_0_0] gap-[var(--numbers\/8,8px)] h-[24px] items-center min-w-px relative" id={isDefaultAndCollapseAndNotBackgroundAndTopBottom ? "node-I47033_40694-47033_39391" : isDefaultAndCollapseAndNotBackgroundAndFull ? "node-I47033_41293-47033_39391" : isDefaultAndCollapseAndBackgroundAndTopBottom ? "node-I47127_2133-47033_39391" : isDefaultAndCollapseAndBackgroundAndFull ? "node-I47127_2181-47033_39391" : isDefaultAndExpandedAndNotBackgroundAndTopBottom ? "node-I47033_40932-47033_39391" : isDefaultAndExpandedAndNotBackgroundAndFull ? "node-I47042_41373-47033_39391" : isDefaultAndExpandedAndBackgroundAndTopBottom ? "node-I47127_2155-47033_39391" : "node-I47127_2203-47033_39391"} data-name="Title&Button">
                        <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[20px] min-w-px not-italic overflow-hidden relative text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] text-ellipsis whitespace-nowrap" id={isDefaultAndCollapseAndNotBackgroundAndTopBottom ? "node-I47033_40694-47033_39392" : isDefaultAndCollapseAndNotBackgroundAndFull ? "node-I47033_41293-47033_39392" : isDefaultAndCollapseAndBackgroundAndTopBottom ? "node-I47127_2133-47033_39392" : isDefaultAndCollapseAndBackgroundAndFull ? "node-I47127_2181-47033_39392" : isDefaultAndExpandedAndNotBackgroundAndTopBottom ? "node-I47033_40932-47033_39392" : isDefaultAndExpandedAndNotBackgroundAndFull ? "node-I47042_41373-47033_39392" : isDefaultAndExpandedAndBackgroundAndTopBottom ? "node-I47127_2155-47033_39392" : "node-I47127_2203-47033_39392"}>
                          Accordion Title
                        </p>
                      </div>
                    </>
                  )}
                  {isDisabledAndNotBackgroundAndTopBottom && (
                    <>
                      <div className="content-stretch flex gap-[10px] items-center justify-center p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" id={isDisabledAndCollapseAndNotBackgroundAndTopBottom ? "node-I47108_2337-47449_2085" : "node-I47127_2107-47449_2085"} data-name="variant=primary, state=default, isCompact=true, appearance=none, loadingState=none, link=false, iconOnly=True, isInverse=false, isFullWidth=false, disabled=true">
                        <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" id={isDisabledAndCollapseAndNotBackgroundAndTopBottom ? "node-I47108_2337-47449_2085-46186_2791" : "node-I47127_2107-47449_2085-46186_2791"} data-name="Style=Regular,Size=20,State=Default">
                          <div className="relative shrink-0 size-[20px]" id={isDisabledAndCollapseAndNotBackgroundAndTopBottom ? "node-I47108_2337-47449_2085-46186_2791-20257_28989" : "node-I47127_2107-47449_2085-46186_2791-20257_28989"} data-name="Vector frame">
                            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame3} />
                          </div>
                        </div>
                      </div>
                      <div className="content-stretch flex flex-[1_0_0] gap-[var(--numbers\/8,8px)] h-[24px] items-center min-w-px relative" id={isDisabledAndCollapseAndNotBackgroundAndTopBottom ? "node-I47108_2337-47033_39391" : "node-I47127_2107-47033_39391"} data-name="Title&Button">
                        <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[20px] min-w-px not-italic overflow-hidden relative text-[14px] text-[color:var(--surface/foreground/dynamic/neutral/disabled,#a8a8b2)] text-ellipsis whitespace-nowrap" id={isDisabledAndCollapseAndNotBackgroundAndTopBottom ? "node-I47108_2337-47033_39392" : "node-I47127_2107-47033_39392"}>
                          Accordion Title
                        </p>
                      </div>
                    </>
                  )}
                </div>
                <div className="content-stretch flex gap-[var(--spacing\/100,8px)] items-center relative shrink-0" id={isDefaultAndCollapseAndNotBackgroundAndTopBottom ? "node-I47033_40694-47153_3290" : isDefaultAndCollapseAndNotBackgroundAndFull ? "node-I47033_41293-47153_3290" : isDisabledAndCollapseAndNotBackgroundAndTopBottom ? "node-I47108_2337-47153_3290" : isDefaultAndCollapseAndBackgroundAndTopBottom ? "node-I47127_2133-47153_3290" : isDefaultAndCollapseAndBackgroundAndFull ? "node-I47127_2181-47153_3290" : isDefaultAndExpandedAndNotBackgroundAndTopBottom ? "node-I47033_40932-47153_3290" : isDefaultAndExpandedAndNotBackgroundAndFull ? "node-I47042_41373-47153_3290" : isDisabledAndExpandedAndNotBackgroundAndTopBottom ? "node-I47127_2107-47153_3290" : isDefaultAndExpandedAndBackgroundAndTopBottom ? "node-I47127_2155-47153_3290" : "node-I47127_2203-47153_3290"}>
                  {isDefault && (
                    <div className="content-stretch flex items-center justify-center p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" id={isDefaultAndCollapseAndNotBackgroundAndTopBottom ? "node-I47033_40694-47449_1791" : isDefaultAndCollapseAndNotBackgroundAndFull ? "node-I47033_41293-47449_1791" : isDefaultAndCollapseAndBackgroundAndTopBottom ? "node-I47127_2133-47449_1791" : isDefaultAndCollapseAndBackgroundAndFull ? "node-I47127_2181-47449_1791" : isDefaultAndExpandedAndNotBackgroundAndTopBottom ? "node-I47033_40932-47449_1791" : isDefaultAndExpandedAndNotBackgroundAndFull ? "node-I47042_41373-47449_1791" : isDefaultAndExpandedAndBackgroundAndTopBottom ? "node-I47127_2155-47449_1791" : "node-I47127_2203-47449_1791"} data-name="variant=primary, state=default, isCompact=true, appearance=none, loadingState=none, link=false, iconOnly=True, isInverse=false, isFullWidth=false, disabled=false">
                      <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" id={isDefaultAndCollapseAndNotBackgroundAndTopBottom ? "node-I47033_40694-47449_1791-46186_2785" : isDefaultAndCollapseAndNotBackgroundAndFull ? "node-I47033_41293-47449_1791-46186_2785" : isDefaultAndCollapseAndBackgroundAndTopBottom ? "node-I47127_2133-47449_1791-46186_2785" : isDefaultAndCollapseAndBackgroundAndFull ? "node-I47127_2181-47449_1791-46186_2785" : isDefaultAndExpandedAndNotBackgroundAndTopBottom ? "node-I47033_40932-47449_1791-46186_2785" : isDefaultAndExpandedAndNotBackgroundAndFull ? "node-I47042_41373-47449_1791-46186_2785" : isDefaultAndExpandedAndBackgroundAndTopBottom ? "node-I47127_2155-47449_1791-46186_2785" : "node-I47127_2203-47449_1791-46186_2785"} data-name="Style=Regular,Size=20,State=Default">
                        <div className="h-[16.25px] relative shrink-0 w-[15px]" id={isDefaultAndCollapseAndNotBackgroundAndTopBottom ? "node-I47033_40694-47449_1791-46186_2785-28561_9585" : isDefaultAndCollapseAndNotBackgroundAndFull ? "node-I47033_41293-47449_1791-46186_2785-28561_9585" : isDefaultAndCollapseAndBackgroundAndTopBottom ? "node-I47127_2133-47449_1791-46186_2785-28561_9585" : isDefaultAndCollapseAndBackgroundAndFull ? "node-I47127_2181-47449_1791-46186_2785-28561_9585" : isDefaultAndExpandedAndNotBackgroundAndTopBottom ? "node-I47033_40932-47449_1791-46186_2785-28561_9585" : isDefaultAndExpandedAndNotBackgroundAndFull ? "node-I47042_41373-47449_1791-46186_2785-28561_9585" : isDefaultAndExpandedAndBackgroundAndTopBottom ? "node-I47127_2155-47449_1791-46186_2785-28561_9585" : "node-I47127_2203-47449_1791-46186_2785-28561_9585"} data-name="Vector frame">
                          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame1} />
                        </div>
                      </div>
                    </div>
                  )}
                  {isDefaultAndExpanded && (
                    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[24px]" id={isDefaultAndExpandedAndNotBackgroundAndTopBottom ? "node-I47033_40932-47033_39387" : isDefaultAndExpandedAndNotBackgroundAndFull ? "node-I47042_41373-47033_39387" : isDefaultAndExpandedAndBackgroundAndTopBottom ? "node-I47127_2155-47033_39387" : "node-I47127_2203-47033_39387"} data-name="Icon/caret">
                      <div className="relative shrink-0 size-[20px]" id={isDefaultAndExpandedAndNotBackgroundAndTopBottom ? "node-I47033_40932-47033_39387-20202_949" : isDefaultAndExpandedAndNotBackgroundAndFull ? "node-I47042_41373-47033_39387-20202_949" : isDefaultAndExpandedAndBackgroundAndTopBottom ? "node-I47127_2155-47033_39387-20202_949" : "node-I47127_2203-47033_39387-20202_949"} data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame2} />
                      </div>
                    </div>
                  )}
                  {state === "Default" && type === "Collapse" && (
                    <div className="content-stretch flex items-center justify-center p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0 w-[24px]" id={isDefaultAndCollapseAndNotBackgroundAndTopBottom ? "node-I47033_40694-47033_39387" : isDefaultAndCollapseAndNotBackgroundAndFull ? "node-I47033_41293-47033_39387" : isDefaultAndCollapseAndBackgroundAndTopBottom ? "node-I47127_2133-47033_39387" : "node-I47127_2181-47033_39387"} data-name="Button">
                      <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" id={isDefaultAndCollapseAndNotBackgroundAndTopBottom ? "node-I47033_40694-47033_39387-46186_2785" : isDefaultAndCollapseAndNotBackgroundAndFull ? "node-I47033_41293-47033_39387-46186_2785" : isDefaultAndCollapseAndBackgroundAndTopBottom ? "node-I47127_2133-47033_39387-46186_2785" : "node-I47127_2181-47033_39387-46186_2785"} data-name="Style=Regular,Size=20,State=Default,Pointing=Down">
                        <div className="relative shrink-0 size-[20px]" id={isDefaultAndCollapseAndNotBackgroundAndTopBottom ? "node-I47033_40694-47033_39387-46186_2785-20202_762" : isDefaultAndCollapseAndNotBackgroundAndFull ? "node-I47033_41293-47033_39387-46186_2785-20202_762" : isDefaultAndCollapseAndBackgroundAndTopBottom ? "node-I47127_2133-47033_39387-46186_2785-20202_762" : "node-I47127_2181-47033_39387-46186_2785-20202_762"} data-name="Vector frame">
                          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame6} />
                        </div>
                      </div>
                    </div>
                  )}
                  {isDisabledAndNotBackgroundAndTopBottom && (
                    <div className="content-stretch flex gap-[10px] items-center justify-center p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" id={isDisabledAndCollapseAndNotBackgroundAndTopBottom ? "node-I47108_2337-47449_1791" : "node-I47127_2107-47449_1791"} data-name="variant=primary, state=default, isCompact=true, appearance=none, loadingState=none, link=false, iconOnly=True, isInverse=false, isFullWidth=false, disabled=true">
                      <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" id={isDisabledAndCollapseAndNotBackgroundAndTopBottom ? "node-I47108_2337-47449_1791-46186_2791" : "node-I47127_2107-47449_1791-46186_2791"} data-name="Style=Regular,Size=20,State=Default">
                        <div className="h-[16.25px] relative shrink-0 w-[15px]" id={isDisabledAndCollapseAndNotBackgroundAndTopBottom ? "node-I47108_2337-47449_1791-46186_2791-28561_9585" : "node-I47127_2107-47449_1791-46186_2791-28561_9585"} data-name="Vector frame">
                          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame4} />
                        </div>
                      </div>
                    </div>
                  )}
                  {isDisabledAndExpandedAndNotBackgroundAndTopBottom && (
                    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[24px]" data-node-id="I47127:2107;47033:39387" data-name="Icon/caret">
                      <div className="relative shrink-0 size-[20px]" data-node-id="I47127:2107;47033:39387;20202:949" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame5} />
                      </div>
                    </div>
                  )}
                  {isDisabledAndCollapseAndNotBackgroundAndTopBottom && (
                    <div className="content-stretch flex gap-[10px] items-center justify-center p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0 w-[24px]" data-node-id="I47108:2337;47033:39387" data-name="Button">
                      <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I47108:2337;47033:39387;46186:2791" data-name="Style=Regular,Size=20,State=Default,Pointing=Down">
                        <div className="relative shrink-0 size-[20px]" data-node-id="I47108:2337;47033:39387;46186:2791;20202:762" data-name="Vector frame">
                          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame7} />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        {type === "Expanded" && ((state === "Default" && border === "full") || (state === "Default" && background && border === "top&bottom") || (!background && border === "top&bottom")) && (
          <div className={`${String.raw`border-[var(--border/static/subtle/neutral,#e1e1e8)] border-b border-solid content-stretch flex gap-[var(--spacing\/0,0px)] items-center overflow-clip pb-[var(--spacing\/150,12px)] pt-[var(--spacing\/200,16px)] px-[var(--spacing\/200,16px)] relative shrink-0 w-full `}${type === "Expanded" && border === "top&bottom" && ((state === "Default" && background) || !background) ? "" : "border-l border-r rounded-bl-[2px] rounded-br-[2px]"}`} id={isDefaultAndExpandedAndNotBackgroundAndTopBottom ? "node-47033_40933" : isDefaultAndExpandedAndNotBackgroundAndFull ? "node-47042_41374" : isDisabledAndExpandedAndNotBackgroundAndTopBottom ? "node-47127_2108" : isDefaultAndExpandedAndBackgroundAndTopBottom ? "node-47127_2156" : "node-47127_2204"} data-name="Expanded">
            {isDefaultAndExpanded &&
              (instance || (
                <div className="content-start flex flex-[1_0_0] flex-wrap items-start min-w-px relative" data-node-id="47254:6617" data-name="Swap Instance">
                  <div className="content-stretch flex flex-[1_0_0] gap-[var(--spacing\/0,0px)] items-center min-w-px relative" data-node-id="I47254:6617;41350:25155">
                    <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[20px] min-w-px not-italic relative text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)]" data-node-id="I47254:6617;41350:25134">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor labore incididunt et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </div>
                </div>
              ))}
            {isDisabledAndExpandedAndNotBackgroundAndTopBottom &&
              (instance || (
                <div className="content-start flex flex-[1_0_0] flex-wrap items-start min-w-px relative" data-node-id="47254:6647" data-name="Swap Instance">
                  <div className="content-stretch flex flex-[1_0_0] gap-[var(--spacing\/0,0px)] items-center min-w-px relative" data-node-id="I47254:6647;41350:25155">
                    <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[20px] min-w-px not-italic relative text-[14px] text-[color:var(--surface/foreground/dynamic/neutral/disabled,#a8a8b2)]" data-node-id="I47254:6647;41350:25134">
                      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor labore incididunt et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </p>
                  </div>
                </div>
              ))}
          </div>
        )}
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
These styles are contained in the design: Body Md/Regular: Font(family: "DM Sans", style: Regular, size: 14, weight: 400, lineHeight: 20, letterSpacing: 0).
Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## Icon/caret
**Node ID:** 20195:11607

To find those carets, simply add the direction they are pointing to.

  

  

  

caret-right, caret-left (for regular)

  

caret-fill-right (for fill) and so on
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.

## instance "Accordion" (47799:17707, 600x40)

const imgVectorFrame = "https://www.figma.com/api/mcp/asset/4bbdadb7-cf76-4b9b-b061-9ba5c364184c.svg";
const imgVectorFrame1 = "https://www.figma.com/api/mcp/asset/c1b86326-4f14-4ebf-96ed-bbefc121fc73.svg";
const imgVectorFrame2 = "https://www.figma.com/api/mcp/asset/040a21b0-27be-4256-8fc1-6f71c2fa0e49.svg";

export default function Accordion() {
  return (
    <div className="bg-[var(--surface/background/lvl1,white)] content-stretch flex flex-col items-start relative size-full" data-node-id="47799:17707" data-name="Accordion">
      <div className="content-stretch flex flex-col items-start min-w-[180px] relative shrink-0 w-full" data-node-id="I47799:17707;47127:2132" data-name="Accordion New">
        <div className="content-stretch flex flex-col items-start min-w-[320px] relative shrink-0 w-full" data-node-id="I47799:17707;47127:2133" data-name=".Accordion Header">
          <div className="content-stretch flex flex-col gap-[var(--spacing\/0,0px)] items-start relative shrink-0 w-full" data-node-id="I47799:17707;47127:2133;47033:39384" data-name="Accordion New">
            <div className="border-[var(--border/static/subtle/neutral,#e1e1e8)] border-b-[length:var(--stroke_weight\/15,1px)] border-solid border-t-[length:var(--stroke_weight\/15,1px)] content-stretch flex flex-col gap-[var(--spacing\/0,0px)] items-start overflow-clip px-[var(--spacing\/150,12px)] py-[var(--spacing\/100,8px)] relative shrink-0 w-full" data-node-id="I47799:17707;47127:2133;47033:39385" data-name="Accordion">
              <div className="content-stretch flex gap-[var(--spacing\/250,20px)] items-center relative shrink-0 w-full" data-node-id="I47799:17707;47127:2133;47153:3629">
                <div className="content-stretch flex flex-[1_0_0] gap-[var(--numbers\/6,6px)] items-center min-w-px relative" data-node-id="I47799:17707;47127:2133;47033:39389" data-name="Title-Left">
                  <div className="content-stretch flex items-center justify-center p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="I47799:17707;47127:2133;47449:2085" data-name="variant=primary, state=default, isCompact=true, appearance=none, loadingState=none, link=false, iconOnly=True, isInverse=false, isFullWidth=false, disabled=false">
                    <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I47799:17707;47127:2133;47449:2085;46186:2785" data-name="Style=Regular,Size=20,State=Default">
                      <div className="relative shrink-0 size-[20px]" data-node-id="I47799:17707;47127:2133;47449:2085;46186:2785;20257:28989" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame} />
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-[1_0_0] gap-[var(--numbers\/8,8px)] h-[24px] items-center min-w-px relative" data-node-id="I47799:17707;47127:2133;47033:39391" data-name="Title&Button">
                    <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[20px] min-w-px not-italic overflow-hidden relative text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] text-ellipsis whitespace-nowrap" data-node-id="I47799:17707;47127:2133;47033:39392">
                      Accordion Title
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex gap-[var(--spacing\/100,8px)] items-center relative shrink-0" data-node-id="I47799:17707;47127:2133;47153:3290">
                  <div className="content-stretch flex items-center justify-center p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="I47799:17707;47127:2133;47449:1791" data-name="variant=primary, state=default, isCompact=true, appearance=none, loadingState=none, link=false, iconOnly=True, isInverse=false, isFullWidth=false, disabled=false">
                    <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I47799:17707;47127:2133;47449:1791;46186:2785" data-name="Style=Regular,Size=20,State=Default">
                      <div className="h-[16.25px] relative shrink-0 w-[15px]" data-node-id="I47799:17707;47127:2133;47449:1791;46186:2785;28561:9585" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame1} />
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex items-center justify-center p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0 w-[24px]" data-node-id="I47799:17707;47127:2133;47033:39387" data-name="Button">
                    <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I47799:17707;47127:2133;47033:39387;46186:2785" data-name="Style=Regular,Size=20,State=Default,Pointing=Down">
                      <div className="relative shrink-0 size-[20px]" data-node-id="I47799:17707;47127:2133;47033:39387;46186:2785;20202:762" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame2} />
                      </div>
                    </div>
                  </div>
                </div>
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
These styles are contained in the design: Body Md/Regular: Font(family: "DM Sans", style: Regular, size: 14, weight: 400, lineHeight: 20, letterSpacing: 0).
Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## Icon/caret
**Node ID:** 20195:11607

To find those carets, simply add the direction they are pointing to.

  

  

  

caret-right, caret-left (for regular)

  

caret-fill-right (for fill) and so on
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.

## instance "Accordion" (47799:17730, 600x40)

const imgVectorFrame = "https://www.figma.com/api/mcp/asset/39d655eb-5dbd-4f27-846a-cc6b1d980ae2.svg";
const imgVectorFrame1 = "https://www.figma.com/api/mcp/asset/e456d534-22d5-4d49-b2da-8758f39e5b42.svg";
const imgVectorFrame2 = "https://www.figma.com/api/mcp/asset/7185a054-a332-422e-83e0-0a17c8a51e54.svg";

export default function Accordion() {
  return (
    <div className="bg-[var(--surface/background/hover,rgba(113,113,128,0.08))] content-stretch flex flex-col items-start relative size-full" data-node-id="47799:17730" data-name="Accordion">
      <div className="content-stretch flex flex-col items-start min-w-[180px] relative shrink-0 w-full" data-node-id="I47799:17730;47127:2132" data-name="Accordion New">
        <div className="content-stretch flex flex-col items-start min-w-[320px] relative shrink-0 w-full" data-node-id="I47799:17730;47127:2133" data-name=".Accordion Header">
          <div className="content-stretch flex flex-col gap-[var(--spacing\/0,0px)] items-start relative shrink-0 w-full" data-node-id="I47799:17730;47127:2133;47033:39384" data-name="Accordion New">
            <div className="border-[var(--border/static/subtle/neutral,#e1e1e8)] border-b-[length:var(--stroke_weight\/15,1px)] border-solid border-t-[length:var(--stroke_weight\/15,1px)] content-stretch flex flex-col gap-[var(--spacing\/0,0px)] items-start overflow-clip px-[var(--spacing\/150,12px)] py-[var(--spacing\/100,8px)] relative shrink-0 w-full" data-node-id="I47799:17730;47127:2133;47033:39385" data-name="Accordion">
              <div className="content-stretch flex gap-[var(--spacing\/250,20px)] items-center relative shrink-0 w-full" data-node-id="I47799:17730;47127:2133;47153:3629">
                <div className="content-stretch flex flex-[1_0_0] gap-[var(--numbers\/6,6px)] items-center min-w-px relative" data-node-id="I47799:17730;47127:2133;47033:39389" data-name="Title-Left">
                  <div className="content-stretch flex items-center justify-center p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="I47799:17730;47127:2133;47449:2085" data-name="variant=primary, state=default, isCompact=true, appearance=none, loadingState=none, link=false, iconOnly=True, isInverse=false, isFullWidth=false, disabled=false">
                    <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I47799:17730;47127:2133;47449:2085;46186:2785" data-name="Style=Regular,Size=20,State=Default">
                      <div className="relative shrink-0 size-[20px]" data-node-id="I47799:17730;47127:2133;47449:2085;46186:2785;20257:28989" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame} />
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-[1_0_0] gap-[var(--numbers\/8,8px)] h-[24px] items-center min-w-px relative" data-node-id="I47799:17730;47127:2133;47033:39391" data-name="Title&Button">
                    <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[20px] min-w-px not-italic overflow-hidden relative text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] text-ellipsis whitespace-nowrap" data-node-id="I47799:17730;47127:2133;47033:39392">
                      Accordion Title
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex gap-[var(--spacing\/100,8px)] items-center relative shrink-0" data-node-id="I47799:17730;47127:2133;47153:3290">
                  <div className="content-stretch flex items-center justify-center p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="I47799:17730;47127:2133;47449:1791" data-name="variant=primary, state=default, isCompact=true, appearance=none, loadingState=none, link=false, iconOnly=True, isInverse=false, isFullWidth=false, disabled=false">
                    <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I47799:17730;47127:2133;47449:1791;46186:2785" data-name="Style=Regular,Size=20,State=Default">
                      <div className="h-[16.25px] relative shrink-0 w-[15px]" data-node-id="I47799:17730;47127:2133;47449:1791;46186:2785;28561:9585" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame1} />
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex items-center justify-center p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0 w-[24px]" data-node-id="I47799:17730;47127:2133;47033:39387" data-name="Button">
                    <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I47799:17730;47127:2133;47033:39387;46186:2785" data-name="Style=Regular,Size=20,State=Default,Pointing=Down">
                      <div className="relative shrink-0 size-[20px]" data-node-id="I47799:17730;47127:2133;47033:39387;46186:2785;20202:762" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame2} />
                      </div>
                    </div>
                  </div>
                </div>
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
These styles are contained in the design: Body Md/Regular: Font(family: "DM Sans", style: Regular, size: 14, weight: 400, lineHeight: 20, letterSpacing: 0).
Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## Icon/caret
**Node ID:** 20195:11607

To find those carets, simply add the direction they are pointing to.

  

  

  

caret-right, caret-left (for regular)

  

caret-fill-right (for fill) and so on
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.

## instance "Accordion" (47799:17760, 600x40)

const imgVectorFrame = "https://www.figma.com/api/mcp/asset/d5eaeeea-2b68-47e2-ac5c-849e6d5e28dd.svg";
const imgArrow = "https://www.figma.com/api/mcp/asset/37a18ed2-5d40-46f7-8a52-8130b5bc59e9.svg";
const imgVectorFrame1 = "https://www.figma.com/api/mcp/asset/2b876f8b-c2e3-4cca-827b-052a6eed63fd.svg";
const imgVectorFrame2 = "https://www.figma.com/api/mcp/asset/9521578c-e0cc-46e8-9656-0bb15f3be735.svg";

export default function Accordion() {
  return (
    <div className="bg-[var(--surface/background/hover,rgba(113,113,128,0.08))] content-stretch flex flex-col items-start relative size-full" data-node-id="47799:17760" data-name="Accordion">
      <div className="content-stretch flex flex-col items-start min-w-[180px] relative shrink-0 w-full" data-node-id="I47799:17760;47127:2132" data-name="Accordion New">
        <div className="content-stretch flex flex-col items-start min-w-[320px] relative shrink-0 w-full" data-node-id="I47799:17760;47127:2133" data-name=".Accordion Header">
          <div className="content-stretch flex flex-col gap-[var(--spacing\/0,0px)] items-start relative shrink-0 w-full" data-node-id="I47799:17760;47127:2133;47033:39384" data-name="Accordion New">
            <div className="border-[var(--border/static/subtle/neutral,#e1e1e8)] border-b-[length:var(--stroke_weight\/15,1px)] border-solid border-t-[length:var(--stroke_weight\/15,1px)] content-stretch flex flex-col gap-[var(--spacing\/0,0px)] items-start px-[var(--spacing\/150,12px)] py-[var(--spacing\/100,8px)] relative shrink-0 w-full" data-node-id="I47799:17760;47127:2133;47033:39385" data-name="Accordion">
              <div className="content-stretch flex gap-[var(--spacing\/250,20px)] items-center relative shrink-0 w-full" data-node-id="I47799:17760;47127:2133;47153:3629">
                <div className="content-stretch flex flex-[1_0_0] gap-[var(--numbers\/6,6px)] items-center min-w-px relative" data-node-id="I47799:17760;47127:2133;47033:39389" data-name="Title-Left">
                  <div className="bg-[var(--container/dynamic/neutral/subtle/background/hover,rgba(113,113,128,0.08))] content-stretch flex gap-[10px] items-center justify-center p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="I47799:17760;47127:2133;47449:2085" data-name="variant=secondary, state=hover, isCompact=true, appearance=none, loadingState=none, link=false, iconOnly=True, isInverse=false, isFullWidth=false, disabled=false">
                    <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I47799:17760;47127:2133;47449:2085;46186:2777" data-name="Style=Regular,Size=20,State=Default">
                      <div className="relative shrink-0 size-[20px]" data-node-id="I47799:17760;47127:2133;47449:2085;46186:2777;20257:28989" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame} />
                      </div>
                    </div>
                    <div className="-translate-x-1/2 absolute content-stretch drop-shadow-[0px_1px_2px_var(--shadow/lvl8,rgba(113,113,128,0.08)),0px_12px_10px_var(--shadow/lvl10,rgba(113,113,128,0.1))] flex flex-col gap-[var(--odd_numbers\/10,10px)] items-center justify-center left-1/2 top-[26px]" data-node-id="I47799:17760;47127:2133;47449:2085;46186:2778" data-name="Standard Tooltip">
                      <div className="content-stretch flex flex-col gap-[var(--odd_numbers\/-14,0px)] items-center relative shrink-0" data-node-id="I47799:17760;47127:2133;47449:2085;46186:2778;15349:316" data-name="All">
                        <div className="mb-[-14px] relative shrink-0 size-[24.513px]" data-node-id="I47799:17760;47127:2133;47449:2085;46186:2778;4565:12357" data-name="Arrow">
                          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgArrow} />
                        </div>
                        <div className="bg-[var(--surface/background/lvl6,#282833)] content-stretch flex gap-[var(--odd_numbers\/10,10px)] items-start pb-[var(--numbers\/2,2px)] pt-[var(--odd_numbers\/3,3px)] px-[var(--numbers\/12,12px)] relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I47799:17760;47127:2133;47449:2085;46186:2778;4565:12355" data-name="Box">
                          <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--surface/foreground/static/neutral/inversed,white)] whitespace-nowrap" data-node-id="I47799:17760;47127:2133;47449:2085;46186:2778;4565:12356">
                            Action
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex flex-[1_0_0] gap-[var(--numbers\/8,8px)] h-[24px] items-center min-w-px relative" data-node-id="I47799:17760;47127:2133;47033:39391" data-name="Title&Button">
                    <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[20px] min-w-px not-italic overflow-hidden relative text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] text-ellipsis whitespace-nowrap" data-node-id="I47799:17760;47127:2133;47033:39392">
                      Accordion Title
                    </p>
                  </div>
                </div>
                <div className="content-stretch flex gap-[var(--spacing\/100,8px)] items-center relative shrink-0" data-node-id="I47799:17760;47127:2133;47153:3290">
                  <div className="bg-[var(--container/dynamic/neutral/subtle/background/hover,rgba(113,113,128,0.08))] content-stretch flex gap-[10px] items-center justify-center p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="I47799:17760;47127:2133;47449:1791" data-name="variant=primary, state=hover, isCompact=true, appearance=none, loadingState=none, link=false, iconOnly=True, isInverse=false, isFullWidth=false, disabled=false">
                    <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I47799:17760;47127:2133;47449:1791;46186:2787" data-name="Style=Regular,Size=20,State=Default">
                      <div className="h-[16.25px] relative shrink-0 w-[15px]" data-node-id="I47799:17760;47127:2133;47449:1791;46186:2787;28561:9585" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame1} />
                      </div>
                    </div>
                    <div className="-translate-x-1/2 absolute content-stretch drop-shadow-[0px_1px_2px_var(--shadow/lvl8,rgba(113,113,128,0.08)),0px_12px_10px_var(--shadow/lvl10,rgba(113,113,128,0.1))] flex flex-col gap-[var(--odd_numbers\/10,10px)] items-center justify-center left-1/2 top-[26px]" data-node-id="I47799:17760;47127:2133;47449:1791;46186:2788" data-name="Standard Tooltip">
                      <div className="content-stretch flex flex-col gap-[var(--odd_numbers\/-14,0px)] items-center relative shrink-0" data-node-id="I47799:17760;47127:2133;47449:1791;46186:2788;15349:316" data-name="All">
                        <div className="mb-[-14px] relative shrink-0 size-[24.513px]" data-node-id="I47799:17760;47127:2133;47449:1791;46186:2788;4565:12357" data-name="Arrow">
                          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgArrow} />
                        </div>
                        <div className="bg-[var(--surface/background/lvl6,#282833)] content-stretch flex gap-[var(--odd_numbers\/10,10px)] items-start pb-[var(--numbers\/2,2px)] pt-[var(--odd_numbers\/3,3px)] px-[var(--numbers\/12,12px)] relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I47799:17760;47127:2133;47449:1791;46186:2788;4565:12355" data-name="Box">
                          <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--surface/foreground/static/neutral/inversed,white)] whitespace-nowrap" data-node-id="I47799:17760;47127:2133;47449:1791;46186:2788;4565:12356">
                            Action
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex items-center justify-center p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0 w-[24px]" data-node-id="I47799:17760;47127:2133;47033:39387" data-name="Button">
                    <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I47799:17760;47127:2133;47033:39387;46186:2785" data-name="Style=Regular,Size=20,State=Default,Pointing=Down">
                      <div className="relative shrink-0 size-[20px]" data-node-id="I47799:17760;47127:2133;47033:39387;46186:2785;20202:762" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame2} />
                      </div>
                    </div>
                  </div>
                </div>
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
These styles are contained in the design: Body Md/Regular: Font(family: "DM Sans", style: Regular, size: 14, weight: 400, lineHeight: 20, letterSpacing: 0), Elevation Hover: Effect(type: DROP_SHADOW, color: shadow/lvl10, offset: (0, 12), radius: 20, spread: 0); Effect(type: DROP_SHADOW, color: shadow/lvl8, offset: (0, 1), radius: 4, spread: 0).
Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## Colour=Dark, Arrow position=Top-Middle
**Node ID:** 4565:12359

This component ONLY has a Top-Middle arrow position

## Icon/caret
**Node ID:** 20195:11607

To find those carets, simply add the direction they are pointing to.

  

  

  

caret-right, caret-left (for regular)

  

caret-fill-right (for fill) and so on
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.

## instance "Cursor/Pointer" (47799:17753, 24x24)

const imgFrame13 = "https://www.figma.com/api/mcp/asset/ad075302-8d1a-47a3-a531-4ddd40ec5dff.svg";

function CursorPointer({ className }: { className?: string }) {
  return (
    <div className={className || "overflow-clip relative size-[24px]"} data-node-id="32830:15171" data-name="Cursor/Pointer">
      <div className="absolute h-[15.309px] left-[5.37px] top-[4.39px] w-[14.396px]" data-node-id="34155:57206">
        <div className="absolute inset-[-2.45%_-2.6%]">
          <img alt="" className="block max-w-none size-full" src={imgFrame13} />
        </div>
      </div>
    </div>
  );
}

export default function CursorPointer1() {
  return <CursorPointer className="relative size-full" />;
}
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.

## instance "Cursor/Pointer" (47799:17783, 24x24)

const imgFrame13 = "https://www.figma.com/api/mcp/asset/e2111ec1-6d89-4362-89d6-0777640b7aed.svg";

function CursorPointer({ className }: { className?: string }) {
  return (
    <div className={className || "overflow-clip relative size-[24px]"} data-node-id="32830:15171" data-name="Cursor/Pointer">
      <div className="absolute h-[15.309px] left-[5.37px] top-[4.39px] w-[14.396px]" data-node-id="34155:57206">
        <div className="absolute inset-[-2.45%_-2.6%]">
          <img alt="" className="block max-w-none size-full" src={imgFrame13} />
        </div>
      </div>
    </div>
  );
}

export default function CursorPointer1() {
  return <CursorPointer className="relative size-full" />;
}
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.

## instance "Cursor/Pointer" (47799:17837, 24x24)

const imgFrame13 = "https://www.figma.com/api/mcp/asset/9fae8f64-3ca1-4655-a6ea-0d5c356b4d77.svg";

function CursorPointer({ className }: { className?: string }) {
  return (
    <div className={className || "overflow-clip relative size-[24px]"} data-node-id="32830:15171" data-name="Cursor/Pointer">
      <div className="absolute h-[15.309px] left-[5.37px] top-[4.39px] w-[14.396px]" data-node-id="34155:57206">
        <div className="absolute inset-[-2.45%_-2.6%]">
          <img alt="" className="block max-w-none size-full" src={imgFrame13} />
        </div>
      </div>
    </div>
  );
}

export default function CursorPointer1() {
  return <CursorPointer className="relative size-full" />;
}
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
