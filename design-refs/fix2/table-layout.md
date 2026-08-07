const imgVectorFrame = "https://www.figma.com/api/mcp/asset/d1879c0f-61a1-4fdb-aa0a-75a678939c96.svg";
const imgVectorFrame1 = "https://www.figma.com/api/mcp/asset/16d9356b-d6f4-47c9-a9f7-6e2a1d960017.svg";
const imgVectorFrame2 = "https://www.figma.com/api/mcp/asset/656d1ada-8136-4da3-9302-b05b059578fd.svg";
const imgVectorFrame3 = "https://www.figma.com/api/mcp/asset/70d19d0b-9d31-4d50-ac66-398e1ed9670e.svg";
const imgVectorFrame4 = "https://www.figma.com/api/mcp/asset/7702302b-e0fe-42e6-beac-b66386680bf4.svg";
const imgVectorFrame5 = "https://www.figma.com/api/mcp/asset/75b9b2a2-e727-485b-abea-368585e6ef4c.svg";

type TableLayoutProps = {
  className?: string;
  footer?: boolean;
  footerActions?: boolean;
  message?: boolean;
  pagination?: boolean;
  tableHeader?: boolean;
};

export default function TableLayout({ className, footer = true, footerActions = false, message = true, pagination = true, tableHeader = true }: TableLayoutProps) {
  return (
    <div className={className || "content-stretch flex flex-col gap-[20px] items-start relative w-[1200px]"} data-node-id="28603:22623" data-name="Table Layout">
      {tableHeader && (
        <div className="content-stretch flex items-center justify-between relative shrink-0 w-[1200px]" data-node-id="28603:24898" data-name="Table header">
          <p className="[word-break:break-word] font-['DM_Sans:SemiBold'] leading-[32px] not-italic relative shrink-0 text-[24px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] tracking-[-0.36px] whitespace-nowrap" data-node-id="I28603:24898;28587:17192">
            Overview
          </p>
          <div className="content-stretch flex gap-[24px] items-center justify-end relative shrink-0" data-node-id="I28603:24898;28587:17193" data-name="Right">
            <div className="content-stretch flex gap-[16px] items-center justify-end relative shrink-0" data-node-id="I28603:24898;28587:17196" data-name="Actions">
              <div className="content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-end relative shrink-0" data-node-id="I28603:24898;28587:17197" data-name="Button">
                <div className="border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/dynamic/neutral/bold/default,#4b4b59)] border-solid content-stretch flex gap-[var(--numbers\/4,4px)] h-[34px] items-center justify-center pl-[var(--numbers\/8,8px)] pr-[var(--numbers\/12,12px)] py-[var(--numbers\/8,8px)] relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I28603:24898;28587:17197;357:1967" data-name="button-medium">
                  <div className="content-stretch flex items-center justify-center relative shrink-0 size-[24px]" data-node-id="I28603:24898;28587:17197;357:1968" data-name="Icon/sliders-horizontal">
                    <div className="relative shrink-0 size-[24px]" data-node-id="I28603:24898;28587:17197;357:1968;19986:44610" data-name="Vector frame">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] text-center whitespace-nowrap" data-node-id="I28603:24898;28587:17197;357:1969">
                    Geo filters
                  </p>
                </div>
              </div>
              <div className="content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-end relative rounded-[var(--input\[remove\]\/inputradius,2px)] shrink-0" data-node-id="I28603:24898;28587:17198" data-name="Button Dropdown">
                <div className="bg-[var(--container/dynamic/brand/bold/background/default,#7c33b5)] content-stretch flex gap-[var(--numbers\/2,2px)] h-[34px] items-center justify-center pl-[var(--spacing\/150,12px)] pr-[var(--spacing\/50,4px)] py-[var(--odd_numbers\/7,7px)] relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I28603:24898;28587:17198;1354:4416" data-name="button-medium">
                  <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/brand/bold/foreground/default,white)] whitespace-nowrap" data-node-id="I28603:24898;28587:17198;1354:4417">
                    Export
                  </p>
                  <div className="content-stretch flex items-center justify-center relative shrink-0 size-[20px]" data-node-id="I28603:24898;28587:17198;1354:4418" data-name="Icon/caret">
                    <div className="relative shrink-0 size-[20px]" data-node-id="I28603:24898;28587:17198;1354:4418;20202:762" data-name="Vector frame">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame1} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <div className="bg-[var(--surface/background/lvl1,white)] content-stretch drop-shadow-[0px_1px_2px_var(--shadow/lvl8,rgba(113,113,128,0.08)),0px_8px_8px_var(--shadow/lvl4,rgba(113,113,128,0.04))] flex flex-col items-center justify-center relative rounded-[var(--\[old\]radiuses\/2,2px)] shrink-0 w-full" data-node-id="28603:21767" data-name="Table Conteiner">
        <div className="content-stretch flex items-center overflow-clip relative shrink-0 w-full" data-node-id="28603:21770" data-name="Filters">
          <div className="content-stretch flex flex-[1_0_0] gap-[var(--numbers\/16,16px)] items-center min-w-px p-[var(--numbers\/16,16px)] relative" data-node-id="I28603:21770;28738:38780" data-name="Container">
            <div className="bg-[var(--container/dynamic/neutral/subtle/background/default/regular,white)] border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid content-stretch flex flex-[1_0_0] flex-col gap-[var(--numbers\/none,0px)] items-start min-w-px relative rounded-[var(--\[old\]radiuses\/2,2px)]" data-node-id="I28603:21770;28532:11049" data-name="Input/Standard">
              <div className="content-stretch flex gap-[var(--numbers\/8,8px)] items-center px-[var(--numbers\/12,12px)] py-[var(--numbers\/none,0px)] relative rounded-[var(--\[old\]radiuses\/2,2px)] shrink-0 w-[284px]" data-node-id="I28603:21770;28532:11049;4134:10660" data-name="elements-medium">
                <div className="content-stretch flex flex-[1_0_0] gap-[var(--numbers\/8,8px)] h-[34px] items-start min-w-px py-[var(--numbers\/8,8px)] relative" data-node-id="I28603:21770;28532:11049;4134:10661" data-name="Text">
                  <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['DM_Sans:Regular'] h-full justify-center leading-[0] min-w-px not-italic overflow-hidden relative text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] text-ellipsis whitespace-nowrap" data-node-id="I28603:21770;28532:11049;4134:10662">
                    <p className="leading-[20px] overflow-hidden text-ellipsis">Filter keywords...</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="content-stretch flex gap-[var(--numbers\/16,16px)] items-center relative shrink-0" data-node-id="I28603:21770;28587:17254" data-name="Right Side">
              <div className="bg-[var(--container/dynamic/neutral/subtle/background/default/regular,white)] border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid content-stretch flex flex-col gap-[var(--numbers\/none,0px)] items-start justify-center relative rounded-[var(--\[old\]radiuses\/2,2px)] shrink-0 w-[274px]" data-node-id="I28603:21770;28587:20394" data-name="Dropdown Closed">
                <div className="content-stretch flex gap-[var(--numbers\/8,8px)] items-center justify-end pl-[var(--numbers\/12,12px)] pr-[var(--numbers\/6,6px)] relative shrink-0 w-full" data-node-id="I28603:21770;28587:20394;3725:8816" data-name="Elements">
                  <div className="content-stretch flex flex-[1_0_0] items-start min-w-px px-[var(--numbers\/none,0px)] py-[var(--odd_numbers\/7,7px)] relative" data-node-id="I28603:21770;28587:20394;15285:3642" data-name="Elements">
                    <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['DM_Sans:Regular'] justify-center leading-[0] min-w-px not-italic overflow-hidden relative text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] text-ellipsis whitespace-nowrap" data-node-id="I28603:21770;28587:20394;15285:3642;15285:1947">
                      <p className="leading-[20px] overflow-hidden text-ellipsis">Default / Hover</p>
                    </div>
                  </div>
                  <div className="flex flex-row items-center self-stretch" data-node-id="I28603:21770;28587:20394;20828:2390">
                    <div className="content-stretch flex h-full items-center justify-center relative shrink-0" data-name="Icon">
                      <div className="content-stretch flex items-center justify-center relative shrink-0 size-[20px]" data-node-id="I28603:21770;28587:20394;3725:8820" data-name="Icon/caret">
                        <div className="relative shrink-0 size-[20px]" data-node-id="I28603:21770;28587:20394;3725:8820;20202:762" data-name="Vector frame">
                          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame2} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="content-stretch flex gap-[var(--odd_numbers\/-1,0px)] items-start relative shrink-0" data-node-id="I28603:21770;28532:11052" data-name="Button Group">
                <div className="bg-[var(--container/dynamic/neutral/subtle/background/default/variation,#ebebf0)] border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid content-stretch flex gap-[var(--odd_numbers\/10,10px)] h-[34px] items-center mr-[-1px] px-[var(--numbers\/24,24px)] py-[var(--odd_numbers\/7,7px)] relative rounded-bl-[var(--\[old\]radiuses\/2,2px)] rounded-tl-[var(--\[old\]radiuses\/2,2px)] shrink-0" data-node-id="I28603:21770;28532:11052;17963:555" data-name="Button Group [individuals]">
                  <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/selected,#13131a)] text-center whitespace-nowrap" data-node-id="I28603:21770;28532:11052;17963:555;17963:441">
                    Domain
                  </p>
                </div>
                <div className="bg-[var(--container/dynamic/neutral/subtle/background/default/regular,white)] border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid content-stretch flex gap-[var(--odd_numbers\/10,10px)] h-[34px] items-center px-[var(--numbers\/24,24px)] py-[var(--odd_numbers\/7-5,7.5px)] relative rounded-br-[var(--\[old\]radiuses\/2,2px)] rounded-tr-[var(--\[old\]radiuses\/2,2px)] shrink-0" data-node-id="I28603:21770;28532:11052;17963:570" data-name="Button Group [individuals]">
                  <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] text-center whitespace-nowrap" data-node-id="I28603:21770;28532:11052;17963:570;17963:506">
                    Category
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[16px] items-center justify-center pb-[var(--numbers\/16,16px)] px-[var(--numbers\/16,16px)] relative shrink-0 w-full" data-node-id="28738:37336" data-name="Bottom">
          {message && (
            <div className="bg-[var(--surface/background/lvl1,white)] border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/static/bold/info,#2360db)] border-solid content-stretch flex gap-[var(--spacing\/100,8px)] items-start px-[var(--spacing\/150,12px)] py-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0 w-full" data-node-id="28753:48062" data-name="Alert">
              <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-node-id="I28753:48062;3447:11132" data-name="Content">
                <div className="content-stretch flex gap-[var(--spacing\/100,8px)] items-start relative shrink-0 w-full" data-node-id="I28753:48062;3447:11133" data-name="App + Time + Title">
                  <div className="content-stretch flex items-center justify-center relative shrink-0 size-[20px]" data-node-id="I28753:48062;3447:11134" data-name="Icon/info">
                    <div className="relative shrink-0 size-[20px]" data-node-id="I28753:48062;3447:11134;20259:29056" data-name="Vector frame">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame3} />
                    </div>
                  </div>
                  <div className="content-stretch flex flex-[1_0_0] flex-col gap-[var(--numbers\/4,4px)] items-start min-w-px overflow-clip relative" data-node-id="I28753:48062;3447:11135" data-name="Text">
                    <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[0] not-italic relative shrink-0 text-[0px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] w-full" data-node-id="I28753:48062;3447:11136">
                      <span className="leading-[20px] text-[14px]">{`Pixels selected as dimension - Go to `}</span>
                      <span className="leading-[20px] text-[#7c33b5] text-[14px]">client reporting</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div className="border-[var(--border/static/subtle/neutral,#e1e1e8)] border-l border-r border-solid border-t content-stretch flex items-start overflow-clip relative shrink-0 w-full" data-node-id="28603:21771" data-name="Table Master">
            <div className="content-stretch flex flex-[1_0_0] flex-col items-start min-w-px relative" data-node-id="I28603:21771;28123:18392" data-name="Table Container">
              <div className="content-stretch flex items-start relative shrink-0 w-full" data-node-id="I28603:21771;28123:18387" data-name="Columns">
                <div className="content-stretch flex items-start relative shrink-0" data-node-id="I28603:21771;28099:16590" data-name="Table/Column">
                  <div className="content-stretch flex flex-col items-start relative shrink-0 w-[153px]" data-node-id="I28603:21771;28099:16590;51113:50014" data-name="Column container">
                    <div className="bg-[var(--surface/background/lvl2,#f7f7fa)] border-[var(--border/static/subtle/neutral,#e1e1e8)] border-b border-solid content-stretch flex h-[40px] items-center px-[var(--numbers\/none,0px)] py-[var(--odd_numbers\/10,10px)] relative shrink-0" data-node-id="I28603:21771;28099:16590;28272:132335" data-name="Column Header">
                      <div className="content-stretch flex h-[20px] items-center relative shrink-0 w-[12px]" data-node-id="I28603:21771;28099:16590;28272:132335;31051:10358" data-name="Left separator container" />
                      <div className="content-stretch flex items-center overflow-clip pr-[var(--spacing\/50,4px)] relative shrink-0" data-node-id="I28603:21771;28099:16590;28272:132335;28484:15215" data-name="Checkbox Container">
                        <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-start p-[var(--numbers\/none,0px)] relative shrink-0" data-node-id="I28603:21771;28099:16590;28272:132335;28484:15216" data-name="Check/s">
                          <div className="content-stretch flex items-center justify-center overflow-clip p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="I28603:21771;28099:16590;28272:132335;28484:15216;43278:11875" data-name="Checkbox-Element">
                            <div className="content-stretch flex items-center overflow-clip p-[var(--spacing\/container\/s,2px)] relative shrink-0" data-node-id="I28603:21771;28099:16590;28272:132335;28484:15216;43278:11875;43183:10139" data-name="inner_container">
                              <div className="border-[1.5px] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid overflow-clip relative rounded-[var(--radius\/25,2px)] shrink-0 size-[16px]" data-node-id="I28603:21771;28099:16590;28272:132335;28484:15216;43278:11875;43183:10140" data-name="container" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="content-stretch flex items-start relative shrink-0" data-node-id="I28603:21771;28099:16590;28272:132335;14421:26470" data-name="Header Cell Content">
                        <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic overflow-hidden relative shrink-0 text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl2,#282833)] text-ellipsis w-[164px] whitespace-nowrap" data-node-id="I28603:21771;28099:16590;28272:132335;14421:26471">
                          Column Header
                        </p>
                      </div>
                      <div className="content-stretch flex h-[20px] items-center justify-end relative shrink-0 w-[16px]" data-node-id="I28603:21771;28099:16590;28272:132335;28209:37740" data-name="Separator container">
                        <div className="h-[20px] relative shrink-0 w-px" data-node-id="I28603:21771;28099:16590;28272:132335;28209:37741" data-name="Separator">
                          <div className="absolute border border-[var(--border/static/subtle/neutral,#e1e1e8)] border-solid inset-0" data-node-id="I28603:21771;28099:16590;28272:132335;28209:37741;28205:33849" data-name="Separator" />
                        </div>
                      </div>
                    </div>
                    <div className="bg-[var(--container/dynamic/neutral/subtle/background/default/regular,white)] border-[var(--border/static/subtle/neutral,#e1e1e8)] border-b-[length:var(--\[old\]stroke-thickness\/1,1px)] border-solid content-stretch flex gap-[var(--spacing\/50,4px)] h-[40px] items-center pl-[var(--spacing\/150,12px)] pr-[var(--spacing\/200,16px)] relative shrink-0 w-full" data-node-id="I28603:21771;28099:16590;28272:132336" data-name="Cell/Text">
                      <div className="content-stretch flex items-center overflow-clip relative shrink-0" data-node-id="I28603:21771;28099:16590;28272:132336;28484:12464" data-name="Checkbox Container">
                        <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-start p-[var(--numbers\/none,0px)] relative shrink-0" data-node-id="I28603:21771;28099:16590;28272:132336;28481:3633" data-name="Check/s">
                          <div className="content-stretch flex items-center justify-center overflow-clip p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="I28603:21771;28099:16590;28272:132336;28481:3633;43278:11875" data-name="Checkbox-Element">
                            <div className="content-stretch flex items-center overflow-clip p-[var(--spacing\/container\/s,2px)] relative shrink-0" data-node-id="I28603:21771;28099:16590;28272:132336;28481:3633;43278:11875;43183:10139" data-name="inner_container">
                              <div className="border-[1.5px] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid overflow-clip relative rounded-[var(--radius\/25,2px)] shrink-0 size-[16px]" data-node-id="I28603:21771;28099:16590;28272:132336;28481:3633;43278:11875;43183:10140" data-name="container" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="content-stretch flex flex-[1_0_0] items-start min-w-px relative" data-node-id="I28603:21771;28099:16590;28272:132336;3108:8223" data-name="Cell Body Content">
                        <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[18px] min-w-px not-italic overflow-hidden relative text-[12px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/variation,#13131a)] text-ellipsis whitespace-nowrap" data-node-id="I28603:21771;28099:16590;28272:132336;3108:8223;3108:8194">
                          Cell content
                        </p>
                      </div>
                    </div>
                    <div className="bg-[var(--container/dynamic/neutral/subtle/background/default/regular,white)] border-[var(--border/static/subtle/neutral,#e1e1e8)] border-b-[length:var(--\[old\]stroke-thickness\/1,1px)] border-solid content-stretch flex gap-[var(--spacing\/50,4px)] h-[40px] items-center pl-[var(--spacing\/150,12px)] pr-[var(--spacing\/200,16px)] relative shrink-0 w-full" data-node-id="I28603:21771;28099:16590;28272:132337" data-name="Cell/Text">
                      <div className="content-stretch flex items-center overflow-clip relative shrink-0" data-node-id="I28603:21771;28099:16590;28272:132337;28484:12464" data-name="Checkbox Container">
                        <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-start p-[var(--numbers\/none,0px)] relative shrink-0" data-node-id="I28603:21771;28099:16590;28272:132337;28481:3633" data-name="Check/s">
                          <div className="content-stretch flex items-center justify-center overflow-clip p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="I28603:21771;28099:16590;28272:132337;28481:3633;43278:11875" data-name="Checkbox-Element">
                            <div className="content-stretch flex items-center overflow-clip p-[var(--spacing\/container\/s,2px)] relative shrink-0" data-node-id="I28603:21771;28099:16590;28272:132337;28481:3633;43278:11875;43183:10139" data-name="inner_container">
                              <div className="border-[1.5px] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid overflow-clip relative rounded-[var(--radius\/25,2px)] shrink-0 size-[16px]" data-node-id="I28603:21771;28099:16590;28272:132337;28481:3633;43278:11875;43183:10140" data-name="container" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="content-stretch flex flex-[1_0_0] items-start min-w-px relative" data-node-id="I28603:21771;28099:16590;28272:132337;3108:8223" data-name="Cell Body Content">
                        <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[18px] min-w-px not-italic overflow-hidden relative text-[12px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/variation,#13131a)] text-ellipsis whitespace-nowrap" data-node-id="I28603:21771;28099:16590;28272:132337;3108:8223;3108:8194">
                          Cell content
                        </p>
                      </div>
                    </div>
                    <div className="bg-[var(--container/dynamic/neutral/subtle/background/default/regular,white)] border-[var(--border/static/subtle/neutral,#e1e1e8)] border-b-[length:var(--\[old\]stroke-thickness\/1,1px)] border-solid content-stretch flex gap-[var(--spacing\/50,4px)] h-[40px] items-center pl-[var(--spacing\/150,12px)] pr-[var(--spacing\/200,16px)] relative shrink-0 w-full" data-node-id="I28603:21771;28099:16590;28272:132338" data-name="Cell/Text">
                      <div className="content-stretch flex items-center overflow-clip relative shrink-0" data-node-id="I28603:21771;28099:16590;28272:132338;28484:12464" data-name="Checkbox Container">
                        <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-start p-[var(--numbers\/none,0px)] relative shrink-0" data-node-id="I28603:21771;28099:16590;28272:132338;28481:3633" data-name="Check/s">
                          <div className="content-stretch flex items-center justify-center overflow-clip p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="I28603:21771;28099:16590;28272:132338;28481:3633;43278:11875" data-name="Checkbox-Element">
                            <div className="content-stretch flex items-center overflow-clip p-[var(--spacing\/container\/s,2px)] relative shrink-0" data-node-id="I28603:21771;28099:16590;28272:132338;28481:3633;43278:11875;43183:10139" data-name="inner_container">
                              <div className="border-[1.5px] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid overflow-clip relative rounded-[var(--radius\/25,2px)] shrink-0 size-[16px]" data-node-id="I28603:21771;28099:16590;28272:132338;28481:3633;43278:11875;43183:10140" data-name="container" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="content-stretch flex flex-[1_0_0] items-start min-w-px relative" data-node-id="I28603:21771;28099:16590;28272:132338;3108:8223" data-name="Cell Body Content">
                        <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[18px] min-w-px not-italic overflow-hidden relative text-[12px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/variation,#13131a)] text-ellipsis whitespace-nowrap" data-node-id="I28603:21771;28099:16590;28272:132338;3108:8223;3108:8194">
                          Cell content
                        </p>
                      </div>
                    </div>
                    <div className="bg-[var(--container/dynamic/neutral/subtle/background/default/regular,white)] border-[var(--border/static/subtle/neutral,#e1e1e8)] border-b-[length:var(--\[old\]stroke-thickness\/1,1px)] border-solid content-stretch flex gap-[var(--spacing\/50,4px)] h-[40px] items-center pl-[var(--spacing\/150,12px)] pr-[var(--spacing\/200,16px)] relative shrink-0 w-full" data-node-id="I28603:21771;28099:16590;28272:132339" data-name="Cell/Text">
                      <div className="content-stretch flex items-center overflow-clip relative shrink-0" data-node-id="I28603:21771;28099:16590;28272:132339;28484:12464" data-name="Checkbox Container">
                        <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-start p-[var(--numbers\/none,0px)] relative shrink-0" data-node-id="I28603:21771;28099:16590;28272:132339;28481:3633" data-name="Check/s">
                          <div className="content-stretch flex items-center justify-center overflow-clip p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="I28603:21771;28099:16590;28272:132339;28481:3633;43278:11875" data-name="Checkbox-Element">
                            <div className="content-stretch flex items-center overflow-clip p-[var(--spacing\/container\/s,2px)] relative shrink-0" data-node-id="I28603:21771;28099:16590;28272:132339;28481:3633;43278:11875;43183:10139" data-name="inner_container">
                              <div className="border-[1.5px] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid overflow-clip relative rounded-[var(--radius\/25,2px)] shrink-0 size-[16px]" data-node-id="I28603:21771;28099:16590;28272:132339;28481:3633;43278:11875;43183:10140" data-name="container" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="content-stretch flex flex-[1_0_0] items-start min-w-px relative" data-node-id="I28603:21771;28099:16590;28272:132339;3108:8223" data-name="Cell Body Content">
                        <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[18px] min-w-px not-italic overflow-hidden relative text-[12px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/variation,#13131a)] text-ellipsis whitespace-nowrap" data-node-id="I28603:21771;28099:16590;28272:132339;3108:8223;3108:8194">
                          Cell content
                        </p>
                      </div>
                    </div>
                    <div className="bg-[var(--container/dynamic/neutral/subtle/background/default/regular,white)] border-[var(--border/static/subtle/neutral,#e1e1e8)] border-b-[length:var(--\[old\]stroke-thickness\/1,1px)] border-solid content-stretch flex gap-[var(--spacing\/50,4px)] h-[40px] items-center pl-[var(--spacing\/150,12px)] pr-[var(--spacing\/200,16px)] relative shrink-0 w-full" data-node-id="I28603:21771;28099:16590;28272:132340" data-name="Cell/Text">
                      <div className="content-stretch flex items-center overflow-clip relative shrink-0" data-node-id="I28603:21771;28099:16590;28272:132340;28484:12464" data-name="Checkbox Container">
                        <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-start p-[var(--numbers\/none,0px)] relative shrink-0" data-node-id="I28603:21771;28099:16590;28272:132340;28481:3633" data-name="Check/s">
                          <div className="content-stretch flex items-center justify-center overflow-clip p-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="I28603:21771;28099:16590;28272:132340;28481:3633;43278:11875" data-name="Checkbox-Element">
                            <div className="content-stretch flex items-center overflow-clip p-[var(--spacing\/container\/s,2px)] relative shrink-0" data-node-id="I28603:21771;28099:16590;28272:132340;28481:3633;43278:11875;43183:10139" data-name="inner_container">
                              <div className="border-[1.5px] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid overflow-clip relative rounded-[var(--radius\/25,2px)] shrink-0 size-[16px]" data-node-id="I28603:21771;28099:16590;28272:132340;28481:3633;43278:11875;43183:10140" data-name="container" />
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="content-stretch flex flex-[1_0_0] items-start min-w-px relative" data-node-id="I28603:21771;28099:16590;28272:132340;3108:8223" data-name="Cell Body Content">
                        <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[18px] min-w-px not-italic overflow-hidden relative text-[12px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/variation,#13131a)] text-ellipsis whitespace-nowrap" data-node-id="I28603:21771;28099:16590;28272:132340;3108:8223;3108:8194">
                          Cell content
                        </p>
                      </div>
                    </div>
                    <div className="bg-[var(--container/dynamic/neutral/subtle/background/default/regular,white)] border-[var(--border/static/subtle/neutral,#e1e1e8)] border-b-[length:var(--\[old\]stroke-thick
...[truncated; the scanned bounded output (including any structured content) is saved to /tmp/mcp_output/mcpFigma_getDesignContext_1786103783334_217dc014.txt in the repl this call ran in — read it with ReadFile from the same connection state]