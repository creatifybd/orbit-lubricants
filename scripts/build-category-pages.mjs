import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

/**
 * These are factual, category-level product discovery hubs.
 * Their content is purposely restricted to label-stated product data; never
 * claim third-party approval, engine compatibility or an unverified accolade.
 */
const descriptions = {
  motorcycle: 'Compare Orbit four-stroke motorcycle oils using the viscosity grade, classification printed on the pack and available packaging. Motorcycle requirements vary: verify the grade and clutch specification in your owner manual before selecting an oil.',
  automotive: 'Explore passenger car engine oils from Orbit by SAE viscosity, label-stated classification and pack size. A product with the same viscosity as another is not necessarily interchangeable; check the automaker’s manual and required specifications.',
  cng: 'Find Orbit engine oils listed for CNG vehicle applications. Review the stated viscosity and packaging on each individual product page, then confirm your engine’s lubrication requirements with the vehicle manufacturer or a qualified technician.',
  'heavy-duty': 'Browse Orbit heavy-duty diesel engine oil packs and compare their label-stated SAE viscosities and available formats. For commercial fleets and equipment, follow engine manufacturer requirements and any applicable performance classifications.',
  transmission: 'Explore Orbit automatic transmission fluid and CVTF labels. ATF and CVT fluids are not interchangeable merely because they appear in the same category. Check the exact transmission fluid specification required by your manufacturer.',
  'gear-oil': 'Browse Orbit GearX gear oil packs grouped by the SAE viscosity and GL classification stated on the label. Gearbox and differential requirements can differ substantially, so check the specific equipment recommendation before use.',
  'brake-fluid': 'Find Orbit Brako brake fluid pack formats and label-stated DOT classes. Brake systems have strict fluid requirements: check your vehicle manual and service guidance; do not substitute an unverified brake fluid.',
  monograde: 'Compare Orbit monograde motor oil packs using their SAE single-grade markings and container sizes. A monograde grade is not suitable for every modern engine: confirm the original equipment manufacturer’s viscosity and service-class requirement.',
  'bulk-pack': 'Explore Orbit-branded bulk containers and available packaging formats. A branded drum or pail image does not establish what lubricant is filled inside. Contact Orbit sales to confirm the actual product, specification, pack capacity and supply terms.'
};

const origin = 'https://orbit-lubricants.com';
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (c) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));
const safeJson = (value) => JSON.stringify(value).replace(/</g, '\\u003c');

