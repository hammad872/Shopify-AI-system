import Link from 'next/link';
import { PLAN_LIMITS } from '@/models/Organization';

const plans = [
  { id: 'starter', name: 'Starter', price: 29 },
  { id: 'growth', name: 'Growth', price: 99 },
  { id: 'agency', name: 'Agency', price: 299 },
] as const;

export default function Pricing() {
  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <h1 className="text-3xl font-semibold">Pricing</h1>
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        {plans.map((p) => {
          const limits = PLAN_LIMITS[p.id];
          return (
            <div key={p.id} className="rounded-xl border border-border bg-surface p-6">
              <h2 className="text-lg font-medium">{p.name}</h2>
              <p className="mt-2 text-3xl font-semibold">${p.price}<span className="text-muted text-base font-normal">/mo</span></p>
              <ul className="mt-4 space-y-1 text-sm text-muted">
                <li>{limits.stores === Infinity ? 'Unlimited' : limits.stores} store{limits.stores === 1 ? '' : 's'}</li>
                <li>{limits.aiRequests === Infinity ? 'Unlimited' : limits.aiRequests.toLocaleString()} AI requests</li>
              </ul>
              <Link href="/signup" className="mt-6 block rounded-lg bg-brand px-4 py-2 text-center font-medium">Choose {p.name}</Link>
            </div>
          );
        })}
      </div>
    </main>
  );
}
