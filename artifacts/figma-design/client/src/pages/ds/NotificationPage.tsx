/**
 * Notification page — faithful reproduction of the Figma "Notification" page
 * (page node 185:804, design-refs/notification.md).
 *
 * Component groups reproduced:
 *  - Notification Global Banner (Standard / Paragraph x Good News / Informative / Bad News / Celebratory)
 *  - Alert (State x Border x Compact x Description variants)
 *  - Notification Card (new / read / new-hover / read-hover)
 *  - Notification Dropdown (Default with items / Empty)
 *
 * Tailwind v4 CSS-variable arbitrary values from the reference have been
 * replaced with their plain fallback hex values (this project is Tailwind v3).
 * Figma asset URLs were downloaded to /figmaAssets/notification/.
 */

const ASSET = "/figmaAssets/notification";

/* ------------------------------------------------------------------ */
/* Shared helpers                                                      */
/* ------------------------------------------------------------------ */

function Caption({ children }: { children: React.ReactNode }) {
  return <span className="text-[12px] text-[#a8a8b2] px-1">{children}</span>;
}

function GroupCard({
  title,
  children,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="flex flex-col gap-4 rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5">
      <span className="text-[12px] font-medium uppercase tracking-wide text-[#7c33b5]">
        {title}
      </span>
      <div className={className}>{children}</div>
    </div>
  );
}

function VariantBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1">
      <Caption>{label}</Caption>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Notification Global Banner                                          */
/* ------------------------------------------------------------------ */

type BannerState = "Good News" | "Informative" | "Bad News" | "Celebratory";
type BannerType = "Standard" | "Paragraph";

