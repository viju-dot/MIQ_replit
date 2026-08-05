import type { ReactNode } from "react";

/** A dynamically generated property control. Only include controls that exist for the component in Figma. */
export type Control =
  | {
      kind: "select";
      name: string;
      label: string;
      options: string[];
      defaultValue: string;
      /** Render as tabs above the preview instead of a dropdown (use for primary variant axes). */
      asTabs?: boolean;
    }
  | { kind: "boolean"; name: string; label: string; defaultValue: boolean }
  | { kind: "text"; name: string; label: string; defaultValue: string; placeholder?: string };

export type PropValues = Record<string, string | boolean>;

export interface PlaygroundConfig {
  /** Component name, e.g. "Button" */
  name: string;
  /** Optional short description shown under the name. */
  description?: string;
  controls: Control[];
  /** Render the component exactly as designed in Figma for the given props/theme. */
  render: (props: PropValues, theme: "light" | "dark") => ReactNode;
  /** Design tokens actually used by this component (name -> value), shown in Developer Mode. */
  tokens?: Record<string, string>;
  /** Force a preview background (defaults to white / #1c1c21 by theme). */
  previewBackground?: { light?: string; dark?: string };
  /**
   * Set true only when render() actually adapts to the dark theme (Figma dark variants).
   * When false/omitted, the preview keeps its light canvas in dark mode so
   * light-only Figma components stay readable and faithful.
   */
  darkReady?: boolean;
}
