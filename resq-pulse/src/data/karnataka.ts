/**
 * Karnataka Data - Frontend mirror of the backend dataset
 * Contains hospitals and traffic signals for all major cities
 */

export interface Hospital {
  id: string;
  name: string;
  city: string;
  area: string;
  coords: [number, number]; // [lng, lat]
  type: string;
  emergency: boolean;
}

export interface TrafficSignal {
  id: string;
  name: string;
  city: string;
  area: string;
  coords: [number, number]; // [lng, lat]
  congestion: number;
  status: "NORMAL_CYCLE" | "HANDOFF_SIGNAL" | "GREEN_WAVE_ACTIVE";
}

export interface FallbackRoute {
  id: string;
  name: string;
  description: string;
  pickup: { name: string; coords: [number, number] };
  hospital: { name: string; coords: [number, number] };
  polyline: [number, number][];
  signal_ids: string[];
  distance_km: number;
  estimated_time_mins: number;
}

// ─── City Presets ────────────────────────────────────────────────────────────

export const CITY_PRESETS: Record<string, { center: [number, number]; zoom: number; name: string }> = {
  bangalore: { center: [77.5946, 12.9716], zoom: 12, name: "Bangalore" },
  belagavi: { center: [74.5050, 15.8520], zoom: 13, name: "Belagavi" },
  mysuru: { center: [76.6520, 12.3100], zoom: 13, name: "Mysuru" },
  hubli: { center: [75.1390, 15.3517], zoom: 13, name: "Hubli-Dharwad" },
  mangaluru: { center: [74.8560, 12.8700], zoom: 13, name: "Mangaluru" },
};

// ─── Hospitals ───────────────────────────────────────────────────────────────

