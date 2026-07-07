'use client';

import { useEffect } from 'react';

interface SlideModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  side?: 'left' | 'right';
}

export function SlideModal({ isOpen, onClose, children, side = 'right' }: SlideModalProps) {
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
          background: rgba(0,0,0,0.5);
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
          overflow-y: auto;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          ${side === 'left' ? 'border-right: 1px solid rgba(255,255,255,0.08);' : 'border-left: 1px solid rgba(255,255,255,0.08);'}
          -webkit-overflow-scrolling: touch;
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
            border-top: 1px solid rgba(255,255,255,0.12);
            border-radius: 16px 16px 0 0;
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

        {/* Panel — slides from the given side on desktop, up from bottom on mobile */}
        <div className={panelClass}>
          {children}
        </div>
      </div>
    </>
  );
}
