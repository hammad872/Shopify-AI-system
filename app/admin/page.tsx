import { connectDB } from '@/lib/db/connect';
import { User } from '@/models/User';
import { Store } from '@/models/Store';
import { Subscription } from '@/models/Subscription';
import { AuditLog } from '@/models/AuditLog';

export default async function AdminHome() {
  await connectDB();
  const [users, stores, activeSubs, failures] = await Promise.all([
    User.countDocuments(),
    Store.countDocuments({ status: 'active' }),
    Subscription.countDocuments({ status: 'active' }),
    AuditLog.countDocuments({ result: 'failure' }),
  ]);
  return (
    <div>
      <h1 className="app-page-title">Admin</h1>
      <p className="app-page-subtitle">Platform overview and metrics.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: 'Users', value: users },
          { label: 'Active stores', value: stores },
          { label: 'Active subscriptions', value: activeSubs },
          { label: 'Execution failures', value: failures },
        ].map((s) => (
          <div key={s.label} className="app-stat-card">
            <p className="text-sm text-fog/50">{s.label}</p>
            <p className="mt-1 font-display text-2xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>
      <p className="mt-6 text-sm text-fog/45">Extend with revenue (from Stripe), per-org AI usage, and a paginated audit-log table.</p>
    </div>
  );
}
