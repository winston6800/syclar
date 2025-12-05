// Trophy system for gamification

import type { UserStats } from "./stats";

export type Trophy = {
  id: string;
  name: string;
  description: string;
  rarity: number; // percentage of users who have it (0-100)
  icon: string; // emoji
  condition: (stats: UserStats) => boolean;
};

// All available trophies
export const ALL_TROPHIES: Trophy[] = [
  {
    id: "first_cycle",
    name: "First Cycle",
    description: "Completed your first cycle",
    rarity: 100, // Everyone gets this
    icon: "🎯",
    condition: (stats) => stats.totalCycles >= 1,
  },
  {
    id: "cyclist_10",
    name: "Cyclist",
    description: "Completed 10 cycles",
    rarity: 75,
    icon: "🚴",
    condition: (stats) => stats.totalCycles >= 10,
  },
  {
    id: "cyclist_50",
    name: "Master Cyclist",
    description: "Completed 50 cycles",
    rarity: 50,
    icon: "🚴‍♂️",
    condition: (stats) => stats.totalCycles >= 50,
  },
  {
    id: "cyclist_100",
    name: "Elite Cyclist",
    description: "Completed 100 cycles",
    rarity: 25,
    icon: "🚴‍♀️",
    condition: (stats) => stats.totalCycles >= 100,
  },
  {
    id: "cyclist_500",
    name: "Legendary Cyclist",
    description: "Completed 500 cycles",
    rarity: 5,
    icon: "🏆",
    condition: (stats) => stats.totalCycles >= 500,
  },
  {
    id: "focus_1h",
    name: "Focused Hour",
    description: "Accumulated 1 hour of focus time",
    rarity: 80,
    icon: "⏰",
    condition: (stats) => stats.totalFocusMinutes >= 60,
  },
  {
    id: "focus_10h",
    name: "Deep Focus",
    description: "Accumulated 10 hours of focus time",
    rarity: 60,
    icon: "🧠",
    condition: (stats) => stats.totalFocusMinutes >= 600,
  },
  {
    id: "focus_50h",
    name: "Focus Master",
    description: "Accumulated 50 hours of focus time",
    rarity: 30,
    icon: "💎",
    condition: (stats) => stats.totalFocusMinutes >= 3000,
  },
  {
    id: "focus_100h",
    name: "Focus Legend",
    description: "Accumulated 100 hours of focus time",
    rarity: 10,
    icon: "👑",
    condition: (stats) => stats.totalFocusMinutes >= 6000,
  },
  {
    id: "streak_3",
    name: "Getting Started",
    description: "3-day streak",
    rarity: 70,
    icon: "🔥",
    condition: (stats) => stats.currentStreak >= 3,
  },
  {
    id: "streak_7",
    name: "Week Warrior",
    description: "7-day streak",
    rarity: 40,
    icon: "🔥🔥",
    condition: (stats) => stats.currentStreak >= 7,
  },
  {
    id: "streak_30",
    name: "Month Master",
    description: "30-day streak",
    rarity: 5,
    icon: "🔥🔥🔥",
    condition: (stats) => stats.currentStreak >= 30,
  },
  {
    id: "streak_100",
    name: "Centurion",
    description: "100-day streak",
    rarity: 1,
    icon: "💯",
    condition: (stats) => stats.currentStreak >= 100,
  },
  {
    id: "velocity_10",
    name: "Velocity",
    description: "Completed 10 cycles in a single day",
    rarity: 20,
    icon: "⚡",
    condition: (stats) => {
      // This would need daily tracking, simplified for now
      return stats.totalCycles >= 10;
    },
  },
  {
    id: "consistency_week",
    name: "Consistent",
    description: "Completed cycles 7 days in a row",
    rarity: 35,
    icon: "📈",
    condition: (stats) => stats.longestStreak >= 7,
  },
];

// Get unlocked trophies for a user
export function getUnlockedTrophies(stats: UserStats): Trophy[] {
  return ALL_TROPHIES.filter((trophy) => trophy.condition(stats));
}

// Get trophy by ID
export function getTrophyById(id: string): Trophy | undefined {
  return ALL_TROPHIES.find((t) => t.id === id);
}

// Get rarity label
export function getRarityLabel(rarity: number): string {
  if (rarity >= 50) return "Common";
  if (rarity >= 25) return "Uncommon";
  if (rarity >= 10) return "Rare";
  if (rarity >= 5) return "Epic";
  if (rarity >= 1) return "Legendary";
  return "Mythic";
}

