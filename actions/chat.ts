'use server';
import { connectDB } from '@/lib/db/connect';
import { requireOrg } from '@/lib/auth-helpers';
import { Conversation } from '@/models/Conversation';
import { Message } from '@/models/Message';
import { planFromMessage } from '@/lib/agents';
import { consumeAiRequest } from '@/lib/usage';
import { scoped } from '@/lib/db/scope';
import { getActiveStoreId } from '@/lib/shopify/store-service';
import type { IPlan, PlanStatus } from '@/models/Message';

export type ConversationSummary = {
  id: string;
  title: string;
  lastMessageAt: string;
};

export type StoredChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  plan?: IPlan;
  status?: PlanStatus;
};

/** List recent conversations for the sidebar. */
export async function listConversations(): Promise<ConversationSummary[]> {
  const ctx = await requireOrg();
  await connectDB();
  const convos = await Conversation.find(scoped(ctx.organizationId, { userId: ctx.userId }))
    .sort({ lastMessageAt: -1 })
    .limit(50)
    .select('title lastMessageAt')
    .lean();
  return convos.map((c) => ({
    id: c._id.toString(),
    title: c.title,
    lastMessageAt: c.lastMessageAt.toISOString(),
  }));
}

/** Load all messages for a conversation. */
export async function getConversationMessages(conversationId: string): Promise<StoredChatMessage[] | null> {
  const ctx = await requireOrg();
  await connectDB();
  const convo = await Conversation.findOne(scoped(ctx.organizationId, { _id: conversationId, userId: ctx.userId }));
  if (!convo) return null;
  const messages = await Message.find(scoped(ctx.organizationId, { conversationId }))
    .sort({ createdAt: 1 })
    .lean();
  return messages.map((m) => ({
    id: m._id.toString(),
    role: m.role as 'user' | 'assistant',
    content: m.content,
    plan: m.plan,
    status: m.planStatus !== 'none' ? m.planStatus : undefined,
  }));
}

/**
 * Handle a merchant message: persist it, run the read-only pipeline, and
 * persist the assistant's proposed plan (status 'pending' if it needs approval).
 */
export async function sendMessage(input: { conversationId?: string; storeId?: string; text: string }) {
  const ctx = await requireOrg();
  await connectDB();

  const usage = await consumeAiRequest(ctx.organizationId);
  if (!usage.ok) return { ok: false, error: `AI request limit reached (${usage.limit}). Upgrade your plan.` };

  const storeId = input.storeId ?? (await getActiveStoreId(ctx.organizationId)) ?? undefined;

  let convo = input.conversationId
    ? await Conversation.findOne(scoped(ctx.organizationId, { _id: input.conversationId }))
    : null;
  if (!convo) {
    convo = await Conversation.create({
      organizationId: ctx.organizationId,
      userId: ctx.userId,
      storeId,
      title: input.text.slice(0, 60),
    });
  } else if (!convo.storeId && storeId) {
    convo.storeId = storeId as any;
    await convo.save();
  }

  await Message.create({
    conversationId: convo._id, organizationId: ctx.organizationId, role: 'user', content: input.text, planStatus: 'none',
  });

  const plan = await planFromMessage(input.text);
  const assistantMsg = await Message.create({
    conversationId: convo._id,
    organizationId: ctx.organizationId,
    role: 'assistant',
    content: plan.summary || 'How else can I help with your store?',
    plan: plan.actions.length ? plan : undefined,
    planStatus: plan.requiresApproval ? 'pending' : 'none',
  });

  convo.lastMessageAt = new Date();
  await convo.save();

  return { ok: true, conversationId: convo._id.toString(), messageId: assistantMsg._id.toString(), plan };
}
