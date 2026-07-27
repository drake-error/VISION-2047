"""
ResQ-Pulse Backend Server
FastAPI + WebSocket server for real-time multi-agent AI traffic management.
"""

import os
import json
import asyncio
from typing import List, Optional
from datetime import datetime
from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from data.karnataka_signals import (
    ALL_KARNATAKA_SIGNALS, SIGNAL_COUNTS,
    get_signals_by_city, get_signals_in_bbox
)
from data.hospitals import ALL_KARNATAKA_HOSPITALS, get_hospitals_by_city, get_emergency_hospitals
from data.fallback_routes import ALL_FALLBACK_ROUTES, get_fallback_routes_for_city
from agents.agent_engine import AgentNetworkEngine
from services.routing import routing_service


# ─── Lifespan ──────────────────────────────────────────────────────────────────

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan handler."""
    print("🚀 ResQ-Pulse Backend Starting...")
    print(f"📊 Signal Database: {SIGNAL_COUNTS}")
    print(f"🏥 Hospitals: {len(ALL_KARNATAKA_HOSPITALS)}")
    
    # Initialize the agent engine with all Karnataka signals
    engine = app.state.engine
    engine.initialize_all()
    
    yield
    
    # Cleanup
    await routing_service.close()
    print("🛑 ResQ-Pulse Backend Shutdown")


# ─── App ───────────────────────────────────────────────────────────────────────

app = FastAPI(
    title="ResQ-Pulse API",
    description="Multi-Agent AI Smart Emergency Corridor Backend",
    version="1.0.0",
    lifespan=lifespan
)

# Store engine in app state
app.state.engine = AgentNetworkEngine()

# CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:3001", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Request/Response Models ──────────────────────────────────────────────────

class RouteRequest(BaseModel):
    pickup: List[float]  # [lng, lat]
    hospital_id: str
    city: str = "Bangalore"

class SimulationUpdate(BaseModel):
    ambulance_coords: List[float]  # [lng, lat]

class CongestionUpdate(BaseModel):
    level: int  # 0-100


# ─── REST API Endpoints ──────────────────────────────────────────────────────

@app.get("/")
async def root():
    return {
        "name": "ResQ-Pulse API",
        "version": "1.0.0",
        "status": "operational",
        "signals": SIGNAL_COUNTS,
        "hospitals": len(ALL_KARNATAKA_HOSPITALS)
    }

@app.get("/api/signals")
async def get_signals(city: Optional[str] = None):
    """Get all traffic signals, optionally filtered by city."""
    if city:
        signals = get_signals_by_city(city)
    else:
        signals = ALL_KARNATAKA_SIGNALS
    return {"signals": signals, "count": len(signals)}

@app.get("/api/signals/bbox")
async def get_signals_bbox(
    min_lat: float = Query(...),
    min_lng: float = Query(...),
    max_lat: float = Query(...),
    max_lng: float = Query(...)
):
    """Get signals within a geographic bounding box."""
    signals = get_signals_in_bbox(min_lat, min_lng, max_lat, max_lng)
    return {"signals": signals, "count": len(signals)}

@app.get("/api/hospitals")
async def get_hospitals(city: Optional[str] = None):
    """Get all hospitals, optionally filtered by city."""
    if city:
        hospitals = get_hospitals_by_city(city)
    else:
        hospitals = ALL_KARNATAKA_HOSPITALS
    return {"hospitals": hospitals, "count": len(hospitals)}

@app.get("/api/fallback-routes")
async def get_fallback_routes(city: Optional[str] = None):
    """Get hardcoded fallback routes."""
    if city:
        routes = get_fallback_routes_for_city(city)
    else:
        routes = []
        for city_routes in ALL_FALLBACK_ROUTES.values():
            routes.extend(city_routes)
    return {"routes": routes, "count": len(routes)}

@app.post("/api/route")
async def calculate_route(request: RouteRequest):
    """Calculate route from pickup to hospital."""
    # Find hospital
    hospital = None
    for h in ALL_KARNATAKA_HOSPITALS:
        if h["id"] == request.hospital_id:
            hospital = h
            break
    
    if not hospital:
        raise HTTPException(status_code=404, detail="Hospital not found")
    
    # Get route
    route = await routing_service.get_route(
        start=request.pickup,
        end=hospital["coords"],
        city=request.city
    )
    
    # Find agents along route
    engine: AgentNetworkEngine = app.state.engine
    if route.get("signal_ids"):
        agent_ids = route["signal_ids"]
    else:
        agent_ids = engine.find_agents_near_route(route["polyline"])
    
    engine.set_route_agents(agent_ids)
    
    return {
        "route": route,
        "hospital": hospital,
        "route_agents": engine.get_route_agent_states(),
        "agent_count": len(agent_ids)
    }

@app.post("/api/congestion")
async def set_congestion(update: CongestionUpdate):
    """Set global congestion level for demo."""
    engine: AgentNetworkEngine = app.state.engine
    engine.set_global_congestion(update.level)
    return {"status": "ok", "congestion": update.level}

@app.post("/api/reset")
async def reset_simulation():
    """Reset all agents and simulation state."""
    engine: AgentNetworkEngine = app.state.engine
    engine.reset_all()
    return {"status": "ok", "message": "Simulation reset"}

@app.get("/api/stats")
async def get_stats():
    """Get current network statistics."""
    engine: AgentNetworkEngine = app.state.engine
    return engine.get_stats()

@app.get("/api/agent-states")
async def get_agent_states():
    """Get current state of all agents."""
    engine: AgentNetworkEngine = app.state.engine
    return {
        "agents": engine.get_all_agent_states(),
        "count": len(engine.agents)
    }


# ─── WebSocket for Real-time Simulation ──────────────────────────────────────

class ConnectionManager:
    """Manages WebSocket connections."""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
    
    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"📡 WebSocket connected. Total: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)
        print(f"📡 WebSocket disconnected. Total: {len(self.active_connections)}")
    
    async def broadcast(self, message: dict):
        """Broadcast message to all connected clients."""
        disconnected = []
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                disconnected.append(connection)
        
        for conn in disconnected:
            self.active_connections.remove(conn)


ws_manager = ConnectionManager()


@app.websocket("/ws/simulation")
async def websocket_simulation(websocket: WebSocket):
    """
    WebSocket endpoint for real-time simulation updates.
    
    Client sends: {"type": "position_update", "coords": [lng, lat]}
    Server sends: {"type": "agent_events", "events": [...], "agents": [...]}
    """
    await ws_manager.connect(websocket)
    engine: AgentNetworkEngine = app.state.engine
    
    try:
        while True:
            # Receive position update from frontend
            data = await websocket.receive_json()
            
            if data.get("type") == "position_update":
                coords = data.get("coords", [])
                if len(coords) == 2:
                    # Evaluate all agents against new position
                    events = await engine.evaluate_all(coords)
                    
                    # Send back agent states and any events
                    response = {
                        "type": "agent_update",
                        "timestamp": datetime.now().isoformat(),
                        "ambulance_coords": coords,
                        "agents": engine.get_route_agent_states(),
                        "events": events,
                        "stats": engine.get_stats()
                    }
                    
                    await websocket.send_json(response)
                    
                    # Broadcast events to all connected clients
                    if events:
                        await ws_manager.broadcast({
                            "type": "agent_events",
                            "events": events
                        })
            
            elif data.get("type") == "congestion_update":
                level = data.get("level", 50)
                engine.set_global_congestion(level)
                await websocket.send_json({
                    "type": "congestion_ack",
                    "level": level
                })
            
            elif data.get("type") == "reset":
                engine.reset_all()
                await websocket.send_json({
                    "type": "reset_ack"
                })
    
    except WebSocketDisconnect:
        ws_manager.disconnect(websocket)
    except Exception as e:
        print(f"WebSocket error: {e}")
        ws_manager.disconnect(websocket)


# ─── Run ──────────────────────────────────────────────────────────────────────

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )
