'use client';

import { CaseStudyHeading } from '@/components/case-study-heading';
import { CaseStudySlides } from '@/components/case-study-slides';
import { CaseStudy } from '@/lib/portfolio-types';
import { getCaseStudyTitle, isVideoAsset, toPublicPath } from '@/lib/portfolio-utils';

interface CaseStudyBodyProps {
  slug: string;
  caseStudy: CaseStudy;
  /** 'h1' for the standalone SEO page, 'span' inside the modal dialog. */
  titleAs?: 'h1' | 'span';
}

/**
 * Shared case study layout: flush cover photo, then a centered column
 * (title/tags, a divider, and the slides) whose width matches the slide
 * body's own text width. Used by both the standalone /work/[slug] page
 * and the homepage's slide-in modal, so they always look identical.
 */
export function CaseStudyBody({ slug, caseStudy, titleAs = 'span' }: CaseStudyBodyProps) {
  const title = getCaseStudyTitle(slug, caseStudy);
  const roles = Array.isArray(caseStudy.role) ? caseStudy.role : [];
  const slides = caseStudy.slides ?? [];

  const coverIndex = slides.findIndex((slide) => slide.image?.trim());
  const coverImage = slides[coverIndex]?.image?.trim();
  const coverPath = coverImage ? encodeURI(toPublicPath(coverImage)) : '';
  const coverIsVideo = coverPath ? isVideoAsset(coverPath) : false;
  const coverShowsControls = Boolean(slides[coverIndex]?.showVideoControls);

  // The first slide's image becomes the flush cover — drop it from the
  // slide body so it isn't rendered twice, and drop the slide entirely if
  // that leaves it with no text either.
  const bodySlides = slides
    .map((slide, index) => (index === coverIndex ? { ...slide, image: undefined } : slide))
    .filter((slide) => slide.image?.trim() || slide.text?.trim());

  return (
    <>
      {coverPath ? (
        <div className="work-cover">
          {coverIsVideo ? (
            coverShowsControls ? (
              <video src={coverPath} controls playsInline />
            ) : (
              <video src={coverPath} autoPlay muted loop playsInline />
            )
          ) : (
            <img src={coverPath} alt="" />
          )}
        </div>
      ) : null}

      <div className="work-content">
        <div className="work-header">
          <CaseStudyHeading title={title} roles={roles} as={titleAs} />
        </div>
        <hr className="work-divider" />
        <CaseStudySlides slides={bodySlides} bare />
      </div>
    </>
  );
}
