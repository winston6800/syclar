// API route to get user trophies

import { NextResponse } from "next/server";
import { getUnlockedTrophies, ALL_TROPHIES } from "@/lib/trophies";
import type { UserStats } from "@/lib/stats";

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
    
    const unlockedTrophies = getUnlockedTrophies(userStats);
    
    // Return trophies with only the data needed (not the condition function)
    const trophiesData = unlockedTrophies.map((t) => ({
      id: t.id,
      name: t.name,
      description: t.description,
      rarity: t.rarity,
      icon: t.icon,
    }));
    
    return NextResponse.json({
      success: true,
      trophies: trophiesData,
      totalTrophies: ALL_TROPHIES.length,
    });
  } catch (error) {
    console.error("Error getting trophies:", error);
    return NextResponse.json(
      { success: false, error: "Failed to get trophies" },
      { status: 500 }
    );
  }
}

