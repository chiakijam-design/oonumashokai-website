(() => {
  'use strict';
  // Production only. Preview, local development and the old staging URL stay unmeasured.
  if (location.hostname !== 'oonumashokai.com' || location.pathname.startsWith('/website-renewal-')) return;
  if (navigator.globalPrivacyControl === true || navigator.doNotTrack === '1') return;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };
  const gtag = window.gtag;
  // No consent banner, no automatic consent, no analytics/advertising cookies.
  gtag('consent', 'default', {
    analytics_storage: 'denied', ad_storage: 'denied', ad_user_data: 'denied',
    ad_personalization: 'denied', functionality_storage: 'denied', personalization_storage: 'denied'
  });
  gtag('set', {
    ads_data_redaction: true, url_passthrough: false,
    allow_google_signals: false, allow_ad_personalization_signals: false,
    page_location: location.origin + location.pathname,
    page_referrer: (() => { try { return document.referrer ? new URL(document.referrer).origin + '/' : ''; } catch { return ''; } })()
  });
  const load = (src, attrs = {}) => {
    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    for (const [name, value] of Object.entries(attrs)) script.setAttribute(name, value);
    document.head.appendChild(script);
  };
  const start = () => {
    window.dataLayer.push({'gtm.start': Date.now(), event: 'gtm.js'});
    load('https://www.googletagmanager.com/gtm.js?id=GTM-M3FMQLLP');
    // Wait until the page is visible before loading nonessential measurement.
    if (!location.search) {
      // Cookie-free aggregate traffic/performance. No query URLs or SPA/hash tracking.
      load('https://static.cloudflareinsights.com/beacon.min.js', {
        type: 'module',
        'data-cf-beacon': JSON.stringify({token: '81348843bae54c5c8ea099b16bc6ffa6', spa: false})
      });
      window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
      window.clarity('consentv2', {analytics_Storage: 'denied', ad_Storage: 'denied'});
      load('https://www.clarity.ms/tag/yoaymaxfyd');
    }
  };
  const schedule = () => {
    if (window.requestIdleCallback) window.requestIdleCallback(start, {timeout: 2000});
    else window.setTimeout(start, 0);
  };
  if (document.readyState === 'complete') schedule();
  else window.addEventListener('load', schedule, {once: true});
  const event = name => gtag('event', name, {send_to: 'G-K2ZRJYXLEB'});
  document.addEventListener('click', e => {
    if (e.target instanceof Element && e.target.closest('a[href^="tel:"]')) event('phone_click');
  });
  // Dispatched only after Formspree confirms ok:true; no form data goes to analytics.
  document.addEventListener('oonuma:inquiry-success', () => event('generate_lead'));
})();
