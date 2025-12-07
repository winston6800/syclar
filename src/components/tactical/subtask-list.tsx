"use client";

import type { Subtask } from "./types";

type SubtaskListProps = {
  subtasks: Subtask[];
  onToggle: (subtaskId: string) => void;
  onRemove?: (subtaskId: string) => void;
  focusedSubtaskId?: string; // ID of currently focused subtask (during focus session)
};

export function SubtaskList({ subtasks, onToggle, onRemove, focusedSubtaskId }: SubtaskListProps) {
  if (subtasks.length === 0) return null;

  return (
    <div className="mt-2 space-y-1 pl-6">
      {subtasks.map((subtask) => (
        <div 
          key={subtask.id} 
          className={`flex items-center gap-2 rounded-md px-2 py-1 text-xs transition-all ${
            focusedSubtaskId === subtask.id 
              ? "subtask-focused border-2 border-red-500 bg-red-50 dark:bg-red-950/20 dark:border-red-600"
              : ""
          }`}
        >
          <button
            type="button"
            onClick={() => onToggle(subtask.id)}
            className={`flex items-center gap-2 transition-colors ${
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
          </button>
          {subtask.estimatedMinutes && (
            <span className="ml-auto shrink-0 text-neutral-400">
              ~{Math.round(subtask.estimatedMinutes / 60)}h
            </span>
          )}
          {typeof onRemove === "function" && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove(subtask.id);
              }}
              aria-label="Remove subtask"
              className="ml-2 rounded p-1 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
            >
              ×
            </button>
          )}
        </div>
      ))}
    </div>
  );
}


