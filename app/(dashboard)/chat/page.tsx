'use client';
import { useEffect, useRef, useState } from 'react';
import { sendMessage } from '@/actions/chat';
import { resolvePlan } from '@/actions/approval';
import { listStores } from '@/actions/shopify';
import type { IPlan } from '@/models/Message';

interface ChatMsg { id: string; role: 'user' | 'assistant'; content: string; plan?: IPlan; status?: string; error?: string; }

const SUGGESTIONS = [
  'Create a product called Summer Shirt priced at 29',
  'Add 20 units to every blue shirt',
  'Write SEO meta descriptions for new arrivals',
];

export default function Chat() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [conversationId, setConversationId] = useState<string>();
  const [busy, setBusy] = useState(false);
  const [activeStore, setActiveStore] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    listStores().then((stores) => setActiveStore(stores[0]?.shopDomain ?? null));
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  async function send(text?: string) {
    const msg = (text ?? input).trim();
    if (!msg || busy) return;
    if (!activeStore) {
      setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'assistant', content: 'Connect a store on the Stores page before running operations.' }]);
      return;
    }
    setInput('');
    setMessages((m) => [...m, { id: crypto.randomUUID(), role: 'user', content: msg }]);
    setBusy(true);
    const res = await sendMessage({ conversationId, text: msg });
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
    <div className="mx-auto flex h-[calc(100vh-4rem)] max-w-3xl flex-col">
      <div className="mb-4">
        <h1 className="app-page-title">AI Chat</h1>
        {activeStore ? (
          <p className="app-page-subtitle">
            Store: <span className="font-mono text-sky">{activeStore}</span>
          </p>
        ) : (
          <p className="mt-1 text-sm text-red-300">No store connected — go to Stores to connect one.</p>
        )}
      </div>

      <div className="app-terminal flex min-h-0 flex-1 flex-col">
        <div className="app-panel flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
            <span className="h-3 w-3 rounded-full bg-[#febc2e]/80" />
            <span className="h-3 w-3 rounded-full bg-[#28c840]/80" />
            <span className="ml-3 font-mono text-xs text-fog/40">
              storepilot — {activeStore ?? 'no store connected'}
            </span>
          </div>

          <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
            {messages.length === 0 && !busy && (
              <div className="space-y-4">
                <p className="text-sm text-fog/45">Say what you want in plain English. StorePilot will show a plan before anything changes.</p>
                <div className="flex flex-wrap gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-fog/70 transition hover:border-sky/40 hover:text-fog"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m) => (
              <div key={m.id} className={`flex flex-col gap-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                  m.role === 'user'
                    ? 'bg-gradient-to-br from-royal to-green text-white'
                    : 'border border-white/10 bg-white/[0.03] text-fog/85'
                }`}>
                  {m.content}
                </div>
                {m.plan && (
                  <ApprovalCard plan={m.plan} status={m.status} error={m.error} onDecide={(a) => decide(m.id, a)} busy={busy} />
                )}
              </div>
            ))}
            {busy && (
              <div className="flex justify-start">
                <div className="rounded-2xl bg-white/[0.04] px-4 py-2.5 text-sm text-fog/50">StorePilot is thinking…</div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 border-t border-white/5 px-5 py-3">
            <span className="font-mono text-green">$</span>
            <input
              className="flex-1 bg-transparent font-mono text-sm text-fog/90 placeholder:text-fog/35 focus:outline-none"
              placeholder="Tell StorePilot what to do…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && send()}
              disabled={busy}
            />
            <button onClick={() => send()} disabled={busy || !input.trim()} className="app-btn-primary px-4 py-2 disabled:opacity-40">
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ApprovalCard({ plan, status, error, onDecide, busy }: { plan: IPlan; status?: string; error?: string; onDecide: (a: boolean) => void; busy: boolean }) {
  const done = status === 'executed' || status === 'rejected' || status === 'failed';

  return (
    <div className="mt-2 max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-4">
      <p className="mb-2 text-sm font-medium text-fog/85">Proposed plan</p>
      <div className="space-y-1.5">
        {plan.actions.map((a, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg bg-black/30 px-3 py-1.5 text-xs text-fog/70">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-sky" />
            {a.description}
          </div>
        ))}
      </div>
      {status === 'pending' ? (
        <div className="mt-3 flex gap-2">
          <button onClick={() => onDecide(true)} disabled={busy} className="app-btn-primary flex-1 py-2 text-xs disabled:opacity-50">Approve</button>
          <button onClick={() => onDecide(false)} disabled={busy} className="app-btn-secondary flex-1 py-2 text-xs disabled:opacity-50">Reject</button>
        </div>
      ) : done ? (
        <div className={`mt-3 flex items-center gap-2 rounded-lg border px-3 py-2 text-xs ${
          status === 'executed'
            ? 'border-green/30 bg-green/10 text-mint'
            : status === 'failed'
            ? 'border-red-500/30 bg-red-500/10 text-red-300'
            : 'border-white/10 bg-white/5 text-fog/60'
        }`}>
          <span>{status === 'executed' ? '✓' : status === 'failed' ? '✕' : '—'}</span>
          {status === 'executed' ? 'Plan executed' : status === 'failed' ? `Failed${error ? ` — ${error}` : ''}` : 'Plan rejected'}
        </div>
      ) : null}
    </div>
  );
}
