import Link from 'next/link';
import { connectDB } from '@/lib/db/connect';
import { requireOrg } from '@/lib/auth-helpers';
import { Store } from '@/models/Store';
import { scoped } from '@/lib/db/scope';

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="app-stat-card">
      <p className="text-sm text-fog/50">{label}</p>
      <p className="mt-1 font-display text-2xl font-bold">{value}</p>
    </div>
  );
}

export default async function Dashboard() {
  const ctx = await requireOrg();
  await connectDB();
  const store = await Store.findOne(scoped(ctx.organizationId, { status: 'active' }));

  return (
    <div>
      <h1 className="app-page-title">Dashboard</h1>
      {store ? (
        <>
          <p className="app-page-subtitle font-mono text-sky">{store.shopDomain}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Products" value={store.productCount} />
            <Stat label="Inventory units" value={store.inventoryCount} />
            <Stat label="Health score" value={`${store.healthScore}/100`} />
            <Stat label="Last sync" value={store.lastSyncAt ? new Date(store.lastSyncAt).toLocaleDateString() : '—'} />
          </div>
        </>
      ) : (
        <div className="app-card mt-6">
          <p className="text-fog/60">
            No store connected yet. Go to{' '}
            <Link href="/stores" className="app-link">Stores</Link> to connect one.
          </p>
        </div>
      )}
    </div>
  );
}
