"use client";

import { motion } from "framer-motion";
import { Info } from "lucide-react";
import { useSimulationStore } from "@/store/useSimulationStore";

export function MapLegend() {
  const theme = useSimulationStore((s) => s.theme);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.4 }}
      className="absolute bottom-28 right-4 z-20 w-48"
    >
      <div className="glass-panel p-3 space-y-2 text-[10px] font-mono">
        <div className="flex items-center gap-1 border-b border-white/5 pb-1 text-cyan-400">
          <Info className="w-3 h-3" />
          <span className="uppercase tracking-wider font-bold">Grid Legend</span>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-red-500 border border-white/20 animate-pulse shadow-[0_0_6px_#EF4444]" />
            <span className="text-slate-400">Normal Cycle (Red)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 border border-white/20 animate-pulse shadow-[0_0_8px_#F59E0B]" />
            <span className="text-slate-400">Handoff Standby (Yellow)</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-400 animate-pulse shadow-[0_0_12px_#10B981]" />
            <span className="text-slate-400">Override Active (Green)</span>
          </div>

          <div className="flex items-center gap-2 border-t border-white/5 pt-1.5 mt-1.5">
            <span className="text-xs">🚑</span>
            <span className="text-slate-400">Ambulance Priority EV</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs">🏥</span>
            <span className="text-slate-400">Emergency Hospital</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
