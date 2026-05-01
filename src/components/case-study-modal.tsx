'use client';

import { CSSProperties, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';

import { logoRegistry } from '@/data/logo-registry';
import { PortfolioContent } from '@/lib/portfolio-types';
import { isVideoAsset, richTextToHtml, toPublicPath } from '@/lib/portfolio-utils';

interface CaseStudyModalProps {
  slug: string | null;
  anchorRect?: {
    left: number;
    top: number;
    width: number;
    height: number;
    right: number;
    bottom: number;
  } | null;
  content: PortfolioContent;
  onClose: () => void;
}

function getFallbackTitle(slug: string): string {
  const registryItem = logoRegistry[slug];
  if (registryItem?.alt) return registryItem.alt;
  if (registryItem?.text) return registryItem.text;
  return slug;
}

function resolveSlideMedia(slides: Array<{ image?: string }>, currentIndex: number): string {
  for (let idx = currentIndex; idx >= 0; idx -= 1) {
    const media = slides[idx]?.image?.trim();
    if (media) return media;
  }

  return '';
}

export function CaseStudyModal({ slug, anchorRect, content, onClose }: CaseStudyModalProps) {
  const [slideIndex, setSlideIndex] = useState(0);
  const [contentStyle, setContentStyle] = useState<CSSProperties>({
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%) scale(1)'
  });
  const contentRef = useRef<HTMLDivElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);

  const caseStudy = slug ? content.caseStudies[slug] : null;
  const slides = useMemo(() => {
    const candidateSlides = caseStudy?.slides ?? [];
    if (!candidateSlides.length) {
      return [{ image: '', text: '', title: '' }];
    }

    return candidateSlides;
  }, [caseStudy?.slides]);

  useEffect(() => {
    setSlideIndex(0);
  }, [slug]);

  useLayoutEffect(() => {
    const placeCentered = () => {
      setContentStyle({
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%) scale(1)'
      });
    };

    if (!slug) {
      placeCentered();
      return;
    }

    if (!anchorRect || !resolveSlideMedia(slides, slideIndex)) {
      placeCentered();
      return;
    }

    setContentStyle({
      left: '-9999px',
      top: '0px',
      transform: 'scale(1)',
      opacity: 0,
      transition: 'none'
    });

    let rafId = 0;
    rafId = window.requestAnimationFrame(() => {
      const contentEl = contentRef.current;
      const imageEl = imageRef.current;
      if (!contentEl || !imageEl) {
        placeCentered();
        return;
      }

      const contentRect = contentEl.getBoundingClientRect();
      const imageRect = imageEl.getBoundingClientRect();
      if (!contentRect.width || !contentRect.height || !imageRect.width || !imageRect.height) {
        placeCentered();
        return;
      }

      const imageOffsetX = imageRect.left - contentRect.left;
      const imageOffsetY = imageRect.top - contentRect.top;

      let nextLeft = anchorRect.left - imageOffsetX;
      let nextTop = anchorRect.top - imageOffsetY;

      const margin = 20;
      const maxLeft = Math.max(margin, window.innerWidth - contentRect.width - margin);
      const maxTop = Math.max(margin, window.innerHeight - contentRect.height - margin);
      nextLeft = Math.min(Math.max(nextLeft, margin), maxLeft);
      nextTop = Math.min(Math.max(nextTop, margin), maxTop);

      setContentStyle({
        left: `${nextLeft}px`,
        top: `${nextTop}px`,
        transform: 'scale(1)',
        opacity: 1,
        transition: 'opacity 0.2s ease'
      });
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [anchorRect, slideIndex, slug, slides]);

  useEffect(() => {
    if (!slug) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [slug]);

  useEffect(() => {
    if (!slug) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }

      if (event.key === 'ArrowRight' || event.key === ' ') {
        event.preventDefault();
        if (slideIndex < slides.length - 1) {
          setSlideIndex((prev) => prev + 1);
        } else {
          onClose();
        }
      }

      if (event.key === 'ArrowLeft' && slideIndex > 0) {
        setSlideIndex((prev) => prev - 1);
      }
    };

    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [onClose, slideIndex, slides.length, slug]);

  const isOpen = Boolean(slug && caseStudy);
  const title = slug ? caseStudy?.title || getFallbackTitle(slug) : '';
  const roles = Array.isArray(caseStudy?.role) ? caseStudy.role : [];
  const activeSlide = slides[slideIndex] ?? { image: '', text: '', title: '' };
  const resolvedMedia = resolveSlideMedia(slides, slideIndex);
  const publicMediaPath = resolvedMedia ? encodeURI(toPublicPath(resolvedMedia)) : '';
  const mediaIsVideo = publicMediaPath ? isVideoAsset(publicMediaPath) : false;
  const slideHtml = richTextToHtml(activeSlide.text ?? '');

  const advanceSlide = () => {
    if (slideIndex < slides.length - 1) {
      setSlideIndex((prev) => prev + 1);
      return;
    }

    onClose();
  };

  if (!isOpen) {
    return (
      <div className="casestudy-modal" aria-hidden="true">
        <div className="casestudy-backdrop" />
      </div>
    );
  }

  return (
    <div className="casestudy-modal open" role="dialog" aria-modal="true" aria-label={title}>
      <div className="casestudy-backdrop" onClick={advanceSlide} />

      {slides.length > 1 ? (
        <div className="casestudy-progress" style={{ display: 'flex' }}>
          {slides.map((_, index) => (
            <span key={`dot-${index}`} className={`cs-dot ${index === slideIndex ? 'active' : ''}`} />
          ))}
        </div>
      ) : null}

      <button className="casestudy-close" type="button" style={{ display: 'block' }} onClick={onClose}>
        ×
      </button>

      <div ref={contentRef} className="casestudy-content" style={contentStyle}>
        <div className={`casestudy-slide ${slideIndex === slides.length - 1 ? 'is-last' : ''}`} onClick={advanceSlide}>
          {publicMediaPath ? (
            <div ref={imageRef} className="casestudy-slide-image">
              {mediaIsVideo ? (
                <video src={publicMediaPath} autoPlay muted loop playsInline />
              ) : (
                <img src={publicMediaPath} alt="" />
              )}
            </div>
          ) : (
            <div ref={imageRef} className="casestudy-slide-image" style={{ display: 'none' }} />
          )}

          <div className={`casestudy-slide-right ${publicMediaPath ? '' : 'no-media'}`}>
            {slideIndex === 0 ? (
              <div className="casestudy-meta">
                <span className="casestudy-title">{title}</span>
                <span className="casestudy-role">
                  {roles.map((service) => (
                    <span key={service} className="cs-service">
                      {service}
                    </span>
                  ))}
                </span>
              </div>
            ) : null}

            <div className="casestudy-slide-text">
              {activeSlide.title ? <p className="cs-slide-title">{activeSlide.title}</p> : null}
              {slideHtml ? <div dangerouslySetInnerHTML={{ __html: slideHtml }} /> : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
