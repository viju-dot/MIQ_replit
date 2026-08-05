import { useState } from "react";

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

function Pagination() {
  const [page, setPage] = useState(1);

  return (
    <div className="flex items-center justify-end">
      <PaginationLabel labelValue={`${page} of ${TOTAL_PAGES}`} />
      <PaginationButton
        direction="left"
        disabled={page <= 1}
        onClick={() => setPage((p) => Math.max(1, p - 1))}
      />
      <PaginationButton
        direction="right"
        disabled={page >= TOTAL_PAGES}
        onClick={() => setPage((p) => Math.min(TOTAL_PAGES, p + 1))}
      />
    </div>
  );
}

const caption = "text-[12px] text-[#a8a8b2]";
const cardClass =
  "rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5";

const labelVariants: Array<{
  id: string;
  label: string;
  isDisabled: boolean;
  isInverted: boolean;
}> = [
  { id: "default", label: "isDisabled=False, isInverted=False", isDisabled: false, isInverted: false },
  { id: "disabled", label: "isDisabled=True, isInverted=False", isDisabled: true, isInverted: false },
  { id: "inverted", label: "isDisabled=False, isInverted=True", isDisabled: false, isInverted: true },
  { id: "disabled-inverted", label: "isDisabled=True, isInverted=True", isDisabled: true, isInverted: true },
];

export default function PaginationPage(): JSX.Element {
  return (
    <section className="flex flex-col gap-6" aria-label="Pagination component">
      {/* Pagination molecule */}
      <div className={cardClass}>
        <div className="flex flex-col gap-4">
          <span className={caption}>
            Pagination — Molecule (label + icon buttons). Interactive.
          </span>
          <div className="flex flex-wrap items-center gap-8">
            <div className="flex flex-col gap-2">
              <span className={caption}>Button - icon only: true</span>
              <div className="flex flex-col items-start rounded-[5px] border border-dashed border-[#9747ff] px-[14px] py-5">
                <Pagination />
              </div>
              <span className={caption}>Pagination label</span>
            </div>
          </div>
        </div>
      </div>

      {/* Pagination label variants */}
      <div className={cardClass}>
        <div className="flex flex-col gap-4">
          <span className={caption}>
            Pagination label — properties: isDisabled (true/false), isInverted
            (true/false)
          </span>
          <div className="flex flex-wrap gap-6">
            {labelVariants.map((variant) => (
              <div key={variant.id} className="flex flex-col gap-2">
                <span className={caption}>{variant.label}</span>
                <div
                  className="flex items-center justify-end rounded-[5px] px-4 py-3"
                  style={{
                    backgroundColor: variant.isInverted ? "#13131a" : "#f7f7fa",
                  }}
                >
                  <PaginationLabel
                    isDisabled={variant.isDisabled}
                    isInverted={variant.isInverted}
                    labelValue="1 of 20"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
