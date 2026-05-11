import caseStudy from '@/sanity/schemas/documents/caseStudy';
import logoCard from '@/sanity/schemas/documents/logoCard';
import caseStudySlide from '@/sanity/schemas/objects/caseStudySlide';
import cvPage from '@/sanity/schemas/singletons/cvPage';
import portfolioPage from '@/sanity/schemas/singletons/portfolioPage';
import speakingPage from '@/sanity/schemas/singletons/speakingPage';

export const schemaTypes = [portfolioPage, cvPage, speakingPage, logoCard, caseStudy, caseStudySlide];
