import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

const A = "/figmaAssets/page/";

const imgVectorContainer = `${A}vector-container.svg`;
const imgCaretFrame = `${A}caret-frame.svg`;
const imgLogoVector = `${A}logo-vector.svg`;
const imgLogoVector1 = `${A}logo-vector1.svg`;
const imgLogoVector3 = `${A}logo-vector3.svg`;
const imgLogoVector6 = `${A}logo-vector6.svg`;
const imgLogoVector7 = `${A}logo-vector7.svg`;
const imgTranslate = `${A}translate.svg`;
const imgCaretFrameSm = `${A}caret-frame-sm.svg`;
const imgAvatarEllipse = `${A}avatar-ellipse.svg`;
const imgFiberLine = `${A}fiber-line.svg`;
const imgCatAtom = `${A}cat-atom.svg`;
const imgCatMolecule = `${A}cat-molecule.svg`;
const imgCatOrganism = `${A}cat-organism.svg`;
const imgCatTemplate = `${A}cat-template.svg`;
const imgCatPages = `${A}cat-pages.svg`;
const imgImage1 = `${A}image1-bar.png`;
const imgScreenshotSm = `${A}screenshot-sm.png`;
const imgScreenshotSmInset = `${A}screenshot-sm-inset.png`;
const imgScreenshotXl = `${A}screenshot-xl.png`;
const imgScreenshotXlInset = `${A}screenshot-xl-inset.png`;
const imgScreenshotStep1 = `${A}screenshot-step1.png`;
const imgScreenshotStep2 = `${A}screenshot-step2.png`;
const imgScreenshotStep3 = `${A}screenshot-step3.png`;

/* ------------------------------------------------------------------ */
/* Figma components (unchanged JSX/classes)                           */
/* ------------------------------------------------------------------ */

function SingleDiamond({ className }: { className?: string }) {
  return (
    <div className={className || "relative size-[24px]"} data-name="Single Diamond">
      <div className="-translate-x-1/2 -translate-y-1/2 absolute left-1/2 size-[20px] top-1/2" data-name="Vector Container">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgVectorContainer} />
      </div>
    </div>
  );
}

