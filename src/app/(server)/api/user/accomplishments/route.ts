import { NextResponse } from "next/server";
import { redis } from "@/lib/redis";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { clientId, accomplishments } = body;
    if (!clientId || !accomplishments || typeof accomplishments !== "object") {
      return NextResponse.json({ success: false, error: "Invalid payload" }, { status: 400 });
    }

    // Store as JSON string under a key scoped to the clientId
    const key = `accomplishments:${clientId}`;
    try {
      await redis.set(key, JSON.stringify(accomplishments));
    } catch (err) {
      console.error("Redis error saving accomplishments:", err);
      // Don't fail hard — return success:false so client can fallback
      return NextResponse.json({ success: false, error: "Redis error" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error in POST /api/user/accomplishments:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const clientId = url.searchParams.get("clientId");
    if (!clientId) {
      return NextResponse.json({ success: false, error: "Missing clientId" }, { status: 400 });
    }
    const key = `accomplishments:${clientId}`;
    try {
      const data = await redis.get(key);
      if (!data) return NextResponse.json({ success: true, accomplishments: {} });
      const parsed = JSON.parse(data as string);
      return NextResponse.json({ success: true, accomplishments: parsed });
    } catch (err) {
      console.error("Redis error reading accomplishments:", err);
      return NextResponse.json({ success: false, error: "Redis error" }, { status: 500 });
    }
  } catch (error) {
    console.error("Error in GET /api/user/accomplishments:", error);
    return NextResponse.json({ success: false, error: "Server error" }, { status: 500 });
  }
}
