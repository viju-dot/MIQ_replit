import type { GeoPlannerFilters } from "../api";

export function computeMockResults(filters: GeoPlannerFilters) {
  const points = [];
  let coverageNum = 0;
  
  const baseLat = filters.market === 'UK' ? 51.501 : filters.market === 'US' ? 40.7128 : 48.8566;
  const baseLng = filters.market === 'UK' ? -0.1416 : filters.market === 'US' ? -74.0060 : 2.3522;
  const baseCity = filters.market === 'UK' ? 'London' : filters.market === 'US' ? 'New York' : 'Paris';
  
  points.push({ postcode: `${filters.market}-1`, city: baseCity, lat: baseLat, lng: baseLng });
  
  if (filters.market === 'UK') {
    coverageNum = filters.topIndexing === '10%' ? 1200000 : filters.topIndexing === '15%' ? 2300000 : 3500000;
  } else if (filters.market === 'US') {
    coverageNum = filters.topIndexing === '10%' ? 5000000 : filters.topIndexing === '15%' ? 8000000 : 12000000;
  } else {
    coverageNum = filters.topIndexing === '10%' ? 2000000 : filters.topIndexing === '15%' ? 3500000 : 5000000;
  }
  
  // Deterministic pseudo-random generation based on filters
  const hashStr = filters.brand + filters.category + filters.intelligenceFilters.value + filters.topIndexing;
  let hash = 0;
  for (let i = 0; i < hashStr.length; i++) hash += hashStr.charCodeAt(i);
  
  const numPoints = (hash % 15) + 5; 
  for(let i = 1; i < numPoints; i++) {
     points.push({
       postcode: `${filters.market}-${i+1}`,
       city: baseCity,
       lat: baseLat + (Math.sin(hash + i) * 0.08),
       lng: baseLng + (Math.cos(hash + i) * 0.08)
     });
  }

  const details = [
    `${points.length} target zones in ${filters.market}`,
    `Targeting ${filters.mode}: ${filters.mode === 'Brand' ? filters.brand : filters.category}`,
    `Focus: ${filters.intelligenceTab} > ${filters.intelligenceFilters.value}`,
    `Indexing: Top ${filters.topIndexing} Geographies`
  ];

  if (filters.market !== 'UK') {
     details.push(`Note: DOOH inventory is currently UK only. EU/US may yield no inventory.`);
  }

  const summary = {
    avgSpend: filters.market === 'UK' ? '£250-500/month' : filters.market === 'US' ? '$300-600/month' : '€250-500/month',
    index: 100 + (hash % 60),
  };

  return {
    points,
    coverage: `${(coverageNum / 1000000).toFixed(1)}M people`,
    details,
    summary
  };
}
