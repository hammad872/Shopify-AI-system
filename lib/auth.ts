import type { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { Types } from 'mongoose';
import { connectDB, isDbConnectionError } from '@/lib/db/connect';
import { User } from '@/models/User';
import { Organization } from '@/models/Organization';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: '/login', error: '/login' },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: { email: { type: 'email' }, password: { type: 'password' } },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;
        try {
          await connectDB();
        } catch (err) {
          if (isDbConnectionError(err)) throw new Error('DATABASE_CONNECTION');
          throw err;
        }
        const user = await User.findOne({ email: creds.email.toLowerCase() }).select('+passwordHash');
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(creds.password, user.passwordHash);
        if (!ok) return null;
        if (!user.emailVerified) {
          if (process.env.NODE_ENV !== 'production') {
            user.emailVerified = true;
            await user.save();
          } else {
            throw new Error('UNVERIFIED_EMAIL');
          }
        }
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          organizationId: user.organizationId.toString(),
          role: user.role,
        } as any;
      },
    }),
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID ?? '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== 'google') return true;
      if (!user.email) return false;
      try {
        await connectDB();
        const existing = await User.findOne({ email: user.email.toLowerCase() });
        if (existing) return true;

        const newUser = new User({
          name: user.name ?? 'Merchant',
          email: user.email.toLowerCase(),
          provider: 'google',
          googleId: account.providerAccountId ?? undefined,
          image: user.image ?? undefined,
          emailVerified: true,
          organizationId: new Types.ObjectId(),
        });
        const org = await Organization.create({
          name: `${newUser.name}'s org`,
          ownerId: newUser._id,
          plan: 'starter',
        });
        newUser.organizationId = org._id;
        await newUser.save();
        return true;
      } catch (err) {
        console.error('Google sign-in failed:', err);
        if (isDbConnectionError(err)) return '/login?error=DatabaseConnection';
        return false;
      }
    },
    async jwt({ token, user }) {
      if (user) {
        token.uid = (user as any).id ?? token.uid;
        token.organizationId = (user as any).organizationId;
        token.role = (user as any).role;
      }
      if (!token.organizationId && token.email) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: (token.email as string).toLowerCase() });
          if (dbUser) {
            token.uid = dbUser._id.toString();
            token.organizationId = dbUser.organizationId.toString();
            token.role = dbUser.role;
          }
        } catch (err) {
          console.error('JWT session hydrate failed:', err);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.uid;
        (session.user as any).organizationId = token.organizationId;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
};
