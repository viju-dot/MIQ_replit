const imgVectorContainer = "https://www.figma.com/api/mcp/asset/b80fae7c-1a2a-4951-a32b-549dcca732d2.svg";
const imgVectorFrame = "https://www.figma.com/api/mcp/asset/55fc0832-9712-4149-84dd-6eb159b974d6.svg";
const imgVector = "https://www.figma.com/api/mcp/asset/6f814833-c8e5-44da-ae2a-9a876542791d.svg";
const imgVector1 = "https://www.figma.com/api/mcp/asset/c0b87f0c-73bf-442d-92d2-27cf577c7e37.svg";
const imgVector2 = "https://www.figma.com/api/mcp/asset/816c79d6-27b9-4ceb-9ce4-4517804dfb00.svg";
const imgVector3 = "https://www.figma.com/api/mcp/asset/2684d824-7f1a-42d3-90ff-23130255655f.svg";
const imgVector4 = "https://www.figma.com/api/mcp/asset/29216aef-84f5-41e0-be21-5e448d409b05.svg";
const imgVector5 = "https://www.figma.com/api/mcp/asset/52f673e5-d914-4bde-9d9f-7fcdefbf5d7e.svg";
const imgVector6 = "https://www.figma.com/api/mcp/asset/720ba65b-03a1-4aee-adf5-11589fdf4a4d.svg";
const imgVector7 = "https://www.figma.com/api/mcp/asset/02cf092a-f5b0-4c9e-b15c-e5d8318f9158.svg";
const imgVector8 = "https://www.figma.com/api/mcp/asset/529f7905-9472-4d66-bcfc-91a0678657ee.svg";
const imgVectorFrame1 = "https://www.figma.com/api/mcp/asset/0a5ed408-7fa4-46bd-adc0-8152ddf85157.svg";
const imgEllipse1 = "https://www.figma.com/api/mcp/asset/dabeb6f4-4b54-480d-8861-ffde76c2ba68.svg";

type SingleDiamondProps = {
  className?: string;
  size?: "24";
};

function SingleDiamond({ className, size = "24" }: SingleDiamondProps) {
  return (
    <div className={className || "relative size-[24px]"} data-node-id="37032:3035">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[20px] top-1/2" data-node-id="37032:3036" data-name="Vector Container">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorContainer} />
      </div>
    </div>
  );
}

type NavigationProps = {
  className?: string;
  hasSecondaryNav?: boolean;
};

