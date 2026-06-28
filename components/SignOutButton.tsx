'use client';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: '/' })}
      className="mt-2 flex items-center gap-1.5 text-xs text-mist/40 transition hover:text-mist/70"
    >
      <LogOut size={12} />
      Sign out
    </button>
  );
}
