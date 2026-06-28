import { Reveal } from './Reveal';
import { Package, BarChart3, Sparkles, FolderTree, Activity, ArrowRight } from 'lucide-react';

const items = [
  { Icon: Package, tint: 'text-blue', bg: 'bg-blue/15', title: 'Products', desc: 'Create, edit, draft, publish, rewrite — one item or in bulk.', ex: '"Create Summer Tee at $29"' },
  { Icon: BarChart3, tint: 'text-green', bg: 'bg-green/15', title: 'Inventory', desc: 'Adjust stock up or down across variants and locations.', ex: '"Add 20 to every blue shirt"' },
  { Icon: Sparkles, tint: 'text-teal', bg: 'bg-teal/15', title: 'SEO', desc: 'Titles, meta descriptions, alt text, product copy — on brand.', ex: '"Write meta for new arrivals"' },
  { Icon: FolderTree, tint: 'text-blue', bg: 'bg-blue/15', title: 'Collections', desc: 'Group products into collections by any rule you describe.', ex: '"Winter collection from coats"' },
  { Icon: Activity, tint: 'text-green', bg: 'bg-green/15', title: 'Store audit', desc: 'Find missing SEO, low stock, drafts — with one-click fixes.', ex: '"What\u2019s hurting my store?"' },
];

export function Capabilities() {
  return (
    <section id="do" className="relative py-28">
      <div className="aurora left-0 top-40 h-72 w-72 bg-blue/20" />
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-green">Capabilities</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-mist sm:text-5xl">If you can describe it,<br />Mareura can do it.</h2>
        </Reveal>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={it.title} delay={i * 0.06}>
              <div className="ring-grad group h-full rounded-2xl bg-navy/40 p-6 transition duration-300 hover:-translate-y-1">
                <div className={`mb-4 inline-flex h-11 w-11 items-center justify-center rounded-xl ${it.bg} ${it.tint}`}><it.Icon size={20} /></div>
                <h3 className="font-display text-lg font-semibold text-mist">{it.title}</h3>
                <p className="mt-1.5 text-sm text-mist/60">{it.desc}</p>
                <p className="mt-3 font-mono text-xs text-teal/80">{it.ex}</p>
              </div>
            </Reveal>
          ))}
          <Reveal delay={0.3}>
            <div className="ring-grad flex h-full flex-col justify-between rounded-2xl bg-gradient-to-br from-blue/15 via-teal/10 to-green/15 p-6">
              <div>
                <h3 className="font-display text-lg font-semibold text-mist">…and it keeps growing.</h3>
                <p className="mt-1.5 text-sm text-mist/60">New abilities ship every week. If it&apos;s in the Shopify Admin API, it&apos;s on the roadmap.</p>
              </div>
              <a href="#" className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-grad">See the roadmap <ArrowRight size={14} /></a>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
