const experience = [
  {
    company: 'Freelance',
    role: 'VP Strategy & Brand Consultant',
    dates: 'Dec 2025 – Current',
    bullets: [
      'Built a social strategy and playbook for a creator-led nutrition and fitness brand; led creative briefings, data analytics and reporting, and strategic and creative development of the overall playbook.',
      'Led strategy at a creator marketing agency on new business pitches in telecoms, apparel and sneakers, and beauty.',
      'Specialized in brand, social, culture, creator, paid, and content strategy.',
    ],
  },
  {
    company: 'MSL',
    role: 'SVP, Strategy',
    dates: 'Nov 2024 – Dec 2025',
    bullets: [
      'Built a social strategy and playbook for a creator-led nutrition and fitness brand; led creative briefings, data analytics and reporting, and strategic and creative development of the overall playbook.',
      "Led strategy on Sonic's Unicorn Dream Slush integrated campaign, which drove a 10% increase in same-store sales, sold out throughout the country, and created a resale market that also sold out on eBay.",
      'Served as the strategic liaison with the data analytics team, translating quant, qual, and AI research into winning narratives that shaped client creative and decision-making.',
      'Scaled and coached a multi-level strategy team (Vice President/Director, Senior Strategist, and 2 Junior Strategists).',
      'Served as department lead AI prompt engineer, streamlining the research process.',
    ],
  },
  {
    company: 'TBWA\\CHIAT\\DAY',
    role: 'Strategy Director, FEED',
    dates: 'Nov 2022 – Nov 2024',
    bullets: [
      'Spearheaded award-winning, cross-platform creative for Doritos x Papa Johns, driving 13% year-over-year sales growth.',
      'Integrated mobile and social-first storytelling with bold experiential and celebrity-led activations featuring Travis Kelce, Kris Jenner, DJ Khaled, and others.',
      "Built and scaled TBWA's social-first studio (FEED), multiplying revenue 6x in 3 months.",
      'Oversaw hiring, resourcing, creative strategy direction, and execution.',
      "Partnered with the CTO on strategy-specific AI workflows; helped build the company's custom Strategy GPT.",
    ],
  },
  {
    company: 'TikTok',
    role: 'Music Editorial and Content Strategy Lead',
    dates: 'Jan 2021 – Nov 2022',
    bullets: [
      "Led partnership and programming relationship with SiriusXM, which led to TikTok Radio (Channel 4), one of SiriusXM's most successful new channel launches in history, as outlined in Business Insider.",
      "Created a standalone TikTok music brand on TikTok and Instagram (@musicontiktok), growing it to 470K+ followers, securing Coca-Cola sponsorship and numerous major label partnerships, and driving off-platform cultural influence.",
      "Managed TikTok's relationship with key, revenue-driving brand partners, including SiriusXM, Social Chain, Stingray, and AEG.",
    ],
  },
  {
    company: 'John St',
    role: 'Senior Social and Digital Strategist',
    dates: 'Mar 2020 – Jan 2021',
    bullets: [
      'Built and managed a multi-disciplinary creative team spanning data, social, and content strategy.',
      'Led platform-first creative (Snap, TikTok, Facebook, Instagram) and performance strategies for Chevrolet across SUVs, trucks, and cars, integrating brand and performance KPIs.',
    ],
  },
  {
    company: 'McCann',
    role: 'Social Media Manager',
    dates: 'Jan 2018 – Dec 2020',
    bullets: [
      'Led social and digital strategy on new business pitch win for DoorDash.',
      'Led agency recommendations for owned and paid social across major clients, including KFC, Tangerine, Dairy Farmers of Canada, and Home Hardware.',
    ],
  },
  {
    company: 'Wieden + Kennedy',
    role: 'Social Strategist',
    dates: 'Oct 2015 – Nov 2017',
    bullets: [
      'Spearheaded Corona Global owned social, helping make the brand the most-followed beer brand on Instagram in 2016 and 2017.',
      'Collaborated with strategists and creative teams to develop integrated campaigns across TV, owned, and paid social, including Corona\'s foundational "This Is Living" campaign across social and the award-winning Clean Waves partnership.',
      'Led brand social for Corona Global, determining how international Corona markets in 50+ countries used quality-controlled, globally produced assets.',
    ],
  },
  {
    company: 'Anomaly',
    role: 'Social Strategist',
    dates: 'Oct 2015 – Nov 2017',
    bullets: [
      'Conceptualized, tested, reported on, and executed digital content for Bud Light, Spotify, Shock Top, and MINI.',
      'Developed social content campaigns for Bud Light, including the award-winning "Bud Light Living Like a UFC Champion" campaign, which drove over 100 million earned impressions, 30:1 positive sentiment, and trended globally on Twitter.',
    ],
  },
  {
    company: 'VICE',
    role: 'Staff Writer and Content Manager',
    dates: 'Jan 2013 – Dec 2014',
    bullets: [
      'Conceptualized, tested, reported on, and executed digital content for Bud Light, Spotify, Shock Top, and MINI.',
      'Developed social content campaigns for Bud Light, including the award-winning "Bud Light Living Like a UFC Champion" campaign, which drove over 100 million earned impressions, 30:1 positive sentiment, and trended globally on Twitter.',
    ],
  },
];

