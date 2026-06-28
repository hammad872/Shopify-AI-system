import { ClipboardCheck, Construction } from 'lucide-react';

export default function Audit() {
  return (
    <div className="max-w-2xl">
      <p className="font-mono text-xs uppercase tracking-[0.2em] text-teal">Quality</p>
      <h1 className="app-page-title mt-1">Store Audit</h1>
      <p className="app-page-subtitle">Scans for missing SEO, alt text, low inventory, and draft products, then scores 0–100 with one-click fixes.</p>
      <div className="app-card mt-6 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal/10 ring-1 ring-teal/25">
          <ClipboardCheck size={24} className="text-teal" />
        </div>
        <div className="mx-auto mb-3 flex w-fit items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-medium text-amber-300">
          <Construction size={12} />
          Coming soon
        </div>
        <p className="text-sm text-mist/55">
          Audit engine wiring is in progress. The pipeline supports an{' '}
          <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-teal">audit</code>{' '}
          intent — connect it to a server action that pulls products via the Shopify client and computes the score.
        </p>
      </div>
    </div>
  );
}
