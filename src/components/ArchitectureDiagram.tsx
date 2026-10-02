import React, { useState } from "react";
import {
  User,
  Bot,
  ShieldCheck,
  Activity,
  Wallet,
  KeyRound,
  Layers,
  Store,
  ArrowDown,
  ArrowRight,
  Info,
} from "lucide-react";
import { cn } from "@/lib/utils";

export function ArchitectureDiagram() {
  const [selectedNode, setSelectedNode] = useState<string>("policy");

  const nodes = [
    {
      id: "user",
      name: "1. User Intent",
      icon: <User className="w-5 h-5 text-cyan-400" />,
      color: "border-cyan-500/40 bg-cyan-950/20 text-cyan-300",
      description: "User gives natural language goal (e.g., 'Find laptop under 30k TL') without handing over private keys or bank credentials.",
      securityRole: "Zero-Trust Initiator",
    },
    {
      id: "agent",
      name: "2. AI Agent",
      icon: <Bot className="w-5 h-5 text-blue-400" />,
      color: "border-blue-500/40 bg-blue-950/20 text-blue-300",
      description: "Searches catalog, compares specifications, and prepares a payment intent. Possesses only Share 1 of 3.",
      securityRole: "Autonomous Buyer (Scoped)",
    },
    {
      id: "policy",
      name: "3. Policy Engine",
      icon: <ShieldCheck className="w-5 h-5 text-emerald-400" />,
      color: "border-emerald-500/40 bg-emerald-950/20 text-emerald-300",
      description: "Independent backend gatekeeper. Checks single limits, daily/monthly budgets, merchant whitelist, and category blacklist.",
      securityRole: "Hard Rule Enforcer",
    },
    {
      id: "risk",
      name: "4. Risk Engine",
      icon: <Activity className="w-5 h-5 text-amber-400" />,
      color: "border-amber-500/40 bg-amber-950/20 text-amber-300",
      description: "Calculates real-time risk scores (0-100) considering velocity, merchant trust rating, and monetary deviation.",
      securityRole: "Heuristic Anomaly Detector",
    },
    {
      id: "smart_account",
      name: "5. Smart Account (AA)",
      icon: <Wallet className="w-5 h-5 text-purple-400" />,
      color: "border-purple-500/40 bg-purple-950/20 text-purple-300",
      description: "Account Abstraction contract. Houses emergency freeze switches, session keys, and guardian multi-sig thresholds.",
      securityRole: "Programmable Custody",
    },
    {
      id: "mpc",
      name: "6. MPC Threshold Signer",
      icon: <KeyRound className="w-5 h-5 text-indigo-400" />,
      color: "border-indigo-500/40 bg-indigo-950/20 text-indigo-300",
      description: "2-of-3 Threshold Signature Scheme (TSS). Combines AI Intent Share + Policy HSM Share + User Passkey Share.",
      securityRole: "Keyless Cryptographic Quorum",
    },
    {
      id: "settlement",
      name: "7. Mock Blockchain L2",
      icon: <Layers className="w-5 h-5 text-teal-400" />,
      color: "border-teal-500/40 bg-teal-950/20 text-teal-300",
      description: "Simulated Rollup layer verifying aggregate signature before finalizing balance transfer.",
      securityRole: "Immutable Ledger",
    },
    {
      id: "merchant",
      name: "8. Merchant Fulfillment",
      icon: <Store className="w-5 h-5 text-rose-400" />,
      color: "border-rose-500/40 bg-rose-950/20 text-rose-300",
      description: "Whitelisted merchant receives verified payment settlement and dispatches goods/services.",
      securityRole: "Verified Payee",
    },
  ];

  const activeNodeData = nodes.find((n) => n.id === selectedNode) || nodes[2];

  return (
    <div className="rounded-2xl bg-surface/80 border border-surface-border p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border/80 pb-4">
        <div>
          <h3 className="text-base font-bold text-slate-100 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
            AgentPay Zero-Trust Architecture Pipeline
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Click any node in the security chain to inspect its isolation and role.
          </p>
        </div>
        <span className="text-[11px] font-mono px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
          8-Step Defensive Pipeline
        </span>
      </div>

      {/* Grid Architecture Flow */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {nodes.map((node, index) => {
          const isSelected = selectedNode === node.id;
          return (
            <button
              key={node.id}
              onClick={() => setSelectedNode(node.id)}
              className={cn(
                "p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between",
                node.color,
                isSelected
                  ? "ring-2 ring-cyan-400/80 shadow-[0_0_20px_rgba(6,182,212,0.25)] scale-[1.02]"
                  : "hover:border-slate-600 opacity-80 hover:opacity-100"
              )}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="p-1.5 rounded-lg bg-slate-950/60 border border-slate-800">
                  {node.icon}
                </div>
                <span className="text-[10px] font-mono font-bold text-slate-400">
                  Step 0{index + 1}
                </span>
              </div>
              <div>
                <div className="text-xs font-bold text-slate-100">{node.name}</div>
                <div className="text-[10px] font-mono text-slate-400 truncate mt-0.5">
                  {node.securityRole}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {/* Inspector Details Box */}
      <div className="bg-slate-950/80 rounded-xl border border-slate-800 p-4.5 space-y-2 relative overflow-hidden">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
              {activeNodeData.icon}
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-100">{activeNodeData.name}</h4>
              <span className="text-[11px] font-mono text-cyan-400">{activeNodeData.securityRole}</span>
            </div>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
            Selected Node Inspector
          </span>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed pt-1">
          {activeNodeData.description}
        </p>
      </div>
    </div>
  );
}
