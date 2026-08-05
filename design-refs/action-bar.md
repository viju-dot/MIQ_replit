# Action Bar (page node 8186:13489)

## Page structure (XML metadata)

<canvas id="8186:13489" name="Action Bar" x="0" y="0" width="0" height="0">
  <frame id="8323:16189" name="Action Bar" x="-252" y="-808" width="1232" height="244">
    <symbol id="8323:16059" name="Type=Brand" x="32" y="28" width="1168" height="40" />
    <symbol id="8236:14486" name="Type=White" x="32" y="176" width="1168" height="40" />
  </frame>
</canvas>
IMPORTANT: After you call this tool, you MUST call get_design_context if trying to implement the design, since this tool only returns metadata. If you do not call get_design_context, the agent will not be able to implement the design.


## frame "Action Bar" (8323:16189, 1232x244)

const imgTypeBrand = "https://www.figma.com/api/mcp/asset/66db4923-ff9f-47ca-a9ac-4c49fc69eee9.svg";
const imgVectorFrame = "https://www.figma.com/api/mcp/asset/e948ac48-13b6-4bc5-b74d-c3db40c3d097.svg";
const imgVectorFrame1 = "https://www.figma.com/api/mcp/asset/d5e2f263-89b6-4d92-be1e-f21f2291fbf7.svg";
const imgVectorFrame2 = "https://www.figma.com/api/mcp/asset/54f09033-a926-4856-91a8-dab4582c5ea2.svg";
const imgVectorFrame3 = "https://www.figma.com/api/mcp/asset/97c481a2-17b6-4c74-acef-51dc3319601a.svg";
const imgVectorFrame4 = "https://www.figma.com/api/mcp/asset/01ae05c1-f5a0-4f37-be7e-d2c9e57b16d8.svg";
const imgVectorFrame5 = "https://www.figma.com/api/mcp/asset/4ccf6ced-28af-49aa-bb8a-7304a57629e5.svg";
const imgVectorFrame6 = "https://www.figma.com/api/mcp/asset/acf68a0c-e015-4497-a3fb-e97f158ae1eb.svg";
const imgVectorFrame7 = "https://www.figma.com/api/mcp/asset/5430cd27-5838-4209-99dc-7aa97eeb9875.svg";

type ActionBarProps = {
  className?: string;
  action1?: boolean;
  action2?: boolean;
  action3?: boolean;
  type?: "White" | "Brand";
};

