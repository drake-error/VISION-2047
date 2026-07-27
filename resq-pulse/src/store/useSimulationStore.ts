/**
 * Zustand Simulation Store
 * Central state management for the ResQ-Pulse simulation engine.
 */

import { create } from "zustand";
import type { TrafficSignal, Hospital, FallbackRoute } from "@/data/karnataka";

export type AgentStatus = "NORMAL_CYCLE" | "HANDOFF_SIGNAL" | "GREEN_WAVE_ACTIVE";

export interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: "info" | "alert" | "success" | "error" | "handoff";
  agentName?: string;
}

export interface ToastEvent {
  id: string;
  message: string;
  type: "handoff" | "green_wave" | "reset" | "alert";
  agentName: string;
  timestamp: number;
}

interface SimulationState {
  // ─── Simulation Control ────────────────────────────────────────────────
  isSimulating: boolean;
  isPaused: boolean;
  speedMultiplier: number;
  progress: number; // 0 to 1

  // ─── City Selection ────────────────────────────────────────────────────
  selectedCity: string;

  // ─── Ambulance State ───────────────────────────────────────────────────
  ambulanceLocation: [number, number] | null;
  ambulanceBearing: number;
  currentSpeed: number; // km/h

  // ─── Route State ───────────────────────────────────────────────────────
  selectedHospital: Hospital | null;
  activeRoute: FallbackRoute | null;
  routePolyline: [number, number][];
  routeDistance: number;
  routeETA: number;
  trafficDelay: number;

  // ─── Agent State ───────────────────────────────────────────────────────
  agents: TrafficSignal[];
  routeAgentIds: string[];

  // ─── Congestion ────────────────────────────────────────────────────────
  globalCongestion: number;
  congestionOverride: boolean;

  // ─── Logs & Events ─────────────────────────────────────────────────────
  logs: LogEntry[];
  toasts: ToastEvent[];

  // ─── Stats ─────────────────────────────────────────────────────────────
  greenWaveCount: number;
  handoffCount: number;
  distanceRemaining: number;
  nextSignalName: string;
  nextSignalDistance: number;

  // ─── Theme State ──────────────────────────────────────────────────────
  theme: "dark" | "light";

  // ─── Actions ───────────────────────────────────────────────────────────
  toggleTheme: () => void;
  setSelectedCity: (city: string) => void;
  setSelectedHospital: (hospital: Hospital | null) => void;
  setActiveRoute: (route: FallbackRoute | null) => void;
  setRoutePolyline: (polyline: [number, number][]) => void;
  setAmbulanceLocation: (loc: [number, number]) => void;
  setAmbulanceBearing: (bearing: number) => void;
  setProgress: (progress: number) => void;
  setCurrentSpeed: (speed: number) => void;
  updateAgent: (id: string, updates: Partial<TrafficSignal>) => void;
  updateAgentsBatch: (updates: { id: string; status: AgentStatus; congestion?: number }[]) => void;
  setRouteAgentIds: (ids: string[]) => void;
  addLog: (message: string, type?: LogEntry["type"], agentName?: string) => void;
  addToast: (message: string, type: ToastEvent["type"], agentName: string) => void;
  removeToast: (id: string) => void;
  setGlobalCongestion: (level: number) => void;
  toggleCongestionOverride: () => void;
  setSpeedMultiplier: (speed: number) => void;
  startSimulation: () => void;
  pauseSimulation: () => void;
  resumeSimulation: () => void;
  resetSimulation: () => void;
  setDistanceRemaining: (d: number) => void;
  setNextSignal: (name: string, distance: number) => void;
  setStats: (green: number, handoff: number) => void;
}

let logCounter = 0;
let toastCounter = 0;

