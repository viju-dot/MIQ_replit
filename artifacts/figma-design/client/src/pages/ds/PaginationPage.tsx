import { useState } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

const TOTAL_PAGES = 20;

type PaginationLabelProps = {
  isDisabled?: boolean;
  isInverted?: boolean;
  labelValue?: string;
};

function PaginationLabel({
  isDisabled = false,
  isInverted = false,
  labelValue = "x of y",
}: PaginationLabelProps) {
  let textColor = "#13131a";
  if (isDisabled && isInverted) {
    textColor = "rgba(255,255,255,0.24)";
  } else if (isDisabled) {
    textColor = "#a8a8b2";
  } else if (isInverted) {
    textColor = "#ffffff";
  }

  return (
    <div className="flex items-center justify-end pr-2">
      <p
        className="whitespace-nowrap text-right text-[14px] font-normal leading-[20px] [font-family:'DM_Sans',Helvetica]"
        style={{ color: textColor }}
      >
        {labelValue}
      </p>
    </div>
  );
}

type PaginationButtonProps = {
  direction: "left" | "right";
  disabled?: boolean;
  onClick?: () => void;
};

function PaginationButton({ direction, disabled, onClick }: PaginationButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      aria-label={direction === "left" ? "Previous page" : "Next page"}
      className="flex items-center justify-center rounded-[2px] p-[7px] transition-colors hover:bg-[#71718014] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent"
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
    "text/label/default": "#13131a",
    "text/label/disabled": "#a8a8b2",
    "container/button/hover": "#71718014",
    "size/button": "20px (icon), 7px padding",
    "radius/button": "2px",
    "typography/label": "DM Sans 14/20",
  },
};

const labelConfig: PlaygroundConfig = {
  name: "Pagination Label",
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
        style={{ backgroundColor: isInverted ? "#13131a" : "#f7f7fa" }}
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
    "text/default": "#13131a",
    "text/disabled": "#a8a8b2",
    "text/inverted": "#ffffff",
    "text/inverted-disabled": "rgba(255,255,255,0.24)",
    "container/inverted/background": "#13131a",
    "container/default/background": "#f7f7fa",
    "radius/container": "5px",
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
