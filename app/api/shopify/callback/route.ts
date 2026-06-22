import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db/connect';
import { requireOrg } from '@/lib/auth-helpers';
import { verifyHmac, exchangeCodeForToken } from '@/lib/shopify/oauth';
import { persistStore } from '@/lib/shopify/store-service';

export async function GET(req: Request) {
  let ctx;
  try { ctx = await requireOrg(); } catch { return NextResponse.redirect(new URL('/login', req.url)); }

  const params = Object.fromEntries(new URL(req.url).searchParams.entries());
  const { shop, code, state } = params;

  const savedState = (await cookies()).get('shopify_oauth_state')?.value;
  if (!state || state !== savedState) return NextResponse.redirect(new URL('/stores?error=state', req.url));
  if (!verifyHmac(params)) return NextResponse.redirect(new URL('/stores?error=hmac', req.url));
  if (!shop || !code) return NextResponse.redirect(new URL('/stores?error=missing', req.url));

  await connectDB();
  const { access_token, scope } = await exchangeCodeForToken(shop, code);
  const result = await persistStore({ organizationId: ctx.organizationId, shopDomain: shop, accessToken: access_token, scope });

  // TODO: register webhooks (app/uninstalled, products/update) here.
  if (!result.ok) return NextResponse.redirect(new URL(`/stores?error=${encodeURIComponent(result.error ?? 'save')}`, req.url));
  return NextResponse.redirect(new URL('/stores?connected=1', req.url));
}
