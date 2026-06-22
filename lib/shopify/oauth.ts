import crypto from 'crypto';

export function oauthConfigured(): boolean {
  return Boolean(process.env.SHOPIFY_API_KEY && process.env.SHOPIFY_API_SECRET);
}

export function buildInstallUrl(shop: string, state: string): string {
  const params = new URLSearchParams({
    client_id: process.env.SHOPIFY_API_KEY ?? '',
    scope: process.env.SHOPIFY_SCOPES ?? 'read_products,write_products,read_inventory,write_inventory',
    redirect_uri: `${process.env.SHOPIFY_APP_URL}/api/shopify/callback`,
    state,
    'grant_options[]': '', // offline access token
  });
  return `https://${shop}/admin/oauth/authorize?${params.toString()}`;
}

/** Verify the HMAC Shopify appends to OAuth callbacks. */
export function verifyHmac(query: Record<string, string>): boolean {
  const { hmac, ...rest } = query;
  if (!hmac) return false;
  const message = Object.keys(rest).sort().map((k) => `${k}=${rest[k]}`).join('&');
  const digest = crypto.createHmac('sha256', process.env.SHOPIFY_API_SECRET ?? '').update(message).digest('hex');
  const a = Buffer.from(digest);
  const b = Buffer.from(hmac);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

export async function exchangeCodeForToken(shop: string, code: string): Promise<{ access_token: string; scope: string }> {
  const res = await fetch(`https://${shop}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: process.env.SHOPIFY_API_KEY,
      client_secret: process.env.SHOPIFY_API_SECRET,
      code,
    }),
  });
  if (!res.ok) throw new Error(`Token exchange failed: ${res.status}`);
  return res.json();
}
