'use client';
import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <>
      <h1 className="app-page-title">Reset password</h1>
      {sent ? (
        <p className="app-page-subtitle">If an account exists for {email}, a reset link is on its way.</p>
      ) : (
        <>
          <p className="app-page-subtitle">Enter your email and we&apos;ll send a reset link.</p>
          <div className="mt-6 space-y-3">
            <input className="app-input" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && setSent(true)} />
            <button onClick={() => setSent(true)} className="app-btn-primary w-full">Send reset link</button>
          </div>
        </>
      )}
      <p className="mt-6 text-center text-sm">
        <Link href="/login" className="app-link">Back to login</Link>
      </p>
    </>
  );
}
