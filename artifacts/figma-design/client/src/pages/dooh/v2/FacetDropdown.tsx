import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
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
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const all = selected.length === 0;
  const filtered = values.filter(value => value.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));
  const summary = all ? "All" : selected.length === 1 ? selected[0] : `${selected.length} selected`;
  const toggleValue = (value: string) => {
    const next = selected.includes(value) ? selected.filter(item => item !== value) : [...selected, value];
    onSelected(next.length === values.length ? [] : next);
  };
  return <Popover open={open} onOpenChange={next => { setOpen(next); setQuery(""); }}>
    <PopoverTrigger asChild>
      <button
        type="button"
        aria-label={`${title}: ${summary}`}
        onFocus={event => setFocused(event.currentTarget.matches(":focus-visible"))}
        onBlur={() => setFocused(false)}
        className="flex w-full items-center justify-between gap-2 rounded border px-3 py-2 text-sm outline-none"
        style={{
          fontFamily: '"DM Sans", Helvetica',
          color: "var(--surface-foreground-static-neutral-lvl1, #13131a)",
          background: "var(--surface-background-lvl1, #fff)",
          borderColor: "var(--border-dynamic-neutral-subtle-default, #c6c6cc)",
          boxShadow: focused ? "0 0 0 2px var(--border-dynamic-brand-selected, #7c33b5)" : undefined,
        }}
      >
        <span className="truncate">{summary}</span><ChevronDown size={16} aria-hidden />
      </button>
    </PopoverTrigger>
    <PopoverContent align="start" aria-label={`${title} selection`} className="p-3 space-y-3" style={{
      width: "var(--radix-popover-trigger-width)",
      maxHeight: "var(--radix-popover-content-available-height)",
      overflowY: "auto",
      background: "var(--surface-background-lvl1, #fff)",
      borderColor: "var(--border-static-subtle-neutral, #e1e1e8)",
    }}>
      <SearchStandard background label={`Search ${title === "Venue Type" ? "venue types" : "publishers"}`} value={query} onValueChange={setQuery} />
      <div className="pb-2 border-b" style={{ borderColor: "var(--border-static-subtle-neutral, #e1e1e8)" }}>
        <Checkbox labelValue="All" variant={all ? "Checked" : "Unchecked"} onToggle={() => onSelected([])} />
        <p className="text-xs mt-1" style={{ color: "var(--surface-foreground-static-neutral-lvl3, #717180)" }}>Includes every {title === "Venue Type" ? "venue type" : "publisher"}. No individual selection needed.</p>
      </div>
      <div role="group" aria-label={title === "Venue Type" ? "Venue types" : "Publishers"} className="max-h-52 overflow-y-auto space-y-1">
        {filtered.map(value => <div key={value}>
          <Checkbox labelValue={value} variant={selected.includes(value) ? "Checked" : "Unchecked"} onToggle={() => toggleValue(value)} />
        </div>)}
        {filtered.length === 0 && <p role="status" className="text-xs py-2">No matches. Try another search.</p>}
      </div>
      <p role="status" className="text-xs">{all ? "All included" : `${selected.length} selected`}</p>
      <FiberButton size="compact" className="w-full" onClick={() => setOpen(false)}>Done</FiberButton>
    </PopoverContent>
  </Popover>;
}