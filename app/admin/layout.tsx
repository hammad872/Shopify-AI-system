import { redirect } from 'next/navigation';
import { getSessionContext } from '@/lib/auth-helpers';
import Link from 'next/link';
import { Logo } from '@/components/marketing/Logo';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getSessionContext();
  if (!ctx) redirect('/login');
  if (ctx.role !== 'superadmin') redirect('/dashboard');
  return (
    <div className="relative min-h-screen bg-navy font-sans text-mist antialiased">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-20" />
      <header className="relative z-10 border-b border-white/8 bg-navy/90 px-6 py-4 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2.5">
            <Logo className="h-7 w-7" />
            <span className="font-display text-lg font-bold text-mist">Mareura</span>
            <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-xs font-medium text-amber-300 ring-1 ring-amber-500/25">Admin</span>
          </Link>
          <Link href="/dashboard" className="text-sm text-mist/50 transition hover:text-mist">← Back to app</Link>
        </div>
      </header>
      <div className="relative z-10 mx-auto max-w-6xl p-8">{children}</div>
    </div>
  );
}
