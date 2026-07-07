'use client';

import Link from 'next/link';
import { Fragment, MouseEvent, useCallback, useEffect, useMemo, useState } from 'react';

import { CaseStudyModal } from '@/components/case-study-modal';
import { CvContent, CvContentData } from '@/components/cv-content';
import { SlideModal } from '@/components/slide-modal';
import { SpeakingContent, SpeakingContentData } from '@/components/speaking-content';
import { LogoCard, PortfolioContent, PortfolioParagraphBlock } from '@/lib/portfolio-types';
import {
  getCaseStudySlugs,
  isVideoAsset,
  normalizeLinkUrl,
  resolveLogo,
  tokenizeParagraph,
  toPublicPath
} from '@/lib/portfolio-utils';

interface PortfolioPageProps {
  content: PortfolioContent;
  cvData?: CvContentData;
  speakingData?: SpeakingContentData;
}

interface HoverPreviewState {
  kind: 'preview';
  media: string;
  isVideo: boolean;
  isProject: boolean;
  hasMedia: boolean;
  transform: string;
  x: number;
  y: number;
}

interface HoverTooltipState {
  kind: 'tooltip';
  caption: string;
  hasLink: boolean;
  x: number;
  y: number;
}

type HoverState = HoverPreviewState | HoverTooltipState | null;
type ParagraphPiece = ParagraphTextPiece | ParagraphLogoPiece;
const cvLogoIds = new Set(['jordan', 'tiktok-company', 'wk', 'tbwa', 'anomaly', 'vice-company']);

interface ParagraphTextPiece {
  kind: 'text';
  key: string;
  text: string;
}

interface ParagraphLogoPiece {
  kind: 'logo';
  key: string;
  logoId: string;
}

function supportsHover(): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(hover: hover)').matches;
}

function computePreviewPosition(rect: DOMRect, anchor: 'left' | 'center' | 'right' = 'center') {
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const previewWidth = 260;
  const previewHeight = 260;
  const edgeMargin = 20;

  if (anchor === 'center') {
    const gap = 16;
    const half = previewWidth / 2;
    const x = Math.min(Math.max(rect.left + rect.width / 2, edgeMargin + half), viewportWidth - edgeMargin - half);
    const y = rect.top - gap;
    return { x, y, transform: 'translate(-50%, -100%)' };
  }

  // 'left' / 'right': sit beside the element (not stacked above it),
  // flipping to whichever side actually has room.
  const gap = 28;
  const fitsRight = rect.right + gap + previewWidth <= viewportWidth - edgeMargin;
  const fitsLeft = rect.left - gap - previewWidth >= edgeMargin;
  let placeRight = anchor === 'right';
  if (placeRight && !fitsRight && fitsLeft) placeRight = false;
  if (!placeRight && !fitsLeft && fitsRight) placeRight = true;

  const x = placeRight ? rect.right + gap : rect.left - gap;
  const halfHeight = previewHeight / 2;
  const y = Math.min(Math.max(rect.top + rect.height / 2, edgeMargin + halfHeight), viewportHeight - edgeMargin - halfHeight);

  return { x, y, transform: placeRight ? 'translate(0, -50%)' : 'translate(-100%, -50%)' };
}

function buildUnknownLogo(id: string, card?: LogoCard) {
  const hasImage = Boolean(card?.logoFile);
  const classSlug = id.replace(/[^a-z0-9]+/gi, '-').toLowerCase();

  return {
    id,
    definition: {
      id,
      variant: 'logo' as const,
      className: `logo logo-${classSlug}`,
      imageSrc: hasImage ? toPublicPath(card?.logoFile ?? '') : undefined,
      alt: id
    },
    card: {
      caption: card?.caption ?? '',
      color: card?.color ?? '#1a1a1a',
      link: normalizeLinkUrl(card?.link ?? ''),
      linkText: card?.linkText ?? ''
    },
    isProject: false,
    hoverMedia: ''
  };
}

