import * as Dialog from "@radix-ui/react-dialog";
import { useState, ReactNode, forwardRef, InputHTMLAttributes, TextareaHTMLAttributes } from "react";
import { FiberButton } from "./primitives";
import { Loader2 } from "lucide-react";

const ICON_X = "/figmaAssets/modals/icon-x.svg";

export function FiberModal({
  open,
  onOpenChange,
  title,
  children,
  footer,
  busy = false,
  description,
  width = "400px"
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  children: ReactNode;
  footer: ReactNode;
  busy?: boolean;
  description: string;
  width?: string;
}) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm transition-all duration-100 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=open]:animate-in data-[state=open]:fade-in" />
        <Dialog.Content 
          className="fixed left-[50%] top-[50%] z-50 grid translate-x-[-50%] translate-y-[-50%] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
          style={{ width, maxWidth: '90vw' }}
          aria-busy={busy}
        >
          <Dialog.Description className="sr-only">{description}</Dialog.Description>
          <div
            className="flex flex-col items-start min-w-[180px] rounded-[var(--radiuses-small,2px)] w-full"
            style={{
              filter: `drop-shadow(0px 1px 2px var(--shadow-lvl8,rgba(113,113,128,0.08))) drop-shadow(0px 8px 8px var(--shadow-lvl4,rgba(113,113,128,0.04)))`,
            }}
          >
            {/* Header */}
            <div className="flex h-[50px] w-full items-start shrink-0 rounded-t-[var(--radiuses-small,2px)] border-b border-solid border-[var(--border-static-subtle-neutral,#e1e1e8)] bg-[var(--surface-background-lvl1,#ffffff)] pl-4 pr-[11px] py-[13px]">
              <div className="flex flex-1 items-start gap-2 min-w-px">
                <Dialog.Title className="flex flex-1 flex-col items-start min-w-px overflow-hidden self-stretch [word-break:break-word] font-['DM_Sans',Helvetica] font-medium leading-[var(--headline-xs-medium-line-height,24px)] text-[length:var(--headline-xs-medium-size,16px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)] tracking-[-0.08px] w-full m-0">
                  {title}
                </Dialog.Title>
                <Dialog.Close asChild>
                  <ModalCloseButton disabled={busy} />
                </Dialog.Close>
              </div>
            </div>

            {/* Content */}
            <div className="flex w-full flex-col items-start bg-[var(--surface-background-lvl1,#ffffff)] p-4 shrink-0 overflow-y-auto max-h-[70vh]">
              {children}
            </div>

            {/* Footer */}
            <div
              className={`flex w-full flex-wrap items-center justify-center gap-x-4 bg-[var(--surface-background-lvl2,#f7f7fa)] p-4 shrink-0 h-[56px] rounded-b-[var(--radiuses-small,2px)]`}
            >
              <div className="flex flex-1 items-center justify-end gap-4 min-w-px">
                {footer}
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

const ModalCloseButton = forwardRef<HTMLButtonElement, any>((props, ref) => {
  const [hover, setHover] = useState(false);
  return (
    <button
      {...props}
      ref={ref}
      type="button"
      aria-label="Close"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onFocus={() => setHover(true)}
      onBlur={() => setHover(false)}
      className={`flex items-center justify-center p-[5px] shrink-0 size-6 rounded-[var(--radiuses-small,2px)] outline-none transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-[var(--border-dynamic-brand-selected,#7c33b5)] ${props.className || ''}`}
    >
      <span
        aria-hidden
        className="block size-[15px] shrink-0 transition-colors duration-150"
        style={{
          backgroundColor: hover
            ? "var(--surface-foreground-dynamic-neutral-hover,#282833)"
            : "var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)",
          WebkitMaskImage: `url(${ICON_X})`,
          maskImage: `url(${ICON_X})`,
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
          WebkitMaskSize: "contain",
          maskSize: "contain",
        }}
      />
    </button>
  );
});
ModalCloseButton.displayName = "ModalCloseButton";

export const FiberInput = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { error?: boolean }>(
  ({ className = "", error, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    return (
      <input
        ref={ref}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        className={`w-full rounded-[var(--radius-50,4px)] px-[var(--spacing-100,8px)] h-[36px] outline-none text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)] transition-all ${className}`}
        style={{
          fontFamily: '"DM Sans", Helvetica',
          color: "var(--surface-foreground-static-neutral-lvl1, #13131a)",
          backgroundColor: props.disabled 
            ? "var(--container-dynamic-neutral-subtle-background-disabled, #7171801a)"
            : "var(--container-dynamic-neutral-subtle-background-default-regular, #ffffff)",
          border: `1px solid ${
            error 
              ? "var(--border-dynamic-error-default, #da294b)" 
              : focused 
                ? "var(--border-dynamic-brand-selected, #7c33b5)"
                : "var(--border-dynamic-neutral-subtle-default, #c6c6cc)"
          }`,
          boxShadow: focused && !error ? "0 0 0 1px var(--border-dynamic-brand-selected, #7c33b5)" : "none",
        }}
        {...props}
      />
    );
  }
);
FiberInput.displayName = "FiberInput";

export const FiberTextarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }>(
  ({ className = "", error, ...props }, ref) => {
    const [focused, setFocused] = useState(false);
    return (
      <textarea
        ref={ref}
        onFocus={(e) => { setFocused(true); props.onFocus?.(e); }}
        onBlur={(e) => { setFocused(false); props.onBlur?.(e); }}
        className={`w-full rounded-[var(--radius-50,4px)] px-[var(--spacing-100,8px)] py-[var(--spacing-100,8px)] outline-none text-[length:var(--body-md-regular-size,14px)] leading-[var(--body-md-regular-line-height,20px)] transition-all resize-none ${className}`}
        style={{
          fontFamily: '"DM Sans", Helvetica',
          color: "var(--surface-foreground-static-neutral-lvl1, #13131a)",
          backgroundColor: props.disabled 
            ? "var(--container-dynamic-neutral-subtle-background-disabled, #7171801a)"
            : "var(--container-dynamic-neutral-subtle-background-default-regular, #ffffff)",
          border: `1px solid ${
            error 
              ? "var(--border-dynamic-error-default, #da294b)" 
              : focused 
                ? "var(--border-dynamic-brand-selected, #7c33b5)"
                : "var(--border-dynamic-neutral-subtle-default, #c6c6cc)"
          }`,
          boxShadow: focused && !error ? "0 0 0 1px var(--border-dynamic-brand-selected, #7c33b5)" : "none",
        }}
        {...props}
      />
    );
  }
);
FiberTextarea.displayName = "FiberTextarea";

export function FiberGhostButton({
  children,
  onClick,
  disabled = false,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center gap-1 rounded-[var(--radiuses-small,2px)] shrink-0 px-1 py-0.5 outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-dynamic-brand-selected,#7c33b5)] transition-opacity disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer ${className}`}
    >
      <p className="[word-break:break-word] font-['DM_Sans',Helvetica] font-medium leading-[var(--body-md-medium-line-height,20px)] text-[length:var(--body-md-medium-size,14px)] text-[var(--surface-foreground-dynamic-brand-default,#7c33b5)] text-center whitespace-nowrap m-0">
        {children}
      </p>
    </button>
  );
}
