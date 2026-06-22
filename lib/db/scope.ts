import type { FilterQuery } from 'mongoose';

/** Forces an organizationId filter onto every tenant-scoped query. */
export function scoped<T>(organizationId: string, filter: FilterQuery<T> = {}): FilterQuery<T> {
  return { ...filter, organizationId } as FilterQuery<T>;
}
