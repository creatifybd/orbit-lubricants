# Orbit Lubricants — GA4 Owner Analytics Dashboard (no new paid service)

**Implementation status: staging only.** This document is not proof that GA4 is connected or collecting visitors.

## Architecture
- Public visitor tracking uses `src/lib/analytics.js`: Google Analytics 4 JavaScript tag is **not loaded** unless an Orbit-specific `VITE_GA4_MEASUREMENT_ID=G-...` is configured in the **production build** and the visitor opts in.
- The Admin Analytics section uses Google Identity Services for **read-only OAuth `analytics.readonly`**; Google's Analytics Data API enforces each Google account's GA4 property permissions. A browser-local CMS passcode **does not protect Google Analytics data**. The OAuth token exists only in memory, expires, is never written to storage or URL, and is revoked on disconnect.
- The public Google OAuth Web Client ID and numeric GA4 Property ID may be typed into the Admin UI and persisted to that browser. They are not secrets. **Do not paste OAuth client secrets or service account credentials into the UI.**
- This approach avoids Firebase Cloud Functions/Blaze charges for **read-only owner reporting**; whether an OAuth testing/verification flow is suitable for your users depends on your Google Cloud OAuth configuration. Real authentication/central CMS remains an independent milestone.
- No Google or Facebook/Meta advertising trackers are installed by this feature. No visitor geo coordinates or individual identities are collected by the section tracking.

## Reports (actual Data API; no fabricated numbers)
- Google Analytics realtime active users (last ~30 minutes): `runRealtimeReport(activeUsers)`.
- Selected 7/28/90-day overview: active users, sessions, page views, engaged sessions, engagement rate.
- Top pages by path/views; top product SKUs by `itemId/itemsViewed`; acquisition by `sessionSourceMedium/sessions`; interaction breakdown by `eventName/eventCount`.
- Section-wise views: `section_view` with a **closed-set** `section_id` value, tracked only after visitor opt-in and a genuine viewport intersection. Report via GA4 event-scoped custom dimension `section_id`, which **must** be registered in GA4 Admin to allow the Data API `customEvent:section_id` query.
- `select_item` and `view_item` are recorded separately when a user opens an on-page product modal; the same values should not be interpreted as completed sales or verified leads.
- Search: record result count, **not raw search terms**, to prevent accidental collection of emails/phone numbers from free-form searches.
- Email enquiry: `enquiry_email_prepared` denotes a locally prepared `mailto:` draft. **Do not fire `generate_lead` or claim delivery until a verified server endpoint actually accepts the lead.**
- The 38 static SEO product landing pages **still require consent-aware tracking instrumentation**. This React SPA adapter does not claim their view counts; the reporting API itself will only show whatever events your configured GA4 property actually collected.

## Owner setup steps (all free-tier compatible when eligibility confirmed)
1. Open https://analytics.google.com/ and select/create the **Orbit Lubricants** GA4 property. Record both its **numeric Property ID** and the Web Data Stream's **Measurement ID** (`G-...`). These are different identifiers.
2. In https://console.cloud.google.com/ select the **Orbit** project, not Joytun. Ensure **Google Analytics Data API** is enabled for the same Google Cloud project. Check the OAuth project's plan/quota and privacy requirements.
3. In Google Auth Platform (OAuth), configure an **OAuth Web Application** client ID. Set Authorized JavaScript Origin `https://orbit-lubricants.com`; if you need local development, separately authorize `http://localhost:4173` only as appropriate. No client secret should be used in the SPA.
4. For an external/testing OAuth consent screen, explicitly register your authorized Google account as a test user and review `analytics.readonly` permission. Publishing a broader app may require OAuth app verification. The dashboard does **not** bypass Google property access permissions.
5. Open Orbit Website `/admin/` → **Website Analytics**. Enter the public numeric GA4 Property ID and OAuth Web Client ID. Click **Connect Analytics (Google OAuth)**, consent with the Google account that has at least GA4 Viewer access, then load real reports. If you see 403, verify the API enablement and account/property permissions.
6. Configure Google Web Stream Measurement ID in Orbit's reviewed release environment with `VITE_GA4_MEASUREMENT_ID`. **Do not enable** this until the business owner approves privacy policy and consent language. The release must be rebuilt, QA-tested and published for all browsers.
7. Register the custom dimension **section_id**, scope **Event**, in GA4 Admin → Custom definitions → Create custom dimension. Data takes time to become available; historic events before registration may not be retroactively available in custom reports.
8. Verify real events in GA4 DebugView and Tag Assistant with both permission states: **denied = no Google tracker**, **granted = correct event payload**, **revoked = stop future events**. Check double-counting if a GTM container is added.
9. Later connect Google Search Console via GA4 property settings; use separate GSC authorization to see Image Search impressions, indexing coverage and keyword search performance. A GA4 property alone does not provide crawl/indexing counts.

## Security / reliability constraints
- Never use browser-local CMS passcodes as server admin security. A malicious browser visitor can create their own local passcode, but they cannot read the owner's GA4 data without Google OAuth and GA4 property permissions.
- OAuth bearer access tokens are not embedded in the static app, localStorage, sessionStorage, network URLs, telemetry events or Git history. They are cleared on page navigation/unmount or disconnect. Browser extensions/devtools may still inspect local runtime; this is not an enterprise admin identity system.
- Firebase Spark plan does not automatically support all paid backend features. Never enable Blaze, Cloud Functions or any billing without explicit approval.
- API reporting is limited by standard GA4 quotas and privacy thresholds, and may omit some visits because users decline optional analytics or ad blockers prevent requests. Data is not an exact count of every human visitor.
- No periodic polling/cron; owner refreshes reports explicitly and rate limits are respected.
- Long-term central admin: Firebase Auth Google login with server-enforced editor allowlist/custom claims, Firestore rules and immutable audit history. Requires project Web App configuration, authorized admin account and actual Firebase service setup.
- OAuth client, Firebase project and data owner permissions must be verified before deployment. All test assertions use fake credentials/data and mocked API, not actual user records.

## Evidence
- Privacy event tests and Chrome consent opt-in/out: carried from tested Orbit draft PR #2.
- Admin unit tests use a fake OAuth token and mocked API responses to prove only API-sourced counts render.
- Release code remains branch-only pending actual GA4/OAuth configuration and owner privacy approval.

## Primary docs
- https://developers.google.com/identity/oauth2/web/guides/overview
- https://developers.google.com/analytics/devguides/reporting/data/v1/quotas
- https://developers.google.com/analytics/devguides/reporting/data/v1/realtime-basics
- https://developers.google.com/analytics/devguides/reporting/data/v1/api-schema
- https://firebase.google.com/pricing/
