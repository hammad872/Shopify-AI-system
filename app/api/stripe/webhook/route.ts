import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { stripe, PRICE_TO_PLAN } from '@/lib/stripe';
import { Subscription } from '@/models/Subscription';
import { Organization } from '@/models/Organization';

// Stripe webhook: keep Subscription + Organization.plan in sync with Stripe.
export async function POST(req: Request) {
  if (!stripe) return NextResponse.json({ error: 'Stripe not configured' }, { status: 500 });
  const sig = req.headers.get('stripe-signature');
  const body = await req.text();

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    return NextResponse.json({ error: `Invalid signature: ${(err as Error).message}` }, { status: 400 });
  }

  await connectDB();

  if (event.type === 'customer.subscription.updated' || event.type === 'customer.subscription.created') {
    const s = event.data.object as any;
    const priceId = s.items?.data?.[0]?.price?.id as string | undefined;
    const plan = priceId ? PRICE_TO_PLAN[priceId] : undefined;
    const sub = await Subscription.findOneAndUpdate(
      { stripeCustomerId: s.customer },
      {
        stripeSubscriptionId: s.id,
        stripePriceId: priceId,
        status: s.status,
        plan: plan ?? 'starter',
        currentPeriodStart: new Date(s.current_period_start * 1000),
        currentPeriodEnd: new Date(s.current_period_end * 1000),
        cancelAtPeriodEnd: s.cancel_at_period_end,
      },
      { new: true }
    );
    if (sub && plan) await Organization.findByIdAndUpdate(sub.organizationId, { plan });
  }

  if (event.type === 'customer.subscription.deleted') {
    const s = event.data.object as any;
    const sub = await Subscription.findOneAndUpdate({ stripeCustomerId: s.customer }, { status: 'canceled', plan: 'starter' }, { new: true });
    if (sub) await Organization.findByIdAndUpdate(sub.organizationId, { plan: 'starter' });
  }

  return NextResponse.json({ received: true });
}
