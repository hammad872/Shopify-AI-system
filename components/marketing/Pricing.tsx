import Link from 'next/link';
import { Reveal } from './Reveal';
import { Check } from 'lucide-react';

const tiers = [
  { id: 'starter', name: 'Starter', price: 29, blurb: 'For a single growing store.', feats: ['1 store', '500 AI requests / mo', 'All actions + approvals', 'Audit log'], featured: false },
  { id: 'growth', name: 'Growth', price: 99, blurb: 'For busy multi-store sellers.', feats: ['3 stores', '5,000 AI requests / mo', 'Bulk actions', 'Priority execution'], featured: true },
  { id: 'agency', name: 'Agency', price: 299, blurb: 'For agencies running client stores.', feats: ['Unlimited stores', 'Unlimited AI requests', 'Team seats', 'Per-client audit logs'], featured: false },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-28">
      <div className="aurora bottom-0 right-1/4 h-72 w-72 bg-green/20" />
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-green">Pricing</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-mist sm:text-5xl">Start free. Scale when it pays off.</h2>
        </Reveal>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {tiers.map((t, i) => (
            <Reveal key={t.id} delay={i * 0.08}>
              {t.featured ? (
                <div className="rounded-2xl p-[1.5px] bg-grad transition duration-300 hover:-translate-y-1">
                  <div className="h-full rounded-2xl bg-[#0E1730] p-7">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display text-lg font-semibold text-mist">{t.name}</h3>
                      <span className="rounded-full bg-green/15 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-green">Popular</span>
                    </div>
                    <p className="mt-3 font-display text-4xl font-bold text-mist">${t.price}<span className="text-base font-normal text-mist/50">/mo</span></p>
                    <p className="mt-1 text-sm text-mist/50">{t.blurb}</p>
                    <Link href="/signup" className="bg-grad mt-6 block rounded-xl py-2.5 text-center text-sm font-semibold text-white">Choose {t.name}</Link>
                    <ul className="mt-6 space-y-3 text-sm text-mist/75">
                      {t.feats.map((f) => <li key={f} className="flex gap-2"><Check size={16} className="text-green" /> {f}</li>)}
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="ring-grad h-full rounded-2xl bg-navy/40 p-7 transition duration-300 hover:-translate-y-1">
                  <h3 className="font-display text-lg font-semibold text-mist">{t.name}</h3>
                  <p className="mt-3 font-display text-4xl font-bold text-mist">${t.price}<span className="text-base font-normal text-mist/50">/mo</span></p>
                  <p className="mt-1 text-sm text-mist/50">{t.blurb}</p>
                  <Link href="/signup" className="mt-6 block rounded-xl border border-white/15 bg-white/5 py-2.5 text-center text-sm font-semibold text-mist transition hover:bg-white/10">Choose {t.name}</Link>
                  <ul className="mt-6 space-y-3 text-sm text-mist/65">
                    {t.feats.map((f) => <li key={f} className="flex gap-2"><Check size={16} className="text-green" /> {f}</li>)}
                  </ul>
                </div>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
