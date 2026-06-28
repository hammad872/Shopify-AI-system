'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">Account recovery</p>
      <h1 className="app-page-title mt-2">Reset password</h1>
      {sent ? (
        <>
          <div className="mx-auto mb-4 mt-4 flex h-12 w-12 items-center justify-center rounded-full bg-teal/15 ring-1 ring-teal/30">
            <span className="text-lg text-teal">✉</span>
          </div>
          <p className="app-page-subtitle text-center">
            If an account exists for <span className="font-medium text-mist">{email}</span>, a reset link is on its way.
          </p>
        </>
      ) : (
        <>
          <p className="app-page-subtitle">Enter your email and we&apos;ll send a reset link.</p>
          <div className="mt-6 space-y-3">
            <input className="app-input" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setSent(true)} />
            <button onClick={() => setSent(true)} className="app-btn-primary w-full">Send reset link</button>
          </div>
        </>
      )}
      <p className="mt-6 text-center text-sm">
        <Link href="/login" className="app-link">← Back to login</Link>
      </p>
    </>
  );
}
