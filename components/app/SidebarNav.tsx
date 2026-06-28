'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const nav = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/chat', label: 'AI Chat' },
  { href: '/stores', label: 'Stores' },
  { href: '/audit', label: 'Store Audit' },
  { href: '/billing', label: 'Billing' },
];

export function SidebarNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="mt-6 space-y-1">
      {nav.map((n) => {
        const active = pathname === n.href || (n.href !== '/dashboard' && pathname.startsWith(n.href));
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`block rounded-xl px-3 py-2 text-sm transition ${
              active ? 'bg-white/10 font-medium text-fog' : 'text-fog/60 hover:bg-white/5 hover:text-fog'
            }`}
          >
            {n.label}
          </Link>
        );
      })}
      {isAdmin && (
        <Link
          href="/admin"
          className={`block rounded-xl px-3 py-2 text-sm transition ${
            pathname.startsWith('/admin') ? 'bg-amber-500/15 font-medium text-amber-300' : 'text-amber-400/80 hover:bg-amber-500/10'
          }`}
        >
          Admin
        </Link>
      )}
    </nav>
  );
}
