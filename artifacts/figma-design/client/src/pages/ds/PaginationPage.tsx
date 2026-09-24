import { useState } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

const TOTAL_PAGES = 20;

export type PaginationLabelProps = {
  isDisabled?: boolean;
  isInverted?: boolean;
  labelValue?: string;
};

export function PaginationLabel({
  isDisabled = false,
  isInverted = false,
  labelValue = "x of y",
}: PaginationLabelProps) {
  let textColor =
    "var(--surface-foreground-static-neutral-lvl1, #13131a)";
  if (isDisabled && isInverted) {
    textColor =
      "var(--surface-foreground-dynamic-neutral-inversed-disabled, rgba(255,255,255,0.24))";
  } else if (isDisabled) {
    textColor =
      "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)";
  } else if (isInverted) {
    textColor =
      "var(--surface-foreground-static-neutral-inversed, #ffffff)";
  }

  return (
    <div className="flex items-center justify-end pr-2">
      <p
        className="whitespace-nowrap text-right text-[length:var(--body-md-regular-size,14px)] font-normal leading-[var(--body-md-regular-line-height,20px)] [font-family:'DM_Sans',Helvetica]"
        style={{ color: textColor }}
      >
        {labelValue}
      </p>
    </div>
  );
}

export type PaginationButtonProps = {
  direction: "left" | "right";
  disabled?: boolean;
  onClick?: () => void;
};

export function PaginationButton({ direction, disabled, onClick }: PaginationButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={direction === "left" ? "Previous page" : "Next page"}
      className="flex items-center justify-center rounded-[var(--radius-25,2px)] p-[var(--spacing-container-m,7px)] transition-colors hover:bg-[var(--container-dynamic-neutral-subtle-background-hover,#71718014)] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
    >
      <span className="flex size-5 items-center justify-center p-[2px]">
        <img
          alt=""
          className="block size-5 max-w-none"
          src={`/figmaAssets/pagination/caret-${direction}.svg`}
        />
      </span>
    </button>
  );
}

function Pagination({ total }: { total: number }) {
  const [page, setPage] = useState(1);
  const safeTotal = Math.max(1, total);
  const current = Math.min(page, safeTotal);

  return (
    <div className="flex items-center justify-end">
      <PaginationLabel labelValue={`${current} of ${safeTotal}`} />
      <PaginationButton
        direction="left"
        disabled={current <= 1}
        onClick={() => setPage(() => Math.max(1, current - 1))}
      />
      <PaginationButton
        direction="right"
        disabled={current >= safeTotal}
        onClick={() => setPage(() => Math.min(safeTotal, current + 1))}
      />
    </div>
  );
}

const paginationConfig: PlaygroundConfig = {
  name: "Pagination",
  scopeId: "pagination/pagination",
  description:
    "Molecule — page label with previous/next icon buttons. Fully interactive.",
  controls: [
    {
      kind: "text",
      name: "total",
      label: "Total pages",
      defaultValue: String(TOTAL_PAGES),
      placeholder: "20",
    },
  ],
  render: (props) => {
    const parsed = parseInt(String(props.total), 10);
    const total = Number.isFinite(parsed) && parsed > 0 ? parsed : TOTAL_PAGES;
    // Remount when total changes so internal page resets sensibly.
    return <Pagination key={total} total={total} />;
  },
  tokens: {
    "surface/foreground/static/neutral/lvl1":
      "var(--surface-foreground-static-neutral-lvl1)",
    "surface/foreground/dynamic/neutral/disabled":
      "var(--surface-foreground-dynamic-neutral-disabled)",
    "container/dynamic/neutral/subtle/background/hover":
      "var(--container-dynamic-neutral-subtle-background-hover)",
    "spacing/container/m": "var(--spacing-container-m)",
    "radius/25": "var(--radius-25)",
    "Body Md/Regular": "var(--body-md-regular-size) / var(--body-md-regular-line-height)",
  },
};

const labelConfig: PlaygroundConfig = {
  name: "Pagination Label",
  scopeId: "pagination/pagination-label",
  description:
    "Text label showing current/total pages. Axes: isDisabled, isInverted.",
  controls: [
    {
      kind: "boolean",
      name: "isDisabled",
      label: "isDisabled",
      defaultValue: false,
    },
    {
      kind: "boolean",
      name: "isInverted",
      label: "isInverted",
      defaultValue: false,
    },
    {
      kind: "text",
      name: "labelValue",
      label: "Label text",
      defaultValue: "1 of 20",
      placeholder: "1 of 20",
    },
  ],
  render: (props) => {
    const isInverted = props.isInverted === true;
    return (
      <div
        className="flex items-center justify-end rounded-[5px] px-4 py-3"
        style={{
          backgroundColor: isInverted
            ? "var(--surface-foreground-static-neutral-lvl1, #13131a)"
            : "var(--surface-background-lvl2, #f7f7fa)",
        }}
      >
        <PaginationLabel
          isDisabled={props.isDisabled === true}
          isInverted={isInverted}
          labelValue={String(props.labelValue)}
        />
      </div>
    );
  },
  tokens: {
    "surface/foreground/static/neutral/lvl1":
      "var(--surface-foreground-static-neutral-lvl1)",
    "surface/foreground/dynamic/neutral/disabled":
      "var(--surface-foreground-dynamic-neutral-disabled)",
    "surface/foreground/static/neutral/inversed":
      "var(--surface-foreground-static-neutral-inversed)",
    "surface/foreground/dynamic/neutral/inversed/disabled":
      "var(--surface-foreground-dynamic-neutral-inversed-disabled)",
    "surface/background/lvl2": "var(--surface-background-lvl2)",
  },
};

export default function PaginationPage(): JSX.Element {
  return (
    <section className="flex flex-col gap-6" aria-label="Pagination component">
      <Playground config={paginationConfig} />
      <Playground config={labelConfig} />
    </section>
  );
}
