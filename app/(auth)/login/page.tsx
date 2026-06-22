'use client';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function submit() {
    const res = await signIn('credentials', { email, password, redirect: false });
    if (res?.error) setError('Invalid credentials or unverified email.');
    else router.push('/dashboard');
  }

  return (
    <main className="mx-auto max-w-sm px-6 py-24">
      <h1 className="text-2xl font-semibold">Log in</h1>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      <div className="mt-6 space-y-3">
        <input className="w-full rounded-lg border border-border bg-surface px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="w-full rounded-lg border border-border bg-surface px-3 py-2" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={submit} className="w-full rounded-lg bg-brand px-4 py-2 font-medium">Log in</button>
        <button onClick={() => signIn('google', { callbackUrl: '/dashboard' })} className="w-full rounded-lg border border-border px-4 py-2">Continue with Google</button>
      </div>
      <p className="mt-4 text-sm text-muted">No account? <Link href="/signup" className="text-brand">Sign up</Link></p>
      <p className="mt-1 text-sm"><Link href="/forgot-password" className="text-muted">Forgot password?</Link></p>
    </main>
  );
}
