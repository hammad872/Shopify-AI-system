import type { IPlan } from '@/models/Message';
import type { ValidationResult } from './types';

const SUPPORTED = new Set([
  'product.create', 'product.update', 'inventory.adjust', 'collection.create', 'seo.update',
]);

/** Last safety check before anything touches Shopify. Runs AFTER approval. */
export function validatePlan(plan: IPlan): ValidationResult {
  if (plan.actions.length === 0) return { ok: false, reason: 'No actions to execute.' };
  for (const a of plan.actions) {
    if (!SUPPORTED.has(a.type)) return { ok: false, reason: `Unsupported action: ${a.type}` };
    if (a.type === 'inventory.adjust') {
      const delta = Number((a.payload as any)?.delta);
      if (!Number.isFinite(delta)) return { ok: false, reason: 'inventory.adjust requires a numeric delta' };
      if (Math.abs(delta) > 100000) return { ok: false, reason: 'Inventory delta exceeds safety limit (100k)' };
    }
    if (a.type === 'product.create' && !(a.payload as any)?.title) {
      return { ok: false, reason: 'product.create requires a title' };
    }
    if (a.type === 'product.update' && !(a.payload as any)?.id) {
      return { ok: false, reason: 'product.update requires a product id' };
    }
  }
  return { ok: true };
}
