import { existsSync, readFileSync, writeFileSync } from 'node:fs';

const names = ['home-mobile', 'home-desktop', 'products-mobile'];
const reports = [];
for (const name of names) {
  const path = 'qa-lighthouse/' + name + '.json';
  if (!existsSync(path)) {
    console.error('Lighthouse report missing:', path);
    process.exitCode = 1;
    continue;
  }
  const data = JSON.parse(readFileSync(path, 'utf8'));
  const score = (key) => Math.round((data.categories?.[key]?.score ?? 0) * 100);
  const value = (key) => data.audits?.[key]?.numericValue ?? null;
  const findings = Object.values(data.audits || {})
    .filter((item) => item.details?.type === 'opportunity' && Number(item.numericValue) > 0)
    .sort((a, b) => (b.numericValue || 0) - (a.numericValue || 0))
    .slice(0, 5)
    .map((item) => ({
      id: item.id,
      title: item.title,
      approximateSavingsMs: Math.round(item.numericValue || 0),
    }));
  reports.push({
    name,
    url: data.finalDisplayedUrl || data.finalUrl,
    scores: {
      performance: score('performance'),
      accessibility: score('accessibility'),
      bestPractices: score('best-practices'),
      seo: score('seo')
    },
    labMetrics: {
      lcpMs: value('largest-contentful-paint'),
      fcpMs: value('first-contentful-paint'),
      tbtMs: value('total-blocking-time'),
      cls: value('cumulative-layout-shift'),
      speedIndexMs: value('speed-index')
    },
    findings,
    note: 'Lighthouse lab scores are a one-time diagnostic, not field Core Web Vitals or search ranking.'
  });
}
writeFileSync('qa-lighthouse/summary.json', JSON.stringify(reports, null, 2) + '\n');
console.log(JSON.stringify(reports, null, 2));
