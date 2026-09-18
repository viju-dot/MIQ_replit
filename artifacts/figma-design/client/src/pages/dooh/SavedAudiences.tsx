import { useState } from "react";
import { useAudiences, useDeleteAudience, useIncrementAudienceUse, Audience } from "./api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Circle, CircleMarker, MapContainer, Polygon, Popup, TileLayer } from "react-leaflet";
import { Search, Eye, Edit2, Trash2, Users, MapPin, Play, Loader2, AlertCircle } from "lucide-react";
import { useLocation, Link } from "wouter";
import { format } from "date-fns";

type DisplayPoint = { lat: number; lng: number; postcode?: string; city?: string };

function AudiencePreview({ audience, onUse, isUsing }: { audience: Audience; onUse: () => void; isUsing: boolean }) {
  const points = audience.geoDefinition.points || [];
  const polygon = audience.geoDefinition.polygon || [];
  const centre = points[0] || polygon[0] || { lat: 54.5, lng: -3 };
  const metadataPoints: DisplayPoint[] = points.length ? points : polygon;
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-4">
      <div className="space-y-4 text-sm min-w-0">
        <div><strong className="block text-gray-500 mb-1 text-xs uppercase tracking-wide">Created by</strong><p>{audience.createdBy}</p><p className="text-gray-400 text-xs">{format(new Date(audience.createdDate), "PPP")}</p></div>
        <div><strong className="block text-gray-500 mb-1 text-xs uppercase tracking-wide">Geography</strong><p className="capitalize">{audience.geoType} · {metadataPoints.length} coordinate{metadataPoints.length === 1 ? "" : "s"}{audience.geoType === "radius" && audience.geoDefinition.radius ? ` · ${audience.geoDefinition.radius.toLocaleString()}m radius` : ""}</p></div>
        <div><strong className="block text-gray-500 mb-1 text-xs uppercase tracking-wide">Coverage</strong><p>{audience.coverage}</p></div>
        <div><strong className="block text-gray-500 mb-1 text-xs uppercase tracking-wide">Usage</strong><p>Used {audience.usageCount} times</p></div>
        <div>
          <strong className="block text-gray-500 mb-1 text-xs uppercase tracking-wide">All saved coordinates</strong>
          <ol className="max-h-40 overflow-y-auto rounded border border-gray-100 divide-y divide-gray-100">
            {metadataPoints.map((point, index) => (
              <li key={`${point.lat}-${point.lng}-${index}`} className="px-2 py-1.5 text-xs text-gray-600">
                <span className="font-medium text-gray-800">{point.postcode || `Point ${index + 1}`}</span>{point.city ? ` · ${point.city}` : ""}<span className="block text-gray-400">{point.lat.toFixed(5)}, {point.lng.toFixed(5)}</span>
              </li>
            ))}
          </ol>
        </div>
        <Button onClick={onUse} disabled={isUsing} className="w-full bg-[var(--surface-background-miq,#2b0030)] text-white hover:bg-[#440140]">{isUsing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Play className="w-4 h-4 mr-2" />}Use This Audience</Button>
      </div>
      <div className="md:col-span-2 h-[430px] bg-gray-100 rounded border border-gray-200 relative overflow-hidden">
        <MapContainer key={audience.id} center={[centre.lat, centre.lng]} zoom={audience.geoType === "radius" ? 11 : 12} className="w-full h-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
          {points.map((point, index) => audience.geoType === "radius" && index === 0 ? (
            <Circle key={index} center={[point.lat, point.lng]} radius={audience.geoDefinition.radius || 0} pathOptions={{ color: "#7c3aed", fillColor: "#d194ff", fillOpacity: 0.25 }}><Popup>{point.postcode || "Radius centre"}{point.city ? ` · ${point.city}` : ""}</Popup></Circle>
          ) : (
            <CircleMarker key={index} center={[point.lat, point.lng]} radius={7} pathOptions={{ color: "#2b0030", fillColor: "#d194ff", fillOpacity: 0.85 }}><Popup>{point.postcode || `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`}{point.city ? ` · ${point.city}` : ""}</Popup></CircleMarker>
          ))}
          {audience.geoType === "polygon" && polygon.length >= 3 && <Polygon positions={polygon.map(point => [point.lat, point.lng])} pathOptions={{ color: "#7c3aed", fillColor: "#d194ff", fillOpacity: 0.25 }} />}
        </MapContainer>
      </div>
    </div>
  );
}

