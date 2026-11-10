import test from 'node:test';
import assert from 'node:assert/strict';
import {
  getMeasurementId,
  getAnalyticsChoice,
  hasAnalyticsConfiguration,
  sanitizeOrbitEvent,
  trackOrbitEvent,
  setOrbitAnalyticsChoice
} from '../../src/lib/analytics.js';

test('no GA4 property is assumed in the test environment', () => {
  assert.equal(getMeasurementId(), null);
  assert.equal(hasAnalyticsConfiguration(), false);
});

test('no browser consent is assumed', () => {
  assert.equal(getAnalyticsChoice(), 'unset');
});

test('events are strictly allowlisted', () => {
  assert.equal(sanitizeOrbitEvent('generate_lead', { name: 'Alice' }), null);
  assert.equal(sanitizeOrbitEvent('user_profile', { email: 'someone@example.com' }), null);
});

test('pageview removes query parameters and never sends an unknown path', () => {
  assert.deepEqual(sanitizeOrbitEvent('page_view', { page_path: '/products/?email=a%40b.com' }), {
    event: 'page_view', page_path: '/products/', page_title: 'Orbit Products'
  });
  assert.equal(sanitizeOrbitEvent('page_view', { page_path: '/contact/customer@example.com' }).page_path, '/');
});

test('search results only send a bounded count and never the query', () => {
  assert.deepEqual(sanitizeOrbitEvent('view_search_results', {
    result_count: 4,
    search_term: 'my-secret@email.com'
  }), { event: 'view_search_results', result_count: 4 });
  assert.equal(sanitizeOrbitEvent('view_search_results', { result_count: -1 }), null);
  assert.equal(sanitizeOrbitEvent('view_search_results', { result_count: 1e6 }), null);
});

test('product events ignore arbitrary names and descriptions', () => {
  assert.deepEqual(sanitizeOrbitEvent('view_item', {
    item_id: 'nova-hd40-1l',
    item_category: 'monograde',
    name: 'private name',
    email: 'private@example.com'
  }), {
    event: 'view_item',
    items: [{ item_id: 'nova-hd40-1l', item_category: 'monograde' }]
  });
});

test('product IDs are restricted to safe public slugs', () => {
  assert.equal(sanitizeOrbitEvent('select_item', { item_id: 'private@email.com' }), null);
  assert.equal(sanitizeOrbitEvent('view_item', { item_id: '../unsafe' }), null);
});

test('comparison counts are capped', () => {
  assert.deepEqual(sanitizeOrbitEvent('product_compare', { item_count: 3 }), {
    event: 'product_compare', item_count: 3
  });
  assert.equal(sanitizeOrbitEvent('product_compare', { item_count: 9 }), null);
});

test('email draft event never reports success, PII or lead generation', () => {
  assert.deepEqual(sanitizeOrbitEvent('enquiry_email_prepared', {
    enquiry_type: 'fleet',
    email: 'private@example.com',
    message: 'confidential'
  }), {
    event: 'enquiry_email_prepared', enquiry_type: 'fleet'
  });
});

test('without consent or GA4 config no telemetry can be sent', () => {
  assert.equal(trackOrbitEvent('page_view', { page_path: '/' }), false);
  assert.equal(setOrbitAnalyticsChoice('unknown'), false);
});
