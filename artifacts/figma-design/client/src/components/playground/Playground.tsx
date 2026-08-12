import { useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, Code2, ScrollText, SlidersHorizontal } from "lucide-react";
import { useTheme } from "@/lib/theme";
import type { Control, PlaygroundConfig, PropValues } from "./types";
import { SidePanel } from "@/pages/app/SidePanel";
import { ComponentRulesPanelBody } from "@/components/ComponentRulesPanel";
import { extractComponentMeta } from "@/lib/componentMeta";

/*
 * Playground chrome is token-driven: colors reference Figma variables from
 * tokens.css, so [data-theme="dark"] flips everything automatically.
 */
const surfaceCard = "bg-[var(--surface-background-lvl1,#ffffff)]";
const surfaceSubtle = "bg-[var(--surface-background-lvl2,#f7f7fa)]";
const borderToken = "border-[var(--border-static-subtle-neutral,#e1e1e8)]";
const borderControl = "border-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)]";
const textPrimary = "text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]";
const textBody = "text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)]";
const textMuted = "text-[var(--surface-foreground-static-neutral-lvl3,#717180)]";
const brandText = "text-[var(--surface-foreground-dynamic-brand-default,#7c33b5)]";
const brandBorder = "border-[var(--border-dynamic-brand-selected,#7c33b5)]";
const focusBrand = "focus:border-[var(--border-dynamic-brand-selected,#7c33b5)]";
const hoverSubtle =
  "hover:bg-[var(--container-dynamic-neutral-subtle-background-hover,#71718014)]";

function defaultsOf(controls: Control[]): PropValues {
  const v: PropValues = {};
  for (const c of controls) v[c.name] = c.defaultValue;
  return v;
}

