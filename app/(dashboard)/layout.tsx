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
    <div className="flex min-h-screen bg-navy font-sans text-fog antialiased">
      <aside className="flex w-60 shrink-0 flex-col border-r border-white/8 bg-[#0E1730]/80 p-4 backdrop-blur-xl">
        <Link href="/dashboard" className="flex items-center gap-2.5 px-2">
          <Logo className="h-8 w-8" />
          <span className="font-display text-lg font-bold tracking-tight">StorePilot</span>
        </Link>
        <SidebarNav isAdmin={ctx.role === 'superadmin'} />
        <div className="mt-auto border-t border-white/8 px-2 pt-4">
          <p className="truncate text-xs text-fog/40">{ctx.email}</p>
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 overflow-hidden p-6 lg:p-8">{children}</main>
    </div>
  );
}
