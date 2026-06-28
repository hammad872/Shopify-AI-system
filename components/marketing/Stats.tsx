'use client';
import { useEffect, useRef, useState } from 'react';
import { useInView, motion } from 'framer-motion';

function Counter({ to, suffix = '', decimals = 0 }: { to: number; suffix?: string; decimals?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!inView) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { setVal(to); return; }
    const dur = 1200; const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, to]);
  return <span ref={ref}>{val.toFixed(decimals)}{suffix}</span>;
}

const stats = [
  { to: 100, suffix: '%', label: 'Actions need your approval' },
  { to: 1.2, decimals: 1, suffix: 's', label: 'Avg time to execute a plan' },
  { to: 40, suffix: '+', label: 'Operations you can run by voice' },
  { to: 0, suffix: '', label: 'Lines of code to get started' },
];

export function Stats() {
  return (
    <section className="relative py-16">
      <div className="mx-auto max-w-5xl px-5">
        <div className="ring-grad grid gap-6 rounded-2xl bg-navy/40 p-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="text-center">
              <p className="font-display text-4xl font-bold text-grad"><Counter to={s.to} suffix={s.suffix} decimals={s.decimals ?? 0} /></p>
              <p className="mt-1.5 text-sm text-mist/55">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
