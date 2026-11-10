# Orbit — Grade-wise Organic Search Content Plan (Google Search Console is Processing)

**Date:** 2026-11-10. **Scope:** research and implementation checklist, *not a completed publication or proof of rankings.*

## Current evidence
- The owner verified `sc-domain:orbit-lubricants.com` and submitted a sitemap on 2026-11-10. The current live sitemap contains **53 page URLs**, including 38 original pack pages, 9 applications and an original image gallery.
- The owner screenshot from 2026-11-10 shows Google Search Console **Performance → 3 months → Processing data, please check again in a day or so**. The Search Type selector is currently disabled. **We cannot yet infer any Google Images clicks, impressions, queries, ranking, or indexed-image counts.**
- A separate 38-image HTTP/WebP/alt/canonical audit and image gallery deployment passed. That establishes technical availability, **not** Google index inclusion or Google Search traffic.

## User-facing, truthful keyword clusters

The target is topical relevance and useful selection information, **not** generating dozens of near-duplicate SEO pages. Build one editorial grade-comparison guide or enrich existing application hubs before adding any more URLs. Avoid doorway abuse and scaled-content abuse.

| Topic cluster | Existing catalog evidence | Useful comparison / content requirement |
|---|---|---|
| Motorcycle 4T oils | Orbit XPower 10W-30, 10W-40, 20W-40, 20W-50, marked API SL/JASO MA2 | Explain label-stated viscosity and motorcycle wet-clutch requirement; distinguish SAE/JASO marking from independent approval |
| Passenger car engine oils | Orbit Supreme multigrades including 0W-20, 5W-30, 5W-40, 10W-30, 10W-40, 20W-50 in catalog | Compare exact pack/label statements; advise manufacturer's vehicle-specific required grade; do not recommend a product solely because its grade matches |
| Heavy-duty diesel oil | Orbit Elite HDE SAE 15W-40 label API CI-4; Optima HDE SAE 20W-50 label API CF-4 | Distinguish label classification and pack sizes; no unverified OEM endorsements or extended drain promises |
| CNG engine oil | BoostX CNG SAE 20W-50 | Explain that CNG application and viscosity are not proof of universal vehicle compatibility |
| Monograde oils | Orbit Nova HD40 (SAE 40), Nova HD50 (SAE 50) | Explain SAE single-grade label and appropriate manual check; no claim all diesels should use monograde |
| Gear oils | GearX 80W-90 and 85W-140 labeled GL-4 | Engine-oil grades and gear-oil grades cannot be substituted based on number alone; transmission/axle requirement must match |
| ATF & CVTF | RevX ATF Dex III, CVTF TC and FE | Distinguish ordinary automatic and CVT fluid families; no interchangeability claim |
| Hydraulic brake fluids | Brako DOT 3 and DOT 4 | Follow exact brake system manual; never assert two classes are interchangeable or replaceable by engine oil |
| Bulk branded containers | Five bulk-pack presentation SKUs | Container pack art does not establish actual lubricant fill or technical grade; confirm with sales |

## Priority backlog while GSC data processes
- [x] Technical readiness and live availability of 38 distinct original pack images confirmed. See `docs/GOOGLE_IMAGES_ALL_38_AUDIT_20261110.md`.
- [x] User-facing `/product-gallery/` live: 38 real pack images; category-linked and canonical. See Master Checklist.
- [x] Draft data-grounded grade-topic content and safety policy here.
- [ ] Editorially review exact label grades and availability for every SKU before presenting a site-wide compatibility matrix.
- [ ] Produce a **single substantial grade selection guide** and link to useful existing `/applications/` and `/products/` pages. Avoid thin standalone pages per grade and repetitive keyword stuffing.
- [ ] Add authentic manufacturer-approved technical data sheets and safety data sheets if available (never fabricate TDS, SDS, API/OEM license, testing figures or certificates).
- [ ] Once GSC Performance finishes processing, check Search type: **Image** as well as **Web**; capture exact queries, click/impressions, CTR, landing pages and date ranges. Do not fill blanks with invented performance numbers.
- [ ] In Google Search Console → Page indexing, check actual indexed/excluded page totals and reasons when processing ends; test at least one representative product URL in each of the 9 existing categories. A Live URL Test is not proof of indexing.
- [ ] Obtain a public Google OAuth Web Client ID, enable Search Console API, configure the existing read-only Admin Search Performance module and verify it with a real authorized account; never paste OAuth client secrets, access tokens or service account JSON into a public website.
- [ ] Obtain the real Orbit GA4 Web Measurement ID and owner-approved visitor notice before activating consent-gated analytics on the public site.

## Important SEO policies and technical guidance
- Image SEO: https://developers.google.com/search/docs/appearance/google-images
- Spam, scaled content and doorway policy: https://developers.google.com/search/docs/essentials/spam-policies
- Sitemap processing and indexing: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview

### Acceptance criteria
Work is not marked fully complete until (a) content is factual and user-visible, (b) production build/UI/SEO checks pass, (c) original branded images are byte-identical to approved source assets, and (d) real Search Console data is measured. A green test, 53 discovered URLs, or 114 references to 38 images cannot guarantee appearance in Google Images.
