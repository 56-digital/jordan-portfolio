import syncFs from 'node:fs';
import path from 'node:path';

import { createClient } from '@sanity/client';

import { textToBlocks } from './lib/text-to-portable-text';

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

    if (!process.env[key]) {
      process.env[key] = normalized;
    }
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
const UNSET_LEGACY = process.argv.includes('--unset-legacy');

interface SlideDoc {
  _key: string;
  text?: string;
  richText?: unknown[];
}

interface CaseStudyDoc {
  _id: string;
  title?: string;
  slides?: SlideDoc[];
}

async function main() {
  const docs = await client.fetch<CaseStudyDoc[]>(
    `*[_type == "caseStudy"]{ _id, title, slides }`
  );

  let slidesConverted = 0;
  let slidesSkipped = 0;

  for (const doc of docs) {
    const slides = doc.slides ?? [];
    const patch = client.patch(doc._id);
    // .unset(paths) replaces rather than accumulates across repeated calls
    // on the same patch — collect every path for this doc and call it once.
    const unsetPaths: string[] = [];
    let touchedDoc = false;

    for (const slide of slides) {
      const hasRichText = Array.isArray(slide.richText) && slide.richText.length > 0;
      const hasText = typeof slide.text === 'string' && slide.text.trim().length > 0;

      if (hasRichText) {
        slidesSkipped += 1;
        if (UNSET_LEGACY && hasText) {
          console.log(`[unset-legacy] ${doc._id} / ${slide._key}: already has richText, dropping legacy text`);
          unsetPaths.push(`slides[_key=="${slide._key}"].text`);
          touchedDoc = true;
        }
        continue;
      }

      if (!hasText) {
        slidesSkipped += 1;
        continue;
      }

      const blocks = textToBlocks(slide.text!);
      console.log(`[convert] ${doc._id} (${doc.title}) / ${slide._key}: "${slide.text!.slice(0, 60).replace(/\n/g, ' ')}..." -> ${blocks.length} block(s)`);
      slidesConverted += 1;
      touchedDoc = true;

      if (COMMIT) {
        patch.set({ [`slides[_key=="${slide._key}"].richText`]: blocks });
        if (UNSET_LEGACY) unsetPaths.push(`slides[_key=="${slide._key}"].text`);
      }
    }

    if (unsetPaths.length) patch.unset(unsetPaths);

    if (touchedDoc && COMMIT) {
      await patch.commit();
      console.log(`  committed ${doc._id}`);
    }
  }

  console.log(`\n${slidesConverted} slide(s) converted, ${slidesSkipped} skipped.`);
  if (!COMMIT) {
    console.log('Dry run only — rerun with --commit to write changes.');
  } else if (!UNSET_LEGACY) {
    console.log('Legacy "text" field left in place. Rerun with --commit --unset-legacy once you\'ve verified richText renders correctly.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
