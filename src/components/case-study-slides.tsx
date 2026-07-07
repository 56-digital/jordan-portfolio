'use client';

import { PortableText, type PortableTextComponents } from '@portabletext/react';
import { useEffect, useRef, useState } from 'react';

import { CaseStudySlide } from '@/lib/portfolio-types';
import { isVideoAsset, toPublicPath } from '@/lib/portfolio-utils';

const portableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p>{children}</p>,
    h3: ({ children }) => <p className="cs-slide-title">{children}</p>,
    h4: ({ children }) => <p className="cs-slide-subtitle">{children}</p>
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>
  },
  listItem: {
    bullet: ({ children }) => <li>{children}</li>
  }
};

function MuteIcon({ muted }: { muted: boolean }) {
  return muted ? (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <line x1="23" y1="9" x2="17" y2="15" />
      <line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  ) : (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 5 6 9H2v6h4l5 4V5z" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

function CaseStudySlideMedia({ path, showVideoControls }: { path: string; showVideoControls?: boolean }) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const isVideo = isVideoAsset(path);

  if (!isVideo) {
    return (
      <div className="cs-media">
        <img src={path} alt="" />
      </div>
    );
  }

  if (showVideoControls) {
    return (
      <div className="cs-media">
        <video ref={videoRef} src={path} controls playsInline />
      </div>
    );
  }

  return (
    <div className="cs-media">
      <video ref={videoRef} src={path} autoPlay muted loop playsInline />
      <button
        type="button"
        className={`cs-mute-toggle ${isMuted ? 'is-muted' : ''}`}
        aria-label={isMuted ? 'Unmute video' : 'Mute video'}
        onClick={(event) => {
          event.stopPropagation();
          setIsMuted((prev) => !prev);
        }}
      >
        <MuteIcon muted={isMuted} />
      </button>
    </div>
  );
}

interface CaseStudySlidesProps {
  slides: CaseStudySlide[];
  /** When true, the slide blocks skip their own horizontal padding — for
   * pages that already control the column width/padding themselves. */
  bare?: boolean;
}

export function CaseStudySlides({ slides, bare = false }: CaseStudySlidesProps) {
  return (
    <div className={`cs-panel-body ${bare ? 'cs-panel-body--bare' : ''}`}>
      {slides.map((slide, index) => {
        const media = slide.image?.trim();
        const publicMediaPath = media ? encodeURI(toPublicPath(media)) : '';

        return (
          <div key={index} className="cs-slide-block">
            {publicMediaPath ? (
              <CaseStudySlideMedia path={publicMediaPath} showVideoControls={slide.showVideoControls} />
            ) : null}
            <div className="cs-slide-block-text casestudy-slide-text">
              {slide.title ? <p className="cs-slide-title">{slide.title}</p> : null}
              {slide.richText?.length ? (
                <PortableText value={slide.richText} components={portableTextComponents} />
              ) : null}
            </div>
          </div>
        );
      })}
    </div>
  );
}
