# Orbit Lubricants — Google Product Snippets Diagnostic (2026-11-10)

## Owner-provided Google Search Console evidence

Google Search Console, Domain property `orbit-lubricants.com`, **Live Test** for
`https://orbit-lubricants.com/products/nova-hd40-1l/` displayed:

- URL is available to Google but has issues.
- **Page availability: Page can be indexed.**
- **Product snippets: 2 invalid items detected.**
- **Breadcrumbs: 1 valid item detected.**

The previously captured Google Index view listed the URL as **Discovered — currently not indexed**, with **Last crawl N/A**. A live indexing-eligibility test does not mean the URL is already indexed.

## Root cause found in generated static HTML

Prior `scripts/build-seo.mjs` emitted two independent schema.org Product nodes:

1. An explicit Product JSON-LD object for the pack, with SKU/name/image/category/specifications but no `offers`, `aggregateRating`, or `review`.
2. A second nested Product object in `WebPage.mainEntity`, also without `offers`, `aggregateRating`, or `review`.

Per [Google's Product Snippet documentation](https://developers.google.com/search/docs/appearance/structured-data/product-snippet), a Product snippet requires a real `offers`, `review` or `aggregateRating`. The reviewed Orbit catalog contains no authorized publicly advertised sale price, checkout availability, or independently verifiable customer rating/review. We MUST NOT invent a price (including 0), stock, review/rating or BDT offer, nor present a quotation-only B2B catalog as an online shop.

**Scope of the correction:** represent each pack on its own static landing page as `WebPage` with one honest descriptive `Thing` as the main subject, plus the original pack's `ImageObject`, and existing valid `BreadcrumbList` JSON-LD. No ineligible Product rich-result entities are emitted until Orbit supplies real, verifiable structured commercial data. Product information, brand name, SKU, viscosity, specifications, imagery, textual headings, URLs, internal links and 52-URL / 76-image sitemap remain available in actual HTML.

This eliminates misleading **invalid rich-result candidates** from generated markup; it **does not** create valid Product rich results or guarantee rich snippets. Google will need to recrawl the affected pages; previous Search Console Live Test results may persist until a new test.

## Next steps when factual commercial information becomes available

- Obtain approved per-SKU official price and currency and accurate availability if Orbit genuinely sells directly on site, OR genuine supported third-party review/aggregate-rating content if the page genuinely displays it and Google policies permit it.
- Display the same factual information visibly on the product page.
- Reintroduce **one** `Product` JSON-LD node per distinct SKU with a stable `@id`, not two disjoint duplicate nodes. If a product page is B2B enquiry-only and price/ratings are unavailable, it may remain a useful ordinary search result with strong images and breadcrumbs but not a Product rich result.
- Run Google's Rich Results Test, inspect page in Search Console, then request indexing once if appropriate. Do not send mass repeat submissions, invent reviews or use spammy markup.
- Monitor actual indexing status and Image Search impressions separately; passing a live test alone does not establish indexed/ranked status.

## Verification gates

- `npm run build` checks all 38 product pages have the correct original pack ImageObject and SKU, valid WebPage and BreadcrumbList, no nested ineligible Product, 52 sitemap URLs, 76 original image references.
- The release keeps all original branded images byte-for-byte and does not delete files.
- Browser navigation/regression and production release HTTP checks must pass before any live fix is marked completed.
- Owner must repeat Google Search Console TEST LIVE URL on the Nova product after deployment and expand Product snippets/Enhancements to confirm Google's fresh interpretation.

**Important:** This is a structured-data enhancement correction, not an indexing or visibility guarantee. Google Search Console can take time to reflect the new content.
