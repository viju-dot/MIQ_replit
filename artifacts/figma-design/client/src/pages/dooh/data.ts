export const CITIES = [
  { name: "London", lat: 51.5074, lng: -0.1278 },
  { name: "Manchester", lat: 53.4808, lng: -2.2426 },
  { name: "Birmingham", lat: 52.4862, lng: -1.8904 },
  { name: "Leeds", lat: 53.8008, lng: -1.5491 },
  { name: "Liverpool", lat: 53.4084, lng: -2.9916 },
  { name: "Bristol", lat: 51.4545, lng: -2.5879 },
  { name: "Glasgow", lat: 55.8642, lng: -4.2518 },
  { name: "Edinburgh", lat: 55.9533, lng: -3.1883 },
  { name: "Cardiff", lat: 51.4816, lng: -3.1791 },
  { name: "Newcastle", lat: 54.9783, lng: -1.6178 },
  { name: "Sheffield", lat: 53.3811, lng: -1.4701 },
  { name: "Nottingham", lat: 52.9548, lng: -1.1581 }
];

export const PUBLISHERS = ["Clear Channel", "JCDecaux", "SOCi", "Hivestack", "Other"];
export const VENUES = ["Malls", "Roadside", "Transit", "Airport", "Conference", "Gyms", "Bus Station"];
export const CREATIVE_FORMATS = ["Display", "Video"];
export const RESOLUTIONS = ["1920x1080", "1080x1920", "3840x2160"];
export const DAYPART_PRESETS = ["Early Morning", "Morning", "Midday", "Afternoon", "Evening", "Late Night"];
export const DAYPART_RANGES: Record<string, [number, number]> = {
  "Early Morning": [5 * 60, 8 * 60],
  Morning: [8 * 60, 12 * 60],
  Midday: [12 * 60, 14 * 60],
  Afternoon: [14 * 60, 17 * 60],
  Evening: [17 * 60, 22 * 60],
  "Late Night": [22 * 60, 24 * 60],
};

export const MOCK_POSTCODES: Record<string, { lat: number; lng: number; city: string }> = {
  "SE1 7AA": { lat: 51.5074, lng: -0.1278, city: "London" },
  "W1D 3QF": { lat: 51.5126, lng: -0.1325, city: "London" },
  "SW1A 2AA": { lat: 51.5033, lng: -0.1275, city: "London" },
  "M1 1AA": { lat: 53.4808, lng: -2.2426, city: "Manchester" },
  "B1 1AA": { lat: 52.4862, lng: -1.8904, city: "Birmingham" },
  "LS1 1UR": { lat: 53.8008, lng: -1.5491, city: "Leeds" }
};

export const MOCK_POIS = [
  { id: "P1", name: "Westfield London", lat: 51.5071, lng: -0.2216, city: "London" },
  { id: "P2", name: "O2 Arena", lat: 51.5030, lng: 0.0032, city: "London" },
  { id: "P3", name: "Manchester Arndale", lat: 53.4831, lng: -2.2426, city: "Manchester" },
  { id: "P4", name: "Bullring Birmingham", lat: 52.4776, lng: -1.8943, city: "Birmingham" }
];

export interface ScreenData {
  id: string;
  lat: number;
  lng: number;
  city: string;
  publisher: string;
  venue: string;
  cpm: number;
  impressions: number;
  creativeFormat: string;
  creativeRes: string;
  /** Deterministic demo inventory window used by the daypart matcher. */
  availability: {
    days: "Every Day" | "Weekdays" | "Weekends";
    start: number;
    end: number;
  };
}

// Independent, deterministic per-screen values avoid correlating every city's
// inventory with the same format, daypart, or position (city cycles every 12).
const demoFraction = (index: number, salt: number) => {
  const value = Math.sin(index * 127.1 + salt * 311.7) * 43758.5453123;
  return value - Math.floor(value);
};

// Generate 1500 screens around city centres and POIs, with varied availability.
export const SCREENS: ScreenData[] = Array.from({ length: 1500 }).map((_, i) => {
  const city = CITIES[i % CITIES.length];
  const cityIndex = Math.floor(i / CITIES.length);
  const nearbyPois = MOCK_POIS.filter(poi => poi.city === city.name);
  const anchor = nearbyPois.length && cityIndex % 5 === 0
    ? nearbyPois[Math.floor(cityIndex / 5) % nearbyPois.length]
    : city;
  // First neighbourhood is dense enough for 500m demos; others span ~2km.
  const r = demoFraction(i, 1) * (cityIndex % 3 === 0 ? 0.003 : 0.018);
  const theta = demoFraction(i, 2) * Math.PI * 2;
  const latOffset = r * Math.cos(theta);
  const lngOffset = r * Math.sin(theta) * 1.5; // long is squished
  const windowIndex = Math.floor(demoFraction(i, 3) * 6);
  const allDay = cityIndex % 4 === 0;

  return {
    id: `S${(i + 1).toString().padStart(4, "0")}`,
    lat: anchor.lat + latOffset,
    lng: anchor.lng + lngOffset,
    city: city.name,
    publisher: PUBLISHERS[i % PUBLISHERS.length],
    venue: VENUES[i % VENUES.length],
    cpm: 10 + (i % 25),
    impressions: 50000 + (i * 13000) % 3000000,
    creativeFormat: CREATIVE_FORMATS[Math.floor(demoFraction(i, 4) * CREATIVE_FORMATS.length)],
    creativeRes: RESOLUTIONS[Math.floor(demoFraction(i, 5) * RESOLUTIONS.length)],
    availability: {
      days: (["Every Day", "Weekdays", "Weekends"] as const)[Math.floor(demoFraction(i, 6) * 3)],
      start: allDay ? 0 : [5 * 60, 8 * 60, 12 * 60, 14 * 60, 17 * 60, 22 * 60][windowIndex],
      end: allDay ? 24 * 60 : [8 * 60, 12 * 60, 14 * 60, 17 * 60, 22 * 60, 24 * 60][windowIndex],
    },
  };
});

// Haversine distance in meters
export function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371e3;
  const p1 = lat1 * Math.PI/180;
  const p2 = lat2 * Math.PI/180;
  const dp = (lat2-lat1) * Math.PI/180;
  const dl = (lon2-lon1) * Math.PI/180;
  const a = Math.sin(dp/2) * Math.sin(dp/2) +
            Math.cos(p1) * Math.cos(p2) *
            Math.sin(dl/2) * Math.sin(dl/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Ray casting algorithm for polygon point inclusion
export function isPointInPolygon(point: {lat: number, lng: number}, vs: Array<{lat: number, lng: number}>) {
  const x = point.lng, y = point.lat;
  let inside = false;
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i].lng, yi = vs[i].lat;
    const xj = vs[j].lng, yj = vs[j].lat;
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}
