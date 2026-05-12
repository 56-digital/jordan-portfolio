import { PageNav } from '@/components/page-nav';
import { getSpeakingContent } from '@/sanity/lib';

export const metadata = {
  title: 'Public Speaking | Jordan Sowunmi',
  description: 'Public speaking engagements for Jordan Sowunmi.',
};

export const revalidate = 60;

interface SpeakingEntry {
  year?: string;
  role: string;
  title: string;
  venue?: string;
}

const defaultEntries: SpeakingEntry[] = [
  { year: '2022', role: 'Moderator', title: 'Creatives Crossing into the Podcasting Space ft. Director X and Taj Critchlow', venue: 'Hot Docs Podcast Festival' },
  { year: '2021', role: 'Curator', title: 'VIRTUAL TRAMPOLINE HALL #4', venue: 'Elliat Albrecht: The Evolution of TV Makeovers' },
  { year: '2020', role: 'Panelist', title: 'Disrupting Unconscious bias. How diversity of thought can drive success in the advertising, media and music industries', venue: 'Ogilvy Toronto' },
  { role: 'Curator', title: 'Trampoline Hall, ft: Alice Blackwell: Magician Story, Melissa Vincent: The Ongoing History of White Men Dragging Other White Men, Vidal Wu: Of Moose, Men and Me:', venue: 'Abercrombie and Fitch' },
  { role: 'Moderator', title: 'In Conversation With Kelvin Harrison Jr' },
  { year: '2019', role: 'Curator', title: 'Trampoline Hall, ft Chris Locke: The Psychology of Envy, Sarah Hagi: Bootleg Culture, Kyrell Grant: The Red Hot Chili Peppers' },
  { role: 'Panelist', title: 'Community & Audience Development: The Future of Influence and Engagement', venue: 'Canadian Music Week' },
  { role: 'Panelist', title: 'Branding in the Age of Social Media', venue: 'Miami Ad School Toronto' },
  { year: '2018', role: 'Curator', title: 'Trampoline Hall, ft Chris Locke: The Psychology of Envy, Sarah Hagi: Bootleg Culture, Kyrell Grant: The Red Hot Chili Peppers' },
  { role: 'Lecturer', title: 'African-American Vernacular English (AAVE)', venue: 'Trampoline Hall' },
  { role: 'Panelist', title: 'Community & Audience Development: The Future of Influence and Engagement', venue: 'Canadian Music Week' },
  { role: 'Moderator', title: 'Live with Visionelie x The Creator Class' },
  { role: 'Host', title: 'TIFF LIVE from the Red Carpet' },
  { role: 'Moderator', title: 'Art vs Artist: What is a festival\'s role in curation and programming?" ft: Erin Lowers, Kevin Ritchie, Melissa Vincent, NXNE' },
];

export default async function SpeakingPage() {
  const data = await getSpeakingContent();
  const heading = data?.heading || 'Public Speaking';
  const entries: SpeakingEntry[] = data?.entries?.length ? data.entries : defaultEntries;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .speaking-page {
          background: #000;
          color: #fff;
          min-height: 100vh;
          font-family: 'Authentic Sans', 'Helvetica Neue', Arial, sans-serif;
        }

        .speaking-content {
          max-width: 780px;
          margin: 0 auto;
          padding: 180px 24px 120px;
        }

        .speaking-heading {
          font-size: 27px;
          font-weight: 400;
          letter-spacing: 1.62px;
          line-height: 54px;
          margin: 0 0 160px;
        }

        /* ── Desktop: 3-column row ── */
        .speaking-entry {
          display: flex;
          margin-bottom: 48px;
        }

        .speaking-entry:last-child { margin-bottom: 0; }

        .speaking-col {
          font-size: 18px;
          font-weight: 400;
          letter-spacing: 1.08px;
          line-height: 1.25;
        }

        .speaking-col-year { flex: 0 0 80px; }
        .speaking-col-role { flex: 1; }
        .speaking-col-title { flex: 3; }

        .speaking-venue {
          margin-top: 8px;
          font-size: 18px;
          font-weight: 400;
          letter-spacing: 1.08px;
          line-height: 1.25;
          color: rgba(255, 255, 255, 0.5);
        }

        /* Mobile-only elements hidden on desktop */
        .speaking-entry-mobile { display: none; }

        /* ── Tablet / mobile (≤ 768px) ── */
        @media (max-width: 768px) {
          .speaking-content {
            padding-top: 120px;
            padding-bottom: 80px;
          }

          .speaking-heading {
            font-size: 24px;
            line-height: 1.3;
            letter-spacing: 1.2px;
            margin-bottom: 80px;
          }

          /* Hide desktop row, show stacked mobile layout */
          .speaking-entry-desktop { display: none; }
          .speaking-entry-mobile {
            display: block;
            margin-bottom: 36px;
          }
          .speaking-entry-mobile:last-child { margin-bottom: 0; }

          .speaking-mobile-meta {
            font-size: 16px;
            font-weight: 400;
            letter-spacing: 0.96px;
            line-height: 1.4;
            margin-bottom: 4px;
          }

          .speaking-mobile-title {
            font-size: 16px;
            font-weight: 400;
            letter-spacing: 0.96px;
            line-height: 1.4;
          }

          .speaking-mobile-venue {
            font-size: 16px;
            font-weight: 400;
            letter-spacing: 0.96px;
            line-height: 1.4;
            color: rgba(255, 255, 255, 0.5);
            margin-top: 2px;
          }
        }

        /* ── Small phones (≤ 480px) ── */
        @media (max-width: 480px) {
          .speaking-content {
            padding-left: 16px;
            padding-right: 16px;
          }

          .speaking-heading { margin-bottom: 64px; }

          .speaking-entry-mobile { margin-bottom: 32px; }

          .speaking-mobile-meta,
          .speaking-mobile-title,
          .speaking-mobile-venue {
            font-size: 15px;
            letter-spacing: 0.8px;
          }
        }
      `}} />

      <div className="speaking-page">
        <PageNav />

        <div className="speaking-content">
          <h1 className="speaking-heading">{heading}</h1>

          {/* Desktop layout */}
          <div>
            {entries.map((entry, i) => (
              <div key={i} className="speaking-entry speaking-entry-desktop">
                <div className="speaking-col speaking-col-year" style={{ visibility: entry.year ? 'visible' : 'hidden' }}>
                  {entry.year ?? '0000'}
                </div>
                <div className="speaking-col speaking-col-role">{entry.role}</div>
                <div className="speaking-col speaking-col-title">
                  <div>{entry.title}</div>
                  {entry.venue && <div className="speaking-venue">{entry.venue}</div>}
                </div>
              </div>
            ))}
          </div>

          {/* Mobile layout */}
          <div>
            {entries.map((entry, i) => (
              <div key={i} className="speaking-entry-mobile">
                <div className="speaking-mobile-meta">
                  {entry.year && <span>{entry.year} – </span>}
                  <span>{entry.role}</span>
                </div>
                <div className="speaking-mobile-title">{entry.title}</div>
                {entry.venue && <div className="speaking-mobile-venue">{entry.venue}</div>}
              </div>
            ))}
          </div>

        </div>
      </div>
    </>
  );
}
