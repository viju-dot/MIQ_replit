const imgAvatarImage = "https://www.figma.com/api/mcp/asset/a7de6b6a-b3f5-4e85-bc68-ceb0cc55e8c0.png";
const imgVectorFrame = "https://www.figma.com/api/mcp/asset/055f1a19-65ff-4a19-bbbe-9c65a7f168d4.svg";
const imgOn = "https://www.figma.com/api/mcp/asset/fe030ae7-4705-4f4a-8007-ba63b1ec113f.svg";
const imgVectorFrame1 = "https://www.figma.com/api/mcp/asset/eab64935-0261-47e0-add1-5ab550f2eb13.svg";
const imgSeparator1 = "https://www.figma.com/api/mcp/asset/7df3c65e-15ea-4520-84b3-b08fc7d922ae.svg";
const imgVectorFrame2 = "https://www.figma.com/api/mcp/asset/f4a0d8f5-5c7a-48fe-95cf-7b111267fd9d.svg";
const imgVectorFrame3 = "https://www.figma.com/api/mcp/asset/6056c7e0-267b-46fe-98dd-ee6300fd32a5.svg";
const imgVectorFrame4 = "https://www.figma.com/api/mcp/asset/4b034ce8-8f31-46e6-878d-a5b05247040d.svg";
const imgVectorFrame5 = "https://www.figma.com/api/mcp/asset/97adc385-d1f1-4b96-89cf-7d971b95b095.svg";

type UserMenuProps = {
  className?: string;
  platform?: "UFP";
  type?: "MiQer";
  version?: "2";
};

