"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import type { Pillar, Stone } from "@/components/strategy/types";
import { PillarList } from "@/components/strategy/pillar-list";

export default function StrategyPage() {
  const router = useRouter();
  
  // Load from localStorage on mount - start with 1 pillar default
  const [pillars, setPillars] = useState<Pillar[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("strategyPillars");
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          const deserialized = parsed.map((p: any) => ({
            ...p,
            estimatedCompletion: p.estimatedCompletion ? new Date(p.estimatedCompletion) : undefined,
          }));
          return deserialized.length > 0 ? deserialized : [{ id: "1", name: "", winDefinition: "" }];
        } catch (e) {
          console.error("Failed to load pillars:", e);
        }
      }
    }
    return [{ id: "1", name: "", winDefinition: "" }];
  });

  const [stones, setStones] = useState<Stone[]>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("strategyStones");
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error("Failed to load stones:", e);
        }
      }
    }
    return [];
  });

  const [newStoneName, setNewStoneName] = useState<string>("");
  const [selectedPillarId, setSelectedPillarId] = useState<string>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("selectedPillarId");
      return saved || "1";
    }
    return "1";
  });
  const [isGenerating, setIsGenerating] = useState(false);

  // Sync pillars to localStorage (with date serialization)
  useEffect(() => {
    const serialized = pillars.map((p) => ({
      ...p,
      estimatedCompletion: p.estimatedCompletion ? p.estimatedCompletion.toISOString() : undefined,
    }));
    localStorage.setItem("strategyPillars", JSON.stringify(serialized));
  }, [pillars]);

  // Sync stones to localStorage for tactical page
  useEffect(() => {
    localStorage.setItem("strategyStones", JSON.stringify(stones));
  }, [stones]);

  // Recalculate timeline when stones change
  useEffect(() => {
    setPillars((prevPillars) => {
      return prevPillars.map((pillar) => {
        const pillarStones = stones.filter((s) => s.pillarId === pillar.id);
        if (pillarStones.length > 0 && pillarStones.some((s) => s.estimatedWeeks)) {
          const incompleteStones = pillarStones.filter((s) => !s.completed);
          const remainingWeeks = incompleteStones.reduce((sum, s) => sum + (s.estimatedWeeks || 2), 0);
          
          if (remainingWeeks > 0) {
            const completionDate = new Date();
            completionDate.setDate(completionDate.getDate() + (remainingWeeks * 7));
            return { ...pillar, estimatedWeeks: remainingWeeks, estimatedCompletion: completionDate };
          }
        }
        return pillar;
      });
    });
  }, [stones]);

  // Sync selected pillar
  useEffect(() => {
    localStorage.setItem("selectedPillarId", selectedPillarId);
  }, [selectedPillarId]);

  const activePillar = pillars.find((p: Pillar) => p.id === selectedPillarId);

  const updatePillarField = (
    id: string,
    field: "name" | "winDefinition",
    value: string,
  ): void => {
    setPillars((prev: Pillar[]) =>
      prev.map((p: Pillar) => (p.id === id ? { ...p, [field]: value } : p)),
    );
  };

  const addStone = () => {
    const trimmed = newStoneName.trim();
    if (!trimmed) return;
    setStones((prev: Stone[]) => [
      ...prev,
      {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        pillarId: selectedPillarId,
        name: trimmed,
        completed: false,
      },
    ]);
    setNewStoneName("");
  };

  const removeStone = (id: string) => {
    setStones((prev: Stone[]) => prev.filter((s: Stone) => s.id !== id));
  };

  const handleStoneClick = (stone: Stone) => {
    if (stone.completed) return;
    
    // Prevent starting another stone if one is already in progress
    try {
      const saved = localStorage.getItem("strategyStones");
      if (saved) {
        const allStones: Stone[] = JSON.parse(saved);
        const active = allStones.find((s) => s.inProgress);
        if (active) {
          alert("You already have a stone in progress. Finish or stop it before starting another.");
          return;
        }
      }
    } catch (e) {
      // ignore parse errors
    }

    // Store stone to be picked up by tactical page
    localStorage.setItem("pendingStone", JSON.stringify(stone));

    // Navigate to tactical page
    router.push("/tactical");
  };

  const addPillar = () => {
    if (pillars.length >= 3) return;
    const newId = String(pillars.length + 1);
    setPillars((prev) => [...prev, { id: newId, name: "", winDefinition: "" }]);
    setSelectedPillarId(newId);
  };

  const removePillar = (id: string) => {
    if (pillars.length <= 1) return; // Keep at least one pillar
    
    // Remove stones for this pillar
    setStones((prev) => prev.filter((s) => s.pillarId !== id));
    
    // Remove pillar
    setPillars((prev) => prev.filter((p) => p.id !== id));
    
    // Select first remaining pillar
    const remaining = pillars.filter((p) => p.id !== id);
    if (remaining.length > 0) {
      setSelectedPillarId(remaining[0].id);
    }
  };

  const generateMilestones = async () => {
    const pillar = activePillar;
    if (!pillar?.name || !pillar?.winDefinition) {
      alert("Please fill in pillar name and win definition first");
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch("/api/ai/generate-milestones", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pillarName: pillar.name,
          winDefinition: pillar.winDefinition,
        }),
      });

      const data = await response.json();
      if (data.success && data.milestones) {
        const newStones: Stone[] = data.milestones.map((m: any, index: number) => {
          const milestone = typeof m === 'string' ? { name: m, estimatedWeeks: 2 } : m;
          return {
            id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
            pillarId: selectedPillarId,
            name: milestone.name,
            completed: false,
            estimatedWeeks: milestone.estimatedWeeks || 2,
            scheduledWeek: index + 1, // Will be recalculated
          };
        });
        
        // Calculate timeline
        const totalWeeks = newStones.reduce((sum, s) => sum + (s.estimatedWeeks || 2), 0);
        const completionDate = new Date();
        completionDate.setDate(completionDate.getDate() + (totalWeeks * 7));
        
        // Schedule milestones across weeks
        let currentWeek = 1;
        const scheduledStones = newStones.map((stone) => {
          const week = currentWeek;
          currentWeek += stone.estimatedWeeks || 2;
          return { ...stone, scheduledWeek: week };
        });
        
        // Update pillar with timeline
        setPillars((prev) =>
          prev.map((p) =>
            p.id === selectedPillarId
              ? { ...p, estimatedWeeks: totalWeeks, estimatedCompletion: completionDate }
              : p
          )
        );
        
        setStones((prev) => [...prev, ...scheduledStones]);
      }
    } catch (error) {
      console.error("Failed to generate milestones:", error);
      alert("Failed to generate milestones. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white dark:bg-black">
      <div className="mx-auto max-w-4xl px-6 py-16 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="mb-12 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-neutral-100/50 px-4 py-1.5 text-xs font-medium text-neutral-600 backdrop-blur-sm dark:bg-neutral-900/50 dark:text-neutral-400">
            <Sparkles className="h-3 w-3" />
            Strategy & Operations
          </div>
          <h1 className="mb-3 text-3xl font-semibold tracking-tight sm:text-4xl">
            Define Your Focus
          </h1>
          <p className="mx-auto max-w-xl text-sm text-neutral-600 dark:text-neutral-400">
            Set your pillars, define what winning means, and break it down into actionable milestones.
          </p>
        </div>

        {/* Pillars */}
        <PillarList
          pillars={pillars}
          stones={stones}
          selectedPillarId={selectedPillarId}
          newStoneName={newStoneName}
          isGenerating={isGenerating}
          onPillarSelect={setSelectedPillarId}
          onPillarUpdate={updatePillarField}
          onPillarAdd={addPillar}
          onPillarRemove={removePillar}
          onNewStoneChange={setNewStoneName}
          onAddStone={addStone}
          onStoneClick={handleStoneClick}
          onRemoveStone={removeStone}
          onGenerateMilestones={generateMilestones}
        />
      </div>
    </div>
  );
}
