import { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useSearch, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin, Info, Save, ChevronRight, Activity } from "lucide-react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { useAudiences, GeoPlannerFilters } from "../api";
import { computeMockResults } from "./geoMock";
import { SaveAudienceV2 } from "./SaveAudienceV2";
import "./GeoPlannerV2.css";

const DEFAULT_FILTERS: GeoPlannerFilters = {
  market: 'UK',
  mode: 'Brand',
  brand: '& OTHER STORIES',
  category: 'Other',
  intelligenceTab: 'Audience',
  intelligenceFilters: {
    category: 'Consumer Behaviour',
    feature: 'Alcohol',
    value: 'Avg Spend On Beer Lager Ciders',
    logic: 'None'
  },
  topIndexing: '15%'
};

function MapView({ points, market }: { points: any[], market: string }) {
  const centerLat = market === 'UK' ? 51.5074 : market === 'US' ? 40.7128 : 48.8566;
  const centerLng = market === 'UK' ? -0.1278 : market === 'US' ? -74.0060 : 2.3522;
  
  return (
    <MapContainer 
      key={`${market}-${points.length}`} 
      center={[centerLat, centerLng]} 
      zoom={market === 'UK' ? 6 : 5} 
      scrollWheelZoom 
      className="w-full h-full z-10"
    >
      <TileLayer 
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" 
        attribution="&copy; OpenStreetMap contributors" 
      />
      {points.map((point, index) => (
        <CircleMarker 
          key={index} 
          center={[point.lat, point.lng]} 
          radius={8} 
          pathOptions={{ 
            color: "#ffffff", 
            weight: 2,
            fillColor: "var(--dooh-accent, #7c3aed)", 
            fillOpacity: 0.8 
          }}
        >
          <Popup>
            <div className="font-semibold">{point.postcode}</div>
            <div className="text-gray-600">{point.city}</div>
          </Popup>
        </CircleMarker>
      ))}
    </MapContainer>
  );
}