function ControlField({
  control,
  value,
  onChange,
}: {
  control: Control;
  value: string | boolean;
  onChange: (v: string | boolean) => void;
}) {
  const labelCls = `block text-[12px] font-medium ${textBody}`;
  if (control.kind === "boolean") {
    return (
      <label className="flex cursor-pointer items-center justify-between gap-3 py-1">
        <span className={labelCls}>{control.label}</span>
        <button
          type="button"
          role="switch"
          aria-checked={value === true}
          onClick={() => onChange(!(value === true))}
          className={`relative h-5 w-9 shrink-0 rounded-full transition-colors ${
            value === true
              ? "bg-[var(--controls-background-active,#7c33b5)]"
              : "bg-[var(--controls-background-inactive,#c6c6cc)]"
          }`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-[var(--controls-foreground-default,#ffffff)] transition-all ${
              value === true ? "left-[18px]" : "left-0.5"
            }`}
          />
        </button>
      </label>
    );
  }
  if (control.kind === "text") {
    return (
      <div className="space-y-1 py-1">
        <label className={labelCls}>{control.label}</label>
        <input
          type="text"
          value={String(value)}
          placeholder={control.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-md border px-2.5 py-1.5 text-[13px] outline-none ${focusBrand} ${borderControl} ${surfaceCard} ${textPrimary}`}
        />
      </div>
    );
  }
  return (
    <div className="space-y-1 py-1">
      <label className={labelCls}>{control.label}</label>
      <div className="relative">
        <select
          value={String(value)}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full appearance-none rounded-md border px-2.5 py-1.5 pr-8 text-[13px] outline-none ${focusBrand} ${borderControl} ${surfaceCard} ${textPrimary}`}
        >
          {control.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          className={`pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 ${textMuted}`}
        />
      </div>
    </div>
  );
}

export function Playground({ config }: { config: PlaygroundConfig }) {
  const { theme } = useTheme();
  const dark = theme === "dark";
  const [values, setValues] = useState<PropValues>(() => defaultsOf(config.controls));
  const [propsOpen, setPropsOpen] = useState(true);
  const [devMode, setDevMode] = useState(false);
  const [rulesOpen, setRulesOpen] = useState(false);

  // Component metadata for the Component Rules panel is derived from this same
  // config, so the panel only ever shows properties that actually exist here.
  const componentMeta = useMemo(() => extractComponentMeta(config), [config]);

  const tabControls = config.controls.filter((c) => c.kind === "select" && c.asTabs) as Extract<
    Control,
    { kind: "select" }
  >[];
  const panelControls = config.controls.filter((c) => !("asTabs" in c && c.asTabs));

  const set = (name: string) => (v: string | boolean) =>
    setValues((cur) => ({ ...cur, [name]: v }));

  // Token-driven: --surface-background-lvl1 flips automatically with [data-theme]
  const previewBg = dark
    ? config.previewBackground?.dark ?? "var(--surface-background-lvl1, #ffffff)"
    : config.previewBackground?.light ?? "var(--surface-background-lvl1, #ffffff)";

  const json = useMemo(() => JSON.stringify(values, null, 2), [values]);

  return (
    <div className={`overflow-hidden rounded-xl border ${borderToken} ${surfaceCard}`}>
      {/* Header */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3 ${borderToken}`}
      >
        <div>
          <h2 className={`text-[15px] font-semibold ${textPrimary}`}>{config.name}</h2>
          {config.description && (
            <p className={`text-[12px] ${textMuted}`}>{config.description}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDevMode((d) => !d)}
            className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
              devMode
                ? `${brandBorder} bg-[var(--container-dynamic-brand-subtle-background-default,#f6ebff)] ${brandText}`
                : `${borderControl} ${textBody} ${hoverSubtle}`
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            Developer Mode
          </button>
          <button
            type="button"
            onClick={() => setRulesOpen(true)}
            aria-haspopup="dialog"
            className="flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[12px] font-medium transition-colors"
            style={{
              borderColor: "var(--border-dynamic-neutral-subtle-default,#c6c6cc)",
              color: "var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)",
              background: "transparent",
            }}
          >
            <ScrollText className="h-3.5 w-3.5" />
            Component Rules
          </button>
          {panelControls.length > 0 && (
            <button
              type="button"
              onClick={() => setPropsOpen((o) => !o)}
              aria-label={propsOpen ? "Collapse properties" : "Expand properties"}
              className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[12px] font-medium md:hidden ${borderControl} ${textBody}`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Properties
            </button>
          )}
        </div>
      </div>

      {/* Variant tabs */}
      {tabControls.map((tc) => (
        <div
          key={tc.name}
          className={`flex flex-wrap items-center gap-1 border-b px-4 pt-2 ${borderToken}`}
        >
          {tc.options.map((o) => {
            const active = values[tc.name] === o;
            return (
              <button
                key={o}
                type="button"
                onClick={() => set(tc.name)(o)}
                className={`-mb-px border-b-2 px-3 py-2 text-[13px] font-medium transition-colors ${
                  active
                    ? `${brandBorder} ${brandText}`
                    : `border-transparent ${textMuted} hover:text-[var(--surface-foreground-dynamic-neutral-hover,#282833)]`
                }`}
              >
                {o}
              </button>
            );
          })}
        </div>
      ))}

      <div className="flex flex-col md:flex-row">
        {/* Properties panel */}
        {panelControls.length > 0 && (
          <aside
            className={`shrink-0 border-b md:border-b-0 md:border-r ${
              propsOpen ? "md:w-60" : "hidden md:block md:w-9"
            } ${borderToken}`}
          >
            <button
              type="button"
              onClick={() => setPropsOpen((o) => !o)}
              aria-label={propsOpen ? "Collapse properties" : "Expand properties"}
              className={`hidden w-full items-center py-2.5 text-[11px] font-semibold uppercase tracking-wide md:flex ${
                propsOpen ? "justify-between px-4" : "justify-center px-0"
              } ${textMuted}`}
            >
              {propsOpen && "Properties"}
              <ChevronLeft
                className={`h-3.5 w-3.5 transition-transform ${propsOpen ? "" : "rotate-180"}`}
              />
            </button>
            {propsOpen && (
              <div className="space-y-1 px-4 pb-4 pt-2 md:pt-0">
                {panelControls.map((c) => (
                  <ControlField
                    key={c.name}
                    control={c}
                    value={values[c.name]}
                    onChange={set(c.name)}
                  />
                ))}
              </div>
            )}
          </aside>
        )}

        {/* Live preview */}
        <div className="min-w-0 flex-1">
          <div
            className="flex min-h-[260px] items-center justify-center overflow-x-auto p-8 transition-colors"
            style={{ backgroundColor: previewBg }}
          >
            {config.render(values, theme)}
          </div>

          {/* Developer panel */}
          {devMode && (
            <div className={`border-t px-4 py-4 text-[12px] ${borderToken} ${surfaceSubtle} ${textBody}`}>
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide">
                    Props (JSON)
                  </p>
                  <pre className="overflow-x-auto rounded-md bg-black/80 p-3 font-mono text-[11px] leading-relaxed text-[#9ff0b6]">
                    {json}
                  </pre>
                </div>
                {config.tokens && Object.keys(config.tokens).length > 0 && (
                  <div>
                    <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wide">
                      Design Tokens
                    </p>
                    <div className={`overflow-hidden rounded-md border ${borderToken}`}>
                      {Object.entries(config.tokens).map(([k, v]) => (
                        <div
                          key={k}
                          className={`flex items-center justify-between gap-3 px-3 py-1.5 font-mono text-[11px] odd:bg-[var(--surface-background-lvl1,#ffffff)]`}
                        >
                          <span className="truncate">{k}</span>
                          <span className="flex shrink-0 items-center gap-1.5">
                            {/^#|^rgb|^var\(/.test(v) && (
                              <span
                                className="inline-block h-3 w-3 rounded-sm border border-black/20"
                                style={{ backgroundColor: v }}
                              />
                            )}
                            {v}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Component Rules — opens the reusable Fiber Side Panel drawer over the
          current component so rules can be authored while inspecting it. */}
      <SidePanel
        open={rulesOpen}
        onClose={() => setRulesOpen(false)}
        title={`Component Rules — ${config.name}`}
        subtitle="Teach this component how to behave · saved to this component only"
        size="800"
      >
        <ComponentRulesPanelBody meta={componentMeta} />
      </SidePanel>
    </div>
  );
}