export const useSimulationStore = create<SimulationState>((set, get) => ({
  // ─── Initial State ─────────────────────────────────────────────────────
  isSimulating: false,
  isPaused: false,
  speedMultiplier: 1,
  progress: 0,
  selectedCity: "bangalore",
  ambulanceLocation: null,
  ambulanceBearing: 0,
  currentSpeed: 0,
  selectedHospital: null,
  activeRoute: null,
  routePolyline: [],
  routeDistance: 0,
  routeETA: 0,
  trafficDelay: 0,
  agents: [],
  routeAgentIds: [],
  globalCongestion: 50,
  congestionOverride: false,
  logs: [],
  toasts: [],
  greenWaveCount: 0,
  handoffCount: 0,
  distanceRemaining: 0,
  nextSignalName: "—",
  nextSignalDistance: 0,
  theme: "dark",

  // ─── Actions ───────────────────────────────────────────────────────────
  toggleTheme: () => set((state) => ({ theme: state.theme === "dark" ? "light" : "dark" })),
  setSelectedCity: (city) => set({ selectedCity: city }),

  setSelectedHospital: (hospital) => set({ selectedHospital: hospital }),

  setActiveRoute: (route) =>
    set({
      activeRoute: route,
      routeDistance: route?.distance_km ?? 0,
      routeETA: route?.estimated_time_mins ?? 0,
      trafficDelay: route ? Math.round(route.estimated_time_mins * 0.3) : 0,
      routePolyline: route?.polyline ?? [],
    }),

  setRoutePolyline: (polyline) => set({ routePolyline: polyline }),

  setAmbulanceLocation: (loc) => set({ ambulanceLocation: loc }),

  setAmbulanceBearing: (bearing) => set({ ambulanceBearing: bearing }),

  setProgress: (progress) => set({ progress }),

  setCurrentSpeed: (speed) => set({ currentSpeed: speed }),

  updateAgent: (id, updates) =>
    set((state) => ({
      agents: state.agents.map((a) =>
        a.id === id ? { ...a, ...updates } : a
      ),
    })),

  updateAgentsBatch: (updates) =>
    set((state) => {
      const updateMap = new Map(updates.map((u) => [u.id, u]));
      return {
        agents: state.agents.map((a) => {
          const update = updateMap.get(a.id);
          return update
            ? { ...a, status: update.status, congestion: update.congestion ?? a.congestion }
            : a;
        }),
      };
    }),

  setRouteAgentIds: (ids) => set({ routeAgentIds: ids }),

  addLog: (message, type = "info", agentName) =>
    set((state) => ({
      logs: [
        {
          id: `log-${++logCounter}`,
          timestamp: new Date().toLocaleTimeString("en-IN", { hour12: false }),
          message,
          type,
          agentName,
        },
        ...state.logs,
      ].slice(0, 100),
    })),

  addToast: (message, type, agentName) =>
    set((state) => ({
      toasts: [
        ...state.toasts,
        {
          id: `toast-${++toastCounter}`,
          message,
          type,
          agentName,
          timestamp: Date.now(),
        },
      ].slice(-5),
    })),

  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    })),

  setGlobalCongestion: (level) => set({ globalCongestion: level }),

  toggleCongestionOverride: () =>
    set((state) => {
      const newOverride = !state.congestionOverride;
      const newCongestion = newOverride ? 90 : 50;
      return {
        congestionOverride: newOverride,
        globalCongestion: newCongestion,
      };
    }),

  setSpeedMultiplier: (speed) => set({ speedMultiplier: speed }),

  startSimulation: () =>
    set({
      isSimulating: true,
      isPaused: false,
      progress: 0,
    }),

  pauseSimulation: () => set({ isPaused: true }),

  resumeSimulation: () => set({ isPaused: false }),

  resetSimulation: () =>
    set((state) => ({
      isSimulating: false,
      isPaused: false,
      progress: 0,
      ambulanceLocation: null,
      ambulanceBearing: 0,
      currentSpeed: 0,
      logs: [],
      toasts: [],
      greenWaveCount: 0,
      handoffCount: 0,
      distanceRemaining: 0,
      nextSignalName: "—",
      nextSignalDistance: 0,
      agents: state.agents.map((a) => ({ ...a, status: "NORMAL_CYCLE" as const })),
    })),

  setDistanceRemaining: (d) => set({ distanceRemaining: d }),

  setNextSignal: (name, distance) =>
    set({ nextSignalName: name, nextSignalDistance: distance }),

  setStats: (green, handoff) =>
    set({ greenWaveCount: green, handoffCount: handoff }),
}));
