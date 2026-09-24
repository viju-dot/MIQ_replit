/* =========================================================================
 * Fiber DS — Metrics Tile (shared component)
 *
 * Extracted from pages/ds/MetricsPage.tsx so the metrics flows and product
 * prototypes (e.g. TV Audience Content Planner V4) render metrics from ONE
 * component instead of bespoke markup.
 *
 * The default anatomy matches the Figma "Metrics Tile": icon, top description,
 * value + name, and a delta badge + bottom description, with Default / Hover /
 * Selected / Disabled states.
 *
 * Optional props extend it for compact analytics tiles WITHOUT forking:
 *   - showIcon:   hide the users icon slots (V4 tiles have no icon).
 *   - unit:       a small suffix rendered after the value (e.g. "min/wk").
 *   - trendIndex: renders an "Index N vs national" line with an up/down arrow,
 *                 green when > 100, red when < 100, neutral at 100 — replacing
 *                 the badge/bottom description row. Preserves index semantics.
 *   - loading:    renders a value skeleton (used during filter cascades).
 * Any of descriptionText / metricsName / badgeText / bottomText left undefined
 * simply omit that slot, so the tile scales from the full DS card down to a
 * label + value + index line.
 *
 * COLOR CONVENTION: token-driven colors via inline style var(--token, #hex).
 * No Tailwind arbitrary var()/rgba color classes for dynamic colors, no JSX
 * generics, no nested interactive controls.
 * ========================================================================= */

import { ArrowUp, ArrowDown, Minus } from "@phosphor-icons/react";

const imgUsersThree = "/figmaAssets/metrics/users-three.svg";
const imgUsersThreeDisabled = "/figmaAssets/metrics/users-three-disabled.svg";

/* ---------------- Users icon ---------------- */

export function UsersIcon({ src = imgUsersThree }: { src?: string }) {
  return (
    <div className="flex flex-col gap-0 items-center justify-center px-0 py-[2px] relative shrink-0 size-[24px]">
      <div className="h-[16.527px] relative shrink-0 w-[22.503px]">
        <img alt="" className="absolute block inset-0 max-w-none size-full" src={src} />
      </div>
    </div>
  );
}

/* ---------------- Metrics Value ---------------- */

export type MetricsValueProps = {
  metricValue?: string;
  size?: "Small" | "Regular" | "Large";
  color?: string;
};

export function MetricsValue({
  metricValue = "8.3% M",
  size = "Small",
  color = "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)",
}: MetricsValueProps) {
  if (size === "Regular") {
    return (
      <div className="flex items-center justify-center relative">
        <p
          className="[word-break:break-word] font-[var(--headline-md-semibold-family,'DM_Sans')] font-semibold leading-[var(--headline-md-semibold-line-height,32px)] not-italic relative shrink-0 text-[length:var(--headline-md-semibold-size,24px)] text-center tracking-[-0.36px] whitespace-nowrap"
          style={{ color }}
        >
          {metricValue}
        </p>
      </div>
    );
  }
  if (size === "Large") {
    return (
      <div className="flex items-center justify-center relative">
        <p
          className="[word-break:break-word] font-[var(--headline-lg-semibold-family,'DM_Sans')] font-semibold leading-[var(--headline-lg-semibold-line-height,36px)] not-italic relative shrink-0 text-[length:var(--headline-lg-semibold-size,28px)] text-center tracking-[-0.56px] whitespace-nowrap"
          style={{ color }}
        >
          {metricValue}
        </p>
      </div>
    );
  }
  return (
    <div className="flex items-center justify-center relative">
      <p
        className="[word-break:break-word] font-[var(--headline-sm-semibold-family,'DM_Sans')] font-semibold leading-[var(--headline-sm-semibold-line-height,28px)] not-italic relative shrink-0 text-[length:var(--headline-sm-semibold-size,20px)] text-center tracking-[-0.2px] w-[68px]"
        style={{ color }}
      >
        {metricValue}
      </p>
    </div>
  );
}

/* ---------------- Metrics Card Content ---------------- */

export type MetricsCardContentProps = {
  descriptionText?: string;
  metricsName?: string;
  metricValue?: string;
  badgeText?: string;
  bottomText?: string;
};

