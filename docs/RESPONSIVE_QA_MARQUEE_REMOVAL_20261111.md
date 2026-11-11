# Orbit Website — Responsive QA & Product Marquee Removal (11 November 2026)

## Requested changes

- Completely remove the two-row animated **Product Marquee** section from the Orbit homepage.
- Ensure layout adapts to mobile, tablet, laptop, desktop and mobile-landscape viewports.
- Never alter approved original Orbit pack artwork or unrelated SEO/analytics infrastructure.

## Implementation

- `src/pages/Home.jsx`: remove the `ProductMarquee` component import and the entire homepage section. Keep **Featured Products** (six cards), **Choose by application**, corporate showcases and all other homepage sections.
- `src/index.css`: remove the no-longer-used marquee-specific styles/animations (including reverse track and keyframes). Do **not** add blanket `overflow-x:hidden` to conceal layout bugs.
- `src/components/Navbar.jsx`: change the desktop-navigation breakpoint from **1120px to 1240px** because real Chrome responsive testing found the "Get a Quote" CTA extended 21px beyond the viewport at exactly 1120px. Tablets and compact laptops now use the accessible navigation drawer, while larger screens retain full desktop navigation.
- `scripts/qa-browser.mjs`: update the pre-existing browser regression to assert the homepage marquee is absent instead of expecting it.
- `scripts/tests/responsive-all-devices.browser.mjs`: add a 15-size × nine-route screen-size matrix and check actual document width, navigation behavior, 38 products, image gallery, small-screen comparison, no JS errors and no marquee.

## Independent QA — PASS

Source: https://github.com/creatifybd/orbit-lubricants/actions/runs/42989392582

- Vite production build and initial SEO/source integrity checks passed.
- All privacy/analytics and Search Console API unit tests passed.
- Existing desktop/mobile browser UI QA passed: header/hero, 38-product catalog, search, two-product comparison, safe enquiry preparation, navigation and 38-image gallery.
- Existing original image SEO browser checks passed: 53 sitemap pages, 114 references to 38 original pack files.
- Expanded Chrome test passed **136 responsive checks** across **15 viewport sizes and nine major routes**, plus navigation/compare flows. No horizontal overflow or JavaScript exceptions were reported.
- Tested widths/heights: **320×680, 360×740, 375×812, 390×844, 414×896, 480×860, 768×1024, 1024×768, 812×375 landscape, 1120×800, 1239×800, 1240×800, 1280×800, 1440×900, 1920×1080**.
- Verified after the 1240px navigation fix that no responsive error remained at the exact new breakpoint.
- Stage diff contains **no deleted files and no modified branded product image files**.
- Screenshots and machine-readable viewport measurements are saved in the short-lived `orbit-mobile-responsive-audit` GitHub Actions artifact.

## Release status

- [x] Implementation and staged production build prepared.
- [x] All 136 expanded viewport checks passed.
- [ ] Deploy by reviewed merge of the branch.
- [ ] Independently verify Hostinger actual live `index.html` and compiled JS fingerprint, absence of marquee UI markup/bundle references, source release marker, and existing SEO integrity.
- [ ] Visual device-specific signoff on physical iOS Safari and Android Chrome **not** performed; test evidence is Chrome emulation across responsive widths, not a guarantee of every device/browser/OS combination.

## Safety

- Original product images, SVG/logo files, packaging labels and source WebP bytes were not modified.
- Existing `/product-gallery/`, 38 product detail pages, 9 application pages, 53 sitemap URLs, Search Console and GA4 consent behavior remained unchanged.
- No paid service, continuous GitHub Actions schedule, Firebase billing change, DNS change or Google indexing request was made.
