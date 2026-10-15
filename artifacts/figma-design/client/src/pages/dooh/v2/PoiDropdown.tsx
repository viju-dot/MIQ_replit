import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Portal as TooltipPortal } from "@radix-ui/react-tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { SearchStandard } from "@/pages/ds/SearchPage";
import { Checkbox } from "@/pages/ds/CheckPage";
import { FiberRemovablePill } from "@/pages/ds/PillPage";
import { MOCK_POIS } from "../data";
import { FiberButton } from "./primitives";

export function PoiDropdown({ values, onChange }: { values: string[]; onChange: (values: string[]) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const selected = MOCK_POIS.filter(poi => values.includes(poi.id));
  const filtered = MOCK_POIS.filter(poi =>
    `${poi.name} ${poi.city}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );
  const toggle = (id: string) => onChange(values.includes(id) ? values.filter(value => value !== id) : [...values, id]);
  const surface = {
    fontFamily: '"DM Sans", Helvetica',
    backgroundColor: "var(--surface-background-lvl1, #ffffff)",
    borderColor: "var(--border-dynamic-neutral-subtle-default, #e1e1e8)",
    color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)",
  };

  return <div className="space-y-3" style={{ fontFamily: surface.fontFamily }}>
    <Popover open={open} onOpenChange={next => { setOpen(next); if (!next) setQuery(""); }}>
      <PopoverTrigger asChild>
        <button type="button" aria-label="Choose points of interest" className="flex h-9 w-full items-center justify-between gap-2 rounded border px-3 text-xs" style={{
          ...surface,
          backgroundColor: "var(--surface-background-lvl2, #f7f7fa)",
        }}>
          <span>Choose points of interest</span><ChevronDown size={14} aria-hidden />
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" aria-label="Choose points of interest" className="space-y-3 p-3" style={{
        ...surface,
        width: "var(--radix-popover-trigger-width)",
        maxHeight: "var(--radix-popover-content-available-height)",
        overflowY: "auto",
      }}>
        <SearchStandard background label="Search points of interest" value={query} onValueChange={setQuery} />
        <div role="group" aria-label="Points of interest" className="max-h-60 space-y-2 overflow-y-auto">
          {filtered.map(poi => <div key={poi.id} className="space-y-1">
            <Checkbox labelValue={poi.name} variant={values.includes(poi.id) ? "Checked" : "Unchecked"} onToggle={() => toggle(poi.id)} />
            <p className="pl-7 text-xs" style={{ color: "var(--surface-foreground-static-neutral-lvl3, #717180)" }}>{poi.city}</p>
          </div>)}
          {filtered.length === 0 && <p role="status" className="text-xs">No POIs match. Try another name or city.</p>}
        </div>
      </PopoverContent>
    </Popover>
    <section aria-label="POI overview" className="space-y-2">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs font-medium">POI overview</p>
        <FiberButton variant="outline" size="compact" className="shrink-0" ariaLabel="Clear all POIs" disabled={selected.length === 0} onClick={() => { setQuery(""); onChange([]); }}>Clear all</FiberButton>
      </div>
      {selected.length === 0 ? <p role="status" className="text-xs" style={{ color: "var(--surface-foreground-static-neutral-lvl3, #717180)" }}>No POIs selected</p> :
        <TooltipProvider delayDuration={250}>
          <div className="flex max-h-52 flex-wrap gap-1 overflow-y-auto" aria-label="Selected points of interest">
            {selected.map(poi => <Tooltip key={poi.id}>
              <TooltipTrigger asChild>
                <span tabIndex={0} aria-label={`${poi.name}, ${poi.city}. Latitude ${poi.lat}, longitude ${poi.lng}`} className="inline-flex max-w-full rounded-full outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-dynamic-brand-selected,#7c33b5)]">
                  <FiberRemovablePill style="Brand (Subtle)" fill="Filled" state="Active" size="Standard" label={poi.name} onRemove={() => toggle(poi.id)} />
                </span>
              </TooltipTrigger>
              <TooltipPortal>
                <TooltipContent side="right" className="max-w-64 space-y-1 text-xs" style={{ ...surface, zIndex: 2000 }}>
                  <p className="font-medium">{poi.name}</p>
                  <p>{poi.city}</p>
                  <p>Latitude: {poi.lat}</p>
                  <p>Longitude: {poi.lng}</p>
                </TooltipContent>
              </TooltipPortal>
            </Tooltip>)}
          </div>
        </TooltipProvider>}
    </section>
  </div>;
}
