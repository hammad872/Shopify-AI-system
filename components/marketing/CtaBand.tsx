import Link from 'next/link';
import { Reveal } from './Reveal';

export function CtaBand() {
  return (
    <section className="px-5 pb-24">
      <Reveal className="relative mx-auto max-w-5xl">
        <div className="rounded-3xl p-[1.5px] bg-grad">
          <div className="relative overflow-hidden rounded-3xl bg-[#0B1226] px-8 py-16 text-center">
            <div className="aurora -top-10 left-1/3 h-56 w-56 bg-blue/30" />
            <div className="aurora bottom-0 right-1/3 h-56 w-56 bg-green/30" />
            <h2 className="relative font-display text-4xl font-bold tracking-tight text-mist sm:text-5xl">Stop clicking. Start telling.</h2>
            <p className="relative mx-auto mt-4 max-w-md text-mist/65">Connect your store and run your first command in under two minutes.</p>
            <Link href="/signup" className="bg-grad relative mt-8 inline-block rounded-xl px-7 py-3.5 font-semibold text-white shadow-xl shadow-blue/30">Connect your store free</Link>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
