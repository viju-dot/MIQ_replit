/**
 * Notification page — interactive playground reproduction of the Figma
 * "Notification" page (page node 185:804, design-refs/notification.md).
 *
 * Each distinct component is refactored into a parametric render function and
 * exposed via a shared <Playground/> block:
 *  - Notification Global Banner (State tabs x Type x Close)
 *  - Alert (State tabs x Border x Compact x Description x Close + editable text)
 *  - Notification Card (State tabs: new / read x Hover x editable text)
 *  - Notification Dropdown (Empty toggle)
 *
 * Figma fidelity (colors / spacing / typography / icons / assets) is preserved
 * exactly from the original static reproduction — only the interaction model
 * changed. Tailwind v4 CSS-variable arbitrary values have been replaced with
 * their plain fallback hex values (this project is Tailwind v3).
 */

import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

const ASSET = "/figmaAssets/notification";

/* ------------------------------------------------------------------ */
/* Notification Global Banner                                          */
/* ------------------------------------------------------------------ */

type BannerState = "Good News" | "Informative" | "Bad News" | "Celebratory";
type BannerType = "Standard" | "Paragraph";

const BANNER_BG: Record<BannerState, string> = {
  "Good News":
    "var(--container-static-success-bold-background,#1e8158)",
  Informative: "var(--container-static-info-bold-background,#2360db)",
  "Bad News": "var(--container-static-error-bold-background,#da294b)",
  Celebratory: "var(--surface-background-miq,#2b0030)",
};

const BANNER_ICON: Record<BannerState, string> = {
  "Good News": `${ASSET}/banner-check-circle.svg`,
  Informative: `${ASSET}/banner-info.svg`,
  "Bad News": `${ASSET}/banner-warning.svg`,
  Celebratory: `${ASSET}/banner-confetti.svg`,
};

function GlobalBanner({
  state,
  type,
  close,
  headline,
  body,
}: {
  state: BannerState;
  type: BannerType;
  close: boolean;
  headline: string;
  body: string;
}) {
  return (
    <div
      className="relative flex w-full items-start gap-2 pl-[52px] pr-[19px]"
      style={{
        backgroundColor: BANNER_BG[state],
        paddingTop:
          type === "Paragraph"
            ? "var(--odd-numbers-15-5,15.5px)"
            : "var(--odd-numbers-11-5,11.5px)",
        paddingBottom:
          type === "Paragraph"
            ? "var(--odd-numbers-15-5,15.5px)"
            : "var(--odd-numbers-11-5,11.5px)",
      }}
    >
      {/* Left icon */}
      <div className="absolute left-5 top-[13px] flex size-6 items-center justify-center">
        <img
          alt=""
          className="block max-w-none"
          src={BANNER_ICON[state]}
          style={{ width: "20px", height: "20px" }}
        />
      </div>

      {/* Text */}
      <div className="flex min-w-0 flex-1 flex-col items-start">
        <p className="[word-break:break-word] font-medium text-[length:var(--body-md-medium-size,14px)] leading-[var(--body-md-medium-line-height,20px)] text-[color:var(--container-static-success-bold-foreground,#ffffff)]">
          {headline}
        </p>
        {type === "Paragraph" && (
          <p className="[word-break:break-word] text-[length:var(--body-sm-regular-size,12px)] leading-[var(--body-sm-regular-line-height,18px)] text-[color:var(--container-static-success-bold-foreground,#ffffff)]">
            {body}
          </p>
        )}
      </div>

      {/* Right close icon */}
      {close && (
        <div className="flex size-6 shrink-0 items-center justify-center">
          <img
            alt=""
            className="block max-w-none"
            src={`${ASSET}/banner-close.svg`}
            style={{ width: "15px", height: "15px" }}
          />
        </div>
      )}
    </div>
  );
}

