export function HowItWorks() {
  return (
    <section id="how" className="relative py-28">
      <div className="mx-auto max-w-7xl px-5">
        <div className="reveal mx-auto max-w-2xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky">How it works</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">Three steps, every time.</h2>
          <p className="mt-4 text-fog/60">The same simple loop whether you&apos;re fixing one product or restocking a hundred.</p>
        </div>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          <div className="reveal grad-border rounded-2xl p-6">
            <div className="font-mono text-sm text-sky">01</div>
            <h3 className="mt-3 font-display text-xl font-semibold">Say it</h3>
            <p className="mt-2 text-sm text-fog/60">Type what you want in plain English — like you&apos;d message a teammate. No menus, no settings to hunt for.</p>
            <div className="mt-4 rounded-lg bg-black/30 p-3 font-mono text-xs text-fog/70">&quot;Drop the price of all clearance items by 15%&quot;</div>
          </div>
          <div className="reveal grad-border rounded-2xl p-6" style={{ transitionDelay: '.08s' }}>
            <div className="font-mono text-sm text-sky">02</div>
            <h3 className="mt-3 font-display text-xl font-semibold">Review the plan</h3>
            <p className="mt-2 text-sm text-fog/60">StorePilot shows exactly what it will change — every product, every value — before anything happens.</p>
            <div className="mt-4 space-y-1.5">
              <div className="flex items-center gap-2 rounded-lg bg-black/30 p-2 text-xs"><span className="h-1.5 w-1.5 rounded-full bg-sky" /><span className="text-fog/70">14 products affected</span></div>
              <div className="flex items-center gap-2 rounded-lg bg-black/30 p-2 text-xs"><span className="h-1.5 w-1.5 rounded-full bg-sky" /><span className="text-fog/70">Price −15% each</span></div>
            </div>
          </div>
          <div className="reveal grad-border rounded-2xl p-6" style={{ transitionDelay: '.16s' }}>
            <div className="font-mono text-sm text-sky">03</div>
            <h3 className="mt-3 font-display text-xl font-semibold">Approve — it&apos;s done</h3>
            <p className="mt-2 text-sm text-fog/60">One click runs it against Shopify. Reject and nothing changes. You&apos;re always the one who decides.</p>
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-green/30 bg-green/10 p-2.5 text-xs text-mint"><span>✓</span> Updated 14 products in 1.2s</div>
          </div>
        </div>
      </div>
    </section>
  );
}
