"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Clock,
  Search,
  Filter,
  ExternalLink,
  Store,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, formatDate, truncateHash } from "@/lib/utils";

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/transactions?status=${statusFilter}&limit=100`);
      if (res.ok) {
        const data = await res.json();
        setTransactions(data.transactions || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [statusFilter]);

  const filtered = transactions.filter((t) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      t.merchantName.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface/90 border border-surface-border rounded-2xl p-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Clock className="w-5 h-5 text-cyan-400" />
            Transactions & Security Ledger
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic ledger of all autonomous AI purchase attempts, multi-sig approvals, and policy blocks.
          </p>
        </div>

        <button
          onClick={fetchTransactions}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["ALL", "COMPLETED", "APPROVAL_REQUIRED", "REJECTED"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                statusFilter === st
                  ? "bg-cyan-500/15 border border-cyan-500/40 text-cyan-300"
                  : "bg-surface/80 border border-surface-border text-slate-400 hover:text-slate-200"
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search merchant, category..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-surface/90 border border-surface-border rounded-2xl p-6 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-surface-border text-slate-400">
                <th className="py-3 px-3">Merchant / Item</th>
                <th className="py-3 px-3">Category</th>
                <th className="py-3 px-3">Amount</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Risk Score</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60 text-slate-300">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">
                    No transactions found.
                  </td>
                </tr>
              ) : (
                filtered.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-3.5 px-3">
                      <div className="font-semibold text-slate-200 font-sans flex items-center gap-1.5">
                        <Store className="w-3.5 h-3.5 text-slate-400" />
                        <span>{tx.merchantName}</span>
                      </div>
                      <div className="text-[11px] text-slate-400 font-sans truncate max-w-xs mt-0.5">
                        {tx.description}
                      </div>
                    </td>

                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-[11px]">
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
                      <span
                        className={`text-[11px] font-bold ${
                          tx.riskScore >= 70
                            ? "text-rose-400"
                            : tx.riskScore >= 30
                            ? "text-amber-400"
                            : "text-emerald-400"
                        }`}
                      >
                        {tx.riskScore}/100
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
                        <span>Verify Trace</span>
                        <ExternalLink className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
