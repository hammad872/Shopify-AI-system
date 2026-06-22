import { Organization, PLAN_LIMITS } from '@/models/Organization';

/** Returns true if the org can make another AI request, and increments on success. */
export async function consumeAiRequest(organizationId: string): Promise<{ ok: boolean; used: number; limit: number }> {
  const org = await Organization.findById(organizationId);
  if (!org) return { ok: false, used: 0, limit: 0 };
  const limit = PLAN_LIMITS[org.plan].aiRequests;
  if (org.aiRequestsUsed >= limit) return { ok: false, used: org.aiRequestsUsed, limit };
  org.aiRequestsUsed += 1;
  await org.save();
  return { ok: true, used: org.aiRequestsUsed, limit };
}
