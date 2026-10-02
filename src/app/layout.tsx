import type { Metadata } from "next";
import "./globals.css";
import { DemoDisclaimerBanner } from "@/components/DemoDisclaimerBanner";
import { Navbar } from "@/components/Navbar";
import { Shield, Lock, Terminal, Heart } from "lucide-react";

export const metadata: Metadata = {
  title: "AgentPay — Give AI permission to spend, not permission to steal.",
  description:
    "AgentPay is an agentic commerce security platform prototype enabling programmable, policy-based, multi-sig spending for autonomous AI agents.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-background text-slate-100 min-h-screen flex flex-col antialiased selection:bg-cyan-500/30 selection:text-cyan-200">
        <DemoDisclaimerBanner />
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>

        <footer className="border-t border-surface-border bg-surface/40 mt-12 py-8 text-xs text-slate-400">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-cyan-400" />
              <span className="font-mono font-bold text-slate-200">AgentPay</span>
              <span>— "Give AI permission to spend, not permission to steal."</span>
            </div>

            <div className="flex items-center gap-6 font-mono text-[11px] text-slate-400">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                2-of-3 MPC Quorum
              </span>
              <span className="flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-blue-400" />
                Account Abstraction (ERC-4337 Sim)
              </span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
