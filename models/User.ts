import { Schema, model, models, type Model, type Types } from 'mongoose';

export type PlatformRole = 'user' | 'superadmin';
export type AuthProvider = 'credentials' | 'google';

export interface IUser {
  _id: Types.ObjectId;
  organizationId: Types.ObjectId;
  name: string;
  email: string;
  passwordHash?: string;
  provider: AuthProvider;
  googleId?: string;
  image?: string;
  role: PlatformRole;
  emailVerified: boolean;
  verificationToken?: string;
  verificationTokenExpiry?: Date;
  resetToken?: string;
  resetTokenExpiry?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    organizationId: { type: Schema.Types.ObjectId, ref: 'Organization', required: true, index: true },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false },
    provider: { type: String, enum: ['credentials', 'google'], required: true },
    googleId: { type: String, sparse: true },
    image: { type: String },
    role: { type: String, enum: ['user', 'superadmin'], default: 'user', index: true },
    emailVerified: { type: Boolean, default: false },
    verificationToken: { type: String, select: false },
    verificationTokenExpiry: { type: Date, select: false },
    resetToken: { type: String, select: false },
    resetTokenExpiry: { type: Date, select: false },
  },
  { timestamps: true }
);

export const User: Model<IUser> = models.User || model<IUser>('User', UserSchema);
