import { complete, parseJson } from '@/lib/ai/engine';
import { INTENT_SYSTEM } from '@/lib/ai/prompts';
import type { IntentType } from '@/models/Message';

const VALID: IntentType[] = ['product', 'inventory', 'seo', 'collection', 'audit', 'chat'];

export async function parseIntent(message: string): Promise<IntentType> {
  try {
    const raw = await complete(
      [{ role: 'system', content: INTENT_SYSTEM }, { role: 'user', content: message }],
      { jsonMode: true, temperature: 0 }
    );
    const { intent } = parseJson<{ intent: IntentType }>(raw);
    return VALID.includes(intent) ? intent : 'chat';
  } catch {
    return 'chat';
  }
}
