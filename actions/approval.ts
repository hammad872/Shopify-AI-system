'use server';
import { connectDB } from '@/lib/db/connect';
import { requireOrg } from '@/lib/auth-helpers';
import { Message } from '@/models/Message';
import { Conversation } from '@/models/Conversation';
import { executePlan } from '@/lib/agents';
import { scoped } from '@/lib/db/scope';
import { getActiveStoreId } from '@/lib/shopify/store-service';

/** Merchant clicked Approve or Reject on a pending plan. */
export async function resolvePlan(input: { messageId: string; approve: boolean }) {
  const ctx = await requireOrg();
  await connectDB();

  const msg = await Message.findOne(scoped(ctx.organizationId, { _id: input.messageId }));
  if (!msg || msg.planStatus !== 'pending' || !msg.plan) {
    return { ok: false, error: 'No pending plan found for this message.' };
  }

  if (!input.approve) {
    msg.planStatus = 'rejected';
    await msg.save();
    return { ok: true, status: 'rejected' as const };
  }

  msg.planStatus = 'approved';
  await msg.save();

  const convo = await Conversation.findById(msg.conversationId);
  const storeId = convo?.storeId?.toString() ?? (await getActiveStoreId(ctx.organizationId)) ?? undefined;
  if (!storeId) {
    msg.planStatus = 'failed';
    await msg.save();
    return { ok: false, status: 'failed' as const, reason: 'No store connected. Connect a store on the Stores page first.' };
  }

  const outcome = await executePlan(msg.plan, {
    organizationId: ctx.organizationId,
    userId: ctx.userId,
    storeId,
  });

  msg.planStatus = outcome.ok ? 'executed' : 'failed';
  await msg.save();
  const failReason = outcome.reason ?? outcome.results.find((r) => !r.ok)?.error;
  return { ok: outcome.ok, status: msg.planStatus, results: outcome.results, reason: failReason };
}
