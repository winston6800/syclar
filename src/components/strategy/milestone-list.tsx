"use client";

import { Plus, Wand2, Loader2 } from "lucide-react";
import type { Stone } from "./types";
import { MilestoneItem } from "./milestone-item";

type MilestoneListProps = {
  stones: Stone[];
  newStoneName: string;
  isGenerating: boolean;
  onNewStoneChange: (value: string) => void;
  onAddStone: () => void;
  onStoneClick: (stone: Stone) => void;
  onRemoveStone: (id: string) => void;
  onGenerateMilestones: () => void;
  canGenerate: boolean;
};

export function MilestoneList({
  stones,
  newStoneName,
  isGenerating,
  onNewStoneChange,
  onAddStone,
  onStoneClick,
  onRemoveStone,
  onGenerateMilestones,
  canGenerate,
}: MilestoneListProps) {
  return (
    <div className="mb-4 space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-medium uppercase tracking-wide text-neutral-500 dark:text-neutral-400">
          Milestones
        </h3>
        {canGenerate && (
          <button
            type="button"
            onClick={onGenerateMilestones}
            disabled={isGenerating}
            className="inline-flex items-center gap-1.5 rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-700 transition-colors hover:bg-neutral-200 disabled:opacity-50 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Wand2 className="h-3 w-3" />
                AI Generate
              </>
            )}
          </button>
        )}
      </div>

      <div className="space-y-1.5">
        {stones.length === 0 ? (
          <div className="rounded-lg border border-dashed border-neutral-200 p-4 text-center dark:border-neutral-800">
            <p className="text-xs text-neutral-400">
              Add milestones to build this pillar
            </p>
          </div>
        ) : (
          stones.map((stone) => (
            <MilestoneItem
              key={stone.id}
              stone={stone}
              onClick={() => onStoneClick(stone)}
              onRemove={() => onRemoveStone(stone.id)}
            />
          ))
        )}
      </div>

      {/* Add stone manually */}
      <div className="flex gap-2">
        <input
          value={newStoneName}
          onChange={(e) => onNewStoneChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              onAddStone();
            }
          }}
          placeholder="Add milestone..."
          className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-neutral-400 focus:outline-none focus:ring-0 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100"
        />
        <button
          type="button"
          onClick={onAddStone}
          className="inline-flex items-center justify-center rounded-lg bg-neutral-900 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}



