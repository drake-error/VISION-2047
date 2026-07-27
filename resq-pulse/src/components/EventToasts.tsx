"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSimulationStore } from "@/store/useSimulationStore";

export function EventToasts() {
  const toasts = useSimulationStore((s) => s.toasts);
  const removeToast = useSimulationStore((s) => s.removeToast);

  // Auto-dismiss toasts after 4 seconds
  useEffect(() => {
    const timers = toasts.map((toast) =>
      setTimeout(() => removeToast(toast.id), 4000)
    );
    return () => timers.forEach(clearTimeout);
  }, [toasts, removeToast]);

  const getIcon = (type: string) => {
    switch (type) {
      case "green_wave":
        return "✅";
      case "handoff":
        return "📡";
      case "reset":
        return "🔄";
      case "alert":
        return "🚨";
      default:
        return "📡";
    }
  };

  const getBorderColor = (type: string) => {
    switch (type) {
      case "green_wave":
        return "border-emerald-500/30";
      case "handoff":
        return "border-amber-500/30";
      case "reset":
        return "border-slate-500/30";
      case "alert":
        return "border-red-500/30";
      default:
        return "border-cyan-500/30";
    }
  };

  const getGlow = (type: string) => {
    switch (type) {
      case "green_wave":
        return "shadow-emerald-500/10";
      case "handoff":
        return "shadow-amber-500/10";
      case "alert":
        return "shadow-red-500/10";
      default:
        return "shadow-cyan-500/10";
    }
  };

  return (
    <div className="absolute bottom-4 right-4 z-30 w-72 space-y-2 pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
            className={`pointer-events-auto glass-panel p-3 border ${getBorderColor(
              toast.type
            )} shadow-lg ${getGlow(toast.type)} cursor-pointer`}
            onClick={() => removeToast(toast.id)}
          >
            <div className="flex items-start gap-2">
              <span className="text-base flex-shrink-0">{getIcon(toast.type)}</span>
              <div className="min-w-0 flex-1">
                <div className="text-[10px] text-cyan-400/60 font-mono uppercase tracking-wider mb-0.5">
                  {toast.agentName}
                </div>
                <div className="text-[11px] text-white/90 leading-snug">
                  {toast.message}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
