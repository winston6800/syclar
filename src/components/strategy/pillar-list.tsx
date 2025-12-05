"use client";

import { Plus } from "lucide-react";
import type { Pillar, Stone } from "./types";
import { PillarCard } from "./pillar-card";

type PillarListProps = {
  pillars: Pillar[];
  stones: Stone[];
  selectedPillarId: string;
  newStoneName: string;
  isGenerating: boolean;
  onPillarSelect: (id: string) => void;
  onPillarUpdate: (id: string, field: "name" | "winDefinition", value: string) => void;
  onPillarAdd: () => void;
  onPillarRemove: (id: string) => void;
  onNewStoneChange: (value: string) => void;
  onAddStone: () => void;
  onStoneClick: (stone: Stone) => void;
  onRemoveStone: (id: string) => void;
  onGenerateMilestones: () => void;
};

export function PillarList({
  pillars,
  stones,
  selectedPillarId,
  newStoneName,
  isGenerating,
  onPillarSelect,
  onPillarUpdate,
  onPillarAdd,
  onPillarRemove,
  onNewStoneChange,
  onAddStone,
  onStoneClick,
  onRemoveStone,
  onGenerateMilestones,
}: PillarListProps) {
  return (
    <div className="space-y-6">
      {pillars.map((pillar) => {
        const pillarStones = stones.filter((s) => s.pillarId === pillar.id);
        const isSelected = selectedPillarId === pillar.id;

        return (
          <PillarCard
            key={pillar.id}
            pillar={pillar}
            stones={pillarStones}
            isSelected={isSelected}
            newStoneName={isSelected ? newStoneName : ""}
            isGenerating={isGenerating}
            onSelect={() => onPillarSelect(pillar.id)}
            onUpdateName={(value) => onPillarUpdate(pillar.id, "name", value)}
            onUpdateWinDefinition={(value) =>
              onPillarUpdate(pillar.id, "winDefinition", value)
            }
            onRemove={() => onPillarRemove(pillar.id)}
            onNewStoneChange={onNewStoneChange}
            onAddStone={onAddStone}
            onStoneClick={onStoneClick}
            onRemoveStone={onRemoveStone}
            onGenerateMilestones={onGenerateMilestones}
            canRemove={pillars.length > 1}
          />
        );
      })}

      {/* Add Pillar Button */}
      {pillars.length < 3 && (
        <button
          type="button"
          onClick={onPillarAdd}
          className="w-full rounded-2xl border-2 border-dashed border-neutral-200 bg-white/30 p-6 text-sm font-medium text-neutral-600 transition-colors hover:border-neutral-300 hover:bg-neutral-50 dark:border-neutral-800 dark:bg-neutral-950/30 dark:text-neutral-400 dark:hover:border-neutral-700 dark:hover:bg-neutral-900/50"
        >
          <Plus className="mx-auto mb-2 h-5 w-5" />
          Add Pillar ({pillars.length}/3)
        </button>
      )}
    </div>
  );
}


