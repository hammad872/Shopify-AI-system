import { Navbar } from '@/components/marketing/Navbar';
import { Hero } from '@/components/marketing/Hero';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { Capabilities } from '@/components/marketing/Capabilities';
import { SafeByDesign } from '@/components/marketing/SafeByDesign';
import { Pricing } from '@/components/marketing/Pricing';
import { Faq } from '@/components/marketing/Faq';
import { CtaBand } from '@/components/marketing/CtaBand';
import { Footer } from '@/components/marketing/Footer';
import { ScrollReveal } from '@/components/marketing/ScrollReveal';

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-navy font-sans text-fog antialiased">
      <ScrollReveal />
      <Navbar />
      <Hero />

      <section className="border-y border-white/5 bg-white/[0.02] py-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-10 gap-y-3 px-5 text-sm text-fog/45">
          <span className="reveal">Works with your existing Shopify store</span>
          <span className="reveal hidden h-4 w-px bg-white/10 sm:block" />
          <span className="reveal">Read-only until you approve</span>
          <span className="reveal hidden h-4 w-px bg-white/10 sm:block" />
          <span className="reveal">Every action logged</span>
          <span className="reveal hidden h-4 w-px bg-white/10 sm:block" />
          <span className="reveal">Tokens encrypted at rest</span>
        </div>
      </section>

      <HowItWorks />
      <Capabilities />
      <SafeByDesign />

      <section className="py-8">
        <div className="mx-auto grid max-w-5xl gap-4 px-5 sm:grid-cols-2 lg:grid-cols-4">
          <div className="reveal flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5"><span className="text-green">⚡</span><span className="text-sm font-semibold">Fast execution</span></div>
          <div className="reveal flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5"><span className="text-green">🛡️</span><span className="text-sm font-semibold">Safe &amp; secure</span></div>
          <div className="reveal flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5"><span className="text-green">💬</span><span className="text-sm font-semibold">Plain English commands</span></div>
          <div className="reveal flex items-center gap-3 rounded-xl border border-white/[0.08] bg-white/[0.03] px-4 py-3.5"><span className="text-green">🛍️</span><span className="text-sm font-semibold">Built for Shopify</span></div>
        </div>
      </section>

      <Pricing />
      <Faq />
      <CtaBand />
      <Footer />
    </div>
  );
}
