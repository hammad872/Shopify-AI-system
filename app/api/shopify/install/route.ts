import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { cookies } from 'next/headers';
import { requireOrg } from '@/lib/auth-helpers';
import { buildInstallUrl, oauthConfigured } from '@/lib/shopify/oauth';

// GET /api/shopify/install?shop=acme.myshopify.com
export async function GET(req: Request) {
  try { await requireOrg(); } catch { return NextResponse.redirect(new URL('/login', req.url)); }

  if (!oauthConfigured()) {
    return NextResponse.redirect(new URL('/stores?error=oauth_unconfigured', req.url));
  }

  const shop = new URL(req.url).searchParams.get('shop')?.trim().toLowerCase();
  if (!shop || !/^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(shop)) {
    return NextResponse.redirect(new URL('/stores?error=bad_domain', req.url));
  }

  const state = crypto.randomBytes(16).toString('hex');
  (await cookies()).set('shopify_oauth_state', state, { httpOnly: true, secure: true, sameSite: 'lax', maxAge: 600, path: '/' });
  return NextResponse.redirect(buildInstallUrl(shop, state));
}
