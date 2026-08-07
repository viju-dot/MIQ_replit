const imgGroup = "https://www.figma.com/api/mcp/asset/40dd9383-fbc1-4456-9ad4-b00149cac5e1.svg";
const imgGroup1 = "https://www.figma.com/api/mcp/asset/d02c3bea-51a6-499c-97ca-3acf3f63e6c9.svg";
const imgGroup436 = "https://www.figma.com/api/mcp/asset/bdb639ac-488f-47a2-9923-d4a3c8667569.svg";
const imgFrame730 = "https://www.figma.com/api/mcp/asset/a4ab4d96-ceb9-49bc-bd15-34705b9ffbc2.svg";
const imgFrame739 = "https://www.figma.com/api/mcp/asset/3f273cc0-b00b-4458-a7bc-5b67b5779f77.svg";
const imgFrame740 = "https://www.figma.com/api/mcp/asset/c59c8bc3-380f-499e-a672-98d1cd1d4fb7.svg";
const imgFrame741 = "https://www.figma.com/api/mcp/asset/bf82b4a0-7d39-42aa-be60-0d9f9087e126.svg";
const imgFrame743 = "https://www.figma.com/api/mcp/asset/00115123-c8c5-4b89-9a0a-d5142399aed2.svg";
const imgFrame744 = "https://www.figma.com/api/mcp/asset/47dc096d-45c3-4e06-a3ed-dfbc6cb32c42.svg";
const imgFrame746 = "https://www.figma.com/api/mcp/asset/b9f11c9c-fa8b-48d1-824e-14c5ee521ecc.svg";
const imgVectorFrame = "https://www.figma.com/api/mcp/asset/d8e3d477-8cfc-4f34-bdcb-6ef833b240ee.svg";
const imgVectorFrame1 = "https://www.figma.com/api/mcp/asset/fd05bcb0-a4c2-4c5b-a047-9056c29b40d9.svg";
const imgVectorFrame2 = "https://www.figma.com/api/mcp/asset/3c8432df-953c-4dcb-b4af-90abe0f59df8.svg";
const imgVectorFrame3 = "https://www.figma.com/api/mcp/asset/74b7df0f-8501-46cd-af2d-14b546e8bc7d.svg";
const imgVectorFrame4 = "https://www.figma.com/api/mcp/asset/8bf0b262-dc41-4cde-9d5d-25a8909a06e0.svg";
const imgVectorFrame5 = "https://www.figma.com/api/mcp/asset/14d3d6c1-fb69-4096-bf42-89ef8b31eecc.svg";

type ElementsProps = {
  className?: string;
  type?: "Default / Hover";
};

function Elements({ className, type = "Default / Hover" }: ElementsProps) {
  return (
    <div className={className || "content-stretch flex items-start px-[var(--numbers\\/none,0px)] py-[var(--odd_numbers\\/7,7px)] relative w-[263px]"} data-node-id="15285:1946">
      <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['DM_Sans:Regular'] justify-center leading-[0] min-w-px not-italic overflow-hidden relative text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] text-ellipsis whitespace-nowrap" data-node-id="15285:1947">
        <p className="leading-[20px] overflow-hidden text-ellipsis">Default / Hover</p>
      </div>
    </div>
  );
}

type DropdownClosedProps = {
  className?: string;
  badge?: "Off";
  border?: "Yes";
  compact?: "No";
  compactTitle?: "No";
  disabled?: "No";
  flag?: boolean;
  state?: "Default";
  title?: "No";
};

