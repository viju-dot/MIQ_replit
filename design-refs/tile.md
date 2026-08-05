# Tile (page node 13207:20490)

## Page structure (XML metadata)

<canvas id="13207:20490" name="Tile" x="0" y="0" width="0" height="0">
  <frame id="13212:23087" name="Tile" x="-360" y="-1279" width="403" height="616">
    <symbol id="30954:73276" name="Type=Static, Size=Compact, State=Default" x="20" y="20" width="363" height="46" />
    <symbol id="31940:28845" name="Type=Dynamic, Size=Standard, State=Default" x="20" y="82" width="363" height="84" />
    <symbol id="32543:12624" name="Type=Dynamic, Size=Standard, State=Hover" x="20" y="182" width="363" height="84" />
    <symbol id="32543:12667" name="Type=Dynamic, Size=Standard, State=Selected" x="20" y="282" width="363" height="84" />
    <symbol id="32543:12716" name="Type=Dynamic, Size=Standard, State=Disabled" x="20" y="382" width="363" height="84" />
    <symbol id="30993:370" name="Type=Dynamic, Size=Compact, State=Default" x="20" y="482" width="72" height="64" />
    <symbol id="30993:371" name="Type=Dynamic, Size=Compact, State=Hover" x="108" y="482" width="72" height="64" />
    <symbol id="30993:382" name="Type=Dynamic, Size=Compact, State=Selected" x="196" y="482" width="72" height="64" />
    <symbol id="30993:393" name="Type=Dynamic, Size=Compact, State=Disabled" x="284" y="482" width="72" height="64" />
    <symbol id="56127:2423" name="Type=Dynamic, Size=Mini, State=Default" x="20" y="562" width="34" height="34" />
    <symbol id="56127:2426" name="Type=Dynamic, Size=Mini, State=Hover" x="70" y="562" width="34" height="34" />
    <symbol id="56127:2429" name="Type=Dynamic, Size=Mini, State=Selected" x="120" y="562" width="34" height="34" />
    <symbol id="56127:2432" name="Type=Dynamic, Size=Mini, State=Disabled" x="170" y="562" width="34" height="34" />
  </frame>
  <frame id="30993:404" name="Designer notes" x="-1055" y="-1279" width="659" height="569">
    <text id="30998:1074" name="Breaking change for static tile:" x="24" y="60" width="234" height="24" />
    <text id="30998:1075" name="Dynamic tiles" x="371" y="56" width="105" height="24" />
    <text id="30511:65939" name="Removed the “loading states” or error states from the tile. This means that state needs to be changed on the files, using the button, not the tile. The tile static compact, would stay a purely decorative component." x="19" y="78" width="239" height="144" />
    <text id="31164:73738" name="Swap border.dynamic.neutral.subtle.hover from colours/neutral/600 to colours/neutral/500" x="16" y="239" width="239" height="90" />
    <text id="30998:1076" name="The standard dynamic tiles can either be multi select (with checkbox) or single select (with radio button). The variant can be changed by hiding/showing a checkbox or a radio in the dedicated area left of the title." x="364" y="91" width="239" height="108" />
  </frame>
  <frame id="45004:30148" name="11th August 2025" x="-1950" y="-1279" width="786" height="586">
    <frame id="45004:30149" name="Content" x="60" y="80" width="666" height="426">
      <frame id="45004:30150" name="Fiber" x="0" y="0" width="217.78305053710938" height="38">
        <text id="45004:30151" name="FIBER DESIGN SYSTEM" x="1.125" y="18" width="216.65805053710938" height="20" />
        <rounded-rectangle id="45004:30152" name="image 1" x="0" y="0" width="33.677425384521484" height="2" />
      </frame>
      <text id="45004:30153" name="More information on Tiles" x="0" y="98" width="666" height="68" />
      <line id="45004:30154" name="Line 1" x="0" y="226" width="1593" height="0" />
      <frame id="45004:30155" name="Neutral" x="0" y="286" width="666" height="140">
        <frame id="45004:30156" name="Frame 15" x="30" y="46" width="606" height="48">
          <text id="45004:30157" name="Research can be found - Link" x="0" y="0" width="606" height="48" />
        </frame>
      </frame>
    </frame>
  </frame>
</canvas>
IMPORTANT: After you call this tool, you MUST call get_design_context if trying to implement the design, since this tool only returns metadata. If you do not call get_design_context, the agent will not be able to implement the design.


## frame "Tile" (13212:23087, 403x616)

