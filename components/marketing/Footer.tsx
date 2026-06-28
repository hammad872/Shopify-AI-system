import { Logo } from './Logo';

export function Footer() {
  return (
    <footer className="border-t border-white/8 py-12">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-5 sm:flex-row">
        <div className="flex items-center gap-2.5">
          <Logo className="h-7 w-7" id="footer-logo" />
          <span className="font-display text-lg font-bold">StorePilot</span>
        </div>
        <p className="text-sm text-fog/40">Tell Shopify what to do.</p>
        <div className="flex gap-6 text-sm text-fog/50">
          <a href="#" className="hover:text-fog">Privacy</a>
          <a href="#" className="hover:text-fog">Terms</a>
          <a href="#" className="hover:text-fog">Contact</a>
        </div>
      </div>
      <p className="mt-8 text-center text-xs text-fog/30">© 2026 StorePilot AI. Not affiliated with or endorsed by Shopify Inc.</p>
    </footer>
  );
}
