# Orbit: 38-Image Visibility & Technical Audit — 10 November 2026

## Problem and observations
- Owner reports that Google Images currently surfaces only NOVA HD40 prominently when searching Orbit.
- Google Search Console Domain property was verified **today, 10 November 2026** and clean sitemap was submitted today.
- On the same day Google Search Console showed 52 discovered pages but **Page indexing still processing**. NOVA's Google Index status showed **Discovered — currently not indexed**, with Last Crawl N/A. Its Live Test eventually passed and a single indexing request was accepted.
- A Google Images result count is **not** an inventory of all indexed product image files, and GSC's Image Search Performance gives clicks/impressions by query/page (not a reliable exact tally of each indexed image URL).

## Independent live audit
GitHub run: https://github.com/creatifybd/orbit-lubricants/actions/runs/42852761957

- **38 of 38 original pack WebP URLs** returned HTTP 200, correct image/webp MIME and valid RIFF/WebP contents.
- **38 unique image URLs / 38 unique SHA-256 image contents**; no two packs are accidentally serving identical bytes.
- All 38 item landing pages served HTTP 200, correct canonical, ordinary HTML <img src> using the approved source image, Open Graph image and primaryImageOfPage metadata.
- All nine application hubs expose the corresponding images and HTML links to each product.
- Checked robots.txt and sitemap: no product-image robots restriction found.
- The largest images audited were roughly 150–166 KiB, so transfer size was not a technical blocker in this sample.
- **0 functional errors / 0 warnings** in the read-only live audit. This does **not** establish Google crawling, index inclusion, search ranking, or complete mobile performance.

## Incremental discovery improvement
- Add a genuinely useful, static, fully crawlable, user-visible **/product-gallery/**.
- Display all **38 original image files**, organized by nine real application categories with unique captions, actual label-stated viscosity grade and pack size plus direct product-detail links.
- Use original image URLs only; do not resize, recompress, recolor or modify any branded art.
- Link the gallery visibly from the main React footer, category landing pages and individual SKU landing pages.
- Add one canonical gallery URL to sitemap. Updated sitemap counts:
  - **53 distinct page URLs** (5 base routes, 9 category routes, 38 SKU routes, 1 gallery).
  - **114 image sitemap references** (38 images × 3 landing contexts: SKU, category, gallery).
  - **38 distinct original pack image files**. Do not misrepresent 114 references as 114 different images.
- Gallery contains valid CollectionPage and BreadcrumbList schema. Do not add fake Product offers/reviews or generate thin keyword doorway pages.
- No third-party paid software or expensive services.

## Independent verification gates
- Build and privacy/GSC unit tests passed with no Google visitor tracking activated.
- Chrome desktop/mobile QA passed, including direct navigation, all 38 gallery images, 9 categories, 114 real links from image/title/detail and no runtime exceptions.
- CI staging: https://github.com/creatifybd/orbit-lubricants/actions/runs/42854025322 — PASS.
- Staged diff: **0 removed files, 0 changed branded image files**.
- Production deployment marker and live gallery/sitemap need separate verification following merge.
- Live Search Console **Image Search** and **Google Index** reports still need owner-supplied account evidence; no search-ranking guarantee.

## Correct next steps once production is verified
1. Do NOT repeatedly submit every image URL or 38 page indexing requests in bulk. Google explicitly says repeated indexing requests do not accelerate crawling.
2. Existing verified Domain property should automatically re-read the same sitemap.xml; monitor whether **53** URLs eventually appear as discovered. Resubmit only if genuine sitemap error persists.
3. For representative SKUs in each category, use Google Search Console URL Inspection. Compare Google Index vs Live Test and check selected canonical, crawl/fetch and indexing exclusion reasons.
4. Once processed, Search Console → Performance → Search type **Image** → Pages & Queries. Distinguish branded and grade-specific search terms. No numbers may be invented from page/sitemap counts.
5. Strengthen manufacturer-verified technical resources (TDS/SDS, SAE/API label information), useful consumer guides, real business details, internal linking and earned industry mentions. Never claim “best brand” as a self-awarded fact or fabricate reviews.
6. Monitor actual image search visibility over coming days/weeks. Google indexing and ranking decisions are outside our ability to force.

Official Google policy:
- https://developers.google.com/search/docs/appearance/google-images
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
