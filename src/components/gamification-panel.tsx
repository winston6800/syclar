"use client";

import { useEffect, useState } from "react";
import { Trophy, TrendingUp, Zap, Award } from "lucide-react";
import { getUserStats, initializeUserStats } from "@/lib/stats";
import type { UserStats, UserComparison } from "@/lib/stats";
import { getRarityLabel } from "@/lib/trophies";

type TrophyData = {
  id: string;
  name: string;
  description: string;
  rarity: number;
  icon: string;
};

export function GamificationPanel() {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [comparison, setComparison] = useState<UserComparison | null>(null);
  const [trophies, setTrophies] = useState<TrophyData[]>([]);
  const [totalTrophies, setTotalTrophies] = useState(15);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      const userStats = getUserStats() || initializeUserStats();
      setStats(userStats);

      // Get comparison
      try {
        const compRes = await fetch("/api/stats/comparison", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ stats: userStats }),
        });
        const compData = await compRes.json();
        if (compData.success) {
          setComparison(compData.comparison);
        }
      } catch (error) {
        console.error("Failed to load comparison:", error);
      }

      // Get trophies — DISABLED: expensive API call, feature not used
      // try {
      //   const trophyRes = await fetch("/api/stats/trophies", {
      //     method: "POST",
      //     headers: { "Content-Type": "application/json" },
      //     body: JSON.stringify({ stats: userStats }),
      //   });
      //   const trophyData = await trophyRes.json();
      //   if (trophyData.success) {
      //     setTrophies(trophyData.trophies);
      //     setTotalTrophies(trophyData.totalTrophies || 15);
      //   }
      // } catch (error) {
      //   console.error("Failed to load trophies:", error);
      // }

      setIsLoading(false);
    };

    loadStats();
    
    // Refresh every 30 seconds
    const interval = setInterval(loadStats, 30000);
    return () => clearInterval(interval);
  }, []);

  if (isLoading || !stats) {
    return (
      <div className="rounded-2xl border border-neutral-200 bg-white/80 p-6 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="text-sm text-neutral-500">Loading stats...</div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Cycle Stats */}
      <div className="rounded-2xl border border-neutral-200 bg-white/80 p-6 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="mb-4 flex items-center gap-2">
          <Zap className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Your Cycles
          </h3>
        </div>
        <div className="mb-4">
          <div className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
            {stats.totalCycles}
          </div>
          <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Total cycles completed
          </div>
        </div>
        {comparison && (
          <div className="space-y-2 rounded-lg bg-neutral-50/50 p-3 dark:bg-neutral-950/50">
            {comparison.cyclesAboveAvg > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
                <span className="text-neutral-700 dark:text-neutral-300">
                  <span className="font-semibold">{comparison.cyclesAboveAvg}</span> more cycles than average user
                </span>
              </div>
            )}
            {comparison.cyclesAboveMedian > 0 && (
              <div className="flex items-center gap-2 text-xs">
                <TrendingUp className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                <span className="text-neutral-700 dark:text-neutral-300">
                  <span className="font-semibold">{comparison.cyclesAboveMedian}</span> more cycles than median user
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-xs">
              <Award className="h-3 w-3 text-purple-600 dark:text-purple-400" />
              <span className="text-neutral-700 dark:text-neutral-300">
                Top <span className="font-semibold">{100 - comparison.percentileRank}%</span> of users
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Focus Stats */}
      <div className="rounded-2xl border border-neutral-200 bg-white/80 p-6 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="mb-4 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Focus Time
          </h3>
        </div>
        <div className="mb-4">
          <div className="text-3xl font-semibold text-neutral-900 dark:text-neutral-100">
            {Math.floor(stats.totalFocusMinutes / 60)}h {stats.totalFocusMinutes % 60}m
          </div>
          <div className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">
            Total focus time
          </div>
        </div>
        {comparison && comparison.focusAboveAvg > 0 && (
          <div className="rounded-lg bg-neutral-50/50 p-3 dark:bg-neutral-950/50">
            <div className="flex items-center gap-2 text-xs">
              <TrendingUp className="h-3 w-3 text-green-600 dark:text-green-400" />
              <span className="text-neutral-700 dark:text-neutral-300">
                <span className="font-semibold">{comparison.focusAboveAvg.toFixed(1)}%</span> more focused than average user
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Trophies */}
      <div className="rounded-2xl border border-neutral-200 bg-white/80 p-6 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/80">
        <div className="mb-4 flex items-center gap-2">
          <Trophy className="h-4 w-4 text-neutral-500 dark:text-neutral-400" />
          <h3 className="text-sm font-semibold uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
            Trophies ({trophies.length}/{totalTrophies})
          </h3>
        </div>
        {trophies.length === 0 ? (
          <div className="text-center py-8">
            <Trophy className="mx-auto h-12 w-12 text-neutral-300 dark:text-neutral-700 mb-2" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              Complete cycles to unlock trophies
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {trophies.map((trophy) => (
              <div
                key={trophy.id}
                className="rounded-lg border border-neutral-200 bg-neutral-50/50 p-3 dark:border-neutral-800 dark:bg-neutral-950/50"
              >
                <div className="mb-2 flex items-center gap-2">
                  <span className="text-2xl">{trophy.icon}</span>
                  <div className="flex-1">
                    <div className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                      {trophy.name}
                    </div>
                    <div className="text-[10px] text-neutral-500 dark:text-neutral-400">
                      {getRarityLabel(trophy.rarity)}
                    </div>
                  </div>
                </div>
                <p className="text-[10px] text-neutral-600 dark:text-neutral-400">
                  {trophy.description}
                </p>
                <div className="mt-2 text-[10px] font-medium text-purple-600 dark:text-purple-400">
                  Only {trophy.rarity}% have this
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

