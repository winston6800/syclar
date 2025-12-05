import { getWaitlistCount } from "@/lib/redis";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const count = await getWaitlistCount();
    return NextResponse.json({ count });
  } catch (error) {
    console.error("Error getting waitlist count:", error);
    // Fallback to 0 if there's an error
    return NextResponse.json({ count: 0 });
  }
}
