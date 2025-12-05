"use client";

import type { Subtask } from "./types";

type SubtaskListProps = {
  subtasks: Subtask[];
  onToggle: (subtaskId: string) => void;
};

export function SubtaskList({ subtasks, onToggle }: SubtaskListProps) {
  if (subtasks.length === 0) return null;

  return (
    <div className="mt-2 space-y-1 pl-6">
      {subtasks.map((subtask) => (
        <button
          key={subtask.id}
          type="button"
          onClick={() => onToggle(subtask.id)}
          className={`flex w-full items-center gap-2 rounded-md px-2 py-1 text-xs transition-colors ${
            subtask.done
              ? "text-neutral-400 line-through dark:text-neutral-500"
              : "text-neutral-600 hover:bg-neutral-100/60 dark:text-neutral-400 dark:hover:bg-neutral-800/60"
          }`}
        >
          <div
            className={`h-3 w-3 shrink-0 rounded border ${
              subtask.done
                ? "border-green-500 bg-green-500"
                : "border-neutral-300 dark:border-neutral-600"
            }`}
          />
          <span className="text-left">{subtask.label}</span>
          {subtask.estimatedMinutes && (
            <span className="ml-auto shrink-0 text-neutral-400">
              ~{Math.round(subtask.estimatedMinutes / 60)}h
            </span>
          )}
        </button>
      ))}
    </div>
  );
}


