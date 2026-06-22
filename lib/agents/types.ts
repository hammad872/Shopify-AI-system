import type { IPlan, IntentType } from '@/models/Message';
export type { IPlan, IntentType };

export interface PipelineContext {
  organizationId: string;
  userId: string;
  storeId?: string;
}

export interface ValidationResult { ok: boolean; reason?: string; }
export interface ExecutionResult { ok: boolean; summary: string; shopifyResourceId?: string; error?: string; }
