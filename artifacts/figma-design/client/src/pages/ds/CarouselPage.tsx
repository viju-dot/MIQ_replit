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
      className="flex items-center justify-center rounded-[var(--radius-25,2px)] p-[var(--spacing-container-m,7px)] outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-dynamic-brand-selected,#7c33b5)] disabled:cursor-not-allowed disabled:opacity-40"
    >
      <span className="flex items-center justify-center p-[var(--spacing-25,2px)]">
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
    <div className="flex h-full items-center gap-[var(--spacing-150,12px)] overflow-hidden">
      {Array.from({ length: count }).map((_, index) => (
        <button
          type="button"
          key={index}
          onClick={() => onSelect?.(index)}
          aria-label={`Go to slide ${index + 1}`}
          aria-current={index === active}
          className="flex flex-col items-start overflow-hidden rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-dynamic-brand-selected,#7c33b5)]"
        >
          <span
            className="h-2 w-2 rounded-full transition-colors duration-150"
            style={{
              backgroundColor:
                index === active
                  ? "var(--controls-background-active, #7c33b5)"
                  : "var(--controls-background-inactive, #ebebf0)",
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
        <span className="absolute inset-0 flex items-center justify-center text-[length:var(--body-md-regular-size,14px)] text-[var(--surface-foreground-static-neutral-lvl3,#717180)]">
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
    "controls/background/active": "var(--controls-background-active)",
    "controls/background/inactive": "var(--controls-background-inactive)",
    "surface/background/hover": "var(--surface-background-hover)",
    "surface/foreground/static/neutral/lvl3": "var(--surface-foreground-static-neutral-lvl3)",
    "spacing/150": "var(--spacing-150)",
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
    "controls/background/active": "var(--controls-background-active)",
    "controls/background/inactive": "var(--controls-background-inactive)",
    "surface/background/hover": "var(--surface-background-hover)",
    "radius/25": "var(--radius-25)",
    "spacing/150": "var(--spacing-150)",
    "spacing/container/m": "var(--spacing-container-m)",
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
