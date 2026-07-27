"use client";

import { useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Terminal } from "lucide-react";
import { useSimulationStore } from "@/store/useSimulationStore";

export function AgentTerminal() {
  const logs = useSimulationStore((s) => s.logs);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [logs]);

  const getColor = (type: string) => {
    switch (type) {
      case "success":
        return "text-emerald-400";
      case "alert":
        return "text-red-400";
      case "handoff":
        return "text-amber-400";
      case "error":
        return "text-red-500";
      default:
        return "text-slate-400";
    }
  };

  return (
    <motion.div
      initial={{ y: 300, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="absolute bottom-4 left-4 z-20 w-[420px]"
    >
      <div className="glass-panel overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-2 px-4 py-2.5 border-b border-cyan-500/10 bg-cyan-500/5">
          <Terminal className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400/80">
            Live Agent Communications
          </span>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] font-mono text-emerald-400/60">LIVE</span>
          </div>
        </div>

        {/* Log Feed */}
        <div
          ref={scrollRef}
          className="h-48 overflow-y-auto p-3 space-y-1 font-mono"
        >
          {logs.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-[10px] text-slate-600">
                Waiting for simulation to start...
              </p>
              <p className="text-[8px] text-slate-700 mt-1">
                Agent messages will appear here in real-time
              </p>
            </div>
          ) : (
            logs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2 }}
                className={`text-[10px] leading-relaxed terminal-line ${getColor(log.type)}`}
              >
                <span className="text-slate-600">[{log.timestamp}]</span>{" "}
                {log.message}
              </motion.div>
            ))
          )}
        </div>

        {/* Footer Stats */}
        <div className="flex items-center justify-between px-4 py-1.5 border-t border-white/5 bg-white/[0.02]">
          <span className="text-[8px] font-mono text-slate-600">
            {logs.length} messages
          </span>
          <span className="text-[8px] font-mono text-slate-600">
            ResQ-Pulse v1.0 • Karnataka AI Grid
          </span>
        </div>
      </div>
    </motion.div>
  );
}
