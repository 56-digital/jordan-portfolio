import { PageNav } from '@/components/page-nav';
import { getCvContent } from '@/sanity/lib';

export const metadata = {
  title: 'CV | Jordan Sowunmi',
  description: 'Career history and experience for Jordan Sowunmi.',
};

export const revalidate = 60;

const defaultBio = [
  '15+ years of experience in brand, content, influencer, digital, and cultural strategy at some of the world’s most creatively ambitious and successful companies.',
  'Extensive experience specializing in brand strategy, content and digital strategy, and scaling teams and products.'
];

const defaultEducation = [
  { school: 'Western University', detail: 'Double Major in English and Political Science' }
];

const defaultName = 'Jordan Sowunmi';

const defaultExperience = [
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

export default async function CvPage() {
  const data = await getCvContent();
  const name = data?.name || defaultName;
  const bio = data?.bio?.length ? data.bio : defaultBio;
  const experience = data?.experience?.length ? data.experience : defaultExperience;
  const education = data?.education?.length ? data.education : defaultEducation;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        .cv-page {
          background: #000;
          color: #fff;
          min-height: 100vh;
          font-family: 'Authentic Sans', 'Helvetica Neue', Arial, sans-serif;
        }

        .cv-content {
          max-width: 780px;
          margin: 0 auto;
          padding: 180px 24px 120px;
          display: flex;
          flex-direction: column;
          gap: 160px;
        }

        .cv-section-bio,
        .cv-section-education {
          max-width: 640px;
          display: flex;
          flex-direction: column;
          gap: 42px;
        }

        .cv-heading {
          font-weight: 400;
          font-size: 27px;
          letter-spacing: 1.62px;
          line-height: 54px;
          margin: 0;
        }

        .cv-bio-text {
          font-weight: 400;
          font-size: 18px;
          letter-spacing: 1.08px;
          line-height: 1.6;
          display: flex;
          flex-direction: column;
          gap: 18px;
        }

        .cv-bio-text p { margin: 0; }

        .cv-education-text {
          font-weight: 400;
          font-size: 18px;
          letter-spacing: 1.08px;
          line-height: 1.6;
        }

        .cv-education-text p { margin: 0; }

        .cv-section-experience {
          display: flex;
          flex-direction: column;
          gap: 48px;
        }

        .cv-entry {}

        .cv-entry-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 40px;
        }

        .cv-entry-left {
          width: 340px;
          flex-shrink: 0;
          font-weight: 400;
          font-size: 18px;
          letter-spacing: 1.08px;
        }

        .cv-entry-left p { margin: 0 0 8px; line-height: 1.25; }
        .cv-entry-left p:last-child { margin-bottom: 0; }

        .cv-entry-right {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 28px;
          font-weight: 300;
          font-size: 14px;
          letter-spacing: 0.98px;
          line-height: 1.5;
        }

        .cv-entry-right p { margin: 0; }

        .cv-divider {
          border: none;
          border-top: 1px solid rgba(255, 255, 255, 0.15);
          margin-top: 48px;
        }

        /* ── Tablet / mobile (≤ 768px) ── */
        @media (max-width: 768px) {
          .cv-content {
            padding-top: 120px;
            gap: 80px;
          }

          .cv-heading {
            font-size: 24px;
            line-height: 1.3;
            letter-spacing: 1.2px;
          }

          .cv-bio-text {
            font-size: 17px;
          }

          .cv-entry-row {
            flex-direction: column;
            gap: 20px;
          }

          .cv-entry-left {
            width: 100%;
            font-size: 17px;
          }

          .cv-entry-right {
            font-size: 14px;
            gap: 20px;
          }

          .cv-divider {
            margin-top: 40px;
          }
        }

        /* ── Small phones (≤ 480px) ── */
        @media (max-width: 480px) {
          .cv-content {
            padding-top: 100px;
            padding-left: 20px;
            padding-right: 20px;
            gap: 64px;
          }

          .cv-heading {
            font-size: 22px;
            letter-spacing: 1px;
          }

          .cv-bio-text,
          .cv-entry-left {
            font-size: 16px;
          }

          .cv-entry-right {
            font-size: 13px;
            gap: 16px;
          }
        }
      `}} />

      <div className="cv-page">
        <PageNav />

        <div className="cv-content">

          {/* Bio */}
          <div className="cv-section-bio">
            <h1 className="cv-heading">{name}</h1>
            <div className="cv-bio-text">
              {bio.map((p, i) => <p key={i}>{p}</p>)}
            </div>
          </div>

          {/* Experience */}
          <div className="cv-section-experience">
            <h2 className="cv-heading">Experience</h2>
            {experience.map((job, i) => (
              <div key={i} className="cv-entry">
                <div className="cv-entry-row">
                  <div className="cv-entry-left">
                    <p>{job.company}</p>
                    <p>{job.role}</p>
                    {job.dates && <p>{job.dates}</p>}
                  </div>
                  <div className="cv-entry-right">
                    {(job.bullets ?? []).map((b, j) => <p key={j}>{b}</p>)}
                  </div>
                </div>
                {i < experience.length - 1 && <hr className="cv-divider" />}
              </div>
            ))}
          </div>

          {/* Education */}
          <div className="cv-section-education">
            <h2 className="cv-heading">Education</h2>
            <div className="cv-education-text">
              {education.map((edu, i) => (
                <div key={i}>
                  {edu.school && <p>{edu.school}</p>}
                  {edu.detail && <p>{edu.detail}</p>}
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
