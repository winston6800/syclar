"use client";

import { CheckCircle2, Clock, Wand2, Loader2, X, Plus } from "lucide-react";
import { useState, useMemo } from "react";
import type { Task, FocusSession } from "./types";
import { FocusTimer } from "./focus-timer";
import { SubtaskList } from "./subtask-list";

type TaskItemProps = {
  task: Task;
  focusSession: FocusSession;
  isBreakingDown: boolean;
  onToggleComplete: () => void;
  onStartFocus: () => void;
  onPauseFocus: () => void;
  onResumeFocus: () => void;
  onStopFocus: () => void;
  onRemove: () => void;
  onBreakDown: () => void;
  onToggleSubtask: (subtaskId: string) => void;
  onAddSubtask: (subtaskLabel: string) => void;
  formatTime: (seconds: number) => string;
  formatMinutes: (minutes: number) => string;
};

export function TaskItem({
  task,
  focusSession,
  isBreakingDown,
  onToggleComplete,
  onStartFocus,
  onPauseFocus,
  onResumeFocus,
  onStopFocus,
  onRemove,
  onBreakDown,
  onToggleSubtask,
  onAddSubtask,
  formatTime,
  formatMinutes,
}: TaskItemProps) {
  const isFocused = focusSession.taskId === task.id;
  const isFocusedAndRunning = isFocused && focusSession.isRunning;
  const [isAddingSubtask, setIsAddingSubtask] = useState(false);
  const [newSubtaskLabel, setNewSubtaskLabel] = useState("");

  // Calculate remaining estimated time from incomplete subtasks
  const remainingEstimatedTime = useMemo(() => {
    if (task.subtasks.length === 0) return null;
    
    // Sum up estimated minutes from incomplete subtasks only
    const incompleteSubtasks = task.subtasks.filter(s => !s.done);
    const remainingEstimatedMinutes = incompleteSubtasks.reduce((sum, s) => {
      return sum + (s.estimatedMinutes || 0);
    }, 0);
    
    return remainingEstimatedMinutes > 0 ? remainingEstimatedMinutes : null;
  }, [task.subtasks]);

  // Calculate ETA (estimated time of arrival)
  const estimatedCompletionTime = useMemo(() => {
    if (!isFocusedAndRunning || !remainingEstimatedTime) return null;
    
    // Calculate time spent in current session
    const currentSessionMinutes = focusSession.elapsedSeconds / 60;
    
    // Remaining time = remaining estimated time from incomplete subtasks
    // minus time already spent in current session
    // (task.timeSpent from previous sessions is already accounted for
    // since we only count incomplete subtasks)
    const remainingMinutes = remainingEstimatedTime - currentSessionMinutes;
    
    if (remainingMinutes <= 0) return null;
    
    // Calculate completion time from now
    const now = new Date();
    const completionTime = new Date(now.getTime() + remainingMinutes * 60 * 1000);
    
    return completionTime;
  }, [isFocusedAndRunning, remainingEstimatedTime, focusSession.elapsedSeconds]);

  // Format time to completion
  const formatTimeToCompletion = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;
    return `${displayHours}:${minutes.toString().padStart(2, '0')} ${ampm}`;
  };

  const handleTaskClick = (e: React.MouseEvent) => {
    // Don't trigger if clicking on interactive elements
    const target = e.target as HTMLElement;
    if (
      target.closest("button") ||
      target.closest("input") ||
      target.closest(".focus-timer")
    ) {
      return;
    }
    
    if (!task.completed && !isFocused) {
      onStartFocus();
    }
  };

  const handleAddSubtask = () => {
    const trimmed = newSubtaskLabel.trim();
    if (trimmed) {
      onAddSubtask(trimmed);
      setNewSubtaskLabel("");
      setIsAddingSubtask(false);
    }
  };

  return (
    <div
      onClick={handleTaskClick}
      className={`rounded-lg border transition-all cursor-pointer ${
        isFocusedAndRunning
          ? "border-green-500/60 bg-green-50/40 dark:border-green-500/40 dark:bg-green-900/8"
          : task.completed
            ? "border-neutral-200/50 bg-neutral-50/30 dark:border-neutral-800/50 dark:bg-neutral-950/30 opacity-60"
            : "border-neutral-200/60 bg-white/60 dark:border-neutral-800/60 dark:bg-neutral-900/60 hover:border-neutral-300/80 hover:bg-white/80 dark:hover:border-neutral-700/80 dark:hover:bg-neutral-900/80"
      } ${task.completed ? "cursor-default" : ""}`}
    >
      {/* Task header */}
      <div className="flex items-start gap-2.5 p-3">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleComplete();
          }}
          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
            task.completed
              ? "border-green-500 bg-green-500"
              : "border-neutral-300 dark:border-neutral-600"
          }`}
        >
          {task.completed && <CheckCircle2 className="h-2.5 w-2.5 text-white" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h3
                className={`text-sm font-medium ${
                  task.completed
                    ? "text-neutral-400 line-through dark:text-neutral-500"
                    : "text-neutral-900 dark:text-neutral-100"
                }`}
              >
                {task.label}
              </h3>
              <div className="mt-0.5 flex flex-col gap-1">
                {task.timeSpent > 0 && (
                  <div className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400">
                    <Clock className="h-3 w-3" />
                    <span>{formatMinutes(task.timeSpent)}</span>
                  </div>
                )}
                {estimatedCompletionTime && (
                  <div className="flex items-center gap-1.5 text-xs font-medium text-green-600 dark:text-green-400">
                    <Clock className="h-3 w-3" />
                    <span>ETA: {formatTimeToCompletion(estimatedCompletionTime)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Focus timer controls */}
            <div className="flex items-center gap-1.5 focus-timer" onClick={(e) => e.stopPropagation()}>
              <FocusTimer
                focusSession={focusSession}
                isFocused={isFocused}
                onStart={onStartFocus}
                onPause={onPauseFocus}
                onResume={onResumeFocus}
                onStop={onStopFocus}
                formatTime={formatTime}
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                className="text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>

          {/* Subtasks */}
          {task.subtasks.length > 0 && (
            <div className="mt-2" onClick={(e) => e.stopPropagation()}>
              <SubtaskList
                subtasks={task.subtasks}
                onToggle={onToggleSubtask}
              />
            </div>
          )}

          {/* Add subtask input */}
          {!task.completed && (isAddingSubtask || task.subtasks.length > 0) && (
            <div className="mt-2 pl-6" onClick={(e) => e.stopPropagation()}>
              {isAddingSubtask ? (
                <div className="flex gap-1.5">
                  <input
                    type="text"
                    value={newSubtaskLabel}
                    onChange={(e) => setNewSubtaskLabel(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddSubtask();
                      } else if (e.key === "Escape") {
                        setIsAddingSubtask(false);
                        setNewSubtaskLabel("");
                      }
                    }}
                    placeholder="Add subtask..."
                    autoFocus
                    className="flex-1 rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-0 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-100"
                  />
                  <button
                    type="button"
                    onClick={handleAddSubtask}
                    className="rounded-md bg-neutral-900 px-2 py-1 text-xs text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIsAddingSubtask(false);
                      setNewSubtaskLabel("");
                    }}
                    className="rounded-md border border-neutral-200 bg-white px-2 py-1 text-xs text-neutral-700 hover:bg-neutral-100 dark:border-neutral-700 dark:bg-neutral-950 dark:text-neutral-300 dark:hover:bg-neutral-900"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsAddingSubtask(true)}
                  className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-200"
                >
                  <Plus className="h-3 w-3" />
                  Add subtask
                </button>
              )}
            </div>
          )}

          {/* AI breakdown button */}
          {!task.completed && task.subtasks.length === 0 && !isAddingSubtask && (
            <div className="mt-2 pl-6" onClick={(e) => e.stopPropagation()}>
              <button
                type="button"
                onClick={onBreakDown}
                disabled={isBreakingDown}
                className="inline-flex items-center gap-1.5 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-medium text-neutral-700 hover:bg-neutral-200 disabled:opacity-50 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700"
              >
                {isBreakingDown ? (
                  <>
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Breaking down...
                  </>
                ) : (
                  <>
                    <Wand2 className="h-3 w-3" />
                    AI Break Down
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


