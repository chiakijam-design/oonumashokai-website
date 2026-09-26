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
  window.dataLayer.push({'gtm.start': Date.now(), event: 'gtm.js'});
  load('https://www.googletagmanager.com/gtm.js?id=GTM-M3FMQLLP');
  const event = name => gtag('event', name, {send_to: 'G-K2ZRJYXLEB'});
  document.addEventListener('click', e => {
    if (e.target instanceof Element && e.target.closest('a[href^="tel:"]')) event('phone_click');
  });
  // Dispatched only after Formspree confirms ok:true; no form data goes to analytics.
  document.addEventListener('oonuma:inquiry-success', () => event('generate_lead'));
  // Clarity must not capture arbitrary URL parameters. Cookie setting is also OFF in its dashboard.
  if (!location.search) {
    window.clarity = window.clarity || function () { (window.clarity.q = window.clarity.q || []).push(arguments); };
    window.clarity('consentv2', {analytics_Storage: 'denied', ad_Storage: 'denied'});
    load('https://www.clarity.ms/tag/yoaymaxfyd');
  }
})();
