export function SafeByDesign() {
  return (
    <section id="safe" className="relative py-28">
      <div className="mx-auto max-w-7xl px-5">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div className="reveal">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-sky">Safe by design</p>
            <h2 className="mt-3 font-display text-4xl font-bold tracking-tight sm:text-5xl">AI proposes.<br />You approve.</h2>
            <p className="mt-5 text-fog/65">StorePilot can read your store freely — but it can&apos;t change a single thing without your explicit yes. The approval gate isn&apos;t a setting you can forget to turn on. It&apos;s how the whole system works.</p>
            <ul className="mt-7 space-y-4">
              <li className="flex gap-3"><span className="mt-0.5 text-green">●</span><div><p className="font-semibold">Nothing runs unreviewed</p><p className="text-sm text-fog/55">Every write is shown as a plan you confirm first.</p></div></li>
              <li className="flex gap-3"><span className="mt-0.5 text-green">●</span><div><p className="font-semibold">Full audit trail</p><p className="text-sm text-fog/55">Every action the AI takes is logged — what, when, and the result.</p></div></li>
              <li className="flex gap-3"><span className="mt-0.5 text-green">●</span><div><p className="font-semibold">Your token, encrypted</p><p className="text-sm text-fog/55">Store access is encrypted at rest and never exposed to the AI.</p></div></li>
            </ul>
          </div>

          <div className="reveal">
            <div className="grad-border float rounded-2xl p-2">
              <div className="rounded-xl bg-[#0E1730] p-5 ring-1 ring-white/5">
                <div className="mb-4 flex items-center gap-2 text-xs text-fog/50"><span className="h-2 w-2 rounded-full bg-[#febc2e]" /> Plan ready — needs your approval</div>
                <p className="text-sm text-fog/85">Drop the price of all clearance items by 15%.</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between rounded-lg bg-black/30 px-3 py-2 text-xs"><span className="text-fog/70">Faded Hoodie</span><span className="font-mono text-fog/50">$60 → <span className="text-mint">$51</span></span></div>
                  <div className="flex items-center justify-between rounded-lg bg-black/30 px-3 py-2 text-xs"><span className="text-fog/70">Classic Cap</span><span className="font-mono text-fog/50">$20 → <span className="text-mint">$17</span></span></div>
                  <div className="flex items-center justify-between rounded-lg bg-black/30 px-3 py-2 text-xs"><span className="text-fog/70">+ 12 more</span><span className="font-mono text-fog/40">−15% each</span></div>
                </div>
                <div className="mt-5 flex gap-2">
                  <button className="grad-btn flex-1 rounded-lg py-2.5 text-sm font-semibold text-white">Approve</button>
                  <button className="flex-1 rounded-lg border border-white/15 bg-white/5 py-2.5 text-sm font-semibold text-fog/80 transition hover:bg-white/10">Reject</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
