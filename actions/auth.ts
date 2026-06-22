'use server';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import mongoose from 'mongoose';
import { connectDB } from '@/lib/db/connect';
import { User } from '@/models/User';
import { Organization } from '@/models/Organization';

export async function signup(input: { name: string; email: string; password: string }) {
  await connectDB();
  const email = input.email.toLowerCase().trim();
  const existing = await User.findOne({ email });
  if (existing) return { ok: false, error: 'An account with this email already exists.' };

  const passwordHash = await bcrypt.hash(input.password, 12);
  const verificationToken = crypto.randomBytes(32).toString('hex');

  // User + Organization must be created together — transaction keeps them consistent.
  const session = await mongoose.startSession();
  try {
    let userId = '';
    await session.withTransaction(async () => {
      const [user] = await User.create(
        [{
          name: input.name,
          email,
          passwordHash,
          provider: 'credentials',
          emailVerified: false,
          verificationToken,
          verificationTokenExpiry: new Date(Date.now() + 1000 * 60 * 60 * 24),
          organizationId: new mongoose.Types.ObjectId(), // placeholder, set below
        }],
        { session }
      );
      const [org] = await Organization.create(
        [{ name: `${input.name}'s store`, ownerId: user._id, plan: 'starter' }],
        { session }
      );
      user.organizationId = org._id;
      await user.save({ session });
      userId = user._id.toString();
    });
    // TODO: send verification email containing verificationToken (Phase 3 email service).
    return { ok: true, userId, verificationToken };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  } finally {
    await session.endSession();
  }
}
