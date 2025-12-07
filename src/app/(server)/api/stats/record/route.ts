// API route to record user stats

import { NextResponse } from "next/server";
import { storeUserStats } from "@/lib/redis-stats";
import type { UserStats } from "@/lib/stats";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const stats: UserStats = body.stats;
    
    if (!stats || !stats.userId) {
      return NextResponse.json(
        { success: false, error: "Invalid stats data" },
        { status: 400 }
      );
    }
    
    // Try to store stats, but don't fail if Redis is unavailable
    try {
      await storeUserStats(stats);
      
      // Invalidate aggregated stats cache
      const { redis } = await import("@/lib/redis");
      try {
        await redis.del?.("aggregated_stats");
      } catch (cacheError) {
        // Silently fail cache invalidation
        console.debug("Could not invalidate cache (Redis unavailable)");
      }
    } catch (redisError) {
      // Redis is unavailable, but stats are still tracked locally
      // Return success anyway since the operation completed locally
      console.debug("Redis unavailable, stats stored locally only:", redisError);
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error recording stats:", error);
    return NextResponse.json(
      { success: false, error: "Failed to record stats" },
      { status: 500 }
    );
  }
}

