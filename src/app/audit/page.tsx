"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  FileText,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ShieldAlert,
  Terminal,
  Cpu,
  RefreshCw,
  ExternalLink,
  Copy,
  Check,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { formatDate, truncateHash } from "@/lib/utils";

export default function AuditLogPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [search, setSearch] = useState("");
  const [copiedHash, setCopiedHash] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const query = new URLSearchParams();
      if (statusFilter !== "ALL") query.set("status", statusFilter);
      if (search) query.set("search", search);

      const res = await fetch(`/api/audit?${query.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setLogs(data.logs || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchLogs();
  };

  const copyHash = (hash: string) => {
    navigator.clipboard.writeText(hash);
    setCopiedHash(hash);
    setTimeout(() => setCopiedHash(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface/90 border border-surface-border rounded-2xl p-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <FileText className="w-5 h-5 text-cyan-400" />
            Immutable Audit Ledger & AI Decision Trace
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Cryptographic SHA-256 chained audit logs recording every autonomous agent thought, tool execution, policy check, and signature.
          </p>
        </div>

        <button
          onClick={fetchLogs}
          className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 self-start sm:self-auto"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {["ALL", "SUCCESS", "WARNING", "BLOCKED"].map((st) => (
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

        <form onSubmit={handleSearchSubmit} className="w-full sm:w-72 flex gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, tool, hash..."
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-cyan-500/50 font-mono"
          />
        </form>
      </div>

      {/* Audit Log Stream */}
      <div className="bg-surface/90 border border-surface-border rounded-2xl p-6 space-y-4">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-surface-border text-slate-400">
                <th className="py-3 px-3">Timestamp</th>
                <th className="py-3 px-3">Action / Tool</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Details / Input</th>
                <th className="py-3 px-3">Hash Chain (Current & Prev)</th>
                <th className="py-3 px-3 text-right">Related Tx</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border/60 text-slate-300">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No audit records found matching criteria.
                  </td>
                </tr>
              ) : (
                logs.map((log) => {
                  const inputParsed = log.inputData ? JSON.parse(log.inputData) : null;
                  const outputParsed = log.outputData ? JSON.parse(log.outputData) : null;

                  return (
                    <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-3 text-slate-400 whitespace-nowrap">
                        {formatDate(log.timestamp)}
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="font-bold text-slate-200">{log.action}</div>
                        {log.toolName && (
                          <div className="text-[10px] text-cyan-400 mt-0.5 font-mono">
                            tool: {log.toolName}()
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        <StatusBadge status={log.status} size="sm" />
                      </td>

                      <td className="py-3.5 px-3 max-w-xs">
                        <div className="text-[11px] text-slate-300 truncate">
                          {inputParsed ? JSON.stringify(inputParsed) : "—"}
                        </div>
                        {outputParsed && (
                          <div className="text-[10px] text-slate-400 truncate mt-0.5">
                            out: {JSON.stringify(outputParsed)}
                          </div>
                        )}
                      </td>

                      <td className="py-3.5 px-3">
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-500 uppercase">Curr:</span>
                            <span className="text-cyan-300 font-mono">{truncateHash(log.hash, 6, 4)}</span>
                            <button
                              onClick={() => copyHash(log.hash)}
                              className="p-1 rounded bg-slate-900 text-slate-500 hover:text-slate-200"
                              title="Copy current hash"
                            >
                              {copiedHash === log.hash ? (
                                <Check className="w-3 h-3 text-emerald-400" />
                              ) : (
                                <Copy className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                          {log.previousHash && (
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-500">
                              <span className="uppercase">Prev:</span>
                              <span className="font-mono text-slate-400">{truncateHash(log.previousHash, 6, 4)}</span>
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        {log.transactionId ? (
                          <Link
                            href={`/transactions/${log.transactionId}`}
                            className="text-cyan-400 hover:underline flex items-center justify-end gap-1 font-mono text-[11px]"
                          >
                            <span>Tx: {log.transactionId.substring(0, 8)}...</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                        ) : (
                          <span className="text-slate-500">—</span>
                        )}
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
