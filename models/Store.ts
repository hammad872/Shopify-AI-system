import { Schema, model, models, type Model, type Types } from 'mongoose';

export type StoreStatus = 'active' | 'disconnected';

export interface IStore {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  shopDomain: string;
  encryptedAccessToken: string;
  scope: string;
  status: StoreStatus;
  installedAt: Date;
  lastSyncAt?: Date;
  productCount: number;
  inventoryCount: number;
  healthScore: number;
  createdAt: Date;
  updatedAt: Date;
}

const StoreSchema = new Schema<IStore>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    shopDomain: { type: String, required: true, unique: true, lowercase: true, trim: true },
    encryptedAccessToken: { type: String, required: true, select: false },
    scope: { type: String, default: '' },
    status: { type: String, enum: ['active', 'disconnected'], default: 'active', index: true },
    installedAt: { type: Date, default: () => new Date() },
    lastSyncAt: { type: Date },
    productCount: { type: Number, default: 0 },
    inventoryCount: { type: Number, default: 0 },
    healthScore: { type: Number, default: 0, min: 0, max: 100 },
  },
  { timestamps: true }
);

StoreSchema.index({ organizationId: 1, status: 1 });

export const Store: Model<IStore> = models.Store || model<IStore>('Store', StoreSchema);
