/* =========================================================================
 * useAutoHideHeader — floating (auto-hiding) header behaviour
 *
 * The header is NOT sticky. Instead:
 *   • At the top of the page (scroll position within the header's own height)
 *     it sits normally in the document flow, with no shadow — no jump at 0.
 *   • Once you scroll past the header it floats away (hidden): the element is
 *     taken out of flow (position: fixed) and slid up via translateY(-100%),
 *     leaving an in-flow spacer so content below does not jump.
 *   • Hovering a slim invisible zone pinned to the top of the viewport — or
 *     moving the pointer onto the header, or focusing anything inside it —
 *     reveals it again as a floating overlay (slides down, subtle shadow).
 *   • Scrolling back to the top returns it to the normal in-flow state.
 *
 * ROBUSTNESS NOTES (why this shape):
 *   - The scroll position is read from window.scrollY with fallbacks to
 *     document.scrollingElement / documentElement / body, so it works whether
 *     the scrollbar is on <html> or <body>.
 *   - The header height is re-measured on every scroll frame from the live
 *     element (ref), never from stale state, so an early/zero first measure
 *     cannot wedge the state machine.
 *   - All derived flags live in ONE state object updated inside a
 *     requestAnimationFrame tick, so a scroll always triggers a re-render.
 *   - The scroll/resize listeners subscribe ONCE (empty deps) — they never
 *     tear down mid-scroll — and always read live values via refs.
 *
 * No external deps; passive listeners.
 * ========================================================================= */

import { useCallback, useEffect, useRef, useState } from "react";

export interface AutoHideHeader {
  /** Attach to the header element (used to measure its height). */
  headerRef: (node: HTMLElement | null) => void;
  /** True while the page is scrolled to (near) the top → render in-flow. */
  atTop: boolean;
  /** True when the floating header should be shown (hovered / focused). */
  revealed: boolean;
  /** Measured header height in px (0 until first measure). */
  headerHeight: number;
  /**
   * True when the document/viewport (window) is the scroller; false when an
   * inner element owns the scrollbar. Consumers use this to decide whether
   * collapsing the header's reserved in-flow space would shift document
   * content (window) or not (inner scroll coordinate is independent).
   */
  windowScroller: boolean;
  /**
   * Effective render mode:
   *   "inflow"  → at top, normal document flow, no shadow.
   *   "floating"→ scrolled; element is fixed + translated by translateY.
   */
  mode: "inflow" | "floating";
  /** translateY value for the floating element ("0" or "-100%"). */
  translateY: string;
  /** Handlers to spread on the header element (pointer + focus reveal). */
  headerHandlers: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
    onFocusCapture: () => void;
    onBlurCapture: (e: React.FocusEvent<HTMLElement>) => void;
  };
  /** Handlers to spread on the slim top-of-viewport hover zone. */
  hoverZoneHandlers: {
    onMouseEnter: () => void;
    onMouseLeave: () => void;
  };
}

export interface AutoHideHeaderOptions {
  /**
   * Extra px past the header height before it is considered "scrolled".
   * Keeps a small dead-zone so tiny scrolls do not flicker the header.
   */
  threshold?: number;
  /**
   * A value that changes on route/content navigation (e.g. wouter's location).
   * The header persists across navigations, so when this changes we reset the
   * remembered scroll target, re-resolve the scroll parent, and recompute — so
   * a scroll position from the previous page cannot wedge the header hidden on
   * a fresh page rendered at scroll top.
   */
  routeKey?: string;
}

/** Window/document vertical scroll offset (when the viewport itself scrolls). */
function readWindowScrollY(): number {
  if (typeof window === "undefined") return 0;
  const doc = document;
  return (
    window.scrollY ||
    window.pageYOffset ||
    (doc.scrollingElement && doc.scrollingElement.scrollTop) ||
    doc.documentElement.scrollTop ||
    doc.body.scrollTop ||
    0
  );
}

/**
 * The nearest ancestor of `el` that actually scrolls vertically (overflow
 * auto/scroll/overlay with content taller than its box). Returns null when the
 * viewport (window) is the scroller — the common case. This is what determines
 * whether the header scrolls out of view: on pages where an inner container
 * owns the scrollbar (e.g. a flex column with an overflow region), window
 * scrollY stays 0 and we must read that container's scrollTop instead.
 */
