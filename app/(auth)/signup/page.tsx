'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ButtonLoader } from '@/components/app/ButtonLoader';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (loading) return;
    setError('');
    setLoading(true);
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!data.ok) setError(data.error ?? 'Signup failed');
      else setDone(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <>
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green/15 ring-1 ring-green/30">
          <span className="text-lg text-green">✓</span>
        </div>
        <h1 className="app-page-title text-center">Account created</h1>
        <p className="app-page-subtitle text-center">Your account is ready. Log in to connect your store.</p>
        <Link href="/login" className="app-btn-primary mt-6 inline-block w-full text-center">Back to login</Link>
      </>
    );
  }

  return (
    <>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">Get started</p>
      <h1 className="app-page-title mt-2">Create your account</h1>
      <p className="app-page-subtitle">Connect your store and start running commands in minutes.</p>
      {error && <p className="app-alert-error mt-4">{error}</p>}
      <div className="mt-6 space-y-3">
        <input className="app-input" placeholder="Full name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} disabled={loading} />
        <input className="app-input" placeholder="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} disabled={loading} />
        <input className="app-input" placeholder="Password (8+ characters)" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && submit()} disabled={loading} />
        <button onClick={submit} disabled={loading} className="app-btn-primary w-full disabled:cursor-not-allowed">
          {loading ? <ButtonLoader label="Create account" loadingLabel="Creating account…" /> : 'Create account'}
        </button>
      </div>
      <p className="mt-6 text-center text-sm text-mist/50">
        Have an account? <Link href="/login" className="app-link font-medium">Log in</Link>
      </p>
    </>
  );
}
