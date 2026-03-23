"use client";

import {
  Scale,
  Plane,
  TrendingUp,
  Handshake,
  GitBranch,
  Network,
  ExternalLink,
  Lock,
} from "lucide-react";
import { useState } from "react";

import type { LucideProps } from "lucide-react";

const ICON_MAP: Record<string, React.ComponentType<LucideProps>> = {
  Scale,
  Plane,
  TrendingUp,
  Handshake,
  GitBranch,
  Network,
};

interface ToolCardProps {
  tool: {
    id: string;
    name: string;
    slug: string;
    url: string;
    description: string | null;
    iconPath: string | null;
    authMethod: string;
    isActive: boolean;
  };
}

export default function ToolCard({ tool }: ToolCardProps) {
  const [launching, setLaunching] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Map tool slugs to icons and colors
  const iconConfig: Record<string, { icon: string; color: string }> = {
    "ahp-studio": { icon: "Scale", color: "#57068C" },
    "airlines-sim": { icon: "Plane", color: "#0369A1" },
    "dynamic-pricing": { icon: "TrendingUp", color: "#059669" },
    "negotiation-sim": { icon: "Handshake", color: "#D97706" },
    "scenario-sim": { icon: "GitBranch", color: "#DC2626" },
    "decision-trees": { icon: "Network", color: "#7C3AED" },
  };

  const config = iconConfig[tool.slug] || { icon: "Scale", color: "#57068C" };
  const IconComponent = ICON_MAP[config.icon] || Scale;
  const isAvailable = tool.isActive && tool.url && tool.url.length > 0;

  const handleLaunch = async () => {
    if (!isAvailable || launching) return;
    setLaunching(true);
    setError(null);

    try {
      const res = await fetch(`/api/tools/${tool.id}/launch`, {
        method: "POST",
      });

      if (!res.ok) {
        throw new Error(`Launch failed (${res.status})`);
      }

      const data = await res.json();
      window.open(data.launchUrl, "_blank", "noopener,noreferrer");
    } catch (err) {
      console.error("Launch error:", err);
      setError("Failed to launch. Try again.");
    } finally {
      setLaunching(false);
    }
  };

  return (
    <button
      onClick={handleLaunch}
      disabled={!isAvailable || launching}
      className={`group relative flex flex-col items-center p-6 rounded-xl border-2 transition-all duration-200 text-left w-full ${
        isAvailable
          ? "border-nyu-border bg-white hover:border-nyu-violet hover:shadow-lg hover:-translate-y-1 cursor-pointer"
          : "border-gray-200 bg-gray-50 cursor-not-allowed opacity-60"
      }`}
    >
      {/* Icon */}
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110"
        style={{ backgroundColor: `${config.color}15` }}
      >
        <IconComponent
          className="w-10 h-10"
          color={config.color}
        />
      </div>

      {/* Name */}
      <h3 className="text-base font-bold text-nyu-black mb-1 text-center">
        {tool.name}
      </h3>

      {/* Description */}
      <p className="text-sm text-nyu-gray text-center leading-relaxed">
        {tool.description}
      </p>

      {/* Status indicator */}
      {isAvailable ? (
        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-nyu-violet opacity-0 group-hover:opacity-100 transition-opacity">
          <ExternalLink className="h-3 w-3" />
          Launch Tool
        </div>
      ) : (
        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-gray-400">
          <Lock className="h-3 w-3" />
          Coming Soon
        </div>
      )}

      {/* Loading overlay */}
      {launching && (
        <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-nyu-violet border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* Error message */}
      {error && (
        <div className="mt-2 text-xs text-red-600 font-medium">{error}</div>
      )}
    </button>
  );
}
