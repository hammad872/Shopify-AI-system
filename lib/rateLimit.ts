import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Optional. If Upstash env vars are absent, limit() is a no-op (always allows).
let limiter: Ratelimit | null = null;
if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
  limiter = new Ratelimit({ redis: Redis.fromEnv(), limiter: Ratelimit.slidingWindow(30, '1 m') });
}

export async function limit(key: string): Promise<boolean> {
  if (!limiter) return true;
  const { success } = await limiter.limit(key);
  return success;
}
