"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Ambulance,
  Hospital,
  Play,
  Pause,
  RotateCcw,
  Gauge,
  AlertTriangle,
  MapPin,
  Clock,
  Route,
  Zap,
  ChevronDown,
  Globe,
  Sun,
  Moon,
} from "lucide-react";
import { useSimulationStore } from "@/store/useSimulationStore";
import {
  HOSPITALS,
  FALLBACK_ROUTES,
  CITY_PRESETS,
  TRAFFIC_SIGNALS,
  getHospitalsByCity,
  getSignalsByCity,
} from "@/data/karnataka";

export function CommandPanel() {
  const {
    selectedCity,
    setSelectedCity,
    selectedHospital,
    setSelectedHospital,
    setActiveRoute,
    isSimulating,
    isPaused,
    speedMultiplier,
    routeDistance,
    routeETA,
    trafficDelay,
    globalCongestion,
    congestionOverride,
    greenWaveCount,
    handoffCount,
    agents,
    startSimulation,
    pauseSimulation,
    resumeSimulation,
    resetSimulation,
    setSpeedMultiplier,
    toggleCongestionOverride,
    setGlobalCongestion,
    setRouteAgentIds,
    addLog,
    theme,
    toggleTheme,
  } = useSimulationStore();

  const [expanded, setExpanded] = useState(true);

  const cityName = CITY_PRESETS[selectedCity]?.name || "Bangalore";
  const cityHospitals = useMemo(() => getHospitalsByCity(cityName), [cityName]);

  const handleCityChange = (city: string) => {
    resetSimulation();
    setSelectedCity(city);
    // Load signals for new city
    const signals = getSignalsByCity(CITY_PRESETS[city]?.name || "Bangalore");
    useSimulationStore.setState({ agents: [...TRAFFIC_SIGNALS] });
    addLog(`🌍 Switched to ${CITY_PRESETS[city]?.name || city} region`, "info");
  };

  const handleHospitalSelect = (hospitalId: string) => {
    const hospital = HOSPITALS.find((h) => h.id === hospitalId);
    if (!hospital) return;

    setSelectedHospital(hospital);

    // Find a matching fallback route
    const route = FALLBACK_ROUTES.find((r) => {
      return (
        Math.abs(r.hospital.coords[0] - hospital.coords[0]) < 0.02 &&
        Math.abs(r.hospital.coords[1] - hospital.coords[1]) < 0.02
      );
    });

    if (route) {
      setActiveRoute(route);
      setRouteAgentIds(route.signal_ids);
      addLog(`📍 Route calculated: ${route.name}`, "info");
      addLog(
        `📏 Distance: ${route.distance_km}km | ETA: ${route.estimated_time_mins} min`,
        "info"
      );
    } else {
      // Generate a simple route from city center to hospital
      const cityCenter = CITY_PRESETS[selectedCity]?.center || [77.5946, 12.9716];
      const simpleRoute = {
        id: `DYNAMIC-${hospitalId}`,
        name: `${CITY_PRESETS[selectedCity]?.name} → ${hospital.name}`,
        description: "Dynamic Emergency Corridor",
        pickup: { name: CITY_PRESETS[selectedCity]?.name || "Origin", coords: cityCenter as [number, number] },
        hospital: { name: hospital.name, coords: hospital.coords },
        polyline: generateSimplePolyline(cityCenter as [number, number], hospital.coords),
        signal_ids: findNearbySignals(cityCenter as [number, number], hospital.coords),
        distance_km: calculateDistance(cityCenter as [number, number], hospital.coords),
        estimated_time_mins: Math.round(calculateDistance(cityCenter as [number, number], hospital.coords) * 3),
      };
      setActiveRoute(simpleRoute);
      setRouteAgentIds(simpleRoute.signal_ids);
      addLog(`📍 Dynamic route generated: ${simpleRoute.name}`, "info");
    }
  };

  const handleStartSimulation = () => {
    if (!selectedHospital) {
      addLog("⚠️ Please select a target hospital first!", "error");
      return;
    }
    addLog("🚨 EMERGENCY CORRIDOR ACTIVATED", "alert");
    addLog("🚑 Ambulance dispatch initiated. All agents on standby.", "info");
    startSimulation();
  };

  return (
    <motion.div
      initial={{ x: -400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="absolute top-14 left-4 z-20 w-[340px]"
    >
      <div className="glass-panel p-5 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-red-700 flex items-center justify-center">
              <Ambulance className="w-4 h-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-cyan-400 tracking-tight">ResQ-Pulse</h1>
              <p className="text-[9px] text-slate-500 uppercase tracking-wider">AI Emergency Command</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              onClick={toggleTheme}
              className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
              title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-cyan-400" />
              )}
            </button>
            <button
              onClick={() => setExpanded(!expanded)}
              className="p-1.5 rounded-lg text-slate-500 hover:text-white hover:bg-white/5 transition-all"
            >
              <ChevronDown className={`w-4 h-4 transition-transform ${expanded ? "" : "-rotate-90"}`} />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="space-y-4 overflow-hidden"
            >
              {/* City Selector */}
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                  <Globe className="w-3 h-3" /> Region
                </label>
                <select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="w-full bg-slate-800/80 text-white text-xs p-2.5 rounded-lg border border-slate-700/50 focus:border-cyan-500/50 focus:outline-none transition-colors"
                >
                  {Object.entries(CITY_PRESETS).map(([key, preset]) => (
                    <option key={key} value={key}>
                      {preset.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Hospital Selector */}
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                  <Hospital className="w-3 h-3" /> Target Hospital
                </label>
                <select
                  value={selectedHospital?.id || ""}
                  onChange={(e) => handleHospitalSelect(e.target.value)}
                  className="w-full bg-slate-800/80 text-white text-xs p-2.5 rounded-lg border border-slate-700/50 focus:border-cyan-500/50 focus:outline-none transition-colors"
                  disabled={isSimulating}
                >
                  <option value="">Select Hospital...</option>
                  {cityHospitals.map((h) => (
                    <option key={h.id} value={h.id}>
                      {h.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Route Stats */}
              {selectedHospital && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="grid grid-cols-3 gap-2"
                >
                  <div className="glass-panel-light p-2.5 text-center">
                    <Route className="w-3 h-3 text-cyan-400 mx-auto mb-1" />
                    <div className="text-xs font-bold text-white">{routeDistance} km</div>
                    <div className="text-[8px] text-slate-500">Distance</div>
                  </div>
                  <div className="glass-panel-light p-2.5 text-center">
                    <Clock className="w-3 h-3 text-emerald-400 mx-auto mb-1" />
                    <div className="text-xs font-bold text-white">{routeETA} min</div>
                    <div className="text-[8px] text-slate-500">ETA</div>
                  </div>
                  <div className="glass-panel-light p-2.5 text-center">
                    <AlertTriangle className="w-3 h-3 text-amber-400 mx-auto mb-1" />
                    <div className="text-xs font-bold text-white">+{trafficDelay} min</div>
                    <div className="text-[8px] text-slate-500">Traffic</div>
                  </div>
                </motion.div>
              )}

              {/* Main Action Button */}
              {!isSimulating ? (
                <button
                  onClick={handleStartSimulation}
                  disabled={!selectedHospital}
                  className="w-full py-3 rounded-lg font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed
                    bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white
                    shadow-lg shadow-red-500/20 hover:shadow-red-500/40"
                >
                  <span className="flex items-center justify-center gap-2">
                    <Zap className="w-4 h-4" />
                    Initiate Emergency Corridor
                  </span>
                </button>
              ) : (
                <div className="flex gap-2">
                  <button
                    onClick={isPaused ? resumeSimulation : pauseSimulation}
                    className="flex-1 py-2.5 rounded-lg font-semibold text-xs transition-all
                      bg-slate-700 hover:bg-slate-600 text-white flex items-center justify-center gap-1.5"
                  >
                    {isPaused ? <Play className="w-3.5 h-3.5" /> : <Pause className="w-3.5 h-3.5" />}
                    {isPaused ? "Resume" : "Pause"}
                  </button>
                  <button
                    onClick={resetSimulation}
                    className="py-2.5 px-4 rounded-lg text-xs transition-all
                      bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center gap-1.5"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Speed Control */}
              <div>
                <label className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1 mb-1.5">
                  <Gauge className="w-3 h-3" /> Simulation Speed
                </label>
                <div className="flex gap-1.5">
                  {[1, 2, 5].map((speed) => (
                    <button
                      key={speed}
                      onClick={() => setSpeedMultiplier(speed)}
                      className={`flex-1 py-1.5 rounded-md text-xs font-mono font-bold transition-all
                        ${speedMultiplier === speed
                          ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40"
                          : "bg-slate-800 text-slate-500 border border-transparent hover:text-white"
                        }`}
                    >
                      {speed}×
                    </button>
                  ))}
                </div>
              </div>

              {/* Congestion Toggle */}
              <div className="space-y-2">
                <button
                  onClick={toggleCongestionOverride}
                  className={`w-full py-2 rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2
                    ${congestionOverride
                      ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                      : "bg-slate-800 text-slate-400 border border-slate-700/50 hover:text-white"
                    }`}
                >
                  <AlertTriangle className="w-3.5 h-3.5" />
                  {congestionOverride ? "🔴 Heavy Congestion Active" : "Toggle Congestion Override"}
                </button>

                {congestionOverride && (
                  <div className="px-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={globalCongestion}
                      onChange={(e) => setGlobalCongestion(Number(e.target.value))}
                      className="w-full h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
                    />
                    <div className="flex justify-between text-[8px] text-slate-600 mt-0.5">
                      <span>0%</span>
                      <span className="text-amber-400 font-mono">{globalCongestion}%</span>
                      <span>100%</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Agent Stats */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <div className="glass-panel-light p-2 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                  <div>
                    <div className="text-xs font-bold text-emerald-400">{greenWaveCount}</div>
                    <div className="text-[8px] text-slate-500">Green Waves</div>
                  </div>
                </div>
                <div className="glass-panel-light p-2 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                  <div>
                    <div className="text-xs font-bold text-amber-400">{handoffCount}</div>
                    <div className="text-[8px] text-slate-500">Handoffs</div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

// ─── Utility Functions ─────────────────────────────────────────────────────

function generateSimplePolyline(
  start: [number, number],
  end: [number, number],
  steps = 15
): [number, number][] {
  const polyline: [number, number][] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const lng = start[0] + (end[0] - start[0]) * t + (Math.random() - 0.5) * 0.002;
    const lat = start[1] + (end[1] - start[1]) * t + (Math.random() - 0.5) * 0.001;
    polyline.push([lng, lat]);
  }
  polyline[0] = start;
  polyline[steps] = end;
  return polyline;
}

function findNearbySignals(start: [number, number], end: [number, number]): string[] {
  const minLng = Math.min(start[0], end[0]) - 0.01;
  const maxLng = Math.max(start[0], end[0]) + 0.01;
  const minLat = Math.min(start[1], end[1]) - 0.01;
  const maxLat = Math.max(start[1], end[1]) + 0.01;

  return TRAFFIC_SIGNALS
    .filter(
      (s) =>
        s.coords[0] >= minLng &&
        s.coords[0] <= maxLng &&
        s.coords[1] >= minLat &&
        s.coords[1] <= maxLat
    )
    .map((s) => s.id)
    .slice(0, 8);
}

function calculateDistance(a: [number, number], b: [number, number]): number {
  const R = 6371;
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLng = ((b[0] - a[0]) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((a[1] * Math.PI) / 180) *
      Math.cos((b[1] * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
  return Math.round(R * c * 10) / 10;
}