export default function GeoPlannerV2() {
  const [locationStr, setLocation] = useLocation();
  const search = useSearch();
  const editId = useMemo(() => new URLSearchParams(search).get("edit"), [search]);
  
  const [filters, setFilters] = useState<GeoPlannerFilters>(DEFAULT_FILTERS);
  const [submittedFilters, setSubmittedFilters] = useState<GeoPlannerFilters | null>(null);
  
  const [modalOpen, setModalOpen] = useState(false);
  const audiencesQuery = useAudiences();

  const initializedEditId = useRef<string | null>(null);
  const [isV1Audience, setIsV1Audience] = useState(false);
  const [initialGeography, setInitialGeography] = useState<{points: any[], coverage: string} | null>(null);

  // Load snapshot if editing
  useEffect(() => {
    if (editId && audiencesQuery.data) {
      if (initializedEditId.current !== editId) {
        const audience = audiencesQuery.data.find(a => a.id === editId);
        if (audience) {
          const savedFilters = audience.plannerFilters;
          if (savedFilters) {
            setFilters(savedFilters);
            setSubmittedFilters(savedFilters);
            setIsV1Audience(false);
            setInitialGeography({
              points: audience.geoDefinition?.points || [],
              coverage: audience.coverage || ""
            });
          } else {
            // Fallback if editing an old V1 audience
            setIsV1Audience(true);
            setInitialGeography(null);
          }
          initializedEditId.current = editId;
        }
      }
    } else if (!editId && initializedEditId.current !== null) {
      initializedEditId.current = null;
      setIsV1Audience(false);
      setInitialGeography(null);
      setFilters(DEFAULT_FILTERS);
      setSubmittedFilters(null);
    }
  }, [editId, audiencesQuery.data]);

  const handleFilterChange = (path: string, value: string) => {
    setFilters(prev => {
      const parts = path.split('.');
      if (parts.length === 1) {
        return { ...prev, [path]: value };
      } else {
        return {
          ...prev,
          [parts[0]]: {
            ...(prev as any)[parts[0]],
            [parts[1]]: value
          }
        };
      }
    });
  };

  const isDirty = !submittedFilters || JSON.stringify(filters) !== JSON.stringify(submittedFilters);

  const handleSubmit = () => {
    setSubmittedFilters(filters);
  };

  const results = useMemo(() => {
    if (!submittedFilters) return null;
    const mock = computeMockResults(submittedFilters);
    if (!isDirty && initialGeography) {
       return { ...mock, points: initialGeography.points, coverage: initialGeography.coverage };
    }
    return mock;
  }, [submittedFilters, isDirty, initialGeography]);

  const notFound = editId && !audiencesQuery.isLoading && !audiencesQuery.data?.find(a => a.id === editId);

  // Loading/Error states
  if (editId && audiencesQuery.isLoading) {
    return <div className="flex-1 flex items-center justify-center text-gray-600">Loading audience...</div>;
  }
  
  if (editId && (audiencesQuery.isError || notFound)) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <p className="font-semibold text-gray-900">{audiencesQuery.isError ? "Failed to load audience" : "Audience not found"}</p>
          <p className="text-sm text-gray-500 mt-2">
            {audiencesQuery.isError ? "Cannot fetch the audience details from the server." : "The requested audience does not exist or has been deleted."}
          </p>
          <Button className="mt-4" onClick={() => {
            if (audiencesQuery.isError) audiencesQuery.refetch();
            else setLocation('/saved-audiences?version=v2');
          }}>
            {audiencesQuery.isError ? "Retry" : "Back to Saved Audiences"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="dooh-theme v2-layout flex-1 w-full min-h-[calc(100dvh-70px)]">
      {/* Left Sidebar - Filters Panel */}
      <div className="v2-sidebar">
        <div className="v2-sidebar-content dooh-scrollbar">
          <h2 className="text-lg font-bold mb-6 text-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)]">
            Filters
          </h2>

          <div className="v2-filter-group">
            <label className="v2-filter-label">Market</label>
            <select 
              value={filters.market} 
              onChange={e => handleFilterChange('market', e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[var(--dooh-purple)] focus:ring-1 focus:ring-[var(--dooh-purple)] outline-none"
            >
              <option value="UK">UK</option>
              <option value="EU">EU</option>
              <option value="US">US</option>
            </select>
          </div>

          <div className="v2-filter-group">
            <label className="v2-filter-label">Mode</label>
            <select 
              value={filters.mode} 
              onChange={e => handleFilterChange('mode', e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[var(--dooh-purple)] focus:ring-1 focus:ring-[var(--dooh-purple)] outline-none"
            >
              <option value="Brand">Brand</option>
              <option value="Product">Product</option>
              <option value="Category">Category</option>
            </select>
          </div>

          <div className="v2-filter-group">
            <label className="v2-filter-label">Brand</label>
            <select 
              value={filters.brand} 
              onChange={e => handleFilterChange('brand', e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[var(--dooh-purple)] focus:ring-1 focus:ring-[var(--dooh-purple)] outline-none"
            >
              <option value="& OTHER STORIES">& OTHER STORIES</option>
              <option value="Brand A">Brand A</option>
              <option value="Brand B">Brand B</option>
            </select>
          </div>

          <div className="v2-filter-group">
            <label className="v2-filter-label">Category</label>
            <select 
              value={filters.category} 
              onChange={e => handleFilterChange('category', e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-[var(--dooh-purple)] focus:ring-1 focus:ring-[var(--dooh-purple)] outline-none"
            >
              <option value="Other">Other</option>
              <option value="Electronics">Electronics</option>
              <option value="Fashion">Fashion</option>
            </select>
          </div>

          <hr className="my-6 border-[var(--surface-background-lvl4,#e1e1e8)]" />

          <div className="v2-filter-group">
            <label className="v2-filter-label">Select Intelligence</label>
            <div className="flex w-full rounded-md overflow-hidden border border-gray-300">
              {['Audience', 'Commerce', 'TV', 'POI'].map(tab => (
                <button
                  key={tab}
                  onClick={() => handleFilterChange('intelligenceTab', tab)}
                  className={`flex-1 py-1.5 text-xs font-medium text-center ${
                    filters.intelligenceTab === tab 
                      ? 'bg-[var(--dooh-purple)] text-white' 
                      : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="v2-filter-group space-y-3">
            <label className="v2-filter-label">Intelligence Filters</label>
            <div>
              <div className="text-xs text-gray-500 mb-1">Category</div>
              <select 
                value={filters.intelligenceFilters.category} 
                onChange={e => handleFilterChange('intelligenceFilters.category', e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="Consumer Behaviour">Consumer Behaviour</option>
              </select>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Feature</div>
              <select 
                value={filters.intelligenceFilters.feature} 
                onChange={e => handleFilterChange('intelligenceFilters.feature', e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="Alcohol">Alcohol</option>
              </select>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Value</div>
              <select 
                value={filters.intelligenceFilters.value} 
                onChange={e => handleFilterChange('intelligenceFilters.value', e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="Avg Spend On Beer Lager Ciders">Avg Spend On Beer Lager Ciders</option>
              </select>
            </div>
            <div>
              <div className="text-xs text-gray-500 mb-1">Logic</div>
              <select 
                value={filters.intelligenceFilters.logic} 
                onChange={e => handleFilterChange('intelligenceFilters.logic', e.target.value)}
                className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
              >
                <option value="None">None</option>
                <option value="AND">AND</option>
                <option value="OR">OR</option>
              </select>
            </div>
          </div>

          <div className="v2-filter-group">
            <label className="v2-filter-label">Top Indexing Geos</label>
            <select 
              value={filters.topIndexing} 
              onChange={e => handleFilterChange('topIndexing', e.target.value)}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm"
            >
              <option value="10%">10%</option>
              <option value="15%">15%</option>
              <option value="20%">20%</option>
            </select>
          </div>

          <Button 
            onClick={handleSubmit} 
            className="w-full bg-[var(--surface-foreground-dynamic-neutral-default-regular,#4b4b59)] text-white hover:bg-gray-700"
            disabled={!isDirty}
          >
            {isDirty ? "Submit & Compute" : "Up to date"}
          </Button>
        </div>

        {/* Bottom Action Bar */}
        <div className="v2-bottom-bar">
          <Button 
            onClick={() => setModalOpen(true)}
            className="bg-[var(--dooh-purple)] text-white hover:bg-[#400047]"
            disabled={isDirty || !submittedFilters || isV1Audience}
          >
            <Save className="w-4 h-4 mr-2" />
            Save Audience
          </Button>
        </div>
      </div>

      {/* Center - Main Content Area */}
      <div className="v2-main dooh-scrollbar">
        <div className="mb-2">
          <h1 className="text-2xl font-bold text-[var(--dooh-purple)] flex items-center">
            <Activity className="w-6 h-6 mr-2 text-[var(--dooh-accent)]" />
            Geo Planner
          </h1>
          <p className="text-gray-500 mt-1">Select filters and intelligence to build your target audience, then save for reuse.</p>
        </div>

        {isV1Audience && (
          <div className="mb-6 rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
            This audience was created in the original Geo Planner and lacks V2 filters.
            <Link href={`/geo-planner?version=v1&edit=${editId}`} className="ml-2 font-semibold underline text-amber-800 hover:text-amber-950">
              Open original editor
            </Link>
          </div>
        )}

        {results && submittedFilters ? (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            <div className="space-y-6">
              <div className="v2-card">
                <h3 className="text-lg font-bold text-[var(--dooh-purple)] mb-4 flex items-center">
                  <MapPin className="w-5 h-5 mr-2 text-[var(--dooh-accent)]" />
                  Audience Definition
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  {results.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start">
                      <ChevronRight className="w-4 h-4 mr-2 mt-0.5 text-gray-400 shrink-0" />
                      <span className={detail.startsWith('Note:') ? 'text-amber-600 font-medium' : ''}>
                        {detail}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="v2-card">
                  <h3 className="text-md font-bold text-gray-600 mb-2">Coverage</h3>
                  <div className="text-3xl font-bold text-[var(--dooh-purple)]">
                    {results.coverage}
                  </div>
                </div>

                <div className="v2-card">
                  <h3 className="text-md font-bold text-gray-600 mb-2 flex items-center">
                    Intelligence Summary
                    <Info className="w-3 h-3 ml-2 text-gray-400" />
                  </h3>
                  <div className="text-sm text-gray-700 space-y-1">
                    <div><span className="text-gray-500">Average Spend:</span> <strong className="text-gray-900">{results.summary.avgSpend}</strong></div>
                    <div><span className="text-gray-500">Index:</span> <strong className="text-gray-900">{results.summary.index}</strong> <span className="text-xs text-gray-400">(Avg: 100)</span></div>
                  </div>
                </div>
              </div>
            </div>

            <div className="v2-card p-0 overflow-hidden flex flex-col">
              <div className="p-4 border-b border-gray-100 bg-gray-50">
                <h3 className="font-bold text-gray-700">Geographic Distribution</h3>
              </div>
              <div className="flex-1 min-h-[400px]">
                <MapView points={results.points} market={submittedFilters.market} />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl bg-gray-50 text-gray-400 p-12">
            <Activity className="w-12 h-12 mb-4 text-gray-300" />
            <h3 className="text-lg font-semibold text-gray-600">No Audience Computed</h3>
            <p className="mt-2 text-sm max-w-md text-center">Select your desired filters from the left panel and click "Submit & Compute" to generate the deterministic mock results.</p>
          </div>
        )}
      </div>

      {results && submittedFilters && (
        <SaveAudienceV2 
          open={modalOpen} 
          onOpenChange={setModalOpen}
          editId={editId}
          geography={{ points: results.points, coverage: results.coverage }}
          filters={submittedFilters}
        />
      )}
    </div>
  );
}
