import { redirect } from 'next/navigation';
import { getSessionContext } from '@/lib/auth-helpers';
import Link from 'next/link';
import { Logo } from '@/components/marketing/Logo';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getSessionContext();
  if (!ctx) redirect('/login');
  if (ctx.role !== 'superadmin') redirect('/dashboard');
  return (
    <div className="min-h-screen bg-navy font-sans text-fog antialiased">
      <header className="border-b border-white/8 bg-[#0E1730]/80 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Logo className="h-7 w-7" />
            <span className="font-display text-lg font-bold">StorePilot</span>
            <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-xs font-medium text-amber-300">Admin</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-fog/50 transition hover:text-fog">← Back to app</Link>
        </div>
      </header>
      <div className="mx-auto max-w-6xl p-8">{children}</div>
    </div>
  );
}
