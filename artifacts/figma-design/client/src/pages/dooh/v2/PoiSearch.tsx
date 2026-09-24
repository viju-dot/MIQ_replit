import { useState } from "react";
import { MapPin, Plus, X } from "lucide-react";
import { MOCK_POIS } from "../data";
import { SearchStandard } from "@/pages/ds/SearchPage";
import { FiberButton } from "./primitives";

export function PoiSearch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [query, setQuery] = useState("");
  const selected = MOCK_POIS.find(poi => poi.id === value);
  const filtered = MOCK_POIS.filter(poi =>
    `${poi.name} ${poi.city}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );
  const select = (id: string) => {
    onChange(id);
    setQuery("");
  };

  return <div className="space-y-3" style={{ fontFamily: '"DM Sans", Helvetica', color: "var(--surface-foreground-static-neutral-lvl1, #13131a)" }}>
    <SearchStandard background label="Search points of interest" value={query} onValueChange={setQuery} />
    <div role="status" aria-live="polite" className="rounded border p-3 space-y-2" style={{
      borderColor: "var(--border-static-subtle-neutral, #e1e1e8)",
      background: "var(--surface-background-lvl2, #f7f7fa)",
    }}>
      <p className="text-xs font-medium">{selected ? "Added point of interest" : "No point of interest added"}</p>
      {selected ? <>
        <div className="flex items-start gap-2">
          <MapPin size={16} className="shrink-0 mt-0.5" aria-hidden />
          <div className="min-w-0">
            <p className="text-sm font-medium">{selected.name}</p>
            <p className="text-xs">{selected.city}</p>
          </div>
        </div>
        <FiberButton variant="outline" size="compact" ariaLabel={`Remove ${selected.name}`} onClick={() => onChange("")}>
          <X size={12} aria-hidden />Remove
        </FiberButton>
      </> : <p className="text-xs">Add a sample below to preview location-based screen matching.</p>}
    </div>
    <div className="space-y-2">
      <p className="text-xs font-medium">{query.trim() ? "Matching sample POIs" : "Sample points of interest"}</p>
      <p className="text-xs" style={{ color: "var(--surface-foreground-static-neutral-lvl3, #717180)" }}>
        Demo locations. One POI at a time; adding another replaces your selection.
      </p>
      <div className="max-h-60 overflow-y-auto space-y-2" role="group" aria-label="Sample points of interest">
        {filtered.map(poi => <div key={poi.id} className="flex items-center justify-between gap-2 rounded border p-2" style={{ borderColor: "var(--border-static-subtle-neutral, #e1e1e8)" }}>
          <div className="min-w-0">
            <p className="text-xs font-medium">{poi.name}</p>
            <p className="text-xs" style={{ color: "var(--surface-foreground-static-neutral-lvl3, #717180)" }}>{poi.city}</p>
          </div>
          <FiberButton variant="outline" size="compact" disabled={poi.id === value} ariaLabel={`${poi.id === value ? "Added" : selected ? "Replace with" : "Add"} ${poi.name}`} onClick={() => select(poi.id)}>
            {poi.id !== value && <Plus size={12} aria-hidden />}
            {poi.id === value ? "Added" : selected ? "Replace" : "Add"}
          </FiberButton>
        </div>)}
        {filtered.length === 0 && <p role="status" className="text-xs">No sample POIs match. Try London, O2, Manchester, or Birmingham.</p>}
      </div>
    </div>
  </div>;
}