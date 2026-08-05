import { useEffect, useState } from "react";
import { Playground } from "@/components/playground/Playground";
import type { PlaygroundConfig } from "@/components/playground/types";

const ASSET = "/figmaAssets/carousel";

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
          src={direction === "left" ? `${ASSET}/caret-left.svg` : `${ASSET}/caret-right.svg`}
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

function CarouselPagination({ count, active, onSelect }: PaginationProps): JSX.Element {
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
            style={{ backgroundColor: index === active ? "#7c33b5" : "#ebebf0" }}
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
function Carousel({ count, slotLabel }: { count: number; slotLabel: string }): JSX.Element {
  const [active, setActive] = useState(0);

  // Keep active index within bounds when count changes via controls.
  useEffect(() => {
    setActive((i) => (i >= count ? 0 : i));
  }, [count]);

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4">
      {/* slot */}
      <div className="relative h-[192px] w-full bg-[rgba(234,0,173,0.1)]">
        <span className="absolute inset-0 flex items-center justify-center text-[14px] text-[#717180]">
          {slotLabel}
        </span>
      </div>
      {/* Carusel Navigation */}
      <div className="flex w-full items-center justify-center gap-2">
        <NavButton direction="left" onClick={() => setActive((i) => (i - 1 + count) % count)} />
        <div className="flex flex-row items-center self-stretch">
          <CarouselPagination count={count} active={active} onSelect={setActive} />
        </div>
        <NavButton direction="right" onClick={() => setActive((i) => (i + 1) % count)} />
      </div>
    </div>
  );
}

/** Standalone navigation with its own interactive state so the pagination is explorable. */
function InteractiveNavigation({ count }: { count: number }): JSX.Element {
  const [active, setActive] = useState(0);

  useEffect(() => {
    setActive((i) => (i >= count ? 0 : i));
  }, [count]);

  return (
    <CaruselNavigation
      count={count}
      active={active}
      onSelect={setActive}
      onPrev={() => setActive((i) => (i - 1 + count) % count)}
      onNext={() => setActive((i) => (i + 1) % count)}
    />
  );
}

const clampCount = (v: string | boolean): number => {
  const n = typeof v === "string" ? parseInt(v, 10) : NaN;
  if (Number.isNaN(n)) return 5;
  return Math.min(8, Math.max(1, n));
};

const carouselConfig: PlaygroundConfig = {
  name: "Carousel Component",
  description: "Slot area with navigation — swap the slot for any component.",
  controls: [
    {
      kind: "select",
      name: "count",
      label: "Slides",
      options: ["3", "4", "5", "6", "7", "8"],
      defaultValue: "5",
      asTabs: true,
    },
    {
      kind: "text",
      name: "slotLabel",
      label: "Slot label",
      defaultValue: "slot — swap with any component",
      placeholder: "Slot content label",
    },
  ],
  render: (props) => (
    <div className="w-full max-w-[900px]">
      <Carousel count={clampCount(props.count)} slotLabel={String(props.slotLabel)} />
    </div>
  ),
  tokens: {
    "pagination/active": "#7c33b5",
    "pagination/inactive": "#ebebf0",
    "nav/hover": "rgba(113,113,128,0.1)",
    "slot/background": "rgba(234,0,173,0.1)",
    "slot/label": "#717180",
    "pagination/dot-size": "8px",
    "pagination/gap": "12px",
    "slot/height": "192px",
  },
};

const navigationConfig: PlaygroundConfig = {
  name: "Carousel Navigation",
  description: "Standalone navigation control — carets with pagination dots.",
  controls: [
    {
      kind: "select",
      name: "count",
      label: "Dots",
      options: ["3", "4", "5", "6", "7", "8"],
      defaultValue: "5",
      asTabs: true,
    },
  ],
  render: (props) => <InteractiveNavigation count={clampCount(props.count)} />,
  tokens: {
    "pagination/active": "#7c33b5",
    "pagination/inactive": "#ebebf0",
    "nav/hover": "rgba(113,113,128,0.1)",
    "nav/button-radius": "2px",
    "nav/caret-size": "20px",
    "pagination/dot-size": "8px",
    "pagination/gap": "12px",
  },
};

export default function CarouselPage(): JSX.Element {
  return (
    <section aria-label="Carousel component playground" className="flex flex-col gap-6">
      <Playground config={carouselConfig} />
      <Playground config={navigationConfig} />
    </section>
  );
}
