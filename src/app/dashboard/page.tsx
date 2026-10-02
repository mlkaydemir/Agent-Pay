"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wallet,
  TrendingUp,
  Sliders,
  CheckSquare,
  Lock,
  Unlock,
  Bot,
  Shield,
  ArrowRight,
  RefreshCw,
  ExternalLink,
  Store,
  Clock,
  AlertCircle,
  PlusCircle,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate, truncateHash } from "@/lib/utils";

export default function DashboardPage() {
  const [data, setData] = useState<{
    user: any;
    wallet: any;
    activePolicy: any;
  } | null>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [freezeLoading, setFreezeLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [walletRes, txRes] = await Promise.all([
        fetch("/api/wallet"),
        fetch("/api/transactions?limit=10"),
      ]);

      if (walletRes.ok) {
        const wData = await walletRes.json();
        setData(wData);
      }
      if (txRes.ok) {
        const tData = await txRes.json();
        setTransactions(tData.transactions || []);
      }
    } catch (e) {
      console.error("Dashboard fetch error:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleToggleFreeze = async () => {
    try {
      setFreezeLoading(true);
      const res = await fetch("/api/wallet/freeze", { method: "POST" });
      if (res.ok) {
        await fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFreezeLoading(false);
    }
  };

  const handleTopup = async () => {
    try {
      await fetch("/api/wallet/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 5000 }),
      });
      await fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const wallet = data?.wallet || {
    balance: 10000,
    isFrozen: false,
    todaySpent: 840,
    pendingApprovalsCount: 1,
    address: "0xAGENTPAY7F82B91A40D4038E86c52994C3dE3e8F",
    network: "AgentPay Sandbox L2",
  };
  const policy = data?.activePolicy || {
    dailyLimit: 2500,
    singleLimit: 1000,
    monthlyLimit: 10000,
    approvalThreshold: 500,
  };

  const dailySpentPercent = Math.min(
    100,
    Math.round(((wallet.todaySpent || 0) / (policy.dailyLimit || 2500)) * 100)
  );

  return (
    <div className="space-y-8">
      {/* Top Welcome & Smart Account Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface/90 border border-surface-border rounded-2xl p-6 relative overflow-hidden">
        <div className="space-y-1 z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-cyan-400 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-800/60">
              Demo Environment
            </span>
            <span className="text-xs font-mono text-slate-400">
              {wallet.network}
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-100 flex items-center gap-2">
            <span>Welcome, Melike Demo</span>
            <span className="text-sm font-normal text-slate-400 font-mono">
              ({truncateHash(wallet.address, 6, 4)})
            </span>
          </h1>
          <p className="text-xs text-slate-400">
            Autonomous commerce permissions are actively monitored by the AgentPay Policy Engine.
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap items-center gap-2.5 z-10">
          <button
            onClick={handleTopup}
            className="px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-medium text-slate-300 hover:text-slate-100 hover:border-slate-600 flex items-center gap-1.5 transition-all"
          >
            <PlusCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>Top Up ₺5,000</span>
          </button>

          <button
            onClick={handleToggleFreeze}
            disabled={freezeLoading}
            className={`px-4 py-2 rounded-xl text-xs font-bold font-mono flex items-center gap-2 border transition-all ${
              wallet.isFrozen
                ? "bg-rose-500/20 text-rose-300 border-rose-500/50 hover:bg-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.3)] animate-pulse"
                : "bg-slate-900 border-slate-700 text-slate-300 hover:border-rose-500/40 hover:text-rose-400"
            }`}
          >
            {wallet.isFrozen ? (
              <>
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>UNFREEZE ACCOUNT</span>
              </>
            ) : (
              <>
                <Lock className="w-3.5 h-3.5 text-slate-400" />
                <span>EMERGENCY FREEZE</span>
              </>
            )}
          </button>

          <Link
            href="/agent"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:scale-105 transition-transform"
          >
            <Bot className="w-4 h-4" />
            <span>Open AI Agent</span>
          </Link>
        </div>
      </div>

      {/* Emergency Freeze Alert Banner (if active) */}
      {wallet.isFrozen && (
        <div className="rounded-xl bg-rose-950/40 border border-rose-500/40 p-4 text-xs text-rose-200 flex items-center justify-between gap-3 shadow-[0_0_20px_rgba(244,63,94,0.2)]">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-rose-400 shrink-0" />
            <div>
              <strong className="font-bold">Smart Account Emergency Freeze is ACTIVE:</strong> All autonomous AI agent spending is locked. No transactions can be executed until you unfreeze.
            </div>
          </div>
          <button
            onClick={handleToggleFreeze}
            className="px-3 py-1 rounded bg-rose-500 text-slate-950 font-bold font-mono text-[11px] shrink-0 hover:bg-rose-400"
          >
            Lift Freeze
          </button>
        </div>
      )}

      {/* 4 Core Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Available Balance"
          value={formatCurrency(wallet.balance)}
          subtitle="Mock Sandbox Vault"
          icon={<Wallet className="w-5 h-5" />}
          accentColor="cyan"
          badge="Live"
        />

        <StatCard
          title="Today's Spending"
          value={formatCurrency(wallet.todaySpent || 0)}
          subtitle={`${dailySpentPercent}% of daily allowance`}
          icon={<TrendingUp className="w-5 h-5" />}
          accentColor={dailySpentPercent > 80 ? "amber" : "blue"}
          trend={{
            text: `Limit: ${formatCurrency(policy.dailyLimit)}`,
            isWarning: dailySpentPercent > 80,
            isPositive: dailySpentPercent <= 80,
          }}
        />

        <StatCard
          title="Daily Limit"
          value={formatCurrency(policy.dailyLimit)}
          subtitle={`Single Tx: ${formatCurrency(policy.singleLimit)}`}
          icon={<Sliders className="w-5 h-5" />}
          accentColor="emerald"
          badge="Policy"
        />

        <StatCard
          title="Pending Approvals"
          value={wallet.pendingApprovalsCount}
          subtitle="Awaiting 2-of-3 MPC share"
          icon={<CheckSquare className="w-5 h-5" />}
          accentColor={wallet.pendingApprovalsCount > 0 ? "amber" : "purple"}
          badge={wallet.pendingApprovalsCount > 0 ? "Action Required" : "All Clear"}
        />
      </div>

      {/* Daily Budget Velocity Bar */}
      <div className="bg-surface/80 border border-surface-border rounded-xl p-4.5 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
            Daily Budget Velocity Tracker
          </span>
          <span className="font-mono text-slate-400">
            {formatCurrency(wallet.todaySpent || 0)} / {formatCurrency(policy.dailyLimit)} (
            {formatCurrency(Math.max(0, policy.dailyLimit - (wallet.todaySpent || 0)))} remaining)
          </span>
        </div>
        <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden border border-slate-800">
          <div
            className={`h-full rounded-full transition-all duration-500 ${
              dailySpentPercent > 90
                ? "bg-rose-500"
                : dailySpentPercent > 60
                ? "bg-amber-400"
                : "bg-gradient-to-r from-cyan-500 to-blue-500"
            }`}
            style={{ width: `${dailySpentPercent}%` }}
          />
        </div>
      </div>

      {/* Recent Transactions List */}
      <div className="bg-surface/90 border border-surface-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Clock className="w-4 h-4 text-cyan-400" />
              Recent AI Transactions & Security Verifications
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Real-time audit stream of all transactions evaluated by Policy Engine and MPC.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchData}
              className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
              title="Refresh"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
            <Link
              href="/audit"
              className="text-xs font-mono text-cyan-400 hover:underline flex items-center gap-1"
            >
              <span>View Audit Log</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-surface-border text-slate-400 font-medium">
                <th className="py-3 px-3">Merchant / Description</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">MPC Quorum</th>
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60 text-slate-300">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No transactions recorded yet. Ask the AI Agent to buy an item!
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const mpc = tx.mpcShares;
                  const sharesCount = [mpc?.aiShare, mpc?.policyShare, mpc?.userShare].filter(
                    Boolean
                  ).length;

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-800/30 transition-colors group"
                    >
                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-200 font-sans flex items-center gap-2">
                          <Store className="w-3.5 h-3.5 text-slate-400" />
                          <span>{tx.merchantName}</span>
                        </div>
                        <div className="text-[11px] text-slate-400 font-sans truncate max-w-xs mt-0.5">
                          {tx.description}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px] text-slate-300">
                          {tx.category}
                        </span>
                      </td>

                      <td className="py-3.5 px-3 font-bold text-slate-100">
                        {formatCurrency(tx.amount)}
                      </td>

                      <td className="py-3.5 px-3">
                        <StatusBadge status={tx.status} size="sm" />
                      </td>

                      <td className="py-3.5 px-3">
                        <span className="text-[11px] font-mono text-slate-400">
                          {sharesCount}/3 Shares
                        </span>
                      </td>

                      <td className="py-3.5 px-3 text-slate-400 text-[11px]">
                        {formatDate(tx.createdAt)}
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <Link
                          href={`/transactions/${tx.id}`}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-slate-900 border border-slate-800 text-cyan-400 hover:border-cyan-500/40 text-[11px]"
                        >
                          <span>Verify</span>
                          <ExternalLink className="w-3 h-3" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
