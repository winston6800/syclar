import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || "",
  token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
});

export async function addToWaitlist(email: string): Promise<boolean> {
  try {
    const exists = await redis.sismember("waitlist", email);
    if (exists) {
      return false;
    }
    await redis.sadd("waitlist", email);

    await redis.hset("waitlist:timestamps", {
      [email]: new Date().toISOString(),
    });

    return true;
  } catch (error) {
    console.error("Error adding email to waitlist:", error);
    return false;
  }
}

export async function getWaitlistCount(): Promise<number> {
  try {
    const count = await redis.scard("waitlist");
    return count as number;
  } catch (error) {
    console.error("Error getting waitlist count:", error);
    return 0;
  }
}

export async function getAllWaitlistEmails(): Promise<
  Array<{ email: string; timestamp: string }>
> {
  try {
    // Get all emails from the set
    const emails = await redis.smembers("waitlist");
    
    // Get all timestamps
    const timestamps = await redis.hgetall("waitlist:timestamps");
    
    // Combine emails with their timestamps
    const emailsWithTimestamps = (emails as string[]).map((email) => ({
      email,
      timestamp: (timestamps as Record<string, string>)[email] || "",
    }));
    
    // Sort by timestamp (newest first)
    return emailsWithTimestamps.sort((a, b) => {
      if (!a.timestamp) return 1;
      if (!b.timestamp) return -1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  } catch (error) {
    console.error("Error getting all waitlist emails:", error);
    return [];
  }
}