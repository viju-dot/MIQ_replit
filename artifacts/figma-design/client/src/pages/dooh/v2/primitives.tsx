import { useState, useRef, useEffect, CSSProperties, ReactNode } from "react";

export const FONT = '"DM Sans", Helvetica';
export const MUTED = "var(--surface-foreground-dynamic-neutral-default-regular, #717180)";
export const TITLE = "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)";
export const CARD_BG = "var(--surface-background-lvl1, #ffffff)";
export const CARD_SHADOW = "0px 1px 4px 0px var(--shadow-lvl8, rgba(113,113,128,0.08)), 0px 8px 16px 0px var(--shadow-lvl4, rgba(113,113,128,0.04))";
export const GRID = "var(--border-dynamic-neutral-subtle-default, #e1e1e8)";

import { Radio } from "../../ds/RadioPage";

export function FiberRadio({
  selected,
  labelText,
  disabled = false,
  onSelect,
  name,
  value,
}: {
  selected: boolean;
  labelText?: string;
  disabled?: boolean;
  onSelect?: () => void;
  name?: string;
  value?: string;
}) {
  return (
    <label className={`flex gap-2 items-center cursor-pointer ${disabled ? "cursor-not-allowed opacity-50" : ""}`}>
      <input 
        type="radio" 
        className="sr-only peer" 
        checked={selected} 
        disabled={disabled} 
        onChange={() => !disabled && onSelect?.()}
        name={name}
        value={value}
      />
      <div className="peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-[var(--border-dynamic-brand-selected,#7c33b5)] rounded-full">
        <Radio 
          selected={selected} 
          label={false} 
          labelText="" 
          disabled={disabled} 
          dark={false} 
        />
      </div>
      {labelText && (
        <span className="text-[length:var(--body-md-regular-size,14px)] font-[var(--body-md-regular-weight,400)]" style={{ color: disabled ? "var(--surface-foreground-dynamic-neutral-disabled)" : TITLE, fontFamily: 'var(--body-md-regular-family, "DM Sans", Helvetica)' }}>
          {labelText}
        </span>
      )}
    </label>
  );
}

export type Option = { value: string; label: string };

export function SmartCard({
  title,
  subtitle,
  right,
  rightOnDivider = false,
  children,
  ariaLabel,
}: {
  title: string;
  subtitle?: string;
  right?: ReactNode;
  rightOnDivider?: boolean;
  children: ReactNode;
  ariaLabel?: string;
}) {
  return (
    <section
      aria-label={ariaLabel ?? title}
      data-annotate={ariaLabel ?? title}
      className="flex w-full flex-col rounded-[var(--radius-50,4px)]"
      style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW, overflow: "visible" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-[var(--spacing-100,8px)] p-[var(--spacing-200,16px)]"
        style={rightOnDivider ? { paddingBottom: 0, alignItems: "flex-end" } : undefined}>
        <div className="flex min-w-0 flex-col gap-[var(--spacing-25,2px)]"
          style={rightOnDivider ? { paddingBottom: "var(--spacing-200,16px)" } : undefined}>
          <p
            className="text-[length:var(--headline-xs-medium-size,16px)] font-bold leading-[var(--headline-xs-medium-line-height,24px)] tracking-[-0.08px]"
            style={{ fontFamily: FONT, color: TITLE }}
          >
            {title}
          </p>
          {subtitle && (
            <p
              className="text-[length:var(--body-sm-regular-size,12px)] leading-[var(--body-sm-regular-line-height,18px)]"
              style={{ fontFamily: FONT, color: MUTED }}
            >
              {subtitle}
            </p>
          )}
        </div>
        {right && (
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-[var(--spacing-100,8px)]"
            style={rightOnDivider ? { position: "relative", zIndex: 1, marginBottom: -1 } : undefined}>
            {right}
          </div>
        )}
      </div>
      <div
        className="h-0 w-full border-t border-solid"
        style={{ borderColor: GRID }}
      />
      <div className="p-[var(--spacing-200,16px)]">{children}</div>
    </section>
  );
}

import { TabItem, TabItemState } from "@/components/FiberTabItem";

