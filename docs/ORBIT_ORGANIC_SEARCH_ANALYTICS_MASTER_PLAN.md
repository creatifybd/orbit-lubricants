# Orbit Lubricants — Organic Discovery, Image SEO, Search Console and Analytics Master Plan

**Status (2026-11-10):** reviewed against current Google Search Central, Bing Webmaster and Firebase documentation. This document is an execution checklist, not a promise of specific search rankings.

## Starting evidence
- Domain: https://orbit-lubricants.com/
- Reviewed catalog: 38 product packs in nine application categories; the existing SEO build already published 38 individual product landing pages.
- Verified previous production technical audit: 43/43 URLs returned HTTP 200, zero duplicate-title warnings, and www canonical redirect passed. This proves HTTP discoverability, **not Google indexing**.
- Owner Firebase project (confirmed via screenshot, 2026-11-10): `orbit-lubricants`, Spark/free plan, one registered app. Auth/Firestore/GA4 and configuration details **not yet verified**. Keep this separate from Joytun and other accounts.

## P0 — Image indexing and catalog discovery (no new subscriptions)
- [x] Product HTML already has absolute canonical page URLs, Product JSON-LD, OpenGraph image and descriptive title.
- [x] Generate Google image sitemap extension with **76 references**: 38 original URLs on their individual product pages + 38 across matching category landing pages. Every image keeps the exact existing original file URL/bytes.
- [x] Add preferred image `WebPage.primaryImageOfPage` / `ImageObject.contentUrl`, descriptive but not keyword-stuffed image alt, `og:image:alt`, `twitter:image`, `max-image-preview:large`.
- [x] Generate nine static, publicly crawlable application category hubs with distinct factual copy, schema `CollectionPage`/`ItemList`, pack images and links to every SKU. Resulting sitemap has **52 URLs**.
- [x] Add visible, HTML `href` category links across site footer (not a bot-only, hidden links collection).
- [x] Add build-time tests for route counts, exact original image URLs, JSON-LD, canonical, no duplicate titles, image sitemap and no fabricated pricing/reviews.
- [ ] Stage build + real local HTTP tests, then production merge via controlled Git-root publisher and confirm Googlebot-accessible image URLs and actual live sitemap.
- [ ] Google Search Console: verify Domain property `orbit-lubricants.com`; submit `https://orbit-lubricants.com/sitemap.xml`; inspect representative product pages, canonical choice, image URLs and crawl/indexing reports. Explicitly examine `Crawled - currently not indexed`, `Discovered - currently not indexed`, page redirects and blocked images.
- [ ] Monitor Performance > Search Type **Image** separately from **Web** to track appearance of branded pack images, impressions, clicks, CTR, country and queries.
- [ ] Bing Webmaster Tools: import the verified Search Console property where supported, submit sitemap, inspect Bing crawl/image indexing; optionally implement IndexNow with a verified site ownership key on genuinely new or updated pages. **Never spam submit unchanged URLs on every visit/cron.**

## P1 — Search intent architecture and content (editorial/approval needed)
| Cluster | Relevant page | Content direction |
|---|---|---|
| Brand: Orbit Lubricants Bangladesh | Homepage, About | Clear, verified legal business identity, physical address, product range, official social profiles and consistent brand |
| Engine oils Bangladesh, car oil | `/applications/automotive/` | Product catalog, label grades, vehicle-manual selection notes |
| Motorcycle oil 10W-30, 20W-50 | `/applications/motorcycle/` and matching SKU URLs | Actual pack photos and true label API/JASO data; avoid invented motorcycle recommendations |
| Heavy-duty diesel oil 15W-40 / 20W-50 | `/applications/heavy-duty/` | Fleet use cases without unverified OEM endorsements |
| Gear oil 80W-90, 85W-140 | `/applications/gear-oil/` | SAE vs GL classes, product distinctions |
| ATF, CVTF, brake fluid DOT3/4 | Transmission and brake-fluid hubs | Compatibility cautions, original technical labels |
| Bulk lubricants, distribution | Bulk-pack and Contact pages | Verified available fills, supply contacts and factory facts |
| “Best lubricant brand in Bangladesh” | Not a fabricated claim | Grow credible helpful content, verified reviews/third-party citations, local/business references, authority over time; don't self-label as 'best' without evidence |

