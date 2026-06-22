'use client';
import { useEffect, useState } from 'react';
import { sendMessage } from '@/actions/chat';
import { resolvePlan } from '@/actions/approval';
import { listStores } from '@/actions/shopify';
import type { IPlan } from '@/models/Message';

interface ChatMsg { id: string; role: 'user' | 'assistant'; content: string; plan?: IPlan; status?: string; error?: string; }

export default function Chat() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [activeStore, setActiveStore] = useState<string | null>(null);

  useEffect(() => {
    listStores().then((stores) => setActiveStore(stores[0]?.shopDomain ?? null));
  }, []);

  async function send() {
    if (!input.trim() || busy) return;
    if (!activeStore) {
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'assistant', content: 'Connect a store on the Stores page before running operations.' }]);
      return;
    }
    const text = input;
    setInput('');
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'user', content: text }]);
    setBusy(true);
    const res = await sendMessage({ conversationId, text });
    setBusy(false);
    if (!res.ok) {
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'assistant', content: res.error ?? 'Error' }]);
      return;
    }
    setConversationId(res.conversationId);
    setMessages((m) => [...m, {
      id: res.messageId!, role: 'assistant',
      content: res.plan!.summary || 'Done.',
      plan: res.plan!.actions.length ? res.plan : undefined,
      status: res.plan!.requiresApproval ? 'pending' : 'none',
    }]);
  }

  async function decide(msgId: string, approve: boolean) {
    setBusy(true);
    const res = await resolvePlan({ messageId: msgId, approve });
    setBusy(false);
    const error = !res.ok && 'reason' in res ? res.reason : undefined;
    setMessages((m) => m.map((x) => x.id === msgId ? { ...x, status: res.status, error } : x));
  }

  return (
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-2xl flex-col">
      <h1 className="text-2xl font-semibold">AI Chat</h1>
      {activeStore ? (
        <p className="mt-1 text-sm text-muted">Store: <span className="text-brand">{activeStore}</span></p>
      ) : (
        <p className="mt-1 text-sm text-red-400">No store connected — go to Stores to connect one.</p>
      )}
      <div className="mt-4 flex-1 space-y-4 overflow-y-auto">
        {messages.length === 0 && (
          <p className="text-muted">Try: &ldquo;Create a product called Summer Shirt priced at 29&rdquo;</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.role === 'user' ? 'text-right' : ''}>
            <div className={`inline-block rounded-xl px-4 py-2 ${m.role === 'user' ? 'bg-brand' : 'bg-surface border border-border'}`}>
              {m.content}
            </div>
            {m.plan && <ApprovalCard plan={m.plan} status={m.status} error={m.error} onDecide={(a) => decide(m.id, a)} busy={busy} />}
          </div>
        ))}
      </div>
      <div className="mt-4 flex gap-2">
        <input className="flex-1 rounded-lg border border-border bg-surface px-3 py-2" placeholder="Ask StorePilot to do something…" value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} />
        <button onClick={send} disabled={busy} className="rounded-lg bg-brand px-5 py-2 font-medium disabled:opacity-50">Send</button>
      </div>
    </div>
  );
}

function ApprovalCard({ plan, status, error, onDecide, busy }: { plan: IPlan; status?: string; error?: string; onDecide: (a: boolean) => void; busy: boolean }) {
  return (
    <div className="mt-2 max-w-md rounded-xl border border-border bg-surface p-4">
      <p className="text-sm font-medium">Proposed plan</p>
      <ul className="mt-2 space-y-1 text-sm text-muted">
        {plan.actions.map((a, i) => <li key={i}>• {a.description}</li>)}
      </ul>
      {status === 'pending' ? (
        <div className="mt-3 flex gap-2">
          <button onClick={() => onDecide(true)} disabled={busy} className="rounded-lg bg-brand px-3 py-1.5 text-sm font-medium disabled:opacity-50">Approve</button>
          <button onClick={() => onDecide(false)} disabled={busy} className="rounded-lg border border-border px-3 py-1.5 text-sm disabled:opacity-50">Reject</button>
        </div>
      ) : (
        <p className={`mt-3 text-sm ${status === 'executed' ? 'text-green-400' : status === 'failed' ? 'text-red-400' : 'text-muted'}`}>
          Status: {status}{error ? ` — ${error}` : ''}
        </p>
      )}
    </div>
  );
}
