# Side panel (page node 14651:7738)

## Page structure (XML metadata)

<canvas id="14651:7738" name="Side Panel" x="0" y="0" width="13650" height="1214">
  <frame id="14653:7836" name="Side Panel" x="-260" y="-1457" width="2026" height="1484">
    <symbol id="14653:7830" name="Size=400" x="47" y="67" width="400" height="1319" />
    <symbol id="14653:7832" name="Size=600" x="467" y="67" width="600" height="1319" />
    <symbol id="14653:7834" name="Size=800" x="1087" y="67" width="800" height="1285" />
  </frame>
  <frame id="42928:25021" name="11th August 2025" x="-260" y="291" width="1200" height="622">
    <frame id="42928:25022" name="Content" x="60" y="80" width="1080" height="462">
      <frame id="42928:25023" name="Fiber" x="0" y="0" width="217.78305053710938" height="38">
        <text id="42928:25024" name="FIBER DESIGN SYSTEM" x="1.125" y="18" width="216.65805053710938" height="20" />
        <rounded-rectangle id="42928:25025" name="image 1" x="0" y="0" width="33.677425384521484" height="2" />
      </frame>
      <text id="42928:25026" name="More information on Side Panel" x="0" y="110" width="1080" height="68" />
      <line id="42928:25027" name="Line 1" x="0" y="250" width="1593" height="0" />
      <frame id="42928:25028" name="Neutral" x="0" y="322" width="1080" height="140">
        <frame id="42928:25029" name="Frame 15" x="30" y="46" width="1020" height="48">
          <text id="42928:25030" name="Research can be found - Link" x="0" y="0" width="1020" height="48" />
        </frame>
      </frame>
    </frame>
  </frame>
  <symbol id="42575:23994" name="Swap Instance Side Panel" x="2077" y="-1457" width="368" height="300" />
  <frame id="42575:25630" name="Header Action" x="2522" y="-1457" width="104" height="144">
    <symbol id="42575:25628" name="Header Action=Pagination" x="20" y="20" width="68" height="42" />
    <symbol id="42575:25631" name="Header Action=Close" x="20" y="82" width="34" height="34" />
  </frame>
</canvas>
IMPORTANT: After you call this tool, you MUST call get_design_context if trying to implement the design, since this tool only returns metadata. If you do not call get_design_context, the agent will not be able to implement the design.


## frame "Side Panel" (14653:7836, 2026x1484)

const imgVectorFrame = "https://www.figma.com/api/mcp/asset/625fae77-f48a-49c3-a97d-a79a2dd2fd6a.svg";
const imgVectorFrame1 = "https://www.figma.com/api/mcp/asset/7aa21b9d-f2fa-4ee6-9390-2791696dfcab.svg";
const imgVectorFrame2 = "https://www.figma.com/api/mcp/asset/80d268e8-a76d-4f93-8ac6-114e786db039.svg";
const imgVectorFrame3 = "https://www.figma.com/api/mcp/asset/5d3bf4ca-ad41-414a-a56c-63e8e5f4ada5.svg";
const imgVectorFrame4 = "https://www.figma.com/api/mcp/asset/c2d7db43-0af6-40fd-88ef-0aed94b6dddc.svg";

type FooterPageProps = {
  className?: string;
  actionsLeft?: boolean;
  actionsRight?: boolean;
  type?: "Default";
};

