"use client";

import { useMemo } from "react";
import { Calendar, TrendingUp, TrendingDown, Minus } from "lucide-react";
import type { Pillar, Stone } from "./types";

type PillarTimelineProps = {
  pillar: Pillar;
  stones: Stone[];
};

export function PillarTimeline({ pillar, stones }: PillarTimelineProps) {
  const timelineData = useMemo(() => {
    if (!pillar.estimatedCompletion || !pillar.estimatedWeeks) return null;
    
    const completedStones = stones.filter((s) => s.completed);
    const incompleteStones = stones.filter((s) => !s.completed);
    const totalStones = stones.length;
    const progress = totalStones > 0 ? (completedStones.length / totalStones) * 100 : 0;
    
    // Calculate if ahead/behind schedule
    const today = new Date();
    const daysUntilCompletion = Math.ceil(
      (pillar.estimatedCompletion.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    const expectedDays = (pillar.estimatedWeeks || 0) * 7;
    const daysDifference = expectedDays - daysUntilCompletion;
    
    // Group stones by scheduled week
    const stonesByWeek = stones
      .filter((s) => s.scheduledWeek)
      .reduce((acc, stone) => {
        const week = stone.scheduledWeek || 1;
        if (!acc[week]) acc[week] = [];
        acc[week].push(stone);
        return acc;
      }, {} as Record<number, Stone[]>);
    
    return {
      completionDate: pillar.estimatedCompletion,
      estimatedWeeks: pillar.estimatedWeeks,
      progress,
      daysUntilCompletion,
      daysDifference,
      stonesByWeek,
      completedStones,
      incompleteStones,
    };
  }, [pillar, stones]);

  if (!timelineData) return null;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getVelocityStatus = () => {
    if (timelineData.daysDifference > 3) {
      return { icon: TrendingUp, text: `${Math.round(timelineData.daysDifference)} days ahead`, color: "text-green-600 dark:text-green-400" };
    } else if (timelineData.daysDifference < -3) {
      return { icon: TrendingDown, text: `${Math.abs(Math.round(timelineData.daysDifference))} days behind`, color: "text-orange-600 dark:text-orange-400" };
    }
    return { icon: Minus, text: "On track", color: "text-blue-600 dark:text-blue-400" };
  };

  const velocity = getVelocityStatus();
  const VelocityIcon = velocity.icon;

  return (
    <div className="mb-6 space-y-4">
      {/* ETA Header */}
      <div className="flex items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50/50 p-4 dark:border-neutral-800 dark:bg-neutral-900/30">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
          <div>
            <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
              🎯 {formatDate(timelineData.completionDate)}
            </div>
            <div className="text-xs text-neutral-500 dark:text-neutral-400">
              {timelineData.estimatedWeeks} weeks estimated
            </div>
          </div>
        </div>
        <div className={`flex items-center gap-1.5 text-xs font-medium ${velocity.color}`}>
          <VelocityIcon className="h-4 w-4" />
          <span>{velocity.text}</span>
        </div>
      </div>

      {/* Timeline Pillar */}
      <div className="relative">
        <div className="flex flex-col gap-2">
          {/* Completion Block (Top) */}
          <div className="rounded-lg border-2 border-green-500/50 bg-green-50/50 p-3 text-center dark:border-green-500/30 dark:bg-green-900/10">
            <div className="text-sm font-semibold text-green-700 dark:text-green-400">
              🎯 Complete by {formatDate(timelineData.completionDate)}
            </div>
            <div className="text-xs text-green-600 dark:text-green-500">
              {timelineData.estimatedWeeks} weeks total
            </div>
          </div>

          {/* Milestone Blocks */}
          {Object.entries(timelineData.stonesByWeek)
            .sort(([a], [b]) => Number(b) - Number(a))
            .map(([week, weekStones]) => {
              const isCompleted = weekStones.every((s) => s.completed);
              const isCurrent = weekStones.some((s) => !s.completed && !stones.find((st) => st.scheduledWeek && st.scheduledWeek < Number(week) && !st.completed));
              
              return (
                <div
                  key={week}
                  className={`rounded-lg border p-3 ${
                    isCompleted
                      ? "border-green-500/50 bg-green-50/50 dark:border-green-500/30 dark:bg-green-900/10"
                      : isCurrent
                      ? "border-blue-500/50 bg-blue-50/50 dark:border-blue-500/30 dark:bg-blue-900/10"
                      : "border-neutral-200 bg-white dark:border-neutral-800 dark:bg-neutral-950/50"
                  }`}
                >
                  <div className="mb-1 flex items-center justify-between">
                    <div className="text-xs font-medium text-neutral-500 dark:text-neutral-400">
                      Week {week}
                    </div>
                    {isCompleted && (
                      <span className="text-xs font-medium text-green-600 dark:text-green-400">✓ Done</span>
                    )}
                  </div>
                  {weekStones.map((stone) => (
                    <div
                      key={stone.id}
                      className={`text-sm ${
                        isCompleted
                          ? "text-green-700 line-through dark:text-green-400"
                          : "text-neutral-900 dark:text-neutral-100"
                      }`}
                    >
                      {stone.name}
                    </div>
                  ))}
                </div>
              );
            })}

          {/* Foundation Block (Bottom) */}
          <div className="rounded-lg border-2 border-neutral-300 bg-neutral-100 p-3 text-center dark:border-neutral-700 dark:bg-neutral-900">
            <div className="text-sm font-semibold text-neutral-900 dark:text-neutral-100">
              🏗️ {pillar.name}
            </div>
            {pillar.winDefinition && (
              <div className="mt-1 text-xs text-neutral-600 dark:text-neutral-400">
                {pillar.winDefinition}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
          <span>Progress</span>
          <span className="font-medium">
            {timelineData.completedStones.length} / {stones.length} milestones
          </span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-neutral-200 dark:bg-neutral-800">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
            style={{ width: `${timelineData.progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}

