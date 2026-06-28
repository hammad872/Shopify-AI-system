import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-white/8 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <Logo className="h-7 w-7" id="footer-logo" />
          <span className="font-display text-lg font-bold text-mist">Mareura</span>
        </div>
        <p className="text-sm text-mist/40">The AI command center for Shopify.</p>
        <div className="flex gap-6 text-sm text-mist/50">
          <a href="#" className="hover:text-mist">Privacy</a>
          <a href="#" className="hover:text-mist">Terms</a>
          <a href="#" className="hover:text-mist">Contact</a>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-mist/30">© 2026 Mareura. Not affiliated with or endorsed by Shopify Inc.</p>
    </footer>
  );
}
