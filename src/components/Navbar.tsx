"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Shield,
  Bot,
  Sliders,
  CheckSquare,
  ShieldAlert,
  FileText,
  Wallet,
  LayoutDashboard,
  Lock,
  Unlock,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export function Navbar() {
  let pathname = "/";
  try {
    const p = usePathname();
    if (p) pathname = p;
  } catch (e) {
    pathname = "/";
  }
  const [walletData, setWalletData] = useState<{
    balance: number;
    isFrozen: boolean;
    pendingApprovalsCount: number;
  }>({
    balance: 10000,
    isFrozen: false,
    pendingApprovalsCount: 1,
  });

  const fetchWallet = async () => {
    try {
      const res = await fetch("/api/wallet");
      if (res.ok) {
        const data = await res.json();
        setWalletData({
          balance: data.wallet.balance,
          isFrozen: data.wallet.isFrozen,
          pendingApprovalsCount: data.wallet.pendingApprovalsCount,
        });
      }
    } catch (e) {
      // ignore
    }
  };

  useEffect(() => {
    fetchWallet();
    const interval = setInterval(fetchWallet, 4000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: "/dashboard", label: "Dashboard", icon: <LayoutDashboard className="w-4 h-4" /> },
    { href: "/agent", label: "AI Agent", icon: <Bot className="w-4 h-4" />, highlight: true },
    { href: "/policies", label: "Policies", icon: <Sliders className="w-4 h-4" /> },
    {
      href: "/approvals",
      label: "Approvals",
      icon: <CheckSquare className="w-4 h-4" />,
      badge: walletData.pendingApprovalsCount > 0 ? walletData.pendingApprovalsCount : undefined,
    },
    { href: "/security", label: "Security Center", icon: <ShieldAlert className="w-4 h-4" /> },
    { href: "/audit", label: "Audit Log", icon: <FileText className="w-4 h-4" /> },
    { href: "/wallet", label: "Smart Wallet", icon: <Wallet className="w-4 h-4" /> },
  ];

  return (
    <header className="border-b border-surface-border bg-surface/90 backdrop-blur-xl sticky top-[33px] z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-0.5 flex items-center justify-center shadow-[0_0_15px_rgba(6,182,212,0.4)] group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Shield className="w-5 h-5 text-cyan-400" />
            </div>
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-slate-100 flex items-center gap-1.5 font-mono">
              Agent<span className="text-cyan-400">Pay</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800/60 font-sans uppercase">
                v1.0
              </span>
            </span>
            <div className="text-[10px] text-slate-400 font-mono hidden sm:block">
              Spend Permission Sentinel
            </div>
          </div>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden lg:flex items-center gap-1">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || (link.href !== "/dashboard" && pathname.startsWith(link.href));
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all relative",
                  isActive
                    ? "bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/60"
                )}
              >
                {link.icon}
                <span>{link.label}</span>
                {link.badge && (
                  <span className="w-4 h-4 rounded-full bg-amber-500 text-slate-950 font-mono text-[10px] font-bold flex items-center justify-center animate-pulse">
                    {link.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Status & Wallet */}
        <div className="flex items-center gap-3">
          {/* Emergency Freeze Badge */}
          {walletData.isFrozen ? (
            <Link
              href="/wallet"
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/15 border border-rose-500/40 text-rose-300 font-mono text-xs font-semibold shadow-[0_0_12px_rgba(244,63,94,0.3)] animate-pulse"
            >
              <Lock className="w-3.5 h-3.5 text-rose-400" />
              <span>FROZEN</span>
            </Link>
          ) : (
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              <span>Shield Active</span>
            </div>
          )}

          {/* Wallet Balance Capsule */}
          <Link
            href="/wallet"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-700/80 hover:border-cyan-500/50 transition-colors"
          >
            <div className="text-right">
              <div className="text-[10px] font-mono text-slate-400">Sandbox Balance</div>
              <div className="text-xs font-bold font-mono text-cyan-300">
                {formatCurrency(walletData.balance)}
              </div>
            </div>
          </Link>

          {/* User Profile Capsule */}
          <div className="flex items-center gap-2 pl-2 border-l border-surface-border">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 p-0.5">
              <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-xs font-bold text-cyan-300">
                MD
              </div>
            </div>
            <div className="hidden xl:block text-left">
              <div className="text-xs font-semibold text-slate-200 leading-none">Melike Demo</div>
              <div className="text-[10px] text-slate-400 font-mono">Demo Admin</div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sub-Navigation */}
      <div className="lg:hidden border-t border-surface-border/60 px-2 py-1.5 flex items-center gap-1 overflow-x-auto">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "px-2.5 py-1 rounded-md text-[11px] font-medium flex items-center gap-1 whitespace-nowrap",
                isActive
                  ? "bg-cyan-500/15 text-cyan-300 border border-cyan-500/30"
                  : "text-slate-400 hover:text-slate-200"
              )}
            >
              {link.icon}
              <span>{link.label}</span>
              {link.badge && (
                <span className="px-1 py-0.2 rounded-full bg-amber-500 text-slate-950 font-mono text-[9px] font-bold">
                  {link.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>
    </header>
  );
}
