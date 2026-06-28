import dns from 'dns/promises';

const DEFAULT_DB = 'storepilot';
const DEFAULT_PARAMS = 'ssl=true&authSource=admin&retryWrites=true&w=majority';

let cachedResolvedUri: string | null = null;

function parseSrvUri(uri: string) {
  const match = uri.match(/^mongodb\+srv:\/\/([^@]+)@([^/?]+)(?:\/([^?]*))?(?:\?(.*))?$/);
  if (!match) return null;
  const [, credentials, clusterHost, dbName = '', query = ''] = match;
  return { credentials, clusterHost, dbName, query };
}

function mergeParams(base: string, extra: string) {
  const params = new URLSearchParams(base);
  for (const part of extra.split('&').filter(Boolean)) {
    const [key, value] = part.split('=');
    if (key && !params.has(key)) params.set(key, value ?? '');
  }
  return params.toString();
}

async function resolveSrvWithTimeout(hostname: string, ms = 8_000) {
  return Promise.race([
    dns.resolveSrv(hostname),
    new Promise<never>((_, reject) =>
      setTimeout(() => reject(new Error('SRV_TIMEOUT')), ms)
    ),
  ]);
}

/** Avoid flaky mongodb+srv DNS in Node by resolving SRV once and using a standard URI. */
export async function resolveMongoUri(rawUri: string): Promise<string> {
  if (cachedResolvedUri) return cachedResolvedUri;
  if (process.env.MONGODB_URI_STANDARD) {
    cachedResolvedUri = process.env.MONGODB_URI_STANDARD;
    return cachedResolvedUri;
  }
  if (!rawUri.startsWith('mongodb+srv://')) {
    cachedResolvedUri = rawUri;
    return rawUri;
  }

  const parsed = parseSrvUri(rawUri);
  if (!parsed) return rawUri;

  const { credentials, clusterHost, dbName, query } = parsed;
  const srvName = `_mongodb._tcp.${clusterHost}`;
  const records = await resolveSrvWithTimeout(srvName);
  const hosts = records.map((r) => `${r.name}:${r.port}`).join(',');

  let replicaSet = '';
  try {
    const txt = await dns.resolveTxt(srvName);
    const replica = txt.flat().find((entry) => entry.startsWith('replicaSet='));
    if (replica) replicaSet = replica;
  } catch {
    // optional
  }

  const params = mergeParams(DEFAULT_PARAMS, [query, replicaSet].filter(Boolean).join('&'));
  const database = dbName || DEFAULT_DB;
  cachedResolvedUri = `mongodb://${credentials}@${hosts}/${database}?${params}`;
  return cachedResolvedUri;
}

export function resetResolvedUriCache() {
  cachedResolvedUri = null;
}
