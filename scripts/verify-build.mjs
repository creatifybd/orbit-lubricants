import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initialData } from '../src/data/initialData.js';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const errors = [];
const check = (condition, message) => {
  if (!condition) errors.push(message);
};

const files = ['index.html', '.htaccess', 'robots.txt', 'sitemap.xml', 'seo-manifest.json', 'deployment.json', 'products/index.html', 'about/index.html', 'contact/index.html', 'finder/index.html'];
for (const name of files) {
  check(existsSync(join(dist, name)), 'Missing static build asset: ' + name);
}

if (existsSync(join(dist, '.htaccess'))) {
  const apache = readFileSync(join(dist, '.htaccess'), 'utf8');
  check(apache.includes('RewriteRule ^(?:\\.git|\\.github'), 'Apache source-access deny rules missing');
  check(apache.includes('X-Content-Type-Options'), 'Production safety headers missing');
}

if (!errors.length) {
  const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8');
  const manifest = JSON.parse(readFileSync(join(dist, 'seo-manifest.json'), 'utf8'));
  const release = JSON.parse(readFileSync(join(dist, 'deployment.json'), 'utf8'));
  check(release.productCount === initialData.products.length, 'Release identity has incorrect product count');
  check(release.catalogVersion === initialData.catalogVersion, 'Release identity has incorrect catalog version');
  check(Boolean(release.commit), 'Release identity missing commit');
  if (process.env.GITHUB_SHA) check(release.commit === process.env.GITHUB_SHA, 'Release marker commit differs from running workflow');
  const paths = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const requiredPaths = ['/', '/products/', '/about/', '/contact/', '/finder/'];

  check(manifest.products === initialData.products.length, 'SEO manifest product count differs from catalog');
  check(manifest.routes === paths.length, 'Sitemap route count differs from SEO manifest');
  check(new Set(paths).size === paths.length, 'Duplicate sitemap URLs detected');

  for (const route of requiredPaths) {
    check(paths.includes('https://orbit-lubricants.com' + route), 'Missing sitemap route: ' + route);
  }

  const productTitles = new Set();
  for (const item of initialData.products) {
    const url = 'https://orbit-lubricants.com/products/' + item.id + '/';
    const productHtmlPath = join(dist, 'products', item.id, 'index.html');
    const imagePath = join(dist, item.image.replace(/^\//, ''));

    check(paths.includes(url), 'Product missing from sitemap: ' + item.id);
    check(existsSync(productHtmlPath), 'Missing product landing page: ' + item.id);
    check(existsSync(imagePath), 'Missing original product asset: ' + item.image);

    if (existsSync(productHtmlPath)) {
      const html = readFileSync(productHtmlPath, 'utf8');
      const title = html.match(/<title>([^<]+)<\\/title>/i)?.[1] || '';
      check(Boolean(title), 'Missing page title: ' + item.id);
      check(!productTitles.has(title), 'Duplicate SEO title: ' + title);
      productTitles.add(title);
      check(html.includes('<link rel="canonical" href="' + url + '">'), 'Wrong canonical URL on ' + item.id);
      const ldJson = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
      const schemas = [];
      for (const [, value] of ldJson) {
        try { schemas.push(JSON.parse(value)); }
        catch { errors.push('Malformed JSON-LD on ' + item.id); }
      }
      check(schemas.some((x) => x['@type'] === 'Product'), 'Missing Product JSON-LD: ' + item.id);
      check(schemas.some((x) => x['@type'] === 'BreadcrumbList'), 'Missing breadcrumb JSON-LD: ' + item.id);
      check(!schemas.some((x) => x.offers || x.aggregateRating || x.review), 'Unexpected unverified product claims on ' + item.id);
    }
  }
}

if (errors.length) {
  console.error('Orbit production QA failed with ' + errors.length + ' issue(s):');
  errors.forEach((message) => console.error(' - ' + message));
  process.exitCode = 1;
} else {
  console.log('Orbit build QA passed:', initialData.products.length, 'products, sitemap, original imagery, schema and canonical routes.');
}
