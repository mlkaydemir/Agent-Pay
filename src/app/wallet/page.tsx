"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Wallet,
  Lock,
  Unlock,
  Shield,
  ShieldCheck,
  ShieldAlert,
  ArrowUpRight,
  ArrowDownLeft,
  PlusCircle,
  RotateCcw,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Key,
  Cpu,
} from "lucide-react";
import { StatCard } from "@/components/StatCard";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate, truncateHash } from "@/lib/utils";

export default function WalletPage() {
  const [data, setData] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [freezeLoading, setFreezeLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [walletRes, txRes] = await Promise.all([
        fetch("/api/wallet"),
        fetch("/api/transactions?limit=20"),
      ]);

      if (walletRes.ok) {
        const w = await walletRes.json();
        setData(w);
      }
      if (txRes.ok) {
        const t = await txRes.json();
        setTransactions(t.transactions || []);
      }
    } catch (e) {
      console.error(e);
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

  const handleTopup = async (isReset = false) => {
    try {
      await fetch("/api/wallet/topup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: 5000, reset: isReset }),
      });
      await fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const copyAddress = () => {
    if (data?.wallet?.address) {
      navigator.clipboard.writeText(data.wallet.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const wallet = data?.wallet || {
    address: "0xAGENTPAY7F82B91A40D4038E86c52994C3dE3e8F",
    balance: 10000,
    isFrozen: false,
    network: "AgentPay Sandbox L2 (MPC-AA)",
    nonce: 3,
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Disclaimer Banner */}
      <div className="rounded-xl bg-cyan-950/40 border border-cyan-500/30 p-4 text-xs text-cyan-200 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>Demo Smart Account (ERC-4337 Sim):</strong> Simulated MPC-secured smart wallet. No real crypto or bank accounts are connected.
          </span>
        </div>
        <span className="font-mono text-[11px] text-cyan-400 shrink-0 bg-slate-950 px-2 py-0.5 rounded border border-cyan-800">
          Sandbox Mode
        </span>
      </div>

      {/* Main Account Vault Card */}
      <div className="bg-gradient-to-br from-surface to-slate-950 border border-surface-border rounded-3xl p-6 sm:p-8 space-y-6 relative overflow-hidden shadow-2xl">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-surface-border/80 pb-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Layers className="w-3.5 h-3.5" />
              <span>{wallet.network}</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold font-mono text-slate-100 tracking-tight">
              {formatCurrency(wallet.balance)}
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs font-mono text-slate-400">Smart Contract:</span>
              <span className="text-xs font-mono text-slate-200 font-semibold">
                {wallet.address}
              </span>
              <button
                onClick={copyAddress}
                className="p-1 rounded bg-slate-900 text-slate-400 hover:text-slate-200"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              </button>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => handleTopup(false)}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Faucet +₺5,000</span>
            </button>

            <button
              onClick={() => handleTopup(true)}
              className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-slate-100 text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reset ₺10k</span>
            </button>

            <button
              onClick={handleToggleFreeze}
              disabled={freezeLoading}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold font-mono flex items-center gap-2 border transition-all ${
                wallet.isFrozen
                  ? "bg-rose-500 text-slate-950 border-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.4)] animate-pulse"
                  : "bg-slate-900 border-rose-500/40 text-rose-400 hover:bg-rose-500/10"
              }`}
            >
              {wallet.isFrozen ? (
                <>
                  <Lock className="w-4 h-4" />
                  <span>EMERGENCY FREEZE ACTIVE</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>EMERGENCY FREEZE</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Account Abstraction Properties */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-slate-500 font-sans">Threshold Architecture</div>
            <div className="text-cyan-300 font-bold text-sm">2-of-3 TSS</div>
            <div className="text-[11px] text-slate-400 font-sans">AI + Policy HSM + Passkey</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-slate-500 font-sans">Guardian Protection</div>
            <div className="text-emerald-400 font-bold text-sm">Active & Guarded</div>
            <div className="text-[11px] text-slate-400 font-sans">Instant Kill-switch</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-slate-500 font-sans">Account Nonce</div>
            <div className="text-slate-100 font-bold text-sm">#{wallet.nonce}</div>
            <div className="text-[11px] text-slate-400 font-sans">Replay Attack Shield</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
            <div className="text-slate-500 font-sans">Daily Spend Allowance</div>
            <div className="text-slate-100 font-bold text-sm">₺2,500 / Day</div>
            <div className="text-[11px] text-slate-400 font-sans">Customizable in Policies</div>
          </div>
        </div>
      </div>

      {/* Wallet Ledger Stream */}
      <div className="bg-surface/90 border border-surface-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <Wallet className="w-4 h-4 text-cyan-400" />
              Smart Account Transaction History
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Incoming sandbox faucet deposits and outgoing autonomous agent settlements.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-surface-border text-slate-400">
                <th className="py-3 px-3">Type</th>
                <th className="py-3 px-3">Description / Merchant</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60 text-slate-300">
              {transactions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No transactions recorded on this sandbox wallet.
                  </td>
                </tr>
              ) : (
                transactions.map((tx) => {
                  const isIncoming = tx.amount < 0; // standard mock outflow
                  return (
                    <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-3">
                        <span className="flex items-center gap-1.5 text-slate-200">
                          <ArrowUpRight className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Autonomous Outflow</span>
                        </span>
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-semibold text-slate-200 font-sans">
                          {tx.merchantName}
                        </div>
                        <div className="text-[11px] text-slate-400 font-sans truncate max-w-xs mt-0.5">
                          {tx.description}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-bold text-slate-100">
                        {formatCurrency(tx.amount)}
                      </td>

                      <td className="py-3.5 px-3">
                        <StatusBadge status={tx.status} size="sm" />
                      </td>

                      <td className="py-3.5 px-3 text-slate-400 text-[11px]">
                        {formatDate(tx.createdAt)}
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <Link
                          href={`/transactions/${tx.id}`}
                          className="text-cyan-400 hover:underline flex items-center justify-end gap-1 text-[11px]"
                        >
                          <span>Verify Trace</span>
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
