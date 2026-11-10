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
  check(manifest.applications === initialData.categories.length, 'SEO manifest application category count differs from source');
  check(paths.length === 5 + initialData.categories.length + initialData.products.length, 'Expected all product and application URLs in sitemap');
  check(manifest.routes === paths.length, 'Sitemap route count differs from SEO manifest');
  check(sitemap.includes('xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"'), 'Google image sitemap namespace is missing');
  const imageLocations = [...sitemap.matchAll(new RegExp('<image:loc>([^<]+)</image:loc>', 'g'))].map((match) => match[1]);
  check(imageLocations.length === initialData.products.length * 2, 'Image sitemap is missing product/catalog original images');
  check(manifest.imageReferences === imageLocations.length, 'SEO manifest image total is incorrect');
  for (const category of initialData.categories) {
    const categoryUrl = 'https://orbit-lubricants.com/applications/' + category.id + '/';
    const categoryPath = join(dist, 'applications', category.id, 'index.html');
    check(paths.includes(categoryUrl), 'Application category not in sitemap: ' + category.id);
    check(existsSync(categoryPath), 'Application category page missing: ' + category.id);
    if (existsSync(categoryPath)) {
      const page = readFileSync(categoryPath, 'utf8');
      check(page.includes('href="' + categoryUrl + '"'), 'Application has wrong canonical: ' + category.id);
      check(page.includes('"@type":"CollectionPage"'), 'Application page missing CollectionPage JSON-LD: ' + category.id);
      const members = initialData.products.filter((item) => item.category === category.id);
      for (const member of members) {
        check(page.includes('/products/' + member.id + '/'), 'Category lacks a product link: ' + member.id);
      }
    }
  }
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
    const expectedImageUrl = 'https://orbit-lubricants.com' + item.image;
    check(imageLocations.filter((itemUrl) => itemUrl === expectedImageUrl).length === 2,
      'Missing or duplicate product image references: ' + item.id);
    check(existsSync(productHtmlPath), 'Missing product landing page: ' + item.id);
    check(existsSync(imagePath), 'Missing original product asset: ' + item.image);

    if (existsSync(productHtmlPath)) {
      const html = readFileSync(productHtmlPath, 'utf8');
      const title = html.match(new RegExp('<title>([^<]+)</title>', 'i'))?.[1] || '';
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
      check(schemas.some((x) => x['@type'] === 'Product' && x.image?.includes(expectedImageUrl)),
        'Missing correct product image JSON-LD: ' + item.id);
      check(schemas.some((x) => x['@type'] === 'WebPage' && x.primaryImageOfPage?.contentUrl === expectedImageUrl),
        'Missing preferred product image WebPage JSON-LD: ' + item.id);
      check(schemas.some((x) => x['@type'] === 'BreadcrumbList'), 'Missing breadcrumb JSON-LD: ' + item.id);
      check(html.includes('content="' + expectedImageUrl + '"'), 'Missing OG image in product landing page: ' + item.id);
      check(html.includes('original Orbit lubricant product pack'), 'Missing descriptive image alternative text: ' + item.id);
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