export function buildCategoryPages({ dist, categories, products }) {
  const pages = [];
  for (const category of categories) {
    if (!Object.hasOwn(descriptions, category.id)) {
      throw new Error('Missing editorial category description for ' + category.id);
    }
    if (!/^[a-z0-9-]+$/.test(category.id)) throw new Error('Invalid category slug');
    const group = products.filter((product) => product.category === category.id);
    if (!group.length) throw new Error('Empty Orbit catalog category: ' + category.id);
    const url = origin + '/applications/' + category.id + '/';
    const title = category.name + ' in Bangladesh | Orbit Lubricants';
    const intro = descriptions[category.id];
    const cardHtml = group.map((p) => {
      const packTitle = p.name + ' — ' + p.packing;
      const href = '/products/' + p.id + '/';
      return '<li><article class="product">' +
        '<a href="' + href + '"><img src="' + escapeHtml(p.image) + '" width="320" height="320" loading="lazy" decoding="async" alt="' + escapeHtml(packTitle + ' original product pack') + '"></a>' +
        '<div class="product-text"><h2><a href="' + href + '">' + escapeHtml(packTitle) + '</a></h2>' +
        '<p>' + escapeHtml(p.description || '') + '</p>' +
        '<dl><div><dt>Viscosity / grade</dt><dd>' + escapeHtml(p.viscosity || 'Check label') + '</dd></div>' +
        '<div><dt>Label classification</dt><dd>' + escapeHtml(p.apiGrade || 'See packaging') + '</dd></div>' +
        '<div><dt>Pack size</dt><dd>' + escapeHtml(p.packing) + '</dd></div></dl>' +
        '<a class="detail" href="' + href + '">View this product &amp; label details</a></div>' +
        '</article></li>';
    }).join('\n');
    const schema = {
      '@context': 'https://schema.org',
      '@type': 'CollectionPage',
      name: title,
      url,
      description: intro,
      isPartOf: { '@type': 'WebSite', name: 'Orbit Lubricants', url: origin + '/' },
      mainEntity: {
        '@type': 'ItemList',
        itemListElement: group.map((p, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: p.name + ' — ' + p.packing,
          url: origin + '/products/' + p.id + '/'
        }))
      }
    };
    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: origin + '/' },
        { '@type': 'ListItem', position: 2, name: 'Products', item: origin + '/products/' },
        { '@type': 'ListItem', position: 3, name: category.name, item: url }
      ]
    };
    const html = '<!doctype html><html lang="en"><head>' +
      '<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
      '<title>' + escapeHtml(title) + '</title><meta name="description" content="' + escapeHtml(intro.slice(0, 165)) + '">' +
      '<link rel="canonical" href="' + url + '">' +
      '<meta name="robots" content="index,follow,max-image-preview:large">' +
      '<meta property="og:type" content="website"><meta property="og:title" content="' + escapeHtml(title) + '">' +
      '<meta property="og:description" content="' + escapeHtml(intro.slice(0, 165)) + '">' +
      '<meta property="og:url" content="' + url + '">' +
      '<meta property="og:image" content="' + origin + escapeHtml(group[0].image) + '">' +
      '<link rel="icon" href="/logo.png" type="image/png">' +
      '<script type="application/ld+json">' + safeJson(schema) + '</script>' +
      '<script type="application/ld+json">' + safeJson(breadcrumb) + '</script>' +
      '<style>:root{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#102c40;background:#f7fafc}' +
      '*{box-sizing:border-box}body{margin:0}a{color:#075a9b}header,footer{padding:20px 0;background:white;border-bottom:1px solid #dbe6ed}' +
      '.wrap{width:min(1120px,calc(100% - 36px));margin:auto}.nav{display:flex;align-items:center;gap:20px;flex-wrap:wrap}.nav img{width:96px;height:48px;object-fit:contain}' +
      'main{padding:28px 0 60px}.crumb{font-size:.88rem;color:#425d72;margin-bottom:28px}h1{font-size:clamp(2rem,4.2vw,3rem);line-height:1.15;margin:10px 0 20px}' +
      '.intro{max-width:850px;color:#405a70;font-size:1.08rem;line-height:1.7}.hint{border-left:4px solid #f7931e;padding:15px;background:white;margin:28px 0 32px;color:#405a70;line-height:1.6}' +
      '.catalog{list-style:none;padding:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}' +
      '.product{background:white;border:1px solid #dde7ef;border-radius:17px;overflow:hidden;min-height:100%;display:flex;flex-direction:column}' +
      '.product>a{display:grid;place-items:center;background:#eef4f8;padding:16px}.product img{max-width:100%;max-height:250px;width:auto;height:auto;object-fit:contain}' +
      '.product-text{padding:20px;flex:1;display:flex;flex-direction:column}.product h2{font-size:1.16rem;line-height:1.35;margin:0 0 10px}.product p{color:#485e70;line-height:1.6;margin:0 0 12px}' +
      'dl{margin:0 0 14px}dl>div{display:flex;gap:10px;padding:5px 0;border-bottom:1px solid #eaf0f4}dt{font-weight:700;flex:1}dd{margin:0;flex:1}.detail{margin-top:auto;font-weight:700}' +
      'footer{background:#09263e;color:white;line-height:1.7}footer a{color:#fff}@media(max-width:570px){.catalog{grid-template-columns:1fr}}</style></head><body>' +
      '<header><nav class="wrap nav" aria-label="Primary"><a href="/"><img src="/logo.png" alt="Orbit Lubricants"></a><a href="/products/">All products</a><a href="/about/">About</a><a href="/contact/">Contact</a></nav></header>' +
      '<main class="wrap"><div class="crumb"><a href="/">Home</a> / <a href="/products/">Products</a> / ' + escapeHtml(category.name) + '</div>' +
      '<h1>' + escapeHtml(category.name) + ' — Orbit Lubricants Bangladesh</h1><p class="intro">' + escapeHtml(intro) + '</p>' +
      '<p class="hint">Showing ' + group.length + ' available pack formats from the Orbit catalog. Specifications are as stated in the available product records, not independent performance certifications. Follow your equipment manufacturer’s requirements.</p>' +
      '<ul class="catalog">' + cardHtml + '</ul></main>' +
      '<footer><div class="wrap">Orbit Lubricants — Kanchpur, Sonargaon, Narayanganj, Bangladesh. <a href="/contact/">Contact sales</a> for product or distributor enquiries.</div></footer>' +
      '</body></html>';
    const dir = join(dist, 'applications', category.id);
    mkdirSync(dir, { recursive: true });
    writeFileSync(join(dir, 'index.html'), html);
    pages.push({ path: '/applications/' + category.id + '/', images: group.map((p) => p.image) });
  }
  return pages;
}
