import { useState } from "react";
import { MapPin, X } from "lucide-react";
import { MOCK_POIS } from "../data";
import { SearchStandard } from "@/pages/ds/SearchPage";
import { FiberButton } from "./primitives";
import { Checkbox } from "@/pages/ds/CheckPage";

export function PoiSearch({ values, onChange, allowClearAll = false }: { values: string[]; onChange: (v: string[]) => void; allowClearAll?: boolean }) {
  const [query, setQuery] = useState("");
  const selected = MOCK_POIS.filter(poi => values.includes(poi.id));
  const filtered = MOCK_POIS.filter(poi =>
    `${poi.name} ${poi.city}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()),
  );
  const toggle = (id: string) => {
    onChange(values.includes(id) ? values.filter(value => value !== id) : [...values, id]);
  };

  return <div className="space-y-3" style={{ fontFamily: '"DM Sans", Helvetica', color: "var(--surface-foreground-static-neutral-lvl1, #13131a)" }}>
    <SearchStandard background label="Search points of interest" value={query} onValueChange={setQuery} />
    <div className="space-y-2">
      <p className="text-xs font-medium">{query.trim() ? "Matching sample POIs" : "Preset points of interest"}</p>
      <div className="max-h-60 overflow-y-auto space-y-2" role="group" aria-label="Sample points of interest">
        {filtered.map(poi => <div key={poi.id} className="rounded border p-2" style={{ borderColor: "var(--border-static-subtle-neutral, #e1e1e8)" }}>
          <Checkbox labelValue={poi.name} variant={values.includes(poi.id) ? "Checked" : "Unchecked"} onToggle={() => toggle(poi.id)} />
          <p className="text-xs pl-7" style={{ color: "var(--surface-foreground-static-neutral-lvl3, #717180)" }}>{poi.city}</p>
        </div>)}
        {filtered.length === 0 && <p role="status" className="text-xs">No sample POIs match. Try London, O2, Manchester, or Birmingham.</p>}
      </div>
    </div>
    <section aria-label="POI overview" className="rounded border p-3 space-y-2" style={{
      borderColor: "var(--border-static-subtle-neutral, #e1e1e8)",
      background: "var(--surface-background-lvl2, #f7f7fa)",
    }}>
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-medium">POI overview</p>
        {allowClearAll && <FiberButton variant="outline" size="compact" className="shrink-0" ariaLabel="Clear all POIs" disabled={selected.length === 0} onClick={() => { setQuery(""); onChange([]); }}>Clear all</FiberButton>}
      </div>
      <p role="status" aria-live="polite" className="text-xs">{selected.length} {selected.length === 1 ? "POI" : "POIs"} selected</p>
      {selected.length > 0 ? <>
        <div className="max-h-52 overflow-y-auto space-y-2">
          {selected.map(poi => <div key={poi.id} className="flex items-start gap-2">
            <MapPin size={14} className="shrink-0 mt-1" aria-hidden />
            <div className="min-w-0 flex-1">
              <p className="text-xs font-medium">{poi.name}</p>
              <p className="text-xs">{poi.city}</p>
            </div>
            <FiberButton variant="outline" size="compact" ariaLabel={`Remove ${poi.name}`} onClick={() => toggle(poi.id)}>
              <X size={12} aria-hidden />
            </FiberButton>
          </div>)}
        </div>
        <p className="text-xs">Screens within the chosen radius of any selected POI are included.</p>
        {!allowClearAll && <FiberButton variant="outline" size="compact" onClick={() => onChange([])}>Clear all POIs</FiberButton>}
      </> : null}
    </section>
  </div>;
}