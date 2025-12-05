"use client";

import { Shield, Coins } from "lucide-react";

type AllowanceDisplayProps = {
  allowance: number;
  goodwill: number;
  isProtected?: boolean;
};

export function AllowanceDisplay({ allowance, goodwill, isProtected = false }: AllowanceDisplayProps) {
  return (
    <div className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 ${
      isProtected 
        ? "border-blue-200 bg-gradient-to-br from-blue-50/90 to-blue-100/50 shadow-lg shadow-blue-100/50 dark:border-blue-900/50 dark:from-blue-950/90 dark:to-blue-900/50 dark:shadow-blue-900/20" 
        : "border-neutral-200/80 bg-white/70 backdrop-blur-2xl dark:border-neutral-800/80 dark:bg-neutral-900/70"
    }`}>
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent dark:from-neutral-800/20" />
      
      <div className="relative px-6 py-5">
        {/* Header */}
        <div className="mb-3 flex items-center gap-2">
          <div className={`rounded-xl p-1.5 transition-colors ${
            isProtected 
              ? "bg-blue-100 dark:bg-blue-900/30" 
              : "bg-neutral-100 dark:bg-neutral-800"
          }`}>
            <Coins className={`h-3.5 w-3.5 ${
              isProtected 
                ? "text-blue-600 dark:text-blue-400" 
                : "text-neutral-500 dark:text-neutral-400"
            }`} />
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Allowance
          </div>
          {isProtected && (
            <div className="ml-auto flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 dark:bg-blue-900/30">
              <Shield className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              <span className="text-[10px] font-medium text-blue-700 dark:text-blue-300">Protected</span>
            </div>
          )}
        </div>

        {/* Amount */}
        <div className="mb-2">
          <div className={`text-4xl font-semibold tracking-tight ${
            isProtected 
              ? "text-blue-700 dark:text-blue-300" 
              : "text-neutral-900 dark:text-neutral-100"
          }`}>
            {allowance.toFixed(2)}
          </div>
        </div>

        {/* Goodwill */}
        <div className="flex items-center gap-2">
          <div className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
            Goodwill
          </div>
          <div className={`text-sm font-semibold ${
            isProtected 
              ? "text-blue-600 dark:text-blue-400" 
              : "text-neutral-700 dark:text-neutral-300"
          }`}>
            {goodwill}
          </div>
        </div>

        {/* Protection indicator */}
        {isProtected && (
          <div className="mt-3 rounded-xl bg-blue-100/60 px-3 py-2 dark:bg-blue-900/20">
            <div className="flex items-center gap-2">
              <Shield className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
              <p className="text-[11px] font-medium text-blue-700 dark:text-blue-300">
                Spending allowance to protect rank
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