export function MetricsCardContent({
  descriptionText = "text description here",
  metricsName = "metrics name here",
  metricValue = "8.3% M",
  badgeText = "+2.1%",
  bottomText = "text description here",
}: MetricsCardContentProps) {
  return (
    <div className="flex gap-[var(--spacing-75,6px)] items-center p-0 relative">
      <div className="flex flex-col gap-[var(--spacing-75,6px)] items-start relative shrink-0">
        <UsersIcon />
        <div className="flex gap-0 items-center p-0 relative shrink-0 w-full">
          <div className="flex gap-[var(--spacing-100,8px)] items-center p-0 relative shrink-0">
            <p className="[word-break:break-word] font-[var(--body-sm-regular-family,'DM_Sans')] font-normal leading-[var(--body-sm-regular-line-height,18px)] not-italic relative shrink-0 text-[length:var(--body-sm-regular-size,12px)] text-[var(--surface-foreground-dynamic-neutral-default-regular,#717180)] text-center whitespace-nowrap">
              {descriptionText}
            </p>
          </div>
          <UsersIcon />
        </div>
        <div className="flex gap-[var(--spacing-75,6px)] items-end p-0 relative shrink-0">
          <MetricsValue metricValue={metricValue} />
          <div className="flex gap-[var(--spacing-100,8px)] items-center pb-[var(--spacing-25,2px)] pt-0 px-0 relative shrink-0">
            <p className="[word-break:break-word] font-[var(--body-sm-regular-family,'DM_Sans')] font-normal leading-[var(--body-sm-regular-line-height,18px)] not-italic relative shrink-0 text-[length:var(--body-sm-regular-size,12px)] text-[var(--surface-foreground-dynamic-neutral-default-regular,#282833)] text-center whitespace-nowrap">
              {metricsName}
            </p>
          </div>
        </div>
        <div className="flex gap-0 items-center p-0 relative shrink-0 w-full">
          <div className="flex gap-[var(--spacing-100,8px)] items-center relative shrink-0">
            <div className="flex gap-[var(--odd-numbers-10,10px)] items-start p-0 relative rounded-[var(--radiuses-small,2px)] shrink-0">
              <div className="bg-[var(--container-static-success-subtle-background,#e7faef)] flex gap-[var(--spacing-25,2px)] h-[var(--old-sizing-18,18px)] items-center justify-center px-[var(--odd-numbers-3,3px)] py-0 relative rounded-[var(--radiuses-small,2px)] shrink-0">
                <p className="[word-break:break-word] font-[var(--body-sm-medium-family,'DM_Sans')] font-medium leading-[var(--body-sm-medium-line-height,18px)] not-italic relative shrink-0 text-[length:var(--body-sm-medium-size,12px)] text-[var(--container-static-success-subtle-foreground-variation,#115639)] text-center whitespace-nowrap">
                  {badgeText}
                </p>
              </div>
            </div>
            <p className="[word-break:break-word] font-[var(--body-sm-regular-family,'DM_Sans')] font-normal leading-[var(--body-sm-regular-line-height,18px)] not-italic relative shrink-0 text-[length:var(--body-sm-regular-size,12px)] text-[var(--surface-foreground-dynamic-neutral-default-regular,#282833)] text-center whitespace-nowrap">
              {bottomText}
            </p>
          </div>
          <UsersIcon />
        </div>
      </div>
    </div>
  );
}

/* ---------------- Metrics Tile ---------------- */

export type MetricsTileState = "Default" | "Hover" | "Selected" | "Disabled";

export type MetricsTileProps = {
  state?: MetricsTileState;
  descriptionText?: string;
  metricsName?: string;
  metricValue?: string;
  badgeText?: string;
  bottomText?: string;
  /** Hide the users icon slots (analytics tiles have no icon). Default true. */
  showIcon?: boolean;
  /** Small unit suffix rendered after the value (e.g. "min/wk"). */
  unit?: string;
  /** Render an "Index N vs national" line (arrow + green>100/red<100) instead
   *  of the delta badge / bottom-description row. */
  trendIndex?: number | null;
  /** Text shown after the index number. Default "vs national". */
  trendLabel?: string;
  /** Skeleton the value while data loads. */
  loading?: boolean;
  /** Fill available width (grid cells). Default true when used as a card. */
  fullWidth?: boolean;
};

function indexColor(index: number): { fg: string; Arrow: typeof ArrowUp } {
  if (index === 100)
    return { fg: "var(--surface-foreground-static-neutral-lvl3, #717180)", Arrow: Minus };
  if (index > 100)
    return { fg: "var(--container-static-success-subtle-foreground-variation, #115639)", Arrow: ArrowUp };
  return { fg: "var(--surface-foreground-static-error, #da294b)", Arrow: ArrowDown };
}

