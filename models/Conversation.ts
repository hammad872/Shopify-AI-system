import { Schema, model, models, type Model, type Types } from 'mongoose';

export interface IConversation {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  userId: Types.ObjectId;
  storeId?: Types.ObjectId;
  title: string;
  lastMessageAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    storeId: { type: Schema.Types.ObjectId, ref: 'Store' },
    title: { type: String, default: 'New chat', trim: true },
    lastMessageAt: { type: Date, default: () => new Date() },
  },
  { timestamps: true }
);

ConversationSchema.index({ organizationId: 1, lastMessageAt: -1 });

export const Conversation: Model<IConversation> =
  models.Conversation || model<IConversation>('Conversation', ConversationSchema);
