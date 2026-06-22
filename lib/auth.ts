import type { NextAuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import bcrypt from 'bcryptjs';
import { connectDB } from '@/lib/db/connect';
import { User } from '@/models/User';
import { Organization } from '@/models/Organization';

export const authOptions: NextAuthOptions = {
  session: { strategy: 'jwt' },
  secret: process.env.NEXTAUTH_SECRET,
  pages: { signIn: '/login' },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: { email: { type: 'email' }, password: { type: 'password' } },
      async authorize(creds) {
        if (!creds?.email || !creds?.password) return null;
        await connectDB();
        const user = await User.findOne({ email: creds.email.toLowerCase() }).select('+passwordHash');
        if (!user?.passwordHash) return null;
        const ok = await bcrypt.compare(creds.password, user.passwordHash);
        if (!ok) return null;
        if (!user.emailVerified) throw new Error('Please verify your email first.');
        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          // custom fields forwarded into the jwt callback
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
    // On Google sign-in, create a User + Organization the first time we see them.
    async signIn({ user, account }) {
      if (account?.provider !== 'google') return true;
      await connectDB();
      const existing = await User.findOne({ email: user.email?.toLowerCase() });
      if (existing) return true;
      const newUser = new User({
        organizationId: undefined,
        name: user.name ?? 'Merchant',
        email: user.email!.toLowerCase(),
        provider: 'google',
        googleId: (account.providerAccountId as string) ?? undefined,
        image: user.image ?? undefined,
        emailVerified: true,
      });
      const org = await Organization.create({ name: `${newUser.name}'s org`, ownerId: newUser._id, plan: 'starter' });
      newUser.organizationId = org._id;
      await newUser.save();
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.uid = (user as any).id ?? token.uid;
        token.organizationId = (user as any).organizationId;
        token.role = (user as any).role;
      }
      // Hydrate org/role for Google logins where authorize() didn't run.
      if (!token.organizationId && token.email) {
        await connectDB();
        const dbUser = await User.findOne({ email: token.email.toLowerCase() });
        if (dbUser) {
          token.uid = dbUser._id.toString();
          token.organizationId = dbUser.organizationId.toString();
          token.role = dbUser.role;
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