function FooterPage({ className, actionsLeft = false, actionsRight = true, type = "Default" }: FooterPageProps) {
  return (
    <div className={className || "bg-[var(--surface/background/lvl1,white)] content-center drop-shadow-[0px_-1px_2px_var(--shadow/lvl12,rgba(113,113,128,0.12)),0px_-8px_8px_var(--shadow/lvl8,rgba(113,113,128,0.08))] flex flex-wrap h-[66px] items-center justify-between relative w-[1075px]"} data-node-id="53009:3917">
      {actionsLeft && (
        <div className="content-stretch flex flex-[1_0_0] gap-[var(--spacing\/200,16px)] items-center min-w-px px-[var(--screen\/margin,16px)] py-[var(--spacing\/200,16px)] relative" data-node-id="53009:3708" data-name="ActionsLeft">
          <div className="content-stretch flex gap-[var(--numbers\/4,4px)] items-center relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="53009:3709" data-name="Button">
            <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--surface/foreground/dynamic/brand/default,#7c33b5)] text-center whitespace-nowrap" data-node-id="I53009:3709;45750:1692">
              Link
            </p>
          </div>
          <div className="border-[length:var(--stroke_weight\/15,1px)] border-[var(--border/dynamic/neutral/bold/default,#4b4b59)] border-solid content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-end px-[var(--spacing\/150,12px)] py-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="53009:3710" data-name="Button">
            <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-center justify-center relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I53009:3710;45750:1617" data-name="button-medium">
              <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] text-center whitespace-nowrap" data-node-id="I53009:3710;45750:1619">
                Default
              </p>
            </div>
          </div>
          <div className="bg-[var(--container/dynamic/brand/bold/background/default,#7c33b5)] content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-end px-[var(--spacing\/150,12px)] py-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="53009:3711" data-name="Button">
            <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-center justify-center relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I53009:3711;45750:1539" data-name="button-medium">
              <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/brand/bold/foreground/default,white)] text-center whitespace-nowrap" data-node-id="I53009:3711;45750:1541">
                Default
              </p>
            </div>
          </div>
        </div>
      )}
      {actionsRight && (
        <div className="content-stretch flex flex-[1_0_0] gap-[var(--spacing\/200,16px)] items-center justify-end min-w-px px-[var(--screen\/margin,16px)] py-[var(--spacing\/200,16px)] relative" data-node-id="53009:3712" data-name="ActionsRight">
          <div className="content-stretch flex gap-[var(--numbers\/4,4px)] items-center relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="53009:3713" data-name="Button">
            <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--surface/foreground/dynamic/brand/default,#7c33b5)] text-center whitespace-nowrap" data-node-id="I53009:3713;45750:1692">
              Link
            </p>
          </div>
          <div className="border-[length:var(--stroke_weight\/15,1px)] border-[var(--border/dynamic/neutral/bold/default,#4b4b59)] border-solid content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-end px-[var(--spacing\/150,12px)] py-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="53009:3714" data-name="Button">
            <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-center justify-center relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I53009:3714;45750:1617" data-name="button-medium">
              <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] text-center whitespace-nowrap" data-node-id="I53009:3714;45750:1619">
                Default
              </p>
            </div>
          </div>
          <div className="bg-[var(--container/dynamic/brand/bold/background/default,#7c33b5)] content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-end px-[var(--spacing\/150,12px)] py-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="53009:3715" data-name="Button">
            <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-center justify-center relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I53009:3715;45750:1539" data-name="button-medium">
              <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/brand/bold/foreground/default,white)] text-center whitespace-nowrap" data-node-id="I53009:3715;45750:1541">
                Default
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

type HeaderActionProps = {
  className?: string;
  headerAction?: "Pagination";
};