const BANNER_BG: Record<BannerState, string> = {
  "Good News": "#1e8158",
  Informative: "#2360db",
  "Bad News": "#da294b",
  Celebratory: "#2b0030",
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
}: {
  state: BannerState;
  type: BannerType;
}) {
  const showClose = state !== "Bad News"; // Bad News has no right close icon
  return (
    <div
      className="relative flex w-full items-start gap-2 pl-[52px] pr-[19px]"
      style={{
        backgroundColor: BANNER_BG[state],
        paddingTop: type === "Paragraph" ? "15.5px" : "11.5px",
        paddingBottom: type === "Paragraph" ? "15.5px" : "11.5px",
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
        <p className="[word-break:break-word] font-medium text-[14px] leading-[20px] text-white">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
          euismod bibendum laoreet.
        </p>
        {type === "Paragraph" && (
          <p className="[word-break:break-word] text-[12px] leading-[18px] text-white">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean
            euismod bibendum laoreet.
          </p>
        )}
      </div>

      {/* Right close icon */}
      {showClose && (
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

const BANNER_STATES: BannerState[] = [
  "Good News",
  "Informative",
  "Bad News",
  "Celebratory",
];

function GlobalBannerGroup() {
  return (
    <GroupCard title="Notification Global Banner" className="flex flex-col gap-6">
      {(["Paragraph", "Standard"] as BannerType[]).map((type) => (
        <div key={type} className="flex flex-col gap-3">
          <Caption>Type = {type}</Caption>
          <div className="flex flex-col gap-3">
            {BANNER_STATES.map((state) => (
              <div key={state} className="flex flex-col gap-1">
                <Caption>{state}</Caption>
                <GlobalBanner state={state} type={type} />
              </div>
            ))}
          </div>
        </div>
      ))}
    </GroupCard>
  );
}

/* ------------------------------------------------------------------ */
/* Alert                                                               */
/* ------------------------------------------------------------------ */

type AlertState = "Danger" | "Info" | "Success" | "Warning";

const ALERT_BORDER: Record<AlertState, string> = {
  Danger: "#da294b",
  Info: "#2360db",
  Success: "#1e8158",
  Warning: "#f8c500",
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
  headline?: string;
  body?: string;
  close?: boolean;
};

function Alert({
  state,
  border,
  compact,
  description,
  headline = "Title",
  body = "Description",
  close = true,
}: AlertProps) {
  const width = description ? 440 : compact ? 288 : 288;
  const containerStyle: React.CSSProperties = border
    ? {
        border: `1px solid ${ALERT_BORDER[state]}`,
        borderRadius: 2,
        backgroundColor: "white",
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
          <p className="[word-break:break-word] w-full font-medium text-[14px] leading-[20px] text-[#13131a]">
            {headline}
          </p>
        </div>
        {border && !compact && close && <CloseButton />}
      </div>

      {/* Description body */}
      {description && (
        <div className="flex w-full items-start pl-8 pt-[5px]">
          <p className="[word-break:break-word] min-w-0 flex-1 text-[14px] leading-[20px] text-[#13131a]">
            {body}
          </p>
        </div>
      )}
    </div>
  );
}

const ALERT_STATES: AlertState[] = ["Danger", "Info", "Success", "Warning"];

function AlertGroup() {
  return (
    <GroupCard title="Alert" className="flex flex-col gap-6">
      {ALERT_STATES.map((state) => (
        <div key={state} className="flex flex-col gap-2">
          <Caption>State = {state}</Caption>
          <div className="flex flex-wrap items-start gap-6">
            <VariantBlock label="Border, Description">
              <Alert
                state={state}
                border
                compact={false}
                description
                headline="Title"
                body="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean euismod bibendum laoreet."
              />
            </VariantBlock>
            <VariantBlock label="Border, No description">
              <Alert state={state} border compact={false} description={false} />
            </VariantBlock>
            <VariantBlock label="Border, Compact">
              <Alert
                state={state}
                border
                compact
                description={false}
                close={false}
              />
            </VariantBlock>
            <VariantBlock label="No border">
              <Alert
                state={state}
                border={false}
                compact={false}
                description={false}
                close={false}
              />
            </VariantBlock>
            <VariantBlock label="No border, Compact">
              <Alert
                state={state}
                border={false}
                compact
                description={false}
                close={false}
              />
            </VariantBlock>
          </div>
        </div>
      ))}
    </GroupCard>
  );
}

/* ------------------------------------------------------------------ */
/* Notification Card                                                   */
/* ------------------------------------------------------------------ */

type CardStyle = "new" | "read" | "new-hover" | "read-hover";

function NotificationCard({ styleName }: { styleName: CardStyle }) {
  const isNew = styleName === "new" || styleName === "new-hover";
  const isHover = styleName === "new-hover" || styleName === "read-hover";
  const isRead = styleName === "read" || styleName === "read-hover";

  return (
    <div
      className="flex w-[400px] max-w-full flex-col items-start gap-4 rounded-[2px] border p-[17px]"
      style={{
        borderColor: "#e1e1e8",
        backgroundColor: isHover ? "rgba(113,113,128,0.08)" : "white",
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
        <p className="[word-break:break-word] w-[310px] overflow-hidden text-ellipsis whitespace-nowrap font-medium text-[14px] leading-[20px] text-[#13131a]">
          Title here
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
          className={`[word-break:break-word] w-full overflow-hidden text-[14px] leading-[20px] text-[#13131a] ${
            isRead ? "font-normal" : "font-medium"
          }`}
        >
          Lorem ipsum dolor sit amet tempor consectetur adipiscing elit, sed
          do.Lorem ipsum dolor sit amet tempor consectetur adipiscing elit, sed
          do.
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
            <p className="text-right text-[12px] leading-[18px] text-[#a8a8b2]">
              45m
            </p>
          </div>
          <div className="flex h-[18px] items-center justify-center rounded-[2px] bg-[#ebebf0] px-[3px]">
            <p className="text-center font-medium text-[12px] leading-[18px] text-[#4b4b59]">
              Category
            </p>
          </div>
        </div>
      </div>

      {/* button */}
      <div className="flex w-full justify-end">
        <div className="flex h-6 items-center justify-center gap-1 rounded-[2px] border border-[#7c33b5] pl-1 pr-1.5 py-[3px]">
          <div className="flex size-5 items-center justify-center p-px">
            <img
              alt=""
              className="block max-w-none"
              src={`${ASSET}/card-download.svg`}
              style={{ width: "17.5px", height: "15.6px" }}
            />
          </div>
          <p className="font-medium text-[14px] leading-[20px] text-[#7c33b5]">
            Download report
          </p>
        </div>
      </div>
    </div>
  );
}

const CARD_STYLES: { style: CardStyle; label: string }[] = [
  { style: "new", label: "new" },
  { style: "new-hover", label: "new-hover" },
  { style: "read", label: "read" },
  { style: "read-hover", label: "read-hover" },
];

function NotificationCardGroup() {
  return (
    <GroupCard
      title="Notification Card"
      className="flex flex-wrap items-start gap-6"
    >
      {CARD_STYLES.map(({ style, label }) => (
        <VariantBlock key={style} label={`style = ${label}`}>
          <NotificationCard styleName={style} />
        </VariantBlock>
      ))}
    </GroupCard>
  );
}

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
      <p className="min-w-0 flex-1 overflow-hidden text-ellipsis whitespace-nowrap text-[12px] leading-[18px] text-[#4b4b59]">
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
    <div className="flex w-full flex-col gap-1 border-b border-[#e1e1e8] px-4 py-3">
      <div className="flex items-center gap-1">
        <img
          alt=""
          className="block size-5 max-w-none"
          src={`${ASSET}/card-info.svg`}
          style={{ width: "20px", height: "20px" }}
        />
        <p className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap font-medium text-[14px] leading-[20px] text-[#13131a]">
          {row.title}
        </p>
      </div>
      <p
        className={`[word-break:break-word] text-[14px] leading-[20px] text-[#13131a] ${
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
          <p className="text-[12px] leading-[18px] text-[#a8a8b2]">{row.time}</p>
        </div>
        <div className="flex h-[18px] items-center justify-center rounded-[2px] bg-[#ebebf0] px-[3px]">
          <p className="text-center font-medium text-[12px] leading-[18px] text-[#4b4b59]">
            {row.category}
          </p>
        </div>
      </div>
    </div>
  );
}

function NotificationDropdown({ empty }: { empty: boolean }) {
  return (
    <div className="w-[400px] max-w-full overflow-hidden rounded-[4px] bg-white shadow-[0px_1px_2px_rgba(106,76,110,0.08),0px_12px_10px_rgba(106,76,110,0.1)]">
      {/* Header */}
      <div className="flex flex-col gap-4 p-4">
        <p className="font-medium text-[24px] leading-[32px] tracking-[-0.36px] text-[#13131a]">
          Notifications
        </p>

        {/* Tabs */}
        <div className="flex items-end gap-4 border-b border-[#e1e1e8]">
          <div className="flex items-center gap-2 border-b-2 border-[#7c33b5] px-4 pb-2">
            <p className="text-[14px] leading-[20px] text-[#7c33b5]">Tab</p>
          </div>
          <div className="flex items-center gap-2 px-4 pb-2">
            <p className="text-[14px] leading-[20px] text-[#13131a]">Unread</p>
            <div className="flex h-[18px] items-center justify-center rounded-full bg-[#ebebf0] px-2">
              <p className="text-center font-medium text-[12px] leading-[18px] text-[#4b4b59]">
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
          <p className="text-center text-[14px] leading-[20px] text-[#a8a8b2]">
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

function NotificationDropdownGroup() {
  return (
    <GroupCard
      title="Notification Dropdown"
      className="flex flex-wrap items-start gap-6"
    >
      <VariantBlock label="Property 1 = Default">
        <NotificationDropdown empty={false} />
      </VariantBlock>
      <VariantBlock label="Property 1 = Empty">
        <NotificationDropdown empty />
      </VariantBlock>
    </GroupCard>
  );
}

/* ------------------------------------------------------------------ */
/* Page                                                                */
/* ------------------------------------------------------------------ */

export default function NotificationPage(): JSX.Element {
  return (
    <section
      aria-label="Notification components"
      className="flex flex-col gap-6"
    >
      <GlobalBannerGroup />
      <AlertGroup />
      <NotificationCardGroup />
      <NotificationDropdownGroup />
    </section>
  );
}
