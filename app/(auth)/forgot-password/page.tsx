'use client';
import { useState } from 'react';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  // TODO: wire to a /api/auth/reset route that sets resetToken + emails a link (Phase 3).
  return (
    <main className="mx-auto max-w-sm px-6 py-24">
      <h1 className="text-2xl font-semibold">Reset password</h1>
      {sent ? (
        <p className="mt-3 text-muted">If an account exists for {email}, a reset link is on its way.</p>
      ) : (
        <div className="mt-6 space-y-3">
          <input className="w-full rounded-lg border border-border bg-surface px-3 py-2" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <button onClick={() => setSent(true)} className="w-full rounded-lg bg-brand px-4 py-2 font-medium">Send reset link</button>
        </div>
      )}
    </main>
  );
}
