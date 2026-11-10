# Orbit: Consent-Aware Analytics on All Static SEO Landing Pages

**Scope:** 38 individual product pages + 9 application category pages served as standalone static HTML. **This implementation is disabled in production until an Orbit-specific GA4 Measurement ID is approved and configured.**

## Why this is needed

The main React site uses `src/lib/analytics.js`. Search engines and visitors can also open `/products/:sku/` and `/applications/:category/` directly. Those landing pages are separate HTML and do not mount the React app. Without a dedicated adapter, product and category page visits were outside the visitor-event tracking implementation.

## Implementation

- `scripts/static-analytics-client.template.js`: same-origin, first-party consent UI with the exact consent preference key used by the React site (`orbit_analytics_consent_v1`).
- During `npm run build`, `scripts/build-seo.mjs` embeds a validated or empty `VITE_GA4_MEASUREMENT_ID` into a **content-hashed** static script at `/assets/orbit-static-analytics-<hash>.js`; no secret credentials are used.
- The 47 standalone pages receive only a deferred first-party script reference and restricted identity attributes written from the reviewed local product catalog.
- No valid owner-provided ID: the first-party adapter returns immediately; **no Google tag download, no consent banner, no tracking**.
- Valid ID but visitor consent unset/denied: a small consent dialog and footer preference control are displayed; **no Google tag download or events before opt-in**.
- After opt-in: issue consent defaults, update analytics_storage to granted, load `gtag.js` exactly once, then manually send `page_view` followed by the relevant item event. Automatic pageviews are disabled to avoid double counting.
- On product detail: GA4 recommended `view_item` with only the exact reviewed SKU and category slug.
- On category hub: GA4 recommended `view_item_list` with only the reviewed category slug and its product IDs; capped at 30 and deduplicated.
- On revocation: `analytics_storage` is changed back to denied, no further page events are dispatched; on later standalone or React navigation, the shared denied preference prevents tags from loading.

## Privacy guarantees and limits

- No names, addresses, enquiry messages, phones, emails, free-text searches, product prices, fake reviews or revenue estimates are transmitted by the adapter.
- This is basic Google Consent Mode: Google tagging **does not load before consent**. Changing consent after tag load cannot retroactively remove an already loaded script or previously collected data; it suppresses future event sends.
- Denial works even when localStorage is blocked; opt-in cannot proceed unless consent can be stored. Visitors can reopen preferences from the SEO page footer.
- This is technical functionality only. The owner should approve final privacy notice and consent copy before enabling live measurement.
- Browser extensions/ad blockers, denied consent, browser settings and GA4 privacy thresholds can reduce observed visits. The reporting dashboard will not represent literally every human visitor.

## Verification

One-time isolated CI tests:
1. `npm run test:analytics`: event naming/PII and GA4 Owner API regressions.
2. Build with **no Measurement ID**, run desktop/mobile browser regressions and test product/category pages have no Google requests/banner.
3. Build with a **fake test Measurement ID** (`G-TEST123456`) only inside GitHub runner; intercept Google network requests and assert zero before/after refusal, correct consent updates, item and list events, proper cross-page storage and revocation.
4. Rebuild again with **no Measurement ID**; guard ensures the fake test stream is absent from the staged release, and that no original product image is overwritten/deleted.
5. After controlled Git-root merge, check release marker, exact hashed JS and all 47 landing-page script tags on production.

## Owner-only steps before *actual* GA4 activation

- Verify the separate **Orbit** GA4 Web Data Stream and obtain the publicly shareable `G-...` Measurement ID; don't substitute numeric Property ID or OAuth Client ID.
- Approve privacy text. Rebuild the published frontend with `VITE_GA4_MEASUREMENT_ID` set **only after approval**.
- Verify Tag Assistant / GA4 DebugView: granted product `view_item`, category `view_item_list`, and one `page_view`; denied = no calls; revoked = future events denied.
- Confirm numeric GA4 Property ID + OAuth Web Client ID and Admin dashboard permission for the Google account, which remain independent from this visitor script.
- Verify actual realtime analytics with one opted-in test visitor; never count this feature as fully live before that.

## Primary references
- https://developers.google.com/tag-platform/security/guides/consent?consentmode=basic
- https://developers.google.com/analytics/devguides/collection/ga4/ecommerce
- https://developers.google.com/analytics/devguides/collection/ga4/views