export function TabsBarUnderline({
  options,
  value,
  onChange,
  ariaLabel,
  wrap = true,
}: {
  options: string[];
  value: string;
  onChange: (v: string) => void;
  ariaLabel?: string;
  wrap?: boolean;
}) {
  const [hover, setHover] = useState<string | null>(null);
  return (
    <div className={`flex ${wrap ? "flex-wrap" : "flex-nowrap"}`} role="tablist" aria-label={ariaLabel}>
      {options.map((o) => {
        const selected = o === value;
        const hovered = o === hover;
        const state: TabItemState = selected
          ? hovered
            ? "Hover-selected"
            : "Selected"
          : hovered
            ? "Hover"
            : "Default";
            
        return (
          <button
            key={o}
            type="button"
            role="tab"
            aria-selected={selected}
            onClick={() => onChange(o)}
            onMouseEnter={() => setHover(o)}
            onMouseLeave={() => setHover(null)}
            className="shrink-0 bg-transparent p-0 outline-none cursor-pointer focus-visible:ring-2 focus-visible:ring-[var(--border-dynamic-brand-selected,#7c33b5)] rounded-sm"
          >
            <TabItem label={o} state={state} />
          </button>
        );
      })}
    </div>
  );
}

const BUTTON_FOCUS_RING =
  "0 0 0 2px var(--surface-background-lvl1,#ffffff), 0 0 0 4px var(--border-dynamic-brand-selected,#7c33b5)";

export function FiberButton({
  variant = "solid",
  size = "default",
  children,
  onClick,
  disabled = false,
  loading = false,
  ariaLabel,
  ariaPressed,
  className = "",
}: {
  variant?: "solid" | "outline" | "secondary";
  size?: "default" | "compact";
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
  ariaLabel?: string;
  ariaPressed?: boolean;
  className?: string;
}) {
  const [hover, setHover] = useState(false);
  const [focused, setFocused] = useState(false);
  const inactive = disabled || loading;
  const style: CSSProperties = { fontFamily: FONT };
  if (variant === "solid") {
    style.backgroundColor = inactive
      ? "var(--container-dynamic-neutral-subtle-background-disabled, #7171801a)"
      : hover
        ? "var(--container-dynamic-brand-bold-background-hover, #702ea3)"
        : "var(--container-dynamic-brand-bold-background-default, #7c33b5)";
    style.color = inactive
      ? "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)"
      : "var(--container-dynamic-brand-bold-foreground-default, #ffffff)";
  } else if (variant === "secondary") {
    style.backgroundColor = inactive
      ? "var(--container-dynamic-neutral-subtle-background-disabled, #7171801a)"
      : hover
        ? "var(--container-dynamic-neutral-subtle-background-hover, rgba(113,113,128,0.08))"
        : "var(--surface-background-lvl2, #f7f7fa)";
    style.border = "1px solid var(--border-dynamic-neutral-subtle-default, #e1e1e8)";
    style.color = inactive
      ? "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)"
      : "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)";
  } else {
    style.border = `1px solid ${
      inactive
        ? "var(--border-dynamic-neutral-subtle-default, #c6c6cc)"
        : "var(--border-dynamic-brand-default, #7c33b5)"
    }`;
    style.backgroundColor = !inactive && hover ? "#7c33b514" : "transparent";
    style.color = inactive
      ? "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)"
      : "var(--surface-foreground-dynamic-brand-default, #7c33b5)";
  }
  if (focused && !inactive) style.boxShadow = BUTTON_FOCUS_RING;
  return (
    <button
      type="button"
      disabled={inactive}
      aria-disabled={inactive}
      aria-busy={loading || undefined}
      aria-label={ariaLabel}
      aria-pressed={ariaPressed}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={(e) => setFocused(e.currentTarget.matches(":focus-visible"))}
      onBlur={() => setFocused(false)}
      className={`inline-flex items-center justify-center gap-[var(--numbers-6,6px)] whitespace-nowrap rounded-[var(--radiuses-small,2px)] font-medium outline-none transition-colors duration-150 ${
        size === "compact"
          ? "h-[24px] px-[var(--spacing-100,8px)] py-[3px] text-[length:var(--body-sm-medium-size,12px)] leading-[var(--body-sm-medium-line-height,18px)]"
          : "h-[var(--height-34,34px)] px-[var(--spacing-150,12px)] text-[length:var(--body-md-medium-size,14px)] leading-[var(--body-md-medium-line-height,20px)]"
      } ${
        inactive ? "cursor-not-allowed" : "cursor-pointer active:brightness-95"
      } ${className}`}
      style={style}
    >
      {loading && (
        <span
          aria-hidden
          className="size-[14px] shrink-0 animate-spin rounded-full border-2 border-solid"
          style={{ borderColor: "currentColor", borderTopColor: "transparent" }}
        />
      )}
      {children}
    </button>
  );
}

