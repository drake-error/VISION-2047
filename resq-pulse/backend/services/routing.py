"""
Routing Service
Integrates with OSRM (free) and OpenRouteService for route calculation.
Falls back to hardcoded routes when APIs are unavailable.
"""

import httpx
import asyncio
from typing import List, Dict, Any, Optional, Tuple
from data.fallback_routes import get_fallback_routes_for_city, get_nearest_fallback_route


OSRM_BASE_URL = "https://router.project-osrm.org"
ORS_BASE_URL = "https://api.openrouteservice.org"


class RoutingService:
    """Handles route calculation via OSRM with fallback support."""
    
    def __init__(self):
        self.ors_api_key = None  # Set via env var if available
        self._client = httpx.AsyncClient(timeout=10.0)
    
    async def get_route(
        self,
        start: List[float],  # [lng, lat]
        end: List[float],    # [lng, lat]
        city: str = "Bangalore"
    ) -> Dict[str, Any]:
        """
        Get route between two points.
        Tries OSRM first, then ORS, then fallback.
        """
        # Try OSRM first
        try:
            route = await self._osrm_route(start, end)
            if route:
                return route
        except Exception as e:
            print(f"OSRM failed: {e}")
        
        # Try OpenRouteService
        if self.ors_api_key:
            try:
                route = await self._ors_route(start, end)
                if route:
                    return route
            except Exception as e:
                print(f"ORS failed: {e}")
        
        # Fallback to hardcoded routes
        print(f"Using fallback route for {city}")
        return self._get_fallback(start, city)
    
    async def _osrm_route(
        self,
        start: List[float],
        end: List[float]
    ) -> Optional[Dict[str, Any]]:
        """Fetch route from OSRM public demo server."""
        url = (
            f"{OSRM_BASE_URL}/route/v1/driving/"
            f"{start[0]},{start[1]};{end[0]},{end[1]}"
            f"?overview=full&geometries=geojson&steps=true"
        )
        
        response = await self._client.get(url)
        if response.status_code != 200:
            return None
        
        data = response.json()
        if data.get("code") != "Ok" or not data.get("routes"):
            return None
        
        route = data["routes"][0]
        geometry = route["geometry"]
        
        return {
            "polyline": geometry["coordinates"],  # Already [lng, lat] format
            "distance_km": round(route["distance"] / 1000, 2),
            "duration_seconds": round(route["duration"]),
            "estimated_time_mins": round(route["duration"] / 60, 1),
            "traffic_delay_mins": round(route["duration"] / 60 * 0.3, 1),  # Estimated 30% traffic overhead
            "source": "osrm",
            "steps": [
                {
                    "name": step.get("name", ""),
                    "distance": step.get("distance", 0),
                    "duration": step.get("duration", 0),
                    "maneuver": step.get("maneuver", {}).get("type", "")
                }
                for leg in route.get("legs", [])
                for step in leg.get("steps", [])
            ]
        }
    
    async def _ors_route(
        self,
        start: List[float],
        end: List[float]
    ) -> Optional[Dict[str, Any]]:
        """Fetch route from OpenRouteService."""
        url = f"{ORS_BASE_URL}/v2/directions/driving-car"
        headers = {
            "Authorization": self.ors_api_key,
            "Content-Type": "application/json"
        }
        body = {
            "coordinates": [start, end],
            "instructions": True,
            "geometry": True
        }
        
        response = await self._client.post(url, json=body, headers=headers)
        if response.status_code != 200:
            return None
        
        data = response.json()
        route = data["routes"][0]
        
        return {
            "polyline": route["geometry"]["coordinates"],
            "distance_km": round(route["summary"]["distance"] / 1000, 2),
            "duration_seconds": round(route["summary"]["duration"]),
            "estimated_time_mins": round(route["summary"]["duration"] / 60, 1),
            "traffic_delay_mins": round(route["summary"]["duration"] / 60 * 0.25, 1),
            "source": "openrouteservice"
        }
    
    def _get_fallback(
        self,
        start: List[float],
        city: str
    ) -> Dict[str, Any]:
        """Get hardcoded fallback route for the given city."""
        fallback = get_nearest_fallback_route(city, start)
        
        if not fallback:
            # Generate a simple straight-line fallback
            return {
                "polyline": [start, start],
                "distance_km": 0,
                "duration_seconds": 0,
                "estimated_time_mins": 0,
                "traffic_delay_mins": 0,
                "source": "fallback-empty",
                "signal_ids": []
            }
        
        return {
            "polyline": fallback["polyline"],
            "distance_km": fallback["distance_km"],
            "duration_seconds": fallback["estimated_time_mins"] * 60,
            "estimated_time_mins": fallback["estimated_time_mins"],
            "traffic_delay_mins": round(fallback["estimated_time_mins"] * 0.3, 1),
            "source": "fallback-hardcoded",
            "signal_ids": fallback.get("signal_ids", []),
            "route_name": fallback.get("name", ""),
            "route_description": fallback.get("description", "")
        }
    
    async def close(self):
        """Close the HTTP client."""
        await self._client.aclose()


# Singleton instance
routing_service = RoutingService()
