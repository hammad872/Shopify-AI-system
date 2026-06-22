import { Store } from '@/models/Store';
import { Organization, PLAN_LIMITS } from '@/models/Organization';
import { encrypt } from '@/lib/encryption';
import { scoped } from '@/lib/db/scope';

/** Single source of truth for saving a connected store: claim check, plan limit, encrypt. */
export async function persistStore(params: {
  organizationId: string;
  shopDomain: string;
  accessToken: string;
  scope?: string;
}): Promise<{ ok: boolean; error?: string }> {
  const shopDomain = params.shopDomain.trim().toLowerCase();

  const claimedElsewhere = await Store.findOne({ shopDomain, organizationId: { $ne: params.organizationId } });
  if (claimedElsewhere) return { ok: false, error: 'This store is already connected to another account.' };

  const org = await Organization.findById(params.organizationId);
  const limit = org ? PLAN_LIMITS[org.plan].stores : 1;
  const already = await Store.findOne(scoped(params.organizationId, { shopDomain }));
  if (!already) {
    const activeCount = await Store.countDocuments(scoped(params.organizationId, { status: 'active' }));
    if (activeCount >= limit) {
      return { ok: false, error: `Your plan allows ${limit === Infinity ? 'unlimited' : limit} store(s).` };
    }
  }

  await Store.findOneAndUpdate(
    { shopDomain },
    {
      organizationId: params.organizationId,
      shopDomain,
      encryptedAccessToken: encrypt(params.accessToken.trim()),
      scope: params.scope ?? '',
      status: 'active',
      installedAt: new Date(),
    },
    { upsert: true, new: true }
  );
  return { ok: true };
}

/** Returns the org's most recently connected active store, if any. */
export async function getActiveStoreId(organizationId: string): Promise<string | null> {
  const store = await Store.findOne(scoped(organizationId, { status: 'active' }))
    .select('_id')
    .sort({ installedAt: -1 });
  return store?._id.toString() ?? null;
}
