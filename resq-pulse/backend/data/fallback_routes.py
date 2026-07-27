"""
Hardcoded fallback routes for demo reliability.
Pre-calculated polyline routes for Bangalore and Belagavi regions.
Used when OSRM/external routing API is unavailable during hackathon demo.
"""

from typing import List, Tuple

# [longitude, latitude] format for GeoJSON compatibility

# =============================================================================
# BANGALORE FALLBACK ROUTES
# =============================================================================

# Route 1: HSR Layout → Silk Board → BTM Layout → JP Nagar → Jayanagar → Fortis BG Road
BANGALORE_ROUTE_1 = {
    "id": "BLR-FALLBACK-001",
    "name": "HSR Layout → Fortis BG Road",
    "description": "South Bangalore Emergency Corridor",
    "pickup": {"name": "HSR Layout", "coords": [77.6445, 12.9121]},
    "hospital": {"name": "Fortis Hospital (Bannerghatta Road)", "coords": [77.5952, 12.8943]},
    "polyline": [
        [77.6445, 12.9121],  # HSR Layout Start
        [77.6430, 12.9115],
        [77.6410, 12.9112],
        [77.6389, 12.9110],  # HSR BDA Complex
        [77.6370, 12.9112],
        [77.6350, 12.9118],
        [77.6330, 12.9125],
        [77.6310, 12.9135],
        [77.6290, 12.9148],
        [77.6270, 12.9155],
        [77.6250, 12.9162],
        [77.6226, 12.9172],  # Silk Board Junction
        [77.6200, 12.9170],
        [77.6180, 12.9168],
        [77.6160, 12.9166],
        [77.6140, 12.9165],
        [77.6120, 12.9165],  # BTM Layout
        [77.6100, 12.9162],
        [77.6080, 12.9158],
        [77.6065, 12.9155],
        [77.6040, 12.9140],
        [77.6020, 12.9120],
        [77.6000, 12.9100],
        [77.5980, 12.9070],
        [77.5960, 12.9050],
        [77.5940, 12.9020],
        [77.5920, 12.8990],
        [77.5910, 12.8970],  # JP Nagar region
        [77.5920, 12.8960],
        [77.5940, 12.8950],
        [77.5952, 12.8943],  # Fortis BG Road
    ],
    "signal_ids": ["BLR-002", "BLR-003", "BLR-001", "BLR-009", "BLR-007", "BLR-010"],
    "distance_km": 8.2,
    "estimated_time_mins": 18,
}

# Route 2: HSR Layout → Koramangala → St. John's Hospital
BANGALORE_ROUTE_2 = {
    "id": "BLR-FALLBACK-002",
    "name": "HSR Layout → St. John's Hospital",
    "description": "Koramangala Emergency Corridor",
    "pickup": {"name": "HSR Layout", "coords": [77.6445, 12.9121]},
    "hospital": {"name": "St. John's Medical College Hospital", "coords": [77.6210, 12.9302]},
    "polyline": [
        [77.6445, 12.9121],  # HSR Layout
        [77.6430, 12.9130],
        [77.6420, 12.9145],
        [77.6400, 12.9160],
        [77.6380, 12.9180],
        [77.6360, 12.9195],
        [77.6340, 12.9210],
        [77.6320, 12.9225],
        [77.6300, 12.9240],  # Koramangala region
        [77.6280, 12.9250],
        [77.6260, 12.9260],
        [77.6252, 12.9270],  # 80 Feet Road
        [77.6240, 12.9280],
        [77.6230, 12.9290],
        [77.6220, 12.9296],
        [77.6210, 12.9302],  # St. John's Hospital
    ],
    "signal_ids": ["BLR-002", "BLR-006", "BLR-026", "BLR-028"],
    "distance_km": 4.5,
    "estimated_time_mins": 12,
}

