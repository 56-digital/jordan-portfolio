import Link from 'next/link';

/**
 * PageNav — fixed top nav shared across CV, Speaking, and any other
 * sub-pages. Renders "← Back" on the left and the identity tagline
 * ("BRAND STRATEGY • NEW YORK • hello@jordansowunmi.com") on the right.
 *
 * Responsive strategy (server component — media queries only, no JS):
 *   ≥ 601px  all three meta items visible
 *   ≤ 600px  collapse to email only — the most actionable item on mobile
 *   ≤ 390px  reduce font-size and letter-spacing further
 */
export function PageNav() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        /* ── PageNav ────────────────────────────────────────────────── */
        .page-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          z-index: 10;
          background: #000;
          padding: 10px 12px;
        }

        .page-nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          width: 100%;
          max-width: 780px;
          margin: 0 auto;
          padding: 0 24px;
          font-size: 12px;
          letter-spacing: 0.2em;
          line-height: 1.667em;
          text-transform: uppercase;
          font-family: 'Authentic Sans', 'Helvetica Neue', Arial, sans-serif;
          font-weight: 400;
          gap: 12px;
        }

        .page-nav-back {
          color: rgba(255, 255, 255, 0.55);
          text-decoration: none;
          flex-shrink: 0;
          transition: color 0.15s ease;
          white-space: nowrap;
        }
        .page-nav-back:hover {
          color: #fff;
        }

        .page-nav-meta {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 1;
          min-width: 0;
        }

        .page-nav-sep {
          width: 5px;
          height: 5px;
          background: #fff;
          border-radius: 50%;
          flex-shrink: 0;
        }

        .page-nav-item {
          color: #fff;
          text-decoration: none;
          white-space: nowrap;
        }
        .page-nav-item:hover {
          opacity: 0.7;
        }

        /* ── ≤ 1010px: standard centred padding ────────────────────── */
        @media (max-width: 1010px) {
          .page-nav-inner {
            padding: 0 40px;
          }
        }

        /* ── ≤ 768px: tighten tracking and gaps ────────────────────── */
        @media (max-width: 768px) {
          .page-nav-inner {
            padding: 0 24px;
            letter-spacing: 0.14em;
            gap: 9px;
          }
          .page-nav-sep {
            width: 4px;
            height: 4px;
          }
        }

        /* ── ≤ 600px: hide strategy + location, keep only email ─────── */
        @media (max-width: 600px) {
          .page-nav {
            padding: 9px 8px;
          }
          .page-nav-inner {
            padding: 0 12px;
            letter-spacing: 0.12em;
            gap: 8px;
            font-size: 11px;
          }
          /* Hide "BRAND STRATEGY", "NEW YORK" and their separators */
          .page-nav-strategy,
          .page-nav-sep-1,
          .page-nav-location,
          .page-nav-sep-2 {
            display: none;
          }
        }

        /* ── ≤ 390px: smallest phones ──────────────────────────────── */
        @media (max-width: 390px) {
          .page-nav-inner {
            font-size: 10px;
            letter-spacing: 0.1em;
            gap: 6px;
            padding: 0 8px;
          }
        }
      `}} />

      <nav className="page-nav" aria-label="Page navigation">
        <div className="page-nav-inner">

          {/* Left: back link */}
          <Link href="/" className="page-nav-back">
            &larr;&nbsp;Back
          </Link>

          {/* Right: identity meta */}
          <div className="page-nav-meta">
            <span className="page-nav-item page-nav-strategy">Brand Strategy</span>
            <span className="page-nav-sep page-nav-sep-1" aria-hidden="true" />
            <span className="page-nav-item page-nav-location">New York</span>
            <span className="page-nav-sep page-nav-sep-2" aria-hidden="true" />
            <a
              href="mailto:hello@jordansowunmi.com"
              className="page-nav-item page-nav-email"
            >
              hello@jordansowunmi.com
            </a>
          </div>

        </div>
      </nav>
    </>
  );
}
