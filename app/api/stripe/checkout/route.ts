import { NextResponse } from 'next/server';
import { createCheckoutSession } from '@/actions/billing';
import type { PlanId } from '@/models/Organization';

export async function POST(req: Request) {
  const { plan } = (await req.json()) as { plan: PlanId };
  const result = await createCheckoutSession(plan);
  return NextResponse.json(result, { status: result.ok ? 200 : 400 });
}
