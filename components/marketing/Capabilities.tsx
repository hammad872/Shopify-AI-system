const items = [
  { icon: '📦', tint: 'bg-royal/15 text-royal', title: 'Products', desc: 'Create, edit, draft, publish, rewrite — one item or in bulk.', ex: '"Create a product called Summer Tee at $29"' },
  { icon: '📊', tint: 'bg-green/15 text-green', title: 'Inventory', desc: 'Adjust stock up or down across variants and locations.', ex: '"Add 20 to every blue shirt"' },
  { icon: '✨', tint: 'bg-sky/15 text-sky', title: 'SEO', desc: 'Titles, meta descriptions, alt text, product copy — on brand.', ex: '"Write meta descriptions for new arrivals"' },
  { icon: '🗂️', tint: 'bg-royal/15 text-royal', title: 'Collections', desc: 'Group products into collections by any rule you describe.', ex: '"Make a winter collection from all coats"' },
  { icon: '🩺', tint: 'bg-green/15 text-green', title: 'Store audit', desc: 'Find missing SEO, low stock, and drafts — with one-click fixes.', ex: '"What\u2019s hurting my store right now?"' },
];

export function Capabilities() {
  return (
    <section id="do" className="relative py-28">
      <div className="glow left-0 top-40 h-72 w-72 bg-royal/20" />
      <div className="mx-auto max-w-7xl px-5">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-green">What you can say</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">If you can describe it,<br />StorePilot can do it.</h2>
        </div>

        <div className="mt-16 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {items.map((it) => (
            <div key={it.title} className="reveal grad-border rounded-2xl p-6">
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${it.tint}`}>{it.icon}</div>
              <h3 className="font-display text-lg font-semibold">{it.title}</h3>
              <p className="mt-1.5 text-sm text-fog/60">{it.desc}</p>
              <p className="mt-3 font-mono text-xs text-sky/80">{it.ex}</p>
            </div>
          ))}
          <div className="reveal grad-border flex flex-col justify-between rounded-2xl bg-gradient-to-br from-royal/15 to-green/15 p-6">
            <div>
              <h3 className="font-display text-lg font-semibold">…and you grow into it.</h3>
              <p className="mt-1.5 text-sm text-fog/60">New abilities ship every week. If it&apos;s in the Shopify Admin API, it&apos;s on the roadmap.</p>
            </div>
            <a href="#do" className="grad-text mt-4 text-sm font-semibold">See the full list →</a>
          </div>
        </div>
      </div>
    </section>
  );
}
