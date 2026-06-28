import { Reveal } from './Reveal';

const steps = [
  { n: '01', title: 'Say it', body: 'Type what you want in plain English — like messaging a teammate. No menus, no settings to hunt for.', tag: '"Drop clearance prices by 15%"' },
  { n: '02', title: 'Review the plan', body: 'Mareura shows exactly what it will change — every product, every value — before anything happens.', tag: '14 products · −15% each' },
  { n: '03', title: 'Approve — it\u2019s done', body: 'One click runs it against Shopify. Reject and nothing changes. You always decide.', tag: '✓ Updated 14 in 1.2s' },
];

export function HowItWorks() {
  return (
    <section id="how" className="relative py-28">
      <div className="mx-auto max-w-7xl px-5">
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">How it works</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-mist sm:text-5xl">Three steps, every time.</h2>
          <p className="mt-4 text-mist/60">The same loop whether you&apos;re fixing one product or restocking a hundred.</p>
        </Reveal>

        <div className="relative mt-16 grid gap-6 md:grid-cols-3">
          <div className="absolute left-0 right-0 top-12 hidden h-px bg-gradient-to-r from-blue/40 via-teal/40 to-green/40 md:block" />
          {steps.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.1} className="relative">
              <div className="ring-grad h-full rounded-2xl bg-navy/40 p-6 transition duration-300 hover:-translate-y-1">
                <div className="font-mono text-sm text-teal">{s.n}</div>
                <h3 className="mt-3 font-display text-xl font-semibold text-mist">{s.title}</h3>
                <p className="mt-2 text-sm text-mist/60">{s.body}</p>
                <div className="mt-4 rounded-lg bg-black/30 p-3 font-mono text-xs text-mist/70">{s.tag}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
