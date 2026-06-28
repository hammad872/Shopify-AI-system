'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus } from 'lucide-react';

const faqs = [
  { q: 'Will it change my store without asking?', a: 'No. Mareura can read your store on its own, but every change is shown to you as a plan first. Nothing is written to Shopify until you approve it.' },
  { q: 'How do I connect my store?', a: 'Click connect, approve the install on Shopify, and you\u2019re in. No code, no developer needed. You can disconnect anytime.' },
  { q: 'Do I need to know anything technical?', a: 'No. If you can describe what you want in a sentence, you can use Mareura. It\u2019s built for merchants, not developers.' },
  { q: 'Is my data safe?', a: 'Your store access token is encrypted at rest and never shared with the AI model. Every action is logged for a complete audit trail.' },
];

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="py-24">
      <div className="mx-auto max-w-3xl px-5">
        <h2 className="text-center font-display text-3xl font-bold tracking-tight text-mist sm:text-4xl">Questions, answered.</h2>
        <div className="mt-12 space-y-3">
          {faqs.map((f, i) => {
            const isOpen = open === i;
            return (
              <div key={f.q} className="overflow-hidden rounded-xl border border-white/10 bg-white/[0.02]">
                <button onClick={() => setOpen(isOpen ? null : i)} className="flex w-full items-center justify-between gap-4 p-5 text-left font-semibold text-mist/90">
                  {f.q}
                  <Plus size={18} className={`shrink-0 text-mist/40 transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.2, 0.6, 0.2, 1] }}>
                      <p className="px-5 pb-5 text-sm text-mist/60">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