const bannerConfig: PlaygroundConfig = {
  name: "Notification Global Banner",
  description:
    "Full-width page-level banner — Good News / Informative / Bad News / Celebratory, Standard or Paragraph.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Good News", "Informative", "Bad News", "Celebratory"],
      defaultValue: "Good News",
      asTabs: true,
    },
    {
      kind: "select",
      name: "type",
      label: "Type",
      options: ["Standard", "Paragraph"],
      defaultValue: "Standard",
    },
    { kind: "boolean", name: "close", label: "Close icon", defaultValue: true },
    {
      kind: "text",
      name: "headline",
      label: "Headline",
      defaultValue:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.",
    },
    {
      kind: "text",
      name: "body",
      label: "Paragraph body",
      defaultValue:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.",
    },
  ],
  render: (props) => (
    <div className="w-full max-w-[640px]">
      <GlobalBanner
        state={props.state as BannerState}
        type={props.type as BannerType}
        close={props.close === true}
        headline={String(props.headline)}
        body={String(props.body)}
      />
    </div>
  ),
  tokens: {
    "container/static/success/bold/background":
      "var(--container-static-success-bold-background)",
    "container/static/info/bold/background":
      "var(--container-static-info-bold-background)",
    "container/static/error/bold/background":
      "var(--container-static-error-bold-background)",
    "surface/background/miq": "var(--surface-background-miq)",
    "container/static/success/bold/foreground":
      "var(--container-static-success-bold-foreground)",
    "Body Md/Medium": "var(--body-md-medium-size)",
    "Body Sm/Regular": "var(--body-sm-regular-size)",
    "odd_numbers/11-5": "var(--odd-numbers-11-5)",
    "odd_numbers/15-5": "var(--odd-numbers-15-5)",
  },
};

/* ------------------------------------------------------------------ */
/* Alert                                                               */
/* ------------------------------------------------------------------ */

type AlertState = "Danger" | "Info" | "Success" | "Warning";

const ALERT_BORDER: Record<AlertState, string> = {
  Danger: "var(--border-dynamic-error-default,#da294b)",
  Info: "var(--border-dynamic-info-selected,#2360db)",
  Success: "var(--border-dynamic-success-selected,#1e8158)",
  Warning: "var(--border-dynamic-warning-default,#f8c500)",
};

const ALERT_ICON: Record<AlertState, string> = {
  Danger: `${ASSET}/alert-warning.svg`,
  Info: `${ASSET}/alert-info.svg`,
  Success: `${ASSET}/alert-check-circle.svg`,
  Warning: `${ASSET}/alert-warning2.svg`,
};

function AlertIcon({ state }: { state: AlertState }) {
  const isWarn = state === "Warning" || state === "Danger";
  return (
    <div className="flex size-5 shrink-0 items-center justify-center">
      <img
        alt=""
        className="block max-w-none"
        src={ALERT_ICON[state]}
        style={
          isWarn
            ? { width: "17.5px", height: "15.6px" }
            : state === "Success"
              ? { width: "16.25px", height: "16.25px" }
              : { width: "20px", height: "20px" }
        }
      />
    </div>
  );
}

function CloseButton() {
  return (
    <div className="flex shrink-0 items-center justify-center p-0.5">
      <div className="flex size-5 items-center justify-center p-1">
        <img
          alt=""
          className="block size-full max-w-none"
          src={`${ASSET}/alert-close.svg`}
          style={{ width: "12.5px", height: "12.5px" }}
        />
      </div>
    </div>
  );
}

type AlertProps = {
  state: AlertState;
  border: boolean;
  compact: boolean;
  description: boolean;
  headline: string;
  body: string;
  close: boolean;
};

