import Stripe from 'stripe';
import type { PlanId } from '@/models/Organization';

export const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2024-12-18.acacia' })
  : (null as unknown as Stripe);

export const PRICE_TO_PLAN: Record<string, PlanId> = {
  [process.env.STRIPE_PRICE_STARTER ?? '_starter']: 'starter',
  [process.env.STRIPE_PRICE_GROWTH ?? '_growth']: 'growth',
  [process.env.STRIPE_PRICE_AGENCY ?? '_agency']: 'agency',
};

export const PLAN_TO_PRICE: Record<PlanId, string | undefined> = {
  starter: process.env.STRIPE_PRICE_STARTER,
  growth: process.env.STRIPE_PRICE_GROWTH,
  agency: process.env.STRIPE_PRICE_AGENCY,
};