export default function ActionBar({ className, action1 = true, action2 = true, action3 = true, type = "Brand" }: ActionBarProps) {
  const isBrand = type === "Brand";
  const isWhite = type === "White";
  return (
    <div className={className || `${String.raw`content-stretch flex items-center justify-between px-[var(--spacing\/200,16px)] py-[var(--spacing\/container\/l,3px)] relative w-[1168px] `}${isWhite ? "bg-[var(--surface/background/lvl1,white)]" : "bg-[var(--surface/background/brand,#7c33b5)]"}`} id={isWhite ? "node-8236_14486" : "node-8323_16059"}>
      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgTypeBrand} />
      <div className="content-stretch flex gap-[var(--odd_numbers\/11,11px)] items-center relative shrink-0" id={isWhite ? "node-8372_20549" : "node-8372_20321"} data-name="Left">
        <div className="content-stretch flex gap-[var(--numbers\/8,8px)] items-center relative shrink-0" id={isWhite ? "node-8372_20550" : "node-8372_20322"}>
          <div className="content-stretch flex items-center justify-center p-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0" id={isWhite ? "node-8372_20551" : "node-8372_20323"} data-name="Button">
            <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" id={isWhite ? "node-I8372_20551-45750_1679" : "node-I8372_20323-47903_4045"} data-name="Style=Regular,Size=20,State=Default">
              <div className="relative shrink-0 size-[12.5px]" id={isWhite ? "node-I8372_20551-45750_1679-28564_13226" : "node-I8372_20323-47903_4045-28564_13226"} data-name="Vector frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={isWhite ? imgVectorFrame4 : imgVectorFrame} />
              </div>
            </div>
          </div>
          <p className={`[word-break:break-word] font-["DM_Sans:Medium"] leading-[20px] not-italic relative shrink-0 text-[14px] whitespace-nowrap ${isWhite ? "text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)]" : "text-[color:var(--surface/foreground/static/neutral/inversed,white)]"}`} id={isWhite ? "node-8372_20552" : "node-8372_20324"}>
            6 users selected
          </p>
        </div>
      </div>
      <div className="content-stretch flex gap-[var(--numbers\/16,16px)] items-center justify-end relative shrink-0" id={isWhite ? "node-8236_14492" : "node-8323_16034"} data-name="Right">
        {isBrand && action1 && (
          <div className="content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-center px-[var(--spacing\/150,12px)] py-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="8323:16035" data-name="Button">
            <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-center justify-center relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I8323:16035;47903:4010" data-name="button-medium">
              <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I8323:16035;47903:4011" data-name="Style=Regular,Size=20,State=Default">
                <div className="relative shrink-0 size-[15.625px]" data-node-id="I8323:16035;47903:4011;28770:1169" data-name="Vector frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame1} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/inverse/foreground/default,#f7f7fa)] text-center whitespace-nowrap" data-node-id="I8323:16035;47903:4012">
                Action 1
              </p>
            </div>
          </div>
        )}
        {isBrand && action2 && (
          <div className="content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-center px-[var(--spacing\/150,12px)] py-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="8323:16036" data-name="Button">
            <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-center justify-center relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I8323:16036;47903:4010" data-name="button-medium">
              <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I8323:16036;47903:4011" data-name="Style=Regular, Size=20, State=Default">
                <div className="relative shrink-0 size-[16.25px]" data-node-id="I8323:16036;47903:4011;28637:11394" data-name="Vector frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame2} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/inverse/foreground/default,#f7f7fa)] text-center whitespace-nowrap" data-node-id="I8323:16036;47903:4012">
                Action 2
              </p>
            </div>
          </div>
        )}
        {isBrand && action3 && (
          <div className="content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-center px-[var(--spacing\/150,12px)] py-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="8323:16037" data-name="Button">
            <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-center justify-center relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I8323:16037;47903:4010" data-name="button-medium">
              <div className="content-stretch flex items-center justify-center px-[3px] py-[2px] relative shrink-0 size-[20px]" data-node-id="I8323:16037;47903:4011" data-name="Style=Regular,Size=20,State=Default">
                <div className="h-[16.25px] relative shrink-0 w-[15px]" data-node-id="I8323:16037;47903:4011;28561:9585" data-name="Vector frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame3} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/neutral/inverse/foreground/default,#f7f7fa)] text-center whitespace-nowrap" data-node-id="I8323:16037;47903:4012">
                Action 3
              </p>
            </div>
          </div>
        )}
        {isWhite && action1 && (
          <div className="content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-center px-[var(--spacing\/150,12px)] py-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="53733:17439" data-name="Button">
            <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-center justify-center relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I53733:17439;47202:2046" data-name="button-medium">
              <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I53733:17439;47202:2047" data-name="Style=Regular,Size=20,State=Default">
                <div className="relative shrink-0 size-[15.625px]" data-node-id="I53733:17439;47202:2047;28770:1169" data-name="Vector frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame5} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/Brand/Subtle/foreground/default,#7c33b5)] text-center whitespace-nowrap" data-node-id="I53733:17439;47202:2048">
                Action 1
              </p>
            </div>
          </div>
        )}
        {isWhite && action2 && (
          <div className="content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-center px-[var(--spacing\/150,12px)] py-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="8236:14494" data-name="Button">
            <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-center justify-center relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I8236:14494;47202:2046" data-name="button-medium">
              <div className="content-stretch flex items-center justify-center p-[2px] relative shrink-0 size-[20px]" data-node-id="I8236:14494;47202:2047" data-name="Style=Regular, Size=20, State=Default">
                <div className="relative shrink-0 size-[16.25px]" data-node-id="I8236:14494;47202:2047;28637:11394" data-name="Vector frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame6} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/Brand/Subtle/foreground/default,#7c33b5)] text-center whitespace-nowrap" data-node-id="I8236:14494;47202:2048">
                Action2
              </p>
            </div>
          </div>
        )}
        {isWhite && action3 && (
          <div className="content-stretch flex gap-[var(--numbers\/none,0px)] items-center justify-center px-[var(--spacing\/150,12px)] py-[var(--spacing\/container\/m,7px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="8236:14495" data-name="Button">
            <div className="content-stretch flex gap-[var(--spacing\/50,4px)] items-center justify-center relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I8236:14495;47202:2046" data-name="button-medium">
              <div className="content-stretch flex items-center justify-center px-[3px] py-[2px] relative shrink-0 size-[20px]" data-node-id="I8236:14495;47202:2047" data-name="Style=Regular,Size=20,State=Default">
                <div className="h-[16.25px] relative shrink-0 w-[15px]" data-node-id="I8236:14495;47202:2047;28561:9585" data-name="Vector frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame7} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--container/dynamic/Brand/Subtle/foreground/default,#7c33b5)] text-center whitespace-nowrap" data-node-id="I8236:14495;47202:2048">
                Action 3
              </p>
            </div>
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
These styles are contained in the design: Body Md/Medium: Font(family: "DM Sans", style: Medium, size: 14, weight: 500, lineHeight: 20, letterSpacing: 0).
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
