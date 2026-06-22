export default function Audit() {
  return (
    <div>
      <h1 className="text-2xl font-semibold">Store Audit</h1>
      <p className="mt-1 text-muted">Scans for missing SEO, alt text, low inventory, and draft products, then scores 0–100 with one-click fixes.</p>
      <div className="mt-6 rounded-xl border border-dashed border-border bg-surface p-8 text-center text-muted">
        Audit engine wiring is Phase 9. The pipeline supports an <code>audit</code> intent —
        connect it to a server action that pulls products via the Shopify client and computes the score.
      </div>
    </div>
  );
}