export const HOSPITALS: Hospital[] = [
  // Bangalore
  { id: "HOSP-BLR-001", name: "St. John's Medical College Hospital", city: "Bangalore", area: "Koramangala", coords: [77.6210, 12.9302], type: "Multispecialty", emergency: true },
  { id: "HOSP-BLR-002", name: "Manipal Hospital (Old Airport Road)", city: "Bangalore", area: "Old Airport Road", coords: [77.6412, 12.9592], type: "Multispecialty", emergency: true },
  { id: "HOSP-BLR-003", name: "Fortis Hospital (Bannerghatta Road)", city: "Bangalore", area: "Bannerghatta Road", coords: [77.5952, 12.8943], type: "Multispecialty", emergency: true },
  { id: "HOSP-BLR-004", name: "Sakra World Hospital", city: "Bangalore", area: "Bellandur", coords: [77.6780, 12.9250], type: "Multispecialty", emergency: true },
  { id: "HOSP-BLR-005", name: "Apollo Hospital", city: "Bangalore", area: "Bannerghatta Road", coords: [77.5960, 12.8870], type: "Multispecialty", emergency: true },
  { id: "HOSP-BLR-006", name: "Narayana Health City", city: "Bangalore", area: "Bommasandra", coords: [77.6620, 12.8010], type: "Super Specialty", emergency: true },
  { id: "HOSP-BLR-007", name: "BGS Gleneagles Global Hospital", city: "Bangalore", area: "Kengeri", coords: [77.4900, 12.9050], type: "Multispecialty", emergency: true },
  { id: "HOSP-BLR-008", name: "Columbia Asia Hospital", city: "Bangalore", area: "Hebbal", coords: [77.5950, 13.0380], type: "Multispecialty", emergency: true },
  { id: "HOSP-BLR-009", name: "Jayadeva Institute of Cardiology", city: "Bangalore", area: "Jayanagar", coords: [77.5830, 12.9270], type: "Cardiac", emergency: true },
  { id: "HOSP-BLR-010", name: "NIMHANS", city: "Bangalore", area: "Hosur Road", coords: [77.5962, 12.9416], type: "Neuro & Mental Health", emergency: true },
  { id: "HOSP-BLR-011", name: "Kidwai Memorial Institute", city: "Bangalore", area: "Hosur Road", coords: [77.5950, 12.9380], type: "Oncology", emergency: true },
  { id: "HOSP-BLR-012", name: "Ramaiah Memorial Hospital", city: "Bangalore", area: "Mathikere", coords: [77.5650, 13.0300], type: "Multispecialty", emergency: true },
  { id: "HOSP-BLR-013", name: "Aster CMI Hospital", city: "Bangalore", area: "Hebbal", coords: [77.5870, 13.0420], type: "Multispecialty", emergency: true },
  { id: "HOSP-BLR-014", name: "Victoria Hospital", city: "Bangalore", area: "KR Market", coords: [77.5750, 12.9600], type: "Government", emergency: true },
  { id: "HOSP-BLR-015", name: "Rainbow Children's Hospital", city: "Bangalore", area: "Marathahalli", coords: [77.7000, 12.9570], type: "Pediatric", emergency: true },
  // Belagavi
  { id: "HOSP-BGM-001", name: "KLE Dr. Prabhakar Kore Hospital", city: "Belagavi", area: "Nehru Nagar", coords: [74.4920, 15.8460], type: "Multispecialty", emergency: true },
  { id: "HOSP-BGM-002", name: "BIMS Hospital", city: "Belagavi", area: "Dr. B.R. Ambedkar Road", coords: [74.5000, 15.8520], type: "Government", emergency: true },
  { id: "HOSP-BGM-003", name: "Lakeview Hospital", city: "Belagavi", area: "Tilakwadi", coords: [74.5020, 15.8580], type: "Multispecialty", emergency: true },
  { id: "HOSP-BGM-004", name: "Deccan Medical Centre", city: "Belagavi", area: "Camp", coords: [74.5080, 15.8620], type: "Multispecialty", emergency: true },
  { id: "HOSP-BGM-005", name: "CentraCare Hospital", city: "Belagavi", area: "Sadashiv Nagar", coords: [74.5090, 15.8550], type: "Multispecialty", emergency: true },
  { id: "HOSP-BGM-006", name: "Jeevan Sanjeevini Hospital", city: "Belagavi", area: "Shivbasav Nagar", coords: [74.5170, 15.8380], type: "Multispecialty", emergency: true },
  // Mysuru
  { id: "HOSP-MYS-001", name: "Apollo BGS Hospitals", city: "Mysuru", area: "Kuvempunagar", coords: [76.6700, 12.3150], type: "Multispecialty", emergency: true },
  { id: "HOSP-MYS-002", name: "JSS Hospital", city: "Mysuru", area: "Ramanuja Road", coords: [76.6520, 12.3100], type: "Multispecialty", emergency: true },
  { id: "HOSP-MYS-003", name: "K.R. Hospital", city: "Mysuru", area: "KR Circle", coords: [76.6560, 12.3050], type: "Government", emergency: true },
  // Hubli
  { id: "HOSP-HBL-001", name: "KIMS Hospital", city: "Hubli", area: "Vidyanagar", coords: [75.1420, 15.3550], type: "Government Medical College", emergency: true },
  { id: "HOSP-HBL-002", name: "SDM Medical College Hospital", city: "Dharwad", area: "Sattur", coords: [75.0080, 15.4400], type: "Teaching Hospital", emergency: true },
  // Mangaluru
  { id: "HOSP-MNG-001", name: "KMC Hospital Manipal", city: "Mangaluru", area: "Hampankatte", coords: [74.8420, 12.8680], type: "Multispecialty", emergency: true },
  { id: "HOSP-MNG-002", name: "AJ Hospital & Research Centre", city: "Mangaluru", area: "Kuntikana", coords: [74.8650, 12.8800], type: "Multispecialty", emergency: true },
  { id: "HOSP-MNG-003", name: "Father Muller Medical College", city: "Mangaluru", area: "Kankanady", coords: [74.8600, 12.8730], type: "Multispecialty", emergency: true },
];

// ─── Traffic Signals (Subset for frontend - full list loaded via API) ─────

