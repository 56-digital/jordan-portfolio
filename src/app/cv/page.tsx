import Link from 'next/link';

export const metadata = {
  title: 'CV | Jordan Sowunmi',
  description: 'Career history and experience for Jordan Sowunmi.'
};

export default function CvPage() {
  return (
    <main className="min-h-screen bg-black text-white" style={{ padding: '120px 24px 80px' }}>
      <div style={{ maxWidth: 900, margin: '0 auto' }}>
        <p style={{ marginBottom: 28, letterSpacing: '0.12em', textTransform: 'uppercase', fontSize: 12 }}>
          <Link href="/" style={{ color: 'rgba(255,255,255,0.72)', textDecoration: 'none' }}>
            Back
          </Link>
        </p>

        <h1 style={{ fontSize: 'clamp(28px, 4vw, 52px)', lineHeight: 1.1, letterSpacing: '0.03em', marginBottom: 28 }}>CV</h1>

        <p style={{ maxWidth: 760, lineHeight: 1.8, letterSpacing: '0.04em', color: 'rgba(255,255,255,0.88)' }}>
          Detailed CV content goes here. Share the final copy and I can format this page into full sections (experience, selected work,
          speaking, writing, and education) using the same visual system as the portfolio.
        </p>
      </div>
    </main>
  );
}
