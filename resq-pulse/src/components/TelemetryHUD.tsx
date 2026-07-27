"use client";

import { motion } from "framer-motion";
import {
  Gauge,
  Navigation,
  TrafficCone,
  Radio,
  Cpu,
  MapPin,
} from "lucide-react";
import { useSimulationStore } from "@/store/useSimulationStore";

export function TelemetryHUD() {
  const {
    isSimulating,
    currentSpeed,
    distanceRemaining,
    nextSignalName,
    nextSignalDistance,
    greenWaveCount,
    progress,
    selectedCity,
    agents,
  } = useSimulationStore();

  const activeAgents = agents.filter((a) => a.status !== "NORMAL_CYCLE").length;
  const totalAgents = agents.length;

  return (
    <motion.div
      initial={{ x: 400, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="absolute top-14 right-4 z-20 w-56"
    >
      <div className="glass-panel p-4 space-y-3">
        {/* System Status */}
        <div className="flex items-center gap-2 pb-2 border-b border-white/5">
          <Cpu className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400/80">
            Telemetry
          </span>
          <div className="ml-auto">
            <div
              className={`w-2 h-2 rounded-full ${
                isSimulating ? "bg-emerald-500 animate-pulse" : "bg-slate-600"
              }`}
            />
          </div>
        </div>

        {/* Speed */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Gauge className="w-3 h-3" />
            <span className="text-[9px] uppercase">Speed</span>
          </div>
          <div className="text-right">
            <span className="text-lg font-bold font-mono text-white tabular-nums">
              {isSimulating ? currentSpeed : 0}
            </span>
            <span className="text-[8px] text-slate-500 ml-0.5">km/h</span>
          </div>
        </div>

        {/* Distance Remaining */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Navigation className="w-3 h-3" />
            <span className="text-[9px] uppercase">Remaining</span>
          </div>
          <div className="text-right">
            <span className="text-sm font-bold font-mono text-cyan-400 tabular-nums">
              {distanceRemaining}
            </span>
            <span className="text-[8px] text-slate-500 ml-0.5">km</span>
          </div>
        </div>

        {/* Next Signal */}
        <div className="glass-panel-light p-2.5">
          <div className="flex items-center gap-1.5 mb-1">
            <TrafficCone className="w-3 h-3 text-amber-400" />
            <span className="text-[8px] uppercase text-slate-500">Next Signal</span>
          </div>
          <div className="text-[10px] font-medium text-white truncate">
            {nextSignalName}
          </div>
          <div className="text-[9px] text-slate-500 font-mono">
            {nextSignalDistance > 0 ? `${nextSignalDistance} km away` : "—"}
          </div>
        </div>

        {/* Active Corridors */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500">
            <Radio className="w-3 h-3" />
            <span className="text-[9px] uppercase">Green Corridors</span>
          </div>
          <span className="text-sm font-bold font-mono text-emerald-400">
            {greenWaveCount}
          </span>
        </div>

        {/* Agent Activity */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-slate-500">
            <MapPin className="w-3 h-3" />
            <span className="text-[9px] uppercase">Active Agents</span>
          </div>
          <span className="text-sm font-mono text-white">
            <span className="text-cyan-400 font-bold">{activeAgents}</span>
            <span className="text-slate-600">/{totalAgents}</span>
          </span>
        </div>

        {/* Progress Bar */}
        {isSimulating && (
          <div>
            <div className="flex justify-between text-[8px] text-slate-600 mb-1">
              <span>Mission Progress</span>
              <span className="font-mono">{Math.round(progress * 100)}%</span>
            </div>
            <div className="h-1.5 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                style={{ width: `${progress * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
