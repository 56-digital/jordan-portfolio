import type { MetadataRoute } from 'next';

import { getCaseStudySlugs } from '@/lib/portfolio-utils';
import { SITE_URL } from '@/lib/site';
import { getPortfolioContent } from '@/sanity/lib';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const content = await getPortfolioContent();
  const slugs = getCaseStudySlugs(content);

  return [
    { url: SITE_URL, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/cv`, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE_URL}/speaking`, changeFrequency: 'monthly', priority: 0.7 },
    ...slugs.map((slug) => ({
      url: `${SITE_URL}/work/${slug}`,
      changeFrequency: 'monthly' as const,
      priority: 0.8
    }))
  ];
}
