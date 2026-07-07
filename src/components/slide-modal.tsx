'use client';

import { useCallback, useEffect, useRef } from 'react';

interface SlideModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: 'left' | 'right';
  /** Show the mobile bottom-sheet drag handle. Off by default because
   * panels with their own sticky header (e.g. CV/Speaking) would have it
   * collide with that header; the case study panel's flush cover has room. */
  dragHandle?: boolean;
  /** Let a downward touch drag (starting at scrollTop 0) dismiss the sheet,
   * mirroring the drag handle's affordance on mobile. */
  swipeToClose?: boolean;
}

const SWIPE_CLOSE_THRESHOLD = 80;

export function SlideModal({
  isOpen,
  onClose,
  children,
  side = 'right',
  dragHandle = false,
  swipeToClose = false
}: SlideModalProps) {
  const outerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const touchStartY = useRef<number | null>(null);
  const dragging = useRef(false);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [isOpen, onClose]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    if (!swipeToClose || !scrollRef.current) return;
    if (scrollRef.current.scrollTop > 0) return;
    touchStartY.current = e.touches[0].clientY;
    dragging.current = true;
  }, [swipeToClose]);

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!dragging.current || touchStartY.current === null || !outerRef.current) return;
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) {
      outerRef.current.style.transition = 'none';
      outerRef.current.style.transform = `translateY(${delta}px)`;
    }
  }, []);

  const onTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!dragging.current || !outerRef.current) return;
    dragging.current = false;
    const delta = touchStartY.current !== null ? e.changedTouches[0].clientY - touchStartY.current : 0;
    touchStartY.current = null;

    outerRef.current.style.transition = '';
    outerRef.current.style.transform = '';

    if (delta > SWIPE_CLOSE_THRESHOLD) onClose();
  }, [onClose]);

  const panelClass = `slide-modal-panel--${side}`;
  const closedTransform = side === 'left' ? 'translateX(-100%)' : 'translateX(100%)';

  return (
    <>
      {/* Scoped to slide-modal-panel--{side} so the left (case study) and right (CV/Speaking)
          panels never share a class the CSS cascade could apply cross-instance. */}
      <style dangerouslySetInnerHTML={{ __html: `
        .slide-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(13, 13, 13, 0.8);
          transition: opacity 0.3s ease;
          cursor: pointer;
        }
        .slide-modal-panel--${side} {
          position: fixed;
          top: 0;
          bottom: 0;
          ${side === 'left' ? 'left: 0;' : 'right: 0;'}
          width: min(820px, 100vw);
          background: #000;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          ${side === 'left' ? 'border-right' : 'border-left'}: 1px solid rgba(255, 255, 255, 0.14);
          transform: ${isOpen ? 'translateX(0)' : closedTransform};
        }
        @media (max-width: 768px) {
          .slide-modal-panel--${side} {
            top: auto;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 92vh;
            border-left: none;
            border-right: none;
            border-top: 1px solid rgba(255,255,255,0.14);
            border-radius: 16px 16px 0 0;
            /* Clips flush content (e.g. the case study cover photo) to the
             * rounded corners — the inner wrapper still scrolls on its own. */
            overflow: hidden;
            transform: ${isOpen ? 'translateY(0)' : 'translateY(100%)'};
          }
        }
      `}} />

      <div style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        pointerEvents: isOpen ? 'auto' : 'none',
      }}>
        {/* Backdrop */}
        <div
          className="slide-modal-backdrop"
          onClick={onClose}
          style={{ opacity: isOpen ? 1 : 0 }}
        />

        {/* Outer panel — slides from the given side on desktop, up from bottom on
            mobile. Not itself scrollable, so fixed-position children (e.g. a
            close button) don't get carried away by the inner content's scroll. */}
        <div ref={outerRef} className={panelClass}>
          <div
            ref={scrollRef}
            className="slide-modal-scroll"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            {/* Bottom-sheet drag handle — signals "swipeable/dismissible" on mobile; hidden on desktop */}
            {dragHandle ? <div className="slide-modal-drag-handle" aria-hidden="true" /> : null}
            {children}
          </div>
        </div>
      </div>
    </>
  );
}
