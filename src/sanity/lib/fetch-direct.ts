import type { PortfolioContent } from '@/lib/portfolio-types';
import fallbackContent from '../../../content.json';

// Inline GROQ query — no next-sanity import needed
const query = `*[_type == "portfolioPage"][0]{
  navLabelPrimary,
  navLabelSecondary,
  contactEmail,
  paragraphBlocks[]{
    _key, _type, style,
    children[]{ _key, _type, text, marks },
    markDefs[]{
      ...,
      _type == "portfolioReference" => {
        _key, _type,
        "referenceType": reference->_type,
        "logoId": reference->logoId
      }
    }
  },
  "logoCards": *[_type == "logoCard"] | order(coalesce(orderRank, 9999) asc, _updatedAt desc) {
    "logoId": logoId, caption, color, link, linkText,
    "logoFile": coalesce(logoAsset.asset->url, logoFilePath),
    "logoWidth": logoAsset.asset->metadata.dimensions.width,
    "logoHeight": logoAsset.asset->metadata.dimensions.height
  },
  "caseStudies": *[_type == "caseStudy"] | order(coalesce(orderRank, 9999) asc, _updatedAt desc) {
    "id": coalesce(slug.current, logoId), logoId, title, role,
    slides[]{ _key, title, text, "image": coalesce(mediaFile.asset->url, mediaPath) }
  }
}`;

export async function fetchSanityContent(): Promise<PortfolioContent | null> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-04-20';

  if (!projectId) return null;

  const url = `https://${projectId}.apicdn.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(query)}`;

  const res = await fetch(url, { next: { revalidate: 3600 } });
  if (!res.ok) return null;

  const { result } = await res.json();
  if (!result) return null;

  // Merge with fallback so logo definitions that aren't in Sanity still work
  const fb = fallbackContent as PortfolioContent;
  return {
    paragraphs: fb.paragraphs,
    paragraphBlocks: result.paragraphBlocks?.length ? result.paragraphBlocks : fb.paragraphBlocks,
    logoCards: { ...fb.logoCards, ...Object.fromEntries(
      (result.logoCards ?? []).filter((c: { logoId?: string }) => c?.logoId).map((c: { logoId: string }) => [c.logoId, c])
    )},
    caseStudies: { ...fb.caseStudies, ...Object.fromEntries(
      (result.caseStudies ?? []).filter((s: { id?: string }) => s?.id).map((s: { id: string }) => [s.id, s])
    )},
  };
}
