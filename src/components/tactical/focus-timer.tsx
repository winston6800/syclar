"use client";

import { Clock, Play, Pause, Square } from "lucide-react";
import type { FocusSession } from "./types";

type FocusTimerProps = {
  focusSession: FocusSession;
  isFocused: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onStop: () => void;
  formatTime: (seconds: number) => string;
};

export function FocusTimer({
  focusSession,
  isFocused,
  onStart,
  onPause,
  onResume,
  onStop,
  formatTime,
}: FocusTimerProps) {
  const isFocusedAndRunning = isFocused && focusSession.isRunning;

  return (
    <div className="flex items-center gap-2">
      {isFocusedAndRunning && (
        <div className="flex items-center gap-2 rounded-full bg-green-500 px-3 py-1.5 text-xs font-medium text-white">
          <Clock className="h-3 w-3" />
          <span>{formatTime(focusSession.elapsedSeconds)}</span>
        </div>
      )}
      {!isFocused ? (
        <button
          type="button"
          onClick={onStart}
          className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          <Play className="h-3 w-3" />
          Focus
        </button>
      ) : isFocusedAndRunning ? (
        <>
          <button
            type="button"
            onClick={onPause}
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white px-3 py-2 text-xs font-medium text-neutral-800 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100 dark:hover:bg-neutral-900"
          >
            <Pause className="h-3 w-3" />
          </button>
          <button
            type="button"
            onClick={onStop}
            className="inline-flex items-center gap-2 rounded-full bg-green-500 px-4 py-2 text-xs font-medium text-white hover:bg-green-600"
          >
            <Square className="h-3 w-3" />
            Log Time
          </button>
        </>
      ) : (
        <button
          type="button"
          onClick={onResume}
          className="inline-flex items-center gap-2 rounded-full bg-neutral-900 px-4 py-2 text-xs font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          <Play className="h-3 w-3" />
          Resume
        </button>
      )}
    </div>
  );
}


