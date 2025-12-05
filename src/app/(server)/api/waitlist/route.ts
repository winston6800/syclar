import { addToWaitlist, getWaitlistCount } from "@/lib/redis";
import { notifyNewSignup } from "@/lib/notify";
import arcjet, { validateEmail } from "@arcjet/next";
import { type NextRequest, NextResponse } from "next/server";
import { z } from "zod";

const aj = arcjet({
  key: process.env.ARCJET_KEY!,
  rules: [
    validateEmail({
      mode: "LIVE",
      deny: ["DISPOSABLE", "INVALID", "NO_MX_RECORDS"],
    }),
  ],
});

const emailSchema = z.object({
  email: z.string().email("Please enter a valid email address format."),
});

export async function POST(request: NextRequest) {
  try {
    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("JSON Parsing error:", parseError);
      return NextResponse.json(
        {
          success: false,
          message: "Invalid request body",
        },
        { status: 400 }
      );
    }

    const result = emailSchema.safeParse(body);
    if (!result.success) {
      const errorMessage =
        result.error.errors[0]?.message ?? "Invalid email address format";
      return NextResponse.json(
        { success: false, message: errorMessage },
        { status: 400 }
      );
    }

    const { email } = result.data;
    const decision = await aj.protect(request, { email });

    if (decision.isDenied()) {
      console.warn("Arcjet denied email:", email, "Reason:", decision.reason);
      return NextResponse.json(
        { success: false, message: "Email validation failed" },
        { status: 403 }
      );
    }

    const added = await addToWaitlist(email);

    if (!added) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 }
      );
    }

    // Send notification email (non-blocking)
    const totalCount = await getWaitlistCount();
    notifyNewSignup({ email, totalCount }).catch((error) => {
      console.error("Failed to send notification:", error);
      // Don't fail the request if notification fails
    });

    return NextResponse.json(
      { success: true, message: "Successfully signed up to the waitlist!" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Waitlist submission error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