export default function Navigation({ className, hasSecondaryNav = true }: NavigationProps) {
  return (
    <div className={className || "content-stretch flex flex-col items-start relative w-[1440px]"} data-node-id="49552:24821" data-name="Navigation">
      <div className="bg-[var(--surface/background/miq,#2b0030)] content-stretch flex h-[64px] items-center justify-between p-[24px] relative shrink-0 w-full" data-node-id="49504:10370" data-name="Primary Navigation">
        <div className="content-stretch flex gap-[var(--spacing\/0,0px)] items-center relative shrink-0" data-node-id="I49504:10370;51138:8850" data-name="Menu item">
          <div className="content-stretch flex gap-[32px] h-[64px] items-center justify-center relative shrink-0" data-node-id="I49504:10370;51138:8851" data-name="Menu">
            <div className="h-full relative shrink-0 w-[100px]" data-node-id="I49504:10370;51138:8852" data-name="Intelligence">
              <p className="[word-break:break-word] absolute font-['DM_Sans:Medium'] leading-[24px] left-[calc(50%-43.23px)] not-italic text-[16px] text-[color:var(--surface/foreground/dynamic/neutral/inversed/selected,white)] top-[calc(50%-10px)] whitespace-nowrap" data-node-id="I49504:10370;51138:8853">
                Intelligence
              </p>
              <div className="-translate-x-1/2 absolute bg-gradient-to-r bottom-0 from-[#d71982] from-[25.521%] h-[4px] left-[calc(50%-1px)] rounded-tl-[2px] rounded-tr-[2px] to-[#dad310] via-[#ff540c] via-[59.375%] w-[100px]" data-node-id="I49504:10370;51138:8854" data-name="On" />
            </div>
          </div>
          <div className="flex flex-row items-center self-stretch" data-node-id="I49504:10370;51138:8867">
            <div className="content-stretch flex h-full items-center justify-center pb-[var(--spacing\/25,2px)] pt-[var(--spacing\/75,6px)] px-[var(--spacing\/50,4px)] relative shrink-0 w-[24px]" data-name="Icon/caret">
              <div className="relative shrink-0 size-[24px]" data-node-id="I49504:10370;51138:8867;19961:35761" data-name="Vector frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame} />
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[var(--spacing\/200,16px)] items-center relative shrink-0" data-node-id="I49504:10370;45372:564342" data-name="Logo and tags">
          <div className="overflow-clip relative shrink-0 size-[24px]" data-node-id="I49504:10370;45372:564343" data-name="Sigma Logo">
            <div className="-translate-x-1/2 absolute aspect-[249/300] bottom-[7.5%] left-1/2 top-[7.5%]" data-node-id="I49504:10370;45372:564343;39375:762" data-name="Logo">
              <div className="absolute contents inset-[0_0.26%_0_0.05%]" data-node-id="I49504:10370;45372:564343;39375:763" data-name="SHADOWS">
                <div className="absolute contents inset-[0_0.26%_0_0.05%]" data-node-id="I49504:10370;45372:564343;39375:764" data-name="Clip path group">
                  <div className="absolute contents inset-[-151.64%_-112.65%_-135.3%_-149.22%]" data-node-id="I49504:10370;45372:564343;39375:767" data-name="Group">
                    <div className="absolute inset-[0_0_0_0.05%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[0px_-0.002px] mask-size-[281.134px_340px]" data-node-id="I49504:10370;45372:564343;39375:768" style={{ maskImage: `url("${imgVector}")` }} data-name="Vector">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector1} />
                    </div>
                    <div className="absolute flex inset-[-151.64%_-112.65%_-0.66%_-89.46%] items-center justify-center" data-node-id="I49504:10370;45372:564343;39375:769" style={{ containerType: "size" }}>
                      <div className="-rotate-90 flex-none h-[100cqw] w-[100cqh]">
                        <div className="mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[252.416px_515.579px] mask-size-[281.134px_340px] relative size-full" style={{ maskImage: `url("${imgVector}")` }} data-name="Vector">
                          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector2} />
                        </div>
                      </div>
                    </div>
                    <div className="absolute inset-[45.14%_236.65%_49.83%_-149.22%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[420.924px_-153.482px] mask-size-[281.134px_340px]" data-node-id="I49504:10370;45372:564343;39375:770" style={{ maskImage: `url("${imgVector}")` }} data-name="Vector">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector3} />
                    </div>
                    <div className="absolute contents inset-[202.06%_77.9%_-135.3%_-46.04%] mix-blend-multiply" data-node-id="I49504:10370;45372:564343;39375:771" data-name="Group">
                      <div className="absolute inset-[202.06%_77.9%_-135.3%_-46.04%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[129.968px_-687px] mask-size-[281.134px_340px] mix-blend-multiply opacity-60" data-node-id="I49504:10370;45372:564343;39375:772" style={{ maskImage: `url("${imgVector}")` }} data-name="Vector">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector4} />
                      </div>
                    </div>
                    <div className="absolute contents inset-[168.82%_77.9%_-102.06%_-46.04%] mix-blend-multiply" data-node-id="I49504:10370;45372:564343;39375:773" data-name="Group">
                      <div className="absolute inset-[168.82%_77.9%_-102.06%_-46.04%] mask-alpha mask-intersect mask-no-clip mask-no-repeat mask-position-[129.968px_-573.984px] mask-size-[281.134px_340px] mix-blend-multiply opacity-60" data-node-id="I49504:10370;45372:564343;39375:774" style={{ maskImage: `url("${imgVector}")` }} data-name="Vector">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector5} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-[16.76%] contents left-[0.05%] mix-blend-multiply right-[31.81%] top-1/2" data-node-id="I49504:10370;45372:564343;39375:781" data-name="Group">
                  <div className="absolute bottom-[16.76%] left-[0.05%] mix-blend-multiply opacity-60 right-[31.81%] top-1/2" data-node-id="I49504:10370;45372:564343;39375:782" data-name="Vector">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector6} />
                  </div>
                </div>
                <div className="absolute bottom-1/2 contents left-[0.05%] mix-blend-multiply right-[31.81%] top-[16.75%]" data-node-id="I49504:10370;45372:564343;39375:783" data-name="Group">
                  <div className="absolute bottom-1/2 left-[0.05%] mix-blend-multiply opacity-60 right-[31.81%] top-[16.75%]" data-node-id="I49504:10370;45372:564343;39375:784" data-name="Vector">
                    <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector7} />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[20px] items-center justify-end relative shrink-0" data-node-id="I49504:10370;20931:12218" data-name="right">
          <div className="bg-[rgba(255,255,255,0.2)] content-stretch flex gap-[8px] h-[34px] items-center justify-center px-[12px] py-[4px] relative rounded-[2px] shrink-0" data-node-id="I49504:10370;45492:26296" data-name="language">
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0" data-node-id="I49504:10370;45492:26297">
              <div className="content-stretch flex items-center justify-center overflow-clip p-[2px] relative shrink-0 size-[20px]" data-node-id="I49504:10370;45696:9151" data-name="Icon/translate">
                <div className="h-[15.625px] relative shrink-0 w-[17.5px]" data-node-id="I49504:10370;45696:9151;45696:684" data-name="Vector">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVector8} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--surface/foreground/dynamic/neutral/inversed/selected,white)] whitespace-nowrap" data-node-id="I49504:10370;45492:26301">
                English
              </p>
            </div>
            <div className="content-stretch flex items-center justify-center relative shrink-0 size-[20px]" data-node-id="I49504:10370;45492:26302" data-name="Icon/caret">
              <div className="relative shrink-0 size-[20px]" data-node-id="I49504:10370;45492:26302;20202:762" data-name="Vector frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame1} />
              </div>
            </div>
          </div>
          <SingleDiamond className="relative shrink-0 size-[24px]" />
          <div className="content-stretch flex items-center overflow-clip px-[3px] relative shrink-0" data-node-id="I49504:10370;38008:778" data-name="Avatar">
            <div className="h-[40px] relative shrink-0 w-[36px]" data-node-id="I49504:10370;38008:778;37996:34741" data-name="Avatar">
              <div className="-translate-x-1/2 absolute left-1/2 size-[32px] top-0" data-node-id="I49504:10370;38008:778;37996:34742" data-name="Initials">
                <div className="absolute left-0 size-[32px] top-0" data-node-id="I49504:10370;38008:778;37996:34743">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipse1} />
                </div>
                <p className="-translate-x-full [word-break:break-word] absolute font-['DM_Sans:Medium'] leading-[normal] left-[calc(50%+8px)] not-italic text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] text-right top-[7px] whitespace-nowrap" data-node-id="I49504:10370;38008:778;37996:34744">
                  JS
                </p>
              </div>
              <div className="-translate-x-1/2 absolute bottom-0 content-stretch flex items-start left-1/2" data-node-id="I49504:10370;38008:778;41496:1426" data-name="Badge/rounded">
                <div className="content-stretch flex gap-[var(--odd_numbers\/10,10px)] h-[18px] items-start relative shrink-0" data-node-id="I49504:10370;38008:778;41496:1426;41496:1380" data-name="Badge/rounded">
                  <div className="bg-gradient-to-r content-stretch flex from-[25.521%] from-[var(--gradients\/sigma\/1,#d71982)] gap-[var(--numbers\/4,4px)] h-[18px] items-center justify-center px-[var(--numbers\/8,8px)] py-[var(--numbers\/2,2px)] relative rounded-[var(--\[old\]radiuses\/round,100px)] shrink-0 to-[var(--gradients\/sigma\/3,#f0e812)] via-[59.375%] via-[var(--gradients\/sigma\/2,#ff540c)]" data-node-id="I49504:10370;38008:778;41496:1426;41496:1380;34051:126">
                    <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--container/static/brand/bold/foreground,white)] text-center whitespace-nowrap" data-node-id="I49504:10370;38008:778;41496:1426;41496:1380;34051:127">
                      Pro+
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {hasSecondaryNav && (
        <div className="bg-[var(--surface/background/lvl1,white)] drop-shadow-[0px_1px_2px_var(--shadow/lvl8,rgba(113,113,128,0.08)),0px_8px_8px_var(--shadow/lvl4,rgba(113,113,128,0.04))] h-[56px] relative shrink-0 w-full" data-node-id="49552:24815" data-name="Secondary Navigation">
          <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute content-stretch flex gap-[24px] items-start leading-[20px] left-1/2 not-italic text-[14px] top-[calc(50%+0.5px)] whitespace-nowrap" data-node-id="I49552:24815;20931:12236" data-name="Menu Items">
            <p className="font-['DM_Sans:SemiBold'] relative shrink-0 text-[color:var(--surface/foreground/dynamic/neutral/default/variation,#13131a)]" data-node-id="I49552:24815;20931:12244">
              My audience
            </p>
            <p className="font-['DM_Sans:Regular'] relative shrink-0 text-[color:var(--surface/foreground/dynamic/neutral/default/regular,#4b4b59)]" data-node-id="I49552:24815;20931:12243">
              Saved audiences
            </p>
            <p className="font-['DM_Sans:Regular'] relative shrink-0 text-[color:var(--surface/foreground/dynamic/neutral/default/regular,#4b4b59)]" data-node-id="I49552:24815;28206:6234">
              Monitor
            </p>
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
These styles are contained in the design: Body Lg/Medium: Font(family: "DM Sans", style: Medium, size: 16, weight: 500, lineHeight: 24, letterSpacing: 0), Gradient: , Body Md/Regular: Font(family: "DM Sans", style: Regular, size: 14, weight: 400, lineHeight: 20, letterSpacing: 0), Brand Gradient: , sigma_gradient: , Body Md/Semibold: Font(family: "DM Sans", style: SemiBold, size: 14, weight: 600, lineHeight: 20, letterSpacing: 0), Elevation Regular: Effect(type: DROP_SHADOW, color: shadow/lvl4, offset: (0, 8), radius: 16, spread: 0); Effect(type: DROP_SHADOW, color: shadow/lvl8, offset: (0, 1), radius: 4, spread: 0).
Component descriptions: The following components have usage descriptions or documentation links defined in Figma. These descriptions provide important context about the intended usage, best practices, and any constraints for each component. Follow these guidelines when implementing or using these components.

## Icon/caret
**Node ID:** 20195:11607

To find those carets, simply add the direction they are pointing to.

  

  

  

caret-right, caret-left (for regular)

  

caret-fill-right (for fill) and so on
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.