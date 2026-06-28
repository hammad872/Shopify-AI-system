import { connectDB } from '@/lib/db/connect';
import { User } from '@/models/User';
import { Store } from '@/models/Store';
import { Subscription } from '@/models/Subscription';
import { AuditLog } from '@/models/AuditLog';
import { Users, Store as StoreIcon, CreditCard, AlertTriangle } from 'lucide-react';

export default async function AdminHome() {
  await connectDB();
  const [users, stores, activeSubs, failures] = await Promise.all([
    User.countDocuments(),
    Store.countDocuments({ status: 'active' }),
    Subscription.countDocuments({ status: 'active' }),
    AuditLog.countDocuments({ result: 'failure' }),
  ]);

  const stats = [
    { label: 'Users', value: users, icon: Users },
    { label: 'Active stores', value: stores, icon: StoreIcon },
    { label: 'Active subscriptions', value: activeSubs, icon: CreditCard },
    { label: 'Execution failures', value: failures, icon: AlertTriangle },
  ];

  return (
    <div>
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-amber-400/80">Platform</p>
      <h1 className="app-page-title mt-1">Admin</h1>
      <p className="app-page-subtitle">Platform overview and metrics.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="app-stat-card">
              <div className="flex items-center justify-between">
                <p className="text-sm text-mist/50">{s.label}</p>
                <Icon size={16} className="text-amber-400/60" />
              </div>
              <p className="mt-2 font-display text-2xl font-bold text-mist">{s.value}</p>
            </div>
          );
        })}
      </div>
      <p className="mt-6 text-sm text-mist/45">Extend with revenue (from Stripe), per-org AI usage, and a paginated audit-log table.</p>
    </div>
  );
}
