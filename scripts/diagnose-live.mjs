// Read-only release fingerprint diagnostic. No Hostinger credentials and no mutations.
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const localHtml = readFileSync(fileURLToPath(new URL('../dist/index.html', import.meta.url)), 'utf8');
const entry = (html) => html.match(/<script[^>]+src="([^"]+\.js)"/i)?.[1] || null;
const expectedAsset = entry(localHtml);

if (!expectedAsset) {
  console.error('Local Vite build has no production entrypoint.');
  process.exitCode = 1;
} else {
  console.log('Staging production bundle:', expectedAsset);
  try {
    const response = await fetch('https://orbit-lubricants.com/?orbit-release-check=1', {
      headers: { 'Cache-Control': 'no-cache', 'User-Agent': 'Orbit-Release-Diagnostic/1.0' },
      signal: AbortSignal.timeout(12000),
      redirect: 'follow'
    });
    const html = await response.text();
    const liveAsset = entry(html);
    console.log('Production HTTP:', response.status, 'Final URL:', response.url);
    console.log('Live public bundle:', liveAsset || 'not found');
    console.log('Current staging bundle on production:', liveAsset === expectedAsset ? 'YES' : 'NO');
    const markerResponse = await fetch('https://orbit-lubricants.com/deployment.json?orbit-release-check=1', {
      headers: { 'Cache-Control': 'no-cache', 'User-Agent': 'Orbit-Release-Diagnostic/1.0' },
      signal: AbortSignal.timeout(12000)
    });
    const markerText = await markerResponse.text();
    try {
      const marker = JSON.parse(markerText);
      console.log('Live deployment marker:', {
        commit: marker.commit || 'missing',
        productCount: marker.productCount ?? 'missing',
        catalogVersion: marker.catalogVersion ?? 'missing'
      });
    } catch {
      console.log('Deployment marker: unavailable or not JSON (HTTP', markerResponse.status + ')');
    }
  } catch (error) {
    console.log('Live domain diagnostic unavailable:', error.message);
  }
}
// This diagnostic intentionally does not pass/fail CI based on public site state.
// The real production release gate remains the exact live commit verification.
