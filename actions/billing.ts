'use server';
import { connectDB } from '@/lib/db/connect';
import { requireOrg } from '@/lib/auth-helpers';
import { stripe, PLAN_TO_PRICE } from '@/lib/stripe';
import { Subscription } from '@/models/Subscription';
import type { PlanId } from '@/models/Organization';

export async function createCheckoutSession(plan: PlanId) {
  const ctx = await requireOrg();
  await connectDB();
  if (!stripe) return { ok: false, error: 'Stripe not configured.' };

  const price = PLAN_TO_PRICE[plan];
  if (!price) return { ok: false, error: `No Stripe price configured for ${plan}.` };

  let sub = await Subscription.findOne({ organizationId: ctx.organizationId });
  let customerId = sub?.stripeCustomerId;
  if (!customerId) {
    const customer = await stripe.customers.create({ email: ctx.email, metadata: { organizationId: ctx.organizationId } });
    customerId = customer.id;
    sub = await Subscription.create({ organizationId: ctx.organizationId, stripeCustomerId: customerId, plan, status: 'incomplete' });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    customer: customerId,
    line_items: [{ price, quantity: 1 }],
    success_url: `${process.env.NEXTAUTH_URL}/billing?success=1`,
    cancel_url: `${process.env.NEXTAUTH_URL}/billing?canceled=1`,
    metadata: { organizationId: ctx.organizationId, plan },
  });
  return { ok: true, url: session.url };
}
