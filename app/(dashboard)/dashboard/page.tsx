import { connectDB } from '@/lib/db/connect';
import { requireOrg } from '@/lib/auth-helpers';
import { Store } from '@/models/Store';
import { scoped } from '@/lib/db/scope';

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
    </div>
  );
}

export default async function Dashboard() {
  const ctx = await requireOrg();
  await connectDB();
  const store = await Store.findOne(scoped(ctx.organizationId, { status: 'active' }));

  return (
    <div>
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      {store ? (
        <>
          <p className="mt-1 text-muted">{store.shopDomain}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-4">
            <Stat label="Products" value={store.productCount} />
            <Stat label="Inventory units" value={store.inventoryCount} />
            <Stat label="Health score" value={`${store.healthScore}/100`} />
            <Stat label="Last sync" value={store.lastSyncAt ? new Date(store.lastSyncAt).toLocaleDateString() : '—'} />
          </div>
        </>
      ) : (
        <p className="mt-6 text-muted">No store connected yet. Go to <span className="text-brand">Stores</span> to connect one.</p>
      )}
    </div>
  );
}
