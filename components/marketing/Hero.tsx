'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Zap, MessageSquare, ShoppingBag } from 'lucide-react';
import { fadeUp, stagger } from './motion';

const SCENARIOS = [
  { cmd: 'Add 20 units to every blue shirt', summary: "Here's the plan — adjust inventory for 3 matching products.", rows: ['Ocean Tee  +20', 'Cobalt Polo  +20', 'Sky Henley  +20'], done: 'Done — restocked 3 products (+60 units) in 0.9s' },
  { cmd: 'Write SEO meta descriptions for new arrivals', summary: "Here's the plan — generate meta descriptions for 5 products.", rows: ['Summer Tee — drafted', 'Linen Shorts — drafted', '+ 3 more — drafted'], done: 'Done — 5 meta descriptions written and saved' },
  { cmd: 'Build a summer collection from all t-shirts', summary: "Here's the plan — create 1 collection with 18 products.", rows: ['Create collection “Summer”', 'Add 18 matching t-shirts', 'Publish to online store'], done: 'Done — “Summer” collection live with 18 products' },
];

const pills = [
  { icon: Zap, label: 'Fast execution' },
  { icon: ShieldCheck, label: 'Safe & secure' },
  { icon: MessageSquare, label: 'Plain English' },
  { icon: ShoppingBag, label: 'Built for Shopify' },
];

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const demo = demoRef.current, inputEl = inputRef.current, root = rootRef.current;
    if (!demo || !inputEl || !root) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    let running = false, cancelled = false, current = 0;
    let loopTimer: ReturnType<typeof setTimeout>;

    const bubble = (side: 'user' | 'ai', html: string, cls = '') => {
      const w = document.createElement('div');
      w.className = side === 'user' ? 'flex justify-end' : 'flex justify-start';
      w.innerHTML = `<div class="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${cls}">${html}</div>`;
      demo.appendChild(w); return w;
    };
    const planCard = (s: (typeof SCENARIOS)[number]) => {
      const rows = s.rows.map((r) => `<div class="flex items-center gap-2 rounded-lg bg-black/30 px-3 py-1.5 text-xs text-mist/70"><span class="h-1.5 w-1.5 rounded-full bg-teal"></span>${r}</div>`).join('');
      const w = document.createElement('div');
      w.className = 'flex justify-start';
      w.innerHTML = `<div class="w-[85%] rounded-2xl border border-white/10 bg-white/[0.03] p-3"><p class="mb-2 text-sm text-mist/85">${s.summary}</p><div class="space-y-1.5">${rows}</div><div class="mt-3 flex gap-2"><button class="bg-grad flex-1 rounded-lg py-2 text-xs font-semibold text-white">Approve</button><button class="flex-1 rounded-lg border border-white/15 bg-white/5 py-2 text-xs font-semibold text-mist/70">Reject</button></div></div>`;
      demo.appendChild(w); return w;
    };
    const typeInto = async (text: string) => {
      inputEl.textContent = '';
      if (reduce) { inputEl.textContent = text; return; }
      for (let i = 0; i < text.length; i++) { if (cancelled) return; inputEl.textContent += text[i]; await sleep(26); }
    };
    const run = async (idx: number) => {
      if (running || cancelled) return; running = true;
      demo.innerHTML = ''; inputEl.textContent = '';
      const s = SCENARIOS[idx];
      await typeInto(s.cmd); await sleep(reduce ? 0 : 420); if (cancelled) return;
      bubble('user', s.cmd, 'bg-grad text-white'); inputEl.textContent = '';
      await sleep(reduce ? 0 : 560); if (cancelled) return;
      const think = bubble('ai', '<span class="text-mist/50">Mareura is thinking…</span>', 'bg-white/[0.04] text-mist/80');
      await sleep(reduce ? 0 : 850); think.remove();
      const card = planCard(s); await sleep(reduce ? 0 : 1250); if (cancelled) return;
      card.querySelector('.flex.gap-2')?.remove();
      card.querySelector('div')?.insertAdjacentHTML('beforeend', `<div class="mt-2 flex items-center gap-2 rounded-lg border border-green/30 bg-green/10 px-3 py-2 text-xs text-green"><span>✓</span>${s.done}</div>`);
      running = false;
    };
    const stop = () => clearTimeout(loopTimer);
    const loop = async () => { await run(current); current = (current + 1) % SCENARIOS.length; if (!cancelled) loopTimer = setTimeout(loop, reduce ? 4200 : 3200); };
    const onChip = (e: Event) => { const b = e.currentTarget as HTMLElement; if (!running) { stop(); run(Number(b.dataset.cmd)); } };
    const chips = root.querySelectorAll<HTMLElement>('.chip');
    chips.forEach((c) => c.addEventListener('click', onChip));
    const obs = new IntersectionObserver((es) => { if (es[0].isIntersecting) { obs.disconnect(); loop(); } }, { threshold: 0.3 });
    obs.observe(demo);
    return () => { cancelled = true; stop(); obs.disconnect(); chips.forEach((c) => c.removeEventListener('click', onChip)); };
  }, []);

  return (
    <section className="relative overflow-hidden pb-24 pt-40">
      <div className="aurora -top-24 left-1/4 h-80 w-80 bg-blue/40" />
      <div className="aurora top-10 right-1/4 h-96 w-96 bg-green/30" style={{ animationDelay: '4s' }} />
      <div className="aurora top-40 left-1/2 h-72 w-72 bg-teal/30" style={{ animationDelay: '8s' }} />
      <div className="absolute inset-0 grid-bg" />

      <motion.div ref={rootRef} variants={stagger} initial="hidden" animate="show" className="relative mx-auto max-w-7xl px-5 text-center">
        <motion.div variants={fadeUp} className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-mist/80">
          <span className="h-1.5 w-1.5 rounded-full bg-green" />
          The AI command center for Shopify
        </motion.div>

        <motion.h1 variants={fadeUp} className="mx-auto max-w-4xl font-display text-5xl font-extrabold leading-[1.04] tracking-tight text-mist sm:text-6xl md:text-7xl">
          Tell your store <span className="text-grad">what to do.</span>
        </motion.h1>

        <motion.p variants={fadeUp} className="mx-auto mt-6 max-w-xl text-lg text-mist/65">
          Mareura turns plain English into real Shopify changes. Say what you want, see exactly what it&apos;ll do, approve it — done. No dashboards to dig through.
        </motion.p>

        <motion.div variants={fadeUp} className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/signup" className="bg-grad w-full rounded-xl px-6 py-3.5 font-semibold text-white shadow-xl shadow-blue/25 sm:w-auto">Connect your store free</Link>
          <a href="#how" className="w-full rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-mist/90 transition hover:bg-white/10 sm:w-auto">See how it works</a>
        </motion.div>

        <motion.div variants={fadeUp} className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-mist/50">
          {pills.map((p) => (
            <span key={p.label} className="inline-flex items-center gap-1.5"><p.icon size={13} className="text-teal" />{p.label}</span>
          ))}
        </motion.div>

        <motion.div variants={fadeUp} className="relative mx-auto mt-16 max-w-3xl" animate={{ y: [0, -8, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
          <div className="ring-grad rounded-2xl p-2 shadow-2xl shadow-black/50">
            <div className="rounded-xl bg-[#0E1730] ring-1 ring-white/5">
              <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]/80" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]/80" />
                <span className="ml-3 font-mono text-xs text-mist/40">mareura — acme.myshopify.com</span>
              </div>
              <div ref={demoRef} className="min-h-[300px] space-y-4 p-5 text-left" />
              <div className="flex items-center gap-2 border-t border-white/5 px-5 py-3">
                <span className="font-mono text-teal">$</span>
                <span ref={inputRef} className="cursor-blink font-mono text-sm text-mist/90" />
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="mr-1 text-xs text-mist/40">Try:</span>
            {['Restock blue shirts', 'Write SEO for new arrivals', 'Build a summer collection'].map((t, i) => (
              <button key={t} data-cmd={i} className="chip rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-mist/70 transition hover:border-teal/50 hover:text-mist">{t}</button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}
