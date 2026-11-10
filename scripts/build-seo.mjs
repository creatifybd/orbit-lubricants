import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { initialData } from '../src/data/initialData.js';
import { buildCategoryPages } from './build-category-pages.mjs';

const dist = fileURLToPath(new URL('../dist/', import.meta.url));
const origin = 'https://orbit-lubricants.com';
const brand = 'Orbit Lubricants';
const catalog = initialData.products;
const categoryNames = new Map(initialData.categories.map((c) => [c.id, c.name]));
const esc = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
})[ch]);
const productUrl = (p) => `${origin}/products/${p.id}/`;
const imageUrl = (p) => new URL(p.image.startsWith('/') ? p.image.slice(1) : p.image, origin + '/').href;
const jsonLd = (data) => JSON.stringify(data).replace(/</g, '\\u003c');
const unique = new Set();
const uniqueTitles = new Set();

if (catalog.length === 0) throw new Error('Refusing to publish an empty Orbit catalog');

// Publish a fingerprinted same-origin client for independently rendered SEO pages.
// GA4 is disabled when the owner has not configured a valid Web Measurement ID.
const configuredGa4Id = process.env.VITE_GA4_MEASUREMENT_ID || '';
const ga4Id = /^G-[A-Z0-9]{6,18}$/.test(configuredGa4Id) ? configuredGa4Id : '';
const staticTemplate = readFileSync(fileURLToPath(new URL('./static-analytics-client.template.js', import.meta.url)), 'utf8');
if (!staticTemplate.includes("'__ORBIT_MEASUREMENT_ID__'")) {
  throw new Error('Static analytics client is missing its measurement placeholder');
}
const staticAnalyticsClient = staticTemplate.replace("'__ORBIT_MEASUREMENT_ID__'", JSON.stringify(ga4Id));
const staticAnalyticsHash = createHash('sha256').update(staticAnalyticsClient).digest('hex').slice(0, 14);
const staticAnalyticsFile = 'orbit-static-analytics-' + staticAnalyticsHash + '.js';
const staticAnalyticsSrc = '/assets/' + staticAnalyticsFile;
mkdirSync(join(dist, 'assets'), { recursive: true });
writeFileSync(join(dist, 'assets', staticAnalyticsFile), staticAnalyticsClient);


