/**
 * One-shot seed for the cvPage and speakingPage singletons.
 *
 * Usage:
 *   SANITY_WRITE_TOKEN=<editor-token> npx tsx scripts/sanity/seed-cv-speaking.ts
 *
 * Re-running is safe — createOrReplace overwrites the existing documents.
 * Delete this script (or rotate the token) once seeding is done.
 */

import { createClient } from '@sanity/client';

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'fai9ybyc';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-04-20';
const token = process.env.SANITY_WRITE_TOKEN;

if (!token) {
  console.error('Missing SANITY_WRITE_TOKEN env var.');
  process.exit(1);
}

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });

const cvDoc = {
  _id: 'cvPage',
  _type: 'cvPage',
  title: 'CV',
  name: 'Jordan Sowunmi',
  bio: [
    '15+ years of experience in brand, content, influencer, digital, and cultural strategy at some of the world’s most creatively ambitious and successful companies.',
    'Extensive experience specializing in brand strategy, content and digital strategy, and scaling teams and products.'
  ],
  experience: [
    {
      _key: 'job-freelance',
      _type: 'cvJob',
      company: 'Freelance',
      role: 'VP Strategy & Brand Consultant',
      dates: 'Dec 2025 – Current',
      bullets: [
        'Built a social strategy and playbook for a creator-led nutrition and fitness brand; led creative briefings, data analytics and reporting, and strategic and creative development of the overall playbook.',
        'Led strategy at a creator marketing agency on new business pitches in telecoms, apparel and sneakers, and beauty.',
        'Specialized in brand, social, culture, creator, paid, and content strategy.'
      ]
    },
    {
      _key: 'job-msl',
      _type: 'cvJob',
      company: 'MSL',
      role: 'SVP, Strategy',
      dates: 'Nov 2024 – Dec 2025',
      bullets: [
        'Built a social strategy and playbook for a creator-led nutrition and fitness brand; led creative briefings, data analytics and reporting, and strategic and creative development of the overall playbook.',
        "Led strategy on Sonic's Unicorn Dream Slush integrated campaign, which drove a 10% increase in same-store sales, sold out throughout the country, and created a resale market that also sold out on eBay.",
        'Served as the strategic liaison with the data analytics team, translating quant, qual, and AI research into winning narratives that shaped client creative and decision-making.',
        'Scaled and coached a multi-level strategy team (Vice President/Director, Senior Strategist, and 2 Junior Strategists).',
        'Served as department lead AI prompt engineer, streamlining the research process.'
      ]
    },
    {
      _key: 'job-tbwa',
      _type: 'cvJob',
      company: 'TBWA\\CHIAT\\DAY',
      role: 'Strategy Director, FEED',
      dates: 'Nov 2022 – Nov 2024',
      bullets: [
        'Spearheaded award-winning, cross-platform creative for Doritos x Papa Johns, driving 13% year-over-year sales growth.',
        'Integrated mobile and social-first storytelling with bold experiential and celebrity-led activations featuring Travis Kelce, Kris Jenner, DJ Khaled, and others.',
        "Built and scaled TBWA's social-first studio (FEED), multiplying revenue 6x in 3 months.",
        'Oversaw hiring, resourcing, creative strategy direction, and execution.',
        "Partnered with the CTO on strategy-specific AI workflows; helped build the company's custom Strategy GPT."
      ]
    },
    {
      _key: 'job-tiktok',
      _type: 'cvJob',
      company: 'TikTok',
      role: 'Music Editorial and Content Strategy Lead',
      dates: 'Jan 2021 – Nov 2022',
      bullets: [
        "Led partnership and programming relationship with SiriusXM, which led to TikTok Radio (Channel 4), one of SiriusXM's most successful new channel launches in history, as outlined in Business Insider.",
        'Created a standalone TikTok music brand on TikTok and Instagram (@musicontiktok), growing it to 470K+ followers, securing Coca-Cola sponsorship and numerous major label partnerships, and driving off-platform cultural influence.',
        "Managed TikTok's relationship with key, revenue-driving brand partners, including SiriusXM, Social Chain, Stingray, and AEG."
      ]
    },
    {
      _key: 'job-johnst',
      _type: 'cvJob',
      company: 'John St',
      role: 'Senior Social and Digital Strategist',
      dates: 'Mar 2020 – Jan 2021',
      bullets: [
        'Built and managed a multi-disciplinary creative team spanning data, social, and content strategy.',
        'Led platform-first creative (Snap, TikTok, Facebook, Instagram) and performance strategies for Chevrolet across SUVs, trucks, and cars, integrating brand and performance KPIs.'
      ]
    },
    {
      _key: 'job-mccann',
      _type: 'cvJob',
      company: 'McCann',
      role: 'Social Media Manager',
      dates: 'Jan 2018 – Dec 2020',
      bullets: [
        'Led social and digital strategy on new business pitch win for DoorDash.',
        'Led agency recommendations for owned and paid social across major clients, including KFC, Tangerine, Dairy Farmers of Canada, and Home Hardware.'
      ]
    },
    {
      _key: 'job-wk',
      _type: 'cvJob',
      company: 'Wieden + Kennedy',
      role: 'Social Strategist',
      dates: 'Oct 2015 – Nov 2017',
      bullets: [
        'Spearheaded Corona Global owned social, helping make the brand the most-followed beer brand on Instagram in 2016 and 2017.',
        'Collaborated with strategists and creative teams to develop integrated campaigns across TV, owned, and paid social, including Corona\'s foundational "This Is Living" campaign across social and the award-winning Clean Waves partnership.',
        'Led brand social for Corona Global, determining how international Corona markets in 50+ countries used quality-controlled, globally produced assets.'
      ]
    },
    {
      _key: 'job-anomaly',
      _type: 'cvJob',
      company: 'Anomaly',
      role: 'Social Strategist',
      dates: 'Oct 2015 – Nov 2017',
      bullets: [
        'Conceptualized, tested, reported on, and executed digital content for Bud Light, Spotify, Shock Top, and MINI.',
        'Developed social content campaigns for Bud Light, including the award-winning "Bud Light Living Like a UFC Champion" campaign, which drove over 100 million earned impressions, 30:1 positive sentiment, and trended globally on Twitter.'
      ]
    },
    {
      _key: 'job-vice',
      _type: 'cvJob',
      company: 'VICE',
      role: 'Staff Writer and Content Manager',
      dates: 'Jan 2013 – Dec 2014',
      bullets: [
        'Conceptualized, tested, reported on, and executed digital content for Bud Light, Spotify, Shock Top, and MINI.',
        'Developed social content campaigns for Bud Light, including the award-winning "Bud Light Living Like a UFC Champion" campaign, which drove over 100 million earned impressions, 30:1 positive sentiment, and trended globally on Twitter.'
      ]
    }
  ],
  education: [
    {
      _key: 'edu-western',
      _type: 'cvEducation',
      school: 'Western University',
      detail: 'Double Major in English and Political Science'
    }
  ]
};

