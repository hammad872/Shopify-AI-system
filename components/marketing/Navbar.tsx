'use client';
import Link from 'next/link';
import { useState } from 'react';
import { Logo } from './Logo';

const links = [
  { href: '#how', label: 'How it works' },
  { href: '#do', label: 'What you can do' },
  { href: '#safe', label: 'Safety' },
  { href: '#pricing', label: 'Pricing' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  return (
    <header className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-5">
        <nav className="mt-4 flex items-center justify-between rounded-2xl border border-white/10 bg-navy/70 px-4 py-3 backdrop-blur-xl">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo className="h-9 w-9" />
            <span className="font-display text-xl font-bold tracking-tight text-fog">StorePilot</span>
          </Link>

          <div className="hidden items-center gap-8 md:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="text-sm text-fog/70 transition hover:text-fog">{l.label}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm text-fog/80 transition hover:text-fog sm:block">Log in</Link>
            <Link href="/signup" className="grad-btn rounded-xl px-4 py-2 text-sm font-semibold text-white shadow-lg shadow-royal/20 transition">Start free</Link>
            <button onClick={() => setOpen(!open)} className="text-fog md:hidden" aria-label="Menu">☰</button>
          </div>
        </nav>

        {open && (
          <div className="mt-2 rounded-2xl border border-white/10 bg-navy/90 p-4 backdrop-blur-xl md:hidden">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="block py-2 text-sm text-fog/80">{l.label}</a>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