function renderProductPage(p) {
  if (!/^[a-z0-9-]+$/.test(p.id) || unique.has(p.id)) {
    throw new Error('Invalid or duplicate product slug: ' + p.id);
  }
  unique.add(p.id);
  const description = p.description || `Explore ${p.name} from Orbit Lubricants.`;
  const category = categoryNames.get(p.category) || p.category || 'Lubricants';
  const categoryUrl = origin + '/applications/' + p.category + '/';
  const descriptiveAlt = `${p.name} ${p.packing} original Orbit lubricant product pack`;
  // Pack size is a meaningful distinction between otherwise identical variants.
  // This avoids duplicate titles and descriptions without inventing product claims.
  const title = `${p.name} — ${p.packing} | Orbit Lubricants`;
  if (uniqueTitles.has(title)) throw new Error('Duplicate product SEO title: ' + title);
  uniqueTitles.add(title);
  const seoDescription = `${description} Pack format: ${p.packing}. View product-label information and details.`;
  const specifications = Object.entries(p.specs || {}).filter(([, value]) => value !== undefined && value !== null && String(value).trim());
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${p.name} — ${p.packing}`,
    sku: p.id,
    size: p.packing,
    description: seoDescription,
    image: [imageUrl(p)],
    url: productUrl(p),
    brand: { '@type': 'Brand', name: brand },
    category,
    additionalProperty: specifications
      .filter(([key]) => key.toLowerCase() !== 'selection guidance')
      .map(([name, value]) => ({ '@type': 'PropertyValue', name, value: String(value) })),
  };
  const landingPage = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    '@id': productUrl(p) + '#webpage',
    name: title,
    url: productUrl(p),
    primaryImageOfPage: {
      '@type': 'ImageObject',
      contentUrl: imageUrl(p),
      name: descriptiveAlt
    },
    mainEntity: { '@type': 'Product', name: p.name, url: productUrl(p) }
  };
  const breadcrumbs = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: origin + '/' },
      { '@type': 'ListItem', position: 2, name: 'Products', item: origin + '/products/' },
      { '@type': 'ListItem', position: 3, name: category, item: categoryUrl },
      { '@type': 'ListItem', position: 4, name: p.name + ' — ' + p.packing, item: productUrl(p) },
    ],
  };
  const rows = specifications.map(([key, value]) => `<tr><th scope="row">${esc(key)}</th><td>${esc(value)}</td></tr>`).join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="description" content="${esc(seoDescription).slice(0, 250)}">
<link rel="canonical" href="${esc(productUrl(p))}">
<meta name="robots" content="index,follow,max-image-preview:large">
<meta property="og:type" content="product">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(seoDescription).slice(0, 250)}">
<meta property="og:url" content="${esc(productUrl(p))}">
<meta property="og:image" content="${esc(imageUrl(p))}">
<meta property="og:image:alt" content="${esc(descriptiveAlt)}">
<meta name="twitter:image" content="${esc(imageUrl(p))}">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/logo.png" type="image/png">
<script defer src="${staticAnalyticsSrc}" data-orbit-kind="product" data-orbit-id="${esc(p.id)}" data-orbit-category="${esc(p.category)}"></script>
<script type="application/ld+json">${jsonLd(schema)}</script>
<script type="application/ld+json">${jsonLd(landingPage)}</script>
<script type="application/ld+json">${jsonLd(breadcrumbs)}</script>
<style>
:root{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#0c2b44;background:#f7fafc}
*{box-sizing:border-box}body{margin:0;line-height:1.6}a{color:#075a9b}
.container{width:min(1160px,calc(100% - 40px));margin-inline:auto}
header{background:white;border-bottom:1px solid #e5edf4}
nav{display:flex;align-items:center;gap:25px;flex-wrap:wrap;padding:17px 0}
nav img{width:92px;height:47px;object-fit:contain;margin-right:auto}
nav a{font-weight:650;text-decoration:none}
main{padding:26px 0 60px}.crumbs{font-size:.9rem;color:#527086;margin:8px 0 27px}
.layout{display:grid;grid-template-columns:minmax(250px,1fr) minmax(300px,1.25fr);gap:clamp(24px,5vw,80px)}
.visual{background:linear-gradient(145deg,#fff,#e9f1f7);border:1px solid #e6eff5;border-radius:24px;display:grid;place-items:center;min-height:470px;padding:25px}
.visual img{max-width:100%;max-height:510px;width:auto;height:auto;object-fit:contain}
.kicker{color:#aa5b05;font-size:.8rem;letter-spacing:.12em;text-transform:uppercase;font-weight:800}
h1{font-size:clamp(2rem,4vw,3.2rem);line-height:1.1;margin:13px 0 20px}
h2{font-size:1.4rem;margin-top:32px}.lead{font-size:1.06rem;color:#38556b}
.tag{display:inline-block;margin:7px 8px 8px 0;padding:6px 12px;border-radius:999px;background:#e7f2fa;font-weight:650}
table{width:100%;border-collapse:collapse;font-size:.95rem}
th,td{text-align:left;vertical-align:top;border-bottom:1px solid #e1e9ef;padding:12px 8px}
th{width:45%;color:#274d68}.btn{display:inline-block;padding:12px 21px;background:#f7931e;color:#09243b;border-radius:9px;text-decoration:none;font-weight:800;margin-top:20px}
.note{font-size:.9rem;color:#587086;margin-top:20px}
footer{background:#09263e;color:#deebf4;padding:32px 0}footer a{color:white}
@media(max-width:760px){.layout{grid-template-columns:1fr}.visual{min-height:350px}nav{gap:16px}}
</style>
</head>
<body>
<header><nav class="container" aria-label="Primary"><a href="/"><img src="/logo.png" alt="Orbit Lubricants"></a><a href="/products/">Products</a><a href="/about/">About</a><a href="/contact/">Contact</a></nav></header>
<main class="container">
<div class="crumbs"><a href="/">Home</a> / <a href="/products/">Products</a> / <a href="/applications/${esc(p.category)}/">${esc(category)}</a> / ${esc(p.name)} — ${esc(p.packing)}</div>
<article class="layout"><div class="visual"><img src="${esc(p.image)}" width="600" height="600" alt="${esc(descriptiveAlt)}" loading="eager" fetchpriority="high"></div>
<div><span class="kicker">${esc(category)}</span><h1>${esc(p.name)}</h1><p class="lead">${esc(description)}</p>
<span class="tag">${esc(p.packing)}</span>${p.viscosity ? `<span class="tag">${esc(p.viscosity)}</span>` : ''}
<h2>Product information</h2><table><tbody>${rows}</tbody></table>
<p class="note">Information reflects product-pack labeling. Check the vehicle or equipment manufacturer's recommendation before use. No independent approval or certification is implied.</p>
<a class="btn" href="/contact/">Enquire about this product</a>
</div></article>
</main>
<footer><div class="container"><strong>Orbit Lubricants</strong><p>Kanchpur, Sonargaon, Narayanganj, Bangladesh</p><p><a href="mailto:info@orbit-lubricants.com">info@orbit-lubricants.com</a></p></div></footer>
</body></html>`;
}