# Route 3: Majestic → Manipal Hospital
BANGALORE_ROUTE_3 = {
    "id": "BLR-FALLBACK-003",
    "name": "Majestic → Manipal Hospital",
    "description": "Central to East Bangalore Emergency Corridor",
    "pickup": {"name": "Majestic Bus Stand", "coords": [77.5713, 12.9770]},
    "hospital": {"name": "Manipal Hospital", "coords": [77.6412, 12.9592]},
    "polyline": [
        [77.5713, 12.9770],  # Majestic
        [77.5750, 12.9760],
        [77.5790, 12.9750],
        [77.5830, 12.9740],
        [77.5870, 12.9730],
        [77.5910, 12.9720],
        [77.5950, 12.9710],
        [77.5990, 12.9700],  # Residency Road
        [77.6020, 12.9690],
        [77.6063, 12.9680],  # MG Road
        [77.6100, 12.9670],
        [77.6150, 12.9660],  # Trinity Circle
        [77.6200, 12.9650],
        [77.6250, 12.9640],
        [77.6300, 12.9630],
        [77.6350, 12.9615],
        [77.6380, 12.9605],
        [77.6412, 12.9592],  # Manipal Hospital
    ],
    "signal_ids": ["BLR-073", "BLR-079", "BLR-076", "BLR-087", "BLR-033"],
    "distance_km": 7.8,
    "estimated_time_mins": 20,
}

# Route 4: Electronic City → Narayana Health
BANGALORE_ROUTE_4 = {
    "id": "BLR-FALLBACK-004",
    "name": "Electronic City → Narayana Health",
    "description": "South-East Emergency Corridor",
    "pickup": {"name": "Electronic City Phase 1", "coords": [77.6601, 12.8452]},
    "hospital": {"name": "Narayana Health City", "coords": [77.6620, 12.8010]},
    "polyline": [
        [77.6601, 12.8452],  # Electronic City
        [77.6610, 12.8420],
        [77.6615, 12.8380],
        [77.6618, 12.8340],
        [77.6615, 12.8300],
        [77.6612, 12.8260],
        [77.6615, 12.8220],
        [77.6618, 12.8180],
        [77.6620, 12.8140],
        [77.6618, 12.8100],
        [77.6620, 12.8060],
        [77.6620, 12.8010],  # Narayana Health
    ],
    "signal_ids": ["BLR-101", "BLR-102", "BLR-105"],
    "distance_km": 5.2,
    "estimated_time_mins": 14,
}

# =============================================================================
# BELAGAVI FALLBACK ROUTES
# =============================================================================

# Route 1: Rani Channamma Circle → KLE Hospital
BELAGAVI_ROUTE_1 = {
    "id": "BGM-FALLBACK-001",
    "name": "Rani Channamma Circle → KLE Hospital",
    "description": "Central Belagavi Emergency Corridor",
    "pickup": {"name": "Rani Channamma Circle", "coords": [74.5050, 15.8520]},
    "hospital": {"name": "KLE Dr. Prabhakar Kore Hospital", "coords": [74.4920, 15.8460]},
    "polyline": [
        [74.5050, 15.8520],  # Rani Channamma Circle
        [74.5040, 15.8515],
        [74.5030, 15.8510],
        [74.5020, 15.8505],  # Near Gogte Circle
        [74.5010, 15.8500],  # Ashok Circle
        [74.5000, 15.8495],
        [74.4990, 15.8490],
        [74.4980, 15.8485],  # Bogarves area
        [74.4970, 15.8480],
        [74.4960, 15.8475],
        [74.4950, 15.8470],  # Govaves
        [74.4940, 15.8468],
        [74.4930, 15.8465],
        [74.4920, 15.8460],  # KLE Hospital
    ],
    "signal_ids": ["BGM-001", "BGM-004", "BGM-002", "BGM-010", "BGM-027", "BGM-019"],
    "distance_km": 2.8,
    "estimated_time_mins": 8,
}

