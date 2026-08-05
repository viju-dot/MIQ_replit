# Radio (page node 185:548)

## Page structure (XML metadata)

<canvas id="185:548" name="Radio" x="0" y="0" width="0" height="0">
  <frame id="378:2016" name="Radio" x="-153" y="-69" width="142" height="494">
    <symbol id="185:554" name="State=Selected, Label=False, Disabled=False" x="16" y="16" width="24" height="24" />
    <symbol id="185:563" name="State=Selected, Label=False, Disabled=True" x="16" y="60" width="24" height="24" />
    <symbol id="185:559" name="State=Unselected, Label=False, Disabled=False" x="16" y="104" width="24" height="24" />
    <symbol id="13502:20941" name="State=Unselected, Label=False, Disabled=True" x="16" y="148" width="24" height="24" />
    <symbol id="185:569" name="State=Selected, Label=True, Disabled=False" x="16" y="192" width="73" height="24" />
    <symbol id="874:4129" name="State=Unselected, Label=True, Disabled=False" x="16" y="236" width="73" height="24" />
    <symbol id="13502:20927" name="State=Unselected, Label=True, Disabled=True" x="16" y="280" width="73" height="24" />
    <symbol id="13502:20916" name="State=Selected, Label=True, Disabled=True" x="16" y="324" width="73" height="24" />
    <symbol id="185:549" name="State=Group, Label=False, Disabled=False" x="16" y="368" width="110" height="110" />
  </frame>
</canvas>
IMPORTANT: After you call this tool, you MUST call get_design_context if trying to implement the design, since this tool only returns metadata. If you do not call get_design_context, the agent will not be able to implement the design.


## frame "Radio" (378:2016, 142x494)

const imgCheckboxChecked = "https://www.figma.com/api/mcp/asset/34a90c12-546c-4d17-a37b-19a7fd12b3ea.svg";
const imgCheckboxChecked1 = "https://www.figma.com/api/mcp/asset/ecb25462-8f80-417d-acc2-c397427dd12b.svg";
const imgCheckboxChecked2 = "https://www.figma.com/api/mcp/asset/8c8c6e04-dc5b-47ff-a738-8560b166c6ff.svg";
const imgCheckboxChecked3 = "https://www.figma.com/api/mcp/asset/388bc790-7051-4be6-ba6a-e0646878c976.svg";
const imgCheckboxChecked4 = "https://www.figma.com/api/mcp/asset/cdd7cd20-9f9f-4c9b-b1b2-c928a4f71a51.svg";

type RadioProps = {
  className?: string;
  disabled?: boolean;
  label?: boolean;
  state?: "Selected" | "Unselected" | "Group";
};

