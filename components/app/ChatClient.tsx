'use client';
import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import {
  sendMessage,
  listConversations,
  getConversationMessages,
  type ConversationSummary,
  type StoredChatMessage,
} from '@/actions/chat';
import { resolvePlan } from '@/actions/approval';
import { listStores } from '@/actions/shopify';
import type { IPlan } from '@/models/Message';
import { Sparkles } from 'lucide-react';
import { ChatSidebar } from '@/components/app/ChatSidebar';

interface ChatMsg {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  plan?: IPlan;
  status?: string;
  error?: string;
}

const SUGGESTIONS = [
  'Create a product called Summer Shirt priced at 29',
  'Add 20 units to every blue shirt',
  'Write SEO meta descriptions for new arrivals',
];

export default function ChatClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const urlConversationId = searchParams.get('c') ?? undefined;

  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [conversationId, setConversationId] = useState<string | undefined>(urlConversationId);
  const [input, setInput] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeStore, setActiveStore] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const refreshConversations = useCallback(async () => {
    const list = await listConversations();
    setConversations(list);
    return list;
  }, []);

  const loadConversation = useCallback(async (id: string) => {
    setLoading(true);
    const stored = await getConversationMessages(id);
    if (stored) {
      setConversationId(id);
      setMessages(stored.map(toChatMsg));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    listStores().then((stores) => setActiveStore(stores[0]?.shopDomain ?? null));
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await refreshConversations();
      if (cancelled) return;
      if (urlConversationId) {
        await loadConversation(urlConversationId);
      } else {
        setConversationId(undefined);
        setMessages([]);
        setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [urlConversationId, refreshConversations, loadConversation]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, busy]);

  function selectConversation(id: string) {
    router.push(`/chat?c=${id}`);
  }

  function startNewChat() {
    setConversationId(undefined);
    setMessages([]);
    setInput('');
    router.push('/chat');
  }

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
    const newId = res.conversationId!;
    if (!conversationId) {
      setConversationId(newId);
      router.replace(`/chat?c=${newId}`);
    }
    setMessages((m) => [...m, {
      id: res.messageId!,
      role: 'assistant',
      content: res.plan!.summary || 'Done.',
      plan: res.plan!.actions.length ? res.plan : undefined,
      status: res.plan!.requiresApproval ? 'pending' : 'none',
    }]);
    await refreshConversations();
  }

  async function decide(msgId: string, approve: boolean) {
    setBusy(true);
    const res = await resolvePlan({ messageId: msgId, approve });
    setBusy(false);
    const error = !res.ok && 'reason' in res ? res.reason : undefined;
    setMessages((m) => m.map((x) => x.id === msgId ? { ...x, status: res.status, error } : x));
  }

  return (
    <div className="-m-6 flex h-[calc(100vh)] lg:-m-8">
      <ChatSidebar
        conversations={conversations}
        activeId={conversationId}
        onSelect={selectConversation}
        onNewChat={startNewChat}
      />
      <div className="flex min-w-0 flex-1 flex-col p-6 lg:p-8">
        <div className="mb-4">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-teal" />
            <h1 className="app-page-title">AI Chat</h1>
          </div>
          {activeStore ? (
            <p className="app-page-subtitle">
              Store: <span className="font-mono text-teal">{activeStore}</span>
            </p>
          ) : (
            <p className="mt-1 text-sm text-red-300">
              No store connected — <Link href="/stores" className="app-link">connect one</Link> to get started.
            </p>
          )}
        </div>

        <div className="app-terminal flex min-h-0 flex-1 flex-col">
          <div className="app-panel flex min-h-0 flex-1 flex-col overflow-hidden">
            <div className="flex items-center gap-2 border-b border-white/5 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f57]/80" />
              <span className="h-3 w-3 rounded-full bg-[#febc2e]/80" />
              <span className="h-3 w-3 rounded-full bg-[#28c840]/80" />
              <span className="ml-3 truncate font-mono text-xs text-mist/40">
                mareura — {activeStore ?? 'no store connected'}
              </span>
            </div>

            <div ref={scrollRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto p-5">
              {loading ? (
                <p className="text-sm text-mist/45">Loading conversation…</p>
              ) : messages.length === 0 && !busy ? (
                <div className="space-y-4">
                  <p className="text-sm text-mist/45">Say what you want in plain English. Mareura will show a plan before anything changes.</p>
                  <div className="flex flex-wrap gap-2">
                    {SUGGESTIONS.map((s) => (
                      <button
                        key={s}
                        onClick={() => send(s)}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-mist/70 transition hover:border-teal/40 hover:text-mist"
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className={`flex flex-col gap-2 ${m.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm ${
                      m.role === 'user'
                        ? 'bg-grad text-white shadow-lg shadow-blue/20'
                        : 'border border-white/10 bg-white/[0.03] text-mist/85'
                    }`}>
                      {m.content}
                    </div>
                    {m.plan && (
                      <ApprovalCard plan={m.plan} status={m.status} error={m.error} onDecide={(a) => decide(m.id, a)} busy={busy} />
                    )}
                  </div>
                ))
              )}
              {busy && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-white/5 bg-white/[0.04] px-4 py-2.5 text-sm text-mist/50">
                    <span className="inline-flex items-center gap-2">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-teal" />
                      Mareura is thinking…
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 border-t border-white/5 px-5 py-3">
              <span className="font-mono text-teal">$</span>
              <input
                className="flex-1 bg-transparent font-mono text-sm text-mist/90 placeholder:text-mist/35 focus:outline-none"
                placeholder="Tell Mareura what to do…"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send()}
                disabled={busy || loading}
              />
              <button onClick={() => send()} disabled={busy || loading || !input.trim()} className="app-btn-primary px-4 py-2 disabled:opacity-40">
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function toChatMsg(m: StoredChatMessage): ChatMsg {
  return {
    id: m.id,
    role: m.role,
    content: m.content,
    plan: m.plan,
    status: m.status,
  };
}

function ApprovalCard({ plan, status, error, onDecide, busy }: { plan: IPlan; status?: string; error?: string; onDecide: (a: boolean) => void; busy: boolean }) {
  const done = status === 'executed' || status === 'rejected' || status === 'failed';

  return (
    <div className="mt-2 max-w-md rounded-2xl border border-white/10 bg-white/[0.03] p-4 ring-1 ring-teal/10">
      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.15em] text-teal">Plan ready</p>
      <p className="mb-3 text-sm font-medium text-mist/85">Proposed changes</p>
      <div className="space-y-1.5">
        {plan.actions.map((a, i) => (
          <div key={i} className="flex items-center gap-2 rounded-lg bg-black/30 px-3 py-1.5 text-xs text-mist/70">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
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
            ? 'border-green/30 bg-green/10 text-green'
            : status === 'failed'
            ? 'border-red-500/30 bg-red-500/10 text-red-300'
            : 'border-white/10 bg-white/5 text-mist/60'
        }`}>
          <span>{status === 'executed' ? '✓' : status === 'failed' ? '✕' : '—'}</span>
          {status === 'executed' ? 'Plan executed' : status === 'failed' ? `Failed${error ? ` — ${error}` : ''}` : 'Plan rejected'}
        </div>
      ) : null}
    </div>
  );
}
