export default function Billing() {
  return (
    <div className="max-w-2xl">
      <h1 className="app-page-title">Billing</h1>
      <p className="app-page-subtitle">Manage your plan and usage.</p>
      <div className="app-card mt-6 text-fog/60">
        Billing is turned off for now — every account runs on <span className="text-fog">Starter</span>{' '}
        limits (1 store, 500 AI requests), enforced in <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-sky">lib/usage.ts</code>.
        <br /><br />
        Stripe is wired but dormant: <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-sky">lib/stripe.ts</code>,{' '}
        <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-sky">actions/billing.ts</code>, and{' '}
        <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-sky">app/api/stripe/*</code> activate automatically once you set the Stripe env vars.
      </div>
    </div>
  );
}
