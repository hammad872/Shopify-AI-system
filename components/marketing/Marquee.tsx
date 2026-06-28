const phrases = [
  'Create products', 'Adjust inventory', 'Write SEO', 'Build collections', 'Audit your store',
  'Bulk price changes', 'Generate alt text', 'Draft descriptions', 'Publish in one click',
];

export function Marquee() {
  return (
    <section className="border-y border-white/5 bg-white/[0.02] py-5">
      <div className="marquee-wrap relative overflow-hidden">
        <div className="marquee-track flex w-max gap-3">
          {[...phrases, ...phrases].map((p, i) => (
            <span key={i} className="whitespace-nowrap rounded-full border border-white/8 bg-white/[0.03] px-4 py-1.5 text-sm text-mist/50">{p}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
