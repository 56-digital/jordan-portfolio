'use client';

import dynamic from 'next/dynamic';

import config from '@/../sanity.config';

// Lazy-load the studio so it never runs during the server build
// (avoids next-sanity/studio's react-dom ESM issues on Vercel)
const NextStudio = dynamic(
  () => import('next-sanity/studio').then((m) => m.NextStudio),
  { ssr: false }
);

export default function StudioPage() {
  return <NextStudio config={config} />;
}
