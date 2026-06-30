import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/Navbar';
import { Analytics } from '@vercel/analytics/react';

export const metadata: Metadata = {
  title: 'iZoriginals',
  description: 'Bespoke Craftsmanship. Uniquely Yours.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      {/* THIS IS THE MAGIC LINE: */}
      <body className="bg-neutral-50 text-neutral-900 antialiased">
        <Navbar />
        {children}
        <Analytics />
      </body>
    </html>
  );
}