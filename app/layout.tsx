import './globals.css';
import type { Metadata } from 'next';
import Providers from '@/components/Providers';
import { display, sans, mono } from '@/lib/fonts';

export const metadata: Metadata = {
  title: 'Mareura — The AI Command Center for Shopify',
  description:
    'Run your Shopify store in plain English. Say what you want, review the plan, approve — done.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`}>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}
