import { Suspense } from 'react';
import { connectDB } from '@/lib/db/connect';
import { requireOrg } from '@/lib/auth-helpers';
import { Store } from '@/models/Store';
import { scoped } from '@/lib/db/scope';
import StoresClient from './StoresClient';

export default async function StoresPage() {
  const ctx = await requireOrg();
  await connectDB();
  const stores = await Store.find(scoped(ctx.organizationId, { status: 'active' }))
    .select('shopDomain installedAt scope')
    .sort({ installedAt: -1 })
    .lean();

  const initialStores = stores.map((s) => ({
    id: s._id.toString(),
    shopDomain: s.shopDomain,
    installedAt: s.installedAt.toISOString(),
    scope: s.scope,
  }));

  return (
    <Suspense fallback={<div className="text-muted">Loading…</div>}>
      <StoresClient stores={initialStores} />
    </Suspense>
  );
}
