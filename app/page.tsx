import Link from 'next/link';

export default function Landing() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-24">
      <p className="text-brand font-medium">StorePilot AI</p>
      <h1 className="mt-3 text-4xl font-semibold leading-tight">Manage your Shopify store through chat.</h1>
      <p className="mt-4 text-muted text-lg">
        Connect your store and run real operations in natural language — create products, adjust
        inventory, generate SEO. Every write is shown as a plan you approve before it runs.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/signup" className="rounded-lg bg-brand px-5 py-2.5 font-medium">Start free</Link>
        <Link href="/pricing" className="rounded-lg border border-border px-5 py-2.5">Pricing</Link>
      </div>
    </main>
  );
}
