'use client';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { connectStoreWithToken, disconnectStore } from '@/actions/shopify';
import { Link2, KeyRound, Store } from 'lucide-react';

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
  'Create an app named "Mareura".',
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
    ? { ok: true, text: 'Store connected successfully.' }
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
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">Shopify</p>
      <h1 className="app-page-title mt-1">Connect a store</h1>
      <p className="app-page-subtitle">Link your Shopify store to start running commands.</p>

      {banner && (
        <p className={`mt-4 ${banner.ok ? 'app-alert-success' : 'app-alert-error'}`}>
          {banner.text}
        </p>
      )}

      <div className="app-card mt-6">
        <div className="flex items-center gap-2">
          <Store size={16} className="text-teal" />
          <p className="font-semibold text-mist/90">Connected stores</p>
        </div>
        {stores.length === 0 ? (
          <p className="mt-3 text-sm text-mist/50">No stores connected yet.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {stores.map((s) => (
              <li key={s.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 transition hover:border-teal/20">
                <div>
                  <p className="font-medium font-mono text-sm text-teal">{s.shopDomain}</p>
                  <p className="text-xs text-mist/45">Connected {new Date(s.installedAt).toLocaleDateString()}</p>
                </div>
                <button onClick={() => disconnect(s.id)} className="text-sm text-red-300 transition hover:text-red-200">
                  Disconnect
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="app-card mt-4">
        <div className="flex items-center gap-2">
          <Link2 size={16} className="text-teal" />
          <p className="font-semibold text-mist/90">
            Connect with Shopify <span className="app-badge ml-1">recommended</span>
          </p>
        </div>
        <p className="mt-2 text-sm text-mist/50">One click. You approve the install on Shopify and you are done.</p>
        <div className="mt-4 flex gap-2">
          <input className="app-input flex-1 font-mono" placeholder="acme.myshopify.com" value={oauthShop} onChange={(e) => setOauthShop(e.target.value)} />
          <a href={installHref} aria-disabled={!oauthShop} className={`app-btn-primary shrink-0 px-5 ${oauthShop ? '' : 'pointer-events-none opacity-50'}`}>
            Connect
          </a>
        </div>
      </div>

      <details className="app-card mt-4 group">
        <summary className="flex cursor-pointer items-center gap-2 text-sm font-semibold text-mist/90">
          <KeyRound size={16} className="text-mist/50" />
          Or connect manually with an access token
        </summary>
        <p className="mt-3 text-sm text-mist/50">Use this if you would rather create a custom app yourself instead of using one-click.</p>
        <div className="mt-3">
          <input className="app-input font-mono" placeholder="acme.myshopify.com" value={shopDomain} onChange={(e) => setShopDomain(e.target.value)} />
          <input className="app-input mt-2 font-mono" type="password" placeholder="shpat_..." value={accessToken} onChange={(e) => setAccessToken(e.target.value)} />
          <button onClick={connectWithToken} disabled={status.kind === 'busy'} className="app-btn-primary mt-3 disabled:opacity-50">
            {status.kind === 'busy' ? 'Verifying...' : 'Connect with token'}
          </button>
          {status.msg && <p className={`mt-2 text-sm ${status.kind === 'ok' ? 'text-green' : 'text-red-300'}`}>{status.msg}</p>}
        </div>
        <ol className="mt-4 list-decimal space-y-1.5 pl-5 text-sm text-mist/50">
          {TOKEN_STEPS.map((s, i) => <li key={i}>{s}</li>)}
        </ol>
      </details>
    </div>
  );
}
