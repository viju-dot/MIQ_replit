import { lazy, type LazyExoticComponent, type ComponentType } from "react";

export interface DsPage {
  slug: string;
  title: string;
  component: LazyExoticComponent<ComponentType>;
  /**
   * Workspace pages take over the full content area (no per-component header
   * chrome or padded playground container). Used by system-level tools such as
   * the Component Rules rule engine rather than component playgrounds.
   */
  workspace?: boolean;
  /**
   * Sidebar grouping key. Defaults to the "Components" list. "System" pins the
   * entry to a dedicated group rendered above the component list.
   */
  group?: "System" | "Components";
}

// Each imported Figma page registers here and automatically appears in the sidebar.
// Keep alphabetical by title.
export const dsPages: DsPage[] = [
  {
    slug: "component-rules",
    title: "Global Rules Library",
    component: lazy(() => import("@/pages/ds/ComponentRulesPage")),
    workspace: true,
    group: "System",
  },
  {
    slug: "accordion",
    title: "Accordion",
    component: lazy(() => import("@/pages/ds/AccordionPage")),
  },
  {
    slug: "action-bar",
    title: "Action Bar",
    component: lazy(() => import("@/pages/ds/ActionBarPage")),
  },
  {
    slug: "bar-chart",
    title: "Bar chart",
    component: lazy(() => import("@/pages/ds/BarChartPage")),
  },
  {
    slug: "badges",
    title: "Badges",
    component: lazy(() => import("@/pages/ds/Badges")),
  },
  {
    slug: "button",
    title: "Button",
    component: lazy(() => import("@/pages/ds/ButtonPage")),
  },
  {
    slug: "button-group",
    title: "Button group",
    component: lazy(() => import("@/pages/ds/ButtonGroupPage")),
  },
  {
    slug: "cards",
    title: "Cards",
    component: lazy(() => import("@/pages/ds/CardsPage")),
  },
  {
    slug: "carousel",
    title: "Carousel",
    component: lazy(() => import("@/pages/ds/CarouselPage")),
  },
  {
    slug: "date-pickers",
    title: "Date Pickers",
    component: lazy(() => import("@/pages/ds/DatePickersPage")),
  },
  {
    slug: "check",
    title: "Check",
    component: lazy(() => import("@/pages/ds/CheckPage")),
  },
  {
    slug: "chip",
    title: "Chip",
    component: lazy(() => import("@/pages/ds/ChipPage")),
  },
  {
    slug: "context-menu",
    title: "Context Menu",
    component: lazy(() => import("@/pages/ds/ContextMenuPage")),
  },
  {
    slug: "dropdowns",
    title: "Drop Down",
    component: lazy(() => import("@/pages/ds/Dropdowns")),
  },
  {
    slug: "drop-zone",
    title: "Drop zone",
    component: lazy(() => import("@/pages/ds/DropZonePage")),
  },
  {
    slug: "empty-state",
    title: "Empty State",
    component: lazy(() => import("@/pages/ds/EmptyStatePage")),
  },
  {
    slug: "flags",
    title: "Flags",
    component: lazy(() => import("@/pages/ds/FlagsPage")),
  },
  {
    slug: "footer",
    title: "Footer",
    component: lazy(() => import("@/pages/ds/FooterPage")),
  },
  {
    slug: "icons",
    title: "Icons",
    component: lazy(() => import("@/pages/ds/IconsPage")),
  },
  {
    slug: "inputs",
    title: "Inputs",
    component: lazy(() => import("@/pages/ds/InputsPage")),
  },
  {
    slug: "list",
    title: "List",
    component: lazy(() => import("@/pages/ds/ListPage")),
  },
  {
    slug: "logos",
    title: "Logos",
    component: lazy(() => import("@/pages/ds/LogosPage")),
  },
  {
    slug: "metrics",
    title: "Metrics",
    component: lazy(() => import("@/pages/ds/MetricsPage")),
  },
  {
    slug: "modals",
    title: "Modals",
    component: lazy(() => import("@/pages/ds/ModalsPage")),
  },
  {
    slug: "multiselect",
    title: "Multiselect",
    component: lazy(() => import("@/pages/ds/MultiselectPage")),
  },
  {
    slug: "navigation",
    title: "Navigation",
    component: lazy(() => import("@/pages/ds/NavigationPage")),
  },
  {
    slug: "notification",
    title: "Notification",
    component: lazy(() => import("@/pages/ds/NotificationPage")),
  },
  {
    slug: "page",
    title: "Page",
    component: lazy(() => import("@/pages/ds/PagePage")),
  },
  {
    slug: "pagination",
    title: "Pagination",
    component: lazy(() => import("@/pages/ds/PaginationPage")),
  },
  {
    slug: "persona-cards",
    title: "Persona cards",
    component: lazy(() => import("@/pages/ds/PersonaCardsPage")),
  },
  {
    slug: "pie-chart",
    title: "Pie chart",
    component: lazy(() => import("@/pages/ds/PieChartPage")),
  },
  {
    slug: "pill",
    title: "Pill",
    component: lazy(() => import("@/pages/ds/PillPage")),
  },
  {
    slug: "progress",
    title: "Progress",
    component: lazy(() => import("@/pages/ds/ProgressPage")),
  },
  {
    slug: "radio",
    title: "Radio",
    component: lazy(() => import("@/pages/ds/RadioPage")),
  },
  {
    slug: "search",
    title: "Search",
    component: lazy(() => import("@/pages/ds/SearchPage")),
  },
  {
    slug: "side-panel",
    title: "Side panel",
    component: lazy(() => import("@/pages/ds/SidePanelPage")),
  },
  {
    slug: "slider",
    title: "Slider",
    component: lazy(() => import("@/pages/ds/SliderPage")),
  },
  {
    slug: "stepper",
    title: "Stepper",
    component: lazy(() => import("@/pages/ds/StepperPage")),
  },
  {
    slug: "tables",
    title: "Tables",
    component: lazy(() => import("@/pages/ds/TablesPage")),
  },
  {
    slug: "tabs",
    title: "Tabs",
    component: lazy(() => import("@/pages/ds/TabsPage")),
  },
  {
    slug: "tile",
    title: "Tile",
    component: lazy(() => import("@/pages/ds/TilePage")),
  },
  {
    slug: "toggle",
    title: "Toggle",
    component: lazy(() => import("@/pages/ds/TogglePage")),
  },
  {
    slug: "tooltip",
    title: "Tooltip",
    component: lazy(() => import("@/pages/ds/TooltipPage")),
  },
];

export function getPage(slug: string): DsPage | undefined {
  return dsPages.find((p) => p.slug === slug);
}
