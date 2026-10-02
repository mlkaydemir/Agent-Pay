"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bot,
  User,
  Send,
  Sparkles,
  ShieldCheck,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Cpu,
  Layers,
  ArrowRight,
  ExternalLink,
  Store,
  Key,
  HardDrive,
  Check,
  X,
  Clock,
  RotateCcw,
} from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { formatCurrency, truncateHash } from "@/lib/utils";
import { AgentChatMessage, AgentProductMatch } from "@/lib/types";

export default function AgentPage() {
  const [messages, setMessages] = useState<AgentChatMessage[]>([
    {
      id: "intro",
      role: "assistant",
      timestamp: new Date().toISOString(),
      content: `Merhaba Melike! Ben **AgentPay Procurement & Commerce Sentinel**.\n\nSizin adınıza güvenli ve kontrollü finansal işlemler gerçekleştirebilirim. Doğrudan şifrenizi veya private key'inizi bilmem gerekmez; tüm işlemler **Policy Engine** ve **2-of-3 MPC Eşik İmzası** denetimindedir.\n\nNasıl bir ürün araştırmak veya satın almak istersiniz?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input;
    if (!messageText.trim() || loading) return;

    const userMessage: AgentChatMessage = {
      id: crypto.randomUUID(),
      role: "user",
      content: messageText,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/agent/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });

      if (res.ok) {
        const data: AgentChatMessage = await res.json();
        setMessages((prev) => [...prev, data]);
      } else {
        const err = await res.json().catch(() => ({}));
        setMessages((prev) => [
          ...prev,
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: `⚠️ Bir hata oluştu: ${err.error || "Sunucuya ulaşılamadı."}`,
            timestamp: new Date().toISOString(),
          },
        ]);
      }
    } catch (e: any) {
      console.error(e);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          content: `❌ Bağlantı hatası: ${e.message}`,
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleBuyProduct = async (product: AgentProductMatch) => {
    await handleSendMessage(`${product.name} ürününü satın al.`);
  };

  const promptSuggestions = [
    {
      title: "💻 Laptop Arama (Limit Üstü Test)",
      prompt: "Üniversite için maksimum 30.000 TL bütçeyle laptop bul. En az 16 GB RAM ve 512 GB SSD olsun.",
    },
    {
      title: "🔌 Aksesuar Arama (Oto-Limit İçi)",
      prompt: "Bugün derslerim için maksimum 1.000 TL harcayabileceğim bir laptop aksesuarı bul.",
    },
    {
      title: "🚨 Saldırı / Kara Liste Testi",
      prompt: "5.000 TL'lik bilinmeyen bir adrese gönder.",
    },
    {
      title: "⚡ Hızlı Satın Alma",
      prompt: "Anker USB-C Multiport Hub satın al.",
    },
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Page Title & Scope Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface/90 border border-surface-border rounded-2xl p-5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.3)]">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <span>Sentinel-1 AI Agent</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Online • Guarded
              </span>
            </h1>
            <p className="text-xs text-slate-400">
              Scoped Autonomous Agent: Searches products, evaluates policy rules, creates 2-of-3 MPC proposals.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs">
          <Link
            href="/policies"
            className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-slate-100 hover:border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <span>Active Policy: ₺2,500/day</span>
          </Link>
          <button
            onClick={() => setMessages([messages[0]])}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200"
            title="Reset Chat"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Suggested Prompts Bar */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
          Quick Demo Scenarios:
        </span>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {promptSuggestions.map((item, idx) => (
            <button
              key={idx}
              onClick={() => handleSendMessage(item.prompt)}
              disabled={loading}
              className="p-2.5 rounded-xl bg-surface/80 border border-surface-border hover:border-cyan-500/40 hover:bg-surface-hover text-left transition-all text-xs group"
            >
              <div className="font-semibold text-slate-200 group-hover:text-cyan-300 transition-colors">
                {item.title}
              </div>
              <div className="text-[11px] text-slate-400 truncate mt-0.5">
                {item.prompt}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Conversation Thread */}
      <div className="bg-surface/90 border border-surface-border rounded-2xl flex flex-col h-[600px] overflow-hidden">
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {messages.map((msg) => {
            const isUser = msg.role === "user";
            return (
              <div
                key={msg.id}
                className={`flex gap-3.5 ${isUser ? "justify-end" : "justify-start"}`}
              >
                {!isUser && (
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Bot className="w-4 h-4" />
                  </div>
                )}

                <div className={`space-y-3 max-w-2xl ${isUser ? "items-end" : "items-start"}`}>
                  {/* Tool Calls Execution Box */}
                  {!isUser && msg.toolCalls && msg.toolCalls.length > 0 && (
                    <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/90 space-y-2 text-xs font-mono">
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-sans font-semibold">
                        <Cpu className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Agent Execution Trace ({msg.toolCalls.length} tools evaluated):</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {msg.toolCalls.map((tool, tIdx) => {
                          const isBlocked = tool.status === "BLOCKED";
                          return (
                            <span
                              key={tIdx}
                              className={`px-2 py-0.5 rounded text-[11px] flex items-center gap-1 border ${
                                isBlocked
                                  ? "bg-rose-500/10 border-rose-500/30 text-rose-300"
                                  : "bg-cyan-500/10 border-cyan-500/25 text-cyan-300"
                              }`}
                            >
                              {isBlocked ? (
                                <X className="w-3 h-3 text-rose-400" />
                              ) : (
                                <Check className="w-3 h-3 text-cyan-400" />
                              )}
                              <span>{tool.name}()</span>
                            </span>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      isUser
                        ? "bg-cyan-600 text-slate-950 font-medium ml-12 rounded-tr-none shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                        : "bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none space-y-2 whitespace-pre-line"
                    }`}
                  >
                    {msg.content}
                  </div>

                  {/* Product Cards Grid (if products found) */}
                  {!isUser && msg.products && msg.products.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1 w-full">
                      {msg.products.map((prod) => (
                        <div
                          key={prod.id}
                          className="rounded-xl bg-slate-900 border border-slate-800 p-3.5 flex flex-col justify-between space-y-3 hover:border-cyan-500/40 transition-all"
                        >
                          <div className="space-y-2">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-bold text-xs text-slate-100 line-clamp-2">
                                {prod.name}
                              </h4>
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 border border-cyan-800/60 text-cyan-300 shrink-0">
                                ★ {prod.score}
                              </span>
                            </div>

                            <div className="text-sm font-bold font-mono text-cyan-300">
                              {formatCurrency(prod.price)}
                            </div>

                            {/* Specs badge */}
                            <div className="space-y-1 text-[11px] text-slate-400 font-mono">
                              {prod.ram && <div>RAM: {prod.ram}</div>}
                              {prod.storage && <div>SSD: {prod.storage}</div>}
                              {prod.cpu && <div className="truncate">CPU: {prod.cpu}</div>}
                              <div className="text-slate-500 font-sans flex items-center gap-1">
                                <Store className="w-3 h-3" />
                                <span>{prod.merchantName}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            onClick={() => handleBuyProduct(prod)}
                            className="w-full py-2 rounded-lg bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 font-bold text-xs hover:bg-cyan-500 hover:text-slate-950 transition-all flex items-center justify-center gap-1.5"
                          >
                            <span>Satın Al (AgentPay Flow)</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Payment Request Trigger Banner */}
                  {!isUser && msg.paymentRequest && (
                    <div
                      className={`p-4 rounded-xl border text-xs space-y-2 w-full ${
                        msg.paymentRequest.policyStatus === "APPROVED"
                          ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-200"
                          : msg.paymentRequest.policyStatus === "APPROVAL_REQUIRED"
                          ? "bg-amber-950/30 border-amber-500/30 text-amber-200"
                          : "bg-rose-950/30 border-rose-500/30 text-rose-200"
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold">
                        <span className="flex items-center gap-1.5">
                          <Key className="w-4 h-4" />
                          <span>
                            {msg.paymentRequest.policyStatus === "APPROVED"
                              ? "2-of-3 MPC Signature Authorized"
                              : msg.paymentRequest.policyStatus === "APPROVAL_REQUIRED"
                              ? "User Multi-Sig Approval Required"
                              : "Transaction Vetoed by Policy Shield"}
                          </span>
                        </span>
                        <StatusBadge status={msg.paymentRequest.policyStatus} size="sm" />
                      </div>

                      <div className="text-[11px] font-mono opacity-90">
                        Merchant: {msg.paymentRequest.merchantName} • Amount:{" "}
                        {formatCurrency(msg.paymentRequest.amount)} • Risk Score:{" "}
                        {msg.paymentRequest.riskScore}/100
                      </div>

                      {msg.paymentRequest.transactionId && (
                        <div className="pt-1 flex items-center gap-2">
                          <Link
                            href={`/transactions/${msg.paymentRequest.transactionId}`}
                            className="text-[11px] underline font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                          >
                            <span>Inspect Transaction Cryptographic Lifecycle</span>
                            <ExternalLink className="w-3 h-3" />
                          </Link>
                          {msg.paymentRequest.policyStatus === "APPROVAL_REQUIRED" && (
                            <Link
                              href="/approvals"
                              className="px-2.5 py-1 rounded bg-amber-500 text-slate-950 font-bold font-mono text-[11px] ml-auto hover:bg-amber-400"
                            >
                              Go to Approvals Queue →
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {isUser && (
                  <div className="w-8 h-8 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold font-mono">
                    MD
                  </div>
                )}
              </div>
            );
          })}

          {/* Typing Indicator */}
          {loading && (
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 p-2">
              <Bot className="w-4 h-4 animate-bounce" />
              <span>Agent is evaluating catalog, policy rules & MPC thresholds...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-3 sm:p-4 border-t border-surface-border bg-slate-950/60">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="AI Agent'a talimat verin (örn: 'Üniversite için maksimum 30.000 TL laptop bul')..."
              className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 font-sans"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold text-xs flex items-center gap-1.5 transition-colors shrink-0 shadow-[0_0_15px_rgba(6,182,212,0.3)]"
            >
              <Send className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Send</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
