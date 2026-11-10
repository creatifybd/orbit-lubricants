import React, { useEffect, useState } from 'react';
import { Check, ShieldCheck, X } from 'lucide-react';
import {
  getAnalyticsChoice,
  hasAnalyticsConfiguration,
  initializeOrbitAnalytics,
  setOrbitAnalyticsChoice,
  trackOrbitEvent
} from '../lib/analytics';

/**
 * Optional first-party consent control.
 * When the owner has not configured GA4, there is no tracking script and
 * no redundant cookie banner. Users can reopen preferences from the footer.
 */
export function PrivacyPreferences() {
  const [choice, setChoice] = useState(getAnalyticsChoice);
  const [open, setOpen] = useState(choice === 'unset');

  useEffect(() => {
    if (choice === 'granted') initializeOrbitAnalytics();
    const handleOpen = () => setOpen(true);
    window.addEventListener('orbit:privacy-open', handleOpen);
    return () => window.removeEventListener('orbit:privacy-open', handleOpen);
  }, []);

  if (!hasAnalyticsConfiguration()) return null;

  const save = (allow) => {
    const next = allow ? 'granted' : 'denied';
    if (!setOrbitAnalyticsChoice(next)) return;
    setChoice(next);
    setOpen(false);
    if (allow) {
      const page = window.location.pathname;
      trackOrbitEvent('page_view', { page_path: page });
    }
  };

  return (
    <>
      {open && (
        <section className="orbit-consent-panel" role="region" aria-labelledby="orbit-consent-heading">
          <div className="orbit-consent-inner">
            <div className="orbit-consent-header">
              <span className="orbit-consent-symbol"><ShieldCheck size={21} /></span>
              <div>
                <h2 id="orbit-consent-heading">Your privacy preferences</h2>
                <p>
                  Essential website features work without analytics. If you allow analytics,
                  Orbit uses Google Analytics to understand visits and interactions with
                  product pages. We do not intentionally send names, emails, phone numbers
                  or enquiry messages as analytics events. Advertising tracking is off.
                </p>
              </div>
              {choice !== 'unset' && (
                <button type="button" onClick={() => setOpen(false)}
                  aria-label="Close analytics preferences" className="orbit-consent-close">
                  <X size={18} />
                </button>
              )}
            </div>
            <div className="orbit-consent-actions">
              <button type="button" className="orbit-consent-reject" onClick={() => save(false)}>
                Continue without analytics
              </button>
              <button type="button" className="orbit-consent-accept" onClick={() => save(true)}>
                <Check size={16} /> Allow analytics
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}
