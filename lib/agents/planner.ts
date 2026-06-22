import { complete, parseJson } from '@/lib/ai/engine';
import { PLANNER_SYSTEM } from '@/lib/ai/prompts';
import { normalizePlan } from './normalize';
import type { IPlan, IntentType } from '@/models/Message';

export async function buildPlan(message: string, intent: IntentType): Promise<IPlan> {
  if (intent === 'chat') {
    return { intent, summary: '', actions: [], requiresApproval: false };
  }
  const raw = await complete(
    [
      { role: 'system', content: PLANNER_SYSTEM },
      { role: 'user', content: `Intent: ${intent}\nRequest: ${message}` },
    ],
    { jsonMode: true, temperature: 0.2 }
  );
  const plan = normalizePlan(parseJson<IPlan>(raw));
  // Hard guarantee: a plan with actions always requires approval.
  plan.requiresApproval = plan.actions.length > 0;
  plan.intent = intent;
  return plan;
}