function Navigation({ className }: { className?: string }) {
  return (
    <div className={className || "content-stretch flex flex-col items-start relative w-full"} data-name="Navigation">
      <div className="bg-[var(--surface-background-miq,#2b0030)] content-stretch flex h-[64px] items-center justify-between p-[24px] relative shrink-0 w-full" data-name="Primary Navigation">
        <div className="content-stretch flex gap-[0px] items-center relative shrink-0" data-name="Menu item">
          <div className="content-stretch flex gap-[32px] h-[64px] items-center justify-center relative shrink-0" data-name="Menu">
            <div className="h-full relative shrink-0 w-[100px]" data-name="Intelligence">
              <p className="[word-break:break-word] absolute font-['DM_Sans'] font-medium leading-[var(--body-lg-medium-line-height,24px)] left-[calc(50%-43.23px)] not-italic text-[length:var(--body-lg-medium-size,16px)] text-[var(--surface-foreground-static-neutral-inversed,#ffffff)] top-[calc(50%-10px)] whitespace-nowrap">
                Intelligence
              </p>
              <div className="-translate-x-1/2 absolute bg-gradient-to-r bottom-0 from-[var(--gradients-sigma-1,#d71982)] from-[25.521%] h-[4px] left-[calc(50%-1px)] rounded-tl-[2px] rounded-tr-[2px] to-[#dad310] via-[var(--gradients-sigma-2,#ff540c)] via-[59.375%] w-[100px]" data-name="On" />
            </div>
          </div>
          <div className="flex flex-row items-center self-stretch">
            <div className="content-stretch flex h-full items-center justify-center pb-[2px] pt-[6px] px-[4px] relative shrink-0 w-[24px]" data-name="Icon/caret">
              <div className="relative shrink-0 size-[24px]" data-name="Vector frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCaretFrame} />
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[16px] items-center relative shrink-0" data-name="Logo and tags">
          <div className="overflow-clip relative shrink-0 size-[24px]" data-name="Sigma Logo">
            <div className="-translate-x-1/2 absolute aspect-[249/300] bottom-[7.5%] left-1/2 top-[7.5%]" data-name="Logo">
              <div className="absolute contents inset-[0_0.26%_0_0.05%]">
                <div className="absolute contents inset-[0_0.26%_0_0.05%]">
                  <div className="absolute contents inset-[-151.64%_-112.65%_-135.3%_-149.22%]">
                    <div
                      className="absolute inset-[0_0_0_0.05%]"
                      style={{
                        WebkitMaskImage: `url("${imgLogoVector}")`,
                        maskImage: `url("${imgLogoVector}")`,
                        WebkitMaskSize: "281.134px 340px",
                        maskSize: "281.134px 340px",
                        WebkitMaskPosition: "0px -0.002px",
                        maskPosition: "0px -0.002px",
                        WebkitMaskRepeat: "no-repeat",
                        maskRepeat: "no-repeat",
                      }}
                    >
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLogoVector1} />
                    </div>
                    <div className="absolute inset-[45.14%_236.65%_49.83%_-149.22%]" data-name="Vector">
                      <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLogoVector3} />
                    </div>
                  </div>
                </div>
                <div className="absolute bottom-[16.76%] left-[0.05%] mix-blend-multiply opacity-60 right-[31.81%] top-1/2" data-name="Vector">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLogoVector6} />
                </div>
                <div className="absolute bottom-1/2 left-[0.05%] mix-blend-multiply opacity-60 right-[31.81%] top-[16.75%]" data-name="Vector">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgLogoVector7} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="content-stretch flex gap-[20px] items-center justify-end relative shrink-0" data-name="right">
          <div className="bg-[rgba(255,255,255,0.2)] content-stretch flex gap-[8px] h-[34px] items-center justify-center px-[12px] py-[4px] relative rounded-[var(--radiuses-small,2px)] shrink-0" data-name="language">
            <div className="content-stretch flex gap-[4px] items-center relative shrink-0">
              <div className="content-stretch flex items-center justify-center overflow-clip p-[2px] relative shrink-0 size-[20px]" data-name="Icon/translate">
                <div className="h-[15.625px] relative shrink-0 w-[17.5px]" data-name="Vector">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgTranslate} />
                </div>
              </div>
              <p className="[word-break:break-word] font-['DM_Sans'] leading-[var(--body-md-regular-line-height,20px)] not-italic relative shrink-0 text-[length:var(--body-md-regular-size,14px)] text-[var(--surface-foreground-static-neutral-inversed,#ffffff)] whitespace-nowrap">
                English
              </p>
            </div>
            <div className="content-stretch flex items-center justify-center relative shrink-0 size-[20px]" data-name="Icon/caret">
              <div className="relative shrink-0 size-[20px]" data-name="Vector frame">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgCaretFrameSm} />
              </div>
            </div>
          </div>
          <SingleDiamond className="relative shrink-0 size-[24px]" />
          <div className="content-stretch flex items-center overflow-clip px-[3px] relative shrink-0" data-name="Avatar">
            <div className="h-[40px] relative shrink-0 w-[36px]" data-name="Avatar">
              <div className="-translate-x-1/2 absolute left-1/2 size-[32px] top-0" data-name="Initials">
                <div className="absolute left-0 size-[32px] top-0">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgAvatarEllipse} />
                </div>
                <p className="-translate-x-full [word-break:break-word] absolute font-['DM_Sans'] font-medium leading-[normal] left-[calc(50%+8px)] not-italic text-[length:var(--body-md-medium-size,14px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] text-right top-[7px] whitespace-nowrap">
                  JS
                </p>
              </div>
              <div className="-translate-x-1/2 absolute bottom-0 content-stretch flex items-start left-1/2" data-name="Badge/rounded">
                <div className="content-stretch flex gap-[10px] h-[18px] items-start relative shrink-0" data-name="Badge/rounded">
                  <div className="bg-gradient-to-r content-stretch flex from-[25.521%] from-[var(--gradients-sigma-1,#d71982)] gap-[4px] h-[18px] items-center justify-center px-[8px] py-[2px] relative rounded-[var(--old-radiuses-round,100px)] shrink-0 to-[var(--gradients-sigma-3,#f0e812)] via-[59.375%] via-[var(--gradients-sigma-2,#ff540c)]">
                    <p className="[word-break:break-word] font-['DM_Sans'] font-medium leading-[var(--body-sm-medium-line-height,18px)] not-italic relative shrink-0 text-[length:var(--body-sm-medium-size,12px)] text-[var(--surface-foreground-static-neutral-inversed,#ffffff)] text-center whitespace-nowrap">
                      Pro+
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        className="bg-[var(--surface-background-lvl1,#ffffff)] h-[56px] relative shrink-0 w-full"
        style={{ filter: "drop-shadow(0px 1px 2px var(--shadow-lvl8, rgba(113,113,128,0.08))) drop-shadow(0px 8px 8px var(--shadow-lvl4, rgba(113,113,128,0.04)))" }}
        data-name="Secondary Navigation"
      >
        <div className="-translate-x-1/2 -translate-y-1/2 [word-break:break-word] absolute content-stretch flex gap-[24px] items-start leading-[var(--body-md-regular-line-height,20px)] left-1/2 not-italic text-[length:var(--body-md-regular-size,14px)] top-[calc(50%+0.5px)] whitespace-nowrap" data-name="Menu Items">
          <p className="font-['DM_Sans'] font-semibold relative shrink-0 text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]">My audience</p>
          <p className="font-['DM_Sans'] relative shrink-0 text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)]">Saved audiences</p>
          <p className="font-['DM_Sans'] relative shrink-0 text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)]">Monitor</p>
        </div>
      </div>
    </div>
  );
}

