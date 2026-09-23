const fs = require('fs');

const code = fs.readFileSync('artifacts/figma-design/client/src/pages/dooh/v2/primitives.tsx', 'utf8');

const sliderStart = code.indexOf('export function FiberSlider');

const newSlider = `export function FiberSlider({
  value,
  min,
  max,
  step = 1,
  onChange,
  disabled = false,
  ariaLabel
}: {
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (v: number) => void;
  disabled?: boolean;
  ariaLabel?: string;
}) {
  const [interacting, setInteracting] = useState(false);
  const activeMarker = \`url(/figmaAssets/slider/marker-discrete-active.svg)\`;
  const defaultMarker = \`url(/figmaAssets/slider/marker-discrete-default.svg)\`;
  const disabledMarker = \`url(/figmaAssets/slider/marker-discrete-disabled.svg)\`;
  const marker = disabled ? disabledMarker : interacting ? activeMarker : defaultMarker;

  return (
    <SliderPrimitive.Root
      value={[value]}
      min={min}
      max={max}
      step={step}
      onValueChange={v => onChange(v[0])}
      disabled={disabled}
      className="relative flex w-full touch-none select-none items-center h-[24px]"
      onMouseEnter={() => setInteracting(true)}
      onMouseLeave={() => setInteracting(false)}
      onMouseDown={() => setInteracting(true)}
      onMouseUp={() => setInteracting(false)}
    >
      <SliderPrimitive.Track className={\`relative h-[8px] w-full grow overflow-hidden rounded-[var(--radius-50,4px)] \${disabled ? "bg-[var(--controls-background-disabled,rgba(113,113,128,0.1))]" : "bg-[var(--border-static-subtle-neutral,#e1e1e8)]"}\`}>
        <SliderPrimitive.Range className={\`absolute h-full \${disabled ? "bg-[var(--controls-background-disabled,rgba(113,113,128,0.1))]" : "bg-[var(--controls-background-active,#7c33b5)]"}\`} />
      </SliderPrimitive.Track>
      <SliderPrimitive.Thumb 
        aria-label={ariaLabel}
        className="block size-[24px] rounded-full border-none bg-transparent outline-none disabled:pointer-events-none cursor-grab active:cursor-grabbing focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-dynamic-brand-selected,#7c33b5)] focus-visible:ring-offset-2"
        style={{ backgroundImage: marker, backgroundSize: '100% 100%' }}
        onFocus={() => setInteracting(true)}
        onBlur={() => setInteracting(false)}
      />
    </SliderPrimitive.Root>
  );
}
`;

const newCode = code.substring(0, sliderStart) + newSlider;
fs.writeFileSync('artifacts/figma-design/client/src/pages/dooh/v2/primitives.tsx', newCode);
