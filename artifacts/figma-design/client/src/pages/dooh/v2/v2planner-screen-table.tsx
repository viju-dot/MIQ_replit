import { useState, useMemo, useEffect, useRef } from "react";
import { ScreenData } from "../data";
import { ArrowUpDown } from "lucide-react";
import { EXCHANGE_RATES } from "./v2planner-sidebar";
import { Checkbox as FiberCheckbox } from "../../ds/CheckPage";
import { SearchStandard } from "../../ds/SearchPage";
import { CARD_BG, TITLE } from "./primitives";

interface Props {
  screens: ScreenData[];
  selectedScreenIds: Set<string>;
  currency: "GBP" | "EUR" | "USD";
  onSelect: (id: string, checked: boolean) => void;
  onSelectMany: (ids: string[], checked: boolean) => void;
  onHover: (id: string | null) => void;
  highlightedScreenId?: string | null;
}

type SortConfig = { key: keyof ScreenData; dir: 'asc' | 'desc' } | null;

export function ScreenTableV2({ screens, selectedScreenIds, currency, onSelect, onSelectMany, onHover, highlightedScreenId }: Props) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortConfig>(null);
  const highlightedRow = useRef<HTMLTableRowElement>(null);
  const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
  
  const rate = EXCHANGE_RATES[currency] || 1;
  const currencySymbol = currency === "EUR" ? "€" : currency === "USD" ? "$" : "£";

  const isTableHovered = useRef(false);

  // Prevent silent full-row scroll on hover if unnecessary
  useEffect(() => {
    if (highlightedScreenId && highlightedRow.current && !isTableHovered.current) {
      highlightedRow.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [highlightedScreenId]);

  const filteredAndSorted = useMemo(() => {
    let result = screens;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(s => 
        s.id.toLowerCase().includes(q) || 
        s.publisher.toLowerCase().includes(q) || 
        s.city.toLowerCase().includes(q) || 
        s.venue.toLowerCase().includes(q) ||
        (s.cpm * rate).toFixed(2).includes(q.replace(currencySymbol, ""))
      );
    }
    
    if (sort) {
      result = [...result].sort((a, b) => {
        const valA = a[sort.key];
        const valB = b[sort.key];
        if (valA < valB) return sort.dir === 'asc' ? -1 : 1;
        if (valA > valB) return sort.dir === 'asc' ? 1 : -1;
        return 0;
      });
    }
    
    return result;
  }, [screens, search, sort, rate, currencySymbol]);

  const allSelected = filteredAndSorted.length > 0 && filteredAndSorted.every(s => selectedScreenIds.has(s.id));
  const someSelected = filteredAndSorted.length > 0 && filteredAndSorted.some(s => selectedScreenIds.has(s.id));

  const handleSort = (key: keyof ScreenData) => {
    setSort(prev => {
      if (prev?.key === key) {
        if (prev.dir === 'asc') return { key, dir: 'desc' };
        return null;
      }
      return { key, dir: 'asc' };
    });
  };

  const SortIcon = ({ colKey }: { colKey: keyof ScreenData }) => {
    if (sort?.key !== colKey) return <ArrowUpDown className="w-3 h-3 text-[var(--surface-foreground-dynamic-neutral-disabled,#a8a8b2)] opacity-0 group-hover:opacity-100 transition-opacity" />;
    return <ArrowUpDown className="w-3 h-3 text-[var(--surface-foreground-dynamic-brand-default,#7c33b5)]" />;
  };

  const handleSelectAll = (checked: boolean) => {
    const ids = filteredAndSorted.map(s => s.id);
    onSelectMany(ids, checked);
  };

  const onRowMouseEnter = (id: string) => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    onHover(id);
  };

  const onRowMouseLeave = () => {
    if (hoverTimeout.current) clearTimeout(hoverTimeout.current);
    hoverTimeout.current = setTimeout(() => onHover(null), 50);
  };

  return (
    <div 
      className="flex flex-col h-full font-[var(--font-sans,'DM_Sans')]"
      style={{ backgroundColor: CARD_BG, color: TITLE }}
      onMouseEnter={() => { isTableHovered.current = true; }}
      onMouseLeave={() => { isTableHovered.current = false; }}
    >
      <div className="p-3 border-b border-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)] shrink-0 space-y-2">
        <div className="w-full">
          <SearchStandard 
            background={true}
            value={search}
            onValueChange={setSearch}
            label="Search ID, publisher, city..."
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto dooh-scrollbar">
        <table className="w-full text-[13px] text-left border-collapse">
          <thead className="sticky top-0 shadow-sm z-10 uppercase tracking-wider" style={{ backgroundColor: "var(--surface-background-lvl2, #f7f7fa)", color: "var(--surface-foreground-dynamic-neutral-default-regular, #4b4b59)" }}>
            <tr>
              <th className="px-3 py-2.5 w-[44px] border-b border-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)]">
                <div aria-label="Select all visible screens">
                  <FiberCheckbox 
                    variant={allSelected ? "Checked" : someSelected ? "Partial" : "Unchecked"}
                    onToggle={() => handleSelectAll(!allSelected)}
                    hasLabel={false}
                  />
                </div>
              </th>
              <th className="px-3 py-2.5 group border-b border-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)]">
                <button 
                  onClick={() => handleSort('id')}
                  aria-label="Sort by ID"
                  className="flex items-center gap-1 text-xs font-medium w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-dynamic-brand-selected,#7c33b5)] rounded"
                >
                  ID <SortIcon colKey="id" />
                </button>
              </th>
              <th className="px-3 py-2.5 group border-b border-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)]">
                <button 
                  onClick={() => handleSort('publisher')}
                  aria-label="Sort by Publisher"
                  className="flex items-center gap-1 text-xs font-medium w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-dynamic-brand-selected,#7c33b5)] rounded"
                >
                  Publisher <SortIcon colKey="publisher" />
                </button>
              </th>
              <th className="px-3 py-2.5 group border-b border-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)]">
                <button 
                  onClick={() => handleSort('city')}
                  aria-label="Sort by City"
                  className="flex items-center gap-1 text-xs font-medium w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-dynamic-brand-selected,#7c33b5)] rounded"
                >
                  City <SortIcon colKey="city" />
                </button>
              </th>
              <th className="px-3 py-2.5 group border-b border-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)]">
                <button 
                  onClick={() => handleSort('cpm')}
                  aria-label="Sort by CPM"
                  className="flex items-center gap-1 text-xs font-medium w-full text-left outline-none focus-visible:ring-2 focus-visible:ring-[var(--border-dynamic-brand-selected,#7c33b5)] rounded"
                >
                  CPM <SortIcon colKey="cpm" />
                </button>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--border-dynamic-neutral-subtle-default,#c6c6cc)]">
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center" style={{ color: "var(--surface-foreground-dynamic-neutral-disabled, #a8a8b2)", backgroundColor: "var(--surface-background-lvl2, #f7f7fa)" }}>
                  No screens match the search query.
                </td>
              </tr>
            ) : (
              filteredAndSorted.map(s => {
                const isSelected = selectedScreenIds.has(s.id);
                const isHighlighted = s.id === highlightedScreenId;
                
                const rowBg = isHighlighted || isSelected 
                  ? "var(--container-dynamic-brand-subtle-background-default, #f0e6f7)" 
                  : "transparent";

                return (
                  <tr 
                    key={s.id} 
                    ref={isHighlighted ? highlightedRow : undefined}
                    tabIndex={0}
                    aria-label={`Row for ${s.id}`}
                    onClick={() => onHover(s.id)}
                    onKeyDown={e => { if (e.key === "Enter") onHover(s.id); }}
                    className="cursor-pointer transition-colors outline-none hover:bg-[var(--container-dynamic-neutral-subtle-background-hover,rgba(113,113,128,0.08))]"
                    style={{ backgroundColor: rowBg }}
                    onMouseEnter={() => onRowMouseEnter(s.id)}
                    onMouseLeave={onRowMouseLeave}
                  >
                    <td className="px-3 py-2 whitespace-nowrap w-[44px]">
                      <div aria-label={`Select ${s.id}`} onClick={e => e.stopPropagation()}>
                        <FiberCheckbox 
                          variant={isSelected ? "Checked" : "Unchecked"}
                          onToggle={() => onSelect(s.id, !isSelected)}
                          hasLabel={false}
                        />
                      </div>
                    </td>
                    <td className="px-3 py-2 font-medium whitespace-nowrap" style={{ color: TITLE }}>{s.id}</td>
                    <td className="px-3 py-2 whitespace-nowrap truncate max-w-[100px]" style={{ color: "var(--surface-foreground-dynamic-neutral-default-regular, #4b4b59)" }}>{s.publisher}</td>
                    <td className="px-3 py-2 whitespace-nowrap" style={{ color: "var(--surface-foreground-dynamic-neutral-default-regular, #4b4b59)" }}>{s.city}</td>
                    <td className="px-3 py-2 font-medium whitespace-nowrap" style={{ color: TITLE }}>{currencySymbol}{(s.cpm * rate).toFixed(2)}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      <div className="p-2 border-t text-[11px] text-center" style={{ borderColor: "var(--border-dynamic-neutral-subtle-default, #c6c6cc)", color: "var(--surface-foreground-dynamic-neutral-default-regular, #4b4b59)", backgroundColor: "var(--surface-background-lvl2, #f7f7fa)" }}>
        Showing {filteredAndSorted.length} screens
      </div>
    </div>
  );
}
