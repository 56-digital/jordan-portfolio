import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

function loadLocalEnv() {
  const envPath = path.join(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) return;

  const source = fs.readFileSync(envPath, 'utf8');
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

if (!projectId) {
  console.warn('Skipping Sanity typegen: NEXT_PUBLIC_SANITY_PROJECT_ID is not set.');
  process.exit(0);
}

try {
  execSync('sanity schema extract --path=./schema.json', { stdio: 'inherit', timeout: 30000 });
  execSync('sanity typegen generate', { stdio: 'inherit', timeout: 30000 });
  console.log('Sanity typegen complete.');
} catch (err) {
  console.warn('Sanity typegen failed or timed out — continuing without updated types.');
}
