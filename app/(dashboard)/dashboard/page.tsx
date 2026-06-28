import Link from 'next/link';
import { connectDB } from '@/lib/db/connect';
import { requireOrg } from '@/lib/auth-helpers';
import { Store } from '@/models/Store';
import { scoped } from '@/lib/db/scope';
import { Package, Boxes, HeartPulse, Clock, Store as StoreIcon } from 'lucide-react';

function Stat({ label, value, icon: Icon }: { label: string; value: string | number; icon: React.ComponentType<{ size?: number; className?: string }> }) {
  return (
    <div className="app-stat-card">
      <div className="flex items-center justify-between">
        <p className="text-sm text-mist/50">{label}</p>
        <Icon size={16} className="text-teal/60" />
      </div>
      <p className="mt-2 font-display text-2xl font-bold text-mist">{value}</p>
    </div>
  );
}

export default async function Dashboard() {
  const ctx = await requireOrg();
  await connectDB();
  const store = await Store.findOne(scoped(ctx.organizationId, { status: 'active' }));

  return (
    <div className="max-w-4xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">Overview</p>
      <h1 className="app-page-title mt-1">Dashboard</h1>
      {store ? (
        <>
          <p className="app-page-subtitle font-mono text-teal">{store.shopDomain}</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Stat label="Products" value={store.productCount} icon={Package} />
            <Stat label="Inventory units" value={store.inventoryCount} icon={Boxes} />
            <Stat label="Health score" value={`${store.healthScore}/100`} icon={HeartPulse} />
            <Stat label="Last sync" value={store.lastSyncAt ? new Date(store.lastSyncAt).toLocaleDateString() : '—'} icon={Clock} />
          </div>
          <div className="mt-6 flex gap-3">
            <Link href="/chat" className="app-btn-primary">Open AI Chat</Link>
            <Link href="/stores" className="app-btn-secondary">Manage stores</Link>
          </div>
        </>
      ) : (
        <div className="app-card mt-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal/10 ring-1 ring-teal/25">
            <StoreIcon size={24} className="text-teal" />
          </div>
          <p className="font-display text-lg font-semibold text-mist">No store connected yet</p>
          <p className="mt-2 text-sm text-mist/55">Connect your Shopify store to start running commands with Mareura.</p>
          <Link href="/stores" className="app-btn-primary mt-5 inline-block">Connect a store</Link>
        </div>
      )}
    </div>
  );
}
