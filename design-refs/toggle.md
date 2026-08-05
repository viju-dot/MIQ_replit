# Toggle (page node 185:664)

## Page structure (XML metadata)

<canvas id="185:664" name="Toggle" x="0" y="0" width="0" height="0">
  <frame id="5220:12623" name="Toggle" x="321" y="-80" width="201" height="237">
    <symbol id="185:665" name="Compact=Yes, State=Disabled/Off" x="20" y="26" width="46" height="24" />
    <symbol id="185:669" name="Compact=Yes, State=Off" x="20" y="77" width="46" height="24" />
    <symbol id="185:673" name="Compact=Yes, State=On" x="20" y="127" width="46" height="24" />
    <symbol id="11753:68176" name="Compact=Yes, State=Disabled/On" x="18" y="177" width="46" height="24" />
    <symbol id="185:677" name="Compact=No, State=Disabled/Off" x="118" y="22" width="63" height="32" />
    <symbol id="185:681" name="Compact=No, State=Off" x="118" y="73" width="63" height="32" />
    <symbol id="185:685" name="Compact=No, State=On" x="118" y="123" width="63" height="32" />
    <symbol id="11753:68180" name="Compact=No, State=Disabled/On" x="116" y="177" width="63" height="32" />
  </frame>
</canvas>
IMPORTANT: After you call this tool, you MUST call get_design_context if trying to implement the design, since this tool only returns metadata. If you do not call get_design_context, the agent will not be able to implement the design.


## frame "Toggle" (5220:12623, 201x237)

const imgOn = "https://www.figma.com/api/mcp/asset/e54b7b73-3d41-4b7f-b865-8d6dbeb9aa1b.svg";
const imgOn1 = "https://www.figma.com/api/mcp/asset/2257812d-708f-4269-b2b8-e13314fc8dc8.svg";
const imgOn2 = "https://www.figma.com/api/mcp/asset/7e8f0544-c146-4cf4-b458-8bc2972b67b7.svg";
const imgOn3 = "https://www.figma.com/api/mcp/asset/4aad4f9a-0de8-464e-b6dc-bcd12b0ba3d3.svg";
const imgOnCopy2 = "https://www.figma.com/api/mcp/asset/ef20b0dc-4039-4d15-bf19-60a8da3f822d.svg";
const imgOn4 = "https://www.figma.com/api/mcp/asset/c672a451-5bb4-46f8-afdc-641a064732fb.svg";
const imgOnCopy3 = "https://www.figma.com/api/mcp/asset/67faf77f-1c31-49d6-88c4-01437cbb0608.svg";

type ToggleProps = {
  className?: string;
  compact?: boolean;
  state?: "Off" | "On" | "Disabled/Off" | "Disabled/On";
};

