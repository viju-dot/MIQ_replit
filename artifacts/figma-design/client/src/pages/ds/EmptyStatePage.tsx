import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig, PropValues } from "@/components/playground/types";

const ASSET = "/figmaAssets/empty-state";

/**
 * Fiber Design System — Empty States page.
 *
 * Faithful reproduction of the Figma "Empty States" page. Figma exposes 11
 * illustration templates driven by the `Template` component property. The
 * composite "Empty State" component pairs one of those illustrations with a
 * heading, description and up to three actions (with optional dot separators).
 *
 * All colours / spacing / typography reference CSS custom properties from
 * tokens.css via var(--token, fallbackHex).
 */

// ----------------------------------------------------------------------------
// Illustration templates (Figma `Template` property values -> asset)
// ----------------------------------------------------------------------------

/** Ordered map keyed by the exact Figma `Template` property name. */
const illustrations = {
  LostInMountains: `${ASSET}/illustration-lost-in-mountains.svg`,
  ScreenLock: `${ASSET}/illustration-screen-lock.svg`,
  "404Mountains": `${ASSET}/illustration-404-mountains.svg`,
  StaringEmpty: `${ASSET}/illustration-staring-empty.svg`,
  Stopwatch: `${ASSET}/illustration-stopwatch.svg`,
  Warning: `${ASSET}/illustration-warning.svg`,
  ScreenExpand: `${ASSET}/illustration-screen-expand.svg`,
  ManAndCharts: `${ASSET}/illustration-man-and-charts.svg`,
  WomanMagnifyingGlass: `${ASSET}/illustration-woman-magnifying-glass.svg`,
  WomanStaring: `${ASSET}/illustration-woman-staring.svg`,
  LaunchAirplane: `${ASSET}/illustration-launch-airplane.svg`,
} as const;

type TemplateName = keyof typeof illustrations;

const TEMPLATE_NAMES = Object.keys(illustrations) as TemplateName[];

const imgButtonIconNeutral = `${ASSET}/button-icon-neutral.svg`;
const imgButtonIconBrand = `${ASSET}/button-icon-brand.svg`;
const imgButtonIconBold = `${ASSET}/button-icon-bold.svg`;
const imgEllipseDot1 = `${ASSET}/ellipse-dot-1.svg`;
const imgEllipseDot2 = `${ASSET}/ellipse-dot-2.svg`;