function Alert({
  state,
  border,
  compact,
  description,
  headline,
  body,
  close,
}: AlertProps) {
  const width = description ? 440 : 288;
  const containerStyle: React.CSSProperties = border
    ? {
        border: `1px solid ${ALERT_BORDER[state]}`,
        borderRadius: "var(--radius-25,2px)",
        backgroundColor: "var(--surface-background-lvl1,#ffffff)",
        width,
      }
    : { width: "max-content" };

  const padding = description
    ? "p-5"
    : compact
      ? "px-2 py-0.5"
      : "px-3 py-[7px]";

  return (
    <div
      className={`flex flex-col items-start ${border ? padding : ""}`}
      style={containerStyle}
    >
      {/* Header row: icon + title (+ close) */}
      <div
        className={`flex w-full gap-2 ${
          description ? "items-start" : "items-center"
        }`}
      >
        <AlertIcon state={state} />
        <div className="flex min-w-0 flex-1 flex-col gap-1 overflow-hidden">
          <p className="[word-break:break-word] w-full font-medium text-[length:var(--body-md-medium-size,14px)] leading-[var(--body-md-medium-line-height,20px)] text-[color:var(--surface-foreground-static-neutral-lvl1,#13131a)]">
            {headline}
          </p>
        </div>
        {border && !compact && close && <CloseButton />}
      </div>

      {/* Description body */}
      {description && (
        <div className="flex w-full items-start pl-8 pt-[5px]">
          <p className="[word-break:break-word] min-w-0 flex-1 text-[length:var(--body-md-medium-size,14px)] leading-[var(--body-md-medium-line-height,20px)] text-[color:var(--surface-foreground-static-neutral-lvl1,#13131a)]">
            {body}
          </p>
        </div>
      )}
    </div>
  );
}

const alertConfig: PlaygroundConfig = {
  name: "Alert",
  description:
    "Inline alert — Danger / Info / Success / Warning, with optional border, compact size, description and close.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["Danger", "Info", "Success", "Warning"],
      defaultValue: "Info",
      asTabs: true,
    },
    { kind: "boolean", name: "border", label: "Border", defaultValue: true },
    { kind: "boolean", name: "compact", label: "Compact", defaultValue: false },
    {
      kind: "boolean",
      name: "description",
      label: "Description",
      defaultValue: true,
    },
    { kind: "boolean", name: "close", label: "Close icon", defaultValue: true },
    { kind: "text", name: "headline", label: "Title", defaultValue: "Title" },
    {
      kind: "text",
      name: "body",
      label: "Description text",
      defaultValue:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet.",
    },
  ],
  render: (props) => (
    <Alert
      state={props.state as AlertState}
      border={props.border === true}
      compact={props.compact === true}
      description={props.description === true}
      close={props.close === true}
      headline={String(props.headline)}
      body={String(props.body)}
    />
  ),
  tokens: {
    "border/dynamic/error/default": "var(--border-dynamic-error-default)",
    "border/dynamic/info/selected": "var(--border-dynamic-info-selected)",
    "border/dynamic/success/selected":
      "var(--border-dynamic-success-selected)",
    "border/dynamic/warning/default": "var(--border-dynamic-warning-default)",
    "surface/foreground/static/neutral/lvl1":
      "var(--surface-foreground-static-neutral-lvl1)",
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "radius/25": "var(--radius-25)",
    "Body Md/Medium": "var(--body-md-medium-size)",
  },
};

/* ------------------------------------------------------------------ */
/* Notification Card                                                   */
/* ------------------------------------------------------------------ */

