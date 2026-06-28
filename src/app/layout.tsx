import type { Metadata } from 'next';
import { Playfair_Display } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import Navbar from '@/components/Navbar'; // <-- We import the Navbar here

// Configure Playfair Display
const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-playfair', 
});

export const metadata: Metadata = {
  title: 'iZoriginals Platform',
  description: 'Bespoke custom gifts and stationery',
};

export interface RootLayoutProps {
  children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en">
      <body className={playfair.className} style={{ margin: 0, padding: 0, backgroundColor: '#fdfdfd' }}>
        {/* The Navbar will now automatically appear on all pages */}
        <Navbar />
        
        {/* The current page renders inside 'children' */}
        <main>
          {children}
        </main>
        <Analytics />
      </body>
    </html>
  );
}