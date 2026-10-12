import { useEffect } from "react";
import L from "leaflet";
import { Circle, useMapEvents } from "react-leaflet";
import { X, AlertCircle } from "lucide-react";
import { Sparkle } from "@phosphor-icons/react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { FiberButton, FiberSlider, CARD_BG, CARD_SHADOW, GRID, FONT } from "./primitives";

export function SmartSelectionMapEvents({
  active,
  setPreviewCenter,
  onCapture
}: {
  active: boolean;
  setPreviewCenter: (latlng: L.LatLng | null) => void;
  onCapture: (latlng: L.LatLng) => void;
}) {
  const map = useMapEvents({
    mousemove(e) {
      if (active) setPreviewCenter(e.latlng);
    },
    mouseout() {
      if (active) setPreviewCenter(null);
    },
    click(e) {
      if (active) {
        onCapture(e.latlng);
      }
    }
  });

  useEffect(() => {
    if (active) {
      map.getContainer().style.cursor = "crosshair";
    } else {
      map.getContainer().style.cursor = "";
      setPreviewCenter(null);
    }
    return () => { map.getContainer().style.cursor = ""; }
  }, [active, map, setPreviewCenter]);

  return null;
}

export function SmartPreviewCircle({
  center,
  radius,
  color = "#7c33b5",
}: {
  center: L.LatLng | null;
  radius: number;
  color?: string;
}) {
  if (!center) return null;
  return (
    <Circle center={center} radius={radius} pathOptions={{ color, fillColor: color, fillOpacity: 0.1, weight: 1, dashArray: "4 4" }} interactive={false} />
  );
}

export function SmartSelectionControl({
  active,
  setActive,
  radius,
  setRadius,
  unit,
  setUnit,
  candidateCount,
  hasCenter,
  error
}: {
  active: boolean;
  setActive: (v: boolean) => void;
  radius: number;
  setRadius: (v: number) => void;
  unit: "m" | "km";
  setUnit: (v: "m" | "km") => void;
  candidateCount: number;
  hasCenter: boolean;
  error: string | null;
}) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape" && active) setActive(false);
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [active, setActive]);

  if (!active) {
    return (
      <div title="Smart Selection" className="absolute top-[var(--spacing-200,16px)] left-[var(--spacing-200,16px)] z-[1000]"
        onDoubleClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()}>
         <FiberButton onClick={() => setActive(true)} variant="solid" className="shadow-lg w-[34px] !px-0" ariaLabel="Start Smart Selection">
           <Sparkle size={20} weight="regular" aria-hidden="true" />
         </FiberButton>
      </div>
    );
  }

  const max = unit === "km" ? 10 : 10000;
  const min = unit === "km" ? 0.05 : 50;

  return (
    <div className="absolute top-[var(--spacing-200,16px)] left-[var(--spacing-200,16px)] z-[1000] w-[320px] rounded-[var(--radius-50,4px)] p-[var(--spacing-200,16px)] animate-in slide-in-from-top-4"
      style={{ backgroundColor: CARD_BG, boxShadow: CARD_SHADOW, border: `1px solid ${GRID}`, fontFamily: FONT }}
      onDoubleClick={e => e.stopPropagation()} onMouseDown={e => e.stopPropagation()} onClick={e => e.stopPropagation()}>
      <div className="flex justify-between items-center mb-[var(--spacing-100,8px)]">
         <h3 className="font-bold text-[length:var(--body-md-medium-size,14px)] text-[var(--surface-foreground-dynamic-neutral-default-variation,#13131a)] flex items-center gap-2">
           <Sparkle size={20} weight="regular" aria-hidden="true" /> Smart Selection
         </h3>
         <button onClick={() => setActive(false)} className="text-[var(--surface-foreground-dynamic-neutral-disabled,#717180)] hover:text-black transition-colors" aria-label="Cancel Smart Selection">
           <X className="w-4 h-4" />
         </button>
      </div>
      <p className="text-[length:var(--body-sm-regular-size,12px)] text-[var(--surface-foreground-dynamic-neutral-disabled,#717180)] mb-[var(--spacing-150,12px)] leading-tight">
        Move cursor over map to preview. Click to capture area and select screens inside.
      </p>
      
      <div className="flex items-center gap-[var(--spacing-100,8px)] mb-[var(--spacing-150,12px)]">
         <div className="flex-1 mt-1">
           <FiberSlider 
             value={radius} 
             min={min} 
             max={max} 
             step={unit === "km" ? 0.05 : 50} 
             onChange={setRadius} 
             ariaLabel="Smart selection radius"
           />
         </div>
         <div className="w-[70px]">
            <Input 
              aria-label="Exact smart radius"
              type="number" 
              min={min} max={max} step="any"
              value={radius} 
              onChange={e => {
                const v = Number(e.target.value);
                if (!isNaN(v)) setRadius(Math.max(min, Math.min(max, v)));
              }} 
              className="h-8 text-xs px-2"
            />
         </div>
         <div className="w-[65px]">
            <Select value={unit} onValueChange={(val: "m"|"km") => {
              let current = radius;
              if (val === "km" && unit === "m") {
                current = Math.min(10, Math.max(0.05, current / 1000));
              } else if (val === "m" && unit === "km") {
                current = Math.min(10000, Math.max(50, current * 1000));
              }
              setRadius(current);
              setUnit(val);
            }}>
              <SelectTrigger aria-label="Smart radius unit" className="h-8 text-xs px-2"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="m" className="text-xs">m</SelectItem>
                <SelectItem value="km" className="text-xs">km</SelectItem>
              </SelectContent>
            </Select>
         </div>
      </div>
      
      {error && (
        <div className="flex items-center gap-1 mb-[var(--spacing-100,8px)] text-[length:var(--body-sm-medium-size,12px)] text-[var(--surface-foreground-dynamic-error-default,#dc2626)]">
          <AlertCircle className="w-3 h-3" />
          <span>{error}</span>
        </div>
      )}

      <div className="text-[length:var(--body-sm-medium-size,12px)] font-medium pt-[var(--spacing-100,8px)]" style={{ color: "var(--surface-foreground-dynamic-neutral-default-variation,#13131a)", borderTop: `1px solid ${GRID}` }}>
         {hasCenter ? (
           <span className={candidateCount > 0 ? "text-[#7c33b5]" : "text-[var(--surface-foreground-dynamic-neutral-disabled,#717180)]"}>
             {candidateCount} screen{candidateCount !== 1 ? 's' : ''} in area
           </span>
         ) : "Move cursor over map"}
      </div>
    </div>
  );
}