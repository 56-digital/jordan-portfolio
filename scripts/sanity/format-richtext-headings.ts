import syncFs from 'node:fs';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

import { createClient } from '@sanity/client';

function loadLocalEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!syncFs.existsSync(envPath)) return;

  const source = syncFs.readFileSync(envPath, 'utf8');
  for (const line of source.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const equalIndex = trimmed.indexOf('=');
    if (equalIndex <= 0) continue;
    const key = trimmed.slice(0, equalIndex).trim();
    const rawValue = trimmed.slice(equalIndex + 1).trim();
    const normalized = rawValue.replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
    if (!process.env[key]) process.env[key] = normalized;
  }
}

loadLocalEnv();

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const token = process.env.SANITY_API_WRITE_TOKEN;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2026-04-20';

if (!projectId) throw new Error('Missing NEXT_PUBLIC_SANITY_PROJECT_ID');
if (!token) throw new Error('Missing SANITY_API_WRITE_TOKEN');

const client = createClient({ projectId, dataset, apiVersion, token, useCdn: false });
const COMMIT = process.argv.includes('--commit');

function makeKey(): string {
  return randomUUID().replace(/-/g, '').slice(0, 12);
}

interface Span { _type: 'span'; _key: string; text: string; marks: string[] }
interface Block {
  _type: 'block';
  _key: string;
  style: string;
  listItem?: string;
  level?: number;
  markDefs: unknown[];
  children: Span[];
}

function blockText(block: Block): string {
  return (block.children ?? []).map((c) => c.text ?? '').join('');
}

function span(text: string, marks: string[] = []): Span {
  return { _type: 'span', _key: makeKey(), text, marks };
}

function headingBlock(text: string): Block {
  return { _type: 'block', _key: makeKey(), style: 'h3', markDefs: [], children: [span(text)] };
}

// Targeted, hand-verified fixes — only these two blocks (across the whole
// dataset) are prose paragraphs with an embedded/standalone section label
// that should be a real heading instead of plain text. Everything else was
// checked and is genuinely narrative copy, not a header.
const FIXES: Record<string, (blocks: Block[]) => Block[]> = {
  'caseStudy.papajohns': (blocks) => blocks.flatMap((block) => {
    const text = blockText(block);
    if (text.startsWith('AWARDS: ')) {
      const rest = text.slice('AWARDS: '.length);
      return [headingBlock('Awards'), { ...block, _key: makeKey(), children: [span(rest)] }];
    }
    return [block];
  }),
  'caseStudy.tiktok-music': (blocks) => blocks.map((block) => {
    if (blockText(block) === 'Results' && block.style === 'normal') {
      return { ...block, style: 'h3' };
    }
    return block;
  })
};

interface SlideDoc { _key: string; richText?: Block[] }
interface CaseStudyDoc { _id: string; slides?: SlideDoc[] }

async function main() {
  for (const docId of Object.keys(FIXES)) {
    const doc = await client.fetch<CaseStudyDoc>(`*[_id == $id][0]{ _id, slides }`, { id: docId });
    if (!doc) {
      console.log(`Skipping ${docId} — not found`);
      continue;
    }

    const patch = client.patch(docId);
    let touched = false;

    for (const slide of doc.slides ?? []) {
      const before = slide.richText ?? [];
      const after = FIXES[docId](before);
      if (JSON.stringify(before) === JSON.stringify(after)) continue;

      console.log(`${docId} / ${slide._key}:`);
      console.log(`  before: ${before.map(blockText).join(' | ')}`);
      console.log(`  after:  ${after.map((b) => `[${b.style}${b.listItem ? '/' + b.listItem : ''}] ${blockText(b)}`).join(' | ')}`);

      touched = true;
      if (COMMIT) patch.set({ [`slides[_key=="${slide._key}"].richText`]: after });
    }

    if (touched && COMMIT) {
      await patch.commit();
      console.log(`  committed ${docId}`);
    }
  }

  if (!COMMIT) console.log('\nDry run only — rerun with --commit to write changes.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
