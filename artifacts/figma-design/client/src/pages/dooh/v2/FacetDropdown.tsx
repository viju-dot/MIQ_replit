import { useState } from "react";
import { X } from "lucide-react";
import { Checkbox } from "@/pages/ds/CheckPage";
import { SearchStandard } from "@/pages/ds/SearchPage";
import { FiberButton } from "./primitives";

/** An empty selection means All, matching the planner's unfiltered facets. */
export function FacetDropdown({ title, values, selected, onSelected }: {
  title: string;
  values: string[];
  selected: string[];
  onSelected: (values: string[]) => void;
}) {
  const [query, setQuery] = useState("");
  const all = selected.length === 0;
  const filtered = values.filter(value => value.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const toggleValue = (value: string) => {
    const next = selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value];
    onSelected(next.length === values.length ? [] : next);
  };
  return <div role="group" aria-label={`${title} selection`} className="space-y-3" style={{
      fontFamily: '"DM Sans", Helvetica',
      color: "var(--surface-foreground-static-neutral-lvl1, #13131a)",
    }}>
      <SearchStandard background label={`Search ${title === "Venue Type" ? "venue types" : "publishers"}`} value={query} onValueChange={setQuery} />
      <div className="pb-2 border-b" style={{ borderColor: "var(--border-static-subtle-neutral, #e1e1e8)" }}>
        <Checkbox labelValue="All" variant={all ? "Checked" : "Unchecked"} onToggle={() => onSelected([])} />
      </div>
      <div className="space-y-2" aria-label={`Selected ${title === "Venue Type" ? "venue types" : "publishers"}`}>
        <p role="status" className="text-xs">{all ? "All included" : `${selected.length} selected`}</p>
        {!all && <div className="flex flex-wrap gap-1">
          {selected.map(value => <FiberButton key={value} variant="outline" size="compact" className="max-w-full" ariaLabel={`Remove ${value}`} onClick={() => toggleValue(value)}>
            <span className="truncate">{value}</span><X size={12} aria-hidden />
          </FiberButton>)}
        </div>}
      </div>
      <div role="group" aria-label={title === "Venue Type" ? "Venue types" : "Publishers"} className="max-h-52 overflow-y-auto space-y-1">
        {filtered.map(value => <div key={value}>
          <Checkbox labelValue={value} variant={selected.includes(value) ? "Checked" : "Unchecked"} onToggle={() => toggleValue(value)} />
        </div>)}
        {filtered.length === 0 && <p role="status" className="text-xs py-2">No matches. Try another search.</p>}
      </div>
  </div>;
}