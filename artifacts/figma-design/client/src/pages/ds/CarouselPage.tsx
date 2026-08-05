import { useState } from "react";

const captionClass = "text-[12px] text-[#a8a8b2]";
const cardClass =
  "rounded-[5px] border border-dashed border-[#9747ff] bg-white p-5";

type NavButtonProps = {
  direction: "left" | "right";
  onClick?: () => void;
  disabled?: boolean;
};

function NavButton({ direction, onClick, disabled }: NavButtonProps): JSX.Element {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={direction === "left" ? "Previous" : "Next"}
      className="flex items-center justify-center rounded-[2px] p-[7px] transition-colors hover:bg-[#7171801a] disabled:opacity-40 disabled:hover:bg-transparent"
    >
      <span className="flex items-center justify-center p-[2px]">
        <img
          alt=""
          className="block h-5 w-5"
          src={
            direction === "left"
              ? "/figmaAssets/carousel/caret-left.svg"
              : "/figmaAssets/carousel/caret-right.svg"
          }
        />
      </span>
    </button>
  );
}

type PaginationProps = {
  count: number;
  active: number;
  onSelect?: (index: number) => void;
};

function CarouselPagination({
  count,
  active,
  onSelect,
}: PaginationProps): JSX.Element {
  return (
    <div className="flex h-full items-center gap-[12px] overflow-hidden">
      {Array.from({ length: count }).map((_, index) => (
        <button
          type="button"
          key={index}
          onClick={() => onSelect?.(index)}
          aria-label={`Go to slide ${index + 1}`}
          aria-current={index === active}
          className="flex flex-col items-start overflow-hidden rounded-full"
        >
          <span
            className="h-2 w-2 rounded-full"
            style={{
              backgroundColor: index === active ? "#7c33b5" : "#ebebf0",
            }}
          />
        </button>
      ))}
    </div>
  );
}

type CaruselNavigationProps = {
  count?: number;
  active?: number;
  onSelect?: (index: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
};

/** Carusel Navigation — standalone navigation control (node 49233:1656). */
function CaruselNavigation({
  count = 5,
  active = 0,
  onSelect,
  onPrev,
  onNext,
}: CaruselNavigationProps): JSX.Element {
  return (
    <div className="flex items-center justify-end gap-2">
      <NavButton direction="left" onClick={onPrev} />
      <div className="flex flex-row items-center self-stretch">
        <CarouselPagination count={count} active={active} onSelect={onSelect} />
      </div>
      <NavButton direction="right" onClick={onNext} />
    </div>
  );
}

/** Carousel — slot area with navigation (node 53673:1969). */
function Carousel(): JSX.Element {
  const count = 5;
  const [active, setActive] = useState(0);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      {/* slot */}
      <div className="relative h-[192px] w-full bg-[rgba(234,0,173,0.1)]">
        <span
          className="absolute inset-0 flex items-center justify-center text-[14px] text-[#717180]"
        >
          slot — swap with any component
        </span>
      </div>
      {/* Carusel Navigation */}
      <div className="flex w-full items-center justify-center gap-2">
        <NavButton
          direction="left"
          onClick={() => setActive((i) => (i - 1 + count) % count)}
        />
        <div className="flex flex-row items-center self-stretch">
          <CarouselPagination count={count} active={active} onSelect={setActive} />
        </div>
        <NavButton
          direction="right"
          onClick={() => setActive((i) => (i + 1) % count)}
        />
      </div>
    </div>
  );
}

export default function CarouselPage(): JSX.Element {
  const [navActive, setNavActive] = useState(0);
  const navCount = 5;

  return (
    <section aria-label="Carousel components" className="flex flex-col gap-8">
      {/* Carousel component */}
      <div className={cardClass}>
        <div className="mb-4 flex flex-col gap-1">
          <h2 className="text-[24px] font-medium tracking-[-0.36px] text-[#13131a]">
            Carousel Component
          </h2>
          <span className={captionClass}>Default</span>
        </div>
        <div className="max-w-[900px]">
          <Carousel />
        </div>
      </div>

      {/* Carousel navigation */}
      <div className={cardClass}>
        <div className="mb-4 flex flex-col gap-1">
          <h2 className="text-[24px] font-medium tracking-[-0.36px] text-[#13131a]">
            Carousel navigation
          </h2>
          <span className={captionClass}>Default</span>
        </div>
        <div className="flex flex-col items-start">
          <CaruselNavigation
            count={navCount}
            active={navActive}
            onSelect={setNavActive}
            onPrev={() => setNavActive((i) => (i - 1 + navCount) % navCount)}
            onNext={() => setNavActive((i) => (i + 1) % navCount)}
          />
        </div>
      </div>
    </section>
  );
}
