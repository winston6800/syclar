import { getAllWaitlistEmails } from "@/lib/redis";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    // Optional: Add basic authentication
    // You can protect this endpoint with a password in the query string or header
    const authKey = request.nextUrl.searchParams.get("key");
    const expectedKey = process.env.ADMIN_KEY;

    if (expectedKey && authKey !== expectedKey) {
      return NextResponse.json(
        { message: "Unauthorized" },
        { status: 401 }
      );
    }

    const emails = await getAllWaitlistEmails();

    return NextResponse.json({
      count: emails.length,
      emails,
    });
  } catch (error) {
    console.error("API Error fetching waitlist emails:", error);

    return NextResponse.json(
      { message: "Failed to retrieve waitlist emails." },
      { status: 500 }
    );
  }
}