function legacyParagraphToPieces(template: string, paragraphIndex: number): ParagraphPiece[] {
  const pieces: ParagraphPiece[] = [];

  tokenizeParagraph(template).forEach((part, partIndex) => {
    if (typeof part === 'string') {
      pieces.push({
        kind: 'text',
        key: `legacy-text-${paragraphIndex}-${partIndex}`,
        text: part
      });
      return;
    }

    pieces.push({
      kind: 'logo',
      key: `legacy-logo-${paragraphIndex}-${partIndex}-${part.id}`,
      logoId: part.id
    });
  });

  return pieces;
}

function portableParagraphToPieces(block: PortfolioParagraphBlock, paragraphIndex: number): ParagraphPiece[] {
  const pieces: ParagraphPiece[] = [];
  const markDefByKey = new Map((block.markDefs ?? []).map((markDef) => [markDef._key, markDef]));
  let lastReferenceMarkKey: string | null = null;

  (block.children ?? []).forEach((child, childIndex) => {
    const marks = child.marks ?? [];
    const referenceMarkKey =
      marks.find((mark) => {
        const markDef = markDefByKey.get(mark);
        return markDef?._type === 'portfolioReference' && Boolean(markDef.logoId?.trim());
      }) ?? null;

    if (referenceMarkKey) {
      const markDef = markDefByKey.get(referenceMarkKey);
      const logoId = markDef?.logoId?.trim() ?? '';

      if (!logoId) {
        if (child.text) {
          pieces.push({
            kind: 'text',
            key: `portable-text-${paragraphIndex}-${childIndex}`,
            text: child.text
          });
        }

        lastReferenceMarkKey = null;
        return;
      }

      if (referenceMarkKey !== lastReferenceMarkKey) {
        pieces.push({
          kind: 'logo',
          key: `portable-logo-${paragraphIndex}-${childIndex}-${referenceMarkKey}`,
          logoId
        });
      }

      lastReferenceMarkKey = referenceMarkKey;
      return;
    }

    if (child.text) {
      pieces.push({
        kind: 'text',
        key: `portable-text-${paragraphIndex}-${childIndex}`,
        text: child.text
      });
    }

    lastReferenceMarkKey = null;
  });

  return pieces;
}

function EmailCopy({ email, className = '' }: { email: string; className?: string }) {
  const [isCopied, setIsCopied] = useState(false);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(email);
      setIsCopied(true);
      window.setTimeout(() => setIsCopied(false), 900);
    } catch {
      setIsCopied(false);
    }
  };

  return (
    <span className={`email-copy ${className} ${isCopied ? 'copied' : ''}`} data-email={email} onClick={onCopy}>
      <span className="email-copy-text">{email}</span>
      <svg className="email-copy-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <rect x="9" y="9" width="13" height="13" rx="2" />
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
      </svg>
    </span>
  );
}

