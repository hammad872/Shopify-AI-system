// Concrete Shopify GraphQL operations used by the executor.
// Two are fully implemented as reference; extend the rest the same way.

export const PRODUCT_CREATE = `
mutation productCreate($input: ProductInput!) {
  productCreate(input: $input) {
    product { id title status }
    userErrors { field message }
  }
}`;

export const PRODUCT_UPDATE = `
mutation productUpdate($input: ProductInput!) {
  productUpdate(input: $input) {
    product { id title status }
    userErrors { field message }
  }
}`;

export const INVENTORY_ADJUST = `
mutation inventoryAdjustQuantities($input: InventoryAdjustQuantitiesInput!) {
  inventoryAdjustQuantities(input: $input) {
    inventoryAdjustmentGroup { createdAt reason }
    userErrors { field message }
  }
}`;

export const COLLECTION_CREATE = `
mutation collectionCreate($input: CollectionInput!) {
  collectionCreate(input: $input) {
    collection { id title }
    userErrors { field message }
  }
}`;
