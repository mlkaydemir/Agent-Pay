"use client";

import React, { useEffect, useState } from "react";
import {
  Sliders,
  ShieldCheck,
  ShieldAlert,
  Save,
  Plus,
  X,
  Check,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Lock,
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function PoliciesPage() {
  const [policy, setPolicy] = useState<{
    id?: string;
    dailyLimit: number;
    singleLimit: number;
    monthlyLimit: number;
    approvalThreshold: number;
    allowedCategories: string[];
    blockedCategories: string[];
    allowedMerchants: string[];
    blockedMerchants: string[];
    requireApprovalForUnknownMerchant: boolean;
    autoFreezeOnRiskThreshold: number;
    isStrict: boolean;
  }>({
    dailyLimit: 2500,
    singleLimit: 1000,
    monthlyLimit: 10000,
    approvalThreshold: 500,
    allowedCategories: ["Electronics", "Education", "Software", "Office Equipment", "Books"],
    blockedCategories: ["Gambling", "Unknown", "High Risk", "Crypto Scams", "Adult"],
    allowedMerchants: ["TechStore Demo", "StudentTech", "Campus Market", "Teknosa", "Amazon", "Trendyol"],
    blockedMerchants: ["DarkShop Demo", "Rogue Address 0x999", "Untrusted Crypto Gateway"],
    requireApprovalForUnknownMerchant: true,
    autoFreezeOnRiskThreshold: 80,
    isStrict: true,
  });

  const [newAllowedCat, setNewAllowedCat] = useState("");
  const [newBlockedCat, setNewBlockedCat] = useState("");
  const [newAllowedMerchant, setNewAllowedMerchant] = useState("");
  const [newBlockedMerchant, setNewBlockedMerchant] = useState("");

  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Policy Sandbox Tester State
  const [testAmount, setTestAmount] = useState(840);
  const [testCategory, setTestCategory] = useState("Electronics");
  const [testMerchant, setTestMerchant] = useState("Teknosa");
  const [testResult, setTestResult] = useState<any>(null);

  const fetchPolicy = async () => {
    try {
      const res = await fetch("/api/policies");
      if (res.ok) {
        const data = await res.json();
        setPolicy(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchPolicy();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setSavedSuccess(false);
    try {
      const res = await fetch("/api/policies", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(policy),
      });
      if (res.ok) {
        setSavedSuccess(true);
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  // Run local simulation test
  const runPolicyTest = () => {
    const isCatBlocked = policy.blockedCategories.some(
      (c) => c.toLowerCase() === testCategory.toLowerCase()
    );
    const isCatAllowed = policy.allowedCategories.some(
      (c) => c.toLowerCase() === testCategory.toLowerCase()
    );
    const isMerchBlocked = policy.blockedMerchants.some(
      (m) => m.toLowerCase() === testMerchant.toLowerCase()
    );
    const isMerchAllowed = policy.allowedMerchants.some(
      (m) => m.toLowerCase() === testMerchant.toLowerCase()
    );
    const singleLimitPass = testAmount <= policy.singleLimit;
    const approvalReq = testAmount > policy.approvalThreshold || !isMerchAllowed;

    let verdict = "APPROVED";
    let reasons: string[] = [];

    if (isCatBlocked) {
      verdict = "REJECTED";
      reasons.push(`Category "${testCategory}" is strictly blocked.`);
    } else if (isMerchBlocked) {
      verdict = "REJECTED";
      reasons.push(`Merchant "${testMerchant}" is blacklisted.`);
    } else if (testAmount > policy.dailyLimit) {
      verdict = "REJECTED";
      reasons.push(`Amount exceeds daily limit of ${formatCurrency(policy.dailyLimit)}.`);
    } else if (!singleLimitPass || approvalReq) {
      verdict = "APPROVAL_REQUIRED";
      if (!singleLimitPass) reasons.push(`Exceeds single transaction auto-limit (${formatCurrency(policy.singleLimit)}).`);
      if (testAmount > policy.approvalThreshold) reasons.push(`Exceeds auto-approval threshold (${formatCurrency(policy.approvalThreshold)}).`);
      if (!isMerchAllowed) reasons.push(`Merchant "${testMerchant}" is not on trusted whitelist.`);
    } else {
      verdict = "APPROVED";
      reasons.push("All limits and category checks passed.");
    }

    setTestResult({ verdict, reasons });
  };

  useEffect(() => {
    runPolicyTest();
  }, [testAmount, testCategory, testMerchant, policy]);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-surface/90 border border-surface-border rounded-2xl p-6">
        <div>
          <h1 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            Spending Policies & Financial Guardrails
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Configure programmatic rules enforced on every AI payment request before MPC threshold signing.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {savedSuccess && (
            <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 animate-fadeIn">
              <Check className="w-4 h-4" /> Policies Saved to Sandbox!
            </span>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? "Saving..." : "Save Policy Config"}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Financial Limits & Whitelists */}
        <div className="lg:col-span-2 space-y-6">
          {/* Card 1: Monetary Spending Limits */}
          <div className="bg-surface/90 border border-surface-border rounded-2xl p-6 space-y-6">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-surface-border pb-3">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
              Monetary Limit Caps
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Daily Limit */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>Daily Spending Cap</span>
                  <span className="text-cyan-400 font-mono font-bold">
                    {formatCurrency(policy.dailyLimit)}
                  </span>
                </label>
                <input
                  type="number"
                  value={policy.dailyLimit}
                  onChange={(e) =>
                    setPolicy({ ...policy, dailyLimit: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500/50"
                />
                <p className="text-[11px] text-slate-400">
                  Maximum cumulative spending allowed in a single calendar day.
                </p>
              </div>

              {/* Single Limit */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>Single Transaction Auto-Limit</span>
                  <span className="text-cyan-400 font-mono font-bold">
                    {formatCurrency(policy.singleLimit)}
                  </span>
                </label>
                <input
                  type="number"
                  value={policy.singleLimit}
                  onChange={(e) =>
                    setPolicy({ ...policy, singleLimit: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500/50"
                />
                <p className="text-[11px] text-slate-400">
                  Transactions above this trigger multi-sig escalation.
                </p>
              </div>

              {/* Monthly Limit */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>Monthly Spending Cap</span>
                  <span className="text-cyan-400 font-mono font-bold">
                    {formatCurrency(policy.monthlyLimit)}
                  </span>
                </label>
                <input
                  type="number"
                  value={policy.monthlyLimit}
                  onChange={(e) =>
                    setPolicy({ ...policy, monthlyLimit: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-cyan-500/50"
                />
                <p className="text-[11px] text-slate-400">
                  Hard global limit per 30-day billing cycle.
                </p>
              </div>

              {/* Approval Threshold */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-slate-300 flex items-center justify-between">
                  <span>Require User Approval Above</span>
                  <span className="text-amber-400 font-mono font-bold">
                    {formatCurrency(policy.approvalThreshold)}
                  </span>
                </label>
                <input
                  type="number"
                  value={policy.approvalThreshold}
                  onChange={(e) =>
                    setPolicy({ ...policy, approvalThreshold: parseFloat(e.target.value) || 0 })
                  }
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-slate-100 focus:outline-none focus:border-amber-500/50"
                />
                <p className="text-[11px] text-slate-400">
                  Transactions exceeding this require explicit Passkey co-signature.
                </p>
              </div>
            </div>
          </div>

          {/* Card 2: Categories Whitelist & Blacklist */}
          <div className="bg-surface/90 border border-surface-border rounded-2xl p-6 space-y-6">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-surface-border pb-3">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span>
              Category Restrictions
            </h2>

            <div className="space-y-4">
              {/* Allowed Categories */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4" /> Allowed Categories (Whitelist)
                </span>
                <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 min-h-[48px]">
                  {policy.allowedCategories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-emerald-300 text-xs flex items-center gap-1.5 font-mono"
                    >
                      <span>{cat}</span>
                      <button
                        onClick={() =>
                          setPolicy({
                            ...policy,
                            allowedCategories: policy.allowedCategories.filter((_, i) => i !== idx),
                          })
                        }
                        className="hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAllowedCat}
                    onChange={(e) => setNewAllowedCat(e.target.value)}
                    placeholder="Add allowed category (e.g. Hardware)..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (newAllowedCat.trim()) {
                        setPolicy({
                          ...policy,
                          allowedCategories: [...policy.allowedCategories, newAllowedCat.trim()],
                        });
                        setNewAllowedCat("");
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/25"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Blocked Categories */}
              <div className="space-y-2 pt-2">
                <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                  <ShieldAlert className="w-4 h-4" /> Blocked Categories (Strict Blacklist)
                </span>
                <div className="flex flex-wrap gap-2 p-3 rounded-xl bg-slate-900/80 border border-slate-800 min-h-[48px]">
                  {policy.blockedCategories.map((cat, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 rounded-lg bg-rose-500/10 border border-rose-500/25 text-rose-300 text-xs flex items-center gap-1.5 font-mono"
                    >
                      <span>{cat}</span>
                      <button
                        onClick={() =>
                          setPolicy({
                            ...policy,
                            blockedCategories: policy.blockedCategories.filter((_, i) => i !== idx),
                          })
                        }
                        className="hover:text-slate-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBlockedCat}
                    onChange={(e) => setNewBlockedCat(e.target.value)}
                    placeholder="Add blocked category (e.g. Crypto Scams)..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (newBlockedCat.trim()) {
                        setPolicy({
                          ...policy,
                          blockedCategories: [...policy.blockedCategories, newBlockedCat.trim()],
                        });
                        setNewBlockedCat("");
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold hover:bg-rose-500/25"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Merchants Whitelist & Blacklist */}
          <div className="bg-surface/90 border border-surface-border rounded-2xl p-6 space-y-6">
            <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 border-b border-surface-border pb-3">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              Merchant Whitelist & Blacklist
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Allowed Merchants */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">Trusted Merchants</span>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 min-h-[90px]">
                  {policy.allowedMerchants.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/40 text-cyan-300 text-[11px] flex items-center gap-1 font-mono"
                    >
                      <span>{m}</span>
                      <button
                        onClick={() =>
                          setPolicy({
                            ...policy,
                            allowedMerchants: policy.allowedMerchants.filter((_, i) => i !== idx),
                          })
                        }
                        className="hover:text-rose-400"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAllowedMerchant}
                    onChange={(e) => setNewAllowedMerchant(e.target.value)}
                    placeholder="Add trusted merchant..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (newAllowedMerchant.trim()) {
                        setPolicy({
                          ...policy,
                          allowedMerchants: [...policy.allowedMerchants, newAllowedMerchant.trim()],
                        });
                        setNewAllowedMerchant("");
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Blocked Merchants */}
              <div className="space-y-2">
                <span className="text-xs font-semibold text-slate-300">Blacklisted Merchants</span>
                <div className="flex flex-wrap gap-1.5 p-3 rounded-xl bg-slate-900/80 border border-slate-800 min-h-[90px]">
                  {policy.blockedMerchants.map((m, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 rounded bg-rose-950/70 border border-rose-800/40 text-rose-300 text-[11px] flex items-center gap-1 font-mono"
                    >
                      <span>{m}</span>
                      <button
                        onClick={() =>
                          setPolicy({
                            ...policy,
                            blockedMerchants: policy.blockedMerchants.filter((_, i) => i !== idx),
                          })
                        }
                        className="hover:text-slate-100"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newBlockedMerchant}
                    onChange={(e) => setNewBlockedMerchant(e.target.value)}
                    placeholder="Add blocked merchant..."
                    className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none"
                  />
                  <button
                    onClick={() => {
                      if (newBlockedMerchant.trim()) {
                        setPolicy({
                          ...policy,
                          blockedMerchants: [...policy.blockedMerchants, newBlockedMerchant.trim()],
                        });
                        setNewBlockedMerchant("");
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Live Sandbox Simulator */}
        <div className="space-y-6">
          <div className="bg-surface/90 border border-surface-border rounded-2xl p-6 space-y-5 sticky top-24">
            <div className="flex items-center gap-2 border-b border-surface-border pb-3">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              <h2 className="text-sm font-bold text-slate-100">Policy Sandbox Simulator</h2>
            </div>
            <p className="text-xs text-slate-400">
              Test how current policies would evaluate hypothetical transactions in real-time.
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-slate-400 mb-1 block">Test Amount (TL)</label>
                <input
                  type="number"
                  value={testAmount}
                  onChange={(e) => setTestAmount(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono"
                />
              </div>

              <div>
                <label className="text-slate-400 mb-1 block">Merchant Name</label>
                <select
                  value={testMerchant}
                  onChange={(e) => setTestMerchant(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono"
                >
                  <option value="Teknosa">Teknosa (Whitelisted)</option>
                  <option value="Amazon">Amazon (Whitelisted)</option>
                  <option value="TechStore Demo">TechStore Demo (Whitelisted)</option>
                  <option value="DarkShop Demo">DarkShop Demo (Blacklisted)</option>
                  <option value="Unknown Hacker Store">Unknown Hacker Store</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 mb-1 block">Category</label>
                <select
                  value={testCategory}
                  onChange={(e) => setTestCategory(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-slate-100 font-mono"
                >
                  <option value="Electronics">Electronics (Allowed)</option>
                  <option value="Education">Education (Allowed)</option>
                  <option value="Software">Software (Allowed)</option>
                  <option value="Gambling">Gambling (Blocked)</option>
                  <option value="Crypto Scams">Crypto Scams (Blocked)</option>
                </select>
              </div>
            </div>

            {/* Simulation Verdict */}
            {testResult && (
              <div
                className={`p-4 rounded-xl border space-y-2 ${
                  testResult.verdict === "APPROVED"
                    ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
                    : testResult.verdict === "APPROVAL_REQUIRED"
                    ? "bg-amber-950/30 border-amber-500/40 text-amber-300"
                    : "bg-rose-950/30 border-rose-500/40 text-rose-300"
                }`}
              >
                <div className="font-bold text-xs flex items-center justify-between">
                  <span>Policy Verdict:</span>
                  <span className="font-mono">{testResult.verdict}</span>
                </div>
                <ul className="text-[11px] space-y-1 font-mono">
                  {testResult.reasons.map((r: string, idx: number) => (
                    <li key={idx}>• {r}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
