import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export interface SessionContext {
  userId: string;
  organizationId: string;
  email: string;
  role: 'user' | 'superadmin';
}

/** Returns the session context or null. */
export async function getSessionContext(): Promise<SessionContext | null> {
  const session = await getServerSession(authOptions);
  const u = session?.user as any;
  if (!u?.id || !u?.organizationId) return null;
  return { userId: u.id, organizationId: u.organizationId, email: u.email, role: u.role ?? 'user' };
}

/** Throws if unauthenticated — use in server actions / route handlers. */
export async function requireOrg(): Promise<SessionContext> {
  const ctx = await getSessionContext();
  if (!ctx) throw new Error('UNAUTHORIZED');
  return ctx;
}

export async function requireSuperAdmin(): Promise<SessionContext> {
  const ctx = await requireOrg();
  if (ctx.role !== 'superadmin') throw new Error('FORBIDDEN');
  return ctx;
}
