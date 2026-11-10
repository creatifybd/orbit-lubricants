# Orbit Lubricants — Google Search Console Owner Reports (No Paid Backend)

**Status (2026-11-10):** Search Performance UI shipped and its live JavaScript module verified in the Orbit production bundle. The owner verified `sc-domain:orbit-lubricants.com` in Search Console using DNS TXT. Actual Google OAuth API connection, owner account reporting and real index/image visibility remain unverified. Do not claim real Google metrics without authorized evidence.

## Purpose

In the Orbit Admin Dashboard, **Search Performance** gives the owner permission-based reports from Google Search Console:
- Separate **Web Search** and **Image Search** views
- Aggregate clicks, impressions, CTR and average result position
- Top queries and top landing-page URLs per search type
- Last 28 or 90 **finalized** days, ending approximately 3 days before today in Google's Pacific Time zone
- Reports are generated only when an authorized owner clicks Connect or Refresh; no background API polling, no fake numbers

Image Search queries/landing pages indicate appearance in Google's image-results surface; they do **not** prove which individual packaging image files were indexed. Actual indexing/crawling status must be checked using Search Console Page Indexing / URL Inspection.

## Technology and security

- Frontend requests `https://www.googleapis.com/webmasters/v3/sites/{siteUrl}/searchAnalytics/query` with `type: "web"` or `type: "image"`, following Google's official Search Analytics API specification.
- OAuth scope: `https://www.googleapis.com/auth/webmasters.readonly`, via Google Identity Services and a public **OAuth Web Application Client ID**.
- Allowed property identifiers are restricted to Orbit only: `sc-domain:orbit-lubricants.com` and `https://orbit-lubricants.com/`.
- The Google OAuth bearer token exists **only in memory**. It is not stored in localStorage/sessionStorage/URL or checked into Git. The browser stores only the public OAuth Client ID and selected Orbit property.
- Google Search Console enforces its own per-property user permissions. The existing browser-local CMS passcode is **not central admin authentication** and cannot substitute for Google OAuth.
- The Google Search Console API is read-only in this integration; the code neither submits sitemap nor performs ownership verification automatically.
- No Firebase paid tier or Cloud Functions required for this read-only, manually refreshed reporting approach. Standard API quotas and Google OAuth test-user limits still apply.

## Owner setup

1. **Completed:** the owner verified the Search Console Domain property `orbit-lubricants.com` on 2026-11-10. Continue using that existing property; don't create duplicates.
2. **Completed:** a new Hostinger DNS TXT record verified ownership. Preserve the existing verification TXT record; do not modify unrelated SPF, MX or DNS entries.
3. Open https://console.cloud.google.com and select the **Orbit** Google Cloud project. Enable **Search Console API** (not a new paid service).
4. In Google Auth Platform, configure one **OAuth Web Application Client ID** with Authorized JavaScript Origin `https://orbit-lubricants.com`. If the application is in Testing mode, ensure the intended Google accounts are allowed test users. The same public OAuth Client ID may be reused for GA4 read-only reporting if its scopes and owner permissions are properly approved.
5. Open `https://orbit-lubricants.com/admin/` → **Search Performance**. Enter the public OAuth Web Client ID; choose **Domain** or **URL-prefix** property to match your verified Search Console property. Click Save, then Connect Search Console.
6. Authorize the Google account that has access to the Orbit property. With proper permissions, report rows appear when Google has processed data. If an error says 403/404, check that the exact property is verified and Search Console API enabled.
7. **Completed and expanded:** the owner submitted `https://orbit-lubricants.com/sitemap.xml` with a successful GSC read on 2026-11-10. The newer production build exposes **53 page URLs**, **114 sitemap image references to 38 DISTINCT original pack images**, and a new `/product-gallery/` with all 38 images. Monitor when Search Console refreshes its discovered-URL count; no repeated submission is needed and submission does **not** mean Google indexed these pages or images.
8. For initial indexing diagnosis, inspect `/products/nova-hd40-1l/`, `/applications/motorcycle/`, and several additional URLs in Search Console URL Inspection, plus Page Indexing reports.
9. In **Performance**, switch Search type to **Image** to confirm that actual image-related impressions are appearing. The Admin Search Performance tab reads the corresponding Image Search API data; neither can fabricate traffic that Google has not recorded.

## Reporting limitations

- Google anonymizes or omits some low-volume queries, and API results may contain top rows rather than every search event.
- Data can be delayed; the code uses finalized reports ending about 3 days ago.
- GA4 traffic counts and Search Console clicks differ by design, because their scopes, privacy, consent and attribution rules differ.
- If the owner has not verified a Search Console property, no real Search Console data can be retrieved. We cannot infer Google indexing from a successful XML sitemap or HTTP 200 response.
- For Bing, separately verify/import the property at https://www.bing.com/webmasters/. Avoid fake link-building, bulk index spam or claiming first-page rankings.

## Test evidence

- Unit tests verify property allowlist, read-only OAuth bearer placement, Web/Image type values, Pacific finalized date ranges, API response conversion and partial error handling.
- Chrome test uses a simulated Google account + mocked API to prove that no data appears before connection, separate Web and Image rows render after authorization, and tokens do not persist.
- The staged build has no GA4 Web Measurement ID, so adding this Search Console reporting tab does not trigger visitor tracking.
- Real account connectivity is a separate pending verification step.

## Official Google documentation

- https://developers.google.com/webmaster-tools/v1/searchanalytics/query
- https://developers.google.com/identity/oauth2/web/guides/overview
- https://developers.google.com/search/docs/monitor-debug/search-console-start