export const TRAFFIC_SIGNALS: TrafficSignal[] = [
  // Bangalore - Key junctions
  { id: "BLR-001", name: "Silk Board Junction", city: "Bangalore", area: "Silk Board", coords: [77.6226, 12.9165], congestion: 92, status: "NORMAL_CYCLE" },
  { id: "BLR-002", name: "HSR Layout Main Signal", city: "Bangalore", area: "HSR Layout", coords: [77.6445, 12.9121], congestion: 65, status: "NORMAL_CYCLE" },
  { id: "BLR-003", name: "HSR Layout BDA Complex", city: "Bangalore", area: "HSR Layout", coords: [77.6389, 12.9150], congestion: 55, status: "NORMAL_CYCLE" },
  { id: "BLR-006", name: "HSR Layout Agara Junction", city: "Bangalore", area: "HSR Layout", coords: [77.6380, 12.9213], congestion: 58, status: "NORMAL_CYCLE" },
  { id: "BLR-007", name: "BTM Layout 2nd Stage", city: "Bangalore", area: "BTM Layout", coords: [77.6065, 12.9165], congestion: 70, status: "NORMAL_CYCLE" },
  { id: "BLR-009", name: "BTM Layout Silk Board Side", city: "Bangalore", area: "BTM Layout", coords: [77.6180, 12.9140], congestion: 75, status: "NORMAL_CYCLE" },
  { id: "BLR-010", name: "JP Nagar 6th Phase", city: "Bangalore", area: "JP Nagar", coords: [77.5850, 12.8952], congestion: 55, status: "NORMAL_CYCLE" },
  { id: "BLR-014", name: "Jayanagar 4th Block", city: "Bangalore", area: "Jayanagar", coords: [77.5833, 12.9254], congestion: 68, status: "NORMAL_CYCLE" },
  { id: "BLR-021", name: "Dairy Circle", city: "Bangalore", area: "Bannerghatta Road", coords: [77.5920, 12.9350], congestion: 80, status: "NORMAL_CYCLE" },
  { id: "BLR-026", name: "Koramangala 80 Feet Road", city: "Bangalore", area: "Koramangala", coords: [77.6252, 12.9352], congestion: 70, status: "NORMAL_CYCLE" },
  { id: "BLR-027", name: "Koramangala Forum Mall", city: "Bangalore", area: "Koramangala", coords: [77.6112, 12.9344], congestion: 78, status: "NORMAL_CYCLE" },
  { id: "BLR-028", name: "Koramangala BDA Complex", city: "Bangalore", area: "Koramangala", coords: [77.6200, 12.9380], congestion: 65, status: "NORMAL_CYCLE" },
  { id: "BLR-033", name: "Indiranagar 100 Feet Road", city: "Bangalore", area: "Indiranagar", coords: [77.6412, 12.9716], congestion: 72, status: "NORMAL_CYCLE" },
  { id: "BLR-039", name: "Marathahalli Junction", city: "Bangalore", area: "Marathahalli", coords: [77.7011, 12.9567], congestion: 85, status: "NORMAL_CYCLE" },
  { id: "BLR-060", name: "Hebbal Flyover Junction", city: "Bangalore", area: "Hebbal", coords: [77.5969, 13.0450], congestion: 85, status: "NORMAL_CYCLE" },
  { id: "BLR-073", name: "Majestic Bus Stand", city: "Bangalore", area: "Majestic", coords: [77.5713, 12.9770], congestion: 90, status: "NORMAL_CYCLE" },
  { id: "BLR-076", name: "MG Road Metro", city: "Bangalore", area: "MG Road", coords: [77.6063, 12.9756], congestion: 72, status: "NORMAL_CYCLE" },
  { id: "BLR-079", name: "Residency Road", city: "Bangalore", area: "Residency Road", coords: [77.5990, 12.9700], congestion: 65, status: "NORMAL_CYCLE" },
  { id: "BLR-087", name: "Trinity Circle", city: "Bangalore", area: "Trinity Circle", coords: [77.6150, 12.9700], congestion: 70, status: "NORMAL_CYCLE" },
  { id: "BLR-101", name: "Electronic City Phase 1 Gate", city: "Bangalore", area: "Electronic City", coords: [77.6601, 12.8452], congestion: 78, status: "NORMAL_CYCLE" },
  { id: "BLR-102", name: "Electronic City Wipro Gate", city: "Bangalore", area: "Electronic City", coords: [77.6570, 12.8380], congestion: 72, status: "NORMAL_CYCLE" },
  { id: "BLR-105", name: "Electronic City Siemens", city: "Bangalore", area: "Electronic City", coords: [77.6620, 12.8350], congestion: 65, status: "NORMAL_CYCLE" },
  { id: "BLR-110", name: "Madiwala Junction", city: "Bangalore", area: "Madiwala", coords: [77.6180, 12.9230], congestion: 80, status: "NORMAL_CYCLE" },
  { id: "BLR-115", name: "KR Puram Junction", city: "Bangalore", area: "KR Puram", coords: [77.6698, 13.0035], congestion: 82, status: "NORMAL_CYCLE" },

  // Belagavi - All signals
  { id: "BGM-001", name: "Rani Channamma Circle", city: "Belagavi", area: "City Center", coords: [74.5050, 15.8520], congestion: 80, status: "NORMAL_CYCLE" },
  { id: "BGM-002", name: "Ashok Circle", city: "Belagavi", area: "Fort Area", coords: [74.5010, 15.8489], congestion: 75, status: "NORMAL_CYCLE" },
  { id: "BGM-003", name: "Dharmaveer Sambhaji Circle", city: "Belagavi", area: "Shahpur", coords: [74.5090, 15.8550], congestion: 72, status: "NORMAL_CYCLE" },
  { id: "BGM-004", name: "Gogte Circle", city: "Belagavi", area: "Tilakwadi", coords: [74.5020, 15.8580], congestion: 68, status: "NORMAL_CYCLE" },
  { id: "BGM-005", name: "RPD Corner", city: "Belagavi", area: "Camp Area", coords: [74.5080, 15.8620], congestion: 70, status: "NORMAL_CYCLE" },
  { id: "BGM-006", name: "Central Bus Stand Signal", city: "Belagavi", area: "CBS", coords: [74.5070, 15.8510], congestion: 85, status: "NORMAL_CYCLE" },
  { id: "BGM-008", name: "Krishnadevaraya Circle", city: "Belagavi", area: "Kolhapur Cross", coords: [74.5060, 15.8650], congestion: 62, status: "NORMAL_CYCLE" },
  { id: "BGM-010", name: "Bogarves Circle", city: "Belagavi", area: "Bogarves", coords: [74.4980, 15.8500], congestion: 58, status: "NORMAL_CYCLE" },
  { id: "BGM-013", name: "Angol Main Road Signal", city: "Belagavi", area: "Angol", coords: [74.5200, 15.8680], congestion: 55, status: "NORMAL_CYCLE" },
  { id: "BGM-018", name: "Tilakwadi Circle", city: "Belagavi", area: "Tilakwadi", coords: [74.5030, 15.8590], congestion: 55, status: "NORMAL_CYCLE" },
  { id: "BGM-019", name: "KLE Campus Gate Signal", city: "Belagavi", area: "Nehru Nagar", coords: [74.4920, 15.8460], congestion: 65, status: "NORMAL_CYCLE" },
  { id: "BGM-021", name: "Camp Junction", city: "Belagavi", area: "Camp", coords: [74.5100, 15.8630], congestion: 60, status: "NORMAL_CYCLE" },
  { id: "BGM-026", name: "Sankam Hotel Junction (NH-48)", city: "Belagavi", area: "NH-48", coords: [74.5110, 15.8700], congestion: 78, status: "NORMAL_CYCLE" },
  { id: "BGM-027", name: "Govaves Circle", city: "Belagavi", area: "Govaves", coords: [74.4950, 15.8490], congestion: 50, status: "NORMAL_CYCLE" },
];

