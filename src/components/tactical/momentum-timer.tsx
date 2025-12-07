"use client";

import type { FocusSession } from "./types";

type MomentumTimerProps = {
  focusSession: FocusSession;
  onStart: () => void;
  onStop: () => void;
  formatTime: (seconds: number) => string;
};

export function MomentumTimer({
  focusSession,
  onStart,
  onStop,
  formatTime,
}: MomentumTimerProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 py-16">
      {/* Spinning cycle animation with flame */}
      <div className="relative w-56 h-56 flex items-center justify-center">
        {/* Outer spinning ring with gradient */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 p-1 cycle-spin">
          <div className="h-full w-full rounded-full bg-white dark:bg-black" />
        </div>
        
        {/* Middle spinning flame card (the visual focus) */}
        <div className="absolute inset-4 rounded-full bg-gradient-to-b from-red-100 to-orange-50 dark:from-red-950/40 dark:to-orange-950/20 flex items-center justify-center cycle-spin">
          <div className="text-7xl animate-pulse">🔥</div>
        </div>

        {/* Inner content with timer and label */}
        <div className="relative z-10 flex flex-col items-center gap-4 text-center">
          <div className="text-5xl font-bold text-neutral-900 dark:text-neutral-100 tracking-tighter tabular-nums">
            {formatTime(focusSession.elapsedSeconds)}
          </div>
          <div className="text-lg font-semibold uppercase tracking-widest text-red-600 dark:text-red-400">
            Momentum
          </div>
        </div>
      </div>

      {/* Control buttons */}
      <div className="flex gap-4">
        {!focusSession.isRunning ? (
          <button
            onClick={onStart}
            className="px-8 py-3 rounded-full bg-red-600 text-white font-semibold hover:bg-red-700 transition-colors"
          >
            Start Momentum
          </button>
        ) : (
          <button
            onClick={onStop}
            className="px-8 py-3 rounded-full bg-neutral-300 text-neutral-900 font-semibold hover:bg-neutral-400 transition-colors dark:bg-neutral-700 dark:text-neutral-100 dark:hover:bg-neutral-600"
          >
            Stop
          </button>
        )}
      </div>

      {/* Status message */}
      {focusSession.isRunning && (
        <div className="text-center">
          <p className="text-lg font-medium text-neutral-700 dark:text-neutral-300">
            🔥 You're in the zone! Keep pushing.
          </p>
        </div>
      )}
    </div>
  );
}
