import React from "react";
import { CheckCircle2, AlertTriangle, XCircle, Clock, ShieldX, Ban } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  size?: "sm" | "md" | "lg";
  showIcon?: boolean;
}

export function StatusBadge({ status, size = "md", showIcon = true }: StatusBadgeProps) {
  const norm = status?.toUpperCase() || "PENDING";

  let bg = "bg-slate-800/80 text-slate-300 border-slate-700";
  let icon = <Clock className="w-3.5 h-3.5" />;
  let label = status;

  if (norm === "COMPLETED" || norm === "APPROVED" || norm === "SUCCESS") {
    bg = "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-[0_0_12px_rgba(16,185,129,0.15)]";
    icon = <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
    label = norm === "COMPLETED" ? "Completed" : "Approved";
  } else if (norm === "APPROVAL_REQUIRED" || norm === "PENDING" || norm === "WARNING") {
    bg = "bg-amber-500/10 text-amber-400 border-amber-500/30 shadow-[0_0_12px_rgba(245,158,11,0.15)]";
    icon = <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />;
    label = norm === "APPROVAL_REQUIRED" ? "Approval Required" : "Pending";
  } else if (norm === "REJECTED" || norm === "FAILED" || norm === "ERROR") {
    bg = "bg-rose-500/10 text-rose-400 border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.15)]";
    icon = <XCircle className="w-3.5 h-3.5 text-rose-400" />;
    label = norm === "REJECTED" ? "Rejected" : "Failed";
  } else if (norm === "BLOCKED" || norm === "POLICY_VIOLATION") {
    bg = "bg-purple-500/10 text-purple-300 border-purple-500/30 shadow-[0_0_12px_rgba(168,85,247,0.15)]";
    icon = <ShieldX className="w-3.5 h-3.5 text-purple-400" />;
    label = "Policy Blocked";
  }

  const sizeClasses = {
    sm: "text-[10px] px-2 py-0.5 gap-1",
    md: "text-xs px-2.5 py-1 gap-1.5",
    lg: "text-sm px-3.5 py-1.5 gap-2",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border transition-all",
        sizeClasses[size],
        bg
      )}
    >
      {showIcon && icon}
      <span>{label}</span>
    </span>
  );
}
