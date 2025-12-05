"use client";

import { ArrowRight, X } from "lucide-react";
import type { Stone } from "./types";

type MilestoneItemProps = {
  stone: Stone;
  onClick: () => void;
  onRemove: () => void;
};

export function MilestoneItem({ stone, onClick, onRemove }: MilestoneItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={stone.completed}
      className={`group/stone flex w-full items-center justify-between rounded-lg border px-3 py-2.5 text-left transition-all ${
        stone.completed
          ? "border-green-200 bg-green-50/50 dark:border-green-900/30 dark:bg-green-950/20 cursor-default"
          : "border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950/50 dark:hover:border-neutral-700 dark:hover:bg-neutral-900/50 cursor-pointer"
      }`}
    >
      <div className="flex flex-1 items-center gap-3">
        <div
          className={`h-1.5 w-1.5 rounded-full ${
            stone.completed
              ? "bg-green-500"
              : "bg-neutral-300 dark:bg-neutral-700"
          }`}
        />
        <span
          className={`text-sm font-medium ${
            stone.completed
              ? "text-green-700 line-through dark:text-green-400"
              : "text-neutral-900 dark:text-neutral-100"
          }`}
        >
          {stone.name}
        </span>
      </div>
      {!stone.completed && (
        <ArrowRight className="h-4 w-4 text-neutral-400 opacity-0 transition-opacity group-hover/stone:opacity-100" />
      )}
      {stone.completed && (
        <span className="text-xs font-medium text-green-600 dark:text-green-400">
          ✓ Done
        </span>
      )}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="ml-2 rounded p-1 text-neutral-400 opacity-0 transition-opacity hover:text-neutral-700 group-hover/stone:opacity-100 dark:hover:text-neutral-200"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </button>
  );
}


