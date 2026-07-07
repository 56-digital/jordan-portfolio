'use client';

import { CaseStudyBody } from '@/components/case-study-body';
import { SlideModal } from '@/components/slide-modal';
import { PortfolioContent } from '@/lib/portfolio-types';

interface CaseStudyModalProps {
  slug: string | null;
  content: PortfolioContent;
  onClose: () => void;
}

export function CaseStudyModal({ slug, content, onClose }: CaseStudyModalProps) {
  const caseStudy = slug ? content.caseStudies[slug] : null;
  const isOpen = Boolean(slug && caseStudy);

  return (
    <SlideModal isOpen={isOpen} onClose={onClose} side="left" dragHandle swipeToClose>
      <div className="cs-panel">
        {slug && caseStudy ? <CaseStudyBody slug={slug} caseStudy={caseStudy} /> : null}
      </div>
    </SlideModal>
  );
}
