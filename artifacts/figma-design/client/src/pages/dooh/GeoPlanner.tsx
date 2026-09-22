import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCreateAudience, useUpdateAudience, useAudiences, Audience } from "./api";
import { useToast } from "@/hooks/use-toast";
import { Loader2, MapPin } from "lucide-react";
import { Circle, CircleMarker, MapContainer, Polygon, Popup, TileLayer } from "react-leaflet";
import { useLocation } from "wouter";

type Point = NonNullable<Audience["geoDefinition"]["points"]>[number];

const CITY_POINTS: Record<string, Point[]> = {
  London: [
    { postcode: "SW1A 1AA", city: "London", lat: 51.5010, lng: -0.1416 },
    { postcode: "SW1A 2AA", city: "London", lat: 51.5033, lng: -0.1276 },
    { postcode: "SE1 7PB", city: "London", lat: 51.5009, lng: -0.1195 },
    { postcode: "WC2N 5DU", city: "London", lat: 51.5079, lng: -0.1281 },
    { postcode: "W1D 3QF", city: "London", lat: 51.5126, lng: -0.1325 },
    { postcode: "EC1A 1BB", city: "London", lat: 51.5192, lng: -0.0979 },
    { postcode: "EC2V 7HH", city: "London", lat: 51.5155, lng: -0.0922 },
    { postcode: "E1 6AN", city: "London", lat: 51.5194, lng: -0.0748 },
    { postcode: "SE1 9SG", city: "London", lat: 51.5045, lng: -0.0865 },
    { postcode: "NW1 2DB", city: "London", lat: 51.5299, lng: -0.1255 },
    { postcode: "W2 1HB", city: "London", lat: 51.5154, lng: -0.1755 },
    { postcode: "SW3 4RY", city: "London", lat: 51.4874, lng: -0.1686 },
  ],
  Manchester: [
    { postcode: "M1 1AD", city: "Manchester", lat: 53.4816, lng: -2.2360 },
    { postcode: "M1 2WD", city: "Manchester", lat: 53.4777, lng: -2.2307 },
    { postcode: "M1 5AN", city: "Manchester", lat: 53.4746, lng: -2.2404 },
    { postcode: "M2 3WQ", city: "Manchester", lat: 53.4794, lng: -2.2472 },
    { postcode: "M2 5DB", city: "Manchester", lat: 53.4802, lng: -2.2447 },
    { postcode: "M3 1AR", city: "Manchester", lat: 53.4862, lng: -2.2440 },
    { postcode: "M3 3HF", city: "Manchester", lat: 53.4790, lng: -2.2512 },
    { postcode: "M4 1HQ", city: "Manchester", lat: 53.4836, lng: -2.2374 },
    { postcode: "M4 3AB", city: "Manchester", lat: 53.4840, lng: -2.2302 },
    { postcode: "M5 3AA", city: "Manchester", lat: 53.4729, lng: -2.2861 },
    { postcode: "M13 9PL", city: "Manchester", lat: 53.4668, lng: -2.2339 },
    { postcode: "M15 4FN", city: "Manchester", lat: 53.4686, lng: -2.2523 },
  ],
  Birmingham: [
    { postcode: "B1 1AA", city: "Birmingham", lat: 52.4787, lng: -1.9085 },
    { postcode: "B1 1BD", city: "Birmingham", lat: 52.4775, lng: -1.9070 },
    { postcode: "B1 2EA", city: "Birmingham", lat: 52.4799, lng: -1.9148 },
    { postcode: "B2 4QA", city: "Birmingham", lat: 52.4802, lng: -1.8996 },
    { postcode: "B2 5EP", city: "Birmingham", lat: 52.4816, lng: -1.9005 },
    { postcode: "B3 2AA", city: "Birmingham", lat: 52.4845, lng: -1.9017 },
    { postcode: "B3 3AG", city: "Birmingham", lat: 52.4823, lng: -1.9052 },
    { postcode: "B4 6AF", city: "Birmingham", lat: 52.4837, lng: -1.8936 },
    { postcode: "B5 4BU", city: "Birmingham", lat: 52.4776, lng: -1.8943 },
    { postcode: "B5 6DY", city: "Birmingham", lat: 52.4737, lng: -1.8922 },
    { postcode: "B7 4BL", city: "Birmingham", lat: 52.4912, lng: -1.8818 },
    { postcode: "B15 1TR", city: "Birmingham", lat: 52.4700, lng: -1.9153 },
  ],
};

const ESTIMATED_COVERAGE: Record<string, string> = {
  London: "Estimated 2.3M population",
  Manchester: "Estimated 820K population",
  Birmingham: "Estimated 740K population",
};

