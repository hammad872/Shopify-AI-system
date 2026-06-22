import { Schema, model, models, type Model, type Types } from 'mongoose';
import type { PlanId } from './Organization';

export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'incomplete' | 'unpaid';

export interface ISubscription {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  stripeCustomerId: string;
  stripeSubscriptionId?: string;
  stripePriceId?: string;
  plan: PlanId;
  status: SubscriptionStatus;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, unique: true },
    stripeCustomerId: { type: String, required: true, index: true },
    stripeSubscriptionId: { type: String, index: true, sparse: true },
    stripePriceId: { type: String },
    plan: { type: String, enum: ['starter', 'growth', 'agency'], default: 'starter' },
    status: { type: String, enum: ['trialing', 'active', 'past_due', 'canceled', 'incomplete', 'unpaid'], default: 'incomplete' },
    currentPeriodStart: { type: Date },
    currentPeriodEnd: { type: Date },
    cancelAtPeriodEnd: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export const Subscription: Model<ISubscription> =
  models.Subscription || model<ISubscription>('Subscription', SubscriptionSchema);
