"""
Base Traffic Agent class.
Each agent represents an autonomous AI node at a traffic junction.
"""

import asyncio
import math
from typing import Dict, Any, Optional, List
from datetime import datetime
from agents.llm_service import llm_service


class TrafficAgent:
    """
    Autonomous AI agent controlling a single traffic junction.
    Communicates with neighboring agents to coordinate emergency corridors.
    """
    
    def __init__(self, signal_data: Dict[str, Any]):
        self.id = signal_data["id"]
        self.name = signal_data["name"]
        self.city = signal_data["city"]
        self.area = signal_data["area"]
        self.coords = signal_data["coords"]  # [lng, lat]
        self.congestion = signal_data.get("congestion", 50)
        self.status = "NORMAL_CYCLE"
        self.last_updated = datetime.now().isoformat()
        self.neighbors: List['TrafficAgent'] = []
        self.event_log: List[Dict[str, Any]] = []
        self._previous_status = "NORMAL_CYCLE"
    
    @property
    def lat(self) -> float:
        return self.coords[1]
    
    @property
    def lng(self) -> float:
        return self.coords[0]
    
    def set_neighbors(self, neighbors: List['TrafficAgent']):
        """Set neighboring agents for inter-agent communication."""
        self.neighbors = neighbors
    
    def distance_to(self, point: List[float]) -> float:
        """Calculate distance to a point [lng, lat] in kilometers using Haversine."""
        R = 6371  # Earth's radius in km
        lat1 = math.radians(self.lat)
        lat2 = math.radians(point[1])
        dlat = math.radians(point[1] - self.lat)
        dlng = math.radians(point[0] - self.lng)
        
        a = (math.sin(dlat / 2) ** 2 + 
             math.cos(lat1) * math.cos(lat2) * math.sin(dlng / 2) ** 2)
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        
        return R * c
    
    async def evaluate(self, ambulance_coords: List[float], speed_kmh: float = 60) -> Dict[str, Any]:
        """
        Evaluate current situation and make autonomous decision.
        Uses LLM when available, falls back to deterministic logic.
        """
        distance = self.distance_to(ambulance_coords)
        eta_seconds = (distance / speed_kmh) * 3600 if speed_kmh > 0 else float('inf')
        
        # Prepare neighbor info for LLM context
        neighbor_info = [
            {"name": n.name, "status": n.status, "congestion": n.congestion}
            for n in self.neighbors[:3]  # Limit to 3 nearest neighbors
        ]
        
        # Get LLM/deterministic analysis
        analysis = await llm_service.analyze_traffic_situation(
            agent_name=self.name,
            agent_area=self.area,
            congestion_level=self.congestion,
            ambulance_distance_km=distance,
            ambulance_eta_seconds=eta_seconds,
            neighboring_agents=neighbor_info,
            current_signal_status=self.status
        )
        
        # Update status
        self._previous_status = self.status
        new_status = analysis["decision"]
        status_changed = new_status != self.status
        self.status = new_status
        self.last_updated = datetime.now().isoformat()
        
        # Generate inter-agent messages if status changed
        messages = []
        if status_changed and analysis.get("alert_message"):
            msg_context = {
                "action": "HANDOFF" if new_status == "HANDOFF_SIGNAL" else 
                          "GREEN_WAVE" if new_status == "GREEN_WAVE_ACTIVE" else "RESET",
                "distance_km": distance,
                "congestion": self.congestion,
                "eta_seconds": eta_seconds
            }
            
            for neighbor in self.neighbors[:2]:
                inter_msg = await llm_service.generate_inter_agent_message(
                    self.name, neighbor.name, msg_context
                )
                messages.append({
                    "from": self.name,
                    "to": neighbor.name,
                    "message": inter_msg,
                    "timestamp": datetime.now().isoformat(),
                    "type": "alert" if new_status == "GREEN_WAVE_ACTIVE" else 
                            "handoff" if new_status == "HANDOFF_SIGNAL" else "info"
                })
        
        # Log event
        event = {
            "agent_id": self.id,
            "agent_name": self.name,
            "timestamp": datetime.now().isoformat(),
            "distance_km": round(distance, 3),
            "eta_seconds": round(eta_seconds, 1),
            "previous_status": self._previous_status,
            "new_status": new_status,
            "status_changed": status_changed,
            "congestion": self.congestion,
            "analysis": analysis,
            "messages": messages
        }
        self.event_log.append(event)
        
        return event
    
    def set_congestion(self, level: int):
        """Update congestion level (0-100)."""
        self.congestion = max(0, min(100, level))
    
    def reset(self):
        """Reset agent to initial state."""
        self.status = "NORMAL_CYCLE"
        self._previous_status = "NORMAL_CYCLE"
        self.event_log = []
        self.last_updated = datetime.now().isoformat()
    
    def to_dict(self) -> Dict[str, Any]:
        """Serialize agent state for API response."""
        return {
            "id": self.id,
            "name": self.name,
            "city": self.city,
            "area": self.area,
            "coords": self.coords,
            "congestion": self.congestion,
            "status": self.status,
            "lastUpdated": self.last_updated,
            "neighborCount": len(self.neighbors)
        }
