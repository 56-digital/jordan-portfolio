import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

import { CaseStudyBody } from '@/components/case-study-body';
import { PageNav } from '@/components/page-nav';
import { CaseStudySlide } from '@/lib/portfolio-types';
import { getCaseStudy, getCaseStudySlugs, getCaseStudyTitle, isVideoAsset, toPublicPath } from '@/lib/portfolio-utils';
import { getPortfolioContent } from '@/sanity/lib';

export const revalidate = 60;
export const dynamicParams = true;

interface WorkPageProps {
  params: Promise<{ slug: string }>;
}

function plainTextDescription(slides: CaseStudySlide[]): string {
  const text = slides.map((slide) => slide.text).find((value) => value?.trim())?.trim() ?? '';
  const flattened = text
    .replace(/\*\*(.+?)\*\*/g, '$1')
    .replace(/\*(.+?)\*/g, '$1')
    .replace(/^[-•]\s+/gm, '')
    .replace(/\s+/g, ' ')
    .trim();

  if (flattened.length <= 160) return flattened;
  return `${flattened.slice(0, 157).trimEnd()}...`;
}

export async function generateStaticParams() {
  const content = await getPortfolioContent();
  return getCaseStudySlugs(content).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const content = await getPortfolioContent();
  const caseStudy = getCaseStudy(content, slug);
  if (!caseStudy) return {};

  const title = getCaseStudyTitle(slug, caseStudy);
  const slides = caseStudy.slides ?? [];
  const description = plainTextDescription(slides) || `${title} — a case study by Jordan Sowunmi.`;

  // Open Graph wants a static image — skip video assets when picking one.
  const ogImage = slides
    .map((slide) => slide.image?.trim())
    .filter((image): image is string => Boolean(image))
    .map((image) => encodeURI(toPublicPath(image)))
    .find((path) => !isVideoAsset(path));

  return {
    title: `${title} | Jordan Sowunmi`,
    description,
    alternates: { canonical: `/work/${slug}` },
    openGraph: {
      title,
      description,
      url: `/work/${slug}`,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: ogImage ? 'summary_large_image' : 'summary',
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
  };
}

export default async function WorkPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const content = await getPortfolioContent();
  const caseStudy = getCaseStudy(content, slug);
  if (!caseStudy) notFound();

  return (
    <div className="work-page">
      <PageNav />
      <CaseStudyBody slug={slug} caseStudy={caseStudy} titleAs="h1" />
    </div>
  );
}