function DropdownClosed({ className, badge = "Off", border = "Yes", compact = "No", compactTitle = "No", disabled = "No", flag = false, state = "Default", title = "No" }: DropdownClosedProps) {
  return (
    <div className={className || "bg-[var(--container/dynamic/neutral/subtle/background/default/regular,white)] border-[length:var(--\\[old\\]stroke-thickness\\/1,1px)] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid content-stretch flex flex-col gap-[var(--numbers\\/none,0px)] items-start justify-center relative rounded-[var(--\\[old\\]radiuses\\/2,2px)] w-[274px]"} data-node-id="3725:8853">
      <div className="content-stretch flex gap-[var(--numbers\/8,8px)] items-center justify-end pl-[var(--numbers\/12,12px)] pr-[var(--numbers\/6,6px)] relative shrink-0 w-full" data-node-id="3725:8816" data-name="Elements">
        <Elements className="content-stretch flex flex-[1_0_0] items-start min-w-px px-[var(--numbers\/none,0px)] py-[var(--odd_numbers\/7,7px)] relative" />
        {flag && (
          <div className="h-[16px] relative shrink-0 w-[21px]" data-node-id="29062:15516" data-name="Flags">
            <div className="absolute inset-0 overflow-clip" data-node-id="I29062:15516;23001:28456" data-name="um">
              <div className="absolute contents inset-0" data-node-id="I29062:15516;23001:28457">
                <div className="absolute contents inset-0" data-node-id="I29062:15516;23001:28458" data-name="Clip path group">
                  <div className="absolute contents inset-0" data-node-id="I29062:15516;23001:28461" data-name="Group">
                    <div className="absolute inset-0 mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-size-[21px_16px]" data-node-id="I29062:15516;23001:28462" style={{ maskImage: `url("${imgGroup}")` }} data-name="Group">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup1} />
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute contents left-0 top-0" data-node-id="I29062:15516;23001:28465">
                <div className="absolute inset-[0_54.05%_46.15%_0]" data-node-id="I29062:15516;23001:28466">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgGroup436} />
                </div>
                <div className="absolute content-stretch flex flex-col gap-[0.123px] h-[7.631px] items-center left-[0.49px] top-[0.49px] w-[8.8px]" data-node-id="I29062:15516;23001:28468">
                  <div className="h-[0.738px] relative shrink-0 w-[8.8px]" data-node-id="I29062:15516;23001:28469">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame730} />
                  </div>
                  <div className="h-[0.738px] relative shrink-0 w-[7.2px]" data-node-id="I29062:15516;23001:28476">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame739} />
                  </div>
                  <div className="h-[0.738px] relative shrink-0 w-[8.8px]" data-node-id="I29062:15516;23001:28482">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame740} />
                  </div>
                  <div className="h-[0.738px] relative shrink-0 w-[7.2px]" data-node-id="I29062:15516;23001:28489">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame741} />
                  </div>
                  <div className="h-[0.738px] relative shrink-0 w-[8.8px]" data-node-id="I29062:15516;23001:28495">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame730} />
                  </div>
                  <div className="h-[0.738px] relative shrink-0 w-[7.2px]" data-node-id="I29062:15516;23001:28502">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame743} />
                  </div>
                  <div className="h-[0.738px] relative shrink-0 w-[8.8px]" data-node-id="I29062:15516;23001:28508">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame744} />
                  </div>
                  <div className="h-[0.738px] relative shrink-0 w-[7.2px]" data-node-id="I29062:15516;23001:28515">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame743} />
                  </div>
                  <div className="h-[0.738px] relative shrink-0 w-[8.8px]" data-node-id="I29062:15516;23001:28521">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgFrame746} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="flex flex-row items-center self-stretch" data-node-id="20828:2390">
          <div className="content-stretch flex h-full items-center justify-center relative shrink-0" data-name="Icon">
            <div className="content-stretch flex items-center justify-center relative shrink-0 size-[20px]" data-node-id="3725:8820" data-name="Icon/caret">
              <div className="relative shrink-0 size-[20px]" data-node-id="I3725:8820;20202:762" data-name="Vector frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type FiltersProps = {
  className?: string;
  buttonIconGroup?: boolean;
  dropdown?: boolean;
  layout?: "Case A" | "Case B";
  primaryAction?: boolean;
  prop1Line?: boolean;
  prop2Lines?: boolean;
  rangeInput?: boolean;
  secondaryAction?: boolean;
};

