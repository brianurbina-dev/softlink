import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

let _ratelimit: Ratelimit | null = null;

function getRatelimit(): Ratelimit | null {
  if (!process.env.UPSTASH_REDIS_REST_URL || !process.env.UPSTASH_REDIS_REST_TOKEN) {
    return null;
  }
  if (!_ratelimit) {
    _ratelimit = new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(3, "1 h"),
      analytics: true,
      prefix: "softlink:ratelimit",
    });
  }
  return _ratelimit;
}

export async function checkRateLimit(ip: string): Promise<{ success: boolean }> {
  const rl = getRatelimit();
  if (!rl) return { success: true };
  return rl.limit(ip);
}
