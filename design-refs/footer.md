# Footer (page node 53009:3648)

## Page structure (XML metadata)

<canvas id="53009:3648" name="Footer" x="0" y="0" width="0" height="0">
  <frame id="53009:3918" name="Footer - Page" x="-20" y="-20" width="1115" height="106">
    <symbol id="53009:3917" name="Type=Default" x="20" y="20" width="1075" height="66" />
  </frame>
  <frame id="53026:4136" name="Footer - Modal" x="1248" y="-20" width="1115" height="182">
    <symbol id="53023:313" name="IsCompact=No" x="20" y="20" width="1075" height="66" />
    <symbol id="53023:304" name="IsCompact=Yes" x="20" y="106" width="1075" height="56" />
  </frame>
</canvas>
IMPORTANT: After you call this tool, you MUST call get_design_context if trying to implement the design, since this tool only returns metadata. If you do not call get_design_context, the agent will not be able to implement the design.


## frame "Footer - Page" (53009:3918, 1115x106)

type FooterPageProps = {
  className?: string;
  actionsLeft?: boolean;
  actionsRight?: boolean;
  type?: "Default";
};

export default function FooterPage({ className, actionsLeft = false, actionsRight = true, type = "Default" }: FooterPageProps) {
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
SUPER CRITICAL: The generated React+Tailwind code MUST be converted to match the target project's technology stack and styling system.
1. Analyze the target codebase to identify: technology stack, styling approach, component patterns, and design tokens
2. Convert React syntax to the target framework/library
3. Transform all Tailwind classes to the target styling system while preserving exact visual design
4. Follow the project's existing patterns and conventions
DO NOT install any Tailwind as a dependency unless the user instructs you to do so.

Node ids have been added to the code as data attributes, e.g. `data-node-id="1:2"`.
These styles are contained in the design: Body Md/Medium: Font(family: "DM Sans", style: Medium, size: 14, weight: 500, lineHeight: 20, letterSpacing: 0), Elevation Bottom Bar: Effect(type: DROP_SHADOW, color: shadow/lvl8, offset: (0, -8), radius: 16, spread: 0); Effect(type: DROP_SHADOW, color: shadow/lvl12, offset: (0, -1), radius: 4, spread: 0).
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.

## frame "Footer - Modal" (53026:4136, 1115x182)

type FooterModalProps = {
  className?: string;
  actionsLeft?: boolean;
  actionsRight?: boolean;
  isCompact?: boolean;
};

export default function FooterModal({ className, actionsLeft = false, actionsRight = true, isCompact = false }: FooterModalProps) {
  const isIsCompact = isCompact;
  const isNotIsCompact = !isCompact;
  return (
    <div className={className || `${String.raw`bg-[var(--surface/background/lvl2,#f7f7fa)] content-between flex flex-wrap items-center justify-between p-[var(--numbers\/16,16px)] relative w-[1075px] `}${isIsCompact ? "h-[56px]" : "h-[66px]"}`} id={isIsCompact ? "node-53023_304" : "node-53023_313"}>
      {isNotIsCompact && actionsLeft && (
        <div className="content-stretch flex flex-[1_0_0] gap-[var(--spacing\/200,16px)] items-center min-w-px relative" data-node-id="53023:314" data-name="ActionsLeft">
          <div className="content-stretch flex gap-[var(--numbers\/4,4px)] items-center relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="53023:315" data-name="Button">
            <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--surface/foreground/dynamic/brand/default,#7c33b5)] text-center whitespace-nowrap" data-node-id="I53023:315;45750:1692">
              Link
            </p>
          </div>
          <div className="border-[length:var(--stroke_weight\/15,1px)] border-[var(--border/dynamic/neutral/bold/default,#4b4b59)] border-solid content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-end px-[var(--spacing\/150,12px)] py-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="53023:316" data-name="Button">
            <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-center justify-center relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I53023:316;45750:1617" data-name="button-medium">
              <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] text-center whitespace-nowrap" data-node-id="I53023:316;45750:1619">
                Default
              </p>
            </div>
          </div>
          <div className="bg-[var(--container/dynamic/brand/bold/background/default,#7c33b5)] content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-end px-[var(--spacing\/150,12px)] py-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="53023:317" data-name="Button">
            <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-center justify-center relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I53023:317;45750:1539" data-name="button-medium">
              <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/brand/bold/foreground/default,white)] text-center whitespace-nowrap" data-node-id="I53023:317;45750:1541">
                Default
              </p>
            </div>
          </div>
        </div>
      )}
      {isNotIsCompact && actionsRight && (
        <div className="content-stretch flex flex-[1_0_0] gap-[var(--spacing\/200,16px)] items-center justify-end min-w-px relative" data-node-id="53023:318" data-name="ActionsRight">
          <div className="content-stretch flex gap-[var(--numbers\/4,4px)] items-center relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="53023:319" data-name="Button">
            <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--surface/foreground/dynamic/brand/default,#7c33b5)] text-center whitespace-nowrap" data-node-id="I53023:319;45750:1692">
              Link
            </p>
          </div>
          <div className="bg-[var(--container/dynamic/brand/bold/background/default,#7c33b5)] content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-end px-[var(--spacing\/150,12px)] py-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="53023:321" data-name="Button">
            <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-center justify-center relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I53023:321;45750:1539" data-name="button-medium">
              <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/brand/bold/foreground/default,white)] text-center whitespace-nowrap" data-node-id="I53023:321;45750:1541">
                Default
              </p>
            </div>
          </div>
        </div>
      )}
      {isIsCompact && actionsLeft && (
        <div className="content-stretch flex flex-[1_0_0] gap-[var(--spacing\/200,16px)] items-center min-w-px relative" data-node-id="53023:305" data-name="ActionsLeft">
          <div className="content-stretch flex gap-[var(--numbers\/4,4px)] items-center relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="53023:306" data-name="Button">
            <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--surface/foreground/dynamic/brand/default,#7c33b5)] text-center whitespace-nowrap" data-node-id="I53023:306;45750:1692">
              Link
            </p>
          </div>
          <div className="border-[length:var(--stroke_weight\/15,1px)] border-[var(--border/dynamic/neutral/bold/default,#4b4b59)] border-solid content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-end px-[var(--spacing\/75,6px)] py-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="53023:307" data-name="Button">
            <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-center justify-center relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I53023:307;46186:2699" data-name="button-medium">
              <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/subtle/foreground/default/regular,#4b4b59)] text-center whitespace-nowrap" data-node-id="I53023:307;46186:2701">
                Default
              </p>
            </div>
          </div>
          <div className="bg-[var(--container/dynamic/brand/bold/background/default,#7c33b5)] content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-end px-[var(--spacing\/75,6px)] py-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="53023:308" data-name="Button">
            <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-center justify-center relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I53023:308;46186:2647" data-name="button-medium">
              <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/brand/bold/foreground/default,white)] text-center whitespace-nowrap" data-node-id="I53023:308;46186:2649">
                Default
              </p>
            </div>
          </div>
        </div>
      )}
      {isIsCompact && actionsRight && (
        <div className="content-stretch flex flex-[1_0_0] gap-[var(--spacing\/200,16px)] items-center justify-end min-w-px relative" data-node-id="53023:309" data-name="ActionsRight">
          <div className="content-stretch flex gap-[var(--numbers\/4,4px)] items-center relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="53023:310" data-name="Button">
            <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--surface/foreground/dynamic/brand/default,#7c33b5)] text-center whitespace-nowrap" data-node-id="I53023:310;45750:1692">
              Link
            </p>
          </div>
          <div className="bg-[var(--container/dynamic/brand/bold/background/default,#7c33b5)] content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-end px-[var(--spacing\/75,6px)] py-[var(--spacing\/container\/s,2px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="53023:312" data-name="Button">
            <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-center justify-center relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I53023:312;46186:2647" data-name="button-medium">
              <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/brand/bold/foreground/default,white)] text-center whitespace-nowrap" data-node-id="I53023:312;46186:2649">
                Default
              </p>
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
These styles are contained in the design: Body Md/Medium: Font(family: "DM Sans", style: Medium, size: 14, weight: 500, lineHeight: 20, letterSpacing: 0).
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
