/* =========================================================================
 * MIQ Collaborative Frameworks — Side Panel (drawer) — reused DS anatomy
 *
 * This replicates the Design System "Side Panel" component defined in the
 * explorer (client/src/pages/ds/SidePanelPage.tsx) so the Prototype Viewer uses
 * the SAME anatomy rather than a bespoke drawer:
 *   - panel bg  = --surface-background-lvl2
 *   - header bar = --surface-background-lvl3, p-16, title (DM Sans Medium,
 *     body-md) + trailing Close action (x-close.svg icon button, p-7, radius
 *     --radiuses-small, brand focus ring)
 *   - the same drop-shadow filter as the DS panel
 *   - size variants 400/600/800 (we default to the LARGE 800 for a workspace)
 *
 * Here it is presented as a right-side slide-over: a fixed overlay dims the
 * page and the panel is pinned to the right edge, full viewport height.
 *
 * COLOR CONVENTION: DS anatomy uses token utility classes verbatim (as in the
 * source component) for pixel-fidelity; new chrome around it uses inline
 * token styles.
 * ========================================================================= */

import { useEffect, useRef, type ReactNode } from "react";

const A = "/figmaAssets/side-panel";

export type SidePanelSize = "400" | "600" | "800";

/** Selector for tabbable elements used by the focus trap. */
const FOCUSABLE =
  'a[href], area[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])';

/** Trailing header Close action — matches DS HeaderActionClose exactly. */
function HeaderActionClose({
  onClose,
  closeRef,
}: {
  onClose: () => void;
  closeRef: React.RefObject<HTMLButtonElement>;
}) {
  return (
    <div className="flex flex-col items-end justify-center shrink-0">
      <button
        ref={closeRef}
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="flex items-center justify-center p-[7px] rounded-[var(--radiuses-small,2px)] shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-dynamic-brand-selected,#7c33b5)]"
      >
        <div className="flex items-center justify-center p-[5px] size-[20px] shrink-0">
          <img alt="Close" className="block size-full max-w-none" src={`${A}/x-close.svg`} />
        </div>
      </button>
    </div>
  );
}

interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  size?: SidePanelSize;
  children: ReactNode;
  /** Optional sticky footer content (DS panel has a footer slot). */
  footer?: ReactNode;
}

/**
 * Right-side slide-over drawer using the DS Side Panel anatomy. Renders nothing
 * when closed. Closes on overlay click and Escape.
 */
