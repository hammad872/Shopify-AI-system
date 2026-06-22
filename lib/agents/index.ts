import { parseIntent } from './intentParser';
import { buildPlan } from './planner';
import { validatePlan } from './validator';
import { executeAction } from './executor';
import type { IPlan } from '@/models/Message';
import type { ExecutionResult, PipelineContext } from './types';

/** Read-only half: message -> intent -> plan. Produces something to approve. */
export async function planFromMessage(message: string): Promise<IPlan> {
  const intent = await parseIntent(message);
  return buildPlan(message, intent);
}

/** Write half: runs ONLY after the merchant approves. Validate then execute. */
export async function executePlan(plan: IPlan, ctx: PipelineContext): Promise<{ ok: boolean; results: ExecutionResult[]; reason?: string }> {
  const check = validatePlan(plan);
  if (!check.ok) return { ok: false, results: [], reason: check.reason };

  const results: ExecutionResult[] = [];
  for (const action of plan.actions) {
    results.push(await executeAction(action, ctx));
  }
  return { ok: results.every((r) => r.ok), results };
}

export { parseIntent, buildPlan, validatePlan, executeAction };
