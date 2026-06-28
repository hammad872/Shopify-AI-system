import { Navbar } from '@/components/marketing/Navbar';
import { Hero } from '@/components/marketing/Hero';
import { Marquee } from '@/components/marketing/Marquee';
import { HowItWorks } from '@/components/marketing/HowItWorks';
import { Capabilities } from '@/components/marketing/Capabilities';
import { Stats } from '@/components/marketing/Stats';
import { SafeByDesign } from '@/components/marketing/SafeByDesign';
import { Pricing } from '@/components/marketing/Pricing';
import { Faq } from '@/components/marketing/Faq';
import { CtaBand } from '@/components/marketing/CtaBand';
import { Footer } from '@/components/marketing/Footer';

export default function Landing() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-navy font-sans text-mist antialiased">
      <Navbar />
      <Hero />
      <Marquee />
      <HowItWorks />
      <Capabilities />
      <Stats />
      <SafeByDesign />
      <Pricing />
      <Faq />
      <CtaBand />
      <Footer />
    </div>
  );
}
