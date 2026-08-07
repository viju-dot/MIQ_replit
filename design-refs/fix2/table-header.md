const imgVectorFrame = "https://www.figma.com/api/mcp/asset/023418ca-7a14-4948-958f-bcd58ec0498a.svg";
const imgVectorFrame1 = "https://www.figma.com/api/mcp/asset/9897a032-e674-4c8d-92ea-d23a1f1555c1.svg";
const imgVectorFrame2 = "https://www.figma.com/api/mcp/asset/f03456f8-a0da-4fff-8481-3a89e7ba13d6.svg";

type TableHeaderProps = {
  className?: string;
  actions?: boolean;
  custom?: boolean;
  primaryAction?: boolean;
  secondaryAction?: boolean;
};

export default function TableHeader({ className, actions = true, custom = false, primaryAction = true, secondaryAction = true }: TableHeaderProps) {
  return (
    <div className={className || "content-stretch flex items-center justify-between relative w-[1200px]"} data-node-id="28587:17190" data-name="Table header">
      <p className="[word-break:break-word] font-['DM_Sans:SemiBold'] leading-[32px] not-italic relative shrink-0 text-[24px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] tracking-[-0.36px] whitespace-nowrap" data-node-id="28587:17192">
        Overview
      </p>
      <div className="content-stretch flex gap-[24px] items-center justify-end relative shrink-0" data-node-id="28587:17193" data-name="Right">
        {custom && (
          <div className="content-stretch flex h-[24px] items-center justify-end relative shrink-0" data-node-id="28587:17194" data-name="View by">
            <div className="content-stretch flex gap-[var(--numbers\/none,0px)] items-start relative rounded-[var(--radiuses\/small,2px)] shrink-0 w-[209px]" data-node-id="28587:17195" data-name="Dropdown Closed">
              <div className="content-stretch flex flex-[1_0_0] gap-[var(--numbers\/8,8px)] items-center min-w-px relative" data-node-id="I28587:17195;3747:9707" data-name="Elements">
                <div className="content-stretch flex h-[34px] items-center relative shrink-0" data-node-id="I28587:17195;15285:8831" data-name="Title">
                  <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-start relative shrink-0" data-node-id="I28587:17195;15285:8831;15285:8847">
                    <div className="[word-break:break-word] flex flex-col font-['DM_Sans:Medium'] justify-center leading-[0] not-italic overflow-hidden relative shrink-0 text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] text-ellipsis whitespace-nowrap" data-node-id="I28587:17195;15285:8831;15285:8829">
                      <p className="leading-[20px] overflow-hidden text-ellipsis">View by:</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-[1_0_0] flex-row items-center self-stretch" data-node-id="I28587:17195;15285:6841">
                  <div className="content-stretch flex flex-[1_0_0] h-full items-center min-w-px px-[var(--numbers\/none,0px)] relative" data-name="Elements">
                    <div className="[word-break:break-word] flex flex-[1_0_0] flex-col font-['DM_Sans:Regular'] justify-center leading-[0] min-w-px not-italic overflow-hidden relative text-[14px] text-[color:var(--surface/foreground/dynamic/neutral/default/regular,#4b4b59)] text-ellipsis whitespace-nowrap" data-node-id="I28587:17195;15285:6841;15285:1947">
                      <p className="leading-[20px] overflow-hidden text-ellipsis">Index of relevancy</p>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row items-center self-stretch" data-node-id="I28587:17195;3747:9711">
                  <div className="content-stretch flex h-full items-center justify-center relative shrink-0" data-name="Icon">
                    <div className="content-stretch flex items-center justify-center relative shrink-0 size-[20px]" data-node-id="I28587:17195;3747:9712" data-name="Icon/caret">
                      <div className="relative shrink-0 size-[20px]" data-node-id="I28587:17195;3747:9712;20202:762" data-name="Vector frame">
                        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {actions && (
          <div className="content-stretch flex gap-[16px] items-center justify-end relative shrink-0" data-node-id="28587:17196" data-name="Actions">
            {secondaryAction && (
              <div className="content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-end relative shrink-0" data-node-id="28587:17197" data-name="Button">
                <div className="border-[length:var(--\[old\]stroke-thickness\/1,1px)] border-[var(--border/dynamic/neutral/bold/default,#4b4b59)] border-solid content-stretch flex gap-[var(--numbers\/4,4px)] h-[34px] items-center justify-center pl-[var(--numbers\/8,8px)] pr-[var(--numbers\/12,12px)] py-[var(--numbers\/8,8px)] relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I28587:17197;357:1967" data-name="button-medium">
                  <div className="content-stretch flex items-center justify-center relative shrink-0 size-[24px]" data-node-id="I28587:17197;357:1968" data-name="Icon/sliders-horizontal">
                    <div className="relative shrink-0 size-[24px]" data-node-id="I28587:17197;357:1968;19986:44610" data-name="Vector frame">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame1} />
                    </div>
                  </div>
                  <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] text-center whitespace-nowrap" data-node-id="I28587:17197;357:1969">
                    Geo filters
                  </p>
                </div>
              </div>
            )}
            {primaryAction && (
              <div className="content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-end relative rounded-[var(--input\[remove\]\/inputradius,2px)] shrink-0" data-node-id="28587:17198" data-name="Button Dropdown">
                <div className="bg-[var(--container/dynamic/brand/bold/background/default,#7c33b5)] content-stretch flex gap-[var(--numbers\/2,2px)] h-[34px] items-center justify-center pl-[var(--spacing\/150,12px)] pr-[var(--spacing\/50,4px)] py-[var(--odd_numbers\/7,7px)] relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I28587:17198;1354:4416" data-name="button-medium">
                  <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/brand/bold/foreground/default,white)] whitespace-nowrap" data-node-id="I28587:17198;1354:4417">
                    Export
                  </p>
                  <div className="content-stretch flex items-center justify-center relative shrink-0 size-[20px]" data-node-id="I28587:17198;1354:4418" data-name="Icon/caret">
                    <div className="relative shrink-0 size-[20px]" data-node-id="I28587:17198;1354:4418;20202:762" data-name="Vector frame">
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