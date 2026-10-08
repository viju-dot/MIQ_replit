import { useState } from "react";
import { ChevronDown, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/pages/ds/CheckPage";
import { SearchStandard } from "@/pages/ds/SearchPage";
import { FiberActionPill, FiberRemovablePill } from "@/pages/ds/PillPage";
import { FiberButton } from "./primitives";

/** An empty selection means All, matching the planner's unfiltered facets. */
export function FacetDropdown({ title, values, selected, onSelected, dropdown = false, screenCounts }: {
  title: string;
  values: string[];
  selected: string[];
  onSelected: (values: string[]) => void;
  dropdown?: boolean;
  screenCounts?: Record<string, number>;
}) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [showAllSelected, setShowAllSelected] = useState(false);
  const visibleSelected = showAllSelected ? selected : selected.slice(0, 5);
  const hiddenCount = selected.length - 5;
  const all = selected.length === 0;
  const showScreenCounts = dropdown && screenCounts !== undefined;
  const optionLabel = (value: string) => showScreenCounts ? `${value} [${(screenCounts[value] ?? 0).toLocaleString()}]` : value;
  const selectedScreens = showScreenCounts
    ? (all ? values : selected).reduce((total, value) => total + (screenCounts[value] ?? 0), 0)
    : 0;
  const noun = title === "Venue Type" ? "venue types" : "publishers";
  const filtered = values.filter(value => value.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const ordered = dropdown
    ? [...filtered.filter(value => selected.includes(value)), ...filtered.filter(value => !selected.includes(value))]
    : filtered;
  const toggleValue = (value: string) => {
    const next = selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value];
    if (next.length <= 5 || next.length === values.length) setShowAllSelected(false);
    onSelected(next.length === values.length ? [] : next);
  };
  const optionList = <div role="group" aria-label={title === "Venue Type" ? "Venue types" : "Publishers"} className="max-h-52 overflow-y-auto space-y-1">
    {ordered.map((value, index) => <div key={value}>
      {dropdown && index === 0 && selected.includes(value) && <p className="text-xs font-medium pb-2">Selected options</p>}
      {dropdown && !selected.includes(value) && (index === 0 || selected.includes(ordered[index - 1])) && <p className="text-xs font-medium py-2">Other options</p>}
      <Checkbox labelValue={optionLabel(value)} variant={selected.includes(value) ? "Checked" : "Unchecked"} onToggle={() => toggleValue(value)} />
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
        <Checkbox labelValue="All" variant={all ? "Checked" : "Unchecked"} onToggle={() => { setShowAllSelected(false); onSelected([]); }} />
      </div>
      <div className="space-y-2" aria-label={`Selected ${title === "Venue Type" ? "venue types" : "publishers"}`}>
        {dropdown ? <>
          <div role="status" className="flex items-center justify-between gap-2 text-xs font-medium">
            <span>{selected.length} selected</span>
            {showScreenCounts && <span className="ml-auto text-right" title="Total inventory screens belonging to the selected publishers">
              {selectedScreens.toLocaleString()} {selectedScreens === 1 ? "screen" : "screens"} selected
            </span>}
          </div>
          <div className="flex w-full flex-wrap gap-1">
            {visibleSelected.map(value => <FiberRemovablePill
              key={value}
              style="Brand (Subtle)"
              fill="Filled"
              state="Active"
              size="Compact"
              label={optionLabel(value)}
              onRemove={() => toggleValue(value)}
            />)}
            {hiddenCount > 0 && <FiberActionPill
              label={showAllSelected ? "Show less" : `${hiddenCount} more`}
              expanded={showAllSelected}
              onClick={() => setShowAllSelected(previous => !previous)}
            />}
          </div>
        </> : <>
        <p role="status" className="text-xs">{all ? "All included" : `${selected.length} selected`}</p>
        {!all && <div className="flex flex-wrap gap-1">
          {selected.map(value => <FiberButton key={value} variant="outline" size="compact" className="max-w-full" ariaLabel={`Remove ${value}`} onClick={() => toggleValue(value)}>
            <span className="truncate">{value}</span><X size={12} aria-hidden />
          </FiberButton>)}
        </div>}
        </>}
      </div>
      {!dropdown && optionList}
  </div>;
}