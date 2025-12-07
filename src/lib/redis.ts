import { Redis } from "@upstash/redis";

// Small helper to detect common connection errors so we can log them succinctly
const isConnectionError = (err: any) => {
  if (!err) return false;
  const msg = String(err?.message || "").toLowerCase();
  if (err?.code === "ENOTFOUND") return true;
  if (msg.includes("enotfound") || msg.includes("getaddrinfo") || msg.includes("fetch failed")) return true;
  return false;
};

// Optional dev fallback: set DEV_REDIS_FALLBACK=true in .env.local to use an in-memory store
const useFallback = process.env.DEV_REDIS_FALLBACK === "true";

type RedisLike = {
  sismember: (key: string, member: string) => Promise<number | boolean>;
  sadd: (key: string, member: string) => Promise<number>;
  scard: (key: string) => Promise<number>;
  smembers: (key: string) => Promise<string[]>;
  hset: (key: string, obj: Record<string, string>) => Promise<void>;
  hgetall: (key: string) => Promise<Record<string, string>>;
  get?: (key: string) => Promise<string | null>;
  setex?: (key: string, seconds: number, value: string) => Promise<void>;
};

// In-memory fallback implementation
const createInMemoryRedis = (): RedisLike => {
  const sets = new Map<string, Set<string>>();
  const hashes = new Map<string, Record<string, string>>();

  return {
    async sismember(key, member) {
      const s = sets.get(key);
      return s ? (s.has(member) ? 1 : 0) : 0;
    },
    async sadd(key, member) {
      let s = sets.get(key);
      if (!s) {
        s = new Set();
        sets.set(key, s);
      }
      const before = s.size;
      s.add(member);
      return s.size - before;
    },
    async scard(key) {
      const s = sets.get(key);
      return s ? s.size : 0;
    },
    async smembers(key) {
      const s = sets.get(key);
      return s ? Array.from(s) : [];
    },
    async hset(key, obj) {
      const existing = hashes.get(key) || {};
      const merged = { ...existing, ...obj };
      hashes.set(key, merged);
    },
    async hgetall(key) {
      return hashes.get(key) || {};
    },
    async get(key) {
      // support cached aggregated stats
      const hashesKey = key;
      const value = hashes.get(hashesKey) as unknown;
      if (typeof value === "string") return value;
      return null;
    },
    async setex(key, seconds, value) {
      // store value as string in hashes map for get
      hashes.set(key, value as unknown as Record<string, string>);
      // ignore expiration in fallback
    },
  };
};

let client: RedisLike;
if (useFallback) {
  client = createInMemoryRedis();
  console.warn("Using in-memory Redis fallback (DEV_REDIS_FALLBACK=true)");
} else {
  client = new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL || "",
    token: process.env.UPSTASH_REDIS_REST_TOKEN || "",
  }) as unknown as RedisLike;
}

// Export `redis` for modules expecting that name (legacy import paths)
export const redis = client;

export async function addToWaitlist(email: string): Promise<boolean> {
  try {
    const exists = await client.sismember("waitlist", email);
    if (exists) {
      return false;
    }
    await client.sadd("waitlist", email);

    await client.hset("waitlist:timestamps", {
      [email]: new Date().toISOString(),
    } as Record<string, string>);

    return true;
  } catch (error) {
    if (isConnectionError(error)) {
      console.warn("Upstash connection error (waitlist add):", error?.message || error);
    } else {
      console.error("Error adding email to waitlist:", error);
    }
    return false;
  }
}

export async function getWaitlistCount(): Promise<number> {
  try {
    const count = await client.scard("waitlist");
    return (count as number) || 0;
  } catch (error) {
    if (isConnectionError(error)) {
      console.warn("Upstash connection error (getWaitlistCount):", error?.message || error);
    } else {
      console.error("Error getting waitlist count:", error);
    }
    return 0;
  }
}

export async function getAllWaitlistEmails(): Promise<
  Array<{ email: string; timestamp: string }>
> {
  try {
    // Get all emails from the set
    const emails = (await client.smembers("waitlist")) as string[];
    
    // Get all timestamps
    const timestamps = (await client.hgetall("waitlist:timestamps")) as Record<string, string>;
    
    // Combine emails with their timestamps
    const emailsWithTimestamps = (emails || []).map((email) => ({
      email,
      timestamp: (timestamps || {})[email] || "",
    }));
    
    // Sort by timestamp (newest first)
    return emailsWithTimestamps.sort((a, b) => {
      if (!a.timestamp) return 1;
      if (!b.timestamp) return -1;
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  } catch (error) {
    if (isConnectionError(error)) {
      console.warn("Upstash connection error (getAllWaitlistEmails):", error?.message || error);
    } else {
      console.error("Error getting all waitlist emails:", error);
    }
    return [];
  }
}