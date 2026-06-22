import { redirect } from 'next/navigation';
import { getSessionContext } from '@/lib/auth-helpers';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getSessionContext();
  if (!ctx) redirect('/login');
  if (ctx.role !== 'superadmin') redirect('/dashboard');
  return <div className="p-8">{children}</div>;
}
