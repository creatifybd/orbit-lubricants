/*
 * Orbit static SEO pages — consent-aware GA4 adapter.
 * Built into a content-hashed same-origin asset by scripts/build-seo.mjs.
 * Never load Google tags until explicit consent has been saved.
 * Shares preference key with the React website. Contains no user credentials.
 */
(() => {
  'use strict';
  const measurementId = '__ORBIT_MEASUREMENT_ID__';
  if (!/^G-[A-Z0-9]{6,18}$/.test(measurementId)) return;

  const key = 'orbit_analytics_consent_v1';
  const script = document.currentScript;
  if (!script) return;
  const { orbitKind: kind, orbitId: itemId = '', orbitCategory: categoryId = '', orbitItems: itemIds = '' } = script.dataset;
  const safeId = /^[a-z0-9-]{1,100}$/;
  const path = location.pathname;
  const productPage = kind === 'product' && safeId.test(itemId) && safeId.test(categoryId)
    && path === '/products/' + itemId + '/';
  const categoryPage = kind === 'category' && safeId.test(categoryId)
    && path === '/applications/' + categoryId + '/';
  if (!productPage && !categoryPage) return;

  const categoryProducts = categoryPage
    ? [...new Set(itemIds.split(',').filter((id) => safeId.test(id)))].slice(0, 30)
    : [];
  if (categoryPage && categoryProducts.length === 0) return;

  let choice = 'unset';
  try {
    const saved = localStorage.getItem(key);
    if (saved === 'granted' || saved === 'denied') choice = saved;
  } catch {
    // When storage is inaccessible, consent remains unset.
  }

  let tagLoaded = false;
  let sentThisPage = false;
  const dataLayer = () => (window.dataLayer = window.dataLayer || []);
  const gtag = (...args) => dataLayer().push(args);
  const consent = (analytics) => ({
    analytics_storage: analytics,
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied'
  });

  function sendPageEvents() {
    if (choice !== 'granted' || sentThisPage) return;
    sentThisPage = true;
    gtag('event', 'page_view', {
      page_path: path,
      page_title: document.title
    });
    if (productPage) {
      gtag('event', 'view_item', {
        items: [{ item_id: itemId, item_category: categoryId }]
      });
    } else {
      gtag('event', 'view_item_list', {
        item_list_id: categoryId,
        items: categoryProducts.map((id) => ({ item_id: id, item_category: categoryId }))
      });
    }
  }

  function enableAnalytics() {
    if (choice !== 'granted') return;
    if (!tagLoaded) {
      // Basic Consent Mode: do not even fetch the GA4 library before opt-in.
      gtag('consent', 'default', consent('denied'));
      gtag('consent', 'update', consent('granted'));
      gtag('js', new Date());
      gtag('config', measurementId, {
        send_page_view: false,
        allow_google_signals: false,
        allow_ad_personalization_signals: false
      });
      const tag = document.createElement('script');
      tag.async = true;
      tag.dataset.orbitAnalytics = 'ga4';
      tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
      document.head.appendChild(tag);
      tagLoaded = true;
    } else {
      gtag('consent', 'update', consent('granted'));
    }
    sendPageEvents();
  }

  if (choice === 'granted') enableAnalytics();

  function addPreferencesUI() {
    const style = document.createElement('style');
    style.textContent = [
      '.orbit-static-consent{position:fixed;z-index:10000;bottom:0;left:0;right:0;background:#09263e;color:white;padding:18px 16px;box-shadow:0 -8px 24px #0003}',
      '.orbit-static-consent-inner{max-width:1060px;margin:auto;display:flex;gap:20px;align-items:center;justify-content:space-between}',
      '.orbit-static-consent p{line-height:1.55;font-size:.84rem;margin:5px 0 0;color:#d6e5f0;max-width:700px}',
      '.orbit-static-consent h2{color:#fff;font-size:1.04rem;margin:0;line-height:1.4}',
      '.orbit-static-buttons{display:flex;gap:10px;flex-shrink:0}',
      '.orbit-static-buttons button{border-radius:8px;cursor:pointer;padding:10px 13px;min-height:42px;font-size:.84rem;font-weight:750}',
      '.orbit-static-deny{border:1px solid #a8c4d7;background:transparent;color:#fff}',
      '.orbit-static-allow{border:1px solid #f79b25;background:#f79b25;color:#102c40}',
      '.orbit-static-preferences{background:transparent;border:0;color:#fff;text-decoration:underline;cursor:pointer;font:inherit;padding:4px 6px;margin:12px 0 0}',
      '.orbit-static-consent button:focus-visible,.orbit-static-preferences:focus-visible{outline:3px solid #ffbf68;outline-offset:3px}',
      '@media(max-width:780px){.orbit-static-consent-inner{flex-direction:column;align-items:stretch}.orbit-static-buttons{justify-content:stretch}.orbit-static-buttons button{flex:1}}',
      '@media(max-width:440px){.orbit-static-buttons{flex-direction:column}}'
    ].join('');
    document.head.appendChild(style);

    const panel = document.createElement('section');
    panel.className = 'orbit-static-consent';
    panel.setAttribute('role', 'region');
    panel.setAttribute('aria-labelledby', 'orbit-static-consent-heading');
    panel.hidden = choice !== 'unset';

    const inner = document.createElement('div');
    inner.className = 'orbit-static-consent-inner';
    const copy = document.createElement('div');
    const heading = document.createElement('h2');
    heading.id = 'orbit-static-consent-heading';
    heading.textContent = 'Your privacy preferences';
    const description = document.createElement('p');
    description.textContent = 'Essential features work without analytics. With permission, Orbit uses Google Analytics to measure page and product interactions. We do not intentionally send personal information, enquiry text or search terms. Advertising tracking is off.';
    copy.append(heading, description);

    const controls = document.createElement('div');
    controls.className = 'orbit-static-buttons';
    const reject = document.createElement('button');
    reject.type = 'button';
    reject.className = 'orbit-static-deny';
    reject.textContent = 'Continue without analytics';
    const accept = document.createElement('button');
    accept.type = 'button';
    accept.className = 'orbit-static-allow';
    accept.textContent = 'Allow analytics';

    function saveChoice(value) {
      // A storage failure must NEVER be treated as permission to track.
      if (value === 'granted') {
        try {
          localStorage.setItem(key, value);
        } catch {
          return;
        }
      } else {
        try { localStorage.setItem(key, value); } catch { /* deny in-memory anyway */ }
      }
      choice = value;
      if (value === 'granted') enableAnalytics();
      else if (tagLoaded) gtag('consent', 'update', consent('denied'));
      panel.hidden = true;
      preferences.focus({ preventScroll: true });
    }

    reject.addEventListener('click', () => saveChoice('denied'));
    accept.addEventListener('click', () => saveChoice('granted'));
    controls.append(reject, accept);
    inner.append(copy, controls);
    panel.appendChild(inner);
    document.body.appendChild(panel);

    const preferences = document.createElement('button');
    preferences.type = 'button';
    preferences.className = 'orbit-static-preferences';
    preferences.textContent = 'Analytics preferences';
    preferences.addEventListener('click', () => {
      panel.hidden = false;
      reject.focus({ preventScroll: true });
    });
    const footer = document.querySelector('footer');
    (footer || document.body).appendChild(preferences);
    if (!panel.hidden) reject.focus({ preventScroll: true });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', addPreferencesUI, { once: true });
  } else {
    addPreferencesUI();
  }
})();