- [ ] Approve genuine technical data sheets (TDS), safety data sheets (SDS), manufacturing/company certifications and workshop FAQs before publishing; never invent API, OEM, ISO, fleet testimonials or certification.
- [ ] Develop evergreen comparison/education articles based on real manufacturer manuals and verified Orbit specs (e.g., “SAE 20W-50 vs 15W-40: read the label and your vehicle manual”). Add internal links, actual images and byline/review dates.
- [ ] Optimize Bengali+English content professionally **only after** approved Bangla technical terminology and proofread translation; do not create thin near-duplicates.
- [ ] Claim/verify Google Business Profile only if real eligible business-location details and owner authority exist. Follow Bing Places/Profile guidelines. Collect genuine customer feedback; never generate fake ratings.
- [ ] Establish consistent NAP identity across authoritative directories and genuine supplier/workshop partnerships. Digital PR and links must be editorial/earned; avoid paid link farms.

## P2 — Analytics with a strict zero-upfront-cost gate
- [x] Consent-first GA4 client tracking code with privacy-regression and Chrome tests exists in a separate **draft PR #2**; it is **not live or collecting actual Orbit traffic**.
- [ ] Verify/create Orbit-specific GA4 property and exact **G-...** web stream Measurement ID. Firebase project existence alone does not imply GA4 enabled.
- [ ] Owner approves privacy text and consent. Enable tags without duplicate GA4/GTM pageviews; event scope includes page view, SKU/detail, category, on-site search (never raw PII), comparisons and contact-draft engagement.
- [ ] Track product-detail static HTML pages with the same real consent gating; the React-only adapter does not yet cover them.
- [ ] Authenticate Admin users with Firebase Google Authentication & strict authorization. Browser-local passcode is not secure central admin identity. Spark provides some free quota for Auth/Firestore; feature eligibility must be checked per actual region and plan.
- [ ] Build a private admin reporting view backed by **authorized** GA4 Data API and Search Console data. Use OAuth/secure server-side API access or reviewed private Looker Studio embed. Do not place GA4 private tokens, credential JSON or customer data in public Vite files. Serverless Functions deployment may require billing/Blaze; stay on Spark unless explicitly approved.
- [ ] Admin KPIs: active/realtime users, sessions, organic traffic, page/section engagement, top SKUs and categories, search result counts, comparison interactions, enquiry drafts vs verified submitted leads, geography/referrer at privacy-safe aggregate levels, indexed URL count and GSC Image Search impressions.
- [ ] Test all events in GA4 DebugView/Tag Assistant, link Search Console to GA4, publish a privacy-safe owner dashboard and verify cross-device access. No invented visitor statistics or “live” placeholder counters.
- [ ] Enquiry `generate_lead` **only** after a trusted backend accepts and persists a real message. On Spark, evaluate a permitted no-cost solution before introducing Cloud Functions billing.

## Operational rules
1. No paid services, advertising spend or Firebase Blaze upgrade without explicit owner approval.
2. No product image artwork retouch, automatic image recompression, packaging deformation or unverified performance claims.
3. No fake reviews, fake offers/pricing, keyword stuffing, doorway pages, fabricated dates, link schemes, ranking guarantees, or automated mass-indexing.
4. GitHub Actions jobs should be bounded, manually/one-time triggered as needed, no frequent schedules or recursive workflows, to avoid unnecessary quota or policy problems.
5. Keep separate **Staged / Build-tested / Production verified / Indexed in Google / Traffic measured** statuses for every milestone.
6. Google indexing, ranking, zero-cost quotas and actual visitor reporting depend on Google systems and account access outside this repo. The website cannot guarantee Google will show a page or image.

## Account access needed (never send passwords or service-account private keys in chat)
- Google Search Console Domain property verified? screenshot of Ownership and Pages/Performance image reports, or safely connect an eligible reporting integration.
- Firebase Project Settings > Your Apps > Web App config: provide the public `projectId`, `appId`, `authDomain`, `messagingSenderId`, `apiKey` as applicable; these values identify the project but **do not replace security rules**. Prefer secure connector if available.
- Authentication > Sign-in method: whether Google sign-in enabled. Firestore Database whether created and region. Never deploy security rules to an unverified project.
- Google Analytics 4 data stream `G-...` and numeric GA4 property ID (if already configured). GA4 Reporting API still requires properly authorized account access.
- Verified admin identity, consent text, email recipient and privacy policy for secure CMS/enquiry delivery.

## Documentation
- https://developers.google.com/search/docs/appearance/google-images
- https://developers.google.com/search/docs/crawling-indexing/sitemaps/image-sitemaps
- https://developers.google.com/search/docs/appearance/structured-data/product
- https://developers.google.com/search/docs/monitor-debug/search-console-start
- https://www.bing.com/webmasters/help/indexnow-0z209wby
- https://firebase.google.com/pricing/
- https://developers.google.com/analytics/devguides/reporting/data/v1/quotas
