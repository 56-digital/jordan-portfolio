'use client';

import { useEffect } from 'react';

interface SlideModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export function SlideModal({ isOpen, onClose, children }: SlideModalProps) {
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

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .slide-modal-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,0.5);
          transition: opacity 0.3s ease;
          cursor: pointer;
        }
        .slide-modal-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          width: min(820px, 100vw);
          background: #000;
          overflow-y: auto;
          transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          border-left: 1px solid rgba(255,255,255,0.08);
          -webkit-overflow-scrolling: touch;
        }
        @media (max-width: 768px) {
          .slide-modal-panel {
            top: auto;
            left: 0;
            right: 0;
            bottom: 0;
            width: 100%;
            height: 92vh;
            border-left: none;
            border-top: 1px solid rgba(255,255,255,0.12);
            border-radius: 16px 16px 0 0;
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

        {/* Panel — slides from right on desktop, up from bottom on mobile */}
        <div
          className="slide-modal-panel"
          style={{
            transform: isOpen ? 'translate(0,0)' : undefined,
            // inline fallback for JS-driven state; CSS handles the responsive axis
          }}
        >
          {children}
        </div>
      </div>

      {/* Inject open/closed transform via a dynamic style tag so CSS media queries control the axis */}
      <style dangerouslySetInnerHTML={{ __html: `
        .slide-modal-panel {
          transform: ${isOpen ? 'translateX(0)' : 'translateX(100%)'};
        }
        @media (max-width: 768px) {
          .slide-modal-panel {
            transform: ${isOpen ? 'translateY(0)' : 'translateY(100%)'};
          }
        }
      `}} />
    </>
  );
}
