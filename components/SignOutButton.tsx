'use client';
import { signOut } from 'next-auth/react';

export default function SignOutButton() {
  return (
    <button onClick={() => signOut({ callbackUrl: '/' })} className="mt-1 text-xs text-fog/40 transition hover:text-fog/70">
      Sign out
    </button>
  );
}