const imgVectorFrame = "https://www.figma.com/api/mcp/asset/23d8a7c2-0c08-497e-a326-5a9154dc54cd.svg";
const imgVectorFrame1 = "https://www.figma.com/api/mcp/asset/86c6d74b-7bb7-498f-80b2-a7ab549dab4c.svg";
const imgVectorFrame2 = "https://www.figma.com/api/mcp/asset/28230c6c-7f81-4fcc-960c-eb1e26821a0f.svg";
const imgVectorFrame3 = "https://www.figma.com/api/mcp/asset/06451d5d-36e9-4a76-8f9e-d7a8744ffefc.svg";
const imgVectorFrame4 = "https://www.figma.com/api/mcp/asset/fd4848a0-31ab-42b7-9d47-4c564a172085.svg";
const imgVectorFrame5 = "https://www.figma.com/api/mcp/asset/5e28577b-1bff-4caf-bd9d-93404d3f097a.svg";
const imgVectorFrame6 = "https://www.figma.com/api/mcp/asset/5da96176-785a-493c-a193-e772b269560a.svg";
const imgVectorFrame7 = "https://www.figma.com/api/mcp/asset/67611e5a-b894-40a9-aa4c-5660008a8a8c.svg";

type TileProps = {
  className?: string;
  children?: React.ReactNode | null;
  description?: boolean;
  headingIcon?: boolean;
  headingIcon1?: React.ReactNode | null;
  iconValue?: React.ReactNode | null;
  needSlot?: boolean;
  rIghtAlignButton?: boolean;
  rightIcon?: boolean;
  rightIcon1?: React.ReactNode | null;
  showHeader?: boolean;
  size?: "Compact" | "Standard" | "Mini";
  state?: "Default" | "Hover" | "Disabled" | "Selected";
  staticHeading?: string;
  type?: "Dynamic" | "Static";
};

