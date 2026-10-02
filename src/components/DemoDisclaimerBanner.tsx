import React from "react";
import { ShieldAlert, Info } from "lucide-react";

export function DemoDisclaimerBanner() {
  return (
    <div className="bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-indigo-950/40 border-b border-cyan-800/30 px-4 py-2 text-xs text-cyan-200/90 flex items-center justify-between backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[11px] font-semibold border border-cyan-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse"></span>
            Simulation / Demo Environment
          </span>
          <span className="hidden sm:inline text-slate-300">
            AgentPay is an educational fintech & security prototype. The MPC signatures and wallet layers are simulated.
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono text-[11px] text-cyan-400">
          <Info className="w-3.5 h-3.5 text-cyan-400" />
          <span>No Real Funds / No Private Keys Exposed</span>
        </div>
      </div>
    </div>
  );
}
