import Link from 'next/link';
import { Logo } from '@/components/marketing/Logo';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-navy font-sans text-mist antialiased">
      <div className="aurora -top-32 left-1/4 h-96 w-96 bg-blue/30" />
      <div className="aurora right-1/4 top-20 h-80 w-80 bg-teal/25" style={{ animationDelay: '-6s' }} />
      <div className="aurora bottom-0 left-1/2 h-64 w-64 bg-green/20" style={{ animationDelay: '-10s' }} />
      <div className="grid-bg absolute inset-0 opacity-25" />
      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-5 py-12">
        <Link href="/" className="mb-8 flex items-center justify-center gap-2.5">
          <Logo className="h-9 w-9" />
          <span className="font-display text-xl font-bold tracking-tight text-mist">Mareura</span>
        </Link>
        <div className="ring-grad rounded-2xl p-2 shadow-2xl shadow-black/50">
          <div className="glass rounded-xl p-8 ring-1 ring-white/5">{children}</div>
        </div>
        <p className="mt-6 text-center text-xs text-mist/35">
          By continuing, you agree to our terms of service.
        </p>
      </div>
    </div>
  );
}
