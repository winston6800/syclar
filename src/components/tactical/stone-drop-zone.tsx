"use client";

import { useState } from "react";
import type { Task, Stone } from "./types";

type StoneDropZoneProps = {
  availableStones: Stone[];
  onDrop: (task: Task) => void;
  onBreakDown: (taskId: string, taskLabel: string) => Promise<void>;
  onStartFocus: (taskId: string) => void;
};

export function StoneDropZone({
  availableStones,
  onDrop,
  onBreakDown,
  onStartFocus,
}: StoneDropZoneProps) {
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);

    try {
      const stoneData = JSON.parse(e.dataTransfer.getData("application/json"));

      // Create task from stone
      const newTask: Task = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        label: stoneData.name,
        subtasks: [],
        completed: false,
        timeSpent: 0,
      };

      onDrop(newTask);

      // Auto-break down with AI
      await onBreakDown(newTask.id, stoneData.name);

      // Auto-start focus session
      setTimeout(() => {
        onStartFocus(newTask.id);
      }, 100);
    } catch (error) {
      console.error("Failed to handle drop:", error);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setIsDraggingOver(true);
  };

  const handleDragLeave = () => {
    setIsDraggingOver(false);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      className={`mb-4 rounded-xl border border-dashed p-4 text-center transition-all ${
        isDraggingOver
          ? "border-green-500/60 bg-green-50/30 dark:border-green-500/40 dark:bg-green-900/5"
          : "border-neutral-200/60 bg-neutral-50/30 dark:border-neutral-800/60 dark:bg-neutral-950/30"
      }`}
    >
      <div className="mx-auto max-w-sm">
        <div className="mb-1.5 text-2xl">🍽️</div>
        <h3 className="mb-1 text-sm font-medium text-neutral-700 dark:text-neutral-300">
          Drop a Stone Here
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-500">
          Drag a stone from Strategy page to create a task
        </p>
        {availableStones.length > 0 && (
          <div className="mt-3 rounded-lg border border-neutral-200/50 bg-white/60 p-2.5 dark:border-neutral-800/50 dark:bg-neutral-900/60">
            <p className="mb-1.5 text-[10px] font-medium uppercase tracking-wide text-neutral-400 dark:text-neutral-500">
              Available Stones
            </p>
            <div className="space-y-0.5 max-h-32 overflow-y-auto">
              {availableStones.map((stone) => (
                <button
                  key={stone.id}
                  type="button"
                  onClick={() => {
                    // Store stone to trigger the pending stone handler
                    localStorage.setItem("pendingStone", JSON.stringify(stone));
                  }}
                  className="w-full rounded-md bg-neutral-50/80 px-2 py-1 text-left text-xs text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 dark:bg-neutral-950/80 dark:text-neutral-400 dark:hover:bg-neutral-900 dark:hover:text-neutral-200"
                >
                  {stone.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


