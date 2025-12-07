"use client";

import { Plus } from "lucide-react";
import type { Task, FocusSession } from "./types";
import { TaskItem } from "./task-item";

type TaskListProps = {
  tasks: Task[];
  newTaskLabel: string;
  focusSession: FocusSession;
  isBreakingDown: boolean;
  onNewTaskChange: (value: string) => void;
  onAddTask: () => void;
  onToggleComplete: (taskId: string) => void;
  onStartFocus: (taskId: string) => void;
  onPauseFocus: () => void;
  onResumeFocus: () => void;
  onStopFocus: () => void;
  onRemove: (taskId: string) => void;
  // AI breakdown removed
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onAddSubtask: (taskId: string, subtaskLabel: string) => void;
  onRemoveSubtask: (taskId: string, subtaskId: string) => void;
  formatTime: (seconds: number) => string;
  formatMinutes: (minutes: number) => string;
};

export function TaskList({
  tasks,
  newTaskLabel,
  focusSession,
  isBreakingDown,
  onNewTaskChange,
  onAddTask,
  onToggleComplete,
  onStartFocus,
  onPauseFocus,
  onResumeFocus,
  onStopFocus,
  onRemove,
  // onBreakDown removed
  onToggleSubtask,
  onAddSubtask,
  // onRemoveSubtask removed (component deprecated, use MomentumTimer instead)
  formatTime,
  formatMinutes,
}: TaskListProps) {
  // Sort tasks: incomplete first, then completed
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed && !b.completed) return 1;
    if (!a.completed && b.completed) return -1;
    return 0;
  });
  
  const completedTasks = tasks.filter((t) => t.completed);

  return (
    <div className="space-y-2">
      {/* Add new task */}
      <div className="flex gap-2">
        <input
          value={newTaskLabel}
          onChange={(e) => onNewTaskChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAddTask();
            }
          }}
          placeholder="Add a task..."
          className="flex-1 rounded-lg border border-neutral-200/60 bg-white/60 px-3 py-2 text-sm text-neutral-800 placeholder:text-neutral-400 focus:border-neutral-400/80 focus:outline-none focus:ring-0 dark:border-neutral-700/60 dark:bg-neutral-950/60 dark:text-neutral-100"
        />
        <button
          type="button"
          onClick={onAddTask}
          className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* Task list */}
      {tasks.length === 0 ? (
        <div className="rounded-lg border border-dashed border-neutral-200/60 p-8 text-center dark:border-neutral-800/60">
          <p className="text-sm text-neutral-400">
            No tasks yet. Add your first task to get started.
          </p>
        </div>
      ) : (
        sortedTasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            focusSession={focusSession}
            isBreakingDown={isBreakingDown}
            onToggleComplete={() => onToggleComplete(task.id)}
            onStartFocus={() => onStartFocus(task.id)}
            onPauseFocus={onPauseFocus}
            onResumeFocus={onResumeFocus}
            onStopFocus={onStopFocus}
            onRemove={() => onRemove(task.id)}
            /* AI breakdown disabled */
            onToggleSubtask={(subtaskId) => onToggleSubtask(task.id, subtaskId)}
            onAddSubtask={(subtaskLabel) => onAddSubtask(task.id, subtaskLabel)}
            // onRemoveSubtask removed (component deprecated)
            formatTime={formatTime}
            formatMinutes={formatMinutes}
          />
        ))
      )}

    </div>
  );
}