export default function Tile({ className, children = null, description = false, headingIcon = true, headingIcon1 = null, iconValue = null, needSlot = false, rIghtAlignButton = true, rightIcon = true, rightIcon1 = null, showHeader = true, size = "Compact", state = "Default", staticHeading = "Place holder", type = "Static" }: TileProps) {
  const isDynamicAndCompact = type === "Dynamic" && size === "Compact";
  const isDynamicAndCompactAndDefault = type === "Dynamic" && size === "Compact" && state === "Default";
  const isDynamicAndCompactAndDisabled = type === "Dynamic" && size === "Compact" && state === "Disabled";
  const isDynamicAndCompactAndHover = type === "Dynamic" && size === "Compact" && state === "Hover";
  const isDynamicAndCompactAndSelected = type === "Dynamic" && size === "Compact" && state === "Selected";
  const isDynamicAndMiniAndDefault = type === "Dynamic" && size === "Mini" && state === "Default";
  const isDynamicAndMiniAndDisabled = type === "Dynamic" && size === "Mini" && state === "Disabled";
  const isDynamicAndMiniAndHover = type === "Dynamic" && size === "Mini" && state === "Hover";
  const isDynamicAndMiniAndSelected = type === "Dynamic" && size === "Mini" && state === "Selected";
  const isDynamicAndStandardAndDefault = type === "Dynamic" && size === "Standard" && state === "Default";
  const isDynamicAndStandardAndDisabled = type === "Dynamic" && size === "Standard" && state === "Disabled";
  const isDynamicAndStandardAndHover = type === "Dynamic" && size === "Standard" && state === "Hover";
  const isDynamicAndStandardAndSelected = type === "Dynamic" && size === "Standard" && state === "Selected";
  const isStaticAndCompactAndDefault = type === "Static" && size === "Compact" && state === "Default";
  return (
    <div className={className || `${String.raw`border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-solid content-stretch flex flex-col overflow-clip relative `}${isDynamicAndMiniAndDisabled ? String.raw`bg-[var(--container/dynamic/neutral/subtle/background/disabled,rgba(113,113,128,0.1))] border-[var(--border/dynamic/neutral/subtle/disabled,#e1e1e8)] items-center justify-center p-[var(--spacing\/container\/m,7px)] rounded-[var(--\[old\]radiuses\/2,2px)]` : isDynamicAndMiniAndSelected ? String.raw`bg-[var(--container/dynamic/brand/subtle/background/selected,#f6ebff)] border-[var(--border/dynamic/brand/selected,#7c33b5)] items-center justify-center p-[var(--spacing\/container\/m,7px)] rounded-[var(--\[old\]radiuses\/2,2px)]` : isDynamicAndMiniAndHover ? String.raw`bg-[var(--container/dynamic/neutral/subtle/background/hover,rgba(113,113,128,0.08))] border-[var(--border/dynamic/neutral/subtle/hover,#a8a8b2)] items-center justify-center p-[var(--spacing\/container\/m,7px)] rounded-[var(--\[old\]radiuses\/2,2px)]` : isDynamicAndMiniAndDefault ? String.raw`bg-[var(--container/dynamic/neutral/subtle/background/default/regular,white)] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] items-center justify-center p-[var(--spacing\/container\/m,7px)] rounded-[var(--\[old\]radiuses\/2,2px)]` : isDynamicAndCompactAndDisabled ? String.raw`bg-[var(--container/dynamic/neutral/subtle/background/disabled,rgba(113,113,128,0.1))] border-[var(--border/dynamic/neutral/subtle/disabled,#e1e1e8)] items-center justify-center px-[var(--spacing\/300,24px)] py-[var(--spacing\/150,12px)] rounded-[var(--radius\/25,2px)]` : isDynamicAndCompactAndSelected ? String.raw`bg-[var(--container/dynamic/brand/subtle/background/selected,#f6ebff)] border-[var(--border/dynamic/brand/selected,#7c33b5)] items-center justify-center px-[var(--spacing\/300,24px)] py-[var(--spacing\/150,12px)] rounded-[var(--radius\/25,2px)]` : isDynamicAndCompactAndHover ? String.raw`bg-[var(--container/dynamic/neutral/subtle/background/hover,rgba(113,113,128,0.08))] border-[var(--border/dynamic/neutral/subtle/hover,#a8a8b2)] items-center justify-center px-[var(--spacing\/300,24px)] py-[var(--spacing\/150,12px)] rounded-[var(--radius\/25,2px)]` : isDynamicAndCompactAndDefault ? String.raw`bg-[var(--container/dynamic/neutral/subtle/background/default/regular,white)] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] items-center justify-center px-[var(--spacing\/300,24px)] py-[var(--spacing\/150,12px)] rounded-[var(--radius\/25,2px)]` : isDynamicAndStandardAndDisabled ? String.raw`bg-[var(--container/dynamic/neutral/subtle/background/disabled,rgba(113,113,128,0.1))] border-[var(--border/dynamic/neutral/subtle/disabled,#e1e1e8)] items-start min-w-[180px] p-[var(--numbers\/16,16px)] rounded-[2px] w-[363px]` : isDynamicAndStandardAndSelected ? String.raw`bg-[var(--container/dynamic/brand/subtle/background/selected,#f6ebff)] border-[var(--border/dynamic/brand/selected,#7c33b5)] items-start min-w-[180px] p-[var(--numbers\/16,16px)] rounded-[2px] w-[363px]` : isDynamicAndStandardAndHover ? String.raw`bg-[var(--container/dynamic/neutral/subtle/background/hover,rgba(113,113,128,0.08))] border-[var(--border/dynamic/neutral/subtle/hover,#a8a8b2)] items-start min-w-[180px] p-[var(--numbers\/16,16px)] rounded-[2px] w-[363px]` : isDynamicAndStandardAndDefault ? String.raw`bg-[var(--container/dynamic/neutral/subtle/background/default/regular,white)] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] items-start min-w-[180px] p-[var(--numbers\/16,16px)] rounded-[var(--\[old\]radiuses\/2,2px)] w-[363px]` : String.raw`bg-[var(--surface/background/lvl1,white)] border-[var(--border/static/subtle/neutral,#e1e1e8)] items-start justify-center min-w-[240px] px-[var(--spacing\/100,8px)] py-[var(--spacing\/75,6px)] rounded-[var(--radius\/25,2px)] w-[363px]`}`} id={isDynamicAndMiniAndDisabled ? "node-56127_2432" : isDynamicAndMiniAndSelected ? "node-56127_2429" : isDynamicAndMiniAndHover ? "node-56127_2426" : isDynamicAndMiniAndDefault ? "node-56127_2423" : isDynamicAndCompactAndDisabled ? "node-30993_393" : isDynamicAndCompactAndSelected ? "node-30993_382" : isDynamicAndCompactAndHover ? "node-30993_371" : isDynamicAndCompactAndDefault ? "node-30993_370" : isDynamicAndStandardAndDisabled ? "node-32543_12716" : isDynamicAndStandardAndSelected ? "node-32543_12667" : isDynamicAndStandardAndHover ? "node-32543_12624" : isDynamicAndStandardAndDefault ? "node-31940_28845" : "node-30954_73276"}>
      {type === "Dynamic" && ["Compact", "Mini"].includes(size) && (
        <div className="content-stretch flex flex-col items-center justify-center relative shrink-0" id={isDynamicAndMiniAndDisabled ? "node-56127_2433" : isDynamicAndMiniAndSelected ? "node-56127_2430" : isDynamicAndMiniAndHover ? "node-56127_2427" : isDynamicAndMiniAndDefault ? "node-56127_2424" : isDynamicAndCompactAndDisabled ? "node-30993_394" : isDynamicAndCompactAndSelected ? "node-30993_383" : isDynamicAndCompactAndHover ? "node-30993_372" : "node-30869_1261"} data-name="Description">
          {isDynamicAndCompact && (
            <>
              <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[20px]" id={isDynamicAndCompactAndDisabled ? "node-30993_395" : isDynamicAndCompactAndSelected ? "node-30993_384" : isDynamicAndCompactAndHover ? "node-30993_373" : "node-30869_1262"} data-name="Icon/television">
                <div className="relative shrink-0 size-[20px]" id={isDynamicAndCompactAndDisabled ? "node-I30993_395-28935_193" : isDynamicAndCompactAndSelected ? "node-I30993_384-28935_193" : isDynamicAndCompactAndHover ? "node-I30993_373-28935_193" : "node-I30869_1262-28935_193"} data-name="Vector frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={isDynamicAndCompactAndDisabled ? imgVectorFrame7 : isDynamicAndCompactAndSelected ? imgVectorFrame6 : isDynamicAndCompactAndHover ? imgVectorFrame5 : imgVectorFrame4} />
                </div>
              </div>
              <div className={`content-stretch flex items-center justify-center py-px relative shrink-0 ${type === "Dynamic" && size === "Compact" && ["Hover", "Selected", "Disabled"].includes(state) ? "" : "flex-col"}`} id={isDynamicAndCompactAndDisabled ? "node-31480_27016" : isDynamicAndCompactAndSelected ? "node-31480_27005" : isDynamicAndCompactAndHover ? "node-31480_26994" : "node-31480_26963"} data-name="text div">
                <div className={`[word-break:break-word] flex flex-col font-["DM_Sans:Medium"] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[12px] text-center text-ellipsis whitespace-nowrap ${isDynamicAndCompactAndDisabled ? "text-[color:var(--container/dynamic/neutral/subtle/foreground/disabled,#a8a8b2)]" : isDynamicAndCompactAndSelected ? "text-[color:var(--container/dynamic/brand/subtle/foreground/delected,#7c33b5)]" : isDynamicAndCompactAndHover ? "text-[color:var(--container/dynamic/neutral/subtle/foreground/hover,#13131a)]" : "text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)]"}`} id={isDynamicAndCompactAndDisabled ? "node-30993_396" : isDynamicAndCompactAndSelected ? "node-30993_385" : isDynamicAndCompactAndHover ? "node-30993_374" : "node-30869_1263"}>
                  <p className="leading-[18px] overflow-hidden text-ellipsis">CTV</p>
                </div>
              </div>
            </>
          )}
          {isDynamicAndMiniAndDefault &&
            (iconValue || (
              <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[20px]" data-node-id="56127:2425" data-name="Icon/television">
                <div className="relative shrink-0 size-[20px]" data-node-id="I56127:2425;28935:193" data-name="Vector frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame4} />
                </div>
              </div>
            ))}
          {isDynamicAndMiniAndHover &&
            (iconValue || (
              <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[20px]" data-node-id="56127:2428" data-name="Icon/television">
                <div className="relative shrink-0 size-[20px]" data-node-id="I56127:2428;28935:193" data-name="Vector frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame5} />
                </div>
              </div>
            ))}
          {isDynamicAndMiniAndSelected &&
            (iconValue || (
              <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[20px]" data-node-id="56127:2431" data-name="Icon/television">
                <div className="relative shrink-0 size-[20px]" data-node-id="I56127:2431;28935:193" data-name="Vector frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame6} />
                </div>
              </div>
            ))}
          {isDynamicAndMiniAndDisabled &&
            (iconValue || (
              <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[20px]" data-node-id="56127:2434" data-name="Icon/television">
                <div className="relative shrink-0 size-[20px]" data-node-id="I56127:2434;28935:193" data-name="Vector frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame7} />
                </div>
              </div>
            ))}
        </div>
      )}
      {type === "Dynamic" && size === "Standard" && (
        <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full" id={isDynamicAndStandardAndDisabled ? "node-32543_12717" : isDynamicAndStandardAndSelected ? "node-32543_12668" : isDynamicAndStandardAndHover ? "node-32543_12625" : "node-31940_28731"} data-name="Content">
          {isDynamicAndStandardAndDefault && showHeader && (
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-node-id="31955:1565" data-name="Header and actions">
              <div className="relative shrink-0 size-[24px]" data-node-id="31955:1566" data-name="Top left">
                <div className="-translate-y-1/2 absolute left-0 size-[24px] top-1/2" data-node-id="31955:1567" data-name="Icon OR Selector">
                  <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex gap-[var(--spacing\/50,4px)] items-center left-1/2 p-[var(--numbers\/none,0px)] top-1/2" data-node-id="31955:1569" data-name="Check/s">
                    <div className="content-stretch flex items-center justify-center overflow-clip p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="I31955:1569;43278:11875" data-name="Checkbox-Element">
                      <div className="content-stretch flex items-center overflow-clip p-[var(--spacing\/container\/s,2px)] relative shrink-0" data-node-id="I31955:1569;43278:11875;43183:10139" data-name="inner_container">
                        <div className="border-[1.5px] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid overflow-clip relative rounded-[var(--radius\/25,2px)] shrink-0 size-[16px]" data-node-id="I31955:1569;43278:11875;43183:10140" data-name="container" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start justify-center min-w-px relative" data-node-id="31955:1570" data-name="Title or identifier">
                <div className="[word-break:break-word] flex flex-col font-['DM_Sans:Medium'] justify-center leading-[0] min-w-full not-italic overflow-hidden relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/variation,#13131a)] text-ellipsis w-[min-content] whitespace-nowrap" data-node-id="31955:1571">
                  <p className="leading-[20px] overflow-hidden text-ellipsis">{`Title of selection `}</p>
                </div>
              </div>
            </div>
          )}
          {isDynamicAndStandardAndDefault && (
            <div className="content-start flex flex-wrap items-start relative shrink-0 w-full" data-node-id="45333:4476" data-name="Swap Instance">
              <div className="content-stretch flex flex-[1_0_0] items-center min-w-px relative" data-node-id="I45333:4476;41350:25155">
                <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[20px] min-w-px not-italic relative text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)]" data-node-id="I45333:4476;41350:25134">
                  Descriptive text for selection
                </p>
              </div>
            </div>
          )}
          {isDynamicAndStandardAndHover && showHeader && (
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-node-id="32543:12626" data-name="Header and actions">
              <div className="relative shrink-0 size-[24px]" data-node-id="32543:12627" data-name="Top left">
                <div className="-translate-y-1/2 absolute left-0 size-[24px] top-1/2" data-node-id="32543:12628" data-name="Icon OR Selector">
                  <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex gap-[var(--spacing\/50,4px)] items-center left-1/2 p-[var(--numbers\/none,0px)] top-1/2" data-node-id="32543:12630" data-name="Check/s">
                    <div className="content-stretch flex items-center justify-center overflow-clip p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="I32543:12630;43278:11875" data-name="Checkbox-Element">
                      <div className="content-stretch flex items-center overflow-clip p-[var(--spacing\/container\/s,2px)] relative shrink-0" data-node-id="I32543:12630;43278:11875;43183:10139" data-name="inner_container">
                        <div className="border-[1.5px] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid overflow-clip relative rounded-[var(--radius\/25,2px)] shrink-0 size-[16px]" data-node-id="I32543:12630;43278:11875;43183:10140" data-name="container" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start justify-center min-w-px relative" data-node-id="32543:12631" data-name="Title or identifier">
                <div className="[word-break:break-word] flex flex-col font-['DM_Sans:Medium'] justify-center leading-[0] min-w-full not-italic overflow-hidden relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/hover,#13131a)] text-ellipsis w-[min-content] whitespace-nowrap" data-node-id="32543:12632">
                  <p className="leading-[20px] overflow-hidden text-ellipsis">Title of selection</p>
                </div>
              </div>
            </div>
          )}
          {isDynamicAndStandardAndHover && (
            <div className="content-start flex flex-wrap items-start relative shrink-0 w-full" data-node-id="45340:4605" data-name="Swap Instance">
              <div className="content-stretch flex flex-[1_0_0] items-center min-w-px relative" data-node-id="I45340:4605;41350:25155">
                <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[20px] min-w-px not-italic relative text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)]" data-node-id="I45340:4605;41350:25134">
                  Descriptive text for selection
                </p>
              </div>
            </div>
          )}
          {isDynamicAndStandardAndSelected && showHeader && (
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-node-id="32543:12669" data-name="Header and actions">
              <div className="relative shrink-0 size-[24px]" data-node-id="32543:12670" data-name="Top left">
                <div className="-translate-y-1/2 absolute left-0 size-[24px] top-1/2" data-node-id="32543:12671" data-name="Icon OR Selector">
                  <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex gap-[var(--spacing\/50,4px)] items-center left-1/2 p-[var(--numbers\/none,0px)] top-1/2" data-node-id="32543:12673" data-name="Check/s">
                    <div className="content-stretch flex items-center justify-center overflow-clip p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="I32543:12673;43278:82980" data-name="Checkbox-Element">
                      <div className="content-stretch flex items-center overflow-clip p-[var(--spacing\/container\/s,2px)] relative shrink-0" data-node-id="I32543:12673;43278:82980;43183:10139" data-name="inner_container">
                        <div className="bg-[var(--controls/background/selected,#7c33b5)] overflow-clip relative rounded-[var(--radius\/25,2px)] shrink-0 size-[16px]" data-node-id="I32543:12673;43278:82980;43183:10140" data-name="container">
                          <div className="absolute content-stretch flex flex-col items-center justify-center left-0 overflow-clip px-px py-[3px] size-[16px] top-0" data-node-id="I32543:12673;43278:82980;43202:79095" data-name="Icon/check">
                            <div className="h-[9.001px] relative shrink-0 w-[12.501px]" data-node-id="I32543:12673;43278:82980;43202:79095;28637:11884" data-name="Vector frame">
                              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame3} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start justify-center min-w-px relative" data-node-id="32543:12674" data-name="Title or identifier">
                <div className="[word-break:break-word] flex flex-col font-['DM_Sans:Medium'] justify-center leading-[0] min-w-full not-italic overflow-hidden relative shrink-0 text-[14px] text-[color:var(--container/dynamic/brand/subtle/foreground/delected,#7c33b5)] text-ellipsis w-[min-content] whitespace-nowrap" data-node-id="32543:12675">
                  <p className="leading-[20px] overflow-hidden text-ellipsis">Title of selection</p>
                </div>
              </div>
            </div>
          )}
          {isDynamicAndStandardAndSelected && (
            <div className="content-start flex flex-wrap items-start relative shrink-0 w-full" data-node-id="45340:4641" data-name="Swap Instance">
              <div className="content-stretch flex flex-[1_0_0] items-center min-w-px relative" data-node-id="I45340:4641;41350:25155">
                <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[20px] min-w-px not-italic relative text-[14px] text-[color:var(--container/dynamic/brand/subtle/foreground/delected,#7c33b5)]" data-node-id="I45340:4641;41350:25134">
                  Descriptive text for selection
                </p>
              </div>
            </div>
          )}
          {isDynamicAndStandardAndDisabled && showHeader && (
            <div className="content-stretch flex gap-[8px] items-center relative shrink-0 w-full" data-node-id="32543:12718" data-name="Header and actions">
              <div className="relative shrink-0 size-[24px]" data-node-id="32543:12719" data-name="Top left">
                <div className="-translate-y-1/2 absolute left-0 size-[24px] top-1/2" data-node-id="32543:12720" data-name="Icon OR Selector">
                  <div className="-translate-x-1/2 -translate-y-1/2 absolute content-stretch flex gap-[var(--spacing\/50,4px)] items-center left-1/2 p-[var(--numbers\/none,0px)] top-1/2" data-node-id="32543:12722" data-name="Check/s">
                    <div className="content-stretch flex items-center justify-center overflow-clip p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="I32543:12722;43278:82779" data-name="Checkbox-Element">
                      <div className="content-stretch flex items-center overflow-clip p-[var(--spacing\/container\/s,2px)] relative shrink-0" data-node-id="I32543:12722;43278:82779;43183:10139" data-name="inner_container">
                        <div className="border-[1.5px] border-[var(--border/dynamic/neutral/subtle/disabled,#e1e1e8)] border-solid overflow-clip relative rounded-[var(--radius\/25,2px)] shrink-0 size-[16px]" data-node-id="I32543:12722;43278:82779;43183:10140" data-name="container" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex flex-[1_0_0] flex-col gap-[10px] items-start justify-center min-w-px relative" data-node-id="32543:12723" data-name="Title or identifier">
                <div className="[word-break:break-word] flex flex-col font-['DM_Sans:Medium'] justify-center leading-[0] min-w-full not-italic overflow-hidden relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/disabled,#a8a8b2)] text-ellipsis w-[min-content] whitespace-nowrap" data-node-id="32543:12724">
                  <p className="leading-[20px] overflow-hidden text-ellipsis">Title of selection</p>
                </div>
              </div>
            </div>
          )}
          {isDynamicAndStandardAndDisabled && (
            <div className="content-start flex flex-wrap items-start relative shrink-0 w-full" data-node-id="45340:4660" data-name="Swap Instance">
              <div className="content-stretch flex flex-[1_0_0] items-center min-w-px relative" data-node-id="I45340:4660;41350:25155">
                <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[20px] min-w-px not-italic relative text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/disabled,#a8a8b2)]" data-node-id="I45340:4660;41350:25134">
                  Descriptive text for selection
                </p>
              </div>
            </div>
          )}
        </div>
      )}
      {isStaticAndCompactAndDefault && (
        <div className="content-stretch flex gap-[var(--spacing\/100,8px)] h-[34px] items-center relative shrink-0 w-full" data-node-id="30837:698" data-name="Header and actions">
          <div className="content-stretch flex flex-[1_0_0] gap-[var(--spacing\/50,4px)] items-center min-w-px relative" data-node-id="53719:49940" data-name="Left heading">
            {headingIcon &&
              (headingIcon1 || (
                <div className="content-stretch flex items-center justify-center overflow-clip relative shrink-0 size-[20px]" data-node-id="30776:758" data-name="Icon/television">
                  <div className="relative shrink-0 size-[20px]" data-node-id="I30776:758;28935:193" data-name="Vector frame">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame} />
                  </div>
                </div>
              ))}
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start justify-center min-w-px relative" data-node-id="30837:407" data-name="Title or identifier">
              <div className="[word-break:break-word] flex flex-col font-['DM_Sans:Medium'] h-[20px] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl2,#282833)] text-ellipsis w-full whitespace-nowrap" data-node-id="30776:757">
                <p className="leading-[20px] overflow-hidden text-ellipsis">{staticHeading}</p>
              </div>
            </div>
          </div>
          <div className="content-stretch flex gap-[var(--spacing\/100,8px)] items-center justify-end relative shrink-0" data-node-id="30837:396" data-name="Top right">
            {needSlot && (
              <div className="h-[24px] relative shrink-0 w-[97px]" data-node-id="53719:50095" data-name="Apply_slot">
                {children}
              </div>
            )}
            {rightIcon &&
              (rightIcon1 || (
                <div className="content-stretch flex items-center justify-center relative shrink-0 size-[20px]" data-node-id="53860:4113" data-name="Icon/info">
                  <div className="relative shrink-0 size-[20px]" data-node-id="I53860:4113;20259:29056" data-name="Vector frame">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame1} />
                  </div>
                </div>
              ))}
            {rIghtAlignButton && (
              <div className="border-[length:var(--stroke_weight\/15,1px)] border-[var(--border/dynamic/brand/default,#7c33b5)] border-solid content-stretch flex items-center justify-center p-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="53861:23100" data-name="Button">
                <div className="content-stretch flex items-center justify-center overflow-clip p-[2px] relative shrink-0 size-[20px]" data-node-id="I53861:23100;45750:1611" data-name="Style=Regular,Size=20,State=Default">
                  <div className="relative shrink-0 size-[15px]" data-node-id="I53861:23100;45750:1611;28905:4890" data-name="Vector frame">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame2} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {isStaticAndCompactAndDefault && description && (
        <div className="content-stretch flex gap-[10px] items-center relative shrink-0 w-full" data-node-id="30837:418" data-name="Description">
          <div className="[word-break:break-word] flex flex-col font-['DM_Sans:Regular'] h-full justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] text-ellipsis w-[120px] whitespace-nowrap">
            <p className="leading-[20px] overflow-hidden text-ellipsis">Placeholder text</p>
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
These styles are contained in the design: Body Md/Medium: Font(family: "DM Sans", style: Medium, size: 14, weight: 500, lineHeight: 20, letterSpacing: 0), Body Md/Regular: Font(family: "DM Sans", style: Regular, size: 14, weight: 400, lineHeight: 20, letterSpacing: 0), Body Sm/Medium: Font(family: "DM Sans", style: Medium, size: 12, weight: 500, lineHeight: 18, letterSpacing: 0).
Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## Checkbox
**Node ID:** 434:1992

**Usage:** To use the checkbox without a label, simply hid the Label layer.
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.

## frame "Designer notes" (30993:404, 659x569)

export default function DesignerNotes() {
  return (
    <div className="[word-break:break-word] bg-white not-italic relative size-full text-black" data-node-id="30993:404" data-name="Designer notes">
      <p className="-translate-x-1/2 absolute font-['DM_Sans:SemiBold'] leading-[24px] left-[141px] text-[16px] text-center top-[60px] whitespace-nowrap" data-node-id="30998:1074">
        Breaking change for static tile:
      </p>
      <p className="-translate-x-1/2 absolute font-['DM_Sans:SemiBold'] leading-[24px] left-[423.5px] text-[16px] text-center top-[56px] whitespace-nowrap" data-node-id="30998:1075">
        Dynamic tiles
      </p>
      <div className="-translate-y-1/2 absolute flex flex-col font-['DM_Sans:Medium'] justify-center leading-[0] left-[19px] text-[12px] top-[150px] w-[239px]" data-node-id="30511:65939">
        <p className="leading-[18px] mb-0 whitespace-pre-wrap">​</p>
        <ul className="list-disc">
          <li className="mb-0 ms-[18px]">
            <span className="leading-[18px]">Removed the “loading states” or error states from the tile.</span>
          </li>
          <li className="mb-0 ms-[18px]">
            <span className="leading-[18px]">{`This means that state needs to be changed on the files, using the button, not the tile. `}</span>
          </li>
          <li className="ms-[18px]">
            <span className="leading-[18px]">The tile static compact, would stay a purely decorative component.</span>
          </li>
        </ul>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['DM_Sans:Medium'] justify-center leading-[0] left-[16px] text-[12px] top-[284px] w-[239px]" data-node-id="31164:73738">
        <p className="leading-[18px] mb-0">​</p>
        <ul>
          <li className="list-disc ms-[18px]">
            <span className="leading-[18px]">Swap border.dynamic.neutral.subtle.hover from colours/neutral/600 to colours/neutral/500</span>
          </li>
        </ul>
      </div>
      <div className="-translate-y-1/2 absolute flex flex-col font-['DM_Sans:Medium'] justify-center leading-[0] left-[364px] text-[12px] top-[145px] w-[239px]" data-node-id="30998:1076">
        <ul>
          <li className="list-disc ms-[18px]">
            <span className="leading-[18px]">The standard dynamic tiles can either be multi select (with checkbox) or single select (with radio button). The variant can be changed by hiding/showing a checkbox or a radio in the dedicated area left of the title.</span>
          </li>
        </ul>
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
These styles are contained in the design: Body Lg/Semibold: Font(family: "DM Sans", style: SemiBold, size: 16, weight: 600, lineHeight: 24, letterSpacing: 0), Body Sm/Medium: Font(family: "DM Sans", style: Medium, size: 12, weight: 500, lineHeight: 18, letterSpacing: 0).
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.

## frame "11th August 2025" (45004:30148, 786x586)

const imgImage1 = "https://www.figma.com/api/mcp/asset/b189552d-b30c-41f9-8a62-8912109fb02b.png";
const imgLine1 = "https://www.figma.com/api/mcp/asset/1f6ed8da-b48b-41f5-8191-673517bc2c41.svg";

export default function Component11ThAugust2025() {
  return (
    <div className="bg-[var(--surface/background/lvl2,#f7f7fa)] content-stretch flex items-center px-[60px] py-[80px] relative size-full" data-node-id="45004:30148" data-name="11th August 2025">
      <div className="content-stretch flex flex-[1_0_0] flex-col gap-[60px] items-start min-w-px relative" data-node-id="45004:30149" data-name="Content">
        <div className="grid-cols-[max-content] grid-rows-[max-content] inline-grid leading-[0] place-items-start relative shrink-0" data-node-id="45004:30150" data-name="Fiber">
          <div className="[word-break:break-word] col-1 flex flex-col font-['DM_Sans:Regular'] justify-center ml-[1.13px] mt-[18px] not-italic relative row-1 text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl3,#717180)] w-[216.658px]" data-node-id="45004:30151">
            <p className="leading-[20px]">FIBER DESIGN SYSTEM</p>
          </div>
          <div className="col-1 h-[2px] ml-0 mt-0 relative row-1 w-[33.677px]" data-node-id="45004:30152" data-name="image 1">
            <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none size-full" src={imgImage1} />
          </div>
        </div>
        <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[68px] min-w-full not-italic relative shrink-0 text-[56px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] tracking-[-1.4px] w-[min-content]" data-node-id="45004:30153">
          More information on Tiles
        </p>
        <div className="h-0 relative shrink-0 w-[1593px]" data-node-id="45004:30154">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgLine1} />
          </div>
        </div>
        <div className="bg-[var(--surface/background/lvl1,white)] content-stretch flex flex-col items-start overflow-clip px-[30px] py-[46px] relative rounded-[20px] shrink-0 w-full" data-node-id="45004:30155" data-name="Neutral">
          <div className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full" data-node-id="45004:30156">
            <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[0] not-italic relative shrink-0 text-[0px] text-black tracking-[-1px] w-full whitespace-pre-wrap" data-node-id="45004:30157">
              <span className="leading-[48px] text-[40px]">{`Research can be found  - `}</span>
              <a className="[text-underline-position:from-font] cursor-pointer decoration-from-font decoration-solid leading-[48px] text-[#2360db] text-[40px] underline" href="https://www.figma.com/design/FzBZUCQhZSHFU5kp4refaO/Fiber-Research?node-id=3070-75913&t=zTcBn94ytrs9Kudw-4" target="_blank">
                <span className="[text-underline-position:from-font] decoration-from-font decoration-solid underline" href="https://www.figma.com/design/FzBZUCQhZSHFU5kp4refaO/Fiber-Research?node-id=3070-75913&t=zTcBn94ytrs9Kudw-4" target="_blank">
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