export function MetricsTile({
  state = "Default",
  descriptionText,
  metricsName,
  metricValue = "8.3% M",
  badgeText,
  bottomText,
  showIcon = true,
  unit,
  trendIndex,
  trendLabel = "vs national",
  loading = false,
  fullWidth = false,
}: MetricsTileProps) {
  const isDisabled = state === "Disabled";
  const isSelected = state === "Selected";
  const isHover = state === "Hover";

  let containerStyle: React.CSSProperties;
  if (isSelected) {
    containerStyle = {
      backgroundColor: "var(--container-dynamic-neutral-subtle-background-default-regular, #ffffff)",
      borderColor: "var(--border-dynamic-brand-selected, #7c33b5)",
    };
  } else if (isDisabled) {
    containerStyle = {
      backgroundColor: "var(--container-dynamic-neutral-subtle-background-disabled, rgba(113,113,128,0.1))",
      borderColor: "var(--border-dynamic-neutral-subtle-default, #c6c6cc)",
    };
  } else if (isHover) {
    containerStyle = {
      backgroundColor: "var(--container-dynamic-neutral-subtle-background-hover, rgba(113,113,128,0.08))",
      borderColor: "var(--border-dynamic-neutral-subtle-default, #c6c6cc)",
    };
  } else {
    containerStyle = {
      backgroundColor: "var(--container-dynamic-neutral-subtle-background-default-regular, #ffffff)",
      borderColor: "var(--border-dynamic-neutral-subtle-default, #c6c6cc)",
    };
  }

  const iconSrc = isDisabled ? imgUsersThreeDisabled : imgUsersThree;
  const labelTopColor = isDisabled
    ? "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)"
    : "var(--surface-foreground-static-neutral-lvl3, #717180)";
  const nameColor = isDisabled
    ? "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)"
    : "var(--surface-foreground-static-neutral-lvl2, #282833)";
  const valueColor = isDisabled
    ? "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)"
    : "var(--surface-foreground-static-neutral-lvl1, #13131a)";
  const badgeBg = isDisabled
    ? "var(--container-dynamic-neutral-subtle-background-disabled, rgba(113,113,128,0.1))"
    : "var(--container-static-success-subtle-background, #e7faef)";
  const badgeTextColor = isDisabled
    ? "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)"
    : "var(--container-static-success-subtle-foreground-variation, #115639)";
  const bottomTextColor = isDisabled
    ? "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)"
    : "var(--surface-foreground-static-neutral-lvl2, #282833)";

  const showTrend = trendIndex != null && !isDisabled;
  const trend = showTrend ? indexColor(trendIndex) : null;
  const TrendArrow = trend?.Arrow ?? Minus;

  return (
    <div
      className={`border border-solid flex gap-[var(--spacing-75,6px)] items-center p-[var(--spacing-200,16px)] relative rounded-[var(--radiuses-small,2px)]${
        fullWidth ? " w-full min-w-0" : ""
      }`}
      style={containerStyle}
    >
      <div className={`flex flex-col gap-[var(--spacing-75,6px)] items-start p-0 relative${fullWidth ? " min-w-0 w-full" : " shrink-0"}`}>
        {/* Top icon */}
        {showIcon && <UsersIcon src={iconSrc} />}

        {/* Context Label Top */}
        {descriptionText != null && (
          <div className="flex gap-0 items-center p-0 relative shrink-0 w-full">
            <div className="flex gap-[var(--spacing-100,8px)] items-center relative shrink-0 min-w-0">
              <p
                className="[word-break:break-word] font-[var(--body-sm-regular-family,'DM_Sans')] font-normal leading-[var(--body-sm-regular-line-height,18px)] not-italic relative shrink min-w-0 truncate text-[length:var(--body-sm-regular-size,12px)]"
                style={{ color: labelTopColor }}
                title={descriptionText}
              >
                {descriptionText}
              </p>
            </div>
            {showIcon && <UsersIcon src={iconSrc} />}
          </div>
        )}

        {/* Value (+ unit) + name */}
        <div className="flex gap-[var(--spacing-75,6px)] items-end p-0 relative shrink-0">
          {loading ? (
            <span
              className="h-[24px] w-[68px] animate-pulse rounded-[var(--radiuses-small,2px)]"
              style={{ backgroundColor: "var(--surface-background-lvl3, #ebebf0)" }}
              aria-hidden
            />
          ) : (
            <MetricsValue color={valueColor} metricValue={metricValue} />
          )}
          {unit != null && !loading && (
            <span
              className="pb-[var(--spacing-25,2px)] text-[length:var(--body-sm-regular-size,12px)] leading-[var(--body-sm-regular-line-height,18px)] whitespace-nowrap"
              style={{ color: labelTopColor }}
            >
              {unit}
            </span>
          )}
          {metricsName != null && (
            <div className="flex gap-0 items-center pb-[var(--spacing-25,2px)] pt-0 px-0 relative shrink-0">
              <p
                className="[word-break:break-word] font-[var(--body-sm-regular-family,'DM_Sans')] font-normal leading-[var(--body-sm-regular-line-height,18px)] not-italic relative shrink-0 text-[length:var(--body-sm-regular-size,12px)] text-center whitespace-nowrap"
                style={{ color: nameColor }}
              >
                {metricsName}
              </p>
            </div>
          )}
        </div>

        {/* Trend line (index) — replaces the badge row when provided */}
        {showTrend && !loading && trend && (
          <span
            className="flex items-center gap-[3px]"
            aria-label={`Index ${trendIndex} ${trendLabel}`}
          >
            <TrendArrow size={12} weight="bold" color={trend.fg} aria-hidden />
            <span
              className="text-[length:var(--body-sm-medium-size,12px)] font-medium leading-[var(--body-sm-medium-line-height,18px)] whitespace-nowrap"
              style={{ color: trend.fg }}
            >
              Index {trendIndex} {trendLabel}
            </span>
          </span>
        )}

        {/* Context Label Bottom (delta badge) — DS default anatomy */}
        {!showTrend && (badgeText != null || bottomText != null) && (
          <div className="flex gap-0 items-center p-0 relative shrink-0 w-full">
            <div className="flex gap-[var(--spacing-100,8px)] items-center p-0 relative shrink-0">
              {badgeText != null && (
                <div className="flex gap-[var(--odd-numbers-10,10px)] items-start relative rounded-[var(--radiuses-small,2px)] shrink-0">
                  <div
                    className="flex gap-[var(--spacing-25,2px)] h-[var(--old-sizing-18,18px)] items-center justify-center px-[var(--odd-numbers-3,3px)] py-0 relative rounded-[var(--radiuses-small,2px)] shrink-0"
                    style={{ backgroundColor: badgeBg }}
                  >
                    <p
                      className="[word-break:break-word] font-[var(--body-sm-medium-family,'DM_Sans')] font-medium leading-[var(--body-sm-medium-line-height,18px)] not-italic relative shrink-0 text-[length:var(--body-sm-medium-size,12px)] text-center whitespace-nowrap"
                      style={{ color: badgeTextColor }}
                    >
                      {badgeText}
                    </p>
                  </div>
                </div>
              )}
              {bottomText != null && (
                <p
                  className="[word-break:break-word] font-[var(--body-sm-regular-family,'DM_Sans')] font-normal leading-[var(--body-sm-regular-line-height,18px)] not-italic relative shrink-0 text-[length:var(--body-sm-regular-size,12px)] text-center whitespace-nowrap"
                  style={{ color: bottomTextColor }}
                >
                  {bottomText}
                </p>
              )}
            </div>
            {showIcon && <UsersIcon src={iconSrc} />}
          </div>
        )}
      </div>
    </div>
  );
}

