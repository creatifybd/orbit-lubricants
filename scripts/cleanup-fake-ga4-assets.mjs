import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync, statSync, unlinkSync } from 'node:fs';
import { join } from 'node:path';

/**
 * Safely remove ONLY untracked, temporary Vite JS files generated while
 * testing with the fake G-TEST123456 stream ID in a disposable CI checkout.
 * Never remove tracked code, original pack artwork, CSS or user data.
 */
const project = JSON.parse(readFileSync('package.json', 'utf8'));
if (project.name !== 'orbit-lubricants') throw new Error('Refusing cleanup outside Orbit repository');
const assetFolder = join(process.cwd(), 'assets');
let removed = 0;
for (const entry of readdirSync(assetFolder, { withFileTypes: true })) {
  if (!entry.isFile() || !/^index\.source-[A-Za-z0-9_-]+\.js$/.test(entry.name)) continue;
  const filePath = join(assetFolder, entry.name);
  if (!statSync(filePath).isFile()) continue;
  if (!readFileSync(filePath, 'utf8').includes('G-TEST123456')) continue;
  try {
    execFileSync('git', ['ls-files', '--error-unmatch', 'assets/' + entry.name], { stdio: 'ignore' });
    throw new Error('A committed asset contains fake GA4 ID; stop for review: ' + entry.name);
  } catch (error) {
    if (error.message?.startsWith('A committed asset')) throw error;
    // Git returned nonzero: only the untracked test file is eligible.
  }
  unlinkSync(filePath);
  removed += 1;
  console.log('Removed ephemeral FAKE-GA4 test-only Vite JS:', entry.name);
}
for (const entry of readdirSync(assetFolder, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith('.js')
    && readFileSync(join(assetFolder, entry.name), 'utf8').includes('G-TEST123456')) {
    throw new Error('Refusing release: fake Measurement ID remains in assets/' + entry.name);
  }
}
console.log('Fake-ID cleanup passed; untracked test bundles removed:', removed);
