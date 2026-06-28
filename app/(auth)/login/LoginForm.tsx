'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const AUTH_ERRORS: Record<string, string> = {
  OAuthSignin: 'Could not start Google sign-in. Check GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env.',
  OAuthCallback: 'Google callback failed. Ensure NEXTAUTH_URL matches your dev server (e.g. http://localhost:3000) and the redirect URI is set in Google Cloud Console.',
  OAuthAccountNotLinked: 'This email is already registered with a different sign-in method. Use email/password instead.',
  AccessDenied: 'Access was denied.',
  Configuration: 'Auth is misconfigured. Check NEXTAUTH_SECRET and provider credentials.',
  Default: 'Sign-in failed. Please try again.',
};

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const oauthError = searchParams.get('error');
  const displayError = error || (oauthError ? AUTH_ERRORS[oauthError] ?? AUTH_ERRORS.Default : '');

  async function submit() {
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.error) setError('Invalid credentials or unverified email.');
    else router.push('/dashboard');
  }

  return (
    <>
      <h1 className="app-page-title">Log in</h1>
      <p className="app-page-subtitle">Welcome back. Pick up where you left off.</p>
      {displayError && <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{displayError}</p>}
      <div className="mt-6 space-y-3">
        <input className="app-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="app-input" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} />
        <button onClick={submit} className="app-btn-primary w-full">Log in</button>
        <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })} className="app-btn-secondary w-full">Continue with Google</button>
      </div>
      <p className="mt-6 text-center text-sm text-fog/50">
        No account? <Link href="/signup" className="app-link">Sign up</Link>
      </p>
      <p className="mt-2 text-center text-sm">
        <Link href="/forgot-password" className="text-fog/40 transition hover:text-fog/70">Forgot password?</Link>
      </p>
    </>
  );
}