function renderSpaShell(inputHtml, route) {
  const pageTitle = {
    products: 'Engine Oil, Gear Oil & Brake Fluid Catalog | Orbit Lubricants',
    about: 'About Orbit Lubricants | Bangladesh Automotive Lubricants',
    contact: 'Contact Orbit Lubricants | Product & Distributor Enquiries',
    finder: 'Lubricant Finder | Choose By Application | Orbit Lubricants',
  }[route];
  const descriptions = {
    products: 'Browse Orbit Lubricants oils and fluids by application, viscosity, performance class and pack size.',
    about: 'Learn about Orbit Lubricants and our automotive, motorcycle, heavy-duty and transmission fluid range.',
    contact: 'Contact Orbit Lubricants for product details, dealership and bulk supply enquiries in Bangladesh.',
    finder: 'Explore Orbit lubricants by application. Verify vehicle or equipment requirements before choosing a grade.',
  };
  const url = `${origin}/${route}/`;
  const addHead = `<link rel="canonical" href="${url}">
<meta property="og:title" content="${esc(pageTitle)}">
<meta property="og:description" content="${esc(descriptions[route])}">
<meta property="og:url" content="${url}">`;
  return inputHtml
    .replace(/<link rel="canonical"[^>]*>\s*/g, '')
    .replace(/<meta property="og:(title|description|url)"[^>]*>\s*/g, '')
    .replace(new RegExp('<title>[^<]*</title>'), `<title>${esc(pageTitle)}</title>`)
    .replace(/<meta name="description" content="[^"]*">/, `<meta name="description" content="${esc(descriptions[route])}">`)
    .replace('</head>', addHead + '\n</head>');
}

const shell = readFileSync(join(dist, 'index.html'), 'utf8');
for (const route of ['products', 'about', 'contact', 'finder']) {
  const dir = join(dist, route);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), renderSpaShell(shell, route));
}
for (const p of catalog) {
  const dir = join(dist, 'products', p.id);
  mkdirSync(dir, { recursive: true });
  writeFileSync(join(dir, 'index.html'), renderProductPage(p));
}
const applicationPages = buildCategoryPages({ dist, categories: initialData.categories, products: catalog, staticAnalyticsSrc });
const paths = ['/', '/products/', '/about/', '/contact/', '/finder/',
  ...applicationPages.map((page) => page.path),
  ...catalog.map((p) => `/products/${p.id}/`)];
const imageMap = new Map();
for (const p of catalog) imageMap.set(`/products/${p.id}/`, [p.image]);
for (const page of applicationPages) imageMap.set(page.path, page.images);
const sitemap = '<?xml version="1.0" encoding="UTF-8"?>\n'
  + '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n'
  + paths.map((path) => {
    const images = [...new Set(imageMap.get(path) || [])];
    return '  <url><loc>' + origin + path + '</loc>'
      + images.map((url) => '<image:image><image:loc>' + origin + esc(url) + '</image:loc></image:image>').join('')
      + '</url>';
  }).join('\n')
  + '\n</urlset>\n';
writeFileSync(join(dist, 'sitemap.xml'), sitemap);
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: ${origin}/sitemap.xml\n`);
writeFileSync(join(dist, 'seo-manifest.json'), JSON.stringify({ products: catalog.length, applications: applicationPages.length, routes: paths.length, imageReferences: catalog.length * 2 }, null, 2));
const release = {
  commit: process.env.GITHUB_SHA || 'local-development',
  productCount: catalog.length,
  catalogVersion: initialData.catalogVersion,
  builtAt: new Date().toISOString()
};
writeFileSync(join(dist, 'deployment.json'), JSON.stringify(release, null, 2) + '\n');
console.log(`Generated ${catalog.length} product detail pages, ${applicationPages.length} category hubs and ${paths.length} image-enhanced sitemap URLs; static analytics client: ${staticAnalyticsFile}; visitor GA4 ${ga4Id ? 'configured' : 'disabled'}.`);
