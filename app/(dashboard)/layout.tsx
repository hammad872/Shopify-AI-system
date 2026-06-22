import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionContext } from '@/lib/auth-helpers';
import SignOutButton from '@/components/SignOutButton';

const nav = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/chat', label: 'AI Chat' },
  { href: '/stores', label: 'Stores' },
  { href: '/audit', label: 'Store Audit' },
  { href: '/billing', label: 'Billing' },
];

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getSessionContext();
  if (!ctx) redirect('/login');
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 shrink-0 border-r border-border bg-surface p-4">
        <p className="px-2 font-semibold text-brand">StorePilot AI</p>
        <nav className="mt-6 space-y-1">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} className="block rounded-lg px-2 py-1.5 text-sm text-muted hover:bg-border hover:text-white">{n.label}</Link>
          ))}
          {ctx.role === 'superadmin' && <Link href="/admin" className="block rounded-lg px-2 py-1.5 text-sm text-amber-400 hover:bg-border">Admin</Link>}
        </nav>
        <div className="mt-8 px-2"><SignOutButton /></div>
      </aside>
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
