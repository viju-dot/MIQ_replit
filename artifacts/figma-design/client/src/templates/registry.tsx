/* =========================================================================
 * Fiber Screen Templates — live component registry
 *
 * Maps each ScreenTemplate id (see lib/screenTemplateStore.ts) to a
 * React.lazy()-loaded LIVE screen component under templates/screens/. The UI
 * (gallery miniatures + detail viewer) renders these real components instead of
 * static screenshots.
 *
 * The screen files are STUBS today; builder agents replace their contents with
 * the real Fiber-composed screens. The registry keys / file mapping stay stable
 * so builders only edit their own screen-<id>.tsx file.
 * ========================================================================= */

import { lazy, type LazyExoticComponent, type ComponentType } from "react";

/** A lazily-loaded, no-props screen component. */
export type TemplateScreenComponent = LazyExoticComponent<ComponentType>;

/**
 * id → lazy screen component. Keys MUST match ScreenTemplate ids in
 * lib/screenTemplateStore.ts. File naming: templates/screens/screen-<id>.tsx,
 * each exporting a default no-props component.
 */
export const TEMPLATE_REGISTRY: Record<string, TemplateScreenComponent> = {
  "60141-191669": lazy(() => import("@/templates/screens/screen-60141-191669")),
  "60948-294415": lazy(() => import("@/templates/screens/screen-60948-294415")),
  "60948-858701": lazy(() => import("@/templates/screens/screen-60948-858701")),
  "61689-177110": lazy(() => import("@/templates/screens/screen-61689-177110")),
  "62298-272589": lazy(() => import("@/templates/screens/screen-62298-272589")),
  "66895-318383": lazy(() => import("@/templates/screens/screen-66895-318383")),
  "67205-212808": lazy(() => import("@/templates/screens/screen-67205-212808")),
  "68993-615950": lazy(() => import("@/templates/screens/screen-68993-615950")),
};

/**
 * Return the lazy live-screen component for a template id, or null when no live
 * implementation is registered for that id.
 */
export function getTemplateComponent(id: string): TemplateScreenComponent | null {
  return TEMPLATE_REGISTRY[id] ?? null;
}

/** Whether a live implementation is registered for the given template id. */
export function hasTemplateComponent(id: string): boolean {
  return id in TEMPLATE_REGISTRY;
}