function GeographyMap({ geoType, geoDefinition }: Pick<Audience, "geoType" | "geoDefinition">) {
  const points = geoDefinition.points || [];
  const polygon = geoDefinition.polygon || [];
  const centre = points[0] || polygon[0] || { lat: 51.5074, lng: -0.1278 };
  return (
    <MapContainer key={`${geoType}-${centre.lat}-${centre.lng}-${points.length}-${polygon.length}`} center={[centre.lat, centre.lng]} zoom={12} scrollWheelZoom className="w-full h-full">
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="&copy; OpenStreetMap contributors" />
      {points.map((point, index) => geoType === "radius" && index === 0 ? (
        <Circle key={index} center={[point.lat, point.lng]} radius={geoDefinition.radius || 0} pathOptions={{ color: "#7c3aed", fillColor: "#d194ff", fillOpacity: 0.25 }}>
          <Popup>{point.postcode || "Radius centre"}{point.city ? ` · ${point.city}` : ""}</Popup>
        </Circle>
      ) : (
        <CircleMarker key={index} center={[point.lat, point.lng]} radius={7} pathOptions={{ color: "#2b0030", fillColor: "#d194ff", fillOpacity: 0.85 }}>
          <Popup>{point.postcode || `${point.lat.toFixed(5)}, ${point.lng.toFixed(5)}`}{point.city ? ` · ${point.city}` : ""}</Popup>
        </CircleMarker>
      ))}
      {geoType === "polygon" && polygon.length >= 3 && (
        <Polygon positions={polygon.map(point => [point.lat, point.lng])} pathOptions={{ color: "#7c3aed", fillColor: "#d194ff", fillOpacity: 0.25 }} />
      )}
    </MapContainer>
  );
}