function HeaderAction({ className, headerAction = "Pagination" }: HeaderActionProps) {
  return (
    <div className={className || "content-stretch flex flex-col h-[42px] items-end justify-end relative"} data-node-id="42575:25628">
      <div className="bg-[var(--surface/background/lvl1,white)] content-stretch flex items-center justify-end relative shrink-0" data-node-id="42575:25613" data-name="Pagination">
        <div className="content-stretch flex items-center justify-center p-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="I42575:25613;49251:42265" data-name="Button">
          <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I42575:25613;49251:42265;45750:1679" data-name="Style=Regular,Size=20,State=Default,Pointing=Left">
            <div className="relative shrink-0 size-[20px]" data-node-id="I42575:25613;49251:42265;45750:1679;20202:945" data-name="Vector frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame} />
            </div>
          </div>
        </div>
        <div className="content-stretch flex items-center justify-center p-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="I42575:25613;49251:23186" data-name="Button">
          <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I42575:25613;49251:23186;45750:1679" data-name="Style=Regular,Size=20,State=Default,Pointing=Right">
            <div className="relative shrink-0 size-[20px]" data-node-id="I42575:25613;49251:23186;45750:1679;20202:941" data-name="Vector frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame1} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type SidePanelProps = {
  className?: string;
  instanceSwap?: React.ReactNode | null;
  size?: "400" | "600" | "800";
  subnav?: boolean;
  subtitle?: boolean;
  titleIcon?: boolean;
};

export default function SidePanel({ className, instanceSwap = null, size = "400", subnav = true, subtitle = true, titleIcon = false }: SidePanelProps) {
  const is400 = size === "400";
  const is600 = size === "600";
  const is800 = size === "800";
  return (
    <div className={className || `bg-[var(--surface/background/lvl2,#f7f7fa)] content-stretch drop-shadow-[0px_1px_2px_var(--shadow/lvl8,rgba(113,113,128,0.08)),0px_8px_8px_var(--shadow/lvl4,rgba(113,113,128,0.04))] flex flex-col min-w-[320px] relative ${is800 ? "h-[1285px] items-start w-[800px]" : is600 ? "h-[1319px] items-start w-[600px]" : "h-[1319px] items-center"}`} id={is800 ? "node-14653_7834" : is600 ? "node-14653_7832" : "node-14653_7830"}>
      {["600", "800"].includes(size) && (
        <div className="bg-[var(--surface/background/lvl3,#ebebf0)] content-stretch flex gap-[var(--odd_numbers\/10,10px)] items-center p-[var(--numbers\/16,16px)] relative shrink-0 w-full" id={is800 ? "node-14651_12587" : "node-14651_12549"} data-name="Right Panel Header">
          <div className="flex flex-[1_0_0] flex-row items-center self-stretch" id={is800 ? "node-14651_12588" : "node-14651_12550"}>
            <div className="content-stretch flex flex-[1_0_0] flex-col gap-[var(--numbers\/4,4px)] h-full items-start min-w-px relative" data-name="Title Area">
              <div className={`content-stretch flex gap-[8px] items-center relative shrink-0 ${is800 ? "w-full" : ""}`} id={is800 ? "node-16086_1374" : "node-16086_1082"} data-name="Title">
                {titleIcon && (
                  <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[24px]" data-node-id="16260:1337" data-name="Icon/user-circle">
                    <div className="relative shrink-0 size-[19.25px]" data-node-id="I16260:1337;28561:10473" data-name="Vector frame">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame2} />
                    </div>
                  </div>
                )}
                <div className={`[word-break:break-word] flex flex-col font-["DM_Sans:Medium"] h-full justify-center leading-[0] not-italic overflow-hidden relative text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] text-ellipsis whitespace-nowrap ${is800 ? "flex-[1_0_0] min-w-px" : "shrink-0 w-[494px]"}`}>
                  <p className="leading-[20px] overflow-hidden text-ellipsis">Title</p>
                </div>
              </div>
              {is600 && subtitle && (
                <div className="content-stretch flex items-start relative shrink-0" data-node-id="16086:1083" data-name="Subtitle">
                  <div className="[word-break:break-word] flex flex-col font-['DM_Sans:Regular'] justify-center leading-[0] not-italic overflow-hidden relative self-stretch shrink-0 text-[12px] text-[color:var(--surface/foreground/static/neutral/lvl2,#282833)] text-ellipsis w-[494px] whitespace-nowrap" data-node-id="14651:12552">
                    <p className="leading-[18px] overflow-hidden text-ellipsis">Subtitle</p>
                  </div>
                </div>
              )}
              {is800 && subtitle && (
                <div className="content-stretch flex items-start relative shrink-0 w-full" data-node-id="16086:1375" data-name="Subtitle">
                  <div className="[word-break:break-word] flex flex-col font-['DM_Sans:Regular'] justify-center leading-[0] not-italic overflow-hidden relative self-stretch shrink-0 text-[12px] text-[color:var(--surface/foreground/static/neutral/lvl2,#282833)] text-ellipsis w-[694px] whitespace-nowrap" data-node-id="14651:12590">
                    <p className="leading-[18px] overflow-hidden text-ellipsis">Subtitle</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          <HeaderAction className="content-stretch flex flex-col items-end justify-end relative shrink-0" />
        </div>
      )}
      {is400 && (
        <>
          <div className="content-stretch flex flex-col items-start relative shrink-0 w-[400px]" data-node-id="41994:292" data-name="Header">
            <div className="bg-[var(--surface/background/lvl3,#ebebf0)] content-center flex flex-wrap gap-[10px_16px] items-center p-[var(--numbers\/16,16px)] relative shrink-0 w-full" data-node-id="14651:12497" data-name="Right Panel Header">
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[var(--numbers\/4,4px)] items-start min-w-px relative" data-node-id="14651:12519" data-name="Title Area">
                <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-node-id="16086:944" data-name="Title">
                  {titleIcon && (
                    <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[24px]" data-node-id="16260:933" data-name="Icon/user-circle">
                      <div className="relative shrink-0 size-[19.25px]" data-node-id="I16260:933;28561:10473" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame2} />
                      </div>
                    </div>
                  )}
                  <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['DM_Sans:Medium'] h-full justify-center leading-[0] min-w-px not-italic overflow-hidden relative text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] text-ellipsis whitespace-nowrap">
                    <p className="leading-[20px] overflow-hidden text-ellipsis">Title</p>
                  </div>
                </div>
                {subtitle && (
                  <div className="content-stretch flex items-start relative shrink-0 w-full" data-node-id="16086:948" data-name="Subtitle">
                    <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['DM_Sans:Regular'] justify-center leading-[0] min-w-px not-italic overflow-hidden relative self-stretch text-[12px] text-[color:var(--surface/foreground/static/neutral/lvl2,#282833)] text-ellipsis whitespace-nowrap" data-node-id="14651:12518">
                      <p className="leading-[18px] overflow-hidden text-ellipsis">Subtitle</p>
                    </div>
                  </div>
                )}
              </div>
              <HeaderAction className="content-stretch flex flex-col items-end justify-end relative shrink-0" />
            </div>
            {subnav && (
              <div className="bg-[var(--surface/background/lvl1,white)] border-[var(--border/static/subtle/neutral,#e1e1e8)] border-b border-solid content-stretch flex gap-[var(--spacing\/0,0px)] items-start px-[var(--numbers\/16,16px)] py-[var(--numbers\/8,8px)] relative shrink-0 w-full" data-node-id="14651:12546" data-name="Subnav">
                <div className="content-start flex flex-[1_0_0] flex-wrap gap-y-[16px] items-start justify-between min-w-px relative" data-node-id="14651:12547" data-name="Content">
                  <div className="bg-[var(--container/dynamic/neutral/subtle/background/default/regular,white)] border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid content-stretch flex flex-col gap-[var(--numbers\/none,0px)] items-start relative rounded-[var(--\[old\]radiuses\/2,2px)] shrink-0 w-[156px]" data-node-id="14651:12523" data-name="Input">
                    <div className="content-stretch flex gap-[var(--numbers\/8,8px)] items-center pl-[var(--numbers\/12,12px)] pr-[var(--numbers\/8,8px)] py-[var(--numbers\/none,0px)] relative rounded-[var(--\[old\]radiuses\/2,2px)] shrink-0 w-full" data-node-id="I14651:12523;4134:11482" data-name="elements-small">
                      <div className="content-stretch flex flex-[1_0_0] gap-[var(--numbers\/8,8px)] items-start min-w-px py-[var(--odd_numbers\/2-5,2.5px)] relative" data-node-id="I14651:12523;4134:11483" data-name="Text">
                        <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['DM_Sans:Regular'] justify-center leading-[0] min-w-px not-italic overflow-hidden relative text-[12px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] text-ellipsis whitespace-nowrap" data-node-id="I14651:12523;4134:11484">
                          <p className="leading-[18px] overflow-hidden text-ellipsis">February, 2022</p>
                        </div>
                      </div>
                      <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0" data-node-id="I14651:12523;4134:11485" data-name="Icon">
                        <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[16px]" data-node-id="I14651:12523;4134:11486" data-name="Icon/calendar-blank">
                          <div className="h-[13px] relative shrink-0 w-[12px]" data-node-id="I14651:12523;4134:11486;28770:2561" data-name="Vector frame">
                            <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame3} />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="content-stretch flex gap-[var(--numbers\/4,4px)] items-center justify-end relative shrink-0" data-node-id="14651:12524" data-name="Link Buttons">
                    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[24px]" data-node-id="I14651:12524;6622:12389" data-name="Icon/arrow-square-out">
                      <div className="relative shrink-0 size-[24px]" data-node-id="I14651:12524;6622:12389;19986:42014" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame4} />
                      </div>
                    </div>
                    <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--surface/foreground/dynamic/brand/default,#7c33b5)] text-center whitespace-nowrap" data-node-id="I14651:12524;4518:10627">
                      Full campaign details
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px relative w-[400px]" data-node-id="42575:23997" data-name="swap container">
            {instanceSwap || <div className="bg-[var(--surface/background/lvl3,#ebebf0)] flex-[1_0_0] min-h-px relative w-full" data-node-id="42575:23998" data-name="Swap Instance Side Panel" />}
          </div>
          <FooterPage className="bg-[var(--surface/background/lvl1,white)] content-center drop-shadow-[0px_-1px_2px_var(--shadow/lvl12,rgba(113,113,128,0.12)),0px_-8px_8px_var(--shadow/lvl8,rgba(113,113,128,0.08))] flex flex-wrap gap-[0px_16px] h-[66px] items-center justify-center relative shrink-0 w-full" />
        </>
      )}
      {is600 && subnav && (
        <div className="bg-[var(--surface/background/lvl1,white)] border-[var(--border/static/subtle/neutral,#e1e1e8)] border-b border-solid content-stretch flex gap-[var(--odd_numbers\/97,97px)] items-start px-[var(--numbers\/16,16px)] py-[var(--numbers\/8,8px)] relative shrink-0 w-full" data-node-id="14651:12554" data-name="Subnav">
          <div className="content-center flex flex-[1_0_0] flex-wrap gap-y-[16px] items-center justify-between min-w-px relative" data-node-id="14651:12555" data-name="Content">
            <div className="content-stretch flex gap-[var(--numbers\/16,16px)] items-center relative shrink-0" data-node-id="14811:1099">
              <div className="[word-break:break-word] flex flex-col font-['DM_Sans:Medium'] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] tracking-[-0.08px] whitespace-nowrap" data-node-id="14811:1098">
                <p className="leading-[24px]">Text</p>
              </div>
              <div className="bg-[var(--container/dynamic/neutral/subtle/background/default/regular,white)] border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid content-stretch flex flex-col gap-[var(--numbers\/none,0px)] items-start relative rounded-[var(--\[old\]radiuses\/2,2px)] shrink-0 w-[156px]" data-node-id="14651:12556" data-name="Input">
                <div className="content-stretch flex gap-[var(--numbers\/8,8px)] items-center pl-[var(--numbers\/12,12px)] pr-[var(--numbers\/8,8px)] py-[var(--numbers\/none,0px)] relative rounded-[var(--\[old\]radiuses\/2,2px)] shrink-0 w-full" data-node-id="I14651:12556;4134:11482" data-name="elements-small">
                  <div className="content-stretch flex flex-[1_0_0] gap-[var(--numbers\/8,8px)] items-start min-w-px py-[var(--odd_numbers\/2-5,2.5px)] relative" data-node-id="I14651:12556;4134:11483" data-name="Text">
                    <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['DM_Sans:Regular'] justify-center leading-[0] min-w-px not-italic overflow-hidden relative text-[12px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] text-ellipsis whitespace-nowrap" data-node-id="I14651:12556;4134:11484">
                      <p className="leading-[18px] overflow-hidden text-ellipsis">February, 2022</p>
                    </div>
                  </div>
                  <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0" data-node-id="I14651:12556;4134:11485" data-name="Icon">
                    <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[16px]" data-node-id="I14651:12556;4134:11486" data-name="Icon/calendar-blank">
                      <div className="h-[13px] relative shrink-0 w-[12px]" data-node-id="I14651:12556;4134:11486;28770:2561" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame3} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex gap-[var(--numbers\/4,4px)] items-center justify-end relative shrink-0" data-node-id="14651:12557" data-name="Link Buttons">
              <div className="content-stretch flex items-center justify-center relative shrink-0 size-[24px]" data-node-id="I14651:12557;6622:12389" data-name="Icon/arrow-square-out">
                <div className="relative shrink-0 size-[24px]" data-node-id="I14651:12557;6622:12389;19986:42014" data-name="Vector frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame4} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--surface/foreground/dynamic/brand/default,#7c33b5)] text-center whitespace-nowrap" data-node-id="I14651:12557;4518:10627">
                Full campaign details
              </p>
            </div>
          </div>
        </div>
      )}
      {is600 && (
        <>
          <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-px relative w-full" data-node-id="42575:24160" data-name="swap container">
            {instanceSwap || <div className="bg-[var(--surface/background/lvl3,#ebebf0)] flex-[1_0_0] min-h-px relative w-full" data-node-id="42575:24161" data-name="Swap Instance Side Panel" />}
          </div>
          <FooterPage className="bg-[var(--surface/background/lvl1,white)] content-center drop-shadow-[0px_-1px_2px_var(--shadow/lvl12,rgba(113,113,128,0.12)),0px_-8px_8px_var(--shadow/lvl8,rgba(113,113,128,0.08))] flex flex-wrap gap-[0px_16px] h-[66px] items-center justify-center relative shrink-0 w-full" />
        </>
      )}
      {is800 && subnav && (
        <div className="bg-[var(--surface/background/lvl1,white)] border-[var(--border/static/subtle/neutral,#e1e1e8)] border-b border-solid content-start flex flex-wrap gap-[var(--spacing\/0,0px)] items-start px-[var(--numbers\/16,16px)] py-[var(--numbers\/8,8px)] relative shrink-0 w-full" data-node-id="14651:12592" data-name="Subnav">
          <div className="content-center flex flex-[1_0_0] flex-wrap gap-y-[16px] items-center justify-between min-w-[288px] relative" data-node-id="14651:12593" data-name="Content">
            <div className="content-center flex flex-wrap gap-[var(--numbers\/16,16px)] items-center relative shrink-0" data-node-id="14811:1097">
              <div className="[word-break:break-word] flex flex-col font-['DM_Sans:Medium'] justify-center leading-[0] not-italic relative shrink-0 text-[16px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] tracking-[-0.08px] whitespace-nowrap" data-node-id="14811:1096">
                <p className="leading-[24px]">Text</p>
              </div>
              <div className="bg-[var(--container/dynamic/neutral/subtle/background/default/regular,white)] border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid content-stretch flex flex-col gap-[var(--numbers\/none,0px)] items-start relative rounded-[var(--\[old\]radiuses\/2,2px)] shrink-0 w-[156px]" data-node-id="14651:12594" data-name="Input">
                <div className="content-stretch flex gap-[var(--numbers\/8,8px)] items-center pl-[var(--numbers\/12,12px)] pr-[var(--numbers\/8,8px)] py-[var(--numbers\/none,0px)] relative rounded-[var(--\[old\]radiuses\/2,2px)] shrink-0 w-full" data-node-id="I14651:12594;4134:11482" data-name="elements-small">
                  <div className="content-stretch flex flex-[1_0_0] gap-[var(--numbers\/8,8px)] items-start min-w-px py-[var(--odd_numbers\/2-5,2.5px)] relative" data-node-id="I14651:12594;4134:11483" data-name="Text">
                    <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['DM_Sans:Regular'] justify-center leading-[0] min-w-px not-italic overflow-hidden relative text-[12px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] text-ellipsis whitespace-nowrap" data-node-id="I14651:12594;4134:11484">
                      <p className="leading-[18px] overflow-hidden text-ellipsis">February, 2022</p>
                    </div>
                  </div>
                  <div className="content-stretch flex h-[24px] items-center justify-center relative shrink-0" data-node-id="I14651:12594;4134:11485" data-name="Icon">
                    <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[16px]" data-node-id="I14651:12594;4134:11486" data-name="Icon/calendar-blank">
                      <div className="h-[13px] relative shrink-0 w-[12px]" data-node-id="I14651:12594;4134:11486;28770:2561" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame3} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-center flex flex-wrap gap-[var(--numbers\/16,16px)] items-center min-w-[288px] relative shrink-0" data-node-id="14811:557">
              <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-node-id="42575:23390" data-name="Buttons">
                <div className="content-stretch flex gap-[var(--numbers\/none,0px)] h-[24px] items-start relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="14811:1100" data-name="Button">
                  <div className="border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/dynamic/neutral/bold/default,#4b4b59)] border-solid content-stretch flex gap-[var(--odd_numbers\/10,10px)] h-[24px] items-center justify-center pl-[6px] pr-[var(--numbers\/6,6px)] py-[var(--numbers\/2,2px)] relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I14811:1100;357:1682" data-name="button-small">
                    <div className="[word-break:break-word] flex flex-col font-['DM_Sans:Medium'] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] text-center whitespace-nowrap" data-node-id="I14811:1100;357:1683">
                      <p className="leading-[20px]">Button</p>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex gap-[var(--numbers\/none,0px)] h-[24px] items-start relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="14812:1107" data-name="Button">
                  <div className="border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/dynamic/neutral/bold/default,#4b4b59)] border-solid content-stretch flex gap-[var(--odd_numbers\/10,10px)] h-[24px] items-center justify-center pl-[6px] pr-[var(--numbers\/6,6px)] py-[var(--numbers\/2,2px)] relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I14812:1107;357:1682" data-name="button-small">
                    <div className="[word-break:break-word] flex flex-col font-['DM_Sans:Medium'] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] text-center whitespace-nowrap" data-node-id="I14812:1107;357:1683">
                      <p className="leading-[20px]">Button</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex gap-[var(--numbers\/4,4px)] items-center justify-end relative shrink-0" data-node-id="14651:12595" data-name="Link Buttons">
                <div className="content-stretch flex items-center justify-center relative shrink-0 size-[24px]" data-node-id="I14651:12595;6622:12389" data-name="Icon/arrow-square-out">
                  <div className="relative shrink-0 size-[24px]" data-node-id="I14651:12595;6622:12389;19986:42014" data-name="Vector frame">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame4} />
                  </div>
                </div>
                <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--surface/foreground/dynamic/brand/default,#7c33b5)] text-center whitespace-nowrap" data-node-id="I14651:12595;4518:10627">
                  Full campaign details
                </p>
              </div>
              <div className="content-stretch flex gap-[var(--numbers\/none,0px)] h-[24px] items-start relative ro
...[truncated; the scanned bounded output (including any structured content) is saved to /tmp/mcp_output/mcpFigma_getDesignContext_1785937951627_074952d6.txt in the repl this call ran in — read it with ReadFile from the same connection state]

## frame "11th August 2025" (42928:25021, 1200x622)

const imgImage1 = "https://www.figma.com/api/mcp/asset/ae690d52-d263-487d-ace3-68a00deedcea.png";
const imgLine1 = "https://www.figma.com/api/mcp/asset/07f8212d-bc68-47b6-9816-42221385a25d.svg";

export default function Component11ThAugust2025() {
  return (
    <div className="bg-[var(--surface/background/lvl2,#f7f7fa)] content-stretch flex items-center px-[60px] py-[80px] relative size-full" data-node-id="42928:25021" data-name="11th August 2025">
      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[72px] items-start min-w-px relative" data-node-id="42928:25022" data-name="Content">
        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="42928:25023" data-name="Fiber">
          <div className="[word-break:break-word] col-1 flex flex-col font-['DM_Sans:Regular'] justify-center ml-[1.13px] mt-[18px] not-italic relative row-1 text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl3,#717180)] w-[216.658px]" data-node-id="42928:25024">
            <p className="leading-[20px]">FIBER DESIGN SYSTEM</p>
          </div>
          <div className="col-1 h-[2px] ml-0 mt-0 relative row-1 w-[33.677px]" data-node-id="42928:25025" data-name="image 1">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
          </div>
        </div>
        <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[68px] min-w-full not-italic relative shrink-0 text-[56px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] tracking-[-1.4px] w-[min-content]" data-node-id="42928:25026">
          More information on Side Panel
        </p>
        <div className="h-0 relative shrink-0 w-[1593px]" data-node-id="42928:25027">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine1} />
          </div>
        </div>
        <div className="bg-[var(--surface/background/lvl1,white)] content-stretch flex flex-col items-start overflow-clip px-[30px] py-[46px] relative rounded-[20px] shrink-0 w-full" data-node-id="42928:25028" data-name="Neutral">
          <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-node-id="42928:25029">
            <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[0] not-italic relative shrink-0 text-[0px] text-black tracking-[-1px] w-full whitespace-pre-wrap" data-node-id="42928:25030">
              <span className="leading-[48px] text-[40px]">{`Research can be found  - `}</span>
              <a className="[text-underline-position:from-font] cursor-pointer decoration-from-font decoration-solid leading-[48px] text-[#2360db] text-[40px] underline" href="https://www.figma.com/design/FzBZUCQhZSHFU5kp4refaO/Fiber-Research?node-id=2811-8122&t=vb6jgJSKh14aToTV-4" target="_blank">
                <span className="[text-underline-position:from-font] decoration-from-font decoration-solid underline" href="https://www.figma.com/design/FzBZUCQhZSHFU5kp4refaO/Fiber-Research?node-id=2811-8122&t=vb6jgJSKh14aToTV-4" target="_blank">
                  Link
                </span>
              </a>
            </p>
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

## symbol "Swap Instance Side Panel" (42575:23994, 368x300)

export default function SwapInstanceSidePanel({ className }: { className?: string }) {
  return <div className={className || "bg-[var(--surface/background/lvl3,#ebebf0)] h-[300px] relative w-[368px]"} data-node-id="42575:23994" data-name="Swap Instance Side Panel" />;
}
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.

## frame "Header Action" (42575:25630, 104x144)

const imgVectorFrame = "https://www.figma.com/api/mcp/asset/1d900e97-141f-4a1c-a7b6-674786acc6ac.svg";
const imgVectorFrame1 = "https://www.figma.com/api/mcp/asset/2a59e17d-eed5-4a94-a982-bf6663115498.svg";
const imgVectorFrame2 = "https://www.figma.com/api/mcp/asset/ea38f09c-f25a-433c-93c7-a04f024436b6.svg";

type HeaderActionProps = {
  className?: string;
  headerAction?: "Pagination" | "Close";
};

export default function HeaderAction({ className, headerAction = "Pagination" }: HeaderActionProps) {
  const isClose = headerAction === "Close";
  return (
    <div className={className || `content-stretch flex flex-col items-end relative ${isClose ? "justify-center" : "h-[42px] justify-end"}`} id={isClose ? "node-42575_25631" : "node-42575_25628"}>
      {headerAction === "Pagination" && (
        <div className="bg-[var(--surface/background/lvl1,white)] content-stretch flex items-center justify-end relative shrink-0" data-node-id="42575:25613" data-name="Pagination">
          <div className="content-stretch flex items-center justify-center p-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="I42575:25613;49251:42265" data-name="Button">
            <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I42575:25613;49251:42265;45750:1679" data-name="Style=Regular,Size=20,State=Default,Pointing=Left">
              <div className="relative shrink-0 size-[20px]" data-node-id="I42575:25613;49251:42265;45750:1679;20202:945" data-name="Vector frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame} />
              </div>
            </div>
          </div>
          <div className="content-stretch flex items-center justify-center p-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="I42575:25613;49251:23186" data-name="Button">
            <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I42575:25613;49251:23186;45750:1679" data-name="Style=Regular,Size=20,State=Default,Pointing=Right">
              <div className="relative shrink-0 size-[20px]" data-node-id="I42575:25613;49251:23186;45750:1679;20202:941" data-name="Vector frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame1} />
              </div>
            </div>
          </div>
        </div>
      )}
      {isClose && (
        <div className="content-stretch flex items-center justify-center p-[7px] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="42939:21288" data-name="Icon Buttons">
          <div className="content-stretch flex items-center justify-center p-[5px] relative shrink-0 size-[20px]" data-node-id="I42939:21288;13473:20589" data-name="Icon/x">
            <div className="relative shrink-0 size-[15px]" data-node-id="I42939:21288;13473:20589;28564:13224" data-name="Vector frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame2} />
            </div>
          </div>
        </div>
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
Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## Icon/caret
**Node ID:** 20195:11607

To find those carets, simply add the direction they are pointing to.

  

  

  

caret-right, caret-left (for regular)

  

caret-fill-right (for fill) and so on
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
