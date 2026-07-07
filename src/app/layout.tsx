import type { Metadata } from 'next';

import './globals.css';
import { SITE_URL } from '@/lib/site';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Jordan Sowunmi',
  description: 'Strategy Director and VP Brand Consultant portfolio.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="preload"
          href="/font/AUTHENTIC%20SANS%20PRO%20220106/woff/AUTHENTICSans-60.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
