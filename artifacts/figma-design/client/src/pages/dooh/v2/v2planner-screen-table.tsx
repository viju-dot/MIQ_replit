import { useState, useMemo, useEffect, useRef } from "react";
import { ScreenData } from "../data";
import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { EXCHANGE_RATES } from "./v2planner-sidebar";

interface Props {
  screens: ScreenData[];
  selectedScreenIds: Set<string>;
  currency: "GBP" | "EUR" | "USD";
  onSelect: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onHover: (id: string | null) => void;
  highlightedScreenId?: string | null;
}

type SortConfig = { key: keyof ScreenData; dir: 'asc' | 'desc' } | null;

export function ScreenTableV2({ screens, selectedScreenIds, currency, onSelect, onSelectAll, onHover, highlightedScreenId }: Props) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortConfig>(null);
  const highlightedRow = useRef<HTMLTableRowElement>(null);
  
  const rate = EXCHANGE_RATES[currency] || 1;
  const currencySymbol = currency === "EUR" ? "€" : currency === "USD" ? "$" : "£";

  useEffect(() => {
    highlightedRow.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
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
    if (sort?.key !== colKey) return <ArrowUpDown className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />;
    return <ArrowUpDown className="w-3 h-3 text-purple-600" />;
  };

  return (
    <div className="flex flex-col h-full bg-white">
      <div className="p-3 border-b border-gray-200 shrink-0 space-y-2">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search ID, publisher, city..." 
            aria-label="Search screen table"
            className="pl-9 h-9 text-sm w-full bg-gray-50 border-gray-200 focus-visible:ring-purple-500"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto dooh-scrollbar">
        <table className="w-full text-[13px] text-left border-collapse">
          <thead className="sticky top-0 bg-gray-50 shadow-sm z-10 text-gray-600 uppercase tracking-wider">
            <tr>
              <th className="px-3 py-2.5 w-10 border-b border-gray-200">
                <input 
                  type="checkbox" 
                  checked={allSelected}
                  onChange={e => filteredAndSorted.forEach(s => onSelect(s.id, e.target.checked))}
                  aria-label="Select all visible screens"
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
              </th>
              <th className="px-3 py-2.5 cursor-pointer group border-b border-gray-200" onClick={() => handleSort('id')}>
                <div className="flex items-center gap-1">ID <SortIcon colKey="id" /></div>
              </th>
              <th className="px-3 py-2.5 cursor-pointer group border-b border-gray-200" onClick={() => handleSort('publisher')}>
                <div className="flex items-center gap-1">Publisher <SortIcon colKey="publisher" /></div>
              </th>
              <th className="px-3 py-2.5 cursor-pointer group border-b border-gray-200" onClick={() => handleSort('city')}>
                <div className="flex items-center gap-1">City <SortIcon colKey="city" /></div>
              </th>
              <th className="px-3 py-2.5 cursor-pointer group border-b border-gray-200" onClick={() => handleSort('cpm')}>
                <div className="flex items-center gap-1">CPM <SortIcon colKey="cpm" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-gray-500 bg-gray-50/50">
                  No screens match the search query.
                </td>
              </tr>
            ) : (
              filteredAndSorted.map(s => (
                <tr 
                  key={s.id} 
                  ref={s.id === highlightedScreenId ? highlightedRow : undefined}
                  tabIndex={0}
                  aria-label={`Show ${s.id} on map`}
                  onClick={() => onHover(s.id)}
                  onKeyDown={e => { if (e.key === "Enter") onHover(s.id); }}
                  className={`cursor-pointer transition-colors outline-none
                    ${s.id === highlightedScreenId ? 'bg-purple-50' : 'hover:bg-gray-50'}
                    ${selectedScreenIds.has(s.id) ? 'bg-purple-50/50' : ''}
                  `}
                  onMouseEnter={() => onHover(s.id)}
                  onMouseLeave={() => onHover(null)}
                >
                  <td className="px-3 py-2 whitespace-nowrap">
                    <input 
                      type="checkbox" 
                      checked={selectedScreenIds.has(s.id)}
                      onChange={e => onSelect(s.id, e.target.checked)}
                      onClick={e => e.stopPropagation()}
                      aria-label={`Select ${s.id}`}
                      className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                    />
                  </td>
                  <td className="px-3 py-2 font-medium text-gray-900 whitespace-nowrap">{s.id}</td>
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap truncate max-w-[100px]">{s.publisher}</td>
                  <td className="px-3 py-2 text-gray-600 whitespace-nowrap">{s.city}</td>
                  <td className="px-3 py-2 font-medium text-gray-700 whitespace-nowrap">{currencySymbol}{(s.cpm * rate).toFixed(2)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <div className="p-2 border-t border-gray-100 text-[11px] text-gray-500 text-center bg-gray-50">
        Showing {filteredAndSorted.length} screens
      </div>
    </div>
  );
}
