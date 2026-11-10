
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

// This public gallery offers a useful all-in-one visual catalog, not doorway
// pages or fabricated product offers. Approved original pack bytes stay intact.
const origin = 'https://orbit-lubricants.com';
const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (ch) => ({
  '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
}[ch]));
const asJson = (value) => JSON.stringify(value).replace(/</g, '\\u003c');
const details = (p) => [
  p.name,
  p.viscosity && !p.name.toLowerCase().includes(String(p.viscosity).toLowerCase()) ? p.viscosity : '',
  p.packing
].filter(Boolean).join(' — ');

export function buildImageGallery({dist,products,categories}) {
  const url = origin + '/product-gallery/';
  if (products.length !== 38 || categories.length !== 9) throw new Error('Unexpected Orbit gallery catalog');
  const title = 'Orbit Lubricants Product Gallery | Original Packs & SAE Grades';
  const description = 'Browse original Orbit Lubricants product pack images, labelled SAE viscosity grades and available pack sizes across motorcycle, passenger car, heavy-duty, gear, transmission, brake fluid and other lubricant applications in Bangladesh.';
  const counts = categories.map(c=>({category:c,items:products.filter(p=>p.category===c.id)}));
  if (counts.some(x=>x.items.length===0)) throw new Error('Empty product application group in gallery');

  const navigation = counts.map(({category,items}) =>
    '<a href="#' + escapeHtml(category.id) + '">' + escapeHtml(category.name) +
    ' <span>(' + items.length + ')</span></a>'
  ).join('');

  const groups = counts.map(({category,items},groupIndex) =>
    '<section class="group" id="' + escapeHtml(category.id) + '">' +
    '<div class="group-head"><div><p class="eyebrow">ORBIT PRODUCT RANGE</p><h2>' +
      escapeHtml(category.name) + '</h2></div><a href="/applications/' +
      escapeHtml(category.id) + '/">View application details</a></div>' +
    '<ul class="cards">' + items.map((p,index) =>
      '<li><figure class="card"><a class="art" href="/products/' + escapeHtml(p.id) + '/" ' +
      'aria-label="View details for ' + escapeHtml(details(p)) + '">' +
      '<img src="' + escapeHtml(p.image) + '" width="480" height="480" ' +
      'loading="' + (groupIndex===0&&index===0?'eager':'lazy') + '" decoding="async" ' +
      'alt="' + escapeHtml(details(p) + ' — original Orbit Lubricants product pack photograph') + '">' +
      '</a><figcaption><h3><a href="/products/' + escapeHtml(p.id) + '/">' +
      escapeHtml(p.name) + '</a></h3><p class="spec">' +
      escapeHtml([p.viscosity,p.apiGrade,p.packing].filter(Boolean).join(' · ')) +
      '</p><p class="caption">' + escapeHtml(p.description || '') +
      '</p><a class="details" href="/products/' + escapeHtml(p.id) + '/">Product details</a>' +
      '</figcaption></figure></li>'
    ).join('') + '</ul></section>'
  ).join('\n');

  const schema = {
    '@context':'https://schema.org',
    '@type':'CollectionPage',
    name:title,
    url,
    description,
    isPartOf:{'@type':'WebSite',name:'Orbit Lubricants',url:origin+'/'},
    mainEntity:{
      '@type':'ItemList',
      numberOfItems:products.length,
      itemListElement:products.map((p,i)=>({
        '@type':'ListItem',position:i+1,
        name:details(p),url:origin+'/products/'+p.id+'/'
      }))
    }
  };
  const breadcrumb = {
    '@context':'https://schema.org',
    '@type':'BreadcrumbList',
    itemListElement:[
      {'@type':'ListItem',position:1,name:'Home',item:origin+'/'},
      {'@type':'ListItem',position:2,name:'Original Product Gallery',item:url}
    ]
  };

  const html = '<!doctype html><html lang="en"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>' + escapeHtml(title) + '</title>' +
    '<meta name="description" content="' + escapeHtml(description) + '">' +
    '<link rel="canonical" href="' + url + '">' +
    '<meta name="robots" content="index,follow,max-image-preview:large">' +
    '<meta property="og:type" content="website"><meta property="og:title" content="' + escapeHtml(title) + '">' +
    '<meta property="og:url" content="' + url + '"><meta property="og:description" content="' + escapeHtml(description) + '">' +
    '<meta property="og:image" content="' + origin + escapeHtml(products[0].image) + '">' +
    '<link rel="icon" href="/logo.png" type="image/png">' +
    '<script type="application/ld+json">' + asJson(schema) + '</script>' +
    '<script type="application/ld+json">' + asJson(breadcrumb) + '</script>' +
    '<style>:root{font-family:system-ui,-apple-system,"Segoe UI",sans-serif;color:#102f47;background:#f5f9fc}' +
    '*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0}a{color:#07578c}' +
    '.wrap{width:min(1220px,calc(100% - 36px));margin-inline:auto}' +
    'header{background:#fff;border-bottom:1px solid #dce9f2}header nav{display:flex;align-items:center;gap:24px;flex-wrap:wrap;padding:16px 0}' +
    'header nav img{width:95px;max-height:46px;object-fit:contain}header nav a{text-decoration:none;font-weight:700}' +
    '.intro{padding:45px 0 22px}.eyebrow{font-weight:800;font-size:.75rem;letter-spacing:.13em;color:#a35e0d;text-transform:uppercase}' +
    'h1{font-size:clamp(2rem,4.5vw,3.7rem);line-height:1.11;margin:12px 0 18px;max-width:790px}' +
    '.lead{font-size:1.08rem;line-height:1.7;color:#475d6e;max-width:840px}' +
    '.notice{background:#fff;border-left:4px solid #f7931e;padding:16px 20px;color:#465e71;line-height:1.6;border-radius:0 9px 9px 0}' +
    '.filters{display:flex;flex-wrap:wrap;gap:8px;margin:30px 0 8px}.filters a{font-size:.86rem;border-radius:50px;padding:9px 13px;background:#e4eef7;text-decoration:none;font-weight:750}' +
    '.filters span{font-weight:500;color:#4b6577}.group{padding:32px 0 28px;scroll-margin-top:16px}' +
    '.group-head{display:flex;justify-content:space-between;align-items:end;gap:18px;flex-wrap:wrap;border-bottom:1px solid #d7e3ec;padding-bottom:13px;margin-bottom:20px}' +
    '.group-head h2{font-size:clamp(1.4rem,2.6vw,2rem);margin:7px 0}.group-head>a{font-weight:750;margin-bottom:9px}' +
    '.cards{list-style:none;padding:0;margin:0;display:grid;grid-template-columns:repeat(auto-fit,minmax(238px,1fr));gap:17px}' +
    '.card{height:100%;margin:0;display:flex;flex-direction:column;background:#fff;border:1px solid #e1eaf2;border-radius:16px;overflow:hidden;box-shadow:0 5px 15px #071d290d}' +
    '.art{background:linear-gradient(150deg,#f6fafc,#e9f2f8);min-height:260px;padding:15px;display:grid;place-items:center}' +
    '.art img{display:block;max-width:100%;max-height:235px;width:auto;height:auto;object-fit:contain}' +
    'figcaption{padding:17px 18px 21px;flex:1;display:flex;flex-direction:column}' +
    'figcaption h3{font-size:1.04rem;line-height:1.35;margin:0 0 9px}figcaption h3 a{text-decoration:none}' +
    '.spec{font-weight:750;font-size:.8rem;color:#12608f;margin:0 0 9px}' +
    '.caption{color:#455d70;font-size:.87rem;line-height:1.55;margin:0 0 15px}' +
    '.details{margin-top:auto;font-size:.86rem;font-weight:800}.note{padding:30px 0 60px;color:#485c6e;line-height:1.6}' +
    'footer{background:#102a41;color:#ebf3f8;padding:26px 0}footer a{color:#fff}' +
    'a:focus-visible{outline:3px solid #f7931e;outline-offset:3px}' +
    '@media(max-width:550px){.intro{padding-top:25px}.cards{grid-template-columns:repeat(auto-fit,minmax(210px,1fr))}.art{min-height:220px}}' +
    '</style></head><body>' +
    '<header><nav class="wrap" aria-label="Main"><a href="/"><img src="/logo.png" alt="Orbit Lubricants"></a>' +
    '<a href="/products/">All products</a><a href="/finder/">Lubricant finder</a><a href="/contact/">Contact</a></nav></header>' +
    '<main class="wrap"><section class="intro"><p class="eyebrow">ORIGINAL PACK IMAGES · BANGLADESH</p>' +
    '<h1>Orbit Lubricants Product Gallery</h1><p class="lead">' + escapeHtml(description) + '</p>' +
    '<p class="notice">Explore all ' + products.length + ' original Orbit product pack images. Each pack links to its own label information. Always check the manufacturer specifications for your vehicle or equipment.</p>' +
    '<nav class="filters" aria-label="Jump to product category">' + navigation + '</nav></section>' +
    groups +
    '<p class="note">Pack artwork is presented as supplied. The gallery does not imply a specific price, active stock, API certification or suitability for any vehicle without manufacturer confirmation.</p></main>' +
    '<footer><div class="wrap">Orbit Lubricants, Kanchpur, Sonargaon, Narayanganj, Bangladesh. ' +
    '<a href="/contact/">Contact the Orbit team</a></div></footer></body></html>';
  const directory=join(dist,'product-gallery');
  mkdirSync(directory,{recursive:true});
  writeFileSync(join(directory,'index.html'),html);
  return {url,images:products.map(p=>p.image),count:products.length};
}