export default function Toggle({ className, compact = true, state = "Disabled/Off" }: ToggleProps) {
  if (compact && state === "Off") {
    return (
      <button className={className || "bg-[var(--controls/background/inactive,#ebebf0)] content-stretch cursor-pointer flex h-[var(--\\[old\\]sizing\\/24,24px)] items-center max-h-[24px] max-w-[46px] min-w-[46px] p-[2px] relative rounded-[20px] w-[46px]"} data-node-id="185:669" data-name="Compact=Yes, State=Off">
        <div className="relative shrink-0 size-[20px]" data-node-id="185:671" data-name="On">
          <div className="absolute inset-[-20%_-30%_-20%_-10%]">
            <img alt="" className="block max-w-none size-full" src={imgOn1} />
          </div>
        </div>
      </button>
    );
  }
  if (compact && state === "On") {
    return (
      <button className={className || "bg-[var(--controls/background/active,#7c33b5)] content-stretch cursor-pointer flex h-[var(--\\[old\\]sizing\\/24,24px)] items-center justify-end max-h-[24px] max-w-[46px] min-w-[46px] p-[2px] relative rounded-[20px] w-[46px]"} data-node-id="185:673" data-name="Compact=Yes, State=On">
        <div className="relative shrink-0 size-[20px]" data-node-id="185:675" data-name="On">
          <div className="absolute inset-[-20%_-10%_-20%_-30%]">
            <img alt="" className="block max-w-none size-full" src={imgOn2} />
          </div>
        </div>
      </button>
    );
  }
  if (compact && state === "Disabled/On") {
    return (
      <div className={className || "bg-[var(--controls/background/disabled,rgba(113,113,128,0.1))] content-stretch flex h-[var(--\\[old\\]sizing\\/24,24px)] items-center justify-end max-h-[24px] max-w-[46px] min-w-[46px] p-[2px] relative rounded-[20px] w-[46px]"} data-node-id="11753:68176" data-name="Compact=Yes, State=Disabled/On">
        <div className="relative shrink-0 size-[20px]" data-node-id="11753:68178" data-name="On">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgOn3} />
        </div>
      </div>
    );
  }
  if (!compact && state === "Disabled/Off") {
    return (
      <div className={className || "bg-[var(--controls/background/disabled,rgba(113,113,128,0.1))] content-stretch flex h-[var(--\\[old\\]sizing\\/32,32px)] items-center max-h-[32px] max-w-[63px] px-[3px] py-[2px] relative rounded-[20px] w-[63px]"} data-node-id="185:677" data-name="Compact=No, State=Disabled/Off">
        <div className="relative shrink-0 size-[28px]" data-node-id="185:679" data-name="On Copy 2">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgOnCopy2} />
        </div>
      </div>
    );
  }
  if (!compact && state === "Off") {
    return (
      <div className={className || "bg-[var(--controls/background/inactive,#ebebf0)] content-stretch flex h-[var(--\\[old\\]sizing\\/32,32px)] items-center max-h-[32px] max-w-[63px] p-[2px] relative rounded-[20px] w-[63px]"} data-node-id="185:681" data-name="Compact=No, State=Off">
        <div className="relative shrink-0 size-[28px]" data-node-id="185:683" data-name="On">
          <div className="absolute inset-[-14.29%_-21.43%_-14.29%_-7.14%]">
            <img alt="" className="block max-w-none size-full" src={imgOn4} />
          </div>
        </div>
      </div>
    );
  }
  if (!compact && state === "On") {
    return (
      <div className={className || "bg-[var(--controls/background/active,#7c33b5)] content-stretch flex h-[var(--\\[old\\]sizing\\/32,32px)] items-center justify-end max-h-[32px] max-w-[63px] p-[2px] relative rounded-[20px] w-[63px]"} data-node-id="185:685" data-name="Compact=No, State=On">
        <div className="relative shrink-0 size-[28px]" data-node-id="185:687" data-name="On Copy 2">
          <div className="absolute inset-[-14.29%_-7.14%_-14.29%_-21.43%]">
            <img alt="" className="block max-w-none size-full" src={imgOnCopy3} />
          </div>
        </div>
      </div>
    );
  }
  if (!compact && state === "Disabled/On") {
    return (
      <div className={className || "bg-[var(--controls/background/disabled,rgba(113,113,128,0.1))] content-stretch flex h-[var(--\\[old\\]sizing\\/32,32px)] items-center justify-end max-h-[32px] max-w-[63px] p-[2px] relative rounded-[20px] w-[63px]"} data-node-id="11753:68180" data-name="Compact=No, State=Disabled/On">
        <div className="relative shrink-0 size-[28px]" data-node-id="11753:68182" data-name="On Copy 2">
          <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgOnCopy2} />
        </div>
      </div>
    );
  }
  return (
    <div className={className || "bg-[var(--controls/background/disabled,rgba(113,113,128,0.1))] content-stretch flex h-[var(--\\[old\\]sizing\\/24,24px)] items-center max-h-[24px] max-w-[46px] min-w-[46px] overflow-clip p-[2px] relative rounded-[20px] w-[46px]"} data-node-id="185:665" data-name="Compact=Yes, State=Disabled/Off">
      <div className="relative shrink-0 size-[20px]" data-node-id="185:667" data-name="On">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgOn} />
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
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
