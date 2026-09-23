import { useState, useRef, useEffect } from "react";
import { MOCK_POIS } from "../data";
import { Search } from "lucide-react";

export function PoiSearch({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const selected = MOCK_POIS.find((p) => p.id === value);

  // Group POIs into rough categories for mock tags
  const categories = ["Mall", "Arena", "London"];
  
  const filtered = MOCK_POIS.filter((p) => {
    if (category) {
       if (category === "London" && !p.city.toLowerCase().includes("london")) return false;
       if (category !== "London" && !p.name.toLowerCase().includes(category.toLowerCase())) return false;
    }
    if (query && !p.name.toLowerCase().includes(query.toLowerCase()) && !p.city.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  useEffect(() => {
    if (open) setFocusedIndex(-1);
  }, [open, query, category]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Exclude category buttons from input handler
    if ((e.target as HTMLElement).tagName === 'BUTTON' && (e.target as HTMLElement).dataset.cat) return;
    
    if (!open) {
      if (e.key === "Enter" || e.key === "ArrowDown") {
        e.preventDefault();
        setOpen(true);
      }
      return;
    }

    if (e.key === "Escape") {
      setOpen(false);
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev < filtered.length - 1 ? prev + 1 : prev));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (focusedIndex >= 0 && focusedIndex < filtered.length) {
        onChange(filtered[focusedIndex].id);
        setOpen(false);
      }
    }
  };

  const id = "poi-search";

  return (
    <div ref={ref} className="relative flex flex-col gap-2" onKeyDown={handleKeyDown}>
      <label htmlFor={id} className="text-xs font-medium block text-gray-700">Find Point of Interest (Sample Data)</label>
      
      <div className="relative">
        <Search className="absolute left-2.5 top-2 h-4 w-4 text-gray-400" />
        <input
          id={id}
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-controls={open ? `${id}-listbox` : undefined}
          aria-activedescendant={open && focusedIndex >= 0 ? `${id}-option-${focusedIndex}` : undefined}
          placeholder={selected ? selected.name : "Search arenas, malls..."}
          value={open ? query : (selected ? selected.name : "")}
          onChange={(e) => {
            setQuery(e.target.value);
            if (!open) setOpen(true);
          }}
          onFocus={() => {
            setOpen(true);
            setQuery("");
          }}
          className="h-8 w-full rounded-md border border-gray-200 pl-8 pr-3 text-sm outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
        />
      </div>
      
      <div className="flex flex-wrap gap-1 mt-1">
        {categories.map((cat) => (
          <button
            key={cat}
            type="button"
            data-cat="true"
            onClick={() => {
              setCategory(c => c === cat ? null : cat);
              setOpen(true);
            }}
            className={`px-2 py-0.5 rounded text-[10px] font-medium transition-colors ${category === cat ? "bg-purple-100 text-purple-700 border border-purple-200" : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-100"}`}
          >
            {cat}
          </button>
        ))}
      </div>

      {open && (
        <div className="absolute left-0 top-[60px] z-50 flex max-h-[280px] w-full flex-col overflow-hidden rounded-md border border-gray-200 bg-white shadow-lg">
          <div className="flex-1 overflow-y-auto py-1" role="listbox" id={`${id}-listbox`} ref={listRef}>
            {filtered.length === 0 ? (
              <div className="p-3 text-center text-xs text-gray-500">No mock POIs found. Try "Mall" or "Arena".</div>
            ) : (
              filtered.map((p, idx) => {
                const isFocused = idx === focusedIndex;
                const isSelected = p.id === value;
                return (
                  <button
                    key={p.id}
                    id={`${id}-option-${idx}`}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => {
                      onChange(p.id);
                      setOpen(false);
                      setCategory(null);
                    }}
                    onMouseEnter={() => setFocusedIndex(idx)}
                    className={`flex w-full flex-col items-start px-3 py-1.5 text-left focus:outline-none ${isFocused ? "bg-gray-50" : ""} ${isSelected ? "bg-purple-50/50" : ""}`}
                  >
                    <span className={`text-sm ${isSelected ? "text-purple-700 font-medium" : "text-gray-900"}`}>{p.name}</span>
                    <span className="text-[10px] text-gray-500">{p.city}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
