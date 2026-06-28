import Link from 'next/link';

export function CtaBand() {
  return (
    <section className="px-5 pb-24">
      <div className="reveal relative mx-auto max-w-5xl overflow-hidden rounded-3xl p-[1.5px]" style={{ background: 'linear-gradient(120deg,#2563EB,#22C55E)' }}>
        <div className="relative overflow-hidden rounded-3xl bg-[#0B1226] px-8 py-16 text-center">
          <div className="glow left-1/3 -top-10 h-56 w-56 bg-royal/30" />
          <div className="glow bottom-0 right-1/3 h-56 w-56 bg-green/30" />
          <h2 className="relative font-display text-4xl font-bold tracking-tight sm:text-5xl">Stop clicking. Start telling.</h2>
          <p className="relative mx-auto mt-4 max-w-md text-fog/65">Connect your store and run your first command in under two minutes.</p>
          <Link href="/signup" className="grad-btn relative mt-8 inline-block rounded-xl px-7 py-3.5 font-semibold text-white shadow-xl shadow-royal/30">Connect your store free</Link>
        </div>
      </div>
    </section>
  );
}