function NotificationCard({
  isNew,
  isHover,
  title,
  body,
}: {
  isNew: boolean;
  isHover: boolean;
  title: string;
  body: string;
}) {
  const isRead = !isNew;

  return (
    <div
      className="flex w-[400px] max-w-full flex-col items-start gap-4 rounded-[var(--radius-25,2px)] border p-[17px]"
      style={{
        borderColor: "var(--border-static-subtle-neutral,#e1e1e8)",
        backgroundColor: isHover
          ? "var(--container-dynamic-neutral-subtle-background-hover,rgba(113,113,128,0.08))"
          : "var(--surface-background-lvl1,#ffffff)",
      }}
    >
      {/* top: icon + title + dots */}
      <div className="relative flex w-full items-center gap-1">
        <div className="flex size-6 shrink-0 items-center justify-center overflow-hidden">
          <img
            alt=""
            className="block size-6 max-w-none"
            src={`${ASSET}/card-info.svg`}
          />
        </div>
        <p className="[word-break:break-word] w-[310px] overflow-hidden text-ellipsis whitespace-nowrap font-medium text-[length:var(--body-md-medium-size,14px)] leading-[var(--body-md-medium-line-height,20px)] text-[color:var(--surface-foreground-static-neutral-lvl1,#13131a)]">
          {title}
        </p>
        <div className="absolute right-0 top-0 flex size-6 items-center justify-center">
          <img
            alt=""
            className="block size-6 max-w-none"
            src={`${ASSET}/card-dots.svg`}
          />
        </div>
      </div>

      {/* body */}
      <div className="flex w-[338px] max-w-full flex-col items-start gap-2">
        <p
          className={`[word-break:break-word] w-full overflow-hidden text-[length:var(--body-md-medium-size,14px)] leading-[var(--body-md-medium-line-height,20px)] text-[color:var(--surface-foreground-static-neutral-lvl1,#13131a)] ${
            isRead ? "font-normal" : "font-medium"
          }`}
        >
          {body}
        </p>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {isNew && (
              <img
                alt=""
                className="block size-2 max-w-none"
                src={`${ASSET}/card-new-dot.svg`}
              />
            )}
            <p className="text-right text-[length:var(--body-sm-regular-size,12px)] leading-[var(--body-sm-regular-line-height,18px)] text-[color:var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)]">
              45m
            </p>
          </div>
          <div className="flex h-[18px] items-center justify-center rounded-[var(--radius-25,2px)] bg-[var(--container-static-neutral-subtle-background,#ebebf0)] px-[3px]">
            <p className="text-center font-medium text-[length:var(--body-sm-regular-size,12px)] leading-[var(--body-sm-regular-line-height,18px)] text-[color:var(--container-static-neutral-subtle-foreground,#4b4b59)]">
              Category
            </p>
          </div>
        </div>
      </div>

      {/* button */}
      <div className="flex w-full justify-end">
        <div className="flex h-6 items-center justify-center gap-1 rounded-[var(--radius-25,2px)] border border-[var(--border-dynamic-brand-default,#7c33b5)] pl-1 pr-1.5 py-[3px]">
          <div className="flex size-5 items-center justify-center p-px">
            <img
              alt=""
              className="block max-w-none"
              src={`${ASSET}/card-download.svg`}
              style={{ width: "17.5px", height: "15.6px" }}
            />
          </div>
          <p className="font-medium text-[length:var(--body-md-medium-size,14px)] leading-[var(--body-md-medium-line-height,20px)] text-[color:var(--surface-foreground-dynamic-brand-default,#7c33b5)]">
            Download report
          </p>
        </div>
      </div>
    </div>
  );
}

const cardConfig: PlaygroundConfig = {
  name: "Notification Card",
  description:
    "Single notification card — new (bold, unread dot) or read, with an optional hover background.",
  controls: [
    {
      kind: "select",
      name: "state",
      label: "State",
      options: ["new", "read"],
      defaultValue: "new",
      asTabs: true,
    },
    { kind: "boolean", name: "hover", label: "Hover", defaultValue: false },
    { kind: "text", name: "title", label: "Title", defaultValue: "Title here" },
    {
      kind: "text",
      name: "body",
      label: "Body",
      defaultValue:
        "Lorem ipsum dolor sit amet tempor consectetur adipiscing elit, sed do.Lorem ipsum dolor sit amet tempor consectetur adipiscing elit, sed do.",
    },
  ],
  render: (props) => (
    <NotificationCard
      isNew={props.state === "new"}
      isHover={props.hover === true}
      title={String(props.title)}
      body={String(props.body)}
    />
  ),
  tokens: {
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "container/dynamic/neutral/subtle/background/hover":
      "var(--container-dynamic-neutral-subtle-background-hover)",
    "surface/foreground/static/neutral/lvl1":
      "var(--surface-foreground-static-neutral-lvl1)",
    "surface/foreground/dynamic/neutral/disabled":
      "var(--surface-foreground-dynamic-neutral-disabled)",
    "container/static/neutral/subtle/background":
      "var(--container-static-neutral-subtle-background)",
    "container/static/neutral/subtle/foreground":
      "var(--container-static-neutral-subtle-foreground)",
    "border/dynamic/brand/default": "var(--border-dynamic-brand-default)",
    "surface/foreground/dynamic/brand/default":
      "var(--surface-foreground-dynamic-brand-default)",
    "radius/25": "var(--radius-25)",
  },
};

