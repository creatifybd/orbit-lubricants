import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { initialData } from '../src/data/initialData.js';

const origin = 'https://orbit-lubricants.com';
const entries = initialData.products;
const categories = initialData.categories;
const errors = [];
const warnings = [];
const results = [];
const noindex = (value) => /noimageindex|noindex/i.test(value || '');
async function get(path, binary = false) {
  const res = await fetch(origin + path, {
    signal: AbortSignal.timeout(14000),
    headers: { Accept: '*/*' }
  });
  const content = binary ? Buffer.from(await res.arrayBuffer()) : await res.text();
  return { status: res.status, headers: res.headers, content };
}
async function checkProduct(p) {
  try {
    const img = await get(p.image, true);
    const mime = img.headers.get('content-type') || '';
    if (img.status !== 200) errors.push(p.id + ': image HTTP ' + img.status);
    if (!mime.includes('image/webp')) errors.push(p.id + ': wrong image MIME ' + mime);
    if (img.content.length < 1024) errors.push(p.id + ': suspicious image byte count ' + img.content.length);
    if (noindex(img.headers.get('x-robots-tag'))) errors.push(p.id + ': image X-Robots-Tag blocks indexing');
    if (img.content.subarray(0,4).toString('ascii') !== 'RIFF' ||
        img.content.subarray(8,12).toString('ascii') !== 'WEBP') errors.push(p.id + ': source is not RIFF WEBP');
    const html = await get('/products/' + p.id + '/');
    if (html.status !== 200) errors.push(p.id + ': page HTTP ' + html.status);
    if (noindex(html.headers.get('x-robots-tag'))) errors.push(p.id + ': page X-Robots-Tag blocks indexing');
    if (/<meta name="robots" content="noindex/i.test(html.content)) errors.push(p.id + ': HTML noindex');
    if (!html.content.includes('<img src="' + p.image + '"')) errors.push(p.id + ': image absent from img.src');
    if (!html.content.includes('content="' + origin + p.image + '"')) errors.push(p.id + ': OG image missing');
    if (!html.content.includes('"contentUrl":"' + origin + p.image + '"')) errors.push(p.id + ': preferred ImageObject missing');
    if (!html.content.includes('<link rel="canonical" href="' + origin + '/products/' + p.id + '/">')) errors.push(p.id + ': wrong canonical');
    if (img.content.length > 1536000) warnings.push(p.id + ': large image source ' + (img.content.length / 1048576).toFixed(2) + ' MiB');
    results.push({ id:p.id, bytes:img.content.length, mime,
      hash:createHash('sha256').update(img.content).digest('hex'), image:p.image });
  } catch(e) { errors.push(p.id + ': ' + String(e).slice(0,140)); }
}
const unique = new Set(entries.map(p=>p.image));
assert.equal(entries.length,38,'Unexpected catalog size');
if (unique.size !== entries.length) warnings.push('Some SKUs use the same image URL');
for (let i=0;i<entries.length;i+=4) await Promise.all(entries.slice(i,i+4).map(checkProduct));
try {
  const robots=await get('/robots.txt');
  if (robots.status !== 200) errors.push('robots.txt status ' + robots.status);
  if (!robots.content.includes('Sitemap: https://orbit-lubricants.com/sitemap.xml')) errors.push('robots sitemap pointer missing');
  if (/Disallow:\s*\/products\b/i.test(robots.content)) errors.push('robots blocks products');
  const sitemap=await get('/sitemap.xml');
  if (sitemap.status !== 200) errors.push('sitemap HTTP ' + sitemap.status);
  for (const p of entries)
    if (!sitemap.content.includes('<image:loc>' + origin + p.image + '</image:loc>'))
      errors.push(p.id + ': image not in sitemap');
  for (const c of categories) {
    const page=await get('/applications/' + c.id + '/');
    if (page.status !== 200) errors.push('Category ' + c.id + ' HTTP ' + page.status);
    for (const p of entries.filter(x=>x.category===c.id)) {
      if (!page.content.includes('<img src="' + p.image + '"')) errors.push('Category ' + c.id + ' image missing for ' + p.id);
      if (!page.content.includes('/products/' + p.id + '/')) errors.push('Category ' + c.id + ' page link missing for ' + p.id);
    }
  }
} catch(e) { errors.push('Global audit ' + String(e)); }
const grouped=new Map();
for (const x of results) grouped.set(x.hash,[...(grouped.get(x.hash)||[]),x.id]);
const duplicates=[...grouped.values()].filter(arr=>arr.length>1);
if (duplicates.length) warnings.push('Identical image byte groups: ' + JSON.stringify(duplicates));
const summary={status:errors.length?'FAIL':'PASS',timestamp:new Date().toISOString(),
  productPages:entries.length,imageUrls:unique.size,
  imagesFetched:results.length,distinctImageContentHashes:grouped.size,
  categoryPages:categories.length,
  largestImages:[...results].sort((a,b)=>b.bytes-a.bytes).slice(0,6).map(x=>({id:x.id,kilobytes:Math.round(x.bytes/1024)})),
  duplicateBytes:duplicates,warnings,errors};
console.log(JSON.stringify(summary,null,2));
if(errors.length)process.exitCode=1;
