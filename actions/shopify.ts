'use server';
import { connectDB } from '@/lib/db/connect';
import { requireOrg } from '@/lib/auth-helpers';
import { Store } from '@/models/Store';
import { verifyShopToken } from '@/lib/shopify/connect';
import { persistStore } from '@/lib/shopify/store-service';
import { scoped } from '@/lib/db/scope';

/** Fallback connect: merchant pastes a custom-app Admin API token. */
export async function connectStoreWithToken(input: { shopDomain: string; accessToken: string }) {
  const ctx = await requireOrg();
  await connectDB();
  const shopDomain = input.shopDomain.trim().toLowerCase();

  const check = await verifyShopToken(shopDomain, input.accessToken);
  if (!check.ok) return { ok: false, error: check.error };

  const saved = await persistStore({ organizationId: ctx.organizationId, shopDomain, accessToken: input.accessToken });
  if (!saved.ok) return { ok: false, error: saved.error };
  return { ok: true, shopName: check.shopName };
}

export async function disconnectStore(storeId: string) {
  const ctx = await requireOrg();
  await connectDB();
  await Store.findOneAndUpdate(scoped(ctx.organizationId, { _id: storeId }), { status: 'disconnected' });
  return { ok: true };
}

export async function listStores() {
  const ctx = await requireOrg();
  await connectDB();
  const stores = await Store.find(scoped(ctx.organizationId, { status: 'active' }))
    .select('shopDomain installedAt scope')
    .sort({ installedAt: -1 })
    .lean();
  return stores.map((s) => ({
    id: s._id.toString(),
    shopDomain: s.shopDomain,
    installedAt: s.installedAt.toISOString(),
    scope: s.scope,
  }));
}
