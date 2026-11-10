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
- [x] Investigate pre-job GitHub Actions failures: the smoke test succeeded on re-run (attempt 2) on Nov 10. Earlier incident matches GitHub service disruption; no evidence of account suspension. Run: https://github.com/creatifybd/orbit-lubricants/actions/runs/42674052980.
- [x] Freeze automatic main-branch FTPS release: main/.github/workflows/deploy.yml now supports workflow_dispatch only, pending verified Orbit directory/backup (commit 29a8702).
- [x] Inspect Hostinger's Orbit-specific File Manager: public_html contains index.html, assets, and separately dist plus .git/.github/src and project files; high confidence public_html is the domain document root. Screenshot received on 2026-11-10.
- [ ] Confirm absolute /home/.../public_html folder path and matching FTP_SERVER_DIR in FTP Accounts (do not disclose credentials).
- [x] Read-only staging-to-production diagnostic confirms live JS asset hash differs and /deployment.json returns 404 (run 42758542859); the new release has not reached production.
- [ ] Compare document root with secret FTP_SERVER_DIR and FTP account mapping. DO NOT expose secret values.
- [ ] Check Hostinger Git deployment vs FTPS deployment: ensure only one canonical source of truth.
- [ ] Deploy latest production bundle and verify exact marker SHA, catalog count, assets and browser rendering on both www and apex domains.
- [ ] Make a recoverable hosting backup, document rollback and validate it before server-side mutations.

## P1: Reliable backend and account security
- [ ] Choose/verify dedicated Orbit Firebase project with owner access.
- [ ] Replace localStorage-only owner passcodes with Firebase Auth + verified admin allowlist or custom claims.
- [ ] Move product/CMS/site settings into secured Firestore, image assets into approved Storage bucket.
- [x] Draft default-deny Firestore and Storage security rules in deployment/firebase/ (not deployed or emulator-tested).
- [ ] Test rules with Firebase Emulator; deploy to verified Orbit project, enable backups and audit logging.
- [ ] Implement centrally delivered enquiries using protected backend and email alert; spam controls/rate limits; test end-to-end.
- [x] Replace misleading local-only inquiry success with clearly labeled email-draft fallback. A real backend delivery confirmation remains pending.
- [x] Public site remains functional without backend credentials, using catalog data in the build. Backend content publishing will be added after Firebase connection.

## P1: Catalog, product UX and trust
- [x] Catalog source contains 38 unique records and 38 matching product artwork paths.
- [ ] Review every label against original Orbit assets and approval sources, especially API grades and fluid classifications.
- [x] Build catalog search/category filters, name/grade/pack sorting, and up to three original-label specification comparisons on feature branch; full Vite compile passed.
- [ ] Implement reviewed variant-group connections (only after confirming product variant relationships).
- [ ] Offer application-based browsing; never issue make/model-specific oil recommendations without verified OEM compatibility database.
- [ ] Provide usable, accessible product detail pages, enquiry CTAs, digital TDS and SDS only where genuine documents exist.
- [ ] Add verified distributors/locations only when real addresses and business details are supplied.

## P1: Premium design and performance
- [ ] Differentiate Orbit from household-cleaning site design: automotive/industrial visual storytelling, application-led navigation, richer tech/spec comparisons.
- [x] Add two-direction, 2-row, hover-pausing product marquee using unchanged original product file URLs, with reduced-motion support; full Vite compile passed.
- [ ] Review hero visuals, application section and separate Our Story slideshow against approved briefs on desktop and mobile.
- [ ] Review desktop, tablet, small-screen mobile, reduced-motion, keyboard navigation, form validation and contrast.
- [ ] Check Core Web Vitals, image sizing/format, lazy loading, JavaScript cost, caching and reliable error states.
- [ ] Verify no overflow, missing artwork, duplicated labels, distorted container shapes or fake-looking visuals.

