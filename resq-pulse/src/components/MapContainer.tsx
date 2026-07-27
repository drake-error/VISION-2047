"use client";

import { useEffect, useRef, useCallback } from "react";
import * as maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import * as turf from "@turf/turf";
import { useSimulationStore } from "@/store/useSimulationStore";
import {
  TRAFFIC_SIGNALS,
  HOSPITALS,
  CITY_PRESETS,
  getHospitalsByCity,
  getSignalsByCity,
} from "@/data/karnataka";
import type { TrafficSignal } from "@/data/karnataka";

// ─── Inline raster styles (guaranteed to work, no external style.json) ───

const DARK_RASTER_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  name: "ResQ-Pulse Dark",
  sources: {
    "carto-dark": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
        "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      maxzoom: 20,
    },
  },
  layers: [
    {
      id: "carto-dark-layer",
      type: "raster",
      source: "carto-dark",
      minzoom: 0,
      maxzoom: 22,
    },
  ],
  glyphs: "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
};

const LIGHT_RASTER_STYLE: maplibregl.StyleSpecification = {
  version: 8,
  name: "ResQ-Pulse Light",
  sources: {
    "carto-light": {
      type: "raster",
      tiles: [
        "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
        "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
        "https://c.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
      ],
      tileSize: 256,
      attribution: '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>',
      maxzoom: 20,
    },
  },
  layers: [
    {
      id: "carto-light-layer",
      type: "raster",
      source: "carto-light",
      minzoom: 0,
      maxzoom: 22,
    },
  ],
  glyphs: "https://fonts.openmaptiles.org/{fontstack}/{range}.pbf",
};

