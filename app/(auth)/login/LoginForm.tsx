'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { ButtonLoader } from '@/components/app/ButtonLoader';

const AUTH_ERRORS: Record<string, string> = {
  OAuthSignin: 'Could not start Google sign-in. Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.',
  OAuthCallback: 'Google callback failed. Ensure NEXTAUTH_URL matches your dev server (e.g. http://localhost:3000) and the redirect URI is set in Google Cloud Console.',
  OAuthAccountNotLinked: 'This email is already registered with a different sign-in method. Use email/password instead.',
  AccessDenied: 'Sign-in was denied. This often means the database could not be reached — see DatabaseConnection below.',
  Configuration: 'Auth is misconfigured. Check NEXTAUTH_SECRET and provider credentials.',
  DatabaseConnection:
    'Could not reach MongoDB. In MongoDB Atlas: open Network Access → Add IP Address → Allow access from anywhere (0.0.0.0/0) for local dev. Then restart the dev server and try again.',
  InvalidToken: 'That verification link is invalid or expired. Sign up again or contact support.',
  Default: 'Sign-in failed. Please try again.',
};

const CREDENTIAL_ERRORS: Record<string, string> = {
  DATABASE_CONNECTION: AUTH_ERRORS.DatabaseConnection,
  UNVERIFIED_EMAIL:
    'Your email is not verified yet. Check your inbox for the verification link, or sign up again.',
};

type LoadingState = 'credentials' | 'google' | null;

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState<LoadingState>(null);

  const oauthError = searchParams.get('error');
  const verified = searchParams.get('verified') === '1';
  const displayError =
    error || (oauthError ? AUTH_ERRORS[oauthError] ?? AUTH_ERRORS.Default : '');
  const busy = loading !== null;

  async function submit() {
    if (busy) return;
    setError('');
    setLoading('credentials');
    try {
      const res = await signIn('credentials', { email, password, redirect: false });
      if (res?.error) {
        setError(CREDENTIAL_ERRORS[res.error] ?? 'Invalid email or password.');
        return;
      }
      router.push('/dashboard');
    } finally {
      setLoading(null);
    }
  }

  function loginWithGoogle() {
    if (busy) return;
    setError('');
    setLoading('google');
    signIn('google', { callbackUrl: '/dashboard' });
  }

  return (
    <>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">Welcome back</p>
      <h1 className="app-page-title mt-2">Log in</h1>
      <p className="app-page-subtitle">Pick up where you left off with your store.</p>
      {verified && (
        <p className="app-alert-success mt-4">Email verified — you can log in now.</p>
      )}
      {displayError && <p className="app-alert-error mt-4">{displayError}</p>}
      <div className="mt-6 space-y-3">
        <input className="app-input" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} disabled={busy} />
        <input className="app-input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} disabled={busy} />
        <button onClick={submit} disabled={busy} className="app-btn-primary w-full disabled:cursor-not-allowed">
          {loading === 'credentials' ? <ButtonLoader label="Log in" loadingLabel="Logging in…" /> : 'Log in'}
        </button>
        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div>
          <div className="relative flex justify-center"><span className="bg-[#0B132B]/80 px-3 text-xs text-mist/40">or</span></div>
        </div>
        <button onClick={loginWithGoogle} disabled={busy} className="app-btn-secondary flex w-full items-center justify-center gap-2 disabled:cursor-not-allowed">
          {loading === 'google' ? (
            <ButtonLoader label="Continue with Google" loadingLabel="Redirecting…" />
          ) : (
            <>
              <svg className="h-4 w-4" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Continue with Google
            </>
          )}
        </button>
      </div>
      <p className="mt-6 text-center text-sm text-mist/50">
        No account? <Link href="/signup" className="app-link font-medium">Sign up free</Link>
      </p>
      <p className="mt-2 text-center text-sm">
        <Link href="/forgot-password" className="text-mist/40 transition hover:text-mist/70">Forgot password?</Link>
      </p>
    </>
  );
}