export function IconButton({
  icon: IconComponent,
  onClick,
  disabled = false,
  ariaLabel,
}: {
  icon: any;
  onClick?: () => void;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const [hover, setHover] = useState(false);
  const inactive = disabled;
  return (
    <button
      type="button"
      disabled={inactive}
      aria-disabled={inactive}
      aria-label={ariaLabel}
      onClick={onClick}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="flex size-8 items-center justify-center rounded-[var(--radius-25,2px)] transition-colors focus:outline-none focus-visible:ring-2"
      style={{
        backgroundColor: hover && !inactive ? "var(--container-dynamic-error-subtle-background-selected, #ffedef)" : "transparent",
        color: hover && !inactive ? "var(--surface-foreground-dynamic-error-default, #da294b)" : "var(--surface-foreground-dynamic-neutral-default-regular, #4b4b59)",
      }}
    >
      <IconComponent size={20} />
    </button>
  );
}

type SearchableDropdownProps = {
  id: string;
  label: string;
  options: Option[];
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  fullWidth?: boolean;
};

export function SearchableDropdown({
  id,
  label,
  value,
  options,
  onChange,
  disabled = false,
  fullWidth = true,
}: SearchableDropdownProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);
  const triggerText = selected?.label ?? "Select…";

  const filtered = options.filter((o) =>
    o.label.toLowerCase().includes(query.toLowerCase()),
  );

  useEffect(() => {
    if (open) {
      setFocusedIndex(filtered.findIndex(o => o.value === value));
    }
  }, [open, query, value]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!open) {
      if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
        setQuery("");
      }
      return;
    }

    if (e.key === "Escape") {
      setOpen(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < filtered.length) {
        onChange(filtered[focusedIndex].value);
        setOpen(false);
      }
    }
  };

  useEffect(() => {
    if (open && focusedIndex >= 0 && listRef.current) {
      const activeEl = listRef.current.children[focusedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: "nearest" });
      }
    }
  }, [focusedIndex, open]);

  return (
    <div
      ref={ref}
      data-annotate={`${label} filter`}
      className={`relative flex flex-col gap-[var(--spacing-50,4px)] ${
        fullWidth ? "w-full" : "min-w-[160px]"
      }`}
      onKeyDown={handleKeyDown}
    >
      <label
        htmlFor={id}
        className="text-[length:var(--body-sm-medium-size,12px)] font-medium leading-[var(--body-sm-medium-line-height,18px)]"
        style={{ fontFamily: FONT, color: MUTED }}
      >
        {label}
      </label>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        disabled={disabled}
        onClick={() => {
          setOpen((o) => !o);
          setQuery("");
        }}
        className="flex items-center justify-between rounded-[var(--radius-50,4px)] disabled:opacity-50 h-[36px] gap-[var(--spacing-100,8px)] px-[var(--spacing-100,8px)] w-full"
        style={{
          backgroundColor:
            "var(--container-dynamic-neutral-subtle-background-default-regular, #ffffff)",
          border: "1px solid var(--border-dynamic-neutral-subtle-default, #c6c6cc)",
        }}
      >
        <span
          className="truncate text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)]"
          style={{ fontFamily: FONT, color: selected ? TITLE : MUTED }}
        >
          {triggerText}
        </span>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M4.5 6L8 9.5L11.5 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {open && (
        <div
          className="absolute left-0 top-[calc(100%+4px)] z-50 flex max-h-[240px] w-full flex-col overflow-hidden rounded-[var(--radius-50,4px)] shadow-lg"
          style={{
            backgroundColor: "var(--surface-background-lvl1, #ffffff)",
            border: "1px solid var(--border-static-subtle-neutral, #e1e1e8)",
          }}
        >
          {options.length > 5 && (
            <div className="p-2 border-b border-[var(--border-dynamic-neutral-subtle-default,#e1e1e8)]">
              <input
                type="text"
                autoFocus
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full text-sm outline-none px-2 py-1 border border-[var(--border-dynamic-neutral-subtle-default,#e1e1e8)] rounded bg-transparent text-[var(--surface-foreground-dynamic-neutral-default-variation,#13131a)]"
              />
            </div>
          )}
          <div className="flex-1 overflow-y-auto outline-none" role="listbox" ref={listRef}>
            {filtered.length === 0 ? (
              <div
                className="p-3 text-center text-[length:var(--body-md-regular-size,14px)]"
                style={{ fontFamily: FONT, color: MUTED }}
              >
                No matches
              </div>
            ) : (
              filtered.map((o, idx) => {
                const sel = o.value === value;
                const isFocused = idx === focusedIndex;
                return (
                  <button
                    key={o.value}
                    role="option"
                    aria-selected={sel}
                    onClick={() => {
                      onChange(o.value);
                      setOpen(false);
                    }}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left focus:outline-none ${isFocused ? 'bg-[var(--container-dynamic-neutral-subtle-background-hover,rgba(113,113,128,0.08))]' : ''}`}
                  >
                    <span
                      className="truncate text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)]"
                      style={{
                        fontFamily: FONT,
                        color: sel ? "var(--surface-foreground-dynamic-brand-default, #7c33b5)" : TITLE,
                        fontWeight: sel ? 500 : 400,
                      }}
                    >
                      {o.label}
                    </span>
                    {sel && (
                       <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3.33331 8.66667L6.66665 12L13.3333 4" stroke="#7c33b5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                       </svg>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

import * as SliderPrimitive from "@radix-ui/react-slider";

export function FiberSlider({
  value,
  min,
  max,
  step = 1,
  onChange,
  disabled = false,
  ariaLabel
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const [interacting, setInteracting] = useState(false);
  const activeMarker = `url(/figmaAssets/slider/marker-discrete-active.svg)`;
  const defaultMarker = `url(/figmaAssets/slider/marker-discrete-default.svg)`;
  const disabledMarker = `url(/figmaAssets/slider/marker-discrete-disabled.svg)`;
  const marker = disabled ? disabledMarker : interacting ? activeMarker : defaultMarker;

  return (
    <SliderPrimitive.Root
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={v => onChange(v[0])}
      disabled={disabled}
      className="relative flex w-full touch-none select-none items-center h-[24px]"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onMouseDown={() => setInteracting(true)}
      onMouseUp={() => setInteracting(false)}
    >
      <SliderPrimitive.Track className={`relative h-[8px] w-full grow overflow-hidden rounded-[var(--radius-50,4px)] ${disabled ? "bg-[var(--controls-background-disabled,rgba(113,113,128,0.1))]" : "bg-[var(--border-static-subtle-neutral,#e1e1e8)]"}`}>
        <SliderPrimitive.Range className={`absolute h-full ${disabled ? "bg-[var(--controls-background-disabled,rgba(113,113,128,0.1))]" : "bg-[var(--controls-background-active,#7c33b5)]"}`} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb 
        aria-label={ariaLabel}
        className="block size-[24px] rounded-full border-none bg-transparent outline-none disabled:pointer-events-none cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-dynamic-brand-selected,#7c33b5)] focus-visible:ring-offset-2"
        style={{ backgroundImage: marker, backgroundSize: '100% 100%' }}
        onFocus={() => setInteracting(true)}
        onBlur={() => setInteracting(false)}
      />
    </SliderPrimitive.Root>
  );
}
