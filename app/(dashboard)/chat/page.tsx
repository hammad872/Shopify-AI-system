import { Suspense } from 'react';
import ChatClient from '@/components/app/ChatClient';

export default function ChatPage() {
  return (
    <Suspense fallback={<p className="text-mist/50">Loading chat…</p>}>
      <ChatClient />
    </Suspense>
  );
}
