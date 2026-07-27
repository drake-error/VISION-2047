import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "ResQ-Pulse | Multi-Agent AI Smart Emergency Corridor",
  description:
    "Real-time multi-agent AI system that dynamically clears traffic signals ahead of emergency vehicles across Karnataka, India. Featuring 300+ traffic signals, LLM-powered AI agents, and live telemetry visualization.",
  keywords: [
    "emergency corridor",
    "AI traffic management",
    "multi-agent system",
    "Karnataka",
    "Bangalore",
    "Belagavi",
    "smart city",
    "ambulance routing",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased bg-[#0B0F19] text-slate-100`}
      >
        {children}
      </body>
    </html>
  );
}
