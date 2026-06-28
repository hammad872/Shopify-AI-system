'use client';
import Link from 'next/link';
import { useEffect, useRef } from 'react';

const SCENARIOS = [
  {
    cmd: 'Add 20 units to every blue shirt',
    summary: "Here's the plan — adjust inventory for 3 matching products.",
    rows: ['Ocean Tee  +20', 'Cobalt Polo  +20', 'Sky Henley  +20'],
    done: 'Done — restocked 3 products (+60 units) in 0.9s',
  },
  {
    cmd: 'Write SEO meta descriptions for new arrivals',
    summary: "Here's the plan — generate meta descriptions for 5 products.",
    rows: ['Summer Tee — drafted', 'Linen Shorts — drafted', '+ 3 more — drafted'],
    done: 'Done — 5 meta descriptions written and saved',
  },
  {
    cmd: 'Build a summer collection from all t-shirts',
    summary: "Here's the plan — create 1 collection with 18 products.",
    rows: ['Create collection “Summer”', 'Add 18 matching t-shirts', 'Publish to online store'],
    done: 'Done — “Summer” collection live with 18 products',
  },
];

export function Hero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const demoRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const demo = demoRef.current;
    const inputEl = inputRef.current;
    const root = rootRef.current;
    if (!demo || !inputEl || !root) return;

    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
    let running = false;
    let loopTimer: ReturnType<typeof setTimeout>;
    let current = 0;
    let cancelled = false;

    const bubble = (side: 'user' | 'ai', html: string, cls = '') => {
      const wrap = document.createElement('div');
      wrap.className = side === 'user' ? 'flex justify-end' : 'flex justify-start';
      wrap.innerHTML = `<div class="max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${cls}">${html}</div>`;
      demo.appendChild(wrap);
      return wrap;
    };

    const planCard = (s: (typeof SCENARIOS)[number]) => {
      const rows = s.rows
        .map(
          (r) =>
            `<div class="flex items-center gap-2 rounded-lg bg-black/30 px-3 py-1.5 text-xs text-fog/70"><span class="h-1.5 w-1.5 rounded-full bg-sky"></span>${r}</div>`
        )
        .join('');
      const wrap = document.createElement('div');
      wrap.className = 'flex justify-start';
      wrap.innerHTML = `<div class="w-[85%] rounded-2xl border border-white/10 bg-white/[0.03] p-3">
          <p class="mb-2 text-sm text-fog/85">${s.summary}</p>
          <div class="space-y-1.5">${rows}</div>
          <div class="mt-3 flex gap-2">
            <button class="grad-btn flex-1 rounded-lg py-2 text-xs font-semibold text-white">Approve</button>
            <button class="flex-1 rounded-lg border border-white/15 bg-white/5 py-2 text-xs font-semibold text-fog/70">Reject</button>
          </div>
        </div>`;
      demo.appendChild(wrap);
      return wrap;
    };

    const typeInto = async (text: string) => {
      inputEl.textContent = '';
      if (reduce) { inputEl.textContent = text; return; }
      for (let i = 0; i < text.length; i++) {
        if (cancelled) return;
        inputEl.textContent += text[i];
        await sleep(28);
      }
    };

    const runScenario = async (idx: number) => {
      if (running || cancelled) return;
      running = true;
      demo.innerHTML = '';
      inputEl.textContent = '';
      const s = SCENARIOS[idx];

      await typeInto(s.cmd);
      await sleep(reduce ? 0 : 450);
      if (cancelled) return;
      bubble('user', s.cmd, 'bg-gradient-to-br from-royal to-green text-white');
      inputEl.textContent = '';

      await sleep(reduce ? 0 : 600);
      if (cancelled) return;
      const thinking = bubble('ai', '<span class="text-fog/50">StorePilot is thinking…</span>', 'bg-white/[0.04] text-fog/80');
      await sleep(reduce ? 0 : 900);
      thinking.remove();

      const card = planCard(s);
      await sleep(reduce ? 0 : 1300);
      if (cancelled) return;

      const actions = card.querySelector('.flex.gap-2');
      const inner = card.querySelector('div');
      actions?.remove();
      inner?.insertAdjacentHTML(
        'beforeend',
        `<div class="mt-2 flex items-center gap-2 rounded-lg border border-green/30 bg-green/10 px-3 py-2 text-xs text-mint"><span>✓</span>${s.done}</div>`
      );
      running = false;
    };

    const stopLoop = () => clearTimeout(loopTimer);

    const loop = async () => {
      await runScenario(current);
      current = (current + 1) % SCENARIOS.length;
      if (!cancelled) loopTimer = setTimeout(loop, reduce ? 4000 : 3200);
    };

    const chipHandler = (e: Event) => {
      const btn = e.currentTarget as HTMLElement;
      if (!running) { stopLoop(); runScenario(Number(btn.dataset.cmd)); }
    };
    const chips = root.querySelectorAll<HTMLElement>('.chip');
    chips.forEach((c) => c.addEventListener('click', chipHandler));

    const startObs = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) { startObs.disconnect(); loop(); } },
      { threshold: 0.3 }
    );
    startObs.observe(demo);

    return () => {
      cancelled = true;
      stopLoop();
      startObs.disconnect();
      chips.forEach((c) => c.removeEventListener('click', chipHandler));
    };
  }, []);

  return (
    <section className="relative pb-24 pt-40">
      <div className="glow -top-20 left-1/4 h-72 w-72 bg-royal/40" />
      <div className="glow right-1/4 top-10 h-80 w-80 bg-green/30" />
      <div className="noise absolute inset-0 opacity-60" />

      <div ref={rootRef} className="relative mx-auto max-w-7xl px-5 text-center">
        <div className="reveal mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs font-medium text-fog/80">
          <span className="h-1.5 w-1.5 rounded-full bg-green" />
          Your store, run by conversation
        </div>

        <h1 className="reveal font-display text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          Tell Shopify<br /><span className="grad-text">what to do.</span>
        </h1>

        <p className="reveal mx-auto mt-6 max-w-xl text-lg text-fog/65">
          StorePilot turns plain English into real store changes. Say what you want, see exactly what it&apos;ll do, approve it — done. No dashboards to dig through.
        </p>

        <div className="reveal mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link href="/signup" className="grad-btn w-full rounded-xl px-6 py-3.5 font-semibold text-white shadow-xl shadow-royal/25 transition sm:w-auto">Connect your store free</Link>
          <a href="#how" className="w-full rounded-xl border border-white/15 bg-white/5 px-6 py-3.5 font-semibold text-fog/90 transition hover:bg-white/10 sm:w-auto">See how it works</a>
        </div>

        <p className="reveal mt-4 text-xs text-fog/45">No code. Nothing changes without your approval.</p>

        <div className="reveal float relative mx-auto mt-16 max-w-3xl">
          <div className="grad-border rounded-2xl p-2 shadow-2xl shadow-black/50">
            <div className="rounded-xl bg-[#0E1730] ring-1 ring-white/5">
              <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
                <span className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
                <span className="h-3 w-3 rounded-full bg-[#febc2e]/80" />
                <span className="h-3 w-3 rounded-full bg-[#28c840]/80" />
                <span className="ml-3 font-mono text-xs text-fog/40">storepilot — acme.myshopify.com</span>
              </div>
              <div ref={demoRef} className="min-h-[300px] space-y-4 p-5 text-left" />
              <div className="flex items-center gap-2 border-t border-white/5 px-5 py-3">
                <span className="font-mono text-green">$</span>
                <span ref={inputRef} className="cursor-blink font-mono text-sm text-fog/90" />
              </div>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
            <span className="mr-1 text-xs text-fog/40">Try:</span>
            <button data-cmd="0" className="chip rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-fog/70 transition hover:border-sky/40 hover:text-fog">Restock blue shirts</button>
            <button data-cmd="1" className="chip rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-fog/70 transition hover:border-sky/40 hover:text-fog">Write SEO for new arrivals</button>
            <button data-cmd="2" className="chip rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-fog/70 transition hover:border-sky/40 hover:text-fog">Build a summer collection</button>
          </div>
        </div>
      </div>
    </section>
  );
}
