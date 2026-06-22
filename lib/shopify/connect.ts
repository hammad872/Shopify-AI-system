import { API_VERSION } from './constants';

export interface ShopVerification { ok: boolean; shopName?: string; error?: string; }

const SHOP_DOMAIN_RE = /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/;

export function isValidShopDomain(shop: string): boolean {
  return SHOP_DOMAIN_RE.test(shop);
}

/**
 * Validates a merchant-supplied Admin API access token (shpat_...) by making a
 * minimal authenticated request. Confirms the token + domain are real and the
 * token has at least read access before we encrypt and store it.
 */
export async function verifyShopToken(shopDomain: string, accessToken: string): Promise<ShopVerification> {
  if (!isValidShopDomain(shopDomain)) {
    return { ok: false, error: 'Invalid shop domain. Expected something.myshopify.com' };
  }
  if (!accessToken.trim()) return { ok: false, error: 'Access token is required.' };

  try {
    const res = await fetch(`https://${shopDomain}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': accessToken.trim() },
      body: JSON.stringify({ query: '{ shop { name } }' }),
    });
    if (res.status === 401 || res.status === 403) {
      return { ok: false, error: 'Shopify rejected the token. Double-check it and that the app is installed.' };
    }
    if (!res.ok) return { ok: false, error: `Shopify returned ${res.status}.` };
    const json = (await res.json()) as { data?: { shop?: { name?: string } }; errors?: unknown };
    if (json.errors || !json.data?.shop) {
      return { ok: false, error: 'Token reached Shopify but lacks access. Ensure read_products scope is granted.' };
    }
    return { ok: true, shopName: json.data.shop.name };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
