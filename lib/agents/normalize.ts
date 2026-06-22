import type { IPlan, IPlanAction } from '@/models/Message';

function toProductGid(id: string | number): string {
  const s = String(id).trim();
  if (s.startsWith('gid://shopify/Product/')) return s;
  return `gid://shopify/Product/${s}`;
}

function normalizeAction(action: IPlanAction): IPlanAction {
  const p = { ...action.payload } as Record<string, unknown>;

  if (action.type === 'product.create') {
    const title = p.title ?? p.name ?? p.productName;
    if (title) p.title = String(title).trim();
    if (p.status) p.status = String(p.status).toUpperCase();
  }

  if (action.type === 'product.update') {
    const rawId = p.id ?? p.productId;
    if (rawId) p.id = toProductGid(rawId as string | number);
    if (p.status) p.status = String(p.status).toUpperCase();
  }

  if (action.type === 'collection.create') {
    const title = p.title ?? p.name;
    if (title) p.title = String(title).trim();
  }

  return { ...action, payload: p };
}

/** Coerce common AI payload variants into shapes the executor expects. */
export function normalizePlan(plan: IPlan): IPlan {
  return { ...plan, actions: plan.actions.map(normalizeAction) };
}
