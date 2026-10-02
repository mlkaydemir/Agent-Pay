"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Shield,
  ShieldCheck,
  ShieldAlert,
  Key,
  Lock,
  Cpu,
  Smartphone,
  Server,
  Zap,
  Play,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Terminal,
  Layers,
  ArrowRight,
} from "lucide-react";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { MpcVisualizer } from "@/components/MpcVisualizer";
import { StatCard } from "@/components/StatCard";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function SecurityCenterPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Attack simulator state
  const [selectedScenario, setSelectedScenario] = useState<string>("INJECTION");
  const [simulating, setSimulating] = useState(false);
  const [simulationResult, setSimulationResult] = useState<any>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/security/stats");
      if (res.ok) {
        const data = await res.json();
        setStats(data);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleSimulateAttack = async (scenarioKey: string) => {
    try {
      setSelectedScenario(scenarioKey);
      setSimulating(true);
      setSimulationResult(null);

      const res = await fetch("/api/security/simulate-attack", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenario: scenarioKey }),
      });

      if (res.ok) {
        const data = await res.json();
        setSimulationResult(data);
        await fetchStats();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSimulating(false);
    }
  };

  const attackScenarios = [
    {
      id: "INJECTION",
      title: "Prompt Injection Attack",
      desc: "Adversary prompts AI to exfiltrate private key or drain ₺8,500 to attacker wallet.",
      threat: "Key Exfiltration & Unauthorized Transfer",
    },
    {
      id: "LIMIT_BREACH",
      title: "Daily Spending Overdraft",
      desc: "AI attempts to purchase ₺6,000 product, violating ₺2,500 daily budget cap.",
      threat: "Financial Overdraft & Velocity Abuse",
    },
    {
      id: "ROGUE_MERCHANT",
      title: "Blacklisted Gambling Domain",
      desc: "Attempted transaction on 'DarkShop Demo' in blocked 'Gambling' category.",
      threat: "Phishing & Illicit Commerce",
    },
    {
      id: "FREEZE_BYPASS",
      title: "Emergency Freeze Bypass",
      desc: "Agent attempts a small ₺350 transaction while account is frozen.",
      threat: "Guardian Lockdown Violation",
    },
  ];

  return (
    <div className="space-y-10 max-w-6xl mx-auto">
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface/90 border border-surface-border rounded-2xl p-6 relative overflow-hidden">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60 font-semibold">
              Zero-Trust Financial Architecture
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <ShieldAlert className="w-6 h-6 text-cyan-400" />
            Security Center & Cryptographic Model
          </h1>
          <p className="text-xs text-slate-400">
            How AgentPay protects user capital through Private Key Isolation, 2-of-3 MPC Quorums, and Account Abstraction.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="px-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-center">
            <div className="text-[10px] font-mono text-slate-400">Live Security Health</div>
            <div className="text-lg font-bold font-mono text-emerald-400">
              {stats?.securityScore || 98}/100
            </div>
          </div>
        </div>
      </div>

      {/* 4 Quick Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Security Rating"
          value={`${stats?.securityScore || 98} / 100`}
          subtitle="Zero Key Exposure"
          icon={<ShieldCheck className="w-5 h-5" />}
          accentColor="emerald"
          badge="Guarded"
        />

        <StatCard
          title="Blocked Threats"
          value={stats?.blockedTransactions || 1}
          subtitle="Vetoed by Policy Shield"
          icon={<ShieldAlert className="w-5 h-5" />}
          accentColor="rose"
          badge="Protected"
        />

        <StatCard
          title="MPC Threshold"
          value="2-of-3"
          subtitle="AI + HSM + User"
          icon={<Key className="w-5 h-5" />}
          accentColor="cyan"
          badge="TSS Protocol"
        />

        <StatCard
          title="Smart Account"
          value={stats?.wallet?.isFrozen ? "FROZEN" : "ACTIVE"}
          subtitle="ERC-4337 Sim"
          icon={<Lock className="w-5 h-5" />}
          accentColor={stats?.wallet?.isFrozen ? "rose" : "purple"}
          badge="Guardian"
        />
      </div>

      {/* Core Principle 1: Private Key Protection */}
      <div className="bg-surface/90 border border-surface-border rounded-2xl p-6 space-y-6">
        <div className="flex items-center gap-3 border-b border-surface-border pb-4">
          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-100">
              1. Private Key Protection & Keyless Isolation
            </h2>
            <p className="text-xs text-slate-400">
              "AI agents never receive the user's full private key or banking credentials."
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h3 className="font-bold text-cyan-300 font-mono flex items-center gap-1.5">
              <Cpu className="w-4 h-4" /> Share 1: AI Agent
            </h3>
            <p className="text-slate-300 leading-relaxed text-xs">
              The AI agent only receives an ephemeral intent share (s₁). Even if an attacker uses prompt injection to extract this share, it is mathematically impossible to move funds with a single share alone.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h3 className="font-bold text-blue-300 font-mono flex items-center gap-1.5">
              <Server className="w-4 h-4" /> Share 2: Policy Server HSM
            </h3>
            <p className="text-slate-300 leading-relaxed text-xs">
              Held in an isolated Hardware Security Module (HSM). The Policy Server only signs share (s₂) if the transaction strictly matches user-defined limits, merchant whitelists, and category rules.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-2">
            <h3 className="font-bold text-emerald-300 font-mono flex items-center gap-1.5">
              <Smartphone className="w-4 h-4" /> Share 3: User Passkey
            </h3>
            <p className="text-slate-300 leading-relaxed text-xs">
              Stored securely in the user's phone or browser Secure Enclave (WebAuthn). Triggered automatically when transaction value exceeds the autonomous approval threshold (e.g. ₺500).
            </p>
          </div>
        </div>
      </div>

      {/* Interactive 2-of-3 MPC Quorum Visualizer */}
      <div className="space-y-3">
        <MpcVisualizer
          shares={{
            aiShare: true,
            policyShare: true,
            userShare: false,
            threshold: 2,
            total: 3,
            status: "2_OF_3_SIGNED",
            signers: ["AI_AGENT", "POLICY_ENGINE"],
          }}
        />
      </div>

      {/* Interactive Attack & Defense Testing Sandbox */}
      <div className="bg-surface/90 border border-surface-border rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-surface-border pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Live Attack & Defense Simulator
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Execute live security test scenarios against the Policy Engine and observe cryptographic interception.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
            Interactive Test Suite
          </span>
        </div>

        {/* Scenario Select Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {attackScenarios.map((sc) => (
            <button
              key={sc.id}
              onClick={() => handleSimulateAttack(sc.id)}
              disabled={simulating}
              className={`p-3.5 rounded-xl border text-left transition-all relative space-y-1.5 group ${
                selectedScenario === sc.id
                  ? "bg-amber-500/10 border-amber-500/50 shadow-[0_0_20px_rgba(245,158,11,0.15)]"
                  : "bg-slate-950/60 border-slate-800 hover:border-slate-700"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-100 group-hover:text-amber-300 transition-colors">
                  {sc.title}
                </span>
                <Play className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              </div>
              <p className="text-[11px] text-slate-400 leading-tight">
                {sc.desc}
              </p>
            </button>
          ))}
        </div>

        {/* Simulation Output Terminal */}
        {simulationResult && (
          <div className="rounded-xl bg-slate-950 border border-slate-800 p-5 space-y-4 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-cyan-400" />
                <span className="font-bold text-slate-200">
                  Simulation Log: {simulationResult.scenarioName}
                </span>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded text-[11px] font-bold ${
                  simulationResult.defended
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                    : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                }`}
              >
                {simulationResult.defended ? "DEFENSE SUCCESSFUL" : "ESCALATED TO MULTI-SIG"}
              </span>
            </div>

            <div className="space-y-2 text-slate-300">
              <div className="text-slate-400">
                Target: {simulationResult.merchant} • Amount: {formatCurrency(simulationResult.amount)} • Category: {simulationResult.category}
              </div>

              <div className="p-3 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
                <div className="font-bold text-slate-100 mb-1">Defense Interception Verdict:</div>
                <div className="text-emerald-300">{simulationResult.verdict}</div>
              </div>

              <div className="text-[11px] space-y-1 pt-1 text-slate-400">
                <div>• Policy Status: {simulationResult.policyResult?.status}</div>
                <div>• Risk Score Evaluated: {simulationResult.riskResult?.score}/100 ({simulationResult.riskResult?.level})</div>
                <div>• MPC Quorum Status: {simulationResult.mpcResult?.state?.status}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Architecture Pipeline Diagram */}
      <section className="space-y-4">
        <ArchitectureDiagram />
      </section>
    </div>
  );
}