export default function SavedAudiences() {
  const audiencesQuery = useAudiences();
  const [search, setSearch] = useState("");
  const [previewAudience, setPreviewAudience] = useState<Audience | null>(null);
  const [archiveAudience, setArchiveAudience] = useState<Audience | null>(null);
  const { mutateAsync: deleteAudience, isPending: isArchiving } = useDeleteAudience();
  const { mutateAsync: useAudience, isPending: isUsing } = useIncrementAudienceUse();
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const audiences = audiencesQuery.data || [];
  const filtered = audiences.filter(audience => audience.isActive && audience.name.toLowerCase().includes(search.toLowerCase()));

  const handleUse = async (id: string) => {
    try {
      await useAudience(id);
      setLocation(`/dooh-planner?audience=${encodeURIComponent(id)}`);
    } catch (error: any) {
      toast({ title: "Audience could not be used", description: error?.message || "Please try again.", variant: "destructive" });
    }
  };
  const handleArchive = async () => {
    if (!archiveAudience) return;
    try {
      await deleteAudience(archiveAudience.id);
      toast({ title: "Audience archived", description: `${archiveAudience.name} is no longer available for new plans.` });
      setArchiveAudience(null);
      if (previewAudience?.id === archiveAudience.id) setPreviewAudience(null);
    } catch (error: any) {
      toast({ title: "Archive failed", description: error?.message || "Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-[var(--surface-background-lvl2,#f7f7fa)]">
      <div className="p-8 pb-4 shrink-0">
        <div className="flex flex-wrap gap-4 justify-between items-end mb-6">
          <div><h1 className="text-2xl font-bold text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)]">Saved Audiences</h1><p className="text-gray-500 mt-1">Total saved: {audiences.filter(audience => audience.isActive).length} audiences</p></div>
          <Link href="/geo-planner" className="bg-[var(--colours-blue-300,#d194ff)] text-[#2b0030] hover:bg-[#c178f7] h-10 px-4 py-2 rounded-md font-medium text-sm flex items-center justify-center">+ Create New</Link>
        </div>
        <div className="relative max-w-md mb-6"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /><Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Type to filter by name..." className="pl-10" />{search && <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-blue-500">Clear</button>}</div>
      </div>
      <div className="flex-1 min-w-0 overflow-auto px-4 md:px-8 pb-24">
        {audiencesQuery.isError ? (
          <div className="bg-white rounded-lg border p-10 text-center"><AlertCircle className="w-7 h-7 text-red-500 mx-auto mb-2" /><p className="font-semibold">Saved audiences could not be loaded</p><p className="text-sm text-gray-500 mt-1">{audiencesQuery.error.message}</p><Button className="mt-4" onClick={() => audiencesQuery.refetch()}>Retry</Button></div>
        ) : (
          <div>
            <p className="text-xs text-gray-600 mb-2 md:hidden">Swipe the table horizontally to reach Preview, Edit, Archive and Use.</p>
            <div role="region" aria-label="Saved audiences — scroll horizontally for row actions" tabIndex={0} className="bg-white rounded-lg shadow-sm border border-[var(--surface-background-lvl4,#e1e1e8)] overflow-x-auto" style={{ maxWidth: "100%" }}>
            <table className="w-full text-sm text-left" style={{ minWidth: 1000 }}>
              <thead className="bg-gray-50 text-gray-500 uppercase text-xs tracking-wider border-b border-gray-200"><tr><th className="px-6 py-4">Name</th><th className="px-6 py-4">Geography</th><th className="px-6 py-4">Coverage</th><th className="px-6 py-4">Usage</th><th className="px-6 py-4">Created</th><th className="px-6 py-4 text-right">Actions</th></tr></thead>
              <tbody className="divide-y divide-gray-100">
                {audiencesQuery.isLoading ? <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500"><Loader2 className="w-5 h-5 mx-auto mb-2 animate-spin" />Loading audiences…</td></tr> : filtered.length === 0 ? <tr><td colSpan={6} className="px-6 py-12 text-center text-gray-500">{search ? "No audiences match this search." : "No saved audiences yet."}</td></tr> : filtered.map(audience => (
                  <tr key={audience.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{audience.name}</td>
                    <td className="px-6 py-4 text-gray-600"><div className="flex items-center gap-1"><MapPin className="w-3 h-3" />{audience.geoType === "points" ? `${audience.geoDefinition.points?.length || 0} points` : audience.geoType === "polygon" ? `Polygon · ${audience.geoDefinition.polygon?.length || 0} vertices` : `Radius · ${audience.geoDefinition.radius?.toLocaleString() || "—"}m`}</div></td>
                    <td className="px-6 py-4 text-gray-600"><div className="flex items-center gap-1"><Users className="w-3 h-3" />{audience.coverage}</div></td>
                    <td className="px-6 py-4 text-gray-600"><span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">{audience.usageCount}×</span></td>
                    <td className="px-6 py-4 text-gray-600">{format(new Date(audience.createdDate), "MMM d, yyyy")}<span className="block text-xs text-gray-400">by {audience.createdBy}</span></td>
                    <td className="px-6 py-4 text-right space-x-2"><Button aria-label={`Preview ${audience.name}`} variant="ghost" size="sm" onClick={() => setPreviewAudience(audience)} className="h-8 px-2 text-gray-600"><Eye className="w-4 h-4" /></Button><Link aria-label={`Edit ${audience.name}`} href={`/geo-planner?edit=${encodeURIComponent(audience.id)}`} className="inline-flex items-center justify-center rounded-md hover:bg-accent h-8 px-2 text-gray-600"><Edit2 className="w-4 h-4" /></Link><Button aria-label={`Archive ${audience.name}`} variant="ghost" size="sm" onClick={() => setArchiveAudience(audience)} className="h-8 px-2 text-red-600 hover:bg-red-50"><Trash2 className="w-4 h-4" /></Button><Button onClick={() => handleUse(audience.id)} disabled={isUsing} size="sm" className="h-8 bg-[var(--surface-background-miq,#2b0030)] text-white hover:bg-[#440140]">Use</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}
      </div>

      <Dialog open={!!previewAudience} onOpenChange={open => !open && setPreviewAudience(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto"><DialogHeader><DialogTitle className="flex items-center gap-2"><Eye className="w-5 h-5 text-gray-400" />Preview: {previewAudience?.name}</DialogTitle></DialogHeader>{previewAudience && <AudiencePreview audience={previewAudience} onUse={() => handleUse(previewAudience.id)} isUsing={isUsing} />}</DialogContent>
      </Dialog>
      <Dialog open={!!archiveAudience} onOpenChange={open => !open && setArchiveAudience(null)}>
        <DialogContent className="sm:max-w-sm"><DialogHeader><DialogTitle>Archive “{archiveAudience?.name}”?</DialogTitle></DialogHeader><p className="py-4 text-sm text-gray-600">This audience will no longer be available for new DOOH plans. Existing plan data is not changed.</p><div className="flex justify-end gap-2"><Button variant="outline" onClick={() => setArchiveAudience(null)} disabled={isArchiving}>Cancel</Button><Button variant="destructive" onClick={handleArchive} disabled={isArchiving}>{isArchiving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Archive audience</Button></div></DialogContent>
      </Dialog>
    </div>
  );
}