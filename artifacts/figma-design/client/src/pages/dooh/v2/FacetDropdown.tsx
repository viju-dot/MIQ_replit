import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/pages/ds/CheckPage";
import { SearchStandard } from "@/pages/ds/SearchPage";
import { FiberButton } from "./primitives";

/** An empty selection means All, matching the planner's unfiltered facets. */
export function FacetDropdown({ title, values, selected, onSelected, dropdown = false }: {
  title: string;
  values: string[];
  selected: string[];
  onSelected: (values: string[]) => void;
  dropdown?: boolean;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [recent, setRecent] = useState<string[]>(() => selected.slice(-5).reverse());
  const all = selected.length === 0;
  const noun = title === "Venue Type" ? "venue types" : "publishers";
  const filtered = values.filter(value => value.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const toggleValue = (value: string) => {
    if (dropdown) setRecent(previous => [value, ...previous.filter(item => item !== value)].slice(0, 5));
    const next = selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value];
    onSelected(next.length === values.length ? [] : next);
  };
  const optionList = <div role="group" aria-label={title === "Venue Type" ? "Venue types" : "Publishers"} className="max-h-52 overflow-y-auto space-y-1">
    {filtered.map(value => <div key={value}>
      <Checkbox labelValue={value} variant={selected.includes(value) ? "Checked" : "Unchecked"} onToggle={() => toggleValue(value)} />
    </div>)}
    {filtered.length === 0 && <p role="status" className="text-xs py-2">No matches. Try another search.</p>}
  </div>;
  return <div role="group" aria-label={`${title} selection`} className="space-y-3" style={{
      fontFamily: '"DM Sans", Helvetica',
      color: "var(--surface-foreground-static-neutral-lvl1, #13131a)",
    }}>
      {dropdown ? (
        <Popover open={open} onOpenChange={next => { setOpen(next); if (!next) setQuery(""); }}>
          <PopoverTrigger asChild>
            <button type="button" aria-label={`Choose ${noun}`} className="flex h-9 w-full items-center justify-between gap-2 rounded border px-3 text-xs" style={{
              backgroundColor: "var(--surface-background-lvl2, #f7f7fa)",
              borderColor: "var(--border-dynamic-neutral-subtle-default, #c6c6cc)",
              color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)",
            }}>
              <span>{`Choose ${noun}`}</span><ChevronDown size={14} aria-hidden />
            </button>
          </PopoverTrigger>
          <PopoverContent align="start" className="space-y-3 p-3" style={{
            width: "var(--radix-popover-trigger-width)",
            maxHeight: "var(--radix-popover-content-available-height)",
            overflowY: "auto",
            fontFamily: '"DM Sans", Helvetica',
            backgroundColor: "var(--surface-background-lvl1, #ffffff)",
            borderColor: "var(--border-dynamic-neutral-subtle-default, #e1e1e8)",
            color: "var(--surface-foreground-dynamic-neutral-default-variation, #13131a)",
          }} aria-label={`Choose ${noun}`}>
            <SearchStandard background label={`Search ${noun}`} value={query} onValueChange={setQuery} />
            {optionList}
          </PopoverContent>
        </Popover>
      ) : <SearchStandard background label={`Search ${noun}`} value={query} onValueChange={setQuery} />}
      <div className="pb-2 border-b" style={{ borderColor: "var(--border-static-subtle-neutral, #e1e1e8)" }}>
        <Checkbox labelValue="All" variant={all ? "Checked" : "Unchecked"} onToggle={() => onSelected([])} />
      </div>
      <div className="space-y-2" aria-label={`Selected ${title === "Venue Type" ? "venue types" : "publishers"}`}>
        {(!dropdown || !all) && <p role="status" className="text-xs">{all ? "All included" : `${selected.length} selected`}</p>}
        {!all && <div className="flex flex-wrap gap-1">
          {selected.map(value => <FiberButton key={value} variant="outline" size="compact" className="max-w-full" ariaLabel={`Remove ${value}`} onClick={() => toggleValue(value)}>
            <span className="truncate">{value}</span><X size={12} aria-hidden />
          </FiberButton>)}
        </div>}
      </div>
      {dropdown ? <div role="group" aria-label={`Recent ${noun}`} className="space-y-1">
        <p className="mb-2 text-xs font-medium">Recent</p>
        {recent.filter(value => values.includes(value)).map(value => <div key={value}>
          <Checkbox labelValue={value} variant={selected.includes(value) ? "Checked" : "Unchecked"} onToggle={() => toggleValue(value)} />
        </div>)}
        {recent.filter(value => values.includes(value)).length === 0 && <p className="text-xs py-1">No recent selections yet.</p>}
      </div> : optionList}
  </div>;
}