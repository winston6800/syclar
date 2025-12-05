// API route to get user comparison stats

import { NextResponse } from "next/server";
import { getCachedAggregatedStats } from "@/lib/redis-stats";
import type { UserStats, UserComparison } from "@/lib/stats";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userStats: UserStats = body.stats;
    
    if (!userStats) {
      return NextResponse.json(
        { success: false, error: "Invalid stats data" },
        { status: 400 }
      );
    }
    
    // Get aggregated stats (will return defaults if Redis is unavailable)
    const aggregated = await getCachedAggregatedStats();
    
    // Calculate comparisons
    const cyclesAboveAvg = Math.max(0, userStats.totalCycles - aggregated.avgCycles);
    const cyclesAboveMedian = Math.max(0, userStats.totalCycles - aggregated.medianCycles);
    
    const focusAboveAvg = aggregated.avgFocusMinutes > 0
      ? ((userStats.totalFocusMinutes - aggregated.avgFocusMinutes) / aggregated.avgFocusMinutes) * 100
      : 0;
    
    const focusAboveMedian = aggregated.medianFocusMinutes > 0
      ? ((userStats.totalFocusMinutes - aggregated.medianFocusMinutes) / aggregated.medianFocusMinutes) * 100
      : 0;
    
    // Calculate percentile rank (simplified)
    let percentileRank = 50; // default middle
    if (aggregated.p90Cycles > 0) {
      if (userStats.totalCycles >= aggregated.p90Cycles) {
        percentileRank = 90;
      } else if (userStats.totalCycles >= aggregated.p75Cycles) {
        percentileRank = 75;
      } else if (userStats.totalCycles >= aggregated.medianCycles) {
        percentileRank = 50;
      } else {
        percentileRank = 25;
      }
    }
    
    const comparison: UserComparison = {
      cyclesAboveAvg: Math.round(cyclesAboveAvg),
      cyclesAboveMedian: Math.round(cyclesAboveMedian),
      focusAboveAvg: Math.round(focusAboveAvg * 10) / 10, // 1 decimal
      focusAboveMedian: Math.round(focusAboveMedian * 10) / 10,
      percentileRank,
    };
    
    return NextResponse.json({
      success: true,
      comparison,
      aggregated,
    });
  } catch (error) {
    // Only log non-connection errors
    const isConnectionError = error instanceof Error && 
      (error.message.includes("ENOTFOUND") || 
       error.message.includes("fetch failed") ||
       error.cause instanceof Error && error.cause.message.includes("ENOTFOUND"));
    
    if (!isConnectionError) {
      console.error("Error getting comparison:", error);
    }
    
    // Return default comparison even on error
    return NextResponse.json({
      success: true,
      comparison: {
        cyclesAboveAvg: 0,
        cyclesAboveMedian: 0,
        focusAboveAvg: 0,
        focusAboveMedian: 0,
        percentileRank: 50,
      },
      aggregated: {
        totalUsers: 0,
        avgCycles: 0,
        avgFocusMinutes: 0,
        medianCycles: 0,
        medianFocusMinutes: 0,
        p75Cycles: 0,
        p90Cycles: 0,
        p75FocusMinutes: 0,
        p90FocusMinutes: 0,
      },
    });
  }
}

