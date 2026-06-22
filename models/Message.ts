import { Schema, model, models, type Model, type Types } from 'mongoose';

export type MessageRole = 'user' | 'assistant' | 'system';
export type PlanStatus = 'none' | 'pending' | 'approved' | 'rejected' | 'executed' | 'failed';
export type IntentType = 'product' | 'inventory' | 'seo' | 'collection' | 'audit' | 'chat';

export interface IPlanAction {
  type: string;
  description: string;
  payload: Record<string, unknown>;
}
export interface IPlan {
  intent: IntentType;
  summary: string;
  actions: IPlanAction[];
  requiresApproval: boolean;
}
export interface IMessage {
  _id: Types.ObjectId;
  conversationId: Types.ObjectId;
  organizationId: Types.ObjectId;
  role: MessageRole;
  content: string;
  plan?: IPlan;
  planStatus: PlanStatus;
  createdAt: Date;
  updatedAt: Date;
}

const PlanActionSchema = new Schema<IPlanAction>(
  {
    type: { type: String, required: true },
    description: { type: String, required: true },
    payload: { type: Schema.Types.Mixed, default: {} },
  },
  { _id: false }
);
const PlanSchema = new Schema<IPlan>(
  {
    intent: { type: String, enum: ['product', 'inventory', 'seo', 'collection', 'audit', 'chat'], required: true },
    summary: { type: String, required: true },
    actions: { type: [PlanActionSchema], default: [] },
    requiresApproval: { type: Boolean, default: true },
  },
  { _id: false }
);
const MessageSchema = new Schema<IMessage>(
  {
    conversationId: { type: Schema.Types.ObjectId, ref: 'Conversation', required: true, index: true },
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    role: { type: String, enum: ['user', 'assistant', 'system'], required: true },
    content: { type: String, default: '' },
    plan: { type: PlanSchema, default: undefined },
    planStatus: { type: String, enum: ['none', 'pending', 'approved', 'rejected', 'executed', 'failed'], default: 'none' },
  },
  { timestamps: true }
);
MessageSchema.index({ conversationId: 1, createdAt: 1 });

export const Message: Model<IMessage> = models.Message || model<IMessage>('Message', MessageSchema);
