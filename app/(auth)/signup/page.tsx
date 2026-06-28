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

  if (done) {
    return (
      <>
        <h1 className="app-page-title">Check your email</h1>
        <p className="app-page-subtitle">We sent a verification link. Open it to activate your account.</p>
        <Link href="/login" className="app-btn-primary mt-6 inline-block w-full text-center">Back to login</Link>
      </>
    );
  }

  return (
    <>
      <h1 className="app-page-title">Create your account</h1>
      <p className="app-page-subtitle">Connect your store and start running commands in minutes.</p>
      {error && <p className="mt-4 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300">{error}</p>}
      <div className="mt-6 space-y-3">
        <input className="app-input" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
        <input className="app-input" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
        <input className="app-input" placeholder="Password (8+ chars)" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && submit()} />
        <button onClick={submit} className="app-btn-primary w-full">Sign up</button>
      </div>
      <p className="mt-6 text-center text-sm text-fog/50">
        Have an account? <Link href="/login" className="app-link">Log in</Link>
      </p>
    </>
  );
}
