import { Schema, model, models, type Model, type Types } from 'mongoose';

export type AuditResult = 'success' | 'failure';

export interface IAuditLog {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  userId?: Types.ObjectId;
  storeId?: Types.ObjectId;
  action: string;
  summary: string;
  result: AuditResult;
  shopifyResourceId?: string;
  errorMessage?: string;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User' },
    storeId: { type: Schema.Types.ObjectId, ref: 'Store' },
    action: { type: String, required: true, index: true },
    summary: { type: String, required: true },
    result: { type: String, enum: ['success', 'failure'], required: true },
    shopifyResourceId: { type: String },
    errorMessage: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);
AuditLogSchema.index({ organizationId: 1, createdAt: -1 });

export const AuditLog: Model<IAuditLog> =
  models.AuditLog || model<IAuditLog>('AuditLog', AuditLogSchema);
