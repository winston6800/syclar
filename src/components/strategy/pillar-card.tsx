"use client";

import { X } from "lucide-react";
import type { Pillar, Stone } from "./types";
import { MilestoneList } from "./milestone-list";
import { PillarTimeline } from "./pillar-timeline";

type PillarCardProps = {
  pillar: Pillar;
  stones: Stone[];
  isSelected: boolean;
  newStoneName: string;
  isGenerating: boolean;
  onSelect: () => void;
  onUpdateName: (value: string) => void;
  onUpdateWinDefinition: (value: string) => void;
  onRemove: () => void;
  onNewStoneChange: (value: string) => void;
  onAddStone: () => void;
  onStoneClick: (stone: Stone) => void;
  onRemoveStone: (id: string) => void;
  onGenerateMilestones: () => void;
  canRemove: boolean;
};

export function PillarCard({
  pillar,
  stones,
  isSelected,
  newStoneName,
  isGenerating,
  onSelect,
  onUpdateName,
  onUpdateWinDefinition,
  onRemove,
  onNewStoneChange,
  onAddStone,
  onStoneClick,
  onRemoveStone,
  onGenerateMilestones,
  canRemove,
}: PillarCardProps) {
  const completedCount = stones.filter((s) => s.completed).length;
  const totalCount = stones.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div
      className={`group rounded-2xl border bg-white/50 p-6 backdrop-blur-sm transition-all dark:bg-neutral-950/50 ${
        isSelected
          ? "border-neutral-300 shadow-sm dark:border-neutral-800"
          : "border-neutral-200 dark:border-neutral-900"
      }`}
    >
      {/* Pillar Header */}
      <div className="mb-6">
        <div className="mb-3 flex items-start justify-between gap-4">
          <div className="flex-1">
            <input
              value={pillar.name}
              onChange={(e) => onUpdateName(e.target.value)}
              placeholder="Pillar name (e.g., Ship product)"
              className="w-full border-0 bg-transparent text-lg font-semibold text-neutral-900 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-50"
            />
            <textarea
              value={pillar.winDefinition}
              onChange={(e) => onUpdateWinDefinition(e.target.value)}
              placeholder="What does winning look like?"
              rows={2}
              className="mt-2 w-full resize-none border-0 bg-transparent text-sm text-neutral-600 placeholder:text-neutral-400 focus:outline-none dark:text-neutral-400"
            />
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onSelect}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                isSelected
                  ? "bg-neutral-900 text-white dark:bg-white dark:text-black"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200 dark:bg-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800"
              }`}
            >
              {isSelected ? "Active" : "Select"}
            </button>
            {canRemove && (
              <button
                type="button"
                onClick={onRemove}
                className="rounded-lg p-1.5 text-neutral-400 hover:bg-neutral-100 hover:text-neutral-700 dark:hover:bg-neutral-900 dark:hover:text-neutral-200"
                aria-label="Remove pillar"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Timeline & Progress */}
      {isSelected && (
        <>
          {pillar.estimatedCompletion && (
            <PillarTimeline pillar={pillar} stones={stones} />
          )}

          {/* Milestones */}
          <MilestoneList
            stones={stones}
            newStoneName={newStoneName}
            isGenerating={isGenerating}
            onNewStoneChange={onNewStoneChange}
            onAddStone={onAddStone}
            onStoneClick={onStoneClick}
            onRemoveStone={onRemoveStone}
            onGenerateMilestones={onGenerateMilestones}
            canGenerate={!!pillar.name && !!pillar.winDefinition}
          />
        </>
      )}
    </div>
  );
}