const cvStyles = `
  .cv-content-wrap {
    font-family: 'Authentic Sans', 'Helvetica Neue', Arial, sans-serif;
    color: #fff;
    padding: 60px 48px 120px;
    display: flex;
    flex-direction: column;
    gap: 80px;
  }
  .cv-c-heading { font-size: 27px; font-weight: 400; letter-spacing: 1.62px; line-height: 54px; margin: 0; }
  .cv-c-section { display: flex; flex-direction: column; gap: 42px; }
  .cv-c-section--exp { display: flex; flex-direction: column; gap: 48px; }
  .cv-c-bio { font-size: 18px; font-weight: 400; letter-spacing: 1.08px; line-height: 1.6; display: flex; flex-direction: column; gap: 18px; }
  .cv-c-bio p { margin: 0; }
  .cv-c-entry-row { display: flex; justify-content: space-between; align-items: flex-start; gap: 32px; }
  .cv-c-left { width: 220px; flex-shrink: 0; font-size: 16px; font-weight: 400; letter-spacing: 1.08px; }
  .cv-c-left p { margin: 0 0 6px; line-height: 1.25; }
  .cv-c-left p:last-child { margin-bottom: 0; }
  .cv-c-right { flex: 1; max-width: 390px; display: flex; flex-direction: column; gap: 20px; font-size: 13px; font-weight: 300; letter-spacing: 0.9px; line-height: 1.5; }
  .cv-c-right p { margin: 0; }
  .cv-c-divider { border: none; border-top: 1px solid rgba(255,255,255,0.12); margin-top: 48px; }
  .cv-c-edu { font-size: 18px; font-weight: 400; letter-spacing: 1.08px; line-height: 1.6; }
  .cv-c-edu p { margin: 0; }
  @media (max-width: 600px) {
    .cv-content-wrap { padding: 48px 24px 80px; gap: 60px; }
    .cv-c-entry-row { flex-direction: column; gap: 16px; }
    .cv-c-left { width: 100%; font-size: 15px; }
    .cv-c-right { font-size: 13px; gap: 14px; }
  }
`;

export function CvContent() {
  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: cvStyles }} />
      <div className="cv-content-wrap">

        <div className="cv-c-section">
          <h2 className="cv-c-heading">Jordan Sowunmi</h2>
          <div className="cv-c-bio">
            <p>15+ years of experience in brand, content, influencer, digital, and cultural strategy at some of the world&apos;s most creatively ambitious and successful companies.</p>
            <p>Extensive experience specializing in brand strategy, content and digital strategy, and scaling teams and products.</p>
          </div>
        </div>

        <div className="cv-c-section--exp">
          <h2 className="cv-c-heading">Experience</h2>
          {experience.map((job, i) => (
            <div key={i}>
              <div className="cv-c-entry-row">
                <div className="cv-c-left">
                  <p>{job.company}</p>
                  <p>{job.role}</p>
                  <p>{job.dates}</p>
                </div>
                <div className="cv-c-right">
                  {job.bullets.map((b, j) => <p key={j}>{b}</p>)}
                </div>
              </div>
              {i < experience.length - 1 && <hr className="cv-c-divider" />}
            </div>
          ))}
        </div>

        <div className="cv-c-section">
          <h2 className="cv-c-heading">Education</h2>
          <div className="cv-c-edu">
            <p>Western University</p>
            <p>Double Major in English and Political Science</p>
          </div>
        </div>

      </div>
    </>
  );
}
