import Link from 'next/link';
import { Logo } from '@/components/marketing/Logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-navy font-sans text-fog antialiased">
      <div className="glow -top-20 left-1/4 h-72 w-72 bg-royal/40" />
      <div className="glow right-1/4 top-10 h-80 w-80 bg-green/30" />
      <div className="noise absolute inset-0 opacity-40" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-12">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <Logo className="h-9 w-9" />
          <span className="font-display text-xl font-bold tracking-tight">StorePilot</span>
        </Link>
        <div className="grad-border rounded-2xl p-2 shadow-2xl shadow-black/50">
          <div className="rounded-xl bg-[#0E1730] p-8 ring-1 ring-white/5">{children}</div>
        </div>
      </div>
    </div>
  );
}
