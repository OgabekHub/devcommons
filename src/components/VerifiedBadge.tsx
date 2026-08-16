import React from "react";
import { ShieldCheck } from "lucide-react";

interface VerifiedBadgeProps {
  isVerified?: boolean;
}

export default function VerifiedBadge({ isVerified }: VerifiedBadgeProps) {
  if (!isVerified) return null;

  return (
    <span
      className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400 shadow-sm"
      title="Verified High-Quality Resource"
    >
      <ShieldCheck className="h-3 w-3" />
      VERIFIED
    </span>
  );
}
