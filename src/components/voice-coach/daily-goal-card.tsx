"use client";

import { Clock, CheckCircle2 } from "lucide-react";
import type { DailyGoal } from "./types";

type DailyGoalCardProps = {
  goal: DailyGoal | null;
  timer: number;
  isTimerRunning: boolean;
  goalCompleted: boolean;
  formatTime: (seconds: number) => string;
};

export function DailyGoalCard({
  goal,
  timer,
  isTimerRunning,
  goalCompleted,
  formatTime,
}: DailyGoalCardProps) {
  if (!goal) return null;

  return (
    <div className="mb-12 rounded-3xl bg-white/80 p-8 backdrop-blur-xl transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-black/5 dark:bg-neutral-900/80 dark:hover:bg-neutral-900 dark:hover:shadow-black/50">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
          Daily Goal
        </h2>
        {isTimerRunning && (
          <div className="flex items-center gap-2 rounded-full bg-red-50 px-4 py-2 dark:bg-red-900/20">
            <Clock className="w-4 h-4 text-red-600 dark:text-red-400" />
            <span className="text-lg font-mono font-semibold text-red-600 dark:text-red-400">
              {formatTime(timer)}
            </span>
          </div>
        )}
        {goalCompleted && (
          <div className="flex items-center gap-2 rounded-full bg-green-50 px-4 py-2 dark:bg-green-900/20">
            <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-600 dark:text-green-400">
              Done
            </span>
          </div>
        )}
      </div>
      <p className="text-lg leading-relaxed text-neutral-700 dark:text-neutral-300">
        {goal.description}
      </p>
      {!goalCompleted && (
        <p className="mt-4 text-sm text-neutral-500 dark:text-neutral-400">
          Estimated: {goal.estimatedMinutes} minutes • Get it done ASAP!
        </p>
      )}
    </div>
  );
}


