import { useState, useMemo, useEffect, useRef } from "react";
import { ScreenData } from "../data";
import { Search, ArrowUpDown } from "lucide-react";
import { Input } from "@/components/ui/input";

interface Props {
  screens: ScreenData[];
  selectedScreenIds: Set<string>;
  onSelect: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onHover: (id: string | null) => void;
  highlightedScreenId?: string | null;
}

type SortConfig = { key: keyof ScreenData; dir: 'asc' | 'desc' } | null;

export function ScreenTable({ screens, selectedScreenIds, onSelect, onSelectAll, onHover, highlightedScreenId }: Props) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortConfig>(null);
  const highlightedRow = useRef<HTMLTableRowElement>(null);
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
         s.creativeFormat.toLowerCase().includes(q) ||
         s.creativeRes.includes(q) ||
         s.cpm.toFixed(2).includes(q.replace("£", "")) ||
         String(s.impressions).includes(q)
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
  }, [screens, search, sort]);

  const allSelected = filteredAndSorted.length > 0 && filteredAndSorted.every(s => selectedScreenIds.has(s.id));
  const someSelected = selectedScreenIds.size > 0;

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
    if (sort?.key !== colKey) return <ArrowUpDown className="w-3 h-3 text-gray-300 opacity-0 group-hover:opacity-100" />;
    return <ArrowUpDown className="w-3 h-3 text-blue-500" />;
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-4 py-2 border-b border-[var(--surface-background-lvl4,#e1e1e8)] flex flex-wrap gap-2 items-center justify-between bg-white shrink-0">
        <div className="flex items-center gap-3 text-sm">
          <span className="font-semibold">{screens.length} Screens Matched</span>
          {search && <span>{filteredAndSorted.length} shown</span>}
          {someSelected && (
            <span className="text-[var(--colours-blue-300,#d194ff)] font-medium bg-[var(--container-static-brand-subtle-background,#f6ebff)] px-2 py-0.5 rounded">
              {selectedScreenIds.size} Selected
            </span>
          )}
        </div>
        <div className="relative w-64">
          <Search className="w-4 h-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <Input 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            placeholder="Search ID, publisher, city..." 
             aria-label="Search screen table"
            className="pl-9 h-8 text-sm"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-auto dooh-scrollbar bg-white">
        <table className="w-full text-sm text-left">
          <thead className="sticky top-0 bg-[var(--surface-background-lvl2,#f7f7fa)] shadow-sm z-10 text-gray-600 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-3 w-10">
                <input 
                  type="checkbox" 
                  checked={allSelected}
                  onChange={e => filteredAndSorted.forEach(s => onSelect(s.id, e.target.checked))}
                  aria-label="Select all visible screens"
                  className="rounded border-gray-300"
                />
              </th>
              <th className="px-4 py-3 cursor-pointer group" onClick={() => handleSort('id')}>
                <div className="flex items-center gap-1">ID <SortIcon colKey="id" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer group" onClick={() => handleSort('publisher')}>
                <div className="flex items-center gap-1">Publisher <SortIcon colKey="publisher" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer group" onClick={() => handleSort('city')}>
                <div className="flex items-center gap-1">City <SortIcon colKey="city" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer group" onClick={() => handleSort('venue')}>
                <div className="flex items-center gap-1">Venue <SortIcon colKey="venue" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer group" onClick={() => handleSort('creativeFormat')}>
                <div className="flex items-center gap-1">Format <SortIcon colKey="creativeFormat" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer group" onClick={() => handleSort('cpm')}>
                <div className="flex items-center gap-1">CPM <SortIcon colKey="cpm" /></div>
              </th>
              <th className="px-4 py-3 cursor-pointer group" onClick={() => handleSort('impressions')}>
                <div className="flex items-center gap-1">Impressions <SortIcon colKey="impressions" /></div>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--surface-background-lvl3,#ebebf0)]">
            {filteredAndSorted.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-8 text-center text-gray-500">
                  No screens match the selected filters or search query.
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
                   style={s.id === highlightedScreenId ? { backgroundColor: "var(--container-static-brand-subtle-background, #f6ebff)" } : undefined}
                  className={`hover:bg-gray-50 transition-colors ${selectedScreenIds.has(s.id) ? 'bg-blue-50/30' : ''}`}
                  onMouseEnter={() => onHover(s.id)}
                  onMouseLeave={() => onHover(null)}
                >
                  <td className="px-4 py-2">
                    <input 
                      type="checkbox" 
                      checked={selectedScreenIds.has(s.id)}
                      onChange={e => onSelect(s.id, e.target.checked)}
                       onClick={e => e.stopPropagation()}
                       aria-label={`Select ${s.id}`}
                      className="rounded border-gray-300"
                    />
                  </td>
                  <td className="px-4 py-2 font-medium">{s.id}</td>
                  <td className="px-4 py-2">{s.publisher}</td>
                  <td className="px-4 py-2">{s.city}</td>
                  <td className="px-4 py-2">{s.venue}</td>
                  <td className="px-4 py-2 text-gray-500">{s.creativeFormat}</td>
                  <td className="px-4 py-2 font-medium text-gray-700">£{s.cpm.toFixed(2)}</td>
                  <td className="px-4 py-2 text-gray-500">{(s.impressions / 1000).toFixed(1)}k</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
