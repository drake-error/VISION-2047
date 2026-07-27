"""
Agent Network Engine - Multi-Agent Orchestrator
Manages all traffic agents along a route and coordinates emergency corridor operations.
"""

import asyncio
import math
from typing import List, Dict, Any, Optional
from datetime import datetime
from agents.base_agent import TrafficAgent
from agents.llm_service import llm_service
from data.karnataka_signals import ALL_KARNATAKA_SIGNALS, get_signals_by_city, get_signals_in_bbox


class AgentNetworkEngine:
    """
    Core multi-agent orchestration engine.
    Manages agent lifecycle, inter-agent communication, and emergency corridor coordination.
    """
    
    def __init__(self):
        self.agents: Dict[str, TrafficAgent] = {}
        self.route_agents: List[TrafficAgent] = []  # Agents along active route
        self.is_active = False
        self.event_history: List[Dict[str, Any]] = []
        self.global_congestion_override: Optional[int] = None
        self._initialized_cities: set = set()
    
    def initialize_city(self, city: str):
        """Initialize all agents for a specific city."""
        if city in self._initialized_cities:
            return
        
        signals = get_signals_by_city(city)
        for signal_data in signals:
            agent = TrafficAgent(signal_data)
            self.agents[signal_data["id"]] = agent
        
        # Set up neighbor relationships based on proximity
        self._establish_neighbors(city)
        self._initialized_cities.add(city)
        print(f"✅ Initialized {len(signals)} agents for {city}")
    
    def initialize_region(self, min_lat: float, min_lng: float, max_lat: float, max_lng: float):
        """Initialize agents within a geographic bounding box."""
        signals = get_signals_in_bbox(min_lat, min_lng, max_lat, max_lng)
        for signal_data in signals:
            if signal_data["id"] not in self.agents:
                agent = TrafficAgent(signal_data)
                self.agents[signal_data["id"]] = agent
        print(f"✅ Initialized {len(signals)} agents in bounding box")
    
    def initialize_all(self):
        """Initialize all Karnataka agents."""
        for signal_data in ALL_KARNATAKA_SIGNALS:
            if signal_data["id"] not in self.agents:
                agent = TrafficAgent(signal_data)
                self.agents[signal_data["id"]] = agent
        
        # Establish neighbors for all cities
        for city in set(s["city"] for s in ALL_KARNATAKA_SIGNALS):
            self._establish_neighbors(city)
        
        print(f"✅ Initialized {len(self.agents)} total agents across Karnataka")
    
    def _establish_neighbors(self, city: str, max_neighbors: int = 4, max_distance_km: float = 3.0):
        """Establish neighbor relationships between agents in the same city."""
        city_agents = [a for a in self.agents.values() if a.city == city]
        
        for agent in city_agents:
            # Calculate distances to all other agents in the city
            distances = []
            for other in city_agents:
                if other.id != agent.id:
                    dist = agent.distance_to(other.coords)
                    if dist <= max_distance_km:
                        distances.append((dist, other))
            
            # Sort by distance and take nearest N
            distances.sort(key=lambda x: x[0])
            agent.set_neighbors([a for _, a in distances[:max_neighbors]])
    
    def set_route_agents(self, signal_ids: List[str]):
        """Set the active route agents by their signal IDs."""
        self.route_agents = []
        for sid in signal_ids:
            if sid in self.agents:
                self.route_agents.append(self.agents[sid])
        print(f"📍 Set {len(self.route_agents)} agents along route")
    
    def find_agents_near_route(self, route_polyline: List[List[float]], 
                                max_distance_km: float = 1.5) -> List[str]:
        """Find all agents within a certain distance of the route polyline."""
        nearby_ids = set()
        
        for point in route_polyline:
            for agent in self.agents.values():
                dist = agent.distance_to(point)
                if dist <= max_distance_km:
                    nearby_ids.add(agent.id)
        
        # Sort by order along route
        result = []
        for point in route_polyline:
            for agent_id in nearby_ids:
                if agent_id not in result:
                    agent = self.agents[agent_id]
                    if agent.distance_to(point) <= max_distance_km:
                        result.append(agent_id)
        
        return list(dict.fromkeys(result))  # Remove duplicates preserving order
    
    async def evaluate_all(self, ambulance_coords: List[float]) -> List[Dict[str, Any]]:
        """
        Evaluate all route agents against current ambulance position.
        Returns list of events/state changes.
        """
        if not self.route_agents:
            return []
        
        events = []
        
        # Apply global congestion override if set
        if self.global_congestion_override is not None:
            for agent in self.route_agents:
                agent.set_congestion(self.global_congestion_override)
        
        # Evaluate each agent concurrently
        tasks = [agent.evaluate(ambulance_coords) for agent in self.route_agents]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        
        for result in results:
            if isinstance(result, Exception):
                print(f"Agent evaluation error: {result}")
                continue
            if result.get("status_changed"):
                events.append(result)
                self.event_history.append(result)
        
        return events
    
    def set_global_congestion(self, level: int):
        """Set congestion level for all agents (for demo toggle)."""
        self.global_congestion_override = max(0, min(100, level))
        for agent in self.agents.values():
            agent.set_congestion(level)
    
    def reset_congestion_override(self):
        """Remove global congestion override."""
        self.global_congestion_override = None
    
    def reset_all(self):
        """Reset all agents to initial state."""
        for agent in self.agents.values():
            agent.reset()
        self.route_agents = []
        self.event_history = []
        self.is_active = False
        self.global_congestion_override = None
    
    def get_all_agent_states(self) -> List[Dict[str, Any]]:
        """Get current state of all agents."""
        return [agent.to_dict() for agent in self.agents.values()]
    
    def get_route_agent_states(self) -> List[Dict[str, Any]]:
        """Get current state of route agents only."""
        return [agent.to_dict() for agent in self.route_agents]
    
    def get_stats(self) -> Dict[str, Any]:
        """Get network statistics."""
        green_count = sum(1 for a in self.agents.values() if a.status == "GREEN_WAVE_ACTIVE")
        handoff_count = sum(1 for a in self.agents.values() if a.status == "HANDOFF_SIGNAL")
        
        return {
            "total_agents": len(self.agents),
            "route_agents": len(self.route_agents),
            "green_wave_active": green_count,
            "handoff_signals": handoff_count,
            "normal_cycle": len(self.agents) - green_count - handoff_count,
            "total_events": len(self.event_history),
            "initialized_cities": list(self._initialized_cities),
            "is_active": self.is_active
        }


# Singleton instance
engine = AgentNetworkEngine()
