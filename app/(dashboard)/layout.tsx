import Link from 'next/link';
import { redirect } from 'next/navigation';
import { getSessionContext } from '@/lib/auth-helpers';
import SignOutButton from '@/components/SignOutButton';
import { SidebarNav } from '@/components/app/SidebarNav';
import { Logo } from '@/components/marketing/Logo';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getSessionContext();
  if (!ctx) redirect('/login');
  return (
    <div className="relative flex min-h-screen bg-navy font-sans text-mist antialiased">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <aside className="relative z-10 flex w-64 shrink-0 flex-col border-r border-white/8 bg-navy/90 p-5 backdrop-blur-xl">
        <Link href="/dashboard" className="flex items-center gap-2.5 px-2">
          <Logo className="h-8 w-8" />
          <span className="font-display text-lg font-bold tracking-tight text-mist">Mareura</span>
        </Link>
        <SidebarNav isAdmin={ctx.role === 'superadmin'} />
        <div className="mt-auto border-t border-white/8 px-2 pt-4">
          <p className="truncate text-xs font-medium text-mist/60">{ctx.email.split('@')[0]}</p>
          <p className="truncate text-xs text-mist/35">{ctx.email}</p>
          <SignOutButton />
        </div>
      </aside>
      <main className="relative z-10 flex-1 overflow-hidden p-6 lg:p-8">{children}</main>
    </div>
  );
}
