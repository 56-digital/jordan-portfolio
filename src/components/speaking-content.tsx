interface SpeakingEntry {
  year?: string;
  role: string;
  title: string;
  venue?: string;
}

const entries: SpeakingEntry[] = [
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

const speakingStyles = `
  .sp-wrap {
    font-family: 'Authentic Sans', 'Helvetica Neue', Arial, sans-serif;
    color: #fff;
    padding: 60px 48px 120px;
    display: flex;
    flex-direction: column;
    gap: 60px;
  }
  .sp-heading { font-size: 27px; font-weight: 400; letter-spacing: 1.62px; line-height: 54px; margin: 0; }
  .sp-entry {
    display: flex;
    margin-bottom: 36px;
  }
  .sp-entry:last-child { margin-bottom: 0; }
  .sp-col { font-size: 16px; font-weight: 400; letter-spacing: 1.08px; line-height: 1.35; }
  .sp-col-year { flex: 0 0 64px; }
  .sp-col-role { flex: 1; }
  .sp-col-title { flex: 3; }
  .sp-venue { margin-top: 6px; color: rgba(255,255,255,0.45); }
  @media (max-width: 600px) {
    .sp-wrap { padding: 48px 24px 80px; }
    .sp-entry { flex-direction: column; gap: 2px; margin-bottom: 28px; }
    .sp-entry-meta { font-size: 14px; font-weight: 400; letter-spacing: 0.9px; line-height: 1.4; margin-bottom: 3px; }
    .sp-col-year, .sp-col-role, .sp-col-title { display: none; }
    .sp-mobile-meta, .sp-mobile-title, .sp-mobile-venue { display: block; font-size: 14px; letter-spacing: 0.9px; line-height: 1.4; }
    .sp-mobile-venue { color: rgba(255,255,255,0.45); margin-top: 2px; }
  }
  @media (min-width: 601px) {
    .sp-mobile-meta, .sp-mobile-title, .sp-mobile-venue { display: none; }
  }
`;

export function SpeakingContent() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: speakingStyles }} />
      <div className="sp-wrap">
        <h2 className="sp-heading">Public Speaking</h2>

        <div>
          {/* Desktop rows */}
          {entries.map((entry, i) => (
            <div key={i} className="sp-entry">
              <div className="sp-col sp-col-year" style={{ visibility: entry.year ? 'visible' : 'hidden' }}>
                {entry.year ?? '0000'}
              </div>
              <div className="sp-col sp-col-role">{entry.role}</div>
              <div className="sp-col sp-col-title">
                <div>{entry.title}</div>
                {entry.venue && <div className="sp-venue">{entry.venue}</div>}
              </div>
            </div>
          ))}

          {/* Mobile rows */}
          {entries.map((entry, i) => (
            <div key={`m-${i}`} className="sp-mobile-entry" style={{ marginBottom: 28 }}>
              <div className="sp-mobile-meta">
                {entry.year && <span>{entry.year} – </span>}
                <span>{entry.role}</span>
              </div>
              <div className="sp-mobile-title">{entry.title}</div>
              {entry.venue && <div className="sp-mobile-venue">{entry.venue}</div>}
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
