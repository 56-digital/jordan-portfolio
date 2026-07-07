import { randomUUID } from 'node:crypto';

function makeKey(): string {
  return randomUUID().replace(/-/g, '').slice(0, 12);
}

export interface Span {
  _type: 'span';
  _key: string;
  text: string;
  marks: string[];
}

export interface Block {
  _type: 'block';
  _key: string;
  style: 'normal';
  listItem?: 'bullet';
  level?: number;
  markDefs: [];
  children: Span[];
}

// Mirrors the inline-mark precedence of the old richTextToHtml() renderer:
// **bold** is resolved first, then *italic* within whatever's left over.
export function parseInline(text: string): Span[] {
  const spans: Span[] = [];

  const pushPlainOrItalic = (segment: string) => {
    const italicRe = /\*(.+?)\*/g;
    let lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = italicRe.exec(segment)) !== null) {
      if (match.index > lastIndex) {
        spans.push({ _type: 'span', _key: makeKey(), text: segment.slice(lastIndex, match.index), marks: [] });
      }
      spans.push({ _type: 'span', _key: makeKey(), text: match[1], marks: ['em'] });
      lastIndex = italicRe.lastIndex;
    }
    if (lastIndex < segment.length) {
      spans.push({ _type: 'span', _key: makeKey(), text: segment.slice(lastIndex), marks: [] });
    }
  };

  const boldRe = /\*\*(.+?)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = boldRe.exec(text)) !== null) {
    if (match.index > lastIndex) pushPlainOrItalic(text.slice(lastIndex, match.index));
    spans.push({ _type: 'span', _key: makeKey(), text: match[1], marks: ['strong'] });
    lastIndex = boldRe.lastIndex;
  }
  if (lastIndex < text.length) pushPlainOrItalic(text.slice(lastIndex));

  return spans.length ? spans : [{ _type: 'span', _key: makeKey(), text: '', marks: [] }];
}

export function textToBlocks(text: string): Block[] {
  if (!text.trim()) return [];

  return text.trim().split(/\n{2,}/).flatMap((chunk): Block[] => {
    const lines = chunk.trim().split('\n');
    const isList = lines.length > 0 && lines.every((line) => /^[-•]\s/.test(line.trim()));

    if (isList) {
      return lines.map((line) => ({
        _type: 'block' as const,
        _key: makeKey(),
        style: 'normal' as const,
        listItem: 'bullet' as const,
        level: 1,
        markDefs: [],
        children: parseInline(line.trim().replace(/^[-•]\s+/, ''))
      }));
    }

    // A single-newline within a non-list paragraph (soft break) collapses to
    // a space — the old HTML renderer used <br>, but Portable Text blocks
    // don't have a bare line-break node, and a space reads fine here.
    return [{
      _type: 'block' as const,
      _key: makeKey(),
      style: 'normal' as const,
      markDefs: [],
      children: parseInline(chunk.trim().replace(/\n/g, ' '))
    }];
  });
}
