import mongoose from 'mongoose';
import { resolveMongoUri, resetResolvedUriCache } from '@/lib/db/resolve-uri';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) throw new Error('Missing MONGODB_URI environment variable');

interface MongooseCache { conn: typeof mongoose | null; promise: Promise<typeof mongoose> | null; }
declare global { var _mongoose: MongooseCache | undefined; }

const cached: MongooseCache = global._mongoose ?? { conn: null, promise: null };
global._mongoose = cached;

const CONNECT_OPTS = {
  bufferCommands: false,
  maxPoolSize: 10,
  serverSelectionTimeoutMS: 15_000,
  socketTimeoutMS: 45_000,
  family: 4 as const,
  autoIndex: process.env.NODE_ENV !== 'production',
};

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isDbConnectionError(err: unknown): boolean {
  if (!err || typeof err !== 'object') return false;
  const e = err as { code?: string; name?: string; message?: string };
  return (
    e.code === 'ETIMEOUT' ||
    e.code === 'ENOTFOUND' ||
    e.name === 'MongoServerSelectionError' ||
    e.name === 'MongooseServerSelectionError' ||
    (e.message?.includes('querySrv') ?? false) ||
    (e.message?.includes('SRV_TIMEOUT') ?? false) ||
    (e.message?.includes('whitelist') ?? false)
  );
}

export function dbConnectionHelpMessage(): string {
  return 'Could not reach MongoDB. Confirm MONGODB_URI in .env includes your database name (e.g. /storepilot), Atlas Network Access allows 0.0.0.0/0, then restart the dev server.';
}

export async function connectDB(): Promise<typeof mongoose> {
  if (cached.conn) return cached.conn;

  const maxAttempts = 3;
  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      if (!cached.promise) {
        const uri = await resolveMongoUri(MONGODB_URI!);
        cached.promise = mongoose.connect(uri, CONNECT_OPTS);
      }
      cached.conn = await cached.promise;
      return cached.conn;
    } catch (err) {
      lastError = err;
      cached.conn = null;
      cached.promise = null;
      if (attempt < maxAttempts && isDbConnectionError(err)) {
        resetResolvedUriCache();
        await sleep(1000 * attempt);
        continue;
      }
      throw err;
    }
  }

  throw lastError;
}
