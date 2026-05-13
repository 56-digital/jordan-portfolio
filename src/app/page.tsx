import { PortfolioPage } from '@/components/portfolio-page';
import { getCvContent, getPortfolioContent, getSpeakingContent } from '@/sanity/lib';

export const revalidate = 60;

export default async function Home() {
  const [content, cvData, speakingData] = await Promise.all([
    getPortfolioContent(),
    getCvContent(),
    getSpeakingContent()
  ]);
  return <PortfolioPage content={content} cvData={cvData} speakingData={speakingData} />;
}