export default function Radio({ className, disabled = false, label = false, state = "Selected" }: RadioProps) {
  const isGroupAndNotLabelAndNotDisabled = state === "Group" && !label && !disabled;
  const isLabelAndIsUnselectedOrSelectedAndDisabled = label && (state === "Unselected" || (state === "Selected" && disabled));
  const isSelectedAndLabelAndDisabled = state === "Selected" && label && disabled;
  const isSelectedAndLabelAndNotDisabled = state === "Selected" && label && !disabled;
  const isSelectedAndNotLabelAndDisabled = state === "Selected" && !label && disabled;
  const isUnselectedAndLabelAndDisabled = state === "Unselected" && label && disabled;
  const isUnselectedAndNotLabelAndDisabled = state === "Unselected" && !label && disabled;
  const isUnselectedAndNotLabelAndNotDisabled = state === "Unselected" && !label && !disabled;
  return (
    <div className={className || `relative ${isGroupAndNotLabelAndNotDisabled ? String.raw`content-stretch flex flex-col gap-[var(--numbers\/6,6px)] items-start` : label && ["Selected", "Unselected"].includes(state) ? String.raw`content-stretch flex gap-[var(--numbers\/4,4px)] items-center` : "size-[24px]"}`} id={isGroupAndNotLabelAndNotDisabled ? "node-185_549" : isSelectedAndLabelAndDisabled ? "node-13502_20916" : isUnselectedAndLabelAndDisabled ? "node-13502_20927" : state === "Unselected" && label && !disabled ? "node-874_4129" : isSelectedAndLabelAndNotDisabled ? "node-185_569" : isUnselectedAndNotLabelAndDisabled ? "node-13502_20941" : isUnselectedAndNotLabelAndNotDisabled ? "node-185_559" : isSelectedAndNotLabelAndDisabled ? "node-185_563" : "node-185_554"}>
      {!label && ["Selected", "Unselected"].includes(state) && (
        <div className="absolute left-0 size-[24px] top-0" id={isUnselectedAndNotLabelAndDisabled ? "node-13502_20942" : isUnselectedAndNotLabelAndNotDisabled ? "node-185_560" : isSelectedAndNotLabelAndDisabled ? "node-185_564" : "node-185_555"} data-name="Checkbox / Checked">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={isUnselectedAndNotLabelAndDisabled ? imgCheckboxChecked3 : isUnselectedAndNotLabelAndNotDisabled ? imgCheckboxChecked2 : isSelectedAndNotLabelAndDisabled ? imgCheckboxChecked1 : imgCheckboxChecked} />
        </div>
      )}
      {isLabelAndIsUnselectedOrSelectedAndDisabled && (
        <>
          <div className="relative shrink-0 size-[24px]" id={isSelectedAndLabelAndDisabled ? "node-13502_20917" : isUnselectedAndLabelAndDisabled ? "node-13502_20928" : "node-13502_20883"} data-name="Radio">
            <div className="absolute left-0 size-[24px] top-0" id={isSelectedAndLabelAndDisabled ? "node-I13502_20917-185_564" : isUnselectedAndLabelAndDisabled ? "node-I13502_20928-185_560" : "node-I13502_20883-185_560"} data-name="Checkbox / Checked">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={isSelectedAndLabelAndDisabled ? imgCheckboxChecked1 : isUnselectedAndLabelAndDisabled ? imgCheckboxChecked4 : imgCheckboxChecked2} />
            </div>
          </div>
          <div className={`[word-break:break-word] flex flex-col font-["DM_Sans:Regular"] justify-center leading-[0] not-italic relative shrink-0 text-[14px] whitespace-nowrap ${label && disabled && ["Unselected", "Selected"].includes(state) ? "text-[color:var(--surface/foreground/dynamic/neutral/disabled,#a8a8b2)]" : "text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)]"}`} id={isSelectedAndLabelAndDisabled ? "node-13502_20918" : isUnselectedAndLabelAndDisabled ? "node-13502_20929" : "node-874_4133"}>
            <p className="leading-[20px]">Option</p>
          </div>
        </>
      )}
      {isSelectedAndLabelAndNotDisabled && (
        <>
          <div className="relative shrink-0 size-[24px]" data-node-id="185:571" data-name="Checkbox / Radio / Checked">
            <div className="absolute left-0 size-[24px] top-0" data-node-id="I185:571;185:555" data-name="Checkbox / Checked">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCheckboxChecked} />
            </div>
          </div>
          <div className="[word-break:break-word] flex flex-col font-['DM_Sans:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] whitespace-nowrap" data-node-id="185:570">
            <p className="leading-[20px]">Option</p>
          </div>
        </>
      )}
      {isGroupAndNotLabelAndNotDisabled && (
        <>
          <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[20px] not-italic relative shrink-0 text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] whitespace-nowrap" data-node-id="185:553">
            Radio group title:
          </p>
          <div className="content-stretch flex gap-[var(--numbers\/4,4px)] items-center relative shrink-0" data-node-id="185:550" data-name="Radio">
            <div className="relative shrink-0 size-[24px]" data-node-id="I185:550;185:571" data-name="Checkbox / Radio / Checked">
              <div className="absolute left-0 size-[24px] top-0" data-node-id="I185:550;185:571;185:555" data-name="Checkbox / Checked">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCheckboxChecked} />
              </div>
            </div>
            <div className="[word-break:break-word] flex flex-col font-['DM_Sans:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] whitespace-nowrap" data-node-id="I185:550;185:570">
              <p className="leading-[20px]">Option</p>
            </div>
          </div>
          <div className="content-stretch flex gap-[var(--numbers\/4,4px)] items-center relative shrink-0" data-node-id="185:551" data-name="Radio">
            <div className="relative shrink-0 size-[24px]" data-node-id="I185:551;185:571" data-name="Checkbox / Radio / Checked">
              <div className="absolute left-0 size-[24px] top-0" data-node-id="I185:551;185:571;185:555" data-name="Checkbox / Checked">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCheckboxChecked} />
              </div>
            </div>
            <div className="[word-break:break-word] flex flex-col font-['DM_Sans:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] whitespace-nowrap" data-node-id="I185:551;185:570">
              <p className="leading-[20px]">Option</p>
            </div>
          </div>
          <div className="content-stretch flex gap-[var(--numbers\/4,4px)] items-center relative shrink-0" data-node-id="185:552" data-name="Radio">
            <div className="relative shrink-0 size-[24px]" data-node-id="I185:552;185:571" data-name="Checkbox / Radio / Checked">
              <div className="absolute left-0 size-[24px] top-0" data-node-id="I185:552;185:571;185:555" data-name="Checkbox / Checked">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCheckboxChecked} />
              </div>
            </div>
            <div className="[word-break:break-word] flex flex-col font-['DM_Sans:Regular'] justify-center leading-[0] not-italic relative shrink-0 text-[14px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] whitespace-nowrap" data-node-id="I185:552;185:570">
              <p className="leading-[20px]">Option</p>
            </div>
          </div>
        </>
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
These styles are contained in the design: Body Md/Regular: Font(family: "DM Sans", style: Regular, size: 14, weight: 400, lineHeight: 20, letterSpacing: 0).
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
