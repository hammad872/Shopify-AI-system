const faqs = [
  { q: 'Will it change my store without asking?', a: 'No. StorePilot can read your store on its own, but every change is shown to you as a plan first. Nothing is written to Shopify until you approve it.' },
  { q: 'How do I connect my store?', a: "Click connect, approve the install on Shopify, and you're in. No code, no developer needed. You can disconnect anytime." },
  { q: 'Do I need to know anything technical?', a: 'No. If you can describe what you want in a sentence, you can use StorePilot. It is built for merchants, not developers.' },
  { q: 'Is my data safe?', a: 'Your store access token is encrypted at rest and never shared with the AI model. Every action is logged for a complete audit trail.' },
];

export function Faq() {
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-5">
        <h2 className="reveal text-center font-display text-3xl font-bold tracking-tight sm:text-4xl">Questions, answered.</h2>
        <div className="mt-12 space-y-3">
          {faqs.map((f) => (
            <details key={f.q} className="reveal group rounded-xl border border-white/10 bg-white/[0.02] p-5 [&_summary]:cursor-pointer">
              <summary className="flex items-center justify-between font-semibold text-fog/90">{f.q}<span className="text-fog/40 transition group-open:rotate-45">+</span></summary>
              <p className="mt-3 text-sm text-fog/60">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
