// Redis utilities for aggregated stats tracking

import { redis } from "./redis";
import type { UserStats, AggregatedStats } from "./stats";

const STATS_KEY = "user_stats";
const AGGREGATED_KEY = "aggregated_stats";

// Store user stats in Redis
export async function storeUserStats(stats: UserStats): Promise<void> {
  try {
    await redis.hset(`${STATS_KEY}:${stats.userId}`, {
      totalCycles: String(stats.totalCycles),
      totalFocusMinutes: String(stats.totalFocusMinutes),
      totalTasksCompleted: String(stats.totalTasksCompleted),
      currentStreak: String(stats.currentStreak),
      longestStreak: String(stats.longestStreak),
      lastActivityDate: stats.lastActivityDate,
      createdAt: stats.createdAt,
    });
    
    // Add to set of all users
    await redis.sadd("stats_users", stats.userId);
  } catch (error) {
    // Check if it's a connection error
    const isConnectionError = error instanceof Error && 
      (error.message.includes("ENOTFOUND") || 
       error.message.includes("fetch failed") ||
       error.cause instanceof Error && error.cause.message.includes("ENOTFOUND"));
    
    if (isConnectionError) {
      // Redis is unavailable - log at debug level only
      console.debug("Redis unavailable, stats not persisted:", error.message);
    } else {
      // Other errors should be logged
      console.error("Error storing user stats:", error);
    }
    throw error; // Re-throw so caller knows it failed
  }
}

// Get user stats from Redis
export async function getUserStatsFromRedis(userId: string): Promise<UserStats | null> {
  try {
    const data = await redis.hgetall(`${STATS_KEY}:${userId}`);
    if (!data || Object.keys(data).length === 0) return null;
    
    return {
      userId,
      totalCycles: Number(data.totalCycles) || 0,
      totalFocusMinutes: Number(data.totalFocusMinutes) || 0,
      totalTasksCompleted: Number(data.totalTasksCompleted) || 0,
      currentStreak: Number(data.currentStreak) || 0,
      longestStreak: Number(data.longestStreak) || 0,
      lastActivityDate: String(data.lastActivityDate) || new Date().toISOString(),
      createdAt: String(data.createdAt) || new Date().toISOString(),
    };
  } catch (error) {
    // Check if it's a connection error
    const isConnectionError = error instanceof Error && 
      (error.message.includes("ENOTFOUND") || 
       error.message.includes("fetch failed") ||
       error.cause instanceof Error && error.cause.message.includes("ENOTFOUND"));
    
    if (!isConnectionError) {
      console.error("Error getting user stats:", error);
    }
    return null;
  }
}

// Calculate aggregated stats from all users
export async function calculateAggregatedStats(): Promise<AggregatedStats> {
  try {
    const userIds = await redis.smembers("stats_users");
    if (!userIds || userIds.length === 0) {
      return getDefaultAggregatedStats();
    }
    
    const allStats: UserStats[] = [];
    for (const userId of userIds as string[]) {
      const stats = await getUserStatsFromRedis(userId);
      if (stats) {
        allStats.push(stats);
      }
    }
    
    if (allStats.length === 0) {
      return getDefaultAggregatedStats();
    }
    
    // Calculate averages
    const totalCycles = allStats.reduce((sum, s) => sum + s.totalCycles, 0);
    const totalFocus = allStats.reduce((sum, s) => sum + s.totalFocusMinutes, 0);
    const avgCycles = totalCycles / allStats.length;
    const avgFocusMinutes = totalFocus / allStats.length;
    
    // Calculate medians and percentiles
    const cyclesSorted = allStats.map(s => s.totalCycles).sort((a, b) => a - b);
    const focusSorted = allStats.map(s => s.totalFocusMinutes).sort((a, b) => a - b);
    
    const medianCycles = getPercentile(cyclesSorted, 50);
    const medianFocusMinutes = getPercentile(focusSorted, 50);
    const p75Cycles = getPercentile(cyclesSorted, 75);
    const p90Cycles = getPercentile(cyclesSorted, 90);
    const p75FocusMinutes = getPercentile(focusSorted, 75);
    const p90FocusMinutes = getPercentile(focusSorted, 90);
    
    return {
      totalUsers: allStats.length,
      avgCycles,
      avgFocusMinutes,
      medianCycles,
      medianFocusMinutes,
      p75Cycles,
      p90Cycles,
      p75FocusMinutes,
      p90FocusMinutes,
    };
  } catch (error) {
    // Check if it's a connection error
    const isConnectionError = error instanceof Error && 
      (error.message.includes("ENOTFOUND") || 
       error.message.includes("fetch failed") ||
       error.cause instanceof Error && error.cause.message.includes("ENOTFOUND"));
    
    if (!isConnectionError) {
      console.error("Error calculating aggregated stats:", error);
    }
    return getDefaultAggregatedStats();
  }
}

// Get percentile from sorted array
function getPercentile(sorted: number[], percentile: number): number {
  if (sorted.length === 0) return 0;
  const index = Math.ceil((percentile / 100) * sorted.length) - 1;
  return sorted[Math.max(0, index)] || 0;
}

// Default aggregated stats when no data
function getDefaultAggregatedStats(): AggregatedStats {
  return {
    totalUsers: 0,
    avgCycles: 0,
    avgFocusMinutes: 0,
    medianCycles: 0,
    medianFocusMinutes: 0,
    p75Cycles: 0,
    p90Cycles: 0,
    p75FocusMinutes: 0,
    p90FocusMinutes: 0,
  };
}

// Cache aggregated stats (update every 5 minutes)
export async function getCachedAggregatedStats(): Promise<AggregatedStats> {
  try {
    const cached = await redis.get?.(AGGREGATED_KEY);
    if (cached) {
      return JSON.parse(cached as string);
    }
    
    // Calculate and cache
    const stats = await calculateAggregatedStats();
    try {
      await redis.setex?.(AGGREGATED_KEY, 300, JSON.stringify(stats)); // 5 min cache
    } catch (cacheError) {
      // If caching fails, still return the calculated stats
      console.debug("Could not cache aggregated stats (Redis unavailable)");
    }
    return stats;
  } catch (error) {
    // Check if it's a connection error
    const isConnectionError = error instanceof Error && 
      (error.message.includes("ENOTFOUND") || 
       error.message.includes("fetch failed") ||
       error.cause instanceof Error && error.cause.message.includes("ENOTFOUND"));
    
    if (!isConnectionError) {
      console.error("Error getting cached aggregated stats:", error);
    }
    // Return default stats when Redis is unavailable
    return getDefaultAggregatedStats();
  }
}

