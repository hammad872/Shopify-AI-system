export default function Billing() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">Billing</h1>
      <div className="mt-6 rounded-xl border border-dashed border-border bg-surface p-8 text-muted">
        Billing is turned off for now — every account runs on <span className="text-white">Starter</span>{' '}
        limits (1 store, 500 AI requests), enforced in <code>lib/usage.ts</code>.
        <br /><br />
        Stripe is wired but dormant: <code>lib/stripe.ts</code>, <code>actions/billing.ts</code>, and{' '}
        <code>app/api/stripe/*</code> activate automatically once you set the Stripe env vars (Phase 10).
      </div>
    </div>
  );
}