/* ------------------------------------------------------------------ */
/* Notification Dropdown                                               */
/* ------------------------------------------------------------------ */

type DropdownRow = {
  title: string;
  body: string;
  time: string;
  category: string;
  unread: boolean;
};

const DROPDOWN_ROWS: DropdownRow[] = [
  {
    title: "Title here",
    body: "Lorem ipsum dolor sit amet tempor consectetur adipiscing elit, sed do.",
    time: "45m",
    category: "Category",
    unread: true,
  },
  {
    title: "Title here",
    body: "Lorem ipsum dolor sit amet tempor consectetur adipiscing elit, sed do.",
    time: "2h",
    category: "Category",
    unread: true,
  },
  {
    title: "Title here",
    body: "Lorem ipsum dolor sit amet tempor consectetur adipiscing elit, sed do.",
    time: "1d",
    category: "Category",
    unread: false,
  },
];

function DropdownFilterPill({
  label,
  width,
}: {
  label: string;
  width?: number;
}) {
  return (
    <div className="flex items-center gap-2" style={{ width }}>
      <p className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[length:var(--body-sm-regular-size,12px)] leading-[var(--body-sm-regular-line-height,18px)] text-[color:var(--container-static-neutral-subtle-foreground,#4b4b59)]">
        {label}
      </p>
      <div className="flex size-5 shrink-0 items-center justify-center">
        <img
          alt=""
          className="block size-5 max-w-none"
          src={`${ASSET}/dd-caret.svg`}
        />
      </div>
    </div>
  );
}

function DropdownRowItem({ row }: { row: DropdownRow }) {
  return (
    <div className="flex w-full flex-col gap-1 border-b border-[var(--border-static-subtle-neutral,#e1e1e8)] px-4 py-3">
      <div className="flex items-center gap-1">
        <img
          alt=""
          className="block size-5 max-w-none"
          src={`${ASSET}/card-info.svg`}
          style={{ width: "20px", height: "20px" }}
        />
        <p className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-medium text-[length:var(--body-md-medium-size,14px)] leading-[var(--body-md-medium-line-height,20px)] text-[color:var(--surface-foreground-static-neutral-lvl1,#13131a)]">
          {row.title}
        </p>
      </div>
      <p
        className={`[word-break:break-word] text-[length:var(--body-md-medium-size,14px)] leading-[var(--body-md-medium-line-height,20px)] text-[color:var(--surface-foreground-static-neutral-lvl1,#13131a)] ${
          row.unread ? "font-medium" : "font-normal"
        }`}
      >
        {row.body}
      </p>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1">
          {row.unread && (
            <img
              alt=""
              className="block size-2 max-w-none"
              src={`${ASSET}/card-new-dot.svg`}
            />
          )}
          <p className="text-[length:var(--body-sm-regular-size,12px)] leading-[var(--body-sm-regular-line-height,18px)] text-[color:var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)]">{row.time}</p>
        </div>
        <div className="flex h-[18px] items-center justify-center rounded-[var(--radius-25,2px)] bg-[var(--container-static-neutral-subtle-background,#ebebf0)] px-[3px]">
          <p className="text-center font-medium text-[length:var(--body-sm-regular-size,12px)] leading-[var(--body-sm-regular-line-height,18px)] text-[color:var(--container-static-neutral-subtle-foreground,#4b4b59)]">
            {row.category}
          </p>
        </div>
      </div>
    </div>
  );
}

function NotificationDropdown({ empty }: { empty: boolean }) {
  return (
    <div className="w-[400px] max-w-full overflow-hidden rounded-[var(--radius-50,4px)] bg-[var(--surface-background-lvl1,#ffffff)] shadow-[0px_1px_2px_rgba(106,76,110,0.08),0px_12px_10px_rgba(106,76,110,0.1)]">
      {/* Header */}
      <div className="flex flex-col gap-4 p-4">
        <p className="font-medium text-[length:var(--headline-md-regular-size,24px)] leading-[var(--headline-md-regular-line-height,32px)] tracking-[-0.36px] text-[color:var(--surface-foreground-static-neutral-lvl1,#13131a)]">
          Notifications
        </p>

        {/* Tabs */}
        <div className="flex items-end gap-4 border-b border-[var(--border-static-subtle-neutral,#e1e1e8)]">
          <div className="flex items-center gap-2 border-b-2 border-[var(--border-dynamic-brand-default,#7c33b5)] px-4 pb-2">
            <p className="text-[length:var(--body-md-medium-size,14px)] leading-[var(--body-md-medium-line-height,20px)] text-[color:var(--surface-foreground-dynamic-brand-default,#7c33b5)]">Tab</p>
          </div>
          <div className="flex items-center gap-2 px-4 pb-2">
            <p className="text-[length:var(--body-md-medium-size,14px)] leading-[var(--body-md-medium-line-height,20px)] text-[color:var(--surface-foreground-static-neutral-lvl1,#13131a)]">Unread</p>
            <div className="flex h-[18px] items-center justify-center rounded-full bg-[var(--container-static-neutral-subtle-background,#ebebf0)] px-2">
              <p className="text-center font-medium text-[length:var(--body-sm-regular-size,12px)] leading-[var(--body-sm-regular-line-height,18px)] text-[color:var(--container-static-neutral-subtle-foreground,#4b4b59)]">
                4
              </p>
            </div>
          </div>
        </div>

        {/* Filter row */}
        <div className="flex items-center justify-between">
          <DropdownFilterPill label="Most Recent" width={102} />
          <DropdownFilterPill label="Mark all as read" />
        </div>
      </div>

      {/* Body */}
      {empty ? (
        <div className="flex flex-col items-center justify-center gap-2 px-4 py-12">
          <img
            alt=""
            className="block size-6 max-w-none opacity-60"
            src={`${ASSET}/card-info.svg`}
          />
          <p className="text-center text-[length:var(--body-md-medium-size,14px)] leading-[var(--body-md-medium-line-height,20px)] text-[color:var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)]">
            No notifications yet
          </p>
        </div>
      ) : (
        <div className="flex flex-col">
          {DROPDOWN_ROWS.map((row, i) => (
            <DropdownRowItem key={i} row={row} />
          ))}
        </div>
      )}
    </div>
  );
}

const dropdownConfig: PlaygroundConfig = {
  name: "Notification Dropdown",
  description:
    "Notifications panel — default list of items or the empty state.",
  controls: [
    {
      kind: "boolean",
      name: "empty",
      label: "Empty state",
      defaultValue: false,
    },
  ],
  render: (props) => <NotificationDropdown empty={props.empty === true} />,
  tokens: {
    "surface/background/lvl1": "var(--surface-background-lvl1)",
    "border/static/subtle/neutral": "var(--border-static-subtle-neutral)",
    "surface/foreground/static/neutral/lvl1":
      "var(--surface-foreground-static-neutral-lvl1)",
    "border/dynamic/brand/default": "var(--border-dynamic-brand-default)",
    "surface/foreground/dynamic/brand/default":
      "var(--surface-foreground-dynamic-brand-default)",
    "surface/foreground/dynamic/neutral/disabled":
      "var(--surface-foreground-dynamic-neutral-disabled)",
    "container/static/neutral/subtle/background":
      "var(--container-static-neutral-subtle-background)",
    "container/static/neutral/subtle/foreground":
      "var(--container-static-neutral-subtle-foreground)",
    "radius/50": "var(--radius-50)",
  },
};

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function NotificationPage(): JSX.Element {
  return (
    <section
      aria-label="Notification component playgrounds"
      className="flex flex-col gap-6"
    >
      <Playground config={bannerConfig} />
      <Playground config={alertConfig} />
      <Playground config={cardConfig} />
      <Playground config={dropdownConfig} />
    </section>
  );
}