export default function MapContainer() {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const ambulanceMarker = useRef<maplibregl.Marker | null>(null);
  const gpsMarker = useRef<maplibregl.Marker | null>(null);
  const signalMarkers = useRef<Map<string, { marker: maplibregl.Marker; el: HTMLDivElement }>>(new Map());
  const hospitalMarkers = useRef<maplibregl.Marker[]>([]);
  const animationRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const {
    selectedCity,
    isSimulating,
    isPaused,
    speedMultiplier,
    routePolyline,
    agents,
    selectedHospital,
    activeRoute,
    setAmbulanceLocation,
    setAmbulanceBearing,
    setProgress,
    setCurrentSpeed,
    updateAgent,
    addLog,
    addToast,
    setDistanceRemaining,
    setNextSignal,
    setStats,
    setRouteAgentIds,
    resetSimulation,
    theme,
  } = useSimulationStore();

  // Store ref for animation loop access
  const storeRef = useRef(useSimulationStore.getState());
  useEffect(() => {
    const unsub = useSimulationStore.subscribe((state) => {
      storeRef.current = state;
    });
    return unsub;
  }, []);

  // ─── GPS Geolocation ───────────────────────────────────────────────────

  const requestGPS = useCallback(() => {
    if (!("geolocation" in navigator)) {
      addLog("⚠️ Geolocation API not available. Using Bangalore fallback.", "error");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        addLog(`📍 GPS acquired: ${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E (±${Math.round(accuracy)}m)`, "success");

        // Place a blue GPS marker on the map
        if (map.current) {
          // Remove old GPS marker
          gpsMarker.current?.remove();

          const el = document.createElement("div");
          el.className = "gps-marker";
          el.style.cssText = `
            width: 18px; height: 18px; border-radius: 50%;
            background: radial-gradient(circle, #3B82F6 40%, rgba(59,130,246,0.3) 100%);
            border: 3px solid white;
            box-shadow: 0 0 12px rgba(59,130,246,0.6), 0 0 24px rgba(59,130,246,0.3);
            animation: pulse-gps 2s ease-in-out infinite;
          `;

          gpsMarker.current = new maplibregl.Marker({ element: el })
            .setLngLat([longitude, latitude])
            .setPopup(
              new maplibregl.Popup({ offset: 12 }).setHTML(
                `<div style="font-size:11px;color:white;">
                  <div style="font-weight:bold;color:#3B82F6;">📍 Your Location</div>
                  <div style="color:#94A3B8;margin-top:2px;">${latitude.toFixed(4)}°N, ${longitude.toFixed(4)}°E</div>
                  <div style="color:#64748B;font-size:9px;margin-top:2px;">Accuracy: ±${Math.round(accuracy)}m</div>
                </div>`
              )
            )
            .addTo(map.current);

          // Detect which city the user is in and auto-switch
          autoDetectCity(latitude, longitude);

          // Fly to GPS location
          map.current.flyTo({
            center: [longitude, latitude],
            zoom: 14,
            pitch: 50,
            duration: 2000,
          });

          // Store GPS coords for route pickup
          useSimulationStore.setState({
            ambulanceLocation: [longitude, latitude] as [number, number],
          });
        }
      },
      (error) => {
        let errorMsg = "GPS Error: ";
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMsg += "Location permission denied by user.";
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg += "Position unavailable.";
            break;
          case error.TIMEOUT:
            errorMsg += "Request timed out.";
            break;
          default:
            errorMsg += "Unknown error.";
        }
        addLog(`⚠️ ${errorMsg} Using city center as fallback.`, "error");
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      }
    );
  }, [addLog]);

  // ─── Auto-detect city from GPS coordinates ─────────────────────────────

  const autoDetectCity = useCallback((lat: number, lng: number) => {
    const cityBounds: Record<string, { minLat: number; maxLat: number; minLng: number; maxLng: number }> = {
      bangalore: { minLat: 12.75, maxLat: 13.15, minLng: 77.4, maxLng: 77.8 },
      belagavi: { minLat: 15.78, maxLat: 15.92, minLng: 74.44, maxLng: 74.58 },
      mysuru: { minLat: 12.25, maxLat: 12.40, minLng: 76.55, maxLng: 76.75 },
      hubli: { minLat: 15.30, maxLat: 15.50, minLng: 74.95, maxLng: 75.20 },
      mangaluru: { minLat: 12.82, maxLat: 12.95, minLng: 74.80, maxLng: 74.95 },
    };

    for (const [city, bounds] of Object.entries(cityBounds)) {
      if (lat >= bounds.minLat && lat <= bounds.maxLat && lng >= bounds.minLng && lng <= bounds.maxLng) {
        const currentCity = storeRef.current.selectedCity;
        if (currentCity !== city) {
          useSimulationStore.setState({ selectedCity: city });
          addLog(`🌍 Auto-detected region: ${CITY_PRESETS[city]?.name || city}`, "info");
        }
        return;
      }
    }

    // Default to Bangalore if outside known Karnataka cities
    addLog("📍 GPS location outside known cities. Defaulting to Bangalore.", "info");
  }, [addLog]);

  // ─── Initialize Map ────────────────────────────────────────────────────

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    const preset = CITY_PRESETS[selectedCity] || CITY_PRESETS.bangalore;

    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: DARK_RASTER_STYLE,
      center: preset.center,
      zoom: preset.zoom,
      pitch: 45,
      bearing: -10,
    });

    map.current.addControl(new maplibregl.NavigationControl(), "bottom-right");

    // Add GPS locate control
    const geolocate = new maplibregl.GeolocateControl({
      positionOptions: { enableHighAccuracy: true },
      trackUserLocation: true,
    });
    map.current.addControl(geolocate, "bottom-right");

    map.current.on("load", () => {
      initializeSignalMarkers();
      initializeHospitalMarkers();

      // Fix map layout size glitch: trigger immediate and delayed canvas recalculations
      if (map.current) {
        map.current.resize();
        setTimeout(() => map.current?.resize(), 100);
        setTimeout(() => map.current?.resize(), 500);
        setTimeout(() => map.current?.resize(), 1000);
      }

      // Auto-request GPS after map loads
      requestGPS();
    });

    // Add window resize listener
    const handleResize = () => {
      map.current?.resize();
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      map.current?.remove();
      map.current = null;
    };
  }, []);

  // ─── Theme Switcher ────────────────────────────────────────────────────

  useEffect(() => {
    if (!map.current) return;

    const currentStyle = theme === "dark" ? DARK_RASTER_STYLE : LIGHT_RASTER_STYLE;
    map.current.setStyle(currentStyle);

    // Wait for the new style to load and re-add layers
    map.current.once("style.load", () => {
      // Re-trigger layout resizing
      map.current?.resize();

      // Clear out and re-initialize markers
      clearMarkers();
      initializeSignalMarkers();
      initializeHospitalMarkers();

      // Re-draw active route if exists
      if (routePolyline.length >= 2) {
        // We trigger route update by calling state dispatch
        useSimulationStore.setState({ routePolyline: [...routePolyline] });
      }
    });
  }, [theme]);

  // ─── City Change ───────────────────────────────────────────────────────

  useEffect(() => {
    if (!map.current) return;
    const preset = CITY_PRESETS[selectedCity] || CITY_PRESETS.bangalore;
    map.current.flyTo({
      center: preset.center,
      zoom: preset.zoom,
      pitch: 45,
      duration: 2000,
    });

    // Re-init markers for new city
    clearMarkers();
    setTimeout(() => {
      initializeSignalMarkers();
      initializeHospitalMarkers();
    }, 500);
  }, [selectedCity]);

  // ─── Initialize Signal Markers ─────────────────────────────────────────

  const initializeSignalMarkers = useCallback(() => {
    if (!map.current) return;

    const citySignals = getSignalsByCity(
      CITY_PRESETS[storeRef.current.selectedCity]?.name || "Bangalore"
    );

    // Initialize agents in store
    const store = useSimulationStore.getState();
    if (store.agents.length === 0) {
      useSimulationStore.setState({ agents: TRAFFIC_SIGNALS });
    }

    citySignals.forEach((signal) => {
      // Find the corresponding agent in store to get real-time state
      const agent = store.agents.find((a) => a.id === signal.id) || signal;

      const el = document.createElement("div");
      el.className = "signal-node-wrapper normal";
      el.id = `node-wrapper-${signal.id}`;
      el.title = signal.name;
      el.innerHTML = `
        <div class="signal-node-glow"></div>
        <div class="signal-node-core">
          <span class="signal-node-dot"></span>
        </div>
        <div class="signal-node-label">${signal.congestion}%</div>
      `;

      // Set up professional telemetric popup content
      const popupHTML = `
        <div class="text-xs p-1 font-mono">
          <div class="flex items-center gap-1.5 border-b border-white/10 pb-1 mb-1.5 justify-between">
            <span class="text-cyan-400 font-bold uppercase tracking-wider">🚦 Junction Node</span>
            <span class="text-[9px] px-1 rounded bg-slate-800 text-slate-400 border border-white/5 font-mono">
              Agent ID: ${signal.id}
            </span>
          </div>
          <div class="font-bold text-white mb-2 text-[11px]">${signal.name}</div>
          
          <div class="space-y-1.5">
            <div class="flex justify-between items-center">
              <span class="text-slate-400 text-[10px]">Decision Mode:</span>
              <span id="popup-status-${signal.id}" class="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">
                NORMAL_CYCLE
              </span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-400 text-[10px]">Current Load:</span>
              <span class="text-white text-[10px] font-bold">${signal.congestion}%</span>
            </div>
            <div class="flex justify-between items-center">
              <span class="text-slate-400 text-[10px]">AI Priority:</span>
              <span id="popup-priority-${signal.id}" class="text-[9px] text-slate-500">Autonomous</span>
            </div>
          </div>
        </div>
      `;

      const popup = new maplibregl.Popup({ offset: 18 })
        .setHTML(popupHTML);

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(signal.coords)
        .setPopup(popup)
        .addTo(map.current!);

      // Update popup content dynamically when opened
      marker.getPopup().on("open", () => {
        const currentAgent = useSimulationStore.getState().agents.find((a) => a.id === signal.id);
        if (currentAgent) {
          const statusEl = document.getElementById(`popup-status-${signal.id}`);
          const priorityEl = document.getElementById(`popup-priority-${signal.id}`);
          if (statusEl && priorityEl) {
            if (currentAgent.status === "GREEN_WAVE_ACTIVE") {
              statusEl.innerText = "OVERRIDE_ACTIVE";
              statusEl.className = "text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
              priorityEl.innerText = "Priority Rank 1 (EV)";
              priorityEl.className = "text-[9px] font-bold text-emerald-400";
            } else if (currentAgent.status === "HANDOFF_SIGNAL") {
              statusEl.innerText = "HANDOFF_STANDBY";
              statusEl.className = "text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20";
              priorityEl.innerText = "Priority Rank 2 (Standby)";
              priorityEl.className = "text-[9px] font-bold text-amber-400";
            } else {
              statusEl.innerText = "NORMAL_CYCLE";
              statusEl.className = "text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20";
              priorityEl.innerText = "Autonomous Grid";
              priorityEl.className = "text-[9px] text-slate-500";
            }
          }
        }
      });

      signalMarkers.current.set(signal.id, { marker, el });
    });
  }, []);

  // ─── Initialize Hospital Markers ───────────────────────────────────────

  const initializeHospitalMarkers = useCallback(() => {
    if (!map.current) return;

    const cityHospitals = getHospitalsByCity(
      CITY_PRESETS[storeRef.current.selectedCity]?.name || "Bangalore"
    );

    cityHospitals.forEach((hospital) => {
      const el = document.createElement("div");
      el.className = "hospital-marker";
      el.innerHTML = "🏥";
      el.title = hospital.name;

      const marker = new maplibregl.Marker({ element: el })
        .setLngLat(hospital.coords)
        .setPopup(
          new maplibregl.Popup({ offset: 15 }).setHTML(
            `<div class="text-xs">
              <div class="font-bold text-white">${hospital.name}</div>
              <div class="text-slate-400">${hospital.type}</div>
              <div class="text-emerald-400 text-[10px] mt-1">🟢 Emergency: Active</div>
            </div>`
          )
        )
        .addTo(map.current!);

      hospitalMarkers.current.push(marker);
    });
  }, []);

  // ─── Clear Markers ─────────────────────────────────────────────────────

  const clearMarkers = useCallback(() => {
    signalMarkers.current.forEach(({ marker }) => marker.remove());
    signalMarkers.current.clear();
    hospitalMarkers.current.forEach((m) => m.remove());
    hospitalMarkers.current = [];
    ambulanceMarker.current?.remove();
    ambulanceMarker.current = null;

    // Remove route layer
    if (map.current?.getSource("route")) {
      if (map.current.getLayer("route-line")) map.current.removeLayer("route-line");
      if (map.current.getLayer("route-glow")) map.current.removeLayer("route-glow");
      map.current.removeSource("route");
    }
  }, []);

  // ─── Draw Route ────────────────────────────────────────────────────────

  useEffect(() => {
    if (!map.current || routePolyline.length < 2) return;

    const drawRoute = () => {
      if (!map.current) return;

      // Remove existing route safely
      if (map.current.getSource("route")) {
        if (map.current.getLayer("route-line")) map.current.removeLayer("route-line");
        if (map.current.getLayer("route-glow")) map.current.removeLayer("route-glow");
        map.current.removeSource("route");
      }

      const geojson: GeoJSON.FeatureCollection = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: routePolyline,
            },
            properties: {},
          },
        ],
      };

      map.current!.addSource("route", { type: "geojson", data: geojson });

      // Glow layer
      map.current!.addLayer({
        id: "route-glow",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#06B6D4",
          "line-width": 12,
          "line-opacity": 0.15,
          "line-blur": 8,
        },
      });

      // Main line
      map.current!.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#06B6D4",
          "line-width": 4,
          "line-opacity": 0.9,
        },
      });

      // Fit map to route
      const bounds = new maplibregl.LngLatBounds();
      routePolyline.forEach((coord) => bounds.extend(coord as [number, number]));
      map.current!.fitBounds(bounds, { padding: 100, pitch: 50, duration: 1500 });
    };

    if (map.current.isStyleLoaded()) {
      drawRoute();
    } else {
      map.current.on("load", drawRoute);
    }
  }, [routePolyline]);

  // ─── Update Signal Marker Colors ───────────────────────────────────────

  useEffect(() => {
    agents.forEach((agent) => {
      const entry = signalMarkers.current.get(agent.id);
      if (!entry) return;

      const { el } = entry;
      el.className = "signal-node-wrapper";

      switch (agent.status) {
        case "GREEN_WAVE_ACTIVE":
          el.classList.add("green-wave");
          break;
        case "HANDOFF_SIGNAL":
          el.classList.add("handoff");
          break;
        default:
          el.classList.add("normal");
      }
    });
  }, [agents]);

  // ─── Animation Loop ────────────────────────────────────────────────────

  useEffect(() => {
    if (!isSimulating || isPaused || routePolyline.length < 2) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    const line = turf.lineString(routePolyline);
    const totalDistance = turf.length(line, { units: "kilometers" });
    const baseDuration = 30000; // 30 seconds for full route at 1x

    // Create ambulance marker if not exists
    if (!ambulanceMarker.current && map.current) {
      const el = document.createElement("div");
      el.className = "ambulance-marker";
      el.innerHTML = "🚑";
      ambulanceMarker.current = new maplibregl.Marker({ element: el })
        .setLngLat(routePolyline[0])
        .addTo(map.current);
    }

    startTimeRef.current = performance.now();

    const animate = (time: number) => {
      const state = storeRef.current;
      if (!state.isSimulating || state.isPaused) return;

      const elapsed = time - startTimeRef.current;
      const duration = baseDuration / state.speedMultiplier;
      const progress = Math.min(elapsed / duration, 1);

      // Get current position along route
      const currentDist = progress * totalDistance;
      const currentPoint = turf.along(line, currentDist, { units: "kilometers" });
      const currentCoords = currentPoint.geometry.coordinates as [number, number];

      // Calculate bearing
      const lookAheadDist = Math.min(currentDist + 0.1, totalDistance);
      const lookAheadPoint = turf.along(line, lookAheadDist, { units: "kilometers" });
      const bearing = turf.bearing(
        turf.point(currentCoords),
        turf.point(lookAheadPoint.geometry.coordinates)
      );

      // Update ambulance position
      ambulanceMarker.current?.setLngLat(currentCoords);
      setAmbulanceLocation(currentCoords);
      setAmbulanceBearing(bearing);
      setProgress(progress);
      setCurrentSpeed(Math.round(40 + Math.random() * 30));
      setDistanceRemaining(Math.round((totalDistance - currentDist) * 10) / 10);

      // Evaluate agents
      evaluateAgents(currentCoords, totalDistance, currentDist);

      // Camera follow
      if (map.current && progress < 1) {
        map.current.easeTo({
          center: currentCoords,
          bearing: bearing * 0.3,
          duration: 100,
          easing: (t: number) => t,
        });
      }

      if (progress < 1) {
        animationRef.current = requestAnimationFrame(animate);
      } else {
        // Simulation complete
        addLog("🏥 Ambulance has arrived at the hospital! Mission Complete.", "success");
        addToast("Mission Complete! Ambulance arrived.", "green_wave", "SYSTEM");
        useSimulationStore.getState().pauseSimulation();
      }
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [isSimulating, isPaused, routePolyline]);

  // ─── Agent Evaluation (Frontend Simulation) ────────────────────────────

  const evaluateAgents = useCallback(
    (currentCoords: [number, number], totalDistance: number, currentDist: number) => {
      const state = storeRef.current;
      const currentPoint = turf.point(currentCoords);
      let greenCount = 0;
      let handoffCount = 0;
      let nearestDist = Infinity;
      let nearestName = "—";

      state.agents.forEach((agent) => {
        const agentPoint = turf.point(agent.coords);
        const distance = turf.distance(currentPoint, agentPoint, { units: "kilometers" });

        // Track nearest signal
        if (distance < nearestDist && distance > 0.05) {
          nearestDist = distance;
          nearestName = agent.name;
        }

        const congestionThreshold = state.globalCongestion > 80 ? 1.5 : 1.0;
        const greenThreshold = state.globalCongestion > 80 ? 0.8 : 0.5;

        let newStatus = agent.status;

        if (distance <= greenThreshold && agent.status !== "GREEN_WAVE_ACTIVE") {
          newStatus = "GREEN_WAVE_ACTIVE";
          updateAgent(agent.id, { status: "GREEN_WAVE_ACTIVE" });
          addLog(
            `✅ [${agent.name}]: EMERGENCY OVERRIDE. Signal forced GREEN. Corridor open. Density: ${agent.congestion}%`,
            "success",
            agent.name
          );
          addToast(`Signal forced GREEN at ${agent.area}`, "green_wave", agent.name);
        } else if (
          distance <= congestionThreshold &&
          distance > greenThreshold &&
          agent.status === "NORMAL_CYCLE"
        ) {
          newStatus = "HANDOFF_SIGNAL";
          updateAgent(agent.id, { status: "HANDOFF_SIGNAL" });
          addLog(
            `📡 [SYSTEM] → [${agent.name}]: Handshake initiated. EV at ${distance.toFixed(1)}km. Prepare green wave.`,
            "handoff",
            agent.name
          );
          addToast(`Handoff signal sent to ${agent.area}`, "handoff", agent.name);
        } else if (distance > congestionThreshold + 0.5 && agent.status === "GREEN_WAVE_ACTIVE") {
          newStatus = "NORMAL_CYCLE";
          updateAgent(agent.id, { status: "NORMAL_CYCLE" });
          addLog(
            `🔄 [${agent.name}]: Vehicle cleared sector. Resuming normal signal cycles.`,
            "info",
            agent.name
          );
        }

        if (newStatus === "GREEN_WAVE_ACTIVE") greenCount++;
        if (newStatus === "HANDOFF_SIGNAL") handoffCount++;
      });

      setNextSignal(nearestName, Math.round(nearestDist * 10) / 10);
      setStats(greenCount, handoffCount);
    },
    []
  );

  return (
    <div
      ref={mapContainer}
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
      }}
    />
  );
}