function UserMenu({ className, platform = "UFP", type = "MiQer", version = "2" }: UserMenuProps) {
  return (
    <div className={className || "bg-[var(--surface/background/lvl1,white)] content-stretch drop-shadow-[0px_1px_2px_var(--shadow/lvl8,rgba(113,113,128,0.08)),0px_12px_10px_var(--shadow/lvl10,rgba(113,113,128,0.1))] flex flex-col items-start py-[16px] relative rounded-[var(--\\[old\\]radiuses\\/2,2px)] w-[274px]"} data-node-id="20930:675">
      <div className="content-stretch flex flex-col gap-[16px] items-start px-[16px] relative shrink-0 w-full" data-node-id="20930:676" data-name="Menu">
        <div className="content-stretch flex gap-[16px] h-[44px] items-center relative shrink-0" data-node-id="20930:677" data-name="Profile">
          <div className="content-stretch flex items-center overflow-clip relative shrink-0" data-node-id="37996:35353" data-name="Avatar">
            <div className="relative rounded-[33px] shrink-0 size-[44px]" data-node-id="I37996:35353;37996:35331" data-name="Avatar Image">
              <img alt="" className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[33px] size-full" src={imgAvatarImage} />
            </div>
          </div>
          <div className="[word-break:break-word] content-stretch flex flex-col items-start justify-center not-italic relative shrink-0 text-center whitespace-nowrap" data-node-id="20930:679" data-name="Name and title">
            <p className="font-['DM_Sans:Medium'] leading-[24px] relative shrink-0 text-[16px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)]" data-node-id="20930:680">
              Sammy Tailor
            </p>
            <p className="font-['DM_Sans:Regular'] leading-[18px] relative shrink-0 text-[12px] text-[color:var(--surface/foreground/static/neutral/lvl3,#717180)]" data-node-id="20930:681">
              Agency Director
            </p>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="20930:1148" data-name="Toggles">
          <div className="bg-[var(--surface/background/lvl1,white)] content-stretch flex gap-[24px] h-[32px] items-center p-[4px] relative rounded-[var(--\[old\]radiuses\/2,2px)] shrink-0 w-[242px]" data-node-id="20930:1149" data-name="User Menu Row">
            <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px relative" data-node-id="I20930:1149;20930:902" data-name="Row">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip px-[2px] py-[4px] relative shrink-0 size-[24px]" data-node-id="I20930:1149;20930:1465" data-name="Icon/laptop">
                <div className="h-[15.75px] relative shrink-0 w-[21px]" data-node-id="I20930:1149;20930:1465;28935:300" data-name="Vector frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame} />
                </div>
              </div>
              <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[20px] min-w-px not-italic relative text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/variation,#13131a)]" data-node-id="I20930:1149;20930:905">
                Pixels and searches
              </p>
            </div>
            <div className="bg-[var(--controls/background/inactive,#ebebf0)] content-stretch flex h-[24px] items-center max-h-[24px] max-w-[46px] min-w-[46px] p-[2px] relative rounded-[20px] shrink-0 w-[46px]" data-node-id="I20930:1149;20930:918" data-name="Toggle">
              <div className="relative shrink-0 size-[20px]" data-node-id="I20930:1149;20930:918;185:671" data-name="On">
                <div className="absolute inset-[-20%_-30%_-20%_-10%]">
                  <img alt="" className="block max-w-none size-full" src={imgOn} />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-[var(--surface/background/lvl1,white)] content-stretch flex gap-[24px] h-[32px] items-center p-[4px] relative rounded-[var(--\[old\]radiuses\/2,2px)] shrink-0 w-[242px]" data-node-id="20930:1150" data-name="User Menu Row">
            <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px relative" data-node-id="I20930:1150;20930:902" data-name="Row">
              <div className="content-stretch flex flex-col items-center justify-center overflow-clip px-px py-[2px] relative shrink-0 size-[24px]" data-node-id="I20930:1150;20930:1465" data-name="Icon/moon-stars">
                <div className="h-[18.745px] relative shrink-0 w-[19.494px]" data-node-id="I20930:1150;20930:1465;28935:1408" data-name="Vector frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame1} />
                </div>
              </div>
              <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[20px] min-w-px not-italic relative text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/variation,#13131a)]" data-node-id="I20930:1150;20930:905">
                Dark mode
              </p>
            </div>
            <div className="bg-[var(--controls/background/inactive,#ebebf0)] content-stretch flex h-[24px] items-center max-h-[24px] max-w-[46px] min-w-[46px] p-[2px] relative rounded-[20px] shrink-0 w-[46px]" data-node-id="I20930:1150;20930:918" data-name="Toggle">
              <div className="relative shrink-0 size-[20px]" data-node-id="I20930:1150;20930:918;185:671" data-name="On">
                <div className="absolute inset-[-20%_-30%_-20%_-10%]">
                  <img alt="" className="block max-w-none size-full" src={imgOn} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="h-0 relative shrink-0 w-full" data-node-id="20930:695" data-name="Separator 1">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgSeparator1} />
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="20930:1167" data-name="Section 2">
          <div className="bg-[var(--surface/background/lvl1,white)] content-stretch flex gap-[24px] h-[32px] items-center p-[4px] relative rounded-[var(--\[old\]radiuses\/2,2px)] shrink-0 w-[242px]" data-node-id="20930:1168" data-name="User Menu Row">
            <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px relative" data-node-id="I20930:1168;20930:902" data-name="Row">
              <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[24px]" data-node-id="I20930:1168;20930:1465" data-name="Icon/gear">
                <div className="h-[19.63px] relative shrink-0 w-[19.628px]" data-node-id="I20930:1168;20930:1465;28566:13551" data-name="Vector frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame2} />
                </div>
              </div>
              <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[20px] min-w-px not-italic relative text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/variation,#13131a)]" data-node-id="I20930:1168;20930:905">
                Settings
              </p>
            </div>
          </div>
          <div className="bg-[var(--surface/background/lvl1,white)] content-stretch flex gap-[24px] h-[32px] items-center p-[4px] relative rounded-[var(--\[old\]radiuses\/2,2px)] shrink-0 w-[242px]" data-node-id="20930:1169" data-name="User Menu Row">
            <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px relative" data-node-id="I20930:1169;20930:902" data-name="Row">
              <div className="content-stretch flex flex-col items-center justify-center px-[2px] py-[3px] relative shrink-0 size-[24px]" data-node-id="I20930:1169;20930:1465" data-name="Icon/heart">
                <div className="h-[18px] relative shrink-0 w-[21px]" data-node-id="I20930:1169;20930:1465;28637:10552" data-name="Vector frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame3} />
                </div>
              </div>
              <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[20px] min-w-px not-italic relative text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/variation,#13131a)]" data-node-id="I20930:1169;20930:905">
                Pixels and searches
              </p>
            </div>
          </div>
          <div className="bg-[var(--surface/background/lvl1,white)] content-stretch flex gap-[24px] h-[32px] items-center p-[4px] relative rounded-[var(--\[old\]radiuses\/2,2px)] shrink-0 w-[242px]" data-node-id="20930:1170" data-name="User Menu Row">
            <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px relative" data-node-id="I20930:1170;20930:902" data-name="Row">
              <div className="content-stretch flex items-center justify-center overflow-clip px-[2px] py-[3px] relative shrink-0 size-[24px]" data-node-id="I20930:1170;20930:1465" data-name="Icon/flask">
                <div className="h-[18.75px] relative shrink-0 w-[17.997px]" data-node-id="I20930:1170;20930:1465;28935:1489" data-name="Vector frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame4} />
                </div>
              </div>
              <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[20px] min-w-px not-italic relative text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/variation,#13131a)]" data-node-id="I20930:1170;20930:905">
                Innovation labs
              </p>
            </div>
          </div>
        </div>
        <div className="h-0 relative shrink-0 w-full" data-node-id="20930:712" data-name="Separator 2">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgSeparator1} />
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="45492:41772" data-name="Section 4">
          <div className="bg-[var(--surface/background/lvl1,white)] content-stretch flex gap-[24px] h-[32px] items-center p-[4px] relative rounded-[var(--\[old\]radiuses\/2,2px)] shrink-0 w-[242px]" data-node-id="45492:41774" data-name="User Menu Row">
            <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px relative" data-node-id="I45492:41774;20930:902" data-name="Row">
              <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[20px] min-w-px not-italic relative text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/variation,#13131a)]" data-node-id="I45492:41774;20930:905">
                Partnerships
              </p>
            </div>
          </div>
        </div>
        <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full" data-node-id="20930:1195" data-name="Section 3">
          <div className="bg-[var(--surface/background/lvl1,white)] content-stretch flex gap-[24px] h-[32px] items-center p-[4px] relative rounded-[var(--\[old\]radiuses\/2,2px)] shrink-0 w-[242px]" data-node-id="20930:1197" data-name="User Menu Row">
            <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px relative" data-node-id="I20930:1197;20930:902" data-name="Row">
              <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[20px] min-w-px not-italic relative text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/variation,#13131a)]" data-node-id="I20930:1197;20930:905">{`Terms & policies`}</p>
            </div>
          </div>
        </div>
        <div className="h-0 relative shrink-0 w-full" data-node-id="20930:720" data-name="Separator 3">
          <div className="absolute inset-[-1px_0_0_0]">
            <img alt="" className="block max-w-none size-full" src={imgSeparator1} />
          </div>
        </div>
        <div className="content-stretch flex items-center p-[4px] relative shrink-0 w-full" data-node-id="20930:721" data-name="Sign out">
          <div className="bg-[var(--surface/background/lvl1,white)] content-stretch flex gap-[24px] h-[32px] items-center p-[4px] relative rounded-[var(--\[old\]radiuses\/2,2px)] shrink-0 w-[242px]" data-node-id="20930:1214" data-name="User Menu Row">
            <div className="content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px relative" data-node-id="I20930:1214;20930:902" data-name="Row">
              <div className="content-stretch flex items-center justify-center relative shrink-0 size-[24px]" data-node-id="I20930:1214;20930:1465" data-name="Icon/sign-out">
                <div className="relative shrink-0 size-[24px]" data-node-id="I20930:1214;20930:1465;20021:32635" data-name="Vector frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame5} />
                </div>
              </div>
              <p className="[word-break:break-word] flex-[1_0_0] font-['DM_Sans:Regular'] leading-[20px] min-w-px not-italic relative text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/variation,#13131a)]" data-node-id="I20930:1214;20930:905">
                Sign out
              </p>
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
These styles are contained in the design: Avatar/Female/Rhea Hull: , Body Lg/Medium: Font(family: "DM Sans", style: Medium, size: 16, weight: 500, lineHeight: 24, letterSpacing: 0), Body Sm/Regular: Font(family: "DM Sans", style: Regular, size: 12, weight: 400, lineHeight: 18, letterSpacing: 0), Body Md/Regular: Font(family: "DM Sans", style: Regular, size: 14, weight: 400, lineHeight: 20, letterSpacing: 0), Elevation Hover: Effect(type: DROP_SHADOW, color: shadow/lvl10, offset: (0, 12), radius: 20, spread: 0); Effect(type: DROP_SHADOW, color: shadow/lvl8, offset: (0, 1), radius: 4, spread: 0).
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.