## P1: Search visibility — FEATURE BRANCH STARTED, NOT LIVE
- [x] Source code for 38 individual static product pages, 43 sitemap URLs and robots.txt.
- [x] B2B Product and BreadcrumbList structured-data templates without fabricated Offer/pricing fields.
- [x] Crawlable links from product cards to dedicated pages, including original artwork.
- [x] Initial Organization/WebSite structured data, canonical URL and OG/Twitter metadata.
- [x] In-memory logic simulation: 38 generated product pages, 43 sitemap entries, 0 missing product image paths.
- [x] Real GitHub-hosted Vite production build, 38 SEO pages, 43 sitemap URLs, static image/path checks and HTTP smoke tests of homepage/catalog/product/contact/sitemap/robots/image PASSED: https://github.com/creatifybd/orbit-lubricants/actions/runs/42757832132.
- [ ] Test schema in Google Rich Results Test and live Google Search Console, crawl deployed links, inspect response headers, robots, 404 and www redirects.
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
- [x] Real GitHub Actions production build passes source-controlled SEO checks and local HTTP route smoke tests. Hostinger production end-to-end QA remains pending.
- [x] Add local staging HTTP route smoke tests and generated build artifact with seven-day retention. No live deployment triggered.
- [ ] Add deployed link checking, browser interaction tests and recoverable hosting backup checks.
- [x] Remove or clarify several unsupported homepage QA/certification and local CMS live-health assertions; full copy review still pending.
- [ ] Complete human editorial review of all pages in approved language(s).
- [ ] Establish acceptance matrix: critical forms deliver, editor actions persist cross-device, all approved SKUs display, no broken links.
- [ ] Verify production after deployment with version marker, browser interactions and rollback readiness.
- [ ] Obtain owner final sign-off before declaring website fully complete.


## Additional verified staging improvements (2026-11-10)
- [x] Add conservative Hostinger deployment and rollback playbook at docs/HOSTINGER_SAFE_DEPLOYMENT.md.
- [x] Add secured Firebase CMS/enquiry integration plan at docs/CMS_MIGRATION_SECURITY.md (planning and rule files only, no live backend).
- [x] React navigation now exposes real `href` links in the top-level navbar for crawlers and standard browser actions; SPA click navigation retained.
- [x] SPA route changes update document title, description, canonical URL and Open Graph metadata; browser-local CMS settings no longer flatten all route titles.
- [x] Contact form shows an honest, copyable email draft instead of claiming a localStorage-only enquiry reached the team.
- [x] Admin pages identify the current CMS as browser-only preview, not secure centralized administration or live performance monitoring.
- [x] Conservative X-Content-Type-Options, Referrer-Policy, X-Frame-Options and Permissions-Policy headers added to both FTP and root-hosting .htaccess variants; not yet verified on Hostinger.
- [x] Safe staging build packaged as seven-day GitHub artifact, with no FTP push: https://github.com/creatifybd/orbit-lubricants/actions/runs/42757832132.
- [x] Re-run staging production build and local HTTP tests after marquee, compare, navigation, admin and security-header edits; passed: https://github.com/creatifybd/orbit-lubricants/actions/runs/42758542859.
- [ ] Make final pre-release approval gate: production host mapping, recoverable backup, security audit, original-art validation, product info approval and working backend.


## Urgent hosting source-exposure risk (2026-11-10)
- [x] Hostinger Orbit-specific `public_html` screenshot shows `.git`, `.github`, `src`, `hosting`, `public`, `dist`, `package.json`, `package-lock.json`, `index.source.html` and `Selected Designs.zip` beside the production `index.html` / `assets`. Repository deployment to the web root is strongly suspected but not proven; investigate Hostinger Deployments/Git auto-deploy.
- [x] Locate Hostinger Files > Backups > Restore and download; a files backup from 2026-11-08 22:06 is available (owner screenshot 2026-11-10).
- [ ] Obtain and verify a current Orbit-only backup reflecting the Nov 10 public_html state before touching production; an older Nov 8 snapshot alone does not meet pre-deployment rollback requirements. Do not click Restore.
- [ ] Confirm whether `/.git/HEAD`, `/package.json` and any project archive are externally accessible (403 or 404 expected); no proof of public exposure yet. If accessible, block at server immediately and inspect logs/rotate affected secrets.
- [x] Add deny rules for .git/.github, development source and archives to staging Apache .htaccess variants; **not yet live**. Review and deploy only after backup and root verification.
- [ ] Move all repository source, archives and build infrastructure OUTSIDE public_html in a controlled post-backup release. The public document root should contain compiled `dist/` contents only, not a Git checkout.
- [ ] Inspect Hostinger Deployments to check whether an additional automatic Git deploy wrote the full repo to public_html.

## Required owner access (never send passwords/keys in chat)
1. Hostinger hPanel account sign-in, or sanitized screenshots of the domain website root, FTP account mapping and active deployment configuration.
2. GitHub Actions failure details and Settings > Actions > General; billing/usage restrictions, if any.
3. Google Cloud/Firebase Orbit project owner permissions or safe public web-app configuration; approve admin emails through secure channels.
4. Google Search Console verified domain property and GA4/GTM account (IDs can be supplied without secrets).
5. Original Orbit product master assets and evidence for unverified specs, product documentation, contact details and any approved content.