export default function Filters({ className, buttonIconGroup = false, dropdown = true, layout = "Case A", primaryAction = true, prop1Line = false, prop2Lines = true, rangeInput = false, secondaryAction = true }: FiltersProps) {
  const isCaseB = layout === "Case B";
  return (
    <div className={className || `content-stretch flex items-center overflow-clip relative ${isCaseB ? String.raw`flex-col gap-[var(--numbers\/16,16px)] py-[var(--numbers\/16,16px)] w-[1200px]` : "w-[1168px]"}`} id={isCaseB ? "node-28738_34819" : "node-28587_15560"}>
      {layout === "Case A" && (
        <div className="content-stretch flex flex-[1_0_0] gap-[var(--numbers\/16,16px)] items-center min-w-px p-[var(--numbers\/16,16px)] relative" data-node-id="28738:38780" data-name="Container">
          <div className="bg-[var(--container/dynamic/neutral/subtle/background/default/regular,white)] border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[var(--numbers\/none,0px)] items-start min-w-px relative rounded-[var(--\[old\]radiuses\/2,2px)]" data-node-id="28532:11049" data-name="Input/Standard">
            <div className="content-stretch flex gap-[var(--numbers\/8,8px)] items-center px-[var(--numbers\/12,12px)] py-[var(--numbers\/none,0px)] relative rounded-[var(--\[old\]radiuses\/2,2px)] shrink-0 w-[284px]" data-node-id="I28532:11049;4134:10660" data-name="elements-medium">
              <div className="content-stretch flex flex-[1_0_0] gap-[var(--numbers\/8,8px)] h-[34px] items-start min-w-px py-[var(--numbers\/8,8px)] relative" data-node-id="I28532:11049;4134:10661" data-name="Text">
                <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['DM_Sans:Regular'] h-full justify-center leading-[0] min-w-px not-italic overflow-hidden relative text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] text-ellipsis whitespace-nowrap" data-node-id="I28532:11049;4134:10662">
                  <p className="leading-[20px] overflow-hidden text-ellipsis">Filter keywords...</p>
                </div>
              </div>
            </div>
          </div>
          <div className="content-stretch flex gap-[var(--numbers\/16,16px)] items-center relative shrink-0" data-node-id="28587:17254" data-name="Right Side">
            {dropdown && <DropdownClosed className="bg-[var(--container/dynamic/neutral/subtle/background/default/regular,white)] border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid content-stretch flex flex-col gap-[var(--numbers\/none,0px)] items-start justify-center relative rounded-[var(--\[old\]radiuses\/2,2px)] shrink-0 w-[274px]" />}
            {rangeInput && (
              <div className="bg-[var(--container/dynamic/neutral/subtle/background/default/regular,white)] border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid content-stretch flex flex-col gap-[var(--numbers\/none,0px)] items-start relative rounded-[var(--\[old\]radiuses\/2,2px)] shrink-0 w-[250px]" data-node-id="28587:20630" data-name="Input/Range">
                <div className="content-stretch flex gap-[var(--numbers\/8,8px)] h-[34px] items-center pl-[var(--numbers\/12,12px)] pr-[var(--numbers\/8,8px)] py-[var(--numbers\/none,0px)] relative rounded-[var(--\[old\]radiuses\/2,2px)] shrink-0 w-full" data-node-id="I28587:20630;8831:16337" data-name="elements-medium">
                  <div className="content-stretch flex gap-[var(--numbers\/8,8px)] h-[34px] items-start py-[var(--numbers\/8,8px)] relative shrink-0" data-node-id="I28587:20630;8831:16338" data-name="Text">
                    <div className="[word-break:break-word] flex flex-col font-['DM_Sans:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] whitespace-nowrap" data-node-id="I28587:20630;8831:16339">
                      <p className="leading-[20px]">Start date</p>
                    </div>
                  </div>
                  <div className="[word-break:break-word] flex flex-col font-['DM_Sans:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] whitespace-nowrap" data-node-id="I28587:20630;8831:16350">
                    <p className="leading-[20px]">-</p>
                  </div>
                  <div className="content-stretch flex flex-[1_0_0] gap-[var(--numbers\/8,8px)] h-[34px] items-start min-w-px py-[var(--numbers\/8,8px)] relative" data-node-id="I28587:20630;8831:16348" data-name="Text">
                    <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['DM_Sans:Regular'] justify-center leading-[0] min-w-px not-italic overflow-hidden relative text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] text-ellipsis whitespace-nowrap" data-node-id="I28587:20630;8831:16349">
                      <p className="leading-[20px] overflow-hidden text-ellipsis">End date</p>
                    </div>
                  </div>
                  <div className="content-stretch flex h-[24px] items-start relative shrink-0" data-node-id="I28587:20630;8831:16340" data-name="Icon">
                    <div className="content-stretch flex items-center justify-center px-[3px] py-[2px] relative shrink-0 size-[24px]" data-node-id="I28587:20630;8831:16341" data-name="Icon/calendar-blank">
                      <div className="h-[19.5px] relative shrink-0 w-[18px]" data-node-id="I28587:20630;8831:16341;28770:2558" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame1} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="content-stretch flex gap-[var(--odd_numbers\/-1,0px)] items-start relative shrink-0" data-node-id="28532:11052" data-name="Button Group">
              <div className="bg-[var(--container/dynamic/neutral/subtle/background/default/variation,#ebebf0)] border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid content-stretch flex gap-[var(--odd_numbers\/10,10px)] h-[34px] items-center mr-[-1px] px-[var(--numbers\/24,24px)] py-[var(--odd_numbers\/7,7px)] relative rounded-bl-[var(--\[old\]radiuses\/2,2px)] rounded-tl-[var(--\[old\]radiuses\/2,2px)] shrink-0" data-node-id="I28532:11052;17963:555" data-name="Button Group [individuals]">
                <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/selected,#13131a)] text-center whitespace-nowrap" data-node-id="I28532:11052;17963:555;17963:441">
                  Domain
                </p>
              </div>
              <div className="bg-[var(--container/dynamic/neutral/subtle/background/default/regular,white)] border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid content-stretch flex gap-[var(--odd_numbers\/10,10px)] h-[34px] items-center px-[var(--numbers\/24,24px)] py-[var(--odd_numbers\/7-5,7.5px)] relative rounded-br-[var(--\[old\]radiuses\/2,2px)] rounded-tr-[var(--\[old\]radiuses\/2,2px)] shrink-0" data-node-id="I28532:11052;17963:570" data-name="Button Group [individuals]">
                <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] text-center whitespace-nowrap" data-node-id="I28532:11052;17963:570;17963:506">
                  Category
                </p>
              </div>
            </div>
            {buttonIconGroup && (
              <div className="content-stretch flex gap-[var(--odd_numbers\/-1,0px)] items-start relative shrink-0" data-node-id="28587:20461" data-name="Button Icon Group">
                <div className="content-stretch flex gap-[var(--odd_numbers\/-1,0px)] items-start mr-[-1px] relative shrink-0 size-[34px]" data-node-id="I28587:20461;17978:475" data-name="Button Group Icon [individuals]">
                  <div className="overflow-clip relative shrink-0 size-[34px]" data-node-id="I28587:20461;17978:475;17963:1430" data-name="Left">
                    <div className="absolute bg-[var(--container/dynamic/neutral/subtle/background/default/variation,#ebebf0)] border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid inset-0 rounded-bl-[var(--\[old\]radiuses\/2,2px)] rounded-tl-[var(--\[old\]radiuses\/2,2px)]" data-node-id="I28587:20461;17978:475;17963:1431" data-name="base-medium" />
                    <div className="absolute content-stretch flex inset-[14.71%] items-center justify-center" data-node-id="I28587:20461;17978:475;17963:1432" data-name="Icon/table">
                      <div className="relative shrink-0 size-[24px]" data-node-id="I28587:20461;17978:475;17963:1432;20021:35807" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame2} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex gap-[var(--odd_numbers\/-1,0px)] items-start relative rounded-br-[var(--\[old\]radiuses\/2,2px)] rounded-tr-[var(--\[old\]radiuses\/2,2px)] shrink-0 size-[34px]" data-node-id="I28587:20461;17978:497" data-name="Button Group Icon [individuals]">
                  <div className="overflow-clip relative shrink-0 size-[34px]" data-node-id="I28587:20461;17978:497;17963:1532" data-name="Left">
                    <div className="absolute bg-[var(--container/dynamic/neutral/subtle/background/default/regular,white)] border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid inset-0 rounded-br-[2px] rounded-tr-[2px]" data-node-id="I28587:20461;17978:497;17963:1533" data-name="base-medium" />
                    <div className="absolute content-stretch flex inset-[14.71%] items-center justify-center" data-node-id="I28587:20461;17978:497;17963:1534" data-name="Icon/table">
                      <div className="relative shrink-0 size-[24px]" data-node-id="I28587:20461;17978:497;17963:1534;20021:35807" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame3} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {isCaseB && prop1Line && (
        <div className="content-stretch flex flex-col items-start px-[var(--numbers\/16,16px)] relative shrink-0 w-full" data-node-id="28738:39391" data-name="1 line">
          <div className="content-stretch flex gap-[16px] h-[34px] items-center relative shrink-0 w-full" data-node-id="28738:39393" data-name="Container">
            <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Medium'] leading-[24px] min-w-px not-italic relative text-[16px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] tracking-[-0.08px]" data-node-id="28738:39746">
              Pixels in client reporting
            </p>
            {rangeInput && (
              <div className="bg-[var(--container/dynamic/neutral/subtle/background/default/regular,white)] border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid content-stretch flex flex-col gap-[var(--numbers\/none,0px)] items-start relative rounded-[var(--\[old\]radiuses\/2,2px)] shrink-0 w-[250px]" data-node-id="28738:39398" data-name="Input/Range">
                <div className="content-stretch flex gap-[var(--numbers\/8,8px)] h-[34px] items-center pl-[var(--numbers\/12,12px)] pr-[var(--numbers\/8,8px)] py-[var(--numbers\/none,0px)] relative rounded-[var(--\[old\]radiuses\/2,2px)] shrink-0 w-full" data-node-id="I28738:39398;8831:16337" data-name="elements-medium">
                  <div className="content-stretch flex gap-[var(--numbers\/8,8px)] h-[34px] items-start py-[var(--numbers\/8,8px)] relative shrink-0" data-node-id="I28738:39398;8831:16338" data-name="Text">
                    <div className="[word-break:break-word] flex flex-col font-['DM_Sans:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] whitespace-nowrap" data-node-id="I28738:39398;8831:16339">
                      <p className="leading-[20px]">Start date</p>
                    </div>
                  </div>
                  <div className="[word-break:break-word] flex flex-col font-['DM_Sans:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] whitespace-nowrap" data-node-id="I28738:39398;8831:16350">
                    <p className="leading-[20px]">-</p>
                  </div>
                  <div className="content-stretch flex flex-[1_0_0] gap-[var(--numbers\/8,8px)] h-[34px] items-start min-w-px py-[var(--numbers\/8,8px)] relative" data-node-id="I28738:39398;8831:16348" data-name="Text">
                    <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['DM_Sans:Regular'] justify-center leading-[0] min-w-px not-italic overflow-hidden relative text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] text-ellipsis whitespace-nowrap" data-node-id="I28738:39398;8831:16349">
                      <p className="leading-[20px] overflow-hidden text-ellipsis">End date</p>
                    </div>
                  </div>
                  <div className="content-stretch flex h-[24px] items-start relative shrink-0" data-node-id="I28738:39398;8831:16340" data-name="Icon">
                    <div className="content-stretch flex items-center justify-center px-[3px] py-[2px] relative shrink-0 size-[24px]" data-node-id="I28738:39398;8831:16341" data-name="Icon/calendar-blank">
                      <div className="h-[19.5px] relative shrink-0 w-[18px]" data-node-id="I28738:39398;8831:16341;28770:2558" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame1} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div className="content-stretch flex gap-[var(--odd_numbers\/-1,0px)] items-start relative shrink-0" data-node-id="28738:39399" data-name="Button Group">
              <div className="bg-[var(--container/dynamic/neutral/subtle/background/default/variation,#ebebf0)] border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid content-stretch flex gap-[var(--odd_numbers\/10,10px)] h-[34px] items-center mr-[-1px] px-[var(--numbers\/24,24px)] py-[var(--odd_numbers\/7,7px)] relative rounded-bl-[var(--\[old\]radiuses\/2,2px)] rounded-tl-[var(--\[old\]radiuses\/2,2px)] shrink-0" data-node-id="I28738:39399;17963:555" data-name="Button Group [individuals]">
                <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/selected,#13131a)] text-center whitespace-nowrap" data-node-id="I28738:39399;17963:555;17963:441">
                  Domain
                </p>
              </div>
              <div className="bg-[var(--container/dynamic/neutral/subtle/background/default/regular,white)] border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid content-stretch flex gap-[var(--odd_numbers\/10,10px)] h-[34px] items-center px-[var(--numbers\/24,24px)] py-[var(--odd_numbers\/7-5,7.5px)] relative rounded-br-[var(--\[old\]radiuses\/2,2px)] rounded-tr-[var(--\[old\]radiuses\/2,2px)] shrink-0" data-node-id="I28738:39399;17963:570" data-name="Button Group [individuals]">
                <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] text-center whitespace-nowrap" data-node-id="I28738:39399;17963:570;17963:506">
                  Category
                </p>
              </div>
            </div>
            {buttonIconGroup && (
              <div className="content-stretch flex gap-[var(--odd_numbers\/-1,0px)] items-start relative shrink-0" data-node-id="28738:39400" data-name="Button Icon Group">
                <div className="content-stretch flex gap-[var(--odd_numbers\/-1,0px)] items-start mr-[-1px] relative shrink-0 size-[34px]" data-node-id="I28738:39400;17978:475" data-name="Button Group Icon [individuals]">
                  <div className="overflow-clip relative shrink-0 size-[34px]" data-node-id="I28738:39400;17978:475;17963:1430" data-name="Left">
                    <div className="absolute bg-[var(--container/dynamic/neutral/subtle/background/default/variation,#ebebf0)] border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid inset-0 rounded-bl-[var(--\[old\]radiuses\/2,2px)] rounded-tl-[var(--\[old\]radiuses\/2,2px)]" data-node-id="I28738:39400;17978:475;17963:1431" data-name="base-medium" />
                    <div className="absolute content-stretch flex inset-[14.71%] items-center justify-center" data-node-id="I28738:39400;17978:475;17963:1432" data-name="Icon/table">
                      <div className="relative shrink-0 size-[24px]" data-node-id="I28738:39400;17978:475;17963:1432;20021:35807" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame2} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="content-stretch flex gap-[var(--odd_numbers\/-1,0px)] items-start relative rounded-br-[var(--\[old\]radiuses\/2,2px)] rounded-tr-[var(--\[old\]radiuses\/2,2px)] shrink-0 size-[34px]" data-node-id="I28738:39400;17978:497" data-name="Button Group Icon [individuals]">
                  <div className="overflow-clip relative shrink-0 size-[34px]" data-node-id="I28738:39400;17978:497;17963:1532" data-name="Left">
                    <div className="absolute bg-[var(--container/dynamic/neutral/subtle/background/default/regular,white)] border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid inset-0 rounded-br-[2px] rounded-tr-[2px]" data-node-id="I28738:39400;17978:497;17963:1533" data-name="base-medium" />
                    <div className="absolute content-stretch flex inset-[14.71%] items-center justify-center" data-node-id="I28738:39400;17978:497;17963:1534" data-name="Icon/table">
                      <div className="relative shrink-0 size-[24px]" data-node-id="I28738:39400;17978:497;17963:1534;20021:35807" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame3} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      {isCaseB && prop2Lines && (
        <div className="content-stretch flex flex-col items-start relative shrink-0 w-full" data-node-id="28738:39348" data-name="2 lines">
          <div className="border-[var(--border/static/subtle/neutral,#e1e1e8)] border-b border-solid content-stretch flex items-center pb-[var(--numbers\/16,16px)] px-[var(--numbers\/16,16px)] relative shrink-0 w-full" data-node-id="28753:53177" data-name="Top Container">
            <div className="content-stretch flex flex-[1_0_0] h-[34px] items-center min-w-px py-[var(--numbers\/none,0px)] relative" data-node-id="28753:53178" data-name="Text">
              <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Medium'] leading-[24px] min-w-px not-italic relative text-[16px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] tracking-[-0.08px]" data-node-id="28753:53179">
                Pixels in client reporting
              </p>
            </div>
            <div className="content-stretch flex gap-[16px] items-center justify-end relative shrink-0" data-node-id="28753:53234" data-name="Actions">
              {secondaryAction && (
                <div className="content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-end relative shrink-0" data-node-id="28753:53235" data-name="Button">
                  <div className="border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/dynamic/neutral/bold/default,#4b4b59)] border-solid content-stretch flex gap-[var(--numbers\/4,4px)] h-[34px] items-center justify-center pl-[var(--numbers\/8,8px)] pr-[var(--numbers\/12,12px)] py-[var(--numbers\/8,8px)] relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I28753:53235;357:1967" data-name="button-medium">
                    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[24px]" data-node-id="I28753:53235;357:1968" data-name="Icon/sliders-horizontal">
                      <div className="relative shrink-0 size-[24px]" data-node-id="I28753:53235;357:1968;19986:44610" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame4} />
                      </div>
                    </div>
                    <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] text-center whitespace-nowrap" data-node-id="I28753:53235;357:1969">
                      Geo filters
                    </p>
                  </div>
                </div>
              )}
              {primaryAction && (
                <div className="content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-end relative rounded-[var(--input\[remove\]\/inputradius,2px)] shrink-0" data-node-id="28753:53236" data-name="Button Dropdown">
                  <div className="bg-[var(--container/dynamic/brand/bold/background/default,#7c33b5)] content-stretch flex gap-[var(--numbers\/2,2px)] h-[34px] items-center justify-center pl-[var(--spacing\/150,12px)] pr-[var(--spacing\/50,4px)] py-[var(--odd_numbers\/7,7px)] relative 
...[truncated; the scanned bounded output (including any structured content) is saved to /tmp/mcp_output/mcpFigma_getDesignContext_1786103822176_482c7209.txt in the repl this call ran in — read it with ReadFile from the same connection state]