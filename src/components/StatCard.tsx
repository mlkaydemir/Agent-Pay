import React from "react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: {
    text: string;
    isPositive?: boolean;
    isWarning?: boolean;
  };
  accentColor?: "cyan" | "blue" | "emerald" | "amber" | "rose" | "purple";
  badge?: string;
}

export function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  accentColor = "cyan",
  badge,
}: StatCardProps) {
  const colorGradients = {
    cyan: "hover:border-cyan-500/40 hover:shadow-[0_0_25px_-5px_rgba(6,182,212,0.2)]",
    blue: "hover:border-blue-500/40 hover:shadow-[0_0_25px_-5px_rgba(59,130,246,0.2)]",
    emerald: "hover:border-emerald-500/40 hover:shadow-[0_0_25px_-5px_rgba(16,185,129,0.2)]",
    amber: "hover:border-amber-500/40 hover:shadow-[0_0_25px_-5px_rgba(245,158,11,0.2)]",
    rose: "hover:border-rose-500/40 hover:shadow-[0_0_25px_-5px_rgba(244,63,94,0.2)]",
    purple: "hover:border-purple-500/40 hover:shadow-[0_0_25px_-5px_rgba(168,85,247,0.2)]",
  };

  const iconBgs = {
    cyan: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    emerald: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    rose: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
  };

  return (
    <div
      className={cn(
        "rounded-xl bg-surface/90 border border-surface-border p-5 transition-all duration-300 relative overflow-hidden group",
        colorGradients[accentColor]
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={cn("p-2 rounded-lg border transition-transform duration-300 group-hover:scale-110", iconBgs[accentColor])}>
          {icon}
        </div>
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <div className="text-2xl font-bold text-slate-100 font-mono tracking-tight">{value}</div>
        {badge && (
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700">
            {badge}
          </span>
        )}
      </div>

      {(subtitle || trend) && (
        <div className="mt-2.5 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-400">{subtitle}</span>}
          {trend && (
            <span
              className={cn(
                "font-mono text-[11px] font-medium",
                trend.isPositive
                  ? "text-emerald-400"
                  : trend.isWarning
                  ? "text-amber-400"
                  : "text-slate-400"
              )}
            >
              {trend.text}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