export function SidePanel({
  open,
  onClose,
  title,
  subtitle,
  size = "800",
  children,
  footer,
}: SidePanelProps): JSX.Element | null {
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);

  // Keep the latest onClose in a ref so the effect below doesn't re-run (and
  // re-capture the "opener" as an element INSIDE the panel) whenever a parent
  // re-render changes the callback's identity.
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  // Escape-to-close, body scroll lock, focus management + background inert.
  useEffect(() => {
    if (!open) return;

    // 1) Remember the opener so we can restore focus on close. The opener
    //    node may be re-created by a parent re-render before cleanup runs, so
    //    also remember its data-focus-key (if any) to re-query a replacement.
    const opener = document.activeElement as HTMLElement | null;
    const openerKey = opener?.getAttribute("data-focus-key") ?? null;

    // 2) Make everything OUTSIDE the overlay inert + aria-hidden so AT and Tab
    //    can't reach the background while the dialog is open.
    const hidden: HTMLElement[] = [];
    for (const node of Array.from(document.body.children)) {
      const el = node as HTMLElement;
      if (overlayRef.current && el.contains(overlayRef.current)) continue;
      if (el.getAttribute("aria-hidden") !== "true") {
        el.setAttribute("aria-hidden", "true");
        el.setAttribute("inert", "");
        hidden.push(el);
      }
    }

    // 3) Move focus into the panel (the close button).
    const focusTimer = window.setTimeout(() => closeRef.current?.focus(), 0);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCloseRef.current();
        return;
      }
      // 4) Trap Tab within the panel.
      if (e.key === "Tab" && panelRef.current) {
        const focusable = Array.from(
          panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE),
        ).filter((el) => el.offsetParent !== null || el === document.activeElement);
        if (focusable.length === 0) {
          e.preventDefault();
          closeRef.current?.focus();
          return;
        }
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && (active === first || !panelRef.current.contains(active))) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && active === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", onKey);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
      document.body.style.overflow = prevOverflow;
      for (const el of hidden) {
        el.removeAttribute("aria-hidden");
        el.removeAttribute("inert");
      }
      // 5) Restore focus to the opener — after React finishes the closing
      //    re-render (which may replace the opener node). Mouse-driven closes
      //    (X button / overlay) can land focus on <body> after our first
      //    attempt, so retry a few times until the focus sticks.
      const restore = () => {
        const target = opener?.isConnected
          ? opener
          : openerKey
            ? document.querySelector<HTMLElement>(
                `[data-focus-key="${CSS.escape(openerKey)}"]`,
              )
            : null;
        if (target) target.focus();
        return target !== null && document.activeElement === target;
      };
      for (const delay of [0, 50, 150]) {
        window.setTimeout(() => {
          if (document.activeElement === document.body || delay === 0) restore();
        }, delay);
      }
    };
  }, [open]);

  if (!open) return null;

  const widthClass = size === "800" ? "w-[800px]" : size === "600" ? "w-[600px]" : "w-[400px]";

  return (
    <div ref={overlayRef} className="fixed inset-0 z-50 flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        aria-hidden
        onClick={onClose}
      />

      {/* Panel — DS anatomy: lvl2 surface, DS drop-shadow, full-height. */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={`relative flex h-full max-w-full flex-col bg-[var(--surface-background-lvl2,#f7f7fa)] ${widthClass}`}
        style={{
          filter:
            "drop-shadow(0px 1px 2px var(--shadow-lvl8, rgba(113,113,128,0.08))) drop-shadow(0px 8px 8px var(--shadow-lvl4, rgba(113,113,128,0.04)))",
          fontFamily: '"Poppins", "DM Sans", sans-serif',
        }}
      >
        {/* Header bar — DS: lvl3 surface, p-16, title area + close. */}
        <div className="flex w-full items-center gap-[10px] bg-[var(--surface-background-lvl3,#ebebf0)] p-[16px] shrink-0">
          <div className="flex min-w-px flex-1 flex-col items-start gap-1">
            <div className="flex w-full items-center gap-2 shrink-0">
              <div className="flex min-w-0 flex-1 flex-col justify-center overflow-hidden text-ellipsis whitespace-nowrap font-['DM_Sans:Medium',_Helvetica] font-medium text-[length:var(--body-md-medium-size,14px)] text-[var(--surface-foreground-static-neutral-lvl1,#13131a)]">
                <p className="overflow-hidden text-ellipsis leading-[var(--body-md-medium-line-height,20px)]">
                  {title}
                </p>
              </div>
            </div>
            {subtitle && (
              <div className="flex w-full items-start shrink-0">
                <div className="flex min-w-0 flex-1 flex-col justify-center self-stretch overflow-hidden text-ellipsis whitespace-nowrap font-['DM_Sans:Regular',_Helvetica] text-[length:var(--body-sm-regular-size,12px)] text-[var(--surface-foreground-static-neutral-lvl2,#282833)]">
                  <p className="overflow-hidden text-ellipsis leading-[var(--body-sm-regular-line-height,18px)]">
                    {subtitle}
                  </p>
                </div>
              </div>
            )}
          </div>
          <HeaderActionClose onClose={onClose} closeRef={closeRef} />
        </div>

        {/* Body (scrolls) */}
        <div className="min-h-px w-full flex-1 overflow-y-auto">{children}</div>

        {/* Footer slot — DS panel footer drop-shadow. */}
        {footer && (
          <div
            className="flex w-full flex-wrap items-center bg-[var(--surface-background-lvl1,#ffffff)] shrink-0"
            style={{
              filter:
                "drop-shadow(0px -1px 2px var(--shadow-lvl12, rgba(113,113,128,0.12))) drop-shadow(0px -8px 8px var(--shadow-lvl8, rgba(113,113,128,0.08)))",
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