export default function GeoPlanner() {
  const editId = useMemo(() => new URLSearchParams(window.location.search).get("edit"), []);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [city, setCity] = useState("London");
  const [editedAudience, setEditedAudience] = useState<Audience | null>(null);
  const [saveError, setSaveError] = useState("");
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const audiencesQuery = useAudiences();
  const { mutateAsync: createAudience, isPending: isCreating } = useCreateAudience();
  const { mutateAsync: updateAudience, isPending: isUpdating } = useUpdateAudience();
  const isPending = isCreating || isUpdating;

  useEffect(() => {
    if (!editId || !audiencesQuery.data) return;
    const audience = audiencesQuery.data.find(item => item.id === editId);
    if (audience) {
      setEditedAudience(audience);
      setName(audience.name);
      const savedCity = audience.geoDefinition.points?.find(point => point.city)?.city;
      if (savedCity && CITY_POINTS[savedCity]) setCity(savedCity);
    }
  }, [editId, audiencesQuery.data]);

  const geography = editedAudience
    ? { geoType: editedAudience.geoType, geoDefinition: editedAudience.geoDefinition, coverage: editedAudience.coverage }
    : { geoType: "points" as const, geoDefinition: { points: CITY_POINTS[city], coverage: ESTIMATED_COVERAGE[city] }, coverage: ESTIMATED_COVERAGE[city] };
  const duplicate = !!audiencesQuery.data?.some(audience => audience.id !== editId && audience.name.toLowerCase() === name.trim().toLowerCase());
  const formatValid = /^[A-Za-z0-9_-]+$/.test(name);
  const validationError = name.length === 0 ? "" : name.length < 5 ? "Use at least 5 characters." : name.length > 50 ? "Use no more than 50 characters." : !formatValid ? "Only letters, numbers, hyphens and underscores are allowed." : duplicate ? "That name is already used by another audience." : "";
  const isValid = name.length >= 5 && name.length <= 50 && formatValid && !duplicate;

  const handleSave = async () => {
    if (!isValid) return;
    setSaveError("");
    const data = {
      name: name.trim(),
      geoType: geography.geoType,
      geoDefinition: geography.geoDefinition,
      coverage: geography.coverage,
    };
    try {
      if (editId) {
        if (!editedAudience) throw new Error("The audience could not be found. Retry loading it before saving.");
        await updateAudience({ id: editId, data });
      } else {
        await createAudience({ ...data, createdBy: "Alex Chen" });
      }
      toast({ title: editId ? "Audience updated" : "Saved to library", description: `${data.name} contains ${data.geoDefinition.points?.length || data.geoDefinition.polygon?.length || 0} saved locations.` });
      setModalOpen(false);
      setLocation("/saved-audiences?version=v1");
    } catch (error: any) {
      const message = error?.message || "Audience could not be saved.";
      setSaveError(message);
      toast({ title: "Save failed", description: message, variant: "destructive" });
    }
  };

  if (editId && audiencesQuery.isLoading) {
    return <div className="flex-1 flex items-center justify-center text-gray-600"><Loader2 className="mr-2 h-5 w-5 animate-spin" /> Loading saved audience…</div>;
  }
  if (audiencesQuery.isError || (editId && !editedAudience)) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center"><p className="font-semibold text-gray-900">Audience could not be loaded</p><p className="mt-1 text-sm text-gray-500">{audiencesQuery.error?.message || "This audience is unavailable or archived."}</p><Button className="mt-4" onClick={() => audiencesQuery.refetch()}>Retry</Button></div>
      </div>
    );
  }

  const pointCount = geography.geoDefinition.points?.length || geography.geoDefinition.polygon?.length || 0;
  return (
    <div className="flex-1 flex flex-col p-8 bg-[var(--surface-background-lvl2,#f7f7fa)]">
      <div className="max-w-5xl mx-auto w-full bg-white rounded-lg shadow-sm border border-[var(--surface-background-lvl4,#e1e1e8)] overflow-hidden">
        <div className="p-6 border-b border-[var(--surface-background-lvl4,#e1e1e8)]">
          <h1 className="text-2xl font-bold text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)]">{editId ? "Edit Audience" : "GEO PLANNER — Build Your Audience"}</h1>
          <p className="text-gray-500 mt-1">{editId ? "Update the saved name and geography." : "Builder demo: choose a city to preview and save its 12 demo postcode coordinates."}</p>
        </div>
        <div className="p-6 flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-1/3 space-y-6">
            {!editedAudience && (
              <div>
                <label htmlFor="demo-city" className="font-semibold mb-2 block">Demo city</label>
                <select id="demo-city" value={city} onChange={event => setCity(event.target.value)} className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm">
                  {Object.keys(CITY_POINTS).map(option => <option key={option}>{option}</option>)}
                </select>
              </div>
            )}
            <div className="rounded border border-amber-200 bg-amber-50 p-3 text-xs text-amber-900">
              <strong>Builder demo</strong><br />Price range and interests are not applied or saved because this audience API currently supports geography only.
            </div>
            <div className="p-4 bg-blue-50/50 border border-blue-100 rounded">
              <h3 className="font-semibold text-blue-900 mb-2">Current Audience Definition</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li className="flex gap-2"><MapPin className="h-4 w-4 shrink-0 mt-0.5" />{geography.geoType === "points" ? `${pointCount} postcode points${!editedAudience ? ` in ${city}` : ""}` : `${geography.geoType} geography (${pointCount} coordinates)`}</li>
                <li>{geography.coverage}</li>
              </ul>
            </div>
            <Button onClick={() => { setSaveError(""); setModalOpen(true); }} className="w-full bg-[var(--colours-blue-300,#d194ff)] text-[#2b0030] hover:bg-[#c178f7] font-bold">Save Audience</Button>
          </div>
          <div className="w-full md:w-2/3 h-[430px] bg-gray-100 rounded border border-gray-200 overflow-hidden">
            <GeographyMap geoType={geography.geoType} geoDefinition={geography.geoDefinition} />
          </div>
        </div>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>{editId ? "Update Audience" : "Name This Audience"}</DialogTitle><DialogDescription>The saved payload will contain this name and the exact {pointCount}-coordinate geography shown on the map.</DialogDescription></DialogHeader>
          <div className="py-4 space-y-3">
            <div>
              <label htmlFor="audience-name" className="text-sm font-medium mb-1.5 block">Audience Name</label>
              <Input id="audience-name" value={name} maxLength={51} onChange={event => { setName(event.target.value); setSaveError(""); }} placeholder="e.g. Cinema-Goers-London" aria-invalid={!!validationError} className={validationError ? "border-red-500" : ""} />
              <div className="flex justify-between gap-3 mt-1 text-xs"><span className={validationError ? "text-red-600" : "text-gray-500"}>{validationError || "5–50 characters; letters, numbers, hyphens or underscores."}</span><span className={name.length > 50 ? "text-red-600" : "text-gray-500"}>{name.length}/50</span></div>
            </div>
            <div className="text-xs text-gray-600 bg-gray-50 p-3 rounded border"><strong className="block text-gray-800 mb-1">Final summary</strong>{geography.geoType} · {pointCount} coordinates · {geography.coverage}</div>
            {saveError && <div role="alert" className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700">{saveError}<Button variant="link" className="h-auto p-0 ml-2 text-red-700 underline" onClick={handleSave}>Retry</Button></div>}
          </div>
          <DialogFooter><Button variant="outline" onClick={() => setModalOpen(false)} disabled={isPending}>Cancel</Button><Button onClick={handleSave} disabled={!isValid || isPending}>{isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}{editId ? "Save changes" : "Save audience"}</Button></DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}