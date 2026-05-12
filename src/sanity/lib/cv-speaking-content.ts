import { unstable_cache } from 'next/cache';

import { CvContentData } from '@/components/cv-content';
import { SpeakingContentData } from '@/components/speaking-content';
import { isSanityConfigured } from '@/sanity/lib/api';
import { PUBLISHED_REVALIDATE_SECONDS, sanityFetch } from '@/sanity/lib/fetch';
import { cvPageQuery, speakingPageQuery } from '@/sanity/lib/queries';

type RawCvJob = { company?: unknown; role?: unknown; dates?: unknown; bullets?: unknown };
type RawCvEducation = { school?: unknown; detail?: unknown };
type RawCvResult = { name?: unknown; bio?: unknown; experience?: unknown; education?: unknown } | null;

type RawSpeakingEntry = { year?: unknown; role?: unknown; title?: unknown; venue?: unknown };
type RawSpeakingResult = { heading?: unknown; entries?: unknown } | null;

const asString = (v: unknown): string | undefined =>
  typeof v === 'string' && v.length > 0 ? v : undefined;

const fetchCvContent = unstable_cache(
  async (): Promise<CvContentData | null> => {
    const result = (await sanityFetch({ query: cvPageQuery, tags: ['cv-content'] })) as RawCvResult;
    if (!result) return null;

    const bioArr = Array.isArray(result.bio) ? result.bio : [];
    const expArr = Array.isArray(result.experience) ? (result.experience as RawCvJob[]) : [];
    const eduArr = Array.isArray(result.education) ? (result.education as RawCvEducation[]) : [];

    return {
      name: asString(result.name),
      bio: bioArr.filter((p: unknown): p is string => typeof p === 'string' && p.length > 0),
      experience: expArr
        .filter((job) => typeof job?.company === 'string' && typeof job?.role === 'string')
        .map((job) => ({
          company: job.company as string,
          role: job.role as string,
          dates: asString(job.dates),
          bullets: Array.isArray(job.bullets)
            ? job.bullets.filter((b: unknown): b is string => typeof b === 'string')
            : []
        })),
      education: eduArr.map((edu) => ({
        school: asString(edu?.school),
        detail: asString(edu?.detail)
      }))
    };
  },
  ['cv-content-v1'],
  { revalidate: PUBLISHED_REVALIDATE_SECONDS, tags: ['cv-content'] }
);

const fetchSpeakingContent = unstable_cache(
  async (): Promise<SpeakingContentData | null> => {
    const result = (await sanityFetch({
      query: speakingPageQuery,
      tags: ['speaking-content']
    })) as RawSpeakingResult;
    if (!result) return null;

    const entriesArr = Array.isArray(result.entries) ? (result.entries as RawSpeakingEntry[]) : [];

    return {
      heading: asString(result.heading),
      entries: entriesArr
        .filter((e) => typeof e?.role === 'string' && typeof e?.title === 'string')
        .map((e) => ({
          year: asString(e.year),
          role: e.role as string,
          title: e.title as string,
          venue: asString(e.venue)
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
