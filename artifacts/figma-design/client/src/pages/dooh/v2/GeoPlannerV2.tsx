import { useEffect, useMemo, useState, useRef } from "react";
import { useLocation, useSearch, Link } from "wouter";
import { Button } from "@/components/ui/button";
import { MapPin, Info, Save, ChevronRight, Trash2 } from "lucide-react";
import { CircleMarker, MapContainer, Popup, TileLayer } from "react-leaflet";
import { useAudiences, GeoPlannerFilters, type Audience } from "../api";
import { SmartCard, SearchableDropdown, TabsBarUnderline, FiberButton, IconButton } from "./primitives";
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

type DraftFilters = Omit<GeoPlannerFilters, "market" | "mode" | "topIndexing"> & {
  market: GeoPlannerFilters["market"] | "";
  mode: GeoPlannerFilters["mode"] | "";
  topIndexing: GeoPlannerFilters["topIndexing"] | "";
};

const EMPTY_FILTERS: DraftFilters = {
  market: "", mode: "", brand: "", category: "",
  intelligenceTab: "Audience",
  intelligenceFilters: { category: "", feature: "", value: "", logic: "" },
  topIndexing: "",
};

function completeFilters(filters: DraftFilters): filters is GeoPlannerFilters {
  return Boolean(
    filters.market && filters.mode && filters.intelligenceTab && filters.topIndexing &&
    (filters.mode === "Brand" ? filters.brand : filters.category) &&
    Object.values(filters.intelligenceFilters).every(value => value.trim().length > 0)
  );
}

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
  const [, setLocation] = useLocation();
  const search = useSearch();
  const { editId, version } = useMemo(() => {
    const params = new URLSearchParams(search);
    return {
      editId: params.get("edit"),
      version: params.get("version") || "v2",
    };
  }, [search]);
  const encodedVersion = encodeURIComponent(version);
  
  const [filters, setFilters] = useState<DraftFilters>(() =>
    new URLSearchParams(search).get("reset") === "1" ? EMPTY_FILTERS : DEFAULT_FILTERS
  );
  const [submittedFilters, setSubmittedFilters] = useState<GeoPlannerFilters | null>(null);
  
  const [modalOpen, setModalOpen] = useState(false);
  const [savedAudience, setSavedAudience] = useState<Audience | null>(null);
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

  const handleClearIntelligence = () => {
    setFilters(prev => ({
      ...prev,
      intelligenceFilters: DEFAULT_FILTERS.intelligenceFilters
    }));
  };

  const isDirty = !submittedFilters || JSON.stringify(filters) !== JSON.stringify(submittedFilters);
  const hasValidFilters = completeFilters(filters);
  const filtersApplied = !!submittedFilters && !isDirty;

  const handleClearAll = () => {
    setFilters(EMPTY_FILTERS);
    setSubmittedFilters(null);
    setInitialGeography(null);
    setSavedAudience(null);
    setModalOpen(false);
    setIsV1Audience(false);
    initializedEditId.current = null;
    // Start a new draft rather than accidentally updating a saved audience.
    if (editId) setLocation(`/geo-planner?version=${encodedVersion}&reset=1`);
  };

  const handleSubmit = () => {
    if (!completeFilters(filters) || isV1Audience) return;
    setSavedAudience(null);
    setSubmittedFilters(filters);
    setInitialGeography(null);
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
            else setLocation(`/saved-audiences?version=${encodedVersion}`);
          }}>
            {audiencesQuery.isError ? "Retry" : "Back to Saved Audiences"}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="v2-layout dooh-scrollbar w-full relative">
      {isV1Audience && (
        <div className="rounded border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          This audience was created in the original Geo Planner and lacks V2 filters.
          <Link href={`/geo-planner?version=v1&edit=${editId}`} className="ml-2 font-semibold underline text-amber-800 hover:text-amber-950">
            Open original editor
          </Link>
        </div>
      )}

      {/* Filters Card */}
      <SmartCard title="Filters">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <SearchableDropdown 
            id="market-filter"
            label="Market"
            value={filters.market}
            onChange={v => handleFilterChange('market', v)}
            options={[
              { value: "UK", label: "UK" },
              { value: "EU", label: "EU" },
              { value: "US", label: "US" }
            ]}
          />
          <SearchableDropdown 
            id="mode-filter"
            label="Mode"
            value={filters.mode}
            onChange={v => handleFilterChange('mode', v)}
            options={[
              { value: "Brand", label: "Brand" },
              { value: "Product", label: "Product" },
              { value: "Category", label: "Category" }
            ]}
          />
          <SearchableDropdown 
            id="brand-filter"
            label="Brand"
            value={filters.brand}
            onChange={v => handleFilterChange('brand', v)}
            options={[
              { value: "& OTHER STORIES", label: "& OTHER STORIES" },
              { value: "Brand A", label: "Brand A" },
              { value: "Brand B", label: "Brand B" }
            ]}
          />
          <SearchableDropdown 
            id="category-filter"
            label="Category"
            value={filters.category}
            onChange={v => handleFilterChange('category', v)}
            options={[
              { value: "Other", label: "Other" },
              { value: "Electronics", label: "Electronics" },
              { value: "Fashion", label: "Fashion" }
            ]}
          />
        </div>
      </SmartCard>

      {/* Select Intelligence Card */}
      <SmartCard 
        title="Select Intelligence"
        rightOnDivider
        right={
          <TabsBarUnderline 
            options={['Audience', 'Commerce', 'TV', 'POI']}
            value={filters.intelligenceTab}
            onChange={v => handleFilterChange('intelligenceTab', v)}
          />
        }
      >
        <div className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-4 gap-4">
            <SearchableDropdown 
              id="intelligence-category"
              label="Category"
              value={filters.intelligenceFilters.category}
              onChange={v => handleFilterChange('intelligenceFilters.category', v)}
              options={[{ value: "Consumer Behaviour", label: "Consumer Behaviour" }]}
            />
            <SearchableDropdown 
              id="intelligence-feature"
              label="Feature"
              value={filters.intelligenceFilters.feature}
              onChange={v => handleFilterChange('intelligenceFilters.feature', v)}
              options={[{ value: "Alcohol", label: "Alcohol" }]}
            />
            <SearchableDropdown 
              id="intelligence-value"
              label="Value"
              value={filters.intelligenceFilters.value}
              onChange={v => handleFilterChange('intelligenceFilters.value', v)}
              options={[{ value: "Avg Spend On Beer Lager Ciders", label: "Average Spend On Beer Lager Ciders" }]}
            />
            <SearchableDropdown 
              id="intelligence-logic"
              label="Logic"
              value={filters.intelligenceFilters.logic}
              onChange={v => handleFilterChange('intelligenceFilters.logic', v)}
              options={[
                { value: "None", label: "None" },
                { value: "AND", label: "AND" },
                { value: "OR", label: "OR" }
              ]}
            />
          </div>
          <div className="mb-[2px]">
            <IconButton 
              icon={Trash2}
              onClick={handleClearIntelligence}
              ariaLabel="Clear filters"
            />
          </div>
        </div>
        
        <div className="mt-8 flex flex-col sm:flex-row items-end justify-between gap-4">
          <div className="w-full sm:w-64">
            <SearchableDropdown 
              id="top-indexing"
              label="Top Indexing Geos"
              value={filters.topIndexing}
              onChange={v => handleFilterChange('topIndexing', v)}
              options={[
                { value: "10%", label: "10%" },
                { value: "15%", label: "15%" },
                { value: "20%", label: "20%" }
              ]}
            />
          </div>
          <FiberButton 
            onClick={filtersApplied ? handleClearAll : handleSubmit}
            disabled={isV1Audience || (!filtersApplied && !hasValidFilters)}
          >
            {filtersApplied ? "Clear all" : "Apply filter"}
          </FiberButton>
        </div>
      </SmartCard>

      {/* Results Section */}
      {results && submittedFilters ? (
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          <div className="space-y-6">
            <div className="v2-card">
              <h3 className="text-[16px] font-bold text-[var(--dooh-purple)] mb-4 flex items-center">
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
      ) : null}

      {/* Bottom Save Bar */}
      {savedAudience && (
        <div role="status" className="p-4 text-sm" style={{ background: "var(--surface-background-lvl1, #ffffff)", color: "var(--surface-foreground-static-neutral-lvl1, #13131a)" }}>
          <strong>{savedAudience.name}</strong> has been saved. It is now available in DOOH’s Saved Audience dropdown.{" "}
          <Link href={`/dooh-planner?version=${encodedVersion}&audience=${encodeURIComponent(savedAudience.id)}`} className="underline font-medium">Use in DOOH</Link>
        </div>
      )}
      <div className="geo-save-bar">
        <div>
          <FiberButton 
            variant="solid"
            onClick={() => setModalOpen(true)}
            disabled={modalOpen || isDirty || !submittedFilters || !hasValidFilters || !results?.points.length || isV1Audience}
          >
            <Save className="w-4 h-4" aria-hidden="true" />
            Save audience
          </FiberButton>
        </div>
      </div>

      {results && submittedFilters && (
        <SaveAudienceV2 
          open={modalOpen} 
          onOpenChange={setModalOpen}
          editId={editId}
          geography={{ points: results.points, coverage: results.coverage }}
          filters={submittedFilters}
          version={version}
          onSuccess={setSavedAudience}
        />
      )}
    </div>
  );
}