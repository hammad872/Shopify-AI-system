import { API_VERSION } from './constants';
import { decrypt } from '@/lib/encryption';
import { Store } from '@/models/Store';

/** A thin GraphQL Admin API client bound to one store. */
export class ShopifyClient {
  private constructor(private shop: string, private token: string) {}

  static async forStore(storeId: string, organizationId: string): Promise<ShopifyClient> {
    const store = await Store.findOne({ _id: storeId, organizationId }).select('+encryptedAccessToken');
    if (!store) throw new Error('Store not found or not in this organization');
    return new ShopifyClient(store.shopDomain, decrypt(store.encryptedAccessToken));
  }

  async graphql<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
    const res = await fetch(`https://${this.shop}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': this.token },
      body: JSON.stringify({ query, variables }),
    });
    if (!res.ok) throw new Error(`Shopify GraphQL ${res.status}: ${await res.text()}`);
    const json = (await res.json()) as { data: T; errors?: unknown };
    if (json.errors) throw new Error(`Shopify GraphQL errors: ${JSON.stringify(json.errors)}`);
    return json.data;
  }

  async productCount(): Promise<number> {
    const data = await this.graphql<{ productsCount: { count: number } }>(`{ productsCount { count } }`);
    return data.productsCount?.count ?? 0;
  }
}
