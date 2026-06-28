'use client';
import { MessageSquarePlus } from 'lucide-react';
import type { ConversationSummary } from '@/actions/chat';

function formatWhen(iso: string) {
  const d = new Date(iso);
  const now = new Date();
  const diff = now.getTime() - d.getTime();
  if (diff < 60_000) return 'Just now';
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)}m ago`;
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)}h ago`;
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export function ChatSidebar({
  conversations,
  activeId,
  onSelect,
  onNewChat,
}: {
  conversations: ConversationSummary[];
  activeId?: string;
  onSelect: (id: string) => void;
  onNewChat: () => void;
}) {
  return (
    <aside className="flex w-56 shrink-0 flex-col border-r border-white/8 bg-navy/50">
      <div className="border-b border-white/8 p-3">
        <button
          onClick={onNewChat}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-sm font-medium text-mist transition hover:border-teal/30 hover:bg-white/10"
        >
          <MessageSquarePlus size={16} className="text-teal" />
          New chat
        </button>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto p-2">
        {conversations.length === 0 ? (
          <p className="px-2 py-4 text-center text-xs text-mist/40">No conversations yet</p>
        ) : (
          <ul className="space-y-0.5">
            {conversations.map((c) => {
              const active = c.id === activeId;
              return (
                <li key={c.id}>
                  <button
                    onClick={() => onSelect(c.id)}
                    className={`w-full rounded-lg px-3 py-2.5 text-left transition ${
                      active
                        ? 'bg-gradient-to-r from-blue/15 to-teal/10 ring-1 ring-teal/20'
                        : 'hover:bg-white/5'
                    }`}
                  >
                    <p className={`truncate text-sm ${active ? 'font-medium text-mist' : 'text-mist/75'}`}>
                      {c.title}
                    </p>
                    <p className="mt-0.5 text-[10px] text-mist/35">{formatWhen(c.lastMessageAt)}</p>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </aside>
  );
}