function findScrollParent(el: HTMLElement | null): HTMLElement | null {
  if (typeof window === "undefined") return null;
  let node: HTMLElement | null = el?.parentElement ?? null;
  while (node && node !== document.body && node !== document.documentElement) {
    const style = window.getComputedStyle(node);
    const oy = style.overflowY;
    const scrollable = oy === "auto" || oy === "scroll" || oy === "overlay";
    if (scrollable && node.scrollHeight > node.clientHeight) return node;
    node = node.parentElement;
  }
  return null;
}

export function useAutoHideHeader(
  options: AutoHideHeaderOptions = {},
): AutoHideHeader {
  const { threshold = 4, routeKey } = options;

  const elRef = useRef<HTMLElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const mountedRef = useRef(true);
  const roRef = useRef<ResizeObserver | null>(null);
  // Cached scroll parent of the header (null → the window is the scroller).
  const scrollParentRef = useRef<HTMLElement | null>(null);
  const scrollParentResolvedRef = useRef(false);
  // The element that most recently fired a page-scale scroll event — covers
  // scrollers that are NOT ancestors of the header (e.g. a sibling <main> with
  // its own overflow) where findScrollParent would not reach. We keep the
  // ELEMENT (not a cached scrollTop) so we can read its live position and
  // ignore it once it is detached from the document (e.g. after navigation).
  const lastScrollElRef = useRef<HTMLElement | null>(null);

  const [state, setState] = useState<{
    atTop: boolean;
    headerHeight: number;
    windowScroller: boolean;
  }>({
    atTop: true,
    headerHeight: 0,
    windowScroller: false,
  });
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);

  // Current scroll offset from whichever element actually scrolls the header:
  // its nearest scrollable ancestor if any, otherwise the window/document.
  const readScrollY = useCallback((): number => {
    // Resolve the header's scroll parent lazily (once the element exists) and
    // re-resolve if it was not found yet — inner scrollers can appear after
    // async layout.
    if (!scrollParentResolvedRef.current && elRef.current) {
      scrollParentRef.current = findScrollParent(elRef.current);
      scrollParentResolvedRef.current = true;
    }
    // A cached scroll parent that has been detached (e.g. after a route swap)
    // must not contribute; drop it and re-resolve next read.
    let parent = scrollParentRef.current;
    if (parent && !parent.isConnected) {
      parent = null;
      scrollParentRef.current = null;
      scrollParentResolvedRef.current = false;
    }
    const parentTop = parent ? parent.scrollTop : 0;
    // The last page-scale scroller only counts while it is still in the DOM.
    const lastEl = lastScrollElRef.current;
    const lastTop = lastEl && lastEl.isConnected ? lastEl.scrollTop : 0;
    if (lastEl && !lastEl.isConnected) lastScrollElRef.current = null;
    // Take the max so we react to whichever scroller moved, even if the scroll
    // parent detection was momentarily wrong: the header's scroll parent, the
    // window/document, and the last element that fired a scroll event.
    return Math.max(parentTop, readWindowScrollY(), lastTop);
  }, []);

  // Recompute from live DOM values. Called from scroll/resize (rAF-throttled)
  // and once after mount. Reads offsetHeight live so a zero first measure is
  // self-healing on the next frame.
  const compute = useCallback(() => {
    rafRef.current = null;
    if (!mountedRef.current) return;
    const h = elRef.current?.offsetHeight ?? 0;
    const y = readScrollY();
    const nextAtTop = y <= h + threshold;
    // The window is the scroller when the document/viewport itself has scrolled
    // (window scroll > 0). When it stays 0 but we are scrolled, an inner element
    // owns the scrollbar. Consumers use this to decide whether removing in-flow
    // header space would shift document content (window) or not (inner).
    const nextWindowScroller = readWindowScrollY() > 0;
    setState((prev) =>
      prev.atTop === nextAtTop &&
      prev.headerHeight === h &&
      prev.windowScroller === nextWindowScroller
        ? prev
        : { atTop: nextAtTop, headerHeight: h, windowScroller: nextWindowScroller },
    );
  }, [threshold, readScrollY]);

  const schedule = useCallback(() => {
    if (!mountedRef.current) return;
    if (rafRef.current != null) return;
    rafRef.current = requestAnimationFrame(compute);
  }, [compute]);

  // Capture-phase scroll handler: scroll events do not bubble, but a capture
  // listener on document receives them from any scrolling element. Record the
  // target's scrollTop so a scroller that is not an ancestor of the header
  // (e.g. a sibling <main>) still drives the hide/show state.
  const onAnyScroll = useCallback(
    (e: Event) => {
      const t = e.target;
      if (t instanceof HTMLElement) {
        // Only treat "page-scale" scrollers as authoritative: one that wraps
        // the header, or a region at least 60% of the viewport tall. This
        // excludes small widget scrollers (dropdown lists, the sidebar list)
        // whose scrollTop must not drive the header state.
        const el = elRef.current;
        const isPageScale =
          (el != null && t.contains(el)) ||
          t.clientHeight >= window.innerHeight * 0.6;
        if (isPageScale) lastScrollElRef.current = t;
      } else {
        // Document/window scroll → the window is the scroller, not an element.
        lastScrollElRef.current = null;
      }
      schedule();
    },
    [schedule],
  );

  const headerRef = useCallback(
    (node: HTMLElement | null) => {
      elRef.current = node;
      // Re-resolve the scroll parent for the new node on the next read.
      scrollParentResolvedRef.current = false;
      scrollParentRef.current = null;
      // Re-point the ResizeObserver at the current node (a replaced header node
      // must be the one observed).
      const ro = roRef.current;
      if (ro) {
        ro.disconnect();
        if (node) ro.observe(node);
      }
      if (node) {
        // Measure immediately, then again on the next frame in case fonts /
        // async children changed the height after first layout. Route the
        // deferred measure through schedule() so its rAF id is tracked and
        // cancellable on unmount.
        compute();
        schedule();
      }
    },
    [compute, schedule],
  );

  useEffect(() => {
    mountedRef.current = true;
    // Subscribe ONCE. Handlers read live values via refs, so they never go
    // stale and never tear down mid-scroll.
    compute();
    // A couple of deferred re-measures cover late layout (web fonts, images).
    const t1 = window.setTimeout(schedule, 0);
    const t2 = window.setTimeout(schedule, 200);

    window.addEventListener("scroll", onAnyScroll, { passive: true });
    window.addEventListener("resize", schedule);
    document.addEventListener("scroll", onAnyScroll, { passive: true, capture: true });

    if (typeof ResizeObserver !== "undefined") {
      const ro = new ResizeObserver(() => schedule());
      roRef.current = ro;
      if (elRef.current) ro.observe(elRef.current);
    }

    return () => {
      mountedRef.current = false;
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.removeEventListener("scroll", onAnyScroll);
      window.removeEventListener("resize", schedule);
      document.removeEventListener("scroll", onAnyScroll, { capture: true } as EventListenerOptions);
      if (roRef.current) {
        roRef.current.disconnect();
        roRef.current = null;
      }
      if (rafRef.current != null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [compute, schedule, onAnyScroll]);

  // On navigation (routeKey change) the persistent header is reused for fresh
  // content: drop the remembered scroll target, invalidate the cached scroll
  // parent, and recompute so a previous page's scroll position cannot keep the
  // header hidden on a page that renders at scroll top.
  useEffect(() => {
    lastScrollElRef.current = null;
    scrollParentRef.current = null;
    scrollParentResolvedRef.current = false;
    // Recompute now and again after the new route's DOM has committed/laid out
    // (an inner scroll container may appear a frame or two later).
    compute();
    schedule();
    const t1 = window.setTimeout(schedule, 0);
    const t2 = window.setTimeout(schedule, 200);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, [routeKey, compute, schedule]);

  const { atTop, headerHeight, windowScroller } = state;
  const revealed = hovered || focused;
  const mode: "inflow" | "floating" = atTop ? "inflow" : "floating";
  const translateY = atTop || revealed ? "0" : "-100%";

  const headerHandlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
    onFocusCapture: () => setFocused(true),
    onBlurCapture: (e: React.FocusEvent<HTMLElement>) => {
      // Only unfocus when focus truly leaves the header subtree.
      const next = e.relatedTarget as Node | null;
      if (!next || !e.currentTarget.contains(next)) setFocused(false);
    },
  };

  const hoverZoneHandlers = {
    onMouseEnter: () => setHovered(true),
    onMouseLeave: () => setHovered(false),
  };

  return {
    headerRef,
    atTop,
    revealed,
    headerHeight,
    windowScroller,
    mode,
    translateY,
    headerHandlers,
    hoverZoneHandlers,
  };
}