# Route 2: Camp → BIMS Hospital
BELAGAVI_ROUTE_2 = {
    "id": "BGM-FALLBACK-002",
    "name": "Camp → BIMS Hospital",
    "description": "East Belagavi Emergency Corridor",
    "pickup": {"name": "Camp Junction", "coords": [74.5100, 15.8630]},
    "hospital": {"name": "BIMS Hospital", "coords": [74.5000, 15.8520]},
    "polyline": [
        [74.5100, 15.8630],  # Camp
        [74.5090, 15.8620],
        [74.5080, 15.8610],  # RPD Corner
        [74.5070, 15.8600],
        [74.5060, 15.8590],  # Krishnadevaraya Circle
        [74.5050, 15.8580],
        [74.5040, 15.8570],
        [74.5030, 15.8560],
        [74.5020, 15.8550],
        [74.5010, 15.8540],
        [74.5000, 15.8530],
        [74.5000, 15.8520],  # BIMS
    ],
    "signal_ids": ["BGM-021", "BGM-005", "BGM-008", "BGM-004", "BGM-003"],
    "distance_km": 2.1,
    "estimated_time_mins": 6,
}

# Route 3: Sankam Hotel (NH-48) → Lakeview Hospital  
BELAGAVI_ROUTE_3 = {
    "id": "BGM-FALLBACK-003",
    "name": "NH-48 Entry → Lakeview Hospital",
    "description": "Highway Entry Emergency Corridor",
    "pickup": {"name": "Sankam Hotel Junction (NH-48)", "coords": [74.5110, 15.8700]},
    "hospital": {"name": "Lakeview Hospital", "coords": [74.5020, 15.8580]},
    "polyline": [
        [74.5110, 15.8700],  # Sankam Hotel NH-48
        [74.5105, 15.8690],
        [74.5100, 15.8680],
        [74.5095, 15.8670],
        [74.5090, 15.8660],
        [74.5085, 15.8650],  # Near Krishnadevaraya Circle
        [74.5080, 15.8640],
        [74.5070, 15.8630],
        [74.5060, 15.8620],
        [74.5050, 15.8610],
        [74.5040, 15.8600],
        [74.5030, 15.8590],
        [74.5020, 15.8580],  # Lakeview Hospital
    ],
    "signal_ids": ["BGM-026", "BGM-013", "BGM-021", "BGM-005", "BGM-008", "BGM-018"],
    "distance_km": 2.5,
    "estimated_time_mins": 7,
}

# =============================================================================
# ROUTE REGISTRY
# =============================================================================

ALL_FALLBACK_ROUTES = {
    "Bangalore": [BANGALORE_ROUTE_1, BANGALORE_ROUTE_2, BANGALORE_ROUTE_3, BANGALORE_ROUTE_4],
    "Belagavi": [BELAGAVI_ROUTE_1, BELAGAVI_ROUTE_2, BELAGAVI_ROUTE_3],
}

def get_fallback_routes_for_city(city: str) -> list:
    """Get all fallback routes for a city."""
    return ALL_FALLBACK_ROUTES.get(city, [])

def get_fallback_route_by_id(route_id: str) -> dict | None:
    """Get a specific fallback route by its ID."""
    for city_routes in ALL_FALLBACK_ROUTES.values():
        for route in city_routes:
            if route["id"] == route_id:
                return route
    return None

def get_nearest_fallback_route(city: str, pickup_coords: list, hospital_id: str = None) -> dict | None:
    """Find the nearest fallback route based on pickup location."""
    import math
    routes = get_fallback_routes_for_city(city)
    if not routes:
        return None
    
    best_route = None
    best_dist = float('inf')
    
    for route in routes:
        dx = route["pickup"]["coords"][0] - pickup_coords[0]
        dy = route["pickup"]["coords"][1] - pickup_coords[1]
        dist = math.sqrt(dx * dx + dy * dy)
        if dist < best_dist:
            best_dist = dist
            best_route = route
    
    return best_route