/* ---------------- Compact Metrics Tile instance ---------------- */

export type MetricsTileCompactProps = {
  metricValue?: string;
  descriptionText?: string;
};

export function MetricsTileCompact({
  metricValue = "8.3% M",
  descriptionText = "text description here",
}: MetricsTileCompactProps) {
  return (
    <div className="bg-[var(--container-dynamic-neutral-subtle-background-default-regular,#ffffff)] border border-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)] border-solid flex gap-[var(--spacing-75,6px)] items-center p-[var(--spacing-200,16px)] relative rounded-[var(--radiuses-small,2px)]">
      <div className="flex flex-col gap-[var(--spacing-75,6px)] items-start p-0 relative shrink-0">
        <div className="flex gap-[var(--spacing-75,6px)] items-end p-0 relative shrink-0">
          <div className="flex items-center justify-center relative shrink-0">
            <p className="[word-break:break-word] font-[var(--headline-sm-semibold-family,'DM_Sans')] font-semibold leading-[var(--headline-sm-semibold-line-height,28px)] not-italic relative shrink-0 text-[length:var(--headline-sm-semibold-size,20px)] text-[var(--surface-foreground-dynamic-neutral-default-variation,#13131a)] text-center tracking-[-0.2px] w-[68px]">
              {metricValue}
            </p>
          </div>
        </div>
        <div className="flex gap-0 items-center p-0 relative shrink-0 w-full">
          <div className="flex gap-[var(--spacing-100,8px)] items-center p-0 relative shrink-0">
            <p className="[word-break:break-word] font-[var(--body-sm-regular-family,'DM_Sans')] font-normal leading-[var(--body-sm-regular-line-height,18px)] not-italic relative shrink-0 text-[length:var(--body-sm-regular-size,12px)] text-[var(--surface-foreground-dynamic-neutral-default-regular,#282833)] text-center whitespace-nowrap">
              {descriptionText}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
