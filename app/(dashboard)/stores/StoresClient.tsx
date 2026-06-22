'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { connectStoreWithToken, disconnectStore } from '@/actions/shopify';

type Status = { kind: 'idle' | 'busy' | 'ok' | 'err'; msg?: string };
export type ConnectedStore = { id: string; shopDomain: string; installedAt: string; scope: string };

const ERR_MESSAGES: Record<string, string> = {
  oauth_unconfigured: 'One-click connect is not set up yet (no Shopify app keys). Use the manual token option below, or add SHOPIFY_API_KEY/SECRET to enable it.',
  bad_domain: 'That does not look like a valid myshopify.com domain.',
  state: 'Security check failed (state mismatch). Please try again.',
  hmac: 'Security check failed (HMAC). Please try again.',
  missing: 'Shopify did not return the expected parameters.',
};

const TOKEN_STEPS = [
  'Shopify admin: Settings > Apps and sales channels > Develop apps.',
  'Click "Allow custom app development" (first time only).',
  'Create an app named "StorePilot".',
  'Configuration > Admin API scopes: read_products, write_products, read_inventory, write_inventory.',
  'Install app, then reveal and copy the Admin API access token (starts with shpat_).',
  'Paste it below with your myshopify.com domain. Shopify shows the token only once.',
];

export default function StoresClient({ stores: initialStores }: { stores: ConnectedStore[] }) {
  const router = useRouter();
  const sp = useSearchParams();
  const connected = sp.get('connected');
  const errCode = sp.get('error');
  const banner = connected
    ? { ok: true, text: 'Store connected.' }
    : errCode
    ? { ok: false, text: ERR_MESSAGES[errCode] ?? errCode }
    : null;

  const [stores, setStores] = useState(initialStores);

  useEffect(() => {
    setStores(initialStores);
  }, [initialStores]);

  const [oauthShop, setOauthShop] = useState('');
  const [shopDomain, setShopDomain] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  async function connectWithToken() {
    setStatus({ kind: 'busy' });
    try {
      const res = await connectStoreWithToken({ shopDomain, accessToken });
      if (res.ok) {
        setStatus({ kind: 'ok', msg: `Connected ${res.shopName ?? shopDomain}.` });
        setAccessToken('');
        router.refresh();
      } else {
        setStatus({ kind: 'err', msg: res.error });
      }
    } catch {
      setStatus({ kind: 'err', msg: 'Something went wrong. Try again.' });
    }
  }

  async function disconnect(id: string) {
    await disconnectStore(id);
    setStores((s) => s.filter((x) => x.id !== id));
    router.refresh();
  }

  const installHref = oauthShop
    ? `/api/shopify/install?shop=${encodeURIComponent(oauthShop.trim().toLowerCase())}`
    : '#';

  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-semibold">Connect a store</h1>

      {banner && (
        <p className={`mt-3 rounded-lg border px-3 py-2 text-sm ${banner.ok ? 'border-green-700 text-green-400' : 'border-red-800 text-red-400'}`}>
          {banner.text}
        </p>
      )}

      <div className="mt-6 rounded-xl border border-border bg-surface p-5">
        <p className="font-medium">Connected stores</p>
        {stores.length === 0 ? (
          <p className="mt-2 text-sm text-muted">No stores connected yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {stores.map((s) => (
              <li key={s.id} className="flex items-center justify-between rounded-lg border border-border bg-bg px-3 py-2">
                <div>
                  <p className="font-medium">{s.shopDomain}</p>
                  <p className="text-xs text-muted">Connected {new Date(s.installedAt).toLocaleDateString()}</p>
                </div>
                <button onClick={() => disconnect(s.id)} className="text-sm text-red-400 hover:underline">
                  Disconnect
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-4 rounded-xl border border-border bg-surface p-5">
        <p className="font-medium">Connect with Shopify <span className="text-xs text-muted">(recommended)</span></p>
        <p className="mt-1 text-sm text-muted">One click. You approve the install on Shopify and you are done.</p>
        <div className="mt-4 flex gap-2">
          <input className="flex-1 rounded-lg border border-border bg-bg px-3 py-2" placeholder="acme.myshopify.com" value={oauthShop} onChange={(e) => setOauthShop(e.target.value)} />
          <a href={installHref} aria-disabled={!oauthShop} className={`rounded-lg bg-brand px-5 py-2 font-medium ${oauthShop ? '' : 'pointer-events-none opacity-50'}`}>
            Connect
          </a>
        </div>
      </div>

      <details className="mt-4 rounded-xl border border-border bg-surface p-5">
        <summary className="cursor-pointer text-sm font-medium">Or connect manually with an access token</summary>
        <p className="mt-3 text-sm text-muted">Use this if you would rather create a custom app yourself instead of using one-click.</p>
        <div className="mt-3">
          <input className="w-full rounded-lg border border-border bg-bg px-3 py-2" placeholder="acme.myshopify.com" value={shopDomain} onChange={(e) => setShopDomain(e.target.value)} />
          <input className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2 font-mono text-sm" type="password" placeholder="shpat_..." value={accessToken} onChange={(e) => setAccessToken(e.target.value)} />
          <button onClick={connectWithToken} disabled={status.kind === 'busy'} className="mt-3 rounded-lg bg-brand px-5 py-2 font-medium disabled:opacity-50">
            {status.kind === 'busy' ? 'Verifying...' : 'Connect with token'}
          </button>
          {status.msg && <p className={`mt-2 text-sm ${status.kind === 'ok' ? 'text-green-400' : 'text-red-400'}`}>{status.msg}</p>}
        </div>
        <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm text-muted">
          {TOKEN_STEPS.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      </details>
    </div>
  );
}
