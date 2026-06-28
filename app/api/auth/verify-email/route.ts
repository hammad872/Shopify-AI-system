import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/connect';
import { User } from '@/models/User';

/** Verify email from signup token (for when email delivery is wired up). */
export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token');
  if (!token) {
    return NextResponse.redirect(new URL('/login?error=InvalidToken', req.url));
  }

  try {
    await connectDB();
    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    }).select('+verificationToken +verificationTokenExpiry');

    if (!user) {
      return NextResponse.redirect(new URL('/login?error=InvalidToken', req.url));
    }

    user.emailVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    return NextResponse.redirect(new URL('/login?verified=1', req.url));
  } catch {
    return NextResponse.redirect(new URL('/login?error=DatabaseConnection', req.url));
  }
}
