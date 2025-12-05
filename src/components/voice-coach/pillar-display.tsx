"use client";

import { useState, KeyboardEvent } from "react";
import type { Pillar } from "./types";

type PillarDisplayProps = {
  pillar1: Pillar | null;
  pillar2: Pillar | null;
  priorityPillarId: string | null;
  onPillar1Change: (pillar: Pillar | null) => void;
  onPillar2Change: (pillar: Pillar | null) => void;
};

export function PillarDisplay({
  pillar1,
  pillar2,
  priorityPillarId,
  onPillar1Change,
  onPillar2Change,
}: PillarDisplayProps) {
  const [editingPillar, setEditingPillar] = useState<"1" | "2" | null>(null);
  const [editValue, setEditValue] = useState("");

  const startEditingPillar = (id: "1" | "2") => {
    const current = id === "1" ? pillar1?.description : pillar2?.description;
    setEditingPillar(id);
    setEditValue(current ?? "");
  };

  const savePillarEdit = () => {
    if (!editingPillar) return;
    const trimmed = editValue.trim();
    if (!trimmed) {
      // If cleared, treat as unset
      if (editingPillar === "1") {
        onPillar1Change(null);
      } else {
        onPillar2Change(null);
      }
    } else {
      const pillar: Pillar = {
        id: editingPillar,
        description: trimmed,
      };
      if (editingPillar === "1") {
        onPillar1Change(pillar);
      } else {
        onPillar2Change(pillar);
      }
    }
    setEditingPillar(null);
  };

  const handleEditKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      savePillarEdit();
    } else if (e.key === "Escape") {
      e.preventDefault();
      setEditingPillar(null);
    }
  };

  return (
    <div className="mb-12 rounded-3xl bg-white/80 p-8 backdrop-blur-xl transition-all duration-500 hover:bg-white hover:shadow-2xl hover:shadow-black/5 dark:bg-neutral-900/80 dark:hover:bg-neutral-900 dark:hover:shadow-black/50">
      <h2 className="mb-6 text-2xl font-semibold tracking-tight text-neutral-900 dark:text-neutral-100">
        Your Pillars
      </h2>
      <div className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 transition-colors">
            <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">1</span>
          </div>
          <div className="flex-1">
            {editingPillar === "1" ? (
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={savePillarEdit}
                onKeyDown={handleEditKeyDown}
                placeholder="Describe your first pillar"
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-base text-neutral-900 shadow-sm outline-none ring-0 focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50"
              />
            ) : pillar1 ? (
              <button
                type="button"
                onClick={() => startEditingPillar("1")}
                className="w-full text-left text-lg font-medium text-neutral-900 underline decoration-dotted underline-offset-4 hover:decoration-solid dark:text-neutral-100"
              >
                {pillar1.description}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => startEditingPillar("1")}
                className="text-left text-base text-neutral-400 underline decoration-dotted underline-offset-4 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                Click to set Pillar 1
              </button>
            )}
          </div>
          {priorityPillarId === "1" && (
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
              Priority
            </span>
          )}
        </div>
        <div className="flex items-center gap-4">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-neutral-100 dark:bg-neutral-800 transition-colors">
            <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">2</span>
          </div>
          <div className="flex-1">
            {editingPillar === "2" ? (
              <input
                autoFocus
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onBlur={savePillarEdit}
                onKeyDown={handleEditKeyDown}
                placeholder="Describe your second pillar"
                className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-base text-neutral-900 shadow-sm outline-none ring-0 focus:border-neutral-400 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50"
              />
            ) : pillar2 ? (
              <button
                type="button"
                onClick={() => startEditingPillar("2")}
                className="w-full text-left text-lg font-medium text-neutral-900 underline decoration-dotted underline-offset-4 hover:decoration-solid dark:text-neutral-100"
              >
                {pillar2.description}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => startEditingPillar("2")}
                className="text-left text-base text-neutral-400 underline decoration-dotted underline-offset-4 hover:text-neutral-600 dark:hover:text-neutral-300"
              >
                Click to set Pillar 2
              </button>
            )}
          </div>
          {priorityPillarId === "2" && (
            <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-200">
              Priority
            </span>
          )}
        </div>
      </div>
    </div>
  );
}


