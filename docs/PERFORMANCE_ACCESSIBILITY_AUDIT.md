# Orbit Mobile Accessibility & Performance Baseline — 2026-11-10

## Evidence / scope
- Baseline run: https://github.com/creatifybd/orbit-lubricants/actions/runs/42771954468
- Live Hostinger blocked Lighthouse's automated Chrome request (HTTP 403), so the **Lighthouse scores below are for a production Vite bundle on an isolated local preview server**, not the real Hosting/CDN network.
- Lighthouse is synthetic lab data, **not field Core Web Vitals**, Search Console rankings or a guarantee of performance across real phones.
- Strict design rule: **do not change original branded product image bytes, package artwork, label, shape, color or geometry**.

| Page | Performance | Accessibility | Best Practices | SEO | Lab LCP |
|---|---:|---:|---:|---:|---:|
| Home / Mobile | 70 | 82 | 96 | 100 | 10.37 s |
| Home / Desktop | 95 | 89 | 100 | 100 | 1.43 s |
| Products / Mobile | 77 | 85 | 96 | 100 | 5.71 s |

## First-pass corrections (branch-only until QA & release)
- Fix mobile menu icon-only close button to include an accessible name.
- Correct footer heading levels and improve contrast of hotline text on Orbit orange.
- Improve contrast for light-background application numbers, category metadata, kicker and catalog count.
- Ensure first visible catalog product image uses eager/high priority without changing the source file. Skip entry fade for that priority image to reduce LCP.
- Keep lower-priority hero slides async and deprioritized while the first visible hero is high-priority.

## What still needs review
- Original product mockups may have excessive transfer sizes at small CSS dimensions; Lighthouse suggested resized responsive images. User policy forbids altering original branded art. Do not auto-recompress, resize or regenerate products. A separately approved thumbnail variant pipeline could be designed later while preserving source files and confirming exact artwork quality.
- Additional render-blocking resources include a Google Fonts stylesheet and CSS. Avoid changing typography or brand presentation without visual diff review; consider font subset loading and preload carefully.
- Home mobile LCP can be affected by dynamically rotating hero headings during a lab run; compare multiple runs rather than concluding one exact root cause.
- Test keyboard order, reduced-motion, screenreader and WCAG AA contrast separately, not just Lighthouse.
- Real Hosting/CDN performance and CrUX/Search Console field data require owner Search Console access or browser-internal Performance tools; local preview scores do not measure them.

## Release validation
- Re-run `npm run build` with original-image file checks.
- Run existing desktop/mobile Chromium functional QA (38-product catalog, compare, search, product detail, email draft).
- Run bounded mobile/desktop Lighthouse again; compare relative improvements and regressions to baseline.
- Only merge compiled release after successful QA; verify deployed marker + live browser behavior. Never report an optimization as live before the marker and browser checks pass.

## Verification and release decision
- Browser and Vite build QA after initial markup fixes: https://github.com/creatifybd/orbit-lubricants/actions/runs/42773003396 — SUCCESS.
- Second lab run: https://github.com/creatifybd/orbit-lubricants/actions/runs/42773652258 — SUCCESS, home/mobile accessibility 95, desktop accessibility 95, products/mobile accessibility 96; desktop score 97, products mobile performance 78, home mobile performance 50. These mobile performance lab scores **vary** because deferred web fonts can cause CLS and hero content changes; do not report the home performance problem as solved.
- Experiments that changed original hero image-loading behavior and slide timing were **reverted** because they did not demonstrate a reliable performance improvement.
- Final accessibility/priority-image candidate: https://github.com/creatifybd/orbit-lubricants/actions/runs/42774089870 — real desktop/mobile browser regression, build integrity, original-brand file comparisons and non-destructive Git-root staging passed.
- The current release addresses named button, heading hierarchy, text contrast and first catalog image loading priority **only**. It does not certify full WCAG conformance or a mobile Core Web Vitals pass.
- **Open optimization item:** fix late web font swaps (CLS) with measured, visually reviewed font delivery, without changing approved typography or original product artwork. Verify on real mobile devices and with field data/CrUX if available.
