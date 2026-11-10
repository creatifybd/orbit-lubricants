/**
 * Orbit Analytics — GA4 only after explicit visitor opt-in.
 * This is the basic consent implementation: nothing is sent or loaded prior to
 * analytics consent. Advertising consent is never granted by this code.
 *
 * Analytics property ID is public configuration, not a password.
 * Until VITE_GA4_MEASUREMENT_ID is set, this module makes no network requests.
 */
export const ANALYTICS_CONSENT_KEY = 'orbit_analytics_consent_v1';

const EVENT_NAMES = new Set([
  'page_view',
  'view_item_list',
  'select_item',
  'view_item',
  'view_search_results',
  'product_compare',
  'enquiry_email_prepared',
]);

const PAGE_PATHS = new Set(['/', '/products/', '/about/', '/contact/', '/finder/']);
const CATEGORY_KEY = /^[a-z0-9-]{1,64}$/;
const ITEM_KEY = /^[a-z0-9-]{1,100}$/;
const MAX_ITEMS = 3;

export function getMeasurementId() {
  const id = import.meta.env?.VITE_GA4_MEASUREMENT_ID || '';
  return /^G-[A-Z0-9]{6,18}$/.test(id) ? id : null;
}

export function hasAnalyticsConfiguration() {
  return Boolean(getMeasurementId());
}

export function getAnalyticsChoice() {
  try {
    const choice = window.localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return choice === 'granted' || choice === 'denied' ? choice : 'unset';
  } catch {
    return 'unset';
  }
}

function sanitizePath(raw) {
  const path = String(raw || '/').split(/[?#]/, 1)[0];
  // Do not forward query parameters, free-form paths or user-provided strings.
  return PAGE_PATHS.has(path) ? path : '/';
}

export function sanitizeOrbitEvent(name, payload = {}) {
  if (!EVENT_NAMES.has(name)) return null;
  const data = { event: name };
  if (name === 'page_view') {
    data.page_path = sanitizePath(payload.page_path);
    data.page_title = ({
      '/': 'Orbit Home',
      '/products/': 'Orbit Products',
      '/about/': 'About Orbit',
      '/contact/': 'Orbit Contact',
      '/finder/': 'Orbit Finder',
    })[data.page_path];
    return data;
  }
  if (name === 'view_search_results') {
    const resultCount = Number(payload.result_count);
    if (!Number.isInteger(resultCount) || resultCount < 0 || resultCount > 10000) return null;
    data.result_count = resultCount;
    // Never send a raw search query: people may enter private data.
    return data;
  }
  if (name === 'enquiry_email_prepared') {
    data.enquiry_type = ({
      distributor: 'distributor',
      industrial: 'industrial',
      fleet: 'fleet',
      technical: 'technical',
      other: 'other',
    })[payload.enquiry_type] || 'other';
    return data;
  }
  if (name === 'product_compare') {
    const count = Number(payload.item_count);
    if (!Number.isInteger(count) || count < 0 || count > MAX_ITEMS) return null;
    data.item_count = count;
    return data;
  }
  const id = String(payload.item_id || '');
  const category = String(payload.item_category || '');
  if (!ITEM_KEY.test(id) || (category && !CATEGORY_KEY.test(category))) return null;
  data.items = [{
    item_id: id,
    ...(category ? { item_category: category } : {}),
  }];
  return data;
}

let initialized = false;
let loaded = false;
function gtag(...args) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push(args);
}

function consentPayload(allowed) {
  return {
    analytics_storage: allowed ? 'granted' : 'denied',
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
  };
}

export function initializeOrbitAnalytics() {
  const id = getMeasurementId();
  if (!id || getAnalyticsChoice() !== 'granted' || typeof document === 'undefined') return false;
  if (!initialized) {
    // Consent is explicitly granted before even loading the Google tag.
    // No advanced consent mode/cookieless pre-consent pings.
    gtag('consent', 'default', consentPayload(false));
    gtag('consent', 'update', consentPayload(true));
    gtag('js', new Date());
    gtag('config', id, {
      send_page_view: false,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
    });
    initialized = true;
  }
  if (!loaded) {
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    script.dataset.orbitAnalytics = 'ga4';
    document.head.appendChild(script);
    loaded = true;
  }
  return true;
}

export function setOrbitAnalyticsChoice(choice) {
  if (choice !== 'granted' && choice !== 'denied') return false;
  try {
    window.localStorage.setItem(ANALYTICS_CONSENT_KEY, choice);
  } catch {
    // Refusal must remain possible even when localStorage is unavailable.
    if (choice === 'denied') {
      if (initialized) gtag('consent', 'update', consentPayload(false));
      return true;
    }
    // Never infer permission from a failure to persist consent.
    return false;
  }
  if (choice === 'denied') {
    if (initialized) gtag('consent', 'update', consentPayload(false));
  } else if (initializeOrbitAnalytics()) {
    // An existing gtag instance may have been denied after an earlier choice.
    gtag('consent', 'update', consentPayload(true));
  }
  return true;
}

export function trackOrbitEvent(name, payload) {
  if (!hasAnalyticsConfiguration() || getAnalyticsChoice() !== 'granted') return false;
  const safe = sanitizeOrbitEvent(name, payload);
  if (!safe || !initializeOrbitAnalytics()) return false;
  const { event, ...params } = safe;
  gtag('event', event, params);
  return true;
}
