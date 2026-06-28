import { CreditCard, Zap } from 'lucide-react';

export default function Billing() {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">Subscription</p>
      <h1 className="app-page-title mt-1">Billing</h1>
      <p className="app-page-subtitle">Manage your plan and usage.</p>

      <div className="app-card mt-6">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-teal/10 ring-1 ring-teal/25">
            <Zap size={20} className="text-teal" />
          </div>
          <div>
            <p className="font-display text-lg font-semibold text-mist">Starter plan</p>
            <p className="mt-1 text-sm text-mist/55">Currently active for all accounts — 1 store, 500 AI requests per month.</p>
          </div>
        </div>
      </div>

      <div className="app-card mt-4">
        <div className="flex items-center gap-2">
          <CreditCard size={16} className="text-mist/50" />
          <p className="font-semibold text-mist/90">Stripe integration</p>
        </div>
        <p className="mt-3 text-sm text-mist/55">
          Billing is turned off for now — every account runs on Starter limits, enforced in{' '}
          <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-teal">lib/usage.ts</code>.
        </p>
        <p className="mt-3 text-sm text-mist/55">
          Stripe is wired but dormant:{' '}
          <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-teal">lib/stripe.ts</code>,{' '}
          <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-teal">actions/billing.ts</code>, and{' '}
          <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-teal">app/api/stripe/*</code>{' '}
          activate automatically once you set the Stripe env vars.
        </p>
      </div>
    </div>
  );
}
