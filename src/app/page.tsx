"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Shield,
  Bot,
  KeyRound,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Terminal,
  Lock,
  Layers,
  Sparkles,
  Zap,
  Check,
  X,
  FileCode,
  ShieldCheck,
  HelpCircle,
} from "lucide-react";
import { ArchitectureDiagram } from "@/components/ArchitectureDiagram";
import { MpcVisualizer } from "@/components/MpcVisualizer";

export default function LandingPage() {
  const [activeTab, setActiveTab] = useState<"mpc" | "policy" | "aa">("mpc");

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative pt-6 pb-12 overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-500/15 via-blue-600/10 to-indigo-500/15 blur-[120px] rounded-full pointer-events-none -z-10" />

        <div className="text-center max-w-4xl mx-auto space-y-6">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-mono">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Agentic Commerce Security Platform • Prototype MVP</span>
          </div>

          {/* Main Headline */}
          <h1 className="text-4xl sm:text-6xl font-extrabold text-slate-100 tracking-tight leading-[1.15]">
            Give AI permission to <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-blue-500">spend</span>,
            <br />
            not permission to <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-amber-400">steal</span>.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed">
            AgentPay empowers autonomous AI agents to search, compare, and execute financial transactions under strict,
            programmable policy guardrails and <strong className="text-cyan-300 font-semibold">2-of-3 MPC threshold signatures</strong> — without ever exposing your private keys or bank credentials.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <Link
              href="/agent"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(6,182,212,0.4)] hover:shadow-[0_0_35px_rgba(6,182,212,0.6)] hover:scale-[1.02] transition-all"
            >
              <Bot className="w-4 h-4" />
              <span>Launch AI Agent Demo</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="/security"
              className="px-6 py-3 rounded-xl bg-surface/90 border border-surface-border text-slate-200 font-semibold text-sm flex items-center gap-2 hover:border-cyan-500/40 hover:bg-surface-hover transition-all"
            >
              <Shield className="w-4 h-4 text-cyan-400" />
              <span>Explore Security Center</span>
            </Link>

            <Link
              href="/dashboard"
              className="px-5 py-3 rounded-xl bg-slate-900/60 border border-slate-800 text-slate-300 font-medium text-sm hover:text-slate-100 hover:border-slate-700 transition-all"
            >
              <span>View Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Quick Interactive Teaser Box */}
        <div className="mt-12 max-w-4xl mx-auto rounded-2xl bg-surface/80 border border-surface-border p-6 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between border-b border-surface-border pb-4 mb-4">
            <div className="flex items-center gap-2 font-mono text-xs text-slate-300">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Agentic Procurement Scenario (Autonomous Flow)</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span className="text-[11px] font-mono text-slate-400">Policy Shield Active</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="text-slate-400 font-sans font-semibold text-[11px] uppercase tracking-wider text-cyan-400">
                1. User Natural Goal
              </div>
              <p className="text-slate-200">
                "Üniversite için maksimum 30.000 TL bütçeyle laptop bul. En az 16 GB RAM ve 512 GB SSD olsun."
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="text-slate-400 font-sans font-semibold text-[11px] uppercase tracking-wider text-blue-400">
                2. AI Agent Actions
              </div>
              <div className="text-slate-300 space-y-1">
                <div>✓ search_products(ram≥16G)</div>
                <div>✓ compare_products(top: 9.6 score)</div>
                <div>✓ check_policy(budget: ₺28,000)</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
              <div className="text-slate-400 font-sans font-semibold text-[11px] uppercase tracking-wider text-emerald-400">
                3. Security Outcome
              </div>
              <div className="text-slate-300 space-y-1">
                <div className="text-amber-400">⚠️ &gt; ₺1,000 Single Limit</div>
                <div className="text-emerald-400">✓ 2-of-3 Multi-Sig Required</div>
                <div className="text-cyan-300 font-bold">1-Click Passkey Approval</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Technology Pillars */}
      <section className="space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-100">
            Defense-in-Depth for Agentic Commerce
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Five synchronized architectural layers protecting user funds from rogue agents, prompt injections, and accidental overspending.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {/* Card 1: Agentic Commerce */}
          <div className="p-6 rounded-2xl bg-surface/90 border border-surface-border hover:border-cyan-500/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Bot className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Agentic Commerce</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              AI agents interpret user intent, query dynamic merchant catalogs, compare specs, and prepare atomic purchase requests autonomously.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-mono text-cyan-400">
              <span>8 Autonomous Tools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Policy-Based Spending */}
          <div className="p-6 rounded-2xl bg-surface/90 border border-surface-border hover:border-blue-500/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Sliders className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Policy-Based Spending</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Hard programmatic rules executed server-side. Restricts daily velocity, single transaction caps, category whitelists, and approved merchants.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-mono text-blue-400">
              <span>Deterministic Enforcement</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: MPC / Threshold Authorization */}
          <div className="p-6 rounded-2xl bg-surface/90 border border-surface-border hover:border-emerald-500/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <KeyRound className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">MPC / Threshold Authorization</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              2-of-3 threshold signature simulation. Share 1 (AI), Share 2 (Policy Server HSM), Share 3 (User Device). No single party can spend alone.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-mono text-emerald-400">
              <span>Keyless Co-Signing</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Account Abstraction & Emergency Freeze */}
          <div className="p-6 rounded-2xl bg-surface/90 border border-surface-border hover:border-purple-500/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Lock className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Smart Account & Freeze</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Programmable smart custody with 1-click Emergency Freeze. Instant shutdown blocks any pending or new agent transactions globally.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-mono text-purple-400">
              <span>ERC-4337 Guardian Logic</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 5: Dynamic Risk Scoring */}
          <div className="p-6 rounded-2xl bg-surface/90 border border-surface-border hover:border-amber-500/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Dynamic Risk Engine</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              0-100 scoring model evaluating transaction amount deviation, merchant trust index, category safety, and transaction frequency.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-mono text-amber-400">
              <span>Heuristic Risk Scoring</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 6: Immutable Auditability */}
          <div className="p-6 rounded-2xl bg-surface/90 border border-surface-border hover:border-teal-500/40 transition-all space-y-3 group">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/20 text-teal-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <FileCode className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-slate-100">Immutable Audit Ledger</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every tool call, policy evaluation, prompt analysis, and signature share is logged with SHA-256 hash chaining for full auditability.
            </p>
            <div className="pt-2 flex items-center gap-1.5 text-xs font-mono text-teal-400">
              <span>SHA-256 Chain Verification</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Architecture Flow Diagram */}
      <section className="space-y-4">
        <ArchitectureDiagram />
      </section>

      {/* Attack & Defense Showcase Comparison */}
      <section className="rounded-2xl bg-surface/90 border border-surface-border p-6 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-surface-border pb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              Traditional Autonomous Agent vs AgentPay Security Model
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Why giving AI raw credentials or unbounded private keys is a catastrophic security risk.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-surface-border text-slate-400">
                <th className="py-3 px-4">Threat / Scenario</th>
                <th className="py-3 px-4 text-rose-400">Traditional AI Setup (Vulnerable)</th>
                <th className="py-3 px-4 text-cyan-300">AgentPay Protected Architecture</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60 text-slate-300">
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-200">
                  Prompt Injection / Jailbreak
                </td>
                <td className="py-3.5 px-4 text-rose-400">
                  <span className="flex items-center gap-1.5">
                    <X className="w-4 h-4 shrink-0" />
                    Agent is tricked into draining whole wallet to hacker address.
                  </span>
                </td>
                <td className="py-3.5 px-4 text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                    Policy Server HSM refuses Share 2/3. Transaction is mathematically blocked.
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-200">
                  Accidental Overdraft / Infinite Loops
                </td>
                <td className="py-3.5 px-4 text-rose-400">
                  <span className="flex items-center gap-1.5">
                    <X className="w-4 h-4 shrink-0" />
                    Repeated API calls drain user bank balance with no daily limit.
                  </span>
                </td>
                <td className="py-3.5 px-4 text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                    Daily spending cap (e.g. ₺2,500) strictly enforced at database/policy layer.
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-200">
                  Phishing / Untrusted Merchant
                </td>
                <td className="py-3.5 px-4 text-rose-400">
                  <span className="flex items-center gap-1.5">
                    <X className="w-4 h-4 shrink-0" />
                    AI purchases from scam site with no merchant reputation check.
                  </span>
                </td>
                <td className="py-3.5 px-4 text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                    Whitelist verification & Category filters immediately reject blacklisted merchants.
                  </span>
                </td>
              </tr>
              <tr>
                <td className="py-3.5 px-4 font-semibold text-slate-200">
                  High-Value Purchases
                </td>
                <td className="py-3.5 px-4 text-rose-400">
                  <span className="flex items-center gap-1.5">
                    <X className="w-4 h-4 shrink-0" />
                    Full funds sent without human in the loop.
                  </span>
                </td>
                <td className="py-3.5 px-4 text-emerald-300">
                  <span className="flex items-center gap-1.5">
                    <Check className="w-4 h-4 shrink-0 text-emerald-400" />
                    Automatically escalates to User Passkey share (2-of-3 threshold confirmation).
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* CTA Footer banner */}
      <section className="rounded-2xl bg-gradient-to-r from-cyan-950/40 via-blue-950/30 to-indigo-950/40 border border-cyan-500/30 p-8 text-center space-y-4">
        <h3 className="text-xl sm:text-2xl font-bold text-slate-100">
          Ready to experience autonomous agent commerce safely?
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Try the interactive chat, test limit violations, explore live approvals, or trigger an emergency freeze in the sandbox.
        </p>
        <div className="pt-2">
          <Link
            href="/agent"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-cyan-500 text-slate-950 font-bold text-sm hover:bg-cyan-400 transition-colors shadow-[0_0_20px_rgba(6,182,212,0.4)]"
          >
            <Bot className="w-4 h-4" />
            <span>Start Interactive AI Demo</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
