import { Schema, model, models, type Model, type Types } from 'mongoose';

export type PlanId = 'starter' | 'growth' | 'agency';

export const PLAN_LIMITS: Record<PlanId, { stores: number; aiRequests: number }> = {
  starter: { stores: 1, aiRequests: 500 },
  growth: { stores: 3, aiRequests: 5_000 },
  agency: { stores: Infinity, aiRequests: Infinity },
};

export interface IOrganization {
  _id: Types.ObjectId;
  name: string;
  ownerId: Types.ObjectId;
  plan: PlanId;
  aiRequestsUsed: number;
  usageResetAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OrganizationSchema = new Schema<IOrganization>(
  {
    name: { type: String, required: true, trim: true },
    ownerId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    plan: { type: String, enum: ['starter', 'growth', 'agency'], default: 'starter' },
    aiRequestsUsed: { type: Number, default: 0 },
    usageResetAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

export const Organization: Model<IOrganization> =
  models.Organization || model<IOrganization>('Organization', OrganizationSchema);
