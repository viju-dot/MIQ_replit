type SecondaryNavigationProps = {
  className?: string;
  module?: "Audiences";
};

function SecondaryNavigation({ className, module = "Audiences" }: SecondaryNavigationProps) {
  return (
    <div className={className || "bg-[var(--surface/background/lvl1,white)] drop-shadow-[0px_1px_2px_var(--shadow/lvl8,rgba(113,113,128,0.08)),0px_8px_8px_var(--shadow/lvl4,rgba(113,113,128,0.04))] h-[56px] relative w-[1440px]"} data-node-id="20931:12235">
      <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute content-stretch flex gap-[24px] items-start leading-[20px] left-1/2 not-italic text-[14px] top-[calc(50%+0.5px)] whitespace-nowrap" data-node-id="20931:12236" data-name="Menu Items">
        <p className="font-['DM_Sans:SemiBold'] relative shrink-0 text-[color:var(--surface/foreground/dynamic/neutral/default/variation,#13131a)]" data-node-id="20931:12244">
          My audience
        </p>
        <p className="font-['DM_Sans:Regular'] relative shrink-0 text-[color:var(--surface/foreground/dynamic/neutral/default/regular,#4b4b59)]" data-node-id="20931:12243">
          Saved audiences
        </p>
        <p className="font-['DM_Sans:Regular'] relative shrink-0 text-[color:var(--surface/foreground/dynamic/neutral/default/regular,#4b4b59)]" data-node-id="28206:6234">
          Monitor
        </p>
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
These styles are contained in the design: Body Md/Semibold: Font(family: "DM Sans", style: SemiBold, size: 14, weight: 600, lineHeight: 20, letterSpacing: 0), Body Md/Regular: Font(family: "DM Sans", style: Regular, size: 14, weight: 400, lineHeight: 20, letterSpacing: 0), Elevation Regular: Effect(type: DROP_SHADOW, color: shadow/lvl4, offset: (0, 8), radius: 16, spread: 0); Effect(type: DROP_SHADOW, color: shadow/lvl8, offset: (0, 1), radius: 4, spread: 0).
Images and SVGs will be stored as constants, e.g. const image = 'https://www.figma.com/api/mcp/asset/550e8400-e29b-41d4-a716-446655440000.png'. These constants will be used in the code as the source for the image, ex: <img src={image} />. Image assets are stored on a remote server for 7 days and can be fetched using the provided URLs until they expire.