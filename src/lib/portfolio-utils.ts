import { logoRegistry } from '@/data/logo-registry';
import {
  CaseStudy,
  CaseStudySlide,
  LogoCard,
  LogoDefinition,
  ParagraphToken,
  PortfolioContent
} from '@/lib/portfolio-types';

export interface ResolvedLogo {
  id: string;
  definition: LogoDefinition;
  card: Required<Pick<LogoCard, 'caption' | 'color' | 'link' | 'linkText'>>;
  isProject: boolean;
  hoverMedia: string;
}

const TOKEN_REGEX = /\{\{([^}]+)\}\}/g;

export function normalizeLinkUrl(url: string): string {
  const value = url.trim();
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) return value;
  if (/^www\./i.test(value)) return `https://${value}`;
  return `https://${value}`;
}

export function isVideoAsset(path: string): boolean {
  return /\.(mp4|webm|mov)$/i.test(path);
}

export function tokenizeParagraph(template: string): Array<string | ParagraphToken> {
  const output: Array<string | ParagraphToken> = [];
  let cursor = 0;
  let match: RegExpExecArray | null = null;

  TOKEN_REGEX.lastIndex = 0;
  while ((match = TOKEN_REGEX.exec(template)) !== null) {
    if (match.index > cursor) {
      output.push(template.slice(cursor, match.index));
    }

    output.push({ id: match[1], raw: match[0] });
    cursor = match.index + match[0].length;
  }

  if (cursor < template.length) {
    output.push(template.slice(cursor));
  }

  return output;
}

function resolveCardData(id: string, card: LogoCard | undefined, definition: LogoDefinition) {
  return {
    caption: card?.caption ?? definition.defaultCaption ?? '',
    color: card?.color ?? definition.defaultColor ?? '#1a1a1a',
    link: normalizeLinkUrl(card?.link ?? ''),
    linkText: card?.linkText ?? ''
  };
}

export function firstNonEmptyMedia(slides: CaseStudySlide[] = []): string {
  const first = slides.find((slide) => Boolean(slide.image?.trim()));
  return first?.image?.trim() ?? '';
}

export function resolveLogo(id: string, content: PortfolioContent): ResolvedLogo | null {
  const definition = logoRegistry[id];
  if (!definition) return null;

  const caseStudy = content.caseStudies[id];
  const isProject = Boolean(caseStudy);
  const hoverMedia = isProject
    ? firstNonEmptyMedia(caseStudy?.slides ?? [])
    : definition.hoverImage ?? '';

  return {
    id,
    definition,
    card: resolveCardData(id, content.logoCards[id], definition),
    isProject,
    hoverMedia
  };
}

export function getCaseStudy(content: PortfolioContent, slug: string): CaseStudy | null {
  return content.caseStudies[slug] ?? null;
}

export function getCaseStudySlugs(content: PortfolioContent): string[] {
  return Object.keys(content.caseStudies);
}

export function getCaseStudyTitle(slug: string, caseStudy?: CaseStudy | null): string {
  if (caseStudy?.title) return caseStudy.title;

  const registryItem = logoRegistry[slug];
  if (registryItem?.alt) return registryItem.alt;
  if (registryItem?.text) return registryItem.text;
  return slug;
}

export function toPublicPath(path: string): string {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  if (path.startsWith('/')) return path;
  return `/${path}`;
}

export function seededRandom(seed: number): number {
  const value = Math.sin(seed * 9301 + 49297) * 49297;
  return value - Math.floor(value);
}
