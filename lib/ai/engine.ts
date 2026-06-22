import Groq from 'groq-sdk';
import OpenAI from 'openai';

type Msg = { role: 'system' | 'user' | 'assistant'; content: string };

const groq = process.env.GROQ_API_KEY ? new Groq({ apiKey: process.env.GROQ_API_KEY }) : null;
const openai = process.env.OPENAI_API_KEY ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY }) : null;

const GROQ_MODEL = process.env.GROQ_MODEL ?? 'llama-3.3-70b-versatile';
const OPENAI_MODEL = process.env.OPENAI_MODEL ?? 'gpt-4o-mini';

/**
 * Single entry point for AI calls. Tries Groq first, falls back to OpenAI.
 * jsonMode forces a JSON object response (used by the intent parser + planner).
 */
export async function complete(messages: Msg[], opts: { jsonMode?: boolean; temperature?: number } = {}): Promise<string> {
  const { jsonMode = false, temperature = 0.3 } = opts;

  if (groq) {
    try {
      const res = await groq.chat.completions.create({
        model: GROQ_MODEL,
        messages,
        temperature,
        response_format: jsonMode ? { type: 'json_object' } : undefined,
      });
      const text = res.choices[0]?.message?.content;
      if (text) return text;
    } catch (err) {
      console.warn('[ai] Groq failed, falling back to OpenAI:', (err as Error).message);
    }
  }

  if (openai) {
    const res = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages,
      temperature,
      response_format: jsonMode ? { type: 'json_object' } : undefined,
    });
    const text = res.choices[0]?.message?.content;
    if (text) return text;
  }

  throw new Error('No AI provider available. Set GROQ_API_KEY or OPENAI_API_KEY.');
}

/** Streaming text for the chat UI (Groq only; falls back to a single OpenAI chunk). */
export async function* streamComplete(messages: Msg[]): AsyncGenerator<string> {
  if (groq) {
    const stream = await groq.chat.completions.create({ model: GROQ_MODEL, messages, temperature: 0.5, stream: true });
    for await (const chunk of stream) {
      const delta = chunk.choices[0]?.delta?.content;
      if (delta) yield delta;
    }
    return;
  }
  yield await complete(messages);
}

export function parseJson<T>(raw: string): T {
  const clean = raw.replace(/```json/gi, '').replace(/```/g, '').trim();
  return JSON.parse(clean) as T;
}
