'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  MessageSquare,
  Store,
  ClipboardCheck,
  CreditCard,
  Shield,
} from 'lucide-react';

const nav = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/chat', label: 'AI Chat', icon: MessageSquare },
  { href: '/stores', label: 'Stores', icon: Store },
  { href: '/audit', label: 'Store Audit', icon: ClipboardCheck },
  { href: '/billing', label: 'Billing', icon: CreditCard },
];

export function SidebarNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <nav className="mt-6 space-y-1">
      {nav.map((n) => {
        const active = pathname === n.href || (n.href !== '/dashboard' && pathname.startsWith(n.href));
        const Icon = n.icon;
        return (
          <Link
            key={n.href}
            href={n.href}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition ${
              active
                ? 'bg-gradient-to-r from-blue/15 to-teal/10 font-medium text-mist ring-1 ring-teal/20'
                : 'text-mist/55 hover:bg-white/5 hover:text-mist'
            }`}
          >
            <Icon size={16} className={active ? 'text-teal' : 'text-mist/40'} />
            {n.label}
          </Link>
        );
      })}
      {isAdmin && (
        <Link
          href="/admin"
          className={`mt-2 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition ${
            pathname.startsWith('/admin')
              ? 'bg-amber-500/15 font-medium text-amber-300 ring-1 ring-amber-500/25'
              : 'text-amber-400/70 hover:bg-amber-500/10 hover:text-amber-300'
          }`}
        >
          <Shield size={16} />
          Admin
        </Link>
      )}
    </nav>
  );
}
