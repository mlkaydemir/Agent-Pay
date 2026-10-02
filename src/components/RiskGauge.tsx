import React from "react";
import { ShieldCheck, ShieldAlert, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

interface RiskGaugeProps {
  score: number; // 0-100
  showDetails?: boolean;
  factors?: {
    amountRisk?: number;
    merchantRisk?: number;
    categoryRisk?: number;
    velocityRisk?: number;
  };
}

export function RiskGauge({ score, showDetails = false, factors }: RiskGaugeProps) {
  let color = "emerald";
  let label = "Low Risk";
  let textClass = "text-emerald-400";
  let bgClass = "bg-emerald-500/10 border-emerald-500/30";
  let icon = <ShieldCheck className="w-4 h-4 text-emerald-400" />;

  if (score >= 71) {
    color = "rose";
    label = "High Risk";
    textClass = "text-rose-400";
    bgClass = "bg-rose-500/10 border-rose-500/30";
    icon = <ShieldAlert className="w-4 h-4 text-rose-400" />;
  } else if (score >= 31) {
    color = "amber";
    label = "Medium Risk";
    textClass = "text-amber-400";
    bgClass = "bg-amber-500/10 border-amber-500/30";
    icon = <AlertTriangle className="w-4 h-4 text-amber-400" />;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          {icon}
          <span className={cn("text-xs font-semibold uppercase tracking-wider", textClass)}>
            {label} ({score}/100)
          </span>
        </div>
        <span className="text-[11px] font-mono text-slate-400">Security Score Matrix</span>
      </div>

      {/* Progress Bar Gauge */}
      <div className="w-full bg-slate-900/90 rounded-full h-2.5 p-0.5 border border-slate-800 overflow-hidden relative">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-700 ease-out",
            score >= 71
              ? "bg-gradient-to-r from-amber-500 to-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]"
              : score >= 31
              ? "bg-gradient-to-r from-emerald-500 to-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
              : "bg-gradient-to-r from-cyan-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
          )}
          style={{ width: `${Math.max(5, Math.min(100, score))}%` }}
        />
      </div>

      {showDetails && factors && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-800/80 text-[11px] text-slate-400">
          <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
            <div className="text-slate-500 font-mono">Amount Risk</div>
            <div className="font-semibold text-slate-200 mt-0.5">{factors.amountRisk ?? 0} pts</div>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
            <div className="text-slate-500 font-mono">Merchant Risk</div>
            <div className="font-semibold text-slate-200 mt-0.5">{factors.merchantRisk ?? 0} pts</div>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
            <div className="text-slate-500 font-mono">Category Risk</div>
            <div className="font-semibold text-slate-200 mt-0.5">{factors.categoryRisk ?? 0} pts</div>
          </div>
          <div className="bg-slate-900/60 p-2 rounded-lg border border-slate-800">
            <div className="text-slate-500 font-mono">Velocity Risk</div>
            <div className="font-semibold text-slate-200 mt-0.5">{factors.velocityRisk ?? 0} pts</div>
          </div>
        </div>
      )}
    </div>
  );
}
