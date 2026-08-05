# Metrics (page node 45448:4137)

## Page structure (XML metadata)

<canvas id="45448:4137" name="Metrics" x="0" y="0" width="0" height="0">
  <frame id="45822:651" name="Metrics Card Content" x="-1410" y="-304" width="312" height="168">
    <symbol id="45592:1302" name="Type=Default" x="20" y="20" width="185" height="118" />
  </frame>
  <frame id="45829:264" name="Metrics Value" x="-1410" y="-33" width="134" height="176">
    <symbol id="45829:263" name="Size=Small" x="20" y="20" width="68" height="28" />
    <symbol id="45829:265" name="Size=Regular" x="20" y="68" width="81" height="32" />
    <symbol id="46297:238" name="Size=Large" x="20" y="120" width="94" height="36" />
  </frame>
  <frame id="45850:10132" name="Metrics tile" x="-1022" y="-304" width="286" height="829">
    <symbol id="45850:10110" name="State=Default" x="35" y="31" width="217" height="150" />
    <symbol id="45855:14246" name="State=Hover" x="35" y="210" width="217" height="150" />
    <symbol id="45896:8131" name="State=Disabled" x="35" y="568" width="217" height="150" />
    <symbol id="45858:11383" name="State=Selected" x="35" y="389" width="217" height="150" />
  </frame>
  <instance id="56761:116" name="Metrics tile" x="-987" y="-667" width="149" height="84" />
</canvas>
IMPORTANT: After you call this tool, you MUST call get_design_context if trying to implement the design, since this tool only returns metadata. If you do not call get_design_context, the agent will not be able to implement the design.


## frame "Metrics Card Content" (45822:651, 312x168)

const imgVectorFrame = "https://www.figma.com/api/mcp/asset/bdf9bc38-b142-401c-b706-7c7cf984ec13.svg";

type MetricsCardContentProps = {
  className?: string;
  showBadge1?: boolean;
  showContextLabelBottom?: boolean;
  showContextLabelTop?: boolean;
  showIconBottomRight?: boolean;
  showIconRight?: boolean;
  showMetricsName?: boolean;
  showTopIcon?: boolean;
  type?: "Default";
};

