export default function Audit() {
  return (
    <div>
      <h1 className="app-page-title">Store Audit</h1>
      <p className="app-page-subtitle">Scans for missing SEO, alt text, low inventory, and draft products, then scores 0–100 with one-click fixes.</p>
      <div className="app-card mt-6 text-center text-fog/60">
        Audit engine wiring is in progress. The pipeline supports an <code className="rounded bg-white/5 px-1.5 py-0.5 font-mono text-xs text-sky">audit</code> intent —
        connect it to a server action that pulls products via the Shopify client and computes the score.
      </div>
    </div>
  );
}
