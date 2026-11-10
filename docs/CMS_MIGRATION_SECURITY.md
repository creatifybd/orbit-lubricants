# Orbit Lubricants — Secure Central CMS and Lead Delivery Plan

**Current state (2026-11-10):** React storefront and localStorage demo CMS exist. A customer submission previously remained in the submitting browser; the draft branch now provides a transparent email-draft fallback. Nothing here is deployed to Firebase yet.

## Required owner-provided facts (no credentials in chat)
1. The **exact Orbit Firebase project ID** and confirmation it belongs to Orbit, not Joytun or CreatifyBD.
2. One or more Google accounts authorised as Orbit administrators. We need their email identities approved in Firebase, not passwords.
3. Existing Auth providers, Firestore database location, Storage bucket and billing tier, if already configured.
4. Approved email delivery provider/domain (e.g. verified `info@orbit-lubricants.com` sender or alternate service).
5. Approved privacy notice, retention policy and enquiry recipients. Avoid putting customer PII in public GitHub, localStorage or analytics events.

## Core architecture
- **Static public catalog:** versioned, crawlable HTML remains the default public fallback even if Firebase is slow/unavailable.
- **Firebase Authentication:** Google sign-in, restrict owners/editors through **server-managed custom claims** or a vetted allowlist enforced by Security Rules. An email displayed in a browser is not authority; checking UI alone is not security.
- **Firestore:** publicSite/content, products/{id}, categories/{id}, settings/public, inquiries/{id}. Publish only approved data; require published=true for public product/category reads.
- **Storage:** public approved product artwork only. Keep original exact images; store a content hash for review and refuse unintended transformations. File upload UI must validate image dimensions and server MIME/size.
- **Enquiry delivery:** a trusted server endpoint validates fields and payload size, enforces abuse controls (App Check + rate limiting + spam screening), stores the enquiry server-side and sends notification. Only a successful server acknowledgement may produce "Inquiry received" or a GA4 generate_lead event. Failed submissions show a retry or manual email alternative.
- **Administrative changes:** show saved/published state from server acknowledgements. Keep audit entries (actor uid, timestamp, operation, version), editor permissions, validation, version conflicts, rollback snapshots and backup.
- **Monitoring:** use real backend health metrics and error logs, not static "Optimal" labels; define retention and alerts with the owner.

## Staged security rule files
- `deployment/firebase/firestore.rules`: default deny; only custom-claim Orbit admins may write public content; customer enquiries are server-write only; admin read.
- `deployment/firebase/storage.rules`: only approved product media path is publicly readable; claims restrict writes and max size/file MIME.
- These are **proposed starting rules, not production-tested rules**. They must be validated in the Firebase Emulator with positive and negative tests and checked against real document schema before deploying.

## Security acceptance tests
- Unauthenticated users can read only published product/category data.
- Unauthenticated visitors cannot mutate any CMS document, read enquiries, list internal settings or upload Storage files.
- Normal Google-signed-in users without Orbit admin custom claim cannot edit content.
- Only verified admin claims can publish and upload approved images.
- Backend refuses malformed, oversized, repeated or unverified enquiries; App Check enforcement is enabled only after measuring legitimate traffic and confirming no customer disruption.
- No private keys/tokens/SMTP passwords are bundled into Vite files, repositories, visible admin pages or public JSON.
- Separate staging and production Firebase projects, with deployment explicitly pinned to the Orbit project ID to protect unrelated domains.
- Backup and restores tested on a nonproduction project; rules unit tests and server/lead end-to-end tests pass before turning off the email fallback.

## Analytics and privacy acceptance
- Verify GA4 property and GTM container belong to the Orbit domain.
- Set analytics and advertising consent defaults according to approved privacy policy, use Consent Mode v2 where applicable; do not load nonessential trackers prematurely.
- Recommended PII-safe events: `page_view`, `view_item`, `select_item`, `view_item_list`, `view_search_results`, `product_compare`, `enquiry_email_prepared`.
- Emit `generate_lead` **only when a real server endpoint persists the lead**. Never send names, phone numbers, emails, free-text contact messages, access tokens, or raw search terms containing personal data to GA4.
- Verify event collection via Tag Assistant / GA4 DebugView and internal-vs-external traffic checks. Do not claim analytics deployed based on adding a `dataLayer` call alone.
- Google Search Console property, domain verification and sitemap submission require owner account access.

## Useful official references
- https://firebase.google.com/docs/firestore/security/rules-conditions
- https://firebase.google.com/docs/app-check/web/recaptcha-provider
- https://developers.google.com/tag-platform/security/guides/consent

## Current blocking items
- No verified Orbit Firebase project, owner sign-in or approved backend email provider has been provided.
- Hostinger document root and FTP mapping have not been confirmed.
- These conditions block real cross-device CMS persistence, secure admin authentication, central lead delivery and live analytics verification, but not staging frontend builds.