export function PortfolioPage({ content, cvData, speakingData }: PortfolioPageProps) {
  const [hoverState, setHoverState] = useState<HoverState>(null);
  const [activeCaseStudy, setActiveCaseStudy] = useState<string | null>(null);
  const [activePanel, setActivePanel] = useState<'cv' | 'speaking' | null>(null);

  const caseStudySlugs = useMemo(() => new Set(getCaseStudySlugs(content)), [content]);
  const paragraphPieces = useMemo(() => {
    if (content.paragraphBlocks?.length) {
      return content.paragraphBlocks.map((block, index) => portableParagraphToPieces(block, index));
    }

    return content.paragraphs.map((template, index) => legacyParagraphToPieces(template, index));
  }, [content]);

  const openCaseStudy = useCallback(
    (slug: string, pushHistory = true) => {
      if (!caseStudySlugs.has(slug)) return;

      setActiveCaseStudy(slug);
      setHoverState(null);

      if (pushHistory) {
        const safeSlug = encodeURIComponent(slug);
        window.history.pushState({ project: slug }, '', `#${safeSlug}`);
      }
    },
    [caseStudySlugs]
  );

  const closeCaseStudy = useCallback((clearHash = true) => {
    setActiveCaseStudy(null);

    if (clearHash) {
      window.history.pushState({}, '', `${window.location.pathname}${window.location.search}`);
    }
  }, []);

  useEffect(() => {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const syncFromHash = () => {
      const rawHash = window.location.hash.replace(/^#/, '');
      const slug = decodeURIComponent(rawHash);

      if (slug && caseStudySlugs.has(slug)) {
        setActiveCaseStudy(slug);
      } else {
        setActiveCaseStudy(null);
      }
    };

    syncFromHash();
    window.addEventListener('popstate', syncFromHash);
    window.addEventListener('hashchange', syncFromHash);

    return () => {
      window.removeEventListener('popstate', syncFromHash);
      window.removeEventListener('hashchange', syncFromHash);
    };
  }, [caseStudySlugs]);

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>('.content .fade-item'));
    if (!items.length) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const timers: ReturnType<typeof setTimeout>[] = [];

    // Stagger every item in DOM order — no scroll logic, just sequential reveals
    items.forEach((el, i) => {
      const id = setTimeout(() => {
        el.classList.add('word-visible');
      }, i * 40);
      timers.push(id);
    });

    return () => {
      timers.forEach(clearTimeout);
      items.forEach(el => el.classList.remove('word-visible'));
    };
  }, [paragraphPieces]);

  const onLogoMouseEnter = useCallback(
    (event: MouseEvent<HTMLElement>, logoId: string) => {
      if (!supportsHover()) return;

      const resolved = resolveLogo(logoId, content) ?? buildUnknownLogo(logoId, content.logoCards[logoId]);
      const media = resolved.hoverMedia ? encodeURI(toPublicPath(resolved.hoverMedia)) : '';

      if (resolved.isProject || media) {
        const anchor = ('hoverAnchor' in resolved.definition ? resolved.definition.hoverAnchor : undefined) ?? 'center';
        const pos = computePreviewPosition(event.currentTarget.getBoundingClientRect(), anchor);
        setHoverState({
          kind: 'preview',
          media,
          isVideo: Boolean(media && isVideoAsset(media)),
          isProject: resolved.isProject,
          hasMedia: Boolean(media),
          transform: pos.transform,
          x: pos.x,
          y: pos.y
        });
        return;
      }

      const caption = resolved.card.link && resolved.card.linkText ? resolved.card.linkText : resolved.card.caption;
      if (!caption) {
        setHoverState(null);
        return;
      }

      // The arrow signals "this opens an external link" — suppress it for
      // logos that actually open the CV modal instead, even if a legacy
      // card.link value happens to be set on their CMS entry.
      const rect = event.currentTarget.getBoundingClientRect();
      setHoverState({
        kind: 'tooltip',
        caption,
        hasLink: Boolean(resolved.card.link) && !cvLogoIds.has(logoId),
        x: rect.left + rect.width / 2,
        y: rect.top - 12
      });
    },
    [content]
  );

  const onLogoMouseLeave = useCallback(() => {
    if (!supportsHover()) return;
    setHoverState(null);
  }, []);

  const onLogoClick = useCallback(
    (event: MouseEvent<HTMLElement>, logoId: string) => {
      // Let modified/middle clicks fall through to native <a> behavior
      // (open in new tab, etc.) instead of hijacking them into the modal.
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      const resolved = resolveLogo(logoId, content) ?? buildUnknownLogo(logoId, content.logoCards[logoId]);

      if (resolved.isProject) {
        event.preventDefault();
        openCaseStudy(logoId, true);
        return;
      }

      if (cvLogoIds.has(logoId)) {
        event.preventDefault();
        setActivePanel('cv');
        return;
      }

      if (resolved.card.link) {
        event.preventDefault();
        window.open(resolved.card.link, '_blank', 'noopener,noreferrer');
      }
    },
    [content, openCaseStudy]
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="gradient-top" />
      <div className="gradient-bottom" />

      <nav className="top-nav">
        <div className="top-nav-inner">
          <Link href="/" className="nav-panel-link">Jordan Sowunmi</Link>
          <span className="separator" />
          <button className="nav-panel-link" onClick={() => setActivePanel('cv')}>CV</button>
          <span className="separator" />
          <button className="nav-panel-link" onClick={() => setActivePanel('speaking')}>Speaking</button>
          <span className="separator desktop-only" />
          <EmailCopy email="HELLO@JORDANSOWUNMI.COM" className="desktop-only" />
        </div>
      </nav>

      <main className="content">
        {paragraphPieces.map((pieces, paragraphIndex) => (
          <p key={`paragraph-${paragraphIndex}`} data-para={paragraphIndex}>
            {pieces.map((piece, partIndex) => {
              if (piece.kind === 'text') {
                const text = piece.text;
                const PHRASE = 'public speaker';
                const phraseIdx = text.toLowerCase().indexOf(PHRASE);

                // Split a string into per-word fade-item spans, preserving spaces as text nodes
                const toWordSpans = (str: string, pfx: string) =>
                  str.split(/(\s+)/).filter(Boolean).map((token, j) =>
                    /^\s+$/.test(token)
                      ? token
                      : <span key={`${pfx}-${j}`} className="fade-item">{token}</span>
                  );

                if (phraseIdx !== -1) {
                  return (
                    <Fragment key={piece.key}>
                      {toWordSpans(text.slice(0, phraseIdx), `${piece.key}-a`)}
                      <a
                        href="/speaking"
                        className="fade-item speaking-link"
                        onClick={(event) => {
                          if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
                            return;
                          }
                          event.preventDefault();
                          setActivePanel('speaking');
                        }}
                      >
                        {text.slice(phraseIdx, phraseIdx + PHRASE.length)}
                      </a>
                      {toWordSpans(text.slice(phraseIdx + PHRASE.length), `${piece.key}-c`)}
                    </Fragment>
                  );
                }

                return (
                  <Fragment key={piece.key}>
                    {toWordSpans(text, piece.key)}
                  </Fragment>
                );
              }

              const logoId = piece.logoId;
              const resolved = resolveLogo(logoId, content) ?? buildUnknownLogo(logoId, content.logoCards[logoId]);
              const className = `${resolved.definition.className}${resolved.isProject ? ' logo-project' : ''} fade-item`;
              const tokenKey = piece.key || `token-${paragraphIndex}-${partIndex}-${logoId}`;

              // Real hrefs (not just onClick) so these are crawlable, indexable
              // links, and so cmd/ctrl/middle-click "open in new tab" works.
              const navHref = resolved.isProject ? `/work/${logoId}` : cvLogoIds.has(logoId) ? '/cv' : undefined;
              const Tag = navHref ? 'a' : 'span';

              const commonProps = {
                className,
                'data-logo-id': logoId,
                'data-hover-img': resolved.hoverMedia,
                'data-card-caption': resolved.card.caption,
                'data-card-color': resolved.card.color,
                onMouseEnter: (event: MouseEvent<HTMLElement>) => onLogoMouseEnter(event, logoId),
                onMouseLeave: onLogoMouseLeave,
                onClick: (event: MouseEvent<HTMLElement>) => onLogoClick(event, logoId),
                ...(navHref ? { href: navHref } : {}),
                ...(!navHref && resolved.card.link ? { 'data-link-url': resolved.card.link } : {})
              };

              if (resolved.definition.variant === 'name') {
                return (
                  <Tag key={tokenKey} {...commonProps}>
                    {resolved.definition.text ?? logoId}
                  </Tag>
                );
              }

              const card = content.logoCards[logoId];
              const overrideImage = card?.logoFile;
              const imageSource = overrideImage
                ? toPublicPath(overrideImage)
                : resolved.definition.imageSrc ?? '';
              if (imageSource) {
                const w = card?.logoWidth;
                const h = card?.logoHeight;
                return (
                  <Tag key={tokenKey} {...commonProps}>
                    <img
                      src={encodeURI(imageSource)}
                      alt={resolved.definition.alt ?? logoId}
                      loading="lazy"
                      {...(w && h ? { width: w, height: h, style: { aspectRatio: `${w} / ${h}` } } : {})}
                    />
                  </Tag>
                );
              }

              return (
                <Tag key={tokenKey} {...commonProps}>
                  {logoId}
                </Tag>
              );
            })}
          </p>
        ))}

        <p>
          <span className="desktop-only">
            {'To discuss a project or just say hi, email me at: '.split(/(\s+)/).filter(Boolean).map((token, i) =>
              /^\s+$/.test(token)
                ? <Fragment key={`d-${i}`}>{token}</Fragment>
                : <span key={`d-${i}`} className="fade-item">{token}</span>
            )}
          </span>
          <span className="mobile-only">
            {'To discuss a project or just say hi: '.split(/(\s+)/).filter(Boolean).map((token, i) =>
              /^\s+$/.test(token)
                ? <Fragment key={`m-${i}`}>{token}</Fragment>
                : <span key={`m-${i}`} className="fade-item">{token}</span>
            )}
          </span>
          <span className="fade-item"><EmailCopy email="hello@jordansowunmi.com" /></span>
        </p>
      </main>

      {hoverState?.kind === 'preview' ? (
        <div
          className={`hover-preview visible ${hoverState.isProject ? 'is-project' : ''} ${
            hoverState.isProject && !hoverState.hasMedia ? 'no-media' : ''
          }`}
          style={{
            left: hoverState.x,
            top: hoverState.y,
            transform: hoverState.transform
          }}
        >
          {hoverState.hasMedia ? (
            hoverState.isVideo ? (
              <video src={hoverState.media} autoPlay muted loop playsInline />
            ) : (
              <img src={hoverState.media} alt="" />
            )
          ) : null}
        </div>
      ) : null}

      {hoverState?.kind === 'tooltip' ? (
        <div
          className="logo-tooltip visible"
          style={{ left: hoverState.x, top: hoverState.y, transform: 'translate(-50%, -100%)' }}
        >
          {hoverState.caption}
          {hoverState.hasLink ? (
            <span className="tooltip-arrow" aria-hidden="true">
              <svg viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M2.2 7.8 L7.8 2.2 M3.6 2.2 L7.8 2.2 L7.8 6.4"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
          ) : null}
        </div>
      ) : null}

      <CaseStudyModal
        slug={activeCaseStudy}
        content={content}
        onClose={() => closeCaseStudy(true)}
      />

      <SlideModal isOpen={activePanel !== null} onClose={() => setActivePanel(null)}>
        {/* Sticky tab bar with close button */}
        <div style={{
          position: 'sticky',
          top: 0,
          zIndex: 10,
          background: '#000',
          display: 'flex',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
          padding: '20px 24px 0',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
        }}>
          <div style={{ display: 'flex', gap: 24 }}>
            {(['cv', 'speaking'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActivePanel(tab)}
                style={{
                  background: 'none',
                  border: 'none',
                  padding: '0 0 16px',
                  cursor: 'pointer',
                  fontFamily: 'Authentic Sans, Helvetica Neue, Arial, sans-serif',
                  fontWeight: 400,
                  fontSize: 12,
                  letterSpacing: '1.44px',
                  textTransform: 'uppercase',
                  color: activePanel === tab ? '#fff' : 'rgba(255,255,255,0.35)',
                  borderBottom: activePanel === tab ? '1px solid #fff' : '1px solid transparent',
                  marginBottom: -1,
                  transition: 'color 0.15s ease',
                }}
              >
                {tab === 'cv' ? 'CV' : 'Speaking'}
              </button>
            ))}
          </div>
        </div>
        {activePanel === 'cv' && <CvContent data={cvData} />}
        {activePanel === 'speaking' && <SpeakingContent data={speakingData} />}
      </SlideModal>

      <footer className="mobile-footer">
        <EmailCopy email="HELLO@JORDANSOWUNMI.COM" />
      </footer>
    </div>
  );
}
