"""
LLM Service for AI Agent Reasoning
Uses Google Gemini (free tier) with Groq fallback for agent decision-making.
"""

import os
import json
import asyncio
from typing import Optional, Dict, Any
from datetime import datetime

# Try to import google generative AI
try:
    import google.generativeai as genai
    GEMINI_AVAILABLE = True
except ImportError:
    GEMINI_AVAILABLE = False


class LLMService:
    """Handles LLM-powered reasoning for traffic AI agents."""
    
    def __init__(self):
        self.gemini_model = None
        self.use_fallback = False
        self._init_gemini()
    
    def _init_gemini(self):
        """Initialize Google Gemini API."""
        api_key = os.environ.get("GOOGLE_GEMINI_API_KEY", os.environ.get("GEMINI_API_KEY", ""))
        
        if api_key and GEMINI_AVAILABLE:
            try:
                genai.configure(api_key=api_key)
                self.gemini_model = genai.GenerativeModel('gemini-2.0-flash')
                print("✅ Gemini LLM initialized successfully")
            except Exception as e:
                print(f"⚠️ Gemini init failed: {e}. Using deterministic fallback.")
                self.use_fallback = True
        else:
            print("ℹ️ No Gemini API key found. Using intelligent deterministic fallback.")
            self.use_fallback = True
    
    async def analyze_traffic_situation(
        self,
        agent_name: str,
        agent_area: str,
        congestion_level: int,
        ambulance_distance_km: float,
        ambulance_eta_seconds: float,
        neighboring_agents: list,
        current_signal_status: str
    ) -> Dict[str, Any]:
        """
        Use LLM to analyze traffic situation and generate agent decision.
        Falls back to deterministic logic if LLM is unavailable.
        """
        if self.use_fallback or not self.gemini_model:
            return self._deterministic_analysis(
                agent_name, agent_area, congestion_level,
                ambulance_distance_km, ambulance_eta_seconds,
                neighboring_agents, current_signal_status
            )
        
        try:
            return await self._llm_analysis(
                agent_name, agent_area, congestion_level,
                ambulance_distance_km, ambulance_eta_seconds,
                neighboring_agents, current_signal_status
            )
        except Exception as e:
            print(f"LLM analysis failed for {agent_name}: {e}")
            return self._deterministic_analysis(
                agent_name, agent_area, congestion_level,
                ambulance_distance_km, ambulance_eta_seconds,
                neighboring_agents, current_signal_status
            )
    
    async def _llm_analysis(
        self,
        agent_name: str,
        agent_area: str,
        congestion_level: int,
        ambulance_distance_km: float,
        ambulance_eta_seconds: float,
        neighboring_agents: list,
        current_signal_status: str
    ) -> Dict[str, Any]:
        """Use Gemini LLM for traffic analysis."""
        
        prompt = f"""You are {agent_name}, an autonomous AI traffic management agent controlling signals at {agent_area}, Karnataka, India.

CURRENT SITUATION:
- Traffic Congestion Level: {congestion_level}% (0=empty, 100=gridlocked)
- Emergency Ambulance Distance: {ambulance_distance_km:.2f} km from your junction
- Ambulance ETA to your junction: {ambulance_eta_seconds:.0f} seconds
- Current Signal Status: {current_signal_status}
- Neighboring Agents: {json.dumps(neighboring_agents)}

DECISION RULES:
1. If ambulance is > 1.0 km away: Maintain NORMAL_CYCLE
2. If ambulance is 0.5-1.0 km: Issue HANDOFF_SIGNAL to prepare downstream agents
3. If ambulance is < 0.5 km: Activate GREEN_WAVE_ACTIVE - force all lights green
4. If congestion > 80%, activate green wave earlier (at 1.5 km threshold)

Respond ONLY with valid JSON:
{{
    "decision": "NORMAL_CYCLE" | "HANDOFF_SIGNAL" | "GREEN_WAVE_ACTIVE",
    "reasoning": "brief 1-2 sentence reasoning",
    "alert_message": "message to send to downstream agents (if any)",
    "congestion_response": "how you're handling the congestion",
    "priority_level": 1-5 (5 being highest emergency)
}}"""

        response = await asyncio.to_thread(
            self.gemini_model.generate_content, prompt
        )
        
        # Parse JSON from response
        response_text = response.text.strip()
        # Remove markdown code blocks if present
        if response_text.startswith("```"):
            response_text = response_text.split("\n", 1)[1]
            response_text = response_text.rsplit("```", 1)[0]
        
        try:
            result = json.loads(response_text)
            result["source"] = "gemini-llm"
            return result
        except json.JSONDecodeError:
            # If LLM returns malformed JSON, use deterministic
            return self._deterministic_analysis(
                agent_name, agent_area, congestion_level,
                ambulance_distance_km, ambulance_eta_seconds,
                neighboring_agents, current_signal_status
            )
    
    def _deterministic_analysis(
        self,
        agent_name: str,
        agent_area: str,
        congestion_level: int,
        ambulance_distance_km: float,
        ambulance_eta_seconds: float,
        neighboring_agents: list,
        current_signal_status: str
    ) -> Dict[str, Any]:
        """Deterministic fallback analysis when LLM is unavailable."""
        
        # Adjust thresholds based on congestion
        green_wave_threshold = 0.5 if congestion_level < 80 else 1.5
        handoff_threshold = 1.0 if congestion_level < 80 else 2.0
        
        if ambulance_distance_km <= green_wave_threshold:
            decision = "GREEN_WAVE_ACTIVE"
            priority = 5
            reasoning = (
                f"Emergency vehicle at {ambulance_distance_km:.2f}km. "
                f"Congestion at {congestion_level}%. Forcing all signals GREEN for emergency corridor."
            )
            alert = (
                f"🚨 EMERGENCY OVERRIDE at {agent_area}. "
                f"All signals forced GREEN. Vehicle ETA: {ambulance_eta_seconds:.0f}s. "
                f"Traffic density: {congestion_level}%."
            )
            congestion_response = (
                f"Redirecting {congestion_level}% congested traffic to alternate routes. "
                f"Emergency lane cleared."
            )
        elif ambulance_distance_km <= handoff_threshold:
            decision = "HANDOFF_SIGNAL"
            priority = 4
            downstream = neighboring_agents[0]["name"] if neighboring_agents else "NEXT_AGENT"
            reasoning = (
                f"Vehicle approaching at {ambulance_distance_km:.2f}km. "
                f"Initiating handoff protocol to {downstream}."
            )
            alert = (
                f"📡 HANDOFF from {agent_name}: Emergency vehicle en route. "
                f"ETA {ambulance_eta_seconds:.0f}s. Prepare green wave protocol. "
                f"Local congestion: {congestion_level}%."
            )
            congestion_response = (
                f"Pre-clearing intersection. Current density {congestion_level}% - "
                f"{'High density detected, early intervention activated.' if congestion_level > 70 else 'Normal density, standard preparation.'}"
            )
        else:
            decision = "NORMAL_CYCLE"
            priority = 1
            reasoning = (
                f"Vehicle at {ambulance_distance_km:.2f}km - outside activation range. "
                f"Maintaining normal signal cycles."
            )
            alert = None
            congestion_response = f"Standard traffic management. Density at {congestion_level}%."
        
        return {
            "decision": decision,
            "reasoning": reasoning,
            "alert_message": alert,
            "congestion_response": congestion_response,
            "priority_level": priority,
            "source": "deterministic-engine"
        }
    
    async def generate_inter_agent_message(
        self,
        sender_agent: str,
        receiver_agent: str,
        context: Dict[str, Any]
    ) -> str:
        """Generate natural language inter-agent communication message."""
        
        if self.use_fallback or not self.gemini_model:
            return self._generate_deterministic_message(sender_agent, receiver_agent, context)
        
        try:
            prompt = f"""You are {sender_agent}, a traffic AI agent. Generate a brief, technical inter-agent communication message to {receiver_agent}.
Context: {json.dumps(context)}
Keep it under 100 characters. Use technical/military style brevity. Include an emoji prefix."""
            
            response = await asyncio.to_thread(
                self.gemini_model.generate_content, prompt
            )
            return response.text.strip()
        except Exception:
            return self._generate_deterministic_message(sender_agent, receiver_agent, context)
    
    def _generate_deterministic_message(
        self,
        sender_agent: str,
        receiver_agent: str,
        context: Dict[str, Any]
    ) -> str:
        """Generate deterministic inter-agent messages."""
        action = context.get("action", "HANDOFF")
        distance = context.get("distance_km", 0)
        congestion = context.get("congestion", 50)
        
        messages = {
            "HANDOFF": f"📡 [{sender_agent}] → [{receiver_agent}]: Handshake initiated. EV at {distance:.1f}km. Prepare green wave.",
            "GREEN_WAVE": f"✅ [{sender_agent}]: EMERGENCY OVERRIDE. Signal forced GREEN. Corridor open. Density: {congestion}%.",
            "ALERT": f"🚦 [{sender_agent}] → [{receiver_agent}]: Heavy density ({congestion}%). Override in progress.",
            "RESET": f"🔄 [{sender_agent}]: Vehicle cleared sector. Resuming normal signal cycles.",
            "ACK": f"📶 [{receiver_agent}]: ACK from {sender_agent}. Green wave protocol armed.",
        }
        
        return messages.get(action, f"📡 [{sender_agent}] → [{receiver_agent}]: Status update.")


# Singleton instance
llm_service = LLMService()
