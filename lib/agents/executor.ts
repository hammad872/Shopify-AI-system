import type { IPlanAction } from '@/models/Message';
import type { ExecutionResult, PipelineContext } from './types';
import { ShopifyClient } from '@/lib/shopify/client';
import { PRODUCT_CREATE, PRODUCT_UPDATE, INVENTORY_ADJUST, COLLECTION_CREATE } from '@/lib/shopify/mutations';
import { writeAudit } from '@/lib/audit';

/**
 * Executes one approved action against Shopify. This is the ONLY place that
 * holds a decrypted token. Each branch maps an action type to a mutation.
 */
export async function executeAction(action: IPlanAction, ctx: PipelineContext): Promise<ExecutionResult> {
  if (!ctx.storeId) return { ok: false, summary: action.description, error: 'No store connected' };
  const client = await ShopifyClient.forStore(ctx.storeId, ctx.organizationId);
  const p = action.payload as any;

  let result: ExecutionResult;
  try {
    switch (action.type) {
      case 'product.create': {
        const data = await client.graphql<any>(PRODUCT_CREATE, {
          input: { title: p.title, descriptionHtml: p.description ?? '', status: p.status ?? 'DRAFT' },
        });
        const errs = data.productCreate.userErrors;
        if (errs?.length) throw new Error(errs.map((e: any) => e.message).join('; '));
        result = { ok: true, summary: `Created product "${p.title}"`, shopifyResourceId: data.productCreate.product?.id };
        break;
      }
      case 'product.update': {
        const input: Record<string, unknown> = { id: p.id };
        if (p.title) input.title = p.title;
        if (p.description) input.descriptionHtml = p.description;
        if (p.status) input.status = p.status;
        const data = await client.graphql<any>(PRODUCT_UPDATE, { input });
        const errs = data.productUpdate.userErrors;
        if (errs?.length) throw new Error(errs.map((e: any) => e.message).join('; '));
        const product = data.productUpdate.product;
        result = {
          ok: true,
          summary: `Updated product ${product?.title ?? p.id}${p.status ? ` → ${p.status}` : ''}`,
          shopifyResourceId: product?.id,
        };
        break;
      }
      case 'inventory.adjust': {
        // TODO: resolve inventoryItemId + locationId from p.selector before adjusting.
        const data = await client.graphql<any>(INVENTORY_ADJUST, {
          input: { reason: 'correction', name: 'available', changes: [{ delta: p.delta, inventoryItemId: p.inventoryItemId, locationId: p.locationId }] },
        });
        const errs = data.inventoryAdjustQuantities.userErrors;
        if (errs?.length) throw new Error(errs.map((e: any) => e.message).join('; '));
        result = { ok: true, summary: `Adjusted inventory by ${p.delta}` };
        break;
      }
      case 'collection.create': {
        const data = await client.graphql<any>(COLLECTION_CREATE, { input: { title: p.title } });
        const errs = data.collectionCreate.userErrors;
        if (errs?.length) throw new Error(errs.map((e: any) => e.message).join('; '));
        result = { ok: true, summary: `Created collection "${p.title}"`, shopifyResourceId: data.collectionCreate.collection?.id };
        break;
      }
      // TODO: implement seo.update mutation.
      default:
        result = { ok: false, summary: action.description, error: `Executor missing handler for ${action.type}` };
    }
  } catch (err) {
    result = { ok: false, summary: action.description, error: (err as Error).message };
  }

  await writeAudit({
    organizationId: ctx.organizationId,
    userId: ctx.userId,
    storeId: ctx.storeId,
    action: action.type,
    summary: result.summary,
    result: result.ok ? 'success' : 'failure',
    shopifyResourceId: result.shopifyResourceId,
    errorMessage: result.error,
  });

  return result;
}