// ─── Fallback Routes ─────────────────────────────────────────────────────────

export const FALLBACK_ROUTES: FallbackRoute[] = [
  // Bangalore
  {
    id: "BLR-FALLBACK-001",
    name: "HSR Layout → Fortis BG Road",
    description: "South Bangalore Emergency Corridor",
    pickup: { name: "HSR Layout", coords: [77.6445, 12.9121] },
    hospital: { name: "Fortis Hospital (Bannerghatta Road)", coords: [77.5952, 12.8943] },
    polyline: [
      [77.6445, 12.9121], [77.6430, 12.9115], [77.6410, 12.9112],
      [77.6389, 12.9110], [77.6370, 12.9112], [77.6350, 12.9118],
      [77.6330, 12.9125], [77.6310, 12.9135], [77.6290, 12.9148],
      [77.6270, 12.9155], [77.6250, 12.9162], [77.6226, 12.9172],
      [77.6200, 12.9170], [77.6180, 12.9168], [77.6160, 12.9166],
      [77.6140, 12.9165], [77.6120, 12.9165], [77.6100, 12.9162],
      [77.6080, 12.9158], [77.6065, 12.9155], [77.6040, 12.9140],
      [77.6020, 12.9120], [77.6000, 12.9100], [77.5980, 12.9070],
      [77.5960, 12.9050], [77.5940, 12.9020], [77.5920, 12.8990],
      [77.5910, 12.8970], [77.5920, 12.8960], [77.5940, 12.8950],
      [77.5952, 12.8943],
    ],
    signal_ids: ["BLR-002", "BLR-003", "BLR-001", "BLR-009", "BLR-007", "BLR-010"],
    distance_km: 8.2,
    estimated_time_mins: 18,
  },
  {
    id: "BLR-FALLBACK-002",
    name: "HSR Layout → St. John's Hospital",
    description: "Koramangala Emergency Corridor",
    pickup: { name: "HSR Layout", coords: [77.6445, 12.9121] },
    hospital: { name: "St. John's Medical College Hospital", coords: [77.6210, 12.9302] },
    polyline: [
      [77.6445, 12.9121], [77.6430, 12.9130], [77.6420, 12.9145],
      [77.6400, 12.9160], [77.6380, 12.9180], [77.6360, 12.9195],
      [77.6340, 12.9210], [77.6320, 12.9225], [77.6300, 12.9240],
      [77.6280, 12.9250], [77.6260, 12.9260], [77.6252, 12.9270],
      [77.6240, 12.9280], [77.6230, 12.9290], [77.6220, 12.9296],
      [77.6210, 12.9302],
    ],
    signal_ids: ["BLR-002", "BLR-006", "BLR-026", "BLR-028"],
    distance_km: 4.5,
    estimated_time_mins: 12,
  },
  {
    id: "BLR-FALLBACK-003",
    name: "Majestic → Manipal Hospital",
    description: "Central to East Bangalore Emergency Corridor",
    pickup: { name: "Majestic Bus Stand", coords: [77.5713, 12.9770] },
    hospital: { name: "Manipal Hospital", coords: [77.6412, 12.9592] },
    polyline: [
      [77.5713, 12.9770], [77.5750, 12.9760], [77.5790, 12.9750],
      [77.5830, 12.9740], [77.5870, 12.9730], [77.5910, 12.9720],
      [77.5950, 12.9710], [77.5990, 12.9700], [77.6020, 12.9690],
      [77.6063, 12.9680], [77.6100, 12.9670], [77.6150, 12.9660],
      [77.6200, 12.9650], [77.6250, 12.9640], [77.6300, 12.9630],
      [77.6350, 12.9615], [77.6380, 12.9605], [77.6412, 12.9592],
    ],
    signal_ids: ["BLR-073", "BLR-079", "BLR-076", "BLR-087", "BLR-033"],
    distance_km: 7.8,
    estimated_time_mins: 20,
  },
  // Belagavi
  {
    id: "BGM-FALLBACK-001",
    name: "Rani Channamma Circle → KLE Hospital",
    description: "Central Belagavi Emergency Corridor",
    pickup: { name: "Rani Channamma Circle", coords: [74.5050, 15.8520] },
    hospital: { name: "KLE Dr. Prabhakar Kore Hospital", coords: [74.4920, 15.8460] },
    polyline: [
      [74.5050, 15.8520], [74.5040, 15.8515], [74.5030, 15.8510],
      [74.5020, 15.8505], [74.5010, 15.8500], [74.5000, 15.8495],
      [74.4990, 15.8490], [74.4980, 15.8485], [74.4970, 15.8480],
      [74.4960, 15.8475], [74.4950, 15.8470], [74.4940, 15.8468],
      [74.4930, 15.8465], [74.4920, 15.8460],
    ],
    signal_ids: ["BGM-001", "BGM-004", "BGM-002", "BGM-010", "BGM-027", "BGM-019"],
    distance_km: 2.8,
    estimated_time_mins: 8,
  },
  {
    id: "BGM-FALLBACK-002",
    name: "Camp → BIMS Hospital",
    description: "East Belagavi Emergency Corridor",
    pickup: { name: "Camp Junction", coords: [74.5100, 15.8630] },
    hospital: { name: "BIMS Hospital", coords: [74.5000, 15.8520] },
    polyline: [
      [74.5100, 15.8630], [74.5090, 15.8620], [74.5080, 15.8610],
      [74.5070, 15.8600], [74.5060, 15.8590], [74.5050, 15.8580],
      [74.5040, 15.8570], [74.5030, 15.8560], [74.5020, 15.8550],
      [74.5010, 15.8540], [74.5000, 15.8530], [74.5000, 15.8520],
    ],
    signal_ids: ["BGM-021", "BGM-005", "BGM-008", "BGM-004", "BGM-003"],
    distance_km: 2.1,
    estimated_time_mins: 6,
  },
  {
    id: "BGM-FALLBACK-003",
    name: "NH-48 Entry → Lakeview Hospital",
    description: "Highway Entry Emergency Corridor",
    pickup: { name: "Sankam Hotel Junction (NH-48)", coords: [74.5110, 15.8700] },
    hospital: { name: "Lakeview Hospital", coords: [74.5020, 15.8580] },
    polyline: [
      [74.5110, 15.8700], [74.5105, 15.8690], [74.5100, 15.8680],
      [74.5095, 15.8670], [74.5090, 15.8660], [74.5085, 15.8650],
      [74.5080, 15.8640], [74.5070, 15.8630], [74.5060, 15.8620],
      [74.5050, 15.8610], [74.5040, 15.8600], [74.5030, 15.8590],
      [74.5020, 15.8580],
    ],
    signal_ids: ["BGM-026", "BGM-013", "BGM-021", "BGM-005", "BGM-008", "BGM-018"],
    distance_km: 2.5,
    estimated_time_mins: 7,
  },
];

// ─── Helper Functions ────────────────────────────────────────────────────────

export function getHospitalsByCity(city: string): Hospital[] {
  return HOSPITALS.filter((h) => h.city.toLowerCase() === city.toLowerCase());
}

export function getSignalsByCity(city: string): TrafficSignal[] {
  return TRAFFIC_SIGNALS.filter((s) => s.city.toLowerCase() === city.toLowerCase());
}

export function getFallbackRoutesByCity(city: string): FallbackRoute[] {
  return FALLBACK_ROUTES.filter((r) =>
    r.pickup.coords[0] > 74 && r.pickup.coords[0] < 75
      ? city.toLowerCase() === "belagavi"
      : city.toLowerCase() === "bangalore"
  );
}

export function getRouteForHospital(hospitalId: string): FallbackRoute | undefined {
  return FALLBACK_ROUTES.find((r) => {
    const hospital = HOSPITALS.find((h) => h.id === hospitalId);
    if (!hospital) return false;
    return (
      Math.abs(r.hospital.coords[0] - hospital.coords[0]) < 0.01 &&
      Math.abs(r.hospital.coords[1] - hospital.coords[1]) < 0.01
    );
  });
}
