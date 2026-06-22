import { connectDB } from '@/lib/db/connect';
import { requireOrg } from '@/lib/auth-helpers';
import { streamComplete } from '@/lib/ai/engine';
import { limit } from '@/lib/rateLimit';

// Streaming endpoint for free-form assistant replies (the "chat" intent).
// Action-bearing requests go through actions/chat.ts -> the agent pipeline.
export async function POST(req: Request) {
  let ctx;
  try { ctx = await requireOrg(); } catch { return new Response('Unauthorized', { status: 401 }); }
  if (!(await limit(`chat:${ctx.organizationId}`))) return new Response('Rate limited', { status: 429 });
  await connectDB();

  const { text } = (await req.json()) as { text: string };
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of streamComplete([
          { role: 'system', content: 'You are StorePilot AI, a concise Shopify assistant.' },
          { role: 'user', content: text },
        ])) {
          controller.enqueue(encoder.encode(chunk));
        }
      } catch (err) {
        controller.enqueue(encoder.encode(`\n[error] ${(err as Error).message}`));
      } finally {
        controller.close();
      }
    },
  });
  return new Response(stream, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
