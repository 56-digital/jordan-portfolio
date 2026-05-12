import { PortfolioPage } from '@/components/portfolio-page';
import type { PortfolioContent } from '@/lib/portfolio-types';
import { getCvContent, getSpeakingContent } from '@/sanity/lib';
import fallbackContent from '../../content.json';

export const revalidate = 60;

export default async function Home() {
  const content: PortfolioContent = fallbackContent as PortfolioContent;
  const [cvData, speakingData] = await Promise.all([getCvContent(), getSpeakingContent()]);
  return <PortfolioPage content={content} cvData={cvData} speakingData={speakingData} />;
}