type PageProps = {
  className?: string;
  pageFooter?: boolean;
  swap?: React.ReactNode | null;
};

function Page({ className, pageFooter = false, swap = null }: PageProps) {
  return (
    <div
      className={
        className ||
        "bg-[var(--surface-background-lvl2,#f7f7fa)] content-stretch flex flex-col gap-[var(--spacing-400,32px)] h-[916px] items-start max-w-[767px] overflow-clip pb-0 relative w-full"
      }
      data-name="Page"
    >
      <Navigation className="content-stretch flex flex-col items-start relative shrink-0 w-full" />
      <div className="content-stretch flex flex-[1_0_0] items-start min-h-px overflow-clip pb-[var(--spacing-400,32px)] px-[var(--screen-margin,16px)] relative w-full" data-name="body">
        {swap || (
          <div className="bg-[rgba(209,148,255,0.2)] border border-[var(--colours-blue-300,#d194ff)] border-dashed flex-[1_0_0] h-[700px] min-w-px relative" data-name="Swap Instance" />
        )}
      </div>
      <div className="absolute bottom-0 content-stretch flex flex-col h-[66px] items-start justify-end left-0 right-0">
        {pageFooter && (
          <div
            className="bg-[var(--surface-background-lvl1,#ffffff)] content-center flex flex-wrap gap-[0px_16px] h-[66px] items-center justify-center relative shrink-0 w-full"
            style={{ filter: "drop-shadow(0px -1px 2px var(--shadow-lvl12, rgba(113,113,128,0.12))) drop-shadow(0px -8px 8px var(--shadow-lvl8, rgba(113,113,128,0.08)))" }}
            data-name="Footer - Page"
          >
            <div className="content-stretch flex flex-[1_0_0] gap-[var(--spacing-200,16px)] items-center justify-end min-w-px px-[var(--spacing-200,16px)] py-[var(--spacing-200,16px)] relative" data-name="ActionsRight">
              <div className="content-stretch flex gap-[4px] items-center relative rounded-[var(--radiuses-small,2px)] shrink-0" data-name="Button">
                <p className="[word-break:break-word] font-['DM_Sans'] font-medium leading-[var(--body-md-medium-line-height,20px)] not-italic relative shrink-0 text-[length:var(--body-md-medium-size,14px)] text-[var(--container-dynamic-brand-subtle-foreground-default,#7c33b5)] text-center whitespace-nowrap">
                  Link
                </p>
              </div>
              <div className="border border-[var(--border-dynamic-neutral-bold-default,#4b4b59)] border-solid content-stretch flex gap-0 items-center justify-end px-[12px] py-[7px] relative rounded-[var(--radiuses-small,2px)] shrink-0" data-name="Button">
                <div className="content-stretch flex gap-[4px] items-center justify-center relative rounded-[var(--radiuses-small,2px)] shrink-0">
                  <p className="[word-break:break-word] font-['DM_Sans'] font-medium leading-[var(--body-md-medium-line-height,20px)] not-italic relative shrink-0 text-[length:var(--body-md-medium-size,14px)] text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)] text-center whitespace-nowrap">
                    Default
                  </p>
                </div>
              </div>
              <div className="bg-[var(--container-dynamic-brand-bold-background-default,#7c33b5)] content-stretch flex gap-0 items-center justify-end px-[12px] py-[7px] relative rounded-[var(--radiuses-small,2px)] shrink-0" data-name="Button">
                <div className="content-stretch flex gap-[4px] items-center justify-center relative rounded-[var(--radiuses-small,2px)] shrink-0">
                  <p className="[word-break:break-word] font-['DM_Sans'] font-medium leading-[var(--body-md-medium-line-height,20px)] not-italic relative shrink-0 text-[length:var(--body-md-medium-size,14px)] text-[var(--container-static-brand-bold-foreground,#ffffff)] text-center whitespace-nowrap">
                    Default
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

type Cat = { label: string; src: string; w: string; boxClass: string };

const categories: Cat[] = [
  { label: "Atoms", src: imgCatAtom, w: "w-[74px]", boxClass: "items-center justify-center p-[3px]" },
  { label: "Molecules", src: imgCatMolecule, w: "w-[115px]", boxClass: "items-center p-[3px]" },
  { label: "Organisms", src: imgCatOrganism, w: "w-[122px]", boxClass: "items-center p-[3px]" },
  { label: "Templates", src: imgCatTemplate, w: "w-[118px]", boxClass: "items-center overflow-clip px-[5px] py-[3px]" },
  { label: "Pages", src: imgCatPages, w: "w-[67px]", boxClass: "items-start" },
];

function AtomicCategoryGroup({ active }: { active: string }) {
  return (
    <div className="content-stretch flex flex-wrap gap-[var(--spacing-600,48px)] items-center justify-center relative shrink-0" data-name="Atomic design component category group">
      {categories.map((cat) => {
        const isActive = cat.label === active;
        return (
          <div key={cat.label} className={`content-stretch flex flex-col gap-[5px] items-center relative shrink-0 ${cat.w}`}>
            <div className={`content-stretch flex relative shrink-0 size-[var(--numbers-52,52px)] ${cat.boxClass}`}>
              <div className="flex-[1_0_0] h-full min-w-px relative" data-name="Vector wrap">
                <img alt="" className="absolute block inset-0 max-w-none size-full" src={cat.src} />
              </div>
            </div>
            <p
              className={`[word-break:break-word] font-['DM_Sans'] font-semibold leading-[var(--headline-md-semibold-line-height,32px)] not-italic relative shrink-0 text-[length:var(--headline-md-semibold-size,24px)] tracking-[-0.36px] whitespace-nowrap ${
                isActive ? "text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)]" : "text-[var(--colours-neutral-400,#c6c6cc)]"
              }`}
            >
              {cat.label}
            </p>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Playground configs                                                 */
/* ------------------------------------------------------------------ */

const pageConfig: PlaygroundConfig = {
  name: "Page",
  scopeId: "page/page",
  description:
    "Responsive layout template: navigation + swap instance body, with an optional page footer.",
  controls: [
    { kind: "boolean", name: "footer", label: "Page footer", defaultValue: false },
  ],
  render: (props) => (
    <div className="w-full max-w-[767px]">
      <Page pageFooter={props.footer === true} />
    </div>
  ),
  tokens: {
    "surface/background/lvl2": "var(--surface-background-lvl2)",
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "spacing/400": "var(--spacing-400)",
    "screen/margin": "var(--screen-margin)",
    "colours/blue/300": "var(--colours-blue-300)",
    "container/dynamic/brand/bold/background/default": "var(--container-dynamic-brand-bold-background-default)",
    "border/dynamic/neutral/bold/default": "var(--border-dynamic-neutral-bold-default)",
    "container/dynamic/brand/subtle/foreground/default": "var(--container-dynamic-brand-subtle-foreground-default)",
    "container/static/brand/bold/foreground": "var(--container-static-brand-bold-foreground)",
    "radiuses/small": "var(--radiuses-small)",
  },
};

const navigationConfig: PlaygroundConfig = {
  name: "Navigation",
  scopeId: "page/navigation",
  description:
    "Primary navigation bar (brand, menu, language, avatar) plus the secondary navigation strip.",
  controls: [],
  render: () => (
    <div className="w-full max-w-[767px]">
      <Navigation />
    </div>
  ),
  tokens: {
    "surface/background/miq": "var(--surface-background-miq)",
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "surface/foreground/static/neutral/inversed": "var(--surface-foreground-static-neutral-inversed)",
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "surface/foreground/dynamic/neutral/default/regular": "var(--surface-foreground-dynamic-neutral-default-regular)",
    "gradients/sigma/1": "var(--gradients-sigma-1)",
    "gradients/sigma/2": "var(--gradients-sigma-2)",
    "gradients/sigma/3": "var(--gradients-sigma-3)",
    "radiuses/small": "var(--radiuses-small)",
    "old/radiuses/round": "var(--old-radiuses-round)",
  },
};

const categoryConfig: PlaygroundConfig = {
  name: "Atomic design category",
  scopeId: "page/atomic-design-category",
  description:
    "The atomic-design hierarchy group. Select which category is highlighted as the current level.",
  controls: [
    {
      kind: "select",
      name: "active",
      label: "Active category",
      options: ["Atoms", "Molecules", "Organisms", "Templates", "Pages"],
      defaultValue: "Pages",
      asTabs: true,
    },
  ],
  render: (props) => (
    <div className="w-full overflow-x-auto">
      <AtomicCategoryGroup active={String(props.active)} />
    </div>
  ),
  tokens: {
    "surface/foreground/dynamic/neutral/default/regular": "var(--surface-foreground-dynamic-neutral-default-regular)",
    "colours/neutral/400": "var(--colours-neutral-400)",
    "numbers/52": "var(--numbers-52)",
    "Headline Md/Semibold": "var(--headline-md-semibold-size) / var(--headline-md-semibold-line-height)",
    "spacing/600": "var(--spacing-600)",
  },
};

/* ------------------------------------------------------------------ */
/* Static documentation helpers (unchanged assets/styles)             */
/* ------------------------------------------------------------------ */

function StepScreenshot({ title, aspect, src }: { title: string; aspect: string; src: string }) {
  return (
    <div className="bg-[var(--surface-background-lvl1,#ffffff)] content-stretch flex flex-col gap-[var(--spacing-300,24px)] items-start p-[24px] sm:p-[40px] relative rounded-[28px] shrink-0 w-full">
      <p className="font-['DM_Sans'] font-bold leading-[var(--headline-lg-bold-line-height,36px)] not-italic text-[length:var(--headline-lg-bold-size,28px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] tracking-[-0.56px]">
        {title}
      </p>
      <div className={`${aspect} border border-[var(--border-static-subtle-neutral,#e1e1e8)] border-solid overflow-hidden relative rounded-[26px] shrink-0 w-full`}>
        <img alt={title} className="absolute inset-0 max-w-none object-cover pointer-events-none rounded-[26px] size-full" src={src} />
      </div>
    </div>
  );
}

export default function PagePage(): JSX.Element {
  return (
    <section aria-label="Page component playground" className="flex flex-col gap-6">
      <Playground config={pageConfig} />
      <Playground config={navigationConfig} />
      <Playground config={categoryConfig} />

      {/* Anatomy & usage documentation (reference imagery, unchanged) */}
      <details className="rounded-xl border border-[var(--border-static-subtle-neutral,#e1e1e8)] bg-[var(--surface-background-lvl1,#ffffff)]">
        <summary className="cursor-pointer select-none px-4 py-3 text-[13px] font-semibold text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)]">
          Anatomy &amp; usage guidelines
        </summary>
        <div className="flex flex-col gap-8 px-4 pb-6">
          {/* Introduction */}
          <p className="font-['DM_Sans'] leading-[32px] text-[20px] text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)] tracking-[-0.36px]">
            The page component is used to create responsive layouts and will replace manually created pages using frames.
          </p>

          {/* Anatomy */}
          <div className="flex flex-col gap-4">
            <p className="font-['DM_Sans'] leading-[32px] text-[20px] text-[var(--surface-foreground-static-neutral-lvl2,#282833)]">
              The page component contains the navigation component and a swap instance component that designers replace with
              their content. It has a responsive grid, a <span className="font-semibold">margin variable</span> for horizontal
              padding and <span className="font-semibold">spacing 400 (32px)</span> between the page content and navigation. The
              grid and margins <span className="font-semibold">automatically change</span> according to the selected{" "}
              <span className="font-semibold">responsive mode</span>.
            </p>
            <div className="flex flex-col gap-6">
              <div className="relative overflow-hidden rounded-[40px]">
                <img alt="Mode SM layout" className="block w-full" src={imgScreenshotSm} />
                <p className="absolute font-['DM_Sans'] font-semibold leading-[19px] left-1/2 -translate-x-1/2 not-italic text-[#ea00ad] text-[24px] top-[4%] tracking-[-0.15px]">
                  Mode - SM
                </p>
                <img
                  alt="Mode SM detail"
                  className="absolute right-[2%] top-[3%] w-[20%] rounded-[16px] shadow-[0px_24px_24px_-10px_rgba(0,0,0,0.08)]"
                  src={imgScreenshotSmInset}
                />
              </div>
              <div className="relative overflow-hidden rounded-[40px]">
                <img alt="Mode XL layout" className="block w-full" src={imgScreenshotXl} />
                <p className="absolute font-['DM_Sans'] font-semibold leading-[19px] left-1/2 -translate-x-1/2 not-italic text-[#ea00ad] text-[24px] top-[4%] tracking-[-0.15px]">
                  Mode - XL
                </p>
                <img
                  alt="Mode XL detail"
                  className="absolute right-[2%] top-[3%] w-[20%] rounded-[16px] shadow-[0px_24px_24px_-10px_rgba(0,0,0,0.08)]"
                  src={imgScreenshotXlInset}
                />
              </div>
            </div>
          </div>

          {/* Usage */}
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <p className="font-['DM_Sans'] leading-[32px] text-[20px] text-[var(--surface-foreground-static-neutral-lvl2,#282833)] tracking-[-0.36px]">
                <span className="font-semibold">Step 1.</span> To insert content into the page component, wrap the content in a{" "}
                <span className="font-semibold">component</span> with <span className="font-semibold">auto-layout</span> applied.
                Elements that transform from vertical to horizontal layout should use the{" "}
                <span className="font-semibold">gutter variable</span> as a gap between them.
              </p>
              <StepScreenshot title="Step 1" aspect="aspect-[1985/1347]" src={imgScreenshotStep1} />
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-['DM_Sans'] leading-[32px] text-[20px] text-[var(--surface-foreground-static-neutral-lvl2,#282833)] tracking-[-0.36px]">
                <span className="font-semibold">Step 2.</span> Once the content is a component, it can be replaced with a{" "}
                <span className="font-semibold">Swap Instance frame</span>.
              </p>
              <StepScreenshot title="Step 2" aspect="aspect-[2382/896]" src={imgScreenshotStep2} />
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-['DM_Sans'] leading-[32px] text-[20px] text-[var(--surface-foreground-static-neutral-lvl2,#282833)] tracking-[-0.36px]">
                <span className="font-semibold">Step 3.</span> Now the page can be{" "}
                <span className="font-semibold">duplicated</span> to illustrate designs for larger screens by simply having a{" "}
                <span className="font-semibold">different mode applied to it in the appearance settings</span>. The designs adapt
                and adjust automatically, provided the page content component uses correct auto-layout and variable settings.
              </p>
              <StepScreenshot title="Step 3" aspect="aspect-[2904/1398]" src={imgScreenshotStep3} />
            </div>
          </div>

          {/* Fiber footer mark */}
          <div className="inline-flex flex-col gap-2">
            <div className="h-[2px] w-[33.677px] relative">
              <img alt="" className="absolute inset-0 max-w-none object-cover size-full" src={imgImage1} />
            </div>
            <p className="font-['DM_Sans'] leading-[var(--body-md-regular-line-height,20px)] text-[length:var(--body-md-regular-size,14px)] text-[var(--surface-foreground-static-neutral-lvl3,#717180)]">FIBER DESIGN SYSTEM</p>
            <img alt="" className="mt-1 block w-[300px] max-w-full" src={imgFiberLine} />
          </div>
        </div>
      </details>
    </section>
  );
}
