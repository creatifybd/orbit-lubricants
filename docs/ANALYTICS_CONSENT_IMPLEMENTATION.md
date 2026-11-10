# Orbit Lubricants — GA4 Consent & Measurement Foundation

**Status:** Code implemented and tested on a feature branch. **Not deployed or connected to a verified Google Analytics property.**

## Integration status and deployment gate
- This app loads no Google Analytics tag unless `VITE_GA4_MEASUREMENT_ID` is a valid `G-...` ID **and** the visitor explicitly opts into analytics.
- Missing/invalid ID: no analytics script, no cookie prompt, no data sent. This is the production default until the owner provides a verified Orbit-specific GA4 measurement ID.
- The site does **not** install GTM, Google Ads tags, remarketing scripts or a server-side tracking relay. Add GTM as a reviewed alternative later, not alongside direct GA4 in a way that double-counts page views.
- If the visitor denies analytics, no tracking library loads or calls are made. If they grant permission, consent mode v2 is set to `analytics_storage=granted`, while `ad_storage`, `ad_user_data`, `ad_personalization` remain denied. Revoking consent updates `analytics_storage=denied` and suppresses later events.
- The footer provides a way to reopen preferences. The UI only appears when a valid GA4 ID has actually been configured.
- Security note: GA4 ID is public configuration, **not** a secret. Do not place API keys for a private backend, service-account JSON or customer PII in a `VITE_` variable.

## What gets measured (only with opt-in and a configured property)

| Event | Safe fields | Trigger |
|---|---|---|
| `page_view` | fixed public page path, fixed page title | React route change or first consent |
| `view_item` | existing catalog slug and category slug | opening a product specification modal |
| `view_search_results` | integer result_count | debounced product search |
| `product_compare` | integer count 0–3 | product selection for comparison |
| `enquiry_email_prepared` | closed-set enquiry category | local email draft generated (not sent) |

No names, email addresses, telephone numbers, message bodies, raw search terms, UTM query parameters, private admin paths or arbitrary user IDs are allowed into the event payload.

`generate_lead` is **deliberately forbidden** until a server-side verified enquiry endpoint actually persists an enquiry. That backend remains an independent milestone.

## Known coverage gaps
- SEO product-detail landing pages are static HTML. They currently have no GA4 integration or consent UI; their actual reads are **not** tracked by this React-only adapter. Extend carefully with a shared, reviewed static-page analytics adapter or convert to a server-rendered route after GA4/consent approval.
- No Google Analytics DebugView, Search Console connection, GTM container, consent policy legal review, event attribution report, cross-device identity, dashboards or server-side conversions have been confirmed.
- No automatic personal-data masking can promise to filter every custom event introduced by future developers. All new events must use the strict event whitelist in `src/lib/analytics.js` and require tests.

## How the owner connects Orbit GA4
1. Sign in to analytics.google.com; confirm the Property's domain is `orbit-lubricants.com` and that you own/manage it.
2. Go to **Admin → Data streams → Web → Measurement ID**. It looks like `G-XXXXXXXXXX`; it is fine to share this ID (it is not a password).
3. Configure the build-time environment variable `VITE_GA4_MEASUREMENT_ID` to that ID in the **staging GitHub Actions build environment**, not in public credentials.
4. Re-run production build and tests, review privacy text with the responsible business owner, inspect Tag Assistant and GA4 DebugView for actual collected events, and verify denied-consent behavior before release.
5. Deploy only the reviewed compiled files via Orbit's controlled Git-hosting release process, then verify the exact release marker and no double-counted page_view.

## Automated verification
- `npm run test:analytics` — PII and unsupported-event stripping, consent defaults, no bogus leads.
- `npm run build` — real Vite/SEO compile and catalog QA.
- `scripts/tests/consent.browser.mjs` — real Chrome with a **fake test GA4 ID** and blocked Google network route: no Google requests before consent, denied state sticks across reload, opt-in establishes v2 consent, opt-out sends a denied update.
- See GitHub Actions **Orbit analytics and privacy regression QA** for the evidence of each check.

## Official documentation
- https://developers.google.com/tag-platform/security/guides/consent
- https://developers.google.com/analytics/devguides/collection/ga4/events
- https://support.google.com/analytics/answer/9304153
