"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  CheckSquare,
  Check,
  X,
  Clock,
  ShieldCheck,
  ShieldAlert,
  Store,
  Key,
  ExternalLink,
  AlertTriangle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { MpcVisualizer } from "@/components/MpcVisualizer";
import { formatCurrency, formatDate } from "@/lib/utils";

export default function ApprovalsPage() {
  const [approvals, setApprovals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"PENDING" | "HISTORY">("PENDING");
  const [resolvingId, setResolvingId] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);

  const fetchApprovals = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/approvals");
      if (res.ok) {
        const data = await res.json();
        setApprovals(data.approvals || []);
      }
    } catch (e) {
      console.error("Fetch approvals error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovals();
  }, []);

  const handleResolve = async (id: string, action: "APPROVE" | "REJECT") => {
    try {
      setResolvingId(id);
      const res = await fetch(`/api/approvals/${id}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, notes: action === "APPROVE" ? "Approved by Melike Demo" : "Declined by user" }),
      });

      if (res.ok) {
        const data = await res.json();
        setSuccessBanner(data.message || (action === "APPROVE" ? "İşlem başarıyla onaylandı!" : "İşlem reddedildi."));
        setTimeout(() => setSuccessBanner(null), 5000);
        await fetchApprovals();
      } else {
        const err = await res.json().catch(() => ({}));
        alert(err.error || "İşlem çözümlenirken hata oluştu.");
      }
    } catch (e: any) {
      console.error(e);
      alert(e.message || "Bağlantı hatası");
    } finally {
      setResolvingId(null);
    }
  };

  const pendingApprovals = approvals.filter((a) => a.status === "PENDING");
  const historyApprovals = approvals.filter((a) => a.status !== "PENDING");

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface/90 border border-surface-border rounded-2xl p-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <CheckSquare className="w-5 h-5 text-amber-400" />
            <span>Multi-Sig Payment Approvals Queue</span>
            {pendingApprovals.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-mono">
                {pendingApprovals.length} Pending
              </span>
            )}
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Transactions exceeding autonomous spending limits require your 3rd Passkey share to assemble 2-of-3 MPC quorum.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={fetchApprovals}
            className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Success Notification Banner */}
      {successBanner && (
        <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)] animate-fadeIn">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold">{successBanner}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-surface-border pb-2">
        <button
          onClick={() => setActiveTab("PENDING")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "PENDING"
              ? "bg-amber-500/15 border border-amber-500/40 text-amber-300 shadow-[0_0_15px_rgba(245,158,11,0.15)]"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
          }`}
        >
          <span>Pending Approvals ({pendingApprovals.length})</span>
        </button>

        <button
          onClick={() => setActiveTab("HISTORY")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeTab === "HISTORY"
              ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
              : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40"
          }`}
        >
          <span>Resolved History ({historyApprovals.length})</span>
        </button>
      </div>

      {/* Approvals List */}
      {activeTab === "PENDING" ? (
        <div className="space-y-4">
          {pendingApprovals.length === 0 ? (
            <div className="rounded-2xl bg-surface/80 border border-surface-border p-12 text-center space-y-3">
              <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto" />
              <h3 className="text-base font-bold text-slate-100">No Pending Approvals</h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto">
                All AI agent transactions have either been authorized autonomously within daily limits or previously resolved.
              </p>
              <Link
                href="/agent"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-cyan-500 text-slate-950 font-bold text-xs hover:bg-cyan-400 mt-2"
              >
                <span>Ask AI Agent to procure a laptop &gt; ₺1,000</span>
              </Link>
            </div>
          ) : (
            pendingApprovals.map((app) => {
              const tx = app.transaction;
              const policyEval = tx?.policyEvaluation;

              return (
                <div
                  key={app.id}
                  className="rounded-2xl bg-surface/90 border border-amber-500/30 p-6 space-y-6 shadow-[0_0_25px_rgba(245,158,11,0.08)] relative overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 border-b border-surface-border pb-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                          Awaiting User Share (3/3)
                        </span>
                        <span className="text-xs font-mono text-slate-400">
                          {formatDate(app.requestedAt)}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                        <Store className="w-4 h-4 text-cyan-400" />
                        <span>{tx.merchantName}</span>
                        <span className="text-slate-400 font-normal">— {tx.description}</span>
                      </h3>
                    </div>

                    <div className="text-right">
                      <div className="text-2xl font-bold font-mono text-slate-100">
                        {formatCurrency(tx.amount)}
                      </div>
                      <span className="text-xs font-mono text-slate-400">{tx.category}</span>
                    </div>
                  </div>

                  {/* Policy Evaluation Matrix */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-2">
                      <h4 className="font-bold text-slate-200 flex items-center gap-1.5 font-mono">
                        <ShieldCheck className="w-4 h-4 text-cyan-400" />
                        Policy Rules Breakdown
                      </h4>
                      <ul className="space-y-1.5 text-slate-300 font-mono text-[11px]">
                        <li className="flex items-center justify-between">
                          <span>Single Auto-Limit (₺1,000):</span>
                          <span className="text-rose-400 font-semibold">❌ Exceeded</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Merchant Reputation:</span>
                          <span className="text-emerald-400 font-semibold">✓ Trusted (98/100)</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Category Whitelist:</span>
                          <span className="text-emerald-400 font-semibold">✓ Allowed ({tx.category})</span>
                        </li>
                        <li className="flex items-center justify-between">
                          <span>Multi-Sig Co-Signature:</span>
                          <span className="text-amber-400 font-semibold">Required</span>
                        </li>
                      </ul>
                    </div>

                    <div className="bg-slate-950/60 rounded-xl p-4 border border-slate-800 space-y-2">
                      <h4 className="font-bold text-slate-200 flex items-center gap-1.5 font-mono">
                        <Key className="w-4 h-4 text-amber-400" />
                        AI Agent Context & Reason
                      </h4>
                      <p className="text-slate-300 leading-relaxed text-xs">
                        "{app.reason}"
                      </p>
                    </div>
                  </div>

                  {/* Interactive MPC Visualization */}
                  <MpcVisualizer shares={tx.mpcShares} />

                  {/* Decision Buttons */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                    <Link
                      href={`/transactions/${tx.id}`}
                      className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
                    >
                      <span>Inspect Full Transaction Cryptography</span>
                      <ExternalLink className="w-3 h-3" />
                    </Link>

                    <div className="flex items-center gap-2.5">
                      <button
                        onClick={() => handleResolve(app.id, "REJECT")}
                        disabled={resolvingId === app.id}
                        className="px-4 py-2.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 hover:bg-rose-500 hover:text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all"
                      >
                        <X className="w-4 h-4" />
                        <span>Reject Payment</span>
                      </button>

                      <button
                        onClick={() => handleResolve(app.id, "APPROVE")}
                        disabled={resolvingId === app.id}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:scale-105 transition-all"
                      >
                        <Check className="w-4 h-4" />
                        <span>{resolvingId === app.id ? "Signing Passkey Share..." : "Approve with Passkey Share"}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      ) : (
        /* History Tab */
        <div className="space-y-3">
          {historyApprovals.length === 0 ? (
            <div className="rounded-2xl bg-surface/80 border border-surface-border p-8 text-center text-xs text-slate-500">
              No historical approvals recorded yet.
            </div>
          ) : (
            historyApprovals.map((app) => {
              const tx = app.transaction;
              return (
                <div
                  key={app.id}
                  className="rounded-xl bg-surface/90 border border-surface-border p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <StatusBadge status={app.status} size="sm" />
                      <span className="text-xs font-mono text-slate-400">
                        Resolved: {formatDate(app.resolvedAt || app.requestedAt)}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200">
                      {tx.merchantName} — {tx.description}
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <div className="text-sm font-bold font-mono text-slate-100">
                        {formatCurrency(tx.amount)}
                      </div>
                      <span className="text-[11px] font-mono text-slate-400">
                        By: {app.approverName}
                      </span>
                    </div>

                    <Link
                      href={`/transactions/${tx.id}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-mono hover:border-cyan-500/40"
                    >
                      View Tx
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
