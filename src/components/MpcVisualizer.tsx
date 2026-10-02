import React from "react";
import { Cpu, ShieldCheck, Smartphone, Check, X, Clock, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import { MpcShareState } from "@/lib/types";

interface MpcVisualizerProps {
  shares?: MpcShareState | null;
  interactive?: boolean;
}

export function MpcVisualizer({ shares }: MpcVisualizerProps) {
  const ai = shares?.aiShare ?? true;
  const policy = shares?.policyShare ?? true;
  const user = shares?.userShare ?? false;

  const totalGranted = [ai, policy, user].filter(Boolean).length;
  const threshold = 2;
  const isQuorumReached = totalGranted >= threshold && policy;

  return (
    <div className="rounded-xl bg-slate-900/80 border border-slate-800 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Key className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-100 flex items-center gap-2">
              MPC 2-of-3 Threshold Authorization
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
                TSS Protocol
              </span>
            </h4>
            <p className="text-xs text-slate-400">
              Private key never exists in a single location. Split into cryptographic shares.
            </p>
          </div>
        </div>

        <div className="text-right">
          <span
            className={cn(
              "text-xs font-mono px-2.5 py-1 rounded-full border font-medium",
              isQuorumReached
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                : !policy
                ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                : "bg-amber-500/10 text-amber-400 border-amber-500/30"
            )}
          >
            {totalGranted} of 3 Shares Collected
          </span>
        </div>
      </div>

      {/* 3 Share Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Share 1: AI Agent */}
        <div
          className={cn(
            "p-3.5 rounded-lg border transition-all relative overflow-hidden",
            ai
              ? "bg-cyan-950/30 border-cyan-500/30 text-cyan-200"
              : "bg-slate-900/40 border-slate-800 text-slate-500"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Cpu className="w-4 h-4 text-cyan-400" />
              <span className="text-xs font-bold text-slate-200">Share 1: AI Agent</span>
            </div>
            {ai ? (
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <Check className="w-3.5 h-3.5" /> Signed
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-mono text-slate-500">
                <Clock className="w-3.5 h-3.5" /> Pending
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            Ephemeral Intent Share generated upon procurement analysis.
          </p>
          <div className="mt-2 text-[10px] font-mono text-slate-400 truncate">
            Proof: <span className="text-cyan-400">{ai ? "s₁_valid (Schnorr)" : "not_signed"}</span>
          </div>
        </div>

        {/* Share 2: Policy Server */}
        <div
          className={cn(
            "p-3.5 rounded-lg border transition-all relative overflow-hidden",
            policy
              ? "bg-blue-950/30 border-blue-500/30 text-blue-200"
              : "bg-rose-950/30 border-rose-500/40 text-rose-300"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-bold text-slate-200">Share 2: Policy HSM</span>
            </div>
            {policy ? (
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <Check className="w-3.5 h-3.5" /> Co-Signed
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-mono text-rose-400">
                <X className="w-3.5 h-3.5" /> Vetoed
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            Hardware Enclave validates limits, categories & whitelist rules.
          </p>
          <div className="mt-2 text-[10px] font-mono text-slate-400 truncate">
            Proof: <span className="text-blue-400">{policy ? "s₂_policy_enforced" : "VETO_RULES_FAILED"}</span>
          </div>
        </div>

        {/* Share 3: User Device */}
        <div
          className={cn(
            "p-3.5 rounded-lg border transition-all relative overflow-hidden",
            user
              ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-200"
              : "bg-slate-900/40 border-slate-800 text-slate-400"
          )}
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Smartphone className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-slate-200">Share 3: User Passkey</span>
            </div>
            {user ? (
              <span className="flex items-center gap-1 text-[11px] font-mono text-emerald-400">
                <Check className="w-3.5 h-3.5" /> Confirmed
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[11px] font-mono text-amber-400">
                <Clock className="w-3.5 h-3.5" /> Conditional
              </span>
            )}
          </div>
          <p className="text-[11px] text-slate-400">
            WebAuthn / Biometric co-signature on user smartphone or browser.
          </p>
          <div className="mt-2 text-[10px] font-mono text-slate-400 truncate">
            Proof: <span className="text-emerald-400">{user ? "s₃_user_webauthn" : "threshold_optional"}</span>
          </div>
        </div>
      </div>

      {/* Threshold Status Banner */}
      <div
        className={cn(
          "p-3 rounded-lg border text-xs font-mono flex items-center justify-between",
          isQuorumReached
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-300"
            : !policy
            ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
            : "bg-amber-500/10 border-amber-500/30 text-amber-300"
        )}
      >
        <span className="flex items-center gap-2">
          {isQuorumReached ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>Quorum Satisfied ({totalGranted}/3): Transaction aggregate signature valid.</span>
            </>
          ) : !policy ? (
            <>
              <X className="w-4 h-4 text-rose-400" />
              <span>Policy Server Veto: Transaction cannot be signed under any circumstance.</span>
            </>
          ) : (
            <>
              <Clock className="w-4 h-4 text-amber-400" />
              <span>Awaiting User Share: High value or unlisted merchant requires 3rd share.</span>
            </>
          )}
        </span>
        <span className="text-[10px] opacity-80 uppercase">Simulated MPC</span>
      </div>
    </div>
  );
}