function ButtonIcon({ src }: { src: string }) {
  return (
    <div className="flex items-center justify-center p-[2px] shrink-0 size-[20px]">
      <div className="relative shrink-0 size-[16.25px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={src} />
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Illustration — a single template thumbnail (used by the composite + gallery)
// ----------------------------------------------------------------------------

function Illustration({ template, size = 200 }: { template: TemplateName; size?: number }) {
  return (
    <div
      className="overflow-clip relative shrink-0"
      data-name={`Illustration=${template}`}
      style={{ width: size, height: size }}
    >
      <img
        alt={template}
        className="absolute block inset-0 max-w-none size-full object-contain"
        src={illustrations[template]}
      />
    </div>
  );
}

// ----------------------------------------------------------------------------
// Empty State composite
// ----------------------------------------------------------------------------

type EmptyStateProps = {
  className?: string;
  actions?: boolean;
  description?: string;
  ellipse1?: boolean;
  ellipse2?: boolean;
  heading?: string;
  illustration?: TemplateName;
  prop1Button?: boolean;
  prop2Button?: boolean;
  prop3Button?: boolean;
};

function EmptyState({
  className,
  actions = true,
  description = "Sorry. You are not authorized to view this page",
  ellipse1 = false,
  ellipse2 = false,
  heading = "Place holder here!",
  illustration = "ScreenLock",
  prop1Button = true,
  prop2Button = true,
  prop3Button = true,
}: EmptyStateProps) {
  return (
    <div
      className={
        className ||
        "flex flex-col items-start min-w-[280px] w-full max-w-[587px]"
      }
      data-name="Empty State"
    >
      <div className="flex flex-col gap-[var(--spacing-300,24px)] items-center w-full">
        {/* Illustration */}
        <Illustration template={illustration} />

        {/* Content */}
        <div className="flex flex-col gap-[var(--spacing-250,20px)] items-center w-full">
          <div className="[word-break:break-word] flex flex-col gap-[var(--spacing-100,8px)] items-center text-center w-full">
            <p className="leading-[var(--headline-md-semibold-line-height,32px)] shrink-0 text-[length:var(--headline-md-semibold-size,24px)] font-medium text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] tracking-[-0.36px] w-full">
              {heading}
            </p>
            <p className="leading-[var(--body-lg-regular-line-height,24px)] shrink-0 text-[length:var(--body-lg-regular-size,16px)] text-[var(--surface-foreground-static-neutral-lvl3,#717180)] tracking-[-0.08px] w-full">
              {description}
            </p>
          </div>

          {actions && (
            <div className="content-center flex flex-wrap gap-[var(--spacing-150,12px)] items-center justify-center w-full">
              {/* Tertiary / neutral outlined button */}
              {prop3Button && (
                <div className="border border-solid border-[var(--border-dynamic-neutral-bold-default,#4b4b59)] flex gap-0 items-center justify-center px-[var(--spacing-150,12px)] py-[var(--spacing-container-m,7px)] rounded-[var(--radius-25,2px)] shrink-0">
                  <div className="flex gap-[var(--spacing-50,4px)] items-center justify-center rounded-[var(--radius-25,2px)] shrink-0">
                    <ButtonIcon src={imgButtonIconNeutral} />
                    <p className="leading-[var(--body-md-medium-line-height,20px)] text-[length:var(--body-md-medium-size,14px)] font-medium text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)] text-center whitespace-nowrap">
                      Default
                    </p>
                    <ButtonIcon src={imgButtonIconNeutral} />
                  </div>
                </div>
              )}

              {ellipse1 && (
                <div className="relative shrink-0 size-[4px]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipseDot1} />
                </div>
              )}

              {/* Secondary / brand outlined button */}
              {prop2Button && (
                <div className="border border-solid border-[var(--border-dynamic-brand-default,#7c33b5)] flex gap-0 items-center justify-center px-[var(--spacing-150,12px)] py-[var(--spacing-container-m,7px)] rounded-[var(--radius-25,2px)] shrink-0">
                  <div className="flex gap-[var(--spacing-50,4px)] items-center justify-center rounded-[var(--radius-25,2px)] shrink-0">
                    <ButtonIcon src={imgButtonIconBrand} />
                    <p className="leading-[var(--body-md-medium-line-height,20px)] text-[length:var(--body-md-medium-size,14px)] font-medium text-[var(--surface-foreground-dynamic-brand-default,#7c33b5)] text-center whitespace-nowrap">
                      Default
                    </p>
                    <ButtonIcon src={imgButtonIconBrand} />
                  </div>
                </div>
              )}

              {ellipse2 && (
                <div className="relative shrink-0 size-[4px]">
                  <img alt="" className="absolute block inset-0 max-w-none size-full" src={imgEllipseDot2} />
                </div>
              )}

              {/* Primary / brand bold button */}
              {prop1Button && (
                <div className="bg-[var(--container-dynamic-brand-bold-background-default,#7c33b5)] flex gap-0 items-center justify-center px-[var(--spacing-150,12px)] py-[var(--spacing-container-m,7px)] rounded-[var(--radius-25,2px)] shrink-0">
                  <div className="flex gap-[var(--spacing-50,4px)] items-center justify-center rounded-[var(--radius-25,2px)] shrink-0">
                    <ButtonIcon src={imgButtonIconBold} />
                    <p className="leading-[var(--body-md-medium-line-height,20px)] text-[length:var(--body-md-medium-size,14px)] font-medium text-[var(--container-dynamic-brand-bold-foreground-default,#ffffff)] text-center whitespace-nowrap">
                      Default
                    </p>
                    <ButtonIcon src={imgButtonIconBold} />
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ----------------------------------------------------------------------------
// Illustrations gallery — all 11 templates
// ----------------------------------------------------------------------------

function IllustrationGallery() {
  return (
    <div className="grid grid-cols-2 gap-[var(--spacing-300,24px)] sm:grid-cols-3 lg:grid-cols-4 w-full">
      {TEMPLATE_NAMES.map((template) => (
        <div
          key={template}
          className="flex flex-col items-center gap-[var(--spacing-150,12px)] p-[var(--spacing-200,16px)] rounded-[var(--radius-100,8px)] border border-solid border-[var(--border-static-subtle-neutral,#e9e9eb)]"
        >
          <Illustration template={template} size={160} />
          <p className="leading-[var(--body-md-medium-line-height,20px)] text-[length:var(--body-md-medium-size,14px)] font-medium text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] text-center whitespace-nowrap">
            {`Template=${template}`}
          </p>
        </div>
      ))}
    </div>
  );
}

// ----------------------------------------------------------------------------
// Playground configs
// ----------------------------------------------------------------------------

const galleryConfig: PlaygroundConfig = {
  name: "Illustrations",
  description:
    "All 11 Figma illustration templates used by Empty States. Each is driven by the composite's `Template` property.",
  controls: [],
  render: () => <IllustrationGallery />,
  tokens: {
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "radius/100": "var(--radius-100)",
    "spacing/300": "var(--spacing-300)",
    "spacing/200": "var(--spacing-200)",
    "spacing/150": "var(--spacing-150)",
  },
};

const config: PlaygroundConfig = {
  name: "Empty State",
  description:
    "Placeholder layout with illustration, heading, description, and up to three actions.",
  controls: [
    {
      kind: "select",
      name: "illustration",
      label: "Template",
      options: TEMPLATE_NAMES.slice(),
      defaultValue: "ScreenLock",
      asTabs: true,
    },
    {
      kind: "text",
      name: "heading",
      label: "Heading",
      defaultValue: "Place holder here!",
      placeholder: "Heading text",
    },
    {
      kind: "text",
      name: "description",
      label: "Description",
      defaultValue: "Sorry. You are not authorized to view this page",
      placeholder: "Description text",
    },
    { kind: "boolean", name: "actions", label: "Show actions", defaultValue: true },
    { kind: "boolean", name: "prop1Button", label: "Primary button", defaultValue: true },
    { kind: "boolean", name: "prop2Button", label: "Secondary button", defaultValue: true },
    { kind: "boolean", name: "prop3Button", label: "Tertiary button", defaultValue: true },
    { kind: "boolean", name: "ellipse1", label: "Dot separator 1", defaultValue: false },
    { kind: "boolean", name: "ellipse2", label: "Dot separator 2", defaultValue: false },
  ],
  render: (props: PropValues) => {
    const template = String(props.illustration) as TemplateName;
    return (
      <EmptyState
        illustration={template in illustrations ? template : "ScreenLock"}
        heading={String(props.heading)}
        description={String(props.description)}
        actions={props.actions === true}
        prop1Button={props.prop1Button === true}
        prop2Button={props.prop2Button === true}
        prop3Button={props.prop3Button === true}
        ellipse1={props.ellipse1 === true}
        ellipse2={props.ellipse2 === true}
      />
    );
  },
  tokens: {
    "container/dynamic/brand/bold/background/default": "var(--container-dynamic-brand-bold-background-default)",
    "container/dynamic/brand/bold/foreground/default": "var(--container-dynamic-brand-bold-foreground-default)",
    "border/dynamic/brand/default": "var(--border-dynamic-brand-default)",
    "border/dynamic/neutral/bold/default": "var(--border-dynamic-neutral-bold-default)",
    "surface/foreground/static/neutral/lvl1": "var(--surface-foreground-static-neutral-lvl1)",
    "surface/foreground/static/neutral/lvl3": "var(--surface-foreground-static-neutral-lvl3)",
    "surface/foreground/dynamic/neutral/default/regular": "var(--surface-foreground-dynamic-neutral-default-regular)",
    "surface/foreground/dynamic/brand/default": "var(--surface-foreground-dynamic-brand-default)",
    "radius/25": "var(--radius-25)",
    "spacing/300": "var(--spacing-300)",
    "spacing/250": "var(--spacing-250)",
    "spacing/150": "var(--spacing-150)",
  },
};

export default function EmptyStatePage(): JSX.Element {
  return (
    <section aria-label="Empty State component playground" className="flex flex-col gap-6">
      <Playground config={galleryConfig} />
      <Playground config={config} />
    </section>
  );
}
