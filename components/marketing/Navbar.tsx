'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { Logo } from './Logo';

const links = [
  { href: '#how', label: 'How it works' },
  { href: '#do', label: 'Capabilities' },
  { href: '#safe', label: 'Safety' },
  { href: '#pricing', label: 'Pricing' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.2, 0.6, 0.2, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div className="mx-auto max-w-7xl px-5">
        <nav
          className={`mt-4 flex items-center justify-between rounded-2xl border px-4 py-3 transition-all duration-300 ${
            scrolled ? 'glass border-white/10 shadow-lg shadow-black/20' : 'border-transparent bg-transparent'
          }`}
        >
          <Link href="/" className="flex items-center gap-2.5">
            <Logo className="h-9 w-9" />
            <span className="font-display text-xl font-bold tracking-tight text-mist">Mareura</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-mist/70 transition hover:text-mist">{l.label}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm text-mist/80 transition hover:text-mist sm:block">Log in</Link>
            <Link href="/signup" className="bg-grad rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-blue/20 transition">Start free</Link>
            <button onClick={() => setOpen(!open)} className="text-mist md:hidden" aria-label="Menu">
              {open ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="glass mt-2 rounded-2xl border border-white/10 p-4 md:hidden"
            >
              {links.map((l) => (
                <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-2 text-sm text-mist/80">{l.label}</a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
