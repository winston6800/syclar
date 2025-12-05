"use client";

import { Trophy, AlertTriangle, Shield } from "lucide-react";
import type { HeroRank } from "@/lib/hero-rank";
import { getRankUpInfo } from "@/lib/hero-rank";

type HeroRankDisplayProps = {
  currentRank: HeroRank;
  rankString: string;
  isUnproductive: boolean;
  timeOnUnproductiveSite: number;
  isProtected?: boolean;
};

export function HeroRankDisplay({
  currentRank,
  rankString,
  isUnproductive,
  timeOnUnproductiveSite,
  isProtected = false,
}: HeroRankDisplayProps) {
  const rankUpInfo = getRankUpInfo(currentRank);

  return (
    <div
      className={`group relative overflow-hidden rounded-3xl border transition-all duration-300 ${
        isProtected
          ? "border-blue-200 bg-gradient-to-br from-blue-50/90 to-blue-100/50 shadow-lg shadow-blue-100/50 dark:border-blue-900/50 dark:from-blue-950/90 dark:to-blue-900/50 dark:shadow-blue-900/20"
          : isUnproductive
          ? "border-red-200 bg-gradient-to-br from-red-50/90 to-red-100/50 shadow-lg shadow-red-100/50 dark:border-red-900/50 dark:from-red-950/90 dark:to-red-900/50 dark:shadow-red-900/20"
          : "border-neutral-200/80 bg-white/70 backdrop-blur-2xl dark:border-neutral-800/80 dark:bg-neutral-900/70"
      }`}
    >
      {/* Subtle gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${
        isProtected 
          ? "from-blue-100/30 to-transparent dark:from-blue-900/10"
          : isUnproductive
          ? "from-red-100/30 to-transparent dark:from-red-900/10"
          : "from-white/40 to-transparent dark:from-neutral-800/20"
      }`} />
      <div className="relative px-6 py-5">
        <div className="mb-3 flex items-center gap-2">
          <div className={`rounded-xl p-1.5 transition-colors ${
            isProtected
              ? "bg-blue-100 dark:bg-blue-900/30"
              : isUnproductive
              ? "bg-red-100 dark:bg-red-900/30"
              : "bg-neutral-100 dark:bg-neutral-800"
          }`}>
            <Trophy
              className={`h-3.5 w-3.5 ${
                isProtected
                  ? "text-blue-600 dark:text-blue-400"
                  : isUnproductive
                  ? "text-red-600 dark:text-red-400"
                  : "text-neutral-500 dark:text-neutral-400"
              }`}
            />
          </div>
          <div className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500 dark:text-neutral-400">
            Hero Rank
          </div>
          {isProtected && (
            <div className="ml-auto flex items-center gap-1 rounded-full bg-blue-100 px-2 py-0.5 dark:bg-blue-900/30">
              <Shield className="h-3 w-3 text-blue-600 dark:text-blue-400" />
              <span className="text-[10px] font-medium text-blue-700 dark:text-blue-300">Protected</span>
            </div>
          )}
        </div>
        <div className="mb-2">
          <div
            className={`text-3xl font-semibold tracking-tight ${
              isProtected
                ? "text-blue-700 dark:text-blue-300"
                : isUnproductive
                ? "text-red-700 dark:text-red-300"
                : "text-neutral-900 dark:text-neutral-100"
            }`}
          >
            {rankString}
          </div>
        </div>
        <div className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
          Points: <span className="font-semibold text-neutral-700 dark:text-neutral-300">{currentRank.points}</span>
        </div>
        {isUnproductive && timeOnUnproductiveSite > 0 && (
        <div className={`mt-3 flex items-center gap-2 rounded-xl px-3 py-2 text-[11px] font-medium ${
          isProtected
            ? "bg-blue-100/60 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
            : "bg-red-100/60 dark:bg-red-900/20 text-red-700 dark:text-red-300"
        }`}>
          {isProtected ? (
            <Shield className="h-3.5 w-3.5" />
          ) : (
            <AlertTriangle className="h-3.5 w-3.5" />
          )}
          <span>
            {Math.floor(timeOnUnproductiveSite / 60)}m on unproductive site
            {isProtected && " (protected by allowance)"}
          </span>
        </div>
        )}
        {rankUpInfo.nextRank && (
        <div className="mt-3 space-y-2">
          {rankUpInfo.canRankUp ? (
            <div className="rounded-xl bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-2 text-[11px] font-semibold text-green-700 dark:from-green-900/30 dark:to-emerald-900/30 dark:text-green-300">
              ⬆ Rank up available! Next: {rankUpInfo.nextRank.class} class Rank #{rankUpInfo.nextRank.number}
            </div>
          ) : (
            <div className="rounded-lg bg-neutral-50 px-3 py-2 dark:bg-neutral-950/50">
              <div className="text-[11px] font-medium text-neutral-600 dark:text-neutral-400">
                {rankUpInfo.pointsNeeded > 0 && (
                  <span>Need <span className="font-semibold text-neutral-700 dark:text-neutral-300">{rankUpInfo.pointsNeeded}</span> more points to rank up</span>
                )}
              </div>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}


