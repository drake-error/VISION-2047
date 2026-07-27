"use client";

import dynamic from "next/dynamic";
import { CommandPanel } from "../components/CommandPanel";
import { AgentTerminal } from "../components/AgentTerminal";
import { TelemetryHUD } from "../components/TelemetryHUD";
import { EventToasts } from "../components/EventToasts";
import { MapLegend } from "../components/MapLegend";

import { useEffect } from "react";
import { useSimulationStore } from "../store/useSimulationStore";

const MapContainer = dynamic(() => import("../components/MapContainer"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-[#0B0F19]">
      <div className="text-center">
        <div className="w-12 h-12 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-cyan-400 font-mono text-sm">Initializing Map Engine...</p>
      </div>
    </div>
  ),
});

export default function Home() {
  const theme = useSimulationStore((s) => s.theme);

  useEffect(() => {
    if (theme === "light") {
      document.documentElement.classList.remove("dark");
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
      document.documentElement.classList.add("dark");
    }
  }, [theme]);

  return (
    <main className="relative h-screen w-screen overflow-hidden bg-slate-900 transition-colors duration-300">
      {/* Map Layer Container */}
      <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, width: "100vw", height: "100vh", zIndex: 0 }}>
        <MapContainer />
      </div>

      {/* Grid Overlay */}
      <div className="pointer-events-none absolute inset-0 grid-overlay" />
      <div className="pointer-events-none scanline-overlay" />

      {/* Command Panel (Left Side) */}
      <CommandPanel />

      {/* Telemetry HUD (Top Right) */}
      <TelemetryHUD />

      {/* Agent Terminal (Bottom Left) */}
      <AgentTerminal />

      {/* Event Toasts (Right side) */}
      <EventToasts />

      {/* Map Legend */}
      <MapLegend />

      {/* Title Bar */}
      <div className="absolute top-0 left-0 right-0 h-10 flex items-center justify-center pointer-events-none z-30">
        <div className="flex items-center gap-2 px-6 py-1.5 glass-panel-light rounded-b-xl">
          <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-mono uppercase tracking-[0.3em] text-cyan-400/80">
            ResQ-Pulse • Multi-Agent Emergency Corridor • Karnataka
          </span>
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>
      </div>
    </main>
  );
}
