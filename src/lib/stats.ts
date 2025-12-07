// User stats tracking and gamification

export type UserStats = {
  userId: string; // localStorage-based user ID
  totalCycles: number;
  totalFocusMinutes: number;
  totalTasksCompleted: number;
  currentStreak: number; // days
  longestStreak: number;
  lastActivityDate: string; // ISO date
  createdAt: string; // ISO date
  // Aggregates for time-saved metrics
  totalEstimatedMinutes?: number;
  totalActualMinutes?: number;
  totalTimeSaved?: number;
};

export type AggregatedStats = {
  totalUsers: number;
  avgCycles: number;
  avgFocusMinutes: number;
  medianCycles: number;
  medianFocusMinutes: number;
  p75Cycles: number; // 75th percentile
  p90Cycles: number; // 90th percentile
  p75FocusMinutes: number;
  p90FocusMinutes: number;
};

export type UserComparison = {
  cyclesAboveAvg: number;
  cyclesAboveMedian: number;
  focusAboveAvg: number; // percentage
  focusAboveMedian: number; // percentage
  percentileRank: number; // 0-100, where they rank
};

export type Trophy = {
  id: string;
  name: string;
  description: string;
  rarity: number; // percentage of users who have it (0-100)
  unlockedAt?: string; // ISO date when unlocked
  icon: string; // emoji or icon name
};

// Generate a simple user ID from localStorage
export function getUserId(): string {
  if (typeof window === "undefined") return "anonymous";
  
  let userId = localStorage.getItem("syclar_userId");
  if (!userId) {
    userId = `user_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
    localStorage.setItem("syclar_userId", userId);
  }
  return userId;
}

// Get user stats from localStorage
export function getUserStats(): UserStats | null {
  if (typeof window === "undefined") return null;
  
  const saved = localStorage.getItem("syclar_userStats");
  if (!saved) return null;
  
  try {
    return JSON.parse(saved);
  } catch {
    return null;
  }
}

// Save user stats to localStorage
export function saveUserStats(stats: UserStats): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("syclar_userStats", JSON.stringify(stats));
}

// Initialize or update user stats
export function initializeUserStats(): UserStats {
  const existing = getUserStats();
  if (existing) return existing;
  
  const userId = getUserId();
  const now = new Date().toISOString();
  
  const stats: UserStats = {
    userId,
    totalCycles: 0,
    totalFocusMinutes: 0,
    totalTasksCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    lastActivityDate: now,
    createdAt: now,
    totalEstimatedMinutes: 0,
    totalActualMinutes: 0,
    totalTimeSaved: 0,
  };
  
  saveUserStats(stats);
  return stats;
}

// Record a completed cycle (task completion)
export function recordCycle(data?: { estimatedMinutes?: number; actualMinutes?: number; timeSaved?: number }): UserStats {
  const stats = initializeUserStats();
  const today = new Date().toISOString().split("T")[0];
  const lastDate = stats.lastActivityDate.split("T")[0];
  
  // Update streak
  let currentStreak = stats.currentStreak;
  if (today === lastDate) {
    // Same day, don't change streak
  } else {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];
    
    if (lastDate === yesterdayStr) {
      // Consecutive day
      currentStreak += 1;
    } else {
      // Streak broken
      currentStreak = 1;
    }
  }
  
  const updated: UserStats = {
    ...stats,
    totalCycles: stats.totalCycles + 1,
    totalTasksCompleted: stats.totalTasksCompleted + 1,
    currentStreak,
    longestStreak: Math.max(stats.longestStreak, currentStreak),
    lastActivityDate: new Date().toISOString(),
    totalEstimatedMinutes: (stats.totalEstimatedMinutes || 0) + (data?.estimatedMinutes || 0),
    totalActualMinutes: (stats.totalActualMinutes || 0) + (data?.actualMinutes || 0),
    totalTimeSaved: (stats.totalTimeSaved || 0) + (data?.timeSaved || 0),
  };
  
  saveUserStats(updated);
  return updated;
}

// Record focus time
export function recordFocusTime(minutes: number): UserStats {
  const stats = initializeUserStats();
  
  const updated: UserStats = {
    ...stats,
    totalFocusMinutes: stats.totalFocusMinutes + minutes,
    lastActivityDate: new Date().toISOString(),
  };
  
  saveUserStats(updated);
  return updated;
}