const speakingDoc = {
  _id: 'speakingPage',
  _type: 'speakingPage',
  title: 'Public Speaking',
  heading: 'Public Speaking',
  entries: [
    { _key: 'sp-1', _type: 'speakingEntry', year: '2022', role: 'Moderator', eventTitle: 'Creatives Crossing into the Podcasting Space ft. Director X and Taj Critchlow', venue: 'Hot Docs Podcast Festival' },
    { _key: 'sp-2', _type: 'speakingEntry', year: '2021', role: 'Curator', eventTitle: 'VIRTUAL TRAMPOLINE HALL #4', venue: 'Elliat Albrecht: The Evolution of TV Makeovers' },
    { _key: 'sp-3', _type: 'speakingEntry', year: '2020', role: 'Panelist', eventTitle: 'Disrupting Unconscious bias. How diversity of thought can drive success in the advertising, media and music industries', venue: 'Ogilvy Toronto' },
    { _key: 'sp-4', _type: 'speakingEntry', role: 'Curator', eventTitle: 'Trampoline Hall, ft: Alice Blackwell: Magician Story, Melissa Vincent: The Ongoing History of White Men Dragging Other White Men, Vidal Wu: Of Moose, Men and Me:', venue: 'Abercrombie and Fitch' },
    { _key: 'sp-5', _type: 'speakingEntry', role: 'Moderator', eventTitle: 'In Conversation With Kelvin Harrison Jr' },
    { _key: 'sp-6', _type: 'speakingEntry', year: '2019', role: 'Curator', eventTitle: 'Trampoline Hall, ft Chris Locke: The Psychology of Envy, Sarah Hagi: Bootleg Culture, Kyrell Grant: The Red Hot Chili Peppers' },
    { _key: 'sp-7', _type: 'speakingEntry', role: 'Panelist', eventTitle: 'Community & Audience Development: The Future of Influence and Engagement', venue: 'Canadian Music Week' },
    { _key: 'sp-8', _type: 'speakingEntry', role: 'Panelist', eventTitle: 'Branding in the Age of Social Media', venue: 'Miami Ad School Toronto' },
    { _key: 'sp-9', _type: 'speakingEntry', year: '2018', role: 'Curator', eventTitle: 'Trampoline Hall, ft Chris Locke: The Psychology of Envy, Sarah Hagi: Bootleg Culture, Kyrell Grant: The Red Hot Chili Peppers' },
    { _key: 'sp-10', _type: 'speakingEntry', role: 'Lecturer', eventTitle: 'African-American Vernacular English (AAVE)', venue: 'Trampoline Hall' },
    { _key: 'sp-11', _type: 'speakingEntry', role: 'Panelist', eventTitle: 'Community & Audience Development: The Future of Influence and Engagement', venue: 'Canadian Music Week' },
    { _key: 'sp-12', _type: 'speakingEntry', role: 'Moderator', eventTitle: 'Live with Visionelie x The Creator Class' },
    { _key: 'sp-13', _type: 'speakingEntry', role: 'Host', eventTitle: 'TIFF LIVE from the Red Carpet' },
    { _key: 'sp-14', _type: 'speakingEntry', role: 'Moderator', eventTitle: 'Art vs Artist: What is a festival\'s role in curation and programming?" ft: Erin Lowers, Kevin Ritchie, Melissa Vincent, NXNE' }
  ]
};

async function main() {
  console.log(`Seeding cvPage and speakingPage into project ${projectId} / ${dataset}…`);
  const tx = client.transaction();
  tx.createOrReplace(cvDoc);
  tx.createOrReplace(speakingDoc);
  const result = await tx.commit();
  console.log(`✓ Committed ${result.results.length} mutation(s).`);
  console.log('  Refresh the studio (or use Ctrl+R) to see the populated documents.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
