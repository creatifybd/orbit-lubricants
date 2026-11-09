# Orbit Lubricants — Enterprise Website Recovery & Upgrade Checklist

Audit date: 2026-11-10 (Asia/Dhaka).
Production: https://orbit-lubricants.com/
Repository: https://github.com/creatifybd/orbit-lubricants
Feature branch: orbit-enterprise-website-upgrade

## Rules
- Preserve all approved Orbit logos, labels, packaging geometry, fonts and product mockup pixels. Never generate replacement branded pack art.
- Specifications must be substantiated by pack labels, official technical data sheets, or manufacturer approval documents. Never invent API/OEM certification, viscosity approvals, prices, warranties or "recommended for" claims.
- Do not call work complete until deployed, tested and monitored on the actual production domain.
- Do not store service-account JSON, private keys, FTP credentials, Firebase admin secrets or customer PII in this repository.
- Changes requiring account access must be verified through proper signed-in administration, not guessed.

## P0: Production recovery — BLOCKED by external access
- [x] Identify repo and current production difference: 38 product records in main source; live website still shows 14.
- [x] Verify all 38 source product image files exist in public/products (filenames).
- [x] Diagnose previous CI false-positive: checked generic production assets, not exact build commit.
- [x] Add live deployment.json fingerprint check to .github/workflows/deploy.yml on main.
- [x] Run minimal GitHub Actions smoke workflow on main.
- [ ] Investigate why both deployment and smoke runs fail before any jobs start (GitHub Actions account/repo policy, billing or platform support). This is independent of the Vite app build.
- [ ] Verify Hostinger > Websites > orbit-lubricants.com > website document root.
- [ ] Compare document root with secret FTP_SERVER_DIR and FTP account mapping. DO NOT expose secret values.
- [ ] Check Hostinger Git deployment vs FTPS deployment: ensure only one canonical source of truth.
- [ ] Deploy latest production bundle and verify exact marker SHA, catalog count, assets and browser rendering on both www and apex domains.
- [ ] Make a recoverable hosting backup, document rollback and validate it before server-side mutations.

## P1: Reliable backend and account security
- [ ] Choose/verify dedicated Orbit Firebase project with owner access.
- [ ] Replace localStorage-only owner passcodes with Firebase Auth + verified admin allowlist or custom claims.
- [ ] Move product/CMS/site settings into secured Firestore, image assets into approved Storage bucket.
- [ ] Write and test least-privilege Firestore and Storage rules; enable backups, activity/audit logging.
- [ ] Implement centrally delivered enquiries using protected backend and email alert; spam controls/rate limits; test end-to-end.
- [x] Replace misleading local-only inquiry success with clearly labeled email-draft fallback. A real backend delivery confirmation remains pending.
- [ ] Keep the site's public content available when authentication is unavailable.

## P1: Catalog, product UX and trust
- [x] Catalog source contains 38 unique records and 38 matching product artwork paths.
- [ ] Review every label against original Orbit assets and approval sources, especially API grades and fluid classifications.
- [ ] Implement product variant associations, category filtering, sorting, comparison and useful search.
- [ ] Offer application-based browsing; never issue make/model-specific oil recommendations without verified OEM compatibility database.
- [ ] Provide usable, accessible product detail pages, enquiry CTAs, digital TDS and SDS only where genuine documents exist.
- [ ] Add verified distributors/locations only when real addresses and business details are supplied.

## P1: Premium design and performance
- [ ] Differentiate Orbit from household-cleaning site design: automotive/industrial visual storytelling, application-led navigation, richer tech/spec comparisons.
- [ ] Confirm original-asset hero, application sections, two-direction product marquee and Our Story slideshow against approved briefs.
- [ ] Review desktop, tablet, small-screen mobile, reduced-motion, keyboard navigation, form validation and contrast.
- [ ] Check Core Web Vitals, image sizing/format, lazy loading, JavaScript cost, caching and reliable error states.
- [ ] Verify no overflow, missing artwork, duplicated labels, distorted container shapes or fake-looking visuals.

## P1: Search visibility — FEATURE BRANCH STARTED, NOT LIVE
- [x] Source code for 38 individual static product pages, 43 sitemap URLs and robots.txt.
- [x] B2B Product and BreadcrumbList structured-data templates without fabricated Offer/pricing fields.
- [x] Crawlable links from product cards to dedicated pages, including original artwork.
- [x] Initial Organization/WebSite structured data, canonical URL and OG/Twitter metadata.
- [x] In-memory logic simulation: 38 generated product pages, 43 sitemap entries, 0 missing product image paths.
- [ ] Validate full Vite build, deployment output, HTTP status codes, sitemaps, schema using Rich Results Test and crawler (generator/validator in-memory simulation passed only).
- [x] Implement canonical-path client navigation, direct /products/ route handling and legacy hash compatibility; nine route cases passed in-memory tests. Full deployed URL/refresh QA pending.
- [ ] Connect Search Console; submit sitemap and inspect indexed pages, image indexing, canonical selection and coverage.
- [ ] Publish technically accurate lubrication education/FAQs with citations and editorial review; avoid keyword stuffing.

## P2: Analytics & conversion intelligence
- [ ] Verify Orbit GA4 property and GTM container and confirm owner/editor access.
- [ ] Implement consent-aware tags and document privacy disclosures (local regulatory review).
- [ ] Instrument page_view, view_item, select_item, site_search, product_engagement, qualified_enquiry.
- [ ] Fire generate_lead only after backend successfully accepts and persists the enquiry.
- [ ] Configure UTM source tracking, goal funnels, Search Console link, internal traffic exclusion.
- [ ] Build Looker Studio / GA4 reporting for qualified leads, catalog engagement, organic growth, Core Web Vitals and indexed pages.
- [ ] Verify analytics in DebugView/Tag Assistant, not only by viewing dashboard charts.

## P2: Release governance & QA
- [x] Add source-controlled post-build QA for 38 product pages, original image references, 43 sitemap routes, schema and canonical URLs; in-memory simulation passed. Full Vite/CI runner test is blocked.
- [ ] Add deployed link checking, browser smoke tests and backup checks.
- [ ] Review all site copy for human, professional Bangla/English expression as applicable.
- [ ] Establish acceptance matrix: critical forms deliver, editor actions persist cross-device, all approved SKUs display, no broken links.
- [ ] Verify production after deployment with version marker, browser interactions and rollback readiness.
- [ ] Obtain owner final sign-off before declaring website fully complete.

## Required owner access (never send passwords/keys in chat)
1. Hostinger hPanel account sign-in, or sanitized screenshots of the domain website root, FTP account mapping and active deployment configuration.
2. GitHub Actions failure details and Settings > Actions > General; billing/usage restrictions, if any.
3. Google Cloud/Firebase Orbit project owner permissions or safe public web-app configuration; approve admin emails through secure channels.
4. Google Search Console verified domain property and GA4/GTM account (IDs can be supplied without secrets).
5. Original Orbit product master assets and evidence for unverified specs, product documentation, contact details and any approved content.
