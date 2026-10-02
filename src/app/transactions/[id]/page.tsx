"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  ShieldAlert,
  Key,
  Clock,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Store,
  Wallet,
  Layers,
  FileCode,
  Copy,
  Check,
  Cpu,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { RiskGauge } from "@/components/RiskGauge";
import { MpcVisualizer } from "@/components/MpcVisualizer";
import { formatCurrency, formatDate, truncateHash } from "@/lib/utils";

export default function TransactionDetailPage() {
  const params = useParams();
  const id = params?.id as string;

  const [tx, setTx] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showJson, setShowJson] = useState(false);

  const fetchTx = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/transactions/${id}`);
      if (res.ok) {
        const data = await res.json();
        setTx(data.transaction);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchTx();
  }, [id]);

  const copyToClipboard = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  if (loading) {
    return (
      <div className="py-20 text-center text-xs font-mono text-cyan-400 flex items-center justify-center gap-2">
        <Cpu className="w-5 h-5 animate-spin" />
        <span>Loading transaction cryptographic trace...</span>
      </div>
    );
  }

  if (!tx) {
    return (
      <div className="py-12 text-center space-y-4">
        <h2 className="text-base font-bold text-slate-100">Transaction Not Found</h2>
        <Link
          href="/dashboard"
          className="text-xs font-mono text-cyan-400 hover:underline flex items-center justify-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Return to Dashboard
        </Link>
      </div>
    );
  }

  const timeline = tx.executionTimeline || [];
  const policyEval = tx.policyEvaluation;

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Top Back Link & Header */}
      <div className="space-y-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-cyan-400 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Dashboard</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface/90 border border-surface-border rounded-2xl p-6">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-slate-400">Transaction ID:</span>
              <span className="text-xs font-mono text-cyan-300 font-bold">
                {truncateHash(tx.id, 10, 8)}
              </span>
              <button
                onClick={() => copyToClipboard(tx.id, "txid")}
                className="p-1 rounded bg-slate-900 text-slate-400 hover:text-slate-200"
              >
                {copiedField === "txid" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              </button>
            </div>
            <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
              <Store className="w-5 h-5 text-cyan-400" />
              <span>{tx.merchantName}</span>
              <span className="text-slate-400 font-normal">— {tx.description}</span>
            </h1>
          </div>

          <div className="text-right">
            <div className="text-3xl font-extrabold font-mono text-slate-100">
              {formatCurrency(tx.amount)}
            </div>
            <div className="mt-1 flex items-center justify-end gap-2">
              <StatusBadge status={tx.status} size="sm" />
              <span className="text-xs font-mono text-slate-400">{formatDate(tx.createdAt)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Security Timeline (The Core Project Feature) */}
      <div className="bg-surface/90 border border-surface-border rounded-2xl p-6 space-y-6">
        <div className="flex items-center justify-between border-b border-surface-border pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-cyan-400" />
              Full Security Lifecycle & Cryptographic Timeline
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Step-by-step verification from intent analysis to threshold signature and L2 rollup confirmation.
            </p>
          </div>
          <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-900 border border-slate-800 text-slate-400">
            {timeline.length} Verification Steps
          </span>
        </div>

        <div className="relative pl-6 space-y-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
          {timeline.map((item: any, idx: number) => {
            const isSuccess = item.status === "SUCCESS";
            const isBlocked = item.status === "BLOCKED";
            const isWarning = item.status === "WARNING";

            return (
              <div key={idx} className="relative group">
                {/* Step Circle */}
                <div
                  className={`absolute -left-6 top-1 w-5 h-5 rounded-full border-2 flex items-center justify-center bg-slate-950 ${
                    isSuccess
                      ? "border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.4)]"
                      : isBlocked
                      ? "border-rose-500 text-rose-400 shadow-[0_0_10px_rgba(244,63,94,0.4)]"
                      : "border-amber-500 text-amber-400 shadow-[0_0_10px_rgba(245,158,11,0.4)]"
                  }`}
                >
                  {isSuccess ? (
                    <CheckCircle2 className="w-3 h-3" />
                  ) : isBlocked ? (
                    <XCircle className="w-3 h-3" />
                  ) : (
                    <AlertTriangle className="w-3 h-3" />
                  )}
                </div>

                <div className="bg-slate-950/60 border border-slate-800/90 rounded-xl p-4 space-y-1.5 hover:border-slate-700 transition-colors">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-xs text-slate-200">
                      Step {idx + 1}: {item.step}
                    </span>
                    <span className="text-[11px] font-mono text-slate-500">
                      {formatDate(item.timestamp)}
                    </span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed font-sans">
                    {item.note}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* MPC Threshold & Risk Assessment Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* MPC Visualizer */}
        <MpcVisualizer shares={tx.mpcShares} />

        {/* Risk Assessment Card */}
        <div className="bg-surface/90 border border-surface-border rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-surface-border pb-3">
              <ShieldAlert className="w-4 h-4 text-amber-400" />
              Dynamic Risk Evaluation
            </h3>
            <div className="pt-4">
              <RiskGauge score={tx.riskScore} showDetails={true} />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 text-xs text-slate-300">
            <strong className="text-slate-100">Decision Outcome:</strong>{" "}
            {tx.status === "COMPLETED"
              ? "Low-risk parameters met. 2-of-3 threshold authorized autonomously."
              : tx.status === "APPROVAL_REQUIRED"
              ? "Elevated monetary value. Dispatched to human co-signer."
              : `Blocked by Policy Shield: ${tx.failureReason || "Strict violation."}`}
          </div>
        </div>
      </div>

      {/* Cryptographic Proofs & Blockchain Hashes */}
      <div className="bg-surface/90 border border-surface-border rounded-2xl p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-surface-border pb-3">
          <h3 className="text-sm font-bold text-slate-100 flex items-center gap-2">
            <Key className="w-4 h-4 text-cyan-400" />
            Cryptographic Signatures & Rollup Settlement
          </h3>
          <span className="text-[11px] font-mono text-cyan-400">AgentPay Sandbox Chain</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="text-slate-500">Transaction Hash (L2 Rollup)</div>
            <div className="text-slate-200 break-all font-semibold">
              {tx.txHash || "N/A (Transaction Not Settled)"}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="text-slate-500">Aggregate Signature (Schnorr Proof)</div>
            <div className="text-slate-200 break-all font-semibold">
              {tx.signatureHash || "N/A"}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="text-slate-500">Settlement Block Number</div>
            <div className="text-cyan-300 font-bold">
              {tx.blockNumber ? `#${tx.blockNumber}` : "Pending Quorum"}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-1">
            <div className="text-slate-500">Smart Account Sender</div>
            <div className="text-slate-200 break-all">
              {tx.wallet?.address || "0xAGENTPAY7F82..."}
            </div>
          </div>
        </div>
      </div>

      {/* Raw JSON Audit Inspector Toggle */}
      <div className="bg-surface/80 border border-surface-border rounded-2xl p-4">
        <button
          onClick={() => setShowJson(!showJson)}
          className="w-full flex items-center justify-between text-xs font-mono text-slate-400 hover:text-slate-200"
        >
          <span className="flex items-center gap-2">
            <FileCode className="w-4 h-4 text-cyan-400" />
            <span>Raw Audit Payload Inspector</span>
          </span>
          <span>{showJson ? "Hide JSON" : "Show JSON"}</span>
        </button>

        {showJson && (
          <pre className="mt-4 p-4 rounded-xl bg-slate-950 border border-slate-800 text-[11px] font-mono text-cyan-300 overflow-x-auto max-h-96">
            {JSON.stringify(tx, null, 2)}
          </pre>
        )}
      </div>
    </div>
  );
}
