import fs from 'node:fs';
import path from 'node:path';

import { textToBlocks } from './lib/text-to-portable-text';

const contentPath = path.join(process.cwd(), 'content.json');
const content = JSON.parse(fs.readFileSync(contentPath, 'utf8'));

let converted = 0;

for (const caseStudy of Object.values(content.caseStudies ?? {}) as Array<{ slides?: Array<Record<string, unknown>> }>) {
  for (const slide of caseStudy.slides ?? []) {
    const text = typeof slide.text === 'string' ? slide.text : '';
    if (text.trim()) {
      slide.richText = textToBlocks(text);
      converted += 1;
    }
    delete slide.text;
  }
}

fs.writeFileSync(contentPath, `${JSON.stringify(content, null, 2)}\n`);
console.log(`Converted ${converted} slide(s) in content.json.`);
