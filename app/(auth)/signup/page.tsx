'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  async function submit() {
    const res = await fetch('/api/auth/signup', { method: 'POST', body: JSON.stringify(form) });
    const data = await res.json();
    if (!data.ok) setError(data.error ?? 'Signup failed');
    else setDone(true);
  }

  if (done) return <main className="mx-auto max-w-sm px-6 py-24"><h1 className="text-2xl font-semibold">Check your email</h1><p className="mt-3 text-muted">We sent a verification link. (Wire up the email service in Phase 3.)</p><Link href="/login" className="mt-4 inline-block text-brand">Back to login</Link></main>;

  return (
    <main className="mx-auto max-w-sm px-6 py-24">
      <h1 className="text-2xl font-semibold">Create your account</h1>
      {error && <p className="mt-3 text-sm text-red-400">{error}</p>}
      <div className="mt-6 space-y-3">
        <input className="w-full rounded-lg border border-border bg-surface px-3 py-2" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="w-full rounded-lg border border-border bg-surface px-3 py-2" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="w-full rounded-lg border border-border bg-surface px-3 py-2" placeholder="Password (8+ chars)" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
        <button onClick={submit} className="w-full rounded-lg bg-brand px-4 py-2 font-medium">Sign up</button>
      </div>
      <p className="mt-4 text-sm text-muted">Have an account? <Link href="/login" className="text-brand">Log in</Link></p>
    </main>
  );
}
