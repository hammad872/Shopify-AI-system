import { AuditLog } from '@/models/AuditLog';

export async function writeAudit(entry: {
  organizationId: string;
  userId?: string;
  storeId?: string;
  action: string;
  summary: string;
  result: 'success' | 'failure';
  shopifyResourceId?: string;
  errorMessage?: string;
}): Promise<void> {
  try { await AuditLog.create(entry); }
  catch (err) { console.error('[audit] failed to write log:', (err as Error).message); }
}
