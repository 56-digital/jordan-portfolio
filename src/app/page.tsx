import { PortfolioPage } from '@/components/portfolio-page';
import type { PortfolioContent } from '@/lib/portfolio-types';
import fallbackContent from '../../content.json';

export const revalidate = 3600;

export default function Home() {
  const content: PortfolioContent = fallbackContent as PortfolioContent;
  return <PortfolioPage content={content} />;
}
