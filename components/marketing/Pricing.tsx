import Link from 'next/link';
import { PLAN_LIMITS } from '@/models/Organization';

const plans = [
  {
    id: 'starter' as const,
    name: 'Starter',
    price: 29,
    tagline: 'For a single growing store.',
    features: ['All actions + approvals', 'Audit log'],
    ctaClass: 'block rounded-xl border border-white/15 bg-white/5 py-2.5 text-center text-sm font-semibold transition hover:bg-white/10',
    highlighted: false,
  },
  {
    id: 'growth' as const,
    name: 'Growth',
    price: 99,
    tagline: 'For busy multi-store sellers.',
    features: ['Bulk actions', 'Priority execution'],
    ctaClass: 'grad-btn block rounded-xl py-2.5 text-center text-sm font-semibold text-white',
    highlighted: true,
  },
  {
    id: 'agency' as const,
    name: 'Agency',
    price: 299,
    tagline: 'For agencies running client stores.',
    features: ['Team seats', 'Per-client audit logs'],
    ctaClass: 'block rounded-xl border border-white/15 bg-white/5 py-2.5 text-center text-sm font-semibold transition hover:bg-white/10',
    highlighted: false,
  },
];

function formatLimit(n: number, label: string) {
  if (n === Infinity) return `Unlimited ${label}`;
  return `${n.toLocaleString()} ${label}`;
}

export function Pricing() {
  return (
    <section id="pricing" className="relative py-28">
      <div className="glow bottom-0 right-1/4 h-72 w-72 bg-green/20" />
      <div className="mx-auto max-w-7xl px-5">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-green">Pricing</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">Start free. Scale when it pays off.</h2>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {plans.map((p) => {
            const limits = PLAN_LIMITS[p.id];
            const storeLabel = limits.stores === 1 ? 'store' : 'stores';
            const storeText = limits.stores === Infinity ? 'Unlimited stores' : `${limits.stores} ${storeLabel}`;
            const requestText = formatLimit(limits.aiRequests, 'AI requests / mo');

            const card = (
              <>
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-lg font-semibold">{p.name}</h3>
                  {p.highlighted && (
                    <span className="rounded-full bg-green/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-mint">Popular</span>
                  )}
                </div>
                <p className="mt-3"><span className="font-display text-4xl font-bold">${p.price}</span><span className="text-fog/50">/mo</span></p>
                <p className="mt-1 text-sm text-fog/50">{p.tagline}</p>
                <Link href="/signup" className={`mt-6 ${p.ctaClass}`}>Choose {p.name}</Link>
                <ul className={`mt-6 space-y-3 text-sm ${p.highlighted ? 'text-fog/75' : 'text-fog/65'}`}>
                  <li className="flex gap-2"><span className="text-green">✓</span> {storeText}</li>
                  <li className="flex gap-2"><span className="text-green">✓</span> {requestText}</li>
                  {p.features.map((f) => (
                    <li key={f} className="flex gap-2"><span className="text-green">✓</span> {f}</li>
                  ))}
                </ul>
              </>
            );

            if (p.highlighted) {
              return (
                <div key={p.id} className="reveal relative rounded-2xl p-[1.5px]" style={{ background: 'linear-gradient(140deg,#2563EB,#22C55E)' }}>
                  <div className="rounded-2xl bg-[#0E1730] p-7">{card}</div>
                </div>
              );
            }

            return (
              <div key={p.id} className="reveal grad-border rounded-2xl p-7">{card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
