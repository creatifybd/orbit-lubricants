// Read-only, metadata-only public source exposure audit.
// Does not request file bodies, credentials or private server paths.
const origin = 'https://orbit-lubricants.com';
const checks = [
  '/.git/HEAD',
  '/.github/workflows/deploy.yml',
  '/package.json',
  '/src/App.jsx',
  '/Selected%20Designs.zip'
];

for (const path of checks) {
  try {
    const response = await fetch(origin + path + '?orbit-security-audit=1', {
      method: 'HEAD',
      headers: { 'Cache-Control': 'no-cache' },
      signal: AbortSignal.timeout(12000),
      redirect: 'manual'
    });
    const status = response.status;
    const mime = response.headers.get('content-type') || '(unknown)';
    const classification = status === 403 || status === 404
      ? 'not directly available'
      : status === 200 || status === 206
        ? 'POTENTIALLY EXPOSED — review immediately'
        : 'inconclusive; inspect redirects/rules';
    console.log(`${path}: HTTP ${status} | ${mime} | ${classification}`);
    if (status === 200 || status === 206) {
      console.log('::warning::A source/archive URL may be publicly readable (' + path + '). This was a HEAD check only; review actual access controls.');
    }
  } catch (error) {
    console.log(`${path}: HEAD inspection unavailable (${error.message})`);
  }
}
console.log('Exposure audit completed. No server files were read or changed.');
