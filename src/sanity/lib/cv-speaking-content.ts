import { unstable_cache } from 'next/cache';

import { CvContentData } from '@/components/cv-content';
import { SpeakingContentData } from '@/components/speaking-content';
import { isSanityConfigured } from '@/sanity/lib/api';
import { PUBLISHED_REVALIDATE_SECONDS, sanityFetch } from '@/sanity/lib/fetch';
import { cvPageQuery, speakingPageQuery } from '@/sanity/lib/queries';

const fetchCvContent = unstable_cache(
  async (): Promise<CvContentData | null> => {
    const result = await sanityFetch({ query: cvPageQuery, tags: ['cv-content'] });
    if (!result) return null;

    return {
      name: result.name ?? undefined,
      bio: (result.bio ?? []).filter((p): p is string => typeof p === 'string' && p.length > 0),
      experience: (result.experience ?? [])
        .filter((job) => typeof job?.company === 'string' && typeof job?.role === 'string')
        .map((job) => ({
          company: job!.company!,
          role: job!.role!,
          dates: job?.dates ?? undefined,
          bullets: (job?.bullets ?? []).filter((b): b is string => typeof b === 'string')
        })),
      education: (result.education ?? []).map((edu) => ({
        school: edu?.school ?? undefined,
        detail: edu?.detail ?? undefined
      }))
    };
  },
  ['cv-content-v1'],
  { revalidate: PUBLISHED_REVALIDATE_SECONDS, tags: ['cv-content'] }
);

const fetchSpeakingContent = unstable_cache(
  async (): Promise<SpeakingContentData | null> => {
    const result = await sanityFetch({ query: speakingPageQuery, tags: ['speaking-content'] });
    if (!result) return null;

    return {
      heading: result.heading ?? undefined,
      entries: (result.entries ?? [])
        .filter((e) => typeof e?.role === 'string' && typeof e?.title === 'string')
        .map((e) => ({
          year: e?.year ?? undefined,
          role: e!.role!,
          title: e!.title!,
          venue: e?.venue ?? undefined
        }))
    };
  },
  ['speaking-content-v1'],
  { revalidate: PUBLISHED_REVALIDATE_SECONDS, tags: ['speaking-content'] }
);

export async function getCvContent(): Promise<CvContentData | undefined> {
  if (!isSanityConfigured) return undefined;
  try {
    const data = await fetchCvContent();
    return data ?? undefined;
  } catch (error) {
    console.error('Failed to load CV content from Sanity:', error);
    return undefined;
  }
}

export async function getSpeakingContent(): Promise<SpeakingContentData | undefined> {
  if (!isSanityConfigured) return undefined;
  try {
    const data = await fetchSpeakingContent();
    return data ?? undefined;
  } catch (error) {
    console.error('Failed to load Speaking content from Sanity:', error);
    return undefined;
  }
}
