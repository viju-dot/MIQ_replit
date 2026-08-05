import { useMemo, useState } from "react";
import { ChevronDown, ChevronLeft, Code2, SlidersHorizontal } from "lucide-react";
import { useTheme } from "@/lib/theme";
import type { Control, PlaygroundConfig, PropValues } from "./types";

function defaultsOf(controls: Control[]): PropValues {
  const v: PropValues = {};
  for (const c of controls) v[c.name] = c.defaultValue;
  return v;
}

function ControlField({
  control,
  value,
  onChange,
  dark,
}: {
  control: Control;
  value: string | boolean;
  onChange: (v: string | boolean) => void;
  dark: boolean;
}) {
  const labelCls = `block text-[12px] font-medium ${dark ? "text-[#c6c6cc]" : "text-[#4b4b59]"}`;
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
            value === true ? "bg-[#7c33b5]" : dark ? "bg-[#4b4b59]" : "bg-[#c6c6cc]"
          }`}
        >
          <span
            className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
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
          className={`w-full rounded-md border px-2.5 py-1.5 text-[13px] outline-none focus:border-[#7c33b5] ${
            dark
              ? "border-[#4b4b59] bg-[#26262e] text-[#f7f7fa]"
              : "border-[#e1e1e8] bg-white text-[#13131a]"
          }`}
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
          className={`w-full appearance-none rounded-md border px-2.5 py-1.5 pr-8 text-[13px] outline-none focus:border-[#7c33b5] ${
            dark
              ? "border-[#4b4b59] bg-[#26262e] text-[#f7f7fa]"
              : "border-[#e1e1e8] bg-white text-[#13131a]"
          }`}
        >
          {control.options.map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
        </select>
        <ChevronDown
          className={`pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 ${
            dark ? "text-[#a8a8b2]" : "text-[#71717a]"
          }`}
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

  const tabControls = config.controls.filter((c) => c.kind === "select" && c.asTabs) as Extract<
    Control,
    { kind: "select" }
  >[];
  const panelControls = config.controls.filter((c) => !("asTabs" in c && c.asTabs));

  const set = (name: string) => (v: string | boolean) =>
    setValues((cur) => ({ ...cur, [name]: v }));

  const previewBg = dark
    ? config.previewBackground?.dark ?? (config.darkReady ? "#1c1c21" : "#ffffff")
    : config.previewBackground?.light ?? "#ffffff";

  const json = useMemo(() => JSON.stringify(values, null, 2), [values]);

  const cardCls = dark ? "border-[#33333d] bg-[#26262e]" : "border-[#e1e1e8] bg-white";

  return (
    <div className={`overflow-hidden rounded-xl border ${cardCls}`}>
      {/* Header */}
      <div
        className={`flex flex-wrap items-center justify-between gap-2 border-b px-4 py-3 ${
          dark ? "border-[#33333d]" : "border-[#e1e1e8]"
        }`}
      >
        <div>
          <h2 className={`text-[15px] font-semibold ${dark ? "text-[#f7f7fa]" : "text-[#13131a]"}`}>
            {config.name}
          </h2>
          {config.description && (
            <p className={`text-[12px] ${dark ? "text-[#a8a8b2]" : "text-[#71717a]"}`}>
              {config.description}
            </p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setDevMode((d) => !d)}
            className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[12px] font-medium transition-colors ${
              devMode
                ? "border-[#7c33b5] bg-[#f6ebff] text-[#7c33b5]"
                : dark
                  ? "border-[#4b4b59] text-[#c6c6cc] hover:bg-[#33333d]"
                  : "border-[#e1e1e8] text-[#4b4b59] hover:bg-[#f7f7fa]"
            }`}
          >
            <Code2 className="h-3.5 w-3.5" />
            Developer Mode
          </button>
          {panelControls.length > 0 && (
            <button
              type="button"
              onClick={() => setPropsOpen((o) => !o)}
              aria-label={propsOpen ? "Collapse properties" : "Expand properties"}
              className={`flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[12px] font-medium md:hidden ${
                dark ? "border-[#4b4b59] text-[#c6c6cc]" : "border-[#e1e1e8] text-[#4b4b59]"
              }`}
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
          className={`flex flex-wrap items-center gap-1 border-b px-4 pt-2 ${
            dark ? "border-[#33333d]" : "border-[#e1e1e8]"
          }`}
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
                    ? "border-[#7c33b5] text-[#7c33b5]"
                    : `border-transparent ${
                        dark
                          ? "text-[#a8a8b2] hover:text-[#f7f7fa]"
                          : "text-[#71717a] hover:text-[#13131a]"
                      }`
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
            } ${dark ? "border-[#33333d]" : "border-[#e1e1e8]"}`}
          >
            <button
              type="button"
              onClick={() => setPropsOpen((o) => !o)}
              aria-label={propsOpen ? "Collapse properties" : "Expand properties"}
              className={`hidden w-full items-center py-2.5 text-[11px] font-semibold uppercase tracking-wide md:flex ${
                propsOpen ? "justify-between px-4" : "justify-center px-0"
              } ${dark ? "text-[#a8a8b2]" : "text-[#71717a]"}`}
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
                    dark={dark}
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
            <div
              className={`border-t px-4 py-4 text-[12px] ${
                dark
                  ? "border-[#33333d] bg-[#1c1c21] text-[#c6c6cc]"
                  : "border-[#e1e1e8] bg-[#f7f7fa] text-[#4b4b59]"
              }`}
            >
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
                    <div className="overflow-hidden rounded-md border border-black/10">
                      {Object.entries(config.tokens).map(([k, v]) => (
                        <div
                          key={k}
                          className={`flex items-center justify-between gap-3 px-3 py-1.5 font-mono text-[11px] ${
                            dark ? "odd:bg-[#26262e]" : "odd:bg-white"
                          }`}
                        >
                          <span className="truncate">{k}</span>
                          <span className="flex shrink-0 items-center gap-1.5">
                            {/^#|^rgb/.test(v) && (
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
    </div>
  );
}