export default function MetricsCardContent({ className, showBadge1 = true, showContextLabelBottom = true, showContextLabelTop = true, showIconBottomRight = true, showIconRight = true, showMetricsName = true, showTopIcon = true, type = "Default" }: MetricsCardContentProps) {
  return (
    <div className={className || "content-stretch flex gap-[var(--spacing\\/75,6px)] items-center p-[var(--spacing\\/0,0px)] relative"} data-node-id="45592:1302">
      <div className="content-stretch flex flex-col gap-[var(--spacing\/75,6px)] items-start relative shrink-0" data-node-id="45592:1303" data-name="Metrics">
        {showTopIcon && (
          <div className="content-stretch flex flex-col gap-[var(--spacing\/0,0px)] items-center justify-center px-[var(--spacing\/0,0px)] py-[var(--spacing\/25,2px)] relative shrink-0 size-[24px]" data-node-id="45592:1304" data-name="Icon/users-three">
            <div className="h-[16.527px] relative shrink-0 w-[22.503px]" data-node-id="I45592:1304;28770:9878" data-name="Vector frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame} />
            </div>
          </div>
        )}
        {showContextLabelTop && (
          <div className="content-stretch flex gap-[var(--spacing\/0,0px)] items-center p-[var(--spacing\/0,0px)] relative shrink-0 w-full" data-node-id="45829:425" data-name="Context Label Top">
            <div className="content-stretch flex gap-[var(--spacing\/100,8px)] items-center p-[var(--spacing\/0,0px)] relative shrink-0" data-node-id="45829:426" data-name="Header text">
              <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--surface/foreground/static/neutral/lvl3,#717180)] text-center whitespace-nowrap" data-node-id="45829:428">
                text description here
              </p>
            </div>
            {showIconRight && (
              <div className="content-stretch flex flex-col gap-[var(--spacing\/0,0px)] items-center justify-center p-[var(--spacing\/0,0px)] relative shrink-0 size-[24px]" data-node-id="45829:429" data-name="Icon/users-three">
                <div className="h-[16.527px] relative shrink-0 w-[22.503px]" data-node-id="I45829:429;28770:9878" data-name="Vector frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame} />
                </div>
              </div>
            )}
          </div>
        )}
        <div className="content-stretch flex gap-[var(--spacing\/75,6px)] items-end p-[var(--spacing\/0,0px)] relative shrink-0" data-node-id="45937:12555">
          <div className="content-stretch flex gap-[var(--spacing\/0,0px)] items-center justify-center p-[var(--spacing\/0,0px)] relative shrink-0" data-node-id="45829:269" data-name="Metrics Value">
            <p className="[word-break:break-word] font-['DM_Sans:SemiBold'] leading-[28px] not-italic relative shrink-0 text-[20px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] text-center tracking-[-0.2px] w-[68px]" data-node-id="I45829:269;45829:261">
              8.3% M
            </p>
          </div>
          {showMetricsName && (
            <div className="content-stretch flex gap-[var(--spacing\/100,8px)] items-center pb-[var(--spacing\/25,2px)] pt-[var(--spacing\/0,0px)] px-[var(--spacing\/0,0px)] relative shrink-0" data-node-id="45937:12556" data-name="Header text">
              <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--surface/foreground/static/neutral/lvl2,#282833)] text-center whitespace-nowrap" data-node-id="45937:12557">
                metrics name here
              </p>
            </div>
          )}
        </div>
        {showContextLabelBottom && (
          <div className="content-stretch flex gap-[var(--spacing\/0,0px)] items-center p-[var(--spacing\/0,0px)] relative shrink-0 w-full" data-node-id="45822:613" data-name="Context Label Bottom">
            <div className="content-stretch flex gap-[var(--spacing\/100,8px)] items-center relative shrink-0" data-node-id="45822:614" data-name="Badge and text">
              {showBadge1 && (
                <div className="content-stretch flex gap-[var(--odd_numbers\/10,10px)] items-start p-[var(--spacing\/0,0px)] relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="45822:615" data-name="Badge/Standard">
                  <div className="bg-[var(--container/static/success/subtle/background,#e7faef)] content-stretch flex gap-[var(--numbers\/2,2px)] h-[18px] items-center justify-center px-[var(--odd_numbers\/3,3px)] py-[var(--numbers\/none,0px)] relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I45822:615;358:1776">
                    <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--container/static/success/subtle/foreground/variation,#115639)] text-center whitespace-nowrap" data-node-id="I45822:615;358:1777">
                      +2.1%
                    </p>
                  </div>
                </div>
              )}
              <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--surface/foreground/static/neutral/lvl2,#282833)] text-center whitespace-nowrap" data-node-id="45822:616">
                text description here
              </p>
            </div>
            {showIconBottomRight && (
              <div className="content-stretch flex flex-col gap-[var(--spacing\/0,0px)] items-center justify-center p-[var(--spacing\/0,0px)] relative shrink-0 size-[24px]" data-node-id="45822:617" data-name="Icon/users-three">
                <div className="h-[16.527px] relative shrink-0 w-[22.503px]" data-node-id="I45822:617;28770:9878" data-name="Vector frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame} />
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
These styles are contained in the design: Body Sm/Regular: Font(family: "DM Sans", style: Regular, size: 12, weight: 400, lineHeight: 18, letterSpacing: 0), Headline Sm/Semibold: Font(family: "DM Sans", style: SemiBold, size: 20, weight: 600, lineHeight: 28, letterSpacing: -1), Body Sm/Medium: Font(family: "DM Sans", style: Medium, size: 12, weight: 500, lineHeight: 18, letterSpacing: 0).
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.

## frame "Metrics Value" (45829:264, 134x176)

type MetricsValueProps = {
  className?: string;
  metricValue?: string;
  size?: "Small" | "Regular" | "Large";
};

export default function MetricsValue({ className, metricValue = "8.3% M", size = "Small" }: MetricsValueProps) {
  const isLarge = size === "Large";
  const isRegular = size === "Regular";
  return (
    <div className={className || "content-stretch flex items-center justify-center relative"} id={isLarge ? "node-46297_238" : isRegular ? "node-45829_265" : "node-45829_263"}>
      {size === "Small" && (
        <p className="[word-break:break-word] font-['DM_Sans:SemiBold'] leading-[28px] not-italic relative shrink-0 text-[20px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] text-center tracking-[-0.2px] w-[68px]" data-node-id="45829:261">
          {metricValue}
        </p>
      )}
      {isRegular && (
        <p className="[word-break:break-word] font-['DM_Sans:SemiBold'] leading-[32px] not-italic relative shrink-0 text-[24px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] text-center tracking-[-0.36px] whitespace-nowrap" data-node-id="45829:266">
          {metricValue}
        </p>
      )}
      {isLarge && (
        <p className="[word-break:break-word] font-['DM_Sans:SemiBold'] leading-[36px] not-italic relative shrink-0 text-[28px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] text-center tracking-[-0.56px] whitespace-nowrap" data-node-id="46297:239">
          {metricValue}
        </p>
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
These styles are contained in the design: Headline Sm/Semibold: Font(family: "DM Sans", style: SemiBold, size: 20, weight: 600, lineHeight: 28, letterSpacing: -1), Headline Md/Semibold: Font(family: "DM Sans", style: SemiBold, size: 24, weight: 600, lineHeight: 32, letterSpacing: -1.5), Headline Lg/Semibold: Font(family: "DM Sans", style: SemiBold, size: 28, weight: 600, lineHeight: 36, letterSpacing: -2).
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.

## frame "Metrics tile" (45850:10132, 286x829)

const imgVectorFrame = "https://www.figma.com/api/mcp/asset/69e7220b-2502-484a-a300-194de43c7cef.svg";
const imgVectorFrame1 = "https://www.figma.com/api/mcp/asset/2c402acb-dcb7-4bd8-ad3a-5876e71089bd.svg";

type MetricsValueProps = {
  className?: string;
  metricValue?: string;
  size?: "Small";
};

function MetricsValue({ className, metricValue = "8.3% M", size = "Small" }: MetricsValueProps) {
  return (
    <div className={className || "content-stretch flex items-center justify-center relative"} data-node-id="45829:263">
      <p className="[word-break:break-word] font-['DM_Sans:SemiBold'] leading-[28px] not-italic relative shrink-0 text-[20px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] text-center tracking-[-0.2px] w-[68px]" data-node-id="45829:261">
        {metricValue}
      </p>
    </div>
  );
}

type MetricsTileProps = {
  className?: string;
  showBadge1?: boolean;
  showContextLabelBottom?: boolean;
  showContextLabelTop?: boolean;
  showIconBottomRight?: boolean;
  showIconRight?: boolean;
  showMetricsName?: boolean;
  showTopIcon?: boolean;
  state?: "Hover" | "Selected" | "Default" | "Disabled";
};

export default function MetricsTile({ className, showBadge1 = true, showContextLabelBottom = true, showContextLabelTop = true, showIconBottomRight = true, showIconRight = true, showMetricsName = true, showTopIcon = true, state = "Default" }: MetricsTileProps) {
  const isDefaultOrHoverOrSelected = ["Default", "Hover", "Selected"].includes(state);
  const isDisabled = state === "Disabled";
  const isHover = state === "Hover";
  const isSelected = state === "Selected";
  return (
    <div className={className || `${String.raw`border border-solid content-stretch flex gap-[var(--spacing\/75,6px)] items-center p-[var(--spacing\/200,16px)] relative rounded-[var(--radius\/25,2px)] `}${isSelected ? "bg-[var(--surface/background/lvl1,white)] border-[var(--border/dynamic/brand/selected,#7c33b5)]" : isDisabled ? "bg-[var(--surface/background/hover,rgba(113,113,128,0.1))] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)]" : isHover ? "bg-[var(--surface/background/hover,rgba(113,113,128,0.08))] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)]" : "bg-[var(--surface/background/lvl1,white)] border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)]"}`} id={isSelected ? "node-45858_11383" : isDisabled ? "node-45896_8131" : isHover ? "node-45855_14246" : "node-45850_10110"}>
      <div className="content-stretch flex flex-col gap-[var(--spacing\/75,6px)] items-start p-[var(--spacing\/0,0px)] relative shrink-0" id={isSelected ? "node-45858_11384" : isDisabled ? "node-45896_8132" : isHover ? "node-45855_14247" : "node-45850_10111"} data-name="Metrics">
        {isDefaultOrHoverOrSelected && showTopIcon && (
          <div className="content-stretch flex flex-col gap-[var(--spacing\/0,0px)] items-center justify-center p-[var(--spacing\/0,0px)] relative shrink-0 size-[24px]" data-node-id="45850:10112" data-name="Icon/users-three">
            <div className="h-[16.527px] relative shrink-0 w-[22.503px]" data-node-id="I45850:10112;28770:9878" data-name="Vector frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame} />
            </div>
          </div>
        )}
        {isDefaultOrHoverOrSelected && showContextLabelTop && (
          <div className="content-stretch flex gap-[var(--spacing\/0,0px)] items-center p-[var(--spacing\/0,0px)] relative shrink-0 w-full" data-node-id="45850:10113" data-name="Context Label Top">
            <div className="content-stretch flex gap-[var(--spacing\/100,8px)] items-center relative shrink-0" data-node-id="45850:10114" data-name="Header text">
              <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--surface/foreground/static/neutral/lvl3,#717180)] text-center whitespace-nowrap" data-node-id="45850:10115">
                text description here
              </p>
            </div>
            {showIconRight && (
              <div className="content-stretch flex flex-col gap-[var(--spacing\/0,0px)] items-center justify-center p-[var(--spacing\/0,0px)] relative shrink-0 size-[24px]" data-node-id="45850:10116" data-name="Icon/users-three">
                <div className="h-[16.527px] relative shrink-0 w-[22.503px]" data-node-id="I45850:10116;28770:9878" data-name="Vector frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame} />
                </div>
              </div>
            )}
          </div>
        )}
        {isDefaultOrHoverOrSelected && (
          <div className="content-stretch flex gap-[var(--spacing\/75,6px)] items-end p-[var(--spacing\/0,0px)] relative shrink-0" id={isSelected ? "node-45937_12571" : isHover ? "node-45937_12565" : "node-45937_12561"}>
            <MetricsValue className="content-stretch flex items-center justify-center relative shrink-0" />
            {showMetricsName && (
              <div className="content-stretch flex gap-[var(--spacing\/0,0px)] items-center pb-[var(--spacing\/25,2px)] pt-[var(--spacing\/0,0px)] px-[var(--spacing\/0,0px)] relative shrink-0" data-node-id="45937:12562" data-name="Header text">
                <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--surface/foreground/static/neutral/lvl2,#282833)] text-center whitespace-nowrap" data-node-id="45937:12563">
                  metrics name here
                </p>
              </div>
            )}
          </div>
        )}
        {isDefaultOrHoverOrSelected && showContextLabelBottom && (
          <div className="content-stretch flex gap-[var(--spacing\/0,0px)] items-center p-[var(--spacing\/0,0px)] relative shrink-0 w-full" data-node-id="45850:10118" data-name="Context Label Bottom">
            <div className="content-stretch flex gap-[var(--spacing\/100,8px)] items-center p-[var(--spacing\/0,0px)] relative shrink-0" data-node-id="45850:10119" data-name="Badge and text">
              {showBadge1 && (
                <div className="content-stretch flex gap-[var(--odd_numbers\/10,10px)] items-start relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="45850:10120" data-name="Badge/Standard">
                  <div className="bg-[var(--container/static/success/subtle/background,#e7faef)] content-stretch flex gap-[var(--numbers\/2,2px)] h-[18px] items-center justify-center px-[var(--odd_numbers\/3,3px)] py-[var(--numbers\/none,0px)] relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I45850:10120;358:1776">
                    <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--container/static/success/subtle/foreground/variation,#115639)] text-center whitespace-nowrap" data-node-id="I45850:10120;358:1777">
                      +2.1%
                    </p>
                  </div>
                </div>
              )}
              <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--surface/foreground/static/neutral/lvl2,#282833)] text-center whitespace-nowrap" data-node-id="45850:10121">
                text description here
              </p>
            </div>
            {showIconBottomRight && (
              <div className="content-stretch flex flex-col gap-[var(--spacing\/0,0px)] items-center justify-center p-[var(--spacing\/0,0px)] relative shrink-0 size-[24px]" data-node-id="45850:10122" data-name="Icon/users-three">
                <div className="h-[16.527px] relative shrink-0 w-[22.503px]" data-node-id="I45850:10122;28770:9878" data-name="Vector frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame} />
                </div>
              </div>
            )}
          </div>
        )}
        {isDisabled && showTopIcon && (
          <div className="content-stretch flex flex-col gap-[var(--spacing\/0,0px)] items-center justify-center p-[var(--spacing\/0,0px)] relative shrink-0 size-[24px]" data-node-id="45896:8133" data-name="Icon/users-three">
            <div className="h-[16.527px] relative shrink-0 w-[22.503px]" data-node-id="I45896:8133;28770:9878" data-name="Vector frame">
              <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame1} />
            </div>
          </div>
        )}
        {isDisabled && showContextLabelTop && (
          <div className="content-stretch flex gap-[var(--spacing\/0,0px)] items-center p-[var(--spacing\/0,0px)] relative shrink-0 w-full" data-node-id="45896:8134" data-name="Context Label Top">
            <div className="content-stretch flex gap-[var(--spacing\/100,8px)] items-center relative shrink-0" data-node-id="45896:8135" data-name="Header text">
              <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--container/dynamic/neutral/subtle/foreground/disabled,#a8a8b2)] text-center whitespace-nowrap" data-node-id="45896:8136">
                text description here
              </p>
            </div>
            {showIconRight && (
              <div className="content-stretch flex flex-col gap-[var(--spacing\/0,0px)] items-center justify-center p-[var(--spacing\/0,0px)] relative shrink-0 size-[24px]" data-node-id="45896:8137" data-name="Icon/users-three">
                <div className="h-[16.527px] relative shrink-0 w-[22.503px]" data-node-id="I45896:8137;28770:9878" data-name="Vector frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame1} />
                </div>
              </div>
            )}
          </div>
        )}
        {isDisabled && (
          <div className="content-stretch flex gap-[var(--spacing\/75,6px)] items-end p-[var(--spacing\/0,0px)] relative shrink-0" data-node-id="45937:12577">
            <div className="content-stretch flex items-center justify-center relative shrink-0" data-node-id="45937:12578" data-name="Metrics Value">
              <p className="[word-break:break-word] font-['DM_Sans:SemiBold'] leading-[28px] not-italic relative shrink-0 text-[20px] text-[color:var(--container/dynamic/neutral/subtle/foreground/disabled,#a8a8b2)] text-center tracking-[-0.2px] w-[68px]" data-node-id="I45937:12578;45829:261">
                8.3% M
              </p>
            </div>
            {showMetricsName && (
              <div className="content-stretch flex gap-[var(--spacing\/0,0px)] items-center pb-[var(--spacing\/25,2px)] pt-[var(--spacing\/0,0px)] px-[var(--spacing\/0,0px)] relative shrink-0" data-node-id="45937:12579" data-name="Header text">
                <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--container/dynamic/neutral/subtle/foreground/disabled,#a8a8b2)] text-center whitespace-nowrap" data-node-id="45937:12580">
                  metrics name here
                </p>
              </div>
            )}
          </div>
        )}
        {isDisabled && showContextLabelBottom && (
          <div className="content-stretch flex gap-[var(--spacing\/0,0px)] items-center p-[var(--spacing\/0,0px)] relative shrink-0 w-full" data-node-id="45896:8139" data-name="Context Label Bottom">
            <div className="content-stretch flex gap-[var(--spacing\/100,8px)] items-center p-[var(--spacing\/0,0px)] relative shrink-0" data-node-id="45896:8140" data-name="Badge and text">
              {showBadge1 && (
                <div className="content-stretch flex gap-[var(--odd_numbers\/10,10px)] items-start relative rounded-[var(--radius\/25,2px)] shrink-0" data-node-id="45896:8141" data-name="Badge/Standard">
                  <div className="bg-[var(--container/dynamic/neutral/subtle/background/disabled,rgba(113,113,128,0.1))] content-stretch flex gap-[var(--numbers\/2,2px)] h-[18px] items-center justify-center px-[var(--odd_numbers\/3,3px)] py-[var(--numbers\/none,0px)] relative rounded-[var(--radiuses\/small,2px)] shrink-0" data-node-id="I45896:8141;358:1776">
                    <p className="[word-break:break-word] font-['DM_Sans:Medium'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--container/dynamic/neutral/subtle/foreground/disabled,#a8a8b2)] text-center whitespace-nowrap" data-node-id="I45896:8141;358:1777">
                      +2.1%
                    </p>
                  </div>
                </div>
              )}
              <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--container/dynamic/neutral/subtle/foreground/disabled,#a8a8b2)] text-center whitespace-nowrap" data-node-id="45896:8142">
                text description here
              </p>
            </div>
            {showIconBottomRight && (
              <div className="content-stretch flex flex-col gap-[var(--spacing\/0,0px)] items-center justify-center p-[var(--spacing\/0,0px)] relative shrink-0 size-[24px]" data-node-id="45896:8143" data-name="Icon/users-three">
                <div className="h-[16.527px] relative shrink-0 w-[22.503px]" data-node-id="I45896:8143;28770:9878" data-name="Vector frame">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorFrame1} />
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
These styles are contained in the design: Body Sm/Regular: Font(family: "DM Sans", style: Regular, size: 12, weight: 400, lineHeight: 18, letterSpacing: 0), Headline Sm/Semibold: Font(family: "DM Sans", style: SemiBold, size: 20, weight: 600, lineHeight: 28, letterSpacing: -1), Body Sm/Medium: Font(family: "DM Sans", style: Medium, size: 12, weight: 500, lineHeight: 18, letterSpacing: 0).
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.

## instance "Metrics tile" (56761:116, 149x84)

export default function MetricsTile() {
  return (
    <div className="bg-[var(--surface/background/lvl1,white)] border border-[var(--border/dynamic/neutral/subtle/default,#c6c6cc)] border-solid content-stretch flex gap-[var(--spacing\/75,6px)] items-center p-[var(--spacing\/200,16px)] relative rounded-[var(--radius\/25,2px)] size-full" data-node-id="56761:116" data-name="Metrics tile">
      <div className="content-stretch flex flex-col gap-[var(--spacing\/75,6px)] items-start p-[var(--spacing\/0,0px)] relative shrink-0" data-node-id="I56761:116;45850:10111" data-name="Metrics">
        <div className="content-stretch flex gap-[var(--spacing\/75,6px)] items-end p-[var(--spacing\/0,0px)] relative shrink-0" data-node-id="I56761:116;45937:12561">
          <div className="content-stretch flex items-center justify-center relative shrink-0" data-node-id="I56761:116;45850:10117" data-name="Metrics Value">
            <p className="[word-break:break-word] font-['DM_Sans:SemiBold'] leading-[28px] not-italic relative shrink-0 text-[20px] text-[color:var(--surface/foreground/static/neutral/lvl1,#13131a)] text-center tracking-[-0.2px] w-[68px]" data-node-id="I56761:116;45850:10117;45829:261">
              8.3% M
            </p>
          </div>
        </div>
        <div className="content-stretch flex gap-[var(--spacing\/0,0px)] items-center p-[var(--spacing\/0,0px)] relative shrink-0 w-full" data-node-id="I56761:116;45850:10118" data-name="Context Label Bottom">
          <div className="content-stretch flex gap-[var(--spacing\/100,8px)] items-center p-[var(--spacing\/0,0px)] relative shrink-0" data-node-id="I56761:116;45850:10119" data-name="Badge and text">
            <p className="[word-break:break-word] font-['DM_Sans:Regular'] leading-[18px] not-italic relative shrink-0 text-[12px] text-[color:var(--surface/foreground/static/neutral/lvl2,#282833)] text-center whitespace-nowrap" data-node-id="I56761:116;45850:10121">
              text description here
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
These styles are contained in the design: Headline Sm/Semibold: Font(family: "DM Sans", style: SemiBold, size: 20, weight: 600, lineHeight: 28, letterSpacing: -1), Body Sm/Regular: Font(family: "DM Sans", style: Regular, size: 12, weight: 400, lineHeight: 18, letterSpacing: 0).
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.
